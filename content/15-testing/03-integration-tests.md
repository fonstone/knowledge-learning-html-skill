<h1 id="两种测试的分工">两种测试的分工</h1>
<p>Rust 项目通常有两类测试，它们的目标不同、放的地方也不同：</p>






























<table><thead><tr><th></th><th>单元测试</th><th>集成测试</th></tr></thead><tbody><tr><td><strong class="strong-star">放在哪里</strong></td><td>与源码同文件（<code>src/</code> 目录下）</td><td>独立的 <code>tests/</code> 目录</td></tr><tr><td><strong class="strong-star">测什么</strong></td><td>单个函数/模块的正确性，可以访问私有函数</td><td>多个模块协作的整体行为，只能访问公有 API</td></tr><tr><td><strong class="strong-star">需要 <code>#[cfg(test)]</code></strong></td><td>是（因为和源码在同一文件）</td><td>否（Cargo 自动识别 <code>tests/</code> 目录）</td></tr><tr><td><strong class="strong-star">典型用途</strong></td><td>验证内部实现细节</td><td>模拟真实用户调用库的方式</td></tr></tbody></table>
<p>单元测试发现的是”零件坏了”，集成测试发现的是”零件没坏，但组装有问题”。两者互补，缺一不可。</p>
<h2 id="单元测试的组织">单元测试的组织</h2>
<p>单元测试住在源码文件里，用 <code>#[cfg(test)]</code> 隔离：</p>
<div class="code-runner" data-mode="run" data-full-code="pub%20fn%20add_two(a%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20internal_adder(a%2C%202)%0A%7D%0A%0Afn%20internal_adder(a%3A%20i32%2C%20b%3A%20i32)%20-%3E%20i32%20%7B%20%20%2F%2F%20%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%0A%20%20%20%20a%20%2B%20b%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20test_public()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(4%2C%20add_two(2))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20test_private()%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E6%B5%8B%E8%AF%95%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%EF%BC%81%0A%20%20%20%20%20%20%20%20assert_eq!(5%2C%20internal_adder(3%2C%202))%3B%0A%20%20%20%20%7D%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> add_two</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    internal_adder</span><span style="color:#E1E4E8">(a, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> internal_adder</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {  </span><span style="color:#6A737D">// 私有函数</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> test_public</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> test_private</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">        // 可以直接测试私有函数！</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">internal_adder</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p><code>#[cfg(test)]</code> 的作用是：<code>cargo build</code> 时这个模块完全不存在，只有 <code>cargo test</code> 时才编译进去。</p>
<h1 id="编写集成测试">编写集成测试</h1>
<h2 id="tests-目录结构">tests/ 目录结构</h2>
<p>集成测试放在项目根目录的 <code>tests/</code> 目录下（与 <code>src/</code> 同级）：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>my_project/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   └── lib.rs</span></span>
<span class="line"><span>└── tests/</span></span>
<span class="line"><span>    └── integration_test.rs   ← 集成测试文件</span></span></code></pre>
<p><code>tests/</code> 下每个文件都是一个独立的 crate，Cargo 会在 <code>cargo test</code> 时自动编译并运行它们，<strong class="strong-star">不需要</strong> <code>#[cfg(test)]</code> 标注。</p>
<p>示例 <code>tests/integration_test.rs</code>：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="rust"><code><span class="line"><span style="color:#F97583">use</span><span style="color:#E1E4E8"> adder;  </span><span style="color:#6A737D">// 引入我们的库 crate</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[test]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> it_adds_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">adder</span><span style="color:#F97583">::</span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>注意：</p>
<ul>
<li>需要用 <code>use</code> 显式引入库，像外部用户一样使用它</li>
<li>只能调用<strong class="strong-star">公有</strong> API，私有函数在集成测试中不可见</li>
<li>每个文件都是独立 crate，不同文件之间默认不共享代码</li>
</ul>
<p>运行时，输出会分为三段：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>running 1 test                         ← 单元测试</span></span>
<span class="line"><span>test tests::internal ... ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>running 1 test                         ← 集成测试</span></span>
<span class="line"><span>test it_adds_two ... ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>running 0 tests                        ← 文档测试</span></span></code></pre>
<h2 id="运行指定的集成测试文件">运行指定的集成测试文件</h2>
<p>如果 <code>tests/</code> 下有多个文件，可以用 <code>--test</code> 指定运行某个文件：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --test</span><span style="color:#9ECBFF"> integration_test</span></span></code></pre>
<p>只会运行 <code>tests/integration_test.rs</code> 中的测试，忽略其他文件。</p>
<p>结合名称过滤，可以更精确：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --test</span><span style="color:#9ECBFF"> integration_test</span><span style="color:#9ECBFF"> it_adds</span></span></code></pre>
<p>只运行 <code>integration_test.rs</code> 中名称含 <code>it_adds</code> 的测试。</p>
<h2 id="集成测试中的共享辅助模块">集成测试中的共享辅助模块</h2>
<p>当多个集成测试文件都需要共同的辅助函数时，需要特别注意——<strong class="strong-star">不能</strong>直接创建 <code>tests/common.rs</code>。</p>
<p>为什么？因为 <code>tests/</code> 下每个 <code>.rs</code> 文件都被视为独立的测试 crate，<code>tests/common.rs</code> 也会被当成一个独立的测试文件运行，然后显示 <code>running 0 tests</code>——让输出变得混乱。</p>
<p><strong class="strong-star">正确做法</strong>：创建子目录 <code>tests/common/mod.rs</code>：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>tests/</span></span>
<span class="line"><span>├── integration_test.rs</span></span>
<span class="line"><span>└── common/</span></span>
<span class="line"><span>    └── mod.rs          ← 辅助函数放这里</span></span></code></pre>
<p><code>tests/common/mod.rs</code> 中写辅助函数：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="rust"><code><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> setup</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 测试前的准备工作，比如创建临时文件、初始化数据等</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>在集成测试文件中引用它：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="rust"><code><span class="line"><span style="color:#F97583">use</span><span style="color:#E1E4E8"> adder;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> common</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 声明模块</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[test]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> it_adds_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    common</span><span style="color:#F97583">::</span><span style="color:#B392F0">setup</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 调用辅助函数</span></span>
<span class="line"><span style="color:#B392F0">    assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">adder</span><span style="color:#F97583">::</span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>子目录里的文件不会被 Cargo 当作独立的测试 crate，测试输出里不会出现多余的 <code>running 0 tests</code>。</p>
<blockquote>
<p><strong class="strong-star">原理</strong>：Cargo 的规则是：<code>tests/</code> 下的<strong class="strong-star">直接子 <code>.rs</code> 文件</strong>各自是独立 crate；但<strong class="strong-star">子目录下的文件</strong>不是，它们只是普通模块。<code>tests/common/mod.rs</code> 走的是第二条路，所以不会被单独编译为测试 crate。</p>
</blockquote>
<h2 id="二进制项目的集成测试">二进制项目的集成测试</h2>
<p>只有<strong class="strong-star">库 crate</strong>（<code>src/lib.rs</code>）才能被集成测试引入。如果你的项目只有 <code>src/main.rs</code>（二进制 crate），集成测试就无法用 <code>use</code> 引入它的代码。</p>
<p>这是 Rust 生态约定采用<strong class="strong-star">薄 main + 厚 lib</strong> 结构的原因：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>src/</span></span>
<span class="line"><span>├── main.rs   ← 只做参数解析、调用 lib 函数，尽量精简</span></span>
<span class="line"><span>└── lib.rs    ← 核心逻辑全在这里，方便测试</span></span></code></pre>
<p><code>main.rs</code> 里调用 <code>lib.rs</code> 中的函数；集成测试则通过 <code>use</code> 引入 <code>lib.rs</code> 测试核心逻辑。<code>main.rs</code> 的代码很少，不测也无妨。</p>
<h1 id="练习题">练习题</h1>
<h2 id="测验">测验</h2>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/03-integration-tests#2:0" data-payload="%7B%22question%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6%E6%94%BE%E5%9C%A8%E5%93%AA%E9%87%8C%EF%BC%9F%22%2C%22options%22%3A%5B%22src%2F%20%E7%9B%AE%E5%BD%95%E4%B8%8B%EF%BC%8C%E4%B8%8E%E6%BA%90%E7%A0%81%E5%90%8C%E6%96%87%E4%BB%B6%22%2C%22%E4%BB%BB%E6%84%8F%E4%BD%8D%E7%BD%AE%EF%BC%8C%E7%94%A8%20%23%5Bintegration_test%5D%20%E6%A0%87%E6%B3%A8%22%2C%22%E9%A1%B9%E7%9B%AE%E6%A0%B9%E7%9B%AE%E5%BD%95%E7%9A%84%20tests%2F%20%E7%9B%AE%E5%BD%95%E4%B8%8B%EF%BC%88%E4%B8%8E%20src%2F%20%E5%90%8C%E7%BA%A7%EF%BC%89%22%2C%22src%2Ftests%2F%20%E7%9B%AE%E5%BD%95%E4%B8%8B%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%94%BE%E5%9C%A8%20tests%2F%20%E7%9B%AE%E5%BD%95%E4%B8%8B%EF%BC%8CCargo%20%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%B9%B6%E5%9C%A8%20cargo%20test%20%E6%97%B6%E7%BC%96%E8%AF%91%E8%BF%90%E8%A1%8C%E3%80%82%E4%B8%8D%E9%9C%80%E8%A6%81%20%23%5Bcfg(test)%5D%EF%BC%8C%E4%B9%9F%E4%B8%8D%E9%9C%80%E8%A6%81%E4%BB%BB%E4%BD%95%E7%89%B9%E6%AE%8A%E6%A0%87%E6%B3%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/03-integration-tests#2:1" data-payload="%7B%22question%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6%E4%B8%AD%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E9%9C%80%E8%A6%81%20%23%5Bcfg(test)%5D%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%20tests%2F%20%E7%9B%AE%E5%BD%95%E6%9C%AC%E8%BA%AB%E5%B0%B1%E6%98%AF%E7%89%B9%E6%AE%8A%E7%9B%AE%E5%BD%95%EF%BC%8CCargo%20%E5%8F%AA%E5%9C%A8%20cargo%20test%20%E6%97%B6%E7%BC%96%E8%AF%91%E5%AE%83%22%2C%22%E5%9B%A0%E4%B8%BA%20%23%5Bcfg(test)%5D%20%E5%8F%AA%E7%94%A8%E4%BA%8E%20struct%20%E5%92%8C%20enum%22%2C%22%E5%9B%A0%E4%B8%BA%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E4%B8%8D%E8%83%BD%E6%9C%89%E6%9D%A1%E4%BB%B6%E7%BC%96%E8%AF%91%22%2C%22%E5%9B%A0%E4%B8%BA%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%80%BB%E6%98%AF%E7%BC%96%E8%AF%91%E8%BF%9B%E6%9C%80%E7%BB%88%E4%BA%8C%E8%BF%9B%E5%88%B6%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Cargo%20%E6%8A%8A%20tests%2F%20%E7%9B%AE%E5%BD%95%E8%A7%86%E4%B8%BA%E7%89%B9%E6%AE%8A%E7%9B%AE%E5%BD%95%EF%BC%8C%E5%8F%AA%E5%9C%A8%E6%89%A7%E8%A1%8C%20cargo%20test%20%E6%97%B6%E6%89%8D%E7%BC%96%E8%AF%91%E9%87%8C%E9%9D%A2%E7%9A%84%E6%96%87%E4%BB%B6%E3%80%82%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%E9%9C%80%E8%A6%81%20%23%5Bcfg(test)%5D%20%E6%98%AF%E5%9B%A0%E4%B8%BA%E5%AE%83%E4%BB%AC%E5%92%8C%E6%BA%90%E7%A0%81%E5%9C%A8%E5%90%8C%E4%B8%80%E6%96%87%E4%BB%B6%E9%87%8C%EF%BC%8C%E5%BF%85%E9%A1%BB%E7%94%A8%E6%9D%A1%E4%BB%B6%E7%BC%96%E8%AF%91%E6%8A%8A%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81%E9%9A%94%E5%BC%80%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/03-integration-tests#2:2" data-payload="%7B%22question%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E5%92%8C%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%E7%9B%B8%E6%AF%94%EF%BC%8C%E4%B8%BB%E8%A6%81%E9%99%90%E5%88%B6%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8D%E8%83%BD%E6%9C%89%E5%A4%9A%E4%B8%AA%E6%B5%8B%E8%AF%95%E5%87%BD%E6%95%B0%22%2C%22%E4%B8%8D%E8%83%BD%E4%BD%BF%E7%94%A8%20assert!%20%E5%AE%8F%22%2C%22%E4%B8%8D%E8%83%BD%E5%B9%B6%E8%A1%8C%E8%BF%90%E8%A1%8C%22%2C%22%E5%8F%AA%E8%83%BD%E8%AE%BF%E9%97%AE%E5%BA%93%E7%9A%84%E5%85%AC%E6%9C%89%20API%EF%BC%8C%E4%B8%8D%E8%83%BD%E8%AE%BF%E9%97%AE%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%98%AF%E4%BB%8E%E5%BA%93%E7%9A%84%5C%22%E5%A4%96%E9%83%A8%5C%22%E8%B0%83%E7%94%A8%E7%9A%84%EF%BC%8C%E5%B0%B1%E5%83%8F%E7%9C%9F%E5%AE%9E%E7%94%A8%E6%88%B7%E4%B8%80%E6%A0%B7%EF%BC%8C%E6%89%80%E4%BB%A5%E5%8F%AA%E8%83%BD%E8%AE%BF%E9%97%AE%20pub%20%E6%A0%87%E8%AE%B0%E7%9A%84%E5%85%AC%E6%9C%89%20API%E3%80%82%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%E5%8F%AA%E6%9C%89%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95%EF%BC%88%E5%9C%A8%E5%90%8C%E4%B8%80%E6%96%87%E4%BB%B6%E5%86%85%EF%BC%89%E6%89%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%E6%B5%8B%E8%AF%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/03-integration-tests#2:3" data-payload="%7B%22question%22%3A%22%E6%83%B3%E8%A6%81%E5%A4%9A%E4%B8%AA%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6%E5%85%B1%E4%BA%AB%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0%EF%BC%8C%E5%BA%94%E8%AF%A5%E6%80%8E%E4%B9%88%E5%81%9A%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%AF%8F%E4%B8%AA%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6%E9%87%8D%E5%A4%8D%E5%86%99%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0%22%2C%22%E5%88%9B%E5%BB%BA%20tests%2Fcommon%2Fmod.rs%20%E5%B9%B6%E5%86%99%20pub%20fn%22%2C%22%E6%8A%8A%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0%E6%94%BE%E5%9C%A8%20src%2Flib.rs%20%E9%87%8C%20pub%20%E5%AF%BC%E5%87%BA%22%2C%22%E5%88%9B%E5%BB%BA%20tests%2Fcommon.rs%20%E5%B9%B6%E5%86%99%20pub%20fn%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22tests%2Fcommon.rs%20%E4%BC%9A%E8%A2%AB%20Cargo%20%E5%BD%93%E6%88%90%E7%8B%AC%E7%AB%8B%E7%9A%84%E6%B5%8B%E8%AF%95%20crate%EF%BC%8C%E6%B5%8B%E8%AF%95%E8%BE%93%E5%87%BA%E9%87%8C%E4%BC%9A%E5%87%BA%E7%8E%B0%20%5C%22running%200%20tests%5C%22%20%E7%9A%84%E5%99%AA%E9%9F%B3%E3%80%82%E6%AD%A3%E7%A1%AE%E5%81%9A%E6%B3%95%E6%98%AF%20tests%2Fcommon%2Fmod.rs%E2%80%94%E2%80%94%E5%AD%90%E7%9B%AE%E5%BD%95%E4%B8%8B%E7%9A%84%E6%96%87%E4%BB%B6%E6%98%AF%E6%99%AE%E9%80%9A%E6%A8%A1%E5%9D%97%EF%BC%8C%E4%B8%8D%E4%BC%9A%E8%A2%AB%E5%8D%95%E7%8B%AC%E8%BF%90%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/03-integration-tests#2:4" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E9%9D%A2%E5%85%B3%E4%BA%8E%5C%22%E8%96%84%20main%20%2B%20%E5%8E%9A%20lib%5C%22%E7%BB%93%E6%9E%84%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E5%93%AA%E4%B8%AA%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22main.rs%20%E5%92%8C%20lib.rs%20%E5%8F%AF%E4%BB%A5%E4%BA%92%E7%9B%B8%E8%B0%83%E7%94%A8%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%8C%BA%E5%88%AB%22%2C%22main.rs%20%E5%B0%BD%E9%87%8F%E7%B2%BE%E7%AE%80%EF%BC%8C%E6%A0%B8%E5%BF%83%E9%80%BB%E8%BE%91%E6%94%BE%20lib.rs%EF%BC%8C%E6%96%B9%E4%BE%BF%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E9%80%9A%E8%BF%87%20use%20%E5%BC%95%E5%85%A5%22%2C%22%E8%BF%99%E6%A0%B7%E5%8F%AF%E4%BB%A5%E8%AE%A9%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E6%9B%B4%E5%BF%AB%22%2C%22%E8%BF%99%E5%8F%AA%E6%98%AF%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%BB%BA%E8%AE%AE%EF%BC%8C%E5%AF%B9%E6%B5%8B%E8%AF%95%E6%B2%A1%E6%9C%89%E5%AE%9E%E9%99%85%E5%BD%B1%E5%93%8D%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E5%8F%AA%E8%83%BD%E9%80%9A%E8%BF%87%20use%20%E5%BC%95%E5%85%A5%E5%BA%93%20crate%EF%BC%88lib.rs%EF%BC%89%EF%BC%8C%E6%97%A0%E6%B3%95%E5%BC%95%E5%85%A5%E4%BA%8C%E8%BF%9B%E5%88%B6%20crate%EF%BC%88main.rs%EF%BC%89%E3%80%82%E6%8A%8A%E6%A0%B8%E5%BF%83%E9%80%BB%E8%BE%91%E6%94%BE%E5%9C%A8%20lib.rs%20%E9%87%8C%EF%BC%8C%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E5%B0%B1%E8%83%BD%E8%A6%86%E7%9B%96%E5%88%B0%EF%BC%9Bmain.rs%20%E5%8F%AA%E8%B4%9F%E8%B4%A3%E5%85%A5%E5%8F%A3%EF%BC%8C%E4%BB%A3%E7%A0%81%E5%B0%91%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E4%B8%93%E9%97%A8%E6%B5%8B%E8%AF%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>  </div> 