import re
import os

content_dir = r'D:\00 Work\ai-web\rust-learning\content'
diagrams = set()
for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.md'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                text = fh.read()
            urls = re.findall(r'https://xyfx-fhw\.github\.io/diagrams/([^\s)\"\']+)', text)
            diagrams.update(urls)

diagrams = sorted(set(u for u in diagrams if u.endswith('.svg')))
print(f'Total unique diagrams: {len(diagrams)}')
for d in diagrams:
    print(f'  {d}')
