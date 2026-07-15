import datetime
from zoneinfo import ZoneInfo

import build_data

PT = ZoneInfo("America/Los_Angeles")


def test_in_chick_season():
    assert build_data.in_chick_season(datetime.datetime(2026, 5, 1, tzinfo=PT)) is True
    assert build_data.in_chick_season(datetime.datetime(2026, 12, 1, tzinfo=PT)) is False


def test_assemble_merges_all_sources():
    live = {
        "sccas": [{"source": "Santa Cruz County Animal Shelter", "name": "Gouda",
                   "animal": "chicken", "id": "A1", "detail": "", "link": "x"}],
        "scotts_valley": [{"source": "Scotts Valley Feed", "breed": "Australorp",
                           "price": "$8", "date": "March 1", "status": "in-stock"}],
        "alchemist": [],
        "metzer": [{"source": "Metzer Farms", "animal": "duck", "breed": "Pekin",
                    "status": "Available (Jun 22)", "link": "m"}],
    }
    curated = {
        "shelters": [{"source": "Eeyore's Hen Harbor"}],
        "feedStores": [{"source": "Westside Farm and Feed"}],
        "breeders": [{"source": "Four Acorns Farm"}],
    }
    petfinder = [{"source": "The Spca For Monterey County", "name": "Cowboy Gary",
                  "animal": "chicken", "id": "P1", "detail": "Chicken in Monterey, CA", "link": "p"}]
    now = datetime.datetime(2026, 5, 1, 6, 0, tzinfo=PT)
    data = build_data.assemble(live, curated, petfinder, now=now)

    assert data["updated"].startswith("2026-05-01")
    shelters = data["sections"]["shelters"]
    assert len(shelters["live"]) == 2  # SCCAS + Petfinder
    assert shelters["curated"][0]["source"] == "Eeyore's Hen Harbor"
    assert data["sections"]["feedStores"]["live"][0]["breed"] == "Australorp"
    assert data["sections"]["breeders"]["live"][0]["source"] == "Metzer Farms"
    assert data["status"]["scottsValley"] == "in-season"


def test_offseason_hides_scotts_valley():
    live = {"scotts_valley": [{"source": "Scotts Valley Feed", "breed": "X",
                               "price": "$8", "date": None, "status": "in-stock"}]}
    now = datetime.datetime(2026, 12, 1, 6, 0, tzinfo=PT)
    data = build_data.assemble(live, {"shelters": [], "feedStores": [], "breeders": []}, [], now=now)
    assert data["sections"]["feedStores"]["live"] == []
    assert data["status"]["scottsValley"] == "off-season"


def test_prev_records_preserves_by_source():
    previous = {"sections": {"breeders": {"live": [
        {"source": "Metzer Farms", "animal": "duck", "breed": "Pekin", "status": "x", "link": "m"},
        {"source": "Alchemist Farm", "name": "Egg", "price": "$8", "link": "a"},
    ]}}}
    kept = build_data._prev_records(previous, "breeders", "Metzer Farms")
    assert len(kept) == 1
    assert kept[0]["source"] == "Metzer Farms"


def test_assemble_handles_empty_inputs():
    data = build_data.assemble({}, {}, [], now=datetime.datetime(2026, 7, 1, tzinfo=PT))
    for section in ("shelters", "feedStores", "breeders"):
        assert data["sections"][section]["live"] == []
        assert data["sections"][section]["curated"] == []
