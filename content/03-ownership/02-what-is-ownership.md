# 核心思想

## 什么是所有权系统

**所有权系统**是 Rust 用来管理内存的核心机制。它的基本思想很简单：**每个值都有一个所有者负责它的生命周期**。

这听起来抽象，但解决的是一个现实问题：

在其他编程语言中：

- Java/Python ：用垃圾回收器（GC）自动清理，但有运行时开销，暂停不可控
- C/C++ ：程序员手动管理内存（ malloc / free ），容易出现内存泄漏、悬垂指针、二次释放等 bug

Rust 的答案是：**在编译时通过静态分析，让编译器确保只有一个所有者负责释放每个值，从而零运行时开销地保证内存安全**。

> **易混淆概念澄清**：所有权（ownership）和可变性（mutability）是**两个完全独立**的概念。
> **所有权**：回答的问题是”谁负责释放这个值？”
> **可变性**：回答的问题是”这个值能否被修改？”
> 一个不可变的变量可以转移所有权给可变的变量；一个可变的变量也可以被销毁而不修改。它们没有必然关系。

## 三条黄金规则

所有权系统的核心思想只有三条规则。理解它们，一切都能推导出来：

**规则一**：**Rust 中每一个值都有一个「所有者（owner）」变量。**

**规则二**：**值在任一时刻有且只有一个所有者。**

**规则三**：**当所有者离开作用域，这个值将被「自动丢弃（drop）」**

这三条规则一起工作，确保：

- ✓ 没有内存泄漏（规则三：自动清理）
- ✓ 没有二次释放（规则二：只有一个所有者）
- ✓ 没有悬垂指针（规则三：所有者消失时数据也消失）
- ✓ 零运行时开销（规则一：编译期静态检查）

# 规则详解

## 规则一与二：所有者与单一性

### 问题背景：二次释放

先看一个问题。在 C 中，如果你不小心这样做：

```c
// C 语言中的问题
char* s1 = malloc(100);
char* s2 = s1;      // 两个指针指向同一块内存

free(s1);           // 释放一次
free(s2);           // 释放第二次 → 二次释放 bug！内存崩溃
```

或者在没有 GC 的环境中：

```plaintext
s1 指向堆上的数据 → s1 被释放了
s2 仍然指向那块内存 → s2 成了悬垂指针
访问 s2 → 使用已释放的内存 → 未定义行为
```

这是内存安全的大敌：**同一块内存被释放多次，或者被释放后还被访问**。

### Rust 的解决方案

Rust 通过规则一和规则二直接禁止这种情况：

> **不允许两个变量同时有效地指向同一块堆数据**

如果一个变量要把数据的控制权交给另一个变量，那就**转移所有权**——原变量失效，新变量成为唯一的所有者。这样：

- ✓ 永远只有一个所有者，只释放一次
- ✓ 原变量失效后无法访问，不存在悬垂指针
- ✓ 编译器在编译期就检查这一点，运行时零开销

看具体例子：

每个值都需要一个”主人”来负责它，而且只能有一个主人。当主人改变时，所有权就转移了：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%20%2F%2F%20s1%20%E6%8B%A5%E6%9C%89%E8%BF%99%E4%B8%AA%20String%0A%0A%20%20%20%20let%20s2%20%3D%20s1%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%20s2%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E7%8E%B0%E5%9C%A8%20s2%20%E6%98%AF%E4%B8%BB%E4%BA%BA%EF%BC%8Cs1%20%E5%A4%B1%E6%95%88%E4%BA%86%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%93%20%E5%8F%AF%E4%BB%A5%EF%BC%8Cs2%20%E6%8B%A5%E6%9C%89%E6%95%B0%E6%8D%AE%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20s1)%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%8Cs1%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// s1 拥有这个 String</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s1;                      </span><span style="color:#6A737D">// 所有权转移给 s2</span></span>
<span class="line"><span style="color:#6A737D">                                      // 现在 s2 是主人，s1 失效了</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s2);               </span><span style="color:#6A737D">// ✓ 可以，s2 拥有数据</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", s1);            // ✗ 错误，s1 已失效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**这里发生了什么**：

- s1 原本拥有 String 数据的所有权
- let s2 = s1 执行时，所有权转移给 s2
- s1 从这一刻起 失效 了（Rust 编译器禁止访问，因此也不能再通过它去做释放了）
- 只有 s2 可以访问数据，作用域结束时 s2 负责释放

**为什么 `s1` 会失效**？因为 `String` 存在堆上，有释放的成本。Rust 不允许两个变量同时指向同一块堆数据，否则就回到了”谁来释放”的问题上。

**栈类型是个例外**。整数这样的小数据存在栈上，复制成本极低，Rust 自动为它们复制而不是移动（可以再回忆下上一篇文章讲的三种数据流动方式）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%0A%0A%20%20%20%20println!(%22x%3D%7B%7D%2C%20y%3D%7B%7D%22%2C%20x%2C%20y)%3B%20%20%2F%2F%20%E2%9C%93%20%E4%B8%A4%E4%B8%AA%E9%83%BD%E6%9C%89%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;              </span><span style="color:#6A737D">// 自动复制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x={}, y={}"</span><span style="color:#E1E4E8">, x, y);  </span><span style="color:#6A737D">// ✓ 两个都有效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 规则三：作用域与自动释放

当一个变量离开作用域，它的值自动被释放（drop）。这就是 Rust 不需要手动 `free` 的原因（因此避免了手动释放的安全风险）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%20%20%2F%2F%20s%20%E4%BB%8E%E8%BF%99%E9%87%8C%E5%BC%80%E5%A7%8B%E6%9C%89%E6%95%88%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%20%20%20%20%7D%20%20%2F%2F%20s%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8CRust%20%E8%87%AA%E5%8A%A8%E8%B0%83%E7%94%A8%20drop%EF%BC%8C%E5%A0%86%E5%86%85%E5%AD%98%E8%A2%AB%E9%87%8A%E6%94%BE%0A%0A%20%20%20%20%2F%2F%20s%20%E5%B7%B2%E4%B8%8D%E5%AD%98%E5%9C%A8%EF%BC%8C%E8%AE%BF%E9%97%AE%E4%BC%9A%E6%8A%A5%E9%94%99%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// s 从这里开始有效</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">    }  </span><span style="color:#6A737D">// s 离开作用域，Rust 自动调用 drop，堆内存被释放</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // s 已不存在，访问会报错</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对比其他语言：

- Java：GC 在某个时间点清理（时机不确定）
- C：需要手动 free （容易忘记）
- Rust：作用域结束立即释放（确定且无开销）

# 所有权转移

## 什么是所有权转移？

前面讲了三条所有权规则，但有个关键概念还没深入：**当一个值从一个所有者转到另一个所有者时会发生什么**？

这就是**所有权转移**（move）——一个值的所有权从一个变量转移到另一个变量。这是 Rust 实现规则二（“值在任一时刻有且只有一个所有者”）的核心机制。

## 为什么要理解所有权转移？

回顾前面讲过的：

- 规则二 说：一个值永远只能有一个所有者
- 这意味着： 当多个变量都想”拥有”同一个值时，Rust 不允许
- Rust 的解决方案： 让原所有者失效，新变量成为唯一的所有者

所有权转移就是这个”转移”过程。理解它，才能理解 Rust 如何在编译期保证内存安全。

**核心原则**：只要一个值被”消费”了（被移动到新的所有者），所有权就转移。原所有者从此失效。这发生在以下场景：

### 场景一：赋值

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1%3B%20%20%2F%2F%20s1%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%20s2%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%20%20%2F%2F%20%E2%9C%93%20%E5%8F%AF%E4%BB%A5%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20s1)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9As1%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s1;  </span><span style="color:#6A737D">// s1 的所有权转移给 s2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s2);  </span><span style="color:#6A737D">// ✓ 可以</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", s1);  // ✗ 错误：s1 已失效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 场景二：函数传参

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20takes_ownership(s)%3B%20%20%2F%2F%20s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E5%88%B0%E5%87%BD%E6%95%B0%E5%86%85%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20s)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9As%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%7D%0A%0Afn%20takes_ownership(s%3A%20String)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D%20%20%2F%2F%20s%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8C%E5%A0%86%E5%86%85%E5%AD%98%E9%87%8A%E6%94%BE" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    takes_ownership</span><span style="color:#E1E4E8">(s);  </span><span style="color:#6A737D">// s 的所有权转移到函数内</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", s);  // ✗ 错误：s 已失效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> takes_ownership</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}  </span><span style="color:#6A737D">// s 离开作用域，堆内存释放</span></span></code></pre></div>

### 场景三：函数返回

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20gives_ownership()%3B%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E7%9A%84%20String%20%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%BB%99%20s1%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s1)%3B%0A%7D%0A%0Afn%20gives_ownership()%20-%3E%20String%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22yours%22)%3B%0A%20%20%20%20s%20%20%2F%2F%20%E8%BF%94%E5%9B%9E%20s%EF%BC%8C%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%E8%B0%83%E7%94%A8%E8%80%85%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> gives_ownership</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 函数返回的 String 所有权转给 s1</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s1);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> gives_ownership</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"yours"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    s  </span><span style="color:#6A737D">// 返回 s，所有权转移给调用者</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 其他场景

模式匹配、match 表达式、for 循环、闭包捕获等也都会转移所有权：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%A8%A1%E5%BC%8F%E5%8C%B9%E9%85%8D%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20(a%2C%20b)%20%3D%20(%22x%22%2C%20s)%3B%20%20%2F%2F%20s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E5%88%B0%E6%A8%A1%E5%BC%8F%E4%B8%AD%0A%0A%20%20%20%20%2F%2F%20match%20%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%20%20%20%20match%20b%20%7B%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20println!(%22%7B%7D%22%2C%20b)%2C%20%20%2F%2F%20b%20%E8%A2%AB%E6%B6%88%E8%B4%B9%0A%20%20%20%20%7D%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20b)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9Ab%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%0A%20%20%20%20%2F%2F%20for%20%E5%BE%AA%E7%8E%AF%0A%20%20%20%20let%20vec%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20for%20item%20in%20vec%20%7B%20%20%2F%2F%20vec%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%A2%AB%E8%BD%AC%E7%A7%BB%E5%88%B0%E8%BF%AD%E4%BB%A3%E5%99%A8%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20item)%3B%0A%20%20%20%20%7D%0A%20%20%20%20%2F%2F%20println!(%22%7B%3A%3F%7D%22%2C%20vec)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9Avec%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 模式匹配</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (a, b) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#9ECBFF">"x"</span><span style="color:#E1E4E8">, s);  </span><span style="color:#6A737D">// s 的所有权转移到模式中</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // match 表达式</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> b {</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, b),  </span><span style="color:#6A737D">// b 被消费</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", b);  // ✗ 错误：b 已失效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // for 循环</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> vec </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> item </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> vec {  </span><span style="color:#6A737D">// vec 的所有权被转移到迭代器</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, item);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{:?}", vec);  // ✗ 错误：vec 已失效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 注意：Copy 类型不转移所有权

**并非所有类型都会转移所有权！** 对于栈类型（整数、布尔等），Rust 会自动复制而不是转移：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%B5%8B%E5%80%BC%E6%97%B6%E5%A4%8D%E5%88%B6%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%3B%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%EF%BC%8C%E4%B8%8D%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20println!(%22x%3D%7B%7D%2C%20y%3D%7B%7D%22%2C%20x%2C%20y)%3B%20%20%2F%2F%20%E2%9C%93%20%E4%B8%A4%E4%B8%AA%E9%83%BD%E6%9C%89%E6%95%88%0A%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E4%BC%A0%E5%8F%82%E6%97%B6%E5%A4%8D%E5%88%B6%0A%20%20%20%20let%20a%20%3D%2042%3B%0A%20%20%20%20print_number(a)%3B%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%EF%BC%8Ca%20%E4%BB%8D%E6%9C%89%E6%95%88%0A%20%20%20%20println!(%22a%3D%7B%7D%22%2C%20a)%3B%20%20%2F%2F%20%E2%9C%93%20%E6%9C%89%E6%95%88%0A%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E6%97%B6%E5%A4%8D%E5%88%B6%0A%20%20%20%20let%20b%20%3D%20get_number()%3B%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%0A%20%20%20%20println!(%22b%3D%7B%7D%22%2C%20b)%3B%0A%7D%0A%0Afn%20print_number(x%3A%20i32)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%0A%7D%0A%0Afn%20get_number()%20-%3E%20i32%20%7B%0A%20%20%20%2042%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%BB%99%E8%B0%83%E7%94%A8%E8%80%85%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 赋值时复制</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;  </span><span style="color:#6A737D">// 自动复制，不转移所有权</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x={}, y={}"</span><span style="color:#E1E4E8">, x, y);  </span><span style="color:#6A737D">// ✓ 两个都有效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 函数传参时复制</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    print_number</span><span style="color:#E1E4E8">(a);  </span><span style="color:#6A737D">// 自动复制，a 仍有效</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a={}"</span><span style="color:#E1E4E8">, a);  </span><span style="color:#6A737D">// ✓ 有效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 函数返回时复制</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#B392F0"> get_number</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 自动复制</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"b={}"</span><span style="color:#E1E4E8">, b);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> print_number</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_number</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">    42</span><span style="color:#6A737D">  // 自动复制给调用者</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**为什么**？因为这些类型实现了 `Copy` 特征——它们存在栈上，复制成本极低，所以 Rust 默认复制而不转移。也就是说之前讲解过的三种数据流动形式中只有 Move 才会进行所有权转移。

## 对比：String vs i32

看一个更清晰的对比：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20String%EF%BC%9A%E5%A0%86%E7%B1%BB%E5%9E%8B%EF%BC%8C%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1%3B%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20s1)%3B%20%20%2F%2F%20%E2%9C%97%20s1%20%E5%B7%B2%E5%A4%B1%E6%95%88%0A%0A%20%20%20%20%2F%2F%20i32%EF%BC%9A%E6%A0%88%E7%B1%BB%E5%9E%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%0A%20%20%20%20let%20n1%20%3D%2042%3B%0A%20%20%20%20let%20n2%20%3D%20n1%3B%0A%20%20%20%20println!(%22n1%3D%7B%7D%2C%20n2%3D%7B%7D%22%2C%20n1%2C%20n2)%3B%20%20%2F%2F%20%E2%9C%93%20%E9%83%BD%E6%9C%89%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // String：堆类型，转移所有权</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> s1;</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", s1);  // ✗ s1 已失效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // i32：栈类型，自动复制</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n1 </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> n1;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"n1={}, n2={}"</span><span style="color:#E1E4E8">, n1, n2);  </span><span style="color:#6A737D">// ✓ 都有效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

|  | String（堆） | i32（栈） |
| --- | --- | --- |
| `let b = a` | 转移所有权，a 失效 | 复制值，a 仍有效 |
| `func(a)` | 转移所有权，a 失效 | 复制值，a 仍有效 |
| `return a` | 转移所有权给调用者 | 复制值给调用者 |

这样虽然工作，但对于堆类型频繁地”传进去再返回”很烦。Rust 提供了更优雅的方案——**引用**（下一篇的主题）。

# 所有权系统的作用

你可能想：所有权系统这么复杂，是不是只有堆类型才需要？**不是的。** 所有权系统的作用远不止管理堆内存。

## 所有权不只是堆的问题

即使程序中完全不用堆，所有权系统仍然有用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%A0%88%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%85%A8%E6%98%AF%20Copy%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%3B%20%20%2F%2F%20%E5%A4%8D%E5%88%B6%0A%0A%20%20%20%20println!(%22x%3D%7B%7D%2C%20y%3D%7B%7D%22%2C%20x%2C%20y)%3B%20%20%2F%2F%20%E9%83%BD%E6%9C%89%E6%95%88%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 栈类型，全是 Copy</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;  </span><span style="color:#6A737D">// 复制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x={}, y={}"</span><span style="color:#E1E4E8">, x, y);  </span><span style="color:#6A737D">// 都有效</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这里没有堆，没有内存释放的复杂性，但**所有权规则仍然在保护你**——保护的是**变量的生命周期和使用范围**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20x%20%3D%205%3B%20%20%2F%2F%20x%20%E4%BB%8E%E8%BF%99%E9%87%8C%E5%BC%80%E5%A7%8B%E6%9C%89%E6%95%88%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%20%20%2F%2F%20%E2%9C%93%20%E6%9C%89%E6%95%88%0A%20%20%20%20%7D%20%20%2F%2F%20x%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8C%E5%A4%B1%E6%95%88%0A%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20x)%3B%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9Ax%20%E5%B7%B2%E6%97%A0%E6%95%88%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E9%98%BB%E6%AD%A2%E4%BD%A0%E8%AE%BF%E9%97%AE%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// x 从这里开始有效</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);  </span><span style="color:#6A737D">// ✓ 有效</span></span>
<span class="line"><span style="color:#E1E4E8">    }  </span><span style="color:#6A737D">// x 离开作用域，失效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", x);  // ✗ 错误：x 已无效，编译器阻止你访问</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对于栈类型，所有权规则保护你的是：

- 确定的作用域 ：变量在出作用域时自动失效，不会有悬垂变量
- 清晰的生命周期 ：一眼看出变量何时存在、何时消失
- 防止意外使用 ：即使是栈变量，也不能超出作用域使用

## 所有权的真正作用

所有权系统的核心不是”防止内存泄漏”，而是**确保资源的唯一管理者**。这涵盖的远不止内存：

### 1. **规范资源的生命周期**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20file%20%3D%20std%3A%3Afs%3A%3AFile%3A%3Aopen(%22test.txt%22).ok()%3B%20%20%2F%2F%20%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6%E8%B5%84%E6%BA%90%0A%0A%20%20%20%20%2F%2F%20file%20%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%97%B6%EF%BC%8C%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%EF%BC%88%E4%B8%8D%E6%98%AF%E6%B3%84%E6%BC%8F%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> file </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fs</span><span style="color:#F97583">::</span><span style="color:#B392F0">File</span><span style="color:#F97583">::</span><span style="color:#B392F0">open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"test.txt"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">ok</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// 打开文件资源</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // file 离开作用域时，文件自动关闭（不是泄漏）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

文件、网络连接、互斥锁等**非内存资源**也需要确定的生命周期。所有权系统保证了这一点。

### 2. **防止数据竞争**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%83%BD%E6%9C%89%E4%B8%80%E4%B8%AA%E6%89%80%E6%9C%89%E8%80%85%EF%BC%8C%E4%BF%9D%E8%AF%81%E5%90%8C%E4%B8%80%E6%97%B6%E5%88%BB%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%E5%9C%B0%E6%96%B9%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%0A%20%20%20%20%2F%2F%20%E8%BF%99%E6%98%AF%20Rust%20%E6%97%A0%E9%9C%80%20GC%20%E4%B9%9F%E8%83%BD%E4%BF%9D%E8%AF%81%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E5%8E%9F%E5%9B%A0%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只能有一个所有者，保证同一时刻只有一个地方修改数据</span></span>
<span class="line"><span style="color:#6A737D">    // 这是 Rust 无需 GC 也能保证线程安全的原因</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

多个所有者 = 可能的数据竞争。Rust 通过所有权规则完全消除了这个问题。

### 3. **明确责任**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20%2F%2F%20%E4%B8%80%E7%9C%BC%E7%9C%8B%E5%87%BA%EF%BC%9A%E8%B0%81%E8%B4%9F%E8%B4%A3%E6%B8%85%E7%90%86%E8%BF%99%E4%B8%AA%20String%EF%BC%9F%E5%B0%B1%E6%98%AF%20s%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 一眼看出：谁负责清理这个 String？就是 s</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

对比其他语言：在共享指针或 GC 环境中，你永远不知道谁负责清理。Rust 中，**所有权明确说明了责任**。

## 总结：所有权的三大价值

| 价值 | 作用 | 例子 |
| --- | --- | --- |
| **内存安全** | 防止悬垂指针、二次释放、内存泄漏 | String、Vec |
| **资源安全** | 确保文件、锁等资源的确定释放 | 文件、Mutex |
| **并发安全** | 编译期防止数据竞争，无需原子操作或锁 | 多线程代码 |

所以，所有权系统的用处不是”只用堆才有用”，而是**贯穿整个程序，保证所有资源的安全管理**。

# 练习题

## 所有权规则测验

```rust
fn main() {
    let s1 = String::from("rust");
    let s2 = s1;
    println!("{}", s1);
}
```

加载题目中…

## 所有权转移的场景判断

加载题目中…

## Copy vs Move

```rust
fn main() {
    let a = 42;
    let b = a;
    let s1 = String::from("hi");
    let s2 = s1;
}
```

加载题目中…

## 作用域与 Drop

```rust
fn main() {
    {
        let s = String::from("hello");
        println!("{}", s);
    }
}
```

加载题目中…

## 栈类型的所有权保护

```rust
fn main() {
    let x = 10;
    {
        let y = x;  // 复制，因为 i32 是 Copy
        // y 是 x 的一个独立副本
    }
    println!("{}", x);  // ✓ 可以，x 仍有效
}
```

加载题目中…

## 所有权与可变性的独立性

```rust
fn main() {
    let immutable = String::from("hello");  // 不可变，但有所有权
    let mut mutable = immutable;             // 可变，获得所有权
    mutable.push_str("!");                   // ✓ 可以修改
    // println!("{}", immutable);             // ✗ 错误，所有权已转移
}
```

加载题目中…

## 编程练习：修复所有权错误

下面的代码有所有权错误，请修复它，使输出为 `s1 = hello, s2 = hello`。

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("s1 = {}, s2 = {}", s1, s2);
}
```

**提示**：想想上一章讲过的”三种数据流动方式”，怎样才能让 s1 和 s2 都有效？

---

下面的代码没有正确接收函数返回的所有权，请修复它使其能正常输出。

```rust
fn create_string() -> String {
    String::from("hello")
}

fn main() {
    create_string();  // 这里没有接收返回值
    println!("{}", s);  // s 没有被定义
}
```

**提示**：函数返回一个 String，调用者需要用变量接收它。所有权会从函数转移到这个接收变量。