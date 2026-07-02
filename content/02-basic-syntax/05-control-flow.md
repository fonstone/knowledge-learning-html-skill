# 分支表达式

根据条件走不同的路，或者反复执行同一段代码——这就是**控制流**的本质。本文介绍 Rust 的 `if` 表达式和三种循环。

`if` 表达式让程序根据条件选择执行不同的代码块。

## 基本语法

关键字 `if`，后跟条件，再接花括号包裹的代码块。条件为真时执行该块，为假时执行可选的 `else` 块：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20number%20%3D%203%3B%0A%0A%20%20%20%20if%20number%20%3C%205%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%9D%A1%E4%BB%B6%E4%B8%BA%E7%9C%9F%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%9D%A1%E4%BB%B6%E4%B8%BA%E5%81%87%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"条件为真"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"条件为假"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`else` 分支是**可选的**。如果条件为假且没有 `else`，程序直接跳过 `if` 块，继续往下执行。

## 条件必须是 bool

Rust **不会**自动将其他类型转换为布尔值。如果把整数直接作为条件，编译器会报错：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20number%20%3D%203%3B%0A%20%20%20%20if%20number%20%7B%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E6%9C%9F%E6%9C%9B%20bool%EF%BC%8C%E5%BE%97%E5%88%B0%E6%95%B4%E6%95%B0%0A%20%20%20%20%20%20%20%20println!(%22number%20%E4%B8%8D%E7%AD%89%E4%BA%8E%E9%9B%B6%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> number {  </span><span style="color:#6A737D">// 错误：期望 bool，得到整数</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 不等于零"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这和 JavaScript 或 Ruby 不同——那些语言里 `0`、空字符串等会被隐式当作 `false`。Rust 要求你**显式写出条件**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20number%20%3D%203%3B%0A%20%20%20%20if%20number%20!%3D%200%20%7B%20%2F%2F%E9%A1%B5%E9%9D%A2%E4%B8%8A%E6%9C%89%E6%97%B6%E5%80%99%E4%BC%9A%E6%98%BE%E5%BC%8F%E4%B8%8D%E7%AD%89%E5%8F%B7%E4%B8%BA%E2%89%A0%EF%BC%8C%E8%BF%99%E9%87%8C%E6%98%AF%E6%98%BE%E5%BC%8F%E7%9A%84%E9%97%AE%E9%A2%98%EF%BC%8C%E4%BB%A3%E7%A0%81%E9%87%8C%E4%BB%8D%E5%86%99%E6%88%90%20!%20%2B%20%3D%0A%20%20%20%20%20%20%20%20println!(%22number%20%E4%B8%8D%E7%AD%89%E4%BA%8E%E9%9B%B6%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">!=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> { </span><span style="color:#6A737D">//页面上有时候会显式不等号为≠，这里是显式的问题，代码里仍写成 ! + =</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 不等于零"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这个设计让代码意图更清晰，也杜绝了一类依赖隐式转换的隐性 bug。

## else if 多重条件

需要检查多个条件时，可以用 `else if` 链：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20number%20%3D%206%3B%0A%0A%20%20%20%20if%20number%20%25%204%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20println!(%22number%20%E8%83%BD%E8%A2%AB%204%20%E6%95%B4%E9%99%A4%22)%3B%0A%20%20%20%20%7D%20else%20if%20number%20%25%203%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20println!(%22number%20%E8%83%BD%E8%A2%AB%203%20%E6%95%B4%E9%99%A4%22)%3B%0A%20%20%20%20%7D%20else%20if%20number%20%25%202%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20println!(%22number%20%E8%83%BD%E8%A2%AB%202%20%E6%95%B4%E9%99%A4%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22number%20%E4%B8%8D%E8%83%BD%E8%A2%AB%204%E3%80%813%20%E6%88%96%202%20%E6%95%B4%E9%99%A4%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 6</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 4</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 能被 4 整除"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 3</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 能被 3 整除"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 能被 2 整除"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 不能被 4、3 或 2 整除"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意：Rust 只会执行**第一个条件为真**的分支，然后直接跳过其余所有分支。6 同时能被 3 和 2 整除，但程序只会打印”能被 3 整除”——找到第一个匹配就停了。

> 如果 `else if` 链过长，代码会变得难以维护。Rust 有一个更强大的分支结构 [`match`](#/chapters/04-custom-types/04-match)，我们在自定义类型章节会详细讲解，它正是为处理多条件分支而生的。

## if 是表达式

这是 Rust 和许多语言的一个关键区别：`if` 在 Rust 中是**表达式**，不仅仅是语句——它可以返回一个值，可以用在赋值的右边。代码块的返回值是块中**最后一个表达式的值**；如果块中只有语句没有表达式，就隐式返回 `()`（之前讲过的单元类型）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20condition%20%3D%20true%3B%0A%20%20%20%20let%20number%20%3D%20if%20condition%20%7B%205%20%7D%20else%20%7B%206%20%7D%3B%0A%0A%20%20%20%20println!(%22number%20%E7%9A%84%E5%80%BC%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20number)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E5%88%86%E6%94%AF%E4%B8%AD%E5%8F%AA%E6%9C%89%E8%AF%AD%E5%8F%A5%EF%BC%8C%E5%B0%B1%E8%BF%94%E5%9B%9E%20()%0A%20%20%20%20let%20result%20%3D%20if%20condition%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%9D%A1%E4%BB%B6%E4%B8%BA%E7%9C%9F%22)%3B%20%2F%2F%20%E8%BF%99%E6%98%AF%E8%AF%AD%E5%8F%A5%EF%BC%8C%E6%B2%A1%E6%9C%89%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20()%0A%20%20%20%20%7D%3B%0A%20%20%20%20println!(%22result%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20()%3A%20%7B%3A%3F%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> condition </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> condition { </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 的值是：{}"</span><span style="color:#E1E4E8">, number);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果分支中只有语句，就返回 ()</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> condition {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"条件为真"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 这是语句，没有返回值</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        ()</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"result 的类型是 (): {:?}"</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`number` 会根据条件被绑定到 `5` 或 `6`。第二个例子中，`if` 分支中的 `println!` 是语句，没有返回值，所以 `result` 得到的是 `()`。

**两个分支的类型必须相同**。Rust 在编译时就需要确定变量的类型，如果两个分支返回不同类型，编译器无法决定 `number` 是什么类型：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20condition%20%3D%20true%3B%0A%20%20%20%20let%20number%20%3D%20if%20condition%20%7B%205%20%7D%20else%20%7B%20%22six%22%20%7D%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E6%95%B4%E6%95%B0%E4%B8%8E%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%85%BC%E5%AE%B9%0A%20%20%20%20println!(%22number%20%E7%9A%84%E5%80%BC%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20number)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> condition </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> condition { </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> { </span><span style="color:#9ECBFF">"six"</span><span style="color:#E1E4E8"> }; </span><span style="color:#6A737D">// 错误：整数与字符串类型不兼容</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number 的值是：{}"</span><span style="color:#E1E4E8">, number);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这种编译期类型检查是 Rust 安全保证的基础——运行时不会出现”这个变量到底是什么类型”的意外。

# 循环表达式

Rust 有三种循环：`loop`、`while`、`for`，各有适用场景。

## loop 无限循环

`loop` 是最基础的循环——它会**无限重复**执行代码块，直到你用 `break` 显式停止。

> 与 C 的 `while(1)` 不同，**Rust 编译器会进行控制流分析**。如果编译器发现某个分支永远无法到达 `break`，它会标记该代码为不可达（unreachable code）。这样能帮你提前发现意外的无限循环。但如果代码真的被设计为无限循环（比如 `loop { /* 故意死循环 */ }`），编译器也不会报错（没有不可到达的代码时，比如 main  函数里的顶层 loop，后面没有任何代码了），尊重你的设计意图。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%0A%20%20%20%20loop%20%7B%0A%20%20%20%20%20%20%20%20count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20println!(%22%E7%AC%AC%20%7B%7D%20%E6%AC%A1%E5%BE%AA%E7%8E%AF%22%2C%20count)%3B%0A%0A%20%20%20%20%20%20%20%20if%20count%20%3D%3D%203%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20break%3B%20%2F%2F%20%E6%BB%A1%E8%B6%B3%E6%9D%A1%E4%BB%B6%EF%BC%8C%E9%80%80%E5%87%BA%E5%BE%AA%E7%8E%AF%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E5%BE%AA%E7%8E%AF%E7%BB%93%E6%9D%9F%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第 {} 次循环"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            break</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 满足条件，退出循环</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"循环结束"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`continue` 关键字会跳过当前迭代剩余的代码，直接进入下一次迭代：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20i%20%3D%200%3B%0A%0A%20%20%20%20loop%20%7B%0A%20%20%20%20%20%20%20%20i%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20if%20i%20%3E%206%20%7B%20break%3B%20%7D%0A%0A%20%20%20%20%20%20%20%20if%20i%20%25%202%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20continue%3B%20%2F%2F%20%E8%B7%B3%E8%BF%87%E5%81%B6%E6%95%B0%EF%BC%8C%E4%B8%8D%E6%89%A7%E8%A1%8C%E4%B8%8B%E9%9D%A2%E7%9A%84%20println%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20i)%3B%20%2F%2F%20%E5%8F%AA%E6%89%93%E5%8D%B0%E5%A5%87%E6%95%B0%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        i </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 6</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            continue</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 跳过偶数，不执行下面的 println</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, i); </span><span style="color:#6A737D">// 只打印奇数</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 循环标签

嵌套循环中，`break` 和 `continue` 默认作用于**最内层**的循环。如果需要跳出外层循环，可以给循环贴上**标签**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%0A%20%20%20%20'counting_up%3A%20loop%20%7B%0A%20%20%20%20%20%20%20%20println!(%22count%20%3D%20%7B%7D%22%2C%20count)%3B%0A%20%20%20%20%20%20%20%20let%20mut%20remaining%20%3D%2010%3B%0A%0A%20%20%20%20%20%20%20%20loop%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22remaining%20%3D%20%7B%7D%22%2C%20remaining)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20remaining%20%3D%3D%209%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%20%2F%2F%20%E5%8F%AA%E9%80%80%E5%87%BA%E5%86%85%E5%B1%82%E5%BE%AA%E7%8E%AF%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20count%20%3D%3D%202%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%20'counting_up%3B%20%2F%2F%20%E9%80%80%E5%87%BA%E5%A4%96%E5%B1%82%E5%BE%AA%E7%8E%AF%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20remaining%20-%3D%201%3B%0A%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20count%20%2B%3D%201%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E6%9C%80%E7%BB%88%20count%20%3D%20%7B%7D%22%2C%20count)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    '</span><span style="color:#B392F0">counting_up</span><span style="color:#F97583">:</span><span style="color:#F97583"> loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count = {}"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> remaining </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"remaining = {}"</span><span style="color:#E1E4E8">, remaining);</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> remaining </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 9</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">                break</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 只退出内层循环</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">                break</span><span style="color:#E1E4E8"> '</span><span style="color:#B392F0">counting_up</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 退出外层循环</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">            remaining </span><span style="color:#F97583">-=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">        count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最终 count = {}"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

标签以单引号开头，如 `'counting_up`。`break 'counting_up` 会跳出被标记的那层循环，无论当前嵌套多深。

## while 条件循环

`while` 是”当条件为真时持续循环”的简洁写法。**`while` 先检查条件再执行循环体**——如果条件一开始就为假，循环体会一次都不执行。

Rust 没有 `do-while` 这样的”先执行后检查”的循环结构。如果你需要至少执行一次的循环，可以用 `loop` + `if` + `break` 的模式代替：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20number%20%3D%203%3B%0A%0A%20%20%20%20while%20number%20!%3D%200%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D!%22%2C%20number)%3B%0A%20%20%20%20%20%20%20%20number%20-%3D%201%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%E5%8F%91%E5%B0%84%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    while</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">!=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}!"</span><span style="color:#E1E4E8">, number);</span></span>
<span class="line"><span style="color:#E1E4E8">        number </span><span style="color:#F97583">-=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"发射！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这等价于 `loop` + `if` + `break` 的组合写法，但更简洁清晰。**当循环只有一个退出条件时，优先用 `while`。**

## for 遍历集合

`for` 循环用于遍历一个集合中的每个元素，是 Rust 中**最常用的循环**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%20%5B10%2C%2020%2C%2030%2C%2040%2C%2050%5D%3B%0A%0A%20%20%20%20for%20element%20in%20a%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%80%BC%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20element)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">40</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> element </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> a {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"值是：{}"</span><span style="color:#E1E4E8">, element);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对比用 `while` 手动管理索引，`for` 有明显优势：

- 不会越界 ：Rust 自动处理边界，不存在意外访问越界索引的风险
- 更简洁 ：不需要声明、更新索引变量
- 更安全 ：如果数组长度变了，不需要同步修改循环条件

### Range（范围）

在 Rust 中，`..` 和 `..=` 是**Range 操作符**，用来表示一个数值序列。它们经常配合 `for` 使用：

| 操作符 | 示例 | 具体数字 | 说明 |
| --- | --- | --- | --- |
| `..` | `1..5` | 1, 2, 3, 4 | 不含右端点（半开区间） |
| `..=` | `1..=5` | 1, 2, 3, 4, 5 | 含两个端点（闭区间） |
| `..` | `..5` | 0, 1, 2, 3, 4 | 从 0 开始，不含右端 |
| `..=` | `..=5` | 0, 1, 2, 3, 4, 5 | 从 0 开始，含右端 |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E5%90%AB%E5%8F%B3%E7%AB%AF%EF%BC%9A1%E3%80%812%E3%80%813%E3%80%814%0A%20%20%20%20for%20i%20in%201..5%20%7B%0A%20%20%20%20%20%20%20%20println!(%221..5%3A%20%7B%7D%22%2C%20i)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E5%90%AB%E4%B8%A4%E7%AB%AF%EF%BC%9A1%E3%80%812%E3%80%813%E3%80%814%E3%80%815%0A%20%20%20%20for%20i%20in%201..%3D5%20%7B%0A%20%20%20%20%20%20%20%20println!(%221..%3D5%3A%20%7B%7D%22%2C%20i)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E4%BB%8E%200%20%E5%BC%80%E5%A7%8B%EF%BC%9A0%E3%80%811%E3%80%812%E3%80%813%E3%80%814%0A%20%20%20%20for%20i%20in%20..5%20%7B%0A%20%20%20%20%20%20%20%20println!(%22..5%3A%20%7B%7D%22%2C%20i)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 不含右端：1、2、3、4</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1..5: {}"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 含两端：1、2、3、4、5</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1..=5: {}"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 从 0 开始：0、1、2、3、4</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#F97583"> ..</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"..5: {}"</span><span style="color:#E1E4E8">, i);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

使用 `Range` 配合 `.rev()` 来倒计时，这是 Rust 中的惯用写法：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20for%20number%20in%20(1..4).rev()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D!%22%2C%20number)%3B%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%E5%8F%91%E5%B0%84%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> number </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1</span><span style="color:#F97583">..</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">rev</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}!"</span><span style="color:#E1E4E8">, number);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"发射！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`(1..4).rev()` 先创建 Range `1..4`（即 1、2、3），再用 `.rev()` 反转为 3、2、1。

> 即使只是重复固定次数，Rustacean 也倾向于用 `for` + Range，而不是 `while`。`for` 更能表达”遍历一个序列”的意图，代码读起来也更直观。

## 循环作为表达式

在 Rust 中，**`loop`、`while`、`for` 都是表达式**（就像 `if` 一样），可以返回值。通常 `while` 和 `for` 返回 `()`，但 `loop` 可以通过 `break` 返回具体的值。

| 循环 | 返回值 | 用法 |
| --- | --- | --- |
| `loop` | 任意类型（由 `break` 决定） | 可用 `break value` 提取结果 |
| `while` | 通常是 `()` | 循环完成后返回 `()` |
| `for` | 通常是 `()` | 遍历完成后返回 `()` |

**代码对比**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20loop%20%E4%BD%9C%E4%B8%BA%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%8C%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20%20%20let%20result1%20%3D%20loop%20%7B%0A%20%20%20%20%20%20%20%20break%2042%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20println!(%22loop%20%E8%BF%94%E5%9B%9E%3A%20%7B%7D%22%2C%20result1)%3B%20%2F%2F%2042%0A%0A%20%20%20%20%2F%2F%20while%20%E4%BD%9C%E4%B8%BA%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%8C%E8%BF%94%E5%9B%9E%20()%0A%20%20%20%20let%20result2%20%3D%20while%20true%20%7B%20break%3B%20%7D%3B%0A%20%20%20%20println!(%22while%20%E8%BF%94%E5%9B%9E%3A%20%7B%3A%3F%7D%22%2C%20result2)%3B%20%2F%2F%20()%0A%0A%20%20%20%20%2F%2F%20for%20%E4%BD%9C%E4%B8%BA%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%8C%E8%BF%94%E5%9B%9E%20()%0A%20%20%20%20let%20result3%20%3D%20for%20i%20in%201..%3D3%20%7B%20println!(%22%7B%7D%22%2C%20i)%3B%20%7D%3B%0A%20%20%20%20println!(%22for%20%E8%BF%94%E5%9B%9E%3A%20%7B%3A%3F%7D%22%2C%20result3)%3B%20%2F%2F%20()%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // loop 作为表达式，返回值</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        break</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"loop 返回: {}"</span><span style="color:#E1E4E8">, result1); </span><span style="color:#6A737D">// 42</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // while 作为表达式，返回 ()</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> while</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">; };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"while 返回: {:?}"</span><span style="color:#E1E4E8">, result2); </span><span style="color:#6A737D">// ()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // for 作为表达式，返回 ()</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result3 </span><span style="color:#F97583">=</span><span style="color:#F97583"> for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, i); };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"for 返回: {:?}"</span><span style="color:#E1E4E8">, result3); </span><span style="color:#6A737D">// ()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这种设计让 Rust 在表达式的层面保持了一致性——几乎所有控制流结构都遵循”表达式返回值”的原则。

# 练习题

## if 表达式测验

```rust
fn main() {
    let x = 10;
    let result = if x > 5 { x * 2 } else { x + 1 };
    println!("{}", result);
}
```

加载题目中…

加载题目中…

```rust
fn main() {
    let val = if true { 42 } else { "hello" };
    println!("{}", val);
}
```

加载题目中…

## 循环测验

```rust
fn main() {
    let result = loop {
        break 42;
    };
    println!("{}", result);
}
```

加载题目中…

```rust
fn main() {
    let mut i = 0;
    'outer: loop {
        loop {
            if i == 2 {
                break 'outer;
            }
            i += 1;
        }
    }
    println!("{}", i);
}
```

加载题目中…

加载题目中…

## 编程练习

### 练习一：FizzBuzz

经典的 FizzBuzz 问题：用 `for` 循环打印 1 到 20。能被 3 整除打印 `Fizz`，能被 5 整除打印 `Buzz`，既能被 3 也能被 5 整除打印 `FizzBuzz`，其余打印数字本身。

```rust
fn main() {
    for i in 1..=20 {
        // TODO：根据条件打印 Fizz、Buzz、FizzBuzz 或数字
        println!("{}", i);
    }
}
```

### 练习二：改写为 for 循环

下面用 `while` + 手动索引遍历数组，容易因索引出错导致 panic。请改写为等价的 `for` 循环，使代码更简洁、安全。

```rust
fn main() {
    let numbers = [1, 2, 3, 4, 5];
    let mut index = 0;

    while index < 5 {
        println!("值：{}", numbers[index]);
        index += 1;
    }
}
```