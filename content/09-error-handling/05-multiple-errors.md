# 多种错误来源

## 遇到了什么问题

前几篇都用 `io::Error` 或 `ParseIntError` 这样的**单一错误类型**。但现实中一个函数经常遇到**多种错误来源**。比如——读取文件并解析里面的数字：

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3B%0Ause%20std%3A%3Anum%3A%3AParseIntError%3B%0A%0Afn%20double_from_file(path%3A%20%26str)%20-%3E%20Result%3Ci32%2C%20%3F%3F%3F%3E%20%7B%0A%20%20%20%20let%20content%20%3D%20fs%3A%3Aread_to_string(path)%3F%3B%20%20%2F%2F%20%E5%8F%AF%E8%83%BD%E6%98%AF%20io%3A%3AError%0A%20%20%20%20let%20n%3A%20i32%20%3D%20content.trim().parse()%3F%3B%20%20%20%20%20%2F%2F%20%E5%8F%AF%E8%83%BD%E6%98%AF%20ParseIntError%0A%20%20%20%20Ok(n%20*%202)%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fs;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double_from_file</span><span style="color:#E1E4E8">(path</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">???</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> content </span><span style="color:#F97583">=</span><span style="color:#B392F0"> fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(path)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 可能是 io::Error</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> content</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;     </span><span style="color:#6A737D">// 可能是 ParseIntError</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(n </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

返回类型 `Result<i32, ???>` 里该填什么？`io::Error` 和 `ParseIntError` 是两个不同的类型，`?` 无法同时返回两种。

## Box<dyn Error>：快速解决多种错误

`Box<dyn Error>` 是一个能容纳**任意错误类型**的容器。只要某个类型实现了 `Error` trait，就能被放进来。

> **理解 `Box<dyn Error>`**：`dyn Error` 是”实现了 Error trait 的某种类型”的意思，`Box` 是把它放在堆上（编译时不知道具体大小）。现阶段只需要知道它是个”通用错误容器”，详细原理在 trait 章节会讲。

<div class="code-runner" data-full-code="use%20std%3A%3Aerror%3A%3AError%3B%0Ause%20std%3A%3Afs%3B%0A%0Afn%20double_from_file(path%3A%20%26str)%20-%3E%20Result%3Ci32%2C%20Box%3Cdyn%20Error%3E%3E%20%7B%0A%20%20%20%20let%20content%20%3D%20fs%3A%3Aread_to_string(path)%3F%3B%20%20%2F%2F%20io%3A%3AError%20%E8%87%AA%E5%8A%A8%E8%A3%85%E5%85%A5%20Box%0A%20%20%20%20let%20n%3A%20i32%20%3D%20content.trim().parse()%3F%3B%20%20%20%20%20%2F%2F%20ParseIntError%20%E8%87%AA%E5%8A%A8%E8%A3%85%E5%85%A5%20Box%0A%20%20%20%20Ok(n%20*%202)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20double_from_file(%22number.txt%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(n)%20%20%3D%3E%20println!(%22%E7%BB%93%E6%9E%9C%EF%BC%9A%7B%7D%22%2C%20n)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">error</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fs;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double_from_file</span><span style="color:#E1E4E8">(path</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Error</span><span style="color:#E1E4E8">&gt;&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> content </span><span style="color:#F97583">=</span><span style="color:#B392F0"> fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(path)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// io::Error 自动装入 Box</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> content</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;     </span><span style="color:#6A737D">// ParseIntError 自动装入 Box</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(n </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> double_from_file</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number.txt"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(n)  </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果：{}"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`?` 会自动把 `io::Error` 和 `ParseIntError` 都转换成 `Box<dyn Error>`，不需要手动处理。

**优点**：代码极简，几乎不需要额外写任何东西。

**缺点**：调用者拿到的是一个”盒子”，无法直接判断里面是哪种错误、做精确处理（比如区分”文件不存在”和”格式不对”）。

> `Box<dyn Error>` 适合：应用程序的 `main` 函数、脚本、快速原型。**不适合**：需要让调用者精确匹配错误类型的库。

## 需要精确错误类型时怎么办

对外暴露 API 的库，往往需要让调用者能精确 `match` 不同的错误情况。这时候要**定义自己的错误枚举**，并实现三个 trait：

| Trait | 为什么需要 |
| --- | --- |
| `Display` | 控制 `{}` 打印的内容，即面向用户的错误描述 |
| `Error` | 把你的类型标记为”合法的错误类型”，`?` 和标准库才认识它 |
| `From<底层错误>` | 让 `?` 遇到 `io::Error` 时自动转成你的类型，不用手动 `map_err` |

最简单的例子：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0A%23%5Bderive(Debug)%5D%0Aenum%20AppError%20%7B%0A%20%20%20%20Io(std%3A%3Aio%3A%3AError)%2C%0A%20%20%20%20Parse(std%3A%3Anum%3A%3AParseIntError)%2C%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20AppError%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20match%20self%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20AppError%3A%3AIo(e)%20%20%20%20%3D%3E%20write!(f%2C%20%22%E6%96%87%E4%BB%B6%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20AppError%3A%3AParse(e)%20%3D%3E%20write!(f%2C%20%22%E8%A7%A3%E6%9E%90%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20std%3A%3Aerror%3A%3AError%20for%20AppError%20%7B%7D%0A%0Aimpl%20From%3Cstd%3A%3Aio%3A%3AError%3E%20for%20AppError%20%7B%0A%20%20%20%20fn%20from(e%3A%20std%3A%3Aio%3A%3AError)%20-%3E%20Self%20%7B%20AppError%3A%3AIo(e)%20%7D%0A%7D%0Aimpl%20From%3Cstd%3A%3Anum%3A%3AParseIntError%3E%20for%20AppError%20%7B%0A%20%20%20%20fn%20from(e%3A%20std%3A%3Anum%3A%3AParseIntError)%20-%3E%20Self%20%7B%20AppError%3A%3AParse(e)%20%7D%0A%7D%0A%0Afn%20double_from_file(path%3A%20%26str)%20-%3E%20Result%3Ci32%2C%20AppError%3E%20%7B%0A%20%20%20%20let%20content%20%3D%20std%3A%3Afs%3A%3Aread_to_string(path)%3F%3B%20%2F%2F%20io%3A%3AError%20%E8%87%AA%E5%8A%A8%E8%BD%AC%20AppError%3A%3AIo%0A%20%20%20%20let%20n%3A%20i32%20%3D%20content.trim().parse()%3F%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20ParseIntError%20%E8%87%AA%E5%8A%A8%E8%BD%AC%20AppError%3A%3AParse%0A%20%20%20%20Ok(n%20*%202)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20double_from_file(%22number.txt%22)%20%7B%0A%20%20%20%20%20%20%20%20Ok(n)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3D%3E%20println!(%22%E7%BB%93%E6%9E%9C%EF%BC%9A%7B%7D%22%2C%20n)%2C%0A%20%20%20%20%20%20%20%20Err(AppError%3A%3AIo(e))%20%20%20%20%3D%3E%20println!(%22%E6%96%87%E4%BB%B6%E9%97%AE%E9%A2%98%EF%BC%8C%E5%8F%AF%E9%87%8D%E8%AF%95%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%20%20%20%20Err(AppError%3A%3AParse(e))%20%3D%3E%20println!(%22%E5%86%85%E5%AE%B9%E6%A0%BC%E5%BC%8F%E9%94%99%E8%AF%AF%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> AppError</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Io</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Parse</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> AppError</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        match</span><span style="color:#79B8FF"> self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Io</span><span style="color:#E1E4E8">(e)    </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"文件错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#B392F0">            AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Parse</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"解析错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">error</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> AppError</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> From</span><span style="color:#E1E4E8">&lt;std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> AppError</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> from</span><span style="color:#E1E4E8">(e</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Io</span><span style="color:#E1E4E8">(e) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> From</span><span style="color:#E1E4E8">&lt;std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> AppError</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> from</span><span style="color:#E1E4E8">(e</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">num</span><span style="color:#F97583">::</span><span style="color:#B392F0">ParseIntError</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Parse</span><span style="color:#E1E4E8">(e) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> double_from_file</span><span style="color:#E1E4E8">(path</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">AppError</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> content </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(path)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// io::Error 自动转 AppError::Io</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> content</span><span style="color:#F97583">.</span><span style="color:#B392F0">trim</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;          </span><span style="color:#6A737D">// ParseIntError 自动转 AppError::Parse</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(n </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> double_from_file</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"number.txt"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(n)               </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果：{}"</span><span style="color:#E1E4E8">, n),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Io</span><span style="color:#E1E4E8">(e))    </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件问题，可重试：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">AppError</span><span style="color:#F97583">::</span><span style="color:#B392F0">Parse</span><span style="color:#E1E4E8">(e)) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"内容格式错误：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 这里用到了 trait 实现语法（`impl Xxx for Yyy`），目前看不懂细节很正常——trait 章节会完整讲解。这里有个印象即可，在实际项目使用到的时候再回头深入学习即可。

# 遍历 Result

## 迭代器中的错误处理

> 下面的代码用到了闭包（`|s| ...`）和迭代器（`.map()`、`.collect()` 等），这些语法会在[闭包与迭代器](#/chapters/12-closures-iterators/00-index)章节详细讲解。这里先看整体用法，理解”遇到错误时有哪些处理策略”即可，细节后续自然会清楚。

当你对一个集合做 `map` 操作时，每个元素的转换可能失败。Rust 提供了三种实用策略：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20strings%20%3D%20vec!%5B%221%22%2C%20%22%E4%B8%A4%22%2C%20%223%22%2C%20%224%22%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E7%AD%96%E7%95%A5%E4%B8%80%EF%BC%9Afilter_map%20%E2%80%94%20%E5%BF%BD%E7%95%A5%E5%A4%B1%E8%B4%A5%E9%A1%B9%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E6%88%90%E5%8A%9F%E7%9A%84%0A%20%20%20%20let%20numbers%3A%20Vec%3Ci32%3E%20%3D%20strings.iter()%0A%20%20%20%20%20%20%20%20.filter_map(%7Cs%7C%20s.parse%3A%3A%3Ci32%3E().ok())%0A%20%20%20%20%20%20%20%20.collect()%3B%0A%20%20%20%20println!(%22%E5%BF%BD%E7%95%A5%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%3A%3F%7D%22%2C%20numbers)%3B%20%20%2F%2F%20%5B1%2C%203%2C%204%5D%0A%0A%20%20%20%20%2F%2F%20%E7%AD%96%E7%95%A5%E4%BA%8C%EF%BC%9Acollect%20%E5%88%B0%20Result%20%E2%80%94%20%E9%81%87%E5%88%B0%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%A4%B1%E8%B4%A5%E5%B0%B1%E6%95%B4%E4%BD%93%E8%BF%94%E5%9B%9E%20Err%0A%20%20%20%20let%20result%3A%20Result%3CVec%3Ci32%3E%2C%20_%3E%20%3D%20strings.iter()%0A%20%20%20%20%20%20%20%20.map(%7Cs%7C%20s.parse%3A%3A%3Ci32%3E())%0A%20%20%20%20%20%20%20%20.collect()%3B%0A%20%20%20%20println!(%22%E9%81%87%E9%94%99%E5%8D%B3%E5%81%9C%EF%BC%9A%7B%3A%3F%7D%22%2C%20result)%3B%20%20%2F%2F%20Err(...)%0A%0A%20%20%20%20%2F%2F%20%E7%AD%96%E7%95%A5%E4%B8%89%EF%BC%9Apartition%20%E2%80%94%20%E6%8A%8A%E6%88%90%E5%8A%9F%E5%92%8C%E5%A4%B1%E8%B4%A5%E5%88%86%E5%BC%80%E6%94%B6%E9%9B%86%0A%20%20%20%20let%20(ok_vals%2C%20err_vals)%3A%20(Vec%3C_%3E%2C%20Vec%3C_%3E)%20%3D%20strings.iter()%0A%20%20%20%20%20%20%20%20.map(%7Cs%7C%20s.parse%3A%3A%3Ci32%3E())%0A%20%20%20%20%20%20%20%20.partition(Result%3A%3Ais_ok)%3B%0A%20%20%20%20let%20numbers%3A%20Vec%3Ci32%3E%20%3D%20ok_vals.into_iter().map(Result%3A%3Aunwrap).collect()%3B%0A%20%20%20%20let%20errors%3A%20Vec%3C_%3E%20%20%20%20%3D%20err_vals.into_iter().map(Result%3A%3Aunwrap_err).collect()%3B%0A%20%20%20%20println!(%22%E5%88%86%E5%BC%80%E6%94%B6%E9%9B%86%EF%BC%9Aok%3D%7B%3A%3F%7D%2C%20err%3D%7B%3A%3F%7D%22%2C%20numbers%2C%20errors)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> strings </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">"1"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"两"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"3"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"4"</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 策略一：filter_map — 忽略失败项，只保留成功的</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> strings</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">filter_map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">s</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;()</span><span style="color:#F97583">.</span><span style="color:#B392F0">ok</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"忽略失败：{:?}"</span><span style="color:#E1E4E8">, numbers);  </span><span style="color:#6A737D">// [1, 3, 4]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 策略二：collect 到 Result — 遇到第一个失败就整体返回 Err</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;, _&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> strings</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">s</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;())</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"遇错即停：{:?}"</span><span style="color:#E1E4E8">, result);  </span><span style="color:#6A737D">// Err(...)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 策略三：partition — 把成功和失败分开收集</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (ok_vals, err_vals)</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;_&gt;, </span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;_&gt;) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> strings</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">s</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;())</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">partition</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Result</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">is_ok);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> numbers</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> ok_vals</span><span style="color:#F97583">.</span><span style="color:#B392F0">into_iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Result</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">unwrap)</span><span style="color:#F97583">.</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> errors</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;_&gt;    </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> err_vals</span><span style="color:#F97583">.</span><span style="color:#B392F0">into_iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Result</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">unwrap_err)</span><span style="color:#F97583">.</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"分开收集：ok={:?}, err={:?}"</span><span style="color:#E1E4E8">, numbers, errors);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

三种策略各有用途：

| 策略 | 适用场景 |
| --- | --- |
| `filter_map(.ok())` | 不关心失败项，只要成功的结果 |
| `collect::<Result<Vec<_>,_>>()` | 要么全部成功，要么整体失败（数据导入等批量操作） |
| `partition(Result::is_ok)` | 既要成功结果，也要收集所有错误信息 |

# 练习题

## 多种错误来源测验

加载题目中…

加载题目中…

加载题目中…

## 编程练习

### 练习一：修复错误传播

下面这个函数无法编译，因为函数体内可能出现两种不同的错误类型，但返回类型只写了 `io::Error`。把返回类型改成能容纳任意错误的类型，使其编译通过。

```rust
use std::fs;
use std::io;

fn read_number(path: &str) -> Result<i32, io::Error> {
    let content = fs::read_to_string(path)?;
    let n: i32 = content.trim().parse()?;
    Ok(n)
}

fn main() {
    match read_number("number.txt") {
        Ok(n)  => println!("数字是 {}", n),
        Err(e) => println!("出错了：{}", e),
    }
}
```

### 练习二：用迭代器处理错误

把能转换成整数的字符串保留下来，不能转换的跳过。请用 `filter_map` 补全代码。

```rust
fn main() {
    let inputs = vec!["1", "two", "3", "四", "5"];

    // 使用 filter_map 过滤掉无法解析的，只保留成功解析的整数
    let numbers: Vec<i32> = inputs.iter()
        .filter_map(|s| s.parse::<i32>().???)
        .collect();

    println!("{:?}", numbers);
}
```