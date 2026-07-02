<h1 id="注释语法">注释语法</h1>
<p>注释不参与程序运行，却是代码不可缺少的一部分。Rust 有四种注释形式，每种都有不同的用途和使用场景。</p>
<h2 id="行注释">行注释 <code>//</code></h2>
<p>行注释是最常见的形式，<code>//</code> 后面到行尾的所有内容都会被编译器忽略：</p>
<div class="code-runner"><pre class="code-runner-pre"><code><span class="line">fn main() {</span>
<span class="line">    // 这是一行注释</span>
<span class="line">    println!("Hello"); // 也可以写在代码行末尾</span>
<span class="line"></span>
<span class="line">    // 注释掉的代码不会执行：</span>
<span class="line">    // println!("这行不会输出");</span>
<span class="line">}</span></code></pre></div>
<p>Rust 社区的惯例是<strong class="strong-star">优先使用行注释</strong>，而不是块注释。行注释更清晰、更容易追踪每行的意图。</p>
<h2 id="块注释">块注释 <code>/* */</code></h2>
<p>块注释可以跨越多行，常用于临时注释掉一大段代码：</p>
<div class="code-runner"><pre class="code-runner-pre"><code><span class="line">fn main() {</span>
<span class="line">    /*</span>
<span class="line">     * 这是块注释。</span>
<span class="line">     * 缩进和星号只是风格，不是语法要求。</span>
<span class="line">     */</span>
<span class="line"></span>
<span class="line">    let x = 5 + /* 90 + */ 5; // 块注释可以嵌入表达式中间！</span>
<span class="line">    println!("x = {}", x);     // 输出 10，不是 100</span>
<span class="line">}</span></code></pre></div>
<p>Rust 的块注释有一个独特之处：<strong class="strong-star">支持嵌套</strong>。</p>
<div class="code-runner"><pre class="code-runner-pre"><code><span class="line">fn main() {</span>
<span class="line">    /* 外层注释</span>
<span class="line">        /* 内层注释也可以 */</span>
<span class="line">    还在外层注释中 */</span>
<span class="line">    println!("块注释可以嵌套");</span>
<span class="line">}</span></code></pre></div>
<blockquote><p>嵌套块注释在 C 语言中是不合法的，但 Rust 支持。这让你可以用 <code>/* */</code> 快速注释掉已经包含块注释的代码块。</p></blockquote>
<h2 id="文档注释">文档注释 <code>///</code></h2>
<p><code>///</code> 用于为<strong class="strong-star">紧跟在它后面的代码项</strong>（函数、结构体、模块等）生成 HTML 格式的 API 文档，内容支持 Markdown：</p>
<div class="code-runner"><pre class="code-runner-pre"><code><span class="line">/// 计算两个整数的和。</span>
<span class="line">///</span>
<span class="line">/// # 示例</span>
<span class="line">///</span>
<span class="line">/// ```</span>
<span class="line">/// let result = add(2, 3);</span>
<span class="line">/// assert_eq!(result, 5);</span>
<span class="line">/// ```</span>
<span class="line">fn add(a: i32, b: i32) -> i32 {</span>
<span class="line">    a + b</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">fn main() {</span>
<span class="line">    println!("{}", add(2, 3));</span>
<span class="line">}</span></code></pre></div>
<p>运行 <code>cargo doc --open</code> 后，<code>///</code> 的内容会渲染成漂亮的网页文档——这是 Rust 生态的标准文档格式，所有开源 crate 都遵循这个惯例。</p>
<h2 id="内部文档注释">内部文档注释 <code>//!</code></h2>
<p><code>//!</code> 与 <code>///</code> 方向相反——它为<strong class="strong-star">包含它的项</strong>（通常是文件顶部）生成文档，常用于描述整个模块或 crate：</p>
<div class="code-runner"><pre class="code-runner-pre"><code><span class="line">//! 这是当前模块的描述。</span>
<span class="line">//! 一般放在文件最顶部，用于说明模块的整体用途。</span>
<span class="line"></span>
<span class="line">fn main() {</span>
<span class="line">    println!("模块文档注释示例");</span>
<span class="line">}</span></code></pre></div>
<p>简单记：<code>///</code> 是"我在描述下面的东西"，<code>//!</code> 是"我在描述我所在的容器"。</p>
<blockquote><p>文档注释和内部文档注释的完整用法（Markdown 语法、示例测试、cargo doc 工作流）在<a href="#chapter/08-engineering/03-doc-comments">项目工程化：文档注释与 doctest</a> 中专门讲解，当前了解即可。</p></blockquote>
<h2 id="四种注释速查">四种注释速查</h2>
<table><thead><tr><th>形式</th><th>用途</th><th>生成文档</th></tr></thead><tbody><tr><td><code>//</code></td><td>普通行注释</td><td>否</td></tr><tr><td><code>/* */</code></td><td>普通块注释，可嵌套</td><td>否</td></tr><tr><td><code>///</code></td><td>为下方的项生成文档</td><td><strong class="strong-star">是</strong></td></tr><tr><td><code>//!</code></td><td>为所在模块/crate 生成文档</td><td><strong class="strong-star">是</strong></td></tr></tbody></table>
<h1 id="练习题">练习题</h1>
<h2 id="注释的执行">注释的执行</h2>
<pre><code>fn main() {\n    // println!("A");\n    println!("B");\n    /* println!("C"); */\n}</code></pre>
<div class="quiz-choice"><div class="quiz-header"><span class="quiz-badge">单选题</span></div><p class="quiz-question">运行上面的代码，输出是什么？</p><div class="quiz-options"><div class="quiz-option" data-correct="true"><label class="quiz-option-label">A. B</label></div><div class="quiz-option"><label class="quiz-option-label">B. A</label></div><div class="quiz-option"><label class="quiz-option-label">C. B 和 C</label></div><div class="quiz-option"><label class="quiz-option-label">D. A 和 B</label></div></div><div class="quiz-actions"><button class="quiz-submit">提交</button></div></div>
<h2 id="块注释的特性">块注释的特性</h2>
<div class="quiz-choice"><div class="quiz-header"><span class="quiz-badge">单选题</span></div><p class="quiz-question">Rust 的块注释 <code>/* */</code> 与 C 语言的块注释相比，有什么独特之处？</p><div class="quiz-options"><div class="quiz-option"><label class="quiz-option-label">A. 块注释不能跨越多行</label></div><div class="quiz-option" data-correct="true"><label class="quiz-option-label">B. 块注释支持嵌套，即 /* /* 内层 */ */ 是合法的</label></div><div class="quiz-option"><label class="quiz-option-label">C. 块注释只能写在单独的行，不能嵌入表达式中间</label></div><div class="quiz-option"><label class="quiz-option-label">D. 块注释会生成文档</label></div></div><div class="quiz-actions"><button class="quiz-submit">提交</button></div></div>
<h2 id="文档注释的方向">文档注释的方向</h2>
<div class="quiz-choice"><div class="quiz-header"><span class="quiz-badge">单选题</span></div><p class="quiz-question"><code>///</code> 和 <code>//!</code> 的核心区别是什么？</p><div class="quiz-options"><div class="quiz-option"><label class="quiz-option-label">A. /// 生成文档，//! 不生成文档</label></div><div class="quiz-option" data-correct="true"><label class="quiz-option-label">B. /// 描述紧跟在它后面的项，//! 描述包含它的容器（如模块）</label></div><div class="quiz-option"><label class="quiz-option-label">C. /// 用于函数，//! 用于结构体</label></div><div class="quiz-option"><label class="quiz-option-label">D. 两者完全相同，只是风格不同</label></div></div><div class="quiz-actions"><button class="quiz-submit">提交</button></div></div>
<h2 id="哪些注释会生成-api-文档">哪些注释会生成 API 文档</h2>
<div class="quiz-choice"><div class="quiz-header"><span class="quiz-badge">多选题</span></div><p class="quiz-question">运行 <code>cargo doc</code> 时，哪些注释的内容会出现在生成的 HTML 文档中？</p><div class="quiz-options"><div class="quiz-option"><label class="quiz-option-label">A. /* 块注释 */</label></div><div class="quiz-option" data-correct="true"><label class="quiz-option-label">B. //! 内部文档注释</label></div><div class="quiz-option"><label class="quiz-option-label">C. // 普通行注释</label></div><div class="quiz-option" data-correct="true"><label class="quiz-option-label">D. /// 外部文档注释</label></div></div><div class="quiz-actions"><button class="quiz-submit">提交</button></div></div>
<h2 id="推荐的注释风格">推荐的注释风格</h2>
<div class="quiz-choice"><div class="quiz-header"><span class="quiz-badge">单选题</span></div><p class="quiz-question">Rust 社区对于普通注释，更推荐哪种形式？</p><div class="quiz-options"><div class="quiz-option" data-correct="true"><label class="quiz-option-label">A. 行注释 //</label></div><div class="quiz-option"><label class="quiz-option-label">B. 两者完全等价，没有推荐</label></div><div class="quiz-option"><label class="quiz-option-label">C. 文档注释 ///</label></div><div class="quiz-option"><label class="quiz-option-label">D. 块注释 /* */</label></div></div><div class="quiz-actions"><button class="quiz-submit">提交</button></div></div>
<h2 id="编程练习">编程练习</h2>
<p>下面的代码本应输出 <code>result = 42</code>，但有一处块注释的位置用错了，把本该参与计算的数字注释掉了。找出问题并修复它。</p>
<pre><code>fn main() {\n    let a = 40;\n    let b = /* 2 */;\n    let result = a + b;\n    println!("result = {}", result);\n}</code></pre>