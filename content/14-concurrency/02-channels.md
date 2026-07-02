# 通道：线程间的单行道

Go 语言有一句著名的口号：“**不要通过共享内存来通信，而要通过通信来共享内存。**”

这句话描述了一种并发思路：与其让多个线程同时读写同一块内存（复杂、危险），不如给每个线程一个”收件箱”，线程之间传递消息，接收方从自己的收件箱里取数据。

Rust 标准库提供了**通道**（channel）来实现这个模式。

## 什么是 mpsc 通道

`std::sync::mpsc` 里的 `mpsc` 是 **Multiple Producer, Single Consumer** 的缩写——**多个发送者、一个接收者**。

可以把通道想象成一条传送带：

- 发送端 （ Sender<T> ）：往传送带上放东西
- 接收端 （ Receiver<T> ）：从传送带末端取东西
- 传送带只有一个出口，但入口可以有多个（克隆发送端）

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20channel()%20%E8%BF%94%E5%9B%9E%20(%E5%8F%91%E9%80%81%E7%AB%AF%2C%20%E6%8E%A5%E6%94%B6%E7%AB%AF)%20%E7%9A%84%E5%85%83%E7%BB%84%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E6%8A%8A%20tx%20%E7%A7%BB%E5%85%A5%E5%AD%90%E7%BA%BF%E7%A8%8B%EF%BC%8C%E5%8F%91%E9%80%81%E4%B8%80%E6%9D%A1%E6%B6%88%E6%81%AF%0A%20%20%20%20%20%20%20%20tx.send(String%3A%3Afrom(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%B8%BB%E7%BA%BF%E7%A8%8B%EF%BC%81%22)).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20recv()%20%E4%BC%9A%E9%98%BB%E5%A1%9E%EF%BC%8C%E7%9B%B4%E5%88%B0%E6%9C%89%E6%B6%88%E6%81%AF%E5%88%B0%E6%9D%A5%0A%20%20%20%20let%20msg%20%3D%20rx.recv().unwrap()%3B%0A%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20msg)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">mpsc;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // channel() 返回 (发送端, 接收端) 的元组</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (tx, rx) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> mpsc</span><span style="color:#F97583">::</span><span style="color:#B392F0">channel</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 把 tx 移入子线程，发送一条消息</span></span>
<span class="line"><span style="color:#E1E4E8">        tx</span><span style="color:#F97583">.</span><span style="color:#B392F0">send</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，主线程！"</span><span style="color:#E1E4E8">))</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // recv() 会阻塞，直到有消息到来</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> msg </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> rx</span><span style="color:#F97583">.</span><span style="color:#B392F0">recv</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"收到：{}"</span><span style="color:#E1E4E8">, msg);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 发送与接收

接收端有两个方法：

| 方法 | 行为 |
| --- | --- |
| `rx.recv()` | **阻塞**等待，有消息则返回 `Ok(T)`，通道关闭则返回 `Err` |
| `rx.try_recv()` | **立即返回**，有消息返回 `Ok(T)`，暂无消息返回 `Err`（不阻塞） |

当发送端被丢弃（所有 `tx` 都 drop 了），通道关闭，`recv()` 会返回 `Err`。

## 所有权与消息传递

通道传值会**转移所有权**，这是 Rust 并发安全的关键之一：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20val%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%20%20%20%20tx.send(val).unwrap()%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9Aval%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%BB%8F%E8%BD%AC%E7%A7%BB%E7%BB%99%E9%80%9A%E9%81%93%E4%BA%86%EF%BC%8C%E8%BF%99%E9%87%8C%E4%B8%8D%E8%83%BD%E5%86%8D%E7%94%A8%0A%20%20%20%20%20%20%20%20println!(%22val%20%3D%20%7B%7D%22%2C%20val)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20rx.recv().unwrap())%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">mpsc;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (tx, rx) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> mpsc</span><span style="color:#F97583">::</span><span style="color:#B392F0">channel</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> val </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        tx</span><span style="color:#F97583">.</span><span style="color:#B392F0">send</span><span style="color:#E1E4E8">(val)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">        // 编译错误：val 的所有权已经转移给通道了，这里不能再用</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"val = {}"</span><span style="color:#E1E4E8">, val);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"收到：{}"</span><span style="color:#E1E4E8">, rx</span><span style="color:#F97583">.</span><span style="color:#B392F0">recv</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`send(val)` 的签名是 `fn send(&self, t: T) -> Result<...>`，它会**消耗** `val`。这防止了”已发送的数据还被发送方修改”这类竞争 bug。

# 发送多条消息

## 把接收端当迭代器

实际场景里子线程往往需要发送多条消息。可以把 `rx` 当作迭代器来遍历，通道关闭后迭代自动结束：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0Ause%20std%3A%3Atime%3A%3ADuration%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20items%20%3D%20vec!%5B%22%E8%8B%B9%E6%9E%9C%22%2C%20%22%E9%A6%99%E8%95%89%22%2C%20%22%E6%A9%99%E5%AD%90%22%2C%20%22%E8%91%A1%E8%90%84%22%5D%3B%0A%20%20%20%20%20%20%20%20for%20item%20in%20items%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tx.send(item).unwrap()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(100))%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%2F%2F%20tx%20%E5%9C%A8%E8%BF%99%E9%87%8C%20drop%EF%BC%8C%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%EF%BC%8Crx%20%E7%9A%84%E8%BF%AD%E4%BB%A3%E9%9A%8F%E4%B9%8B%E7%BB%93%E6%9D%9F%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20for%20received%20in%20rx%20%E4%BC%9A%E9%98%BB%E5%A1%9E%E7%AD%89%E5%BE%85%EF%BC%8C%E7%9B%B4%E5%88%B0%E9%80%9A%E9%81%93%E5%85%B3%E9%97%AD%0A%20%20%20%20for%20received%20in%20rx%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20received)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E6%B6%88%E6%81%AF%E6%8E%A5%E6%94%B6%E5%AE%8C%E6%AF%95%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">mpsc;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">time</span><span style="color:#F97583">::</span><span style="color:#B392F0">Duration</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (tx, rx) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> mpsc</span><span style="color:#F97583">::</span><span style="color:#B392F0">channel</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> items </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">"苹果"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"香蕉"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"橙子"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"葡萄"</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> items {</span></span>
<span class="line"><span style="color:#E1E4E8">            tx</span><span style="color:#F97583">.</span><span style="color:#B392F0">send</span><span style="color:#E1E4E8">(item)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">            thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">sleep</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Duration</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_millis</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#6A737D">        // tx 在这里 drop，通道关闭，rx 的迭代随之结束</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // for received in rx 会阻塞等待，直到通道关闭</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> received </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> rx {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"收到：{}"</span><span style="color:#E1E4E8">, received);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"所有消息接收完毕"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 多生产者：克隆发送端

`mpsc` 的 **M**（Multiple Producer）体现在：你可以克隆发送端，让多个线程各自往同一个通道里发消息：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Ampsc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20(tx%2C%20rx)%20%3D%20mpsc%3A%3Achannel()%3B%0A%0A%20%20%20%20%2F%2F%20%E5%85%8B%E9%9A%86%E4%B8%80%E4%BB%BD%E5%8F%91%E9%80%81%E7%AB%AF%E7%BB%99%E7%AC%AC%E4%BA%8C%E4%B8%AA%E7%BA%BF%E7%A8%8B%0A%20%20%20%20let%20tx2%20%3D%20tx.clone()%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20tx.send(%22%E6%9D%A5%E8%87%AA%E7%BA%BF%E7%A8%8B%201%20%E7%9A%84%E6%B6%88%E6%81%AF%22).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20tx2.send(%22%E6%9D%A5%E8%87%AA%E7%BA%BF%E7%A8%8B%202%20%E7%9A%84%E6%B6%88%E6%81%AF%22).unwrap()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%8E%A5%E6%94%B6%E4%B8%A4%E6%9D%A1%E6%B6%88%E6%81%AF%EF%BC%88%E9%A1%BA%E5%BA%8F%E4%B8%8D%E7%A1%AE%E5%AE%9A%EF%BC%89%0A%20%20%20%20for%20_%20in%200..2%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20rx.recv().unwrap())%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">mpsc;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (tx, rx) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> mpsc</span><span style="color:#F97583">::</span><span style="color:#B392F0">channel</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 克隆一份发送端给第二个线程</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> tx2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> tx</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        tx</span><span style="color:#F97583">.</span><span style="color:#B392F0">send</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"来自线程 1 的消息"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        tx2</span><span style="color:#F97583">.</span><span style="color:#B392F0">send</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"来自线程 2 的消息"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 接收两条消息（顺序不确定）</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> _ </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, rx</span><span style="color:#F97583">.</span><span style="color:#B392F0">recv</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

两个线程各自拥有一个发送端，谁先发到就先收到谁的。接收端仍然只有一个。

# 练习题

## 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…