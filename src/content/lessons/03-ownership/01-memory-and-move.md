---
chapterId: "03-ownership"
lessonId: "01-memory-and-move"
title: "内存与数据流动"
level: "入门"
duration: "20 分钟"
tags: ["栈", "堆", "移动", "Copy", "Clone", "内存模型"]
number: "3.1"
chapterTitle: "所有权系统"
chapterNumber: "03"
---

<div id="article-content"> <h1 id="内存基础栈与堆">内存基础：栈与堆</h1>
<p>Rust 中的所有权系统根本上是在管理数据在内存中的位置和生命周期。要理解所有权，必须先知道栈（Stack）和堆（Heap）的区别。</p>
<h2 id="栈stack">栈（Stack）</h2>
<p>栈用于存放函数调用的栈帧和那些<strong>大小在编译期已知的小数据</strong>（例如整数、布尔、固定大小的数组、指针元信息等）。栈的分配与释放遵循 LIFO（后进先出），速度很快且不需要运行时的分配器，但栈空间有限，无法直接保存运行时大小可变的数据。</p>
<img alt="Stack diagram" src="/RustCourse/diagrams/stack.svg" style="max-width:100%;margin:1rem 0;"/>
<h2 id="堆heap">堆（Heap）</h2>
<p>堆用于动态分配<strong>大小不确定或较大的数据</strong>（例如 <code>String</code>、<code>Vec&lt;T&gt;</code>、Box 指向的值等）。堆上的内存通过分配器（allocator）管理，分配/释放成本较高，且需要通过所有权或智能指针在程序中跟踪谁负责释放这块内存。</p>
<img alt="Heap diagram" src="/RustCourse/diagrams/heap.svg" style="max-width:100%;margin:1rem 0;"/>
<h2 id="栈与堆的配合以-string-为例">栈与堆的配合：以 String 为例</h2>
<p>栈存放<strong>大小编译期已知</strong>的数据，堆存放<strong>大小运行时可变</strong>的数据——但实际应用中，如果需要使用到堆，往往两者都要用到。让我们用 <code>String</code> 类型来看看它们如何配合：</p>
<pre><code class="language-rust">fn main() {
    let s = String::from("hello");
    // s 是什么存在栈上？整个字符串内容在哪？
}</code></pre>
<h3 id="string-的内存结构">String 的内存结构</h3>
<p><code>String</code> 在栈上只存<strong>三个字</strong>：</p>
<ul>
<li><strong>ptr</strong>：指向堆上数据的指针</li>
<li><strong>len</strong>：当前字符串的字节数（这里是 5）</li>
<li><strong>capacity</strong>：堆上已分配内存能容纳的最大字节数（通常 ≥ len）</li>
</ul>
<p>真正的字符数据 <code>"HelloWorld"</code> 存在<strong>堆上</strong>，通过 <code>ptr</code> 指针来访问。</p>
<img alt="String memory layout" src="/RustCourse/diagrams/string.svg" style="max-width:100%;margin:1rem 0;"/>
<h3 id="from-和-push_str-做了什么">from() 和 push_str() 做了什么</h3>
<p>这两个操作涉及不同的内存变化：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20println!(%22len%3A%20%7B%7D%2C%20capacity%3A%20%7B%7D%22%2C%20s.len()%2C%20s.capacity())%3B%0A%0A%20%20%20%20s.push_str(%22%2C%20world!%22)%3B%0A%20%20%20%20println!(%22len%3A%20%7B%7D%2C%20capacity%3A%20%7B%7D%22%2C%20s.len()%2C%20s.capacity())%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let mut s = String::from("hello");
    println!("len: {}, capacity: {}", s.len(), s.capacity());

    s.push_str(", world!");
    println!("len: {}, capacity: {}", s.len(), s.capacity());
}</code></pre></div>
<ul>
<li>
<p><strong><code>String::from("hello")</code></strong>：</p>
<ul>
<li>从只读数据区读取字面量 <code>"hello"</code></li>
<li>在堆上分配新空间</li>
<li>复制内容到堆上</li>
<li>在栈上创建 String 结构体指向这块堆内存</li>
</ul>
</li>
<li>
<p><strong><code>push_str(", world!")</code></strong>：</p>
<ul>
<li>检查当前容量是否足够</li>
<li>若容量不足，重新在堆上分配更大的空间，移动旧数据过去</li>
<li>追加新内容</li>
<li>更新 len（容量 capacity 可能也会改变）</li>
</ul>
</li>
</ul>
<img alt="String operations" src="/RustCourse/diagrams/string_opration.svg" style="max-width:100%;margin:1rem 0;"/>
<h1 id="数据流动的三种方式">数据流动的三种方式</h1>
<p>理解了栈与堆的区别，现在来看 Rust 里数据在变量之间”流动”时会发生什么。这是初学者最常卡住的地方——同样是 <code>let b = a</code> 这行代码，对整数和对 <code>String</code> 的行为截然不同。</p>
<h2 id="移动move">移动（Move）</h2>
<img alt="Heap diagram" src="/RustCourse/diagrams/move.svg" style="max-width:100%;margin:1rem 0;"/>
<p>当你把一个 <code>String</code> 赋值给另一个变量时，发生了什么？</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1%3B%20%2F%2F%20s1%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E7%A7%BB%E5%8A%A8%E7%BB%99%20s2%EF%BC%8Cs1%20%E4%BB%8E%E8%BF%99%E9%87%8C%E5%BC%80%E5%A7%8B%E6%97%A0%E6%95%88%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 的所有权移动给 s2，s1 从这里开始无效
    println!("{}", s2);
}</code></pre></div>
<p>Rust 把 <code>s1</code> 栈上的三元组（ptr, len, capacity）<strong>拷贝</strong>给了 <code>s2</code>，然后<strong>让 <code>s1</code> 失效</strong>——这个操作叫做<strong>移动</strong>（move）。注意：堆上的数据没有被复制，只是所有权换手了。</p>
<p>这样就解决了<strong>二次释放</strong>（double free）问题：现在只有 <code>s2</code> 是有效的，只有它离开作用域时才会释放内存。</p>
<p>下面这段代码无法编译——点”运行”看看错误信息长什么样：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E8%BD%AC%E7%A7%BB%E7%BB%99%20s2%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s1)%3B%20%20%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9As1%20%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%88moved%EF%BC%89%0A%7D" data-mode="expect-error"><pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1;           // 所有权已转移给 s2
    println!("{}", s1);    // 错误：s1 已失效（moved）
}</code></pre></div>
<h2 id="拷贝copy栈类型的隐式复制">拷贝（Copy）：栈类型的隐式复制</h2>
<img alt="Heap diagram" src="/RustCourse/diagrams/copy.svg" style="max-width:100%;margin:1rem 0;"/>
<p>整数、布尔、浮点、字符等类型存在栈上，大小固定，复制成本极低。Rust 对这类类型自动进行<strong>按值复制</strong>（copy），不会让原变量失效：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20x%3B%20%2F%2F%20x%20%E8%A2%AB%E5%A4%8D%E5%88%B6%EF%BC%8C%E4%B8%8D%E6%98%AF%E7%A7%BB%E5%8A%A8%0A%20%20%20%20println!(%22x%20%3D%20%7B%7D%2C%20y%20%3D%20%7B%7D%22%2C%20x%2C%20y)%3B%20%2F%2F%20%E4%B8%A4%E4%B8%AA%E9%83%BD%E6%9C%89%E6%95%88%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let x = 5;
    let y = x; // x 被复制，不是移动
    println!("x = {}, y = {}", x, y); // 两个都有效
}</code></pre></div>
<p>实现了 <code>Copy</code> 特征的类型在赋值后原变量仍然有效。常见的 Copy 类型：</p>
<ul>
<li>所有整数类型：<code>i32</code>、<code>u64</code> 等</li>
<li>浮点类型：<code>f32</code>、<code>f64</code></li>
<li>布尔类型：<code>bool</code></li>
<li>字符类型：<code>char</code></li>
<li>元组，当所有字段都是 Copy 类型时，如 <code>(i32, bool)</code></li>
</ul>
<p><code>String</code>、<code>Vec</code> 等堆分配类型<strong>不是</strong> Copy 类型，赋值时会发生移动。</p>
<h2 id="克隆clone真正的深拷贝">克隆（Clone）：真正的深拷贝</h2>
<img alt="Heap diagram" src="/RustCourse/diagrams/clone.svg" style="max-width:100%;margin:1rem 0;"/>
<p>如果确实需要两份独立的数据，用 <code>.clone()</code>：</p>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1.clone()%3B%20%2F%2F%20%E5%A0%86%E4%B8%8A%E6%95%B0%E6%8D%AE%E8%A2%AB%E5%AE%8C%E6%95%B4%E5%A4%8D%E5%88%B6%0A%20%20%20%20println!(%22s1%20%3D%20%7B%7D%2C%20s2%20%3D%20%7B%7D%22%2C%20s1%2C%20s2)%3B%20%2F%2F%20%E4%B8%A4%E4%B8%AA%E9%83%BD%E6%9C%89%E6%95%88%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone(); // 堆上数据被完整复制
    println!("s1 = {}, s2 = {}", s1, s2); // 两个都有效
}</code></pre></div>
<p><code>.clone()</code> 是明显的”重操作”提示——堆内存被完整复制，会有性能开销。Rust 故意让这个操作显式，让你知道”这里有成本”。</p>
<h2 id="三种方式对比">三种方式对比</h2>
<table><thead><tr><th>操作</th><th>发生条件</th><th>原变量是否失效</th><th>是否复制堆数据</th></tr></thead><tbody><tr><td><strong>移动（Move）</strong></td><td>堆分配类型赋值/传参</td><td>❌ 失效</td><td>否（只复制栈上元数据）</td></tr><tr><td><strong>复制（Copy）</strong></td><td>栈类型（实现 Copy 特征）</td><td>✅ 仍有效</td><td>不涉及堆数据</td></tr><tr><td><strong>克隆（Clone）</strong></td><td>显式调用 <code>.clone()</code></td><td>✅ 仍有效</td><td>✅ 是（深拷贝）</td></tr></tbody></table>
<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%9A%E8%B5%8B%E5%80%BC%E5%90%8E%E5%8F%8C%E6%96%B9%E9%83%BD%E6%9C%89%E6%95%88%0A%20%20%20%20let%20a%20%3D%2042_i32%3B%0A%20%20%20%20let%20b%20%3D%20a%3B%0A%20%20%20%20println!(%22a%3D%7B%7D%2C%20b%3D%7B%7D%22%2C%20a%2C%20b)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%A7%BB%E5%8A%A8%E7%B1%BB%E5%9E%8B%EF%BC%9A%E8%B5%8B%E5%80%BC%E5%90%8E%E5%8E%9F%E5%8F%98%E9%87%8F%E5%A4%B1%E6%95%88%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20s2%20%3D%20s1%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s2)%3B%20%2F%2F%20s1%20%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E5%8F%AA%E8%83%BD%E7%94%A8%20s2%0A%0A%20%20%20%20%2F%2F%20%E6%98%BE%E5%BC%8F%E5%85%8B%E9%9A%86%EF%BC%9A%E4%BF%9D%E7%95%99%E5%8E%9F%E5%8F%98%E9%87%8F%EF%BC%8C%E5%A0%86%E6%95%B0%E6%8D%AE%E8%A2%AB%E5%AE%8C%E6%95%B4%E5%A4%8D%E5%88%B6%0A%20%20%20%20let%20s3%20%3D%20String%3A%3Afrom(%22world%22)%3B%0A%20%20%20%20let%20s4%20%3D%20s3.clone()%3B%0A%20%20%20%20println!(%22s3%3D%7B%7D%2C%20s4%3D%7B%7D%22%2C%20s3%2C%20s4)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn main() {
    // Copy 类型：赋值后双方都有效
    let a = 42_i32;
    let b = a;
    println!("a={}, b={}", a, b);

    // 移动类型：赋值后原变量失效
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}", s2); // s1 已失效，只能用 s2

    // 显式克隆：保留原变量，堆数据被完整复制
    let s3 = String::from("world");
    let s4 = s3.clone();
    println!("s3={}, s4={}", s3, s4);
}</code></pre></div>
<h2 id="快速判断">快速判断</h2>
<p><strong>判断一个类型是 Move 还是 Copy 的快捷方法</strong>：</p>
<ul>
<li>如果它需要在堆上分配内存（<code>String</code>、<code>Vec</code>、<code>Box</code> 等），通常是 Move</li>
<li>如果它只存在栈上（整数、浮点、布尔、char、小元组），通常是 Copy</li>
</ul>
<blockquote>
<p>使用<code>=</code>通常都是 Move 或者 Cpoy，如果要使用 Clone，通常都是调用.clone()的形式</p>
</blockquote>
<h2 id="移动-vs-浅拷贝">移动 vs 浅拷贝</h2>
<p>在其他语言里，“浅拷贝”只复制指针和元数据，不复制堆数据。Rust 的”移动”在底层做了同样的事，但额外做了一步：<strong>让原变量无效</strong>。</p>
<p>为什么叫”移动”而不是”浅拷贝”？因为移动强调的是<strong>所有权的转移</strong>——数据从一个所有者”流动”到了另一个所有者，而浅拷贝只描述了物理上复制了什么。Rust 的移动语义保证了内存安全：永远不会出现两个有效变量同时指向同一块堆数据。</p>
<h1 id="练习题">练习题</h1>
<h2 id="移动与复制测验">移动与复制测验</h2>
<pre><code class="language-rust">fn main() {
    let x = 10;
    let y = x;
    println!("{}", x);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/01-memory-and-move#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E9%80%9A%E8%BF%87%E5%90%97%EF%BC%9F%E4%B8%BA%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E5%9B%A0%E4%B8%BA%20x%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%BB%8F%E7%A7%BB%E5%8A%A8%E7%BB%99%20y%EF%BC%8Cx%20%E6%97%A0%E6%95%88%E4%BA%86%22%2C%22%E8%83%BD%EF%BC%8C%E5%9B%A0%E4%B8%BA%20i32%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Copy%20%E7%89%B9%E5%BE%81%EF%BC%8C%E8%B5%8B%E5%80%BC%E6%97%B6%20x%20%E8%A2%AB%E5%A4%8D%E5%88%B6%E8%80%8C%E9%9D%9E%E7%A7%BB%E5%8A%A8%22%2C%22%E8%83%BD%EF%BC%8C%E4%BD%86%E8%BF%99%E6%98%AF%20bug%EF%BC%8Cx%20%E5%92%8C%20y%20%E5%85%B1%E4%BA%AB%E5%90%8C%E4%B8%80%E5%9D%97%E5%86%85%E5%AD%98%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E5%9B%A0%E4%B8%BA%E6%B2%A1%E6%9C%89%E4%BD%BF%E7%94%A8%20let%20mut%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22i32%20%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%AD%98%E5%9C%A8%E6%A0%88%E4%B8%8A%EF%BC%8C%E8%B5%8B%E5%80%BC%E6%97%B6%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%80%BC%E3%80%82%E5%8E%9F%E5%8F%98%E9%87%8F%20x%20%E4%BE%9D%E7%84%B6%E6%9C%89%E6%95%88%E3%80%82%E5%8F%AA%E6%9C%89%E5%A0%86%E5%88%86%E9%85%8D%E7%B1%BB%E5%9E%8B%EF%BC%88%E5%A6%82%20String%EF%BC%89%E6%89%8D%E4%BC%9A%E5%8F%91%E7%94%9F%E7%A7%BB%E5%8A%A8%EF%BC%8C%E5%AF%BC%E8%87%B4%E5%8E%9F%E5%8F%98%E9%87%8F%E5%A4%B1%E6%95%88%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}", s1);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/01-memory-and-move#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%BF%90%E8%A1%8C%E6%97%B6%20panic%EF%BC%9A%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F%E6%8C%87%E5%90%91%E5%90%8C%E4%B8%80%E5%86%85%E5%AD%98%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9A%E9%9C%80%E8%A6%81%E5%8A%A0%20let%20mut%20%E6%89%8D%E8%83%BD%E8%B5%8B%E5%80%BC%E7%BB%99%20s2%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9As1%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%A7%BB%E5%8A%A8%E7%BB%99%20s2%EF%BC%8Cs1%20%E4%B8%8D%E5%86%8D%E6%9C%89%E6%95%88%22%2C%22%E6%AD%A3%E5%B8%B8%E8%BF%90%E8%A1%8C%EF%BC%8C%E8%BE%93%E5%87%BA%20%5C%22hello%5C%22%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22String%20%E4%B8%8D%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%8Clet%20s2%20%3D%20s1%20%E5%8F%91%E7%94%9F%E7%A7%BB%E5%8A%A8%EF%BC%8Cs1%20%E5%A4%B1%E6%95%88%E3%80%82%E4%B9%8B%E5%90%8E%E8%AE%BF%E9%97%AE%20s1%20%E4%BC%9A%E4%BA%A7%E7%94%9F%20%5C%22use%20of%20moved%20value%5C%22%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E3%80%82Rust%20%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E5%B0%B1%E9%98%BB%E6%AD%A2%E4%BA%86%E8%BF%99%E7%B1%BB%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="copy-类型测验">Copy 类型测验</h2>
<div class="quiz-choice" data-block-id="03-ownership/01-memory-and-move#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E7%B1%BB%E5%9E%8B%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22bool%22%2C%22f64%22%2C%22Vec%3Ci32%3E%22%2C%22char%22%2C%22i32%22%2C%22String%22%5D%2C%22correct%22%3A%5B0%2C1%2C3%2C4%5D%2C%22explanation%22%3A%22%E5%AD%98%E5%82%A8%E5%9C%A8%E6%A0%88%E4%B8%8A%E3%80%81%E5%A4%A7%E5%B0%8F%E5%9B%BA%E5%AE%9A%E7%9A%84%E5%9F%BA%E7%A1%80%E7%B1%BB%E5%9E%8B%E9%83%BD%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%9A%E6%95%B4%E6%95%B0%EF%BC%88i32%E3%80%81u64%20%E7%AD%89%EF%BC%89%E3%80%81%E6%B5%AE%E7%82%B9%EF%BC%88f32%E3%80%81f64%EF%BC%89%E3%80%81%E5%B8%83%E5%B0%94%EF%BC%88bool%EF%BC%89%E3%80%81%E5%AD%97%E7%AC%A6%EF%BC%88char%EF%BC%89%E3%80%82String%20%E5%92%8C%20Vec%20%E9%9C%80%E8%A6%81%E5%9C%A8%E5%A0%86%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%EF%BC%8C%E6%98%AF%E7%A7%BB%E5%8A%A8%E8%AF%AD%E4%B9%89%E7%B1%BB%E5%9E%8B%EF%BC%8C%E4%B8%8D%E6%98%AF%20Copy%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
