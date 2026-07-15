"""Manual Petfinder cache refresh.

The Petfinder GraphQL endpoint (https://psl.petfinder.com/graphql) sits behind an
Akamai WAF that blocks datacenter / automated IPs, so it CANNOT be fetched from
GitHub Actions. Petfinder data is therefore served from a committed cache file
(petfinder_cache.json) that the daily build merges. The daily build never fetches
Petfinder live.

To refresh the cache (do this from a real browser session, periodically):
  1. While logged in / browsing petfinder.com in a normal browser, POST the
     SearchAnimal query used in scrapers/petfinder.py, paginating through all
     pages, and save the combined raw "animals" array to a file, e.g. raw.json.
     (The same query/headers are documented at the top of scrapers/petfinder.py.)
  2. Run:  py refresh_petfinder_cache.py raw.json
  3. Commit the updated petfinder_cache.json.

parse() applies the local-city filter and excludes the directly-scraped SCCAS,
so the cache only ever contains local, non-duplicate adoptable birds.
"""
import datetime
import json
import sys
from pathlib import Path

from scrapers import petfinder

CACHE_PATH = Path(__file__).parent / "petfinder_cache.json"


def refresh(raw_path, updated=None):
    raw = Path(raw_path).read_text(encoding="utf-8")
    records = petfinder.parse(raw)
    updated = updated or datetime.date.today().isoformat()
    CACHE_PATH.write_text(
        json.dumps({"updated": updated, "records": records}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"wrote {CACHE_PATH.name} with {len(records)} records (updated {updated})")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: py refresh_petfinder_cache.py <raw_animals.json>")
        sys.exit(1)
    refresh(sys.argv[1])
