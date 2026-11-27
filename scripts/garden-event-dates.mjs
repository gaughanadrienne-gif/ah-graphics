export const TIMEZONE = 'America/Los_Angeles';

function localParts(date) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
}

export function localYmd(date) {
  const p = localParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

export function zonedIso(date, time = '00:00') {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  let guess = Date.UTC(y, m - 1, d, hh, mm);
  const p = localParts(new Date(guess));
  const represented = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  guess -= represented - guess;
  return new Date(guess).toISOString();
}

export function nextOccurrence(item, now) {
  let cursor = new Date(zonedIso(localYmd(now), item.start_time));
  if (cursor < now) cursor = new Date(cursor.getTime() + 86400000);
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
