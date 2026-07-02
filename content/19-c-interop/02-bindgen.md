# 自动化绑定

手动为成百上千个 C 函数编写 `extern "C"` 声明不仅枯燥，而且极易出错。如果 C 语言库更新了头文件，手动维护这些绑定简直是噩梦。

**`bindgen`** 是 Rust 官方推荐的工具，它可以自动读取 C 头文件（`.h`），并生成对应的 Rust 原始绑定。

## 使用 bindgen CLI

你可以先安装命令行工具来快速测试：

```bash
cargo install bindgen-cli
```

假设你有一个名为 `input.h` 的文件：

```c
typedef struct {
    int x;
    int y;
} Point;

void print_point(Point p);
```

运行以下命令：

```bash
bindgen input.h -o bindings.rs
```

生成的 `bindings.rs` 会包含：

```rust
#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub struct Point {
    pub x: ::std::os::raw::c_int,
    pub y: ::std::os::raw::c_int,
}

extern "C" {
    pub fn print_point(p: Point);
}
```

# 构建脚本集成

在实际项目中，我们通常在 `build.rs`（构建脚本）中使用 `bindgen`，这样每次编译时它都会自动根据最新的头文件更新绑定。

## 配置步骤

1. 在 Cargo.toml 中添加依赖：

```toml
[build-dependencies]
bindgen = "0.69"
```

1. 编写 build.rs ：

```rust
use std::env;
use std::path::PathBuf;

fn main() {
    // 告诉 Cargo，如果头文件变了，就重新运行脚本
    println!("cargo:rerun-if-changed=wrapper.h");

    let bindings = bindgen::Builder::default()
        .header("wrapper.h")
        .parse_callbacks(Box::new(bindgen::CargoCallbacks::new()))
        .generate()
        .expect("Unable to generate bindings");

    // 将生成的绑定写入 $OUT_DIR/bindings.rs
    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}
```

1. 在 Rust 代码中引入生成的内容：

```rust
// 引入自动生成的代码
include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

fn main() {
    let p = Point { x: 10, y: 20 };
    unsafe {
        print_point(p);
    }
}
```

### 关键机制：为什么使用 `OUT_DIR`？

在上面的 `build.rs` 示例中，你可能注意到我们并没有把生成的 `bindings.rs` 放在 `src/` 目录下。这是 Rust 构建脚本的标准实践：

1. 避免源码污染 ：自动生成的代码会随 C 头文件的变化而变动，不应该作为「手写源码」提交到 Git 仓库。
1. `OUT_DIR` 环境变量 ：这是 Cargo 为构建脚本专门准备的临时存放目录（通常在 target/debug/build/... 路径下）。
1. `include!` 宏 ：它是 Rust 内置的宏，可以将指定文件的内容「原封不动」地粘贴到当前位置，从而让我们在 Rust 源码中直接使用那些自动生成的结构体定义。

## 处理复杂情况

- 宏定义 ：bindgen 会尝试将 C 中的 #define 转换为 Rust 的常量。
- 不透明类型 ：对于不想在 Rust 中直接访问成员的结构体，可以使用 .opaque_type("MyStruct") 。
- 白名单机制 ：如果你只想为特定函数生成绑定，可以使用 .allowlist_function("my_func_.*") 。

# 练习题

## 概念测验

加载题目中…

加载题目中…

加载题目中…

加载题目中…

加载题目中…