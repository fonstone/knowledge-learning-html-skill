---
chapterId: "20-embedded"
lessonId: "02-memory-layout"
title: "内存布局与链接脚本"
level: "进阶"
duration: "30 分钟"
tags: ["内存布局", "链接脚本", "linker.x", "内存映射"]
number: "20.2"
chapterTitle: "嵌入式 Rust"
chapterNumber: "20"
---

<div id="article-content"> <h1 id="内存布局与链接脚本">内存布局与链接脚本</h1>
<p>在嵌入式开发中，你必须比在 PC 开发时更清楚代码和数据被放在了哪里。嵌入式芯片的存储空间通常是由不连续的地址块组成的。</p>
<h2 id="1-嵌入式内存映射">1. 嵌入式内存映射</h2>
<p>典型的 32 位微控制器（如 STM32）的内存地址空间如下：</p>
<ul>
<li><strong><code>0x0800_0000</code> (FLASH)</strong>：代码指令和只读常量。断电后不会丢失。</li>
<li><strong><code>0x2000_0000</code> (RAM)</strong>：运行时变量、堆栈（Stack）和堆（Heap）。速度极快，但断电即失。</li>
<li><strong><code>0x4000_0000</code> (外设寄存器)</strong>：映射到特定的地址，用于控制 GPIO、UART 等硬件。</li>
</ul>
<h2 id="2-链接脚本的作用">2. 链接脚本的作用</h2>
<p>编译器（rustc）生成的代码只是逻辑上的指令，它并不知道你的具体芯片有多少 Flash 或 RAM。</p>
<p><strong>链接脚本 (Linker Script)</strong> 的任务是：</p>
<ol>
<li><strong>定义物理边界</strong>：告诉链接器「这里有 128KB Flash，从 0x08000000 开始」。</li>
<li><strong>分配段 (Sections)</strong>：告诉链接器「把所有指令放到 FLASH 中，把变量放到 RAM 中」。</li>
</ol>
<h2 id="3-rust-中的-memoryx">3. Rust 中的 <code>memory.x</code></h2>
<p>在 Rust 嵌入式生态（尤其是 Cortex-M）中，我们通常不需要编写复杂的 GNU Linker 脚本，只需要在一个简单的 <code>memory.x</code> 文件中定义内存区域：</p>
<pre><code class="language-text">/* memory.x */
MEMORY
{
  /* 我们可以存放代码和常量的地方 */
  FLASH : ORIGIN = 0x08000000, LENGTH = 128K

  /* 我们可以存放变量和堆栈的地方 */
  RAM   : ORIGIN = 0x20000000, LENGTH = 20K
}</code></pre>
<h2 id="4-程序段-program-sections">4. 程序段 (Program Sections)</h2>
<p>链接器会根据 <code>memory.x</code> 将代码分成不同的「段」：</p>
<h3 id="text-代码段"><code>.text</code> (代码段)</h3>
<p>存放所有的可执行机器指令。</p>
<ul>
<li><strong>位置</strong>：FLASH。</li>
<li><strong>特点</strong>：只读。</li>
</ul>
<h3 id="rodata-只读数据段"><code>.rodata</code> (只读数据段)</h3>
<p>存放常量。</p>
<ul>
<li><strong>位置</strong>：FLASH。</li>
<li><strong>示例</strong>：<code>static MESSAGE: &amp;str = "Hello";</code> 中的字符串。</li>
</ul>
<h3 id="data-已初始化变量段"><code>.data</code> (已初始化变量段)</h3>
<p>存放初始值不为零的全局变量。</p>
<ul>
<li><strong>挑战</strong>：这些变量需要能读写（在 RAM），但初始值必须保存在断电不丢失的地方（在 FLASH）。</li>
<li><strong>处理</strong>：运行时入口（<code>cortex-m-rt</code>）会在启动时自动将这些值从 FLASH 拷贝到 RAM。</li>
</ul>
<h3 id="bss-未初始化变量段"><code>.bss</code> (未初始化变量段)</h3>
<p>存放初始值为零的全局变量。</p>
<ul>
<li><strong>处理</strong>：不需要在 FLASH 中存储初始值，启动时直接在 RAM 中清零即可。</li>
</ul>
<h2 id="5-堆栈-stack--heap">5. 堆栈 (Stack &amp; Heap)</h2>
<ul>
<li><strong>栈 (Stack)</strong>：用于局部变量和函数调用信息。在 Rust 嵌入式中，栈通常从 RAM 的末尾开始，向下增长。</li>
<li><strong>堆 (Heap)</strong>：如果你在 <code>no_std</code> 下使用了 <code>alloc</code> 库，你需要手动定义一块 RAM 区域作为堆。</li>
</ul>
<h2 id="6-lma-与-vma">6. LMA 与 VMA</h2>
<p>这是链接脚本中最容易混淆的概念：</p>
<ul>
<li><strong>LMA (Load Memory Address)</strong>：加载地址。即程序烧录进芯片时，数据所在的物理位置（通常是 FLASH）。</li>
<li><strong>VMA (Virtual Memory Address)</strong>：运行地址。即程序运行时，数据应该被 CPU 访问的地址（对于变量来说，是 RAM）。</li>
</ul>
<h1 id="练习题">练习题</h1>
<h2 id="核心概念测验">核心概念测验</h2>
<div class="quiz-choice" data-block-id="20-embedded/02-memory-layout#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%EF%BC%88.data%20%E6%AE%B5%EF%BC%89%E5%9C%A8%E9%93%BE%E6%8E%A5%E8%84%9A%E6%9C%AC%E4%B8%AD%E9%9C%80%E8%A6%81%E4%B8%A4%E4%B8%AA%E5%9C%B0%E5%9D%80%EF%BC%88LMA%20%E5%92%8C%20VMA%EF%BC%89%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%BA%E4%BA%86%E5%A4%87%E4%BB%BD%E6%95%B0%E6%8D%AE%EF%BC%8C%E9%98%B2%E6%AD%A2%E6%8D%9F%E5%9D%8F%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%E4%B8%80%E4%B8%AA%E5%9C%B0%E5%9D%80%E5%AD%98%E6%94%BE%E5%8F%98%E9%87%8F%E5%90%8D%EF%BC%8C%E4%B8%80%E4%B8%AA%E5%9C%B0%E5%9D%80%E5%AD%98%E6%94%BE%E6%95%B0%E5%80%BC%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%E5%8F%98%E9%87%8F%E7%9A%84%E5%88%9D%E5%A7%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E4%BF%9D%E5%AD%98%E5%9C%A8%E7%A6%BB%E7%BA%BF%E4%B8%8D%E4%B8%A2%E5%A4%B1%E7%9A%84%20FLASH%20%E4%B8%AD%EF%BC%8C%E4%BD%86%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BF%85%E9%A1%BB%E4%BD%8D%E4%BA%8E%E5%8F%AF%E8%AF%BB%E5%86%99%E7%9A%84%20RAM%20%E4%B8%AD%E3%80%82%22%2C%22%E8%BF%99%E6%98%AF%E4%B8%BA%E4%BA%86%E5%90%91%E5%90%8E%E5%85%BC%E5%AE%B9%20C%20%E8%AF%AD%E8%A8%80%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%E5%A6%82%20%60static%20mut%20X%3A%20i32%20%3D%2042%3B%60%EF%BC%8C%E9%82%A3%E4%B8%AA%20%6042%60%20%E5%BF%85%E9%A1%BB%E7%83%A7%E5%BD%95%E5%9C%A8%20FLASH%20%E9%87%8C%EF%BC%88LMA%EF%BC%89%EF%BC%8C%E4%BD%86%E5%9C%A8%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E4%BF%AE%E6%94%B9%20X%20%E6%97%B6%EF%BC%8CCPU%20%E5%BF%85%E9%A1%BB%E5%8E%BB%20RAM%20%E9%87%8C%E6%93%8D%E4%BD%9C%EF%BC%88VMA%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/02-memory-layout#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E4%BD%A0%E7%9A%84%E7%A8%8B%E5%BA%8F%E4%BD%93%E7%A7%AF%E8%B6%85%E8%BF%87%E4%BA%86%20%60memory.x%60%20%E4%B8%AD%E5%AE%9A%E4%B9%89%E7%9A%84%20FLASH%20%E9%95%BF%E5%BA%A6%EF%BC%8C%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E9%93%BE%E6%8E%A5%E8%BF%87%E7%A8%8B%E6%8A%A5%E9%94%99%EF%BC%8C%E6%97%A0%E6%B3%95%E7%94%9F%E6%88%90%E6%9C%80%E7%BB%88%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E5%8F%98%E6%85%A2%E3%80%82%22%2C%22%E5%A4%9A%E5%87%BA%E7%9A%84%E9%83%A8%E5%88%86%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%AD%98%E5%85%A5%20RAM%E3%80%82%22%2C%22%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%8E%8B%E7%BC%A9%E4%BB%A3%E7%A0%81%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E9%93%BE%E6%8E%A5%E5%99%A8%E4%BC%9A%E4%B8%A5%E6%A0%BC%E6%A3%80%E6%9F%A5%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80%E8%BE%B9%E7%95%8C%E3%80%82%E6%BA%A2%E5%87%BA%E4%BC%9A%E5%AF%BC%E8%87%B4%E9%93%BE%E6%8E%A5%E5%A4%B1%E8%B4%A5%EF%BC%8C%E7%A1%AE%E4%BF%9D%E4%BD%A0%E4%B8%8D%E4%BC%9A%E5%B0%86%E4%BB%A3%E7%A0%81%E7%83%A7%E5%BD%95%E5%88%B0%E4%B8%8D%E5%AD%98%E5%9C%A8%E7%9A%84%E7%A1%AC%E4%BB%B6%E5%8C%BA%E5%9F%9F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/02-memory-layout#1:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E5%86%85%E5%AE%B9%E9%80%9A%E5%B8%B8%E4%BC%9A%E8%A2%AB%E5%AD%98%E6%94%BE%E5%9C%A8%20FLASH%20%E5%8C%BA%E5%9F%9F%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E8%AF%BB%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%B8%B8%E9%87%8F%20(.rodata)%22%2C%22%E7%A1%AC%E4%BB%B6%E4%B8%AD%E6%96%AD%E5%90%91%E9%87%8F%E8%A1%A8%20(Vector%20Table)%22%2C%22%E7%A8%8B%E5%BA%8F%E6%9C%BA%E5%99%A8%E7%A0%81%20(.text)%22%2C%22%E5%87%BD%E6%95%B0%E5%86%85%E7%9A%84%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%22%5D%2C%22correct%22%3A%5B0%2C1%2C2%5D%2C%22explanation%22%3A%22%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E5%AD%98%E6%94%BE%E5%9C%A8%E6%A0%88%EF%BC%88Stack%EF%BC%89%E4%B8%AD%EF%BC%8C%E4%BD%8D%E4%BA%8E%20RAM%20%E5%8C%BA%E5%9F%9F%EF%BC%8C%E5%9B%A0%E4%B8%BA%E5%AE%83%E4%BB%AC%E9%9C%80%E8%A6%81%E9%A2%91%E7%B9%81%E4%BF%AE%E6%94%B9%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/02-memory-layout#1:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20Rust%20%E5%B5%8C%E5%85%A5%E5%BC%8F%E9%A1%B9%E7%9B%AE%E4%B8%AD%EF%BC%8C%E8%B0%81%E8%B4%9F%E8%B4%A3%E5%B0%86%20%60.data%60%20%E6%AE%B5%E4%BB%8E%20FLASH%20%E6%8B%B7%E8%B4%9D%E5%88%B0%20RAM%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E3%80%82%22%2C%22%E7%A1%AC%E4%BB%B6%20CPU%20%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E3%80%82%22%2C%22%E5%B5%8C%E5%85%A5%E5%BC%8F%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BA%93%EF%BC%88%E5%A6%82%20%60cortex-m-rt%60%EF%BC%89%E5%9C%A8%20%60main%60%20%E5%90%AF%E5%8A%A8%E5%89%8D%E7%9A%84%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BB%A3%E7%A0%81%E3%80%82%22%2C%22Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%20(rustc)%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%9C%A8%20%60%23%5Bentry%5D%60%20%E6%A0%87%E8%AE%B0%E7%9A%84%E5%87%BD%E6%95%B0%E8%BF%90%E8%A1%8C%E4%B9%8B%E5%89%8D%EF%BC%8C%60rt%60%20%E5%BA%93%E4%BC%9A%E6%89%A7%E8%A1%8C%E4%B8%80%E5%B0%8F%E6%AE%B5%E6%B1%87%E7%BC%96%E6%88%96%E7%B2%BE%E7%AE%80%E7%9A%84%E5%BA%95%E5%B1%82%E4%BB%A3%E7%A0%81%EF%BC%8C%E6%89%8B%E5%8A%A8%E5%AE%8C%E6%88%90%E5%86%85%E5%AD%98%E7%9A%84%E3%80%8C%E6%90%AC%E8%BF%90%E3%80%8D%E5%92%8C%E3%80%8C%E6%B8%85%E9%9B%B6%E3%80%8D%E5%B7%A5%E4%BD%9C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/02-memory-layout#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%A0%88%EF%BC%88Stack%EF%BC%89%E6%BA%A2%E5%87%BA%E5%9C%A8%E5%B5%8C%E5%85%A5%E5%BC%8F%E4%B8%AD%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9D%9E%E5%B8%B8%E5%8D%B1%E9%99%A9%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%E5%AE%83%E4%BC%9A%E5%90%91%E4%B8%8B%E5%A2%9E%E9%95%BF%E5%B9%B6%E8%A6%86%E7%9B%96%20RAM%20%E4%B8%AD%E7%9A%84%E5%85%B6%E4%BB%96%E5%8F%98%E9%87%8F%E6%95%B0%E6%8D%AE%EF%BC%88%E5%A6%82%20.data%20%E6%88%96%20.bss%20%E6%AE%B5%EF%BC%89%E3%80%82%22%2C%22%E5%AE%83%E4%BC%9A%E8%AE%A9%E4%BB%A3%E7%A0%81%E9%80%BB%E8%BE%91%E5%8F%8D%E8%BD%AC%E3%80%82%22%2C%22%E5%AE%B9%E6%98%93%E5%AF%BC%E8%87%B4%20Flash%20%E6%8D%9F%E5%9D%8F%E3%80%82%22%2C%22%E5%AE%83%E4%BC%9A%E5%AF%BC%E8%87%B4%20CPU%20%E9%A2%91%E7%8E%87%E4%B8%8B%E9%99%8D%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%B3%BB%E7%BB%9F%E9%80%9A%E5%B8%B8%E6%B2%A1%E6%9C%89%20MMU%EF%BC%88%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E5%8D%95%E5%85%83%EF%BC%89%E4%BF%9D%E6%8A%A4%E3%80%82%E6%A0%88%E5%A6%82%E6%9E%9C%E5%A4%AA%E5%A4%A7%EF%BC%8C%E4%BC%9A%E7%9B%B4%E6%8E%A5%E6%82%84%E6%82%84%E5%9C%B0%E6%94%B9%E5%86%99%E6%8E%89%E5%AE%83%E4%B8%8B%E6%96%B9%E7%9A%84%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%EF%BC%8C%E5%AF%BC%E8%87%B4%E6%9E%81%E9%9A%BE%E5%AE%9A%E4%BD%8D%E7%9A%84%20Bug%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
