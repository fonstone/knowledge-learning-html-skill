# Knowledge Learning · HTML Skill

一个基于纯 HTML/CSS/JavaScript 构建的**知识学习 SPA**，展示前端工程化与交互设计能力。

内容层承载 Rust 编程语言全栈教程（24 章 132 课），但架构本身是通用的——任意 Markdown 知识库换入即可使用。

## 核心技能亮点

| 技能点 | 实现方式 |
|--------|----------|
| **Hash 路由 SPA** | `hashchange` 事件驱动，无刷新导航 |
| **Markdown 运行时渲染** | 自定义 `mdParse()` 解析器，支持代码块/表格/行内样式 |
| **HTML 透传** | 内容块的 `<div>` 原始 HTML 不经解析直接插入 |
| **进度持久化** | `localStorage`，key 格式 `rust-tutorial-completed-{ch}-{lesson}` |
| **交互式测验** | `<quiz-choice>` 自定义元素 + `enhanceQuizzes()`，支持单选/多选 |
| **折叠导航 + 进度条** | `expandedChapters` Set，逐章百分比进度 |
| **暗色主题** | `#0D0D0F` 背景 + `#CE412B` 强调色，全站统一变量 |
| **零依赖** | 无框架/无构建工具，纯原生三件套 |

## 快速启动

```bash
# 方式一：Python
python -m http.server 8000

# 方式二：npm script
npm run dev

# 方式三：http-server
npx http-server -p 8000
```

打开 `http://localhost:8000` 即可。

> `fetch()` 加载 `.md` 文件，必须通过 HTTP 服务运行。

## 项目结构

```
├── index.html         # SPA 入口（导航栏、侧边栏、内容区、页脚）
├── package.json
├── css/
│   └── style.css      # 暗色主题样式
├── js/
│   ├── data.js        # 课程元数据（courseData 数组）
│   ├── main.js        # SPA 核心逻辑
│   └── md-parser.js   # Markdown → HTML 转换器
└── content/           # 132 个 .md 课程文件（/ 章节 / 课程）
```

## 内容架构

```
.md 文件 → fetch() → mdParse() → innerHTML → #article-content
```

- 路由格式：`#chapter/{id}`（章首页） / `#chapters/{ch}/{lesson}`（课程）
- 两种内容格式：纯 Markdown（ch01-08, ch17-23）+ HTML 透传块（ch09-16）
- 测验通过后自动标记本节课完成

## 参考站

原始内容源：https://xyfx-fhw.github.io/RustCourse/

## License

MIT
