# 过程宏基础

高级 ⏱ 30 分钟 过程宏TokenStreamproc-macro元编程编译时

# 过程宏是什么

## 先回顾声明宏

你在前面学过 `macro_rules!`，它通过**模式匹配**来生成代码：

```rust
macro_rules! say_hello {
    ($name:expr) => {
        println!("你好，{}！", $name);
    };
}

fn main() {
    say_hello!("Alice"); // 展开为 println!("你好，{}！", "Alice");
}
```

`macro_rules!` 的工作方式：**匹配输入的"形状"，按模板替换**。

这很强大，但有一个根本限制：你只能做**模式替换**，无法运行任意逻辑。

比如，你想根据结构体的字段数量生成不同的代码——`macro_rules!` 做不到，因为它不能"查看"结构体有几个字段。

## 过程宏：真正的 Rust 程序

**过程宏（Procedural Macro）** 是完全不同的一种宏。

它是一段真正运行的 Rust 程序，在**编译时**被调用：

```
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

声明宏 `macro_rules!`

过程宏

实现方式

模式匹配替换

运行任意 Rust 代码

能力

只能做文本模板替换

可以分析 AST、运行逻辑、生成任意代码

错误提示

有限

可自定义详细错误信息

典型用途

简单代码生成

`#[derive(Serialize)]`、`#[test]`、`sqlx::query!`

表格里多次出现了 `TokenStream` 这个词。要理解过程宏，必须先搞清楚它是什么。

## TokenStream：一串 token

过程宏接收和输出的是 **`TokenStream`**——编译器把源码解析成的"token 序列"。

"token"就是源码的最小语法单元，比如：

```
struct Point { x: i32, y: i32 }
```

被分解成这些 token：

```
`struct` `Point` `{` `x` `:` `i32` `,` `y` `:` `i32` `}`
```

过程宏函数的签名形式固定：

```
// 接收 token 序列，返回新的 token 序列
fn my_macro(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // 可以读取 input 里的内容，生成新代码
    input // 最简单的情况：原样返回
}
```

## 三种过程宏

Rust 有三种不同形式的过程宏，分别用于不同场景：

### 1\. 自定义 Derive 宏

最常见。为结构体或枚举自动实现 trait：

```
#[derive(Debug, Clone, Serialize)]  // Debug 和 Clone 是内置，Serialize 是 serde 库提供的
struct Point { x: f64, y: f64 }
```

你自己写一个 `#[derive(MyTrait)]`，让用户一行代码就能自动实现你的 trait。

### 2\. 类属性宏

像内置属性一样，可以加在任意代码项上，并修改或替换该项：

```
#[route(GET, "/")]       // web 框架用属性宏标注路由
async fn index() { ... }

#[instrument]            // tracing 库的属性宏，自动追踪函数调用
fn my_function() { ... }
```

### 3\. 类函数宏

看起来像函数调用（带 `!`），但能处理任意 token：

```
let query = sql!(SELECT * FROM users WHERE id = 42);
// sql! 是过程宏，可以在编译时验证 SQL 语句的语法！
```

# 搭建过程宏项目

## 为什么需要独立 crate

**过程宏必须放在独立的 crate 里。** 这是 Rust 编译器的硬性要求。

原因是：过程宏在**编译你的代码时**运行，而不是在运行时。编译器需要先编译过程宏，才能用它来编译你的项目。如果把过程宏和普通代码放在一起，就会产生循环依赖。

典型的项目结构：

```
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

```
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

```
# my-project/Cargo.toml
[dependencies]
my-macros = { path = "./my-macros" }
```

## 第一个过程宏：什么都不做

先写一个最简单的过程宏——接收输入，原样返回：

```
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

```
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

```rust
// #[derive(Debug)] 是一个过程宏（编译器内置实现）
// 它读取结构体的字段名和类型，自动生成 Debug 实现
#[derive(Debug, Clone, PartialEq)]
struct User {
    name: String,
    age: u32,
    active: bool,
}

fn main() {
    let u1 = User { name: "Alice".into(), age: 28, active: true };
    let u2 = u1.clone();           // Clone 来自 derive(Clone)
    println!("{:?}", u1);          // Debug 来自 derive(Debug)
    println!("{}", u1 == u2);      // PartialEq 来自 derive(PartialEq)
}
```

这段代码展示的就是过程宏的威力：不需要你手动写三个 trait 的实现，编译器调用内置的过程宏，扫描你的字段，自动生成正确的实现代码。

接下来的几篇文章，你将学会自己写这样的宏。

# 练习题

## 过程宏概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…
