# Newtype 模式

## 相同类型，不同语义

考虑一个简单场景：你的程序需要处理距离，有时是米，有时是厘米。两者的底层值都是 `f64`，但混用会出大问题：

<div class="code-runner" data-full-code="fn%20add_lengths(a%3A%20f64%2C%20b%3A%20f64)%20-%3E%20f64%20%7B%0A%20%20%20%20a%20%2B%20b%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20distance_m%20%3D%201.5%3B%0A%20%20%20%20let%20distance_cm%20%3D%20150.0%3B%0A%0A%20%20%20%20%2F%2F%20%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8C%E4%BD%86%E8%AF%AD%E4%B9%89%E6%98%AF%E9%94%99%E7%9A%84%EF%BC%9A1.5%20%E7%B1%B3%20%2B%20150%20%E5%8E%98%E7%B1%B3%20%E2%89%A0%20151.5%20%E7%B1%B3%0A%20%20%20%20let%20total%20%3D%20add_lengths(distance_m%2C%20distance_cm)%3B%0A%20%20%20%20println!(%22total%20%3D%20%7B%7D%22%2C%20total)%3B%20%2F%2F%20151.5%EF%BC%8C%E5%AE%8C%E5%85%A8%E9%94%99%E8%AF%AF%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add_lengths</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> distance_m </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1.5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> distance_cm </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 150.0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 能编译，但语义是错的：1.5 米 + 150 厘米 ≠ 151.5 米</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> total </span><span style="color:#F97583">=</span><span style="color:#B392F0"> add_lengths</span><span style="color:#E1E4E8">(distance_m, distance_cm);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"total = {}"</span><span style="color:#E1E4E8">, total); </span><span style="color:#6A737D">// 151.5，完全错误</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器毫无怨言地接受了这个错误——因为它们都是 `f64`，无法区分。

**Newtype 模式**的核心思路：把底层类型包裹在一个**单字段元组结构体**里，让它成为一个新类型：

<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%0Astruct%20Centimeters(f64)%3B%0A%0Afn%20add_meters(a%3A%20Meters%2C%20b%3A%20Meters)%20-%3E%20Meters%20%7B%0A%20%20%20%20Meters(a.0%20%2B%20b.0)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20distance_m%20%3D%20Meters(1.5)%3B%0A%20%20%20%20let%20distance_cm%20%3D%20Centimeters(150.0)%3B%0A%0A%20%20%20%20add_meters(distance_m%2C%20distance_cm)%3B%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%8C%B9%E9%85%8D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add_meters</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Meters</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#F97583"> +</span><span style="color:#E1E4E8"> b</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> distance_m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1.5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> distance_cm </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">150.0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    add_meters</span><span style="color:#E1E4E8">(distance_m, distance_cm); </span><span style="color:#6A737D">// 编译错误！类型不匹配</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 错误被提前到了编译期，代码运行之前就被阻止了。

## 定义和访问内部值

Newtype 就是一个**元组结构体**，语法极简：

<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20m%20%3D%20Meters(42.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%20.0%20%E8%AE%BF%E9%97%AE%E5%86%85%E9%83%A8%E5%80%BC%EF%BC%88%E5%85%83%E7%BB%84%E7%BB%93%E6%9E%84%E4%BD%93%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%AD%97%E6%AE%B5%EF%BC%89%0A%20%20%20%20println!(%22%E8%B7%9D%E7%A6%BB%EF%BC%9A%7B%7D%20%E7%B1%B3%22%2C%20m.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E8%A7%A3%E6%9E%84%0A%20%20%20%20let%20Meters(value)%20%3D%20m%3B%0A%20%20%20%20println!(%22%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42.0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用 .0 访问内部值（元组结构体第一个字段）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"距离：{} 米"</span><span style="color:#E1E4E8">, m</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 也可以解构</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(value) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> m;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"值：{}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为 newtype 实现方法

Newtype 是完整的类型，可以为它实现任何方法：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20Meters(f64)%3B%0Astruct%20Centimeters(f64)%3B%0A%0Aimpl%20Meters%20%7B%0A%20%20%20%20fn%20to_centimeters(%26self)%20-%3E%20Centimeters%20%7B%0A%20%20%20%20%20%20%20%20Centimeters(self.0%20*%20100.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20Centimeters%20%7B%0A%20%20%20%20fn%20to_meters(%26self)%20-%3E%20Meters%20%7B%0A%20%20%20%20%20%20%20%20Meters(self.0%20%2F%20100.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Meters%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%7D%20m%22%2C%20self.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Centimeters%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%7D%20cm%22%2C%20self.0)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20d%20%3D%20Meters(1.5)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%201.5%20m%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d.to_centimeters())%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20150%20cm%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d.to_centimeters().to_meters())%3B%20%2F%2F%201.5%20m%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> to_centimeters</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Centimeters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 100.0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> to_meters</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#F97583"> /</span><span style="color:#79B8FF"> 100.0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"{} m"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Centimeters</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"{} cm"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> d </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Meters</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1.5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, d);                              </span><span style="color:#6A737D">// 1.5 m</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, d</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_centimeters</span><span style="color:#E1E4E8">());             </span><span style="color:#6A737D">// 150 cm</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, d</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_centimeters</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_meters</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 1.5 m</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 零开销保证

Newtype 包装在运行时**完全没有开销**。

`struct Meters(f64)` 在内存中和裸 `f64` 布局完全相同，没有额外字段或指针。这个”包装”只存在于编译期的类型检查阶段，机器码层面编译器直接操作内部的 `f64`。

# 练习题

## Newtype 测验

加载题目中…

```rust
struct UserId(u64);
struct PostId(u64);

fn get_user(id: UserId) -> String {
    format!("用户 #{}", id.0)
}
```

加载题目中…

加载题目中…

## 编程练习

下面的代码用裸 `u64` 表示两种 ID，导致 `validate_user(session_id)` 能通过编译。请用 newtype 模式定义 `UserId` 和 `SessionId`，让最后一行产生编译错误。

```rust
// TODO: 把下面两行改成 newtype 定义
type UserId = u64;
type SessionId = u64;

fn validate_user(id: UserId) -> bool {
    id > 0
}

fn validate_session(id: SessionId) -> bool {
    id > 1000
}

fn main() {
    let uid = UserId(42);       // 改完后这里能用
    let sid = SessionId(9001);

    println!("用户有效: {}", validate_user(uid));
    println!("会话有效: {}", validate_session(sid));

    // 改完后取消注释，应该编译失败：
    // validate_user(sid);
}
```