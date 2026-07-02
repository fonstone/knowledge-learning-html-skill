# 引用概述

上一篇讲了所有权转移，但有个问题：每次函数调用都转移所有权会很麻烦。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20(s2%2C%20len)%20%3D%20calculate_length(s1)%3B%20%2F%2F%20s1%20%E8%A2%AB%E8%BD%AC%E7%A7%BB%E8%BF%9B%E5%87%BD%E6%95%B0%0A%20%20%20%20println!(%22'%7B%7D'%20%E7%9A%84%E9%95%BF%E5%BA%A6%E6%98%AF%20%7B%7D%22%2C%20s2%2C%20len)%3B%0A%7D%0A%0Afn%20calculate_length(s%3A%20String)%20-%3E%20(String%2C%20usize)%20%7B%0A%20%20%20%20let%20length%20%3D%20s.len()%3B%0A%20%20%20%20(s%2C%20length)%20%2F%2F%20%E5%BF%85%E9%A1%BB%E6%8A%8A%20s%20%E4%B8%80%E8%B5%B7%E8%BF%94%E5%9B%9E%EF%BC%8C%E5%90%A6%E5%88%99%E8%BF%99%E9%87%8C%20%7D%20%E4%BC%9A%E5%B0%86%E5%85%B6%E9%94%80%E6%AF%81%EF%BC%8C%E8%B0%83%E7%94%A8%E8%80%85%EF%BC%88main%EF%BC%89%E5%86%8D%E4%B9%9F%E6%8B%BF%E4%B8%8D%E5%88%B0%E5%AE%83%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (s2, len) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> calculate_length</span><span style="color:#E1E4E8">(s1); </span><span style="color:#6A737D">// s1 被转移进函数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"'{}' 的长度是 {}"</span><span style="color:#E1E4E8">, s2, len);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> calculate_length</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">usize</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> length </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    (s, length) </span><span style="color:#6A737D">// 必须把 s 一起返回，否则这里 } 会将其销毁，调用者（main）再也拿不到它</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为了在函数返回后还能使用 `s1`，不得不把它连同结果一起装进元组返回。这太繁琐了。

有没有办法让函数**临时借用**数据，查看一下，然后让调用者继续拥有它？答案就是**引用**（reference）。

## 什么是引用

**引用**（reference）是一个指向值的指针，但它**不拥有这个值**。（**引用本质是指针**）

创建引用的行为叫做**借用**（borrowing）——就像借别人的书，看完要还，而且你不是主人。（**借用本质是动作**）

使用引用的语法很简单，加一个 `&`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20len%20%3D%20calculate_length(%26s1)%3B%20%2F%2F%20%E4%BC%A0%E5%BC%95%E7%94%A8%EF%BC%8Cs1%20%E6%89%80%E6%9C%89%E6%9D%83%E4%B8%8D%E5%8F%98%0A%20%20%20%20println!(%22'%7B%7D'%20%E7%9A%84%E9%95%BF%E5%BA%A6%E6%98%AF%20%7B%7D%22%2C%20s1%2C%20len)%3B%20%2F%2F%20s1%20%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%EF%BC%81%0A%7D%0A%0Afn%20calculate_length(s%3A%20%26String)%20-%3E%20usize%20%7B%20%2F%2F%20%E5%8F%82%E6%95%B0%E6%98%AF%E5%BC%95%E7%94%A8%0A%20%20%20%20s.len()%0A%7D%20%2F%2F%20s%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8C%E4%BD%86%E5%AE%83%E5%8F%AA%E6%98%AF%E5%BC%95%E7%94%A8%EF%BC%8C%E4%B8%8D%E6%8B%A5%E6%9C%89%E6%95%B0%E6%8D%AE%EF%BC%8C%E4%BB%80%E4%B9%88%E9%83%BD%E4%B8%8D%E5%8F%91%E7%94%9F" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> len </span><span style="color:#F97583">=</span><span style="color:#B392F0"> calculate_length</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">s1); </span><span style="color:#6A737D">// 传引用，s1 所有权不变</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"'{}' 的长度是 {}"</span><span style="color:#E1E4E8">, s1, len); </span><span style="color:#6A737D">// s1 仍然有效！</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> calculate_length</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8"> { </span><span style="color:#6A737D">// 参数是引用</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#6A737D">// s 离开作用域，但它只是引用，不拥有数据，什么都不发生</span></span></code></pre></div>

`&s1` 创建了一个指向 `s1` 的引用。当引用离开作用域时，被引用的数据**不会被释放**，因为引用不拥有这些数据——所有权还在 `s1` 手里。

# 引用的可变性

## 不可变引用

引用默认是**不可变的**——通过引用只能**读取**数据，不能**修改**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20change(%26s)%3B%0A%7D%0A%0Afn%20change(s%3A%20%26String)%20%7B%0A%20%20%20%20s.push_str(%22%2C%20world%22)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E4%B8%8D%E8%83%BD%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    change</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> change</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", world"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 错误：不可变引用不能修改数据</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这和变量的默认行为一致：`let` 绑定默认不可变，`&T` 也默认不可变。

> 原变量是否 `mut` 和引用是否 `&mut` **互不影响**：即使原变量声明了 `let mut`，`&s` 默认仍然是**不可变引用**（必须显式写 `&mut s` 才能创建可变引用）

## 可变引用

如果需要通过引用**修改**数据，引用本身也需要是可变的。使用**可变引用** `&mut T`。

创建和使用可变引用需要三处配合：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%2F%2F%201.%20%E5%8E%9F%E5%8F%98%E9%87%8F%E5%BF%85%E9%A1%BB%E5%A3%B0%E6%98%8E%E4%B8%BA%20mut%0A%0A%20%20%20%20change(%26mut%20s)%3B%20%2F%2F%202.%20%E4%BC%A0%E5%8F%82%E6%97%B6%E7%94%A8%20%26mut%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D%0A%0Afn%20change(s%3A%20%26mut%20String)%20%7B%20%2F%2F%203.%20%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E6%98%AF%20%26mut%20String%0A%20%20%20%20s.push_str(%22%2C%20world%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 1. 原变量必须声明为 mut</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    change</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> s); </span><span style="color:#6A737D">// 2. 传参时用 &amp;mut</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> change</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) { </span><span style="color:#6A737D">// 3. 参数类型是 &amp;mut String</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

三处缺一不可。比如原变量不是 `mut`，编译器会直接报错：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%2F%2F%20%E6%B2%A1%E6%9C%89%20mut%0A%20%20%20%20change(%26mut%20s)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E4%B8%8D%E8%83%BD%E4%BB%8E%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%8F%98%E9%87%8F%E5%88%9B%E5%BB%BA%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%0A%7D%0A%0Afn%20change(s%3A%20%26mut%20String)%20%7B%0A%20%20%20%20s.push_str(%22%2C%20world%22)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 没有 mut</span></span>
<span class="line"><span style="color:#B392F0">    change</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> s); </span><span style="color:#6A737D">// 错误：不能从不可变变量创建可变引用</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> change</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **重要**：函数签名是一个**契约**。即使函数实现里没有实际修改数据，只要签名声明了 `&mut T`，调用者就**必须传入可变引用**。编译器不会根据函数体的实际行为来”宽松”处理。这是为了让调用者只看签名就清楚地知道这个函数可能会修改数据。

# 借用的两条核心规则

Rust 针对引用有两条核心规则限制。它们是 Rust 借用系统的基础：

> **规则一**：在任意给定时间，**要么**只能有任意数量的不可变引用，**要么**只能有一个可变引用。两者**不能同时存在**。
> **规则二**：引用必须总是有效的，不能指向已释放的数据。

## 规则一详解：排他性与多重共享

### 情况一：多个不可变引用可以共存

不可变引用可以同时有很多个，因为只读操作之间互不干扰：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20r1%20%3D%20%26s%3B%0A%20%20%20%20let%20r2%20%3D%20%26s%3B%0A%20%20%20%20let%20r3%20%3D%20%26s%3B%20%2F%2F%20%E5%AE%8C%E5%85%A8%E6%B2%A1%E9%97%AE%E9%A2%98%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%9C%89%E4%BB%BB%E6%84%8F%E5%A4%9A%E4%B8%AA%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%0A%0A%20%20%20%20println!(%22%7B%7D%2C%20%7B%7D%2C%20%7B%7D%22%2C%20r1%2C%20r2%2C%20r3)%3B%0A%20%20%20%20println!(%22%E5%8E%9F%E5%A7%8B%E5%80%BC%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r3 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s; </span><span style="color:#6A737D">// 完全没问题，可以有任意多个不可变引用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}, {}, {}"</span><span style="color:#E1E4E8">, r1, r2, r3);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"原始值仍然有效：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 如果是多个不可变引用，那么原数据可以被正常访问。即使原数据是 `let mut` 声明的，在不可变引用活跃期间，也可以通过原变量读取（因为读取不会违反”只读”的约束），但不能修改。

### 情况二：同一时间只能有一个可变引用

可变引用有个重要限制：**对同一数据，同一时间只能有一个活跃的可变引用**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20r1%20%3D%20%26mut%20s%3B%0A%20%20%20%20let%20r2%20%3D%20%26mut%20s%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81s%20%E5%B7%B2%E7%BB%8F%E8%A2%AB%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E4%BA%86%0A%0A%20%20%20%20println!(%22%7B%7D%2C%20%7B%7D%22%2C%20r1%2C%20r2)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s; </span><span style="color:#6A737D">// 错误！s 已经被可变借用了</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}, {}"</span><span style="color:#E1E4E8">, r1, r2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**为什么有这个限制**？想象两个人同时修改同一份文件——谁的改动会最终被保存？结果不可预测。这就是**数据竞争**（data race）——两个或更多指针同时访问同一数据，且至少有一个在写入，且没有同步机制。数据竞争导致未定义行为，极难调试。

Rust 直接在编译期**禁止一切有数据竞争风险的代码**。

### 情况三：不可变引用与可变引用不能共存

当已经有不可变引用时，不能创建可变引用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20r1%20%3D%20%26s%3B%20%20%20%20%20%20%20%20%2F%2F%20%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%0A%20%20%20%20let%20r2%20%3D%20%26s%3B%20%20%20%20%20%20%20%20%2F%2F%20%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%EF%BC%8C%E6%B2%A1%E9%97%AE%E9%A2%98%0A%20%20%20%20let%20r3%20%3D%20%26mut%20s%3B%20%20%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81r1%20%E5%92%8C%20r2%20%E8%BF%98%E6%B4%BB%E7%9D%80%0A%0A%20%20%20%20println!(%22%7B%7D%2C%20%7B%7D%2C%20%7B%7D%22%2C%20r1%2C%20r2%2C%20r3)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;        </span><span style="color:#6A737D">// 不可变引用</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;        </span><span style="color:#6A737D">// 不可变引用，没问题</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r3 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s;    </span><span style="color:#6A737D">// 错误！r1 和 r2 还活着</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}, {}, {}"</span><span style="color:#E1E4E8">, r1, r2, r3);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

想象你正在读一份文件（不可变引用），同时另一个人正在修改它（可变引用）——你读到的内容就可能前后矛盾。

### 错开引用的使用（NLL）

关键是不能**同时活跃**。如果一个引用已经不再使用，就可以创建新的（包括可变的）引用。

Rust 编译器能智能判断引用**最后一次使用**的位置。引用的有效范围只到最后一次使用处为止，而不是到块的右花括号。这叫做**非词法作用域生命周期**（Non-Lexical Lifetimes，NLL）。

正因如此，下面的代码是合法的：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20r1%20%3D%20%26s%3B%0A%20%20%20%20let%20r2%20%3D%20%26s%3B%0A%20%20%20%20println!(%22%7B%7D%20%E5%92%8C%20%7B%7D%22%2C%20r1%2C%20r2)%3B%0A%20%20%20%20%2F%2F%20r1%E3%80%81r2%20%E5%9C%A8%E8%BF%99%E9%87%8C%E6%98%AF%E6%9C%80%E5%90%8E%E4%B8%80%E6%AC%A1%E4%BD%BF%E7%94%A8%EF%BC%8C%E5%80%9F%E7%94%A8%E5%88%B0%E6%AD%A4%E7%BB%93%E6%9D%9F%0A%0A%20%20%20%20let%20r3%20%3D%20%26mut%20s%3B%20%2F%2F%20%E5%90%88%E6%B3%95%EF%BC%81r1%20%E5%92%8C%20r2%20%E7%9A%84%E5%80%9F%E7%94%A8%E5%B7%B2%E7%BB%8F%E7%BB%93%E6%9D%9F%0A%20%20%20%20r3.push_str(%22%2C%20world%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20r3)%3B%0A%20%20%20%20%2F%2F%20r3%20%E7%9A%84%E5%80%9F%E7%94%A8%E5%88%B0%E8%BF%99%E9%87%8C%E7%BB%93%E6%9D%9F%0A%0A%20%20%20%20%2F%2F%20r3%20%E4%BD%BF%E7%94%A8%E5%AE%8C%E5%90%8E%EF%BC%8C%E8%BF%98%E8%83%BD%E5%86%8D%E5%88%9B%E5%BB%BA%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%0A%20%20%20%20let%20r4%20%3D%20%26s%3B%0A%20%20%20%20let%20r5%20%3D%20%26s%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%90%8E%E8%AF%BB%E5%8F%96%EF%BC%9A%7B%7D%2C%20%7B%7D%22%2C%20r4%2C%20r5)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 和 {}"</span><span style="color:#E1E4E8">, r1, r2);</span></span>
<span class="line"><span style="color:#6A737D">    // r1、r2 在这里是最后一次使用，借用到此结束</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r3 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s; </span><span style="color:#6A737D">// 合法！r1 和 r2 的借用已经结束</span></span>
<span class="line"><span style="color:#E1E4E8">    r3</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, r3);</span></span>
<span class="line"><span style="color:#6A737D">    // r3 的借用到这里结束</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // r3 使用完后，还能再创建不可变引用</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r4 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r5 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最后读取：{}, {}"</span><span style="color:#E1E4E8">, r4, r5);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

r1 和 r2 在 `println!` 之后就不再使用了，所以它们的借用在那时就结束了。虽然块的右花括号还在下面，但 r3 可以创建可变引用，因为 r1、r2 已经不活跃了。

同样，多个可变引用也可以错开使用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20r1%20%3D%20%26mut%20s%3B%0A%20%20%20%20%20%20%20%20r1.push_str(%22%20world%22)%3B%0A%20%20%20%20%20%20%20%20println!(%22%E5%86%85%E9%83%A8%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%9A%7B%7D%22%2C%20r1)%3B%0A%20%20%20%20%7D%20%2F%2F%20r1%20%E5%9C%A8%E8%BF%99%E9%87%8C%E7%BB%93%E6%9D%9F%EF%BC%8C%E5%80%9F%E7%94%A8%E8%A2%AB%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20let%20r2%20%3D%20%26mut%20s%3B%20%2F%2F%20%E7%8E%B0%E5%9C%A8%E5%8F%AF%E4%BB%A5%E5%88%9B%E5%BB%BA%E6%96%B0%E7%9A%84%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%0A%20%20%20%20r2.push_str(%22!%22)%3B%0A%20%20%20%20println!(%22%E6%9C%80%E7%BB%88%EF%BC%9A%7B%7D%22%2C%20r2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s;</span></span>
<span class="line"><span style="color:#E1E4E8">        r1</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">" world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"内部作用域：{}"</span><span style="color:#E1E4E8">, r1);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#6A737D">// r1 在这里结束，借用被释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> s; </span><span style="color:#6A737D">// 现在可以创建新的可变引用</span></span>
<span class="line"><span style="color:#E1E4E8">    r2</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最终：{}"</span><span style="color:#E1E4E8">, r2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 规则二详解：有效性

在有指针的语言中，很容易写出**悬垂指针**——指针指向的内存已被释放，但指针还在。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20r%20%3D%20dangle()%3B%0A%7D%0A%0Afn%20dangle()%20-%3E%20%26String%20%7B%20%2F%2F%20%E8%AF%95%E5%9B%BE%E8%BF%94%E5%9B%9E%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%BC%95%E7%94%A8%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%26s%20%2F%2F%20%E8%BF%94%E5%9B%9E%20s%20%E7%9A%84%E5%BC%95%E7%94%A8%0A%7D%20%2F%2F%20s%20%E5%9C%A8%E8%BF%99%E9%87%8C%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E8%A2%AB%E9%87%8A%E6%94%BE%EF%BC%8C%E4%BD%86%E5%BC%95%E7%94%A8%E6%8C%87%E5%90%91%E7%9A%84%E5%86%85%E5%AD%98%E5%B7%B2%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%81" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r </span><span style="color:#F97583">=</span><span style="color:#B392F0"> dangle</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> dangle</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8"> { </span><span style="color:#6A737D">// 试图返回字符串的引用</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#E1E4E8">s </span><span style="color:#6A737D">// 返回 s 的引用</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#6A737D">// s 在这里离开作用域被释放，但引用指向的内存已不存在！</span></span></code></pre></div>

编译器报错，提示返回值借用了一个在函数结束时就会被释放的值。

**解决方案**很简单：直接返回 `String` 本身，把所有权转移出去：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20no_dangle()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D%0A%0Afn%20no_dangle()%20-%3E%20String%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20s%20%2F%2F%20%E8%BF%94%E5%9B%9E%20s%EF%BC%8C%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%E8%B0%83%E7%94%A8%E8%80%85%EF%BC%8Cs%20%E6%9C%AC%E8%BA%AB%E4%B8%8D%E4%BC%9A%E8%A2%AB%E9%87%8A%E6%94%BE%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> no_dangle</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> no_dangle</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s </span><span style="color:#6A737D">// 返回 s，所有权转移给调用者，s 本身不会被释放</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 小结与回顾

我们已经学习了所有权、借用与可变性等核心概念。让我们通过类比和完整的例子来理解它们的区别和互动。

## 类比：你对一本书的权利

假设有一本书，我们可以用”书的权利”来比喻 Rust 中的核心概念：

| 权利类型 | 类比 | Rust 术语 | 代码 | 能做什么 |
| --- | --- | --- | --- | --- |
| **完全所有权** | 你买了这本书，可以做任何事 | 变量所有权 `let mut s` | 所有者 | 读、改、转移、销毁 |
| **所有权转移** | 你把这本书给了朋友，现在是他的了 | 赋值/函数参数 `let s2 = s1` | 新所有者 | 只有新所有者能读改，原主人无权访问 |
| **临时阅读权** | 朋友借你的书去看（不能改） | 不可变引用 `&s` | 借用者 | 只能读 |
| **临时编辑权** | 朋友借你的书做笔记（可以改） | 可变引用 `&mut s` | 借用者 | 可以读和改 |

**核心区别**：

- 所有权 ：谁负责这个东西，到底是谁的（永久）
- 所有权转移 ：从一个所有者转到另一个所有者，原主人永久失权
- 借用 ：这个东西暂时在谁手里用（临时）
- 可变性 ：拿着这个东西时，能不能修改它

## 权利的变更流程

### 场景一：所有权转移（永久）

当你把所有权交给别人，原主人就彻底失权了：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E5%88%9D%E5%A7%8B%EF%BC%9A%E6%88%91%E6%8B%A5%E6%9C%89%E8%BF%99%E6%9C%AC%E4%B9%A6%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20let%20book%20%3D%20String%3A%3Afrom(%22Rust%20Programming%22)%3B%0A%20%20%20%20println!(%22%E3%80%90%E5%88%9D%E5%A7%8B%E3%80%91%E6%88%91%E6%8B%A5%E6%9C%89%EF%BC%9A%7B%7D%22%2C%20book)%3B%0A%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E8%BD%AC%E7%A7%BB%EF%BC%9A%E6%88%91%E6%8A%8A%E4%B9%A6%E7%BB%99%E4%BA%86%E6%9C%8B%E5%8F%8B%EF%BC%88%E6%B0%B8%E4%B9%85%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%89%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20let%20friend_book%20%3D%20book%3B%20%20%2F%2F%20%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%20friend_book%0A%20%20%20%20println!(%22%E3%80%90%E8%BD%AC%E7%A7%BB%E3%80%91%E6%9C%8B%E5%8F%8B%E7%8E%B0%E5%9C%A8%E6%8B%A5%E6%9C%89%EF%BC%9A%7B%7D%22%2C%20friend_book)%3B%0A%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20book)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%E6%88%91%E5%B7%B2%E7%BB%8F%E6%B2%A1%E6%9C%89%E8%BF%99%E6%9C%AC%E4%B9%A6%E4%BA%86%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 初始：我拥有这本书</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> book </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust Programming"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【初始】我拥有：{}"</span><span style="color:#E1E4E8">, book);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 转移：我把书给了朋友（永久转移所有权）</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> friend_book </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> book;  </span><span style="color:#6A737D">// 所有权转移给 friend_book</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【转移】朋友现在拥有：{}"</span><span style="color:#E1E4E8">, friend_book);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", book);  // ✗ 错误！我已经没有这本书了</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键点**：所有权转移后，原变量彻底失效，永久无法使用。

### 场景二：借用（临时）

当你借给别人，保留所有权，朋友用完要还：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%EF%BC%9A%E7%8B%AC%E5%8D%A0%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%88%E6%88%91%E6%8B%A5%E6%9C%89%E4%B9%A6%EF%BC%89%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20let%20mut%20book%20%3D%20String%3A%3Afrom(%22Rust%20Programming%22)%3B%0A%20%20%20%20println!(%22%E3%80%90%E5%88%9D%E5%A7%8B%E3%80%91%E6%88%91%E6%8B%A5%E6%9C%89%EF%BC%9A%7B%7D%22%2C%20book)%3B%0A%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E4%BA%8C%E9%98%B6%E6%AE%B5%EF%BC%9A%E5%80%9F%E5%87%BA%E9%98%85%E8%AF%BB%E6%9D%83%EF%BC%88%E6%9C%8B%E5%8F%8B%E5%80%9F%E5%8E%BB%E7%9C%8B%EF%BC%89%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20let%20friend1%20%3D%20%26book%3B%20%20%20%20%20%20%20%20%2F%2F%20%E6%9C%8B%E5%8F%8B1%E5%80%9F%E5%8E%BB%E7%9C%8B%0A%20%20%20%20let%20friend2%20%3D%20%26book%3B%20%20%20%20%20%20%20%20%2F%2F%20%E6%9C%8B%E5%8F%8B2%E4%B9%9F%E5%80%9F%E5%8E%BB%E7%9C%8B%0A%20%20%20%20println!(%22%E3%80%90%E5%80%9F%E5%87%BA%E3%80%91%E6%9C%8B%E5%8F%8B1%E7%9C%8B%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20friend1)%3B%0A%20%20%20%20println!(%22%E3%80%90%E5%80%9F%E5%87%BA%E3%80%91%E6%9C%8B%E5%8F%8B2%E7%9C%8B%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20friend2)%3B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E6%9C%8B%E5%8F%8B1%E3%80%81%E6%9C%8B%E5%8F%8B2%E7%9A%84%E9%98%85%E8%AF%BB%E6%9D%83%E7%BB%93%E6%9D%9F%0A%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5%EF%BC%9A%E5%80%9F%E5%87%BA%E7%BC%96%E8%BE%91%E6%9D%83%EF%BC%88%E6%9C%8B%E5%8F%8B%E5%81%9A%E7%AC%94%E8%AE%B0%EF%BC%89%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20let%20editor%20%3D%20%26mut%20book%3B%20%20%20%20%20%2F%2F%20%E6%9C%8B%E5%8F%8B%E5%80%9F%E5%8E%BB%E5%81%9A%E7%AC%94%E8%AE%B0%EF%BC%88%E5%8F%AF%E4%BB%A5%E6%94%B9%EF%BC%89%0A%20%20%20%20editor.push_str(%22%20(with%20notes)%22)%3B%0A%20%20%20%20println!(%22%E3%80%90%E7%BC%96%E8%BE%91%E3%80%91%E6%9C%8B%E5%8F%8B%E5%81%9A%E4%BA%86%E7%AC%94%E8%AE%B0%EF%BC%9A%7B%7D%22%2C%20editor)%3B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E7%BC%96%E8%BE%91%E6%9D%83%E7%BB%93%E6%9D%9F%0A%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E5%9B%9B%E9%98%B6%E6%AE%B5%EF%BC%9A%E6%88%91%E6%81%A2%E5%A4%8D%E5%AE%8C%E5%85%A8%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20%2F%2F%20%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%E2%95%90%0A%20%20%20%20println!(%22%E3%80%90%E6%9C%80%E5%90%8E%E3%80%91%E6%88%91%E5%8F%96%E5%9B%9E%E4%B9%A6%EF%BC%9A%7B%7D%22%2C%20book)%3B%0A%20%20%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E7%BB%A7%E7%BB%AD%E4%BF%AE%E6%94%B9%0A%20%20%20%20book.push_str(%22%20(my%20notes)%22)%3B%0A%20%20%20%20println!(%22%E3%80%90%E6%9C%80%E5%90%8E%E3%80%91%E6%88%91%E4%B9%9F%E5%81%9A%E4%BA%86%E7%AC%94%E8%AE%B0%EF%BC%9A%7B%7D%22%2C%20book)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 第一阶段：独占所有权（我拥有书）</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> book </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust Programming"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【初始】我拥有：{}"</span><span style="color:#E1E4E8">, book);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 第二阶段：借出阅读权（朋友借去看）</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> friend1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">book;        </span><span style="color:#6A737D">// 朋友1借去看</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> friend2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">book;        </span><span style="color:#6A737D">// 朋友2也借去看</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【借出】朋友1看到：{}"</span><span style="color:#E1E4E8">, friend1);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【借出】朋友2看到：{}"</span><span style="color:#E1E4E8">, friend2);</span></span>
<span class="line"><span style="color:#6A737D">    // 这里朋友1、朋友2的阅读权结束</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 第三阶段：借出编辑权（朋友做笔记）</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> editor </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> book;     </span><span style="color:#6A737D">// 朋友借去做笔记（可以改）</span></span>
<span class="line"><span style="color:#E1E4E8">    editor</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">" (with notes)"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【编辑】朋友做了笔记：{}"</span><span style="color:#E1E4E8">, editor);</span></span>
<span class="line"><span style="color:#6A737D">    // 这里编辑权结束</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#6A737D">    // 第四阶段：我恢复完全所有权</span></span>
<span class="line"><span style="color:#6A737D">    // ════════════════════════════════════════</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【最后】我取回书：{}"</span><span style="color:#E1E4E8">, book);</span></span>
<span class="line"><span style="color:#6A737D">    // 可以继续修改</span></span>
<span class="line"><span style="color:#E1E4E8">    book</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">" (my notes)"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"【最后】我也做了笔记：{}"</span><span style="color:#E1E4E8">, book);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个例子展示了整个过程中权利的转变：

1. 独占所有权 → 可以读、改、删除
1. 借出多个阅读权 → 只能读，不能改
1. 借出编辑权 → 可以读和改，但原所有者暂时无权访问
1. 恢复独占所有权 → 朋友还书后，又能读改删除

## 规则速查表

快速理解所有权和借用的规则：

| 场景 | 允许吗 | 原因 |
| --- | --- | --- |
| 多个 `&T` 同时活跃 | ✅ | 多个读者互不影响 |
| 多个 `&mut T` 同时活跃 | ❌ | 无法确定谁的改动有效 |
| `&T` 和 `&mut T` 同时活跃 | ❌ | 读者看到修改中的数据 |
| 原变量读取，同时有 `&T` | ✅ | 多个读者看到相同数据 |
| 原变量修改，同时有 `&T` | ❌ | 读者看到修改后的不一致数据 |
| 原变量读取，同时有 `&mut T` | ❌ | 编辑权与读权冲突 |

## 核心要点回顾

**所有权三条规则**（来自第一篇）：

1. 每个值都有唯一所有者
1. 值转移时，原所有者失效
1. 所有者离开作用域时，值被释放

**借用两条规则**（本篇）：

1. 排他性：多读 OR 单写，不能混合
1. 有效性：引用不能指向已释放的数据

**可变性的独立性**：

- 所有权和可变性两个独立维度
- let mut s 不代表 &s 是可变的
- let s 不代表 &mut s 可行（因为原变量不可变）

理解这些概念，就掌握了 Rust 内存安全的核心秘诀。

# 练习题

## 引用基础测验

加载题目中…

```rust
fn main() {
    let s = String::from("hello");
    let r = &s;
    println!("{}", r);
    println!("{}", s);
}
```

加载题目中…

## 可变引用与修改

```rust
fn main() {
    let s = String::from("hello");
    append_world(&mut s);
    println!("{}", s);
}

fn append_world(s: &mut String) {
    s.push_str(", world");
}
```

加载题目中…

## 借用规则一：排他性

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;
    let r2 = &s;
    let r3 = &mut s;
    println!("{}, {}, {}", r1, r2, r3);
}
```

加载题目中…

加载题目中…

## 借用规则二：有效性

```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s
}
```

加载题目中…

## 综合应用

加载题目中…

## 编程练习

下面的函数想通过引用给字符串追加感叹号。请修复函数签名和 `main` 中的调用，使其能编译并正确输出：

```rust
fn append_exclamation(s: &String) {
    s.push_str("!");
}

fn main() {
    let s = String::from("hello");
    append_exclamation(&s);
    println!("{}", s);
}
```

**提示**：想想为什么无法通过不可变引用修改数据？

---

下面的函数试图返回一个局部变量的引用。请修改 `create_greeting` 的返回类型和返回值，使其能正确返回数据：

```rust
fn create_greeting() -> &String {
    let greeting = String::from("hello, world");
    &greeting
}

fn main() {
    let s = create_greeting();
    println!("{}", s);
}
```

**提示**：思考函数返回时会发生什么。如果返回引用，被引用的数据在函数结束时会被释放。如何才能让数据活下来？