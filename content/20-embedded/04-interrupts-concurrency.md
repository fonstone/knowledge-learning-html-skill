# 中断与并发安全

在嵌入式开发中，**中断（Interrupt）** 是处理异步事件的核心机制。当按键被按下、串口接收到数据或定时器到时，硬件会自动「中断」主程序的执行，跳转去运行一段特定的代码：**中断服务程序（ISR, Interrupt Service Routine）**。

这引入了一个经典的并发难题：**如何在 `main` 循环和 `ISR` 之间安全地共享数据？**

## 1. 危险的全局变量

在 C 语言中，我们通常使用 `static volatile` 全局变量。但在 Rust 中，全局可变变量是 `static mut`，通过它修改数据是 **不可取且极度危险的**，因为 `main` 修改一半时，中断可能随时发生并试图再次修改，导致数据竞争。

## 2. 临界区（Critical Section）

解决共享数据最基础的方法是：**在操作共享变量时临时禁用所有中断**。这段被保护的代码块被称为「临界区」。

在 Rust 中，我们通常使用 `critical-section` crate。

```rust
use critical_section as cs;

cs::with(|cs_token| {
    // 这个闭包内的代码在运行期间，中断是禁用的
    // cs_token 是一个「令牌」，证明你已经安全地合上了锁
});
```

## 3. 裸机下的 Mutex 与 RefCell

为了在不引发数据竞争的前提下共享资源，Rust 嵌入式社区使用了一种特殊的 `Mutex`（互设锁）。

### 类型定义：

```rust
use core::cell::RefCell;
use critical_section::Mutex;

// 定义一个被锁保护的、可内部变更的全局变量
static SHARED_DATA: Mutex<RefCell<u32>> = Mutex::new(RefCell::new(0));
```

### 访问数据：

```rust
fn handle_interrupt() {
    // 1. 进入临界区（获取令牌）
    critical_section::with(|cs| {
        // 2. 借用互斥锁并传入令牌
        let mut data = SHARED_DATA.borrow(cs).borrow_mut();
        // 3. 安全地操作数据
        *data += 1;
    });
}
```

**为什么需要 `cs` 令牌？**
Rust 的嵌入式 `Mutex` 要求在调用 `borrow` 时必须传入一个 `CriticalSection` 令牌。由于获取令牌的唯一途径是调用 `cs::with`（这会禁用中断），这就保证了 **只要你在持有数据，中断就一定发不生**。

## 4. 原子操作（Atomic）

如果你只需要共享一个简单的数值（如标志位或计数器），使用原子类型（Atomics）是效率更高、成本更低的方案。由于硬件指令集支持原子读-改-写，这种操作本身就不受中断干扰，因此不需要进入临界区。

```rust
use core::sync::atomic::{AtomicBool, Ordering};

static IS_PRESSED: AtomicBool = AtomicBool::new(false);

fn main_loop() {
    if IS_PRESSED.load(Ordering::SeqCst) {
        // 处理按键逻辑
        IS_PRESSED.store(false, Ordering::SeqCst);
    }
}

// 中断函数
fn on_button_click() {
    IS_PRESSED.store(true, Ordering::SeqCst);
}
```

## 5. 独占外设：`Peripherals` 的单例性

Rust 嵌入式库通过 `take()` 方法确保硬件外设是**单例**的。

```rust
let dp = pac::Peripherals::take().unwrap();
```

如果你的程序中两个地方同时尝试 `take()`，第二次会返回 `None`。这在编译期（或运行期初始化时）就防止了两个不同的模块同时配置同一个定时器或串口。

# 练习题

## 核心概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…