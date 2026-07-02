# if let：match 的简洁写法

有时候，你用 `match` 只想处理**一个特定的情况**，其他情况都无需特殊处理。这时 `if let` 提供了更简洁的语法。

## match vs if let

假设你只想在 `Option` 有值时做某事：

<div class="code-runner" data-full-code="%2F%2F%20%E4%BD%BF%E7%94%A8%20match%EF%BC%88%E7%9B%B8%E5%AF%B9%E5%86%97%E9%95%BF%EF%BC%89%0Alet%20config_max%20%3D%20Some(3u8)%3B%0A%0Amatch%20config_max%20%7B%0A%20%20%20%20Some(max)%20%3D%3E%20println!(%22%E6%9C%80%E5%A4%A7%E5%80%BC%E9%85%8D%E7%BD%AE%E4%B8%BA%20%7B%7D%22%2C%20max)%2C%0A%20%20%20%20_%20%3D%3E%20()%2C%20%20%2F%2F%20%E4%BB%80%E4%B9%88%E9%83%BD%E4%B8%8D%E5%81%9A%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 使用 match（相对冗长）</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> config_max </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">match</span><span style="color:#E1E4E8"> config_max {</span></span>
<span class="line"><span style="color:#B392F0">    Some</span><span style="color:#E1E4E8">(max) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大值配置为 {}"</span><span style="color:#E1E4E8">, max),</span></span>
<span class="line"><span style="color:#E1E4E8">    _ </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> (),  </span><span style="color:#6A737D">// 什么都不做</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

用 `if let` 简化：

<div class="code-runner" data-full-code="%2F%2F%20%E4%BD%BF%E7%94%A8%20if%20let%EF%BC%88%E6%9B%B4%E7%AE%80%E6%B4%81%EF%BC%89%0Alet%20config_max%20%3D%20Some(3u8)%3B%0A%0Aif%20let%20Some(max)%20%3D%20config_max%20%7B%0A%20%20%20%20println!(%22%E6%9C%80%E5%A4%A7%E5%80%BC%E9%85%8D%E7%BD%AE%E4%B8%BA%20%7B%7D%22%2C%20max)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 使用 if let（更简洁）</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> config_max </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(max) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> config_max {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最大值配置为 {}"</span><span style="color:#E1E4E8">, max);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键差异：**

- match 必须穷尽所有情况
- if let 只关心一个模式是否匹配， 其他情况隐含地忽略 （相当于自动加了 _ => {} ）

> **重要**：`if let` 确实”绕过”了穷尽性检查，但这是有意的设计。当你只关心某一种情况时，不需要为其他情况写冗长的 `_ => {}` 分支。比如上面的例子，你只想在配置有值时处理，不关心 `None` 的情况——这时 `if let` 就很合适。

## if let 的语法

```rust
if let 模式 = 表达式 {
    // 模式匹配时执行
}
```

注意：是 `=` 而不是 `match`。

## 实际例子

<div class="code-runner" data-full-code="enum%20Status%20%7B%0A%20%20%20%20Done%2C%0A%20%20%20%20Working%20%7B%20progress%3A%20u32%20%7D%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20status%20%3D%20Status%3A%3AWorking%20%7B%20progress%3A%2050%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%20match%0A%20%20%20%20match%20status%20%7B%0A%20%20%20%20%20%20%20%20Status%3A%3AWorking%20%7B%20progress%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E8%BF%9B%E5%BA%A6%EF%BC%9A%7B%7D%25%22%2C%20progress)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20%7B%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%20if%20let%EF%BC%88%E6%9B%B4%E6%B8%85%E6%99%B0%EF%BC%89%0A%20%20%20%20if%20let%20Status%3A%3AWorking%20%7B%20progress%20%7D%20%3D%20status%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E8%BF%9B%E5%BA%A6%EF%BC%9A%7B%7D%25%22%2C%20progress)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Status</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Done</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Working</span><span style="color:#E1E4E8"> { progress</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> status </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Status</span><span style="color:#F97583">::</span><span style="color:#B392F0">Working</span><span style="color:#E1E4E8"> { progress</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 50</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用 match</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> status {</span></span>
<span class="line"><span style="color:#B392F0">        Status</span><span style="color:#F97583">::</span><span style="color:#B392F0">Working</span><span style="color:#E1E4E8"> { progress } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"进度：{}%"</span><span style="color:#E1E4E8">, progress);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用 if let（更清晰）</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Status</span><span style="color:#F97583">::</span><span style="color:#B392F0">Working</span><span style="color:#E1E4E8"> { progress } </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> status {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"进度：{}%"</span><span style="color:#E1E4E8">, progress);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## if let … else

`if let` 可以配合 `else`，处理模式不匹配的情况：

<div class="code-runner" data-full-code="let%20favorite_color%3A%20Option%3C%26str%3E%20%3D%20Some(%22%E8%93%9D%E8%89%B2%22)%3B%0Alet%20is_tuesday%20%3D%20false%3B%0Alet%20age%3A%20Result%3Cu8%2C%20_%3E%20%3D%20%2234%22.parse()%3B%0A%0Aif%20let%20Some(color)%20%3D%20favorite_color%20%7B%0A%20%20%20%20println!(%22%E4%BD%BF%E7%94%A8%E4%BD%A0%E6%9C%80%E5%96%9C%E6%AC%A2%E7%9A%84%E9%A2%9C%E8%89%B2%EF%BC%9A%7B%7D%22%2C%20color)%3B%0A%7D%20else%20if%20is_tuesday%20%7B%0A%20%20%20%20println!(%22%E6%98%9F%E6%9C%9F%E4%BA%8C%E7%A9%BF%E7%BB%BF%E8%89%B2%EF%BC%81%22)%3B%0A%7D%20else%20if%20let%20Ok(age)%20%3D%20age%20%7B%0A%20%20%20%20if%20age%20%3E%2030%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%BF%E7%94%A8%E7%B4%AB%E8%89%B2%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%BF%E7%94%A8%E6%A9%99%E8%89%B2%22)%3B%0A%20%20%20%20%7D%0A%7D%20else%20%7B%0A%20%20%20%20println!(%22%E4%BD%BF%E7%94%A8%E8%93%9D%E8%89%B2%E4%BD%9C%E4%B8%BA%E5%90%8E%E5%A4%87%E6%96%B9%E6%A1%88%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> favorite_color</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"蓝色"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> is_tuesday </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, _&gt; </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "34"</span><span style="color:#F97583">.</span><span style="color:#B392F0">parse</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(color) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> favorite_color {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"使用你最喜欢的颜色：{}"</span><span style="color:#E1E4E8">, color);</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> is_tuesday {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"星期二穿绿色！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Ok</span><span style="color:#E1E4E8">(age) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> age {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> age </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"使用紫色"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"使用橙色"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"使用蓝色作为后备方案"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**等价的 match 写法会更复杂**。

# while let：循环中的模式匹配

类似 `if let`，`while let` 在循环中只关心某个模式：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20stack%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E5%BD%93%20pop()%20%E8%BF%94%E5%9B%9E%20Some%20%E6%97%B6%E7%BB%A7%E7%BB%AD%E5%BE%AA%E7%8E%AF%0A%20%20%20%20while%20let%20Some(top)%20%3D%20stack.pop()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%A0%88%E9%A1%B6%EF%BC%9A%7B%7D%22%2C%20top)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> stack </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 当 pop() 返回 Some 时继续循环</span></span>
<span class="line"><span style="color:#F97583">    while</span><span style="color:#F97583"> let</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(top) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> stack</span><span style="color:#F97583">.</span><span style="color:#B392F0">pop</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"栈顶：{}"</span><span style="color:#E1E4E8">, top);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

等价的 `loop + match` 写法：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20stack%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20loop%20%7B%0A%20%20%20%20%20%20%20%20match%20stack.pop()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Some(top)%20%3D%3E%20println!(%22%E6%A0%88%E9%A1%B6%EF%BC%9A%7B%7D%22%2C%20top)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20None%20%3D%3E%20break%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> stack </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    loop</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        match</span><span style="color:#E1E4E8"> stack</span><span style="color:#F97583">.</span><span style="color:#B392F0">pop</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">            Some</span><span style="color:#E1E4E8">(top) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"栈顶：{}"</span><span style="color:#E1E4E8">, top),</span></span>
<span class="line"><span style="color:#B392F0">            None</span><span style="color:#F97583"> =&gt;</span><span style="color:#F97583"> break</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`while let` 明显更简洁。

# 何时用 if let vs match

| 情况 | 用 if let | 用 match |
| --- | --- | --- |
| 只关心一个模式匹配 | ✓ | 不推荐（代码冗长） |
| 需要穷尽所有情况 | ✗ | ✓ |
| 需要处理多个模式 | 嵌套 if let 会很丑 | ✓ |
| 需要在模式中使用守卫条件 | 可以，但有限制 | ✓ |

简单规则：**如果你的 `match` 只有两个分支，其中一个用 `_` 忽略，那就考虑用 `if let`。**

# 练习题

```rust
let x = Some(5);

if let Some(y) = x {
    println!("{}", y);
}
```

加载题目中…

```rust
let config = Some(String::from("config.toml"));

if let Some(file) = config {
    println!("使用配置文件：{}", file);
} else {
    println!("使用默认配置");
}
```

加载题目中…

```rust
while let Some(x) = some_iterator {
    // ...
}
```

加载题目中…

## 编程练习

### 练习 1：用 if let 简化代码

使用 `if let` 和 `else` 处理以下场景：

```rust
enum Message {
    NewEmail { subject: String, sender: String },
    Text(String),
    Quit,
}

fn main() {
    let message = Message::NewEmail {
        subject: String::from("你好"),
        sender: String::from("Alice"),
    };

    // TODO: 用 if let 检查是否是 NewEmail
    // 如果是，打印 "收到新邮件，主题：{subject}，来自：{sender}"
    // 否则打印 "收到其他类型的消息"
}
```

### 练习 2：用 while let 遍历集合

使用 `while let` 循环处理向量中的元素：

```rust
fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];

    // TODO: 使用 while let 配合 pop() 从向量末尾取出元素
    // 逐个打印每个数字（注意顺序是从后往前）
}
```