# 迭代器是什么

迭代器（iterator）是一种**按需逐个产生值**的机制。你可以把它想象成一条传送带：上面放着待处理的货物，但传送带只有在你喊”下一个”时才会动一格——这就是 Rust 迭代器的核心特征：**惰性求值**（lazy evaluation）。

## 惰性求值：不问不动

创建迭代器本身**不会做任何计算**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v1%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20let%20v1_iter%20%3D%20v1.iter()%3B%20%2F%2F%20%E5%8F%AA%E6%98%AF%E5%88%9B%E5%BB%BA%E4%BA%86%E8%BF%AD%E4%BB%A3%E5%99%A8%EF%BC%8C%E4%BB%80%E4%B9%88%E9%83%BD%E6%B2%A1%E5%8F%91%E7%94%9F%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E6%9C%89%E7%94%A8%E5%88%B0%E6%97%B6%E6%89%8D%E7%9C%9F%E6%AD%A3%E6%89%A7%E8%A1%8C%0A%20%20%20%20for%20val%20in%20v1_iter%20%7B%0A%20%20%20%20%20%20%20%20println!(%22Got%3A%20%7B%7D%22%2C%20val)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v1_iter </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v1</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 只是创建了迭代器，什么都没发生</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只有用到时才真正执行</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> val </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> v1_iter {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Got: {}"</span><span style="color:#E1E4E8">, val);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这和 Python 的 `range` 类似——`range(1_000_000)` 不会立刻创建百万个数，只是记录了”从 0 数到 999999”的指令，Rust 迭代器也是同样的道理。

## iter、into_iter、iter_mut 的区别

同一个集合可以用三种方式创建迭代器，区别在于**所有权和可变性**：

| 方法 | 产生值的类型 | 原集合之后 |
| --- | --- | --- |
| `iter()` | `&T`（不可变引用） | 仍可使用 |
| `into_iter()` | `T`（拥有所有权） | 被消耗，不可再用 |
| `iter_mut()` | `&mut T`（可变引用） | 仍可使用（但期间独占） |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5BString%3A%3Afrom(%22hello%22)%2C%20String%3A%3Afrom(%22world%22)%5D%3B%0A%0A%20%20%20%20%2F%2F%20iter()%EF%BC%9A%E5%80%9F%E7%94%A8%EF%BC%8C%E4%B8%8D%E6%B6%88%E8%80%97%20v%0A%20%20%20%20for%20s%20in%20v.iter()%20%7B%0A%20%20%20%20%20%20%20%20print!(%22%7B%7D%20%22%2C%20s)%3B%20%2F%2F%20s%20%E6%98%AF%20%26String%0A%20%20%20%20%7D%0A%20%20%20%20println!()%3B%0A%20%20%20%20println!(%22v%20%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%3A%20%7B%3A%3F%7D%22%2C%20v)%3B%20%2F%2F%20v%20%E5%8F%AF%E4%BB%A5%E7%BB%A7%E7%BB%AD%E7%94%A8%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">), </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">)];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // iter()：借用，不消耗 v</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        print!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} "</span><span style="color:#E1E4E8">, s); </span><span style="color:#6A737D">// s 是 &amp;String</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"v 仍然有效: {:?}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// v 可以继续用</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20iter_mut()%EF%BC%9A%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%E5%85%83%E7%B4%A0%0A%20%20%20%20for%20x%20in%20v.iter_mut()%20%7B%0A%20%20%20%20%20%20%20%20*x%20*%3D%202%3B%20%2F%2F%20%E8%A7%A3%E5%BC%95%E7%94%A8%E5%90%8E%E4%BF%AE%E6%94%B9%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%2F%2F%20%5B2%2C%204%2C%206%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // iter_mut()：可变借用，可以修改元素</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter_mut</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">*=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 解引用后修改</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// [2, 4, 6]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5BString%3A%3Afrom(%22hello%22)%2C%20String%3A%3Afrom(%22world%22)%5D%3B%0A%0A%20%20%20%20%2F%2F%20into_iter()%EF%BC%9A%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8Cv%20%E4%B9%8B%E5%90%8E%E4%B8%8D%E5%8F%AF%E5%86%8D%E7%94%A8%0A%20%20%20%20for%20s%20in%20v.into_iter()%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81v%20%E5%B7%B2%E8%A2%AB%E6%B6%88%E8%80%97%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">), </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">)];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // into_iter()：转移所有权，v 之后不可再用</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">into_iter</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// 错误！v 已被消耗</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **经验法则**：只需读取用 `iter()`；需要修改用 `iter_mut()`；需要把元素所有权传出去用 `into_iter()`。

## Iterator Trait 与 next

### Iterator trait 的定义

所有迭代器都实现了标准库中的 `Iterator` trait，它的核心长这样：

```rust
pub trait Iterator {
    type Item; // 这个迭代器产生什么类型的值

    fn next(&mut self) -> Option<Self::Item>; // 唯一必须实现的方法

    // 以下数十个方法都有默认实现，只要实现了 next 就全部免费获得
    // fn map(...) { ... }
    // fn filter(...) { ... }
    // fn sum(...) { ... }
    // ...
}
```

`type Item` 叫做**关联类型**，声明了”这个迭代器产出什么类型的值”。`next` 方法是唯一必须自己实现的，其余几十个方法都基于 `next` 有默认实现。

`next` 每次调用返回：

- Some(value) — 下一个值
- None — 迭代结束

### 直接调用 next

`for` 循环其实就是在反复调用 `next`，只是语法糖让它看起来更简洁：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%20%20%20%20let%20mut%20iter%20%3D%20v.iter()%3B%20%2F%2F%20%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%20next%20%E9%9C%80%E8%A6%81%20mut%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20iter.next())%3B%20%2F%2F%20Some(%2610)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20iter.next())%3B%20%2F%2F%20Some(%2620)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20iter.next())%3B%20%2F%2F%20Some(%2630)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20iter.next())%3B%20%2F%2F%20None%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20iter.next())%3B%20%2F%2F%20None%EF%BC%88%E7%BB%A7%E7%BB%AD%E8%B0%83%E7%94%A8%E4%BB%8D%E6%98%AF%20None%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> iter </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 直接调用 next 需要 mut</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, iter</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Some(&amp;10)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, iter</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Some(&amp;20)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, iter</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Some(&amp;30)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, iter</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// None</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, iter</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// None（继续调用仍是 None）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **为什么需要 `mut`？** 每次调用 `next` 都会推进迭代器内部的”游标”位置——这是对迭代器自身状态的修改。`for` 循环会拿走迭代器的所有权并在背后把它设为可变，所以你不用手动写 `mut`。

# 自定义迭代器

## 只需实现 next

任何结构体，只要为它实现了 `Iterator` trait 的 `next` 方法，就成了一个迭代器。来创建一个从 1 数到 5 的计数器：

> **关于 `type Item`**：代码里的 `type Item = u32;` 用到了**关联类型**（associated type）这个特性，[高级特性：关联类型](#/chapters/22-advanced/01-associated-types)一节会专门讲解它。现在只需要把它理解成”告诉编译器这个迭代器产出什么类型的值”——照着写就行，不需要深究语法原理。

<div class="code-runner" data-full-code="struct%20Counter%20%7B%0A%20%20%20%20count%3A%20u32%2C%0A%7D%0A%0Aimpl%20Counter%20%7B%0A%20%20%20%20fn%20new()%20-%3E%20Counter%20%7B%0A%20%20%20%20%20%20%20%20Counter%20%7B%20count%3A%200%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20Iterator%20for%20Counter%20%7B%0A%20%20%20%20type%20Item%20%3D%20u32%3B%20%2F%2F%20%E5%A3%B0%E6%98%8E%E8%BF%99%E4%B8%AA%E8%BF%AD%E4%BB%A3%E5%99%A8%E4%BA%A7%E5%87%BA%20u32%20%E5%80%BC%EF%BC%88%E5%85%B3%E8%81%94%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%90%8E%E7%BB%AD%E7%AB%A0%E8%8A%82%E4%BC%9A%E8%AE%B2%EF%BC%89%0A%0A%20%20%20%20fn%20next(%26mut%20self)%20-%3E%20Option%3CSelf%3A%3AItem%3E%20%7B%0A%20%20%20%20%20%20%20%20self.count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20if%20self.count%20%3C%3D%205%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Some(self.count)%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20None%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E7%94%A8%20for%20%E5%BE%AA%E7%8E%AF%0A%20%20%20%20for%20n%20in%20Counter%3A%3Anew()%20%7B%0A%20%20%20%20%20%20%20%20print!(%22%7B%7D%20%22%2C%20n)%3B%0A%20%20%20%20%7D%0A%20%20%20%20println!()%3B%20%2F%2F%201%202%203%204%205%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%20next%0A%20%20%20%20let%20mut%20c%20%3D%20Counter%3A%3Anew()%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20c.next())%3B%20%2F%2F%20Some(1)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20c.next())%3B%20%2F%2F%20Some(2)%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Counter</span><span style="color:#E1E4E8"> { count</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Iterator</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Item</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 声明这个迭代器产出 u32 值（关联类型，后续章节会讲）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> next</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#79B8FF"> self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#79B8FF">Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Item</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">&lt;=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count)</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            None</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 可以用 for 循环</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> n </span><span style="color:#F97583">in</span><span style="color:#B392F0"> Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        print!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} "</span><span style="color:#E1E4E8">, n);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 1 2 3 4 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 也可以直接调用 next</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Some(1)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">next</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// Some(2)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 免费获得的其他方法

只要实现了 `next`，`Iterator` trait 上几十个有默认实现的方法就全部可以使用——不需要再写任何代码：

<div class="code-runner" data-full-code="struct%20Counter%20%7B%0A%20%20%20%20count%3A%20u32%2C%0A%7D%0A%0Aimpl%20Counter%20%7B%0A%20%20%20%20fn%20new()%20-%3E%20Counter%20%7B%20Counter%20%7B%20count%3A%200%20%7D%20%7D%0A%7D%0A%0Aimpl%20Iterator%20for%20Counter%20%7B%0A%20%20%20%20type%20Item%20%3D%20u32%3B%0A%20%20%20%20fn%20next(%26mut%20self)%20-%3E%20Option%3CSelf%3A%3AItem%3E%20%7B%0A%20%20%20%20%20%20%20%20self.count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20if%20self.count%20%3C%3D%205%20%7B%20Some(self.count)%20%7D%20else%20%7B%20None%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20sum%EF%BC%9A%E6%B1%82%E5%92%8C%EF%BC%88%E5%8F%AA%E5%AE%9E%E7%8E%B0%E4%BA%86%20next%EF%BC%8Csum%20%E6%98%AF%E5%85%8D%E8%B4%B9%E7%9A%84%EF%BC%89%0A%20%20%20%20let%20total%3A%20u32%20%3D%20Counter%3A%3Anew().sum()%3B%0A%20%20%20%20println!(%221%2B2%2B3%2B4%2B5%20%3D%20%7B%7D%22%2C%20total)%3B%20%2F%2F%2015%0A%0A%20%20%20%20%2F%2F%20%E9%93%BE%E5%BC%8F%E7%BB%84%E5%90%88%EF%BC%9A%0A%20%20%20%20%2F%2F%20Counter%3A%3Anew()%20%20%20%20%20%20%20%20%20%E2%86%92%201%2C2%2C3%2C4%2C5%0A%20%20%20%20%2F%2F%20.zip(skip(1))%20%20%20%20%20%20%20%20%20%20%E2%86%92%20(1%2C2)%2C(2%2C3)%2C(3%2C4)%2C(4%2C5)%0A%20%20%20%20%2F%2F%20.map(%7C(a%2Cb)%7C%20a*b)%20%20%20%20%20%20%E2%86%92%202%2C6%2C12%2C20%0A%20%20%20%20%2F%2F%20.filter(%7Cx%7C%20x%253%3D%3D0)%20%20%20%E2%86%92%206%2C12%0A%20%20%20%20%2F%2F%20.sum()%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%E2%86%92%2018%0A%20%20%20%20let%20result%3A%20u32%20%3D%20Counter%3A%3Anew()%0A%20%20%20%20%20%20%20%20.zip(Counter%3A%3Anew().skip(1))%0A%20%20%20%20%20%20%20%20.map(%7C(a%2C%20b)%7C%20a%20*%20b)%0A%20%20%20%20%20%20%20%20.filter(%7Cx%7C%20x%20%25%203%20%3D%3D%200)%0A%20%20%20%20%20%20%20%20.sum()%3B%0A%20%20%20%20println!(%22%E7%BB%93%E6%9E%9C%3A%20%7B%7D%22%2C%20result)%3B%20%2F%2F%2018%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">Counter</span><span style="color:#E1E4E8"> { count</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Iterator</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Item</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> next</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#79B8FF"> self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#79B8FF">Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Item</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count </span><span style="color:#F97583">&lt;=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count) } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">None</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // sum：求和（只实现了 next，sum 是免费的）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> total</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">sum</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1+2+3+4+5 = {}"</span><span style="color:#E1E4E8">, total); </span><span style="color:#6A737D">// 15</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 链式组合：</span></span>
<span class="line"><span style="color:#6A737D">    // Counter::new()         → 1,2,3,4,5</span></span>
<span class="line"><span style="color:#6A737D">    // .zip(skip(1))          → (1,2),(2,3),(3,4),(4,5)</span></span>
<span class="line"><span style="color:#6A737D">    // .map(|(a,b)| a*b)      → 2,6,12,20</span></span>
<span class="line"><span style="color:#6A737D">    // .filter(|x| x%3==0)   → 6,12</span></span>
<span class="line"><span style="color:#6A737D">    // .sum()                 → 18</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">zip</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">skip</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">(a, b)</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> b)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 3</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">sum</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果: {}"</span><span style="color:#E1E4E8">, result); </span><span style="color:#6A737D">// 18</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这就是”只需实现 `next`，其余全部免费”的威力。它也体现了 Rust trait 系统的核心设计哲学：最小接口 + 大量基于它的默认实现。

# 零开销抽象

## 迭代器 vs for 循环：谁更快？

初次接触迭代器时，很多人会担心：`map`、`filter` 这些高级方法会不会有额外开销？毕竟它们比手写 `for` 循环看起来”高级”多了。

答案是：**不会**。Rust 针对这个问题专门做了一个基准测试，搜索阿瑟·柯南·道尔”福尔摩斯探案集”全文中的某个单词：

```text
test bench_search_for  ... bench:  19,620,300 ns/iter (+/- 915,700)
test bench_search_iter ... bench:  19,234,900 ns/iter (+/- 657,200)
```

迭代器版本不仅没有更慢，反而**略快一点**。

## 零开销抽象是什么

这背后的原因是 Rust 的**零开销抽象**（zero-cost abstraction）原则。这个词借自 C++ 之父本贾尼·斯特劳斯特卢普：

> 从整体来说，C++ 的实现遵循了零开销原则：你不需要的，无需为它买单。更进一步：你需要的，也不可能找到更好的手写代码了。

Rust 把这个原则贯彻得更彻底。迭代器是一个**编译时抽象**——当你写 `v.iter().map(...).filter(...).sum()` 时，编译器看到的不是”调用了三个函数”，而是一整块可以整体优化的代码。最终生成的机器码与你手写的最优循环几乎一模一样。

理解零开销抽象的关键是区分**运行时抽象**和**编译时抽象**：

| 类型 | 例子 | 运行时开销 |
| --- | --- | --- |
| 运行时抽象 | 虚函数、动态派发（`dyn Trait`） | 有（查 vtable） |
| 编译时抽象 | 泛型、迭代器、闭包 | 无（编译期单态化） |

`Iterator` trait 的方法是**泛型的**——每种具体迭代器类型会在编译期生成专属的代码，不存在”通过指针间接调用”的运行时开销。

## 编译器如何做到：循环展开

来看一个来自音频解码器的真实例子。这段代码使用线性预测算法，用迭代器链对三个变量做数学运算：

```rust
# let mut buffer = [0i32; 16];
# let coefficients = [1i64; 12];
# let qlp_shift: i16 = 1;
for i in 12..buffer.len() {
    let prediction = coefficients.iter()
        .zip(&buffer[i - 12..i])
        .map(|(&c, &s)| c * s as i64)
        .sum::<i64>() >> qlp_shift;
    let delta = buffer[i];
    buffer[i] = prediction as i32 + delta;
}
```

因为 `coefficients` 的长度固定是 12，Rust 编译器**知道这个迭代只会执行 12 次**。它不会生成带循环控制逻辑（比较、跳转）的循环，而是直接把 12 次迭代**展开**（loop unrolling）成 12 段直线代码——消除了循环开销，让所有系数直接存进寄存器，也不需要运行时边界检查。

结果：迭代器链被编译成了**与手写汇编等价**的代码。

## 应该用迭代器还是 for 循环？

**性能上没有区别**，选择取决于可读性：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%2C%205%2C%206%2C%207%2C%208%2C%209%2C%2010%5D%3B%0A%0A%20%20%20%20%2F%2F%20for%20%E5%BE%AA%E7%8E%AF%E7%89%88%E6%9C%AC%0A%20%20%20%20let%20mut%20sum%20%3D%200%3B%0A%20%20%20%20for%20%26x%20in%20%26v%20%7B%0A%20%20%20%20%20%20%20%20if%20x%20%25%202%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20sum%20%2B%3D%20x%20*%20x%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22for%20%E5%BE%AA%E7%8E%AF%3A%20%7B%7D%22%2C%20sum)%3B%0A%0A%20%20%20%20%2F%2F%20%E8%BF%AD%E4%BB%A3%E5%99%A8%E7%89%88%E6%9C%AC%E2%80%94%E2%80%94%E6%84%8F%E5%9B%BE%E6%9B%B4%E6%B8%85%E6%99%B0%EF%BC%9A%22%E8%BF%87%E6%BB%A4%E5%81%B6%E6%95%B0%EF%BC%8C%E5%B9%B3%E6%96%B9%EF%BC%8C%E6%B1%82%E5%92%8C%22%0A%20%20%20%20let%20sum2%3A%20i32%20%3D%20v.iter()%0A%20%20%20%20%20%20%20%20.filter(%7C%26%26x%7C%20x%20%25%202%20%3D%3D%200)%0A%20%20%20%20%20%20%20%20.map(%7C%26x%7C%20x%20*%20x)%0A%20%20%20%20%20%20%20%20.sum()%3B%0A%20%20%20%20println!(%22%E8%BF%AD%E4%BB%A3%E5%99%A8%3A%20%7B%7D%22%2C%20sum2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">8</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">9</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // for 循环版本</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">v {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">            sum </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"for 循环: {}"</span><span style="color:#E1E4E8">, sum);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 迭代器版本——意图更清晰："过滤偶数，平方，求和"</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> sum2</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|&amp;&amp;</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|&amp;</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> x)</span></span>
<span class="line"><span style="color:#F97583">        .</span><span style="color:#B392F0">sum</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"迭代器: {}"</span><span style="color:#E1E4E8">, sum2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 对于需要跨步骤共享可变状态的复杂逻辑，`for` 循环可能更直观。其他情况优先选迭代器——代码更短、意图更清晰，编译器也更容易优化。

# 练习题

## 惰性求值与 next 测验

```rust
let v = vec![1, 2, 3];
let mut iter = v.iter();
iter.next();
iter.next();
```

加载题目中…

加载题目中…

加载题目中…

## Iterator trait 实现测验

```rust
struct Counter { count: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        if self.count <= 3 { Some(self.count) } else { None }
    }
}
```

加载题目中…

加载题目中…

## 编程练习

下面是一段简单的”词法分析”：对 token 列表，用 `next()` 单独取出第一个 token 做特殊处理，剩余的交给 `for` 循环处理。补全代码使输出符合预期——这道题考查的是 `next()` 调用会推进迭代器状态，`for` 接着从”剩余部分”继续的特性。

```rust
fn main() {
    let tokens = vec!["fn", "greet", "(", "name", ":", "String", ")", "{", "}"];
    let mut iter = tokens.iter();

    // TODO: 用 next() 取出第一个 token，打印为 "关键字: <token>"
    // 然后用 for 循环打印剩余 token，每个打印为 "  token: <token>"

}
```