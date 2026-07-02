"""
Improved version of reclone_site.py that:
1. Preserves <div class="code-runner"> as raw HTML pass-through
2. Preserves <quiz-choice> and <quiz-group> as raw HTML
3. Produces clean, well-formatted Markdown
"""
import urllib.request, urllib.parse, os, re, json, html as html_mod, time
from bs4 import BeautifulSoup, NavigableString, Tag

BASE_URL = "https://xyfx-fhw.github.io/RustCourse"
OUTPUT_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content")
DELAY = 0.5

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

def abs_url(src):
    if src.startswith("http"):
        return src
    src_clean = src
    for prefix in ["/RustCourse", "/rust-course", "/course"]:
        if src.startswith(prefix):
            src_clean = src[len(prefix):]
            break
    base = "https://xyfx-fhw.github.io"
    return base + src_clean

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
        src = el.get('src', '')
        alt = el.get('alt', '')
        # Rewrite remote images to local or keep absolute
        return f"![{alt}]({src})"
    if t == "span":
        return "".join(inline(c) for c in el.children)
    return "".join(inline(c) for c in el.children)

def blocks(container, depth=0):
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
        # Preserve quiz HTML elements as raw pass-through
        if t in ("quiz-choice", "quiz-group"):
            yield (str(child), "raw")
        # Preserve code-runner divs as raw HTML pass-through
        elif t == "div" and "code-runner" in child.get("class", []):
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
        elif t == "div":
            yield from blocks(child, depth + 1)
        elif t in ("section", "main", "article", "figure", "aside"):
            yield from blocks(child, depth + 1)

def list_blocks(el, ordered):
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
    line_spans = pre.select("span.line") if pre else []
    if line_spans:
        text = "\n".join(span.get_text() for span in line_spans)
    else:
        raw = pre.get_text()
        text = re.sub(r"\n\s*\n", "\n", raw).strip("\n")
    return text, lang

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

    # Quick quality check
    print("\n--- Quality Check ---")
    code_runner_count = 0
    quiz_count = 0
    total_md = 0
    for dirpath, dirnames, filenames in os.walk(OUTPUT_ROOT):
        for f in filenames:
            if f.endswith('.md'):
                total_md += 1
                fp = os.path.join(dirpath, f)
                with open(fp, 'r', encoding='utf-8') as fh:
                    content = fh.read()
                if 'code-runner' in content:
                    code_runner_count += 1
                if 'quiz-choice' in content:
                    quiz_count += 1
    print(f"Total MD files: {total_md}")
    print(f"Files with code-runner: {code_runner_count}")
    print(f"Files with quiz-choice: {quiz_count}")

if __name__ == "__main__":
    main()
