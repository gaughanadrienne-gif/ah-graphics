import requests
from bs4 import BeautifulSoup

URL = "https://www.alchemistfarm.com/shop/"
HEADERS = {"User-Agent": "Mozilla/5.0 (AmbitiousHarvest BuildYourFlock)"}


def fetch_html(url=URL, timeout=30):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


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
        price_el = li.select_one(".price")
        price = price_el.get_text(" ", strip=True) if price_el else None
        if price:
            price = " ".join(price.split())
        link_el = li.select_one("a[href]")
        items.append({
            "source": "Alchemist Farm",
            "name": name,
            "price": price,
            "link": link_el["href"] if link_el else URL,
        })
    return items
