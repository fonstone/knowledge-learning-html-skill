---
chapterId: "19-c-interop"
lessonId: "02-bindgen"
title: "自动生成绑定：bindgen"
level: "进阶"
duration: "30 分钟"
tags: [bindgen, "C 绑定生成", 自动绑定]
number: "19.2"
chapterTitle: "与 C 语言交互"
chapterNumber: "19"
---
<div id="article-content"> <h1 id="自动化绑定">自动化绑定</h1>
<p>手动为成百上千个 C 函数编写 <code>extern "C"</code> 声明不仅枯燥，而且极易出错。如果 C 语言库更新了头文件，手动维护这些绑定简直是噩梦。</p>
<p><strong><code>bindgen</code></strong> 是 Rust 官方推荐的工具，它可以自动读取 C 头文件（<code>.h</code>），并生成对应的 Rust 原始绑定。</p>
<h2 id="使用-bindgen-cli">使用 bindgen CLI</h2>
<p>你可以先安装命令行工具来快速测试：</p>
<pre><code class="language-bash">cargo install bindgen-cli</code></pre>
<p>假设你有一个名为 <code>input.h</code> 的文件：</p>
<pre><code class="language-c">typedef struct {
    int x;
    int y;
} Point;

void print_point(Point p);</code></pre>
<p>运行以下命令：</p>
<pre><code class="language-bash">bindgen input.h -o bindings.rs</code></pre>
<p>生成的 <code>bindings.rs</code> 会包含：</p>
<pre><code class="language-rust">#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub struct Point {
    pub x: ::std::os::raw::c_int,
    pub y: ::std::os::raw::c_int,
}

extern "C" {
    pub fn print_point(p: Point);
}</code></pre>
<h1 id="构建脚本集成">构建脚本集成</h1>
<p>在实际项目中，我们通常在 <code>build.rs</code>（构建脚本）中使用 <code>bindgen</code>，这样每次编译时它都会自动根据最新的头文件更新绑定。</p>
<h2 id="配置步骤">配置步骤</h2>
<ol>
<li>在 <code>Cargo.toml</code> 中添加依赖：</li>
</ol>
<pre><code class="language-toml">[build-dependencies]
bindgen = "0.69"</code></pre>
<ol start="2">
<li>编写 <code>build.rs</code>：</li>
</ol>
<pre><code class="language-rust">use std::env;
use std::path::PathBuf;

fn main() {
    // 告诉 Cargo，如果头文件变了，就重新运行脚本
    println!("cargo:rerun-if-changed=wrapper.h");

    let bindings = bindgen::Builder::default()
        .header("wrapper.h")
        .parse_callbacks(Box::new(bindgen::CargoCallbacks::new()))
        .generate()
        .expect("Unable to generate bindings");

    // 将生成的绑定写入 $OUT_DIR/bindings.rs
    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}</code></pre>
<ol start="3">
<li>在 Rust 代码中引入生成的内容：</li>
</ol>
<pre><code class="language-rust">// 引入自动生成的代码
include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

fn main() {
    let p = Point { x: 10, y: 20 };
    unsafe {
        print_point(p);
    }
}</code></pre>
<h3 id="关键机制为什么使用-out_dir">关键机制：为什么使用 <code>OUT_DIR</code>？</h3>
<p>在上面的 <code>build.rs</code> 示例中，你可能注意到我们并没有把生成的 <code>bindings.rs</code> 放在 <code>src/</code> 目录下。这是 Rust 构建脚本的标准实践：</p>
<ol>
<li><strong>避免源码污染</strong>：自动生成的代码会随 C 头文件的变化而变动，不应该作为「手写源码」提交到 Git 仓库。</li>
<li><strong><code>OUT_DIR</code> 环境变量</strong>：这是 Cargo 为构建脚本专门准备的临时存放目录（通常在 <code>target/debug/build/...</code> 路径下）。</li>
<li><strong><code>include!</code> 宏</strong>：它是 Rust 内置的宏，可以将指定文件的内容「原封不动」地粘贴到当前位置，从而让我们在 Rust 源码中直接使用那些自动生成的结构体定义。</li>
</ol>
<h2 id="处理复杂情况">处理复杂情况</h2>
<ul>
<li><strong>宏定义</strong>：bindgen 会尝试将 C 中的 <code>#define</code> 转换为 Rust 的常量。</li>
<li><strong>不透明类型</strong>：对于不想在 Rust 中直接访问成员的结构体，可以使用 <code>.opaque_type("MyStruct")</code>。</li>
<li><strong>白名单机制</strong>：如果你只想为特定函数生成绑定，可以使用 <code>.allowlist_function("my_func_.*")</code>。</li>
</ul>
<h1 id="练习题">练习题</h1>
<h2 id="概念测验">概念测验</h2>
<div class="quiz-choice" data-block-id="19-c-interop/02-bindgen#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22bindgen%20%E7%9A%84%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%87%AA%E5%8A%A8%E4%BB%8E%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90%20Rust%20FFI%20%E5%A3%B0%E6%98%8E%E4%BB%A3%E7%A0%81%E3%80%82%22%2C%22%E7%BB%99%20C%20%E8%AF%AD%E8%A8%80%E6%B7%BB%E5%8A%A0%E6%89%80%E6%9C%89%E6%9D%83%E6%A3%80%E6%9F%A5%E3%80%82%22%2C%22%E6%8A%8A%20Rust%20%E7%BC%96%E8%AF%91%E6%88%90%20C%20%E8%AF%AD%E8%A8%80%E3%80%82%22%2C%22%E8%87%AA%E5%8A%A8%E4%BC%98%E5%8C%96%20C%20%E8%AF%AD%E8%A8%80%E7%9A%84%E8%BF%90%E8%A1%8C%E6%95%88%E7%8E%87%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22bindgen%20%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BD%9C%E4%B8%BA%E6%A1%A5%E6%A2%81%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%8E%9F%E6%9C%AC%E9%9C%80%E8%A6%81%E6%89%8B%E5%8A%A8%E7%BC%96%E5%86%99%E7%9A%84%20%60extern%20%5C%22C%5C%22%60%20%E5%A3%B0%E6%98%8E%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/02-bindgen#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20%60build.rs%60%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20bindgen%20%E6%97%B6%EF%BC%8C%E7%94%9F%E6%88%90%E7%9A%84%20%60bindings.rs%60%20%E9%80%9A%E5%B8%B8%E6%94%BE%E5%9C%A8%E5%93%AA%E9%87%8C%EF%BC%9F%22%2C%22options%22%3A%5B%22%60target%2Fdebug%2F%60%20%E7%9B%AE%E5%BD%95%E4%B8%8B%E3%80%82%22%2C%22%E9%A1%B9%E7%9B%AE%E6%A0%B9%E7%9B%AE%E5%BD%95%E3%80%82%22%2C%22%60OUT_DIR%60%20%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E6%8C%87%E5%90%91%E7%9A%84%E4%B8%B4%E6%97%B6%E6%9E%84%E5%BB%BA%E7%9B%AE%E5%BD%95%E3%80%82%22%2C%22%60src%2F%60%20%E7%9B%AE%E5%BD%95%E4%B8%8B%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%9A%84%E4%BB%A3%E7%A0%81%E4%B8%8D%E5%BB%BA%E8%AE%AE%E7%9B%B4%E6%8E%A5%E6%94%BE%E8%BF%9B%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93%EF%BC%88src%2F%EF%BC%89%EF%BC%8C%E8%80%8C%E6%98%AF%E6%94%BE%E5%9C%A8%E6%9E%84%E5%BB%BA%E8%BE%93%E5%87%BA%E7%9B%AE%E5%BD%95%E4%B8%AD%EF%BC%8C%E9%80%9A%E8%BF%87%20%60include!%60%20%E5%AE%8F%E5%BC%95%E5%85%A5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/02-bindgen#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BD%BF%E7%94%A8%E6%9E%84%E5%BB%BA%E8%84%9A%E6%9C%AC%EF%BC%88build.rs%EF%BC%89%E9%9B%86%E6%88%90%20bindgen%20%E7%9A%84%E5%A5%BD%E5%A4%84%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%E7%9A%84%E6%9B%B4%E6%96%B0%E3%80%82%22%2C%22%E5%BC%80%E5%8F%91%E8%80%85%E4%B8%8D%E9%9C%80%E8%A6%81%E6%89%8B%E5%8A%A8%E7%BB%B4%E6%8A%A4%E5%A4%8D%E6%9D%82%E7%9A%84%20FFI%20%E7%B1%BB%E5%9E%8B%E5%A3%B0%E6%98%8E%E3%80%82%22%2C%22%E5%8F%AF%E4%BB%A5%E8%AE%A9%20Rust%20%E4%BB%A3%E7%A0%81%E4%B8%8D%E5%86%8D%E9%9C%80%E8%A6%81%20%60unsafe%60%20%E5%9D%97%E3%80%82%22%2C%22%E6%96%B9%E4%BE%BF%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E5%B9%B3%E5%8F%B0%E4%B8%8A%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%E3%80%82%22%5D%2C%22correct%22%3A%5B0%2C1%2C3%5D%2C%22explanation%22%3A%22%E8%99%BD%E7%84%B6%E7%94%9F%E6%88%90%E4%BA%86%E4%BB%A3%E7%A0%81%EF%BC%8C%E4%BD%86%E8%B0%83%E7%94%A8%20FFI%20%E4%BE%9D%E7%84%B6%E6%98%AF%20%60unsafe%60%20%E7%9A%84%E3%80%82%E5%85%B6%E4%BB%96%E9%80%89%E9%A1%B9%E9%83%BD%E6%98%AF%E8%87%AA%E5%8A%A8%E5%8C%96%E9%9B%86%E6%88%90%E5%B8%A6%E6%9D%A5%E7%9A%84%E5%85%B8%E5%9E%8B%E4%BC%98%E5%8A%BF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/02-bindgen#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%E4%B8%AD%E5%8C%85%E5%90%AB%E5%A4%A7%E9%87%8F%E6%97%A0%E5%85%B3%E7%9A%84%E5%87%BD%E6%95%B0%EF%BC%8C%E4%BD%86%E6%88%91%E5%8F%AA%E6%83%B3%E8%A6%81%E5%85%B6%E4%B8%AD%E4%B8%80%E4%B8%AA%EF%BC%8C%E8%AF%A5%E6%80%8E%E4%B9%88%E5%81%9A%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BF%AE%E6%94%B9%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%EF%BC%8C%E5%88%A0%E6%8E%89%E4%B8%8D%E9%9C%80%E8%A6%81%E7%9A%84%E5%87%BD%E6%95%B0%E3%80%82%22%2C%22%E5%9C%A8%20bindgen%20%E7%94%9F%E6%88%90%E5%99%A8%E4%B8%AD%E4%BD%BF%E7%94%A8%20%60.allowlist_function%60%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%89%E3%80%82%22%2C%22%E5%BF%85%E9%A1%BB%E5%85%A8%E9%83%A8%E5%BC%95%E5%85%A5%EF%BC%8C%E6%97%A0%E6%B3%95%E8%BF%87%E6%BB%A4%E3%80%82%22%2C%22%E6%89%8B%E5%8A%A8%E5%88%A0%E9%99%A4%E7%94%9F%E6%88%90%E7%9A%84%20bindings.rs%20%E4%B8%AD%E7%9A%84%E4%BB%A3%E7%A0%81%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22bindgen%20%E6%8F%90%E4%BE%9B%E4%BA%86%E5%BC%BA%E5%A4%A7%E7%9A%84%E8%BF%87%E6%BB%A4%E5%8A%9F%E8%83%BD%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%2F%E9%BB%91%E5%90%8D%E5%8D%95%EF%BC%89%EF%BC%8C%E5%85%81%E8%AE%B8%E5%BC%80%E5%8F%91%E8%80%85%E7%B2%BE%E7%A1%AE%E6%8E%A7%E5%88%B6%E7%94%9F%E6%88%90%E7%9A%84%E4%BB%A3%E7%A0%81%E9%87%8F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/02-bindgen#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%60include!(concat!(env!(%5C%22OUT_DIR%5C%22)%2C%20%5C%22%2Fbindings.rs%5C%22))%3B%60%20%E8%BF%99%E8%A1%8C%E4%BB%A3%E7%A0%81%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8B%E8%BD%BD%E5%B9%B6%E5%AE%89%E8%A3%85%E4%B8%80%E4%B8%AA%E5%8F%AB%20bindings%20%E7%9A%84%20crate%E3%80%82%22%2C%22%E6%A3%80%E6%9F%A5%20bindings.rs%20%E6%98%AF%E5%90%A6%E6%9C%89%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF%E3%80%82%22%2C%22%E5%9C%A8%E5%BD%93%E5%89%8D%E4%BD%8D%E7%BD%AE%E6%8F%92%E5%85%A5%E7%94%9F%E6%88%90%E7%9A%84%20bindings.rs%20%E6%96%87%E4%BB%B6%E7%9A%84%E6%BA%90%E4%BB%A3%E7%A0%81%E3%80%82%22%2C%22%E6%8A%8A%20bindings.rs%20%E7%BC%96%E8%AF%91%E6%88%90%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E5%BA%93%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%60include!%60%20%E5%AE%8F%E4%BC%9A%E5%B0%86%E6%8C%87%E5%AE%9A%E6%96%87%E4%BB%B6%E7%9A%84%E5%86%85%E5%AE%B9%E5%8E%9F%E5%B0%81%E4%B8%8D%E5%8A%A8%E5%9C%B0%E5%8C%85%E5%90%AB%E8%BF%9B%E5%BD%93%E5%89%8D%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E7%B1%BB%E4%BC%BC%E4%BA%8E%20C%20%E8%AF%AD%E8%A8%80%E7%9A%84%20%60%23include%60%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
