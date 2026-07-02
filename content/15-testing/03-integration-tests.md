# 两种测试的分工

Rust 项目通常有两类测试，它们的目标不同、放的地方也不同：

|  | 单元测试 | 集成测试 |
| --- | --- | --- |
| **放在哪里** | 与源码同文件（`src/` 目录下） | 独立的 `tests/` 目录 |
| **测什么** | 单个函数/模块的正确性，可以访问私有函数 | 多个模块协作的整体行为，只能访问公有 API |
| **需要 `#[cfg(test)]`** | 是（因为和源码在同一文件） | 否（Cargo 自动识别 `tests/` 目录） |
| **典型用途** | 验证内部实现细节 | 模拟真实用户调用库的方式 |

单元测试发现的是”零件坏了”，集成测试发现的是”零件没坏，但组装有问题”。两者互补，缺一不可。

## 单元测试的组织

单元测试住在源码文件里，用 `#[cfg(test)]` 隔离：

<div class="code-runner" data-full-code="pub%20fn%20add_two(a%3A%20i32)%20-%3E%20i32%20%7B%0A%20%20%20%20internal_adder(a%2C%202)%0A%7D%0A%0Afn%20internal_adder(a%3A%20i32%2C%20b%3A%20i32)%20-%3E%20i32%20%7B%20%20%2F%2F%20%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%0A%20%20%20%20a%20%2B%20b%0A%7D%0A%0A%23%5Bcfg(test)%5D%0Amod%20tests%20%7B%0A%20%20%20%20use%20super%3A%3A*%3B%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20test_public()%20%7B%0A%20%20%20%20%20%20%20%20assert_eq!(4%2C%20add_two(2))%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23%5Btest%5D%0A%20%20%20%20fn%20test_private()%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E6%B5%8B%E8%AF%95%E7%A7%81%E6%9C%89%E5%87%BD%E6%95%B0%EF%BC%81%0A%20%20%20%20%20%20%20%20assert_eq!(5%2C%20internal_adder(3%2C%202))%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> add_two</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    internal_adder</span><span style="color:#E1E4E8">(a, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> internal_adder</span><span style="color:#E1E4E8">(a</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {  </span><span style="color:#6A737D">// 私有函数</span></span>
<span class="line"><span style="color:#E1E4E8">    a </span><span style="color:#F97583">+</span><span style="color:#E1E4E8"> b</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[cfg(test)]</span></span>
<span class="line"><span style="color:#F97583">mod</span><span style="color:#B392F0"> tests</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    use</span><span style="color:#79B8FF"> super</span><span style="color:#F97583">::*</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> test_public</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">add_two</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    #[test]</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> test_private</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">        // 可以直接测试私有函数！</span></span>
<span class="line"><span style="color:#B392F0">        assert_eq!</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">internal_adder</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

`#[cfg(test)]` 的作用是：`cargo build` 时这个模块完全不存在，只有 `cargo test` 时才编译进去。

# 编写集成测试

## tests/ 目录结构

集成测试放在项目根目录的 `tests/` 目录下（与 `src/` 同级）：

```text
my_project/
├── src/
│   └── lib.rs
└── tests/
    └── integration_test.rs   ← 集成测试文件
```

`tests/` 下每个文件都是一个独立的 crate，Cargo 会在 `cargo test` 时自动编译并运行它们，**不需要** `#[cfg(test)]` 标注。

示例 `tests/integration_test.rs`：

```rust
use adder;  // 引入我们的库 crate

#[test]
fn it_adds_two() {
    assert_eq!(4, adder::add_two(2));
}
```

注意：

- 需要用 use 显式引入库，像外部用户一样使用它
- 只能调用 公有 API，私有函数在集成测试中不可见
- 每个文件都是独立 crate，不同文件之间默认不共享代码

运行时，输出会分为三段：

```text
running 1 test                         ← 单元测试
test tests::internal ... ok

running 1 test                         ← 集成测试
test it_adds_two ... ok

running 0 tests                        ← 文档测试
```

## 运行指定的集成测试文件

如果 `tests/` 下有多个文件，可以用 `--test` 指定运行某个文件：

```bash
cargo test --test integration_test
```

只会运行 `tests/integration_test.rs` 中的测试，忽略其他文件。

结合名称过滤，可以更精确：

```bash
cargo test --test integration_test it_adds
```

只运行 `integration_test.rs` 中名称含 `it_adds` 的测试。

## 集成测试中的共享辅助模块

当多个集成测试文件都需要共同的辅助函数时，需要特别注意——**不能**直接创建 `tests/common.rs`。

为什么？因为 `tests/` 下每个 `.rs` 文件都被视为独立的测试 crate，`tests/common.rs` 也会被当成一个独立的测试文件运行，然后显示 `running 0 tests`——让输出变得混乱。

**正确做法**：创建子目录 `tests/common/mod.rs`：

```text
tests/
├── integration_test.rs
└── common/
    └── mod.rs          ← 辅助函数放这里
```

`tests/common/mod.rs` 中写辅助函数：

```rust
pub fn setup() {
    // 测试前的准备工作，比如创建临时文件、初始化数据等
}
```

在集成测试文件中引用它：

```rust
use adder;

mod common;  // 声明模块

#[test]
fn it_adds_two() {
    common::setup();  // 调用辅助函数
    assert_eq!(4, adder::add_two(2));
}
```

子目录里的文件不会被 Cargo 当作独立的测试 crate，测试输出里不会出现多余的 `running 0 tests`。

> **原理**：Cargo 的规则是：`tests/` 下的**直接子 `.rs` 文件**各自是独立 crate；但**子目录下的文件**不是，它们只是普通模块。`tests/common/mod.rs` 走的是第二条路，所以不会被单独编译为测试 crate。

## 二进制项目的集成测试

只有**库 crate**（`src/lib.rs`）才能被集成测试引入。如果你的项目只有 `src/main.rs`（二进制 crate），集成测试就无法用 `use` 引入它的代码。

这是 Rust 生态约定采用**薄 main + 厚 lib** 结构的原因：

```text
src/
├── main.rs   ← 只做参数解析、调用 lib 函数，尽量精简
└── lib.rs    ← 核心逻辑全在这里，方便测试
```

`main.rs` 里调用 `lib.rs` 中的函数；集成测试则通过 `use` 引入 `lib.rs` 测试核心逻辑。`main.rs` 的代码很少，不测也无妨。

# 练习题

## 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…