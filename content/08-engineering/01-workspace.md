# 工作空间基础
## 为什么需要工作空间
随着项目规模增大，单个 crate 会变得臃肿难以维护。更常见的情况是：一个项目自然分成了几个部分——核心库 + CLI 工具 + 集成测试 + 辅助工具库。
如果把它们当作**独立项目** 来管理，麻烦就来了：
  * 每次修改核心库，都要先发布新版本，再更新工具的 `Cargo.toml`，非常繁琐
  * 各自有独立的 `target/` 目录，重复编译同样的依赖，浪费大量时间
  * 无法在一条命令里构建和测试所有部分


**工作空间（Workspace）** 就是解决这个问题的方案：把多个相关 crate 放在同一个目录下，用一个根 `Cargo.toml` 统一管理。
## 工作空间的文件结构
一个典型的工作空间长这样：
```
    my_project/            ← 工作空间根目录
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
            └── main.rs
```
根目录的 `Cargo.toml` 使用 `[workspace]` 段落声明这是一个工作空间，并通过 `members` 列出所有成员：
```
    # 根 Cargo.toml
    [workspace]
    members = [
        "my_lib",
        "my_cli",
    ]
    resolver = "2"
```
> **`resolver = "2"`** ：从 Rust 2021 edition 起，建议在工作空间中显式声明使用第 2 版依赖解析器，它在处理 features 时行为更一致、更符合直觉。
每个成员 crate 有自己的 `Cargo.toml`，跟普通项目一样：
```
    # my_lib/Cargo.toml
    [package]
    name = "my_lib"
    version = "0.1.0"
    edition = "2021"
```
```
    # my_cli/Cargo.toml
    [package]
    name = "my_cli"
    version = "0.1.0"
    edition = "2021"
    
    [dependencies]
    my_lib = { path = "../my_lib" }  # 引用同工作空间内的本地 crate
```
## 在工作空间中运行命令
在工作空间根目录下，可以用 `-p`（`--package`）指定针对哪个成员运行命令：
```
    # 编译所有成员
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
    cargo check --workspace
```
> **共享`target/`**：所有成员共用同一个 `target/` 编译目录。这意味着：如果 `my_lib` 和 `my_cli` 都依赖 `serde`，它只会被编译一次。大型项目里这能节省大量编译时间。
# 依赖管理
## 共享的 Cargo.lock
工作空间只有**一个** `Cargo.lock`，位于根目录。这意味着所有成员 crate 使用同一份依赖版本快照。
好处：
  * **版本一致** ：`my_lib` 和 `my_cli` 使用完全相同版本的 `serde`，不会出现”我这里是 1.0.180，你那里是 1.0.193”这种诡异问题
  * **确定性构建** ：整个工作空间的构建行为完全可复现


## 工作空间级别的共享依赖
如果多个成员都依赖同一个外部 crate，你每次都要在各自的 `Cargo.toml` 里写，还要保证版本号一致——容易出错。
从 Rust 1.64 起，可以在根 `Cargo.toml` 的 `[workspace.dependencies]` 里**统一声明依赖** ，各成员直接继承：
```
    # 根 Cargo.toml
    [workspace]
    members = ["my_lib", "my_cli"]
    resolver = "2"
    
    [workspace.dependencies]
    serde = { version = "1.0", features = ["derive"] }
    tokio = { version = "1", features = ["full"] }
    anyhow = "1.0"
```
> **Features 小知识** ：`features` 是依赖库的**可选功能模块** ，编译时由你选择启用哪些（如 serde 的 derive 宏），未启用的代码完全不参与编译，可以减小二进制体积。文章后面会专门讲解。
成员的 `Cargo.toml` 只需写 `workspace = true` 来继承：
```
    # my_lib/Cargo.toml
    [dependencies]
    serde = { workspace = true }      # 继承根的版本和 features
    anyhow = { workspace = true }
    
    # 可以在继承基础上追加额外 features
    tokio = { workspace = true, features = ["sync"] }
```
> **features 是累加的** ：继承 `workspace.dependencies` 时，你只能追加 features，不能删除根里已有的。这与 Cargo feature 的”累加”设计是一致的——features 只能开启，不能关闭。
## 虚拟工作空间
### 什么是虚拟工作空间
有两种工作空间结构：
**非虚拟（常见）** ：根目录本身是一个 crate
```
    my_project/           ← 根目录既是工作空间，也是一个 crate
    ├── Cargo.toml        （有 [package] + [workspace]）
    ├── src/
    └── member1/
        └── Cargo.toml
```
**虚拟（特殊）** ：根目录只是”容器”，本身不是 crate
```
    monorepo/             ← 根目录只是工作空间，不是 crate
    ├── Cargo.toml        （只有 [workspace]，没有 [package]）
    ├── lib_a/
    │   └── Cargo.toml
    ├── lib_b/
    │   └── Cargo.toml
    └── lib_c/
        └── Cargo.toml
```
### 为什么要用虚拟工作空间
  * **根没有代码** ：有些项目天然是”多个独立库的集合”，比如 Tokio 生态（tokio、tokio-util、tokio-native-tls 各是独立库）
  * **避免歧义** ：没有一个”主”库，所以 `cargo build` 默认不知道该构建谁，必须明确指定，更清晰
  * **平等性** ：所有成员地位相同，没有”这个是主，那个是附属”的混乱


### 行为差异
场景| 虚拟工作空间| 有 \[package\] 的工作空间  
---|---|---  
`cargo build`（无参）| 构建**所有** 成员| 只构建**根** package  
`cargo run`| 报错（没有根二进制）| 运行根的 main 函数  
`cargo test --workspace`| 测试所有成员| 测试所有成员  
**实际使用建议** ：
  * 如果你的项目有一个”主”库或应用（如 web 服务器），用**有 \[package\] 的工作空间**
  * 如果是平等的多个库组合（如工具链、中间件库族），用**虚拟工作空间**


# Features
## 什么是 Features 以及为什么需要它们
在工作空间讲解中，我们看到了这样的用法：
```
    [dependencies]
    tokio = { version = "1", features = ["full"] }
```
这里的 `features = ["full"]` 表示：“我要使用 tokio 这个库，并启用它的所有功能”。
**关键澄清** ：`"full"` 不是 Cargo 的内置关键字，而是 **tokio 库作者定义的一个特殊 feature 的名字** 。这个 feature 的作用就是启用 tokio 提供的所有可选功能。
如果用户不想要所有功能，可以只选择需要的：
```
    [dependencies]
    # 只启用 sync 和 time 功能（不启用其他）
    tokio = { version = "1", features = ["sync", "time"] }
```
**背景** ：很多库会提供多个可选功能。比如 tokio 库可以提供：
  * 异步运行时（rt）
  * 同步原语（sync）
  * 计时器（time）
  * I/O 工具（io-util）
  * 等等…


库的作者不想强迫所有用户都编译所有功能，因为：
  * 编译时间长
  * 二进制文件体积大
  * 可能有不需要的依赖被引入


所以库提供了 **features** 机制：用户可以选择”我需要哪些功能”。
## 两个视角理解 Features
features
### 视角 1：作为库的使用者（用户）
当你使用提供 features 的库时，比如 tokio，你可以：
```
    # 使用默认 features（tokio 默认是 rt）
    tokio = "1"
    
    # 启用特定 features（比如同步原语和计时器）
    tokio = { version = "1", features = ["sync", "time"] }
    
    # 启用所有 features
    tokio = { version = "1", features = ["full"] }
    
    # 关掉默认 features，只启用某些
    tokio = { version = "1", default-features = false, features = ["rt"] }
```
### 视角 2：作为库的设计者（库作者）
现在反过来，**如果你在设计 tokio 这样的库** ，怎么定义 features？
tokio 库就是这样做的，它提供多个可选功能模块。假设 tokio 的简化版本长这样：
```
    # Cargo.toml
    
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
    # （现实中 tokio 不完全这样做，这里为了讲解简化）
```
**逻辑关系** ：
  1. `[features]` 中，定义可用的 feature 及其组合关系
  2. `default` 定义默认启用哪些
  3. `"full"` 是一个特殊 feature，它启用其他所有 features


## 库设计者的三个步骤（以 tokio 为例）
### 步骤 1：声明可选依赖
```
    [dependencies]
    tokio-util = { version = "0.7", optional = true }
    tracing = { version = "0.1", optional = true }
```
`optional = true` 表示这个库**不是必需的** 。只有当用户启用了依赖这个库的 feature 时，这个库才会被下载和编译。如果没有任何 feature 需要它，这个库就根本不会出现在项目中。
### 步骤 2：在 Features 中关联
```
    [features]
    default = ["rt"]
    rt = []                           # 异步运行时，无外部依赖
    sync = []                         # 同步原语
    time = []                         # 计时器
    io-util = ["dep:tokio-util"]      # I/O 工具需要额外的库
    tracing-support = ["dep:tracing"] # 追踪支持需要额外的库
    full = ["rt", "sync", "time", "io-util", "tracing-support"]
```
`dep:库名` 表示”启用这个 feature 时，引入对应的库”。注意：是 `dep:` 前缀，不是直接写库名。这样明确区分”库的名字”和”feature 的名字”。
### 步骤 3：在代码中条件编译
```
    // 基础功能，总是存在
    pub fn version() {
        println!("tokio 1.0");
    }
    
    // 异步运行时：只在启用 rt feature 时编译
    #[cfg(feature = "rt")]
    pub fn spawn_task<F>(task: F)
    where
        F: Fn() + Send + 'static,
    {
        println!("在运行时中生成任务");
    }
    
    // 同步原语：只在启用 sync feature 时编译
    #[cfg(feature = "sync")]
    pub fn create_mutex<T>(value: T) {
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
    }
```
**关键** ：当用户启用 `tokio = { version = "1", features = ["sync", "time"] }` 时：
  * `rt`、`sync`、`time` 被启用，对应的函数**被编译进来**
  * `io-util` 没被启用，`use_codec` 函数**不会被编译**
  * `tokio-util` 库**不会被下载**
  * 二进制文件中**没有未使用功能的代码**


这就是 features 的”零成本”抽象。
## 库使用者的使用方式
当用户在 `Cargo.toml` 中选择启用某个 feature 时，如果那个 feature 需要可选依赖，Cargo 会自动拉下来：
```
    [dependencies]
    # 启用 io-util feature，tokio-util 库会自动被下载和编译
    tokio = { version = "1", features = ["io-util"] }
    
    # 启用多个 features，所有需要的库都会被拉下来
    tokio = { version = "1", features = ["sync", "io-util", "tracing-support"] }
```
这样做的好处：
  * 用户不需要手动管理 `tokio-util` 等可选依赖
  * Cargo 根据选择的 features，自动推导需要哪些库
  * 未选择的 feature 对应的库**完全不下载** ，节省空间


### 从命令行启用 Features
库作者设计好 features 后，用户也可以从命令行选择：
```
    # 启用指定 features
    cargo build --features "sync,io-util"
    
    # 启用所有 features（包括所有可选依赖）
    cargo build --all-features
    
    # 不启用默认 features，只选特定的
    cargo build --no-default-features --features "io-util"
```
# 练习题
## 工作空间概念测验
加载题目中…
加载题目中…
加载题目中…
加载题目中…
```
    # 根 Cargo.toml：
    [workspace.dependencies]
    serde = { version = "1.0", features = ["derive"] }
    
    # my_cli 的 Cargo.toml：
    [dependencies]
    serde = { workspace = true, features = ["rc"] }
```
加载题目中…
## Features 与工作空间
加载题目中…
加载题目中…
加载题目中…
加载题目中…
加载题目中…