# -*- coding: utf-8 -*-
# Builds ah-gfx-2026-july.html: 8 graphics for the two July 2026 articles
# (heat-wave-garden-survival-guide-california, fall-vegetable-planting-guide-santa-cruz).
# Brand v1.1. All color: declarations carry !important (Squarespace overrides inline styles).
# No emojis, no em-dashes.
import json

FOREST = "#1a3b2a"; CREAM = "#f8f9f0"; SAGE = "#dde2d8"
ROSEWOOD = "#8f4f45"; ROSE_TINT = "#d2a097"; INK = "#1c3c2c"
GOLD = "#c9a84c"; BRICK = "#962d28"

def head(title, sub):
    return ('<div style="width: 100%%; margin: 30px 0; font-family: \'Montserrat\', system-ui, sans-serif;">'
            '<div style="background-color: %s !important; color: %s !important; padding: 20px 25px; text-align: center;">'
            '<h2 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 5px 0; color: %s !important;">%s</h2>'
            '<p style="font-size: 0.85rem; margin: 0; opacity: 0.9; color: %s !important;">%s</p></div>'
            % (FOREST, CREAM, CREAM, title, CREAM, sub))

FOOT = ('<div style="background-color: %s !important; color: %s !important; text-align: center; '
        'padding: 12px; font-size: 0.75rem;">ambitiousharvest.com</div></div>' % (FOREST, CREAM))

def th(label, align='left'):
    return ('<th style="background-color: %s !important; color: %s !important; padding: 12px; text-align: %s; '
            'font-weight: 600; font-size: 0.8rem;">%s</th>' % (FOREST, CREAM, align, label))

def td(val, align='left', bold=False, color=INK):
    w = '700' if bold else '400'
    c = FOREST if bold else color
    return ('<td style="padding: 10px 12px; text-align: %s; font-size: 0.85rem; font-weight: %s; '
            'color: %s !important; vertical-align: top;">%s</td>' % (align, w, c, val))

def td2(name, sub):
    """ONE cell holding a bold label plus a quiet subtitle. Using two td() calls here
    would emit an extra column and push the last column out of the table."""
    return ('<td style="padding: 10px 12px; text-align: left; font-size: 0.85rem; '
            'color: %s !important; vertical-align: top;">'
            '<strong style="color: %s !important;">%s</strong>'
            '<div style="font-size: 0.78rem; color: #4a4a46 !important; margin-top: 3px;">%s</div></td>'
            % (FOREST, FOREST, name, sub))

def row(cells, alt=False):
    bg = ' background-color: %s !important;' % CREAM if alt else ''
    return '<tr style="border-bottom: 1px solid %s;%s">%s</tr>' % (SAGE, bg, ''.join(cells))

def table(headers, rows, minw=700):
    body = ''.join(row(r, alt=(i % 2 == 1)) for i, r in enumerate(rows))
    return ('<div style="overflow-x: auto;"><table style="width: 100%%; border-collapse: collapse; min-width: %dpx;">'
            '<thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>' % (minw, ''.join(headers), body))

def note(text):
    return ('<div style="background-color: %s !important; padding: 12px 15px; font-size: 0.8rem; '
            'color: %s !important; text-align: center;">%s</div>' % (SAGE, INK, text))

def cards(items):
    """items: list of (heading, [bullets], accent)"""
    out = ['<div style="display: flex; flex-wrap: wrap; gap: 0; background-color: #ffffff !important;">']
    for h, bullets, accent in items:
        lis = ''.join('<li style="margin-bottom: 7px; color: %s !important;">%s</li>' % (INK, b) for b in bullets)
        out.append(
            '<div style="flex: 1 1 240px; min-width: 240px; padding: 18px 20px; border-top: 4px solid %s; '
            'border-right: 1px solid %s;">'
            '<h3 style="font-family: Fraunces, Georgia, serif; font-size: 1rem; margin: 0 0 10px 0; '
            'color: %s !important;">%s</h3>'
            '<ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; line-height: 1.5;">%s</ul></div>'
            % (accent, SAGE, FOREST, h, lis))
    out.append('</div>')
    return ''.join(out)

G = {}

# ---------------- HEAT WAVE ----------------
HW = "heat-wave-garden-survival-guide-california"

G[HW + "-g1"] = (
    head("One Heat Wave, Three Different Gardens",
         "The same forecast lands very differently across Santa Cruz County") +
    table(
        [th("Zone"), th("What the heat wave looks like"), th("The main risk"), th("Do this first")],
        [
            [td("Coastal fog belt", bold=True) + td("Santa Cruz, Live Oak, Capitola, Aptos, Davenport. Lowest absolute temperatures, highest relative shock. Plants have almost no acclimation."),
             td("Leaf scorch and fruit sunburn on plants that looked healthy a week earlier. Damage is done in the first two afternoons."),
             td("Shade cloth over tomatoes and peppers before the fog breaks.", color=ROSEWOOD)],
            [td("Inland valleys", bold=True) + td("Watsonville and the Pajaro Valley, Scotts Valley, parts of Soquel. Several degrees hotter on the same afternoon, with a little more acclimation."),
             td("Genuinely damaging temperatures, more often. Scotts Valley runs hot by day and cold at night."),
             td("Deep water the day before, then water early each morning.", color=ROSEWOOD)],
            [td("San Lorenzo Valley redwoods", bold=True) + td("Felton, Ben Lomond, Boulder Creek, Brookdale. The canopy buffers air temperature, so the peak reading is often lower than Scotts Valley."),
             td("Not sunburn. Drought. Redwood duff is dry and root-competitive, and beds can go from moist to bone dry in 36 hours."),
             td("Check soil moisture daily, and mulch deeply.", color=ROSEWOOD)],
        ], minw=760) +
    note("Heat is relative. UC and CDPH define extreme heat against what is normal for your area, which is why a 95 degree day on the coast can outrank a 100 degree day inland.") +
    FOOT)

G[HW + "-g2"] = (
    head("Heat Wave Action Plan", "What to do before, during, and after") +
    table(
        [th("Task"), th("Before (1 to 2 days out)"), th("During the heat"), th("After it passes")],
        [
            [td("Watering", bold=True), td("Water deeply the day before. A hydrated plant handles heat far better than one you rescue mid-wave."), td("Water early in the morning. Check containers daily, sometimes twice."), td("Return to a normal deep, infrequent schedule. Do not keep soil soggy.")],
            [td("Shade", bold=True), td("Get shade cloth up over tomatoes, peppers, and anything with exposed fruit."), td("Leave it up. Cover the afternoon, not the morning."), td("Remove it once normal temperatures return so plants get full light again.")],
            [td("Containers", bold=True), td("Move pots into afternoon shade. Group them together."), td("Check moisture daily. Small pots may need water twice."), td("Move back gradually rather than all at once.")],
            [td("Harvest", bold=True), td("Pick anything close to ripe. Fruit on the plant is fruit at risk."), td("Harvest in the early morning, before the day heats up."), td("Assess what set fruit and what dropped flowers.")],
            [td("Fertilizer", bold=True), td("Stop. Do not push new growth into a heat wave."), td("None.", color=BRICK), td("Wait until the plant is actively growing again.")],
            [td("Pruning", bold=True), td("Leave the canopy alone. Those leaves are shading fruit."), td("None.", color=BRICK), td("Remove clearly dead tissue only, once you can tell what is dead.")],
            [td("Planting", bold=True), td("Postpone transplanting. A new root system cannot keep up."), td("None.", color=BRICK), td("Resume once night temperatures settle.")],
            [td("Soil", bold=True), td("Top up mulch to cover bare soil. Pull it back an inch from stems."), td("Leave it in place. It is doing the work."), td("Check depth again. Mulch settles and breaks down.")],
        ], minw=820) +
    note("The work happens before the heat arrives. Once it is 98 degrees, your options are already narrow.") +
    FOOT)

G[HW + "-g3"] = (
    head("Is It Wilting, or Is It Actually Thirsty?",
         "The question that causes the most unnecessary overwatering in July") +
    cards([
        ("Probably normal afternoon wilt",
         ["Perks back up by evening or the next morning",
          "Soil is still moist two to three inches down",
          "Big-leaved plants (squash, cucumber, melon) droop while their smaller-leaved neighbors do not",
          "No browning or crisping at the leaf margins",
          "<strong>Do nothing.</strong> This is a defense mechanism, not a distress signal."],
         FOREST),
        ("Real water stress",
         ["Still wilted the next morning after a cool night",
          "Soil is dry two to three inches down",
          "Leaf margins and tips are browning or crisp",
          "The whole plant looks dull or gray-green, not just droopy",
          "New growth and flower buds are dropping",
          "<strong>Water deeply</strong>, at the root zone, in the early morning."],
         BRICK),
    ]) +
    note("The most reliable tool you own is your finger. Push it past the mulch and past the top inch. If it is moist down there, the plant is managing.") +
    FOOT)

G[HW + "-g4"] = (
    head("Which Shade Cloth Percentage Do You Need?",
         "Shade cloth is rated by the percentage of light it blocks") +
    table(
        [th("Crop"), th("Density", "center"), th("Why")],
        [
            [td("Tomatoes, peppers, and other sun lovers", bold=True), td("20 to 40 percent", "center", color=ROSEWOOD), td("Enough to stop fruit sunburn without starving a plant that wants full sun.")],
            [td("General home garden default", bold=True), td("About 40 percent", "center", color=ROSEWOOD), td("UC Master Gardeners in Stanislaus County recommend 40 percent for home gardens and say anything higher is not necessary.")],
            [td("Lettuce, spinach, seedlings, cool-season crops", bold=True), td("50 to 60 percent", "center", color=ROSEWOOD), td("Delicate and cool-season plants need more protection than fruiting crops.")],
        ], minw=620) +
    '<div style="background-color: #ffffff !important; padding: 18px 22px;">'
    '<h3 style="font-family: Fraunces, Georgia, serif; font-size: 1rem; margin: 0 0 10px 0; color: %s !important;">The install matters as much as the percentage</h3>'
    '<ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; line-height: 1.6; color: %s !important;">'
    '<li style="color: %s !important;"><strong>Cover the afternoon, not the morning.</strong> Morning sun is not the problem.</li>'
    '<li style="color: %s !important;"><strong>Keep it above the canopy.</strong> For tall tomatoes that can mean eight feet. Cloth resting on leaves traps heat against them.</li>'
    '<li style="color: %s !important;"><strong>It does not need to reach the ground.</strong> Open sides help airflow.</li>'
    '<li style="color: %s !important;"><strong>Anchor it.</strong> Heat waves here arrive with offshore wind.</li>'
    '</ul></div>' % (FOREST, INK, INK, INK, INK, INK) +
    note("Row cover is not a substitute. It reduces light but traps heat, which is the opposite of what you want. Source: UC Master Gardeners, Contra Costa and Stanislaus counties.") +
    FOOT)

# ---------------- FALL PLANTING ----------------
FP = "fall-vegetable-planting-guide-santa-cruz"

G[FP + "-g1"] = (
    head("Count Back From Daylight, Not From Frost",
         "On this coast, shrinking light ends the season before cold does") +
    '<div style="background-color: #ffffff !important; padding: 20px 22px;">'
    '<ol style="margin: 0 0 18px 0; padding-left: 20px; font-size: 0.9rem; line-height: 1.65; color: %s !important;">'
    '<li style="color: %s !important; margin-bottom: 6px;"><strong>Set the target.</strong> Your crop should be at or near full size by <strong>mid-November</strong>, when day length drops through 10 hours.</li>'
    '<li style="color: %s !important; margin-bottom: 6px;"><strong>Take days to maturity</strong> from your seed packet or plant tag.</li>'
    '<li style="color: %s !important; margin-bottom: 6px;"><strong>Add two to four weeks</strong> of padding. Growth slows as light and temperature decline, so a packet\'s 60 days is a summer number.</li>'
    '<li style="color: %s !important; margin-bottom: 6px;"><strong>Add seed-to-transplant time</strong> if you are starting from seed rather than buying a start.</li>'
    '<li style="color: %s !important;"><strong>Count backward from mid-November.</strong> That is your sow date.</li>'
    '</ol></div>' % (INK, INK, INK, INK, INK, INK) +
    cards([
        ("Worked example: broccoli",
         ["Target: full size by mid-November",
          "Days to maturity: about 60 to 70 from transplant",
          "Fall padding: add 2 to 4 weeks",
          "Seed to transplant: about 6 weeks (UC Alameda)",
          "<strong>Start seed around August 1, transplant mid-September.</strong>"],
         FOREST),
        ("Worked example: arugula",
         ["Target: cutting size, not full size",
          "Days to maturity: roughly 30 to 40, direct sown",
          "Fall padding: add 2 to 4 weeks",
          "Seed to transplant: none, it is direct sown",
          "<strong>Sow in succession from September into October.</strong>"],
         ROSEWOOD),
    ]) +
    note("Day length in Santa Cruz falls from 14 hours 26 minutes on July 15 to 10 hours 11 minutes by November 15. Plants that are still small in November sit and wait for February. Source: U.S. Naval Observatory.") +
    FOOT)

G[FP + "-g2"] = (
    head("Fall Planting Windows for Santa Cruz County",
         "Six crop families, and when each one goes in") +
    table(
        [th("Crop"), th("Start indoors"), th("Direct sow"), th("Transplant out"), th("Notes")],
        [
            [td2("Brassicas", "broccoli, cauliflower, cabbage, kale, Brussels sprouts, collards, bok choy"),
             td("Mid-July to mid-August"), td("Not preferred"), td("Mid-August to late September"),
             td("Cauliflower is the fussy end. Brussels sprouts need a long cool season, so start in July.")],
            [td2("Leafy greens", "lettuce, spinach, chard, arugula, mustards, Asian greens"),
             td("July to August, in shade"), td("September onward"), td("Anytime through fall"),
             td("Lettuce fails above 85 degrees soil, spinach above 75. Hot soil, not bad seed, is why they do not come up.")],
            [td2("Root crops", "carrots, beets, radishes, turnips, parsnips"),
             td("Never", color=BRICK), td("Carrots and beets August to late September. Radishes and turnips August to October."), td("Never", color=BRICK),
             td("Direct sow only. A transplanted carrot forks. Keep the seedbed evenly moist to germinate.")],
            [td2("Alliums", "garlic, bulb onions, leeks, green onions"),
             td("Onions from seed, about 6 months out"), td("Garlic in October and November"), td("Leeks and green onions, late summer through fall"),
             td("Choose intermediate-day onions (12 to 14 hours). A long-day variety bred for Oregon will never bulb here.")],
            [td2("Peas and favas", "snap, snow, shelling, fava"),
             td("Not needed"), td("Peas late August to October. Favas October and November."), td("Not needed"),
             td("Peas are a fall crop here, not a spring one. They germinate best at 65 to 75 degrees soil.")],
            [td2("Cover crops", "vetch, bell beans, field peas, clovers"),
             td("Never", color=BRICK), td("October to early November"), td("Never", color=BRICK),
             td("Timed to the start of the rains. Buy legume inoculant when you buy the seed.")],
        ], minw=880) +
    note("Windows are for the coastal fog belt and Pajaro Valley. Plant on the early end in the San Lorenzo Valley. Source: UC Master Gardener Program.") +
    FOOT)

G[FP + "-g3"] = (
    head("Start Indoors, Direct Sow, or Buy Transplants?",
         "Each fall crop has a method that works and one that wastes your time") +
    cards([
        ("Start indoors (or in a shaded flat)",
         ["<strong>Brassicas:</strong> broccoli, cauliflower, cabbage, Brussels sprouts",
          "<strong>Lettuce and spinach in warm zones:</strong> late-summer soil is too hot to germinate them in the ground",
          "<strong>Why:</strong> you control soil temperature and moisture at the one stage that decides success, and you protect seedlings from slugs and birds"],
         FOREST),
        ("Direct sow",
         ["<strong>All root crops:</strong> carrots, beets, radishes, turnips, parsnips",
          "<strong>Peas and favas</strong>",
          "<strong>Arugula, mustards, Asian greens</strong> from September",
          "<strong>Garlic</strong> and <strong>cover crops</strong>",
          "<strong>Why:</strong> these resent transplanting. A moved carrot forks, and peas do not appreciate it either."],
         ROSEWOOD),
        ("Buy transplants",
         ["<strong>Brassicas</strong>, if you missed the mid-July to mid-August seeding window",
          "<strong>Any crop</strong> when you are starting late and the light budget is running out",
          "<strong>Why:</strong> a transplant buys back four to six weeks, which in a fall garden is the difference between a harvest and a plant that sits until February"],
         GOLD),
    ]) +
    note("The fall garden is less forgiving of a late start than the spring garden, because you cannot get the daylight back.") +
    FOOT)

G[FP + "-g4"] = (
    head("Your Microclimate Changes the Dates",
         "UC is explicit that regional planting dates are approximate. In this county, that variation is the whole story.") +
    table(
        [th("Zone"), th("Brassica transplants"), th("Greens, direct sown"), th("Frost risk"), th("Biggest limiting factor")],
        [
            [td2("Coastal fog belt", "Santa Cruz, Live Oak, Capitola, Aptos"),
             td("Late end of the window (September)"), td("Easiest in the county. Cool soil germinates lettuce and spinach early."),
             td("Low. An occasional nuisance, not a season-ender."),
             td("Slugs and snails. Pressure here is severe.", color=ROSEWOOD)],
            [td2("Pajaro Valley and Watsonville", "cool nights, good sun, deep soils"),
             td("Standard window (mid-August to late September)"), td("Standard. Follow the guide."),
             td("Possible on open valley floor on clear cold nights."),
             td("Nothing much. This is the county's cool-season powerhouse.", color=ROSEWOOD)],
            [td2("San Lorenzo Valley and redwood canyons", "Felton, Ben Lomond, Boulder Creek"),
             td("Early end of the window (mid to late August)"), td("Early. Sow before the light goes."),
             td("Highest. Cold air drains in at night, so frost arrives earlier and hits harder.", color=BRICK),
             td("Light. Under redwoods, heading brassicas may never finish. Grow greens and roots in your sunniest opening.", color=ROSEWOOD)],
            [td2("Warm inland pockets and banana belts", "Scotts Valley, parts of Soquel, ridge tops"),
             td("Standard, and they grow fast here in the shoulder season"), td("Wait for September, or start in flats in the shade."),
             td("Ridge tops above the fog also sit above the coldest air on winter nights."),
             td("Hot soil in late summer stops lettuce and spinach cold.", color=ROSEWOOD)],
        ], minw=900) +
    note("Not sure which one you are in? A map will not always tell you. Walk your own garden at 7am and 3pm.") +
    FOOT)

# ---------------- WRITE CLUSTER ----------------
lines = [
    '<!-- Ambitious Harvest Graphics: July 2026 Cluster -->',
    '<!-- 8 graphics: heat wave survival guide (4) + fall vegetable planting guide (4) -->',
    '<!-- Page URL: /ah-gfx-2026-july -->',
    '<script>',
    'window.AH_GRAPHICS = window.AH_GRAPHICS || {};',
    '',
]
for gid in G:
    lines.append('window.AH_GRAPHICS[%s] = %s;' % (json.dumps(gid), json.dumps(G[gid])))
    lines.append('')
lines.append('</script>')

with open('ah-gfx-2026-july.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('wrote ah-gfx-2026-july.html with %d graphics:' % len(G))
for gid in G:
    print('   %-52s %6d chars' % (gid, len(G[gid])))
