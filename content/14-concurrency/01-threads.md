# 并发与线程

在大多数现代操作系统里，程序运行在一个**进程**（process）中，操作系统管理着多个进程。而进程内部，还可以拆分出多个同时运行的独立单元，叫做**线程**（thread）。

把工作分给多个线程能提升性能，但也带来了新挑战：

- 竞争状态 （Race condition）：多个线程以不可预期的顺序读写同一份数据
- 死锁 （Deadlock）：两个线程互相等待对方释放资源，永远卡住
- 只在特定时机才复现的玄学 bug

Rust 的设计哲学是「无畏并发」——通过所有权和类型系统，在**编译期**消除绝大部分并发错误。

## 线程模型：1:1 vs M:N

线程有两种主流实现方式，理解它们有助于你明白 Rust 的选择。

**1:1 模型**：程序创建的每个线程，操作系统都分配一个真实的 OS 线程与之对应。Rust 标准库使用这种模型。

**M:N 模型（绿色线程）**：语言运行时自己管理 M 个「用户态线程」，把它们调度到 N 个 OS 线程上运行，M 通常远大于 N。Go 的 goroutine、Erlang 的进程都是这种模型。

|  | 1:1 模型（Rust 标准库） | M:N 模型（Go goroutine） |
| --- | --- | --- |
| **线程由谁管理** | 操作系统 | 语言运行时 |
| **创建开销** | 较大（需要系统调用） | 极小（用户态切换） |
| **可并发数量** | 受 OS 限制，通常数千 | 可轻松开百万个 |
| **需要运行时** | 不需要 | 需要内置调度器 |

**Rust 为什么选 1:1？** Rust 的核心目标之一是「零额外运行时」——程序可以直接和 C 互操作，部署到嵌入式等受限环境。M:N 模型需要一个内置的线程调度器，这与目标冲突。

> 如果你需要百万级并发，Rust 生态提供了 `tokio`、`async-std` 等**异步运行时** crate。它们用少量 OS 线程驱动大量异步任务，效果类似 M:N，但以 crate 形式存在而非绑定进语言本身——用不到就零开销。异步编程是后续章节的主题。

## 使用 spawn 创建线程

调用 `thread::spawn` 并传入一个闭包，闭包里的代码就在新线程中运行：

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0Ause%20std%3A%3Atime%3A%3ADuration%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%96%B0%E7%BA%BF%E7%A8%8B%0A%20%20%20%20thread%3A%3Aspawn(%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20for%20i%20in%201..%3D5%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E5%AD%90%E7%BA%BF%E7%A8%8B%EF%BC%9A%E7%AC%AC%20%7B%7D%20%E6%AC%A1%22%2C%20i)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(1))%3B%20%2F%2F%20%E7%9D%A1%E7%9C%A0%201%20%E6%AF%AB%E7%A7%92%EF%BC%8C%E8%AE%A9%E5%87%BA%20CPU%EF%BC%8C%E7%BB%99%E5%85%B6%E4%BB%96%E7%BA%BF%E7%A8%8B%E8%BF%90%E8%A1%8C%E6%9C%BA%E4%BC%9A%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%BB%E7%BA%BF%E7%A8%8B%E8%87%AA%E5%B7%B1%E4%B9%9F%E5%9C%A8%E8%BF%90%E8%A1%8C%0A%20%20%20%20for%20i%20in%201..%3D3%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%B8%BB%E7%BA%BF%E7%A8%8B%EF%BC%9A%E7%AC%AC%20%7B%7D%20%E6%AC%A1%22%2C%20i)%3B%0A%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(1))%3B%20%2F%2F%20%E5%90%8C%E4%B8%8A%EF%BC%8C%E5%88%B6%E9%80%A0%E4%BA%A4%E6%9B%BF%E6%89%A7%E8%A1%8C%E7%9A%84%E6%95%88%E6%9E%9C%0A%20%20%20%20%7D%0A%20%20%20%20%2F%2F%20%E4%B8%BB%E7%BA%BF%E7%A8%8B%E7%BB%93%E6%9D%9F%20%E2%86%92%20%E6%95%B4%E4%B8%AA%E7%A8%8B%E5%BA%8F%E7%BB%93%E6%9D%9F%EF%BC%8C%E5%AD%90%E7%BA%BF%E7%A8%8B%E5%8F%AF%E8%83%BD%E8%BF%98%E6%B2%A1%E8%B7%91%E5%AE%8C%EF%BC%81%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">time</span><span style="color:#F97583">::</span><span style="color:#B392F0">Duration</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 创建一个新线程</span></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"子线程：第 {} 次"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#B392F0">            thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">sleep</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Duration</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_millis</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 睡眠 1 毫秒，让出 CPU，给其他线程运行机会</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 主线程自己也在运行</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"主线程：第 {} 次"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#B392F0">        thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">sleep</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Duration</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_millis</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 同上，制造交替执行的效果</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#6A737D">    // 主线程结束 → 整个程序结束，子线程可能还没跑完！</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

运行这段代码你会发现：**主线程一结束，子线程也被强制终止**，不管它有没有跑完。输出顺序也是不确定的，因为操作系统随时可能切换线程。

## join：等待子线程完成

`thread::spawn` 返回一个 `JoinHandle`。对它调用 `.join()` 会**阻塞当前线程**，直到对应的子线程结束：

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0Ause%20std%3A%3Atime%3A%3ADuration%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%8A%8A%20JoinHandle%20%E4%BF%9D%E5%AD%98%E4%B8%8B%E6%9D%A5%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20for%20i%20in%201..%3D5%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E5%AD%90%E7%BA%BF%E7%A8%8B%EF%BC%9A%E7%AC%AC%20%7B%7D%20%E6%AC%A1%22%2C%20i)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(1))%3B%20%2F%2F%20%E7%9D%A1%E7%9C%A0%201%20%E6%AF%AB%E7%A7%92%EF%BC%8C%E8%AE%A9%E5%87%BA%20CPU%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20for%20i%20in%201..%3D3%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%B8%BB%E7%BA%BF%E7%A8%8B%EF%BC%9A%E7%AC%AC%20%7B%7D%20%E6%AC%A1%22%2C%20i)%3B%0A%20%20%20%20%20%20%20%20thread%3A%3Asleep(Duration%3A%3Afrom_millis(1))%3B%20%2F%2F%20%E5%90%8C%E4%B8%8A%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E5%9C%A8%E8%BF%99%E9%87%8C%E7%AD%89%E5%BE%85%E5%AD%90%E7%BA%BF%E7%A8%8B%E7%BB%93%E6%9D%9F%EF%BC%8C%E5%86%8D%E7%BB%A7%E7%BB%AD%0A%20%20%20%20handle.join().unwrap()%3B%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E7%BA%BF%E7%A8%8B%E9%83%BD%E5%AE%8C%E6%88%90%E4%BA%86%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">time</span><span style="color:#F97583">::</span><span style="color:#B392F0">Duration</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 把 JoinHandle 保存下来</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"子线程：第 {} 次"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#B392F0">            thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">sleep</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Duration</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_millis</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 睡眠 1 毫秒，让出 CPU</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"主线程：第 {} 次"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#B392F0">        thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">sleep</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Duration</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_millis</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 同上</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 在这里等待子线程结束，再继续</span></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"所有线程都完成了！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

现在子线程的 5 次输出一定会全部打印出来。

> **join 放在哪里很重要**：如果在主线程的 `for` 循环之前就 `join`，那主线程会先等子线程跑完，再执行自己的循环——两者就不再并发了。

# move 闭包与所有权

## 为什么需要 move

子线程需要用到外部数据时，直接借用会有问题。来看一个例子：

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9A%E9%97%AD%E5%8C%85%E5%80%9F%E7%94%A8%E4%BA%86%20v%EF%BC%8C%E4%BD%86%20Rust%20%E4%B8%8D%E7%9F%A5%E9%81%93%E8%BF%99%E4%B8%AA%E7%BA%BF%E7%A8%8B%E4%BC%9A%E6%B4%BB%E5%A4%9A%E4%B9%85%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E8%BF%99%E9%87%8C%20drop(v)%EF%BC%8C%E5%AD%90%E7%BA%BF%E7%A8%8B%E5%B0%B1%E8%AE%BF%E9%97%AE%E4%BA%86%E6%82%AC%E7%A9%BA%E5%BC%95%E7%94%A8%EF%BC%81%0A%20%20%20%20handle.join().unwrap()%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 编译错误：闭包借用了 v，但 Rust 不知道这个线程会活多久</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果这里 drop(v)，子线程就访问了悬空引用！</span></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器会报错：闭包试图借用 `v`，但 Rust 无法保证主线程不会在子线程还在用 `v` 的时候把它丢弃。这是一个**合理的担忧**——比如主线程可以调用 `drop(v)` 后立刻结束，子线程就读到了悬空数据。

## 用 move 转移所有权

解决办法是在闭包前加 `move` 关键字，强制闭包**获取**它用到的所有值的所有权：

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20move%20%E6%8A%8A%20v%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E7%A7%BB%E5%85%A5%E9%97%AD%E5%8C%85%EF%BC%8C%E5%AD%90%E7%BA%BF%E7%A8%8B%E7%8B%AC%E5%8D%A0%20v%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20v%20%E5%B7%B2%E7%BB%8F%E7%A7%BB%E8%B5%B0%E4%BA%86%EF%BC%8C%E8%BF%99%E9%87%8C%E4%B8%8D%E8%83%BD%E5%86%8D%E7%94%A8%20v%0A%20%20%20%20handle.join().unwrap()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // move 把 v 的所有权移入闭包，子线程独占 v</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // v 已经移走了，这里不能再用 v</span></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

加了 `move` 后，`v` 的所有权转移给了子线程的闭包。主线程再也无法访问 `v`，从根本上避免了悬空引用的可能。

## move 闭包的所有权效果

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%2F%2F%20v%20%E5%B7%B2%E8%A2%AB%20move%20%E8%BF%9B%E6%9D%A5%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20drop(v)%3B%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81v%20%E5%B7%B2%E7%BB%8F%E7%A7%BB%E8%B5%B0%E4%BA%86%EF%BC%8C%E8%BF%99%E9%87%8C%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%0A%0A%20%20%20%20handle.join().unwrap()%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// v 已被 move 进来</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    drop</span><span style="color:#E1E4E8">(v); </span><span style="color:#6A737D">// 编译错误！v 已经移走了，这里无法使用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这正是 Rust 给我们的保护：`move` 之后，所有权规则确保主线程不可能再碰 `v`，消除了一类典型的并发 bug。

# 练习题

## 测验

加载题目中…

加载题目中…

```rust
use std::thread;
fn main() {
    let msg = String::from("hello");
    thread::spawn(move || println!("{}", msg));
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的代码希望创建一个子线程打印 1 到 5，主线程打印 “A” 到 “C”，并且保证子线程一定能跑完。请补全 `TODO` 部分：

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=5 {
            // TODO: 打印 "子线程: {i}"
        }
    });

    for c in ['A', 'B', 'C'] {
        println!("主线程: {c}");
    }

    // TODO: 等待子线程结束
}
```