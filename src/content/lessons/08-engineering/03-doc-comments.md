---
chapterId: "08-engineering"
lessonId: "03-doc-comments"
title: "文档注释与 doctest"
level: "入门"
duration: "20 分钟"
tags: ["文档注释", "doctest", "///", "//!", "cargo doc", "cargo test"]
number: "8.3"
chapterTitle: "项目工程化"
chapterNumber: "08"
---

<div id="article-content"> <h1 id="文档注释">文档注释</h1>
<p><strong>什么是文档注释？</strong> Rust 有一种特殊的注释叫”文档注释”，它不仅注解代码，还能用 <code>cargo doc</code> 生成漂亮的 HTML 文档。这对 Rust 生态特别重要。</p>
<p><strong>为什么需要文档注释？</strong> 与 C/C++ 不同，Rust <strong>没有头文件</strong>。C 使用者看头文件（<code>.h</code>）来了解库的接口，但 Rust 库没有这个。所以 Rust 社区的约定是：<strong>库作者必须用文档注释详细说明每个 pub API 的用法、参数含义、返回值、可能的错误——使用者完全靠这些文档来理解如何使用库</strong>。这也是为什么 Rust 开源社区对文档质量有很高的要求。</p>
<p><strong>什么内容需要文档注释？</strong></p>
<ul>
<li><strong>所有 pub 项</strong>：任何公开的函数、结构体、枚举、trait、常量都应该有文档</li>
<li><strong>复杂的逻辑</strong>：非显而易见的行为、性能特性、安全约束等</li>
<li><strong>模块和 crate 级别</strong>：用 <code>//!</code> 说明整个模块的目的和使用场景</li>
<li><strong>字段注释</strong>：struct 和 enum 的每个公开字段都值得记录</li>
</ul>
<h2 id="两种文档注释">两种文档注释</h2>
<blockquote>
<p><strong>基础回顾</strong>：<code>///</code> 和 <code>//!</code> 的基本语法已在<a href="/RustCourse/chapters/02-basic-syntax/01-comments#%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A--1">《注释》</a>章节讲解。这里关注文档注释的<strong>进阶用法</strong>：Markdown 格式、标准文档章节、代码示例验证等。</p>
</blockquote>
<blockquote>
<p><strong>使用规则</strong>：</p>
<ul>
<li><code>//!</code> 放在 <code>lib.rs</code> 顶部 → crate 级别的文档（在 docs.rs 首页显示）</li>
<li><code>//!</code> 放在模块文件顶部 → 该模块的文档</li>
<li><code>///</code> 放在每个 pub item 之前 → 该 item 的文档</li>
</ul>
</blockquote>
<h2 id="文档注释中的-markdown">文档注释中的 Markdown</h2>
<p>文档注释支持完整的 Markdown 语法：</p>
<pre><code class="language-rust">/// 一个简单的用户结构体。
///
/// ## 字段说明
///
/// - `name`：用户名，不能为空
/// - `age`：用户年龄，必须大于 0
///
/// ## 示例
///
/// ```rust
/// let user = User { name: "Alice".to_string(), age: 25 };
/// assert_eq!(user.name, "Alice");
/// ```
pub struct User {
    /// 用户的名称
    pub name: String,
    /// 用户的年龄（岁）
    pub age: u32,
}</code></pre>
<p>代码块（<code>```</code>）、加粗、斜体、列表、表格、链接——Markdown 里有的这里都支持。生成的文档会按 Markdown 渲染成 HTML。</p>
<h2 id="标准文档章节">标准文档章节</h2>
<p>Rust 社区约定了几个标准章节名，<code>cargo doc</code> 会把它们格式化得更显眼。这类似于 Doxygen（C/C++ 的文档生成工具）的概念——用特定的标记让文档生成工具能够识别和组织信息：</p>
<div class="code-runner" data-full-code="%2F%2F%2F%20%E5%B0%86%E4%B8%A4%E4%B8%AA%E5%90%91%E9%87%8F%E6%8B%BC%E6%8E%A5%EF%BC%8C%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%E6%96%B0%E5%90%91%E9%87%8F%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Examples%0A%2F%2F%2F%0A%2F%2F%2F%20%60%60%60rust%0A%2F%2F%2F%20let%20a%20%3D%20vec!%5B1%2C%202%5D%3B%0A%2F%2F%2F%20let%20b%20%3D%20vec!%5B3%2C%204%5D%3B%0A%2F%2F%2F%20let%20c%20%3D%20concat_vecs(a%2C%20b)%3B%0A%2F%2F%2F%20assert_eq!(c%2C%20vec!%5B1%2C%202%2C%203%2C%204%5D)%3B%0A%2F%2F%2F%20%60%60%60%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Panics%0A%2F%2F%2F%0A%2F%2F%2F%20%E6%9C%AC%E5%87%BD%E6%95%B0%E4%B8%8D%E4%BC%9A%20panic%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Errors%0A%2F%2F%2F%0A%2F%2F%2F%20%E6%9C%AC%E5%87%BD%E6%95%B0%E4%B8%8D%E8%BF%94%E5%9B%9E%20%60Result%60%EF%BC%8C%E5%9B%A0%E6%AD%A4%E4%B8%8D%E4%BC%9A%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Safety%0A%2F%2F%2F%0A%2F%2F%2F%20%E6%9C%AC%E5%87%BD%E6%95%B0%E5%AE%8C%E5%85%A8%E5%AE%89%E5%85%A8%EF%BC%8C%E6%97%A0%E9%9C%80%20unsafe%E3%80%82%0Apub%20fn%20concat_vecs(mut%20a%3A%20Vec%3Ci32%3E%2C%20b%3A%20Vec%3Ci32%3E)%20-%3E%20Vec%3Ci32%3E%20%7B%0A%20%20%20%20a.extend(b)%3B%0A%20%20%20%20a%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20result%20%3D%20concat_vecs(vec!%5B1%2C%202%5D%2C%20vec!%5B3%2C%204%5D)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">/// 将两个向量拼接，返回一个新向量。
///
/// # Examples
///
/// ```rust
/// let a = vec![1, 2];
/// let b = vec![3, 4];
/// let c = concat_vecs(a, b);
/// assert_eq!(c, vec![1, 2, 3, 4]);
/// ```
///
/// # Panics
///
/// 本函数不会 panic。
///
/// # Errors
///
/// 本函数不返回 `Result`，因此不会产生错误。
///
/// # Safety
///
/// 本函数完全安全，无需 unsafe。
pub fn concat_vecs(mut a: Vec&lt;i32&gt;, b: Vec&lt;i32&gt;) -&gt; Vec&lt;i32&gt; {
    a.extend(b);
    a
}

fn main() {
    let result = concat_vecs(vec![1, 2], vec![3, 4]);
    println!("{:?}", result);
}</code></pre></div>
<p>常用章节：</p>
<table><thead><tr><th>章节</th><th>用途</th></tr></thead><tbody><tr><td><code># Examples</code></td><td>代码示例（几乎所有 pub API 都该有）</td></tr><tr><td><code># Panics</code></td><td>说明什么情况下会 panic</td></tr><tr><td><code># Errors</code></td><td>返回 <code>Result</code> 时说明错误类型和原因</td></tr><tr><td><code># Safety</code></td><td><code>unsafe fn</code> 必须说明调用者的安全不变量</td></tr></tbody></table>
<h2 id="生成和查看文档">生成和查看文档</h2>
<pre><code class="language-bash"># 生成文档，输出到 target/doc/
cargo doc

# 生成并在浏览器中打开
cargo doc --open

# 生成时包含私有 item 的文档
cargo doc --document-private-items</code></pre>
<p><code>cargo doc</code> 会在 <code>target/doc/</code> 目录下生成完整的 HTML 文档。你可以在 <a href="https://doc.rust-lang.org/std/">官方 Rust 文档</a>上看到标准库的文档效果——这些都是用 <code>cargo doc</code> 生成的。</p>
<h1 id="doctest">Doctest</h1>
<h2 id="什么是-doctest">什么是 Doctest</h2>
<p>文档注释里的代码块不仅是展示用的——<code>cargo test</code> 会自动把它们当成测试用例来编译和运行。这叫 <strong>doctest</strong>。</p>
<p>好处：</p>
<ul>
<li>文档和测试合二为一，修改 API 时如果忘了更新文档里的示例，测试会失败</li>
<li>文档里的代码示例永远是”能运行的”，不会变成过时的死代码</li>
</ul>
<div class="code-runner" data-full-code="%2F%2F%2F%20%E5%B0%86%E6%91%84%E6%B0%8F%E5%BA%A6%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%8D%8E%E6%B0%8F%E5%BA%A6%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Examples%0A%2F%2F%2F%0A%2F%2F%2F%20%60%60%60rust%0A%2F%2F%2F%20%2F%2F%20%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E4%BC%9A%E8%A2%AB%20cargo%20test%20%E5%BD%93%E4%BD%9C%E6%B5%8B%E8%AF%95%E8%BF%90%E8%A1%8C%EF%BC%81%0A%2F%2F%2F%20assert_eq!(celsius_to_fahrenheit(0.0)%2C%2032.0)%3B%0A%2F%2F%2F%20assert_eq!(celsius_to_fahrenheit(100.0)%2C%20212.0)%3B%0A%2F%2F%2F%20%60%60%60%0Apub%20fn%20celsius_to_fahrenheit(c%3A%20f64)%20-%3E%20f64%20%7B%0A%20%20%20%20c%20*%209.0%20%2F%205.0%20%2B%2032.0%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22100%C2%B0C%20%3D%20%7B%7D%C2%B0F%22%2C%20celsius_to_fahrenheit(100.0))%3B%0A%7D" data-mode="run"><pre><code class="language-rust">/// 将摄氏度转换为华氏度。
///
/// # Examples
///
/// ```rust
/// // 这段代码会被 cargo test 当作测试运行！
/// assert_eq!(celsius_to_fahrenheit(0.0), 32.0);
/// assert_eq!(celsius_to_fahrenheit(100.0), 212.0);
/// ```
pub fn celsius_to_fahrenheit(c: f64) -&gt; f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
}</code></pre></div>
<h2 id="运行-doctest">运行 Doctest</h2>
<pre><code class="language-bash"># 运行所有测试（包括 doctests、单元测试、集成测试）
cargo test

# 只运行 doctests
cargo test --doc

# 运行特定函数的 doctest（按函数名过滤）
cargo test celsius_to_fahrenheit</code></pre>
<h2 id="在-doctest-中隐藏代码">在 Doctest 中隐藏代码</h2>
<p>有时候示例需要一些样板代码（<code>use</code> 语句、辅助结构体、错误处理等），但这些代码放在文档里会分散注意力。用 <code>#</code> 加空格开头的行可以在文档中隐藏，但在 doctest 运行时仍然包含：</p>
<div class="code-runner" data-full-code="%2F%2F%2F%20%E8%A7%A3%E6%9E%90%20JSON%20%E6%A0%BC%E5%BC%8F%E7%9A%84%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E3%80%82%0A%2F%2F%2F%0A%2F%2F%2F%20%23%20Examples%0A%2F%2F%2F%0A%2F%2F%2F%20%60%60%60rust%0A%2F%2F%2F%20%23%20%2F%2F%20%E8%BF%99%E4%B8%80%E8%A1%8C%E5%9C%A8%E6%96%87%E6%A1%A3%E9%87%8C%E4%B8%8D%E6%98%BE%E7%A4%BA%EF%BC%8C%E4%BD%86%20doctest%20%E8%BF%90%E8%A1%8C%E6%97%B6%E5%8C%85%E5%90%AB%0A%2F%2F%2F%20%23%20struct%20User%20%7B%20name%3A%20String%2C%20age%3A%20u32%20%7D%0A%2F%2F%2F%20%23%20fn%20parse_user(s%3A%20%26str)%20-%3E%20Option%3CUser%3E%20%7B%0A%2F%2F%2F%20%23%20%20%20%20%20Some(User%20%7B%20name%3A%20s.to_string()%2C%20age%3A%2018%20%7D)%0A%2F%2F%2F%20%23%20%7D%0A%2F%2F%2F%20let%20user%20%3D%20parse_user(%22Alice%22)%3B%0A%2F%2F%2F%20assert!(user.is_some())%3B%0A%2F%2F%2F%20%60%60%60%0Apub%20fn%20demo()%20%7B%0A%20%20%20%20println!(%22%E6%BC%94%E7%A4%BA%20doctest%20%E9%9A%90%E8%97%8F%E8%A1%8C%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20demo()%3B%0A%7D" data-mode="run"><pre><code class="language-rust">/// 解析 JSON 格式的用户数据。
///
/// # Examples
///
/// ```rust
/// # // 这一行在文档里不显示，但 doctest 运行时包含
/// # struct User { name: String, age: u32 }
/// # fn parse_user(s: &amp;str) -&gt; Option&lt;User&gt; {
/// #     Some(User { name: s.to_string(), age: 18 })
/// # }
/// let user = parse_user("Alice");
/// assert!(user.is_some());
/// ```
pub fn demo() {
    println!("演示 doctest 隐藏行");
}

fn main() {
    demo();
}</code></pre></div>
<blockquote>
<p><code>#</code> 冲突问题：在 doctest 的<strong>代码块内部</strong>，#  是特殊语法（用于隐藏行）。而 Markdown 的 # 是在代码块外部用于标题。两者的上下文不同，所以不会混淆。</p>
</blockquote>
<h2 id="doctest-的特殊标记">Doctest 的特殊标记</h2>
<p>代码块可以加修饰词来改变 doctest 的行为（如果有写代码不想作为测试的代码，可以使用以下方式）：</p>
<pre><code class="language-markdown">```rust,no_run
// no_run：编译但不运行（适合会产生副作用的代码，如网络请求）
let response = http_get("https://example.com").unwrap();
```

```rust,ignore
// ignore：既不编译也不运行（适合伪代码或未完成的示例）
let x = some_function_that_doesnt_exist();
```

```rust,should_panic
// should_panic：期望代码 panic（正确运行反而失败）
let v: Vec&lt;i32&gt; = vec![];
let _ = v[0];  // 越界访问，应该 panic
```

```rust,compile_fail
// compile_fail：期望代码编译失败（展示错误用法）
let s = String::from("hello");
let r1 = &amp;mut s;  // 错误：s 不可变
```</code></pre>
<h2 id="跨行示例-运算符">跨行示例：? 运算符</h2>
<p><code>?</code> 运算符用于错误传播，在 <code>Result</code> 或 <code>Option</code> 后使用时，如果是 <code>Err</code> 或 <code>None</code> 就立即返回，否则继续执行。Doctest 里默认没有 <code>main()</code> 函数，也没有 <code>?</code> 的错误传播上下文。如果示例需要用 <code>?</code>，需要用 <code>#</code> 隐藏行来提供一个返回 <code>Result</code> 的函数作为上下文。这里了解即可。</p>
<h1 id="练习题">练习题</h1>
<h2 id="文档注释测验">文档注释测验</h2>
<div class="quiz-choice" data-block-id="08-engineering/03-doc-comments#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%60%2F%2F%2F%60%20%E5%92%8C%20%60%2F%2F!%60%20%E7%9A%84%E6%A0%B8%E5%BF%83%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%60%2F%2F%2F%60%20%E6%B3%A8%E9%87%8A%E7%B4%A7%E8%B7%9F%E5%85%B6%E5%90%8E%E7%9A%84%20item%EF%BC%8C%60%2F%2F!%60%20%E6%B3%A8%E9%87%8A%E5%8C%85%E5%90%AB%E5%AE%83%E7%9A%84%20item%EF%BC%88%E6%A8%A1%E5%9D%97%E6%88%96%20crate%EF%BC%89%22%2C%22%E4%B8%A4%E8%80%85%E5%AE%8C%E5%85%A8%E7%AD%89%E4%BB%B7%EF%BC%8C%E5%8F%AA%E6%98%AF%E9%A3%8E%E6%A0%BC%E4%B8%8D%E5%90%8C%22%2C%22%60%2F%2F%2F%60%20%E6%98%AF%E5%8D%95%E8%A1%8C%E6%B3%A8%E9%87%8A%EF%BC%8C%60%2F%2F!%60%20%E6%98%AF%E5%A4%9A%E8%A1%8C%E6%B3%A8%E9%87%8A%22%2C%22%60%2F%2F%2F%60%20%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%EF%BC%8C%60%2F%2F!%60%20%E5%8F%AA%E8%83%BD%E7%94%A8%E4%BA%8E%E6%A8%A1%E5%9D%97%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E5%8C%BA%E5%88%AB%E5%9C%A8%E4%BA%8E%5C%22%E6%B3%A8%E9%87%8A%E8%B0%81%5C%22%E3%80%82%2F%2F%2F%20%E6%98%AF%5C%22%E5%A4%96%E9%83%A8%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%5C%22%EF%BC%8C%E5%86%99%E5%9C%A8%20item%20%E4%B9%8B%E5%89%8D%EF%BC%8C%E6%B3%A8%E9%87%8A%E9%82%A3%E4%B8%AA%20item%E3%80%82%2F%2F!%20%E6%98%AF%5C%22%E5%86%85%E9%83%A8%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%5C%22%EF%BC%8C%E5%86%99%E5%9C%A8%E6%A8%A1%E5%9D%97%2F%E6%96%87%E4%BB%B6%E7%9A%84%E6%9C%80%E9%A1%B6%E9%83%A8%EF%BC%8C%E6%B3%A8%E9%87%8A%E5%8C%85%E5%90%AB%E5%AE%83%E7%9A%84%E9%82%A3%E4%B8%AA%20item%EF%BC%88%E9%80%9A%E5%B8%B8%E6%98%AF%E6%95%B4%E4%B8%AA%E6%A8%A1%E5%9D%97%E6%88%96%20crate%EF%BC%89%E3%80%82lib.rs%20%E9%A1%B6%E9%83%A8%E7%9A%84%20%2F%2F!%20%E5%B0%B1%E6%98%AF%E6%95%B4%E4%B8%AA%20crate%20%E7%9A%84%E6%96%87%E6%A1%A3%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/03-doc-comments#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A%E4%B8%AD%E7%94%A8%E4%B8%89%E4%B8%AA%E5%8F%8D%E5%BC%95%E5%8F%B7%E5%8C%85%E8%A3%B9%E7%9A%84%E4%BB%A3%E7%A0%81%E5%9D%97%EF%BC%8C%E4%BC%9A%E8%A2%AB%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E4%BD%9C%E4%B8%BA%E5%B1%95%E7%A4%BA%E7%94%A8%EF%BC%8C%E4%B8%8D%E4%BC%9A%E6%89%A7%E8%A1%8C%22%2C%22%E8%A2%AB%20cargo%20test%20%E5%BD%93%E4%BD%9C%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E7%BC%96%E8%AF%91%E5%B9%B6%E8%BF%90%E8%A1%8C%EF%BC%88doctest%EF%BC%89%22%2C%22%E5%8F%AA%E5%9C%A8%20cargo%20doc%20%E6%97%B6%E8%A2%AB%E9%AA%8C%E8%AF%81%E8%AF%AD%E6%B3%95%22%2C%22%E5%8F%AA%E6%9C%89%E5%8A%A0%E4%BA%86%20runnable%20%E6%A0%87%E8%AE%B0%E6%89%8D%E4%BC%9A%E8%A2%AB%E6%B5%8B%E8%AF%95%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E8%BF%99%E5%B0%B1%E6%98%AF%20doctest%20%E7%9A%84%E6%A0%B8%E5%BF%83%EF%BC%9A%E6%96%87%E6%A1%A3%E9%87%8C%E7%9A%84%E4%BB%A3%E7%A0%81%E5%9D%97%E9%BB%98%E8%AE%A4%E4%BC%9A%E8%A2%AB%20cargo%20test%20%E5%BD%93%E4%BD%9C%E6%B5%8B%E8%AF%95%E8%BF%90%E8%A1%8C%E3%80%82%E8%BF%99%E4%BF%9D%E8%AF%81%E4%BA%86%E6%96%87%E6%A1%A3%E7%A4%BA%E4%BE%8B%E5%A7%8B%E7%BB%88%E6%98%AF%E6%AD%A3%E7%A1%AE%E5%8F%AF%E8%BF%90%E8%A1%8C%E7%9A%84%EF%BC%8CAPI%20%E5%8F%98%E6%9B%B4%E6%97%B6%E5%A6%82%E6%9E%9C%E6%B2%A1%E6%9B%B4%E6%96%B0%E7%A4%BA%E4%BE%8B%EF%BC%8C%E6%B5%8B%E8%AF%95%E5%B0%B1%E4%BC%9A%E5%A4%B1%E8%B4%A5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/03-doc-comments#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%85%B3%E4%BA%8E%20doctest%20%E9%9A%90%E8%97%8F%E8%A1%8C%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BB%A5%20%23%20%E5%BC%80%E5%A4%B4%E7%9A%84%E8%A1%8C%E5%9C%A8%E7%94%9F%E6%88%90%E7%9A%84%E6%96%87%E6%A1%A3%E4%B8%AD%E4%B8%8D%E6%98%BE%E7%A4%BA%EF%BC%8C%E4%BD%86%20doctest%20%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BB%8D%E7%84%B6%E5%8C%85%E5%90%AB%22%2C%22%E4%BB%A5%20%23%20%E5%BC%80%E5%A4%B4%E7%9A%84%E8%A1%8C%E8%A1%A8%E7%A4%BA%E6%B3%A8%E9%87%8A%EF%BC%8C%E5%9C%A8%E6%96%87%E6%A1%A3%E5%92%8C%E6%B5%8B%E8%AF%95%E4%B8%AD%E9%83%BD%E8%A2%AB%E5%BF%BD%E7%95%A5%22%2C%22%E4%BB%A5%20%23%20%E5%BC%80%E5%A4%B4%E7%9A%84%E8%A1%8C%E5%8F%AA%E5%9C%A8%20cargo%20doc%20--document-private%20%E6%97%B6%E6%98%BE%E7%A4%BA%22%2C%22%E4%BB%A5%20%23%20%E5%BC%80%E5%A4%B4%E7%9A%84%E8%A1%8C%E4%BC%9A%E8%A2%AB%E5%AE%8C%E5%85%A8%E5%88%A0%E9%99%A4%EF%BC%8Cdoctest%20%E8%BF%90%E8%A1%8C%E6%97%B6%E4%B9%9F%E4%B8%8D%E5%8C%85%E5%90%AB%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%23%20%E5%BC%80%E5%A4%B4%E7%9A%84%E8%A1%8C%EF%BC%88%E6%B3%A8%E6%84%8F%20%23%20%E5%90%8E%E9%9D%A2%E6%9C%89%E7%A9%BA%E6%A0%BC%EF%BC%89%E6%98%AF%20doctest%20%E7%9A%84%E7%89%B9%E6%AE%8A%E8%AF%AD%E6%B3%95%EF%BC%9A%E5%AE%83%E4%BB%AC%E5%9C%A8%20HTML%20%E6%96%87%E6%A1%A3%E4%B8%AD%E9%9A%90%E8%97%8F%EF%BC%8C%E4%BD%86%20cargo%20test%20%E8%BF%90%E8%A1%8C%20doctest%20%E6%97%B6%E4%BC%9A%E5%8C%85%E5%90%AB%E8%BF%9B%E5%8E%BB%E3%80%82%E5%B8%B8%E7%94%A8%E4%BA%8E%E9%9A%90%E8%97%8F%20use%20%E8%AF%AD%E5%8F%A5%E3%80%81%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0%E3%80%81%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E6%A0%B7%E6%9D%BF%E7%AD%89%EF%BC%8C%E8%AE%A9%E6%96%87%E6%A1%A3%E4%B8%93%E6%B3%A8%E4%BA%8E%E6%A0%B8%E5%BF%83%E7%A4%BA%E4%BE%8B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/03-doc-comments#2:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%20doctest%20%E4%BB%A3%E7%A0%81%E5%9D%97%E4%BF%AE%E9%A5%B0%E8%AF%8D%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22ignore%22%2C%22runnable%22%2C%22no_run%22%2C%22compile_fail%22%2C%22should_panic%22%5D%2C%22correct%22%3A%5B0%2C2%2C3%2C4%5D%2C%22explanation%22%3A%22Rust%20%E5%AE%98%E6%96%B9%20doctest%20%E6%94%AF%E6%8C%81%E7%9A%84%E4%BF%AE%E9%A5%B0%E8%AF%8D%EF%BC%9Ano_run%E3%80%81ignore%E3%80%81should_panic%E3%80%81compile_fail%E3%80%82runnable%20%E6%98%AF%E6%9C%AC%E6%95%99%E7%A8%8B%E9%A1%B9%E7%9B%AE%E8%87%AA%E5%B7%B1%E5%AE%9A%E4%B9%89%E7%9A%84%E7%89%B9%E6%AE%8A%E6%A0%87%E8%AE%B0%EF%BC%8C%E8%AE%A9%E4%BB%A3%E7%A0%81%E5%9D%97%E5%9C%A8%E7%BD%91%E9%A1%B5%E4%B8%8A%E6%98%BE%E7%A4%BA%E8%BF%90%E8%A1%8C%E6%8C%89%E9%92%AE%EF%BC%8C%E4%B8%8E%E5%AE%98%E6%96%B9%20doctest%20%E8%AF%AD%E6%B3%95%E6%97%A0%E5%85%B3%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/03-doc-comments#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%A6%81%E5%8F%AA%E8%BF%90%E8%A1%8C%E4%B8%80%E4%B8%AA%20crate%20%E4%B8%AD%E7%9A%84%E6%89%80%E6%9C%89%20doctests%EF%BC%88%E4%B8%8D%E8%BF%90%E8%A1%8C%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%EF%BC%89%EF%BC%8C%E5%BA%94%E8%AF%A5%E7%94%A8%E4%BB%80%E4%B9%88%E5%91%BD%E4%BB%A4%EF%BC%9F%22%2C%22options%22%3A%5B%22cargo%20doctest%22%2C%22cargo%20test%20--doc%22%2C%22cargo%20test%20--unit%22%2C%22cargo%20doc%20--test%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22cargo%20test%20--doc%20%E5%8F%AA%E8%BF%90%E8%A1%8C%E6%96%87%E6%A1%A3%E6%B5%8B%E8%AF%95%EF%BC%88doctests%EF%BC%89%EF%BC%8C%E8%B7%B3%E8%BF%87%20%23%5Btest%5D%20%E6%A0%87%E8%AE%B0%E7%9A%84%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%E3%80%82%E5%8F%8D%E8%BF%87%E6%9D%A5%EF%BC%8Ccargo%20test%20--lib%20%E5%8F%AA%E8%BF%90%E8%A1%8C%20lib%20%E9%87%8C%E7%9A%84%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%B7%B3%E8%BF%87%20doctests%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
