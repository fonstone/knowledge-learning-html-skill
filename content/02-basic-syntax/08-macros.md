# 宏的基础

## 什么是宏

你已经频繁使用过`println!`宏了。是时候看清楚它背后的机制，并学会编写自己的宏了。

**宏**（Macro）是一种”为写代码而写代码”的机制，称为**元编程**（metaprogramming）。宏在**编译时展开**——编译器遇到宏调用时，先把它展开成普通代码，再编译生成的代码。

宏调用有一个显眼的标志：名称后跟感叹号 `!`。

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22%E8%BF%99%E6%98%AF%E5%AE%8F%E8%B0%83%E7%94%A8%22)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20println!%20%E5%B1%95%E5%BC%80%E4%B8%BA%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%89%93%E5%8D%B0%E4%BB%A3%E7%A0%81%0A%20%20%20%20let%20v%20%3D%20vec!%5B10%2C%2020%2C%2030%5D%3B%20%20%20%20%20%20%20%20%2F%2F%20vec!%20%E5%B1%95%E5%BC%80%E4%B8%BA%E5%88%9B%E5%BB%BA%20Vec%20%E7%9A%84%E4%BB%A3%E7%A0%81%0A%20%20%20%20let%20s%20%3D%20format!(%22%E7%BB%93%E6%9E%9C%EF%BC%9A%7B%7D%22%2C%2042)%3B%20%2F%2F%20format!%20%E5%B1%95%E5%BC%80%E4%B8%BA%E6%9E%84%E5%BB%BA%20String%20%E7%9A%84%E4%BB%A3%E7%A0%81%0A%20%20%20%20println!(%22%7B%3A%3F%7D%20%20%7B%7D%22%2C%20v%2C%20s)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这是宏调用"</span><span style="color:#E1E4E8">);          </span><span style="color:#6A737D">// println! 展开为格式化打印代码</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">];        </span><span style="color:#6A737D">// vec! 展开为创建 Vec 的代码</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#B392F0"> format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"结果：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// format! 展开为构建 String 的代码</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}  {}"</span><span style="color:#E1E4E8">, v, s);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **本文范围说明**：Rust 的宏分为两大类——**声明宏**（`macro_rules!`）和**过程宏**。本文只讲解声明宏。过程宏涉及 `TokenStream`、`syn`、`quote` 等进阶概念，难度较高，已单独成章，详见[过程宏](#/chapters/21-proc-macros/00-index)。

## 宏与函数的核心区别

宏能做到函数做不到的三件事：

**一、接受可变数量的参数。** 函数签名必须写明参数个数，宏不需要：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%22)%3B%0A%20%20%20%20println!(%22%E4%B8%A4%E4%B8%AA%EF%BC%9A%7B%7D%22%2C%2099)%3B%0A%20%20%20%20println!(%22%E5%9B%9B%E4%B8%AA%EF%BC%9A%7B%7D%20%7B%7D%20%7B%7D%22%2C%20%22a%22%2C%20%22b%22%2C%20%22c%22)%3B%0A%20%20%20%20%2F%2F%20%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%E6%97%A0%E6%B3%95%E5%81%9A%E5%88%B0%E5%8F%82%E6%95%B0%E4%B8%AA%E6%95%B0%E5%8F%AF%E5%8F%98%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"一个参数"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"两个：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">99</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"四个：{} {} {}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"c"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // 普通函数无法做到参数个数可变</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**二、可以在编译时生成代码（例如 trait 实现）。**
像 `#[derive(Debug)]` 这类宏，能在**编译期**为你自动“写”出实现 `Debug` trait 的完整 Rust 源代码，并交给编译器一起翻译成机器码。
普通函数绝对做不到这一点。因为普通函数只有在程序编译完成、进入**运行期**后才会被真正的执行。当函数运行时，程序已经是底层的机器码，编译器早就“下班”了，根本无法再接收和处理任何新生成的代码。
因此，“写代码”这个动作，只能交给在编译阶段就提前激活的**宏**来完成。

> `#[derive(...)]` 可能会令你疑惑，不是刚讲了是属性吗，现在怎么又说是宏了呢？这其实是因为从**语法层面**看`#[derive(...)]`是一个属性，但从**实现原理**看，它由**过程宏**提供支持——编译器在编译时调用这些宏，自动生成代码。这是 Rust 元编程的核心体现。详细原理见[过程宏](#/chapters/21-proc-macros/00-index)。本章仅了解即可。

**三、必须在调用前定义或引入。** 这与函数不同——函数可以在文件任意位置定义，宏的作用域是**顺序**的：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20greet!()%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E6%AD%A4%E5%A4%84%E5%AE%8F%E5%B0%9A%E6%9C%AA%E5%AE%9A%E4%B9%89%0A%7D%0A%0Amacro_rules!%20greet%20%7B%0A%20%20%20%20()%20%3D%3E%20%7B%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22)%3B%20%7D%3B%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    greet!</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 错误：此处宏尚未定义</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> greet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    () </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好！"</span><span style="color:#E1E4E8">); };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

把宏定义移到调用之前就能正常工作：

<div class="code-runner" data-full-code="macro_rules!%20greet%20%7B%0A%20%20%20%20()%20%3D%3E%20%7B%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22)%3B%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20greet!()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> greet</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    () </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好！"</span><span style="color:#E1E4E8">); };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    greet!</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 第一个声明宏

`macro_rules!` 让你编写基于**模式匹配**的宏。语法结构：

```text
macro_rules! 宏名 {
    (模式1) => { 展开代码1 };
    (模式2) => { 展开代码2 };
}
```

调用宏时，编译器依次用输入去匹配各规则，使用**第一个匹配成功**的规则展开：

<div class="code-runner" data-full-code="macro_rules!%20say%20%7B%0A%20%20%20%20%2F%2F%20%E8%A7%84%E5%88%99%201%EF%BC%9A%E7%A9%BA%E5%8F%82%E6%95%B0%0A%20%20%20%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%B8%96%E7%95%8C%EF%BC%81%22)%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20%2F%2F%20%E8%A7%84%E5%88%99%202%EF%BC%9A%E4%B8%80%E4%B8%AA%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%20%20%20%20(%24msg%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E6%B6%88%E6%81%AF%EF%BC%9A%7B%7D%22%2C%20%24msg)%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20%2F%2F%20%E8%A7%84%E5%88%99%203%EF%BC%9A%E4%B8%A4%E4%B8%AA%E8%A1%A8%E8%BE%BE%E5%BC%8F%0A%20%20%20%20(%24a%3Aexpr%2C%20%24b%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%2B%20%7B%7D%20%3D%20%7B%7D%22%2C%20%24a%2C%20%24b%2C%20%24a%20%2B%20%24b)%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20say!()%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99%201%0A%20%20%20%20say!(%22Rust%22)%3B%20%20%20%20%20%2F%2F%20%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99%202%0A%20%20%20%20say!(10%2C%2020)%3B%20%20%20%20%20%2F%2F%20%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99%203%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> say</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 规则 1：空参数</span></span>
<span class="line"><span style="color:#E1E4E8">    () </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"你好，世界！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#6A737D">    // 规则 2：一个表达式</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">msg</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"消息：{}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">msg);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#6A737D">    // 规则 3：两个表达式</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">b</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} + {} = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">b, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a </span><span style="color:#F97583">+</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">b);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    say!</span><span style="color:#E1E4E8">();           </span><span style="color:#6A737D">// 匹配规则 1</span></span>
<span class="line"><span style="color:#B392F0">    say!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Rust"</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// 匹配规则 2</span></span>
<span class="line"><span style="color:#B392F0">    say!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// 匹配规则 3</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 元变量与片段类型

模式中用 `$名称:片段类型` 捕获传入的代码片段，称为**元变量**（metavariable）。片段类型决定能匹配哪种代码：

| 片段类型 | 匹配内容 | 示例 | 说明 |
| --- | --- | --- | --- |
| `expr` | 任意表达式 | `1+2`、`"hello"`、`foo()` | 能计算出值的代码，最常用 |
| `ty` | 任意类型 | `i32`、`String`、`Vec<u8>` | 类型标注中使用 |
| `ident` | 标识符 | `x`、`my_fn`、`Point` | 变量名、函数名、类型名等（不能是表达式） |
| `literal` | 字面量 | `42`、`"text"`、`true`、`3.14` | 具体的值，不是变量 |
| `pat` | 模式 | `Some(x)`、`(a, b)`、`_` | match/if let 分支的模式 |
| `stmt` | 单条语句 | `let x = 1;`、`foo();` | 以分号结尾的单行代码 |
| `block` | 代码块 | `{ let x = 1; x + 1 }` | 花括号包裹的多行代码 |
| `tt` | Token 树 | 任何东西 | 最宽泛的类型，作为”兜底方案” |

**实际应用**：

<div class="code-runner" data-full-code="macro_rules!%20create_fn%20%7B%0A%20%20%20%20%2F%2F%20%24name%3Aident%20%E5%8C%B9%E9%85%8D%E5%87%BD%E6%95%B0%E5%90%8D%EF%BC%8C%24ret%3Aty%20%E5%8C%B9%E9%85%8D%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%EF%BC%8C%24body%3Ablock%20%E5%8C%B9%E9%85%8D%E5%87%BD%E6%95%B0%E4%BD%93%0A%20%20%20%20(%24name%3Aident%2C%20%24ret%3Aty%2C%20%24body%3Ablock)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20fn%20%24name()%20-%3E%20%24ret%20%24body%0A%20%20%20%20%7D%3B%0A%7D%0A%0A%2F%2F%20%E5%AE%8F%E5%B1%95%E5%BC%80%E5%90%8E%E7%AD%89%E4%BB%B7%E4%BA%8E%EF%BC%9Afn%20add_one()%20-%3E%20i32%20%7B%2041%20%2B%201%20%7D%0Acreate_fn!(add_one%2C%20i32%2C%20%7B%2041%20%2B%201%20%7D)%3B%0A%0A%2F%2F%20%E5%B1%95%E5%BC%80%E5%90%8E%EF%BC%9Afn%20greeting()%20-%3E%20String%20%7B%20%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22.to_string()%20%7D%0Acreate_fn!(greeting%2C%20String%2C%20%7B%20%22%E4%BD%A0%E5%A5%BD%EF%BC%81%22.to_string()%20%7D)%3B%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20add_one())%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20greeting())%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> create_fn</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // $name:ident 匹配函数名，$ret:ty 匹配返回类型，$body:block 匹配函数体</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">name</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">ident, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">ret</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">ty, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">body</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">block) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        fn</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">name() </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">ret </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">body</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 宏展开后等价于：fn add_one() -&gt; i32 { 41 + 1 }</span></span>
<span class="line"><span style="color:#B392F0">create_fn!</span><span style="color:#E1E4E8">(add_one, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, { </span><span style="color:#79B8FF">41</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 展开后：fn greeting() -&gt; String { "你好！".to_string() }</span></span>
<span class="line"><span style="color:#B392F0">create_fn!</span><span style="color:#E1E4E8">(greeting, </span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">, { </span><span style="color:#9ECBFF">"你好！"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">() });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_one</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">greeting</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### tt 的特殊地位

`tt`（token tree）是最宽泛的片段类型。**重要**：`tt` 能匹配**单个 token 或完整的括号对**，但不能匹配像 `3 + 5` 这样跨越多个不括号的 token。

<div class="code-runner" data-full-code="macro_rules!%20my_debug%20%7B%0A%20%20%20%20%2F%2F%20%E6%8E%A5%E6%94%B6%E4%BB%BB%E6%84%8F%E5%8D%95%E4%B8%AA%20token%20%E6%88%96%E6%8B%AC%E5%8F%B7%E5%AF%B9%0A%20%20%20%20(%24x%3Att)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20%24x)%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%0A%0A%20%20%20%20my_debug!(42)%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8D%95%E4%B8%AA%E5%AD%97%E9%9D%A2%E9%87%8F%20%E2%9C%93%0A%20%20%20%20my_debug!(true)%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8D%95%E4%B8%AA%E5%AD%97%E9%9D%A2%E9%87%8F%20%E2%9C%93%0A%20%20%20%20my_debug!(x)%3B%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8D%95%E4%B8%AA%E6%A0%87%E8%AF%86%E7%AC%A6%20%E2%9C%93%0A%20%20%20%20my_debug!((3%20%2B%205))%3B%20%20%20%20%20%20%2F%2F%20%E6%8B%AC%E5%8F%B7%E5%AF%B9%20%E2%9C%93%0A%20%20%20%20%2F%2F%20my_debug!(3%20%2B%205)%3B%20%20%20%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9A%E5%A4%9A%E4%B8%AA%E4%B8%8D%E6%8B%AC%E5%8F%B7%E7%9A%84%20token%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> my_debug</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 接收任意单个 token 或括号对</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">tt) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x);</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    my_debug!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);           </span><span style="color:#6A737D">// 单个字面量 ✓</span></span>
<span class="line"><span style="color:#B392F0">    my_debug!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">);         </span><span style="color:#6A737D">// 单个字面量 ✓</span></span>
<span class="line"><span style="color:#B392F0">    my_debug!</span><span style="color:#E1E4E8">(x);            </span><span style="color:#6A737D">// 单个标识符 ✓</span></span>
<span class="line"><span style="color:#B392F0">    my_debug!</span><span style="color:#E1E4E8">((</span><span style="color:#79B8FF">3</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">));      </span><span style="color:#6A737D">// 括号对 ✓</span></span>
<span class="line"><span style="color:#6A737D">    // my_debug!(3 + 5);     // ✗ 错误：多个不括号的 token</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**tt 的实际用途**：在需要原样转发给其他宏时（通常配合重复模式 `$(...)*`，后面会讲）：

<div class="code-runner" data-full-code="macro_rules!%20passthrough%20%7B%0A%20%20%20%20(%24(%24t%3Att)*)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E6%8A%8A%E6%89%80%E6%9C%89%20token%20%E5%8E%9F%E5%B0%81%E4%B8%8D%E5%8A%A8%E5%9C%B0%E6%94%BE%E5%88%B0%20println!%20%E9%87%8C%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%AE%8F%E5%B1%95%E5%BC%80%E5%90%8E%E7%AD%89%E4%BB%B7%E4%BA%8E%EF%BC%9Aprintln!(%22%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%9A%7B%7D%20%2B%20%7B%7D%20%3D%20%7B%7D%22%2C%201%2C%202%2C%203)%0A%20%20%20%20%20%20%20%20println!(%24(%24t)*)%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20passthrough!(%22%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%9A%7B%7D%20%2B%20%7B%7D%20%3D%20%7B%7D%22%2C%201%2C%202%2C%203)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> passthrough</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">t</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">tt)</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 把所有 token 原封不动地放到 println! 里</span></span>
<span class="line"><span style="color:#6A737D">        // 宏展开后等价于：println!("格式化：{} + {} = {}", 1, 2, 3)</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">t)</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    passthrough!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"格式化：{} + {} = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 重复模式

重复模式让一条规则能匹配不定数量的输入，是声明宏最强大的特性之一。

语法：`$( 捕获内容 ) 分隔符? 量词`，这里很类似正则表达式的写法

| 量词 | 含义 |
| --- | --- |
| `*` | 零次或多次 |
| `+` | 一次或多次 |
| `?` | 零次或一次（不能有分隔符） |

### 逗号分隔的列表

标准库的 `vec!` 宏就是用重复模式实现的，下面是简化版：

<div class="code-runner" data-full-code="macro_rules!%20my_vec%20%7B%0A%20%20%20%20%2F%2F%20%24(%20%24x%3Aexpr%20)%2C*%20%20%E2%86%90%20%20%E5%8C%B9%E9%85%8D%EF%BC%9A%E9%9B%B6%E4%B8%AA%E6%88%96%E5%A4%9A%E4%B8%AA%22%E8%A1%A8%E8%BE%BE%E5%BC%8F%22%EF%BC%8C%E4%B8%AD%E9%97%B4%E7%94%A8%E9%80%97%E5%8F%B7%E5%88%86%E9%9A%94%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E8%A6%81%E7%94%A8%E5%88%86%E5%8F%B7%E5%88%86%E9%9A%94%EF%BC%8C%E5%86%99%E6%B3%95%E5%B0%B1%E6%98%AF%EF%BC%9A%24(%20%24x%3Aexpr%20)%3B*%0A%20%20%20%20(%20%24(%20%24x%3Aexpr%20)%2C*%20)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20let%20mut%20v%20%3D%20Vec%3A%3Anew()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%24(%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%B1%95%E5%BC%80%E5%8C%BA%EF%BC%9A%E5%AF%B9%E6%AF%8F%E4%B8%AA%20%24x%20%E9%87%8D%E5%A4%8D%E8%BF%99%E6%AE%B5%E4%BB%A3%E7%A0%81%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20v.push(%24x)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20)*%0A%20%20%20%20%20%20%20%20%20%20%20%20v%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%20%20%20%20%2F%2F%20%E6%94%AF%E6%8C%81%E6%9C%AB%E5%B0%BE%E5%A4%9A%E4%BD%99%E7%9A%84%E9%80%97%E5%8F%B7%EF%BC%88my_vec!%5B1%2C%202%2C%203%2C%5D%EF%BC%89%0A%20%20%20%20(%20%24(%20%24x%3Aexpr%20)%2C%2B%20%2C%20)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20my_vec!%5B%24(%24x)%2C*%5D%20%20%20%20%2F%2F%E9%80%92%E5%BD%92%E4%BD%BF%E7%94%A8%E8%87%AA%E5%B7%B1%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20a%20%3D%20my_vec!%5B1%2C%202%2C%203%5D%3B%0A%20%20%20%20let%20b%20%3D%20my_vec!%5B%22x%22%2C%20%22y%22%2C%20%22z%22%2C%20%22w%22%5D%3B%0A%20%20%20%20let%20c%3A%20Vec%3Ci32%3E%20%3D%20my_vec!%5B%5D%3B%20%20%20%2F%2F%20%E9%9B%B6%E4%B8%AA%E5%8F%82%E6%95%B0%E4%B9%9F%E5%90%88%E6%B3%95%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20a)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20b)%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20c)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> my_vec</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // $( $x:expr ),*  ←  匹配：零个或多个"表达式"，中间用逗号分隔</span></span>
<span class="line"><span style="color:#6A737D">    // 如果要用分号分隔，写法就是：$( $x:expr );*</span></span>
<span class="line"><span style="color:#E1E4E8">    ( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr ),</span><span style="color:#F97583">*</span><span style="color:#E1E4E8"> ) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#F97583">            let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">            $</span><span style="color:#E1E4E8">(               </span><span style="color:#6A737D">// 展开区：对每个 $x 重复这段代码</span></span>
<span class="line"><span style="color:#E1E4E8">                v</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x);</span></span>
<span class="line"><span style="color:#E1E4E8">            )</span><span style="color:#F97583">*</span></span>
<span class="line"><span style="color:#E1E4E8">            v</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#6A737D">    // 支持末尾多余的逗号（my_vec![1, 2, 3,]）</span></span>
<span class="line"><span style="color:#E1E4E8">    ( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr ),</span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> , ) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        my_vec!</span><span style="color:#E1E4E8">[</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x),</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">]    </span><span style="color:#6A737D">//递归使用自己</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> a </span><span style="color:#F97583">=</span><span style="color:#B392F0"> my_vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> b </span><span style="color:#F97583">=</span><span style="color:#B392F0"> my_vec!</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">"x"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"y"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"z"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"w"</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> my_vec!</span><span style="color:#E1E4E8">[];   </span><span style="color:#6A737D">// 零个参数也合法</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, a);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, b);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, c);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

拆解 `$( $x:expr ),*`：

- $( ) — 捕获组的开始与结束
- $x:expr — 在组内捕获一个表达式，命名为 $x
- , — 每次重复之间的 分隔符 （可选，可以是任意 token）
- * — 重复零次或多次

**三种不同调用的展开示例**：

```rust
// 调用 1：my_vec![1, 2, 3]
// 展开后：
let a = {
    let mut v = Vec::new();
    v.push(1);      // 这是语句（有分号）
    v.push(2);      // 这是语句（有分号）
    v.push(3);      // 这是语句（有分号）
    v               // 最后是表达式（无分号），作为块的返回值
};

// 调用 2：my_vec!["x", "y", "z", "w"]
// 展开后：
let b = {
    let mut v = Vec::new();
    v.push("x");
    v.push("y");
    v.push("z");
    v.push("w");
    v
};

// 调用 3：my_vec![]
// 展开后（零个元素）：
let c = {
    let mut v = Vec::new();
    // $( v.push($x); )* 重复 0 次，所以中间什么都没有
    v
};
```

> **为什么 `$( v.push($x); )*` 后面没有分号？**
> 因为 `v.push($x);` 里面**已经有分号了**。展开时，每次重复生成的代码都是完整的语句：
> `v.push(1);  v.push(2);  v.push(3);`
> 如果在 `)*` 后面再加分号，就变成了：
> `v.push(1);  v.push(2);  v.push(3);;  // ✗ 双分号，错误`
> **为什么`( $( $x:expr ),* )`有两层 `{}`？**
> 宏展开后，我们希望能写 `let a = my_vec![1, 2, 3];` 这样的代码。但 `let mut v = Vec::new()` 是**语句**，不是**表达式**，无法直接放在赋值号的右边。在 Rust 中，赋值号右边必须是表达式才能返回一个值。
> 所以宏需要：
> **外层 `{}` 是宏语法**——`=> { ... }` 这是定义宏展开体的必须写法
> **内层 `{}` 是代码块表达式**——把多个语句包裹成一个表达式，这样整个块可以在赋值位置使用，最后一行 `v` 成为块的返回值
> 对比：
> `// ✗ 没有内层 {} 的展开（错误）
> let a = let mut v = Vec::new(); v.push(1); v;
> // ✓ 有内层 {} 的展开（正确）
> let a = { let mut v = Vec::new(); v.push(1); v };`

### 加号量词（至少一次）

用 `+` 表示至少一次重复。对比 `*` 的区别就是：`*` 可以零次，`+` 必须至少一次。

<div class="code-runner" data-full-code="macro_rules!%20print_all%20%7B%0A%20%20%20%20%2F%2F%20%E7%94%A8%20%2B%20%E8%A1%A8%E7%A4%BA%E8%87%B3%E5%B0%91%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%EF%BC%8C%E7%94%A8%E9%80%97%E5%8F%B7%E5%88%86%E9%9A%94%0A%20%20%20%20(%20%24(%20%24x%3Aexpr%20)%2C%2B%20)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%24(%0A%20%20%20%20%20%20%20%20%20%20%20%20print!(%22%7B%7D%20%22%2C%20%24x)%3B%0A%20%20%20%20%20%20%20%20)*%0A%20%20%20%20%20%20%20%20println!()%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20print_all!(1)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%93%20%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%0A%20%20%20%20print_all!(10%2C%2020%2C%2030)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%93%20%E5%A4%9A%E4%B8%AA%E5%8F%82%E6%95%B0%0A%20%20%20%20print_all!(%22a%22%2C%20%22b%22%2C%20%22c%22%2C%20%22d%22)%3B%20%20%20%20%20%2F%2F%20%E2%9C%93%20%E5%A4%9A%E4%B8%AA%E5%8F%82%E6%95%B0%0A%20%20%20%20%2F%2F%20print_all!()%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%97%20%E9%94%99%E8%AF%AF%EF%BC%9A%2B%20%E8%A6%81%E6%B1%82%E8%87%B3%E5%B0%91%E4%B8%80%E4%B8%AA%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> print_all</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 用 + 表示至少一个参数，用逗号分隔</span></span>
<span class="line"><span style="color:#E1E4E8">    ( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">( </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr ),</span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> ) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        $</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#B392F0">            print!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} "</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x);</span></span>
<span class="line"><span style="color:#E1E4E8">        )</span><span style="color:#F97583">*</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    print_all!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);                      </span><span style="color:#6A737D">// ✓ 一个参数</span></span>
<span class="line"><span style="color:#B392F0">    print_all!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">20</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">);             </span><span style="color:#6A737D">// ✓ 多个参数</span></span>
<span class="line"><span style="color:#B392F0">    print_all!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"c"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"d"</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// ✓ 多个参数</span></span>
<span class="line"><span style="color:#6A737D">    // print_all!();                    // ✗ 错误：+ 要求至少一个</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**展开示例**：

```rust
print_all!(10, 20)  展开为：
    print!("{} ", 10);
    print!("{} ", 20);
    println!();
```

### 问号量词（零或一次）

用 `?` 表示可选的（零次或一次）。**注意：`?` 不能有分隔符**。

<div class="code-runner" data-full-code="macro_rules!%20config%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%AF%E9%80%89%E7%9A%84%E8%B5%8B%E5%80%BC%EF%BC%9Aconfig!(name)%20%E6%88%96%20config!(name%20%3D%20value)%0A%20%20%20%20(%24name%3Aident%20%24(%20%3D%20%24val%3Aexpr%20)%3F)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20let%20v%3A%20usize%20%3D%200%20%24(%20%2B%20%24val%20)%3F%3B%20%20%2F%2F%20%E6%9C%89%E5%80%BC%E5%88%99%E5%8A%A0%E4%B8%8A%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%88%99%E4%BF%9D%E6%8C%81%200%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E9%85%8D%E7%BD%AE%20%7B%7D%3A%20%7B%7D%22%2C%20stringify!(%24name)%2C%20v)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20v%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20config!(max_size)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E2%9C%93%20%E6%97%A0%E8%B5%8B%E5%80%BC%0A%20%20%20%20config!(buffer_size%20%3D%2064)%3B%20%20%2F%2F%20%E2%9C%93%20%E6%9C%89%E8%B5%8B%E5%80%BC%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> config</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">    // 可选的赋值：config!(name) 或 config!(name = value)</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">name</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">ident </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">( </span><span style="color:#F97583">=</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">val</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr )</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#F97583">            let</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">( </span><span style="color:#F97583">+</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">val )</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 有值则加上，没有则保持 0</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"配置 {}: {}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">stringify!</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">name), v);</span></span>
<span class="line"><span style="color:#E1E4E8">            v</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    config!</span><span style="color:#E1E4E8">(max_size);          </span><span style="color:#6A737D">// ✓ 无赋值</span></span>
<span class="line"><span style="color:#B392F0">    config!</span><span style="color:#E1E4E8">(buffer_size </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 64</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// ✓ 有赋值</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**展开示例**：

```rust
config!(max_size)  展开为：
    let v: usize = 0;
    println!("配置 {}: {}", "max_size", v);

config!(buffer_size = 64)  展开为：
    let v: usize = 0 + 64;
    println!("配置 {}: {}", "buffer_size", v);
```

# 进阶与作用域

## 宏的卫生性

Rust 的声明宏是**卫生的**（hygienic）。这意味着：

1. 宏内部定义的变量不会污染外层作用域 — 下面代码里宏内的 tmp 不会覆盖调用者的 tmp
1. 调用者的变量也不会污染宏内部 — 但通过参数传入的变量除外

简单理解：**宏内部是隔离的**，宏内新定义的名字不会逃逸出去。

<div class="code-runner" data-full-code="macro_rules!%20swap%20%7B%0A%20%20%20%20(%24a%3Aexpr%2C%20%24b%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%AE%8F%E5%86%85%E7%9A%84%20tmp%20%E5%8F%98%E9%87%8F%E4%B8%8D%E4%BC%9A%E4%B8%8E%E8%B0%83%E7%94%A8%E8%80%85%E7%9A%84%20tmp%20%E5%86%B2%E7%AA%81%EF%BC%88%E5%8D%AB%E7%94%9F%E6%80%A7%EF%BC%89%0A%20%20%20%20%20%20%20%20let%20tmp%20%3D%20%24a%3B%0A%20%20%20%20%20%20%20%20%24a%20%3D%20%24b%3B%0A%20%20%20%20%20%20%20%20%24b%20%3D%20tmp%3B%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20tmp%20%3D%20%22%E8%BF%99%E6%98%AF%E7%94%A8%E6%88%B7%E7%9A%84%20tmp%22.to_string()%3B%20%2F%2F%20%E7%94%A8%E6%88%B7%E6%9C%89%E4%B8%AA%20tmp%0A%20%20%20%20let%20mut%20x%20%3D%2010%3B%0A%20%20%20%20let%20mut%20y%20%3D%2020%3B%0A%20%20%20%20swap!(x%2C%20y)%3B%0A%0A%20%20%20%20println!(%22x%3D%7B%7D%2C%20y%3D%7B%7D%22%2C%20x%2C%20y)%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%2010%20%E5%92%8C%2020%20%E4%BA%92%E6%8D%A2%E4%BA%86%0A%20%20%20%20println!(%22%E7%94%A8%E6%88%B7%E7%9A%84%20tmp%20%E6%B2%A1%E8%A2%AB%E8%A6%86%E7%9B%96%EF%BC%9A%7B%7D%22%2C%20tmp)%3B%20%2F%2F%20%E7%94%A8%E6%88%B7%E7%9A%84%20tmp%20%E4%BE%9D%E7%84%B6%E5%AE%8C%E5%A5%BD%EF%BC%8C%E4%B8%8D%E6%98%AF%E5%AE%8F%E5%86%85%E7%9A%84%20tmp%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> swap</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">b</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // 宏内的 tmp 变量不会与调用者的 tmp 冲突（卫生性）</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> tmp </span><span style="color:#F97583">=</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">a;</span></span>
<span class="line"><span style="color:#F97583">        $</span><span style="color:#E1E4E8">a </span><span style="color:#F97583">=</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">b;</span></span>
<span class="line"><span style="color:#F97583">        $</span><span style="color:#E1E4E8">b </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> tmp;</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> tmp </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "这是用户的 tmp"</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 用户有个 tmp</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 20</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    swap!</span><span style="color:#E1E4E8">(x, y);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"x={}, y={}"</span><span style="color:#E1E4E8">, x, y);           </span><span style="color:#6A737D">// 10 和 20 互换了</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"用户的 tmp 没被覆盖：{}"</span><span style="color:#E1E4E8">, tmp); </span><span style="color:#6A737D">// 用户的 tmp 依然完好，不是宏内的 tmp</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**关键点**：元变量 `$a`、`$b` 传入的是**表达式本身**（`x` 和 `y`），它们属于**调用者的作用域**，所以修改 `$a` 等于直接修改 `x`。

> **注意**：卫生性只对 `ident` 片段和宏内新声明的绑定有效。若用 `$name:ident` 直接拼接出新的标识符（`concat_idents` 这类场景），需要格外小心。

## 模块内作用域

**快速概念预览**：`mod` 是 Rust 的模块系统，用来组织代码。`pub` 关键字使项目对外部可见；没有 `pub` 的项只在模块内可见。在下面的例子中，`square` 宏定义在 `math` 模块内，所以 `main` 函数无法访问它。要深入了解模块系统，见[模块系统](#/chapters/07-modules/00-index)。本页内容目前仅作了解即可。

宏默认只在定义它的**模块及其子模块**内可见，且遵循**顺序规则**（必须先定义后使用）：

<div class="code-runner" data-full-code="mod%20math%20%7B%0A%20%20%20%20macro_rules!%20square%20%7B%0A%20%20%20%20%20%20%20%20(%24x%3Aexpr)%20%3D%3E%20%7B%20%24x%20*%20%24x%20%7D%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20pub%20fn%20demo()%20%7B%0A%20%20%20%20%20%20%20%20println!(%223%C2%B2%20%3D%20%7B%7D%22%2C%20square!(3))%3B%20%2F%2F%20%E5%9C%A8%E5%90%8C%E4%B8%80%E6%A8%A1%E5%9D%97%E5%86%85%E5%8F%AF%E7%94%A8%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20math%3A%3Ademo()%3B%0A%20%20%20%20%2F%2F%20square!(4)%3B%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%9A%E8%BF%99%E9%87%8C%E7%9C%8B%E4%B8%8D%E5%88%B0%20math%20%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84%E5%AE%8F%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> math</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    macro_rules!</span><span style="color:#B392F0"> square</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">*</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">x };</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> demo</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"3² = {}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">square!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 在同一模块内可用</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    math</span><span style="color:#F97583">::</span><span style="color:#B392F0">demo</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">    // square!(4); // 错误：这里看不到 math 模块里的宏</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 跨模块与导出

在子模块上加 `#[macro_use]`，可以把该模块的宏提升到父模块。另外，使用 `#[macro_export]` 可以让宏被**其他 crate** 引入：

<div class="code-runner" data-full-code="%23%5Bmacro_use%5D%0Amod%20helpers%20%7B%0A%20%20%20%20macro_rules!%20double%20%7B%0A%20%20%20%20%20%20%20%20(%24x%3Aexpr)%20%3D%3E%20%7B%20%24x%20*%202%20%7D%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20double!(7))%3B%20%2F%2F%20%E7%88%B6%E6%A8%A1%E5%9D%97%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[macro_use]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> helpers</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    macro_rules!</span><span style="color:#B392F0"> double</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> { </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">double!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">7</span><span style="color:#E1E4E8">)); </span><span style="color:#6A737D">// 父模块可以使用</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

在库的开发中，如果你希望宏提供给最终用户使用，可以在宏上面添加 `#[macro_export]`：

<div class="code-runner" data-full-code="%23%5Bmacro_export%5D%0Amacro_rules!%20assert_approx_eq%20%7B%0A%20%20%20%20(%24a%3Aexpr%2C%20%24b%3Aexpr%2C%20%24eps%3Aexpr)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20let%20diff%20%3D%20(%24a%20-%20%24b).abs()%3B%0A%20%20%20%20%20%20%20%20if%20diff%20%3E%20%24eps%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20panic!(%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22%E6%96%AD%E8%A8%80%E5%A4%B1%E8%B4%A5%EF%BC%9A%7C%7B%7D%20-%20%7B%7D%7C%20%3D%20%7B%7D%20%3E%20%7B%7D%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%24a%2C%20%24b%2C%20diff%2C%20%24eps%0A%20%20%20%20%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20assert_approx_eq!(1.0_f64%2C%201.0000001%2C%200.001)%3B%20%2F%2F%20%E9%80%9A%E8%BF%87%0A%20%20%20%20println!(%22%E8%BF%91%E4%BC%BC%E7%9B%B8%E7%AD%89%E6%96%AD%E8%A8%80%E9%80%9A%E8%BF%87%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[macro_export]</span></span>
<span class="line"><span style="color:#B392F0">macro_rules!</span><span style="color:#B392F0"> assert_approx_eq</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">b</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">eps</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">expr) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> diff </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">$</span><span style="color:#E1E4E8">a </span><span style="color:#F97583">-</span><span style="color:#F97583"> $</span><span style="color:#E1E4E8">b)</span><span style="color:#F97583">.</span><span style="color:#B392F0">abs</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> diff &gt; </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">eps {</span></span>
<span class="line"><span style="color:#B392F0">            panic!</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#9ECBFF">                "断言失败：|{} - {}| = {} &gt; {}"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#F97583">                $</span><span style="color:#E1E4E8">a, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">b, diff, </span><span style="color:#F97583">$</span><span style="color:#E1E4E8">eps</span></span>
<span class="line"><span style="color:#E1E4E8">            );</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    assert_approx_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1.0_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1.0000001</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0.001</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 通过</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"近似相等断言通过"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> `#[macro_export]` 会把宏提升到 crate 根作用域，其他 crate 用 `use your_crate::assert_approx_eq;` 引入。

# 常用宏与调试

## 实用标准库宏预览

这里还有一些你可能会用到的宏，现在可以先混个脸熟，防止后面看到后慌乱：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20----%20%E8%B0%83%E8%AF%95%E7%94%A8%20----%0A%20%20%20%20let%20x%20%3D%205%3B%0A%20%20%20%20let%20y%20%3D%20dbg!(x%20*%202%20%2B%201)%3B%20%2F%2F%20%E6%89%93%E5%8D%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%92%8C%E5%80%BC%EF%BC%8C%E8%BF%94%E5%9B%9E%E5%80%BC%E6%9C%AC%E8%BA%AB%0A%20%20%20%20println!(%22y%20%3D%20%7B%7D%22%2C%20y)%3B%0A%0A%20%20%20%20%2F%2F%20----%20%E7%BC%96%E8%AF%91%E6%97%B6%E5%AD%97%E7%AC%A6%E4%B8%B2%20----%0A%20%20%20%20const%20GREET%3A%20%26str%20%3D%20concat!(%22Hello%22%2C%20%22%2C%20%22%2C%20%22world%22%2C%20%22!%22)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20GREET)%3B%0A%0A%20%20%20%20let%20expr%20%3D%20stringify!(1%20%2B%202%20*%203)%3B%20%2F%2F%20%E6%8A%8A%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%BD%AC%E6%88%90%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%8C%E4%B8%8D%E6%B1%82%E5%80%BC%0A%20%20%20%20println!(%22%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%8E%9F%E6%96%87%EF%BC%9A%7B%7D%22%2C%20expr)%3B%0A%0A%20%20%20%20%2F%2F%20----%20%E6%9D%A1%E4%BB%B6%E7%BC%96%E8%AF%91%E4%BF%A1%E6%81%AF%20----%0A%20%20%20%20%2F%2F%20env!(%22CARGO_PKG_VERSION%22)%20%E5%9C%A8%E7%BC%96%E8%AF%91%E6%97%B6%E8%AF%BB%E5%8F%96%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%0A%20%20%20%20let%20version%20%3D%20env!(%22CARGO_PKG_VERSION%22)%3B%0A%20%20%20%20println!(%22%E7%89%88%E6%9C%AC%EF%BC%9A%7B%7D%22%2C%20version)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // ---- 调试用 ----</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> y </span><span style="color:#F97583">=</span><span style="color:#B392F0"> dbg!</span><span style="color:#E1E4E8">(x </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 打印表达式和值，返回值本身</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"y = {}"</span><span style="color:#E1E4E8">, y);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ---- 编译时字符串 ----</span></span>
<span class="line"><span style="color:#F97583">    const</span><span style="color:#79B8FF"> GREET</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> concat!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">", "</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"world"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">GREET</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> expr </span><span style="color:#F97583">=</span><span style="color:#B392F0"> stringify!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 把表达式转成字符串，不求值</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"表达式原文：{}"</span><span style="color:#E1E4E8">, expr);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // ---- 条件编译信息 ----</span></span>
<span class="line"><span style="color:#6A737D">    // env!("CARGO_PKG_VERSION") 在编译时读取环境变量</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> version </span><span style="color:#F97583">=</span><span style="color:#B392F0"> env!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"CARGO_PKG_VERSION"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"版本：{}"</span><span style="color:#E1E4E8">, version);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

<div class="code-runner" data-full-code="fn%20not_done_yet()%20%7B%0A%20%20%20%20todo!(%22%E7%AD%89%E4%BB%A5%E5%90%8E%E5%86%8D%E5%AE%9E%E7%8E%B0%22)%3B%20%20%20%20%20%20%20%20%20%2F%2F%20%E8%BF%90%E8%A1%8C%E6%97%B6%20panic%EF%BC%8C%E5%B8%A6%E6%B6%88%E6%81%AF%0A%7D%0A%0Afn%20impossible_path(x%3A%20u8)%20-%3E%20%26'static%20str%20%7B%0A%20%20%20%20match%20x%20%7B%0A%20%20%20%20%20%20%20%200%20%3D%3E%20%22%E9%9B%B6%22%2C%0A%20%20%20%20%20%20%20%201..%3D255%20%3D%3E%20%22%E9%9D%9E%E9%9B%B6%22%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20unreachable!(%22u8%20%E4%B8%8D%E5%8F%AF%E8%83%BD%E8%B6%85%E8%BF%87%20255%22)%2C%20%2F%2F%20%E5%91%8A%E8%AF%89%E7%BC%96%E8%AF%91%E5%99%A8%E6%AD%A4%E5%A4%84%E4%B8%8D%E5%8F%AF%E8%BE%BE%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20impossible_path(42))%3B%0A%20%20%20%20not_done_yet()%3B%20%2F%2F%20%E4%BC%9A%20panic%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> not_done_yet</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    todo!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"等以后再实现"</span><span style="color:#E1E4E8">);         </span><span style="color:#6A737D">// 运行时 panic，带消息</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> impossible_path</span><span style="color:#E1E4E8">(x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">'</span><span style="color:#B392F0">static</span><span style="color:#B392F0"> str</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> x {</span></span>
<span class="line"><span style="color:#79B8FF">        0</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "零"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">        1</span><span style="color:#F97583">..=</span><span style="color:#79B8FF">255</span><span style="color:#F97583"> =&gt;</span><span style="color:#9ECBFF"> "非零"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> unreachable!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"u8 不可能超过 255"</span><span style="color:#E1E4E8">), </span><span style="color:#6A737D">// 告诉编译器此处不可达</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">impossible_path</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    not_done_yet</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 会 panic</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 调试宏展开

**为什么需要调试宏**：宏在编译时展开，不像普通代码那样好追踪。如果宏没有按预期工作，你需要看到实际展开后的代码才能理解发生了什么。

**使用 cargo-expand 工具**：

安装工具：

```bash
cargo install cargo-expand
```

常见用法：

```bash
cargo expand              # 展开整个 crate，输出所有宏展开结果
cargo expand my_module   # 只展开指定模块
cargo expand my_module::my_macro  # 只展开特定宏
```

**实际例子**：

假设你的代码中有这个宏调用：

```rust
my_vec![1, 2, 3]
```

运行 `cargo expand` 后会看到：

```rust
// 展开后的代码
let a = {
    let mut v = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    v
};
```

**常见用途**：

1. 排查宏展开错误 — 看不懂编译错误时，查看展开代码能帮你理解宏生成了什么
1. 调试变量捕获 — 确认元变量是否正确替换（比如 $x 是否替换成了你期望的值）
1. 验证分隔符和重复 — 确认 $( ... )* 是否按预期重复展开

**在哪里运行**：`cargo expand` 是**命令行工具**，在项目的根目录（`Cargo.toml` 所在位置）运行。它会自动检测当前 Cargo 项目，展开该项目中的所有宏。展开结果输出到**终端**（标准输出），不会写入代码文件——你需要查看输出来理解展开后的代码。

**注意**：如果宏有语法错误，`cargo expand` 会直接报错，不会输出展开结果。展开失败时的错误信息就是调试的关键线索。

# 练习题

## 基础测验

加载题目中…

加载题目中…

```rust
macro_rules! let_bind {
    ($name:ident = $val:expr) => {
        let $name = $val;
    };
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

### 练习一：定义 `print_twice!` 宏

定义一个 `print_twice!` 宏，接受一个表达式，将该值打印两次（每次单独一行）。

```rust
// 在这里定义 print_twice! 宏

fn main() {
    print_twice!(42);
    print_twice!("Hello");
}
```

### 练习二：实现 `max!` 宏

实现一个 `max!` 宏，接受**两个**表达式，返回较大的值。提示：宏可以展开为 `if` 表达式。

```rust
macro_rules! max {
    // TODO：填写规则，接受两个表达式，返回较大的那个
}

fn main() {
    println!("{}", max!(3, 7));     // 7
    println!("{}", max!(10, 2));    // 10
    println!("{}", max!(-1, -5));   // -1
}
```

### 练习三：实现 `repeat_str!` 宏

实现一个 `repeat_str!` 宏，接受多个字符串字面量，返回它们连接后的结果。

示例：`repeat_str!("Hello", " ", "world")` 应该返回 `"Hello world"`。

```rust
macro_rules! repeat_str {
    // TODO：实现宏，使用重复模式 + 分隔符匹配字符串列表
}

fn main() {
    let greeting = repeat_str!("Hello");
    println!("{}", greeting);

    let message = repeat_str!("Hello", " ", "world", "!");
    println!("{}", message);

    let words = repeat_str!("Rust", " ", "is", " ", "awesome");
    println!("{}", words);
}
```