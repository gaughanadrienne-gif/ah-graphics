#!/usr/bin/env python
"""Ambitious Harvest -- build related-manifest.json for the Keep Reading module.
Crawls the public /learn blog feed, computes each article's top-3
related guides (subject first, category and recency as tiebreakers),
and emits related-manifest.json for GitHub Pages. Run: py build_related_manifest.py
"""
import requests, json, time, re
from functools import lru_cache

BASE = "https://www.ambitiousharvest.com"

def _get_json(url):
    response = requests.get(url, headers={"User-Agent": "AHC-related-bot"}, timeout=40)
    response.raise_for_status()
    data = response.json()
    if not isinstance(data, dict):
        raise ValueError("Unexpected feed response")
    return data


def fetch_articles():
    """Read every public feed page; never replace the manifest after a partial crawl."""
    out, offset, seen, offsets = [], None, set(), set()
    while True:
        url = BASE + "/learn?format=json&nocache=%d" % int(time.time())
        if offset is not None:
            url += "&offset=" + str(offset)
        data = _get_json(url)
        items, pagination = data.get("items"), data.get("pagination")
        if not isinstance(items, list) or not isinstance(pagination, dict):
            raise ValueError("Missing items/pagination: " + url)
        if not items:
            raise ValueError("Unexpected empty feed page: " + url)
        for item in items:
            slug = item.get("urlId")
            if not slug or slug in seen:
                raise ValueError("Missing/duplicate slug in pagination: " + str(slug))
            if item.get("workflowState") != 1:
                raise ValueError("Non-public item in public feed: " + slug)
            if not (item.get("title") or "").strip() or not item.get("publishOn"):
                raise ValueError("Incomplete article: " + slug)
            if item.get("fullUrl") != "/learn/" + slug:
                raise ValueError("Unexpected article canonical route: " + slug)
            seen.add(slug)
            categories = item.get("categories") or []
            out.append({"slug": slug, "title": item["title"].strip(),
                        "category": categories[0] if categories else "",
                        "url": "/learn/" + slug, "publishOn": item["publishOn"]})
        if pagination.get("nextPage") in (False, None) and not pagination.get("nextPageOffset"):
            break
        if pagination.get("nextPage") is not True:
            raise ValueError("Missing terminal pagination state")
        next_offset = pagination.get("nextPageOffset")
        if next_offset is None or str(next_offset) in offsets:
            raise ValueError("Missing/repeating nextPageOffset")
        offsets.add(str(next_offset))
        offset = next_offset
    # Independently compare the published sitemap so feed truncation fails closed.
    import xml.etree.ElementTree as ET
    response = requests.get(BASE + "/sitemap.xml", timeout=40)
    response.raise_for_status()
    root = ET.fromstring(response.content)
    sitemap_slugs = set()
    from urllib.parse import urlsplit, unquote
    for element in root.iter():
        if element.tag.endswith("}loc") or element.tag == "loc":
            path = unquote(urlsplit(element.text or "").path).rstrip("/")
            if path.startswith("/learn/") and "/" not in path[len("/learn/"):]:
                sitemap_slugs.add(path[len("/learn/"):])
    if len(sitemap_slugs) < 100:
        raise ValueError("Sitemap article inventory unexpectedly small")
    missing = sitemap_slugs - seen
    if missing:
        raise ValueError("Feed missed sitemap articles: " + repr(sorted(missing)))
    print("public feed/sitemap checked:", len(out), "/", len(sitemap_slugs))
    return out


def validate_manifest(result, articles):
    slugs = {article["slug"] for article in articles}
    if set(result) != slugs:
        raise ValueError("Manifest source coverage mismatch")
    for slug, picks in result.items():
        destinations = [pick["url"].removeprefix("/learn/") for pick in picks]
        if len(picks) != 3 or len(set(destinations)) != 3:
            raise ValueError("Expected three distinct recommendations: " + slug)
        if slug in destinations or not set(destinations) <= slugs:
            raise ValueError("Self-link or unpublished destination: " + slug)
        if any(not pick.get("title") for pick in picks):
            raise ValueError("Missing recommendation title: " + slug)


STOP = set("the a an in to of for and or on my is are can what when how do i with at from "
           "your you it that this grow growing guide guides tips best california santa cruz "
           "county garden gardening plant plants vs your".split())


def _stem(w):
    # light singularize so plural/singular titles match (poppies->poppy, pots->pot)
    if len(w) > 4 and w.endswith("ies"):
        return w[:-3] + "y"
    if len(w) > 4 and w.endswith("es"):
        return w[:-2]
    if len(w) > 3 and w.endswith("s"):
        return w[:-1]
    return w


@lru_cache(maxsize=2048)
def tokens(title):
    out = set()
    for t in re.findall(r"[a-z0-9]+", (title or "").lower()):
        if len(t) < 3 or t in STOP:
            continue
        s = _stem(t)
        if s in STOP:
            continue
        out.add(s)
    return out


# Broad gardening actions cannot outweigh the subject of a guide. Editorial
# series such as Garden Question of the Week are not subject categories.
GENERIC = set("seed sow sowing planting harvest winter fall spring summer year indoor outdoor start should need protect sweet care meaning history benefit use".split())
SUBJECTS = {
    "wildflowers": {"wildflower", "poppy", "lupine"},
    "roots": {"carrot", "beet", "radish", "turnip", "rutabaga", "parsnip"},
}


@lru_cache(maxsize=2048)
def subjects(title):
    words = tokens(title)
    found = {name for name, terms in SUBJECTS.items() if words & terms}
    if re.search(r"root vegetables?", title, re.I):
        found.add("roots")
    return found


def score(a_title, b_title):
    shared = tokens(a_title) & tokens(b_title)
    # Twelve points for an explicit related crop family, three for substantive
    # title terms, and a quarter point for general timing/technique terms.
    return (12 * len(subjects(a_title) & subjects(b_title))
            + 3 * len(shared - GENERIC) + .25 * len(shared & GENERIC))


def _selftest():
    # sibling growth-stages guides SHOULD relate (share growth + stage)
    assert score("Blackberry Growth Stages", "Raspberry Growth Stages") >= 2
    assert score("Growing Blackberries in Pots", "Best Soil for Blackberries in Pots") >= 2
    assert score("California Poppy Care", "Toyon California Holly") == 0
    # plurals stem to singular
    assert "blackberry" in tokens("Growing Blackberries in Pots")
    assert "pot" in tokens("Growing Blackberries in Pots")
    assert tokens("California Poppies") == tokens("California Poppy")
    assert score("When Should I Sow Wildflower Seeds on the California Coast?",
                 "Do California Poppies Reseed Themselves?") > score(
                 "When Should I Sow Wildflower Seeds on the California Coast?",
                 "When Should I Start Tomato Seeds Indoors on the California Coast?")
    assert score("What Root Vegetables Can I Direct-Seed in Fall for Winter Harvest?",
                 "Growing Carrots in Santa Cruz County") > score(
                 "What Root Vegetables Can I Direct-Seed in Fall for Winter Harvest?",
                 "Growing Winter Squash in Santa Cruz County")
    print("scorer subject-relevance selftest OK")


def compute_related(articles):
    result = {}
    for article in articles:
        pool = [other for other in articles if other["slug"] != article["slug"]]
        pool.sort(key=lambda other: (score(article["title"], other["title"]),
                                    other["category"] == article["category"],
                                    other["publishOn"]), reverse=True)
        result[article["slug"]] = [{"title": other["title"], "url": other["url"]}
                                   for other in pool[:3]]
    return result


def _inbound_counts(result):
    import collections
    c = collections.Counter()
    for picks in result.values():
        for p in picks:
            c[p["url"].replace("/learn/", "").strip("/")] += 1
    return c


def enforce_min_inbound(result, articles, min_inbound=2):
    """Improve inbound coverage only when topical relevance is preserved.

    For an under-linked article, replace only a well-linked recommendation
    whose topical score is no higher than the replacement. Require a substantive
    topic match. Some articles will remain under-linked rather than receiving
    unrelated links merely to meet an inbound quota.
    """
    by_slug = {a["slug"]: a for a in articles}
    by_cat = {}
    for a in articles:
        by_cat.setdefault(a["category"], []).append(a)
    inbound = _inbound_counts(result)
    swaps = 0

    # process the most-orphaned first
    for a in sorted(articles, key=lambda x: inbound[x["slug"]]):
        slug = a["slug"]
        # candidate hosts: prefer same category + highest title overlap
        hosts = [h for h in by_cat.get(a["category"], []) if h["slug"] != slug]
        hosts += [h for h in articles
                  if h["category"] != a["category"] and h["slug"] != slug]
        hosts.sort(key=lambda h: score(a["title"], h["title"]), reverse=True)
        hi = 0
        while inbound[slug] < min_inbound and hi < len(hosts):
            h = hosts[hi]; hi += 1
            picks = result[h["slug"]]
            candidate_score = score(h["title"], a["title"])
            if candidate_score < 3:
                continue
            # already links to the orphan? skip
            if any(p["url"] == a["url"] for p in picks):
                continue
            # find a displaceable pick: one that stays >= min_inbound after removal,
            # taking the weakest match to the host so we drop the least-relevant link
            cand = sorted(
                [p for p in picks
                 if inbound[p["url"].replace("/learn/", "").strip("/")] > min_inbound
                 and score(h["title"], p.get("title", "")) <= candidate_score],
                key=lambda p: score(h["title"], p.get("title", "")))
            if not cand:
                continue
            drop = cand[0]
            ds = drop["url"].replace("/learn/", "").strip("/")
            picks[picks.index(drop)] = {"title": a["title"], "url": a["url"]}
            inbound[slug] += 1; inbound[ds] -= 1; swaps += 1

    return result, swaps


def _selftest_minlink():
    arts = [{"slug": f"s{i}", "title": t, "category": "C", "url": f"/learn/s{i}",
             "publishOn": i} for i, t in enumerate([
        "Tomato Growing Guide", "Tomato Pests", "Tomato Varieties",
        "Pepper Growing Guide", "Lonely Orphan Article About Nothing Common"])]
    rel = compute_related(arts)
    isolated_before = _inbound_counts(rel)["s4"]
    rel, _ = enforce_min_inbound(rel, arts, min_inbound=2)
    inb = _inbound_counts(rel)
    assert inb["s4"] == isolated_before, "Do not force unrelated inbound links"
    for host in arts:
        for pick in rel[host["slug"]]:
            assert pick["url"] != host["url"]
    print("min-inbound selftest OK")


def _selftest_inventory():
    """Exercise failure paths without network access or replacing the output."""
    from unittest.mock import patch
    article = {"urlId": "example", "title": "Example", "publishOn": 1,
               "fullUrl": "/learn/example", "workflowState": 1}
    invalid = [
        {"items": [article]},
        {"items": [], "pagination": {"nextPage": True}},
        {"items": [article], "pagination": {"nextPage": True}},
        {"items": [{**article, "workflowState": 2}], "pagination": {}},
    ]
    for page in invalid:
        with patch(__name__ + "._get_json", return_value=page):
            try:
                fetch_articles()
            except ValueError:
                pass
            else:
                raise AssertionError("Incomplete/private feed was accepted")
    arts = [{"slug": str(i), "title": str(i), "category": "C",
             "url": "/learn/" + str(i), "publishOn": i} for i in range(5)]
    for destination in ("/learn/0", "/learn/missing"):
        result = compute_related(arts)
        result["0"][0]["url"] = destination
        try:
            validate_manifest(result, arts)
        except ValueError:
            pass
        else:
            raise AssertionError("Invalid destination was accepted")
    print("inventory/manifest failure-path selftest OK")


if __name__ == "__main__":
    _selftest()
    _selftest_minlink()
    _selftest_inventory()
    arts = fetch_articles()
    assert len(arts) > 100, "too few articles -- check pagination"
    rel = compute_related(arts)
    before = _inbound_counts(rel)
    orphans_before = sum(1 for a in arts if before[a["slug"]] == 0)
    weak_before = sum(1 for a in arts if before[a["slug"]] < 2)
    rel, swaps = enforce_min_inbound(rel, arts, min_inbound=2)
    after = _inbound_counts(rel)
    orphans_after = sum(1 for a in arts if after[a["slug"]] == 0)
    weak_after = sum(1 for a in arts if after[a["slug"]] < 2)
    validate_manifest(rel, arts)
    # Do not overwrite the last good manifest until every check passes.
    from pathlib import Path
    target = Path(__file__).with_name("related-manifest.json")
    temporary = target.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(rel, ensure_ascii=False), encoding="utf-8")
    temporary.replace(target)
    print("wrote related-manifest.json with", len(rel), "slugs")
    print(f"  inbound swaps: {swaps}")
    print(f"  orphans (0 inbound): {orphans_before} -> {orphans_after}")
    print(f"  weak (<2 inbound):  {weak_before} -> {weak_after}")
