# 过程宏是什么

## 先回顾声明宏

你在前面学过 `macro_rules!`，它通过**模式匹配**来生成代码：

<div class="code-runner" data-full-code="macro_rules!%20say_hello%20%7B%0A%20%20%20%20(%24name%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20%24name)%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20say_hello!(%22Alice%22)%3B%20%2F%2F%20%E5%B1%95%E5%BC%80%E4%B8%BA%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20%22Alice%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> say_hello</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">name</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，{}！"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">name);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    say_hello!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 展开为 println!("你好，{}！", "Alice");</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`macro_rules!` 的工作方式：**匹配输入的”形状”，按模板替换**。

这很强大，但有一个根本限制：你只能做**模式替换**，无法运行任意逻辑。

比如，你想根据结构体的字段数量生成不同的代码——`macro_rules!` 做不到，因为它不能”查看”结构体有几个字段。

## 过程宏：真正的 Rust 程序

**过程宏（Procedural Macro）** 是完全不同的一种宏。

它是一段真正运行的 Rust 程序，在**编译时**被调用：

```text
你的源代码
    ↓
编译器遇到 #[derive(MyMacro)]
    ↓
调用你写的 Rust 程序（过程宏函数）
    ↓
你的程序接收 TokenStream（一串 token），可以运行任意逻辑
    ↓
输出新的 TokenStream（生成的代码）
    ↓
编译器把生成的代码和原代码合在一起继续编译
```

**声明宏 vs 过程宏：**

|  | 声明宏 `macro_rules!` | 过程宏 |
| --- | --- | --- |
| 实现方式 | 模式匹配替换 | 运行任意 Rust 代码 |
| 能力 | 只能做文本模板替换 | 可以分析 AST、运行逻辑、生成任意代码 |
| 错误提示 | 有限 | 可自定义详细错误信息 |
| 典型用途 | 简单代码生成 | `#[derive(Serialize)]`、`#[test]`、`sqlx::query!` |

表格里多次出现了 `TokenStream` 这个词。要理解过程宏，必须先搞清楚它是什么。

## TokenStream：一串 token

过程宏接收和输出的是 **`TokenStream`**——编译器把源码解析成的”token 序列”。

“token”就是源码的最小语法单元，比如：

```text
struct Point { x: i32, y: i32 }
```

被分解成这些 token：

```text
`struct` `Point` `{` `x` `:` `i32` `,` `y` `:` `i32` `}`
```

过程宏函数的签名形式固定：

```rust
// 接收 token 序列，返回新的 token 序列
fn my_macro(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // 可以读取 input 里的内容，生成新代码
    input // 最简单的情况：原样返回
}
```

## 三种过程宏

Rust 有三种不同形式的过程宏，分别用于不同场景：

### 1. 自定义 Derive 宏

最常见。为结构体或枚举自动实现 trait：

```rust
#[derive(Debug, Clone, Serialize)]  // Debug 和 Clone 是内置，Serialize 是 serde 库提供的
struct Point { x: f64, y: f64 }
```

你自己写一个 `#[derive(MyTrait)]`，让用户一行代码就能自动实现你的 trait。

### 2. 类属性宏

像内置属性一样，可以加在任意代码项上，并修改或替换该项：

```rust
#[route(GET, "/")]       // web 框架用属性宏标注路由
async fn index() { ... }

#[instrument]            // tracing 库的属性宏，自动追踪函数调用
fn my_function() { ... }
```

### 3. 类函数宏

看起来像函数调用（带 `!`），但能处理任意 token：

```rust
let query = sql!(SELECT * FROM users WHERE id = 42);
// sql! 是过程宏，可以在编译时验证 SQL 语句的语法！
```

# 搭建过程宏项目

## 为什么需要独立 crate

**过程宏必须放在独立的 crate 里。** 这是 Rust 编译器的硬性要求。

原因是：过程宏在**编译你的代码时**运行，而不是在运行时。编译器需要先编译过程宏，才能用它来编译你的项目。如果把过程宏和普通代码放在一起，就会产生循环依赖。

典型的项目结构：

```text
my-project/           ← 你的主项目
├── Cargo.toml
├── src/
│   └── main.rs       ← 使用过程宏的代码
│
└── my-macros/        ← 独立的过程宏 crate
    ├── Cargo.toml
    └── src/
        └── lib.rs    ← 过程宏的实现
```

## 过程宏 crate 的 Cargo.toml

过程宏 crate 需要在 `Cargo.toml` 中声明 `proc-macro = true`：

```toml
# my-macros/Cargo.toml
[package]
name = "my-macros"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true    # 告诉编译器这是一个过程宏 crate

[dependencies]
# 通常需要这两个库（后面章节会详细讲）
syn = "2"
quote = "1"
```

主项目依赖它：

```toml
# my-project/Cargo.toml
[dependencies]
my-macros = { path = "./my-macros" }
```

## 第一个过程宏：什么都不做

先写一个最简单的过程宏——接收输入，原样返回：

```rust
// my-macros/src/lib.rs

use proc_macro::TokenStream;

// #[proc_macro_derive(DoNothing)] 声明这是一个 derive 宏，名字叫 DoNothing
#[proc_macro_derive(DoNothing)]
pub fn do_nothing_derive(input: TokenStream) -> TokenStream {
    // 原样返回输入，不做任何修改
    input
}
```

用它：

```rust
// my-project/src/main.rs
use my_macros::DoNothing;

#[derive(DoNothing)]  // 什么都不做，只是演示结构
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    println!("编译成功！");
}
```

> **注意**：以上代码需要在有独立 proc-macro crate 的项目中运行，无法在 Rust Playground 中直接运行。可以用 `cargo new my-project` 新建项目，然后按上面的结构创建。

## 过程宏能做到什么（预告）

来看几个你已经每天都在用的过程宏：

<div class="code-runner" data-full-code="%2F%2F%20%23%5Bderive(Debug)%5D%20%E6%98%AF%E4%B8%80%E4%B8%AA%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%88%E7%BC%96%E8%AF%91%E5%99%A8%E5%86%85%E7%BD%AE%E5%AE%9E%E7%8E%B0%EF%BC%89%0A%2F%2F%20%E5%AE%83%E8%AF%BB%E5%8F%96%E7%BB%93%E6%9E%84%E4%BD%93%E7%9A%84%E5%AD%97%E6%AE%B5%E5%90%8D%E5%92%8C%E7%B1%BB%E5%9E%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20Debug%20%E5%AE%9E%E7%8E%B0%0A%23%5Bderive(Debug%2C%20Clone%2C%20PartialEq)%5D%0Astruct%20User%20%7B%0A%20%20%20%20name%3A%20String%2C%0A%20%20%20%20age%3A%20u32%2C%0A%20%20%20%20active%3A%20bool%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20u1%20%3D%20User%20%7B%20name%3A%20%22Alice%22.into()%2C%20age%3A%2028%2C%20active%3A%20true%20%7D%3B%0A%20%20%20%20let%20u2%20%3D%20u1.clone()%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Clone%20%E6%9D%A5%E8%87%AA%20derive(Clone)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20u1)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20Debug%20%E6%9D%A5%E8%87%AA%20derive(Debug)%0A%20%20%20%20println!(%22%7B%7D%22%2C%20u1%20%3D%3D%20u2)%3B%20%20%20%20%20%20%2F%2F%20PartialEq%20%E6%9D%A5%E8%87%AA%20derive(PartialEq)%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// #[derive(Debug)] 是一个过程宏（编译器内置实现）</span></span>
<span class="line"><span style="color:#6A737D">// 它读取结构体的字段名和类型，自动生成 Debug 实现</span></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Clone</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">PartialEq</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> User</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    active</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> u1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> User</span><span style="color:#E1E4E8"> { name</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "Alice"</span><span style="color:#F97583">.</span><span style="color:#B392F0">into</span><span style="color:#E1E4E8">(), age</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 28</span><span style="color:#E1E4E8">, active</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> u2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> u1</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();           </span><span style="color:#6A737D">// Clone 来自 derive(Clone)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, u1);          </span><span style="color:#6A737D">// Debug 来自 derive(Debug)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, u1 </span><span style="color:#F97583">==</span><span style="color:#E1E4E8"> u2);      </span><span style="color:#6A737D">// PartialEq 来自 derive(PartialEq)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这段代码展示的就是过程宏的威力：不需要你手动写三个 trait 的实现，编译器调用内置的过程宏，扫描你的字段，自动生成正确的实现代码。

接下来的几篇文章，你将学会自己写这样的宏。

# 练习题

## 过程宏概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…