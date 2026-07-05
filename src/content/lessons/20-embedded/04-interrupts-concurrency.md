---
chapterId: "20-embedded"
lessonId: "04-interrupts-concurrency"
title: "中断与并发安全"
level: "进阶"
duration: "35 分钟"
tags: [中断, interrupt, 临界区, RTIC, 并发安全]
number: "20.4"
chapterTitle: "嵌入式 Rust"
chapterNumber: "20"
---
<div id="article-content"> <h1 id="中断与并发安全">中断与并发安全</h1>
<p>在嵌入式开发中，<strong>中断（Interrupt）</strong> 是处理异步事件的核心机制。当按键被按下、串口接收到数据或定时器到时，硬件会自动「中断」主程序的执行，跳转去运行一段特定的代码：<strong>中断服务程序（ISR, Interrupt Service Routine）</strong>。</p>
<p>这引入了一个经典的并发难题：<strong>如何在 <code>main</code> 循环和 <code>ISR</code> 之间安全地共享数据？</strong></p>
<h2 id="1-危险的全局变量">1. 危险的全局变量</h2>
<p>在 C 语言中，我们通常使用 <code>static volatile</code> 全局变量。但在 Rust 中，全局可变变量是 <code>static mut</code>，通过它修改数据是 <strong>不可取且极度危险的</strong>，因为 <code>main</code> 修改一半时，中断可能随时发生并试图再次修改，导致数据竞争。</p>
<h2 id="2-临界区critical-section">2. 临界区（Critical Section）</h2>
<p>解决共享数据最基础的方法是：<strong>在操作共享变量时临时禁用所有中断</strong>。这段被保护的代码块被称为「临界区」。</p>
<p>在 Rust 中，我们通常使用 <code>critical-section</code> crate。</p>
<pre><code class="language-rust">use critical_section as cs;

cs::with(|cs_token| {
    // 这个闭包内的代码在运行期间，中断是禁用的
    // cs_token 是一个「令牌」，证明你已经安全地合上了锁
});</code></pre>
<h2 id="3-裸机下的-mutex-与-refcell">3. 裸机下的 Mutex 与 RefCell</h2>
<p>为了在不引发数据竞争的前提下共享资源，Rust 嵌入式社区使用了一种特殊的 <code>Mutex</code>（互设锁）。</p>
<h3 id="类型定义">类型定义：</h3>
<pre><code class="language-rust">use core::cell::RefCell;
use critical_section::Mutex;

// 定义一个被锁保护的、可内部变更的全局变量
static SHARED_DATA: Mutex&lt;RefCell&lt;u32&gt;&gt; = Mutex::new(RefCell::new(0));</code></pre>
<h3 id="访问数据">访问数据：</h3>
<pre><code class="language-rust">fn handle_interrupt() {
    // 1. 进入临界区（获取令牌）
    critical_section::with(|cs| {
        // 2. 借用互斥锁并传入令牌
        let mut data = SHARED_DATA.borrow(cs).borrow_mut();
        // 3. 安全地操作数据
        *data += 1;
    });
}</code></pre>
<p><strong>为什么需要 <code>cs</code> 令牌？</strong>
Rust 的嵌入式 <code>Mutex</code> 要求在调用 <code>borrow</code> 时必须传入一个 <code>CriticalSection</code> 令牌。由于获取令牌的唯一途径是调用 <code>cs::with</code>（这会禁用中断），这就保证了 <strong>只要你在持有数据，中断就一定发不生</strong>。</p>
<h2 id="4-原子操作atomic">4. 原子操作（Atomic）</h2>
<p>如果你只需要共享一个简单的数值（如标志位或计数器），使用原子类型（Atomics）是效率更高、成本更低的方案。由于硬件指令集支持原子读-改-写，这种操作本身就不受中断干扰，因此不需要进入临界区。</p>
<pre><code class="language-rust">use core::sync::atomic::{AtomicBool, Ordering};

static IS_PRESSED: AtomicBool = AtomicBool::new(false);

fn main_loop() {
    if IS_PRESSED.load(Ordering::SeqCst) {
        // 处理按键逻辑
        IS_PRESSED.store(false, Ordering::SeqCst);
    }
}

// 中断函数
fn on_button_click() {
    IS_PRESSED.store(true, Ordering::SeqCst);
}</code></pre>
<h2 id="5-独占外设peripherals-的单例性">5. 独占外设：<code>Peripherals</code> 的单例性</h2>
<p>Rust 嵌入式库通过 <code>take()</code> 方法确保硬件外设是<strong>单例</strong>的。</p>
<pre><code class="language-rust">let dp = pac::Peripherals::take().unwrap();</code></pre>
<p>如果你的程序中两个地方同时尝试 <code>take()</code>，第二次会返回 <code>None</code>。这在编译期（或运行期初始化时）就防止了两个不同的模块同时配置同一个定时器或串口。</p>
<h1 id="练习题">练习题</h1>
<h2 id="核心概念测验">核心概念测验</h2>
<div class="quiz-choice" data-block-id="20-embedded/04-interrupts-concurrency#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20Rust%20%E4%B8%AD%E5%A4%84%E7%90%86%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%85%B1%E4%BA%AB%E5%8F%98%E9%87%8F%E6%97%B6%EF%BC%8C%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E5%BB%BA%E8%AE%AE%E4%BD%BF%E7%94%A8%20%60static%20mut%60%3F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%E5%AE%83%E5%AE%B9%E6%98%93%E5%AF%BC%E8%87%B4%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%EF%BC%8C%E4%B8%94%E8%AE%BF%E9%97%AE%E5%AE%83%E5%BF%85%E9%A1%BB%E5%8C%85%E8%A3%B9%E5%9C%A8%20unsafe%20%E5%9D%97%E4%B8%AD%EF%BC%8C%E7%A0%B4%E5%9D%8F%E4%BA%86%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E4%BF%9D%E8%AF%81%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%E5%AE%83%E4%BC%9A%E6%B6%88%E8%80%97%E6%9B%B4%E5%A4%9A%E7%9A%84%E7%94%B5%E9%87%8F%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%20Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%8D%E6%94%AF%E6%8C%81%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%E3%80%82%22%2C%22%E5%9B%A0%E4%B8%BA%E5%AE%83%E7%9A%84%E8%BF%90%E8%A1%8C%E9%80%9F%E5%BA%A6%E5%A4%AA%E6%85%A2%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%60static%20mut%60%20%E6%B2%A1%E6%9C%89%E4%BB%BB%E4%BD%95%E5%B9%B6%E5%8F%91%E4%BF%9D%E6%8A%A4%E3%80%82%E5%9C%A8%E4%B8%BB%E7%A8%8B%E5%BA%8F%E5%92%8C%E4%B8%AD%E6%96%AD%E6%9C%8D%E5%8A%A1%E7%A8%8B%E5%BA%8F%E5%90%8C%E6%97%B6%E8%AE%BF%E9%97%AE%E6%97%B6%EF%BC%8C%E5%8F%AF%E8%83%BD%E5%AF%BC%E8%87%B4%E6%95%B0%E6%8D%AE%E4%B8%8D%E4%B8%80%E8%87%B4%E6%88%96%E5%B4%A9%E6%BA%83%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/04-interrupts-concurrency#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%A3%B8%E6%9C%BA%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%20%60Mutex%60%20%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%B1%82%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%20%60CriticalSection%60%20%E4%BB%A4%E7%89%8C%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%BA%E4%BA%86%E5%90%AF%E7%94%A8%E7%A1%AC%E4%BB%B6%E5%8A%A0%E5%AF%86%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E4%BB%A3%E7%A0%81%E6%9B%B4%E9%95%BF%E3%80%82%22%2C%22%E5%8F%AA%E6%98%AF%E4%B8%BA%E4%BA%86%E4%BB%AA%E5%BC%8F%E6%84%9F%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E5%9C%A8%E8%AF%AD%E8%A8%80%E5%B1%82%E9%9D%A2%E5%BC%BA%E5%88%B6%E8%A6%81%E6%B1%82%EF%BC%9A%E5%8F%AA%E6%9C%89%E5%9C%A8%E3%80%8C%E7%A6%81%E7%94%A8%E4%B8%AD%E6%96%AD%E3%80%8D%E7%9A%84%E7%8E%AF%E5%A2%83%E4%B8%8B%E6%89%8D%E5%85%81%E8%AE%B8%E8%AE%BF%E9%97%AE%E5%85%B1%E4%BA%AB%E6%95%B0%E6%8D%AE%E3%80%82%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E5%B7%A7%E5%A6%99%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1%E3%80%82%E6%B2%A1%E6%9C%89%E4%BB%A4%E7%89%8C%E4%BD%A0%E5%B0%B1%E6%97%A0%E6%B3%95%E8%A7%A3%E5%BC%80%20Mutex%20%E9%94%81%EF%BC%8C%E8%80%8C%E8%8E%B7%E5%BE%97%E4%BB%A4%E7%89%8C%E7%9A%84%E5%94%AF%E4%B8%80%E5%90%88%E6%B3%95%E9%80%94%E5%BE%84%E6%98%AF%E7%A6%81%E7%94%A8%E4%B8%AD%E6%96%AD%EF%BC%8C%E4%BB%8E%E8%80%8C%E5%9C%A8%E5%8E%9F%E7%90%86%E4%B8%8A%E6%B6%88%E9%99%A4%E4%BA%86%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/04-interrupts-concurrency#1:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%20(Atomics)%20%E7%9A%84%E6%8F%8F%E8%BF%B0%EF%BC%8C%E5%93%AA%E9%A1%B9%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%83%E6%98%AF%E9%9B%B6%E6%88%90%E6%9C%AC%E7%9A%84%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E7%A6%81%E7%94%A8%E4%B8%AD%E6%96%AD%E3%80%82%22%2C%22%E5%AE%83%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E5%A4%A7%E5%9E%8B%E7%BB%93%E6%9E%84%E4%BD%93%E3%80%82%22%2C%22%E5%AE%83%E4%BE%9D%E8%B5%96%E5%A4%84%E7%90%86%E5%99%A8%E7%9A%84%E7%89%B9%E6%AE%8A%E6%8C%87%E4%BB%A4%E6%9D%A5%E4%BF%9D%E8%AF%81%E6%93%8D%E4%BD%9C%E7%9A%84%E4%B8%8D%E5%8F%AF%E5%88%86%E5%89%B2%E6%80%A7%E3%80%82%22%2C%22%E5%AE%83%E6%98%AF%E5%A4%84%E7%90%86%E6%A0%87%E5%BF%97%E4%BD%8D%EF%BC%88Flag%EF%BC%89%E7%9A%84%E6%9C%80%E4%BC%98%E9%80%89%E3%80%82%22%5D%2C%22correct%22%3A%5B0%2C2%2C3%5D%2C%22explanation%22%3A%22%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%E7%9B%B4%E6%8E%A5%E5%88%A9%E7%94%A8%E7%A1%AC%E4%BB%B6%E7%89%B9%E6%80%A7%E4%BF%9D%E8%AF%81%E5%AE%89%E5%85%A8%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E9%94%81%E5%AE%9A%E6%80%BB%E7%BA%BF%E6%88%96%E7%A6%81%E7%94%A8%E4%B8%AD%E6%96%AD%EF%BC%8C%E5%9B%A0%E6%AD%A4%E6%80%A7%E8%83%BD%E6%9E%81%E9%AB%98%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/04-interrupts-concurrency#1:3" data-kind="single" data-payload="%7B%22question%22%3A%22%60critical_section%3A%3Awith(%7Ccs%7C%20%7B%20...%20%7D)%60%20%E5%9D%97%E4%B8%AD%EF%BC%8C%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E7%9A%84%E7%89%B9%E7%82%B9%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%83%E4%BC%9A%E8%87%AA%E5%8A%A8%E6%8A%8A%20Rust%20%E4%BB%A3%E7%A0%81%E8%BD%AC%E6%8D%A2%E6%88%90%E6%B1%87%E7%BC%96%E3%80%82%22%2C%22%E5%9C%A8%E6%AD%A4%E6%9C%9F%E9%97%B4%EF%BC%8C%E7%A1%AC%E4%BB%B6%E4%B8%AD%E6%96%AD%E8%A2%AB%E6%9A%82%E6%97%B6%E7%A6%81%E7%94%A8%EF%BC%8C%E7%A1%AE%E4%BF%9D%E4%BA%86%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B%E4%B8%8D%E8%A2%AB%E6%89%93%E6%96%AD%E3%80%82%22%2C%22%E4%BB%A3%E7%A0%81%E4%BC%9A%E5%B9%B6%E8%A1%8C%E8%BF%90%E8%A1%8C%E3%80%82%22%2C%22%E4%BB%A3%E7%A0%81%E4%BC%9A%E8%BF%90%E8%A1%8C%E5%9C%A8%20GPU%20%E4%B8%8A%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E8%BF%99%E5%B0%B1%E6%98%AF%E6%89%80%E8%B0%93%E7%9A%84%E3%80%8C%E4%B8%B4%E7%95%8C%E5%8C%BA%E3%80%8D%EF%BC%8C%E5%AE%83%E9%80%9A%E8%BF%87%E7%A1%AC%E4%BB%B6%E6%89%8B%E6%AE%B5%EF%BC%88%E5%A6%82%E4%BF%AE%E6%94%B9%E5%BE%AE%E6%8E%A7%E5%88%B6%E5%99%A8%E7%9A%84%20PRIMASK%20%E5%AF%84%E5%AD%98%E5%99%A8%EF%BC%89%E4%BF%9D%E8%AF%81%E4%BA%86%E4%BB%A3%E7%A0%81%E7%9A%84%E7%8B%AC%E5%8D%A0%E6%89%A7%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="20-embedded/04-interrupts-concurrency#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E4%B8%A4%E4%B8%AA%E4%B8%8D%E5%90%8C%E7%9A%84%E4%B8%AD%E6%96%AD%E5%87%A0%E4%B9%8E%E5%90%8C%E6%97%B6%E5%8F%91%E7%94%9F%EF%BC%8C%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%A4%E4%B8%AA%E4%B8%AD%E6%96%AD%E4%BC%9A%E5%90%8C%E6%97%B6%E8%BF%90%E8%A1%8C%E3%80%82%22%2C%22%E5%A4%84%E7%90%86%E5%99%A8%E4%BC%9A%E7%88%86%E7%82%B8%E3%80%82%22%2C%22Rust%20%E4%BC%9A%E6%8A%A5%E9%94%99%E3%80%82%22%2C%22%E5%A4%84%E7%90%86%E5%99%A8%E4%BC%9A%E6%A0%B9%E6%8D%AE%E4%B8%AD%E6%96%AD%E4%BC%98%E5%85%88%E7%BA%A7%EF%BC%88Priority%EF%BC%89%E5%86%B3%E5%AE%9A%E5%85%88%E6%89%A7%E8%A1%8C%E5%93%AA%E4%B8%80%E4%B8%AA%E3%80%82%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%B9%B6%E5%8F%91%E6%9C%AC%E8%B4%A8%E4%B8%8A%E6%98%AF%E5%9C%A8%E5%8D%95%E6%A0%B8%E4%B8%8A%E7%9A%84%E5%88%87%E6%8D%A2%E3%80%82%E4%BC%98%E5%85%88%E7%BA%A7%E7%B3%BB%E7%BB%9F%E5%86%B3%E5%AE%9A%E4%BA%86%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F%EF%BC%8C%E8%80%8C%E6%88%91%E4%BB%AC%E8%A6%81%E5%81%9A%E7%9A%84%E5%B0%B1%E6%98%AF%E7%A1%AE%E4%BF%9D%E5%9C%A8%E5%88%87%E6%8D%A2%E5%8F%91%E7%94%9F%E6%97%B6%E6%95%B0%E6%8D%AE%E4%BE%9D%E7%84%B6%E5%AE%89%E5%85%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
