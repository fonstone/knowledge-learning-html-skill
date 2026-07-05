---
chapterId: "14-concurrency"
lessonId: "02-channels"
title: "消息传递"
level: "进阶"
duration: "20 分钟"
tags: ["通道", "mpsc", "消息传递", "发送者", "接收者", "并发"]
number: "14.2"
chapterTitle: "并发编程"
chapterNumber: "14"
---

<div id="article-content"> <h1 id="通道线程间的单行道">通道：线程间的单行道</h1>
<p>Go 语言有一句著名的口号：“<strong>不要通过共享内存来通信，而要通过通信来共享内存。</strong>”</p>
<p>这句话描述了一种并发思路：与其让多个线程同时读写同一块内存（复杂、危险），不如给每个线程一个”收件箱”，线程之间传递消息，接收方从自己的收件箱里取数据。</p>
<p>Rust 标准库提供了<strong>通道</strong>（channel）来实现这个模式。</p>
<h2 id="什么是-mpsc-通道">什么是 mpsc 通道</h2>
<p><code>std::sync::mpsc</code> 里的 <code>mpsc</code> 是 <strong>Multiple Producer, Single Consumer</strong> 的缩写——<strong>多个发送者、一个接收者</strong>。</p>
<p>可以把通道想象成一条传送带：</p>
<ul>
<li><strong>发送端</strong>（<code>Sender&lt;T&gt;</code>）：往传送带上放东西</li>
<li><strong>接收端</strong>（<code>Receiver&lt;T&gt;</code>）：从传送带末端取东西</li>
<li>传送带只有一个出口，但入口可以有多个（克隆发送端）</li>
</ul>
<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20channel()%20%E8%BF%94%E5%9B%9E%20(%E5%8F%91%E9%80%81%E7%AB%AF%2C%20%E6%8E%A5%E6%94%B6%E7%AB%AF)%20%E7%9A%84%E5%85%83%E7%BB%84%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E6%8A%8A%20tx%20%E7%A7%BB%E5%85%A5%E5%AD%90%E7%BA%BF%E7%A8%8B%EF%BC%8C%E5%8F%91%E9%80%81%E4%B8%80%E6%9D%A1%E6%B6%88%E6%81%AF%0A%20%20%20%20%20%20%20%20tx.send(String%3A%3Afrom(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%B8%BB%E7%BA%BF%E7%A8%8B%EF%BC%81%22)).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20recv()%20%E4%BC%9A%E9%98%BB%E5%A1%9E%EF%BC%8C%E7%9B%B4%E5%88%B0%E6%9C%89%E6%B6%88%E6%81%AF%E5%88%B0%E6%9D%A5%0A%20%20%20%20let%20msg%20%3D%20rx.recv().unwrap()%3B%0A%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20msg)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">use std::sync::mpsc;
use std::thread;

fn main() {
    // channel() 返回 (发送端, 接收端) 的元组
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        // 把 tx 移入子线程，发送一条消息
        tx.send(String::from("你好，主线程！")).unwrap();
    });

    // recv() 会阻塞，直到有消息到来
    let msg = rx.recv().unwrap();
    println!("收到：{}", msg);
}</code></pre></div>
<h2 id="发送与接收">发送与接收</h2>
<p>接收端有两个方法：</p>
<table><thead><tr><th>方法</th><th>行为</th></tr></thead><tbody><tr><td><code>rx.recv()</code></td><td><strong>阻塞</strong>等待，有消息则返回 <code>Ok(T)</code>，通道关闭则返回 <code>Err</code></td></tr><tr><td><code>rx.try_recv()</code></td><td><strong>立即返回</strong>，有消息返回 <code>Ok(T)</code>，暂无消息返回 <code>Err</code>（不阻塞）</td></tr></tbody></table>
<p>当发送端被丢弃（所有 <code>tx</code> 都 drop 了），通道关闭，<code>recv()</code> 会返回 <code>Err</code>。</p>
<h2 id="所有权与消息传递">所有权与消息传递</h2>
<p>通道传值会<strong>转移所有权</strong>，这是 Rust 并发安全的关键之一：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20val%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%20%20%20%20tx.send(val).unwrap()%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9Aval%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%BB%8F%E8%BD%AC%E7%A7%BB%E7%BB%99%E9%80%9A%E9%81%93%E4%BA%86%EF%BC%8C%E8%BF%99%E9%87%8C%E4%B8%8D%E8%83%BD%E5%86%8D%E7%94%A8%0A%20%20%20%20%20%20%20%20println!(%22val%20%3D%20%7B%7D%22%2C%20val)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20rx.recv().unwrap())%3B%0A%7D" data-mode="expect-error"><pre><code class="language-rust">use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hello");
        tx.send(val).unwrap();
        // 编译错误：val 的所有权已经转移给通道了，这里不能再用
        println!("val = {}", val);
    });

    println!("收到：{}", rx.recv().unwrap());
}</code></pre></div>
<p><code>send(val)</code> 的签名是 <code>fn send(&amp;self, t: T) -&gt; Result&lt;...&gt;</code>，它会<strong>消耗</strong> <code>val</code>。这防止了”已发送的数据还被发送方修改”这类竞争 bug。</p>
<h1 id="发送多条消息">发送多条消息</h1>
<h2 id="把接收端当迭代器">把接收端当迭代器</h2>
<p>实际场景里子线程往往需要发送多条消息。可以把 <code>rx</code> 当作迭代器来遍历，通道关闭后迭代自动结束：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0Ause%20std%3A%3Atime%3A%3ADuration%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20items%20%3D%20vec!%5B%22%E8%8B%B9%E6%9E%9C%22%2C%20%22%E9%A6%99%E8%95%89%22%2C%20%22%E6%A9%99%E5%AD%90%22%2C%20%22%E8%91%A1%E8%90%84%22%5D%3B%0A%20%20%20%20%20%20%20%20for%20item%20in%20items%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tx.send(item).unwrap()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(100))%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%2F%2F%20tx%20%E5%9C%A8%E8%BF%99%E9%87%8C%20drop%EF%BC%8C%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%EF%BC%8Crx%20%E7%9A%84%E8%BF%AD%E4%BB%A3%E9%9A%8F%E4%B9%8B%E7%BB%93%E6%9D%9F%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20for%20received%20in%20rx%20%E4%BC%9A%E9%98%BB%E5%A1%9E%E7%AD%89%E5%BE%85%EF%BC%8C%E7%9B%B4%E5%88%B0%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%0A%20%20%20%20for%20received%20in%20rx%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20received)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E6%B6%88%E6%81%AF%E6%8E%A5%E6%94%B6%E5%AE%8C%E6%AF%95%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let items = vec!["苹果", "香蕉", "橙子", "葡萄"];
        for item in items {
            tx.send(item).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
        // tx 在这里 drop，通道关闭，rx 的迭代随之结束
    });

    // for received in rx 会阻塞等待，直到通道关闭
    for received in rx {
        println!("收到：{}", received);
    }

    println!("所有消息接收完毕");
}</code></pre></div>
<h2 id="多生产者克隆发送端">多生产者：克隆发送端</h2>
<p><code>mpsc</code> 的 <strong>M</strong>（Multiple Producer）体现在：你可以克隆发送端，让多个线程各自往同一个通道里发消息：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20%2F%2F%20%E5%85%8B%E9%9A%86%E4%B8%80%E4%BB%BD%E5%8F%91%E9%80%81%E7%AB%AF%E7%BB%99%E7%AC%AC%E4%BA%8C%E4%B8%AA%E7%BA%BF%E7%A8%8B%0A%20%20%20%20let%20tx2%20%3D%20tx.clone()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20tx.send(%22%E6%9D%A5%E8%87%AA%E7%BA%BF%E7%A8%8B%201%20%E7%9A%84%E6%B6%88%E6%81%AF%22).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20tx2.send(%22%E6%9D%A5%E8%87%AA%E7%BA%BF%E7%A8%8B%202%20%E7%9A%84%E6%B6%88%E6%81%AF%22).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%8E%A5%E6%94%B6%E4%B8%A4%E6%9D%A1%E6%B6%88%E6%81%AF%EF%BC%88%E9%A1%BA%E5%BA%8F%E4%B8%8D%E7%A1%AE%E5%AE%9A%EF%BC%89%0A%20%20%20%20for%20_%20in%200..2%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20rx.recv().unwrap())%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    // 克隆一份发送端给第二个线程
    let tx2 = tx.clone();

    thread::spawn(move || {
        tx.send("来自线程 1 的消息").unwrap();
    });

    thread::spawn(move || {
        tx2.send("来自线程 2 的消息").unwrap();
    });

    // 接收两条消息（顺序不确定）
    for _ in 0..2 {
        println!("{}", rx.recv().unwrap());
    }
}</code></pre></div>
<p>两个线程各自拥有一个发送端，谁先发到就先收到谁的。接收端仍然只有一个。</p>
<h1 id="练习题">练习题</h1>
<h2 id="测验">测验</h2>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22mpsc%20%E6%98%AF%E4%BB%80%E4%B9%88%E6%84%8F%E6%80%9D%EF%BC%9F%22%2C%22options%22%3A%5B%22Multi-thread%20Parallel%20Safety%20Channel%22%2C%22Multiple%20Process%2C%20Single%20Channel%22%2C%22Message%20Passing%20Standard%20Channel%22%2C%22Multiple%20Producer%2C%20Single%20Consumer%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22mpsc%20%3D%20Multiple%20Producer%2C%20Single%20Consumer%EF%BC%8C%E5%8D%B3%E5%A4%9A%E4%B8%AA%E5%8F%91%E9%80%81%E7%AB%AF%E3%80%81%E5%8D%95%E4%B8%AA%E6%8E%A5%E6%94%B6%E7%AB%AF%E3%80%82%E8%BF%99%E6%98%AF%20Rust%20%E6%A0%87%E5%87%86%E5%BA%93%E9%80%9A%E9%81%93%E7%9A%84%E8%AE%BE%E8%AE%A1%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%85%B3%E4%BA%8E%20send(val)%20%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E5%93%AA%E4%B8%AA%E6%AD%A3%E7%A1%AE%EF%BC%9F%22%2C%22options%22%3A%5B%22send%20%E8%BF%94%E5%9B%9E%20val%20%E7%9A%84%E4%B8%80%E4%B8%AA%E5%85%8B%E9%9A%86%22%2C%22send%20%E4%BC%9A%E6%B6%88%E8%80%97%20val%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E4%B9%8B%E5%90%8E%20val%20%E4%B8%8D%E5%8F%AF%E5%86%8D%E7%94%A8%22%2C%22send%20%E5%8F%AA%E5%8F%91%E9%80%81%E5%BC%95%E7%94%A8%EF%BC%8Cval%20%E4%BB%8D%E5%BD%92%E5%8F%91%E9%80%81%E6%96%B9%E6%89%80%E6%9C%89%22%2C%22send%20%E4%BC%9A%E5%A4%8D%E5%88%B6%20val%EF%BC%8C%E5%8E%9F%E5%8F%98%E9%87%8F%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22send%20%E7%9A%84%E5%8F%82%E6%95%B0%E6%98%AF%20T%EF%BC%88%E4%B8%8D%E6%98%AF%E5%BC%95%E7%94%A8%EF%BC%89%EF%BC%8C%E8%B0%83%E7%94%A8%E5%90%8E%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%E9%80%9A%E9%81%93%EF%BC%8C%E8%BF%99%E9%98%B2%E6%AD%A2%E4%BA%86%E5%8F%91%E9%80%81%E6%96%B9%E5%9C%A8%E5%8F%91%E9%80%81%E5%90%8E%E7%BB%A7%E7%BB%AD%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%EF%BC%8C%E6%B6%88%E9%99%A4%E4%BA%86%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E7%9A%84%E5%8F%AF%E8%83%BD%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22recv()%20%E5%92%8C%20try_recv()%20%E7%9A%84%E4%B8%BB%E8%A6%81%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22recv%20%E4%BC%9A%E9%98%BB%E5%A1%9E%E7%AD%89%E5%BE%85%E6%B6%88%E6%81%AF%EF%BC%8Ctry_recv%20%E7%AB%8B%E5%8D%B3%E8%BF%94%E5%9B%9E%EF%BC%88%E6%97%A0%E6%B6%88%E6%81%AF%E5%88%99%E8%BF%94%E5%9B%9E%20Err%EF%BC%89%22%2C%22%E4%B8%A4%E8%80%85%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%EF%BC%8C%E5%8F%AA%E6%98%AF%E5%90%8D%E5%AD%97%E4%B8%8D%E5%90%8C%22%2C%22recv%20%E5%8F%AA%E8%83%BD%E6%8E%A5%E6%94%B6%E4%B8%80%E6%9D%A1%E6%B6%88%E6%81%AF%EF%BC%8Ctry_recv%20%E5%8F%AF%E4%BB%A5%E6%8E%A5%E6%94%B6%E5%A4%9A%E6%9D%A1%22%2C%22recv%20%E6%98%AF%E5%BC%82%E6%AD%A5%E7%9A%84%EF%BC%8Ctry_recv%20%E6%98%AF%E5%90%8C%E6%AD%A5%E7%9A%84%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22recv()%20%E9%98%BB%E5%A1%9E%E5%BD%93%E5%89%8D%E7%BA%BF%E7%A8%8B%E7%9B%B4%E5%88%B0%E6%9C%89%E6%B6%88%E6%81%AF%EF%BC%9Btry_recv()%20%E7%AB%8B%E5%8D%B3%E8%BF%94%E5%9B%9E%EF%BC%8C%E5%A6%82%E6%9E%9C%E9%80%9A%E9%81%93%E9%87%8C%E6%B2%A1%E6%9C%89%E6%B6%88%E6%81%AF%E5%B0%B1%E8%BF%94%E5%9B%9E%20Err%EF%BC%8C%E9%80%82%E5%90%88%E5%9C%A8%E7%AD%89%E5%BE%85%E6%B6%88%E6%81%AF%E7%9A%84%E5%90%8C%E6%97%B6%E8%BF%98%E8%A6%81%E5%81%9A%E5%85%B6%E4%BB%96%E4%BA%8B%E6%83%85%E7%9A%84%E5%9C%BA%E6%99%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%BD%93%E6%89%80%E6%9C%89%E5%8F%91%E9%80%81%E7%AB%AF%E9%83%BD%E8%A2%AB%E4%B8%A2%E5%BC%83%E5%90%8E%EF%BC%8C%E6%8E%A5%E6%94%B6%E7%AB%AF%E7%9A%84%20recv()%20%E4%BC%9A%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%94%E5%9B%9E%20Err%EF%BC%8C%E8%A1%A8%E7%A4%BA%E9%80%9A%E9%81%93%E5%B7%B2%E5%85%B3%E9%97%AD%22%2C%22%E8%BF%94%E5%9B%9E%20Ok(None)%22%2C%22%E6%B0%B8%E4%B9%85%E9%98%BB%E5%A1%9E%22%2C%22panic%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E6%89%80%E6%9C%89%20Sender%20%E9%83%BD%20drop%20%E4%BA%86%EF%BC%8C%E8%AF%B4%E6%98%8E%E4%B8%8D%E4%BC%9A%E5%86%8D%E6%9C%89%E6%96%B0%E6%B6%88%E6%81%AF%E4%BA%86%E3%80%82%E6%AD%A4%E6%97%B6%20recv()%20%E8%BF%94%E5%9B%9E%20Err%EF%BC%8Cfor%20received%20in%20rx%20%E7%9A%84%E8%BF%AD%E4%BB%A3%E4%B9%9F%E4%BC%9A%E8%87%AA%E7%84%B6%E7%BB%93%E6%9D%9F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E6%83%B3%E8%AE%A9%203%20%E4%B8%AA%E7%BA%BF%E7%A8%8B%E9%83%BD%E5%BE%80%E5%90%8C%E4%B8%80%E4%B8%AA%E9%80%9A%E9%81%93%E5%8F%91%E6%B6%88%E6%81%AF%EF%BC%8C%E5%BA%94%E8%AF%A5%E6%80%8E%E4%B9%88%E5%81%9A%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%85%8B%E9%9A%86%E5%8F%91%E9%80%81%E7%AB%AF%E4%B8%A4%E6%AC%A1%EF%BC%8C%E6%AF%8F%E4%B8%AA%E7%BA%BF%E7%A8%8B%E6%8C%81%E6%9C%89%E4%B8%80%E4%B8%AA%E5%85%8B%E9%9A%86%22%2C%22%E7%94%A8%20Arc%3CSender%3CT%3E%3E%20%E5%8C%85%E8%A3%85%E5%8F%91%E9%80%81%E7%AB%AF%22%2C%22%E5%88%9B%E5%BB%BA%203%20%E4%B8%AA%E7%8B%AC%E7%AB%8B%E7%9A%84%E9%80%9A%E9%81%93%22%2C%22%E4%B8%8D%E5%8F%AF%E8%83%BD%E5%AE%9E%E7%8E%B0%EF%BC%8Cmpsc%20%E5%8F%AA%E6%94%AF%E6%8C%81%E4%B8%80%E4%B8%AA%E5%8F%91%E9%80%81%E8%80%85%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22tx.clone()%20%E5%8F%AF%E4%BB%A5%E5%88%9B%E5%BB%BA%E5%A4%9A%E4%B8%AA%E5%8F%91%E9%80%81%E7%AB%AF%EF%BC%8C%E6%AF%8F%E4%B8%AA%E7%BA%BF%E7%A8%8B%20move%20%E8%BF%9B%E5%8E%BB%E4%B8%80%E4%B8%AA%E5%8D%B3%E5%8F%AF%E3%80%82%E8%BF%99%E5%B0%B1%E6%98%AF%20mpsc%20%E4%B8%AD%20%5C%22Multiple%20Producer%5C%22%20%E7%9A%84%E5%90%AB%E4%B9%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="14-concurrency/02-channels#2:5" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%8A%8A%20rx%20%E7%94%A8%E4%BA%8E%20for%20%E5%BE%AA%E7%8E%AF%EF%BC%88for%20msg%20in%20rx%EF%BC%89%E6%97%B6%EF%BC%8C%E5%BE%AA%E7%8E%AF%E4%BD%95%E6%97%B6%E7%BB%93%E6%9D%9F%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%8E%A5%E6%94%B6%E5%88%B0%2010%20%E6%9D%A1%E6%B6%88%E6%81%AF%E5%90%8E%22%2C%22%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%E6%97%B6%EF%BC%88%E6%89%80%E6%9C%89%E5%8F%91%E9%80%81%E7%AB%AF%E9%83%BD%E8%A2%AB%20drop%EF%BC%89%22%2C%22%E7%A8%8B%E5%BA%8F%E9%80%80%E5%87%BA%E6%97%B6%22%2C%22%E6%89%8B%E5%8A%A8%E8%B0%83%E7%94%A8%20break%20%E6%97%B6%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Receiver%3CT%3E%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Iterator%EF%BC%8C%E5%BD%93%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%EF%BC%88%E5%8D%B3%E6%89%80%E6%9C%89%20Sender%20%E9%83%BD%20drop%20%E4%BA%86%EF%BC%89%E6%97%B6%EF%BC%8C%E8%BF%AD%E4%BB%A3%E5%99%A8%E8%BF%94%E5%9B%9E%20None%EF%BC%8Cfor%20%E5%BE%AA%E7%8E%AF%E8%87%AA%E7%84%B6%E7%BB%93%E6%9D%9F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
