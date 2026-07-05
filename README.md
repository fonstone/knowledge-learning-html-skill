# RUST 互动教程

基于 Astro 5 构建的 Rust 语言系统学习教程网站，完整复刻 https://xyfx-fhw.github.io/RustCourse/。

## 技术栈

- **Astro 5** — 静态站点生成（SSG）
- **TypeScript** — 类型安全
- **CSS** — 暗色主题设计系统（#0D0D0F / #CE412B）

## 项目结构

```
├── astro.config.mjs          # Astro 配置（base: /RustCourse）
├── public/                   # 静态资源（favicon, images, diagrams）
├── src/
│   ├── content/lessons/      # 133 个课程 .md 文件（content collection）
│   ├── pages/                # 页面路由
│   │   ├── index.astro       # 首页（hero + 课程大纲 + 进度）
│   │   ├── certificate.astro # 证书页（100% 进度解锁）
│   │   └── chapters/[chapterId]/[lessonId].astro  # 课程详情页
│   ├── layouts/
│   │   └── BaseLayout.astro  # 全局布局（navbar, sidebar, TOC, footer）
│   ├── components/           # UI 组件
│   │   ├── Navbar.astro       # 顶部导航栏 + 进度条
│   │   ├── Sidebar.astro     # 左侧章节目录（展开/折叠）
│   │   ├── PageToc.astro     # 右侧页面目录（scroll-spy）
│   │   ├── Breadcrumb.astro  # 面包屑导航
│   │   ├── ArticleNav.astro  # 上一篇/下一篇
│   │   ├── SectionProgress.astro  # 页面章节进度标签
│   │   ├── HeroSection.astro # 首页 hero 区域
│   │   ├── ChapterBlock.astro # 首页章节卡片
│   │   ├── ConfirmDialog.astro   # 通用确认弹窗
│   │   └── Footer.astro      # 页脚
│   ├── lib/
│   │   ├── courseData.ts     # 课程元数据（24 章 133 课）
│   │   └── progress.ts       # localStorage 进度工具
│   └── styles/
│       └── global.css        # 全局样式
└── scripts/                  # 开发工具脚本
```

## 启动

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321/RustCourse/
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 功能

- **133 节课程** — 24 章，完整 Rust 知识体系
- **章节侧边栏** — 展开/折叠，自动高亮当前位置
- **页面目录** — 自动生成 H1-H3 的 TOC，scroll-spy 激活
- **进度追踪** — localStorage 持久化，首页进度条 + 绿色完成标记
- **证书页面** — 100% 完成后解锁
- **互动测验** — 单选/多选题，提交反馈，全部答对自动标记完成
- **代码运行器** — 模拟编译输出
- **暗色主题** — 纯 CSS 暗色设计，背景动画光晕

## 部署 GitHub Pages

```bash
npm run build
# 将 dist/ 目录部署到 GitHub Pages
# base 已配置为 /RustCourse
```

## 作者

雪云飞星（付皓文）· AI 协作 · © 2026
