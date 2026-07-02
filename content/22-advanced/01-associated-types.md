# 从问题出发

## 需求：输出类型随实现者变化

假设你在写三种”转换器”，它们都接受一个 `i32`，但输出不同：

| 转换器 | 输入 | 输出 | 输出类型 |
| --- | --- | --- | --- |
| `Double` | `5` | `10` | `i32` |
| `Stringify` | `5` | `"5"` | `String` |
| `IsEven` | `5` | `false` | `bool` |

三种都是”转换器”，你想用一个 trait 统一表达这个概念：

```rust
trait Converter {
    fn convert(&self, input: i32) -> ???; // 输出类型怎么写？
}
```

问题来了：`Double` 输出 `i32`，`Stringify` 输出 `String`，`IsEven` 输出 `bool`——没法写死一个具体类型。

## 第一次尝试：impl Trait

你刚学过 `impl Trait` 可以让返回类型灵活，试一下：

<div class="code-runner" data-full-code="trait%20Converter%20%7B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20impl%20std%3A%3Afmt%3A%3ADisplay%3B%20%2F%2F%20%E2%9D%8C%0A%7D%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// ❌</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// ❌</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

报错了。`impl Trait` 可以用在**普通函数**的返回值位置，但 **trait 方法里不允许**这样写。这条路走不通。并且这里只能返回 Display，但我们希望输出的是类型，所以也不满足需求。

## 第二次尝试：泛型参数

你也学过泛型，把输出类型变成类型参数 `Output`：

<div class="code-runner" data-full-code="trait%20Converter%3COutput%3E%20%7B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Output%3B%0A%7D%0A%0Astruct%20Double%3B%0Astruct%20Stringify%3B%0A%0Aimpl%20Converter%3Ci32%3E%20for%20Double%20%7B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%0A%7D%0A%0Aimpl%20Converter%3CString%3E%20for%20Stringify%20%7B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20String%20%7B%20input.to_string()%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Double.convert(5))%3B%20%20%20%20%2F%2F%2010%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Stringify.convert(5))%3B%20%2F%2F%205%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { input</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));    </span><span style="color:#6A737D">// 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Stringify</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 5</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

能运行！但藏着一个语义问题。

## 泛型参数的语义问题

用 `Converter<Output>` 时，`Output` 是**外部传入的**——这意味着调用方可以随意决定 `Output` 是什么。没有任何东西阻止你为同一个 `Double` 实现两个版本：

<div class="code-runner" data-full-code="trait%20Converter%3COutput%3E%20%7B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Output%3B%20%7D%0Astruct%20Double%3B%0Aimpl%20Converter%3Ci32%3E%20for%20Double%20%7B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%20%7D%0A%0A%2F%2F%20%E5%AE%8C%E5%85%A8%E5%90%88%E6%B3%95%E2%80%94%E2%80%94Double%20%E7%8E%B0%E5%9C%A8%E5%8F%88%E5%A4%9A%E4%BA%86%E4%B8%80%E4%B8%AA%20String%20%E7%89%88%E6%9C%AC%0Aimpl%20Converter%3CString%3E%20for%20Double%20%7B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20String%20%7B%0A%20%20%20%20%20%20%20%20format!(%22%E7%BB%93%E6%9E%9C%E6%98%AF%20%7B%7D%22%2C%20input%20*%202)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20n%3A%20i32%20%3D%20Double.convert(5)%3B%20%20%20%20%2F%2F%2010%0A%20%20%20%20let%20s%3A%20String%20%3D%20Double.convert(5)%3B%20%2F%2F%20%E7%BB%93%E6%9E%9C%E6%98%AF%2010%0A%20%20%20%20println!(%22%7B%7D%22%2C%20n)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%0A%7D" data-has-hidden="true" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"></span>
<span class="line"><span style="color:#6A737D">// 完全合法——Double 现在又多了一个 String 版本</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果是 {}"</span><span style="color:#E1E4E8">, input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 10</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 结果是 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, n);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">&gt; { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 完全合法——Double 现在又多了一个 String 版本</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果是 {}"</span><span style="color:#E1E4E8">, input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 10</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 结果是 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, n);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

同一个 `Double`，既能输出 `i32`，又能输出 `String`。**但一个”翻倍转换器”在逻辑上只应该有一种输出**——这个设计允许了不该允许的事。

## 调用时还要手动指定 Output 的问题

更头疼的是，当你想写一个通用函数”运行任意转换器并打印结果”时：

<div class="code-runner" data-full-code="trait%20Converter%3COutput%3E%20%7B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Output%3B%20%7D%0Astruct%20Double%3B%0Aimpl%20Converter%3Ci32%3E%20for%20Double%20%7B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%20%7D%0Ause%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Afn%20run%3CC%2C%20Output%3E(c%3A%20C%2C%20input%3A%20i32)%0Awhere%0A%20%20%20%20C%3A%20Converter%3COutput%3E%2C%0A%20%20%20%20Output%3A%20Display%2C%0A%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20c.convert(input))%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20run%3A%3A%3CDouble%2C%20i32%3E(Double%2C%205)%3B%20%2F%2F%20%E5%BF%85%E9%A1%BB%E6%89%8B%E5%8A%A8%E7%94%A8%20turbofish%20%E6%8C%87%E5%AE%9A%20Output%20%3D%20i32%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">&gt; { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">C</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">&gt;(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> C</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">where</span></span>
<span class="line"><span style="color:#B392F0">    C</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">&gt;,</span></span>
<span class="line"><span style="color:#B392F0">    Output</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(input));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Double</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt;(</span><span style="color:#B392F0">Double</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 必须手动用 turbofish 指定 Output = i32</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

代码能运行，但看调用那行：

```rust
impl Converter<i32> for Double { ... }  // 这里已经写了：Double 的输出是 i32
run::<Double, i32>(Double, 5);          // 这里又写了一遍：i32
```

同一个 `i32` 出现了两次。第一次是 `Double` 的实现里写死的，第二次是调用方在 turbofish 里手动再指定一遍。

编译器本来可以从 `impl Converter<i32> for Double` 这行自己推出 `Output = i32`，但用泛型参数 `Converter<Output>` 时，`Output` 是”外部参数”，由调用方决定，编译器不敢自作主张——所以它要求你再写一遍。

## 问题归纳

总结一下，`trait Converter<Output>` 的泛型参数方案有两个问题：

1. 语义不匹配 ：允许同一个类型对同一个 trait 实现多次（不同的 Output ）——但”翻倍转换器”在逻辑上只应该有一种输出，泛型参数无法在语言层面阻止你意外添加第二种实现
1. 调用繁琐 ：通用函数需要多一个类型参数 Output ，调用时还要手动用 turbofish 再写一遍已经在实现里指定过的类型

这两个问题都源于同一根源：泛型参数把 `Output` 当成”调用方传入的信息”，而不是”实现者自己的信息”。这正是泛型参数方案的根本缺陷，而**关联类型**就是专门为此设计的解决方案。

# 关联类型：把输出类型绑定到实现者

问题的根源在于：用泛型参数时，输出类型是”外部信息”，任何人都能指定。但它本应是”内部信息”，由每个实现者自己锁定，外部无权干涉。

**关联类型**就是为此而设计的——在 trait 里留一个”类型槽”，由每个实现者填入，填完就锁死：

```rust
trait Converter {
    type Output;                                   // 声明一个类型槽
    fn convert(&self, input: i32) -> Self::Output; // 方法返回这个槽里的类型
}
```

语法只有两个新东西：

- `type Output;` — 声明类型槽，名字叫 Output ，具体是什么类型留给实现者填
- `Self::Output` — 引用这个槽（ Self 是”当前这个实现者”， Self::Output 就是”它填入的类型”）

实现时，在 `impl` 块里用 `type Output = 具体类型` 填入。写法和泛型版本差不多，优势体现在两件事上——编译器能保证每个类型只有一种实现，以及调用通用函数时不再需要 turbofish。先看实现：

<div class="code-runner" data-full-code="trait%20Converter%20%7B%0A%20%20%20%20type%20Output%3B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Self%3A%3AOutput%3B%0A%7D%0A%0Astruct%20Double%3B%0Astruct%20Stringify%3B%0Astruct%20IsEven%3B%0A%0Aimpl%20Converter%20for%20Double%20%7B%0A%20%20%20%20type%20Output%20%3D%20i32%3B%20%20%20%20%2F%2F%20Double%20%E5%A1%AB%E5%85%A5%EF%BC%9A%E8%BE%93%E5%87%BA%E6%98%AF%20i32%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%0A%7D%0A%0Aimpl%20Converter%20for%20Stringify%20%7B%0A%20%20%20%20type%20Output%20%3D%20String%3B%20%2F%2F%20Stringify%20%E5%A1%AB%E5%85%A5%EF%BC%9A%E8%BE%93%E5%87%BA%E6%98%AF%20String%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20String%20%7B%20input.to_string()%20%7D%0A%7D%0A%0Aimpl%20Converter%20for%20IsEven%20%7B%0A%20%20%20%20type%20Output%20%3D%20bool%3B%20%20%20%2F%2F%20IsEven%20%E5%A1%AB%E5%85%A5%EF%BC%9A%E8%BE%93%E5%87%BA%E6%98%AF%20bool%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20bool%20%7B%20input%20%25%202%20%3D%3D%200%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Double.convert(5))%3B%20%20%20%20%2F%2F%2010%0A%20%20%20%20println!(%22%7B%7D%22%2C%20Stringify.convert(5))%3B%20%2F%2F%205%0A%20%20%20%20println!(%22%7B%7D%22%2C%20IsEven.convert(4))%3B%20%20%20%20%2F%2F%20true%0A%20%20%20%20println!(%22%7B%7D%22%2C%20IsEven.convert(5))%3B%20%20%20%20%2F%2F%20false%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> IsEven</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;    </span><span style="color:#6A737D">// Double 填入：输出是 i32</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// Stringify 填入：输出是 String</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { input</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> IsEven</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">;   </span><span style="color:#6A737D">// IsEven 填入：输出是 bool</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Double</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));    </span><span style="color:#6A737D">// 10</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Stringify</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 5</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">IsEven</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">));    </span><span style="color:#6A737D">// true</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">IsEven</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));    </span><span style="color:#6A737D">// false</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

现在尝试为 `Double` 再实现一次不同的输出——编译器直接拒绝：

<div class="code-runner" data-full-code="trait%20Converter%20%7B%20type%20Output%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Self%3A%3AOutput%3B%20%7D%0Astruct%20Double%3B%0Aimpl%20Converter%20for%20Double%20%7B%20type%20Output%20%3D%20i32%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%20%7D%0A%0Aimpl%20Converter%20for%20Double%20%7B%20%20%20%20%20%20%20%20%2F%2F%20%E2%9D%8C%20Double%20%E5%B7%B2%E7%BB%8F%E5%AE%9E%E7%8E%B0%E4%BA%86%20Converter%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%86%8D%E5%AE%9E%E7%8E%B0%E4%B8%80%E6%AC%A1%0A%20%20%20%20type%20Output%20%3D%20String%3B%0A%20%20%20%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20String%20%7B%20input.to_string()%20%7D%0A%7D%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {        </span><span style="color:#6A737D">// ❌ Double 已经实现了 Converter，不能再实现一次</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { input</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> {        </span><span style="color:#6A737D">// ❌ Double 已经实现了 Converter，不能再实现一次</span></span>
<span class="line"><span style="color:#F97583">    type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { input</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

关联类型从语言层面保证了”一个类型对一个 trait 只有一种实现”，语义正确。

## 在泛型函数里使用

### 引用关联类型：C::Output

关联类型有名字，所以在泛型函数里可以用 `类型::关联类型名` 来引用它。

比如 `C::Output` 的意思是：“C 这个类型，它填入的 Output 类型是什么”。

来看之前那个通用函数，现在用关联类型写：

先看不加任何约束会怎样：

<div class="code-runner" data-full-code="trait%20Converter%20%7B%20type%20Output%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Self%3A%3AOutput%3B%20%7D%0Astruct%20Double%3B%0Aimpl%20Converter%20for%20Double%20%7B%20type%20Output%20%3D%20i32%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%20%7D%0A%0Afn%20run%3CC%3A%20Converter%3E(c%3A%20C%2C%20input%3A%20i32)%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20c.convert(input))%3B%20%2F%2F%20%E2%9D%8C%20%E4%B8%8D%E7%9F%A5%E9%81%93%20Output%20%E6%9C%89%E6%B2%A1%E6%9C%89%E5%AE%9E%E7%8E%B0%20Display%0A%7D%0Afn%20main()%20%7B%7D" data-has-hidden="true" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">C</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&gt;(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> C</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(input)); </span><span style="color:#6A737D">// ❌ 不知道 Output 有没有实现 Display</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">C</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">&gt;(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> C</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(input)); </span><span style="color:#6A737D">// ❌ 不知道 Output 有没有实现 Display</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {}</span></span></div></div>

`c.convert(input)` 返回的是”C 填入的 Output 类型”，但我们没说它能打印，所以报错。

加上约束——用 `C::Output: Display` 告诉编译器”C 的 Output 必须实现 Display”：

<div class="code-runner" data-full-code="trait%20Converter%20%7B%20type%20Output%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20Self%3A%3AOutput%3B%20%7D%0Astruct%20Double%3B%20struct%20Stringify%3B%20struct%20IsEven%3B%0Aimpl%20Converter%20for%20Double%20%7B%20type%20Output%20%3D%20i32%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20i32%20%7B%20input%20*%202%20%7D%20%7D%0Aimpl%20Converter%20for%20Stringify%20%7B%20type%20Output%20%3D%20String%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20String%20%7B%20input.to_string()%20%7D%20%7D%0Aimpl%20Converter%20for%20IsEven%20%7B%20type%20Output%20%3D%20bool%3B%20fn%20convert(%26self%2C%20input%3A%20i32)%20-%3E%20bool%20%7B%20input%20%25%202%20%3D%3D%200%20%7D%20%7D%0Ause%20std%3A%3Afmt%3A%3ADisplay%3B%0A%0Afn%20run%3CC%3E(c%3A%20C%2C%20input%3A%20i32)%0Awhere%0A%20%20%20%20C%3A%20Converter%2C%0A%20%20%20%20C%3A%3AOutput%3A%20Display%2C%20%2F%2F%20C%20%E8%87%AA%E5%B7%B1%E5%A1%AB%E7%9A%84%20Output%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%AE%9E%E7%8E%B0%20Display%0A%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20c.convert(input))%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20run(Double%2C%205)%3B%20%20%20%20%2F%2F%2010%20%20%20%E2%80%94%20Double%3A%3AOutput%20%3D%20i32%EF%BC%8Ci32%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%20%E2%9C%85%0A%20%20%20%20run(Stringify%2C%205)%3B%20%2F%2F%205%20%20%20%20%E2%80%94%20Stringify%3A%3AOutput%20%3D%20String%EF%BC%8CString%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%20%E2%9C%85%0A%20%20%20%20run(IsEven%2C%204)%3B%20%20%20%20%2F%2F%20true%20%E2%80%94%20IsEven%3A%3AOutput%20%3D%20bool%EF%BC%8Cbool%20%E5%AE%9E%E7%8E%B0%E4%BA%86%20Display%20%E2%9C%85%0A%20%20%20%20%2F%2F%20%E8%B0%83%E7%94%A8%E6%97%B6%E4%B8%8D%E9%9C%80%E8%A6%81%E6%8C%87%E5%AE%9A%20Output%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E4%BB%8E%E5%90%84%E8%87%AA%E7%9A%84%E5%AE%9E%E7%8E%B0%E9%87%8C%E8%87%AA%E5%8A%A8%E6%8E%A8%E5%AF%BC%0A%7D" data-has-hidden="true" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">C</span><span style="color:#E1E4E8">&gt;(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> C</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">where</span></span>
<span class="line"><span style="color:#B392F0">    C</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    C</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D">// C 自己填的 Output，必须实现 Display</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(input));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Double</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 10   — Double::Output = i32，i32 实现了 Display ✅</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Stringify</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 5    — Stringify::Output = String，String 实现了 Display ✅</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">IsEven</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// true — IsEven::Output = bool，bool 实现了 Display ✅</span></span>
<span class="line"><span style="color:#6A737D">    // 调用时不需要指定 Output，编译器从各自的实现里自动推导</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#F97583">trait</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#79B8FF"> Self</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">struct</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">struct</span><span style="color:#B392F0"> IsEven</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Double</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Stringify</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> { input</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() } }</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> Converter</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> IsEven</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">type</span><span style="color:#B392F0"> Output</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">fn</span><span style="color:#B392F0"> convert</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> { input </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> } }</span></span>
<span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#B392F0">fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> run</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">C</span><span style="color:#E1E4E8">&gt;(c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> C</span><span style="color:#E1E4E8">, input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">where</span></span>
<span class="line"><span style="color:#B392F0">    C</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Converter</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    C</span><span style="color:#F97583">::</span><span style="color:#B392F0">Output</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Display</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D">// C 自己填的 Output，必须实现 Display</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c</span><span style="color:#F97583">.</span><span style="color:#B392F0">convert</span><span style="color:#E1E4E8">(input));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Double</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// 10   — Double::Output = i32，i32 实现了 Display ✅</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Stringify</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 5    — Stringify::Output = String，String 实现了 Display ✅</span></span>
<span class="line"><span style="color:#B392F0">    run</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">IsEven</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// true — IsEven::Output = bool，bool 实现了 Display ✅</span></span>
<span class="line"><span style="color:#6A737D">    // 调用时不需要指定 Output，编译器从各自的实现里自动推导</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

对比之前泛型参数的版本：

|  | 泛型参数 `Converter<Output>` | 关联类型 `Converter { type Output }` |
| --- | --- | --- |
| Output 由谁决定 | 调用方 | 实现者 |
| 同一类型能实现几次 | 可以多次（不同 Output） | 只能一次 |
| 通用函数需要几个类型参数 | `fn run<C, Output>` | `fn run<C>` |
| 函数调用 | `run::<Double, i32>(...)` | `run(Double, ...)` |

### 你已经用过它了

`for x in vec![1, 2, 3]` 里，Rust 怎么知道 `x` 是 `i32`？

因为 `Vec<i32>` 实现了 `Iterator` trait，而 `Iterator` 里就有一个关联类型 `Item`：

```rust
// Iterator trait 的定义（简化）
trait Iterator {
    type Item;                                 // 每次迭代产出的元素类型
    fn next(&mut self) -> Option<Self::Item>;  // 取下一个元素
}

// Vec<i32> 的实现
// impl Iterator for ... {
//     type Item = i32;  ← 这就是 x 得到 i32 类型的原因
//     ...
// }
```

`type Item = i32` 这行告诉编译器 `for x in vec` 里每个 `x` 是 `i32`。迭代器的详细用法在后续章节讲，现在你知道了：那个 `Item` 就是一个关联类型。

# 练习题

## 关联类型测验

加载题目中…

```rust
trait Converter {
    type Output;
    fn convert(&self, input: i32) -> Self::Output;
}

struct IsEven;
impl Converter for IsEven {
    type Output = bool;
    fn convert(&self, input: i32) -> bool { input % 2 == 0 }
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

实现两种”格式化器”，它们都接受一个 `i32`，但输出类型不同：

```rust
trait Formatter {
    type Result;
    fn format(&self, value: i32) -> Self::Result;
}

// NumberFormatter：返回 value * 2 的数字（i32）
struct NumberFormatter;

// LabelFormatter：返回 "值: {value}" 格式的字符串（String）
struct LabelFormatter;

// TODO: 为两者实现 Formatter trait

fn main() {
    println!("{}", NumberFormatter.format(21)); // 42
    println!("值: {}", LabelFormatter.format(42));  // 值: 42
}
```