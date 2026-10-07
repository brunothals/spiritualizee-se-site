#!/usr/bin/env python3
"""Screenshots de página inteira (desktop 1280 e mobile 390) com Playwright.
Uso: python tools/screenshots.py http://127.0.0.1:PORT/ /pasta/de/saida [pagina ...]
"""
import sys, os
from playwright.sync_api import sync_playwright
base, out = sys.argv[1], sys.argv[2]
pages = sys.argv[3:] or ["index.html", "consultas/index.html"]
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, vp, mobile in [("desktop-1280", {"width": 1280, "height": 900}, False), ("mobile-390", {"width": 390, "height": 844}, True)]:
        ctx = b.new_context(viewport=vp, device_scale_factor=1 if not mobile else 2, is_mobile=mobile, has_touch=mobile, reduced_motion="reduce")
        page = ctx.new_page()
        errs = []
        page.on("console", lambda m: m.type == "error" and errs.append(m.text))
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("requestfailed", lambda r: errs.append("FAILED " + r.url))
        for path in pages:
            page.goto(base + path, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            # rola a página para carregar imagens lazy
            page.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); }""")
            page.wait_for_load_state("networkidle")
            slug = path.replace("/index.html", "").replace(".html", "").replace("/", "-") or "home"
            slug = "home" if slug == "index" else slug
            f = f"{out}/{slug}-{name}.png"
            page.screenshot(path=f, full_page=True)
            fonts = page.evaluate("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i)")
            sw = page.evaluate("document.documentElement.scrollWidth")
            print(f, "fonts:", fonts, "scrollWidth:", sw, "errors:", errs or "none")
            errs.clear()
        ctx.close()
    b.close()
