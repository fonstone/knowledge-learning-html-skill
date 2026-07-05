---
chapterId: "05-stdlib-types"
lessonId: "04-practice"
title: "综合练习"
level: "进阶"
duration: "50 分钟"
tags: ["向量", "字符串", "哈希表", "综合应用", "所有权", "集合"]
number: "5.4"
chapterTitle: "标准库类型"
chapterNumber: "05"
---

<div id="article-content"> <h1 id="代码判断题">代码判断题</h1>
<h2 id="题目-1向量与所有权">题目 1：向量与所有权</h2>
<pre><code class="language-rust">fn main() {
    let mut vec = vec![1, 2, 3];
    let first = &amp;vec[0];

    vec.push(4);

    println!("{}", first);
}</code></pre>
<div class="quiz-choice" data-block-id="05-stdlib-types/04-practice#0:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%EF%BC%8C%E4%BD%86%E8%BF%90%E8%A1%8C%E6%97%B6%E4%BC%9A%20panic%22%2C%22%E8%83%BD%EF%BC%8Cfirst%20%E5%B7%B2%E7%BB%8F%E5%A4%8D%E5%88%B6%E4%BA%86%E5%80%BC%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8Cfirst%20%E6%98%AF%E5%AF%B9%20vec%20%E7%9A%84%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%EF%BC%8C%E8%80%8C%20vec.push(4)%20%E8%AF%95%E5%9B%BE%E5%8F%AF%E5%8F%98%E4%BF%AE%E6%94%B9%20vec%22%2C%22%E8%83%BD%EF%BC%8Cpush%20%E4%B8%8D%E5%BD%B1%E5%93%8D%E7%8E%B0%E6%9C%89%E5%85%83%E7%B4%A0%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Rust%20%E7%9A%84%E5%80%9F%E7%94%A8%E8%A7%84%E5%88%99%EF%BC%9A%E5%BD%93%E5%AD%98%E5%9C%A8%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E6%97%B6%EF%BC%8C%E4%B8%8D%E8%83%BD%E8%BF%9B%E8%A1%8C%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E3%80%82first%20%E5%BC%95%E7%94%A8%E4%BA%86%20vec%20%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%8C%E6%89%80%E4%BB%A5%20push%20%E6%97%A0%E6%B3%95%E6%89%A7%E8%A1%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="题目-2string-与-str-的区别">题目 2：String 与 &amp;str 的区别</h2>
<pre><code class="language-rust">fn modify_string(s: &amp;mut String) {
    s.push_str("!");
}

fn main() {
    let s = "Hello";
    modify_string(s);
}</code></pre>
<div class="quiz-choice" data-block-id="05-stdlib-types/04-practice#0:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E7%9A%84%E9%97%AE%E9%A2%98%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22modify_string%20%E5%87%BD%E6%95%B0%E6%B2%A1%E6%9C%89%20impl%20%E5%9D%97%22%2C%22%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%20%5C%22Hello%5C%22%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20%26str%EF%BC%8C%E4%B8%8D%E6%98%AF%20String%EF%BC%8C%E6%97%A0%E6%B3%95%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%22%2C%22%E7%BC%96%E8%AF%91%E6%97%B6%E4%BC%9A%E4%BA%A7%E7%94%9F%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F%22%2C%22s%20%E6%B2%A1%E6%9C%89%E5%A3%B0%E6%98%8E%E4%B8%BA%20mut%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%20%5C%22Hello%5C%22%20%E6%98%AF%20%26str%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E6%9C%AC%E8%BA%AB%E6%98%AF%E4%B8%8D%E5%8F%AF%E5%8F%98%E7%9A%84%E3%80%82%E5%87%BD%E6%95%B0%E6%9C%9F%E6%9C%9B%20%26mut%20String%EF%BC%8C%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%8C%B9%E9%85%8D%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="题目-3hashmap-的所有权转移">题目 3：HashMap 的所有权转移</h2>
<pre><code class="language-rust">use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    let key = String::from("name");

    map.insert(key, "Alice");

    println!("{}", key);
}</code></pre>
<div class="quiz-choice" data-block-id="05-stdlib-types/04-practice#0:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%EF%BC%8Ckey%20%E8%A2%AB%E5%A4%8D%E5%88%B6%E4%BA%86%22%2C%22%E8%83%BD%EF%BC%8C%E4%BD%86%E4%BC%9A%E8%BE%93%E5%87%BA%20null%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8CHashMap%20%E4%B8%8D%E6%94%AF%E6%8C%81%20String%20%E4%BD%9C%E4%B8%BA%E9%94%AE%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8Ckey%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%A2%AB%E8%BD%AC%E7%A7%BB%E7%BB%99%E4%BA%86%20HashMap%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E5%BD%93%E6%8A%8A%20String%20%E6%8F%92%E5%85%A5%20HashMap%20%E6%97%B6%EF%BC%8CString%20%E7%9A%84%E6%89%80%E6%9C%89%E6%9D%83%E8%BD%AC%E7%A7%BB%E7%BB%99%E4%BA%86%20HashMap%E3%80%82%E4%B9%8B%E5%90%8E%E6%97%A0%E6%B3%95%E5%86%8D%E4%BD%BF%E7%94%A8%20key%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="题目-4向量的迭代与修改">题目 4：向量的迭代与修改</h2>
<pre><code class="language-rust">fn main() {
    let mut vec = vec![1, 2, 3];

    for val in &amp;vec {
        if *val == 2 {
            vec.push(4);
        }
    }
}</code></pre>
<div class="quiz-choice" data-block-id="05-stdlib-types/04-practice#0:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E8%83%BD%E7%BC%96%E8%AF%91%E5%90%97%EF%BC%9F%22%2C%22options%22%3A%5B%22%E8%83%BD%EF%BC%8Cpush%20%E5%8F%AA%E6%B7%BB%E5%8A%A0%E5%85%83%E7%B4%A0%22%2C%22%E4%B8%8D%E8%83%BD%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%9C%A8%E8%BF%AD%E4%BB%A3%E6%97%B6%E5%8F%AF%E5%8F%98%E4%BF%AE%E6%94%B9%E5%90%91%E9%87%8F%EF%BC%88%E4%BC%9A%E5%AF%BC%E8%87%B4%E8%BF%AD%E4%BB%A3%E5%99%A8%E5%A4%B1%E6%95%88%EF%BC%89%22%2C%22%E8%83%BD%EF%BC%8C%E4%BD%86%E4%BC%9A%E6%97%A0%E9%99%90%E5%BE%AA%E7%8E%AF%22%2C%22%E8%83%BD%EF%BC%8C%E4%BC%9A%E8%BE%93%E5%87%BA%E9%94%99%E8%AF%AF%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E5%BD%93%E4%BD%A0%E6%8C%81%E6%9C%89%E5%90%91%E9%87%8F%E7%9A%84%E4%B8%8D%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%EF%BC%88%E9%80%9A%E8%BF%87%E8%BF%AD%E4%BB%A3%E5%99%A8%EF%BC%89%E6%97%B6%EF%BC%8C%E4%B8%8D%E8%83%BD%E8%BF%9B%E8%A1%8C%E5%8F%AF%E5%8F%98%E6%93%8D%E4%BD%9C%E3%80%82%E8%BF%99%E8%BF%9D%E5%8F%8D%E4%BA%86%20Rust%20%E7%9A%84%E5%80%9F%E7%94%A8%E8%A7%84%E5%88%99%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="题目-5字符串查找">题目 5：字符串查找</h2>
<pre><code class="language-rust">fn main() {
    let s = String::from("hello");
    let sub = "ll";

    if s.contains(sub) {
        println!("找到了");
    }
}</code></pre>
<div class="quiz-choice" data-block-id="05-stdlib-types/04-practice#0:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%E7%9A%84%E8%BE%93%E5%87%BA%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%BB%80%E4%B9%88%E4%B9%9F%E4%B8%8D%E8%BE%93%E5%87%BA%22%2C%22panic%22%2C%22%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%22%2C%22%E6%89%BE%E5%88%B0%E4%BA%86%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22String%20%E7%B1%BB%E5%9E%8B%E7%9A%84%20contains()%20%E6%96%B9%E6%B3%95%E6%8E%A5%E5%8F%97%20%26str%EF%BC%8Csub%20%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%E4%B8%BA%20%26str%E3%80%82%5C%22hello%5C%22%20%E7%A1%AE%E5%AE%9E%E5%8C%85%E5%90%AB%20%5C%22ll%5C%22%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<hr/>
<h1 id="编程练习">编程练习</h1>
<h2 id="练习-1向量去重">练习 1：向量去重</h2>
<p>从一个向量中移除所有重复的元素，保留第一次出现的值。</p>
<p><strong>任务：</strong></p>
<ul>
<li>实现 <code>deduplicate()</code> 函数，接收 <code>Vec&lt;i32&gt;</code>，返回去重后的新向量</li>
<li>只保留每个值的第一次出现</li>
</ul>
<p><strong>格式要求：</strong></p>
<ul>
<li>输入：<code>[1, 2, 2, 3, 1, 4, 3]</code></li>
<li>输出：<code>[1, 2, 3, 4]</code></li>
</ul>
<p><strong>提示：</strong></p>
<ul>
<li>可以创建一个新的空向量</li>
<li>遍历原向量，检查元素是否已在结果向量中</li>
<li><code>vec.contains(&amp;x)</code> 可以检查是否存在</li>
</ul>
<div class="code-editor" data-block-id="05-stdlib-types/04-practice#1:0" data-expect-mode="literal" data-expect-pattern="%5B1%2C%202%2C%203%2C%204%5D" data-starter-code="fn%20deduplicate(vec%3A%20Vec%3Ci32%3E)%20-%3E%20Vec%3Ci32%3E%20%7B%0A%20%20%20%20%2F%2F%20TODO%3A%20%E5%88%9B%E5%BB%BA%E7%BB%93%E6%9E%9C%E5%90%91%E9%87%8F%EF%BC%8C%E9%81%8D%E5%8E%86%E5%8E%9F%E5%90%91%E9%87%8F%E5%8E%BB%E9%87%8D%0A%20%20%20%20Vec%3A%3Anew()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20nums%20%3D%20vec!%5B1%2C%202%2C%202%2C%203%2C%201%2C%204%2C%203%5D%3B%0A%20%20%20%20let%20result%20%3D%20deduplicate(nums)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20result)%3B%0A%7D"><pre><code class="language-rust">fn deduplicate(vec: Vec&lt;i32&gt;) -&gt; Vec&lt;i32&gt; {
    // TODO: 创建结果向量，遍历原向量去重
    Vec::new()
}

fn main() {
    let nums = vec![1, 2, 2, 3, 1, 4, 3];
    let result = deduplicate(nums);
    println!("{:?}", result);
}</code></pre></div>
<h2 id="练习-2单词频率统计">练习 2：单词频率统计</h2>
<p>统计文本中每个单词出现的次数，输出频率最高的单词。</p>
<p><strong>任务：</strong></p>
<ul>
<li>实现 <code>most_frequent_word()</code> 函数，接收 <code>&amp;str</code></li>
<li>返回出现次数最多的单词和出现次数</li>
<li>格式：<code>"{word}" 出现了 {count} 次</code></li>
<li>假设单词用空格分隔</li>
</ul>
<p><strong>格式要求：</strong></p>
<ul>
<li>输入：<code>"the cat and the dog and the bird"</code></li>
<li>输出：<code>"the" 出现了 3 次</code></li>
</ul>
<p><strong>提示：</strong></p>
<ul>
<li>用 <code>split_whitespace()</code> 方法分割单词</li>
<li>使用 HashMap 存储单词计数</li>
<li>使用 <code>entry().and_modify().or_insert()</code> 更新计数</li>
<li>找出最大值</li>
</ul>
<div class="code-editor" data-block-id="05-stdlib-types/04-practice#1:1" data-expect-mode="literal" data-expect-pattern="%22the%22%20%E5%87%BA%E7%8E%B0%E4%BA%86%203%20%E6%AC%A1" data-starter-code="use%20std%3A%3Acollections%3A%3AHashMap%3B%0A%0Afn%20most_frequent_word(text%3A%20%26str)%20-%3E%20String%20%7B%0A%20%20%20%20%2F%2F%20TODO%3A%20%E7%BB%9F%E8%AE%A1%E5%8D%95%E8%AF%8D%E9%A2%91%E7%8E%87%EF%BC%8C%E8%BF%94%E5%9B%9E%E9%A2%91%E7%8E%87%E6%9C%80%E9%AB%98%E7%9A%84%E5%8D%95%E8%AF%8D%0A%20%20%20%20String%3A%3Anew()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20text%20%3D%20%22the%20cat%20and%20the%20dog%20and%20the%20bird%22%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20most_frequent_word(text))%3B%0A%7D"><pre><code class="language-rust">use std::collections::HashMap;

fn most_frequent_word(text: &amp;str) -&gt; String {
    // TODO: 统计单词频率，返回频率最高的单词
    String::new()
}

fn main() {
    let text = "the cat and the dog and the bird";
    println!("{}", most_frequent_word(text));
}</code></pre></div> </div>
