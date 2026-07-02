# 导出 Rust 给 C

有时我们需要编写一个极高性能的 Rust 库，然后让现有的 C、C++ 或 Python 代码调用它。这需要我们完成两件事：

1. 将 Rust 代码编译成 C 兼容的动态链接库（ .so / .dll ）。
1. 为 C 代码提供对应的头文件（ .h ）。

这就是 **`cbindgen`** 的用武之地。

## 准备 Rust 代码

要导出函数，必须满足：

- 使用 pub extern "C" 。
- 使用 #[no_mangle] 禁用符号重整。

<div class="code-runner" data-full-code="%23%5Brepr(C)%5D%0Apub%20struct%20CalculationResult%20%7B%0A%20%20%20%20pub%20value%3A%20f64%2C%0A%20%20%20%20pub%20is_valid%3A%20bool%2C%0A%7D%0A%0A%23%5Bno_mangle%5D%0Apub%20extern%20%22C%22%20fn%20calculate_sqrt(input%3A%20f64)%20-%3E%20CalculationResult%20%7B%0A%20%20%20%20if%20input%20%3C%200.0%20%7B%0A%20%20%20%20%20%20%20%20CalculationResult%20%7B%20value%3A%200.0%2C%20is_valid%3A%20false%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20CalculationResult%20%7B%20value%3A%20input.sqrt()%2C%20is_valid%3A%20true%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[repr(</span><span style="color:#B392F0">C</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> struct</span><span style="color:#B392F0"> CalculationResult</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#E1E4E8"> value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#F97583">    pub</span><span style="color:#E1E4E8"> is_valid</span><span style="color:#F97583">:</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">#[no_mangle]</span></span>
<span class="line"><span style="color:#F97583">pub</span><span style="color:#F97583"> extern</span><span style="color:#9ECBFF"> "C"</span><span style="color:#F97583"> fn</span><span style="color:#B392F0"> calculate_sqrt</span><span style="color:#E1E4E8">(input</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> CalculationResult</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> input </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        CalculationResult</span><span style="color:#E1E4E8"> { value</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0.0</span><span style="color:#E1E4E8">, is_valid</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        CalculationResult</span><span style="color:#E1E4E8"> { value</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> input</span><span style="color:#F97583">.</span><span style="color:#B392F0">sqrt</span><span style="color:#E1E4E8">(), is_valid</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8"> }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

注意：结构体必须加上 `#[repr(C)]`，否则 Rust 的布局方式与 C 不一致，会导致严重的数据损坏问题。

## 项目配置

在 `Cargo.toml` 中，必须指定库类型为 `cdylib`：

```toml
[lib]
crate-type = ["cdylib"]
```

# 配置与使用

虽然可以手动写头文件，但如果你的 Rust 接口经常变动，同步起来会非常麻烦。`cbindgen` 可以自动化这一过程。

## 使用 CLI 工具

安装工具：

```bash
cargo install cbindgen
```

在 Rust 项目根目录运行：

```bash
cbindgen --config cbindgen.toml --crate my_project --output my_lib.h
```

生成的 `my_lib.h` 如下：

```c
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

```toml
language = "C" # 也可以是 "C++"
header = "/* 自动化生成的 Rust 绑定头文件 */"
include_guard = "MY_LIB_H"

[export]
include = ["CalculationResult", "calculate_sqrt"]
```

## 内存安全警告

从 C 调用 Rust 时，**所有权规则依然存在**。

- 如果 Rust 返回了一个在堆上分配的对象（如 Box 或 Vec ），C 代码必须将其传回给 Rust 的特定函数来释放。
- 绝不要在 C 语言中直接调用 free() 来释放由 Rust 堆分配器管理的内存。

# 练习题

## 核心概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…