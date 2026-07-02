# 高级类型

高级 ⏱ 35 分钟 类型别名newtypeNever类型动态大小类型DSTtype alias


# 类型别名与 newtype

## 类型别名：给长类型起个短名字

有些类型写起来非常冗长，比如 `Box<dyn Fn(i32, i32) -> Result<i32, String>>`。 每次都要完整写出这一串既费时又容易出错。**类型别名**（type alias）让你给现有类型起个简短的名字：

```rust
type MathOp = Box<dyn Fn(i32, i32) -> i32>;

fn make_adder() -> MathOp {
    Box::new(|a, b| a + b)
}

fn make_multiplier() -> MathOp {
    Box::new(|a, b| a * b)
}

fn main() {
    let add = make_adder();
    let mul = make_multiplier();
    println!("{}", add(3, 4)); // 7
    println!("{}", mul(3, 4)); // 12
}
```

语法很简单：`type 新名字 = 原类型;`

> **注意**：类型别名**不创建新类型**，只是名字替换。`MathOp` 和原来那一大串完全等价，编译器不会因为名字不同就阻止你混用它们。

## newtype 模式：创建真正有区别的类型

类型别名的"不创建新类型"有时候是问题。来看一个真实的反例：

1998 年，NASA 的火星气候轨道飞船坠毁。原因是一个软件团队用**英磅·秒**，另一个团队期望**牛顿·秒**，两者都是 `f64`，编译器完全不知道这是两种不同的量，放任了混用。

**newtype 模式**解决这个问题——用只有一个字段的元组结构体包装原类型，创建一个真正独立的新类型：

```rust
struct Meters(f64);      // 米
struct Kilograms(f64);   // 千克

fn report_weight(kg: Kilograms) {
    println!("重量：{:.1} 千克", kg.0);
}

fn main() {
    let distance = Meters(1000.0);
    let weight = Kilograms(75.0);

    report_weight(weight);     // ✅
    report_weight(distance);   // ❌ 编译错误！Meters 不是 Kilograms
}
```

`Meters` 和 `Kilograms` 内部都是 `f64`，但编译器把它们当成完全不同的类型，不允许互换传递。

**访问内部值**用 `.0`，或者模式解构：

```rust
struct Meters(f64);

fn main() {
    let d = Meters(1500.0);

    // 方式1：字段访问
    println!("距离：{:.1} 米", d.0);

    // 方式2：解构
    let Meters(value) = d;
    println!("距离：{:.1} 米", value);
}
```

## newtype 的另一个用途：绕过孤儿规则

Rust 有一条"孤儿规则"：你不能为**外部类型**实现**外部 trait**。

比如，你不能直接为标准库的 `Vec<i32>` 实现标准库的 `fmt::Display`——`Vec` 和 `Display` 都属于标准库，不属于你的代码。

但用 newtype 包装后，这个包装类型属于你，就可以自由实现任何 trait 了：

```rust
use std::fmt;

struct MyVec(Vec<i32>);

impl fmt::Display for MyVec {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[")?;
        for (i, val) in self.0.iter().enumerate() {
            if i > 0 { write!(f, ", ")?; }
            write!(f, "{}", val)?;
        }
        write!(f, "]")
    }
}

fn main() {
    let v = MyVec(vec![10, 20, 30, 40]);
    println!("{}", v); // [10, 20, 30, 40]
}
```

# Never 类型与动态大小类型

## Never 类型（`!`）：永不返回的函数

Rust 有一个特殊类型叫 **Never 类型**，写作 `!`，意思是"这个表达式**永远不会产生值**"。

哪些情况会有 `!` 类型？

情况

原因

`panic!("...")`

直接终止程序，没有返回

`loop { }`

无限循环，永远不会到达循环后面的代码

`std::process::exit(0)`

退出进程

`continue` / `break`（不带值）

跳出当前上下文，不产生值

声明一个返回 `!` 的函数：

```rust
fn fail(msg: &str) -> ! {
    panic!("严重错误：{}", msg);
}

fn main() {
    // if 的两个分支：一个返回 i32，一个调用返回 ! 的函数
    // ! 和任何类型都兼容，所以编译器接受这段代码
    let x: i32 = if true { 42 } else { fail("不该到这里") };
    println!("{}", x);
}
```

`!` 类型的最大用处：它和**任何类型都兼容**。

来看一个具体场景——`match` 的每个分支必须返回相同类型，但有了 `!`，`panic!` 的分支可以和任何类型的分支搭配：

```rust
fn positive_only(n: i32) -> u32 {
    match n >= 0 {
        true  => n as u32,
        false => panic!("需要非负数，得到了 {}", n),
        //        ^^^^^ 类型是 !，兼容上面的 u32
    }
}

fn main() {
    println!("{}", positive_only(5));  // 5
}
```

`break` 也是 `!` 类型，所以可以把 `loop` 当表达式用：

```rust
fn main() {
    let mut count = 0;

    let result = loop {
        count += 1;
        if count == 5 {
            break count * 2; // break 把值传出 loop，整个 loop 表达式的值是 10
        }
    };

    println!("结果：{}", result); // 结果：10
}
```

## 动态大小类型（DST）

讲完了永不产生值的 `!` 类型，再来看另一类特殊情况：有些类型的大小在编译时是未知的，只有运行时才能确定。

Rust 的大多数类型在编译时大小就已固定：`i32` 是 4 字节，`(u8, f64)` 是 16 字节。

但有些类型的大小只有在运行时才能确定，叫做**动态大小类型（Dynamically Sized Types，DST）**。最常见的两个：

-   `str`（注意：不是 `&str`）— 字符串数据本身，长度随内容而变
-   `dyn Trait`（注意：不是 `&dyn Trait`）— trait 对象，实际类型运行时才确定

**为什么不能直接用 `str`：**

```
"hi"           → 2 字节
"hello"        → 5 字节
"hello, world" → 12 字节
```

`str` 的大小取决于内容，编译时不知道，所以不能直接存在栈上：

```rust
fn print_message(msg: str) {  // ❌ 大小未知，不能直接用
    println!("{}", msg);
}
```

fn print\_message(msg: str) { // ❌ 大小未知，不能直接用 println!("{}", msg); } fn main() {}

解决方案：用**引用**或**智能指针**包装，它们的大小始终固定：

-   `&str` — 胖指针：数据指针（8字节）+ 长度（8字节）= 16 字节
-   `Box<str>` — 同样是胖指针，只是拥有所有权

```rust
fn print_message(msg: &str) {  // ✅ &str 大小固定（16字节）
    println!("{}", msg);
}

fn main() {
    print_message("hi");           // 2字节的 str，但 &str 始终是 16字节
    print_message("hello, world"); // 12字节的 str，但 &str 始终是 16字节
}
```

**核心规律**：DST 需要通过"胖指针"使用。胖指针 = 普通指针 + 额外元数据（长度或 vtable），大小固定，Rust 可以把它放在栈上。

# 练习题

## 类型别名与 newtype 测验

加载题目中…

```
struct Celsius(f64);
struct Fahrenheit(f64);

fn to_fahrenheit(c: Celsius) -> Fahrenheit {
    Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
}
```

加载题目中…

加载题目中…

加载题目中…

加载题目中…

## 编程练习

用 newtype 模式实现温度类型，防止摄氏度和华氏度混淆：

```rust
use std::fmt;

struct Celsius(f64);
struct Fahrenheit(f64);

// TODO: 为 Celsius 实现 Display，格式为 "100.0°C"
// TODO: 为 Fahrenheit 实现 Display，格式为 "212.0°F"

// TODO: 实现转换函数（转换公式：°F = °C × 9/5 + 32）
// fn celsius_to_fahrenheit(c: Celsius) -> Fahrenheit { ... }

fn main() {
    let boiling = Celsius(100.0);
    // let f = celsius_to_fahrenheit(boiling);
    // println!("{}", Celsius(100.0)); // 100.0°C
    // println!("{}", f);              // 212.0°F
}
```
