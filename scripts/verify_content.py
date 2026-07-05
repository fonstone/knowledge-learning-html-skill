""" Verify content quality """
import os, re

root = r'D:\00 Work\ai-web\rust-learning\content'

files = []
for dirpath, dirnames, filenames in os.walk(root):
    for f in filenames:
        if f.endswith('.md'):
            files.append(os.path.join(dirpath, f))

print(f'Total .md files: {len(files)}')

html_start = 0
clean = 0
astro_count = 0
code_runner_count = 0
backtick_pairs = 0

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    first_line = content.strip()[:100] if content.strip() else ''
    if first_line.startswith('<') and '<' in first_line:
        html_start += 1
    else:
        clean += 1
    
    if 'astro-code' in content:
        astro_count += 1
    if 'code-runner' in content:
        code_runner_count += 1
    # only count if it's in an HTML context (not in fenced code)
    bt = content.count('```')
    backtick_pairs += bt

print(f'Files starting with HTML tag: {html_start}')
print(f'Clean Markdown files: {clean}')
print(f'Files with astro-code HTML: {astro_count}')
print(f'Files with code-runner HTML: {code_runner_count}')
print(f'Total backtick fence pairs: {backtick_pairs // 2}')

# Show chapter breakdown
chapters = {}
for fp in files:
    ch = os.path.basename(os.path.dirname(fp))
    chapters.setdefault(ch, 0)
    chapters[ch] += 1

print(f'\nChapters: {len(chapters)}')
for ch in sorted(chapters.keys()):
    print(f'  {ch}: {chapters[ch]} lessons')
