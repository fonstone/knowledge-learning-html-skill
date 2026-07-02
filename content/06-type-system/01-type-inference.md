# 类型推导基础

## 为什么需要类型推导

在很多编程语言中，你需要为每一个变量显式标注类型：

```rust
// 如果没有类型推导，你需要写：
let x: i32 = 5;
let name: String = String::from("Alice");
let nums: Vec<i32> = Vec::new();
```

这样做很冗长。Rust 设计了一个**聪明的类型推导引擎**，让编译器自动推断变量的类型。这不仅使代码更简洁，还不失安全性——编译器会在无法确定类型时明确告诉你。

类型推导的核心理念：**编译器通过你使用变量的方式来推断它的类型**。

## 基本推导规则

### 从初始化值推导

最直接的方式是从右边赋予的值推导类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20i32%EF%BC%88Rust%20%E6%95%B4%E6%95%B0%E9%BB%98%E8%AE%A4%E7%B1%BB%E5%9E%8B%EF%BC%89%0A%20%20%20%20let%20y%20%3D%205.0%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20f64%EF%BC%88Rust%20%E6%B5%AE%E7%82%B9%E6%95%B0%E9%BB%98%E8%AE%A4%E7%B1%BB%E5%9E%8B%EF%BC%89%0A%20%20%20%20let%20name%20%3D%20%22hello%22%3B%20%20%20%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20%26str%EF%BC%88%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%89%0A%20%20%20%20let%20b%20%3D%20true%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20bool%0A%0A%20%20%20%20println!(%22x%3A%20%7B%3A%3F%7D%2C%20y%3A%20%7B%3A%3F%7D%2C%20name%3A%20%7B%3A%3F%7D%2C%20b%3A%20%7B%3A%3F%7D%22%2C%20x%2C%20y%2C%20name%2C%20b)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;              </span><span style="color:#6A737D">// 推导为 i32（Rust 整数默认类型）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5.0</span><span style="color:#E1E4E8">;            </span><span style="color:#6A737D">// 推导为 f64（Rust 浮点数默认类型）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello"</span><span style="color:#E1E4E8">;     </span><span style="color:#6A737D">// 推导为 &amp;str（字符串字面量）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">;           </span><span style="color:#6A737D">// 推导为 bool</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x: {:?}, y: {:?}, name: {:?}, b: {:?}"</span><span style="color:#E1E4E8">, x, y, name, b);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 从使用方式推导

编译器不只看初始化，还会看变量**之后如何被使用**。这是 Rust 类型推导最强大的地方：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E7%A9%BA%E5%90%91%E9%87%8F%EF%BC%8C%E6%AD%A4%E6%97%B6%E7%BC%96%E8%AF%91%E5%99%A8%E8%BF%98%E4%B8%8D%E7%9F%A5%E9%81%93%E5%85%83%E7%B4%A0%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20mut%20vec%20%3D%20Vec%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E5%90%91%E5%85%B6%E4%B8%AD%E6%B7%BB%E5%8A%A0%205u8%EF%BC%88%E6%97%A0%E7%AC%A6%E5%8F%B7%208%20%E4%BD%8D%E6%95%B4%E6%95%B0%EF%BC%89%0A%20%20%20%20vec.push(5u8)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%E7%BC%96%E8%AF%91%E5%99%A8%E6%8E%A8%E5%AF%BC%E5%87%BA%EF%BC%9Avec%20%E6%98%AF%20Vec%3Cu8%3E%0A%20%20%20%20println!(%22vec%3A%20%7B%3A%3F%7D%22%2C%20vec)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%86%8D%E7%9C%8B%E8%BF%99%E4%B8%AA%E4%BE%8B%E5%AD%90%0A%20%20%20%20let%20mut%20collection%20%3D%20Vec%3A%3Anew()%3B%0A%20%20%20%20collection.push(10)%3B%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%80%E8%A1%8C%E7%A1%AE%E5%AE%9A%E4%BA%86%E5%85%83%E7%B4%A0%E7%B1%BB%E5%9E%8B%E6%98%AF%20i32%0A%20%20%20%20println!(%22collection%3A%20%7B%3A%3F%7D%22%2C%20collection)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 创建一个空向量，此时编译器还不知道元素类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> vec </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 向其中添加 5u8（无符号 8 位整数）</span></span>
<span class="line"><span style="color:#E1E4E8">    vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 现在编译器推导出：vec 是 Vec&lt;u8&gt;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"vec: {:?}"</span><span style="color:#E1E4E8">, vec);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 再看这个例子</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> collection </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    collection</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 这一行确定了元素类型是 i32</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"collection: {:?}"</span><span style="color:#E1E4E8">, collection);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 跨行推导

类型推导可以**跨越多行代码**。编译器会汇总所有线索来确定类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20numbers%20%3D%20Vec%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E7%AC%AC%201%20%E8%A1%8C%EF%BC%9A%E6%9A%82%E6%97%B6%E8%BF%98%E6%98%AF%20Vec%3C_%3E%0A%0A%20%20%20%20numbers.push(42)%3B%0A%20%20%20%20%2F%2F%20%E7%AC%AC%202%20%E8%A1%8C%EF%BC%9A%E7%8E%B0%E5%9C%A8%E6%98%AF%20Vec%3Ci32%3E%0A%0A%20%20%20%20numbers.push(100)%3B%0A%20%20%20%20%2F%2F%20%E7%AC%AC%203%20%E8%A1%8C%EF%BC%9A%E4%BB%8D%E7%84%B6%E6%98%AF%20Vec%3Ci32%3E%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20numbers)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> numbers </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 第 1 行：暂时还是 Vec&lt;_&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    numbers</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 第 2 行：现在是 Vec&lt;i32&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    numbers</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 第 3 行：仍然是 Vec&lt;i32&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, numbers);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 何时显式标注类型

虽然 Rust 的推导很强大，但有些情况下**必须**或**应该**显式标注类型。

### 必须标注的情况

**1. 空初始化**

空集合无法推导元素类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%8D%E7%9F%A5%E9%81%93%E8%A6%81%E4%BB%80%E4%B9%88%E7%B1%BB%E5%9E%8B%0A%20%20%20%20%2F%2F%20let%20empty%20%3D%20Vec%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E6%AD%A3%E7%A1%AE%EF%BC%9A%E6%98%BE%E5%BC%8F%E6%A0%87%E6%B3%A8%0A%20%20%20%20let%20empty%3A%20Vec%3Ci32%3E%20%3D%20Vec%3A%3Anew()%3B%0A%20%20%20%20println!(%22empty%20vec%3A%20%7B%3A%3F%7D%22%2C%20empty)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 错误！编译器不知道要什么类型</span></span>
<span class="line"><span style="color:#6A737D">    // let empty = Vec::new();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 正确：显式标注</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> empty</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"empty vec: {:?}"</span><span style="color:#E1E4E8">, empty);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**2. 多个可能的类型**

有时推导会产生歧义，编译器拒绝猜测：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%815%20%E6%97%A2%E5%8F%AF%E4%BB%A5%E6%98%AF%20i32%E3%80%81i64%E3%80%81u32%20%E7%AD%89%0A%20%20%20%20%2F%2F%20let%20x%20%3D%205%3B%0A%20%20%20%20%2F%2F%20x.parse%3A%3A%3C...%3E()%20%E4%BC%9A%E6%8E%A8%E5%AF%BC%E5%A4%B1%E8%B4%A5%0A%0A%20%20%20%20%2F%2F%20%E6%AD%A3%E7%A1%AE%EF%BC%9A%E6%98%8E%E7%A1%AE%E6%8C%87%E5%AE%9A%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20x%3A%20i32%20%3D%205%3B%0A%20%20%20%20let%20y%3A%20u8%20%3D%205%3B%0A%20%20%20%20let%20z%3A%20f64%20%3D%205.0%3B%0A%0A%20%20%20%20println!(%22x%3A%20%7B%7D%2C%20y%3A%20%7B%7D%2C%20z%3A%20%7B%7D%22%2C%20x%2C%20y%2C%20z)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 错误！5 既可以是 i32、i64、u32 等</span></span>
<span class="line"><span style="color:#6A737D">    // let x = 5;</span></span>
<span class="line"><span style="color:#6A737D">    // x.parse::&lt;...&gt;() 会推导失败</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 正确：明确指定类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> z</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 5.0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x: {}, y: {}, z: {}"</span><span style="color:#E1E4E8">, x, y, z);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**3. 函数参数和返回值**

函数签名中**必须**显式标注参数和返回类型（这不是推导，而是接口要求）：

<div class="code-runner" data-full-code="fn%20add(x%3A%20i32%2C%20y%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20x%20%2B%20y%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20result%20%3D%20add(3%2C%204)%3B%20%20%2F%2F%20%E8%B0%83%E7%94%A8%E6%97%B6%E4%B8%8D%E9%9C%80%E8%A6%81%E6%A0%87%E6%B3%A8%EF%BC%8C%E4%BD%86%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89%E4%B8%AD%E5%BF%85%E9%A1%BB%0A%20%20%20%20println!(%22result%3A%20%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> y</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 调用时不需要标注，但函数定义中必须</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"result: {}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 应该标注的情况

**1. 提高代码可读性**

即使编译器能推导，但代码可能会不清楚：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%9A%BE%E4%BB%A5%E4%B8%80%E7%9C%BC%E7%9C%8B%E5%87%BA%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E6%9B%B4%E6%B8%85%E6%99%B0%0A%20%20%20%20let%20numbers%3A%20Vec%3Ci32%3E%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20numbers)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 难以一眼看出类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 更清晰</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, numbers);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**2. 函数返回值有歧义**

某些方法可能返回多种类型，需要显式指定：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20turbofish%20%E8%AF%AD%E6%B3%95%20%3A%3A%3Ctype%3E%0A%20%20%20%20%2F%2F%20parse%20%E6%96%B9%E6%B3%95%E5%8F%AF%E4%BB%A5%E8%BF%94%E5%9B%9E%20i32%E3%80%81u32%E3%80%81f64%20%E7%AD%89%0A%20%20%20%20let%20num%3A%20i32%20%3D%20%2242%22.parse().expect(%22%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%88%96%E8%80%85%E7%94%A8%20turbofish%0A%20%20%20%20let%20num2%20%3D%20%2242%22.parse%3A%3A%3Cu32%3E().expect(%22%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%22)%3B%0A%0A%20%20%20%20println!(%22num%3A%20%7B%7D%2C%20num2%3A%20%7B%7D%22%2C%20num%2C%20num2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // turbofish 语法 ::&lt;type&gt;</span></span>
<span class="line"><span style="color:#6A737D">    // parse 方法可以返回 i32、u32、f64 等</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "42"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无法解析"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 或者用 turbofish</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "42"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">&gt;()</span><span style="color:#F97583">.</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无法解析"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"num: {}, num2: {}"</span><span style="color:#E1E4E8">, num, num2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 类型推导的限制

### 限制 1：不跨越函数边界

编译器**不会**根据函数调用方来推导函数内部的类型。每个函数都是独立的类型检查单元：

<div class="code-runner" data-full-code="fn%20process(x)%20%7B%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E5%BF%85%E9%A1%BB%E6%A0%87%E6%B3%A8%E7%B1%BB%E5%9E%8B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20process(42)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> process</span><span style="color:#E1E4E8">(x) {  </span><span style="color:#6A737D">// 错误！函数参数必须标注类型</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    process</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 限制 2：无法改变变量的已推导类型

一旦变量被推导为某个类型，就无法再赋予不同类型的值：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20value%20%3D%205%3B%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20i32%0A%0A%20%20%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E6%97%A0%E6%B3%95%E6%94%B9%E5%8F%98%E5%B7%B2%E6%8E%A8%E5%AF%BC%E7%9A%84%E7%B1%BB%E5%9E%8B%0A%20%20%20%20value%20%3D%20%22hello%22%3B%20%20%2F%2F%20%22hello%22%20%E6%98%AF%20%26str%EF%BC%8C%E4%B8%8E%20i32%20%E5%86%B2%E7%AA%81%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 推导为 i32</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 错误！无法改变已推导的类型</span></span>
<span class="line"><span style="color:#E1E4E8">    value </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "hello"</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// "hello" 是 &amp;str，与 i32 冲突</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 限制 3：过度使用 `_` 通配符

虽然可以用 `_` 让编译器推导，但过度使用会降低可读性：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E6%8E%A5%E5%8F%97%0A%20%20%20%20let%20numbers%3A%20Vec%3C_%3E%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E6%8E%A8%E8%8D%90%EF%BC%88%E5%A4%AA%E6%A8%A1%E7%B3%8A%EF%BC%89%0A%20%20%20%20%2F%2F%20let%20x%3A%20_%20%3D%2042%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20numbers)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 可以接受</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;_&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 不推荐（太模糊）</span></span>
<span class="line"><span style="color:#6A737D">    // let x: _ = 42;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, numbers);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 实战例子：集合类型推导

### 向量元素类型推导

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%201%EF%BC%9A%E4%BB%8E%20push%20%E6%8E%A8%E5%AF%BC%0A%20%20%20%20let%20mut%20vec%20%3D%20Vec%3A%3Anew()%3B%0A%20%20%20%20vec.push(%22hello%22)%3B%0A%20%20%20%20vec.push(%22world%22)%3B%0A%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%20vec%20%E6%98%AF%20Vec%3C%26str%3E%0A%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%202%EF%BC%9A%E4%BB%8E%E5%88%9D%E5%A7%8B%E5%8C%96%E5%AE%8F%E6%8E%A8%E5%AF%BC%0A%20%20%20%20let%20nums%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%5D%3B%0A%20%20%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E6%8E%A8%E5%AF%BC%E4%B8%BA%20Vec%3Ci32%3E%0A%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%203%EF%BC%9A%E9%9C%80%E8%A6%81%E6%98%BE%E5%BC%8F%E6%A0%87%E6%B3%A8%0A%20%20%20%20let%20colors%3A%20Vec%3C%26str%3E%20%3D%20vec!%5B%5D%3B%0A%20%20%20%20%2F%2F%20%E7%A9%BA%E5%90%91%E9%87%8F%E9%9C%80%E8%A6%81%E6%A0%87%E6%B3%A8%0A%0A%20%20%20%20println!(%22vec%3A%20%7B%3A%3F%7D%22%2C%20vec)%3B%0A%20%20%20%20println!(%22nums%3A%20%7B%3A%3F%7D%22%2C%20nums)%3B%0A%20%20%20%20println!(%22colors%3A%20%7B%3A%3F%7D%22%2C%20colors)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 例子 1：从 push 推导</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> vec </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 现在 vec 是 Vec&lt;&amp;str&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 例子 2：从初始化宏推导</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> nums </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#6A737D">    // 自动推导为 Vec&lt;i32&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 例子 3：需要显式标注</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> colors</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[];</span></span>
<span class="line"><span style="color:#6A737D">    // 空向量需要标注</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"vec: {:?}"</span><span style="color:#E1E4E8">, vec);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"nums: {:?}"</span><span style="color:#E1E4E8">, nums);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"colors: {:?}"</span><span style="color:#E1E4E8">, colors);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### HashMap 键值类型推导

<div class="code-runner" data-full-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%BB%8E%20insert%20%E6%8E%A8%E5%AF%BC%E9%94%AE%E5%80%BC%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20mut%20scores%20%3D%20HashMap%3A%3Anew()%3B%0A%20%20%20%20scores.insert(%22Alice%22%2C%2088)%3B%0A%20%20%20%20scores.insert(%22Bob%22%2C%2092)%3B%0A%20%20%20%20%2F%2F%20%E6%8E%A8%E5%AF%BC%E4%B8%BA%20HashMap%3C%26str%2C%20i32%3E%0A%0A%20%20%20%20%2F%2F%20%E7%A9%BA%20HashMap%20%E9%9C%80%E8%A6%81%E6%A0%87%E6%B3%A8%0A%20%20%20%20let%20empty%3A%20HashMap%3CString%2C%20i32%3E%20%3D%20HashMap%3A%3Anew()%3B%0A%0A%20%20%20%20println!(%22scores%3A%20%7B%3A%3F%7D%22%2C%20scores)%3B%0A%20%20%20%20println!(%22empty%3A%20%7B%3A%3F%7D%22%2C%20empty)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">collections</span><span style="color:#F97583">::</span><span style="color:#B392F0">HashMap</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 从 insert 推导键值类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> scores </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">88</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    scores</span><span style="color:#F97583">.</span><span style="color:#B392F0">insert</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">92</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 推导为 HashMap&lt;&amp;str, i32&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 空 HashMap 需要标注</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> empty</span><span style="color:#F97583">:</span><span style="color:#B392F0"> HashMap</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> HashMap</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"scores: {:?}"</span><span style="color:#E1E4E8">, scores);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"empty: {:?}"</span><span style="color:#E1E4E8">, empty);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 类型推导测验

```rust
let x = 5;
```

加载题目中…

```rust
let mut vec = Vec::new();
vec.push(42);
vec.push("hello");
```

加载题目中…

加载题目中…

加载题目中…

```rust
let mut x = 5;
x = "hello";
```

加载题目中…

## 编程练习

### 练习 1：修复类型推导冲突

下面的代码存在类型推导冲突。修复这些冲突（可以通过改变值的类型、添加显式标注或改变赋值顺序）：

```rust
fn main() {
    // 错误 1：混合类型
    // let mut values = Vec::new();
    // values.push(42);
    // values.push("hello");
    // println!("{:?}", values);

    // 错误 2：类型冲突
    // let mut x = 5;
    // x = "world";
    // println!("{}", x);

    // TODO: 修复上面的两个错误，保持输出正确

    println!("修复成功！");
}
```