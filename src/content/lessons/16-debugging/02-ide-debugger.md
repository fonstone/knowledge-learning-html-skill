---
chapterId: "16-debugging"
lessonId: "02-ide-debugger"
title: "IDE 调试器（rust-analyzer）"
level: "进阶"
duration: "30 分钟"
tags: [IDE, 调试器, rust-analyzer, 断点, 调试]
number: "16.2"
chapterTitle: "调试"
chapterNumber: "16"
---
<div id="article-content"> <h1 id="配置调试环境">配置调试环境</h1>
<p><code>dbg!</code> 适合快速排查，但当 bug 涉及复杂的状态变化、循环迭代或多函数调用时，<strong>图形化调试器</strong>会更有效率。你可以暂停程序在任意行，逐步观察每个变量的状态，而不需要插入任何代码。</p>
<h2 id="需要安装什么">需要安装什么</h2>
<p>在 VS Code 中调试 Rust 程序需要两个扩展：</p>
<p><strong>1. rust-analyzer</strong>（必须）</p>
<ul>
<li>Rust 语言服务器，提供代码补全、错误提示、跳转定义</li>
<li>搜索 <code>rust-analyzer</code>，安装官方扩展（Rust Programming Language 发布）</li>
</ul>
<p><strong>2. CodeLLDB</strong>（调试器后端，必须）</p>
<ul>
<li>基于 LLDB 的调试适配器，让 VS Code 能控制 Rust 程序的执行</li>
<li>搜索 <code>CodeLLDB</code>，安装 Vadim Chugunov 发布的扩展</li>
</ul>
<blockquote>
<p>除了 CodeLLDB，也有 <strong>MSVC Debugger</strong>（<code>ms-vscode.cpptools</code>）可用于 Windows。本文以 CodeLLDB 为例，它在 macOS/Linux/Windows 上都可用。</p>
</blockquote>
<h2 id="创建-launchjson">创建 launch.json</h2>
<p>VS Code 需要一个 <code>launch.json</code> 文件来知道如何启动调试会话。</p>
<p><strong>方法一：自动生成（推荐）</strong></p>
<ol>
<li>打开 <code>src/main.rs</code></li>
<li>点击左侧活动栏的”运行与调试”图标（或按 <code>Ctrl+Shift+D</code> / <code>Cmd+Shift+D</code>）</li>
<li>点击”创建 launch.json 文件”</li>
<li>选择 <code>LLDB</code> 作为调试器类型</li>
</ol>
<p>VS Code 会在 <code>.vscode/launch.json</code> 生成类似以下内容：</p>
<pre><code class="language-json">{
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
}</code></pre>
<p>关键字段说明：</p>
<table><thead><tr><th>字段</th><th>说明</th></tr></thead><tbody><tr><td><code>type: "lldb"</code></td><td>使用 CodeLLDB 调试器</td></tr><tr><td><code>request: "launch"</code></td><td>启动一个新进程（另一个选项是 <code>attach</code> 附加到已运行的进程）</td></tr><tr><td><code>cargo.args</code></td><td>构建参数，<code>--bin=my_app</code> 指定要调试的二进制名</td></tr><tr><td><code>args</code></td><td>传给程序本身的命令行参数</td></tr><tr><td><code>cwd</code></td><td>程序的工作目录</td></tr></tbody></table>
<p><strong>方法二：手动创建</strong></p>
<p>在项目根目录创建 <code>.vscode/launch.json</code>，复制上面的模板，把 <code>my_app</code> 替换成你的 crate 名称（见 <code>Cargo.toml</code> 中的 <code>name</code> 字段）。</p>
<h2 id="验证安装">验证安装</h2>
<p>配置好后，按 <code>F5</code> 应该能启动调试会话。如果程序正常结束，调试器会退出。如果遇到 <code>cargo: command not found</code> 或类似错误，检查 Rust 工具链是否正确安装（运行 <code>rustup show</code>）。</p>
<h1 id="调试操作">调试操作</h1>
<h2 id="设置断点">设置断点</h2>
<p>断点（Breakpoint）告诉调试器”在这行暂停程序，等我查看状态”。</p>
<p><strong>设置断点</strong>：在代码编辑器里，点击行号左侧的空白区域，会出现一个红色圆点。</p>
<p><strong>条件断点</strong>：右键红点 → “编辑断点” → 填入条件表达式（如 <code>i == 5</code>），只有条件为真时才暂停，在循环调试时非常有用。</p>
<h2 id="启动调试">启动调试</h2>
<p>按 <code>F5</code> 或点击”运行与调试”面板里的绿色播放按钮。程序会运行直到遇到第一个断点，然后暂停。</p>
<p>此时顶部会出现<strong>调试工具栏</strong>：</p>
<table><thead><tr><th>按钮</th><th>快捷键</th><th>功能</th></tr></thead><tbody><tr><td>继续</td><td><code>F5</code></td><td>继续运行，直到下一个断点</td></tr><tr><td>单步跳过</td><td><code>F10</code></td><td>执行当前行，不进入函数</td></tr><tr><td>单步进入</td><td><code>F11</code></td><td>执行当前行，如果是函数调用则进入该函数</td></tr><tr><td>单步跳出</td><td><code>Shift+F11</code></td><td>运行完当前函数，回到调用处</td></tr><tr><td>重启</td><td><code>Ctrl+Shift+F5</code></td><td>重新从头开始调试</td></tr><tr><td>停止</td><td><code>Shift+F5</code></td><td>终止调试会话</td></tr></tbody></table>
<h2 id="观察变量">观察变量</h2>
<p>程序暂停时，左侧面板会显示：</p>
<p><strong>变量（Variables）面板</strong></p>
<ul>
<li>自动列出当前作用域内所有变量及其值</li>
<li>可展开结构体、枚举、向量查看内部字段</li>
<li>悬停在代码中的变量名上也会弹出当前值</li>
</ul>
<p><strong>监视（Watch）面板</strong></p>
<ul>
<li>手动添加你想持续观察的表达式</li>
<li>程序每次暂停都会重新计算这些表达式的值</li>
<li>右键添加，或在变量面板右键 → “添加到监视”</li>
</ul>
<p><strong>调用堆栈（Call Stack）面板</strong></p>
<ul>
<li>显示当前的函数调用链</li>
<li>点击某一帧可以跳转到对应的代码位置，查看那一帧的局部变量</li>
</ul>
<h2 id="实际调试示例">实际调试示例</h2>
<p>假设有以下代码，<code>sum_squares</code> 函数的结果不对：</p>
<div class="code-runner" data-full-code="fn%20sum_squares(nums%3A%20%26%5Bi32%5D)%20-%3E%20i32%20%7B%0A%20%20%20%20let%20mut%20total%20%3D%200%3B%0A%20%20%20%20for%20%26n%20in%20nums%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E5%9C%A8%E8%BF%99%E8%A1%8C%E8%AE%BE%E6%96%AD%E7%82%B9%EF%BC%8C%E8%A7%82%E5%AF%9F%E6%AF%8F%E8%BD%AE%E7%9A%84%20n%20%E5%92%8C%20total%0A%20%20%20%20%20%20%20%20total%20%2B%3D%20n%3B%20%20%2F%2F%20BUG%EF%BC%9A%E5%BF%98%E8%AE%B0%E5%B9%B3%E6%96%B9%E4%BA%86%0A%20%20%20%20%7D%0A%20%20%20%20total%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20data%20%3D%20vec!%5B1%2C%202%2C%203%2C%204%5D%3B%0A%20%20%20%20let%20result%20%3D%20sum_squares(%26data)%3B%0A%20%20%20%20println!(%22sum%20of%20squares%20%3D%20%7B%7D%22%2C%20result)%3B%20%20%2F%2F%20%E6%9C%9F%E6%9C%9B%2030%EF%BC%8C%E5%AE%9E%E9%99%85%2010%0A%7D" data-mode="run"><pre><code class="language-rust">fn sum_squares(nums: &amp;[i32]) -&gt; i32 {
    let mut total = 0;
    for &amp;n in nums {
        // 在这行设断点，观察每轮的 n 和 total
        total += n;  // BUG：忘记平方了
    }
    total
}

fn main() {
    let data = vec![1, 2, 3, 4];
    let result = sum_squares(&amp;data);
    println!("sum of squares = {}", result);  // 期望 30，实际 10
}</code></pre></div>
<p>调试步骤：</p>
<ol>
<li>在 <code>total += n;</code> 这行设断点</li>
<li>按 <code>F5</code> 启动调试</li>
<li>程序第一次暂停时，Variables 面板显示 <code>n = 1</code>，<code>total = 0</code></li>
<li>按 <code>F10</code> 单步跳过，查看 <code>total</code> 变为 1</li>
<li>继续按 <code>F5</code> 到下一轮循环，发现 <code>n</code> 是原始值而非平方值</li>
<li>定位 bug：<code>n</code> 没有被平方</li>
</ol>
<h2 id="调试测试函数">调试测试函数</h2>
<p>如果要调试 <code>#[test]</code> 函数，<code>launch.json</code> 里的 <code>cargo.args</code> 改为：</p>
<pre><code class="language-json">{
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
}</code></pre>
<p>或者，在 VS Code 里找到测试函数上方出现的 <code>Run Test | Debug Test</code> 代码镜头（CodeLens），直接点”Debug Test”——这是最方便的方式，不需要手动配置。</p>
<blockquote>
<p><strong>rust-analyzer 的 CodeLens 功能</strong>：安装 rust-analyzer 后，<code>#[test]</code> 函数和 <code>fn main()</code> 上方会自动显示 <code>▶ Run | Debug</code> 链接，点击即可一键调试，无需手动管理 launch.json。</p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="ide-调试测验">IDE 调试测验</h2>
<div class="quiz-choice" data-block-id="16-debugging/02-ide-debugger#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20VS%20Code%20%E4%B8%AD%E8%B0%83%E8%AF%95%20Rust%20%E7%A8%8B%E5%BA%8F%EF%BC%8C%E9%99%A4%E4%BA%86%20rust-analyzer%20%E4%B9%8B%E5%A4%96%E8%BF%98%E9%9C%80%E8%A6%81%E5%AE%89%E8%A3%85%E5%93%AA%E4%B8%AA%E6%89%A9%E5%B1%95%EF%BC%9F%22%2C%22options%22%3A%5B%22Rust%20Test%20Explorer%22%2C%22Go%20%E6%89%A9%E5%B1%95%22%2C%22C%2FC%2B%2B%20%E6%89%A9%E5%B1%95%EF%BC%88ms-vscode.cpptools%EF%BC%89%22%2C%22CodeLLDB%EF%BC%88vadimcn.vscode-lldb%EF%BC%89%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22CodeLLDB%20%E6%98%AF%E8%B0%83%E8%AF%95%E9%80%82%E9%85%8D%E5%99%A8%EF%BC%8C%E8%B4%9F%E8%B4%A3%E5%AE%9E%E9%99%85%E6%8E%A7%E5%88%B6%20LLDB%20%E8%B0%83%E8%AF%95%20Rust%20%E7%A8%8B%E5%BA%8F%E3%80%82C%2FC%2B%2B%20%E6%89%A9%E5%B1%95%E7%9A%84%E8%B0%83%E8%AF%95%E5%99%A8%E4%B9%9F%E5%8F%AF%E4%BB%A5%E7%94%A8%EF%BC%8C%E4%BD%86%20CodeLLDB%20%E5%9C%A8%20macOS%2FLinux%2FWindows%20%E4%B8%8A%E6%9B%B4%E9%80%9A%E7%94%A8%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/02-ide-debugger#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E8%B0%83%E8%AF%95%E6%97%B6%E6%8C%89%20F10%EF%BC%88%E5%8D%95%E6%AD%A5%E8%B7%B3%E8%BF%87%EF%BC%89%E5%92%8C%20F11%EF%BC%88%E5%8D%95%E6%AD%A5%E8%BF%9B%E5%85%A5%EF%BC%89%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22F10%20%E4%B8%8D%E8%BF%9B%E5%85%A5%E8%A2%AB%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%EF%BC%8CF11%20%E4%BC%9A%E8%BF%9B%E5%85%A5%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%E9%80%90%E8%A1%8C%E6%89%A7%E8%A1%8C%22%2C%22%E6%B2%A1%E6%9C%89%E5%8C%BA%E5%88%AB%EF%BC%8C%E6%95%88%E6%9E%9C%E7%9B%B8%E5%90%8C%22%2C%22F10%20%E6%9B%B4%E5%BF%AB%EF%BC%8CF11%20%E6%9B%B4%E6%85%A2%22%2C%22F10%20%E5%90%91%E4%B8%8B%E8%B5%B0%EF%BC%8CF11%20%E5%90%91%E4%B8%8A%E8%B5%B0%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22F10%20%E6%8A%8A%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E5%BD%93%E4%BD%9C%E4%B8%80%E4%B8%AA%E6%95%B4%E4%BD%93%E8%B7%B3%E8%BF%87%EF%BC%9BF11%20%E4%BC%9A%5C%22%E9%92%BB%E8%BF%9B%5C%22%E8%A2%AB%E8%B0%83%E7%94%A8%E7%9A%84%E5%87%BD%E6%95%B0%EF%BC%8C%E9%80%90%E8%A1%8C%E6%89%A7%E8%A1%8C%E5%85%B6%E5%86%85%E9%83%A8%E4%BB%A3%E7%A0%81%E3%80%82%E8%B0%83%E8%AF%95%E6%A0%87%E5%87%86%E5%BA%93%E5%87%BD%E6%95%B0%E6%97%B6%E7%94%A8%20F10%EF%BC%8C%E8%B0%83%E8%AF%95%E8%87%AA%E5%B7%B1%E7%9A%84%E5%87%BD%E6%95%B0%E6%97%B6%E7%94%A8%20F11%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/02-ide-debugger#2:2" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%9D%A1%E4%BB%B6%E6%96%AD%E7%82%B9%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%8F%AA%E6%9C%89%E5%BD%93%E6%8C%87%E5%AE%9A%E6%9D%A1%E4%BB%B6%E4%B8%BA%E7%9C%9F%E6%97%B6%E6%89%8D%E6%9A%82%E5%81%9C%E7%A8%8B%E5%BA%8F%22%2C%22%E6%AF%8F%E9%9A%94%E8%8B%A5%E5%B9%B2%E6%AD%A5%E6%9A%82%E5%81%9C%E4%B8%80%E6%AC%A1%22%2C%22%E5%9C%A8%E5%8F%91%E7%94%9F%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E6%97%B6%E6%9A%82%E5%81%9C%22%2C%22%E5%9C%A8%E5%87%BD%E6%95%B0%E5%85%A5%E5%8F%A3%E5%92%8C%E5%87%BA%E5%8F%A3%E9%83%BD%E6%9A%82%E5%81%9C%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22%E6%9D%A1%E4%BB%B6%E6%96%AD%E7%82%B9%E9%9D%9E%E5%B8%B8%E9%80%82%E5%90%88%E8%B0%83%E8%AF%95%E5%BE%AA%E7%8E%AF%E2%80%94%E2%80%94%E6%AF%94%E5%A6%82%E5%8F%AA%E6%83%B3%E5%9C%A8%E7%AC%AC%20100%20%E6%AC%A1%E8%BF%AD%E4%BB%A3%E6%97%B6%E6%9A%82%E5%81%9C%EF%BC%8C%E5%B0%B1%E8%AE%BE%E6%9D%A1%E4%BB%B6%20%60i%20%3D%3D%20100%60%EF%BC%8C%E9%81%BF%E5%85%8D%E6%AF%8F%E6%AC%A1%E5%BE%AA%E7%8E%AF%E9%83%BD%E6%89%8B%E5%8A%A8%E7%BB%A7%E7%BB%AD%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/02-ide-debugger#2:3" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BB%A5%E4%B8%8B%E5%93%AA%E4%BA%9B%E5%9C%BA%E6%99%AF%E6%9B%B4%E9%80%82%E5%90%88%E7%94%A8%20IDE%20%E8%B0%83%E8%AF%95%E5%99%A8%E8%80%8C%E4%B8%8D%E6%98%AF%20dbg!%20%E5%AE%8F%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%BF%AB%E9%80%9F%E6%89%93%E5%8D%B0%E4%B8%80%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F%E7%9A%84%E5%80%BC%22%2C%22%E8%BF%BD%E8%B8%AA%E4%B8%80%E4%B8%AA%E8%B0%83%E7%94%A8%E9%93%BE%E5%BE%88%E6%B7%B1%E7%9A%84%20bug%EF%BC%8C%E9%9C%80%E8%A6%81%E9%80%90%E5%B1%82%E5%B1%95%E5%BC%80%22%2C%22%E8%B0%83%E8%AF%95%E4%B8%80%E4%B8%AA%E5%BE%AA%E7%8E%AF%E4%B8%AD%E9%80%94%E7%9A%84%E5%BC%82%E5%B8%B8%E7%8A%B6%E6%80%81%EF%BC%88%E6%9D%A1%E4%BB%B6%E6%96%AD%E7%82%B9%EF%BC%89%22%2C%22%E9%9C%80%E8%A6%81%E8%A7%82%E5%AF%9F%E5%8D%81%E5%87%A0%E4%B8%AA%E5%8F%98%E9%87%8F%E5%90%8C%E6%97%B6%E5%8F%98%E5%8C%96%E7%9A%84%E5%A4%8D%E6%9D%82%E7%8A%B6%E6%80%81%22%2C%22%E7%A1%AE%E8%AE%A4%E6%9F%90%E4%B8%AA%E5%87%BD%E6%95%B0%E6%98%AF%E5%90%A6%E8%A2%AB%E8%B0%83%E7%94%A8%22%5D%2C%22correct%22%3A%5B1%2C2%2C3%5D%2C%22explanation%22%3A%22dbg!%20%E9%80%82%E5%90%88%E5%BF%AB%E9%80%9F%E3%80%81%E8%BD%BB%E9%87%8F%E7%9A%84%E8%B0%83%E8%AF%95%EF%BC%9BIDE%20%E8%B0%83%E8%AF%95%E5%99%A8%E9%80%82%E5%90%88%E5%A4%8D%E6%9D%82%E7%8A%B6%E6%80%81%E3%80%81%E6%B7%B1%E5%B1%82%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E9%9C%80%E8%A6%81%E4%BA%A4%E4%BA%92%E5%BC%8F%E6%8E%A2%E7%B4%A2%E7%9A%84%20bug%E3%80%82%E4%B8%A4%E8%80%85%E4%BA%92%E8%A1%A5%EF%BC%8C%E4%B8%8D%E6%98%AF%E6%9B%BF%E4%BB%A3%E5%85%B3%E7%B3%BB%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="16-debugging/02-ide-debugger#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22launch.json%20%E4%B8%AD%20cargo.args%20%E9%87%8C%20--bin%3Dmy_app%20%E7%9A%84%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%91%8A%E8%AF%89%20Cargo%20%E6%9E%84%E5%BB%BA%E5%B9%B6%E8%B0%83%E8%AF%95%E5%90%8D%E4%B8%BA%20my_app%20%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9B%AE%E6%A0%87%22%2C%22%E6%8C%87%E5%AE%9A%E7%9B%AE%E6%A0%87%E5%B9%B3%E5%8F%B0%22%2C%22%E6%8C%87%E5%AE%9A%E8%A6%81%E5%AE%89%E8%A3%85%E7%9A%84%E4%BE%9D%E8%B5%96%E5%8C%85%E5%90%8D%E7%A7%B0%22%2C%22%E8%AE%BE%E7%BD%AE%E7%A8%8B%E5%BA%8F%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%8F%82%E6%95%B0%22%5D%2C%22correct%22%3A%5B0%5D%2C%22explanation%22%3A%22Cargo%20%E9%A1%B9%E7%9B%AE%E5%8F%AF%E8%83%BD%E6%9C%89%E5%A4%9A%E4%B8%AA%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9B%AE%E6%A0%87%EF%BC%88%E5%A4%9A%E4%B8%AA%20%5B%5Bbin%5D%5D%20%E5%85%A5%E5%8F%A3%EF%BC%89%E3%80%82--bin%3Dname%20%E6%8C%87%E5%AE%9A%E8%B0%83%E8%AF%95%E5%93%AA%E4%B8%80%E4%B8%AA%E3%80%82%E5%A6%82%E6%9E%9C%E5%8F%AA%E6%9C%89%20main.rs%20%E4%B8%80%E4%B8%AA%E4%BA%8C%E8%BF%9B%E5%88%B6%EF%BC%8C%E9%80%9A%E5%B8%B8%E4%B8%8E%20Cargo.toml%20%E9%87%8C%E7%9A%84%20name%20%E5%AD%97%E6%AE%B5%E7%9B%B8%E5%90%8C%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
