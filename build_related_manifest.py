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


if __name__ == "__main__":
    arts = fetch_articles()
    print("count:", len(arts))
    print("with category:", sum(1 for a in arts if a["category"]))
    print("sample:", arts[0] if arts else None)
    cats = {}
    for a in arts:
        cats[a["category"]] = cats.get(a["category"], 0) + 1
    print("categories:", sorted(cats.items(), key=lambda x: -x[1])[:15])
