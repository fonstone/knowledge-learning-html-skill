# dyn Trait：动态分发

高级 ⏱ 35 分钟 dyn Trait动态分发trait objectfat pointer类型擦除对象安全

# 为什么需要 dyn Trait

## 泛型搞不定的两个场景

泛型和 `impl Trait` 是"编译期多态"——编译器在编译时就把每种具体类型展开成独立代码，运行时完全不需要判断类型。这很高效，但有两种情况它做不到。

### 场景一：Vec 里装不同的类型

假设你在写一个 UI 框架，页面上有按钮、文本框、复选框……你想把它们全放进一个 `Vec`，然后循环调用每个组件的 `draw()` 方法：

```rust
trait Widget {
    fn draw(&self);
}

struct Button { label: String }
struct TextBox { text: String }

impl Widget for Button {
    fn draw(&self) { println!("画按钮：{}", self.label); }
}
impl Widget for TextBox {
    fn draw(&self) { println!("画文本框：{}", self.text); }
}

fn main() {
    // 试图把不同类型放进同一个 Vec——编译失败
    let widgets: Vec<Button> = vec![
        Button { label: String::from("确定") },
        TextBox { text: String::from("请输入...") }, // 错误！类型不匹配
    ];
}
```

`Vec<T>` 的 `T` 在编译期只能是一种具体类型，没有办法装"实现了 Widget 的任意类型"。

### 场景二：根据条件返回不同类型

```rust
fn create_widget(is_button: bool) -> impl Widget {
    if is_button {
        Button { label: String::from("确定") }
    } else {
        TextBox { text: String::from("请输入...") } // 错误！两个分支返回类型不同
    }
}
```

trait Widget { fn draw(&self); } struct Button { label: String } struct TextBox { text: String } impl Widget for Button { fn draw(&self) {} } impl Widget for TextBox { fn draw(&self) {} } fn create\_widget(is\_button: bool) \-> impl Widget { if is\_button { Button { label: String::from("确定") } } else { TextBox { text: String::from("请输入...") } // 错误！两个分支返回类型不同 } } fn main() {}

`impl Widget` 虽然隐藏了具体类型名，但编译器在编译期就要确定它到底是哪一种——两个分支返回不同类型，没办法确定，编译失败。

## 用 dyn Trait 解决

`dyn Trait` 的核心思路：**不在编译期确定具体类型，而是在运行时通过指针查找方法**。

```rust
trait Widget {
    fn draw(&self);
    fn area(&self) -> f64;
}

struct Button { label: String, width: f64, height: f64 }
struct TextBox { text: String, cols: f64, rows: f64 }
struct Checkbox { checked: bool, size: f64 }

impl Widget for Button {
    fn draw(&self) { println!("[按钮] {}", self.label); }
    fn area(&self) -> f64 { self.width * self.height }
}
impl Widget for TextBox {
    fn draw(&self) { println!("[文本框] {}", self.text); }
    fn area(&self) -> f64 { self.cols * self.rows }
}
impl Widget for Checkbox {
    fn draw(&self) { println!("[复选框] {}", if self.checked { "✓" } else { "□" }); }
    fn area(&self) -> f64 { self.size * self.size }
}

fn build_ui() -> Vec<Box<dyn Widget>> {
    vec![
        Box::new(Button { label: String::from("确定"), width: 80.0, height: 30.0 }),
        Box::new(TextBox { text: String::from("请输入..."), cols: 200.0, rows: 24.0 }),
        Box::new(Checkbox { checked: true, size: 16.0 }),
        Box::new(Button { label: String::from("取消"), width: 80.0, height: 30.0 }),
    ]
}

fn main() {
    let ui = build_ui();

    println!("--- 渲染所有组件 ---");
    for widget in &ui {
        widget.draw();
    }

    let total_area: f64 = ui.iter().map(|w| w.area()).sum();
    println!("总面积: {}", total_area);
}
```

`Box<dyn Widget>` 让不同类型能放进同一个 `Vec`，`build_ui` 也能根据需要自由选择返回哪种组件。

## 类型擦除：dyn 的本质约束

使用 `dyn Widget` 时，只能调用 `Widget` 中定义的方法——具体类型信息"消失"了，这叫**类型擦除**（type erasure）：

```rust
impl Button {
    fn click(&self) { println!("按钮被点击了！"); } // Button 独有的方法
}

fn main() {
    let w: Box<dyn Widget> = Box::new(Button {
        label: String::from("确定"), width: 80.0, height: 30.0
    });

    w.draw();   // ✅ Widget 定义了 draw，可以调用
    w.area();   // ✅ Widget 定义了 area，可以调用
    w.click();  // ❌ click 不在 Widget 里，类型已擦除，访问不到
}
```

trait Widget { fn draw(&self); fn area(&self) \-> f64; } struct Button { label: String, width: f64, height: f64 } impl Widget for Button { fn draw(&self) { println!("\[按钮\] {}", self.label); } fn area(&self) \-> f64 { self.width \* self.height } } impl Button { fn click(&self) { println!("按钮被点击了！"); } } fn main() { let w: Box<dyn Widget\> \= Box::new(Button { label: String::from("确定"), width: 80.0, height: 30.0 }); w.draw(); w.area(); w.click(); // ❌ }

所以 **trait 在动态分发里扮演的角色正是接口合约**：你在 trait 里定义的方法，就是调用方通过 `dyn` 能看到和使用的全部。trait 设计得越精准，`dyn Trait` 就越好用。

# 原理与限制

了解了 `dyn Trait` 能做什么、以及类型擦除的限制，来看看它在内存里的实现——这有助于理解为什么有运行时开销，也解释了对象安全规则背后的原因。

## fat pointer：内存中的样子

`dyn Trait` 在内存中是一个 **fat pointer（胖指针）**，由两个指针组成：

```
Box<dyn Widget>
┌───────────────┐
│  data ptr  ───┼──→  Button { ... }   ← 堆上的实际数据
│  vtable ptr ──┼──→  { draw, area, … } ← 方法地址表
└───────────────┘
```

调用 `widget.draw()` 时，Rust 先通过 vtable 找到 `Button::draw` 的地址，再跳转执行——这就是"运行时开销"的来源。

## Box<dyn Trait> 与 &dyn Trait

`dyn Trait` 自身没有已知大小，必须放在指针后面使用。常见的两种形式：

```rust
trait Greet {
    fn hello(&self) -> String;
}

struct English;
struct Chinese;

impl Greet for English {
    fn hello(&self) -> String { String::from("Hello!") }
}
impl Greet for Chinese {
    fn hello(&self) -> String { String::from("你好！") }
}

// &dyn Trait：借用，不分配堆内存
fn greet_once(g: &dyn Greet) {
    println!("{}", g.hello());
}

// Box<dyn Trait>：拥有所有权，数据在堆上
fn make_greeter(lang: &str) -> Box<dyn Greet> {
    match lang {
        "en" => Box::new(English),
        _    => Box::new(Chinese),
    }
}

fn main() {
    let e = English;
    greet_once(&e);                    // &dyn：引用栈上的值

    let g = make_greeter("zh");
    greet_once(g.as_ref());            // Box<dyn>：引用堆上的值
}
```

形式

所有权

数据位置

典型用途

`&dyn Trait`

借用

调用者决定

函数参数，只需临时访问

`Box<dyn Trait>`

拥有

堆

返回值、集合元素、长期持有

前面的例子都能正常工作，但不是所有 trait 都能用于 `dyn`——有一条叫**对象安全**的限制需要了解。

## 对象安全

不是所有 trait 都能用作 `dyn Trait`——只有满足**对象安全**（object-safe）条件的才行：

-   方法不能返回 `Self`（运行时无法知道 `Self` 的具体大小）
-   方法不能有泛型类型参数（每种 `T` 对应不同代码，无法放进统一的 vtable）

最常见的不满足情况是 `Clone`——`clone()` 返回 `Self`，所以 `dyn Clone` 不合法：

```rust
// Clone 的定义：fn clone(&self) -> Self  ← 返回 Self，不对象安全
fn clone_it(x: &dyn Clone) {
    todo!()
}
```

// Clone 的定义：fn clone(&self) -> Self ← 返回 Self，不对象安全 fn clone\_it(x: &dyn Clone) { todo!() } fn main() {}

## 静态分发 vs 动态分发

泛型 / `impl Trait`

`dyn Trait`

类型确定时机

编译期

运行时

运行时开销

无（单态化）

有（vtable 查找）

二进制大小

每种类型一份代码，偏大

共享一份代码，偏小

存入异构集合

不能

能

条件返回不同类型

不能

能

对象安全限制

无

有

**经验法则**：默认用泛型（零开销）；需要运行时多态（异构集合、插件系统、条件分支返回不同类型）时才用 `dyn Trait`。

# 练习题

## dyn Trait 测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

下面的 `Logger` 系统需要支持多种日志后端（控制台、文件、内存缓冲区），运行时可以动态选择。请实现 `Logger` trait 和三种后端，让 `main` 正确运行：

```rust
trait Logger {
    fn log(&self, message: &str);
    fn name(&self) -> &str;
}

struct ConsoleLogger;
struct FileLogger { filename: String }
struct BufferLogger { prefix: String }

// TODO: 为三种 Logger 实现 Logger trait
// ConsoleLogger: name 返回 "console"，log 打印 "[console] {message}"
// FileLogger: name 返回文件名，log 打印 "[file:{filename}] {message}"
// BufferLogger: name 返回 "buffer"，log 打印 "[buffer:{prefix}] {message}"

fn log_all(loggers: &[Box<dyn Logger>], message: &str) {
    for logger in loggers {
        logger.log(message);
    }
}

fn make_logger(kind: &str) -> Box<dyn Logger> {
    match kind {
        "file"   => Box::new(FileLogger { filename: String::from("app.log") }),
        "buffer" => Box::new(BufferLogger { prefix: String::from("DEBUG") }),
        _        => Box::new(ConsoleLogger),
    }
}

fn main() {
    let loggers: Vec<Box<dyn Logger>> = vec![
        make_logger("console"),
        make_logger("file"),
        make_logger("buffer"),
    ];

    log_all(&loggers, "系统启动");
    println!("共 {} 个日志后端", loggers.len());
}
```
