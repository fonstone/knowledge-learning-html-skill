---
chapterId: "07-modules"
lessonId: "01-packages-crates"
title: "Package 和 Crate"
level: "入门"
duration: "20 分钟"
tags: ["package", "crate", "cargo", "项目组织", "二进制", "库"]
number: "7.1"
chapterTitle: "模块系统"
chapterNumber: "07"
---

<div id="article-content"> <h1 id="package-和-crate">Package 和 Crate</h1>
<h2 id="为什么需要-package-和-crate">为什么需要 Package 和 Crate</h2>
<p>随着项目变大，代码会逐渐增多。Rust 提供了一套<strong>模块系统</strong>来帮助你组织代码，让功能清晰、可复用、易于维护。这个模块系统的基础就是 <strong>Package</strong>（包）和 <strong>Crate</strong>（箱）这两个概念。</p>
<p>虽然它们经常一起出现，但它们是不同的东西：</p>
<ul>
<li><strong>Crate</strong> 是代码的<strong>编译单元</strong>，是 Rust 编译器处理的最小单位</li>
<li><strong>Package</strong> 是代码的<strong>组织单位</strong>，用 Cargo 来管理</li>
</ul>
<h2 id="理解-crate">理解 Crate</h2>
<h3 id="什么是-crate">什么是 Crate</h3>
<p><strong>Crate</strong> 是 Rust 中最小的可编译单位。一个 crate 包含：</p>
<ul>
<li>一个 <strong>crate root</strong>（根源文件）</li>
<li>由此生成的<strong>单个二进制程序</strong>或<strong>单个库</strong></li>
</ul>
<p>你可以认为 crate 是一个”编译产物”——编译器会根据 crate root 生成一个可执行文件或库文件。</p>
<h3 id="crate-的两种类型">Crate 的两种类型</h3>
<img alt="crate" src="/RustCourse/diagrams/crate.svg" style="max-width:100%;margin:1rem 0;"/>
<h4 id="二进制-cratebinary-crate"><strong>二进制 Crate（Binary Crate）</strong></h4>
<p>二进制 crate 编译后生成一个<strong>可执行程序</strong> (<code>.bin</code> / <code>.elf</code>)。必须有一个 <code>main()</code> 函数作为程序入口。</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%20%E7%9A%84%E4%BE%8B%E5%AD%90%22)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    println!("这是一个二进制 crate 的例子");
}</code></pre></div>
<h4 id="库-cratelibrary-crate"><strong>库 Crate（Library Crate）</strong></h4>
<p>库 crate 编译后生成一个<strong>库文件</strong>（<code>.rlib</code>），没有 <code>main()</code> 函数。目的是被其他项目调用和重用。</p>
<pre><code class="language-rust">// 库 crate 的例子：没有 main()，只有可供外部调用的函数
pub fn add(a: i32, b: i32) -&gt; i32 {
    a + b
}</code></pre>
<h2 id="理解-package">理解 Package</h2>
<h3 id="什么是-package">什么是 Package</h3>
<p><strong>Package</strong>（包）是一个使用 Cargo 管理的项目目录。一个 package：</p>
<ul>
<li>包含一个 <strong>Cargo.toml</strong> 文件（项目配置）</li>
<li>至多包含<strong>一个库 crate</strong>（library crate）</li>
<li>可以包含<strong>零或者任意多个二进制 crate</strong>（binary crate）</li>
<li><strong>至少包含一个 crate</strong>（二进制或库）</li>
</ul>
<img alt="包" src="/RustCourse/diagrams/package.svg" style="max-width:100%;margin:1rem 0;"/>
<p>你可以认为 package 是”项目文件夹”的概念——它包装了一个或多个 crate，让你用 Cargo 来管理它们。</p>
<h3 id="cargotomlpackage-的清单">Cargo.toml：Package 的清单</h3>
<p><strong>Cargo.toml</strong> 是 Cargo 用来管理 package 的配置文件。它定义了：</p>
<pre><code class="language-toml">[package]
name = "my-app"              # package 的名称
version = "0.1.0"            # package 版本
edition = "2021"             # Rust 版本

[dependencies]
serde = "1.0"                # 依赖的外部 crate</code></pre>
<p><strong>关键特点：</strong></p>
<ul>
<li>每个 package 只有<strong>一个</strong> Cargo.toml</li>
<li>Cargo 会根据 Cargo.toml 中的配置来构建和管理这个 package 中的所有 crate</li>
<li><strong>Cargo.toml 中不需要列出 crate</strong>，Cargo 会按约定自动识别 <code>src/main.rs</code>、<code>src/lib.rs</code> 等</li>
<li>你可以在这里声明依赖、配置构建选项、设置 package 元数据</li>
</ul>
<h1 id="package-和-crate-的关系">Package 和 Crate 的关系</h1>
<p>现在你已经知道了 Package 和 Crate 的定义，那它们是如何工作的呢？让我们看看一些实际的例子。</p>
<img alt="二者的对应视角" src="/RustCourse/diagrams/angle_of_view.svg" style="max-width:100%;margin:1rem 0;"/>
<blockquote>
<p><strong>核心认知</strong>：</p>
<ul>
<li><strong>Package</strong> 是从<strong>逻辑管理</strong>的视角——“我要如何组织这个项目？用 Cargo.toml 来管理依赖、版本、配置”</li>
<li><strong>Crate</strong> 是从<strong>编译</strong>的视角——“Rust 编译器该如何处理这些文件？一个 crate root 生成一个编译产物”</li>
</ul>
<p>一个 package 可以包含多个 crate，但一个 crate 只能编译生成一个二进制或一个库。</p>
</blockquote>
<h2 id="cargo-的约定文件到-crate-的映射">Cargo 的约定：文件到 Crate 的映射</h2>
<p>当你用 Cargo 创建项目时，Cargo 遵循一套<strong>约定</strong>来自动识别 crate：</p>
<table><thead><tr><th>源文件</th><th>Cargo 认为这是</th><th>生成物</th></tr></thead><tbody><tr><td><code>src/main.rs</code></td><td>与 package 同名的<strong>二进制 crate</strong> 的根</td><td>可执行程序</td></tr><tr><td><code>src/lib.rs</code></td><td>与 package 同名的<strong>库 crate</strong> 的根</td><td>库文件</td></tr><tr><td><code>src/bin/*.rs</code> 中的每个文件</td><td>独立的<strong>二进制 crate</strong></td><td>各自的可执行程序</td></tr></tbody></table>
<p><strong>这意味着你不需要在 Cargo.toml 中显式列出这些 crate，Cargo 会自动找到它们。</strong></p>
<h3 id="实例-1最简单的-package只有二进制">实例 1：最简单的 Package（只有二进制）</h3>
<pre><code class="language-bash">cargo new my-app</code></pre>
<p>生成的结构：</p>
<pre><code class="language-text">my-app/
├── Cargo.toml
└── src/
    └── main.rs</code></pre>
<p>这个 package 包含 <strong>1 个 crate</strong>：</p>
<ul>
<li><strong>二进制 crate</strong>（名为 <code>my-app</code>），从 <code>src/main.rs</code> 开始</li>
</ul>
<h3 id="实例-2只有库-crate">实例 2：只有库 crate</h3>
<p>如果你想创建一个库供其他项目使用：</p>
<pre><code class="language-bash">cargo new --lib my-library</code></pre>
<p>生成的结构：</p>
<pre><code class="language-text">my-library/
├── Cargo.toml
└── src/
    └── lib.rs</code></pre>
<p>这个 package 包含 <strong>1 个 crate</strong>：</p>
<ul>
<li><strong>库 crate</strong>（名为 <code>my-library</code>），从 <code>src/lib.rs</code> 开始</li>
</ul>
<p><strong>使用方式：</strong></p>
<pre><code class="language-bash"># 编译库（生成 .rlib 文件）
$ cargo build

# 测试库
$ cargo test

# 发布到 crates.io
$ cargo publish</code></pre>
<h3 id="实例-3同时有库和二进制">实例 3：同时有库和二进制</h3>
<p>有时你想提供一个库，同时也有一个可执行程序来演示库的用法。基于只有库的 crate 的包手动添加 <code>src/main.rs</code>，或者基于只有二进制 crate 的包手动添加 <code>src/lib.rs</code>：</p>
<pre><code class="language-text">my-library/
├── Cargo.toml
└── src/
    ├── lib.rs      ← 库 crate 的根
    └── main.rs     ← 二进制 crate 的根</code></pre>
<p>这个 package 包含 <strong>2 个 crate</strong>（都同名 <code>my-library</code>）：</p>
<ul>
<li><strong>库 crate</strong>：从 <code>src/lib.rs</code> 开始</li>
<li><strong>二进制 crate</strong>：从 <code>src/main.rs</code> 开始</li>
</ul>
<p><strong>使用方式：</strong></p>
<pre><code class="language-bash"># 编译整个 package（包含两个 crate）
$ cargo build

# 运行二进制程序（演示库）
$ cargo run

# 只构建库
$ cargo build --lib

# 只构建二进制
$ cargo build --bin my-library</code></pre>
<p><strong>库内部的代码可以被二进制调用：</strong></p>
<pre><code class="language-rust">// src/lib.rs
pub fn greet() {
    println!("来自库的问候");
}</code></pre>
<pre><code class="language-rust">// src/main.rs
fn main() {
    my_library::greet();  // 调用库中的公开函数
}</code></pre>
<h3 id="实例4多二进制-crate-的项目">实例4：多二进制 Crate 的项目</h3>
<img alt="安全与速度的矛盾" src="/RustCourse/diagrams/package_and_crate.svg" style="max-width:100%;margin:1rem 0;"/>
<p>一个 package 可以包含<strong>多个二进制 crate</strong>。把它们放在 <code>src/bin/</code> 目录中，每个文件都会被编译成独立的二进制程序。</p>
<blockquote>
<p><strong>注意</strong>：<code>src/bin/</code> 目录下的二进制 crate 需要<strong>手动创建</strong>，Cargo 没有提供自动生成命令。只需创建 <code>.rs</code> 文件即可，Cargo 会自动识别。</p>
</blockquote>
<p>首先创建基础项目：</p>
<pre><code class="language-bash">cargo new my-project</code></pre>
<p>然后手动创建额外的二进制：</p>
<pre><code class="language-bash">mkdir -p src/bin
touch src/bin/tool-a.rs
touch src/bin/tool-b.rs</code></pre>
<p>最终结构：</p>
<pre><code class="language-text">my-project/
├── Cargo.toml
├── src/
│   ├── main.rs                # 二进制 crate（命名为 "my-project"）
│   ├── lib.rs                 # 库 crate（命名为 "my-project"）
│   └── bin/
│       ├── tool-a.rs          # 二进制 crate（命名为 "tool-a"）
│       └── tool-b.rs          # 二进制 crate（命名为 "tool-b"）</code></pre>
<p>这个 package 包含<strong>4 个 crate</strong>：</p>
<ul>
<li>1 个库 crate：<code>my-project</code></li>
<li>3 个二进制 crate：<code>my-project</code>、<code>tool-a</code>、<code>tool-b</code></li>
</ul>
<p><strong>编译和运行：</strong></p>
<pre><code class="language-bash"># 编译所有 crate
$ cargo build

# 运行主二进制
$ cargo run

# 运行特定的二进制
$ cargo run --bin tool-a
$ cargo run --bin tool-b

# 列出所有可执行文件
$ cargo build --bins</code></pre>
<h2 id="自定义-crate-路径和名称">自定义 Crate 路径和名称</h2>
<p>如果你不想使用 Cargo 的默认约定，可以在 Cargo.toml 中显式指定：</p>
<pre><code class="language-toml">[[bin]]
name = "my-tool"            # 二进制可执行文件的名称
path = "src/custom/main.rs" # 指定二进制 crate 的 root 路径

[lib]
name = "my-library"         # 库的名称
path = "src/custom/lib.rs"  # 指定库 crate 的 root 路径</code></pre>
<p>这样你就可以打破默认约定，使用自己想要的目录结构和名称。但<strong>大多数情况下，按照 Cargo 的默认约定最好</strong>，这样其他人更容易理解你的项目结构。</p>
<h1 id="练习题">练习题</h1>
<h2 id="package-和-crate-概念测验">Package 和 Crate 概念测验</h2>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E9%9D%A2%E5%93%AA%E4%B8%AA%E6%8F%8F%E8%BF%B0%E6%AD%A3%E7%A1%AE%E5%9C%B0%E5%8C%BA%E5%88%86%E4%BA%86%20Package%20%E5%92%8C%20Crate%EF%BC%9F%22%2C%22options%22%3A%5B%22Package%20%E5%92%8C%20Crate%20%E6%98%AF%E5%90%8C%E4%B9%89%E8%AF%8D%22%2C%22Package%20%E6%98%AF%E4%BB%A3%E7%A0%81%E7%9A%84%E7%BC%96%E8%AF%91%E5%8D%95%E5%85%83%EF%BC%8CCrate%20%E6%98%AF%E7%94%A8%20Cargo%20%E7%AE%A1%E7%90%86%E7%9A%84%E9%A1%B9%E7%9B%AE%22%2C%22Package%20%E5%8F%AA%E7%94%A8%E4%BA%8E%E4%BA%8C%E8%BF%9B%E5%88%B6%E9%A1%B9%E7%9B%AE%EF%BC%8CCrate%20%E5%8F%AA%E7%94%A8%E4%BA%8E%E5%BA%93%22%2C%22Package%20%E6%98%AF%E7%94%A8%20Cargo%20%E7%AE%A1%E7%90%86%E7%9A%84%E9%A1%B9%E7%9B%AE%EF%BC%8CCrate%20%E6%98%AF%E4%BB%A3%E7%A0%81%E7%9A%84%E7%BC%96%E8%AF%91%E5%8D%95%E5%85%83%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22Package%20%E6%98%AF%E9%A1%B9%E7%9B%AE%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%EF%BC%88%E5%8C%85%E5%90%AB%20Cargo.toml%EF%BC%89%EF%BC%8CCrate%20%E6%98%AF%E7%BC%96%E8%AF%91%E5%8D%95%E4%BD%8D%E3%80%82Package%20%E5%8F%AF%E4%BB%A5%E5%8C%85%E5%90%AB%E5%A4%9A%E4%B8%AA%20Crate%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%90%E8%A1%8C%20%60cargo%20new%20my-app%60%20%E5%90%8E%EF%BC%8C%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%B8%AA%E6%96%87%E4%BB%B6%E6%98%AF%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%20%E7%9A%84%E6%A0%B9%E6%BA%90%E6%96%87%E4%BB%B6%EF%BC%9F%22%2C%22options%22%3A%5B%22src%2Flib.rs%22%2C%22src%2Fbin%2Fmain.rs%22%2C%22Cargo.toml%22%2C%22src%2Fmain.rs%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E6%8C%89%20Cargo%20%E7%BA%A6%E5%AE%9A%EF%BC%8Csrc%2Fmain.rs%20%E6%98%AF%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%20%E7%9A%84%E6%A0%B9%E6%BA%90%E6%96%87%E4%BB%B6%E3%80%82%E5%AE%83%E5%BF%85%E9%A1%BB%E5%8C%85%E5%90%AB%20main()%20%E5%87%BD%E6%95%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E5%85%B3%E4%BA%8E%20Cargo.toml%20%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22%E4%B8%8D%E9%9C%80%E8%A6%81%E5%9C%A8%20Cargo.toml%20%E4%B8%AD%E6%98%BE%E5%BC%8F%E5%88%97%E5%87%BA%20src%2Fmain.rs%20%E6%88%96%20src%2Flib.rs%EF%BC%8CCargo%20%E4%BC%9A%E6%8C%89%E7%BA%A6%E5%AE%9A%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%22%2C%22Cargo.toml%20%E5%AE%9A%E4%B9%89%E4%BA%86%E4%B8%80%E4%B8%AA%20Package%22%2C%22Cargo.toml%20%E4%B8%AD%E5%BF%85%E9%A1%BB%E6%98%BE%E5%BC%8F%E5%88%97%E5%87%BA%20src%2Fbin%2F%20%E4%B8%AD%E7%9A%84%E6%89%80%E6%9C%89%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%22%2C%22%E6%AF%8F%E4%B8%AA%20Crate%20%E9%83%BD%E9%9C%80%E8%A6%81%E6%9C%89%E8%87%AA%E5%B7%B1%E7%9A%84%20Cargo.toml%20%E6%96%87%E4%BB%B6%22%5D%2C%22correct%22%3A%5B0%2C1%5D%2C%22explanation%22%3A%22Cargo.toml%20%E5%AE%9A%E4%B9%89%20Package%20%E7%BA%A7%E5%88%AB%E7%9A%84%E9%85%8D%E7%BD%AE%E3%80%82Cargo%20%E9%81%B5%E5%BE%AA%E7%BA%A6%E5%AE%9A%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%20crate%20roots%E3%80%82%E5%8D%95%E4%B8%AA%20Package%20%E5%8F%AF%E4%BB%A5%E6%9C%89%E5%A4%9A%E4%B8%AA%20Crate%EF%BC%8C%E4%BD%86%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%20Cargo.toml%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%80%E4%B8%AA%20Package%20%E5%8F%AF%E4%BB%A5%E5%8C%85%E5%90%AB%E5%A4%9A%E5%B0%91%E4%B8%AA%E5%BA%93%20Crate%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%87%B3%E5%A4%9A%202%20%E4%B8%AA%22%2C%22%E4%BB%BB%E6%84%8F%E5%A4%9A%E4%B8%AA%22%2C%22%E8%87%B3%E5%A4%9A%201%20%E4%B8%AA%22%2C%220%20%E4%B8%AA%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E8%A7%84%E5%88%99%E6%98%AF%EF%BC%9A%E4%B8%80%E4%B8%AA%20Package%20%E8%87%B3%E5%A4%9A%E5%8C%85%E5%90%AB%201%20%E4%B8%AA%E5%BA%93%20Crate%EF%BC%8C%E4%BD%86%E5%8F%AF%E4%BB%A5%E5%8C%85%E5%90%AB%E4%BB%BB%E6%84%8F%E5%A4%9A%E4%B8%AA%E4%BA%8C%E8%BF%9B%E5%88%B6%20Crate%E3%80%82%E8%BF%99%E6%98%AF%E4%B8%BA%E4%BA%86%E9%81%BF%E5%85%8D%E6%AD%A7%E4%B9%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%A6%81%E5%9C%A8%E4%B8%80%E4%B8%AA%20Package%20%E4%B8%AD%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E5%90%8D%E4%B8%BA%20%60tool1%60%20%E5%92%8C%20%60tool2%60%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%A8%8B%E5%BA%8F%EF%BC%8C%E5%BA%94%E8%AF%A5%E5%A6%82%E4%BD%95%E7%BB%84%E7%BB%87%E6%96%87%E4%BB%B6%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%88%9B%E5%BB%BA%20src%2Fbin%2Ftool1.rs%20%E5%92%8C%20src%2Fbin%2Ftool2.rs%22%2C%22%E5%88%9B%E5%BB%BA%20src%2Ftool1.rs%20%E5%92%8C%20src%2Ftool2.rs%22%2C%22%E5%9C%A8%20Cargo.toml%20%E4%B8%AD%E6%98%BE%E5%BC%8F%E5%88%97%E5%87%BA%22%2C%22%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E7%8B%AC%E7%AB%8B%E7%9A%84%20Package%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E5%A4%9A%E4%B8%AA%E4%BA%8C%E8%BF%9B%E5%88%B6%20Crate%20%E5%BA%94%E8%AF%A5%E6%94%BE%E5%9C%A8%20src%2Fbin%2F%20%E7%9B%AE%E5%BD%95%E4%B8%AD%EF%BC%8C%E6%AF%8F%E4%B8%AA%E6%96%87%E4%BB%B6%E6%98%AF%E4%B8%80%E4%B8%AA%E7%8B%AC%E7%AB%8B%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%E3%80%82%E4%BD%BF%E7%94%A8%20%60cargo%20run%20--bin%20tool1%60%20%E6%9D%A5%E8%BF%90%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="07-modules/01-packages-crates#2:5" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%BA%93%20Crate%20%E7%9A%84%E6%A0%B9%E6%BA%90%E6%96%87%E4%BB%B6%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%8C%E5%AE%83%E5%BF%85%E9%A1%BB%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22Cargo.toml%22%2C%22src%2Flib.rs%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%8C%85%E5%90%AB%20main()%20%E5%87%BD%E6%95%B0%22%2C%22src%2Flib.rs%EF%BC%8C%E4%B8%8D%E5%BF%85%E5%8C%85%E5%90%AB%20main()%20%E5%87%BD%E6%95%B0%22%2C%22src%2Fmain.rs%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%8C%85%E5%90%AB%20main()%20%E5%87%BD%E6%95%B0%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%BA%93%20Crate%20%E4%BD%BF%E7%94%A8%20src%2Flib.rs%20%E4%BD%9C%E4%B8%BA%E6%A0%B9%E6%BA%90%E6%96%87%E4%BB%B6%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%20main()%20%E5%87%BD%E6%95%B0%EF%BC%8C%E8%80%8C%E6%98%AF%E5%AF%BC%E5%87%BA%E5%8F%AF%E4%BE%9B%E5%85%B6%E4%BB%96%20crate%20%E4%BD%BF%E7%94%A8%E7%9A%84%E5%87%BD%E6%95%B0%E6%88%96%E7%B1%BB%E5%9E%8B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
