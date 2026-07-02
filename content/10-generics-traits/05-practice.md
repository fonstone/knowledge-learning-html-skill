# 综合判断题

## 泛型语法测验

加载题目中…

```rust
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self { Stack { items: Vec::new() } }
    fn push(&mut self, item: T) { self.items.push(item); }
    fn pop(&mut self) -> Option<T> { self.items.pop() }
    fn is_empty(&self) -> bool { self.items.is_empty() }
}
```

加载题目中…

加载题目中…

加载题目中…

# 编程练习

## 练习一：泛型栈

下面是一个只能存 `i32` 的栈，实现已经完整。请把它改成泛型版本 `Stack<T>`，让它能存任意类型：

```rust
// TODO: 把 i32 换成泛型参数 T
struct Stack {
    items: Vec<i32>,
}

impl Stack {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: i32) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&i32> {
        self.items.last()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

fn main() {
    // 改完后这两段代码都应该能编译运行
    let mut int_stack: Stack<i32> = Stack::new();
    int_stack.push(1);
    int_stack.push(2);
    int_stack.push(3);
    println!("栈顶: {:?}", int_stack.peek()); // Some(3)
    println!("弹出: {:?}", int_stack.pop());  // Some(3)

    let mut str_stack: Stack<&str> = Stack::new();
    str_stack.push("hello");
    str_stack.push("world");
    println!("栈顶: {:?}", str_stack.peek()); // Some("world")
    println!("空栈: {}", int_stack.is_empty()); // false
}
```

## 练习二：泛型键值对

实现一个 `KeyValue<K, V>` 结构，存储一个键值对，并为它实现 `swap` 方法，返回键值互换后的新 `KeyValue<V, K>`。

```rust
struct KeyValue<K, V> {
    // TODO
}

impl<K, V> KeyValue<K, V> {
    fn new(key: K, value: V) -> Self {
        todo!()
    }

    fn swap(self) -> KeyValue<V, K> {
        todo!()
    }
}

fn main() {
    let pair = KeyValue::new("name", 42);
    println!("key={}, value={}", pair.key, pair.value); // key=name, value=42

    let swapped = pair.swap();
    println!("key={}, value={}", swapped.key, swapped.value); // key=42, value=name
}
```