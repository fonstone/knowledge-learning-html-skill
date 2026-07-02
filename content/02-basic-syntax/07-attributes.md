# 属性基础

属性（attribute）是 Rust 中为代码附加**元数据**的机制。元数据就是**对代码的附加信息和标签**——比如”这个函数是测试函数”、“这段代码只在 Windows 平台编译”、“忽略这个未使用的变量的警告”。属性用 `#[...]` 的语法写在代码前面。编译器读取这些标签，并根据标签改变编译行为。

## 什么是属性

**属性不是代码本身，而是对代码的注解**。编译器根据不同的属性做不同的事情。属性用 `#[...]` 的语法写在代码前面，告诉编译器如何处理这段代码。

比如，如果你写了一个函数但没有使用它，编译器会给出警告。加上 `#[allow(dead_code)]` 属性就能压制这个警告：

<div class="code-runner" data-full-code="%23%5Ballow(dead_code)%5D%20%20%2F%2F%20%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E5%B1%9E%E6%80%A7%EF%BC%8C%E5%91%8A%E8%AF%89%E7%BC%96%E8%AF%91%E5%99%A8%E5%BF%BD%E7%95%A5%22%E6%9C%AA%E4%BD%BF%E7%94%A8%E5%87%BD%E6%95%B0%22%E7%9A%84%E8%AD%A6%E5%91%8A%0Afn%20unused_function()%20%7B%0A%20%20%20%20println!(%22%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%E6%B2%A1%E6%9C%89%E8%A2%AB%E8%B0%83%E7%94%A8%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E4%B8%BB%E7%A8%8B%E5%BA%8F%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[allow(dead_code)]  </span><span style="color:#6A737D">// 这是一个属性，告诉编译器忽略"未使用函数"的警告</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> unused_function</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这个函数没有被调用"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"主程序"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

没有 `#[allow(dead_code)]`，编译器会警告这个函数没被使用。有了这个属性后，警告就被压制了。

## 属性的作用范围

Rust 属性有两种作用范围：

- `#[attribute]` ：作用于紧跟其后的 单个项 （函数、结构体、模块等）
- `#![attribute]` ：作用于 整个 crate 或模块 ，通常放在文件顶部，注意多了一个 !

<div class="code-runner" data-full-code="%2F%2F%20%E6%95%B4%E4%B8%AA%E6%96%87%E4%BB%B6%E7%BA%A7%E5%88%AB%E7%9A%84%E5%B1%9E%E6%80%A7%EF%BC%8C%E6%94%BE%E5%9C%A8%E6%9C%80%E4%B8%8A%E6%96%B9%0A%23!%5Ballow(dead_code)%5D%0A%0A%2F%2F%20%E4%BD%9C%E7%94%A8%E4%BA%8E%E5%8D%95%E4%B8%AA%E5%87%BD%E6%95%B0%0A%23%5Bderive(Debug)%5D%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20i32%2C%0A%20%20%20%20y%3A%20i32%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%203%2C%20y%3A%205%20%7D%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20p)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 整个文件级别的属性，放在最上方</span></span>
<span class="line"><span style="color:#E1E4E8">#![allow(dead_code)]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 作用于单个函数</span></span>
<span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, p);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 常用属性详解

### 警告控制：allow、warn、deny

最简单的属性是 `#[allow(...)]`，用来**禁止某些编译器警告**：

<div class="code-runner" data-full-code="%23%5Ballow(dead_code)%5D%0Afn%20unused_function()%20%7B%0A%20%20%20%20println!(%22%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%E7%8E%B0%E5%9C%A8%E4%B8%8D%E8%A2%AB%E8%B0%83%E7%94%A8%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%E4%B8%BB%E7%A8%8B%E5%BA%8F%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[allow(dead_code)]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> unused_function</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这个函数现在不被调用"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"主程序"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

没有 `#[allow(dead_code)]`，编译器会警告 `unused_function` 没有被调用。但加上这个属性后，警告就被压制了。

`#[warn(...)]` 和 `#[deny(...)]` 用来控制警告级别：

- #[allow(...)] ：压制警告，代码可以通过编译
- #[warn(...)] ：强制显示警告（在被全局关闭时重新启用）
- #[deny(...)] ：把警告当作错误，编译失败

**实际场景**：假设整个项目用 `#![allow(unused_variables)]` 关闭了未使用变量警告，但在某个关键函数中想检查，就可以用 `#[warn(...)]` 重新启用。

### 自动派生：derive

`#[derive(...)]` 告诉编译器**自动为某个类型生成某些功能**：

<div class="code-runner" data-full-code="%23%5Bderive(Debug%2C%20Clone)%5D%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20i32%2C%0A%20%20%20%20y%3A%20i32%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p1%20%3D%20Point%20%7B%20x%3A%203%2C%20y%3A%205%20%7D%3B%0A%20%20%20%20let%20p2%20%3D%20p1.clone()%3B%20%20%2F%2F%20Clone%20%E7%94%B1%20derive%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%0A%20%20%20%20println!(%22p1%3A%20%7B%3A%3F%7D%22%2C%20p1)%3B%20%20%2F%2F%20Debug%20%E7%94%B1%20derive%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%0A%20%20%20%20println!(%22p2%3A%20%7B%3A%3F%7D%22%2C%20p2)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">Clone</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p1 </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> p1</span><span style="color:#F97583">.</span><span style="color:#B392F0">clone</span><span style="color:#E1E4E8">();  </span><span style="color:#6A737D">// Clone 由 derive 自动生成</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p1: {:?}"</span><span style="color:#E1E4E8">, p1);  </span><span style="color:#6A737D">// Debug 由 derive 自动生成</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p2: {:?}"</span><span style="color:#E1E4E8">, p2);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 其他常用属性

- #[deprecated] ：标记已过时的代码，编译器会提示用户使用新版本
- #[must_use] ：标记函数返回值不应被忽视，忽视会得到编译警告
- #[inline] 、 #[inline(always)] 、 #[inline(never)] ：控制函数是否被内联（优化编译结果）
- #[repr(...)] ：控制结构体或枚举在内存中的布局
- #[doc = "..."] ：添加文档注释（也可以用 /// 注释）
- #[non_exhaustive] ：标记结构体或枚举以后可能添加新字段，防止用户全量匹配
- #![crate_name] 、 #![crate_type] ：指定 crate 名称和编译类型。 但这是 rustc 级别属性，只在直接用 `rustc` 编译时有效 。使用 Cargo 项目时，由 Cargo.toml 中的 name 和 crate-type 字段管理，代码中的这两个属性会被忽略（不常用）。

## 属性的参数格式

属性可以带参数，根据参数个数和形式，常见的格式有：

**单个参数**：

```rust
#[allow(dead_code)]          // 单值参数
#[warn(unused_variables)]    // 单值参数
```

**多个参数**：

```rust
#[derive(Debug, Clone)]      // 多个参数用逗号分隔
```

**键值对参数**：

```rust
#[cfg(target_os = "linux")]  // 键值对形式
#[doc = "这是文档注释"]      // 等号形式
```

实际应用中，大多数常用属性都是单值或多值形式。根据不同属性的定义，参数形式会有所不同。

> **属性是固定的**：属性名称由 Rust 语言规定，你不能随意创建属于自己的属性。编译器只能识别特定的属性名（如 `allow`、`derive` 等），其他名称会被编译器忽略或报错。如果你对自定义属性感兴趣，那是一个高级特性（涉及过程宏），暂时不在本章范围内。

# 条件编译

条件编译允许你根据目标平台、编译配置等因素，在编译时选择性地包含或排除某段代码。

## cfg 属性

`#[cfg(...)]` 放在函数或其他项的上方，当条件不满足时，该项**完全不会被编译进二进制文件**：

<div class="code-runner" data-full-code="%2F%2F%20%E5%8F%AA%E5%9C%A8%20Linux%20%E4%B8%8A%E7%BC%96%E8%AF%91%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%0A%23%5Bcfg(target_os%20%3D%20%22linux%22)%5D%0Afn%20platform_info()%20%7B%0A%20%20%20%20println!(%22%E8%BF%90%E8%A1%8C%E5%9C%A8%20Linux%20%E4%B8%8A%22)%3B%0A%7D%0A%0A%2F%2F%20%E5%9C%A8%E9%9D%9E%20Linux%20%E7%B3%BB%E7%BB%9F%E4%B8%8A%E7%BC%96%E8%AF%91%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%0A%23%5Bcfg(not(target_os%20%3D%20%22linux%22))%5D%0Afn%20platform_info()%20%7B%0A%20%20%20%20println!(%22%E8%BF%90%E8%A1%8C%E5%9C%A8%E9%9D%9E%20Linux%20%E7%B3%BB%E7%BB%9F%E4%B8%8A%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20platform_info()%3B%20%2F%2F%20%E6%A0%B9%E6%8D%AE%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%B0%83%E7%94%A8%E5%AF%B9%E5%BA%94%E7%89%88%E6%9C%AC%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 只在 Linux 上编译这个函数</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> platform_info</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"运行在 Linux 上"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 在非 Linux 系统上编译这个函数</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(not(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> platform_info</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"运行在非 Linux 系统上"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    platform_info</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">// 根据平台自动调用对应版本</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

Rust Playground 运行在 Linux 上，所以上面的代码会打印”运行在 Linux 上”。

`cfg` 支持三种逻辑运算符，并且支持组合条件：

<div class="code-runner" data-full-code="%2F%2F%20all%EF%BC%9A%E4%B8%A4%E4%B8%AA%E6%9D%A1%E4%BB%B6%E9%83%BD%E6%BB%A1%E8%B6%B3%0A%23%5Bcfg(all(target_os%20%3D%20%22linux%22%2C%20target_arch%20%3D%20%22x86_64%22))%5D%0Afn%20linux_x64_only()%20%7B%0A%20%20%20%20println!(%22%E4%BB%85%E5%9C%A8%20Linux%20x86_64%20%E4%B8%8A%E8%BF%90%E8%A1%8C%22)%3B%0A%7D%0A%0A%2F%2F%20any%EF%BC%9A%E4%BB%BB%E4%B8%80%E6%9D%A1%E4%BB%B6%E6%BB%A1%E8%B6%B3%0A%23%5Bcfg(any(target_os%20%3D%20%22linux%22%2C%20target_os%20%3D%20%22macos%22))%5D%0Afn%20unix_like()%20%7B%0A%20%20%20%20println!(%22Unix-like%20%E7%B3%BB%E7%BB%9F%22)%3B%0A%7D%0A%0A%2F%2F%20not%EF%BC%9A%E6%9D%A1%E4%BB%B6%E4%B8%8D%E6%BB%A1%E8%B6%B3%0A%23%5Bcfg(not(target_os%20%3D%20%22windows%22))%5D%0Afn%20not_windows()%20%7B%0A%20%20%20%20println!(%22%E9%9D%9E%20Windows%20%E7%B3%BB%E7%BB%9F%22)%3B%0A%7D%0A%0A%2F%2F%20%E7%BB%84%E5%90%88%E6%9D%A1%E4%BB%B6%EF%BC%9A%E5%9C%A8%20Unix%20%E7%B3%BB%E5%88%97%E4%B8%94%E6%98%AF%20x86_64%20%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%BD%86%E4%B8%8D%E6%98%AF%20macOS%0A%23%5Bcfg(all(any(target_os%20%3D%20%22linux%22%2C%20target_os%20%3D%20%22freebsd%22)%2C%20target_arch%20%3D%20%22x86_64%22%2C%20not(target_os%20%3D%20%22macos%22)))%5D%0Afn%20complex_condition()%20%7B%0A%20%20%20%20println!(%22%E6%BB%A1%E8%B6%B3%E5%A4%8D%E6%9D%82%E6%9D%A1%E4%BB%B6%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%23%5Bcfg(all(target_os%20%3D%20%22linux%22%2C%20target_arch%20%3D%20%22x86_64%22))%5D%0A%20%20%20%20linux_x64_only()%3B%0A%0A%20%20%20%20%23%5Bcfg(any(target_os%20%3D%20%22linux%22%2C%20target_os%20%3D%20%22macos%22))%5D%0A%20%20%20%20unix_like()%3B%0A%0A%20%20%20%20%23%5Bcfg(not(target_os%20%3D%20%22windows%22))%5D%0A%20%20%20%20not_windows()%3B%0A%0A%20%20%20%20%23%5Bcfg(all(any(target_os%20%3D%20%22linux%22%2C%20target_os%20%3D%20%22freebsd%22)%2C%20target_arch%20%3D%20%22x86_64%22%2C%20not(target_os%20%3D%20%22macos%22)))%5D%0A%20%20%20%20complex_condition()%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// all：两个条件都满足</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(all(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_arch </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "x86_64"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> linux_x64_only</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"仅在 Linux x86_64 上运行"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// any：任一条件满足</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(any(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "macos"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> unix_like</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Unix-like 系统"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// not：条件不满足</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(not(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "windows"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> not_windows</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"非 Windows 系统"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 组合条件：在 Unix 系列且是 x86_64 架构，但不是 macOS</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(all(any(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "freebsd"</span><span style="color:#E1E4E8">), target_arch </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "x86_64"</span><span style="color:#E1E4E8">, not(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "macos"</span><span style="color:#E1E4E8">)))]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> complex_condition</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"满足复杂条件"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(all(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_arch </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "x86_64"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#B392F0">    linux_x64_only</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(any(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "macos"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#B392F0">    unix_like</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(not(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "windows"</span><span style="color:#E1E4E8">))]</span></span>
<span class="line"><span style="color:#B392F0">    not_windows</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[cfg(all(any(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">, target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "freebsd"</span><span style="color:#E1E4E8">), target_arch </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "x86_64"</span><span style="color:#E1E4E8">, not(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "macos"</span><span style="color:#E1E4E8">)))]</span></span>
<span class="line"><span style="color:#B392F0">    complex_condition</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## cfg! 宏

`cfg!(...)` 是属性的”宏版本”——在**布尔表达式**中使用，编译时就确定返回 `true` 或 `false`：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20if%20cfg!(target_os%20%3D%20%22linux%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E8%BF%99%E6%98%AF%20Linux%20%E7%B3%BB%E7%BB%9F%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E8%BF%99%E4%B8%8D%E6%98%AF%20Linux%20%E7%B3%BB%E7%BB%9F%22)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E5%88%A4%E6%96%AD%E6%98%AF%E5%90%A6%E6%98%AF%20debug%20%E6%9E%84%E5%BB%BA%EF%BC%88Playground%20%E9%BB%98%E8%AE%A4%E6%98%AF%20debug%20%E6%A8%A1%E5%BC%8F%EF%BC%89%0A%20%20%20%20let%20is_debug%20%3D%20cfg!(debug_assertions)%3B%0A%20%20%20%20println!(%22%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F%EF%BC%9A%7B%7D%22%2C%20is_debug)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#B392F0"> cfg!</span><span style="color:#E1E4E8">(target_os </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "linux"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这是 Linux 系统"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"这不是 Linux 系统"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 判断是否是 debug 构建（Playground 默认是 debug 模式）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> is_debug </span><span style="color:#F97583">=</span><span style="color:#B392F0"> cfg!</span><span style="color:#E1E4E8">(debug_assertions);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"调试模式：{}"</span><span style="color:#E1E4E8">, is_debug);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**`#[cfg(...)]` 与 `cfg!(...)` 的关键区别：**

|  | `#[cfg(...)]` | `cfg!(...)` |
| --- | --- | --- |
| 用途 | 控制代码是否编译 | 布尔表达式 |
| 不满足时 | 代码**完全不编译** | 代码编译，值为 `false` |
| 适用场景 | 使用平台专属 API | 运行时根据条件走不同分支 |

**类比 C 语言**：

在 C 语言中有两种条件编译方式：

```c
// 方式 1：编译时排除代码（类似 Rust 的 #[cfg(...)]）
#ifdef LINUX
void linux_only() {
    printf("Only on Linux\n");
}
#endif

// 方式 2：编译时保留代码，运行时判断（类似 Rust 的 cfg!(...)）
void platform_check() {
    if (LINUX) {  // LINUX 是编译时常量，通常通过 -DLINUX 定义
        printf("On Linux\n");
    } else {
        printf("Not on Linux\n");
    }
}
```

对应的 Rust 写法：

```rust
// 方式 1：编译时完全排除代码
#[cfg(target_os = "linux")]
fn linux_only() {
    println!("Only on Linux");
}

// 方式 2：编译时保留代码，运行时判断
fn platform_check() {
    if cfg!(target_os = "linux") {
        println!("On Linux");
    } else {
        println!("Not on Linux");
    }
}
```

**关键区别**：

- C 的 `#ifdef` = Rust 的 #[cfg(...)] ：代码完全不编译进二进制
- C 的 `#define` + `if` = Rust 的 cfg!(...) ：代码都编译进去，运行时判断

这个区别很重要：如果某段代码用了只在特定平台存在的 API，**必须用 `#[cfg(...)]`** 而不是 `if cfg!(...)`，否则在其他平台会因为找不到 API 而编译报错。就像在 C 中，如果用的是平台专属的系统调用（比如 `SetWindowPos` 只在 Windows 上存在），必须用 `#ifdef WIN32` 包裹，而不是 `if (WIN32)` 后再调用，否则编译器会在非 Windows 平台上找不到 `SetWindowPos` 的符号定义而报链接错误。

## 常用内置条件

Rust 提供了大量内置条件键：

| 条件 | 说明 | 常用值 |
| --- | --- | --- |
| `target_os` | 目标操作系统 | `"linux"`, `"macos"`, `"windows"` |
| `target_arch` | 目标 CPU 架构 | `"x86_64"`, `"arm"`, `"wasm32"` |
| `target_family` | 目标系统族 | `"unix"`, `"windows"` |
| `debug_assertions` | 是否开启调试断言 | debug 模式为 true |
| `test` | 是否在运行测试 | 跑 `cargo test` 时为 true |

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E6%A0%B9%E6%8D%AE%E7%B3%BB%E7%BB%9F%E6%97%8F%E5%88%86%E5%88%AB%E5%A4%84%E7%90%86%0A%20%20%20%20if%20cfg!(target_family%20%3D%20%22unix%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22Unix%20%E7%B3%BB%E6%97%8F%EF%BC%88Linux%2FmacOS%EF%BC%89%22)%3B%0A%20%20%20%20%7D%20else%20if%20cfg!(target_family%20%3D%20%22windows%22)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22Windows%22)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E5%88%A4%E6%96%AD%E6%9E%84%E5%BB%BA%E7%B1%BB%E5%9E%8B%0A%20%20%20%20if%20cfg!(debug_assertions)%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%BD%93%E5%89%8D%E6%98%AF%20debug%20%E6%9E%84%E5%BB%BA%EF%BC%88%E5%8C%85%E5%90%AB%E6%96%AD%E8%A8%80%E5%92%8C%E8%B0%83%E8%AF%95%E4%BF%A1%E6%81%AF%EF%BC%89%22)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E5%BD%93%E5%89%8D%E6%98%AF%20release%20%E6%9E%84%E5%BB%BA%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%EF%BC%89%22)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 根据系统族分别处理</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#B392F0"> cfg!</span><span style="color:#E1E4E8">(target_family </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "unix"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Unix 系族（Linux/macOS）"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#B392F0"> cfg!</span><span style="color:#E1E4E8">(target_family </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "windows"</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Windows"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 判断构建类型</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#B392F0"> cfg!</span><span style="color:#E1E4E8">(debug_assertions) {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"当前是 debug 构建（包含断言和调试信息）"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"当前是 release 构建（性能优化）"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 自定义条件

除了内置条件，还可以通过 `--cfg` 标记向编译器传入自定义条件。**重要的是，自定义条件不能像 C 语言的 `#define` 那样在代码里定义，必须从外部传入。**

下面的代码在 Playground 中运行时，`some_condition` 未被定义，因此 `conditional_function` 不会被编译进来：

<div class="code-runner" data-full-code="%2F%2F%20some_condition%20%E6%98%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9D%A1%E4%BB%B6%EF%BC%8C%E9%9C%80%E8%A6%81%E9%80%9A%E8%BF%87%20--cfg%20%E4%BC%A0%E5%85%A5%E6%89%8D%E4%BC%9A%E7%94%9F%E6%95%88%0A%23%5Bcfg(some_condition)%5D%0Afn%20conditional_function()%20%7B%0A%20%20%20%20println!(%22%E6%9D%A1%E4%BB%B6%E6%BB%A1%E8%B6%B3%EF%BC%81%22)%3B%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%9C%A8%20Playground%20%E4%B8%AD%20some_condition%20%E6%9C%AA%E5%AE%9A%E4%B9%89%EF%BC%8Cconditional_function%20%E4%B8%8D%E5%AD%98%E5%9C%A8%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E5%8F%96%E6%B6%88%E4%B8%8B%E9%9D%A2%E7%9A%84%E6%B3%A8%E9%87%8A%E4%BC%9A%E7%BC%96%E8%AF%91%E6%8A%A5%E9%94%99%EF%BC%9A%0A%20%20%20%20%2F%2F%20conditional_function()%3B%0A%20%20%20%20println!(%22%E6%B2%A1%E6%9C%89%E4%BC%A0%E5%85%A5%20--cfg%20some_condition%EF%BC%8C%E6%9D%A1%E4%BB%B6%E5%87%BD%E6%95%B0%E4%B8%8D%E5%AD%98%E5%9C%A8%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// some_condition 是自定义条件，需要通过 --cfg 传入才会生效</span></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(some_condition)]</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> conditional_function</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"条件满足！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 在 Playground 中 some_condition 未定义，conditional_function 不存在</span></span>
<span class="line"><span style="color:#6A737D">    // 如果取消下面的注释会编译报错：</span></span>
<span class="line"><span style="color:#6A737D">    // conditional_function();</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"没有传入 --cfg some_condition，条件函数不存在"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

使用 `rustc` 直接编译时通过 `--cfg` 启用：

```bash
# 不带标记：conditional_function 不被编译，调用它会链接错误
$ rustc custom.rs

# 带标记：some_condition 成立，conditional_function 被编译进来
$ rustc --cfg some_condition custom.rs && ./custom
条件满足！
```

**为什么 Rust 这样设计**：条件应该由编译环境决定（编译参数、目标平台、特性标志等），而不是代码本身决定。这样可以确保同一份源代码在不同的构建配置下得到不同的二进制，而不是靠代码内部的”开关”。对比 C 语言，`#define` 定义在代码里，容易导致同一个源文件在不同团队或工程中产生不同的二进制，难以追踪。

> 在 Cargo 项目中，自定义条件通常通过 `build.rs` 构建脚本或 `Cargo.toml` 中的 `features` 特性标志来管理，而不是直接使用 `--cfg` 命令行标记。

# 练习题

## 属性基础测验

加载题目中…

```rust
fn used() {
    println!("used");
}

fn unused() {
    println!("unused");
}

fn main() {
    used();
}
```

加载题目中…

加载题目中…

## 条件编译测验

加载题目中…

```rust
#[cfg(all(target_os = "linux", target_arch = "x86_64"))]
fn special() {
    println!("special");
}
```

加载题目中…

加载题目中…

## 编程练习

### 练习一：消除 dead_code 警告

下面的代码会产生 `dead_code` 警告，因为 `helper` 函数从未被调用。请添加合适的属性来消除警告，同时保留该函数。

```rust
fn main() {
    println!("主函数运行");
}

fn helper() {
    println!("辅助函数，暂时未使用");
}
```

### 练习二：使用 cfg! 宏判断构建类型

`cfg!(debug_assertions)` 是一个编译时常量，在 debug 模式下为 `true`，release 模式下为 `false`。

**任务**：补全下面代码中的 `???` 部分，使用 `cfg!` 来判断当前构建类型，在 debug 模式打印”调试模式：功能全开”，release 模式打印”发布模式：性能优先”。

（在 Rust Playground （即本网页编辑器） 中默认是 debug 模式，所以你写完后会看到”调试模式”的输出）

```rust
fn main() {
    if ??? {
        println!("调试模式：功能全开");
    } else {
        println!("发布模式：性能优先");
    }
}
```