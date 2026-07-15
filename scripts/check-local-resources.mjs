import { readFile } from 'node:fs/promises';

const DATA_FILE = new URL('../local-resources-data.json', import.meta.url);
const TIMEOUT_MS = 15000;
const data = JSON.parse(await readFile(DATA_FILE, 'utf8'));
const items = data.categories.flatMap((category) =>
  category.items.filter((item) => item.website).map((item) => ({ ...item, category: category.label }))
);

async function check(item) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(item.website, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AmbitiousHarvestLinkCheck/1.0; +https://www.ambitiousharvest.com/local-resources)',
        accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.8'
      }
    });
    return {
      item,
      status: response.status,
      finalUrl: response.url,
      ok: response.status < 400 || [401, 403, 429].includes(response.status),
      hardFailure: [404, 410].includes(response.status)
    };
  } catch (error) {
    return { item, status: 0, finalUrl: '', ok: false, hardFailure: false, error: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

const unique = [...new Map(items.map((item) => [item.website, item])).values()];
const results = [];
for (let i = 0; i < unique.length; i += 6) {
  results.push(...await Promise.all(unique.slice(i, i + 6).map(check)));
}

for (const result of results) {
  const label = `${result.item.name} — ${result.item.website}`;
  if (result.ok) console.log(`OK ${result.status}: ${label}`);
  else if (result.hardFailure) console.error(`BROKEN ${result.status}: ${label}`);
  else console.warn(`REVIEW ${result.status || result.error}: ${label}`);
}

const reviews = results.filter((result) => !result.ok);
const failures = results.filter((result) => result.hardFailure);
console.log(`\nChecked ${results.length} unique resource links; ${failures.length} broken and ${reviews.length - failures.length} blocked or timed out.`);
if (failures.length) process.exitCode = 1;
