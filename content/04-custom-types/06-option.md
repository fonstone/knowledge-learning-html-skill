# Option<T> 枚举

入门 ⏱ 20 分钟 OptionSomeNonenull可选值


# 为什么 Rust 没有 null

很多编程语言（Java、C、JavaScript）都有 `null` 值，表示"没有值"。这听起来合理，但 Tony Hoare（`null` 的发明者）后来称之为 **"十亿美元的错误"**，因为 `null` 导致的 bug 无穷无尽：

-   忘记检查 `null`，程序崩溃（"Null Pointer Exception"）
-   在不该是 `null` 的地方突然变成 `null`
-   很难区分"正常的空值"和"未初始化"

Rust 的解决方案是：**没有 `null`，用 `Option<T>` 枚举代替**。

这强制你在编译期就必须处理"可能没有值"的情况。

# Option<T> 的定义

`Option<T>` 是标准库中的一个枚举：

```
enum Option<T> {
    Some(T),
    None,
}
```

它很简单：

-   `Some(T)` — 表示有值
-   `None` — 表示没有值

`<T>` 是一个**泛型参数**（后续会详细讲），现在只需知道它表示"任何类型"。

## 使用 Option

`Option<T>` 在 **prelude** 中，无需导入前缀就能用 `Some` 和 `None`：

> **什么是 prelude？** Rust 标准库中有一个 prelude（前奏）模块，包含最常用的类型和函数。每个 Rust 程序都会自动导入 prelude 中的内容，所以你可以直接使用 `Some`、`None`、`Option` 等，而不需要写完整的路径如 `std::option::Some`。

```rust
fn main() {
    let some_number: Option<i32> = Some(5);
    let none_number: Option<i32> = None;

    println!("{:?}", some_number);
    println!("{:?}", none_number);
}
```

当有 `None` 时，必须指定类型，因为编译器无法推断。

## 为什么这比 null 安全

假如 Rust 有 `null`：

```
let x: i32 = null;     // x 可能是 null
println!("{}", x + 1); // 崩溃！
```

用 `Option<T>`：

```rust
let x: Option<i32> = None;
println!("{}", x + 1);  // 编译错误！Option<i32> 不能直接和 i32 相加
```

你**必须** 先处理 `Option` 的两种情况。

# 提取 Option 中的值

## 方法一：match 表达式（最常见）

用 `match` 分别处理 `Some` 和 `None`：

```rust
fn main() {
    let maybe_age: Option<u32> = Some(25);

    match maybe_age {
        Some(age) => println!("年龄是 {}", age),
        None => println!("年龄未知"),
    }
}
```

`Some(age)` 会绑定内部的值，可以在分支中使用。

## 方法二：if let 表达式（只关心 Some 的情况）

如果只想处理 `Some` 的情况，`if let` 更简洁：

```rust
fn main() {
    let favorite_color: Option<&str> = Some("蓝色");

    if let Some(color) = favorite_color {
        println!("你最喜欢的颜色是 {}", color);
    }
}
```

（`if let` 会在后续详细讲）

## 方法三：Option 的方法

`Option<T>` 提供了许多方便的方法（这里先了解，后续会深入）：

```rust
fn main() {
    let x = Some(5);

    // unwrap()：如果是 Some，返回内部值；如果是 None，panic
    let value = x.unwrap();
    println!("值是 {}", value);

    // unwrap_or()：如果是 Some，返回内部值；如果是 None，返回默认值
    let y: Option<i32> = None;
    let value = y.unwrap_or(0);
    println!("值是 {}", value);

    // is_some()、is_none()：检查是 Some 还是 None
    let z = Some(10);
    if z.is_some() {
        println!("z 有值");
    }
}
```

> **警告**：`unwrap()` 如果碰到 `None` 会 panic。在不确定的情况下，用 `match` 或 `if let` 更安全。

# 练习题

```
fn get_age(name: &str) -> Option<u32> {
    match name {
        "Alice" => Some(30),
        "Bob" => Some(25),
        _ => None,
    }
}
```

加载题目中…

```
let x: Option<i32> = Some(5);
let y = x.unwrap();
```

加载题目中…

加载题目中…

## 编程练习

### 练习 1：返回 Option 的函数

实现一个函数 `first_word_length()`，返回字符串中第一个单词的长度。如果字符串为空或只有空白，返回 None：

```rust
fn first_word_length(s: &str) -> Option<usize> {
    // TODO: 实现函数
    // 提示：trim() 可以去掉空白，split_whitespace() 可以按空白分割
}

fn main() {
    println!("{:?}", first_word_length("hello world"));      // Some(5)
    println!("{:?}", first_word_length("  "));               // None
    println!("{:?}", first_word_length(""));                 // None
    println!("{:?}", first_word_length("single"));           // Some(6)
}
```

### 练习 2：安全地处理 Option

实现一个函数 `divide()`，返回除法结果的 Option。只有当除数不为 0 时才返回 Some，否则返回 None：

```rust
fn divide(dividend: f64, divisor: f64) -> Option<f64> {
    // TODO: 实现函数
}

fn main() {
    match divide(10.0, 2.0) {
        Some(result) => println!("10 ÷ 2 = {}", result),
        None => println!("无法除以 0"),
    }

    match divide(10.0, 0.0) {
        Some(result) => println!("10 ÷ 0 = {}", result),
        None => println!("无法除以 0"),
    }
}
```
