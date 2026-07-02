# 转换 Trait 系统

## 为什么需要转换 Trait

前面在”类型系统”章节学过，Rust 不提供**隐式类型转换**。但有时我们需要将一个类型**安全地、优雅地**转换为另一个类型。

转换 trait 提供了：

- 显式意图 ：清楚地表达”这是一个转换”
- 灵活性 ：支持任意类型之间的转换
- 错误处理 ：某些转换可能失败，使用 Result 处理
- 自动化 ：实现一个 trait，自动获得相关功能

## From 和 Into Trait

### From Trait：构造自我

`From<T>` trait 表示”我可以从 T 构造自己”：

```rust
trait From<T> {
    fn from(value: T) -> Self;
}
```

**标准库中已有的 From 实现：**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20String%3A%3Afrom(%26str)%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20%2F%2F%20i32%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20From%3Cu16%3E%0A%20%20%20%20let%20num%3A%20i32%20%3D%20100u16.into()%3B%0A%0A%20%20%20%20println!(%22s1%3A%20%7B%7D%2C%20num%3A%20%7B%7D%22%2C%20s1%2C%20num)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // String::from(&amp;str)</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // i32 实现了 From&lt;u16&gt;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 100</span><span style="color:#B392F0">u16</span><span style="color:#F97583">.</span><span style="color:#B392F0">into</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"s1: {}, num: {}"</span><span style="color:#E1E4E8">, s1, num);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 为自定义类型实现 From

<div class="code-runner" data-full-code="use%20std%3A%3Aconvert%3A%3AFrom%3B%0A%0A%23%5Bderive(Debug)%5D%0Astruct%20Number%20%7B%0A%20%20%20%20value%3A%20i32%2C%0A%7D%0A%0Aimpl%20From%3Ci32%3E%20for%20Number%20%7B%0A%20%20%20%20fn%20from(item%3A%20i32)%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Number%20%7B%20value%3A%20item%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20num1%20%3D%20Number%3A%3Afrom(30)%3B%0A%20%20%20%20println!(%22%E6%96%B9%E5%BC%8F%201%20-%20from%3A%20%7B%3A%3F%7D%22%2C%20num1)%3B%0A%0A%20%20%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%BE%97%20into%EF%BC%88%E4%B8%8D%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%EF%BC%89%0A%20%20%20%20let%20num2%3A%20Number%20%3D%2040.into()%3B%0A%20%20%20%20println!(%22%E6%96%B9%E5%BC%8F%202%20-%20into%3A%20%7B%3A%3F%7D%22%2C%20num2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">convert</span><span style="color:#F97583">::</span><span style="color:#B392F0">From</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Number</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> From</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Number</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> from</span><span style="color:#E1E4E8">(item</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Number</span><span style="color:#E1E4E8"> { value</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> item }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Number</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"方式 1 - from: {:?}"</span><span style="color:#E1E4E8">, num1);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 自动获得 into（不用手动实现）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num2</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Number</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 40.</span><span style="color:#B392F0">into</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"方式 2 - into: {:?}"</span><span style="color:#E1E4E8">, num2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### Into Trait：转换为他人

`Into<T>` trait 表示”我可以转换成 T”：

```rust
trait Into<T> {
    fn into(self) -> T;
}
```

**关键点**：如果你为类型 A 实现了 `From<B>`，编译器会**自动**为 B 实现 `Into<A>`。它们互为倒数。

### From vs Into：何时用哪个

- 实现转换时 ：总是实现 From ，自动获得 Into
- 使用转换时 ：   - 如果有明确的源类型，用 From   - 如果需要类型推导，用 Into

<div class="code-runner" data-full-code="use%20std%3A%3Aconvert%3A%3AFrom%3B%0A%0A%23%5Bderive(Debug)%5D%0Astruct%20Point(i32%2C%20i32)%3B%0A%0Aimpl%20From%3C(i32%2C%20i32)%3E%20for%20Point%20%7B%0A%20%20%20%20fn%20from((x%2C%20y)%3A%20(i32%2C%20i32))%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Point(x%2C%20y)%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%E6%8E%A5%E5%8F%97%E4%BB%BB%E4%BD%95%E8%83%BD%E8%BD%AC%E4%B8%BA%20Point%20%E7%9A%84%E7%B1%BB%E5%9E%8B%0Afn%20make_point%3CT%3A%20Into%3CPoint%3E%3E(x%3A%20T)%20-%3E%20Point%20%7B%0A%20%20%20%20x.into()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p1%20%3D%20Point%3A%3Afrom((1%2C%202))%3B%0A%20%20%20%20let%20p2%3A%20Point%20%3D%20(3%2C%204).into()%3B%0A%20%20%20%20let%20p3%20%3D%20make_point((5%2C%206))%3B%0A%0A%20%20%20%20println!(%22p1%3A%20%7B%3A%3F%7D%2C%20p2%3A%20%7B%3A%3F%7D%2C%20p3%3A%20%7B%3A%3F%7D%22%2C%20p1%2C%20p2%2C%20p3)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">convert</span><span style="color:#F97583">::</span><span style="color:#B392F0">From</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> From</span><span style="color:#E1E4E8">&lt;(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">)&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> from</span><span style="color:#E1E4E8">((x, y)</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">)) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8">(x, y)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 接受任何能转为 Point 的类型</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_point</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Into</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8">&gt;&gt;(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">.</span><span style="color:#B392F0">into</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">((</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p2</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Point</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">into</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p3 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_point</span><span style="color:#E1E4E8">((</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p1: {:?}, p2: {:?}, p3: {:?}"</span><span style="color:#E1E4E8">, p1, p2, p3);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## TryFrom 和 TryInto Trait

### 可能失败的转换

某些转换不一定成功。例如，验证范围、检查有效性等。对于这样的情况，使用 `Try*` trait：

```rust
trait TryFrom<T> {
    type Error;

    fn try_from(value: T) -> Result<Self, Self::Error>;
}

trait TryInto<T> {
    type Error;

    fn try_into(self) -> Result<T, Self::Error>;
}
```

### 实现 TryFrom

<div class="code-runner" data-full-code="use%20std%3A%3Aconvert%3A%3ATryFrom%3B%0A%0A%23%5Bderive(Debug%2C%20PartialEq)%5D%0Astruct%20EvenNumber(i32)%3B%0A%0Aimpl%20TryFrom%3Ci32%3E%20for%20EvenNumber%20%7B%0A%20%20%20%20type%20Error%20%3D%20%26'static%20str%3B%0A%0A%20%20%20%20fn%20try_from(value%3A%20i32)%20-%3E%20Result%3CSelf%2C%20Self%3A%3AError%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%25%202%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Ok(EvenNumber(value))%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Err(%22%E4%B8%8D%E6%98%AF%E5%81%B6%E6%95%B0%22)%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20EvenNumber%3A%3Atry_from(4)%20%7B%0A%20%20%20%20%20%20%20%20Ok(num)%20%3D%3E%20println!(%22%E6%88%90%E5%8A%9F%EF%BC%9A%7B%3A%3F%7D%22%2C%20num)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20match%20EvenNumber%3A%3Atry_from(3)%20%7B%0A%20%20%20%20%20%20%20%20Ok(num)%20%3D%3E%20println!(%22%E6%88%90%E5%8A%9F%EF%BC%9A%7B%3A%3F%7D%22%2C%20num)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">convert</span><span style="color:#F97583">::</span><span style="color:#B392F0">TryFrom</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">PartialEq</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> EvenNumber</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> TryFrom</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> EvenNumber</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Error</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> try_from</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#79B8FF">Self</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Ok</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">EvenNumber</span><span style="color:#E1E4E8">(value))</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Err</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"不是偶数"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> EvenNumber</span><span style="color:#F97583">::</span><span style="color:#B392F0">try_from</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(num) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"成功：{:?}"</span><span style="color:#E1E4E8">, num),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> EvenNumber</span><span style="color:#F97583">::</span><span style="color:#B392F0">try_from</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(num) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"成功：{:?}"</span><span style="color:#E1E4E8">, num),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### TryInto 的自动实现

就像 `Into` 自动实现一样，实现 `TryFrom` 会自动获得 `TryInto`：

<div class="code-runner" data-full-code="use%20std%3A%3Aconvert%3A%3ATryFrom%3B%0A%0A%23%5Bderive(Debug)%5D%0Astruct%20PositiveNumber(u32)%3B%0A%0Aimpl%20TryFrom%3Ci32%3E%20for%20PositiveNumber%20%7B%0A%20%20%20%20type%20Error%20%3D%20String%3B%0A%0A%20%20%20%20fn%20try_from(value%3A%20i32)%20-%3E%20Result%3CSelf%2C%20Self%3A%3AError%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%3E%200%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Ok(PositiveNumber(value%20as%20u32))%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Err(format!(%22%E6%9C%9F%E6%9C%9B%E6%AD%A3%E6%95%B0%EF%BC%8C%E5%BE%97%E5%88%B0%20%7B%7D%22%2C%20value))%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F%201%EF%BC%9A%E4%BD%BF%E7%94%A8%20try_from%0A%20%20%20%20match%20PositiveNumber%3A%3Atry_from(5)%20%7B%0A%20%20%20%20%20%20%20%20Ok(n)%20%3D%3E%20println!(%22try_from%3A%20%7B%3A%3F%7D%22%2C%20n)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F%202%EF%BC%9A%E4%BD%BF%E7%94%A8%20try_into%EF%BC%88%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BE%9B%EF%BC%89%0A%20%20%20%20let%20result%3A%20Result%3CPositiveNumber%2C%20_%3E%20%3D%2010i32.try_into()%3B%0A%20%20%20%20match%20result%20%7B%0A%20%20%20%20%20%20%20%20Ok(n)%20%3D%3E%20println!(%22try_into%3A%20%7B%3A%3F%7D%22%2C%20n)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">convert</span><span style="color:#F97583">::</span><span style="color:#B392F0">TryFrom</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> PositiveNumber</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> TryFrom</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> PositiveNumber</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Error</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> try_from</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#79B8FF">Self</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Ok</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">PositiveNumber</span><span style="color:#E1E4E8">(value </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Err</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"期望正数，得到 {}"</span><span style="color:#E1E4E8">, value))</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 方式 1：使用 try_from</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> PositiveNumber</span><span style="color:#F97583">::</span><span style="color:#B392F0">try_from</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(n) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"try_from: {:?}"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 方式 2：使用 try_into（自动提供）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">PositiveNumber</span><span style="color:#E1E4E8">, _&gt; </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#B392F0">i32</span><span style="color:#F97583">.</span><span style="color:#B392F0">try_into</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> result {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(n) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"try_into: {:?}"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 转换 Trait 关系图

```text
From<T> for A  ←→  Into<A> for T
     ↓                    ↓
TryFrom<T> for A  ←→  TryInto<A> for T
```

- 实现 From<T> 自动获得 Into
- 实现 TryFrom<T> 自动获得 TryInto
- From / Into 用于 总是成功 的转换
- TryFrom / TryInto 用于 可能失败 的转换

# 练习题

## From 和 Into 测验

```rust
struct Color(u8, u8, u8);

impl From<(u8, u8, u8)> for Color {
    fn from((r, g, b): (u8, u8, u8)) -> Self {
        Color(r, g, b)
    }
}

fn main() {
    let c: Color = (255, 0, 0).into();
}
```

加载题目中…

加载题目中…

## TryFrom 和 TryInto 测验

```rust
use std::convert::TryFrom;

#[derive(Debug)]
struct EvenNumber(i32);

impl TryFrom<i32> for EvenNumber {
    type Error = String;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        if value % 2 == 0 {
            Ok(EvenNumber(value))
        } else {
            Err(String::from("不是偶数"))
        }
    }
}
```

加载题目中…

加载题目中…

## 编程练习

为 `Point` 实现 `From<(i32, i32)>`，然后分别用 `From::from()` 和 `.into()` 两种方式创建 `Point`：

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

// TODO: 为 Point 实现 From<(i32, i32)>


fn main() {
    // 用 From 显式转换
    let p1 = Point::from((1, 2));
    println!("p1: {:?}", p1);

    // 用 Into 隐式转换（由 From 自动推导，需标注目标类型）
    let p2: Point = (3, 4).into();
    println!("p2: {:?}", p2);
}
```