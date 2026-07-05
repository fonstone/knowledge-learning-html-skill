---
chapterId: "10-generics-traits"
lessonId: "05-practice"
title: "综合练习"
level: "进阶"
duration: "10 分钟"
tags: [泛型, 练习, 综合]
number: "10.5"
chapterTitle: "泛型与 Trait"
chapterNumber: "10"
---
<div id="article-content"> <h1 id="综合判断题">综合判断题</h1>
<h2 id="泛型语法测验">泛型语法测验</h2>
<div class="quiz-choice" data-block-id="10-generics-traits/05-practice#0:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E9%9D%A2%E5%93%AA%E4%B8%AA%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D%E8%83%BD%E6%AD%A3%E7%A1%AE%E7%BC%96%E8%AF%91%EF%BC%9F%22%2C%22options%22%3A%5B%22fn%20first%3CT%3A%20Clone%3E(list%3A%20%26%5BT%5D)%20-%3E%20T%20%7B%20list%5B0%5D.clone()%20%7D%22%2C%22fn%20first%3CT%3E(list%3A%20%26%5BT%5D)%20-%3E%20T%20%7B%20list%5B0%5D%20%7D%22%2C%22fn%20first%3CT%3E(list%3A%20Vec%3CT%3E)%20-%3E%20%26T%20%7B%20%26list%5B0%5D%20%7D%22%2C%22fn%20first(list%3A%20%26%5BT%5D)%20-%3E%20%26T%20%7B%20%26list%5B0%5D%20%7D%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E7%AC%AC%E4%BA%8C%E9%A1%B9%EF%BC%9A%E6%8A%8A%20T%20%E4%BB%8E%E5%BC%95%E7%94%A8%E4%B8%AD%E7%A7%BB%E5%87%BA%E9%9C%80%E8%A6%81%20Copy%20%E6%88%96%20Clone%EF%BC%8C%E4%B8%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%20list%5B0%5D%E3%80%82%E7%AC%AC%E4%B8%80%E9%A1%B9%E6%AD%A3%E7%A1%AE%EF%BC%9A%E5%8A%A0%E4%BA%86%20Clone%20%E7%BA%A6%E6%9D%9F%E5%90%8E%E5%8F%AF%E4%BB%A5%20.clone()%E3%80%82%E7%AC%AC%E5%9B%9B%E9%A1%B9%EF%BC%9AT%20%E6%9C%AA%E5%A3%B0%E6%98%8E%E3%80%82%E7%AC%AC%E4%B8%89%E9%A1%B9%EF%BC%9A%E8%BF%94%E5%9B%9E%E5%AF%B9%E5%B1%80%E9%83%A8%20Vec%20%E7%9A%84%E5%BC%95%E7%94%A8%EF%BC%8C%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%94%99%E8%AF%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">struct Stack&lt;T&gt; {
    items: Vec&lt;T&gt;,
}

impl&lt;T&gt; Stack&lt;T&gt; {
    fn new() -&gt; Self { Stack { items: Vec::new() } }
    fn push(&amp;mut self, item: T) { self.items.push(item); }
    fn pop(&amp;mut self) -&gt; Option&lt;T&gt; { self.items.pop() }
    fn is_empty(&amp;self) -&gt; bool { self.items.is_empty() }
}</code></pre>
<div class="quiz-choice" data-block-id="10-generics-traits/05-practice#0:1" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E4%B8%8A%E9%9D%A2%E7%9A%84%20Stack%3CT%3E%EF%BC%8C%E5%93%AA%E4%BA%9B%E8%AF%B4%E6%B3%95%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22Stack%3Ci32%3E%20%E5%92%8C%20Stack%3CString%3E%20%E9%83%BD%E8%83%BD%E6%AD%A3%E5%B8%B8%E4%BD%BF%E7%94%A8%22%2C%22is_empty%20%E4%B8%8D%E9%9C%80%E8%A6%81%20T%20%E6%9C%89%E4%BB%BB%E4%BD%95%E7%BA%A6%E6%9D%9F%E5%B0%B1%E8%83%BD%E8%B0%83%E7%94%A8%22%2C%22push%20%E5%92%8C%20pop%20%E5%8F%AF%E4%BB%A5%E5%9C%A8%E5%90%8C%E4%B8%80%E4%B8%AA%20Stack%20%E5%AE%9E%E4%BE%8B%E4%B8%8A%E4%BA%A4%E6%9B%BF%E8%B0%83%E7%94%A8%22%2C%22Stack%3CT%3E%20%E9%9A%90%E5%BC%8F%E8%A6%81%E6%B1%82%20T%3A%20Clone%22%5D%2C%22correct%22%3A%5B0%2C1%2C2%5D%2C%22explanation%22%3A%22Stack%3CT%3E%20%E6%B2%A1%E6%9C%89%E7%BA%A6%E6%9D%9F%EF%BC%8CVec%20%E7%9A%84%20push%2Fpop%20%E5%AF%B9%E4%BB%BB%E6%84%8F%20T%20%E9%83%BD%E6%9C%89%E6%95%88%EF%BC%8Cis_empty%20%E5%8F%AA%E6%A3%80%E6%9F%A5%E9%95%BF%E5%BA%A6%EF%BC%8CClone%20%E4%B8%8D%E6%98%AF%E9%9A%90%E5%BC%8F%E8%A6%81%E6%B1%82%E7%9A%84%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="10-generics-traits/05-practice#0:2" data-kind="single" data-payload="%7B%22question%22%3A%22impl%3CT%3E%20Point%3CT%3E%20%E5%92%8C%20impl%20Point%3Cf64%3E%20%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%A4%E7%A7%8D%E5%86%99%E6%B3%95%E5%8A%9F%E8%83%BD%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%22%2C%22impl%20Point%3Cf64%3E%20%E4%BC%9A%E8%A6%86%E7%9B%96%20impl%3CT%3E%20%E5%AF%B9%20f64%20%E7%9A%84%E6%89%80%E6%9C%89%E5%AE%9E%E7%8E%B0%22%2C%22Rust%20%E4%B8%8D%E5%85%81%E8%AE%B8%E4%B8%A4%E8%80%85%E5%85%B1%E5%AD%98%E4%BA%8E%E5%90%8C%E4%B8%80%E6%96%87%E4%BB%B6%22%2C%22impl%3CT%3E%20%E4%B8%BA%E6%89%80%E6%9C%89%E7%B1%BB%E5%9E%8B%E5%AE%9E%E7%8E%B0%EF%BC%8Cimpl%20Point%3Cf64%3E%20%E5%8F%AA%E4%B8%BA%20f64%20%E5%AE%9E%E7%8E%B0%E4%B8%93%E5%B1%9E%E6%96%B9%E6%B3%95%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E4%B8%A4%E8%80%85%E5%8F%AF%E4%BB%A5%E5%90%8C%E6%97%B6%E5%AD%98%E5%9C%A8%E3%80%82impl%3CT%3E%20%E7%9A%84%E6%96%B9%E6%B3%95%E5%AF%B9%E6%89%80%E6%9C%89%20Point%20%E9%83%BD%E6%9C%89%E6%95%88%EF%BC%9Bimpl%20Point%3Cf64%3E%20%E6%B7%BB%E5%8A%A0%E7%9A%84%E6%96%B9%E6%B3%95%E5%8F%AA%E6%9C%89%20f64%20%E7%89%88%E6%9C%AC%E6%89%8D%E8%83%BD%E8%B0%83%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="10-generics-traits/05-practice#0:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E5%8D%95%E6%80%81%E5%8C%96%EF%BC%8C%E5%93%AA%E4%B8%AA%E8%AF%B4%E6%B3%95%E6%98%AF%E9%94%99%E8%AF%AF%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8D%95%E6%80%81%E5%8C%96%E4%BC%9A%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BD%BF%E7%94%A8%E8%99%9A%E5%87%BD%E6%95%B0%E8%A1%A8%EF%BC%88vtable%EF%BC%89%E8%BF%9B%E8%A1%8C%E7%B1%BB%E5%9E%8B%E6%9F%A5%E6%89%BE%22%2C%22%E5%8D%95%E6%80%81%E5%8C%96%E5%90%8E%E7%9A%84%E4%BB%A3%E7%A0%81%E8%BF%90%E8%A1%8C%E9%80%9F%E5%BA%A6%E4%B8%8E%E6%89%8B%E5%86%99%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%E4%BB%A3%E7%A0%81%E7%9B%B8%E5%90%8C%22%2C%22%E5%8D%95%E6%80%81%E5%8C%96%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E5%AE%8C%E6%88%90%22%2C%22%E4%BD%BF%E7%94%A8%E7%9A%84%E6%B3%9B%E5%9E%8B%E7%B1%BB%E5%9E%8B%E8%B6%8A%E5%A4%9A%EF%BC%8C%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%BD%93%E7%A7%AF%E5%8F%AF%E8%83%BD%E8%B6%8A%E5%A4%A7%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22vtable%20%E6%98%AF%E5%8A%A8%E6%80%81%E5%88%86%E5%8F%91%EF%BC%88dyn%20Trait%EF%BC%89%E7%9A%84%E6%9C%BA%E5%88%B6%EF%BC%8C%E4%B8%8D%E6%98%AF%E5%8D%95%E6%80%81%E5%8C%96%E3%80%82%E5%8D%95%E6%80%81%E5%8C%96%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E4%B8%BA%E6%AF%8F%E7%A7%8D%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%E7%94%9F%E6%88%90%E7%8B%AC%E7%AB%8B%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%BF%90%E8%A1%8C%E6%97%B6%E6%B2%A1%E6%9C%89%E4%BB%BB%E4%BD%95%E7%B1%BB%E5%9E%8B%E6%9F%A5%E6%89%BE%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h1 id="编程练习">编程练习</h1>
<h2 id="练习一泛型栈">练习一：泛型栈</h2>
<p>下面是一个只能存 <code>i32</code> 的栈，实现已经完整。请把它改成泛型版本 <code>Stack&lt;T&gt;</code>，让它能存任意类型：</p>
<div class="code-editor" data-block-id="10-generics-traits/05-practice#1:0" data-expect-mode="literal" data-expect-pattern="%E6%A0%88%E9%A1%B6%3A%20Some(3)%0A%E5%BC%B9%E5%87%BA%3A%20Some(3)%0A%E6%A0%88%E9%A1%B6%3A%20Some(%22world%22)%0A%E7%A9%BA%E6%A0%88%3A%20false" data-starter-code="%2F%2F%20TODO%3A%20%E6%8A%8A%20i32%20%E6%8D%A2%E6%88%90%E6%B3%9B%E5%9E%8B%E5%8F%82%E6%95%B0%20T%0Astruct%20Stack%20%7B%0A%20%20%20%20items%3A%20Vec%3Ci32%3E%2C%0A%7D%0A%0Aimpl%20Stack%20%7B%0A%20%20%20%20fn%20new()%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20Stack%20%7B%20items%3A%20Vec%3A%3Anew()%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20push(%26mut%20self%2C%20item%3A%20i32)%20%7B%0A%20%20%20%20%20%20%20%20self.items.push(item)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20pop(%26mut%20self)%20-%3E%20Option%3Ci32%3E%20%7B%0A%20%20%20%20%20%20%20%20self.items.pop()%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20peek(%26self)%20-%3E%20Option%3C%26i32%3E%20%7B%0A%20%20%20%20%20%20%20%20self.items.last()%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20is_empty(%26self)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20self.items.is_empty()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%94%B9%E5%AE%8C%E5%90%8E%E8%BF%99%E4%B8%A4%E6%AE%B5%E4%BB%A3%E7%A0%81%E9%83%BD%E5%BA%94%E8%AF%A5%E8%83%BD%E7%BC%96%E8%AF%91%E8%BF%90%E8%A1%8C%0A%20%20%20%20let%20mut%20int_stack%3A%20Stack%3Ci32%3E%20%3D%20Stack%3A%3Anew()%3B%0A%20%20%20%20int_stack.push(1)%3B%0A%20%20%20%20int_stack.push(2)%3B%0A%20%20%20%20int_stack.push(3)%3B%0A%20%20%20%20println!(%22%E6%A0%88%E9%A1%B6%3A%20%7B%3A%3F%7D%22%2C%20int_stack.peek())%3B%20%2F%2F%20Some(3)%0A%20%20%20%20println!(%22%E5%BC%B9%E5%87%BA%3A%20%7B%3A%3F%7D%22%2C%20int_stack.pop())%3B%20%20%2F%2F%20Some(3)%0A%0A%20%20%20%20let%20mut%20str_stack%3A%20Stack%3C%26str%3E%20%3D%20Stack%3A%3Anew()%3B%0A%20%20%20%20str_stack.push(%22hello%22)%3B%0A%20%20%20%20str_stack.push(%22world%22)%3B%0A%20%20%20%20println!(%22%E6%A0%88%E9%A1%B6%3A%20%7B%3A%3F%7D%22%2C%20str_stack.peek())%3B%20%2F%2F%20Some(%22world%22)%0A%20%20%20%20println!(%22%E7%A9%BA%E6%A0%88%3A%20%7B%7D%22%2C%20int_stack.is_empty())%3B%20%2F%2F%20false%0A%7D"><pre><code class="language-rust">// TODO: 把 i32 换成泛型参数 T
struct Stack {
    items: Vec&lt;i32&gt;,
}

impl Stack {
    fn new() -&gt; Self {
        Stack { items: Vec::new() }
    }

    fn push(&amp;mut self, item: i32) {
        self.items.push(item);
    }

    fn pop(&amp;mut self) -&gt; Option&lt;i32&gt; {
        self.items.pop()
    }

    fn peek(&amp;self) -&gt; Option&lt;&amp;i32&gt; {
        self.items.last()
    }

    fn is_empty(&amp;self) -&gt; bool {
        self.items.is_empty()
    }
}

fn main() {
    // 改完后这两段代码都应该能编译运行
    let mut int_stack: Stack&lt;i32&gt; = Stack::new();
    int_stack.push(1);
    int_stack.push(2);
    int_stack.push(3);
    println!("栈顶: {:?}", int_stack.peek()); // Some(3)
    println!("弹出: {:?}", int_stack.pop());  // Some(3)

    let mut str_stack: Stack&lt;&amp;str&gt; = Stack::new();
    str_stack.push("hello");
    str_stack.push("world");
    println!("栈顶: {:?}", str_stack.peek()); // Some("world")
    println!("空栈: {}", int_stack.is_empty()); // false
}</code></pre></div>
<h2 id="练习二泛型键值对">练习二：泛型键值对</h2>
<p>实现一个 <code>KeyValue&lt;K, V&gt;</code> 结构，存储一个键值对，并为它实现 <code>swap</code> 方法，返回键值互换后的新 <code>KeyValue&lt;V, K&gt;</code>。</p>
<div class="code-editor" data-block-id="10-generics-traits/05-practice#1:1" data-expect-mode="literal" data-expect-pattern="key%3Dname%2C%20value%3D42%0Akey%3D42%2C%20value%3Dname" data-starter-code="struct%20KeyValue%3CK%2C%20V%3E%20%7B%0A%20%20%20%20%2F%2F%20TODO%0A%7D%0A%0Aimpl%3CK%2C%20V%3E%20KeyValue%3CK%2C%20V%3E%20%7B%0A%20%20%20%20fn%20new(key%3A%20K%2C%20value%3A%20V)%20-%3E%20Self%20%7B%0A%20%20%20%20%20%20%20%20todo!()%0A%20%20%20%20%7D%0A%0A%20%20%20%20fn%20swap(self)%20-%3E%20KeyValue%3CV%2C%20K%3E%20%7B%0A%20%20%20%20%20%20%20%20todo!()%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20pair%20%3D%20KeyValue%3A%3Anew(%22name%22%2C%2042)%3B%0A%20%20%20%20println!(%22key%3D%7B%7D%2C%20value%3D%7B%7D%22%2C%20pair.key%2C%20pair.value)%3B%20%2F%2F%20key%3Dname%2C%20value%3D42%0A%0A%20%20%20%20let%20swapped%20%3D%20pair.swap()%3B%0A%20%20%20%20println!(%22key%3D%7B%7D%2C%20value%3D%7B%7D%22%2C%20swapped.key%2C%20swapped.value)%3B%20%2F%2F%20key%3D42%2C%20value%3Dname%0A%7D"><pre><code class="language-rust">struct KeyValue&lt;K, V&gt; {
    // TODO
}

impl&lt;K, V&gt; KeyValue&lt;K, V&gt; {
    fn new(key: K, value: V) -&gt; Self {
        todo!()
    }

    fn swap(self) -&gt; KeyValue&lt;V, K&gt; {
        todo!()
    }
}

fn main() {
    let pair = KeyValue::new("name", 42);
    println!("key={}, value={}", pair.key, pair.value); // key=name, value=42

    let swapped = pair.swap();
    println!("key={}, value={}", swapped.key, swapped.value); // key=42, value=name
}</code></pre></div> </div>
