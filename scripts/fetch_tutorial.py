import urllib.request
import os
import re
import html as html_mod
from bs4 import BeautifulSoup, NavigableString, Tag

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

def elem_to_md(el, indent=0):
    """Convert an HTML element to markdown text."""
    if isinstance(el, NavigableString):
        text = str(el)
        # Decode HTML entities
        text = html_mod.unescape(text)
        return text

    tag = el.name
    result = ""

    if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
        level = int(tag[1])
        prefix = "#" * level
        text = elem_to_md(el, indent).strip()
        result = f"{prefix} {text}\n\n"

    elif tag == 'p':
        text = elem_to_md(el, indent).strip()
        if text:
            result = text + "\n\n"

    elif tag in ('ul', 'ol'):
        for child in el.find_all('li', recursive=False):
            li_text = elem_to_md(child, indent + 1).strip()
            if tag == 'ul':
                result += f"  * {li_text}\n"
            else:
                result += f"  1. {li_text}\n"
        result += "\n"

    elif tag == 'li':
        result = elem_to_md(el, indent).strip()

    elif tag == 'pre':
        code = el.get_text("\n", strip=False)
        # Clean up leading/trailing whitespace
        code = code.strip('\n')
        result = "    " + code.replace("\n", "\n    ") + "\n\n"

    elif tag == 'code':
        text = el.get_text()
        result = f"`{text}`"

    elif tag in ('strong', 'b', 'em', 'i'):
        text = elem_to_md(el, indent).strip()
        if tag in ('strong', 'b'):
            result = f"**{text}**"
        else:
            result = f"*{text}*"

    elif tag == 'a':
        text = elem_to_md(el, indent).strip()
        href = el.get('href', '')
        result = f"[{text}]({href})"

    elif tag in ('br', 'hr'):
        result = "\n\n---\n\n"

    elif tag == 'div':
        for child in el.children:
            result += elem_to_md(child, indent)

    elif tag in ('span', 'section', 'main'):
        for child in el.children:
            result += elem_to_md(child, indent)

    else:
        # Unknown tag, just recurse children
        for child in el.children:
            result += elem_to_md(child, indent)

    return result

for chapter, lesson in pages:
    url = f"{base_url}/{chapter}/{lesson}/"
    out_dir = os.path.join(output_root, chapter)
    out_file = os.path.join(out_dir, f"{lesson}.md")

    os.makedirs(out_dir, exist_ok=True)

    print(f"Fetching: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode("utf-8")

    soup = BeautifulSoup(raw, "lxml")

    # Find the article-content div
    content_div = soup.find("div", id="article-content")
    if not content_div:
        print(f"  WARN: No #article-content div in {url}")
        continue

    md = elem_to_md(content_div)
    md = html_mod.unescape(md)

    # Clean up excessive blank lines
    md = re.sub(r'\n{4,}', '\n\n\n', md)
    md = md.strip()

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(md)

    size = os.path.getsize(out_file)
    print(f"  Saved: {out_file} ({size} bytes)")
