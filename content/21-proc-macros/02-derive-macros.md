# 从需求出发

## 一个需要手动重复的 trait

假设你有一个日志 trait，要求每种类型都能描述自己的名字：

<div class="code-runner" data-full-code="trait%20Describe%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20Point%20%7B%20x%3A%20f64%2C%20y%3A%20f64%20%7D%0Astruct%20Circle%20%7B%20x%3A%20f64%2C%20y%3A%20f64%2C%20radius%3A%20f64%20%7D%0Astruct%20Rectangle%20%7B%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0A%0A%2F%2F%20%E4%B8%BA%E6%AF%8F%E4%B8%AA%E7%B1%BB%E5%9E%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E2%80%94%E2%80%94%E4%BB%A3%E7%A0%81%E5%AE%8C%E5%85%A8%E9%9B%B7%E5%90%8C%0Aimpl%20Describe%20for%20Point%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Point%22.to_string()%20%7D%0A%7D%0Aimpl%20Describe%20for%20Circle%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Circle%22.to_string()%20%7D%0A%7D%0Aimpl%20Describe%20for%20Rectangle%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Rectangle%22.to_string()%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Point%20%7B%20x%3A%200.0%2C%20y%3A%200.0%20%7D.describe())%3B%20%2F%2F%20Point%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Circle%20%7B%20x%3A%200.0%2C%20y%3A%200.0%2C%20radius%3A%201.0%20%7D.describe())%3B%20%2F%2F%20Circle%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Describe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, radius</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 为每个类型手动实现——代码完全雷同</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Describe</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#9ECBFF">"Point"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Describe</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#9ECBFF">"Circle"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Describe</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#9ECBFF">"Rectangle"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8"> }</span><span style="color:#F97583">.</span><span style="color:#B392F0">describe</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Point</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Circle</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, radius</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8"> }</span><span style="color:#F97583">.</span><span style="color:#B392F0">describe</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Circle</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这三个实现**逻辑完全相同**：返回类型名字符串。但你不得不为每个类型都写一遍。

如果用自定义 derive 宏，使用时只需写：

```rust
#[derive(Describe)]
struct Point { x: f64, y: f64 }

// 等价于自动生成：
// impl Describe for Point {
//     fn describe(&self) -> String { "Point".to_string() }
// }
```

## derive 宏做的事：读取结构体名字，生成实现代码

derive 宏在编译时：

1. 接收结构体的 TokenStream （包含类型名、字段等信息）
1. 从中提取 类型名 （ Point 、 Circle ……）
1. 生成代码 ： impl Describe for 类型名 { ... }
1. 把生成的代码注入到编译结果中

# 实现步骤

## 项目准备

按照前一章的结构，创建一个 proc-macro crate `my-macros`。

在 `my-macros/Cargo.toml` 中：

```toml
[package]
name = "my-macros"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = { version = "2", features = ["full"] }
quote = "1"
```

- `syn` ：解析 TokenStream 为 Rust 语法树（AST），让你能方便地提取”类型名”等信息
- `quote` ：用模板语法生成新的 TokenStream ，比手动拼接 token 简单得多

有了这两个工具，实现 Describe 宏的思路就清晰了：用 syn 把输入解析成语法树、从中读出类型名，再用 quote 拼出 impl 块返回给编译器。

## 写最简单的 derive 宏

目标：`#[derive(Describe)]` 为类型自动生成 `Describe::describe()` 返回类型名。

```rust
// my-macros/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: TokenStream) -> TokenStream {
    // 第一步：把 TokenStream 解析成 Rust 语法树
    // DeriveInput 包含了被 derive 的类型的所有信息
    let ast = parse_macro_input!(input as DeriveInput);

    // 第二步：从语法树中提取类型名
    // ast.ident 就是类型的标识符（如 Point、Circle……）
    let name = &ast.ident;
    // name 是 Ident 类型，表示一个标识符，这里是结构体/枚举的名字

    // 第三步：用 quote! 生成实现代码
    // quote! 里可以用 #name 插值，#name 会被替换为实际的类型名
    let expanded = quote! {
        impl Describe for #name {
            fn describe(&self) -> String {
                // stringify! 把标识符转为字符串字面量
                stringify!(#name).to_string()
            }
        }
    };

    // 第四步：把生成的代码转回 TokenStream 返回给编译器
    expanded.into()
}
```

## 在主项目中使用

```rust
// src/main.rs
use my_macros::Describe;

trait Describe {
    fn describe(&self) -> String;
}

#[derive(Describe)]
struct Point { x: f64, y: f64 }

#[derive(Describe)]
struct Circle { radius: f64 }

#[derive(Describe)]
enum Direction { North, South, East, West }

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    let c = Circle { radius: 5.0 };
    let d = Direction::North;

    println!("{}", p.describe()); // Point
    println!("{}", c.describe()); // Circle
    println!("{}", d.describe()); // Direction
}
```

## 展开后的代码是什么样的

`#[derive(Describe)]` 在 `Point` 上展开后，编译器相当于看到了：

```rust
struct Point { x: f64, y: f64 }

// 宏自动生成的代码（invisible to user）：
impl Describe for Point {
    fn describe(&self) -> String {
        "Point".to_string()
    }
}
```

宏生成的代码和用户写的代码**并存**——宏不替换原来的结构体定义，只是**额外添加**了 impl 块。

# 提取字段信息

## 访问字段列表

仅仅输出类型名还不够。更多场景需要遍历字段，比如：

- #[derive(Debug)] 需要打印每个字段的名字和值
- #[derive(Serialize)] 需要把每个字段序列化为 JSON

下面演示如何遍历结构体的字段：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(FieldNames)]
pub fn field_names_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // 从 ast.data 里提取字段信息
    let field_names: Vec<String> = match &ast.data {
        // Data::Struct 说明这是一个结构体
        Data::Struct(data_struct) => {
            match &data_struct.fields {
                // 命名字段（如 struct Foo { x: i32, y: i32 }）
                Fields::Named(fields) => {
                    fields.named.iter()
                        .map(|f| f.ident.as_ref().unwrap().to_string())
                        .collect()
                }
                // 其他情况（元组结构体、单元结构体）暂时不处理
                _ => vec![],
            }
        }
        // 如果不是结构体，暂时返回空
        _ => vec![],
    };

    let fields_str = field_names.join(", ");

    let expanded = quote! {
        impl #name {
            pub fn field_names() -> &'static str {
                #fields_str
            }
        }
    };

    expanded.into()
}
```

用法：

```rust
#[derive(FieldNames)]
struct User {
    name: String,
    email: String,
    age: u32,
}

fn main() {
    println!("{}", User::field_names()); // name, email, age
}
```

## 完整示例：自动生成 Display

下面是一个更实用的例子——自动为只有一个字段的 newtype 结构体生成 `Display`：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

// #[derive(NewtypeDisplay)] 为 struct Foo(InnerType) 自动实现 Display
// 委托给内部类型的 Display
#[proc_macro_derive(NewtypeDisplay)]
pub fn newtype_display_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // 检查是否是单字段元组结构体
    let is_newtype = matches!(
        &ast.data,
        Data::Struct(s) if matches!(&s.fields, Fields::Unnamed(f) if f.unnamed.len() == 1)
    );

    if !is_newtype {
        // compile_error! 宏可以让编译器输出自定义错误信息
        return quote! {
            compile_error!("NewtypeDisplay 只能用于单字段元组结构体，如 struct Foo(Bar)");
        }.into();
    }

    // 生成：impl Display for Foo，委托给 self.0 的 Display
    quote! {
        impl std::fmt::Display for #name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                std::fmt::Display::fmt(&self.0, f)
            }
        }
    }.into()
}
```

> **注意**：以上过程宏代码需要在独立的 proc-macro crate 中运行。`cargo-expand` 工具可以让你看到宏展开后的代码（`cargo expand`），在调试时很有用。

# 练习题

## derive 宏原理测验

加载题目中…

加载题目中…

```rust
// 过程宏代码（在 proc-macro crate 中）
#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    quote! {
        impl MyTrait for #name {
            fn hello(&self) { println!("Hello from {}!", stringify!(#name)); }
        }
    }.into()
}
```

加载题目中…

加载题目中…