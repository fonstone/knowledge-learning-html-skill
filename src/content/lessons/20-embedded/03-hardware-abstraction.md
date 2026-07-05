---
chapterId: "20-embedded"
lessonId: "03-hardware-abstraction"
title: "硬件抽象：PAC 与 HAL"
level: "进阶"
duration: "30 分钟"
tags: [PAC, HAL, svd2rust, embedded-hal]
number: "20.3"
chapterTitle: "嵌入式 Rust"
chapterNumber: "20"
---
<div id="article-content"> <h1 id="硬件抽象如何与芯片交谈">硬件抽象：如何与芯片交谈</h1>
<p>在 C 语言中，操作硬件通常涉及到大量的宏（Macros）和指针强转（如 <code>*(uint32_t*)0x4001080C = 0x01</code>）。这种方式非常容易出错，且编译器无法提供任何保护。</p>
<p>Rust 的嵌入式生态采用了一套三层模型，将硬件操作逐步抽象：</p>
<h2 id="1-寄存器访问层pac">1. 寄存器访问层（PAC）</h2>
<p><strong>PAC (Peripheral Access Crate)</strong> 是最底层的抽象。它通常由工具 <strong><code>svd2rust</code></strong> 直接从芯片厂商提供的 SVD 文件（XML 格式的描述文件）自动生成。</p>
<p>PAC 把内存地址变成了结构体。</p>
<h3 id="传统的-c-风格操作">传统的 C 风格操作：</h3>
<pre><code class="language-c">// 很容易写错地址或位偏移
RCC-&gt;APB2ENR |= (1 &lt;&lt; 3);</code></pre>
<h3 id="rust-pac-风格操作">Rust PAC 风格操作：</h3>
<pre><code class="language-rust">// 类型安全的 API
dp.RCC.apb2enr.modify(|_, w| w.iopben().set_bit());</code></pre>
<p>在 PAC 中，你依然是在操作寄存器，但 Rust 的闭包 API 确保了：</p>
<ul>
<li><strong>原子性</strong>：<code>modify</code> 会处理读-写循环。</li>
<li><strong>只读/只写保护</strong>：你无法写入一个被标记为只读的寄存器。</li>
<li><strong>字段校验</strong>：无法设置非法的位组合。</li>
</ul>
<h2 id="2-硬件抽象层hal">2. 硬件抽象层（HAL）</h2>
<p><strong>HAL (Hardware Abstraction Layer)</strong> 在 PAC 之上提供了更高级、更符合人体工程学的 API。它不要求你记住寄存器名称，而是操作具体的业务逻辑（如「初始化串口」）。</p>
<pre><code class="language-rust">// 使用 HAL 初始化 GPIO B 的第 12 号引脚为推挽输出
let gpiob = dp.GPIOB.split();
let mut led = gpiob.pb12.into_push_pull_output();

led.set_high(); // 点亮 LED</code></pre>
<h2 id="3-核心机制类型状态模式-typestate-pattern">3. 核心机制：类型状态模式 (Typestate Pattern)</h2>
<p>这是 Rust 嵌入式开发最神奇的地方。利用 Rust 的 <strong>所有权机制</strong>，我们可以将硬件的<strong>状态</strong>编码到类型中。</p>
<h3 id="场景配置一个引脚">场景：配置一个引脚</h3>
<p>一个 GPIO 引脚在同一时间只能是「输入」或「输出」，绝不能同时是两者。</p>
<pre><code class="language-rust">let pin = gpioa.pa1.into_floating_input(); // 此时 pin 的类型是 Pin&lt;Input&lt;Floating&gt;&gt;
// pin.set_high(); // ❌ 编译报错！输入引脚没有 set_high 方法

let output_pin = pin.into_push_pull_output(); // 消耗原引脚，返回 Pin&lt;Output&lt;PushPull&gt;&gt;
output_pin.set_high(); // ✅ 正常工作</code></pre>
<p>这意味着：<strong>如果你错误地在代码里操作了状态不对的硬件，编译器会拒绝编译。</strong> 这种「编译期拦截」极大地减少了硬件调试的压力。</p>
<h2 id="4-通用标准embedded-hal">4. 通用标准：Embedded-HAL</h2>
<p>如果你写了一个 OLED 屏幕的驱动，你肯定希望它既能跑在 STM32 上，也能跑在 ESP32 上。</p>
<p><strong><code>embedded-hal</code></strong> 定义了一套标准的 Trait（接口）：</p>
<ul>
<li><code>OutputPin</code>（输出引脚）</li>
<li><code>SpiBus</code>（SPI 总线）</li>
<li><code>I2cAddress</code>（I2C 地址）</li>
</ul>
<p>只要你的驱动程序要求接收一个「实现了 <code>OutputPin</code> 的类型」，那么它就可以在任何实现了该标准的硬件平台上复用。这促成了 Rust 嵌入式社区极其丰富的驱动库（Display, Sensor, Radio 等）。</p>
<h1 id="练习题">练习题</h1>
<h2 id="核心概念测验">核心概念测验</h2>
<div class="quiz-choice" data-block-id="20-embedded/03-hardware-abstraction#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%80%E4%B9%88%E6%98%AF%20PAC%20(Peripheral%20Access%20Crate)%3F%22%2C%22options%22%3A%5B%22%E5%9F%BA%E4%BA%8E%E8%8A%AF%E7%89%87%E5%AF%84%E5%AD%98%E5%99%A8%E6%98%A0%E5%B0%84%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%9A%84%E4%BD%8E%E5%B1%82%E8%AE%BF%E9%97%AE%E4%BB%A3%E7%A0%81%E3%80%82%22%2C%22%E4%B8%80%E4%B8%AA%E7%94%A8%E4%BA%8E%E7%AE%A1%E7%90%86%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%8C%85%E7%9A%84%E5%B7%A5%E5%85%B7%E3%80%82%22%2C%22%E4%B8%80%E7%A7%8D%E6%96%B0%E5%9E%8B%E7%9A%84%E5%BE%AE%E6%8E%A7%E5%88%B6%E5%99%A8%E5%9B%BA%E4%BB%B6%E3%80%82%22%2C%22%E4%B8%80%E4%B8%AA%E7%94%A8%E4%BA%8E%E8%B0%83%E8%AF%95%E4%B8%B2%E5%8F%A3%E7%9A%84%E8%BD%AF%E4%BB%B6%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22PAC%20%E6%98%AF%E9%80%9A%E8%BF%87%20svd2rust%20%E5%B7%A5%E5%85%B7%E8%A7%A3%E6%9E%90%20SVD%20%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90%E7%9A%84%EF%BC%8C%E5%AE%83%E5%B0%86%E7%A1%AC%E4%BB%B6%E5%AF%84%E5%AD%98%E5%99%A8%E5%9C%B0%E5%9D%80%E6%98%A0%E5%B0%84%E4%B8%BA%20Rust%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%E7%BB%93%E6%9E%84%E4%BD%93%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/03-hardware-abstraction#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22Rust%20%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%BC%80%E5%8F%91%E4%B8%AD%E7%9A%84%E3%80%8C%E7%B1%BB%E5%9E%8B%E7%8A%B6%E6%80%81%E6%A8%A1%E5%BC%8F%E3%80%8D%E5%A6%82%E4%BD%95%E9%98%B2%E6%AD%A2%E7%A1%AC%E4%BB%B6%E6%8D%9F%E5%9D%8F%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%83%E9%80%9A%E8%BF%87%E4%B8%8D%E6%96%AD%E6%A3%80%E6%B5%8B%E7%94%B5%E5%8E%8B%E6%9D%A5%E9%98%B2%E6%AD%A2%E7%9F%AD%E8%B7%AF%E3%80%82%22%2C%22%E5%AE%83%E6%8F%90%E4%BE%9B%E4%BA%86%E4%B8%80%E4%B8%AA%E7%A1%AC%E4%BB%B6%E4%BB%BF%E7%9C%9F%E5%99%A8%E3%80%82%22%2C%22%E5%AE%83%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE%E6%89%80%E6%9C%89%E7%9A%84%E4%B8%AD%E6%96%AD%E3%80%82%22%2C%22%E5%AE%83%E5%9C%A8%E7%BC%96%E8%AF%91%E9%98%B6%E6%AE%B5%E5%BC%BA%E5%88%B6%E6%A3%80%E6%9F%A5%E5%BC%95%E8%84%9A%E7%8A%B6%E6%80%81%EF%BC%8C%E9%98%B2%E6%AD%A2%E7%A8%8B%E5%BA%8F%E5%91%98%E5%AF%B9%E6%9C%AA%E9%85%8D%E7%BD%AE%E7%9A%84%E7%A1%AC%E4%BB%B6%E8%B0%83%E7%94%A8%E9%9D%9E%E6%B3%95%E6%96%B9%E6%B3%95%E3%80%82%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E9%80%9A%E8%BF%87%E8%AE%A9%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BC%95%E8%84%9A%E7%8A%B6%E6%80%81%EF%BC%88%E5%A6%82%E8%BE%93%E5%85%A5%E3%80%81%E8%BE%93%E5%87%BA%E3%80%81%E4%B8%B2%E5%8F%A3%E6%A8%A1%E5%BC%8F%EF%BC%89%E5%AF%B9%E5%BA%94%E4%B8%8D%E5%90%8C%E7%9A%84%20Rust%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%8F%AF%E4%BB%A5%E7%A1%AE%E4%BF%9D%E5%8F%AA%E6%9C%89%E5%A4%84%E4%BA%8E%E6%AD%A3%E7%A1%AE%E7%8A%B6%E6%80%81%E7%9A%84%E7%A1%AC%E4%BB%B6%E6%89%8D%E8%83%BD%E8%B0%83%E7%94%A8%E5%AF%B9%E5%BA%94%E7%9A%84%E6%96%B9%E6%B3%95%EF%BC%8C%E4%BB%8E%E8%80%8C%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E6%8E%92%E9%99%A4%E6%BD%9C%E5%9C%A8%E7%9A%84%E9%80%BB%E8%BE%91%E9%94%99%E8%AF%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/03-hardware-abstraction#1:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BD%BF%E7%94%A8%20HAL%20(Hardware%20Abstraction%20Layer)%20%E7%9B%B8%E6%AF%94%E7%9B%B4%E6%8E%A5%E6%93%8D%E4%BD%9C%20PAC%20%E6%9C%89%E5%93%AA%E4%BA%9B%E5%A5%BD%E5%A4%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%8F%90%E4%BE%9B%E4%BA%86%E6%9B%B4%E7%9B%B4%E8%A7%82%E3%80%81%E6%9B%B4%E6%8E%A5%E8%BF%91%E5%BA%94%E7%94%A8%E9%80%BB%E8%BE%91%E7%9A%84%20API%EF%BC%88%E5%A6%82%20%60set_high%60%EF%BC%89%E3%80%82%22%2C%22%E8%BF%90%E8%A1%8C%E9%80%9F%E5%BA%A6%E5%BF%AB%E4%BA%86%2010%20%E5%80%8D%E4%BB%A5%E4%B8%8A%E3%80%82%22%2C%22%E5%88%A9%E7%94%A8%E6%89%80%E6%9C%89%E6%9D%83%E8%87%AA%E5%8A%A8%E7%AE%A1%E7%90%86%E7%A1%AC%E4%BB%B6%E5%A4%96%E8%AE%BE%E7%9A%84%E7%8B%AC%E5%8D%A0%E6%80%A7%E3%80%82%22%2C%22%E4%BB%A3%E7%A0%81%E5%9C%A8%E5%90%8C%E7%B3%BB%E5%88%97%E7%9A%84%E4%B8%8D%E5%90%8C%E8%8A%AF%E7%89%87%E4%B9%8B%E9%97%B4%E6%9B%B4%E5%85%B7%E5%8F%AF%E7%A7%BB%E6%A4%8D%E6%80%A7%E3%80%82%22%5D%2C%22correct%22%3A%5B0%2C2%2C3%5D%2C%22explanation%22%3A%22HAL%20%E6%98%AF%E6%9B%B4%E9%AB%98%E4%B8%80%E5%B1%82%E7%9A%84%E5%B0%81%E8%A3%85%EF%BC%8C%E5%AE%83%E5%85%B3%E6%B3%A8%E3%80%8C%E5%8A%9F%E8%83%BD%E3%80%8D%E8%80%8C%E9%9D%9E%E3%80%8C%E5%AF%84%E5%AD%98%E5%99%A8%E7%BB%86%E8%8A%82%E3%80%8D%E3%80%82%E8%99%BD%E7%84%B6%E6%8A%BD%E8%B1%A1%E9%80%9A%E5%B8%B8%E4%BC%9A%E7%A8%8D%E5%BE%AE%E5%A2%9E%E5%8A%A0%E4%BB%A3%E7%A0%81%E9%87%8F%EF%BC%8C%E4%BD%86%E5%AE%83%E6%98%BE%E8%91%97%E6%8F%90%E5%8D%87%E4%BA%86%E5%BC%80%E5%8F%91%E6%95%88%E7%8E%87%E5%92%8C%E5%AE%89%E5%85%A8%E6%80%A7%E3%80%82%E5%85%B6%E8%BF%90%E8%A1%8C%E6%95%88%E7%8E%87%E9%80%9A%E5%B8%B8%E4%B8%8E%E7%9B%B4%E6%8E%A5%E6%93%8D%E4%BD%9C%E5%AF%84%E5%AD%98%E5%99%A8%E6%8C%81%E5%B9%B3%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/03-hardware-abstraction#1:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F%E7%9A%84%E5%BC%80%E5%8F%91%E8%80%85%E5%BA%94%E8%AF%A5%E4%BE%9D%E8%B5%96%20%60embedded-hal%60%20%E8%80%8C%E4%B8%8D%E6%98%AF%E7%89%B9%E5%AE%9A%E7%9A%84%E8%8A%AF%E7%89%87%E5%BA%93%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%E7%89%B9%E5%AE%9A%E8%8A%AF%E7%89%87%E5%BA%93%E6%98%AF%E4%B8%8D%E5%BC%80%E6%BA%90%E7%9A%84%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E9%A9%B1%E5%8A%A8%E4%BB%A3%E7%A0%81%E5%85%B7%E5%A4%87%E8%B7%A8%E7%A1%AC%E4%BB%B6%E5%B9%B3%E5%8F%B0%E7%9A%84%E9%80%9A%E7%94%A8%E6%80%A7%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%20%60embedded-hal%60%20%E8%BF%90%E8%A1%8C%E6%9B%B4%E7%A8%B3%E5%AE%9A%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%20Rust%20%E5%BC%BA%E5%88%B6%E8%A6%81%E6%B1%82%E8%BF%99%E4%B9%88%E5%81%9A%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%60embedded-hal%60%20%E6%98%AF%E4%B8%80%E5%A5%97%E6%8E%A5%E5%8F%A3%E6%A0%87%E5%87%86%E3%80%82%E5%8F%AA%E8%A6%81%E9%81%B5%E5%BE%AA%E8%AF%A5%E6%A0%87%E5%87%86%E7%BC%96%E5%86%99%E9%A9%B1%E5%8A%A8%EF%BC%8C%E8%AF%A5%E9%A9%B1%E5%8A%A8%E5%B0%B1%E8%83%BD%E7%94%A8%E4%BA%8E%E6%89%80%E6%9C%89%E5%AE%9E%E7%8E%B0%E4%BA%86%E8%BF%99%E4%BA%9B%E6%8E%A5%E5%8F%A3%E7%9A%84%20MCU%20%E5%B9%B3%E5%8F%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/03-hardware-abstraction#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22PAC%20%E4%B8%AD%E4%BF%AE%E6%94%B9%E5%AF%84%E5%AD%98%E5%99%A8%E7%9A%84%E9%97%AD%E5%8C%85%E5%8F%82%E6%95%B0%20%60%7Cr%2C%20w%7C%20...%60%EF%BC%8C%E5%85%B6%E4%B8%AD%E7%9A%84%20%60w%60%20%E4%BB%A3%E8%A1%A8%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22width%EF%BC%88%E4%BD%8D%E5%AE%BD%EF%BC%89%E3%80%82%22%2C%22read%EF%BC%88%E8%AF%BB%E5%8F%96%EF%BC%89%E3%80%82%22%2C%22write%EF%BC%88%E5%86%99%E5%85%A5%EF%BC%89%E3%80%82%22%2C%22wait%EF%BC%88%E7%AD%89%E5%BE%85%EF%BC%89%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%9C%A8%20PAC%20%E7%9A%84%20API%20%E4%B8%AD%EF%BC%8C%60r%60%20%E9%80%9A%E5%B8%B8%E4%BB%A3%E8%A1%A8%E5%BD%93%E5%89%8D%E5%AF%84%E5%AD%98%E5%99%A8%E7%9A%84%E5%80%BC%EF%BC%8C%E8%80%8C%20%60w%60%20%E6%8F%90%E4%BE%9B%E4%BA%86%E4%B8%80%E7%B3%BB%E5%88%97%E7%94%A8%E4%BA%8E%E4%BF%AE%E6%94%B9%E5%90%84%E4%B8%AA%E4%BD%8D%E5%AD%97%E6%AE%B5%E7%9A%84%E6%96%B9%E6%B3%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
