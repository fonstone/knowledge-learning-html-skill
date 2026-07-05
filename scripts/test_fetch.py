"""Test the fetch_clean_all script on a single lesson."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from fetch_clean_all import clean_article_content
import requests

url = "https://xyfx-fhw.github.io/RustCourse/chapters/01-rust-basics/02-hello-world"
print("Fetching:", url)
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
resp.encoding = "utf-8"
cleaned = clean_article_content(resp.text)

print("Output length:", len(cleaned), "chars")
print("Has quiz-choice:", "quiz-choice" in cleaned)
print("Has code-runner:", "code-runner" in cleaned)
print("astro-code count (should be 0):", cleaned.count("astro-code"))
print("data-astro count (should be 0):", cleaned.count("data-astro"))

# Show quiz section
idx = cleaned.find("quiz-choice")
if idx >= 0:
    print("\n=== QUIZ SECTION ===")
    print(cleaned[idx:idx+800])
else:
    print("\nNO quiz-choice found!")

# Show cleaned code block
idx2 = cleaned.find("<pre><code")
if idx2 >= 0:
    print("\n=== CODE BLOCK (cleaned) ===")
    print(cleaned[idx2:idx2+400])

# Find code-runner sections
import re
print("\n=== CODE-RUNNER COUNT ===")
runners = [m.start() for m in re.finditer('code-runner', cleaned)]
print(f"Found {len(runners)} occurrences")

# Show first code-runner area
cr_idx = cleaned.find('<div class="code-runner')
if cr_idx >= 0:
    print("\n=== FIRST CODE-RUNNER (300 chars) ===")
    print(cleaned[cr_idx:cr_idx+300])

# Find remaining data-astro attributes
print("\n=== REMAINING data-astro ===")
for m in re.finditer(r'data-astro[^\s=>]*', cleaned):
    ctx = cleaned[max(0,m.start()-30):m.end()+30]
    print(f"  at {m.start()}: ...{ctx}...")

# Find remaining span tags with style
print("\n=== REMAINING spans with style ===")
for m in re.finditer(r'<span[^>]*style=[^>]*>', cleaned):
    ctx = cleaned[max(0,m.start()-20):m.end()+60]
    print(f"  at {m.start()}: ...{ctx}...")
