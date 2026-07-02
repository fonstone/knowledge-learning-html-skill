## 出发点

`Vec`、`String`、`Arc` 内部全都用了 unsafe——但你作为使用者从来不需要写 `unsafe` 就能用它们。这不是魔法，而是一种设计模式：**unsafe 实现，safe 接口**。

目标很简单：把 unsafe 的复杂性关在函数内部，让调用方看到的只是普通的安全函数。

## 为什么不能直接暴露 unsafe？

先看一个反例：

<div class="code-runner" data-full-code="%2F%2F%20%E4%B8%8D%E5%A5%BD%E7%9A%84%E5%81%9A%E6%B3%95%EF%BC%9Aunsafe%20%E6%B3%84%E6%BC%8F%E5%88%B0%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3%EF%BC%8C%E8%B0%83%E7%94%A8%E8%80%85%E8%A6%81%E8%87%AA%E5%B7%B1%E4%BF%9D%E8%AF%81%E4%B8%80%E5%88%87%0Apub%20unsafe%20fn%20get_element(ptr%3A%20*const%20i32%2C%20idx%3A%20usize)%20-%3E%20i32%20%7B%0A%20%20%20%20unsafe%20%7B%20*ptr.add(idx)%20%7D%0A%7D%0A%0A%2F%2F%20%E5%A5%BD%E7%9A%84%E5%81%9A%E6%B3%95%EF%BC%9A%E9%AA%8C%E8%AF%81%E6%94%BE%E5%9C%A8%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%EF%BC%8Cunsafe%20%E4%B8%8D%E5%87%BA%E9%97%A8%0Apub%20fn%20get_safe(slice%3A%20%26%5Bi32%5D%2C%20idx%3A%20usize)%20-%3E%20Option%3Ci32%3E%20%7B%0A%20%20%20%20if%20idx%20%3C%20slice.len()%20%7B%0A%20%20%20%20%20%20%20%20Some(unsafe%20%7B%20*slice.as_ptr().add(idx)%20%7D)%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20None%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20arr%20%3D%20%5B10%2C%2020%2C%2030%5D%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20get_safe(%26arr%2C%201))%3B%20%2F%2F%20Some(20)%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20get_safe(%26arr%2C%209))%3B%20%2F%2F%20None%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 不好的做法：unsafe 泄漏到公共接口，调用者要自己保证一切</span></span>
<span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> unsafe</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> get_element</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">:</span><span style="color:#F97583"> *const</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, idx</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(idx) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 好的做法：验证放在函数内部，unsafe 不出门</span></span>
<span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> get_safe</span><span style="color:#E1E4E8">(slice</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], idx</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> idx </span><span style="color:#F97583">&lt;</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        Some</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">unsafe</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">*</span><span style="color:#E1E4E8">slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_ptr</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(idx) })</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        None</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> arr </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_safe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">arr, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// Some(20)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">get_safe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">arr, </span><span style="color:#79B8FF">9</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// None</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`get_element` 把”保证 ptr 有效、idx 在界内”的责任完全推给了每一个调用者——每次调用都要写 unsafe，每次都要自己小心。`get_safe` 把验证逻辑放在函数里，unsafe 只出现一次，调用方完全不感知。

## 不变量：unsafe 代码依赖的规矩

那函数内部的 unsafe 为什么安全？因为有**不变量**（invariant）在守护。

不变量是你的代码对自己立下的规矩——一条永远必须成立的条件。上面 `get_safe` 的不变量是：进入 unsafe 块之前，`idx < slice.len()` 一定成立。只要这条成立，`slice.as_ptr().add(idx)` 就不会越界，解引用就是合法的。

用一个生活类比建立直觉：银行账户有一条不变量”余额 ≥ 0”。取款操作在扣钱之前会先检查余额是否足够——这个检查就是在维护不变量。如果跳过检查直接扣钱，账户就进入了”不合法状态”，后续一切计算都可能出错。

unsafe 代码里的不变量是一样的道理，只是”不合法状态”变成了”未定义行为”。

## 封装的作用

理解了不变量，封装的意义就很清楚了：

**封装 = 让外部代码没有机会打破不变量。**

如果字段是 `pub` 的，任何人都能把 `len` 改大、把指针改成 null——不变量随时可能被破坏。把字段设为私有，只通过你控制的方法访问，就能保证每次修改都经过你的检查。

## 一个完整的例子

`split_at_mut` 是标准库里的经典案例——把一个可变 slice 从中间分成两段，各自可变：

<div class="code-runner" data-full-code="use%20std%3A%3Aslice%3B%0A%0Afn%20split_at_mut(slice%3A%20%26mut%20%5Bi32%5D%2C%20mid%3A%20usize)%20-%3E%20(%26mut%20%5Bi32%5D%2C%20%26mut%20%5Bi32%5D)%20%7B%0A%20%20%20%20let%20len%20%3D%20slice.len()%3B%0A%20%20%20%20let%20ptr%20%3D%20slice.as_mut_ptr()%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E5%8F%98%E9%87%8F%EF%BC%9Amid%20%3C%3D%20len%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E8%A6%81%E6%88%90%E7%AB%8B%EF%BC%8C%E4%B8%A4%E6%AE%B5%E5%86%85%E5%AD%98%E5%B0%B1%E4%B8%8D%E9%87%8D%E5%8F%A0%EF%BC%8C%E5%90%8C%E6%97%B6%E6%8C%81%E6%9C%89%E4%B8%A4%E4%B8%AA%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E6%98%AF%E5%AE%89%E5%85%A8%E7%9A%84%0A%20%20%20%20assert!(mid%20%3C%3D%20len)%3B%0A%0A%20%20%20%20unsafe%20%7B%0A%20%20%20%20%20%20%20%20(%0A%20%20%20%20%20%20%20%20%20%20%20%20slice%3A%3Afrom_raw_parts_mut(ptr%2C%20mid)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20slice%3A%3Afrom_raw_parts_mut(ptr.add(mid)%2C%20len%20-%20mid)%2C%0A%20%20%20%20%20%20%20%20)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20v%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%20%20%20%20let%20(left%2C%20right)%20%3D%20split_at_mut(%26mut%20v%2C%203)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20left)%3B%20%20%2F%2F%20%5B1%2C%202%2C%203%5D%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20right)%3B%20%2F%2F%20%5B4%2C%205%5D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">slice;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> split_at_mut</span><span style="color:#E1E4E8">(slice</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], mid</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">], </span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> len </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> ptr </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> slice</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_mut_ptr</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 不变量：mid &lt;= len</span></span>
<span class="line"><span style="color:#6A737D">    // 只要成立，两段内存就不重叠，同时持有两个可变引用是安全的</span></span>
<span class="line"><span style="color:#B392F0">    assert!</span><span style="color:#E1E4E8">(mid </span><span style="color:#F97583">&lt;=</span><span style="color:#E1E4E8"> len);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    unsafe</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span></span>
<span class="line"><span style="color:#B392F0">            slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts_mut</span><span style="color:#E1E4E8">(ptr, mid),</span></span>
<span class="line"><span style="color:#B392F0">            slice</span><span style="color:#F97583">::</span><span style="color:#B392F0">from_raw_parts_mut</span><span style="color:#E1E4E8">(ptr</span><span style="color:#F97583">.</span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(mid), len </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> mid),</span></span>
<span class="line"><span style="color:#E1E4E8">        )</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (left, right) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> split_at_mut</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;mut</span><span style="color:#E1E4E8"> v, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, left);  </span><span style="color:#6A737D">// [1, 2, 3]</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, right); </span><span style="color:#6A737D">// [4, 5]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这段代码如果只用安全 Rust 来写，编译器会拒绝——它看到的是”同一个 slice 被借用了两次”，不知道两段不重叠。但我们知道，所以用 `assert!` 强制维护不变量，再用 unsafe 告诉编译器”我检查过了”。

调用方看到的只是一个普通函数，完全不需要接触 unsafe。

## 小结

三件事缺一不可：

1. 识别不变量 ：unsafe 代码正确运行依赖哪条必须成立的条件
1. 维护不变量 ：在进入 unsafe 之前，用检查（assert、if）或类型系统确保条件成立
1. 封装 unsafe ：把危险操作藏在函数内部，对外只暴露安全接口

这就是标准库里每一个用了 unsafe 的类型和函数都在做的事。