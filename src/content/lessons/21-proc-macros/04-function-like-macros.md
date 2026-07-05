---
chapterId: "21-proc-macros"
lessonId: "04-function-like-macros"
title: "类函数宏"
level: "进阶"
duration: "30 分钟"
tags: [函数宏, "macro!", proc-macro]
number: "21.4"
chapterTitle: "过程宏"
chapterNumber: "21"
---
<div id="article-content"> <h1 id="类函数宏的形式">类函数宏的形式</h1>
<h2 id="三种宏的外观对比">三种宏的外观对比</h2>
<p>你现在认识了三种宏，它们看起来是：</p>
<pre><code class="language-rust">// 1. 声明宏（macro_rules!）
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
html! { &lt;div class="main"&gt;Hello&lt;/div&gt; }</code></pre>
<p><strong>类函数宏</strong>（Function-like Macro）看起来像普通函数调用（加 <code>!</code>），但它的括号里可以是<strong>任意 token 序列</strong>，不需要是合法的 Rust 表达式。</p>
<p><code>sql!(SELECT * FROM users)</code> 这行代码括号里的内容是 SQL，不是 Rust。声明宏和普通函数都做不到接受这样的输入——类函数过程宏可以。</p>
<h2 id="与-macro_rules-的区别">与 macro_rules! 的区别</h2>
<table><thead><tr><th></th><th><code>macro_rules!</code></th><th>类函数过程宏</th></tr></thead><tbody><tr><td>实现方式</td><td>模式匹配规则</td><td>任意 Rust 代码逻辑</td></tr><tr><td>能力</td><td>受限于模式匹配</td><td>可以做任意分析和生成</td></tr><tr><td>错误信息</td><td>有时难以理解</td><td>可以自定义精确错误位置</td></tr><tr><td>调试</td><td>难调试</td><td>是正常的 Rust 函数，可以 println! 调试</td></tr><tr><td>适用场景</td><td>简单重复模式</td><td>复杂解析、编译时验证、DSL</td></tr></tbody></table>
<h2 id="函数签名">函数签名</h2>
<p>类函数宏只接收一个 <code>TokenStream</code>：</p>
<pre><code class="language-rust">#[proc_macro]
pub fn my_macro(input: TokenStream) -&gt; TokenStream {
    // input 是括号里的所有 token
    // 返回值是展开后的代码
    input
}</code></pre>
<p>注意 <code>#[proc_macro]</code> 而不是 <code>#[proc_macro_derive]</code> 或 <code>#[proc_macro_attribute]</code>。</p>
<h1 id="实现一个-html-生成宏">实现一个 HTML 生成宏</h1>
<h2 id="目标">目标</h2>
<p>实现一个简单的 <code>html!</code> 宏，把类似 HTML 的语法转换为字符串拼接代码：</p>
<pre><code class="language-rust">let output = html!(div "container" { "Hello, " strong { "World" } "!" });
// 生成：&lt;div class="container"&gt;Hello, &lt;strong&gt;World&lt;/strong&gt;!&lt;/div&gt;</code></pre>
<p>真正的 <code>html!</code> 宏（如 <code>yew</code> 框架的）非常复杂。这里实现一个简化版，重点学习类函数宏的结构。</p>
<h2 id="简化版实现编译时验证数学表达式">简化版实现：编译时验证数学表达式</h2>
<p>先从更简单的例子开始——一个 <code>assert_positive!</code> 宏，在编译时检查字面量是否为正数：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitInt};

// assert_positive!(42)    → 编译通过
// assert_positive!(-1)    → 编译错误（但 i32 字面量不能是负数，所以这个例子需要调整）
// assert_positive!(0)     → 编译错误：0 不是正数

#[proc_macro]
pub fn assert_positive(input: TokenStream) -&gt; TokenStream {
    // 解析输入为整数字面量
    let lit = parse_macro_input!(input as LitInt);
    let value: i64 = lit.base10_parse().expect("需要整数字面量");

    if value &lt;= 0 {
        // 返回编译错误
        return quote! {
            compile_error!("assert_positive! 需要正整数");
        }.into();
    }

    // 编译通过，生成值本身的代码
    let u = value as u64;
    quote! { #u }.into()
}</code></pre>
<p>使用时：</p>
<pre><code class="language-rust">use my_macros::assert_positive;

fn main() {
    let n = assert_positive!(42);   // ✅ 编译时确认 42 &gt; 0
    println!("{}", n);              // 42
    
    // let m = assert_positive!(0); // ❌ 编译错误：assert_positive! 需要正整数
}</code></pre>
<p>这个宏虽然简单，但演示了核心能力：<strong>在编译时验证数据的合法性</strong>，违法时给出清晰错误，比运行时的 <code>assert!</code> 更早发现问题。</p>
<h2 id="实现一个格式验证宏checked_parse">实现一个格式验证宏（checked_parse）</h2>
<p>下面实现一个更实用的宏：在编译时验证字符串是否是合法的格式：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitStr};

// 检查 IP 地址格式（编译时）
#[proc_macro]
pub fn ip(input: TokenStream) -&gt; TokenStream {
    let lit = parse_macro_input!(input as LitStr);
    let value = lit.value();

    // 在编译时解析 IP 地址——如果格式不对，编译报错
    let parsed: Result&lt;std::net::IpAddr, _&gt; = value.parse();
    match parsed {
        Ok(_) =&gt; {
            // 合法 IP，生成解析表达式
            quote! {
                #lit.parse::&lt;std::net::IpAddr&gt;().unwrap()
            }.into()
        }
        Err(_) =&gt; {
            // 非法 IP，编译时报错，并精确指向这个宏调用的位置
            let msg = format!("非法的 IP 地址：{}", value);
            quote! {
                compile_error!(#msg)
            }.into()
        }
    }
}</code></pre>
<p>使用时：</p>
<pre><code class="language-rust">use my_macros::ip;

fn main() {
    let addr = ip!("192.168.1.1");   // ✅ 编译时验证通过
    println!("{}", addr);            // 192.168.1.1

    // let bad = ip!("999.999.0.0"); // ❌ 编译错误：非法的 IP 地址：999.999.0.0
    // let bad2 = ip!("localhost");  // ❌ 编译错误：非法的 IP 地址：localhost
}</code></pre>
<p>这是类函数过程宏的经典用途：<strong>把运行时才会发现的错误，提前到编译时报告</strong>。</p>
<h2 id="实现一个-sql-模板宏简化版">实现一个 SQL 模板宏（简化版）</h2>
<p>真实框架中 <code>sqlx</code> 的 <code>query!</code> 宏会在编译时连接数据库验证 SQL。这里实现一个简化版，只验证 SQL 语法关键字：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitStr};

// sql!("SELECT * FROM users") → 生成字符串常量，同时验证以 SELECT/INSERT/UPDATE/DELETE 开头
#[proc_macro]
pub fn sql(input: TokenStream) -&gt; TokenStream {
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
}</code></pre>
<p>使用时：</p>
<pre><code class="language-rust">use my_macros::sql;

fn main() {
    let q = sql!("SELECT * FROM users WHERE id = 1");  // ✅
    println!("执行查询：{}", q);

    // let bad = sql!("HACK users SET admin = true");  // ❌ 编译错误
}</code></pre>
<h1 id="练习题">练习题</h1>
<h2 id="类函数宏测验">类函数宏测验</h2>
<div class="quiz-choice" data-block-id="21-proc-macros/04-function-like-macros#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E5%92%8C%E5%A3%B0%E6%98%8E%E5%AE%8F%EF%BC%88macro_rules!%EF%BC%89%E7%9A%84%E6%9C%80%E5%A4%A7%E4%BC%98%E5%8A%BF%E5%B7%AE%E5%BC%82%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E5%8F%AF%E4%BB%A5%E8%BF%90%E8%A1%8C%E4%BB%BB%E6%84%8F%20Rust%20%E9%80%BB%E8%BE%91%E6%9D%A5%E5%88%86%E6%9E%90%20token%EF%BC%8C%E8%80%8C%20macro_rules!%20%E5%8F%AA%E8%83%BD%E5%81%9A%E6%A8%A1%E5%BC%8F%E5%8C%B9%E9%85%8D%E6%9B%BF%E6%8D%A2%22%2C%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E4%B8%8D%E9%9C%80%E8%A6%81%20!%22%2C%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E6%89%A7%E8%A1%8C%E9%80%9F%E5%BA%A6%E6%9B%B4%E5%BF%AB%22%2C%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%B5%8B%E8%AF%95%EF%BC%8Cmacro_rules!%20%E4%B8%8D%E8%A1%8C%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22macro_rules!%20%E7%9A%84%E6%A0%B8%E5%BF%83%E9%99%90%E5%88%B6%EF%BC%9A%E5%AE%83%E5%8F%AA%E8%83%BD%E6%A3%80%E6%9F%A5%E8%BE%93%E5%85%A5%20token%20%E6%98%AF%E5%90%A6%5C%22%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%E6%9F%90%E7%A7%8D%E5%BD%A2%E7%8A%B6%5C%22%EF%BC%8C%E7%84%B6%E5%90%8E%E6%8C%89%E6%A8%A1%E6%9D%BF%E6%9B%BF%E6%8D%A2%E2%80%94%E2%80%94%E6%97%A0%E6%B3%95%E8%BF%90%E8%A1%8C%E4%BB%A3%E7%A0%81%E9%80%BB%E8%BE%91%E3%80%81%E6%97%A0%E6%B3%95%E5%81%9A%E8%AE%A1%E7%AE%97%E3%80%81%E6%97%A0%E6%B3%95%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E6%9F%A5%E8%AF%A2%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90%EF%BC%88%E5%A6%82%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%89%E3%80%82%E7%B1%BB%E5%87%BD%E6%95%B0%E8%BF%87%E7%A8%8B%E5%AE%8F%E6%9C%AC%E8%B4%A8%E6%98%AF%E4%B8%80%E4%B8%AA%20Rust%20%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%BF%90%E8%A1%8C%E4%BB%BB%E6%84%8F%E9%80%BB%E8%BE%91%EF%BC%8C%E5%8C%85%E6%8B%AC%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93%E9%AA%8C%E8%AF%81%20SQL%EF%BC%88sqlx%20%E5%B0%B1%E8%BF%99%E4%B9%88%E5%81%9A%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/04-function-like-macros#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E7%9A%84%E4%B8%BB%E8%A6%81%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF%E6%98%AF%E5%93%AA%E4%B8%AA%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E7%94%9F%E6%88%90%20trait%20%E5%AE%9E%E7%8E%B0%22%2C%22%E5%AE%9E%E7%8E%B0%E8%BF%90%E7%AE%97%E7%AC%A6%E9%87%8D%E8%BD%BD%22%2C%22%E6%9B%BF%E4%BB%A3%E6%89%80%E6%9C%89%E7%9A%84%20macro_rules!%20%E5%AE%8F%22%2C%22%E7%BC%96%E8%AF%91%E6%97%B6%E9%AA%8C%E8%AF%81%EF%BC%88%E9%AA%8C%E8%AF%81%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%A0%BC%E5%BC%8F%E3%80%81SQL%20%E8%AF%AD%E6%B3%95%E3%80%81%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%AD%89%EF%BC%89%EF%BC%8C%E4%BB%A5%E5%8F%8A%E5%AE%9E%E7%8E%B0%E9%9C%80%E8%A6%81%E4%BB%BB%E6%84%8F%20token%20%E8%BE%93%E5%85%A5%E7%9A%84%20DSL%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E7%9A%84%E6%9D%80%E6%89%8B%E7%BA%A7%E7%94%A8%E9%80%94%E6%98%AF%5C%22%E6%8A%8A%E8%BF%90%E8%A1%8C%E6%97%B6%E9%94%99%E8%AF%AF%E6%8F%90%E5%89%8D%E5%88%B0%E7%BC%96%E8%AF%91%E6%97%B6%5C%22%E2%80%94%E2%80%94%E6%AF%94%E5%A6%82%20regex!(%5C%22...%5C%22)%20%E7%BC%96%E8%AF%91%E6%97%B6%E9%AA%8C%E8%AF%81%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%98%AF%E5%90%A6%E5%90%88%E6%B3%95%EF%BC%8Csql!(%5C%22...%5C%22)%20%E7%BC%96%E8%AF%91%E6%97%B6%E9%AA%8C%E8%AF%81%20SQL%20%E8%AF%AD%E6%B3%95%EF%BC%8Cformat_spec!(%5C%22...%5C%22)%20%E9%AA%8C%E8%AF%81%E6%A0%BC%E5%BC%8F%E5%AD%97%E7%AC%A6%E4%B8%B2%E3%80%82%E8%BF%99%E4%BA%9B%E5%9C%A8%20macro_rules!%20%E9%87%8C%E5%BE%88%E9%9A%BE%E7%94%9A%E8%87%B3%E6%97%A0%E6%B3%95%E5%AE%9E%E7%8E%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">#[proc_macro]
pub fn double(input: TokenStream) -&gt; TokenStream {
    let lit = parse_macro_input!(input as LitInt);
    let value: u64 = lit.base10_parse().unwrap();
    let doubled = value * 2;
    quote! { #doubled }.into()
}</code></pre>
<div class="quiz-choice" data-block-id="21-proc-macros/04-function-like-macros#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22double!(21)%20%E8%BF%99%E4%B8%AA%E5%AE%8F%E5%B1%95%E5%BC%80%E5%90%8E%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%94%9F%E6%88%90%E4%B8%80%E4%B8%AA%E5%90%8D%E4%B8%BA%20double_21%20%E7%9A%84%E5%B8%B8%E9%87%8F%22%2C%22%E8%B0%83%E7%94%A8%E4%B8%80%E4%B8%AA%E5%90%8D%E4%B8%BA%20double%20%E7%9A%84%E5%87%BD%E6%95%B0%EF%BC%8C%E4%BC%A0%E5%85%A5%2021%22%2C%22%E7%9B%B4%E6%8E%A5%E6%9B%BF%E6%8D%A2%E4%B8%BA%E6%95%B0%E5%AD%97%E5%AD%97%E9%9D%A2%E9%87%8F%2042%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%8C21%20*%202%20%E4%B8%8D%E8%83%BD%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%AE%A1%E7%AE%97%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E8%BF%87%E7%A8%8B%E5%AE%8F%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E6%89%A7%E8%A1%8C%E3%80%82double!(21)%20%E8%B0%83%E7%94%A8%E6%97%B6%EF%BC%8C%E5%AE%8F%E6%8E%A5%E6%94%B6%2021%20%E8%BF%99%E4%B8%AA%20token%EF%BC%8C%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%AE%A1%E7%AE%97%2021%20*%202%20%3D%2042%EF%BC%8C%E7%84%B6%E5%90%8E%E8%BF%94%E5%9B%9E%20quote!%20%7B%2042%20%7D%E3%80%82%E5%9C%A8%E6%9C%80%E7%BB%88%E7%9A%84%E7%BC%96%E8%AF%91%E7%BB%93%E6%9E%9C%E9%87%8C%EF%BC%8Cdouble!(21)%20%E5%B0%B1%E7%AD%89%E4%BA%8E%E7%9B%B4%E6%8E%A5%E5%86%99%2042%EF%BC%8C%E6%B2%A1%E6%9C%89%E4%BB%BB%E4%BD%95%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%80%E9%94%80%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/04-function-like-macros#2:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E6%98%AF%E7%B1%BB%E5%87%BD%E6%95%B0%E8%BF%87%E7%A8%8B%E5%AE%8F%E7%9A%84%E5%90%88%E7%90%86%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%9B%BF%E4%BB%A3%E6%99%AE%E9%80%9A%E7%9A%84%20fn%20%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89%22%2C%22%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%B1%BB%E4%BC%BC%20HTML%20%E6%A8%A1%E6%9D%BF%E7%9A%84%20DSL%EF%BC%8C%E6%8B%AC%E5%8F%B7%E9%87%8C%E5%86%99%20HTML%20%E8%AF%AD%E6%B3%95%22%2C%22%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93%E9%AA%8C%E8%AF%81%20SQL%20%E6%9F%A5%E8%AF%A2%E7%9A%84%E5%88%97%E5%90%8D%E5%92%8C%E7%B1%BB%E5%9E%8B%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%EF%BC%88sqlx%20%E7%9A%84%E5%81%9A%E6%B3%95%EF%BC%89%22%2C%22%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E9%AA%8C%E8%AF%81%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%A0%BC%E5%BC%8F%E6%98%AF%E5%90%A6%E5%90%88%E6%B3%95%EF%BC%88%E5%A6%82%20regex!(%5C%22%5Binvalid%5C%22)%EF%BC%89%22%5D%2C%22correct%22%3A%5B1%2C2%2C3%5D%2C%22explanation%22%3A%22%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E7%9A%84%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%EF%BC%9A%E5%A4%84%E7%90%86%E9%9D%9E%E6%A0%87%E5%87%86%20Rust%20%E8%AF%AD%E6%B3%95%E7%9A%84%20token%EF%BC%88DSL%EF%BC%89%E3%80%81%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%BF%90%E8%A1%8C%E4%BB%BB%E6%84%8F%E9%80%BB%E8%BE%91%EF%BC%88%E9%AA%8C%E8%AF%81%E3%80%81%E6%9F%A5%E8%AF%A2%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90%EF%BC%89%E3%80%82%E4%B8%8D%E8%83%BD%E7%94%A8%E4%BA%8E%E5%AE%9A%E4%B9%89%E5%87%BD%E6%95%B0%E2%80%94%E2%80%94%E9%82%A3%E6%98%AF%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E7%9A%84%E4%BA%8B%EF%BC%88%E8%99%BD%E7%84%B6%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%8F%AF%E4%BB%A5%E5%B8%AE%E4%BD%A0%E7%94%9F%E6%88%90%E5%87%BD%E6%95%B0%EF%BC%8C%E4%BD%86%E7%B1%BB%E5%87%BD%E6%95%B0%E5%AE%8F%E6%9C%AC%E8%BA%AB%E4%B8%8D%E6%98%AF%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89%E8%AF%AD%E6%B3%95%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
