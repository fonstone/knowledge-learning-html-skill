---
chapterId: "19-c-interop"
lessonId: "03-cbindgen"
title: "暴露 Rust 给 C：cbindgen"
level: "进阶"
duration: "30 分钟"
tags: [cbindgen, "Rust 暴露", "C 头文件生成"]
number: "19.3"
chapterTitle: "与 C 语言交互"
chapterNumber: "19"
---
<div id="article-content"> <h1 id="导出-rust-给-c">导出 Rust 给 C</h1>
<p>有时我们需要编写一个极高性能的 Rust 库，然后让现有的 C、C++ 或 Python 代码调用它。这需要我们完成两件事：</p>
<ol>
<li>将 Rust 代码编译成 C 兼容的动态链接库（<code>.so</code>/<code>.dll</code>）。</li>
<li>为 C 代码提供对应的头文件（<code>.h</code>）。</li>
</ol>
<p>这就是 <strong><code>cbindgen</code></strong> 的用武之地。</p>
<h2 id="准备-rust-代码">准备 Rust 代码</h2>
<p>要导出函数，必须满足：</p>
<ul>
<li>使用 <code>pub extern "C"</code>。</li>
<li>使用 <code>#[no_mangle]</code> 禁用符号重整。</li>
</ul>
<div class="code-runner" data-full-code="%23%5Brepr(C)%5D%0Apub%20struct%20CalculationResult%20%7B%0A%20%20%20%20pub%20value%3A%20f64%2C%0A%20%20%20%20pub%20is_valid%3A%20bool%2C%0A%7D%0A%0A%23%5Bno_mangle%5D%0Apub%20extern%20%22C%22%20fn%20calculate_sqrt(input%3A%20f64)%20-%3E%20CalculationResult%20%7B%0A%20%20%20%20if%20input%20%3C%200.0%20%7B%0A%20%20%20%20%20%20%20%20CalculationResult%20%7B%20value%3A%200.0%2C%20is_valid%3A%20false%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20CalculationResult%20%7B%20value%3A%20input.sqrt()%2C%20is_valid%3A%20true%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">#[repr(C)]
pub struct CalculationResult {
    pub value: f64,
    pub is_valid: bool,
}

#[no_mangle]
pub extern "C" fn calculate_sqrt(input: f64) -&gt; CalculationResult {
    if input &lt; 0.0 {
        CalculationResult { value: 0.0, is_valid: false }
    } else {
        CalculationResult { value: input.sqrt(), is_valid: true }
    }
}</code></pre></div>
<p>注意：结构体必须加上 <code>#[repr(C)]</code>，否则 Rust 的布局方式与 C 不一致，会导致严重的数据损坏问题。</p>
<h2 id="项目配置">项目配置</h2>
<p>在 <code>Cargo.toml</code> 中，必须指定库类型为 <code>cdylib</code>：</p>
<pre><code class="language-toml">[lib]
crate-type = ["cdylib"]</code></pre>
<h1 id="配置与使用">配置与使用</h1>
<p>虽然可以手动写头文件，但如果你的 Rust 接口经常变动，同步起来会非常麻烦。<code>cbindgen</code> 可以自动化这一过程。</p>
<h2 id="使用-cli-工具">使用 CLI 工具</h2>
<p>安装工具：</p>
<pre><code class="language-bash">cargo install cbindgen</code></pre>
<p>在 Rust 项目根目录运行：</p>
<pre><code class="language-bash">cbindgen --config cbindgen.toml --crate my_project --output my_lib.h</code></pre>
<p>生成的 <code>my_lib.h</code> 如下：</p>
<pre><code class="language-c">#include &lt;stdint.h&gt;
#include &lt;stdbool.h&gt;

typedef struct {
  double value;
  bool is_valid;
} CalculationResult;

CalculationResult calculate_sqrt(double input);</code></pre>
<h2 id="cbindgentoml-配置">cbindgen.toml 配置</h2>
<p>通过一个可选的配置文件，你可以精细控制头文件的生成逻辑：</p>
<pre><code class="language-toml">language = "C" # 也可以是 "C++"
header = "/* 自动化生成的 Rust 绑定头文件 */"
include_guard = "MY_LIB_H"

[export]
include = ["CalculationResult", "calculate_sqrt"]</code></pre>
<h2 id="内存安全警告">内存安全警告</h2>
<p>从 C 调用 Rust 时，<strong>所有权规则依然存在</strong>。</p>
<ul>
<li>如果 Rust 返回了一个在堆上分配的对象（如 <code>Box</code> 或 <code>Vec</code>），C 代码必须将其传回给 Rust 的特定函数来释放。</li>
<li>绝不要在 C 语言中直接调用 <code>free()</code> 来释放由 Rust 堆分配器管理的内存。</li>
</ul>
<h1 id="练习题">练习题</h1>
<h2 id="核心概念测验">核心概念测验</h2>
<div class="quiz-choice" data-block-id="19-c-interop/03-cbindgen#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22cbindgen%20%E4%B8%8E%20bindgen%20%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22bindgen%20%E6%98%AF%E4%BB%8E%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%E4%BA%A7%E7%94%9F%20Rust%20%E5%A3%B0%E6%98%8E%EF%BC%9Bcbindgen%20%E6%98%AF%E4%BB%8E%20Rust%20%E4%BB%A3%E7%A0%81%E4%BA%A7%E7%94%9F%20C%20%E5%A4%B4%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22cbindgen%20%E4%B8%93%E9%97%A8%E7%94%A8%E4%BA%8E%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%B3%BB%E7%BB%9F%EF%BC%8Cbindgen%20%E7%94%A8%E4%BA%8E%E6%A1%8C%E9%9D%A2%E7%AB%AF%E3%80%82%22%2C%22bindgen%20%E7%94%A8%E4%BA%8E%E5%AF%BC%E5%87%BA%20Rust%20%E7%BB%99%20C%EF%BC%8Ccbindgen%20%E5%88%99%E7%9B%B8%E5%8F%8D%E3%80%82%22%2C%22%E6%B2%A1%E6%9C%89%E5%8C%BA%E5%88%AB%EF%BC%8C%E5%8F%AA%E6%98%AF%E5%90%8D%E5%AD%97%E4%B8%8D%E5%90%8C%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22cbindgen%20%E7%9A%84%20%5C%22c%5C%22%20%E4%BB%A3%E8%A1%A8%20%5C%22C%20Output%5C%22%EF%BC%8C%E5%AE%83%E6%98%AF%E4%B8%BA%20C%20%E4%BB%A3%E7%A0%81%E5%87%86%E5%A4%87%E6%8E%A5%E5%8F%A3%E7%9A%84%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/03-cbindgen#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%E5%AF%BC%E5%87%BA%E7%BB%99%20C%20%E7%9A%84%E7%BB%93%E6%9E%84%E4%BD%93%E4%B8%8A%EF%BC%8C%E4%B8%BA%E4%BB%80%E4%B9%88%E5%BF%85%E9%A1%BB%E6%A0%87%E6%B3%A8%20%60%23%5Brepr(C)%5D%60%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%BA%E4%BA%86%E7%A1%AE%E4%BF%9D%E7%BB%93%E6%9E%84%E4%BD%93%E6%88%90%E5%91%98%E5%9C%A8%E5%86%85%E5%AD%98%E4%B8%AD%E7%9A%84%E6%8E%92%E7%89%88%E9%A1%BA%E5%BA%8F%E4%B8%8E%20C%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%80%E8%87%B4%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E7%BB%93%E6%9E%84%E4%BD%93%E5%8F%98%E6%88%90%E7%A7%81%E6%9C%89%E7%9A%84%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E5%BC%80%E5%90%AF%E6%89%80%E6%9C%89%E6%9D%83%E6%A3%80%E6%9F%A5%E3%80%82%22%2C%22%E4%B8%BA%E4%BA%86%E8%AE%A9%E4%BB%A3%E7%A0%81%E8%BF%90%E8%A1%8C%E5%BE%97%E6%9B%B4%E5%BF%AB%E3%80%82%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rust%20%E9%BB%98%E8%AE%A4%E7%9A%84%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80%E7%94%B1%E4%BA%8E%E5%85%B6%E7%81%B5%E6%B4%BB%E6%80%A7%EF%BC%8C%E5%8F%AF%E8%83%BD%E4%B8%8E%20C%20%E4%B8%8D%E5%90%8C%EF%BC%88%E5%A6%82%E5%AD%97%E6%AE%B5%E9%87%8D%E6%8E%92%E4%BB%A5%E5%8E%8B%E7%BC%A9%E7%A9%BA%E9%97%B4%EF%BC%89%E3%80%82%E9%80%9A%E8%BF%87%20%60%23%5Brepr(C)%5D%60%20%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%20C%20%E5%85%BC%E5%AE%B9%E5%B8%83%E5%B1%80%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/03-cbindgen#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E8%A6%81%E8%AE%A9%20Rust%20%E5%87%BD%E6%95%B0%E8%83%BD%E8%A2%AB%20C%20%E6%AD%A3%E7%A1%AE%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%93%AA%E4%BA%9B%E6%9D%A1%E4%BB%B6%E6%98%AF%E5%BF%85%E9%A1%BB%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%87%BD%E6%95%B0%E5%BF%85%E9%A1%BB%E8%BF%94%E5%9B%9E%20%60Result%60%E3%80%82%22%2C%22%E6%A0%87%E6%B3%A8%20%60extern%20%5C%22C%5C%22%60%20%E6%88%96%20%60pub%20extern%20%5C%22C%5C%22%60%E3%80%82%22%2C%22%E6%A0%87%E6%B3%A8%20%60%23%5Bno_mangle%5D%60%E3%80%82%22%2C%22%E5%87%BD%E6%95%B0%E5%BF%85%E9%A1%BB%E4%BD%BF%E7%94%A8%E6%B3%9B%E5%9E%8B%E3%80%82%22%5D%2C%22correct%22%3A%5B1%2C2%5D%2C%22explanation%22%3A%22%60%23%5Bno_mangle%5D%60%20%E4%BF%9D%E8%AF%81%E7%AC%A6%E5%8F%B7%E5%90%8D%E4%B8%8D%E5%8F%98%EF%BC%8C%60extern%20%5C%22C%5C%22%60%20%E4%BF%9D%E8%AF%81%E8%B0%83%E7%94%A8%E7%BA%A6%E5%AE%9A%E5%8C%B9%E9%85%8D%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/03-cbindgen#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20%60Cargo.toml%60%20%E4%B8%AD%EF%BC%8C%60crate-type%20%3D%20%5B%5C%22cdylib%5C%22%5D%60%20%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E5%A4%B4%E6%96%87%E4%BB%B6%E3%80%82%22%2C%22%E5%85%81%E8%AE%B8%20Cargo%20%E4%BD%BF%E7%94%A8%E5%A4%96%E9%83%A8%E4%BE%9D%E8%B5%96%E3%80%82%22%2C%22%E5%91%8A%E8%AF%89%20Cargo%20%E7%BC%96%E8%AF%91%E4%B8%80%E4%B8%AA%E7%AC%A6%E5%90%88%E6%A0%87%E5%87%86%20C%20%E6%8E%A5%E5%8F%A3%E7%9A%84%E5%8A%A8%E6%80%81%E5%BA%93%E3%80%82%22%2C%22%E6%8A%8A%E7%A8%8B%E5%BA%8F%E7%BC%96%E8%AF%91%E6%88%90%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%AF%E8%BF%90%E8%A1%8C%E7%9A%84%20WASM%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%60cdylib%60%20%E6%98%AF%E4%B8%93%E4%B8%BA%20FFI%20%E5%9C%BA%E6%99%AF%E8%AE%BE%E8%AE%A1%E7%9A%84%E5%BA%93%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%AE%83%E4%BC%9A%E5%89%A5%E7%A6%BB%20Rust%20%E7%89%B9%E6%9C%89%E7%9A%84%E5%85%83%E6%95%B0%E6%8D%AE%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E6%A0%87%E5%87%86%E7%9A%84%E9%93%BE%E6%8E%A5%E7%AC%A6%E5%8F%B7%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="19-c-interop/03-cbindgen#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%EF%BC%8C%E4%B8%8B%E5%88%97%E5%93%AA%E7%A7%8D%E5%81%9A%E6%B3%95%E5%9C%A8%20FFI%20%E4%B8%AD%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9C%A8%20Rust%20%E4%B8%AD%20Box%20%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E8%BF%94%E5%9B%9E%EF%BC%8C%E7%84%B6%E5%90%8E%E5%9C%A8%20C%20%E4%B8%AD%E7%94%A8%20%60free()%60%E3%80%82%22%2C%22%E7%9B%B4%E6%8E%A5%E5%9C%A8%20C%20%E4%B8%AD%E4%BF%AE%E6%94%B9%20Rust%20%E4%BC%A0%E6%9D%A5%E7%9A%84%20%60%26str%60%20%E7%9A%84%E5%86%85%E5%AE%B9%E3%80%82%22%2C%22%E5%9C%A8%20Rust%20%E4%B8%AD%E6%8F%90%E4%BE%9B%E4%B8%80%E4%B8%AA%E4%B8%93%E9%97%A8%E7%9A%84%20%60drop_obj(ptr)%60%20%E5%87%BD%E6%95%B0%E4%BE%9B%20C%20%E4%BB%A3%E7%A0%81%E5%9C%A8%E7%BB%93%E6%9D%9F%E6%97%B6%E8%B0%83%E7%94%A8%E3%80%82%22%2C%22%E5%9C%A8%20C%20%E4%B8%AD%E7%94%B3%E8%AF%B7%E5%86%85%E5%AD%98%EF%BC%8C%E5%B9%B6%E5%9C%A8%20Rust%20%E4%B8%AD%E7%94%A8%20%60Drop%60%20%E9%87%8A%E6%94%BE%E3%80%82%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E8%B7%A8%E8%AF%AD%E8%A8%80%E8%B0%83%E7%94%A8%E7%9A%84%E5%8E%9F%E5%88%99%E6%98%AF%E3%80%8C%E8%B0%81%E7%94%B3%E8%AF%B7%EF%BC%8C%E8%B0%81%E9%87%8A%E6%94%BE%E3%80%8D%E3%80%82Rust%20%E5%88%86%E9%85%8D%E7%9A%84%E5%86%85%E5%AD%98%E5%BF%85%E9%A1%BB%E5%9B%9E%E5%88%B0%20Rust%20%E4%BB%A3%E7%A0%81%E4%B8%AD%E7%94%B1%20Rust%20%E7%9A%84%E9%87%8A%E6%94%BE%E6%9C%BA%E5%88%B6%EF%BC%88%E5%A6%82%20Drop%EF%BC%89%E5%A4%84%E7%90%86%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
