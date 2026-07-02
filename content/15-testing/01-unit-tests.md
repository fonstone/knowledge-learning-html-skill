# 测试函数的解剖

在 Rust 里，一个测试就是一个带有 `#[test]` 属性的普通函数。当你运行 `cargo test` 时，Rust 会编译一个专门的测试执行程序，找到所有标注了 `#[test]` 的函数并逐一运行，最后汇报哪些通过、哪些失败。

## 第一个测试

新建一个库项目时，Cargo 会自动帮你生成一个测试模块：

```bash
cargo new adder --lib
```

打开 `src/lib.rs`，可以看到：

<div class="code-runner" data-full-code="%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20it_works()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(2%20%2B%202%2C%204)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> it_works</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

几个关键点：

- `#[cfg(test)]` ：条件编译标记，告诉 Rust 只在执行 cargo test 时才编译这个模块， cargo build 时不编译，不会浪费编译时间，也不会增大二进制文件体积。
- `mod tests` ：普通的模块，只是约定俗成地叫 tests 。
- `#[test]` ：标记这个函数是一个测试函数。模块内也可以有普通的辅助函数（不加 #[test] ），用来为测试准备数据。

运行测试：

```bash
cargo test
```

输出示例：

```text
running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## 测试是怎么失败的

**测试函数 panic，测试就失败。** 每个测试跑在独立的线程里，如果线程 panic 了，主线程会捕捉到并把这个测试标记为失败。

<div class="code-runner" data-full-code="%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20another()%20%7B%0A%20%20%20%20%20%20%20%20panic!(%22%E8%AE%A9%E8%BF%99%E4%B8%AA%E6%B5%8B%E8%AF%95%E5%A4%B1%E8%B4%A5%22)%3B%20%20%2F%2F%20%E4%B8%BB%E5%8A%A8%20panic%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> another</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"让这个测试失败"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 主动 panic</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

输出示例：

```text
running 1 test
test tests::another ... FAILED

failures:
---- tests::another stdout ----
thread 'tests::another' panicked at '让这个测试失败', src/lib.rs:4:9

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out
```

> 这就是所有断言宏的工作原理——当条件不满足时，它们调用 `panic!`，从而让测试失败。

## use super::*

测试模块是嵌套在源码文件里的内部模块，要访问外层模块的内容，需要显式导入：

<div class="code-runner" data-full-code="pub%20fn%20add_two(a%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20a%20%2B%202%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%20%20%2F%2F%20%E6%8A%8A%E5%A4%96%E5%B1%82%E6%A8%A1%E5%9D%97%E7%9A%84%E6%89%80%E6%9C%89%E5%85%AC%E5%BC%80%EF%BC%88%E5%8F%8A%E7%A7%81%E6%9C%89%EF%BC%89%E5%86%85%E5%AE%B9%E5%BC%95%E5%85%A5%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20it_adds_two()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(4%2C%20add_two(2))%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> add_two</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 把外层模块的所有公开（及私有）内容引入</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> it_adds_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意 `use super::*` 可以访问**私有函数**，这是 Rust 允许的——测试就在同一个文件里，没有跨越模块边界。

# 断言宏

Rust 标准库提供了三个核心断言宏，覆盖了绝大多数测试场景。

## assert!

`assert!(expr)` —— 断言表达式为 `true`，否则 panic。

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Astruct%20Rectangle%20%7B%0A%20%20%20%20width%3A%20u32%2C%0A%20%20%20%20height%3A%20u32%2C%0A%7D%0A%0Aimpl%20Rectangle%20%7B%0A%20%20%20%20fn%20can_hold(%26self%2C%20other%3A%20%26Rectangle)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20self.width%20%3E%20other.width%20%26%26%20self.height%20%3E%20other.height%0A%20%20%20%20%7D%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20larger_can_hold_smaller()%20%7B%0A%20%20%20%20%20%20%20%20let%20large%20%3D%20Rectangle%20%7B%20width%3A%208%2C%20height%3A%207%20%7D%3B%0A%20%20%20%20%20%20%20%20let%20small%20%3D%20Rectangle%20%7B%20width%3A%205%2C%20height%3A%201%20%7D%3B%0A%20%20%20%20%20%20%20%20assert!(large.can_hold(%26small))%3B%20%20%2F%2F%20%E6%9C%9F%E6%9C%9B%E4%B8%BA%20true%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20smaller_cannot_hold_larger()%20%7B%0A%20%20%20%20%20%20%20%20let%20large%20%3D%20Rectangle%20%7B%20width%3A%208%2C%20height%3A%207%20%7D%3B%0A%20%20%20%20%20%20%20%20let%20small%20%3D%20Rectangle%20%7B%20width%3A%205%2C%20height%3A%201%20%7D%3B%0A%20%20%20%20%20%20%20%20assert!(!small.can_hold(%26large))%3B%20%20%2F%2F%20%E5%8F%96%E5%8F%8D%EF%BC%8C%E6%9C%9F%E6%9C%9B%20false%20%E5%8F%98%20true%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, other</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">Rectangle</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">&amp;&amp;</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> larger_can_hold_smaller</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> large </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 8</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 7</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> small </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">        assert!</span><span style="color:#E1E4E8">(large</span><span style="color:#F97583">.</span><span style="color:#B392F0">can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">small));  </span><span style="color:#6A737D">// 期望为 true</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> smaller_cannot_hold_larger</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> large </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 8</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 7</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> small </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rectangle</span><span style="color:#E1E4E8"> { width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">        assert!</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">!</span><span style="color:#E1E4E8">small</span><span style="color:#F97583">.</span><span style="color:#B392F0">can_hold</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">large));  </span><span style="color:#6A737D">// 取反，期望 false 变 true</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## assert_eq! 和 assert_ne!

`assert_eq!(left, right)` 断言两值**相等**；`assert_ne!(left, right)` 断言两值**不相等**。

它们比 `assert!(a == b)` 更好用的地方在于：**断言失败时会打印出具体的两个值**，方便定位问题。

<div class="code-runner" data-full-code="pub%20fn%20add_two(a%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20a%20%2B%202%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20it_adds_two()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(4%2C%20add_two(2))%3B%20%20%2F%2F%20%E6%9C%9F%E6%9C%9B%204%EF%BC%8C%E5%AE%9E%E9%99%85%20add_two(2)%20%3D%204%EF%BC%8C%E9%80%9A%E8%BF%87%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> add_two</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> it_adds_two</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// 期望 4，实际 add_two(2) = 4，通过</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

故意引入 bug，把 `a + 2` 改成 `a + 3`，失败输出会是：

```text
assertion failed: `(left == right)`
  left: `4`,
 right: `5`
```

清楚地告诉你”期望是 4，实际是 5”。

> **注意**：`assert_eq!` 的两个参数叫 `left` 和 `right`，没有”期望值必须放哪边”的强制约定，但通常习惯把期望值放左边。

使用 `assert_eq!` / `assert_ne!` 的类型必须实现 `PartialEq` 和 `Debug` trait，大多数内置类型已经实现。自定义结构体可以加 `#[derive(PartialEq, Debug)]`。

## 自定义失败信息

断言宏都支持额外的格式化字符串参数，失败时会一并打印出来：

<div class="code-runner" data-full-code="pub%20fn%20greeting(name%3A%20%26str)%20-%3E%20String%20%7B%0A%20%20%20%20format!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%7B%7D%EF%BC%81%22%2C%20name)%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20greeting_contains_name()%20%7B%0A%20%20%20%20%20%20%20%20let%20result%20%3D%20greeting(%22%E5%B0%8F%E6%98%8E%22)%3B%0A%20%20%20%20%20%20%20%20assert!(%0A%20%20%20%20%20%20%20%20%20%20%20%20result.contains(%22%E5%B0%8F%E6%98%8E%22)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%E9%97%AE%E5%80%99%E8%AF%AD%E4%B8%AD%E6%B2%A1%E6%9C%89%E5%8C%85%E5%90%AB%E5%90%8D%E5%AD%97%EF%BC%8C%E5%AE%9E%E9%99%85%E5%BE%97%E5%88%B0%E7%9A%84%E6%98%AF%EF%BC%9A%60%7B%7D%60%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20result%0A%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> greeting</span><span style="color:#E1E4E8">(name</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，{}！"</span><span style="color:#E1E4E8">, name)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> greeting_contains_name</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> greeting</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"小明"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">        assert!</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#E1E4E8">            result</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"小明"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#9ECBFF">            "问候语中没有包含名字，实际得到的是：`{}`"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">            result</span></span>
<span class="line"><span style="color:#E1E4E8">        );</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

当测试失败时，你会看到具体的 `result` 值，而不是干巴巴的”断言失败”。

# 特殊测试属性

除了 `#[test]`，还有两种常用的测试属性，分别用于测试”应该 panic 的代码”和”应该返回错误的代码”。

## should_panic：测试预期中的 panic

有些函数在接收非法输入时**应该** panic（比如边界检查）。`#[should_panic]` 属性可以测试这类场景：

<div class="code-runner" data-full-code="pub%20struct%20Guess%20%7B%0A%20%20%20%20value%3A%20i32%2C%0A%7D%0A%0Aimpl%20Guess%20%7B%0A%20%20%20%20pub%20fn%20new(value%3A%20i32)%20-%3E%20Guess%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%3C%201%20%7C%7C%20value%20%3E%20100%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%22%E7%8C%9C%E6%B5%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E5%9C%A8%201%20%E5%88%B0%20100%20%E4%B9%8B%E9%97%B4%EF%BC%8C%E5%AE%9E%E9%99%85%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Guess%20%7B%20value%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20%23%5Bshould_panic%5D%0A%20%20%20%20fn%20greater_than_100()%20%7B%0A%20%20%20%20%20%20%20%20Guess%3A%3Anew(200)%3B%20%20%2F%2F%20%E8%BF%99%E9%87%8C%E5%BA%94%E8%AF%A5%20panic%EF%BC%8C%E5%A6%82%E6%9E%9C%E6%B2%A1%E6%9C%89%20panic%EF%BC%8C%E6%B5%8B%E8%AF%95%E5%8F%8D%E8%80%8C%E5%A4%B1%E8%B4%A5%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> struct</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"猜测值必须在 1 到 100 之间，实际收到：{}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#E1E4E8"> { value }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#E1E4E8">    #[should_panic]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> greater_than_100</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">200</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 这里应该 panic，如果没有 panic，测试反而失败</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

但 `#[should_panic]` 有个缺点：只要函数 panic 了（不管原因），测试就通过，容易产生误报。

加上 `expected` 参数可以更精确——只有 panic 信息**包含**指定字符串时，测试才通过：

<div class="code-runner" data-full-code="pub%20struct%20Guess%20%7B%0A%20%20%20%20value%3A%20i32%2C%0A%7D%0A%0Aimpl%20Guess%20%7B%0A%20%20%20%20pub%20fn%20new(value%3A%20i32)%20-%3E%20Guess%20%7B%0A%20%20%20%20%20%20%20%20if%20value%20%3C%201%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%22%E7%8C%9C%E6%B5%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E5%A4%A7%E4%BA%8E%E7%AD%89%E4%BA%8E%201%EF%BC%8C%E5%AE%9E%E9%99%85%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20if%20value%20%3E%20100%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%22%E7%8C%9C%E6%B5%8B%E5%80%BC%E5%BF%85%E9%A1%BB%E5%B0%8F%E4%BA%8E%E7%AD%89%E4%BA%8E%20100%EF%BC%8C%E5%AE%9E%E9%99%85%E6%94%B6%E5%88%B0%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Guess%20%7B%20value%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20%23%5Bshould_panic(expected%20%3D%20%22%E5%BF%85%E9%A1%BB%E5%B0%8F%E4%BA%8E%E7%AD%89%E4%BA%8E%20100%22)%5D%20%20%2F%2F%20panic%20%E4%BF%A1%E6%81%AF%E5%BF%85%E9%A1%BB%E5%8C%85%E5%90%AB%E8%BF%99%E4%B8%AA%E5%AD%90%E4%B8%B2%0A%20%20%20%20fn%20greater_than_100()%20%7B%0A%20%20%20%20%20%20%20%20Guess%3A%3Anew(200)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> struct</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Guess</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"猜测值必须大于等于 1，实际收到：{}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"猜测值必须小于等于 100，实际收到：{}"</span><span style="color:#E1E4E8">, value);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#E1E4E8"> { value }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#E1E4E8">    #[should_panic(expected </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "必须小于等于 100"</span><span style="color:#E1E4E8">)]  </span><span style="color:#6A737D">// panic 信息必须包含这个子串</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> greater_than_100</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Guess</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">200</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 用 Result<T, E> 编写测试

除了 panic，也可以让测试函数返回 `Result<(), E>`：

- 返回 Ok(()) → 测试通过
- 返回 Err(...) → 测试失败

<div class="code-runner" data-full-code="%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20it_works()%20-%3E%20Result%3C()%2C%20String%3E%20%7B%0A%20%20%20%20%20%20%20%20if%202%20%2B%202%20%3D%3D%204%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Ok(())%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Err(String%3A%3Afrom(%222%20%2B%202%20%E7%9A%84%E7%BB%93%E6%9E%9C%E4%B8%8D%E6%98%AF%204%22))%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> it_works</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;(), </span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Ok</span><span style="color:#E1E4E8">(())</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Err</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"2 + 2 的结果不是 4"</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这种写法的好处是可以在测试体内使用 `?` 运算符，方便链式调用会返回 `Result` 的函数：

```rust
fn read_file_test() -> Result<(), std::io::Error> {
    let content = std::fs::read_to_string("config.txt")?;  // 失败则测试直接失败
    assert!(content.contains("version"));
    Ok(())
}
```

> **注意**：使用 `Result<T, E>` 的测试**不能**同时使用 `#[should_panic]`。如果想断言某操作返回 `Err`，用 `assert!(result.is_err())` 代替。

# 练习题

## 测验

加载题目中…

```rust
#[test]
fn another() {
    panic!("oops");
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的函数已经写好，请**补全两处 `TODO`**，用 `assert_eq!` 验证 `multiply` 的结果：

```rust
pub fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    // TODO: 用 assert_eq! 验证 multiply(3, 4) == 12
    println!("test normal_multiply ... ok");

    // TODO: 用 assert_eq! 验证 multiply(5, 0) == 0
    println!("test multiply_by_zero ... ok");
}
```