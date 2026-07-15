import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../garden-events-data.json', import.meta.url);
const TIMEZONE = 'America/Los_Angeles';
const NOW = process.env.GARDEN_EVENTS_NOW ? new Date(process.env.GARDEN_EVENTS_NOW) : new Date();
const HORIZON = new Date(NOW.getTime() + 240 * 86400000);
const SOURCES = [
  {
    id: 'ah_google_calendar',
    name: 'Ambitious Harvest Google Calendar',
    url: 'https://calendar.google.com/calendar/ical/c_0fe029dcc32ff09993862a18cfab7dbeedb01b442f6f4b381d21f8534aea0d39%40group.calendar.google.com/public/basic.ics',
    categories: ['learn', 'shop', 'volunteer', 'tour', 'experience']
  },
  {
    id: 'ucsc_agroecology',
    name: 'UCSC Center for Agroecology',
    url: 'https://events.ucsc.edu/organizer/center-for-agroecology/?ical=1',
    categories: ['u-pick', 'tour', 'learn', 'experience']
  },
  {
    id: 'cnps',
    name: 'California Native Plant Society',
    url: 'https://www.cnps.org/events/list/?ical=1',
    categories: ['learn', 'plant-sale', 'tour', 'volunteer']
  }
];

const existing = JSON.parse(await readFile(FILE, 'utf8'));
const clean = value => String(value || '').replace(/\\n/g, ' ').replace(/\\([,;])/g, '$1').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

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
  return out.length ? [...new Set(out)] : fallback;
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
  return events.map((e, i) => ({
    id: `${source.id}-${e.uid || i}`, source_id: source.id,
    title: e.title, start: e.start, end: e.end || e.start, venue: e.venue || '', city: '',
    categories: inferCategories(e, source.categories), description: e.description || '', all_day: !!e.all_day,
    source_url: e.source_url || source.url, organizer: source.name,
    status: e.status === 'cancelled' ? 'cancelled' : 'confirmed', source_type: 'ics'
  }));
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
const priorEvents = existing.events || [];
let collected = priorEvents.filter(e => e.source_type !== 'recurring' && e.source_type !== 'ics' && new Date(e.end || e.start) >= NOW);
collected.push(...priorEvents.filter(e => e.source_type === 'recurring').map(nextOccurrence).filter(Boolean));

for (const source of SOURCES) {
  try {
    const response = await fetch(source.url, { headers: { 'user-agent': 'AmbitiousHarvestGardenEvents/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    collected.push(...parseIcs(await response.text(), source).filter(e => relevant(e, source)));
  } catch (error) {
    warnings.push(`${source.name}: ${error.message}`);
    collected.push(...priorEvents.filter(e => e.source_type === 'ics' && (e.source_id === source.id || String(e.id).startsWith(`${source.id}-`)) && new Date(e.end || e.start) >= NOW));
  }
}

const events = dedupe(collected);
const before = JSON.stringify({ events: priorEvents, warnings: existing.warnings || [] });
const after = JSON.stringify({ events, warnings });
if (before === after) {
  console.log('Garden events are already current.');
} else {
  const output = { ...existing, timezone: TIMEZONE, updated_at: NOW.toISOString(), events, warnings };
  await writeFile(FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Updated garden-events-data.json with ${events.length} events${warnings.length ? ` and ${warnings.length} source warning(s)` : ''}.`);
}
