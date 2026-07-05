---
chapterId: "02-basic-syntax"
lessonId: "01-comments"
title: "注释"
level: "入门"
duration: "10 分钟"
tags: [注释, 行注释, 块注释, 文档注释, ///, "//!"]
number: "2.1"
chapterTitle: "基础语法"
chapterNumber: "02"
---
<div id="article-content"> <h1 id="注释语法">注释语法</h1>
<p>注释不参与程序运行，却是代码不可缺少的一部分。Rust 有四种注释形式，每种都有不同的用途和使用场景。</p>
<h2 id="行注释">行注释 <code>//</code></h2>
<p>行注释是最常见的形式，<code>//</code> 后面到行尾的所有内容都会被编译器忽略：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E6%98%AF%E4%B8%80%E8%A1%8C%E6%B3%A8%E9%87%8A%0A%20%20%20%20println!(%22Hello%22)%3B%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E5%86%99%E5%9C%A8%E4%BB%A3%E7%A0%81%E8%A1%8C%E6%9C%AB%E5%B0%BE%0A%0A%20%20%20%20%2F%2F%20%E6%B3%A8%E9%87%8A%E6%8E%89%E7%9A%84%E4%BB%A3%E7%A0%81%E4%B8%8D%E4%BC%9A%E6%89%A7%E8%A1%8C%EF%BC%9A%0A%20%20%20%20%2F%2F%20println!(%22%E8%BF%99%E8%A1%8C%E4%B8%8D%E4%BC%9A%E8%BE%93%E5%87%BA%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    // 这是一行注释
    println!("Hello"); // 也可以写在代码行末尾

    // 注释掉的代码不会执行：
    // println!("这行不会输出");
}</code></pre></div>
<p>Rust 社区的惯例是<strong>优先使用行注释</strong>，而不是块注释。行注释更清晰、更容易追踪每行的意图。</p>
<h2 id="块注释-">块注释 <code>/* */</code></h2>
<p>块注释可以跨越多行，常用于临时注释掉一大段代码：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F*%0A%20%20%20%20%20*%20%E8%BF%99%E6%98%AF%E5%9D%97%E6%B3%A8%E9%87%8A%E3%80%82%0A%20%20%20%20%20*%20%E7%BC%A9%E8%BF%9B%E5%92%8C%E6%98%9F%E5%8F%B7%E5%8F%AA%E6%98%AF%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%B8%8D%E6%98%AF%E8%AF%AD%E6%B3%95%E8%A6%81%E6%B1%82%E3%80%82%0A%20%20%20%20%20*%2F%0A%0A%20%20%20%20let%20x%20%3D%205%20%2B%20%2F*%2090%20%2B%20*%2F%205%3B%20%2F%2F%20%E5%9D%97%E6%B3%A8%E9%87%8A%E5%8F%AF%E4%BB%A5%E5%B5%8C%E5%85%A5%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD%E9%97%B4%EF%BC%81%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%20%20%20%20%20%2F%2F%20%E8%BE%93%E5%87%BA%2010%EF%BC%8C%E4%B8%8D%E6%98%AF%20100%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    /*
     * 这是块注释。
     * 缩进和星号只是风格，不是语法要求。
     */

    let x = 5 + /* 90 + */ 5; // 块注释可以嵌入表达式中间！
    println!("x = {}", x);     // 输出 10，不是 100
}</code></pre></div>
<p>Rust 的块注释有一个独特之处：<strong>支持嵌套</strong>。</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F*%20%E5%A4%96%E5%B1%82%E6%B3%A8%E9%87%8A%0A%20%20%20%20%20%20%20%20%2F*%20%E5%86%85%E5%B1%82%E6%B3%A8%E9%87%8A%E4%B9%9F%E5%8F%AF%E4%BB%A5%20*%2F%0A%20%20%20%20%E8%BF%98%E5%9C%A8%E5%A4%96%E5%B1%82%E6%B3%A8%E9%87%8A%E4%B8%AD%20*%2F%0A%20%20%20%20println!(%22%E5%9D%97%E6%B3%A8%E9%87%8A%E5%8F%AF%E4%BB%A5%E5%B5%8C%E5%A5%97%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    /* 外层注释
        /* 内层注释也可以 */
    还在外层注释中 */
    println!("块注释可以嵌套");
}</code></pre></div>
<blockquote>
<p>嵌套块注释在 C 语言中是不合法的，但 Rust 支持。这让你可以用 <code>/* */</code> 快速注释掉已经包含块注释的代码块。</p>
</blockquote>
<h2 id="文档注释">文档注释 <code>///</code></h2>
<p><code>///</code> 用于为<strong>紧跟在它后面的代码项</strong>（函数、结构体、模块等）生成 HTML 格式的 API 文档，内容支持 Markdown：</p>
<div class="code-runner" data-full-code="%2F%2F%2F%20%E8%AE%A1%E7%AE%97%E4%B8%A4%E4%B8%AA%E6%95%B4%E6%95%B0%E7%9A%84%E5%92%8C%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20%E7%A4%BA%E4%BE%8B%0A%2F%2F%2F%0A%2F%2F%2F%20%60%60%60%0A%2F%2F%2F%20let%20result%20%3D%20add(2%2C%203)%3B%0A%2F%2F%2F%20assert_eq!(result%2C%205)%3B%0A%2F%2F%2F%20%60%60%60%0Afn%20add(a%3A%20i32%2C%20b%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20a%20%2B%20b%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add(2%2C%203))%3B%0A%7D" data-mode="run"><pre><code class="language-rust">/// 计算两个整数的和。
///
/// # 示例
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
fn add(a: i32, b: i32) -&gt; i32 {
    a + b
}

fn main() {
    println!("{}", add(2, 3));
}</code></pre></div>
<p>运行 <code>cargo doc --open</code> 后，<code>///</code> 的内容会渲染成漂亮的网页文档——这是 Rust 生态的标准文档格式，所有开源 crate 都遵循这个惯例。</p>
<h2 id="内部文档注释">内部文档注释 <code>//!</code></h2>
<p><code>//!</code> 与 <code>///</code> 方向相反——它为<strong>包含它的项</strong>（通常是文件顶部）生成文档，常用于描述整个模块或 crate：</p>
<div class="code-runner" data-full-code="%2F%2F!%20%E8%BF%99%E6%98%AF%E5%BD%93%E5%89%8D%E6%A8%A1%E5%9D%97%E7%9A%84%E6%8F%8F%E8%BF%B0%E3%80%82%0A%2F%2F!%20%E4%B8%80%E8%88%AC%E6%94%BE%E5%9C%A8%E6%96%87%E4%BB%B6%E6%9C%80%E9%A1%B6%E9%83%A8%EF%BC%8C%E7%94%A8%E4%BA%8E%E8%AF%B4%E6%98%8E%E6%A8%A1%E5%9D%97%E7%9A%84%E6%95%B4%E4%BD%93%E7%94%A8%E9%80%94%E3%80%82%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E6%A8%A1%E5%9D%97%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%E7%A4%BA%E4%BE%8B%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">//! 这是当前模块的描述。
//! 一般放在文件最顶部，用于说明模块的整体用途。

fn main() {
    println!("模块文档注释示例");
}</code></pre></div>
<p>简单记：<code>///</code> 是”我在描述下面的东西”，<code>//!</code> 是”我在描述我所在的容器”。</p>
<blockquote>
<p>文档注释和内部文档注释的完整用法（Markdown 语法、示例测试、cargo doc 工作流）在<a href="/RustCourse/chapters/08-engineering/03-doc-comments">项目工程化：文档注释与 doctest</a> 中专门讲解，当前了解即可。</p>
</blockquote>
<h2 id="四种注释速查">四种注释速查</h2>
<table><thead><tr><th>形式</th><th>用途</th><th>生成文档</th></tr></thead><tbody><tr><td><code>//</code></td><td>普通行注释</td><td>否</td></tr><tr><td><code>/* */</code></td><td>普通块注释，可嵌套</td><td>否</td></tr><tr><td><code>///</code></td><td>为下方的项生成文档</td><td><strong>是</strong></td></tr><tr><td><code>//!</code></td><td>为所在模块/crate 生成文档</td><td><strong>是</strong></td></tr></tbody></table>
<h1 id="练习题">练习题</h1>
<h2 id="注释的执行">注释的执行</h2>
<pre><code class="language-rust">fn main() {
    // println!("A");
    println!("B");
    /* println!("C"); */
}</code></pre>
<div class="quiz-choice" data-block-id="02-basic-syntax/01-comments#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%90%E8%A1%8C%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%BE%93%E5%87%BA%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22B%22%2C%22A%22%2C%22B%20%E5%92%8C%20C%22%2C%22A%20%E5%92%8C%20B%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%60%2F%2F%60%20%E5%92%8C%20%60%2F*%20*%2F%60%20%E5%86%85%E7%9A%84%E4%BB%A3%E7%A0%81%E9%83%BD%E4%BC%9A%E8%A2%AB%E7%BC%96%E8%AF%91%E5%99%A8%E5%BF%BD%E7%95%A5%EF%BC%8C%E5%8F%AA%E6%9C%89%20%60println!(%5C%22B%5C%22)%60%20%E4%BC%9A%E6%89%A7%E8%A1%8C%EF%BC%8C%E8%BE%93%E5%87%BA%20B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="块注释的特性">块注释的特性</h2>
<div class="quiz-choice" data-block-id="02-basic-syntax/01-comments#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22Rust%20%E7%9A%84%E5%9D%97%E6%B3%A8%E9%87%8A%20%60%2F*%20*%2F%60%20%E4%B8%8E%20C%20%E8%AF%AD%E8%A8%80%E7%9A%84%E5%9D%97%E6%B3%A8%E9%87%8A%E7%9B%B8%E6%AF%94%EF%BC%8C%E6%9C%89%E4%BB%80%E4%B9%88%E7%8B%AC%E7%89%B9%E4%B9%8B%E5%A4%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9D%97%E6%B3%A8%E9%87%8A%E4%B8%8D%E8%83%BD%E8%B7%A8%E8%B6%8A%E5%A4%9A%E8%A1%8C%22%2C%22%E5%9D%97%E6%B3%A8%E9%87%8A%E6%94%AF%E6%8C%81%E5%B5%8C%E5%A5%97%EF%BC%8C%E5%8D%B3%20%60%2F*%20%2F*%20%E5%86%85%E5%B1%82%20*%2F%20*%2F%60%20%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%22%2C%22%E5%9D%97%E6%B3%A8%E9%87%8A%E5%8F%AA%E8%83%BD%E5%86%99%E5%9C%A8%E5%8D%95%E7%8B%AC%E7%9A%84%E8%A1%8C%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%B5%8C%E5%85%A5%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD%E9%97%B4%22%2C%22%E5%9D%97%E6%B3%A8%E9%87%8A%E4%BC%9A%E7%94%9F%E6%88%90%E6%96%87%E6%A1%A3%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E5%9D%97%E6%B3%A8%E9%87%8A%E6%94%AF%E6%8C%81%E5%B5%8C%E5%A5%97%EF%BC%8C%E8%80%8C%20C%20%E8%AF%AD%E8%A8%80%E4%B8%8D%E6%94%AF%E6%8C%81%E3%80%82%E8%BF%99%E8%AE%A9%E4%BD%A0%E5%8F%AF%E4%BB%A5%E7%94%A8%20%60%2F*%20*%2F%60%20%E6%B3%A8%E9%87%8A%E6%8E%89%E5%B7%B2%E7%BB%8F%E5%90%AB%E6%9C%89%E5%9D%97%E6%B3%A8%E9%87%8A%E7%9A%84%E4%BB%A3%E7%A0%81%E6%AE%B5%E3%80%82%E5%9D%97%E6%B3%A8%E9%87%8A%E4%B9%9F%E5%8F%AF%E4%BB%A5%E5%B5%8C%E5%85%A5%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD%E9%97%B4%EF%BC%8C%E5%A6%82%20%60let%20x%20%3D%205%20%2B%20%2F*%2090%20%2B%20*%2F%205%3B%60%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="文档注释的方向">文档注释的方向</h2>
<div class="quiz-choice" data-block-id="02-basic-syntax/01-comments#1:2" data-kind="single" data-payload="%7B%22question%22%3A%22%60%2F%2F%2F%60%20%E5%92%8C%20%60%2F%2F!%60%20%E7%9A%84%E6%A0%B8%E5%BF%83%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%60%2F%2F%2F%60%20%E7%94%9F%E6%88%90%E6%96%87%E6%A1%A3%EF%BC%8C%60%2F%2F!%60%20%E4%B8%8D%E7%94%9F%E6%88%90%E6%96%87%E6%A1%A3%22%2C%22%60%2F%2F%2F%60%20%E6%8F%8F%E8%BF%B0%E7%B4%A7%E8%B7%9F%E5%9C%A8%E5%AE%83%E5%90%8E%E9%9D%A2%E7%9A%84%E9%A1%B9%EF%BC%8C%60%2F%2F!%60%20%E6%8F%8F%E8%BF%B0%E5%8C%85%E5%90%AB%E5%AE%83%E7%9A%84%E5%AE%B9%E5%99%A8%EF%BC%88%E5%A6%82%E6%A8%A1%E5%9D%97%EF%BC%89%22%2C%22%60%2F%2F%2F%60%20%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%EF%BC%8C%60%2F%2F!%60%20%E7%94%A8%E4%BA%8E%E7%BB%93%E6%9E%84%E4%BD%93%22%2C%22%E4%B8%A4%E8%80%85%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%EF%BC%8C%E5%8F%AA%E6%98%AF%E9%A3%8E%E6%A0%BC%E4%B8%8D%E5%90%8C%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%60%2F%2F%2F%60%20%E6%98%AF%5C%22%E5%90%91%E5%A4%96%5C%22%E6%B3%A8%E9%87%8A%EF%BC%8C%E6%8F%8F%E8%BF%B0%E4%B8%8B%E6%96%B9%E7%9A%84%E5%87%BD%E6%95%B0%E3%80%81%E7%BB%93%E6%9E%84%E4%BD%93%E7%AD%89%EF%BC%9B%60%2F%2F!%60%20%E6%98%AF%5C%22%E5%90%91%E5%86%85%5C%22%E6%B3%A8%E9%87%8A%EF%BC%8C%E6%8F%8F%E8%BF%B0%E5%AE%83%E6%89%80%E5%9C%A8%E7%9A%84%E6%A8%A1%E5%9D%97%E6%88%96%20crate%E3%80%82%60%2F%2F!%60%20%E9%80%9A%E5%B8%B8%E5%87%BA%E7%8E%B0%E5%9C%A8%E6%96%87%E4%BB%B6%E9%A1%B6%E9%83%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="哪些注释会生成-api-文档">哪些注释会生成 API 文档</h2>
<div class="quiz-choice" data-block-id="02-basic-syntax/01-comments#1:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E8%BF%90%E8%A1%8C%20%60cargo%20doc%60%20%E6%97%B6%EF%BC%8C%E5%93%AA%E4%BA%9B%E6%B3%A8%E9%87%8A%E7%9A%84%E5%86%85%E5%AE%B9%E4%BC%9A%E5%87%BA%E7%8E%B0%E5%9C%A8%E7%94%9F%E6%88%90%E7%9A%84%20HTML%20%E6%96%87%E6%A1%A3%E4%B8%AD%EF%BC%9F%22%2C%22options%22%3A%5B%22%60%2F*%20%E5%9D%97%E6%B3%A8%E9%87%8A%20*%2F%60%22%2C%22%60%2F%2F!%20%E5%86%85%E9%83%A8%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%60%22%2C%22%60%2F%2F%20%E6%99%AE%E9%80%9A%E8%A1%8C%E6%B3%A8%E9%87%8A%60%22%2C%22%60%2F%2F%2F%20%E5%A4%96%E9%83%A8%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%60%22%5D%2C%22correct%22%3A%5B1%2C3%5D%2C%22explanation%22%3A%22%E5%8F%AA%E6%9C%89%20%60%2F%2F%2F%60%20%E5%92%8C%20%60%2F%2F!%60%20%E6%98%AF%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%EF%BC%8C%E4%BC%9A%E8%A2%AB%20%60cargo%20doc%60%20%E8%A7%A3%E6%9E%90%E4%B8%BA%20API%20%E6%96%87%E6%A1%A3%E3%80%82%60%2F%2F%60%20%E5%92%8C%20%60%2F*%20*%2F%60%20%E6%98%AF%E6%99%AE%E9%80%9A%E6%B3%A8%E9%87%8A%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%AE%8C%E5%85%A8%E5%BF%BD%E7%95%A5%EF%BC%8C%E4%B8%8D%E4%BC%9A%E5%87%BA%E7%8E%B0%E5%9C%A8%E6%96%87%E6%A1%A3%E9%87%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="推荐的注释风格">推荐的注释风格</h2>
<div class="quiz-choice" data-block-id="02-basic-syntax/01-comments#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22Rust%20%E7%A4%BE%E5%8C%BA%E5%AF%B9%E4%BA%8E%E6%99%AE%E9%80%9A%E6%B3%A8%E9%87%8A%EF%BC%8C%E6%9B%B4%E6%8E%A8%E8%8D%90%E5%93%AA%E7%A7%8D%E5%BD%A2%E5%BC%8F%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%A1%8C%E6%B3%A8%E9%87%8A%20%60%2F%2F%60%22%2C%22%E4%B8%A4%E8%80%85%E5%AE%8C%E5%85%A8%E7%AD%89%E4%BB%B7%EF%BC%8C%E6%B2%A1%E6%9C%89%E6%8E%A8%E8%8D%90%22%2C%22%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%20%60%2F%2F%2F%60%22%2C%22%E5%9D%97%E6%B3%A8%E9%87%8A%20%60%2F*%20*%2F%60%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rust%20%E7%A4%BE%E5%8C%BA%E6%83%AF%E4%BE%8B%E6%98%AF%E4%BC%98%E5%85%88%E4%BD%BF%E7%94%A8%E8%A1%8C%E6%B3%A8%E9%87%8A%20%60%2F%2F%60%EF%BC%8C%E5%9D%97%E6%B3%A8%E9%87%8A%E4%B8%BB%E8%A6%81%E7%94%A8%E4%BA%8E%E4%B8%B4%E6%97%B6%E6%B3%A8%E9%87%8A%E6%8E%89%E5%A4%A7%E6%AE%B5%E4%BB%A3%E7%A0%81%E3%80%82rustfmt%20%E4%B9%9F%E9%BB%98%E8%AE%A4%E6%8C%89%E7%85%A7%E8%A1%8C%E6%B3%A8%E9%87%8A%E9%A3%8E%E6%A0%BC%E5%A4%84%E7%90%86%E3%80%82%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%20%60%2F%2F%2F%60%20%E6%9C%89%E7%89%B9%E6%AE%8A%E7%94%A8%E9%80%94%EF%BC%8C%E4%B8%8D%E7%94%A8%E4%BA%8E%E6%99%AE%E9%80%9A%E6%B3%A8%E9%87%8A%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="编程练习">编程练习</h2>
<p>下面的代码本应输出 <code>result = 42</code>，但有一处块注释的位置用错了，把本该参与计算的数字注释掉了。找出问题并修复它。</p>
<div class="code-editor" data-block-id="02-basic-syntax/01-comments#1:5" data-expect-mode="literal" data-expect-pattern="result%20%3D%2042" data-starter-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%2040%3B%0A%20%20%20%20let%20b%20%3D%20%2F*%202%20*%2F%3B%0A%20%20%20%20let%20result%20%3D%20a%20%2B%20b%3B%0A%20%20%20%20println!(%22result%20%3D%20%7B%7D%22%2C%20result)%3B%0A%7D"><pre><code class="language-rust">fn main() {
    let a = 40;
    let b = /* 2 */;
    let result = a + b;
    println!("result = {}", result);
}</code></pre></div> </div>
