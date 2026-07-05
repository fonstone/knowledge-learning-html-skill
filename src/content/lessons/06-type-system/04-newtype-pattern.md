---
chapterId: "06-type-system"
lessonId: "04-newtype-pattern"
title: "Newtype 模式"
level: "入门"
duration: "10 分钟"
tags: [newtype, 元组结构体, 类型安全, 类型包装]
number: "6.4"
chapterTitle: "类型系统"
chapterNumber: "06"
---
<div id="article-content"> <h1 id="newtype-模式">Newtype 模式</h1>
<h2 id="相同类型不同语义">相同类型，不同语义</h2>
<p>考虑一个简单场景：你的程序需要处理距离，有时是米，有时是厘米。两者的底层值都是 <code>f64</code>，但混用会出大问题：</p>
<div class="code-runner" data-full-code="fn%20add_lengths(a%3A%20f64%2C%20b%3A%20f64)%20-%3E%20f64%20%7B%0A%20%20%20%20a%20%2B%20b%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20distance_m%20%3D%201.5%3B%0A%20%20%20%20let%20distance_cm%20%3D%20150.0%3B%0A%0A%20%20%20%20%2F%2F%20%E8%83%BD%E7%BC%96%E8%AF%91%EF%BC%8C%E4%BD%86%E8%AF%AD%E4%B9%89%E6%98%AF%E9%94%99%E7%9A%84%EF%BC%9A1.5%20%E7%B1%B3%20%2B%20150%20%E5%8E%98%E7%B1%B3%20%E2%89%A0%20151.5%20%E7%B1%B3%0A%20%20%20%20let%20total%20%3D%20add_lengths(distance_m%2C%20distance_cm)%3B%0A%20%20%20%20println!(%22total%20%3D%20%7B%7D%22%2C%20total)%3B%20%2F%2F%20151.5%EF%BC%8C%E5%AE%8C%E5%85%A8%E9%94%99%E8%AF%AF%0A%7D" data-mode="run"><pre><code class="language-rust">fn add_lengths(a: f64, b: f64) -&gt; f64 {
    a + b
}

fn main() {
    let distance_m = 1.5;
    let distance_cm = 150.0;

    // 能编译，但语义是错的：1.5 米 + 150 厘米 ≠ 151.5 米
    let total = add_lengths(distance_m, distance_cm);
    println!("total = {}", total); // 151.5，完全错误
}</code></pre></div>
<p>编译器毫无怨言地接受了这个错误——因为它们都是 <code>f64</code>，无法区分。</p>
<p><strong>Newtype 模式</strong>的核心思路：把底层类型包裹在一个<strong>单字段元组结构体</strong>里，让它成为一个新类型：</p>
<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%0Astruct%20Centimeters(f64)%3B%0A%0Afn%20add_meters(a%3A%20Meters%2C%20b%3A%20Meters)%20-%3E%20Meters%20%7B%0A%20%20%20%20Meters(a.0%20%2B%20b.0)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20distance_m%20%3D%20Meters(1.5)%3B%0A%20%20%20%20let%20distance_cm%20%3D%20Centimeters(150.0)%3B%0A%0A%20%20%20%20add_meters(distance_m%2C%20distance_cm)%3B%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%81%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%8C%B9%E9%85%8D%0A%7D" data-mode="expect-error"><pre><code class="language-rust">struct Meters(f64);
struct Centimeters(f64);

fn add_meters(a: Meters, b: Meters) -&gt; Meters {
    Meters(a.0 + b.0)
}

fn main() {
    let distance_m = Meters(1.5);
    let distance_cm = Centimeters(150.0);

    add_meters(distance_m, distance_cm); // 编译错误！类型不匹配
}</code></pre></div>
<blockquote>
<p>错误被提前到了编译期，代码运行之前就被阻止了。</p>
</blockquote>
<h2 id="定义和访问内部值">定义和访问内部值</h2>
<p>Newtype 就是一个<strong>元组结构体</strong>，语法极简：</p>
<div class="code-runner" data-full-code="struct%20Meters(f64)%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20m%20%3D%20Meters(42.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%20.0%20%E8%AE%BF%E9%97%AE%E5%86%85%E9%83%A8%E5%80%BC%EF%BC%88%E5%85%83%E7%BB%84%E7%BB%93%E6%9E%84%E4%BD%93%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%AD%97%E6%AE%B5%EF%BC%89%0A%20%20%20%20println!(%22%E8%B7%9D%E7%A6%BB%EF%BC%9A%7B%7D%20%E7%B1%B3%22%2C%20m.0)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B9%9F%E5%8F%AF%E4%BB%A5%E8%A7%A3%E6%9E%84%0A%20%20%20%20let%20Meters(value)%20%3D%20m%3B%0A%20%20%20%20println!(%22%E5%80%BC%EF%BC%9A%7B%7D%22%2C%20value)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">struct Meters(f64);

fn main() {
    let m = Meters(42.0);

    // 用 .0 访问内部值（元组结构体第一个字段）
    println!("距离：{} 米", m.0);

    // 也可以解构
    let Meters(value) = m;
    println!("值：{}", value);
}</code></pre></div>
<h2 id="为-newtype-实现方法">为 newtype 实现方法</h2>
<p>Newtype 是完整的类型，可以为它实现任何方法：</p>
<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20Meters(f64)%3B%0Astruct%20Centimeters(f64)%3B%0A%0Aimpl%20Meters%20%7B%0A%20%20%20%20fn%20to_centimeters(%26self)%20-%3E%20Centimeters%20%7B%0A%20%20%20%20%20%20%20%20Centimeters(self.0%20*%20100.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20Centimeters%20%7B%0A%20%20%20%20fn%20to_meters(%26self)%20-%3E%20Meters%20%7B%0A%20%20%20%20%20%20%20%20Meters(self.0%20%2F%20100.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Meters%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%7D%20m%22%2C%20self.0)%0A%20%20%20%20%7D%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Centimeters%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%7D%20cm%22%2C%20self.0)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20d%20%3D%20Meters(1.5)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%201.5%20m%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d.to_centimeters())%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20150%20cm%0A%20%20%20%20println!(%22%7B%7D%22%2C%20d.to_centimeters().to_meters())%3B%20%2F%2F%201.5%20m%0A%7D" data-mode="run"><pre><code class="language-rust">use std::fmt;

struct Meters(f64);
struct Centimeters(f64);

impl Meters {
    fn to_centimeters(&amp;self) -&gt; Centimeters {
        Centimeters(self.0 * 100.0)
    }
}

impl Centimeters {
    fn to_meters(&amp;self) -&gt; Meters {
        Meters(self.0 / 100.0)
    }
}

impl fmt::Display for Meters {
    fn fmt(&amp;self, f: &amp;mut fmt::Formatter) -&gt; fmt::Result {
        write!(f, "{} m", self.0)
    }
}

impl fmt::Display for Centimeters {
    fn fmt(&amp;self, f: &amp;mut fmt::Formatter) -&gt; fmt::Result {
        write!(f, "{} cm", self.0)
    }
}

fn main() {
    let d = Meters(1.5);
    println!("{}", d);                              // 1.5 m
    println!("{}", d.to_centimeters());             // 150 cm
    println!("{}", d.to_centimeters().to_meters()); // 1.5 m
}</code></pre></div>
<h2 id="零开销保证">零开销保证</h2>
<p>Newtype 包装在运行时<strong>完全没有开销</strong>。</p>
<p><code>struct Meters(f64)</code> 在内存中和裸 <code>f64</code> 布局完全相同，没有额外字段或指针。这个”包装”只存在于编译期的类型检查阶段，机器码层面编译器直接操作内部的 <code>f64</code>。</p>
<h1 id="练习题">练习题</h1>
<h2 id="newtype-测验">Newtype 测验</h2>
<div class="quiz-choice" data-block-id="06-type-system/04-newtype-pattern#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22Newtype%20%E6%A8%A1%E5%BC%8F%E7%9A%84%E4%B8%BB%E8%A6%81%E7%9B%AE%E7%9A%84%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%85%81%E8%AE%B8%E9%80%92%E5%BD%92%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89%22%2C%22%E8%AE%A9%E7%BC%96%E8%AF%91%E5%99%A8%E5%9C%A8%E7%B1%BB%E5%9E%8B%E5%B1%82%E9%9D%A2%E5%8C%BA%E5%88%86%E8%AF%AD%E4%B9%89%E4%B8%8D%E5%90%8C%E4%BD%86%E5%BA%95%E5%B1%82%E7%B1%BB%E5%9E%8B%E7%9B%B8%E5%90%8C%E7%9A%84%E5%80%BC%22%2C%22%E6%8F%90%E5%8D%87%E8%BF%90%E8%A1%8C%E6%97%B6%E6%80%A7%E8%83%BD%22%2C%22%E5%87%8F%E5%B0%91%E5%86%85%E5%AD%98%E5%8D%A0%E7%94%A8%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Newtype%20%E4%B8%8D%E6%94%B9%E5%8F%98%E8%BF%90%E8%A1%8C%E6%97%B6%E8%A1%8C%E4%B8%BA%EF%BC%8C%E4%B9%9F%E6%B2%A1%E6%9C%89%E6%80%A7%E8%83%BD%E5%BC%80%E9%94%80%E3%80%82%E5%AE%83%E7%9A%84%E4%BB%B7%E5%80%BC%E5%9C%A8%E4%BA%8E%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8%EF%BC%9A%E6%8A%8A%E4%B8%A4%E4%B8%AA%E9%83%BD%E6%98%AF%20i32%20%E7%9A%84%5C%22%E5%B9%B4%E9%BE%84%5C%22%E5%92%8C%5C%22ID%5C%22%E5%8C%85%E6%88%90%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E5%B0%B1%E8%83%BD%E9%98%BB%E6%AD%A2%E4%BD%A0%E6%8A%8A%E5%B9%B4%E9%BE%84%E4%BC%A0%E7%BB%99%E9%9C%80%E8%A6%81%20ID%20%E7%9A%84%E5%87%BD%E6%95%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">struct UserId(u64);
struct PostId(u64);

fn get_user(id: UserId) -&gt; String {
    format!("用户 #{}", id.0)
}</code></pre>
<div class="quiz-choice" data-block-id="06-type-system/04-newtype-pattern#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%B8%AA%E8%B0%83%E7%94%A8%E8%83%BD%E9%80%9A%E8%BF%87%E7%BC%96%E8%AF%91%EF%BC%9F%22%2C%22options%22%3A%5B%22get_user(PostId(42))%22%2C%22get_user(UserId(42))%22%2C%22get_user(42_u64)%22%2C%22get_user(42)%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22get_user%20%E6%8E%A5%E5%8F%97%20UserId%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%8F%AA%E6%9C%89%20UserId(42)%20%E6%BB%A1%E8%B6%B3%E3%80%82PostId(42)%20%E8%99%BD%E7%84%B6%E5%86%85%E9%83%A8%E4%B9%9F%E6%98%AF%20u64%EF%BC%8C%E4%BD%86%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%90%8C%EF%BC%9B%E8%A3%B8%E7%9A%84%2042%20%E6%88%96%2042_u64%20%E6%9B%B4%E4%B8%8D%E6%98%AF%20UserId%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="06-type-system/04-newtype-pattern#1:2" data-kind="single" data-payload="%7B%22question%22%3A%22Newtype%20%E6%A8%A1%E5%BC%8F%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BC%9A%E5%B8%A6%E6%9D%A5%E6%80%A7%E8%83%BD%E5%BC%80%E9%94%80%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BC%9A%EF%BC%8Cnewtype%20%E6%9C%89%E9%A2%9D%E5%A4%96%E7%9A%84%E5%86%85%E5%AD%98%E5%AF%B9%E9%BD%90%E5%BC%80%E9%94%80%22%2C%22%E5%8F%96%E5%86%B3%E4%BA%8E%E5%86%85%E9%83%A8%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%A4%A7%E5%B0%8F%22%2C%22%E4%B8%8D%E4%BC%9A%EF%BC%8Cnewtype%20%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E4%B8%8E%E5%86%85%E9%83%A8%E7%B1%BB%E5%9E%8B%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80%E7%9B%B8%E5%90%8C%22%2C%22%E4%BC%9A%EF%BC%8C%E6%AF%8F%E6%AC%A1%E8%AE%BF%E9%97%AE%E9%83%BD%E9%9C%80%E8%A6%81%E8%A7%A3%E5%8C%85%E8%A3%85%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Newtype%20%E6%98%AF%E9%9B%B6%E6%88%90%E6%9C%AC%E6%8A%BD%E8%B1%A1%E3%80%82struct%20Meters(f64)%20%E5%9C%A8%E5%86%85%E5%AD%98%E4%B8%AD%E5%92%8C%20f64%20%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%EF%BC%8C%5C%22%E5%8C%85%E8%A3%85%5C%22%E5%8F%AA%E5%AD%98%E5%9C%A8%E4%BA%8E%E7%BC%96%E8%AF%91%E6%9C%9F%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E9%98%B6%E6%AE%B5%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="编程练习">编程练习</h2>
<p>下面的代码用裸 <code>u64</code> 表示两种 ID，导致 <code>validate_user(session_id)</code> 能通过编译。请用 newtype 模式定义 <code>UserId</code> 和 <code>SessionId</code>，让最后一行产生编译错误。</p>
<div class="code-editor" data-block-id="06-type-system/04-newtype-pattern#1:3" data-expect-mode="literal" data-expect-pattern="%E7%94%A8%E6%88%B7%E6%9C%89%E6%95%88%3A%20true%0A%E4%BC%9A%E8%AF%9D%E6%9C%89%E6%95%88%3A%20true" data-starter-code="%2F%2F%20TODO%3A%20%E6%8A%8A%E4%B8%8B%E9%9D%A2%E4%B8%A4%E8%A1%8C%E6%94%B9%E6%88%90%20newtype%20%E5%AE%9A%E4%B9%89%0Atype%20UserId%20%3D%20u64%3B%0Atype%20SessionId%20%3D%20u64%3B%0A%0Afn%20validate_user(id%3A%20UserId)%20-%3E%20bool%20%7B%0A%20%20%20%20id%20%3E%200%0A%7D%0A%0Afn%20validate_session(id%3A%20SessionId)%20-%3E%20bool%20%7B%0A%20%20%20%20id%20%3E%201000%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20uid%20%3D%20UserId(42)%3B%20%20%20%20%20%20%20%2F%2F%20%E6%94%B9%E5%AE%8C%E5%90%8E%E8%BF%99%E9%87%8C%E8%83%BD%E7%94%A8%0A%20%20%20%20let%20sid%20%3D%20SessionId(9001)%3B%0A%0A%20%20%20%20println!(%22%E7%94%A8%E6%88%B7%E6%9C%89%E6%95%88%3A%20%7B%7D%22%2C%20validate_user(uid))%3B%0A%20%20%20%20println!(%22%E4%BC%9A%E8%AF%9D%E6%9C%89%E6%95%88%3A%20%7B%7D%22%2C%20validate_session(sid))%3B%0A%0A%20%20%20%20%2F%2F%20%E6%94%B9%E5%AE%8C%E5%90%8E%E5%8F%96%E6%B6%88%E6%B3%A8%E9%87%8A%EF%BC%8C%E5%BA%94%E8%AF%A5%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%EF%BC%9A%0A%20%20%20%20%2F%2F%20validate_user(sid)%3B%0A%7D"><pre><code class="language-rust">// TODO: 把下面两行改成 newtype 定义
type UserId = u64;
type SessionId = u64;

fn validate_user(id: UserId) -&gt; bool {
    id &gt; 0
}

fn validate_session(id: SessionId) -&gt; bool {
    id &gt; 1000
}

fn main() {
    let uid = UserId(42);       // 改完后这里能用
    let sid = SessionId(9001);

    println!("用户有效: {}", validate_user(uid));
    println!("会话有效: {}", validate_session(sid));

    // 改完后取消注释，应该编译失败：
    // validate_user(sid);
}</code></pre></div> </div>
