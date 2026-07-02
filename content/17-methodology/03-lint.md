# Lint 基础

编译器会帮你检查代码能不能运行，而 **lint** 工具则会进一步检查代码**写得好不好**——即使编译通过，lint 也能发现潜在的 bug、低效写法或不符合惯例的代码。

Rust 内置了两层 lint 系统：编译器自带的警告，以及功能更强大的 **Clippy** 工具。

## 编译器内置 lint

Rust 编译器本身就会发出一些警告（warning），这些警告就是最基础的 lint。常见的有：

<div class="code-runner" data-full-code="fn%20unused_function()%20%7B%0A%20%20%20%20%2F%2F%20%E6%9C%AA%E8%A2%AB%E8%B0%83%E7%94%A8%E7%9A%84%E5%87%BD%E6%95%B0%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20x%20%3D%205%3B%20%2F%2F%20%E5%A3%B0%E6%98%8E%E4%BA%86%E4%BD%86%E6%B2%A1%E7%94%A8%EF%BC%9Adead_code%20%2F%20unused_variables%0A%20%20%20%20println!(%22Hello%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> unused_function</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 未被调用的函数</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> x </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// 声明了但没用：dead_code / unused_variables</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

运行上面代码时，编译器会输出警告：

```text
warning: unused variable: `x`
warning: function `unused_function` is never used
```

> 警告不会阻止编译，但应当认真对待——在成熟项目中，警告数量应尽量保持为零。

## 用属性控制 lint 级别

每条 lint 都可以设置四种级别：

| 级别 | 属性 | 效果 |
| --- | --- | --- |
| 允许 | `#[allow(lint_name)]` | 静默这条警告 |
| 警告 | `#[warn(lint_name)]` | 显示警告（默认） |
| 错误 | `#[deny(lint_name)]` | 将警告升级为编译错误 |
| 禁止 | `#[forbid(lint_name)]` | 错误且不能被 allow 覆盖 |

作用范围可以是整个 crate（`#![]` 内部属性）或单个函数/结构体（`#[]` 外部属性）：

<div class="code-runner" data-full-code="%2F%2F%20%E6%95%B4%E4%B8%AA%20crate%20%E7%BA%A7%E5%88%AB%EF%BC%9A%E5%85%81%E8%AE%B8%E6%9C%AA%E4%BD%BF%E7%94%A8%E4%BB%A3%E7%A0%81%EF%BC%88%E8%B0%83%E8%AF%95%E6%97%B6%E5%B8%B8%E7%94%A8%EF%BC%89%0A%23!%5Ballow(dead_code)%5D%0A%23!%5Ballow(unused_variables)%5D%0A%0Afn%20helper()%20%7B%7D%20%20%20%2F%2F%20%E4%B8%8D%E5%86%8D%E8%AD%A6%E5%91%8A%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20_unused%20%3D%2042%3B%20%20%2F%2F%20%E4%B8%8D%E5%86%8D%E8%AD%A6%E5%91%8A%0A%20%20%20%20println!(%22ok%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 整个 crate 级别：允许未使用代码（调试时常用）</span></span>
<span class="line"><span style="color:#E1E4E8">#![allow(dead_code)]</span></span>
<span class="line"><span style="color:#E1E4E8">#![allow(unused_variables)]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> helper</span><span style="color:#E1E4E8">() {}   </span><span style="color:#6A737D">// 不再警告</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> _unused </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 不再警告</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"ok"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

<div class="code-runner" data-full-code="%2F%2F%20%E5%B0%86%E6%9F%90%E6%9D%A1%E8%AD%A6%E5%91%8A%E5%8D%87%E7%BA%A7%E4%B8%BA%E9%94%99%E8%AF%AF%E2%80%94%E2%80%94%E9%80%82%E5%90%88%E5%9C%A8%20CI%20%E4%B8%AD%E5%BC%BA%E5%88%B6%E6%89%A7%E8%A1%8C%0A%23!%5Bdeny(unused_must_use)%5D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20Result%20%E5%BF%85%E9%A1%BB%E8%A2%AB%E5%A4%84%E7%90%86%EF%BC%8C%E5%90%A6%E5%88%99%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5%0A%20%20%20%20let%20result%3A%20Result%3Ci32%2C%20%26str%3E%20%3D%20Ok(1)%3B%0A%20%20%20%20let%20_%20%3D%20result%3B%20%2F%2F%20%E9%9C%80%E8%A6%81%E6%98%BE%E5%BC%8F%E5%A4%84%E7%90%86%0A%20%20%20%20println!(%22ok%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 将某条警告升级为错误——适合在 CI 中强制执行</span></span>
<span class="line"><span style="color:#E1E4E8">#![deny(unused_must_use)]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // Result 必须被处理，否则编译失败</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Result</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">&amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Ok</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> _ </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> result; </span><span style="color:#6A737D">// 需要显式处理</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"ok"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 生产项目中常见的做法是在 `lib.rs` 或 `main.rs` 顶部添加 `#![deny(warnings)]`，把所有警告都变成错误，配合 CI 确保代码质量。

## 常见内置 lint

| Lint 名称 | 触发场景 |
| --- | --- |
| `dead_code` | 定义了但从不调用的函数、结构体等 |
| `unused_variables` | 声明了但没有使用的变量 |
| `unused_imports` | 引入了但没有用到的 `use` |
| `unused_must_use` | 没有处理返回 `#[must_use]` 的值（如 `Result`） |
| `non_snake_case` | 变量/函数不符合 snake_case 命名规范 |
| `non_camel_case_types` | 类型名不符合 CamelCase 规范 |

> 用 `_` 前缀可以抑制单个变量的 `unused_variables` 警告：`let _temp = foo();`

# Clippy

## 什么是 Clippy

`cargo clippy` 是 Rust 官方的 lint 工具，内置 **700+ 条规则**，远超编译器自带的警告。它能发现：

- 可以简化的代码
- 常见的性能陷阱
- 容易引发 bug 的写法
- 不符合 Rust 惯例的模式

安装（随 rustup 自动安装，通常已有）：

```bash
rustup component add clippy
```

运行：

```bash
cargo clippy           # 检查当前项目
cargo clippy -- -D warnings  # 将所有 clippy 警告升级为错误（CI 推荐）
```

## Clippy 的 lint 分类

Clippy 把规则分成以下几个类别：

| 分类 | 说明 | 默认状态 |
| --- | --- | --- |
| `correctness` | 几乎肯定是 bug | **错误**（deny） |
| `suspicious` | 很可能是 bug 或误用 | **警告** |
| `style` | 不符合 Rust 惯用写法 | **警告** |
| `complexity` | 可以简化的复杂写法 | **警告** |
| `perf` | 有更高效的替代写法 | **警告** |
| `pedantic` | 更严格的风格检查 | 默认关闭 |
| `nursery` | 实验性规则 | 默认关闭 |
| `restriction` | 特定场景的限制性规则 | 默认关闭 |

## 典型 Clippy 警告示例

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20clippy%3A%3Alen_zero%EF%BC%9A%E5%BA%94%E8%AF%A5%E7%94%A8%20.is_empty()%20%E4%BB%A3%E6%9B%BF%20.len()%20%3D%3D%200%0A%20%20%20%20let%20v%3A%20Vec%3Ci32%3E%20%3D%20vec!%5B%5D%3B%0A%20%20%20%20if%20v.len()%20%3D%3D%200%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%E7%A9%BA%22)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20clippy%3A%3Aneedless_return%EF%BC%9A%E4%B8%8D%E5%BF%85%E8%A6%81%E7%9A%84%20return%0A%20%20%20%20%2F%2F%20clippy%20%E4%BC%9A%E5%BB%BA%E8%AE%AE%E5%8E%BB%E6%8E%89%20return%0A%0A%20%20%20%20%2F%2F%20clippy%3A%3Amap_unwrap_or%EF%BC%9A%E5%8F%AF%E4%BB%A5%E7%94%A8%20map_or%20%E6%9B%BF%E4%BB%A3%20.map().unwrap_or()%0A%20%20%20%20let%20opt%3A%20Option%3Ci32%3E%20%3D%20Some(5)%3B%0A%20%20%20%20let%20_x%20%3D%20opt.map(%7Cv%7C%20v%20*%202).unwrap_or(0)%3B%0A%20%20%20%20%2F%2F%20clippy%20%E5%BB%BA%E8%AE%AE%EF%BC%9Aopt.map_or(0%2C%20%7Cv%7C%20v%20*%202)%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // clippy::len_zero：应该用 .is_empty() 代替 .len() == 0</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[];</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"空"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // clippy::needless_return：不必要的 return</span></span>
<span class="line"><span style="color:#6A737D">    // clippy 会建议去掉 return</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // clippy::map_unwrap_or：可以用 map_or 替代 .map().unwrap_or()</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> opt</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Option</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">&gt; </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Some</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> _x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> opt</span><span style="color:#F97583">.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">|</span><span style="color:#E1E4E8">v</span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> v </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">.</span><span style="color:#B392F0">unwrap_or</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    // clippy 建议：opt.map_or(0, |v| v * 2)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 针对 Clippy 的属性控制

和内置 lint 一样，可以用属性静默特定 Clippy 规则：

<div class="code-runner" data-full-code="%2F%2F%20%E5%85%81%E8%AE%B8%E6%95%B4%E4%B8%AA%E6%96%87%E4%BB%B6%E4%BD%BF%E7%94%A8%E6%9F%90%E4%BA%9B%20clippy%20%E8%A7%84%E5%88%99%0A%23!%5Ballow(clippy%3A%3Aneedless_return)%5D%0A%0Afn%20get_value()%20-%3E%20i32%20%7B%0A%20%20%20%20return%2042%3B%20%2F%2F%20clippy%20%E6%9C%AC%E6%9D%A5%E4%BC%9A%E8%AD%A6%E5%91%8A%E8%BF%99%E9%87%8C%EF%BC%8C%E7%8E%B0%E5%9C%A8%E8%A2%AB%E9%9D%99%E9%BB%98%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%8F%AA%E5%85%81%E8%AE%B8%E8%BF%99%E4%B8%80%E8%A1%8C%E7%9A%84%E7%89%B9%E5%AE%9A%20clippy%20%E8%A7%84%E5%88%99%0A%20%20%20%20%23%5Ballow(clippy%3A%3Alen_zero)%5D%0A%20%20%20%20let%20check%20%3D%20vec!%5B1%2C%202%5D.len()%20%3D%3D%200%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20check)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// 允许整个文件使用某些 clippy 规则</span></span>
<span class="line"><span style="color:#E1E4E8">#![allow(clippy</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">needless_return)]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> get_value</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">; </span><span style="color:#6A737D">// clippy 本来会警告这里，现在被静默</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 只允许这一行的特定 clippy 规则</span></span>
<span class="line"><span style="color:#E1E4E8">    #[allow(clippy</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">len_zero)]</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> check </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">]</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, check);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 静默 lint 应该是例外而不是常规操作。遇到 Clippy 警告时，首先思考能否按建议修改，确实有充分理由才 `#[allow]`。

## 常用 Clippy 规则速查

| 规则 | 建议 |
| --- | --- |
| `clippy::len_zero` | 用 `.is_empty()` 替代 `.len() == 0` |
| `clippy::needless_return` | 去掉多余的 `return` |
| `clippy::clone_on_copy` | `Copy` 类型不需要 `.clone()` |
| `clippy::unwrap_used` | 避免直接 `.unwrap()`，处理错误 |
| `clippy::map_unwrap_or` | 用 `.map_or()` 替代 `.map().unwrap_or()` |
| `clippy::redundant_clone` | 不必要的 `.clone()` |
| `clippy::dbg_macro` | 发布前移除 `dbg!()` 调用 |
| `clippy::todo` | 提醒 `todo!()` 未完成的代码 |

# rustfmt

`rustfmt` 是 Rust 官方的代码格式化工具。它和 Clippy 解决的是不同层面的问题：Clippy 关注**代码逻辑和最佳实践**，rustfmt 关注**代码排版外观**——缩进、空格、换行、括号位置等。

两者的配合：先用 rustfmt 统一格式，消除格式噪音；再用 Clippy 关注实质性的逻辑问题。

## 什么是 rustfmt

rustfmt 按照 Rust 社区约定的风格重新排版代码，消除团队内部的格式争论（“括号要不要换行？""缩进用 2 还是 4 个空格？”）。

安装（随 rustup 自动安装）：

```bash
rustup component add rustfmt
```

运行：

```bash
cargo fmt           # 格式化整个项目（直接修改文件）
cargo fmt --check   # 只检查，不修改（CI 中使用）
```

`cargo fmt --check` 在文件格式不符合规范时以非零退出码退出，适合放入 CI 流水线，强制所有提交都经过格式检查。

## rustfmt.toml 配置

在项目根目录创建 `rustfmt.toml`（或 `.rustfmt.toml`）可以自定义格式规则。大多数项目使用默认规则即可，常见的调整有：

```toml
# rustfmt.toml
edition = "2021"          # Rust 版本（影响部分格式规则）
max_width = 100           # 最大行宽（默认 100）
use_small_heuristics = "Max"  # 尽量把短表达式放在同一行
imports_granularity = "Crate" # 将同一 crate 的 use 合并
group_imports = "StdExternalCrate"  # use 分组：std / 外部 / 本地
```

> **团队项目的建议**：把 `rustfmt.toml` 提交进版本库，保证所有人使用相同的格式规则。同时在 CI 中加上 `cargo fmt --check`，不符合格式的 PR 无法通过。

## 在 CI 中强制格式检查

格式化的最大价值在于**自动化强制**——不依赖每个人手动运行，而是让 CI 帮你把关。典型的 CI 格式检查步骤：

```bash
cargo fmt --check          # 检查格式（不修改文件）
cargo clippy -- -D warnings  # 检查 lint（警告视为错误）
```

当开发者忘记格式化时，CI 会失败，提示其本地运行 `cargo fmt` 后重新提交。

## 与编辑器集成

rustfmt 最常见的使用方式不是手动运行，而是**保存时自动格式化**：

- VS Code ：安装 rust-analyzer 后，在设置中开启 editor.formatOnSave = true ，并将 Rust 文件的默认格式化器设为 rust-analyzer
- 其他编辑器 ：大多数主流编辑器（Vim、Emacs、IntelliJ）都有对应的 Rust 插件支持保存时格式化

保存时自动格式化后，你几乎不需要再思考格式问题——代码永远保持规范，`cargo fmt --check` 在 CI 中也永远通过。

# 练习题

## Lint 级别

加载题目中…

## 前缀 _ 的作用

加载题目中…

## cargo clippy 与 cargo build 的区别

加载题目中…

## #[forbid] 与 #[deny] 的区别

加载题目中…

## rustfmt 使用

加载题目中…

加载题目中…