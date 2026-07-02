# Handoff — Time / Net Worth / ROI Maximization Project

**Date:** 2026-07-02
**Repo:** `gaughanadrienne-gif/ah-graphics` (Ambitious Harvest site graphics + embeds, Squarespace + GitHub Pages)
**Working branch:** `claude/time-roi-maximization-02ueqy` (pushed, **not merged** — no PR opened yet)
**Owner:** Adrienne Gaughan (gaughanadrienne@gmail.com)

---

## 1. Strategy context (decisions already made — don't re-litigate)

Adrienne is evaluating side-income streams alongside a full-time Chief of Staff role.
Six viable plays were assessed and sequenced. The through-line: **everything routes
through the email list** — it's the one owned asset. Agreed sequencing:

| When | Play | Status |
|------|------|--------|
| July | Affiliate audit of top-20 traffic pages | Not started |
| July | **UGC portfolio + pitching** (cash-now play, capped ~4 hrs/wk) | **Built this session — see §2** |
| July | Webinar funnel assets (registration page, email sequence) | Not started — **deadline-bound** |
| July (background) | Etsy digital-download shop, first 3–4 listings | Approved, not started — see §4 |
| Aug–Sep | Run fall webinar live 2–3×, pitch existing SKUs or a group cohort | Depends on July build |
| Aug+ | Slow-drip LinkedIn CoS content (1–2 posts/wk) | Blocked on §5 employment-agreement check |
| Q4 | Evergreen webinar replay; printed 9b/10a planner via Amazon KDP; newsletter sponsorships | Planned |
| 2027 | Garden digital-services agency (productized, not custom) | Deferred |
| Skip | Kindle ebooks, YouTube long-form | Rejected (poor ROI-per-hour) |

**Hard deadline driving everything:** fall-garden urgency in Zones 9b/10a peaks
Aug–Sep. Webinar must run live in mid-August or the window closes until spring.
If anything competes with webinar prep for hours, webinar wins.

Existing paid SKUs (webinar pitch products — do NOT build a new course):
**Tomato Growing MasterKit (California Edition)** and the **Berry Growing Guide**.
Existing lead magnets: 5 cheat-sheet PDFs at repo root (seed starting, berries,
peppers, natives/drought, predator-proof coop checklist).

## 2. Work completed this session — UGC portfolio kit

All on branch `claude/time-roi-maximization-02ueqy`, commit `daf8334`:

- **`work-with-brands-embed.html`** — Squarespace code-block embed for a new
  `/work-with-brands` page. Matches site brand system (Fraunces headings, Montserrat
  body, forest `#1c3c2c` / cream `#f8f9f0` / sage `#dde2d8`). Follows the site's
  existing pattern (see `local-resources-embed.html`): static shell + content fetched
  from a JSON data file on GitHub Pages. Sections: hero + credibility chips, 4 content
  formats, video portfolio grid, 3 pricing packages + add-ons table, 4-step process,
  mailto CTA. **Render-verified in Chromium, desktop (1200px) + mobile (390px), no JS
  errors; en-dashes converted to `&ndash;` entities for charset safety.**
- **`work-with-brands-data.json`** — drives the page. 5 video slots (all
  `comingSoon: true` placeholders), packages ($175 single / $450 3-pack / from
  $600/mo), 5 add-ons, `contactEmail` (currently her gmail — swap when a branded
  address exists), `updated` date stamp shown on page.
- **`ugc/portfolio-video-scripts.md`** — 5 beat-by-beat shootable scripts with shot
  lists, hook variations, and CTAs: tool demo, seed unboxing, coop predator-proofing
  story, voiceover "90-minute weekend garden," berry before/after testimonial.
  Deliberately 5 different formats to demonstrate range. Shooting order: 1 → 2 → 4 → 3 → 5.
- **`ugc/pitch-templates.md`** — cold email, DM, follow-up, warm template for her
  existing Stellar-panel brand relationships (send those FIRST), 25-pitch July target
  list (warm → niche → volume), platform list (Billo, Insense, JoinBrands, Trend),
  private rate card, and scripted negotiation answers (usage rights, gifted-only,
  buyouts, exclusivity).

**Rate logic:** public page says "from $175"; private floor is $150 for the first 5
paid videos, then $250, then $300–350 after 10. Ad usage +30%/90 days, whitelisting
+$100/video/mo — never free.

## 3. Known state / gotchas for the next agent

1. **The page fetches `https://gaughanadrienne-gif.github.io/ah-graphics/work-with-brands-data.json`
   — which 404s until the branch merges to main** (GitHub Pages serves from main).
   Until then the page shows its graceful-fallback message. Merging is the unblock.
2. The embed goes into a **Squarespace Code Block** on a new `/work-with-brands` page —
   a human (or desktop agent with site access) must create that page and paste the block.
3. To publish a portfolio video: upload unlisted to YouTube → paste
   `https://www.youtube.com/embed/VIDEO_ID` into the video's `embed` field in the JSON →
   set `comingSoon: false` → push to main. `mp4` + `poster` fields also supported.
4. No PR was opened (not requested). Repo has no CI.
5. Repo conventions: embeds are `*-embed.html` + `*-data.json` pairs fetched from
   GitHub Pages; site-wide JS lives in `ah-site-scripts.js`; recent site change moved
   all headings to Fraunces — new pages should use it.

## 4. Next steps (priority order)

**Adrienne (only she can do these):**
- [ ] Film videos 1 (tool demo) and 2 (unboxing) this week per `ugc/portfolio-video-scripts.md`; page is pitch-ready with 3 of 5 slots filled
- [ ] Check employment agreement for outside-content restrictions **before** any LinkedIn CoS posting; plan to tell Jesse & Ryan directly
- [ ] Decide on a branded contact email (replace gmail in `work-with-brands-data.json`)
- [ ] Merge the branch to main; create `/work-with-brands` page in Squarespace and paste the embed

**Agent-executable next:**
- [ ] **Webinar funnel build** (deadline-bound, mid-August live date): registration
      page, 3 reminder emails, 3–4 value emails, slide outline for "Your Santa Cruz
      Fall Garden: what to plant in the next 30 days," pitch = existing SKUs or a
      4-week "Fall Garden Kickstart" cohort ($150–250, 10–15 seats)
- [ ] **Etsy first batch** (approved, background priority): paid expanded Seed Starting
      + Berry cheat sheets, "Fall Garden Planner for Coastal California," seed
      inventory tracker. Rules agreed: **different SKUs than the site** (never list
      MasterKit/Berry Guide — price anchoring), **every PDF carries a bonus link** to a
      free companion download on ambitiousharvest.com (converts Etsy buyers to email
      subscribers), regional 9b/10a positioning throughout. Listing titles/tags/
      descriptions + product PDFs can be generated from the existing graphics pipeline.
- [ ] Affiliate audit of top-20 traffic pages (highest ROI-per-hour item still open)
- [ ] Pinterest pins pointing at `/work-with-brands` and (later) webinar registration —
      pin production system already exists in this repo (`pins/`, `social-pins/`)

**Explicitly deferred / rejected:** Kindle ebook conversions (skip), YouTube long-form
(skip for now), agency (2027, productized only), Amazon KDP paperback planner (Q4 —
only pre-work is creating the KDP account).

## 5. Open questions for Adrienne

- Employment agreement: any restriction on outside professional content? (Blocks LinkedIn play.)
- Branded email address for brand inquiries?
- Which Stellar-panel brands are the warm-pitch shortlist? (Template 4 in the pitch kit is waiting on names.)
- Webinar date commitment: which mid-August week? Working backward, registration assets need to be live ~2 weeks prior.
