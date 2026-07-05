---
chapterId: "20-embedded"
lessonId: "01-no-std-basics"
title: "裸机开发基础：no_std 环境"
level: "进阶"
duration: "25 分钟"
tags: ["no_std", "裸机", "嵌入式", "core crate", "alloc crate"]
number: "20.1"
chapterTitle: "嵌入式 Rust"
chapterNumber: "20"
---

<div id="article-content"> <h1 id="裸机开发基础">裸机开发基础</h1>
<p>在传统的软件开发中，我们习惯于有操作系统（OS）的支持。操作系统为我们提供了文件系统、网络协议栈、内存管理（堆分配）以及标准库（<code>std</code>）。</p>
<p>但在嵌入式裸机（Bare-metal）开发中，这些都不存在。我们的代码直接运行在处理器上。为了让 Rust 在这种环境下运行，我们必须移除对操作系统的依赖。</p>
<h2 id="no_std-属性"><code>#[no_std]</code> 属性</h2>
<p>默认情况下，Rust 程序会链接标准库 <code>std</code>。<code>std</code> 内部依赖于操作系统的系统调用（如 <code>read</code>, <code>write</code>, <code>malloc</code> 等）。在裸机环境下，我们必须声明：</p>
<pre><code class="language-rust">#![no_std]</code></pre>
<p>这告诉编译器，我们不使用 <code>std</code> 库，转而只使用 <strong><code>core</code> 库</strong>。<code>core</code> 库是 <code>std</code> 的子集，它不依赖于任何硬件或操作系统特性，包含了基础的语言定义（如 <code>Option</code>, <code>Result</code>, 基础数值运算等）。</p>
<h3 id="std-vs-core-vs-alloc"><code>std</code> vs <code>core</code> vs <code>alloc</code></h3>
<ul>
<li><strong><code>core</code></strong>：最基础的逻辑，不涉及系统调用，不涉及堆内存。</li>
<li><strong><code>alloc</code></strong>：提供了堆内存分配相关的类型（如 <code>Vec</code>, <code>Box</code>, <code>String</code>），但需要你手动实现一个「堆分配器」。</li>
<li><strong><code>std</code></strong>：完整的标准库，包含了 <code>core</code> 和 <code>alloc</code> 的内容，并增加了系统交互（I/O 等）。</li>
</ul>
<h2 id="缺失的拼图panic-处理">缺失的拼图：Panic 处理</h2>
<p>由于没有标准库，Rust 遇到致命错误（Panic）时，不知道该如何处理（默认是打印到控制台并退出进程，但在裸机上没有控制台，也没有进程）。因此，我们必须手动定义一个 <strong>Panic 处理器</strong>。</p>
<p>我们需要引入一个提供该功能的 crate（如 <code>panic-halt</code>），或者手动编写：</p>
<pre><code class="language-rust">use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &amp;PanicInfo) -&gt; ! {
    // 这里可以是无限循环，或者是重启硬件
    loop {}
}</code></pre>
<p>注意返回类型是 <code>!</code>（发散类型），表示该函数永远不会返回。</p>
<h2 id="程序入口点entry">程序入口点：<code>#[entry]</code></h2>
<p>在普通程序中，入口是 <code>main</code> 函数，但它实际上是由操作系统在执行了一些初始化（Runtime runtime）后调用的。在裸机上，我们需要用特定的属性来标记程序的真正入口。</p>
<p>通常我们会使用 <code>cortex-m-rt</code> 等 crate 提供的 <code>#[entry]</code> 宏：</p>
<pre><code class="language-rust">#![no_std]
#![no_main] // 告知编译器我们没有标准的 main 函数

use cortex_m_rt::entry;

#[entry]
fn main() -&gt; ! {
    // 硬件初始化逻辑
    loop {
        // 应用程序主循环
    }
}</code></pre>
<h2 id="最小裸机程序模板">最小裸机程序模板</h2>
<p>让我们把这些拼凑起来，看一个完整的「极简」Rust 裸机工程文件：</p>
<pre><code class="language-rust">#![no_std]
#![no_main]

// 假设我们引入了 panic 处理 crate
use panic_halt as _;
use cortex_m_rt::entry;

#[entry]
fn main() -&gt; ! {
    let mut _counter = 0;

    loop {
        _counter += 1;
        // 在这里，没有 printf，你可能需要操作引脚让 LED 闪烁
    }
}</code></pre>
<h2 id="为什么没有-string-和-vec">为什么没有 <code>String</code> 和 <code>Vec</code>？</h2>
<p>在 <code>no_std</code> 环境下，你会发现原本常用的 <code>String</code> 或 <code>Vec&lt;u8&gt;</code> 无法直接编译。这是因为它们需要 <strong>动态堆内存分配（Heap）</strong>。</p>
<p>在嵌入式开发中，内存非常宝贵（可能只有几十 KB），程序通常使用 <strong>栈（Stack）</strong> 或 <strong>静态分配（Static）</strong>。</p>
<ul>
<li>如果你需要定长的缓冲区，使用数组：<code>let mut buffer = [0u8; 64];</code></li>
<li>如果非要用 <code>Vec</code>，你需要显式地配置一个「堆分配器」（Allocator），并使用 <code>alloc</code> crate。</li>
</ul>
<h1 id="练习题">练习题</h1>
<h2 id="核心概念测验">核心概念测验</h2>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%E5%9C%A8%E8%A3%B8%E6%9C%BA%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%BC%80%E5%8F%91%E4%B8%AD%E5%BF%85%E9%A1%BB%E4%BD%BF%E7%94%A8%20%60%23!%5Bno_std%5D%60%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E4%BB%A3%E7%A0%81%E8%BF%90%E8%A1%8C%E5%BE%97%E6%9B%B4%E5%BF%AB%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%20C%20%E8%AF%AD%E8%A8%80%E5%BA%93%E4%B8%8D%E6%94%AF%E6%8C%81%20Rust%20%E7%9A%84%E6%A0%87%E5%87%86%E5%BA%93%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%E6%A0%87%E5%87%86%E5%BA%93%20%60std%60%20%E4%BE%9D%E8%B5%96%E4%BA%8E%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%8F%90%E4%BE%9B%E7%9A%84%E7%B3%BB%E7%BB%9F%E8%B0%83%E7%94%A8%E5%92%8C%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%8A%82%E7%9C%81%E7%BC%96%E8%AF%91%E7%94%9F%E6%88%90%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%BD%93%E7%A7%AF%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%60std%60%20%E6%B7%B1%E5%BA%A6%E7%BB%91%E5%AE%9A%E4%BA%86%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%89%B9%E6%80%A7%EF%BC%88%E5%A6%82%E7%BA%BF%E7%A8%8B%E3%80%81%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%EF%BC%89%EF%BC%8C%E8%A3%B8%E6%9C%BA%E7%8E%AF%E5%A2%83%E4%B8%8B%E6%B2%A1%E6%9C%89%E4%BB%BB%E4%BD%95%20OS%20%E6%94%AF%E6%8C%81%EF%BC%8C%E5%9B%A0%E6%AD%A4%E5%BF%85%E9%A1%BB%E9%99%8D%E7%BA%A7%E5%88%B0%E5%8F%AA%E4%BE%9D%E8%B5%96%E7%A1%AC%E4%BB%B6%E6%97%A0%E5%85%B3%E7%89%B9%E6%80%A7%E7%9A%84%20%60core%60%20%E5%BA%93%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%60panic_handler%60%20%E5%87%BD%E6%95%B0%E7%9A%84%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E4%B8%BA%E4%BB%80%E4%B9%88%E5%BF%85%E9%A1%BB%E6%98%AF%20%60!%60%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%A1%A8%E7%A4%BA%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%E9%94%99%E8%AF%AF%E3%80%82%22%2C%22%E8%A1%A8%E7%A4%BA%E8%AF%A5%E5%87%BD%E6%95%B0%E6%98%AF%E3%80%8C%E5%8F%91%E6%95%A3%E3%80%8D%E7%9A%84%EF%BC%8C%E6%B0%B8%E8%BF%9C%E4%B8%8D%E4%BC%9A%E8%BF%94%E5%9B%9E%E3%80%82%22%2C%22%E8%A1%A8%E7%A4%BA%E5%87%BD%E6%95%B0%E4%BC%9A%E6%8A%9B%E5%87%BA%E5%BC%82%E5%B8%B8%E3%80%82%22%2C%22%E8%A1%A8%E7%A4%BA%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E6%98%AF%E6%9C%AA%E7%9F%A5%E7%9A%84%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Panic%20%E6%98%AF%E4%B8%8D%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E8%87%B4%E5%91%BD%E9%94%99%E8%AF%AF%E3%80%82%E5%9C%A8%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%8E%AF%E5%A2%83%E4%B8%8B%EF%BC%8C%E5%A4%84%E7%90%86%E5%99%A8%E5%B7%B2%E7%BB%8F%E6%97%A0%E6%B3%95%E7%BB%A7%E7%BB%AD%E6%89%A7%E8%A1%8C%E5%8E%9F%E5%AE%9A%E7%9A%84%E7%A8%8B%E5%BA%8F%E6%B5%81%EF%BC%8C%E5%9B%A0%E6%AD%A4%E5%A4%84%E7%90%86%E5%99%A8%E5%BF%85%E9%A1%BB%E8%BF%9B%E5%85%A5%E6%AD%BB%E5%BE%AA%E7%8E%AF%E6%88%96%E9%87%8D%E5%90%AF%EF%BC%8C%E5%87%BD%E6%95%B0%E7%BB%9D%E4%B8%8D%E8%83%BD%E8%BF%94%E5%9B%9E%E5%88%B0%E8%B0%83%E7%94%A8%E8%80%85%E6%89%8B%E4%B8%AD%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20%60no_std%60%20%E7%8E%AF%E5%A2%83%E4%B8%8B%EF%BC%8C%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%B8%AA%E7%B1%BB%E5%9E%8B%E6%98%AF%E4%B8%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%60Result%3C()%2C%20MyError%3E%60%22%2C%22%60%5Bu8%3B%2010%5D%60%22%2C%22%60Option%3Ci32%3E%60%22%2C%22%60String%60%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%60String%60%20%E6%98%AF%E5%AD%98%E5%82%A8%E5%9C%A8%E5%A0%86%E4%B8%8A%E7%9A%84%E5%8A%A8%E6%80%81%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%8C%E5%AE%83%E5%B1%9E%E4%BA%8E%20%60alloc%60%20%E5%BA%93%E3%80%82%E5%9C%A8%E6%B2%A1%E6%9C%89%E9%85%8D%E7%BD%AE%E5%A0%86%E5%88%86%E9%85%8D%E5%99%A8%E7%9A%84%E8%A3%B8%E6%9C%BA%E7%8E%AF%E5%A2%83%E4%B8%8B%EF%BC%8C%E5%8F%AA%E6%9C%89%E6%9D%A5%E8%87%AA%20%60core%60%20%E7%9A%84%E6%A0%88%E5%88%86%E9%85%8D%E5%92%8C%E9%9D%99%E6%80%81%E5%88%86%E9%85%8D%E7%B1%BB%E5%9E%8B%E5%8F%AF%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:3" data-kind="single" data-payload="%7B%22question%22%3A%22%60memory.x%60%20%E6%96%87%E4%BB%B6%E7%9A%84%E4%B8%BB%E8%A6%81%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%9A%E4%B9%89%E7%9B%AE%E6%A0%87%E8%8A%AF%E7%89%87%E7%9A%84%20FLASH%20%E5%92%8C%20RAM%20%E7%9A%84%E7%89%A9%E7%90%86%E5%9C%B0%E5%9D%80%E5%92%8C%E5%A4%A7%E5%B0%8F%E3%80%82%22%2C%22%E7%BC%96%E5%86%99%20C%20%E8%AF%AD%E8%A8%80%E7%9A%84%E5%85%BC%E5%AE%B9%E6%8E%A5%E5%8F%A3%E3%80%82%22%2C%22%E8%AE%B0%E5%BD%95%E8%8A%AF%E7%89%87%E7%9A%84%E5%8E%82%E5%95%86%E4%BF%A1%E6%81%AF%E3%80%82%22%2C%22%E9%85%8D%E7%BD%AE%E4%BB%A3%E7%A0%81%E7%9A%84%E7%BC%96%E8%AF%91%E4%BC%98%E5%8C%96%E7%AD%89%E7%BA%A7%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E7%BC%96%E8%AF%91%E5%99%A8%E5%92%8C%E9%93%BE%E6%8E%A5%E5%99%A8%E9%9C%80%E8%A6%81%E7%9F%A5%E9%81%93%E8%8A%AF%E7%89%87%E7%9A%84%E5%85%B7%E4%BD%93%E7%A1%AC%E4%BB%B6%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80%EF%BC%88%E5%93%AA%E4%B8%80%E9%83%A8%E5%88%86%E6%98%AF%E5%AD%98%E5%82%A8%E7%A8%8B%E5%BA%8F%E7%9A%84%EF%BC%8C%E5%93%AA%E4%B8%80%E9%83%A8%E5%88%86%E6%98%AF%E5%AD%98%E6%94%BE%E8%BF%90%E8%A1%8C%E6%95%B0%E6%8D%AE%E7%9A%84%EF%BC%89%EF%BC%8C%60memory.x%60%20%E6%98%AF%20Rust%20%E5%B5%8C%E5%85%A5%E5%BC%8F%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B%E4%B8%AD%E4%B8%8D%E5%8F%AF%E6%88%96%E7%BC%BA%E7%9A%84%E9%85%8D%E7%BD%AE%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22%60%23!%5Bno_main%5D%60%20%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%BC%BA%E5%88%B6%E7%A8%8B%E5%BA%8F%E4%BB%8E%E5%9C%B0%E5%9D%80%200%20%E5%BC%80%E5%A7%8B%E8%BF%90%E8%A1%8C%E3%80%82%22%2C%22%E8%A1%A8%E7%A4%BA%E8%AF%A5%E7%A8%8B%E5%BA%8F%E6%B2%A1%E6%9C%89%E9%80%BB%E8%BE%91%E3%80%82%22%2C%22%E5%91%8A%E8%AF%89%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%8D%E8%A6%81%E4%BD%BF%E7%94%A8%E6%A0%87%E5%87%86%E7%9A%84%E5%90%AF%E5%8A%A8%E6%B5%81%E7%A8%8B%EF%BC%8C%E5%9B%A0%E4%B8%BA%E5%BC%80%E5%8F%91%E8%80%85%E4%BC%9A%E6%89%8B%E5%8A%A8%E6%8C%87%E5%AE%9A%E5%85%A5%E5%8F%A3%E3%80%82%22%2C%22%E7%A6%81%E6%AD%A2%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%98%E5%8C%96%E4%B8%BB%E5%87%BD%E6%95%B0%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E6%A0%87%E5%87%86%20Rust%20%E7%A8%8B%E5%BA%8F%E4%BC%9A%E9%93%BE%E6%8E%A5%20C%20%E8%BF%90%E8%A1%8C%E5%BA%93%E5%B9%B6%E4%BB%8E%20%60main%60%20%E5%BC%80%E5%A7%8B%E3%80%82%E8%A3%B8%E6%9C%BA%E7%A8%8B%E5%BA%8F%E9%9C%80%E8%A6%81%E8%87%AA%E5%AE%9A%E4%B9%89%E5%90%AF%E5%8A%A8%E6%B5%81%E7%A8%8B%EF%BC%88Booting%EF%BC%89%EF%BC%8C%E5%9B%A0%E6%AD%A4%E7%A6%81%E7%94%A8%E9%BB%98%E8%AE%A4%E7%9A%84%20%60main%60%20%E6%9C%BA%E5%88%B6%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/01-no-std-basics#1:5" data-kind="single" data-payload="%7B%22question%22%3A%22%60core%60%20%E5%BA%93%E5%92%8C%20%60std%60%20%E5%BA%93%E7%9A%84%E5%85%B3%E7%B3%BB%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%60core%60%20%E5%8F%AA%E6%98%AF%E7%94%A8%E4%BA%8E%E6%B5%8B%E8%AF%95%E7%9A%84%E5%BA%93%E3%80%82%22%2C%22%60core%60%20%E4%BE%9D%E8%B5%96%E4%BA%8E%20%60std%60%E3%80%82%22%2C%22%60std%60%20%E5%8C%85%E5%90%AB%E4%BA%86%20%60core%60%EF%BC%8C%E8%80%8C%20%60core%60%20%E6%98%AF%E7%A1%AC%E4%BB%B6%2FOS%20%E6%97%A0%E5%85%B3%E7%9A%84%E7%B2%BE%E7%AE%80%E5%AD%90%E9%9B%86%E3%80%82%22%2C%22%E4%B8%A4%E8%80%85%E5%AE%8C%E5%85%A8%E7%8B%AC%E7%AB%8B%EF%BC%8C%E4%BA%92%E4%B8%8D%E7%9B%B8%E5%85%B3%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%60std%60%20%E5%AE%9E%E9%99%85%E4%B8%8A%E6%98%AF%E5%9C%A8%20%60core%60%20%E7%9A%84%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%A2%9E%E5%8A%A0%E4%BA%86%E9%92%88%E5%AF%B9%E7%89%B9%E5%AE%9A%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%9A%84%E6%8A%BD%E8%B1%A1%E5%B1%82%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
