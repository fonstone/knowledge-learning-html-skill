# if let 与 while let

入门 ⏱ 20 分钟 if letwhile let语法糖简洁


# if let：match 的简洁写法

有时候，你用 `match` 只想处理**一个特定的情况**，其他情况都无需特殊处理。这时 `if let` 提供了更简洁的语法。

## match vs if let

假设你只想在 `Option` 有值时做某事：

```rust
// 使用 match（相对冗长）
let config_max = Some(3u8);

match config_max {
    Some(max) => println!("最大值配置为 {}", max),
    _ => (),  // 什么都不做
}
```

用 `if let` 简化：

```rust
// 使用 if let（更简洁）
let config_max = Some(3u8);

if let Some(max) = config_max {
    println!("最大值配置为 {}", max);
}
```

**关键差异：**

-   `match` 必须穷尽所有情况
-   `if let` 只关心一个模式是否匹配，**其他情况隐含地忽略**（相当于自动加了 `_ => {}`）

> **重要**：`if let` 确实"绕过"了穷尽性检查，但这是有意的设计。当你只关心某一种情况时，不需要为其他情况写冗长的 `_ => {}` 分支。比如上面的例子，你只想在配置有值时处理，不关心 `None` 的情况——这时 `if let` 就很合适。

## if let 的语法

```
if let 模式 = 表达式 {
    // 模式匹配时执行
}
```

注意：是 `=` 而不是 `match`。

## 实际例子

```rust
enum Status {
    Done,
    Working { progress: u32 },
}

fn main() {
    let status = Status::Working { progress: 50 };

    // 用 match
    match status {
        Status::Working { progress } => {
            println!("进度：{}%", progress);
        }
        _ => {}
    }

    // 用 if let（更清晰）
    if let Status::Working { progress } = status {
        println!("进度：{}%", progress);
    }
}
```

## if let … else

`if let` 可以配合 `else`，处理模式不匹配的情况：

```rust
let favorite_color: Option<&str> = Some("蓝色");
let is_tuesday = false;
let age: Result<u8, _> = "34".parse();

if let Some(color) = favorite_color {
    println!("使用你最喜欢的颜色：{}", color);
} else if is_tuesday {
    println!("星期二穿绿色！");
} else if let Ok(age) = age {
    if age > 30 {
        println!("使用紫色");
    } else {
        println!("使用橙色");
    }
} else {
    println!("使用蓝色作为后备方案");
}
```

**等价的 match 写法会更复杂**。

# while let：循环中的模式匹配

类似 `if let`，`while let` 在循环中只关心某个模式：

```rust
fn main() {
    let mut stack = vec![1, 2, 3];

    // 当 pop() 返回 Some 时继续循环
    while let Some(top) = stack.pop() {
        println!("栈顶：{}", top);
    }
}
```

等价的 `loop + match` 写法：

```rust
fn main() {
    let mut stack = vec![1, 2, 3];

    loop {
        match stack.pop() {
            Some(top) => println!("栈顶：{}", top),
            None => break,
        }
    }
}
```

`while let` 明显更简洁。

# 何时用 if let vs match

情况

用 if let

用 match

只关心一个模式匹配

✓

不推荐（代码冗长）

需要穷尽所有情况

✗

✓

需要处理多个模式

嵌套 if let 会很丑

✓

需要在模式中使用守卫条件

可以，但有限制

✓

简单规则：**如果你的 `match` 只有两个分支，其中一个用 `_` 忽略，那就考虑用 `if let`。**

# 练习题

```
let x = Some(5);

if let Some(y) = x {
    println!("{}", y);
}
```

加载题目中…

```
let config = Some(String::from("config.toml"));

if let Some(file) = config {
    println!("使用配置文件：{}", file);
} else {
    println!("使用默认配置");
}
```

加载题目中…

```
while let Some(x) = some_iterator {
    // ...
}
```

加载题目中…

## 编程练习

### 练习 1：用 if let 简化代码

使用 `if let` 和 `else` 处理以下场景：

```rust
enum Message {
    NewEmail { subject: String, sender: String },
    Text(String),
    Quit,
}

fn main() {
    let message = Message::NewEmail {
        subject: String::from("你好"),
        sender: String::from("Alice"),
    };

    // TODO: 用 if let 检查是否是 NewEmail
    // 如果是，打印 "收到新邮件，主题：{subject}，来自：{sender}"
    // 否则打印 "收到其他类型的消息"
}
```

### 练习 2：用 while let 遍历集合

使用 `while let` 循环处理向量中的元素：

```rust
fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];

    // TODO: 使用 while let 配合 pop() 从向量末尾取出元素
    // 逐个打印每个数字（注意顺序是从后往前）
}
```
