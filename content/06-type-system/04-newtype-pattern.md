# Newtype 模式
## 相同类型，不同语义
考虑一个简单场景：你的程序需要处理距离，有时是米，有时是厘米。两者的底层值都是 `f64`，但混用会出大问题：
```
    fn add_lengths(a: f64, b: f64) -> f64 {
        a + b
    }
    
    fn main() {
        let distance_m = 1.5;
        let distance_cm = 150.0;
    
        // 能编译，但语义是错的：1.5 米 + 150 厘米 ≠ 151.5 米
        let total = add_lengths(distance_m, distance_cm);
        println!("total = {}", total); // 151.5，完全错误
    }
```
编译器毫无怨言地接受了这个错误——因为它们都是 `f64`，无法区分。
**Newtype 模式** 的核心思路：把底层类型包裹在一个**单字段元组结构体** 里，让它成为一个新类型：
```
    struct Meters(f64);
    struct Centimeters(f64);
    
    fn add_meters(a: Meters, b: Meters) -> Meters {
        Meters(a.0 + b.0)
    }
    
    fn main() {
        let distance_m = Meters(1.5);
        let distance_cm = Centimeters(150.0);
    
        add_meters(distance_m, distance_cm); // 编译错误！类型不匹配
    }
```
> 错误被提前到了编译期，代码运行之前就被阻止了。
## 定义和访问内部值
Newtype 就是一个**元组结构体** ，语法极简：
```
    struct Meters(f64);
    
    fn main() {
        let m = Meters(42.0);
    
        // 用 .0 访问内部值（元组结构体第一个字段）
        println!("距离：{} 米", m.0);
    
        // 也可以解构
        let Meters(value) = m;
        println!("值：{}", value);
    }
```
## 为 newtype 实现方法
Newtype 是完整的类型，可以为它实现任何方法：
```
    use std::fmt;
    
    struct Meters(f64);
    struct Centimeters(f64);
    
    impl Meters {
        fn to_centimeters(&self) -> Centimeters {
            Centimeters(self.0 * 100.0)
        }
    }
    
    impl Centimeters {
        fn to_meters(&self) -> Meters {
            Meters(self.0 / 100.0)
        }
    }
    
    impl fmt::Display for Meters {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "{} m", self.0)
        }
    }
    
    impl fmt::Display for Centimeters {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "{} cm", self.0)
        }
    }
    
    fn main() {
        let d = Meters(1.5);
        println!("{}", d);                              // 1.5 m
        println!("{}", d.to_centimeters());             // 150 cm
        println!("{}", d.to_centimeters().to_meters()); // 1.5 m
    }
```
## 零开销保证
Newtype 包装在运行时**完全没有开销** 。
`struct Meters(f64)` 在内存中和裸 `f64` 布局完全相同，没有额外字段或指针。这个”包装”只存在于编译期的类型检查阶段，机器码层面编译器直接操作内部的 `f64`。
# 练习题
## Newtype 测验
加载题目中…
```
    struct UserId(u64);
    struct PostId(u64);
    
    fn get_user(id: UserId) -> String {
        format!("用户 #{}", id.0)
    }
```
加载题目中…
加载题目中…
## 编程练习
下面的代码用裸 `u64` 表示两种 ID，导致 `validate_user(session_id)` 能通过编译。请用 newtype 模式定义 `UserId` 和 `SessionId`，让最后一行产生编译错误。
```
    // TODO: 把下面两行改成 newtype 定义
    type UserId = u64;
    type SessionId = u64;
    
    fn validate_user(id: UserId) -> bool {
        id > 0
    }
    
    fn validate_session(id: SessionId) -> bool {
        id > 1000
    }
    
    fn main() {
        let uid = UserId(42);       // 改完后这里能用
        let sid = SessionId(9001);
    
        println!("用户有效: {}", validate_user(uid));
        println!("会话有效: {}", validate_session(sid));
    
        // 改完后取消注释，应该编译失败：
        // validate_user(sid);
    }
```