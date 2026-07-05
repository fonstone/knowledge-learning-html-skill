# Astro SSG Conversion Design

**Date**: 2026-07-05
**Status**: Approved

## Goal

Convert the existing client-side SPA (pure HTML/CSS/JS with hash routing) into an Astro SSG site that fully replicates https://xyfx-fhw.github.io/RustCourse/.

## Architecture

**Astro SSG with content collections** — each of the 133 lessons is a statically-generated HTML page at `/chapters/{chapterId}/{lessonId}`. Interactive features (quizzes, code runners, progress tracking) are Astro client islands.

No SPA routing. Navigation is standard `<a href>` links. State (progress, last-visited) persists in `localStorage` across page loads.

## Project Structure

```
rust-learning/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   └── logo.svg
│   └── diagrams/              # 20 SVG diagrams
├── src/
│   ├── content/
│   │   ├── config.ts           # Content collection schema
│   │   └── lessons/            # 133 .md files + frontmatter
│   │       ├── 00-preface/00-index.md
│   │       ├── 01-rust-basics/{00-index,...,04-first-taste}.md
│   │       ├── ...
│   │       └── 23-projects/{00-index,...,08-documentation}.md
│   ├── pages/
│   │   ├── index.astro         # Homepage: hero + course outline
│   │   ├── chapters/
│   │   │   └── [chapterId]/
│   │   │       └── [lessonId].astro  # Dynamic lesson page
│   │   └── certificate.astro   # Unlocked at 100% progress
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shell: navbar, sidebar, TOC, footer
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Sidebar.astro       # client island
│   │   ├── PageToc.astro       # client island
│   │   ├── Footer.astro
│   │   ├── Breadcrumb.astro
│   │   ├── ChapterBlock.astro
│   │   ├── ArticleNav.astro
│   │   ├── ProgressBar.astro   # client island
│   │   ├── QuizChoice.astro    # client island
│   │   ├── CodeRunner.astro    # client island
│   │   ├── CodeEditor.astro    # client island
│   │   ├── SectionProgress.astro  # client island
│   │   ├── ConfirmDialog.astro    # client island
│   │   └── HeroSection.astro
│   ├── lib/
│   │   ├── courseData.ts       # Chapter/lesson metadata
│   │   ├── progress.ts         # localStorage helpers (shared)
│   │   └── utils.ts
│   └── styles/
│       └── global.css          # Full design system
```

## Content handling

Each `.md` file gets YAML frontmatter added without changing the body:

```yaml
---
chapterId: "01-rust-basics"
lessonId: "01-installation"
title: "安装 Rust"
level: "入门"
duration: "10 分钟"
tags: ["rustup", "安装", "工具链"]
number: "1.1"
chapterTitle: "Rust 基础"
chapterNumber: "01"
---
```

Both content formats are preserved:
- **ch01-08, ch17-23** (Markdown): rendered by Astro's built-in markdown processor
- **ch09-16** (HTML blocks): passed through in rendered output

Content collection schema validates all frontmatter fields via Zod.

## Routing

File-based routing via `[chapterId]/[lessonId].astro`:
- `getStaticPaths()` iterates `courseData` to generate all 133 pages
- URL format: `/chapters/{chapterId}/{lessonId}`
- Homepage: `/`
- Certificate: `/certificate`

## Component Architecture

```
BaseLayout.astro (server shell)
├── Navbar.astro (server)
│   └── ProgressBar (client:load) — reads localStorage
├── Sidebar (client:load) — expand/collapse, active highlight
├── Breadcrumb.astro (server)
├── PageToc (client:load) — auto-generate from H1-H3, scroll-spy
├── SectionProgress (client:load) — sticky tab bar
├── Article content (server-rendered MD)
│   ├── QuizChoice (client:load) — single/multi, submit/feedback
│   ├── CodeRunner (client:load) — run button, mock compile
│   └── CodeEditor (client:load) — resizable, verdict
├── ArticleNav.astro (server) — prev/next links
├── Footer.astro (server)
└── ConfirmDialog (client:load) — shared modal
```

Client islands use `client:load` strategy (interactive immediately on page load).

## Data Flow

**Progress**: localStorage keys `rust-tutorial-completed-{chapterId}-{lessonId}`.
- `ProgressBar` reads to compute total %
- `Sidebar` reads to show completion dots
- `SectionProgress` reads to highlight completed sections
- `QuizChoice` writes on all-correct; scroll-to-bottom also writes
- At 100%, certificate link unlocks

**Last visited**: localStorage key `rust-tutorial-last-visited` — used by navbar "教程" link.

## Styling

Port `css/style.css` → `src/styles/global.css`:
- Same CSS custom properties (dark theme: `#0D0D0F` bg, `#CE412B` accent)
- Same fonts: Noto Sans SC, Inter, JetBrains Mono (Google Fonts)
- Same layout: three-column content page (sidebar 240px / body flex:1 / TOC 200px)
- Same responsive breakpoints: 1200px (hide TOC), 768px (hide sidebar)
- Same component styles: quizzes, code blocks, progress bars, etc.
- Background orb animations preserved

## Assets

- `favicon.svg` → `public/favicon.svg`
- `images/logo.svg` → `public/images/logo.svg`
- `diagrams/*.svg` → `public/diagrams/*.svg`

## Dependencies

```json
{
  "dependencies": {
    "astro": "^5.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9"
  }
}
```

## Steps

1. Initialize Astro project in current directory
2. Create content collection config and move `.md` files to `src/content/lessons/`
3. Add frontmatter to all 133 `.md` files (scripted)
4. Port `css/style.css` → `src/styles/global.css`
5. Port `js/data.js` → `src/lib/courseData.ts`
6. Build layouts: `BaseLayout.astro`
7. Build page components: `index.astro`, `[lessonId].astro`, `certificate.astro`
8. Build UI components: Navbar, Sidebar, PageToc, Footer, Breadcrumb, ArticleNav, HeroSection, ChapterBlock, ProgressBar
9. Build interactive islands: QuizChoice, CodeRunner, CodeEditor, SectionProgress, ConfirmDialog
10. Port progress utilities to `src/lib/progress.ts`
11. Verify all 133 pages build, test quizzes, progress, navigation
