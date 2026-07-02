<h1 id="cargo-test-的参数体系">cargo test 的参数体系</h1>
<p><code>cargo test</code> 的命令行参数分为<strong class="strong-star">两段</strong>，用 <code>--</code> 分隔：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#E1E4E8"> [cargo </span><span style="color:#9ECBFF">自身的参数]</span><span style="color:#79B8FF"> --</span><span style="color:#E1E4E8"> [传递给测试二进制的参数]</span></span></code></pre>
<ul>
<li><code>--</code> <strong class="strong-star">之前</strong>：控制 Cargo 编译行为（如 <code>--release</code>、<code>--package</code>）</li>
<li><code>--</code> <strong class="strong-star">之后</strong>：控制测试程序的运行方式（如 <code>--test-threads</code>、<code>--show-output</code>）</li>
</ul>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#6A737D"># -- 之前：Cargo 自身的参数</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --release</span><span style="color:#6A737D">               # 以 release 模式编译后运行测试</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --package</span><span style="color:#9ECBFF"> my_lib</span><span style="color:#6A737D">        # 只测试指定的包（工作区场景）</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --help</span><span style="color:#6A737D">                  # 查看 Cargo 层的选项</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># -- 之后：传给测试二进制的参数</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --test-threads=1</span><span style="color:#6A737D">     # 串行运行测试</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --show-output</span><span style="color:#6A737D">        # 显示通过测试的 println! 输出</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --ignored</span><span style="color:#6A737D">            # 只运行被 #[ignore] 标记的测试</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --help</span><span style="color:#6A737D">               # 查看测试二进制层的所有选项</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 两段组合使用</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --release</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --test-threads=1</span><span style="color:#6A737D">   # release 模式 + 串行运行</span></span>
<span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#9ECBFF"> my_func</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --show-output</span><span style="color:#6A737D">        # 只运行名称含 my_func 的测试，并显示输出</span></span></code></pre>
<p>这两段的参数各自独立，不要混淆。</p>
<h1 id="控制测试运行方式">控制测试运行方式</h1>
<h2 id="并行与串行">并行与串行</h2>
<p>默认情况下，Rust 会<strong class="strong-star">并行运行</strong>所有测试（多线程），以加快速度。</p>
<p>但并行运行有一个前提：<strong class="strong-star">测试之间不能共享状态</strong>。如果两个测试都读写同一个文件，就可能相互干扰，导致莫名其妙的失败。</p>
<p>遇到这种情况，可以把线程数限制为 1，让测试<strong class="strong-star">串行执行</strong>：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --test-threads=1</span></span></code></pre>
<p>这样慢一些，但测试结果稳定可靠，适合调试相互干扰的测试。</p>
<h2 id="显示-println-的输出">显示 println! 的输出</h2>
<p>默认情况下，<strong class="strong-star">通过的测试</strong>中的 <code>println!</code> 输出会被 Rust 截获，不显示在终端，只有失败的测试才会显示标准输出。</p>
<div class="code-runner" data-mode="run" data-full-code="fn%20double(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20println!(%22double(%7B%7D)%20%E8%A2%AB%E8%B0%83%E7%94%A8%E4%BA%86%22%2C%20x)%3B%20%20%2F%2F%20%E6%AD%A3%E5%B8%B8%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BC%9A%E7%9C%8B%E5%88%B0%EF%BC%8C%E6%B5%8B%E8%AF%95%E9%80%9A%E8%BF%87%E6%97%B6%E7%9C%8B%E4%B8%8D%E5%88%B0%0A%20%20%20%20x%20*%202%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20test_double()%20%7B%0A%20%20%20%20%20%20%20%20let%20result%20%3D%20double(5)%3B%0A%20%20%20%20%20%20%20%20assert_eq!(10%2C%20result)%3B%0A%20%20%20%20%7D%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"double({}) 被调用了"</span><span style="color:#E1E4E8">, x);  </span><span style="color:#6A737D">// 正常运行时会看到，测试通过时看不到</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> test_double</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, result);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p>运行 <code>cargo test</code>，因为测试通过，你<strong class="strong-star">看不到</strong> <code>println!</code> 的内容。</p>
<p>如果你想在测试通过时也看到输出，加上 <code>--show-output</code>：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --show-output</span></span></code></pre>
<p>这在调试时很有用——你可以在函数里加几行 <code>println!</code> 来观察中间状态，而不用担心干扰测试结果。</p>
<h2 id="按名称过滤只运行部分测试">按名称过滤：只运行部分测试</h2>
<p>有时你只想运行某一个或某一类测试，不需要跑所有测试：</p>
<p>假设有三个测试：</p>
<div class="code-runner" data-mode="run" data-full-code="pub%20fn%20add_two(a%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20a%20%2B%202%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20add_two_and_two()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(4%2C%20add_two(2))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20add_three_and_two()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(5%2C%20add_two(3))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20one_hundred()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(102%2C%20add_two(100))%3B%0A%20%20%20%20%7D%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> add_two</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> add_two_and_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> add_three_and_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> one_hundred</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">102</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p><strong class="strong-star">只运行一个测试</strong>——传入完整函数名：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#9ECBFF"> one_hundred</span></span></code></pre>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>running 1 test</span></span>
<span class="line"><span>test tests::one_hundred ... ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 2 filtered out</span></span></code></pre>
<p><strong class="strong-star">运行名称包含某个词的所有测试</strong>——传入部分名称：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#9ECBFF"> add</span></span></code></pre>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>running 2 tests</span></span>
<span class="line"><span>test tests::add_two_and_two ... ok</span></span>
<span class="line"><span>test tests::add_three_and_two ... ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out</span></span></code></pre>
<p><code>2 filtered out</code> 说明有 2 个测试被过滤掉了（这里只有 1 个，但样例展示了概念）。</p>
<blockquote>
<p>测试名称包含<strong class="strong-star">模块路径</strong>，因此 <code>cargo test tests</code> 可以运行 <code>tests</code> 模块里的所有测试。</p>
</blockquote>
<h2 id="忽略耗时测试">忽略耗时测试</h2>
<p>有些测试运行时间很长（比如访问网络、操作大文件），日常开发中不想每次都跑。用 <code>#[ignore]</code> 标记它们：</p>
<div class="code-runner" data-mode="run" data-full-code="%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20quick_test()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(2%20%2B%202%2C%204)%3B%20%20%2F%2F%20%E7%9E%AC%E9%97%B4%E5%AE%8C%E6%88%90%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20%23%5Bignore%5D%0A%20%20%20%20fn%20slow_test()%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%81%87%E8%AE%BE%E8%BF%99%E9%87%8C%E9%9C%80%E8%A6%81%E8%B7%91%E5%BE%88%E4%B9%85%E2%80%A6%E2%80%A6%0A%20%20%20%20%20%20%20%20assert!(true)%3B%0A%20%20%20%20%7D%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> quick_test</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 瞬间完成</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#E1E4E8">    #[ignore]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> slow_test</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">        // 假设这里需要跑很久……</span></span>
<span class="line"><span style="color:#B392F0">        assert!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p>运行 <code>cargo test</code>，<code>slow_test</code> 会显示为 <code>ignored</code>，不被执行：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="text"><code><span class="line"><span>running 2 tests</span></span>
<span class="line"><span>test tests::slow_test ... ignored</span></span>
<span class="line"><span>test tests::quick_test ... ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out</span></span></code></pre>
<p>当你需要专门运行被忽略的测试（比如 CI 环境），用：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">cargo</span><span style="color:#9ECBFF"> test</span><span style="color:#79B8FF"> --</span><span style="color:#79B8FF"> --ignored</span></span></code></pre>
<p>这样只运行带 <code>#[ignore]</code> 的测试，方便单独跑耗时测试套件。</p>
<h2 id="命令速查">命令速查</h2>

































<table><thead><tr><th>目标</th><th>命令</th></tr></thead><tbody><tr><td>运行所有测试</td><td><code>cargo test</code></td></tr><tr><td>串行运行（单线程）</td><td><code>cargo test -- --test-threads=1</code></td></tr><tr><td>显示通过测试的输出</td><td><code>cargo test -- --show-output</code></td></tr><tr><td>只运行名称匹配的测试</td><td><code>cargo test <关键词></code></td></tr><tr><td>只运行被忽略的测试</td><td><code>cargo test -- --ignored</code></td></tr><tr><td>运行所有（含被忽略的）</td><td><code>cargo test -- --include-ignored</code></td></tr></tbody></table>
<h1 id="练习题">练习题</h1>
<h2 id="测验">测验</h2>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/02-test-control#2:0" data-payload="%7B%22question%22%3A%22cargo%20test%20--%20--test-threads%3D1%20%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%AE%A9%E6%B5%8B%E8%AF%95%E7%BC%96%E8%AF%91%E5%BE%97%E6%9B%B4%E5%BF%AB%22%2C%22%E8%AE%A9%E6%89%80%E6%9C%89%E6%B5%8B%E8%AF%95%E4%B8%B2%E8%A1%8C%EF%BC%88%E6%8C%89%E9%A1%BA%E5%BA%8F%E4%B8%80%E4%B8%AA%E6%8E%A5%E4%B8%80%E4%B8%AA%EF%BC%89%E8%BF%90%E8%A1%8C%EF%BC%8C%E4%B8%8D%E5%B9%B6%E8%A1%8C%22%2C%22%E9%99%90%E5%88%B6%E6%B5%8B%E8%AF%95%E6%9C%80%E5%A4%9A%E8%BF%90%E8%A1%8C%201%20%E7%A7%92%22%2C%22%E5%8F%AA%E8%BF%90%E8%A1%8C%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B5%8B%E8%AF%95%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E9%BB%98%E8%AE%A4%20cargo%20test%20%E5%B9%B6%E8%A1%8C%E8%BF%90%E8%A1%8C%E6%B5%8B%E8%AF%95%E3%80%82%E4%BC%A0%E5%85%A5%20--test-threads%3D1%20%E6%8A%8A%E7%BA%BF%E7%A8%8B%E6%95%B0%E8%AE%BE%E4%B8%BA%201%EF%BC%8C%E6%B5%8B%E8%AF%95%E5%B0%B1%E4%BC%9A%E4%B8%B2%E8%A1%8C%E6%89%A7%E8%A1%8C%EF%BC%8C%E9%80%82%E5%90%88%E6%B5%8B%E8%AF%95%E4%B9%8B%E9%97%B4%E6%9C%89%E5%85%B1%E4%BA%AB%E7%8A%B6%E6%80%81%EF%BC%88%E5%A6%82%E5%85%B1%E4%BA%AB%E6%96%87%E4%BB%B6%EF%BC%89%E7%9A%84%E6%83%85%E5%86%B5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/02-test-control#2:1" data-payload="%7B%22question%22%3A%22%E9%80%9A%E8%BF%87%E7%9A%84%E6%B5%8B%E8%AF%95%E4%B8%AD%20println!%20%E7%9A%84%E8%BE%93%E5%87%BA%E9%BB%98%E8%AE%A4%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%86%99%E5%85%A5%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6%22%2C%22%E6%98%BE%E7%A4%BA%E5%9C%A8%E7%BB%88%E7%AB%AF%22%2C%22%E8%A7%A6%E5%8F%91%E7%BC%96%E8%AF%91%E8%AD%A6%E5%91%8A%22%2C%22%E8%A2%AB%E6%88%AA%E8%8E%B7%EF%BC%8C%E4%B8%8D%E6%98%BE%E7%A4%BA%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E9%BB%98%E8%AE%A4%E6%83%85%E5%86%B5%E4%B8%8B%EF%BC%8CRust%20%E6%B5%8B%E8%AF%95%E6%A1%86%E6%9E%B6%E4%BC%9A%E6%88%AA%E8%8E%B7%E9%80%9A%E8%BF%87%E6%B5%8B%E8%AF%95%E7%9A%84%E6%A0%87%E5%87%86%E8%BE%93%E5%87%BA%EF%BC%8C%E7%BB%88%E7%AB%AF%E4%B8%8D%E4%BC%9A%E7%9C%8B%E5%88%B0%E3%80%82%E5%8A%A0%E4%B8%8A%20--%20--show-output%20%E6%89%8D%E8%83%BD%E8%AE%A9%E9%80%9A%E8%BF%87%E6%B5%8B%E8%AF%95%E7%9A%84%E8%BE%93%E5%87%BA%E4%B9%9F%E6%98%BE%E7%A4%BA%E5%87%BA%E6%9D%A5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/02-test-control#2:2" data-payload="%7B%22question%22%3A%22%E5%81%87%E8%AE%BE%E6%9C%89%E6%B5%8B%E8%AF%95%E5%87%BD%E6%95%B0%20fn%20test_add()%E3%80%81fn%20test_multiply()%E3%80%81fn%20benchmark_sort()%EF%BC%8C%E6%89%A7%E8%A1%8C%20cargo%20test%20test%20%E4%BC%9A%E8%BF%90%E8%A1%8C%E5%93%AA%E4%BA%9B%E6%B5%8B%E8%AF%95%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E6%9C%89%20test_add%22%2C%22%E4%B8%80%E4%B8%AA%E9%83%BD%E4%B8%8D%E8%BF%90%E8%A1%8C%22%2C%22test_add%20%E5%92%8C%20test_multiply%22%2C%22%E5%85%A8%E9%83%A8%E4%B8%89%E4%B8%AA%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22cargo%20test%20%E5%90%8E%E8%B7%9F%E5%85%B3%E9%94%AE%E8%AF%8D%E6%97%B6%EF%BC%8C%E4%BC%9A%E8%BF%90%E8%A1%8C%E6%89%80%E6%9C%89%E5%90%8D%E7%A7%B0%E4%B8%AD%E5%8C%85%E5%90%AB%E8%AF%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E6%B5%8B%E8%AF%95%E3%80%82test_add%20%E5%92%8C%20test_multiply%20%E9%83%BD%E5%8C%85%E5%90%AB%20%5C%22test%5C%22%EF%BC%8C%E8%80%8C%20benchmark_sort%20%E4%B8%8D%E5%8C%85%E5%90%AB%EF%BC%8C%E6%89%80%E4%BB%A5%E5%8F%AA%E8%BF%90%E8%A1%8C%E5%89%8D%E4%B8%A4%E4%B8%AA%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/02-test-control#2:3" data-payload="%7B%22question%22%3A%22%23%5Bignore%5D%20%E5%B1%9E%E6%80%A7%E7%9A%84%E5%85%B8%E5%9E%8B%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%A0%87%E8%AE%B0%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4%E5%BE%88%E9%95%BF%E7%9A%84%E6%B5%8B%E8%AF%95%EF%BC%8C%E6%97%A5%E5%B8%B8%E8%B7%91%20cargo%20test%20%E6%97%B6%E8%B7%B3%E8%BF%87%22%2C%22%E4%B8%B4%E6%97%B6%E7%A6%81%E7%94%A8%E6%9C%89%20bug%20%E7%9A%84%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%AE%A9%20CI%20%E8%B7%91%E8%BF%87%22%2C%22%E6%B5%8B%E8%AF%95%E5%87%BD%E6%95%B0%E4%B8%8D%E9%9C%80%E8%A6%81%20%23%5Btest%5D%20%E6%97%B6%E4%BD%9C%E4%B8%BA%E6%9B%BF%E4%BB%A3%22%2C%22%E6%A0%87%E8%AE%B0%E5%8F%AA%E8%83%BD%E5%9C%A8%E7%89%B9%E5%AE%9A%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E8%BF%90%E8%A1%8C%E7%9A%84%E6%B5%8B%E8%AF%95%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%23%5Bignore%5D%20%E7%94%A8%E4%BA%8E%E6%A0%87%E8%AE%B0%E8%80%97%E6%97%B6%E7%9A%84%E6%B5%8B%E8%AF%95%EF%BC%88%E5%A6%82%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E3%80%81%E5%A4%A7%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C%EF%BC%89%EF%BC%8C%E8%AE%A9%E6%97%A5%E5%B8%B8%E7%9A%84%20cargo%20test%20%E5%BF%AB%E9%80%9F%E5%AE%8C%E6%88%90%E3%80%82%E9%9C%80%E8%A6%81%E4%B8%93%E9%97%A8%E8%BF%90%E8%A1%8C%E8%BF%99%E4%BA%9B%E6%B5%8B%E8%AF%95%E6%97%B6%EF%BC%8C%E4%BD%BF%E7%94%A8%20cargo%20test%20--%20--ignored%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="15-testing/02-test-control#2:4" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E9%9D%A2%E5%93%AA%E6%9D%A1%E5%91%BD%E4%BB%A4%E5%8F%AA%E8%BF%90%E8%A1%8C%E5%87%BD%E6%95%B0%E5%90%8D%E9%87%8C%E5%90%AB%E6%9C%89%20%5C%22add%5C%22%20%E7%9A%84%E6%B5%8B%E8%AF%95%EF%BC%9F%22%2C%22options%22%3A%5B%22cargo%20test%20add%22%2C%22cargo%20test%20--only%20add%22%2C%22cargo%20test%20--%20--name%20add%22%2C%22cargo%20test%20--filter%20add%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22cargo%20test%20%E7%9B%B4%E6%8E%A5%E5%9C%A8%E5%91%BD%E4%BB%A4%E5%90%8E%E9%9D%A2%E8%B7%9F%E5%85%B3%E9%94%AE%E8%AF%8D%E5%8D%B3%E5%8F%AF%E8%BF%87%E6%BB%A4%E6%B5%8B%E8%AF%95%E5%90%8D%E7%A7%B0%E3%80%82%E5%86%99%E6%B3%95%E6%98%AF%20cargo%20test%20%3C%E5%85%B3%E9%94%AE%E8%AF%8D%3E%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E4%BB%BB%E4%BD%95%E9%A2%9D%E5%A4%96%E6%A0%87%E5%BF%97%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>  </div> 