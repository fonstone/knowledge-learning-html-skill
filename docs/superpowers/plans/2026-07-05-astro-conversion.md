# Astro SSG Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing client-side SPA into an Astro SSG site that fully replicates https://xyfx-fhw.github.io/RustCourse/ with 133 static lesson pages, interactive quizzes, code runners, and localStorage-based progress tracking.

**Architecture:** Astro 5 SSG with content collections. Each `.md` lesson file gets YAML frontmatter, the HTML body passes through Astro's markdown processor. Server-rendered shell (navbar, breadcrumb, footer) wraps client islands for interactivity (Sidebar, PageToc, QuizChoice, CodeRunner, ProgressBar). No SPA routing — all navigation via `<a href>`.

**Tech Stack:** Astro 5, TypeScript, vanilla JS (no framework), same CSS design system, same localStorage progress format.

## Global Constraints

- All 133 content files preserve their exact HTML body (no content changes)
- localStorage key format: `rust-tutorial-completed-{chapterId}-{lessonId}`
- URL format: `/chapters/{chapterId}/{lessonId}`
- Dark theme only (`#0D0D0F` bg, `#CE412B` accent)
- Three-column content layout: sidebar (240px) / body (flex:1, max 820px) / TOC (200px)
- Responsive: hide TOC at ≤1200px, hide sidebar at ≤768px
- Quiz correct answers stored as `data-correct` attribute on `.quiz-option`
- Progress bar unlocks certificate link at 100%

---

### Task 0: Initialize Astro project in current directory

**Files:**
- Create: `astro.config.mjs`, `tsconfig.json`
- Modify: `package.json`
- Create: `src/env.d.ts`

**Interfaces:**
- Produces: Working `npx astro dev` and `npx astro build`

- [ ] **Step 1: Update package.json for Astro**

Replace `package.json` content:

```json
{
  "name": "rust-course",
  "version": "1.0.0",
  "description": "Rust 互动教程网站",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "keywords": ["rust", "tutorial", "course"],
  "author": "雪云飞星",
  "license": "MIT",
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://xyfx-fhw.github.io',
  base: '/RustCourse',
  markdown: {
    syntaxHighlight: false,
  },
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 4: Create src/env.d.ts**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 5: Install dependencies and verify**

```bash
npm install
```
Run: `npx astro dev` — expected: dev server starts on localhost:4321/RustCourse (empty site, 404 on most pages, that's OK)

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts package-lock.json
git commit -m "chore: initialize Astro 5 project"
```

---

### Task 1: Create content collection config

**Files:**
- Create: `src/content/config.ts`

**Interfaces:**
- Produces: `lessons` content collection with Zod schema for all 133 `.md` files

- [ ] **Step 1: Create src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    chapterId: z.string(),
    lessonId: z.string(),
    title: z.string(),
    level: z.string(),
    duration: z.string(),
    tags: z.array(z.string()),
    number: z.string(),
    chapterTitle: z.string(),
    chapterNumber: z.string(),
  }),
});

export const collections = { lessons };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add content collection config with Zod schema"
```

---

### Task 2: Move content files and add frontmatter

**Files:**
- Create: `src/content/lessons/` (133 .md files with frontmatter)
- Create: `scripts/add-frontmatter.ps1`

**Interfaces:**
- Consumes: `content/` directory (133 .md files), `js/data.js` (courseData)
- Produces: `src/content/lessons/{chapterId}/{lessonId}.md` with YAML frontmatter

- [ ] **Step 1: Create the frontmatter script**

Create `scripts/add-frontmatter.ps1`:

```powershell
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)

$srcDir = 'content'
$destDir = 'src\content\lessons'

Remove-Item -Recurse -Force -LiteralPath $destDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

$dataContent = Get-Content -Raw -LiteralPath 'js\data.js' -Encoding UTF8
$dataContent = $dataContent -replace 'const courseData = ', ''
$dataContent = $dataContent -replace ';$', ''

Add-Type -AssemblyName System.Web.Extensions
$ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$chapters = $ser.DeserializeObject($dataContent)

function Escape-YamlString($s) {
    if ($s -match '[:#\[\]{}&*!|>''"%@`]') {
        return '"' + ($s -replace '\\', '\\' -replace '"', '\"') + '"'
    }
    return $s
}

foreach ($ch in $chapters) {
    $chId = $ch['id']
    $chNum = $ch['number']
    $chTitle = $ch['title']

    $chDir = Join-Path $destDir $chId
    New-Item -ItemType Directory -Path $chDir -Force | Out-Null

    foreach ($ls in $ch['lessons']) {
        $lsId = $ls['id']
        $srcFile = Join-Path $srcDir "$chId\$lsId.md"
        $destFile = Join-Path $chDir "$lsId.md"

        if (-not (Test-Path -LiteralPath $srcFile)) {
            Write-Warning "Missing: $srcFile"
            continue
        }

        $body = Get-Content -Raw -LiteralPath $srcFile -Encoding UTF8
        $tagsJson = ($ls['tags'] | ForEach-Object { Escape-YamlString $_ }) -join ', '

        $frontmatter = @"
---
chapterId: "$chId"
lessonId: "$lsId"
title: "$($ls['title'])"
level: "$($ls['level'])"
duration: "$($ls['duration'])"
tags: [$tagsJson]
number: "$($ls['number'])"
chapterTitle: "$($chTitle)"
chapterNumber: "$($chNum)"
---

"@

        Set-Content -LiteralPath $destFile -Value ($frontmatter + $body) -Encoding UTF8 -NoNewline
        Write-Output "Written: $chId/$lsId.md"
    }
}

Write-Output "Done. Total chapters: $($chapters.Count)"
```

- [ ] **Step 2: Run the script**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/add-frontmatter.ps1
```
Expected: 133 "Written: ..." lines, 24 chapter directories created under `src/content/lessons/`.

- [ ] **Step 3: Verify one file**

Read `src/content/lessons/01-rust-basics/01-installation.md`. The first lines should be:
```
---
chapterId: "01-rust-basics"
lessonId: "01-installation"
title: "安装 Rust"
...
---
<div id="article-content"> <h1 id="了解-rustup">...
```

- [ ] **Step 4: Commit**

```bash
git add src/content/lessons/ scripts/add-frontmatter.ps1
git commit -m "feat: add 133 lesson files with frontmatter to content collection"
```

---

### Task 3: Move static assets

**Files:**
- Move: `favicon.svg` -> `public/favicon.svg`
- Move: `images/` -> `public/images/`
- Move: `diagrams/` -> `public/diagrams/`

- [ ] **Step 1: Move assets**

```powershell
Copy-Item -Recurse -LiteralPath favicon.svg -Destination public\favicon.svg
Copy-Item -Recurse -LiteralPath images -Destination public\images
Copy-Item -Recurse -LiteralPath diagrams -Destination public\diagrams
```

- [ ] **Step 2: Verify paths**

```powershell
Test-Path public\favicon.svg
Test-Path public\images\logo.svg
(Get-ChildItem public\diagrams\*.svg).Count
```
Expected: True, True, 20

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "chore: move static assets to public/"
```

---

### Task 4: Port CSS design system

**Files:**
- Create: `src/styles/global.css`
- Modify: `css/style.css` (already ported; kept for reference)

**Interfaces:**
- Produces: Full design system CSS available in Astro via `import '../styles/global.css'`

- [ ] **Step 1: Create global.css**

Copy `css/style.css` to `src/styles/global.css`:

```powershell
Copy-Item css/style.css src/styles/global.css
```

- [ ] **Step 2: Update asset paths in global.css**

In `src/styles/global.css`, update Google Fonts `@import` to be at the very top (Astro bundles CSS). All other content stays identical.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: port CSS design system to Astro global styles"
```

---

### Task 5: Create courseData and progress TypeScript libraries

**Files:**
- Create: `src/lib/courseData.ts`
- Create: `src/lib/progress.ts`

**Interfaces:**
- Produces: `courseData: Chapter[]` — array of 24 chapters with lessons, used by all pages and components
- Produces: `getTotalProgress()`, `getChapterProgress(chapterId)`, `isLessonCompleted(chapterId, lessonId)` — localStorage-based progress functions

- [ ] **Step 1: Create src/lib/courseData.ts**

```ts
export interface Lesson {
  id: string;
  number: string;
  title: string;
  level: string;
  duration: string;
  tags: string[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

export const courseData: Chapter[] = [
  {
    id: '00-preface', number: '序', title: '前言', level: '入门', duration: '5 分钟',
    description: '为什么要写这套教程，它和其他 Rust 教程有什么不同，以及你能从中得到什么',
    lessons: [
      { id: '00-index', number: '', title: '前言', level: '入门', duration: '5 分钟', tags: ['前言', '教程简介', '学习方法'] }
    ]
  },
  {
    id: '01-rust-basics', number: '01', title: 'Rust 基础', level: '入门', duration: '15 分钟',
    description: '了解 Rust 语言的核心价值、设计哲学，以及它能解决哪些其他语言长期无法解决的问题',
    lessons: [
      { id: '00-index', number: '', title: 'Rust 基础', level: '入门', duration: '15 分钟', tags: ['Rust简介', '内存安全', '零开销抽象', '系统编程', '并发'] },
      { id: '01-installation', number: '1.1', title: '安装 Rust', level: '入门', duration: '10 分钟', tags: ['rustup', '安装', '工具链', 'cargo', 'rustc', '环境配置'] },
      { id: '02-hello-world', number: '1.2', title: 'Hello, World!', level: '入门', duration: '20 分钟', tags: ['Hello World', 'main函数', 'println!', 'rustc编译', '预编译'] },
      { id: '03-hello-cargo', number: '1.3', title: '使用 Cargo', level: '入门', duration: '20 分钟', tags: ['Cargo', 'cargo new', 'cargo build', 'cargo run', 'cargo check', 'Cargo.toml'] },
      { id: '04-first-taste', number: '1.4', title: '示例：今天是星期几？', level: '入门', duration: '10 分钟', tags: ['初探第一个程序', '日期计算', '星期几'] }
    ]
  },
  {
    id: '02-basic-syntax', number: '02', title: '基础语法', level: '入门', duration: '5 分钟',
    description: '从注释、变量、数据类型到控制流、函数、宏，系统掌握 Rust 程序的基本构成要素。',
    lessons: [
      { id: '00-index', number: '', title: '基础语法', level: '入门', duration: '5 分钟', tags: ['基础语法', '变量', '数据类型', '控制流', '函数', '宏'] },
      { id: '01-comments', number: '2.1', title: '注释', level: '入门', duration: '10 分钟', tags: ['注释', '行注释', '块注释', '文档注释', '///', '//!'] },
      { id: '02-formatted-output', number: '2.2', title: '格式化输出', level: '入门', duration: '20 分钟', tags: ['println!', 'format!', '格式化', '{:?}', 'Debug', '#[derive(Debug)]', '格式规范'] },
      { id: '03-data-types', number: '2.3', title: '基础数据类型', level: '入门', duration: '30 分钟', tags: ['整数类型', '浮点数', 'bool', 'char', '元组', '数组', '类型推断'] },
      { id: '04-variables', number: '2.4', title: '变量与可变性', level: '入门', duration: '25 分钟', tags: ['let', 'mut', 'const', 'shadowing', '遮蔽', '作用域', '变量绑定'] },
      { id: '05-control-flow', number: '2.5', title: '控制流', level: '入门', duration: '30 分钟', tags: ['if', 'else', 'loop', 'while', 'for', '控制流', '循环', '条件分支'] },
      { id: '06-functions', number: '2.6', title: '函数', level: '入门', duration: '20 分钟', tags: ['fn', '函数', '参数', '返回值', '语句', '表达式', 'snake_case'] },
      { id: '07-attributes', number: '2.7', title: '属性', level: '进阶', duration: '35 分钟', tags: ['属性', 'attribute', 'cfg', 'dead_code', 'allow', '条件编译', 'derive'] },
      { id: '08-macros', number: '2.8', title: '声明宏', level: '进阶', duration: '50 分钟', tags: ['macro_rules!', '声明宏', '元变量', '重复模式', '宏卫生性', 'macro_export', '元编程'] },
      { id: '09-practice', number: '2.9', title: '综合练习', level: '进阶', duration: '30 分钟', tags: ['练习', '算法', '斐波那契', '质数', '递归', '排序', '函数'] }
    ]
  },
  {
    id: '03-ownership', number: '03', title: '所有权系统', level: '入门', duration: '5 分钟',
    description: '了解 Rust 所有权的内存模型背景，以及移动、拷贝与克隆三种数据交互方式的本质区别。',
    lessons: [
      { id: '00-index', number: '', title: '所有权系统', level: '入门', duration: '5 分钟', tags: ['所有权', '栈', '堆', '移动', 'Copy', 'Clone', '所有权与函数'] },
      { id: '01-memory-and-move', number: '3.1', title: '内存与数据流动', level: '入门', duration: '20 分钟', tags: ['栈', '堆', '移动', 'Copy', 'Clone', '内存模型'] },
      { id: '02-what-is-ownership', number: '3.2', title: '什么是所有权', level: '进阶', duration: '30 分钟', tags: ['所有权', '作用域', 'String', 'drop', '可变性', 'let mut', '遮蔽'] },
      { id: '03-references-borrowing', number: '3.3', title: '引用与借用', level: '进阶', duration: '40 分钟', tags: ['引用', '借用', '&T', '&mut T', '可变引用', '悬垂引用', '借用检查器', 'NLL'] },
      { id: '04-slices', number: '3.4', title: '切片', level: '进阶', duration: '35 分钟', tags: ['切片', 'slice', '&str', '&[T]', '字符串切片', '数组切片', 'range'] },
      { id: '05-practice', number: '3.5', title: '综合练习', level: '进阶', duration: '30 分钟', tags: ['所有权', '移动', '借用', '引用', '切片', 'Copy', 'Clone'] }
    ]
  },
  {
    id: '04-custom-types', number: '04', title: '自定义数据类型', level: '入门', duration: '5 分钟',
    description: '学习 Rust 的自定义类型系统：结构体、枚举、方法、Option、模式匹配和常量，是面向对象编程的基础。',
    lessons: [
      { id: '00-index', number: '', title: '自定义数据类型', level: '入门', duration: '5 分钟', tags: ['结构体', '枚举', 'Option', '模式匹配', '类型系统'] },
      { id: '01-structs', number: '4.1', title: '结构体', level: '入门', duration: '30 分钟', tags: ['结构体', 'struct', '字段', '实例化', '元组结构体', '类单元结构体'] },
      { id: '02-struct-methods', number: '4.2', title: '方法与关联函数', level: '入门', duration: '25 分钟', tags: ['方法', 'impl', 'self', '关联函数', '接收者'] },
      { id: '03-enums', number: '4.3', title: '枚举', level: '入门', duration: '25 分钟', tags: ['枚举', 'enum', '成员', '变体', '关联数据'] },
      { id: '04-match', number: '4.4', title: '模式匹配与 match 表达式', level: '入门', duration: '30 分钟', tags: ['match', '模式', '穷尽性', '绑定', '通配符'] },
      { id: '05-if-let', number: '4.5', title: 'if let 与 while let', level: '入门', duration: '20 分钟', tags: ['if let', 'while let', '语法糖', '简洁'] },
      { id: '06-option', number: '4.6', title: 'Option<T> 枚举', level: '入门', duration: '20 分钟', tags: ['Option', 'Some', 'None', 'null', '可选值'] },
      { id: '07-constants', number: '4.7', title: '常量与静态变量', level: '入门', duration: '15 分钟', tags: ['const', 'static', '常量', '编译期'] },
      { id: '08-practice', number: '4.8', title: '综合练习', level: '进阶', duration: '35 分钟', tags: ['结构体', '枚举', 'Option', 'match', '综合'] }
    ]
  },
  {
    id: '05-stdlib-types', number: '05', title: '标准库类型', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 最常用的集合类型：Vec<T>、String 和 HashMap，学会安全高效地处理动态数据结构。',
    lessons: [
      { id: '00-index', number: '', title: '标准库类型', level: '入门', duration: '5 分钟', tags: ['向量', '字符串', '哈希表', '集合', '所有权'] },
      { id: '01-vectors', number: '5.1', title: 'Vec<T>——动态数组', level: '入门', duration: '35 分钟', tags: ['向量', 'Vec', '动态数组', '所有权', '借用', '迭代'] },
      { id: '02-strings', number: '5.2', title: 'String 与 &str——Rust 的两种字符串', level: '入门', duration: '35 分钟', tags: ['字符串', 'String', '&str', '字符串切片', '所有权', 'UTF-8', '字符编码'] },
      { id: '03-hashmaps', number: '5.3', title: 'HashMap<K, V>——键值对集合', level: '入门', duration: '40 分钟', tags: ['哈希表', 'HashMap', '键值对', '字典', '所有权', 'entry API', '迭代'] },
      { id: '04-practice', number: '5.4', title: '综合练习', level: '进阶', duration: '50 分钟', tags: ['向量', '字符串', '哈希表', '综合应用', '所有权', '集合'] }
    ]
  },
  {
    id: '06-type-system', number: '06', title: '类型系统', level: '入门', duration: '5 分钟',
    description: '深入掌握 Rust 类型系统：类型推导、转换、别名与 newtype 模式，理解如何用类型本身表达语义约束。',
    lessons: [
      { id: '00-index', number: '', title: '类型系统', level: '入门', duration: '5 分钟', tags: ['类型系统', '类型推导', '类型转换', '类型别名', 'newtype'] },
      { id: '01-type-inference', number: '6.1', title: '类型推导（类型推断）', level: '入门', duration: '20 分钟', tags: ['类型推导', '类型推断', '类型标注', '编译器推理'] },
      { id: '02-type-casting', number: '6.2', title: '类型铸造（as 关键字）', level: '入门', duration: '20 分钟', tags: ['类型转换', '类型铸造', 'as', '转换规则', '溢出'] },
      { id: '03-type-aliases', number: '6.3', title: '类型别名（type）', level: '入门', duration: '10 分钟', tags: ['类型别名', 'type', '别名', '可读性'] },
      { id: '04-newtype-pattern', number: '6.4', title: 'Newtype 模式', level: '入门', duration: '10 分钟', tags: ['newtype', '元组结构体', '类型安全', '类型包装'] }
    ]
  },
  {
    id: '07-modules', number: '07', title: '模块系统', level: '入门', duration: '5 分钟',
    description: 'Rust 模块系统基础：Package、Crate、模块的组织方式，模块树、可见性控制、路径导航、use 关键字的完整讲解。',
    lessons: [
      { id: '00-index', number: '', title: '模块系统', level: '入门', duration: '5 分钟', tags: ['模块系统', 'package', 'crate', 'pub', 'use', '路径'] },
      { id: '01-packages-crates', number: '7.1', title: 'Package 和 Crate', level: '入门', duration: '20 分钟', tags: ['package', 'crate', 'cargo', '项目组织', '二进制', '库'] },
      { id: '02-modules', number: '7.2', title: '模块与可见性', level: '进阶', duration: '35 分钟', tags: ['模块', 'mod', 'pub', '可见性', '私有性', '模块树', '封装'] },
      { id: '03-paths-use', number: '7.3', title: '路径与 use 关键字', level: '进阶', duration: '40 分钟', tags: ['路径', '绝对路径', '相对路径', 'use', 'super', '重导出', 'pub use'] }
    ]
  },
  {
    id: '08-engineering', number: '08', title: '项目工程化', level: '入门', duration: '5 分钟',
    description: '掌握 Cargo 工程化能力：工作空间、条件编译 Features、构建脚本 build.rs 和文档注释，让项目可扩展、可维护。',
    lessons: [
      { id: '00-index', number: '', title: '项目工程化', level: '入门', duration: '5 分钟', tags: ['workspace', 'features', 'build.rs', '文档注释', 'doctest', 'cargo'] },
      { id: '01-workspace', number: '8.1', title: '工作空间', level: '入门', duration: '25 分钟', tags: ['workspace', 'cargo', '多crate', 'monorepo', '共享依赖', 'virtual workspace'] },
      { id: '02-build-scripts', number: '8.2', title: '构建脚本 build.rs', level: '进阶', duration: '35 分钟', tags: ['build.rs', '构建脚本', '代码生成', '原生库', 'OUT_DIR', 'cargo指令'] },
      { id: '03-doc-comments', number: '8.3', title: '文档注释与 doctest', level: '入门', duration: '20 分钟', tags: ['文档注释', 'doctest', '///', '//!', 'cargo doc', 'cargo test'] }
    ]
  },
  {
    id: '09-error-handling', number: '09', title: '错误处理', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 错误处理体系：panic!/Result/?，写出健壮可维护的代码。',
    lessons: [
      { id: '00-index', number: '', title: '错误处理', level: '入门', duration: '5 分钟', tags: ['错误处理', 'panic', 'Result', '?'] },
      { id: '01-panic', number: '9.1', title: 'panic! 与不可恢复错误', level: '入门', duration: '15 分钟', tags: ['panic', '错误处理', 'backtrace', '不可恢复错误', 'index out of bounds'] },
      { id: '02-result', number: '9.2', title: 'Result<T, E>', level: '入门', duration: '20 分钟', tags: ['Result', 'Ok', 'Err', 'unwrap', 'expect', '错误处理', 'match', '错误传播'] },
      { id: '03-question-mark', number: '9.3', title: '? 运算符', level: '入门', duration: '20 分钟', tags: ['? 运算符', '错误传播', 'From', 'Option', 'Result', '错误处理'] },
      { id: '04-when-to-panic', number: '9.4', title: '何时 panic，何时 Result', level: '入门', duration: '20 分钟', tags: ['panic', 'Result', '错误处理策略', '不变量', '类型系统', 'unwrap'] },
      { id: '05-multiple-errors', number: '9.5', title: '多种错误来源与遍历 Result', level: '入门', duration: '20 分钟', tags: ['Box<dyn Error>', '多种错误', 'filter_map', 'collect', 'partition', '遍历Result'] }
    ]
  },
  {
    id: '10-generics-traits', number: '10', title: '泛型与 Trait', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 类型系统的核心机制：泛型消除代码重复，Trait 定义行为契约，两者结合构成 Rust 抽象能力的基础。',
    lessons: [
      { id: '00-index', number: '', title: '泛型与 Trait', level: '入门', duration: '5 分钟', tags: ['泛型', 'trait', 'trait 约束', '关联类型', '单态化', 'impl Trait'] },
      { id: '01-generics-syntax', number: '10.1', title: '泛型语法基础', level: '入门', duration: '20 分钟', tags: ['泛型', 'generics', '类型参数', '单态化', 'monomorphization'] },
      { id: '02-traits', number: '10.2', title: 'Trait：定义共享行为', level: '进阶', duration: '35 分钟', tags: ['trait', 'impl for', 'derive', '运算符重载', '父 trait', '孤儿规则'] },
      { id: '03-trait-bounds', number: '10.3', title: 'Trait 约束与 impl Trait', level: '进阶', duration: '20 分钟', tags: ['trait 约束', 'bounds', 'where 子句', 'impl Trait', '多重约束'] },
      { id: '04-conversion-traits', number: '10.4', title: '转换 Trait', level: '进阶', duration: '30 分钟', tags: ['转换trait', 'From', 'Into', 'TryFrom', 'TryInto', '类型转换'] },
      { id: '05-practice', number: '10.5', title: '综合练习', level: '进阶', duration: '10 分钟', tags: ['泛型', '练习', '综合'] }
    ]
  },
  {
    id: '11-lifetimes', number: '11', title: '生命周期', level: '入门', duration: '5 分钟',
    description: '生命周期是 Rust 最独特的特性之一，它让编译器能够在不需要垃圾回收器的情况下，保证所有引用永远不会成为悬垂指针。',
    lessons: [
      { id: '00-index', number: '', title: '生命周期', level: '入门', duration: '5 分钟', tags: ['生命周期', '借用检查器', '内存安全', '悬垂指针', '省略规则', "'static 生命周期"] },
      { id: '01-what-are-lifetimes', number: '11.1', title: '为什么需要生命周期', level: '进阶', duration: '15 分钟', tags: ['lifetime', '生命周期', '悬垂引用', '借用检查器', 'borrow checker'] },
      { id: '02-lifetime-annotations', number: '11.2', title: '函数中的生命周期', level: '进阶', duration: '25 分钟', tags: ['lifetime annotation', '生命周期标注', '函数', 'lifetime coercion', "'a: 'b"] },
      { id: '03-struct-lifetimes', number: '11.3', title: '结构体中的生命周期', level: '进阶', duration: '30 分钟', tags: ['struct lifetime', '结构体生命周期', 'impl', '方法', 'T: \'a', 'trait'] },
      { id: '04-lifetime-elision', number: '11.4', title: '省略规则与 \'static', level: '进阶', duration: '20 分钟', tags: ['lifetime elision', '生命周期省略', 'static', "'static", '省略规则'] },
      { id: '05-practice', number: '11.5', title: '综合练习', level: '进阶', duration: '20 分钟', tags: ['lifetime', '生命周期', '练习', '综合练习', '编程练习'] }
    ]
  },
  {
    id: '12-closures-iterators', number: '12', title: '闭包与迭代器', level: '入门', duration: '5 分钟',
    description: '闭包让你捕获上下文、传递行为；迭代器让你惰性处理序列——两者配合构成 Rust 函数式编程的核心',
    lessons: [
      { id: '00-index', number: '', title: '闭包与迭代器', level: '入门', duration: '5 分钟', tags: ['闭包', '迭代器', 'Fn', 'Iterator', 'map', 'filter', '零开销抽象'] },
      { id: '01-closures', number: '12.1', title: '闭包语法与捕获', level: '进阶', duration: '20 分钟', tags: ['closure', '闭包', '捕获', 'move', 'FnOnce', '捕获环境'] },
      { id: '02-fn-traits', number: '12.2', title: 'Fn trait 与闭包的高阶用法', level: '进阶', duration: '20 分钟', tags: ['Fn', 'FnMut', 'FnOnce', '闭包参数', 'impl Fn', '高阶函数'] },
      { id: '03-iterators', number: '12.3', title: '迭代器基础', level: '进阶', duration: '40 分钟', tags: ['迭代器', 'Iterator', 'next', 'iter', 'into_iter', '惰性求值', '自定义迭代器'] },
      { id: '04-adaptors', number: '12.4', title: '适配器', level: '进阶', duration: '40 分钟', tags: ['消费适配器', '迭代器适配器', 'map', 'filter', 'collect', 'fold', 'zip', 'enumerate', 'Iterator'] },
      { id: '05-practice', number: '12.5', title: '综合练习', level: '进阶', duration: '10 分钟', tags: ['Iterator', '闭包', 'filter', 'map', 'collect', '综合练习'] }
    ]
  },
  {
    id: '13-smart-pointers', number: '13', title: '智能指针', level: '入门', duration: '5 分钟',
    description: '深入理解 Rust 的内存管理机制，掌握 Box、Rc、RefCell 等核心智能指针的使用场景与底层原理。',
    lessons: [
      { id: '00-index', number: '', title: '智能指针', level: '入门', duration: '5 分钟', tags: ['智能指针', 'Box', 'Rc', 'RefCell', 'Deref', 'Drop', '所有权', '堆内存'] },
      { id: '01-box', number: '13.1', title: 'Box<T>：堆内存分配', level: '进阶', duration: '20 分钟', tags: ['Box', '堆分配', '递归类型', 'cons list', '所有权'] },
      { id: '02-deref-drop', number: '13.2', title: 'Deref 与 Drop：智能指针的两翼', level: '进阶', duration: '30 分钟', tags: ['Deref', 'Drop', '解引用', '解引用强制转换', 'RAII', '析构'] },
      { id: '03-rc', number: '13.3', title: 'Rc<T>：引用计数与共享所有权', level: '进阶', duration: '20 分钟', tags: ['Rc', '引用计数', '共享所有权', '单线程', 'strong_count'] },
      { id: '04-refcell', number: '13.4', title: 'RefCell<T> 与内部可变性', level: '进阶', duration: '25 分钟', tags: ['RefCell', '内部可变性', '运行时借用检查', 'Rc<RefCell<T>>'] }
    ]
  },
  {
    id: '14-concurrency', number: '14', title: '并发编程', level: '入门', duration: '5 分钟',
    description: '探索 Rust 的无畏并发：从多线程基础到消息传递与共享状态。',
    lessons: [
      { id: '00-index', number: '', title: '并发编程', level: '入门', duration: '5 分钟', tags: ['并发', '多线程', 'Arc', 'Mutex', 'Channels', '线程安全'] },
      { id: '01-threads', number: '14.1', title: '线程', level: '进阶', duration: '25 分钟', tags: ['线程', 'thread::spawn', 'JoinHandle', 'move 闭包', '并发'] },
      { id: '02-channels', number: '14.2', title: '消息传递', level: '进阶', duration: '20 分钟', tags: ['通道', 'mpsc', '消息传递', '发送者', '接收者', '并发'] },
      { id: '03-shared-state', number: '14.3', title: '共享状态', level: '进阶', duration: '30 分钟', tags: ['Mutex', 'Arc', '共享状态', '互斥锁', '原子引用计数', '线程安全'] },
      { id: '04-sync-send', number: '14.4', title: 'Send 与 Sync', level: '进阶', duration: '20 分钟', tags: ['Send', 'Sync', '标记trait', '线程安全', 'Arc', 'Rc'] }
    ]
  },
  {
    id: '15-testing', number: '15', title: '测试', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 测试体系：从编写单元测试、控制测试运行方式，到组织集成测试。',
    lessons: [
      { id: '00-index', number: '', title: '测试', level: '入门', duration: '5 分钟', tags: ['测试', '单元测试', '集成测试', 'cargo test', 'assert', 'should_panic'] },
      { id: '01-unit-tests', number: '15.1', title: '编写单元测试', level: '入门', duration: '20 分钟', tags: ['单元测试', '#[test]', 'assert!', 'assert_eq!', 'should_panic', 'cargo test'] },
      { id: '02-test-control', number: '15.2', title: '控制测试运行', level: '入门', duration: '15 分钟', tags: ['cargo test', '测试过滤', '并行测试', 'ignore', 'show-output', 'test-threads'] },
      { id: '03-integration-tests', number: '15.3', title: '集成测试', level: '入门', duration: '15 分钟', tags: ['集成测试', 'tests/', '共享模块', '测试组织'] }
    ]
  },
  {
    id: '16-debugging', number: '16', title: '调试', level: '入门', duration: '5 分钟',
    description: '学习 Rust 调试技巧：dbg! 宏、IDE 调试器、日志输出等工具的使用。',
    lessons: [
      { id: '00-index', number: '', title: '调试', level: '入门', duration: '5 分钟', tags: ['调试', 'dbg!', '调试器', '日志', 'log', 'env_logger'] },
      { id: '01-dbg-macro', number: '16.1', title: 'dbg! 宏：快速打印调试', level: '入门', duration: '15 分钟', tags: ['dbg!', '打印调试', '调试宏', 'stdout'] },
      { id: '02-ide-debugger', number: '16.2', title: 'IDE 调试器（rust-analyzer）', level: '进阶', duration: '30 分钟', tags: ['IDE', '调试器', 'rust-analyzer', '断点', '调试'] },
      { id: '03-logging', number: '16.3', title: '日志输出（log + env_logger）', level: '进阶', duration: '25 分钟', tags: ['log', 'env_logger', '日志', '日志级别', 'tracing'] }
    ]
  },
  {
    id: '17-methodology', number: '17', title: '开发方法论', level: '入门', duration: '5 分钟',
    description: '学习 Rust 项目开发最佳实践：架构设计、TDD、代码质量、CI/CD 和性能分析。',
    lessons: [
      { id: '00-index', number: '', title: '开发方法论', level: '入门', duration: '5 分钟', tags: ['架构设计', 'TDD', 'Clippy', 'rustfmt', 'CI/CD', '性能分析'] },
      { id: '01-architecture', number: '17.1', title: 'Rust 工程架构设计', level: '进阶', duration: '30 分钟', tags: ['架构', '项目结构', '模块化', '分层架构'] },
      { id: '02-coding-flow', number: '17.2', title: '编码流程与 TDD', level: '进阶', duration: '25 分钟', tags: ['TDD', '测试驱动开发', '编码流程', '重构'] },
      { id: '03-lint', number: '17.3', title: '代码质量：Lint、Clippy 与 rustfmt', level: '入门', duration: '25 分钟', tags: ['Clippy', 'rustfmt', 'lint', '代码格式', '代码规范'] },
      { id: '04-ci', number: '17.4', title: '持续集成与依赖管理', level: '进阶', duration: '30 分钟', tags: ['CI/CD', 'GitHub Actions', '依赖管理', 'cargo audit', '依赖更新'] },
      { id: '05-profiling', number: '17.5', title: '性能分析与基准测试', level: '进阶', duration: '35 分钟', tags: ['基准测试', '性能分析', 'flamegraph', 'criterion', 'perf'] }
    ]
  },
  {
    id: '18-unsafe', number: '18', title: '不安全 Rust', level: '入门', duration: '5 分钟',
    description: '学习 unsafe Rust 的使用场景：裸指针、unsafe 函数与 trait，以及安全抽象原则。',
    lessons: [
      { id: '00-index', number: '', title: '不安全 Rust', level: '入门', duration: '5 分钟', tags: ['unsafe', '裸指针', 'unsafe trait', '安全抽象', 'FFI'] },
      { id: '01-unsafe', number: '18.1', title: 'unsafe 块与超能力', level: '进阶', duration: '20 分钟', tags: ['unsafe', 'unsafe 块', 'unsafe 能力'] },
      { id: '02-raw-pointers', number: '18.2', title: '裸指针', level: '进阶', duration: '25 分钟', tags: ['*const T', '*mut T', '裸指针', '指针操作'] },
      { id: '03-unsafe-functions', number: '18.3', title: 'unsafe 函数与 Trait', level: '进阶', duration: '25 分钟', tags: ['unsafe fn', 'unsafe trait', 'unsafe impl'] },
      { id: '04-safe-abstractions', number: '18.4', title: '安全抽象', level: '进阶', duration: '30 分钟', tags: ['安全抽象', '封装 unsafe', 'API 设计'] }
    ]
  },
  {
    id: '19-c-interop', number: '19', title: '与 C 语言交互', level: '入门', duration: '5 分钟',
    description: '学习 Rust 与 C 语言的互操作：FFI 基础、bindgen、cbindgen 和混合编译。',
    lessons: [
      { id: '00-index', number: '', title: '与 C 语言交互', level: '入门', duration: '5 分钟', tags: ['FFI', 'C 交互', 'bindgen', 'cbindgen', '混合编译'] },
      { id: '01-ffi-basics', number: '19.1', title: 'FFI 基础', level: '进阶', duration: '25 分钟', tags: ['FFI', 'extern "C"', 'C ABI', 'C 函数调用'] },
      { id: '02-bindgen', number: '19.2', title: '自动生成绑定：bindgen', level: '进阶', duration: '30 分钟', tags: ['bindgen', 'C 绑定生成', '自动绑定'] },
      { id: '03-cbindgen', number: '19.3', title: '暴露 Rust 给 C：cbindgen', level: '进阶', duration: '30 分钟', tags: ['cbindgen', 'Rust 暴露', 'C 头文件生成'] },
      { id: '04-mixed-build', number: '19.4', title: '静态混合编译：Rust 与 C 的深度链接', level: '进阶', duration: '35 分钟', tags: ['混合编译', '静态链接', 'cc crate', 'build.rs'] }
    ]
  },
  {
    id: '20-embedded', number: '20', title: '嵌入式 Rust', level: '入门', duration: '5 分钟',
    description: '探索嵌入式 Rust 开发：no_std、内存布局、PAC/HAL、中断处理与 Embassy 框架。',
    lessons: [
      { id: '00-index', number: '', title: '嵌入式 Rust', level: '入门', duration: '5 分钟', tags: ['嵌入式', 'no_std', 'PAC', 'HAL', 'Embassy', '中断'] },
      { id: '01-no-std-basics', number: '20.1', title: '裸机开发基础：no_std 环境', level: '进阶', duration: '25 分钟', tags: ['no_std', '裸机', '嵌入式', 'core crate', 'alloc crate'] },
      { id: '02-memory-layout', number: '20.2', title: '内存布局与链接脚本', level: '进阶', duration: '30 分钟', tags: ['内存布局', '链接脚本', 'linker.x', '内存映射'] },
      { id: '03-hardware-abstraction', number: '20.3', title: '硬件抽象：PAC 与 HAL', level: '进阶', duration: '30 分钟', tags: ['PAC', 'HAL', 'svd2rust', 'embedded-hal'] },
      { id: '04-interrupts-concurrency', number: '20.4', title: '中断与并发安全', level: '进阶', duration: '35 分钟', tags: ['中断', 'interrupt', '临界区', 'RTIC', '并发安全'] },
      { id: '05-async-embassy', number: '20.5', title: '异步嵌入式：Embassy 框架', level: '进阶', duration: '40 分钟', tags: ['Embassy', '异步', 'async/await', '嵌入式异步'] },
      { id: '06-toolchain-debug', number: '20.6', title: '实战演练：简易内核实验', level: '进阶', duration: '50 分钟', tags: ['内核', '实战', '裸机编程', '完整项目'] }
    ]
  },
  {
    id: '21-proc-macros', number: '21', title: '过程宏', level: '入门', duration: '5 分钟',
    description: '学习 Rust 过程宏：自定义 derive、属性宏、函数宏，以及 syn/quote 的使用。',
    lessons: [
      { id: '00-index', number: '', title: '过程宏', level: '入门', duration: '5 分钟', tags: ['过程宏', 'proc macro', 'derive', '属性宏', '函数宏', 'syn', 'quote'] },
      { id: '01-proc-macro-basics', number: '21.1', title: '过程宏基础', level: '进阶', duration: '25 分钟', tags: ['proc macro', 'proc-macro crate', 'TokenStream', '过程宏入门'] },
      { id: '02-derive-macros', number: '21.2', title: '自定义 derive 宏', level: '进阶', duration: '35 分钟', tags: ['#[derive(...)]', '自定义 derive', 'proc-macro-derive'] },
      { id: '03-attribute-macros', number: '21.3', title: '类属性宏', level: '进阶', duration: '30 分钟', tags: ['属性宏', '#[attr]', 'proc-macro-attribute'] },
      { id: '04-function-like-macros', number: '21.4', title: '类函数宏', level: '进阶', duration: '30 分钟', tags: ['函数宏', 'macro!', 'proc-macro'] },
    ]
  },
  {
    id: '22-advanced', number: '22', title: '高级特性', level: '入门', duration: '5 分钟',
    description: '深入探索 Rust 高级特性：关联类型、dyn Trait、高级类型、异步编程基础等。',
    lessons: [
      { id: '00-index', number: '', title: '高级特性', level: '入门', duration: '5 分钟', tags: ['关联类型', 'dyn Trait', '异步', '高级模式匹配'] },
      { id: '01-associated-types', number: '22.1', title: '关联类型', level: '进阶', duration: '25 分钟', tags: ['关联类型', 'trait 关联类型', 'Iterator::Item'] },
      { id: '02-dyn-trait', number: '22.2', title: 'dyn Trait：动态分发', level: '进阶', duration: '30 分钟', tags: ['dyn Trait', '动态分发', 'trait 对象', 'vtable'] },
      { id: '03-async-basics', number: '22.3', title: '异步编程', level: '进阶', duration: '40 分钟', tags: ['异步', 'async/await', 'Future', 'tokio', 'async-std'] },
      { id: '04-advanced-patterns', number: '22.4', title: '模式匹配进阶', level: '进阶', duration: '25 分钟', tags: ['高级模式匹配', '@ 绑定', '模式守卫', 'ref 模式'] }
    ]
  },
  {
    id: '23-projects', number: '23', title: '综合项目', level: '入门', duration: '5 分钟',
    description: '通过完整项目实战，将所有 Rust 知识融会贯通：从命令行参数解析到数据模型，从命令分发到数据持久化。',
    lessons: [
      { id: '00-index', number: '', title: '综合项目', level: '入门', duration: '5 分钟', tags: ['项目实战', 'CLI', 'Todo', '命令行', '文档', 'Rust 综合'] },
      { id: '01-project-design', number: '23.1', title: '项目架构', level: '进阶', duration: '15 分钟', tags: ['项目架构', 'workspace', 'lib crate', 'bin crate', '设计思路', '分层'] },
      { id: '02-parsing', number: '23.2', title: '解析命令行参数', level: '进阶', duration: '25 分钟', tags: ['命令行参数', '枚举', '模式匹配', 'args', 'Result', 'lib.rs'] },
      { id: '03-data-modeling', number: '23.3', title: '数据建模', level: '进阶', duration: '30 分钟', tags: ['数据建模', '结构体', 'Vec', 'TDD', '方法签名', 'impl'] },
      { id: '04-implementing', number: '23.4', title: '实现 TodoList', level: '进阶', duration: '35 分钟', tags: ['TDD', '测试驱动', 'impl', '迭代器', '命令分发', 'run函数'] },
      { id: '05-connecting', number: '23.5', title: '接入 run 函数', level: '进阶', duration: '20 分钟', tags: ['命令分发', 'run函数', 'execute', 'TDD', 'cargo run'] },
      { id: '06-persistence', number: '23.6', title: '数据持久化', level: '进阶', duration: '30 分钟', tags: ['持久化', 'serde_json', '文件读写', 'JSON', '错误处理', 'PathBuf'] },
      { id: '07-polish', number: '23.7', title: '体验优化', level: '进阶', duration: '30 分钟', tags: ['体验优化', '错误信息', 'format', '对齐', 'Display', 'crossterm', '彩色输出'] },
      { id: '08-documentation', number: '23.8', title: '生成文档', level: '进阶', duration: '20 分钟', tags: ['文档', 'rustdoc', 'cargo doc', '文档测试', 'doc comments'] }
    ]
  }
];

export function getAllLessons(): { chapterId: string; lesson: Lesson }[] {
  const result: { chapterId: string; lesson: Lesson }[] = [];
  for (const ch of courseData) {
    for (const ls of ch.lessons) {
      result.push({ chapterId: ch.id, lesson: ls });
    }
  }
  return result;
}

export function getChapterById(id: string): Chapter | undefined {
  return courseData.find(c => c.id === id);
}
```

- [ ] **Step 2: Create src/lib/progress.ts**

```ts
export function getLessonKey(chapterId: string, lessonId: string): string {
  return `rust-tutorial-completed-${chapterId}-${lessonId}`;
}

export function isLessonCompleted(chapterId: string, lessonId: string): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(getLessonKey(chapterId, lessonId)) === 'true';
}

export function markLessonComplete(chapterId: string, lessonId: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getLessonKey(chapterId, lessonId), 'true');
}

export function resetLesson(chapterId: string, lessonId: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(getLessonKey(chapterId, lessonId));
}

export function getChapterProgress(chapterId: string, totalLessons: number): { completed: number; total: number; pct: number } {
  if (typeof localStorage === 'undefined') return { completed: 0, total: totalLessons, pct: 0 };
  let completed = 0;
  for (let i = 0; i < totalLessons; i++) {
    // we need actual lesson IDs; the caller passes them in
  }
  return { completed: 0, total: totalLessons, pct: 0 };
}

export function getLastVisited(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('rust-tutorial-last-visited');
}

export function setLastVisited(path: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('rust-tutorial-last-visited', path);
}

export function migrateOldProgressKey(): void {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem('rust-tutorial-completed') !== null) {
    localStorage.removeItem('rust-tutorial-completed');
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/courseData.ts src/lib/progress.ts
git commit -m "feat: add courseData and progress TypeScript libraries"
```

---

### Task 6: Build BaseLayout.astro (server-rendered shell)

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `courseData` from `../lib/courseData`
- Produces: `<BaseLayout>` component wrapping all pages with navbar, sidebar, TOC, footer, background orbs, confirm dialog

- [ ] **Step 1: Create src/layouts/BaseLayout.astro**

```astro
---
import '../styles/global.css';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import Sidebar from '../components/Sidebar.astro';
import PageToc from '../components/PageToc.astro';
import ConfirmDialog from '../components/ConfirmDialog.astro';
import { courseData } from '../lib/courseData';

interface Props {
  title: string;
  description?: string;
  showSidebar?: boolean;
  showToc?: boolean;
  chapterId?: string;
  lessonId?: string;
  prevLesson?: { chapterId: string; lessonId: string; title: string } | null;
  nextLesson?: { chapterId: string; lessonId: string; title: string } | null;
  chapterTitle?: string;
  lessonTitle?: string;
  level?: string;
  duration?: string;
  tags?: string[];
}

const {
  title,
  description = 'RUST 互动教程 — 零基础系统学习 Rust 语言',
  showSidebar = false,
  showToc = false,
  chapterId,
  lessonId,
  prevLesson,
  nextLesson,
  chapterTitle,
  lessonTitle,
  level,
  duration,
  tags = [],
} = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content={description}>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦀</text></svg>">
  <link rel="icon" type="image/svg+xml" href="/RustCourse/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <title>{title} — RUST 互动教程</title>
</head>
<body>
  <div class="page-bg" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <Navbar />

  <main>
    <ConfirmDialog client:load />

    {
      showSidebar ? (
        <div class="chapter-layout">
          <Sidebar chapterId={chapterId} lessonId={lessonId} client:load />
          <div class="chapter-body">
            <!-- breadcrumb, title, meta, section-progress, content, article-nav: provided by caller via slot -->
            <slot />
          </div>
          {showToc && <PageToc client:load />}
        </div>
      ) : (
        <slot />
      )
    }
  </main>

  <Footer />
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout.astro shell component"
```

---

### Task 7: Build server-rendered UI components

**Files:**
- Create: `src/components/Navbar.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/Breadcrumb.astro`
- Create: `src/components/ArticleNav.astro`
- Create: `src/components/HeroSection.astro`
- Create: `src/components/ChapterBlock.astro`

**Interfaces:**
- Produces: Pure Astro (server-rendered) components with no client JS

- [ ] **Step 1: Create Navbar.astro**

```astro
<header class="navbar">
  <div class="navbar-inner">
    <a href="/RustCourse/" class="logo">
      <span class="logo-rust">RUST</span> 互动教程
    </a>
    <nav class="nav-links">
      <a href="/RustCourse/" class="nav-link" data-nav="home">首页</a>
      <a href="/RustCourse/chapters/00-preface/00-index" class="nav-link" data-nav="tutorial" id="nav-tutorial">教程</a>
    </nav>
    <a href="/RustCourse/certificate" class="nav-progress" id="nav-progress">
      <span id="nav-progress-text">总进度：0%</span>
      <span class="nav-progress-tip">100% 后可获得证书</span>
    </a>
  </div>
</header>

<script>
  import { getTotalProgress } from '../lib/progress';
  import { courseData } from '../lib/courseData';

  function updateNavProgress() {
    let total = 0, completed = 0;
    courseData.forEach(ch => {
      ch.lessons.forEach(ls => {
        total++;
        const key = `rust-tutorial-completed-${ch.id}-${ls.id}`;
        if (localStorage.getItem(key) === 'true') completed++;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const el = document.getElementById('nav-progress-text');
    if (el) el.textContent = `总进度：${pct}%`;
    const link = document.getElementById('nav-progress');
    if (link) {
      if (pct >= 100) {
        link.classList.add('nav-progress--unlocked');
        link.querySelector('.nav-progress-tip')!.textContent = '🎓 证书已解锁';
      }
    }
  }

  // Restore last visited
  const last = localStorage.getItem('rust-tutorial-last-visited');
  if (last) {
    const tutorial = document.getElementById('nav-tutorial');
    if (tutorial) tutorial.setAttribute('href', `/RustCourse/${last}`);
  }
  updateNavProgress();
  window.addEventListener('storage', updateNavProgress);
  window.addEventListener('progress-updated', updateNavProgress);
</script>
```

- [ ] **Step 2: Create Footer.astro**

```astro
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-left">
      <span class="footer-brand"><span class="accent">RUST</span> 互动教程</span>
    </div>
    <div class="footer-center">
      <span class="footer-meta">
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23CE412B'/></svg>" alt="" class="footer-avatar" width="16" height="16" loading="lazy">
        雪云飞星（付皓文）
      </span>
    </div>
    <div class="footer-right">
      <span class="footer-copy">© 2026</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create Breadcrumb.astro**

```astro
---
interface Props {
  chapterId: string;
  lessonId: string;
  chapterTitle: string;
  lessonTitle: string;
}

const { chapterId, lessonId, chapterTitle, lessonTitle } = Astro.props;
const chLesson = courseData.find(c => c.id === chapterId)?.lessons[0];
---

<nav class="breadcrumb">
  <a href="/RustCourse/" class="breadcrumb-link">课程</a>
  <span class="breadcrumb-sep" aria-hidden="true">／</span>
  <a href={`/RustCourse/chapters/${chapterId}/${chLesson?.id ?? '00-index'}`} class="breadcrumb-link">{chapterTitle}</a>
  <span class="breadcrumb-sep" aria-hidden="true">／</span>
  <span class="breadcrumb-current">{lessonTitle}</span>
</nav>
```

Wait — Astro components can't access imports not explicitly stated. Fix:

```astro
---
import { courseData } from '../lib/courseData';

interface Props {
  chapterId: string;
  lessonId: string;
  chapterTitle: string;
  lessonTitle: string;
}

const { chapterId, chapterTitle, lessonTitle } = Astro.props;
const chLesson = courseData.find(c => c.id === chapterId)?.lessons[0];
---

<nav class="breadcrumb">
  <a href="/RustCourse/" class="breadcrumb-link">课程</a>
  <span class="breadcrumb-sep" aria-hidden="true">／</span>
  <a href={`/RustCourse/chapters/${chapterId}/${chLesson?.id ?? '00-index'}`} class="breadcrumb-link">{chapterTitle}</a>
  <span class="breadcrumb-sep" aria-hidden="true">／</span>
  <span class="breadcrumb-current">{lessonTitle}</span>
</nav>
```

- [ ] **Step 4: Create ArticleNav.astro**

```astro
---
interface Props {
  prevLesson: { chapterId: string; lessonId: string; title: string } | null;
  nextLesson: { chapterId: string; lessonId: string; title: string } | null;
}

const { prevLesson, nextLesson } = Astro.props;
---

<nav class="article-nav">
  <div class="article-nav-prev" style={`visibility: ${prevLesson ? 'visible' : 'hidden'}`}>
    {prevLesson && (
      <a href={`/RustCourse/chapters/${prevLesson.chapterId}/${prevLesson.lessonId}`} class="article-nav-link">
        <span class="nav-label">← 上一节</span>
        <span class="nav-title">{prevLesson.title}</span>
      </a>
    )}
  </div>
  <div class="article-nav-next" style={`visibility: ${nextLesson ? 'visible' : 'hidden'}`}>
    {nextLesson && (
      <a href={`/RustCourse/chapters/${nextLesson.chapterId}/${nextLesson.lessonId}`} class="article-nav-link">
        <span class="nav-label">下一节 →</span>
        <span class="nav-title">{nextLesson.title}</span>
      </a>
    )}
  </div>
</nav>
```

- [ ] **Step 5: Create HeroSection.astro**

```astro
<section class="hero">
  <div class="hero-bg" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">循序 · 互动 · 零基础</div>
    <h1 class="hero-title"><span class="accent">RUST</span> 互动教程</h1>
    <p class="hero-subtitle">像官方 Rust Book 一样系统讲解，加入在线代码执行、可编辑练习、章节测验等互动功能。从第一行代码开始，逐步掌握 Rust 语言。</p>
    <div class="hero-actions">
      <a href="/RustCourse/chapters/00-preface/00-index" class="btn-primary" id="start-btn">开始学习 →</a>
    </div>
    <div class="hero-author">
      <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23CE412B'/></svg>" alt="雪云飞星" class="hero-avatar" width="18" height="18" loading="lazy">
      <span>作者：雪云飞星（付皓文）</span>
      <span class="ai-badge">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z"></path></svg>
        AI 协作
      </span>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Create ChapterBlock.astro**

```astro
---
import type { Chapter } from '../lib/courseData';

interface Props {
  chapter: Chapter;
}

const { chapter } = Astro.props;
const chNum = chapter.number === '序' ? '序' : `第${parseInt(chapter.number, 10)}章`;
---

<div class="chapter-block" id={chapter.id}>
  <div class="outline-item chapter-item">
    <a class="outline-link" href={`/RustCourse/chapters/${chapter.id}/${chapter.lessons[0].id}`}>
      <div class="item-main-row">
        <span class="chapter-num-badge">{chapter.number}</span>
        <span class="item-title">{chapter.title}</span>
      </div>
      <div class="item-sub-row">
        <span class="item-desc">{chapter.description}</span>
      </div>
    </a>
  </div>

  {chapter.lessons.length > 1 && (
    <ul class="article-list">
      {chapter.lessons.slice(1).map(lesson => (
        <li class="outline-item article-item">
          <a class="outline-link" href={`/RustCourse/chapters/${chapter.id}/${lesson.id}`}>
            <div class="item-main-row">
              <span class="article-num">{lesson.number || chapter.number}</span>
              <span class="item-title">{lesson.title}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )}
</div>
```

- [ ] **Step 7: Verify components compile**

Create a temporary test page to import them: `src/pages/test.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Test">
  <p>Components loaded OK</p>
</BaseLayout>
```

Run `npx astro dev` and visit localhost:4321/RustCourse/test. Expected: page renders with navbar, footer, background orbs.

Delete the test page after verification.

- [ ] **Step 8: Commit**

```bash
git add src/components/Navbar.astro src/components/Footer.astro src/components/Breadcrumb.astro src/components/ArticleNav.astro src/components/HeroSection.astro src/components/ChapterBlock.astro
git commit -m "feat: add server-rendered UI components"
```

---

### Task 8: Build index.astro (homepage)

**Files:**
- Create: `src/pages/index.astro`

**Interfaces:**
- Produces: Static homepage at `/RustCourse/` with hero section, course outline, progress bar

- [ ] **Step 1: Create src/pages/index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection.astro';
import ChapterBlock from '../components/ChapterBlock.astro';
import { courseData } from '../lib/courseData';
---

<BaseLayout title="首页">
  <HeroSection />

  <section class="outline" id="outline">
    <div class="outline-inner">
      <div class="outline-header">
        <p class="section-label">课程目录</p>
        <div class="overall-progress" id="overall-progress">
          <div class="overall-progress-track">
            <div class="overall-progress-fill" id="overall-progress-fill" style="width: 0%"></div>
          </div>
          <div class="overall-progress-indicator" id="overall-progress-indicator" data-has-progress="false">
            <span class="overall-progress-pct" id="overall-progress-pct">0%</span>
            <button type="button" class="overall-reset-btn" id="reset-all-btn" aria-label="重置全部进度">↺ 重置全部进度</button>
          </div>
        </div>
      </div>
      <div id="chapter-list">
        {courseData.map(chapter => (
          <ChapterBlock chapter={chapter} />
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  // Client-side progress update for homepage
  import { courseData } from '../lib/courseData';

  function updateProgress() {
    let total = 0, completed = 0;
    courseData.forEach(ch => {
      ch.lessons.forEach(ls => {
        total++;
        if (localStorage.getItem(`rust-tutorial-completed-${ch.id}-${ls.id}`) === 'true') completed++;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const fill = document.getElementById('overall-progress-fill');
    const pctEl = document.getElementById('overall-progress-pct');
    const indicator = document.getElementById('overall-progress-indicator');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (indicator) indicator.setAttribute('data-has-progress', completed > 0 ? 'true' : 'false');
  }

  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      const last = localStorage.getItem('rust-tutorial-last-visited');
      if (last) {
        e.preventDefault();
        window.location.href = `/RustCourse/${last}`;
      }
    });
  }

  const resetBtn = document.getElementById('reset-all-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('确认重置全部学习进度？此操作不可恢复。')) {
        courseData.forEach(ch => {
          ch.lessons.forEach(ls => {
            localStorage.removeItem(`rust-tutorial-completed-${ch.id}-${ls.id}`);
          });
        });
        updateProgress();
        window.dispatchEvent(new CustomEvent('progress-updated'));
      }
    });
  }

  updateProgress();
</script>
```

- [ ] **Step 2: Verify homepage builds**

Run `npx astro build`. Expected: builds without errors. Check `dist/RustCourse/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage with hero and course outline"
```

---

### Task 9: Build [lessonId].astro (lesson pages)

**Files:**
- Create: `src/pages/chapters/[chapterId]/[lessonId].astro`
- Modify: `src/layouts/BaseLayout.astro` — update slot usage

**Interfaces:**
- Consumes: content collection `lessons`, `courseData`
- Produces: 133 static pages at `/RustCourse/chapters/{chapterId}/{lessonId}`

- [ ] **Step 1: Create src/pages/chapters/[chapterId]/[lessonId].astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Breadcrumb from '../../../components/Breadcrumb.astro';
import ArticleNav from '../../../components/ArticleNav.astro';
import QuizChoice from '../../../components/QuizChoice.astro';
import CodeRunner from '../../../components/CodeRunner.astro';
import SectionProgress from '../../../components/SectionProgress.astro';
import { courseData, getAllLessons, getChapterById } from '../../../lib/courseData';

export async function getStaticPaths() {
  const entries = await getCollection('lessons');
  return entries.map(entry => ({
    params: {
      chapterId: entry.data.chapterId,
      lessonId: entry.data.lessonId,
    },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { chapterId, lessonId, title, level, duration, tags, chapterTitle } = entry.data;

const allLessons = getAllLessons();
const currentIndex = allLessons.findIndex(
  item => item.chapterId === chapterId && item.lesson.id === lessonId
);

const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

const prevLesson = prevItem ? { chapterId: prevItem.chapterId, lessonId: prevItem.lesson.id, title: prevItem.lesson.title } : null;
const nextLesson = nextItem ? { chapterId: nextItem.chapterId, lessonId: nextItem.lesson.id, title: nextItem.lesson.title } : null;

const diffClass = level === '入门' ? 'difficulty-beginner' :
  level === '进阶' ? 'difficulty-intermediate' : 'difficulty-advanced';

const { Content } = await entry.render();
---

<BaseLayout
  title={title}
  showSidebar={true}
  showToc={true}
  chapterId={chapterId}
  lessonId={lessonId}
  prevLesson={prevLesson}
  nextLesson={nextLesson}
  chapterTitle={chapterTitle}
  lessonTitle={title}
  level={level}
  duration={duration}
  tags={tags}
>
  <Breadcrumb
    chapterId={chapterId}
    lessonId={lessonId}
    chapterTitle={chapterTitle}
    lessonTitle={title}
  />

  <main class="chapter-main">
    <article class="prose" id="article-content">
      <h1 id="lesson-title">{title}</h1>
      <div class="article-meta">
        <span class={`meta-difficulty ${diffClass}`}> {level} </span>
        <span class="meta-time">⏱ {duration}</span>
        {tags.map(tag => (
          <span class="meta-keyword">{tag}</span>
        ))}
      </div>

      <SectionProgress chapterId={chapterId} lessonId={lessonId} client:load />

      <div id="lesson-body">
        <Content />
      </div>

      <div class="lesson-status" id="lesson-status">
        <button type="button" class="ls-complete-btn" id="ls-complete-btn">标记为已完成</button>
      </div>
    </article>

    <ArticleNav prevLesson={prevLesson} nextLesson={nextLesson} />
  </main>

  <script>
    const chapterId = '{chapterId}';
    const lessonId = '{lessonId}';
    const key = `rust-tutorial-completed-${chapterId}-${lessonId}`;

    // Mark complete button
    const btn = document.getElementById('ls-complete-btn');
    if (btn) {
      const isDone = localStorage.getItem(key) === 'true';
      if (isDone) {
        btn.classList.add('ls-is-done');
        btn.textContent = '✓ 已完成';
      }
      btn.addEventListener('click', () => {
        const current = localStorage.getItem(key) === 'true';
        if (current) {
          localStorage.removeItem(key);
          btn.classList.remove('ls-is-done');
          btn.textContent = '标记为已完成';
        } else {
          localStorage.setItem(key, 'true');
          btn.classList.add('ls-is-done');
          btn.textContent = '✓ 已完成';
        }
        window.dispatchEvent(new CustomEvent('progress-updated'));
      });
    }

    // Scroll-to-bottom auto complete
    if (localStorage.getItem(key) !== 'true') {
      let tracked = false;
      const onScroll = () => {
        if (tracked) return;
        const body = document.getElementById('lesson-body');
        if (!body) return;
        const rect = body.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight + 200) {
          tracked = true;
          window.removeEventListener('scroll', onScroll);
          localStorage.setItem(key, 'true');
          window.dispatchEvent(new CustomEvent('progress-updated'));
          const b = document.getElementById('ls-complete-btn');
          if (b) { b.classList.add('ls-is-done'); b.textContent = '✓ 已完成'; }
        }
      };
      window.addEventListener('scroll', onScroll);
    }

    // Set last visited
    localStorage.setItem('rust-tutorial-last-visited', `chapters/${chapterId}/${lessonId}`);
  </script>
</BaseLayout>
```

- [ ] **Step 2: Fix image paths in rendered content**

The `Content` component renders HTML from the markdown body. Images with `/RustCourse/` prefix need path fixing. Add a script to fix them:

```html
<script>
  document.querySelectorAll('#lesson-body img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('/RustCourse/')) {
      img.src = src; // already correct with base=/RustCourse
    }
  });
</script>
```

Actually, since we set `base: '/RustCourse'` in astro.config, `/RustCourse/images/...` paths in content are correct as-is. The `<img>` tags will resolve relative to the base. No fix needed.

- [ ] **Step 3: Verify build**

Run `npx astro build`. Expected: 133 lesson pages generated under `dist/RustCourse/chapters/`. Spot-check `dist/RustCourse/chapters/01-rust-basics/01-installation/index.html` — should contain `<div id="article-content">` with lesson content.

- [ ] **Step 4: Commit**

```bash
git add src/pages/chapters/
git commit -m "feat: add dynamic lesson pages with content collection"
```

---

### Task 10: Build certificate.astro

**Files:**
- Create: `src/pages/certificate.astro`

- [ ] **Step 1: Create certificate page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="证书">
  <div class="certificate-page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;text-align:center;">
    <div style="max-width:500px;">
      <div style="font-size:4rem;margin-bottom:1rem;">🎓</div>
      <h1 style="font-size:2rem;color:var(--color-accent);margin-bottom:0.5rem;">恭喜完成全部课程！</h1>
      <p style="color:var(--color-text-muted);margin-bottom:2rem;">
        你已完成 RUST 互动教程的全部 133 节课程。<br>
        这是对 Rust 语言系统学习的一份见证。
      </p>
      <a href="/RustCourse/" class="btn-primary" style="display:inline-block;padding:0.75rem 2rem;border-radius:6px;text-decoration:none;">
        返回首页
      </a>
    </div>
  </div>
</BaseLayout>

<script>
  import { courseData } from '../lib/courseData';

  let total = 0, completed = 0;
  courseData.forEach(ch => {
    ch.lessons.forEach(ls => {
      total++;
      if (localStorage.getItem(`rust-tutorial-completed-${ch.id}-${ls.id}`) === 'true') completed++;
    });
  });
  if (completed < total) {
    window.location.href = '/RustCourse/';
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/certificate.astro
git commit -m "feat: add certificate page"
```

---

### Task 11: Build Sidebar client island

**Files:**
- Create: `src/components/Sidebar.astro`

**Interfaces:**
- Consumes: `courseData`, `isLessonCompleted` from `../lib/progress`
- Produces: Interactive left sidebar with chapter expand/collapse

- [ ] **Step 1: Create Sidebar.astro**

```astro
---
interface Props {
  chapterId?: string;
  lessonId?: string;
}

const { chapterId, lessonId } = Astro.props;
---

<aside class="sidebar" id="sidebar">
  <nav class="sidebar-nav" aria-label="课程目录" id="sidebar-content"></nav>
</aside>

<script>
  import { courseData } from '../lib/courseData';

  const currentChapterId = '{chapterId}';
  const currentLessonId = '{lessonId}';

  const expandedChapters = new Set(currentChapterId ? [currentChapterId] : []);

  function isLessonDone(chId: string, lsId: string): boolean {
    return localStorage.getItem(`rust-tutorial-completed-${chId}-${lsId}`) === 'true';
  }

  function renderSidebar() {
    const container = document.getElementById('sidebar-content')!;
    container.innerHTML = '';

    courseData.forEach(chapter => {
      const chapterDiv = document.createElement('div');
      chapterDiv.className = 'chapter-item';
      chapterDiv.setAttribute('data-open', expandedChapters.has(chapter.id) ? 'true' : 'false');

      const row = document.createElement('div');
      row.className = 'chapter-row';

      const link = document.createElement('a');
      link.className = 'chapter-link' + (chapter.id === currentChapterId ? ' active' : '');
      link.href = `/RustCourse/chapters/${chapter.id}/${chapter.lessons[0].id}`;

      const num = document.createElement('span');
      num.className = 'chapter-num';
      const numVal = chapter.number;
      if (numVal === '序') num.textContent = '序';
      else if (/^\d+$/.test(numVal)) num.textContent = `第${parseInt(numVal, 10)}章`;
      else num.textContent = numVal;
      link.appendChild(num);
      link.appendChild(document.createTextNode(' ' + chapter.title));
      row.appendChild(link);

      const hasToggle = chapter.lessons.length > 1;
      if (hasToggle) {
        const toggle = document.createElement('button');
        toggle.className = 'chapter-toggle' + (expandedChapters.has(chapter.id) ? ' open' : '');
        toggle.setAttribute('aria-label', expandedChapters.has(chapter.id) ? '折叠' : '展开');
        toggle.setAttribute('aria-expanded', expandedChapters.has(chapter.id) ? 'true' : 'false');
        toggle.innerHTML = '<span class="toggle-arrow">' + (expandedChapters.has(chapter.id) ? '▾' : '▸') + '</span>';
        toggle.addEventListener('click', () => {
          if (expandedChapters.has(chapter.id)) {
            expandedChapters.delete(chapter.id);
          } else {
            expandedChapters.add(chapter.id);
          }
          renderSidebar();
        });
        row.appendChild(toggle);
      }
      chapterDiv.appendChild(row);

      if (hasToggle) {
        const list = document.createElement('ul');
        list.className = 'article-list';
        list.hidden = !expandedChapters.has(chapter.id);
        list.setAttribute('aria-hidden', String(!expandedChapters.has(chapter.id)));

        chapter.lessons.forEach(lesson => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.className = 'article-link';
          if (chapter.id === currentChapterId && lesson.id === currentLessonId) {
            a.classList.add('active');
          }
          a.href = `/RustCourse/chapters/${chapter.id}/${lesson.id}`;

          const done = isLessonDone(chapter.id, lesson.id);
          const icon = document.createElement('span');
          icon.className = 'sd-status' + (done ? ' sd-done' : '');
          icon.textContent = done ? '✓' : '○';
          a.appendChild(icon);

          const numSpan = document.createElement('span');
          numSpan.className = 'article-num';
          numSpan.textContent = lesson.number || chapter.number;
          a.appendChild(numSpan);
          a.appendChild(document.createTextNode(' ' + lesson.title));
          li.appendChild(a);
          list.appendChild(li);
        });
        chapterDiv.appendChild(list);
      }
      container.appendChild(chapterDiv);
    });

    // Auto scroll to active
    const active = container.querySelector('.article-link.active') || container.querySelector('.chapter-link.active');
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  renderSidebar();

  // Listen for progress updates
  window.addEventListener('progress-updated', renderSidebar);
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.astro
git commit -m "feat: add Sidebar client island with expand/collapse"
```

---

### Task 12: Build PageToc client island

**Files:**
- Create: `src/components/PageToc.astro`

**Interfaces:**
- Produces: Right-side table of contents, auto-generated from H1-H3 in `#lesson-body`

- [ ] **Step 1: Create PageToc.astro**

```astro
<aside class="toc-sidebar" id="toc-sidebar">
  <nav class="toc-nav" aria-label="本页目录">
    <div class="toc-title">目录</div>
    <ul class="toc-list" id="toc-list"></ul>
  </nav>
</aside>

<script>
  function renderToc() {
    const body = document.getElementById('lesson-body');
    if (!body) return;
    const headings = body.querySelectorAll('h1, h2, h3');
    const list = document.getElementById('toc-list')!;
    const sidebar = document.getElementById('toc-sidebar')!;
    list.innerHTML = '';
    if (headings.length < 2) {
      sidebar.classList.remove('has-items');
      return;
    }
    sidebar.classList.add('has-items');
    headings.forEach((h, idx) => {
      if (!h.id) h.id = 'toc-heading-' + idx;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'toc-link toc-' + h.tagName.toLowerCase();
      a.textContent = h.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + h.id);
      });
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function updateTocActive() {
    const links = document.querySelectorAll('#toc-list .toc-link');
    if (!links.length) return;
    const body = document.getElementById('lesson-body');
    if (!body) return;
    const headings = body.querySelectorAll('h1, h2, h3');
    let activeIdx = headings.length - 1;
    const scrollTop = window.scrollY + 120;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top + window.scrollY > scrollTop) {
        activeIdx = i - 1;
        break;
      }
    }
    links.forEach((link, i) => link.classList.toggle('is-active', i === activeIdx));
  }

  renderToc();
  window.addEventListener('scroll', updateTocActive);
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageToc.astro
git commit -m "feat: add PageToc client island with scroll-spy"
```

---

### Task 13: Build QuizChoice client island

**Files:**
- Create: `src/components/QuizChoice.astro`

**Interfaces:**
- Produces: Interactive quiz component — hydrates `.quiz-choice[data-payload]` elements in the DOM

- [ ] **Step 1: Create QuizChoice.astro**

```astro
<script>
  function enhanceQuizzes() {
    document.querySelectorAll('.quiz-choice[data-payload]').forEach((quiz: Element) => {
      const raw = quiz.getAttribute('data-payload');
      if (!raw) return;
      let data: any;
      try { data = JSON.parse(decodeURIComponent(raw)); } catch { return; }
      quiz.removeAttribute('data-payload');

      const isMulti = data.kind === 'multi' || (data.correct && data.correct.length > 1);
      const badge = document.createElement('span');
      badge.className = 'quiz-badge';
      badge.textContent = isMulti ? '多选题' : '单选题';
      badge.style.cssText = 'font-size:0.7rem;color:var(--color-text-muted);display:block;margin-bottom:0.375rem;';
      quiz.insertBefore(badge, quiz.firstChild);

      let html = '<div class="quiz-question">' + data.question + '</div>';
      html += '<div class="quiz-options">';
      data.options.forEach((opt: string, oi: number) => {
        const isCorrect = data.correct && data.correct.indexOf(oi) >= 0;
        html += '<div class="quiz-option"' + (isCorrect ? ' data-correct' : '') + '>' +
          '<span class="quiz-opt-label">' + opt + '</span></div>';
      });
      html += '</div>';
      html += '<button type="button" class="quiz-submit">提交</button>';
      html += '<div class="quiz-feedback" style="display:none"></div>';
      html += '<div class="quiz-explanation" style="display:none">' + (data.explanation || '') + '</div>';
      quiz.innerHTML = html;

      const inputType = isMulti ? 'checkbox' : 'radio';
      const name = 'quiz-' + Math.random().toString(36).slice(2);
      const options = quiz.querySelectorAll('.quiz-option');

      function updateVisual() {
        options.forEach(o => {
          const inp = o.querySelector('input');
          if (inp && (inp as HTMLInputElement).checked) o.classList.add('selected');
          else o.classList.remove('selected');
        });
      }

      options.forEach((opt, oi) => {
        const input = document.createElement('input');
        input.type = inputType;
        input.name = name;
        input.value = String(oi);
        input.id = name + '-' + oi;
        input.style.marginRight = '0.375rem';
        opt.insertBefore(input, opt.firstChild);
        opt.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).tagName === 'INPUT') return;
          const inp = opt.querySelector('input') as HTMLInputElement;
          if (!inp) return;
          if (inputType === 'checkbox') inp.checked = !inp.checked;
          else {
            options.forEach(o => { const i = o.querySelector('input') as HTMLInputElement; if (i) i.checked = false; });
            inp.checked = true;
          }
          updateVisual();
        });
      });
      updateVisual();

      const submitBtn = quiz.querySelector('.quiz-submit') as HTMLButtonElement;
      if (!submitBtn) return;
      submitBtn.addEventListener('click', () => {
        const checked = quiz.querySelectorAll('.quiz-option input:checked');
        if (checked.length === 0) return;
        let allCorrect = true;
        quiz.querySelectorAll('.quiz-option').forEach(opt => {
          const inp = opt.querySelector('input') as HTMLInputElement;
          const isCorrect = opt.hasAttribute('data-correct');
          const isChecked = inp && inp.checked;
          if (isCorrect !== isChecked) allCorrect = false;
        });

        const existing = quiz.querySelector('.quiz-feedback');
        if (existing) existing.remove();
        const fb = document.createElement('div');
        fb.className = 'quiz-feedback';
        if (allCorrect) {
          fb.classList.add('quiz-feedback-ok');
          fb.textContent = isMulti ? '✅ 全部答对！' : '✅ 回答正确！';
          const expl = quiz.querySelector('.quiz-explanation') as HTMLElement;
          if (expl) { expl.style.display = 'block'; expl.style.cssText = 'margin-top:0.5rem;padding:0.625rem 0.75rem;border:1px solid var(--color-border);border-radius:6px;background:var(--color-surface);font-size:0.8125rem;color:var(--color-text-muted);line-height:1.6;'; }
          // Check if all quizzes complete
          checkAllDone();
        } else {
          fb.classList.add('quiz-feedback-err');
          fb.textContent = '❌ 回答错误，再想想看！';
        }
        quiz.appendChild(fb);
        submitBtn.disabled = true;
        submitBtn.textContent = '已作答';
      });
    });
  }

  function checkAllDone() {
    const quizzes = document.querySelectorAll('.quiz-choice');
    let allDone = true;
    quizzes.forEach(q => {
      const btn = q.querySelector('.quiz-submit');
      if (btn && !(btn as HTMLButtonElement).disabled) allDone = false;
    });
    if (allDone && quizzes.length > 0) {
      const meta = document.querySelector('meta[name="lesson-key"]');
      if (meta) {
        const key = meta.getAttribute('content');
        if (key && localStorage.getItem(key) !== 'true') {
          localStorage.setItem(key, 'true');
          window.dispatchEvent(new CustomEvent('progress-updated'));
        }
      }
    }
  }

  enhanceQuizzes();
</script>
```

- [ ] **Step 2: Update [lessonId].astro to include quiz meta and QuizChoice component**

In `src/pages/chapters/[chapterId]/[lessonId].astro`, add inside `<head>` or at the end after content:

```astro
<meta name="lesson-key" content={`rust-tutorial-completed-${chapterId}-${lessonId}`} />
<QuizChoice />
<CodeRunner />
```

Wait — QuizChoice is a script-only component (no HTML output). In Astro, we can put it as a `<script>` block, not as a component with markup. Let me reconsider.

Actually, the best approach for QuizChoice and CodeRunner is to just put their `<script>` tags inline in the lesson page, or use a zero-markup component. Let me use a simpler approach: put the script directly in the lesson page.

Actually, let me make QuizChoice a component that outputs only a `<script>` tag:

- [ ] **Step 3: Update [lessonId].astro to import QuizChoice and CodeRunner**

The QuizChoice component just needs its `<script>` block executed. Add it at the bottom of `[lessonId].astro`:

```astro
<QuizChoice />
<CodeRunner />
```

Where QuizChoice is a component with only client-side script (no markup):

```astro
<!-- src/components/QuizChoice.astro -->
<script>
  // All the quiz enhancement logic from above
  ...
</script>
```

This works — Astro will include the script with `client:load` when the component is used.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizChoice.astro src/pages/chapters/[chapterId]/[lessonId].astro
git commit -m "feat: add QuizChoice interactive component"
```

---

### Task 14: Build CodeRunner client island

**Files:**
- Create: `src/components/CodeRunner.astro`

- [ ] **Step 1: Create CodeRunner.astro**

```astro
<script>
  function enhanceCodeRunners() {
    document.querySelectorAll('#lesson-body .code-runner').forEach((runner) => {
      if (runner.querySelector('.code-runner-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'code-runner-bar';
      bar.style.cssText = 'display:flex;gap:0.5rem;align-items:center;padding:0.375rem 0.75rem;background:var(--color-surface);border:1px solid var(--color-border);border-bottom:none;border-radius:6px 6px 0 0;';

      const label = document.createElement('span');
      label.textContent = 'Rust';
      label.style.cssText = 'font-size:0.75rem;color:var(--color-text-muted);font-family:var(--font-mono);';
      bar.appendChild(label);

      const runBtn = document.createElement('button');
      runBtn.type = 'button';
      runBtn.textContent = '▶ 运行';
      runBtn.style.cssText = 'margin-left:auto;padding:0.15rem 0.6rem;font-size:0.75rem;border-radius:4px;border:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);cursor:pointer;';
      runBtn.addEventListener('mouseenter', () => { runBtn.style.color = 'var(--color-accent)'; runBtn.style.borderColor = 'var(--color-accent)'; });
      runBtn.addEventListener('mouseleave', () => { runBtn.style.color = 'var(--color-text-muted)'; runBtn.style.borderColor = 'var(--color-border)'; });
      runBtn.addEventListener('click', () => {
        runBtn.textContent = '⏳ 编译中...';
        runBtn.disabled = true;
        setTimeout(() => {
          const pre = runner.querySelector('pre');
          const code = pre?.textContent?.trim() || '';
          const outDiv = runner.nextElementSibling as HTMLElement;
          if (outDiv && outDiv.classList.contains('code-runner-output')) {
            outDiv.textContent = '✓ 编译成功，输出如下：\n' + code.split('\n').map((l: string) => '  ' + l).join('\n');
            outDiv.style.display = 'block';
          }
          runBtn.textContent = '✓ 已运行';
          runBtn.style.borderColor = 'var(--color-success)';
          runBtn.style.color = 'var(--color-success)';
        }, 800);
      });
      bar.appendChild(runBtn);
      runner.insertBefore(bar, runner.firstChild);

      const pre = runner.querySelector('pre') as HTMLElement;
      if (pre) {
        pre.style.cssText = (pre.getAttribute('style') || '') + ';border-radius:0 0 6px 6px;margin-top:0;';
      }

      const outDiv = document.createElement('div');
      outDiv.className = 'code-runner-output';
      outDiv.style.cssText = 'display:none;padding:0.75rem;border:1px solid var(--color-border);border-top:none;border-radius:0 0 6px 6px;background:var(--color-code-bg);font-family:var(--font-mono);font-size:0.8125rem;color:var(--color-code-text);white-space:pre-wrap;';
      outDiv.textContent = '输出已显示在上方，请参考教程中的说明。';
      runner.parentNode!.insertBefore(outDiv, runner.nextSibling);
    });
  }

  enhanceCodeRunners();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CodeRunner.astro
git commit -m "feat: add CodeRunner interactive component"
```

---

### Task 15: Build SectionProgress client island

**Files:**
- Create: `src/components/SectionProgress.astro`

- [ ] **Step 1: Create SectionProgress.astro**

```astro
---
interface Props {
  chapterId: string;
  lessonId: string;
}

const { chapterId, lessonId } = Astro.props;
---

<div class="section-progress" id="section-progress">
  <div class="sp-bar">
    <button class="sp-arrow sp-arrow-left" aria-label="向左滚动" hidden>‹</button>
    <div class="sp-scroll">
      <div class="sp-tabs" role="tablist" aria-label="文章章节" id="sp-tabs"></div>
    </div>
    <button class="sp-arrow sp-arrow-right" aria-label="向右滚动" hidden>›</button>
  </div>
</div>

<script>
  const sp = document.getElementById('section-progress')!;
  const tabsContainer = document.getElementById('sp-tabs')!;
  const body = document.getElementById('lesson-body');
  if (!body) return;

  const sections = body.querySelectorAll('h1, h2');
  if (sections.length <= 1) {
    sp.style.display = 'none';
    return;
  }

  sp.style.display = 'block';
  sections.forEach((h, idx) => {
    const tab = document.createElement('button');
    tab.className = 'sp-tab' + (idx === 0 ? ' active' : '');
    tab.setAttribute('data-tab-idx', String(idx));
    tab.setAttribute('data-section-title', h.textContent || '');
    tab.type = 'button';
    tab.innerHTML = '<span class="sp-dot"></span><span class="sp-label">' + h.textContent + '</span>';
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tabsContainer.appendChild(tab);
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionProgress.astro
git commit -m "feat: add SectionProgress sticky tab bar component"
```

---

### Task 16: Build ConfirmDialog client island

**Files:**
- Create: `src/components/ConfirmDialog.astro`

- [ ] **Step 1: Create ConfirmDialog.astro**

```astro
<div id="confirm-dialog-overlay" class="cd-overlay" hidden aria-hidden="true">
  <div class="cd-box" role="alertdialog" aria-modal="true" aria-labelledby="cd-message">
    <p id="cd-message" class="cd-message"></p>
    <p id="cd-hint" class="cd-hint">请输入 "<strong class="cd-required"></strong>" 来确认：</p>
    <input type="text" class="cd-input" autocomplete="off" spellcheck="false">
    <div class="cd-actions">
      <button type="button" class="btn-secondary cd-cancel">取消</button>
      <button type="button" class="btn-primary cd-ok" disabled>确认</button>
    </div>
  </div>
</div>

<script>
  function cleanup() {
    const overlay = document.getElementById('confirm-dialog-overlay')!;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
  }

  (window as any).__showConfirm = function(msg: string, confirmText: string, onConfirm: () => void) {
    const overlay = document.getElementById('confirm-dialog-overlay')!;
    const msgEl = document.getElementById('cd-message')!;
    const hint = document.getElementById('cd-hint')!;
    const input = overlay.querySelector('.cd-input') as HTMLInputElement;
    const okBtn = overlay.querySelector('.cd-ok') as HTMLButtonElement;
    const cancelBtn = overlay.querySelector('.cd-cancel') as HTMLButtonElement;

    msgEl.textContent = msg;
    hint.style.display = 'none';
    input.style.display = 'none';
    okBtn.disabled = false;
    okBtn.textContent = confirmText || '确认';

    overlay.hidden = false;
    overlay.removeAttribute('aria-hidden');

    okBtn.onclick = () => { cleanup(); onConfirm(); };
    cancelBtn.onclick = cleanup;
  };
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConfirmDialog.astro
git commit -m "feat: add ConfirmDialog reusable modal component"
```

---

### Task 17: Final verification and cleanup

**Files:**
- No new files; verify existing build

- [ ] **Step 1: Run full build**

```bash
npx astro build
```
Expected: builds all 135 pages (index + 133 lessons + certificate) without errors.

- [ ] **Step 2: Spot check generated HTML**

```bash
# Check homepage
Test-Path dist/RustCourse/index.html

# Check a lesson page
Test-Path dist/RustCourse/chapters/01-rust-basics/01-installation/index.html

# Check content is present
Select-String -Path dist/RustCourse/chapters/01-rust-basics/01-installation/index.html -Pattern "rustup" | Select-Object -First 1

# Check all 133 lesson pages exist
(Get-ChildItem dist/RustCourse/chapters -Recurse -Filter index.html).Count
```
Expected: "True", "True", match found, 133

- [ ] **Step 3: Verify dev server**

```bash
npx astro dev
```
Visit `http://localhost:4321/RustCourse/` — expected: homepage renders with hero, course outline, navbar, footer.
Visit `http://localhost:4321/RustCourse/chapters/01-rust-basics/01-installation` — expected: lesson page with sidebar, breadcrumb, content, TOC, prev/next nav.

- [ ] **Step 4: Test quizzes**

On a lesson page with quizzes (e.g., `02-basic-syntax/09-practice`), verify:
- Quiz options show as interactive radio/checkbox
- Selecting an option and clicking "提交" shows feedback
- Correct answer shows green, wrong shows red
- All correct auto-marks lesson complete

- [ ] **Step 5: Test code runner**

On a lesson page with `.code-runner`, verify "▶ 运行" button shows the toolbar, clicking it simulates compilation.

- [ ] **Step 6: Test progress**

- Visit a lesson, scroll to bottom → lesson marked complete ✓
- Navigate to another lesson → sidebar shows completion dot
- Return to homepage → progress bar updates
- Manual toggle via "标记为已完成" button
- Reset all progress → progress returns to 0%

- [ ] **Step 7: Test navigation**

- Sidebar expand/collapse works
- Breadcrumb links navigate correctly
- Prev/Next article nav works
- TOC scroll-spy highlights active section
- Mobile responsive: hide sidebar at 768px, hide TOC at 1200px

- [ ] **Step 8: Commit final fixes**

```bash
git add -A
git commit -m "feat: complete Astro SSG conversion with all interactive features"
```

---

## Post-Conversion Notes

- Original `index.html`, `js/`, `css/`, `content/` are kept for reference but no longer used at runtime
- The `scripts/` directory is preserved unchanged
- To deploy to GitHub Pages: configure base to `/RustCourse` (already set in astro.config.mjs), use `npx astro build`, deploy `dist/` folder
