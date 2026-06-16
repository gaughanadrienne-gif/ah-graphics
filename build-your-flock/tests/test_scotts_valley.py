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

def test_multiline_status_detection():
    # status on the line AFTER the breed+price
    sample = '<div>March 1st</div><div>Speckled Sussex $9</div><div>SOLD OUT</div>'
    items = {it["breed"]: it["status"] for it in sv.parse(sample)}
    assert items.get("Speckled Sussex") == "sold-out"

def test_fragmented_will_not_arrive():
    # "WILL NOT ARRIVE" split across three lines must resolve to unavailable
    sample = ('<div>March 1st</div><div>Buff Orpington $8</div>'
              '<div>WILL</div><div>NOT</div><div>NOT ARRIVE</div>')
    items = {it["breed"]: it["status"] for it in sv.parse(sample)}
    assert items.get("Buff Orpington") == "unavailable"
