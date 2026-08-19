import json, os, sys, time
from playwright.sync_api import sync_playwright

OUT = r"./audit"
os.makedirs(OUT, exist_ok=True)
PAGES = [
    ("start-here", "/start-here"),
    ("learn", "/learn"),
    ("planting-calendar", "/planting-calendar"),
    ("garden-conditions", "/garden-conditions"),
    ("toolkit", "/your-garden-toolkit"),
    ("garden-events", "/garden-events"),
    ("local-resources", "/local-resources"),
    ("build-your-flock", "/build-your-flock"),
    ("tomato-quiz", "/tomato-quiz"),
    ("garden-consulting", "/garden-review"),
    ("about", "/about"),
    ("store", "/store"),
    ("contact", "/contact"),
    ("article", "/learn/plants-repel-garden-pests-california"),
]
JS = r"""
() => {
  const secs=[...document.querySelectorAll('section[data-section-id], #footer-sections, header#header')].map(s=>{
    const r=s.getBoundingClientRect();
    const heads=[...s.querySelectorAll('h1,h2,h3,h4')].slice(0,4).map(h=>h.tagName+':'+h.textContent.trim().slice(0,50));
    const btns=[...s.querySelectorAll('a.sqs-block-button-element, a.btn, button, .sqs-block-button a')].map(b=>{const cs=getComputedStyle(b);return (b.textContent||'').trim().slice(0,25)+' ['+cs.backgroundColor+']'}).slice(0,8);
    const cw=s.querySelector('.content-wrapper');
    return {id:(s.dataset.sectionId||s.id||'').slice(-6), top:Math.round(r.top+scrollY), h:Math.round(r.height), theme:s.getAttribute('data-section-theme'), heightCls:(s.className.match(/section-height--\w+/)||[''])[0], heads, btns, blocks:s.querySelectorAll('.fe-block, .sqs-block').length, text:(s.innerText||'').trim().replace(/\s+/g,' ').slice(0,90)};
  });
  const h1s=[...document.querySelectorAll('h1')].map(h=>h.textContent.trim().slice(0,80));
  const imgs=[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>50).length;
  const forms=document.querySelectorAll('form').length;
  return {title:document.title, total:document.documentElement.scrollHeight, h1s, imgs, forms, secs};
}
"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width":1440,"height":900}, device_scale_factor=1, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
    for name, path in PAGES:
        pg = ctx.new_page()
        try:
            pg.goto("https://www.ambitiousharvest.com/"+path.lstrip("/")+"?v=final", wait_until="networkidle", timeout=60000)
        except Exception as e:
            print(name, "goto warn", str(e)[:80])
        pg.wait_for_timeout(2500)
        # scroll through to trigger lazy loads
        h = pg.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < h:
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(150); y += 700
            h = pg.evaluate("document.documentElement.scrollHeight")
        pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(800)
        data = pg.evaluate(JS)
        data["url"] = path
        res[name] = data
        try:
            pg.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=True)
        except Exception as e:
            print(name, "shot warn", str(e)[:80])
        print(name, data["total"], len(data["secs"]), "secs", data["h1s"][:1])
        pg.close()
    # mobile pass for a few
    m = b.new_context(viewport={"width":390,"height":844}, device_scale_factor=1, is_mobile=True, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    for name, path in [("home-mobile","/"),("start-here-mobile","/start-here"),("store-mobile","/store"),("article-mobile","/learn/plants-repel-garden-pests-california")]:
        pg = m.new_page()
        try:
            pg.goto("https://www.ambitiousharvest.com/"+path.lstrip("/")+"?v=final", wait_until="networkidle", timeout=60000)
        except Exception as e:
            print(name, "goto warn", str(e)[:80])
        pg.wait_for_timeout(2500)
        h = pg.evaluate("document.documentElement.scrollHeight"); y=0
        while y < h:
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(120); y += 600
            h = pg.evaluate("document.documentElement.scrollHeight")
        pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
        res[name] = {"total": h, "url": path}
        try:
            pg.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=True)
        except Exception as e:
            print(name, "shot warn", str(e)[:80])
        print(name, h)
        pg.close()
    b.close()
json.dump(res, open(os.path.join(OUT, "metrics.json"), "w"), indent=1)
print("done")
