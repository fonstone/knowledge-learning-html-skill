当代码量增长，你需要一套机制来组织它——把相关的函数、类型和常量分组，控制哪些内容对外可见，避免命名冲突。这就是 Rust 的模块系统。

理解模块系统，关键是搞清楚三个层级的关系：**Package**（一次 `cargo new`）、**Crate**（编译单元）和**模块**（代码组织单元），以及如何在它们之间导航和控制访问权限。

## 本章目录

| 文章 | 主要内容 |
| --- | --- |
| [Package 与 Crate](#/chapters/01-packages-crates) | 编译单元的基本概念，binary crate 与 library crate 的区别 |
| [模块与可见性](#/chapters/02-modules) | 用 `mod` 组织代码，用 `pub` 控制对外可见性 |
| [路径与 use](#/chapters/03-paths-use) | 在模块树中用路径引用项，`use` 关键字简化写法 |