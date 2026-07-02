<h1 id="何时-panic何时-result">何时 panic，何时 Result</h1>
<h2 id="核心原则">核心原则</h2>
<p>学完 <code>panic!</code> 和 <code>Result</code>，你可能会问：<strong class="strong-star">这两种方式什么时候用哪个？</strong></p>
<p>答案的核心是：<strong class="strong-star">错误是调用者能处理的吗？</strong></p>
<ul>
<li>如果调用者<strong class="strong-star">可以</strong>做出合理响应（文件不存在、网络超时、输入格式不对）→ 返回 <code>Result</code>，把选择权给调用者</li>
<li>如果调用者<strong class="strong-star">无法</strong>做出合理响应，继续下去只会更糟（违反了代码的不变量、不可能发生的状态出现了）→ 用 <code>panic!</code></li>
</ul>
<h2 id="适合用-result-的场景">适合用 Result 的场景</h2>
<h3 id="任何预期可能失败的操作">任何”预期可能失败”的操作</h3>
<p>文件读写、网络请求、用户输入解析——这些在正常运行中随时可能失败，不代表代码有 bug：</p>
<div class="code-runner" data-mode="run" data-full-code="use%20std%3A%3Anum%3A%3AParseIntError%3B%0A%0Afn%20parse_age(s%3A%20%26str)%20-%3E%20Result%3Cu32%2C%20ParseIntError%3E%20%7B%0A%20%20%20%20let%20n%3A%20u32%20%3D%20s.trim().parse()%3F%3B%0A%20%20%20%20Ok(n)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20parse_age(%2225%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%EF%BC%9A%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%3D%3E%20println!(%22%E6%A0%BC%E5%BC%8F%E4%B8%8D%E5%AF%B9%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20match%20parse_age(%22abc%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%EF%BC%9A%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%3D%3E%20println!(%22%E6%A0%BC%E5%BC%8F%E4%B8%8D%E5%AF%B9%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8"><</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(n)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"25"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=></span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄：{}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)  </span><span style="color:#F97583">=></span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"格式不对：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"abc"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=></span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄：{}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)  </span><span style="color:#F97583">=></span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"格式不对：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p>“abc” 解析失败不是 bug，是用户输入的正常变化。用 <code>Result</code> 让调用者来决定怎么处理——是重试、是使用默认值、还是显示错误提示。</p>
<h2 id="适合-panic-的场景">适合 panic! 的场景</h2>
<h3 id="1-原型和示例代码">1. 原型和示例代码</h3>
<p>写原型时，错误处理会让代码变得冗长，分散对核心逻辑的注意力。用 <code>unwrap</code> 先让代码跑起来，后续再完善：</p>
<div class="code-runner" data-mode="run" data-full-code="%2F%2F%20%E5%8E%9F%E5%9E%8B%E4%BB%A3%E7%A0%81%EF%BC%9A%E5%85%88%E8%B7%91%E8%B5%B7%E6%9D%A5%EF%BC%8C%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E5%90%8E%E7%BB%AD%E5%AE%8C%E5%96%84%0Afn%20main()%20%7B%0A%20%20%20%20let%20content%20%3D%20std%3A%3Afs%3A%3Aread_to_string(%22config.txt%22).unwrap()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20content)%3B%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 原型代码：先跑起来，错误处理后续完善</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> content </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"config.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, content);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p><code>unwrap</code> 留下了一个明显的”待完善”标记，比悄悄吞掉错误或写假的错误处理要诚实。</p>
<h3 id="2-测试代码">2. 测试代码</h3>
<p>测试中某个操作失败了，测试就应该失败。用 <code>unwrap/expect</code> 让测试在遇到错误时立刻报告：</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="rust"><code><span class="line"><span style="color:#E1E4E8">#[test]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> test_parse</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "42"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这个字符串应该能解析"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    assert_eq!</span><span style="color:#E1E4E8">(n, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<h3 id="3-你比编译器知道得更多">3. 你比编译器知道得更多</h3>
<p>有时候你通过代码逻辑可以确定某个 <code>Result</code> 一定是 <code>Ok</code>，但编译器类型系统无法验证这一点：</p>
<div class="code-runner" data-mode="run" data-full-code="use%20std%3A%3Anet%3A%3AIpAddr%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%22127.0.0.1%22%20%E6%98%AF%E7%A1%AC%E7%BC%96%E7%A0%81%E7%9A%84%E5%90%88%E6%B3%95%20IP%EF%BC%8Cparse%20%E4%B8%8D%E5%8F%AF%E8%83%BD%E5%A4%B1%E8%B4%A5%0A%20%20%20%20let%20home%3A%20IpAddr%20%3D%20%22127.0.0.1%22.parse().unwrap()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20home)%3B%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">net</span><span style="color:#F97583">::</span><span style="color:#B392F0">IpAddr</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // "127.0.0.1" 是硬编码的合法 IP，parse 不可能失败</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> home</span><span style="color:#F97583">:</span><span style="color:#B392F0"> IpAddr</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "127.0.0.1"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, home);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p>这里 <code>unwrap</code> 是合理的——IP 字符串是代码里写死的，不是运行时的用户输入。即使这样，建议加上注释说明原因，让代码审查者知道这不是疏漏。</p>
<h3 id="4-代码遇到了不变量被破坏的情况">4. 代码遇到了不变量被破坏的情况</h3>
<p>当代码检测到”这种情况不应该存在，一定是 bug”时，panic 比悄悄继续运行更好：</p>
<div class="code-runner" data-mode="run" data-full-code="fn%20get_element(v%3A%20%26%5Bi32%5D%2C%20index%3A%20usize)%20-%3E%20i32%20%7B%0A%20%20%20%20if%20index%20%3E%3D%20v.len()%20%7B%0A%20%20%20%20%20%20%20%20panic!(%22index%20%7B%7D%20%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%EF%BC%8C%E5%90%91%E9%87%8F%E9%95%BF%E5%BA%A6%E6%98%AF%20%7B%7D%22%2C%20index%2C%20v.len())%3B%0A%20%20%20%20%7D%0A%20%20%20%20v%5Bindex%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20get_element(%26v%2C%201))%3B%20%20%2F%2F%20%E6%AD%A3%E5%B8%B8%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20get_element(%26v%2C%205))%3B%20%20%2F%2F%20%E4%BC%9A%20panic%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_element</span><span style="color:#E1E4E8">(v</span><span style="color:#F97583">:</span><span style="color:#F97583"> &</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], index</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> index </span><span style="color:#F97583">>=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"index {} 超出范围，向量长度是 {}"</span><span style="color:#E1E4E8">, index, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    v[index]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_element</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&</span><span style="color:#E1E4E8">v, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 正常</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", get_element(&v, 5));  // 会 panic</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<h2 id="用类型系统编码不变量">用类型系统编码不变量</h2>
<p>有一个更优雅的思路：与其在函数内部反复检查参数合法性，不如<strong class="strong-star">用类型来保证只有合法的值才能被创建</strong>。</p>
<p>举个例子：假设你的程序中大量函数都需要一个”1 到 100 之间的数字”。如果直接用 <code>i32</code>，每个函数都要检查范围。</p>
<p>更好的做法：创建一个 <code>Guess</code> 类型，把检查放在构造时：</p>
<div class="code-runner" data-mode="run" data-full-code="pub%20struct%20Guess%20%7B%0A%20%20%20%20value%3A%20i32%2C%20%20%2F%2F%20private%EF%BC%8C%E5%A4%96%E9%83%A8%E6%97%A0%E6%B3%95%E7%9B%B4%E6%8E%A5%E8%AE%BE%E7%BD%AE%0A%7D%0A%0Aimpl%20Guess%20%7B%0A%20%20%20%20pub%20fn%20new(value%3A%20i32)%20-%3E%20Guess%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%3C%201%20%7C%7C%20value%20%3E%20100%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E8%BF%9D%E5%8F%8D%E4%BA%86%20Guess%20%E7%9A%84%E5%A5%91%E7%BA%A6%20%E2%86%92%20%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20bug%20%E2%86%92%20panic%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%22%E7%8C%9C%E6%B5%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E5%9C%A8%201%20%E5%88%B0%20100%20%E4%B9%8B%E9%97%B4%EF%BC%8C%E5%BE%97%E5%88%B0%E4%BA%86%20%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Guess%20%7B%20value%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20pub%20fn%20value(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20self.value%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20check_guess(guess%3A%20Guess)%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%86%8D%E6%A3%80%E6%9F%A5%E8%8C%83%E5%9B%B4%E4%BA%86%0A%20%20%20%20%2F%2F%20%E5%9B%A0%E4%B8%BA%E8%83%BD%E5%88%9B%E5%BB%BA%E5%87%BA%20Guess%EF%BC%8C%E5%B0%B1%E8%AF%B4%E6%98%8E%E5%80%BC%E4%B8%80%E5%AE%9A%E5%9C%A8%201-100%20%E4%B9%8B%E9%97%B4%0A%20%20%20%20println!(%22%E4%BD%A0%E7%8C%9C%E4%BA%86%20%7B%7D%EF%BC%8C%E5%9C%A8%E6%9C%89%E6%95%88%E8%8C%83%E5%9B%B4%E5%86%85%22%2C%20guess.value())%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20g%20%3D%20Guess%3A%3Anew(42)%3B%0A%20%20%20%20check_guess(g)%3B%0A%0A%20%20%20%20%2F%2F%20Guess%3A%3Anew(200)%3B%20%20%2F%2F%20%E8%BF%99%E8%A1%8C%E4%BC%9A%20panic%E2%80%94%E2%80%94%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20bug%0A%7D"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> struct</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// private，外部无法直接设置</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583"><</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">            // 违反了 Guess 的契约 → 调用者的 bug → panic</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"猜测值必须在 1 到 100 之间，得到了 {}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#E1E4E8"> { value }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">value</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> check_guess</span><span style="color:#E1E4E8">(guess</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#6A737D">    // 这里不需要再检查范围了</span></span>
<span class="line"><span style="color:#6A737D">    // 因为能创建出 Guess，就说明值一定在 1-100 之间</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你猜了 {}，在有效范围内"</span><span style="color:#E1E4E8">, guess</span><span style="color:#F97583">.</span><span style="color:#B392F0">value</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> g </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Guess</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    check_guess</span><span style="color:#E1E4E8">(g);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // Guess::new(200);  // 这行会 panic——调用者的 bug</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>
<p><strong class="strong-star">关键点</strong>：</p>
<ul>
<li><code>value</code> 字段是私有的，外部代码<strong class="strong-star">必须</strong>通过 <code>new</code> 创建 <code>Guess</code></li>
<li><code>new</code> 中的检查确保了：只要一个 <code>Guess</code> 存在，它的值就一定合法</li>
<li>所有接受 <code>Guess</code> 参数的函数不再需要重复检查范围</li>
</ul>
<p>这就是”用类型编码不变量”——把检查从”每次使用时”移到”创建时”，一次检查，处处保证。</p>
<h2 id="总结决策框架">总结：决策框架</h2>





































<table><thead><tr><th>情况</th><th>推荐做法</th></tr></thead><tbody><tr><td>用户输入、文件读写、网络请求等预期可能失败的操作</td><td>返回 <code>Result</code></td></tr><tr><td>写原型/示例，不想被错误处理分散注意力</td><td><code>unwrap/expect</code> 先跑起来</td></tr><tr><td>测试中的断言</td><td><code>unwrap/expect</code></td></tr><tr><td>硬编码值，你确定不会失败</td><td><code>unwrap</code>（加注释说明原因）</td></tr><tr><td>参数违反了契约（调用者的 bug）</td><td><code>panic!</code></td></tr><tr><td>代码遇到了不可能的状态</td><td><code>panic!</code></td></tr><tr><td>提供给其他开发者使用的库</td><td>几乎总是返回 <code>Result</code></td></tr></tbody></table>
<blockquote>
<p><strong class="strong-star">库的特殊情况</strong>：如果你在写一个供他人使用的库，对外暴露的函数几乎应该总是返回 <code>Result</code>，让库的用户自己决定如何处理错误。在库的内部实现中，遇到 bug 可以 panic。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="决策测验">决策测验</h2>
<div class="quiz-choice" data-kind="single" data-block-id="09-error-handling/04-when-to-panic#1:0" data-payload="%7B%22question%22%3A%22%E4%BD%A0%E5%9C%A8%E5%86%99%E4%B8%80%E4%B8%AA%E8%A7%A3%E6%9E%90%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%9A%84%E5%BA%93%E5%87%BD%E6%95%B0%EF%BC%8C%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F%E5%8F%AF%E8%83%BD%E4%B8%8D%E5%90%88%E6%B3%95%E3%80%82%E5%BA%94%E8%AF%A5%E6%80%8E%E4%B9%88%E5%A4%84%E7%90%86%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%94%E5%9B%9E%20Result%3A%3AErr%EF%BC%8C%E8%AE%A9%E8%B0%83%E7%94%A8%E8%80%85%E5%86%B3%E5%AE%9A%E6%98%AF%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E3%80%81%E6%8A%A5%E9%94%99%E9%80%80%E5%87%BA%E8%BF%98%E6%98%AF%E6%8F%90%E7%A4%BA%E7%94%A8%E6%88%B7%22%2C%22%E4%B8%8D%E5%A4%84%E7%90%86%EF%BC%8C%E8%AE%A9%E7%A8%8B%E5%BA%8F%E7%BB%A7%E7%BB%AD%E8%BF%90%E8%A1%8C%22%2C%22%E7%94%A8%20unwrap%20%E5%A4%84%E7%90%86%EF%BC%8C%E5%9B%A0%E4%B8%BA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E9%80%9A%E5%B8%B8%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%22%2C%22%E8%B0%83%E7%94%A8%20panic!%20%E8%AE%A9%E7%A8%8B%E5%BA%8F%E7%AB%8B%E5%88%BB%E5%B4%A9%E6%BA%83%EF%BC%8C%E5%9B%A0%E4%B8%BA%E9%85%8D%E7%BD%AE%E4%B8%8D%E5%90%88%E6%B3%95%E6%98%AF%E4%B8%A5%E9%87%8D%E9%97%AE%E9%A2%98%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F%E4%B8%8D%E5%90%88%E6%B3%95%E6%98%AF%5C%22%E9%A2%84%E6%9C%9F%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%5C%22%E7%9A%84%E6%83%85%E5%86%B5%EF%BC%8C%E4%B8%8D%E6%98%AF%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20bug%E3%80%82%E5%BA%93%E5%87%BD%E6%95%B0%E5%BA%94%E8%AF%A5%E8%BF%94%E5%9B%9E%20Err%EF%BC%8C%E8%AE%A9%E8%B0%83%E7%94%A8%E6%96%B9%E5%86%B3%E5%AE%9A%E5%BA%94%E5%AF%B9%E7%AD%96%E7%95%A5%E2%80%94%E2%80%94%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%80%BC%E3%80%81%E8%AE%B0%E5%BD%95%E6%97%A5%E5%BF%97%E3%80%81%E8%BF%98%E6%98%AF%E9%80%80%E5%87%BA%E7%A8%8B%E5%BA%8F%E3%80%82panic%20%E4%BC%9A%E5%89%A5%E5%A4%BA%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%E9%80%89%E6%8B%A9%E6%9D%83%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="single" data-block-id="09-error-handling/04-when-to-panic#1:1" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%B8%AA%E5%9C%BA%E6%99%AF%E6%9C%80%E9%80%82%E5%90%88%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%20unwrap()%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%AF%BB%E5%8F%96%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E7%9A%84%E9%87%8D%E8%A6%81%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%22%2C%22%E6%B5%8B%E8%AF%95%E5%87%BD%E6%95%B0%E4%B8%AD%E6%96%AD%E8%A8%80%E6%9F%90%E4%B8%AA%E5%B7%B2%E7%9F%A5%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%93%8D%E4%BD%9C%E7%BB%93%E6%9E%9C%22%2C%22%E8%A7%A3%E6%9E%90%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B8%AD%E7%94%A8%E6%88%B7%E6%8F%90%E4%BA%A4%E7%9A%84%20JSON%20%E6%95%B0%E6%8D%AE%22%2C%22%E5%BA%93%E5%87%BD%E6%95%B0%E4%B8%AD%E8%A7%A3%E6%9E%90%E5%A4%96%E9%83%A8%E4%BC%A0%E5%85%A5%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%8F%82%E6%95%B0%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81%E4%B8%AD%EF%BC%8C%E5%A6%82%E6%9E%9C%E4%B8%80%E4%B8%AA%E6%93%8D%E4%BD%9C%E5%A4%B1%E8%B4%A5%E4%BA%86%EF%BC%8C%E6%B5%8B%E8%AF%95%E6%9C%AC%E6%9D%A5%E5%B0%B1%E5%BA%94%E8%AF%A5%E5%A4%B1%E8%B4%A5%EF%BC%88panic%EF%BC%89%EF%BC%8C%E6%89%80%E4%BB%A5%20unwrap%20%E6%98%AF%E5%90%88%E9%80%82%E7%9A%84%E3%80%82%E5%85%B6%E4%BB%96%E4%B8%89%E7%A7%8D%E6%83%85%E5%86%B5%E9%83%BD%E6%98%AF%E5%8F%AF%E8%83%BD%E5%A4%B1%E8%B4%A5%E7%9A%84%E6%AD%A3%E5%B8%B8%E6%93%8D%E4%BD%9C%EF%BC%8C%E5%BA%94%E8%AF%A5%E7%94%A8%20Result%20%E5%B9%B6%E7%BB%99%E8%B0%83%E7%94%A8%E8%80%85%E6%9C%BA%E4%BC%9A%E5%A4%84%E7%90%86%E9%94%99%E8%AF%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-kind="multi" data-block-id="09-error-handling/04-when-to-panic#1:2" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E7%AC%A6%E5%90%88%20Rust%20%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E7%9A%84%E6%8E%A8%E8%8D%90%E5%AE%9E%E8%B7%B5%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22%E7%94%9F%E4%BA%A7%E4%BB%A3%E7%A0%81%E4%B8%AD%20unwrap%20%E6%98%AF%E5%90%88%E7%90%86%E7%9A%84%EF%BC%8C%E5%9B%A0%E4%B8%BA%E7%A8%8B%E5%BA%8F%E5%91%98%E7%9F%A5%E9%81%93%E4%BB%A3%E7%A0%81%E9%80%BB%E8%BE%91%22%2C%22%E5%A6%82%E6%9E%9C%E4%BD%A0%E5%86%99%E7%9A%84%E6%98%AF%E5%BA%93%EF%BC%8C%E5%AF%B9%E5%A4%96%E6%8E%A5%E5%8F%A3%E5%BA%94%E8%AF%A5%E5%87%A0%E4%B9%8E%E6%80%BB%E6%98%AF%E8%BF%94%E5%9B%9E%20Result%22%2C%22%E5%9C%A8%E7%A1%AE%E8%AE%A4%E6%9F%90%E5%80%BC%E4%B8%80%E5%AE%9A%E5%90%88%E6%B3%95%E6%97%B6%EF%BC%8C%E5%8F%AF%E4%BB%A5%E7%94%A8%20unwrap%20%E5%B9%B6%E5%8A%A0%E6%B3%A8%E9%87%8A%E8%AF%B4%E6%98%8E%E7%90%86%E7%94%B1%22%2C%22panic!%20%E5%92%8C%E8%BF%94%E5%9B%9E%20Err%20%E5%AF%B9%E8%B0%83%E7%94%A8%E8%80%85%E6%9D%A5%E8%AF%B4%E6%95%88%E6%9E%9C%E4%B8%80%E6%A0%B7%EF%BC%8C%E5%8F%AF%E4%BB%A5%E9%9A%8F%E6%84%8F%E9%80%89%E6%8B%A9%22%2C%22%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E9%94%99%E8%AF%AF%EF%BC%88%E6%96%87%E4%BB%B6%E4%B8%8D%E5%AD%98%E5%9C%A8%E3%80%81%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%E7%AD%89%EF%BC%89%E5%BA%94%E8%AF%A5%E7%94%A8%20Result%20%E4%BC%A0%E6%92%AD%22%5D%2C%22correct%22%3A%5B1%2C2%2C4%5D%2C%22explanation%22%3A%22%E6%A0%B8%E5%BF%83%E5%8E%9F%E5%88%99%E6%98%AF%EF%BC%9A%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%E9%94%99%E8%AF%AF%E7%94%A8%20Result%EF%BC%8C%E4%B8%8D%E5%8F%AF%E6%81%A2%E5%A4%8D%E7%9A%84%20bug%20%E7%94%A8%20panic%E3%80%82%E5%BA%93%E4%BB%A3%E7%A0%81%E8%A6%81%E5%B0%BD%E9%87%8F%E8%BF%94%E5%9B%9E%20Result%20%E4%BF%9D%E6%8C%81%E7%81%B5%E6%B4%BB%E6%80%A7%E3%80%82unwrap%20%E5%9C%A8%E6%9C%89%E6%98%8E%E7%A1%AE%E9%80%BB%E8%BE%91%E4%BF%9D%E8%AF%81%E6%97%B6%E6%89%8D%E5%90%88%E7%90%86%EF%BC%8C%E7%94%9F%E4%BA%A7%E4%BB%A3%E7%A0%81%E4%B8%AD%E7%9A%84%20unwrap%20%E9%80%9A%E5%B8%B8%E6%98%AF%E6%BD%9C%E5%9C%A8%E9%A3%8E%E9%99%A9%E7%82%B9%E3%80%82panic%20%E5%92%8C%20Err%20%E5%AF%B9%E8%B0%83%E7%94%A8%E8%80%85%E6%95%88%E6%9E%9C%E5%AE%8C%E5%85%A8%E4%B8%8D%E5%90%8C%E2%80%94%E2%80%94panic%20%E6%97%A0%E6%B3%95%E8%A2%AB%E8%B0%83%E7%94%A8%E8%80%85%E5%A4%84%E7%90%86%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="编程练习">编程练习</h2>
<p>下面的函数签名已经改为返回 <code>Result<u32, String></code>，但函数体里还在用 <code>panic!</code>。请将两处 <code>panic!</code> 改为返回 <code>Err(...)</code>，并把最后的返回值改为 <code>Ok(...)</code>，使代码能正常运行。</p>
<div class="code-editor" data-block-id="09-error-handling/04-when-to-panic#1:3" data-starter-code="fn%20parse_age(s%3A%20%26str)%20-%3E%20Result%3Cu32%2C%20String%3E%20%7B%0A%20%20%20%20let%20n%3A%20i32%20%3D%20match%20s.trim().parse()%20%7B%0A%20%20%20%20%20%20%20%20Ok(n)%20%20%3D%3E%20n%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20panic!(%22%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%3B%0A%20%20%20%20if%20n%20%3C%200%20%7C%7C%20n%20%3E%20150%20%7B%0A%20%20%20%20%20%20%20%20panic!(%22%E5%B9%B4%E9%BE%84%20%7B%7D%20%E4%B8%8D%E5%9C%A8%E6%9C%89%E6%95%88%E8%8C%83%E5%9B%B4%E5%86%85%22%2C%20n)%3B%0A%20%20%20%20%7D%0A%20%20%20%20n%20as%20u32%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20parse_age(%2225%22))%3B%0A%20%20%20%20%2F%2F%20%E4%B8%8B%E9%9D%A2%E8%BF%99%E8%A1%8C%E7%9B%AE%E5%89%8D%E4%BC%9A%20panic%EF%BC%8C%E6%94%B9%E5%A5%BD%E5%90%8E%E5%BA%94%E8%AF%A5%E6%89%93%E5%8D%B0%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF%0A%20%20%20%20%2F%2F%20println!(%22%7B%3A%3F%7D%22%2C%20parse_age(%22abc%22))%3B%0A%7D" data-expect-mode="literal" data-expect-pattern="Ok(25)%0AErr(%22%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%EF%BC%9Ainvalid%20digit%20found%20in%20string%22)"><pre class="code-editor-fallback"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-></span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8"><</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> match</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(n)  </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> n,</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=></span><span style="color:#B392F0"> panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"解析失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583"><</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 150</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄 {} 不在有效范围内"</span><span style="color:#E1E4E8">, n);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    n </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u32</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">parse_age</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"25"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#6A737D">    // 下面这行目前会 panic，改好后应该打印错误信息</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{:?}", parse_age("abc"));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div> </div>  </div> 