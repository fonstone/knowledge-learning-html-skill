---
chapterId: "21-proc-macros"
lessonId: "01-proc-macro-basics"
title: "过程宏基础"
level: "进阶"
duration: "25 分钟"
tags: ["proc macro", "proc-macro crate", TokenStream, 过程宏入门]
number: "21.1"
chapterTitle: "过程宏"
chapterNumber: "21"
---
<div id="article-content"> <h1 id="过程宏是什么">过程宏是什么</h1>
<h2 id="先回顾声明宏">先回顾声明宏</h2>
<p>你在前面学过 <code>macro_rules!</code>，它通过<strong>模式匹配</strong>来生成代码：</p>
<div class="code-runner" data-full-code="macro_rules!%20say_hello%20%7B%0A%20%20%20%20(%24name%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20%24name)%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20say_hello!(%22Alice%22)%3B%20%2F%2F%20%E5%B1%95%E5%BC%80%E4%B8%BA%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20%22Alice%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">macro_rules! say_hello {
    ($name:expr) =&gt; {
        println!("你好，{}！", $name);
    };
}

fn main() {
    say_hello!("Alice"); // 展开为 println!("你好，{}！", "Alice");
}</code></pre></div>
<p><code>macro_rules!</code> 的工作方式：<strong>匹配输入的”形状”，按模板替换</strong>。</p>
<p>这很强大，但有一个根本限制：你只能做<strong>模式替换</strong>，无法运行任意逻辑。</p>
<p>比如，你想根据结构体的字段数量生成不同的代码——<code>macro_rules!</code> 做不到，因为它不能”查看”结构体有几个字段。</p>
<h2 id="过程宏真正的-rust-程序">过程宏：真正的 Rust 程序</h2>
<p><strong>过程宏（Procedural Macro）</strong> 是完全不同的一种宏。</p>
<p>它是一段真正运行的 Rust 程序，在<strong>编译时</strong>被调用：</p>
<pre><code class="language-text">你的源代码
    ↓
编译器遇到 #[derive(MyMacro)]
    ↓
调用你写的 Rust 程序（过程宏函数）
    ↓
你的程序接收 TokenStream（一串 token），可以运行任意逻辑
    ↓
输出新的 TokenStream（生成的代码）
    ↓
编译器把生成的代码和原代码合在一起继续编译</code></pre>
<p><strong>声明宏 vs 过程宏：</strong></p>
<table><thead><tr><th></th><th>声明宏 <code>macro_rules!</code></th><th>过程宏</th></tr></thead><tbody><tr><td>实现方式</td><td>模式匹配替换</td><td>运行任意 Rust 代码</td></tr><tr><td>能力</td><td>只能做文本模板替换</td><td>可以分析 AST、运行逻辑、生成任意代码</td></tr><tr><td>错误提示</td><td>有限</td><td>可自定义详细错误信息</td></tr><tr><td>典型用途</td><td>简单代码生成</td><td><code>#[derive(Serialize)]</code>、<code>#[test]</code>、<code>sqlx::query!</code></td></tr></tbody></table>
<p>表格里多次出现了 <code>TokenStream</code> 这个词。要理解过程宏，必须先搞清楚它是什么。</p>
<h2 id="tokenstream一串-token">TokenStream：一串 token</h2>
<p>过程宏接收和输出的是 <strong><code>TokenStream</code></strong>——编译器把源码解析成的”token 序列”。</p>
<p>“token”就是源码的最小语法单元，比如：</p>
<pre><code class="language-text">struct Point { x: i32, y: i32 }</code></pre>
<p>被分解成这些 token：</p>
<pre><code class="language-text">`struct` `Point` `{` `x` `:` `i32` `,` `y` `:` `i32` `}`</code></pre>
<p>过程宏函数的签名形式固定：</p>
<pre><code class="language-rust">// 接收 token 序列，返回新的 token 序列
fn my_macro(input: proc_macro::TokenStream) -&gt; proc_macro::TokenStream {
    // 可以读取 input 里的内容，生成新代码
    input // 最简单的情况：原样返回
}</code></pre>
<h2 id="三种过程宏">三种过程宏</h2>
<p>Rust 有三种不同形式的过程宏，分别用于不同场景：</p>
<h3 id="1-自定义-derive-宏">1. 自定义 Derive 宏</h3>
<p>最常见。为结构体或枚举自动实现 trait：</p>
<pre><code class="language-rust">#[derive(Debug, Clone, Serialize)]  // Debug 和 Clone 是内置，Serialize 是 serde 库提供的
struct Point { x: f64, y: f64 }</code></pre>
<p>你自己写一个 <code>#[derive(MyTrait)]</code>，让用户一行代码就能自动实现你的 trait。</p>
<h3 id="2-类属性宏">2. 类属性宏</h3>
<p>像内置属性一样，可以加在任意代码项上，并修改或替换该项：</p>
<pre><code class="language-rust">#[route(GET, "/")]       // web 框架用属性宏标注路由
async fn index() { ... }

#[instrument]            // tracing 库的属性宏，自动追踪函数调用
fn my_function() { ... }</code></pre>
<h3 id="3-类函数宏">3. 类函数宏</h3>
<p>看起来像函数调用（带 <code>!</code>），但能处理任意 token：</p>
<pre><code class="language-rust">let query = sql!(SELECT * FROM users WHERE id = 42);
// sql! 是过程宏，可以在编译时验证 SQL 语句的语法！</code></pre>
<h1 id="搭建过程宏项目">搭建过程宏项目</h1>
<h2 id="为什么需要独立-crate">为什么需要独立 crate</h2>
<p><strong>过程宏必须放在独立的 crate 里。</strong> 这是 Rust 编译器的硬性要求。</p>
<p>原因是：过程宏在<strong>编译你的代码时</strong>运行，而不是在运行时。编译器需要先编译过程宏，才能用它来编译你的项目。如果把过程宏和普通代码放在一起，就会产生循环依赖。</p>
<p>典型的项目结构：</p>
<pre><code class="language-text">my-project/           ← 你的主项目
├── Cargo.toml
├── src/
│   └── main.rs       ← 使用过程宏的代码
│
└── my-macros/        ← 独立的过程宏 crate
    ├── Cargo.toml
    └── src/
        └── lib.rs    ← 过程宏的实现</code></pre>
<h2 id="过程宏-crate-的-cargotoml">过程宏 crate 的 Cargo.toml</h2>
<p>过程宏 crate 需要在 <code>Cargo.toml</code> 中声明 <code>proc-macro = true</code>：</p>
<pre><code class="language-toml"># my-macros/Cargo.toml
[package]
name = "my-macros"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true    # 告诉编译器这是一个过程宏 crate

[dependencies]
# 通常需要这两个库
syn = "2"
quote = "1"</code></pre>
<p>主项目依赖它：</p>
<pre><code class="language-toml"># my-project/Cargo.toml
[dependencies]
my-macros = { path = "./my-macros" }</code></pre>
<h2 id="第一个过程宏什么都不做">第一个过程宏：什么都不做</h2>
<p>先写一个最简单的过程宏——接收输入，原样返回：</p>
<pre><code class="language-rust">// my-macros/src/lib.rs

use proc_macro::TokenStream;

// #[proc_macro_derive(DoNothing)] 声明这是一个 derive 宏，名字叫 DoNothing
#[proc_macro_derive(DoNothing)]
pub fn do_nothing_derive(input: TokenStream) -&gt; TokenStream {
    // 原样返回输入，不做任何修改
    input
}</code></pre>
<p>用它：</p>
<pre><code class="language-rust">// my-project/src/main.rs
use my_macros::DoNothing;

#[derive(DoNothing)]  // 什么都不做，只是演示结构
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    println!("编译成功！");
}</code></pre>
<blockquote>
<p><strong>注意</strong>：以上代码需要在有独立 proc-macro crate 的项目中运行，无法在 Rust Playground 中直接运行。可以用 <code>cargo new my-project</code> 新建项目，然后按上面的结构创建。</p>
</blockquote>
<h2 id="过程宏能做到什么预告">过程宏能做到什么（预告）</h2>
<p>来看几个你已经每天都在用的过程宏：</p>
<div class="code-runner" data-full-code="%2F%2F%20%23%5Bderive(Debug)%5D%20%E6%98%AF%E4%B8%80%E4%B8%AA%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%88%E7%BC%96%E8%AF%91%E5%99%A8%E5%86%85%E7%BD%AE%E5%AE%9E%E7%8E%B0%EF%BC%89%0A%2F%2F%20%E5%AE%83%E8%AF%BB%E5%8F%96%E7%BB%93%E6%9E%84%E4%BD%93%E7%9A%84%E5%AD%97%E6%AE%B5%E5%90%8D%E5%92%8C%E7%B1%BB%E5%9E%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20Debug%20%E5%AE%9E%E7%8E%B0%0A%23%5Bderive(Debug%2C%20Clone%2C%20PartialEq)%5D%0Astruct%20User%20%7B%0A%20%20%20%20name%3A%20String%2C%0A%20%20%20%20age%3A%20u32%2C%0A%20%20%20%20active%3A%20bool%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20u1%20%3D%20User%20%7B%20name%3A%20%22Alice%22.into()%2C%20age%3A%2028%2C%20active%3A%20true%20%7D%3B%0A%20%20%20%20let%20u2%20%3D%20u1.clone()%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Clone%20%E6%9D%A5%E8%87%AA%20derive(Clone)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20u1)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20Debug%20%E6%9D%A5%E8%87%AA%20derive(Debug)%0A%20%20%20%20println!(%22%7B%7D%22%2C%20u1%20%3D%3D%20u2)%3B%20%20%20%20%20%20%2F%2F%20PartialEq%20%E6%9D%A5%E8%87%AA%20derive(PartialEq)%0A%7D" data-mode="run"><pre><code class="language-rust">// #[derive(Debug)] 是一个过程宏（编译器内置实现）
// 它读取结构体的字段名和类型，自动生成 Debug 实现
#[derive(Debug, Clone, PartialEq)]
struct User {
    name: String,
    age: u32,
    active: bool,
}

fn main() {
    let u1 = User { name: "Alice".into(), age: 28, active: true };
    let u2 = u1.clone();           // Clone 来自 derive(Clone)
    println!("{:?}", u1);          // Debug 来自 derive(Debug)
    println!("{}", u1 == u2);      // PartialEq 来自 derive(PartialEq)
}</code></pre></div>
<p>这段代码展示的就是过程宏的威力：不需要你手动写三个 trait 的实现，编译器调用内置的过程宏，扫描你的字段，自动生成正确的实现代码。</p>
<p>接下来的几篇文章，你将学会自己写这样的宏。</p>
<h1 id="练习题">练习题</h1>
<h2 id="过程宏概念测验">过程宏概念测验</h2>
<div class="quiz-choice" data-block-id="21-proc-macros/01-proc-macro-basics#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%85%B3%E4%BA%8E%E8%BF%87%E7%A8%8B%E5%AE%8F%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E5%93%AA%E4%B8%AA%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%9C%A8%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E6%97%B6%E6%89%A7%E8%A1%8C%22%2C%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%BF%85%E9%A1%BB%E5%86%99%E5%9C%A8%20main.rs%20%E4%B8%AD%22%2C%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%92%8C%E5%A3%B0%E6%98%8E%E5%AE%8F%E9%83%BD%E5%8F%AA%E8%83%BD%E5%81%9A%E6%A8%A1%E5%BC%8F%E6%9B%BF%E6%8D%A2%22%2C%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E6%89%A7%E8%A1%8C%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%8E%A5%E6%94%B6%20TokenStream%E3%80%81%E8%BF%90%E8%A1%8C%E4%BB%BB%E6%84%8F%20Rust%20%E9%80%BB%E8%BE%91%E3%80%81%E8%BE%93%E5%87%BA%E6%96%B0%E7%9A%84%20TokenStream%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E6%98%AF%E5%9C%A8%5C%22%E7%BC%96%E8%AF%91%E6%97%B6%5C%22%E8%BF%90%E8%A1%8C%E7%9A%84%20Rust%20%E7%A8%8B%E5%BA%8F%E3%80%82%E5%AE%83%E7%9A%84%E8%BE%93%E5%85%A5%E6%98%AF%20TokenStream%EF%BC%88%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%A0%E6%9D%A5%E7%9A%84%E6%BA%90%E7%A0%81%20token%20%E5%BA%8F%E5%88%97%EF%BC%89%EF%BC%8C%E8%BE%93%E5%87%BA%E4%B9%9F%E6%98%AF%20TokenStream%EF%BC%88%E7%94%9F%E6%88%90%E7%9A%84%E6%96%B0%E4%BB%A3%E7%A0%81%EF%BC%89%E3%80%82%E8%BF%99%E4%BD%BF%E5%BE%97%E5%AE%83%E5%8F%AF%E4%BB%A5%E8%BF%90%E8%A1%8C%E4%BB%BB%E6%84%8F%E9%80%BB%E8%BE%91%EF%BC%8C%E8%80%8C%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E6%A8%A1%E5%BC%8F%E6%9B%BF%E6%8D%A2%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/01-proc-macro-basics#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%BF%85%E9%A1%BB%E6%94%BE%E5%9C%A8%E7%8B%AC%E7%AB%8B%E7%9A%84%20crate%20%E9%87%8C%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%99%E5%8F%AA%E6%98%AF%E4%B8%80%E4%B8%AA%E7%BA%A6%E5%AE%9A%EF%BC%8C%E4%B8%8D%E6%98%AF%E7%A1%AC%E6%80%A7%E8%A6%81%E6%B1%82%22%2C%22%E5%9B%A0%E4%B8%BA%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%9C%A8%E7%BC%96%E8%AF%91%E5%85%B6%E4%BB%96%E4%BB%A3%E7%A0%81%E4%B9%8B%E5%89%8D%E8%BF%90%E8%A1%8C%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%85%88%E5%8D%95%E7%8B%AC%E7%BC%96%E8%AF%91%EF%BC%9B%E8%8B%A5%E6%B7%B7%E5%9C%A8%E4%B8%80%E8%B5%B7%E4%BC%9A%E4%BA%A7%E7%94%9F%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%8F%AF%E4%BB%A5%E8%A2%AB%E5%A4%9A%E4%B8%AA%E9%A1%B9%E7%9B%AE%E5%A4%8D%E7%94%A8%22%2C%22%E5%9B%A0%E4%B8%BA%E8%BF%87%E7%A8%8B%E5%AE%8F%E7%9A%84%E8%AF%AD%E6%B3%95%E5%92%8C%E6%99%AE%E9%80%9A%20Rust%20%E4%B8%8D%E5%90%8C%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E9%9C%80%E8%A6%81%E7%89%B9%E6%AE%8A%E5%A4%84%E7%90%86%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E8%BF%99%E6%98%AF%E7%BC%96%E8%AF%91%E9%A1%BA%E5%BA%8F%E5%86%B3%E5%AE%9A%E7%9A%84%E3%80%82%E7%BC%96%E8%AF%91%E5%99%A8%E9%9C%80%E8%A6%81%5C%22%E5%85%88%E7%BC%96%E8%AF%91%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%8C%E6%89%8D%E8%83%BD%E7%94%A8%E8%BF%87%E7%A8%8B%E5%AE%8F%E7%BC%96%E8%AF%91%E4%BD%A0%E7%9A%84%E4%BB%A3%E7%A0%81%5C%22%E3%80%82%E5%A6%82%E6%9E%9C%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%92%8C%E7%94%A8%E5%AE%83%E7%9A%84%E4%BB%A3%E7%A0%81%E5%9C%A8%E5%90%8C%E4%B8%80%E4%B8%AA%20crate%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%B0%B1%E4%B8%8D%E7%9F%A5%E9%81%93%E5%85%88%E7%BC%96%E8%AF%91%E5%93%AA%E4%B8%AA%EF%BC%8C%E4%BA%A7%E7%94%9F%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%E3%80%82%E7%8B%AC%E7%AB%8B%20crate%20%E6%89%93%E7%A0%B4%E4%BA%86%E8%BF%99%E4%B8%AA%E5%BE%AA%E7%8E%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/01-proc-macro-basics#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%B8%AA%20Rust%20%E6%A0%87%E5%87%86%E5%BA%93%E7%89%B9%E6%80%A7%E7%9A%84%E5%BA%95%E5%B1%82%E5%AE%9E%E7%8E%B0%E7%94%A8%E5%88%B0%E4%BA%86%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%9F%22%2C%22options%22%3A%5B%22fn%20main()%20%E5%87%BD%E6%95%B0%22%2C%22%23%5Bderive(Debug)%5D%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20Debug%20trait%20%E5%AE%9E%E7%8E%B0%22%2C%22for%20%E5%BE%AA%E7%8E%AF%22%2C%22let%20%E5%8F%98%E9%87%8F%E7%BB%91%E5%AE%9A%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%23%5Bderive(Debug)%5D%20%E6%98%AF%E7%BC%96%E8%AF%91%E5%99%A8%E5%86%85%E7%BD%AE%E7%9A%84%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%88derive%20%E5%AE%8F%EF%BC%89%E3%80%82%E5%AE%83%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E6%89%AB%E6%8F%8F%E7%BB%93%E6%9E%84%E4%BD%93%E7%9A%84%E5%AD%97%E6%AE%B5%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20fmt%3A%3ADebug%20%E7%9A%84%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81%E3%80%82%23%5Btest%5D%20%E4%B9%9F%E6%98%AF%E4%B8%80%E4%B8%AA%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%88%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/01-proc-macro-basics#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22TokenStream%20%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%BD%91%E7%BB%9C%E4%BC%A0%E8%BE%93%E7%9A%84%E6%95%B0%E6%8D%AE%E6%B5%81%22%2C%22%E8%BF%90%E8%A1%8C%E6%97%B6%E7%9A%84%E5%AD%97%E8%8A%82%E6%B5%81%22%2C%22%E4%B8%80%E7%A7%8D%E8%BF%AD%E4%BB%A3%E5%99%A8%E7%B1%BB%E5%9E%8B%22%2C%22%E7%BC%96%E8%AF%91%E5%99%A8%E5%B0%86%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E5%90%8E%E7%9A%84%20token%EF%BC%88%E8%AF%8D%E6%B3%95%E5%8D%95%E5%85%83%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%8C%E6%98%AF%E8%BF%87%E7%A8%8B%E5%AE%8F%E7%9A%84%E8%BE%93%E5%85%A5%E5%92%8C%E8%BE%93%E5%87%BA%E7%B1%BB%E5%9E%8B%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E7%BC%96%E8%AF%91%E5%99%A8%E9%A6%96%E5%85%88%E6%8A%8A%E6%BA%90%E7%A0%81%E6%96%87%E6%9C%AC%E5%88%86%E8%A7%A3%E6%88%90%20token%EF%BC%88%E5%A6%82%20struct%E3%80%81Point%E3%80%81%7B%E3%80%81x%20%E7%AD%89%EF%BC%89%EF%BC%8C%E5%86%8D%E6%8A%8A%E8%BF%99%E4%BA%9B%20token%20%E6%89%93%E5%8C%85%E6%88%90%20TokenStream%20%E4%BC%A0%E7%BB%99%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%87%BD%E6%95%B0%E3%80%82%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%8F%AF%E4%BB%A5%E5%88%86%E6%9E%90%E8%BF%99%E4%BA%9B%20token%EF%BC%8C%E7%84%B6%E5%90%8E%E8%BF%94%E5%9B%9E%E6%96%B0%E7%9A%84%20TokenStream%20%E4%BD%9C%E4%B8%BA%E7%94%9F%E6%88%90%E7%9A%84%E4%BB%A3%E7%A0%81%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/01-proc-macro-basics#2:4" data-kind="multi" data-payload="%7B%22question%22%3A%22Rust%20%E7%9A%84%E4%B8%89%E7%A7%8D%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%88%86%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%EF%BC%9A%E7%94%A8%20%23%5Bmacro_name%5D%20%E4%BF%AE%E9%A5%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E9%A1%B9%EF%BC%88%E5%87%BD%E6%95%B0%E3%80%81%E7%BB%93%E6%9E%84%E4%BD%93%E7%AD%89%EF%BC%89%22%2C%22derive%20%E5%AE%8F%EF%BC%9A%E7%94%A8%20%23%5Bderive(MacroName)%5D%20%E4%B8%BA%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E5%AE%9E%E7%8E%B0%20trait%22%2C%22%E9%97%AD%E5%8C%85%E5%AE%8F%EF%BC%9A%E7%94%A8%20%7Cargs%7C%20macro_body%20%E5%AE%9A%E4%B9%89%22%2C%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%EF%BC%9A%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%20macro_name!(args)%20%E7%9A%84%E5%87%BD%E6%95%B0%E5%BC%8F%E8%B0%83%E7%94%A8%E5%BD%A2%E5%BC%8F%22%5D%2C%22correct%22%3A%5B0%2C1%2C3%5D%2C%22explanation%22%3A%22%E4%B8%89%E7%A7%8D%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%9Aderive%20%E5%AE%8F%EF%BC%88%23%5Bderive(X)%5D%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20trait%20%E5%AE%9E%E7%8E%B0%EF%BC%89%E3%80%81%E5%B1%9E%E6%80%A7%E5%AE%8F%EF%BC%88%23%5Battr%5D%EF%BC%8C%E4%BF%AE%E6%94%B9%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E9%A1%B9%EF%BC%89%E3%80%81%E5%87%BD%E6%95%B0%E5%BC%8F%E5%AE%8F%EF%BC%88name!(...)%EF%BC%8C%E5%A4%84%E7%90%86%E4%BB%BB%E6%84%8F%20token%EF%BC%89%E3%80%82%E6%B2%A1%E6%9C%89%5C%22%E9%97%AD%E5%8C%85%E5%AE%8F%5C%22%E8%BF%99%E4%B8%AA%E6%A6%82%E5%BF%B5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
