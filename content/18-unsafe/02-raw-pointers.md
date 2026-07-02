# 裸指针基础

裸指针（raw pointer）是 Rust 中最接近 C 指针的东西，它绕过了所有借用规则和生命周期检查。和引用相比，裸指针：

- 不保证有效 ：可能为空（null）、已悬垂（dangling）或指向未初始化内存
- 不受借用规则约束 ：可以同时存在多个可变裸指针指向同一数据
- 不自动清理 ：裸指针不拥有数据，不会触发 Drop

Rust 有两种裸指针：

| 类型 | 含义 |
| --- | --- |
| `*const T` | 不可变裸指针，解引用后不能修改目标 |
| `*mut T` | 可变裸指针，解引用后可以修改目标 |

> 裸指针类型名里的 `*` 是类型的一部分，不是解引用运算符。读作”pointer-const T”或”pointer-mut T”。

## 引用解决不了的四类场景

**99% 的情况下，引用（`&T` / `&mut T`）比裸指针更好**——有生命周期保护，有借用检查，出了问题编译期就报错。但有四类场景引用确实无能为力，必须用裸指针：

### 场景一：与 C 代码互操作

C 语言没有 Rust 的引用概念，C 的 API 全部用指针。调用 C 函数、接收 C 回调、读写 C 结构体，都必须用裸指针：

<div class="code-runner" data-full-code="extern%20%22C%22%20%7B%0A%20%20%20%20%2F%2F%20C%20%E6%A0%87%E5%87%86%E5%BA%93%E7%9A%84%20memcpy%EF%BC%8C%E5%8F%82%E6%95%B0%E5%85%A8%E6%98%AF%E8%A3%B8%E6%8C%87%E9%92%88%0A%20%20%20%20fn%20memcpy(dst%3A%20*mut%20u8%2C%20src%3A%20*const%20u8%2C%20n%3A%20usize)%20-%3E%20*mut%20u8%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20src%20%3D%20%5B1u8%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20let%20mut%20dst%20%3D%20%5B0u8%3B%205%5D%3B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20memcpy(dst.as_mut_ptr()%2C%20src.as_ptr()%2C%20src.len())%3B%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20dst)%3B%20%2F%2F%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">extern</span><span style="color:#9ECBFF"> "C"</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // C 标准库的 memcpy，参数全是裸指针</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> memcpy</span><span style="color:#E1E4E8">(dst</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">, src</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">, n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> src </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> dst </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">0</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        memcpy</span><span style="color:#E1E4E8">(dst</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_mut_ptr</span><span style="color:#E1E4E8">(), src</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_ptr</span><span style="color:#E1E4E8">(), src</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, dst); </span><span style="color:#6A737D">// [1, 2, 3, 4, 5]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 场景二：借用检查器无法表达的数据结构

双向链表、图、自引用结构——这些数据结构里，一个节点同时被多个其他节点”指向”，用引用会产生循环借用，生命周期标注会陷入死局。裸指针绕过了这个限制：

<div class="code-runner" data-full-code="%2F%2F%20%E7%94%A8%E5%BC%95%E7%94%A8%E5%AE%9E%E7%8E%B0%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8%E5%87%A0%E4%B9%8E%E4%B8%8D%E5%8F%AF%E8%83%BD%E2%80%94%E2%80%94%E5%89%8D%E5%90%8E%E8%8A%82%E7%82%B9%E4%BA%92%E7%9B%B8%E6%8C%81%E6%9C%89%E5%AF%B9%E6%96%B9%E7%9A%84%E5%BC%95%E7%94%A8%EF%BC%8C%0A%2F%2F%20%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%97%A0%E6%B3%95%E6%8F%8F%E8%BF%B0%E3%80%82%E7%94%A8%E8%A3%B8%E6%8C%87%E9%92%88%E5%88%99%E7%9B%B4%E6%8E%A5%EF%BC%9A%0Astruct%20Node%20%7B%0A%20%20%20%20val%3A%20i32%2C%0A%20%20%20%20prev%3A%20*mut%20Node%2C%20%20%2F%2F%20%E6%8C%87%E5%90%91%E5%89%8D%E4%B8%80%E4%B8%AA%E8%8A%82%E7%82%B9%EF%BC%8C%E5%8F%AF%E4%B8%BA%20null%0A%20%20%20%20next%3A%20*mut%20Node%2C%20%20%2F%2F%20%E6%8C%87%E5%90%91%E5%90%8E%E4%B8%80%E4%B8%AA%E8%8A%82%E7%82%B9%EF%BC%8C%E5%8F%AF%E4%B8%BA%20null%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%BC%94%E7%A4%BA%EF%BC%9A%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E8%8A%82%E7%82%B9%E5%B9%B6%E8%BF%9E%E6%8E%A5%0A%20%20%20%20let%20mut%20a%20%3D%20Box%3A%3Anew(Node%20%7B%20val%3A%201%2C%20prev%3A%20std%3A%3Aptr%3A%3Anull_mut()%2C%20next%3A%20std%3A%3Aptr%3A%3Anull_mut()%20%7D)%3B%0A%20%20%20%20let%20mut%20b%20%3D%20Box%3A%3Anew(Node%20%7B%20val%3A%202%2C%20prev%3A%20std%3A%3Aptr%3A%3Anull_mut()%2C%20next%3A%20std%3A%3Aptr%3A%3Anull_mut()%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%E8%A3%B8%E6%8C%87%E9%92%88%E5%BB%BA%E7%AB%8B%E5%8F%8C%E5%90%91%E8%BF%9E%E6%8E%A5%0A%20%20%20%20a.next%20%3D%20%26mut%20*b%20as%20*mut%20Node%3B%0A%20%20%20%20b.prev%20%3D%20%26mut%20*a%20as%20*mut%20Node%3B%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22a.next.val%20%3D%20%7B%7D%22%2C%20(*a.next).val)%3B%20%2F%2F%202%0A%20%20%20%20%20%20%20%20println!(%22b.prev.val%20%3D%20%7B%7D%22%2C%20(*b.prev).val)%3B%20%2F%2F%201%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 用引用实现双向链表几乎不可能——前后节点互相持有对方的引用，</span></span>
<span class="line"><span style="color:#6A737D">// 生命周期无法描述。用裸指针则直接：</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Node</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    prev</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> Node</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// 指向前一个节点，可为 null</span></span>
<span class="line"><span style="color:#E1E4E8">    next</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> Node</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// 指向后一个节点，可为 null</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 演示：创建两个节点并连接</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Node</span><span style="color:#E1E4E8"> { val</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, prev</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null_mut</span><span style="color:#E1E4E8">(), next</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null_mut</span><span style="color:#E1E4E8">() });</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Node</span><span style="color:#E1E4E8"> { val</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">, prev</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null_mut</span><span style="color:#E1E4E8">(), next</span><span style="color:#F97583">:</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null_mut</span><span style="color:#E1E4E8">() });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用裸指针建立双向连接</span></span>
<span class="line"><span style="color:#E1E4E8">    a</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">next </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">b </span><span style="color:#F97583">as</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> Node</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    b</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">prev </span><span style="color:#F97583">=</span><span style="color:#F97583"> &amp;mut</span><span style="color:#F97583"> *</span><span style="color:#E1E4E8">a </span><span style="color:#F97583">as</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> Node</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a.next.val = {}"</span><span style="color:#E1E4E8">, (</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">a</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">next)</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">val); </span><span style="color:#6A737D">// 2</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"b.prev.val = {}"</span><span style="color:#E1E4E8">, (</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">b</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">prev)</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">val); </span><span style="color:#6A737D">// 1</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 场景三：同时可变借用同一数据的不重叠部分

借用检查器是保守的：即使两个 `&mut` 指向同一切片的不同位置，它也会拒绝。标准库的 `split_at_mut` 就是通过裸指针实现的，它证明了”我知道这两段不会重叠”：

<div class="code-runner" data-full-code="fn%20split_at_mut_impl(slice%3A%20%26mut%20%5Bi32%5D%2C%20mid%3A%20usize)%20-%3E%20(%26mut%20%5Bi32%5D%2C%20%26mut%20%5Bi32%5D)%20%7B%0A%20%20%20%20let%20len%20%3D%20slice.len()%3B%0A%20%20%20%20let%20ptr%20%3D%20slice.as_mut_ptr()%3B%0A%0A%20%20%20%20assert!(mid%20%3C%3D%20len)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%AE%89%E5%85%A8%20Rust%20%E6%97%A0%E6%B3%95%E8%A1%A8%E8%BE%BE%E8%BF%99%E4%B8%AA%E6%93%8D%E4%BD%9C%E2%80%94%E2%80%94%E4%B8%A4%E4%B8%AA%20%26mut%20%E6%9D%A5%E8%87%AA%E5%90%8C%E4%B8%80%20slice%EF%BC%9A%0A%20%20%20%20%2F%2F%20(%26mut%20slice%5B..mid%5D%2C%20%26mut%20slice%5Bmid..%5D)%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81%0A%0A%20%20%20%20%2F%2F%20%E8%A3%B8%E6%8C%87%E9%92%88%E5%8F%AF%E4%BB%A5%EF%BC%9A%E6%88%91%E4%BB%AC%E7%9F%A5%E9%81%93%20%5B0%2C%20mid)%20%E5%92%8C%20%5Bmid%2C%20len)%20%E4%B8%8D%E9%87%8D%E5%8F%A0%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20(%0A%20%20%20%20%20%20%20%20%20%20%20%20std%3A%3Aslice%3A%3Afrom_raw_parts_mut(ptr%2C%20mid)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20std%3A%3Aslice%3A%3Afrom_raw_parts_mut(ptr.add(mid)%2C%20len%20-%20mid)%2C%0A%20%20%20%20%20%20%20%20)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20let%20(left%2C%20right)%20%3D%20split_at_mut_impl(%26mut%20v%2C%203)%3B%0A%20%20%20%20left%5B0%5D%20%3D%2010%3B%0A%20%20%20%20right%5B0%5D%20%3D%2040%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v)%3B%20%2F%2F%20%5B10%2C%202%2C%203%2C%2040%2C%205%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> split_at_mut_impl</span><span style="color:#E1E4E8">(slice</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], mid</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], </span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> len </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> ptr </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_mut_ptr</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    assert!</span><span style="color:#E1E4E8">(mid </span><span style="color:#F97583">&lt;=</span><span style="color:#E1E4E8"> len);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 安全 Rust 无法表达这个操作——两个 &amp;mut 来自同一 slice：</span></span>
<span class="line"><span style="color:#6A737D">    // (&amp;mut slice[..mid], &amp;mut slice[mid..]) // 编译错误！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 裸指针可以：我们知道 [0, mid) 和 [mid, len) 不重叠</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span></span>
<span class="line"><span style="color:#B392F0">            std</span><span style="color:#F97583">::</span><span style="color:#B392F0">slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts_mut</span><span style="color:#E1E4E8">(ptr, mid),</span></span>
<span class="line"><span style="color:#B392F0">            std</span><span style="color:#F97583">::</span><span style="color:#B392F0">slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts_mut</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(mid), len </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> mid),</span></span>
<span class="line"><span style="color:#E1E4E8">        )</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (left, right) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> split_at_mut_impl</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> v, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    left[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    right[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 40</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v); </span><span style="color:#6A737D">// [10, 2, 3, 40, 5]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 场景四：可空指针（nullable pointer）

C 的 API 常用 `NULL` 表示”无值”。Rust 的引用永远非空，`Option<&T>` 虽然可以表达这个语义，但在 FFI 边界上有时必须用真正的裸指针，因为 C 不认识 `Option`：

<div class="code-runner" data-full-code="%2F%2F%2F%20%E4%BB%8E%E5%8F%AF%E7%A9%BA%E7%9A%84%20C%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%8C%87%E9%92%88%E8%AF%BB%E5%8F%96%E5%86%85%E5%AE%B9%EF%BC%8Cnull%20%E6%97%B6%E8%BF%94%E5%9B%9E%E9%BB%98%E8%AE%A4%E5%80%BC%0Aunsafe%20fn%20read_or_default(ptr%3A%20*const%20i32%2C%20default%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20if%20ptr.is_null()%20%7B%0A%20%20%20%20%20%20%20%20default%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20*ptr%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042i32%3B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20read_or_default(%26x%2C%200))%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%2042%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%22%2C%20read_or_default(std%3A%3Aptr%3A%3Anull()%2C%200))%3B%20%20%20%20%20%20%2F%2F%200%EF%BC%88null%20%E8%BF%94%E5%9B%9E%E9%BB%98%E8%AE%A4%E5%80%BC%EF%BC%89%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">/// 从可空的 C 字符串指针读取内容，null 时返回默认值</span></span>
<span class="line"><span style="color:#F97583">unsafe</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> read_or_default</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, default</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_null</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">        default</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">ptr</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">read_or_default</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">x, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));                    </span><span style="color:#6A737D">// 42</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">read_or_default</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null</span><span style="color:#E1E4E8">(), </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">));      </span><span style="color:#6A737D">// 0（null 返回默认值）</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 使用裸指针

## 创建裸指针

**创建裸指针不需要 `unsafe`**——创建本身只是记录一个内存地址，没有任何危险操作：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042i32%3B%0A%20%20%20%20let%20mut%20y%20%3D%20100i32%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BB%8E%E5%BC%95%E7%94%A8%E8%BD%AC%E6%8D%A2%EF%BC%9A%E6%9C%80%E5%B8%B8%E8%A7%81%E3%80%81%E6%9C%80%E5%AE%89%E5%85%A8%E7%9A%84%E6%96%B9%E5%BC%8F%0A%20%20%20%20let%20p_const%3A%20*const%20i32%20%3D%20%26x%20as%20*const%20i32%3B%0A%20%20%20%20let%20p_mut%3A%20%20%20*mut%20i32%20%20%20%3D%20%26mut%20y%20as%20*mut%20i32%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E7%94%A8%20std%3A%3Aptr%3A%3Aaddr_of!%20%E5%AE%8F%EF%BC%88%E4%B8%8D%E9%9C%80%E8%A6%81%E5%88%9B%E5%BB%BA%E5%BC%95%E7%94%A8%EF%BC%89%0A%20%20%20%20let%20p2%20%3D%20std%3A%3Aptr%3A%3Aaddr_of!(x)%3B%0A%0A%20%20%20%20println!(%22p_const%20%E5%9C%B0%E5%9D%80%3A%20%7B%3A%3F%7D%22%2C%20p_const)%3B%0A%20%20%20%20println!(%22p_mut%20%20%20%E5%9C%B0%E5%9D%80%3A%20%7B%3A%3F%7D%22%2C%20p_mut)%3B%0A%20%20%20%20println!(%22%E4%B8%A4%E8%80%85%E7%9B%B8%E7%AD%89%EF%BC%88%E9%83%BD%E6%8C%87%E5%90%91%E5%90%8C%E7%B1%BB%E5%9E%8B%EF%BC%89%3A%20%7B%7D%22%2C%20std%3A%3Amem%3A%3Asize_of_val(%26p_const)%20%3D%3D%20std%3A%3Amem%3A%3Asize_of_val(%26p_mut))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 100</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 从引用转换：最常见、最安全的方式</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p_const</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">as</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p_mut</span><span style="color:#F97583">:</span><span style="color:#F97583">   *mut</span><span style="color:#B392F0"> i32</span><span style="color:#F97583">   =</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">as</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 也可以用 std::ptr::addr_of! 宏（不需要创建引用）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">addr_of!</span><span style="color:#E1E4E8">(x);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p_const 地址: {:?}"</span><span style="color:#E1E4E8">, p_const);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p_mut   地址: {:?}"</span><span style="color:#E1E4E8">, p_mut);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"两者相等（都指向同类型）: {}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">std</span><span style="color:#F97583">::</span><span style="color:#B392F0">mem</span><span style="color:#F97583">::</span><span style="color:#B392F0">size_of_val</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">p_const) </span><span style="color:#F97583">==</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">mem</span><span style="color:#F97583">::</span><span style="color:#B392F0">size_of_val</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">p_mut));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 解引用裸指针

解引用需要 `unsafe`，因为编译器无法保证指针有效：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%2042i32%3B%0A%20%20%20%20let%20p%3A%20*const%20i32%20%3D%20%26x%3B%0A%0A%20%20%20%20%2F%2F%20%E5%AE%89%E5%85%A8%EF%BC%9A%E4%BB%8E%E6%9C%89%E6%95%88%E5%BC%95%E7%94%A8%E5%88%9B%E5%BB%BA%E7%9A%84%E6%8C%87%E9%92%88%EF%BC%8C%E5%9C%A8%20x%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%86%85%E8%A7%A3%E5%BC%95%E7%94%A8%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20println!(%22x%20%3D%20%7B%7D%22%2C%20*p)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20let%20mut%20y%20%3D%200i32%3B%0A%20%20%20%20let%20pm%3A%20*mut%20i32%20%3D%20%26mut%20y%3B%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20*pm%20%3D%2099%3B%20%2F%2F%20%E9%80%9A%E8%BF%87%E5%8F%AF%E5%8F%98%E8%A3%B8%E6%8C%87%E9%92%88%E5%86%99%E5%85%A5%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22y%20%3D%20%7B%7D%22%2C%20y)%3B%20%2F%2F%2099%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">x;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 安全：从有效引用创建的指针，在 x 的生命周期内解引用是安全的</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">p);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> pm</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">pm </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 99</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 通过可变裸指针写入</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"y = {}"</span><span style="color:#E1E4E8">, y); </span><span style="color:#6A737D">// 99</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## null 指针

Rust 的裸指针可以是 null。`std::ptr::null()` 和 `std::ptr::null_mut()` 创建 null 指针：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20p%3A%20*const%20i32%20%3D%20std%3A%3Aptr%3A%3Anull()%3B%0A%0A%20%20%20%20println!(%22is_null%3A%20%7B%7D%22%2C%20p.is_null())%3B%20%2F%2F%20true%0A%0A%20%20%20%20%2F%2F%20%E8%A7%A3%E5%BC%95%E7%94%A8%20null%20%E6%8C%87%E9%92%88%E6%98%AF%E6%9C%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E4%B8%BA%E2%80%94%E2%80%94%E7%A8%8B%E5%BA%8F%E4%BC%9A%E5%B4%A9%E6%BA%83%E6%88%96%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%BB%93%E6%9E%9C%0A%20%20%20%20%2F%2F%20unsafe%20%7B%20println!(%22%7B%7D%22%2C%20*p)%3B%20%7D%20%2F%2F%20%E5%8D%83%E4%B8%87%E4%B8%8D%E8%A6%81%E8%BF%99%E6%A0%B7%E5%81%9A%EF%BC%81%0A%0A%20%20%20%20%2F%2F%20%E4%BD%BF%E7%94%A8%E5%89%8D%E5%BF%85%E9%A1%BB%E6%A3%80%E6%9F%A5%0A%20%20%20%20if%20!p.is_null()%20%7B%0A%20%20%20%20%20%20%20%20unsafe%20%7B%20println!(%22%7B%7D%22%2C%20*p)%3B%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%8C%87%E9%92%88%E4%B8%BA%20null%EF%BC%8C%E8%B7%B3%E8%BF%87%E8%A7%A3%E5%BC%95%E7%94%A8%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ptr</span><span style="color:#F97583">::</span><span style="color:#B392F0">null</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"is_null: {}"</span><span style="color:#E1E4E8">, p</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_null</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 解引用 null 指针是未定义行为——程序会崩溃或产生错误结果</span></span>
<span class="line"><span style="color:#6A737D">    // unsafe { println!("{}", *p); } // 千万不要这样做！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 使用前必须检查</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">.</span><span style="color:#B392F0">is_null</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">p); }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"指针为 null，跳过解引用"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 指针算术与高级用法

## 指针偏移

裸指针支持算术运算，用于遍历内存中连续排列的数据（如数组）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20arr%20%3D%20%5B10i32%2C%2020%2C%2030%2C%2040%2C%2050%5D%3B%0A%20%20%20%20let%20base%3A%20*const%20i32%20%3D%20arr.as_ptr()%3B%20%2F%2F%20%E6%8C%87%E5%90%91%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20offset(n)%20%E5%90%91%E5%90%8E%E7%A7%BB%E5%8A%A8%20n%20%E4%B8%AA%E5%85%83%E7%B4%A0%EF%BC%88%E4%BB%A5%20T%20%E7%9A%84%E5%A4%A7%E5%B0%8F%E4%B8%BA%E5%8D%95%E4%BD%8D%EF%BC%89%0A%20%20%20%20%20%20%20%20println!(%22arr%5B0%5D%20%3D%20%7B%7D%22%2C%20*base)%3B%0A%20%20%20%20%20%20%20%20println!(%22arr%5B1%5D%20%3D%20%7B%7D%22%2C%20*base.offset(1))%3B%0A%20%20%20%20%20%20%20%20println!(%22arr%5B2%5D%20%3D%20%7B%7D%22%2C%20*base.add(2))%3B%20%2F%2F%20add%20%E6%98%AF%20offset%20%E7%9A%84%E5%AE%89%E5%85%A8%E5%88%AB%E5%90%8D%EF%BC%88%E4%B8%8D%E5%85%81%E8%AE%B8%E8%B4%9F%E5%81%8F%E7%A7%BB%EF%BC%89%0A%20%20%20%20%20%20%20%20println!(%22arr%5B4%5D%20%3D%20%7B%7D%22%2C%20*base.add(4))%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> arr </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">10</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">40</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">50</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> base</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> arr</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_ptr</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 指向第一个元素</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // offset(n) 向后移动 n 个元素（以 T 的大小为单位）</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"arr[0] = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">base);</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"arr[1] = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">base</span><span style="color:#F97583">.</span><span style="color:#B392F0">offset</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"arr[2] = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">base</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// add 是 offset 的安全别名（不允许负偏移）</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"arr[4] = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">base</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `add(n)` 等价于 `offset(n as isize)`，但语义上只允许正方向偏移，代码更清晰。**越过数组边界的偏移是未定义行为**，不会有编译错误，但运行时可能崩溃或产生错误数据。

## 同时持有多个可变指针

裸指针绕过了借用规则，可以同时持有多个可变指针——这是双向链表、自引用结构等实现的基础，但也是最容易出错的地方：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20data%20%3D%20%5B1i32%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E5%9C%A8%E5%AE%89%E5%85%A8%20Rust%20%E9%87%8C%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%90%8C%E6%97%B6%E6%8C%81%E6%9C%89%E4%B8%A4%E4%B8%AA%20%26mut%0A%20%20%20%20%2F%2F%20%E4%BD%86%E8%A3%B8%E6%8C%87%E9%92%88%E5%8F%AF%E4%BB%A5%0A%20%20%20%20let%20p0%3A%20*mut%20i32%20%3D%20%26mut%20data%5B0%5D%3B%0A%20%20%20%20let%20p2%3A%20*mut%20i32%20%3D%20%26mut%20data%5B2%5D%3B%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20*p0%20%3D%20100%3B%0A%20%20%20%20%20%20%20%20*p2%20%3D%20300%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20data)%3B%20%2F%2F%20%5B100%2C%202%2C%20300%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 在安全 Rust 里，不能同时持有两个 &amp;mut</span></span>
<span class="line"><span style="color:#6A737D">    // 但裸指针可以</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p0</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> data[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p2</span><span style="color:#F97583">:</span><span style="color:#F97583"> *mut</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> data[</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">p0 </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#E1E4E8">p2 </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 300</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, data); </span><span style="color:#6A737D">// [100, 2, 300]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 裸指针与切片

从裸指针重建切片引用，是手动分配内存后访问数据的标准模式：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20v%3A%20Vec%3Ci32%3E%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E8%8E%B7%E5%8F%96%E5%BA%95%E5%B1%82%E8%A3%B8%E6%8C%87%E9%92%88%E5%92%8C%E9%95%BF%E5%BA%A6%0A%20%20%20%20let%20ptr%3A%20*const%20i32%20%3D%20v.as_ptr()%3B%0A%20%20%20%20let%20len%20%3D%20v.len()%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BB%8E%E8%A3%B8%E6%8C%87%E9%92%88%20%2B%20%E9%95%BF%E5%BA%A6%E9%87%8D%E5%BB%BA%E5%88%87%E7%89%87%0A%20%20%20%20let%20slice%3A%20%26%5Bi32%5D%20%3D%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20std%3A%3Aslice%3A%3Afrom_raw_parts(ptr%2C%20len)%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20slice)%3B%20%2F%2F%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%0A%0A%20%20%20%20%2F%2F%20%E6%B3%A8%EF%BC%9A%E6%AD%A4%E6%97%B6%20v%20%E5%92%8C%20slice%20%E9%83%BD%E6%8C%87%E5%90%91%E5%90%8C%E4%B8%80%E5%9D%97%E5%86%85%E5%AD%98%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%A6%81%20v%20%E6%9C%AA%E8%A2%AB%E4%BF%AE%E6%94%B9%E6%88%96%E9%87%8A%E6%94%BE%EF%BC%8Cslice%20%E5%B0%B1%E6%98%AF%E6%9C%89%E6%95%88%E7%9A%84%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 获取底层裸指针和长度</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_ptr</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> len </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 从裸指针 + 长度重建切片</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#F97583"> unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        std</span><span style="color:#F97583">::</span><span style="color:#B392F0">slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts</span><span style="color:#E1E4E8">(ptr, len)</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, slice); </span><span style="color:#6A737D">// [1, 2, 3, 4, 5]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 注：此时 v 和 slice 都指向同一块内存</span></span>
<span class="line"><span style="color:#6A737D">    // 只要 v 未被修改或释放，slice 就是有效的</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 裸指针基础测验

加载题目中…

```rust
let x = 5i32;
let p: *const i32 = &x;
let q: *const i32 = &x;
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

用裸指针实现一个 `sum_slice` 函数，通过指针算术遍历 `i32` 数组，返回所有元素的和：

```rust
unsafe fn sum_slice(ptr: *const i32, len: usize) -> i32 {
    // TODO: 从 ptr 开始，用 add(i) 逐个读取元素，累加后返回
    todo!()
}

fn main() {
    let arr = [3, 1, 4, 1, 5, 9, 2, 6];
    let result = unsafe { sum_slice(arr.as_ptr(), arr.len()) };
    println!("{}", result);
}
```