// Validate the proposed feed before changing either of the public data files.
import { localYmd, nextOccurrence } from './garden-event-dates.mjs';

export const SCRAPED_TYPES = new Set(['ics', 'html', 'api']);
const title = event => String(event.title || '').trim().toLowerCase();
const day = event => localYmd(new Date(event.start));

function sourceOf(event, sourceIds) {
  if (event.source_id) return event.source_id;
  return sourceIds.find(id => String(event.id).startsWith(id + '-')) || '(unknown source)';
}

// Some ICS organizers reuse a UID across occurrences. Only a UID that identifies
// one record on both sides can establish a reschedule without its original date.
function matchOccurrence(prior, records, siblings) {
  const sameId = prior.id ? records.filter(record => record.id === prior.id) : [];
  const dated = sameId.find(record => day(record) === day(prior));
  if (dated) return dated;
  if (sameId.length === 1 && siblings.filter(record => record.id === prior.id).length === 1) return sameId[0];
  const equivalent = records.filter(record => day(record) === day(prior) && title(record) === title(prior));
  return equivalent.length === 1 ? equivalent[0] : undefined;
}

// Some official APIs show only events that have not started. Keep an already
// published occurrence visible until the same end instant used by the website.
// A confirmed cancellation or a fresh replacement from its own source wins.
export function carryOngoing(prior, source, observed, now) {
  const siblings = prior.filter(e => SCRAPED_TYPES.has(e.source_type) &&
    (e.source_id ? e.source_id === source : String(e.id).startsWith(source + '-')));
  const reported = [...observed.eligible, ...observed.cancelled];
  return siblings.filter(e => e.status !== 'cancelled' && new Date(e.start) < now &&
    new Date(e.end || e.start) >= now && !matchOccurrence(e, reported, siblings));
}

function validateFields(candidate) {
  if (!Array.isArray(candidate.events)) throw new Error('events is not an array');
  if (!candidate.updated || !Number.isFinite(Date.parse(candidate.updated))) throw new Error('missing or invalid updated timestamp');
  const seen = new Map();
  for (const event of candidate.events) {
    if (!Array.isArray(event.categories)) throw new Error('categories is not an array: ' + event.id);
    if (!event.start || !Number.isFinite(Date.parse(event.start))) throw new Error('unparseable start on ' + event.id);
    if (event.end && !Number.isFinite(Date.parse(event.end))) throw new Error('unparseable end on ' + event.id);
    const key = title(event) + '|' + String(event.start).slice(0, 10);
    if (seen.has(key)) throw new Error('double-listed event: ' + key + ' (' + seen.get(key) + ' and ' + event.id + ')');
    seen.set(key, event.id);
    for (const [field, value] of Object.entries(event)) {
      if (typeof value === 'string' && /[^\x20-\x7e]/.test(value)) throw new Error('non-ascii in ' + event.id + '.' + field + ': ' + JSON.stringify(value));
      if (/_url$/.test(field) && value && !/^(https?:\/\/|mailto:)/.test(value)) throw new Error('bad URL in ' + event.id + '.' + field + ': ' + value);
    }
  }
}

export function validateFeed(baseline, candidate, { now, horizon, sourceIds, evidence, titlesMatch }) {
  if (!Array.isArray(baseline?.events) || !baseline.events.length) throw new Error('missing committed baseline events');
  validateFields(candidate);
  const problems = [];
  const required = { recurring: 0, manual: 0 };
  const expired = [];
  const cancellations = [];
  const sourceCounts = new Map();
  const rows = candidate.events.filter(e => e.status !== 'cancelled');
  const activePrior = baseline.events.filter(e => e.status !== 'cancelled');
  const describe = e => e.id || e.title + ' ' + e.start;
  for (const event of activePrior) {
    if (!Number.isFinite(Date.parse(event.start)) || (event.end && !Number.isFinite(Date.parse(event.end)))) {
      problems.push('invalid committed date on ' + describe(event));
      continue;
    }
    if (event.source_type === 'recurring') {
      const weekdays = event.weekdays || [event.weekday];
      if (!Array.isArray(weekdays) || !weekdays.length || weekdays.some(d => !Number.isInteger(d) || d < 0 || d > 6)) {
        problems.push('invalid recurring weekdays on ' + describe(event));
        continue;
      }
      const next = nextOccurrence(event, now);
      if (next) required.recurring++;
      if (!next) {
        if (event.season_end) expired.push(describe(event));
        else problems.push('unexpandable recurring definition ' + describe(event));
      } else if (!rows.some(e => e.source_type === 'recurring' && e.id === event.id && Date.parse(e.start) === Date.parse(next.start) && Date.parse(e.end) === Date.parse(next.end))) {
        problems.push('missing next recurring occurrence ' + describe(event) + ' at ' + next.start);
      }
      continue;
    }
    const scraped = SCRAPED_TYPES.has(event.source_type);
    const source = sourceOf(event, sourceIds);
    const observed = scraped && evidence.get(source);
    // The calendar displays ongoing events through END. Fresh adapters also
    // apply a forward discovery horizon; manual and fallback records do not.
    const start = new Date(event.start), end = new Date(event.end || event.start);
    if (end < now || (observed && start > horizon)) {
      expired.push(describe(event));
      continue;
    }
    if (!scraped) {
      required.manual++;
      const manual = rows.filter(e => e.source_type !== 'recurring' && !SCRAPED_TYPES.has(e.source_type));
      if (!manual.some(e => event.id ? e.id === event.id : title(e) === title(event) && day(e) === day(event))) {
        problems.push('missing manual event ' + describe(event));
      }
      continue;
    }
    const siblings = activePrior.filter(e => SCRAPED_TYPES.has(e.source_type) && sourceOf(e, sourceIds) === source);
    const own = rows.filter(e => sourceOf(e, sourceIds) === source);
    sourceCounts.set(source, { eligiblePrior: (sourceCounts.get(source)?.eligiblePrior || 0) + 1, candidate: own.length, observed: observed ? observed.eligible.length : 'unavailable' });
    const carried = own.some(e => (event.id ? e.id === event.id : title(e) === title(event)) && Date.parse(e.start) === Date.parse(event.start));
    if (observed) {
      const reported = matchOccurrence(event, [...observed.eligible, ...observed.cancelled], siblings);
      if (reported?.status === 'cancelled') {
        if (matchOccurrence(event, own, siblings)) problems.push(source + ': organizer-cancelled occurrence is still active: ' + describe(event));
        cancellations.push(source + ': ' + describe(event));
        continue;
      }
      if (matchOccurrence(event, own, siblings)) continue;
      // A fetched event may have been collapsed into its next series card,
      // or merged by the generator into a manual/recurring card from another
      // source. Only accept that representation when this source supplied it.
      if (reported) {
        const representative = observed.representatives.get(reported) || reported;
        if (rows.some(e => day(e) === day(representative) && titlesMatch(e.title, representative.title))) continue;
      }
    } else if (carried) {
      continue;
    }
    problems.push(source + ': missing ' + describe(event) + ' at ' + event.start);
  }
  if (!evidence.size) problems.push('no organizer fetch passed its source gate');
  if (!rows.length) problems.push('no active events');
  const summary = 'previous=' + baseline.events.length + ', candidate=' + candidate.events.length +
    ', required recurring=' + required.recurring + ', required manual=' + required.manual +
    ', aged out=' + JSON.stringify(expired) + ', organizer cancellations=' + JSON.stringify(cancellations) +
    ', source counts=' + JSON.stringify(Object.fromEntries(sourceCounts));
  if (problems.length) throw new Error('Garden Events continuity failed: ' + problems.join('; ') + '. ' + summary);
  return summary;
}
