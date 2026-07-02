# 枚举

入门 ⏱ 25 分钟 枚举enum成员变体关联数据


# 什么是枚举

**枚举**（enum）允许你定义一个类型，其值**只能是预先列举的几个成员之一**。

日常比喻：一个消息可能是"收到新邮件"、"收到推送通知"或"收到短信"，但同一时刻只能是其中一种。这正是枚举的用途。

## 为什么需要枚举

比如你要表示网络请求的状态：

```rust
// 不好的做法：用多个布尔字段，容易陷入矛盾状态
struct RequestStatus {
    is_pending: bool,
    is_success: bool,
    is_error: bool,
}

fn main() {
    // 这个状态是什么？同时是 success 和 error？这没有意义！
    let status = RequestStatus {
        is_pending: true,
        is_success: true,
        is_error: false,
    };
}
```

用枚举：

```rust
enum RequestStatus {
    Pending,
    Success,
    Error,
}

fn main() {
    // 清晰明了：只能是这三个状态之一
    let status = RequestStatus::Pending;
}
```

枚举通过编译器的强制，确保**不会陷入无效的状态组合**。

## 定义和使用枚举

基本语法：

```rust
enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let my_direction = Direction::North;

    // 可以有多个成员
    let go_east = Direction::East;
    let go_back = Direction::South;
}
```

**关键点：**

-   成员名用 **`EnumName::MemberName`** 访问
-   成员名按惯例用大驼峰
-   同一枚举的所有成员都是同一类型

# 枚举成员与关联数据

枚举的真正力量在于：**每个成员可以关联不同类型的数据**。

> **对于 C 程序员的类比**：Rust 枚举相当于 C 的 **tagged union**（带标签的联合体）。C 的 `union` 让多个成员共享同一块内存但没有标记当前活跃成员，容易出错。Rust 枚举自动添加标签记录当前变体，编译器强制安全地访问数据，无需手动维护标志位。

## 简单关联数据

比如，一条消息可能是"发送字符串"或"发送数字"：

```rust
enum Message {
    Text(String),
    Number(i32),
}

fn main() {
    let msg1 = Message::Text(String::from("Hello"));
    let msg2 = Message::Number(42);
}
```

每个成员可以关联不同数量和类型的数据：

```rust
enum Message {
    Quit,                          // 无数据
    Move { x: i32, y: i32 },       // 结构体风格的数据
    Write(String),                 // 单个值
    ChangeColor(i32, i32, i32),    // 多个值
}

fn main() {
    let msg1 = Message::Quit;
    let msg2 = Message::Move { x: 10, y: 20 };
    let msg3 = Message::Write(String::from("hello"));
    let msg4 = Message::ChangeColor(255, 0, 0);
}
```

这相当于用不同的结构体，但统一在一个类型下。

## 为什么这比结构体更好

假设没有枚举，你可能这样做：

```rust
struct MoveMessage {
    x: i32,
    y: i32,
}

struct WriteMessage {
    text: String,
}

// 现在要处理这些消息，写的函数很难处理...
```

用枚举就简单了，所有消息都是一种类型。

# 为枚举定义方法

像结构体一样，枚举也可以有方法：

```rust
enum GameResult {
    Win,
    Lose,
    Draw,
}

impl GameResult {
    fn message(&self) -> String {
        match self {
            GameResult::Win => String::from("你赢了！"),
            GameResult::Lose => String::from("你输了"),
            GameResult::Draw => String::from("平局"),
        }
    }
}

fn main() {
    let result = GameResult::Win;
    println!("{}", result.message());
}
```

（这里用到了 `match`，后续会详细讲）

# 常见枚举模式

## 状态机

用枚举模型系统状态：

```rust
#[derive(Debug)]
enum PlayerState {
    Idle,
    Walking,
    Running,
    Jumping { height: u32 },
}

impl PlayerState {
    fn can_jump(&self) -> bool {
        match self {
            PlayerState::Idle | PlayerState::Walking => true,
            _ => false,
        }
    }
}

fn main() {
    let state = PlayerState::Idle;
    println!("当前状态能跳吗？{}", state.can_jump());
}
```

## 错误表示

用枚举表示各种错误情况（先了解，后续错误处理章节会深入）：

```rust
enum FileError {
    NotFound,
    PermissionDenied,
    UnknownError(String),
}

fn main() {
    let error = FileError::NotFound;
}
```

# 练习题

```
enum TrafficLight {
    Red,
    Yellow,
    Green,
}
```

加载题目中…

```
enum Color {
    Red(u8, u8, u8),
    Hex(String),
}

fn main() {
    let color1 = Color::Red(255, 0, 0);
    let color2 = Color::Hex(String::from("#FF0000"));
}
```

加载题目中…

加载题目中…

## 编程练习

### 练习 1：定义包含关联数据的枚举

定义一个 `FileOperation` 枚举，包含以下成员：

-   `Create(String)` — 创建文件（参数是文件名）
-   `Delete(String)` — 删除文件
-   `Read(String)` — 读取文件
-   `Write { filename: String, content: String }` — 写入文件

创建几个实例并打印（需要派生 Debug）：

```rust
#[derive(Debug)]
enum FileOperation {
    // TODO: 定义四个成员
}

fn main() {
    let op1 = FileOperation::Create(String::from("test.txt"));
    let op2 = FileOperation::Write {
        filename: String::from("test.txt"),
        content: String::from("Hello, world!"),
    };
    let op3 = FileOperation::Read(String::from("test.txt"));

    println!("{:?}", op1);
    println!("{:?}", op2);
    println!("{:?}", op3);
}
```

### 练习 2：重构：用枚举替代多个结构体

下面用多个结构体定义了不同的网络消息，你的任务是把这段代码改写成用枚举来统一这些消息。

**原来的代码（多个结构体）：**

```
struct QuitMessage;               // 关闭应用
struct MoveMessage {
    x: i32,
    y: i32,
}                                // 移动光标
struct WriteMessage {
    text: String,
}                                // 写入文本
struct ChangeColorMessage {
    r: u8,
    g: u8,
    b: u8,
}                                // 改变颜色
```

**你的任务：** 定义一个 `Message` 枚举，把上面四种消息统一为一个类型。每个成员的关联数据结构应该与原结构体完全对应。然后创建各种类型的消息实例并打印它们。

```rust
// TODO: 定义 Message 枚举，包含上面四种消息

fn main() {
    let quit = Message::Quit;
    let move_msg = Message::Move { x: 100, y: 200 };
    let write_msg = Message::Write(String::from("Hello"));
    let color_msg = Message::ChangeColor { r: 255, g: 0, b: 0 };

    // TODO: 使用 {:?} 打印这四个消息（需要派生 Debug）
}
```
