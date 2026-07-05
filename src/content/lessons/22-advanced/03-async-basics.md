---
chapterId: "22-advanced"
lessonId: "03-async-basics"
title: "异步编程"
level: "进阶"
duration: "40 分钟"
tags: [异步, async/await, Future, tokio, async-std]
number: "22.3"
chapterTitle: "高级特性"
chapterNumber: "22"
---
<div id="article-content"> <h1 id="为什么需要异步">为什么需要异步</h1>
<h2 id="从一个网络服务器说起">从一个网络服务器说起</h2>
<p>假设你在写一个简单的 Web 服务器，需要处理多个用户同时发来的请求：</p>
<pre><code class="language-text">用户A：请求数据库 → 等待 50ms → 返回结果
用户B：请求数据库 → 等待 50ms → 返回结果
用户C：请求数据库 → 等待 50ms → 返回结果</code></pre>
<p>如果用<strong>单线程同步</strong>处理，只能一个一个来：</p>
<pre><code class="language-text">[等用户A的DB回复 50ms][等用户B的DB回复 50ms][等用户C的DB回复 50ms]
总耗时：150ms</code></pre>
<p>等待数据库回复时，CPU 是完全空闲的。50ms 对 CPU 来说是漫长的虚度——现代 CPU 在 50ms 里可以执行几亿条指令。</p>
<h2 id="多线程好但有代价">多线程：好，但有代价</h2>
<p>第一个想法是用多线程，每个请求一个线程：</p>
<pre><code class="language-text">线程A：[等待50ms]
线程B：   [等待50ms]
线程C：      [等待50ms]
总耗时：~50ms（并行等待）</code></pre>
<p>好多了！但线程有代价：</p>
<ul>
<li><strong>内存</strong>：每个线程默认占用 2MB 栈内存。1000 个并发请求 = 2GB 内存</li>
<li><strong>切换开销</strong>：操作系统在线程间切换需要保存/恢复寄存器，每次切换耗时几微秒</li>
<li><strong>实际上限</strong>：一台普通服务器能稳定运行几千个线程，但很多场景需要万级别的并发</li>
</ul>
<h2 id="异步等待时切换不等着浪费">异步：等待时切换，不等着浪费</h2>
<p><strong>异步编程</strong>的核心思路是：<strong>当一个任务在等待时，切换去执行另一个任务，而不是让线程傻傻地等着</strong>。</p>
<pre><code class="language-text">单线程异步：
任务A开始 → 发起DB请求 → 切换到B
任务B开始 → 发起DB请求 → 切换到C
任务C开始 → 发起DB请求 → DB结果回来
                         → 完成A → 完成B → 完成C
总耗时：~50ms（单线程处理3个请求）</code></pre>
<p>这就像一个高效的餐厅服务员：不是为每位顾客派一个专属服务员（多线程），而是一个服务员在几桌之间来回——桌A在等菜时，去服务桌B，桌B在等菜时，去服务桌C。</p>
<h2 id="什么时候用异步什么时候用线程">什么时候用异步，什么时候用线程</h2>
<table><thead><tr><th>场景</th><th>推荐方案</th></tr></thead><tbody><tr><td>大量 I/O 等待（网络、文件）</td><td><strong>异步</strong>（async/await + tokio）</td></tr><tr><td>CPU 密集计算（加密、图像处理）</td><td><strong>多线程</strong>（rayon 或 thread::spawn）</td></tr><tr><td>简单脚本，不需要并发</td><td><strong>同步</strong>就好</td></tr></tbody></table>
<h1 id="future-与-asyncawait">Future 与 async/await</h1>
<p>Rust 异步编程建立在两个互补的概念上：</p>
<ul>
<li><strong><code>Future</code></strong>：代表”一个尚未完成的计算”的类型。你可以把它想成外卖单——下单之后外卖还没到，但你手上有张单子，随时可以去查进度。<code>Future</code> 只是描述”如何得到结果”，本身什么都不执行。</li>
<li><strong><code>async</code>/<code>await</code></strong>：让你用看起来像同步的写法来组合 <code>Future</code>。<code>async fn</code> 把普通函数变成返回 <code>Future</code> 的函数；<code>.await</code> 在等待某个 <code>Future</code> 完成时暂停当前任务，让运行时去处理其他事情，完成后再回来继续。</li>
</ul>
<p>两者的分工：<code>Future</code> 是<strong>机制</strong>（描述一件异步的事），<code>async</code>/<code>await</code> 是<strong>语法糖</strong>（让你更自然地写出和组合这些 <code>Future</code>）。</p>
<h2 id="future对未来结果的承诺">Future：对”未来结果”的承诺</h2>
<p>Rust 异步编程的核心概念是 <strong><code>Future</code></strong>。</p>
<p><code>Future</code> 就是一个<strong>尚未完成的计算的描述</strong>——不是”现在给你结果”，而是”我知道怎么得到结果，但可能要等一会儿”。</p>
<p>你可以把 <code>Future</code> 想象成外卖单：你下单（创建 Future），但外卖还没到（结果还没出来）。拿到外卖单本身并不会触发任何计算——只有当外卖员轮询”这单做好了吗？“时，才会推进进度。</p>
<p><code>Future</code> trait 的核心定义（简化版）：</p>
<pre><code class="language-rust">// 标准库里 Future trait 的核心（简化）
trait Future {
    type Output;  // 最终产出的值的类型

    fn poll(&amp;mut self) -&gt; Poll&lt;Self::Output&gt;;
    // Poll::Pending  → 还没好，等会儿再问
    // Poll::Ready(v) → 好了，结果是 v
}</code></pre>
<p><strong>关键特性</strong>：<code>Future</code> 是<strong>惰性的</strong>。创建一个 <code>Future</code> 不会让任何事情发生——必须有人（运行时）来”驱动”它（调用 <code>poll</code>），它才会推进。</p>
<h2 id="asyncawait让你写出异步代码看起来像同步">async/await：让你写出异步代码看起来像同步</h2>
<p>直接操作 <code>Future</code> 和手动实现状态机非常繁琐。<code>async</code>/<code>await</code> 语法让这件事变简单：</p>
<ul>
<li><strong><code>async fn</code></strong>：将一个函数标记为异步，函数体可以”暂停等待”</li>
<li><strong><code>.await</code></strong>：在异步函数内等待一个 <code>Future</code> 完成，等待期间可以切换去做别的</li>
</ul>
<blockquote>
<p>下面示例用到了 <code>tokio::time::sleep</code>——tokio 是 Rust 最常用的异步运行时，下一节会详细介绍。这里先把它当作”等待一段时间”的工具，关注 <code>async</code>/<code>.await</code> 的写法即可。</p>
</blockquote>
<pre><code class="language-rust">// async fn 的返回类型变成 impl Future&lt;Output = i32&gt;
async fn fetch_data() -&gt; i32 {
    // 模拟异步等待
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    //                                                       ^^^^^^
    // .await 在这里"暂停"这个函数，等待 sleep 完成
    // 暂停期间，运行时可以去执行别的任务
    42
}

async fn main_logic() {
    let result = fetch_data().await;
    // fetch_data() 返回一个 Future，.await 等它完成后才继续
    println!("结果：{}", result);
}</code></pre>
<p>注意：<strong><code>async fn</code> 本身不会立即执行</strong>——调用 <code>async fn</code> 只是创建了一个 <code>Future</code> 对象，需要被 <code>.await</code> 或交给运行时才会真正运行。</p>
<pre><code class="language-rust">// 这两行代码没有任何区别——只是"描述了计算"，什么都没执行
let future1 = fetch_data();  // 没有 .await，什么都没发生
let future2 = fetch_data();  // 同上</code></pre>
<h2 id="运行时谁来驱动-future">运行时：谁来驱动 Future</h2>
<p><code>Future</code> 是惰性的——你创建了它，但什么都不会发生，需要有人来”推”它。这个推动者就叫<strong>异步运行时（async runtime）</strong>。</p>
<p>你可以把运行时理解成一个管家：你把一堆任务（<code>Future</code>）交给它，它负责在各个任务之间来回调度——某个任务在等网络，先放一放，去推进另一个；网络数据来了，再回来继续。</p>
<p>Rust 标准库只定义了 <code>Future</code> trait 本身，<strong>没有内置运行时</strong>，需要你选一个第三方库。最常用的是 <strong>tokio</strong>：</p>
<pre><code class="language-toml">[dependencies]
tokio = { version = "1", features = ["full"] }</code></pre>
<blockquote>
<p>为什么不内置？因为嵌入式设备、命令行工具、Web 服务器对运行时的要求差别太大，一个统一的实现无法满足所有场景。Rust 的做法是：标准库只定规范，具体实现交给生态。</p>
</blockquote>
<h2 id="第一个真正的异步程序">第一个真正的异步程序</h2>
<p>用 <code>#[tokio::main]</code> 宏告诉编译器：用 tokio 运行时来执行这个 <code>async main</code>：</p>
<pre><code class="language-rust">use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("开始");
    slow_greeting("Alice").await;
    slow_greeting("Bob").await;
    println!("结束");
}

async fn slow_greeting(name: &amp;str) {
    sleep(Duration::from_millis(100)).await;
    println!("你好，{}！", name);
}</code></pre>
<blockquote>
<p><strong>注意</strong>：这段代码需要在有 tokio 依赖的项目中运行（Playground 环境不支持 tokio）。
你可以通过 <code>cargo new my-async-app</code> 新建项目后自行尝试。</p>
</blockquote>
<h2 id="并发执行真正发挥异步的威力">并发执行：真正发挥异步的威力</h2>
<p>上面的例子是<strong>顺序</strong>执行两个异步任务（先等 Alice，再等 Bob）。异步真正的威力在于<strong>并发</strong>：</p>
<pre><code class="language-rust">use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // tokio::join! 并发运行多个 Future，等所有都完成
    let (a, b) = tokio::join!(
        slow_greet("Alice"),
        slow_greet("Bob")
    );
    println!("{}", a);
    println!("{}", b);
    println!("两个任务并发完成！");
}

async fn slow_greet(name: &amp;str) -&gt; String {
    sleep(Duration::from_millis(100)).await;
    format!("你好，{}！", name)
}
// 总耗时约 100ms（而不是 200ms）</code></pre>
<p><code>tokio::spawn</code> 则用于”后台运行”——不等待它完成就继续：</p>
<pre><code class="language-rust">use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // spawn 把任务丢到后台，立即返回一个 JoinHandle
    let handle = tokio::spawn(async {
        sleep(Duration::from_millis(100)).await;
        println!("后台任务完成！");
        42  // 任务的返回值
    });

    println!("主任务继续运行...");

    // 等待后台任务完成，获取结果
    let result = handle.await.unwrap();
    println!("后台任务的结果：{}", result);
}</code></pre>
<h1 id="练习题">练习题</h1>
<h2 id="异步编程概念测验">异步编程概念测验</h2>
<div class="quiz-choice" data-block-id="22-advanced/03-async-basics#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%B0%83%E7%94%A8%E4%B8%80%E4%B8%AA%20async%20fn%EF%BC%88%E4%B8%8D%E5%8A%A0%20.await%EF%BC%89%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%87%BD%E6%95%B0%E7%AB%8B%E5%8D%B3%E5%BC%80%E5%A7%8B%E6%89%A7%E8%A1%8C%EF%BC%8C%E4%BD%86%E4%B8%8D%E7%AD%89%E5%BE%85%E7%BB%93%E6%9E%9C%22%2C%22%E5%87%BD%E6%95%B0%E5%9C%A8%E5%90%8E%E5%8F%B0%E5%BC%82%E6%AD%A5%E6%89%A7%E8%A1%8C%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%8A%A0%20.await%22%2C%22%E5%8F%AA%E6%98%AF%E5%88%9B%E5%BB%BA%E4%BA%86%E4%B8%80%E4%B8%AA%20Future%20%E5%AF%B9%E8%B1%A1%EF%BC%8C%E4%BB%80%E4%B9%88%E9%83%BD%E6%B2%A1%E6%89%A7%E8%A1%8C%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22async%20fn%20%E6%98%AF%E6%83%B0%E6%80%A7%E7%9A%84%E2%80%94%E2%80%94%E8%B0%83%E7%94%A8%E5%AE%83%E5%8F%AA%E6%98%AF%E5%88%9B%E5%BB%BA%E4%BA%86%E4%B8%80%E4%B8%AA%E6%8F%8F%E8%BF%B0%5C%22%E5%A6%82%E4%BD%95%E8%AE%A1%E7%AE%97%5C%22%E7%9A%84%20Future%20%E5%AF%B9%E8%B1%A1%EF%BC%8C%E5%AE%9E%E9%99%85%E4%BB%A3%E7%A0%81%E4%B8%80%E8%A1%8C%E9%83%BD%E6%B2%A1%E8%BF%90%E8%A1%8C%E3%80%82%E5%8F%AA%E6%9C%89%E5%AF%B9%E8%BF%99%E4%B8%AA%20Future%20%E8%B0%83%E7%94%A8%20.await%EF%BC%88%E6%88%96%E4%BA%A4%E7%BB%99%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%89%E6%97%B6%EF%BC%8C%E6%89%8D%E4%BC%9A%E7%9C%9F%E6%AD%A3%E5%BC%80%E5%A7%8B%E6%89%A7%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/03-async-basics#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%20Rust%20%E6%A0%87%E5%87%86%E5%BA%93%E4%B8%8D%E5%8C%85%E5%90%AB%E5%BC%82%E6%AD%A5%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%8C%E8%80%8C%E6%98%AF%E8%AE%A9%E7%94%A8%E6%88%B7%E9%80%89%E6%8B%A9%20tokio%20%2F%20async-std%20%E7%AD%89%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%90%E8%A1%8C%E6%97%B6%E5%A4%AA%E5%A4%8D%E6%9D%82%EF%BC%8C%E6%A0%87%E5%87%86%E5%BA%93%E4%B8%8D%E6%8E%A5%E5%8F%97%E5%A4%8D%E6%9D%82%E4%BB%A3%E7%A0%81%22%2C%22%E5%9B%A0%E4%B8%BA%E8%BF%90%E8%A1%8C%E6%97%B6%E9%9C%80%E8%A6%81%E9%A2%9D%E5%A4%96%E5%AE%89%E8%A3%85%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%86%85%E7%BD%AE%22%2C%22%E5%9B%A0%E4%B8%BA%20Rust%20%E5%9B%A2%E9%98%9F%E8%BF%98%E6%B2%A1%E6%9C%89%E6%97%B6%E9%97%B4%E5%AE%9E%E7%8E%B0%22%2C%22%E4%B8%8D%E5%90%8C%E5%9C%BA%E6%99%AF%E9%9C%80%E8%A6%81%E4%B8%8D%E5%90%8C%E7%9A%84%E8%BF%90%E8%A1%8C%E6%97%B6%E7%AD%96%E7%95%A5%EF%BC%88%E5%A6%82%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9C%BA%E6%99%AF%E9%9C%80%E8%A6%81%20no_std%EF%BC%8CWeb%20%E9%9C%80%E8%A6%81%E9%AB%98%E5%B9%B6%E5%8F%91%E8%B0%83%E5%BA%A6%E5%99%A8%EF%BC%89%EF%BC%8C%E7%BB%9F%E4%B8%80%E5%86%85%E7%BD%AE%E7%9A%84%E8%BF%90%E8%A1%8C%E6%97%B6%E6%97%A0%E6%B3%95%E6%BB%A1%E8%B6%B3%E6%89%80%E6%9C%89%E9%9C%80%E6%B1%82%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E5%93%B2%E5%AD%A6%E6%98%AF%5C%22%E6%9C%BA%E5%88%B6%E4%B8%8E%E7%AD%96%E7%95%A5%E5%88%86%E7%A6%BB%5C%22%EF%BC%9AFuture%20trait%20%E6%98%AF%E6%9C%BA%E5%88%B6%EF%BC%88%E7%94%B1%E6%A0%87%E5%87%86%E5%BA%93%E5%AE%9A%E4%B9%89%EF%BC%89%EF%BC%8C%E8%BF%90%E8%A1%8C%E6%97%B6%E6%98%AF%E7%AD%96%E7%95%A5%EF%BC%88%E7%94%B1%E7%94%A8%E6%88%B7%E9%80%89%E6%8B%A9%EF%BC%89%E3%80%82Web%20%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%9C%80%E8%A6%81%E5%A4%9A%E7%BA%BF%E7%A8%8B%E9%AB%98%E5%B9%B6%E5%8F%91%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%88tokio%EF%BC%89%EF%BC%8C%E5%B5%8C%E5%85%A5%E5%BC%8F%E8%AE%BE%E5%A4%87%E5%8F%AF%E8%83%BD%E9%9C%80%E8%A6%81%E5%8D%95%E7%BA%BF%E7%A8%8B%E6%97%A0%E5%A0%86%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%88embassy%EF%BC%89%EF%BC%8C%E8%AE%A9%E7%94%A8%E6%88%B7%E8%87%AA%E5%B7%B1%E9%80%89%E6%8B%A9%E6%9C%80%E5%90%88%E9%80%82%E7%9A%84%E7%AD%96%E7%95%A5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/03-async-basics#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22.await%20%E7%9A%84%E8%A1%8C%E4%B8%BA%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%A6%82%E6%9E%9C%20Future%20%E8%BF%98%E6%9C%AA%E5%AE%8C%E6%88%90%EF%BC%8C%E6%9A%82%E5%81%9C%E5%BD%93%E5%89%8D%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%EF%BC%8C%E8%AE%A9%E8%BF%90%E8%A1%8C%E6%97%B6%E5%8E%BB%E6%89%A7%E8%A1%8C%E5%85%B6%E4%BB%96%E4%BB%BB%E5%8A%A1%EF%BC%9BFuture%20%E5%AE%8C%E6%88%90%E6%97%B6%E6%81%A2%E5%A4%8D%E6%89%A7%E8%A1%8C%22%2C%22%E7%AB%8B%E5%8D%B3%E5%8F%96%E6%B6%88%20Future%22%2C%22%E5%9C%A8%E6%96%B0%E7%BA%BF%E7%A8%8B%E9%87%8C%E8%BF%90%E8%A1%8C%20Future%22%2C%22%E9%98%BB%E5%A1%9E%E5%BD%93%E5%89%8D%E7%BA%BF%E7%A8%8B%EF%BC%8C%E7%9B%B4%E5%88%B0%20Future%20%E5%AE%8C%E6%88%90%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22.await%20%E6%98%AF%E9%9D%9E%E9%98%BB%E5%A1%9E%E7%9A%84%E2%80%94%E2%80%94%E5%AE%83%E4%B8%8D%E6%98%AF%5C%22%E8%AE%A9%E7%BA%BF%E7%A8%8B%E7%AD%89%E7%9D%80%5C%22%EF%BC%8C%E8%80%8C%E6%98%AF%5C%22%E8%AE%A9%E8%BF%99%E4%B8%AA%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E6%9A%82%E5%81%9C%EF%BC%8C%E5%8E%BB%E5%B9%B2%E5%88%AB%E7%9A%84%5C%22%E3%80%82%E7%BA%BF%E7%A8%8B%E8%BF%98%E5%9C%A8%E8%BF%90%E8%A1%8C%EF%BC%8C%E5%8F%AA%E6%98%AF%E5%9C%A8%E5%A4%84%E7%90%86%E5%85%B6%E4%BB%96%E5%B0%B1%E7%BB%AA%E7%9A%84%E4%BB%BB%E5%8A%A1%E3%80%82%E5%BD%93%E8%A2%AB%E7%AD%89%E5%BE%85%E7%9A%84%20Future%20%E5%AE%8C%E6%88%90%E5%90%8E%EF%BC%8C%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BC%9A%E6%81%A2%E5%A4%8D%E8%BF%99%E4%B8%AA%E4%BB%BB%E5%8A%A1%E7%BB%A7%E7%BB%AD%E5%BE%80%E4%B8%8B%E6%89%A7%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/03-async-basics#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22async%2Fawait%20%E6%9C%80%E9%80%82%E5%90%88%E4%BC%98%E5%8C%96%E5%93%AA%E7%B1%BB%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%80%A7%E8%83%BD%EF%BC%9F%22%2C%22options%22%3A%5B%22I%2FO%20%E5%AF%86%E9%9B%86%E5%9E%8B%E7%A8%8B%E5%BA%8F%EF%BC%88%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E3%80%81%E6%96%87%E4%BB%B6%E8%AF%BB%E5%86%99%E3%80%81%E6%95%B0%E6%8D%AE%E5%BA%93%E6%9F%A5%E8%AF%A2%EF%BC%89%22%2C%22%E6%89%80%E6%9C%89%E7%A8%8B%E5%BA%8F%E9%83%BD%E8%83%BD%E5%BE%97%E5%88%B0%E5%90%8C%E7%AD%89%E4%BC%98%E5%8C%96%22%2C%22CPU%20%E5%AF%86%E9%9B%86%E5%9E%8B%E7%A8%8B%E5%BA%8F%EF%BC%88%E5%A4%A7%E9%87%8F%E8%AE%A1%E7%AE%97%E3%80%81%E5%9B%BE%E5%83%8F%E5%A4%84%E7%90%86%E3%80%81%E5%8A%A0%E5%AF%86%EF%BC%89%22%2C%22%E5%86%85%E5%AD%98%E5%AF%86%E9%9B%86%E5%9E%8B%E7%A8%8B%E5%BA%8F%EF%BC%88%E5%A4%A7%E9%87%8F%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D%EF%BC%89%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22async%2Fawait%20%E7%9A%84%E6%A0%B8%E5%BF%83%E6%98%AF%5C%22%E7%AD%89%E5%BE%85%E6%97%B6%E5%88%87%E6%8D%A2%EF%BC%8C%E4%B8%8D%E6%B5%AA%E8%B4%B9%20CPU%5C%22%E3%80%82%E5%8F%AA%E6%9C%89%E5%9C%A8%E7%AD%89%E5%BE%85%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90%EF%BC%88%E7%BD%91%E7%BB%9C%E3%80%81%E7%A3%81%E7%9B%98%E3%80%81%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%89%E6%97%B6%EF%BC%8C%E5%88%87%E6%8D%A2%E6%89%8D%E6%9C%89%E6%84%8F%E4%B9%89%E3%80%82CPU%20%E5%AF%86%E9%9B%86%E5%9E%8B%E4%BB%BB%E5%8A%A1%E6%B2%A1%E6%9C%89%E7%AD%89%E5%BE%85%E2%80%94%E2%80%94CPU%20%E4%B8%80%E7%9B%B4%E5%9C%A8%E5%B7%A5%E4%BD%9C%EF%BC%8C%E5%88%87%E6%8D%A2%E5%8F%8D%E8%80%8C%E6%9C%89%E5%BC%80%E9%94%80%E3%80%82CPU%20%E5%AF%86%E9%9B%86%E4%BB%BB%E5%8A%A1%E7%94%A8%E5%A4%9A%E7%BA%BF%E7%A8%8B%EF%BC%88rayon%EF%BC%89%EF%BC%8CI%2FO%20%E5%AF%86%E9%9B%86%E4%BB%BB%E5%8A%A1%E7%94%A8%E5%BC%82%E6%AD%A5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/03-async-basics#2:4" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%20tokio%3A%3Ajoin!%20%E5%92%8C%20tokio%3A%3Aspawn%EF%BC%8C%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22tokio%3A%3Aspawn%20%E5%B0%86%E4%BB%BB%E5%8A%A1%E6%94%BE%E5%88%B0%E5%90%8E%E5%8F%B0%EF%BC%8C%E5%BD%93%E5%89%8D%E4%BB%A3%E7%A0%81%E4%B8%8D%E7%AD%89%E5%BE%85%E5%AE%83%E5%AE%8C%E6%88%90%E7%AB%8B%E5%8D%B3%E7%BB%A7%E7%BB%AD%22%2C%22tokio%3A%3Ajoin!%20%E4%BC%9A%E5%9C%A8%E6%96%B0%E7%BA%BF%E7%A8%8B%E4%B8%AD%E8%BF%90%E8%A1%8C%E5%90%84%E4%B8%AA%20Future%22%2C%22tokio%3A%3Ajoin!%20%E5%B9%B6%E5%8F%91%E8%BF%90%E8%A1%8C%E5%A4%9A%E4%B8%AA%20Future%EF%BC%8C%E7%AD%89%E5%BE%85%E5%85%A8%E9%83%A8%E5%AE%8C%E6%88%90%E5%90%8E%E5%86%8D%E7%BB%A7%E7%BB%AD%22%2C%22tokio%3A%3Aspawn%20%E5%92%8C%20std%3A%3Athread%3A%3Aspawn%20%E7%9A%84%E5%8A%9F%E8%83%BD%E5%AE%8C%E5%85%A8%E7%AD%89%E4%BB%B7%22%5D%2C%22correct%22%3A%5B0%2C2%5D%2C%22explanation%22%3A%22join!%20%E6%98%AF%5C%22%E5%B9%B6%E5%8F%91%E7%AD%89%E5%BE%85%5C%22%EF%BC%9A%E5%9C%A8%E5%BD%93%E5%89%8D%E4%BB%BB%E5%8A%A1%E5%86%85%E5%B9%B6%E5%8F%91%E6%8E%A8%E8%BF%9B%E5%A4%9A%E4%B8%AA%20Future%EF%BC%8C%E5%85%A8%E9%83%A8%E5%AE%8C%E6%88%90%E6%89%8D%E7%BB%A7%E7%BB%AD%EF%BC%8C%E4%B8%8D%E5%88%9B%E5%BB%BA%E6%96%B0%E7%BA%BF%E7%A8%8B%E3%80%82spawn%20%E6%98%AF%5C%22%E5%90%8E%E5%8F%B0%E8%BF%90%E8%A1%8C%5C%22%EF%BC%9A%E6%8A%8A%E4%BB%BB%E5%8A%A1%E6%8F%90%E4%BA%A4%E7%BB%99%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%8C%E5%BD%93%E5%89%8D%E4%BB%A3%E7%A0%81%E7%AB%8B%E5%8D%B3%E7%BB%A7%E7%BB%AD%EF%BC%8C%E9%80%9A%E8%BF%87%20JoinHandle.await%20%E5%8F%96%E5%9B%9E%E7%BB%93%E6%9E%9C%E3%80%82thread%3A%3Aspawn%20%E5%88%9B%E5%BB%BA%E7%9C%9F%E5%AE%9E%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%BA%BF%E7%A8%8B%EF%BC%8Ctokio%3A%3Aspawn%20%E5%88%9B%E5%BB%BA%E7%9A%84%E6%98%AF%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%9A%84%5C%22%E7%BB%BF%E8%89%B2%E7%BA%BF%E7%A8%8B%5C%22%EF%BC%88%E5%8D%8F%E7%A8%8B%EF%BC%89%EF%BC%8C%E4%BB%A3%E4%BB%B7%E5%B0%8F%E5%BE%97%E5%A4%9A%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
