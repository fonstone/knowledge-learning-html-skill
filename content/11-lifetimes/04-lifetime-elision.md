# 省略规则

## 为什么大多数时候不需要标注

学完前两篇你可能有个疑问：既然每个引用都有生命周期，为什么很多函数没有写 `'a` 也能编译？比如：

<div class="code-runner" data-full-code="fn%20first_word(s%3A%20%26str)%20-%3E%20%26str%20%7B%0A%20%20%20%20let%20bytes%20%3D%20s.as_bytes()%3B%0A%20%20%20%20for%20(i%2C%20%26byte)%20in%20bytes.iter().enumerate()%20%7B%0A%20%20%20%20%20%20%20%20if%20byte%20%3D%3D%20b'%20'%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20%26s%5B0..i%5D%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%26s%5B..%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%20world%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20first_word(%26s))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> first_word</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_bytes</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (i, </span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">byte) </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> bytes</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">enumerate</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> byte </span><span style="color:#F97583">==</span><span style="color:#9ECBFF"> b' '</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            return</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">s[</span><span style="color:#79B8FF">0</span><span style="color:#F97583">..</span><span style="color:#E1E4E8">i];</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#E1E4E8">s[</span><span style="color:#F97583">..</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">first_word</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">s));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个函数既有引用参数又有引用返回值，按理说需要标注——但它没有，也能编译。

原因是 Rust 编译器内置了**生命周期省略规则**（lifetime elision rules）。这些规则覆盖了最常见的模式，当输入输出的生命周期关系可以唯一确定时，编译器帮你自动填写，你不需要手写。

> 省略规则不是”猜测”，而是确定性的推断。如果应用规则后仍有歧义，编译器会报错要求你显式标注。

## 三条省略规则

编译器按顺序应用这三条规则，对所有函数（包括 `fn` 定义和 `impl` 块）有效：

### 规则一：每个引用参数各自获得独立的生命周期

```rust
// 原始写法：
fn foo(x: &i32) -> i32 { *x }

// 编译器看到的：
fn foo<'a>(x: &'a i32) -> i32 { *x }
```

```rust
// 两个参数各自独立：
fn bar(x: &i32, y: &i32) -> i32 { x + y }

// 编译器看到的：
fn bar<'a, 'b>(x: &'a i32, y: &'b i32) -> i32 { x + y }
```

### 规则二：只有一个引用参数时，它的生命周期赋给所有返回引用

```rust
// 原始写法：
fn first_word(s: &str) -> &str { ... }

// 应用规则一后：
fn first_word<'a>(s: &'a str) -> &str { ... }

// 应用规则二后（只有一个输入生命周期 'a，赋给输出）：
fn first_word<'a>(s: &'a str) -> &'a str { ... }
```

这就是为什么 `first_word` 不需要手写标注！

### 规则三：方法中有 &self 或 &mut self 时，self 的生命周期赋给所有返回引用

这条规则让方法签名通常不需要任何生命周期标注：

<div class="code-runner" data-full-code="struct%20Excerpt%3C'a%3E%20%7B%0A%20%20%20%20part%3A%20%26'a%20str%2C%0A%7D%0A%0Aimpl%3C'a%3E%20Excerpt%3C'a%3E%20%7B%0A%20%20%20%20%2F%2F%20%E6%9C%89%20%26self%20%E5%8F%82%E6%95%B0%EF%BC%8C%E8%A7%84%E5%88%99%E4%B8%89%EF%BC%9A%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8E%20%26self%20%E7%9B%B8%E5%90%8C%0A%20%20%20%20%2F%2F%20%E7%9B%B8%E5%BD%93%E4%BA%8E%3A%20fn%20announce(%26'b%20self%2C%20ann%3A%20%26'c%20str)%20-%3E%20%26'b%20str%0A%20%20%20%20fn%20announce(%26self%2C%20ann%3A%20%26str)%20-%3E%20%26str%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E9%80%9A%E7%9F%A5%EF%BC%9A%7B%7D%22%2C%20ann)%3B%0A%20%20%20%20%20%20%20%20self.part%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20text%20%3D%20String%3A%3Afrom(%22%E9%87%8D%E8%A6%81%E5%86%85%E5%AE%B9%E5%9C%A8%E8%BF%99%E9%87%8C%E3%80%82%E8%BF%98%E6%9C%89%E6%9B%B4%E5%A4%9A%E3%80%82%22)%3B%0A%20%20%20%20let%20first%20%3D%20text.split('%E3%80%82').next().unwrap()%3B%0A%20%20%20%20let%20exc%20%3D%20Excerpt%20%7B%20part%3A%20first%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20exc.announce(%22%E8%AF%B7%E6%B3%A8%E6%84%8F%22))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Excerpt</span><span style="color:#E1E4E8">&lt;'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    part</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">a</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">Excerpt</span><span style="color:#E1E4E8">&lt;'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#6A737D">    // 有 &amp;self 参数，规则三：返回值的生命周期与 &amp;self 相同</span></span>
<span class="line"><span style="color:#6A737D">    // 相当于: fn announce(&amp;'b self, ann: &amp;'c str) -&gt; &amp;'b str</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> announce</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, ann</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"通知：{}"</span><span style="color:#E1E4E8">, ann);</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">part</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> text </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"重要内容在这里。还有更多。"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> first </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> text</span><span style="color:#F97583">.</span><span style="color:#B392F0">split</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'。'</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> exc </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Excerpt</span><span style="color:#E1E4E8"> { part</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> first };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, exc</span><span style="color:#F97583">.</span><span style="color:#B392F0">announce</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请注意"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 三条规则的实战演示

用规则来推导 `longest` 函数为什么必须手写标注：

```rust
// 原始：
fn longest(x: &str, y: &str) -> &str

// 规则一（两个引用参数，各自获得生命周期）：
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str

// 规则二：多于一个输入生命周期，不适用
// 规则三：不是方法，没有 &self，不适用

// 结果：返回值的生命周期无法确定 → 编译器报错，要求你手写
```

这就是为什么 `longest` 必须手写 `<'a>`——三条规则用完还是有歧义。

## 省略规则是”语法糖”

省略掉的生命周期**依然存在**，只是不用写出来。加上或去掉都完全等价：

<div class="code-runner" data-full-code="%2F%2F%20%E8%BF%99%E4%B8%A4%E4%B8%AA%E5%87%BD%E6%95%B0%E5%AE%8C%E5%85%A8%E7%AD%89%E4%BB%B7%0Afn%20get_first(v%3A%20%26%5Bi32%5D)%20-%3E%20%26i32%20%7B%0A%20%20%20%20%26v%5B0%5D%0A%7D%0A%0Afn%20get_first_explicit%3C'a%3E(v%3A%20%26'a%20%5Bi32%5D)%20-%3E%20%26'a%20i32%20%7B%0A%20%20%20%20%26v%5B0%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20nums%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20get_first(%26nums))%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20get_first_explicit(%26nums))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 这两个函数完全等价</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_first</span><span style="color:#E1E4E8">(v</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#E1E4E8">v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_first_explicit</span><span style="color:#E1E4E8">&lt;'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8">&gt;(v</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">a</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#E1E4E8">v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> nums </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_first</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">nums));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_first_explicit</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">nums));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# `'static` 生命周期

## 什么是 ‘static

`'static` 是一个特殊的生命周期，表示**整个程序运行期间都有效**。带有 `'static` 生命周期的数据永远不会被销毁（或者说活到程序结束）。

有两种方式产生 `'static` 数据：

**1. 字符串字面量：**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD%E8%83%BD%E8%87%AA%E5%8A%A8%E5%BE%97%E5%87%BA%20%26'static%20str%EF%BC%8C%E9%80%9A%E5%B8%B8%E4%B8%8D%E9%9C%80%E8%A6%81%E6%89%8B%E5%86%99%0A%20%20%20%20let%20s1%20%3D%20%22%E6%88%91%E6%98%AF%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%8C%E4%BD%8F%E5%9C%A8%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9A%84%E5%8F%AA%E8%AF%BB%E6%AE%B5%22%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E6%9C%89%E5%9C%A8%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D%E7%AD%89%E9%9C%80%E8%A6%81%E6%98%8E%E7%A1%AE%E7%BA%A6%E6%9D%9F%E6%97%B6%EF%BC%8C%E6%89%8D%E6%98%BE%E5%BC%8F%E5%86%99%E5%87%BA%20'static%0A%20%20%20%20let%20s2%3A%20%26'static%20str%20%3D%20%22%E8%BF%99%E9%87%8C%E6%98%BE%E5%BC%8F%E5%86%99%E5%87%BA%E6%9D%A5%EF%BC%8C%E6%95%88%E6%9E%9C%E7%9B%B8%E5%90%8C%22%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s1)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 类型推断能自动得出 &amp;'static str，通常不需要手写</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "我是字面量，住在二进制的只读段"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只有在函数签名等需要明确约束时，才显式写出 'static</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "这里显式写出来，效果相同"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s1);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**2. `static` 全局常量：**

<div class="code-runner" data-full-code="%2F%2F%20static%20%E5%A3%B0%E6%98%8E%E7%9A%84%E5%80%BC%E5%9C%A8%E6%95%B4%E4%B8%AA%E7%A8%8B%E5%BA%8F%E6%9C%9F%E9%97%B4%E5%AD%98%E5%9C%A8%0A%2F%2F%20%E8%8B%A5%E5%AD%97%E6%AE%B5%E6%98%AF%E5%BC%95%E7%94%A8%EF%BC%8C'static%20%E6%98%AF%E9%9A%90%E5%90%AB%E7%9A%84%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%86%99%E5%87%BA%E6%9D%A5%0Astatic%20MAX_CONNECTIONS%3A%20u32%20%3D%20100%3B%0Astatic%20APPNAME%3A%20%26str%20%3D%20%22my-app%22%3B%20%2F%2F%20%E7%AD%89%E4%BB%B7%E4%BA%8E%20%26'static%20str%EF%BC%8C'static%20%E5%8F%AF%E7%9C%81%E7%95%A5%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E8%BF%9E%E6%8E%A5%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20MAX_CONNECTIONS)%3B%0A%20%20%20%20println!(%22%E5%BA%94%E7%94%A8%E5%90%8D%EF%BC%9A%7B%7D%22%2C%20APPNAME)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// static 声明的值在整个程序期间存在</span></span>
<span class="line"><span style="color:#6A737D">// 若字段是引用，'static 是隐含的，不需要写出来</span></span>
<span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> MAX_CONNECTIONS</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> APPNAME</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "my-app"</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 等价于 &amp;'static str，'static 可省略</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大连接数：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">MAX_CONNECTIONS</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"应用名：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">APPNAME</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## ‘static 可以被”缩短”

`'static` 是最长的生命周期，它可以被强制转换成任何更短的生命周期。这很自然：一个活到程序结束的引用，在任何子区间内当然也是有效的。

<div class="code-runner" data-full-code="static%20NUM%3A%20i32%20%3D%2018%3B%0A%0A%2F%2F%20%E6%8E%A5%E5%8F%97%E4%B8%80%E4%B8%AA%20%26'a%20i32%EF%BC%8C%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%20%26'a%20i32%0A%2F%2F%20%E6%8A%8A%20%26'static%20i32%20%E7%9A%84%20NUM%20%E5%BD%93%E4%BD%9C%20%26'a%20i32%20%E4%BC%A0%E5%85%A5%EF%BC%8C%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%E7%BC%A9%E7%9F%AD%22%E4%BA%86%0Afn%20coerce_static%3C'a%3E(_%3A%20%26'a%20i32)%20-%3E%20%26'a%20i32%20%7B%0A%20%20%20%20%26NUM%20%20%2F%2F%20NUM%20%E6%98%AF%20'static%EF%BC%8C%E4%BD%86%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D%E6%89%BF%E8%AF%BA%E5%8F%AA%E8%BF%94%E5%9B%9E%20'a%20%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BC%95%E7%94%A8%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2010%3B%0A%20%20%20%20let%20r%20%3D%20coerce_static(%26x)%3B%0A%20%20%20%20println!(%22r%20%3D%20%7B%7D%22%2C%20r)%3B%0A%20%20%20%20println!(%22NUM%20%3D%20%7B%7D%20%E4%BB%8D%E7%84%B6%E5%8F%AF%E8%AE%BF%E9%97%AE%22%2C%20NUM)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> NUM</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 18</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 接受一个 &amp;'a i32，返回一个 &amp;'a i32</span></span>
<span class="line"><span style="color:#6A737D">// 把 &amp;'static i32 的 NUM 当作 &amp;'a i32 传入，生命周期"缩短"了</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> coerce_static</span><span style="color:#E1E4E8">&lt;'</span><span style="color:#B392F0">a</span><span style="color:#E1E4E8">&gt;(_</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">a</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">a</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#79B8FF">NUM</span><span style="color:#6A737D">  // NUM 是 'static，但函数签名承诺只返回 'a 级别的引用</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r </span><span style="color:#F97583">=</span><span style="color:#B392F0"> coerce_static</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">x);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"r = {}"</span><span style="color:#E1E4E8">, r);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"NUM = {} 仍然可访问"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">NUM</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 何时该用 ‘static

`'static` 最常见的合法用途是**字符串字面量**和**全局常量**——它们确实在整个程序期间存在。

在函数签名中使用 `'static` 作为返回值约束，意味着返回的引用必须是这两者之一：

<div class="code-runner" data-full-code="fn%20get_error_msg(code%3A%20u32)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20match%20code%20%7B%0A%20%20%20%20%20%20%20%20404%20%3D%3E%20%22%E6%9C%AA%E6%89%BE%E5%88%B0%22%2C%0A%20%20%20%20%20%20%20%20500%20%3D%3E%20%22%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%86%85%E9%83%A8%E9%94%99%E8%AF%AF%22%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20%22%E6%9C%AA%E7%9F%A5%E9%94%99%E8%AF%AF%22%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20get_error_msg(404))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_error_msg</span><span style="color:#E1E4E8">(code</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> code {</span></span>
<span class="line"><span style="color:#79B8FF">        404</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "未找到"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        500</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "服务器内部错误"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "未知错误"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_error_msg</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">404</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 常见误区：不要乱用 ‘static

当你遇到生命周期错误时，编译器有时会建议”考虑使用 `'static`”，这**不是建议你真的这样做**，而是在告诉你一种可能的（但通常是错误的）解决方案。

<div class="code-runner" data-full-code="%2F%2F%20%E9%94%99%E8%AF%AF%E7%9A%84%E7%94%A8%E6%B3%95%EF%BC%9A%E8%AF%95%E5%9B%BE%E7%94%A8%20'static%20%E9%80%83%E9%81%BF%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%97%AE%E9%A2%98%0Afn%20bad_idea(s%3A%20String)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E5%8F%AF%E8%83%BD%EF%BC%81s%20%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%E9%94%80%E6%AF%81%EF%BC%8C%E6%B2%A1%E6%B3%95%E8%BF%94%E5%9B%9E%20'static%20%E5%BC%95%E7%94%A8%0A%20%20%20%20%26s%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 错误的用法：试图用 'static 逃避生命周期问题</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> bad_idea</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 不可能！s 在函数结束时销毁，没法返回 'static 引用</span></span>
<span class="line"><span style="color:#F97583">    &amp;</span><span style="color:#E1E4E8">s</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

遇到生命周期错误，应该**找根本原因**——通常是返回引用而应该返回有所有权的值，或者调整数据的生命周期让它活得足够久。

> 规则：只有当数据**真的在整个程序期间存在**时，才使用 `'static`。如果你只是想”消除编译错误”而用它，几乎肯定是在掩盖真正的问题。

---

# 练习题

## 省略规则测验

下面是几组函数，判断编译器推断后的完整签名：

加载题目中…

加载题目中…

加载题目中…

## ‘static 测验

加载题目中…

加载题目中…

## 编程练习

实现 `status_text` 函数，根据 HTTP 状态码返回对应的描述字符串。返回值类型应该是 `&'static str`——想想为什么这里用 `'static` 是合理的：

```rust
// TODO: 补全返回值类型和函数体
// 200 -> "OK"，404 -> "Not Found"，500 -> "Internal Server Error"，其他 -> "Unknown"
fn status_text(code: u32) -> ??? {
    todo!()
}

fn main() {
    println!("{}", status_text(200));
    println!("{}", status_text(404));
    println!("{}", status_text(500));
    println!("{}", status_text(418));
}
```