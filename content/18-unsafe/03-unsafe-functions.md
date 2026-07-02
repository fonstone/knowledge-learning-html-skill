# unsafe 函数与 Trait

高级 ⏱ 30 分钟 unsafe fnunsafe traitSendSyncSafety 文档extern fn

# unsafe 函数

## 什么时候需要 unsafe fn

当一个函数有**调用者必须满足但编译器无法验证的前提条件**时，就需要标注 `unsafe fn`。

常见场景：

-   函数接收裸指针，要求调用者保证指针有效且对齐
-   函数操作全局状态，要求单线程调用
-   函数调用了 C 代码，要求参数满足 C 接口的约定

标注 `unsafe fn` 的含义：**这个函数把安全责任转移给调用者**。

## unsafe fn 的基本语法

```rust
/// # Safety
///
/// - `ptr` 必须指向一个有效的、已初始化的 `i32` 值
/// - `ptr` 必须在整个调用期间保持有效（不能是悬垂指针）
unsafe fn read_unchecked(ptr: *const i32) -> i32 {
    *ptr
}

fn main() {
    let x = 42;
    // 调用 unsafe fn 需要 unsafe 块
    let val = unsafe { read_unchecked(&x as *const i32) };
    println!("{}", val); // 42
}
```

> **`# Safety` 文档节**是 Rust 社区的约定：每个 `unsafe fn` 都应该有一个 `# Safety` 文档注释，说明调用者需要满足什么条件。这是 unsafe 代码可维护性的关键。

## unsafe fn 内部也需要 unsafe 块

**Rust 2021 和 2024 edition 在这里行为不同：**

-   **2021 edition**：`unsafe fn` 的函数体是一个隐式的 unsafe 块，内部的危险操作不需要额外的 `unsafe {}`
-   **2024 edition**：即使在 `unsafe fn` 内，每个危险操作也必须显式加 `unsafe {}` 块

2024 edition 的改动是故意的——强迫你精确标出每一个危险点，而不是让整个函数体"默认危险"，更容易做代码审查。本教程使用 2024 edition，所以你会看到 `unsafe fn` 内部仍然有 `unsafe {}` 块：

```rust
unsafe fn process(ptr: *mut i32, count: usize) {
    // 2024 edition：即使在 unsafe fn 内，危险操作也要显式标出
    for i in 0..count {
        unsafe {
            *ptr.add(i) *= 2;
        }
    }
}

fn main() {
    let mut arr = [1, 2, 3, 4, 5];
    unsafe {
        process(arr.as_mut_ptr(), arr.len());
    }
    println!("{:?}", arr); // [2, 4, 6, 8, 10]
}
```

## 外部函数（extern fn）

通过 `extern "C"` 块声明的外部函数（通常来自 C 库）是隐式 `unsafe` 的——调用它们需要 `unsafe` 块：

```rust
extern "C" {
    fn abs(x: i32) -> i32;        // C 标准库的 abs 函数
    fn strlen(s: *const u8) -> usize;
}

fn main() {
    let result = unsafe { abs(-42) };
    println!("{}", result); // 42
}
```

为什么外部函数是 unsafe？因为 Rust 编译器对 C 代码一无所知——它无法验证 C 函数的内存安全性，所以要求调用者承担责任。

# unsafe Trait

## 什么是 unsafe trait

`unsafe trait` 表示这个 trait 有**实现者必须手动保证的安全不变量**，编译器无法自动验证。

最重要的两个例子是 `Send` 和 `Sync`：

Trait

含义

编译器自动实现的条件

`Send`

类型可以安全地移动到另一个线程

所有字段都是 `Send`

`Sync`

类型可以安全地被多个线程共享引用

所有字段都是 `Sync`

## 手动实现 Send 和 Sync

当你的类型包含裸指针时，编译器会保守地不自动实现 `Send` 和 `Sync`。如果你确认线程安全，需要手动用 `unsafe impl` 声明：

```rust
use std::sync::atomic::{AtomicI32, Ordering};

// 包含裸指针的类型：编译器不会自动实现 Send/Sync
struct AtomicCounter {
    inner: *mut AtomicI32,
}

// 我们手动保证：通过 AtomicI32 的原子操作，多线程访问是安全的
unsafe impl Send for AtomicCounter {}
unsafe impl Sync for AtomicCounter {}

impl AtomicCounter {
    fn new(val: i32) -> Self {
        let boxed = Box::new(AtomicI32::new(val));
        AtomicCounter { inner: Box::into_raw(boxed) }
    }

    fn increment(&self) {
        unsafe { (*self.inner).fetch_add(1, Ordering::SeqCst); }
    }

    fn get(&self) -> i32 {
        unsafe { (*self.inner).load(Ordering::SeqCst) }
    }
}

impl Drop for AtomicCounter {
    fn drop(&mut self) {
        unsafe { drop(Box::from_raw(self.inner)); }
    }
}

fn main() {
    let counter = AtomicCounter::new(0);
    counter.increment();
    counter.increment();
    println!("{}", counter.get()); // 2
}
```

## 定义自己的 unsafe trait

你也可以定义自己的 `unsafe trait`，用来表达某种合同：

```rust
/// # Safety
///
/// 实现此 trait 的类型必须保证：
/// 内存布局与 C 中对应类型完全一致（#[repr(C)]）
unsafe trait ReprC: Sized {
    fn as_bytes(&self) -> &[u8] {
        unsafe {
            std::slice::from_raw_parts(
                self as *const Self as *const u8,
                std::mem::size_of::<Self>(),
            )
        }
    }
}

#[repr(C)]
struct Point { x: f32, y: f32 }

// 我们保证 Point 是 #[repr(C)] 布局的
unsafe impl ReprC for Point {}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    let bytes = p.as_bytes();
    println!("Point 占 {} 字节", bytes.len()); // 8
}
```

## 阻止自动实现：!Send 和 !Sync

有时你的类型天生不能跨线程，需要明确**阻止**编译器自动推导 `Send` 或 `Sync`。使用 `PhantomData` 加上 negative impl 是惯用方法：

```rust
use std::marker::PhantomData;

// PhantomData<*const ()> 是 !Send 的，这会让 MyType 也变成 !Send
struct MyType {
    data: i32,
    _not_send: PhantomData<*const ()>,
}

fn main() {
    let x = MyType { data: 42, _not_send: PhantomData };
    println!("data = {}", x.data);

    // 下面这行会编译失败：MyType 不是 Send，不能跨线程移动
    // std::thread::spawn(move || { let _ = x; });
}
```
