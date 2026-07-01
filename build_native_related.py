#!/usr/bin/env python
"""Ambitious Harvest -- native-cluster overlay for the Keep Reading module.

The generic build_related_manifest.py groups related cards by CATEGORY + shared
title keywords. California native spotlights don't cluster well there: they live
across Microclimates / Water-Wise / Grow Guides / Fire-Wise, and each plant title
shares almost no keywords with the next, so the scorer falls back to recency and
pulls in unrelated articles (e.g. citrus).

This post-processor OVERRIDES the related picks for the native plant spotlights so
each one suggests 2 sibling plant features + 1 native overview guide -- a cohesive
"more California natives" reading path. Run AFTER build_related_manifest.py:
    py build_related_manifest.py && py build_native_related.py

To add the next wave: append the new {slug: title} to PLANTS (or OVERVIEWS) and
re-run. Idempotent. Writes related-manifest.json in place.
"""
import json

# California native PLANT spotlights (the cohesive series). slug -> display title.
PLANTS = {
    "grow-cleveland-sage-santa-cruz": "Cleveland Sage: A Fragrant California Native to Grow",
    "grow-narrowleaf-milkweed-santa-cruz": "Narrowleaf Milkweed: Plant the Right Monarch Host",
    "grow-western-redbud-santa-cruz": "Western Redbud: Spring Color for SC County Gardens",
    "grow-douglas-iris-santa-cruz": "Growing Douglas Iris in Santa Cruz County",
    "grow-california-fuchsia-santa-cruz": "California Fuchsia: Hummingbird Magnet for SC Gardens",
    "dudleya-california-native-succulents": "Growing Dudleya in Santa Cruz County",
    "grow-matilija-poppy-santa-cruz": "Growing Matilija Poppy in Santa Cruz County",
    "grow-california-lilac-ceanothus-santa-cruz": "California Lilac: The Drought-Proof Shrub That Blooms Blue",
    "garden-highlight-monkeyflower": "Growing Sticky Monkey Flower in Santa Cruz County",
    "garden-highlight-lupine": "California Lupine: A Wildflower That Feeds Your Soil",
    "growing-manzanita-santa-cruz": "Why Manzanita Is the Crown Jewel of California Native Gardens",
    "california-poppy-meaning-benefits-and-uses-beyond-the-garden": "California Poppy: Meaning, Benefits, and Uses Beyond the Garden",
    "grow-yarrow-santa-cruz": "Common Yarrow: A Tough California Native to Grow",
    "grow-hummingbird-sage-santa-cruz": "Hummingbird Sage: A Native for California Dry Shade",
    "grow-coyote-mint-santa-cruz": "Coyote Mint: A Fragrant Santa Cruz Native",
    "grow-california-buckwheat-santa-cruz": "California Buckwheat: A Native Pollinator Shrub",
    "grow-deergrass-santa-cruz": "Deergrass: A Tough California Native Bunchgrass",
    "grow-california-aster-santa-cruz": "California Aster: A Late-Season Native to Grow",
}

# Native overview / how-to guides (the "why & where" companions). slug -> title.
OVERVIEWS = {
    "native-plants-by-microclimate-what-to-grow-where-in-santa-cruz-county": "Native Plants by Microclimate: What to Grow Where in Santa Cruz County",
    "native-plants-for-pollinators": "Native Plants for Pollinators in Santa Cruz County",
    "benefits-native-garden-design-santa-cruz": "Native Garden Design in Santa Cruz County: A Complete Guide",
    "native-groundcovers-for-santa-cruz-gardens": "Native Groundcovers for Santa Cruz Gardens",
    "fire-wise-gardening-with-california-natives": "10 California Native Plants for a Fire-Safe Garden",
}


def card(slug, title):
    return {"title": title, "url": "/learn/" + slug}


def main():
    path = "related-manifest.json"
    m = json.load(open(path, encoding="utf-8"))
    plant_slugs = list(PLANTS)
    over_slugs = list(OVERVIEWS)
    n = len(plant_slugs)
    changed = 0
    # Each plant: next 2 sibling plants (rotated) + 1 overview (rotated) for variety.
    for i, slug in enumerate(plant_slugs):
        picks = [
            card(plant_slugs[(i + 1) % n], PLANTS[plant_slugs[(i + 1) % n]]),
            card(plant_slugs[(i + 2) % n], PLANTS[plant_slugs[(i + 2) % n]]),
            card(over_slugs[i % len(over_slugs)], OVERVIEWS[over_slugs[i % len(over_slugs)]]),
        ]
        m[slug] = picks
        changed += 1
    # Each overview: 3 plant spotlights (rotated).
    for j, slug in enumerate(over_slugs):
        picks = [card(plant_slugs[(j + k) % n], PLANTS[plant_slugs[(j + k) % n]]) for k in range(3)]
        m[slug] = picks
        changed += 1
    json.dump(m, open(path, "w", encoding="utf-8"), ensure_ascii=False)
    print("native-cluster overlay applied to", changed, "slugs;", len(m), "total")


if __name__ == "__main__":
    main()
