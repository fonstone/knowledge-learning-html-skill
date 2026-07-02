# 暴露 Rust 给 C：cbindgen

入门 ⏱ 15 分钟 cbindgenFFIcdylibno\_mangleextern C

# 导出 Rust 给 C

有时我们需要编写一个极高性能的 Rust 库，然后让现有的 C、C++ 或 Python 代码调用它。这需要我们完成两件事：

1.  将 Rust 代码编译成 C 兼容的动态链接库（`.so`/`.dll`）。
2.  为 C 代码提供对应的头文件（`.h`）。

这就是 **`cbindgen`** 的用武之地。

## 准备 Rust 代码

要导出函数，必须满足：

-   使用 `pub extern "C"`。
-   使用 `#[no_mangle]` 禁用符号重整。

```rust
#[repr(C)]
pub struct CalculationResult {
    pub value: f64,
    pub is_valid: bool,
}

#[no_mangle]
pub extern "C" fn calculate_sqrt(input: f64) -> CalculationResult {
    if input < 0.0 {
        CalculationResult { value: 0.0, is_valid: false }
    } else {
        CalculationResult { value: input.sqrt(), is_valid: true }
    }
}
```

注意：结构体必须加上 `#[repr(C)]`，否则 Rust 的布局方式与 C 不一致，会导致严重的数据损坏问题。

## 项目配置

在 `Cargo.toml` 中，必须指定库类型为 `cdylib`：

```
[lib]
crate-type = ["cdylib"]
```

# 配置与使用

虽然可以手动写头文件，但如果你的 Rust 接口经常变动，同步起来会非常麻烦。`cbindgen` 可以自动化这一过程。

## 使用 CLI 工具

安装工具：

```
cargo install cbindgen
```

在 Rust 项目根目录运行：

```
cbindgen --config cbindgen.toml --crate my_project --output my_lib.h
```

生成的 `my_lib.h` 如下：

```
#include <stdint.h>
#include <stdbool.h>

typedef struct {
  double value;
  bool is_valid;
} CalculationResult;

CalculationResult calculate_sqrt(double input);
```

## cbindgen.toml 配置

通过一个可选的配置文件，你可以精细控制头文件的生成逻辑：

```
language = "C" // 也可以是 "C++"
header = "/* 自动化生成的 Rust 绑定头文件 */"
include_guard = "MY_LIB_H"

[export]
include = ["CalculationResult", "calculate_sqrt"]
```

## 内存安全警告

从 C 调用 Rust 时，**所有权规则依然存在**。

-   如果 Rust 返回了一个在堆上分配的对象（如 `Box` 或 `Vec`），C 代码必须将其传回给 Rust 的特定函数来释放。
-   绝不要在 C 语言中直接调用 `free()` 来释放由 Rust 堆分配器管理的内存。
