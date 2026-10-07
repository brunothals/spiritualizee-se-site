#!/usr/bin/env python3
"""Verifica links e assets locais do site.

Uso:  python3 -m http.server 8765  (na raiz do repo, em outro terminal)
      python3 tools/check_links.py http://localhost:8765/
Rastreia todas as páginas a partir da home, confere se cada href/src local responde 200
e se as âncoras (#id) existem na página de destino. Links externos são só listados.
"""
import sys, re, urllib.request, urllib.parse
from html.parser import HTMLParser

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8765/"

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.ids = set()
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a: self.ids.add(a["id"])
        for k in ("href", "src"):
            if a.get(k): self.links.append((tag, a[k]))

cache = {}
def fetch(url):
    if url in cache: return cache[url]
    try:
        r = urllib.request.urlopen(url, timeout=10)
        body = r.read(); res = (r.status, r.headers.get_content_type(), body)
    except urllib.error.HTTPError as e:
        res = (e.code, "", b"")
    except Exception as e:
        res = (0, str(e), b"")
    cache[url] = res; return res

def parse(url):
    st, ct, body = fetch(url)
    p = P()
    if ct == "text/html": p.feed(body.decode("utf-8", "replace"))
    return p

errors, external, pages = [], set(), []
todo, seen = [BASE + "index.html"], set()
while todo:
    page = todo.pop()
    if page in seen: continue
    seen.add(page); pages.append(page)
    st, ct, _ = fetch(page)
    if st != 200: errors.append(f"{page} -> HTTP {st}"); continue
    p = parse(page)
    for tag, link in p.links:
        if link.startswith(("mailto:", "tel:", "javascript:")): continue
        absu = urllib.parse.urljoin(page, link)
        if not absu.startswith(BASE):
            external.add(absu); continue
        target, _, frag = absu.partition("#")
        st2, ct2, _ = fetch(target)
        if st2 != 200:
            errors.append(f"{page}: {tag} {link} -> HTTP {st2}"); continue
        if frag and ct2 == "text/html" and frag not in parse(target).ids:
            errors.append(f"{page}: âncora inexistente {link}")
        if ct2 == "text/html" and target.endswith(".html"): todo.append(target)
    # CSS url(...)
for css in [u for u in cache if u.endswith(".css")]:
    for ref in re.findall(r"url\(\"?([^\")]+)\"?\)", cache[css][2].decode()):
        if ref.startswith(("data:", "http")): continue
        u = urllib.parse.urljoin(css, ref)
        if fetch(u)[0] != 200: errors.append(f"{css}: url({ref}) -> HTTP {fetch(u)[0]}")

print(f"páginas verificadas: {len(pages)}")
for p in sorted(pages): print("  ", p.replace(BASE, "/"))
print(f"recursos locais verificados: {len([u for u in cache if u.startswith(BASE)])}")
print(f"links externos (não verificados): {len(external)}")
for e in sorted(external): print("   ", e)
if errors:
    print(f"\nERROS ({len(errors)}):"); [print("  ", e) for e in errors]; sys.exit(1)
print("\nOK: nenhum link ou asset local quebrado.")
