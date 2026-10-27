const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('garden-events-embed.html', 'utf8');
const source = html.slice(html.indexOf('  function pad2'), html.indexOf('  function card(e)'));
let blob;
const context = {Intl, Date, URLSearchParams, Blob, setTimeout: fn => fn(), URL: {createObjectURL: b => {blob=b; return 'blob:test'}, revokeObjectURL(){}}, document: {createElement: () => ({click(){},remove(){}}),body: {appendChild(){}}}};
vm.createContext(context);
vm.runInContext(source, context);
async function exported(extra){context.downloadIcs({id:'export-test',title:'Test, garden; day',source_url:'https://example.com',...extra});return blob.text()}
(async()=>{
  for(const tz of ['UTC','America/New_York','Asia/Tokyo','America/Los_Angeles']){
    process.env.TZ=tz;
    let ics=await exported({start:'2026-07-15T13:30',end:'2026-07-15T17:30'});
    assert.match(ics,/DTSTART:20260715T203000Z\r\nDTEND:20260716T003000Z/);
    ics=await exported({start:'2026-12-15T13:30',end:'2026-12-15T17:30'});
    assert.match(ics,/DTSTART:20261215T213000Z\r\nDTEND:20261216T013000Z/);
    ics=await exported({start:'2026-10-27T20:30:00Z',end:'2026-10-27T17:30:00-07:00'});
    assert.match(ics,/DTSTART:20261027T203000Z\r\nDTEND:20261028T003000Z/);
    assert.match(ics,/UID:export-test@ambitiousharvest.com/);
    assert.match(ics,/SUMMARY:Test\\, garden\\; day/);
    ics=await exported({start:'2026-12-31',end:'2026-12-31',all_day:true});
    assert.match(ics,/DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);
    ics=await exported({start:'2026-07-15',end:'2026-07-17',all_day:true});
    assert.match(ics,/DTSTART;VALUE=DATE:20260715\r\nDTEND;VALUE=DATE:20260718/);
    ics=await exported({start:'2026-11-01T01:30',end:'2026-11-01T02:30'});
    assert.match(ics,/DTSTART:20261101T083000Z\r\nDTEND:20261101T103000Z/);
    ics=await exported({start:'2026-03-08T02:30',end:'2026-03-08T04:00'});
    assert.match(ics,/DTSTART:20260308T103000Z\r\nDTEND:20260308T110000Z/);
    const google=new URL(context.googleUrl({start:'2026-07-15T13:30',end:'2026-07-15T17:30'}));
    assert.equal(google.searchParams.get('ctz'),'America/Los_Angeles');
    assert.equal(google.searchParams.get('dates'),'20260715T133000/20260715T173000');
  }
  console.log('Calendar exports pass: 4 host timezones, winter/summer, UTC/offset inputs, DST fold/gap, all-day exclusive end, escaping/UID, Google Calendar.');
})().catch(e=>{console.error(e);process.exitCode=1});
