# 综合练习

进阶 ⏱ 30 分钟 所有权移动借用引用切片CopyClone


# 所有权与移动

## 赋值后的 String

```
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}", s1);
}
```

加载题目中…

## 哪些类型是 Copy

加载题目中…

## clone() 做了什么

```
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1={}, s2={}", s1, s2);
}
```

加载题目中…

## 函数消耗所有权

```
fn consume(s: String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let n = consume(s);
    println!("{} {}", n, s);
}
```

加载题目中…

## 变量何时被释放

```
fn main() {
    let x = 5;
    {
        let y = String::from("hello");
        println!("{} {}", x, y);
    }
    println!("{}", x);
}
```

加载题目中…

# 借用与切片

## NLL 与借用范围

```
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2); // r1、r2 最后一次使用在这里

    let r3 = &mut s;
    r3.push_str(" world");
    println!("{}", r3);
}
```

加载题目中…

## 不可变与可变引用共存

```
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;
    let r2 = &mut s;
    println!("{} {}", r1, r2);
}
```

加载题目中…

## 返回局部变量的引用

```
fn make_greeting() -> &String {
    let s = String::from("hello");
    &s
}
```

加载题目中…

## 切片的类型

```
fn main() {
    let s = String::from("hello world");
    let word = &s[6..11];
    println!("{}", word);
}
```

加载题目中…

## &str 还是 &String

加载题目中…

# 编程练习

## 练习 1：修复所有权错误

下面的函数在打印名字后，`main` 中无法再使用 `name`。请修改函数签名（及调用方式），让 `main` 在调用后仍能使用 `name`：

```rust
fn greet(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let name = String::from("Alice");
    greet(name);
    println!("Nice to meet you, {}!", name); // 目前这行会报错
}
```

## 练习 2：修复借用冲突

下面的代码在持有不可变引用时尝试修改字符串，导致编译错误。请在**不删除任何 `println!`** 的前提下，仅调整代码顺序使其通过编译：

```rust
fn main() {
    let mut sentence = String::from("hello");

    let first = &sentence;
    sentence.push_str(" world"); // 错误：存在不可变引用时不能修改

    println!("first snapshot: {}", first);
    println!("full sentence: {}", sentence);
}
```

## 练习 3：实现字符计数函数

请实现 `count_char` 函数，统计字符串中某个字符出现的次数：

```rust
fn count_char(s: &str, target: char) -> usize {
    // TODO：遍历 s 中的每个字符，统计与 target 相等的个数
    0
}

fn main() {
    println!("{}", count_char("hello world", 'l')); // 3
    println!("{}", count_char("rust programming", 'r')); // 3
    println!("{}", count_char("abcabc", 'a'));            // 2
}
```

## 练习 4：修复可变引用错误

下面的函数想通过引用将数值加一，但使用了不可变引用。请修复函数签名和调用处，使程序正确输出：

```rust
fn add_one(n: &i32) {
    *n += 1; // 错误：不能通过不可变引用修改值
}

fn main() {
    let mut count = 0;
    add_one(&count);
    add_one(&count);
    add_one(&count);
    println!("count = {}", count);
}
```

## 练习 5：实现切片最大值函数

请实现 `max_in_slice` 函数，返回整数切片中的最大值。函数应接受任意长度的切片（完整数组或其中一段）：

```rust
fn max_in_slice(numbers: &[i32]) -> i32 {
    // TODO：找出切片中的最大值并返回
    // 提示：可以先假设第一个元素是最大值，然后逐个比较
    0
}

fn main() {
    let arr = [3, 1, 4, 1, 5, 9, 2, 6];
    println!("{}", max_in_slice(&arr));        // 9
    println!("{}", max_in_slice(&arr[..4]));   // 4
    println!("{}", max_in_slice(&arr[4..]));   // 9
}
```
