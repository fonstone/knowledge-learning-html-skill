# 为什么需要 unsafe

Rust 的安全保证来自编译器——借用检查器、类型系统、生命周期检查，它们在编译期拦截了绝大多数内存错误。但这套系统并非万能：有时候你写的代码**确实是安全的**，编译器却因为信息不足而无法证明。

典型场景：

- 调用 C 语言函数——编译器不了解 C 的内存契约
- 直接操作硬件寄存器——访问地址由硬件手册决定，而非 Rust 类型系统
- 实现 Vec 、 Arc 这样的底层数据结构——需要手动管理内存布局

为了支持这些场景，Rust 提供了 `unsafe` 关键字，让你对编译器说：“这里我比你更了解情况，放行。“

## unsafe 块做了什么（和你以为的不一样）

**常见误解**：`unsafe {}` 会关闭借用检查器。

**实际上**：`unsafe` 块**不会**禁用任何安全检查。借用规则、生命周期、类型检查在 `unsafe` 块里一样全力运行。`unsafe` 只是**解锁了五种额外操作**，在普通代码里这五种操作是被禁止的。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20x%20%3D%205%3B%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%9C%A8%20unsafe%20%E5%9D%97%E9%87%8C%EF%BC%8C%E5%80%9F%E7%94%A8%E6%A3%80%E6%9F%A5%E5%99%A8%E4%BB%8D%E7%84%B6%E5%B7%A5%E4%BD%9C%0A%20%20%20%20%20%20%20%20let%20r1%20%3D%20%26x%3B%0A%20%20%20%20%20%20%20%20let%20r2%20%3D%20%26x%3B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%7B%7D%22%2C%20r1%2C%20r2)%3B%20%2F%2F%20%E6%AD%A3%E5%B8%B8%EF%BC%9A%E4%B8%A4%E4%B8%AA%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%0A%0A%20%20%20%20%20%20%20%20%2F%2F%20%E4%B8%8B%E9%9D%A2%E8%BF%99%E8%A1%8C%E5%9C%A8%20unsafe%20%E9%87%8C%E4%B9%9F%E4%BC%9A%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%EF%BC%9A%0A%20%20%20%20%20%20%20%20%2F%2F%20let%20r3%20%3D%20%26mut%20x%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E4%BB%8D%E7%84%B6%E6%B4%BB%E8%B7%83%0A%20%20%20%20%20%20%20%20let%20_%20%3D%20r1%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20unsafe%20%E5%9D%97%E5%94%AF%E4%B8%80%E5%81%9A%E7%9A%84%E4%BA%8B%EF%BC%9A%E5%85%81%E8%AE%B8%E8%A7%A3%E5%BC%95%E7%94%A8%E8%A3%B8%E6%8C%87%E9%92%88%0A%20%20%20%20let%20raw%20%3D%20%26mut%20x%20as%20*mut%20i32%3B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20*raw%20%2B%3D%201%3B%20%2F%2F%20%E5%8F%AA%E6%9C%89%E8%BF%99%E6%AD%A5%E9%9C%80%E8%A6%81%20unsafe%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20x)%3B%20%2F%2F%206%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 在 unsafe 块里，借用检查器仍然工作</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x;</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {}"</span><span style="color:#E1E4E8">, r1, r2); </span><span style="color:#6A737D">// 正常：两个不可变借用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">        // 下面这行在 unsafe 里也会编译失败：</span></span>
<span class="line"><span style="color:#6A737D">        // let r3 = &amp;mut x; // 错误：不可变借用仍然活跃</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> _ </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> r1;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // unsafe 块唯一做的事：允许解引用裸指针</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> raw </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">as</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">raw </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 只有这步需要 unsafe</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, x); </span><span style="color:#6A737D">// 6</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **关键心智模型**：`unsafe` 是你对编译器做出的**承诺**——“我检查过了，这里的内存操作是安全的”。责任从编译器转移到了你。

## 五大 unsafe 超能力

只有以下五种操作需要 `unsafe` 块或 `unsafe` 标注，其他的什么都不需要：

| 操作 | 为何危险 |
| --- | --- |
| 解引用裸指针 `*const T` / `*mut T` | 指针可能为空、已释放或未对齐 |
| 调用 `unsafe` 函数或方法 | 函数要求调用者满足特定前提条件 |
| 读写可变静态变量 `static mut` | 多线程下存在数据竞争风险 |
| 实现 `unsafe trait` | trait 要求实现者保证某些编译器无法验证的契约 |
| 访问 `union` 的字段 | union 的内存解释完全由你负责 |

# 五大超能力详解

## 超能力一：解引用裸指针

**为什么编译器不允许？**

Rust 的引用（`&T` / `&mut T`）有严格的编译期保证：总是有效、非 null、已对齐、有正确的生命周期。裸指针（`*const T` / `*mut T`）没有任何这些保证——它可能是 null、指向已释放的内存、指向未初始化的数据，或者根本没有对齐。编译器无法检查，所以默认禁止。

**什么时候真正需要它？**

- 调用 C 函数：C 的 API 返回裸指针，你必须解引用才能读数据
- 构建双向链表、自引用结构——这些结构用安全引用无法表达
- 在手动分配的内存上读写数据（如实现自己的 Vec 或内存池）

**你需要保证什么：** 解引用时，指针非 null、指向已初始化的有效内存、内存对齐满足 `T` 的要求、且指向的数据在整个使用期间不会被释放。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042i32%3B%0A%0A%20%20%20%20%2F%2F%20%E5%88%9B%E5%BB%BA%E8%A3%B8%E6%8C%87%E9%92%88%E4%B8%8D%E9%9C%80%E8%A6%81%20unsafe%E2%80%94%E2%80%94%E5%8F%AA%E6%98%AF%E8%AE%B0%E5%BD%95%E4%BA%86%E4%B8%80%E4%B8%AA%E5%9C%B0%E5%9D%80%0A%20%20%20%20let%20ptr%3A%20*const%20i32%20%3D%20%26x%20as%20*const%20i32%3B%0A%0A%20%20%20%20%2F%2F%20%E8%A7%A3%E5%BC%95%E7%94%A8%E9%9C%80%E8%A6%81%20unsafe%EF%BC%8C%E5%9B%A0%E4%B8%BA%E7%BC%96%E8%AF%91%E5%99%A8%E6%97%A0%E6%B3%95%E4%BF%9D%E8%AF%81%20ptr%20%E6%9C%89%E6%95%88%0A%20%20%20%20%2F%2F%20%E4%BD%86%E6%88%91%E4%BB%AC%E7%9F%A5%E9%81%93%E5%AE%83%E6%9C%89%E6%95%88%EF%BC%9Aptr%20%E6%9D%A5%E8%87%AA%E5%90%88%E6%B3%95%E5%BC%95%E7%94%A8%EF%BC%8Cx%20%E8%BF%98%E6%B4%BB%E7%9D%80%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E9%80%9A%E8%BF%87%E8%A3%B8%E6%8C%87%E9%92%88%E8%AF%BB%E5%8F%96%3A%20%7B%7D%22%2C%20*ptr)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E6%BC%94%E7%A4%BA%E5%8D%B1%E9%99%A9%EF%BC%9Anull%20%E6%8C%87%E9%92%88%E8%A7%A3%E5%BC%95%E7%94%A8%20%3D%20%E7%A8%8B%E5%BA%8F%E5%B4%A9%E6%BA%83%0A%20%20%20%20let%20null_ptr%3A%20*const%20i32%20%3D%20std%3A%3Aptr%3A%3Anull()%3B%0A%20%20%20%20println!(%22null%20%E6%8C%87%E9%92%88%E6%98%AF%E5%90%A6%E4%B8%BA%20null%3A%20%7B%7D%22%2C%20null_ptr.is_null())%3B%0A%20%20%20%20%2F%2F%20unsafe%20%7B%20println!(%22%7B%7D%22%2C%20*null_ptr)%3B%20%7D%20%2F%2F%20%E5%8D%83%E4%B8%87%E5%88%AB%E8%BF%99%E6%A0%B7%E5%81%9A%EF%BC%8C%E7%9B%B4%E6%8E%A5%20crash%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 创建裸指针不需要 unsafe——只是记录了一个地址</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">as</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 解引用需要 unsafe，因为编译器无法保证 ptr 有效</span></span>
<span class="line"><span style="color:#6A737D">    // 但我们知道它有效：ptr 来自合法引用，x 还活着</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"通过裸指针读取: {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">ptr);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 演示危险：null 指针解引用 = 程序崩溃</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> null_ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"null 指针是否为 null: {}"</span><span style="color:#E1E4E8">, null_ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_null</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#6A737D">    // unsafe { println!("{}", *null_ptr); } // 千万别这样做，直接 crash</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 一句话记忆：**创建裸指针安全，解引用裸指针危险**。

## 超能力二：调用 unsafe 函数

**为什么编译器不允许？**

有些函数的正确性依赖于调用者必须满足的前提条件，但这些条件无法用类型系统表达，编译器检查不了。例如：

- std::str::from_utf8_unchecked(bytes) — 要求字节序列是合法的 UTF-8，否则字符串乱码或 panic
- Vec::set_len(new_len) — 要求 new_len 不超过容量且新范围内的元素已初始化，否则访问未初始化内存
- slice::get_unchecked(idx) — 要求 idx 在范围内，否则越界读

这类函数把安全责任明确转移给调用者，用 `unsafe fn` 标注是一种警告：**“调用我之前，你必须自己检查。”**

**什么时候真正需要它？**

- 性能敏感路径，已经在外部验证了条件，不想再做重复的边界检查
- FFI：所有 extern "C" 函数都是隐式 unsafe fn
- 标准库底层实现内部

**你需要保证什么：** 该函数的 `# Safety` 文档里写了什么，你就保证什么。没有 `# Safety` 文档的 `unsafe fn` 是写得不够好的代码。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20bytes%20%3D%20vec!%5B104u8%2C%20101%2C%20108%2C%20108%2C%20111%5D%3B%20%2F%2F%20%22hello%22%20%E7%9A%84%20UTF-8%0A%0A%20%20%20%20%2F%2F%20%E5%AE%89%E5%85%A8%E7%89%88%E6%9C%AC%EF%BC%9A%E4%BC%9A%E9%AA%8C%E8%AF%81%20UTF-8%EF%BC%8C%E8%BF%94%E5%9B%9E%20Result%0A%20%20%20%20let%20s_safe%20%3D%20std%3A%3Astr%3A%3Afrom_utf8(%26bytes).unwrap()%3B%0A%20%20%20%20println!(%22%E5%AE%89%E5%85%A8%E7%89%88%E6%9C%AC%3A%20%7B%7D%22%2C%20s_safe)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E5%AE%89%E5%85%A8%E7%89%88%E6%9C%AC%EF%BC%9A%E8%B7%B3%E8%BF%87%E9%AA%8C%E8%AF%81%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%BD%AC%E6%8D%A2%0A%20%20%20%20%2F%2F%20%E6%88%91%E4%BB%AC%E4%BF%9D%E8%AF%81%E4%BA%86%20bytes%20%E7%A1%AE%E5%AE%9E%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%20UTF-8%0A%20%20%20%20let%20s_fast%20%3D%20unsafe%20%7B%20std%3A%3Astr%3A%3Afrom_utf8_unchecked(%26bytes)%20%7D%3B%0A%20%20%20%20println!(%22%E4%B8%8D%E5%AE%89%E5%85%A8%E7%89%88%E6%9C%AC%3A%20%7B%7D%22%2C%20s_fast)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E4%BC%A0%E5%85%A5%E9%9D%9E%E6%B3%95%20UTF-8%EF%BC%8Cfrom_utf8_unchecked%20%E4%BC%9A%E4%BA%A7%E7%94%9F%E6%9C%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E4%B8%BA%0A%20%20%20%20%2F%2F%20%E8%BF%99%E6%AD%A3%E6%98%AF%E5%AE%83%E9%9C%80%E8%A6%81%20unsafe%20%E7%9A%84%E5%8E%9F%E5%9B%A0%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> bytes </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">104</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">101</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">108</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">108</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">111</span><span style="color:#E1E4E8">]; </span><span style="color:#6A737D">// "hello" 的 UTF-8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 安全版本：会验证 UTF-8，返回 Result</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s_safe </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">str</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_utf8</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">bytes)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"安全版本: {}"</span><span style="color:#E1E4E8">, s_safe);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 不安全版本：跳过验证，直接转换</span></span>
<span class="line"><span style="color:#6A737D">    // 我们保证了 bytes 确实是合法的 UTF-8</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s_fast </span><span style="color:#F97583">=</span><span style="color:#F97583"> unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">str</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_utf8_unchecked</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">bytes) };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"不安全版本: {}"</span><span style="color:#E1E4E8">, s_fast);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果传入非法 UTF-8，from_utf8_unchecked 会产生未定义行为</span></span>
<span class="line"><span style="color:#6A737D">    // 这正是它需要 unsafe 的原因</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 注意：所有通过 `extern "C"` 声明的 C 函数都属于这一类——Rust 编译器看不到 C 的实现，无法验证安全性，所以调用 C 函数也需要 `unsafe` 块。

## 超能力三：读写可变静态变量

**为什么编译器不允许？**

不可变静态变量（`static FOO: i32 = 0`）是安全的，因为只读不存在竞争。可变静态变量（`static mut`）是全局共享的可变状态——如果两个线程同时读写同一个全局变量，就会产生**数据竞争**（data race），这是未定义行为。

编译器无法知道你的程序在哪里会产生多线程访问，所以对所有 `static mut` 的读写都要求 `unsafe`，把”我保证不会有并发访问”这个责任交给你。

**什么时候真正需要它？**

- 嵌入式系统：中断处理程序和主循环共享的硬件寄存器状态
- 单线程小程序里的简单全局计数器
- 与 C 代码共享全局变量（C 常用全局状态）

**你需要保证什么：** 要么程序是单线程的；要么对这个变量的所有访问都通过互斥锁（`Mutex`）或原子操作保护。

> **既然有 `Mutex`，为何不直接用 `static Mutex<T>` 代替 `static mut`？**
> 对于普通应用代码，这**完全可以**，也是推荐做法——`static Mutex<T>` 不需要 `unsafe`，且天然线程安全。但 `static mut` 在某些场景下不可替代：
> **嵌入式 / `no_std` 环境**：没有操作系统，标准库的 `Mutex` 依赖 OS 的阻塞原语，根本无法使用
> **FFI / 与 C 交互**：C 代码不认识 Rust 的 `Mutex`，共享全局状态只能用裸变量
> **极致性能路径**：已在外部保证了单线程访问，不想引入任何加锁开销
> 所以 `static mut` 主要留给系统级、嵌入式和 FFI 场景；普通代码尽量用 `static Mutex<T>` 或 `static AtomicXxx`。

<div class="code-runner" data-full-code="static%20mut%20REQUEST_COUNT%3A%20u64%20%3D%200%3B%0A%0A%2F%2F%20%E5%81%87%E8%AE%BE%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%E5%8F%AA%E4%BC%9A%E5%9C%A8%E5%8D%95%E7%BA%BF%E7%A8%8B%E4%B8%AD%E8%A2%AB%E8%B0%83%E7%94%A8%0Afn%20handle_request()%20%7B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20REQUEST_COUNT%20%2B%3D%201%3B%0A%20%20%20%20%7D%0A%20%20%20%20%2F%2F%20%E5%A4%84%E7%90%86%E8%AF%B7%E6%B1%82%E9%80%BB%E8%BE%91...%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20handle_request()%3B%0A%20%20%20%20handle_request()%3B%0A%20%20%20%20handle_request()%3B%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%A4%84%E7%90%86%E4%BA%86%20%7B%7D%20%E4%B8%AA%E8%AF%B7%E6%B1%82%22%2C%20REQUEST_COUNT)%3B%20%2F%2F%203%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">static</span><span style="color:#F97583"> mut</span><span style="color:#79B8FF"> REQUEST_COUNT</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 假设这个函数只会在单线程中被调用</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> handle_request</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        REQUEST_COUNT</span><span style="color:#F97583"> +=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#6A737D">    // 处理请求逻辑...</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    handle_request</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    handle_request</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    handle_request</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"处理了 {} 个请求"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">REQUEST_COUNT</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 3</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **生产代码的替代方案**：用 `std::sync::atomic::AtomicU64` 代替 `static mut u64`，用 `Mutex<T>` 代替 `static mut T`。它们的读写不需要 `unsafe`，且天然线程安全。

## 超能力四：实现 unsafe trait

**什么是 unsafe trait？**

普通的 trait 只是一组方法签名，编译器可以验证你的实现类型是否匹配。但有些 trait 还附带一条**编译器无法验证的安全承诺**——这样的 trait 就标注为 `unsafe trait`，实现它时必须写 `unsafe impl`，意思是：“我承诺满足了那条隐性规则。”

用一个具体例子来建立直觉。先想想这个问题：如果你要把一块内存里的所有字节都设为 `0`，然后把它当作某个类型的值来用，这安全吗？

答案是：**看类型**。

- u32 ：4 个字节全零 = 数字 0 ，完全合法
- bool ：只允许 0 （false）或 1 （true），全零是 0 ，合法
- &str ：是一个指针，全零 = null 指针， Rust 的引用不允许为 null，立刻未定义行为

编译器知道每种类型占多少字节，但它**不知道哪些字节模式对这个类型是合法值**——这是语义层面的规则，只有程序员才清楚。

这就是 `unsafe trait` 的用武之地：让程序员用 `unsafe impl` 向编译器做出承诺：

<div class="code-runner" data-full-code="%2F%2F%20%E5%AE%9A%E4%B9%89%E4%B8%80%E4%B8%AA%20unsafe%20trait%EF%BC%8C%E9%99%84%E5%B8%A6%E4%B8%80%E6%9D%A1%E6%89%BF%E8%AF%BA%EF%BC%9A%0A%2F%2F%20%22%E5%AE%9E%E7%8E%B0%E4%BA%86%E8%BF%99%E4%B8%AA%20trait%20%E7%9A%84%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%85%A8%E9%9B%B6%E5%AD%97%E8%8A%82%E6%98%AF%E5%90%88%E6%B3%95%E5%80%BC%22%0Aunsafe%20trait%20Zeroable%20%7B%7D%0A%0A%2F%2F%20u32%20%E5%85%A8%E9%9B%B6%E5%B0%B1%E6%98%AF%E6%95%B0%E5%AD%97%200%EF%BC%8C%E5%90%88%E6%B3%95%EF%BC%8C%E6%88%91%E4%BB%AC%E6%89%BF%E8%AF%BA%0Aunsafe%20impl%20Zeroable%20for%20u32%20%7B%7D%0A%0A%2F%2F%20bool%20%E5%85%A8%E9%9B%B6%E5%B0%B1%E6%98%AF%20false%EF%BC%8C%E4%B9%9F%E5%90%88%E6%B3%95%0Aunsafe%20impl%20Zeroable%20for%20bool%20%7B%7D%0A%0A%2F%2F%20%26str%20%E6%88%91%E4%BB%AC%E4%B8%8D%E5%AE%9E%E7%8E%B0%20%E2%80%94%E2%80%94%20null%20%E5%BC%95%E7%94%A8%E6%98%AF%E6%9C%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E4%B8%BA%EF%BC%8C%E4%B8%8D%E8%83%BD%E6%89%BF%E8%AF%BA%0A%0A%2F%2F%20%E6%9C%89%E4%BA%86%20Zeroable%20%E7%BA%A6%E6%9D%9F%EF%BC%8C%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%E6%89%8D%E6%95%A2%E8%B0%83%E7%94%A8%20mem%3A%3Azeroed%0Afn%20zeroed%3CT%3A%20Zeroable%3E()%20-%3E%20T%20%7B%0A%20%20%20%20unsafe%20%7B%20std%3A%3Amem%3A%3Azeroed()%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20n%3A%20u32%20%3D%20zeroed()%3B%0A%20%20%20%20let%20b%3A%20bool%20%3D%20zeroed()%3B%0A%20%20%20%20println!(%22u32%3A%20%7B%7D%22%2C%20n)%3B%20%20%20%2F%2F%200%0A%20%20%20%20println!(%22bool%3A%20%7B%7D%22%2C%20b)%3B%20%20%2F%2F%20false%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 定义一个 unsafe trait，附带一条承诺：</span></span>
<span class="line"><span style="color:#6A737D">// "实现了这个 trait 的类型，全零字节是合法值"</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> trait</span><span style="color:#B392F0"> Zeroable</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// u32 全零就是数字 0，合法，我们承诺</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Zeroable</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// bool 全零就是 false，也合法</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Zeroable</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// &amp;str 我们不实现 —— null 引用是未定义行为，不能承诺</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 有了 Zeroable 约束，这个函数才敢调用 mem::zeroed</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> zeroed</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Zeroable</span><span style="color:#E1E4E8">&gt;() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> T</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">mem</span><span style="color:#F97583">::</span><span style="color:#B392F0">zeroed</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> zeroed</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> zeroed</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"u32: {}"</span><span style="color:#E1E4E8">, n);   </span><span style="color:#6A737D">// 0</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"bool: {}"</span><span style="color:#E1E4E8">, b);  </span><span style="color:#6A737D">// false</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**整个过程的逻辑链：**

1. std::mem::zeroed::<T>() 把 T 的内存全部清零并返回——这是 unsafe fn ，因为编译器不知道全零对 T 是否合法
1. 我们定义 Zeroable trait，语义是”全零合法”的承诺
1. zeroed<T: Zeroable> 函数里，因为 T 被约束为 Zeroable ，我们知道全零一定合法，所以可以安心调用 mem::zeroed
1. 调用者只能对 u32 、 bool 这些我们手动 unsafe impl 过的类型使用 zeroed() ——如果尝试 zeroed::<&str>() ，编译器会直接报错

> 写下 `unsafe impl` 不会让类型自动变安全——编译器只是信任了你的承诺。如果承诺是错的（比如为 `&str` 实现 `Zeroable`），程序照样崩溃，编译器不会再阻拦你。

## 超能力五：访问 union 字段

**为什么编译器不允许？**

`union` 的所有字段共享同一块内存。当你写入 `u.i = 42`，之后读 `u.f`，得到的是把 `42i32` 的内存字节解释为 `f32` 的结果——这可能是一个无意义的浮点数，也可能引发更严重的问题（如把整数当指针解引用）。编译器不会跟踪”当前这个 union 里存的是哪个类型”，所以读取任何字段都需要你承诺”我知道现在存的是这个类型”。

**什么时候真正需要它？**

- FFI：C 语言大量使用 union（如 sockaddr 网络地址结构、 ioctl 参数）
- 位操作技巧：把 f32 的内存位直接当 u32 读（fast inverse square root 算法就用了这个）
- 手动实现带标签的 union（不过 Rust 的 enum 在大多数场合更好）

**你需要保证什么：** 读取某个字段时，union 中存储的确实是该字段的有效值，且该值满足该类型的有效性约束（如引用类型的字段不能是无效地址）。

<div class="code-runner" data-full-code="union%20FloatBits%20%7B%0A%20%20%20%20f%3A%20f32%2C%0A%20%20%20%20bits%3A%20u32%2C%0A%7D%0A%0Afn%20float_to_bits(val%3A%20f32)%20-%3E%20u32%20%7B%0A%20%20%20%20let%20u%20%3D%20FloatBits%20%7B%20f%3A%20val%20%7D%3B%0A%20%20%20%20unsafe%20%7B%20u.bits%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%88%A9%E7%94%A8%20union%20%E6%9F%A5%E7%9C%8B%E6%B5%AE%E7%82%B9%E6%95%B0%E7%9A%84%E5%86%85%E9%83%A8%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A8%E7%A4%BA%0A%20%20%20%20println!(%221.0%20%E7%9A%84%E4%BD%8D%E8%A1%A8%E7%A4%BA%3A%20%7B%3A%23010x%7D%22%2C%20float_to_bits(1.0))%3B%20%20%20%2F%2F%200x3f800000%0A%20%20%20%20println!(%220.5%20%E7%9A%84%E4%BD%8D%E8%A1%A8%E7%A4%BA%3A%20%7B%3A%23010x%7D%22%2C%20float_to_bits(0.5))%3B%20%20%20%2F%2F%200x3f000000%0A%20%20%20%20println!(%22-1.0%20%E7%9A%84%E4%BD%8D%E8%A1%A8%E7%A4%BA%3A%20%7B%3A%23010x%7D%22%2C%20float_to_bits(-1.0))%3B%20%2F%2F%200xbf800000%0A%0A%20%20%20%20%2F%2F%20%E6%BC%94%E7%A4%BA%E5%8D%B1%E9%99%A9%EF%BC%9A%E5%86%99%E5%85%A5%20i%EF%BC%8C%E8%AF%BB%E5%8F%96%20f%0A%20%20%20%20let%20u%20%3D%20FloatBits%20%7B%20bits%3A%200x40000000%20%7D%3B%20%2F%2F%202.0f32%20%E7%9A%84%E4%BD%8D%E8%A1%A8%E7%A4%BA%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22bits%3D0x40000000%20%E8%A7%A3%E9%87%8A%E4%B8%BA%20f32%3A%20%7B%7D%22%2C%20u.f)%3B%20%2F%2F%202.0%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">union</span><span style="color:#B392F0"> FloatBits</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    f</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    bits</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> float_to_bits</span><span style="color:#E1E4E8">(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> u </span><span style="color:#F97583">=</span><span style="color:#B392F0"> FloatBits</span><span style="color:#E1E4E8"> { f</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> val };</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> { u</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">bits }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 利用 union 查看浮点数的内部二进制表示</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1.0 的位表示: {:#010x}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">float_to_bits</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1.0</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 0x3f800000</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"0.5 的位表示: {:#010x}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">float_to_bits</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0.5</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 0x3f000000</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"-1.0 的位表示: {:#010x}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">float_to_bits</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">-</span><span style="color:#79B8FF">1.0</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 0xbf800000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 演示危险：写入 i，读取 f</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> u </span><span style="color:#F97583">=</span><span style="color:#B392F0"> FloatBits</span><span style="color:#E1E4E8"> { bits</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0x40000000</span><span style="color:#E1E4E8"> }; </span><span style="color:#6A737D">// 2.0f32 的位表示</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"bits=0x40000000 解释为 f32: {}"</span><span style="color:#E1E4E8">, u</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">f); </span><span style="color:#6A737D">// 2.0</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **与 enum 的对比**：Rust 的 `enum` 是”有标签的 union”——编译器自动跟踪当前存的是哪个变体，读取时通过 `match` 确保类型正确。没有特殊需求（FFI、位操作）时，优先用 `enum` 而非 `union`。

# 练习题

## unsafe 基础测验

加载题目中…

加载题目中…

```rust
static mut TOTAL: i32 = 0;

fn add(n: i32) {
    TOTAL += n;
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的代码尝试通过裸指针交换两个变量的值，但缺少必要的 `unsafe` 标注，请修复它：

```rust
fn swap_via_ptr(a: &mut i32, b: &mut i32) {
    let pa: *mut i32 = a as *mut i32;
    let pb: *mut i32 = b as *mut i32;
    let tmp = *pa;   // 需要 unsafe
    *pa = *pb;       // 需要 unsafe
    *pb = tmp;       // 需要 unsafe
}

fn main() {
    let mut x = 10;
    let mut y = 20;
    swap_via_ptr(&mut x, &mut y);
    println!("x={}, y={}", x, y);
}
```