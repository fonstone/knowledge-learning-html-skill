# 什么是向量（Vector）

**向量**（Vector）是 Rust 标准库中最常用的**动态数组**类型，记作 `Vec<T>`。

“动态”是什么意思呢？对比你前面学过的**数组**（`[T; n]`），数组的长度在编译时就确定了，是**固定的**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%95%B0%E7%BB%84%EF%BC%9A%E9%95%BF%E5%BA%A6%E5%9B%BA%E5%AE%9A%E4%B8%BA%205%0A%20%20%20%20let%20arr%3A%20%5Bi32%3B%205%5D%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20println!(%22%E6%95%B0%E7%BB%84%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20arr.len())%3B%0A%0A%20%20%20%20%2F%2F%20%E5%90%91%E9%87%8F%EF%BC%9A%E9%95%BF%E5%BA%A6%E5%8F%AF%E4%BB%A5%E5%8A%A8%E6%80%81%E5%A2%9E%E5%8A%A0%E6%88%96%E5%87%8F%E5%B0%91%0A%20%20%20%20let%20mut%20vec%3A%20Vec%3Ci32%3E%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%E5%88%9D%E5%A7%8B%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20vec.len())%3B%0A%0A%20%20%20%20vec.push(6)%3B%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E6%B7%BB%E5%8A%A0%E6%96%B0%E5%85%83%E7%B4%A0%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%E7%8E%B0%E5%9C%A8%E7%9A%84%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20vec.len())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 数组：长度固定为 5</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> arr</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"数组长度：{}"</span><span style="color:#E1E4E8">, arr</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 向量：长度可以动态增加或减少</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> vec</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量初始长度：{}"</span><span style="color:#E1E4E8">, vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 可以添加新元素</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量现在的长度：{}"</span><span style="color:#E1E4E8">, vec</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为什么需要向量

想象这个场景：你写一个程序来读取用户输入。用户不一定输入多少行，可能是 1 行，也可能是 100 行。如果用数组，你需要**提前声明大小**（`[String; 100]`），这样既浪费空间（如果只有 10 行输入），又不够灵活（如果有 101 行就溢出了）。

向量解决了这个问题：**可以根据需要动态增长**，无需提前知道确切大小。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20lines%20%3D%20Vec%3A%3Anew()%3B%0A%0A%20%20%20%20%2F%2F%20%E6%A8%A1%E6%8B%9F%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E4%B8%89%E8%A1%8C%E6%95%B0%E6%8D%AE%0A%20%20%20%20lines.push(String%3A%3Afrom(%22%E7%AC%AC%E4%B8%80%E8%A1%8C%22))%3B%0A%20%20%20%20lines.push(String%3A%3Afrom(%22%E7%AC%AC%E4%BA%8C%E8%A1%8C%22))%3B%0A%20%20%20%20lines.push(String%3A%3Afrom(%22%E7%AC%AC%E4%B8%89%E8%A1%8C%22))%3B%0A%0A%20%20%20%20println!(%22%E6%94%B6%E5%88%B0%20%7B%7D%20%E8%A1%8C%E6%95%B0%E6%8D%AE%22%2C%20lines.len())%3B%0A%0A%20%20%20%20for%20line%20in%20%26lines%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%20%20%7B%7D%22%2C%20line)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> lines </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 模拟用户输入三行数据</span></span>
<span class="line"><span style="color:#E1E4E8">    lines</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一行"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    lines</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第二行"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    lines</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第三行"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"收到 {} 行数据"</span><span style="color:#E1E4E8">, lines</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> line </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">lines {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"  {}"</span><span style="color:#E1E4E8">, line);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 使用向量

## 创建和初始化向量

### 使用 `Vec::new()`

最直接的方式是调用 `Vec::new()`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%3A%20Vec%3Ci32%3E%20%3D%20Vec%3A%3Anew()%3B%0A%0A%20%20%20%20v.push(1)%3B%0A%20%20%20%20v.push(2)%3B%0A%20%20%20%20v.push(3)%3B%0A%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意这里需要**显式标注类型** `Vec<i32>`。为什么？因为向量是空的，编译器无法推断元素类型。

### 使用 `vec!` 宏

更简洁的方式是使用 `vec!` 宏。它可以在创建时直接填充数据，而且**编译器能自动推断类型**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%88%9B%E5%BB%BA%E5%B9%B6%E5%88%9D%E5%A7%8B%E5%8C%96%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E7%94%A8%E9%87%8D%E5%A4%8D%E8%AF%AD%E6%B3%95%0A%20%20%20%20let%20v2%20%3D%20vec!%5B0%3B%205%5D%3B%20%20%2F%2F%20%E4%BA%94%E4%B8%AA%200%0A%20%20%20%20println!(%22%E9%87%8D%E5%A4%8D%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 创建并初始化</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 也可以用重复语法</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];  </span><span style="color:#6A737D">// 五个 0</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"重复向量：{:?}"</span><span style="color:#E1E4E8">, v2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这两个写法是等价的：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%A4%E7%A7%8D%E6%96%B9%E5%BC%8F%E7%BB%93%E6%9E%9C%E7%9B%B8%E5%90%8C%0A%20%20%20%20let%20v1%20%3D%20vec!%5B0%2C%200%2C%200%2C%200%2C%200%5D%3B%0A%20%20%20%20let%20v2%20%3D%20vec!%5B0%3B%205%5D%3B%0A%0A%20%20%20%20println!(%22v1%3A%20%7B%3A%3F%7D%22%2C%20v1)%3B%0A%20%20%20%20println!(%22v2%3A%20%7B%3A%3F%7D%22%2C%20v2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 这两种方式结果相同</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"v1: {:?}"</span><span style="color:#E1E4E8">, v1);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"v2: {:?}"</span><span style="color:#E1E4E8">, v2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **小技巧**：如果你需要创建一个特定容量的空向量（为了减少重新分配次数），可以用 `Vec::with_capacity(n)`。这个技巧对性能敏感的代码有帮助。

## 访问向量中的元素

### 使用索引

向量支持基于索引的访问，就像数组一样：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%2C%2040%5D%3B%0A%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%9A%7B%7D%22%2C%20v%5B0%5D)%3B%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%89%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%9A%7B%7D%22%2C%20v%5B2%5D)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">40</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个元素：{}"</span><span style="color:#E1E4E8">, v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第三个元素：{}"</span><span style="color:#E1E4E8">, v[</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 越界会 panic（恐慌）

如果你访问的索引超出范围，程序会**崩溃**（panic）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%BC%9A%E5%AF%BC%E8%87%B4%20panic%EF%BC%81%0A%20%20%20%20println!(%22%7B%7D%22%2C%20v%5B5%5D)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 这会导致 panic！</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, v[</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这在交互式代码中会直接失败。Rust 的设计理念是：**非法的操作应该当即失败**，而不是允许未定义行为。

### 使用 `get()` 方法安全地访问

如果你不确定索引是否有效，使用 `get()` 方法返回 `Option`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%0A%20%20%20%20match%20v.get(0)%20%7B%0A%20%20%20%20%20%20%20%20Some(value)%20%3D%3E%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%9A%7B%7D%22%2C%20value)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E5%90%91%E9%87%8F%E4%B8%BA%E7%A9%BA%22)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20match%20v.get(10)%20%7B%0A%20%20%20%20%20%20%20%20Some(value)%20%3D%3E%20println!(%22%E7%AC%AC%2011%20%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%9A%7B%7D%22%2C%20value)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E7%B4%A2%E5%BC%95%2010%20%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%22)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个元素：{}"</span><span style="color:#E1E4E8">, value),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量为空"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第 11 个元素：{}"</span><span style="color:#E1E4E8">, value),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"索引 10 超出范围"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`get()` 返回 `Option<&T>`，你可以安全地处理”找不到”的情况。

### 关键区别：`[]` vs `get()`

- `v[i]` ：如果超出范围， panic 。用于已确认索引合法的地方。
- `v.get(i)` ：返回 Option 。用于索引可能不合法的地方。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E5%9C%BA%E6%99%AF%201%EF%BC%9A%E4%BD%A0%E7%9F%A5%E9%81%93%E7%B4%A2%E5%BC%95%E8%82%AF%E5%AE%9A%E5%AD%98%E5%9C%A8%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%EF%BC%9A%7B%7D%22%2C%20v%5B0%5D)%3B%20%20%2F%2F%20%E2%9C%93%20%E7%9B%B4%E6%8E%A5%E7%94%A8%20%5B%5D%20%E6%B2%A1%E5%85%B3%E7%B3%BB%0A%0A%20%20%20%20%2F%2F%20%E5%9C%BA%E6%99%AF%202%EF%BC%9A%E7%B4%A2%E5%BC%95%E6%9D%A5%E8%87%AA%E5%A4%96%E9%83%A8%E8%BE%93%E5%85%A5%EF%BC%8C%E5%8F%AF%E8%83%BD%E6%97%A0%E6%95%88%0A%20%20%20%20let%20user_input%20%3D%20%225%22%3B%0A%20%20%20%20if%20let%20Ok(index)%20%3D%20user_input.parse%3A%3A%3Cusize%3E()%20%7B%0A%20%20%20%20%20%20%20%20match%20v.get(index)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Some(val)%20%3D%3E%20println!(%22%E6%89%BE%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20val)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E7%9A%84%E7%B4%A2%E5%BC%95%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%22)%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 场景 1：你知道索引肯定存在</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个：{}"</span><span style="color:#E1E4E8">, v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]);  </span><span style="color:#6A737D">// ✓ 直接用 [] 没关系</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 场景 2：索引来自外部输入，可能无效</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> user_input </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "5"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Ok</span><span style="color:#E1E4E8">(index) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> user_input</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">usize</span><span style="color:#E1E4E8">&gt;() {</span></span>
<span class="line"><span style="color:#F97583">        match</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(index) {</span></span>
<span class="line"><span style="color:#B392F0">            Some</span><span style="color:#E1E4E8">(val) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"找到：{}"</span><span style="color:#E1E4E8">, val),</span></span>
<span class="line"><span style="color:#B392F0">            None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户输入的索引超出范围"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 修改向量

### 添加元素：`push()`

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20v.push(4)%3B%0A%20%20%20%20v.push(5)%3B%0A%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 删除元素：`pop()`

`pop()` 移除并返回最后一个元素，返回 `Option`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20match%20v.pop()%20%7B%0A%20%20%20%20%20%20%20%20Some(value)%20%3D%3E%20println!(%22%E5%BC%B9%E5%87%BA%EF%BC%9A%7B%7D%22%2C%20value)%2C%0A%20%20%20%20%20%20%20%20None%20%3D%3E%20println!(%22%E5%90%91%E9%87%8F%E4%B8%BA%E7%A9%BA%22)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E5%89%A9%E4%BD%99%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">pop</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"弹出：{}"</span><span style="color:#E1E4E8">, value),</span></span>
<span class="line"><span style="color:#B392F0">        None</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量为空"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"剩余：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 删除指定位置：`remove()`

`remove(index)` 删除指定索引的元素，并返回该元素。**注意**：这个操作时间复杂度是 O(n)，因为后面的所有元素都要向前移动：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B%22a%22%2C%20%22b%22%2C%20%22c%22%2C%20%22d%22%5D%3B%0A%0A%20%20%20%20let%20removed%20%3D%20v.remove(1)%3B%20%20%2F%2F%20%E5%88%A0%E9%99%A4%E7%B4%A2%E5%BC%95%201%20%E7%9A%84%E5%85%83%E7%B4%A0%0A%20%20%20%20println!(%22%E5%88%A0%E9%99%A4%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%9A%7B%7D%22%2C%20removed)%3B%0A%20%20%20%20println!(%22%E5%89%A9%E4%BD%99%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"c"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"d"</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> removed </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">remove</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 删除索引 1 的元素</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"删除的元素：{}"</span><span style="color:#E1E4E8">, removed);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"剩余：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 修改元素

向量是可变的时候，可以直接修改元素：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20v%5B0%5D%20%3D%2010%3B%20%20%2F%2F%20%E7%9B%B4%E6%8E%A5%E4%BF%AE%E6%94%B9%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%0A%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 直接修改第一个元素</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

或者用迭代获取可变引用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20for%20elem%20in%20%26mut%20v%20%7B%0A%20%20%20%20%20%20%20%20*elem%20*%3D%202%3B%20%20%2F%2F%20%E5%B0%86%E6%AF%8F%E4%B8%AA%E5%85%83%E7%B4%A0%E4%B9%98%E4%BB%A5%202%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E7%BF%BB%E5%80%8D%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> elem </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> v {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">elem </span><span style="color:#F97583">*=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 将每个元素乘以 2</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"翻倍后：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 遍历向量

### 不可变遍历

最常见的遍历方式是用 `for` 循环和不可变借用 `&v`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%0A%20%20%20%20for%20num%20in%20%26v%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%95%B0%E5%AD%97%EF%BC%9A%7B%7D%22%2C%20num)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E9%81%8D%E5%8E%86%E5%90%8E%E4%BB%8D%E7%84%B6%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%20v%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20v.len())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">v {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"数字：{}"</span><span style="color:#E1E4E8">, num);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 遍历后仍然可以使用 v</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量长度：{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

如果直接 `for num in v`（不用 `&`），会**转移所有权**，之后就无法再使用 `v` 了。

### 可变遍历

要修改遍历过程中的元素，使用 `&mut v`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%5D%3B%0A%0A%20%20%20%20for%20num%20in%20%26mut%20v%20%7B%0A%20%20%20%20%20%20%20%20*num%20%2B%3D%2010%3B%20%20%2F%2F%20%E6%8C%87%E9%92%88%E8%A7%A3%E5%BC%95%E7%94%A8%E5%90%8E%E4%BF%AE%E6%94%B9%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> v {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">num </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 指针解引用后修改</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后：{:?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 转移所有权的遍历

如果向量包含**非复制类型**（如 `String`），直接 `for elem in v` 会转移所有权，元素无法再用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20String%3A%3Afrom(%22hello%22)%2C%0A%20%20%20%20%20%20%20%20String%3A%3Afrom(%22world%22)%2C%0A%20%20%20%20%5D%3B%0A%0A%20%20%20%20for%20s%20in%20v%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20s%20%E6%8B%A5%E6%9C%89%E8%BF%99%E4%B8%AA%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20s%20%E5%9C%A8%E8%BF%99%E9%87%8C%E8%A2%AB%E9%94%80%E6%AF%81%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20v%20%E7%8E%B0%E5%9C%A8%E5%B7%B2%E7%BB%8F%E8%A2%AB%E6%B8%85%E7%A9%BA%E4%BA%86%EF%BC%88%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E5%AE%8C%E6%88%90%EF%BC%89%0A%20%20%20%20%2F%2F%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81v%20%E5%B7%B2%E7%BB%8F%E8%A2%AB%E6%B6%88%E8%80%97%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">        String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> v {</span></span>
<span class="line"><span style="color:#6A737D">        // s 拥有这个字符串的所有权</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#6A737D">        // s 在这里被销毁</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // v 现在已经被清空了（所有权转移完成）</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{:?}", v);  // ✗ 错误！v 已经被消耗</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对比一下用不可变借用的方式，它不会消耗原向量：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20String%3A%3Afrom(%22hello%22)%2C%0A%20%20%20%20%20%20%20%20String%3A%3Afrom(%22world%22)%2C%0A%20%20%20%20%5D%3B%0A%0A%20%20%20%20for%20s%20in%20%26v%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20s%20%E6%98%AF%E4%B8%80%E4%B8%AA%E5%BC%95%E7%94%A8%20%26String%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20v%20%E4%BB%8D%E7%84%B6%E5%8F%AF%E7%94%A8%EF%BC%81%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20v.len())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">        String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">v {</span></span>
<span class="line"><span style="color:#6A737D">        // s 是一个引用 &amp;String</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // v 仍然可用！</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量长度：{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 向量中的所有权规则

这是一个容易出错的地方。向量的所有权规则和普通变量一样，但因为向量可以包含多个元素，情况会更复杂。

## 规则 1：向量拥有其元素的所有权

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5Bs%5D%3B%0A%0A%20%20%20%20%2F%2F%20s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%BB%8F%E8%BD%AC%E7%A7%BB%E5%88%B0%20v%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20s)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81s%20%E5%B7%B2%E7%BB%8F%E6%B2%A1%E6%9C%89%E6%89%80%E6%9C%89%E6%9D%83%E4%BA%86%0A%0A%20%20%20%20println!(%22%E5%90%91%E9%87%8F%E4%B8%AD%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%9A%7B%3A%3F%7D%22%2C%20v%5B0%5D)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[s];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // s 的所有权已经转移到 v</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", s);  // ✗ 错误！s 已经没有所有权了</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"向量中的字符串：{:?}"</span><span style="color:#E1E4E8">, v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

向量被销毁时，它会自动销毁其中的所有元素。

## 规则 2：不能在遍历时修改向量的大小

一个常见的错误是：**在迭代过程中修改向量的结构**（添加/删除元素）。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E8%BF%99%E6%A0%B7%E5%81%9A%E6%98%AF%E9%94%99%E8%AF%AF%E7%9A%84%EF%BC%9A%0A%20%20%20%20%2F%2F%20for%20elem%20in%20%26v%20%7B%0A%20%20%20%20%2F%2F%20%20%20%20%20v.push(*elem)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%E4%B8%8D%E8%83%BD%E5%9C%A8%E8%BF%AD%E4%BB%A3%E6%97%B6%E4%BF%AE%E6%94%B9%20v%0A%20%20%20%20%2F%2F%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 这样做是错误的：</span></span>
<span class="line"><span style="color:#6A737D">    // for elem in &amp;v {</span></span>
<span class="line"><span style="color:#6A737D">    //     v.push(*elem);  // ✗ 错误！不能在迭代时修改 v</span></span>
<span class="line"><span style="color:#6A737D">    // }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

为什么不行？因为迭代器一开始就记录了要遍历的元素，如果中途改变向量的大小，迭代器可能会访问无效的内存。

> **如果需要修改向量的大小**：先遍历并收集信息（比如要删除的索引），然后遍历完成后再修改向量。或者使用 `retain()` 方法：`v.retain(|&x| x % 2 == 1)` 保留满足条件的元素。

## 规则 3：不能同时持有可变和不可变引用

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20let%20first%20%3D%20%26v%5B0%5D%3B%20%20%2F%2F%20%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%0A%0A%20%20%20%20v.push(4)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%81%E4%B8%8D%E8%83%BD%E8%8E%B7%E5%BE%97%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%EF%BC%8C%E5%9B%A0%E4%B8%BA%E8%BF%98%E6%9C%89%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E5%AD%98%E5%9C%A8%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20first)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> first </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">v[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">];  </span><span style="color:#6A737D">// 不可变借用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// ✗ 错误！不能获得可变借用，因为还有不可变借用存在</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, first);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个规则确保了内存安全。如果允许在持有引用时修改向量，那个引用可能变成悬垂指针。

# 向量中的多种类型

向量的类型参数 `T` 必须是单一类型。如果你要存储**多种不同类型**的数据，可以用**枚举**：

<div class="code-runner" data-full-code="enum%20Value%20%7B%0A%20%20%20%20Integer(i32)%2C%0A%20%20%20%20Text(String)%2C%0A%20%20%20%20Boolean(bool)%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20Value%3A%3AInteger(42)%2C%0A%20%20%20%20%20%20%20%20Value%3A%3AText(String%3A%3Afrom(%22hello%22))%2C%0A%20%20%20%20%20%20%20%20Value%3A%3ABoolean(true)%2C%0A%20%20%20%20%5D%3B%0A%0A%20%20%20%20for%20val%20in%20%26v%20%7B%0A%20%20%20%20%20%20%20%20match%20val%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Value%3A%3AInteger(i)%20%3D%3E%20println!(%22%E6%95%B4%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20i)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20Value%3A%3AText(s)%20%3D%3E%20println!(%22%E6%96%87%E6%9C%AC%EF%BC%9A%7B%7D%22%2C%20s)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20Value%3A%3ABoolean(b)%20%3D%3E%20println!(%22%E5%B8%83%E5%B0%94%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20b)%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Value</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Integer</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Text</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Boolean</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">bool</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">        Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Integer</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Text</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">)),</span></span>
<span class="line"><span style="color:#B392F0">        Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Boolean</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> val </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">v {</span></span>
<span class="line"><span style="color:#F97583">        match</span><span style="color:#E1E4E8"> val {</span></span>
<span class="line"><span style="color:#B392F0">            Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Integer</span><span style="color:#E1E4E8">(i) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"整数：{}"</span><span style="color:#E1E4E8">, i),</span></span>
<span class="line"><span style="color:#B392F0">            Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Text</span><span style="color:#E1E4E8">(s) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文本：{}"</span><span style="color:#E1E4E8">, s),</span></span>
<span class="line"><span style="color:#B392F0">            Value</span><span style="color:#F97583">::</span><span style="color:#B392F0">Boolean</span><span style="color:#E1E4E8">(b) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"布尔值：{}"</span><span style="color:#E1E4E8">, b),</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

另一个选择是用 **trait 对象**（后续章节会学到），这里先不展开。

# 常见操作速览

向量还有很多好用的方法。这里列出最常用的几个：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B3%2C%201%2C%204%2C%201%2C%205%2C%209%2C%202%2C%206%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E8%8E%B7%E5%8F%96%E9%95%BF%E5%BA%A6%0A%20%20%20%20println!(%22%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20v.len())%3B%0A%0A%20%20%20%20%2F%2F%20%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E4%B8%BA%E7%A9%BA%0A%20%20%20%20println!(%22%E4%B8%BA%E7%A9%BA%E5%90%97%EF%BC%9F%7B%7D%22%2C%20v.is_empty())%3B%0A%0A%20%20%20%20%2F%2F%20%E6%B8%85%E7%A9%BA%EF%BC%88%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E5%85%83%E7%B4%A0%EF%BC%89%0A%20%20%20%20let%20mut%20v2%20%3D%20v.clone()%3B%0A%20%20%20%20v2.clear()%3B%0A%20%20%20%20println!(%22%E6%B8%85%E7%A9%BA%E5%90%8E%E7%9A%84%E9%95%BF%E5%BA%A6%EF%BC%9A%7B%7D%22%2C%20v2.len())%3B%0A%0A%20%20%20%20%2F%2F%20%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E5%8C%85%E5%90%AB%E6%9F%90%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%88%E7%94%A8%20contains%EF%BC%89%0A%20%20%20%20println!(%22%E5%8C%85%E5%90%AB%204%20%E5%90%97%EF%BC%9F%7B%7D%22%2C%20v.contains(%264))%3B%0A%0A%20%20%20%20%2F%2F%20%E8%8E%B7%E5%8F%96%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%92%8C%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%EF%BC%9A%7B%3A%3F%7D%22%2C%20v.first())%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%EF%BC%9A%7B%3A%3F%7D%22%2C%20v.last())%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%8D%E8%BD%AC%0A%20%20%20%20let%20mut%20v3%20%3D%20v.clone()%3B%0A%20%20%20%20v3.reverse()%3B%0A%20%20%20%20println!(%22%E5%8F%8D%E8%BD%AC%E5%90%8E%EF%BC%9A%7B%3A%3F%7D%22%2C%20v3)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">9</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 获取长度</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"长度：{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 检查是否为空</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"为空吗？{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_empty</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 清空（删除所有元素）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    v2</span><span style="color:#F97583">.</span><span style="color:#B392F0">clear</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清空后的长度：{}"</span><span style="color:#E1E4E8">, v2</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 检查是否包含某个元素（用 contains）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"包含 4 吗？{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 获取第一个和最后一个元素</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个：{:?}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">first</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最后一个：{:?}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">last</span><span style="color:#E1E4E8">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 反转</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v3 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    v3</span><span style="color:#F97583">.</span><span style="color:#B392F0">reverse</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"反转后：{:?}"</span><span style="color:#E1E4E8">, v3);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

### 练习 1：创建和初始化向量

创建三个向量：

1. 使用 Vec::new() 和 push() 添加数字 10、20、30
1. 使用 vec! 宏直接创建包含 "red" 、 "green" 、 "blue" 的向量
1. 使用 vec![0; 5] 创建五个零

然后打印这三个向量的长度和内容：

```rust
fn main() {
    // TODO: 创建第一个向量（通过 Vec::new 和 push）


    // TODO: 创建第二个向量（颜色）


    // TODO: 创建第三个向量（五个零）


    // TODO: 打印三个向量的长度和内容
    println!("第一个向量长度：{}，内容：{:?}", v1.len(), v1);
    println!("第二个向量长度：{}，内容：{:?}", v2.len(), v2);
    println!("第三个向量长度：{}，内容：{:?}", v3.len(), v3);
}
```

### 练习 2：向量操作综合

完成下面的函数，实现对向量的各种操作：

```rust
fn print_vector_info(v: &Vec<i32>) {
    // 打印向量的长度
    println!("长度：{}", );

    // 打印是否为空
    println!("为空吗？{}", );

    // 打印第一个元素（用 first）
    println!("第一个元素：{:?}", );

    // 打印最后一个元素（用 last）
    println!("最后一个元素：{:?}", );

    // 打印所有元素
    println!("所有元素：{:?}", );
}

fn sum_vector(v: &Vec<i32>) -> i32 {
    // 计算向量所有元素的和（用 for 循环）

}

fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];

    print_vector_info(&v);

    println!("总和：{}", sum_vector(&v));
}
```