# 闭包语法

## 什么是闭包

闭包是一种可以**像变量一样存储**、**像函数一样调用**的代码块。和普通函数最大的区别是：闭包可以捕获它定义时所在作用域中的变量。

先看一个最简单的对比：

<div class="code-runner" data-full-code="fn%20add_one_fn(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20x%20%2B%201%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%EF%BC%9A%E5%AE%9A%E4%B9%89%E5%A5%BD%E4%B9%8B%E5%90%8E%E9%80%9A%E8%BF%87%E5%90%8D%E5%AD%97%E8%B0%83%E7%94%A8%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add_one_fn(5))%3B%0A%0A%20%20%20%20%2F%2F%20%E9%97%AD%E5%8C%85%EF%BC%9A%E5%AD%98%E5%82%A8%E5%9C%A8%E5%8F%98%E9%87%8F%E9%87%8C%EF%BC%8C%E5%83%8F%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E4%B8%80%E6%A0%B7%E4%BD%BF%E7%94%A8%0A%20%20%20%20let%20add_one%20%3D%20%7Cx%7C%20x%20%2B%201%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add_one(5))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add_one_fn</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 普通函数：定义好之后通过名字调用</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_one_fn</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 闭包：存储在变量里，像调用函数一样使用</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add_one </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_one</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 语法结构

闭包用一对竖线 `|` 包围参数，后跟函数体：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E9%80%9A%E5%B8%B8%E4%B8%8D%E9%9C%80%E8%A6%81%E7%B1%BB%E5%9E%8B%E6%A0%87%E6%B3%A8%EF%BC%8C%E7%BC%96%E8%AF%91%E5%99%A8%E8%83%BD%E6%8E%A8%E6%96%AD%0A%20%20%20%20let%20add%20%3D%20%7Cx%2C%20y%7C%20x%20%2B%20y%3B%0A%0A%20%20%20%20%2F%2F%20%E6%97%A0%E5%8F%82%E6%95%B0%0A%20%20%20%20let%20greet%20%3D%20%7C%7C%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%A4%9A%E8%A1%8C%E9%9C%80%E8%A6%81%E5%A4%A7%E6%8B%AC%E5%8F%B7%0A%20%20%20%20let%20process%20%3D%20%7Cx%3A%20i32%7C%20%7B%0A%20%20%20%20%20%20%20%20let%20doubled%20%3D%20x%20*%202%3B%0A%20%20%20%20%20%20%20%20doubled%20%2B%201%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add(3%2C%204))%3B%0A%20%20%20%20greet()%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20process(5))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 通常不需要类型标注，编译器能推断</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> add </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x, y</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 无参数</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> greet </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 多行需要大括号</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> process </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> doubled </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        doubled </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    greet</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">process</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

把各种写法并排对比，看它们有多相似：

```rust
fn  add_v1   (x: i32, y: i32) -> i32 { x + y }  // 普通函数
let add_v2 = |x: i32, y: i32| -> i32 { x + y };  // 完整闭包标注
let add_v3 = |x, y|                  { x + y };  // 省略类型
let add_v4 = |x, y|                    x + y  ;  // 省略大括号
```

## 类型一旦推断就固定

闭包的参数类型通过第一次调用来推断，之后就固定了——不能再用不同类型调用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20identity%20%3D%20%7Cx%7C%20x%3B%0A%0A%20%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E8%B0%83%E7%94%A8%EF%BC%9A%E7%BC%96%E8%AF%91%E5%99%A8%E6%8E%A8%E6%96%AD%20x%20%E4%B8%BA%20String%0A%20%20%20%20let%20_s%20%3D%20identity(String%3A%3Afrom(%22hello%22))%3B%0A%0A%20%20%20%20%2F%2F%20%E7%B1%BB%E5%9E%8B%E5%B7%B2%E9%94%81%E5%AE%9A%E4%B8%BA%20String%EF%BC%8C%E4%BC%A0%20i32%20%E6%8A%A5%E9%94%99%0A%20%20%20%20let%20_n%20%3D%20identity(5)%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> identity </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 第一次调用：编译器推断 x 为 String</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> _s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> identity</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 类型已锁定为 String，传 i32 报错</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> _n </span><span style="color:#F97583">=</span><span style="color:#B392F0"> identity</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 闭包能做函数做不到的事

普通函数不能访问外部作用域的变量，闭包可以：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20threshold%20%3D%2010%3B%0A%0A%20%20%20%20%2F%2F%20%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%EF%BC%9A%E6%97%A0%E6%B3%95%E8%AE%BF%E9%97%AE%E5%A4%96%E9%83%A8%E7%9A%84%20threshold%0A%20%20%20%20fn%20is_big(x%3A%20i32)%20-%3E%20bool%20%7B%0A%20%20%20%20%20%20%20%20x%20%3E%20threshold%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%0A%20%20%20%20%7D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> threshold </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 普通函数：无法访问外部的 threshold</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> is_big</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        x </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> threshold  </span><span style="color:#6A737D">// 错误！</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20threshold%20%3D%2010%3B%0A%0A%20%20%20%20%2F%2F%20%E9%97%AD%E5%8C%85%EF%BC%9A%E8%83%BD%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%E5%90%8C%E4%B8%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%87%8C%E7%9A%84%E5%8F%98%E9%87%8F%0A%20%20%20%20let%20is_big%20%3D%20%7Cx%7C%20x%20%3E%20threshold%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20is_big(5))%3B%20%20%20%2F%2F%20false%0A%20%20%20%20println!(%22%7B%7D%22%2C%20is_big(15))%3B%20%20%2F%2F%20true%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> threshold </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 闭包：能直接使用同一作用域里的变量</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> is_big </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> threshold;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">is_big</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// false</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">is_big</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">15</span><span style="color:#E1E4E8">));  </span><span style="color:#6A737D">// true</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

这就是闭包最核心的能力——**捕获环境**。

## 主要应用场景

闭包最常见的用途——把”某个操作”作为参数传进去，让函数决定何时调用：

<div class="code-runner" data-full-code="%2F%2F%20apply%20%E6%8E%A5%E5%8F%97%E4%B8%80%E4%B8%AA%E5%80%BC%E5%92%8C%E4%B8%80%E4%B8%AA%22%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%AE%83%22%E7%9A%84%E9%97%AD%E5%8C%85%0Afn%20apply(x%3A%20i32%2C%20f%3A%20impl%20Fn(i32)%20-%3E%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20f(x)%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply(5%2C%20%7Cx%7C%20x%20*%202))%3B%20%20%20%20%20%20%20%2F%2F%2010%EF%BC%8C%E4%B9%98%E4%BB%A5%202%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply(5%2C%20%7Cx%7C%20x%20%2B%20100))%3B%20%20%20%20%20%2F%2F%20105%EF%BC%8C%E5%8A%A0%20100%0A%20%20%20%20println!(%22%7B%7D%22%2C%20apply(5%2C%20%7Cx%7C%20x%20*%20x))%3B%20%20%20%20%20%20%20%2F%2F%2025%EF%BC%8C%E5%B9%B3%E6%96%B9%0A%7D" data-has-hidden="true" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// apply 接受一个值和一个"如何处理它"的闭包</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">));       </span><span style="color:#6A737D">// 10，乘以 2</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">));     </span><span style="color:#6A737D">// 105，加 100</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> x));       </span><span style="color:#6A737D">// 25，平方</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre><div aria-hidden="true" class="code-runner-full-hl" hidden=""><span class="line"><span style="color:#6A737D">// apply 接受一个值和一个"如何处理它"的闭包</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> apply</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> impl</span><span style="color:#B392F0"> Fn</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    f</span><span style="color:#E1E4E8">(x)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">));       </span><span style="color:#6A737D">// 10，乘以 2</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">));     </span><span style="color:#6A737D">// 105，加 100</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">apply</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">|</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> x));       </span><span style="color:#6A737D">// 25，平方</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></div></div>

> 闭包还有一个高频使用场景——配合迭代器的 `.map()`、`.filter()` 等方法，这部分在本章后面的迭代器文章中详细介绍。

# 捕获方式

## 三种捕获方式

闭包捕获变量有三种方式，**Rust 会自动选择限制最少的那种**：

| 捕获方式 | 发生条件 |
| --- | --- |
| 不可变引用 `&T` | 只读取变量 |
| 可变引用 `&mut T` | 修改变量 |
| 获取所有权 `T` | 消费或 drop 变量 |

**只读取 → 不可变引用：**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20message%20%3D%20String%3A%3Afrom(%22%E4%BD%A0%E5%A5%BD%22)%3B%0A%0A%20%20%20%20let%20print%20%3D%20%7C%7C%20println!(%22%7B%7D%22%2C%20message)%3B%0A%0A%20%20%20%20print()%3B%0A%20%20%20%20print()%3B%0A%20%20%20%20%2F%2F%20message%20%E4%BB%8D%E7%84%B6%E6%9C%89%E6%95%88%0A%20%20%20%20println!(%22%E5%8E%9F%E6%9D%A5%E7%9A%84%E5%80%BC%E8%BF%98%E5%9C%A8%EF%BC%9A%7B%7D%22%2C%20message)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> message </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> print </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, message);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    print</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    print</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">    // message 仍然有效</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"原来的值还在：{}"</span><span style="color:#E1E4E8">, message);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**修改变量 → 可变引用：**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20mut%20count%20%3D%200%3B%0A%0A%20%20%20%20%2F%2F%20%E9%97%AD%E5%8C%85%E8%87%AA%E8%BA%AB%E4%B9%9F%E8%A6%81%E5%A3%B0%E6%98%8E%20mut%EF%BC%8C%E5%9B%A0%E4%B8%BA%E5%AE%83%E5%86%85%E9%83%A8%E6%9C%89%E5%8F%AF%E5%8F%98%E7%8A%B6%E6%80%81%0A%20%20%20%20let%20mut%20increment%20%3D%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20count%20%2B%3D%201%3B%0A%20%20%20%20%20%20%20%20println!(%22count%20%3D%20%7B%7D%22%2C%20count)%3B%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20increment()%3B%0A%20%20%20%20increment()%3B%0A%20%20%20%20%2F%2F%20%E5%8F%AF%E5%8F%98%E5%80%9F%E7%94%A8%E7%BB%93%E6%9D%9F%E5%90%8E%EF%BC%8Ccount%20%E5%8F%AF%E4%BB%A5%E5%86%8D%E6%AC%A1%E8%AE%BF%E9%97%AE%0A%20%20%20%20println!(%22%E6%9C%80%E7%BB%88%20count%20%3D%20%7B%7D%22%2C%20count)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 闭包自身也要声明 mut，因为它内部有可变状态</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> increment </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        count </span><span style="color:#F97583">+=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"count = {}"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#B392F0">    increment</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">    // 可变借用结束后，count 可以再次访问</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最终 count = {}"</span><span style="color:#E1E4E8">, count);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 可变引用捕获期间，不能对同一变量进行其他借用。

**消费变量 → 获取所有权：**

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20name%20%3D%20String%3A%3Afrom(%22Alice%22)%3B%0A%0A%20%20%20%20%2F%2F%20drop%20%E9%9C%80%E8%A6%81%E6%89%80%E6%9C%89%E6%9D%83%EF%BC%8C%E9%97%AD%E5%8C%85%E5%BF%85%E9%A1%BB%E7%A7%BB%E5%8A%A8%20name%0A%20%20%20%20let%20consume%20%3D%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%86%8D%E8%A7%81%EF%BC%8C%7B%7D%22%2C%20name)%3B%0A%20%20%20%20%20%20%20%20drop(name)%3B%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20consume()%3B%0A%20%20%20%20%2F%2F%20consume()%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9Aname%20%E5%B7%B2%E8%A2%AB%E6%B6%88%E8%B4%B9%EF%BC%8C%E8%BF%99%E4%B8%AA%E9%97%AD%E5%8C%85%E5%8F%AA%E8%83%BD%E8%B0%83%E7%94%A8%E4%B8%80%E6%AC%A1%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> name </span><span style="color:#F97583">=</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // drop 需要所有权，闭包必须移动 name</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> consume </span><span style="color:#F97583">=</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"再见，{}"</span><span style="color:#E1E4E8">, name);</span></span>
<span class="line"><span style="color:#B392F0">        drop</span><span style="color:#E1E4E8">(name);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    consume</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">    // consume(); // 错误：name 已被消费，这个闭包只能调用一次</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## move 关键字：强制转移所有权

`move` 让闭包**强制获取所有变量的所有权**，即使闭包体里只是读取：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20%2F%2F%20move%20%E5%BC%BA%E5%88%B6%E9%97%AD%E5%8C%85%E6%8B%A5%E6%9C%89%20data%0A%20%20%20%20let%20contains%20%3D%20move%20%7Cx%7C%20data.contains(x)%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20contains(%261))%3B%20%2F%2F%20true%0A%20%20%20%20println!(%22%7B%7D%22%2C%20contains(%265))%3B%20%2F%2F%20false%0A%0A%20%20%20%20%2F%2F%20data%20%E5%B7%B2%E8%A2%AB%E7%A7%BB%E5%85%A5%E9%97%AD%E5%8C%85%EF%BC%8C%E5%A4%96%E9%83%A8%E4%B8%8D%E8%83%BD%E5%86%8D%E7%94%A8%0A%20%20%20%20%2F%2F%20println!(%22%7B%3A%3F%7D%22%2C%20data)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%81%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // move 强制闭包拥有 data</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> contains </span><span style="color:#F97583">=</span><span style="color:#F97583"> move</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> data</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(x);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// true</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // data 已被移入闭包，外部不能再用</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{:?}", data); // 错误！</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

不加 `move`——闭包借用 `data`，外部仍可使用：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%5D%3B%0A%0A%20%20%20%20let%20contains%20%3D%20%7Cx%7C%20data.contains(x)%3B%0A%0A%20%20%20%20println!(%22%7B%7D%22%2C%20contains(%262))%3B%0A%20%20%20%20println!(%22data%20%E8%BF%98%E5%9C%A8%EF%BC%9A%7B%3A%3F%7D%22%2C%20data)%3B%20%2F%2F%20%E5%AE%8C%E5%85%A8%E5%90%88%E6%B3%95%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> contains </span><span style="color:#F97583">=</span><span style="color:#F97583"> |</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> data</span><span style="color:#F97583">.</span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(x);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">contains</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"data 还在：{:?}"</span><span style="color:#E1E4E8">, data); </span><span style="color:#6A737D">// 完全合法</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **什么时候用 `move`？** 最典型的场景是把闭包传给新线程：`thread::spawn(move || { ... })`。新线程的生命周期可能比当前函数更长，数据必须从当前线程”移入”新线程，否则会有悬垂引用风险。

# 练习题

## 语法与捕获测验

加载题目中…

```rust
fn main() {
    let greet = |msg: &str| println!("你好，{}", msg);
    greet("Rust");
    greet(42);
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

`base_price` 和 `discount` 已经给定，请创建一个闭包 `final_price`，捕获这两个变量，接受数量 `qty`，返回 `(base_price - discount) * qty`：

```rust
fn main() {
    let base_price = 100;
    let discount = 20;

    // TODO: 创建闭包 final_price，接受数量 qty，返回折后总价
    let final_price = ???;

    println!("{}", final_price(3)); // (100 - 20) * 3 = 240
    println!("{}", final_price(5)); // (100 - 20) * 5 = 400
}
```