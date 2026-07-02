# 配置调试环境

`dbg!` 适合快速排查，但当 bug 涉及复杂的状态变化、循环迭代或多函数调用时，**图形化调试器**会更有效率。你可以暂停程序在任意行，逐步观察每个变量的状态，而不需要插入任何代码。

## 需要安装什么

在 VS Code 中调试 Rust 程序需要两个扩展：

**1. rust-analyzer**（必须）

- Rust 语言服务器，提供代码补全、错误提示、跳转定义
- 搜索 rust-analyzer ，安装官方扩展（Rust Programming Language 发布）

**2. CodeLLDB**（调试器后端，必须）

- 基于 LLDB 的调试适配器，让 VS Code 能控制 Rust 程序的执行
- 搜索 CodeLLDB ，安装 Vadim Chugunov 发布的扩展

> 除了 CodeLLDB，也有 **MSVC Debugger**（`ms-vscode.cpptools`）可用于 Windows。本文以 CodeLLDB 为例，它在 macOS/Linux/Windows 上都可用。

## 创建 launch.json

VS Code 需要一个 `launch.json` 文件来知道如何启动调试会话。

**方法一：自动生成（推荐）**

1. 打开 src/main.rs
1. 点击左侧活动栏的”运行与调试”图标（或按 Ctrl+Shift+D / Cmd+Shift+D ）
1. 点击”创建 launch.json 文件”
1. 选择 LLDB 作为调试器类型

VS Code 会在 `.vscode/launch.json` 生成类似以下内容：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug executable 'my_app'",
            "cargo": {
                "args": [
                    "build",
                    "--bin=my_app",
                    "--package=my_app"
                ],
                "filter": {
                    "name": "my_app",
                    "kind": "bin"
                }
            },
            "args": [],
            "cwd": "${workspaceFolder}"
        }
    ]
}
```

关键字段说明：

| 字段 | 说明 |
| --- | --- |
| `type: "lldb"` | 使用 CodeLLDB 调试器 |
| `request: "launch"` | 启动一个新进程（另一个选项是 `attach` 附加到已运行的进程） |
| `cargo.args` | 构建参数，`--bin=my_app` 指定要调试的二进制名 |
| `args` | 传给程序本身的命令行参数 |
| `cwd` | 程序的工作目录 |

**方法二：手动创建**

在项目根目录创建 `.vscode/launch.json`，复制上面的模板，把 `my_app` 替换成你的 crate 名称（见 `Cargo.toml` 中的 `name` 字段）。

## 验证安装

配置好后，按 `F5` 应该能启动调试会话。如果程序正常结束，调试器会退出。如果遇到 `cargo: command not found` 或类似错误，检查 Rust 工具链是否正确安装（运行 `rustup show`）。

# 调试操作

## 设置断点

断点（Breakpoint）告诉调试器”在这行暂停程序，等我查看状态”。

**设置断点**：在代码编辑器里，点击行号左侧的空白区域，会出现一个红色圆点。

**条件断点**：右键红点 → “编辑断点” → 填入条件表达式（如 `i == 5`），只有条件为真时才暂停，在循环调试时非常有用。

## 启动调试

按 `F5` 或点击”运行与调试”面板里的绿色播放按钮。程序会运行直到遇到第一个断点，然后暂停。

此时顶部会出现**调试工具栏**：

| 按钮 | 快捷键 | 功能 |
| --- | --- | --- |
| 继续 | `F5` | 继续运行，直到下一个断点 |
| 单步跳过 | `F10` | 执行当前行，不进入函数 |
| 单步进入 | `F11` | 执行当前行，如果是函数调用则进入该函数 |
| 单步跳出 | `Shift+F11` | 运行完当前函数，回到调用处 |
| 重启 | `Ctrl+Shift+F5` | 重新从头开始调试 |
| 停止 | `Shift+F5` | 终止调试会话 |

## 观察变量

程序暂停时，左侧面板会显示：

**变量（Variables）面板**

- 自动列出当前作用域内所有变量及其值
- 可展开结构体、枚举、向量查看内部字段
- 悬停在代码中的变量名上也会弹出当前值

**监视（Watch）面板**

- 手动添加你想持续观察的表达式
- 程序每次暂停都会重新计算这些表达式的值
- 右键添加，或在变量面板右键 → “添加到监视”

**调用堆栈（Call Stack）面板**

- 显示当前的函数调用链
- 点击某一帧可以跳转到对应的代码位置，查看那一帧的局部变量

## 实际调试示例

假设有以下代码，`sum_squares` 函数的结果不对：

<div class="code-runner" data-full-code="fn%20sum_squares(nums%3A%20%26%5Bi32%5D)%20-%3E%20i32%20%7B%0A%20%20%20%20let%20mut%20total%20%3D%200%3B%0A%20%20%20%20for%20%26n%20in%20nums%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%9C%A8%E8%BF%99%E8%A1%8C%E8%AE%BE%E6%96%AD%E7%82%B9%EF%BC%8C%E8%A7%82%E5%AF%9F%E6%AF%8F%E8%BD%AE%E7%9A%84%20n%20%E5%92%8C%20total%0A%20%20%20%20%20%20%20%20total%20%2B%3D%20n%3B%20%20%2F%2F%20BUG%EF%BC%9A%E5%BF%98%E8%AE%B0%E5%B9%B3%E6%96%B9%E4%BA%86%0A%20%20%20%20%7D%0A%20%20%20%20total%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%5D%3B%0A%20%20%20%20let%20result%20%3D%20sum_squares(%26data)%3B%0A%20%20%20%20println!(%22sum%20of%20squares%20%3D%20%7B%7D%22%2C%20result)%3B%20%20%2F%2F%20%E6%9C%9F%E6%9C%9B%2030%EF%BC%8C%E5%AE%9E%E9%99%85%2010%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> sum_squares</span><span style="color:#E1E4E8">(nums</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">[</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">]) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> i32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> total </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">n </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> nums {</span></span>
<span class="line"><span style="color:#6A737D">        // 在这行设断点，观察每轮的 n 和 total</span></span>
<span class="line"><span style="color:#E1E4E8">        total </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> n;  </span><span style="color:#6A737D">// BUG：忘记平方了</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    total</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">4</span><span style="color:#E1E4E8">];</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> sum_squares</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#E1E4E8">data);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"sum of squares = {}"</span><span style="color:#E1E4E8">, result);  </span><span style="color:#6A737D">// 期望 30，实际 10</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

调试步骤：

1. 在 total += n; 这行设断点
1. 按 F5 启动调试
1. 程序第一次暂停时，Variables 面板显示 n = 1 ， total = 0
1. 按 F10 单步跳过，查看 total 变为 1
1. 继续按 F5 到下一轮循环，发现 n 是原始值而非平方值
1. 定位 bug： n 没有被平方

## 调试测试函数

如果要调试 `#[test]` 函数，`launch.json` 里的 `cargo.args` 改为：

```json
{
    "type": "lldb",
    "request": "launch",
    "name": "Debug unit tests",
    "cargo": {
        "args": [
            "test",
            "--no-run",
            "--lib"
        ]
    },
    "args": ["test_function_name"],  // 指定要运行的测试函数名
    "cwd": "${workspaceFolder}"
}
```

或者，在 VS Code 里找到测试函数上方出现的 `Run Test | Debug Test` 代码镜头（CodeLens），直接点”Debug Test”——这是最方便的方式，不需要手动配置。

> **rust-analyzer 的 CodeLens 功能**：安装 rust-analyzer 后，`#[test]` 函数和 `fn main()` 上方会自动显示 `▶ Run | Debug` 链接，点击即可一键调试，无需手动管理 launch.json。

# 练习题

## IDE 调试测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…