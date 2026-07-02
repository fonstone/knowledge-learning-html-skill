# 代码判断题
## 题目 1：向量与所有权
```
    fn main() {
        let mut vec = vec![1, 2, 3];
        let first = &vec[0];
    
        vec.push(4);
    
        println!("{}", first);
    }
```
加载题目中…
## 题目 2：String 与 &str 的区别
```
    fn modify_string(s: &mut String) {
        s.push_str("!");
    }
    
    fn main() {
        let s = "Hello";
        modify_string(s);
    }
```
加载题目中…
## 题目 3：HashMap 的所有权转移
```
    use std::collections::HashMap;
    
    fn main() {
        let mut map = HashMap::new();
        let key = String::from("name");
    
        map.insert(key, "Alice");
    
        println!("{}", key);
    }
```
加载题目中…
## 题目 4：向量的迭代与修改
```
    fn main() {
        let mut vec = vec![1, 2, 3];
    
        for val in &vec {
            if *val == 2 {
                vec.push(4);
            }
        }
    }
```
加载题目中…
## 题目 5：字符串查找
```
    fn main() {
        let s = String::from("hello");
        let sub = "ll";
    
        if s.contains(sub) {
            println!("找到了");
        }
    }
```
加载题目中…
* * *
# 编程练习
## 练习 1：向量去重
从一个向量中移除所有重复的元素，保留第一次出现的值。
**任务：**
  * 实现 `deduplicate()` 函数，接收 `Vec<i32>`，返回去重后的新向量
  * 只保留每个值的第一次出现


**格式要求：**
  * 输入：`[1, 2, 2, 3, 1, 4, 3]`
  * 输出：`[1, 2, 3, 4]`


**提示：**
  * 可以创建一个新的空向量
  * 遍历原向量，检查元素是否已在结果向量中
  * `vec.contains(&x)` 可以检查是否存在
```
    fn deduplicate(vec: Vec<i32>) -> Vec<i32> {
        // TODO: 创建结果向量，遍历原向量去重
        Vec::new()
    }
    
    fn main() {
        let nums = vec![1, 2, 2, 3, 1, 4, 3];
        let result = deduplicate(nums);
        println!("{:?}", result);
    }
```
## 练习 2：单词频率统计
统计文本中每个单词出现的次数，输出频率最高的单词。
**任务：**
  * 实现 `most_frequent_word()` 函数，接收 `&str`
  * 返回出现次数最多的单词和出现次数
  * 格式：`"{word}" 出现了 {count} 次`
  * 假设单词用空格分隔


**格式要求：**
  * 输入：`"the cat and the dog and the bird"`
  * 输出：`"the" 出现了 3 次`


**提示：**
  * 用 `split_whitespace()` 方法分割单词
  * 使用 HashMap 存储单词计数
  * 使用 `entry().and_modify().or_insert()` 更新计数
  * 找出最大值
```
    use std::collections::HashMap;
    
    fn most_frequent_word(text: &str) -> String {
        // TODO: 统计单词频率，返回频率最高的单词
        String::new()
    }
    
    fn main() {
        let text = "the cat and the dog and the bird";
        println!("{}", most_frequent_word(text));
    }
```