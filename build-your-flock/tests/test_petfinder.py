import json
from pathlib import Path
from scrapers import petfinder

FIXTURE = Path(__file__).parent / "fixtures" / "petfinder_sample.json"


def _raw():
    return FIXTURE.read_text(encoding="utf-8")


def test_parse_returns_list():
    assert isinstance(petfinder.parse(_raw()), list)


def test_records_match_shelter_shape():
    for r in petfinder.parse(_raw()):
        assert r["source"]
        assert r["animal"] in ("chicken", "duck", "goose")
        assert r["name"]
        assert r["link"].startswith("http")


def test_only_local_results():
    # every kept record must be in a local city (Santa Cruz / Monterey / South Bay area), state ca
    for r in petfinder.parse(_raw()):
        assert ", CA" in r["detail"].upper() or "/ca/" in r["link"].lower()


def test_excludes_sccas_direct_dupes():
    # SCCAS is scraped directly via 24PetConnect; it must be excluded here to avoid duplicates
    for r in petfinder.parse(_raw()):
        assert "santa-cruz-county-animal-shelter" not in r["link"].lower()
        assert "ca625" not in r["link"].lower()


def test_parse_empty():
    assert petfinder.parse("[]") == []


def test_record_keys_complete():
    """All records must have exactly the same keys as the SCCAS shelter shape."""
    required = {"source", "name", "animal", "id", "detail", "link"}
    for r in petfinder.parse(_raw()):
        assert required.issubset(r.keys()), f"Missing keys in record: {r}"


def test_no_duplicate_ids():
    records = petfinder.parse(_raw())
    ids = [r["id"] for r in records]
    assert len(ids) == len(set(ids)), "Duplicate IDs found"


def test_inline_city_state_parsing():
    """Prove city/state parsing logic even if no local supply in fixture."""
    sample = json.dumps([
        {
            "animalId": "test-001",
            "animalName": "Test Chicken",
            "physical": {"breed": {"primary": "Chicken"}},
            "publicUrl": {"url": "bird/test-chicken-test-001/ca/santa-cruz/some-shelter-ca999"}
        },
        {
            "animalId": "test-002",
            "animalName": "Test Duck",
            "physical": {"breed": {"primary": "Duck"}},
            "publicUrl": {"url": "bird/test-duck-test-002/ca/scotts-valley/some-other-shelter-ca100"}
        },
        {
            "animalId": "test-003",
            "animalName": "SCCAS Bird",
            "physical": {"breed": {"primary": "Chicken"}},
            "publicUrl": {"url": "bird/feta-test-003/ca/santa-cruz/santa-cruz-county-animal-shelter-ca625"}
        },
        {
            "animalId": "test-004",
            "animalName": "Out of Area",
            "physical": {"breed": {"primary": "Chicken"}},
            "publicUrl": {"url": "bird/bird-test-004/wa/seattle/some-shelter-wa123"}
        },
    ])
    records = petfinder.parse(sample)
    ids = [r["id"] for r in records]
    # santa-cruz OK (not SCCAS)
    assert "test-001" in ids, "Local CA santa-cruz bird should be kept"
    # scotts-valley (hyphen normalized to space) OK
    assert "test-002" in ids, "Local CA scotts-valley bird should be kept"
    # SCCAS bird must be excluded
    assert "test-003" not in ids, "SCCAS bird must be excluded"
    # Out of state must be excluded
    assert "test-004" not in ids, "Out-of-state bird must be excluded"
    # Check detail format
    for r in records:
        assert ", CA" in r["detail"].upper()
