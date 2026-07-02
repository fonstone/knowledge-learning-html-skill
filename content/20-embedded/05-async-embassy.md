# 异步嵌入式：Embassy 框架

高级 ⏱ 20 分钟 Embassyasync/await异步嵌入式执行器低功耗

# 异步嵌入式：Embassy 框架

在传统的嵌入式开发中，我们通常只有两种选择：

1.  **前后台模式 (Superloop)**：一个 `loop` 跑到底，所有的等待（如等待串口数据）都是阻塞的。
2.  **中断驱动**：通过大量复杂的中断回调来处理异步事件，代码很快就会变成难懂的「面条代码」。

**Embassy** (Embedded + Async) 的出现彻底改变了这一局面。它将 Rust 强大的 `async/await` 特性带入了嵌入式世界。

## 1\. 为什么在嵌入式中使用异步？

### 极简的并发

假设你要同时闪烁两个 LED，频率不同。在 `async` 环境下，代码非常直观：

```
#[embassy_executor::task]
async fn blink_led(mut pin: Output<'static, AnyPin>, interval: Duration) {
    loop {
        pin.set_high();
        Timer::after(interval).await;
        pin.set_low();
        Timer::after(interval).await;
    }
}
```

你只需要开启两个 `task`，它们就会并发运行。不需要手写复杂的定时器状态机。

### 极致的低功耗

Embassy 的执行器（Executor）非常聪明。当所有异步任务都处于 `await`（挂起）状态时，它会自动让 CPU 进入 **低功耗睡眠模式**（如 ARM 的 WFI 指令）。只有当硬件中断发生时，处理器才会被唤醒。

## 2\. Embassy 的核心组件

-   **`embassy-executor`**：异步任务调度器。它负责轮询所有任务，且**不需要堆内存分配**。
-   **`embassy-time`**：提供 `Timer`, `Instant`, `Duration` 等时间 API，支持毫秒甚至微秒精度。
-   **`embassy-stm32` / `nrf` / `rp`**：针对特定芯片的 HAL 层。每个外设（如 UART, SPI）都提供了异步接口。

## 3\. 一个典型的 Embassy 程序结构

```
use embassy_executor::Spawner;
use embassy_time::{Duration, Timer};
use {panic_halt as _, embassy_stm32 as _};

#[embassy_executor::main]
async fn main(spawner: Spawner) {
    // 初始化硬件
    let p = embassy_stm32::init(Default::default());

    // 派发一个后台任务
    spawner.spawn(my_task()).unwrap();

    loop {
        println!("主循环运行中...");
        Timer::after(Duration::from_secs(1)).await;
    }
}

#[embassy_executor::task]
async fn my_task() {
    loop {
        // 执行异步操作
        Timer::after(Duration::from_millis(500)).await;
    }
}
```

## 4\. 异步 vs RTOS (实时操作系统)

Embassy 虽然提供了类似 RTOS 的便利（多任务、同步原语），但它有显著的优势：

-   **更小的开销**：由于 `async` 基于编译器生成的协程，它不需要为每个任务分配独立的栈空间，内存消耗极低。
-   **更强的类型检查**：异步接口能更好地感知「借用和所有权」，避免了 RTOS 中常见的共享资源竞争问题。

# 练习题

## 核心概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…
