# 为什么需要路径和 use
前面我们讲过，模块在模块树中**只能被声明一次** （声明权属于父模块），但**可以从多处访问** 。当你需要在 `a.rs` 和 `b.rs` 中都使用模块 `c` 时，不能重复声明，而要通过**路径** 来访问它。
use
**核心区别** ：
  * **`mod`** — **构建** 模块树的结构（`mod c;` 声明模块 c）
  * **`路径/use`** — **使用** 构建好的模块树（`use super::c;` 访问模块 c）


# 访问模块中的项：路径
模块中定义的项需要通过**路径** 来访问。路径就像文件系统中的路径：`/home/user/file.txt`。
Rust 中有两种路径：
  * **绝对路径** ：从 crate root 开始
  * **相对路径** ：从当前模块开始


## 绝对路径
绝对路径以 `crate` 关键字或 crate 名开头，表示从 crate 根部开始。
```
    mod restaurant {
        pub mod front_of_house {
            pub mod hosting {
                pub fn add_to_waitlist() {
                    println!("已添加到等待列表");
                }
            }
        }
    }
    
    fn main() {
        // 绝对路径：从 crate 根开始
        crate::restaurant::front_of_house::hosting::add_to_waitlist();
    }
```
### 为什么用 crate:: 而不是包名？
对于库 crate（lib.rs），使用 `crate::` 代表 crate 根。这样的好处是：
  * 如果库被重命名，代码不需要改变
  * 跨越 crate 边界时更清晰
```
    // 库中的绝对路径写法
    pub fn some_function() {
        crate::restaurant::eat();  // 总是指向本 crate
    }
```
## 相对路径
相对路径以当前模块的标识符、`self`、`super` 开头。
`self` 表示当前模块，`super` 表示父模块（类似文件系统的 `..`）。**通常情况下`self::` 可以省略**，只有在 `use` 语句中需要显式写出。
```
    fn serve_order() {
        println!("提供订单");
    }
    
    mod back_of_house {
        fn cook_order() {
            println!("准备订单");
        }
    
        pub fn fix_incorrect_order() {
            // ✓ 使用 self 访问同一模块的 cook_order
            self::cook_order();
    
            // ✓ 使用 super 访问父模块的 serve_order
            super::serve_order();
        }
    }
    
    fn main() {
        back_of_house::fix_incorrect_order();
    }
```
## 绝对路径 vs 相对路径
场景| 推荐| 原因  
---|---|---  
定义项和使用项位置距离远| 绝对路径| 移动时只需改变一个位置  
项在嵌套较深的模块中| 相对路径 + super| 避免写太长的路径  
同时移动定义和使用| 相对路径| 整体迁移更方便  
# use 关键字
`use` 的作用是**将项引入当前作用域** ，使你可以用更短的路径来访问它，而不用每次都写完整的模块路径。这是对路径的补充和简化。
## 简化路径
每次都写完整路径会很冗长。`use` 关键字可以将项引入作用域，之后就可以使用短路径。
```
    mod restaurant {
        pub mod hosting {
            pub fn add_to_waitlist() {
                println!("已添加");
            }
        }
    }
    
    fn main() {
        // ❌ 不用 use 时，每次都要写完整路径
        restaurant::hosting::add_to_waitlist();
        restaurant::hosting::add_to_waitlist();
    
        // ✓ 使用 use 引入后，可以用短路径
        use restaurant::hosting;
        hosting::add_to_waitlist();
        hosting::add_to_waitlist();
    }
```
### use 的惯例
#### **函数** ：导入到父模块，调用时指定完整路径
```
    use std::collections::HashMap;
    
    fn main() {
        let mut map = HashMap::new();  // ✓ 这是惯例用法
        map.insert(1, 2);
    }
```
不好的做法：直接导入函数
```
    use std::collections::hash_map::HashMap::new;  // ✗ 不推荐
    
    // 应该这样：
    use std::collections::HashMap;
    
    fn main() {
        let map = HashMap::new();
    }
```
#### **结构体、枚举** ：导入完整路径
```
    use std::collections::HashMap;
    use std::result::Result;
    
    fn main() {
        let _map = HashMap::new();
        let _result: Result<i32, String> = Ok(42);
    }
```
## 处理名称冲突
当导入两个同名的项时，需要用父模块来区分，或用 `as` 起别名。
### 方式 1：用父模块区分
```
    use std::fmt;
    use std::io;
    
    fn function1() -> fmt::Result {
        Ok(())
    }
    
    fn function2() -> io::Result<()> {
        Ok(())
    }
    
    fn main() {
        let _r1: fmt::Result = function1();
        let _r2: io::Result<()> = function2();
    }
```
### 方式 2：用 as 重命名
```
    use std::fmt::Result;
    use std::io::Result as IoResult;
    
    fn function1() -> Result {
        Ok(())
    }
    
    fn function2() -> IoResult<()> {
        Ok(())
    }
    
    fn main() {
        let _r1: Result = function1();
        let _r2: IoResult<()> = function2();
    }
```
## 嵌套 use 路径
导入多个项时，可以合并相同的前缀。
```
    // 传统写法
    use std::cmp::Ordering;
    use std::io;
    
    // 嵌套写法（更简洁）
    use std::{cmp::Ordering, io};
    
    fn main() {
        let _order = Ordering::Less;
    }
```
### 包括 self 的嵌套
```
    use std::io::{self, Write};  // 导入 io 和 io::Write
    
    fn main() {
        // 可以使用 io:: 和 io::Write::
    }
```
## glob 运算符
用 `*` 导入模块中的所有公有项（谨慎使用）。
```
    use std::collections::*;
    
    fn main() {
        // 所有 collections 中的公有项都可以使用
        let _vec = Vec::new();
        let _map = HashMap::new();
    }
```
> **注意** ：glob 会让代码变得难以追踪名称来源，通常只在测试中使用。
## pub use：重导出
`pub use` 将导入的项重新导出，使其对外部可见。这在设计库的公开 API 时很有用。
```
    mod front_of_house {
        pub mod hosting {
            pub fn add_to_waitlist() {
                println!("已添加");
            }
        }
    }
    
    // 将 hosting 重新导出到库的顶层 API
    pub use front_of_house::hosting;
    
    fn main() {
        // 用户可以直接访问 hosting，不需要知道 front_of_house 的存在
        hosting::add_to_waitlist();
    }
```
### 为什么要重导出？
想象你设计了一个库，内部结构是 `types::User` 和 `types::Post`，但用户只关心”用户”和”文章”这两个概念。用 `pub use` 可以简化 API。
**单文件例子：**
```
    // 内部结构
    mod types {
        pub struct User { pub name: String }
        pub struct Post { pub title: String }
    }
    
    // 导出到顶层，用户可以直接用
    pub use types::{User, Post};
    
    // 用户现在可以这样使用：
    // use my_lib::{User, Post};
    // 而不需要知道 types 模块
```
**多文件例子（深层模块的重导出）：**
假设你的库有这样的结构：`types` 模块在深处定义了 `User` 和 `Post`。问题是：能否直接从顶层 `lib.rs` 把它们导出给用户？
### 第一种方式：直接导出（无中间层）
项目结构：
```
    src/
    ├── lib.rs
    └── types/
        └── mod.rs         ← 这里定义 User 和 Post
```
**types/mod.rs：**
```
    pub struct User { pub name: String }
    pub struct Post { pub title: String }
```
**lib.rs：**
```
    mod types;
    
    // 直接从 types 导出到顶层
    pub use types::{User, Post};
```
**用户使用：**
```
    use my_lib::{User, Post};  // ✅ 工作正常
```
* * *
### 第二种方式：链式重导出（多层嵌套）
如果 types 被嵌套在 utils 内部，才需要链式转发：
项目结构：
```
    src/
    ├── lib.rs
    └── utils/
        ├── mod.rs
        └── types.rs        ← types 是 utils 的子模块
```
**utils/types.rs：**
```
    pub struct User { pub name: String }
    pub struct Post { pub title: String }
```
**utils/mod.rs（从子模块重导出）：**
```
    mod types;
    
    // 把 types 导出到 utils 的公开 API
    pub use types::{User, Post};
```
**lib.rs（再导出一级到顶层）：**
```
    mod utils;
    
    // 把 utils 的导出再导到顶层
    pub use utils::{User, Post};
```
**用户使用：**
```
    use my_lib::{User, Post};  // ✅ 用户完全看不到 utils 的存在
```
**真实意义** ：当 types 本身是 utils 内部的组织时，链式重导出让用户只看到最简洁的公开 API。
> **重要** ：重导出有个前提——**源项必须是`pub` 的**。如果 `User` 本身是私有的，即使你写了 `pub use types::User;` 也会编译错误。因为重导出就是”我允许外部访问这个项”，但前提是这个项本身要对外可见。
# 跨 Crate 使用
前面讲的都是**同一个 crate 内** 的模块访问。Rust 也支持**跨 crate 访问** ——调用其他 crate 中的函数。
## 前提条件
  1. **目标必须是库 crate** （有 `src/lib.rs`）
  2. **函数必须标记为`pub`**（否则外部无法访问）
  3. **在 Cargo.toml 中声明依赖**
  4. **用`use` 导入**


## 文件结构
```
    workspace/
    ├── math_lib/                    ← 库 crate
    │   ├── Cargo.toml
    │   └── src/
    │       └── lib.rs              ← 包含 pub fn add()
    │
    └── my_app/                      ← 应用 crate
        ├── Cargo.toml              ← 声明对 math_lib 的依赖
        └── src/
            └── main.rs             ← 使用 use math_lib::add;
```
## 实例
假设有两个 crate：`math_lib`（库）和 `my_app`（应用）
**math\_lib/src/lib.rs：**
```
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    
    fn internal_helper() {  // 私有，外部无法访问
        println!("内部帮助函数");
    }
```
**my\_app/Cargo.toml：**
```
    [dependencies]
    math_lib = { path = "../math_lib" }  # 本地路径
    # 或从 crates.io：
    # math_lib = "0.1"
```
**my\_app/src/main.rs：**
```
    use math_lib::add;  // 导入其他 crate 的函数
    
    fn main() {
        let result = add(2, 3);  // ✓ 可以调用 pub 函数
        println!("结果：{}", result);
    
        // ❌ 无法调用私有函数
        // math_lib::internal_helper();
    }
```
## 可见性仍然有效
跨 crate 访问时，**可见性规则仍然适用** ：
  * 只能访问目标 crate 中标记为 `pub` 的项
  * 嵌套模块也要遵循”完整路径都是 pub”的规则
  * 私有项永远隐藏，无论在哪里调用


这是 **Cargo（包管理器）** 和 **模块系统** 结合的力量。
## 循环依赖约束
**重要限制** ：Rust 的 crate 依赖**必须是 DAG（有向无环图）** ，不允许循环依赖。
```
    ❌ 不允许循环依赖：
    crate_a → crate_b → crate_c → crate_a
```
**如果遇到循环依赖** ，通常说明代码设计有问题，需要重构：
  * 提取公共功能到第三个 crate
  * 将某个 crate 的依赖改为模块内依赖


强制消除循环依赖，反而能写出更清晰的架构。
# 练习题
## 路径基础测验
```
    mod outer {
        pub mod inner {
            pub fn function() {
                println!("inner function");
            }
        }
    }
```
加载题目中…
加载题目中…
加载题目中…
```
    use std::cmp::Ordering;
    use std::collections::HashMap;
    use std::collections::HashSet;
    use std::io;
    
    fn main() {
        let _order = Ordering::Less;
        let _map = HashMap::new();
        let _set = HashSet::new();
        let _io = io::stdout();
    }
```
加载题目中…
加载题目中…
## 编程练习
### 利用 use 和路径组织模块
创建一个库结构，包含：
  * `types` 模块（私有），定义 `User` 和 `Post` 结构体
  * 通过 `pub use` 将 `User` 和 `Post` 重导出到顶层
  * `utils` 模块，包含 `format_user()` 函数
  * 在 `main` 中通过简洁的路径使用这些项
```
    // TODO: 修改可见性
    mod types {
        struct User {
            name: String,
        }
        struct Post {
            title: String,
        }
    }
    
    // TODO: 使用 pub use 将 User 和 Post 重导出
    
    // TODO: 使用 User
    mod utils {
    
    
        pub fn format_user(user: &User) -> String {
            format!("用户: {}", user.name)
        }
    }
    
    fn main() {
        // 直接使用 User，不需要知道 types 模块
        let user = User { name: "Alice".to_string() };
        let post = Post { title: "我的博文".to_string() };
    
        println!("{}", user.name);
        println!("{}", post.title);
    
        // 使用 utils 中的函数
        println!("{}", utils::format_user(&user));
    }
```