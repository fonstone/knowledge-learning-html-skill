# 什么是 HashMap

**HashMap<K, V>** 是 Rust 标准库中最常用的**键值对**（key-value pair）集合类型。与向量 `Vec<T>` 和字符串 `String` 不同，HashMap 不按位置存储数据，而是通过**键**来查找对应的**值**。

想象一个现实场景：你要建一本电话簿。向量不太适合，因为你需要通过**姓名**（而不是位置）来查找电话号码。

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20HashMap%20%E5%AD%98%E5%82%A8%E4%BA%BA%E5%90%8D%20-%3E%20%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81%0A%20%20%20%20let%20mut%20phone_book%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20phone_book.insert(%22Alice%22%2C%20%22123-4567%22)%3B%0A%20%20%20%20phone_book.insert(%22Bob%22%2C%20%22234-5678%22)%3B%0A%20%20%20%20phone_book.insert(%22Charlie%22%2C%20%22345-6789%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E9%80%9A%E8%BF%87%E5%A7%93%E5%90%8D%E6%9F%A5%E6%89%BE%E7%94%B5%E8%AF%9D%0A%20%20%20%20if%20let%20Some(phone)%20%3D%20phone_book.get(%22Alice%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22Alice%20%E7%9A%84%E7%94%B5%E8%AF%9D%EF%BC%9A%7B%7D%22%2C%20phone)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 创建一个 HashMap 存储人名 -&gt; 电话号码</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> phone_book </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    phone_book</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"123-4567"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    phone_book</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"234-5678"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    phone_book</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Charlie"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"345-6789"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 通过姓名查找电话</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(phone) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> phone_book</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice 的电话：{}"</span><span style="color:#E1E4E8">, phone);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为什么需要 HashMap

对比三种查找场景：

| 场景 | 向量 | 字符串 | HashMap |
| --- | --- | --- | --- |
| 按位置查找 | ✓ 快速 | ✗ 不适合 | ✗ 不适合 |
| 按内容查找 | ✗ 需要遍历 | ✓ 可以 | ✓ 快速 |
| 关联数据 | ✗ 分散 | ✗ 分散 | ✓ 紧凑 |

HashMap 通过**哈希函数**将键映射到存储位置，使得查找、插入、删除的平均时间复杂度是 O(1)，远比遍历向量快得多。

## HashMap 的基本概念

每个条目由两部分组成：

- 键（Key） ：用来查找的唯一标识，必须实现 Eq 和 Hash trait
- 值（Value） ：与键关联的数据，类型没有限制

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20Key%20%E6%98%AF%20String%EF%BC%8CValue%20%E6%98%AF%20i32%0A%20%20%20%20map.insert(%22apple%22%2C%205)%3B%0A%20%20%20%20map.insert(%22banana%22%2C%203)%3B%0A%20%20%20%20map.insert(%22cherry%22%2C%207)%3B%0A%0A%20%20%20%20println!(%22%E8%8B%B9%E6%9E%9C%E7%9A%84%E6%95%B0%E9%87%8F%EF%BC%9A%7B%7D%22%2C%20map.get(%22apple%22).unwrap_or(%260))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // Key 是 String，Value 是 i32</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"apple"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"banana"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"cherry"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"苹果的数量：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"apple"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap_or</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **哈希函数**（Hash Function）：一个函数，能快速把任意大小的输入”转换”成固定大小的数字（位置）。想象一下档案馆：给定一个人名，哈希函数计算出应该放在哪一行哪一列，从而快速找到文件。Rust 中常见的键类型（`i32`、`String` 等）都内置了哈希实现，不用你手动处理。

# 使用HashMap

## 创建和初始化 HashMap

### 使用 `HashMap::new()`

最直接的创建方式：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%3A%20HashMap%3CString%2C%20i32%3E%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20println!(%22%E7%A9%BA%20HashMap%20%E7%9A%84%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20map.len())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">:</span><span style="color:#B392F0"> HashMap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"空 HashMap 的长度：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意这里需要显式标注类型 `HashMap<String, i32>`，因为 HashMap 是空的，编译器无法推断。

### 从向量创建

一个常见的模式是从**元组向量**转换成 HashMap：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%B8%80%E4%B8%AA%E5%9B%A2%E9%98%9F%E7%9A%84%E5%90%8D%E5%AD%97%E5%92%8C%E6%88%90%E7%BB%A9%0A%20%20%20%20let%20teams%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20(%22Alice%22%2C%2088)%2C%0A%20%20%20%20%20%20%20%20(%22Bob%22%2C%2092)%2C%0A%20%20%20%20%20%20%20%20(%22Charlie%22%2C%2085)%2C%0A%20%20%20%20%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BD%BF%E7%94%A8%20collect()%20%E5%B0%86%E5%90%91%E9%87%8F%E8%BD%AC%E6%8D%A2%E4%B8%BA%20HashMap%0A%20%20%20%20let%20scores%3A%20HashMap%3C%26str%2C%20i32%3E%20%3D%20teams.iter().cloned().collect()%3B%0A%0A%20%20%20%20println!(%22%E6%80%BB%E5%85%B1%20%7B%7D%20%E4%B8%AA%E5%9B%A2%E9%98%9F%22%2C%20scores.len())%3B%0A%20%20%20%20println!(%22Bob%20%E7%9A%84%E6%88%90%E7%BB%A9%EF%BC%9A%7B%7D%22%2C%20scores.get(%22Bob%22).unwrap_or(%260))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 一个团队的名字和成绩</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> teams </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">88</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">92</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"Charlie"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">85</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 使用 collect() 将向量转换为 HashMap</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> scores</span><span style="color:#F97583">:</span><span style="color:#B392F0"> HashMap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> teams</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">cloned</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"总共 {} 个团队"</span><span style="color:#E1E4E8">, scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob 的成绩：{}"</span><span style="color:#E1E4E8">, scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap_or</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **学习提示**：`iter().cloned().collect()` 是一个很常用的模式。不用现在完全理解迭代器的细节，[闭包与迭代器](#/chapters/12-closures-iterators/00-index)章节会详细讲解。

## 访问 HashMap 中的值

### 使用 `get()` 方法

最安全的访问方式是 `get()`，它返回 `Option<&V>`：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22name%22%2C%20%22Alice%22)%3B%0A%20%20%20%20map.insert(%22job%22%2C%20%22Engineer%22)%3B%0A%0A%20%20%20%20%2F%2F%20get()%20%E8%BF%94%E5%9B%9E%20Option%3C%26V%3E%0A%20%20%20%20match%20map.get(%22name%22)%20%7B%0A%20%20%20%20%20%20%20%20Some(name)%20%3D%3E%20println!(%22%E5%90%8D%E5%AD%97%EF%BC%9A%7B%7D%22%2C%20name)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E6%89%BE%E4%B8%8D%E5%88%B0%20name%20%E9%94%AE%22)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20match%20map.get(%22age%22)%20%7B%0A%20%20%20%20%20%20%20%20Some(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%EF%BC%9A%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E6%89%BE%E4%B8%8D%E5%88%B0%20age%20%E9%94%AE%22)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"job"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Engineer"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // get() 返回 Option&lt;&amp;V&gt;</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(name) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"名字：{}"</span><span style="color:#E1E4E8">, name),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"找不到 name 键"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"age"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄：{}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"找不到 age 键"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`get()` 的优点是**不会 panic**，你可以安全地处理键不存在的情况。

### 使用索引访问

也可以直接用 `map[key]` 访问，但如果键不存在会 panic：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22city%22%2C%20%22Beijing%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E9%94%AE%E7%A1%AE%E5%AE%9E%E5%AD%98%E5%9C%A8%EF%BC%8C%E7%9B%B4%E6%8E%A5%E7%94%A8%20%5B%5D%20%E6%B2%A1%E5%85%B3%E7%B3%BB%0A%20%20%20%20println!(%22%E5%9F%8E%E5%B8%82%EF%BC%9A%7B%7D%22%2C%20map%5B%22city%22%5D)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BD%86%E5%A6%82%E6%9E%9C%E9%94%AE%E4%B8%8D%E5%AD%98%E5%9C%A8%E4%BC%9A%20panic%EF%BC%9A%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20map%5B%22nonexistent%22%5D)%3B%20%20%2F%2F%20%E2%9C%97%20panic%EF%BC%81%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"city"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Beijing"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果键确实存在，直接用 [] 没关系</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"城市：{}"</span><span style="color:#E1E4E8">, map[</span><span style="color:#9ECBFF">"city"</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 但如果键不存在会 panic：</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", map["nonexistent"]);  // ✗ panic！</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**选择建议**：

- 用 get() 当键可能不存在时
- 用 [] 当你确定键一定存在时

### 检查键是否存在

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22red%22%2C%200xFF0000)%3B%0A%20%20%20%20map.insert(%22green%22%2C%200x00FF00)%3B%0A%0A%20%20%20%20if%20map.contains_key(%22red%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E7%BA%A2%E8%89%B2%E5%AD%98%E5%9C%A8%EF%BC%81%22)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20!map.contains_key(%22blue%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E8%93%9D%E8%89%B2%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%8C%E6%B7%BB%E5%8A%A0%E5%AE%83%22)%3B%0A%20%20%20%20%20%20%20%20map.insert(%22blue%22%2C%200x0000FF)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"red"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0xFF0000</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"green"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0x00FF00</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains_key</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"red"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"红色存在！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">map</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains_key</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"blue"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"蓝色不存在，添加它"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"blue"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0x0000FF</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 获取 HashMap 的大小

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22x%22%2C%2010)%3B%0A%20%20%20%20map.insert(%22y%22%2C%2020)%3B%0A%0A%20%20%20%20println!(%22%E6%9D%A1%E7%9B%AE%E6%95%B0%E9%87%8F%EF%BC%9A%7B%7D%22%2C%20map.len())%3B%0A%20%20%20%20println!(%22%E6%98%AF%E5%90%A6%E4%B8%BA%E7%A9%BA%EF%BC%9A%7B%7D%22%2C%20map.is_empty())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"y"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"条目数量：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"是否为空：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_empty</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 插入和修改数据

### 插入新键值对

`insert()` 既可以添加新数据，也可以覆盖存在的值：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%8F%92%E5%85%A5%0A%20%20%20%20map.insert(%22a%22%2C%201)%3B%0A%20%20%20%20println!(%22%E6%8F%92%E5%85%A5%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E9%94%AE%E5%B7%B2%E5%AD%98%E5%9C%A8%EF%BC%8C%E6%96%B0%E5%80%BC%E8%A6%86%E7%9B%96%E6%97%A7%E5%80%BC%0A%20%20%20%20let%20old_value%20%3D%20map.insert(%22a%22%2C%2010)%3B%0A%20%20%20%20println!(%22%E8%BF%94%E5%9B%9E%E7%9A%84%E6%97%A7%E5%80%BC%EF%BC%9A%7B%3A%3F%7D%22%2C%20old_value)%3B%0A%20%20%20%20println!(%22%E7%8E%B0%E5%9C%A8%E7%9A%84%E5%80%BC%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 第一次插入</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"插入后：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果键已存在，新值覆盖旧值</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> old_value </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"返回的旧值：{:?}"</span><span style="color:#E1E4E8">, old_value);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"现在的值：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`insert()` 会返回原来的值（如果存在），这很有用。

### 使用 `entry()` API 优化更新

**`entry()` 的作用**：只需查找一次，就能**检查键是否存在**并**根据存在与否来执行不同的操作**。它返回一个 `Entry` 对象，你可以链式调用 `or_insert()`（不存在就插入）或 `and_modify()`（存在就修改）。

为什么用 `entry()` 而不是先 `get()` 再 `insert()`？因为 `entry()` 只查找一次，而分开操作需要查找两次，性能更差。

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E5%9C%BA%E6%99%AF%201%EF%BC%9A%E5%8F%AA%E5%9C%A8%E9%94%AE%E4%B8%8D%E5%AD%98%E5%9C%A8%E6%97%B6%E6%89%8D%E6%8F%92%E5%85%A5%0A%20%20%20%20map.entry(%22name%22).or_insert(%22Alice%22)%3B%0A%20%20%20%20println!(%22name%EF%BC%9A%7B%7D%22%2C%20map.get(%22name%22).unwrap())%3B%0A%0A%20%20%20%20map.entry(%22name%22).or_insert(%22Bob%22)%3B%20%20%2F%2F%20%E5%B7%B2%E5%AD%98%E5%9C%A8%EF%BC%8C%E4%B8%8D%E4%BC%9A%E6%94%B9%E5%8F%98%0A%20%20%20%20println!(%22name%20%E4%BB%8D%E7%84%B6%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20map.get(%22name%22).unwrap())%3B%0A%0A%20%20%20%20%2F%2F%20%E5%9C%BA%E6%99%AF%202%EF%BC%9A%E4%BF%AE%E6%94%B9%E5%B7%B2%E5%AD%98%E5%9C%A8%E7%9A%84%E5%80%BC%EF%BC%8C%E5%90%A6%E5%88%99%E6%8F%92%E5%85%A5%E5%88%9D%E5%A7%8B%E5%80%BC%EF%BC%88%E5%B8%B8%E8%A7%81%E7%9A%84%E8%AE%A1%E6%95%B0%E6%A8%A1%E5%BC%8F%EF%BC%89%0A%20%20%20%20map.entry(%22count%22)%0A%20%20%20%20%20%20%20%20.and_modify(%7Ce%7C%20*e%20%2B%3D%201)%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E5%AD%98%E5%9C%A8%EF%BC%8C%E4%BF%AE%E6%94%B9%E5%AE%83%EF%BC%8C%E8%BF%99%E9%87%8C%E7%9A%84%E6%93%8D%E4%BD%9C%E5%90%8E%E9%9D%A2%E4%BC%9A%E8%AE%B2%E5%88%B0%EF%BC%8C%E7%9B%AE%E5%89%8D%E5%8F%AA%E9%9C%80%E8%A6%81%E4%BC%9A%E7%94%A8%E5%8D%B3%E5%8F%AF%0A%20%20%20%20%20%20%20%20.or_insert(1)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%8C%E6%8F%92%E5%85%A5%201%0A%0A%20%20%20%20println!(%22count%EF%BC%9A%7B%7D%22%2C%20map.get(%22count%22).unwrap())%3B%0A%0A%20%20%20%20%2F%2F%20%E5%86%8D%E8%BF%90%E8%A1%8C%E4%B8%80%E6%AC%A1%0A%20%20%20%20map.entry(%22count%22)%0A%20%20%20%20%20%20%20%20.and_modify(%7Ce%7C%20*e%20%2B%3D%201)%0A%20%20%20%20%20%20%20%20.or_insert(1)%3B%0A%0A%20%20%20%20println!(%22count%20%E7%8E%B0%E5%9C%A8%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20map.get(%22count%22).unwrap())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 场景 1：只在键不存在时才插入</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">entry</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">or_insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">entry</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">or_insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 已存在，不会改变</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name 仍然是：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 场景 2：修改已存在的值，否则插入初始值（常见的计数模式）</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">entry</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">and_modify</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">e</span><span style="color:#F97583">|</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">e </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D">// 如果存在，修改它，这里的操作后面会讲到，目前只需要会用即可</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">or_insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);             </span><span style="color:#6A737D">// 如果不存在，插入 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 再运行一次</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">entry</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">and_modify</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">e</span><span style="color:#F97583">|</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">e </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">or_insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count 现在是：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个模式在**计数、累加、初始化**等场景中最常见。

## 删除数据

### 删除键值对

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22name%22%2C%20%22Alice%22)%3B%0A%20%20%20%20map.insert(%22age%22%2C%20%2228%22)%3B%0A%0A%20%20%20%20%2F%2F%20remove()%20%E8%BF%94%E5%9B%9E%E5%88%A0%E9%99%A4%E7%9A%84%E5%80%BC%0A%20%20%20%20if%20let%20Some(value)%20%3D%20map.remove(%22age%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%88%A0%E9%99%A4%E7%9A%84%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E5%88%A0%E9%99%A4%E5%90%8E%E7%9A%84%20map%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"age"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"28"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // remove() 返回删除的值</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">remove</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"age"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"删除的值：{}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"删除后的 map：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 清空 HashMap

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22a%22%2C%201)%3B%0A%20%20%20%20map.insert(%22b%22%2C%202)%3B%0A%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%89%8D%EF%BC%9A%7B%7D%22%2C%20map.len())%3B%0A%20%20%20%20map.clear()%3B%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20map.len())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空前：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">clear</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空后：{}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 遍历 HashMap

### 遍历所有键值对

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22red%22%2C%200xFF0000)%3B%0A%20%20%20%20map.insert(%22green%22%2C%200x00FF00)%3B%0A%20%20%20%20map.insert(%22blue%22%2C%200x0000FF)%3B%0A%0A%20%20%20%20%2F%2F%20%E9%81%8D%E5%8E%86%E9%94%AE%E5%80%BC%E5%AF%B9%0A%20%20%20%20for%20(color%2C%20hex)%20in%20%26map%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%E7%9A%84%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6%E5%80%BC%EF%BC%9A%7B%3A06X%7D%22%2C%20color%2C%20hex)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"red"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0xFF0000</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"green"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0x00FF00</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"blue"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0x0000FF</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 遍历键值对</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (color, hex) </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">map {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 的十六进制值：{:06X}"</span><span style="color:#E1E4E8">, color, hex);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 只遍历键

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22Alice%22%2C%2088)%3B%0A%20%20%20%20map.insert(%22Bob%22%2C%2092)%3B%0A%20%20%20%20map.insert(%22Charlie%22%2C%2085)%3B%0A%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E5%AD%A6%E7%94%9F%EF%BC%9A%22)%3B%0A%20%20%20%20for%20name%20in%20map.keys()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%20%20%7B%7D%22%2C%20name)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">88</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">92</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Charlie"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">85</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"所有学生："</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">keys</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"  {}"</span><span style="color:#E1E4E8">, name);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 只遍历值

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20map%20%3D%20%7B%0A%20%20%20%20%20%20%20%20let%20mut%20m%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20%20%20%20%20m.insert(%22Alice%22%2C%2088)%3B%0A%20%20%20%20%20%20%20%20m.insert(%22Bob%22%2C%2092)%3B%0A%20%20%20%20%20%20%20%20m.insert(%22Charlie%22%2C%2085)%3B%0A%20%20%20%20%20%20%20%20m%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E5%88%86%E6%95%B0%EF%BC%9A%22)%3B%0A%20%20%20%20for%20score%20in%20map.values()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%20%20%7B%7D%22%2C%20score)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">        m</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">88</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        m</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">92</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        m</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Charlie"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">85</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        m</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"所有分数："</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> score </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> map</span><span style="color:#F97583">.</span><span style="color:#B392F0">values</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"  {}"</span><span style="color:#E1E4E8">, score);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 可变遍历

要修改值，需要可变引用：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%22apple%22%2C%205)%3B%0A%20%20%20%20map.insert(%22banana%22%2C%203)%3B%0A%20%20%20%20map.insert(%22cherry%22%2C%207)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%B0%86%E6%89%80%E6%9C%89%E6%95%B0%E9%87%8F%E7%BF%BB%E5%80%8D%0A%20%20%20%20for%20(_fruit%2C%20count)%20in%20%26mut%20map%20%7B%0A%20%20%20%20%20%20%20%20*count%20*%3D%202%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E7%BF%BB%E5%80%8D%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"apple"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"banana"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"cherry"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 将所有数量翻倍</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (_fruit, count) </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> map {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">*=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"翻倍后：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **提示**：**不能在遍历 HashMap 时修改其大小**（添加或删除键值对）。这会导致迭代器失效，导致编译错误。如果需要在遍历中过滤或修改 HashMap，应该先遍历收集结果，然后在循环外修改。这个限制和向量一样——它们都使用迭代器，都要保护迭代器的有效性。

# HashMap 的所有权规则

HashMap **拥有其键和值的所有权**。这是一个容易出错的地方。

## 键和值被转移到 HashMap

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20key%20%3D%20String%3A%3Afrom(%22name%22)%3B%0A%20%20%20%20let%20value%20%3D%20String%3A%3Afrom(%22Alice%22)%3B%0A%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(key%2C%20value)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%20key%20%E5%92%8C%20value%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E8%BD%AC%E7%A7%BB%E5%88%B0%20map%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20key)%3B%20%20%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81key%20%E5%B7%B2%E8%A2%AB%E8%BD%AC%E7%A7%BB%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20value)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81value%20%E5%B7%B2%E8%A2%AB%E8%BD%AC%E7%A7%BB%0A%0A%20%20%20%20println!(%22map%20%E4%B8%AD%E7%9A%84%E5%80%BC%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> key </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(key, value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 现在 key 和 value 的所有权已转移到 map</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", key);    // ✗ 错误！key 已被转移</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", value);  // ✗ 错误！value 已被转移</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"map 中的值：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但如果键和值是 **Copy 类型**（如 `i32`），就不会转移所有权：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20key%20%3D%201%3B%0A%20%20%20%20let%20value%20%3D%20100%3B%0A%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(key%2C%20value)%3B%0A%0A%20%20%20%20%2F%2F%20key%20%E5%92%8C%20value%20%E9%83%BD%E6%98%AF%20i32%EF%BC%88Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%89%EF%BC%8C%E4%BB%8D%E5%8F%AF%E4%BD%BF%E7%94%A8%0A%20%20%20%20println!(%22key%EF%BC%9A%7B%7D%EF%BC%8Cvalue%EF%BC%9A%7B%7D%22%2C%20key%2C%20value)%3B%0A%20%20%20%20println!(%22map%20%E4%B8%AD%E7%9A%84%E5%80%BC%EF%BC%9A%7B%3A%3F%7D%22%2C%20map)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> key </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(key, value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // key 和 value 都是 i32（Copy 类型），仍可使用</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"key：{}，value：{}"</span><span style="color:#E1E4E8">, key, value);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"map 中的值：{:?}"</span><span style="color:#E1E4E8">, map);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 使用引用作为键

如果键是非 Copy 类型（如 `String`），不想转移所有权，可以用**引用**：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20key%20%3D%20String%3A%3Afrom(%22name%22)%3B%0A%20%20%20%20let%20value%20%3D%20String%3A%3Afrom(%22Alice%22)%3B%0A%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(%26key%2C%20%26value)%3B%20%20%2F%2F%20%E7%94%A8%E5%BC%95%E7%94%A8%0A%0A%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%E5%8F%AF%E4%BB%A5%E7%BB%A7%E7%BB%AD%E4%BD%BF%E7%94%A8%E5%8E%9F%E5%A7%8B%E7%9A%84%20key%20%E5%92%8C%20value%0A%20%20%20%20println!(%22key%EF%BC%9A%7B%7D%EF%BC%8Cvalue%EF%BC%9A%7B%7D%22%2C%20key%2C%20value)%3B%0A%20%20%20%20println!(%22map%20%E4%B8%AD%E7%9A%84%E9%94%AE%EF%BC%9A%7B%3A%3F%7D%22%2C%20map.get(key.as_str()).unwrap())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> key </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"name"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">key, </span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">value);  </span><span style="color:#6A737D">// 用引用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 现在可以继续使用原始的 key 和 value</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"key：{}，value：{}"</span><span style="color:#E1E4E8">, key, value);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"map 中的键：{:?}"</span><span style="color:#E1E4E8">, map</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(key</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_str</span><span style="color:#E1E4E8">())</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但这样做有个限制：HashMap 中的引用受**生命周期**约束（后续章节会学到）。实际上最常见的做法是 HashMap 拥有数据的所有权。

# HashMap 的重要特性

## 键必须实现 Eq 和 Hash

这是 HashMap 的一个基础限制。大多数内置类型（`i32`、`String`、`&str` 等）都实现了这两个 trait，所以通常不是问题。

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%BA%9B%E9%83%BD%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%E9%94%AE%0A%20%20%20%20let%20mut%20m1%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20m1.insert(1%2C%20%22one%22)%3B%20%20%2F%2F%20i32%20%E5%8F%AF%E4%BB%A5%0A%0A%20%20%20%20let%20mut%20m2%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20m2.insert(%22key%22%2C%20%22value%22)%3B%20%20%2F%2F%20%26str%20%E5%8F%AF%E4%BB%A5%0A%0A%20%20%20%20let%20mut%20m3%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20m3.insert(String%3A%3Afrom(%22key%22)%2C%20%22value%22)%3B%20%20%2F%2F%20String%20%E5%8F%AF%E4%BB%A5%0A%0A%20%20%20%20println!(%22%E6%89%80%E6%9C%89%E7%B1%BB%E5%9E%8B%E9%83%BD%E6%9C%89%E6%95%88%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 这些都是合法的键</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> m1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    m1</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"one"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// i32 可以</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> m2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    m2</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"key"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"value"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// &amp;str 可以</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> m3 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    m3</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"key"</span><span style="color:#E1E4E8">), </span><span style="color:#9ECBFF">"value"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// String 可以</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"所有类型都有效！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## HashMap 无序

HashMap **不保证遍历顺序**。如果需要有序的键值对，需要使用 `BTreeMap`（后续章节会提到）。

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20map%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20map.insert(3%2C%20%22three%22)%3B%0A%20%20%20%20map.insert(1%2C%20%22one%22)%3B%0A%20%20%20%20map.insert(2%2C%20%22two%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E9%81%8D%E5%8E%86%E9%A1%BA%E5%BA%8F%E6%9C%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%83%BD%E6%98%AF%203%2C%201%2C%202%20%E6%88%96%E4%BB%BB%E4%BD%95%E5%85%B6%E4%BB%96%E9%A1%BA%E5%BA%8F%0A%20%20%20%20for%20(k%2C%20v)%20in%20%26map%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%3A%20%7B%7D%22%2C%20k%2C%20v)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> map </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"three"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"one"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    map</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"two"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 遍历顺序未定义，可能是 3, 1, 2 或任何其他顺序</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (k, v) </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">map {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}: {}"</span><span style="color:#E1E4E8">, k, v);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## HashMap 基础测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

```rust
let mut map = HashMap::new();
map.insert("count", 0);
map.entry("count").and_modify(|e| *e += 1).or_insert(0);
map.entry("count").and_modify(|e| *e += 1).or_insert(0);
```

加载题目中…

加载题目中…

## 编程练习

### 练习 1：创建和查询 HashMap

创建一个 HashMap 存储学生姓名和分数，然后查询特定学生的分数。

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    // TODO: 添加三个学生及其分数
    // Alice: 88, Bob: 92, Charlie: 85


    // TODO: 查询 Alice 的分数，如果存在打印，不存在打印"学生不存在"


    // TODO: 检查 "Diana" 是否存在，不存在则添加分数 90


    for (name, score) in scores {
        println!("{}: {}", name, score);
    }
}
```

### 练习 2：更新和删除

在 HashMap 中更新值和删除键。

```rust
use std::collections::HashMap;

fn main() {
    let mut inventory = HashMap::new();
    inventory.insert("apple", 10);
    inventory.insert("banana", 5);
    inventory.insert("cherry", 8);

    println!("初始库存：{:?}", inventory);

    // TODO: 将苹果的数量增加 5 个（用 entry().and_modify(|e| *e += 5)）

    println!("苹果现在有 {} 个", inventory.get("apple").unwrap());

    // TODO: 删除香蕉并打印删除的数量
    if let Some(count) =  {
        println!("删除的香蕉数量：{}", count);
    }

    // TODO: 添加新的水果 "grape"，数量 12


    // TODO: 打印最终库存
    println!("最终库存：{:?}", inventory);
}
```