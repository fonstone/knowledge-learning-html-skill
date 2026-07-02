# ? 运算符

## 问题：传播错误太繁琐

上一篇末尾，我们写了一个从文件读取用户名的函数：

```rust
fn read_username() -> Result<String, io::Error> {
    let f = File::open("username.txt");

    let mut file = match f {
        Ok(file) => file,
        Err(e) => return Err(e),  // 打开失败 → 立即返回 Err
    };

    let mut name = String::new();

    match file.read_to_string(&mut name) {
        Ok(_) => Ok(name),
        Err(e) => Err(e),
    }
}
```

函数里每个可能失败的操作都要写一遍 `match ... return Err(e)`。当一个函数里有三四个这样的操作时，代码会充斥着重复的样板。

`?` 运算符就是为了解决这个问题而生的。

## ? 的作用

在一个返回 `Result` 的表达式后面加 `?`，效果等价于：

- 如果是 Ok(value) → 解出 value ，继续执行
- 如果是 Err(e) → 立即从当前函数返回 `Err(e)`

用 `?` 改写上面的函数：

<div class="code-runner" data-full-code="use%20std%3A%3Aio%3B%0Ause%20std%3A%3Aio%3A%3ARead%3B%0Ause%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20read_username()%20-%3E%20Result%3CString%2C%20io%3A%3AError%3E%20%7B%0A%20%20%20%20let%20mut%20file%20%3D%20File%3A%3Aopen(%22username.txt%22)%3F%3B%20%20%2F%2F%20%E5%A4%B1%E8%B4%A5%E5%B0%B1%E7%AB%8B%E5%88%BB%E8%BF%94%E5%9B%9E%20Err%0A%20%20%20%20let%20mut%20name%20%3D%20String%3A%3Anew()%3B%0A%20%20%20%20file.read_to_string(%26mut%20name)%3F%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%A4%B1%E8%B4%A5%E5%B0%B1%E7%AB%8B%E5%88%BB%E8%BF%94%E5%9B%9E%20Err%0A%20%20%20%20Ok(name)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20read_username()%20%7B%0A%20%20%20%20%20%20%20%20Ok(name)%20%3D%3E%20println!(%22%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%9A%7B%7D%22%2C%20name)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%20%3D%3E%20println!(%22%E8%AF%BB%E5%8F%96%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">io;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Read</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> file </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"username.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 失败就立刻返回 Err</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    file</span><span style="color:#F97583">.</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> name)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;             </span><span style="color:#6A737D">// 失败就立刻返回 Err</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(name)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(name) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户名：{}"</span><span style="color:#E1E4E8">, name),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)   </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"读取失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对比前一个版本，代码量减少了一半，逻辑却更清晰——每行代码在说”做这件事，失败就停下来”。

还可以进一步用**链式调用**写得更短：

<div class="code-runner" data-full-code="use%20std%3A%3Aio%3B%0Ause%20std%3A%3Aio%3A%3ARead%3B%0Ause%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20read_username()%20-%3E%20Result%3CString%2C%20io%3A%3AError%3E%20%7B%0A%20%20%20%20let%20mut%20name%20%3D%20String%3A%3Anew()%3B%0A%20%20%20%20File%3A%3Aopen(%22username.txt%22)%3F.read_to_string(%26mut%20name)%3F%3B%0A%20%20%20%20Ok(name)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20read_username()%20%7B%0A%20%20%20%20%20%20%20%20Ok(name)%20%3D%3E%20println!(%22%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%9A%7B%7D%22%2C%20name)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%20%20%3D%3E%20println!(%22%E8%AF%BB%E5%8F%96%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">io;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Read</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"username.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?.</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> name)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(name)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(name) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户名：{}"</span><span style="color:#E1E4E8">, name),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e)   </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"读取失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## ? 背后的自动类型转换

`?` 和手写 `match ... return Err(e)` 有一点细微差别：**`?` 会在返回错误之前自动做类型转换**。

具体来说，`?` 内部会调用标准库的 `From` trait（`From::from(e)`），把当前错误转换成函数声明的返回错误类型。只要两种错误类型之间实现了 `From` 转换关系，`?` 就会自动完成，不需要手动处理。

> **`From` trait 暂时了解即可**：`From` 是 Rust 的标准类型转换 trait，后面讲 trait 时会详细介绍。这里只需要知道：`?` 不仅仅是提早返回，它还帮你做了错误类型的自动转换。

## ? 也能用于 Option

`?` 不只能用于 `Result`，也可以用于 `Option<T>`：

- Some(value) → 解出 value ，继续执行
- None → 立即从当前函数返回 None

<div class="code-runner" data-full-code="fn%20first_char(s%3A%20%26str)%20-%3E%20Option%3Cchar%3E%20%7B%0A%20%20%20%20let%20first%20%3D%20s.chars().next()%3F%3B%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%BA%E7%A9%BA%EF%BC%8C%E7%AB%8B%E5%88%BB%E8%BF%94%E5%9B%9E%20None%0A%20%20%20%20Some(first)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20first_char(%22hello%22))%3B%20%20%2F%2F%20Some('h')%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20first_char(%22%22))%3B%20%20%20%20%20%20%20%2F%2F%20None%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> first_char</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">char</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> first </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">.</span><span style="color:#B392F0">chars</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 如果字符串为空，立刻返回 None</span></span>
<span class="line"><span style="color:#B392F0">    Some</span><span style="color:#E1E4E8">(first)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">first_char</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// Some('h')</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">first_char</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">""</span><span style="color:#E1E4E8">));       </span><span style="color:#6A737D">// None</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **注意**：`?` 用于 `Option` 时，函数返回类型必须是 `Option`；`?` 用于 `Result` 时，函数返回类型必须是 `Result`。两者不能混用。

## ? 的使用限制：函数返回类型

`?` 只能在返回 `Result` 或 `Option` 的函数中使用。如果在 `main` 函数里直接用 `?`（`main` 默认返回 `()`），会编译报错：

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22hello.txt%22)%3F%3B%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9Amain%20%E8%BF%94%E5%9B%9E%20()%EF%BC%8C%E4%B8%8D%E6%98%AF%20Result%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 错误：main 返回 ()，不是 Result</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器会说：`?` 只能在返回 `Result` 或 `Option` 的函数里使用。

**解决方法**：让 `main` 返回 `Result`。

<div class="code-runner" data-full-code="use%20std%3A%3Aerror%3A%3AError%3B%0Ause%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20main()%20-%3E%20Result%3C()%2C%20Box%3Cdyn%20Error%3E%3E%20%7B%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22hello.txt%22)%3F%3B%0A%20%20%20%20println!(%22%E6%96%87%E4%BB%B6%E6%89%93%E5%BC%80%E6%88%90%E5%8A%9F%EF%BC%9A%7B%3A%3F%7D%22%2C%20f)%3B%0A%20%20%20%20Ok(())%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">error</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;(), </span><span style="color:#B392F0">Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Error</span><span style="color:#E1E4E8">&gt;&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件打开成功：{:?}"</span><span style="color:#E1E4E8">, f);</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">(())</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Box<dyn Error>` 是一个能装下**任意错误类型**的容器（详细原理在 trait 章节讲解），让 `main` 函数可以方便地使用 `?` 来处理各种错误。

> **程序退出码**：当 `main` 返回 `Ok(())` 时，程序退出码是 0（成功）；返回 `Err` 时，Rust 会打印错误信息并以非零退出码退出。

### 在文档测试中使用 ?

上一章讲文档注释时提到，文档代码块默认没有 `main()` 函数，也没有返回类型，不能直接用 `?`。

**为什么不能用？** `?` 需要当前函数返回 `Result` 或 `Option`，而文档测试的代码块隐式地跑在一个返回 `()` 的匿名函数里，就像这样：

```rust
// 文档测试实际上被包成这样：
fn doctest_wrapper() {
    let n: i32 = "42".parse()?;  // ❌ 编译错误：() 不支持 ?
    assert_eq!(n, 42);
}
```

**解决办法**：用 `#` 隐藏行，手动包裹一个返回 `Result` 的函数，让 `?` 有合法的上下文：

```markdown
/// # Examples
///
/// ```rust
/// # use std::error::Error;
/// # fn run() -> Result<(), Box<dyn Error>> {  // ← 隐藏：提供返回 Result 的函数
/// let n: i32 = "42".parse()?;  // ← 读者能看到这行
/// assert_eq!(n, 42);           // ← 读者能看到这行
/// # Ok(())                     // ← 隐藏：函数需要返回 Ok
/// # }                          // ← 隐藏：关闭函数
/// # run().unwrap();             // ← 隐藏：实际调用这个函数
/// ```
```

**读者看到的文档**只有两行核心代码：

```rust
let n: i32 = "42".parse()?;
assert_eq!(n, 42);
```

**`cargo test` 实际运行的代码**包含了全部（隐藏行也在）：

```rust
use std::error::Error;
fn run() -> Result<(), Box<dyn Error>> {
    let n: i32 = "42".parse()?;
    assert_eq!(n, 42);
    Ok(())
}
run().unwrap();
```

这样文档简洁，测试也能正常运行。

# 练习题

## ? 运算符测验

```rust
use std::num::ParseIntError;

fn double_number(s: &str) -> Result<i32, ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n * 2)
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…