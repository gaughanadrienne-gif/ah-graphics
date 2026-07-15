"""Build the Build Your Flock data file.

Merges live scrapers (SCCAS, Scotts Valley Feed, Alchemist, Metzer) + the
manually-refreshed Petfinder cache + hand-maintained curated cards into a single
build-your-flock-data.json that the Squarespace embed fetches.

Run daily by GitHub Actions. Petfinder is NOT fetched here (its endpoint blocks
datacenter IPs); it is read from petfinder_cache.json. If a live scraper fails on
a given run, that source's records are preserved from the previous output so the
page never loses data on a transient failure.
"""
import datetime
import json
from pathlib import Path
from zoneinfo import ZoneInfo

from scrapers import sccas, scotts_valley, alchemist, metzer

PACIFIC = ZoneInfo("America/Los_Angeles")
HERE = Path(__file__).parent
CURATED_PATH = HERE / "curated.json"
PETFINDER_CACHE = HERE / "petfinder_cache.json"
OUT_PATH = HERE.parent / "build-your-flock-data.json"


def in_chick_season(now=None):
    """Scotts Valley Feed sells chicks roughly March through August."""
    now = now or datetime.datetime.now(PACIFIC)
    return 3 <= now.month <= 8


def _safe(fn):
    try:
        return fn(), None
    except Exception as exc:  # noqa: BLE001 - record any scraper failure, never crash the build
        return None, str(exc)


def _load_json(path):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return None
    return None


def _prev_records(previous, section, source):
    """Pull a single source's records from a previous output (for failure preservation)."""
    if not previous:
        return []
    live = previous.get("sections", {}).get(section, {}).get("live", [])
    return [r for r in live if r.get("source") == source]


# (key, module, canonical source string, output section)
LIVE_PLAN = [
    ("sccas", sccas, "Santa Cruz County Animal Shelter", "shelters"),
    ("scotts_valley", scotts_valley, "Scotts Valley Feed", "feedStores"),
    ("alchemist", alchemist, "Alchemist Farm", "breeders"),
    ("metzer", metzer, "Metzer Farms", "breeders"),
]


def collect_live(previous=None):
    """Run every live scraper. On failure, preserve that source from the previous output."""
    errors = []
    out = {}
    for key, mod, source, section in LIVE_PLAN:
        data, err = _safe(lambda m=mod: m.parse(m.fetch_html()))
        if err:
            errors.append(f"{key}: {err}")
            out[key] = _prev_records(previous, section, source)
        else:
            out[key] = data
    return out, errors


def assemble(live, curated, petfinder_records, now=None, errors=None):
    """Pure assembly of the output structure from already-resolved inputs."""
    now = now or datetime.datetime.now(PACIFIC)
    errors = errors or []
    in_season = in_chick_season(now)

    sv_live = live.get("scotts_valley") or []
    if not in_season:
        sv_live = []  # hide stale chick data outside chick season

    return {
        "updated": now.isoformat(),
        "sections": {
            "shelters": {
                "live": (live.get("sccas") or []) + (petfinder_records or []),
                "curated": curated.get("shelters", []),
            },
            "feedStores": {
                "live": sv_live,
                "curated": curated.get("feedStores", []),
            },
            "breeders": {
                "live": (live.get("metzer") or []) + (live.get("alchemist") or []),
                "curated": curated.get("breeders", []),
            },
        },
        "status": {
            "scottsValley": "in-season" if in_season else "off-season",
            "scrapeErrors": errors,
        },
    }


def main():
    curated = json.loads(CURATED_PATH.read_text(encoding="utf-8"))
    pf = _load_json(PETFINDER_CACHE) or {"records": []}
    petfinder_records = pf.get("records", [])
    previous = _load_json(OUT_PATH)
    live, errors = collect_live(previous)
    data = assemble(live, curated, petfinder_records, errors=errors)
    OUT_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    s = data["sections"]
    print(
        f"Wrote {OUT_PATH.name} | shelters {len(s['shelters']['live'])} live "
        f"(incl {len(petfinder_records)} Petfinder), feedStores {len(s['feedStores']['live'])} live, "
        f"breeders {len(s['breeders']['live'])} live | errors: {errors}"
    )


if __name__ == "__main__":
    main()
