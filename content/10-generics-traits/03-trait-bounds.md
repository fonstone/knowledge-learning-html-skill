# Trait 约束

## 不加约束的泛型什么都做不了

学完 trait 的定义，再回头看泛型就清晰多了。考虑这个函数：

<div class="code-runner" data-full-code="fn%20print_value%3CT%3E(val%3A%20T)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20val)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9AT%20%E4%B8%8D%E4%B8%80%E5%AE%9A%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_value</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val); </span><span style="color:#6A737D">// 错误：T 不一定实现了 Display</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_value</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val); </span><span style="color:#6A737D">// 错误：T 不一定实现了 Display</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

`T` 代表任意类型，“任意”意味着最大不确定性——编译器不知道 `T` 是否实现了 `Display`，是否支持 `+` 运算，还是什么能力都没有。

**约束（bounds）** 就是你对 `T` 做出的承诺：告诉编译器”这个 `T` 一定实现了某个 trait”。换来的是：编译器允许你在函数体内调用那个 trait 的方法。

反过来说也成立：**你没有声明的约束，对应的能力就不能用**。加减乘除也不例外——`+` 运算符背后是 `std::ops::Add` trait，`>` 比较是 `PartialOrd`，`==` 是 `PartialEq`。想用哪个运算符，就加哪个约束：

<div class="code-runner" data-full-code="use%20std%3A%3Aops%3A%3AAdd%3B%0A%0Afn%20double%3CT%3E(val%3A%20T)%20-%3E%20T%20%7B%0A%20%20%20%20val%20%2B%20val%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81T%20%E6%B2%A1%E6%9C%89%E5%A3%B0%E6%98%8E%20Add%20%E7%BA%A6%E6%9D%9F%EF%BC%8C%E4%B8%8D%E8%83%BD%E7%94%A8%20%2B%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ops</span><span style="color:#F97583">::</span><span style="color:#B392F0">Add</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    val </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> val  </span><span style="color:#6A737D">// 错误！T 没有声明 Add 约束，不能用 +</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ops</span><span style="color:#F97583">::</span><span style="color:#B392F0">Add</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    val </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> val  </span><span style="color:#6A737D">// 错误！T 没有声明 Add 约束，不能用 +</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

<div class="code-runner" data-full-code="use%20std%3A%3Aops%3A%3AAdd%3B%0A%0Afn%20double%3CT%3A%20Add%3COutput%20%3D%20T%3E%20%2B%20Copy%3E(val%3A%20T)%20-%3E%20T%20%7B%0A%20%20%20%20val%20%2B%20val%20%20%2F%2F%20%E5%90%88%E6%B3%95%EF%BC%9A%E5%A3%B0%E6%98%8E%E4%BA%86%20Add%20%E7%BA%A6%E6%9D%9F%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20double(5_i32))%3B%20%20%20%2F%2F%2010%0A%20%20%20%20println!(%22%7B%7D%22%2C%20double(1.5_f64))%3B%20%2F%2F%203%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ops</span><span style="color:#F97583">::</span><span style="color:#B392F0">Add</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Add</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">+</span><span style="color:#B392F0"> Copy</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    val </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> val  </span><span style="color:#6A737D">// 合法：声明了 Add 约束</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">double</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5_</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">double</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1.5_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 3</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这正是 Rust 约束系统的核心逻辑：**`T` 的能力由且仅由它的约束列表决定**，没有任何”隐式可用”的操作。

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Afn%20print_value%3CT%3A%20Display%3E(val%3A%20T)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20val)%3B%20%2F%2F%20%E5%90%88%E6%B3%95%EF%BC%9AT%20%E4%BF%9D%E8%AF%81%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20print_value(42)%3B%0A%20%20%20%20print_value(%22hello%22)%3B%0A%20%20%20%20print_value(3.14)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_value</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val); </span><span style="color:#6A737D">// 合法：T 保证实现了 Display</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    print_value</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    print_value</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    print_value</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3.14</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`T: Display` 的读法：**“T 必须实现 Display trait”**。

## 常见标准库 trait 约束

| 约束 | 含义 |
| --- | --- |
| `T: Display` | 可以用 `{}` 格式化 |
| `T: Debug` | 可以用 `{:?}` 格式化 |
| `T: Clone` | 可以 `.clone()` |
| `T: Copy` | 可以按位复制（隐式） |
| `T: PartialOrd` | 可以用 `>`、`<` 比较大小 |
| `T: PartialEq` | 可以用 `==`、`!=` 判断相等 |

## 约束在调用时检查

约束是双向的：定义时声明，调用时编译器验证。

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Afn%20show%3CT%3A%20Display%3E(val%3A%20T)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20val)%3B%0A%7D%0A%0Astruct%20Secret(i32)%3B%20%2F%2F%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Display%0A%0Afn%20main()%20%7B%0Ashow(Secret(42))%3B%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9ASecret%20%E4%B8%8D%E6%BB%A1%E8%B6%B3%20Display%20%E7%BA%A6%E6%9D%9F%0A%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> show</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Secret</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 没有实现 Display</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">show</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Secret</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 编译错误：Secret 不满足 Display 约束</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> show</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">&gt;(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Secret</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 没有实现 Display</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">show</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Secret</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 编译错误：Secret 不满足 Display 约束</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

> 约束失败永远是编译期错误，不会到运行时才暴露。

# 多重约束与 where 子句

## 多重约束：用 + 叠加

一个 `T` 可以同时有多个约束，用 `+` 连接：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3A%7BDebug%2C%20Display%7D%3B%0A%0Afn%20compare_and_print%3CT%3A%20Display%20%2B%20Debug%20%2B%20PartialOrd%3E(a%3A%20T%2C%20b%3A%20T)%20%7B%0A%20%20%20%20if%20a%20%3E%20b%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%E6%9B%B4%E5%A4%A7%EF%BC%88Debug%3A%20%7B%3A%3F%7D%EF%BC%89%22%2C%20a%2C%20a)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%E6%9B%B4%E5%A4%A7%EF%BC%88Debug%3A%20%7B%3A%3F%7D%EF%BC%89%22%2C%20b%2C%20b)%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20compare_and_print(10_i32%2C%2020)%3B%0A%20%20%20%20compare_and_print(%22banana%22%2C%20%22apple%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> compare_and_print</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> Debug</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">&gt;(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> b {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 更大（Debug: {:?}）"</span><span style="color:#E1E4E8">, a, a);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 更大（Debug: {:?}）"</span><span style="color:#E1E4E8">, b, b);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    compare_and_print</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10_</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    compare_and_print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"banana"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"apple"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## where 子句：让复杂签名可读

多个类型参数、多个约束堆在一起时，行内写法很难看：

```rust
// 难以阅读
fn process<T: Display + Debug + Clone + PartialOrd, U: Debug + Clone>(t: T, u: U) -> String {
    format!("{} {:?}", t, u)
}
```

`where` 子句让每个约束独立成行：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3A%7BDebug%2C%20Display%7D%3B%0A%0Afn%20process%3CT%2C%20U%3E(t%3A%20T%2C%20u%3A%20U)%20-%3E%20String%0Awhere%0A%20%20%20%20T%3A%20Display%20%2B%20Debug%20%2B%20Clone%20%2B%20PartialOrd%2C%0A%20%20%20%20U%3A%20Debug%20%2B%20Clone%2C%0A%7B%0A%20%20%20%20format!(%22%7B%7D%20%7B%3A%3F%7D%22%2C%20t%2C%20u)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20result%20%3D%20process(42_i32%2C%20vec!%5B1%2C%202%2C%203%5D)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> process</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">U</span><span style="color:#E1E4E8">&gt;(t</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">, u</span><span style="color:#F97583">:</span><span style="color:#B392F0"> U</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span></span>
<span class="line"><span style="color:#F97583">where</span></span>
<span class="line"><span style="color:#B392F0">    T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> Debug</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> Clone</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    U</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Debug</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> Clone</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#B392F0">    format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {:?}"</span><span style="color:#E1E4E8">, t, u)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> process</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42_</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

两种写法语义完全等价，`where` 只是更整洁的排版。推荐在类型参数有两个以上约束时使用。

## 在 impl 块中使用约束

约束不只能用在函数上，`impl` 块同样可以带约束，让某些方法只在满足约束时才存在：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Astruct%20Pair%3CT%3E%20%7B%0A%20%20%20%20first%3A%20T%2C%0A%20%20%20%20second%3A%20T%2C%0A%7D%0A%0Aimpl%3CT%3E%20Pair%3CT%3E%20%7B%0A%20%20%20%20fn%20new(first%3A%20T%2C%20second%3A%20T)%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Self%20%7B%20first%2C%20second%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%E5%8F%AA%E6%9C%89%20T%3A%20Display%20%2B%20PartialOrd%20%E7%9A%84%20Pair%20%E6%89%8D%E6%9C%89%E8%BF%99%E4%B8%AA%E6%96%B9%E6%B3%95%0Aimpl%3CT%3A%20Display%20%2B%20PartialOrd%3E%20Pair%3CT%3E%20%7B%0A%20%20%20%20fn%20cmp_display(%26self)%20%7B%0A%20%20%20%20%20%20%20%20if%20self.first%20%3E%3D%20self.second%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%80%BC%E6%98%AF%20%7B%7D%22%2C%20self.first)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%80%BC%E6%98%AF%20%7B%7D%22%2C%20self.second)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20pair%20%3D%20Pair%3A%3Anew(5%2C%2010)%3B%0A%20%20%20%20pair.cmp_display()%3B%20%2F%2F%20%E6%9C%80%E5%A4%A7%E5%80%BC%E6%98%AF%2010%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    first</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    second</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(first</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">, second</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        Self</span><span style="color:#E1E4E8"> { first, second }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 只有 T: Display + PartialOrd 的 Pair 才有这个方法</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">Pair</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> cmp_display</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">first </span><span style="color:#F97583">&gt;=</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">second {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大值是 {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">first);</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大值是 {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">second);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> pair </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Pair</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    pair</span><span style="color:#F97583">.</span><span style="color:#B392F0">cmp_display</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 最大值是 10</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# impl Trait：另一种约束写法

`impl Trait` 是专门用在**函数签名**里的语法，不能用在结构体字段、变量类型标注等地方。它有两种位置，行为不同：

## 参数位置：泛型的语法糖

在参数位置，`impl Trait` 和泛型约束完全等价——选哪个只是风格问题：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Afn%20notify_generic%3CT%3A%20Display%3E(item%3A%20%26T)%20%7B%20%20%20%2F%2F%20%E6%B3%9B%E5%9E%8B%E5%86%99%E6%B3%95%0A%20%20%20%20println!(%22%E9%80%9A%E7%9F%A5%EF%BC%9A%7B%7D%22%2C%20item)%3B%0A%7D%0A%0Afn%20notify_impl(item%3A%20%26impl%20Display)%20%7B%20%20%20%20%20%20%20%20%2F%2F%20impl%20Trait%20%E5%86%99%E6%B3%95%EF%BC%8C%E6%95%88%E6%9E%9C%E4%B8%80%E6%A0%B7%0A%20%20%20%20println!(%22%E9%80%9A%E7%9F%A5%EF%BC%9A%7B%7D%22%2C%20item)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20notify_generic(%2642)%3B%0A%20%20%20%20notify_impl(%26%22hello%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> notify_generic</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">&gt;(item</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">) {   </span><span style="color:#6A737D">// 泛型写法</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"通知：{}"</span><span style="color:#E1E4E8">, item);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> notify_impl</span><span style="color:#E1E4E8">(item</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;impl</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">) {        </span><span style="color:#6A737D">// impl Trait 写法，效果一样</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"通知：{}"</span><span style="color:#E1E4E8">, item);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    notify_generic</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    notify_impl</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但有一种情况只能用泛型：当**两个参数必须是同一类型**时：

<div class="code-runner" data-full-code="%2F%2F%20%E2%9D%8C%20%E8%BF%99%E6%A0%B7%E5%86%99%20a%20%E5%92%8C%20b%20%E5%8F%AF%E4%BB%A5%E6%98%AF%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%EF%BC%8C%E6%97%A0%E6%B3%95%E7%BA%A6%E6%9D%9F%E5%AE%83%E4%BB%AC%E7%9B%B8%E5%90%8C%0Afn%20max_value(a%3A%20impl%20PartialOrd%2C%20b%3A%20impl%20PartialOrd)%20-%3E%20bool%20%7B%0A%20%20%20%20a%20%3E%20b%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E4%B8%8D%E5%90%8C%20impl%20Trait%20%E5%8F%82%E6%95%B0%E4%B8%8D%E8%83%BD%E4%BA%92%E7%9B%B8%E6%AF%94%E8%BE%83%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// ❌ 这样写 a 和 b 可以是不同类型，无法约束它们相同</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> max_value</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> b  </span><span style="color:#6A737D">// 错误：不同 impl Trait 参数不能互相比较</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#6A737D">// ❌ 这样写 a 和 b 可以是不同类型，无法约束它们相同</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> max_value</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> b  </span><span style="color:#6A737D">// 错误：不同 impl Trait 参数不能互相比较</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

<div class="code-runner" data-full-code="%2F%2F%20%E2%9C%85%20%E7%94%A8%E6%B3%9B%E5%9E%8B%E6%98%8E%E7%A1%AE%E4%B8%A4%E4%B8%AA%E5%8F%82%E6%95%B0%E5%BF%85%E9%A1%BB%E6%98%AF%E5%90%8C%E4%B8%80%E7%B1%BB%E5%9E%8B%20T%0Afn%20max_value%3CT%3A%20PartialOrd%3E(a%3A%20T%2C%20b%3A%20T)%20-%3E%20bool%20%7B%0A%20%20%20%20a%20%3E%20b%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20max_value(3%2C%205))%3B%20%20%20%20%20%20%20%20%2F%2F%20false%0A%20%20%20%20println!(%22%7B%7D%22%2C%20max_value(%22b%22%2C%20%22a%22))%3B%20%20%20%20%2F%2F%20true%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// ✅ 用泛型明确两个参数必须是同一类型 T</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> max_value</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> PartialOrd</span><span style="color:#E1E4E8">&gt;(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> b</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">max_value</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));        </span><span style="color:#6A737D">// false</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">max_value</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">));    </span><span style="color:#6A737D">// true</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 返回值位置：隐藏具体类型

在返回值位置，`impl Trait` 是独立功能，不只是语法糖。它让你隐藏返回的具体类型：

<div class="code-runner" data-full-code="fn%20make_greeting(name%3A%20%26str)%20-%3E%20impl%20std%3A%3Afmt%3A%3ADisplay%20%7B%0A%20%20%20%20format!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20name)%20%20%2F%2F%20%E5%AE%9E%E9%99%85%E8%BF%94%E5%9B%9E%20String%EF%BC%8C%E4%BD%86%E8%B0%83%E7%94%A8%E6%96%B9%E7%9C%8B%E4%B8%8D%E5%88%B0%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20g%20%3D%20make_greeting(%22%E5%B0%8F%E6%98%8E%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20g)%3B%20%20%2F%2F%20%E5%8F%AA%E8%83%BD%E5%BD%93%20Display%20%E7%94%A8%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%BD%93%20String%20%E7%94%A8%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_greeting</span><span style="color:#E1E4E8">(name</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，{}！"</span><span style="color:#E1E4E8">, name)  </span><span style="color:#6A737D">// 实际返回 String，但调用方看不到</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> g </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_greeting</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"小明"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, g);  </span><span style="color:#6A737D">// 只能当 Display 用，不能当 String 用</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这在返回**闭包**或**迭代器链**时几乎是必须的——这类类型要么无法手写，要么写出来极其冗长：

<div class="code-runner" data-full-code="%2F%2F%20%E9%97%AD%E5%8C%85%E7%B1%BB%E5%9E%8B%E6%97%A0%E6%B3%95%E6%89%8B%E5%86%99%EF%BC%8C%E5%8F%AA%E8%83%BD%E7%94%A8%20impl%20Fn%0Afn%20make_adder(n%3A%20i32)%20-%3E%20impl%20Fn(i32)%20-%3E%20i32%20%7B%0A%20%20%20%20move%20%7Cx%7C%20x%20%2B%20n%0A%7D%0A%0A%2F%2F%20%E8%BF%AD%E4%BB%A3%E5%99%A8%E9%93%BE%E7%9A%84%E5%AE%9E%E9%99%85%E7%B1%BB%E5%9E%8B%E6%98%AF%20Map%3CFilter%3C...%3E%3E%EF%BC%8C%E7%94%A8%20impl%20Iterator%20%E9%9A%90%E8%97%8F%0Afn%20even_squares(v%3A%20Vec%3Ci32%3E)%20-%3E%20impl%20Iterator%3CItem%20%3D%20i32%3E%20%7B%0A%20%20%20%20v.into_iter().filter(%7Cx%7C%20x%20%25%202%20%3D%3D%200).map(%7Cx%7C%20x%20*%20x)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20add5%20%3D%20make_adder(5)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add5(3))%3B%20%20%2F%2F%208%0A%0A%20%20%20%20let%20result%3A%20Vec%3Ci32%3E%20%3D%20even_squares(vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D).collect()%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20result)%3B%20%2F%2F%20%5B4%2C%2016%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 闭包类型无法手写，只能用 impl Fn</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    move</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> n</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 迭代器链的实际类型是 Map&lt;Filter&lt;...&gt;&gt;，用 impl Iterator 隐藏</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> even_squares</span><span style="color:#E1E4E8">(v</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Iterator</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Item</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">into_iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> x)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add5 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add5</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> even_squares</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">])</span><span style="color:#F97583">.</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, result); </span><span style="color:#6A737D">// [4, 16]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `impl Trait` 只能用在函数签名里（参数和返回值），不能用在结构体字段或变量类型标注。需要在这些地方存储”实现了某 trait 的任意类型”时，要用 `Box<dyn Trait>`（动态分发）。

# 练习题

## Trait 约束测验

加载题目中…

```rust
use std::fmt::Display;

fn print_pair<T>(a: T, b: T)
where
    T: Display + PartialOrd,
{
    if a > b {
        println!("{} > {}", a, b);
    } else {
        println!("{} <= {}", a, b);
    }
}
```

加载题目中…

加载题目中…

## impl Trait 测验

加载题目中…

## 编程练习

下面的 `largest` 函数有编译错误，请添加正确的约束使其能够编译运行。只添加必要的约束，不多加。

```rust
fn largest<T>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("最大整数: {}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("最大字符: {}", largest(&chars));
}
```