# Mutex<T>：互斥锁

通道是「通过通信共享数据」，本节介绍另一种思路：**让多个线程直接共享同一块数据，但每次只允许一个线程访问**。

这个机制叫**互斥锁**（Mutex，Mutual Exclusion）。你可以把它想象成公共厕所门上的锁：进去之前先锁门，出来后开锁，这样里面永远只有一个人。

## Mutex 的基本用法

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AMutex%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%8A%8A%E6%95%B0%E6%8D%AE%22%E8%A3%85%E8%BF%9B%22%20Mutex%EF%BC%8C%E5%A4%96%E4%BA%BA%E6%97%A0%E6%B3%95%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%0A%20%20%20%20let%20m%20%3D%20Mutex%3A%3Anew(5)%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20lock()%20%E8%8E%B7%E5%8F%96%E9%94%81%EF%BC%8C%E8%BF%94%E5%9B%9E%20MutexGuard%20%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E9%94%81%E5%B7%B2%E8%A2%AB%E5%85%B6%E4%BB%96%E7%BA%BF%E7%A8%8B%E6%8C%81%E6%9C%89%EF%BC%8C%E5%BD%93%E5%89%8D%E7%BA%BF%E7%A8%8B%E4%BC%9A%E9%98%BB%E5%A1%9E%E7%AD%89%E5%BE%85%0A%20%20%20%20%20%20%20%20let%20mut%20num%20%3D%20m.lock().unwrap()%3B%0A%20%20%20%20%20%20%20%20*num%20%3D%206%3B%20%2F%2F%20%E9%80%9A%E8%BF%87%20MutexGuard%20%E4%BF%AE%E6%94%B9%E5%86%85%E9%83%A8%E6%95%B0%E6%8D%AE%0A%20%20%20%20%7D%20%2F%2F%20%E8%BF%99%E9%87%8C%20num%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8CMutexGuard%20%E8%87%AA%E5%8A%A8%20drop%EF%BC%8C%E9%94%81%E8%87%AA%E5%8A%A8%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20println!(%22m%20%3D%20%7B%3A%3F%7D%22%2C%20m)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Mutex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 把数据"装进" Mutex，外人无法直接访问</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Mutex</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#6A737D">        // lock() 获取锁，返回 MutexGuard 智能指针</span></span>
<span class="line"><span style="color:#6A737D">        // 如果锁已被其他线程持有，当前线程会阻塞等待</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> m</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">num </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 6</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 通过 MutexGuard 修改内部数据</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#6A737D">// 这里 num 离开作用域，MutexGuard 自动 drop，锁自动释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"m = {:?}"</span><span style="color:#E1E4E8">, m);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

关键点：

- 获取数据必须先拿锁 ： Mutex<T> 把数据包裹起来，不 lock() 就无法访问 T
- 锁自动释放 ： MutexGuard 是智能指针，离开作用域时 Drop 实现会自动释放锁，不需要手动解锁
- 中毒（Poisoning） ：如果持有锁的线程 panic 了，锁进入”中毒”状态。其他线程再调用 lock() 会得到 Err ，调用 .unwrap() 就会 panic。

## 用 {} 手动控制持锁范围

`MutexGuard` 在离开**当前作用域**时才释放锁，所以用 `{}` 块包裹可以精确控制持锁时间：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AMutex%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20m%20%3D%20Mutex%3A%3Anew(0)%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20mut%20num%20%3D%20m.lock().unwrap()%3B%0A%20%20%20%20%20%20%20%20*num%20%2B%3D%201%3B%0A%20%20%20%20%7D%20%2F%2F%20%E2%86%90%20num%20%E5%9C%A8%E8%BF%99%E9%87%8C%20drop%EF%BC%8C%E9%94%81%E7%AB%8B%E5%88%BB%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20%2F%2F%20%E9%94%81%E5%B7%B2%E9%87%8A%E6%94%BE%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%86%8D%E6%AC%A1%E8%8E%B7%E5%8F%96%0A%20%20%20%20println!(%22m%20%3D%20%7B%3A%3F%7D%22%2C%20m)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Mutex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Mutex</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> m</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">num </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#6A737D">// ← num 在这里 drop，锁立刻释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 锁已释放，可以再次获取</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"m = {:?}"</span><span style="color:#E1E4E8">, m);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **经验法则**：只在真正需要修改数据的几行外套 `{}`，改完立刻释放。持锁时间越短，其他线程等待的时间就越短，并发效率越高。

## 单线程场景验证

先确保单线程里 Mutex 正常工作，再推进到多线程：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AMutex%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20scores%20%3D%20Mutex%3A%3Anew(vec!%5B%5D)%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20mut%20s%20%3D%20scores.lock().unwrap()%3B%0A%20%20%20%20%20%20%20%20s.push(10)%3B%0A%20%20%20%20%20%20%20%20s.push(20)%3B%0A%20%20%20%20%7D%20%2F%2F%20%E9%94%81%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20mut%20s%20%3D%20scores.lock().unwrap()%3B%0A%20%20%20%20%20%20%20%20s.push(30)%3B%0A%20%20%20%20%7D%20%2F%2F%20%E9%94%81%E5%86%8D%E6%AC%A1%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20scores.lock().unwrap())%3B%20%2F%2F%20%5B10%2C%2020%2C%2030%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Mutex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> scores </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Mutex</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">        s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#6A737D">// 锁释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">        s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#6A737D">// 锁再次释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// [10, 20, 30]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# Arc<T>：线程安全的引用计数

## 为什么不能用 Rc<T>

你可能想到：多线程共享数据，上一章用 `Rc<T>` 实现了多所有权，直接用不就好了？

<div class="code-runner" data-full-code="use%20std%3A%3Arc%3A%3ARc%3B%0Ause%20std%3A%3Async%3A%3AMutex%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20counter%20%3D%20Rc%3A%3Anew(Mutex%3A%3Anew(0))%3B%0A%0A%20%20%20%20let%20counter2%20%3D%20Rc%3A%3Aclone(%26counter)%3B%0A%20%20%20%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ARc%3CT%3E%20%E4%B8%8D%E5%AE%9E%E7%8E%B0%20Send%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%8F%91%E9%80%81%E5%88%B0%E5%85%B6%E4%BB%96%E7%BA%BF%E7%A8%8B%0A%20%20%20%20%20%20%20%20*counter2.lock().unwrap()%20%2B%3D%201%3B%0A%20%20%20%20%7D)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">Rc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Mutex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> counter </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Mutex</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> counter2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">counter);</span></span>
<span class="line"><span style="color:#B392F0">    thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 编译错误：Rc&lt;T&gt; 不实现 Send，不能发送到其他线程</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">counter2</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器拒绝了：**`Rc<T>` 不是线程安全的**。原因在于 `Rc<T>` 的引用计数是普通整数操作，两个线程同时克隆时可能同时修改引用计数，导致计数混乱，最终引发内存安全问题。

## Arc<T>：原子引用计数

`Arc<T>`（Atomic Reference Counting）是 `Rc<T>` 的线程安全版本。它用**原子操作**来更新引用计数，保证计数的修改不会被打断：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3AArc%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20Arc%3A%3Anew(vec!%5B1%2C%202%2C%203%5D)%3B%0A%0A%20%20%20%20let%20data2%20%3D%20Arc%3A%3Aclone(%26data)%3B%0A%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20data2%20%E7%8E%B0%E5%9C%A8%E5%B1%9E%E4%BA%8E%E5%AD%90%E7%BA%BF%E7%A8%8B%EF%BC%8C%E5%92%8C%E4%B8%BB%E7%BA%BF%E7%A8%8B%E7%9A%84%20data%20%E5%85%B1%E4%BA%AB%E5%90%8C%E4%B8%80%E4%BB%BD%E5%A0%86%E5%86%85%E5%AD%98%0A%20%20%20%20%20%20%20%20println!(%22%E5%AD%90%E7%BA%BF%E7%A8%8B%E7%9C%8B%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE%EF%BC%9A%7B%3A%3F%7D%22%2C%20data2)%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20handle.join().unwrap()%3B%0A%20%20%20%20println!(%22%E4%B8%BB%E7%BA%BF%E7%A8%8B%E7%9C%8B%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE%EF%BC%9A%7B%3A%3F%7D%22%2C%20data)%3B%0A%20%20%20%20%2F%2F%20%E4%B8%A4%E4%B8%AA%20Arc%20drop%20%E5%90%8E%EF%BC%8C%E5%A0%86%E5%86%85%E5%AD%98%E6%89%8D%E7%9C%9F%E6%AD%A3%E9%87%8A%E6%94%BE%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">Arc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">data);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // data2 现在属于子线程，和主线程的 data 共享同一份堆内存</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"子线程看到的数据：{:?}"</span><span style="color:#E1E4E8">, data2);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"主线程看到的数据：{:?}"</span><span style="color:#E1E4E8">, data);</span></span>
<span class="line"><span style="color:#6A737D">    // 两个 Arc drop 后，堆内存才真正释放</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `Arc` 和 `Rc` 的 API 完全相同，只是多线程场景下换成 `Arc` 即可。代价是原子操作比普通整数操作稍慢，所以单线程仍然首选 `Rc`。

# Arc<Mutex<T>>：共享可变状态

## 组合两者

`Arc<T>` 解决了”多个线程都持有所有权”的问题，但 `Arc<T>` 本身是**不可变**的。要让多个线程共享**并修改**同一份数据，需要把 `Mutex<T>` 套在里面：`Arc<Mutex<T>>`。

- `Arc` 负责：让多个线程都能持有这份数据的所有权（引用计数）
- `Mutex` 负责：保证同一时刻只有一个线程在修改数据（加锁）

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3A%7BArc%2C%20Mutex%7D%3B%0Ause%20std%3A%3Athread%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Arc%3CMutex%3Ci32%3E%3E%EF%BC%9A%E5%8F%AF%E4%BB%A5%E8%B7%A8%E7%BA%BF%E7%A8%8B%E5%85%B1%E4%BA%AB%E7%9A%84%E5%8F%AF%E5%8F%98%E8%AE%A1%E6%95%B0%E5%99%A8%0A%20%20%20%20let%20counter%20%3D%20Arc%3A%3Anew(Mutex%3A%3Anew(0))%3B%0A%20%20%20%20let%20mut%20handles%20%3D%20vec!%5B%5D%3B%0A%0A%20%20%20%20for%20_%20in%200..5%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20Arc%3A%3Aclone%20%E5%A2%9E%E5%8A%A0%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%EF%BC%8C%E6%AF%8F%E4%B8%AA%E7%BA%BF%E7%A8%8B%E9%83%BD%E5%BE%97%E5%88%B0%E4%B8%80%E4%BB%BD%22%E9%97%A8%E7%A5%A8%22%0A%20%20%20%20%20%20%20%20let%20counter%20%3D%20Arc%3A%3Aclone(%26counter)%3B%0A%20%20%20%20%20%20%20%20let%20handle%20%3D%20thread%3A%3Aspawn(move%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%AF%8F%E4%B8%AA%E7%BA%BF%E7%A8%8B%E8%BD%AE%E6%B5%81%E8%8E%B7%E5%8F%96%E9%94%81%EF%BC%8C%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%0A%20%20%20%20%20%20%20%20%20%20%20%20let%20mut%20num%20%3D%20counter.lock().unwrap()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20*num%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20%7D)%3B%20%2F%2F%20num%20%E5%9C%A8%E8%BF%99%E9%87%8C%20drop%EF%BC%8C%E9%94%81%E8%87%AA%E5%8A%A8%E9%87%8A%E6%94%BE%0A%20%20%20%20%20%20%20%20handles.push(handle)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E7%AD%89%E5%BE%85%E6%89%80%E6%9C%89%E7%BA%BF%E7%A8%8B%E5%AE%8C%E6%88%90%0A%20%20%20%20for%20handle%20in%20handles%20%7B%0A%20%20%20%20%20%20%20%20handle.join().unwrap()%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E6%9C%80%E7%BB%88%E8%AE%A1%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20*counter.lock().unwrap())%3B%20%2F%2F%205%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">Arc</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Mutex</span><span style="color:#E1E4E8">};</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // Arc&lt;Mutex&lt;i32&gt;&gt;：可以跨线程共享的可变计数器</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> counter </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Mutex</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> handles </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> _ </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // Arc::clone 增加引用计数，每个线程都得到一份"门票"</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> counter </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Arc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">counter);</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> thread</span><span style="color:#F97583">::</span><span style="color:#B392F0">spawn</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">            // 每个线程轮流获取锁，修改数据</span></span>
<span class="line"><span style="color:#F97583">            let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> counter</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">            *</span><span style="color:#E1E4E8">num </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        }); </span><span style="color:#6A737D">// num 在这里 drop，锁自动释放</span></span>
<span class="line"><span style="color:#E1E4E8">        handles</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(handle);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 等待所有线程完成</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> handle </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> handles {</span></span>
<span class="line"><span style="color:#E1E4E8">        handle</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最终计数：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">counter</span><span style="color:#F97583">.</span><span style="color:#B392F0">lock</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

5 个线程各自加 1，最终结果一定是 5，不会出现数据竞争。

## 内部可变性的回顾

你会发现 `counter` 是不可变绑定，但我们却能修改它内部的值——这和 `RefCell<T>` 的道理一样，都是**内部可变性**。

| 组合 | 适用场景 |
| --- | --- |
| `Rc<RefCell<T>>` | 单线程，需要多所有权 + 可变性 |
| `Arc<Mutex<T>>` | 多线程，需要多所有权 + 可变性 |

`Mutex<T>` 是多线程版的 `RefCell<T>`：区别在于 `RefCell<T>` 在运行时检查借用规则，而 `Mutex<T>` 通过操作系统级别的锁来保证互斥。

## 死锁：需要注意的风险

Rust 能防止数据竞争，但**无法防止死锁**。死锁发生在：线程 A 持有锁 1，等待锁 2；线程 B 持有锁 2，等待锁 1——两者互相等待，永远不会释放。

避免死锁的简单原则：

- 尽量缩短持有锁的时间（把锁的作用域写小）
- 多把锁时，所有线程按相同顺序获取

# 选哪个？决策指南

学完智能指针和并发这两章，你面前摆着一堆工具：`Box`、`Rc`、`Arc`、`RefCell`、`Mutex`……初学者最容易困惑的就是”我到底该用哪个”。这里给出一个清晰的决策思路。

## 第一步：是否需要多所有权？

**不需要**（一个值只有一个所有者）→ 直接用普通所有权或 `Box<T>`。

**需要**（多个地方都要”拥有”同一份数据）→ 继续往下看。

## 第二步：是否跨线程？

**单线程** → 用 `Rc<T>`（引用计数，轻量，不带线程安全开销）

**多线程** → 用 `Arc<T>`（原子引用计数，线程安全）

## 第三步：是否需要修改共享的数据？

只读共享：到上一步就够了，`Rc<T>` 或 `Arc<T>` 直接用。

需要修改：

| 场景 | 用法 |
| --- | --- |
| 单线程，多所有权 + 可变 | `Rc<RefCell<T>>` |
| 多线程，多所有权 + 可变 | `Arc<Mutex<T>>` |

## 完整速查表

| 需求 | 推荐工具 | 原因 |
| --- | --- | --- |
| 堆分配 / 递归类型 | `Box<T>` | 最简单的堆指针，单一所有权 |
| 单线程多所有权（只读） | `Rc<T>` | 引用计数，零线程开销 |
| 单线程多所有权（可变） | `Rc<RefCell<T>>` | RefCell 提供运行时借用检查 |
| 多线程多所有权（只读） | `Arc<T>` | 原子引用计数 |
| 多线程多所有权（可变） | `Arc<Mutex<T>>` | Mutex 保证互斥访问 |
| 多线程单向数据传递 | `mpsc::channel` | 所有权转移，天然安全 |

> **经验法则**：能用普通所有权就不用 `Rc`；能用 `Rc` 就不用 `Arc`；能用通道就不用 `Mutex`。越简单的工具，出错的可能性越小。

# 练习题

## 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let n = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..3 {
        let n = Arc::clone(&n);
        handles.push(thread::spawn(move || {
            *n.lock().unwrap() += 10;
        }));
    }
    for h in handles { h.join().unwrap(); }
    println!("{}", *n.lock().unwrap());
}
```

加载题目中…

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let n = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for i in 1..=3 {
        let n = Arc::clone(&n);
        handles.push(thread::spawn(move || {
            *n.lock().unwrap() = i * 10; // 赋值，不是累加
        }));
    }
    for h in handles { h.join().unwrap(); }
    println!("{}", *n.lock().unwrap());
}
```

加载题目中…

加载题目中…