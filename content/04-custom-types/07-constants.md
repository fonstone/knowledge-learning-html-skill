# const：常量

**常量** 是那些在程序运行期间**不能改变**的值。与变量不同，常量必须始终是不可变的，且不能用 `mut` 修饰。

## 基本用法

<div class="code-runner" data-full-code="const%20PI%3A%20f64%20%3D%203.14159%3B%0Aconst%20MAX_POINTS%3A%20u32%20%3D%20100_000%3B%0Aconst%20MAX_SIZE%3A%20usize%20%3D%201024%20*%201024%3B%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E6%98%AF%E5%B8%B8%E9%87%8F%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%CF%80%20%E2%89%88%20%7B%7D%22%2C%20PI)%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20MAX_POINTS)%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%B0%BA%E5%AF%B8%EF%BC%9A%7B%7D%20%E5%AD%97%E8%8A%82%22%2C%20MAX_SIZE)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> PI</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 3.14159</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> MAX_POINTS</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 100_000</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> MAX_SIZE</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 1024</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 1024</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 可以是常量表达式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"π ≈ {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">PI</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大分数：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">MAX_POINTS</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大尺寸：{} 字节"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">MAX_SIZE</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## const 的特点

1. 必须指定类型 （不能依赖类型推断）
1. 在编译期计算 ，值被硬编码到二进制文件中
1. 可以在任何作用域定义 ，包括全局作用域
1. 按惯例用全大写 （SCREAMING_SNAKE_CASE）
1. 可以进行简单的常量表达式计算

<div class="code-runner" data-full-code="const%20SECONDS_PER_DAY%3A%20u32%20%3D%2024%20*%2060%20*%2060%3B%0Aconst%20THRESHOLD%3A%20i32%20%3D%2010%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E6%AF%8F%E5%A4%A9%E7%A7%92%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20SECONDS_PER_DAY)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> SECONDS_PER_DAY</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 24</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 60</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> THRESHOLD</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"每天秒数：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">SECONDS_PER_DAY</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 常数表达式

`const` 可以使用常数表达式（编译期可计算的表达式，不会消耗运行性能）：

<div class="code-runner" data-full-code="const%20HOURS_PER_DAY%3A%20u32%20%3D%2024%3B%0Aconst%20MINUTES_PER_HOUR%3A%20u32%20%3D%2060%3B%0Aconst%20SECONDS_PER_MINUTE%3A%20u32%20%3D%2060%3B%0A%0Aconst%20SECONDS_PER_DAY%3A%20u32%20%3D%0A%20%20%20%20HOURS_PER_DAY%20*%20MINUTES_PER_HOUR%20*%20SECONDS_PER_MINUTE%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E6%AF%8F%E5%A4%A9%E7%A7%92%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20SECONDS_PER_DAY)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> HOURS_PER_DAY</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 24</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> MINUTES_PER_HOUR</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> SECONDS_PER_MINUTE</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> SECONDS_PER_DAY</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span></span>
<span class="line"><span style="color:#79B8FF">    HOURS_PER_DAY</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> MINUTES_PER_HOUR</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> SECONDS_PER_MINUTE</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"每天秒数：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">SECONDS_PER_DAY</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## const 的限制

不能用复杂的运行时操作定义 const，比如函数调用（除了一些特殊的 const 函数）：

<div class="code-runner" data-full-code="const%20VALUE%3A%20String%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> VALUE</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 编译错误！</span></span></code></pre></div>

这是因为 `String::from()` 需要在运行时执行。

# static：静态变量

**静态变量**是一种**全局变量**，在程序整个生命周期中只存在一个实例，存储在**固定的内存地址**上。与 const 不同，static 在内存中有真实的地址，可以被取引用。

> **重要**：static 和 const 一样，**都必须明确指定类型**，不能依赖类型推断。

<div class="code-runner" data-full-code="static%20VERSION%3A%20%26str%20%3D%20%221.0.0%22%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20static%20%E6%9C%89%E5%9B%BA%E5%AE%9A%E5%9C%B0%E5%9D%80%0A%20%20%20%20println!(%22%E7%89%88%E6%9C%AC%EF%BC%9A%7B%7D%22%2C%20VERSION)%3B%0A%20%20%20%20println!(%22%E7%89%88%E6%9C%AC%E5%9C%B0%E5%9D%80%EF%BC%9A%7B%3Ap%7D%22%2C%20%26VERSION)%3B%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E5%8F%96%E5%9C%B0%E5%9D%80%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> VERSION</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "1.0.0"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // static 有固定地址</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"版本：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">VERSION</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"版本地址：{:p}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">VERSION</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 可以取地址</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## static 的限制

static 的初始值也必须在**编译期可知**，这一点和 const 相同。不能使用运行时函数来初始化 static：

<div class="code-runner" data-full-code="static%20NAME%3A%20String%20%3D%20String%3A%3Afrom(%22App%22)%3B%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> NAME</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"App"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 编译错误！</span></span></code></pre></div>

因为 `String::from()` 需要在运行时执行。如果需要字符串，应该用 `&str` 字面量：

<div class="code-runner" data-full-code="static%20NAME%3A%20%26str%20%3D%20%22App%22%3B%20%20%2F%2F%20%E6%AD%A3%E7%A1%AE%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20NAME)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> NAME</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "App"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 正确</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">NAME</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

Rust 也支持在函数内声明 static，这与 C 语言相似。函数内的 static 变量生命周期贯穿整个程序，但**作用域被限制在函数内部**，是一种很好的封装手段。

<div class="code-runner" data-full-code="fn%20get_db_timeout()%20-%3E%20u32%20%7B%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E5%86%85%E7%9A%84%20static%20%E2%80%94%20%E5%8F%AA%E5%88%9D%E5%A7%8B%E5%8C%96%E4%B8%80%E6%AC%A1%0A%20%20%20%20static%20DEFAULT_TIMEOUT%3A%20u32%20%3D%2030%3B%0A%20%20%20%20DEFAULT_TIMEOUT%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E8%B6%85%E6%97%B6%EF%BC%9A%7B%7D%20%E7%A7%92%22%2C%20get_db_timeout())%3B%0A%20%20%20%20println!(%22%E8%B6%85%E6%97%B6%EF%BC%9A%7B%7D%20%E7%A7%92%22%2C%20get_db_timeout())%3B%20%20%2F%2F%20%E4%B8%8D%E4%BC%9A%E9%87%8D%E6%96%B0%E5%88%9D%E5%A7%8B%E5%8C%96%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_db_timeout</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 函数内的 static — 只初始化一次</span></span>
<span class="line"><span style="color:#F97583">    static</span><span style="color:#79B8FF"> DEFAULT_TIMEOUT</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">    DEFAULT_TIMEOUT</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"超时：{} 秒"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_db_timeout</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"超时：{} 秒"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_db_timeout</span><span style="color:#E1E4E8">());  </span><span style="color:#6A737D">// 不会重新初始化</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键特性：**

- 每次调用函数时，static 不会重新初始化（只在首次调用时初始化）
- 外部无法直接访问这个 static（作用域限制）
- 这样既能保持全局状态，又能避免污染全局命名空间

## 可变 static

如果你需要一个可变的全局状态，可以用 `static mut`，但**访问或修改都需要 `unsafe` 块**。

### 为什么需要 unsafe

静态变量存在于全局数据区。如果在多个线程中同时访问可变 static，会引发**数据竞争**（Data Race）。Rust 通过 `unsafe` 块要求你显式承认这个风险。

### 例子

<div class="code-runner" data-full-code="static%20mut%20COUNTER%3A%20i32%20%3D%200%3B%0A%0Afn%20increment()%20%7B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20COUNTER%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20println!(%22%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%9A%7B%7D%22%2C%20COUNTER)%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20increment()%3B%0A%20%20%20%20increment()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#F97583"> mut</span><span style="color:#79B8FF"> COUNTER</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> increment</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        COUNTER</span><span style="color:#F97583"> +=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"计数器：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">COUNTER</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **建议：** 一般不推荐使用可变 static，因为容易引起并发问题。如果你需要全局可变状态，考虑其他方案（如 Mutex、线程本地存储等，后续会讲）。

# const vs static：全局变量的选择

## 全局变量只能是 const 或 static

在全局作用域（函数外），你**不能用 `let`**，只能用 `const` 或 `static`。（函数内的话都可以使用）

<div class="code-runner" data-full-code="%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E4%B8%8D%E8%83%BD%E5%9C%A8%E5%85%A8%E5%B1%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E7%94%A8%20let%0Alet%20name%20%3D%20%22Alice%22%3B%0A%0Afn%20main()%20%7B%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 错误！不能在全局作用域用 let</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Alice"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></code></pre></div>

**为什么？** 全局变量的生命周期贯穿整个程序，编译器要求它要么是编译期已知的常数（const），要么是有特殊运行时特性的（static）。普通的 let 变量无法满足这一要求。

## const vs static 的本质区别

虽然 const 和 static 都可以在全局作用域使用，但它们的**原理和用途完全不同**。

### 三种变量的对比

<div class="code-runner" data-full-code="%2F%2F%201.%20%E5%B1%80%E9%83%A8%20let%20%E5%8F%98%E9%87%8F%0Afn%20example_local()%20%7B%0A%20%20%20%20let%20name%20%3D%20%22Alice%22%3B%20%20%2F%2F%20%E6%AF%8F%E6%AC%A1%E8%B0%83%E7%94%A8%E9%83%BD%E9%87%8D%E6%96%B0%E5%88%9B%E5%BB%BA%0A%7D%0A%0A%2F%2F%202.%20%E5%85%A8%E5%B1%80%20const%0Aconst%20API_HOST%3A%20%26str%20%3D%20%22api.example.com%22%3B%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E6%9C%9F%E8%A2%AB%E5%86%85%E8%81%94%E5%88%B0%E6%AF%8F%E4%B8%AA%E4%BD%BF%E7%94%A8%E5%A4%84%0A%0A%2F%2F%203.%20%E5%85%A8%E5%B1%80%20static%0Astatic%20DATABASE_URL%3A%20%26str%20%3D%20%22postgres%3A%2F%2F...%22%3B%20%20%2F%2F%20%E5%9C%A8%E5%86%85%E5%AD%98%E7%9A%84%E5%9B%BA%E5%AE%9A%E5%9C%B0%E5%9D%80%EF%BC%8C%E7%A8%8B%E5%BA%8F%E5%90%AF%E5%8A%A8%E5%88%9B%E5%BB%BA%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20const%EF%BC%9A%E7%BC%96%E8%AF%91%E5%90%8E%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E9%87%8C%E6%9C%89%E5%A4%9A%E4%B8%AA%20%22api.example.com%22%20%E5%89%AF%E6%9C%AC%0A%20%20%20%20println!(%22%7B%7D%22%2C%20API_HOST)%3B%0A%0A%20%20%20%20%2F%2F%20static%EF%BC%9A%E4%BA%8C%E8%BF%9B%E5%88%B6%E9%87%8C%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%20DATABASE_URL%EF%BC%8C%E6%89%80%E6%9C%89%E4%BB%A3%E7%A0%81%E6%8C%87%E5%90%91%E5%90%8C%E4%B8%80%E5%9C%B0%E5%9D%80%0A%20%20%20%20println!(%22%7B%7D%22%2C%20DATABASE_URL)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 1. 局部 let 变量</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> example_local</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Alice"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 每次调用都重新创建</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 2. 全局 const</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> API_HOST</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "api.example.com"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 编译期被内联到每个使用处</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 3. 全局 static</span></span>
<span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> DATABASE_URL</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "postgres://..."</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 在内存的固定地址，程序启动创建</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // const：编译后的二进制里有多个 "api.example.com" 副本</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">API_HOST</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // static：二进制里只有一个 DATABASE_URL，所有代码指向同一地址</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">DATABASE_URL</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### const vs static 的核心区别

| 特性 | const | static |
| --- | --- | --- |
| **存储位置** | 编译期内联到代码中 | 程序内存中的固定地址 |
| **运行时地址** | 无地址（被替换为值） | 有固定地址（`&STATIC` 可取地址） |
| **性能** | 零开销（直接是值） | 通过地址访问（多一步寻址） |
| **生命周期** | 编译期存在 | 程序从启动到结束 |
| **作用域** | 可以是局部（如函数内） | 必须是全局 |
| **可变性** | 总是不可变 | 可以是 `static mut`（需 unsafe） |

**类比理解：**

- const 像”直接数字替换”： PI 在使用处被替换为 3.14159
- static 像”全局变量”：在内存中有一个固定盒子，所有地方都访问同一个地址

### 为什么 static 需要固定地址

<div class="code-runner" data-full-code="const%20PI%3A%20f64%20%3D%203.14%3B%0Astatic%20VERSION%3A%20%26str%20%3D%20%221.0%22%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20const%20%E6%B2%A1%E6%9C%89%E5%9C%B0%E5%9D%80%EF%BC%8C%E6%97%A0%E6%B3%95%E5%8F%96%E5%BC%95%E7%94%A8%0A%20%20%20%20%2F%2F%20println!(%22%7B%3Ap%7D%22%2C%20%26PI)%3B%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81%0A%0A%20%20%20%20%2F%2F%20static%20%E6%9C%89%E5%9C%B0%E5%9D%80%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%8F%96%E5%BC%95%E7%94%A8%0A%20%20%20%20println!(%22%E7%89%88%E6%9C%AC%E5%9C%B0%E5%9D%80%EF%BC%9A%7B%3Ap%7D%22%2C%20%26VERSION)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> PI</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 3.14</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">static</span><span style="color:#79B8FF"> VERSION</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "1.0"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // const 没有地址，无法取引用</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{:p}", &amp;PI);  // 编译错误！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // static 有地址，可以取引用</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"版本地址：{:p}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">VERSION</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

const 因为被编译期内联了，根本不存在于运行时，所以没有地址。而 static 在内存中有真实的地址，因此可以被取引用。

# 练习题

```rust
const PI: f64 = 3.14;
const RADIUS: i32 = 5;

fn main() {
    let area = PI * (RADIUS * RADIUS) as f64;
}
```

加载题目中…

```rust
static COUNT: i32 = 0;
static NAME: String = String::from("App");
```

加载题目中…

加载题目中…

## 编程练习

### 练习 1：定义应用配置常数

为一个应用定义所有的配置常数：

```rust
// TODO: 定义以下常数
// - API_HOST: &str = "https://api.example.com"
// - API_TIMEOUT: u64 = 30（秒）
// - MAX_RETRIES: u32 = 3
// - CACHE_ENABLED: bool = true
// - DEBUG: bool = false

fn main() {
    println!("应用配置：");
    println!("  API 主机：{}", API_HOST);
    println!("  超时时间：{} 秒", API_TIMEOUT);
    println!("  最大重试：{}", MAX_RETRIES);
    println!("  缓存：{}", if CACHE_ENABLED { "启用" } else { "禁用" });
    println!("  调试：{}", if DEBUG { "开启" } else { "关闭" });
}
```

### 练习 2：使用常数表达式

定义与时间相关的常数，并计算衍生常数：

```rust
const SECONDS_PER_MINUTE: u32 = 60;
const MINUTES_PER_HOUR: u32 = 60;
const HOURS_PER_DAY: u32 = 24;

// TODO: 定义衍生常数
// - SECONDS_PER_HOUR
// - SECONDS_PER_DAY
// - MINUTES_PER_DAY

fn main() {
    println!("时间单位换算：");
    println!("  每分钟秒数：{}", SECONDS_PER_MINUTE);
    println!("  每小时秒数：{}", SECONDS_PER_HOUR);
    println!("  每天秒数：{}", SECONDS_PER_DAY);
    println!("  每天分钟数：{}", MINUTES_PER_DAY);
}
```