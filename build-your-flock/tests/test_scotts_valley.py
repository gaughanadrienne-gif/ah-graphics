from pathlib import Path
from scrapers import scotts_valley as sv

FIXTURE = Path(__file__).parent / "fixtures" / "scotts_valley_sample.html"

def test_parse_returns_list():
    items = sv.parse(FIXTURE.read_text(encoding="utf-8"))
    assert isinstance(items, list)

def test_items_have_required_shape():
    for it in sv.parse(FIXTURE.read_text(encoding="utf-8")):
        assert it["source"] == "Scotts Valley Feed"
        assert it["breed"]
        assert it["status"] in ("in-stock", "sold-out", "incoming", "unavailable")

def test_status_detection():
    sample = '<div>March 1st</div><div>Black Australorp $8</div><div>Olive Egger $10 SOLD OUT</div>'
    items = sv.parse(sample)
    statuses = {it["breed"]: it["status"] for it in items}
    assert statuses.get("Black Australorp") == "in-stock"
    assert statuses.get("Olive Egger") == "sold-out"
