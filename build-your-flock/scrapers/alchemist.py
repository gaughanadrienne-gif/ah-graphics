import re

import requests
from bs4 import BeautifulSoup

URL = "https://www.alchemistfarm.com/shop/"
HEADERS = {"User-Agent": "Mozilla/5.0 (AmbitiousHarvest BuildYourFlock)"}
# Category tiles (not real products) carry a "N Products" count suffix in their name
# and link to /product-category/ rather than /product/. Exclude them so we only ever
# surface real purchasable products; if the page exposes only categories (JS-rendered
# products), parse() returns [] and the curated Alchemist card takes over.
COUNT_SUFFIX_RE = re.compile(r"\d+\s*Products?\s*$", re.I)


def fetch_html(url=URL, timeout=30):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def _is_category_tile(name, link):
    if COUNT_SUFFIX_RE.search(name):
        return True
    if link and "/product-category/" in link:
        return True
    return False


def parse(html):
    soup = BeautifulSoup(html, "html.parser")
    items = []
    for li in soup.select("li.product"):
        name_el = li.select_one(".woocommerce-loop-product__title, h2, h3")
        if not name_el:
            continue
        name = name_el.get_text(strip=True)
        if not name:
            continue
        link_el = li.select_one("a[href]")
        link = link_el["href"] if link_el else URL
        if _is_category_tile(name, link):
            continue
        price_el = li.select_one(".price")
        price = price_el.get_text(" ", strip=True) if price_el else None
        if price:
            price = " ".join(price.split())
        items.append({
            "source": "Alchemist Farm",
            "name": name,
            "price": price,
            "link": link,
        })
    return items
