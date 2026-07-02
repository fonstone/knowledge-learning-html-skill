# 类型别名基础

## 什么是类型别名

**类型别名** 让你为现有类型起一个新的、更简洁或更具语义化的名字，使用 `type` 关键字：

<div class="code-runner" data-full-code="%2F%2F%20%E4%B8%BA%20u64%20%E8%B5%B7%E5%88%AB%E5%90%8D%0Atype%20Milliseconds%20%3D%20u64%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20duration%3A%20Milliseconds%20%3D%201000%3B%0A%20%20%20%20println!(%22%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4%EF%BC%9A%7B%7D%20%E6%AF%AB%E7%A7%92%22%2C%20duration)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 为 u64 起别名</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Milliseconds</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> duration</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Milliseconds</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 1000</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"持续时间：{} 毫秒"</span><span style="color:#E1E4E8">, duration);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为什么使用类型别名

### 1. 提高代码可读性

对于复杂的泛型类型，别名能显著提高可读性：

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0A%2F%2F%20%E6%B2%A1%E6%9C%89%E5%88%AB%E5%90%8D%0A%2F%2F%20let%20cache%3A%20HashMap%3CString%2C%20Vec%3Ci32%3E%3E%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%2F%2F%20%E4%BD%BF%E7%94%A8%E5%88%AB%E5%90%8D%0Atype%20Cache%20%3D%20HashMap%3CString%2C%20Vec%3Ci32%3E%3E%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20cache%3A%20Cache%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20println!(%22cache%20%E5%B7%B2%E5%88%9D%E5%A7%8B%E5%8C%96%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 没有别名</span></span>
<span class="line"><span style="color:#6A737D">// let cache: HashMap&lt;String, Vec&lt;i32&gt;&gt; = HashMap::new();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 使用别名</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Cache</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> HashMap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> cache</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Cache</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"cache 已初始化"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 2. 减少重复代码

当你多次使用同一复杂类型时：

<div class="code-runner" data-full-code="use%20std%3A%3Aio%3B%0A%0A%2F%2F%20%E5%B8%B8%E8%A7%81%E5%81%9A%E6%B3%95%EF%BC%9AResult%3CT%2C%20std%3A%3Aio%3A%3AError%3E%20%E7%BC%A9%E5%86%99%E4%B8%BA%20IoResult%3CT%3E%0Atype%20IoResult%3CT%3E%20%3D%20Result%3CT%2C%20io%3A%3AError%3E%3B%0A%0Afn%20read_file()%20-%3E%20IoResult%3CString%3E%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E7%AE%80%E6%B4%81%E5%A4%9A%E4%BA%86%0A%20%20%20%20Ok(String%3A%3Afrom(%22content%22))%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20read_file()%20%7B%0A%20%20%20%20%20%20%20%20Ok(content)%20%3D%3E%20println!(%22%E8%AF%BB%E5%8F%96%E6%88%90%E5%8A%9F%EF%BC%9A%7B%7D%22%2C%20content)%2C%0A%20%20%20%20%20%20%20%20Err(_)%20%3D%3E%20println!(%22%E8%AF%BB%E5%8F%96%E5%A4%B1%E8%B4%A5%22)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">io;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 常见做法：Result&lt;T, std::io::Error&gt; 缩写为 IoResult&lt;T&gt;</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> IoResult</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">, io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> read_file</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> IoResult</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#6A737D">    // 返回类型简洁多了</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"content"</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> read_file</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(content) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"读取成功：{}"</span><span style="color:#E1E4E8">, content),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(_) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"读取失败"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 别名的作用域和命名规则

### 命名规范

类型别名应使用 **CamelCase**（驼峰命名法）：

<div class="code-runner" data-full-code="%2F%2F%20%E6%AD%A3%E7%A1%AE%0Atype%20UserId%20%3D%20u32%3B%0Atype%20CacheEntry%20%3D%20(String%2C%20Vec%3Ci32%3E)%3B%0A%0A%2F%2F%20%E4%B8%8D%E8%A7%84%E8%8C%83%EF%BC%88%E4%BC%9A%E4%BA%A7%E7%94%9F%E7%BC%96%E8%AF%91%E8%AD%A6%E5%91%8A%EF%BC%89%0A%2F%2F%20type%20user_id%20%3D%20u32%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20id%3A%20UserId%20%3D%2042%3B%0A%20%20%20%20println!(%22%E7%94%A8%E6%88%B7%20ID%3A%20%7B%7D%22%2C%20id)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 正确</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> UserId</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> CacheEntry</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 不规范（会产生编译警告）</span></span>
<span class="line"><span style="color:#6A737D">// type user_id = u32;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> id</span><span style="color:#F97583">:</span><span style="color:#B392F0"> UserId</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户 ID: {}"</span><span style="color:#E1E4E8">, id);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 别名的作用域

别名在定义作用域内有效，可以在模块中定义：

<div class="code-runner" data-full-code="mod%20network%20%7B%0A%20%20%20%20pub%20type%20Response%20%3D%20Result%3CString%2C%20String%3E%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20resp%3A%20network%3A%3AResponse%20%3D%20Ok(String%3A%3Afrom(%22OK%22))%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20resp)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> network</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> type</span><span style="color:#B392F0"> Response</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt;;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> resp</span><span style="color:#F97583">:</span><span style="color:#B392F0"> network</span><span style="color:#F97583">::</span><span style="color:#B392F0">Response</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Ok</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"OK"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, resp);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 别名 vs 新类型（重要区别）

**关键点**：类型别名**不创建新类型**，它只是给现有类型换个名字。**因此不提供类型安全**

<div class="code-runner" data-full-code="type%20UserId%20%3D%20u32%3B%0Atype%20ProductId%20%3D%20u32%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20user_id%3A%20UserId%20%3D%201%3B%0A%20%20%20%20let%20product_id%3A%20ProductId%20%3D%202%3B%0A%0A%20%20%20%20%2F%2F%20%E8%BF%99%E6%98%AF%E5%85%81%E8%AE%B8%E7%9A%84%EF%BC%81%E5%9B%A0%E4%B8%BA%E5%88%AB%E5%90%8D%E4%B8%8D%E6%8F%90%E4%BE%9B%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%0A%20%20%20%20let%20sum%20%3D%20user_id%20%2B%20product_id%3B%0A%20%20%20%20println!(%22%E7%94%A8%E6%88%B7%20ID%20%7B%7D%20%2B%20%E4%BA%A7%E5%93%81%20ID%20%7B%7D%20%3D%20%7B%7D%22%2C%20user_id%2C%20product_id%2C%20sum)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> UserId</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> ProductId</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> user_id</span><span style="color:#F97583">:</span><span style="color:#B392F0"> UserId</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> product_id</span><span style="color:#F97583">:</span><span style="color:#B392F0"> ProductId</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 这是允许的！因为别名不提供类型安全</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> user_id </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> product_id;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户 ID {} + 产品 ID {} = {}"</span><span style="color:#E1E4E8">, user_id, product_id, sum);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **警告**：如果你需要真正的类型安全（使 `UserId` 和 `ProductId` 不兼容），应该使用 **newtype 模式**（结构体包装），而不是别名。

## 实战例子

### 例子 1：简化 Result 类型

<div class="code-runner" data-full-code="use%20std%3A%3Anum%3A%3AParseIntError%3B%0A%0A%2F%2F%20%E5%AE%9A%E4%B9%89%E8%87%AA%E5%AE%9A%E4%B9%89%20Result%20%E5%88%AB%E5%90%8D%0Atype%20ParseResult%3CT%3E%20%3D%20Result%3CT%2C%20ParseIntError%3E%3B%0A%0Afn%20parse_number(s%3A%20%26str)%20-%3E%20ParseResult%3Ci32%3E%20%7B%0A%20%20%20%20s.parse()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20parse_number(%2242%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(num)%20%3D%3E%20println!(%22%E8%A7%A3%E6%9E%90%E6%88%90%E5%8A%9F%EF%BC%9A%7B%7D%22%2C%20num)%2C%0A%20%20%20%20%20%20%20%20Err(_)%20%3D%3E%20println!(%22%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%22)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 定义自定义 Result 别名</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> ParseResult</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> parse_number</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> ParseResult</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    s</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> parse_number</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"42"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(num) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"解析成功：{}"</span><span style="color:#E1E4E8">, num),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(_) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"解析失败"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 例子 2：复杂嵌套类型的别名

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0A%2F%2F%20%E5%A4%8D%E6%9D%82%E7%B1%BB%E5%9E%8B%E5%88%AB%E5%90%8D%0Atype%20UserDatabase%20%3D%20HashMap%3CString%2C%20Vec%3C(String%2C%20u32)%3E%3E%3B%0A%2F%2F%20%E7%AD%89%E4%BB%B7%E4%BA%8E%EF%BC%9AHashMap%3C%E7%94%A8%E6%88%B7%E5%90%8D%2C%20%E8%AE%B0%E5%BD%95%E5%88%97%E8%A1%A8(%E5%A7%93%E5%90%8D%2C%20%E5%B9%B4%E9%BE%84)%3E%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20db%3A%20UserDatabase%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E6%B7%BB%E5%8A%A0%E6%95%B0%E6%8D%AE%0A%20%20%20%20db.insert(%0A%20%20%20%20%20%20%20%20%22user1%22.to_string()%2C%0A%20%20%20%20%20%20%20%20vec!%5B(%22Alice%22.to_string()%2C%2030)%5D%0A%20%20%20%20)%3B%0A%0A%20%20%20%20println!(%22%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%9A%7B%3A%3F%7D%22%2C%20db)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 复杂类型别名</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> UserDatabase</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> HashMap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;(</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">)&gt;&gt;;</span></span>
<span class="line"><span style="color:#6A737D">// 等价于：HashMap&lt;用户名, 记录列表(姓名, 年龄)&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> db</span><span style="color:#F97583">:</span><span style="color:#B392F0"> UserDatabase</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 添加数据</span></span>
<span class="line"><span style="color:#E1E4E8">    db</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#9ECBFF">        "user1"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#B392F0">        vec!</span><span style="color:#E1E4E8">[(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(), </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#E1E4E8">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"数据库：{:?}"</span><span style="color:#E1E4E8">, db);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 例子 3：泛型类型别名

别名也可以是泛型：

<div class="code-runner" data-full-code="%2F%2F%20%E5%AE%9A%E4%B9%89%E4%B8%80%E4%B8%AA%E6%B3%9B%E5%9E%8B%E5%88%AB%E5%90%8D%0Atype%20Pair%3CT%3E%20%3D%20(T%2C%20T)%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20int_pair%3A%20Pair%3Ci32%3E%20%3D%20(1%2C%202)%3B%0A%20%20%20%20let%20str_pair%3A%20Pair%3C%26str%3E%20%3D%20(%22hello%22%2C%20%22world%22)%3B%0A%0A%20%20%20%20println!(%22int_pair%3A%20%7B%3A%3F%7D%22%2C%20int_pair)%3B%0A%20%20%20%20println!(%22str_pair%3A%20%7B%3A%3F%7D%22%2C%20str_pair)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 定义一个泛型别名</span></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> int_pair</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> str_pair</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"int_pair: {:?}"</span><span style="color:#E1E4E8">, int_pair);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"str_pair: {:?}"</span><span style="color:#E1E4E8">, str_pair);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 何时使用类型别名

✅ **适合使用别名：**

- 复杂的泛型类型重复出现多次
- 为了增强代码的自文档化（别名名字说明用途）
- 统一管理某个复杂类型的定义

❌ **不应该用别名：**

- 希望提供类型安全隔离（用 newtype 代替）
- 只使用一次（没有重复）
- 别名不能添加方法（如需要，用结构体）

# 练习题

## 类型别名测验

```rust
type UserId = u32;
type ProductId = u32;

fn main() {
    let id1: UserId = 1;
    let id2: ProductId = 2;
    let sum = id1 + id2;
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

### 练习 1：为复杂类型定义别名

使用别名简化以下代码：

```rust
use std::collections::HashMap;

fn main() {
    // TODO: 定义类型别名 ServerResponse，表示 Result<String, String>


    // TODO: 定义类型别名 UserCache，表示 HashMap<String, i32>


    // 使用别名声明变量
    let response: ServerResponse = Ok("success".to_string());
    let cache: UserCache = HashMap::new();

    println!("response: {:?}", response);
    println!("cache: {:?}", cache);
}
```