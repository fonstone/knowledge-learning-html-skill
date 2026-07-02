# 声明宏

进阶 ⏱ 50 分钟 macro_rules!声明宏元变量重复模式宏卫生性macro_export元编程


# 宏的基础

## 什么是宏

你已经频繁使用过`println!`宏了。是时候看清楚它背后的机制，并学会编写自己的宏了。

**宏**（Macro）是一种"为写代码而写代码"的机制，称为**元编程**（metaprogramming）。宏在**编译时展开**——编译器遇到宏调用时，先把它展开成普通代码，再编译生成的代码。

宏调用有一个显眼的标志：名称后跟感叹号 `!`。

```rust
fn main() {
    println!("这是宏调用");          // println! 展开为格式化打印代码
    let v = vec![10, 20, 30];        // vec! 展开为创建 Vec 的代码
    let s = format!("结果：{}", 42); // format! 展开为构建 String 的代码
    println!("{:?}  {}", v, s);
}
```

> **本文范围说明**：Rust 的宏分为两大类——**声明宏**（`macro_rules!`）和**过程宏**。本文只讲解声明宏。过程宏涉及 `TokenStream`、`syn`、`quote` 等进阶概念，难度较高，已单独成章，详见[过程宏](/RustCourse/chapters/21-proc-macros/00-index)。

## 宏与函数的核心区别

宏能做到函数做不到的三件事：

**一、接受可变数量的参数。** 函数签名必须写明参数个数，宏不需要：

```rust
fn main() {
    println!("一个参数");
    println!("两个：{}", 99);
    println!("四个：{} {} {}", "a", "b", "c");
    // 普通函数无法做到参数个数可变
}
```

**二、可以在编译时生成代码（例如 trait 实现）。** 像 `#[derive(Debug)]` 这类宏，能在**编译期**为你自动"写"出实现 `Debug` trait 的完整 Rust 源代码，并交给编译器一起翻译成机器码。

**三、必须在调用前定义或引入。** 这与函数不同——函数可以在文件任意位置定义，宏的作用域是**顺序**的：

```rust
fn main() {
    greet!(); // 错误：此处宏尚未定义
}

macro_rules! greet {
    () => { println!("你好！"); };
}
```

## 第一个声明宏

`macro_rules!` 让你编写基于**模式匹配**的宏。语法结构：

```
macro_rules! 宏名 {
    (模式1) => { 展开代码1 };
    (模式2) => { 展开代码2 };
}
```

调用宏时，编译器依次用输入去匹配各规则，使用**第一个匹配成功**的规则展开：

```rust
macro_rules! say {
    () => {
        println!("你好，世界！");
    };
    ($msg:expr) => {
        println!("消息：{}", $msg);
    };
    ($a:expr, $b:expr) => {
        println!("{} + {} = {}", $a, $b, $a + $b);
    };
}

fn main() {
    say!();
    say!("Rust");
    say!(10, 20);
}
```

## 元变量与片段类型

模式中用 `$名称:片段类型` 捕获传入的代码片段，称为**元变量**（metavariable）。片段类型决定能匹配哪种代码：

片段类型 | 匹配内容 | 示例 | 说明
--- | --- | --- | ---
`expr` | 任意表达式 | `1+2`, `"hello"`, `foo()` | 能计算出值的代码，最常用
`ty` | 任意类型 | `i32`, `String`, `Vec<u8>` | 类型标注中使用
`ident` | 标识符 | `x`, `my_fn`, `Point` | 变量名、函数名、类型名等
`literal` | 字面量 | `42`, `"text"`, `true` | 具体的值，不是变量
`pat` | 模式 | `Some(x)`, `(a, b)`, `_` | match/if let 分支的模式
`stmt` | 单条语句 | `let x = 1;`, `foo();` | 以分号结尾的单行代码
`block` | 代码块 | `{ let x = 1; x + 1 }` | 花括号包裹的多行代码
`tt` | Token 树 | 任何东西 | 最宽泛的类型，作为"兜底方案"

**实际应用**：

```rust
macro_rules! create_fn {
    ($name:ident, $ret:ty, $body:block) => {
        fn $name() -> $ret $body
    };
}

create_fn!(add_one, i32, { 41 + 1 });
create_fn!(greeting, String, { "你好！".to_string() });

fn main() {
    println!("{}", add_one());
    println!("{}", greeting());
}
```

### tt 的特殊地位

`tt`（token tree）是最宽泛的片段类型。**重要**：`tt` 能匹配**单个 token 或完整的括号对**，但不能匹配像 `3 + 5` 这样跨越多个不括号的 token。

```rust
macro_rules! my_debug {
    ($x:tt) => {
        println!("{:?}", $x);
    };
}

fn main() {
    let x = 5;
    my_debug!(42);
    my_debug!(true);
    my_debug!(x);
    my_debug!((3 + 5));
}
```

**tt 的实际用途**：在需要原样转发给其他宏时（通常配合重复模式 `$(...)*`，后面会讲）：

```rust
macro_rules! passthrough {
    ($($t:tt)*) => {
        println!($($t)*)
    };
}

fn main() {
    passthrough!("格式化：{} + {} = {}", 1, 2, 3);
}
```

## 重复模式

重复模式让一条规则能匹配不定数量的输入，是声明宏最强大的特性之一。

语法：`$( 捕获内容 ) 分隔符? 量词`

量词 | 含义
--- | ---
`*` | 零次或多次
`+` | 一次或多次
`?` | 零次或一次（不能有分隔符）

### 逗号分隔的列表

标准库的 `vec!` 宏就是用重复模式实现的，下面是简化版：

```rust
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $(
                v.push($x);
            )*
            v
        }
    };
    ( $( $x:expr ),+ , ) => {
        my_vec![$($x),*]
    };
}

fn main() {
    let a = my_vec![1, 2, 3];
    let b = my_vec!["x", "y", "z", "w"];
    let c: Vec<i32> = my_vec![];
    println!("{:?}", a);
    println!("{:?}", b);
    println!("{:?}", c);
}
```

### 加号量词（至少一次）

用 `+` 表示至少一次重复。

```rust
macro_rules! print_all {
    ( $( $x:expr ),+ ) => {
        $(
            print!("{} ", $x);
        )*
        println!();
    };
}

fn main() {
    print_all!(1);
    print_all!(10, 20, 30);
    print_all!("a", "b", "c", "d");
}
```

### 问号量词（零或一次）

用 `?` 表示可选的（零次或一次）。**注意：`?` 不能有分隔符**。

```rust
macro_rules! config {
    ($name:ident $( = $val:expr )?) => {
        {
            let v: usize = 0 $( + $val )?;
            println!("配置 {}: {}", stringify!($name), v);
            v
        }
    };
}

fn main() {
    config!(max_size);
    config!(buffer_size = 64);
}
```

# 进阶与作用域

## 宏的卫生性

Rust 的声明宏是**卫生的**（hygienic）。这意味着：

1.  **宏内部定义的变量不会污染外层作用域**
2.  **调用者的变量也不会污染宏内部** — 但通过参数传入的变量除外

简单理解：**宏内部是隔离的**，宏内新定义的名字不会逃逸出去。

```rust
macro_rules! swap {
    ($a:expr, $b:expr) => {
        let tmp = $a;
        $a = $b;
        $b = tmp;
    };
}

fn main() {
    let tmp = "这是用户的 tmp".to_string();
    let mut x = 10;
    let mut y = 20;
    swap!(x, y);

    println!("x={}, y={}", x, y);
    println!("用户的 tmp 没被覆盖：{}", tmp);
}
```

**关键点**：元变量 `$a`、`$b` 传入的是**表达式本身**（`x` 和 `y`），它们属于**调用者的作用域**，所以修改 `$a` 等于直接修改 `x`。

> **注意**：卫生性只对 `ident` 片段和宏内新声明的绑定有效。若用 `$name:ident` 直接拼接出新的标识符（`concat_idents` 这类场景），需要格外小心。

## 模块内作用域

宏默认只在定义它的**模块及其子模块**内可见，且遵循**顺序规则**（必须先定义后使用）：

```rust
mod math {
    macro_rules! square {
        ($x:expr) => { $x * $x };
    }

    pub fn demo() {
        println!("3² = {}", square!(3));
    }
}

fn main() {
    math::demo();
}
```

## 跨模块与导出

在子模块上加 `#[macro_use]`，可以把该模块的宏提升到父模块。使用 `#[macro_export]` 可以让宏被**其他 crate** 引入：

```rust
#[macro_use]
mod helpers {
    macro_rules! double {
        ($x:expr) => { $x * 2 };
    }
}

fn main() {
    println!("{}", double!(7));
}
```

在库的开发中，可以在宏上面添加 `#[macro_export]`：

```rust
#[macro_export]
macro_rules! assert_approx_eq {
    ($a:expr, $b:expr, $eps:expr) => {
        let diff = ($a - $b).abs();
        if diff > $eps {
            panic!("断言失败：|{} - {}| = {} > {}", $a, $b, diff, $eps);
        }
    };
}

fn main() {
    assert_approx_eq!(1.0_f64, 1.0000001, 0.001);
    println!("近似相等断言通过");
}
```

# 常用宏与调试

## 实用标准库宏预览

```rust
fn main() {
    let x = 5;
    let y = dbg!(x * 2 + 1);
    println!("y = {}", y);

    const GREET: &str = concat!("Hello", ", ", "world", "!");
    println!("{}", GREET);

    let expr = stringify!(1 + 2 * 3);
    println!("表达式原文：{}", expr);

    let version = env!("CARGO_PKG_VERSION");
    println!("版本：{}", version);
}
```

```rust
fn not_done_yet() {
    todo!("等以后再实现");
}

fn impossible_path(x: u8) -> &'static str {
    match x {
        0 => "零",
        1..=255 => "非零",
        _ => unreachable!("u8 不可能超过 255"),
    }
}

fn main() {
    println!("{}", impossible_path(42));
}
```

## 调试宏展开

安装工具：

```
cargo install cargo-expand
```

常见用法：

```
cargo expand
cargo expand my_module
cargo expand my_module::my_macro
```

# 练习题

## 基础测验

加载题目中…

## 编程练习

### 练习一：定义 `print_twice!` 宏

定义一个 `print_twice!` 宏，接受一个表达式，将该值打印两次（每次单独一行）。

```rust
// 在这里定义 print_twice! 宏

fn main() {
    print_twice!(42);
    print_twice!("Hello");
}
```

### 练习二：实现 `max!` 宏

实现一个 `max!` 宏，接受**两个**表达式，返回较大的值。

```rust
macro_rules! max {
    // TODO：填写规则
}

fn main() {
    println!("{}", max!(3, 7));
    println!("{}", max!(10, 2));
    println!("{}", max!(-1, -5));
}
```

### 练习三：实现 `repeat_str!` 宏

```rust
macro_rules! repeat_str {
    // TODO：实现宏
}

fn main() {
    let greeting = repeat_str!("Hello");
    println!("{}", greeting);

    let message = repeat_str!("Hello", " ", "world", "!");
    println!("{}", message);

    let words = repeat_str!("Rust", " ", "is", " ", "awesome");
    println!("{}", words);
}
```
