import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = join(__dirname, '..');

const dataPath = join(base, 'js', 'data.js');
let dataContent = readFileSync(dataPath, 'utf-8');

// Use Function constructor to evaluate the JS and get courseData
const courseData = (new Function(dataContent + '; return courseData;'))();

const srcDir = join(base, 'content');
const destDir = join(base, 'src', 'content', 'lessons');

if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true, force: true });
}

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function yamlList(arr) {
  return '[' + arr.map(t => JSON.stringify(String(t))).join(', ') + ']';
}

let count = 0;
for (const ch of courseData) {
  const chDir = join(destDir, ch.id);
  mkdirSync(chDir, { recursive: true });

  for (const ls of ch.lessons) {
    const srcFile = join(srcDir, ch.id, ls.id + '.md');
    const destFile = join(chDir, ls.id + '.md');

    if (!existsSync(srcFile)) {
      console.warn(`Missing: ${srcFile}`);
      continue;
    }

    const body = readFileSync(srcFile, 'utf-8');

    const fm = `---
chapterId: "${esc(ch.id)}"
lessonId: "${esc(ls.id)}"
title: "${esc(ls.title)}"
level: "${esc(ls.level)}"
duration: "${esc(ls.duration)}"
tags: ${yamlList(ls.tags)}
number: "${esc(ls.number)}"
chapterTitle: "${esc(ch.title)}"
chapterNumber: "${esc(ch.number)}"
---

`;
    writeFileSync(destFile, fm + body, 'utf-8');
    count++;
  }
}

console.log(`Done. Files processed: ${count}`);
