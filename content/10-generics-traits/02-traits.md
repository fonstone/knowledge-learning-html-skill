# 定义与实现

## 什么是 Trait

想象你在招聘网站写了一条岗位要求：

> **后端工程师**：必须能写 SQL、会用 Git、能写单元测试。

这条要求描述的是**能力（行为）**，而不是人的其他属性。不管应聘者是应届生还是工作十年的老手，只要满足这三条，都可以被”当作后端工程师”来使用。

Rust 的 **trait** 就是这个角色说明书——它定义一组方法签名，任何实现了它的类型都必须提供这些方法。trait 约定的是”能做什么”，而不关心类型内部是什么。

Trait 主要有三个用途：

- 统一接口 ：让不同的类型对外表现出相同的行为。 NewsArticle 和 Tweet 都实现了 Summary ，调用方可以用同一套方式处理它们。
- 泛型约束 ：写泛型函数时，用 T: Summary 告诉编译器”T 必须能摘要”，让函数只接受符合要求的类型。
- 接入标准库 ：实现 Display 就能用 println!("{}") 打印，实现 Iterator 就能用 for 循环——trait 是 Rust 语言特性和你的类型”对话”的接口。

<div class="code-runner" data-full-code="%2F%2F%20%E5%AE%9A%E4%B9%89%20trait%EF%BC%9A%E8%A7%84%E5%AE%9A%22%E8%83%BD%E6%91%98%E8%A6%81%E7%9A%84%E4%BA%8B%E7%89%A9%22%E5%BF%85%E9%A1%BB%E6%8F%90%E4%BE%9B%20summarize%20%E6%96%B9%E6%B3%95%0Atrait%20Summary%20%7B%0A%20%20%20%20fn%20summarize(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20NewsArticle%20%7B%0A%20%20%20%20headline%3A%20String%2C%0A%20%20%20%20author%3A%20String%2C%0A%7D%0A%0Astruct%20Tweet%20%7B%0A%20%20%20%20username%3A%20String%2C%0A%20%20%20%20content%3A%20String%2C%0A%7D%0A%0A%2F%2F%20%E4%B8%BA%20NewsArticle%20%E5%AE%9E%E7%8E%B0%20Summary%0Aimpl%20Summary%20for%20NewsArticle%20%7B%0A%20%20%20%20fn%20summarize(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%7B%7D%2C%20by%20%7B%7D%22%2C%20self.headline%2C%20self.author)%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%E4%B8%BA%20Tweet%20%E5%AE%9E%E7%8E%B0%20Summary%0Aimpl%20Summary%20for%20Tweet%20%7B%0A%20%20%20%20fn%20summarize(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%7B%7D%3A%20%7B%7D%22%2C%20self.username%2C%20self.content)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20article%20%3D%20NewsArticle%20%7B%0A%20%20%20%20%20%20%20%20headline%3A%20String%3A%3Afrom(%22Rust%20%E8%8D%A3%E8%8E%B7%E6%9C%80%E5%8F%97%E5%96%9C%E7%88%B1%E8%AF%AD%E8%A8%80%22)%2C%0A%20%20%20%20%20%20%20%20author%3A%20String%3A%3Afrom(%22%E5%B0%8F%E6%98%8E%22)%2C%0A%20%20%20%20%7D%3B%0A%20%20%20%20let%20tweet%20%3D%20Tweet%20%7B%0A%20%20%20%20%20%20%20%20username%3A%20String%3A%3Afrom(%22rustacean%22)%2C%0A%20%20%20%20%20%20%20%20content%3A%20String%3A%3Afrom(%22%E4%BB%8A%E5%A4%A9%E5%8F%88%E7%88%B1%E4%B8%8A%E4%BA%86%20Rust%EF%BC%81%22)%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20article.summarize())%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20tweet.summarize())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 定义 trait：规定"能摘要的事物"必须提供 summarize 方法</span></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Summary</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    headline</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    author</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    content</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 为 NewsArticle 实现 Summary</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Summary</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}, by {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">headline, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">author)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 为 Tweet 实现 Summary</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Summary</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}: {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">username, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">content)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> article </span><span style="color:#F97583">=</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        headline</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust 荣获最受喜爱语言"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        author</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"小明"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> tweet </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rustacean"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        content</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"今天又爱上了 Rust！"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, article</span><span style="color:#F97583">.</span><span style="color:#B392F0">summarize</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, tweet</span><span style="color:#F97583">.</span><span style="color:#B392F0">summarize</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 定义与实现语法

**定义**：用 `trait` 关键字 + 名称 + 大括号，方法签名以**分号**结尾（不写方法体）：

```rust
pub trait Drawable {
    fn draw(&self);
    fn bounding_box(&self) -> (f64, f64, f64, f64);
}
```

**实现**：用 `impl TraitName for TypeName`，在大括号内提供所有方法的具体实现：

<div class="code-runner" data-full-code="trait%20Drawable%20%7B%0A%20%20%20%20fn%20draw(%26self)%3B%0A%7D%0A%0Astruct%20Circle%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%20%20%20%20radius%3A%20f64%2C%0A%7D%0A%0Aimpl%20Drawable%20for%20Circle%20%7B%0A%20%20%20%20fn%20draw(%26self)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E7%94%BB%E5%9C%86%EF%BC%9A%E5%9C%86%E5%BF%83(%7B%7D%2C%20%7B%7D)%EF%BC%8C%E5%8D%8A%E5%BE%84%7B%7D%22%2C%20self.x%2C%20self.y%2C%20self.radius)%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20c%20%3D%20Circle%20%7B%20x%3A%200.0%2C%20y%3A%200.0%2C%20radius%3A%205.0%20%7D%3B%0A%20%20%20%20c.draw()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Drawable</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    radius</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Drawable</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> draw</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"画圆：圆心({}, {})，半径{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">radius);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Circle</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, radius</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#E1E4E8">    c</span><span style="color:#F97583">.</span><span style="color:#B392F0">draw</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

如果实现时遗漏了 trait 中的某个方法，编译器会报错，明确告诉你缺了什么。

## 默认实现

trait 中的方法可以提供**默认实现**——实现方可以选择沿用默认行为，也可以覆盖它：

<div class="code-runner" data-full-code="trait%20Summary%20%7B%0A%20%20%20%20fn%20summarize_author(%26self)%20-%3E%20String%3B%20%2F%2F%20%E6%B2%A1%E6%9C%89%E9%BB%98%E8%AE%A4%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%AE%9E%E7%8E%B0%0A%0A%20%20%20%20fn%20summarize(%26self)%20-%3E%20String%20%7B%20%20%20%20%20%20%20%2F%2F%20%E6%9C%89%E9%BB%98%E8%AE%A4%E5%AE%9E%E7%8E%B0%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%B8%8D%E8%A6%86%E7%9B%96%0A%20%20%20%20%20%20%20%20format!(%22%EF%BC%88%E6%9D%A5%E8%87%AA%20%7B%7D%20%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%89%22%2C%20self.summarize_author())%0A%20%20%20%20%7D%0A%7D%0A%0Astruct%20Tweet%20%7B%0A%20%20%20%20username%3A%20String%2C%0A%7D%0A%0Aimpl%20Summary%20for%20Tweet%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E5%AE%9E%E7%8E%B0%E5%BF%85%E9%A1%BB%E7%9A%84%E6%96%B9%E6%B3%95%EF%BC%8Csummarize%20%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%AE%9E%E7%8E%B0%0A%20%20%20%20fn%20summarize_author(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%40%7B%7D%22%2C%20self.username)%0A%20%20%20%20%7D%0A%7D%0A%0Astruct%20NewsArticle%20%7B%0A%20%20%20%20headline%3A%20String%2C%0A%20%20%20%20author%3A%20String%2C%0A%7D%0A%0Aimpl%20Summary%20for%20NewsArticle%20%7B%0A%20%20%20%20fn%20summarize_author(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20self.author.clone()%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E5%AE%9E%E7%8E%B0%EF%BC%8C%E6%8F%90%E4%BE%9B%E8%87%AA%E5%B7%B1%E7%9A%84%E6%A0%BC%E5%BC%8F%0A%20%20%20%20fn%20summarize(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%7B%7D%20%E2%80%94%20%7B%7D%22%2C%20self.headline%2C%20self.author)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20tweet%20%3D%20Tweet%20%7B%20username%3A%20String%3A%3Afrom(%22rustlang%22)%20%7D%3B%0A%20%20%20%20let%20article%20%3D%20NewsArticle%20%7B%0A%20%20%20%20%20%20%20%20headline%3A%20String%3A%3Afrom(%22Rust%202024%20Edition%20%E5%8F%91%E5%B8%83%22)%2C%0A%20%20%20%20%20%20%20%20author%3A%20String%3A%3Afrom(%22InfoQ%22)%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20tweet.summarize())%3B%20%20%20%2F%2F%20%E7%94%A8%E9%BB%98%E8%AE%A4%E5%AE%9E%E7%8E%B0%0A%20%20%20%20println!(%22%7B%7D%22%2C%20article.summarize())%3B%20%2F%2F%20%E7%94%A8%E8%87%AA%E5%B7%B1%E7%9A%84%E5%AE%9E%E7%8E%B0%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Summary</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize_author</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 没有默认，必须实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {       </span><span style="color:#6A737D">// 有默认实现，可以不覆盖</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"（来自 {} 的内容）"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#B392F0">summarize_author</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Summary</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 只实现必须的方法，summarize 使用默认实现</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize_author</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"@{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">username)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    headline</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    author</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Summary</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize_author</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">        self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">author</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 覆盖默认实现，提供自己的格式</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> summarize</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} — {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">headline, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">author)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> tweet </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Tweet</span><span style="color:#E1E4E8"> { username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rustlang"</span><span style="color:#E1E4E8">) };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> article </span><span style="color:#F97583">=</span><span style="color:#B392F0"> NewsArticle</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        headline</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust 2024 Edition 发布"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        author</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"InfoQ"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, tweet</span><span style="color:#F97583">.</span><span style="color:#B392F0">summarize</span><span style="color:#E1E4E8">());   </span><span style="color:#6A737D">// 用默认实现</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, article</span><span style="color:#F97583">.</span><span style="color:#B392F0">summarize</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 用自己的实现</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 默认实现可以调用同一 trait 中的其他方法——哪怕那些方法没有默认实现。这让 trait 可以提供很多”免费”行为，实现方只需实现少数核心方法。

## 孤儿规则

先理解背景：**Rust 规定，任何 `(类型, Trait)` 组合，全局只能有一份实现**。

为什么？因为调用 `my_vec.summarize()` 时，编译器必须知道”到底执行哪段代码”。如果存在两份实现，编译器无从决断，只能报错。

现在想象一下，如果没有孤儿规则会发生什么：

```text
crate "pretty-print"（某个库）写了：
    impl Display for Vec<i32> {
        fn fmt(...) { print("[1, 2, 3]") }   // 方括号风格
    }

crate "csv-tools"（另一个库）也写了：
    impl Display for Vec<i32> {
        fn fmt(...) { print("1,2,3") }       // 逗号风格
    }

你的项目同时依赖了这两个库，然后你写了：
    println!("{}", vec![1, 2, 3]);
```

Rust 看到了两份 `impl Display for Vec<i32>`，但全局只允许一份——它根本无法编译通过。更糟的是，这个冲突**在你写自己代码的时候才爆出来**，你没有修改任何一个库，却被它们之间的冲突搞崩了。

**孤儿规则的解法**：只有”拥有 `Vec<T>`”或”拥有 `Display`”的 crate 才有资格写这份实现。`Vec<T>` 和 `Display` 都属于标准库，所以只有标准库能写 `impl Display for Vec<T>`。任何第三方库试图写这个实现都会被编译器拒绝——这样冲突就从根本上被消除了。

**规则总结**：`impl Trait for Type` 中，Trait 和 Type 至少有一个必须是你当前 crate 定义的。

用一张表来看，哪些情况允许，哪些不允许：

|  | Trait 是你定义的 | Trait 是外部的（如标准库） |
| --- | --- | --- |
| **Type 是你定义的** | ✅ 两个都是你的，当然可以 | ✅ Type 是你的，允许 |
| **Type 是外部的（如 `Vec<T>`）** | ✅ Trait 是你的，允许 | ❌ 两个都是别人的，不行 |

只有右下角那一格——“Trait 和 Type 都来自外部 crate”——才被禁止。

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0A%2F%2F%20%E2%9D%8C%20Display%EF%BC%88%E5%A4%96%E9%83%A8%EF%BC%89%E5%92%8C%20Vec%3CT%3E%EF%BC%88%E5%A4%96%E9%83%A8%EF%BC%89%E9%83%BD%E4%B8%8D%E6%98%AF%E6%9C%AC%20crate%20%E5%AE%9A%E4%B9%89%E7%9A%84%0Aimpl%3CT%3A%20fmt%3A%3ADisplay%3E%20fmt%3A%3ADisplay%20for%20Vec%3CT%3E%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%5B...%5D%22)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// ❌ Display（外部）和 Vec&lt;T&gt;（外部）都不是本 crate 定义的</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"[...]"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// ❌ Display（外部）和 Vec&lt;T&gt;（外部）都不是本 crate 定义的</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#F97583">:</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">&gt; </span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">T</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"[...]"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

而这些都是合法的：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20MyList(Vec%3Ci32%3E)%3B%20%2F%2F%20MyList%20%E6%98%AF%E6%9C%AC%20crate%20%E5%AE%9A%E4%B9%89%E7%9A%84%0A%0A%2F%2F%20%E2%9C%85%20MyList%20%E6%98%AF%E6%9C%AC%E5%9C%B0%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%B8%BA%E5%AE%83%E5%AE%9E%E7%8E%B0%E5%A4%96%E9%83%A8%E7%9A%84%20Display%0Aimpl%20fmt%3A%3ADisplay%20for%20MyList%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20let%20items%3A%20Vec%3CString%3E%20%3D%20self.0.iter().map(%7Cx%7C%20x.to_string()).collect()%3B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22%5B%7B%7D%5D%22%2C%20items.join(%22%2C%20%22))%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%E8%87%AA%E5%AE%9A%E4%B9%89%20trait%0Atrait%20Describable%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%3B%0A%7D%0A%0A%2F%2F%20%E2%9C%85%20Describable%20%E6%98%AF%E6%9C%AC%E5%9C%B0%20trait%EF%BC%8C%E5%8F%AF%E4%BB%A5%E4%B8%BA%E5%A4%96%E9%83%A8%E7%9A%84%20Vec%3Ci32%3E%20%E5%AE%9E%E7%8E%B0%E5%AE%83%0Aimpl%20Describable%20for%20Vec%3Ci32%3E%20%7B%0A%20%20%20%20fn%20describe(%26self)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%E5%8C%85%E5%90%AB%20%7B%7D%20%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E5%88%97%E8%A1%A8%22%2C%20self.len())%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20list%20%3D%20MyList(vec!%5B1%2C%202%2C%203%5D)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20list)%3B%20%2F%2F%20%5B1%2C%202%2C%203%5D%0A%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20v.describe())%3B%20%2F%2F%20%E5%8C%85%E5%90%AB%203%20%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E5%88%97%E8%A1%A8%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> MyList</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;); </span><span style="color:#6A737D">// MyList 是本 crate 定义的</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// ✅ MyList 是本地类型，可以为它实现外部的 Display</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> MyList</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> items</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">())</span><span style="color:#F97583">.</span><span style="color:#B392F0">collect</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"[{}]"</span><span style="color:#E1E4E8">, items</span><span style="color:#F97583">.</span><span style="color:#B392F0">join</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">", "</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 自定义 trait</span></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Describable</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// ✅ Describable 是本地 trait，可以为外部的 Vec&lt;i32&gt; 实现它</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Describable</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> describe</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"包含 {} 个元素的列表"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> list </span><span style="color:#F97583">=</span><span style="color:#B392F0"> MyList</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, list); </span><span style="color:#6A737D">// [1, 2, 3]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, v</span><span style="color:#F97583">.</span><span style="color:#B392F0">describe</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 包含 3 个元素的列表</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 绕过孤儿规则为外部类型实现外部 trait 的办法是用 Newtype 模式——用一个本地结构体包装外部类型，就像上面的 `MyList` 包装了 `Vec<i32>`。

# 高级特性

## #[derive]：让编译器帮你实现

对于常见的 trait，Rust 提供了 `#[derive]` 属性——只要在类型前加一行，编译器就会自动生成实现：

<div class="code-runner" data-full-code="%23%5Bderive(Debug%2C%20Clone%2C%20PartialEq)%5D%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p1%20%3D%20Point%20%7B%20x%3A%201.0%2C%20y%3A%202.0%20%7D%3B%0A%20%20%20%20let%20p2%20%3D%20p1.clone()%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Clone%20%E8%87%AA%E5%8A%A8%E5%AE%9E%E7%8E%B0%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20p1)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Debug%20%E8%87%AA%E5%8A%A8%E5%AE%9E%E7%8E%B0%0A%20%20%20%20println!(%22%E7%9B%B8%E7%AD%89%3A%20%7B%7D%22%2C%20p1%20%3D%3D%20p2)%3B%20%20%20%2F%2F%20PartialEq%20%E8%87%AA%E5%8A%A8%E5%AE%9E%E7%8E%B0%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Clone</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">PartialEq</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> p1</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();              </span><span style="color:#6A737D">// Clone 自动实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, p1);             </span><span style="color:#6A737D">// Debug 自动实现</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"相等: {}"</span><span style="color:#E1E4E8">, p1 </span><span style="color:#F97583">==</span><span style="color:#E1E4E8"> p2);   </span><span style="color:#6A737D">// PartialEq 自动实现</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

常用的可派生 trait：

| trait | 作用 |
| --- | --- |
| `Debug` | `{:?}` 格式化输出 |
| `Clone` | `.clone()` 深拷贝 |
| `Copy` | 按位复制，赋值不移动所有权 |
| `PartialEq` / `Eq` | `==` 和 `!=` 比较 |
| `PartialOrd` / `Ord` | `<`、`>`、`<=`、`>=` 比较 |
| `Hash` | 可用作 `HashMap` 的键 |
| `Default` | `T::default()` 创建默认值 |

注意表格里没有 `Display`——它**不能派生**，必须手动实现。`Debug` 和 `Display` 是两个很容易混淆的格式化 trait，区别如下：

|  | `Debug` | `Display` |
| --- | --- | --- |
| 格式符 | `{:?}` 或 `{:#?}` | `{}` |
| 面向谁 | 开发者（调试用） | 终端用户（展示用） |
| 能否派生 | ✅ 可以 `#[derive(Debug)]` | ❌ 不能，必须手动写 |
| 输出风格 | 结构化、带字段名 | 自由定义，应简洁易读 |

`Debug` 可以派生是因为它的输出格式是固定的（显示结构体名称和所有字段）；`Display` 不能派生，因为 Rust 不知道你想让用户看到什么，因此没有默认实现，需要用户手动实现——这是业务决策，编译器无法代劳。

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0A%23%5Bderive(Debug)%5D%20%20%20%2F%2F%20Debug%20%E5%8F%AF%E4%BB%A5%E6%B4%BE%E7%94%9F%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0A%2F%2F%20Display%20%E5%BF%85%E9%A1%BB%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%0Aimpl%20fmt%3A%3ADisplay%20for%20Point%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22(%7B%7D%2C%20%7B%7D)%22%2C%20self.x%2C%20self.y)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%201.5%2C%20y%3A%202.0%20%7D%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20p)%3B%20%20%2F%2F%20Debug%EF%BC%9APoint%20%7B%20x%3A%201.5%2C%20y%3A%202.0%20%7D%0A%20%20%20%20println!(%22%7B%3A%23%3F%7D%22%2C%20p)%3B%20%2F%2F%20Debug%20%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%9A%E6%8D%A2%E8%A1%8C%E7%BC%A9%E8%BF%9B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20p)%3B%20%20%20%20%2F%2F%20Display%EF%BC%9A(1.5%2C%202.0)%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]   </span><span style="color:#6A737D">// Debug 可以派生</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// Display 必须手动实现</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"({}, {})"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.5</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, p);  </span><span style="color:#6A737D">// Debug：Point { x: 1.5, y: 2.0 }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#?}"</span><span style="color:#E1E4E8">, p); </span><span style="color:#6A737D">// Debug 美化版：换行缩进</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, p);    </span><span style="color:#6A737D">// Display：(1.5, 2.0)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 运算符重载

`a + b` 实际上是 `a.add(b)` 的语法糖——`+` 运算符对应 `std::ops::Add` trait。你可以为自定义类型定义 `+` 的行为：

<div class="code-runner" data-full-code="use%20std%3A%3Aops%3A%3AAdd%3B%0A%0A%23%5Bderive(Debug%2C%20PartialEq)%5D%0Astruct%20Vec2%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Aimpl%20Add%20for%20Vec2%20%7B%0A%20%20%20%20type%20Output%20%3D%20Vec2%3B%20%2F%2F%20%E5%8A%A0%E6%B3%95%E7%BB%93%E6%9E%9C%E7%9A%84%E7%B1%BB%E5%9E%8B%0A%0A%20%20%20%20fn%20add(self%2C%20other%3A%20Vec2)%20-%3E%20Vec2%20%7B%0A%20%20%20%20%20%20%20%20Vec2%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20x%3A%20self.x%20%2B%20other.x%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20y%3A%20self.y%20%2B%20other.y%2C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20v1%20%3D%20Vec2%20%7B%20x%3A%201.0%2C%20y%3A%202.0%20%7D%3B%0A%20%20%20%20let%20v2%20%3D%20Vec2%20%7B%20x%3A%203.0%2C%20y%3A%204.0%20%7D%3B%0A%20%20%20%20let%20v3%20%3D%20v1%20%2B%20v2%3B%20%2F%2F%20%E8%B0%83%E7%94%A8%E4%BA%86%E6%88%91%E4%BB%AC%E5%AE%9E%E7%8E%B0%E7%9A%84%20add%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20v3)%3B%20%2F%2F%20Vec2%20%7B%20x%3A%204.0%2C%20y%3A%206.0%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">ops</span><span style="color:#F97583">::</span><span style="color:#B392F0">Add</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">PartialEq</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Add</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 加法结果的类型</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, other</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        Vec2</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">            x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x,</span></span>
<span class="line"><span style="color:#E1E4E8">            y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> other</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y,</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 1.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 2.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v2 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec2</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3.0</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 4.0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v3 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> v1 </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> v2; </span><span style="color:#6A737D">// 调用了我们实现的 add</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, v3); </span><span style="color:#6A737D">// Vec2 { x: 4.0, y: 6.0 }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`std::ops` 模块里定义了所有可重载运算符对应的 trait：`Add`、`Sub`、`Mul`、`Div`、`Neg`、`Index` 等。运算符重载的本质就是为这些 trait 提供实现。

## 父 Trait

Rust 没有继承，但 trait 可以**要求实现者同时实现另一个 trait**——这个被依赖的 trait 称为”父 trait”：

<div class="code-runner" data-full-code="trait%20Person%20%7B%0A%20%20%20%20fn%20name(%26self)%20-%3E%20String%3B%0A%7D%0A%0A%2F%2F%20%E5%AE%9E%E7%8E%B0%20Student%20%E5%89%8D%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%85%88%E5%AE%9E%E7%8E%B0%20Person%0Atrait%20Student%3A%20Person%20%7B%0A%20%20%20%20fn%20university(%26self)%20-%3E%20String%3B%0A%7D%0A%0Atrait%20Programmer%20%7B%0A%20%20%20%20fn%20fav_language(%26self)%20-%3E%20String%3B%0A%7D%0A%0A%2F%2F%20%E5%90%8C%E6%97%B6%E4%BE%9D%E8%B5%96%E5%A4%9A%E4%B8%AA%E7%88%B6%20trait%0Atrait%20CompSciStudent%3A%20Programmer%20%2B%20Student%20%7B%0A%20%20%20%20fn%20git_username(%26self)%20-%3E%20String%3B%0A%7D%0A%0Astruct%20Alice%20%7B%0A%20%20%20%20name%3A%20String%2C%0A%7D%0A%0Aimpl%20Person%20for%20Alice%20%7B%0A%20%20%20%20fn%20name(%26self)%20-%3E%20String%20%7B%20self.name.clone()%20%7D%0A%7D%0A%0Aimpl%20Student%20for%20Alice%20%7B%0A%20%20%20%20fn%20university(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%22)%20%7D%0A%7D%0A%0Aimpl%20Programmer%20for%20Alice%20%7B%0A%20%20%20%20fn%20fav_language(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22Rust%22)%20%7D%0A%7D%0A%0Aimpl%20CompSciStudent%20for%20Alice%20%7B%0A%20%20%20%20fn%20git_username(%26self)%20-%3E%20String%20%7B%20String%3A%3Afrom(%22alice-dev%22)%20%7D%0A%7D%0A%0Afn%20greet(s%3A%20%26dyn%20CompSciStudent)%20%7B%0A%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%E6%88%91%E6%98%AF%20%7B%7D%EF%BC%8C%E5%B0%B1%E8%AF%BB%E4%BA%8E%20%7B%7D%EF%BC%8C%E6%9C%80%E7%88%B1%20%7B%7D%EF%BC%8CGitHub%EF%BC%9A%7B%7D%22%2C%0A%20%20%20%20%20%20%20%20s.name()%2C%20s.university()%2C%20s.fav_language()%2C%20s.git_username())%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20alice%20%3D%20Alice%20%7B%20name%3A%20String%3A%3Afrom(%22Alice%22)%20%7D%3B%0A%20%20%20%20greet(%26alice)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> name</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 实现 Student 前，必须先实现 Person</span></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Student</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> university</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Programmer</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fav_language</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 同时依赖多个父 trait</span></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> CompSciStudent</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Programmer</span><span style="color:#F97583"> +</span><span style="color:#B392F0"> Student</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> git_username</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Person</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> name</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">name</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Student</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> university</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"清华大学"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Programmer</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fav_language</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> CompSciStudent</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> git_username</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"alice-dev"</span><span style="color:#E1E4E8">) }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> greet</span><span style="color:#E1E4E8">(s</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;dyn</span><span style="color:#B392F0"> CompSciStudent</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，我是 {}，就读于 {}，最爱 {}，GitHub：{}"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        s</span><span style="color:#F97583">.</span><span style="color:#B392F0">name</span><span style="color:#E1E4E8">(), s</span><span style="color:#F97583">.</span><span style="color:#B392F0">university</span><span style="color:#E1E4E8">(), s</span><span style="color:#F97583">.</span><span style="color:#B392F0">fav_language</span><span style="color:#E1E4E8">(), s</span><span style="color:#F97583">.</span><span style="color:#B392F0">git_username</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> alice </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Alice</span><span style="color:#E1E4E8"> { name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">) };</span></span>
<span class="line"><span style="color:#B392F0">    greet</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">alice);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

父 trait 是”前提条件”：想实现 `CompSciStudent`，你得先满足 `Programmer` 和 `Student` 的要求；而 `Student` 又要求先满足 `Person`。编译器会强制检查这条链上所有 trait 都有实现（但编码没有顺序要求）。

## 消除方法歧义

一个类型可以实现多个 trait，如果两个 trait 中有同名方法，直接调用会出现歧义：

<div class="code-runner" data-full-code="trait%20UsernameWidget%20%7B%0A%20%20%20%20fn%20get(%26self)%20-%3E%20String%3B%0A%7D%0A%0Atrait%20AgeWidget%20%7B%0A%20%20%20%20fn%20get(%26self)%20-%3E%20u8%3B%0A%7D%0A%0Astruct%20Form%20%7B%0A%20%20%20%20username%3A%20String%2C%0A%20%20%20%20age%3A%20u8%2C%0A%7D%0A%0Aimpl%20UsernameWidget%20for%20Form%20%7B%0A%20%20%20%20fn%20get(%26self)%20-%3E%20String%20%7B%20self.username.clone()%20%7D%0A%7D%0A%0Aimpl%20AgeWidget%20for%20Form%20%7B%0A%20%20%20%20fn%20get(%26self)%20-%3E%20u8%20%7B%20self.age%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20form%20%3D%20Form%20%7B%20username%3A%20String%3A%3Afrom(%22rustacean%22)%2C%20age%3A%2028%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20form.get())%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%E6%9C%89%E5%A4%9A%E4%B8%AA%20get%20%E6%96%B9%E6%B3%95%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">username</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">age }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> form </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rustacean"</span><span style="color:#E1E4E8">), age</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 28</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, form</span><span style="color:#F97583">.</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">// 错误！有多个 get 方法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

用**完全限定语法**（Fully Qualified Syntax）消除歧义：

<div class="code-runner" data-full-code="trait%20UsernameWidget%20%7B%20fn%20get(%26self)%20-%3E%20String%3B%20%7D%0Atrait%20AgeWidget%20%7B%20fn%20get(%26self)%20-%3E%20u8%3B%20%7D%0Astruct%20Form%20%7B%20username%3A%20String%2C%20age%3A%20u8%20%7D%0Aimpl%20UsernameWidget%20for%20Form%20%7B%20fn%20get(%26self)%20-%3E%20String%20%7B%20self.username.clone()%20%7D%20%7D%0Aimpl%20AgeWidget%20for%20Form%20%7B%20fn%20get(%26self)%20-%3E%20u8%20%7B%20self.age%20%7D%20%7D%0Afn%20main()%20%7B%0A%20%20%20%20let%20form%20%3D%20Form%20%7B%20username%3A%20String%3A%3Afrom(%22rustacean%22)%2C%20age%3A%2028%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20%3C%E7%B1%BB%E5%9E%8B%20as%20Trait%E5%90%8D%3E%3A%3A%E6%96%B9%E6%B3%95%E5%90%8D(%E5%8F%82%E6%95%B0)%0A%20%20%20%20let%20username%20%3D%20%3CForm%20as%20UsernameWidget%3E%3A%3Aget(%26form)%3B%0A%20%20%20%20let%20age%20%20%20%20%20%20%3D%20%3CForm%20as%20AgeWidget%3E%3A%3Aget(%26form)%3B%0A%0A%20%20%20%20println!(%22%E7%94%A8%E6%88%B7%E5%90%8D%3A%20%7B%7D%22%2C%20username)%3B%0A%20%20%20%20println!(%22%E5%B9%B4%E9%BE%84%3A%20%7B%7D%22%2C%20age)%3B%0A%7D" data-has-hidden="true" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> form </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rustacean"</span><span style="color:#E1E4E8">), age</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 28</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // &lt;类型 as Trait名&gt;::方法名(参数)</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> username </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> &lt;</span><span style="color:#B392F0">Form</span><span style="color:#F97583"> as</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#E1E4E8">&gt;</span><span style="color:#F97583">::</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">form);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> age      </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> &lt;</span><span style="color:#B392F0">Form</span><span style="color:#F97583"> as</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#E1E4E8">&gt;</span><span style="color:#F97583">::</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">form);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户名: {}"</span><span style="color:#E1E4E8">, username);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄: {}"</span><span style="color:#E1E4E8">, age);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, age</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">username</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">() } }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8"> { </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">age } }</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> form </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Form</span><span style="color:#E1E4E8"> { username</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"rustacean"</span><span style="color:#E1E4E8">), age</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 28</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // &lt;类型 as Trait名&gt;::方法名(参数)</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> username </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> &lt;</span><span style="color:#B392F0">Form</span><span style="color:#F97583"> as</span><span style="color:#B392F0"> UsernameWidget</span><span style="color:#E1E4E8">&gt;</span><span style="color:#F97583">::</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">form);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> age      </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> &lt;</span><span style="color:#B392F0">Form</span><span style="color:#F97583"> as</span><span style="color:#B392F0"> AgeWidget</span><span style="color:#E1E4E8">&gt;</span><span style="color:#F97583">::</span><span style="color:#B392F0">get</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">form);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户名: {}"</span><span style="color:#E1E4E8">, username);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"年龄: {}"</span><span style="color:#E1E4E8">, age);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

# 练习题

## Trait 基础测验

加载题目中…

```rust
trait Greet {
    fn greeting(&self) -> String {
        String::from("你好！")
    }
    fn name(&self) -> String;
}

struct Bob;

impl Greet for Bob {
    fn name(&self) -> String {
        String::from("Bob")
    }
}
```

加载题目中…

加载题目中…

## 高级特性测验

```rust
#[derive(Debug, Clone, PartialEq)]
struct Color(u8, u8, u8);
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面定义了一个 `Greet` trait，请为 `Chinese` 和 `English` 两种问候方式实现它，使 `main` 能正确运行。

```rust
trait Greet {
    fn hello(&self) -> String;
    fn goodbye(&self) -> String;

    fn greet_and_leave(&self) {
        println!("{}", self.hello());
        println!("{}", self.goodbye());
    }
}

struct Chinese;
struct English;

// TODO: 为 Chinese 实现 Greet
//   hello   → "你好！"
//   goodbye → "再见！"

// TODO: 为 English 实现 Greet
//   hello   → "Hello!"
//   goodbye → "Goodbye!"

fn main() {
    let zh = Chinese;
    let en = English;

    zh.greet_and_leave();
    en.greet_and_leave();
}
```