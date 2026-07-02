# 标量类型

Rust 是**静态类型**语言——每个值在编译时就有确定的类型。不用担心，Rust 的类型推断能力很强，大多数时候你不需要手动写类型，但理解它们是写出正确代码的基础。

## 整数类型

整数是最常用的类型。Rust 把整数分为**有符号**（可以是负数）和**无符号**（只能是非负数）两大类，并按位宽细分：

| 位宽 | 有符号 | 无符号 | 范围（有符号） |
| --- | --- | --- | --- |
| 8 位 | `i8` | `u8` | -128 ~ 127 |
| 16 位 | `i16` | `u16` | -32768 ~ 32767 |
| 32 位 | `i32` | `u32` | -约21亿 ~ 约21亿 |
| 64 位 | `i64` | `u64` | 极大范围 |
| 128 位 | `i128` | `u128` | 更大 |
| 指针宽度 | `isize` | `usize` | 取决于 CPU 架构（通常为32位或64位） |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%3A%20i32%20%3D%20-42%3B%20%20%20%20%20%20%2F%2F%20%E6%9C%89%E7%AC%A6%E5%8F%B7%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%98%AF%E8%B4%9F%E6%95%B0%0A%20%20%20%20let%20b%3A%20u32%20%3D%20100%3B%20%20%20%20%20%20%2F%2F%20%E6%97%A0%E7%AC%A6%E5%8F%B7%EF%BC%8C%E5%8F%AA%E8%83%BD%E9%9D%9E%E8%B4%9F%0A%20%20%20%20let%20c%3A%20u8%20%20%3D%20255%3B%20%20%20%20%20%20%2F%2F%20u8%20%E6%9C%80%E5%A4%A7%E5%80%BC%0A%20%20%20%20let%20d%3A%20i64%20%3D%209_999_999_999%3B%20%2F%2F%20%E5%A4%A7%E6%95%B0%E7%94%A8%E4%B8%8B%E5%88%92%E7%BA%BF%E5%88%86%E9%9A%94%EF%BC%8C%E6%9B%B4%E6%98%93%E8%AF%BB%0A%0A%20%20%20%20println!(%22a%3D%7B%7D%20b%3D%7B%7D%20c%3D%7B%7D%20d%3D%7B%7D%22%2C%20a%2C%20b%2C%20c%2C%20d)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> =</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">;      </span><span style="color:#6A737D">// 有符号，可以是负数</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">;      </span><span style="color:#6A737D">// 无符号，只能非负</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#F97583">  =</span><span style="color:#79B8FF"> 255</span><span style="color:#E1E4E8">;      </span><span style="color:#6A737D">// u8 最大值</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> d</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i64</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 9_999_999_999</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 大数用下划线分隔，更易读</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a={} b={} c={} d={}"</span><span style="color:#E1E4E8">, a, b, c, d);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**不写类型时的默认值**：整数默认推断为 `i32`，这是最常用的整数类型。`isize` 和 `usize` 的宽度取决于 CPU 架构（x86_64为64，嵌入式MCU 通常是32），**主要用于集合的索引**，如 `arr[i]` 中的 `i` 就是 `usize`。

> **整型溢出**：`u8` 最大值是 255，赋值 256 会怎样？在 **Debug 模式**（`cargo build`）下，Rust 会 panic——程序崩溃并报错，帮你发现 bug。在 **Release 模式**（`cargo build --release`）下，Rust 不 panic，而是做”二进制补码包裹”：256 变 0，257 变 1……程序不崩溃，但值是错的。如果你需要有意地处理溢出，应该显式的调用 `wrapping_add`、`saturating_add`、`checked_add` 等方法。

## 浮点数

Rust 有两种浮点类型：

| 类型 | 精度 | 说明 |
| --- | --- | --- |
| `f32` | 单精度（约 7 位有效数字） | 性能更好，精度较低 |
| `f64` | 双精度（约 15 位有效数字） | 默认类型，精度更高 |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%E6%B5%AE%E7%82%B9%E6%95%B0%E5%B0%BD%E9%87%8F%E5%B0%86%E5%B0%8F%E6%95%B0%E7%82%B9%E6%98%BE%E5%BC%8F%E7%9A%84%E5%86%99%E5%87%BA%E6%9D%A5%EF%BC%8C%E4%BB%A5%E5%8C%BA%E5%88%AB%E4%BA%8E%E6%95%B4%E6%95%B0%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20x%20%3D%203.14%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E9%BB%98%E8%AE%A4%20f64%0A%20%20%20%20let%20y%3A%20f32%20%3D%202.0%3B%20%20%20%20%20%20%2F%2F%20%E6%98%BE%E5%BC%8F%E6%8C%87%E5%AE%9A%20f32%0A%20%20%20%20let%20z%20%3D%201.0_f64%3B%20%20%20%20%20%20%20%2F%2F%20%E7%94%A8%E5%90%8E%E7%BC%80%E6%8C%87%E5%AE%9A%E7%B1%BB%E5%9E%8B%0A%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%20%7B%7D%22%2C%20x%2C%20y%2C%20z)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%B5%AE%E7%82%B9%E8%BF%90%E7%AE%97%0A%20%20%20%20println!(%22%E5%9C%86%E9%9D%A2%E7%A7%AF%20%3D%20%7B%3A.4%7D%22%2C%203.14159%20*%202.0_f64%20*%202.0_f64)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    //浮点数尽量将小数点显式的写出来，以区别于整数类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3.14</span><span style="color:#E1E4E8">;          </span><span style="color:#6A737D">// 默认 f64</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f32</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 2.0</span><span style="color:#E1E4E8">;      </span><span style="color:#6A737D">// 显式指定 f32</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> z </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1.0_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">;       </span><span style="color:#6A737D">// 用后缀指定类型</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {} {}"</span><span style="color:#E1E4E8">, x, y, z);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 浮点运算</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"圆面积 = {:.4}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.14159</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 2.0_</span><span style="color:#B392F0">f64</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 2.0_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 浮点数有精度误差，不要用 `==` 直接比较两个浮点数是否相等，应使用差值是否足够小来判断。

## 布尔型与字符型

**布尔型** `bool` 只有两个值：`true` 和 `false`，常用于条件判断。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20is_active%3A%20bool%20%3D%20true%3B%0A%20%20%20%20let%20is_empty%20%3D%20false%3B%20%2F%2F%20%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD%0A%0A%20%20%20%20println!(%22active%3A%20%7B%7D%2C%20empty%3A%20%7B%7D%22%2C%20is_active%2C%20is_empty)%3B%0A%20%20%20%20println!(%22AND%3A%20%7B%7D%2C%20OR%3A%20%7B%7D%2C%20NOT%3A%20%7B%7D%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20is_active%20%26%26%20is_empty%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20is_active%20%7C%7C%20is_empty%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20!is_active)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> is_active</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> is_empty </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 类型推断</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"active: {}, empty: {}"</span><span style="color:#E1E4E8">, is_active, is_empty);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"AND: {}, OR: {}, NOT: {}"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">             is_active </span><span style="color:#F97583">&amp;&amp;</span><span style="color:#E1E4E8"> is_empty,</span></span>
<span class="line"><span style="color:#E1E4E8">             is_active </span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> is_empty,</span></span>
<span class="line"><span style="color:#F97583">             !</span><span style="color:#E1E4E8">is_active);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**字符型** `char` 表示单个 Unicode 字符，用单引号包裹，占 **4 字节**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20c1%20%3D%20'A'%3B%0A%20%20%20%20let%20c2%20%3D%20'%E4%B8%AD'%3B%20%20%20%20%20%2F%2F%20%E6%B1%89%E5%AD%97%E4%B9%9F%E6%98%AF%E5%90%88%E6%B3%95%E7%9A%84%20char%0A%20%20%20%20let%20c3%20%3D%20'%F0%9F%98%80'%3B%20%20%20%20%2F%2F%20%E8%A1%A8%E6%83%85%E7%AC%A6%E5%8F%B7%E5%90%8C%E6%A0%B7%E5%8F%AF%E4%BB%A5%0A%20%20%20%20let%20c4%20%3D%20'%5Cn'%3B%20%20%20%20%20%2F%2F%20%E8%BD%AC%E4%B9%89%E5%AD%97%E7%AC%A6%0A%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%20%7B%7D%20(%E6%8D%A2%E8%A1%8C%E5%9C%A8%E8%BF%99%E9%87%8C%7B%7D)%22%2C%20c1%2C%20c2%2C%20c3%2C%20c4)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c1 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'A'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c2 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> '中'</span><span style="color:#E1E4E8">;     </span><span style="color:#6A737D">// 汉字也是合法的 char</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c3 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> '😀'</span><span style="color:#E1E4E8">;    </span><span style="color:#6A737D">// 表情符号同样可以</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c4 </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> '</span><span style="color:#79B8FF">\n</span><span style="color:#9ECBFF">'</span><span style="color:#E1E4E8">;     </span><span style="color:#6A737D">// 转义字符</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {} {} (换行在这里{})"</span><span style="color:#E1E4E8">, c1, c2, c3, c4);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `char` 是 4 字节的 Unicode 标量值，而不是 ASCII 字节。这和 C 语言的 `char`（1 字节）不同。如果想要像 C 语言那样操作 ASCII，应该写成 `b'A'` 的形式

## 单元类型

**单元类型** `()` 表示”无值”或”空”，是 Rust 中一个合法的类型。不要把它和其他语言的 `null`、`void` 或 `None` 混淆——`()` 是一个真实的值，可以赋给变量、打印、传递给函数。重要的是，**单元类型是零大小类型**（zero-sized type），在运行时**不占用任何内存**——只是一个编译期的占位符。

不显式返回值的函数会隐式返回 `()`：

<div class="code-runner" data-full-code="fn%20say_hello()%20%7B%0A%20%20%20%20println!(%22Hello!%22)%3B%0A%20%20%20%20%2F%2F%20%E9%9A%90%E5%BC%8F%E8%BF%94%E5%9B%9E%20()%EF%BC%8C%E7%9B%B8%E5%BD%93%E4%BA%8E%20return%20()%3B%0A%7D%0A%0Afn%20add_one(x%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20x%20%2B%201%20%20%2F%2F%20%E6%9C%89%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E6%98%AF%20i32%0A%7D%0A%0Afn%20do_nothing()%20%7B%0A%20%20%20%20%2F%2F%20%E6%97%A0%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%8C%E9%9A%90%E5%BC%8F%E8%BF%94%E5%9B%9E%20()%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%20say_hello()%3B%20%20%2F%2F%20x%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20()%0A%20%20%20%20println!(%22say_hello%20%E8%BF%94%E5%9B%9E%3A%20%7B%3A%3F%7D%22%2C%20x)%3B%20%20%2F%2F%20%E8%BE%93%E5%87%BA%20()%0A%0A%20%20%20%20let%20y%20%3D%20add_one(5)%3B%20%20%20%2F%2F%20y%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20i32%0A%20%20%20%20println!(%22add_one%20%E8%BF%94%E5%9B%9E%3A%20%7B%7D%22%2C%20y)%3B%0A%0A%20%20%20%20let%20z%20%3D%20do_nothing()%3B%20%2F%2F%20z%20%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%AF%20()%0A%20%20%20%20println!(%22do_nothing%20%E8%BF%94%E5%9B%9E%3A%20%7B%3A%3F%7D%22%2C%20z)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> say_hello</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 隐式返回 ()，相当于 return ();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> add_one</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> 1</span><span style="color:#6A737D">  // 有返回值，是 i32</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> do_nothing</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 无返回值，隐式返回 ()</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#B392F0"> say_hello</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// x 的类型是 ()</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"say_hello 返回: {:?}"</span><span style="color:#E1E4E8">, x);  </span><span style="color:#6A737D">// 输出 ()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#B392F0"> add_one</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// y 的类型是 i32</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"add_one 返回: {}"</span><span style="color:#E1E4E8">, y);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> z </span><span style="color:#F97583">=</span><span style="color:#B392F0"> do_nothing</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// z 的类型是 ()</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"do_nothing 返回: {:?}"</span><span style="color:#E1E4E8">, z);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

单元类型常用于：

- 函数没有有意义的返回值 ：只想执行副作用（如打印、修改状态），不返回数据
- 空的代码块 ： if 条件分支没有返回值时
- 表示”什么都没有” ：在某些错误处理或控制流场景中

## 字面量写法与类型后缀

字面量是你在代码里直接写出来的、一眼就能看出其具体数值的数据，和上面的整型、浮点型不同，字面量不是变量。 它是对”字面意思”的直接呈现，也就是说，你看到的是什么，它的值就是什么。比如：`18`，`3.14`，`"张三"`。

> **Rust 字符串 vs C 语言**：“张三”是字符串字面量。Rust 的字符串（`&str`）**不需要以 `\0` 结尾**，长度由字符串对象记录；C 语言字符串必须以 `\0` 结尾才能确定长度，容易导致缓冲区溢出。

Rust 支持多种进制的字面量，还可以在数字中插入下划线提升可读性：

| 字面量形式 | 示例 |
| --- | --- |
| 十进制 | `98_222` |
| 十六进制 | `0xFF` |
| 八进制 | `0o77` |
| 二进制 | `0b1111_0000` |
| 字节（仅限 `u8`） | `b'A'` |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20decimal%20%20%20%20%20%3D%20255%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8D%81%E8%BF%9B%E5%88%B6%0A%20%20%20%20let%20hex%20%20%20%20%20%20%20%20%20%3D%200xFF%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6%EF%BC%880x%20%E5%89%8D%E7%BC%80%EF%BC%89%0A%20%20%20%20let%20octal%20%20%20%20%20%20%20%3D%200o377%3B%20%20%20%20%20%20%20%20%2F%2F%20%E5%85%AB%E8%BF%9B%E5%88%B6%EF%BC%880o%20%E5%89%8D%E7%BC%80%EF%BC%89%0A%20%20%20%20let%20binary%20%20%20%20%20%20%3D%200b1111_1111%3B%20%20%2F%2F%20%E4%BA%8C%E8%BF%9B%E5%88%B6%EF%BC%880b%20%E5%89%8D%E7%BC%80%EF%BC%89%0A%20%20%20%20let%20million%20%20%20%20%20%3D%201_000_000%3B%20%20%20%20%2F%2F%20%E4%B8%8B%E5%88%92%E7%BA%BF%E5%8F%AA%E6%98%AF%E8%A7%86%E8%A7%89%E5%88%86%E9%9A%94%E7%AC%A6%0A%20%20%20%20let%20byte%3A%20u8%20%20%20%20%3D%20b'A'%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%AD%97%E8%8A%82%E5%AD%97%E9%9D%A2%E9%87%8F%EF%BC%8C%E7%AD%89%E4%BB%B7%E4%BA%8E%2065u8%0A%0A%20%20%20%20%2F%2F%20%E7%B1%BB%E5%9E%8B%E5%90%8E%E7%BC%80%EF%BC%9A%E7%9B%B4%E6%8E%A5%E5%86%99%E5%9C%A8%E6%95%B0%E5%AD%97%E5%90%8E%E9%9D%A2%E6%8C%87%E5%AE%9A%E7%B1%BB%E5%9E%8B%0A%20%20%20%20let%20typed%3A%20u32%20%20%3D%20255u32%3B%0A%20%20%20%20let%20also_typed%20%20%3D%20255_u8%3B%20%20%20%20%20%20%20%2F%2F%20%E4%B8%8B%E5%88%92%E7%BA%BF%E5%8F%AF%E4%BB%A5%E6%94%BE%E5%9C%A8%E5%90%8E%E7%BC%80%E5%89%8D%0A%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%20%7B%7D%20%7B%7D%20%7B%7D%20%7B%7D%20%7B%7D%20%7B%7D%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20decimal%2C%20hex%2C%20octal%2C%20binary%2C%20million%2C%20byte%2C%20typed%2C%20also_typed)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> decimal     </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 255</span><span style="color:#E1E4E8">;          </span><span style="color:#6A737D">// 十进制</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> hex         </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0xFF</span><span style="color:#E1E4E8">;         </span><span style="color:#6A737D">// 十六进制（0x 前缀）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> octal       </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0o377</span><span style="color:#E1E4E8">;        </span><span style="color:#6A737D">// 八进制（0o 前缀）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> binary      </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0b1111_1111</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 二进制（0b 前缀）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> million     </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1_000_000</span><span style="color:#E1E4E8">;    </span><span style="color:#6A737D">// 下划线只是视觉分隔符</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> byte</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#F97583">    =</span><span style="color:#9ECBFF"> b'A'</span><span style="color:#E1E4E8">;         </span><span style="color:#6A737D">// 字节字面量，等价于 65u8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 类型后缀：直接写在数字后面指定类型</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> typed</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#F97583">  =</span><span style="color:#79B8FF"> 255</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> also_typed  </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 255_</span><span style="color:#B392F0">u8</span><span style="color:#E1E4E8">;       </span><span style="color:#6A737D">// 下划线可以放在后缀前</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {} {} {} {} {} {} {}"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">             decimal, hex, octal, binary, million, byte, typed, also_typed);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**类型后缀**的用途：当 Rust 无法从上下文推断类型时，直接在字面量后写类型：`42u8`、`3.14f32`、`1000i64`。

# 复合类型

## 元组

元组可以把**不同类型**的多个值打包在一起，用圆括号 `()` 包裹：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20t%20%3D%20(1i32%2C%20true%2C%20'x'%2C%203.14f64)%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%20.%E7%B4%A2%E5%BC%95%20%E8%AE%BF%E9%97%AE%E5%85%83%E7%B4%A0%EF%BC%88%E6%B3%A8%E6%84%8F%EF%BC%9A%E6%98%AF%20.0%20%E4%B8%8D%E6%98%AF%20%5B0%5D%EF%BC%89%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%3A%20%7B%7D%22%2C%20t.0)%3B%0A%20%20%20%20println!(%22%E7%AC%AC%E4%BA%8C%E4%B8%AA%3A%20%7B%7D%22%2C%20t.1)%3B%0A%0A%20%20%20%20%2F%2F%20%E6%95%B4%E4%B8%AA%E5%85%83%E7%BB%84%E7%94%A8%20%7B%3A%3F%7D%20%E6%89%93%E5%8D%B0%0A%20%20%20%20println!(%22%E5%AE%8C%E6%95%B4%E5%85%83%E7%BB%84%3A%20%7B%3A%3F%7D%22%2C%20t)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'x'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.14</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用 .索引 访问元素（注意：是 .0 不是 [0]）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个: {}"</span><span style="color:#E1E4E8">, t</span><span style="color:#F97583">.</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第二个: {}"</span><span style="color:#E1E4E8">, t</span><span style="color:#F97583">.</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 整个元组用 {:?} 打印</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"完整元组: {:?}"</span><span style="color:#E1E4E8">, t);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 元组用 `.索引` 访问，**不能** 用 `t[0]`——这是元组和数组的重要区别。

## 元组解构与函数返回值

**解构**（destructure）可以把元组的每个值绑定到独立变量：

<div class="code-runner" data-full-code="fn%20min_max(numbers%3A%20%26%5Bi32%5D)%20-%3E%20(i32%2C%20i32)%20%7B%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E5%85%83%E7%BB%84%EF%BC%8C%E5%AE%9E%E7%8E%B0%E5%A4%9A%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20%20%20(numbers.iter().copied().min().unwrap()%2C%0A%20%20%20%20%20numbers.iter().copied().max().unwrap())%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20point%20%3D%20(10%2C%2020)%3B%0A%20%20%20%20let%20(x%2C%20y)%20%3D%20point%3B%20%20%2F%2F%20%E8%A7%A3%E6%9E%84%EF%BC%9A%E6%8A%8A%2010%20%E7%BB%91%E5%AE%9A%E7%BB%99%20x%EF%BC%8C20%20%E7%BB%91%E5%AE%9A%E7%BB%99%20y%0A%20%20%20%20println!(%22x%3D%7B%7D%2C%20y%3D%7B%7D%22%2C%20x%2C%20y)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%85%83%E7%BB%84%E4%BD%9C%E4%B8%BA%E5%A4%9A%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20%20%20let%20nums%20%3D%20%5B3%2C%201%2C%204%2C%201%2C%205%2C%209%2C%202%2C%206%5D%3B%0A%20%20%20%20let%20(min%2C%20max)%20%3D%20min_max(%26nums)%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%B0%8F%E5%80%BC%3D%7B%7D%2C%20%E6%9C%80%E5%A4%A7%E5%80%BC%3D%7B%7D%22%2C%20min%2C%20max)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E5%85%83%E7%BB%84%E9%9C%80%E8%A6%81%E5%B0%BE%E9%9A%8F%E9%80%97%E5%8F%B7%E4%BB%A5%E5%8C%BA%E5%88%86%E6%8B%AC%E5%8F%B7%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%20%20%20%20let%20single%20%3D%20(42%2C)%3B%0A%20%20%20%20println!(%22%E5%8D%95%E5%85%83%E7%B4%A0%E5%85%83%E7%BB%84%3A%20%7B%3A%3F%7D%22%2C%20single)%3B%0A%20%20%20%20println!(%22%E8%BF%99%E5%8F%AA%E6%98%AF%E6%8B%AC%E5%8F%B7%3A%20%7B%3A%3F%7D%22%2C%20(42))%3B%20%2F%2F%20%E8%BF%99%E6%98%AF%20i32%EF%BC%8C%E4%B8%8D%E6%98%AF%E5%85%83%E7%BB%84%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> min_max</span><span style="color:#E1E4E8">(numbers</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#6A737D">    // 函数返回元组，实现多返回值</span></span>
<span class="line"><span style="color:#E1E4E8">    (numbers</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">copied</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">min</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#E1E4E8">     numbers</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">copied</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">max</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> point </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (x, y) </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> point;  </span><span style="color:#6A737D">// 解构：把 10 绑定给 x，20 绑定给 y</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x={}, y={}"</span><span style="color:#E1E4E8">, x, y);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 元组作为多返回值</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> nums </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">9</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> (min, max) </span><span style="color:#F97583">=</span><span style="color:#B392F0"> min_max</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">nums);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最小值={}, 最大值={}"</span><span style="color:#E1E4E8">, min, max);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 只有一个元素的元组需要尾随逗号以区分括号表达式</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> single </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">,);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"单元素元组: {:?}"</span><span style="color:#E1E4E8">, single);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这只是括号: {:?}"</span><span style="color:#E1E4E8">, (</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 这是 i32，不是元组</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 数组

数组存储**相同类型**的多个值，长度**编译时固定**，存储在栈上：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E7%B1%BB%E5%9E%8B%E6%A0%87%E6%B3%A8%E6%A0%BC%E5%BC%8F%EF%BC%9A%5B%E5%85%83%E7%B4%A0%E7%B1%BB%E5%9E%8B%3B%20%E9%95%BF%E5%BA%A6%5D%0A%20%20%20%20let%20xs%3A%20%5Bi32%3B%205%5D%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%0A%20%20%20%20%2F%2F%20%E7%94%A8%E7%9B%B8%E5%90%8C%E5%80%BC%E5%88%9D%E5%A7%8B%E5%8C%96%EF%BC%9A%5B%E5%88%9D%E5%A7%8B%E5%80%BC%3B%20%E9%95%BF%E5%BA%A6%5D%0A%20%20%20%20let%20zeros%3A%20%5Bi32%3B%203%5D%20%3D%20%5B0%3B%203%5D%3B%20%20%2F%2F%20%5B0%2C%200%2C%200%5D%0A%0A%20%20%20%20println!(%22%E7%AC%AC%E4%B8%80%E4%B8%AA%3A%20%7B%7D%22%2C%20xs%5B0%5D)%3B%0A%20%20%20%20println!(%22%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%3A%20%7B%7D%22%2C%20xs%5Bxs.len()%20-%201%5D)%3B%0A%20%20%20%20println!(%22%E9%95%BF%E5%BA%A6%3A%20%7B%7D%22%2C%20xs.len())%3B%0A%20%20%20%20println!(%22zeros%3A%20%7B%3A%3F%7D%22%2C%20zeros)%3B%0A%0A%20%20%20%20%2F%2F%20%E8%B6%8A%E7%95%8C%E8%AE%BF%E9%97%AE%E4%BC%9A%20panic%EF%BC%88%E8%BF%90%E8%A1%8C%E6%97%B6%E9%94%99%E8%AF%AF%EF%BC%89%0A%20%20%20%20%2F%2F%20println!(%22%7B%7D%22%2C%20xs%5B10%5D)%3B%20%20%2F%2F%20panic%3A%20index%20out%20of%20bounds%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 类型标注格式：[元素类型; 长度]</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> xs</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 用相同值初始化：[初始值; 长度]</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> zeros</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> [</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">; </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];  </span><span style="color:#6A737D">// [0, 0, 0]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"第一个: {}"</span><span style="color:#E1E4E8">, xs[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"最后一个: {}"</span><span style="color:#E1E4E8">, xs[xs</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">]);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"长度: {}"</span><span style="color:#E1E4E8">, xs</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"zeros: {:?}"</span><span style="color:#E1E4E8">, zeros);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 越界访问会 panic（运行时错误）</span></span>
<span class="line"><span style="color:#6A737D">    // println!("{}", xs[10]);  // panic: index out of bounds</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 数组长度是**类型的一部分**：`[i32; 5]` 和 `[i32; 6]` 是两种不同类型，不能互相赋值。同时注意在使用数组时不能越界（即不能使用超出数组大小的索引）

# 运算符

## 常用运算符

Rust 支持算术、布尔、位运算等常见运算符，用法与 C 语言基本一致：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E7%AE%97%E6%9C%AF%E8%BF%90%E7%AE%97%0A%20%20%20%20println!(%225%20%2B%203%20%3D%20%7B%7D%22%2C%205i32%20%2B%203)%3B%0A%20%20%20%20println!(%225%20-%203%20%3D%20%7B%7D%22%2C%205i32%20-%203)%3B%0A%20%20%20%20println!(%221%20-%202%20%3D%20%7B%7D%22%2C%201i32%20-%202)%3B%20%20%2F%2F%20%E6%9C%89%E7%AC%A6%E5%8F%B7%E6%89%8D%E8%83%BD%E5%BE%97%E5%88%B0%E8%B4%9F%E6%95%B0%0A%0A%20%20%20%20%2F%2F%20%E6%95%B4%E6%95%B0%E9%99%A4%E6%B3%95%EF%BC%9A%E7%BB%93%E6%9E%9C%E5%90%91%E9%9B%B6%E6%88%AA%E6%96%AD%EF%BC%88%E4%B8%8D%E6%98%AF%E5%90%91%E4%B8%8B%E5%8F%96%E6%95%B4%EF%BC%89%0A%20%20%20%20println!(%225%20%2F%202%20%3D%20%7B%7D%22%2C%205i32%20%2F%202)%3B%20%20%20%2F%2F%202%EF%BC%8C%E4%B8%8D%E6%98%AF%202.5%0A%20%20%20%20println!(%222%20%2F%203%20%3D%20%7B%7D%22%2C%202i32%20%2F%203)%3B%20%20%20%2F%2F%200%EF%BC%81%E6%B3%A8%E6%84%8F%E8%BF%99%E4%B8%AA%E9%99%B7%E9%98%B1%0A%20%20%20%20println!(%2243%20%25%205%20%3D%20%7B%7D%22%2C%2043i32%20%25%205)%3B%20%2F%2F%20%E5%8F%96%E4%BD%99%20%3D%203%0A%0A%20%20%20%20%2F%2F%20%E5%B8%83%E5%B0%94%E8%BF%90%E7%AE%97%EF%BC%88%E7%9F%AD%E8%B7%AF%E6%B1%82%E5%80%BC%EF%BC%89%0A%20%20%20%20println!(%22true%20%26%26%20false%20%3D%20%7B%7D%22%2C%20true%20%26%26%20false)%3B%0A%20%20%20%20println!(%22true%20%7C%7C%20false%20%3D%20%7B%7D%22%2C%20true%20%7C%7C%20false)%3B%0A%0A%20%20%20%20%2F%2F%20%E4%BD%8D%E8%BF%90%E7%AE%97%0A%20%20%20%20println!(%220b0011%20%26%200b0101%20%3D%20%7B%3A04b%7D%22%2C%200b0011u32%20%26%200b0101)%3B%20%20%2F%2F%20AND%0A%20%20%20%20println!(%220b0011%20%7C%200b0101%20%3D%20%7B%3A04b%7D%22%2C%200b0011u32%20%7C%200b0101)%3B%20%20%2F%2F%20OR%0A%20%20%20%20println!(%220b0011%20%5E%200b0101%20%3D%20%7B%3A04b%7D%22%2C%200b0011u32%20%5E%200b0101)%3B%20%20%2F%2F%20XOR%0A%20%20%20%20println!(%221%20%3C%3C%203%20%3D%20%7B%7D%22%2C%201u32%20%3C%3C%203)%3B%20%20%20%2F%2F%20%E5%B7%A6%E7%A7%BB%0A%20%20%20%20println!(%2216%20%3E%3E%202%20%3D%20%7B%7D%22%2C%2016u32%20%3E%3E%202)%3B%20%2F%2F%20%E5%8F%B3%E7%A7%BB%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 算术运算</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"5 + 3 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"5 - 3 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> -</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1 - 2 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> -</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 有符号才能得到负数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 整数除法：结果向零截断（不是向下取整）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"5 / 2 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> /</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// 2，不是 2.5</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"2 / 3 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> /</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// 0！注意这个陷阱</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"43 % 5 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">43</span><span style="color:#B392F0">i32</span><span style="color:#F97583"> %</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 取余 = 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 布尔运算（短路求值）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"true &amp;&amp; false = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">true</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"true || false = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">true</span><span style="color:#F97583"> ||</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 位运算</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"0b0011 &amp; 0b0101 = {:04b}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0b0011</span><span style="color:#B392F0">u32</span><span style="color:#F97583"> &amp;</span><span style="color:#79B8FF"> 0b0101</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// AND</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"0b0011 | 0b0101 = {:04b}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0b0011</span><span style="color:#B392F0">u32</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> 0b0101</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// OR</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"0b0011 ^ 0b0101 = {:04b}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0b0011</span><span style="color:#B392F0">u32</span><span style="color:#F97583"> ^</span><span style="color:#79B8FF"> 0b0101</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// XOR</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"1 &lt;&lt; 3 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#B392F0">u32</span><span style="color:#F97583"> &lt;&lt;</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// 左移</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"16 &gt;&gt; 2 = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">16</span><span style="color:#B392F0">u32</span><span style="color:#F97583"> &gt;&gt;</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 右移</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **无符号整数减法陷阱**：`1u32 - 2u32` 会 panic（溢出）。如果可能出现负数，应使用有符号类型。

## 优先级完整列表

当一个表达式里有多个运算符时，**谁先算、谁后算**由优先级决定。优先级高的运算符先计算，同级从左到右。

Rust 的运算符优先级与 C 语言**高度相似**，如果你有 C/C++ 背景，大部分直觉可以直接沿用。主要差异在于：Rust 没有 C 的三目运算符 `? :`，`as` 类型转换替代了 C 的强制类型转换，以及比较运算符不支持链式写法。

下表从高到低排列 Rust 的运算符优先级：

| 优先级 | 运算符 | 说明 | 结合性 |
| --- | --- | --- | --- |
| 1（最高） | `expr.field`、`expr.method()` | 字段访问、方法调用 | 左到右 |
| 2 | `expr[index]` | 索引 | 左到右 |
| 3 | `expr?` | 错误传播 | — |
| 4 | `-expr`、`!expr`、`*expr`、`&expr`、`&mut expr` | 一元运算符（取负、逻辑非、解引用、借用） | 右到左 |
| 5 | `as` | 类型转换 | 左到右 |
| 6 | `*`、`/`、`%` | 乘、除、取余 | 左到右 |
| 7 | `+`、`-` | 加、减 | 左到右 |
| 8 | `<<`、`>>` | 位移 | 左到右 |
| 9 | `&` | 位与（Bitwise AND） | 左到右 |
| 10 | `^` | 位异或（Bitwise XOR） | 左到右 |
| 11 | `|` | 位或（Bitwise OR） | 左到右 |
| 12 | `==`、`!=`、`<`、`>`、`<=`、`>=` | 比较运算符 | 要求括号 |
| 13 | `&&` | 逻辑与（短路） | 左到右 |
| 14 | `||` | 逻辑或（短路） | 左到右 |
| 15 | `..`、`..=` | 区间 | — |
| 16 | `=`、`+=`、`-=`、`*=`、`/=`、`%=`、`&=`、`|=`、`^=`、`<<=`、`>>=` | 赋值与复合赋值 | 右到左 |
| 17（最低） | `return`、`break`、闭包 | 控制流表达式 | — |

> 比较运算符（==、!=、<、> 等）**不支持链式比较**：`1 < x < 10` 在 Rust 中是非法的，必须写成 `1 < x && x < 10`。

## 常见场景示例

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%B9%98%E9%99%A4%E4%BC%98%E5%85%88%E4%BA%8E%E5%8A%A0%E5%87%8F%EF%BC%88%E5%92%8C%E6%95%B0%E5%AD%A6%E4%B8%80%E6%A0%B7%EF%BC%89%0A%20%20%20%20println!(%22%7B%7D%22%2C%202%20%2B%203%20*%204)%3B%20%20%20%20%20%2F%2F%2014%EF%BC%8C%E4%B8%8D%E6%98%AF%2020%0A%0A%20%20%20%20%2F%2F%20%E4%BD%8D%E8%BF%90%E7%AE%97%E4%BC%98%E5%85%88%E7%BA%A7%E4%BD%8E%E4%BA%8E%E7%AE%97%E6%9C%AF%EF%BC%8C%E5%B8%B8%E9%9C%80%E6%8B%AC%E5%8F%B7%0A%20%20%20%20println!(%22%7B%7D%22%2C%201%20%2B%202%20%26%203)%3B%20%20%20%20%20%2F%2F%20%E5%85%88%E7%AE%97%201%2B2%3D3%EF%BC%8C%E5%86%8D%203%263%3D3%0A%20%20%20%20println!(%22%7B%7D%22%2C%201%20%2B%20(2%20%26%203))%3B%20%20%20%2F%2F%20%E5%85%88%E7%AE%97%202%263%3D2%EF%BC%8C%E5%86%8D%201%2B2%3D3%EF%BC%88%E4%B8%8D%E5%90%8C%EF%BC%81%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E6%AF%94%E8%BE%83%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BC%98%E5%85%88%E7%BA%A7%E4%BD%8E%E4%BA%8E%E7%AE%97%E6%9C%AF%0A%20%20%20%20println!(%22%7B%7D%22%2C%202%20%2B%203%20%3E%204)%3B%20%20%20%20%20%2F%2F%20%E5%85%88%E7%AE%97%202%2B3%3D5%EF%BC%8C%E5%86%8D%205%3E4%3Dtrue%0A%0A%20%20%20%20%2F%2F%20%E9%80%BB%E8%BE%91%E4%B8%8E%E4%BC%98%E5%85%88%E4%BA%8E%E9%80%BB%E8%BE%91%E6%88%96%0A%20%20%20%20println!(%22%7B%7D%22%2C%20true%20%7C%7C%20false%20%26%26%20false)%3B%20%2F%2F%20%E5%85%88%E7%AE%97%20false%26%26false%3Dfalse%EF%BC%8C%E5%86%8D%20true%7C%7Cfalse%3Dtrue%0A%0A%20%20%20%20%2F%2F%20as%20%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E4%BC%98%E5%85%88%E7%BA%A7%E8%BE%83%E9%AB%98%0A%20%20%20%20let%20x%20%3D%203.99_f64%20as%20i32%20%2B%201%3B%20%20%20%2F%2F%20%E5%85%88%20as%EF%BC%9A3.99%E2%86%923%EF%BC%8C%E5%86%8D%203%2B1%3D4%0A%20%20%20%20println!(%22%7B%7D%22%2C%20x)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 乘除优先于加减（和数学一样）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 3</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// 14，不是 20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 位运算优先级低于算术，常需括号</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> &amp;</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// 先算 1+2=3，再 3&amp;3=3</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#F97583"> +</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">2</span><span style="color:#F97583"> &amp;</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// 先算 2&amp;3=2，再 1+2=3（不同！）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 比较运算符优先级低于算术</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 3</span><span style="color:#F97583"> &gt;</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// 先算 2+3=5，再 5&gt;4=true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 逻辑与优先于逻辑或</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">true</span><span style="color:#F97583"> ||</span><span style="color:#79B8FF"> false</span><span style="color:#F97583"> &amp;&amp;</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 先算 false&amp;&amp;false=false，再 true||false=true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // as 类型转换优先级较高</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3.99_</span><span style="color:#B392F0">f64</span><span style="color:#F97583"> as</span><span style="color:#B392F0"> i32</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;   </span><span style="color:#6A737D">// 先 as：3.99→3，再 3+1=4</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, x);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 最佳实践：多用括号

通常一个有经验的程序员都会使用括号来避免产生优先级问题。优先级规则记不住没关系——**加括号让意图更清晰**，比依赖优先级更好：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%205%3B%0A%20%20%20%20let%20b%20%3D%203%3B%0A%20%20%20%20let%20c%20%3D%202%3B%0A%0A%20%20%20%20%2F%2F%20%E4%B8%8D%E6%B8%85%E6%99%B0%EF%BC%9A%E8%AF%BB%E8%80%85%E8%A6%81%E8%AE%B0%E5%BF%86%E4%BC%98%E5%85%88%E7%BA%A7%0A%20%20%20%20let%20r1%20%3D%20a%20%2B%20b%20*%20c%20%26%200xFF%3B%0A%0A%20%20%20%20%2F%2F%20%E6%B8%85%E6%99%B0%EF%BC%9A%E6%8B%AC%E5%8F%B7%E6%98%8E%E7%A1%AE%E6%AF%8F%E6%AD%A5%E6%84%8F%E5%9B%BE%0A%20%20%20%20let%20r2%20%3D%20(a%20%2B%20(b%20*%20c))%20%26%200xFF%3B%0A%0A%20%20%20%20println!(%22%7B%7D%20%7B%7D%22%2C%20r1%2C%20r2)%3B%20%2F%2F%20%E7%BB%93%E6%9E%9C%E7%9B%B8%E5%90%8C%EF%BC%8C%E4%BD%86%20r2%20%E7%9A%84%E5%86%99%E6%B3%95%E6%9B%B4%E6%98%93%E7%BB%B4%E6%8A%A4%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 不清晰：读者要记忆优先级</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF"> 0xFF</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 清晰：括号明确每步意图</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> r2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> (b </span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> c)) </span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF"> 0xFF</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} {}"</span><span style="color:#E1E4E8">, r1, r2); </span><span style="color:#6A737D">// 结果相同，但 r2 的写法更易维护</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **Clippy 会提示**：当表达式中混合了不同类的运算符（如算术和位运算）而没有括号时，`cargo clippy` 会建议你加上括号，这是 Rust 社区推荐的风格。

# 练习题

## 整数类型的范围

加载题目中…

## 默认整数类型

```rust
let x = 42;
let y: i64 = 100;
let z = 255u8;
```

加载题目中…

## 元组的访问方式

```rust
fn main() {
    let t = (10, "hello", 3.14);
    println!("{}", t.1);
}
```

加载题目中…

## char 的特点

加载题目中…

## 数组类型标注

加载题目中…

## 数组越界

```rust
fn main() {
    let arr = [1, 2, 3];
    println!("{}", arr[5]);
}
```

加载题目中…

## 整数除法

```rust
fn main() {
    let x: i32 = 7 / 2;
    println!("{}", x);
}
```

加载题目中…

## 整型溢出行为

加载题目中…

## 优先级计算

```rust
fn main() {
    println!("{}", 2 + 3 * 4 - 1);
}
```

加载题目中…

## 函数返回值与单元类型

```rust
fn say_hello() {
    println!("Hello!");
}

fn main() {
    let x = say_hello();
    println!("{:?}", x);
}
```

加载题目中…

## 编程练习 1

下面函数接受一个坐标元组并计算两点之间的距离，但有一处访问方式写错了，请修复：

```rust
fn distance(p1: (f64, f64), p2: (f64, f64)) -> f64 {
    let dx = p1[0] - p2[0]; // 错误的访问方式
    let dy = p1[1] - p2[1]; // 错误的访问方式
    (dx * dx + dy * dy).sqrt()
}

fn main() {
    let a = (0.0, 0.0);
    let b = (3.0, 4.0);
    println!("{}", distance(a, b));
}
```

## 编程练习 2

下面函数想计算百分比，但因为整数除法导致结果总是 `0.0`，请修复使其输出正确结果。

```rust
fn percentage(part: i32, total: i32) -> f64 {
    (part / total * 100) as f64
}

fn main() {
    println!("{:.1}", percentage(1, 3));
    println!("{:.1}", percentage(2, 5));
}
```