import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../garden-events-data.json', import.meta.url);
const YIELD_FILE = new URL('../garden-events-source-yield.json', import.meta.url);
const REGISTRY = new URL('../garden-events-sources.json', import.meta.url);
/* The scheduled Action writes the live feed, which is why the defaults above
   point at it. A local run must not: set GARDEN_EVENTS_OUTPUT (and optionally
   GARDEN_EVENTS_YIELD) to a staging path and diff before promoting. */
const OUTPUT = process.env.GARDEN_EVENTS_OUTPUT ? new URL(`file:///${String(process.env.GARDEN_EVENTS_OUTPUT).replace(/\\/g, '/')}`) : FILE;
const YIELD_OUTPUT = process.env.GARDEN_EVENTS_YIELD ? new URL(`file:///${String(process.env.GARDEN_EVENTS_YIELD).replace(/\\/g, '/')}`) : YIELD_FILE;
const TIMEZONE = 'America/Los_Angeles';
const NOW = process.env.GARDEN_EVENTS_NOW ? new Date(process.env.GARDEN_EVENTS_NOW) : new Date();
const HORIZON = new Date(NOW.getTime() + 240 * 86400000);
const ALARM_AFTER = 3;
const REQUEST_HEADERS = { 'user-agent': 'AmbitiousHarvestGardenEvents/1.0 (+https://ambitiousharvest.com)', 'accept': '*/*' };
/* Anything fetched from a source, as opposed to hand-typed or expanded from a
   recurrence rule. These are rebuilt every run and carried forward only when
   their source fetch fails. */
const SCRAPED_TYPES = new Set(['ics', 'html', 'api']);

/* GARDEN_EVENTS_INPUT lets a staging run replay against a candidate feed, which
   is how the carry-forward and idempotency paths get tested without touching
   the live file. */
const INPUT = process.env.GARDEN_EVENTS_INPUT ? new URL(`file:///${String(process.env.GARDEN_EVENTS_INPUT).replace(/\\/g, '/')}`) : FILE;

const existing = JSON.parse(await readFile(INPUT, 'utf8'));
const registry = JSON.parse(await readFile(REGISTRY, 'utf8'));
const SOURCES = registry.sources;

/* ---------------------------------------------------------------------------
   Brand-safe text. Ambitious Harvest copy is ASCII only: no em-dashes, no
   curly quotes, no ellipsis characters. Sources hand us all three, so every
   string that reaches the feed goes through asciiText(). Time and date ranges
   become "12:30 to 5:00 PM" rather than a dash of any kind.
--------------------------------------------------------------------------- */
const DASHES = '\\u2010-\\u2015\\u2212\\uFE58\\uFE63\\uFF0D';

function asciiText(value) {
  let s = String(value == null ? '' : value);
  if (!s) return '';
  s = s.normalize('NFKC');
  s = s.replace(/[\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g, ' ');
  s = s.replace(/[\u200b-\u200d\ufeff]/g, '');
  s = s.replace(/[\u2018\u2019\u201a\u201b\u2032]/g, "'");
  s = s.replace(/[\u201c\u201d\u201e\u201f\u2033]/g, '"');
  s = s.replace(/\u2026/g, '...');
  s = s.replace(/[\u2022\u00b7\u2027]/g, '-');
  // Unspaced dash between two values is a range: "12:30-5:00", "May 2-Nov 21".
  s = s.replace(new RegExp(`(\\S)[${DASHES}](\\S)`, 'g'), '$1 to $2');
  // Spaced dash is parenthetical. AH brand replaces it with a comma.
  s = s.replace(new RegExp(`\\s+[${DASHES}]\\s+`, 'g'), ', ');
  // Any dash left over (leading, trailing, doubled) becomes a plain hyphen.
  s = s.replace(new RegExp(`[${DASHES}]`, 'g'), '-');
  // ASCII hyphen used as a time range: "8:00 AM-noon" -> "8:00 AM to noon".
  s = s.replace(/(\d(?::\d{2})?\s*(?:[AaPp]\.?[Mm]\.?)?)\s*-\s*(?=\d{1,2}(?::\d{2})?\s*(?:[AaPp]\.?[Mm]\.?|\b)|noon|midnight)/g, '$1 to ');
  // Anything still outside printable ASCII is dropped rather than shipped.
  s = s.replace(/[^\x20-\x7e]/g, '');
  return s.replace(/\s+/g, ' ').replace(/\s+([,;.])/g, '$1').trim();
}

const clean = value => asciiText(String(value || '').replace(/\\n/g, ' ').replace(/\\([,;])/g, '$1').replace(/<[^>]*>/g, ' '));

/* URLs must never go through asciiText. Its range rule rewrites a digit-hyphen
   -digit run as " to ", which turns .../2026-08-01/ into .../2026 to 08 to 01/
   and breaks the link. Strip whitespace and anything non-printable, nothing else. */
const cleanUrl = value => String(value == null ? '' : value).replace(/\\([,;])/g, '$1').replace(/[^\x21-\x7e]/g, '').trim();

/* categories must reach the browser as a real JSON array. Older writers left
   behind a stringified list ("['market']"), so both shapes are accepted. */
function toCategories(value, fallback = ['experience']) {
  const finish = list => {
    const out = [...new Set(list.map(v => asciiText(v).toLowerCase()).filter(Boolean))];
    return out.length ? out : fallback.slice();
  };
  if (Array.isArray(value)) return finish(value);
  if (typeof value === 'string') {
    const raw = value.trim();
    const bracketed = raw.match(/^\[([\s\S]*)\]$/);
    const body = bracketed ? bracketed[1] : raw;
    return finish(body.split(',').map(p => p.trim().replace(/^['"]+|['"]+$/g, '')));
  }
  return fallback.slice();
}

const TEXT_FIELDS = ['title', 'description', 'venue', 'city', 'address', 'organizer', 'recurrence', 'series', 'note', 'notes', 'schedule', 'season'];

function normalizeEvent(event, fallback) {
  const out = { ...event };
  for (const field of TEXT_FIELDS) {
    if (typeof out[field] === 'string') out[field] = asciiText(out[field]);
  }
  out.categories = toCategories(out.categories, fallback || ['experience']);
  return out;
}

function localParts(date) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
}

function localYmd(date) {
  const p = localParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function zonedIso(date, time = '00:00') {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  let guess = Date.UTC(y, m - 1, d, hh, mm);
  const p = localParts(new Date(guess));
  const represented = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  guess -= represented - guess;
  return new Date(guess).toISOString();
}

function nextOccurrence(item) {
  let cursor = new Date(zonedIso(localYmd(NOW), item.start_time));
  if (cursor < NOW) cursor = new Date(cursor.getTime() + 86400000);
  for (let i = 0; i < 370; i++, cursor = new Date(cursor.getTime() + 86400000)) {
    const ymd = localYmd(cursor);
    if (item.season_start && ymd < item.season_start) continue;
    if (item.season_end && ymd > item.season_end) return null;
    const weekday = new Date(`${ymd}T12:00:00Z`).getUTCDay();
    const weekdays = item.weekdays || [item.weekday];
    if (!weekdays.includes(weekday)) continue;
    if (item.ordinal && Math.ceil(Number(ymd.slice(-2)) / 7) !== item.ordinal) continue;
    return { ...item, start: zonedIso(ymd, item.start_time), end: zonedIso(ymd, item.end_time), status: 'confirmed', source_type: 'recurring' };
  }
  return null;
}

function unfoldIcs(text) { return text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/); }

function inferCategories(event, fallback = ['experience']) {
  const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
  const out = [];
  if (/u-pick|you-pick|harvest(?!\s*fest)/.test(text)) out.push('u-pick');
  if (/plant sale|nursery sale/.test(text)) out.push('plant-sale');
  if (/farmers.? market|market day/.test(text)) out.push('market');
  if (/swap|exchange/.test(text)) out.push('swap');
  if (/volunteer|workday|restoration|weeding|planting day/.test(text)) out.push('volunteer');
  if (/tour|open garden|garden walk/.test(text)) out.push('tour');
  if (/class|workshop|talk|lecture|learn|demonstration/.test(text)) out.push('learn');
  return out.length ? [...new Set(out)] : toCategories(fallback);
}

function parseIcsDate(key, value) {
  if (!value) return null;
  if (/^\d{8}$/.test(value)) return zonedIso(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`);
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return null;
  const stamp = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  return m[7] === 'Z' ? `${stamp}Z` : zonedIso(`${m[1]}-${m[2]}-${m[3]}`, `${m[4]}:${m[5]}`);
}

function parseIcs(text, source) {
  const rows = unfoldIcs(text);
  const events = [];
  let current = null;
  for (const row of rows) {
    if (row === 'BEGIN:VEVENT') { current = {}; continue; }
    if (row === 'END:VEVENT') { if (current) events.push(current); current = null; continue; }
    if (!current) continue;
    const split = row.indexOf(':');
    if (split < 0) continue;
    const rawKey = row.slice(0, split);
    const key = rawKey.split(';')[0];
    const value = row.slice(split + 1);
    if (key === 'DTSTART') { current.start = parseIcsDate(rawKey, value); current.all_day = /VALUE=DATE/.test(rawKey); }
    else if (key === 'DTEND') current.end = parseIcsDate(rawKey, value);
    else if (key === 'SUMMARY') current.title = clean(value);
    else if (key === 'DESCRIPTION') current.description = clean(value);
    else if (key === 'LOCATION') current.venue = clean(value);
    else if (key === 'URL') current.source_url = cleanUrl(value);
    else if (key === 'UID') current.uid = clean(value);
    else if (key === 'STATUS') current.status = value.toLowerCase();
  }
  return events.map((e, i) => normalizeEvent({
    id: `${source.id}-${e.uid || i}`, source_id: source.id,
    title: e.title, start: e.start, end: e.end || e.start, venue: e.venue || '', city: '',
    categories: inferCategories(e, source.categories), description: e.description || '', all_day: !!e.all_day,
    source_url: e.source_url || source.url, organizer: source.name,
    status: e.status === 'cancelled' ? 'cancelled' : 'confirmed', source_type: 'ics'
  }, toCategories(source.categories)));
}

/* ---------------------------------------------------------------------------
   HTML helpers, shared by the page adapters.
--------------------------------------------------------------------------- */
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };

function decodeEntities(value) {
  return String(value == null ? '' : value)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (NAMED_ENTITIES[n.toLowerCase()] !== undefined ? NAMED_ENTITIES[n.toLowerCase()] : m));
}

/* Decoded but NOT yet ASCII-folded. Time ranges have to be read before
   asciiText() rewrites "10am - 12pm" into "10am to 12pm". */
const htmlText = value => decodeEntities(String(value == null ? '' : value)
  /* A <br> or a closed block ends a sentence. Without this, "...at the Farm<br>
     Enjoy a reception" reaches the card as "at the Farm Enjoy a reception". */
  .replace(/<br\s*\/?>|<\/(?:p|div|h[1-6]|li|tr)>/gi, ' . ')
  .replace(/<[^>]*>/g, ' '))
  .replace(/\s+/g, ' ')
  .replace(/\s*\.(?:\s*\.)+/g, '.')
  .replace(/([.!?:;,])\s*\./g, '$1')
  .replace(/\s+\./g, '.')
  .replace(/^\.\s*/, '')
  .trim();

/* Source descriptions run long. Cut at the last complete sentence that fits,
   so a card never ends mid-word. */
function summarize(text, limit = 320) {
  const s = String(text || '').trim();
  if (s.length <= limit) return s;
  const window = s.slice(0, limit);
  const sentence = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (sentence > limit * 0.5) return window.slice(0, sentence + 1);
  const space = window.lastIndexOf(' ');
  return `${window.slice(0, space > 0 ? space : limit).replace(/[,;:]$/, '')}...`;
}

const MONTHS = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
const MONTH_PATTERN = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';

function monthNumber(name) {
  const key = String(name || '').toLowerCase().replace(/\./g, '');
  for (const full of Object.keys(MONTHS)) if (full.startsWith(key.slice(0, 3))) return MONTHS[full];
  return null;
}

/* A page that writes "August 30" without a year means the next August 30 that
   is still ahead of us. Pick the first year inside the publishing horizon
   rather than assuming the current one, so a December page does not resolve
   January to eleven months ago. */
function resolveYmd(month, day, year) {
  const pad = n => String(n).padStart(2, '0');
  const candidates = year ? [Number(year)] : [Number(localYmd(NOW).slice(0, 4)), Number(localYmd(NOW).slice(0, 4)) + 1];
  for (const y of candidates) {
    const ymd = `${y}-${pad(month)}-${pad(day)}`;
    const start = new Date(zonedIso(ymd, '23:59'));
    if (start >= NOW && new Date(zonedIso(ymd, '00:00')) <= HORIZON) return ymd;
  }
  return year ? `${year}-${pad(month)}-${pad(day)}` : null;
}

/* First two clock times in a block of decoded text become start and end. */
function readTimes(text) {
  const found = [...String(text || '').matchAll(/(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?/gi)].map(m => {
    let hour = Number(m[1]) % 12;
    if (m[3].toLowerCase() === 'p') hour += 12;
    return `${String(hour).padStart(2, '0')}:${m[2] || '00'}`;
  });
  return { start: found[0] || null, end: found[1] || null };
}

/* ---------------------------------------------------------------------------
   Title matching, used both to collapse a repeating series and to reconcile a
   scraped event against a hand-typed card for the same thing. Organisation
   words are dropped so "First Saturday Tour" and "First Saturday Tour at the
   Arboretum" are recognised as one event.
--------------------------------------------------------------------------- */
const TITLE_STOPWORDS = new Set(['the', 'a', 'an', 'at', 'of', 'and', 'on', 'in', 'for', 'with', 'to', 'our', 'your', 'ucsc', 'uc', 'santa', 'cruz', 'arboretum', 'botanic', 'class', 'session', 'event', 'events', 'annual']);

function titleTokens(title) {
  return new Set(asciiText(title).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ')
    .map(t => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t))
    .filter(t => t && !TITLE_STOPWORDS.has(t)));
}

function titlesMatch(a, b) {
  const left = titleTokens(a);
  const right = titleTokens(b);
  if (left.size < 2 || right.size < 2) return asciiText(a).toLowerCase() === asciiText(b).toLowerCase();
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  if (shared < 2) return false;
  return shared / Math.min(left.size, right.size) >= 0.7;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* A source that publishes every occurrence of a weekly series would otherwise
   fill the page with identical cards. The README asks for one series card with
   the next occurrence, so three or more matching titles collapse to the
   earliest and carry a plain-language recurrence line. */
function collapseSeries(events) {
  const groups = [];
  for (const event of events) {
    const group = groups.find(g => titlesMatch(g[0].title, event.title));
    if (group) group.push(event); else groups.push([event]);
  }
  const out = [];
  for (const group of groups) {
    group.sort((a, b) => new Date(a.start) - new Date(b.start));
    const days = group.map(e => Math.round(new Date(e.start).getTime() / 86400000));
    const gaps = days.slice(1).map((d, i) => d - days[i]);
    /* Only an even cadence collapses. An irregular run of same-named events
       (a monthly tour that skips a month) is a set of distinct dates, and
       hiding all but the first would drop real events off the page. */
    if (group.length < 3 || !gaps.every(g => g === gaps[0])) { out.push(...group); continue; }
    const weekday = WEEKDAY_NAMES[new Date(`${localYmd(new Date(group[0].start))}T12:00:00Z`).getUTCDay()];
    const cadence = gaps[0] === 7 ? `Weekly on ${weekday}s` : gaps[0] === 14 ? `Every other ${weekday}` : `Every ${gaps[0]} days`;
    out.push({ ...group[0], recurrence: `${cadence}, next occurrence shown`, series: true });
  }
  return out;
}

/* ---------------------------------------------------------------------------
   UCSC Arboretum. The events page is a hand-authored WordPress page rather
   than a calendar plugin, so there is no feed and no repeating card markup.
   Two shapes carry every dated event on it:
     1. the curated "Upcoming Events" list, "August 1: First Saturday Tour"
     2. a section heading that leads with a full date, "August 30, 2026 from
        10am - 12pm at the Arboretum", whose title is the heading above it
   Both are parsed, then reconciled against each other. Because the structure
   is editorial and can be rewritten at any time, this is a monitored-tier
   source and nothing publishes unless gateArboretum() passes.
--------------------------------------------------------------------------- */
const ARBORETUM_STRUCTURAL = /^(upcoming events|recurring special events|members only special events|summertime at the arboretum|in the gardens|hours|admission)/i;
const ARBORETUM_DATED = new RegExp(`^(${MONTH_PATTERN})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?\\s*(?:[:\\-‐-―]|\\bfrom\\b)\\s*(.*)$`, 'i');

/* The blocks belonging to one event: up to three, stopping at the heading that
   starts the next section so a card cannot borrow the following event's text. */
function detailWindow(blocks, at) {
  const out = [];
  for (const block of blocks.slice(at + 1, at + 4)) {
    if (/^h[1-4]$/.test(block.tag) && (ARBORETUM_STRUCTURAL.test(block.text) || ARBORETUM_DATED.test(block.text))) break;
    out.push(block);
  }
  return out;
}

function arboretumRegion(html) {
  const start = html.indexOf('entry-content');
  const end = html.indexOf('</main>');
  return start > -1 && end > start ? html.slice(start, end) : html;
}

function parseArboretumHtml(html, source) {
  const region = arboretumRegion(html);
  const summaryAt = region.search(/>\s*Upcoming Events\s*</i);
  const blocks = [...region.matchAll(/<(h[1-4]|p)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
    tag: m[1].toLowerCase(), inner: m[2], text: htmlText(m[2]), index: m.index
  })).filter(b => b.text);

  const records = [];
  let lastHeading = null;

  blocks.forEach((block, i) => {
    const match = block.text.match(ARBORETUM_DATED);
    if (!match) {
      if (/^h[1-4]$/.test(block.tag) && block.text.length >= 6 && block.text.length <= 140 && !ARBORETUM_STRUCTURAL.test(block.text)) lastHeading = block;
      return;
    }
    const month = monthNumber(match[1]);
    const day = Number(match[2]);
    if (!month || !day) return;
    const ymd = resolveYmd(month, day, match[3]);
    if (!ymd) return;
    /* "August 30, 2026 from 10am - 12pm at the Arboretum" is a date line, not a
       title. Fall back to the heading immediately above it. */
    const tail = match[4].trim();
    const titleSource = /^(?:\d|at\b|from\b)/i.test(tail) || tail.length < 5 ? (lastHeading ? lastHeading.text : '') : tail;
    if (!titleSource) return;
    /* The curated list is a run of consecutive one-line links, so the blocks
       after a summary entry are OTHER events, not its detail. Only a detail
       section may supply text to a summary entry. */
    const fromSummary = summaryAt > -1 && block.index >= summaryAt && block.index < summaryAt + 3000;
    const following = fromSummary ? [] : detailWindow(blocks, i);
    records.push({
      ymd,
      title: titleSource,
      times: readTimes(`${block.text} ${following.map(b => b.text).join(' ')}`),
      description: summarize(following.filter(b => b.tag === 'p').map(b => b.text).join(' ')),
      index: block.index,
      fromSummary
    });
  });

  /* A summary-list entry carries a date but no detail. Pull its times and
     description from the section whose heading names the same event. */
  for (const record of records) {
    if (!record.fromSummary) continue;
    const section = blocks.find(b => /^h[1-4]$/.test(b.tag) && !ARBORETUM_STRUCTURAL.test(b.text) && b.index > (summaryAt + 3000) && titlesMatch(b.text, record.title));
    if (!section) continue;
    const at = blocks.indexOf(section);
    const detail = detailWindow(blocks, at);
    if (!record.times.start) record.times = readTimes(detail.map(b => b.text).join(' '));
    if (!record.description) record.description = summarize(detail.filter(b => b.tag === 'p').map(b => b.text).join(' '));
  }

  /* Same event listed twice (summary plus detail section) becomes one record,
     keeping whichever copy actually found a time. */
  const merged = [];
  for (const record of records) {
    const twin = merged.find(m => m.ymd === record.ymd && titlesMatch(m.title, record.title));
    if (!twin) { merged.push(record); continue; }
    if (!twin.times.start && record.times.start) twin.times = record.times;
    if (record.description.length > twin.description.length) twin.description = record.description;
    if (record.title.length > twin.title.length) twin.title = record.title;
  }

  const fallback = toCategories(source.default_categories || ['experience']);
  return merged.map(record => {
    const timed = !!record.times.start;
    const registration = (region.slice(record.index, record.index + 4000)
      .match(/href="(https?:\/\/(?:www\.)?(?:zeffy|eventbrite|ucsc\.edu\/[^"]*registration|tickets)[^"]*)"/i) || [])[1];
    const event = {
      id: `${source.id}-${record.ymd}-${asciiText(record.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)}`,
      source_id: source.id,
      title: record.title,
      start: zonedIso(record.ymd, record.times.start || '00:00'),
      end: zonedIso(record.ymd, record.times.end || record.times.start || '00:00'),
      venue: 'UCSC Arboretum & Botanic Garden',
      city: 'Santa Cruz',
      categories: inferCategories({ title: record.title, description: record.description }, fallback),
      description: record.description,
      all_day: !timed,
      source_url: cleanUrl(source.url),
      organizer: source.name,
      status: 'confirmed',
      source_type: 'html'
    };
    /* The embed renders recurrence text in place of a clock time when all_day
       is set, so an undated-hours event says so rather than reading 12:00 AM. */
    if (!timed) event.recurrence = 'Open during garden hours, confirm before visiting';
    if (registration) event.registration_url = cleanUrl(decodeEntities(registration));
    return normalizeEvent(event, fallback);
  });
}

/* Monitored tier: publish only if the page still looks like the page we parsed.
   A silent structure change has to read as zero, not as garbage on the site. */
function gateArboretum(events, body) {
  const region = arboretumRegion(body);
  if (!/>\s*Upcoming Events\s*</i.test(region)) return { ok: false, reason: 'Upcoming Events block not found; page structure changed' };
  if (!events.length) return { ok: false, reason: 'page parsed but no dated events matched' };
  if (events.length > 25) return { ok: false, reason: `implausible yield (${events.length}); parser is over-matching` };
  for (const event of events) {
    if (!event.title || event.title.length < 5 || event.title.length > 140) return { ok: false, reason: `bad title: ${JSON.stringify(event.title)}` };
    if (ARBORETUM_STRUCTURAL.test(event.title)) return { ok: false, reason: `structural heading captured as a title: ${event.title}` };
    if (!event.start || isNaN(new Date(event.start))) return { ok: false, reason: `unparseable date on ${event.title}` };
  }
  return { ok: true };
}

/* ---------------------------------------------------------------------------
   The Events Calendar REST API (events.ucsc.edu). Restores UCSC Center for
   Agroecology: its ?ical=1 export sits behind a Cloudflare bot challenge that
   a plain fetch cannot clear, but the site's own public wp-json endpoint
   answers a standard request and returns better structured data than the ICS
   ever did. Same host, same publisher, no evasion.
--------------------------------------------------------------------------- */
function parseTribeRest(payload, source) {
  const fallback = toCategories(source.default_categories || ['experience']);
  return (payload.events || []).map(item => {
    const description = summarize(clean(htmlText(item.description || item.excerpt || '')));
    const startYmd = String(item.start_date || '').slice(0, 10);
    const endYmd = String(item.end_date || '').slice(0, 10) || startYmd;
    const startTime = String(item.start_date || '').slice(11, 16) || '00:00';
    const endTime = String(item.end_date || '').slice(11, 16) || startTime;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startYmd)) return null;
    const venue = item.venue && item.venue.venue ? clean(item.venue.venue) : '';
    return normalizeEvent({
      id: `${source.id}-${item.id || `${startYmd}-${clean(item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`}`,
      source_id: source.id,
      title: clean(htmlText(item.title)),
      start: item.all_day ? zonedIso(startYmd) : zonedIso(startYmd, startTime),
      end: item.all_day ? zonedIso(endYmd) : zonedIso(endYmd, endTime),
      venue,
      city: item.venue && item.venue.city ? clean(item.venue.city) : '',
      address: item.venue && item.venue.address ? clean(item.venue.address) : '',
      categories: inferCategories({ title: htmlText(item.title), description }, fallback),
      description,
      all_day: !!item.all_day,
      source_url: cleanUrl(item.url || source.url),
      registration_url: item.website ? cleanUrl(item.website) : undefined,
      /* "$20 - $30" is a range, not a parenthetical, so it is normalized here
         before asciiText() turns the dash into a comma. */
      cost: item.cost ? clean(htmlText(item.cost).replace(/\s*[‐-―−-]\s*/g, ' to ')) : undefined,
      organizer: source.name,
      status: item.status === 'publish' ? 'confirmed' : 'tentative',
      source_type: 'api'
    }, fallback);
  }).filter(Boolean);
}

const ADAPTERS = {
  ics: { parse: parseIcs },
  tribe_rest: { json: true, parse: parseTribeRest },
  arboretum_html: { parse: parseArboretumHtml, gate: gateArboretum }
};
const FETCHABLE = SOURCES.filter(s => ADAPTERS[s.adapter] && s.tier !== 'review');

/* Editorial exclusions that apply to any source whose organizer is already
   on-topic. The keyword gate in README.md is for the City directory, where the
   organizer is not; a botanic garden's own calendar needs the opposite test. */
const OFF_TOPIC = /\bwedding|venue rental|facility rental|board meeting|staff meeting|advisory committee|closed for|closure notice|parking permit\b/i;

function relevant(event, source) {
  if (!event.title || !event.start || event.status === 'cancelled') return false;
  const start = new Date(event.start);
  if (start < NOW || start > HORIZON) return false;
  if (source.id === 'ah_google_calendar' && /gizdich ranch/i.test(event.title)) return false;
  if (source.adapter !== 'ics' && OFF_TOPIC.test(`${event.title} ${event.description}`)) return false;
  if (source.id !== 'cnps') return true;
  return /santa cruz|aptos|cabrillo|watsonville|capitola|scotts valley|felton|ben lomond|boulder creek|online/i.test(`${event.title} ${event.venue} ${event.description}`);
}

/* ---------------------------------------------------------------------------
   Reconcile a freshly scraped event against what is already collected.

   The brief is "prefer the scraped record but never double-list". Two rules
   implement that without ever losing a hand-typed card:
     - a match against a RECURRING card leaves the recurring card alone. It is
       the rolling definition the next run expands from; overwriting it with a
       single dated instance would break the series permanently.
     - a match against a hand-typed one-off is enriched IN PLACE: scraped
       values win field by field, but the original id and source_type survive,
       so the card is still carried forward if the source later goes quiet.
       Deleting it outright is how a page silently shrinks.
--------------------------------------------------------------------------- */
const OVERLAY_FIELDS = ['title', 'start', 'end', 'description', 'venue', 'city', 'address', 'source_url', 'registration_url', 'cost', 'recurrence', 'categories', 'all_day'];

function mergeScraped(collected, scraped) {
  let added = 0;
  let mergedCount = 0;
  for (const event of scraped) {
    const day = localYmd(new Date(event.start));
    const twin = collected.find(e => e.start && localYmd(new Date(e.start)) === day && titlesMatch(e.title, event.title));
    if (!twin) { collected.push(event); added += 1; continue; }
    mergedCount += 1;
    if (twin.source_type === 'recurring') continue;
    for (const field of OVERLAY_FIELDS) {
      const value = event[field];
      if (value === undefined || value === null || value === '') continue;
      if (Array.isArray(value) && !value.length) continue;
      twin[field] = value;
    }
    twin.source_id = event.source_id;
    twin.enriched_from = event.source_id;
  }
  return { added, merged: mergedCount };
}

function dedupe(events) {
  const seen = new Set();
  return events.filter(e => {
    const key = `${clean(e.title).toLowerCase()}|${String(e.start).slice(0,16)}|${clean(e.venue).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));
}

const warnings = [];
const status = {};
const priorEvents = (existing.events || []).map(e => normalizeEvent(e));
let collected = priorEvents.filter(e => e.source_type !== 'recurring' && !SCRAPED_TYPES.has(e.source_type) && new Date(e.end || e.start) >= NOW);
status.manual = { count: collected.length, note: 'carried from feed' };
const recurring = priorEvents.filter(e => e.source_type === 'recurring').map(nextOccurrence).filter(Boolean).map(e => normalizeEvent(e));
collected.push(...recurring);
status.recurring = { count: recurring.length, note: 'expanded to next occurrence' };

const carryPrior = source => priorEvents.filter(e => SCRAPED_TYPES.has(e.source_type)
  && (e.source_id === source.id || String(e.id).startsWith(`${source.id}-`))
  && new Date(e.end || e.start) >= NOW);

for (const source of FETCHABLE) {
  const adapter = ADAPTERS[source.adapter];
  try {
    const response = await fetch(source.url, { headers: REQUEST_HEADERS, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.text();
    let parsed = adapter.parse(adapter.json ? JSON.parse(body) : body, source).filter(e => relevant(e, source));
    parsed = collapseSeries(parsed);
    /* Monitored tier never publishes on trust. No gate means no publish. */
    if (source.tier === 'monitored') {
      const gate = adapter.gate ? adapter.gate(parsed, body, source) : { ok: false, reason: 'no validation gate for this adapter' };
      if (!gate.ok) {
        warnings.push(`${source.name}: validation gate failed, ${gate.reason}`);
        const carried = carryPrior(source);
        collected.push(...carried);
        status[source.id] = { count: 0, note: `validation gate failed (${gate.reason}); carried ${carried.length} prior` };
        continue;
      }
    }
    if (source.adapter === 'ics') {
      collected.push(...parsed);
      status[source.id] = { count: parsed.length, note: 'fetched' };
    } else {
      const result = mergeScraped(collected, parsed);
      status[source.id] = { count: parsed.length, note: `fetched; ${result.added} new, ${result.merged} matched an existing card` };
    }
  } catch (error) {
    warnings.push(`${source.name}: ${error.message}`);
    const carried = carryPrior(source);
    collected.push(...carried);
    status[source.id] = { count: 0, note: `fetch failed (${error.message}); carried ${carried.length} prior` };
  }
}

for (const source of SOURCES) {
  if (status[source.id]) continue;
  status[source.id] = { count: 0, note: source.blocked ? `blocked: ${source.blocked}` : `no ${source.adapter} adapter implemented` };
}

const events = dedupe(collected);

/* ---- per-source yield tracker (state only, no alerting) ---- */
let priorYield = { sources: {} };
try { priorYield = JSON.parse(await readFile(YIELD_FILE, 'utf8')); } catch { /* first run */ }
const today = localYmd(NOW);
const yieldSources = {};
for (const key of Object.keys(status)) {
  const source = SOURCES.find(s => s.id === key);
  const prior = (priorYield.sources || {})[key] || {};
  const count = status[key].count;
  yieldSources[key] = {
    name: source ? asciiText(source.name) : key,
    tier: source ? source.tier : 'internal',
    adapter: source ? source.adapter : key,
    last_count: count,
    zero_streak: count > 0 ? 0 : (prior.zero_streak || 0) + 1,
    last_nonzero: count > 0 ? today : (prior.last_nonzero || null),
    last_note: asciiText(status[key].note)
  };
}
await writeFile(YIELD_OUTPUT, `${JSON.stringify({ updated: today, alarm_after: ALARM_AFTER, total_events: events.length, sources: yieldSources }, null, 2)}\n`, 'utf8');

const before = JSON.stringify({ events: existing.events || [], warnings: existing.warnings || [] });
const after = JSON.stringify({ events, warnings });
const stamp = NOW.toISOString();
if (before === after && existing.updated && OUTPUT.href === FILE.href) {
  console.log('Garden events are already current.');
} else {
  const output = { ...existing, timezone: TIMEZONE, updated: stamp, updated_at: stamp, events, warnings };
  await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${events.length} events to ${OUTPUT.pathname}${warnings.length ? ` with ${warnings.length} source warning(s)` : ''}.`);
}
