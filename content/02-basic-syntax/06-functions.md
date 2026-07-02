# 函数

入门 ⏱ 20 分钟 fn函数参数返回值语句表达式snake\_case


# 函数基础

函数是组织代码的基本单位。本文介绍 Rust 函数的定义方式、参数规则，以及一个新手最容易踩的坑——语句与表达式的区别。

Rust 中函数无处不在，你已经认识了最重要的一个：`main`。

## 定义与调用

用 `fn` 关键字定义函数，后跟函数名和一对圆括号，再用花括号包裹函数体：

```rust
fn main() {
    println!("Hello, world!");
    another_function(); // 调用另一个函数
}

fn another_function() {
    println!("这是另一个函数。");
}
```

**Rust 不关心函数定义的顺序**——`another_function` 定义在 `main` 之后完全没问题。只要在同一个作用域内定义过，就可以调用。

Rust 函数名使用 **snake\_case**（蛇形命名法）：全部小写，单词之间用下划线连接。例如 `another_function`、`calculate_area`，而不是 `AnotherFunction` 或 `calculateArea`。

## 参数

函数可以声明参数，让调用者传入数据：

```rust
fn main() {
    greet("Alice"); // 传入字符串字面量
}

fn greet(name: &str) {
    println!("你好，{}！", name);
}
```

**Rust 要求在函数签名中显式声明每个参数的类型**。这是一个有意为之的设计：只需看函数签名，不用查阅其他代码就能知道参数类型（否者一个变量声明后，经过多层函数传递，难以快速查阅其类型），编译器也不必在函数体外猜测类型。

如果省略类型标注，编译器会报错：

```rust
fn add(x, y) -> i32 { // 错误：缺少参数类型
    x + y
}

fn main() {
    println!("{}", add(1, 2));
}
```

## 多个参数

多个参数用逗号分隔，每个参数都必须单独标注类型：

```rust
fn main() {
    print_measurement(5, 'h');
}

fn print_measurement(value: i32, unit: char) {
    println!("测量值：{}{}", value, unit);
}
```

注意 `value: i32, unit: char` 不能省写成 `value, unit: i32, char`——每个参数都要写完整的 `名称: 类型` 对。

# 语句与返回值

Rust 是一门**基于表达式**的语言。理解语句和表达式的区别，是写好 Rust 函数的关键。

## 语句与表达式的区别

-   **语句**（statement）：执行操作，**不返回值**。
-   **表达式**（expression）：计算并**产生一个值**。

`let` 绑定是语句，`5 + 6` 是表达式。因此，你无法把 `let` 赋值的结果再赋给别的变量——它根本没有返回值：

```rust
fn main() {
    let x = (let y = 6); // 错误：let 是语句，没有返回值
    println!("{}", x);
}
```

这和 C 或 Ruby 不同。在那些语言里 `x = y = 6` 是合法的，因为赋值语句会返回被赋的值。Rust 选择了更严格的设计：赋值就是赋值，不能当表达式使用。

## 代码块是表达式

花括号 `{}` 包裹的代码块本身也是一个表达式，**整个块的值是最后一行表达式的值**：

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1  // 注意：没有分号，这是表达式
    };

    println!("y 的值是：{}", y); // 打印 4
}
```

关键在 `x + 1` 这一行——**没有分号**。一旦加上分号，它就从表达式变成了语句，整个块的值变成空的 `()`。

## 返回值

函数的返回值用 `->` 声明类型，**返回值就是函数体最后一个表达式的值**：

```rust
fn five() -> i32 {
    5  // 没有分号，这是返回值
}

fn main() {
    let x = five();
    println!("x 的值是：{}", x); // 打印 5
}
```

`five` 函数体只有一个裸数字 `5`，没有 `return`，没有分号——这完全合法。函数体的最后一个表达式就是返回值。

可以用 `return` 提前返回，这在需要提前退出时很有用：

```rust
fn absolute_value(n: i32) -> i32 {
    if n < 0 {
        return -n; // 提前返回
    }
    n // 正常路径：最后一个表达式
}

fn main() {
    println!("{}", absolute_value(-7)); // 7
    println!("{}", absolute_value(3));  // 3
}
```

## 分号陷阱

这是 Rust 新手最常遇到的错误：在返回值表达式末尾多加了分号。

```rust
fn plus_one(x: i32) -> i32 {
    x + 1; // 错误：加了分号，变成语句，没有返回值，隐式返回 ()，与声明的 i32 不符
}

fn main() {
    println!("{}", plus_one(5));
}
```

编译器会报 `mismatched types`，并贴心地提示"consider removing this semicolon"。记住规则：**函数体最后一行如果是返回值，不加分号**。

正确写法：

```rust
fn plus_one(x: i32) -> i32 {
    x + 1 // 没有分号
}

fn main() {
    println!("{}", plus_one(5)); // 打印 6
}
```

# 练习题

## 函数基础测验

加载题目中…

加载题目中…

加载题目中…

## 语句与返回值测验

```
fn main() {
    let y = {
        let x = 10;
        x * 2
    };
    println!("{}", y);
}
```

加载题目中…

```
fn double(x: i32) -> i32 {
    x * 2;
}
```

加载题目中…

加载题目中…

## 编程练习

### 练习一：实现 add 函数

补全下面的函数，使其返回两个整数之和。注意不要在返回值表达式末尾加分号。

```rust
fn add(a: i32, b: i32) -> i32 {
    // TODO：返回 a + b
}

fn main() {
    println!("{}", add(3, 4));   // 应输出 7
    println!("{}", add(-1, 5));  // 应输出 4
}
```

### 练习二：温度转换

实现一个摄氏度转华氏度的函数。转换公式：`华氏度 = 摄氏度 × 9 / 5 + 32`。

```rust
fn celsius_to_fahrenheit(c: f64) -> f64 {
    // TODO：实现转换公式
}

fn main() {
    println!("{}°C = {:.1}°F", 0.0, celsius_to_fahrenheit(0.0));    // 0°C = 32.0°F
    println!("{}°C = {:.1}°F", 100.0, celsius_to_fahrenheit(100.0)); // 100°C = 212.0°F
    println!("{}°C = {:.1}°F", 37.0, celsius_to_fahrenheit(37.0));   // 37°C = 98.6°F
}
```
