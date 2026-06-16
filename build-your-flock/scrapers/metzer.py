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
        status  - availability text for the soonest hatch date
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

        # Find the soonest hatch date and its availability
        status = None
        status_date = None
        for idx, td in enumerate(tds[1:]):
            div = td.find("div")
            if div:
                cls = (div.get("class") or [""])[0]
                status = _STATUS_MAP.get(cls, cls)
                # Use the matching column label if available
                if idx < len(date_labels):
                    status_date = date_labels[idx]
                break

        if status is None:
            status = "Check site"

        # Combine status with date if we have one
        if status_date:
            status_str = f"{status} ({status_date})"
        else:
            status_str = status

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
