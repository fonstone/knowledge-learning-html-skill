---
chapterId: "11-lifetimes"
lessonId: "02-lifetime-annotations"
title: "函数中的生命周期"
level: "进阶"
duration: "25 分钟"
tags: ["lifetime annotation", "生命周期标注", "函数", "lifetime coercion", "'a: 'b"]
number: "11.2"
chapterTitle: "生命周期"
chapterNumber: "11"
---

<div id="article-content"> <h1 id="函数中的标注">函数中的标注</h1>
<h2 id="为什么函数需要手动标注">为什么函数需要手动标注</h2>
<p>上一篇我们看到，两个变量之间的生命周期关系，编译器能自己推断。但函数呢？</p>
<p>考虑这个需求：写一个 <code>longest</code> 函数，接收两个字符串 slice，返回较长的那个。</p>
<div class="code-runner" data-full-code="fn%20longest(x%3A%20%26str%2C%20y%3A%20%26str)%20-%3E%20%26str%20%7B%0A%20%20%20%20if%20x.len()%20%3E%20y.len()%20%7B%0A%20%20%20%20%20%20%20%20x%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20y%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22abcd%22)%3B%0A%20%20%20%20let%20s2%20%3D%20%22xyz%22%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20longest(s1.as_str()%2C%20s2))%3B%0A%7D" data-mode="expect-error"><pre><code class="language-rust">fn longest(x: &amp;str, y: &amp;str) -&gt; &amp;str {
    if x.len() &gt; y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("abcd");
    let s2 = "xyz";
    println!("{}", longest(s1.as_str(), s2));
}</code></pre></div>
<p>编译器报错：<code>missing lifetime specifier</code>，提示返回值是一个借用，但搞不清楚是从 <code>x</code> 还是 <code>y</code> 借的。</p>
<p>你可能会想：“上面的例子里 <code>s1</code> 和 <code>s2</code> 都在 <code>main</code> 里，生命周期一样长，不管返回哪个都没问题啊？“——确实，<strong>这个特定的调用</strong>没问题。但函数签名是一份<strong>合约</strong>，必须对所有可能的调用者都成立。这个函数完全可以被这样调用：</p>
<pre><code class="language-rust">fn main() {
    let s1 = String::from("abcd");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
    }  // s2 在这里销毁
    println!("{}", result); // result 指向 s1 还是已销毁的 s2？
}</code></pre>
<p>这里 <code>s1</code> 比 <code>s2</code> 活得更久。函数体里 <code>if x.len() &gt; y.len() { x } else { y }</code> 要到运行时才知道返回哪个。如果返回了 <code>s2</code>，<code>result</code> 就变成悬垂引用了。</p>
<p>编译器检查函数和检查调用方是<strong>完全隔离</strong>的两件事：分析函数体时不看调用方，分析调用方时不看函数体。它在函数签名处看到”接受两个不知道谁更长的引用，返回其中一个”，却不知道该对返回值承诺多长的生命周期——所以报错，要求你手动说清楚。</p>
<h2 id="生命周期标注语法">生命周期标注语法</h2>
<p>生命周期参数用撇号开头，通常命名为 <code>'a</code>、<code>'b</code>……写在 <code>&amp;</code> 之后：</p>
<pre><code class="language-rust">&amp;i32        // 普通引用（没有显式生命周期）
&amp;'a i32     // 带生命周期 'a 的引用
&amp;'a mut i32 // 带生命周期 'a 的可变引用</code></pre>
<p>和泛型类型参数一样，生命周期参数需要先在函数名后的尖括号里声明：</p>
<div class="code-runner" data-full-code="fn%20longest%3C'a%3E(x%3A%20%26'a%20str%2C%20y%3A%20%26'a%20str)%20-%3E%20%26'a%20str%20%7B%0A%20%20%20%20if%20x.len()%20%3E%20y.len()%20%7B%0A%20%20%20%20%20%20%20%20x%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20y%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22long%20string%20is%20long%22)%3B%0A%20%20%20%20let%20s2%20%3D%20String%3A%3Afrom(%22xyz%22)%3B%0A%20%20%20%20let%20result%20%3D%20longest(s1.as_str()%2C%20s2.as_str())%3B%0A%20%20%20%20println!(%22%E6%9C%80%E9%95%BF%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%98%AF%EF%BC%9A%7B%7D%22%2C%20result)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str {
    if x.len() &gt; y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("long string is long");
    let s2 = String::from("xyz");
    let result = longest(s1.as_str(), s2.as_str());
    println!("最长的字符串是：{}", result);
}</code></pre></div>
<p>现在能编译了。<code>&lt;'a&gt;</code> 声明了一个泛型生命周期参数，签名说明：两个输入引用和返回值都与生命周期 <code>'a</code> 相关联。</p>
<h2 id="深入理解标注的含义">深入理解：标注的含义</h2>
<p><code>&lt;'a&gt;</code> 到底说了什么？它说的是：</p>
<blockquote>
<p>对于某个生命周期 <code>'a</code>，函数接受两个至少活 <code>'a</code> 这么久的字符串 slice，并返回一个也至少活 <code>'a</code> 这么久的字符串 slice。</p>
</blockquote>
<p><strong>‘a 的实际值是 x 和 y 两个参数生命周期的「较短那个」。返回值的生命周期也会是这个较短值。有了这个信息，编译器就可以知道这个函数的返回值在调用方的作用域内是否是安全的。</strong></p>
<p>来看具体例子：</p>
<div class="code-runner" data-full-code="fn%20longest%3C'a%3E(x%3A%20%26'a%20str%2C%20y%3A%20%26'a%20str)%20-%3E%20%26'a%20str%20%7B%0A%20%20%20%20if%20x.len()%20%3E%20y.len()%20%7B%20x%20%7D%20else%20%7B%20y%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22long%20string%20is%20long%22)%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20s2%20%3D%20String%3A%3Afrom(%22xyz%22)%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20s1%20%E5%92%8C%20s2%20%E5%9C%A8%E8%BF%99%E4%B8%AA%20%7B%7D%20%E5%86%85%E9%83%BD%E6%9C%89%E6%95%88%0A%20%20%20%20%20%20%20%20%2F%2F%20'a%20%E5%8F%96%E4%B8%A4%E8%80%85%E4%B8%AD%E8%BE%83%E7%9F%AD%E7%9A%84%EF%BC%8C%E5%8D%B3%20s2%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%0A%20%20%20%20%20%20%20%20let%20result%20%3D%20longest(s1.as_str()%2C%20s2.as_str())%3B%0A%20%20%20%20%20%20%20%20println!(%22%E6%9C%80%E9%95%BF%E7%9A%84%EF%BC%9A%7B%7D%22%2C%20result)%3B%20%2F%2F%20%E5%90%88%E6%B3%95%EF%BC%8Cresult%20%E5%9C%A8%20%7B%7D%20%E5%86%85%E7%94%A8%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str {
    if x.len() &gt; y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string is long");
    {
        let s2 = String::from("xyz");
        // s1 和 s2 在这个 {} 内都有效
        // 'a 取两者中较短的，即 s2 的生命周期
        let result = longest(s1.as_str(), s2.as_str());
        println!("最长的：{}", result); // 合法，result 在 {} 内用
    }
}</code></pre></div>
<p>如果把 <code>result</code> 放到内部作用域外面用，就会出问题：</p>
<div class="code-runner" data-full-code="fn%20longest%3C'a%3E(x%3A%20%26'a%20str%2C%20y%3A%20%26'a%20str)%20-%3E%20%26'a%20str%20%7B%0A%20%20%20%20if%20x.len()%20%3E%20y.len()%20%7B%20x%20%7D%20else%20%7B%20y%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22long%20string%20is%20long%22)%3B%0A%20%20%20%20let%20result%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20s2%20%3D%20String%3A%3Afrom(%22xyz%22)%3B%0A%20%20%20%20%20%20%20%20result%20%3D%20longest(s1.as_str()%2C%20s2.as_str())%3B%0A%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20s2%20%E5%9C%A8%E8%BF%99%E9%87%8C%E9%94%80%E6%AF%81%0A%20%20%20%20println!(%22%7B%7D%22%2C%20result)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81result%20%E5%8F%AF%E8%83%BD%E5%BC%95%E7%94%A8%E5%B7%B2%E9%94%80%E6%AF%81%E7%9A%84%20s2%0A%7D" data-mode="expect-error"><pre><code class="language-rust">fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str {
    if x.len() &gt; y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string is long");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
    }                    // s2 在这里销毁
    println!("{}", result); // 错误！result 可能引用已销毁的 s2
}</code></pre></div>
<blockquote>
<p>生命周期标注<strong>不改变</strong>任何引用的实际存活时间，它只是给编译器提供信息，让编译器能在违规时报错。</p>
</blockquote>
<h2 id="返回值生命周期必须来自参数">返回值生命周期必须来自参数</h2>
<p>如果函数返回引用，这个引用要么指向某个参数，要么是 <code>'static</code>——不可能是函数内部创建的局部变量：</p>
<div class="code-runner" data-full-code="fn%20make_string%3C'a%3E()%20-%3E%20%26'a%20str%20%7B%0A%20%20%20%20let%20s%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20s.as_str()%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9As%20%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%E8%A2%AB%E9%94%80%E6%AF%81%EF%BC%8C%E8%BF%94%E5%9B%9E%E7%9A%84%E5%BC%95%E7%94%A8%E4%BC%9A%E6%82%AC%E5%9E%82%0A%7D" data-mode="expect-error"><pre><code class="language-rust">fn make_string&lt;'a&gt;() -&gt; &amp;'a str {
    let s = String::from("hello");
    s.as_str() // 错误：s 在函数结束时被销毁，返回的引用会悬垂
}</code></pre></div>
<p>这种情况应该返回有所有权的 <code>String</code>，而不是引用：</p>
<div class="code-runner" data-full-code="fn%20make_string()%20-%3E%20String%20%7B%0A%20%20%20%20String%3A%3Afrom(%22hello%22)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s%20%3D%20make_string()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">fn make_string() -&gt; String {
    String::from("hello")
}

fn main() {
    let s = make_string();
    println!("{}", s);
}</code></pre></div>
<h2 id="不相关的参数不需要标注">不相关的参数不需要标注</h2>
<p>生命周期只需要标注<strong>有关联</strong>的参数和返回值。如果某个参数和返回值没有关系，不需要给它标注：</p>
<div class="code-runner" data-full-code="%2F%2F%20y%20%E5%92%8C%E8%BF%94%E5%9B%9E%E5%80%BC%E6%B2%A1%E6%9C%89%E5%85%B3%E7%B3%BB%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%90%8C%E4%B8%80%E4%B8%AA%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%0Afn%20always_first%3C'a%3E(x%3A%20%26'a%20str%2C%20_y%3A%20%26str)%20-%3E%20%26'a%20str%20%7B%0A%20%20%20%20x%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20result%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20s2%20%3D%20String%3A%3Afrom(%22world%22)%3B%0A%20%20%20%20%20%20%20%20result%20%3D%20always_first(s1.as_str()%2C%20s2.as_str())%3B%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%7B%7D%22%2C%20result)%3B%20%2F%2F%20%E5%90%88%E6%B3%95%EF%BC%8Cresult%20%E5%92%8C%20s1%20%E5%90%8C%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%0A%7D" data-mode="run"><pre><code class="language-rust">// y 和返回值没有关系，不需要同一个生命周期
fn always_first&lt;'a&gt;(x: &amp;'a str, _y: &amp;str) -&gt; &amp;'a str {
    x
}

fn main() {
    let s1 = String::from("hello");
    let result;
    {
        let s2 = String::from("world");
        result = always_first(s1.as_str(), s2.as_str());
    }
    println!("{}", result); // 合法，result 和 s1 同生命周期
}</code></pre></div>
<h1 id="生命周期强制转换-a-b">生命周期强制转换 <code>'a: 'b</code></h1>
<p>前面的例子里，两个参数都标注了同一个 <code>'a</code>，编译器会取两者中较短的那个作为 <code>'a</code> 的实际值。但有时候你需要<strong>明确表达”这两个生命周期有长短关系”</strong>，而不是把它们合并成同一个。</p>
<p>考虑这种情形：函数接受两个引用，生命周期分别是 <code>'a</code> 和 <code>'b</code>，你想把 <code>'a</code> 的引用当成 <code>'b</code> 的引用来返回。这当然得有个前提——<code>'a</code> 至少和 <code>'b</code> 一样长，否则返回的引用可能比 <code>'b</code> 先失效。</p>
<p>打个比方：你租了一套房子，租约到 12 月底（<code>'a</code>）。朋友问你能不能借住到 6 月（<code>'b</code>）。没问题——你的租约比 6 月更长，可以”缩短承诺”给朋友。但如果租约只到 4 月，你就没法承诺到 6 月了。</p>
<p><code>'a: 'b</code> 就是用来声明这个前提的。它读作”生命周期 <code>'a</code> 至少和 <code>'b</code> 一样长”（<code>'a</code> outlives <code>'b</code>），让编译器接受”把 <code>&amp;'a T</code> 当 <code>&amp;'b T</code> 用”这件事：</p>
<div class="code-runner" data-full-code="%2F%2F%20'a%3A%20'b%20%E8%A1%A8%E7%A4%BA%20'a%20%E8%87%B3%E5%B0%91%E5%92%8C%20'b%20%E4%B8%80%E6%A0%B7%E9%95%BF%0A%2F%2F%20%E6%89%80%E4%BB%A5%E5%8F%AF%E4%BB%A5%E5%AE%89%E5%85%A8%E5%9C%B0%E6%8A%8A%20%26'a%20i32%20%E5%BD%93%E6%88%90%20%26'b%20i32%20%E8%BF%94%E5%9B%9E%0Afn%20choose_first%3C'a%3A%20'b%2C%20'b%3E(first%3A%20%26'a%20i32%2C%20_second%3A%20%26'b%20i32)%20-%3E%20%26'b%20i32%20%7B%0A%20%20%20%20first%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20first%20%3D%2010%3B%0A%20%20%20%20let%20result%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20second%20%3D%2020%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20first%20%E6%B4%BB%E5%BE%97%E6%9B%B4%E9%95%BF%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%A2%AB%22%E7%BC%A9%E7%9F%AD%22%E5%88%B0%20second%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%0A%20%20%20%20%20%20%20%20result%20%3D%20choose_first(%26first%2C%20%26second)%3B%0A%20%20%20%20%20%20%20%20println!(%22%E9%80%89%E6%8B%A9%E4%BA%86%3A%20%7B%7D%22%2C%20result)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre><code class="language-rust">// 'a: 'b 表示 'a 至少和 'b 一样长
// 所以可以安全地把 &amp;'a i32 当成 &amp;'b i32 返回
fn choose_first&lt;'a: 'b, 'b&gt;(first: &amp;'a i32, _second: &amp;'b i32) -&gt; &amp;'b i32 {
    first
}

fn main() {
    let first = 10;
    let result;
    {
        let second = 20;
        // first 活得更长，可以被"缩短"到 second 的生命周期
        result = choose_first(&amp;first, &amp;second);
        println!("选择了: {}", result);
    }
}</code></pre></div>
<p>为什么要这样写？签名说”返回值的生命周期是 <code>'b</code>”，但实际上我们返回的是 <code>first</code>（<code>'a</code>）。编译器需要知道 <code>'a</code> 至少和 <code>'b</code> 一样长，才能接受把 <code>'a</code> 引用当 <code>'b</code> 引用用。<code>'a: 'b</code> 就是这个保证。</p>
<blockquote>
<p>日常代码里很少需要手写 <code>'a: 'b</code>——大多数情况编译器能自动推断。理解它的含义主要是为了读懂复杂的错误信息。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="函数生命周期测验">函数生命周期测验</h2>
<div class="quiz-choice" data-block-id="11-lifetimes/02-lifetime-annotations#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D%20%60fn%20foo%3C'a%3E(x%3A%20%26'a%20str%2C%20y%3A%20%26'a%20str)%20-%3E%20%26'a%20str%60%20%E7%9A%84%E5%90%AB%E4%B9%89%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22x%20%E5%92%8C%20y%20%E5%BF%85%E9%A1%BB%E6%8B%A5%E6%9C%89%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%2C%22'a%20%E6%98%AF%E4%B8%80%E4%B8%AA%E5%9B%BA%E5%AE%9A%E7%9A%84%E5%85%A8%E5%B1%80%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%2C%22%E5%87%BD%E6%95%B0%E4%BC%9A%E6%8A%8A%20x%20%E5%92%8C%20y%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%BB%B6%E9%95%BF%E5%88%B0%20'a%22%2C%22%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8D%E4%BC%9A%E8%B6%85%E8%BF%87%20x%20%E5%92%8C%20y%20%E4%B8%AD%E8%BE%83%E7%9F%AD%E7%9A%84%E9%82%A3%E4%B8%AA%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%8F%82%E6%95%B0%20'a%20%E8%A1%A8%E7%A4%BA%E4%B8%80%E4%B8%AA%E5%85%B7%E4%BD%93%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%8C%E5%9C%A8%E8%B0%83%E7%94%A8%E6%97%B6%E4%BC%9A%E8%A2%AB%E5%AE%9E%E4%BE%8B%E5%8C%96%E4%B8%BA%20x%20%E5%92%8C%20y%20%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E7%9A%84%E4%BA%A4%E9%9B%86%EF%BC%88%E8%BE%83%E7%9F%AD%E7%9A%84%E9%82%A3%E4%B8%AA%EF%BC%89%E3%80%82%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E6%9C%89%E6%95%88%E6%9C%9F%E4%B8%8D%E4%BC%9A%E8%B6%85%E8%BF%87%E8%BF%99%E4%B8%AA%E5%80%BC%E3%80%82%E6%A0%87%E6%B3%A8%E4%B8%8D%E4%BC%9A%E6%94%B9%E5%8F%98%E4%BB%BB%E4%BD%95%E5%BC%95%E7%94%A8%E5%AE%9E%E9%99%85%E7%9A%84%E5%AD%98%E6%B4%BB%E6%97%B6%E9%97%B4%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-rust">fn dangle&lt;'a&gt;() -&gt; &amp;'a str {
    let s = String::from("hello");
    &amp;s
}</code></pre>
<div class="quiz-choice" data-block-id="11-lifetimes/02-lifetime-annotations#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E7%BC%96%E8%AF%91%EF%BC%8C%E5%8E%9F%E5%9B%A0%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E7%BC%BA%E5%B0%91%20main%20%E5%87%BD%E6%95%B0%22%2C%22%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%B1%BB%E5%9E%8B%E4%B8%8D%E6%94%AF%E6%8C%81%E5%BC%95%E7%94%A8%22%2C%22%E8%BF%94%E5%9B%9E%E7%9A%84%E5%BC%95%E7%94%A8%E6%8C%87%E5%90%91%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%E7%9A%84%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%20s%EF%BC%8Cs%20%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E6%97%B6%E8%A2%AB%E9%94%80%E6%AF%81%22%2C%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%8F%82%E6%95%B0%20'a%20%E5%A3%B0%E6%98%8E%E6%9C%89%E8%AF%AF%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22s%20%E6%98%AF%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%E5%88%9B%E5%BB%BA%E7%9A%84%20String%EF%BC%8C%E5%87%BD%E6%95%B0%E7%BB%93%E6%9D%9F%E5%90%8E%20s%20%E8%A2%AB%20drop%E3%80%82%E8%BF%94%E5%9B%9E%E6%8C%87%E5%90%91%20s%20%E7%9A%84%E5%BC%95%E7%94%A8%E4%BC%9A%E9%80%A0%E6%88%90%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E3%80%82%E7%BC%96%E8%AF%91%E5%99%A8%E6%8A%A5%E9%94%99%20%5C%22%60s%60%20does%20not%20live%20long%20enough%5C%22%E3%80%82%E6%AD%A3%E7%A1%AE%E5%81%9A%E6%B3%95%E6%98%AF%E8%BF%94%E5%9B%9E%20String%20%E8%80%8C%E4%B8%8D%E6%98%AF%20%26str%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="11-lifetimes/02-lifetime-annotations#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%85%B3%E4%BA%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A0%87%E6%B3%A8%EF%BC%8C%E4%B8%8B%E5%88%97%E8%AF%B4%E6%B3%95%E5%93%AA%E4%BA%9B%E6%AD%A3%E7%A1%AE%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%A6%82%E6%9E%9C%E5%87%BD%E6%95%B0%E6%9F%90%E4%B8%AA%E5%8F%82%E6%95%B0%E5%92%8C%E8%BF%94%E5%9B%9E%E5%80%BC%E6%B2%A1%E6%9C%89%E5%85%B3%E8%81%94%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%B8%8D%E7%BB%99%E8%AF%A5%E5%8F%82%E6%95%B0%E6%A0%87%E6%B3%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%2C%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A0%87%E6%B3%A8%E4%B8%8D%E6%94%B9%E5%8F%98%E5%BC%95%E7%94%A8%E5%AE%9E%E9%99%85%E5%AD%98%E6%B4%BB%E7%9A%84%E6%97%B6%E9%97%B4%22%2C%22%E8%BF%94%E5%9B%9E%E5%BC%95%E7%94%A8%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%BF%85%E9%A1%BB%E6%9D%A5%E8%87%AA%E8%BE%93%E5%85%A5%E5%8F%82%E6%95%B0%EF%BC%88%E6%88%96%20'static%EF%BC%89%EF%BC%8C%E4%B8%8D%E8%83%BD%E6%9D%A5%E8%87%AA%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%E5%88%9B%E5%BB%BA%E7%9A%84%E5%80%BC%22%2C%22%E6%AF%8F%E4%B8%AA%E5%BC%95%E7%94%A8%E5%8F%82%E6%95%B0%E9%83%BD%E5%BF%85%E9%A1%BB%E6%98%BE%E5%BC%8F%E5%86%99%E5%87%BA%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%5D%2C%22correct%22%3A%5B0%2C1%2C2%5D%2C%22explanation%22%3A%22%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%A0%87%E6%B3%A8%E5%8F%AA%E6%98%AF%E8%AE%A9%E7%BC%96%E8%AF%91%E5%99%A8%E7%90%86%E8%A7%A3%E6%84%8F%E5%9B%BE%EF%BC%8C%E4%B8%8D%E6%94%B9%E5%8F%98%E5%AE%9E%E9%99%85%E8%A1%8C%E4%B8%BA%E3%80%82%E4%B8%8E%E8%BF%94%E5%9B%9E%E5%80%BC%E6%97%A0%E5%85%B3%E7%9A%84%E5%8F%82%E6%95%B0%E5%8F%AF%E4%BB%A5%E4%B8%8D%E6%A0%87%E6%B3%A8%E3%80%82Rust%20%E6%9C%89%E7%9C%81%E7%95%A5%E8%A7%84%E5%88%99%EF%BC%8C%E5%BE%88%E5%A4%9A%E6%83%85%E5%86%B5%E4%B8%8D%E9%9C%80%E8%A6%81%E6%98%BE%E5%BC%8F%E6%A0%87%E6%B3%A8%E3%80%82%E8%BF%94%E5%9B%9E%E5%80%BC%E5%BC%95%E7%94%A8%E5%BF%85%E9%A1%BB%E6%8C%87%E5%90%91%E6%9F%90%E4%B8%AA%E8%BE%93%E5%85%A5%EF%BC%8C%E5%90%A6%E5%88%99%E4%BC%9A%E9%80%A0%E6%88%90%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="11-lifetimes/02-lifetime-annotations#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%60'a%3A%20'b%60%20%E8%BF%99%E4%B8%AA%E5%86%99%E6%B3%95%E7%9A%84%E5%90%AB%E4%B9%89%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22'a%20%E8%87%B3%E5%B0%91%E5%92%8C%20'b%20%E4%B8%80%E6%A0%B7%E9%95%BF%EF%BC%88'a%20%E6%AF%94%20'b%20%E6%B4%BB%E5%BE%97%E6%9B%B4%E4%B9%85%E6%88%96%E4%B8%80%E6%A0%B7%E4%B9%85%EF%BC%89%22%2C%22'b%20%E5%BF%85%E9%A1%BB%E6%AF%94%20'a%20%E6%B4%BB%E5%BE%97%E6%9B%B4%E4%B9%85%22%2C%22%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E9%94%99%E8%AF%AF%E7%9A%84%E8%AF%AD%E6%B3%95%22%2C%22'a%20%E5%92%8C%20'b%20%E6%98%AF%E5%90%8C%E4%B8%80%E4%B8%AA%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22'a%3A%20'b%20%E8%AF%BB%E4%BD%9C%5C%22'a%20outlives%20'b%5C%22%EF%BC%8C%E8%A1%A8%E7%A4%BA%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%20'a%20%E7%9A%84%E8%8C%83%E5%9B%B4%E8%A6%86%E7%9B%96%20'b%20%E7%9A%84%E8%8C%83%E5%9B%B4%E3%80%82%E6%9C%89%E4%BA%86%E8%BF%99%E4%B8%AA%E7%BA%A6%E6%9D%9F%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%8A%8A%20%26'a%20T%20%E5%BD%93%E4%BD%9C%20%26'b%20T%20%E4%BD%BF%E7%94%A8%EF%BC%8C%E5%9B%A0%E4%B8%BA%E7%BC%96%E8%AF%91%E5%99%A8%E7%9F%A5%E9%81%93%20'a%20%E5%9C%A8%20'b%20%E7%BB%93%E6%9D%9F%E4%B9%8B%E5%89%8D%E4%B8%8D%E4%BC%9A%E7%BB%93%E6%9D%9F%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="编程练习">编程练习</h2>
<p>下面两个函数都无法编译，原因是缺少生命周期标注。请分析每个函数的返回值来自哪个参数，然后添加正确的标注使其通过编译。</p>
<p>注意：两个函数所需的标注方式不同——思考为什么。</p>
<div class="code-editor" data-block-id="11-lifetimes/02-lifetime-annotations#2:4" data-expect-mode="literal" data-expect-pattern="%E8%BE%83%E7%9F%AD%E7%9A%84%EF%BC%9Ahi%0A%E5%8E%BB%E6%8E%89%E5%89%8D%E7%BC%80%EF%BC%9Aworld" data-starter-code="%2F%2F%20%E5%87%BD%E6%95%B0%201%EF%BC%9A%E8%BF%94%E5%9B%9E%E4%B8%A4%E4%B8%AA%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E8%BE%83%E7%9F%AD%E7%9A%84%E9%82%A3%E4%B8%AA%0A%2F%2F%20%E6%8F%90%E7%A4%BA%EF%BC%9A%E8%BF%94%E5%9B%9E%E5%80%BC%E5%8F%AF%E8%83%BD%E6%9D%A5%E8%87%AA%20a%EF%BC%8C%E4%B9%9F%E5%8F%AF%E8%83%BD%E6%9D%A5%E8%87%AA%20b%0Afn%20shorter(a%3A%20%26str%2C%20b%3A%20%26str)%20-%3E%20%26str%20%7B%0A%20%20%20%20if%20a.len()%20%3C%3D%20b.len()%20%7B%20a%20%7D%20else%20%7B%20b%20%7D%0A%7D%0A%0A%2F%2F%20%E5%87%BD%E6%95%B0%202%EF%BC%9A%E5%A6%82%E6%9E%9C%20text%20%E4%BB%A5%20prefix%20%E5%BC%80%E5%A4%B4%EF%BC%8C%E5%8E%BB%E6%8E%89%E5%89%8D%E7%BC%80%E5%90%8E%E8%BF%94%E5%9B%9E%E5%89%A9%E4%BD%99%E9%83%A8%E5%88%86%EF%BC%9B%E5%90%A6%E5%88%99%E5%8E%9F%E6%A0%B7%E8%BF%94%E5%9B%9E%0A%2F%2F%20%E6%8F%90%E7%A4%BA%EF%BC%9A%E8%BF%94%E5%9B%9E%E5%80%BC%E5%8F%AA%E5%8F%AF%E8%83%BD%E6%9D%A5%E8%87%AA%20text%EF%BC%8C%E4%B8%8D%E4%BC%9A%E6%9D%A5%E8%87%AA%20prefix%0Afn%20strip_prefix(text%3A%20%26str%2C%20prefix%3A%20%26str)%20-%3E%20%26str%20%7B%0A%20%20%20%20if%20text.starts_with(prefix)%20%7B%0A%20%20%20%20%20%20%20%20%26text%5Bprefix.len()..%5D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20text%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20s1%20%3D%20String%3A%3Afrom(%22hello%22)%3B%0A%20%20%20%20let%20result1%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20s2%20%3D%20String%3A%3Afrom(%22hi%22)%3B%0A%20%20%20%20%20%20%20%20result1%20%3D%20shorter(%26s1%2C%20%26s2)%3B%0A%20%20%20%20%20%20%20%20println!(%22%E8%BE%83%E7%9F%AD%E7%9A%84%EF%BC%9A%7B%7D%22%2C%20result1)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20let%20text%20%3D%20String%3A%3Afrom(%22hello%2C%20world%22)%3B%0A%20%20%20%20let%20result2%3B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20let%20prefix%20%3D%20String%3A%3Afrom(%22hello%2C%20%22)%3B%0A%20%20%20%20%20%20%20%20result2%20%3D%20strip_prefix(%26text%2C%20%26prefix)%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20prefix%20%E5%9C%A8%E8%BF%99%E9%87%8C%E9%94%80%E6%AF%81%EF%BC%8C%E4%BD%86%20result2%20%E6%9D%A5%E8%87%AA%20text%EF%BC%8Ctext%20%E8%BF%98%E6%B4%BB%E7%9D%80%0A%20%20%20%20%7D%0A%20%20%20%20println!(%22%E5%8E%BB%E6%8E%89%E5%89%8D%E7%BC%80%EF%BC%9A%7B%7D%22%2C%20result2)%3B%0A%7D"><pre><code class="language-rust">// 函数 1：返回两个字符串中较短的那个
// 提示：返回值可能来自 a，也可能来自 b
fn shorter(a: &amp;str, b: &amp;str) -&gt; &amp;str {
    if a.len() &lt;= b.len() { a } else { b }
}

// 函数 2：如果 text 以 prefix 开头，去掉前缀后返回剩余部分；否则原样返回
// 提示：返回值只可能来自 text，不会来自 prefix
fn strip_prefix(text: &amp;str, prefix: &amp;str) -&gt; &amp;str {
    if text.starts_with(prefix) {
        &amp;text[prefix.len()..]
    } else {
        text
    }
}

fn main() {
    let s1 = String::from("hello");
    let result1;
    {
        let s2 = String::from("hi");
        result1 = shorter(&amp;s1, &amp;s2);
        println!("较短的：{}", result1);
    }

    let text = String::from("hello, world");
    let result2;
    {
        let prefix = String::from("hello, ");
        result2 = strip_prefix(&amp;text, &amp;prefix);
        // prefix 在这里销毁，但 result2 来自 text，text 还活着
    }
    println!("去掉前缀：{}", result2);
}</code></pre></div> </div>
