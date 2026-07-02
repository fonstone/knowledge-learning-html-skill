学一门语言，第一步永远是同一件事：弄清楚它的基本构成要素——变量怎么声明，类型系统什么样，怎么写条件分支和循环，怎么定义函数。

这些东西在各门语言里大同小异，但 Rust 有几处独特的地方值得注意。比如变量默认不可变，比如 `if` 是表达式而不是语句，比如函数的返回值是最后一个表达式的值而不是 `return`。这些设计选择背后都有原因，理解了原因，规则就不难记住。

本章把这些基础语法挨个讲清楚，外加属性和宏两个 Rust 特有的概念。

## 一段代码，看懂本章要学什么

下面这段代码虽然不长，但用到了本章涵盖的大部分内容——变量、数据类型、函数、控制流、循环和格式化输出：

<div class="code-runner" data-full-code="%2F%2F%20%E6%A0%B9%E6%8D%AE%E5%88%86%E6%95%B0%E5%88%A4%E6%96%AD%E7%AD%89%E7%BA%A7%EF%BC%88%E5%87%BD%E6%95%B0%20%2B%20%E6%8E%A7%E5%88%B6%E6%B5%81%EF%BC%89%0Afn%20grade(score%3A%20u32)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20if%20score%20%3E%3D%2090%20%7B%0A%20%20%20%20%20%20%20%20%22%E4%BC%98%E7%A7%80%22%0A%20%20%20%20%7D%20else%20if%20score%20%3E%3D%2080%20%7B%0A%20%20%20%20%20%20%20%20%22%E8%89%AF%E5%A5%BD%22%0A%20%20%20%20%7D%20else%20if%20score%20%3E%3D%2060%20%7B%0A%20%20%20%20%20%20%20%20%22%E5%8F%8A%E6%A0%BC%22%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%22%E4%B8%8D%E5%8F%8A%E6%A0%BC%22%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%98%E9%87%8F%E4%B8%8E%E6%95%B0%E7%BB%84%0A%20%20%20%20let%20scores%20%3D%20%5B95%2C%2082%2C%2061%2C%2045%5D%3B%0A%0A%20%20%20%20%2F%2F%20for%20%E5%BE%AA%E7%8E%AF%E9%81%8D%E5%8E%86%0A%20%20%20%20for%20score%20in%20scores%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E6%A0%BC%E5%BC%8F%E5%8C%96%E8%BE%93%E5%87%BA%EF%BC%88println!%20%E5%AE%8F%EF%BC%89%0A%20%20%20%20%20%20%20%20println!(%22%E5%88%86%E6%95%B0%20%7B%3A%3E3%7D%EF%BC%9A%7B%7D%22%2C%20score%2C%20grade(score))%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 根据分数判断等级（函数 + 控制流）</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> grade</span><span style="color:#E1E4E8">(score</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> score </span><span style="color:#F97583">&gt;=</span><span style="color:#79B8FF"> 90</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "优秀"</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> score </span><span style="color:#F97583">&gt;=</span><span style="color:#79B8FF"> 80</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "良好"</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> score </span><span style="color:#F97583">&gt;=</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "及格"</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        "不及格"</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 变量与数组</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> scores </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">95</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">82</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">61</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">45</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // for 循环遍历</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> score </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> scores {</span></span>
<span class="line"><span style="color:#6A737D">        // 格式化输出（println! 宏）</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"分数 {:&gt;3}：{}"</span><span style="color:#E1E4E8">, score, </span><span style="color:#B392F0">grade</span><span style="color:#E1E4E8">(score));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

读完本章，你会知道这段代码里每一行是什么意思，也能自己写出类似的程序。

> 如果你是有经验的程序员，前几节可以快速浏览——重点关注和你熟悉语言的**差异**，而不是从零理解每个概念。

## 本章目录

| 文章 | 主要内容 |
| --- | --- |
| [注释](#/chapters/01-comments) | 行注释、块注释与文档注释的写法和用途 |
| [格式化输出](#/chapters/02-formatted-output) | `println!` 宏的各种格式化占位符，调试打印与自定义格式 |
| [数据类型](#/chapters/03-data-types) | 整数、浮点、布尔、字符等基础类型，以及元组和数组 |
| [变量与可变性](#/chapters/04-variables) | `let` 绑定、默认不可变、`mut`、常量与遮蔽（shadowing） |
| [控制流](#/chapters/05-control-flow) | `if` 表达式、`loop`、`while`、`for` 循环的语法与特性 |
| [函数](#/chapters/06-functions) | 函数定义、参数、返回值，以及表达式与语句的区别 |
| [属性](#/chapters/07-attributes) | `#[...]` 属性的作用：控制编译行为、附加元数据 |
| [宏](#/chapters/08-macros) | Rust 宏的基本概念，常用内置宏一览 |
| [综合练习](#/chapters/09-practice) | 用本章所学语法完成编程练习，巩固基础 |