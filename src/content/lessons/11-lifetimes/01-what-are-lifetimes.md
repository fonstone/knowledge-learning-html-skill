---
chapterId: "11-lifetimes"
lessonId: "01-what-are-lifetimes"
title: "为什么需要生命周期"
level: "进阶"
duration: "15 分钟"
tags: ["lifetime", "生命周期", "悬垂引用", "借用检查器", "borrow checker"]
number: "11.1"
chapterTitle: "生命周期"
chapterNumber: "11"
---

<div id="article-content"> <h1 id="悬垂引用问题">悬垂引用问题</h1>
<p>你已经知道 Rust 有”借用”这个概念：可以不转移所有权、只拿一个引用。但引用有个潜在风险——如果被引用的数据已经销毁了，引用还在，就会指向无效内存，这叫<strong>悬垂引用</strong>（dangling reference）。</p>
<p>C/C++ 程序员对这类 bug 再熟悉不过了：use-after-free、野指针……Rust 的目标是让这类错误<strong>在编译期就被发现</strong>，永远不到运行时。</p>
<h2 id="一个会出问题的例子">一个会出问题的例子</h2>
<p>看这段代码（你可能在借用与引用章节已经见过，我们再回顾一下）——它试图在内部作用域之外使用一个指向内部变量的引用：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20r%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20%20%20%20%20r%20%3D%20%26x%3B%20%20%20%20%20%20%20%2F%2F%20r%20%E5%80%9F%E7%94%A8%E4%BA%86%20x%0A%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20x%20%E5%9C%A8%E8%BF%99%E9%87%8C%E8%A2%AB%E9%94%80%E6%AF%81%0A%0A%20%20%20%20println!(%22r%3A%20%7B%7D%22%2C%20r)%3B%20%2F%2F%20%E5%8D%B1%E9%99%A9%EF%BC%81x%20%E5%B7%B2%E7%BB%8F%E4%B8%8D%E5%AD%98%E5%9C%A8%E4%BA%86%0A%7D" data-mode="expect-error"><pre><code class="language-rust">fn main() {
    let r;

    {
        let x = 5;
        r = &amp;x;       // r 借用了 x
    }                 // x 在这里被销毁

    println!("r: {}", r); // 危险！x 已经不存在了
}</code></pre></div>
<blockquote>
<p>Rust 会直接拒绝编译，报错：<code>`x` does not live long enough</code></p>
</blockquote>
<p><code>x</code> 的生命在内部 <code>{}</code> 结束时就结束了，但 <code>r</code> 要活到 <code>println!</code> 那行。<code>r</code> 比它所引用的数据活得更久——这就是悬垂引用。</p>
<h2 id="没有问题的版本">没有问题的版本</h2>
<p>只要让被引用的数据比引用活得更久，就没有问题：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20x%20%E5%9C%A8%E8%BF%99%E9%87%8C%E5%88%9B%E5%BB%BA%EF%BC%8C%E6%B4%BB%E5%BE%97%E6%9B%B4%E9%95%BF%0A%20%20%20%20let%20r%20%3D%20%26x%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20r%20%E5%80%9F%E7%94%A8%20x%0A%20%20%20%20println!(%22r%3A%20%7B%7D%22%2C%20r)%3B%20%2F%2F%20%E6%AD%A4%E6%97%B6%20x%20%E8%BF%98%E6%B4%BB%E7%9D%80%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%90%88%E6%B3%95%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let x = 5;            // x 在这里创建，活得更长
    let r = &amp;x;           // r 借用 x
    println!("r: {}", r); // 此时 x 还活着，完全合法
}</code></pre></div>
<p>这两个例子的区别只是 <code>x</code> 声明的位置，但 Rust 完全知道哪个可以、哪个不行。靠什么知道？靠<strong>借用检查器</strong>。</p>
<h1 id="借用检查器">借用检查器</h1>
<h2 id="编译器如何做判断">编译器如何做判断</h2>
<p>Rust 编译器内置了<strong>借用检查器</strong>（borrow checker），它的工作就是比对引用的生命周期与被引用数据的生命周期，确保前者不会超过后者。</p>
<p>我们用注释把生命周期可视化出来，看第一个出错的例子：</p>
<pre><code class="language-rust">{
    let r;                // ------+-- 'r 的生命周期开始
                          //       |
    {                     //       |
        let x = 5;        // -+--  |  'x 的生命周期开始
        r = &amp;x;           //  |    |
    }                     // -+    |  'x 生命周期结束！x 被销毁
                          //       |
    println!("{}", r);    //       |  r 仍然在用，但 'x 已经结束
}                         // ------+</code></pre>
<p><code>r</code> 的生命周期 <code>'r</code> 比 <code>x</code> 的生命周期 <code>'x</code> 更长。<code>r</code> 引用了 <code>x</code>，所以 <code>'x</code> 必须覆盖 <code>'r</code> 的整个范围——但它没有，编译器报错。</p>
<h2 id="正确例子的生命周期">正确例子的生命周期</h2>
<pre><code class="language-rust">{
    let x = 5;            // ------+-- 'x 开始
                          //       |
    let r = &amp;x;           // --+   |  'r 开始
                          //   |   |
    println!("{}", r);    //   |   |
                          // --+   |  'r 结束
}                         // ------+  'x 结束</code></pre>
<p><code>'x</code> 完全包含了 <code>'r</code>，引用有效，编译通过。</p>
<h2 id="生命周期不是程序员发明的">生命周期不是程序员”发明”的</h2>
<p>生命周期参数（<code>'a</code>、<code>'b</code> 这样的写法）不是 Rust 独有的概念，它实际上描述的是<strong>引用存在的那段时间</strong>——这段时间本来就存在，只是 Rust 让你在某些场合把它写出来，让编译器能够核验。</p>
<p>就像类型标注一样：变量有类型是客观事实，大多数时候编译器能推断，偶尔你需要写出来。生命周期也是如此——大多数时候编译器能推断（这叫”省略”），偶尔你需要手动标注。</p>
<h1 id="练习题">练习题</h1>
<h2 id="基础概念测验">基础概念测验</h2>
<div class="quiz-choice" data-block-id="11-lifetimes/01-what-are-lifetimes#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%80%E4%B9%88%E6%98%AF%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%EF%BC%88dangling%20reference%EF%BC%89%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%80%E4%B8%AA%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%22%2C%22%E4%B8%80%E4%B8%AA%E6%8C%87%E5%90%91%E5%A0%86%E5%86%85%E5%AD%98%E7%9A%84%E5%BC%95%E7%94%A8%22%2C%22%E4%B8%80%E4%B8%AA%E8%A2%AB%E5%A4%9A%E5%A4%84%E5%85%B1%E4%BA%AB%E7%9A%84%E5%BC%95%E7%94%A8%22%2C%22%E4%B8%80%E4%B8%AA%E6%8C%87%E5%90%91%E5%B7%B2%E7%BB%8F%E9%94%80%E6%AF%81%E7%9A%84%E6%95%B0%E6%8D%AE%E7%9A%84%E5%BC%95%E7%94%A8%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E6%98%AF%E6%8C%87%E5%BC%95%E7%94%A8%E6%89%80%E6%8C%87%E5%90%91%E7%9A%84%E6%95%B0%E6%8D%AE%E5%B7%B2%E7%BB%8F%E8%A2%AB%E9%94%80%E6%AF%81%EF%BC%88%E7%A6%BB%E5%BC%80%E4%BA%86%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%89%EF%BC%8C%E4%BD%86%E5%BC%95%E7%94%A8%E6%9C%AC%E8%BA%AB%E8%BF%98%E5%9C%A8%E8%A2%AB%E4%BD%BF%E7%94%A8%E3%80%82Rust%20%E7%9A%84%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E6%A3%80%E6%B5%8B%E5%B9%B6%E6%8B%92%E7%BB%9D%E6%89%80%E6%9C%89%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="11-lifetimes/01-what-are-lifetimes#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22Rust%20%E4%B8%AD%E7%9A%84%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%EF%BC%88borrow%20checker%EF%BC%89%E7%9A%84%E4%B8%BB%E8%A6%81%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%A3%80%E6%9F%A5%E5%8F%98%E9%87%8F%E6%98%AF%E5%90%A6%E8%A2%AB%E6%AD%A3%E7%A1%AE%E5%88%9D%E5%A7%8B%E5%8C%96%22%2C%22%E6%AF%94%E5%AF%B9%E5%BC%95%E7%94%A8%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E8%A2%AB%E5%BC%95%E7%94%A8%E6%95%B0%E6%8D%AE%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%8C%E7%A1%AE%E4%BF%9D%E5%BC%95%E7%94%A8%E4%B8%8D%E4%BC%9A%E6%8C%87%E5%90%91%E5%B7%B2%E9%94%80%E6%AF%81%E7%9A%84%E6%95%B0%E6%8D%AE%22%2C%22%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E6%9C%89%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F%22%2C%22%E6%A3%80%E6%9F%A5%E4%BB%A3%E7%A0%81%E4%B8%AD%E6%98%AF%E5%90%A6%E6%9C%89%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%E6%98%AF%20Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%E7%9A%84%E4%B8%80%E4%B8%AA%E7%BB%84%E4%BB%B6%EF%BC%8C%E4%B8%93%E9%97%A8%E8%B4%9F%E8%B4%A3%E5%88%86%E6%9E%90%E5%BC%95%E7%94%A8%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E3%80%82%E5%AE%83%E7%A1%AE%E4%BF%9D%E4%BB%BB%E4%BD%95%E5%BC%95%E7%94%A8%E9%83%BD%E4%B8%8D%E4%BC%9A%5C%22%E6%B4%BB%5C%22%E5%BE%97%E6%AF%94%E5%AE%83%E6%89%80%E6%8C%87%E5%90%91%E7%9A%84%E6%95%B0%E6%8D%AE%E6%9B%B4%E4%B9%85%EF%BC%8C%E4%BB%8E%E8%80%8C%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E5%BD%BB%E5%BA%95%E6%B6%88%E7%81%AD%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">fn main() {
    let r;
    {
        let x = 10;
        r = &amp;x;
    }
    println!("{}", r);
}</code></pre>
<div class="quiz-choice" data-block-id="11-lifetimes/01-what-are-lifetimes#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E7%9A%84%E7%BB%93%E6%9E%9C%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8C%E8%BE%93%E5%87%BA%2010%22%2C%22%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8C%E4%BD%86%E8%BF%90%E8%A1%8C%E6%97%B6%20panic%22%2C%22%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8C%E8%BE%93%E5%87%BA%E6%9C%AA%E5%AE%9A%E4%B9%89%E5%80%BC%22%2C%22%E4%B8%8D%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8Cx%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8D%E5%A4%9F%E9%95%BF%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E7%BC%96%E8%AF%91%E3%80%82x%20%E5%9C%A8%E5%86%85%E9%83%A8%20%7B%7D%20%E7%BB%93%E6%9D%9F%E6%97%B6%E5%B0%B1%E8%A2%AB%E9%94%80%E6%AF%81%E4%BA%86%EF%BC%8C%E4%BD%86%20r%20%E8%BF%98%E8%A6%81%E6%B4%BB%E5%88%B0%20println!%20%E9%82%A3%E8%A1%8C%E3%80%82%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%E5%8F%91%E7%8E%B0%20r%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E8%B6%85%E8%BF%87%E4%BA%86%20x%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%8C%E6%8A%A5%E9%94%99%20%5C%22%60x%60%20does%20not%20live%20long%20enough%5C%22%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="11-lifetimes/01-what-are-lifetimes#2:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E5%85%B3%E4%BA%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A3%80%E6%9F%A5%E5%8F%91%E7%94%9F%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%EF%BC%8C%E4%B8%8D%E5%BD%B1%E5%93%8D%E8%BF%90%E8%A1%8C%E6%97%B6%E6%80%A7%E8%83%BD%22%2C%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A0%87%E6%B3%A8%E4%BC%9A%E6%94%B9%E5%8F%98%E5%BC%95%E7%94%A8%E5%AE%9E%E9%99%85%E5%AD%98%E6%B4%BB%E7%9A%84%E6%97%B6%E9%97%B4%22%2C%22%E5%8F%AA%E6%9C%89%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E6%89%8D%E6%9C%89%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%2C%22%E5%A4%A7%E5%A4%9A%E6%95%B0%E6%83%85%E5%86%B5%E4%B8%8B%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E6%8E%A8%E6%96%AD%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%88%E6%97%A0%E9%9C%80%E6%89%8B%E5%8A%A8%E6%A0%87%E6%B3%A8%EF%BC%89%22%2C%22%E6%AF%8F%E4%B8%AA%E5%BC%95%E7%94%A8%E9%83%BD%E6%9C%89%E4%B8%80%E4%B8%AA%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%8C%E8%A1%A8%E7%A4%BA%E5%BC%95%E7%94%A8%E4%BF%9D%E6%8C%81%E6%9C%89%E6%95%88%E7%9A%84%E6%97%B6%E9%97%B4%E6%AE%B5%22%5D%2C%22correct%22%3A%5B0%2C3%2C4%5D%2C%22explanation%22%3A%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%98%AF%E5%BC%95%E7%94%A8%E4%BF%9D%E6%8C%81%E6%9C%89%E6%95%88%E7%9A%84%E6%97%B6%E9%97%B4%E6%AE%B5%EF%BC%8C%E8%BF%99%E6%98%AF%E5%AE%A2%E8%A7%82%E5%AD%98%E5%9C%A8%E7%9A%84%E3%80%82%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A0%87%E6%B3%A8%E5%8F%AA%E6%98%AF%E5%B8%AE%E5%8A%A9%E7%BC%96%E8%AF%91%E5%99%A8%E7%90%86%E8%A7%A3%E4%BD%A0%E7%9A%84%E6%84%8F%E5%9B%BE%EF%BC%8C%E4%B8%8D%E4%BC%9A%E6%94%B9%E5%8F%98%E5%AE%9E%E9%99%85%E7%9A%84%E5%AD%98%E6%B4%BB%E6%97%B6%E9%97%B4%E3%80%82Rust%20%E6%8F%90%E4%BE%9B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E7%9C%81%E7%95%A5%E8%A7%84%E5%88%99%EF%BC%8C%E8%AE%A9%E5%A4%A7%E5%A4%9A%E6%95%B0%E6%83%85%E5%86%B5%E4%B8%8D%E9%9C%80%E8%A6%81%E6%89%8B%E5%8A%A8%E6%A0%87%E6%B3%A8%E3%80%82%E6%89%80%E6%9C%89%E6%A3%80%E6%9F%A5%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E5%AE%8C%E6%88%90%EF%BC%8C%E9%9B%B6%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%80%E9%94%80%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="11-lifetimes/01-what-are-lifetimes#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E5%BC%95%E7%94%A8%20%60r%60%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%BA%20%60'r%60%EF%BC%8C%E8%A2%AB%E5%BC%95%E7%94%A8%E7%9A%84%E6%95%B0%E6%8D%AE%20%60x%60%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%BA%20%60'x%60%EF%BC%8C%E6%83%B3%E8%AE%A9%E4%BB%A3%E7%A0%81%E5%90%88%E6%B3%95%EF%BC%8C%E9%9C%80%E8%A6%81%E6%BB%A1%E8%B6%B3%E4%BB%80%E4%B9%88%E6%9D%A1%E4%BB%B6%EF%BC%9F%22%2C%22options%22%3A%5B%22%60'x%60%20%E5%BF%85%E9%A1%BB%E8%87%B3%E5%B0%91%E5%92%8C%20%60'r%60%20%E4%B8%80%E6%A0%B7%E9%95%BF%EF%BC%88%E5%8D%B3%20%60'x%60%20%E8%A6%86%E7%9B%96%20%60'r%60%20%E7%9A%84%E6%95%B4%E4%B8%AA%E8%8C%83%E5%9B%B4%EF%BC%89%22%2C%22%60'r%60%20%E5%92%8C%20%60'x%60%20%E5%BF%85%E9%A1%BB%E5%AE%8C%E5%85%A8%E7%9B%B8%E7%AD%89%22%2C%22%E6%B2%A1%E6%9C%89%E8%A6%81%E6%B1%82%EF%BC%8C%E5%8F%AA%E8%A6%81%E4%B8%8D%E7%94%A8%20unsafe%20%E9%83%BD%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%22%2C%22%60'r%60%20%E5%BF%85%E9%A1%BB%E6%AF%94%20%60'x%60%20%E6%9B%B4%E9%95%BF%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E8%A2%AB%E5%BC%95%E7%94%A8%E7%9A%84%E6%95%B0%E6%8D%AE%E5%BF%85%E9%A1%BB%E6%AF%94%E5%BC%95%E7%94%A8%E6%B4%BB%E5%BE%97%E6%9B%B4%E4%B9%85%E2%80%94%E2%80%94%E6%88%96%E8%80%85%E8%87%B3%E5%B0%91%E4%B8%80%E6%A0%B7%E4%B9%85%E3%80%82%E5%8F%AA%E8%A6%81%20%60'x%60%20%E8%A6%86%E7%9B%96%E4%BA%86%20%60'r%60%20%E7%9A%84%E6%95%B4%E4%B8%AA%E4%BD%BF%E7%94%A8%E8%8C%83%E5%9B%B4%EF%BC%8C%E5%BC%95%E7%94%A8%E5%B0%B1%E5%A7%8B%E7%BB%88%E6%9C%89%E6%95%88%E3%80%82%E8%BF%99%E5%B0%B1%E6%98%AF%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%E5%88%A4%E6%96%AD%E9%80%BB%E8%BE%91%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
