# 你的第一个 Rust 程序

按照程序员世界的传统，学习一门新语言的第一件事，就是让计算机说出 “Hello, world!”。这不只是仪式感——它能让你快速感受到这门语言最基本的节奏：写代码、编译、运行。

## 创建项目目录

Rust 对代码存放的位置没有任何限制，但养成规范的目录结构是好习惯。我们在主目录下创建一个统一的 `projects` 目录，存放本教程的所有练习。

**Linux / macOS / Windows PowerShell：**

```bash
mkdir ~/projects
cd ~/projects
mkdir hello_world
cd hello_world
```

**Windows CMD：**

```bash
mkdir "%USERPROFILE%\projects"
cd /d "%USERPROFILE%\projects"
mkdir hello_world
cd hello_world
```

> **文件命名约定：** 如果文件名包含多个单词，统一用小写字母并通过下划线分隔，例如 `hello_world.rs`，而不是 `helloworld.rs` 或 `HelloWorld`。这是 Rust 社区的惯例。

## 编写第一个程序

在 `hello_world` 目录下，创建名为 `main.rs` 的文件（Rust 源文件以 `.rs` 结尾），输入以下内容：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22Hello%2C%20world!%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, world!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

保存文件。你刚才写完了人生中第一个 Rust 程序，只有两行代码。接下来我们逐行拆解它。

## 程序解剖：每行代码的含义

这个程序虽然简单，但 Rust 的几个核心语法已经悄悄出现了。

### `fn main()` 是什么？

`fn` 是 **function（函数）** 的缩写，`main` 是这个函数的名字，`()` 表示它不接收任何参数。

<div class="code-runner" data-full-code="%2F%2F%20main%20%E5%87%BD%E6%95%B0%E6%98%AF%E7%A8%8B%E5%BA%8F%E7%9A%84%E5%85%A5%E5%8F%A3%E7%82%B9%0A%2F%2F%20Rust%20%E8%BF%90%E8%A1%8C%E6%97%B6%E6%80%BB%E6%98%AF%E4%BB%8E%E8%BF%99%E9%87%8C%E5%BC%80%E5%A7%8B%E6%89%A7%E8%A1%8C%0Afn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%87%BD%E6%95%B0%E4%BD%93%E6%94%BE%E5%9C%A8%E4%B8%80%E5%AF%B9%E5%A4%A7%E6%8B%AC%E5%8F%B7%E9%87%8C%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#6A737D">// main 函数是程序的入口点</span></span>
<span class="line"><span style="color:#6A737D">// Rust 运行时总是从这里开始执行</span></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 函数体放在一对大括号里</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`main` 函数是每个可执行 Rust 程序的**入口点**——就像马拉松的起跑线，无论程序有多复杂，都从 `main` 跑起来。

> Rust 规范要求左大括号 `{` 和函数声明放在同一行，中间加一个空格。如果你不确定格式是否规范，可以运行 `rustfmt main.rs`，这是 Rust 工具链内置的格式化工具，会自动帮你整理代码风格。

### `println!` 是什么？

注意 `println` 后面有一个感叹号 `!`。在 Rust 中，**带 `!` 的是宏（macro），不是普通函数**：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22Hello%2C%20world!%22)%3B%20%20%2F%2F%20println!%20%E6%98%AF%E5%AE%8F%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, world!"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// println! 是宏</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

宏和函数有本质区别——宏在编译阶段就会展开处理代码，能做到函数做不到的事情（比如接受数量不固定的参数）。`println!` 就是一个功能强大的宏，能格式化并把文本打印到终端。

关于”宏到底是什么”先按下不表，等你对 Rust 有了更多了解之后，我们会专门深入讲解。**现在只需记住一条规则：看到 `!` = 调用的是宏。**

### 字符串字面量与分号

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%20%20%20%20%20%20%20%E5%8F%8C%E5%BC%95%E5%8F%B7%E5%8C%85%E8%A3%B9%E7%9A%84%E6%96%87%E6%9C%AC%E5%8F%AB%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F%0A%20%20%20%20println!(%22Hello%2C%20world!%22)%3B%0A%20%20%20%20%2F%2F%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5E%20%E8%8B%B1%E6%96%87%E5%88%86%E5%8F%B7%EF%BC%8C%E8%A1%A8%E7%A4%BA%E8%BF%99%E6%9D%A1%E8%AF%AD%E5%8F%A5%E7%BB%93%E6%9D%9F%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    //        双引号包裹的文本叫字符串字面量</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, world!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#6A737D">    //                        ^ 英文分号，表示这条语句结束</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

还有两个细节值得注意：

1. 4 个空格的缩进 ，不是 Tab。这是 Rust 社区的统一约定。
1. 英文分号 `;` 表示这条语句已经完整结束。Rust 中大多数语句都以 ; 结尾——后续你会理解为什么”大多数”而不是”全部”。

## 编译并运行

Rust 是**编译型语言**，必须先把源代码编译成二进制可执行文件，才能运行。

### 第一步：编译

在终端中，确保你在 `hello_world` 目录下，执行：

```bash
rustc main.rs
```

这条命令调用 Rust 编译器 `rustc`，把 `main.rs` 编译成可执行文件。编译成功后不会有任何输出——**没有消息就是好消息**。

### 第二步：查看生成的文件

```bash
ls          # Linux / macOS
dir /B      # Windows CMD
```

你会看到：

| 文件 | 说明 |
| --- | --- |
| `main.rs` | 你写的源代码 |
| `main`（Linux/macOS）或 `main.exe`（Windows） | 编译产出的可执行文件 |
| `main.pdb`（仅 Windows） | 调试符号文件 |

### 第三步：运行

```bash
./main          # Linux / macOS
.\main.exe      # Windows PowerShell / CMD
```

终端应该输出：

```text
Hello, world!
```

看到这行输出了吗？**恭喜你，你已经是一名 Rust 开发者了！**

## 编译型 vs 解释型：为什么 Rust 要编译？

如果你之前学过 Python、Ruby 或 JavaScript，可能会觉得”先编译再运行”多了一步，有点麻烦。但这背后有深刻的权衡。

| 特性 | 解释型（Python / JS） | 编译型（Rust / C++） |
| --- | --- | --- |
| 运行方式 | 需要解释器逐行执行 | 直接运行二进制文件 |
| 分发程序 | 对方需要安装对应运行时 | 对方不需要安装任何东西 |
| 性能 | 相对较慢 | 接近硬件极限 |
| 错误发现时机 | 运行时才暴露 | **编译时就能发现大多数错误** |

Rust 选择做**预编译（ahead-of-time compiled）语言**，带来了两个关键好处：

**分发简单**：你可以把编译好的 `main` 文件直接发给任何人，他们不需要安装 Rust 就能直接运行。发给朋友一个 Python 脚本，他得先装 Python；发给他一个 Rust 编译出的可执行文件，双击就跑。

**错误前置**：Rust 编译器极其严格，能在你运行代码之前发现大量潜在错误。这也是 Rust”安全性”的核心来源之一——它不让不安全的程序通过编译关。

> 每次看到编译器报错，请别沮丧。Rust 的报错信息在所有主流语言里是出了名的详细和友好，它在帮你、不是在为难你。渐渐地你会发现，「把错误解决在编译阶段」是一件很爽的事。

## 小结

这篇文章里，你完成了人生中第一个 Rust 程序，并了解了它的每一行代码。回顾关键点：

- 每个 Rust 可执行程序都从 fn main() 开始运行
- println! 是一个 宏 ，注意感叹号 !
- rustc main.rs 编译源代码，生成可执行文件
- Rust 是预编译语言，生成的二进制文件可以独立分发

用 `rustc` 直接编译对小程序没问题，但随着项目规模增长，管理依赖、组织代码文件会变得很繁琐。下一篇文章，我们来认识 Rust 的构建和包管理工具 **Cargo**，它才是你日常开发的真正起点。

# 练习题

## 程序入口

加载题目中…

## 宏的标志

加载题目中…

## 缩进风格

加载题目中…

## 编译命令

加载题目中…

## 预编译语言的优势

加载题目中…

## 错误修复

下面的代码有**两处**语法错误，找出并修复它们，让程序输出 `Hello, world!`。

```rust
fn main() {
    println("Hello, world!")
}
```