from pathlib import Path
from scrapers import sccas

FIXTURE = Path(__file__).parent / "fixtures" / "sccas_sample.html"


def test_parse_returns_poultry_records():
    html = FIXTURE.read_text(encoding="utf-8")
    records = sccas.parse(html)
    assert isinstance(records, list)
    assert len(records) >= 1, "fixture captured today should contain poultry"


def test_records_have_required_shape():
    html = FIXTURE.read_text(encoding="utf-8")
    for r in sccas.parse(html):
        assert r["animal"] in ("chicken", "duck", "goose")
        assert r["name"]
        assert r["link"]
        assert r["source"] == "Santa Cruz County Animal Shelter"


def test_excludes_non_poultry():
    html = FIXTURE.read_text(encoding="utf-8")
    names = " ".join(r["name"].lower() for r in sccas.parse(html))
    assert "rabbit" not in names and "guinea pig" not in names
