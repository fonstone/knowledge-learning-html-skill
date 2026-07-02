# 什么是内部可变性？

Rust 的借用规则很明确：当你拥有一个不可变引用 `&T` 时，你不能同时拥有可变引用 `&mut T`。这条规则防止了数据竞争，是内存安全的核心保障。

然而，在某些合理的设计场景中，这条规则会成为阻碍。**内部可变性** (Interior Mutability) 是一种设计模式，它允许你即使在持有不可变引用时，也能修改数据内部的值。

这听起来像是在绕开 Rust 的安全保障，实际上并非如此。`RefCell<T>` 并没有绕过借用规则，它只是将借用检查从**编译时**推迟到了**运行时**。如果运行时违反了规则，程序会 Panic 而不是产生未定义行为。

## `RefCell<T>`：运行时的借用检查

让我们先来理解 `Box<T>`、`Rc<T>` 和 `RefCell<T>` 之间的核心差异：

| 类型 | 所有者数量 | 借用检查时机 | 可变性 |
| --- | --- | --- | --- |
| `Box<T>` | 唯一 | 编译时 | 可变或不可变 |
| `Rc<T>` | 多个 | 编译时 | 仅不可变 |
| `RefCell<T>` | 唯一 | **运行时** | 可变或不可变 |

`RefCell<T>` 提供了两个核心方法：

- `borrow()` ：返回 Ref<T> ，行为类似不可变引用 &T 。
- `borrow_mut()` ：返回 RefMut<T> ，行为类似可变引用 &mut T 。

`RefCell<T>` 在内部维护一个计数器，追踪当前活跃的 `Ref<T>` 和 `RefMut<T>` 的数量。规则和编译期一样：可以同时有多个 `Ref<T>`，但 `RefMut<T>` 必须独占。如果违反，程序会 Panic：

```text
thread 'main' panicked at 'already borrowed: BorrowMutError'
```

### 何时选择 `RefCell<T>`

当你**确信**代码在运行时不会违反借用规则，但编译器因为其分析的保守性而无法证明这一点时，`RefCell<T>` 是正确的选择。

# 内部可变性实战

最直接的场景：一个计数器，需要在只有 `&self` 的方法里更新自身状态。

## 直接修改（编译失败）

```rust
struct Counter {
    count: i32,
}

impl Counter {
    // &self 而非 &mut self
    fn increment(&self) {
        self.count += 1; // 编译错误：不能通过不可变引用修改字段
    }
}
```

## 用 `RefCell<T>` 解决

<div class="code-runner" data-full-code="use%20std%3A%3Acell%3A%3ARefCell%3B%0A%0Astruct%20Counter%20%7B%0A%20%20%20%20count%3A%20RefCell%3Ci32%3E%2C%0A%7D%0A%0Aimpl%20Counter%20%7B%0A%20%20%20%20fn%20new()%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Counter%20%7B%20count%3A%20RefCell%3A%3Anew(0)%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E7%AD%BE%E5%90%8D%E4%BB%8D%E6%98%AF%20%26self%EF%BC%8C%E4%BD%86%E5%86%85%E9%83%A8%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%0A%20%20%20%20fn%20increment(%26self)%20%7B%0A%20%20%20%20%20%20%20%20*self.count.borrow_mut()%20%2B%3D%201%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20value(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20*self.count.borrow()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20c%20%3D%20Counter%3A%3Anew()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20println!(%22%E8%AE%A1%E6%95%B0%3A%20%7B%7D%22%2C%20c.value())%3B%20%2F%2F%203%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">cell</span><span style="color:#F97583">::</span><span style="color:#B392F0">RefCell</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> RefCell</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Counter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> new</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Counter</span><span style="color:#E1E4E8"> { count</span><span style="color:#F97583">:</span><span style="color:#B392F0"> RefCell</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 签名仍是 &amp;self，但内部可以修改</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> increment</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count</span><span style="color:#F97583">.</span><span style="color:#B392F0">borrow_mut</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        *</span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">count</span><span style="color:#F97583">.</span><span style="color:#B392F0">borrow</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Counter</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"计数: {}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">value</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 3</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`borrow_mut()` 返回一个 `RefMut<T>` 智能指针，通过 `*` 解引用后就可以修改内部值，用完后自动归还借用权。`borrow()` 同理，返回 `Ref<T>` 用于只读访问。

# `Rc<RefCell<T>>`：共享且可变

`Rc<T>` 和 `RefCell<T>` 结合是 Rust 中一个非常强大的模式：

- Rc<T> 解决了 多所有者 的问题
- RefCell<T> 解决了 可变性 的问题

两者相结合，就能得到一个可以被多处共享，同时又可以被任意一处修改的值。可变性的借用检查仍然存在，只是时机变了——`Rc` 允许你从任意一个持有者处调用 `borrow_mut()`，但 `RefCell` 会在运行时确保同一时刻最多只有一个可变借用活跃；若有多个持有者同时尝试调用 `borrow_mut()` 且互相重叠，程序会 Panic：

<div class="code-runner" data-full-code="use%20std%3A%3Arc%3A%3ARc%3B%0Ause%20std%3A%3Acell%3A%3ARefCell%3B%0A%0A%23%5Bderive(Debug)%5D%0Aenum%20List%20%7B%0A%20%20%20%20Cons(Rc%3CRefCell%3Ci32%3E%3E%2C%20Rc%3CList%3E)%2C%0A%20%20%20%20Nil%2C%0A%7D%0Ause%20List%3A%3A%7BCons%2C%20Nil%7D%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%AA%E5%80%BC%E5%B0%86%E8%A2%AB%E5%A4%9A%E4%B8%AA%E5%88%97%E8%A1%A8%E8%8A%82%E7%82%B9%E5%85%B1%E4%BA%AB%EF%BC%8C%E4%B8%94%E5%8F%AF%E4%BB%A5%E8%A2%AB%E4%BF%AE%E6%94%B9%0A%20%20%20%20let%20shared_value%20%3D%20Rc%3A%3Anew(RefCell%3A%3Anew(5))%3B%0A%0A%20%20%20%20%2F%2F%20a%E3%80%81b%E3%80%81c%20%E4%B8%89%E4%B8%AA%E5%88%97%E8%A1%A8%E9%83%BD%E6%8C%81%E6%9C%89%20shared_value%20%E7%9A%84%E4%B8%80%E4%BB%BD%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20let%20a%20%3D%20Rc%3A%3Anew(Cons(Rc%3A%3Aclone(%26shared_value)%2C%20Rc%3A%3Anew(Nil)))%3B%0A%20%20%20%20let%20b%20%3D%20Cons(Rc%3A%3Anew(RefCell%3A%3Anew(3))%2C%20Rc%3A%3Aclone(%26a))%3B%0A%20%20%20%20let%20c%20%3D%20Cons(Rc%3A%3Anew(RefCell%3A%3Anew(4))%2C%20Rc%3A%3Aclone(%26a))%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BF%AE%E6%94%B9%20shared_value%20%E7%9A%84%E5%80%BC%0A%20%20%20%20*shared_value.borrow_mut()%20%2B%3D%2010%3B%0A%0A%20%20%20%20%2F%2F%20%E6%89%80%E6%9C%89%E6%8C%81%E6%9C%89%20shared_value%20%E7%9A%84%E5%88%97%E8%A1%A8%E8%8A%82%E7%82%B9%E9%83%BD%E7%9C%8B%E5%88%B0%E4%BA%86%E6%9B%B4%E6%96%B0%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20a%20%3D%20%7B%3A%3F%7D%22%2C%20a)%3B%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20b%20%3D%20%7B%3A%3F%7D%22%2C%20b)%3B%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20c%20%3D%20%7B%3A%3F%7D%22%2C%20c)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">Rc</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">cell</span><span style="color:#F97583">::</span><span style="color:#B392F0">RefCell</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> List</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Cons</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Rc</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">RefCell</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;&gt;, </span><span style="color:#B392F0">Rc</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">List</span><span style="color:#E1E4E8">&gt;),</span></span>
<span class="line"><span style="color:#B392F0">    Nil</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> List</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">Cons</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Nil</span><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 这个值将被多个列表节点共享，且可以被修改</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> shared_value </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">RefCell</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // a、b、c 三个列表都持有 shared_value 的一份所有权</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Cons</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">shared_value), </span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Nil</span><span style="color:#E1E4E8">)));</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Cons</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">RefCell</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">)), </span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">a));</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Cons</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">RefCell</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">)), </span><span style="color:#B392F0">Rc</span><span style="color:#F97583">::</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">a));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 修改 shared_value 的值</span></span>
<span class="line"><span style="color:#F97583">    *</span><span style="color:#E1E4E8">shared_value</span><span style="color:#F97583">.</span><span style="color:#B392F0">borrow_mut</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 所有持有 shared_value 的列表节点都看到了更新</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后 a = {:?}"</span><span style="color:#E1E4E8">, a);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后 b = {:?}"</span><span style="color:#E1E4E8">, b);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"修改后 c = {:?}"</span><span style="color:#E1E4E8">, c);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 测验

加载题目中…

加载题目中…

```rust
use std::rc::Rc;
use std::cell::RefCell;

let data = Rc::new(RefCell::new(0));
let a = Rc::clone(&data);
let b = Rc::clone(&data);

*a.borrow_mut() += 10;
*b.borrow_mut() += 5;

println!("{}", data.borrow());
```

加载题目中…

加载题目中…

加载题目中…