import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../garden-events-data.json', import.meta.url);
const YIELD_FILE = new URL('../garden-events-source-yield.json', import.meta.url);
const REGISTRY = new URL('../garden-events-sources.json', import.meta.url);
const TIMEZONE = 'America/Los_Angeles';
const NOW = process.env.GARDEN_EVENTS_NOW ? new Date(process.env.GARDEN_EVENTS_NOW) : new Date();
const HORIZON = new Date(NOW.getTime() + 240 * 86400000);
const ALARM_AFTER = 3;

const existing = JSON.parse(await readFile(FILE, 'utf8'));
const registry = JSON.parse(await readFile(REGISTRY, 'utf8'));
const SOURCES = registry.sources;
const FETCHABLE = SOURCES.filter(s => s.adapter === 'ics' && s.tier === 'automatic');

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
  if (/u-pick|you-pick|harvest/.test(text)) out.push('u-pick');
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
    else if (key === 'URL') current.source_url = clean(value);
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

function relevant(event, source) {
  if (!event.title || !event.start || event.status === 'cancelled') return false;
  const start = new Date(event.start);
  if (start < NOW || start > HORIZON) return false;
  if (source.id === 'ah_google_calendar' && /gizdich ranch/i.test(event.title)) return false;
  if (source.id !== 'cnps') return true;
  return /santa cruz|aptos|cabrillo|watsonville|capitola|scotts valley|felton|ben lomond|boulder creek|online/i.test(`${event.title} ${event.venue} ${event.description}`);
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
let collected = priorEvents.filter(e => e.source_type !== 'recurring' && e.source_type !== 'ics' && new Date(e.end || e.start) >= NOW);
status.manual = { count: collected.length, note: 'carried from feed' };
const recurring = priorEvents.filter(e => e.source_type === 'recurring').map(nextOccurrence).filter(Boolean).map(e => normalizeEvent(e));
collected.push(...recurring);
status.recurring = { count: recurring.length, note: 'expanded to next occurrence' };

for (const source of FETCHABLE) {
  try {
    const response = await fetch(source.url, { headers: { 'user-agent': 'AmbitiousHarvestGardenEvents/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parseIcs(await response.text(), source).filter(e => relevant(e, source));
    collected.push(...parsed);
    status[source.id] = { count: parsed.length, note: 'fetched' };
  } catch (error) {
    warnings.push(`${source.name}: ${error.message}`);
    const carried = priorEvents.filter(e => e.source_type === 'ics' && (e.source_id === source.id || String(e.id).startsWith(`${source.id}-`)) && new Date(e.end || e.start) >= NOW);
    collected.push(...carried);
    status[source.id] = { count: 0, note: `fetch failed (${error.message}); carried ${carried.length} prior` };
  }
}

for (const source of SOURCES) {
  if (status[source.id]) continue;
  status[source.id] = { count: 0, note: `no ${source.adapter} adapter implemented` };
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
await writeFile(YIELD_FILE, `${JSON.stringify({ updated: today, alarm_after: ALARM_AFTER, total_events: events.length, sources: yieldSources }, null, 2)}\n`, 'utf8');

const before = JSON.stringify({ events: existing.events || [], warnings: existing.warnings || [] });
const after = JSON.stringify({ events, warnings });
const stamp = NOW.toISOString();
if (before === after && existing.updated) {
  console.log('Garden events are already current.');
} else {
  const output = { ...existing, timezone: TIMEZONE, updated: stamp, updated_at: stamp, events, warnings };
  await writeFile(FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Updated garden-events-data.json with ${events.length} events${warnings.length ? ` and ${warnings.length} source warning(s)` : ''}.`);
}
