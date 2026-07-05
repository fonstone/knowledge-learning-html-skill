"""Test reclone_site.py on a single page"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from reclone_site import *
from bs4 import BeautifulSoup
import re

# Test processing one page
slug = '02-basic-syntax/01-comments'
url = f'{BASE_URL}/chapters/{slug}/'
print(f'Fetching: {url}')
html = fetch(url)
soup = BeautifulSoup(html, 'lxml')
article = soup.find('div', id='article-content')
article = clean(article)
items = list(blocks(article))
md = assemble(items)
print(f'Output length: {len(md)} chars')

# Check for code-runner and quiz preservation
print(f'Contains code-runner: {"code-runner" in md}')
print(f'Contains quiz-choice: {"quiz-choice" in md}')

# Check code quality
code_blocks = re.findall(r'```rust\n(.*?)```', md, re.DOTALL)
if code_blocks:
    print(f'First code block snippet:')
    print(code_blocks[0][:300])

# Check for the "加载题目中" pattern (means quiz content wasn't extracted)
print(f'Contains 加载题目中: {"加载题目中" in md}')
print()
print('=== First 800 chars ===')
print(md[:800])
