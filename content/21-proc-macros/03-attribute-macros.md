# 类属性宏

高级 ⏱ 30 分钟 类属性宏proc\_macro\_attribute属性路由宏框架


# 属性宏的特点

## 与 derive 宏的对比

你已经学会了 derive 宏。现在来看**类属性宏**（Attribute Macro）——它比 derive 宏更灵活，也更强大。

两者的关键区别：

derive 宏

类属性宏

语法

`#[derive(MyMacro)]`

`#[my_macro]` 或 `#[my_macro(args)]`

只能用于

结构体和枚举

**任意代码项**（函数、结构体、枚举、impl 块……）

对原始代码

**保留**原始定义，额外添加代码

**可以完全替换**原始代码项

接收参数

无法直接传参（只能用辅助属性）

可以通过 `#[macro(key = value)]` 传任意参数

以下都是类属性宏的真实例子：

```
// web 框架中标注路由
#[get("/users")]
async fn list_users() -> Vec<User> { ... }

// 追踪函数调用（tracing 库）
#[instrument(skip(password))]
fn login(username: &str, password: &str) -> Result<Token, Error> { ... }

// 测试框架标注异步测试（tokio）
#[tokio::test]
async fn test_database_connection() { ... }
```

## 属性宏的函数签名

属性宏函数接收**两个** `TokenStream`：

```
#[proc_macro_attribute]
pub fn my_attr(
    attr: TokenStream,  // #[my_attr(这里的内容)] ← 属性括号里的参数
    item: TokenStream,  // 被标注的代码项（函数体、结构体定义……）
) -> TokenStream {
    // 返回替换后的代码
}
```

-   `attr`：属性括号里的参数，如 `#[route(GET, "/")]` 中的 `GET, "/"` 部分
-   `item`：被标注的整个代码项（如函数的完整定义）
-   返回值：**替换** `item` 的新代码（注意：不是追加，而是替换！）

# 实现一个计时属性宏

## 需求：自动统计函数执行时间

你希望写这样的代码：

```
#[timed]
fn slow_computation(n: u64) -> u64 {
    // 模拟耗时计算
    (0..n).sum()
}
```

调用 `slow_computation(1000000)` 时，自动打印：

```
slow_computation 执行耗时：5.2ms
```

不用每个函数都手动加计时代码，宏帮你搞定。

## 实现

属性宏的关键是：接收原始函数，生成一个包含计时逻辑的新函数。

```
// my-macros/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn timed(
    _attr: TokenStream,  // 这个宏不需要参数，忽略 attr
    item: TokenStream,   // 被标注的函数
) -> TokenStream {
    // 把 item 解析为一个函数定义（ItemFn）
    let func = parse_macro_input!(item as ItemFn);

    // 提取函数信息
    let func_name = &func.sig.ident;        // 函数名
    let func_name_str = func_name.to_string(); // 函数名的字符串形式
    let func_vis = &func.vis;               // 可见性（pub、pub(crate) 等）
    let func_sig = &func.sig;               // 完整函数签名（名字、参数、返回类型）
    let func_body = &func.block;            // 函数体

    // 生成新函数：在原函数体外面包一层计时逻辑
    quote! {
        #func_vis #func_sig {
            let __start = std::time::Instant::now();
            let __result = (|| #func_body)(); // 把原函数体包进闭包执行
            let __elapsed = __start.elapsed();
            println!("{} 执行耗时：{:.1}ms", #func_name_str, __elapsed.as_secs_f64() * 1000.0);
            __result
        }
    }.into()
}
```

使用时：

```
use my_macros::timed;

#[timed]
fn compute_sum(n: u64) -> u64 {
    (0..n).sum()
}

fn main() {
    let result = compute_sum(10_000_000);
    println!("结果：{}", result);
    // 输出：
    // compute_sum 执行耗时：15.3ms
    // 结果：49999995000000
}
```

展开后，宏生成的代码相当于：

```
fn compute_sum(n: u64) -> u64 {
    let __start = std::time::Instant::now();
    let __result = (|| {
        (0..n).sum()  // 原函数体
    })();
    let __elapsed = __start.elapsed();
    println!("compute_sum 执行耗时：{:.1}ms", __elapsed.as_secs_f64() * 1000.0);
    __result
}
```

# 带参数的属性宏

## 接收和解析参数

属性宏可以通过 `#[my_macro(param)]` 传入参数，通过第一个 `attr: TokenStream` 接收。

下面实现一个 `#[retry(n)]` 宏——自动在函数失败时重试 n 次：

```
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn, LitInt};

#[proc_macro_attribute]
pub fn retry(
    attr: TokenStream, // 接收括号里的参数，如 retry(3) 里的 "3"
    item: TokenStream,
) -> TokenStream {
    // 把参数解析为一个整数字面量
    let retry_count = parse_macro_input!(attr as LitInt);
    let count: u64 = retry_count.base10_parse().unwrap_or(3);

    let func = parse_macro_input!(item as ItemFn);
    let func_name = &func.sig.ident;
    let func_vis = &func.vis;
    let func_sig = &func.sig;
    let func_body = &func.block;

    quote! {
        #func_vis #func_sig {
            let mut __attempts = 0u64;
            loop {
                let __result = (|| #func_body)();
                match __result {
                    Ok(v) => return Ok(v),
                    Err(e) => {
                        __attempts += 1;
                        if __attempts >= #count {
                            eprintln!("{} 重试 {} 次后失败", stringify!(#func_name), #count);
                            return Err(e);
                        }
                        eprintln!("{} 第 {} 次失败，重试中...", stringify!(#func_name), __attempts);
                    }
                }
            }
        }
    }.into()
}
```

使用时：

```
use my_macros::retry;

#[retry(3)]  // 最多重试 3 次
fn fetch_data(url: &str) -> Result<String, String> {
    // 模拟可能失败的操作
    Err(format!("连接 {} 失败", url))
}

fn main() {
    match fetch_data("https://example.com") {
        Ok(data) => println!("数据：{}", data),
        Err(e) => println!("最终失败：{}", e),
    }
    // 输出：
    // fetch_data 第 1 次失败，重试中...
    // fetch_data 第 2 次失败，重试中...
    // fetch_data 重试 3 次后失败
    // 最终失败：连接 https://example.com 失败
}
```

# 练习题

## 类属性宏测验

加载题目中…

加载题目中…

```
// 假设宏实现如下：
#[proc_macro_attribute]
pub fn log_call(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let name = func.sig.ident.to_string();
    let vis = &func.vis;
    let sig = &func.sig;
    let body = &func.block;
    quote! {
        #vis #sig {
            println!("调用：{}", #name);
            #body
        }
    }.into()
}
```

加载题目中…

加载题目中…

[← 上一节 自定义 derive 宏](/RustCourse/chapters/21-proc-macros/02-derive-macros)

[下一节 → 类函数宏](/RustCourse/chapters/21-proc-macros/04-function-like-macros)

目录

-   [属性宏的特点](#属性宏的特点)
-   [与 derive 宏的对比](#与-derive-宏的对比)
-   [属性宏的函数签名](#属性宏的函数签名)
-   [实现一个计时属性宏](#实现一个计时属性宏)
-   [需求：自动统计函数执行时间](#需求自动统计函数执行时间)
-   [实现](#实现)
-   [带参数的属性宏](#带参数的属性宏)
-   [接收和解析参数](#接收和解析参数)
-   [练习题](#练习题)
-   [类属性宏测验](#类属性宏测验)

RUST 互动教程

 ![雪云飞星](/RustCourse/images/logo.svg) 作者：雪云飞星

© 2026 fuhaowen. 保留所有权利.