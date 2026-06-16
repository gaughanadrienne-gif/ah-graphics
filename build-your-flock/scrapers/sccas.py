import re
import requests
from bs4 import BeautifulSoup

URL = "https://24petconnect.com/SantaCruzAdoptable?at=OTHER"
ID_RE = re.compile(r"\(?(A\d{5,})\)?")
HEADERS = {"User-Agent": "Mozilla/5.0 (AmbitiousHarvest BuildYourFlock)"}


def fetch_html(url=URL, timeout=30):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def _animal_type(text):
    t = text.lower()
    if "duck" in t:
        return "duck"
    if "goose" in t or "geese" in t or "gander" in t:
        return "goose"
    if any(k in t for k in ("chicken", "rooster", "hen", "fowl", "poultry")):
        return "chicken"
    return None


def parse(html):
    soup = BeautifulSoup(html, "html.parser")
    records = []
    seen = set()

    for grid in soup.find_all("div", class_="gridResult"):
        # Extract breed/species from the Breed field
        breed_span = grid.find("span", class_="text_Breed")
        if not breed_span:
            continue
        breed_text = breed_span.get_text(strip=True)
        animal = _animal_type(breed_text)
        if not animal:
            continue

        # Extract name and animal ID from the Name field
        name_span = grid.find("span", class_="text_Name")
        if not name_span:
            continue
        raw_name = name_span.get_text(strip=True)

        m = ID_RE.search(raw_name)
        animal_id = m.group(1) if m else None

        # Name is everything before the ID parenthetical
        if m:
            name = raw_name[: m.start()].strip().rstrip("*").strip()
        else:
            name = raw_name.strip()

        if not name:
            name = "Available bird"

        # Deduplicate by ID (or name if no ID)
        key = animal_id or name
        if key in seen:
            continue
        seen.add(key)

        # Build detail string from all visible text in the card
        detail = " ".join(grid.get_text(" ", strip=True).split())

        # Build link — 24PetConnect uses JS onclick; construct detail URL from known pattern
        # onclick="Details('SantaCruzAdoptable', 'SNCR', 'A331672')"
        onclick = grid.get("onclick", "")
        onclick_match = re.search(r"Details\('([^']+)',\s*'([^']+)',\s*'([^']+)'\)", onclick)
        if onclick_match and animal_id:
            link = (
                f"https://24petconnect.com/{onclick_match.group(1)}"
                f"?animalID={animal_id}"
            )
        else:
            link = URL

        records.append(
            {
                "source": "Santa Cruz County Animal Shelter",
                "name": name,
                "animal": animal,
                "id": animal_id,
                "detail": detail,
                "link": link,
            }
        )

    return records
