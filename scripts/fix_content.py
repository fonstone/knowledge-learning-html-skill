"""
Download all diagrams and update MD file references to use local paths.
"""
import os
import re
import urllib.request

diagrams_dir = r'D:\00 Work\ai-web\rust-learning\diagrams'
content_dir = r'D:\00 Work\ai-web\rust-learning\content'
base_url = 'https://xyfx-fhw.github.io/RustCourse/diagrams/'

# Discover unique diagram filenames from all MD files
diagrams = set()
for root, dirs, files in os.walk(content_dir):
    for f in files:
        if not f.endswith('.md'):
            continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as fh:
            text = fh.read()
        # Match diagram URLs: both absolute https://xyfx-fhw.github.io/diagrams/ and /RustCourse/diagrams/
        urls = re.findall(r'(?:https://xyfx-fhw\.github\.io|)/diagrams/([^\s)\"\'\]>]+)', text)
        # Also match relative paths
        urls += re.findall(r'\]\(\.?/?diagrams/([^\s)\"\'\]>]+)\)', text)
        for u in urls:
            u = u.strip()
            if u.endswith('.svg') or u.endswith('.png'):
                diagrams.add(os.path.basename(u))

print(f'Unique diagrams to download: {len(diagrams)}')
for d in sorted(diagrams):
    print(f'  {d}')

# Download all diagrams
os.makedirs(diagrams_dir, exist_ok=True)
ok, fail = 0, 0
for name in sorted(diagrams):
    url = base_url + name
    dst = os.path.join(diagrams_dir, name)
    if os.path.exists(dst):
        print(f'  SKIP {name} (already exists)')
        ok += 1
        continue
    try:
        urllib.request.urlretrieve(url, dst)
        print(f'  OK  {name}')
        ok += 1
    except Exception as e:
        print(f'  FAIL {name}: {e}')
        fail += 1

print(f'\nDownloaded: {ok}, Failed: {fail}')

# Update MD files - replace diagram URLs with local relative paths
# The MD files are at content/{chapterId}/{lessonId}.md
# The diagrams are at ./diagrams/{name}.svg (relative to site root)
# From within content/{chapterId}/{lessonId}.md, relative path is ../../diagrams/{name}.svg

updated_files = 0
for root, dirs, files in os.walk(content_dir):
    for f in files:
        if not f.endswith('.md'):
            continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as fh:
            text = fh.read()

        # Calculate relative path depth
        # content/{ch}/{lesson}.md -> depth 2 from content/
        rel = os.path.relpath(diagrams_dir, os.path.dirname(path))
        rel_prefix = rel.replace('\\', '/') + '/'

        new_text = text
        # Replace absolute URL https://xyfx-fhw.github.io/diagrams/xxx
        new_text = re.sub(
            r'https://xyfx-fhw\.github\.io/diagrams/([^\s)\"\'\]>]+)',
            lambda m: rel_prefix + os.path.basename(m.group(1)),
            new_text
        )
        # Replace /RustCourse/diagrams/xxx
        new_text = re.sub(
            r'/RustCourse/diagrams/([^\s)\"\'\]>]+)',
            lambda m: rel_prefix + os.path.basename(m.group(1)),
            new_text
        )

        if new_text != text:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new_text)
            updated_files += 1
            print(f'  UPDATED {os.path.relpath(path, content_dir)}')

print(f'\nUpdated MD files: {updated_files}')
