---
chapterId: "21-proc-macros"
lessonId: "02-derive-macros"
title: "自定义 derive 宏"
level: "进阶"
duration: "35 分钟"
tags: ["#[derive(...)]", "自定义 derive", "proc-macro-derive"]
number: "21.2"
chapterTitle: "过程宏"
chapterNumber: "21"
---

<div id="article-content"> <h1 id="从需求出发">从需求出发</h1>
<h2 id="一个需要手动重复的-trait">一个需要手动重复的 trait</h2>
<p>假设你有一个日志 trait，要求每种类型都能描述自己的名字：</p>
<div class="code-runner" data-full-code="trait%20Describe%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20Point%20%7B%20x%3A%20f64%2C%20y%3A%20f64%20%7D%0Astruct%20Circle%20%7B%20x%3A%20f64%2C%20y%3A%20f64%2C%20radius%3A%20f64%20%7D%0Astruct%20Rectangle%20%7B%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0A%0A%2F%2F%20%E4%B8%BA%E6%AF%8F%E4%B8%AA%E7%B1%BB%E5%9E%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E2%80%94%E2%80%94%E4%BB%A3%E7%A0%81%E5%AE%8C%E5%85%A8%E9%9B%B7%E5%90%8C%0Aimpl%20Describe%20for%20Point%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Point%22.to_string()%20%7D%0A%7D%0Aimpl%20Describe%20for%20Circle%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Circle%22.to_string()%20%7D%0A%7D%0Aimpl%20Describe%20for%20Rectangle%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%20%22Rectangle%22.to_string()%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Point%20%7B%20x%3A%200.0%2C%20y%3A%200.0%20%7D.describe())%3B%20%2F%2F%20Point%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Circle%20%7B%20x%3A%200.0%2C%20y%3A%200.0%2C%20radius%3A%201.0%20%7D.describe())%3B%20%2F%2F%20Circle%0A%7D" data-mode="run"><pre><code class="language-rust">trait Describe {
    fn describe(&amp;self) -&gt; String;
}

struct Point { x: f64, y: f64 }
struct Circle { x: f64, y: f64, radius: f64 }
struct Rectangle { width: f64, height: f64 }

// 为每个类型手动实现——代码完全雷同
impl Describe for Point {
    fn describe(&amp;self) -&gt; String { "Point".to_string() }
}
impl Describe for Circle {
    fn describe(&amp;self) -&gt; String { "Circle".to_string() }
}
impl Describe for Rectangle {
    fn describe(&amp;self) -&gt; String { "Rectangle".to_string() }
}

fn main() {
    println!("{}", Point { x: 0.0, y: 0.0 }.describe()); // Point
    println!("{}", Circle { x: 0.0, y: 0.0, radius: 1.0 }.describe()); // Circle
}</code></pre></div>
<p>这三个实现<strong>逻辑完全相同</strong>：返回类型名字符串。但你不得不为每个类型都写一遍。</p>
<p>如果用自定义 derive 宏，使用时只需写：</p>
<pre><code class="language-rust">#[derive(Describe)]
struct Point { x: f64, y: f64 }

// 等价于自动生成：
// impl Describe for Point {
//     fn describe(&amp;self) -&gt; String { "Point".to_string() }
// }</code></pre>
<h2 id="derive-宏做的事读取结构体名字生成实现代码">derive 宏做的事：读取结构体名字，生成实现代码</h2>
<p>derive 宏在编译时：</p>
<ol>
<li>接收结构体的 <code>TokenStream</code>（包含类型名、字段等信息）</li>
<li>从中提取<strong>类型名</strong>（<code>Point</code>、<code>Circle</code>……）</li>
<li><strong>生成代码</strong>：<code>impl Describe for 类型名 { ... }</code></li>
<li>把生成的代码注入到编译结果中</li>
</ol>
<h1 id="实现步骤">实现步骤</h1>
<h2 id="项目准备">项目准备</h2>
<p>按照前一章的结构，创建一个 proc-macro crate <code>my-macros</code>。</p>
<p>在 <code>my-macros/Cargo.toml</code> 中：</p>
<pre><code class="language-toml">[package]
name = "my-macros"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = { version = "2", features = ["full"] }
quote = "1"</code></pre>
<ul>
<li><strong><code>syn</code></strong>：解析 <code>TokenStream</code> 为 Rust 语法树（AST），让你能方便地提取”类型名”等信息</li>
<li><strong><code>quote</code></strong>：用模板语法生成新的 <code>TokenStream</code>，比手动拼接 token 简单得多</li>
</ul>
<p>有了这两个工具，实现 Describe 宏的思路就清晰了：用 syn 把输入解析成语法树、从中读出类型名，再用 quote 拼出 impl 块返回给编译器。</p>
<h2 id="写最简单的-derive-宏">写最简单的 derive 宏</h2>
<p>目标：<code>#[derive(Describe)]</code> 为类型自动生成 <code>Describe::describe()</code> 返回类型名。</p>
<pre><code class="language-rust">// my-macros/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: TokenStream) -&gt; TokenStream {
    // 第一步：把 TokenStream 解析成 Rust 语法树
    // DeriveInput 包含了被 derive 的类型的所有信息
    let ast = parse_macro_input!(input as DeriveInput);

    // 第二步：从语法树中提取类型名
    // ast.ident 就是类型的标识符（如 Point、Circle……）
    let name = &amp;ast.ident;
    // name 是 Ident 类型，表示一个标识符，这里是结构体/枚举的名字

    // 第三步：用 quote! 生成实现代码
    // quote! 里可以用 #name 插值，#name 会被替换为实际的类型名
    let expanded = quote! {
        impl Describe for #name {
            fn describe(&amp;self) -&gt; String {
                // stringify! 把标识符转为字符串字面量
                stringify!(#name).to_string()
            }
        }
    };

    // 第四步：把生成的代码转回 TokenStream 返回给编译器
    expanded.into()
}</code></pre>
<h2 id="在主项目中使用">在主项目中使用</h2>
<pre><code class="language-rust">// src/main.rs
use my_macros::Describe;

trait Describe {
    fn describe(&amp;self) -&gt; String;
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
}</code></pre>
<h2 id="展开后的代码是什么样的">展开后的代码是什么样的</h2>
<p><code>#[derive(Describe)]</code> 在 <code>Point</code> 上展开后，编译器相当于看到了：</p>
<pre><code class="language-rust">struct Point { x: f64, y: f64 }

// 宏自动生成的代码（invisible to user）：
impl Describe for Point {
    fn describe(&amp;self) -&gt; String {
        "Point".to_string()
    }
}</code></pre>
<p>宏生成的代码和用户写的代码<strong>并存</strong>——宏不替换原来的结构体定义，只是<strong>额外添加</strong>了 impl 块。</p>
<h1 id="提取字段信息">提取字段信息</h1>
<h2 id="访问字段列表">访问字段列表</h2>
<p>仅仅输出类型名还不够。更多场景需要遍历字段，比如：</p>
<ul>
<li><code>#[derive(Debug)]</code> 需要打印每个字段的名字和值</li>
<li><code>#[derive(Serialize)]</code> 需要把每个字段序列化为 JSON</li>
</ul>
<p>下面演示如何遍历结构体的字段：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(FieldNames)]
pub fn field_names_derive(input: TokenStream) -&gt; TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &amp;ast.ident;

    // 从 ast.data 里提取字段信息
    let field_names: Vec&lt;String&gt; = match &amp;ast.data {
        // Data::Struct 说明这是一个结构体
        Data::Struct(data_struct) =&gt; {
            match &amp;data_struct.fields {
                // 命名字段（如 struct Foo { x: i32, y: i32 }）
                Fields::Named(fields) =&gt; {
                    fields.named.iter()
                        .map(|f| f.ident.as_ref().unwrap().to_string())
                        .collect()
                }
                // 其他情况（元组结构体、单元结构体）暂时不处理
                _ =&gt; vec![],
            }
        }
        // 如果不是结构体，暂时返回空
        _ =&gt; vec![],
    };

    let fields_str = field_names.join(", ");

    let expanded = quote! {
        impl #name {
            pub fn field_names() -&gt; &amp;'static str {
                #fields_str
            }
        }
    };

    expanded.into()
}</code></pre>
<p>用法：</p>
<pre><code class="language-rust">#[derive(FieldNames)]
struct User {
    name: String,
    email: String,
    age: u32,
}

fn main() {
    println!("{}", User::field_names()); // name, email, age
}</code></pre>
<h2 id="完整示例自动生成-display">完整示例：自动生成 Display</h2>
<p>下面是一个更实用的例子——自动为只有一个字段的 newtype 结构体生成 <code>Display</code>：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

// #[derive(NewtypeDisplay)] 为 struct Foo(InnerType) 自动实现 Display
// 委托给内部类型的 Display
#[proc_macro_derive(NewtypeDisplay)]
pub fn newtype_display_derive(input: TokenStream) -&gt; TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &amp;ast.ident;

    // 检查是否是单字段元组结构体
    let is_newtype = matches!(
        &amp;ast.data,
        Data::Struct(s) if matches!(&amp;s.fields, Fields::Unnamed(f) if f.unnamed.len() == 1)
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
            fn fmt(&amp;self, f: &amp;mut std::fmt::Formatter&lt;'_&gt;) -&gt; std::fmt::Result {
                std::fmt::Display::fmt(&amp;self.0, f)
            }
        }
    }.into()
}</code></pre>
<blockquote>
<p><strong>注意</strong>：以上过程宏代码需要在独立的 proc-macro crate 中运行。<code>cargo-expand</code> 工具可以让你看到宏展开后的代码（<code>cargo expand</code>），在调试时很有用。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="derive-宏原理测验">derive 宏原理测验</h2>
<div class="quiz-choice" data-block-id="21-proc-macros/02-derive-macros#3:0" data-kind="single" data-payload="%7B%22question%22%3A%22%23%5Bderive(MyTrait)%5D%20%E5%AE%8F%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC%E4%BC%9A%E8%A2%AB%E7%BC%96%E8%AF%91%E5%99%A8%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%9B%BF%E6%8D%A2%E6%8E%89%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E7%BB%93%E6%9E%84%E4%BD%93%E5%AE%9A%E4%B9%89%22%2C%22%E4%BD%9C%E4%B8%BA%E6%B3%A8%E9%87%8A%E5%AD%98%E5%82%A8%EF%BC%8C%E4%B8%8D%E5%BD%B1%E5%93%8D%E5%AE%9E%E9%99%85%E7%BC%96%E8%AF%91%22%2C%22%E6%9B%BF%E6%8D%A2%E6%8E%89%E6%96%87%E4%BB%B6%E4%B8%AD%E6%89%80%E6%9C%89%E7%9B%B8%E5%85%B3%E4%BB%A3%E7%A0%81%22%2C%22%E8%BF%BD%E5%8A%A0%E5%88%B0%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E7%BB%93%E6%9E%84%E4%BD%93%E5%AE%9A%E4%B9%89%E4%B9%8B%E5%90%8E%EF%BC%8C%E7%9B%B8%E5%BD%93%E4%BA%8E%E8%87%AA%E5%8A%A8%E5%86%99%E4%BA%86%E4%B8%80%E4%B8%AA%20impl%20%E5%9D%97%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22derive%20%E5%AE%8F%E4%B8%8D%E4%BF%AE%E6%94%B9%E5%8E%9F%E6%9D%A5%E7%9A%84%E7%BB%93%E6%9E%84%E4%BD%93%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AA%E6%98%AF%E5%9C%A8%E5%AE%83%E5%90%8E%E9%9D%A2%E8%BF%BD%E5%8A%A0%E7%94%9F%E6%88%90%E7%9A%84%E4%BB%A3%E7%A0%81%E3%80%82%E6%89%80%E4%BB%A5%E8%A2%AB%20%23%5Bderive(Debug)%5D%20%E6%A0%87%E6%B3%A8%E7%9A%84%E7%BB%93%E6%9E%84%E4%BD%93%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E7%9C%8B%E5%88%B0%E5%8E%9F%E5%A7%8B%E7%9A%84%20struct%20%E5%AE%9A%E4%B9%89%20%2B%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%9A%84%20impl%20Debug%20for%20Xxx%20%E5%AE%9E%E7%8E%B0%EF%BC%8C%E4%B8%A4%E8%80%85%E9%83%BD%E5%AD%98%E5%9C%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/02-derive-macros#3:1" data-kind="single" data-payload="%7B%22question%22%3A%22syn%20%E5%92%8C%20quote%20%E5%9C%A8%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%BC%80%E5%8F%91%E4%B8%AD%E5%90%84%E8%87%AA%E8%B4%9F%E8%B4%A3%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22syn%20%E8%B4%9F%E8%B4%A3%E6%8A%8A%20TokenStream%20%E8%A7%A3%E6%9E%90%E4%B8%BA%E5%8F%AF%E6%93%8D%E4%BD%9C%E7%9A%84%20Rust%20AST%EF%BC%88%E8%AE%A9%E4%BD%A0%E8%83%BD%E8%AF%BB%E5%8F%96%E7%B1%BB%E5%9E%8B%E5%90%8D%E3%80%81%E5%AD%97%E6%AE%B5%E7%AD%89%EF%BC%89%EF%BC%8Cquote%20%E8%B4%9F%E8%B4%A3%E9%80%9A%E8%BF%87%E6%A8%A1%E6%9D%BF%E7%94%9F%E6%88%90%E6%96%B0%E7%9A%84%20TokenStream%EF%BC%88%E8%AE%A9%E4%BD%A0%E8%83%BD%E7%94%9F%E6%88%90%20impl%20%E5%9D%97%E7%AD%89%E4%BB%A3%E7%A0%81%EF%BC%89%22%2C%22syn%20%E8%B4%9F%E8%B4%A3%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B%E5%AE%8F%EF%BC%8Cquote%20%E8%B4%9F%E8%B4%A3%E6%B3%A8%E5%86%8C%E8%BF%87%E7%A8%8B%E5%AE%8F%22%2C%22syn%20%E5%92%8C%20quote%20%E5%8A%9F%E8%83%BD%E7%9B%B8%E5%90%8C%EF%BC%8C%E7%94%A8%E5%93%AA%E4%B8%AA%E9%83%BD%E8%A1%8C%22%2C%22syn%20%E5%A4%84%E7%90%86%E7%BB%93%E6%9E%84%E4%BD%93%EF%BC%8Cquote%20%E5%A4%84%E7%90%86%E6%9E%9A%E4%B8%BE%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E4%B8%A4%E8%80%85%E6%98%AF%E4%BA%92%E8%A1%A5%E7%9A%84%E4%B8%80%E5%AF%B9%E5%B7%A5%E5%85%B7%EF%BC%9Asyn%20%3D%20%E8%A7%A3%E6%9E%90%E5%99%A8%EF%BC%88%E8%BE%93%E5%85%A5%20TokenStream%20%E2%86%92%20Rust%20AST%EF%BC%89%EF%BC%8Cquote%20%3D%20%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Rust%20%E8%AF%AD%E6%B3%95%E6%A8%A1%E6%9D%BF%20%E2%86%92%20%E8%BE%93%E5%87%BA%20TokenStream%EF%BC%89%E3%80%82%E7%BB%9D%E5%A4%A7%E5%A4%9A%E6%95%B0%20derive%20%E5%AE%8F%E9%83%BD%E5%90%8C%E6%97%B6%E7%94%A8%E8%BF%99%E4%B8%A4%E4%B8%AA%E5%BA%93%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">// 过程宏代码（在 proc-macro crate 中）
#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: TokenStream) -&gt; TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &amp;ast.ident;
    quote! {
        impl MyTrait for #name {
            fn hello(&amp;self) { println!("Hello from {}!", stringify!(#name)); }
        }
    }.into()
}</code></pre>
<div class="quiz-choice" data-block-id="21-proc-macros/02-derive-macros#3:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E5%AE%8F%E5%B1%95%E5%BC%80%E5%90%8E%EF%BC%8C%23name%20%E4%BC%9A%E8%A2%AB%E6%9B%BF%E6%8D%A2%E6%88%90%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%8F%E5%87%BD%E6%95%B0%E6%9C%AC%E8%BA%AB%E7%9A%84%E5%90%8D%E5%AD%97%20my_derive%22%2C%22%E5%AD%97%E7%AC%A6%E4%B8%B2%20%5C%22name%5C%22%22%2C%22%E8%A2%AB%20%23%5Bderive(MyDerive)%5D%20%E6%A0%87%E6%B3%A8%E7%9A%84%E9%82%A3%E4%B8%AA%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%A0%87%E8%AF%86%E7%AC%A6%EF%BC%88%E5%A6%82%20Point%E3%80%81User%20%E7%AD%89%EF%BC%89%22%2C%22%E7%BC%96%E8%AF%91%E6%97%B6%E7%9A%84%E6%97%B6%E9%97%B4%E6%88%B3%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22quote!%20%E9%87%8C%E7%9A%84%20%23name%20%E6%98%AF%E6%8F%92%E5%80%BC%E8%AF%AD%E6%B3%95%EF%BC%8Cname%20%E6%98%AF%E4%B9%8B%E5%89%8D%E4%BB%8E%20ast.ident%20%E8%8E%B7%E5%8F%96%E7%9A%84%20Ident%EF%BC%88%E7%B1%BB%E5%9E%8B%E5%90%8D%E6%A0%87%E8%AF%86%E7%AC%A6%EF%BC%89%E3%80%82%E5%A6%82%E6%9E%9C%E4%BD%A0%E5%9C%A8%20struct%20Point%20%E4%B8%8A%E7%94%A8%E4%BA%86%E8%BF%99%E4%B8%AA%E5%AE%8F%EF%BC%8C%23name%20%E5%B0%B1%E4%BC%9A%E6%9B%BF%E6%8D%A2%E4%B8%BA%20Point%EF%BC%8C%E7%94%9F%E6%88%90%20impl%20MyTrait%20for%20Point%20%7B%20...%20%7D%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/02-derive-macros#3:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%E8%BF%87%E7%A8%8B%E5%AE%8F%E9%87%8C%EF%BC%8C%E5%A6%82%E4%BD%95%E5%90%91%E7%94%A8%E6%88%B7%E6%8F%90%E4%BE%9B%E7%BC%96%E8%AF%91%E6%97%B6%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%86%99%E5%85%A5%E9%94%99%E8%AF%AF%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6%22%2C%22%E7%94%A8%20println!%20%E8%BE%93%E5%87%BA%E9%94%99%E8%AF%AF%22%2C%22%E5%9C%A8%E8%BF%94%E5%9B%9E%E7%9A%84%20TokenStream%20%E9%87%8C%E5%8C%85%E5%90%AB%20compile_error!(%5C%22...%5C%22)%20%E5%AE%8F%E8%B0%83%E7%94%A8%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E6%8A%8A%E5%AE%83%E5%BD%93%E4%BD%9C%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E6%98%BE%E7%A4%BA%E7%BB%99%E7%94%A8%E6%88%B7%22%2C%22%E7%94%A8%20panic!()%20%E5%AE%8F%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22compile_error!(%5C%22%E6%B6%88%E6%81%AF%5C%22)%20%E6%98%AF%E4%B8%80%E4%B8%AA%E7%89%B9%E6%AE%8A%E7%9A%84%E5%86%85%E7%BD%AE%E5%AE%8F%EF%BC%8C%E5%BD%93%E7%BC%96%E8%AF%91%E5%99%A8%E9%81%87%E5%88%B0%E5%AE%83%E6%97%B6%EF%BC%8C%E4%BC%9A%E6%8A%8A%E5%BC%95%E5%8F%B7%E9%87%8C%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%BD%93%E4%BD%9C%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E8%BE%93%E5%87%BA%E3%80%82%E5%9C%A8%E8%BF%87%E7%A8%8B%E5%AE%8F%E9%87%8C%E6%A3%80%E6%B5%8B%E5%88%B0%E9%9D%9E%E6%B3%95%E4%BD%BF%E7%94%A8%E6%97%B6%EF%BC%8C%E8%BF%94%E5%9B%9E%20quote!%20%7B%20compile_error!(%5C%22...%5C%22)%20%7D.into()%20%E6%98%AF%E6%A0%87%E5%87%86%E7%9A%84%E9%94%99%E8%AF%AF%E6%8A%A5%E5%91%8A%E6%96%B9%E5%BC%8F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
