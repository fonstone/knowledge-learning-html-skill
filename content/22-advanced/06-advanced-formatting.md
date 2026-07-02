# Display 与 Debug

## 两种”打印”方式的本质区别

你用过 `println!("{}", x)` 和 `println!("{:?}", x)`，但可能没想过它们背后的差异：

| 格式 | 对应 trait | 设计意图 |
| --- | --- | --- |
| `{}` | `Display` | **面向用户**：给人看的可读输出 |
| `{:?}` | `Debug` | **面向开发者**：调试用的详细输出 |
| `{:#?}` | `Debug`（美化） | 带缩进的 Debug 输出 |

类比：

- Display 是你对外展示的名片——简洁、美观
- Debug 是程序员查 bug 时看的日志——完整、精确

<div class="code-runner" data-full-code="%23%5Bderive(Debug)%5D%20%20%2F%2F%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%20Debug%20%E5%AE%9E%E7%8E%B0%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%203.14%2C%20y%3A%20-2.71%20%7D%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20p)%3B%20%20%20%2F%2F%20Debug%EF%BC%9APoint%20%7B%20x%3A%203.14%2C%20y%3A%20-2.71%20%7D%0A%20%20%20%20println!(%22%7B%3A%23%3F%7D%22%2C%20p)%3B%20%20%2F%2F%20%E7%BE%8E%E5%8C%96%20Debug%EF%BC%8C%E5%B8%A6%E7%BC%A9%E8%BF%9B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#E1E4E8">#[derive(</span><span style="color:#B392F0">Debug</span><span style="color:#E1E4E8">)]  </span><span style="color:#6A737D">// 自动生成 Debug 实现</span></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3.14</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">2.71</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, p);   </span><span style="color:#6A737D">// Debug：Point { x: 3.14, y: -2.71 }</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#?}"</span><span style="color:#E1E4E8">, p);  </span><span style="color:#6A737D">// 美化 Debug，带缩进</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 为什么标准库类型不能直接 `{}`

`#[derive(Debug)]` 是编译器自动给你生成 `Debug` 实现，但没有对应的 `#[derive(Display)]`——`Display` **必须手动实现**，因为”如何给用户展示”是业务决策，编译器不知道你想怎么显示。

比如 `Point { x: 3.14, y: -2.71 }` 对用户来说可能要显示成：

- (3.14, -2.71)
- 3.14, -2.71
- x=3.14, y=-2.71

全看你的需求，所以必须你来定义。

## 实现 Display

实现 `Display` 需要引入 `std::fmt`，并实现 `fmt` 方法：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20Point%20%7B%0A%20%20%20%20x%3A%20f64%2C%0A%20%20%20%20y%3A%20f64%2C%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Point%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20write!%20%E5%90%91%20Formatter%20%E5%86%99%E5%85%A5%E5%86%85%E5%AE%B9%EF%BC%8C%E8%BF%94%E5%9B%9E%20fmt%3A%3AResult%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22(%7B%3A.2%7D%2C%20%7B%3A.2%7D)%22%2C%20self.x%2C%20self.y)%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20p%20%3D%20Point%20%7B%20x%3A%203.14159%2C%20y%3A%20-2.71828%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20p)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20(3.14%2C%20-2.72)%0A%20%20%20%20let%20s%20%3D%20p.to_string()%3B%20%20%20%20%20%20%2F%2F%20Display%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BE%9B%20to_string()%0A%20%20%20%20println!(%22%7B%7D%22%2C%20s)%3B%20%20%20%20%20%20%20%20%20%20%2F%2F%20(3.14%2C%20-2.72)%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    x</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    y</span><span style="color:#F97583">:</span><span style="color:#B392F0"> f64</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">        // write! 向 Formatter 写入内容，返回 fmt::Result</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"({:.2}, {:.2})"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">x, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">y)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> p </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Point</span><span style="color:#E1E4E8"> { x</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3.14159</span><span style="color:#E1E4E8">, y</span><span style="color:#F97583">:</span><span style="color:#F97583"> -</span><span style="color:#79B8FF">2.71828</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, p);          </span><span style="color:#6A737D">// (3.14, -2.72)</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> s </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> p</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_string</span><span style="color:#E1E4E8">();      </span><span style="color:#6A737D">// Display 自动提供 to_string()</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, s);          </span><span style="color:#6A737D">// (3.14, -2.72)</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

实现了 `Display`，`to_string()` 方法就免费得到了——标准库自动为实现 `Display` 的类型提供 `to_string()`。

更复杂的例子——为链表实现显示：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20Matrix%20%7B%0A%20%20%20%20data%3A%20Vec%3CVec%3Cf64%3E%3E%2C%0A%20%20%20%20rows%3A%20usize%2C%0A%20%20%20%20cols%3A%20usize%2C%0A%7D%0A%0Aimpl%20fmt%3A%3ADisplay%20for%20Matrix%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20for%20(i%2C%20row)%20in%20self.data.iter().enumerate()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%5B%22)%3F%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20for%20(j%2C%20val)%20in%20row.iter().enumerate()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20j%20%3E%200%20%7B%20write!(f%2C%20%22%2C%20%22)%3F%3B%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%3A6.2%7D%22%2C%20val)%3F%3B%20%20%2F%2F%20%E5%AE%BD%E5%BA%A66%EF%BC%8C2%E4%BD%8D%E5%B0%8F%E6%95%B0%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%5D%22)%3F%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20i%20%3C%20self.rows%20-%201%20%7B%20writeln!(f)%3F%3B%20%7D%20%20%2F%2F%20%E6%9C%80%E5%90%8E%E4%B8%80%E8%A1%8C%E4%B8%8D%E5%8A%A0%E6%8D%A2%E8%A1%8C%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20Ok(())%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20m%20%3D%20Matrix%20%7B%0A%20%20%20%20%20%20%20%20data%3A%20vec!%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20vec!%5B1.0%2C%202.0%2C%203.0%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20vec!%5B4.5%2C%205.5%2C%206.5%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20vec!%5B7.0%2C%208.0%2C%209.0%5D%2C%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20rows%3A%203%2C%0A%20%20%20%20%20%20%20%20cols%3A%203%2C%0A%20%20%20%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20m)%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Matrix</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    data</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">&gt;&gt;,</span></span>
<span class="line"><span style="color:#E1E4E8">    rows</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    cols</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Matrix</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> (i, row) </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">data</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">enumerate</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">            write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"["</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            for</span><span style="color:#E1E4E8"> (j, val) </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> row</span><span style="color:#F97583">.</span><span style="color:#B392F0">iter</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">.</span><span style="color:#B392F0">enumerate</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">                if</span><span style="color:#E1E4E8"> j </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">", "</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">; }</span></span>
<span class="line"><span style="color:#B392F0">                write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"{:6.2}"</span><span style="color:#E1E4E8">, val)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;  </span><span style="color:#6A737D">// 宽度6，2位小数</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#B392F0">            write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"]"</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">&lt;</span><span style="color:#79B8FF"> self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">rows </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8"> { </span><span style="color:#B392F0">writeln!</span><span style="color:#E1E4E8">(f)</span><span style="color:#F97583">?</span><span style="color:#E1E4E8">; }  </span><span style="color:#6A737D">// 最后一行不加换行</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#B392F0">        Ok</span><span style="color:#E1E4E8">(())</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> m </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Matrix</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">        data</span><span style="color:#F97583">:</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#B392F0">            vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">1.0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2.0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.0</span><span style="color:#E1E4E8">],</span></span>
<span class="line"><span style="color:#B392F0">            vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">4.5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5.5</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6.5</span><span style="color:#E1E4E8">],</span></span>
<span class="line"><span style="color:#B392F0">            vec!</span><span style="color:#E1E4E8">[</span><span style="color:#79B8FF">7.0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">8.0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">9.0</span><span style="color:#E1E4E8">],</span></span>
<span class="line"><span style="color:#E1E4E8">        ],</span></span>
<span class="line"><span style="color:#E1E4E8">        rows</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        cols</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 3</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, m);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 格式化参数详解

## 宽度、对齐与填充

格式化字符串可以精确控制输出的排版：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%AE%BD%E5%BA%A6%EF%BC%9A%E6%95%B0%E5%AD%97%E5%90%8E%E9%9D%A2%E8%B7%9F%E4%BD%8D%E6%95%B0%0A%20%20%20%20println!(%22%7B%3A10%7D%22%2C%20%22hello%22)%3B%20%20%20%20%2F%2F%20%22hello%20%20%20%20%20%22%EF%BC%88%E5%8F%B3%E8%BE%B9%E8%A1%A5%E7%A9%BA%E6%A0%BC%E5%88%B010%E4%BD%8D%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E5%AF%B9%E9%BD%90%EF%BC%9A%3C%20%E5%B7%A6%E5%AF%B9%E9%BD%90%EF%BC%8C%3E%20%E5%8F%B3%E5%AF%B9%E9%BD%90%EF%BC%8C%5E%20%E5%B1%85%E4%B8%AD%0A%20%20%20%20println!(%22%7B%3A%3C10%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20%22hello%20%20%20%20%20%22%EF%BC%88%E5%B7%A6%E5%AF%B9%E9%BD%90%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A%3E10%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20%22%20%20%20%20%20hello%22%EF%BC%88%E5%8F%B3%E5%AF%B9%E9%BD%90%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A%5E10%7D%22%2C%20%22hello%22)%3B%20%20%20%2F%2F%20%22%20%20hello%20%20%20%22%EF%BC%88%E5%B1%85%E4%B8%AD%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E5%A1%AB%E5%85%85%E5%AD%97%E7%AC%A6%EF%BC%9A%E5%9C%A8%20%3C%20%3E%20%5E%20%E5%89%8D%E9%9D%A2%E5%86%99%0A%20%20%20%20println!(%22%7B%3A*%3C10%7D%22%2C%20%22hi%22)%3B%20%20%20%20%20%2F%2F%20%22hi********%22%EF%BC%88%E7%94%A8*%E5%A1%AB%E5%85%85%EF%BC%8C%E5%B7%A6%E5%AF%B9%E9%BD%90%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A0%3E5%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%2F%2F%20%2200042%22%EF%BC%88%E7%94%A80%E5%A1%AB%E5%85%85%EF%BC%8C%E5%8F%B3%E5%AF%B9%E9%BD%90%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A-%5E20%7D%22%2C%20%22%20%E6%A0%87%E9%A2%98%20%22)%3B%20%2F%2F%20%22-------%20%20%E6%A0%87%E9%A2%98%20%20-------%22%EF%BC%88%E5%B1%85%E4%B8%AD%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 宽度：数字后面跟位数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);    </span><span style="color:#6A737D">// "hello     "（右边补空格到10位）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 对齐：&lt; 左对齐，&gt; 右对齐，^ 居中</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&lt;10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// "hello     "（左对齐）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&gt;10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// "     hello"（右对齐）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:^10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hello"</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// "  hello   "（居中）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 填充字符：在 &lt; &gt; ^ 前面写</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:*&lt;10}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hi"</span><span style="color:#E1E4E8">);     </span><span style="color:#6A737D">// "hi********"（用*填充，左对齐）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:0&gt;5}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);        </span><span style="color:#6A737D">// "00042"（用0填充，右对齐）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:-^20}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">" 标题 "</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// "-------  标题  -------"（居中）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

数字的特殊格式：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E7%B2%BE%E5%BA%A6%EF%BC%88%E5%B0%8F%E6%95%B0%E4%BD%8D%E6%95%B0%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A.3%7D%22%2C%203.14159)%3B%20%20%2F%2F%203.142%EF%BC%88%E5%9B%9B%E8%88%8D%E4%BA%94%E5%85%A5%E5%88%B03%E4%BD%8D%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A.0%7D%22%2C%203.7)%3B%20%20%20%20%20%20%2F%2F%204%EF%BC%88%E5%9B%9B%E8%88%8D%E4%BA%94%E5%85%A5%E5%88%B0%E6%95%B4%E6%95%B0%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E5%AE%BD%E5%BA%A6%20%2B%20%E7%B2%BE%E5%BA%A6%E7%BB%84%E5%90%88%0A%20%20%20%20println!(%22%7B%3A10.3%7D%22%2C%203.14)%3B%20%20%20%2F%2F%20%22%20%20%20%20%203.140%22%EF%BC%88%E5%AE%BD10%EF%BC%8C3%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E6%AD%A3%E6%95%B0%E6%98%BE%E7%A4%BA%20%2B%0A%20%20%20%20println!(%22%7B%3A%2B%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%2F%2F%20%2B42%0A%20%20%20%20println!(%22%7B%3A%2B%7D%22%2C%20-42)%3B%20%20%20%20%20%20%20%2F%2F%20-42%0A%0A%20%20%20%20%2F%2F%20%E8%BF%9B%E5%88%B6%0A%20%20%20%20println!(%22%7B%3Ab%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%2F%2F%20101010%EF%BC%88%E4%BA%8C%E8%BF%9B%E5%88%B6%EF%BC%89%0A%20%20%20%20println!(%22%7B%3Ao%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%20%2F%2F%2052%EF%BC%88%E5%85%AB%E8%BF%9B%E5%88%B6%EF%BC%89%0A%20%20%20%20println!(%22%7B%3Ax%7D%22%2C%20255)%3B%20%20%20%20%20%20%20%2F%2F%20ff%EF%BC%88%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6%E5%B0%8F%E5%86%99%EF%BC%89%0A%20%20%20%20println!(%22%7B%3AX%7D%22%2C%20255)%3B%20%20%20%20%20%20%20%2F%2F%20FF%EF%BC%88%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6%E5%A4%A7%E5%86%99%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A%23x%7D%22%2C%20255)%3B%20%20%20%20%20%20%2F%2F%200xff%EF%BC%88%E5%B8%A6%200x%20%E5%89%8D%E7%BC%80%EF%BC%89%0A%20%20%20%20println!(%22%7B%3A%23b%7D%22%2C%2042)%3B%20%20%20%20%20%20%20%2F%2F%200b101010%EF%BC%88%E5%B8%A6%200b%20%E5%89%8D%E7%BC%80%EF%BC%89%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 精度（小数位数）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:.3}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.14159</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 3.142（四舍五入到3位）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:.0}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.7</span><span style="color:#E1E4E8">);      </span><span style="color:#6A737D">// 4（四舍五入到整数）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 宽度 + 精度组合</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:10.3}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.14</span><span style="color:#E1E4E8">);   </span><span style="color:#6A737D">// "     3.140"（宽10，3位小数）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 正数显示 +</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:+}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);        </span><span style="color:#6A737D">// +42</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:+}"</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">-</span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);       </span><span style="color:#6A737D">// -42</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 进制</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:b}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);        </span><span style="color:#6A737D">// 101010（二进制）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:o}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);        </span><span style="color:#6A737D">// 52（八进制）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:x}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">255</span><span style="color:#E1E4E8">);       </span><span style="color:#6A737D">// ff（十六进制小写）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:X}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">255</span><span style="color:#E1E4E8">);       </span><span style="color:#6A737D">// FF（十六进制大写）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#x}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">255</span><span style="color:#E1E4E8">);      </span><span style="color:#6A737D">// 0xff（带 0x 前缀）</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#b}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">42</span><span style="color:#E1E4E8">);       </span><span style="color:#6A737D">// 0b101010（带 0b 前缀）</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 命名参数与位置参数

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E4%BD%8D%E7%BD%AE%E5%8F%82%E6%95%B0%0A%20%20%20%20println!(%22%7B0%7D%20%2B%20%7B1%7D%20%3D%20%7B2%7D%22%2C%201%2C%202%2C%203)%3B%20%20%20%20%20%20%20%2F%2F%201%20%2B%202%20%3D%203%0A%20%20%20%20println!(%22%7B0%7D%EF%BC%8C%E4%BD%A0%E5%A5%BD%EF%BC%81%7B0%7D%EF%BC%8C%E5%86%8D%E8%A7%81%EF%BC%81%22%2C%20%22Alice%22)%3B%20%2F%2F%20Alice%EF%BC%8C%E4%BD%A0%E5%A5%BD%EF%BC%81Alice%EF%BC%8C%E5%86%8D%E8%A7%81%EF%BC%81%0A%0A%20%20%20%20%2F%2F%20%E5%91%BD%E5%90%8D%E5%8F%82%E6%95%B0%0A%20%20%20%20println!(%22%7Bname%7D%20%E4%BB%8A%E5%B9%B4%20%7Bage%7D%20%E5%B2%81%22%2C%20name%20%3D%20%22Bob%22%2C%20age%20%3D%2030)%3B%0A%0A%20%20%20%20%2F%2F%20%E5%8F%98%E9%87%8F%E6%8D%95%E8%8E%B7%EF%BC%88Rust%201.58%2B%EF%BC%89%0A%20%20%20%20let%20user%20%3D%20%22Carol%22%3B%0A%20%20%20%20let%20count%20%3D%205%3B%0A%20%20%20%20println!(%22%7Buser%7D%20%E6%9C%89%20%7Bcount%7D%20%E6%9D%A1%E6%B6%88%E6%81%AF%22)%3B%20%20%2F%2F%20%E7%9B%B4%E6%8E%A5%E7%94%A8%E5%8F%98%E9%87%8F%E5%90%8D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 位置参数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{0} + {1} = {2}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">);       </span><span style="color:#6A737D">// 1 + 2 = 3</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{0}，你好！{0}，再见！"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"Alice"</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// Alice，你好！Alice，再见！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 命名参数</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{name} 今年 {age} 岁"</span><span style="color:#E1E4E8">, name </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Bob"</span><span style="color:#E1E4E8">, age </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 变量捕获（Rust 1.58+）</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> user </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "Carol"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> count </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 5</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{user} 有 {count} 条消息"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// 直接用变量名</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 动态宽度与精度

宽度和精度也可以用变量指定，用 `$` 语法引用位置或命名参数：

<div class="code-runner" data-full-code="fn%20main()%20%7B%0A%20%20%20%20%2F%2F%20%E5%AE%BD%E5%BA%A6%E7%94%A8%E5%8F%98%E9%87%8F%0A%20%20%20%20let%20width%20%3D%2010%3B%0A%20%20%20%20println!(%22%7B%3A%3Ewidth%24%7D%22%2C%20%22hi%22)%3B%20%20%2F%2F%20%22%20%20%20%20%20%20%20%20hi%22%EF%BC%88%E5%AE%BD%E5%BA%A610%EF%BC%8C%E5%8F%B3%E5%AF%B9%E9%BD%90%EF%BC%89%0A%0A%20%20%20%20%2F%2F%20%E7%B2%BE%E5%BA%A6%E7%94%A8%E5%8F%98%E9%87%8F%0A%20%20%20%20let%20precision%20%3D%204%3B%0A%20%20%20%20println!(%22%7B%3A.precision%24%7D%22%2C%203.14159)%3B%20%2F%2F%203.1416%0A%0A%20%20%20%20%2F%2F%20%E6%89%93%E5%8D%B0%E5%AF%B9%E9%BD%90%E7%9A%84%E8%A1%A8%E6%A0%BC%0A%20%20%20%20let%20items%20%3D%20vec!%5B%0A%20%20%20%20%20%20%20%20(%22%E8%8B%B9%E6%9E%9C%22%2C%203.5_f64%2C%2010_u32)%2C%0A%20%20%20%20%20%20%20%20(%22%E9%A6%99%E8%95%89%22%2C%201.2_f64%2C%2025_u32)%2C%0A%20%20%20%20%20%20%20%20(%22%E8%8D%89%E8%8E%93%22%2C%208.8_f64%2C%205_u32)%2C%0A%20%20%20%20%5D%3B%0A%0A%20%20%20%20println!(%22%7B%3A%3C8%7D%20%7B%3A%3E8%7D%20%7B%3A%3E6%7D%22%2C%20%22%E5%95%86%E5%93%81%22%2C%20%22%E5%8D%95%E4%BB%B7(%E5%85%83)%22%2C%20%22%E6%95%B0%E9%87%8F%22)%3B%0A%20%20%20%20println!(%22%7B%3A-%3C24%7D%22%2C%20%22%22)%3B%0A%20%20%20%20for%20(name%2C%20price%2C%20qty)%20in%20%26items%20%7B%0A%20%20%20%20%20%20%20%20println!(%22%7B%3A%3C8%7D%20%7B%3A%3E8.2%7D%20%7B%3A%3E6%7D%22%2C%20name%2C%20price%2C%20qty)%3B%0A%20%20%20%20%7D%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">    // 宽度用变量</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> width </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&gt;width$}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"hi"</span><span style="color:#E1E4E8">);  </span><span style="color:#6A737D">// "        hi"（宽度10，右对齐）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 精度用变量</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> precision </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 4</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:.precision$}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.14159</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">// 3.1416</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    // 打印对齐的表格</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> items </span><span style="color:#F97583">=</span><span style="color:#B392F0"> vec!</span><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"苹果"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">3.5_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10_</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"香蕉"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1.2_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">25_</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">        (</span><span style="color:#9ECBFF">"草莓"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">8.8_</span><span style="color:#B392F0">f64</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5_</span><span style="color:#B392F0">u32</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&lt;8} {:&gt;8} {:&gt;6}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"商品"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"单价(元)"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"数量"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:-&lt;24}"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">""</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (name, price, qty) </span><span style="color:#F97583">in</span><span style="color:#F97583"> &amp;</span><span style="color:#E1E4E8">items {</span></span>
<span class="line"><span style="color:#B392F0">        println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:&lt;8} {:&gt;8.2} {:&gt;6}"</span><span style="color:#E1E4E8">, name, price, qty);</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 自定义格式（实现多种 fmt trait）

除了 `Display` 和 `Debug`，还可以实现其他格式 trait，让你的类型支持 `{:b}`、`{:x}` 等：

<div class="code-runner" data-full-code="use%20std%3A%3Afmt%3B%0A%0Astruct%20Color%20%7B%0A%20%20%20%20r%3A%20u8%2C%0A%20%20%20%20g%3A%20u8%2C%0A%20%20%20%20b%3A%20u8%2C%0A%7D%0A%0A%2F%2F%20%7B%7D%20%E8%BE%93%E5%87%BA%EF%BC%9Argb(255%2C%20128%2C%200)%0Aimpl%20fmt%3A%3ADisplay%20for%20Color%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20write!(f%2C%20%22rgb(%7B%7D%2C%20%7B%7D%2C%20%7B%7D)%22%2C%20self.r%2C%20self.g%2C%20self.b)%0A%20%20%20%20%7D%0A%7D%0A%0A%2F%2F%20%7B%3A%23x%7D%20%E8%BE%93%E5%87%BA%EF%BC%9A%23ff8000%EF%BC%88%E5%8D%81%E5%85%AD%E8%BF%9B%E5%88%B6%20HTML%20%E9%A2%9C%E8%89%B2%EF%BC%89%0Aimpl%20fmt%3A%3ALowerHex%20for%20Color%20%7B%0A%20%20%20%20fn%20fmt(%26self%2C%20f%3A%20%26mut%20fmt%3A%3AFormatter)%20-%3E%20fmt%3A%3AResult%20%7B%0A%20%20%20%20%20%20%20%20if%20f.alternate()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20f.alternate()%20%E6%A3%80%E6%B5%8B%E6%98%AF%E5%90%A6%E6%9C%89%20%23%20%E6%A0%87%E5%BF%97%EF%BC%88%E5%A6%82%20%7B%3A%23x%7D%EF%BC%89%0A%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%23%7B%3A02x%7D%7B%3A02x%7D%7B%3A02x%7D%22%2C%20self.r%2C%20self.g%2C%20self.b)%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20write!(f%2C%20%22%7B%3A02x%7D%7B%3A02x%7D%7B%3A02x%7D%22%2C%20self.r%2C%20self.g%2C%20self.b)%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20c%20%3D%20Color%20%7B%20r%3A%20255%2C%20g%3A%20128%2C%20b%3A%200%20%7D%3B%0A%20%20%20%20println!(%22%7B%7D%22%2C%20c)%3B%20%20%20%20%2F%2F%20rgb(255%2C%20128%2C%200)%0A%20%20%20%20println!(%22%7B%3Ax%7D%22%2C%20c)%3B%20%20%2F%2F%20ff8000%0A%20%20%20%20println!(%22%7B%3A%23x%7D%22%2C%20c)%3B%20%2F%2F%20%23ff8000%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">use</span><span style="color:#B392F0"> std</span><span style="color:#F97583">::</span><span style="color:#E1E4E8">fmt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">struct</span><span style="color:#B392F0"> Color</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    r</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    g</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    b</span><span style="color:#F97583">:</span><span style="color:#B392F0"> u8</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// {} 输出：rgb(255, 128, 0)</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Display</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Color</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"rgb({}, {}, {})"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">r, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">g, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">b)</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// {:#x} 输出：#ff8000（十六进制 HTML 颜色）</span></span>
<span class="line"><span style="color:#F97583">impl</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">LowerHex</span><span style="color:#F97583"> for</span><span style="color:#B392F0"> Color</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    fn</span><span style="color:#B392F0"> fmt</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">&amp;</span><span style="color:#79B8FF">self</span><span style="color:#E1E4E8">, f</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;mut</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Formatter</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> fmt</span><span style="color:#F97583">::</span><span style="color:#B392F0">Result</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> f</span><span style="color:#F97583">.</span><span style="color:#B392F0">alternate</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">            // f.alternate() 检测是否有 # 标志（如 {:#x}）</span></span>
<span class="line"><span style="color:#B392F0">            write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"#{:02x}{:02x}{:02x}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">r, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">g, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">b)</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">            write!</span><span style="color:#E1E4E8">(f, </span><span style="color:#9ECBFF">"{:02x}{:02x}{:02x}"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">r, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">g, </span><span style="color:#79B8FF">self</span><span style="color:#F97583">.</span><span style="color:#E1E4E8">b)</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> c </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Color</span><span style="color:#E1E4E8"> { r</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 255</span><span style="color:#E1E4E8">, g</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 128</span><span style="color:#E1E4E8">, b</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{}"</span><span style="color:#E1E4E8">, c);    </span><span style="color:#6A737D">// rgb(255, 128, 0)</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:x}"</span><span style="color:#E1E4E8">, c);  </span><span style="color:#6A737D">// ff8000</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:#x}"</span><span style="color:#E1E4E8">, c); </span><span style="color:#6A737D">// #ff8000</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

# 练习题

## 格式化输出测验

加载题目中…

加载题目中…

```rust
fn main() {
    println!("{:0>6}", 42);
}
```

加载题目中…

加载题目中…

加载题目中…

## 编程练习

为商品结构体实现 `Display`，输出格式化的价格标签：

```rust
use std::fmt;

struct Product {
    name: String,
    price: f64,
    in_stock: bool,
}

// TODO: 为 Product 实现 Display，格式如下：
// 商品名称              ¥ 19.90  [有货]
// 另一个商品            ¥  5.00  [缺货]
// 要求：
// - 商品名称左对齐，占 20 个字符宽度
// - 价格右对齐，占 8 个字符宽度，2 位小数
// - 库存状态：有货显示 [有货]，缺货显示 [缺货]

fn main() {
    let products = vec![
        Product { name: "红富士苹果".to_string(), price: 19.9, in_stock: true },
        Product { name: "进口蓝莓".to_string(), price: 58.0, in_stock: false },
        Product { name: "香蕉".to_string(), price: 5.0, in_stock: true },
    ];

    for p in &products {
        println!("{}", p);
    }
}
```