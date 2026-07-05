---
chapterId: "14-concurrency"
lessonId: "04-sync-send"
title: "Send 与 Sync"
level: "进阶"
duration: "20 分钟"
tags: ["Send", "Sync", "标记trait", "线程安全", "Arc", "Rc"]
number: "14.4"
chapterTitle: "并发编程"
chapterNumber: "14"
---

<div id="article-content"> <h1 id="两个神奇的标记-trait">两个神奇的标记 Trait</h1>
<p>前几节我们看到编译器拒绝了 <code>Rc&lt;T&gt;</code> 跨线程使用，接受了 <code>Arc&lt;T&gt;</code>。编译器是怎么知道谁能跨线程、谁不能的？答案就是两个内置于语言核心的标记 trait：<code>Send</code> 和 <code>Sync</code>。</p>
<p>它们定义在 <code>std::marker</code> 中，没有任何方法，只是一个「标签」——打上这个标签，就等于向编译器声明：「这个类型在多线程场景下是安全的。」</p>
<h2 id="为什么需要标记-trait">为什么需要标记 Trait</h2>
<p>Rust 的所有权系统在单线程下已经能防止大量 bug。但多线程带来了新的问题：</p>
<ul>
<li><strong>数据竞争</strong>：两个线程同时读写同一块内存，且至少有一个是写操作</li>
<li><strong>悬空指针</strong>：一个线程释放了数据，另一个线程还持有指向它的引用</li>
</ul>
<p><code>Send</code> 和 <code>Sync</code> 两个标记 trait，让编译器能在<strong>编译期</strong>就把这些问题拦截住。</p>
<h1 id="send可以跨线程转移所有权">Send：可以跨线程转移所有权</h1>
<h2 id="什么是-send">什么是 Send</h2>
<p>实现了 <code>Send</code> 的类型，其<strong>所有权</strong>可以安全地转移到另一个线程。</p>
<p>简单来说：如果你能把一个值 <code>move</code> 进 <code>thread::spawn</code> 的闭包，这个值就必须是 <code>Send</code> 的。</p>
<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%2F%2F%20String%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Send%0A%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%A2%AB%20move%20%E5%88%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E7%BA%BF%E7%A8%8B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20handle.join().unwrap()%3B%0A%7D" data-mode="run"><pre><code class="language-rust">use std::thread;

fn main() {
    let s = String::from("hello"); // String 实现了 Send

    let handle = thread::spawn(move || {
        // s 的所有权被 move 到了这个线程
        println!("{}", s);
    });

    handle.join().unwrap();
}</code></pre></div>
<p><code>String</code> 实现了 <code>Send</code>，所以可以安全地移入子线程。</p>
<h2 id="哪些类型不是-send">哪些类型不是 Send</h2>
<p>最典型的是 <code>Rc&lt;T&gt;</code>：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Arc%3A%3ARc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rc%20%3D%20Rc%3A%3Anew(42)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ARc%3Ci32%3E%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Send%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20rc)%3B%0A%20%20%20%20%7D)%3B%0A%7D" data-mode="expect-error"><pre><code class="language-rust">use std::rc::Rc;
use std::thread;

fn main() {
    let rc = Rc::new(42);

    thread::spawn(move || {
        // 编译错误：Rc&lt;i32&gt; 没有实现 Send
        println!("{}", rc);
    });
}</code></pre></div>
<p>为什么 <code>Rc&lt;T&gt;</code> 不是 <code>Send</code>？因为 <code>Rc</code> 的引用计数是普通整数操作，不是原子的。如果两个线程同时克隆同一个 <code>Rc</code>，会同时修改引用计数，导致计数错乱，引发内存安全问题。</p>
<p><code>Arc&lt;T&gt;</code> 用原子操作来更新计数，所以是 <code>Send</code> 的。</p>
<h2 id="自动推导规则">自动推导规则</h2>
<ul>
<li>完全由 <code>Send</code> 类型组成的类型，自动是 <code>Send</code></li>
<li>基本类型（<code>i32</code>、<code>bool</code>、<code>String</code> 等）几乎都是 <code>Send</code></li>
<li>含有非 <code>Send</code> 类型字段的结构体，自动不是 <code>Send</code></li>
</ul>
<h1 id="sync可以被多线程共享引用">Sync：可以被多线程共享引用</h1>
<h2 id="从-send-到-sync">从 Send 到 Sync</h2>
<p><code>Send</code> 解决的是「<strong>转移</strong>所有权」的问题——值从一个线程移动到另一个线程。</p>
<p>但有时候我们不想转移，只想<strong>共享</strong>：主线程有一份数据，多个子线程都拿到它的引用，同时去读它。这就是 <code>Sync</code> 解决的问题。</p>
<blockquote>
<p><strong>定义</strong>：如果类型 <code>T</code> 是 <code>Sync</code> 的，则 <code>&amp;T</code>（对 T 的不可变引用）可以安全地同时存在于多个线程中。</p>
</blockquote>
<p>换个更直观的说法：<strong>多个线程同时读同一个值，不会出问题</strong>，这个类型就是 <code>Sync</code>。</p>
<h2 id="最简单的例子只读共享">最简单的例子：只读共享</h2>
<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AArc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Arc%20%E8%AE%A9%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%85%B1%E4%BA%AB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E5%86%85%E9%83%A8%E7%9A%84%20Vec%20%E6%98%AF%20Sync%20%E7%9A%84%EF%BC%88%E5%8F%AA%E8%AF%BB%EF%BC%89%0A%20%20%20%20let%20data%20%3D%20Arc%3A%3Anew(vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D)%3B%0A%0A%20%20%20%20let%20mut%20handles%20%3D%20vec!%5B%5D%3B%0A%20%20%20%20for%20i%20in%200..3%20%7B%0A%20%20%20%20%20%20%20%20let%20data%20%3D%20Arc%3A%3Aclone(%26data)%3B%0A%20%20%20%20%20%20%20%20handles.push(thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E6%8C%81%E6%9C%89%20%26Vec%3Ci32%3E%EF%BC%8C%E5%8F%AA%E8%AF%BB%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%AE%89%E5%85%A8%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E7%BA%BF%E7%A8%8B%20%7B%7D%20%E7%9C%8B%E5%88%B0%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20i%2C%20data.len())%3B%0A%20%20%20%20%20%20%20%20%7D))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20for%20h%20in%20handles%20%7B%20h.join().unwrap()%3B%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">use std::sync::Arc;
use std::thread;

fn main() {
    // Arc 让多个线程共享所有权，内部的 Vec 是 Sync 的（只读）
    let data = Arc::new(vec![1, 2, 3, 4, 5]);

    let mut handles = vec![];
    for i in 0..3 {
        let data = Arc::clone(&amp;data);
        handles.push(thread::spawn(move || {
            // 多个线程同时持有 &amp;Vec&lt;i32&gt;，只读，完全安全
            println!("线程 {} 看到长度：{}", i, data.len());
        }));
    }

    for h in handles { h.join().unwrap(); }
}</code></pre></div>
<p><code>Vec&lt;i32&gt;</code> 是 <code>Sync</code> 的，因为多个线程同时<strong>读</strong>它不会产生任何问题——没有人在改它，不会有竞争。</p>
<h2 id="为什么-refcellt-不是-sync">为什么 RefCell&lt;T&gt; 不是 Sync</h2>
<p><code>RefCell&lt;T&gt;</code> 内部有一个<strong>借用计数器</strong>（一个整数），记录当前有几个活跃的借用。每次调用 <code>borrow()</code> 或 <code>borrow_mut()</code> 都要修改这个计数器。</p>
<p>问题在于：这个计数器的修改<strong>不是原子的</strong>。</p>
<p>想象两个线程同时对同一个 <code>RefCell</code> 调用 <code>borrow()</code>：</p>
<ol>
<li>线程 A 读到计数器是 0</li>
<li>线程 B 读到计数器也是 0</li>
<li>线程 A 把计数器写成 1（“我借用了”）</li>
<li>线程 B 把计数器也写成 1（覆盖了 A 的写入！）</li>
</ol>
<p>现在计数器是 1，但实际有两个活跃借用——借用规则被悄悄破坏了，后续可能出现两个可变借用同时存在的情况，导致数据竞争。</p>
<p>所以编译器禁止把 <code>RefCell</code> 的引用共享给多个线程：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Acell%3A%3ARefCell%3B%0Ause%20std%3A%3Async%3A%3AArc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20Arc%3A%3Anew(RefCell%3A%3Anew(0))%3B%0A%20%20%20%20let%20data2%20%3D%20Arc%3A%3Aclone(%26data)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ARefCell%3Ci32%3E%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Sync%0A%20%20%20%20%20%20%20%20%2F%2F%20Arc%20%E5%86%85%E9%83%A8%E7%9A%84%20%26RefCell%3Ci32%3E%20%E4%B8%8D%E8%83%BD%E5%AE%89%E5%85%A8%E5%9C%B0%E8%B7%A8%E7%BA%BF%E7%A8%8B%E5%85%B1%E4%BA%AB%0A%20%20%20%20%20%20%20%20*data2.borrow_mut()%20%2B%3D%201%3B%0A%20%20%20%20%7D)%3B%0A%7D" data-mode="expect-error"><pre><code class="language-rust">use std::cell::RefCell;
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(RefCell::new(0));
    let data2 = Arc::clone(&amp;data);

    thread::spawn(move || {
        // 编译错误：RefCell&lt;i32&gt; 没有实现 Sync
        // Arc 内部的 &amp;RefCell&lt;i32&gt; 不能安全地跨线程共享
        *data2.borrow_mut() += 1;
    });
}</code></pre></div>
<h2 id="mutext-是-sync-的原因">Mutex&lt;T&gt; 是 Sync 的原因</h2>
<p><code>Mutex&lt;T&gt;</code> 也保护内部数据，但它用<strong>操作系统锁</strong>来保证互斥，而不是一个普通整数计数器。任何线程想访问数据都必须先拿锁，拿不到就阻塞——不可能有两个线程同时进入临界区。</p>
<p>因此 <code>Mutex&lt;T&gt;</code> 的引用可以安全地在多个线程间共享，它是 <code>Sync</code> 的。</p>
<h2 id="send-与-sync-的关系">Send 与 Sync 的关系</h2>
<p>两者可以用一句话总结：</p>
<table><thead><tr><th>Trait</th><th>保证的事</th><th>典型场景</th></tr></thead><tbody><tr><td><code>Send</code></td><td><strong>所有权</strong>可以转移到另一个线程</td><td><code>move</code> 闭包</td></tr><tr><td><code>Sync</code></td><td><strong>引用</strong>可以同时存在于多个线程</td><td><code>Arc&lt;T&gt;</code> 包裹后共享</td></tr></tbody></table>
<p>它们之间有一个数学关系：<strong>如果 <code>&amp;T</code> 是 <code>Send</code>，则 <code>T</code> 就是 <code>Sync</code></strong>。</p>
<p>理解这句话：<code>&amp;T</code> 是 <code>Send</code> 意味着”这个引用可以安全地发送到另一个线程”，也就是说另一个线程拿着 <code>&amp;T</code> 读数据不会出问题——这正好就是 <code>Sync</code> 的定义。</p>
<h2 id="常见类型的-send--sync-一览">常见类型的 Send / Sync 一览</h2>
<table><thead><tr><th>类型</th><th>Send</th><th>Sync</th><th>原因</th></tr></thead><tbody><tr><td><code>i32</code>, <code>bool</code>, <code>String</code></td><td>✅</td><td>✅</td><td>基本类型，无共享状态</td></tr><tr><td><code>Rc&lt;T&gt;</code></td><td>❌</td><td>❌</td><td>引用计数非原子</td></tr><tr><td><code>Arc&lt;T&gt;</code></td><td>✅</td><td>✅</td><td>引用计数原子操作</td></tr><tr><td><code>Mutex&lt;T&gt;</code></td><td>✅ (T: Send)</td><td>✅</td><td>OS 锁保证互斥</td></tr><tr><td><code>RefCell&lt;T&gt;</code></td><td>✅ (T: Send)</td><td>❌</td><td>借用检查非原子</td></tr><tr><td><code>*mut T</code>（裸指针）</td><td>❌</td><td>❌</td><td>无安全保证</td></tr></tbody></table>
<h1 id="练习题">练习题</h1>
<h2 id="测验">测验</h2>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:0" data-kind="single" data-payload="%7B%22question%22%3A%22Send%20trait%20%E7%9A%84%E5%90%AB%E4%B9%89%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%B1%BB%E5%9E%8B%E5%8F%AF%E4%BB%A5%E5%8F%91%E9%80%81%E7%BD%91%E7%BB%9C%E6%B6%88%E6%81%AF%22%2C%22%E7%B1%BB%E5%9E%8B%E5%8F%AF%E4%BB%A5%E8%A2%AB%E5%A4%8D%E5%88%B6%E5%88%B0%E5%85%B6%E4%BB%96%E7%BA%BF%E7%A8%8B%22%2C%22%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%8F%AF%E4%BB%A5%E5%AE%89%E5%85%A8%E5%9C%B0%E8%BD%AC%E7%A7%BB%E5%88%B0%E5%8F%A6%E4%B8%80%E4%B8%AA%E7%BA%BF%E7%A8%8B%22%2C%22%E7%B1%BB%E5%9E%8B%E5%AE%9E%E7%8E%B0%E4%BA%86%E5%BA%8F%E5%88%97%E5%8C%96%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Send%20%E8%A1%A8%E7%A4%BA%5C%22%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%5C%22%E6%98%AF%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E3%80%82move%20%E8%BF%9B%20thread%3A%3Aspawn%20%E9%97%AD%E5%8C%85%E7%9A%84%E5%80%BC%E5%BF%85%E9%A1%BB%E5%AE%9E%E7%8E%B0%20Send%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:1" data-kind="single" data-payload="%7B%22question%22%3A%22Sync%20trait%20%E7%9A%84%E5%90%AB%E4%B9%89%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%B1%BB%E5%9E%8B%E5%8F%AF%E4%BB%A5%E8%A2%AB%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E4%BF%AE%E6%94%B9%22%2C%22%E7%B1%BB%E5%9E%8B%E5%8F%AF%E4%BB%A5%E5%90%8C%E6%AD%A5%E5%88%B0%E7%A3%81%E7%9B%98%22%2C%22%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%BC%95%E7%94%A8%EF%BC%88%26T%EF%BC%89%E5%8F%AF%E4%BB%A5%E5%AE%89%E5%85%A8%E5%9C%B0%E5%9C%A8%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E9%97%B4%E5%85%B1%E4%BA%AB%22%2C%22%E7%B1%BB%E5%9E%8B%E5%AE%9E%E7%8E%B0%E4%BA%86%E5%90%8C%E6%AD%A5%E5%8E%9F%E8%AF%AD%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Sync%20%E8%A1%A8%E7%A4%BA%5C%22%E5%85%B1%E4%BA%AB%E5%BC%95%E7%94%A8%5C%22%E6%98%AF%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E3%80%82%E5%A6%82%E6%9E%9C%20%26T%20%E6%98%AF%20Send%EF%BC%8C%E5%88%99%20T%20%E5%B0%B1%E6%98%AF%20Sync%E3%80%82%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E6%8C%81%E6%9C%89%E5%90%8C%E4%B8%80%E4%B8%AA%E5%80%BC%E7%9A%84%E5%BC%95%E7%94%A8%E4%B8%8D%E4%BC%9A%E4%BA%A7%E7%94%9F%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%20Rc%3CT%3E%20%E6%97%A2%E4%B8%8D%E6%98%AF%20Send%20%E4%B9%9F%E4%B8%8D%E6%98%AF%20Sync%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%20Rc%20%E7%9A%84%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%E6%93%8D%E4%BD%9C%E4%B8%8D%E6%98%AF%E5%8E%9F%E5%AD%90%E7%9A%84%EF%BC%8C%E5%A4%9A%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E4%BF%AE%E6%94%B9%E8%AE%A1%E6%95%B0%E4%BC%9A%E5%AF%BC%E8%87%B4%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98%22%2C%22%E5%9B%A0%E4%B8%BA%20Rc%20%E5%8F%AA%E8%83%BD%E5%AD%98%E5%82%A8%E4%B8%8D%E5%8F%AF%E5%8F%98%E6%95%B0%E6%8D%AE%22%2C%22%E5%9B%A0%E4%B8%BA%20Rc%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Clone%22%2C%22%E5%9B%A0%E4%B8%BA%20Rc%20%E6%80%A7%E8%83%BD%E5%A4%AA%E5%B7%AE%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E9%9D%9E%E5%8E%9F%E5%AD%90%E7%9A%84%E6%95%B4%E6%95%B0%E6%93%8D%E4%BD%9C%E5%9C%A8%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%8B%E4%BC%9A%E4%BA%A7%E7%94%9F%E7%AB%9E%E4%BA%89%EF%BC%9A%E4%B8%A4%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%20clone%20Rc%20%E4%BC%9A%E5%90%8C%E6%97%B6%E8%AF%BB-%E6%94%B9-%E5%86%99%E5%90%8C%E4%B8%80%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%8C%E7%BB%93%E6%9E%9C%E4%B8%8D%E5%8F%AF%E9%A2%84%E6%9C%9F%EF%BC%8C%E5%8F%AF%E8%83%BD%E5%AF%BC%E8%87%B4%E6%8F%90%E5%89%8D%E9%87%8A%E6%94%BE%E6%88%96%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:3" data-kind="single" data-payload="%7B%22question%22%3A%22RefCell%3CT%3E%20%E6%98%AF%20Send%20%E4%BD%86%E4%B8%8D%E6%98%AF%20Sync%EF%BC%8C%E8%BF%99%E6%84%8F%E5%91%B3%E7%9D%80%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AF%E4%BB%A5%E5%9C%A8%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%AD%E5%85%B1%E4%BA%AB%E5%BC%95%E7%94%A8%EF%BC%8C%E4%BD%86%E4%B8%8D%E8%83%BD%20move%20%E6%89%80%E6%9C%89%E6%9D%83%22%2C%22%E5%9C%A8%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%AD%E5%AE%8C%E5%85%A8%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%22%2C%22%E6%97%A2%E4%B8%8D%E8%83%BD%20move%20%E4%B9%9F%E4%B8%8D%E8%83%BD%E5%85%B1%E4%BA%AB%E5%BC%95%E7%94%A8%22%2C%22%E5%8F%AF%E4%BB%A5%E6%8A%8A%20RefCell%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%20move%20%E8%BF%9B%E5%8F%A6%E4%B8%80%E4%B8%AA%E7%BA%BF%E7%A8%8B%EF%BC%88%E5%8D%95%E7%8B%AC%E4%BD%BF%E7%94%A8%EF%BC%89%EF%BC%8C%E4%BD%86%E4%B8%8D%E8%83%BD%E8%AE%A9%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E6%8C%81%E6%9C%89%E5%AE%83%E7%9A%84%E5%BC%95%E7%94%A8%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22RefCell%20%E7%9A%84%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E7%8A%B6%E6%80%81%EF%BC%88%E8%BF%90%E8%A1%8C%E6%97%B6%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%89%E4%B8%8D%E6%98%AF%E5%8E%9F%E5%AD%90%E7%9A%84%EF%BC%8C%E6%89%80%E4%BB%A5%E4%B8%8D%E8%83%BD%E8%A2%AB%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E8%AE%BF%E9%97%AE%EF%BC%88%E5%8D%B3%E4%B8%8D%E6%98%AF%20Sync%EF%BC%89%E3%80%82%E4%BD%86%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%E7%BB%99%E5%8D%95%E4%B8%AA%E6%96%B0%E7%BA%BF%E7%A8%8B%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%EF%BC%88%E5%8D%B3%E6%98%AF%20Send%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E4%BD%A0%E5%AE%9A%E4%B9%89%E4%BA%86%E4%B8%80%E4%B8%AA%E7%BB%93%E6%9E%84%E4%BD%93%20struct%20Wrapper(Rc%3Ci32%3E)%EF%BC%8C%E5%AE%83%E6%98%AF%20Send%20%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%96%E5%86%B3%E4%BA%8E%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E8%BF%99%E4%B8%AA%E7%BB%93%E6%9E%84%E4%BD%93%22%2C%22%E6%98%AF%E7%9A%84%EF%BC%8C%E5%9B%A0%E4%B8%BA%20i32%20%E6%98%AF%20Send%22%2C%22%E6%98%AF%E7%9A%84%EF%BC%8C%E5%9B%A0%E4%B8%BA%E7%BB%93%E6%9E%84%E4%BD%93%E9%BB%98%E8%AE%A4%E6%98%AF%20Send%22%2C%22%E4%B8%8D%E6%98%AF%EF%BC%8C%E5%9B%A0%E4%B8%BA%E5%90%AB%E6%9C%89%E9%9D%9E%20Send%20%E7%9A%84%E5%AD%97%E6%AE%B5%EF%BC%88Rc%3Ci32%3E%EF%BC%89%EF%BC%8C%E6%95%B4%E4%B8%AA%E7%BB%93%E6%9E%84%E4%BD%93%E8%87%AA%E5%8A%A8%E5%8F%98%E4%B8%BA%E9%9D%9E%20Send%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22Send%20%E7%9A%84%E8%87%AA%E5%8A%A8%E6%8E%A8%E5%AF%BC%E6%98%AF%E4%BF%9D%E5%AE%88%E7%9A%84%EF%BC%9A%E5%8F%AA%E8%A6%81%E6%9C%89%E4%B8%80%E4%B8%AA%E5%AD%97%E6%AE%B5%E4%B8%8D%E6%98%AF%20Send%EF%BC%8C%E6%95%B4%E4%B8%AA%E7%B1%BB%E5%9E%8B%E5%B0%B1%E4%B8%8D%E6%98%AF%20Send%E3%80%82%E8%BF%99%E7%A1%AE%E4%BF%9D%E4%BA%86%E5%AE%89%E5%85%A8%E6%80%A7%E7%9A%84%E4%BC%A0%E9%80%92%E6%80%A7%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/04-sync-send#3:5" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E7%A7%8D%E7%BB%84%E5%90%88%E5%9C%A8%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%AD%E6%97%A2%E8%83%BD%E5%85%B1%E4%BA%AB%E6%89%80%E6%9C%89%E6%9D%83%E5%8F%88%E8%83%BD%E5%AE%89%E5%85%A8%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%EF%BC%9F%22%2C%22options%22%3A%5B%22Arc%3CMutex%3CT%3E%3E%22%2C%22Rc%3CRefCell%3CT%3E%3E%22%2C%22Arc%3CRefCell%3CT%3E%3E%22%2C%22Rc%3CMutex%3CT%3E%3E%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Arc%20%E6%8F%90%E4%BE%9B%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E5%A4%9A%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%88%E5%AE%9E%E7%8E%B0%E4%BA%86%20Send%20%2B%20Sync%EF%BC%89%EF%BC%8CMutex%20%E6%8F%90%E4%BE%9B%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E4%BA%92%E6%96%A5%E4%BF%AE%E6%94%B9%EF%BC%88%E5%AE%9E%E7%8E%B0%E4%BA%86%20Sync%EF%BC%89%E3%80%82Rc%20%E5%92%8C%20RefCell%20%E9%83%BD%E4%B8%8D%E6%98%AF%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
