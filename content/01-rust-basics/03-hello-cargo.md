# Cargo: Rust 的项目管理神器

用 `rustc` 直接编译文件，对一两个文件的小程序没问题。但真实项目往往有几十个源文件、十几个外部依赖——这时候手动调用 `rustc` 就变成了噩梦。**Cargo** 是 Rust 官方给出的答案，也是你日后每天都会用到的工具。

## 什么是 Cargo？

Cargo 同时扮演两个角色：

| 角色 | 职责 |
| --- | --- |
| **构建系统** | 编译代码、处理编译顺序、管理多文件项目 |
| **包管理器** | 下载、编译、管理第三方库（crate） |

Cargo 随 Rust 工具链一起安装。先确认它可用：

```bash
cargo --version
```

看到类似 `cargo 1.xx.x` 的输出就说明一切正常。

## 用 Cargo 创建项目

回到 `projects` 目录，执行：

```bash
cargo new hello_cargo
cd hello_cargo
```

一条命令，Cargo 帮你做了三件事：

1. 创建 hello_cargo 目录和标准项目结构
1. 生成开箱即用的 Cargo.toml 配置文件
1. 初始化 Git 仓库（含 .gitignore ）

Cargo 生成的 `src/main.rs` 模式会生成一个完整可运行的 Hello world 程序：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22Hello%2C%20world!%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, world!"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> 如果已有一个没用 Cargo 管理的项目，只需把源文件移到 `src/` 目录，再创建对应的 `Cargo.toml`，即可迁移成 Cargo 项目。

## 项目结构一览

`cargo new` 创建的目录结构：

```text
hello_cargo/
├── Cargo.toml      ← 项目配置文件
├── Cargo.lock      ← 依赖版本锁定文件（首次构建后自动生成）
├── .gitignore      ← 自动忽略 target/ 目录
└── src/
    └── main.rs     ← 源代码入口
```

**Cargo 的约定：源文件只放在 `src/`，根目录只放配置、文档和授权文件。** 这个约定让所有 Cargo 项目拥有一致的布局，你接手任何陌生项目都能快速找到源文件。

## Cargo.toml 详解

`Cargo.toml` 是项目的”身份证”，TOML 格式，内容简洁：

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2024"

[dependencies]
```

逐段解读：

**`[package]` 表块**——描述这个包本身的信息：

- name ：包名，也是编译出的可执行文件名
- version ：版本号，遵循语义化版本（semver）惯例，格式为 主版本.次版本.修订版
- edition ：使用的 Rust 语言大版本，目前推荐 2021 及以上

**`[dependencies]` 表块**——列出项目依赖的外部 crate。现在是空的；需要引入第三方库时在这里添加一行即可，Cargo 会自动下载和编译。

> **crate** 是 Rust 代码包的单位，相当于 Node.js 的 npm package 或 Python 的 pip 包。Rust 的官方 crate 仓库是 [crates.io](https://crates.io)，目前有超过 15 万个 crate。

# 构建与运行

## cargo build：编译项目

在项目根目录执行：

```bash
cargo build
```

Cargo 编译 `src/main.rs`，可执行文件放到 `target/debug/` 目录下：

```bash
./target/debug/hello_cargo       # Linux / macOS
.\target\debug\hello_cargo.exe   # Windows
```

首次构建时还会生成 **`Cargo.lock`**，记录所有依赖的精确版本——不需要手动编辑，Cargo 全程自动维护。

> `target/` 目录体积大、随时可重新生成，Cargo 已在 `.gitignore` 中帮你排除，不会被提交到 Git 仓库。

## cargo run：编译 + 运行一步到位

开发时最常用的命令：

```bash
cargo run
```

`cargo run` 等于 `cargo build` + 运行，一步完成。如果源文件自上次编译后没有改动，Cargo 会直接运行已有的可执行文件，跳过编译，节省等待时间。

来验证它的工作方式——下面是 Cargo 管理的项目中 `main.rs` 的典型内容：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20println!(%22%E7%94%B1%20Cargo%20%E6%9E%84%E5%BB%BA%E5%B9%B6%E8%BF%90%E8%A1%8C%EF%BC%81%22)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"由 Cargo 构建并运行！"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## cargo check：快速语法检查

```bash
cargo check
```

`cargo check` 只检查代码能否通过编译，**不生成可执行文件**。因为省略了代码生成阶段，它通常比 `cargo build` 快 5～10 倍。

实际开发中，很多 Rust 开发者会养成这样的习惯：边写代码边频繁运行 `cargo check`，确保没有语法和类型错误；等到真正需要测试运行效果时，才执行 `cargo run`。

## cargo build —release：发布构建

```bash
cargo build --release
```

加上 `--release` 标志后，Cargo 开启全套编译优化，生成**性能最优**的可执行文件，放到 `target/release/` 目录。

两种模式的对比：

| 模式 | 命令 | 编译速度 | 运行性能 | 输出目录 |
| --- | --- | --- | --- | --- |
| 开发模式 | `cargo build` | 快 | 含调试信息，未优化 | `target/debug/` |
| 发布模式 | `cargo build --release` | 慢 | **最大化优化** | `target/release/` |

> 做性能测试（benchmark）时，**必须用 `--release` 版本**——开发模式包含大量调试信息、禁用了优化，测出的数据会严重失真。

## 小结

这六条命令覆盖了日常 90% 的需求：

| 命令 | 用途 |
| --- | --- |
| `cargo new <name>` | 创建新项目（在当前目录下新建项目目录） |
| `cargo init` | 将当前目录创建为新项目 |
| `cargo build` | 编译（开发模式） |
| `cargo run` | 编译 + 运行（最常用） |
| `cargo check` | 只检查语法，不生成文件（最快） |
| `cargo build --release` | 编译发布版（最优化） |

不管你在 Linux、macOS 还是 Windows 上，这些命令完全一致——这是 Cargo 跨平台一致性的体现。

# 练习题

## 工具定位

加载题目中…

## rustup 的职责

加载题目中…

## cargo check 的特点

加载题目中…

## 发布构建

加载题目中…

## Rust 工具箱

加载题目中…

## 填空：工具速查表

将下方备选描述填入对应工具的 `""` 中，让程序输出完整的工具速查表。每条描述只用一次。

**备选描述：**

- "LSP 服务器（IDE 代码补全的基础）"
- "版本管理器本身"
- "Rust 编译器"
- "代码格式化工具"
- "包管理器 + 构建工具（最常用的命令）"
- "代码检查（lint）工具"

```rust
fn main() {
    println!("rustc:         {}", "");  // 填入对应的作用
    println!("cargo:         {}", "");
    println!("rustup:        {}", "");
    println!("rustfmt:       {}", "");
    println!("clippy:        {}", "");
    println!("rust-analyzer: {}", "");
}
```