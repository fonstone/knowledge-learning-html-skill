# 绑定与守卫

## 快速回顾：基础模式

你在前面章节已经见过基础的模式匹配：

<div class="code-runner" data-full-code="enum%20Message%20%7B%0A%20%20%20%20Quit%2C%0A%20%20%20%20Move%20%7B%20x%3A%20i32%2C%20y%3A%20i32%20%7D%2C%0A%20%20%20%20Write(String)%2C%0A%20%20%20%20Color(u8%2C%20u8%2C%20u8)%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20msg%20%3D%20Message%3A%3AMove%20%7B%20x%3A%2010%2C%20y%3A%2020%20%7D%3B%0A%0A%20%20%20%20match%20msg%20%7B%0A%20%20%20%20%20%20%20%20Message%3A%3AQuit%20%3D%3E%20println!(%22%E9%80%80%E5%87%BA%22)%2C%0A%20%20%20%20%20%20%20%20Message%3A%3AMove%20%7B%20x%2C%20y%20%7D%20%3D%3E%20println!(%22%E7%A7%BB%E5%8A%A8%E5%88%B0%20(%7B%7D%2C%20%7B%7D)%22%2C%20x%2C%20y)%2C%0A%20%20%20%20%20%20%20%20Message%3A%3AWrite(text)%20%3D%3E%20println!(%22%E5%86%99%E5%85%A5%EF%BC%9A%7B%7D%22%2C%20text)%2C%0A%20%20%20%20%20%20%20%20Message%3A%3AColor(r%2C%20g%2C%20b)%20%3D%3E%20println!(%22%E9%A2%9C%E8%89%B2%EF%BC%9A%7B%7D%20%7B%7D%20%7B%7D%22%2C%20r%2C%20g%2C%20b)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Message</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Quit</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Move</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#B392F0">    Write</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Color</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> msg </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Message</span><span style="color:#F97583">::</span><span style="color:#B392F0">Move</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 20</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> msg {</span></span>
<span class="line"><span style="color:#B392F0">        Message</span><span style="color:#F97583">::</span><span style="color:#B392F0">Quit</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"退出"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        Message</span><span style="color:#F97583">::</span><span style="color:#B392F0">Move</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"移动到 ({}, {})"</span><span style="color:#E1E4E8">, x, y),</span></span>
<span class="line"><span style="color:#B392F0">        Message</span><span style="color:#F97583">::</span><span style="color:#B392F0">Write</span><span style="color:#E1E4E8">(text) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"写入：{}"</span><span style="color:#E1E4E8">, text),</span></span>
<span class="line"><span style="color:#B392F0">        Message</span><span style="color:#F97583">::</span><span style="color:#B392F0">Color</span><span style="color:#E1E4E8">(r, g, b) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"颜色：{} {} {}"</span><span style="color:#E1E4E8">, r, g, b),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

本章讲几种进阶用法，让你处理更复杂的情况。

## @ 绑定：捕获的同时进行匹配

有时候你想**同时检测**一个值在不在某个范围内，**并且保留**这个值做后续使用。普通的范围匹配做不到：

<div class="code-runner" data-full-code="fn%20describe_score(score%3A%20u32)%20-%3E%20String%20%7B%0A%20%20%20%20match%20score%20%7B%0A%20%20%20%20%20%20%20%200..%3D59%20%3D%3E%20format!(%22%E4%B8%8D%E5%8F%8A%E6%A0%BC%EF%BC%9A%7B%7D%22%2C%20score)%2C%20%2F%2F%20%E2%9C%85%20%E7%94%A8%E5%88%B0%E4%BA%86%20score%0A%20%20%20%20%20%20%20%2060..%3D79%20%3D%3E%20format!(%22%E8%89%AF%E5%A5%BD%EF%BC%9A%7B%7D%22%2C%20score)%2C%20%20%2F%2F%20%E2%9C%85%20%E4%BD%86%E8%BF%99%E9%87%8C%20score%20%E5%8F%AA%E6%98%AF%E5%8E%9F%E5%A7%8B%E5%8F%98%E9%87%8F%0A%20%20%20%20%20%20%20%2080..%3D100%20%3D%3E%20format!(%22%E4%BC%98%E7%A7%80%EF%BC%9A%7B%7D%22%2C%20score)%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20format!(%22%E6%97%A0%E6%95%88%E5%88%86%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20score)%2C%0A%20%20%20%20%7D%0A%7D%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> describe_score</span><span style="color:#E1E4E8">(score</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> score {</span></span>
<span class="line"><span style="color:#79B8FF">        0</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">59</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"不及格：{}"</span><span style="color:#E1E4E8">, score), </span><span style="color:#6A737D">// ✅ 用到了 score</span></span>
<span class="line"><span style="color:#79B8FF">        60</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">79</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"良好：{}"</span><span style="color:#E1E4E8">, score),  </span><span style="color:#6A737D">// ✅ 但这里 score 只是原始变量</span></span>
<span class="line"><span style="color:#79B8FF">        80</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">100</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"优秀：{}"</span><span style="color:#E1E4E8">, score),</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无效分数：{}"</span><span style="color:#E1E4E8">, score),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> describe_score</span><span style="color:#E1E4E8">(score</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> score {</span></span>
<span class="line"><span style="color:#79B8FF">        0</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">59</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"不及格：{}"</span><span style="color:#E1E4E8">, score), </span><span style="color:#6A737D">// ✅ 用到了 score</span></span>
<span class="line"><span style="color:#79B8FF">        60</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">79</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"良好：{}"</span><span style="color:#E1E4E8">, score),  </span><span style="color:#6A737D">// ✅ 但这里 score 只是原始变量</span></span>
<span class="line"><span style="color:#79B8FF">        80</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">100</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"优秀：{}"</span><span style="color:#E1E4E8">, score),</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无效分数：{}"</span><span style="color:#E1E4E8">, score),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

这个可以，但模式里写的 `score` 其实是在匹配**原始变量**，不是”被匹配中的分支里的值”。当你想对**解构出来的值**同时进行范围检查并绑定时，就需要 `@` 了：

<div class="code-runner" data-full-code="fn%20categorize(n%3A%20u32)%20-%3E%20String%20%7B%0A%20%20%20%20match%20n%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%40%20%E8%AE%A9%E4%BD%A0%E5%90%8C%E6%97%B6%E5%81%9A%E4%B8%A4%E4%BB%B6%E4%BA%8B%EF%BC%9A%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E5%9C%A8%201..%3D10%EF%BC%8C%E5%B9%B6%E6%8A%8A%E5%80%BC%E7%BB%91%E5%AE%9A%E5%88%B0%20small%0A%20%20%20%20%20%20%20%20small%20%40%201..%3D10%20%3D%3E%20format!(%22%7B%7D%20%E6%98%AF%E5%B0%8F%E6%95%B0%22%2C%20small)%2C%0A%20%20%20%20%20%20%20%20big%20%40%2011..%3D100%20%3D%3E%20format!(%22%7B%7D%20%E6%98%AF%E4%B8%AD%E7%AD%89%E6%95%B0%22%2C%20big)%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20format!(%22%7B%7D%20%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%22%2C%20n)%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20categorize(5))%3B%20%20%20%2F%2F%205%20%E6%98%AF%E5%B0%8F%E6%95%B0%0A%20%20%20%20println!(%22%7B%7D%22%2C%20categorize(50))%3B%20%20%2F%2F%2050%20%E6%98%AF%E4%B8%AD%E7%AD%89%E6%95%B0%0A%20%20%20%20println!(%22%7B%7D%22%2C%20categorize(200))%3B%20%2F%2F%20200%20%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> categorize</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> n {</span></span>
<span class="line"><span style="color:#6A737D">        // @ 让你同时做两件事：检查是否在 1..=10，并把值绑定到 small</span></span>
<span class="line"><span style="color:#E1E4E8">        small </span><span style="color:#F97583">@</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">10</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 是小数"</span><span style="color:#E1E4E8">, small),</span></span>
<span class="line"><span style="color:#E1E4E8">        big </span><span style="color:#F97583">@</span><span style="color:#79B8FF"> 11</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">100</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 是中等数"</span><span style="color:#E1E4E8">, big),</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 超出范围"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">categorize</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 5 是小数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">categorize</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 50 是中等数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">categorize</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">200</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 200 超出范围</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`@ 绑定` 的语法：`名字 @ 模式`——如果 `模式` 匹配，把值绑定到 `名字`。

更复杂的例子——匹配嵌套枚举时绑定整个变体：

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Aenum%20Shape%20%7B%0A%20%20%20%20Circle%20%7B%20radius%3A%20f64%20%7D%2C%0A%20%20%20%20Rectangle%20%7B%20width%3A%20f64%2C%20height%3A%20f64%20%7D%2C%0A%7D%0A%0Afn%20area(shape%3A%20%26Shape)%20-%3E%20f64%20%7B%0A%20%20%20%20match%20shape%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%90%8C%E6%97%B6%E5%8C%B9%E9%85%8D%20Circle%20%E5%B9%B6%E6%8A%8A%E6%95%B4%E4%B8%AA%20Shape%20%E7%BB%91%E5%AE%9A%E5%88%B0%20c%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%90%8E%E9%9D%A2%E8%B0%83%E8%AF%95%E6%89%93%E5%8D%B0%0A%20%20%20%20%20%20%20%20c%20%40%20Shape%3A%3ACircle%20%7B%20radius%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20let%20a%20%3D%20std%3A%3Af64%3A%3Aconsts%3A%3API%20*%20radius%20*%20radius%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E5%A4%84%E7%90%86%20%7B%3A%3F%7D%EF%BC%8C%E9%9D%A2%E7%A7%AF%20%3D%20%7B%3A.2%7D%22%2C%20c%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20a%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Shape%3A%3ARectangle%20%7B%20width%2C%20height%20%7D%20%3D%3E%20width%20*%20height%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20Shape%3A%3ACircle%20%7B%20radius%3A%203.0%20%7D%3B%0A%20%20%20%20println!(%22%E9%9D%A2%E7%A7%AF%EF%BC%9A%7B%3A.2%7D%22%2C%20area(%26s))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Shape</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Circle</span><span style="color:#E1E4E8"> { radius</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#B392F0">    Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(shape</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Shape</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> shape {</span></span>
<span class="line"><span style="color:#6A737D">        // 同时匹配 Circle 并把整个 Shape 绑定到 c，方便后面调试打印</span></span>
<span class="line"><span style="color:#E1E4E8">        c </span><span style="color:#F97583">@</span><span style="color:#B392F0"> Shape</span><span style="color:#F97583">::</span><span style="color:#B392F0">Circle</span><span style="color:#E1E4E8"> { radius } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">f64</span><span style="color:#F97583">::</span><span style="color:#B392F0">consts</span><span style="color:#F97583">::</span><span style="color:#79B8FF">PI</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8"> radius </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> radius;</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"处理 {:?}，面积 = {:.2}"</span><span style="color:#E1E4E8">, c, a);</span></span>
<span class="line"><span style="color:#E1E4E8">            a</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Shape</span><span style="color:#F97583">::</span><span style="color:#B392F0">Rectangle</span><span style="color:#E1E4E8"> { width, height } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> width </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> height,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Shape</span><span style="color:#F97583">::</span><span style="color:#B392F0">Circle</span><span style="color:#E1E4E8"> { radius</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"面积：{:.2}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">s));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 模式守卫：在 match 分支里加条件

有时候模式本身不够精确，你需要加一个额外条件才能决定是否匹配。**模式守卫**（guard）用 `if` 关键字写在分支后面：

<div class="code-runner" data-full-code="fn%20classify_temp(celsius%3A%20f64)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20match%20celsius%20%7B%0A%20%20%20%20%20%20%20%20t%20if%20t%20%3C%200.0%20%20%20%3D%3E%20%22%E5%86%B0%E7%82%B9%E4%BB%A5%E4%B8%8B%22%2C%0A%20%20%20%20%20%20%20%20t%20if%20t%20%3C%2010.0%20%20%3D%3E%20%22%E5%AF%92%E5%86%B7%22%2C%0A%20%20%20%20%20%20%20%20t%20if%20t%20%3C%2020.0%20%20%3D%3E%20%22%E5%87%89%E7%88%BD%22%2C%0A%20%20%20%20%20%20%20%20t%20if%20t%20%3C%2030.0%20%20%3D%3E%20%22%E8%88%92%E9%80%82%22%2C%0A%20%20%20%20%20%20%20%20_%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3D%3E%20%22%E7%82%8E%E7%83%AD%22%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify_temp(-5.0))%3B%20%20%2F%2F%20%E5%86%B0%E7%82%B9%E4%BB%A5%E4%B8%8B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify_temp(5.0))%3B%20%20%20%2F%2F%20%E5%AF%92%E5%86%B7%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify_temp(25.0))%3B%20%20%2F%2F%20%E8%88%92%E9%80%82%0A%20%20%20%20println!(%22%7B%7D%22%2C%20classify_temp(35.0))%3B%20%20%2F%2F%20%E7%82%8E%E7%83%AD%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> classify_temp</span><span style="color:#E1E4E8">(celsius</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> celsius {</span></span>
<span class="line"><span style="color:#E1E4E8">        t </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0.0</span><span style="color:#F97583">   =&gt;</span><span style="color:#9ECBFF"> "冰点以下"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        t </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 10.0</span><span style="color:#F97583">  =&gt;</span><span style="color:#9ECBFF"> "寒冷"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        t </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 20.0</span><span style="color:#F97583">  =&gt;</span><span style="color:#9ECBFF"> "凉爽"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        t </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 30.0</span><span style="color:#F97583">  =&gt;</span><span style="color:#9ECBFF"> "舒适"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        _              </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "炎热"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify_temp</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">-</span><span style="color:#79B8FF">5.0</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 冰点以下</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify_temp</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5.0</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 寒冷</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify_temp</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">25.0</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 舒适</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">classify_temp</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">35.0</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 炎热</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

守卫和枚举解构组合使用：

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Astruct%20Point%20%7B%20x%3A%20i32%2C%20y%3A%20i32%20%7D%0A%0Afn%20quadrant(p%3A%20%26Point)%20-%3E%20%26str%20%7B%0A%20%20%20%20match%20p%20%7B%0A%20%20%20%20%20%20%20%20Point%20%7B%20x%2C%20y%20%7D%20if%20*x%20%3E%200%20%26%26%20*y%20%3E%200%20%3D%3E%20%22%E7%AC%AC%E4%B8%80%E8%B1%A1%E9%99%90%22%2C%0A%20%20%20%20%20%20%20%20Point%20%7B%20x%2C%20y%20%7D%20if%20*x%20%3C%200%20%26%26%20*y%20%3E%200%20%3D%3E%20%22%E7%AC%AC%E4%BA%8C%E8%B1%A1%E9%99%90%22%2C%0A%20%20%20%20%20%20%20%20Point%20%7B%20x%2C%20y%20%7D%20if%20*x%20%3C%200%20%26%26%20*y%20%3C%200%20%3D%3E%20%22%E7%AC%AC%E4%B8%89%E8%B1%A1%E9%99%90%22%2C%0A%20%20%20%20%20%20%20%20Point%20%7B%20x%2C%20y%20%7D%20if%20*x%20%3E%200%20%26%26%20*y%20%3C%200%20%3D%3E%20%22%E7%AC%AC%E5%9B%9B%E8%B1%A1%E9%99%90%22%2C%0A%20%20%20%20%20%20%20%20Point%20%7B%20x%3A%200%2C%20..%20%7D%20%7C%20Point%20%7B%20y%3A%200%2C%20..%20%7D%20%3D%3E%20%22%E5%9D%90%E6%A0%87%E8%BD%B4%E4%B8%8A%22%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20%22%E5%8E%9F%E7%82%B9%22%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20quadrant(%26Point%20%7B%20x%3A%203%2C%20y%3A%204%20%7D))%3B%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%80%E8%B1%A1%E9%99%90%0A%20%20%20%20println!(%22%7B%7D%22%2C%20quadrant(%26Point%20%7B%20x%3A%20-2%2C%20y%3A%201%20%7D))%3B%20%20%2F%2F%20%E7%AC%AC%E4%BA%8C%E8%B1%A1%E9%99%90%0A%20%20%20%20println!(%22%7B%7D%22%2C%20quadrant(%26Point%20%7B%20x%3A%200%2C%20y%3A%205%20%7D))%3B%20%20%20%2F%2F%20%E5%9D%90%E6%A0%87%E8%BD%B4%E4%B8%8A%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> quadrant</span><span style="color:#E1E4E8">(p</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> p {</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">if</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "第一象限"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">if</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "第二象限"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">if</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "第三象限"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">if</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "第四象限"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">|</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "坐标轴上"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "原点"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">quadrant</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8"> }));   </span><span style="color:#6A737D">// 第一象限</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">quadrant</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> }));  </span><span style="color:#6A737D">// 第二象限</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">quadrant</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> }));   </span><span style="color:#6A737D">// 坐标轴上</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **注意**：模式守卫的 `if` 条件在模式匹配**成功之后**才执行。如果守卫条件为假，`match` 继续尝试后面的分支。

# 解构进阶

## 嵌套结构解构

Rust 允许你在一个模式里解构多层嵌套的结构体、枚举和元组：

<div class="code-runner" data-full-code="struct%20Address%20%7B%0A%20%20%20%20city%3A%20String%2C%0A%20%20%20%20zip%3A%20String%2C%0A%7D%0A%0Astruct%20Person%20%7B%0A%20%20%20%20name%3A%20String%2C%0A%20%20%20%20age%3A%20u32%2C%0A%20%20%20%20address%3A%20Address%2C%0A%7D%0A%0Afn%20greet(p%3A%20%26Person)%20%7B%0A%20%20%20%20%2F%2F%20%E4%B8%80%E4%B8%AA%E6%A8%A1%E5%BC%8F%E8%A7%A3%E6%9E%84%E4%B8%A4%E5%B1%82%E7%BB%93%E6%9E%84%E4%BD%93%0A%20%20%20%20let%20Person%20%7B%0A%20%20%20%20%20%20%20%20name%2C%0A%20%20%20%20%20%20%20%20age%2C%0A%20%20%20%20%20%20%20%20address%3A%20Address%20%7B%20city%2C%20..%20%7D%2C%0A%20%20%20%20%20%20%20%20%2F%2F%20%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%20%E5%B5%8C%E5%A5%97%E8%A7%A3%E6%9E%84%20Address%EF%BC%8C%E5%8F%AA%E5%8F%96%20city%0A%20%20%20%20%7D%20%3D%20p%3B%0A%0A%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%7B%7D%E5%B2%81%EF%BC%8C%E6%9D%A5%E8%87%AA%7B%7D%E3%80%82%22%2C%20name%2C%20age%2C%20city)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Person%20%7B%0A%20%20%20%20%20%20%20%20name%3A%20%22Alice%22.to_string()%2C%0A%20%20%20%20%20%20%20%20age%3A%2028%2C%0A%20%20%20%20%20%20%20%20address%3A%20Address%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20city%3A%20%22%E5%8C%97%E4%BA%AC%22.to_string()%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20zip%3A%20%22100000%22.to_string()%2C%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%7D%3B%0A%20%20%20%20greet(%26p)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    city</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    zip</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    address</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> greet</span><span style="color:#E1E4E8">(p</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Person</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#6A737D">    // 一个模式解构两层结构体</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        name,</span></span>
<span class="line"><span style="color:#E1E4E8">        age,</span></span>
<span class="line"><span style="color:#E1E4E8">        address</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8"> { city, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#6A737D">        // ^^^^^^^^^^^^^^^ 嵌套解构 Address，只取 city</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> p;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，{}！{}岁，来自{}。"</span><span style="color:#E1E4E8">, name, age, city);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        name</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "Alice"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#E1E4E8">        age</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 28</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        address</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">            city</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "北京"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#E1E4E8">            zip</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "100000"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#E1E4E8">        },</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    greet</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">p);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

枚举中包含结构体的嵌套解构：

<div class="code-runner" data-full-code="enum%20Event%20%7B%0A%20%20%20%20MouseClick%20%7B%20x%3A%20i32%2C%20y%3A%20i32%20%7D%2C%0A%20%20%20%20KeyPress(char)%2C%0A%20%20%20%20Resize%20%7B%20width%3A%20u32%2C%20height%3A%20u32%20%7D%2C%0A%7D%0A%0Afn%20handle(event%3A%20%26Event)%20%7B%0A%20%20%20%20match%20event%20%7B%0A%20%20%20%20%20%20%20%20Event%3A%3AMouseClick%20%7B%20x%2C%20y%20%7D%20if%20*x%20%3E%200%20%26%26%20*y%20%3E%200%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E7%82%B9%E5%87%BB%E5%9C%A8%E6%AD%A3%E8%B1%A1%E9%99%90%EF%BC%9A(%7B%7D%2C%20%7B%7D)%22%2C%20x%2C%20y)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Event%3A%3AMouseClick%20%7B%20x%2C%20y%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E7%82%B9%E5%87%BB%E5%9C%A8%E8%B4%9F%E8%B1%A1%E9%99%90%E6%88%96%E8%BD%B4%E4%B8%8A%EF%BC%9A(%7B%7D%2C%20%7B%7D)%22%2C%20x%2C%20y)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Event%3A%3AKeyPress(c)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%8C%89%E9%94%AE%EF%BC%9A'%7B%7D'%22%2C%20c)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Event%3A%3AResize%20%7B%20width%2C%20height%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%EF%BC%9A%7B%7D%C3%97%7B%7D%22%2C%20width%2C%20height)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20handle(%26Event%3A%3AMouseClick%20%7B%20x%3A%2010%2C%20y%3A%2020%20%7D)%3B%0A%20%20%20%20handle(%26Event%3A%3AKeyPress('R'))%3B%0A%20%20%20%20handle(%26Event%3A%3AResize%20%7B%20width%3A%201920%2C%20height%3A%201080%20%7D)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Event</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    MouseClick</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#B392F0">    KeyPress</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">char</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Resize</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> handle</span><span style="color:#E1E4E8">(event</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Event</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> event {</span></span>
<span class="line"><span style="color:#B392F0">        Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">MouseClick</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">if</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> =&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"点击在正象限：({}, {})"</span><span style="color:#E1E4E8">, x, y);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">MouseClick</span><span style="color:#E1E4E8"> { x, y } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"点击在负象限或轴上：({}, {})"</span><span style="color:#E1E4E8">, x, y);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">KeyPress</span><span style="color:#E1E4E8">(c) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"按键：'{}'"</span><span style="color:#E1E4E8">, c);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">Resize</span><span style="color:#E1E4E8"> { width, height } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"窗口大小：{}×{}"</span><span style="color:#E1E4E8">, width, height);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    handle</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">MouseClick</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 20</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#B392F0">    handle</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">KeyPress</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'R'</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    handle</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">Event</span><span style="color:#F97583">::</span><span style="color:#B392F0">Resize</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1920</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1080</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## `..` 忽略剩余字段

解构结构体时，不需要的字段可以用 `..` 忽略：

<div class="code-runner" data-full-code="struct%20Config%20%7B%0A%20%20%20%20debug%3A%20bool%2C%0A%20%20%20%20timeout%3A%20u32%2C%0A%20%20%20%20retries%3A%20u32%2C%0A%20%20%20%20log_level%3A%20String%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20cfg%20%3D%20Config%20%7B%0A%20%20%20%20%20%20%20%20debug%3A%20true%2C%0A%20%20%20%20%20%20%20%20timeout%3A%2030%2C%0A%20%20%20%20%20%20%20%20retries%3A%203%2C%0A%20%20%20%20%20%20%20%20log_level%3A%20%22info%22.to_string()%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E5%85%B3%E5%BF%83%20debug%20%E5%92%8C%20timeout%EF%BC%8C%E5%85%B6%E4%BD%99%E7%94%A8%20..%20%E5%BF%BD%E7%95%A5%0A%20%20%20%20let%20Config%20%7B%20debug%2C%20timeout%2C%20..%20%7D%20%3D%20cfg%3B%0A%20%20%20%20println!(%22%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F%EF%BC%9A%7B%7D%EF%BC%8C%E8%B6%85%E6%97%B6%EF%BC%9A%7B%7Ds%22%2C%20debug%2C%20timeout)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Config</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    debug</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    timeout</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    retries</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    log_level</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> cfg </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Config</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        debug</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        timeout</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        retries</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        log_level</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "info"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只关心 debug 和 timeout，其余用 .. 忽略</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#B392F0"> Config</span><span style="color:#E1E4E8"> { debug, timeout, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> cfg;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"调试模式：{}，超时：{}s"</span><span style="color:#E1E4E8">, debug, timeout);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

元组中用 `..` 忽略头部或尾部：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20numbers%20%3D%20(1%2C%202%2C%203%2C%204%2C%205)%3B%0A%0A%20%20%20%20let%20(first%2C%20..%2C%20last)%20%3D%20numbers%3B%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%EF%BC%9A%7B%7D%EF%BC%8C%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%EF%BC%9A%7B%7D%22%2C%20first%2C%20last)%3B%20%2F%2F%201%2C%205%0A%0A%20%20%20%20let%20(a%2C%20b%2C%20..)%20%3D%20numbers%3B%0A%20%20%20%20println!(%22%E5%89%8D%E4%B8%A4%E4%B8%AA%EF%BC%9A%7B%7D%20%7B%7D%22%2C%20a%2C%20b)%3B%20%2F%2F%201%202%0A%0A%20%20%20%20let%20(..%2C%20x%2C%20y)%20%3D%20numbers%3B%0A%20%20%20%20println!(%22%E5%90%8E%E4%B8%A4%E4%B8%AA%EF%BC%9A%7B%7D%20%7B%7D%22%2C%20x%2C%20y)%3B%20%2F%2F%204%205%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (first, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8">, last) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> numbers;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个：{}，最后一个：{}"</span><span style="color:#E1E4E8">, first, last); </span><span style="color:#6A737D">// 1, 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (a, b, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> numbers;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"前两个：{} {}"</span><span style="color:#E1E4E8">, a, b); </span><span style="color:#6A737D">// 1 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">..</span><span style="color:#E1E4E8">, x, y) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> numbers;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"后两个：{} {}"</span><span style="color:#E1E4E8">, x, y); </span><span style="color:#6A737D">// 4 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## `|` 在模式中合并多个情况

用 `|` 在单个 match 分支里匹配多个模式：

<div class="code-runner" data-full-code="fn%20is_weekday(day%3A%20u8)%20-%3E%20bool%20%7B%0A%20%20%20%20matches!(day%2C%201..%3D5)%20%2F%2F%20%E7%AD%89%E4%BB%B7%E4%BA%8E%20day%20%3E%3D%201%20%26%26%20day%20%3C%3D%205%0A%7D%0A%0Afn%20day_name(day%3A%20u8)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20match%20day%20%7B%0A%20%20%20%20%20%20%20%201%20%3D%3E%20%22%E5%91%A8%E4%B8%80%22%2C%0A%20%20%20%20%20%20%20%202%20%3D%3E%20%22%E5%91%A8%E4%BA%8C%22%2C%0A%20%20%20%20%20%20%20%203%20%3D%3E%20%22%E5%91%A8%E4%B8%89%22%2C%0A%20%20%20%20%20%20%20%204%20%3D%3E%20%22%E5%91%A8%E5%9B%9B%22%2C%0A%20%20%20%20%20%20%20%205%20%3D%3E%20%22%E5%91%A8%E4%BA%94%22%2C%0A%20%20%20%20%20%20%20%206%20%7C%207%20%3D%3E%20%22%E5%91%A8%E6%9C%AB%22%2C%20%20%2F%2F%20%E7%94%A8%20%7C%20%E5%90%88%E5%B9%B6%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20%22%E6%97%A0%E6%95%88%22%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20describe_char(c%3A%20char)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20match%20c%20%7B%0A%20%20%20%20%20%20%20%20'a'..%3D'z'%20%7C%20'A'..%3D'Z'%20%3D%3E%20%22%E5%AD%97%E6%AF%8D%22%2C%20%20%20%2F%2F%20%E8%8C%83%E5%9B%B4%20%2B%20%7C%20%E7%BB%84%E5%90%88%0A%20%20%20%20%20%20%20%20'0'..%3D'9'%20%3D%3E%20%22%E6%95%B0%E5%AD%97%22%2C%0A%20%20%20%20%20%20%20%20'%20'%20%7C%20'%5Ct'%20%7C%20'%5Cn'%20%3D%3E%20%22%E7%A9%BA%E7%99%BD%22%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20%22%E5%85%B6%E4%BB%96%22%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20day_name(3))%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%91%A8%E4%B8%89%0A%20%20%20%20println!(%22%7B%7D%22%2C%20day_name(6))%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%91%A8%E6%9C%AB%0A%20%20%20%20println!(%22%7B%7D%22%2C%20describe_char('R'))%3B%20%20%2F%2F%20%E5%AD%97%E6%AF%8D%0A%20%20%20%20println!(%22%7B%7D%22%2C%20describe_char('7'))%3B%20%20%2F%2F%20%E6%95%B0%E5%AD%97%0A%20%20%20%20println!(%22%7B%7D%22%2C%20describe_char('%20'))%3B%20%2F%2F%20%E7%A9%BA%E7%99%BD%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> is_weekday</span><span style="color:#E1E4E8">(day</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    matches!</span><span style="color:#E1E4E8">(day, </span><span style="color:#79B8FF">1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">) </span><span style="color:#6A737D">// 等价于 day &gt;= 1 &amp;&amp; day &lt;= 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> day_name</span><span style="color:#E1E4E8">(day</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> day {</span></span>
<span class="line"><span style="color:#79B8FF">        1</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周一"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        2</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周二"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        3</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周三"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        4</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周四"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        5</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周五"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        6</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> 7</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "周末"</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// 用 | 合并</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "无效"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> describe_char</span><span style="color:#E1E4E8">(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> char</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> c {</span></span>
<span class="line"><span style="color:#9ECBFF">        'a'</span><span style="color:#F97583">..=</span><span style="color:#9ECBFF">'z'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'A'</span><span style="color:#F97583">..=</span><span style="color:#9ECBFF">'Z'</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "字母"</span><span style="color:#E1E4E8">,   </span><span style="color:#6A737D">// 范围 + | 组合</span></span>
<span class="line"><span style="color:#9ECBFF">        '0'</span><span style="color:#F97583">..=</span><span style="color:#9ECBFF">'9'</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "数字"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        ' '</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> '</span><span style="color:#79B8FF">\t</span><span style="color:#9ECBFF">'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> '</span><span style="color:#79B8FF">\n</span><span style="color:#9ECBFF">'</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "空白"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#9ECBFF"> "其他"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">day_name</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));         </span><span style="color:#6A737D">// 周三</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">day_name</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">));         </span><span style="color:#6A737D">// 周末</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">describe_char</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'R'</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 字母</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">describe_char</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'7'</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 数字</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">describe_char</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">' '</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 空白</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 模式匹配测验

加载题目中…

```rust
fn main() {
    let pair = (3, -2);
    let result = match pair {
        (x, y) if x == y => "相等",
        (x, y) if x + y > 0 => "和为正",
        _ => "其他",
    };
    println!("{}", result);
}
```

加载题目中…

加载题目中…

```rust
struct Config {
    width: u32,
    height: u32,
    title: String,
}
```

加载题目中…

加载题目中…

## 编程练习

用 `@` 绑定和模式守卫，写一个学生成绩评级函数：

```rust
#[derive(Debug)]
struct Student {
    name: String,
    score: u32,
}

fn grade_report(students: &[Student]) {
    for student in students {
        let grade = match student.score {
            // TODO: 使用 @ 绑定匹配分数范围并在格式化字符串中使用具体分数
            // 90..=100 → "A (分数)"
            // 80..=89  → "B (分数)"
            // 60..=79  → "C (分数)"
            // 0..=59   → "不及格 (分数)"
            // _        → "无效分数"
            _ => format!("未知 ({})", student.score),
        };
        println!("{}: {}", student.name, grade);
    }
}

fn main() {
    let students = vec![
        Student { name: "Alice".to_string(), score: 95 },
        Student { name: "Bob".to_string(), score: 82 },
        Student { name: "Carol".to_string(), score: 73 },
        Student { name: "Dave".to_string(), score: 45 },
    ];
    grade_report(&students);
}
```