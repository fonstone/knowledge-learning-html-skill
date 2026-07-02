"""Verify the re-cloned content quality"""
import os, re

root = r'D:\00 Work\ai-web\rust-learning\content'

print('=== Quality Verification ===')

# 1. Check all files exist
total = 0
for dirpath, dirnames, filenames in os.walk(root):
    for f in filenames:
        if f.endswith('.md'):
            total += 1
print(f'Total MD files: {total}')

# 2. Check file sizes
sizes = []
small_files = []
for dirpath, dirnames, filenames in os.walk(root):
    for f in filenames:
        if f.endswith('.md'):
            fp = os.path.join(dirpath, f)
            sz = os.path.getsize(fp)
            sizes.append(sz)
            if sz < 200:
                small_files.append((os.path.basename(dirpath), f, sz))

print(f'Total size: {sum(sizes)} bytes')
print(f'Avg size: {sum(sizes)//len(sizes)} bytes')
print(f'Min size: {min(sizes)} bytes')
print(f'Max size: {max(sizes)} bytes')

if small_files:
    print(f'\nSmall files (<200 bytes):')
    for ch, fn, sz in small_files:
        print(f'  {ch}/{fn}: {sz}b')

# 3. Count code-runner, quiz-choice, tables, etc
counts = {
    'code-runner': 0,
    'quiz-choice': 0,
    'code-runner-files': 0,
}

for dirpath, dirnames, filenames in os.walk(root):
    for f in filenames:
        if f.endswith('.md'):
            fp = os.path.join(dirpath, f)
            with open(fp, 'r', encoding='utf-8') as fh:
                content = fh.read()
            cr = content.count('code-runner')
            qc = content.count('quiz-choice')
            counts['code-runner'] += cr
            counts['quiz-choice'] += qc
            if cr > 0:
                counts['code-runner-files'] += 1

print(f'\nTotal code-runner blocks: {counts["code-runner"]}')
print(f'Files with code-runner: {counts["code-runner-files"]}')
print(f'Total quiz-choice elements: {counts["quiz-choice"]}')

# 4. Show sample content from a few files
samples = [
    '02-basic-syntax/01-comments.md',
    '09-error-handling/02-result.md',
    '04-custom-types/08-practice.md',
]

print('\n=== Sample checks ===')
for rel in samples:
    fp = os.path.join(root, rel)
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    lines = content.split('\n')
    print(f'\n--- {rel} ({len(lines)} lines, {len(content)} chars) ---')
    
    # Check first H1
    for l in lines[:10]:
        if l.startswith('# '):
            print(f'  H1: {l}')
            break
    
    # Check for code-runner or code blocks
    cr_count = content.count('code-runner')
    cb_count = len(re.findall(r'```', content)) // 2
    print(f'  code-runner: {cr_count}, fenced code blocks: {cb_count}')
    
    # Check for corrupted code
    code_blocks = re.findall(r'```rust\n(.*?)```', content, re.DOTALL)
    if code_blocks:
        first = code_blocks[0]
        lines_in_block = first.strip().split('\n')
        print(f'  First code block: {len(lines_in_block)} lines')
        # Show first 3 lines
        for l in lines_in_block[:3]:
            print(f'    |{l}|')
        # Check for corruption - tokens on single lines
        single_tokens = sum(1 for l in lines_in_block if len(l.strip()) <= 3 and l.strip())
        print(f'  Single-token lines: {single_tokens}/{len(lines_in_block)}')
    
    # Check for '加载题目中'
    has_loading = '加载题目中' in content
    print(f'  Contains "加载题目中": {has_loading}')

print('\n=== Chapter file counts ===')
chapters = {}
for dirpath, dirnames, filenames in os.walk(root):
    ch = os.path.basename(dirpath)
    for f in filenames:
        if f.endswith('.md'):
            chapters.setdefault(ch, 0)
            chapters[ch] += 1

for ch in sorted(chapters.keys()):
    print(f'  {ch}: {chapters[ch]}')

print('\n=== VERIFICATION COMPLETE ===')
