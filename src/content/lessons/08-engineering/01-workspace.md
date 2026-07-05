---
chapterId: "08-engineering"
lessonId: "01-workspace"
title: "工作空间"
level: "入门"
duration: "25 分钟"
tags: [workspace, cargo, 多crate, monorepo, 共享依赖, "virtual workspace"]
number: "8.1"
chapterTitle: "项目工程化"
chapterNumber: "08"
---
<div id="article-content"> <h1 id="工作空间基础">工作空间基础</h1>
<h2 id="为什么需要工作空间">为什么需要工作空间</h2>
<p>随着项目规模增大，单个 crate 会变得臃肿难以维护。更常见的情况是：一个项目自然分成了几个部分——核心库 + CLI 工具 + 集成测试 + 辅助工具库。</p>
<p>如果把它们当作<strong>独立项目</strong>来管理，麻烦就来了：</p>
<ul>
<li>每次修改核心库，都要先发布新版本，再更新工具的 <code>Cargo.toml</code>，非常繁琐</li>
<li>各自有独立的 <code>target/</code> 目录，重复编译同样的依赖，浪费大量时间</li>
<li>无法在一条命令里构建和测试所有部分</li>
</ul>
<p><strong>工作空间（Workspace）</strong> 就是解决这个问题的方案：把多个相关 crate 放在同一个目录下，用一个根 <code>Cargo.toml</code> 统一管理。</p>
<h2 id="工作空间的文件结构">工作空间的文件结构</h2>
<p>一个典型的工作空间长这样：</p>
<pre><code class="language-text">my_project/            ← 工作空间根目录
├── Cargo.toml         ← 工作空间配置（根 Cargo.toml）
├── Cargo.lock         ← 共享的依赖锁文件
├── target/            ← 共享的构建目录
├── my_lib/            ← 成员 crate：核心库
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── my_cli/            ← 成员 crate：命令行工具
    ├── Cargo.toml
    └── src/
        └── main.rs</code></pre>
<p>根目录的 <code>Cargo.toml</code> 使用 <code>[workspace]</code> 段落声明这是一个工作空间，并通过 <code>members</code> 列出所有成员：</p>
<pre><code class="language-toml"># 根 Cargo.toml
[workspace]
members = [
    "my_lib",
    "my_cli",
]
resolver = "2"</code></pre>
<blockquote>
<p><strong><code>resolver = "2"</code></strong>：从 Rust 2021 edition 起，建议在工作空间中显式声明使用第 2 版依赖解析器，它在处理 features 时行为更一致、更符合直觉。</p>
</blockquote>
<p>每个成员 crate 有自己的 <code>Cargo.toml</code>，跟普通项目一样：</p>
<pre><code class="language-toml"># my_lib/Cargo.toml
[package]
name = "my_lib"
version = "0.1.0"
edition = "2021"</code></pre>
<pre><code class="language-toml"># my_cli/Cargo.toml
[package]
name = "my_cli"
version = "0.1.0"
edition = "2021"

[dependencies]
my_lib = { path = "../my_lib" }  # 引用同工作空间内的本地 crate</code></pre>
<h2 id="在工作空间中运行命令">在工作空间中运行命令</h2>
<p>在工作空间根目录下，可以用 <code>-p</code>（<code>--package</code>）指定针对哪个成员运行命令：</p>
<pre><code class="language-bash"># 编译所有成员
cargo build --workspace

# 只编译 my_lib
cargo build -p my_lib

# 运行 my_cli（必须是二进制 crate）
cargo run -p my_cli

# 测试所有成员
cargo test --workspace

# 只测试 my_cli
cargo test -p my_cli

# 快速检查所有成员（不生成二进制文件，比 build 快）
cargo check --workspace</code></pre>
<blockquote>
<p><strong>共享 <code>target/</code></strong>：所有成员共用同一个 <code>target/</code> 编译目录。这意味着：如果 <code>my_lib</code> 和 <code>my_cli</code> 都依赖 <code>serde</code>，它只会被编译一次。大型项目里这能节省大量编译时间。</p>
</blockquote>
<h1 id="依赖管理">依赖管理</h1>
<h2 id="共享的-cargolock">共享的 Cargo.lock</h2>
<p>工作空间只有<strong>一个</strong> <code>Cargo.lock</code>，位于根目录。这意味着所有成员 crate 使用同一份依赖版本快照。</p>
<p>好处：</p>
<ul>
<li><strong>版本一致</strong>：<code>my_lib</code> 和 <code>my_cli</code> 使用完全相同版本的 <code>serde</code>，不会出现”我这里是 1.0.180，你那里是 1.0.193”这种诡异问题</li>
<li><strong>确定性构建</strong>：整个工作空间的构建行为完全可复现</li>
</ul>
<h2 id="工作空间级别的共享依赖">工作空间级别的共享依赖</h2>
<p>如果多个成员都依赖同一个外部 crate，你每次都要在各自的 <code>Cargo.toml</code> 里写，还要保证版本号一致——容易出错。</p>
<p>从 Rust 1.64 起，可以在根 <code>Cargo.toml</code> 的 <code>[workspace.dependencies]</code> 里<strong>统一声明依赖</strong>，各成员直接继承：</p>
<pre><code class="language-toml"># 根 Cargo.toml
[workspace]
members = ["my_lib", "my_cli"]
resolver = "2"

[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
anyhow = "1.0"</code></pre>
<blockquote>
<p><strong>Features 小知识</strong>：<code>features</code> 是依赖库的<strong>可选功能模块</strong>，编译时由你选择启用哪些（如 serde 的 derive 宏），未启用的代码完全不参与编译，可以减小二进制体积。文章后面会专门讲解。</p>
</blockquote>
<p>成员的 <code>Cargo.toml</code> 只需写 <code>workspace = true</code> 来继承：</p>
<pre><code class="language-toml"># my_lib/Cargo.toml
[dependencies]
serde = { workspace = true }      # 继承根的版本和 features
anyhow = { workspace = true }

# 可以在继承基础上追加额外 features
tokio = { workspace = true, features = ["sync"] }</code></pre>
<blockquote>
<p><strong>features 是累加的</strong>：继承 <code>workspace.dependencies</code> 时，你只能追加 features，不能删除根里已有的。这与 Cargo feature 的”累加”设计是一致的——features 只能开启，不能关闭。</p>
</blockquote>
<h2 id="虚拟工作空间">虚拟工作空间</h2>
<h3 id="什么是虚拟工作空间">什么是虚拟工作空间</h3>
<p>有两种工作空间结构：</p>
<p><strong>非虚拟（常见）</strong>：根目录本身是一个 crate</p>
<pre><code class="language-text">my_project/           ← 根目录既是工作空间，也是一个 crate
├── Cargo.toml        （有 [package] + [workspace]）
├── src/
└── member1/
    └── Cargo.toml</code></pre>
<p><strong>虚拟（特殊）</strong>：根目录只是”容器”，本身不是 crate</p>
<pre><code class="language-text">monorepo/             ← 根目录只是工作空间，不是 crate
├── Cargo.toml        （只有 [workspace]，没有 [package]）
├── lib_a/
│   └── Cargo.toml
├── lib_b/
│   └── Cargo.toml
└── lib_c/
    └── Cargo.toml</code></pre>
<h3 id="为什么要用虚拟工作空间">为什么要用虚拟工作空间</h3>
<ul>
<li><strong>根没有代码</strong>：有些项目天然是”多个独立库的集合”，比如 Tokio 生态（tokio、tokio-util、tokio-native-tls 各是独立库）</li>
<li><strong>避免歧义</strong>：没有一个”主”库，所以 <code>cargo build</code> 默认不知道该构建谁，必须明确指定，更清晰</li>
<li><strong>平等性</strong>：所有成员地位相同，没有”这个是主，那个是附属”的混乱</li>
</ul>
<h3 id="行为差异">行为差异</h3>
<table><thead><tr><th>场景</th><th>虚拟工作空间</th><th>有 [package] 的工作空间</th></tr></thead><tbody><tr><td><code>cargo build</code>（无参）</td><td>构建<strong>所有</strong>成员</td><td>只构建<strong>根</strong> package</td></tr><tr><td><code>cargo run</code></td><td>报错（没有根二进制）</td><td>运行根的 main 函数</td></tr><tr><td><code>cargo test --workspace</code></td><td>测试所有成员</td><td>测试所有成员</td></tr></tbody></table>
<p><strong>实际使用建议</strong>：</p>
<ul>
<li>如果你的项目有一个”主”库或应用（如 web 服务器），用<strong>有 [package] 的工作空间</strong></li>
<li>如果是平等的多个库组合（如工具链、中间件库族），用<strong>虚拟工作空间</strong></li>
</ul>
<h1 id="features">Features</h1>
<h2 id="什么是-features-以及为什么需要它们">什么是 Features 以及为什么需要它们</h2>
<p>在工作空间讲解中，我们看到了这样的用法：</p>
<pre><code class="language-toml">[dependencies]
tokio = { version = "1", features = ["full"] }</code></pre>
<p>这里的 <code>features = ["full"]</code> 表示：“我要使用 tokio 这个库，并启用它的所有功能”。</p>
<p><strong>关键澄清</strong>：<code>"full"</code> 不是 Cargo 的内置关键字，而是 <strong>tokio 库作者定义的一个特殊 feature 的名字</strong>。这个 feature 的作用就是启用 tokio 提供的所有可选功能。</p>
<p>如果用户不想要所有功能，可以只选择需要的：</p>
<pre><code class="language-toml">[dependencies]
# 只启用 sync 和 time 功能（不启用其他）
tokio = { version = "1", features = ["sync", "time"] }</code></pre>
<p><strong>背景</strong>：很多库会提供多个可选功能。比如 tokio 库可以提供：</p>
<ul>
<li>异步运行时（rt）</li>
<li>同步原语（sync）</li>
<li>计时器（time）</li>
<li>I/O 工具（io-util）</li>
<li>等等…</li>
</ul>
<p>库的作者不想强迫所有用户都编译所有功能，因为：</p>
<ul>
<li>编译时间长</li>
<li>二进制文件体积大</li>
<li>可能有不需要的依赖被引入</li>
</ul>
<p>所以库提供了 <strong>features</strong> 机制：用户可以选择”我需要哪些功能”。</p>
<h2 id="两个视角理解-features">两个视角理解 Features</h2>
<img alt="features" src="/RustCourse/diagrams/features.svg" style="max-width:100%;margin:1rem 0;"/>
<h3 id="视角-1作为库的使用者用户">视角 1：作为库的使用者（用户）</h3>
<p>当你使用提供 features 的库时，比如 tokio，你可以：</p>
<pre><code class="language-toml"># 使用默认 features（tokio 默认是 rt）
tokio = "1"

# 启用特定 features（比如同步原语和计时器）
tokio = { version = "1", features = ["sync", "time"] }

# 启用所有 features
tokio = { version = "1", features = ["full"] }

# 关掉默认 features，只启用某些
tokio = { version = "1", default-features = false, features = ["rt"] }</code></pre>
<h3 id="视角-2作为库的设计者库作者">视角 2：作为库的设计者（库作者）</h3>
<p>现在反过来，<strong>如果你在设计 tokio 这样的库</strong>，怎么定义 features？</p>
<p>tokio 库就是这样做的，它提供多个可选功能模块。假设 tokio 的简化版本长这样：</p>
<pre><code class="language-toml"># Cargo.toml

[features]
# 定义有哪些 features，以及它们之间的关系
default = ["rt"]             # 默认启用异步运行时
rt = []                      # 运行时功能本身不需要额外依赖
sync = []                    # 同步原语功能
time = []                    # 计时器功能
io-util = []                 # I/O 工具功能
full = ["rt", "sync", "time", "io-util"]  # 启用所有功能

[dependencies]
# 这些库用 optional = true 标记为可选
# 比如，某些高级功能可能需要额外的依赖库
# （现实中 tokio 不完全这样做，这里为了讲解简化）</code></pre>
<p><strong>逻辑关系</strong>：</p>
<ol>
<li><code>[features]</code> 中，定义可用的 feature 及其组合关系</li>
<li><code>default</code> 定义默认启用哪些</li>
<li><code>"full"</code> 是一个特殊 feature，它启用其他所有 features</li>
</ol>
<h2 id="库设计者的三个步骤以-tokio-为例">库设计者的三个步骤（以 tokio 为例）</h2>
<h3 id="步骤-1声明可选依赖">步骤 1：声明可选依赖</h3>
<pre><code class="language-toml">[dependencies]
tokio-util = { version = "0.7", optional = true }
tracing = { version = "0.1", optional = true }</code></pre>
<p><code>optional = true</code> 表示这个库<strong>不是必需的</strong>。只有当用户启用了依赖这个库的 feature 时，这个库才会被下载和编译。如果没有任何 feature 需要它，这个库就根本不会出现在项目中。</p>
<h3 id="步骤-2在-features-中关联">步骤 2：在 Features 中关联</h3>
<pre><code class="language-toml">[features]
default = ["rt"]
rt = []                           # 异步运行时，无外部依赖
sync = []                         # 同步原语
time = []                         # 计时器
io-util = ["dep:tokio-util"]      # I/O 工具需要额外的库
tracing-support = ["dep:tracing"] # 追踪支持需要额外的库
full = ["rt", "sync", "time", "io-util", "tracing-support"]</code></pre>
<p><code>dep:库名</code> 表示”启用这个 feature 时，引入对应的库”。注意：是 <code>dep:</code> 前缀，不是直接写库名。这样明确区分”库的名字”和”feature 的名字”。</p>
<h3 id="步骤-3在代码中条件编译">步骤 3：在代码中条件编译</h3>
<pre><code class="language-rust">// 基础功能，总是存在
pub fn version() {
    println!("tokio 1.0");
}

// 异步运行时：只在启用 rt feature 时编译
#[cfg(feature = "rt")]
pub fn spawn_task&lt;F&gt;(task: F)
where
    F: Fn() + Send + 'static,
{
    println!("在运行时中生成任务");
}

// 同步原语：只在启用 sync feature 时编译
#[cfg(feature = "sync")]
pub fn create_mutex&lt;T&gt;(value: T) {
    println!("创建互斥锁");
}

// 计时器：只在启用 time feature 时编译
#[cfg(feature = "time")]
pub fn sleep_ms(ms: u64) {
    println!("睡眠 {} 毫秒", ms);
}

// I/O 工具：需要 tokio-util 库，只在启用 io-util feature 时编译
#[cfg(feature = "io-util")]
pub fn use_codec() {
    use tokio_util;  // 这个 use 也被条件编译
    println!("使用 codec");
}</code></pre>
<p><strong>关键</strong>：当用户启用 <code>tokio = { version = "1", features = ["sync", "time"] }</code> 时：</p>
<ul>
<li><code>rt</code>、<code>sync</code>、<code>time</code> 被启用，对应的函数<strong>被编译进来</strong></li>
<li><code>io-util</code> 没被启用，<code>use_codec</code> 函数<strong>不会被编译</strong></li>
<li><code>tokio-util</code> 库<strong>不会被下载</strong></li>
<li>二进制文件中<strong>没有未使用功能的代码</strong></li>
</ul>
<p>这就是 features 的”零成本”抽象。</p>
<h2 id="库使用者的使用方式">库使用者的使用方式</h2>
<p>当用户在 <code>Cargo.toml</code> 中选择启用某个 feature 时，如果那个 feature 需要可选依赖，Cargo 会自动拉下来：</p>
<pre><code class="language-toml">[dependencies]
# 启用 io-util feature，tokio-util 库会自动被下载和编译
tokio = { version = "1", features = ["io-util"] }

# 启用多个 features，所有需要的库都会被拉下来
tokio = { version = "1", features = ["sync", "io-util", "tracing-support"] }</code></pre>
<p>这样做的好处：</p>
<ul>
<li>用户不需要手动管理 <code>tokio-util</code> 等可选依赖</li>
<li>Cargo 根据选择的 features，自动推导需要哪些库</li>
<li>未选择的 feature 对应的库<strong>完全不下载</strong>，节省空间</li>
</ul>
<h3 id="从命令行启用-features">从命令行启用 Features</h3>
<p>库作者设计好 features 后，用户也可以从命令行选择：</p>
<pre><code class="language-bash"># 启用指定 features
cargo build --features "sync,io-util"

# 启用所有 features（包括所有可选依赖）
cargo build --all-features

# 不启用默认 features，只选特定的
cargo build --no-default-features --features "io-util"</code></pre>
<h1 id="练习题">练习题</h1>
<h2 id="工作空间概念测验">工作空间概念测验</h2>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E4%B8%AD%EF%BC%8CCargo.lock%20%E6%96%87%E4%BB%B6%E7%9A%84%E4%BD%8D%E7%BD%AE%E5%92%8C%E6%95%B0%E9%87%8F%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%AF%8F%E4%B8%AA%E6%88%90%E5%91%98%20crate%20%E5%90%84%E6%9C%89%E4%B8%80%E4%B8%AA%EF%BC%8C%E4%BD%8D%E4%BA%8E%E5%90%84%E8%87%AA%E7%9B%AE%E5%BD%95%E4%B8%8B%22%2C%22%E4%B8%8D%E5%AD%98%E5%9C%A8%20Cargo.lock%EF%BC%8C%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E4%B8%8D%E6%94%AF%E6%8C%81%E9%94%81%E5%AE%9A%E4%BE%9D%E8%B5%96%22%2C%22%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%EF%BC%8C%E4%BD%8D%E4%BA%8E%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E6%A0%B9%E7%9B%AE%E5%BD%95%22%2C%22%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%EF%BC%8C%E4%BD%8D%E4%BA%8E%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%88%90%E5%91%98%E7%9B%AE%E5%BD%95%E4%B8%8B%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%E6%A0%B9%20Cargo.lock%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%E4%BD%BF%E7%94%A8%E5%AE%8C%E5%85%A8%E7%9B%B8%E5%90%8C%E7%9A%84%E4%BE%9D%E8%B5%96%E7%89%88%E6%9C%AC%E3%80%82%E8%BF%99%E6%98%AF%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%5C%22%E5%85%B1%E4%BA%AB%E4%BE%9D%E8%B5%96%E4%B8%80%E8%87%B4%E6%80%A7%5C%22%E7%9A%84%E6%A0%B8%E5%BF%83%E6%9C%BA%E5%88%B6%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:1" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%E6%9C%89%20%5Bpackage%5D%20%E7%9A%84%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E6%A0%B9%E7%9B%AE%E5%BD%95%E8%BF%90%E8%A1%8C%20cargo%20build%EF%BC%88%E4%B8%8D%E5%8A%A0%E4%BB%BB%E4%BD%95%E5%8F%82%E6%95%B0%EF%BC%89%EF%BC%8C%E4%BC%9A%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%9E%84%E5%BB%BA%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%22%2C%22%E6%8A%A5%E9%94%99%EF%BC%8C%E5%BF%85%E9%A1%BB%E6%8C%87%E5%AE%9A%20-p%22%2C%22%E8%AF%A2%E9%97%AE%E7%94%A8%E6%88%B7%E8%A6%81%E6%9E%84%E5%BB%BA%E5%93%AA%E4%B8%AA%E6%88%90%E5%91%98%22%2C%22%E5%8F%AA%E6%9E%84%E5%BB%BA%E6%A0%B9%20package%EF%BC%8C%E4%B8%8D%E6%9E%84%E5%BB%BA%E5%85%B6%E4%BB%96%E6%88%90%E5%91%98%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E5%BD%93%E6%A0%B9%20Cargo.toml%20%E5%90%8C%E6%97%B6%E6%9C%89%20%5Bpackage%5D%20%E5%92%8C%20%5Bworkspace%5D%20%E6%97%B6%EF%BC%8Ccargo%20build%20%E7%9A%84%E9%BB%98%E8%AE%A4%E7%9B%AE%E6%A0%87%E6%98%AF%E6%A0%B9%20package%20%E6%9C%AC%E8%BA%AB%E3%80%82%E8%A6%81%E6%9E%84%E5%BB%BA%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%EF%BC%8C%E9%9C%80%E8%A6%81%E5%8A%A0%20--workspace%20%E5%8F%82%E6%95%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%BD%BF%E7%94%A8%20Cargo%20%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E6%9C%89%E5%93%AA%E4%BA%9B%E4%BC%98%E5%8A%BF%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E5%86%85%E7%9A%84%20crate%20%E4%B8%8D%E9%9C%80%E8%A6%81%E5%90%84%E8%87%AA%E7%9A%84%20Cargo.toml%22%2C%22%E5%8F%AF%E7%94%A8%20workspace.dependencies%20%E7%BB%9F%E4%B8%80%E7%AE%A1%E7%90%86%E5%85%B1%E4%BA%AB%E4%BE%9D%E8%B5%96%E7%9A%84%E7%89%88%E6%9C%AC%E5%8F%B7%22%2C%22%E5%85%B1%E4%BA%AB%20target%2F%20%E7%9B%AE%E5%BD%95%EF%BC%8C%E7%9B%B8%E5%90%8C%E4%BE%9D%E8%B5%96%E5%8F%AA%E7%BC%96%E8%AF%91%E4%B8%80%E6%AC%A1%EF%BC%8C%E8%8A%82%E7%9C%81%E7%BC%96%E8%AF%91%E6%97%B6%E9%97%B4%22%2C%22%E5%8D%95%E4%B8%AA%20Cargo.lock%20%E4%BF%9D%E8%AF%81%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%E4%BD%BF%E7%94%A8%E7%9B%B8%E5%90%8C%E7%9A%84%E4%BE%9D%E8%B5%96%E7%89%88%E6%9C%AC%22%5D%2C%22correct%22%3A%5B1%2C2%2C3%5D%2C%22explanation%22%3A%22%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E7%9A%84%E4%B8%89%E5%A4%A7%E4%BC%98%E5%8A%BF%EF%BC%9A%E5%85%B1%E4%BA%AB%E7%BC%96%E8%AF%91%E7%BC%93%E5%AD%98%E3%80%81%E4%B8%80%E8%87%B4%E7%9A%84%E4%BE%9D%E8%B5%96%E7%89%88%E6%9C%AC%E3%80%81%E7%BB%9F%E4%B8%80%E7%9A%84%E4%BE%9D%E8%B5%96%E5%A3%B0%E6%98%8E%E3%80%82%E4%BD%86%E6%AF%8F%E4%B8%AA%E6%88%90%E5%91%98%20crate%20%E4%BB%8D%E7%84%B6%E9%9C%80%E8%A6%81%E8%87%AA%E5%B7%B1%E7%9A%84%20Cargo.toml%20%E6%9D%A5%E5%A3%B0%E6%98%8E%20%5Bpackage%5D%20%E4%BF%A1%E6%81%AF%E5%92%8C%E5%90%84%E8%87%AA%E7%8B%AC%E7%89%B9%E7%9A%84%E4%BE%9D%E8%B5%96%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:3" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%88%90%E5%91%98%20crate%20%E5%A6%82%E4%BD%95%E5%BC%95%E7%94%A8%E5%90%8C%E4%B8%80%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E5%86%85%E7%9A%84%E5%8F%A6%E4%B8%80%E4%B8%AA%20crate%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9C%A8%E6%A0%B9%20Cargo.toml%20%E4%B8%AD%E5%A3%B0%E6%98%8E%E4%B8%80%E6%AC%A1%EF%BC%8C%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%E8%87%AA%E5%8A%A8%E5%8F%AF%E8%A7%81%22%2C%22%E5%8F%AA%E8%83%BD%E9%80%9A%E8%BF%87%E5%8F%91%E5%B8%83%E5%88%B0%20crates.io%20%E5%90%8E%E5%86%8D%E5%BC%95%E7%94%A8%22%2C%22%E5%9C%A8%20Cargo.toml%20%E7%9A%84%20%5Bdependencies%5D%20%E4%B8%AD%E7%94%A8%20path%20%3D%20%5C%22..%2Fother%5C%22%20%E5%A3%B0%E6%98%8E%E6%9C%AC%E5%9C%B0%E8%B7%AF%E5%BE%84%22%2C%22%E7%9B%B4%E6%8E%A5%20use%20%E5%AF%B9%E6%96%B9%E7%9A%84%E6%A8%A1%E5%9D%97%EF%BC%8C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%A3%B0%E6%98%8E%E4%BE%9D%E8%B5%96%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E5%86%85%E7%9A%84%E6%9C%AC%E5%9C%B0%20crate%20%E9%80%9A%E8%BF%87%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%BC%95%E7%94%A8%EF%BC%8C%E5%A6%82%20my_lib%20%3D%20%7B%20path%20%3D%20%5C%22..%2Fmy_lib%5C%22%20%7D%E3%80%82Cargo%20%E4%BC%9A%E8%AF%86%E5%88%AB%E8%BF%99%E6%98%AF%E5%90%8C%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E7%9A%84%E6%9C%AC%E5%9C%B0%E4%BE%9D%E8%B5%96%EF%BC%8C%E6%94%B9%E5%8A%A8%E7%AB%8B%E5%88%BB%E7%94%9F%E6%95%88%EF%BC%8C%E6%97%A0%E9%9C%80%E5%8F%91%E5%B8%83%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<pre><code class="language-toml"># 根 Cargo.toml：
[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }

# my_cli 的 Cargo.toml：
[dependencies]
serde = { workspace = true, features = ["rc"] }</code></pre>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:4" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8A%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E4%B8%AD%EF%BC%8Cmy_cli%20%E7%BB%A7%E6%89%BF%E4%BA%86%20serde%20%E5%90%8E%E8%BF%98%E9%A2%9D%E5%A4%96%E8%BF%BD%E5%8A%A0%E4%BA%86%20features%E3%80%82%E8%BF%99%E6%A0%B7%E5%81%9A%E7%9A%84%E7%BB%93%E6%9E%9C%E6%98%AF%EF%BC%9F%22%2C%22options%22%3A%5B%22my_cli%20%E7%9A%84%20serde%20%E5%8F%AA%E6%9C%89%20rc%EF%BC%8C%E8%A6%86%E7%9B%96%E4%BA%86%E6%A0%B9%E7%9A%84%20derive%22%2C%22%E5%8F%AA%E6%9C%89%20derive%EF%BC%8Crc%20%E8%A2%AB%E5%BF%BD%E7%95%A5%22%2C%22my_cli%20%E7%9A%84%20serde%20%E5%90%8C%E6%97%B6%E5%90%AF%E7%94%A8%20derive%20%E5%92%8C%20rc%22%2C%22%E6%8A%A5%E9%94%99%EF%BC%8C%E7%BB%A7%E6%89%BF%E6%97%B6%E4%B8%8D%E8%83%BD%E8%BF%BD%E5%8A%A0%20features%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Cargo%20features%20%E6%98%AF%E7%B4%AF%E5%8A%A0%E7%9A%84%EF%BC%8C%E7%BB%A7%E6%89%BF%E6%97%B6%E8%BF%BD%E5%8A%A0%E7%9A%84%20features%20%E4%BC%9A%E4%B8%8E%E6%A0%B9%E5%A3%B0%E6%98%8E%E7%9A%84%E5%90%88%E5%B9%B6%E3%80%82%E6%9C%80%E7%BB%88%20my_cli%20%E4%BD%BF%E7%94%A8%E7%9A%84%20serde%20%E5%90%8C%E6%97%B6%E5%90%AF%E7%94%A8%20derive%EF%BC%88%E6%9D%A5%E8%87%AA%E6%A0%B9%EF%BC%89%E5%92%8C%20rc%EF%BC%88%E6%9D%A5%E8%87%AA%E6%88%90%E5%91%98%E8%BF%BD%E5%8A%A0%EF%BC%89%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="features-与工作空间">Features 与工作空间</h2>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:5" data-kind="single" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%85%B3%E4%BA%8E%20Cargo%20features%20%E7%9A%84%E8%AF%B4%E6%B3%95%EF%BC%8C%E5%93%AA%E4%B8%AA%E6%98%AF%E6%AD%A3%E7%A1%AE%E7%9A%84%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%AF%8F%E4%B8%AA%20feature%20%E9%83%BD%E5%BF%85%E9%A1%BB%E5%AF%B9%E5%BA%94%E4%B8%80%E4%B8%AA%E4%BE%9D%E8%B5%96%E5%BA%93%22%2C%22Features%20%E6%98%AF%E7%B4%AF%E5%8A%A0%E7%9A%84%EF%BC%9A%E4%B8%80%E6%97%A6%E5%BC%80%E5%90%AF%E5%B0%B1%E4%B8%8D%E4%BC%9A%E5%86%8D%E8%A2%AB%E5%85%B3%E9%97%AD%22%2C%22default%20features%20%E4%B8%8D%E8%83%BD%E8%A2%AB%E7%94%A8%E6%88%B7%E5%85%B3%E6%8E%89%22%2C%22Features%20%E5%8F%AF%E4%BB%A5%E7%94%A8%20--disable-features%20%E5%85%B3%E9%97%AD%E5%B7%B2%E5%BC%80%E5%90%AF%E7%9A%84%20feature%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22Features%20%E7%9A%84%E6%A0%B8%E5%BF%83%E7%89%B9%E6%80%A7%E6%98%AF%5C%22%E7%B4%AF%E5%8A%A0%E6%80%A7%5C%22%E2%80%94%E2%80%94%E5%8F%AA%E8%83%BD%E5%BC%80%E5%90%AF%EF%BC%8C%E4%B8%8D%E8%83%BD%E5%85%B3%E9%97%AD%E3%80%82%E8%BF%99%E4%BF%9D%E8%AF%81%E4%BA%86%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4%E5%86%85%E6%89%80%E6%9C%89%E6%88%90%E5%91%98%E4%BD%BF%E7%94%A8%E4%B8%80%E8%87%B4%E7%9A%84%E4%BE%9D%E8%B5%96%E9%85%8D%E7%BD%AE%E3%80%82%E5%A6%82%E6%9E%9C%E6%88%90%E5%91%98%20A%20%E4%BE%9D%E8%B5%96%E7%9A%84%E5%BA%93%E5%BC%80%E5%90%AF%E4%BA%86%E6%9F%90%20feature%EF%BC%8C%E8%80%8C%E6%88%90%E5%91%98%20B%20%E4%B8%8D%E6%83%B3%E8%A6%81%EF%BC%8CCargo%20%E4%B9%9F%E4%BC%9A%E7%A1%AE%E4%BF%9D%E8%BF%99%E4%B8%AA%20feature%20%E4%BE%9D%E7%84%B6%E5%BC%80%E5%90%AF%EF%BC%8C%E9%81%BF%E5%85%8D%E7%89%88%E6%9C%AC%E4%B8%8D%E4%B8%80%E8%87%B4%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:6" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E6%98%AF%20Cargo%20%E5%91%BD%E4%BB%A4%E7%9A%84%E6%AD%A3%E7%A1%AE%E7%94%A8%E6%B3%95%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22cargo%20build%20--features%20%5C%22websocket%2Ctls%5C%22%20%20%EF%BC%88%E5%90%AF%E7%94%A8%E6%8C%87%E5%AE%9A%20features%EF%BC%89%22%2C%22cargo%20build%20--all-features%20%20%EF%BC%88%E5%90%AF%E7%94%A8%E6%89%80%E6%9C%89%20features%EF%BC%89%22%2C%22cargo%20build%20--disable-features%20tls%20%20%EF%BC%88%E4%B8%8D%E5%AD%98%E5%9C%A8%E8%BF%99%E4%B8%AA%E5%8F%82%E6%95%B0%EF%BC%89%22%2C%22cargo%20build%20--no-default-features%20%20%EF%BC%88%E7%A6%81%E7%94%A8%E9%BB%98%E8%AE%A4%20features%EF%BC%89%22%5D%2C%22correct%22%3A%5B0%2C1%2C3%5D%2C%22explanation%22%3A%22Cargo%20%E6%94%AF%E6%8C%81%20--features%EF%BC%88%E6%8C%87%E5%AE%9A%EF%BC%89%E3%80%81--all-features%EF%BC%88%E5%85%A8%E9%83%A8%EF%BC%89%E3%80%81--no-default-features%EF%BC%88%E5%85%B3%E6%8E%89%E9%BB%98%E8%AE%A4%EF%BC%89%E3%80%82%E6%B2%A1%E6%9C%89%20--disable-features%20%E8%BF%99%E4%B8%AA%E5%8F%82%E6%95%B0%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:7" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20%5Bfeatures%5D%20%E4%B8%AD%E5%A3%B0%E6%98%8E%20websocket%20%3D%20%5B%5C%22http%5C%22%5D%20%E8%A1%A8%E7%A4%BA%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22websocket%20%E5%92%8C%20http%20%E6%98%AF%E4%BA%92%E6%96%A5%E7%9A%84%EF%BC%8C%E5%90%AF%E7%94%A8%E4%B8%80%E4%B8%AA%E6%97%B6%E5%8F%A6%E4%B8%80%E4%B8%AA%E4%B8%8D%E5%8F%AF%E7%94%A8%22%2C%22%E5%90%AF%E7%94%A8%20websocket%20feature%20%E6%97%B6%EF%BC%8Chttp%20feature%20%E4%B9%9F%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%A2%AB%E5%90%AF%E7%94%A8%22%2C%22http%20%E6%98%AF%20websocket%20%E7%9A%84%E5%89%8D%E6%8F%90%EF%BC%8C%E5%A6%82%E6%9E%9C%E6%B2%A1%E6%9C%89%20http%EF%BC%8Cwebsocket%20%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%22%2C%22websocket%20%E5%92%8C%20http%20%E6%98%AF%E5%90%8C%E4%B8%80%E4%B8%AA%20feature%20%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%90%8D%E5%AD%97%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22features%20%E7%9A%84%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB%E6%98%AF%5C%22%E5%90%AF%E7%94%A8%20A%20%E6%97%B6%E8%87%AA%E5%8A%A8%E5%90%AF%E7%94%A8%20B%5C%22%E3%80%82websocket%20%3D%20%5B%5C%22http%5C%22%5D%20%E6%84%8F%E5%91%B3%E7%9D%80%E4%BB%BB%E4%BD%95%E5%BC%80%E5%90%AF%20websocket%20%E7%9A%84%E5%9C%BA%E6%99%AF%E9%83%BD%E4%BC%9A%E8%87%AA%E5%8A%A8%E6%8B%A5%E6%9C%89%20http%20feature%EF%BC%8C%E4%BD%93%E7%8E%B0%E4%BA%86%20features%20%E7%9A%84%E7%B4%AF%E5%8A%A0%E6%80%A7%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:8" data-kind="single" data-payload="%7B%22question%22%3A%22%E6%83%B3%E5%9C%A8%E8%87%AA%E5%B7%B1%E7%9A%84%E9%A1%B9%E7%9B%AE%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9F%90%E4%B8%AA%E5%BA%93%EF%BC%8C%E4%BD%86%E4%B8%8D%E6%83%B3%E8%A6%81%E5%AE%83%E7%9A%84%E9%BB%98%E8%AE%A4%20features%EF%BC%8C%E5%BA%94%E8%AF%A5%E6%80%8E%E4%B9%88%E5%86%99%EF%BC%9F%22%2C%22options%22%3A%5B%22my_lib%20%3D%20%7B%20version%20%3D%20%5C%221.0%5C%22%2C%20features%20%3D%20%5B%5D%20%7D%22%2C%22my_lib%20%3D%20%7B%20version%20%3D%20%5C%221.0%5C%22%2C%20default-features%20%3D%20false%20%7D%22%2C%22my_lib%20%3D%20%7B%20version%20%3D%20%5C%221.0%5C%22%2C%20no-default%20%3D%20true%20%7D%22%2C%22%E6%97%A0%E6%B3%95%E5%85%B3%E6%8E%89%E9%BB%98%E8%AE%A4%20features%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%85%A8%E9%83%A8%E6%8E%A5%E5%8F%97%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22%E7%94%A8%20default-features%20%3D%20false%20%E5%8F%AF%E4%BB%A5%E5%85%B3%E6%8E%89%E4%BE%9D%E8%B5%96%E5%BA%93%E7%9A%84%E9%BB%98%E8%AE%A4%20features%EF%BC%88%E6%B3%A8%E6%84%8F%E4%B8%8D%E6%98%AF%E8%87%AA%E5%B7%B1%20crate%20%E7%9A%84%20default%20features%EF%BC%8C%E8%80%8C%E6%98%AF%E9%82%A3%E4%B8%AA%E4%BE%9D%E8%B5%96%E7%9A%84%EF%BC%89%E3%80%82%E7%84%B6%E5%90%8E%E5%86%8D%E7%94%A8%20features%20%3D%20%5B%5C%22...%5C%22%5D%20%E5%8D%95%E7%8B%AC%E6%8C%87%E5%AE%9A%E9%9C%80%E8%A6%81%E7%9A%84%E5%8A%9F%E8%83%BD%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="08-engineering/01-workspace#3:9" data-kind="multi" data-payload="%7B%22question%22%3A%22%E5%9C%A8%E5%BA%93%E8%AE%BE%E8%AE%A1%E4%B8%AD%EF%BC%8C%E4%BD%BF%E7%94%A8%20features%20%E7%9A%84%E5%A5%BD%E5%A4%84%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F%EF%BC%88%E5%A4%9A%E9%80%89%EF%BC%89%22%2C%22options%22%3A%5B%22%E7%AE%80%E5%8C%96%E4%BE%9D%E8%B5%96%E6%A0%91%EF%BC%88%E5%8F%AF%E9%80%89%E4%BE%9D%E8%B5%96%E5%8F%AA%E5%9C%A8%E9%9C%80%E8%A6%81%E6%97%B6%E5%BC%95%E5%85%A5%EF%BC%89%22%2C%22%E6%94%AF%E6%8C%81%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%88%E5%90%8C%E4%B8%80%E4%BB%BD%E4%BB%A3%E7%A0%81%E9%80%82%E9%85%8D%E5%A4%9A%E7%A7%8D%E5%9C%BA%E6%99%AF%EF%BC%89%22%2C%22%E5%87%8F%E5%B0%8F%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%BD%93%E7%A7%AF%EF%BC%88%E7%94%A8%E6%88%B7%E5%8F%AA%E7%BC%96%E8%AF%91%E9%9C%80%E8%A6%81%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%89%22%2C%22features%20%E4%B8%8D%E5%BD%B1%E5%93%8D%E7%BC%96%E8%AF%91%E7%BB%93%E6%9E%9C%E5%A4%A7%E5%B0%8F%EF%BC%8C%E5%8F%AA%E6%98%AF%E4%BB%A3%E7%A0%81%E7%BB%84%E7%BB%87%E6%96%B9%E5%BC%8F%22%5D%2C%22correct%22%3A%5B0%2C1%2C2%5D%2C%22explanation%22%3A%22Features%20%E7%9A%84%E4%B8%89%E5%A4%A7%E4%BB%B7%E5%80%BC%E9%83%BD%E4%BD%93%E7%8E%B0%E5%9C%A8%E8%BF%99%E9%87%8C%E3%80%82%E6%9C%AA%E5%90%AF%E7%94%A8%E7%9A%84%E4%BB%A3%E7%A0%81%E5%AE%8C%E5%85%A8%E4%B8%8D%E7%BC%96%E8%AF%91%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%98%BE%E8%91%97%E5%87%8F%E5%B0%8F%E4%BD%93%E7%A7%AF%E3%80%82%E5%8F%AF%E9%80%89%E4%BE%9D%E8%B5%96%E5%8F%AA%E5%9C%A8%20feature%20%E5%90%AF%E7%94%A8%E6%97%B6%E5%BC%95%E5%85%A5%E3%80%82%E9%80%9A%E8%BF%87%20feature%20%E7%BB%84%E5%90%88%EF%BC%8C%E5%90%8C%E4%B8%80%E4%B8%AA%E5%BA%93%E5%8F%AF%E4%BB%A5%E6%94%AF%E6%8C%81%E5%B5%8C%E5%85%A5%E5%BC%8F%E3%80%81web%E3%80%81CLI%20%E7%AD%89%E5%A4%9A%E7%A7%8D%E5%9C%BA%E6%99%AF%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
