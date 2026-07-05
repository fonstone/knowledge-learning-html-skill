---
chapterId: "13-smart-pointers"
lessonId: "04-refcell"
title: "RefCell<T> 与内部可变性"
level: "进阶"
duration: "25 分钟"
tags: ["RefCell", "内部可变性", "运行时借用检查", "Rc<RefCell<T>>"]
number: "13.4"
chapterTitle: "智能指针"
chapterNumber: "13"
---

<div id="article-content"> <h1 id="什么是内部可变性">什么是内部可变性？</h1>
<p>Rust 的借用规则很明确：当你拥有一个不可变引用 <code>&amp;T</code> 时，你不能同时拥有可变引用 <code>&amp;mut T</code>。这条规则防止了数据竞争，是内存安全的核心保障。</p>
<p>然而，在某些合理的设计场景中，这条规则会成为阻碍。<strong>内部可变性</strong> (Interior Mutability) 是一种设计模式，它允许你即使在持有不可变引用时，也能修改数据内部的值。</p>
<p>这听起来像是在绕开 Rust 的安全保障，实际上并非如此。<code>RefCell&lt;T&gt;</code> 并没有绕过借用规则，它只是将借用检查从<strong>编译时</strong>推迟到了<strong>运行时</strong>。如果运行时违反了规则，程序会 Panic 而不是产生未定义行为。</p>
<h2 id="refcellt运行时的借用检查"><code>RefCell&lt;T&gt;</code>：运行时的借用检查</h2>
<p>让我们先来理解 <code>Box&lt;T&gt;</code>、<code>Rc&lt;T&gt;</code> 和 <code>RefCell&lt;T&gt;</code> 之间的核心差异：</p>
<table><thead><tr><th>类型</th><th>所有者数量</th><th>借用检查时机</th><th>可变性</th></tr></thead><tbody><tr><td><code>Box&lt;T&gt;</code></td><td>唯一</td><td>编译时</td><td>可变或不可变</td></tr><tr><td><code>Rc&lt;T&gt;</code></td><td>多个</td><td>编译时</td><td>仅不可变</td></tr><tr><td><code>RefCell&lt;T&gt;</code></td><td>唯一</td><td><strong>运行时</strong></td><td>可变或不可变</td></tr></tbody></table>
<p><code>RefCell&lt;T&gt;</code> 提供了两个核心方法：</p>
<ul>
<li><strong><code>borrow()</code></strong>：返回 <code>Ref&lt;T&gt;</code>，行为类似不可变引用 <code>&amp;T</code>。</li>
<li><strong><code>borrow_mut()</code></strong>：返回 <code>RefMut&lt;T&gt;</code>，行为类似可变引用 <code>&amp;mut T</code>。</li>
</ul>
<p><code>RefCell&lt;T&gt;</code> 在内部维护一个计数器，追踪当前活跃的 <code>Ref&lt;T&gt;</code> 和 <code>RefMut&lt;T&gt;</code> 的数量。规则和编译期一样：可以同时有多个 <code>Ref&lt;T&gt;</code>，但 <code>RefMut&lt;T&gt;</code> 必须独占。如果违反，程序会 Panic：</p>
<pre><code class="language-text">thread 'main' panicked at 'already borrowed: BorrowMutError'</code></pre>
<h3 id="何时选择-refcellt">何时选择 <code>RefCell&lt;T&gt;</code></h3>
<p>当你<strong>确信</strong>代码在运行时不会违反借用规则，但编译器因为其分析的保守性而无法证明这一点时，<code>RefCell&lt;T&gt;</code> 是正确的选择。</p>
<h1 id="内部可变性实战">内部可变性实战</h1>
<p>最直接的场景：一个计数器，需要在只有 <code>&amp;self</code> 的方法里更新自身状态。</p>
<h2 id="直接修改编译失败">直接修改（编译失败）</h2>
<pre><code class="language-rust">struct Counter {
    count: i32,
}

impl Counter {
    // &amp;self 而非 &amp;mut self
    fn increment(&amp;self) {
        self.count += 1; // 编译错误：不能通过不可变引用修改字段
    }
}</code></pre>
<h2 id="用-refcellt-解决">用 <code>RefCell&lt;T&gt;</code> 解决</h2>
<div class="code-runner" data-full-code="use%20std%3A%3Acell%3A%3ARefCell%3B%0A%0Astruct%20Counter%20%7B%0A%20%20%20%20count%3A%20RefCell%3Ci32%3E%2C%0A%7D%0A%0Aimpl%20Counter%20%7B%0A%20%20%20%20fn%20new()%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Counter%20%7B%20count%3A%20RefCell%3A%3Anew(0)%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E7%AD%BE%E5%90%8D%E4%BB%8D%E6%98%AF%20%26self%EF%BC%8C%E4%BD%86%E5%86%85%E9%83%A8%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%0A%20%20%20%20fn%20increment(%26self)%20%7B%0A%20%20%20%20%20%20%20%20*self.count.borrow_mut()%20%2B%3D%201%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20value(%26self)%20-%3E%20i32%20%7B%0A%20%20%20%20%20%20%20%20*self.count.borrow()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20c%20%3D%20Counter%3A%3Anew()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20c.increment()%3B%0A%20%20%20%20println!(%22%E8%AE%A1%E6%95%B0%3A%20%7B%7D%22%2C%20c.value())%3B%20%2F%2F%203%0A%7D" data-mode="run"><pre><code class="language-rust">use std::cell::RefCell;

struct Counter {
    count: RefCell&lt;i32&gt;,
}

impl Counter {
    fn new() -&gt; Self {
        Counter { count: RefCell::new(0) }
    }

    // 签名仍是 &amp;self，但内部可以修改
    fn increment(&amp;self) {
        *self.count.borrow_mut() += 1;
    }

    fn value(&amp;self) -&gt; i32 {
        *self.count.borrow()
    }
}

fn main() {
    let c = Counter::new();
    c.increment();
    c.increment();
    c.increment();
    println!("计数: {}", c.value()); // 3
}</code></pre></div>
<p><code>borrow_mut()</code> 返回一个 <code>RefMut&lt;T&gt;</code> 智能指针，通过 <code>*</code> 解引用后就可以修改内部值，用完后自动归还借用权。<code>borrow()</code> 同理，返回 <code>Ref&lt;T&gt;</code> 用于只读访问。</p>
<h1 id="rcrefcellt共享且可变"><code>Rc&lt;RefCell&lt;T&gt;&gt;</code>：共享且可变</h1>
<p><code>Rc&lt;T&gt;</code> 和 <code>RefCell&lt;T&gt;</code> 结合是 Rust 中一个非常强大的模式：</p>
<ul>
<li><code>Rc&lt;T&gt;</code> 解决了<strong>多所有者</strong>的问题</li>
<li><code>RefCell&lt;T&gt;</code> 解决了<strong>可变性</strong>的问题</li>
</ul>
<p>两者相结合，就能得到一个可以被多处共享，同时又可以被任意一处修改的值。可变性的借用检查仍然存在，只是时机变了——<code>Rc</code> 允许你从任意一个持有者处调用 <code>borrow_mut()</code>，但 <code>RefCell</code> 会在运行时确保同一时刻最多只有一个可变借用活跃；若有多个持有者同时尝试调用 <code>borrow_mut()</code> 且互相重叠，程序会 Panic：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Arc%3A%3ARc%3B%0Ause%20std%3A%3Acell%3A%3ARefCell%3B%0A%0A%23%5Bderive(Debug)%5D%0Aenum%20List%20%7B%0A%20%20%20%20Cons(Rc%3CRefCell%3Ci32%3E%3E%2C%20Rc%3CList%3E)%2C%0A%20%20%20%20Nil%2C%0A%7D%0Ause%20List%3A%3A%7BCons%2C%20Nil%7D%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%BF%99%E4%B8%AA%E5%80%BC%E5%B0%86%E8%A2%AB%E5%A4%9A%E4%B8%AA%E5%88%97%E8%A1%A8%E8%8A%82%E7%82%B9%E5%85%B1%E4%BA%AB%EF%BC%8C%E4%B8%94%E5%8F%AF%E4%BB%A5%E8%A2%AB%E4%BF%AE%E6%94%B9%0A%20%20%20%20let%20shared_value%20%3D%20Rc%3A%3Anew(RefCell%3A%3Anew(5))%3B%0A%0A%20%20%20%20%2F%2F%20a%E3%80%81b%E3%80%81c%20%E4%B8%89%E4%B8%AA%E5%88%97%E8%A1%A8%E9%83%BD%E6%8C%81%E6%9C%89%20shared_value%20%E7%9A%84%E4%B8%80%E4%BB%BD%E6%89%80%E6%9C%89%E6%9D%83%0A%20%20%20%20let%20a%20%3D%20Rc%3A%3Anew(Cons(Rc%3A%3Aclone(%26shared_value)%2C%20Rc%3A%3Anew(Nil)))%3B%0A%20%20%20%20let%20b%20%3D%20Cons(Rc%3A%3Anew(RefCell%3A%3Anew(3))%2C%20Rc%3A%3Aclone(%26a))%3B%0A%20%20%20%20let%20c%20%3D%20Cons(Rc%3A%3Anew(RefCell%3A%3Anew(4))%2C%20Rc%3A%3Aclone(%26a))%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BF%AE%E6%94%B9%20shared_value%20%E7%9A%84%E5%80%BC%0A%20%20%20%20*shared_value.borrow_mut()%20%2B%3D%2010%3B%0A%0A%20%20%20%20%2F%2F%20%E6%89%80%E6%9C%89%E6%8C%81%E6%9C%89%20shared_value%20%E7%9A%84%E5%88%97%E8%A1%A8%E8%8A%82%E7%82%B9%E9%83%BD%E7%9C%8B%E5%88%B0%E4%BA%86%E6%9B%B4%E6%96%B0%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20a%20%3D%20%7B%3A%3F%7D%22%2C%20a)%3B%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20b%20%3D%20%7B%3A%3F%7D%22%2C%20b)%3B%0A%20%20%20%20println!(%22%E4%BF%AE%E6%94%B9%E5%90%8E%20c%20%3D%20%7B%3A%3F%7D%22%2C%20c)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
enum List {
    Cons(Rc&lt;RefCell&lt;i32&gt;&gt;, Rc&lt;List&gt;),
    Nil,
}
use List::{Cons, Nil};

fn main() {
    // 这个值将被多个列表节点共享，且可以被修改
    let shared_value = Rc::new(RefCell::new(5));

    // a、b、c 三个列表都持有 shared_value 的一份所有权
    let a = Rc::new(Cons(Rc::clone(&amp;shared_value), Rc::new(Nil)));
    let b = Cons(Rc::new(RefCell::new(3)), Rc::clone(&amp;a));
    let c = Cons(Rc::new(RefCell::new(4)), Rc::clone(&amp;a));

    // 修改 shared_value 的值
    *shared_value.borrow_mut() += 10;

    // 所有持有 shared_value 的列表节点都看到了更新
    println!("修改后 a = {:?}", a);
    println!("修改后 b = {:?}", b);
    println!("修改后 c = {:?}", c);
}</code></pre></div>
<h1 id="练习题">练习题</h1>
<h2 id="测验">测验</h2>
<div class="quiz-choice" data-block-id="13-smart-pointers/04-refcell#3:0" data-kind="single" data-payload="%7B%22question%22%3A%22%60RefCell%3CT%3E%60%20%E7%9B%B8%E5%AF%B9%E4%BA%8E%E6%99%AE%E9%80%9A%E5%BC%95%E7%94%A8%EF%BC%8C%E6%9C%80%E4%B8%BB%E8%A6%81%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AE%83%E7%A6%81%E6%AD%A2%E4%BA%86%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E3%80%82%22%2C%22%E5%AE%83%E5%B0%86%E5%80%9F%E7%94%A8%E8%A7%84%E5%88%99%E7%9A%84%E6%A3%80%E6%9F%A5%E4%BB%8E%E7%BC%96%E8%AF%91%E6%9C%9F%E6%8E%A8%E8%BF%9F%E5%88%B0%E8%BF%90%E8%A1%8C%E6%97%B6%EF%BC%8C%E5%85%81%E8%AE%B8%E5%9C%A8%E6%9F%90%E4%BA%9B%E7%BC%96%E8%AF%91%E5%99%A8%E6%97%A0%E6%B3%95%E9%AA%8C%E8%AF%81%E7%9A%84%E5%9C%BA%E6%99%AF%E4%B8%AD%E8%BF%9B%E8%A1%8C%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E3%80%82%22%2C%22%E5%AE%83%E5%8F%AF%E4%BB%A5%E8%B7%A8%E7%BA%BF%E7%A8%8B%E4%BD%BF%E7%94%A8%E3%80%82%22%2C%22%E5%AE%83%E5%85%81%E8%AE%B8%E5%A4%9A%E4%B8%AA%E6%89%80%E6%9C%89%E8%80%85%E3%80%82%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22RefCell%20%E4%BB%8D%E7%84%B6%E9%81%B5%E5%AE%88%E5%80%9F%E7%94%A8%E8%A7%84%E5%88%99%EF%BC%8C%E5%8F%AA%E6%98%AF%E6%A3%80%E6%9F%A5%E6%97%B6%E6%9C%BA%E5%8F%98%E4%BA%86%E3%80%82%E8%BF%9D%E8%A7%84%E4%BC%9A%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%20Panic%EF%BC%8C%E8%80%8C%E9%9D%9E%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="13-smart-pointers/04-refcell#3:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%A6%82%E6%9E%9C%E5%9C%A8%E5%90%8C%E4%B8%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%86%85%E5%AF%B9%E4%B8%80%E4%B8%AA%20%60RefCell%3CT%3E%60%20%E8%B0%83%E7%94%A8%E4%BA%86%E4%B8%A4%E6%AC%A1%20%60borrow_mut()%60%EF%BC%8C%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%AC%AC%E4%BA%8C%E6%AC%A1%E8%B0%83%E7%94%A8%E4%BC%9A%E7%AD%89%E5%BE%85%E7%AC%AC%E4%B8%80%E6%AC%A1%E9%87%8A%E6%94%BE%E3%80%82%22%2C%22%E7%BC%96%E8%AF%91%E6%8A%A5%E9%94%99%E3%80%82%22%2C%22%E6%AD%A3%E5%B8%B8%E8%BF%90%E8%A1%8C%EF%BC%8C%E4%BD%86%E5%8F%AF%E8%83%BD%E4%BA%A7%E7%94%9F%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E3%80%82%22%2C%22%E8%BF%90%E8%A1%8C%E6%97%B6%20Panic%EF%BC%8C%E5%B9%B6%E6%98%BE%E7%A4%BA%20%60BorrowMutError%60%E3%80%82%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22RefCell%20%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E7%BB%B4%E6%8A%A4%E5%80%9F%E7%94%A8%E8%AE%A1%E6%95%B0%EF%BC%8C%E8%BF%9D%E5%8F%8D%E8%A7%84%E5%88%99%E6%97%B6%E4%BC%9A%20Panic%20%E5%B9%B6%E9%80%80%E5%87%BA%E7%BA%BF%E7%A8%8B%EF%BC%8C%E4%BB%A5%E6%AD%A4%E6%9B%BF%E4%BB%A3%E7%BC%96%E8%AF%91%E6%97%B6%E9%94%99%E8%AF%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">use std::rc::Rc;
use std::cell::RefCell;

let data = Rc::new(RefCell::new(0));
let a = Rc::clone(&amp;data);
let b = Rc::clone(&amp;data);

*a.borrow_mut() += 10;
*b.borrow_mut() += 5;

println!("{}", data.borrow());</code></pre>
<div class="quiz-choice" data-block-id="13-smart-pointers/04-refcell#3:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8A%E4%BB%A3%E7%A0%81%E6%9C%80%E7%BB%88%E6%89%93%E5%8D%B0%E7%9A%84%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%2210%22%2C%220%22%2C%225%22%2C%2215%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22a%20%E5%92%8C%20b%20%E9%83%BD%E6%8C%81%E6%9C%89%E5%90%8C%E4%B8%80%E4%B8%AA%20RefCell%3Ci32%3E%20%E7%9A%84%E5%85%B1%E4%BA%AB%E6%89%80%E6%9C%89%E6%9D%83%E3%80%82%E4%B8%A4%E6%AC%A1%20borrow_mut()%20%E5%88%86%E5%88%AB%E5%8A%A0%E4%BA%86%2010%20%E5%92%8C%205%EF%BC%8C%E6%9C%80%E7%BB%88%E5%80%BC%E4%B8%BA%2015%E3%80%82%E6%AF%8F%E6%AC%A1%20borrow_mut()%20%E8%B0%83%E7%94%A8%E7%BB%93%E6%9D%9F%E5%90%8E%E5%80%9F%E7%94%A8%E6%9D%83%E7%AB%8B%E5%8D%B3%E5%BD%92%E8%BF%98%EF%BC%8C%E6%89%80%E4%BB%A5%E4%B8%A4%E6%AC%A1%E8%B0%83%E7%94%A8%E4%B8%8D%E4%BC%9A%E5%86%B2%E7%AA%81%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="13-smart-pointers/04-refcell#3:3" data-kind="single" data-payload="%7B%22question%22%3A%22%60borrow()%60%20%E5%92%8C%20%60borrow_mut()%60%20%E7%9A%84%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E5%88%86%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%60Cell%3CT%3E%60%20%E5%92%8C%20%60Cell%3CT%3E%60%22%2C%22%60Ref%3CT%3E%60%20%E5%92%8C%20%60RefMut%3CT%3E%60%22%2C%22%60Option%3C%26T%3E%60%20%E5%92%8C%20%60Option%3C%26mut%20T%3E%60%22%2C%22%60%26T%60%20%E5%92%8C%20%60%26mut%20T%60%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E8%BF%94%E5%9B%9E%E7%9A%84%E6%98%AF%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88%20Ref%3CT%3E%20%E5%92%8C%20RefMut%3CT%3E%EF%BC%8C%E5%AE%83%E4%BB%AC%E5%AE%9E%E7%8E%B0%E4%BA%86%20Deref%EF%BC%8C%E4%BC%9A%E5%9C%A8%20Drop%20%E6%97%B6%E8%87%AA%E5%8A%A8%E5%87%8F%E5%B0%91%E5%80%9F%E7%94%A8%E8%AE%A1%E6%95%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="13-smart-pointers/04-refcell#3:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%E4%BB%A5%E4%B8%8B%E5%9C%BA%E6%99%AF%E4%B8%AD%EF%BC%8C%E5%93%AA%E7%A7%8D%E7%BB%84%E5%90%88%E6%9C%80%E5%90%88%E9%80%82%EF%BC%9F%E9%9C%80%E8%A6%81%E5%9C%A8%E5%8D%95%E7%BA%BF%E7%A8%8B%E7%8E%AF%E5%A2%83%E4%B8%AD%EF%BC%8C%E8%AE%A9%E5%A4%9A%E4%B8%AA%E5%9C%B0%E6%96%B9%E8%83%BD%E5%A4%9F%E4%BF%AE%E6%94%B9%E5%90%8C%E4%B8%80%E4%BB%BD%E5%85%B1%E4%BA%AB%E6%95%B0%E6%8D%AE%E3%80%82%22%2C%22options%22%3A%5B%22%60Rc%3CRefCell%3CT%3E%3E%60%22%2C%22%60Arc%3CMutex%3CT%3E%3E%60%22%2C%22%60Rc%3CT%3E%60%22%2C%22%60Box%3CRefCell%3CT%3E%3E%60%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rc%20%E6%8F%90%E4%BE%9B%E5%A4%9A%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8CRefCell%20%E6%8F%90%E4%BE%9B%E5%86%85%E9%83%A8%E5%8F%AF%E5%8F%98%E6%80%A7%EF%BC%8C%E4%BA%8C%E8%80%85%E7%BB%84%E5%90%88%E6%81%B0%E5%A5%BD%E6%BB%A1%E8%B6%B3%E5%8D%95%E7%BA%BF%E7%A8%8B%E5%A4%9A%E5%86%99%E7%9A%84%E9%9C%80%E6%B1%82%E3%80%82Arc%3CMutex%3CT%3E%3E%20%E7%94%A8%E4%BA%8E%E5%A4%9A%E7%BA%BF%E7%A8%8B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
