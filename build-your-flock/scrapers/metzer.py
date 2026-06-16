"""
Metzer Farms waterfowl availability scraper.

Source: https://www.metzerfarms.com/available.html

Page structure: one HTML table (#productAvailTable).
Header rows (<th>) mark species sections: "Duck Breed", "Goose Breed",
"Chicken Breed", "Guinea Breed", "Turkey Breed", "Fresh eggs Breed",
"Hatching eggs Breed".  We keep only Duck / Goose / Chicken sections.

Data rows carry a data-skuid attribute on the first <td> (the breed name).
Availability cells hold a <div> whose class encodes status:
  - "available"     -> Available
  - "availableLim"  -> Limited Availability
  - "availableOut"  -> Sold Out

The table spans many weeks; we report the status for the earliest (leftmost)
hatch-date column and its date label so callers know when to expect availability.
"""

import requests
from bs4 import BeautifulSoup

URL = "https://www.metzerfarms.com/available.html"
HEADERS = {"User-Agent": "Mozilla/5.0 (AmbitiousHarvest BuildYourFlock)"}

# Map availability div classes to human-readable strings
_STATUS_MAP = {
    "available": "Available",
    "availableLim": "Limited Availability",
    "availableOut": "Sold Out",
}

# Table header text -> animal type we want (None = skip)
_SECTION_MAP = {
    "duck": "duck",
    "goose": "goose",
    "chicken": "chicken",
}


def fetch_html(url=URL, timeout=30):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def _animal_type(section_header_text):
    """
    Map a section-header string to 'duck', 'goose', 'chicken', or None.
    Returns None for Guinea, Turkey, eggs, etc. so those sections are skipped.
    """
    t = section_header_text.lower()
    for keyword, animal in _SECTION_MAP.items():
        if keyword in t:
            return animal
    return None


def parse(html):
    """
    Parse the Metzer Farms availability page.

    Returns a list of dicts with keys:
        source  - "Metzer Farms"
        animal  - "duck", "goose", or "chicken"
        breed   - breed / product name from the table
        status  - availability text for the nearest hatch date the breed is
                  available or limited (scanning left-to-right).  Format:
                  "Available (<date>)" or "Limited (<date>)".  Only if every
                  date cell is sold out (or empty) is "Sold Out" reported.
        link    - URL (availability page; no per-breed deep links in the table)
    """
    if not html:
        return []

    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception:
        return []

    table = soup.find("table", id="productAvailTable")
    if table is None:
        return []

    rows = table.find_all("tr")
    if not rows:
        return []

    # Extract column date labels from the very first header row
    header_row = rows[0]
    date_labels = [th.get_text(strip=True) for th in header_row.find_all("th")[1:]]

    records = []
    current_animal = None  # tracks which species section we are in

    for row in rows:
        ths = row.find_all("th")
        if ths:
            # Section divider row — determine animal type
            current_animal = _animal_type(ths[0].get_text(strip=True))
            continue

        # Skip sections we do not care about
        if current_animal is None:
            continue

        tds = row.find_all("td")
        if not tds:
            continue

        breed_td = tds[0]
        if not breed_td.get("data-skuid"):
            continue

        breed = breed_td.get_text(strip=True)
        if not breed:
            continue

        # Find the nearest hatch date on which the breed is available or limited.
        # Scan left-to-right; skip sold-out cells.  Only fall back to "Sold Out"
        # when every date cell is availableOut (or has no div at all).
        status_str = None
        last_out_date = None  # track the last sold-out date in case all are out

        for idx, td in enumerate(tds[1:]):
            div = td.find("div")
            if not div:
                continue
            cls = (div.get("class") or [""])[0]
            date_label = date_labels[idx] if idx < len(date_labels) else None

            if cls in ("available", "availableLim"):
                # First upcoming available/limited date — use it and stop.
                human = _STATUS_MAP[cls]
                status_str = f"{human} ({date_label})" if date_label else human
                break
            elif cls == "availableOut":
                # Record it as a fallback so we can report sold-out with a date
                # if that turns out to be the only option.
                if last_out_date is None and date_label:
                    last_out_date = date_label

        if status_str is None:
            # No available/limited cell found — breed is fully sold out.
            status_str = "Sold Out"

        records.append(
            {
                "source": "Metzer Farms",
                "animal": current_animal,
                "breed": breed,
                "status": status_str,
                "link": URL,
            }
        )

    return records
