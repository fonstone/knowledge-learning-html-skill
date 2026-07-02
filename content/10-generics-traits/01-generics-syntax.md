# 用泛型抽象类型

## 为什么需要泛型

假设你要写一个函数，找出整数列表中最大的值：

<div class="code-runner" data-full-code="fn%20largest_i32(list%3A%20%26%5Bi32%5D)%20-%3E%20%26i32%20%7B%0A%20%20%20%20let%20mut%20largest%20%3D%20%26list%5B0%5D%3B%0A%20%20%20%20for%20item%20in%20list%20%7B%0A%20%20%20%20%20%20%20%20if%20item%20%3E%20largest%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20largest%20%3D%20item%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20largest%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20numbers%20%3D%20vec!%5B34%2C%2050%2C%2025%2C%20100%2C%2065%5D%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%80%BC%E6%98%AF%20%7B%7D%22%2C%20largest_i32(%26numbers))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> largest_i32</span><span style="color:#E1E4E8">(list</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> largest </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">list[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> list {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> largest {</span></span>
<span class="line"><span style="color:#E1E4E8">            largest </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> item;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    largest</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">34</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">25</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">65</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大值是 {}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">largest_i32</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">numbers));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

现在你想对 `f64` 列表做同样的事，怎么办？复制一份：

```rust
fn largest_f64(list: &[f64]) -> &f64 {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

两个函数的**逻辑完全相同**，只有类型不同。如果还要支持 `char`、`u8`……每次都要复制？虽然 C 语言正是这样做的，但 Rust 里可以写的更加优雅，这正是泛型要解决的问题。

**泛型**让你用一个占位符 `T` 代表”某种类型”，写一份代码，让编译器自动适配所有需要的类型。

## 泛型函数

用泛型合并上面两个函数：

<div class="code-runner" data-full-code="fn%20largest%3CT%3A%20PartialOrd%3E(list%3A%20%26%5BT%5D)%20-%3E%20%26T%20%7B%0A%20%20%20%20let%20mut%20largest%20%3D%20%26list%5B0%5D%3B%0A%20%20%20%20for%20item%20in%20list%20%7B%0A%20%20%20%20%20%20%20%20if%20item%20%3E%20largest%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20largest%20%3D%20item%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20largest%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20numbers%20%3D%20vec!%5B34%2C%2050%2C%2025%2C%20100%2C%2065%5D%3B%0A%20%20%20%20println!(%22%E6%95%B4%E6%95%B0%E6%9C%80%E5%A4%A7%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20largest(%26numbers))%3B%0A%0A%20%20%20%20let%20floats%20%3D%20vec!%5B2.7%2C%203.1%2C%200.8%2C%209.5%2C%201.4%5D%3B%0A%20%20%20%20println!(%22%E6%B5%AE%E7%82%B9%E6%9C%80%E5%A4%A7%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20largest(%26floats))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> largest</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">&gt;(list</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> largest </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">list[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> list {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> largest {</span></span>
<span class="line"><span style="color:#E1E4E8">            largest </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> item;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    largest</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">34</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">25</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">65</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"整数最大值：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">largest</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">numbers));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> floats </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">2.7</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0.8</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">9.5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1.4</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"浮点最大值：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">largest</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">floats));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

语法拆解：

- `<T: PartialOrd>` — 在函数名后用尖括号声明类型参数 T ； PartialOrd 是 约束 ，表示”T 必须支持比较大小”。没有这个约束，编译器不允许用 > 运算符
- `list: &[T]` — 参数是元素类型为 T 的切片
- `-> &T` — 返回对 T 类型值的引用

> `T` 只是惯例，你可以用任何标识符。但单个大写字母是 Rust 社区的约定，多个类型参数时常用 `T`、`U`、`K`、`V`。

约束语法（如 `PartialOrd`）的完整内容在 Trait 章节会讲，现在只需记住：**约束说明 T 能做什么**。

## 显式指定泛型参数：turbofish

大多数情况下，编译器能从传入的值自动推导 `T` 是什么，不需要手动指定：

<div class="code-runner" data-full-code="fn%20wrap%3CT%3E(val%3A%20T)%20-%3E%20Vec%3CT%3E%20%7B%20vec!%5Bval%5D%20%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20wrap(42)%3B%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%BB%8E%2042%20%E6%8E%A8%E5%AF%BC%E5%87%BA%20T%20%3D%20i32%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> wrap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; { </span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[val] }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> wrap</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 编译器从 42 推导出 T = i32</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但有些函数的泛型参数在参数里看不出来，编译器无法推导，这时需要用 `函数名::<类型>()` 显式指定：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20parse%20%E6%8A%8A%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%A7%A3%E6%9E%90%E6%88%90%22%E6%9F%90%E7%A7%8D%E7%B1%BB%E5%9E%8B%22%EF%BC%8C%E4%BD%86%E5%93%AA%E7%A7%8D%E7%B1%BB%E5%9E%8B%EF%BC%9F%E7%BC%96%E8%AF%91%E5%99%A8%E6%97%A0%E6%B3%95%E4%BB%8E%20%2242%22%20%E6%8E%A8%E6%96%AD%0A%20%20%20%20let%20n%20%3D%20%2242%22.parse%3A%3A%3Ci32%3E().unwrap()%3B%0A%20%20%20%20let%20f%20%3D%20%223.14%22.parse%3A%3A%3Cf64%3E().unwrap()%3B%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%22%2C%20n%2C%20f)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // parse 把字符串解析成"某种类型"，但哪种类型？编译器无法从 "42" 推断</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "42"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "3.14"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">&gt;()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {}"</span><span style="color:#E1E4E8">, n, f);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`parse::<i32>()` 这种 `函数名::<类型>()` 语法叫 **turbofish**。注意不能省略 `::`，写成 `parse<i32>()` 会被编译器误读为比较运算符而报错。

规则很简单：**编译器能推导就省略；推导不了就加 turbofish**。

## 泛型结构体

类型参数同样可以放在结构体上：

<div class="code-runner" data-full-code="struct%20Point%3CT%3E%20%7B%0A%20%20%20%20x%3A%20T%2C%0A%20%20%20%20y%3A%20T%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20int_point%20%3D%20Point%20%7B%20x%3A%205%2C%20y%3A%2010%20%7D%3B%0A%20%20%20%20let%20flt_point%20%3D%20Point%20%7B%20x%3A%201.0%2C%20y%3A%204.0%20%7D%3B%0A%20%20%20%20println!(%22%E6%95%B4%E6%95%B0%E7%82%B9%3A%20(%7B%7D%2C%20%7B%7D)%22%2C%20int_point.x%2C%20int_point.y)%3B%0A%20%20%20%20println!(%22%E6%B5%AE%E7%82%B9%E7%82%B9%3A%20(%7B%7D%2C%20%7B%7D)%22%2C%20flt_point.x%2C%20flt_point.y)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> int_point </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> flt_point </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"整数点: ({}, {})"</span><span style="color:#E1E4E8">, int_point</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, int_point</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"浮点点: ({}, {})"</span><span style="color:#E1E4E8">, flt_point</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, flt_point</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意：`x` 和 `y` 共享同一个 `T`，所以它们必须是**相同类型**：

<div class="code-runner" data-full-code="struct%20Point%3CT%3E%20%7B%20x%3A%20T%2C%20y%3A%20T%20%7D%0Afn%20main()%20%7B%0Alet%20mixed%20%3D%20Point%20%7B%20x%3A%205%2C%20y%3A%204.0%20%7D%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81x%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20i32%EF%BC%8Cy%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20f64%0A%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> mixed </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> }; </span><span style="color:#6A737D">// 错误！x 推导为 i32，y 推导为 f64</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> mixed </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> }; </span><span style="color:#6A737D">// 错误！x 推导为 i32，y 推导为 f64</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

如果需要两字段可以是不同类型，用**两个类型参数**：

<div class="code-runner" data-full-code="struct%20Point%3CT%2C%20U%3E%20%7B%0A%20%20%20%20x%3A%20T%2C%0A%20%20%20%20y%3A%20U%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mixed%20%3D%20Point%20%7B%20x%3A%205%2C%20y%3A%204.0%20%7D%3B%0A%20%20%20%20println!(%22%E6%B7%B7%E5%90%88%E7%82%B9%3A%20(%7B%7D%2C%20%7B%7D)%22%2C%20mixed.x%2C%20mixed.y)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">U</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> U</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> mixed </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"混合点: ({}, {})"</span><span style="color:#E1E4E8">, mixed</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, mixed</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 泛型枚举

你其实早就在用泛型枚举了——标准库里的 `Option` 和 `Result` 就是：

```rust
// 标准库中的定义（仅供参考，不需要自己写）
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`Option<i32>` 和 `Option<String>` 结构完全一样，只是 `T` 不同。这就是泛型让一个枚举适配无数场景的原理。

你自己也可以定义泛型枚举：

<div class="code-runner" data-full-code="%2F%2F%20%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E4%BA%8C%E5%8F%89%E6%A0%91%EF%BC%8C%E5%AD%98%E5%82%A8%E4%BB%BB%E6%84%8F%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%80%BC%0Aenum%20Tree%3CT%3E%20%7B%0A%20%20%20%20Leaf(T)%2C%0A%20%20%20%20Node(Box%3CTree%3CT%3E%3E%2C%20Box%3CTree%3CT%3E%3E)%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20tree%3A%20Tree%3Ci32%3E%20%3D%20Tree%3A%3ANode(%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Tree%3A%3ALeaf(1))%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Tree%3A%3ALeaf(2))%2C%0A%20%20%20%20)%3B%0A%20%20%20%20println!(%22%E5%88%9B%E5%BB%BA%E6%88%90%E5%8A%9F%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 一个简单的二叉树，存储任意类型的值</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Tree</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#B392F0">    Leaf</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Node</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Tree</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;&gt;, </span><span style="color:#B392F0">Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Tree</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;&gt;),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> tree</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Tree</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Tree</span><span style="color:#F97583">::</span><span style="color:#B392F0">Node</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Tree</span><span style="color:#F97583">::</span><span style="color:#B392F0">Leaf</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)),</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Tree</span><span style="color:#F97583">::</span><span style="color:#B392F0">Leaf</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)),</span></span>
<span class="line"><span style="color:#E1E4E8">    );</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"创建成功"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 方法与单态化

## 为泛型类型定义方法

在 `impl` 块上使用泛型，需要在 `impl` 关键字后面同样声明 `<T>`：

<div class="code-runner" data-full-code="struct%20Point%3CT%3E%20%7B%0A%20%20%20%20x%3A%20T%2C%0A%20%20%20%20y%3A%20T%2C%0A%7D%0A%0Aimpl%3CT%3E%20Point%3CT%3E%20%7B%0A%20%20%20%20fn%20x(%26self)%20-%3E%20%26T%20%7B%0A%20%20%20%20%20%20%20%20%26self.x%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20y(%26self)%20-%3E%20%26T%20%7B%0A%20%20%20%20%20%20%20%20%26self.y%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%205%2C%20y%3A%2010%20%7D%3B%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%2C%20y%20%3D%20%7B%7D%22%2C%20p.x()%2C%20p.y())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> x</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        &amp;</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> y</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        &amp;</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}, y = {}"</span><span style="color:#E1E4E8">, p</span><span style="color:#F97583">.</span><span style="color:#B392F0">x</span><span style="color:#E1E4E8">(), p</span><span style="color:#F97583">.</span><span style="color:#B392F0">y</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为什么要写**两次** `<T>`？对比函数就清楚了：

```rust
// 函数：先在 <T> 里"引入"T，然后在参数里"使用"T
fn foo<T>(x: T) { ... }
//    ^^^  ^^^
//    引入  使用

// impl：同样先"引入"T，然后在类型名里"使用"T
impl<T> Point<T> { ... }
//   ^^^       ^^^
//   引入       使用
```

`impl<T>` 里的 `<T>` 是在告诉编译器：“接下来的 `T` 是一个类型参数，不是某个叫做 `T` 的具体类型”。如果直接写 `impl Point<T>`（省掉前面的 `<T>`），编译器会以为 `T` 是某个具体类型的名字，找不到就报错。

## 为特定类型实现专属方法

也可以只为某个**具体类型**实现方法。这时 `impl` 后面不加 `<T>`：

<div class="code-runner" data-full-code="struct%20Point%3CT%3E%20%7B%0A%20%20%20%20x%3A%20T%2C%0A%20%20%20%20y%3A%20T%2C%0A%7D%0A%0A%2F%2F%20%E6%89%80%E6%9C%89%20Point%3CT%3E%20%E9%83%BD%E6%9C%89%E8%BF%99%E4%B8%AA%E6%96%B9%E6%B3%95%0Aimpl%3CT%3E%20Point%3CT%3E%20%7B%0A%20%20%20%20fn%20x(%26self)%20-%3E%20%26T%20%7B%0A%20%20%20%20%20%20%20%20%26self.x%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%E5%8F%AA%E6%9C%89%20Point%3Cf64%3E%20%E6%89%8D%E6%9C%89%E8%BF%99%E4%B8%AA%E6%96%B9%E6%B3%95%0Aimpl%20Point%3Cf64%3E%20%7B%0A%20%20%20%20fn%20distance_from_origin(%26self)%20-%3E%20f64%20%7B%0A%20%20%20%20%20%20%20%20(self.x.powi(2)%20%2B%20self.y.powi(2)).sqrt()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20flt_p%20%3D%20Point%20%7B%20x%3A%203.0_f64%2C%20y%3A%204.0%20%7D%3B%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20flt_p.x())%3B%0A%20%20%20%20println!(%22%E8%B7%9D%E5%8E%9F%E7%82%B9%E8%B7%9D%E7%A6%BB%3A%20%7B%7D%22%2C%20flt_p.distance_from_origin())%3B%20%2F%2F%205.0%0A%0A%20%20%20%20let%20int_p%20%3D%20Point%20%7B%20x%3A%203_i32%2C%20y%3A%204%20%7D%3B%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20int_p.x())%3B%0A%20%20%20%20%2F%2F%20int_p.distance_from_origin()%3B%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81i32%20%E7%89%88%E6%9C%AC%E6%B2%A1%E6%9C%89%E8%BF%99%E4%B8%AA%E6%96%B9%E6%B3%95%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 所有 Point&lt;T&gt; 都有这个方法</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> x</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        &amp;</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 只有 Point&lt;f64&gt; 才有这个方法</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> distance_from_origin</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">.</span><span style="color:#B392F0">powi</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y</span><span style="color:#F97583">.</span><span style="color:#B392F0">powi</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">))</span><span style="color:#F97583">.</span><span style="color:#B392F0">sqrt</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> flt_p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3.0_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, flt_p</span><span style="color:#F97583">.</span><span style="color:#B392F0">x</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"距原点距离: {}"</span><span style="color:#E1E4E8">, flt_p</span><span style="color:#F97583">.</span><span style="color:#B392F0">distance_from_origin</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 5.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> int_p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3_</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, int_p</span><span style="color:#F97583">.</span><span style="color:#B392F0">x</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#6A737D">    // int_p.distance_from_origin(); // 编译错误！i32 版本没有这个方法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 单态化：零开销抽象

泛型的关键卖点：**运行时没有任何额外开销**。

Rust 编译器在编译阶段做**单态化**（monomorphization）——把每处泛型代码展开成针对该具体类型的独立代码：

```rust
// 你写的
fn largest<T: PartialOrd>(list: &[T]) -> &T { ... }

// 你调用了
largest(&[1_i32, 2, 3]);
largest(&[1.0_f64, 2.0, 3.0]);

// 编译器实际生成（概念示意）
fn largest_i32(list: &[i32]) -> &i32 { ... }
fn largest_f64(list: &[f64]) -> &f64 { ... }
```

这意味着：

| 维度 | 表现 |
| --- | --- |
| 运行速度 | 和手写具体类型代码完全相同 |
| 编译时间 | 用到的类型越多，编译越慢 |
| 二进制大小 | 每种类型生成一份代码，体积略增 |

Rust 选择了”编译期多花时间，换取运行时零开销”的策略。这正是 Rust 能做到既安全又高效的原因之一。

> 与单态化相对的是**动态分发**（`dyn Trait`）：推迟到运行时才确定类型，有运行时开销但编译产物更小。两种策略各有适用场景，后续章节会介绍。

# 练习题

## 泛型函数测验

加载题目中…

```rust
struct Container<T, U> {
    first: T,
    second: U,
}
```

加载题目中…

## 泛型 impl 测验

加载题目中…

加载题目中…

## 编程练习

下面的 `wrap` 函数只能包装 `i32`。请将它改造成泛型函数，使其能包装任意类型，并让 `main` 中所有调用都正常编译运行。

```rust
fn wrap(value: i32) -> Vec<i32> {
    vec![value]
}

fn main() {
    let nums = wrap(42);
    println!("{:?}", nums); // [42]

    // 让下面两行也能工作
    let strs = wrap("hello");
    println!("{:?}", strs); // ["hello"]

    let bools = wrap(true);
    println!("{:?}", bools); // [true]
}
```