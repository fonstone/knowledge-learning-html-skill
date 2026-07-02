# 类型别名与 newtype

## 类型别名：给长类型起个短名字

有些类型写起来非常冗长，比如 `Box<dyn Fn(i32, i32) -> Result<i32, String>>`。
每次都要完整写出这一串既费时又容易出错。**类型别名**（type alias）让你给现有类型起个简短的名字：

<div class="code-runner" data-full-code="type%20MathOp%20%3D%20Box%3Cdyn%20Fn(i32%2C%20i32)%20-%3E%20i32%3E%3B%0A%0Afn%20make_adder()%20-%3E%20MathOp%20%7B%0A%20%20%20%20Box%3A%3Anew(%7Ca%2C%20b%7C%20a%20%2B%20b)%0A%7D%0A%0Afn%20make_multiplier()%20-%3E%20MathOp%20%7B%0A%20%20%20%20Box%3A%3Anew(%7Ca%2C%20b%7C%20a%20*%20b)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20add%20%3D%20make_adder()%3B%0A%20%20%20%20let%20mul%20%3D%20make_multiplier()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add(3%2C%204))%3B%20%2F%2F%207%0A%20%20%20%20println!(%22%7B%7D%22%2C%20mul(3%2C%204))%3B%20%2F%2F%2012%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> MathOp</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> MathOp</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">a, b</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_multiplier</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> MathOp</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">a, b</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> b)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> mul </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_multiplier</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 7</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">mul</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 12</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

语法很简单：`type 新名字 = 原类型;`

> **注意**：类型别名**不创建新类型**，只是名字替换。`MathOp` 和原来那一大串完全等价，编译器不会因为名字不同就阻止你混用它们。

## newtype 模式：创建真正有区别的类型

类型别名的”不创建新类型”有时候是问题。来看一个真实的反例：

1998 年，NASA 的火星气候轨道飞船坠毁。原因是一个软件团队用**英磅·秒**，另一个团队期望**牛顿·秒**，两者都是 `f64`，编译器完全不知道这是两种不同的量，放任了混用。

**newtype 模式**解决这个问题——用只有一个字段的元组结构体包装原类型，创建一个真正独立的新类型：

<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%20%20%20%20%20%20%2F%2F%20%E7%B1%B3%0Astruct%20Kilograms(f64)%3B%20%20%20%2F%2F%20%E5%8D%83%E5%85%8B%0A%0Afn%20report_weight(kg%3A%20Kilograms)%20%7B%0A%20%20%20%20println!(%22%E9%87%8D%E9%87%8F%EF%BC%9A%7B%3A.1%7D%20%E5%8D%83%E5%85%8B%22%2C%20kg.0)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20distance%20%3D%20Meters(1000.0)%3B%0A%20%20%20%20let%20weight%20%3D%20Kilograms(75.0)%3B%0A%0A%20%20%20%20report_weight(weight)%3B%20%20%20%20%20%2F%2F%20%E2%9C%85%0A%20%20%20%20report_weight(distance)%3B%20%20%20%2F%2F%20%E2%9D%8C%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81Meters%20%E4%B8%8D%E6%98%AF%20Kilograms%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);      </span><span style="color:#6A737D">// 米</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Kilograms</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// 千克</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> report_weight</span><span style="color:#E1E4E8">(kg</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Kilograms</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"重量：{:.1} 千克"</span><span style="color:#E1E4E8">, kg</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> distance </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1000.0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> weight </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Kilograms</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">75.0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    report_weight</span><span style="color:#E1E4E8">(weight);     </span><span style="color:#6A737D">// ✅</span></span>
<span class="line"><span style="color:#B392F0">    report_weight</span><span style="color:#E1E4E8">(distance);   </span><span style="color:#6A737D">// ❌ 编译错误！Meters 不是 Kilograms</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Meters` 和 `Kilograms` 内部都是 `f64`，但编译器把它们当成完全不同的类型，不允许互换传递。

**访问内部值**用 `.0`，或者模式解构：

<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20d%20%3D%20Meters(1500.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F1%EF%BC%9A%E5%AD%97%E6%AE%B5%E8%AE%BF%E9%97%AE%0A%20%20%20%20println!(%22%E8%B7%9D%E7%A6%BB%EF%BC%9A%7B%3A.1%7D%20%E7%B1%B3%22%2C%20d.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F2%EF%BC%9A%E8%A7%A3%E6%9E%84%0A%20%20%20%20let%20Meters(value)%20%3D%20d%3B%0A%20%20%20%20println!(%22%E8%B7%9D%E7%A6%BB%EF%BC%9A%7B%3A.1%7D%20%E7%B1%B3%22%2C%20value)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> d </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1500.0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 方式1：字段访问</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"距离：{:.1} 米"</span><span style="color:#E1E4E8">, d</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 方式2：解构</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> d;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"距离：{:.1} 米"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## newtype 的另一个用途：绕过孤儿规则

Rust 有一条”孤儿规则”：你不能为**外部类型**实现**外部 trait**。

比如，你不能直接为标准库的 `Vec<i32>` 实现标准库的 `fmt::Display`——`Vec` 和 `Display` 都属于标准库，不属于你的代码。

但用 newtype 包装后，这个包装类型属于你，就可以自由实现任何 trait 了：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20MyVec(Vec%3Ci32%3E)%3B%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20MyVec%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%5B%22)%3F%3B%0A%20%20%20%20%20%20%20%20for%20(i%2C%20val)%20in%20self.0.iter().enumerate()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20i%20%3E%200%20%7B%20write!(f%2C%20%22%2C%20%22)%3F%3B%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%7D%22%2C%20val)%3F%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%5D%22)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20MyVec(vec!%5B10%2C%2020%2C%2030%2C%2040%5D)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20v)%3B%20%2F%2F%20%5B10%2C%2020%2C%2030%2C%2040%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> MyVec</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> MyVec</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"["</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> (i, val) </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">enumerate</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">", "</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#B392F0">            write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"]"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> MyVec</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">40</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// [10, 20, 30, 40]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# Never 类型与动态大小类型

## Never 类型（`!`）：永不返回的函数

Rust 有一个特殊类型叫 **Never 类型**，写作 `!`，意思是”这个表达式**永远不会产生值**”。

哪些情况会有 `!` 类型？

| 情况 | 原因 |
| --- | --- |
| `panic!("...")` | 直接终止程序，没有返回 |
| `loop { }` | 无限循环，永远不会到达循环后面的代码 |
| `std::process::exit(0)` | 退出进程 |
| `continue` / `break`（不带值） | 跳出当前上下文，不产生值 |

声明一个返回 `!` 的函数：

<div class="code-runner" data-full-code="fn%20fail(msg%3A%20%26str)%20-%3E%20!%20%7B%0A%20%20%20%20panic!(%22%E4%B8%A5%E9%87%8D%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20msg)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20if%20%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%88%86%E6%94%AF%EF%BC%9A%E4%B8%80%E4%B8%AA%E8%BF%94%E5%9B%9E%20i32%EF%BC%8C%E4%B8%80%E4%B8%AA%E8%B0%83%E7%94%A8%E8%BF%94%E5%9B%9E%20!%20%E7%9A%84%E5%87%BD%E6%95%B0%0A%20%20%20%20%2F%2F%20!%20%E5%92%8C%E4%BB%BB%E4%BD%95%E7%B1%BB%E5%9E%8B%E9%83%BD%E5%85%BC%E5%AE%B9%EF%BC%8C%E6%89%80%E4%BB%A5%E7%BC%96%E8%AF%91%E5%99%A8%E6%8E%A5%E5%8F%97%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%0A%20%20%20%20let%20x%3A%20i32%20%3D%20if%20true%20%7B%2042%20%7D%20else%20%7B%20fail(%22%E4%B8%8D%E8%AF%A5%E5%88%B0%E8%BF%99%E9%87%8C%22)%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> fail</span><span style="color:#E1E4E8">(msg</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"严重错误：{}"</span><span style="color:#E1E4E8">, msg);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // if 的两个分支：一个返回 i32，一个调用返回 ! 的函数</span></span>
<span class="line"><span style="color:#6A737D">    // ! 和任何类型都兼容，所以编译器接受这段代码</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> if</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">fail</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"不该到这里"</span><span style="color:#E1E4E8">) };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`!` 类型的最大用处：它和**任何类型都兼容**。

来看一个具体场景——`match` 的每个分支必须返回相同类型，但有了 `!`，`panic!` 的分支可以和任何类型的分支搭配：

<div class="code-runner" data-full-code="fn%20positive_only(n%3A%20i32)%20-%3E%20u32%20%7B%0A%20%20%20%20match%20n%20%3E%3D%200%20%7B%0A%20%20%20%20%20%20%20%20true%20%20%3D%3E%20n%20as%20u32%2C%0A%20%20%20%20%20%20%20%20false%20%3D%3E%20panic!(%22%E9%9C%80%E8%A6%81%E9%9D%9E%E8%B4%9F%E6%95%B0%EF%BC%8C%E5%BE%97%E5%88%B0%E4%BA%86%20%7B%7D%22%2C%20n)%2C%0A%20%20%20%20%20%20%20%20%2F%2F%20%20%20%20%20%20%20%20%5E%5E%5E%5E%5E%20%E7%B1%BB%E5%9E%8B%E6%98%AF%20!%EF%BC%8C%E5%85%BC%E5%AE%B9%E4%B8%8A%E9%9D%A2%E7%9A%84%20u32%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20positive_only(5))%3B%20%20%2F%2F%205%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> positive_only</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">&gt;=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        true</span><span style="color:#F97583">  =&gt;</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        false</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"需要非负数，得到了 {}"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#6A737D">        //        ^^^^^ 类型是 !，兼容上面的 u32</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">positive_only</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`break` 也是 `!` 类型，所以可以把 `loop` 当表达式用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%0A%20%20%20%20let%20result%20%3D%20loop%20%7B%0A%20%20%20%20%20%20%20%20count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20if%20count%20%3D%3D%205%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20break%20count%20*%202%3B%20%2F%2F%20break%20%E6%8A%8A%E5%80%BC%E4%BC%A0%E5%87%BA%20loop%EF%BC%8C%E6%95%B4%E4%B8%AA%20loop%20%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E5%80%BC%E6%98%AF%2010%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%E7%BB%93%E6%9E%9C%EF%BC%9A%7B%7D%22%2C%20result)%3B%20%2F%2F%20%E7%BB%93%E6%9E%9C%EF%BC%9A10%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#F97583"> loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            break</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// break 把值传出 loop，整个 loop 表达式的值是 10</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果：{}"</span><span style="color:#E1E4E8">, result); </span><span style="color:#6A737D">// 结果：10</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 动态大小类型（DST）

讲完了永不产生值的 `!` 类型，再来看另一类特殊情况：有些类型的大小在编译时是未知的，只有运行时才能确定。

Rust 的大多数类型在编译时大小就已固定：`i32` 是 4 字节，`(u8, f64)` 是 16 字节。

但有些类型的大小只有在运行时才能确定，叫做**动态大小类型（Dynamically Sized Types，DST）**。最常见的两个：

- str （注意：不是 &str ）— 字符串数据本身，长度随内容而变
- dyn Trait （注意：不是 &dyn Trait ）— trait 对象，实际类型运行时才确定

**为什么不能直接用 `str`：**

```text
"hi"           → 2 字节
"hello"        → 5 字节
"hello, world" → 12 字节
```

`str` 的大小取决于内容，编译时不知道，所以不能直接存在栈上：

<div class="code-runner" data-full-code="fn%20print_message(msg%3A%20str)%20%7B%20%20%2F%2F%20%E2%9D%8C%20%E5%A4%A7%E5%B0%8F%E6%9C%AA%E7%9F%A5%EF%BC%8C%E4%B8%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%E7%94%A8%0A%20%20%20%20println!(%22%7B%7D%22%2C%20msg)%3B%0A%7D%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_message</span><span style="color:#E1E4E8">(msg</span><span style="color:#F97583">:</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8">) {  </span><span style="color:#6A737D">// ❌ 大小未知，不能直接用</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, msg);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_message</span><span style="color:#E1E4E8">(msg</span><span style="color:#F97583">:</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8">) {  </span><span style="color:#6A737D">// ❌ 大小未知，不能直接用</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, msg);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

解决方案：用**引用**或**智能指针**包装，它们的大小始终固定：

- &str — 胖指针：数据指针（8字节）+ 长度（8字节）= 16 字节
- Box<str> — 同样是胖指针，只是拥有所有权

<div class="code-runner" data-full-code="fn%20print_message(msg%3A%20%26str)%20%7B%20%20%2F%2F%20%E2%9C%85%20%26str%20%E5%A4%A7%E5%B0%8F%E5%9B%BA%E5%AE%9A%EF%BC%8816%E5%AD%97%E8%8A%82%EF%BC%89%0A%20%20%20%20println!(%22%7B%7D%22%2C%20msg)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20print_message(%22hi%22)%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%202%E5%AD%97%E8%8A%82%E7%9A%84%20str%EF%BC%8C%E4%BD%86%20%26str%20%E5%A7%8B%E7%BB%88%E6%98%AF%2016%E5%AD%97%E8%8A%82%0A%20%20%20%20print_message(%22hello%2C%20world%22)%3B%20%2F%2F%2012%E5%AD%97%E8%8A%82%E7%9A%84%20str%EF%BC%8C%E4%BD%86%20%26str%20%E5%A7%8B%E7%BB%88%E6%98%AF%2016%E5%AD%97%E8%8A%82%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_message</span><span style="color:#E1E4E8">(msg</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) {  </span><span style="color:#6A737D">// ✅ &amp;str 大小固定（16字节）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, msg);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    print_message</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hi"</span><span style="color:#E1E4E8">);           </span><span style="color:#6A737D">// 2字节的 str，但 &amp;str 始终是 16字节</span></span>
<span class="line"><span style="color:#B392F0">    print_message</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello, world"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 12字节的 str，但 &amp;str 始终是 16字节</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**核心规律**：DST 需要通过”胖指针”使用。胖指针 = 普通指针 + 额外元数据（长度或 vtable），大小固定，Rust 可以把它放在栈上。

# 练习题

## 类型别名与 newtype 测验

加载题目中…

```rust
struct Celsius(f64);
struct Fahrenheit(f64);

fn to_fahrenheit(c: Celsius) -> Fahrenheit {
    Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

用 newtype 模式实现温度类型，防止摄氏度和华氏度混淆：

```rust
use std::fmt;

struct Celsius(f64);
struct Fahrenheit(f64);

// TODO: 为 Celsius 实现 Display，格式为 "100.0°C"
// TODO: 为 Fahrenheit 实现 Display，格式为 "212.0°F"

// TODO: 实现转换函数（转换公式：°F = °C × 9/5 + 32）
// fn celsius_to_fahrenheit(c: Celsius) -> Fahrenheit { ... }

fn main() {
    let boiling = Celsius(100.0);
    // let f = celsius_to_fahrenheit(boiling);
    // println!("{}", Celsius(100.0)); // 100.0°C
    // println!("{}", f);              // 212.0°F
}
```