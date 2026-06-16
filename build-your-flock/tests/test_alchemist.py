from pathlib import Path
from scrapers import alchemist

FIXTURE = Path(__file__).parent / "fixtures" / "alchemist_sample.html"


def test_parse_returns_list():
    items = alchemist.parse(FIXTURE.read_text(encoding="utf-8"))
    assert isinstance(items, list)


def test_items_have_name_and_source():
    items = alchemist.parse(FIXTURE.read_text(encoding="utf-8"))
    for it in items:
        assert it["source"] == "Alchemist Farm"
        assert it["name"]


def test_parses_woocommerce_markup():
    sample = (
        '<ul><li class="product"><h2 class="woocommerce-loop-product__title">'
        'Alchemist Egger Fertile Hatching Eggs</h2>'
        '<span class="price">$8.00</span></li></ul>'
    )
    items = alchemist.parse(sample)
    assert len(items) == 1
    assert items[0]["name"] == "Alchemist Egger Fertile Hatching Eggs"
    assert items[0]["price"] == "$8.00"


def test_empty_html_is_safe():
    assert alchemist.parse("<html><body></body></html>") == []
