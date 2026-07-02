# 悬垂引用问题

你已经知道 Rust 有”借用”这个概念：可以不转移所有权、只拿一个引用。但引用有个潜在风险——如果被引用的数据已经销毁了，引用还在，就会指向无效内存，这叫**悬垂引用**（dangling reference）。

C/C++ 程序员对这类 bug 再熟悉不过了：use-after-free、野指针……Rust 的目标是让这类错误**在编译期就被发现**，永远不到运行时。

## 一个会出问题的例子

看这段代码（你可能在借用与引用章节已经见过，我们再回顾一下）——它试图在内部作用域之外使用一个指向内部变量的引用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20r%3B%0A%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20%20%20%20%20r%20%3D%20%26x%3B%20%20%20%20%20%20%20%2F%2F%20r%20%E5%80%9F%E7%94%A8%E4%BA%86%20x%0A%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20x%20%E5%9C%A8%E8%BF%99%E9%87%8C%E8%A2%AB%E9%94%80%E6%AF%81%0A%0A%20%20%20%20println!(%22r%3A%20%7B%7D%22%2C%20r)%3B%20%2F%2F%20%E5%8D%B1%E9%99%A9%EF%BC%81x%20%E5%B7%B2%E7%BB%8F%E4%B8%8D%E5%AD%98%E5%9C%A8%E4%BA%86%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        r </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x;       </span><span style="color:#6A737D">// r 借用了 x</span></span>
<span class="line"><span style="color:#E1E4E8">    }                 </span><span style="color:#6A737D">// x 在这里被销毁</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"r: {}"</span><span style="color:#E1E4E8">, r); </span><span style="color:#6A737D">// 危险！x 已经不存在了</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> Rust 会直接拒绝编译，报错：``x` does not live long enough`

`x` 的生命在内部 `{}` 结束时就结束了，但 `r` 要活到 `println!` 那行。`r` 比它所引用的数据活得更久——这就是悬垂引用。

## 没有问题的版本

只要让被引用的数据比引用活得更久，就没有问题：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20x%20%E5%9C%A8%E8%BF%99%E9%87%8C%E5%88%9B%E5%BB%BA%EF%BC%8C%E6%B4%BB%E5%BE%97%E6%9B%B4%E9%95%BF%0A%20%20%20%20let%20r%20%3D%20%26x%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20r%20%E5%80%9F%E7%94%A8%20x%0A%20%20%20%20println!(%22r%3A%20%7B%7D%22%2C%20r)%3B%20%2F%2F%20%E6%AD%A4%E6%97%B6%20x%20%E8%BF%98%E6%B4%BB%E7%9D%80%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%90%88%E6%B3%95%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;            </span><span style="color:#6A737D">// x 在这里创建，活得更长</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x;           </span><span style="color:#6A737D">// r 借用 x</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"r: {}"</span><span style="color:#E1E4E8">, r); </span><span style="color:#6A737D">// 此时 x 还活着，完全合法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这两个例子的区别只是 `x` 声明的位置，但 Rust 完全知道哪个可以、哪个不行。靠什么知道？靠**借用检查器**。

# 借用检查器

## 编译器如何做判断

Rust 编译器内置了**借用检查器**（borrow checker），它的工作就是比对引用的生命周期与被引用数据的生命周期，确保前者不会超过后者。

我们用注释把生命周期可视化出来，看第一个出错的例子：

```rust
{
    let r;                // ------+-- 'r 的生命周期开始
                          //       |
    {                     //       |
        let x = 5;        // -+--  |  'x 的生命周期开始
        r = &x;           //  |    |
    }                     // -+    |  'x 生命周期结束！x 被销毁
                          //       |
    println!("{}", r);    //       |  r 仍然在用，但 'x 已经结束
}                         // ------+
```

`r` 的生命周期 `'r` 比 `x` 的生命周期 `'x` 更长。`r` 引用了 `x`，所以 `'x` 必须覆盖 `'r` 的整个范围——但它没有，编译器报错。

## 正确例子的生命周期

```rust
{
    let x = 5;            // ------+-- 'x 开始
                          //       |
    let r = &x;           // --+   |  'r 开始
                          //   |   |
    println!("{}", r);    //   |   |
                          // --+   |  'r 结束
}                         // ------+  'x 结束
```

`'x` 完全包含了 `'r`，引用有效，编译通过。

## 生命周期不是程序员”发明”的

生命周期参数（`'a`、`'b` 这样的写法）不是 Rust 独有的概念，它实际上描述的是**引用存在的那段时间**——这段时间本来就存在，只是 Rust 让你在某些场合把它写出来，让编译器能够核验。

就像类型标注一样：变量有类型是客观事实，大多数时候编译器能推断，偶尔你需要写出来。生命周期也是如此——大多数时候编译器能推断（这叫”省略”），偶尔你需要手动标注。

# 练习题

## 基础概念测验

加载题目中…

加载题目中…

```rust
fn main() {
    let r;
    {
        let x = 10;
        r = &x;
    }
    println!("{}", r);
}
```

加载题目中…

加载题目中…

加载题目中…