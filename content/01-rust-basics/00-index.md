# Rust 基础

入门 ⏱ 15 分钟 Rust简介内存安全零开销抽象系统编程并发

## Rust 是什么

你可能听说过 Rust 很难学，也可能听说过它是"程序员最爱的语言"，甚至两者都听说过。这两件事并不矛盾——Rust 确实有一定的学习曲线，但它试图解决的问题是真实存在且困扰编程世界数十年的老难题。

学习 Rust 之前，先搞清楚它**为什么存在**，能帮你在遇到困难时不至于放弃。

### 一个长达几十年的矛盾

在编程语言的世界里，有一对长期对立的需求：

**高性能、底层控制** vs **安全、高效的开发体验**

![安全与速度的矛盾](/RustCourse/diagrams/safety_vs_speed.svg)

-   C 和 C++ 给你完全的底层控制，可以精确管理内存，运行极快。代价是：一不小心就会有内存泄漏、空指针崩溃、数据竞争等 bug，找起来极其痛苦。
-   Python、Java、Go 等语言有垃圾回收器（GC）帮你管内存，开发体验好，但运行时有额外开销，无法用于对延迟和资源极敏感的场景（比如嵌入式系统、操作系统内核）。

这就是那个矛盾：**要么安全，要么快，二选一。**

Rust 的答案是：**不，两者可以兼得。**

> Rust 不靠运行时 GC 来保证内存安全，而是通过编译期的所有权系统，在代码运行之前就把不安全的写法拒之门外。

### Rust 的核心思路：让编译器当守门员

![编译器守门员](/RustCourse/diagrams/compiler_goalkeeper.svg)

传统语言里，内存 bug 通常在**运行时**才暴露——程序崩了、客户投诉、深夜排查。

Rust 的做法完全不同：它在**编译期**就检查内存安全。如果你写了一段可能出问题的代码，Rust 编译器会直接拒绝编译，并给出详细的错误信息告诉你哪里出了问题。

这一套机制的核心叫做**所有权系统**（ownership），我们后续会详细学习。现在只需要记住一件事：

**在 Rust 中，以往那些只能靠测试和代码评审才能发现的 bug，编译器会在你运行之前就帮你找出来。**

这对团队协作意义重大——你不再需要依赖每个人都"足够小心"，编译器本身就是那道安全网。

### Rust 没有运行时开销

Rust 实现内存安全的方式是**编译期分析**，不是运行时的垃圾回收器。这意味着：

-   没有 GC 的暂停（GC pause）
-   没有运行时的额外内存占用
-   可以精确控制内存布局
-   可以用于嵌入式、内核、实时系统等对资源极其敏感的场景

Rust 追求的是**零开销抽象**（zero-cost abstractions）：你写的高层代码，编译后和手写的底层代码一样快。如果用不到某个特性，就不付出该特性的开销。

### 一句话总结

**Rust 是一门让你同时拥有 C 的性能和 Python 的安全感的系统编程语言——它用编译期的所有权检查，在不引入运行时开销的前提下，彻底消灭内存 bug。**

## Rust的适用范围

### 谁适合学 Rust

| 人群 | 为什么适合 |
|------|-----------|
| **系统/嵌入式开发者** | 保持 C/C++ 同等性能的同时摆脱内存 bug；汽车电子、工业控制、物联网已有大量实践 |
| **后端/基础设施开发者** | 适合构建高性能 Web 服务、CLI 工具、数据库引擎；并发模型让编译器在编译期阻止竞争条件 |
| **学生和技术爱好者** | 真正理解内存、生命周期、栈与堆——这些在其他语言里被抽象掉的基础概念 |
| **任何想写更可靠软件的人** | 学 Rust 会改变你思考程序正确性的方式，受益于所有语言 |

### Rust 现在用在哪里

-   **浏览器引擎**：Firefox CSS 引擎 [Stylo](https://github.com/servo/servo)、独立浏览器引擎 [Servo](https://github.com/servo/servo)
-   **操作系统**：Linux 内核已接受 Rust 代码；[Redox OS](https://github.com/redox-os/redox) 是完全用 Rust 编写的操作系统
-   **嵌入式**：[Embassy](https://github.com/embassy-rs/embassy) 是专为微控制器设计的 Rust 异步框架，越来越多的汽车电子项目也在引入 Rust
-   **Web 框架**：[Actix Web](https://github.com/actix/actix-web) 和 [Axum](https://github.com/tokio-rs/axum) 是最流行的 Rust Web 框架
-   **异步运行时**：[Tokio](https://github.com/tokio-rs/tokio) 是 Rust 生态中最广泛使用的异步运行时
-   **桌面应用**：[Tauri](https://github.com/tauri-apps/tauri) 用 Rust 替代 Electron，打包体积从几百 MB 降到几 MB
-   **终端工具**：[Alacritty](https://github.com/alacritty/alacritty)（终端模拟器）、[ripgrep](https://github.com/BurntSushi/ripgrep)（极速文本搜索）、[fd](https://github.com/sharkdp/fd)（find 替代品）、[bat](https://github.com/sharkdp/bat)（带语法高亮的 cat）

Rust 不是一门试图替代所有语言的语言。它有明确的定位：**在需要高性能和底层控制的地方，提供内存安全保障**。

> Rust 连续多年被 Stack Overflow 开发者调查评为「最受喜爱的编程语言」第一名。

接下来，我们从安装环境开始，第一步一步把 Rust 跑起来。

## 练习题

### 关于 Rust 的定位

<div class="quiz-choice" data-payload="%7B%22question%22%3A%22Rust%20%E6%98%AF%E5%A6%82%E4%BD%95%E5%9C%A8%E4%B8%8D%E5%BC%95%E5%85%A5%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E5%99%A8%EF%BC%88GC%EF%BC%89%E7%9A%84%E5%89%8D%E6%8F%90%E4%B8%8B%E4%BF%9D%E8%AF%81%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E9%80%9A%E8%BF%87%E8%BF%90%E8%A1%8C%E6%97%B6%E6%A3%80%E6%B5%8B%E5%86%85%E5%AD%98%E8%B6%8A%E7%95%8C%E8%AE%BF%E9%97%AE%22%2C%22%E9%80%9A%E8%BF%87%E7%BC%96%E8%AF%91%E6%9C%9F%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E7%B3%BB%E7%BB%9F%EF%BC%8C%E5%9C%A8%E4%BB%A3%E7%A0%81%E8%BF%90%E8%A1%8C%E5%89%8D%E5%B0%B1%E6%8B%92%E7%BB%9D%E4%B8%8D%E5%AE%89%E5%85%A8%E7%9A%84%E5%86%99%E6%B3%95%22%2C%22%E4%BD%BF%E7%94%A8%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%EF%BC%88Reference%20Counting%EF%BC%89%E8%BF%BD%E8%B8%AA%E6%89%80%E6%9C%89%E5%AF%B9%E8%B1%A1%22%2C%22%E8%A6%81%E6%B1%82%E7%A8%8B%E5%BA%8F%E5%91%98%E6%89%8B%E5%8A%A8%E9%87%8A%E6%94%BE%E6%89%80%E6%9C%89%E5%86%85%E5%AD%98%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E6%A0%B8%E5%BF%83%E6%98%AF%E3%80%8C%E6%89%80%E6%9C%89%E6%9D%83%E7%B3%BB%E7%BB%9F%E3%80%8D%E2%80%94%E2%80%94%E8%BF%99%E6%98%AF%E4%B8%80%E5%A5%97%E7%BC%96%E8%AF%91%E6%9C%9F%E8%A7%84%E5%88%99%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E5%9C%A8%E4%BD%A0%E8%BF%90%E8%A1%8C%E7%A8%8B%E5%BA%8F%E4%B9%8B%E5%89%8D%E5%B0%B1%E6%A3%80%E6%9F%A5%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E6%80%A7%E3%80%82%E6%B2%A1%E6%9C%89%20GC%EF%BC%8C%E6%B2%A1%E6%9C%89%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%80%E9%94%80%EF%BC%8C%E5%AE%89%E5%85%A8%E6%80%A7%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E5%B7%B2%E7%BB%8F%E5%BE%97%E5%88%B0%E4%BF%9D%E8%AF%81%E3%80%82%22%7D">
  <div class="quiz-placeholder">加载题目中…</div>
</div>

### 零开销抽象

<div class="quiz-choice" data-payload="%7B%22question%22%3A%22%E3%80%8C%E9%9B%B6%E5%BC%80%E9%94%80%E6%8A%BD%E8%B1%A1%E3%80%8D%EF%BC%88zero-cost%20abstractions%EF%BC%89%E5%9C%A8%20Rust%20%E4%B8%AD%E6%84%8F%E5%91%B3%E7%9D%80%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22Rust%20%E7%BC%96%E8%AF%91%E9%80%9F%E5%BA%A6%E6%9E%81%E5%BF%AB%EF%BC%8C%E5%87%A0%E4%B9%8E%E6%B2%A1%E6%9C%89%E7%BC%96%E8%AF%91%E5%BC%80%E9%94%80%22%2C%22%E6%89%80%E6%9C%89%20Rust%20%E7%A8%8B%E5%BA%8F%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E9%83%BD%E4%B8%8D%E5%8D%A0%E7%94%A8%E5%86%85%E5%AD%98%22%2C%22Rust%20%E7%A8%8B%E5%BA%8F%E5%90%AF%E5%8A%A8%E6%97%B6%E9%97%B4%E4%B8%BA%E9%9B%B6%22%2C%22%E9%AB%98%E5%B1%82%E8%AF%AD%E8%A8%80%E7%89%B9%E6%80%A7%E5%9C%A8%E7%BC%96%E8%AF%91%E5%90%8E%E4%B8%8E%E6%89%8B%E5%86%99%E5%BA%95%E5%B1%82%E4%BB%A3%E7%A0%81%E6%80%A7%E8%83%BD%E7%9B%B8%E5%90%8C%EF%BC%8C%E7%94%A8%E4%B8%8D%E5%88%B0%E7%9A%84%E7%89%B9%E6%80%A7%E4%B8%8D%E4%BB%98%E5%87%BA%E4%BB%BB%E4%BD%95%E4%BB%A3%E4%BB%B7%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E9%9B%B6%E5%BC%80%E9%94%80%E6%8A%BD%E8%B1%A1%E7%9A%84%E5%90%AB%E4%B9%89%E6%98%AF%EF%BC%9A%E4%BD%A0%E5%8F%AF%E4%BB%A5%E7%94%A8%E9%AB%98%E5%B1%82%E6%8A%BD%E8%B1%A1%E5%86%99%E4%BB%A3%E7%A0%81%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E6%8A%8A%E5%AE%83%E4%BC%98%E5%8C%96%E6%88%90%E5%92%8C%E6%89%8B%E5%86%99%E5%BA%95%E5%B1%82%E4%BB%A3%E7%A0%81%E4%B8%80%E6%A0%B7%E9%AB%98%E6%95%88%E7%9A%84%E6%9C%BA%E5%99%A8%E7%A0%81%E3%80%82%E4%BD%A0%E6%B2%A1%E7%94%A8%E5%88%B0%E7%9A%84%E7%89%B9%E6%80%A7%EF%BC%8C%E5%B0%B1%E5%AE%8C%E5%85%A8%E4%B8%8D%E4%BA%A7%E7%94%9F%E4%BB%BB%E4%BD%95%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%80%E9%94%80%E3%80%82%22%7D">
  <div class="quiz-placeholder">加载题目中…</div>
</div>

### 与其他语言的对比

<div class="quiz-choice" data-payload="%7B%22question%22%3A%22%E4%B8%8E%20C%20%E8%AF%AD%E8%A8%80%E7%9B%B8%E6%AF%94%EF%BC%8C%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E6%8F%8F%E8%BF%B0%E4%BA%86%20Rust%20%E7%9A%84%E4%BC%98%E5%8A%BF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%B9%B6%E5%8F%91%20bug%EF%BC%88%E5%A6%82%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%EF%BC%89%E4%BC%9A%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E8%A2%AB%E6%A3%80%E6%B5%8B%E5%87%BA%E6%9D%A5%22%2C%22Rust%20%E7%9A%84%E7%BC%96%E5%86%99%E9%80%9F%E5%BA%A6%E6%AF%94%20C%20%E6%9B%B4%E5%BF%AB%22%2C%22%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E6%8B%92%E7%BB%9D%E5%AD%98%E5%9C%A8%E5%86%85%E5%AD%98%20bug%20%E7%9A%84%E4%BB%A3%E7%A0%81%22%2C%22Rust%20%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E9%80%9F%E5%BA%A6%E6%AF%94%20C%20%E6%9B%B4%E5%BF%AB%22%5D%2C%22correct%22%3A%5B0%2C2%5D%2C%22explanation%22%3A%22Rust%20%E5%92%8C%20C%20%E7%9A%84%E8%BF%90%E8%A1%8C%E6%80%A7%E8%83%BD%E7%9B%B8%E5%BD%93%EF%BC%88%E4%B8%8D%E6%98%AF%E6%9B%B4%E5%BF%AB%EF%BC%89%EF%BC%8C%E4%BD%86%20Rust%20%E5%9C%A8%E5%AE%89%E5%85%A8%E6%80%A7%E4%B8%8A%E6%9C%89%E6%98%BE%E8%91%97%E4%BC%98%E5%8A%BF%EF%BC%9A%E6%89%80%E6%9C%89%E6%9D%83%E7%B3%BB%E7%BB%9F%E9%98%BB%E6%AD%A2%E4%BA%86%E5%86%85%E5%AD%98%E9%94%99%E8%AF%AF%EF%BC%8C%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F%E9%98%B2%E6%AD%A2%E4%BA%86%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E3%80%82%22%7D">
  <div class="quiz-placeholder">加载题目中…</div>
</div>

### Rust 的适用场景

<div class="quiz-choice" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%B8%AA%E5%9C%BA%E6%99%AF%E6%9C%80%E4%B8%8D%E9%80%82%E5%90%88%E4%BD%BF%E7%94%A8%20Rust%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%BC%80%E5%8F%91%E5%AF%B9%E5%BB%B6%E8%BF%9F%E6%95%8F%E6%84%9F%E7%9A%84%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9B%BA%E4%BB%B6%22%2C%22%E6%9E%84%E5%BB%BA%E9%AB%98%E5%B9%B6%E5%8F%91%20Web%20%E6%9C%8D%E5%8A%A1%22%2C%22%E7%BC%96%E5%86%99%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%86%85%E6%A0%B8%E9%A9%B1%E5%8A%A8%22%2C%22%E7%BC%96%E5%86%99%E4%B8%80%E4%B8%AA%E9%9C%80%E8%A6%81%205%20%E5%88%86%E9%92%9F%E5%AE%8C%E6%88%90%E7%9A%84%E7%AE%80%E5%8D%95%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E5%AD%A6%E4%B9%A0%E6%9B%B2%E7%BA%BF%E5%92%8C%E7%BC%96%E8%AF%91%E6%97%B6%E9%97%B4%E5%AF%B9%E3%80%8C%E4%B8%80%E6%AC%A1%E6%80%A7%E8%84%9A%E6%9C%AC%E3%80%8D%E6%9D%A5%E8%AF%B4%E4%BB%A3%E4%BB%B7%E8%BF%87%E9%AB%98%EF%BC%8CPython%20%E6%88%96%20Shell%20%E6%9B%B4%E5%90%88%E9%80%82%E3%80%82Rust%20%E7%9A%84%E4%BC%98%E5%8A%BF%E5%9C%A8%E9%9C%80%E8%A6%81%E6%80%A7%E8%83%BD%E3%80%81%E5%AE%89%E5%85%A8%E6%80%A7%E5%92%8C%E9%95%BF%E6%9C%9F%E7%BB%B4%E6%8A%A4%E7%9A%84%E7%B3%BB%E7%BB%9F%E7%BA%A7%E5%9C%BA%E6%99%AF%E4%B8%AD%E6%89%8D%E8%83%BD%E5%85%85%E5%88%86%E4%BD%93%E7%8E%B0%E3%80%82%22%7D">
  <div class="quiz-placeholder">加载题目中…</div>
</div>

### 编译器的角色

<div class="quiz-choice" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20Rust%20%E4%B8%AD%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E6%8B%92%E7%BB%9D%E7%BC%96%E8%AF%91%E4%B8%80%E6%AE%B5%E4%BB%A3%E7%A0%81%EF%BC%8C%E9%80%9A%E5%B8%B8%E6%84%8F%E5%91%B3%E7%9D%80%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BB%A3%E7%A0%81%E5%AD%98%E5%9C%A8%E6%BD%9C%E5%9C%A8%E7%9A%84%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E6%88%96%E5%B9%B6%E5%8F%91%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%9C%A8%E8%BF%90%E8%A1%8C%E5%89%8D%E9%98%BB%E6%AD%A2%E4%BA%86%E5%AE%83%22%2C%22%E4%BB%A3%E7%A0%81%E9%80%BB%E8%BE%91%E8%82%AF%E5%AE%9A%E6%9C%89%E9%94%99%E8%AF%AF%EF%BC%8C%E7%A8%8B%E5%BA%8F%E4%BC%9A%E8%BE%93%E5%87%BA%E9%94%99%E8%AF%AF%E7%BB%93%E6%9E%9C%22%2C%22%E4%BB%A3%E7%A0%81%E6%80%A7%E8%83%BD%E4%B8%8D%E5%A4%9F%E5%A5%BD%EF%BC%8C%E9%9C%80%E8%A6%81%E4%BC%98%E5%8C%96%22%2C%22%E4%BB%A3%E7%A0%81%E4%BD%BF%E7%94%A8%E4%BA%86%E8%BF%87%E6%97%B6%E7%9A%84%E8%AF%AD%E6%B3%95%EF%BC%8C%E9%9C%80%E8%A6%81%E5%8D%87%E7%BA%A7%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%E6%8B%92%E7%BB%9D%E4%BB%A3%E7%A0%81%EF%BC%8C%E6%9C%80%E5%B8%B8%E8%A7%81%E7%9A%84%E5%8E%9F%E5%9B%A0%E6%98%AF%E6%A3%80%E6%B5%8B%E5%88%B0%E4%BA%86%E6%BD%9C%E5%9C%A8%E7%9A%84%E5%86%85%E5%AD%98%E9%97%AE%E9%A2%98%EF%BC%88%E5%A6%82%E6%82%AC%E7%A9%BA%E5%BC%95%E7%94%A8%E3%80%81%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E3%80%81%E4%BD%BF%E7%94%A8%E5%B7%B2%E7%A7%BB%E5%8A%A8%E7%9A%84%E5%80%BC%EF%BC%89%E3%80%82%E8%BF%99%E4%B8%8D%E6%98%AF%5C%22%E9%80%BB%E8%BE%91%E9%94%99%E8%AF%AF%5C%22%EF%BC%8C%E8%80%8C%E6%98%AF%20Rust%20%E4%B8%BB%E5%8A%A8%E4%BF%9D%E6%8A%A4%E4%BD%A0%E4%B8%8D%E9%99%B7%E5%85%A5%20C%2FC%2B%2B%20%E4%B8%AD%E9%82%A3%E4%BA%9B%E8%BF%90%E8%A1%8C%E6%97%B6%E6%89%8D%E8%83%BD%E5%8F%91%E7%8E%B0%E7%9A%84%E9%99%B7%E9%98%B1%E3%80%82%22%7D">
  <div class="quiz-placeholder">加载题目中…</div>
</div>
