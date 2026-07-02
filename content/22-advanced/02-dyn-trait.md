# 为什么需要 dyn Trait

## 泛型搞不定的两个场景

泛型和 `impl Trait` 是”编译期多态”——编译器在编译时就把每种具体类型展开成独立代码，运行时完全不需要判断类型。这很高效，但有两种情况它做不到。

### 场景一：Vec 里装不同的类型

假设你在写一个 UI 框架，页面上有按钮、文本框、复选框……你想把它们全放进一个 `Vec`，然后循环调用每个组件的 `draw()` 方法：

<div class="code-runner" data-full-code="trait%20Widget%20%7B%0A%20%20%20%20fn%20draw(%26self)%3B%0A%7D%0A%0Astruct%20Button%20%7B%20label%3A%20String%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%20%7D%0A%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%E7%94%BB%E6%8C%89%E9%92%AE%EF%BC%9A%7B%7D%22%2C%20self.label)%3B%20%7D%0A%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%E7%94%BB%E6%96%87%E6%9C%AC%E6%A1%86%EF%BC%9A%7B%7D%22%2C%20self.text)%3B%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E8%AF%95%E5%9B%BE%E6%8A%8A%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%E6%94%BE%E8%BF%9B%E5%90%8C%E4%B8%80%E4%B8%AA%20Vec%E2%80%94%E2%80%94%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%0A%20%20%20%20let%20widgets%3A%20Vec%3CButton%3E%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%20%7D%2C%0A%20%20%20%20%20%20%20%20TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%20%7D%2C%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%8C%B9%E9%85%8D%0A%20%20%20%20%5D%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"画按钮：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">label); }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"画文本框：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">text); }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 试图把不同类型放进同一个 Vec——编译失败</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> widgets</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">        Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">) },</span></span>
<span class="line"><span style="color:#B392F0">        TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请输入..."</span><span style="color:#E1E4E8">) }, </span><span style="color:#6A737D">// 错误！类型不匹配</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Vec<T>` 的 `T` 在编译期只能是一种具体类型，没有办法装”实现了 Widget 的任意类型”。

### 场景二：根据条件返回不同类型

<div class="code-runner" data-full-code="trait%20Widget%20%7B%20fn%20draw(%26self)%3B%20%7D%0Astruct%20Button%20%7B%20label%3A%20String%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%20%7D%0Aimpl%20Widget%20for%20Button%20%7B%20fn%20draw(%26self)%20%7B%7D%20%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%20fn%20draw(%26self)%20%7B%7D%20%7D%0A%0Afn%20create_widget(is_button%3A%20bool)%20-%3E%20impl%20Widget%20%7B%0A%20%20%20%20if%20is_button%20%7B%0A%20%20%20%20%20%20%20%20Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%20%7D%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E4%B8%A4%E4%B8%AA%E5%88%86%E6%94%AF%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%90%8C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> create_widget</span><span style="color:#E1E4E8">(is_button</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> is_button {</span></span>
<span class="line"><span style="color:#B392F0">        Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请输入..."</span><span style="color:#E1E4E8">) } </span><span style="color:#6A737D">// 错误！两个分支返回类型不同</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">); }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {} }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {} }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> create_widget</span><span style="color:#E1E4E8">(is_button</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> is_button {</span></span>
<span class="line"><span style="color:#B392F0">        Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请输入..."</span><span style="color:#E1E4E8">) } </span><span style="color:#6A737D">// 错误！两个分支返回类型不同</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

`impl Widget` 虽然隐藏了具体类型名，但编译器在编译期就要确定它到底是哪一种——两个分支返回不同类型，没办法确定，编译失败。

## 用 dyn Trait 解决

`dyn Trait` 的核心思路：**不在编译期确定具体类型，而是在运行时通过指针查找方法**。

<div class="code-runner" data-full-code="trait%20Widget%20%7B%0A%20%20%20%20fn%20draw(%26self)%3B%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%3B%0A%7D%0A%0Astruct%20Button%20%7B%20label%3A%20String%2C%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0Astruct%20TextBox%20%7B%20text%3A%20String%2C%20cols%3A%20f64%2C%20rows%3A%20f64%20%7D%0Astruct%20Checkbox%20%7B%20checked%3A%20bool%2C%20size%3A%20f64%20%7D%0A%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%8C%89%E9%92%AE%5D%20%7B%7D%22%2C%20self.label)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.width%20*%20self.height%20%7D%0A%7D%0Aimpl%20Widget%20for%20TextBox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%96%87%E6%9C%AC%E6%A1%86%5D%20%7B%7D%22%2C%20self.text)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.cols%20*%20self.rows%20%7D%0A%7D%0Aimpl%20Widget%20for%20Checkbox%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E5%A4%8D%E9%80%89%E6%A1%86%5D%20%7B%7D%22%2C%20if%20self.checked%20%7B%20%22%E2%9C%93%22%20%7D%20else%20%7B%20%22%E2%96%A1%22%20%7D)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.size%20*%20self.size%20%7D%0A%7D%0A%0Afn%20build_ui()%20-%3E%20Vec%3CBox%3Cdyn%20Widget%3E%3E%20%7B%0A%20%20%20%20vec!%5B%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(TextBox%20%7B%20text%3A%20String%3A%3Afrom(%22%E8%AF%B7%E8%BE%93%E5%85%A5...%22)%2C%20cols%3A%20200.0%2C%20rows%3A%2024.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Checkbox%20%7B%20checked%3A%20true%2C%20size%3A%2016.0%20%7D)%2C%0A%20%20%20%20%20%20%20%20Box%3A%3Anew(Button%20%7B%20label%3A%20String%3A%3Afrom(%22%E5%8F%96%E6%B6%88%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%20%7D)%2C%0A%20%20%20%20%5D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20ui%20%3D%20build_ui()%3B%0A%0A%20%20%20%20println!(%22---%20%E6%B8%B2%E6%9F%93%E6%89%80%E6%9C%89%E7%BB%84%E4%BB%B6%20---%22)%3B%0A%20%20%20%20for%20widget%20in%20%26ui%20%7B%0A%20%20%20%20%20%20%20%20widget.draw()%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20let%20total_area%3A%20f64%20%3D%20ui.iter().map(%7Cw%7C%20w.area()).sum()%3B%0A%20%20%20%20println!(%22%E6%80%BB%E9%9D%A2%E7%A7%AF%3A%20%7B%7D%22%2C%20total_area)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, cols</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, rows</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Checkbox</span><span style="color:#E1E4E8"> { checked</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">, size</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"[按钮] {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">label); }</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> TextBox</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"[文本框] {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">text); }</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">cols </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">rows }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Checkbox</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"[复选框] {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">if</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">checked { </span><span style="color:#9ECBFF">"✓"</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> { </span><span style="color:#9ECBFF">"□"</span><span style="color:#E1E4E8"> }); }</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">size </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">size }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> build_ui</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8">&gt;&gt; {</span></span>
<span class="line"><span style="color:#B392F0">    vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">), width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 80.0</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30.0</span><span style="color:#E1E4E8"> }),</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">TextBox</span><span style="color:#E1E4E8"> { text</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"请输入..."</span><span style="color:#E1E4E8">), cols</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 200.0</span><span style="color:#E1E4E8">, rows</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 24.0</span><span style="color:#E1E4E8"> }),</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Checkbox</span><span style="color:#E1E4E8"> { checked</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">, size</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 16.0</span><span style="color:#E1E4E8"> }),</span></span>
<span class="line"><span style="color:#B392F0">        Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"取消"</span><span style="color:#E1E4E8">), width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 80.0</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30.0</span><span style="color:#E1E4E8"> }),</span></span>
<span class="line"><span style="color:#E1E4E8">    ]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> ui </span><span style="color:#F97583">=</span><span style="color:#B392F0"> build_ui</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"--- 渲染所有组件 ---"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> widget </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">ui {</span></span>
<span class="line"><span style="color:#E1E4E8">        widget</span><span style="color:#F97583">.</span><span style="color:#B392F0">draw</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> total_area</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> ui</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">w</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> w</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">())</span><span style="color:#F97583">.</span><span style="color:#B392F0">sum</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"总面积: {}"</span><span style="color:#E1E4E8">, total_area);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`Box<dyn Widget>` 让不同类型能放进同一个 `Vec`，`build_ui` 也能根据需要自由选择返回哪种组件。

## 类型擦除：dyn 的本质约束

使用 `dyn Widget` 时，只能调用 `Widget` 中定义的方法——具体类型信息”消失”了，这叫**类型擦除**（type erasure）：

<div class="code-runner" data-full-code="trait%20Widget%20%7B%20fn%20draw(%26self)%3B%20fn%20area(%26self)%20-%3E%20f64%3B%20%7D%0Astruct%20Button%20%7B%20label%3A%20String%2C%20width%3A%20f64%2C%20height%3A%20f64%20%7D%0Aimpl%20Widget%20for%20Button%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%20println!(%22%5B%E6%8C%89%E9%92%AE%5D%20%7B%7D%22%2C%20self.label)%3B%20%7D%0A%20%20%20%20fn%20area(%26self)%20-%3E%20f64%20%7B%20self.width%20*%20self.height%20%7D%0A%7D%0Aimpl%20Button%20%7B%0A%20%20%20%20fn%20click(%26self)%20%7B%20println!(%22%E6%8C%89%E9%92%AE%E8%A2%AB%E7%82%B9%E5%87%BB%E4%BA%86%EF%BC%81%22)%3B%20%7D%20%2F%2F%20Button%20%E7%8B%AC%E6%9C%89%E7%9A%84%E6%96%B9%E6%B3%95%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20w%3A%20Box%3Cdyn%20Widget%3E%20%3D%20Box%3A%3Anew(Button%20%7B%0A%20%20%20%20%20%20%20%20label%3A%20String%3A%3Afrom(%22%E7%A1%AE%E5%AE%9A%22)%2C%20width%3A%2080.0%2C%20height%3A%2030.0%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20w.draw()%3B%20%20%20%2F%2F%20%E2%9C%85%20Widget%20%E5%AE%9A%E4%B9%89%E4%BA%86%20draw%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%B0%83%E7%94%A8%0A%20%20%20%20w.area()%3B%20%20%20%2F%2F%20%E2%9C%85%20Widget%20%E5%AE%9A%E4%B9%89%E4%BA%86%20area%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%B0%83%E7%94%A8%0A%20%20%20%20w.click()%3B%20%20%2F%2F%20%E2%9D%8C%20click%20%E4%B8%8D%E5%9C%A8%20Widget%20%E9%87%8C%EF%BC%8C%E7%B1%BB%E5%9E%8B%E5%B7%B2%E6%93%A6%E9%99%A4%EF%BC%8C%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%88%B0%0A%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> click</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"按钮被点击了！"</span><span style="color:#E1E4E8">); } </span><span style="color:#6A737D">// Button 独有的方法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> w</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">), width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 80.0</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30.0</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">draw</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 draw，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 area，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">click</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// ❌ click 不在 Widget 里，类型已擦除，访问不到</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">); </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> { label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, width</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Widget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"[按钮] {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">label); }</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> area</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">width </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">height }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> click</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"按钮被点击了！"</span><span style="color:#E1E4E8">); } </span><span style="color:#6A737D">// Button 独有的方法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> w</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Widget</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        label</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"确定"</span><span style="color:#E1E4E8">), width</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 80.0</span><span style="color:#E1E4E8">, height</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 30.0</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">draw</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 draw，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">area</span><span style="color:#E1E4E8">();   </span><span style="color:#6A737D">// ✅ Widget 定义了 area，可以调用</span></span>
<span class="line"><span style="color:#E1E4E8">    w</span><span style="color:#F97583">.</span><span style="color:#B392F0">click</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// ❌ click 不在 Widget 里，类型已擦除，访问不到</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

所以 **trait 在动态分发里扮演的角色正是接口合约**：你在 trait 里定义的方法，就是调用方通过 `dyn` 能看到和使用的全部。trait 设计得越精准，`dyn Trait` 就越好用。

# 原理与限制

了解了 `dyn Trait` 能做什么、以及类型擦除的限制，来看看它在内存里的实现——这有助于理解为什么有运行时开销，也解释了对象安全规则背后的原因。

## fat pointer：内存中的样子

`dyn Trait` 在内存中是一个 **fat pointer（胖指针）**，由两个指针组成：

```text
Box<dyn Widget>
┌───────────────┐
│  data ptr  ───┼──→  Button { ... }   ← 堆上的实际数据
│  vtable ptr ──┼──→  { draw, area, … } ← 方法地址表
└───────────────┘
```

调用 `widget.draw()` 时，Rust 先通过 vtable 找到 `Button::draw` 的地址，再跳转执行——这就是”运行时开销”的来源。

## Box<dyn Trait> 与 &dyn Trait

`dyn Trait` 自身没有已知大小，必须放在指针后面使用。常见的两种形式：

<div class="code-runner" data-full-code="trait%20Greet%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20English%3B%0Astruct%20Chinese%3B%0A%0Aimpl%20Greet%20for%20English%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22Hello!%22)%20%7D%0A%7D%0Aimpl%20Greet%20for%20Chinese%20%7B%0A%20%20%20%20fn%20hello(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22)%20%7D%0A%7D%0A%0A%2F%2F%20%26dyn%20Trait%EF%BC%9A%E5%80%9F%E7%94%A8%EF%BC%8C%E4%B8%8D%E5%88%86%E9%85%8D%E5%A0%86%E5%86%85%E5%AD%98%0Afn%20greet_once(g%3A%20%26dyn%20Greet)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20g.hello())%3B%0A%7D%0A%0A%2F%2F%20Box%3Cdyn%20Trait%3E%EF%BC%9A%E6%8B%A5%E6%9C%89%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E6%95%B0%E6%8D%AE%E5%9C%A8%E5%A0%86%E4%B8%8A%0Afn%20make_greeter(lang%3A%20%26str)%20-%3E%20Box%3Cdyn%20Greet%3E%20%7B%0A%20%20%20%20match%20lang%20%7B%0A%20%20%20%20%20%20%20%20%22en%22%20%3D%3E%20Box%3A%3Anew(English)%2C%0A%20%20%20%20%20%20%20%20_%20%20%20%20%3D%3E%20Box%3A%3Anew(Chinese)%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20e%20%3D%20English%3B%0A%20%20%20%20greet_once(%26e)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%26dyn%EF%BC%9A%E5%BC%95%E7%94%A8%E6%A0%88%E4%B8%8A%E7%9A%84%E5%80%BC%0A%0A%20%20%20%20let%20g%20%3D%20make_greeter(%22zh%22)%3B%0A%20%20%20%20greet_once(g.as_ref())%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Box%3Cdyn%3E%EF%BC%9A%E5%BC%95%E7%94%A8%E5%A0%86%E4%B8%8A%E7%9A%84%E5%80%BC%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Greet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> hello</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> English</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Chinese</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Greet</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> English</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> hello</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello!"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Greet</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Chinese</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> hello</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好！"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// &amp;dyn Trait：借用，不分配堆内存</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> greet_once</span><span style="color:#E1E4E8">(g</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;dyn</span><span style="color:#B392F0"> Greet</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, g</span><span style="color:#F97583">.</span><span style="color:#B392F0">hello</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// Box&lt;dyn Trait&gt;：拥有所有权，数据在堆上</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> make_greeter</span><span style="color:#E1E4E8">(lang</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Box</span><span style="color:#E1E4E8">&lt;</span><span style="color:#F97583">dyn</span><span style="color:#B392F0"> Greet</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> lang {</span></span>
<span class="line"><span style="color:#9ECBFF">        "en"</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">English</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        _    </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> Box</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Chinese</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> e </span><span style="color:#F97583">=</span><span style="color:#B392F0"> English</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    greet_once</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">e);                    </span><span style="color:#6A737D">// &amp;dyn：引用栈上的值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> g </span><span style="color:#F97583">=</span><span style="color:#B392F0"> make_greeter</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"zh"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    greet_once</span><span style="color:#E1E4E8">(g</span><span style="color:#F97583">.</span><span style="color:#B392F0">as_ref</span><span style="color:#E1E4E8">());            </span><span style="color:#6A737D">// Box&lt;dyn&gt;：引用堆上的值</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

| 形式 | 所有权 | 数据位置 | 典型用途 |
| --- | --- | --- | --- |
| `&dyn Trait` | 借用 | 调用者决定 | 函数参数，只需临时访问 |
| `Box<dyn Trait>` | 拥有 | 堆 | 返回值、集合元素、长期持有 |

前面的例子都能正常工作，但不是所有 trait 都能用于 `dyn`——有一条叫**对象安全**的限制需要了解。

## 对象安全

不是所有 trait 都能用作 `dyn Trait`——只有满足**对象安全**（object-safe）条件的才行：

- 方法不能返回 Self （运行时无法知道 Self 的具体大小）
- 方法不能有泛型类型参数（每种 T 对应不同代码，无法放进统一的 vtable）

最常见的不满足情况是 `Clone`——`clone()` 返回 `Self`，所以 `dyn Clone` 不合法：

<div class="code-runner" data-full-code="%2F%2F%20Clone%20%E7%9A%84%E5%AE%9A%E4%B9%89%EF%BC%9Afn%20clone(%26self)%20-%3E%20Self%20%20%E2%86%90%20%E8%BF%94%E5%9B%9E%20Self%EF%BC%8C%E4%B8%8D%E5%AF%B9%E8%B1%A1%E5%AE%89%E5%85%A8%0Afn%20clone_it(x%3A%20%26dyn%20Clone)%20%7B%0A%20%20%20%20todo!()%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// Clone 的定义：fn clone(&amp;self) -&gt; Self  ← 返回 Self，不对象安全</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> clone_it</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;dyn</span><span style="color:#B392F0"> Clone</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    todo!</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#6A737D">// Clone 的定义：fn clone(&amp;self) -&gt; Self  ← 返回 Self，不对象安全</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> clone_it</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;dyn</span><span style="color:#B392F0"> Clone</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    todo!</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

## 静态分发 vs 动态分发

|  | 泛型 / `impl Trait` | `dyn Trait` |
| --- | --- | --- |
| 类型确定时机 | 编译期 | 运行时 |
| 运行时开销 | 无（单态化） | 有（vtable 查找） |
| 二进制大小 | 每种类型一份代码，偏大 | 共享一份代码，偏小 |
| 存入异构集合 | 不能 | 能 |
| 条件返回不同类型 | 不能 | 能 |
| 对象安全限制 | 无 | 有 |

**经验法则**：默认用泛型（零开销）；需要运行时多态（异构集合、插件系统、条件分支返回不同类型）时才用 `dyn Trait`。

# 练习题

## dyn Trait 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的 `Logger` 系统需要支持多种日志后端（控制台、文件、内存缓冲区），运行时可以动态选择。请实现 `Logger` trait 和三种后端，让 `main` 正确运行：

```rust
trait Logger {
    fn log(&self, message: &str);
    fn name(&self) -> &str;
}

struct ConsoleLogger;
struct FileLogger { filename: String }
struct BufferLogger { prefix: String }

// TODO: 为三种 Logger 实现 Logger trait
// ConsoleLogger: name 返回 "console"，log 打印 "[console] {message}"
// FileLogger: name 返回文件名，log 打印 "[file:{filename}] {message}"
// BufferLogger: name 返回 "buffer"，log 打印 "[buffer:{prefix}] {message}"

fn log_all(loggers: &[Box<dyn Logger>], message: &str) {
    for logger in loggers {
        logger.log(message);
    }
}

fn make_logger(kind: &str) -> Box<dyn Logger> {
    match kind {
        "file"   => Box::new(FileLogger { filename: String::from("app.log") }),
        "buffer" => Box::new(BufferLogger { prefix: String::from("DEBUG") }),
        _        => Box::new(ConsoleLogger),
    }
}

fn main() {
    let loggers: Vec<Box<dyn Logger>> = vec![
        make_logger("console"),
        make_logger("file"),
        make_logger("buffer"),
    ];

    log_all(&loggers, "系统启动");
    println!("共 {} 个日志后端", loggers.len());
}
```