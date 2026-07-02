# match 表达式的威力

`match` 是 Rust 中最强大的控制流构造，它结合了 C 的 `switch` 和模式匹配的强大功能。（上一节你可能已经看到了如何使用，本篇文章我们将深入一些细节）

基本思想：

1. 比较一个值与一系列模式
1. 执行与第一个匹配的模式对应的代码
1. 编译器强制检查所有可能的情况

## 基本 match 语法

<div class="code-runner" data-full-code="enum%20Coin%20%7B%0A%20%20%20%20Penny%2C%0A%20%20%20%20Nickel%2C%0A%20%20%20%20Dime%2C%0A%20%20%20%20Quarter%2C%0A%7D%0A%0Afn%20value_in_cents(coin%3A%20Coin)%20-%3E%20u32%20%7B%0A%20%20%20%20match%20coin%20%7B%0A%20%20%20%20%20%20%20%20Coin%3A%3APenny%20%3D%3E%201%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3ANickel%20%3D%3E%205%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3ADime%20%3D%3E%2010%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3AQuarter%20%3D%3E%2025%2C%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22Penny%20%E4%BB%B7%E5%80%BC%20%7B%7D%20%E7%BE%8E%E5%88%86%22%2C%20value_in_cents(Coin%3A%3APenny))%3B%0A%20%20%20%20println!(%22Quarter%20%E4%BB%B7%E5%80%BC%20%7B%7D%20%E7%BE%8E%E5%88%86%22%2C%20value_in_cents(Coin%3A%3AQuarter))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Coin</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Penny</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Nickel</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Dime</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Quarter</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> value_in_cents</span><span style="color:#E1E4E8">(coin</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Coin</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> coin {</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Penny</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Nickel</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Dime</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Quarter</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> 25</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Penny 价值 {} 美分"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">value_in_cents</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Penny</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Quarter 价值 {} 美分"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">value_in_cents</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Quarter</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**结构：**

- match 表达式 { ... } — 要匹配的值放在 match 后
- 每个分支： 模式 => 代码
- 分支间用逗号分隔
- 多行代码用大括号： 模式 => { ... }

# 绑定匹配值中的数据

枚举成员常包含数据，`match` 可以解构这些数据：

<div class="code-runner" data-full-code="enum%20UsState%20%7B%0A%20%20%20%20Alabama%2C%0A%20%20%20%20Alaska%2C%0A%20%20%20%20Arizona%2C%0A%7D%0A%0Aenum%20Coin%20%7B%0A%20%20%20%20Penny%2C%0A%20%20%20%20Nickel%2C%0A%20%20%20%20Dime%2C%0A%20%20%20%20Quarter(UsState)%2C%0A%7D%0A%0Afn%20describe_coin(coin%3A%20Coin)%20-%3E%20String%20%7B%0A%20%20%20%20match%20coin%20%7B%0A%20%20%20%20%20%20%20%20Coin%3A%3APenny%20%3D%3E%20String%3A%3Afrom(%22%E9%97%AA%E9%97%AA%E5%8F%91%E5%85%89%E7%9A%84%E4%BE%BF%E5%A3%AB%22)%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3ANickel%20%3D%3E%20String%3A%3Afrom(%22%E9%95%8D%E5%B8%81%22)%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3ADime%20%3D%3E%20String%3A%3Afrom(%22%E5%8D%81%E7%BE%8E%E5%88%86%E7%A1%AC%E5%B8%81%22)%2C%0A%20%20%20%20%20%20%20%20Coin%3A%3AQuarter(state)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20format!(%22%E6%9D%A5%E8%87%AA%20%7B%3A%3F%7D%20%E7%9A%84%2025%20%E7%BE%8E%E5%88%86%E7%A1%AC%E5%B8%81%22%2C%20state)%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20coin%20%3D%20Coin%3A%3AQuarter(UsState%3A%3AAlaska)%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20describe_coin(coin))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> UsState</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Alabama</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Alaska</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Arizona</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Coin</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Penny</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Nickel</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Dime</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Quarter</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">UsState</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> describe_coin</span><span style="color:#E1E4E8">(coin</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Coin</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> coin {</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Penny</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"闪闪发光的便士"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Nickel</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"镍币"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Dime</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"十美分硬币"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Quarter</span><span style="color:#E1E4E8">(state) </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            format!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"来自 {:?} 的 25 美分硬币"</span><span style="color:#E1E4E8">, state)</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> coin </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Coin</span><span style="color:#F97583">::</span><span style="color:#B392F0">Quarter</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">UsState</span><span style="color:#F97583">::</span><span style="color:#B392F0">Alaska</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">describe_coin</span><span style="color:#E1E4E8">(coin));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

当匹配 `Quarter(state)` 时，`state` 被**绑定**到内部的 `UsState` 值。

# 穷尽性与模式匹配

`match` 的核心是两个特性：**穷尽性检查**（所有情况都必须处理）和**灵活的模式**（提取或忽略你关心的部分）。

## 穷尽性检查：必须处理所有情况

`match` 必须覆盖所有可能的情况，否则编译失败：

<div class="code-runner" data-full-code="enum%20TrafficLight%20%7B%0A%20%20%20%20Red%2C%0A%20%20%20%20Yellow%2C%0A%20%20%20%20Green%2C%0A%7D%0A%0Afn%20check_light(light%3A%20TrafficLight)%20%7B%0A%20%20%20%20match%20light%20%7B%0A%20%20%20%20%20%20%20%20TrafficLight%3A%3ARed%20%3D%3E%20println!(%22%E5%81%9C%E6%AD%A2%22)%2C%0A%20%20%20%20%20%20%20%20TrafficLight%3A%3AYellow%20%3D%3E%20println!(%22%E5%87%86%E5%A4%87%22)%2C%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%EF%BC%9A%E7%BC%BA%E5%B0%91%20Green%20%E5%88%86%E6%94%AF%0A%20%20%20%20%7D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> TrafficLight</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Red</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Yellow</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Green</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> check_light</span><span style="color:#E1E4E8">(light</span><span style="color:#F97583">:</span><span style="color:#B392F0"> TrafficLight</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> light {</span></span>
<span class="line"><span style="color:#B392F0">        TrafficLight</span><span style="color:#F97583">::</span><span style="color:#B392F0">Red</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"停止"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">        TrafficLight</span><span style="color:#F97583">::</span><span style="color:#B392F0">Yellow</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"准备"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#6A737D">        // 编译错误：缺少 Green 分支</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器会明确告诉你哪个情况被遗漏。这防止了难以追踪的逻辑 bug。

## 用 catch-all 模式满足穷尽性

当有很多情况但你只关心其中几个时，用 `_` 或变量名作为 catch-all 模式来处理其他所有情况：

### 方案一：用 `_` 丢弃其他值

<div class="code-runner" data-full-code="fn%20describe_number(n%3A%20u8)%20%7B%0A%20%20%20%20match%20n%20%7B%0A%20%20%20%20%20%20%20%200%20%3D%3E%20println!(%22%E9%9B%B6%22)%2C%0A%20%20%20%20%20%20%20%201%20%3D%3E%20println!(%22%E4%B8%80%22)%2C%0A%20%20%20%20%20%20%20%202%20%3D%3E%20println!(%22%E4%BA%8C%22)%2C%0A%20%20%20%20%20%20%20%20_%20%3D%3E%20println!(%22%E5%85%B6%E4%BB%96%E6%95%B0%E5%AD%97%22)%2C%20%20%2F%2F%20%E6%BB%A1%E8%B6%B3%E7%A9%B7%E5%B0%BD%E6%80%A7%EF%BC%8C%E4%BD%86%E4%B8%8D%E4%BD%BF%E7%94%A8%E5%80%BC%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20describe_number(0)%3B%0A%20%20%20%20describe_number(5)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> describe_number</span><span style="color:#E1E4E8">(n</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> n {</span></span>
<span class="line"><span style="color:#79B8FF">        0</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"零"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#79B8FF">        1</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"一"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#79B8FF">        2</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"二"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        _ </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"其他数字"</span><span style="color:#E1E4E8">),  </span><span style="color:#6A737D">// 满足穷尽性，但不使用值</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    describe_number</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    describe_number</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 方案二：用变量名捕获其他值

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20let%20dice_roll%20%3D%209%3B%0A%0A%20%20%20%20match%20dice_roll%20%7B%0A%20%20%20%20%20%20%20%203%20%3D%3E%20println!(%22%E5%8A%A0%E5%B8%BD%E5%AD%90%22)%2C%0A%20%20%20%20%20%20%20%207%20%3D%3E%20println!(%22%E7%A7%BB%E9%99%A4%E5%B8%BD%E5%AD%90%22)%2C%0A%20%20%20%20%20%20%20%20other%20%3D%3E%20println!(%22%E7%A7%BB%E5%8A%A8%E7%8E%A9%E5%AE%B6%20%7B%7D%20%E6%AD%A5%22%2C%20other)%2C%20%20%2F%2F%20other%20%E6%8D%95%E8%8E%B7%E4%BA%86%E5%80%BC%209%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> dice_roll </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 9</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> dice_roll {</span></span>
<span class="line"><span style="color:#79B8FF">        3</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"加帽子"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#79B8FF">        7</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"移除帽子"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        other </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"移动玩家 {} 步"</span><span style="color:#E1E4E8">, other),  </span><span style="color:#6A737D">// other 捕获了值 9</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**对比：**

- _ — 匹配任何值但丢弃（不能使用）
- other （或任何变量名） — 匹配任何值并将其绑定到变量（可以在分支中使用）

## 提取部分值：灵活提取关心的字段

match 时，你可以选择性地提取字段，而不必全部提取。

### 用 `_` 忽略元组中的字段

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Aenum%20Point%20%7B%0A%20%20%20%20Point2D(i32%2C%20i32)%2C%0A%20%20%20%20Point3D(i32%2C%20i32%2C%20i32)%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%3A%3APoint3D(1%2C%202%2C%203)%3B%0A%0A%20%20%20%20match%20p%20%7B%0A%20%20%20%20%20%20%20%20Point%3A%3APoint3D(x%2C%20_%2C%20_)%20%3D%3E%20println!(%22%E5%8F%AA%E5%85%B3%E5%BF%83%20x%EF%BC%9A%7B%7D%22%2C%20x)%2C%0A%20%20%20%20%20%20%20%20Point%3A%3APoint2D(x%2C%20y)%20%3D%3E%20println!(%222D%20%E7%82%B9%EF%BC%9A(%7B%7D%2C%20%7B%7D)%22%2C%20x%2C%20y)%2C%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Point2D</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#B392F0">    Point3D</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">i32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#F97583">::</span><span style="color:#B392F0">Point3D</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> p {</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#F97583">::</span><span style="color:#B392F0">Point3D</span><span style="color:#E1E4E8">(x, _, _) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"只关心 x：{}"</span><span style="color:#E1E4E8">, x),</span></span>
<span class="line"><span style="color:#B392F0">        Point</span><span style="color:#F97583">::</span><span style="color:#B392F0">Point2D</span><span style="color:#E1E4E8">(x, y) </span><span style="color:#F97583">=&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"2D 点：({}, {})"</span><span style="color:#E1E4E8">, x, y),</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 用 `..` 忽略结构体中的字段

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Aenum%20Person%20%7B%0A%20%20%20%20Student%20%7B%20name%3A%20String%2C%20grade%3A%20u32%20%7D%2C%0A%20%20%20%20Teacher%20%7B%20name%3A%20String%2C%20subject%3A%20String%20%7D%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20person%20%3D%20Person%3A%3AStudent%20%7B%0A%20%20%20%20%20%20%20%20name%3A%20String%3A%3Afrom(%22Alice%22)%2C%0A%20%20%20%20%20%20%20%20grade%3A%2010%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20match%20person%20%7B%0A%20%20%20%20%20%20%20%20Person%3A%3AStudent%20%7B%20name%2C%20..%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%E5%8F%AA%E6%8F%90%E5%8F%96%20name%EF%BC%8C%E5%85%B6%E4%BB%96%E7%94%A8%20..%20%E5%BF%BD%E7%95%A5%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%7B%7D%20%E6%98%AF%E5%AD%A6%E7%94%9F%22%2C%20name)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Person%3A%3ATeacher%20%7B%20subject%2C%20..%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E6%95%99%E7%A7%91%E7%9B%AE%EF%BC%9A%7B%7D%22%2C%20subject)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Person</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Student</span><span style="color:#E1E4E8"> { name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, grade</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#B392F0">    Teacher</span><span style="color:#E1E4E8"> { name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, subject</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> person </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Person</span><span style="color:#F97583">::</span><span style="color:#B392F0">Student</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        grade</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> person {</span></span>
<span class="line"><span style="color:#B392F0">        Person</span><span style="color:#F97583">::</span><span style="color:#B392F0">Student</span><span style="color:#E1E4E8"> { name, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">            // 只提取 name，其他用 .. 忽略</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{} 是学生"</span><span style="color:#E1E4E8">, name);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Person</span><span style="color:#F97583">::</span><span style="color:#B392F0">Teacher</span><span style="color:#E1E4E8"> { subject, </span><span style="color:#F97583">..</span><span style="color:#E1E4E8"> } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"教科目：{}"</span><span style="color:#E1E4E8">, subject);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

### 提取字段的简写语法

在 match 模式中，`{key}` 是 `{key: key}` 的简写——字段名同时也是绑定的变量名。如果想用不同的变量名，才需要用完整形式 `{key: var_name}`：

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%0Aenum%20Config%20%7B%0A%20%20%20%20Set%20%7B%20host%3A%20String%2C%20port%3A%20u32%20%7D%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20cfg%20%3D%20Config%3A%3ASet%20%7B%0A%20%20%20%20%20%20%20%20host%3A%20String%3A%3Afrom(%22localhost%22)%2C%0A%20%20%20%20%20%20%20%20port%3A%208080%2C%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20match%20cfg%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20%E7%AE%80%E5%86%99%E5%BD%A2%E5%BC%8F%EF%BC%9A%7Bhost%2C%20port%7D%20%E7%9B%B8%E5%BD%93%E4%BA%8E%20%7Bhost%3A%20host%2C%20port%3A%20port%7D%0A%20%20%20%20%20%20%20%20Config%3A%3ASet%20%7B%20host%2C%20port%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E8%BF%9E%E6%8E%A5%E5%88%B0%20%7B%7D%3A%7B%7D%22%2C%20host%2C%20port)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20%E5%A6%82%E6%9E%9C%E8%A6%81%E7%94%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E5%8F%98%E9%87%8F%E5%90%8D%EF%BC%8C%E7%94%A8%E5%AE%8C%E6%95%B4%E5%BD%A2%E5%BC%8F%0A%20%20%20%20match%20cfg%20%7B%0A%20%20%20%20%20%20%20%20Config%3A%3ASet%20%7B%20host%3A%20h%2C%20port%3A%20p%20%7D%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20println!(%22%E8%BF%9E%E6%8E%A5%E5%88%B0%20%7B%7D%3A%7B%7D%22%2C%20h%2C%20p)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> Config</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Set</span><span style="color:#E1E4E8"> { host</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#E1E4E8">, port</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u32</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> cfg </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Config</span><span style="color:#F97583">::</span><span style="color:#B392F0">Set</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        host</span><span style="color:#F97583">:</span><span style="color:#B392F0"> String</span><span style="color:#F97583">::</span><span style="color:#B392F0">from</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"localhost"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        port</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 8080</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> cfg {</span></span>
<span class="line"><span style="color:#6A737D">        // 简写形式：{host, port} 相当于 {host: host, port: port}</span></span>
<span class="line"><span style="color:#B392F0">        Config</span><span style="color:#F97583">::</span><span style="color:#B392F0">Set</span><span style="color:#E1E4E8"> { host, port } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"连接到 {}:{}"</span><span style="color:#E1E4E8">, host, port);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 如果要用不同的变量名，用完整形式</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> cfg {</span></span>
<span class="line"><span style="color:#B392F0">        Config</span><span style="color:#F97583">::</span><span style="color:#B392F0">Set</span><span style="color:#E1E4E8"> { host</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> h, port</span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> p } </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"连接到 {}:{}"</span><span style="color:#E1E4E8">, h, p);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

**小结：** 穷尽性检查要求覆盖所有情况，而灵活的模式（`_`、`..`、变量名）让你按需提取或忽略数据。

## 多个模式匹配同一分支

有时候，不同的模式需要执行同样的代码。可以用 `|` 将多个模式组合在一起：

<div class="code-runner" data-full-code="enum%20HttpStatus%20%7B%0A%20%20%20%20Ok%2C%0A%20%20%20%20Created%2C%0A%20%20%20%20BadRequest%2C%0A%20%20%20%20NotFound%2C%0A%20%20%20%20ServerError%2C%0A%7D%0A%0Afn%20is_error(status%3A%20HttpStatus)%20-%3E%20bool%20%7B%0A%20%20%20%20match%20status%20%7B%0A%20%20%20%20%20%20%20%20HttpStatus%3A%3AOk%20%7C%20HttpStatus%3A%3ACreated%20%3D%3E%20false%2C%20%20%20%20%20%20%20%20%2F%2F%20%E6%88%90%E5%8A%9F%E7%8A%B6%E6%80%81%0A%20%20%20%20%20%20%20%20HttpStatus%3A%3ABadRequest%20%7C%20HttpStatus%3A%3ANotFound%20%7C%20HttpStatus%3A%3AServerError%20%3D%3E%20true%2C%20%20%2F%2F%20%E9%94%99%E8%AF%AF%E7%8A%B6%E6%80%81%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20is_error(HttpStatus%3A%3AOk))%3B%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20false%0A%20%20%20%20println!(%22%7B%7D%22%2C%20is_error(HttpStatus%3A%3ABadRequest))%3B%20%20%20%2F%2F%20true%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">enum</span><span style="color:#B392F0"> HttpStatus</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    Ok</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    Created</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    BadRequest</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    NotFound</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#B392F0">    ServerError</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> is_error</span><span style="color:#E1E4E8">(status</span><span style="color:#F97583">:</span><span style="color:#B392F0"> HttpStatus</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> bool</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    match</span><span style="color:#E1E4E8"> status {</span></span>
<span class="line"><span style="color:#B392F0">        HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">Ok</span><span style="color:#F97583"> |</span><span style="color:#B392F0"> HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">Created</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">,        </span><span style="color:#6A737D">// 成功状态</span></span>
<span class="line"><span style="color:#B392F0">        HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">BadRequest</span><span style="color:#F97583"> |</span><span style="color:#B392F0"> HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">NotFound</span><span style="color:#F97583"> |</span><span style="color:#B392F0"> HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">ServerError</span><span style="color:#F97583"> =&gt;</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D">// 错误状态</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">is_error</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">Ok</span><span style="color:#E1E4E8">));           </span><span style="color:#6A737D">// false</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">is_error</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">HttpStatus</span><span style="color:#F97583">::</span><span style="color:#B392F0">BadRequest</span><span style="color:#E1E4E8">));   </span><span style="color:#6A737D">// true</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

使用 `|` 可以避免代码重复——不用为每个模式单独写一个分支。

# 匹配规则注意点

如果你熟悉 C 的 `switch` 语句，需要注意 Rust 的 `match` 有不同的行为：

## 1. 无需 `break`，自动跳出

**C 的 switch：**

```c
switch (value) {
    case 1:
        printf("一");
        break;  // 必须写 break，否则会"fall through"
    case 2:
        printf("二");
        break;
}
```

**Rust 的 match：**

<div class="code-runner" data-full-code="let%20value%20%3D%201%3B%0A%0Amatch%20value%20%7B%0A%20%20%20%201%20%3D%3E%20println!(%22%E4%B8%80%22)%2C%20%20%2F%2F%20%E6%97%A0%E9%9C%80%20break%EF%BC%8C%E5%8C%B9%E9%85%8D%E5%90%8E%E8%87%AA%E5%8A%A8%E8%B7%B3%E5%87%BA%0A%20%20%20%202%20%3D%3E%20println!(%22%E4%BA%8C%22)%2C%0A%20%20%20%20_%20%3D%3E%20%7B%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">match</span><span style="color:#E1E4E8"> value {</span></span>
<span class="line"><span style="color:#79B8FF">    1</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"一"</span><span style="color:#E1E4E8">),  </span><span style="color:#6A737D">// 无需 break，匹配后自动跳出</span></span>
<span class="line"><span style="color:#79B8FF">    2</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"二"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    _ </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

Rust 在匹配一个分支后**自动跳出**，不会继续执行下一个分支，所以不需要 `break`。这也意味着 Rust **禁止 fall through 行为**——你无法写出像 C 那样忘记 `break` 就继续执行下一个分支的代码。如果需要多个分支执行相同的代码，使用 `|` 组合模式即可（见前面”多个模式匹配同一分支”部分）。

## 2. 多个分支不能匹配同样的值

**在 Rust 中编译错误：**

<div class="code-runner" data-full-code="let%20value%20%3D%201%3B%0A%0Amatch%20value%20%7B%0A%20%20%20%201%20%3D%3E%20println!(%22%E4%B8%80%22)%2C%0A%20%20%20%201%20%3D%3E%20println!(%22%E5%86%8D%E6%9D%A5%E4%B8%80%E9%81%8D%22)%2C%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%811%20%E5%B7%B2%E7%BB%8F%E8%A2%AB%E5%89%8D%E9%9D%A2%E7%9A%84%E5%88%86%E6%94%AF%E5%8C%B9%E9%85%8D%0A%20%20%20%20_%20%3D%3E%20%7B%7D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">match</span><span style="color:#E1E4E8"> value {</span></span>
<span class="line"><span style="color:#79B8FF">    1</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"一"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#79B8FF">    1</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"再来一遍"</span><span style="color:#E1E4E8">),  </span><span style="color:#6A737D">// 错误！1 已经被前面的分支匹配</span></span>
<span class="line"><span style="color:#E1E4E8">    _ </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

编译器会拒绝**重复的模式**。如果你需要不同的代码执行，必须放在同一个分支中。即使用 `|` 组合模式，也不能让某个值在多个分支中被匹配到：

<div class="code-runner" data-full-code="let%20value%20%3D%202%3B%0A%0Amatch%20value%20%7B%0A%20%20%20%201%20%7C%202%20%3D%3E%20println!(%22%E4%B8%80%E6%88%96%E4%BA%8C%22)%2C%0A%20%20%20%202%20%7C%203%20%3D%3E%20println!(%22%E4%BA%8C%E6%88%96%E4%B8%89%22)%2C%20%20%2F%2F%20%E9%94%99%E8%AF%AF%EF%BC%812%20%E5%B7%B2%E7%BB%8F%E5%9C%A8%E5%89%8D%E4%B8%80%E4%B8%AA%E5%88%86%E6%94%AF%E8%A2%AB%E5%8C%B9%E9%85%8D%E8%BF%87%0A%20%20%20%20_%20%3D%3E%20%7B%7D%0A%7D" data-mode="expect-error"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 2</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">match</span><span style="color:#E1E4E8"> value {</span></span>
<span class="line"><span style="color:#79B8FF">    1</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"一或二"</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#79B8FF">    2</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> 3</span><span style="color:#F97583"> =&gt;</span><span style="color:#B392F0"> println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"二或三"</span><span style="color:#E1E4E8">),  </span><span style="color:#6A737D">// 错误！2 已经在前一个分支被匹配过</span></span>
<span class="line"><span style="color:#E1E4E8">    _ </span><span style="color:#F97583">=&gt;</span><span style="color:#E1E4E8"> {}</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

> **预告**：本章介绍的是 `match` 的基础用法。Rust 的模式匹配系统非常强大，还有更多进阶特性（如范围模式、守卫条件、引用解构等），将在[高级模式匹配](#/chapters/22-advanced/05-advanced-patterns)中详细讲解。

# 练习题

## 选择题

```rust
enum Animal {
    Dog,
    Cat,
    Bird,
}

let animal = Animal::Cat;

match animal {
    Animal::Dog => println!("汪"),
    Animal::Cat => println!("喵"),
}
```

加载题目中…

```rust
enum Status {
    Pending,
    Running,
    Done,
}

let status = Status::Running;

match status {
    Status::Pending => println!("等待中"),
    Status::Running => println!("运行中"),
    Status::Done => println!("完成"),
}
```

加载题目中…

```rust
enum Message {
    Text(String),
    Number(i32),
}

let msg = Message::Number(42);

match msg {
    Message::Text(s) => println!("文本：{}", s),
    Message::Number(n) => println!("数字：{}", n),
}
```

加载题目中…

```rust
enum Level {
    Low,
    Medium,
    High,
    Critical,
}

let level = Level::High;

match level {
    Level::Low | Level::Medium => println!("正常"),
    Level::High | Level::Critical => println!("警告"),
}
```

加载题目中…

## 编程练习

### 练习 1：完善 match 分支

下面的代码缺少一个分支，请修复它：

```rust
enum Color {
    Red,
    Green,
    Blue,
}

fn describe_color(color: Color) -> String {
    match color {
        Color::Red => String::from("红色"),
        Color::Green => String::from("绿色"),
        // TODO: 添加 Blue 分支
    }
}

fn main() {
    println!("{}", describe_color(Color::Red));
    println!("{}", describe_color(Color::Blue));
}
```

### 练习 2：使用 match 解构枚举

定义一个 `Message` 枚举，包含三个成员：

- Text(String) — 文本消息
- Number(i32) — 数字消息
- Empty — 空消息

实现一个函数 `process_message()` 处理不同的消息：

```rust
enum Message {
    // TODO: 定义三个成员
}

fn process_message(msg: Message) -> String {
    // TODO: 使用 match 处理三种消息，返回相应描述：文本消息｜数字消息｜空消息
}

fn main() {
    let msg1 = Message::Text(String::from("Hello"));
    let msg2 = Message::Number(42);
    let msg3 = Message::Empty;

    println!("{}", process_message(msg1));
    println!("{}", process_message(msg2));
    println!("{}", process_message(msg3));
}
```

### 练习 3：处理不同形式的关联数据

定义一个 `Command` 枚举，包含两个成员（展示元组风格和结构体风格的混合）：

- Execute(String) — 执行命令（元组风格，关联一个字符串）
- Config { key: String, value: String } — 配置（结构体风格，关联两个字段）

实现一个函数 `handle_command()` 使用 match 处理这两种情况，返回对应的描述字符串：

- 对于 Execute ：返回 "执行命令：{命令名}"
- 对于 Config ：返回 "配置 {key} = {value}"

```rust
enum Command {
    // TODO: 定义两个成员
}

fn handle_command(cmd: Command) -> String {
    // TODO: 使用 match 处理命令并返回处理结果
}

fn main() {
    let cmd1 = Command::Execute(String::from("start"));
    let cmd2 = Command::Config {
        key: String::from("timeout"),
        value: String::from("30"),
    };

    println!("{}", handle_command(cmd1));
    println!("{}", handle_command(cmd2));
}
```