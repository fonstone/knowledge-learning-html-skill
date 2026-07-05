---
chapterId: "22-advanced"
lessonId: "02-dyn-trait"
title: "dyn Trait：动态分发"
level: "进阶"
duration: "30 分钟"
tags: ["dyn Trait", "动态分发", "trait 对象", "vtable"]
number: "22.2"
chapterTitle: "高级特性"
chapterNumber: "22"
---

<div id="article-content"> <h1 id="为什么需要-dyn-trait">为什么需要 dyn Trait</h1>
<h2 id="泛型搞不定的两个场景">泛型搞不定的两个场景</h2>
<p>泛型和 <code>impl Trait</code> 是”编译期多态”——编译器在编译时就把每种具体类型展开成独立代码，运行时完全不需要判断类型。这很高效，但有两种情况它做不到。</p>
<h3 id="场景一vec-里装不同的类型">场景一：Vec 里装不同的类型</h3>
<p>假设你在写一个 UI 框架，页面上有按钮、文本框、复选框……你想把它们全放进一个 <code>Vec</code>，然后循环调用每个组件的 <code>draw()</code> 方法：</p>
<div class="code-runner" data-full-code="trait%20Widget%20%7B%0A%20%20%20%20fn%20draw(%26self)%3B%0A%7D%0A%0Astruct%20Button%20%7B%20label%3A%20String%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%20%7D%0A%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%E7%94%BB%E6%8C%89%E9%92%AE%EF%BC%9A%7B%7D%22%2C%20self.label)%3B%20%7D%0A%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%E7%94%BB%E6%96%87%E6%9C%AC%E6%A1%86%EF%BC%9A%7B%7D%22%2C%20self.text)%3B%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%AF%95%E5%9B%BE%E6%8A%8A%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%E6%94%BE%E8%BF%9B%E5%90%8C%E4%B8%80%E4%B8%AA%20Vec%E2%80%94%E2%80%94%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%0A%20%20%20%20let%20widgets%3A%20Vec%3CButton%3E%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%20%7D%2C%0A%20%20%20%20%20%20%20%20TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%20%7D%2C%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%8C%B9%E9%85%8D%0A%20%20%20%20%5D%3B%0A%7D" data-mode="expect-error"><pre><code class="language-rust">trait Widget {
    fn draw(&amp;self);
}

struct Button { label: String }
struct TextBox { text: String }

impl Widget for Button {
    fn draw(&amp;self) { println!("画按钮：{}", self.label); }
}
impl Widget for TextBox {
    fn draw(&amp;self) { println!("画文本框：{}", self.text); }
}

fn main() {
    // 试图把不同类型放进同一个 Vec——编译失败
    let widgets: Vec&lt;Button&gt; = vec![
        Button { label: String::from("确定") },
        TextBox { text: String::from("请输入...") }, // 错误！类型不匹配
    ];
}</code></pre></div>
<p><code>Vec&lt;T&gt;</code> 的 <code>T</code> 在编译期只能是一种具体类型，没有办法装”实现了 Widget 的任意类型”。</p>
<h3 id="场景二根据条件返回不同类型">场景二：根据条件返回不同类型</h3>
<div class="code-runner" data-full-code="trait%20Widget%20%7B%20fn%20draw(%26self)%3B%20%7D%0Astruct%20Button%20%7B%20label%3A%20String%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%20%7D%0Aimpl%20Widget%20for%20Button%20%7B%20fn%20draw(%26self)%20%7B%7D%20%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%20fn%20draw(%26self)%20%7B%7D%20%7D%0A%0Afn%20create_widget(is_button%3A%20bool)%20-%3E%20impl%20Widget%20%7B%0A%20%20%20%20if%20is_button%20%7B%0A%20%20%20%20%20%20%20%20Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%20%7D%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E4%B8%A4%E4%B8%AA%E5%88%86%E6%94%AF%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%90%8C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre><code class="language-rust">fn create_widget(is_button: bool) -&gt; impl Widget {
    if is_button {
        Button { label: String::from("确定") }
    } else {
        TextBox { text: String::from("请输入...") } // 错误！两个分支返回类型不同
    }
}</code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">); }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {} }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {} }</span></span>

<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> create_widget</span><span style="color:#E1E4E8">(is_button</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> is_button {</span></span>
<span class="line"><span style="color:#B392F0">        Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请输入..."</span><span style="color:#E1E4E8">) } </span><span style="color:#6A737D">// 错误！两个分支返回类型不同</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>

<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>
<p><code>impl Widget</code> 虽然隐藏了具体类型名，但编译器在编译期就要确定它到底是哪一种——两个分支返回不同类型，没办法确定，编译失败。</p>
<h2 id="用-dyn-trait-解决">用 dyn Trait 解决</h2>
<p><code>dyn Trait</code> 的核心思路：<strong>不在编译期确定具体类型，而是在运行时通过指针查找方法</strong>。</p>
<div class="code-runner" data-full-code="trait%20Widget%20%7B%0A%20%20%20%20fn%20draw(%26self)%3B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%3B%0A%7D%0A%0Astruct%20Button%20%7B%20label%3A%20String%2C%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%2C%20cols%3A%20f64%2C%20rows%3A%20f64%20%7D%0Astruct%20Checkbox%20%7B%20checked%3A%20bool%2C%20size%3A%20f64%20%7D%0A%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%8C%89%E9%92%AE%5D%20%7B%7D%22%2C%20self.label)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.width%20*%20self.height%20%7D%0A%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%96%87%E6%9C%AC%E6%A1%86%5D%20%7B%7D%22%2C%20self.text)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.cols%20*%20self.rows%20%7D%0A%7D%0Aimpl%20Widget%20for%20Checkbox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E5%A4%8D%E9%80%89%E6%A1%86%5D%20%7B%7D%22%2C%20if%20self.checked%20%7B%20%22%E2%9C%93%22%20%7D%20else%20%7B%20%22%E2%96%A1%22%20%7D)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.size%20*%20self.size%20%7D%0A%7D%0A%0Afn%20build_ui()%20-%3E%20Vec%3CBox%3Cdyn%20Widget%3E%3E%20%7B%0A%20%20%20%20vec!%5B%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%2C%20cols%3A%20200.0%2C%20rows%3A%2024.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Checkbox%20%7B%20checked%3A%20true%2C%20size%3A%2016.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E5%8F%96%E6%B6%88%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%20%7D)%2C%0A%20%20%20%20%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20ui%20%3D%20build_ui()%3B%0A%0A%20%20%20%20println!(%22---%20%E6%B8%B2%E6%9F%93%E6%89%80%E6%9C%89%E7%BB%84%E4%BB%B6%20---%22)%3B%0A%20%20%20%20for%20widget%20in%20%26ui%20%7B%0A%20%20%20%20%20%20%20%20widget.draw()%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20let%20total_area%3A%20f64%20%3D%20ui.iter().map(%7Cw%7C%20w.area()).sum()%3B%0A%20%20%20%20println!(%22%E6%80%BB%E9%9D%A2%E7%A7%AF%3A%20%7B%7D%22%2C%20total_area)%3B%0A%7D" data-mode="run"><pre><code class="language-rust">trait Widget {
    fn draw(&amp;self);
    fn area(&amp;self) -&gt; f64;
}

struct Button { label: String, width: f64, height: f64 }
struct TextBox { text: String, cols: f64, rows: f64 }
struct Checkbox { checked: bool, size: f64 }

impl Widget for Button {
    fn draw(&amp;self) { println!("[按钮] {}", self.label); }
    fn area(&amp;self) -&gt; f64 { self.width * self.height }
}
impl Widget for TextBox {
    fn draw(&amp;self) { println!("[文本框] {}", self.text); }
    fn area(&amp;self) -&gt; f64 { self.cols * self.rows }
}
impl Widget for Checkbox {
    fn draw(&amp;self) { println!("[复选框] {}", if self.checked { "✓" } else { "□" }); }
    fn area(&amp;self) -&gt; f64 { self.size * self.size }
}

fn build_ui() -&gt; Vec&lt;Box&lt;dyn Widget&gt;&gt; {
    vec![
        Box::new(Button { label: String::from("确定"), width: 80.0, height: 30.0 }),
        Box::new(TextBox { text: String::from("请输入..."), cols: 200.0, rows: 24.0 }),
        Box::new(Checkbox { checked: true, size: 16.0 }),
        Box::new(Button { label: String::from("取消"), width: 80.0, height: 30.0 }),
    ]
}

fn main() {
    let ui = build_ui();

    println!("--- 渲染所有组件 ---");
    for widget in &amp;ui {
        widget.draw();
    }

    let total_area: f64 = ui.iter().map(|w| w.area()).sum();
    println!("总面积: {}", total_area);
}</code></pre></div>
<p><code>Box&lt;dyn Widget&gt;</code> 让不同类型能放进同一个 <code>Vec</code>，<code>build_ui</code> 也能根据需要自由选择返回哪种组件。</p>
<h2 id="类型擦除dyn-的本质约束">类型擦除：dyn 的本质约束</h2>
<p>使用 <code>dyn Widget</code> 时，只能调用 <code>Widget</code> 中定义的方法——具体类型信息”消失”了，这叫<strong>类型擦除</strong>（type erasure）：</p>
<div class="code-runner" data-full-code="trait%20Widget%20%7B%20fn%20draw(%26self)%3B%20fn%20area(%26self)%20-%3E%20f64%3B%20%7D%0Astruct%20Button%20%7B%20label%3A%20String%2C%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%8C%89%E9%92%AE%5D%20%7B%7D%22%2C%20self.label)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.width%20*%20self.height%20%7D%0A%7D%0Aimpl%20Button%20%7B%0A%20%20%20%20fn%20click(%26self)%20%7B%20println!(%22%E6%8C%89%E9%92%AE%E8%A2%AB%E7%82%B9%E5%87%BB%E4%BA%86%EF%BC%81%22)%3B%20%7D%20%2F%2F%20Button%20%E7%8B%AC%E6%9C%89%E7%9A%84%E6%96%B9%E6%B3%95%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20w%3A%20Box%3Cdyn%20Widget%3E%20%3D%20Box%3A%3Anew(Button%20%7B%0A%20%20%20%20%20%20%20%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20w.draw()%3B%20%20%20%2F%2F%20%E2%9C%85%20Widget%20%E5%AE%9A%E4%B9%89%E4%BA%86%20draw%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%B0%83%E7%94%A8%0A%20%20%20%20w.area()%3B%20%20%20%2F%2F%20%E2%9C%85%20Widget%20%E5%AE%9A%E4%B9%89%E4%BA%86%20area%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%B0%83%E7%94%A8%0A%20%20%20%20w.click()%3B%20%20%2F%2F%20%E2%9D%8C%20click%20%E4%B8%8D%E5%9C%A8%20Widget%20%E9%87%8C%EF%BC%8C%E7%B1%BB%E5%9E%8B%E5%B7%B2%E6%93%A6%E9%99%A4%EF%BC%8C%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%88%B0%0A%7D" data-has-hidden="true" data-mode="expect-error"><pre><code class="language-rust">impl Button {
    fn click(&amp;self) { println!("按钮被点击了！"); } // Button 独有的方法
}

fn main() {
    let w: Box&lt;dyn Widget&gt; = Box::new(Button {
        label: String::from("确定"), width: 80.0, height: 30.0
    });

    w.draw();   // ✅ Widget 定义了 draw，可以调用
    w.area();   // ✅ Widget 定义了 area，可以调用
    w.click();  // ❌ click 不在 Widget 里，类型已擦除，访问不到
}</code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">); </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"[按钮] {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">label); }</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> click</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"按钮被点击了！"</span><span style="color:#E1E4E8">); } </span><span style="color:#6A737D">// Button 独有的方法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>

<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> w</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">), width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 80.0</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30.0</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>

<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">draw</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 draw，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 area，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">click</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// ❌ click 不在 Widget 里，类型已擦除，访问不到</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>
<p>所以 <strong>trait 在动态分发里扮演的角色正是接口合约</strong>：你在 trait 里定义的方法，就是调用方通过 <code>dyn</code> 能看到和使用的全部。trait 设计得越精准，<code>dyn Trait</code> 就越好用。</p>
<h1 id="原理与限制">原理与限制</h1>
<p>了解了 <code>dyn Trait</code> 能做什么、以及类型擦除的限制，来看看它在内存里的实现——这有助于理解为什么有运行时开销，也解释了对象安全规则背后的原因。</p>
<h2 id="fat-pointer内存中的样子">fat pointer：内存中的样子</h2>
<p><code>dyn Trait</code> 在内存中是一个 <strong>fat pointer（胖指针）</strong>，由两个指针组成：</p>
<pre><code class="language-text">Box&lt;dyn Widget&gt;
┌───────────────┐
│  data ptr  ───┼──→  Button { ... }   ← 堆上的实际数据
│  vtable ptr ──┼──→  { draw, area, … } ← 方法地址表
└───────────────┘</code></pre>
<p>调用 <code>widget.draw()</code> 时，Rust 先通过 vtable 找到 <code>Button::draw</code> 的地址，再跳转执行——这就是”运行时开销”的来源。</p>
<h2 id="boxdyn-trait-与-dyn-trait">Box&lt;dyn Trait&gt; 与 &amp;dyn Trait</h2>
<p><code>dyn Trait</code> 自身没有已知大小，必须放在指针后面使用。常见的两种形式：</p>
<div class="code-runner" data-full-code="trait%20Greet%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20English%3B%0Astruct%20Chinese%3B%0A%0Aimpl%20Greet%20for%20English%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22Hello!%22)%20%7D%0A%7D%0Aimpl%20Greet%20for%20Chinese%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22)%20%7D%0A%7D%0A%0A%2F%2F%20%26dyn%20Trait%EF%BC%9A%E5%80%9F%E7%94%A8%EF%BC%8C%E4%B8%8D%E5%88%86%E9%85%8D%E5%A0%86%E5%86%85%E5%AD%98%0Afn%20greet_once(g%3A%20%26dyn%20Greet)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20g.hello())%3B%0A%7D%0A%0A%2F%2F%20Box%3Cdyn%20Trait%3E%EF%BC%9A%E6%8B%A5%E6%9C%89%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E6%95%B0%E6%8D%AE%E5%9C%A8%E5%A0%86%E4%B8%8A%0Afn%20make_greeter(lang%3A%20%26str)%20-%3E%20Box%3Cdyn%20Greet%3E%20%7B%0A%20%20%20%20match%20lang%20%7B%0A%20%20%20%20%20%20%20%20%22en%22%20%3D%3E%20Box%3A%3Anew(English)%2C%0A%20%20%20%20%20%20%20%20_%20%20%20%20%3D%3E%20Box%3A%3Anew(Chinese)%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20e%20%3D%20English%3B%0A%20%20%20%20greet_once(%26e)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%26dyn%EF%BC%9A%E5%BC%95%E7%94%A8%E6%A0%88%E4%B8%8A%E7%9A%84%E5%80%BC%0A%0A%20%20%20%20let%20g%20%3D%20make_greeter(%22zh%22)%3B%0A%20%20%20%20greet_once(g.as_ref())%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Box%3Cdyn%3E%EF%BC%9A%E5%BC%95%E7%94%A8%E5%A0%86%E4%B8%8A%E7%9A%84%E5%80%BC%0A%7D" data-mode="run"><pre><code class="language-rust">trait Greet {
    fn hello(&amp;self) -&gt; String;
}

struct English;
struct Chinese;

impl Greet for English {
    fn hello(&amp;self) -&gt; String { String::from("Hello!") }
}
impl Greet for Chinese {
    fn hello(&amp;self) -&gt; String { String::from("你好！") }
}

// &amp;dyn Trait：借用，不分配堆内存
fn greet_once(g: &amp;dyn Greet) {
    println!("{}", g.hello());
}

// Box&lt;dyn Trait&gt;：拥有所有权，数据在堆上
fn make_greeter(lang: &amp;str) -&gt; Box&lt;dyn Greet&gt; {
    match lang {
        "en" =&gt; Box::new(English),
        _    =&gt; Box::new(Chinese),
    }
}

fn main() {
    let e = English;
    greet_once(&amp;e);                    // &amp;dyn：引用栈上的值

    let g = make_greeter("zh");
    greet_once(g.as_ref());            // Box&lt;dyn&gt;：引用堆上的值
}</code></pre></div>
<table><thead><tr><th>形式</th><th>所有权</th><th>数据位置</th><th>典型用途</th></tr></thead><tbody><tr><td><code>&amp;dyn Trait</code></td><td>借用</td><td>调用者决定</td><td>函数参数，只需临时访问</td></tr><tr><td><code>Box&lt;dyn Trait&gt;</code></td><td>拥有</td><td>堆</td><td>返回值、集合元素、长期持有</td></tr></tbody></table>
<p>前面的例子都能正常工作，但不是所有 trait 都能用于 <code>dyn</code>——有一条叫<strong>对象安全</strong>的限制需要了解。</p>
<h2 id="对象安全">对象安全</h2>
<p>不是所有 trait 都能用作 <code>dyn Trait</code>——只有满足<strong>对象安全</strong>（object-safe）条件的才行：</p>
<ul>
<li>方法不能返回 <code>Self</code>（运行时无法知道 <code>Self</code> 的具体大小）</li>
<li>方法不能有泛型类型参数（每种 <code>T</code> 对应不同代码，无法放进统一的 vtable）</li>
</ul>
<p>最常见的不满足情况是 <code>Clone</code>——<code>clone()</code> 返回 <code>Self</code>，所以 <code>dyn Clone</code> 不合法：</p>
<div class="code-runner" data-full-code="%2F%2F%20Clone%20%E7%9A%84%E5%AE%9A%E4%B9%89%EF%BC%9Afn%20clone(%26self)%20-%3E%20Self%20%20%E2%86%90%20%E8%BF%94%E5%9B%9E%20Self%EF%BC%8C%E4%B8%8D%E5%AF%B9%E8%B1%A1%E5%AE%89%E5%85%A8%0Afn%20clone_it(x%3A%20%26dyn%20Clone)%20%7B%0A%20%20%20%20todo!()%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre><code class="language-rust">// Clone 的定义：fn clone(&amp;self) -&gt; Self  ← 返回 Self，不对象安全
fn clone_it(x: &amp;dyn Clone) {
    todo!()
}</code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#6A737D">// Clone 的定义：fn clone(&amp;self) -&gt; Self  ← 返回 Self，不对象安全</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> clone_it</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;dyn</span><span style="color:#B392F0"> Clone</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    todo!</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>

<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>
<h2 id="静态分发-vs-动态分发">静态分发 vs 动态分发</h2>
<table><thead><tr><th></th><th>泛型 / <code>impl Trait</code></th><th><code>dyn Trait</code></th></tr></thead><tbody><tr><td>类型确定时机</td><td>编译期</td><td>运行时</td></tr><tr><td>运行时开销</td><td>无（单态化）</td><td>有（vtable 查找）</td></tr><tr><td>二进制大小</td><td>每种类型一份代码，偏大</td><td>共享一份代码，偏小</td></tr><tr><td>存入异构集合</td><td>不能</td><td>能</td></tr><tr><td>条件返回不同类型</td><td>不能</td><td>能</td></tr><tr><td>对象安全限制</td><td>无</td><td>有</td></tr></tbody></table>
<p><strong>经验法则</strong>：默认用泛型（零开销）；需要运行时多态（异构集合、插件系统、条件分支返回不同类型）时才用 <code>dyn Trait</code>。</p>
<h1 id="练习题">练习题</h1>
<h2 id="dyn-trait-测验">dyn Trait 测验</h2>
<div class="quiz-choice" data-block-id="22-advanced/02-dyn-trait#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%BB%80%E4%B9%88%E6%97%B6%E5%80%99%E5%BA%94%E8%AF%A5%E7%94%A8%20Box%3Cdyn%20Trait%3E%20%E8%80%8C%E4%B8%8D%E6%98%AF%E6%B3%9B%E5%9E%8B%20%3CT%3A%20Trait%3E%EF%BC%9F%22%2C%22options%22%3A%5B%22%E9%9C%80%E8%A6%81%E6%8A%8A%E4%B8%8D%E5%90%8C%E7%9A%84%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%E6%94%BE%E5%85%A5%E5%90%8C%E4%B8%80%E4%B8%AA%E9%9B%86%E5%90%88%EF%BC%8C%E6%88%96%E6%A0%B9%E6%8D%AE%E6%9D%A1%E4%BB%B6%E8%BF%94%E5%9B%9E%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%22%2C%22%E6%B3%9B%E5%9E%8B%E8%AF%AD%E6%B3%95%E5%A4%AA%E5%A4%8D%E6%9D%82%EF%BC%8C%E6%83%B3%E5%86%99%E5%BE%97%E7%AE%80%E6%B4%81%E4%B8%80%E4%BA%9B%22%2C%22%E6%80%BB%E6%98%AF%E5%BA%94%E8%AF%A5%E4%BC%98%E5%85%88%E4%BD%BF%E7%94%A8%20Box%3Cdyn%20Trait%3E%22%2C%22%E6%83%B3%E8%A6%81%E6%9B%B4%E5%A5%BD%E7%9A%84%E8%BF%90%E8%A1%8C%E6%97%B6%E6%80%A7%E8%83%BD%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E6%B3%9B%E5%9E%8B%E5%9C%A8%E7%BC%96%E8%AF%91%E6%9C%9F%E7%A1%AE%E5%AE%9A%E7%B1%BB%E5%9E%8B%EF%BC%8C%E9%80%9F%E5%BA%A6%E6%9B%B4%E5%BF%AB%E4%BD%86%E6%AF%8F%E4%B8%AA%E8%B0%83%E7%94%A8%E7%82%B9%E5%8F%AA%E8%83%BD%E5%AF%B9%E5%BA%94%E4%B8%80%E7%A7%8D%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%E3%80%82Box%3Cdyn%20Trait%3E%20%E5%9C%A8%E8%BF%90%E8%A1%8C%E6%97%B6%E7%A1%AE%E5%AE%9A%EF%BC%8C%E6%9C%89%E9%A2%9D%E5%A4%96%E5%BC%80%E9%94%80%EF%BC%8C%E4%BD%86%E8%83%BD%E5%A4%84%E7%90%86%E8%BF%90%E8%A1%8C%E6%97%B6%E6%89%8D%E7%9F%A5%E9%81%93%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%9C%BA%E6%99%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/02-dyn-trait#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22Box%3Cdyn%20Animal%3E%20%E4%B8%AD%EF%BC%8C%5C%22%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4%5C%22%E6%98%AF%E6%8C%87%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%AD%98%E5%85%A5%E5%90%8E%E5%8F%AA%E8%83%BD%E9%80%9A%E8%BF%87%20Animal%20%E5%AE%9A%E4%B9%89%E7%9A%84%E6%96%B9%E6%B3%95%E8%AE%BF%E9%97%AE%EF%BC%8C%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%EF%BC%88Dog%2FCat%EF%BC%89%E7%9A%84%E5%85%B6%E4%BB%96%E6%96%B9%E6%B3%95%E4%B8%8D%E5%8F%AF%E8%A7%81%22%2C%22Box%20%E4%BC%9A%E6%8A%8A%E5%AF%B9%E8%B1%A1%E5%A4%8D%E5%88%B6%E4%B8%80%E4%BB%BD%E5%AD%98%E5%9C%A8%E6%A0%88%E4%B8%8A%22%2C%22%E5%8F%AA%E6%9C%89%E5%AE%9E%E7%8E%B0%E4%BA%86%20Clone%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%89%8D%E8%83%BD%E8%A2%AB%E6%93%A6%E9%99%A4%22%2C%22Animal%20trait%20%E8%A2%AB%E7%BC%96%E8%AF%91%E5%99%A8%E5%88%A0%E9%99%A4%E4%BA%86%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4%E6%8C%87%E7%9A%84%E6%98%AF%E6%8A%8A%20Dog%20%E8%A3%85%E5%85%A5%20Box%3Cdyn%20Animal%3E%20%E5%90%8E%EF%BC%8C%E4%BD%BF%E7%94%A8%E6%96%B9%E5%8F%AA%E8%83%BD%E9%80%9A%E8%BF%87%20Animal%20%E7%9A%84%E6%96%B9%E6%B3%95%E8%AE%BF%E9%97%AE%E5%AE%83%EF%BC%8CDog%20%E7%8B%AC%E6%9C%89%E7%9A%84%E6%96%B9%E6%B3%95%E5%AF%B9%E5%A4%96%E4%B8%8D%E5%8F%AF%E8%A7%81%E2%80%94%E2%80%94%E5%A5%BD%E5%83%8F%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%5C%22%E6%B6%88%E5%A4%B1%5C%22%E4%BA%86%E4%B8%80%E6%A0%B7%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/02-dyn-trait#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22dyn%20Trait%20%E7%9A%84%20fat%20pointer%EF%BC%88%E8%83%96%E6%8C%87%E9%92%88%EF%BC%89%E7%94%B1%E5%93%AA%E4%B8%A4%E9%83%A8%E5%88%86%E7%BB%84%E6%88%90%EF%BC%9F%22%2C%22options%22%3A%5B%22%E4%B8%A4%E4%B8%AA%E5%88%86%E5%88%AB%E6%8C%87%E5%90%91%E4%B8%8D%E5%90%8C%E6%95%B0%E6%8D%AE%E7%9A%84%E6%8C%87%E9%92%88%22%2C%22%E6%8C%87%E5%90%91%E6%95%B0%E6%8D%AE%E7%9A%84%E6%8C%87%E9%92%88%20%2B%20%E6%95%B0%E6%8D%AE%E9%95%BF%E5%BA%A6%22%2C%22%E6%8C%87%E5%90%91%20vtable%20%E7%9A%84%E6%8C%87%E9%92%88%20%2B%20%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%22%2C%22%E6%8C%87%E5%90%91%E6%95%B0%E6%8D%AE%E7%9A%84%E6%8C%87%E9%92%88%20%2B%20%E6%8C%87%E5%90%91%20vtable%20%E7%9A%84%E6%8C%87%E9%92%88%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22dyn%20Trait%20%E7%9A%84%20fat%20pointer%20%3D%20%E6%95%B0%E6%8D%AE%E6%8C%87%E9%92%88%EF%BC%88%E6%8C%87%E5%90%91%E5%A0%86%E4%B8%8A%E7%9A%84%E5%85%B7%E4%BD%93%E5%80%BC%EF%BC%89%2B%20vtable%20%E6%8C%87%E9%92%88%EF%BC%88%E6%8C%87%E5%90%91%E8%AF%A5%E7%B1%BB%E5%9E%8B%E5%AF%B9%E8%AF%A5%20trait%20%E7%9A%84%E6%96%B9%E6%B3%95%E8%A1%A8%EF%BC%89%E3%80%82%E9%80%9A%E8%BF%87%20vtable%EF%BC%8C%E8%BF%90%E8%A1%8C%E6%97%B6%E6%89%8D%E8%83%BD%E6%89%BE%E5%88%B0%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%96%B9%E6%B3%95%E5%AE%9E%E7%8E%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="22-advanced/02-dyn-trait#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%BA%E4%BB%80%E4%B9%88%20Clone%20trait%20%E4%B8%8D%E6%BB%A1%E8%B6%B3%E5%AF%B9%E8%B1%A1%E5%AE%89%E5%85%A8%EF%BC%8C%E4%B8%8D%E8%83%BD%E7%94%A8%E4%BD%9C%20dyn%20Clone%EF%BC%9F%22%2C%22options%22%3A%5B%22Clone%20%E6%B2%A1%E6%9C%89%E6%8F%90%E4%BE%9B%E9%BB%98%E8%AE%A4%E5%AE%9E%E7%8E%B0%22%2C%22dyn%20%E5%8F%AA%E6%94%AF%E6%8C%81%E6%9C%80%E5%A4%9A%E4%B8%A4%E4%B8%AA%E6%96%B9%E6%B3%95%E7%9A%84%20trait%22%2C%22Clone%20%E6%98%AF%E6%A0%87%E5%87%86%E5%BA%93%E7%9A%84%20trait%EF%BC%8C%E4%B8%8D%E5%85%81%E8%AE%B8%E7%94%A8%E4%BD%9C%20trait%20object%22%2C%22Clone%20%E7%9A%84%20clone()%20%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E%20Self%EF%BC%8C%E8%BF%90%E8%A1%8C%E6%97%B6%E6%97%A0%E6%B3%95%E7%A1%AE%E5%AE%9A%20Self%20%E7%9A%84%E5%85%B7%E4%BD%93%E5%A4%A7%E5%B0%8F%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E5%AF%B9%E8%B1%A1%E5%AE%89%E5%85%A8%E8%A6%81%E6%B1%82%E6%96%B9%E6%B3%95%E4%B8%8D%E8%83%BD%E8%BF%94%E5%9B%9E%20Self%EF%BC%8C%E5%9B%A0%E4%B8%BA%E8%BF%90%E8%A1%8C%E6%97%B6%E9%80%9A%E8%BF%87%20dyn%20%E4%BD%BF%E7%94%A8%E6%97%B6%E5%B7%B2%E7%BB%8F%E6%93%A6%E9%99%A4%E4%BA%86%E5%85%B7%E4%BD%93%E7%B1%BB%E5%9E%8B%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E6%97%A0%E6%B3%95%E7%9F%A5%E9%81%93%20Self%20%E6%98%AF%E5%A4%9A%E5%A4%A7%EF%BC%8C%E4%B9%9F%E6%97%A0%E6%B3%95%E7%94%9F%E6%88%90%E5%AF%B9%E5%BA%94%E7%9A%84%E4%BB%A3%E7%A0%81%E3%80%82Clone%3A%3Aclone%20%E7%9A%84%E7%AD%BE%E5%90%8D%20fn%20clone(%26self)%20-%3E%20Self%20%E8%BF%9D%E5%8F%8D%E4%BA%86%E8%BF%99%E6%9D%A1%E8%A7%84%E5%88%99%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
