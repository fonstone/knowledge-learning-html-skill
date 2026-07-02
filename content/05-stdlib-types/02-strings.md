# 字符串基础

## 为什么 Rust 有两种字符串类型

这是初学者最常困惑的地方。**Rust 不是有一种字符串类型，而是有两种：`String` 和 `&str`**。

想象一下快递：

- `String` 像是你 拥有的包裹 ——你可以打开它、修改里面的东西、把它转送给别人
- `&str` 像是你在某个时刻 看到的包裹标签内容 ——你只能读，不能修改，但标签本身可能属于别人

这种设计的核心理由是 **所有权**。Rust 使用所有权系统来管理内存安全。`String` 拥有堆上的数据，而 `&str` 只是借用（引用）了某个地方的字符串数据。

## String 和 &str 的基本区别

| 特性 | `String` | `&str` |
| --- | --- | --- |
| 存储位置 | 堆（heap） | 栈（stack）或数据段 |
| 大小 | 动态，运行时确定 | 固定，编译时确定 |
| 可修改性 | 可以修改（如果是 `mut`） | 不可修改 |
| 所有权 | 拥有完整数据所有权 | 仅是借用 |
| 类型 | `String` | `&str`（引用类型） |

让我们看一个简单对比：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20String%EF%BC%9A%E6%88%91%E4%BB%AC%E6%8B%A5%E6%9C%89%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%0A%20%20%20%20let%20mut%20s1%20%3D%20String%3A%3Afrom(%22Hello%22)%3B%0A%20%20%20%20s1.push_str(%22%2C%20World!%22)%3B%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%0A%20%20%20%20println!(%22String%3A%20%7B%7D%22%2C%20s1)%3B%0A%0A%20%20%20%20%2F%2F%20%26str%EF%BC%9A%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%88%87%E7%89%87%EF%BC%8C%E5%80%9F%E7%94%A8%E7%9A%84%E6%95%B0%E6%8D%AE%0A%20%20%20%20let%20s2%3A%20%26str%20%3D%20%22Hello%22%3B%0A%20%20%20%20%2F%2F%20s2.push_str(%22%2C%20World!%22)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%26str%20%E4%B8%8D%E5%8F%AF%E4%BF%AE%E6%94%B9%0A%20%20%20%20println!(%22%26str%3A%20%7B%7D%22%2C%20s2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // String：我们拥有的字符串</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s1</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", World!"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 可以修改</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"String: {}"</span><span style="color:#E1E4E8">, s1);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // &amp;str：字符串切片，借用的数据</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "Hello"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // s2.push_str(", World!");  // ✗ 错误！&amp;str 不可修改</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"&amp;str: {}"</span><span style="color:#E1E4E8">, s2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这两种类型都是**有效的**，选择哪一种取决于你的**使用场景**。

## 字符串字面量就是 &str

你一直在用的字符串字面量（双引号里的文本）其实就是 `&str` 类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%AA%E5%AD%97%E9%9D%A2%E9%87%8F%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20%26str%EF%BC%8C%E4%B8%8D%E6%98%AF%20String%EF%BC%81%0A%20%20%20%20let%20s%3A%20%26str%20%3D%20%22%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%22%3B%0A%20%20%20%20println!(%22%E5%AD%97%E9%9D%A2%E9%87%8F%E7%B1%BB%E5%9E%8B%EF%BC%9A%26str%22)%3B%0A%20%20%20%20println!(%22%E5%86%85%E5%AE%B9%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 这个字面量的类型是 &amp;str，不是 String！</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "这是一个字符串字面量"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字面量类型：&amp;str"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"内容：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为什么字面量是 `&str` 而不是 `String`？因为字面量在**编译时就已确定**，被硬编码到二进制文件中，所以没必要在运行时分配堆内存。`&str` 的大小在编译时就知道，效率最高。

# 创建与初始化

## 创建空 String

最基础的方式是 `String::new()`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Anew()%3B%0A%20%20%20%20println!(%22%E7%A9%BA%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20s.len())%3B%0A%20%20%20%20println!(%22%E7%A9%BA%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AE%B9%E9%87%8F%EF%BC%9A%7B%7D%22%2C%20s.capacity())%3B%0A%0A%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%E5%8F%AF%E4%BB%A5%E5%90%91%E9%87%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%95%B0%E6%8D%AE%0A%20%20%20%20s.push_str(%22Hello%22)%3B%0A%20%20%20%20println!(%22%E6%B7%BB%E5%8A%A0%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"空字符串长度：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"空字符串容量：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">capacity</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 现在可以向里面添加数据</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"添加后：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 从字面量创建 String

方式 1：`String::from()`

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22Hello%2C%20World!%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s1)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, World!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s1);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

方式 2：`.to_string()` 方法（任何实现了 `ToString` trait 的类型都有这个方法）

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s2%20%3D%20%22Hello%2C%20World!%22.to_string()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello, World!"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

两种写法的结果完全相同：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22Hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20%22Hello%22.to_string()%3B%0A%0A%20%20%20%20println!(%22s1%3A%20%7B%7D%22%2C%20s1)%3B%0A%20%20%20%20println!(%22s2%3A%20%7B%7D%22%2C%20s2)%3B%0A%20%20%20%20println!(%22s1%20%3D%3D%20s2%3A%20%7B%7D%22%2C%20s1%20%3D%3D%20s2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"s1: {}"</span><span style="color:#E1E4E8">, s1);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"s2: {}"</span><span style="color:#E1E4E8">, s2);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"s1 == s2: {}"</span><span style="color:#E1E4E8">, s1 </span><span style="color:#F97583">==</span><span style="color:#E1E4E8"> s2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **选择建议**：两种方式都可以，但 `String::from()` 更明确地表示”从这个数据创建一个 String”，而 `.to_string()` 更灵活（可用于其他类型的转换）。

## 预分配容量

如果你知道字符串最终会有大概多少字符，可以用 `with_capacity()` 预分配空间，减少内存重分配次数：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%A2%84%E5%88%86%E9%85%8D%2010%20%E5%AD%97%E8%8A%82%E5%AE%B9%E9%87%8F%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Awith_capacity(10)%3B%0A%20%20%20%20println!(%22%E5%88%9D%E5%A7%8B%E5%AE%B9%E9%87%8F%EF%BC%9A%7B%7D%22%2C%20s.capacity())%3B%0A%0A%20%20%20%20%2F%2F%20%E6%B7%BB%E5%8A%A0%E6%95%B0%E6%8D%AE%0A%20%20%20%20s.push_str(%22Hello%22)%3B%0A%20%20%20%20println!(%22%E6%B7%BB%E5%8A%A0%E5%90%8E%E5%AE%B9%E9%87%8F%EF%BC%9A%7B%7D%22%2C%20s.capacity())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 预分配 10 字节容量</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">with_capacity</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"初始容量：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">capacity</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 添加数据</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"添加后容量：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">capacity</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 修改字符串

`String` 的一大优势是**可修改**。这里列出最常用的修改操作。

## 单个字符：`push()`

向字符串末尾添加一个 char：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20s.push('!')%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E6%98%AF%E4%B8%AD%E6%96%87%E5%AD%97%E7%AC%A6%0A%20%20%20%20s.push('%E2%9C%A8')%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'!'</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 也可以是中文字符</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'✨'</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 字符串片段：`push_str()`

向末尾追加一个字符串切片（`&str`）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22Hello%22)%3B%0A%20%20%20%20s.push_str(%22%2C%20%22)%3B%0A%20%20%20%20s.push_str(%22World!%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", "</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">push_str</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"World!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 注意：`push_str()` 接受 `&str`，不获得所有权，所以原字符串仍可用。

## 移除末尾字符：`pop()`

移除并返回最后一个字符（如果有的话）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20match%20s.pop()%20%7B%0A%20%20%20%20%20%20%20%20Some(ch)%20%3D%3E%20println!(%22%E7%A7%BB%E9%99%A4%E7%9A%84%E5%AD%97%E7%AC%A6%EF%BC%9A%7B%7D%22%2C%20ch)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%BA%E7%A9%BA%22)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E7%A7%BB%E9%99%A4%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">pop</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(ch) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"移除的字符：{}"</span><span style="color:#E1E4E8">, ch),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字符串为空"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"移除后：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 删除指定位置：`remove()`

删除并返回指定**字节位置**的字符。这个方法有些复杂，因为涉及 UTF-8 编码：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%88%A0%E9%99%A4%E4%BD%8D%E7%BD%AE%200%20%E7%9A%84%E5%AD%97%E7%AC%A6%EF%BC%88'h'%EF%BC%89%0A%20%20%20%20let%20removed%20%3D%20s.remove(0)%3B%0A%20%20%20%20println!(%22%E5%88%A0%E9%99%A4%E7%9A%84%E5%AD%97%E7%AC%A6%EF%BC%9A%7B%7D%22%2C%20removed)%3B%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 删除位置 0 的字符（'h'）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> removed </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">remove</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"删除的字符：{}"</span><span style="color:#E1E4E8">, removed);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **警告**：`remove()` 按**字节位置**工作，不是字符位置。对于多字节字符（如中文），必须传正确的字节位置，否则会 panic。详见后文”字符编码复杂性”。

## 清空字符串：`clear()`

删除所有内容：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22Hello%2C%20World!%22)%3B%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%89%8D%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20s.len())%3B%0A%0A%20%20%20%20s.clear()%3B%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%90%8E%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20s.len())%3B%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%90%8E%EF%BC%9A'%7B%7D'%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, World!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空前长度：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">clear</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空后长度：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空后：'{}'"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 替换：`replace()` 和 `replace_range()`

`replace()` 返回一个**新的** String（原字符串不变）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22hello%20world%22%3B%0A%20%20%20%20let%20s2%20%3D%20s.replace(%22world%22%2C%20%22Rust%22)%3B%0A%20%20%20%20println!(%22%E5%8E%9F%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%20%20%20%20println!(%22%E6%96%B0%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%9A%7B%7D%22%2C%20s2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello world"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">replace</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Rust"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"原字符串：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"新字符串：{}"</span><span style="color:#E1E4E8">, s2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

如果要修改原字符串的某个范围，用 `replace_range()`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%20world%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%B0%86%E4%BD%8D%E7%BD%AE%200..5%20%E7%9A%84%E5%AD%97%E7%AC%A6%E6%9B%BF%E6%8D%A2%E4%B8%BA%20%22Hi%22%0A%20%20%20%20s.replace_range(0..5%2C%20%22Hi%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 将位置 0..5 的字符替换为 "Hi"</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">replace_range</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Hi"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 截断：`truncate()`

保留前 n 个**字节**，删除剩余部分：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22Hello%2C%20World!%22)%3B%0A%0A%20%20%20%20s.truncate(5)%3B%20%20%2F%2F%20%E5%8F%AA%E4%BF%9D%E7%95%99%E5%89%8D%205%20%E4%B8%AA%E5%AD%97%E8%8A%82%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, World!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">truncate</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 只保留前 5 个字节</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 同样，`truncate()` 按字节位置工作，不能用在多字节字符的中间。

# 操作与查询

## 为什么不能用 [] 直接索引字符串

这是一个常见的困惑。你可以对数组和向量用 `v[0]` 获取元素，但**不能对 String 这样做**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s%5B0%5D)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]);  </span><span style="color:#6A737D">// ✗ 错误！</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为什么？**UTF-8 编码的复杂性**。中文字符、表情符号等多字节字符占多个字节，一个”字符”可能是 1、2、3 或 4 个字节。`s[0]` 只能返回一个字节，而不是一个”字符”。Rust 的设计是**宁可不提供这个操作，也不要让你无意中出错**。

## 字符串切片：使用范围

如果你知道**字节范围**，可以创建字符串切片（`&str`）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20slice1%3A%20%26str%20%3D%20%26s%5B0..2%5D%3B%20%20%20%2F%2F%20%E5%89%8D%202%20%E4%B8%AA%E5%AD%97%E8%8A%82%0A%20%20%20%20let%20slice2%3A%20%26str%20%3D%20%26s%5B1..4%5D%3B%20%20%20%2F%2F%20%E5%AD%97%E8%8A%82%201-4%0A%0A%20%20%20%20println!(%22slice1%3A%20%7B%7D%22%2C%20slice1)%3B%0A%20%20%20%20println!(%22slice2%3A%20%7B%7D%22%2C%20slice2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> slice1</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s[</span><span style="color:#79B8FF">0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">];   </span><span style="color:#6A737D">// 前 2 个字节</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> slice2</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s[</span><span style="color:#79B8FF">1</span><span style="color:#F97583">..</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">];   </span><span style="color:#6A737D">// 字节 1-4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"slice1: {}"</span><span style="color:#E1E4E8">, slice1);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"slice2: {}"</span><span style="color:#E1E4E8">, slice2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但是**必须确保切片边界在字符边界上**，否则会 panic：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22Hello%20%F0%9F%A6%80%22%3B%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E7%9A%84%20%F0%9F%A6%80%20%E6%98%AF%204%20%E4%B8%AA%E5%AD%97%E8%8A%82%0A%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%BC%9A%20panic%EF%BC%81%E5%9B%A0%E4%B8%BA%E5%9C%A8%E5%AD%97%E7%AC%A6%E4%B8%AD%E9%97%B4%E5%88%87%E5%89%B2%0A%20%20%20%20let%20slice%20%3D%20%26s%5B0..7%5D%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello 🦀"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 这里的 🦀 是 4 个字节</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 这会 panic！因为在字符中间切割</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> slice </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s[</span><span style="color:#79B8FF">0</span><span style="color:#F97583">..</span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 字节 vs 字符 vs 字形簇

这是 UTF-8 字符串最容易混淆的地方。让我们澄清三个概念：

**字节（Byte）** — 最小单位，1 个字节 = 8 比特：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22hello%22%3B%0A%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20s.len())%3B%20%20%2F%2F%205%0A%0A%20%20%20%20let%20s2%20%3D%20%22Hello%20%E4%B8%96%22%3B%0A%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20s2.len())%3B%20%20%2F%2F%209%EF%BC%88%E4%B8%8D%E6%98%AF%207%EF%BC%81%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节数：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());  </span><span style="color:#6A737D">// 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello 世"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节数：{}"</span><span style="color:#E1E4E8">, s2</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());  </span><span style="color:#6A737D">// 9（不是 7！）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**字符（Char）** — Unicode 字符，`char` 类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22Hello%20%E4%B8%96%E7%95%8C%22%3B%0A%20%20%20%20println!(%22%E5%AD%97%E7%AC%A6%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20s.chars().count())%3B%20%20%2F%2F%208%0A%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20s.len())%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%2012%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello 世界"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字符数：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">chars</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">count</span><span style="color:#E1E4E8">());  </span><span style="color:#6A737D">// 8</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节数：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());             </span><span style="color:#6A737D">// 12</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**字形簇（Grapheme Cluster）** — 用户看到的”一个字符”，可能由多个 Unicode 字符组合而成（最常见的是变音符号）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%AA%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%E4%B8%80%E4%B8%AA%22e%22%EF%BC%8C%E4%BD%86%E7%94%B1%E4%B8%A4%E4%B8%AA%20Unicode%20%E5%AD%97%E7%AC%A6%E7%BB%84%E6%88%90%0A%20%20%20%20let%20e_with_acute%20%3D%20%22%C3%A9%22%3B%20%20%2F%2F%20U%2B00E9%EF%BC%88%E5%8D%95%E4%B8%AA%E5%AD%97%E7%AC%A6%EF%BC%89%0A%20%20%20%20let%20e_combining%20%3D%20%22e%5Cu%7B0301%7D%22%3B%20%20%2F%2F%20e%EF%BC%88U%2B0065%EF%BC%89%2B%20%E9%94%90%E9%87%8D%E9%9F%B3%EF%BC%88U%2B0301%EF%BC%89%0A%0A%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%E6%95%B0%EF%BC%88%C3%A9%EF%BC%89%EF%BC%9A%7B%7D%22%2C%20e_with_acute.len())%3B%0A%20%20%20%20println!(%22%E5%AD%97%E7%AC%A6%E6%95%B0%EF%BC%88%C3%A9%EF%BC%89%EF%BC%9A%7B%7D%22%2C%20e_with_acute.chars().count())%3B%0A%0A%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%E6%95%B0%EF%BC%88e%CC%8D%EF%BC%89%EF%BC%9A%7B%7D%22%2C%20e_combining.len())%3B%0A%20%20%20%20println!(%22%E5%AD%97%E7%AC%A6%E6%95%B0%EF%BC%88e%CC%8D%EF%BC%89%EF%BC%9A%7B%7D%22%2C%20e_combining.chars().count())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 这个看起来像一个"e"，但由两个 Unicode 字符组成</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> e_with_acute </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "é"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// U+00E9（单个字符）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> e_combining </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "e</span><span style="color:#79B8FF">\u{0301}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// e（U+0065）+ 锐重音（U+0301）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节数（é）：{}"</span><span style="color:#E1E4E8">, e_with_acute</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字符数（é）：{}"</span><span style="color:#E1E4E8">, e_with_acute</span><span style="color:#F97583">.</span><span style="color:#B392F0">chars</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">count</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节数（e̍）：{}"</span><span style="color:#E1E4E8">, e_combining</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字符数（e̍）：{}"</span><span style="color:#E1E4E8">, e_combining</span><span style="color:#F97583">.</span><span style="color:#B392F0">chars</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">count</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**结论**：永远不要假设”一个字符 = 一个字节”。需要的时候：

- 按字节处理用 .len() 和 &s[..]
- 按字符处理用 .chars()
- 按字形簇处理需要第三方库

## 字符迭代

遍历字符串中的每个 **Unicode 字符**（而不是字节）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22Hello%20%F0%9F%A6%80%22%3B%0A%0A%20%20%20%20for%20ch%20in%20s.chars()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%AD%97%E7%AC%A6%EF%BC%9A%7B%7D%22%2C%20ch)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello 🦀"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> ch </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">chars</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字符：{}"</span><span style="color:#E1E4E8">, ch);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

迭代**字节**（如果你真的需要）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22hello%22%3B%0A%0A%20%20%20%20for%20byte%20in%20s.bytes()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%AD%97%E8%8A%82%EF%BC%9A%7B%7D%22%2C%20byte)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> byte </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">bytes</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"字节：{}"</span><span style="color:#E1E4E8">, byte);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 常用字符串方法

**查看是否包含子字符串**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22Hello%2C%20Rust!%22%3B%0A%0A%20%20%20%20println!(%22%E5%8C%85%E5%90%AB%20'Rust'%EF%BC%9F%7B%7D%22%2C%20s.contains(%22Rust%22))%3B%0A%20%20%20%20println!(%22%E5%8C%85%E5%90%AB%20'Python'%EF%BC%9F%7B%7D%22%2C%20s.contains(%22Python%22))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello, Rust!"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"包含 'Rust'？{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"包含 'Python'？{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Python"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**查看开头或结尾**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22hello.txt%22%3B%0A%0A%20%20%20%20println!(%22%E4%BB%A5%20'hello'%20%E5%BC%80%E5%A4%B4%EF%BC%9F%7B%7D%22%2C%20s.starts_with(%22hello%22))%3B%0A%20%20%20%20println!(%22%E4%BB%A5%20'.txt'%20%E7%BB%93%E5%B0%BE%EF%BC%9F%7B%7D%22%2C%20s.ends_with(%22.txt%22))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello.txt"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"以 'hello' 开头？{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">starts_with</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"以 '.txt' 结尾？{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">ends_with</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">".txt"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**分割字符串**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22one%2Ctwo%2Cthree%22%3B%0A%0A%20%20%20%20for%20part%20in%20s.split('%2C')%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E9%83%A8%E5%88%86%EF%BC%9A%7B%7D%22%2C%20part)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "one,two,three"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> part </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">split</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">','</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"部分：{}"</span><span style="color:#E1E4E8">, part);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**移除首尾空白**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22%20%20Hello%2C%20Rust!%20%20%22%3B%0A%0A%20%20%20%20println!(%22%E5%8E%9F%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%9A'%7B%7D'%22%2C%20s)%3B%0A%20%20%20%20println!(%22trim()%EF%BC%9A'%7B%7D'%22%2C%20s.trim())%3B%0A%20%20%20%20println!(%22trim_start()%EF%BC%9A'%7B%7D'%22%2C%20s.trim_start())%3B%0A%20%20%20%20println!(%22trim_end()%EF%BC%9A'%7B%7D'%22%2C%20s.trim_end())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "  Hello, Rust!  "</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"原字符串：'{}'"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"trim()：'{}'"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"trim_start()：'{}'"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim_start</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"trim_end()：'{}'"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim_end</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**转换大小写**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20%22Hello%2C%20Rust!%22%3B%0A%0A%20%20%20%20println!(%22%E5%A4%A7%E5%86%99%EF%BC%9A%7B%7D%22%2C%20s.to_uppercase())%3B%0A%20%20%20%20println!(%22%E5%B0%8F%E5%86%99%EF%BC%9A%7B%7D%22%2C%20s.to_lowercase())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Hello, Rust!"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"大写：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_uppercase</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"小写：{}"</span><span style="color:#E1E4E8">, s</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_lowercase</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## String 作为函数参数

这是初学者经常遇到的问题：**应该传 `String` 还是 `&str`？**

一般规则是：**优先传 `&str`**。原因是 `&str` 更灵活——无论你有 `String` 还是字面量，都可以转换成 `&str`：

<div class="code-runner" data-full-code="fn%20print_string(s%3A%20%26str)%20%7B%0A%20%20%20%20println!(%22%E6%8E%A5%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%BC%A0%E5%85%A5%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%88%E5%B7%B2%E7%BB%8F%E6%98%AF%20%26str%EF%BC%89%0A%20%20%20%20print_string(%22Hello%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BC%A0%E5%85%A5%20String%EF%BC%88%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%A7%A3%E5%BC%95%E7%94%A8%E8%BD%AC%E6%8D%A2%E6%88%90%20%26str%EF%BC%89%0A%20%20%20%20let%20owned%20%3D%20String%3A%3Afrom(%22World%22)%3B%0A%20%20%20%20print_string(%26owned)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_string</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"接收到：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 传入字面量（已经是 &amp;str）</span></span>
<span class="line"><span style="color:#B392F0">    print_string</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 传入 String（会自动解引用转换成 &amp;str）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> owned </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"World"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    print_string</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">owned);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

如果你传 `String`，那就只能接收 `String`，不能接收字面量（需要显式转换）：

<div class="code-runner" data-full-code="fn%20print_string_owned(s%3A%20String)%20%7B%0A%20%20%20%20println!(%22%E6%8E%A5%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20s)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20owned%20%3D%20String%3A%3Afrom(%22Hello%22)%3B%0A%20%20%20%20print_string_owned(owned)%3B%0A%0A%20%20%20%20%2F%2F%20print_string_owned(%22World%22)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%E9%9C%80%E8%A6%81%E6%98%BE%E5%BC%8F%E8%BD%AC%E6%8D%A2%0A%20%20%20%20print_string_owned(%22World%22.to_string())%3B%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%EF%BC%8C%E4%BD%86%E5%BE%88%E5%95%B0%E5%97%A6%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_string_owned</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"接收到：{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> owned </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    print_string_owned</span><span style="color:#E1E4E8">(owned);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // print_string_owned("World");  // ✗ 错误！需要显式转换</span></span>
<span class="line"><span style="color:#B392F0">    print_string_owned</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"World"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">());  </span><span style="color:#6A737D">// 可以，但很啰嗦</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **最佳实践**：除非函数需要**修改**字符串或需要**获得所有权**，否则总是接收 `&str`。

## 字符串解析

将字符串转换成其他类型，使用 `parse()` 方法：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20%2242%22%3B%0A%20%20%20%20let%20num%3A%20i32%20%3D%20s1.parse().expect(%22%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%E4%B8%BA%E6%95%B4%E6%95%B0%22)%3B%0A%20%20%20%20println!(%22%E8%A7%A3%E6%9E%90%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20num)%3B%0A%0A%20%20%20%20let%20s2%20%3D%20%223.14%22%3B%0A%20%20%20%20let%20float%3A%20f64%20%3D%20s2.parse().expect(%22%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%E4%B8%BA%E6%B5%AE%E7%82%B9%E6%95%B0%22)%3B%0A%20%20%20%20println!(%22%E8%A7%A3%E6%9E%90%E5%90%8E%EF%BC%9A%7B%7D%22%2C%20float)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "42"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> s1</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无法解析为整数"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"解析后：{}"</span><span style="color:#E1E4E8">, num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "3.14"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> float</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> s2</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无法解析为浮点数"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"解析后：{}"</span><span style="color:#E1E4E8">, float);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## String 和 &str 基础测验

```rust
fn main() {
    let s1 = "Hello";
    let s2 = String::from("Hello");
}
```

加载题目中…

加载题目中…

## 字符串创建与修改

```rust
let mut s = String::from("Hello");
s.push('!');
s.push_str(" World");
```

加载题目中…

加载题目中…

## 字符编码和索引

```rust
let s = "Hello 中文";
let byte_count = s.len();
let char_count = s.chars().count();
```

加载题目中…

加载题目中…

## 函数参数和常用操作

```rust
fn describe(s: &str) {
    println!("字符串：{}", s);
}

fn main() {
    describe("Hello");
    describe(&String::from("World"));
}
```

加载题目中…

## 编程练习

### 练习 1：字符串切片和迭代

完成下面程序，要求对字符串进行分析：

```rust
fn main() {
    let text = "Hello, Rust!";

    // TODO 1: 获取前 5 个字节的切片
    let first_five =
    println!("前5个字节: {}", first_five);

    // TODO 2: 遍历并计算所有字符，使用 for 实现
    let mut char_count = 0;
    for  {
        // TODO: 计数
    }
    println!("字符总数: {}", char_count);

    // TODO 3: 检查字符串是否以 "Hello" 开头
    if  {
        println!("以 'Hello' 开头: true");
    }

    // TODO 4: 检查字符串是否以 "!" 结尾
    if  {
        println!("以 '!' 结尾: true");
    }
}
```

### 练习 2：文本处理函数

编写一个函数 `process_text()`，接收一个 `&str`，返回处理后的 `String`。要求：

1. 移除首尾空白
1. 将所有内容转为小写
1. 如果内容为空则返回 “(empty)”

```rust
fn process_text(text: &str) -> String {
    // TODO: 实现函数体

}

fn main() {
    let test1 = "  HELLO WORLD  ";
    let result1 = process_text(test1);
    println!("输入: '{}' -> 输出: '{}'", test1, result1);

    let test2 = "    ";
    let result2 = process_text(test2);
    println!("输入: '{}' -> 输出: '{}'", test2, result2);

    let test3 = "RustLang";
    let result3 = process_text(test3);
    println!("输入: '{}' -> 输出: '{}'", test3, result3);
}
```