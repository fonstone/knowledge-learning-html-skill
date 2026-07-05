---
chapterId: "16-debugging"
lessonId: "01-dbg-macro"
title: "dbg! 宏：快速打印调试"
level: "入门"
duration: "15 分钟"
tags: ["dbg!", 打印调试, 调试宏, stdout]
number: "16.1"
chapterTitle: "调试"
chapterNumber: "16"
---
<div id="article-content"> <h1 id="认识-dbg">认识 dbg!</h1>
<p><code>dbg!</code> 是 Rust 标准库内置的调试宏。和 <code>println!</code> 比起来，它有两大优势：</p>
<ol>
<li><strong>自动打印文件名、行号、表达式文本和值</strong>，不需要手写格式字符串</li>
<li><strong>返回表达式的值</strong>，可以嵌套在任意表达式中而不破坏逻辑</li>
</ol>
<p>一句话记忆：<code>dbg!</code> 就像给表达式加了个”临时监控探针”，随插随拔。</p>
<h2 id="基本用法">基本用法</h2>
<p>最简单的用法：把变量或表达式传给 <code>dbg!</code>。</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%20*%202%3B%0A%0A%20%20%20%20dbg!(x)%3B%20%20%20%20%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%20x%20%E7%9A%84%E5%80%BC%0A%20%20%20%20dbg!(y%20%2B%201)%3B%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E5%80%BC%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let x = 5;
    let y = x * 2;

    dbg!(x);       // 打印 x 的值
    dbg!(y + 1);   // 打印表达式的值
}</code></pre></div>
<p>输出结果：</p>
<pre><code class="language-text">[src/main.rs:4] x = 5
[src/main.rs:5] y + 1 = 11</code></pre>
<p>注意输出格式：<code>[文件名:行号] 表达式 = 值</code>。这比 <code>println!("x = {}", x)</code> 少打很多字，而且<strong>行号是自动的</strong>，不需要你记住在哪一行插的调试语句。</p>
<h2 id="dbg-会返回值">dbg! 会返回值</h2>
<p>这是 <code>dbg!</code> 最独特的特性：它不是吞掉值，而是<strong>把值的所有权返回出来</strong>。</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20dbg!%20%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E6%89%80%E4%BB%A5%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E5%9C%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F%E9%87%8C%E7%94%A8%0A%20%20%20%20let%20x%20%3D%20dbg!(5%20*%203)%20%2B%201%3B%20%20%2F%2F%20%E5%85%88%E6%89%93%E5%8D%B0%20%225%20*%203%20%3D%2015%22%EF%BC%8C%E5%86%8D%E7%94%A8%E8%BF%94%E5%9B%9E%E5%80%BC%2015%20%E5%8A%A0%201%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%20%20%20%20%20%2F%2F%20x%20%3D%2016%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    // dbg! 返回值，所以可以直接在表达式里用
    let x = dbg!(5 * 3) + 1;  // 先打印 "5 * 3 = 15"，再用返回值 15 加 1
    println!("x = {}", x);     // x = 16
}</code></pre></div>
<p>这意味着你可以把 <code>dbg!</code> 插入计算链的中间，不改变程序逻辑：</p>
<div class="code-runner" data-full-code="fn%20double(n%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20n%20*%202%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8E%9F%E6%9D%A5%E7%9A%84%E4%BB%A3%E7%A0%81%3A%20let%20result%20%3D%20double(double(3))%3B%0A%20%20%20%20%2F%2F%20%E5%8A%A0%E5%85%A5%E8%B0%83%E8%AF%95%3A%20%E6%9F%A5%E7%9C%8B%E4%B8%AD%E9%97%B4%E7%BB%93%E6%9E%9C%0A%20%20%20%20let%20result%20%3D%20double(dbg!(double(3)))%3B%0A%20%20%20%20println!(%22result%20%3D%20%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn double(n: i32) -&gt; i32 {
    n * 2
}

fn main() {
    // 原来的代码: let result = double(double(3));
    // 加入调试: 查看中间结果
    let result = double(dbg!(double(3)));
    println!("result = {}", result);
}</code></pre></div>
<p>输出：</p>
<pre><code class="language-text">[src/main.rs:8] double(3) = 6
result = 12</code></pre>
<h2 id="和-println-的对比">和 println! 的对比</h2>
<table><thead><tr><th>特性</th><th><code>println!</code></th><th><code>dbg!</code></th></tr></thead><tbody><tr><td>需要格式字符串</td><td>✓</td><td>✗（自动）</td></tr><tr><td>打印行号</td><td>✗（手动写）</td><td>✓（自动）</td></tr><tr><td>打印表达式文本</td><td>✗</td><td>✓（自动）</td></tr><tr><td>返回值</td><td>✗（返回 <code>()</code>）</td><td>✓（返回原值）</td></tr><tr><td>输出到</td><td>stdout</td><td><strong>stderr</strong></td></tr><tr><td>需要 <code>Display</code></td><td>✓</td><td>✗（只需 <code>Debug</code>）</td></tr></tbody></table>
<blockquote>
<p><strong>输出到 stderr</strong>：<code>dbg!</code> 的输出走 stderr，而 <code>println!</code> 走 stdout。这样在重定向程序输出时（<code>./app &gt; output.txt</code>），调试信息不会混入结果文件里。</p>
</blockquote>
<h2 id="需要-debug-trait">需要 Debug trait</h2>
<p><code>dbg!</code> 内部使用 <code>{:?}</code> 格式化，因此类型必须实现 <code>Debug</code> trait。基本类型、标准库类型都已实现。自定义类型加上 <code>#[derive(Debug)]</code> 即可：</p>
<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%20%20%2F%2F%20%E5%BF%85%E9%A1%BB%E5%8A%A0%E8%BF%99%E4%B8%AA%EF%BC%8C%E5%90%A6%E5%88%99%20dbg!%20%E6%8A%A5%E9%94%99%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%201.0%2C%20y%3A%202.5%20%7D%3B%0A%20%20%20%20dbg!(%26p)%3B%20%20%2F%2F%20%E5%80%9F%E7%94%A8%EF%BC%8C%E9%81%BF%E5%85%8D%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%0A%7D" data-mode="run"><pre><code class="language-rust">#[derive(Debug)]  // 必须加这个，否则 dbg! 报错
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 1.0, y: 2.5 };
    dbg!(&amp;p);  // 借用，避免所有权转移
}</code></pre></div>
<p>输出：</p>
<pre><code class="language-text">[src/main.rs:10] &amp;p = Point {
    x: 1.0,
    y: 2.5,
}</code></pre>
<p>注意这里传的是 <code>&amp;p</code>（引用）而不是 <code>p</code>。如果传 <code>p</code>，<code>dbg!</code> 会取得所有权并返回，后续就不能用 <code>p</code> 了。</p>
<h1 id="实战技巧">实战技巧</h1>
<h2 id="同时调试多个值">同时调试多个值</h2>
<p><code>dbg!</code> 支持多个参数，一次打印多个表达式：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%2010%3B%0A%20%20%20%20let%20b%20%3D%2020%3B%0A%20%20%20%20let%20c%20%3D%20a%20%2B%20b%3B%0A%0A%20%20%20%20dbg!(a%2C%20b%2C%20c)%3B%20%20%2F%2F%20%E4%B8%89%E4%B8%AA%E5%80%BC%E4%B8%80%E8%B5%B7%E6%89%93%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let a = 10;
    let b = 20;
    let c = a + b;

    dbg!(a, b, c);  // 三个值一起打
}</code></pre></div>
<p>输出：</p>
<pre><code class="language-text">[src/main.rs:6] a = 10
[src/main.rs:6] b = 20
[src/main.rs:6] c = 30</code></pre>
<h2 id="在循环中调试">在循环中调试</h2>
<p>在循环体里用 <code>dbg!</code> 可以追踪每次迭代的中间状态：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20sum%20%3D%200%3B%0A%20%20%20%20for%20i%20in%201..%3D5%20%7B%0A%20%20%20%20%20%20%20%20sum%20%2B%3D%20i%3B%0A%20%20%20%20%20%20%20%20dbg!(i%2C%20sum)%3B%20%20%2F%2F%20%E8%BF%BD%E8%B8%AA%E6%AF%8F%E8%BD%AE%20i%20%E5%92%8C%E7%B4%AF%E5%8A%A0%E7%BB%93%E6%9E%9C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let mut sum = 0;
    for i in 1..=5 {
        sum += i;
        dbg!(i, sum);  // 追踪每轮 i 和累加结果
    }
}</code></pre></div>
<h2 id="在-ifmatch-条件中调试">在 if/match 条件中调试</h2>
<p>有时你想知道某个条件判断里的值是什么，<code>dbg!</code> 可以不破坏条件逻辑地插入：</p>
<div class="code-runner" data-full-code="fn%20classify(n%3A%20i32)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20if%20dbg!(n)%20%3E%200%20%7B%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%20n%EF%BC%8C%E5%B9%B6%E6%8A%8A%20n%20%E7%9A%84%E5%80%BC%E8%BF%94%E5%9B%9E%E7%BB%99%20if%20%E4%BD%BF%E7%94%A8%0A%20%20%20%20%20%20%20%20%22%E6%AD%A3%E6%95%B0%22%0A%20%20%20%20%7D%20else%20if%20n%20%3C%200%20%7B%0A%20%20%20%20%20%20%20%20%22%E8%B4%9F%E6%95%B0%22%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%22%E9%9B%B6%22%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify(42))%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify(-5))%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn classify(n: i32) -&gt; &amp;'static str {
    if dbg!(n) &gt; 0 {   // 打印 n，并把 n 的值返回给 if 使用
        "正数"
    } else if n &lt; 0 {
        "负数"
    } else {
        "零"
    }
}

fn main() {
    println!("{}", classify(42));
    println!("{}", classify(-5));
}</code></pre></div>
<h2 id="release-模式下的行为">release 模式下的行为</h2>
<p><code>dbg!</code> 在 <strong>release 模式</strong>（<code>cargo build --release</code>）下仍然会输出，不会自动消除。</p>
<p>如果想让调试代码只在开发时生效，有两种方式：</p>
<p><strong>方式一：手动删除</strong>（最简单，调试完就清理）</p>
<p><strong>方式二：使用条件编译</strong></p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E5%9C%A8%20debug%20%E6%A8%A1%E5%BC%8F%E4%B8%8B%E6%89%A7%E8%A1%8C%0A%20%20%20%20%23%5Bcfg(debug_assertions)%5D%0A%20%20%20%20dbg!(x)%3B%0A%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let x = 42;

    // 只在 debug 模式下执行
    #[cfg(debug_assertions)]
    dbg!(x);

    println!("x = {}", x);
}</code></pre></div>
<blockquote>
<p><strong>最佳实践</strong>：<code>dbg!</code> 是临时调试工具，调试完成后应该<strong>删掉</strong>，不要提交到版本库。把它当便利贴用，用完撕掉。</p>
</blockquote>
<h2 id="无参数用法">无参数用法</h2>
<p><code>dbg!()</code> 不传参数时，只打印文件名和行号——相当于一个”我执行到这里了”的标记：</p>
<div class="code-runner" data-full-code="fn%20process(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20dbg!()%3B%20%20%2F%2F%20%E7%A1%AE%E8%AE%A4%E5%87%BD%E6%95%B0%E8%A2%AB%E8%B0%83%E7%94%A8%E4%BA%86%0A%20%20%20%20if%20x%20%3E%200%20%7B%0A%20%20%20%20%20%20%20%20dbg!()%3B%20%20%2F%2F%20%E7%A1%AE%E8%AE%A4%E8%B5%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E5%88%86%E6%94%AF%0A%20%20%20%20%20%20%20%20x%20*%202%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20x%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20process(5)%3B%0A%20%20%20%20process(-1)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn process(x: i32) -&gt; i32 {
    dbg!();  // 确认函数被调用了
    if x &gt; 0 {
        dbg!();  // 确认走了这个分支
        x * 2
    } else {
        x
    }
}

fn main() {
    process(5);
    process(-1);
}</code></pre></div>
<h1 id="练习题">练习题</h1>
<h2 id="dbg-基础测验">dbg! 基础测验</h2>
<pre><code class="language-rust">fn square(n: i32) -&gt; i32 {
    n * n
}

fn main() {
    let result = square(dbg!(3 + 1));
    println!("{}", result);
}</code></pre>
<div class="quiz-choice" data-block-id="16-debugging/01-dbg-macro#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%60dbg!(3%20%2B%201)%60%20%E4%BC%9A%E6%89%93%E5%8D%B0%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BB%80%E4%B9%88%E9%83%BD%E4%B8%8D%E6%89%93%E5%8D%B0%22%2C%22%60%5Bsrc%2Fmain.rs%3A5%5D%203%20%2B%201%20%3D%204%60%22%2C%22%60%5Bmain.rs%3A5%5D%203%20%2B%201%20%3D%207%60%22%2C%22%603%20%2B%201%20%3D%204%60%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22dbg!%20%E7%9A%84%E8%BE%93%E5%87%BA%E6%A0%BC%E5%BC%8F%E6%98%AF%20%60%5B%E6%96%87%E4%BB%B6%E5%90%8D%3A%E8%A1%8C%E5%8F%B7%5D%20%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%96%87%E6%9C%AC%20%3D%20%E5%80%BC%60%E3%80%82%603%20%2B%201%60%20%E7%9A%84%E7%BB%93%E6%9E%9C%E6%98%AF%204%EF%BC%8C%E4%B8%8D%E6%98%AF%207%E3%80%82%E8%BE%93%E5%87%BA%E4%BC%9A%E5%8C%85%E5%90%AB%E6%96%87%E4%BB%B6%E5%90%8D%E5%92%8C%E8%A1%8C%E5%8F%B7%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/01-dbg-macro#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%60dbg!(x)%60%20%E5%92%8C%20%60println!(%5C%22%7B%3A%3F%7D%5C%22%2C%20x)%60%20%E6%9C%80%E4%B8%BB%E8%A6%81%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22dbg!%20%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E6%95%B0%E5%AD%97%E7%B1%BB%E5%9E%8B%22%2C%22dbg!%20%E4%BC%9A%E8%BF%94%E5%9B%9E%20x%20%E7%9A%84%E5%80%BC%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%B5%8C%E5%A5%97%E5%9C%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD%E4%BD%BF%E7%94%A8%22%2C%22println!%20%E6%97%A0%E6%B3%95%E6%89%93%E5%8D%B0%E5%A4%8D%E6%9D%82%E7%B1%BB%E5%9E%8B%22%2C%22dbg!%20%E5%8F%AA%E5%9C%A8%20release%20%E6%A8%A1%E5%BC%8F%E4%B8%8B%E6%9C%89%E6%95%88%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22dbg!%20%E6%9C%80%E5%A4%A7%E7%9A%84%E7%89%B9%E7%82%B9%E6%98%AF%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%88%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%89%EF%BC%8C%E6%89%80%E4%BB%A5%E5%8F%AF%E4%BB%A5%E6%8F%92%E5%85%A5%E4%BB%BB%E4%BD%95%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD%E8%80%8C%E4%B8%8D%E6%94%B9%E5%8F%98%E7%A8%8B%E5%BA%8F%E9%80%BB%E8%BE%91%E3%80%82println!%20%E8%BF%94%E5%9B%9E%20()%EF%BC%8C%E6%97%A0%E6%B3%95%E5%B5%8C%E5%A5%97%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/01-dbg-macro#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22dbg!%20%E7%9A%84%E8%BE%93%E5%87%BA%E5%86%99%E5%85%A5%E5%93%AA%E9%87%8C%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%A0%87%E5%87%86%E9%94%99%E8%AF%AF%EF%BC%88stderr%EF%BC%89%22%2C%22%E7%B3%BB%E7%BB%9F%E6%97%A5%E5%BF%97%22%2C%22%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6%22%2C%22%E6%A0%87%E5%87%86%E8%BE%93%E5%87%BA%EF%BC%88stdout%EF%BC%89%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22dbg!%20%E8%BE%93%E5%87%BA%E5%88%B0%20stderr%EF%BC%8C%E8%BF%99%E6%A0%B7%E5%9C%A8%E9%87%8D%E5%AE%9A%E5%90%91%20stdout%20%E6%97%B6%E4%B8%8D%E4%BC%9A%E6%B7%B7%E5%85%A5%E8%B0%83%E8%AF%95%E4%BF%A1%E6%81%AF%EF%BC%8C%E9%80%82%E5%90%88%E5%9C%A8%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7%E4%B8%AD%E4%BD%BF%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/01-dbg-macro#2:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E6%83%85%E5%86%B5%E9%80%82%E5%90%88%E4%BD%BF%E7%94%A8%20dbg!%20%E8%80%8C%E4%B8%8D%E6%98%AF%20println!%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%B0%83%E8%AF%95%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8%E4%B8%AD%E6%9F%90%E4%B8%80%E6%AD%A5%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC%22%2C%22%E6%83%B3%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E4%B8%80%E4%B8%AA%E4%B8%AD%E9%97%B4%E8%AE%A1%E7%AE%97%E7%BB%93%E6%9E%9C%22%2C%22%E5%9C%A8%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E8%AE%B0%E5%BD%95%E8%BF%90%E8%A1%8C%E6%97%A5%E5%BF%97%22%2C%22%E5%90%91%E7%94%A8%E6%88%B7%E6%98%BE%E7%A4%BA%E7%A8%8B%E5%BA%8F%E7%8A%B6%E6%80%81%22%2C%22%E9%9C%80%E8%A6%81%E7%9F%A5%E9%81%93%E4%BB%A3%E7%A0%81%E8%B5%B0%E5%88%B0%E4%BA%86%E5%93%AA%E4%B8%80%E8%A1%8C%22%5D%2C%22correct%22%3A%5B0%2C1%2C4%5D%2C%22explanation%22%3A%22dbg!%20%E6%98%AF%E4%B8%B4%E6%97%B6%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%EF%BC%8C%E9%80%82%E5%90%88%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E5%80%BC%E5%92%8C%E8%BF%BD%E8%B8%AA%E6%89%A7%E8%A1%8C%E8%B7%AF%E5%BE%84%E3%80%82%E7%94%9F%E4%BA%A7%E6%97%A5%E5%BF%97%E5%92%8C%E7%94%A8%E6%88%B7%E8%BE%93%E5%87%BA%E5%BA%94%E8%AF%A5%E7%94%A8%20log%20%E5%BA%93%E5%92%8C%20println!%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/01-dbg-macro#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%AF%B9%E4%BA%8E%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%93%E6%9E%84%E4%BD%93%EF%BC%8C%E4%BD%BF%E7%94%A8%20dbg!%20%E7%9A%84%E5%89%8D%E6%8F%90%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8D%E9%9C%80%E8%A6%81%E4%BB%BB%E4%BD%95%E5%89%8D%E6%8F%90%22%2C%22%E5%AE%9E%E7%8E%B0%20Clone%20trait%22%2C%22%E5%AE%9E%E7%8E%B0%20Debug%20trait%EF%BC%88%E9%80%9A%E5%B8%B8%E7%94%A8%20%23%5Bderive(Debug)%5D%EF%BC%89%22%2C%22%E5%AE%9E%E7%8E%B0%20Display%20trait%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22dbg!%20%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%20%7B%3A%3F%7D%20%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%8C%E4%BE%9D%E8%B5%96%20Debug%20trait%E3%80%82%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B%E5%B7%B2%E5%86%85%E7%BD%AE%E5%AE%9E%E7%8E%B0%EF%BC%8C%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%9E%8B%E9%9C%80%E8%A6%81%E6%89%8B%E5%8A%A8%E6%B4%BE%E7%94%9F%20%23%5Bderive(Debug)%5D%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
