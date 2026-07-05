"""
Fetch ALL lesson content from the original Astro site, preserving quiz-choice
and code-runner elements, while cleaning Astro-specific artifacts.

Strategy: Extract #article-content as cleaned HTML (not Markdown).
Our md-parser passes HTML blocks through verbatim, so quizzes, code runners,
and formatting are all preserved faithfully.
"""

import requests
import os
import re
import sys
from bs4 import BeautifulSoup, Tag, NavigableString

BASE_URL = "https://xyfx-fhw.github.io/RustCourse/chapters"
OUTPUT_ROOT = r"D:\00 Work\ai-web\rust-learning\content"

# Complete lesson list from the site (134 slugs)
LESSONS = [
    "00-preface/00-index",
    "01-rust-basics/00-index", "01-rust-basics/01-installation", "01-rust-basics/02-hello-world",
    "01-rust-basics/03-hello-cargo", "01-rust-basics/04-first-taste",
    "02-basic-syntax/00-index", "02-basic-syntax/01-comments", "02-basic-syntax/02-formatted-output",
    "02-basic-syntax/03-data-types", "02-basic-syntax/04-variables", "02-basic-syntax/05-control-flow",
    "02-basic-syntax/06-functions", "02-basic-syntax/07-attributes", "02-basic-syntax/08-macros",
    "02-basic-syntax/09-practice",
    "03-ownership/00-index", "03-ownership/01-memory-and-move", "03-ownership/02-what-is-ownership",
    "03-ownership/03-references-borrowing", "03-ownership/04-slices", "03-ownership/05-practice",
    "04-custom-types/00-index", "04-custom-types/01-structs", "04-custom-types/02-struct-methods",
    "04-custom-types/03-enums", "04-custom-types/04-match", "04-custom-types/05-if-let",
    "04-custom-types/06-option", "04-custom-types/07-constants", "04-custom-types/08-practice",
    "05-stdlib-types/00-index", "05-stdlib-types/01-vectors", "05-stdlib-types/02-strings",
    "05-stdlib-types/03-hashmaps", "05-stdlib-types/04-practice",
    "06-type-system/00-index", "06-type-system/01-type-inference", "06-type-system/02-type-casting",
    "06-type-system/03-type-aliases", "06-type-system/04-newtype-pattern",
    "07-modules/00-index", "07-modules/01-packages-crates", "07-modules/02-modules",
    "07-modules/03-paths-use",
    "08-engineering/00-index", "08-engineering/01-workspace", "08-engineering/02-build-scripts",
    "08-engineering/03-doc-comments",
    "09-error-handling/00-index", "09-error-handling/01-panic", "09-error-handling/02-result",
    "09-error-handling/03-question-mark", "09-error-handling/04-when-to-panic",
    "09-error-handling/05-multiple-errors",
    "10-generics-traits/00-index", "10-generics-traits/01-generics-syntax",
    "10-generics-traits/02-traits", "10-generics-traits/03-trait-bounds",
    "10-generics-traits/04-conversion-traits", "10-generics-traits/05-practice",
    "11-lifetimes/00-index", "11-lifetimes/01-what-are-lifetimes",
    "11-lifetimes/02-lifetime-annotations", "11-lifetimes/03-struct-lifetimes",
    "11-lifetimes/04-lifetime-elision", "11-lifetimes/05-practice",
    "12-closures-iterators/00-index", "12-closures-iterators/01-closures",
    "12-closures-iterators/02-fn-traits", "12-closures-iterators/03-iterators",
    "12-closures-iterators/04-adaptors", "12-closures-iterators/05-practice",
    "13-smart-pointers/00-index", "13-smart-pointers/01-box", "13-smart-pointers/02-deref-drop",
    "13-smart-pointers/03-rc", "13-smart-pointers/04-refcell",
    "14-concurrency/00-index", "14-concurrency/01-threads", "14-concurrency/02-channels",
    "14-concurrency/03-shared-state", "14-concurrency/04-sync-send",
    "15-testing/00-index", "15-testing/01-unit-tests", "15-testing/02-test-control",
    "15-testing/03-integration-tests",
    "16-debugging/00-index", "16-debugging/01-dbg-macro", "16-debugging/02-ide-debugger",
    "16-debugging/03-logging",
    "17-methodology/00-index", "17-methodology/01-architecture", "17-methodology/02-coding-flow",
    "17-methodology/03-lint", "17-methodology/04-ci", "17-methodology/05-profiling",
    "18-unsafe/00-index", "18-unsafe/01-unsafe", "18-unsafe/02-raw-pointers",
    "18-unsafe/03-unsafe-functions", "18-unsafe/04-safe-abstractions",
    "19-c-interop/00-index", "19-c-interop/01-ffi-basics", "19-c-interop/02-bindgen",
    "19-c-interop/03-cbindgen", "19-c-interop/04-mixed-build",
    "20-embedded/00-index", "20-embedded/01-no-std-basics", "20-embedded/02-memory-layout",
    "20-embedded/03-hardware-abstraction", "20-embedded/04-interrupts-concurrency",
    "20-embedded/05-async-embassy", "20-embedded/06-toolchain-debug",
    "21-proc-macros/00-index", "21-proc-macros/01-proc-macro-basics",
    "21-proc-macros/02-derive-macros", "21-proc-macros/03-attribute-macros",
    "21-proc-macros/04-function-like-macros", "21-proc-macros/05-syn-and-quote",
    "22-advanced/00-index", "22-advanced/01-associated-types", "22-advanced/02-dyn-trait",
    "22-advanced/03-async-basics", "22-advanced/04-advanced-patterns",
    "23-projects/00-index", "23-projects/01-project-design", "23-projects/02-parsing",
    "23-projects/03-data-modeling", "23-projects/04-implementing", "23-projects/05-connecting",
    "23-projects/06-persistence", "23-projects/07-polish", "23-projects/08-documentation",
]

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0"})


def get_clean_code_text(pre_tag):
    """Extract plain text from an Astro syntax-highlighted pre block.
    Each <span class='line'> becomes a line; inner spans are joined without separator."""
    lines = pre_tag.select("span.line")
    if lines:
        return "\n".join(line.get_text("") for line in lines)
    return pre_tag.get_text("")


def make_clean_pre(soup, pre_tag, lang=""):
    """Replace a syntax-highlighted pre with clean <pre><code>."""
    if not lang:
        lang = pre_tag.get("data-language", "")
    code_text = get_clean_code_text(pre_tag)
    code_text = code_text.strip("\n")

    new_pre = soup.new_tag("pre")
    new_code = soup.new_tag("code")
    if lang:
        new_code["class"] = f"language-{lang}"
    new_code.string = code_text
    new_pre.append(new_code)
    pre_tag.replace_with(new_pre)


def strip_astro_attrs(soup):
    """Remove all data-astro-cid-* attributes from all elements."""
    for tag in soup.find_all(True):
        for attr in list(tag.attrs):
            if attr.startswith("data-astro-"):
                del tag[attr]


def process_strong_star(soup):
    """Replace <strong class='strong-star'> and <strong class='strong-under'>
    with plain <strong> tags."""
    for s in soup.select("strong.strong-star, strong.strong-under"):
        s.name = "strong"
        if "class" in s.attrs:
            s["class"] = [c for c in s["class"] if c not in ("strong-star", "strong-under")]
            if not s["class"]:
                del s["class"]


def clean_article_content(html_str):
    """Extract #article-content, clean it, return clean HTML string."""
    soup = BeautifulSoup(html_str, "lxml")
    content_div = soup.find("div", id="article-content")
    if not content_div:
        return None

    # 1. Strip Astro attributes from content_div itself AND all descendants
    for attr in list(content_div.attrs):
        if attr.startswith("data-astro-"):
            del content_div[attr]
    strip_astro_attrs(content_div)

    # 2. Convert Astro code blocks to clean pre > code
    for pre in content_div.find_all("pre", class_="astro-code"):
        lang = pre.get("data-language", "")
        make_clean_pre(soup, pre, lang)

    # 3. Clean code-runner and code-editor inner pre blocks too
    for cls in ("code-runner", "code-editor"):
        for runner in content_div.find_all("div", class_=cls):
            inner_pre = runner.find("pre")
            if inner_pre:
                lang = ""
                code_tag = inner_pre.find("code")
                if code_tag and code_tag.get("class"):
                    classes = code_tag.get("class", [])
                    for c in classes:
                        if c.startswith("language-"):
                            lang = c.replace("language-", "")
                            break
                make_clean_pre(soup, inner_pre, lang)

    # 4. Fix strong classes
    process_strong_star(content_div)

    # 4. Remove empty/harmful attributes from inline elements
    for tag in content_div.find_all(True):
        if tag.name in ("span",) and not tag.get_text(strip=True):
            tag.unwrap()

    # 5. Ensure quiz-choice elements have proper structure
    for qc in content_div.find_all("quiz-choice"):
        if qc.get("data-payload"):
            qc["data-payload"] = qc["data-payload"].strip()

    # 6. Convert to string and clean whitespace
    result = str(content_div)
    # Collapse excessive blank lines
    result = re.sub(r'\n{4,}', '\n\n\n', result)
    # Remove blank lines at start
    result = result.strip()
    return result


def fetch_lesson(slug, force=False):
    """Fetch a single lesson, save cleaned content. Skip if exists and not forced."""
    chapter, lesson_id = slug.split("/", 1)
    out_dir = os.path.join(OUTPUT_ROOT, chapter)
    out_file = os.path.join(out_dir, f"{lesson_id}.md")
    os.makedirs(out_dir, exist_ok=True)

    if os.path.exists(out_file) and not force:
        print(f"  SKIP (exists): {slug}")
        return True

    url = f"{BASE_URL}/{slug}"
    print(f"  FETCH: {url}")
    try:
        resp = session.get(url, timeout=30)
        resp.encoding = "utf-8"
        resp.raise_for_status()
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}")
        return False

    cleaned = clean_article_content(resp.text)
    if cleaned is None:
        print(f"  ERROR: No #article-content in {url}")
        return False

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(cleaned)
        f.write("\n")

    size = len(cleaned.encode("utf-8"))
    print(f"  SAVED: {out_file} ({size} bytes, {len(cleaned.splitlines())} lines)")
    return True


def main():
    force = "--force" in sys.argv
    skip_existing = "--skip-existing" not in sys.argv

    print(f"Fetching {len(LESSONS)} lessons from {BASE_URL}")
    print(f"Output: {OUTPUT_ROOT}")
    print(f"Force overwrite: {force}")
    print("-" * 60)

    success = 0
    fail = 0
    skipped = 0

    for slug in LESSONS:
        chapter, lesson_id = slug.split("/", 1)
        out_file = os.path.join(OUTPUT_ROOT, chapter, f"{lesson_id}.md")

        if os.path.exists(out_file) and not force:
            skipped += 1
            continue

        if fetch_lesson(slug, force=force):
            success += 1
        else:
            fail += 1

    print("-" * 60)
    print(f"Done. Success: {success}, Failed: {fail}, Skipped: {skipped}")
    print(f"Total: {success + fail + skipped} / {len(LESSONS)}")


if __name__ == "__main__":
    main()
