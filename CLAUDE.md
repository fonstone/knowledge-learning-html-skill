# RUST 互动教程 — AI 开发手册

## 启动

```bash
python -m http.server 8000
# 必须用 HTTP（fetch() 不支持 file:// 协议）
```

## 项目结构

- `index.html` — SPA 入口（导航栏、侧边栏、内容区、页脚）
- `css/style.css` — 暗色主题（背景 #0D0D0F，强调色 #CE412B）
- `js/data.js` — `courseData` 数组，记录每课的元数据（chapterId, lessonId, title, path）
- `js/main.js` — SPA 核心：hash 路由、内容加载、侧边栏渲染、测验交互、进度追踪（每课完成状态、每章百分比、重置功能）
- `js/md-parser.js` — 轻量 Markdown→HTML 转换器
- `content/{chapterId}/{lessonId}.md` — 132 个课程文件（清理后：无 Astro HTML 包裹、无 `[code]` 标签、无 `‹`/`›` 导航残留。ch09-16 含纯 HTML 透传块，其余为纯 Markdown）

## 内容架构

```
.content 中的 .md 文件 → fetch() 加载 → mdParse() 转换 HTML → 插入 #article-content
```

- 路由 hash 格式：`#chapter/{id}`（章首页）或 `#chapters/{chapterId}/{lessonId}`（具体课）
- 内容中的相对链接（如 `./02-hello-world`）由 `renderChapterPage` 解析为 hash 链接
- `md-parser.js` 按空行分割成 block，HTML 块（首字符 `<`）原样透传
- 两种内容格式共存：ch01-08 和 ch17-23 为纯 Markdown，ch09-16 为 HTML（Astro 源码的 `<div id="article-content">` 内内容，保留原始 HTML 标签和样式）

## 约定

- 内容文件命名：`{lessonId}.md`，与 `courseData` 中 path 匹配
- 测验题格式：`<quiz-choice>` 元素，正确选项加 `data-correct` 属性；`enhanceQuizzes()` 自动添加 radio/checkbox 和 submit 逻辑
- 侧边栏：每次导航清除 `expandedChapters`，只展开当前章节（`Set` 仅含当前 `chapterId`）
- 面包屑：`renderChapterPage` 中用 `onclick`（非 `addEventListener`）避免事件监听泄漏
- 章节编号：侧边栏和首页大纲统一用 `第X章` 格式
- 代码块用 fenced code (```rust)
- 进度追踪 localStorage key 格式：`rust-tutorial-completed-{chapterId}-{lessonId}`
- 测验全对后自动调用 `checkAllQuizzesComplete()` 标记本节课完成
- 确认对话框复用 HTML `<dialog>` 元素，通过 `showConfirmDialog(message, confirmText, onConfirm)` 调用

## 参考站

原始 Astro 站点：https://xyfx-fhw.github.io/RustCourse/
内容通过 webfetch format=markdown 提取后存入 content/。

## 脚本

`scripts/` 目录中的 fetch\_tutorial*.py/.ps1 是开发初期抓取内容的工具，不影响 SPA 运行。
`fix1-nav.ps1` / `fix2-astro-wrapper.ps1` / `fix3-code-fences.ps1` / `fix4-h1-headings.ps1` 是内容清理脚本，已执行完毕（删除 `‹`/`›` 导航、剥离 Astro 包裹、转换 `[code]` 标签、补 H1 标题）。
