# 为什么 Rust 没有 null

很多编程语言（Java、C、JavaScript）都有 `null` 值，表示”没有值”。这听起来合理，但 Tony Hoare（`null` 的发明者）后来称之为 **“十亿美元的错误”**，因为 `null` 导致的 bug 无穷无尽：

- 忘记检查 null ，程序崩溃（“Null Pointer Exception”）
- 在不该是 null 的地方突然变成 null
- 很难区分”正常的空值”和”未初始化”

Rust 的解决方案是：**没有 `null`，用 `Option<T>` 枚举代替**。

这强制你在编译期就必须处理”可能没有值”的情况。

# Option<T> 的定义

`Option<T>` 是标准库中的一个枚举：

```rust
enum Option<T> {
    Some(T),
    None,
}
```

它很简单：

- Some(T) — 表示有值
- None — 表示没有值

`<T>` 是一个**泛型参数**（后续会详细讲），现在只需知道它表示”任何类型”。

## 使用 Option

`Option<T>` 在 **prelude** 中，无需导入前缀就能用 `Some` 和 `None`：

> **什么是 prelude？** Rust 标准库中有一个 prelude（前奏）模块，包含最常用的类型和函数。每个 Rust 程序都会自动导入 prelude 中的内容，所以你可以直接使用 `Some`、`None`、`Option` 等，而不需要写完整的路径如 `std::option::Some`。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20some_number%3A%20Option%3Ci32%3E%20%3D%20Some(5)%3B%0A%20%20%20%20let%20none_number%3A%20Option%3Ci32%3E%20%3D%20None%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20some_number)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20none_number)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> some_number</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> none_number</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> None</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, some_number);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, none_number);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

当有 `None` 时，必须指定类型，因为编译器无法推断。

## 为什么这比 null 安全

假如 Rust 有 `null`：

```rust
let x: i32 = null;     // x 可能是 null
println!("{}", x + 1); // 崩溃！
```

用 `Option<T>`：

<div class="code-runner" data-full-code="let%20x%3A%20Option%3Ci32%3E%20%3D%20None%3B%0Aprintln!(%22%7B%7D%22%2C%20x%20%2B%201)%3B%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81Option%3Ci32%3E%20%E4%B8%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%E5%92%8C%20i32%20%E7%9B%B8%E5%8A%A0" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> None</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 编译错误！Option&lt;i32&gt; 不能直接和 i32 相加</span></span></code></pre></div>

你**必须** 先处理 `Option` 的两种情况。

# 提取 Option 中的值

## 方法一：match 表达式（最常见）

用 `match` 分别处理 `Some` 和 `None`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20maybe_age%3A%20Option%3Cu32%3E%20%3D%20Some(25)%3B%0A%0A%20%20%20%20match%20maybe_age%20%7B%0A%20%20%20%20%20%20%20%20Some(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%E6%98%AF%20%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%E6%9C%AA%E7%9F%A5%22)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> maybe_age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">25</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> maybe_age {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄是 {}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄未知"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Some(age)` 会绑定内部的值，可以在分支中使用。

## 方法二：if let 表达式（只关心 Some 的情况）

如果只想处理 `Some` 的情况，`if let` 更简洁：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20favorite_color%3A%20Option%3C%26str%3E%20%3D%20Some(%22%E8%93%9D%E8%89%B2%22)%3B%0A%0A%20%20%20%20if%20let%20Some(color)%20%3D%20favorite_color%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%A0%E6%9C%80%E5%96%9C%E6%AC%A2%E7%9A%84%E9%A2%9C%E8%89%B2%E6%98%AF%20%7B%7D%22%2C%20color)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> favorite_color</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"蓝色"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(color) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> favorite_color {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你最喜欢的颜色是 {}"</span><span style="color:#E1E4E8">, color);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

（`if let` 会在后续详细讲）

## 方法三：Option 的方法

`Option<T>` 提供了许多方便的方法（这里先了解，后续会深入）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%20Some(5)%3B%0A%0A%20%20%20%20%2F%2F%20unwrap()%EF%BC%9A%E5%A6%82%E6%9E%9C%E6%98%AF%20Some%EF%BC%8C%E8%BF%94%E5%9B%9E%E5%86%85%E9%83%A8%E5%80%BC%EF%BC%9B%E5%A6%82%E6%9E%9C%E6%98%AF%20None%EF%BC%8Cpanic%0A%20%20%20%20let%20value%20%3D%20x.unwrap()%3B%0A%20%20%20%20println!(%22%E5%80%BC%E6%98%AF%20%7B%7D%22%2C%20value)%3B%0A%0A%20%20%20%20%2F%2F%20unwrap_or()%EF%BC%9A%E5%A6%82%E6%9E%9C%E6%98%AF%20Some%EF%BC%8C%E8%BF%94%E5%9B%9E%E5%86%85%E9%83%A8%E5%80%BC%EF%BC%9B%E5%A6%82%E6%9E%9C%E6%98%AF%20None%EF%BC%8C%E8%BF%94%E5%9B%9E%E9%BB%98%E8%AE%A4%E5%80%BC%0A%20%20%20%20let%20y%3A%20Option%3Ci32%3E%20%3D%20None%3B%0A%20%20%20%20let%20value%20%3D%20y.unwrap_or(0)%3B%0A%20%20%20%20println!(%22%E5%80%BC%E6%98%AF%20%7B%7D%22%2C%20value)%3B%0A%0A%20%20%20%20%2F%2F%20is_some()%E3%80%81is_none()%EF%BC%9A%E6%A3%80%E6%9F%A5%E6%98%AF%20Some%20%E8%BF%98%E6%98%AF%20None%0A%20%20%20%20let%20z%20%3D%20Some(10)%3B%0A%20%20%20%20if%20z.is_some()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22z%20%E6%9C%89%E5%80%BC%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // unwrap()：如果是 Some，返回内部值；如果是 None，panic</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"值是 {}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // unwrap_or()：如果是 Some，返回内部值；如果是 None，返回默认值</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> None</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap_or</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"值是 {}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // is_some()、is_none()：检查是 Some 还是 None</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> z </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> z</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_some</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"z 有值"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **警告**：`unwrap()` 如果碰到 `None` 会 panic。在不确定的情况下，用 `match` 或 `if let` 更安全。

# 练习题

```rust
fn get_age(name: &str) -> Option<u32> {
    match name {
        "Alice" => Some(30),
        "Bob" => Some(25),
        _ => None,
    }
}
```

加载题目中…

```rust
let x: Option<i32> = Some(5);
let y = x.unwrap();
```

加载题目中…

加载题目中…

## 编程练习

### 练习 1：返回 Option 的函数

实现一个函数 `first_word_length()`，返回字符串中第一个单词的长度。如果字符串为空或只有空白，返回 None：

```rust
fn first_word_length(s: &str) -> Option<usize> {
    // TODO: 实现函数
    // 提示：trim() 可以去掉空白，split_whitespace() 可以按空白分割
}

fn main() {
    println!("{:?}", first_word_length("hello world"));      // Some(5)
    println!("{:?}", first_word_length("  "));               // None
    println!("{:?}", first_word_length(""));                 // None
    println!("{:?}", first_word_length("single"));           // Some(6)
}
```

### 练习 2：安全地处理 Option

实现一个函数 `divide()`，返回除法结果的 Option。只有当除数不为 0 时才返回 Some，否则返回 None：

```rust
fn divide(dividend: f64, divisor: f64) -> Option<f64> {
    // TODO: 实现函数
}

fn main() {
    match divide(10.0, 2.0) {
        Some(result) => println!("10 ÷ 2 = {}", result),
        None => println!("无法除以 0"),
    }

    match divide(10.0, 0.0) {
        Some(result) => println!("10 ÷ 0 = {}", result),
        None => println!("无法除以 0"),
    }
}
```