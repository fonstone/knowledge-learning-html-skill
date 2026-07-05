---
chapterId: "21-proc-macros"
lessonId: "03-attribute-macros"
title: "类属性宏"
level: "进阶"
duration: "30 分钟"
tags: [属性宏, "#[attr]", proc-macro-attribute]
number: "21.3"
chapterTitle: "过程宏"
chapterNumber: "21"
---
<div id="article-content"> <h1 id="属性宏的特点">属性宏的特点</h1>
<h2 id="与-derive-宏的对比">与 derive 宏的对比</h2>
<p>你已经学会了 derive 宏。现在来看<strong>类属性宏</strong>（Attribute Macro）——它比 derive 宏更灵活，也更强大。</p>
<p>两者的关键区别：</p>
<table><thead><tr><th></th><th>derive 宏</th><th>类属性宏</th></tr></thead><tbody><tr><td>语法</td><td><code>#[derive(MyMacro)]</code></td><td><code>#[my_macro]</code> 或 <code>#[my_macro(args)]</code></td></tr><tr><td>只能用于</td><td>结构体和枚举</td><td><strong>任意代码项</strong>（函数、结构体、枚举、impl 块……）</td></tr><tr><td>对原始代码</td><td><strong>保留</strong>原始定义，额外添加代码</td><td><strong>可以完全替换</strong>原始代码项</td></tr><tr><td>接收参数</td><td>无法直接传参（只能用辅助属性）</td><td>可以通过 <code>#[macro(key = value)]</code> 传任意参数</td></tr></tbody></table>
<p>以下都是类属性宏的真实例子：</p>
<pre><code class="language-rust">// web 框架中标注路由
#[get("/users")]
async fn list_users() -&gt; Vec&lt;User&gt; { ... }

// 追踪函数调用（tracing 库）
#[instrument(skip(password))]
fn login(username: &amp;str, password: &amp;str) -&gt; Result&lt;Token, Error&gt; { ... }

// 测试框架标注异步测试（tokio）
#[tokio::test]
async fn test_database_connection() { ... }</code></pre>
<h2 id="属性宏的函数签名">属性宏的函数签名</h2>
<p>属性宏函数接收<strong>两个</strong> <code>TokenStream</code>：</p>
<pre><code class="language-rust">#[proc_macro_attribute]
pub fn my_attr(
    attr: TokenStream,  // #[my_attr(这里的内容)] ← 属性括号里的参数
    item: TokenStream,  // 被标注的代码项（函数体、结构体定义……）
) -&gt; TokenStream {
    // 返回替换后的代码
}</code></pre>
<ul>
<li><code>attr</code>：属性括号里的参数，如 <code>#[route(GET, "/")]</code> 中的 <code>GET, "/"</code> 部分</li>
<li><code>item</code>：被标注的整个代码项（如函数的完整定义）</li>
<li>返回值：<strong>替换</strong> <code>item</code> 的新代码（注意：不是追加，而是替换！）</li>
</ul>
<h1 id="实现一个计时属性宏">实现一个计时属性宏</h1>
<h2 id="需求自动统计函数执行时间">需求：自动统计函数执行时间</h2>
<p>你希望写这样的代码：</p>
<pre><code class="language-rust">#[timed]
fn slow_computation(n: u64) -&gt; u64 {
    // 模拟耗时计算
    (0..n).sum()
}</code></pre>
<p>调用 <code>slow_computation(1000000)</code> 时，自动打印：</p>
<pre><code class="language-text">slow_computation 执行耗时：5.2ms</code></pre>
<p>不用每个函数都手动加计时代码，宏帮你搞定。</p>
<h2 id="实现">实现</h2>
<p>属性宏的关键是：接收原始函数，生成一个包含计时逻辑的新函数。</p>
<pre><code class="language-rust">// my-macros/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn timed(
    _attr: TokenStream,  // 这个宏不需要参数，忽略 attr
    item: TokenStream,   // 被标注的函数
) -&gt; TokenStream {
    // 把 item 解析为一个函数定义（ItemFn）
    let func = parse_macro_input!(item as ItemFn);

    // 提取函数信息
    let func_name = &amp;func.sig.ident;        // 函数名
    let func_name_str = func_name.to_string(); // 函数名的字符串形式
    let func_vis = &amp;func.vis;               // 可见性（pub、pub(crate) 等）
    let func_sig = &amp;func.sig;               // 完整函数签名（名字、参数、返回类型）
    let func_body = &amp;func.block;            // 函数体

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
}</code></pre>
<p>使用时：</p>
<pre><code class="language-rust">use my_macros::timed;

#[timed]
fn compute_sum(n: u64) -&gt; u64 {
    (0..n).sum()
}

fn main() {
    let result = compute_sum(10_000_000);
    println!("结果：{}", result);
    // 输出：
    // compute_sum 执行耗时：15.3ms
    // 结果：49999995000000
}</code></pre>
<p>展开后，宏生成的代码相当于：</p>
<pre><code class="language-rust">fn compute_sum(n: u64) -&gt; u64 {
    let __start = std::time::Instant::now();
    let __result = (|| {
        (0..n).sum()  // 原函数体
    })();
    let __elapsed = __start.elapsed();
    println!("compute_sum 执行耗时：{:.1}ms", __elapsed.as_secs_f64() * 1000.0);
    __result
}</code></pre>
<h1 id="带参数的属性宏">带参数的属性宏</h1>
<h2 id="接收和解析参数">接收和解析参数</h2>
<p>属性宏可以通过 <code>#[my_macro(param)]</code> 传入参数，通过第一个 <code>attr: TokenStream</code> 接收。</p>
<p>下面实现一个 <code>#[retry(n)]</code> 宏——自动在函数失败时重试 n 次：</p>
<pre><code class="language-rust">use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn, LitInt};

#[proc_macro_attribute]
pub fn retry(
    attr: TokenStream, // 接收括号里的参数，如 retry(3) 里的 "3"
    item: TokenStream,
) -&gt; TokenStream {
    // 把参数解析为一个整数字面量
    let retry_count = parse_macro_input!(attr as LitInt);
    let count: u64 = retry_count.base10_parse().unwrap_or(3);

    let func = parse_macro_input!(item as ItemFn);
    let func_name = &amp;func.sig.ident;
    let func_vis = &amp;func.vis;
    let func_sig = &amp;func.sig;
    let func_body = &amp;func.block;

    quote! {
        #func_vis #func_sig {
            let mut __attempts = 0u64;
            loop {
                let __result = (|| #func_body)();
                match __result {
                    Ok(v) =&gt; return Ok(v),
                    Err(e) =&gt; {
                        __attempts += 1;
                        if __attempts &gt;= #count {
                            eprintln!("{} 重试 {} 次后失败", stringify!(#func_name), #count);
                            return Err(e);
                        }
                        eprintln!("{} 第 {} 次失败，重试中...", stringify!(#func_name), __attempts);
                    }
                }
            }
        }
    }.into()
}</code></pre>
<p>使用时：</p>
<pre><code class="language-rust">use my_macros::retry;

#[retry(3)]  // 最多重试 3 次
fn fetch_data(url: &amp;str) -&gt; Result&lt;String, String&gt; {
    // 模拟可能失败的操作
    Err(format!("连接 {} 失败", url))
}

fn main() {
    match fetch_data("https://example.com") {
        Ok(data) =&gt; println!("数据：{}", data),
        Err(e) =&gt; println!("最终失败：{}", e),
    }
    // 输出：
    // fetch_data 第 1 次失败，重试中...
    // fetch_data 第 2 次失败，重试中...
    // fetch_data 重试 3 次后失败
    // 最终失败：连接 https://example.com 失败
}</code></pre>
<h1 id="练习题">练习题</h1>
<h2 id="类属性宏测验">类属性宏测验</h2>
<div class="quiz-choice" data-block-id="21-proc-macros/03-attribute-macros#3:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%92%8C%20derive%20%E5%AE%8F%E6%9C%80%E5%85%B3%E9%94%AE%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%8F%AF%E4%BB%A5%E5%BA%94%E7%94%A8%E4%BA%8E%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E9%A1%B9%EF%BC%88%E5%87%BD%E6%95%B0%E3%80%81%E7%BB%93%E6%9E%84%E4%BD%93%E3%80%81%E6%9E%9A%E4%B8%BE%E7%AD%89%EF%BC%89%E5%B9%B6%E5%8F%AF%E4%BB%A5%E5%AE%8C%E5%85%A8%E6%9B%BF%E6%8D%A2%E5%AE%83%E4%BB%AC%EF%BC%8Cderive%20%E5%AE%8F%E5%8F%AA%E8%83%BD%E4%B8%BA%E7%BB%93%E6%9E%84%E4%BD%93%2F%E6%9E%9A%E4%B8%BE%E8%BF%BD%E5%8A%A0%E4%BB%A3%E7%A0%81%22%2C%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E4%B8%8D%E9%9C%80%E8%A6%81%20syn%20%E5%92%8C%20quote%22%2C%22derive%20%E5%AE%8F%E5%8F%AF%E4%BB%A5%E6%8E%A5%E6%94%B6%E5%8F%82%E6%95%B0%EF%BC%8C%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E4%B8%8D%E8%83%BD%22%2C%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%EF%BC%8Cderive%20%E5%AE%8F%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E7%BB%93%E6%9E%84%E4%BD%93%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E4%B8%A4%E4%B8%AA%E5%85%B3%E9%94%AE%E5%8C%BA%E5%88%AB%EF%BC%9A1.%20%E9%80%82%E7%94%A8%E8%8C%83%E5%9B%B4%E2%80%94%E2%80%94%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%8F%AF%E4%BB%A5%E7%94%A8%E4%BA%8E%E4%BB%BB%E6%84%8F%E9%A1%B9%EF%BC%8Cderive%20%E5%AE%8F%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E7%BB%93%E6%9E%84%E4%BD%93%E5%92%8C%E6%9E%9A%E4%B8%BE%E3%80%822.%20%E5%AF%B9%E5%8E%9F%E5%A7%8B%E4%BB%A3%E7%A0%81%E7%9A%84%E5%A4%84%E7%90%86%E2%80%94%E2%80%94derive%20%E5%AE%8F%E4%BF%9D%E7%95%99%E5%8E%9F%E5%A7%8B%E5%AE%9A%E4%B9%89%E5%B9%B6%E8%BF%BD%E5%8A%A0%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B1%9E%E6%80%A7%E5%AE%8F%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9B%B4%E6%8E%A5%E6%9B%BF%E6%8D%A2%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E6%95%B4%E4%B8%AA%E9%A1%B9%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/03-attribute-macros#3:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E5%87%BD%E6%95%B0%E4%B8%BA%E4%BB%80%E4%B9%88%E6%8E%A5%E6%94%B6%E4%B8%A4%E4%B8%AA%20TokenStream%20%E5%8F%82%E6%95%B0%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%80%E4%B8%AA%E6%98%AF%E5%B1%9E%E6%80%A7%E6%8B%AC%E5%8F%B7%E5%86%85%E7%9A%84%E5%8F%82%E6%95%B0%EF%BC%88%E5%A6%82%20%23%5Bmacro(%E5%8F%82%E6%95%B0)%5D%20%E9%87%8C%E7%9A%84%5C%22%E5%8F%82%E6%95%B0%5C%22%EF%BC%89%EF%BC%8C%E4%B8%80%E4%B8%AA%E6%98%AF%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A1%B9%22%2C%22%E4%B8%A4%E4%B8%AA%E5%8F%82%E6%95%B0%E5%AE%9E%E9%99%85%E4%B8%8A%E6%98%AF%E5%90%8C%E4%B8%80%E4%B8%AA%EF%BC%8C%E6%98%AF%20Rust%20%E7%9A%84%E5%8E%86%E5%8F%B2%E9%81%97%E7%95%99%E8%AE%BE%E8%AE%A1%22%2C%22%E4%B8%80%E4%B8%AA%E6%98%AF%E7%B1%BB%E5%9E%8B%E4%BF%A1%E6%81%AF%EF%BC%8C%E4%B8%80%E4%B8%AA%E6%98%AF%E5%80%BC%E4%BF%A1%E6%81%AF%22%2C%22%E4%B8%80%E4%B8%AA%E6%98%AF%20derive%20%E4%BF%A1%E6%81%AF%EF%BC%8C%E4%B8%80%E4%B8%AA%E6%98%AF%E5%B1%9E%E6%80%A7%E4%BF%A1%E6%81%AF%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%20attr%20%E6%98%AF%E5%B1%9E%E6%80%A7%E6%8B%AC%E5%8F%B7%E9%87%8C%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%8C%E6%AF%94%E5%A6%82%20%23%5Bretry(3)%5D%20%E9%87%8C%E7%9A%84%203%EF%BC%8C%E6%88%96%20%23%5Broute(GET%2C%20%5C%22%2F%5C%22)%5D%20%E9%87%8C%E7%9A%84%20GET%2C%20%5C%22%2F%5C%22%E3%80%82%E7%AC%AC%E4%BA%8C%E4%B8%AA%E5%8F%82%E6%95%B0%20item%20%E6%98%AF%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E6%95%B4%E4%B8%AA%E4%BB%A3%E7%A0%81%E9%A1%B9%EF%BC%8C%E6%AF%94%E5%A6%82%E5%AE%8C%E6%95%B4%E7%9A%84%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89%E3%80%82%E4%B8%A4%E8%80%85%E7%94%A8%E9%80%94%E5%AE%8C%E5%85%A8%E4%B8%8D%E5%90%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">// 假设宏实现如下：
#[proc_macro_attribute]
pub fn log_call(_attr: TokenStream, item: TokenStream) -&gt; TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let name = func.sig.ident.to_string();
    let vis = &amp;func.vis;
    let sig = &amp;func.sig;
    let body = &amp;func.block;
    quote! {
        #vis #sig {
            println!("调用：{}", #name);
            #body
        }
    }.into()
}

// 使用宏标注函数：
#[log_call]
fn greet(name: &amp;str) {
    println!("你好，{}", name);
}</code></pre>
<div class="quiz-choice" data-block-id="21-proc-macros/03-attribute-macros#3:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BD%BF%E7%94%A8%20%23%5Blog_call%5D%20fn%20greet(name%3A%20%26str)%20%7B%20println!(%5C%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%5C%22%2C%20name)%3B%20%7D%20%E5%90%8E%EF%BC%8C%E8%B0%83%E7%94%A8%20greet(%5C%22Alice%5C%22)%20%E4%BC%9A%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BD%A0%E5%A5%BD%EF%BC%8CAlice%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%8Clog_call%20%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%22%2C%22%E8%B0%83%E7%94%A8%EF%BC%9Agreet%5C%5Cn%E4%BD%A0%E5%A5%BD%EF%BC%8CAlice%22%2C%22%E8%B0%83%E7%94%A8%EF%BC%9Agreet%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%AE%8F%E5%9C%A8%E5%8E%9F%E5%87%BD%E6%95%B0%E4%BD%93%E5%89%8D%E6%8F%92%E5%85%A5%E4%BA%86%20println!(%5C%22%E8%B0%83%E7%94%A8%EF%BC%9A%7B%7D%5C%22%2C%20%23name)%EF%BC%8C%E6%89%80%E4%BB%A5%E5%87%BD%E6%95%B0%E5%85%88%E6%89%93%E5%8D%B0%5C%22%E8%B0%83%E7%94%A8%EF%BC%9Agreet%5C%22%EF%BC%8C%E7%84%B6%E5%90%8E%E6%89%A7%E8%A1%8C%E5%8E%9F%E5%87%BD%E6%95%B0%E4%BD%93%E6%89%93%E5%8D%B0%5C%22%E4%BD%A0%E5%A5%BD%EF%BC%8CAlice%5C%22%EF%BC%8C%E6%9C%80%E7%BB%88%E8%BE%93%E5%87%BA%E4%B8%A4%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="21-proc-macros/03-attribute-macros#3:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%A6%82%E6%9E%9C%E8%BF%94%E5%9B%9E%E5%8E%9F%E5%A7%8B%20item%20%E4%B8%8D%E5%8F%98%EF%BC%8C%E6%95%88%E6%9E%9C%E7%AD%89%E4%BA%8E%5C%22%E4%BB%80%E4%B9%88%E9%83%BD%E6%B2%A1%E5%81%9A%5C%22%22%2C%22%E5%BF%85%E9%A1%BB%E8%BF%94%E5%9B%9E%20empty%20TokenStream%22%2C%22%E8%BF%94%E5%9B%9E%E5%80%BC%E4%BC%9A%E5%AE%8C%E5%85%A8%E6%9B%BF%E6%8D%A2%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A1%B9%22%2C%22%E8%BF%94%E5%9B%9E%E5%80%BC%E4%BC%9A%E8%A2%AB%E8%BF%BD%E5%8A%A0%E5%88%B0%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A1%B9%E4%B9%8B%E5%90%8E%22%5D%2C%22correct%22%3A%5B0%2C2%5D%2C%22explanation%22%3A%22%E7%B1%BB%E5%B1%9E%E6%80%A7%E5%AE%8F%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC%E6%98%AF%5C%22%E6%9B%BF%E6%8D%A2%5C%22%E8%AF%AD%E4%B9%89%EF%BC%9A%E8%BF%94%E5%9B%9E%E4%BB%80%E4%B9%88%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%B0%B1%E7%9C%8B%E5%88%B0%E4%BB%80%E4%B9%88%E2%80%94%E2%80%94%E5%8E%9F%E5%A7%8B%E8%A2%AB%E6%A0%87%E6%B3%A8%E7%9A%84%E4%BB%A3%E7%A0%81%E6%B6%88%E5%A4%B1%EF%BC%8C%E5%8F%96%E8%80%8C%E4%BB%A3%E4%B9%8B%E7%9A%84%E6%98%AF%E4%BD%A0%E8%BF%94%E5%9B%9E%E7%9A%84%20TokenStream%E3%80%82%E5%A6%82%E6%9E%9C%E4%BD%A0%E6%8A%8A%20item%20%E5%8E%9F%E6%A0%B7%E8%BF%94%E5%9B%9E%EF%BC%88%E4%B8%8D%E5%8A%A0%E4%BB%BB%E4%BD%95%E4%BF%AE%E6%94%B9%EF%BC%89%EF%BC%8C%E6%95%88%E6%9E%9C%E5%B0%B1%E6%98%AF%E6%B2%A1%E6%9C%89%E4%BF%AE%E6%94%B9%E5%8E%9F%E5%A7%8B%E4%BB%A3%E7%A0%81%E3%80%82%E5%A6%82%E6%9E%9C%E4%BD%A0%E8%BF%94%E5%9B%9E%E5%8C%85%E8%A3%85%E4%BA%86%E8%AE%A1%E6%97%B6%E9%80%BB%E8%BE%91%E7%9A%84%E6%96%B0%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8E%9F%E5%A7%8B%E5%87%BD%E6%95%B0%E5%B0%B1%E8%A2%AB%E6%9B%BF%E6%8D%A2%E4%BA%86%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
