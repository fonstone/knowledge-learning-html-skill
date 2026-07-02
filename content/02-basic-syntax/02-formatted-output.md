# 基础输出

`println!` 是你写下的第一行 Rust 代码就用到的工具，但它的能力远不止打印一句话。Rust 的格式化系统统一处理所有打印相关的操作，并且格式字符串的正确性在**编译时**就能检查——拼写错一个占位符，直接报编译错误，不会等到运行时才发现。

## 五个打印宏

`std::fmt` 模块（Rust 提供的标准库的模块，通常自动加载）提供了五个打印宏，记住它们的分工：

| 宏 | 输出目标 | 换行 |
| --- | --- | --- |
| `print!` | 标准输出（stdout） | 否 |
| `println!` | 标准输出（stdout） | **是** |
| `format!` | 返回 `String`，不输出 | — |
| `eprint!` | 标准错误（stderr） | 否 |
| `eprintln!` | 标准错误（stderr） | **是** |

**stdout 与 stderr 的区别**：操作系统为每个程序提供了两条独立的输出通道。`print!/println!` 写入 **stdout**（标准输出），用于程序的正常运行结果；`eprint!/eprintln!` 写入 **stderr**（标准错误），用于错误信息、警告和调试诊断。

在终端里两者看起来一样，但它们的用途不同，分开写的好处在于：用户可以把正常输出重定向到文件（`./app > output.txt`），而错误信息仍然显示在终端上；或者反过来只捕获错误（`./app 2> error.log`）。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20print!(%22%E6%B2%A1%E6%9C%89%E6%8D%A2%E8%A1%8C%22)%3B%0A%20%20%20%20print!(%22%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9C%A8%E5%90%8C%E4%B8%80%E8%A1%8C%5Cn%22)%3B%20%2F%2F%20%E6%89%8B%E5%8A%A8%E5%8A%A0%E6%8D%A2%E8%A1%8C%0A%0A%20%20%20%20println!(%22%E8%BF%99%E8%A1%8C%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%A1%8C%22)%3B%0A%0A%20%20%20%20let%20s%20%3D%20format!(%22%E6%8B%BC%E6%8E%A5%E6%88%90%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%9A%7B%7D%20%2B%20%7B%7D%20%3D%20%7B%7D%22%2C%201%2C%202%2C%203)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%BB%88%E7%AB%AF%E9%80%9A%E5%B8%B8%E4%B9%9F%E8%83%BD%E7%9C%8B%E5%88%B0%EF%BC%8C%E4%BD%86%E5%8D%9A%E4%B8%BB%E8%AF%95%E4%BA%86%E7%BD%91%E9%A1%B5%E5%A5%BD%E5%83%8F%E7%9C%8B%E4%B8%8D%E5%88%B0%0A%20%20%20%20eprintln!(%22%E8%BF%99%E6%98%AF%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF%EF%BC%8C%E8%BE%93%E5%87%BA%E5%88%B0%20stderr%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    print!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"没有换行"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    print!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"，继续在同一行</span><span style="color:#79B8FF">\n</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 手动加换行</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这行自动换行"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"拼接成字符串：{} + {} = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 终端通常也能看到，但博主试了网页好像看不到</span></span>
<span class="line"><span style="color:#B392F0">    eprintln!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这是错误信息，输出到 stderr"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `format!` 是”静默”版本，不打印，只返回 `String`，在需要构建字符串时很有用：`let msg = format!("Hello, {}!", name);`

## `{}` 与 `{:?}`：两种格式化方式

Rust 的占位符有两类，对应两种格式化 trait（后面章节会讲解）：

| 占位符 | 对应 trait | 设计目标 |
| --- | --- | --- |
| `{}` | `Display` | 面向用户的友好展示 |
| `{:?}` | `Debug` | 面向开发者的调试信息 |
| `{:#?}` | `Debug`（美化版） | 多行缩进，结构更清晰 |

**Display** 和 **Debug** 是两个 trait（可以理解为”能力接口”）：

- `Display` ：定义类型”给人看”时的样子。 42 、 "hello" 、 true 这些基本类型都实现了它，但自定义的结构体默认没有，需要手动实现。
- `Debug` ：定义类型”供调试用”时的样子，格式更详细，通常包含类型名和字段名。可以用 #[derive(Debug)] 让编译器自动生成，不需要手写。

简单记：**开发阶段看数据用 `{:?}`，给用户展示用 `{}`**。

> trait 是 Rust 的核心概念，相当于其他语言的”接口”或”协议”。如何自定义 `Display`（控制 `{}` 输出格式）会在**泛型与 Trait 章节**中详细讲解。现在只需知道怎么用 `{:?}` 和 `{:#?}` 就够了。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%7B%7D%20%E5%8F%AA%E5%AF%B9%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%9C%89%E6%95%88%0A%20%20%20%20%2F%2F%20Vec%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Display%EF%BC%8C%E4%B8%8B%E9%9D%A2%E8%BF%99%E8%A1%8C%E4%BC%9A%E7%BC%96%E8%AF%91%E6%8A%A5%E9%94%99%EF%BC%9A%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20v)%3B%0A%0A%20%20%20%20%2F%2F%20%7B%3A%3F%7D%20%E5%AF%B9%E6%89%80%E6%9C%89%E5%AE%9E%E7%8E%B0%E4%BA%86%20Debug%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%9C%89%E6%95%88%EF%BC%8CVec%20%E9%BB%98%E8%AE%A4%E6%94%AF%E6%8C%81%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%20%20%2F%2F%20%5B1%2C%202%2C%203%5D%0A%0A%20%20%20%20%2F%2F%20%7B%3A%23%3F%7D%20%E7%BE%8E%E5%8C%96%E6%89%93%E5%8D%B0%EF%BC%8C%E5%A4%9A%E8%A1%8C%E7%BC%A9%E8%BF%9B%0A%20%20%20%20println!(%22%7B%3A%23%3F%7D%22%2C%20v)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // {} 只对实现了 Display 的类型有效</span></span>
<span class="line"><span style="color:#6A737D">    // Vec 没有实现 Display，下面这行会编译报错：</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", v);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // {:?} 对所有实现了 Debug 的类型有效，Vec 默认支持</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v);   </span><span style="color:#6A737D">// [1, 2, 3]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // {:#?} 美化打印，多行缩进</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#?}"</span><span style="color:#E1E4E8">, v);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对于基本类型（数字、字符串、布尔值、元组等），`{}` 和 `{:?}` 都能用。对于自定义类型（结构体、枚举、集合等），需要先告诉 Rust 如何格式化它们。

## 为自定义类型启用调试输出

> 自定义类型是用户自己定义的数据类型（通常是结构体、枚举等），将会在[自定义数据类型](#/chapters/04-custom-types/00-index)章节讲解。现在只需要知道其并非 Rust 原生已经完全定义的类型即可。

通过 `#[derive(Debug)]` 属性，可以让编译器**自动生成** `Debug` trait 的实现，不需要手写任何代码。

> `#[...]` 这种写法叫**属性（Attribute）**，会在本章[属性一节](#/chapters/02-basic-syntax/07-attributes)详细讲解。现在只需要知道：把 `#[derive(Debug)]` 写在结构体上方，就能让它支持 `{:?}` 打印。

<div class="code-runner" data-full-code="%2F%2F%20%E5%8A%A0%E4%B8%8A%E8%BF%99%E4%B8%80%E8%A1%8C%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E8%87%AA%E5%8A%A8%E5%B8%AE%E4%BD%A0%E5%AE%9E%E7%8E%B0%20%7B%3A%3F%7D%20%E6%A0%BC%E5%BC%8F%E5%8C%96%0A%23%5Bderive(Debug)%5D%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0A%23%5Bderive(Debug)%5D%0Astruct%20Rectangle%20%7B%0A%20%20%20%20top_left%3A%20Point%2C%0A%20%20%20%20bottom_right%3A%20Point%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20rect%20%3D%20Rectangle%20%7B%0A%20%20%20%20%20%20%20%20top_left%3A%20Point%20%7B%20x%3A%200.0%2C%20y%3A%2010.0%20%7D%2C%0A%20%20%20%20%20%20%20%20bottom_right%3A%20Point%20%7B%20x%3A%205.0%2C%20y%3A%200.0%20%7D%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20rect)%3B%20%20%20%2F%2F%20%E5%8D%95%E8%A1%8C%0A%20%20%20%20println!(%22%7B%3A%23%3F%7D%22%2C%20rect)%3B%20%20%2F%2F%20%E5%A4%9A%E8%A1%8C%E7%BE%8E%E5%8C%96%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 加上这一行，编译器自动帮你实现 {:?} 格式化</span></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    top_left</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    bottom_right</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> rect </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        top_left</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10.0</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">        bottom_right</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, rect);   </span><span style="color:#6A737D">// 单行</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#?}"</span><span style="color:#E1E4E8">, rect);  </span><span style="color:#6A737D">// 多行美化</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 参数引用：位置与命名

除了按顺序填充 `{}`，还可以用**位置索引**或**命名参数**更灵活地引用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%A1%BA%E5%BA%8F%E5%A1%AB%E5%85%85%EF%BC%9A%E6%8C%89%E5%87%BA%E7%8E%B0%E9%A1%BA%E5%BA%8F%E4%BE%9D%E6%AC%A1%E6%9B%BF%E6%8D%A2%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%20%7B%7D%22%2C%20%22a%22%2C%20%22b%22%2C%20%22c%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BD%8D%E7%BD%AE%E7%B4%A2%E5%BC%95%EF%BC%9A%E5%8F%AF%E4%BB%A5%E9%87%8D%E5%A4%8D%E4%BD%BF%E7%94%A8%E5%90%8C%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%0A%20%20%20%20println!(%22%7B0%7D%20%7B1%7D%20%7B0%7D%22%2C%20%22Alice%22%2C%20%22Bob%22)%3B%20%2F%2F%20Alice%20Bob%20Alice%0A%0A%20%20%20%20%2F%2F%20%E5%91%BD%E5%90%8D%E5%8F%82%E6%95%B0%EF%BC%9A%E6%9B%B4%E6%98%93%E8%AF%BB%0A%20%20%20%20println!(%0A%20%20%20%20%20%20%20%20%22%7Bsubject%7D%20%7Bverb%7D%20%7Bobject%7D%22%2C%0A%20%20%20%20%20%20%20%20verb%20%3D%20%22%E8%BF%BD%22%2C%0A%20%20%20%20%20%20%20%20object%20%3D%20%22%E5%B0%8F%E9%B1%BC%22%2C%0A%20%20%20%20%20%20%20%20subject%20%3D%20%22%E5%B0%8F%E7%8C%AB%22%2C%0A%20%20%20%20)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 顺序填充：按出现顺序依次替换</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {} {}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"c"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 位置索引：可以重复使用同一个参数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{0} {1} {0}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Bob"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// Alice Bob Alice</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 命名参数：更易读</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#9ECBFF">        "{subject} {verb} {object}"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        verb </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "追"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        object </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "小鱼"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        subject </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "小猫"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    );</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 常用格式规范

在 `{}` 的 `:` 后面可以加格式规范，控制数制、宽度、对齐和精度：

### 进制输出

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20n%20%3D%20255%3B%0A%20%20%20%20println!(%22%E5%8D%81%E8%BF%9B%E5%88%B6%3A%20%7B%7D%22%2C%20%20%20n)%3B%20%20%20%20%20%20%2F%2F%20255%0A%20%20%20%20println!(%22%E4%BA%8C%E8%BF%9B%E5%88%B6%3A%20%7B%3Ab%7D%22%2C%20n)%3B%20%20%20%20%20%20%2F%2F%2011111111%0A%20%20%20%20println!(%22%E5%85%AB%E8%BF%9B%E5%88%B6%3A%20%7B%3Ao%7D%22%2C%20n)%3B%20%20%20%20%20%20%2F%2F%20377%0A%20%20%20%20println!(%22%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6(%E5%B0%8F)%3A%20%7B%3Ax%7D%22%2C%20n)%3B%20%2F%2F%20ff%0A%20%20%20%20println!(%22%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6(%E5%A4%A7)%3A%20%7B%3AX%7D%22%2C%20n)%3B%20%2F%2F%20FF%0A%20%20%20%20println!(%22%E5%B8%A6%E5%89%8D%E7%BC%80%3A%20%20%7B%3A%23x%7D%22%2C%20n)%3B%20%20%20%20%2F%2F%200xff%0A%20%20%20%20println!(%22%E5%B8%A6%E5%89%8D%E7%BC%80%3A%20%20%7B%3A%23b%7D%22%2C%20n)%3B%20%20%20%20%2F%2F%200b11111111%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 255</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"十进制: {}"</span><span style="color:#E1E4E8">,   n);      </span><span style="color:#6A737D">// 255</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"二进制: {:b}"</span><span style="color:#E1E4E8">, n);      </span><span style="color:#6A737D">// 11111111</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"八进制: {:o}"</span><span style="color:#E1E4E8">, n);      </span><span style="color:#6A737D">// 377</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"十六进制(小): {:x}"</span><span style="color:#E1E4E8">, n); </span><span style="color:#6A737D">// ff</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"十六进制(大): {:X}"</span><span style="color:#E1E4E8">, n); </span><span style="color:#6A737D">// FF</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"带前缀:  {:#x}"</span><span style="color:#E1E4E8">, n);    </span><span style="color:#6A737D">// 0xff</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"带前缀:  {:#b}"</span><span style="color:#E1E4E8">, n);    </span><span style="color:#6A737D">// 0b11111111</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 宽度与对齐

宽度规范会为输出内容分配一个**指定宽度的”格子”**，当内容不足这个宽度时，用空格（或指定字符）填满——对齐方式决定内容靠哪边放。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%B3%E5%AF%B9%E9%BD%90%EF%BC%88%E9%BB%98%E8%AE%A4%EF%BC%89%EF%BC%8C%E5%AE%BD%E5%BA%A6%2020%0A%20%20%20%20println!(%22%7B%3A%3E20%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20hello%0A%0A%20%20%20%20%2F%2F%20%E5%B7%A6%E5%AF%B9%E9%BD%90%EF%BC%8C%E5%AE%BD%E5%BA%A6%2010%0A%20%20%20%20println!(%22%7B%3A%3C10%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20hello%0A%0A%20%20%20%20%2F%2F%20%E5%B1%85%E4%B8%AD%EF%BC%8C%E5%AE%BD%E5%BA%A6%2010%0A%20%20%20%20println!(%22%7B%3A%5E10%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20%20%20hello%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%E6%8C%87%E5%AE%9A%E5%AD%97%E7%AC%A6%E5%A1%AB%E5%85%85%EF%BC%88%E8%BF%99%E9%87%8C%E7%94%A8%20'-'%EF%BC%89%EF%BC%8C%E5%AE%BD%E5%BA%A6%2010%0A%20%20%20%20println!(%22%7B%3A-%5E10%7D%22%2C%20%22hello%22)%3B%20%20%2F%2F%20--hello---%0A%0A%20%20%20%20%2F%2F%20%E6%95%B0%E5%AD%97%E8%A1%A5%E9%9B%B6%EF%BC%8C%E5%AE%BD%E5%BA%A6%206%0A%20%20%20%20println!(%22%7B%3A0%3E6%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%2F%2F%20000042%0A%20%20%20%20%2F%2F%20%E7%AD%89%E4%BB%B7%E5%86%99%E6%B3%95%0A%20%20%20%20println!(%22%7B%3A06%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%20%2F%2F%20000042%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 右对齐（默认），宽度 20</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&gt;20}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">//                hello</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 左对齐，宽度 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&lt;10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// hello</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 居中，宽度 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:^10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">//   hello</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用指定字符填充（这里用 '-'），宽度 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:-^10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// --hello---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 数字补零，宽度 6</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:0&gt;6}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);        </span><span style="color:#6A737D">// 000042</span></span>
<span class="line"><span style="color:#6A737D">    // 等价写法</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:06}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);         </span><span style="color:#6A737D">// 000042</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 小数精度

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20pi%20%3D%203.141592653589793%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20pi)%3B%20%20%20%20%20%20%20%20%2F%2F%20%E5%AE%8C%E6%95%B4%E7%B2%BE%E5%BA%A6%0A%20%20%20%20println!(%22%7B%3A.2%7D%22%2C%20pi)%3B%20%20%20%20%20%2F%2F%20%E4%BF%9D%E7%95%99%202%20%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%9A3.14%0A%20%20%20%20println!(%22%7B%3A.5%7D%22%2C%20pi)%3B%20%20%20%20%20%2F%2F%20%E4%BF%9D%E7%95%99%205%20%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%9A3.14159%0A%20%20%20%20println!(%22%7B%3A8.3%7D%22%2C%20pi)%3B%20%20%20%20%2F%2F%20%E5%AE%BD%E5%BA%A6%208%EF%BC%8C3%20%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%9A%20%20%203.142%0A%20%20%20%20println!(%22%7B%3A08.3%7D%22%2C%20pi)%3B%20%20%20%2F%2F%20%E5%AE%BD%E5%BA%A6%208%EF%BC%8C3%20%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%8C%E8%A1%A5%E9%9B%B6%EF%BC%9A0003.142%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> pi </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3.141592653589793</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, pi);        </span><span style="color:#6A737D">// 完整精度</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:.2}"</span><span style="color:#E1E4E8">, pi);     </span><span style="color:#6A737D">// 保留 2 位小数：3.14</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:.5}"</span><span style="color:#E1E4E8">, pi);     </span><span style="color:#6A737D">// 保留 5 位小数：3.14159</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:8.3}"</span><span style="color:#E1E4E8">, pi);    </span><span style="color:#6A737D">// 宽度 8，3 位小数：   3.142</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:08.3}"</span><span style="color:#E1E4E8">, pi);   </span><span style="color:#6A737D">// 宽度 8，3 位小数，补零：0003.142</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 小结

| 场景 | 写法 |
| --- | --- |
| 普通打印 | `println!("{}", val)` |
| 调试打印 | `println!("{:?}", val)` 需要 `#[derive(Debug)]` |
| 美化调试 | `println!("{:#?}", val)` |
| 构建字符串 | `format!("...")` |
| 二进制/十六进制 | `{:b}` / `{:x}` / `{:#x}` |
| 固定宽度 | `{:>10}` / `{:<10}` / `{:^10}` |
| 小数位数 | `{:.2}` |

实现自定义类型的 `Display`（控制 `{}` 的输出格式）属于进阶内容，会在[格式化输出进阶](#/chapters/22-advanced/06-advanced-formatting)中详细讲解。

# 练习题

## 选择正确的宏

加载题目中…

## `{}` 与 `{:?}` 的区别

```rust
#[derive(Debug)]
struct Foo(i32);

fn main() {
    let f = Foo(42);
    println!("{:?}", f);
    // println!("{}", f); // 这行会编译报错
}
```

加载题目中…

## `#[derive(Debug)]` 的作用

加载题目中…

## 格式规范识别

加载题目中…

## stderr 与 stdout

加载题目中…

## 编程练习

补全下面程序，让序号用零补齐到 2 位宽度输出（`01`、`02`……而不是 `1`、`2`……）。

```rust
fn main() {
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (i, day) in days.iter().enumerate() {
        // TODO：序号从 1 开始，宽度 2，用零补齐
        println!("{} {}", i + 1, day);
    }
}
```