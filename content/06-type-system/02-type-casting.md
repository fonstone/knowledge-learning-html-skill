# 类型铸造基础

## 为什么需要类型铸造

不同类型的数据之间有时需要互相转换。例如：

- 将浮点数转为整数
- 将整数转为字符
- 将小范围的整数转为大范围的整数

Rust **不提供隐式类型转换**（除了某些特殊情况如自动解引用）。这是 Rust 的安全哲学：**显式优于隐式**。如果你想转换类型，必须明确地说出来。

这样做的好处：

- 防止意外的数据丢失 （如 f64 -> i32 丢失小数部分）
- 明确意图 （代码清晰可读）
- 捕获错误 （编译器会检查非法转换）

## 基本语法

使用 **`as`** 关键字进行显式类型转换：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%B5%AE%E7%82%B9%E6%95%B0%20-%3E%20%E6%95%B4%E6%95%B0%0A%20%20%20%20let%20float_val%3A%20f32%20%3D%2065.4%3B%0A%20%20%20%20let%20int_val%20%3D%20float_val%20as%20i32%3B%0A%20%20%20%20println!(%22%E6%B5%AE%E7%82%B9%E6%95%B0%20%7B%7D%20%E8%BD%AC%E4%B8%BA%E6%95%B4%E6%95%B0%20%7B%7D%22%2C%20float_val%2C%20int_val)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%95%B4%E6%95%B0%20-%3E%20%E6%B5%AE%E7%82%B9%E6%95%B0%0A%20%20%20%20let%20num%20%3D%20100%3B%0A%20%20%20%20let%20float_num%20%3D%20num%20as%20f64%3B%0A%20%20%20%20println!(%22%E6%95%B4%E6%95%B0%20%7B%7D%20%E8%BD%AC%E4%B8%BA%E6%B5%AE%E7%82%B9%E6%95%B0%20%7B%7D%22%2C%20num%2C%20float_num)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%95%B4%E6%95%B0%20-%3E%20%E5%AD%97%E7%AC%A6%0A%20%20%20%20let%20code%20%3D%2065u8%3B%0A%20%20%20%20let%20character%20%3D%20code%20as%20char%3B%0A%20%20%20%20println!(%22%E6%95%B4%E6%95%B0%20%7B%7D%20%E8%BD%AC%E4%B8%BA%E5%AD%97%E7%AC%A6%20'%7B%7D'%22%2C%20code%2C%20character)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 浮点数 -&gt; 整数</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> float_val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 65.4</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> int_val </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> float_val </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"浮点数 {} 转为整数 {}"</span><span style="color:#E1E4E8">, float_val, int_val);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 整数 -&gt; 浮点数</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> float_num </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"整数 {} 转为浮点数 {}"</span><span style="color:#E1E4E8">, num, float_num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 整数 -&gt; 字符</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> code </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 65</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> character </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> code </span><span style="color:#F97583">as</span><span style="color:#B392F0"> char</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"整数 {} 转为字符 '{}'"</span><span style="color:#E1E4E8">, code, character);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 整数转换规则

### 无符号整数之间的转换

当从一个无符号整数类型转换到另一个时，**只保留有效位**。多余的高位被丢弃：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%201000%20%E5%9C%A8%20u8%20%E8%8C%83%E5%9B%B4%E5%86%85%E5%90%97%EF%BC%9Fu8%20%E6%9C%80%E5%A4%A7%E5%80%BC%E6%98%AF%20255%EF%BC%8C%E6%89%80%E4%BB%A5%E4%B8%8D%E5%9C%A8%0A%20%20%20%20%2F%2F%201000%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%98%AF%2011111010000%EF%BC%8811%20%E4%BD%8D%EF%BC%89%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E4%BF%9D%E7%95%99%E4%BD%8E%208%20%E4%BD%8D%EF%BC%9A11101000%20%3D%20232%0A%20%20%20%20let%20value%20%3D%201000u16%3B%0A%20%20%20%20let%20narrow%20%3D%20value%20as%20u8%3B%0A%20%20%20%20println!(%221000%20as%20u8%20%3D%20%7B%7D%20(%E6%9C%9F%E6%9C%9B%20232)%22%2C%20narrow)%3B%0A%0A%20%20%20%20%2F%2F%20%E9%AA%8C%E8%AF%81%EF%BC%9A1000%20mod%20256%20%3D%20232%0A%20%20%20%20println!(%221000%20%25%20256%20%3D%20%7B%7D%22%2C%201000%20%25%20256)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 1000 在 u8 范围内吗？u8 最大值是 255，所以不在</span></span>
<span class="line"><span style="color:#6A737D">    // 1000 的二进制是 11111010000（11 位）</span></span>
<span class="line"><span style="color:#6A737D">    // 只保留低 8 位：11101000 = 232</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1000</span><span style="color:#B392F0">u16</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> narrow </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1000 as u8 = {} (期望 232)"</span><span style="color:#E1E4E8">, narrow);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 验证：1000 mod 256 = 232</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1000 % 256 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1000</span><span style="color:#F97583"> %</span><span style="color:#79B8FF"> 256</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **记住**：对于无符号整数转换，转换后的值相当于原值对 `2^(目标位数)` 取模。

### 有符号整数的转换

有符号整数的转换涉及**二进制补码**（two’s complement）。转换规则：

1. 如果值在目标范围内 ，直接转换
1. 如果值超出范围 ，先转为对应的无符号类型（按上面的规则），再按二进制补码解释

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%201%EF%BC%9A%E5%80%BC%E5%9C%A8%E8%8C%83%E5%9B%B4%E5%86%85%0A%20%20%20%20let%20num%20%3D%20128i32%3B%0A%20%20%20%20let%20as_i16%20%3D%20num%20as%20i16%3B%0A%20%20%20%20println!(%22128%20as%20i16%20%3D%20%7B%7D%22%2C%20as_i16)%3B%20%20%2F%2F%20%E4%BB%8D%E6%98%AF%20128%0A%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%202%EF%BC%9A%E5%80%BC%E8%B6%85%E5%87%BA%E8%8C%83%E5%9B%B4%0A%20%20%20%20%2F%2F%20128%20%E4%BD%9C%E4%B8%BA%20u8%20%E8%BF%98%E6%98%AF%20128%0A%20%20%20%20%2F%2F%20%E4%BD%86%20128%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81%E8%A2%AB%E8%A7%A3%E9%87%8A%E4%B8%BA%20i8%20%E6%97%B6%EF%BC%8C%E6%9C%80%E9%AB%98%E4%BD%8D%E6%98%AF%201%EF%BC%8C%E6%89%80%E4%BB%A5%E6%98%AF%E8%B4%9F%E6%95%B0%0A%20%20%20%20%2F%2F%20128%20%3D%2010000000%20(i8)%20-%3E%20-128%0A%20%20%20%20let%20num2%20%3D%20128i32%3B%0A%20%20%20%20let%20as_i8%20%3D%20num2%20as%20i8%3B%0A%20%20%20%20println!(%22128%20as%20i8%20%3D%20%7B%7D%20(%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81%E8%A7%A3%E9%87%8A%E4%B8%BA%20-128)%22%2C%20as_i8)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BE%8B%E5%AD%90%203%EF%BC%9A%E8%B4%9F%E6%95%B0%E8%BD%AC%E6%97%A0%E7%AC%A6%E5%8F%B7%0A%20%20%20%20%2F%2F%20-1%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81%E6%98%AF%2011111111%EF%BC%88%E6%89%80%E6%9C%89%E4%BD%8D%E9%83%BD%E6%98%AF%201%EF%BC%89%0A%20%20%20%20%2F%2F%20%E8%BD%AC%E4%B8%BA%20u8%20%E5%90%8E%E4%BF%9D%E7%95%99%E6%89%80%E6%9C%89%208%20%E4%BD%8D%EF%BC%8C%E7%BB%93%E6%9E%9C%E6%98%AF%20255%0A%20%20%20%20let%20neg%20%3D%20-1i8%3B%0A%20%20%20%20let%20as_u8%20%3D%20neg%20as%20u8%3B%0A%20%20%20%20println!(%22-1%20as%20u8%20%3D%20%7B%7D%22%2C%20as_u8)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 例子 1：值在范围内</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 128</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> as_i16 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> num </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i16</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"128 as i16 = {}"</span><span style="color:#E1E4E8">, as_i16);  </span><span style="color:#6A737D">// 仍是 128</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 例子 2：值超出范围</span></span>
<span class="line"><span style="color:#6A737D">    // 128 作为 u8 还是 128</span></span>
<span class="line"><span style="color:#6A737D">    // 但 128 的二进制补码被解释为 i8 时，最高位是 1，所以是负数</span></span>
<span class="line"><span style="color:#6A737D">    // 128 = 10000000 (i8) -&gt; -128</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> num2 </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 128</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> as_i8 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> num2 </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"128 as i8 = {} (二进制补码解释为 -128)"</span><span style="color:#E1E4E8">, as_i8);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 例子 3：负数转无符号</span></span>
<span class="line"><span style="color:#6A737D">    // -1 的二进制补码是 11111111（所有位都是 1）</span></span>
<span class="line"><span style="color:#6A737D">    // 转为 u8 后保留所有 8 位，结果是 255</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> neg </span><span style="color:#F97583">=</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">1</span><span style="color:#B392F0">i8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> as_u8 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> neg </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"-1 as u8 = {}"</span><span style="color:#E1E4E8">, as_u8);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 有符号转无符号，无符号转有符号

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%9C%89%E7%AC%A6%E5%8F%B7%20-%3E%20%E6%97%A0%E7%AC%A6%E5%8F%B7%EF%BC%9A%E6%8C%89%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81%E8%BD%AC%E6%8D%A2%0A%20%20%20%20let%20signed%3A%20i32%20%3D%20-42%3B%0A%20%20%20%20let%20unsigned%20%3D%20signed%20as%20u32%3B%0A%20%20%20%20println!(%22-42%20as%20u32%20%3D%20%7B%7D%22%2C%20unsigned)%3B%20%20%2F%2F%20%E5%A4%A7%E6%AD%A3%E6%95%B0%0A%0A%20%20%20%20%2F%2F%20%E6%97%A0%E7%AC%A6%E5%8F%B7%20-%3E%20%E6%9C%89%E7%AC%A6%E5%8F%B7%EF%BC%9A%E6%8C%89%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81%E8%A7%A3%E9%87%8A%0A%20%20%20%20let%20unsigned2%3A%20u32%20%3D%204294967254%3B%20%20%2F%2F%20%E5%B0%B1%E6%98%AF%20-42%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A8%E7%A4%BA%0A%20%20%20%20let%20signed2%20%3D%20unsigned2%20as%20i32%3B%0A%20%20%20%20println!(%224294967254%20as%20i32%20%3D%20%7B%7D%22%2C%20signed2)%3B%20%20%2F%2F%20-42%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 有符号 -&gt; 无符号：按二进制补码转换</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> signed</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> unsigned </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> signed </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"-42 as u32 = {}"</span><span style="color:#E1E4E8">, unsigned);  </span><span style="color:#6A737D">// 大正数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 无符号 -&gt; 有符号：按二进制补码解释</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> unsigned2</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 4294967254</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 就是 -42 的二进制表示</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> signed2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> unsigned2 </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"4294967254 as i32 = {}"</span><span style="color:#E1E4E8">, signed2);  </span><span style="color:#6A737D">// -42</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 浮点数转换

### 浮点数 -> 整数

转换时**舍弃小数部分**（向 0 取整）：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20f1%20%3D%203.99f32%3B%0A%20%20%20%20let%20i1%20%3D%20f1%20as%20i32%3B%0A%20%20%20%20println!(%223.99%20as%20i32%20%3D%20%7B%7D%20(%E8%88%8D%E5%BC%83%E5%B0%8F%E6%95%B0%E9%83%A8%E5%88%86)%22%2C%20i1)%3B%20%20%2F%2F%203%0A%0A%20%20%20%20let%20f2%20%3D%20-3.99f32%3B%0A%20%20%20%20let%20i2%20%3D%20f2%20as%20i32%3B%0A%20%20%20%20println!(%22-3.99%20as%20i32%20%3D%20%7B%7D%22%2C%20i2)%3B%20%20%2F%2F%20-3%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E6%B5%AE%E7%82%B9%E6%95%B0%E5%A4%AA%E5%A4%A7%EF%BC%8C%E8%B6%85%E5%87%BA%E6%95%B4%E6%95%B0%E8%8C%83%E5%9B%B4%E4%BC%9A%E4%BA%A7%E7%94%9F%E6%9C%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E4%B8%BA%0A%20%20%20%20%2F%2F%20%EF%BC%88%E5%9C%A8%E5%AE%9E%E8%B7%B5%E4%B8%AD%E9%80%9A%E5%B8%B8%E8%BD%AC%E4%B8%BA%200%20%E6%88%96%E8%AF%A5%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%9C%80%E5%B0%8F%E5%80%BC%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f1 </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3.99</span><span style="color:#B392F0">f32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> i1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> f1 </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"3.99 as i32 = {} (舍弃小数部分)"</span><span style="color:#E1E4E8">, i1);  </span><span style="color:#6A737D">// 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f2 </span><span style="color:#F97583">=</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">3.99</span><span style="color:#B392F0">f32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> i2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> f2 </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"-3.99 as i32 = {}"</span><span style="color:#E1E4E8">, i2);  </span><span style="color:#6A737D">// -3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果浮点数太大，超出整数范围会产生未定义行为</span></span>
<span class="line"><span style="color:#6A737D">    // （在实践中通常转为 0 或该类型的最小值）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 整数 -> 浮点数

通常没有精度问题，因为浮点数范围更大：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20i%20%3D%20100i32%3B%0A%20%20%20%20let%20f%20%3D%20i%20as%20f64%3B%0A%20%20%20%20println!(%22%7B%7D%20as%20f64%20%3D%20%7B%7D%22%2C%20i%2C%20f)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BD%86%E5%A4%A7%E6%95%B4%E6%95%B0%E5%8F%AF%E8%83%BD%E5%9B%A0%E6%B5%AE%E7%82%B9%E7%B2%BE%E5%BA%A6%E9%99%90%E5%88%B6%E8%80%8C%E4%B8%A7%E5%A4%B1%E7%B2%BE%E7%A1%AE%E6%80%A7%0A%20%20%20%20let%20big%20%3D%201_000_000_000_000_000_i64%3B%0A%20%20%20%20let%20f_big%20%3D%20big%20as%20f64%3B%0A%20%20%20%20println!(%22%E5%A4%A7%E6%95%B4%E6%95%B0%E8%BD%AC%E6%B5%AE%E7%82%B9%EF%BC%9A%7B%7D%20-%3E%20%7B%7D%22%2C%20big%2C%20f_big)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 100</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} as f64 = {}"</span><span style="color:#E1E4E8">, i, f);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 但大整数可能因浮点精度限制而丧失精确性</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> big </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1_000_000_000_000_000_</span><span style="color:#B392F0">i64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f_big </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> big </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"大整数转浮点：{} -&gt; {}"</span><span style="color:#E1E4E8">, big, f_big);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 浮点数 -> 浮点数

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20f32_val%3A%20f32%20%3D%203.14%3B%0A%20%20%20%20let%20f64_val%20%3D%20f32_val%20as%20f64%3B%0A%20%20%20%20println!(%22f32%20%7B%7D%20-%3E%20f64%20%7B%7D%22%2C%20f32_val%2C%20f64_val)%3B%0A%0A%20%20%20%20let%20f64_val2%3A%20f64%20%3D%202.71828%3B%0A%20%20%20%20let%20f32_val2%20%3D%20f64_val2%20as%20f32%3B%0A%20%20%20%20println!(%22f64%20%7B%7D%20-%3E%20f32%20%7B%7D%22%2C%20f64_val2%2C%20f32_val2)%3B%20%20%2F%2F%20%E7%B2%BE%E5%BA%A6%E5%8F%AF%E8%83%BD%E4%B8%A7%E5%A4%B1%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f32_val</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 3.14</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f64_val </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> f32_val </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"f32 {} -&gt; f64 {}"</span><span style="color:#E1E4E8">, f32_val, f64_val);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f64_val2</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 2.71828</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f32_val2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> f64_val2 </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"f64 {} -&gt; f32 {}"</span><span style="color:#E1E4E8">, f64_val2, f32_val2);  </span><span style="color:#6A737D">// 精度可能丧失</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 字符和整数的转换

### 整数 -> 字符

使用 `as char` 将有效的 Unicode 标量值转为字符：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20codes%20%3D%20vec!%5B65u8%2C%2066%2C%2067%2C%2068%5D%3B%0A%0A%20%20%20%20for%20code%20in%20codes%20%7B%0A%20%20%20%20%20%20%20%20let%20ch%20%3D%20code%20as%20char%3B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20-%3E%20'%7B%7D'%22%2C%20code%2C%20ch)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> codes </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">65</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">66</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">67</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">68</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> code </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> codes {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> ch </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> code </span><span style="color:#F97583">as</span><span style="color:#B392F0"> char</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} -&gt; '{}'"</span><span style="color:#E1E4E8">, code, ch);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 字符 -> 整数

使用 `as u32` 获得 Unicode 代码点：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20chars%20%3D%20vec!%5B'A'%2C%20'B'%2C%20'C'%2C%20'%E4%B8%AD'%5D%3B%0A%0A%20%20%20%20for%20ch%20in%20chars%20%7B%0A%20%20%20%20%20%20%20%20let%20code%20%3D%20ch%20as%20u32%3B%0A%20%20%20%20%20%20%20%20println!(%22'%7B%7D'%20-%3E%20%7B%7D%22%2C%20ch%2C%20code)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> chars </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">'A'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'B'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'C'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'中'</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> ch </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> chars {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> code </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> ch </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"'{}' -&gt; {}"</span><span style="color:#E1E4E8">, ch, code);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **注意**：不是所有整数都对应有效的 Unicode 字符。转换时 Rust 不检查有效性（这是 `as` 的限制）。如果需要安全的转换，应使用 `char::from_u32()`。

## 常见陷阱

### 陷阱 1：溢出时的未定义行为

在 release 模式下，整数溢出不会 panic，而是**环绕**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Debug%20%E6%A8%A1%E5%BC%8F%E4%BC%9A%20panic%EF%BC%8Crelease%20%E6%A8%A1%E5%BC%8F%E4%BC%9A%E7%8E%AF%E7%BB%95%0A%20%20%20%20%23%5Bcfg(debug_assertions)%5D%0A%20%20%20%20println!(%22Debug%20%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A4%A7%E6%95%B4%E6%95%B0%E8%BD%AC%20u8%20%E5%8F%AF%E8%83%BD%20panic%22)%3B%0A%0A%20%20%20%20%23%5Bcfg(not(debug_assertions))%5D%0A%20%20%20%20println!(%22Release%20%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A4%A7%E6%95%B4%E6%95%B0%E8%BD%AC%20u8%20%E4%BC%9A%E7%8E%AF%E7%BB%95%22)%3B%0A%0A%20%20%20%20let%20large%20%3D%20256u16%3B%0A%20%20%20%20let%20small%20%3D%20large%20as%20u8%3B%0A%20%20%20%20println!(%22256%20as%20u8%20%3D%20%7B%7D%22%2C%20small)%3B%20%20%2F%2F%200%EF%BC%88%E7%8E%AF%E7%BB%95%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // Debug 模式会 panic，release 模式会环绕</span></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(debug_assertions)]</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Debug 模式：大整数转 u8 可能 panic"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(not(debug_assertions))]</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Release 模式：大整数转 u8 会环绕"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> large </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 256</span><span style="color:#B392F0">u16</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> small </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> large </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"256 as u8 = {}"</span><span style="color:#E1E4E8">, small);  </span><span style="color:#6A737D">// 0（环绕）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 陷阱 2：浮点转整数时的精度丧失

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20f%20%3D%20123.456f64%3B%0A%20%20%20%20let%20i%20%3D%20f%20as%20i32%3B%0A%20%20%20%20println!(%22123.456%20%E8%BD%AC%E4%B8%BA%E6%95%B4%E6%95%B0%EF%BC%9A%7B%7D%22%2C%20i)%3B%20%20%2F%2F%20123%EF%BC%88%E5%B0%8F%E6%95%B0%E4%B8%A2%E5%A4%B1%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 123.456</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> f </span><span style="color:#F97583">as</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"123.456 转为整数：{}"</span><span style="color:#E1E4E8">, i);  </span><span style="color:#6A737D">// 123（小数丢失）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 陷阱 3：转换顺序很重要

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%201000i32%3B%0A%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F%201%EF%BC%9A%E5%85%88%E8%BD%AC%20u8%EF%BC%8C%E5%86%8D%E8%BD%AC%20f64%0A%20%20%20%20let%20result1%20%3D%20(a%20as%20u8)%20as%20f64%3B%0A%20%20%20%20println!(%22(1000%20as%20u8)%20as%20f64%20%3D%20%7B%7D%22%2C%20result1)%3B%20%20%2F%2F%20232.0%0A%0A%20%20%20%20%2F%2F%20%E6%96%B9%E5%BC%8F%202%EF%BC%9A%E5%85%88%E8%BD%AC%20f64%EF%BC%8C%E5%86%8D%E8%BD%AC%20u8%0A%20%20%20%20let%20result2%20%3D%20(a%20as%20f64)%20as%20u8%3B%0A%20%20%20%20println!(%22(1000%20as%20f64)%20as%20u8%20%3D%20%7B%7D%22%2C%20result2)%3B%20%20%2F%2F%20232%0A%0A%20%20%20%20%2F%2F%20%E4%B8%A4%E8%80%85%E7%BB%93%E6%9E%9C%E7%9B%B8%E5%90%8C%EF%BC%8C%E4%BD%86%E8%BF%87%E7%A8%8B%E4%B8%8D%E5%90%8C%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1000</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 方式 1：先转 u8，再转 f64</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (a </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"(1000 as u8) as f64 = {}"</span><span style="color:#E1E4E8">, result1);  </span><span style="color:#6A737D">// 232.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 方式 2：先转 f64，再转 u8</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (a </span><span style="color:#F97583">as</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">as</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"(1000 as f64) as u8 = {}"</span><span style="color:#E1E4E8">, result2);  </span><span style="color:#6A737D">// 232</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 两者结果相同，但过程不同</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 类型铸造测验

```rust
fn main() {
    let x: u8 = 256u16 as u8;
    println!("{}", x);
}
```

加载题目中…

```rust
fn main() {
    let f: f32 = 3.7;
    let i = f as i32;
    println!("{}", i);
}
```

加载题目中…

```rust
fn main() {
    let x: i8 = 128i32 as i8;
    println!("{}", x);
}
```

加载题目中…

加载题目中…

```rust
let x = 5u32;
// 如何安全地转为 char？
```

加载题目中…

## 编程练习

### 练习 1：整数转换

完成下面的代码，使其正确输出各种整数转换的结果：

```rust
fn main() {
    // TODO: 将 1000u16 转为 u8，输出结果和预期
    let val1 = 1000u16;


    // TODO: 将 -42i32 转为 u32，输出结果
    let val2 = -42i32;


    // TODO: 将 255i32 转为 i8，输出结果
    let val3 = 255i32;


    println!("1000 as u8 预期 232，实际 {}", val1);
    println!("-42 as u32 预期大数，实际 {}", val2);
    println!("255 as i8 预期 -1，实际 {}", val3);
}
```

### 练习 2：浮点和字符转换

完成下面的代码，实现浮点数和字符的转换：

```rust
fn main() {
    // TODO: 将浮点数 3.99 转为 i32，存储在 int_val
    let float_val = 3.99f32;


    // TODO: 将整数 65 转为 char，存储在 char_val
    let int_code = 65u8;


    // TODO: 将字符 'Z' 转为 u32，存储在 code
    let character = 'Z';


    println!("浮点数 {} 转为整数：{}", float_val, int_val);
    println!("整数 {} 转为字符：'{}'", int_code, char_val);
    println!("字符 '{}' 转为代码：{}", character, code);
}
```