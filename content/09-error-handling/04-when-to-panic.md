# 何时 panic，何时 Result

## 核心原则

学完 `panic!` 和 `Result`，你可能会问：**这两种方式什么时候用哪个？**

答案的核心是：**错误是调用者能处理的吗？**

- 如果调用者 可以 做出合理响应（文件不存在、网络超时、输入格式不对）→ 返回 Result ，把选择权给调用者
- 如果调用者 无法 做出合理响应，继续下去只会更糟（违反了代码的不变量、不可能发生的状态出现了）→ 用 panic!

## 适合用 Result 的场景

### 任何”预期可能失败”的操作

文件读写、网络请求、用户输入解析——这些在正常运行中随时可能失败，不代表代码有 bug：

<div class="code-runner" data-full-code="use%20std%3A%3Anum%3A%3AParseIntError%3B%0A%0Afn%20parse_age(s%3A%20%26str)%20-%3E%20Result%3Cu32%2C%20ParseIntError%3E%20%7B%0A%20%20%20%20let%20n%3A%20u32%20%3D%20s.trim().parse()%3F%3B%0A%20%20%20%20Ok(n)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20parse_age(%2225%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%EF%BC%9A%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%3D%3E%20println!(%22%E6%A0%BC%E5%BC%8F%E4%B8%8D%E5%AF%B9%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%0A%20%20%20%20match%20parse_age(%22abc%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(age)%20%3D%3E%20println!(%22%E5%B9%B4%E9%BE%84%EF%BC%9A%7B%7D%22%2C%20age)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%3D%3E%20println!(%22%E6%A0%BC%E5%BC%8F%E4%B8%8D%E5%AF%B9%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(n)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"25"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄：{}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)  </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"格式不对：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> parse_age</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"abc"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄：{}"</span><span style="color:#E1E4E8">, age),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)  </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"格式不对：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

“abc” 解析失败不是 bug，是用户输入的正常变化。用 `Result` 让调用者来决定怎么处理——是重试、是使用默认值、还是显示错误提示。

## 适合 panic! 的场景

### 1. 原型和示例代码

写原型时，错误处理会让代码变得冗长，分散对核心逻辑的注意力。用 `unwrap` 先让代码跑起来，后续再完善：

<div class="code-runner" data-full-code="%2F%2F%20%E5%8E%9F%E5%9E%8B%E4%BB%A3%E7%A0%81%EF%BC%9A%E5%85%88%E8%B7%91%E8%B5%B7%E6%9D%A5%EF%BC%8C%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E5%90%8E%E7%BB%AD%E5%AE%8C%E5%96%84%0Afn%20main()%20%7B%0A%20%20%20%20let%20content%20%3D%20std%3A%3Afs%3A%3Aread_to_string(%22config.txt%22).unwrap()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20content)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 原型代码：先跑起来，错误处理后续完善</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> content </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"config.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, content);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`unwrap` 留下了一个明显的”待完善”标记，比悄悄吞掉错误或写假的错误处理要诚实。

### 2. 测试代码

测试中某个操作失败了，测试就应该失败。用 `unwrap/expect` 让测试在遇到错误时立刻报告：

```rust
#[test]
fn test_parse() {
    let n: i32 = "42".parse().expect("这个字符串应该能解析");
    assert_eq!(n, 42);
}
```

### 3. 你比编译器知道得更多

有时候你通过代码逻辑可以确定某个 `Result` 一定是 `Ok`，但编译器类型系统无法验证这一点：

<div class="code-runner" data-full-code="use%20std%3A%3Anet%3A%3AIpAddr%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%22127.0.0.1%22%20%E6%98%AF%E7%A1%AC%E7%BC%96%E7%A0%81%E7%9A%84%E5%90%88%E6%B3%95%20IP%EF%BC%8Cparse%20%E4%B8%8D%E5%8F%AF%E8%83%BD%E5%A4%B1%E8%B4%A5%0A%20%20%20%20let%20home%3A%20IpAddr%20%3D%20%22127.0.0.1%22.parse().unwrap()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20home)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">net</span><span style="color:#F97583">::</span><span style="color:#B392F0">IpAddr</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // "127.0.0.1" 是硬编码的合法 IP，parse 不可能失败</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> home</span><span style="color:#F97583">:</span><span style="color:#B392F0"> IpAddr</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "127.0.0.1"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, home);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这里 `unwrap` 是合理的——IP 字符串是代码里写死的，不是运行时的用户输入。即使这样，建议加上注释说明原因，让代码审查者知道这不是疏漏。

### 4. 代码遇到了不变量被破坏的情况

当代码检测到”这种情况不应该存在，一定是 bug”时，panic 比悄悄继续运行更好：

<div class="code-runner" data-full-code="fn%20get_element(v%3A%20%26%5Bi32%5D%2C%20index%3A%20usize)%20-%3E%20i32%20%7B%0A%20%20%20%20if%20index%20%3E%3D%20v.len()%20%7B%0A%20%20%20%20%20%20%20%20panic!(%22index%20%7B%7D%20%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%EF%BC%8C%E5%90%91%E9%87%8F%E9%95%BF%E5%BA%A6%E6%98%AF%20%7B%7D%22%2C%20index%2C%20v.len())%3B%0A%20%20%20%20%7D%0A%20%20%20%20v%5Bindex%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20get_element(%26v%2C%201))%3B%20%20%2F%2F%20%E6%AD%A3%E5%B8%B8%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20get_element(%26v%2C%205))%3B%20%20%2F%2F%20%E4%BC%9A%20panic%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_element</span><span style="color:#E1E4E8">(v</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], index</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> index </span><span style="color:#F97583">&gt;=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"index {} 超出范围，向量长度是 {}"</span><span style="color:#E1E4E8">, index, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    v[index]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_element</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">v, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 正常</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", get_element(&amp;v, 5));  // 会 panic</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 用类型系统编码不变量

有一个更优雅的思路：与其在函数内部反复检查参数合法性，不如**用类型来保证只有合法的值才能被创建**。

举个例子：假设你的程序中大量函数都需要一个”1 到 100 之间的数字”。如果直接用 `i32`，每个函数都要检查范围。

更好的做法：创建一个 `Guess` 类型，把检查放在构造时：

<div class="code-runner" data-full-code="pub%20struct%20Guess%20%7B%0A%20%20%20%20value%3A%20i32%2C%20%20%2F%2F%20private%EF%BC%8C%E5%A4%96%E9%83%A8%E6%97%A0%E6%B3%95%E7%9B%B4%E6%8E%A5%E8%AE%BE%E7%BD%AE%0A%7D%0A%0Aimpl%20Guess%20%7B%0A%20%20%20%20pub%20fn%20new(value%3A%20i32)%20-%3E%20Guess%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%3C%201%20%7C%7C%20value%20%3E%20100%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E8%BF%9D%E5%8F%8D%E4%BA%86%20Guess%20%E7%9A%84%E5%A5%91%E7%BA%A6%20%E2%86%92%20%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20bug%20%E2%86%92%20panic%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%22%E7%8C%9C%E6%B5%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E5%9C%A8%201%20%E5%88%B0%20100%20%E4%B9%8B%E9%97%B4%EF%BC%8C%E5%BE%97%E5%88%B0%E4%BA%86%20%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Guess%20%7B%20value%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20pub%20fn%20value(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20self.value%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20check_guess(guess%3A%20Guess)%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%86%8D%E6%A3%80%E6%9F%A5%E8%8C%83%E5%9B%B4%E4%BA%86%0A%20%20%20%20%2F%2F%20%E5%9B%A0%E4%B8%BA%E8%83%BD%E5%88%9B%E5%BB%BA%E5%87%BA%20Guess%EF%BC%8C%E5%B0%B1%E8%AF%B4%E6%98%8E%E5%80%BC%E4%B8%80%E5%AE%9A%E5%9C%A8%201-100%20%E4%B9%8B%E9%97%B4%0A%20%20%20%20println!(%22%E4%BD%A0%E7%8C%9C%E4%BA%86%20%7B%7D%EF%BC%8C%E5%9C%A8%E6%9C%89%E6%95%88%E8%8C%83%E5%9B%B4%E5%86%85%22%2C%20guess.value())%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20g%20%3D%20Guess%3A%3Anew(42)%3B%0A%20%20%20%20check_guess(g)%3B%0A%0A%20%20%20%20%2F%2F%20Guess%3A%3Anew(200)%3B%20%20%2F%2F%20%E8%BF%99%E8%A1%8C%E4%BC%9A%20panic%E2%80%94%E2%80%94%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20bug%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> struct</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// private，外部无法直接设置</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">            // 违反了 Guess 的契约 → 调用者的 bug → panic</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"猜测值必须在 1 到 100 之间，得到了 {}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#E1E4E8"> { value }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
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

**关键点**：

- value 字段是私有的，外部代码 必须 通过 new 创建 Guess
- new 中的检查确保了：只要一个 Guess 存在，它的值就一定合法
- 所有接受 Guess 参数的函数不再需要重复检查范围

这就是”用类型编码不变量”——把检查从”每次使用时”移到”创建时”，一次检查，处处保证。

## 总结：决策框架

| 情况 | 推荐做法 |
| --- | --- |
| 用户输入、文件读写、网络请求等预期可能失败的操作 | 返回 `Result` |
| 写原型/示例，不想被错误处理分散注意力 | `unwrap/expect` 先跑起来 |
| 测试中的断言 | `unwrap/expect` |
| 硬编码值，你确定不会失败 | `unwrap`（加注释说明原因） |
| 参数违反了契约（调用者的 bug） | `panic!` |
| 代码遇到了不可能的状态 | `panic!` |
| 提供给其他开发者使用的库 | 几乎总是返回 `Result` |

> **库的特殊情况**：如果你在写一个供他人使用的库，对外暴露的函数几乎应该总是返回 `Result`，让库的用户自己决定如何处理错误。在库的内部实现中，遇到 bug 可以 panic。

# 练习题

## 决策测验

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的函数签名已经改为返回 `Result<u32, String>`，但函数体里还在用 `panic!`。请将两处 `panic!` 改为返回 `Err(...)`，并把最后的返回值改为 `Ok(...)`，使代码能正常运行。

```rust
fn parse_age(s: &str) -> Result<u32, String> {
    let n: i32 = match s.trim().parse() {
        Ok(n)  => n,
        Err(e) => panic!("解析失败：{}", e),
    };
    if n < 0 || n > 150 {
        panic!("年龄 {} 不在有效范围内", n);
    }
    n as u32
}

fn main() {
    println!("{:?}", parse_age("25"));
    // 下面这行目前会 panic，改好后应该打印错误信息
    // println!("{:?}", parse_age("abc"));
}
```