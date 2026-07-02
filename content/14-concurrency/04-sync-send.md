# 两个神奇的标记 Trait

前几节我们看到编译器拒绝了 `Rc<T>` 跨线程使用，接受了 `Arc<T>`。编译器是怎么知道谁能跨线程、谁不能的？答案就是两个内置于语言核心的标记 trait：`Send` 和 `Sync`。

它们定义在 `std::marker` 中，没有任何方法，只是一个「标签」——打上这个标签，就等于向编译器声明：「这个类型在多线程场景下是安全的。」

## 为什么需要标记 Trait

Rust 的所有权系统在单线程下已经能防止大量 bug。但多线程带来了新的问题：

- 数据竞争 ：两个线程同时读写同一块内存，且至少有一个是写操作
- 悬空指针 ：一个线程释放了数据，另一个线程还持有指向它的引用

`Send` 和 `Sync` 两个标记 trait，让编译器能在**编译期**就把这些问题拦截住。

# Send：可以跨线程转移所有权

## 什么是 Send

实现了 `Send` 的类型，其**所有权**可以安全地转移到另一个线程。

简单来说：如果你能把一个值 `move` 进 `thread::spawn` 的闭包，这个值就必须是 `Send` 的。

<div class="code-runner" data-full-code="use%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%2F%2F%20String%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Send%0A%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%A2%AB%20move%20%E5%88%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E7%BA%BF%E7%A8%8B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20handle.join().unwrap()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// String 实现了 Send</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // s 的所有权被 move 到了这个线程</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`String` 实现了 `Send`，所以可以安全地移入子线程。

## 哪些类型不是 Send

最典型的是 `Rc<T>`：

<div class="code-runner" data-full-code="use%20std%3A%3Arc%3A%3ARc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rc%20%3D%20Rc%3A%3Anew(42)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ARc%3Ci32%3E%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Send%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20rc)%3B%0A%20%20%20%20%7D)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">Rc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rc </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 编译错误：Rc&lt;i32&gt; 没有实现 Send</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, rc);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为什么 `Rc<T>` 不是 `Send`？因为 `Rc` 的引用计数是普通整数操作，不是原子的。如果两个线程同时克隆同一个 `Rc`，会同时修改引用计数，导致计数错乱，引发内存安全问题。

`Arc<T>` 用原子操作来更新计数，所以是 `Send` 的。

## 自动推导规则

- 完全由 Send 类型组成的类型，自动是 Send
- 基本类型（ i32 、 bool 、 String 等）几乎都是 Send
- 含有非 Send 类型字段的结构体，自动不是 Send

# Sync：可以被多线程共享引用

## 从 Send 到 Sync

`Send` 解决的是「**转移**所有权」的问题——值从一个线程移动到另一个线程。

但有时候我们不想转移，只想**共享**：主线程有一份数据，多个子线程都拿到它的引用，同时去读它。这就是 `Sync` 解决的问题。

> **定义**：如果类型 `T` 是 `Sync` 的，则 `&T`（对 T 的不可变引用）可以安全地同时存在于多个线程中。

换个更直观的说法：**多个线程同时读同一个值，不会出问题**，这个类型就是 `Sync`。

## 最简单的例子：只读共享

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AArc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Arc%20%E8%AE%A9%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%85%B1%E4%BA%AB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E5%86%85%E9%83%A8%E7%9A%84%20Vec%20%E6%98%AF%20Sync%20%E7%9A%84%EF%BC%88%E5%8F%AA%E8%AF%BB%EF%BC%89%0A%20%20%20%20let%20data%20%3D%20Arc%3A%3Anew(vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D)%3B%0A%0A%20%20%20%20let%20mut%20handles%20%3D%20vec!%5B%5D%3B%0A%20%20%20%20for%20i%20in%200..3%20%7B%0A%20%20%20%20%20%20%20%20let%20data%20%3D%20Arc%3A%3Aclone(%26data)%3B%0A%20%20%20%20%20%20%20%20handles.push(thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%A4%9A%E4%B8%AA%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%97%B6%E6%8C%81%E6%9C%89%20%26Vec%3Ci32%3E%EF%BC%8C%E5%8F%AA%E8%AF%BB%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%AE%89%E5%85%A8%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E7%BA%BF%E7%A8%8B%20%7B%7D%20%E7%9C%8B%E5%88%B0%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20i%2C%20data.len())%3B%0A%20%20%20%20%20%20%20%20%7D))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20for%20h%20in%20handles%20%7B%20h.join().unwrap()%3B%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Arc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // Arc 让多个线程共享所有权，内部的 Vec 是 Sync 的（只读）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> handles </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[];</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">data);</span></span>
<span class="line"><span style="color:#E1E4E8">        handles</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">            // 多个线程同时持有 &amp;Vec&lt;i32&gt;，只读，完全安全</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"线程 {} 看到长度：{}"</span><span style="color:#E1E4E8">, i, data</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">        }));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> h </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> handles { h</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">(); }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Vec<i32>` 是 `Sync` 的，因为多个线程同时**读**它不会产生任何问题——没有人在改它，不会有竞争。

## 为什么 RefCell<T> 不是 Sync

`RefCell<T>` 内部有一个**借用计数器**（一个整数），记录当前有几个活跃的借用。每次调用 `borrow()` 或 `borrow_mut()` 都要修改这个计数器。

问题在于：这个计数器的修改**不是原子的**。

想象两个线程同时对同一个 `RefCell` 调用 `borrow()`：

1. 线程 A 读到计数器是 0
1. 线程 B 读到计数器也是 0
1. 线程 A 把计数器写成 1（“我借用了”）
1. 线程 B 把计数器也写成 1（覆盖了 A 的写入！）

现在计数器是 1，但实际有两个活跃借用——借用规则被悄悄破坏了，后续可能出现两个可变借用同时存在的情况，导致数据竞争。

所以编译器禁止把 `RefCell` 的引用共享给多个线程：

<div class="code-runner" data-full-code="use%20std%3A%3Acell%3A%3ARefCell%3B%0Ause%20std%3A%3Async%3A%3AArc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20Arc%3A%3Anew(RefCell%3A%3Anew(0))%3B%0A%20%20%20%20let%20data2%20%3D%20Arc%3A%3Aclone(%26data)%3B%0A%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ARefCell%3Ci32%3E%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Sync%0A%20%20%20%20%20%20%20%20%2F%2F%20Arc%20%E5%86%85%E9%83%A8%E7%9A%84%20%26RefCell%3Ci32%3E%20%E4%B8%8D%E8%83%BD%E5%AE%89%E5%85%A8%E5%9C%B0%E8%B7%A8%E7%BA%BF%E7%A8%8B%E5%85%B1%E4%BA%AB%0A%20%20%20%20%20%20%20%20*data2.borrow_mut()%20%2B%3D%201%3B%0A%20%20%20%20%7D)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">cell</span><span style="color:#F97583">::</span><span style="color:#B392F0">RefCell</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Arc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">RefCell</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">data);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 编译错误：RefCell&lt;i32&gt; 没有实现 Sync</span></span>
<span class="line"><span style="color:#6A737D">        // Arc 内部的 &amp;RefCell&lt;i32&gt; 不能安全地跨线程共享</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">data2</span><span style="color:#F97583">.</span><span style="color:#B392F0">borrow_mut</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## Mutex<T> 是 Sync 的原因

`Mutex<T>` 也保护内部数据，但它用**操作系统锁**来保证互斥，而不是一个普通整数计数器。任何线程想访问数据都必须先拿锁，拿不到就阻塞——不可能有两个线程同时进入临界区。

因此 `Mutex<T>` 的引用可以安全地在多个线程间共享，它是 `Sync` 的。

## Send 与 Sync 的关系

两者可以用一句话总结：

| Trait | 保证的事 | 典型场景 |
| --- | --- | --- |
| `Send` | **所有权**可以转移到另一个线程 | `move` 闭包 |
| `Sync` | **引用**可以同时存在于多个线程 | `Arc<T>` 包裹后共享 |

它们之间有一个数学关系：**如果 `&T` 是 `Send`，则 `T` 就是 `Sync`**。

理解这句话：`&T` 是 `Send` 意味着”这个引用可以安全地发送到另一个线程”，也就是说另一个线程拿着 `&T` 读数据不会出问题——这正好就是 `Sync` 的定义。

## 常见类型的 Send / Sync 一览

| 类型 | Send | Sync | 原因 |
| --- | --- | --- | --- |
| `i32`, `bool`, `String` | ✅ | ✅ | 基本类型，无共享状态 |
| `Rc<T>` | ❌ | ❌ | 引用计数非原子 |
| `Arc<T>` | ✅ | ✅ | 引用计数原子操作 |
| `Mutex<T>` | ✅ (T: Send) | ✅ | OS 锁保证互斥 |
| `RefCell<T>` | ✅ (T: Send) | ❌ | 借用检查非原子 |
| `*mut T`（裸指针） | ❌ | ❌ | 无安全保证 |

# 练习题

## 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…