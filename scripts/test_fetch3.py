"""Find the error-fix exercise structure in original HTML."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from bs4 import BeautifulSoup
import requests

url = "https://xyfx-fhw.github.io/RustCourse/chapters/01-rust-basics/02-hello-world"
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
resp.encoding = "utf-8"

soup = BeautifulSoup(resp.text, "lxml")
content_div = soup.find("div", id="article-content")

# Find the error-fix section - search for the paragraph about 错误修复
for p in content_div.find_all("p"):
    if "两处" in p.get_text() and "错误" in p.get_text():
        print("Found error-fix paragraph:")
        print(str(p)[:200])
        print()
        # Find next elements after this paragraph
        nxt = p.find_next_sibling()
        while nxt:
            print(f"Next sibling: <{nxt.name} class='{nxt.get('class','')}'>")
            if nxt.name == 'div' and 'code-runner' in nxt.get('class', []):
                print("  -> Is a CODE-RUNNER")
                print(f"  Full HTML (first 300 chars): {str(nxt)[:300]}")
            elif nxt.name == 'pre':
                print(f"  -> Is a PRE with class 'astro-code': {'astro-code' in nxt.get('class', [])}")
                print(f"  Full HTML (first 300 chars): {str(nxt)[:300]}")
            elif nxt.name in ('h1','h2','h3','h4'):
                break
            print()
            nxt = nxt.find_next_sibling()
        break
