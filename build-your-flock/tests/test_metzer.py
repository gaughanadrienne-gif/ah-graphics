from pathlib import Path
from scrapers import metzer

FIXTURE = Path(__file__).parent / "fixtures" / "metzer_sample.html"


def test_parse_returns_list():
    assert isinstance(metzer.parse(FIXTURE.read_text(encoding="utf-8")), list)


def test_records_have_required_shape():
    for r in metzer.parse(FIXTURE.read_text(encoding="utf-8")):
        assert r["source"] == "Metzer Farms"
        assert r["animal"] in ("chicken", "duck", "goose")
        assert r["breed"]
        assert r["link"]


def test_only_target_species():
    # No turkeys, guineas, quail, pheasant in the output
    names = " ".join(r["breed"].lower() for r in metzer.parse(FIXTURE.read_text(encoding="utf-8")))
    for bad in ("turkey", "guinea", "quail", "pheasant", "gamebird"):
        assert bad not in names


def test_finds_waterfowl():
    # The whole point of Metzer is ducks/geese; the captured fixture should yield at least one
    animals = {r["animal"] for r in metzer.parse(FIXTURE.read_text(encoding="utf-8"))}
    assert "duck" in animals or "goose" in animals
