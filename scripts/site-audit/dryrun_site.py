import json, os, re, sys
from playwright.sync_api import sync_playwright
OUT = r"C:\Users\Adrie\AppData\Local\Temp\claude\C--Users-Adrie\27c318a7-1e62-46a0-9f85-08586d774e5f\scratchpad\audit2"
os.makedirs(OUT, exist_ok=True)
src = open(r"C:\Users\Adrie\OneDrive\Ambitious Harvest Co\Website\ah-graphics\ah-site-scripts.js", encoding="utf-8").read()
i = src.find("// === SITE FLOW PASS")
block = src[i:]
# also the CSS planned for the Custom CSS panel
panel_css = open(r"C:\Users\Adrie\AppData\Local\Temp\claude\C--Users-Adrie\27c318a7-1e62-46a0-9f85-08586d774e5f\scratchpad\panel.css", encoding="utf-8").read()
pages = sys.argv[1:] or ["start-here","your-garden-toolkit","garden-review","about","contact","garden-conditions","tomato-quiz","build-your-flock","local-resources","planting-calendar"]
MEASURE = r"""
() => ({total: document.documentElement.scrollHeight, navWraps: (()=>{const items=[...document.querySelectorAll('.header-nav-item')].filter(i=>i.getBoundingClientRect().width>0); const tops=[...new Set(items.map(i=>Math.round(i.getBoundingClientRect().top)))]; return tops.length;})(),
 secs:[...document.querySelectorAll('section[data-section-id]')].map(s=>({id:s.dataset.sectionId.slice(-6),h:Math.round(s.getBoundingClientRect().height)})),
 btns:[...document.querySelectorAll('a.sqs-block-button-element, .form-wrapper .button')].slice(0,6).map(b=>getComputedStyle(b).backgroundColor)})
"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw, tag in [(1440, ""), (390, "-m")]:
        ctx = b.new_context(viewport={"width": vw, "height": 900}, is_mobile=(vw < 500), user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
        for path in (pages if vw == 1440 else ["start-here", "your-garden-toolkit", ""]):
            pg = ctx.new_page()
            pg.goto("https://www.ambitiousharvest.com/" + path, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(1500)
            before = pg.evaluate(MEASURE)
            pg.add_style_tag(content=panel_css)
            pg.evaluate(block)
            pg.wait_for_timeout(1200)
            h = pg.evaluate("document.documentElement.scrollHeight"); y = 0
            while y < h:
                pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(100); y += 700
                h = pg.evaluate("document.documentElement.scrollHeight")
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(500)
            after = pg.evaluate(MEASURE)
            name = (path or "home") + tag
            res[name] = {"before": before, "after": after}
            pg.screenshot(path=os.path.join(OUT, name + ".png"), full_page=True)
            print(name, before["total"], "->", after["total"], "navRows", before["navWraps"], "->", after["navWraps"], "btns", after["btns"][:3])
            pg.close()
        ctx.close()
    b.close()
json.dump(res, open(os.path.join(OUT, "dryrun.json"), "w"), indent=1)
