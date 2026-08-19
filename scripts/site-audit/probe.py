import json, sys
from playwright.sync_api import sync_playwright
JS = r"""
() => {
  const nav=document.querySelector('.header-nav'); const items=[...document.querySelectorAll('.header-nav-item a')];
  const cs=items[0]?getComputedStyle(items[0]):null;
  const navR=nav?nav.getBoundingClientRect():null;
  const hdr=document.querySelector('#header .header-inner, #header .header-layout-nav-center, #header');
  const titleNav=document.querySelector('.header-title-nav-wrapper');
  const actions=document.querySelector('.header-actions');
  const btns=[...document.querySelectorAll('a.sqs-block-button-element, .header-actions .btn, button.sqs-button-element--primary')].slice(0,12).map(b=>({t:b.textContent.trim().slice(0,20),cls:b.className.slice(0,80),bg:getComputedStyle(b).backgroundColor}));
  const secs=[...document.querySelectorAll('section[data-section-id]')].map(s=>{const fe=s.querySelector('.fluid-engine'); const blk=s.querySelector('.fe-block'); return {id:s.dataset.sectionId, h:Math.round(s.getBoundingClientRect().height), cls:(s.className.match(/section-height--\w+|background-width--[\w-]+/g)||[]).join(' '), theme:s.getAttribute('data-section-theme'), minH:getComputedStyle(s).minHeight, cwMinH:s.querySelector('.content-wrapper')?getComputedStyle(s.querySelector('.content-wrapper')).minHeight:null, feRows:fe?getComputedStyle(fe).gridTemplateRows.split(' ').length:null, blocks:[...s.querySelectorAll('.fe-block')].map(b=>({id:b.className.match(/fe-block-[\w-]+/)[0], ga:getComputedStyle(b).gridArea, h:Math.round(b.getBoundingClientRect().height), contentH:Math.round((b.querySelector('.sqs-block-content')||b).getBoundingClientRect().height), type:(b.querySelector('.sqs-block')||{}).className}))};});
  return {iw:innerWidth, nav:{font:cs&&cs.fontSize, ls:cs&&cs.letterSpacing, pad:cs&&cs.padding, weight:cs&&cs.fontWeight, items:items.map(a=>a.textContent.trim()), navW:navR&&Math.round(navR.width), navH:navR&&Math.round(navR.height), titleNavW:titleNav&&Math.round(titleNav.getBoundingClientRect().width), actionsW:actions&&Math.round(actions.getBoundingClientRect().width), itemWidths:items.map(a=>Math.round(a.closest('.header-nav-item').getBoundingClientRect().width)), itemMargin:items[0]&&getComputedStyle(items[0].closest('.header-nav-item')).margin}, btns, secs};
}
"""
pages = sys.argv[1:] or ["/start-here"]
out = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width":1440,"height":900}, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
    for path in pages:
        pg = ctx.new_page()
        pg.goto("https://www.ambitiousharvest.com/"+path.lstrip("/"), wait_until="networkidle", timeout=60000)
        pg.wait_for_timeout(2000)
        out[path] = pg.evaluate(JS)
        pg.close()
    b.close()
json.dump(out, open("probe.json","w"), indent=1)
