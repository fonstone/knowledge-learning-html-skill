# 为什么需要 syn 和 quote

## 手动操作 TokenStream 的痛苦

理论上，你可以直接操作 `TokenStream`——遍历 token、手动判断每个 token 是什么、手动拼接新的 token 序列。

但 `TokenStream` 是很低层的数据结构：每个 token 只是一个字符串片段加上位置信息，没有任何结构。判断”这是不是一个结构体定义”需要写大量繁琐的匹配逻辑。

实际上，Rust 源码的语法规则比你想象的复杂得多：结构体可以有泛型参数、where 子句、可见性修饰符、属性……手动处理这些几乎是不可能完成的任务。

**`syn` 和 `quote` 是为了解决这个问题而生的：**

- `syn` ：把 token 序列解析为 结构化的语法树 ，让你可以方便地访问”第一个字段的名字”、“有几个泛型参数”这类信息
- `quote` ：让你用接近普通 Rust 代码的 模板语法 来生成 token 序列，不用手动拼接

## 安装

```toml
[dependencies]
syn = { version = "2", features = ["full"] }
quote = "1"
proc-macro2 = "1"  # syn 和 quote 内部使用的增强版 TokenStream
```

> **关于 `proc_macro2`**：过程宏只能在 proc-macro crate 中使用 `proc_macro::TokenStream`。但 `syn` 和 `quote` 内部使用 `proc_macro2::TokenStream`——它功能更强，可以在普通代码里使用（方便测试）。两者可以通过 `.into()` 互相转换，`parse_macro_input!` 帮你自动处理这个转换。

# syn 深入

前面的章节里，我们直接上手用了 syn 的 `parse_macro_input!` 和 `DeriveInput`。这一节深入看看 syn 能解析哪些语法结构，以及如何从解析结果中读出需要的信息。

## syn 能解析什么

`syn` 可以把 `TokenStream` 解析成各种 Rust 语法结构：

| syn 类型 | 对应的 Rust 语法 |
| --- | --- |
| `DeriveInput` | derive 宏的输入（结构体/枚举/联合体） |
| `ItemFn` | 函数定义 |
| `ItemStruct` | 结构体定义 |
| `ItemEnum` | 枚举定义 |
| `Expr` | 任意表达式 |
| `Type` | 类型（如 `Vec<i32>`） |
| `LitStr` | 字符串字面量 |
| `LitInt` | 整数字面量 |
| `Path` | 路径（如 `std::fmt::Debug`） |

使用 `parse_macro_input!` 宏触发解析：

```rust
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // 解析 TokenStream 为 DeriveInput
    let ast: DeriveInput = parse_macro_input!(input as DeriveInput);
    // 如果解析失败，自动返回编译错误给用户
    // ...
}
```

## DeriveInput 的结构

`DeriveInput` 是 derive 宏的核心类型，包含了被标注类型的所有信息：

```rust
// DeriveInput 的简化结构（参考 syn 文档）
pub struct DeriveInput {
    pub attrs: Vec<Attribute>,   // 属性，如 #[serde(rename = "foo")]
    pub vis: Visibility,         // 可见性：pub、pub(crate)、private
    pub ident: Ident,            // 类型名，如 Point、User
    pub generics: Generics,      // 泛型参数，如 <T, U: Clone>
    pub data: Data,              // 具体内容：是结构体还是枚举，及其字段
}

pub enum Data {
    Struct(DataStruct),   // 结构体
    Enum(DataEnum),       // 枚举
    Union(DataUnion),     // 联合体
}
```

## 实战：解析所有字段和类型

下面是一个完整示例，演示如何遍历结构体的字段，包括字段名和字段类型：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields, Type};

#[proc_macro_derive(TypeInfo)]
pub fn type_info_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let struct_name = &ast.ident;

    let field_info: Vec<proc_macro2::TokenStream> = match &ast.data {
        Data::Struct(data) => {
            match &data.fields {
                Fields::Named(fields) => {
                    fields.named.iter().map(|field| {
                        let field_name = field.ident.as_ref().unwrap();
                        let field_name_str = field_name.to_string();
                        let field_type = &field.ty;
                        // 把类型转换为字符串（用 quote 把类型 token 转为字符串）
                        let type_str = quote!(#field_type).to_string();

                        // 生成一行打印语句
                        quote! {
                            println!("  字段 {}: {}", #field_name_str, #type_str);
                        }
                    }).collect()
                }
                _ => vec![],
            }
        }
        _ => vec![],
    };

    let struct_name_str = struct_name.to_string();

    quote! {
        impl #struct_name {
            pub fn print_type_info() {
                println!("类型：{}", #struct_name_str);
                #(#field_info)*
                // #(#field_info)* 是 quote! 的重复语法，相当于把 field_info 里的每个元素都展开
            }
        }
    }.into()
}
```

使用时：

```rust
#[derive(TypeInfo)]
struct User {
    name: String,
    age: u32,
    active: bool,
}

fn main() {
    User::print_type_info();
    // 类型：User
    //   字段 name: String
    //   字段 age: u32
    //   字段 active: bool
}
```

## 处理泛型：一个常见陷阱

如果被 derive 的类型有泛型参数，生成的 `impl` 必须也带上这些泛型参数，否则无法通过编译：

```rust
// 错误：Point<T> 的 impl 缺少 <T>
impl Describe for Point<T> { ... }  // ❌ T 未声明

// 正确
impl<T> Describe for Point<T> { ... }  // ✅
```

从 `DeriveInput` 取得泛型信息的标准写法：

```rust
use syn::{parse_macro_input, DeriveInput};
use quote::quote;

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // generics 包含了泛型参数列表（<T, U: Clone>）
    let generics = &ast.generics;
    // split_for_impl() 把泛型拆成三部分：
    //   impl_generics → 用于 impl<T, U: Clone> 的部分
    //   ty_generics   → 用于 Type<T, U> 的部分
    //   where_clause  → 用于 where T: Trait 的部分
    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();

    let name_str = name.to_string();

    quote! {
        // 正确处理泛型的 impl
        impl #impl_generics Describe for #name #ty_generics #where_clause {
            fn describe(&self) -> String {
                #name_str.to_string()
            }
        }
    }.into()
}
```

这样无论是 `struct Point<T>` 还是 `struct Cache<K, V: Hash>` 都能正确生成 impl。

# quote 深入

有了 syn 负责”读”，quote 负责”写”——它提供一套模板语法，让你用接近普通 Rust 代码的写法生成 `TokenStream`，不需要手动拼接 token。

## quote! 的基本插值

`quote!` 宏让你写出接近 Rust 代码的模板，用 `#变量名` 插入值：

```rust
let name = quote::format_ident!("MyStruct"); // Ident 类型
let field_count = 3usize;
let method_name = quote::format_ident!("get_field_count");

let code = quote::quote! {
    impl #name {
        pub fn #method_name() -> usize {
            #field_count
        }
    }
};
// 生成：
// impl MyStruct {
//     pub fn get_field_count() -> usize {
//         3
//     }
// }
```

**可插值的类型：**

| 类型 | 插值方式 | 生成结果 |
| --- | --- | --- |
| `Ident` | `#name` | 标识符（如 `Point`） |
| `TokenStream2` | `#tokens` | 原样展开 |
| `&str` / `String` | `#s` | 字符串字面量（`"..."` 格式） |
| 数字（`u32` 等） | `#n` | 数字字面量 |
| `syn` 的任意 AST 节点 | `#node` | 对应的代码 |

## 重复语法：`#(#item)*`

这是 `quote!` 最强大的功能之一：把一个集合里的每个元素都展开：

```rust
let fields = vec![
    quote::format_ident!("x"),
    quote::format_ident!("y"),
    quote::format_ident!("z"),
];

// #(#fields),* → x, y, z（用逗号分隔）
// #(#fields)* → xyz（无分隔符）
// #(println!("{}", self.#fields);)* → 三条 println! 语句

let print_all = quote::quote! {
    #(println!("{}", self.#fields);)*
};
// 生成：
// println!("{}", self.x);
// println!("{}", self.y);
// println!("{}", self.z);
```

## 完整示例：实现 Builder 模式 derive 宏

Builder 模式是过程宏的典型应用——手动写非常繁琐，宏帮你自动生成：

```rust
// 目标：
// #[derive(Builder)]
// struct Config { host: String, port: u16, debug: bool }
//
// 自动生成 ConfigBuilder：
// let cfg = Config::builder()
//     .host("localhost".into())
//     .port(8080)
//     .debug(false)
//     .build();
```

```rust
use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::{quote, format_ident};
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(Builder)]
pub fn builder_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    let builder_name = format_ident!("{}Builder", name); // ConfigBuilder

    let fields = match &ast.data {
        Data::Struct(data) => match &data.fields {
            Fields::Named(f) => &f.named,
            _ => panic!("Builder 只支持命名字段结构体"),
        },
        _ => panic!("Builder 只支持结构体"),
    };

    // 生成 builder 字段（Option<T> 包装）
    let builder_fields: Vec<TokenStream2> = fields.iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        quote! { #name: Option<#ty> }
    }).collect();

    // 生成 setter 方法
    let setters: Vec<TokenStream2> = fields.iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        quote! {
            pub fn #name(mut self, value: #ty) -> Self {
                self.#name = Some(value);
                self
            }
        }
    }).collect();

    // 生成 build() 方法的字段赋值
    let build_fields: Vec<TokenStream2> = fields.iter().map(|f| {
        let name = &f.ident;
        let name_str = name.as_ref().unwrap().to_string();
        quote! {
            #name: self.#name.ok_or_else(|| format!("字段 {} 未设置", #name_str))?,
        }
    }).collect();

    // 生成初始值（全部 None）
    let init_fields: Vec<TokenStream2> = fields.iter().map(|f| {
        let name = &f.ident;
        quote! { #name: None }
    }).collect();

    quote! {
        pub struct #builder_name {
            #(#builder_fields,)*
        }

        impl #builder_name {
            #(#setters)*

            pub fn build(self) -> Result<#name, String> {
                Ok(#name {
                    #(#build_fields)*
                })
            }
        }

        impl #name {
            pub fn builder() -> #builder_name {
                #builder_name {
                    #(#init_fields,)*
                }
            }
        }
    }.into()
}
```

使用时，只需一行 `#[derive(Builder)]`：

```rust
#[derive(Builder)]
struct Config {
    host: String,
    port: u16,
    debug: bool,
}

fn main() {
    let cfg = Config::builder()
        .host("localhost".into())
        .port(8080)
        .debug(false)
        .build()
        .expect("构建失败");

    println!("{}:{} debug={}", cfg.host, cfg.port, cfg.debug);
}
```

# 练习题

## syn 与 quote 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…