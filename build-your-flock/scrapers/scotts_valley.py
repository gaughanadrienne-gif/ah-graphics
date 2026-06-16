import re
import requests
from bs4 import BeautifulSoup

URL = "https://www.scottsvalleyfeed.com/chicks"
HEADERS = {"User-Agent": "Mozilla/5.0 (AmbitiousHarvest BuildYourFlock)"}
PRICE_RE = re.compile(r"\$\s?(\d+)")
MONTHS = ("January|February|March|April|May|June|July|August|"
          "September|October|November|December|"
          "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec")
DATE_RE = re.compile(rf"({MONTHS})\s+\d{{1,2}}(st|nd|rd|th)?", re.I)

# Lines that are purely status annotations (no breed content)
_STATUS_FRAGMENTS = re.compile(
    r"^(SOLD\s+OUT|WILL\s*NOT\s*ARRIVE|NOT\s*ARRIVE|WILL\s+NOT|"
    r"INCOMING|ARRIVING|PRE.?ORDER|CANCELLED|NOT\s+ARRIVING|WILL)$",
    re.I,
)


def fetch_html(url=URL, timeout=30):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def _status(line):
    """Determine status from text that may be inline or a follow-up status line."""
    up = line.upper()
    if "SOLD OUT" in up:
        return "sold-out"
    if "WILL NOT ARRIVE" in up or "NOT ARRIVING" in up or "CANCELLED" in up:
        return "unavailable"
    if "INCOMING" in up or "ARRIVING" in up or "PRE-ORDER" in up or "PRE ORDER" in up:
        return "incoming"
    return "in-stock"


def _is_status_only(line):
    """Return True if this line is purely a status annotation with no breed info."""
    return bool(_STATUS_FRAGMENTS.match(line.strip()))


def parse(html):
    soup = BeautifulSoup(html, "html.parser")
    lines = [ln.strip() for ln in soup.get_text("\n", strip=True).split("\n") if ln.strip()]

    items = []
    current_date = None

    # Two-pass approach: collect breed+price lines, then check following line for status
    i = 0
    while i < len(lines):
        line = lines[i]

        # Check for date header (short or long month names)
        d = DATE_RE.search(line)
        if d and len(line) <= 60:
            current_date = d.group(0)
            i += 1
            continue

        # Check for a breed+price line
        p = PRICE_RE.search(line)
        if p:
            # Determine inline status first
            inline_status = _status(line)

            # Peek at the next non-fragment line to check for status annotation
            # The live site puts status (SOLD OUT / WILL NOT ARRIVE) on the NEXT line
            next_idx = i + 1
            # Collect any immediately following status-only fragment lines
            # and build a combined status string to evaluate
            combined_status_text = line
            j = next_idx
            while j < len(lines) and _is_status_only(lines[j]):
                combined_status_text += " " + lines[j]
                j += 1

            final_status = _status(combined_status_text)

            # Extract breed name: everything before the first $ sign
            breed = PRICE_RE.split(line)[0].strip(" -*:•\xa0").strip()
            if not breed:
                i += 1
                continue

            items.append({
                "source": "Scotts Valley Feed",
                "breed": breed,
                "price": f"${p.group(1)}",
                "date": current_date,
                "status": final_status,
            })
            # Advance past any consumed status lines
            i = j
            continue

        i += 1

    return items
