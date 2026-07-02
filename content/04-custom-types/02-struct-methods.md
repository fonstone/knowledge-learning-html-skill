# 从函数到方法

前面我们学过函数，也学过结构体。现在的问题是：如何让某个函数与某个结构体**紧密关联**？

比如，计算矩形面积的逻辑本质上是**矩形的行为**，而不是一个独立的工具函数。用函数实现需要这样：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Afn%20area(rect%3A%20%26Rectangle)%20-%3E%20u32%20%7B%0A%20%20%20%20rect.width%20*%20rect.height%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect%20%3D%20Rectangle%20%7B%20width%3A%2030%2C%20height%3A%2050%20%7D%3B%0A%20%20%20%20println!(%22%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%7D%20%E5%B9%B3%E6%96%B9%E5%83%8F%E7%B4%A0%22%2C%20area(%26rect))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(rect</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Rectangle</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    rect</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> rect</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"面积：{} 平方像素"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">rect));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

问题是：读代码的人需要去别处找 `area` 函数，且不清楚它属于哪个类型。如果 Rust 能把函数”附属”到结构体上就好了。

**方法** 就是解决这个问题的。方法是与某个类型相关联的函数，可以用 `.` 运算符调用：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20u32%20%7B%0A%20%20%20%20%20%20%20%20self.width%20*%20self.height%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect%20%3D%20Rectangle%20%7B%20width%3A%2030%2C%20height%3A%2050%20%7D%3B%0A%20%20%20%20println!(%22%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%7D%20%E5%B9%B3%E6%96%B9%E5%83%8F%E7%B4%A0%22%2C%20rect.area())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"面积：{} 平方像素"</span><span style="color:#E1E4E8">, rect</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

现在清晰多了：`area()` 是 `Rectangle` 的方法，调用时直接用 `rect.area()`。

# 定义方法

方法定义在 **`impl` 块**（implementation block）中。语法：

<div class="code-runner" data-full-code="struct%20Circle%20%7B%0A%20%20%20%20radius%3A%20f64%2C%0A%7D%0A%0Aimpl%20Circle%20%7B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%0A%20%20%20%20%20%20%20%203.14159%20*%20self.radius%20*%20self.radius%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20is_large(%26self)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20self.area()%20%3E%20100.0%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20circle%20%3D%20Circle%20%7B%20radius%3A%205.0%20%7D%3B%0A%20%20%20%20println!(%22%E5%9C%86%E7%9A%84%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%3A.2%7D%22%2C%20circle.area())%3B%0A%20%20%20%20println!(%22%E6%98%AF%E5%90%A6%E5%BE%88%E5%A4%A7%EF%BC%9F%7B%7D%22%2C%20circle.is_large())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    radius</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        3.14159</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">radius </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">radius</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> is_large</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">() &gt; </span><span style="color:#79B8FF">100.0</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> circle </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> { radius</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"圆的面积：{:.2}"</span><span style="color:#E1E4E8">, circle</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"是否很大？{}"</span><span style="color:#E1E4E8">, circle</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_large</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键点：**

- impl 类型名 { ... } 定义该类型的实现块
- 方法的 第一个参数总是 `self` ，它代表调用方法的实例
- 方法在 impl 块中，与类型在同一个逻辑命名空间

## self 的三种形式

方法可以以三种方式接收 `self`，取决于方法是否需要修改实例：

### 1. `&self` — 不可变借用（最常用）

方法只需读取字段值：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20u32%20%7B%0A%20%20%20%20%20%20%20%20self.width%20*%20self.height%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20width(%26self)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20self.width%20%3E%200%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect%20%3D%20Rectangle%20%7B%20width%3A%2030%2C%20height%3A%2050%20%7D%3B%0A%20%20%20%20println!(%22%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%7D%22%2C%20rect.area())%3B%0A%20%20%20%20println!(%22%E5%AE%BD%E5%BA%A6%E6%98%AF%E5%90%A6%E4%B8%BA%E6%AD%A3%EF%BC%9F%7B%7D%22%2C%20rect.width())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> width</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"面积：{}"</span><span style="color:#E1E4E8">, rect</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"宽度是否为正？{}"</span><span style="color:#E1E4E8">, rect</span><span style="color:#F97583">.</span><span style="color:#B392F0">width</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 2. `&mut self` — 可变借用

方法需要修改字段值：

<div class="code-runner" data-full-code="struct%20Counter%20%7B%0A%20%20%20%20count%3A%20i32%2C%0A%7D%0A%0Aimpl%20Counter%20%7B%0A%20%20%20%20fn%20increment(%26mut%20self)%20%7B%0A%20%20%20%20%20%20%20%20self.count%20%2B%3D%201%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20value(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20self.count%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20c%20%3D%20Counter%20%7B%20count%3A%200%20%7D%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20println!(%22%E8%AE%A1%E6%95%B0%E5%99%A8%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20c.value())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> increment</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#79B8FF"> self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> { count</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"计数器值：{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">value</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 3. `self` — 获取所有权（不常见）

方法消费掉实例（获取完全所有权），调用后实例无法再用。这用于需要将实例转换成其他形式的情况：

<div class="code-runner" data-full-code="struct%20Document%20%7B%0A%20%20%20%20content%3A%20String%2C%0A%7D%0A%0Aimpl%20Document%20%7B%0A%20%20%20%20fn%20into_uppercase(self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20self.content.to_uppercase()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20doc%20%3D%20Document%20%7B%20content%3A%20String%3A%3Afrom(%22hello%22)%20%7D%3B%0A%20%20%20%20let%20upper%20%3D%20doc.into_uppercase()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20upper)%3B%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20doc.content)%3B%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81doc%20%E5%B7%B2%E8%A2%AB%E8%BD%AC%E7%A7%BB%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Document</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    content</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Document</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> into_uppercase</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">content</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_uppercase</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> doc </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Document</span><span style="color:#E1E4E8"> { content</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">) };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> upper </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> doc</span><span style="color:#F97583">.</span><span style="color:#B392F0">into_uppercase</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, upper);</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", doc.content);  // 错误！doc 已被转移</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **命名惯例**：获取所有权的方法经常用 `into_` 前缀，表示”消费转换”。比如 `into_uppercase()` 表示”消费这个实例，返回大写版本”。

## 多个参数的方法

方法可以有除 `self` 外的其他参数：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20can_hold(%26self%2C%20other%3A%20%26Rectangle)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20self.width%20%3E%20other.width%20%26%26%20self.height%20%3E%20other.height%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect1%20%3D%20Rectangle%20%7B%20width%3A%2030%2C%20height%3A%2050%20%7D%3B%0A%20%20%20%20let%20rect2%20%3D%20Rectangle%20%7B%20width%3A%2010%2C%20height%3A%2040%20%7D%3B%0A%20%20%20%20let%20rect3%20%3D%20Rectangle%20%7B%20width%3A%2060%2C%20height%3A%2045%20%7D%3B%0A%0A%20%20%20%20println!(%22rect1%20%E8%83%BD%E5%AE%B9%E7%BA%B3%20rect2%EF%BC%9F%7B%7D%22%2C%20rect1.can_hold(%26rect2))%3B%0A%20%20%20%20println!(%22rect1%20%E8%83%BD%E5%AE%B9%E7%BA%B3%20rect3%EF%BC%9F%7B%7D%22%2C%20rect1.can_hold(%26rect3))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, other</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Rectangle</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">&amp;&amp;</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 40</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect3 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 45</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rect1 能容纳 rect2？{}"</span><span style="color:#E1E4E8">, rect1</span><span style="color:#F97583">.</span><span style="color:#B392F0">can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">rect2));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rect1 能容纳 rect3？{}"</span><span style="color:#E1E4E8">, rect1</span><span style="color:#F97583">.</span><span style="color:#B392F0">can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">rect3));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 关联函数

有时你需要一个与某个类型相关但**不作用于实例**的函数，比如构造函数。这叫**关联函数**（associated function）。定义方式是在 `impl` 块中不使用 `self` 参数：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20%2F%2F%20%E5%85%B3%E8%81%94%E5%87%BD%E6%95%B0%EF%BC%8C%E7%94%A8%E4%BA%8E%E5%88%9B%E5%BB%BA%E6%AD%A3%E6%96%B9%E5%BD%A2%0A%20%20%20%20fn%20square(size%3A%20u32)%20-%3E%20Rectangle%20%7B%0A%20%20%20%20%20%20%20%20Rectangle%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%20size%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20height%3A%20size%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E6%99%AE%E9%80%9A%E6%96%B9%E6%B3%95%0A%20%20%20%20fn%20area(%26self)%20-%3E%20u32%20%7B%0A%20%20%20%20%20%20%20%20self.width%20*%20self.height%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E7%94%A8%E5%85%B3%E8%81%94%E5%87%BD%E6%95%B0%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B%EF%BC%8C%E7%94%A8%20%3A%3A%20%E8%80%8C%E4%B8%8D%E6%98%AF%20.%0A%20%20%20%20let%20square%20%3D%20Rectangle%3A%3Asquare(50)%3B%0A%20%20%20%20println!(%22%E6%AD%A3%E6%96%B9%E5%BD%A2%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%7D%22%2C%20square.area())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 关联函数，用于创建正方形</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> square</span><span style="color:#E1E4E8">(size</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">            width</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> size,</span></span>
<span class="line"><span style="color:#E1E4E8">            height</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> size,</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 普通方法</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 用关联函数创建实例，用 :: 而不是 .</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> square </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#F97583">::</span><span style="color:#B392F0">square</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"正方形面积：{}"</span><span style="color:#E1E4E8">, square</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键点：**

- 关联函数用 :: 调用（命名空间操作符），如 Rectangle::square(50)
- String::from() 就是一个关联函数
- 关联函数经常用作 构造函数 （从某些数据创建实例）

# 多个 impl 块

你可以为同一个类型定义多个 `impl` 块。这在组织代码时很有用（虽然通常不必要）：

<div class="code-runner" data-full-code="struct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20u32%20%7B%0A%20%20%20%20%20%20%20%20self.width%20*%20self.height%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20perimeter(%26self)%20-%3E%20u32%20%7B%0A%20%20%20%20%20%20%20%202%20*%20(self.width%20%2B%20self.height)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect%20%3D%20Rectangle%20%7B%20width%3A%2030%2C%20height%3A%2050%20%7D%3B%0A%20%20%20%20println!(%22%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%7D%2C%20%E5%91%A8%E9%95%BF%EF%BC%9A%7B%7D%22%2C%20rect.area()%2C%20rect.perimeter())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> perimeter</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        2</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"面积：{}, 周长：{}"</span><span style="color:#E1E4E8">, rect</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">(), rect</span><span style="color:#F97583">.</span><span style="color:#B392F0">perimeter</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

多个 `impl` 块在泛型和 trait（后续章节）中特别有用，可以为不同的类型参数或 trait 提供不同的实现。

# 自动引用和解引用

Rust 有一个方便的特性：调用方法时，**自动添加 `&`、`&mut` 或 `*` 以匹配方法签名**。

比如，方法签名是 `&self`，但你调用时用的可能是：

<div class="code-runner" data-full-code="struct%20Point%20%7B%0A%20%20%20%20x%3A%20i32%2C%0A%20%20%20%20y%3A%20i32%2C%0A%7D%0A%0Aimpl%20Point%20%7B%0A%20%20%20%20fn%20distance_from_origin(%26self)%20-%3E%20f64%20%7B%0A%20%20%20%20%20%20%20%20((self.x.pow(2)%20%2B%20self.y.pow(2))%20as%20f64).sqrt()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%203%2C%20y%3A%204%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20%E8%BF%99%E5%9B%9B%E7%A7%8D%E8%B0%83%E7%94%A8%E6%96%B9%E5%BC%8F%E9%83%BD%E7%AD%89%E4%BB%B7%EF%BC%9A%0A%20%20%20%20p.distance_from_origin()%3B%20%20%20%20%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E8%BD%AC%E4%B8%BA%20(%26p).distance_from_origin()%0A%20%20%20%20(%26p).distance_from_origin()%3B%20%20%20%2F%2F%20%E6%98%BE%E5%BC%8F%E5%86%99%E5%87%BA%0A%0A%20%20%20%20let%20p_ref%20%3D%20%26p%3B%0A%20%20%20%20p_ref.distance_from_origin()%3B%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> distance_from_origin</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        ((</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">.</span><span style="color:#B392F0">pow</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y</span><span style="color:#F97583">.</span><span style="color:#B392F0">pow</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)) </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">sqrt</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 这四种调用方式都等价：</span></span>
<span class="line"><span style="color:#E1E4E8">    p</span><span style="color:#F97583">.</span><span style="color:#B392F0">distance_from_origin</span><span style="color:#E1E4E8">();      </span><span style="color:#6A737D">// 自动转为 (&amp;p).distance_from_origin()</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">p)</span><span style="color:#F97583">.</span><span style="color:#B392F0">distance_from_origin</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// 显式写出</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p_ref </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">p;</span></span>
<span class="line"><span style="color:#E1E4E8">    p_ref</span><span style="color:#F97583">.</span><span style="color:#B392F0">distance_from_origin</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 也可以</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个特性使 Rust 的方法调用语法很优雅，无需手动管理引用。所以 `->`（C/C++ 的结构体指针成员访问符）在 Rust 里完全不需要——`.` 就够了，编译器会自动帮你处理。

# 练习题

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

### 练习 1：为结构体添加方法

定义一个 `Account` 结构体，包含 `balance`（f64）字段。为它实现三个方法：

```rust
struct Account {
    balance: f64,
}

impl Account {
    fn deposit(&mut self, amount: f64) {
        // TODO: 实现
    }

    fn withdraw(&mut self, amount: f64) -> bool {
        // TODO: 实现，余额不足返回 false，否则返回 true
    }

    fn get_balance(&self) -> f64 {
        // TODO: 实现
    }
}

fn main() {
    let mut account = Account { balance: 100.0 };

    println!("初始余额：{}", account.get_balance());

    account.deposit(50.0);
    println!("存入 50 后：{}", account.get_balance());

    if account.withdraw(30.0) {
        println!("取出 30 成功，余额：{}", account.get_balance());
    }

    if !account.withdraw(200.0) {
        println!("取出 200 失败（余额不足）");
    }
}
```

### 练习 2：实现关联函数作为构造函数

定义一个 `Color` 结构体，包含 `r`、`g`、`b` 三个 `u8` 字段，写出对应关联函数和方法并实现三个功能：

```rust
#[derive(Debug)]
struct Color {
    r: u8,
    g: u8,
    b: u8,
}

// TODO: 返回白色 (255, 255, 255)
// TODO: 返回黑色 (0, 0, 0)
// TODO: 计算亮度（(r+g+b)/3）

fn main() {
    let white = Color::white();
    let black = Color::black();

    println!("白色亮度：{:.2}", white.brightness() as f64);
    println!("黑色亮度：{:.2}", black.brightness() as f64);
}
```