import urllib.request
import os
import re
from bs4 import BeautifulSoup
import html2text

base_url = "https://xyfx-fhw.github.io/RustCourse/chapters"
output_root = r"D:\00 Work\ai-web\rust-learning\content"

pages = [
    ("05-stdlib-types", "03-hashmaps"),
    ("05-stdlib-types", "04-practice"),
    ("06-type-system", "00-index"),
    ("06-type-system", "01-type-inference"),
    ("06-type-system", "02-type-casting"),
    ("06-type-system", "03-type-aliases"),
    ("06-type-system", "04-newtype-pattern"),
    ("07-modules", "00-index"),
    ("07-modules", "01-packages-crates"),
    ("07-modules", "02-modules"),
    ("07-modules", "03-paths-use"),
    ("08-engineering", "00-index"),
    ("08-engineering", "01-workspace"),
    ("08-engineering", "02-build-scripts"),
    ("08-engineering", "03-doc-comments"),
]

for chapter, lesson in pages:
    url = f"{base_url}/{chapter}/{lesson}/"
    out_dir = os.path.join(output_root, chapter)
    out_file = os.path.join(out_dir, f"{lesson}.md")

    os.makedirs(out_dir, exist_ok=True)

    print(f"Fetching: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8")

    soup = BeautifulSoup(raw, "lxml")

    # Find the article-content div
    content_div = soup.find("div", id="article-content")
    if not content_div:
        print(f"  WARN: No #article-content div in {url}, trying article.prose")
        article = soup.find("article", class_="prose")
        if article:
            content_div = article
        else:
            print(f"  SKIP: No content found")
            continue

    # Convert the inner content div to markdown using html2text
    h = html2text.HTML2Text()
    h.body_width = 0  # No line wrapping
    h.ignore_links = False
    h.ignore_images = False
    h.ignore_emphasis = False
    h.ignore_tables = False
    h.mark_code = True
    h.protect_links = True
    h.unicode_snob = True
    h.skip_internal_links = False
    h.images_to_alt = True
    h.escape_snob = True
    h.single_line_break = True

    md = h.handle(str(content_div))
    md = md.strip()

    # Clean up excessive blank lines
    md = re.sub(r'\n{4,}', '\n\n\n', md)

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(md)

    size = os.path.getsize(out_file)
    length = len(md)
    lines = md.count('\n') + 1
    print(f"  Saved: {out_file} ({size} bytes, {length} chars, {lines} lines)")
