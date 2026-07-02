# 硬件抽象：如何与芯片交谈

在 C 语言中，操作硬件通常涉及到大量的宏（Macros）和指针强转（如 `*(uint32_t*)0x4001080C = 0x01`）。这种方式非常容易出错，且编译器无法提供任何保护。

Rust 的嵌入式生态采用了一套三层模型，将硬件操作逐步抽象：

## 1. 寄存器访问层（PAC）

**PAC (Peripheral Access Crate)** 是最底层的抽象。它通常由工具 **`svd2rust`** 直接从芯片厂商提供的 SVD 文件（XML 格式的描述文件）自动生成。

PAC 把内存地址变成了结构体。

### 传统的 C 风格操作：

```c
// 很容易写错地址或位偏移
RCC->APB2ENR |= (1 << 3);
```

### Rust PAC 风格操作：

```rust
// 类型安全的 API
dp.RCC.apb2enr.modify(|_, w| w.iopben().set_bit());
```

在 PAC 中，你依然是在操作寄存器，但 Rust 的闭包 API 确保了：

- 原子性 ： modify 会处理读-写循环。
- 只读/只写保护 ：你无法写入一个被标记为只读的寄存器。
- 字段校验 ：无法设置非法的位组合。

## 2. 硬件抽象层（HAL）

**HAL (Hardware Abstraction Layer)** 在 PAC 之上提供了更高级、更符合人体工程学的 API。它不要求你记住寄存器名称，而是操作具体的业务逻辑（如「初始化串口」）。

```rust
// 使用 HAL 初始化 GPIO B 的第 12 号引脚为推挽输出
let gpiob = dp.GPIOB.split();
let mut led = gpiob.pb12.into_push_pull_output();

led.set_high(); // 点亮 LED
```

## 3. 核心机制：类型状态模式 (Typestate Pattern)

这是 Rust 嵌入式开发最神奇的地方。利用 Rust 的 **所有权机制**，我们可以将硬件的**状态**编码到类型中。

### 场景：配置一个引脚

一个 GPIO 引脚在同一时间只能是「输入」或「输出」，绝不能同时是两者。

```rust
let pin = gpioa.pa1.into_floating_input(); // 此时 pin 的类型是 Pin<Input<Floating>>
// pin.set_high(); // ❌ 编译报错！输入引脚没有 set_high 方法

let output_pin = pin.into_push_pull_output(); // 消耗原引脚，返回 Pin<Output<PushPull>>
output_pin.set_high(); // ✅ 正常工作
```

这意味着：**如果你错误地在代码里操作了状态不对的硬件，编译器会拒绝编译。** 这种「编译期拦截」极大地减少了硬件调试的压力。

## 4. 通用标准：Embedded-HAL

如果你写了一个 OLED 屏幕的驱动，你肯定希望它既能跑在 STM32 上，也能跑在 ESP32 上。

**`embedded-hal`** 定义了一套标准的 Trait（接口）：

- OutputPin （输出引脚）
- SpiBus （SPI 总线）
- I2cAddress （I2C 地址）

只要你的驱动程序要求接收一个「实现了 `OutputPin` 的类型」，那么它就可以在任何实现了该标准的硬件平台上复用。这促成了 Rust 嵌入式社区极其丰富的驱动库（Display, Sensor, Radio 等）。

# 练习题

## 核心概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…