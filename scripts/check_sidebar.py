"""Check the current site's sidebar structure for ch21, ch22, ch23."""
import requests
from bs4 import BeautifulSoup

url = "https://xyfx-fhw.github.io/RustCourse/chapters/21-proc-macros/01-proc-macro-basics"
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
soup = BeautifulSoup(resp.text, "lxml")

targets = ("21-proc-macros", "22-advanced", "23-projects")

for chapter in soup.select(".chapter-item"):
    link = chapter.find("a", class_="chapter-link")
    if not link:
        continue
    href = link.get("href", "")
    ch_id = href.split("/")[-2] if "/chapters/" in href else ""
    if ch_id not in targets:
        continue

    num_el = link.find("span", class_="chapter-num")
    num_text = num_el.get_text(strip=True) if num_el else ""
    title_text = link.get_text(strip=True).replace(num_text, "").strip()
    print(f"\n=== {num_text} {title_text} (id: {ch_id}) ===")

    for article in chapter.select(".article-link"):
        anum = article.find("span", class_="article-num")
        a_num = anum.get_text(strip=True) if anum else ""
        parts = article["href"].rstrip("/").split("/")
        lesson_id = parts[-1] if parts else ""
        # Get text excluding the child elements' text
        a_title = ""
        for child in article.children:
            if child.name != "span":
                a_title = str(child).strip()
        print(f"  {a_num} {a_title} -> {lesson_id}")
