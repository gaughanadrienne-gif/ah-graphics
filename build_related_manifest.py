#!/usr/bin/env python
"""Ambitious Harvest -- build related-manifest.json for the Keep Reading module.
READ-ONLY. Crawls the public /learn blog feed, computes each article's top-3
related guides (same category, ranked by shared title keywords, recency tiebreak),
and emits related-manifest.json for GitHub Pages. Run: py build_related_manifest.py
"""
import requests, json, time, re

BASE = "https://www.ambitiousharvest.com"

def fetch_articles():
    out, offset, seen = [], None, set()
    while True:
        u = BASE + "/learn?format=json&nocache=%d" % int(time.time())
        if offset:
            u += "&offset=%d" % offset
        data = requests.get(u, headers={"User-Agent": "AHC-related-bot"}, timeout=30).json()
        items = data.get("items", [])
        if not items:
            break
        for it in items:
            slug = it.get("urlId")
            if not slug or slug in seen:
                continue
            seen.add(slug)
            cats = it.get("categories") or []
            out.append({
                "slug": slug,
                "title": (it.get("title") or "").strip(),
                "category": cats[0] if cats else "",
                "url": "/learn/" + slug,
                "publishOn": it.get("publishOn") or 0,
            })
        pg = data.get("pagination") or {}
        if not pg.get("nextPage"):
            break
        nxt = items[-1].get("publishOn")
        if nxt is None or nxt == offset:
            break
        offset = nxt
    return out


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


def score(a_title, b_title):
    return len(tokens(a_title) & tokens(b_title))


def _selftest():
    # sibling growth-stages guides SHOULD relate (share growth + stage)
    assert score("Blackberry Growth Stages", "Raspberry Growth Stages") >= 2
    assert score("Growing Blackberries in Pots", "Best Soil for Blackberries in Pots") >= 2
    assert score("California Poppy Care", "Toyon California Holly") == 0
    # plurals stem to singular
    assert "blackberry" in tokens("Growing Blackberries in Pots")
    assert "pot" in tokens("Growing Blackberries in Pots")
    assert tokens("California Poppies") == tokens("California Poppy")
    print("scorer selftest OK")


def compute_related(articles):
    by_cat = {}
    for a in articles:
        by_cat.setdefault(a["category"], []).append(a)
    result = {}
    for a in articles:
        pool = [b for b in by_cat.get(a["category"], []) if b["slug"] != a["slug"]]
        pool.sort(key=lambda b: (score(a["title"], b["title"]), b["publishOn"]), reverse=True)
        picks = pool[:3]
        if len(picks) < 3:
            have = {p["slug"] for p in picks} | {a["slug"]}
            extra = [b for b in articles if b["slug"] not in have]
            extra.sort(key=lambda b: (score(a["title"], b["title"]), b["publishOn"]), reverse=True)
            picks += extra[: 3 - len(picks)]
        result[a["slug"]] = [{"title": p["title"], "url": p["url"]} for p in picks]
    return result


if __name__ == "__main__":
    arts = fetch_articles()
    assert len(arts) > 100, "too few articles -- check pagination"
    rel = compute_related(arts)
    json.dump(rel, open("related-manifest.json", "w", encoding="utf-8"), ensure_ascii=False)
    print("wrote related-manifest.json with", len(rel), "slugs")
