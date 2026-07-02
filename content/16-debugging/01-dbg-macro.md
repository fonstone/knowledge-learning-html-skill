# 认识 dbg!

`dbg!` 是 Rust 标准库内置的调试宏。和 `println!` 比起来，它有两大优势：

1. 自动打印文件名、行号、表达式文本和值 ，不需要手写格式字符串
1. 返回表达式的值 ，可以嵌套在任意表达式中而不破坏逻辑

一句话记忆：`dbg!` 就像给表达式加了个”临时监控探针”，随插随拔。

## 基本用法

最简单的用法：把变量或表达式传给 `dbg!`。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%20*%202%3B%0A%0A%20%20%20%20dbg!(x)%3B%20%20%20%20%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%20x%20%E7%9A%84%E5%80%BC%0A%20%20%20%20dbg!(y%20%2B%201)%3B%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E5%80%BC%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">(x);       </span><span style="color:#6A737D">// 打印 x 的值</span></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">(y </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// 打印表达式的值</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

输出结果：

```text
[src/main.rs:4] x = 5
[src/main.rs:5] y + 1 = 11
```

注意输出格式：`[文件名:行号] 表达式 = 值`。这比 `println!("x = {}", x)` 少打很多字，而且**行号是自动的**，不需要你记住在哪一行插的调试语句。

## dbg! 会返回值

这是 `dbg!` 最独特的特性：它不是吞掉值，而是**把值的所有权返回出来**。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20dbg!%20%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E6%89%80%E4%BB%A5%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E5%9C%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F%E9%87%8C%E7%94%A8%0A%20%20%20%20let%20x%20%3D%20dbg!(5%20*%203)%20%2B%201%3B%20%20%2F%2F%20%E5%85%88%E6%89%93%E5%8D%B0%20%225%20*%203%20%3D%2015%22%EF%BC%8C%E5%86%8D%E7%94%A8%E8%BF%94%E5%9B%9E%E5%80%BC%2015%20%E5%8A%A0%201%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%20%20%20%20%20%2F%2F%20x%20%3D%2016%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // dbg! 返回值，所以可以直接在表达式里用</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#B392F0"> dbg!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 先打印 "5 * 3 = 15"，再用返回值 15 加 1</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, x);     </span><span style="color:#6A737D">// x = 16</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这意味着你可以把 `dbg!` 插入计算链的中间，不改变程序逻辑：

<div class="code-runner" data-full-code="fn%20double(n%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20n%20*%202%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8E%9F%E6%9D%A5%E7%9A%84%E4%BB%A3%E7%A0%81%3A%20let%20result%20%3D%20double(double(3))%3B%0A%20%20%20%20%2F%2F%20%E5%8A%A0%E5%85%A5%E8%B0%83%E8%AF%95%3A%20%E6%9F%A5%E7%9C%8B%E4%B8%AD%E9%97%B4%E7%BB%93%E6%9E%9C%0A%20%20%20%20let%20result%20%3D%20double(dbg!(double(3)))%3B%0A%20%20%20%20println!(%22result%20%3D%20%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    n </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 原来的代码: let result = double(double(3));</span></span>
<span class="line"><span style="color:#6A737D">    // 加入调试: 查看中间结果</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">dbg!</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">double</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">)));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"result = {}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

输出：

```text
[src/main.rs:8] double(3) = 6
result = 12
```

## 和 println! 的对比

| 特性 | `println!` | `dbg!` |
| --- | --- | --- |
| 需要格式字符串 | ✓ | ✗（自动） |
| 打印行号 | ✗（手动写） | ✓（自动） |
| 打印表达式文本 | ✗ | ✓（自动） |
| 返回值 | ✗（返回 `()`） | ✓（返回原值） |
| 输出到 | stdout | **stderr** |
| 需要 `Display` | ✓ | ✗（只需 `Debug`） |

> **输出到 stderr**：`dbg!` 的输出走 stderr，而 `println!` 走 stdout。这样在重定向程序输出时（`./app > output.txt`），调试信息不会混入结果文件里。

## 需要 Debug trait

`dbg!` 内部使用 `{:?}` 格式化，因此类型必须实现 `Debug` trait。基本类型、标准库类型都已实现。自定义类型加上 `#[derive(Debug)]` 即可：

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%20%20%2F%2F%20%E5%BF%85%E9%A1%BB%E5%8A%A0%E8%BF%99%E4%B8%AA%EF%BC%8C%E5%90%A6%E5%88%99%20dbg!%20%E6%8A%A5%E9%94%99%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%201.0%2C%20y%3A%202.5%20%7D%3B%0A%20%20%20%20dbg!(%26p)%3B%20%20%2F%2F%20%E5%80%9F%E7%94%A8%EF%BC%8C%E9%81%BF%E5%85%8D%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]  </span><span style="color:#6A737D">// 必须加这个，否则 dbg! 报错</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2.5</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">p);  </span><span style="color:#6A737D">// 借用，避免所有权转移</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

输出：

```text
[src/main.rs:10] &p = Point {
    x: 1.0,
    y: 2.5,
}
```

注意这里传的是 `&p`（引用）而不是 `p`。如果传 `p`，`dbg!` 会取得所有权并返回，后续就不能用 `p` 了。

# 实战技巧

## 同时调试多个值

`dbg!` 支持多个参数，一次打印多个表达式：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%2010%3B%0A%20%20%20%20let%20b%20%3D%2020%3B%0A%20%20%20%20let%20c%20%3D%20a%20%2B%20b%3B%0A%0A%20%20%20%20dbg!(a%2C%20b%2C%20c)%3B%20%20%2F%2F%20%E4%B8%89%E4%B8%AA%E5%80%BC%E4%B8%80%E8%B5%B7%E6%89%93%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 20</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">(a, b, c);  </span><span style="color:#6A737D">// 三个值一起打</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

输出：

```text
[src/main.rs:6] a = 10
[src/main.rs:6] b = 20
[src/main.rs:6] c = 30
```

## 在循环中调试

在循环体里用 `dbg!` 可以追踪每次迭代的中间状态：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20sum%20%3D%200%3B%0A%20%20%20%20for%20i%20in%201..%3D5%20%7B%0A%20%20%20%20%20%20%20%20sum%20%2B%3D%20i%3B%0A%20%20%20%20%20%20%20%20dbg!(i%2C%20sum)%3B%20%20%2F%2F%20%E8%BF%BD%E8%B8%AA%E6%AF%8F%E8%BD%AE%20i%20%E5%92%8C%E7%B4%AF%E5%8A%A0%E7%BB%93%E6%9E%9C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        sum </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> i;</span></span>
<span class="line"><span style="color:#B392F0">        dbg!</span><span style="color:#E1E4E8">(i, sum);  </span><span style="color:#6A737D">// 追踪每轮 i 和累加结果</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 在 if/match 条件中调试

有时你想知道某个条件判断里的值是什么，`dbg!` 可以不破坏条件逻辑地插入：

<div class="code-runner" data-full-code="fn%20classify(n%3A%20i32)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20if%20dbg!(n)%20%3E%200%20%7B%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%20n%EF%BC%8C%E5%B9%B6%E6%8A%8A%20n%20%E7%9A%84%E5%80%BC%E8%BF%94%E5%9B%9E%E7%BB%99%20if%20%E4%BD%BF%E7%94%A8%0A%20%20%20%20%20%20%20%20%22%E6%AD%A3%E6%95%B0%22%0A%20%20%20%20%7D%20else%20if%20n%20%3C%200%20%7B%0A%20%20%20%20%20%20%20%20%22%E8%B4%9F%E6%95%B0%22%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%22%E9%9B%B6%22%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify(42))%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify(-5))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> classify</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#B392F0"> dbg!</span><span style="color:#E1E4E8">(n) </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {   </span><span style="color:#6A737D">// 打印 n，并把 n 的值返回给 if 使用</span></span>
<span class="line"><span style="color:#9ECBFF">        "正数"</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "负数"</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "零"</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">-</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## release 模式下的行为

`dbg!` 在 **release 模式**（`cargo build --release`）下仍然会输出，不会自动消除。

如果想让调试代码只在开发时生效，有两种方式：

**方式一：手动删除**（最简单，调试完就清理）

**方式二：使用条件编译**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E5%9C%A8%20debug%20%E6%A8%A1%E5%BC%8F%E4%B8%8B%E6%89%A7%E8%A1%8C%0A%20%20%20%20%23%5Bcfg(debug_assertions)%5D%0A%20%20%20%20dbg!(x)%3B%0A%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只在 debug 模式下执行</span></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(debug_assertions)]</span></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">(x);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **最佳实践**：`dbg!` 是临时调试工具，调试完成后应该**删掉**，不要提交到版本库。把它当便利贴用，用完撕掉。

## 无参数用法

`dbg!()` 不传参数时，只打印文件名和行号——相当于一个”我执行到这里了”的标记：

<div class="code-runner" data-full-code="fn%20process(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20dbg!()%3B%20%20%2F%2F%20%E7%A1%AE%E8%AE%A4%E5%87%BD%E6%95%B0%E8%A2%AB%E8%B0%83%E7%94%A8%E4%BA%86%0A%20%20%20%20if%20x%20%3E%200%20%7B%0A%20%20%20%20%20%20%20%20dbg!()%3B%20%20%2F%2F%20%E7%A1%AE%E8%AE%A4%E8%B5%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E5%88%86%E6%94%AF%0A%20%20%20%20%20%20%20%20x%20*%202%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20x%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20process(5)%3B%0A%20%20%20%20process(-1)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> process</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    dbg!</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 确认函数被调用了</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        dbg!</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 确认走了这个分支</span></span>
<span class="line"><span style="color:#E1E4E8">        x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        x</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    process</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    process</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">-</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## dbg! 基础测验

```rust
fn square(n: i32) -> i32 {
    n * n
}

fn main() {
    let result = square(dbg!(3 + 1));
    println!("{}", result);
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…