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


def _inbound_counts(result):
    import collections
    c = collections.Counter()
    for picks in result.values():
        for p in picks:
            c[p["url"].replace("/learn/", "").strip("/")] += 1
    return c


def enforce_min_inbound(result, articles, min_inbound=2):
    """Guarantee every article receives >= min_inbound internal links.

    Orphaned/under-linked pages are the top cause of 'Discovered/Crawled - not
    indexed'. For each under-linked article we find the most topically-relevant
    HOST (same category first, then keyword overlap) and swap in a link to the
    orphan -- but only by displacing a pick that is itself already well-linked
    (inbound > min_inbound), so the swap never creates a new orphan. Relevance is
    preserved by always choosing the best-matching host available.
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
            # already links to the orphan? skip
            if any(p["url"] == a["url"] for p in picks):
                continue
            # find a displaceable pick: one that stays >= min_inbound after removal,
            # taking the weakest match to the host so we drop the least-relevant link
            cand = sorted(
                [p for p in picks
                 if inbound[p["url"].replace("/learn/", "").strip("/")] > min_inbound],
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
    rel, _ = enforce_min_inbound(rel, arts, min_inbound=2)
    inb = _inbound_counts(rel)
    assert all(inb[a["slug"]] >= 2 for a in arts), inb
    print("min-inbound selftest OK")


if __name__ == "__main__":
    _selftest()
    _selftest_minlink()
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
    json.dump(rel, open("related-manifest.json", "w", encoding="utf-8"), ensure_ascii=False)
    print("wrote related-manifest.json with", len(rel), "slugs")
    print(f"  inbound swaps: {swaps}")
    print(f"  orphans (0 inbound): {orphans_before} -> {orphans_after}")
    print(f"  weak (<2 inbound):  {weak_before} -> {weak_after}")
