export interface Lesson {
  id: string;
  number: string;
  title: string;
  level: string;
  duration: string;
  tags: string[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

export const courseData: Chapter[] = [
  {
    id: '00-preface', number: '序', title: '前言', level: '入门', duration: '5 分钟',
    description: '为什么要写这套教程，它和其他 Rust 教程有什么不同，以及你能从中得到什么',
    lessons: [
      { id: '00-index', number: '', title: '前言', level: '入门', duration: '5 分钟', tags: ['前言', '教程简介', '学习方法'] }
    ]
  },
  {
    id: '01-rust-basics', number: '01', title: 'Rust 基础', level: '入门', duration: '15 分钟',
    description: '了解 Rust 语言的核心价值、设计哲学，以及它能解决哪些其他语言长期无法解决的问题',
    lessons: [
      { id: '00-index', number: '', title: 'Rust 基础', level: '入门', duration: '15 分钟', tags: ['Rust简介', '内存安全', '零开销抽象', '系统编程', '并发'] },
      { id: '01-installation', number: '1.1', title: '安装 Rust', level: '入门', duration: '10 分钟', tags: ['rustup', '安装', '工具链', 'cargo', 'rustc', '环境配置'] },
      { id: '02-hello-world', number: '1.2', title: 'Hello, World!', level: '入门', duration: '20 分钟', tags: ['Hello World', 'main函数', 'println!', 'rustc编译', '预编译'] },
      { id: '03-hello-cargo', number: '1.3', title: '使用 Cargo', level: '入门', duration: '20 分钟', tags: ['Cargo', 'cargo new', 'cargo build', 'cargo run', 'cargo check', 'Cargo.toml'] },
      { id: '04-first-taste', number: '1.4', title: '示例：今天是星期几？', level: '入门', duration: '10 分钟', tags: ['初探第一个程序', '日期计算', '星期几'] }
    ]
  },
  {
    id: '02-basic-syntax', number: '02', title: '基础语法', level: '入门', duration: '5 分钟',
    description: '从注释、变量、数据类型到控制流、函数、宏，系统掌握 Rust 程序的基本构成要素。',
    lessons: [
      { id: '00-index', number: '', title: '基础语法', level: '入门', duration: '5 分钟', tags: ['基础语法', '变量', '数据类型', '控制流', '函数', '宏'] },
      { id: '01-comments', number: '2.1', title: '注释', level: '入门', duration: '10 分钟', tags: ['注释', '行注释', '块注释', '文档注释', '///', '//!'] },
      { id: '02-formatted-output', number: '2.2', title: '格式化输出', level: '入门', duration: '20 分钟', tags: ['println!', 'format!', '格式化', '{:?}', 'Debug', '#[derive(Debug)]', '格式规范'] },
      { id: '03-data-types', number: '2.3', title: '基础数据类型', level: '入门', duration: '30 分钟', tags: ['整数类型', '浮点数', 'bool', 'char', '元组', '数组', '类型推断'] },
      { id: '04-variables', number: '2.4', title: '变量与可变性', level: '入门', duration: '25 分钟', tags: ['let', 'mut', 'const', 'shadowing', '遮蔽', '作用域', '变量绑定'] },
      { id: '05-control-flow', number: '2.5', title: '控制流', level: '入门', duration: '30 分钟', tags: ['if', 'else', 'loop', 'while', 'for', '控制流', '循环', '条件分支'] },
      { id: '06-functions', number: '2.6', title: '函数', level: '入门', duration: '20 分钟', tags: ['fn', '函数', '参数', '返回值', '语句', '表达式', 'snake_case'] },
      { id: '07-attributes', number: '2.7', title: '属性', level: '进阶', duration: '35 分钟', tags: ['属性', 'attribute', 'cfg', 'dead_code', 'allow', '条件编译', 'derive'] },
      { id: '08-macros', number: '2.8', title: '声明宏', level: '进阶', duration: '50 分钟', tags: ['macro_rules!', '声明宏', '元变量', '重复模式', '宏卫生性', 'macro_export', '元编程'] },
      { id: '09-practice', number: '2.9', title: '综合练习', level: '进阶', duration: '30 分钟', tags: ['练习', '算法', '斐波那契', '质数', '递归', '排序', '函数'] }
    ]
  },
  {
    id: '03-ownership', number: '03', title: '所有权系统', level: '入门', duration: '5 分钟',
    description: '了解 Rust 所有权的内存模型背景，以及移动、拷贝与克隆三种数据交互方式的本质区别。',
    lessons: [
      { id: '00-index', number: '', title: '所有权系统', level: '入门', duration: '5 分钟', tags: ['所有权', '栈', '堆', '移动', 'Copy', 'Clone', '所有权与函数'] },
      { id: '01-memory-and-move', number: '3.1', title: '内存与数据流动', level: '入门', duration: '20 分钟', tags: ['栈', '堆', '移动', 'Copy', 'Clone', '内存模型'] },
      { id: '02-what-is-ownership', number: '3.2', title: '什么是所有权', level: '进阶', duration: '30 分钟', tags: ['所有权', '作用域', 'String', 'drop', '可变性', 'let mut', '遮蔽'] },
      { id: '03-references-borrowing', number: '3.3', title: '引用与借用', level: '进阶', duration: '40 分钟', tags: ['引用', '借用', '&T', '&mut T', '可变引用', '悬垂引用', '借用检查器', 'NLL'] },
      { id: '04-slices', number: '3.4', title: '切片', level: '进阶', duration: '35 分钟', tags: ['切片', 'slice', '&str', '&[T]', '字符串切片', '数组切片', 'range'] },
      { id: '05-practice', number: '3.5', title: '综合练习', level: '进阶', duration: '30 分钟', tags: ['所有权', '移动', '借用', '引用', '切片', 'Copy', 'Clone'] }
    ]
  },
  {
    id: '04-custom-types', number: '04', title: '自定义数据类型', level: '入门', duration: '5 分钟',
    description: '学习 Rust 的自定义类型系统：结构体、枚举、方法、Option、模式匹配和常量，是面向对象编程的基础。',
    lessons: [
      { id: '00-index', number: '', title: '自定义数据类型', level: '入门', duration: '5 分钟', tags: ['结构体', '枚举', 'Option', '模式匹配', '类型系统'] },
      { id: '01-structs', number: '4.1', title: '结构体', level: '入门', duration: '30 分钟', tags: ['结构体', 'struct', '字段', '实例化', '元组结构体', '类单元结构体'] },
      { id: '02-struct-methods', number: '4.2', title: '方法与关联函数', level: '入门', duration: '25 分钟', tags: ['方法', 'impl', 'self', '关联函数', '接收者'] },
      { id: '03-enums', number: '4.3', title: '枚举', level: '入门', duration: '25 分钟', tags: ['枚举', 'enum', '成员', '变体', '关联数据'] },
      { id: '04-match', number: '4.4', title: '模式匹配与 match 表达式', level: '入门', duration: '30 分钟', tags: ['match', '模式', '穷尽性', '绑定', '通配符'] },
      { id: '05-if-let', number: '4.5', title: 'if let 与 while let', level: '入门', duration: '20 分钟', tags: ['if let', 'while let', '语法糖', '简洁'] },
      { id: '06-option', number: '4.6', title: 'Option<T> 枚举', level: '入门', duration: '20 分钟', tags: ['Option', 'Some', 'None', 'null', '可选值'] },
      { id: '07-constants', number: '4.7', title: '常量与静态变量', level: '入门', duration: '15 分钟', tags: ['const', 'static', '常量', '编译期'] },
      { id: '08-practice', number: '4.8', title: '综合练习', level: '进阶', duration: '35 分钟', tags: ['结构体', '枚举', 'Option', 'match', '综合'] }
    ]
  },
  {
    id: '05-stdlib-types', number: '05', title: '标准库类型', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 最常用的集合类型：Vec<T>、String 和 HashMap，学会安全高效地处理动态数据结构。',
    lessons: [
      { id: '00-index', number: '', title: '标准库类型', level: '入门', duration: '5 分钟', tags: ['向量', '字符串', '哈希表', '集合', '所有权'] },
      { id: '01-vectors', number: '5.1', title: 'Vec<T>——动态数组', level: '入门', duration: '35 分钟', tags: ['向量', 'Vec', '动态数组', '所有权', '借用', '迭代'] },
      { id: '02-strings', number: '5.2', title: 'String 与 &str——Rust 的两种字符串', level: '入门', duration: '35 分钟', tags: ['字符串', 'String', '&str', '字符串切片', '所有权', 'UTF-8', '字符编码'] },
      { id: '03-hashmaps', number: '5.3', title: 'HashMap<K, V>——键值对集合', level: '入门', duration: '40 分钟', tags: ['哈希表', 'HashMap', '键值对', '字典', '所有权', 'entry API', '迭代'] },
      { id: '04-practice', number: '5.4', title: '综合练习', level: '进阶', duration: '50 分钟', tags: ['向量', '字符串', '哈希表', '综合应用', '所有权', '集合'] }
    ]
  },
  {
    id: '06-type-system', number: '06', title: '类型系统', level: '入门', duration: '5 分钟',
    description: '深入掌握 Rust 类型系统：类型推导、转换、别名与 newtype 模式，理解如何用类型本身表达语义约束。',
    lessons: [
      { id: '00-index', number: '', title: '类型系统', level: '入门', duration: '5 分钟', tags: ['类型系统', '类型推导', '类型转换', '类型别名', 'newtype'] },
      { id: '01-type-inference', number: '6.1', title: '类型推导（类型推断）', level: '入门', duration: '20 分钟', tags: ['类型推导', '类型推断', '类型标注', '编译器推理'] },
      { id: '02-type-casting', number: '6.2', title: '类型铸造（as 关键字）', level: '入门', duration: '20 分钟', tags: ['类型转换', '类型铸造', 'as', '转换规则', '溢出'] },
      { id: '03-type-aliases', number: '6.3', title: '类型别名（type）', level: '入门', duration: '10 分钟', tags: ['类型别名', 'type', '别名', '可读性'] },
      { id: '04-newtype-pattern', number: '6.4', title: 'Newtype 模式', level: '入门', duration: '10 分钟', tags: ['newtype', '元组结构体', '类型安全', '类型包装'] }
    ]
  },
  {
    id: '07-modules', number: '07', title: '模块系统', level: '入门', duration: '5 分钟',
    description: 'Rust 模块系统基础：Package、Crate、模块的组织方式，模块树、可见性控制、路径导航、use 关键字的完整讲解。',
    lessons: [
      { id: '00-index', number: '', title: '模块系统', level: '入门', duration: '5 分钟', tags: ['模块系统', 'package', 'crate', 'pub', 'use', '路径'] },
      { id: '01-packages-crates', number: '7.1', title: 'Package 和 Crate', level: '入门', duration: '20 分钟', tags: ['package', 'crate', 'cargo', '项目组织', '二进制', '库'] },
      { id: '02-modules', number: '7.2', title: '模块与可见性', level: '进阶', duration: '35 分钟', tags: ['模块', 'mod', 'pub', '可见性', '私有性', '模块树', '封装'] },
      { id: '03-paths-use', number: '7.3', title: '路径与 use 关键字', level: '进阶', duration: '40 分钟', tags: ['路径', '绝对路径', '相对路径', 'use', 'super', '重导出', 'pub use'] }
    ]
  },
  {
    id: '08-engineering', number: '08', title: '项目工程化', level: '入门', duration: '5 分钟',
    description: '掌握 Cargo 工程化能力：工作空间、条件编译 Features、构建脚本 build.rs 和文档注释，让项目可扩展、可维护。',
    lessons: [
      { id: '00-index', number: '', title: '项目工程化', level: '入门', duration: '5 分钟', tags: ['workspace', 'features', 'build.rs', '文档注释', 'doctest', 'cargo'] },
      { id: '01-workspace', number: '8.1', title: '工作空间', level: '入门', duration: '25 分钟', tags: ['workspace', 'cargo', '多crate', 'monorepo', '共享依赖', 'virtual workspace'] },
      { id: '02-build-scripts', number: '8.2', title: '构建脚本 build.rs', level: '进阶', duration: '35 分钟', tags: ['build.rs', '构建脚本', '代码生成', '原生库', 'OUT_DIR', 'cargo指令'] },
      { id: '03-doc-comments', number: '8.3', title: '文档注释与 doctest', level: '入门', duration: '20 分钟', tags: ['文档注释', 'doctest', '///', '//!', 'cargo doc', 'cargo test'] }
    ]
  },
  {
    id: '09-error-handling', number: '09', title: '错误处理', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 错误处理体系：panic!/Result/?，写出健壮可维护的代码。',
    lessons: [
      { id: '00-index', number: '', title: '错误处理', level: '入门', duration: '5 分钟', tags: ['错误处理', 'panic', 'Result', '?'] },
      { id: '01-panic', number: '9.1', title: 'panic! 与不可恢复错误', level: '入门', duration: '15 分钟', tags: ['panic', '错误处理', 'backtrace', '不可恢复错误', 'index out of bounds'] },
      { id: '02-result', number: '9.2', title: 'Result<T, E>', level: '入门', duration: '20 分钟', tags: ['Result', 'Ok', 'Err', 'unwrap', 'expect', '错误处理', 'match', '错误传播'] },
      { id: '03-question-mark', number: '9.3', title: '? 运算符', level: '入门', duration: '20 分钟', tags: ['? 运算符', '错误传播', 'From', 'Option', 'Result', '错误处理'] },
      { id: '04-when-to-panic', number: '9.4', title: '何时 panic，何时 Result', level: '入门', duration: '20 分钟', tags: ['panic', 'Result', '错误处理策略', '不变量', '类型系统', 'unwrap'] },
      { id: '05-multiple-errors', number: '9.5', title: '多种错误来源与遍历 Result', level: '入门', duration: '20 分钟', tags: ['Box<dyn Error>', '多种错误', 'filter_map', 'collect', 'partition', '遍历Result'] }
    ]
  },
  {
    id: '10-generics-traits', number: '10', title: '泛型与 Trait', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 类型系统的核心机制：泛型消除代码重复，Trait 定义行为契约，两者结合构成 Rust 抽象能力的基础。',
    lessons: [
      { id: '00-index', number: '', title: '泛型与 Trait', level: '入门', duration: '5 分钟', tags: ['泛型', 'trait', 'trait 约束', '关联类型', '单态化', 'impl Trait'] },
      { id: '01-generics-syntax', number: '10.1', title: '泛型语法基础', level: '入门', duration: '20 分钟', tags: ['泛型', 'generics', '类型参数', '单态化', 'monomorphization'] },
      { id: '02-traits', number: '10.2', title: 'Trait：定义共享行为', level: '进阶', duration: '35 分钟', tags: ['trait', 'impl for', 'derive', '运算符重载', '父 trait', '孤儿规则'] },
      { id: '03-trait-bounds', number: '10.3', title: 'Trait 约束与 impl Trait', level: '进阶', duration: '20 分钟', tags: ['trait 约束', 'bounds', 'where 子句', 'impl Trait', '多重约束'] },
      { id: '04-conversion-traits', number: '10.4', title: '转换 Trait', level: '进阶', duration: '30 分钟', tags: ['转换trait', 'From', 'Into', 'TryFrom', 'TryInto', '类型转换'] },
      { id: '05-practice', number: '10.5', title: '综合练习', level: '进阶', duration: '10 分钟', tags: ['泛型', '练习', '综合'] }
    ]
  },
  {
    id: '11-lifetimes', number: '11', title: '生命周期', level: '入门', duration: '5 分钟',
    description: '生命周期是 Rust 最独特的特性之一，它让编译器能够在不需要垃圾回收器的情况下，保证所有引用永远不会成为悬垂指针。',
    lessons: [
      { id: '00-index', number: '', title: '生命周期', level: '入门', duration: '5 分钟', tags: ['生命周期', '借用检查器', '内存安全', '悬垂指针', '省略规则', "'static 生命周期"] },
      { id: '01-what-are-lifetimes', number: '11.1', title: '为什么需要生命周期', level: '进阶', duration: '15 分钟', tags: ['lifetime', '生命周期', '悬垂引用', '借用检查器', 'borrow checker'] },
      { id: '02-lifetime-annotations', number: '11.2', title: '函数中的生命周期', level: '进阶', duration: '25 分钟', tags: ['lifetime annotation', '生命周期标注', '函数', 'lifetime coercion', "'a: 'b"] },
      { id: '03-struct-lifetimes', number: '11.3', title: '结构体中的生命周期', level: '进阶', duration: '30 分钟', tags: ['struct lifetime', '结构体生命周期', 'impl', '方法', 'T: \'a', 'trait'] },
      { id: '04-lifetime-elision', number: '11.4', title: '省略规则与 \'static', level: '进阶', duration: '20 分钟', tags: ['lifetime elision', '生命周期省略', 'static', "'static", '省略规则'] },
      { id: '05-practice', number: '11.5', title: '综合练习', level: '进阶', duration: '20 分钟', tags: ['lifetime', '生命周期', '练习', '综合练习', '编程练习'] }
    ]
  },
  {
    id: '12-closures-iterators', number: '12', title: '闭包与迭代器', level: '入门', duration: '5 分钟',
    description: '闭包让你捕获上下文、传递行为；迭代器让你惰性处理序列——两者配合构成 Rust 函数式编程的核心',
    lessons: [
      { id: '00-index', number: '', title: '闭包与迭代器', level: '入门', duration: '5 分钟', tags: ['闭包', '迭代器', 'Fn', 'Iterator', 'map', 'filter', '零开销抽象'] },
      { id: '01-closures', number: '12.1', title: '闭包语法与捕获', level: '进阶', duration: '20 分钟', tags: ['closure', '闭包', '捕获', 'move', 'FnOnce', '捕获环境'] },
      { id: '02-fn-traits', number: '12.2', title: 'Fn trait 与闭包的高阶用法', level: '进阶', duration: '20 分钟', tags: ['Fn', 'FnMut', 'FnOnce', '闭包参数', 'impl Fn', '高阶函数'] },
      { id: '03-iterators', number: '12.3', title: '迭代器基础', level: '进阶', duration: '40 分钟', tags: ['迭代器', 'Iterator', 'next', 'iter', 'into_iter', '惰性求值', '自定义迭代器'] },
      { id: '04-adaptors', number: '12.4', title: '适配器', level: '进阶', duration: '40 分钟', tags: ['消费适配器', '迭代器适配器', 'map', 'filter', 'collect', 'fold', 'zip', 'enumerate', 'Iterator'] },
      { id: '05-practice', number: '12.5', title: '综合练习', level: '进阶', duration: '10 分钟', tags: ['Iterator', '闭包', 'filter', 'map', 'collect', '综合练习'] }
    ]
  },
  {
    id: '13-smart-pointers', number: '13', title: '智能指针', level: '入门', duration: '5 分钟',
    description: '深入理解 Rust 的内存管理机制，掌握 Box、Rc、RefCell 等核心智能指针的使用场景与底层原理。',
    lessons: [
      { id: '00-index', number: '', title: '智能指针', level: '入门', duration: '5 分钟', tags: ['智能指针', 'Box', 'Rc', 'RefCell', 'Deref', 'Drop', '所有权', '堆内存'] },
      { id: '01-box', number: '13.1', title: 'Box<T>：堆内存分配', level: '进阶', duration: '20 分钟', tags: ['Box', '堆分配', '递归类型', 'cons list', '所有权'] },
      { id: '02-deref-drop', number: '13.2', title: 'Deref 与 Drop：智能指针的两翼', level: '进阶', duration: '30 分钟', tags: ['Deref', 'Drop', '解引用', '解引用强制转换', 'RAII', '析构'] },
      { id: '03-rc', number: '13.3', title: 'Rc<T>：引用计数与共享所有权', level: '进阶', duration: '20 分钟', tags: ['Rc', '引用计数', '共享所有权', '单线程', 'strong_count'] },
      { id: '04-refcell', number: '13.4', title: 'RefCell<T> 与内部可变性', level: '进阶', duration: '25 分钟', tags: ['RefCell', '内部可变性', '运行时借用检查', 'Rc<RefCell<T>>'] }
    ]
  },
  {
    id: '14-concurrency', number: '14', title: '并发编程', level: '入门', duration: '5 分钟',
    description: '探索 Rust 的无畏并发：从多线程基础到消息传递与共享状态。',
    lessons: [
      { id: '00-index', number: '', title: '并发编程', level: '入门', duration: '5 分钟', tags: ['并发', '多线程', 'Arc', 'Mutex', 'Channels', '线程安全'] },
      { id: '01-threads', number: '14.1', title: '线程', level: '进阶', duration: '25 分钟', tags: ['线程', 'thread::spawn', 'JoinHandle', 'move 闭包', '并发'] },
      { id: '02-channels', number: '14.2', title: '消息传递', level: '进阶', duration: '20 分钟', tags: ['通道', 'mpsc', '消息传递', '发送者', '接收者', '并发'] },
      { id: '03-shared-state', number: '14.3', title: '共享状态', level: '进阶', duration: '30 分钟', tags: ['Mutex', 'Arc', '共享状态', '互斥锁', '原子引用计数', '线程安全'] },
      { id: '04-sync-send', number: '14.4', title: 'Send 与 Sync', level: '进阶', duration: '20 分钟', tags: ['Send', 'Sync', '标记trait', '线程安全', 'Arc', 'Rc'] }
    ]
  },
  {
    id: '15-testing', number: '15', title: '测试', level: '入门', duration: '5 分钟',
    description: '掌握 Rust 测试体系：从编写单元测试、控制测试运行方式，到组织集成测试。',
    lessons: [
      { id: '00-index', number: '', title: '测试', level: '入门', duration: '5 分钟', tags: ['测试', '单元测试', '集成测试', 'cargo test', 'assert', 'should_panic'] },
      { id: '01-unit-tests', number: '15.1', title: '编写单元测试', level: '入门', duration: '20 分钟', tags: ['单元测试', '#[test]', 'assert!', 'assert_eq!', 'should_panic', 'cargo test'] },
      { id: '02-test-control', number: '15.2', title: '控制测试运行', level: '入门', duration: '15 分钟', tags: ['cargo test', '测试过滤', '并行测试', 'ignore', 'show-output', 'test-threads'] },
      { id: '03-integration-tests', number: '15.3', title: '集成测试', level: '入门', duration: '15 分钟', tags: ['集成测试', 'tests/', '共享模块', '测试组织'] }
    ]
  },
  {
    id: '16-debugging', number: '16', title: '调试', level: '入门', duration: '5 分钟',
    description: '学习 Rust 调试技巧：dbg! 宏、IDE 调试器、日志输出等工具的使用。',
    lessons: [
      { id: '00-index', number: '', title: '调试', level: '入门', duration: '5 分钟', tags: ['调试', 'dbg!', '调试器', '日志', 'log', 'env_logger'] },
      { id: '01-dbg-macro', number: '16.1', title: 'dbg! 宏：快速打印调试', level: '入门', duration: '15 分钟', tags: ['dbg!', '打印调试', '调试宏', 'stdout'] },
      { id: '02-ide-debugger', number: '16.2', title: 'IDE 调试器（rust-analyzer）', level: '进阶', duration: '30 分钟', tags: ['IDE', '调试器', 'rust-analyzer', '断点', '调试'] },
      { id: '03-logging', number: '16.3', title: '日志输出（log + env_logger）', level: '进阶', duration: '25 分钟', tags: ['log', 'env_logger', '日志', '日志级别', 'tracing'] }
    ]
  },
  {
    id: '17-methodology', number: '17', title: '开发方法论', level: '入门', duration: '5 分钟',
    description: '学习 Rust 项目开发最佳实践：架构设计、TDD、代码质量、CI/CD 和性能分析。',
    lessons: [
      { id: '00-index', number: '', title: '开发方法论', level: '入门', duration: '5 分钟', tags: ['架构设计', 'TDD', 'Clippy', 'rustfmt', 'CI/CD', '性能分析'] },
      { id: '01-architecture', number: '17.1', title: 'Rust 工程架构设计', level: '进阶', duration: '30 分钟', tags: ['架构', '项目结构', '模块化', '分层架构'] },
      { id: '02-coding-flow', number: '17.2', title: '编码流程与 TDD', level: '进阶', duration: '25 分钟', tags: ['TDD', '测试驱动开发', '编码流程', '重构'] },
      { id: '03-lint', number: '17.3', title: '代码质量：Lint、Clippy 与 rustfmt', level: '入门', duration: '25 分钟', tags: ['Clippy', 'rustfmt', 'lint', '代码格式', '代码规范'] },
      { id: '04-ci', number: '17.4', title: '持续集成与依赖管理', level: '进阶', duration: '30 分钟', tags: ['CI/CD', 'GitHub Actions', '依赖管理', 'cargo audit', '依赖更新'] },
      { id: '05-profiling', number: '17.5', title: '性能分析与基准测试', level: '进阶', duration: '35 分钟', tags: ['基准测试', '性能分析', 'flamegraph', 'criterion', 'perf'] }
    ]
  },
  {
    id: '18-unsafe', number: '18', title: '不安全 Rust', level: '入门', duration: '5 分钟',
    description: '学习 unsafe Rust 的使用场景：裸指针、unsafe 函数与 trait，以及安全抽象原则。',
    lessons: [
      { id: '00-index', number: '', title: '不安全 Rust', level: '入门', duration: '5 分钟', tags: ['unsafe', '裸指针', 'unsafe trait', '安全抽象', 'FFI'] },
      { id: '01-unsafe', number: '18.1', title: 'unsafe 块与超能力', level: '进阶', duration: '20 分钟', tags: ['unsafe', 'unsafe 块', 'unsafe 能力'] },
      { id: '02-raw-pointers', number: '18.2', title: '裸指针', level: '进阶', duration: '25 分钟', tags: ['*const T', '*mut T', '裸指针', '指针操作'] },
      { id: '03-unsafe-functions', number: '18.3', title: 'unsafe 函数与 Trait', level: '进阶', duration: '25 分钟', tags: ['unsafe fn', 'unsafe trait', 'unsafe impl'] },
      { id: '04-safe-abstractions', number: '18.4', title: '安全抽象', level: '进阶', duration: '30 分钟', tags: ['安全抽象', '封装 unsafe', 'API 设计'] }
    ]
  },
  {
    id: '19-c-interop', number: '19', title: '与 C 语言交互', level: '入门', duration: '5 分钟',
    description: '学习 Rust 与 C 语言的互操作：FFI 基础、bindgen、cbindgen 和混合编译。',
    lessons: [
      { id: '00-index', number: '', title: '与 C 语言交互', level: '入门', duration: '5 分钟', tags: ['FFI', 'C 交互', 'bindgen', 'cbindgen', '混合编译'] },
      { id: '01-ffi-basics', number: '19.1', title: 'FFI 基础', level: '进阶', duration: '25 分钟', tags: ['FFI', 'extern "C"', 'C ABI', 'C 函数调用'] },
      { id: '02-bindgen', number: '19.2', title: '自动生成绑定：bindgen', level: '进阶', duration: '30 分钟', tags: ['bindgen', 'C 绑定生成', '自动绑定'] },
      { id: '03-cbindgen', number: '19.3', title: '暴露 Rust 给 C：cbindgen', level: '进阶', duration: '30 分钟', tags: ['cbindgen', 'Rust 暴露', 'C 头文件生成'] },
      { id: '04-mixed-build', number: '19.4', title: '静态混合编译：Rust 与 C 的深度链接', level: '进阶', duration: '35 分钟', tags: ['混合编译', '静态链接', 'cc crate', 'build.rs'] }
    ]
  },
  {
    id: '20-embedded', number: '20', title: '嵌入式 Rust', level: '入门', duration: '5 分钟',
    description: '探索嵌入式 Rust 开发：no_std、内存布局、PAC/HAL、中断处理与 Embassy 框架。',
    lessons: [
      { id: '00-index', number: '', title: '嵌入式 Rust', level: '入门', duration: '5 分钟', tags: ['嵌入式', 'no_std', 'PAC', 'HAL', 'Embassy', '中断'] },
      { id: '01-no-std-basics', number: '20.1', title: '裸机开发基础：no_std 环境', level: '进阶', duration: '25 分钟', tags: ['no_std', '裸机', '嵌入式', 'core crate', 'alloc crate'] },
      { id: '02-memory-layout', number: '20.2', title: '内存布局与链接脚本', level: '进阶', duration: '30 分钟', tags: ['内存布局', '链接脚本', 'linker.x', '内存映射'] },
      { id: '03-hardware-abstraction', number: '20.3', title: '硬件抽象：PAC 与 HAL', level: '进阶', duration: '30 分钟', tags: ['PAC', 'HAL', 'svd2rust', 'embedded-hal'] },
      { id: '04-interrupts-concurrency', number: '20.4', title: '中断与并发安全', level: '进阶', duration: '35 分钟', tags: ['中断', 'interrupt', '临界区', 'RTIC', '并发安全'] },
      { id: '05-async-embassy', number: '20.5', title: '异步嵌入式：Embassy 框架', level: '进阶', duration: '40 分钟', tags: ['Embassy', '异步', 'async/await', '嵌入式异步'] },
      { id: '06-toolchain-debug', number: '20.6', title: '实战演练：简易内核实验', level: '进阶', duration: '50 分钟', tags: ['内核', '实战', '裸机编程', '完整项目'] }
    ]
  },
  {
    id: '21-proc-macros', number: '21', title: '过程宏', level: '入门', duration: '5 分钟',
    description: '学习 Rust 过程宏：自定义 derive、属性宏、函数宏，以及 syn/quote 的使用。',
    lessons: [
      { id: '00-index', number: '', title: '过程宏', level: '入门', duration: '5 分钟', tags: ['过程宏', 'proc macro', 'derive', '属性宏', '函数宏', 'syn', 'quote'] },
      { id: '01-proc-macro-basics', number: '21.1', title: '过程宏基础', level: '进阶', duration: '25 分钟', tags: ['proc macro', 'proc-macro crate', 'TokenStream', '过程宏入门'] },
      { id: '02-derive-macros', number: '21.2', title: '自定义 derive 宏', level: '进阶', duration: '35 分钟', tags: ['#[derive(...)]', '自定义 derive', 'proc-macro-derive'] },
      { id: '03-attribute-macros', number: '21.3', title: '类属性宏', level: '进阶', duration: '30 分钟', tags: ['属性宏', '#[attr]', 'proc-macro-attribute'] },
      { id: '04-function-like-macros', number: '21.4', title: '类函数宏', level: '进阶', duration: '30 分钟', tags: ['函数宏', 'macro!', 'proc-macro'] },
    ]
  },
  {
    id: '22-advanced', number: '22', title: '高级特性', level: '入门', duration: '5 分钟',
    description: '深入探索 Rust 高级特性：关联类型、dyn Trait、高级类型、异步编程基础等。',
    lessons: [
      { id: '00-index', number: '', title: '高级特性', level: '入门', duration: '5 分钟', tags: ['关联类型', 'dyn Trait', '异步', '高级模式匹配'] },
      { id: '01-associated-types', number: '22.1', title: '关联类型', level: '进阶', duration: '25 分钟', tags: ['关联类型', 'trait 关联类型', 'Iterator::Item'] },
      { id: '02-dyn-trait', number: '22.2', title: 'dyn Trait：动态分发', level: '进阶', duration: '30 分钟', tags: ['dyn Trait', '动态分发', 'trait 对象', 'vtable'] },
      { id: '03-async-basics', number: '22.3', title: '异步编程', level: '进阶', duration: '40 分钟', tags: ['异步', 'async/await', 'Future', 'tokio', 'async-std'] },
      { id: '04-advanced-patterns', number: '22.4', title: '模式匹配进阶', level: '进阶', duration: '25 分钟', tags: ['高级模式匹配', '@ 绑定', '模式守卫', 'ref 模式'] }
    ]
  },
  {
    id: '23-projects', number: '23', title: '综合项目', level: '入门', duration: '5 分钟',
    description: '通过完整项目实战，将所有 Rust 知识融会贯通：从命令行参数解析到数据模型，从命令分发到数据持久化。',
    lessons: [
      { id: '00-index', number: '', title: '综合项目', level: '入门', duration: '5 分钟', tags: ['项目实战', 'CLI', 'Todo', '命令行', '文档', 'Rust 综合'] },
      { id: '01-project-design', number: '23.1', title: '项目架构', level: '进阶', duration: '15 分钟', tags: ['项目架构', 'workspace', 'lib crate', 'bin crate', '设计思路', '分层'] },
      { id: '02-parsing', number: '23.2', title: '解析命令行参数', level: '进阶', duration: '25 分钟', tags: ['命令行参数', '枚举', '模式匹配', 'args', 'Result', 'lib.rs'] },
      { id: '03-data-modeling', number: '23.3', title: '数据建模', level: '进阶', duration: '30 分钟', tags: ['数据建模', '结构体', 'Vec', 'TDD', '方法签名', 'impl'] },
      { id: '04-implementing', number: '23.4', title: '实现 TodoList', level: '进阶', duration: '35 分钟', tags: ['TDD', '测试驱动', 'impl', '迭代器', '命令分发', 'run函数'] },
      { id: '05-connecting', number: '23.5', title: '接入 run 函数', level: '进阶', duration: '20 分钟', tags: ['命令分发', 'run函数', 'execute', 'TDD', 'cargo run'] },
      { id: '06-persistence', number: '23.6', title: '数据持久化', level: '进阶', duration: '30 分钟', tags: ['持久化', 'serde_json', '文件读写', 'JSON', '错误处理', 'PathBuf'] },
      { id: '07-polish', number: '23.7', title: '体验优化', level: '进阶', duration: '30 分钟', tags: ['体验优化', '错误信息', 'format', '对齐', 'Display', 'crossterm', '彩色输出'] },
      { id: '08-documentation', number: '23.8', title: '生成文档', level: '进阶', duration: '20 分钟', tags: ['文档', 'rustdoc', 'cargo doc', '文档测试', 'doc comments'] }
    ]
  }
];

export function getAllLessons(): { chapterId: string; lesson: Lesson }[] {
  const result: { chapterId: string; lesson: Lesson }[] = [];
  for (const ch of courseData) {
    for (const ls of ch.lessons) {
      result.push({ chapterId: ch.id, lesson: ls });
    }
  }
  return result;
}

export function getChapterById(id: string): Chapter | undefined {
  return courseData.find(c => c.id === id);
}
