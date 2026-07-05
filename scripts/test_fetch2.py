"""Debug: check what code-runner structure looks like in BS4."""
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

# Count code-runners
runners = content_div.find_all("div", class_="code-runner")
print(f"BS4 found {len(runners)} code-runner divs")

for i, r in enumerate(runners):
    inner_pre = r.find("pre")
    has_code = inner_pre and inner_pre.find("code")
    has_span = inner_pre and inner_pre.find("span")
    mode = r.get("data-mode", "?")
    print(f"  Runner {i}: data-mode={mode}, has_pre={inner_pre is not None}, has_code={has_code}, has_span={has_span}")
    if inner_pre and has_span:
        # Print first 100 chars of the pre
        pre_str = str(inner_pre)
        print(f"    pre starts: {pre_str[:150]}")

# Also count astro-code blocks
astro = content_div.find_all("pre", class_="astro-code")
print(f"\nBS4 found {len(astro)} astro-code pre blocks")
for i, a in enumerate(astro):
    print(f"  Astro {i}: lang={a.get('data-language','')}, has_span={bool(a.find('span'))}")
