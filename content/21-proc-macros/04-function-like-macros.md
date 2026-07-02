# 类函数宏的形式

## 三种宏的外观对比

你现在认识了三种宏，它们看起来是：

```rust
// 1. 声明宏（macro_rules!）
vec![1, 2, 3]
println!("hello")

// 2. derive 宏
#[derive(Debug, Clone)]
struct Point { ... }

// 3. 类属性宏
#[route(GET, "/")]
async fn index() { ... }

// 4. 类函数宏
let query = sql!(SELECT * FROM users WHERE id = ?);
html! { <div class="main">Hello</div> }
```

**类函数宏**（Function-like Macro）看起来像普通函数调用（加 `!`），但它的括号里可以是**任意 token 序列**，不需要是合法的 Rust 表达式。

`sql!(SELECT * FROM users)` 这行代码括号里的内容是 SQL，不是 Rust。声明宏和普通函数都做不到接受这样的输入——类函数过程宏可以。

## 与 macro_rules! 的区别

|  | `macro_rules!` | 类函数过程宏 |
| --- | --- | --- |
| 实现方式 | 模式匹配规则 | 任意 Rust 代码逻辑 |
| 能力 | 受限于模式匹配 | 可以做任意分析和生成 |
| 错误信息 | 有时难以理解 | 可以自定义精确错误位置 |
| 调试 | 难调试 | 是正常的 Rust 函数，可以 println! 调试 |
| 适用场景 | 简单重复模式 | 复杂解析、编译时验证、DSL |

## 函数签名

类函数宏只接收一个 `TokenStream`：

```rust
#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    // input 是括号里的所有 token
    // 返回值是展开后的代码
    input
}
```

注意 `#[proc_macro]` 而不是 `#[proc_macro_derive]` 或 `#[proc_macro_attribute]`。

# 实现一个 HTML 生成宏

## 目标

实现一个简单的 `html!` 宏，把类似 HTML 的语法转换为字符串拼接代码：

```rust
let output = html!(div "container" { "Hello, " strong { "World" } "!" });
// 生成：<div class="container">Hello, <strong>World</strong>!</div>
```

真正的 `html!` 宏（如 `yew` 框架的）非常复杂。这里实现一个简化版，重点学习类函数宏的结构。

## 简化版实现：编译时验证数学表达式

先从更简单的例子开始——一个 `assert_positive!` 宏，在编译时检查字面量是否为正数：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitInt};

// assert_positive!(42)    → 编译通过
// assert_positive!(-1)    → 编译错误（但 i32 字面量不能是负数，所以这个例子需要调整）
// assert_positive!(0)     → 编译错误：0 不是正数

#[proc_macro]
pub fn assert_positive(input: TokenStream) -> TokenStream {
    // 解析输入为整数字面量
    let lit = parse_macro_input!(input as LitInt);
    let value: i64 = lit.base10_parse().expect("需要整数字面量");

    if value <= 0 {
        // 返回编译错误
        return quote! {
            compile_error!("assert_positive! 需要正整数");
        }.into();
    }

    // 编译通过，生成值本身的代码
    let u = value as u64;
    quote! { #u }.into()
}
```

使用时：

```rust
use my_macros::assert_positive;

fn main() {
    let n = assert_positive!(42);   // ✅ 编译时确认 42 > 0
    println!("{}", n);              // 42
    
    // let m = assert_positive!(0); // ❌ 编译错误：assert_positive! 需要正整数
}
```

这个宏虽然简单，但演示了核心能力：**在编译时验证数据的合法性**，违法时给出清晰错误，比运行时的 `assert!` 更早发现问题。

## 实现一个格式验证宏（checked_parse）

下面实现一个更实用的宏：在编译时验证字符串是否是合法的格式：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitStr};

// 检查 IP 地址格式（编译时）
#[proc_macro]
pub fn ip(input: TokenStream) -> TokenStream {
    let lit = parse_macro_input!(input as LitStr);
    let value = lit.value();

    // 在编译时解析 IP 地址——如果格式不对，编译报错
    let parsed: Result<std::net::IpAddr, _> = value.parse();
    match parsed {
        Ok(_) => {
            // 合法 IP，生成解析表达式
            quote! {
                #lit.parse::<std::net::IpAddr>().unwrap()
            }.into()
        }
        Err(_) => {
            // 非法 IP，编译时报错，并精确指向这个宏调用的位置
            let msg = format!("非法的 IP 地址：{}", value);
            quote! {
                compile_error!(#msg)
            }.into()
        }
    }
}
```

使用时：

```rust
use my_macros::ip;

fn main() {
    let addr = ip!("192.168.1.1");   // ✅ 编译时验证通过
    println!("{}", addr);            // 192.168.1.1

    // let bad = ip!("999.999.0.0"); // ❌ 编译错误：非法的 IP 地址：999.999.0.0
    // let bad2 = ip!("localhost");  // ❌ 编译错误：非法的 IP 地址：localhost
}
```

这是类函数过程宏的经典用途：**把运行时才会发现的错误，提前到编译时报告**。

## 实现一个 SQL 模板宏（简化版）

真实框架中 `sqlx` 的 `query!` 宏会在编译时连接数据库验证 SQL。这里实现一个简化版，只验证 SQL 语法关键字：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitStr};

// sql!("SELECT * FROM users") → 生成字符串常量，同时验证以 SELECT/INSERT/UPDATE/DELETE 开头
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    let lit = parse_macro_input!(input as LitStr);
    let query = lit.value();
    let query_upper = query.trim().to_uppercase();

    let valid_start = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP"]
        .iter()
        .any(|kw| query_upper.starts_with(kw));

    if !valid_start {
        let msg = format!(
            "SQL 语句必须以 SELECT/INSERT/UPDATE/DELETE/CREATE/DROP 开头，得到：\"{}\"",
            query
        );
        return quote! { compile_error!(#msg) }.into();
    }

    // 验证通过，返回字符串
    quote! { #lit }.into()
}
```

使用时：

```rust
use my_macros::sql;

fn main() {
    let q = sql!("SELECT * FROM users WHERE id = 1");  // ✅
    println!("执行查询：{}", q);

    // let bad = sql!("HACK users SET admin = true");  // ❌ 编译错误
}
```

# 练习题

## 类函数宏测验

加载题目中…

加载题目中…

```rust
#[proc_macro]
pub fn double(input: TokenStream) -> TokenStream {
    let lit = parse_macro_input!(input as LitInt);
    let value: u64 = lit.base10_parse().unwrap();
    let doubled = value * 2;
    quote! { #doubled }.into()
}
```

加载题目中…

加载题目中…