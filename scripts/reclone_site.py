"""
reclone_site.py — RustCourse content recloner

Phase 1: Reconnaissance — extract all 135 page slugs from live site
Phase 2: Systematic fetch — fetch every page, convert HTML to clean Markdown
Phase 3: Verify — check completeness and quality

Converts Astro's HTML article-content to proper Markdown with:
- # headings
- **bold**, *italic*, `code`
- Fenced code blocks with language
- Lists, tables, blockquotes
- Relative links rewritten as SPA hash links
- Quiz/raw HTML preserved
"""

import urllib.request, urllib.parse, os, re, json, html as html_mod, time
from bs4 import BeautifulSoup, NavigableString, Tag

BASE_URL = "https://xyfx-fhw.github.io/RustCourse"
OUTPUT_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content")

DELAY = 0.8


# ── Fetching ────────────────────────────────────────────────────────

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def get_slugs():
    print("Reconnaissance: fetching homepage ...")
    html = fetch(BASE_URL + "/")
    soup = BeautifulSoup(html, "lxml")
    np = soup.find(id="nav-progress")
    if np and np.get("data-slugs"):
        slugs = json.loads(html_mod.unescape(np["data-slugs"]))
        print(f"  Found {len(slugs)} slugs")
        return slugs
    print("  ERROR: data-slugs not found")
    return []


# ── Inline conversion ───────────────────────────────────────────────

def inline(el):
    if isinstance(el, NavigableString):
        return html_mod.unescape(str(el))
    if not isinstance(el, Tag):
        return ""
    t = el.name
    if t in ("strong", "b"):
        inner = "".join(inline(c) for c in el.children).strip()
        return f"**{inner}**" if inner else ""
    if t in ("em", "i"):
        inner = "".join(inline(c) for c in el.children).strip()
        return f"*{inner}*" if inner else ""
    if t == "code":
        return f"`{el.get_text()}`"
    if t == "a":
        text = "".join(inline(c) for c in el.children).strip()
        href = link(el.get("href", ""))
        return f"[{text}]({href})" if text else f"[{href}]({href})"
    if t == "br":
        return "\n"
    if t == "img":
        return f"![{el.get('alt', '')}]({abs_url(el.get('src', ''))})"
    if t == "span":
        return "".join(inline(c) for c in el.children)
    # fallback
    return "".join(inline(c) for c in el.children)


def link(href):
    if not href:
        return "#"
    if href.startswith("/RustCourse/"):
        p = href.replace("/RustCourse", "").rstrip("/")
        if p.startswith("/chapters/"):
            return f"#/chapters/{p.replace('/chapters/', '')}"
        return f"#{p}" if p else "#"
    if href.startswith("./"):
        return f"#/chapters/{href.replace('./', '')}"
    return href


def abs_url(src):
    if src.startswith("http"):
        return src
    if src.startswith("/"):
        # Remove subpath prefix if src already has it
        src_clean = src
        for prefix in ["/RustCourse", "/rust-course", "/course"]:
            if src.startswith(prefix):
                src_clean = src[len(prefix):]
                break
        # Base URL without subpath
        base = "https://xyfx-fhw.github.io"
        return base + src_clean
    return src


# ── Block conversion ────────────────────────────────────────────────

def blocks(container, depth=0):
    """Yield (text, kind) tuples from an HTML container."""
    if depth > 20:
        return
    for child in container.children:
        if isinstance(child, NavigableString):
            t = str(child).strip()
            if t:
                yield (html_mod.unescape(t), "")
            continue
        if not isinstance(child, Tag):
            continue

        t = child.name
        if t in ("quiz-choice", "quiz-group"):
            yield (str(child), "raw")
        elif t in ("h1", "h2", "h3", "h4", "h5", "h6"):
            text = "".join(inline(c) for c in child.children).strip()
            yield (f"{'#' * int(t[1])} {text}", "")
        elif t == "p":
            text = "".join(inline(c) for c in child.children).strip()
            if text:
                yield (text, "")
        elif t == "ul":
            yield from list_blocks(child, False)
        elif t == "ol":
            yield from list_blocks(child, True)
        elif t == "pre":
            code, lang = extract_code(child)
            if code:
                yield (f"```{lang}\n{code}\n```", "code")
        elif t == "blockquote":
            text = "".join(inline(c) for c in child.children).strip()
            lines = text.split("\n")
            yield ("\n".join(f"> {l.strip()}" for l in lines if l.strip()), "")
        elif t == "table":
            yield (convert_table(child), "")
        elif t == "img":
            yield (f"![{child.get('alt', '')}]({abs_url(child.get('src', ''))})", "")
        elif t == "hr":
            yield ("---", "")
        elif t == "div" and "code-runner" in child.get("class", []):
            code, lang = extract_code_runner(child)
            if code:
                yield (f"```{lang}\n{code}\n```", "code")
        elif t == "div":
            yield from blocks(child, depth + 1)
        elif t in ("section", "main", "article", "figure", "aside"):
            yield from blocks(child, depth + 1)


def list_blocks(el, ordered):
    """Yield (text, 'list') for each list item."""
    prefix = "1." if ordered else "-"
    for li in el.find_all("li", recursive=False):
        text = flatten_li(li)
        if text.strip():
            yield (f"{prefix} {text.strip()}", "list")


def flatten_li(li):
    parts = []
    for child in li.children:
        if isinstance(child, NavigableString):
            t = str(child).strip()
            if t:
                parts.append(html_mod.unescape(t))
            continue
        if child.name == "p":
            parts.append("".join(inline(c) for c in child.children).strip())
        elif child.name in ("ul", "ol"):
            for n, _ in list_blocks(child, child.name == "ol"):
                parts.append(f"  {n}")
        else:
            parts.append("".join(inline(c) for c in child.children).strip())
    return " ".join(p for p in parts if p)


def extract_code(pre):
    code_tag = pre.find("code")
    lang = ""
    if pre.get("data-language"):
        lang = pre["data-language"]
    if code_tag and not lang:
        for cls in code_tag.get("class", []):
            if cls.startswith("language-"):
                lang = cls.replace("language-", "")
                break
    text = pre.get_text("\n").strip("\n")
    return text, lang


def extract_code_runner(div):
    full = div.get("data-full-code", "")
    if full:
        code = urllib.parse.unquote(full).strip()
    else:
        pre = div.find("pre")
        code = pre.get_text("\n").strip() if pre else ""
    lang = "rust"
    code_tag = div.find("code")
    if code_tag:
        for cls in code_tag.get("class", []):
            if cls.startswith("language-"):
                lang = cls.replace("language-", "")
                break
    return code, lang


def convert_table(el):
    rows = el.find_all("tr")
    if not rows:
        return ""
    md = []
    for ri, row in enumerate(rows):
        cells = row.find_all(["th", "td"])
        texts = ["".join(inline(c) for c in cell.children).strip() for cell in cells]
        md.append("| " + " | ".join(texts) + " |")
    ncols = md[0].count("|") - 1
    sep = "| " + " | ".join(["---"] * ncols) + " |"
    return "\n".join([md[0], sep] + md[1:])


# ── Assembly ─────────────────────────────────────────────────────────

def assemble(items):
    out = []
    prev_kind = None
    for text, kind in items:
        if kind == "list":
            if prev_kind is not None and prev_kind != "list" and prev_kind != "code" and prev_kind != "raw":
                if out and out[-1] != "":
                    out.append("")
            out.append(text)
        elif kind == "code":
            if out and out[-1] != "":
                out.append("")
            out.append(text)
            out.append("")
        elif kind == "raw":
            if out and out[-1] != "":
                out.append("")
            out.append(text)
            out.append("")
        else:
            if prev_kind == "list" and out and out[-1] != "":
                out.append("")
            out.append(text)
            out.append("")
        prev_kind = kind

    result = "\n".join(out)
    result = re.sub(r"\n{4,}", "\n\n\n", result)
    return result.strip()


# ── Fetch & save ────────────────────────────────────────────────────

def clean(article):
    for sel in article.find_all(class_="section-progress"):
        sel.decompose()
    for sel in article.find_all(class_="article-meta"):
        sel.decompose()
    for sel in article.find_all("script"):
        sel.decompose()
    return article


def process(slug, idx, total):
    url = f"{BASE_URL}/chapters/{slug}/"
    print(f"  [{idx}/{total}] {slug}")

    try:
        html = fetch(url)
    except Exception as e:
        print(f"    ERROR: {e}")
        return False

    soup = BeautifulSoup(html, "lxml")
    article = soup.find("div", id="article-content")
    if not article:
        article = soup.find("article", class_="prose")
    if not article:
        print(f"    WARN: no content")
        return False

    article = clean(article)

    items = list(blocks(article))
    md = assemble(items)

    parts = slug.split("/")
    if len(parts) != 2:
        print(f"    WARN: bad slug")
        return False
    ch, lesson = parts

    d = os.path.join(OUTPUT_ROOT, ch)
    os.makedirs(d, exist_ok=True)

    path = os.path.join(d, f"{lesson}.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(md)

    print(f"    -> {ch}/{lesson}.md ({os.path.getsize(path)}b)")
    return True


def main():
    slugs = get_slugs()
    if not slugs:
        return

    total = len(slugs)
    print(f"\nFetching & converting {total} pages ...\n")

    ok = 0
    fails = []
    for idx, slug in enumerate(slugs, 1):
        time.sleep(DELAY)
        if process(slug, idx, total):
            ok += 1
        else:
            fails.append(slug)

    print(f"\nDone: {ok}/{total}")
    if fails:
        print(f"Failed: {len(fails)}: {', '.join(fails)}")

    ch23 = [s.split("/")[1] for s in slugs if s.startswith("23-projects/") and s != "23-projects/00-index"]
    print(f"\nLive ch23: {ch23}")
    print("Update data.js ch23 lessons to match")


if __name__ == "__main__":
    main()
