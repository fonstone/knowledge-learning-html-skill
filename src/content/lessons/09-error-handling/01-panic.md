---
chapterId: "09-error-handling"
lessonId: "01-panic"
title: "panic! 与不可恢复错误"
level: "入门"
duration: "15 分钟"
tags: [panic, 错误处理, backtrace, 不可恢复错误, "index out of bounds"]
number: "9.1"
chapterTitle: "错误处理"
chapterNumber: "09"
---
<div id="article-content"> <h1 id="错误的两种类型">错误的两种类型</h1>
<p>所有程序都会遇到错误——文件不存在、用户输入了非法数据、网络连接超时。Rust 把这些情况分成截然不同的两类，并用不同的机制分别处理：</p>
<img alt="error" src="/RustCourse/diagrams/error.svg" style="max-width:100%;margin:1rem 0;"/>
<ul>
<li>
<p><strong>不可恢复的错误（unrecoverable errors）</strong>：程序遭遇了”不应该发生”的状态，继续运行会带来更大的风险。最典型的例子是代码中的 bug——访问了数组越界位置、违反了程序的核心不变量。这类情况的正确处理是<strong>立即停止程序</strong>。</p>
</li>
<li>
<p><strong>可恢复的错误（recoverable errors）</strong>：错误在预期范围内，程序可以做出响应并继续。文件不存在 → 提示用户或创建文件；格式解析失败 → 报告给调用者处理。这类错误用 <code>Result&lt;T, E&gt;</code> 来处理，下一篇会详细讲解。</p>
</li>
</ul>
<p>本文聚焦第一类：<strong>不可恢复的错误</strong>和 <code>panic!</code> 宏。</p>
<h2 id="使用-panic-宏">使用 panic! 宏</h2>
<p><code>panic!</code> 宏用于”程序无法继续执行”的情况，调用后它会：</p>
<ol>
<li>打印一条错误信息</li>
<li>清理调用栈（默认行为，称为”展开”）</li>
<li>退出程序</li>
</ol>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20panic!(%22%E5%8F%91%E7%94%9F%E4%BA%86%E4%B8%8D%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E9%94%99%E8%AF%AF%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    panic!("发生了不可恢复的错误！");
}</code></pre></div>
<p>运行后会看到类似这样的输出：</p>
<pre><code class="language-text">thread 'main' panicked at '发生了不可恢复的错误！', src/main.rs:2:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace</code></pre>
<p>第一行告诉你：在哪个文件的哪一行触发了 panic，以及消息内容。第二行提示可以用 <code>RUST_BACKTRACE=1</code> 查看完整调用链。</p>
<h2 id="自动触发的-panic">自动触发的 panic</h2>
<p>很多时候 panic 不是手动调用的，而是 Rust 内部检测到非法操作时<strong>自动触发</strong>的。最常见的例子是访问越界索引：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20v%5B99%5D)%3B%20%20%2F%2F%20%E5%8F%AA%E6%9C%89%203%20%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%8Cindex%2099%20%E4%B8%8D%E5%AD%98%E5%9C%A8%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let v = vec![1, 2, 3];
    println!("{}", v[99]);  // 只有 3 个元素，index 99 不存在
}</code></pre></div>
<p>Rust 会 panic 并提示：</p>
<pre><code class="language-text">thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 99'</code></pre>
<p><strong>为什么 Rust 选择 panic 而不是返回垃圾值？</strong> 这是有意识的安全设计。C 语言中，越界访问会直接读取那块内存里碰巧在那儿的数据，这叫<strong>缓冲区溢出（buffer overread）</strong>，是大量安全漏洞的根源。Rust 宁可程序立即崩溃，也不允许读取不属于该数组的内存。</p>
<h2 id="用-backtrace-定位问题">用 backtrace 定位问题</h2>
<p>当 panic 发生在标准库内部时，错误信息指向的是标准库的源码，不是你的代码。这时候 <strong>backtrace（调用链追踪）</strong> 很有用。</p>
<p>设置环境变量 <code>RUST_BACKTRACE=1</code> 再运行，可以看到从程序入口到 panic 点的完整调用链：</p>
<pre><code class="language-bash">RUST_BACKTRACE=1 cargo run</code></pre>
<p>输出中每一行是一个<strong>栈帧</strong>（函数调用记录）。读 backtrace 的关键是<strong>从上往下找第一个写着你自己文件名的行</strong>——那就是问题的发源地。</p>
<p>对于上面的越界例子，backtrace 里会有一行类似：</p>
<pre><code class="language-text">12: panic_example::main
         at src/main.rs:3</code></pre>
<p>这告诉你：问题在 <code>src/main.rs</code> 的第 3 行，也就是 <code>v[99]</code> 那里。</p>
<blockquote>
<p><strong>注意</strong>：backtrace 需要程序以 debug 模式编译（不加 <code>--release</code>）。Release 模式下可能缺少调试符号，输出不够完整。</p>
</blockquote>
<h2 id="展开与终止panic-的两种行为">展开与终止：panic 的两种行为</h2>
<p>panic 触发后，Rust 默认的行为是<strong>展开（unwinding）</strong>：顺着调用栈往回走，逐个清理各函数的数据（调用析构函数、释放内存）。这保证资源正确释放，但有一定开销。</p>
<p>如果你追求更小的二进制文件，可以改为<strong>终止（abort）</strong>：直接退出进程，让操作系统回收内存。在 <code>Cargo.toml</code> 里配置：</p>
<pre><code class="language-toml">[profile.release]
panic = 'abort'</code></pre>
<p>这样 release 模式下 panic 时会直接终止，不展开调用栈。</p>
<blockquote>
<p>对于大多数应用来说，默认的展开行为就够用了。<code>panic = 'abort'</code> 主要用在两种场景：一是对二进制体积极度敏感的项目；二是嵌入式开发（<code>no_std</code> 环境），那里没有操作系统支持，调用栈展开的实现方式与具体芯片架构强绑定（ARM、RISC-V 等各不相同），通常直接 abort 更可靠。嵌入式场景还需要用 <code>#[panic_handler]</code> 自定义 panic 发生时的行为（比如让指示灯闪烁或复位芯片），但这属于嵌入式开发的专题内容。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="panic-基础测验">panic 基础测验</h2>
<pre><code class="language-rust">fn main() {
    let v = vec![1, 2, 3];
    let x = v[5];
    println!("{}", x);
}</code></pre>
<div class="quiz-choice" data-block-id="09-error-handling/01-panic#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%A8%8B%E5%BA%8F%20panic%EF%BC%8C%E6%8F%90%E7%A4%BA%20index%20out%20of%20bounds%22%2C%22%E6%89%93%E5%8D%B0%200%EF%BC%88%E9%BB%98%E8%AE%A4%E5%80%BC%EF%BC%89%22%2C%22%E6%89%93%E5%8D%B0%E9%9A%8F%E6%9C%BA%E5%86%85%E5%AD%98%E4%B8%AD%E7%9A%84%E5%80%BC%22%2C%22%E7%BC%96%E8%AF%91%E6%8A%A5%E9%94%99%EF%BC%8C%E6%97%A0%E6%B3%95%E8%BF%90%E8%A1%8C%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rust%20%E4%B8%8D%E5%85%81%E8%AE%B8%E8%B6%8A%E7%95%8C%E8%AE%BF%E9%97%AE%E3%80%82%60v%5B5%5D%60%20%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E8%A7%A6%E5%8F%91%20panic%EF%BC%8C%E7%A8%8B%E5%BA%8F%E7%AB%8B%E5%8D%B3%E9%80%80%E5%87%BA%EF%BC%8C%E4%B8%8D%E4%BC%9A%E6%89%93%E5%8D%B0%E4%BB%BB%E4%BD%95%E4%B8%9C%E8%A5%BF%E3%80%82%E8%BF%99%E6%98%AF%20Rust%20%E7%9A%84%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1%EF%BC%9A%E5%AE%81%E5%8F%AF%20panic%20%E4%B9%9F%E4%B8%8D%E8%AF%BB%E5%8F%96%E6%9C%AA%E7%9F%A5%E5%86%85%E5%AD%98%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="09-error-handling/01-panic#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22RUST_BACKTRACE%3D1%20%E7%9A%84%E4%B8%BB%E8%A6%81%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%AE%A9%E7%A8%8B%E5%BA%8F%E5%87%BA%E9%94%99%E6%97%B6%E4%B8%8D%20panic%EF%BC%8C%E6%94%B9%E4%B8%BA%E6%89%93%E5%8D%B0%E6%97%A5%E5%BF%97%22%2C%22%E8%AE%A9%20panic%20%E5%8F%98%E6%88%90%E4%B8%80%E4%B8%AA%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E9%94%99%E8%AF%AF%22%2C%22%E5%9C%A8%20panic%20%E6%97%B6%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E7%9A%84%E8%B0%83%E7%94%A8%E9%93%BE%EF%BC%8C%E5%B8%AE%E5%8A%A9%E5%AE%9A%E4%BD%8D%E9%97%AE%E9%A2%98%E6%9D%A5%E6%BA%90%22%2C%22%E8%AE%A9%E7%A8%8B%E5%BA%8F%E5%9C%A8%20release%20%E6%A8%A1%E5%BC%8F%E4%B8%8B%E4%B9%9F%E6%98%BE%E7%A4%BA%E8%B0%83%E8%AF%95%E4%BF%A1%E6%81%AF%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22RUST_BACKTRACE%3D1%20%E6%98%AF%E4%B8%80%E4%B8%AA%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%EF%BC%8C%E8%AE%BE%E7%BD%AE%E5%90%8E%E7%A8%8B%E5%BA%8F%20panic%20%E6%97%B6%E4%BC%9A%E9%A2%9D%E5%A4%96%E6%89%93%E5%8D%B0%E8%B0%83%E7%94%A8%E6%A0%88%EF%BC%88stack%20trace%EF%BC%89%EF%BC%8C%E5%B8%AE%E5%8A%A9%E4%BD%A0%E6%89%BE%E5%88%B0%E6%98%AF%E4%BB%8E%E5%93%AA%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E8%A7%A6%E5%8F%91%E4%BA%86%20panic%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="09-error-handling/01-panic#1:2" data-kind="single" data-payload="%7B%22question%22%3A%22panic!%20%E5%92%8C%E8%BF%94%E5%9B%9E%20Result%3A%3AErr%20%E7%9A%84%E6%A0%B9%E6%9C%AC%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%B2%A1%E6%9C%89%E5%8C%BA%E5%88%AB%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%BA%92%E6%8D%A2%E4%BD%BF%E7%94%A8%22%2C%22panic!%20%E4%BC%9A%E6%98%BE%E7%A4%BA%E6%9B%B4%E8%AF%A6%E7%BB%86%E7%9A%84%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF%22%2C%22panic!%20%E6%97%A0%E6%B3%95%E8%A2%AB%E8%B0%83%E7%94%A8%E8%80%85%E5%A4%84%E7%90%86%EF%BC%8C%E7%A8%8B%E5%BA%8F%E7%AB%8B%E5%8D%B3%E7%BB%88%E6%AD%A2%EF%BC%9B%E8%BF%94%E5%9B%9E%20Err%20%E5%88%99%E5%B0%86%E9%94%99%E8%AF%AF%E4%BC%A0%E9%80%92%E7%BB%99%E8%B0%83%E7%94%A8%E8%80%85%E5%A4%84%E7%90%86%22%2C%22panic!%20%E5%8F%AA%E8%83%BD%E7%94%A8%E5%9C%A8%20main%20%E5%87%BD%E6%95%B0%E9%87%8C%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22panic!%20%E6%98%AF%E4%B8%8D%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E2%80%94%E2%80%94%E4%B8%80%E6%97%A6%20panic%EF%BC%8C%E8%B0%83%E7%94%A8%E9%93%BE%E4%B8%8A%E7%9A%84%E4%BB%BB%E4%BD%95%E4%BB%A3%E7%A0%81%E9%83%BD%E6%97%A0%E6%B3%95%5C%22%E6%8E%A5%E4%BD%8F%5C%22%E8%BF%99%E4%B8%AA%E9%94%99%E8%AF%AF%E5%B9%B6%E7%BB%A7%E7%BB%AD%E3%80%82%E8%80%8C%E8%BF%94%E5%9B%9E%20Err%20%E6%98%AF%E5%A4%84%E7%90%86%E5%8F%AF%E6%81%A2%E5%A4%8D%E9%94%99%E8%AF%AF%E7%9A%84%E6%AD%A3%E5%B8%B8%E6%96%B9%E5%BC%8F%EF%BC%8C%E8%B0%83%E7%94%A8%E8%80%85%E6%94%B6%E5%88%B0%20Err%20%E5%90%8E%E5%8F%AF%E4%BB%A5%E9%80%89%E6%8B%A9%E5%A6%82%E4%BD%95%E5%BA%94%E5%AF%B9%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="09-error-handling/01-panic#1:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E6%83%85%E5%86%B5%E9%80%82%E5%90%88%E4%BD%BF%E7%94%A8%20panic!%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22%E5%9C%A8%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81%E4%B8%AD%EF%BC%8C%E6%9F%90%E4%B8%AA%E6%93%8D%E4%BD%9C%E5%A4%B1%E8%B4%A5%E4%BA%86%EF%BC%88%E6%B5%8B%E8%AF%95%E5%B0%B1%E5%BA%94%E8%AF%A5%E5%A4%B1%E8%B4%A5%EF%BC%89%22%2C%22%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E4%BA%86%E6%A0%BC%E5%BC%8F%E4%B8%8D%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%95%B0%E6%8D%AE%EF%BC%8C%E9%9C%80%E8%A6%81%E6%8F%90%E7%A4%BA%E9%87%8D%E6%96%B0%E8%BE%93%E5%85%A5%22%2C%22%E7%94%A8%20unwrap%20%E5%A4%84%E7%90%86%E4%B8%80%E4%B8%AA%E7%BB%8F%E8%BF%87%E9%80%BB%E8%BE%91%E9%AA%8C%E8%AF%81%E3%80%81%E4%B8%8D%E5%8F%AF%E8%83%BD%E6%98%AF%20Err%20%E7%9A%84%20Result%22%2C%22%E7%BD%91%E7%BB%9C%E8%BF%9E%E6%8E%A5%E8%B6%85%E6%97%B6%EF%BC%8C%E9%9C%80%E8%A6%81%E5%91%8A%E8%AF%89%E7%94%A8%E6%88%B7%E7%A8%8D%E5%90%8E%E9%87%8D%E8%AF%95%22%2C%22%E4%BB%A3%E7%A0%81%E6%A3%80%E6%B5%8B%E5%88%B0%E4%BA%86%E4%B8%80%E4%B8%AA%E6%9C%AC%E4%B8%8D%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%E7%9A%84%E7%8A%B6%E6%80%81%EF%BC%88%E4%BB%A3%E8%A1%A8%E5%AD%98%E5%9C%A8%20bug%EF%BC%89%22%5D%2C%22correct%22%3A%5B0%2C2%2C4%5D%2C%22explanation%22%3A%22panic!%20%E9%80%82%E5%90%88%5C%22%E8%BF%99%E4%B8%8D%E5%BA%94%E8%AF%A5%E5%8F%91%E7%94%9F%5C%22%E7%9A%84%E5%9C%BA%E6%99%AF%EF%BC%9A%E6%B5%8B%E8%AF%95%E4%B8%AD%E7%9A%84%E5%A4%B1%E8%B4%A5%E3%80%81%E4%BB%A3%E7%A0%81%20bug%E3%80%81%E8%BF%9D%E5%8F%8D%E7%A8%8B%E5%BA%8F%E4%B8%8D%E5%8F%98%E9%87%8F%E3%80%81%E4%BB%A5%E5%8F%8A%E4%BD%A0%E6%AF%94%E7%BC%96%E8%AF%91%E5%99%A8%E6%9B%B4%E6%B8%85%E6%A5%9A%E6%9F%90%E4%B8%AA%E5%80%BC%E4%B8%80%E5%AE%9A%E5%90%88%E6%B3%95%E7%9A%84%E6%83%85%E5%86%B5%E3%80%82%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E9%94%99%E8%AF%AF%E5%92%8C%E7%BD%91%E7%BB%9C%E8%B6%85%E6%97%B6%E6%98%AF%E5%8F%AF%E9%A2%84%E6%9C%9F%E7%9A%84%E3%80%81%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E9%94%99%E8%AF%AF%EF%BC%8C%E5%BA%94%E8%AF%A5%E7%94%A8%20Result%20%E5%A4%84%E7%90%86%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="09-error-handling/01-panic#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20Cargo.toml%20%E4%B8%AD%E8%AE%BE%E7%BD%AE%20panic%20%3D%20'abort'%20%E6%9C%89%E4%BB%80%E4%B9%88%E6%95%88%E6%9E%9C%EF%BC%9F%22%2C%22options%22%3A%5B%22panic%20%E6%97%B6%E7%9B%B4%E6%8E%A5%E7%BB%88%E6%AD%A2%E8%BF%9B%E7%A8%8B%EF%BC%8C%E4%B8%8D%E5%B1%95%E5%BC%80%E8%B0%83%E7%94%A8%E6%A0%88%E6%B8%85%E7%90%86%E8%B5%84%E6%BA%90%EF%BC%8C%E5%8F%AF%E5%87%8F%E5%B0%8F%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%BD%93%E7%A7%AF%22%2C%22panic%20%E6%97%B6%E7%9B%B4%E6%8E%A5%E6%89%93%E5%8D%B0%E9%94%99%E8%AF%AF%E5%B9%B6%E7%BB%A7%E7%BB%AD%E8%BF%90%E8%A1%8C%22%2C%22%E7%A6%81%E6%AD%A2%E5%9C%A8%E4%BB%A3%E7%A0%81%E4%B8%AD%E6%89%8B%E5%8A%A8%E8%B0%83%E7%94%A8%20panic!%22%2C%22%E7%A8%8B%E5%BA%8F%E6%B0%B8%E8%BF%9C%E4%B8%8D%E4%BC%9A%20panic%EF%BC%8C%E6%89%80%E6%9C%89%E9%94%99%E8%AF%AF%E9%83%BD%E8%BD%AC%E4%B8%BA%20Result%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22abort%20%E6%A8%A1%E5%BC%8F%E4%B8%8B%20panic%20%E4%BC%9A%E7%AB%8B%E5%88%BB%E6%9D%80%E6%AD%BB%E8%BF%9B%E7%A8%8B%EF%BC%8C%E4%B8%8D%E4%BC%9A%E9%80%90%E5%B8%A7%E6%B8%85%E7%90%86%E8%B0%83%E7%94%A8%E6%A0%88%E3%80%82%E8%BF%99%E6%A0%B7%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%96%87%E4%BB%B6%E6%9B%B4%E5%B0%8F%EF%BC%8C%E4%BD%86%E4%B9%9F%E6%84%8F%E5%91%B3%E7%9D%80%20Drop%20%E6%9E%90%E6%9E%84%E5%87%BD%E6%95%B0%E5%8F%AF%E8%83%BD%E4%B8%8D%E4%BC%9A%E8%A2%AB%E8%B0%83%E7%94%A8%E3%80%82%E9%80%9A%E5%B8%B8%E7%94%A8%E4%BA%8E%E5%B5%8C%E5%85%A5%E5%BC%8F%E6%88%96%E5%AF%B9%E4%BD%93%E7%A7%AF%E6%95%8F%E6%84%9F%E7%9A%84%E5%9C%BA%E6%99%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
