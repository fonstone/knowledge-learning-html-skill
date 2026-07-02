# 格式化输出进阶

高级 ⏱ 30 分钟 DisplayDebug格式化fmtwrite!精度对齐填充


# Display 与 Debug

## 两种"打印"方式的本质区别

你用过 `println!("{}", x)` 和 `println!("{:?}", x)`，但可能没想过它们背后的差异：

格式

对应 trait

设计意图

`{}`

`Display`

**面向用户**：给人看的可读输出

`{:?}`

`Debug`

**面向开发者**：调试用的详细输出

`{:#?}`

`Debug`（美化）

带缩进的 Debug 输出

类比：

-   `Display` 是你对外展示的名片——简洁、美观
-   `Debug` 是程序员查 bug 时看的日志——完整、精确

```rust
#[derive(Debug)]  // 自动生成 Debug 实现
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 3.14, y: -2.71 };

    println!("{:?}", p);   // Debug：Point { x: 3.14, y: -2.71 }
    println!("{:#?}", p);  // 美化 Debug，带缩进
}
```

## 为什么标准库类型不能直接 `{}`

`#[derive(Debug)]` 是编译器自动给你生成 `Debug` 实现，但没有对应的 `#[derive(Display)]`——`Display` **必须手动实现**，因为"如何给用户展示"是业务决策，编译器不知道你想怎么显示。

比如 `Point { x: 3.14, y: -2.71 }` 对用户来说可能要显示成：

-   `(3.14, -2.71)`
-   `3.14, -2.71`
-   `x=3.14, y=-2.71`

全看你的需求，所以必须你来定义。

## 实现 Display

实现 `Display` 需要引入 `std::fmt`，并实现 `fmt` 方法：

```rust
use std::fmt;

struct Point {
    x: f64,
    y: f64,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // write! 向 Formatter 写入内容，返回 fmt::Result
        write!(f, "({:.2}, {:.2})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3.14159, y: -2.71828 };
    println!("{}", p);          // (3.14, -2.72)
    let s = p.to_string();      // Display 自动提供 to_string()
    println!("{}", s);          // (3.14, -2.72)
}
```

实现了 `Display`，`to_string()` 方法就免费得到了——标准库自动为实现 `Display` 的类型提供 `to_string()`。

更复杂的例子——为链表实现显示：

```rust
use std::fmt;

struct Matrix {
    data: Vec<Vec<f64>>,
    rows: usize,
    cols: usize,
}

impl fmt::Display for Matrix {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for (i, row) in self.data.iter().enumerate() {
            write!(f, "[")?;
            for (j, val) in row.iter().enumerate() {
                if j > 0 { write!(f, ", ")?; }
                write!(f, "{:6.2}", val)?;  // 宽度6，2位小数
            }
            write!(f, "]")?;
            if i < self.rows - 1 { writeln!(f)?; }  // 最后一行不加换行
        }
        Ok(())
    }
}

fn main() {
    let m = Matrix {
        data: vec![
            vec![1.0, 2.0, 3.0],
            vec![4.5, 5.5, 6.5],
            vec![7.0, 8.0, 9.0],
        ],
        rows: 3,
        cols: 3,
    };
    println!("{}", m);
}
```

# 格式化参数详解

## 宽度、对齐与填充

格式化字符串可以精确控制输出的排版：

```rust
fn main() {
    // 宽度：数字后面跟位数
    println!("{:10}", "hello");    // "hello     "（右边补空格到10位）

    // 对齐：< 左对齐，> 右对齐，^ 居中
    println!("{:<10}", "hello");   // "hello     "（左对齐）
    println!("{:>10}", "hello");   // "     hello"（右对齐）
    println!("{:^10}", "hello");   // "  hello   "（居中）

    // 填充字符：在 < > ^ 前面写
    println!("{:*<10}", "hi");     // "hi********"（用*填充，左对齐）
    println!("{:0>5}", 42);        // "00042"（用0填充，右对齐）
    println!("{:-^20}", " 标题 "); // "-------  标题  -------"（居中）
}
```

数字的特殊格式：

```rust
fn main() {
    // 精度（小数位数）
    println!("{:.3}", 3.14159);  // 3.142（四舍五入到3位）
    println!("{:.0}", 3.7);      // 4（四舍五入到整数）

    // 宽度 + 精度组合
    println!("{:10.3}", 3.14);   // "     3.140"（宽10，3位小数）

    // 正数显示 +
    println!("{:+}", 42);        // +42
    println!("{:+}", -42);       // -42

    // 进制
    println!("{:b}", 42);        // 101010（二进制）
    println!("{:o}", 42);        // 52（八进制）
    println!("{:x}", 255);       // ff（十六进制小写）
    println!("{:X}", 255);       // FF（十六进制大写）
    println!("{:#x}", 255);      // 0xff（带 0x 前缀）
    println!("{:#b}", 42);       // 0b101010（带 0b 前缀）
}
```

## 命名参数与位置参数

```rust
fn main() {
    // 位置参数
    println!("{0} + {1} = {2}", 1, 2, 3);       // 1 + 2 = 3
    println!("{0}，你好！{0}，再见！", "Alice"); // Alice，你好！Alice，再见！

    // 命名参数
    println!("{name} 今年 {age} 岁", name = "Bob", age = 30);

    // 变量捕获（Rust 1.58+）
    let user = "Carol";
    let count = 5;
    println!("{user} 有 {count} 条消息");  // 直接用变量名
}
```

## 动态宽度与精度

宽度和精度也可以用变量指定，用 `$` 语法引用位置或命名参数：

```rust
fn main() {
    // 宽度用变量
    let width = 10;
    println!("{:>width$}", "hi");  // "        hi"（宽度10，右对齐）

    // 精度用变量
    let precision = 4;
    println!("{:.precision$}", 3.14159); // 3.1416

    // 打印对齐的表格
    let items = vec![
        ("苹果", 3.5_f64, 10_u32),
        ("香蕉", 1.2_f64, 25_u32),
        ("草莓", 8.8_f64, 5_u32),
    ];

    println!("{:<8} {:>8} {:>6}", "商品", "单价(元)", "数量");
    println!("{:-<24}", "");
    for (name, price, qty) in &items {
        println!("{:<8} {:>8.2} {:>6}", name, price, qty);
    }
}
```

## 自定义格式（实现多种 fmt trait）

除了 `Display` 和 `Debug`，还可以实现其他格式 trait，让你的类型支持 `{:b}`、`{:x}` 等：

```rust
use std::fmt;

struct Color {
    r: u8,
    g: u8,
    b: u8,
}

// {} 输出：rgb(255, 128, 0)
impl fmt::Display for Color {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "rgb({}, {}, {})", self.r, self.g, self.b)
    }
}

// {:#x} 输出：#ff8000（十六进制 HTML 颜色）
impl fmt::LowerHex for Color {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        if f.alternate() {
            // f.alternate() 检测是否有 # 标志（如 {:#x}）
            write!(f, "#{:02x}{:02x}{:02x}", self.r, self.g, self.b)
        } else {
            write!(f, "{:02x}{:02x}{:02x}", self.r, self.g, self.b)
        }
    }
}

fn main() {
    let c = Color { r: 255, g: 128, b: 0 };
    println!("{}", c);    // rgb(255, 128, 0)
    println!("{:x}", c);  // ff8000
    println!("{:#x}", c); // #ff8000
}
```

# 练习题

## 格式化输出测验

加载题目中…

加载题目中…

```
fn main() {
    println!("{:0>6}", 42);
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

为商品结构体实现 `Display`，输出格式化的价格标签：

```rust
use std::fmt;

struct Product {
    name: String,
    price: f64,
    in_stock: bool,
}

// TODO: 为 Product 实现 Display，格式如下：
// 商品名称              ¥ 19.90  [有货]
// 另一个商品            ¥  5.00  [缺货]
// 要求：
// - 商品名称左对齐，占 20 个字符宽度
// - 价格右对齐，占 8 个字符宽度，2 位小数
// - 库存状态：有货显示 [有货]，缺货显示 [缺货]

fn main() {
    let products = vec![
        Product { name: "红富士苹果".to_string(), price: 19.9, in_stock: true },
        Product { name: "进口蓝莓".to_string(), price: 58.0, in_stock: false },
        Product { name: "香蕉".to_string(), price: 5.0, in_stock: true },
    ];

    for p in &products {
        println!("{}", p);
    }
}
```
