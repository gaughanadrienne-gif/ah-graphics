"""
Petfinder Bird scraper for Build Your Flock.

Uses the unauthenticated GraphQL endpoint at psl.petfinder.com (the same one
used by Petfinder's own pet-scroller widget).  No API key required, but the
endpoint is behind Akamai/Imperva so fetch_html() must be called from a context
that already has valid browser cookies (e.g. via the claude-in-chrome extension).
For fully automated use, wire this up with Playwright in non-headless mode.

Records match the SCCAS shelter shape:
    source, name, animal, id, detail, link
"""

import json
import re
import requests

_ENDPOINT = "https://psl.petfinder.com/graphql"
_QUERY = (
    'query SearchAnimal($pagination:PaginationInfoInput!,$filters:AnimalSearchFiltersInput!)'
    '{searchAnimal(pagination:$pagination sort:{field:"animal_type",order:"desc"} filters:$filters)'
    '{totalCount animals{animalId animalName physical{breed{primary}} publicUrl{url}}}}'
)
_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
    ),
    "Origin": "https://www.petfinder.com",
    "Referer": "https://www.petfinder.com/",
}

# Cities within ~50 miles of Santa Cruz (URL-normalized: hyphens -> spaces, lower)
_LOCAL_CITIES = {
    "santa cruz", "watsonville", "capitola", "scotts valley", "aptos",
    "soquel", "felton", "ben lomond", "boulder creek", "live oak",
    "freedom", "la selva beach", "corralitos", "davenport",
    "monterey", "salinas", "marina", "seaside", "pacific grove",
    "castroville", "prunedale",
    "gilroy", "morgan hill", "san martin", "hollister", "san juan bautista",
    "los gatos", "campbell",
}

_BREED_MAP = {
    "chicken": "chicken",
    "duck": "duck",
    "goose": "goose",
}

# Trailing org-ID suffix pattern, e.g. -ca625, -tx12, -ar115
_ORG_ID_RE = re.compile(r"-[a-z]{2}\d+$", re.IGNORECASE)


def _build_payload(from_page: int) -> dict:
    return {
        "query": _QUERY,
        "variables": {
            "filters": {
                "animal_type": ["Bird"],
                "breeds": ["Chicken", "Duck", "Goose"],
                "adoption_status": "adoptable",
            },
            "pagination": {"fromPage": from_page, "pageSize": 100},
        },
    }


def fetch_html(timeout: int = 30) -> str:
    """
    POST the Petfinder GraphQL query, paginate through all results, and return
    the combined raw animal objects as a JSON string (a list).

    Named fetch_html for interface uniformity with the other scrapers even though
    it returns JSON.

    Note: psl.petfinder.com is behind Akamai WAF. This call will return 403
    from a plain server IP. It works when called from inside a real browser
    session (e.g. via claude-in-chrome or a non-headless Playwright instance
    that has already visited petfinder.com).
    """
    session = requests.Session()
    session.headers.update(_HEADERS)

    # Page 0 — get totalCount
    resp = session.post(_ENDPOINT, json=_build_payload(0), timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    search = data["data"]["searchAnimal"]
    total_count: int = search["totalCount"]
    all_animals: list = list(search["animals"])

    total_pages = (total_count + 99) // 100
    for page_num in range(1, total_pages):
        resp = session.post(_ENDPOINT, json=_build_payload(page_num), timeout=timeout)
        resp.raise_for_status()
        page_data = resp.json()
        all_animals.extend(page_data["data"]["searchAnimal"]["animals"])

    return json.dumps(all_animals)


def _humanize_org_slug(slug: str) -> str:
    """
    Turn an org slug into a human-readable name.
    e.g. 'santa-cruz-spca-ca99' -> 'Santa Cruz Spca'
         'the-spca-for-monterey-county-ca1164' -> 'The Spca For Monterey County'
    """
    if not slug:
        return "Adoptable via Petfinder"
    # Strip trailing org-ID suffix (-ca625, -tx12, etc.)
    cleaned = _ORG_ID_RE.sub("", slug)
    return cleaned.replace("-", " ").title() or "Adoptable via Petfinder"


def _parse_url(url: str):
    """
    Parse state, city, org_slug from a Petfinder animal URL path.

    URL format (relative or absolute):
        bird/{name-uuid}/{state}/{city}/{org-slug}
    Returns (state, city, org_slug) or (None, None, None) on failure.
    """
    # Strip protocol+host if present
    path = url
    if "://" in url:
        path = "/" + url.split("://", 1)[1].split("/", 1)[1]
    # Split on slashes, drop leading empty
    parts = [p for p in path.strip("/").split("/") if p]
    # Expected: ['bird', '{name-uuid}', '{state}', '{city}', '{org-slug}']
    if len(parts) < 5 or parts[0].lower() != "bird":
        return None, None, None
    state = parts[2].lower()
    city_raw = parts[3].lower()
    city = city_raw.replace("-", " ")
    org_slug = parts[4].lower()
    return state, city, org_slug


def parse(raw: str) -> list:
    """
    Accept the JSON string produced by fetch_html() (a list of raw animal dicts)
    and return a filtered, de-duped list of records matching the SCCAS shelter shape:
        source, name, animal, id, detail, link

    Filtering rules:
    - Only animals whose breed.primary maps to chicken/duck/goose
    - Only records in California (state == 'ca')
    - Only records in the local city set (~50 mi of Santa Cruz)
    - Excludes SCCAS (org-slug contains 'santa-cruz-county-animal-shelter' or 'ca625')
    - De-duplicates by animalId
    """
    try:
        animals = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return []

    if not isinstance(animals, list):
        return []

    records = []
    seen_ids = set()

    for a in animals:
        try:
            animal_id = a.get("animalId")
            if not animal_id or animal_id in seen_ids:
                continue

            # Map breed to animal type
            breed_primary = (
                (a.get("physical") or {})
                .get("breed") or {}
            ).get("primary", "")
            animal_type = _BREED_MAP.get(breed_primary.lower())
            if not animal_type:
                continue

            url = (a.get("publicUrl") or {}).get("url", "")
            if not url:
                continue

            # Ensure absolute URL
            if not url.startswith("http"):
                url = "https://www.petfinder.com/" + url.lstrip("/")

            state, city, org_slug = _parse_url(url)
            if state is None:
                continue

            # Local CA only
            if state != "ca":
                continue
            if city not in _LOCAL_CITIES:
                continue

            # Exclude SCCAS
            if "santa-cruz-county-animal-shelter" in org_slug or "ca625" in org_slug:
                continue

            name = (a.get("animalName") or "").strip() or "Available bird"
            source = _humanize_org_slug(org_slug)

            # City title-case, state upper
            city_display = city.title()
            state_display = state.upper()
            detail = f"{breed_primary} in {city_display}, {state_display}"

            seen_ids.add(animal_id)
            records.append({
                "source": source,
                "name": name,
                "animal": animal_type,
                "id": animal_id,
                "detail": detail,
                "link": url,
            })

        except Exception:
            # Be defensive: skip malformed records
            continue

    return records
