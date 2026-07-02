# 题目：筛词并转换

给定一段英文句子，找出所有长度**大于** `min_len` 的单词，转成大写后收集为 `Vec<String>`。

## 参考实现：for 循环版本

<div class="code-runner" data-full-code="fn%20long_words(text%3A%20%26str%2C%20min_len%3A%20usize)%20-%3E%20Vec%3CString%3E%20%7B%0A%20%20%20%20let%20mut%20result%20%3D%20Vec%3A%3Anew()%3B%0A%20%20%20%20for%20word%20in%20text.split_whitespace()%20%7B%0A%20%20%20%20%20%20%20%20if%20word.len()%20%3E%20min_len%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20result.push(word.to_uppercase())%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20result%0A%7D%0A%0Afn%20main()%20%7B%0A%20%20%20%20let%20sentence%20%3D%20%22the%20quick%20brown%20fox%20jumps%20over%20the%20lazy%20dog%22%3B%0A%20%20%20%20println!(%22%7B%3A%3F%7D%22%2C%20long_words(sentence%2C%203))%3B%0A%7D" data-mode="run"><pre class="code-runner-pre"><code class="language-rust"><span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> long_words</span><span style="color:#E1E4E8">(text</span><span style="color:#F97583">:</span><span style="color:#F97583"> &amp;</span><span style="color:#B392F0">str</span><span style="color:#E1E4E8">, min_len</span><span style="color:#F97583">:</span><span style="color:#B392F0"> usize</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">-&gt;</span><span style="color:#B392F0"> Vec</span><span style="color:#E1E4E8">&lt;</span><span style="color:#B392F0">String</span><span style="color:#E1E4E8">&gt; {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#F97583"> mut</span><span style="color:#E1E4E8"> result </span><span style="color:#F97583">=</span><span style="color:#B392F0"> Vec</span><span style="color:#F97583">::</span><span style="color:#B392F0">new</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> word </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> text</span><span style="color:#F97583">.</span><span style="color:#B392F0">split_whitespace</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> word</span><span style="color:#F97583">.</span><span style="color:#B392F0">len</span><span style="color:#E1E4E8">() &gt; min_len {</span></span>
<span class="line"><span style="color:#E1E4E8">            result</span><span style="color:#F97583">.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(word</span><span style="color:#F97583">.</span><span style="color:#B392F0">to_uppercase</span><span style="color:#E1E4E8">());</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    result</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">fn</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> sentence </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "the quick brown fox jumps over the lazy dog"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">    println!</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"{:?}"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">long_words</span><span style="color:#E1E4E8">(sentence, </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre></div>

## 你的任务：改写为迭代器版本

用 `split_whitespace()`、`filter`、`map`、`collect` 以及闭包重写，结果与上面完全一致：

```rust
fn long_words_iter(text: &str, min_len: usize) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let sentence = "the quick brown fox jumps over the lazy dog";
    println!("{:?}", long_words_iter(sentence, 3));
}
```