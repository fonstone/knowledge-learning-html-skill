"""Verify all lessons in data.js have corresponding .md files."""
import os
import re

with open("js/data.js", "r", encoding="utf-8") as f:
    text = f.read()

# Extract all lesson IDs that include a dash (chapter-lesson)
# We need to differentiate chapter objects from lesson objects
# Chapter IDs like '00-preface', lesson IDs like '01-installation'
# Inside each chapter's lessons array
all_lessons = set()
chapters_found = 0

# Split by chapter - each chapter starts with { id: 'XX-...
chunks = re.split(r'\},\s*\n\s*\{', text)
# First chunk starts with 'const courseData = [' and first {
chunks[0] = chunks[0].replace("const courseData = [", "").strip().lstrip("{")
# Last chunk ends with ]; but may have extra content
chunks[-1] = chunks[-1].rstrip("];").strip()

for chunk in chunks:
    # Clean up: prepend { if missing from split
    chunk = chunk.strip()
    if not chunk.startswith("{"):
        chunk = "{" + chunk
    if not chunk.endswith("}"):
        chunk = chunk + "}"
    
    # Extract chapter id
    m = re.search(r"id: '([^']+)'", chunk)
    if not m:
        continue
    ch_id = m.group(1)
    
    # Find the lessons array
    m = re.search(r"lessons: \[(.*?)\]", chunk, re.DOTALL)
    if not m:
        continue
    lessons_text = m.group(1)
    
    chapters_found += 1
    
    # Extract lesson ids from the array
    for lid in re.findall(r"id: '([^']+)'", lessons_text):
        if lid == "00-index":
            continue
        all_lessons.add(f"{ch_id}/{lid}")

print(f"Chapters found: {chapters_found}")
print(f"Total lesson entries: {len(all_lessons)}")

# Check for missing files
missing = []
found = 0
for lesson_rel in sorted(all_lessons):
    path = f"content/{lesson_rel}.md"
    if os.path.exists(path):
        found += 1
    else:
        missing.append(lesson_rel)

print(f"Files found: {found}")
if missing:
    print(f"MISSING ({len(missing)}):")
    for m in missing:
        print(f"  content/{m}.md")

# Check for orphaned files
orphaned = []
for root, dirs, files in os.walk("content"):
    for fname in files:
        if not fname.endswith(".md"):
            continue
        rel = os.path.relpath(os.path.join(root, fname), "content")
        rel = rel.replace("\\", "/").replace(".md", "")
        if rel not in all_lessons:
            orphaned.append(rel)

if orphaned:
    print(f"ORPHANED ({len(orphaned)}):")
    for o in sorted(orphaned):
        print(f"  content/{o}.md")

print(f"\n=== MATCH: {found == len(all_lessons)} ===")
print(f"Lessons in data.js: {len(all_lessons)}, Files in content/: {found + len(orphaned)}")
