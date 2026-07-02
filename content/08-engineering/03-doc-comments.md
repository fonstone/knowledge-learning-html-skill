# 文档注释
**什么是文档注释？** Rust 有一种特殊的注释叫”文档注释”，它不仅注解代码，还能用 `cargo doc` 生成漂亮的 HTML 文档。这对 Rust 生态特别重要。
**为什么需要文档注释？** 与 C/C++ 不同，Rust **没有头文件** 。C 使用者看头文件（`.h`）来了解库的接口，但 Rust 库没有这个。所以 Rust 社区的约定是：**库作者必须用文档注释详细说明每个 pub API 的用法、参数含义、返回值、可能的错误——使用者完全靠这些文档来理解如何使用库** 。这也是为什么 Rust 开源社区对文档质量有很高的要求。
**什么内容需要文档注释？**
  * **所有 pub 项** ：任何公开的函数、结构体、枚举、trait、常量都应该有文档
  * **复杂的逻辑** ：非显而易见的行为、性能特性、安全约束等
  * **模块和 crate 级别** ：用 `//!` 说明整个模块的目的和使用场景
  * **字段注释** ：struct 和 enum 的每个公开字段都值得记录


## 两种文档注释
> **基础回顾** ：`///` 和 `//!` 的基本语法已在[《注释》](</RustCourse/chapters/02-basic-syntax/01-comments#%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A--1>)章节讲解。这里关注文档注释的**进阶用法** ：Markdown 格式、标准文档章节、代码示例验证等。
> **使用规则** ：
>   * `//!` 放在 `lib.rs` 顶部 → crate 级别的文档（在 docs.rs 首页显示）
>   * `//!` 放在模块文件顶部 → 该模块的文档
>   * `///` 放在每个 pub item 之前 → 该 item 的文档
> 

## 文档注释中的 Markdown
文档注释支持完整的 Markdown 语法：
```
    /// 一个简单的用户结构体。
    ///
    /// ## 字段说明
    ///
    /// - `name`：用户名，不能为空
    /// - `age`：用户年龄，必须大于 0
    ///
    /// ## 示例
    ///
    /// ```rust
    /// let user = User { name: "Alice".to_string(), age: 25 };
    /// assert_eq!(user.name, "Alice");
    /// ```
    pub struct User {
        /// 用户的名称
        pub name: String,
        /// 用户的年龄（岁）
        pub age: u32,
    }
```
代码块（`````）、加粗、斜体、列表、表格、链接——Markdown 里有的这里都支持。生成的文档会按 Markdown 渲染成 HTML。
## 标准文档章节
Rust 社区约定了几个标准章节名，`cargo doc` 会把它们格式化得更显眼。这类似于 Doxygen（C/C++ 的文档生成工具）的概念——用特定的标记让文档生成工具能够识别和组织信息：
```
    /// 将两个向量拼接，返回一个新向量。
    ///
    /// # Examples
    ///
    /// ```rust
    /// let a = vec![1, 2];
    /// let b = vec![3, 4];
    /// let c = concat_vecs(a, b);
    /// assert_eq!(c, vec![1, 2, 3, 4]);
    /// ```
    ///
    /// # Panics
    ///
    /// 本函数不会 panic。
    ///
    /// # Errors
    ///
    /// 本函数不返回 `Result`，因此不会产生错误。
    ///
    /// # Safety
    ///
    /// 本函数完全安全，无需 unsafe。
    pub fn concat_vecs(mut a: Vec<i32>, b: Vec<i32>) -> Vec<i32> {
        a.extend(b);
        a
    }
    
    fn main() {
        let result = concat_vecs(vec![1, 2], vec![3, 4]);
        println!("{:?}", result);
    }
```
常用章节：
章节| 用途  
---|---  
`# Examples`| 代码示例（几乎所有 pub API 都该有）  
`# Panics`| 说明什么情况下会 panic  
`# Errors`| 返回 `Result` 时说明错误类型和原因  
`# Safety`| `unsafe fn` 必须说明调用者的安全不变量  
## 生成和查看文档
```
    # 生成文档，输出到 target/doc/
    cargo doc
    
    # 生成并在浏览器中打开
    cargo doc --open
    
    # 生成时包含私有 item 的文档
    cargo doc --document-private-items
```
`cargo doc` 会在 `target/doc/` 目录下生成完整的 HTML 文档。你可以在 [官方 Rust 文档](<https://doc.rust-lang.org/std/>)上看到标准库的文档效果——这些都是用 `cargo doc` 生成的。
# Doctest
## 什么是 Doctest
文档注释里的代码块不仅是展示用的——`cargo test` 会自动把它们当成测试用例来编译和运行。这叫 **doctest** 。
好处：
  * 文档和测试合二为一，修改 API 时如果忘了更新文档里的示例，测试会失败
  * 文档里的代码示例永远是”能运行的”，不会变成过时的死代码
```
    /// 将摄氏度转换为华氏度。
    ///
    /// # Examples
    ///
    /// ```rust
    /// // 这段代码会被 cargo test 当作测试运行！
    /// assert_eq!(celsius_to_fahrenheit(0.0), 32.0);
    /// assert_eq!(celsius_to_fahrenheit(100.0), 212.0);
    /// ```
    pub fn celsius_to_fahrenheit(c: f64) -> f64 {
        c * 9.0 / 5.0 + 32.0
    }
    
    fn main() {
        println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
    }
```
## 运行 Doctest
```
    # 运行所有测试（包括 doctests、单元测试、集成测试）
    cargo test
    
    # 只运行 doctests
    cargo test --doc
    
    # 运行特定函数的 doctest（按函数名过滤）
    cargo test celsius_to_fahrenheit
```
## 在 Doctest 中隐藏代码
有时候示例需要一些样板代码（`use` 语句、辅助结构体、错误处理等），但这些代码放在文档里会分散注意力。用 `#` 加空格开头的行可以在文档中隐藏，但在 doctest 运行时仍然包含：
```
    /// 解析 JSON 格式的用户数据。
    ///
    /// # Examples
    ///
    /// ```rust
    /// # // 这一行在文档里不显示，但 doctest 运行时包含
    /// # struct User { name: String, age: u32 }
    /// # fn parse_user(s: &str) -> Option<User> {
    /// #     Some(User { name: s.to_string(), age: 18 })
    /// # }
    /// let user = parse_user("Alice");
    /// assert!(user.is_some());
    /// ```
    pub fn demo() {
        println!("演示 doctest 隐藏行");
    }
    
    fn main() {
        demo();
    }
```
> `#` 冲突问题：在 doctest 的**代码块内部** ，\# 是特殊语法（用于隐藏行）。而 Markdown 的 \# 是在代码块外部用于标题。两者的上下文不同，所以不会混淆。
## Doctest 的特殊标记
代码块可以加修饰词来改变 doctest 的行为（如果有写代码不想作为测试的代码，可以使用以下方式）：

```rust,no_run
// no_run：编译但不运行（适合会产生副作用的代码，如网络请求）
let response = http_get("https://example.com").unwrap();
```

```rust,ignore
// ignore：既不编译也不运行（适合伪代码或未完成的示例）
let x = some_function_that_doesnt_exist();
```

```rust,should_panic
// should_panic：期望代码 panic（正确运行反而失败）
let v: Vec<i32> = vec![];
let _ = v[0];  // 越界访问，应该 panic
```

```rust,compile_fail
// compile_fail：期望代码编译失败（展示错误用法）
let s = String::from("hello");
let r1 = &mut s;  // 错误：s 不可变
```
## 跨行示例：? 运算符
`?` 运算符用于错误传播，在 `Result` 或 `Option` 后使用时，如果是 `Err` 或 `None` 就立即返回，否则继续执行。Doctest 里默认没有 `main()` 函数，也没有 `?` 的错误传播上下文。如果示例需要用 `?`，需要用 `#` 隐藏行来提供一个返回 `Result` 的函数作为上下文。这里了解即可。
# 练习题
## 文档注释测验
加载题目中…
加载题目中…
加载题目中…
加载题目中…
加载题目中…