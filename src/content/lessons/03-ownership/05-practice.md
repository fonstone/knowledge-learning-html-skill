---
chapterId: "03-ownership"
lessonId: "05-practice"
title: "综合练习"
level: "进阶"
duration: "30 分钟"
tags: [所有权, 移动, 借用, 引用, 切片, Copy, Clone]
number: "3.5"
chapterTitle: "所有权系统"
chapterNumber: "03"
---
<div id="article-content"> <h1 id="所有权与移动">所有权与移动</h1>
<h2 id="赋值后的-string">赋值后的 String</h2>
<pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}", s1);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#0:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E9%80%9A%E8%BF%87%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%EF%BC%8Cs2%20%E5%8F%AA%E6%98%AF%20s1%20%E7%9A%84%E5%88%AB%E5%90%8D%EF%BC%8Cs1%20%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8Cs1%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%B7%B2%E7%A7%BB%E5%8A%A8%E7%BB%99%20s2%EF%BC%8Cs1%20%E4%B8%8D%E5%86%8D%E6%9C%89%E6%95%88%22%2C%22%E8%83%BD%EF%BC%8Cs1%20%E5%92%8C%20s2%20%E7%8E%B0%E5%9C%A8%E5%90%84%E6%9C%89%E4%B8%80%E4%BB%BD%20%5C%22hello%5C%22%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E9%9C%80%E8%A6%81%E5%85%88%E5%A3%B0%E6%98%8E%20let%20mut%20s1%20%E6%89%8D%E8%83%BD%E8%B5%8B%E5%80%BC%E7%BB%99%20s2%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22String%20%E4%B8%8D%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%8Clet%20s2%20%3D%20s1%20%E5%8F%91%E7%94%9F%E7%A7%BB%E5%8A%A8%EF%BC%88move%EF%BC%89%EF%BC%8Cs1%20%E5%A4%B1%E6%95%88%E3%80%82%E4%B9%8B%E5%90%8E%E8%AE%BF%E9%97%AE%20s1%20%E4%BC%9A%E4%BA%A7%E7%94%9F%20%5C%22use%20of%20moved%20value%5C%22%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E3%80%82%E5%A6%82%E6%9E%9C%E9%9C%80%E8%A6%81%E4%B8%A4%E4%BB%BD%E7%8B%AC%E7%AB%8B%E7%9A%84%E6%95%B0%E6%8D%AE%EF%BC%8C%E5%BA%94%E4%BD%BF%E7%94%A8%20s1.clone()%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="哪些类型是-copy">哪些类型是 Copy</h2>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#0:1" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E7%B1%BB%E5%9E%8B%E6%98%AF%20Copy%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E8%B5%8B%E5%80%BC%E5%90%8E%E5%8E%9F%E5%8F%98%E9%87%8F%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22f64%22%2C%22Vec%3Ci32%3E%22%2C%22i32%22%2C%22(i32%2C%20bool)%22%2C%22char%22%2C%22String%22%2C%22bool%22%5D%2C%22correct%22%3A%5B0%2C2%2C3%2C4%2C6%5D%2C%22explanation%22%3A%22%E5%AD%98%E5%82%A8%E5%9C%A8%E6%A0%88%E4%B8%8A%E3%80%81%E5%A4%A7%E5%B0%8F%E7%BC%96%E8%AF%91%E6%9C%9F%E5%B7%B2%E7%9F%A5%E7%9A%84%E5%9F%BA%E7%A1%80%E7%B1%BB%E5%9E%8B%E9%83%BD%E5%AE%9E%E7%8E%B0%E4%BA%86%20Copy%EF%BC%9A%E6%95%B4%E6%95%B0%E3%80%81%E6%B5%AE%E7%82%B9%E3%80%81%E5%B8%83%E5%B0%94%E3%80%81%E5%AD%97%E7%AC%A6%EF%BC%8C%E4%BB%A5%E5%8F%8A%E6%89%80%E6%9C%89%E5%AD%97%E6%AE%B5%E5%9D%87%E4%B8%BA%20Copy%20%E7%9A%84%E5%85%83%E7%BB%84%E3%80%82String%20%E5%92%8C%20Vec%3Ci32%3E%20%E9%9C%80%E8%A6%81%E5%9C%A8%E5%A0%86%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%EF%BC%8C%E6%98%AF%E7%A7%BB%E5%8A%A8%E8%AF%AD%E4%B9%89%E7%B1%BB%E5%9E%8B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="clone-做了什么">clone() 做了什么</h2>
<pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1={}, s2={}", s1, s2);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#0:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%B0%83%E7%94%A8%20.clone()%20%E4%B9%8B%E5%90%8E%EF%BC%8C%E4%B8%8B%E5%88%97%E8%AF%B4%E6%B3%95%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22s1%20%E5%92%8C%20s2%20%E6%8C%87%E5%90%91%E5%A0%86%E4%B8%8A%E5%90%8C%E4%B8%80%E5%9D%97%E5%86%85%E5%AD%98%22%2C%22s1%20%E5%92%8C%20s2%20%E5%90%84%E8%87%AA%E6%8B%A5%E6%9C%89%E7%8B%AC%E7%AB%8B%E7%9A%84%E5%A0%86%E5%86%85%E5%AD%98%EF%BC%8C%E4%BA%92%E4%B8%8D%E5%BD%B1%E5%93%8D%22%2C%22clone()%20%E5%AF%B9%20String%20%E6%9D%A5%E8%AF%B4%E7%AD%89%E5%90%8C%E4%BA%8E%E6%99%AE%E9%80%9A%E8%B5%8B%E5%80%BC%EF%BC%88%E7%A7%BB%E5%8A%A8%EF%BC%89%22%2C%22s1%20%E5%A4%B1%E6%95%88%EF%BC%8C%E5%8F%AA%E6%9C%89%20s2%20%E6%9C%89%E6%95%88%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22.clone()%20%E6%89%A7%E8%A1%8C%E6%B7%B1%E6%8B%B7%E8%B4%9D%EF%BC%9A%E5%9C%A8%E5%A0%86%E4%B8%8A%E5%88%9B%E5%BB%BA%E4%B8%80%E4%BB%BD%E6%96%B0%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%95%B0%E6%8D%AE%EF%BC%8Cs2%20%E6%8B%A5%E6%9C%89%E8%BF%99%E4%BB%BD%E6%96%B0%E6%95%B0%E6%8D%AE%EF%BC%8Cs1%20%E4%BB%8D%E7%84%B6%E6%8B%A5%E6%9C%89%E5%8E%9F%E6%9D%A5%E7%9A%84%E6%95%B0%E6%8D%AE%E3%80%82%E4%B8%A4%E8%80%85%E7%8B%AC%E7%AB%8B%EF%BC%8C%E4%BF%AE%E6%94%B9%E5%85%B6%E4%B8%AD%E4%B8%80%E4%B8%AA%E4%B8%8D%E5%BD%B1%E5%93%8D%E5%8F%A6%E4%B8%80%E4%B8%AA%E3%80%82clone()%20%E6%98%AF%E6%98%BE%E5%BC%8F%E6%93%8D%E4%BD%9C%EF%BC%8C%E6%8F%90%E9%86%92%E4%BD%A0%5C%22%E8%BF%99%E9%87%8C%E6%9C%89%E5%A0%86%E5%86%85%E5%AD%98%E5%A4%8D%E5%88%B6%E7%9A%84%E6%88%90%E6%9C%AC%5C%22%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="函数消耗所有权">函数消耗所有权</h2>
<pre><code class="language-rust">fn consume(s: String) -&gt; usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let n = consume(s);
    println!("{} {}", n, s);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#0:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E9%80%9A%E8%BF%87%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%EF%BC%8C%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E4%B8%8D%E5%BD%B1%E5%93%8D%E5%8E%9F%E5%8F%98%E9%87%8F%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E5%87%BD%E6%95%B0%E7%9A%84%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E5%BF%85%E9%A1%BB%E5%92%8C%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E4%B8%80%E8%87%B4%22%2C%22%E8%83%BD%EF%BC%8Cconsume%20%E8%BF%94%E5%9B%9E%E4%BA%86%20usize%EF%BC%8C%E6%89%80%E4%BB%A5%20s%20%E8%BF%98%E5%9C%A8%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8Cs%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E5%9C%A8%E8%B0%83%E7%94%A8%20consume(s)%20%E6%97%B6%E8%A2%AB%E7%A7%BB%E5%85%A5%E5%87%BD%E6%95%B0%EF%BC%8C%E4%B9%8B%E5%90%8E%20s%20%E6%97%A0%E6%95%88%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E5%90%91%E5%87%BD%E6%95%B0%E4%BC%A0%E5%8F%82%E7%AD%89%E5%90%8C%E4%BA%8E%E8%B5%8B%E5%80%BC%E2%80%94%E2%80%94String%20%E7%B1%BB%E5%9E%8B%E4%BC%9A%E5%8F%91%E7%94%9F%E7%A7%BB%E5%8A%A8%E3%80%82s%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%E4%BA%86%20consume%20%E7%9A%84%E5%8F%82%E6%95%B0%EF%BC%8C%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%20s%20%E5%9C%A8%E5%87%BD%E6%95%B0%E5%86%85%E8%A2%AB%20drop%E3%80%82%E4%B9%8B%E5%90%8E%E5%9C%A8%20println!%20%E4%B8%AD%E5%86%8D%E6%AC%A1%E4%BD%BF%E7%94%A8%20s%20%E4%BC%9A%E6%8A%A5%E9%94%99%E3%80%82%E5%A6%82%E6%9E%9C%E4%B8%8D%E6%83%B3%E5%A4%B1%E5%8E%BB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E5%BA%94%E8%AF%A5%E4%BC%A0%20%26s%EF%BC%88%E5%BC%95%E7%94%A8%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="变量何时被释放">变量何时被释放</h2>
<pre><code class="language-rust">fn main() {
    let x = 5;
    {
        let y = String::from("hello");
        println!("{} {}", x, y);
    }
    println!("{}", x);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#0:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%8F%98%E9%87%8F%20y%20%E5%9C%A8%E4%BD%95%E6%97%B6%E8%A2%AB%20drop%EF%BC%88%E9%87%8A%E6%94%BE%E5%86%85%E5%AD%98%EF%BC%89%EF%BC%9F%22%2C%22options%22%3A%5B%22y%20%E6%89%80%E5%9C%A8%E7%9A%84%E5%86%85%E5%B1%82%E8%8A%B1%E6%8B%AC%E5%8F%B7%E7%BB%93%E6%9D%9F%E6%97%B6%EF%BC%88%E7%AC%AC%206%20%E8%A1%8C%E7%9A%84%20%7D%EF%BC%89%22%2C%22%E5%8F%98%E9%87%8F%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%97%B6%EF%BC%8C%E4%BD%86%20x%20%E7%9A%84%E9%87%8A%E6%94%BE%E9%A1%BA%E5%BA%8F%E5%9C%A8%20y%20%E4%B9%8B%E5%89%8D%22%2C%22println!%20%E4%BD%BF%E7%94%A8%E5%AE%8C%20y%20%E4%B9%8B%E5%90%8E%E7%AB%8B%E5%88%BB%E9%87%8A%E6%94%BE%22%2C%22%E6%95%B4%E4%B8%AA%20main%20%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Rust%20%E5%9C%A8%E5%8F%98%E9%87%8F%E7%A6%BB%E5%BC%80%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%88%E6%9C%80%E8%BF%91%E7%9A%84%E9%82%A3%E5%B1%82%E8%8A%B1%E6%8B%AC%E5%8F%B7%E7%BB%93%E6%9D%9F%EF%BC%89%E6%97%B6%E8%87%AA%E5%8A%A8%E8%B0%83%E7%94%A8%20drop%20%E9%87%8A%E6%94%BE%E5%86%85%E5%AD%98%E3%80%82y%20%E5%9C%A8%E5%86%85%E5%B1%82%E5%9D%97%E7%9A%84%20%7D%20%E5%A4%84%E8%A2%AB%E9%87%8A%E6%94%BE%EF%BC%8C%E8%80%8C%20x%20%E5%9C%A8%20main%20%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%E9%87%8A%E6%94%BE%E3%80%82%E8%BF%99%E6%98%AF%E6%89%80%E6%9C%89%E6%9D%83%E8%A7%84%E5%88%99%E7%AC%AC%E4%B8%89%E6%9D%A1%E7%9A%84%E7%9B%B4%E6%8E%A5%E4%BD%93%E7%8E%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h1 id="借用与切片">借用与切片</h1>
<h2 id="nll-与借用范围">NLL 与借用范围</h2>
<pre><code class="language-rust">fn main() {
    let mut s = String::from("hello");

    let r1 = &amp;s;
    let r2 = &amp;s;
    println!("{} {}", r1, r2); // r1、r2 最后一次使用在这里

    let r3 = &amp;mut s;
    r3.push_str(" world");
    println!("{}", r3);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#1:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E9%80%9A%E8%BF%87%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E5%90%8C%E4%B8%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%86%85%E4%B8%8D%E8%83%BD%E5%90%8C%E6%97%B6%E5%87%BA%E7%8E%B0%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E5%92%8C%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%22%2C%22%E8%83%BD%EF%BC%8Cr1%20%E5%92%8C%20r2%20%E5%9C%A8%20println!%20%E4%B9%8B%E5%90%8E%E5%B0%B1%E4%B8%8D%E5%86%8D%E4%BD%BF%E7%94%A8%EF%BC%8CNLL%20%E5%88%A4%E6%96%AD%E5%80%9F%E7%94%A8%E5%B7%B2%E7%BB%93%E6%9D%9F%EF%BC%8Cr3%20%E5%8F%AF%E4%BB%A5%E5%88%9B%E5%BB%BA%22%2C%22%E8%83%BD%EF%BC%8C%E4%BD%86%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BC%9A%20panic%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8Cr1%20%E5%92%8C%20r2%20%E8%A6%81%E5%88%B0%E5%9D%97%E7%BB%93%E6%9D%9F%E6%89%8D%E5%A4%B1%E6%95%88%EF%BC%8Cr3%20%E4%B8%8D%E8%83%BD%E5%88%9B%E5%BB%BA%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E9%9D%9E%E8%AF%8D%E6%B3%95%E4%BD%9C%E7%94%A8%E5%9F%9F%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%88NLL%EF%BC%89%E8%AE%A9%E5%BC%95%E7%94%A8%E7%9A%84%E6%9C%89%E6%95%88%E8%8C%83%E5%9B%B4%E5%88%B0%E6%9C%80%E5%90%8E%E4%B8%80%E6%AC%A1%E4%BD%BF%E7%94%A8%E5%A4%84%E4%B8%BA%E6%AD%A2%EF%BC%8C%E8%80%8C%E4%B8%8D%E6%98%AF%E5%88%B0%E5%9D%97%E7%9A%84%E7%BB%93%E5%B0%BE%E3%80%82r1%20%E5%92%8C%20r2%20%E5%9C%A8%E7%AC%AC%E4%B8%80%E4%B8%AA%20println!%20%E5%90%8E%E4%B8%8D%E5%86%8D%E8%A2%AB%E4%BD%BF%E7%94%A8%EF%BC%8C%E5%AE%83%E4%BB%AC%E7%9A%84%E5%80%9F%E7%94%A8%E5%9C%A8%E9%82%A3%E9%87%8C%E7%BB%93%E6%9D%9F%E3%80%82%E5%9B%A0%E6%AD%A4%E5%88%9B%E5%BB%BA%20r3%20%E6%97%B6%E4%B8%8D%E5%AD%98%E5%9C%A8%E5%86%B2%E7%AA%81%EF%BC%8C%E4%BB%A3%E7%A0%81%E5%8F%AF%E4%BB%A5%E7%BC%96%E8%AF%91%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="不可变与可变引用共存">不可变与可变引用共存</h2>
<pre><code class="language-rust">fn main() {
    let mut s = String::from("hello");
    let r1 = &amp;s;
    let r2 = &amp;mut s;
    println!("{} {}", r1, r2);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#1:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E9%80%9A%E8%BF%87%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%8D%E8%83%BD%EF%BC%8Cr1%20%E7%9A%84%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E4%BB%8D%E7%84%B6%E6%B4%BB%E8%B7%83%E6%97%B6%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%88%9B%E5%BB%BA%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%20r2%22%2C%22%E8%83%BD%EF%BC%8C%E4%BD%86%E5%8F%AA%E6%9C%89%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%BA%BF%E7%A8%8B%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%89%8D%E4%BC%9A%E6%9C%89%E9%97%AE%E9%A2%98%22%2C%22%E8%83%BD%EF%BC%8Cr1%20%E6%98%AF%E4%B8%8D%E5%8F%AF%E5%8F%98%E7%9A%84%EF%BC%8Cr2%20%E6%98%AF%E5%8F%AF%E5%8F%98%E7%9A%84%EF%BC%8C%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%90%8C%E6%89%80%E4%BB%A5%E6%B2%A1%E5%86%B2%E7%AA%81%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E4%BD%86%E5%8F%AA%E8%A6%81%E6%8A%8A%20r1%20%E6%94%B9%E6%88%90%20let%20mut%20r1%20%E5%B0%B1%E5%8F%AF%E4%BB%A5%E4%BA%86%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E5%80%9F%E7%94%A8%E8%A7%84%E5%88%99%EF%BC%9A%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E5%92%8C%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E4%B8%8D%E8%83%BD%E5%90%8C%E6%97%B6%E6%B4%BB%E8%B7%83%E3%80%82r1%20%E5%9C%A8%20println!%20%E4%B8%AD%E8%BF%98%E8%A2%AB%E7%94%A8%E5%88%B0%EF%BC%8C%E6%89%80%E4%BB%A5%E5%AE%83%E7%9A%84%E5%80%9F%E7%94%A8%E5%9C%A8%20r2%20%E5%88%9B%E5%BB%BA%E6%97%B6%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%E3%80%82%E8%A6%81%E4%BF%AE%E5%A4%8D%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%8A%8A%20println!(%5C%22%7B%7D%5C%22%2C%20r1)%20%E7%A7%BB%E5%88%B0%20let%20r2%20%E4%B9%8B%E5%89%8D%EF%BC%8C%E8%AE%A9%20r1%20%E5%85%88%E7%94%A8%E5%AE%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="返回局部变量的引用">返回局部变量的引用</h2>
<pre><code class="language-rust">fn make_greeting() -&gt; &amp;String {
    let s = String::from("hello");
    &amp;s
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#1:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E5%87%BD%E6%95%B0%E6%9C%89%E4%BB%80%E4%B9%88%E9%97%AE%E9%A2%98%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E9%9C%80%E8%A6%81%E5%8A%A0%20mut%20%E5%B0%B1%E8%83%BD%E4%BF%AE%E5%A4%8D%22%2C%22%E6%B2%A1%E6%9C%89%E9%97%AE%E9%A2%98%EF%BC%8C%E8%BF%94%E5%9B%9E%E5%BC%95%E7%94%A8%E6%98%AF%E5%90%88%E6%B3%95%E6%93%8D%E4%BD%9C%22%2C%22s%20%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%E8%A2%AB%E9%87%8A%E6%94%BE%EF%BC%8C%E8%BF%94%E5%9B%9E%20%26s%20%E4%BC%9A%E4%BA%A7%E7%94%9F%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%EF%BC%88%E6%8C%87%E5%90%91%E5%B7%B2%E9%87%8A%E6%94%BE%E7%9A%84%E5%86%85%E5%AD%98%EF%BC%89%22%2C%22%E9%9C%80%E8%A6%81%E5%B0%86%20%26String%20%E6%94%B9%E6%88%90%20%26str%20%E5%B0%B1%E5%8F%AF%E4%BB%A5%E4%BA%86%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22s%20%E6%98%AF%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%EF%BC%8C%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%20s%20%E8%A2%AB%20drop%EF%BC%8C%E5%85%B6%E5%8D%A0%E7%94%A8%E7%9A%84%E5%A0%86%E5%86%85%E5%AD%98%E8%A2%AB%E9%87%8A%E6%94%BE%E3%80%82%E8%BF%94%E5%9B%9E%20%26s%20%E6%84%8F%E5%91%B3%E7%9D%80%E8%B0%83%E7%94%A8%E8%80%85%E6%8B%BF%E5%88%B0%E7%9A%84%E5%BC%95%E7%94%A8%E6%8C%87%E5%90%91%E4%B8%8D%E5%86%8D%E6%9C%89%E6%95%88%E7%9A%84%E5%86%85%E5%AD%98%E2%80%94%E2%80%94%E8%BF%99%E5%B0%B1%E6%98%AF%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E3%80%82Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E5%B0%B1%E9%98%BB%E6%AD%A2%E8%BF%99%E7%A7%8D%E6%83%85%E5%86%B5%E3%80%82%E6%AD%A3%E7%A1%AE%E5%81%9A%E6%B3%95%E6%98%AF%E7%9B%B4%E6%8E%A5%E8%BF%94%E5%9B%9E%20String%EF%BC%88%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%89%EF%BC%8C%E8%80%8C%E4%B8%8D%E6%98%AF%E8%BF%94%E5%9B%9E%E5%BC%95%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="切片的类型">切片的类型</h2>
<pre><code class="language-rust">fn main() {
    let s = String::from("hello world");
    let word = &amp;s[6..11];
    println!("{}", word);
}</code></pre>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#1:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%8F%98%E9%87%8F%20word%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22str%22%2C%22%26str%22%2C%22%26String%22%2C%22String%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E5%AF%B9%20String%20%E5%8F%96%E5%88%87%E7%89%87%EF%BC%88%26s%5B6..11%5D%EF%BC%89%E5%BE%97%E5%88%B0%E7%9A%84%E6%98%AF%20%26str%20%E7%B1%BB%E5%9E%8B%E2%80%94%E2%80%94%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%88%87%E7%89%87%E3%80%82%26str%20%E5%AD%98%E5%82%A8%E4%B8%80%E4%B8%AA%E6%8C%87%E5%90%91%E6%95%B0%E6%8D%AE%E8%B5%B7%E5%A7%8B%E4%BD%8D%E7%BD%AE%E7%9A%84%E6%8C%87%E9%92%88%E5%92%8C%E5%88%87%E7%89%87%E7%9A%84%E9%95%BF%E5%BA%A6%EF%BC%8C%E4%B8%8D%E6%8B%A5%E6%9C%89%E6%95%B0%E6%8D%AE%E3%80%82%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%88%E5%A6%82%20%5C%22hello%5C%22%EF%BC%89%E7%9A%84%E7%B1%BB%E5%9E%8B%E4%B9%9F%E6%98%AF%20%26str%EF%BC%8C%E5%AE%83%E4%BB%AC%E6%98%AF%E5%90%8C%E4%B8%80%E7%A7%8D%E7%B1%BB%E5%9E%8B%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="str-还是-string">&amp;str 还是 &amp;String</h2>
<div class="quiz-choice" data-block-id="03-ownership/05-practice#1:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%85%B3%E4%BA%8E%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%82%E6%95%B0%E7%94%A8%20%26String%20%E6%9B%B4%E5%A5%BD%EF%BC%8C%E5%9B%A0%E4%B8%BA%E8%83%BD%E4%BF%9D%E8%AF%81%E8%B0%83%E7%94%A8%E8%80%85%E4%BC%A0%E7%9A%84%E6%98%AF%E7%9C%9F%E6%AD%A3%E7%9A%84%20String%20%E5%AF%B9%E8%B1%A1%22%2C%22%26String%20%E5%92%8C%20%26str%20%E5%AE%8C%E5%85%A8%E7%AD%89%E4%BB%B7%EF%BC%8C%E5%8F%AF%E4%BB%A5%E9%9A%8F%E6%84%8F%E4%BA%92%E6%8D%A2%22%2C%22%E5%8F%82%E6%95%B0%E7%94%A8%20%26str%20%E6%9B%B4%E9%80%9A%E7%94%A8%EF%BC%8C%E6%97%A2%E8%83%BD%E6%8E%A5%E5%8F%97%20%26String%EF%BC%88%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%EF%BC%89%EF%BC%8C%E4%B9%9F%E8%83%BD%E6%8E%A5%E5%8F%97%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%22%2C%22%E5%8F%82%E6%95%B0%E7%94%A8%20%26str%20%E4%BC%9A%E5%AF%BC%E8%87%B4%E6%80%A7%E8%83%BD%E4%B8%8B%E9%99%8D%EF%BC%8C%E5%9B%A0%E4%B8%BA%E9%9C%80%E8%A6%81%E9%A2%9D%E5%A4%96%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%26String%20%E5%8F%AA%E8%83%BD%E6%8E%A5%E5%8F%97%20String%20%E7%9A%84%E5%BC%95%E7%94%A8%EF%BC%9B%E8%80%8C%20%26str%20%E5%8F%AF%E4%BB%A5%E6%8E%A5%E5%8F%97%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%88%E6%9C%AC%E8%BA%AB%E5%B0%B1%E6%98%AF%20%26str%EF%BC%89%E5%92%8C%20%26String%EF%BC%88%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%BF%9B%E8%A1%8C%E9%9A%90%E5%BC%8F%E8%BD%AC%E6%8D%A2%EF%BC%89%E3%80%82%E5%9B%A0%E6%AD%A4%E5%87%BD%E6%95%B0%E5%8F%AA%E9%9C%80%E8%A6%81%E8%AF%BB%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%97%B6%EF%BC%8C%E5%8F%82%E6%95%B0%E7%B1%BB%E5%9E%8B%E5%86%99%20%26str%20%E6%9B%B4%E7%81%B5%E6%B4%BB%E3%80%81%E6%9B%B4%E9%80%9A%E7%94%A8%EF%BC%8C%E8%BF%99%E6%98%AF%20Rust%20%E7%9A%84%E6%83%AF%E7%94%A8%E6%B3%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h1 id="编程练习">编程练习</h1>
<h2 id="练习-1修复所有权错误">练习 1：修复所有权错误</h2>
<p>下面的函数在打印名字后，<code>main</code> 中无法再使用 <code>name</code>。请修改函数签名（及调用方式），让 <code>main</code> 在调用后仍能使用 <code>name</code>：</p>
<div class="code-editor" data-block-id="03-ownership/05-practice#2:0" data-expect-mode="literal" data-expect-pattern="Hello%2C%20Alice!%0ANice%20to%20meet%20you%2C%20Alice!" data-starter-code="fn%20greet(name%3A%20String)%20%7B%0A%20%20%20%20println!(%22Hello%2C%20%7B%7D!%22%2C%20name)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20name%20%3D%20String%3A%3Afrom(%22Alice%22)%3B%0A%20%20%20%20greet(name)%3B%0A%20%20%20%20println!(%22Nice%20to%20meet%20you%2C%20%7B%7D!%22%2C%20name)%3B%20%2F%2F%20%E7%9B%AE%E5%89%8D%E8%BF%99%E8%A1%8C%E4%BC%9A%E6%8A%A5%E9%94%99%0A%7D"><pre><code class="language-rust">fn greet(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let name = String::from("Alice");
    greet(name);
    println!("Nice to meet you, {}!", name); // 目前这行会报错
}</code></pre></div>
<h2 id="练习-2修复借用冲突">练习 2：修复借用冲突</h2>
<p>下面的代码在持有不可变引用时尝试修改字符串，导致编译错误。请在<strong>不删除任何 <code>println!</code></strong> 的前提下，仅调整代码顺序使其通过编译：</p>
<div class="code-editor" data-block-id="03-ownership/05-practice#2:1" data-expect-mode="literal" data-expect-pattern="first%20snapshot%3A%20hello%0Afull%20sentence%3A%20hello%20world" data-starter-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20sentence%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%0A%20%20%20%20let%20first%20%3D%20%26sentence%3B%0A%20%20%20%20sentence.push_str(%22%20world%22)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E5%AD%98%E5%9C%A8%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E6%97%B6%E4%B8%8D%E8%83%BD%E4%BF%AE%E6%94%B9%0A%0A%20%20%20%20println!(%22first%20snapshot%3A%20%7B%7D%22%2C%20first)%3B%0A%20%20%20%20println!(%22full%20sentence%3A%20%7B%7D%22%2C%20sentence)%3B%0A%7D"><pre><code class="language-rust">fn main() {
    let mut sentence = String::from("hello");

    let first = &amp;sentence;
    sentence.push_str(" world"); // 错误：存在不可变引用时不能修改

    println!("first snapshot: {}", first);
    println!("full sentence: {}", sentence);
}</code></pre></div>
<h2 id="练习-3实现字符计数函数">练习 3：实现字符计数函数</h2>
<p>请实现 <code>count_char</code> 函数，统计字符串中某个字符出现的次数：</p>
<div class="code-editor" data-block-id="03-ownership/05-practice#2:2" data-expect-mode="literal" data-expect-pattern="3%0A3%0A2" data-starter-code="fn%20count_char(s%3A%20%26str%2C%20target%3A%20char)%20-%3E%20usize%20%7B%0A%20%20%20%20%2F%2F%20TODO%EF%BC%9A%E9%81%8D%E5%8E%86%20s%20%E4%B8%AD%E7%9A%84%E6%AF%8F%E4%B8%AA%E5%AD%97%E7%AC%A6%EF%BC%8C%E7%BB%9F%E8%AE%A1%E4%B8%8E%20target%20%E7%9B%B8%E7%AD%89%E7%9A%84%E4%B8%AA%E6%95%B0%0A%20%20%20%200%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20count_char(%22hello%20world%22%2C%20'l'))%3B%20%2F%2F%203%0A%20%20%20%20println!(%22%7B%7D%22%2C%20count_char(%22rust%20programming%22%2C%20'r'))%3B%20%2F%2F%203%0A%20%20%20%20println!(%22%7B%7D%22%2C%20count_char(%22abcabc%22%2C%20'a'))%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%202%0A%7D"><pre><code class="language-rust">fn count_char(s: &amp;str, target: char) -&gt; usize {
    // TODO：遍历 s 中的每个字符，统计与 target 相等的个数
    0
}

fn main() {
    println!("{}", count_char("hello world", 'l')); // 3
    println!("{}", count_char("rust programming", 'r')); // 3
    println!("{}", count_char("abcabc", 'a'));            // 2
}</code></pre></div>
<h2 id="练习-4修复可变引用错误">练习 4：修复可变引用错误</h2>
<p>下面的函数想通过引用将数值加一，但使用了不可变引用。请修复函数签名和调用处，使程序正确输出：</p>
<div class="code-editor" data-block-id="03-ownership/05-practice#2:3" data-expect-mode="literal" data-expect-pattern="count%20%3D%203" data-starter-code="fn%20add_one(n%3A%20%26i32)%20%7B%0A%20%20%20%20*n%20%2B%3D%201%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E4%B8%8D%E8%83%BD%E9%80%9A%E8%BF%87%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%BC%95%E7%94%A8%E4%BF%AE%E6%94%B9%E5%80%BC%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%20%20%20%20add_one(%26count)%3B%0A%20%20%20%20add_one(%26count)%3B%0A%20%20%20%20add_one(%26count)%3B%0A%20%20%20%20println!(%22count%20%3D%20%7B%7D%22%2C%20count)%3B%0A%7D"><pre><code class="language-rust">fn add_one(n: &amp;i32) {
    *n += 1; // 错误：不能通过不可变引用修改值
}

fn main() {
    let mut count = 0;
    add_one(&amp;count);
    add_one(&amp;count);
    add_one(&amp;count);
    println!("count = {}", count);
}</code></pre></div>
<h2 id="练习-5实现切片最大值函数">练习 5：实现切片最大值函数</h2>
<p>请实现 <code>max_in_slice</code> 函数，返回整数切片中的最大值。函数应接受任意长度的切片（完整数组或其中一段）：</p>
<div class="code-editor" data-block-id="03-ownership/05-practice#2:4" data-expect-mode="literal" data-expect-pattern="9%0A4%0A9" data-starter-code="fn%20max_in_slice(numbers%3A%20%26%5Bi32%5D)%20-%3E%20i32%20%7B%0A%20%20%20%20%2F%2F%20TODO%EF%BC%9A%E6%89%BE%E5%87%BA%E5%88%87%E7%89%87%E4%B8%AD%E7%9A%84%E6%9C%80%E5%A4%A7%E5%80%BC%E5%B9%B6%E8%BF%94%E5%9B%9E%0A%20%20%20%20%2F%2F%20%E6%8F%90%E7%A4%BA%EF%BC%9A%E5%8F%AF%E4%BB%A5%E5%85%88%E5%81%87%E8%AE%BE%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%E6%98%AF%E6%9C%80%E5%A4%A7%E5%80%BC%EF%BC%8C%E7%84%B6%E5%90%8E%E9%80%90%E4%B8%AA%E6%AF%94%E8%BE%83%0A%20%20%20%200%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20arr%20%3D%20%5B3%2C%201%2C%204%2C%201%2C%205%2C%209%2C%202%2C%206%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20max_in_slice(%26arr))%3B%20%20%20%20%20%20%20%20%2F%2F%209%0A%20%20%20%20println!(%22%7B%7D%22%2C%20max_in_slice(%26arr%5B..4%5D))%3B%20%20%20%2F%2F%204%0A%20%20%20%20println!(%22%7B%7D%22%2C%20max_in_slice(%26arr%5B4..%5D))%3B%20%20%20%2F%2F%209%0A%7D"><pre><code class="language-rust">fn max_in_slice(numbers: &amp;[i32]) -&gt; i32 {
    // TODO：找出切片中的最大值并返回
    // 提示：可以先假设第一个元素是最大值，然后逐个比较
    0
}

fn main() {
    let arr = [3, 1, 4, 1, 5, 9, 2, 6];
    println!("{}", max_in_slice(&amp;arr));        // 9
    println!("{}", max_in_slice(&amp;arr[..4]));   // 4
    println!("{}", max_in_slice(&amp;arr[4..]));   // 9
}</code></pre></div> </div>
