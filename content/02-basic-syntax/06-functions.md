# 函数基础

函数是组织代码的基本单位。本文介绍 Rust 函数的定义方式、参数规则，以及一个新手最容易踩的坑——语句与表达式的区别。

Rust 中函数无处不在，你已经认识了最重要的一个：`main`。

## 定义与调用

用 `fn` 关键字定义函数，后跟函数名和一对圆括号，再用花括号包裹函数体：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22Hello%2C%20world!%22)%3B%0A%20%20%20%20another_function()%3B%20%2F%2F%20%E8%B0%83%E7%94%A8%E5%8F%A6%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%0A%7D%0A%0Afn%20another_function()%20%7B%0A%20%20%20%20println!(%22%E8%BF%99%E6%98%AF%E5%8F%A6%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E3%80%82%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, world!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    another_function</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 调用另一个函数</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> another_function</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这是另一个函数。"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**Rust 不关心函数定义的顺序**——`another_function` 定义在 `main` 之后完全没问题。只要在同一个作用域内定义过，就可以调用。

Rust 函数名使用 **snake_case**（蛇形命名法）：全部小写，单词之间用下划线连接。例如 `another_function`、`calculate_area`，而不是 `AnotherFunction` 或 `calculateArea`。

## 参数

函数可以声明参数，让调用者传入数据：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20greet(%22Alice%22)%3B%20%2F%2F%20%E4%BC%A0%E5%85%A5%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%0A%7D%0A%0Afn%20greet(name%3A%20%26str)%20%7B%0A%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20name)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    greet</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 传入字符串字面量</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> greet</span><span style="color:#E1E4E8">(name</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，{}！"</span><span style="color:#E1E4E8">, name);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**Rust 要求在函数签名中显式声明每个参数的类型**。这是一个有意为之的设计：只需看函数签名，不用查阅其他代码就能知道参数类型（否者一个变量声明后，经过多层函数传递，难以快速查阅其类型），编译器也不必在函数体外猜测类型。

如果省略类型标注，编译器会报错：

<div class="code-runner" data-full-code="fn%20add(x%2C%20y)%20-%3E%20i32%20%7B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E7%BC%BA%E5%B0%91%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%0A%20%20%20%20x%20%2B%20y%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add(1%2C%202))%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add</span><span style="color:#E1E4E8">(x, y) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { </span><span style="color:#6A737D">// 错误：缺少参数类型</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> y</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 多个参数

多个参数用逗号分隔，每个参数都必须单独标注类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20print_measurement(5%2C%20'h')%3B%0A%7D%0A%0Afn%20print_measurement(value%3A%20i32%2C%20unit%3A%20char)%20%7B%0A%20%20%20%20println!(%22%E6%B5%8B%E9%87%8F%E5%80%BC%EF%BC%9A%7B%7D%7B%7D%22%2C%20value%2C%20unit)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    print_measurement</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'h'</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_measurement</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, unit</span><span style="color:#F97583">:</span><span style="color:#B392F0"> char</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"测量值：{}{}"</span><span style="color:#E1E4E8">, value, unit);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意 `value: i32, unit: char` 不能省写成 `value, unit: i32, char`——每个参数都要写完整的 `名称: 类型` 对。

# 语句与返回值

Rust 是一门**基于表达式**的语言。理解语句和表达式的区别，是写好 Rust 函数的关键。

## 语句与表达式的区别

- 语句 （statement）：执行操作， 不返回值 。
- 表达式 （expression）：计算并 产生一个值 。

`let` 绑定是语句，`5 + 6` 是表达式。因此，你无法把 `let` 赋值的结果再赋给别的变量——它根本没有返回值：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%20(let%20y%20%3D%206)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9Alet%20%E6%98%AF%E8%AF%AD%E5%8F%A5%EF%BC%8C%E6%B2%A1%E6%9C%89%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 6</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 错误：let 是语句，没有返回值</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这和 C 或 Ruby 不同。在那些语言里 `x = y = 6` 是合法的，因为赋值语句会返回被赋的值。Rust 选择了更严格的设计：赋值就是赋值，不能当表达式使用。

## 代码块是表达式

花括号 `{}` 包裹的代码块本身也是一个表达式，**整个块的值是最后一行表达式的值**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20y%20%3D%20%7B%0A%20%20%20%20%20%20%20%20let%20x%20%3D%203%3B%0A%20%20%20%20%20%20%20%20x%20%2B%201%20%20%2F%2F%20%E6%B3%A8%E6%84%8F%EF%BC%9A%E6%B2%A1%E6%9C%89%E5%88%86%E5%8F%B7%EF%BC%8C%E8%BF%99%E6%98%AF%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22y%20%E7%9A%84%E5%80%BC%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20y)%3B%20%2F%2F%20%E6%89%93%E5%8D%B0%204%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#6A737D">  // 注意：没有分号，这是表达式</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"y 的值是：{}"</span><span style="color:#E1E4E8">, y); </span><span style="color:#6A737D">// 打印 4</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

关键在 `x + 1` 这一行——**没有分号**。一旦加上分号，它就从表达式变成了语句，整个块的值变成空的 `()`。

## 返回值

函数的返回值用 `->` 声明类型，**返回值就是函数体最后一个表达式的值**：

<div class="code-runner" data-full-code="fn%20five()%20-%3E%20i32%20%7B%0A%20%20%20%205%20%20%2F%2F%20%E6%B2%A1%E6%9C%89%E5%88%86%E5%8F%B7%EF%BC%8C%E8%BF%99%E6%98%AF%E8%BF%94%E5%9B%9E%E5%80%BC%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%20five()%3B%0A%20%20%20%20println!(%22x%20%E7%9A%84%E5%80%BC%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20x)%3B%20%2F%2F%20%E6%89%93%E5%8D%B0%205%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> five</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">    5</span><span style="color:#6A737D">  // 没有分号，这是返回值</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#B392F0"> five</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x 的值是：{}"</span><span style="color:#E1E4E8">, x); </span><span style="color:#6A737D">// 打印 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`five` 函数体只有一个裸数字 `5`，没有 `return`，没有分号——这完全合法。函数体的最后一个表达式就是返回值。

可以用 `return` 提前返回，这在需要提前退出时很有用：

<div class="code-runner" data-full-code="fn%20absolute_value(n%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20if%20n%20%3C%200%20%7B%0A%20%20%20%20%20%20%20%20return%20-n%3B%20%2F%2F%20%E6%8F%90%E5%89%8D%E8%BF%94%E5%9B%9E%0A%20%20%20%20%7D%0A%20%20%20%20n%20%2F%2F%20%E6%AD%A3%E5%B8%B8%E8%B7%AF%E5%BE%84%EF%BC%9A%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20absolute_value(-7))%3B%20%2F%2F%207%0A%20%20%20%20println!(%22%7B%7D%22%2C%20absolute_value(3))%3B%20%20%2F%2F%203%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> absolute_value</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#F97583"> -</span><span style="color:#E1E4E8">n; </span><span style="color:#6A737D">// 提前返回</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    n </span><span style="color:#6A737D">// 正常路径：最后一个表达式</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">absolute_value</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">-</span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 7</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">absolute_value</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 3</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 分号陷阱

这是 Rust 新手最常遇到的错误：在返回值表达式末尾多加了分号。

<div class="code-runner" data-full-code="fn%20plus_one(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20x%20%2B%201%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E5%8A%A0%E4%BA%86%E5%88%86%E5%8F%B7%EF%BC%8C%E5%8F%98%E6%88%90%E8%AF%AD%E5%8F%A5%EF%BC%8C%E6%B2%A1%E6%9C%89%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E9%9A%90%E5%BC%8F%E8%BF%94%E5%9B%9E%20()%EF%BC%8C%E4%B8%8E%E5%A3%B0%E6%98%8E%E7%9A%84%20i32%20%E4%B8%8D%E7%AC%A6%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20plus_one(5))%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> plus_one</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 错误：加了分号，变成语句，没有返回值，隐式返回 ()，与声明的 i32 不符</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">plus_one</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器会报 `mismatched types`，并贴心地提示”consider removing this semicolon”。记住规则：**函数体最后一行如果是返回值，不加分号**。

正确写法：

<div class="code-runner" data-full-code="fn%20plus_one(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20x%20%2B%201%20%2F%2F%20%E6%B2%A1%E6%9C%89%E5%88%86%E5%8F%B7%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20plus_one(5))%3B%20%2F%2F%20%E6%89%93%E5%8D%B0%206%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> plus_one</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#6A737D"> // 没有分号</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">plus_one</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 打印 6</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 函数基础测验

加载题目中…

加载题目中…

加载题目中…

## 语句与返回值测验

```rust
fn main() {
    let y = {
        let x = 10;
        x * 2
    };
    println!("{}", y);
}
```

加载题目中…

```rust
fn double(x: i32) -> i32 {
    x * 2;
}
```

加载题目中…

加载题目中…

## 编程练习

### 练习一：实现 add 函数

补全下面的函数，使其返回两个整数之和。注意不要在返回值表达式末尾加分号。

```rust
fn add(a: i32, b: i32) -> i32 {
    // TODO：返回 a + b
}

fn main() {
    println!("{}", add(3, 4));   // 应输出 7
    println!("{}", add(-1, 5));  // 应输出 4
}
```

### 练习二：温度转换

实现一个摄氏度转华氏度的函数。转换公式：`华氏度 = 摄氏度 × 9 / 5 + 32`。

```rust
fn celsius_to_fahrenheit(c: f64) -> f64 {
    // TODO：实现转换公式
}

fn main() {
    println!("{}°C = {:.1}°F", 0.0, celsius_to_fahrenheit(0.0));    // 0°C = 32.0°F
    println!("{}°C = {:.1}°F", 100.0, celsius_to_fahrenheit(100.0)); // 100°C = 212.0°F
    println!("{}°C = {:.1}°F", 37.0, celsius_to_fahrenheit(37.0));   // 37°C = 98.6°F
}
```