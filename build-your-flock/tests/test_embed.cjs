// Run with node build-your-flock/tests/test_embed.cjs from the repository root.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('build-your-flock-embed.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function render(data) {
  const nodes = {};
  const document = {
    createElement() { return {set textContent(v) {this.innerHTML = String(v);}}; },
    getElementById(id) { return nodes[id] ||= {}; }
  };
  vm.runInNewContext(script, {document, window:{__BF_DATA:data}});
  return nodes;
}
const source = JSON.parse(fs.readFileSync('build-your-flock-data.json','utf8'));
let nodes = render(source);
assert.match(nodes['bf-breeders'].innerHTML, /Alchemist Farm/);
assert.match(nodes['bf-breeders'].innerHTML, /Current availability could not be verified/);
assert.doesNotMatch(nodes['bf-breeders'].innerHTML, /Chicks are available now|generally \$10/);
assert.match(nodes['bf-breeders'].innerHTML, /buy-rare-chicken-chicks-and-hatching-eggs-online-alchemist-farm/);
source.status.scrapeErrors = ['metzer: connection failed'];
source.status.sources = {'Metzer Farms':{available:false}};
nodes = render(source);
assert.doesNotMatch(nodes['bf-breeders'].innerHTML, /options with upcoming hatch dates/);
assert.match(nodes['bf-breeders'].innerHTML, /Current availability could not be verified/);
source.status.scrapeErrors = [];
source.status.sources = {'Metzer Farms':{available:true}};
nodes = render(source);
assert.match(nodes['bf-breeders'].innerHTML, /options with upcoming hatch dates/);
console.log('Flock embed: failed-source notices, inventory suppression and recovery passed.');
