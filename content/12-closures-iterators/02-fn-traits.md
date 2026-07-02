# Fn / FnMut / FnOnce

## 为什么有三个 trait

上一篇我们看到闭包可以通过三种方式捕获变量：不可变引用、可变引用、所有权转移。这三种方式对应了三个 trait，它们描述的是**闭包能被怎样调用**：

| Trait | 调用方式 | 对应捕获方式 | 能调用几次 |
| --- | --- | --- | --- |
| `Fn` | 不可变引用调用 | `&T` 捕获 | 任意多次 |
| `FnMut` | 可变引用调用 | `&mut T` 捕获 | 任意多次（但需要 `mut`） |
| `FnOnce` | 消费调用 | `T` 捕获（移动） | 只能一次 |

三者之间有继承关系：**`Fn` 是最严格的子集，`FnOnce` 是最宽松的**。

```plaintext
FnOnce（所有闭包都实现）
  └── FnMut（不消耗所有权的闭包实现）
        └── Fn（只读访问的闭包实现）
```

即：`Fn` 的闭包一定实现了 `FnMut` 和 `FnOnce`；`FnMut` 的闭包一定实现了 `FnOnce`。

## 编译器自动推断

你不需要手动声明闭包实现哪个 trait——编译器根据闭包体里的行为自动决定：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%AF%BB%E5%8F%96%20x%20%E2%86%92%20%E5%AE%9E%E7%8E%B0%20Fn%20%2B%20FnMut%20%2B%20FnOnce%0A%20%20%20%20let%20read_only%20%3D%20%7C%7C%20println!(%22%7B%7D%22%2C%20x)%3B%0A%20%20%20%20read_only()%3B%0A%20%20%20%20read_only()%3B%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E5%A4%9A%E6%AC%A1%E8%B0%83%E7%94%A8%0A%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%20%20%20%20%2F%2F%20%E4%BF%AE%E6%94%B9%20count%20%E2%86%92%20%E5%AE%9E%E7%8E%B0%20FnMut%20%2B%20FnOnce%EF%BC%88%E4%B8%8D%E5%AE%9E%E7%8E%B0%20Fn%EF%BC%89%0A%20%20%20%20let%20mut%20mutating%20%3D%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20count)%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20mutating()%3B%0A%20%20%20%20mutating()%3B%20%2F%2F%20FnMut%20%E5%8F%AF%E4%BB%A5%E5%A4%9A%E6%AC%A1%E8%B0%83%E7%94%A8%0A%0A%20%20%20%20let%20name%20%3D%20String%3A%3Afrom(%22Alice%22)%3B%0A%20%20%20%20%2F%2F%20%E6%B6%88%E8%B4%B9%20name%20%E2%86%92%20%E5%8F%AA%E5%AE%9E%E7%8E%B0%20FnOnce%0A%20%20%20%20let%20consuming%20%3D%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20_n%20%3D%20name%3B%20%2F%2F%20%E7%A7%BB%E5%8A%A8%E4%BA%86%20name%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20%7D%3B%0A%20%20%20%20consuming()%3B%0A%20%20%20%20%2F%2F%20consuming()%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81FnOnce%20%E5%8F%AA%E8%83%BD%E8%B0%83%E4%B8%80%E6%AC%A1%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // 只读取 x → 实现 Fn + FnMut + FnOnce</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> read_only </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#B392F0">    read_only</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    read_only</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 可以多次调用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // 修改 count → 实现 FnMut + FnOnce（不实现 Fn）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> mutating </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    mutating</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    mutating</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// FnMut 可以多次调用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 消费 name → 只实现 FnOnce</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> consuming </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> _n </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> name; </span><span style="color:#6A737D">// 移动了 name 的所有权</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    consuming</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">    // consuming(); // 错误！FnOnce 只能调一次</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 闭包作为参数

## 用 impl Fn 接受闭包

当函数需要接受一个闭包参数时，用 `impl Fn`/`impl FnMut`/`impl FnOnce` 作为类型：

<div class="code-runner" data-full-code="%2F%2F%20%E6%8E%A5%E5%8F%97%E4%BB%BB%E4%BD%95%20i32%20-%3E%20i32%20%E7%9A%84%E9%97%AD%E5%8C%85%EF%BC%8C%E5%AF%B9%203%20%E8%B0%83%E7%94%A8%E5%AE%83%EF%BC%88%E5%8F%AA%E8%B0%83%E4%B8%80%E6%AC%A1%EF%BC%8C%E7%94%A8%20Fn%20%E5%8D%B3%E5%8F%AF%EF%BC%89%0Afn%20apply_to_3(f%3A%20impl%20Fn(i32)%20-%3E%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20f(3)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20double%20%3D%20%7Cx%7C%20x%20*%202%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply_to_3(double))%3B%20%2F%2F%206%0A%0A%20%20%20%20let%20add_one%20%3D%20%7Cx%7C%20x%20%2B%201%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply_to_3(add_one))%3B%20%2F%2F%204%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 接受任何 i32 -&gt; i32 的闭包，对 3 调用它（只调一次，用 Fn 即可）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> apply_to_3</span><span style="color:#E1E4E8">(f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> double </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply_to_3</span><span style="color:#E1E4E8">(double)); </span><span style="color:#6A737D">// 6</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add_one </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply_to_3</span><span style="color:#E1E4E8">(add_one)); </span><span style="color:#6A737D">// 4</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**`FnMut`：需要多次调用且闭包有副作用**

当函数要多次调用闭包，且闭包可能修改捕获的变量时，参数类型要用 `FnMut`：

<div class="code-runner" data-full-code="%2F%2F%20%E5%AF%B9%E5%88%97%E8%A1%A8%E7%9A%84%E6%AF%8F%E4%B8%80%E9%A1%B9%E8%B0%83%E7%94%A8%20f%E2%80%94%E2%80%94f%20%E4%BC%9A%E8%A2%AB%E8%B0%83%E7%94%A8%E5%A4%9A%E6%AC%A1%EF%BC%8C%E4%B8%94%E5%8F%AF%E8%83%BD%E6%9C%89%E5%89%AF%E4%BD%9C%E7%94%A8%0Afn%20for_each(items%3A%20%26%5Bi32%5D%2C%20mut%20f%3A%20impl%20FnMut(i32))%20%7B%0A%20%20%20%20for%20%26x%20in%20items%20%7B%0A%20%20%20%20%20%20%20%20f(x)%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20sum%20%3D%200%3B%0A%20%20%20%20%2F%2F%20%E9%97%AD%E5%8C%85%E4%BF%AE%E6%94%B9%E4%BA%86%20sum%EF%BC%8C%E6%98%AF%20FnMut%0A%20%20%20%20for_each(%26%5B1%2C%202%2C%203%2C%204%2C%205%5D%2C%20%7Cx%7C%20sum%20%2B%3D%20x)%3B%0A%20%20%20%20println!(%22sum%20%3D%20%7B%7D%22%2C%20sum)%3B%20%2F%2F%2015%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%AF%BB%E5%8F%96%E4%B9%9F%E8%83%BD%E4%BC%A0%EF%BC%8C%E5%9B%A0%E4%B8%BA%20Fn%20%E6%98%AF%20FnMut%20%E7%9A%84%E5%AD%90%E9%9B%86%0A%20%20%20%20for_each(%26%5B1%2C%202%2C%203%5D%2C%20%7Cx%7C%20println!(%22%7B%7D%22%2C%20x))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 对列表的每一项调用 f——f 会被调用多次，且可能有副作用</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> for_each</span><span style="color:#E1E4E8">(items</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], </span><span style="color:#F97583">mut</span><span style="color:#E1E4E8"> f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> FnMut</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">)) {</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> items {</span></span>
<span class="line"><span style="color:#B392F0">        f</span><span style="color:#E1E4E8">(x);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // 闭包修改了 sum，是 FnMut</span></span>
<span class="line"><span style="color:#B392F0">    for_each</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">], </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> x);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"sum = {}"</span><span style="color:#E1E4E8">, sum); </span><span style="color:#6A737D">// 15</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只读取也能传，因为 Fn 是 FnMut 的子集</span></span>
<span class="line"><span style="color:#B392F0">    for_each</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">], </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 注意：接受 `FnMut` 参数时，参数本身需要声明 `mut`（`mut f: impl FnMut()`），因为调用它会修改其内部状态。

**`FnOnce`：只需调用一次，接受最广泛**

<div class="code-runner" data-full-code="%2F%2F%20%E5%8F%AA%E8%B0%83%E7%94%A8%E4%B8%80%E6%AC%A1%EF%BC%8C%E7%94%A8%20FnOnce%E2%80%94%E2%80%94%E8%BF%9E%E6%B6%88%E8%B4%B9%E5%8F%98%E9%87%8F%E7%9A%84%E9%97%AD%E5%8C%85%E9%83%BD%E8%83%BD%E6%8E%A5%E5%8F%97%0Afn%20call_once(f%3A%20impl%20FnOnce()%20-%3E%20String)%20-%3E%20String%20%7B%0A%20%20%20%20f()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20msg%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%2F%2F%20%E6%B6%88%E8%B4%B9%E4%BA%86%20msg%20%E7%9A%84%E9%97%AD%E5%8C%85%EF%BC%88FnOnce%EF%BC%89%E4%B9%9F%E8%83%BD%E4%BC%A0%E8%BF%9B%E6%9D%A5%0A%20%20%20%20let%20result%20%3D%20call_once(move%20%7C%7C%20msg.to_uppercase())%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 只调用一次，用 FnOnce——连消费变量的闭包都能接受</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> call_once</span><span style="color:#E1E4E8">(f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> FnOnce</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> msg </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 消费了 msg 的闭包（FnOnce）也能传进来</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> call_once</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> msg</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_uppercase</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 选哪个 trait？

**原则：选限制最少的那个**——这样调用方能传入范围最广的闭包：

<div class="code-runner" data-full-code="%2F%2F%20%E5%A6%82%E6%9E%9C%E5%8F%AA%E9%9C%80%E8%A6%81%E8%B0%83%E7%94%A8%E4%B8%80%E6%AC%A1%EF%BC%8C%E7%94%A8%20FnOnce%EF%BC%88%E6%9C%80%E5%AE%BD%E6%9D%BE%EF%BC%8C%E6%8E%A5%E5%8F%97%E6%89%80%E6%9C%89%E9%97%AD%E5%8C%85%EF%BC%89%0Afn%20run_once(f%3A%20impl%20FnOnce()%20-%3E%20String)%20-%3E%20String%20%7B%0A%20%20%20%20f()%0A%7D%0A%0A%2F%2F%20%E5%A6%82%E6%9E%9C%E9%9C%80%E8%A6%81%E8%B0%83%E7%94%A8%E5%A4%9A%E6%AC%A1%EF%BC%8C%E7%94%A8%20Fn%EF%BC%88%E8%B0%83%E7%94%A8%E6%96%B9%E7%9A%84%E9%97%AD%E5%8C%85%E4%B8%8D%E8%83%BD%E6%9C%89%E5%8F%AF%E5%8F%98%E5%89%AF%E4%BD%9C%E7%94%A8%EF%BC%89%0Afn%20run_twice(f%3A%20impl%20Fn()%20-%3E%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20f()%20%2B%20f()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20msg%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%2F%2F%20%E6%B6%88%E8%B4%B9%E4%BA%86%20msg%EF%BC%8C%E5%8F%AA%E8%83%BD%E8%B0%83%E4%B8%80%E6%AC%A1%20%E2%86%92%20%E4%BC%A0%E7%BB%99%20FnOnce%20%E6%B2%A1%E9%97%AE%E9%A2%98%0A%20%20%20%20let%20result%20%3D%20run_once(move%20%7C%7C%20msg.to_uppercase())%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20result)%3B%0A%0A%20%20%20%20let%20base%20%3D%2010%3B%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%AF%BB%E5%8F%96%20base%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%A4%9A%E6%AC%A1%E8%B0%83%E7%94%A8%20%E2%86%92%20%E4%BC%A0%E7%BB%99%20Fn%20%E6%B2%A1%E9%97%AE%E9%A2%98%0A%20%20%20%20println!(%22%7B%7D%22%2C%20run_twice(%7C%7C%20base%20%2B%201))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 如果只需要调用一次，用 FnOnce（最宽松，接受所有闭包）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run_once</span><span style="color:#E1E4E8">(f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> FnOnce</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 如果需要调用多次，用 Fn（调用方的闭包不能有可变副作用）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run_twice</span><span style="color:#E1E4E8">(f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">+</span><span style="color:#B392F0"> f</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> msg </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 消费了 msg，只能调一次 → 传给 FnOnce 没问题</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> run_once</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">move</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> msg</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_uppercase</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> base </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // 只读取 base，可以多次调用 → 传给 Fn 没问题</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">run_twice</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> base </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **实践建议：** 不确定用哪个时，从 `Fn` 开始写。编译器会告诉你是否需要放宽到 `FnMut` 或 `FnOnce`。

## 也可以用泛型写法

`impl Fn(...)` 是 `<F: Fn(...)>` 的简写，两种写法等价：

<div class="code-runner" data-full-code="%2F%2F%20impl%20Trait%20%E5%86%99%E6%B3%95%EF%BC%88%E6%9B%B4%E7%AE%80%E6%B4%81%EF%BC%89%0Afn%20apply_a(f%3A%20impl%20Fn(i32)%20-%3E%20i32%2C%20x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20f(x)%0A%7D%0A%0A%2F%2F%20%E6%B3%9B%E5%9E%8B%E5%86%99%E6%B3%95%EF%BC%88%E9%9C%80%E8%A6%81%E5%A4%9A%E6%AC%A1%E7%94%A8%E5%88%B0%E5%90%8C%E4%B8%80%E4%B8%AA%E9%97%AD%E5%8C%85%E7%B1%BB%E5%9E%8B%E6%97%B6%E6%9B%B4%E7%81%B5%E6%B4%BB%EF%BC%89%0Afn%20apply_b%3CF%3A%20Fn(i32)%20-%3E%20i32%3E(f%3A%20F%2C%20x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20f(x)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply_a(%7Cx%7C%20x%20*%203%2C%204))%3B%20%2F%2F%2012%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply_b(%7Cx%7C%20x%20*%203%2C%204))%3B%20%2F%2F%2012%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// impl Trait 写法（更简洁）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> apply_a</span><span style="color:#E1E4E8">(f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">(x)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 泛型写法（需要多次用到同一个闭包类型时更灵活）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> apply_b</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">F</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">&gt;(f</span><span style="color:#F97583">:</span><span style="color:#B392F0"> F</span><span style="color:#E1E4E8">, x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">(x)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply_a</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 12</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply_b</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 12</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 闭包作为返回值

## 必须用 impl Fn

每个闭包都有一个唯一的匿名类型，函数不能以具体类型返回它，必须用 `impl Fn(...)` 语法：

<div class="code-runner" data-full-code="%2F%2F%20%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%22%E5%8A%A0%E4%B8%8A%E5%81%8F%E7%A7%BB%E9%87%8F%22%E7%9A%84%E9%97%AD%E5%8C%85%0Afn%20make_adder(offset%3A%20i32)%20-%3E%20impl%20Fn(i32)%20-%3E%20i32%20%7B%0A%20%20%20%20move%20%7Cx%7C%20x%20%2B%20offset%20%20%2F%2F%20%E5%BF%85%E9%A1%BB%20move%EF%BC%8C%E5%90%A6%E5%88%99%20offset%20%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E5%90%8E%E5%B0%B1%E5%A4%B1%E6%95%88%E4%BA%86%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20add5%20%3D%20make_adder(5)%3B%0A%20%20%20%20let%20add10%20%3D%20make_adder(10)%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add5(3))%3B%20%20%20%2F%2F%208%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add10(3))%3B%20%20%2F%2F%2013%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add5(7))%3B%20%20%20%2F%2F%2012%EF%BC%88add5%20%E8%BF%98%E5%8F%AF%E4%BB%A5%E7%BB%A7%E7%BB%AD%E7%94%A8%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 返回一个"加上偏移量"的闭包</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">(offset</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    move</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> offset  </span><span style="color:#6A737D">// 必须 move，否则 offset 在函数结束后就失效了</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add5 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add10 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_adder</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add5</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 8</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add10</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 13</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add5</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 12（add5 还可以继续用）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为什么必须 move

返回的闭包会在函数结束后继续使用，但 `offset` 是函数的局部变量，函数结束就销毁了。必须用 `move` 把 `offset` 的所有权移入闭包：

<div class="code-runner" data-full-code="fn%20make_adder_broken(offset%3A%20i32)%20-%3E%20impl%20Fn(i32)%20-%3E%20i32%20%7B%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E5%8A%A0%20move%EF%BC%9A%E9%97%AD%E5%8C%85%E5%8F%AA%E6%98%AF%E5%80%9F%E7%94%A8%20offset%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E5%90%8E%20offset%20%E9%94%80%E6%AF%81%EF%BC%8C%E9%97%AD%E5%8C%85%E6%8C%81%E6%9C%89%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%20%E2%86%92%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%0A%20%20%20%20%7Cx%7C%20x%20%2B%20offset%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_adder_broken</span><span style="color:#E1E4E8">(offset</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 不加 move：闭包只是借用 offset</span></span>
<span class="line"><span style="color:#6A737D">    // 函数返回后 offset 销毁，闭包持有悬垂引用 → 编译错误</span></span>
<span class="line"><span style="color:#F97583">    |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> offset</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

---

# 练习题

## Fn trait 测验

加载题目中…

加载题目中…

```rust
fn run<F: Fn()>(f: F) {
    f();
    f();
}

fn main() {
    let mut count = 0;
    run(|| count += 1);
    println!("{}", count);
}
```

加载题目中…

加载题目中…

## 编程练习

实现 `run_n` 函数，将传入的闭包执行 `n` 次。关键是选对 trait——`Fn`、`FnMut` 还是 `FnOnce`？

```rust
// TODO: 把 ??? 替换成正确的 trait（Fn / FnMut / FnOnce）
// 提示：f 会被调用 n 次，且第二个用法里 f 会修改外部变量
fn run_n(???) {
    for _ in 0..n {
        f();
    }
}

fn main() {
    // 用法 1：只读取，调用 3 次
    let msg = "hello";
    run_n(3, || println!("{}", msg));

    // 用法 2：修改外部变量，调用 4 次
    let mut count = 0;
    run_n(4, || count += 1);
    println!("count = {}", count);
}
```