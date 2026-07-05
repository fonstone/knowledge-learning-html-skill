---
chapterId: "19-c-interop"
lessonId: "04-mixed-build"
title: "静态混合编译：Rust 与 C 的深度链接"
level: "进阶"
duration: "35 分钟"
tags: ["混合编译", "静态链接", "cc crate", "build.rs"]
number: "19.4"
chapterTitle: "与 C 语言交互"
chapterNumber: "19"
---

<div id="article-content"> <h1 id="静态混合编译">静态混合编译</h1>
<p>在系统级编程中，<strong>静态链接 (Static Linking)</strong> 是最稳健的方案。它将所有依赖的代码在编译期直接拷贝到最终的可执行文件中，生成一个没有任何外部库依赖的二进制文件，这对于跨平台分发和嵌入式开发至关重要。</p>
<p>本节我们将讨论两种典型的静态混合编译场景。</p>
<h2 id="场景一c-为-rust-所用在-rust-项目中编译-c-源码">场景一：C 为 Rust 所用（在 Rust 项目中编译 C 源码）</h2>
<p>当你需要调用一小段 C 代码，或者正在将一个现有的 C 库集成到 Rust 项目中时，你会选择这个方案。</p>
<h3 id="1-目录结构">1. 目录结构</h3>
<p>推荐将 C 源码放在项目根目录下的独立文件夹中（如 <code>c_src</code>），以保持源码整洁：</p>
<pre><code class="language-text">my_project/
├── Cargo.toml
├── build.rs         &lt;-- 构建脚本
├── c_src/           &lt;-- C 源码
│   ├── utils.c
│   └── utils.h
└── src/
    └── main.rs      &lt;-- Rust 逻辑</code></pre>
<h3 id="2-使用-cc-crate-管理构建">2. 使用 <code>cc</code> crate 管理构建</h3>
<p><code>cc</code> crate 是 Rust 生态中编译 C/C++ 代码的标准工具。它会自动搜索系统中安装的编译器（如 <code>gcc</code>, <code>clang</code>, <code>msvc</code>），并根据目标平台设置正确的编译参数。</p>
<p><strong>步骤 A：添加依赖</strong> (<code>Cargo.toml</code>)</p>
<pre><code class="language-toml">[build-dependencies]
cc = "1.0"</code></pre>
<p><strong>步骤 B：编写构建脚本</strong> (<code>build.rs</code>)
构建脚本在 Rust 编译开始前运行。其核心任务是调用编译器将 C 文件编译成静态库（<code>.a</code> 或 <code>.lib</code>）。</p>
<pre><code class="language-rust">fn main() {
    // 1. 指定监控的文件：如果 utils.c 变动，Cargo 会自动重新编译 C 代码
    println!("cargo:rerun-if-changed=c_src/utils.c");

    // 2. 使用 cc::Build 配置编译
    cc::Build::new()
        .file("c_src/utils.c")      // 添加源文件
        .include("c_src")           // 添加头文件搜索路径（-I）
        .define("DEBUG_MODE", "1")  // 添加宏定义（-D）
        .warnings(true)             // 启用警告
        .compile("myutils");        // 编译并生成 libmyutils.a 静态库
}</code></pre>
<h3 id="3-构建脚本背后的秘密">3. 构建脚本背后的「秘密」</h3>
<p>当你调用 <code>.compile("myutils")</code> 时，<code>cc</code> crate 实际上为 Cargo 做了两件事：</p>
<ol>
<li><strong>运行编译器</strong>：在 <code>target/</code> 目录下生成静态库文件。</li>
<li><strong>发送链接指令</strong>：它会自动向 Cargo 标准输出打印如下内容（你看不到但 Cargo 能接收到）：
<ul>
<li><code>cargo:rustc-link-lib=static=myutils</code> (告诉链接器包含这个库)</li>
<li><code>cargo:rustc-link-search=native=/path/to/library</code> (告诉链接器在哪找)</li>
</ul>
</li>
</ol>
<h3 id="4-在-rust-中建立桥梁">4. 在 Rust 中建立桥梁</h3>
<p>现在你可以直接在 Rust 里声明对应的外部函数了：</p>
<pre><code class="language-rust">// src/main.rs
extern "C" {
    // 必须与 C 中的声明完全一致
    fn c_function_name(arg: i32);
}

fn main() {
    unsafe {
        c_function_name(42);
    }
}</code></pre>
<hr/>
<h2 id="场景二rust-为-c-所用将-rust-打包给-c-工程">场景二：Rust 为 C 所用（将 Rust 打包给 C 工程）</h2>
<p>如果你想在一个现有的庞大 C 语言工程中引入 Rust（例如重写某个性能瓶颈模块），你需要将 Rust 编译成一个 C 编译器能理解的「静态库文件」。</p>
<h3 id="1-配置项目类型">1. 配置项目类型</h3>
<p>默认情况下，Cargo 会生成 Rust 专用的 <code>.rlib</code>。要生成 C 定义的静态库，必须在 <code>Cargo.toml</code> 中显式指定：</p>
<pre><code class="language-toml">[lib]
name = "my_rust_core"
crate-type = ["staticlib"] # 👈 关键点：生成静态二进制库 (.a 或 .lib)</code></pre>
<h3 id="2-导出函数">2. 导出函数</h3>
<p>确保你的 Rust 函数使用了 <code>extern "C"</code> 和 <code>#[no_mangle]</code>：</p>
<pre><code class="language-rust">#[no_mangle]
pub extern "C" fn rust_add(a: i32, b: i32) -&gt; i32 {
    a + b
}</code></pre>
<h3 id="3-在-c-工程中链接">3. 在 C 工程中链接</h3>
<p>当你运行 <code>cargo build --release</code> 后，在 <code>target/release/</code> 下会找到 <code>libmy_rust_core.a</code>。</p>
<p><strong>链接命令示例 (GCC)：</strong></p>
<pre><code class="language-bash">gcc main.c -L ./target/release/ -lmy_rust_core -lpthread -ldl -o my_app</code></pre>
<blockquote>
<p><strong>💡 专家提示：</strong>
静态链接 Rust 时，必须手动链接其底层的操作系统依赖。在 Linux 上通常是 <code>-lpthread</code> 和 <code>-ldl</code>。如果链接时报错「undefined reference」，请检查是否遗漏了这些系统库。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="概念测验">概念测验</h2>
<div class="quiz-choice" data-block-id="19-c-interop/04-mixed-build#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20%60cc%60%20crate%20%E7%9A%84%E9%85%8D%E7%BD%AE%E4%B8%AD%EF%BC%8C%60.include(%5C%22path%5C%22)%60%20%E7%9A%84%E4%B8%BB%E8%A6%81%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E9%93%BE%E6%8E%A5%E8%AF%A5%E8%B7%AF%E5%BE%84%E4%B8%8B%E7%9A%84%E9%9D%99%E6%80%81%E5%BA%93%E3%80%82%22%2C%22%E5%91%8A%E8%AF%89%E7%BC%96%E8%AF%91%E5%99%A8%E5%9C%A8%E5%93%AA%E5%8F%AF%E4%BB%A5%E6%89%BE%E5%88%B0%20%60%23include%60%20%E5%BC%95%E5%85%A5%E7%9A%84%E5%A4%B4%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22%E5%B0%86%20path%20%E4%B8%8B%E7%9A%84%E6%89%80%E6%9C%89%20C%20%E6%96%87%E4%BB%B6%E5%8A%A0%E5%85%A5%E7%BC%96%E8%AF%91%E3%80%82%22%2C%22%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20Rust%20%E5%AF%B9%E5%BA%94%E7%9A%84%E5%A4%B4%E6%96%87%E4%BB%B6%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22include%20%E5%AF%B9%E5%BA%94%E7%9A%84%E6%98%AF%E7%BC%96%E8%AF%91%E5%99%A8%E7%9A%84%20-I%20%E5%8F%82%E6%95%B0%EF%BC%8C%E7%94%A8%E4%BA%8E%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E5%A4%B4%E6%96%87%E4%BB%B6%E7%9A%84%E7%9B%AE%E5%BD%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/04-mixed-build#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%E5%9C%A8%20build.rs%20%E4%B8%AD%E5%BB%BA%E8%AE%AE%E5%86%99%20%60println!(%5C%22cargo%3Arerun-if-changed%3D...%5C%22)%60%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E4%BB%A3%E7%A0%81%E8%BF%90%E8%A1%8C%E5%BE%97%E6%9B%B4%E5%BF%AB%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%97%A7%E7%9A%84%E6%9E%84%E5%BB%BA%E4%BA%A7%E7%89%A9%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%20Cargo%20%E7%9F%A5%E9%81%93%E5%8F%AA%E6%9C%89%E5%9C%A8%E8%BF%99%E4%BA%9B%E6%96%87%E4%BB%B6%E5%8F%98%E5%8C%96%E6%97%B6%E6%89%8D%E9%87%8D%E6%96%B0%E8%BF%90%E8%A1%8C%E6%9E%84%E5%BB%BA%E8%84%9A%E6%9C%AC%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E5%9C%A8%E7%BB%88%E7%AB%AF%E6%89%93%E5%8D%B0%E8%B0%83%E8%AF%95%E4%BF%A1%E6%81%AF%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E8%BF%99%E6%98%AF%E6%9E%84%E5%BB%BA%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%A2%9E%E9%87%8F%E7%BC%96%E8%AF%91%E6%9C%BA%E5%88%B6%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%8A%82%E7%9C%81%E5%A4%A7%E9%87%8F%E7%9A%84%E9%87%8D%E5%A4%8D%E7%BC%96%E8%AF%91%E6%97%B6%E9%97%B4%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/04-mixed-build#1:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%BD%93%E4%BD%A0%E9%9C%80%E8%A6%81%E5%9C%A8%20C%20%E8%AF%AD%E8%A8%80%E5%B7%A5%E7%A8%8B%E4%B8%AD%E9%93%BE%E6%8E%A5%E7%94%B1%20Rust%20%E7%94%9F%E6%88%90%E7%9A%84%E9%9D%99%E6%80%81%E5%BA%93%E6%97%B6%EF%BC%8C%E9%9C%80%E8%A6%81%E9%93%BE%E6%8E%A5%E5%93%AA%E4%BA%9B%E4%B8%9C%E8%A5%BF%EF%BC%9F%22%2C%22options%22%3A%5B%22Rust%20%E7%9A%84%E6%BA%90%E4%BB%A3%E7%A0%81%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22Cargo.toml%20%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22%E7%9B%AE%E6%A0%87%E5%B9%B3%E5%8F%B0%E7%9B%B8%E5%85%B3%E7%9A%84%E7%B3%BB%E7%BB%9F%E5%BA%93%EF%BC%88%E5%A6%82%20Linux%20%E4%B8%8B%E7%9A%84%20lpthread%EF%BC%89%E3%80%82%22%2C%22Rust%20%E7%94%9F%E6%88%90%E7%9A%84%E9%9D%99%E6%80%81%E5%BA%93%EF%BC%88%E5%A6%82%20libxxx.a%EF%BC%89%E3%80%82%22%5D%2C%22correct%22%3A%5B2%2C3%5D%2C%22explanation%22%3A%22%E9%93%BE%E6%8E%A5%E5%99%A8%E5%8F%AA%E9%9C%80%E8%A6%81%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9B%AE%E6%A0%87%E6%96%87%E4%BB%B6%E5%92%8C%E5%AE%83%E4%BE%9D%E8%B5%96%E7%9A%84%E5%BA%95%E5%B1%82%E5%BA%93%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E6%BA%90%E7%A0%81%E6%88%96%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
