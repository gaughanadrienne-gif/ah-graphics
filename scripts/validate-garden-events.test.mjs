import test from 'node:test';
import assert from 'node:assert/strict';
import { nextOccurrence } from './garden-event-dates.mjs';
import { carryOngoing, validateFeed } from './validate-garden-events.mjs';

const now = new Date('2026-11-25T21:38:00Z');
const horizon = new Date(now.getTime() + 240 * 86400000);
const manual = { id: 'curated', title: 'Garden tour', start: '2026-11-28T18:00:00Z', categories: ['tour'] };
const popup = { id: 'ucsc-1', title: 'Produce Pop-Up', source_type: 'api', source_id: 'ucsc',
  start: '2026-11-25T19:00:00Z', end: '2026-11-25T23:00:00Z', categories: ['market'] };
const future = { ...popup, start: '2026-12-02T19:00:00Z', end: '2026-12-02T23:00:00Z' };
const weekly = { id: 'market', title: 'Weekly market', weekdays: [3], start_time: '11:00', end_time: '14:00',
  source_type: 'recurring', start: '2026-11-25T19:00:00Z', end: '2026-11-25T22:00:00Z', categories: ['market'] };
const observed = (eligible = [], cancelled = []) => ({ eligible, cancelled, representatives: new Map() });
const wrapper = events => ({ events, updated: now.toISOString() });
function check(previous, next, report = observed(), when = now) {
  const evidence = new Map([['dormant', observed()]]);
  if (report) evidence.set('ucsc', report);
  return validateFeed(wrapper(previous), wrapper(next), { now: when, horizon, sourceIds: ['ucsc','dormant'], evidence,
    titlesMatch: (left, right) => left.toLowerCase() === right.toLowerCase() });
}

test('a legitimate 12-to-11 decrease after a one-off ends passes', () => {
  const keep = Array.from({length:11}, (_, i) => ({...manual, id:'manual-'+i, title:'Garden tour '+i}));
  const after = new Date('2026-11-25T23:00:01Z');
  assert.deepEqual(carryOngoing([popup], 'ucsc', observed(), after), []);
  assert.match(check([...keep, popup], keep, observed(), after), /aged out=.*ucsc-1/);
});

test('the Wednesday produce pop-up remains visible during operating hours and at its end', () => {
  for (const at of [now, new Date(popup.end)]) {
    assert.deepEqual(carryOngoing([popup], 'ucsc', observed(), at), [popup]);
    assert.throws(() => check([manual, popup], [manual], observed(), at), /ucsc: missing ucsc-1/);
    assert.doesNotThrow(() => check([manual, popup], [manual, popup], observed(), at));
  }
  assert.deepEqual(carryOngoing([popup], 'ucsc', observed([popup]), now), []);
});

test('multi-day all-day uses its supplied end instant and respects a confirmed cancellation', () => {
  const multi = {...popup, all_day:true, start:'2026-11-24T08:00:00Z', end:'2026-11-27T08:00:00Z'};
  const cancelled = {...multi, status:'cancelled'};
  assert.deepEqual(carryOngoing([multi], 'ucsc', observed(), now), [multi]);
  assert.deepEqual(carryOngoing([multi], 'ucsc', observed([], [cancelled]), now), []);
  assert.match(check([manual, multi], [manual], observed([], [cancelled])), /organizer cancellations=.*ucsc-1/);
  assert.throws(() => check([multi], [multi], observed([], [cancelled])), /organizer-cancelled occurrence is still active/);
});

test('recurring IDs must advance to the same calculated occurrence unless their season ends', () => {
  const rolled = nextOccurrence(weekly, now);
  assert.equal(rolled.start, '2026-12-02T19:00:00.000Z');
  assert.doesNotThrow(() => check([weekly], [rolled]));
  assert.throws(() => check([weekly, manual], [manual]), /missing next recurring occurrence market/);
  assert.throws(() => check([weekly], [weekly]), /missing next recurring occurrence/);
  assert.doesNotThrow(() => check([{...weekly, season_end:'2026-11-25'}, manual], [manual]));
});

test('legacy source-less and ID-less manual entries live through their end', () => {
  const legacy = {...popup, id:undefined, source_type:undefined, source_id:undefined};
  assert.doesNotThrow(() => check([legacy], [legacy]));
  assert.throws(() => check([legacy, manual], [manual]), /missing manual event/);
});

test('an unavailable adapter must retain its own live entries; unrelated replacements cannot mask a loss', () => {
  const legacy = {...future}; delete legacy.source_id;
  assert.doesNotThrow(() => check([legacy], [legacy], null));
  assert.throws(() => check([legacy, manual], [manual], null), /ucsc: missing ucsc-1/);
  assert.throws(() => check([future], [{...future,source_id:'other',id:'other-1'}]), /ucsc: missing ucsc-1/);
});

test('a stable organizer ID can reschedule; provider ID churn can match the same occurrence', () => {
  const moved = {...future,start:'2026-12-09T19:00:00Z',end:'2026-12-09T23:00:00Z'};
  assert.doesNotThrow(() => check([future], [moved], observed([moved])));
  const rekeyed = {...future,id:'ucsc-new'};
  assert.doesNotThrow(() => check([future], [rekeyed], observed([rekeyed])));
});

test('a reused ICS UID cannot stand in for an unreported second date', () => {
  const later = {...future,source_type:'ics',start:'2026-12-04T19:00:00Z',end:'2026-12-04T20:00:00Z'};
  assert.throws(() => check([future,later], [future], observed([future])), /at 2026-12-04/);
  assert.doesNotThrow(() => check([future,later], [future], observed([future],[{...later,status:'cancelled'}])));
});

test('fresh organizer evidence permits an actual collapsed series or merged duplicate', () => {
  const earlier = {...future,id:'ucsc-earlier',start:'2026-11-28T19:00:00Z',end:'2026-11-28T23:00:00Z',series:true};
  const report = observed([earlier, future]); report.representatives.set(future, earlier);
  assert.doesNotThrow(() => check([future], [earlier], report));
  const enriched = {...future,id:'hand-typed',source_type:'manual',source_id:'other'};
  assert.doesNotThrow(() => check([future], [enriched], observed([future])));
  assert.throws(() => check([future], [enriched], observed()), /ucsc: missing/);
});

test('empty candidates and mass unexplained loss fail, including source counts in diagnostics', () => {
  assert.throws(() => check([manual, future, weekly], []), /missing manual event.*missing ucsc-1.*missing next recurring occurrence.*no active events.*source counts=/);
  assert.throws(() => check([future,weekly], [manual]), /missing ucsc-1.*missing next recurring/);
});

test('existing format and duplicate guards remain active', () => {
  for (const [fields, expected] of [[{categories:'market'},/categories/],[{start:'invalid'},/unparseable start/],
    [{source_url:'javascript:x'},/bad URL/],[{title:'caf\u00e9'},/non-ascii/]]) {
    assert.throws(() => check([manual], [{...manual,...fields}]), expected);
  }
  assert.throws(() => check([manual],[manual,{...manual,id:'duplicate'}]), /double-listed/);
});
