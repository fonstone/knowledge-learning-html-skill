# unsafe 函数

## 什么时候需要 unsafe fn

当一个函数有**调用者必须满足但编译器无法验证的前提条件**时，就需要标注 `unsafe fn`。

常见场景：

- 函数接收裸指针，要求调用者保证指针有效且对齐
- 函数操作全局状态，要求单线程调用
- 函数调用了 C 代码，要求参数满足 C 接口的约定

标注 `unsafe fn` 的含义：**这个函数把安全责任转移给调用者**。

## unsafe fn 的基本语法

<div class="code-runner" data-full-code="%2F%2F%2F%20%23%20Safety%0A%2F%2F%2F%0A%2F%2F%2F%20-%20%60ptr%60%20%E5%BF%85%E9%A1%BB%E6%8C%87%E5%90%91%E4%B8%80%E4%B8%AA%E6%9C%89%E6%95%88%E7%9A%84%E3%80%81%E5%B7%B2%E5%88%9D%E5%A7%8B%E5%8C%96%E7%9A%84%20%60i32%60%20%E5%80%BC%0A%2F%2F%2F%20-%20%60ptr%60%20%E5%BF%85%E9%A1%BB%E5%9C%A8%E6%95%B4%E4%B8%AA%E8%B0%83%E7%94%A8%E6%9C%9F%E9%97%B4%E4%BF%9D%E6%8C%81%E6%9C%89%E6%95%88%EF%BC%88%E4%B8%8D%E8%83%BD%E6%98%AF%E6%82%AC%E5%9E%82%E6%8C%87%E9%92%88%EF%BC%89%0Aunsafe%20fn%20read_unchecked(ptr%3A%20*const%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20*ptr%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042%3B%0A%20%20%20%20%2F%2F%20%E8%B0%83%E7%94%A8%20unsafe%20fn%20%E9%9C%80%E8%A6%81%20unsafe%20%E5%9D%97%0A%20%20%20%20let%20val%20%3D%20unsafe%20%7B%20read_unchecked(%26x%20as%20*const%20i32)%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20val)%3B%20%2F%2F%2042%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">/// # Safety</span></span>
<span class="line"><span style="color:#6A737D">///</span></span>
<span class="line"><span style="color:#6A737D">/// - `ptr` 必须指向一个有效的、已初始化的 `i32` 值</span></span>
<span class="line"><span style="color:#6A737D">/// - `ptr` 必须在整个调用期间保持有效（不能是悬垂指针）</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> read_unchecked</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    *</span><span style="color:#E1E4E8">ptr</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">    // 调用 unsafe fn 需要 unsafe 块</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> val </span><span style="color:#F97583">=</span><span style="color:#F97583"> unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">read_unchecked</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">as</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, val); </span><span style="color:#6A737D">// 42</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **`# Safety` 文档节**是 Rust 社区的约定：每个 `unsafe fn` 都应该有一个 `# Safety` 文档注释，说明调用者需要满足什么条件。这是 unsafe 代码可维护性的关键。

## unsafe fn 内部也需要 unsafe 块

**Rust 2021 和 2024 edition 在这里行为不同：**

- 2021 edition ： unsafe fn 的函数体是一个隐式的 unsafe 块，内部的危险操作不需要额外的 unsafe {}
- 2024 edition ：即使在 unsafe fn 内，每个危险操作也必须显式加 unsafe {} 块

2024 edition 的改动是故意的——强迫你精确标出每一个危险点，而不是让整个函数体”默认危险”，更容易做代码审查。本教程使用 2024 edition，所以你会看到 `unsafe fn` 内部仍然有 `unsafe {}` 块：

<div class="code-runner" data-full-code="unsafe%20fn%20process(ptr%3A%20*mut%20i32%2C%20count%3A%20usize)%20%7B%0A%20%20%20%20%2F%2F%202024%20edition%EF%BC%9A%E5%8D%B3%E4%BD%BF%E5%9C%A8%20unsafe%20fn%20%E5%86%85%EF%BC%8C%E5%8D%B1%E9%99%A9%E6%93%8D%E4%BD%9C%E4%B9%9F%E8%A6%81%E6%98%BE%E5%BC%8F%E6%A0%87%E5%87%BA%0A%20%20%20%20for%20i%20in%200..count%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20*ptr.add(i)%20*%3D%202%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20arr%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20process(arr.as_mut_ptr()%2C%20arr.len())%3B%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20arr)%3B%20%2F%2F%20%5B2%2C%204%2C%206%2C%208%2C%2010%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> process</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#6A737D">    // 2024 edition：即使在 unsafe fn 内，危险操作也要显式标出</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583">..</span><span style="color:#E1E4E8">count {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            *</span><span style="color:#E1E4E8">ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(i) </span><span style="color:#F97583">*=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> arr </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        process</span><span style="color:#E1E4E8">(arr</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_mut_ptr</span><span style="color:#E1E4E8">(), arr</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, arr); </span><span style="color:#6A737D">// [2, 4, 6, 8, 10]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 外部函数（extern fn）

通过 `extern "C"` 块声明的外部函数（通常来自 C 库）是隐式 `unsafe` 的——调用它们需要 `unsafe` 块：

```rust
extern "C" {
    fn abs(x: i32) -> i32;        // C 标准库的 abs 函数
    fn strlen(s: *const u8) -> usize;
}

fn main() {
    let result = unsafe { abs(-42) };
    println!("{}", result); // 42
}
```

为什么外部函数是 unsafe？因为 Rust 编译器对 C 代码一无所知——它无法验证 C 函数的内存安全性，所以要求调用者承担责任。

# unsafe Trait

## 什么是 unsafe trait

`unsafe trait` 表示这个 trait 有**实现者必须手动保证的安全不变量**，编译器无法自动验证。

最重要的两个例子是 `Send` 和 `Sync`：

| Trait | 含义 | 编译器自动实现的条件 |
| --- | --- | --- |
| `Send` | 类型可以安全地移动到另一个线程 | 所有字段都是 `Send` |
| `Sync` | 类型可以安全地被多个线程共享引用 | 所有字段都是 `Sync` |

## 手动实现 Send 和 Sync

当你的类型包含裸指针时，编译器会保守地不自动实现 `Send` 和 `Sync`。如果你确认线程安全，需要手动用 `unsafe impl` 声明：

<div class="code-runner" data-full-code="use%20std%3A%3Async%3A%3Aatomic%3A%3A%7BAtomicI32%2C%20Ordering%7D%3B%0A%0A%2F%2F%20%E5%8C%85%E5%90%AB%E8%A3%B8%E6%8C%87%E9%92%88%E7%9A%84%E7%B1%BB%E5%9E%8B%EF%BC%9A%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%8D%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%AE%9E%E7%8E%B0%20Send%2FSync%0Astruct%20AtomicCounter%20%7B%0A%20%20%20%20inner%3A%20*mut%20AtomicI32%2C%0A%7D%0A%0A%2F%2F%20%E6%88%91%E4%BB%AC%E6%89%8B%E5%8A%A8%E4%BF%9D%E8%AF%81%EF%BC%9A%E9%80%9A%E8%BF%87%20AtomicI32%20%E7%9A%84%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%EF%BC%8C%E5%A4%9A%E7%BA%BF%E7%A8%8B%E8%AE%BF%E9%97%AE%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%0Aunsafe%20impl%20Send%20for%20AtomicCounter%20%7B%7D%0Aunsafe%20impl%20Sync%20for%20AtomicCounter%20%7B%7D%0A%0Aimpl%20AtomicCounter%20%7B%0A%20%20%20%20fn%20new(val%3A%20i32)%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20let%20boxed%20%3D%20Box%3A%3Anew(AtomicI32%3A%3Anew(val))%3B%0A%20%20%20%20%20%20%20%20AtomicCounter%20%7B%20inner%3A%20Box%3A%3Ainto_raw(boxed)%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20increment(%26self)%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%20(*self.inner).fetch_add(1%2C%20Ordering%3A%3ASeqCst)%3B%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20get(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%20(*self.inner).load(Ordering%3A%3ASeqCst)%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20Drop%20for%20AtomicCounter%20%7B%0A%20%20%20%20fn%20drop(%26mut%20self)%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%20drop(Box%3A%3Afrom_raw(self.inner))%3B%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20counter%20%3D%20AtomicCounter%3A%3Anew(0)%3B%0A%20%20%20%20counter.increment()%3B%0A%20%20%20%20counter.increment()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20counter.get())%3B%20%2F%2F%202%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">sync</span><span style="color:#F97583">::</span><span style="color:#B392F0">atomic</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">AtomicI32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Ordering</span><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 包含裸指针的类型：编译器不会自动实现 Send/Sync</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    inner</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> AtomicI32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 我们手动保证：通过 AtomicI32 的原子操作，多线程访问是安全的</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Send</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Sync</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">(val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> boxed </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">AtomicI32</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(val));</span></span>
<span class="line"><span style="color:#B392F0">        AtomicCounter</span><span style="color:#E1E4E8"> { inner</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">into_raw</span><span style="color:#E1E4E8">(boxed) }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> increment</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> { (</span><span style="color:#F97583">*</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">inner)</span><span style="color:#F97583">.</span><span style="color:#B392F0">fetch_add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Ordering</span><span style="color:#F97583">::</span><span style="color:#B392F0">SeqCst</span><span style="color:#E1E4E8">); }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> { (</span><span style="color:#F97583">*</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">inner)</span><span style="color:#F97583">.</span><span style="color:#B392F0">load</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Ordering</span><span style="color:#F97583">::</span><span style="color:#B392F0">SeqCst</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Drop</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> drop</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#79B8FF"> self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">drop</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">inner)); }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> counter </span><span style="color:#F97583">=</span><span style="color:#B392F0"> AtomicCounter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    counter</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    counter</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, counter</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 2</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 定义自己的 unsafe trait

你也可以定义自己的 `unsafe trait`，用来表达某种合同：

<div class="code-runner" data-full-code="%2F%2F%2F%20%23%20Safety%0A%2F%2F%2F%0A%2F%2F%2F%20%E5%AE%9E%E7%8E%B0%E6%AD%A4%20trait%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%BF%85%E9%A1%BB%E4%BF%9D%E8%AF%81%EF%BC%9A%0A%2F%2F%2F%20%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80%E4%B8%8E%20C%20%E4%B8%AD%E5%AF%B9%E5%BA%94%E7%B1%BB%E5%9E%8B%E5%AE%8C%E5%85%A8%E4%B8%80%E8%87%B4%EF%BC%88%23%5Brepr(C)%5D%EF%BC%89%0Aunsafe%20trait%20ReprC%3A%20Sized%20%7B%0A%20%20%20%20fn%20as_bytes(%26self)%20-%3E%20%26%5Bu8%5D%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20std%3A%3Aslice%3A%3Afrom_raw_parts(%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20self%20as%20*const%20Self%20as%20*const%20u8%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20std%3A%3Amem%3A%3Asize_of%3A%3A%3CSelf%3E()%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20)%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0A%23%5Brepr(C)%5D%0Astruct%20Point%20%7B%20x%3A%20f32%2C%20y%3A%20f32%20%7D%0A%0A%2F%2F%20%E6%88%91%E4%BB%AC%E4%BF%9D%E8%AF%81%20Point%20%E6%98%AF%20%23%5Brepr(C)%5D%20%E5%B8%83%E5%B1%80%E7%9A%84%0Aunsafe%20impl%20ReprC%20for%20Point%20%7B%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%201.0%2C%20y%3A%202.0%20%7D%3B%0A%20%20%20%20let%20bytes%20%3D%20p.as_bytes()%3B%0A%20%20%20%20println!(%22Point%20%E5%8D%A0%20%7B%7D%20%E5%AD%97%E8%8A%82%22%2C%20bytes.len())%3B%20%2F%2F%208%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">/// # Safety</span></span>
<span class="line"><span style="color:#6A737D">///</span></span>
<span class="line"><span style="color:#6A737D">/// 实现此 trait 的类型必须保证：</span></span>
<span class="line"><span style="color:#6A737D">/// 内存布局与 C 中对应类型完全一致（#[repr(C)]）</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> trait</span><span style="color:#B392F0"> ReprC</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Sized</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> as_bytes</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">] {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            std</span><span style="color:#F97583">::</span><span style="color:#B392F0">slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#79B8FF">                self</span><span style="color:#F97583"> as</span><span style="color:#F97583"> *const</span><span style="color:#79B8FF"> Self</span><span style="color:#F97583"> as</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">                std</span><span style="color:#F97583">::</span><span style="color:#B392F0">mem</span><span style="color:#F97583">::</span><span style="color:#B392F0">size_of</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#79B8FF">Self</span><span style="color:#E1E4E8">&gt;(),</span></span>
<span class="line"><span style="color:#E1E4E8">            )</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[repr(</span><span style="color:#B392F0">C</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 我们保证 Point 是 #[repr(C)] 布局的</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> ReprC</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> p</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_bytes</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Point 占 {} 字节"</span><span style="color:#E1E4E8">, bytes</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 8</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 阻止自动实现：!Send 和 !Sync

有时你的类型天生不能跨线程，需要明确**阻止**编译器自动推导 `Send` 或 `Sync`。使用 `PhantomData` 加上 negative impl 是惯用方法：

<div class="code-runner" data-full-code="use%20std%3A%3Amarker%3A%3APhantomData%3B%0A%0A%2F%2F%20PhantomData%3C*const%20()%3E%20%E6%98%AF%20!Send%20%E7%9A%84%EF%BC%8C%E8%BF%99%E4%BC%9A%E8%AE%A9%20MyType%20%E4%B9%9F%E5%8F%98%E6%88%90%20!Send%0Astruct%20MyType%20%7B%0A%20%20%20%20data%3A%20i32%2C%0A%20%20%20%20_not_send%3A%20PhantomData%3C*const%20()%3E%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%20MyType%20%7B%20data%3A%2042%2C%20_not_send%3A%20PhantomData%20%7D%3B%0A%20%20%20%20println!(%22data%20%3D%20%7B%7D%22%2C%20x.data)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%8B%E9%9D%A2%E8%BF%99%E8%A1%8C%E4%BC%9A%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%EF%BC%9AMyType%20%E4%B8%8D%E6%98%AF%20Send%EF%BC%8C%E4%B8%8D%E8%83%BD%E8%B7%A8%E7%BA%BF%E7%A8%8B%E7%A7%BB%E5%8A%A8%0A%20%20%20%20%2F%2F%20std%3A%3Athread%3A%3Aspawn(move%20%7C%7C%20%7B%20let%20_%20%3D%20x%3B%20%7D)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">marker</span><span style="color:#F97583">::</span><span style="color:#B392F0">PhantomData</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// PhantomData&lt;*const ()&gt; 是 !Send 的，这会让 MyType 也变成 !Send</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> MyType</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    data</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    _not_send</span><span style="color:#F97583">:</span><span style="color:#B392F0"> PhantomData</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">*const</span><span style="color:#E1E4E8"> ()&gt;,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#B392F0"> MyType</span><span style="color:#E1E4E8"> { data</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">, _not_send</span><span style="color:#F97583">:</span><span style="color:#B392F0"> PhantomData</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"data = {}"</span><span style="color:#E1E4E8">, x</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">data);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 下面这行会编译失败：MyType 不是 Send，不能跨线程移动</span></span>
<span class="line"><span style="color:#6A737D">    // std::thread::spawn(move || { let _ = x; });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## unsafe 函数测验

加载题目中…

```rust
unsafe fn get_first(slice: &[i32]) -> i32 {
    *slice.as_ptr()
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面有一个 `unsafe fn`，但缺少 `# Safety` 文档注释，且内部的 unsafe 操作没有用 `unsafe` 块包裹。请修复它：

```rust
// TODO: 添加 # Safety 文档注释，说明调用者的前提条件
unsafe fn copy_bytes(src: *const u8, dst: *mut u8, count: usize) {
    for i in 0..count {
        // TODO: 用 unsafe 块包裹裸指针操作
        *dst.add(i) = *src.add(i);
    }
}

fn main() {
    let src = [1u8, 2, 3, 4, 5];
    let mut dst = [0u8; 5];

    unsafe {
        copy_bytes(src.as_ptr(), dst.as_mut_ptr(), src.len());
    }

    println!("{:?}", dst);
}
```