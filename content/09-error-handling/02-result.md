# Result<T, E>

## 为什么需要 Result

上一篇讲了 `panic!`，用于”不应该发生”的错误。但现实中大多数错误都是**可以预料的、可以处理的**：

- 尝试打开一个文件 → 文件可能不存在
- 尝试解析一个字符串为数字 → 字符串可能不是合法的数字
- 发起网络请求 → 服务器可能临时不可用

这些情况不是 bug，是正常的程序运行中随时可能发生的事情。对这类错误调用 `panic!` 并让程序崩溃，显然不合适。

Rust 的解决方案是 **`Result<T, E>` 枚举**：让可能失败的函数在返回值里**明确表达”成功”或”失败”**，让调用者决定如何处理。

## Result 是什么

你之前学过 `Option<T>`——它表达”值可能不存在”：

```rust
enum Option<T> {
    Some(T),  // 有值
    None,     // 没有值
}
```

`Result<T, E>` 是类似的概念，但表达的是”操作可能失败”：

```rust
enum Result<T, E> {
    Ok(T),   // 成功，携带结果值
    Err(E),  // 失败，携带错误信息
}
```

`T` 是成功时的值的类型，`E` 是失败时的错误类型。比如 `File::open` 的返回类型是 `Result<File, io::Error>`——成功返回文件句柄，失败返回 IO 错误。

> **如何知道一个函数返回什么类型？** 看文档，或者直接问编译器。把返回值赋给一个错误类型的变量，编译器会在报错信息里告诉你正确的类型。

## 用 match 处理 Result

`Result` 和 `Option` 一样，需要用 `match` 明确处理两种情况。下面是打开文件的例子：

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20result%20%3D%20File%3A%3Aopen(%22hello.txt%22)%3B%0A%0A%20%20%20%20match%20result%20%7B%0A%20%20%20%20%20%20%20%20Ok(file)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%96%87%E4%BB%B6%E6%89%93%E5%BC%80%E6%88%90%E5%8A%9F%EF%BC%81%E5%8F%A5%E6%9F%84%EF%BC%9A%7B%3A%3F%7D%22%2C%20file)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Err(error)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6%E5%A4%B1%E8%B4%A5%EF%BC%8C%E5%8E%9F%E5%9B%A0%EF%BC%9A%7B%7D%22%2C%20error)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E5%8F%AF%E4%BB%A5%E5%81%9A%E6%81%A2%E5%A4%8D%E5%A4%84%E7%90%86%EF%BC%8C%E6%AF%94%E5%A6%82%E5%88%9B%E5%BB%BA%E6%96%87%E4%BB%B6%E3%80%81%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%80%BC%E3%80%81%E6%8F%90%E7%A4%BA%E7%94%A8%E6%88%B7%E7%AD%89%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> result {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(file) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件打开成功！句柄：{:?}"</span><span style="color:#E1E4E8">, file);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(error) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"打开文件失败，原因：{}"</span><span style="color:#E1E4E8">, error);</span></span>
<span class="line"><span style="color:#6A737D">            // 这里可以做恢复处理，比如创建文件、使用默认值、提示用户等</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这里 `File::open("hello.txt")` 返回 `Result<File, io::Error>`。`match` 分别处理了 `Ok` 和 `Err` 两种情况——失败时打印错误信息并继续，而不是让程序崩溃。

### 匹配不同类型的错误

有时候同一个操作可能因为不同原因失败，我们想对不同原因做不同处理。`io::Error` 有一个 `kind()` 方法可以获取错误类型：

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3A%3AFile%3B%0Ause%20std%3A%3Aio%3A%3AErrorKind%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22hello.txt%22)%3B%0A%0A%20%20%20%20let%20file%20%3D%20match%20f%20%7B%0A%20%20%20%20%20%20%20%20Ok(file)%20%3D%3E%20file%2C%0A%20%20%20%20%20%20%20%20Err(error)%20%3D%3E%20match%20error.kind()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%96%87%E4%BB%B6%E4%B8%8D%E5%AD%98%E5%9C%A8%20%E2%86%92%20%E5%88%9B%E5%BB%BA%E5%AE%83%0A%20%20%20%20%20%20%20%20%20%20%20%20ErrorKind%3A%3ANotFound%20%3D%3E%20match%20File%3A%3Acreate(%22hello.txt%22)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Ok(new_file)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%96%87%E4%BB%B6%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%8C%E5%B7%B2%E5%88%9B%E5%BB%BA%E6%96%B0%E6%96%87%E4%BB%B6%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20new_file%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20panic!(%22%E5%88%9B%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%3A%3F%7D%22%2C%20e)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%85%B6%E4%BB%96%E9%94%99%E8%AF%AF%20%E2%86%92%20%E7%9B%B4%E6%8E%A5%20panic%0A%20%20%20%20%20%20%20%20%20%20%20%20other%20%3D%3E%20panic!(%22%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6%E6%97%B6%E9%81%87%E5%88%B0%E5%85%B6%E4%BB%96%E9%94%99%E8%AF%AF%EF%BC%9A%7B%3A%3F%7D%22%2C%20other)%2C%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%E5%BE%97%E5%88%B0%E4%BA%86%E6%96%87%E4%BB%B6%E5%8F%A5%E6%9F%84%EF%BC%9A%7B%3A%3F%7D%22%2C%20file)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">ErrorKind</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> file </span><span style="color:#F97583">=</span><span style="color:#F97583"> match</span><span style="color:#E1E4E8"> f {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(file) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> file,</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(error) </span><span style="color:#F97583">=&gt;</span><span style="color:#F97583"> match</span><span style="color:#E1E4E8"> error</span><span style="color:#F97583">.</span><span style="color:#B392F0">kind</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">            // 文件不存在 → 创建它</span></span>
<span class="line"><span style="color:#B392F0">            ErrorKind</span><span style="color:#F97583">::</span><span style="color:#B392F0">NotFound</span><span style="color:#F97583"> =&gt;</span><span style="color:#F97583"> match</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">create</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">                Ok</span><span style="color:#E1E4E8">(new_file) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">                    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件不存在，已创建新文件"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">                    new_file</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#B392F0">                Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"创建文件失败：{:?}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">            },</span></span>
<span class="line"><span style="color:#6A737D">            // 其他错误 → 直接 panic</span></span>
<span class="line"><span style="color:#E1E4E8">            other </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"打开文件时遇到其他错误：{:?}"</span><span style="color:#E1E4E8">, other),</span></span>
<span class="line"><span style="color:#E1E4E8">        },</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"得到了文件句柄：{:?}"</span><span style="color:#E1E4E8">, file);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这里有三层 `match` 嵌套。虽然完整，但看起来有点繁重。

## unwrap 和 expect：快捷但有代价

`Result` 有两个便捷方法，让你不用每次都写 `match`：

**`unwrap()`**：如果是 `Ok`，返回值；如果是 `Err`，直接 panic。

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E6%96%87%E4%BB%B6%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%8C%E8%BF%99%E9%87%8C%E4%BC%9A%20panic%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22hello.txt%22).unwrap()%3B%0A%20%20%20%20println!(%22%E6%96%87%E4%BB%B6%E5%8F%A5%E6%9F%84%EF%BC%9A%7B%3A%3F%7D%22%2C%20f)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 如果文件不存在，这里会 panic</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件句柄：{:?}"</span><span style="color:#E1E4E8">, f);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**`expect("消息")`**：和 `unwrap` 一样，但 panic 时显示你提供的消息，更容易调试：

<div class="code-runner" data-full-code="use%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22hello.txt%22)%0A%20%20%20%20%20%20%20%20.expect(%22%E6%97%A0%E6%B3%95%E6%89%93%E5%BC%80%20hello.txt%EF%BC%8C%E8%AF%B7%E6%A3%80%E6%9F%A5%E6%96%87%E4%BB%B6%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%22)%3B%0A%20%20%20%20println!(%22%E6%96%87%E4%BB%B6%E5%8F%A5%E6%9F%84%EF%BC%9A%7B%3A%3F%7D%22%2C%20f)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello.txt"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">expect</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"无法打开 hello.txt，请检查文件是否存在"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"文件句柄：{:?}"</span><span style="color:#E1E4E8">, f);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**什么时候用 unwrap/expect？**

- 适合用 ：写原型、写示例、写测试代码时。此时你更关心逻辑本身，不想被错误处理分散注意力。
- 不适合用 ：生产代码中，尤其是有可能失败的操作。一旦失败就 panic，用户体验很差。

> **记住**：`unwrap` 和 `expect` 本质上是”我相信这里不会失败，如果失败就让程序崩溃”的声明。在代码审查中，看到 `unwrap` 就意味着这里需要审查：这个假设是否成立？

## 向调用者传播错误

到目前为止，我们要么用 `match` 处理错误，要么调 `panic!` 崩溃。但有第三种选择：**把错误向上传播给调用者**。

当前函数没有足够的上下文来决定怎么处理错误时，这很合理——调用者可能比被调用者更清楚应该怎么处理。

下面是一个从文件读取用户名的函数，把错误传播给调用者：

<div class="code-runner" data-full-code="use%20std%3A%3Aio%3B%0Ause%20std%3A%3Aio%3A%3ARead%3B%0Ause%20std%3A%3Afs%3A%3AFile%3B%0A%0Afn%20read_username()%20-%3E%20Result%3CString%2C%20io%3A%3AError%3E%20%7B%0A%20%20%20%20let%20f%20%3D%20File%3A%3Aopen(%22username.txt%22)%3B%0A%0A%20%20%20%20let%20mut%20file%20%3D%20match%20f%20%7B%0A%20%20%20%20%20%20%20%20Ok(file)%20%3D%3E%20file%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20return%20Err(e)%2C%20%20%2F%2F%20%E6%89%93%E5%BC%80%E5%A4%B1%E8%B4%A5%20%E2%86%92%20%E7%AB%8B%E5%8D%B3%E8%BF%94%E5%9B%9E%20Err%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20let%20mut%20name%20%3D%20String%3A%3Anew()%3B%0A%0A%20%20%20%20match%20file.read_to_string(%26mut%20name)%20%7B%0A%20%20%20%20%20%20%20%20Ok(_)%20%3D%3E%20Ok(name)%2C%20%20%20%20%2F%2F%20%E8%AF%BB%E5%8F%96%E6%88%90%E5%8A%9F%20%E2%86%92%20%E8%BF%94%E5%9B%9E%20Ok(%E5%86%85%E5%AE%B9)%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20Err(e)%2C%20%20%20%20%20%2F%2F%20%E8%AF%BB%E5%8F%96%E5%A4%B1%E8%B4%A5%20%E2%86%92%20%E8%BF%94%E5%9B%9E%20Err%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20match%20read_username()%20%7B%0A%20%20%20%20%20%20%20%20Ok(name)%20%3D%3E%20println!(%22%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%9A%7B%7D%22%2C%20name)%2C%0A%20%20%20%20%20%20%20%20Err(e)%20%3D%3E%20println!(%22%E8%AF%BB%E5%8F%96%E5%A4%B1%E8%B4%A5%EF%BC%9A%7B%7D%22%2C%20e)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">io;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Read</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, io</span><span style="color:#F97583">::</span><span style="color:#B392F0">Error</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"username.txt"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> file </span><span style="color:#F97583">=</span><span style="color:#F97583"> match</span><span style="color:#E1E4E8"> f {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(file) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> file,</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#F97583"> return</span><span style="color:#B392F0"> Err</span><span style="color:#E1E4E8">(e),  </span><span style="color:#6A737D">// 打开失败 → 立即返回 Err</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> file</span><span style="color:#F97583">.</span><span style="color:#B392F0">read_to_string</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> name) {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(_) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> Ok</span><span style="color:#E1E4E8">(name),    </span><span style="color:#6A737D">// 读取成功 → 返回 Ok(内容)</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> Err</span><span style="color:#E1E4E8">(e),     </span><span style="color:#6A737D">// 读取失败 → 返回 Err</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#B392F0"> read_username</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(name) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户名：{}"</span><span style="color:#E1E4E8">, name),</span></span>
<span class="line"><span style="color:#B392F0">        Err</span><span style="color:#E1E4E8">(e) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"读取失败：{}"</span><span style="color:#E1E4E8">, e),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意函数返回值类型 `Result<String, io::Error>`——函数**承诺**调用者：要么给你一个 `String`，要么给你一个 `io::Error`，你来决定怎么处理。

这段代码有点冗长：每个可能失败的操作都要写一遍 `match` 加 `return Err`。当一个函数里有多个可能失败的操作时，就会有很多这样的样板代码。

Rust 为此提供了一个更简洁的语法：`?` 运算符。下一篇文章会详细讲它。

# 练习题

## Result 基础测验

```rust
use std::num::ParseIntError;

fn parse_age(s: &str) -> Result<u32, ParseIntError> {
    let n: i32 = s.parse()?;
    if n < 0 {
        panic!("年龄不能为负数");
    }
    Ok(n as u32)
}
```

加载题目中…

加载题目中…

```rust
fn get_value() -> i32 {
    let result: Result<i32, String> = Ok(42);
    result
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面这个函数直接用 `unwrap` 处理所有错误。请用 `match` 改写，使其：

- 解析成功时打印结果
- 解析失败时打印”输入不是合法数字：<原因>“， 不要让程序崩溃

```rust
fn main() {
    let inputs = vec!["42", "hello", "100", "world"];

    for s in inputs {
        let n: i32 = s.parse().unwrap();  // 遇到 "hello" 会崩溃
        println!("{} 解析为 {}", s, n);
    }
}
```