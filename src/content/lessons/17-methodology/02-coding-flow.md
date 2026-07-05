---
chapterId: "17-methodology"
lessonId: "02-coding-flow"
title: "编码流程与 TDD"
level: "进阶"
duration: "25 分钟"
tags: [TDD, 测试驱动开发, 编码流程, 重构]
number: "17.2"
chapterTitle: "开发方法论"
chapterNumber: "17"
---
<div id="article-content"> <h1 id="编码流程">编码流程</h1>
<p>架构设计确定了模块边界，接下来是具体的编码工作。Rust 有一套非常适合其类型系统的编码推进顺序：<strong>数据结构 → Trait 接口 → 函数签名 → 实现 → 重构</strong>。</p>
<p>按照这个顺序写代码，可以让编译器成为你的引导者：先写类型，编译器帮你检查所有依赖这个类型的地方；再写接口，编译器帮你发现哪些实现还缺失。</p>
<h2 id="第一步先设计数据结构">第一步：先设计数据结构</h2>
<p><strong>从数据开始，不从逻辑开始。</strong></p>
<p>在写任何函数之前，先问自己：这个功能需要表达哪些概念？这些概念用什么数据结构表示？</p>
<p>把核心数据结构（<code>struct</code>、<code>enum</code>）写出来，但<strong>先不写方法</strong>。写完后停下来想：</p>
<ul>
<li>这个结构体的字段是否多余？是否有字段可以合并？</li>
<li>哪些字段只在某些状态下有意义（暗示可以用枚举状态机代替）？</li>
<li>数据的所有权关系是否清晰（拥有还是借用）？</li>
</ul>
<p>这一步的产出物是一张<strong>类型图</strong>——项目里所有核心类型及其关系。把它写下来或画出来，这是最重要的设计文档。</p>
<blockquote>
<p>Rust 的类型系统是你最好的文档工具。一个命名清晰、结构合理的 <code>enum</code> 往往比一段注释更能准确表达领域概念。</p>
</blockquote>
<h2 id="第二步定义-trait-接口">第二步：定义 Trait 接口</h2>
<p>数据结构确定之后，定义各个模块对外暴露的<strong>能力接口</strong>（Trait）。</p>
<p>这一步的核心问题是：<strong>调用方需要我提供什么？</strong> 不是”我能提供什么”。</p>
<p>写 Trait 时的几个原则：</p>
<ul>
<li><strong>方法数量保持克制</strong>：一个 Trait 超过 5-7 个方法通常意味着职责过多</li>
<li><strong>只暴露调用方真正需要的</strong>：不要因为”以后可能用到”就提前加方法</li>
<li><strong>返回类型要具体</strong>：能返回具体类型就不要返回 <code>Box&lt;dyn Trait&gt;</code>，除非确实需要动态分发</li>
<li><strong>错误类型要显式</strong>：返回 <code>Result&lt;T, MyError&gt;</code> 而不是 <code>Result&lt;T, Box&lt;dyn Error&gt;&gt;</code>，让调用方知道会遇到什么错误</li>
</ul>
<h2 id="第三步写函数签名先不写实现">第三步：写函数签名（先不写实现）</h2>
<p>Trait 定义好之后，先把所有关键函数的签名写完，用 <code>todo!()</code> 填充函数体。</p>
<p>这一步的价值在于：</p>
<ul>
<li><strong>让编译器检查整体逻辑是否自洽</strong>——类型对不上会立刻报错</li>
<li><strong>一眼看出哪些函数需要实现</strong>——<code>todo!()</code> 是明确的占位符，不会被遗忘</li>
<li><strong>接口稳定后再实现</strong>——如果在实现到一半时发现接口设计有问题，改起来成本极高</li>
</ul>
<p>一个常见的错误是同时修改签名和实现——这会让编译错误混成一团，难以区分是设计问题还是实现 bug。<strong>签名通过编译后，再动实现。</strong></p>
<h2 id="第四步实现与迭代">第四步：实现与迭代</h2>
<p>签名稳定后开始填写函数体。这是唯一允许”写逻辑”的阶段。</p>
<p><strong>每次只实现一个函数</strong>，实现完立刻跑相关测试（哪怕还没写所有测试）。这样可以快速获得反馈，不让错误积累。</p>
<p>如果实现中发现之前设计的 Trait 或数据结构有问题，<strong>先停下来修改设计</strong>，而不是在函数体里打补丁。补丁式代码是技术债的主要来源。</p>
<h2 id="重构的时机">重构的时机</h2>
<p><strong>重构不是一个单独的阶段，而是贯穿整个实现过程的持续行为。</strong></p>
<p>以下信号提示你应该重构：</p>
<table><thead><tr><th>信号</th><th>可能的问题</th><th>重构方向</th></tr></thead><tbody><tr><td>同一段逻辑出现超过两次</td><td>缺少抽象</td><td>提取函数或方法</td></tr><tr><td>函数超过 40 行</td><td>职责过多</td><td>拆分函数</td></tr><tr><td>函数参数超过 4 个</td><td>参数应该组成一个结构体</td><td>提取参数结构体</td></tr><tr><td><code>match</code> 语句里每个分支都做同样的事</td><td>Trait 对象或泛型更合适</td><td>重构为多态</td></tr><tr><td>大量 <code>clone()</code> 调用</td><td>所有权设计有问题</td><td>重新审视数据流向</td></tr><tr><td>测试难以编写</td><td>函数依赖了不必要的外部状态</td><td>依赖注入，传入 Trait 对象</td></tr></tbody></table>
<blockquote>
<p><strong>重构的前提是有测试</strong>。没有测试的重构是在赌博——你无法知道改动有没有破坏原有行为。这正是下一个 Tab 讲的内容。</p>
</blockquote>
<h1 id="测试驱动开发tdd">测试驱动开发（TDD）</h1>
<p>TDD 是一种以测试为起点的编码方式。它不只是”先写测试再实现”，更是一种<strong>通过测试来设计接口</strong>的思维方式。</p>
<h2 id="为什么先写测试">为什么先写测试</h2>
<p>先写实现、后写测试是直觉上的顺序，但这会导致一个隐患：<strong>测试会适应代码，而不是代码适应需求</strong>。</p>
<p>你会下意识地按照已有实现的结构来组织测试，跳过边界情况，用测试为实现”背书”而不是验证需求。</p>
<p>先写测试时，你必须先想清楚：</p>
<ul>
<li>函数的输入和输出是什么？</li>
<li>有哪些边界情况？（空输入、溢出、无效参数）</li>
<li>调用方的使用方式是什么？</li>
</ul>
<p>这些问题的答案就是接口设计，测试是接口设计的第一个”用户”。</p>
<h2 id="red--green--refactor-循环">Red → Green → Refactor 循环</h2>
<p>TDD 的节奏由三个反复交替的步骤组成，每轮只前进一小步：</p>
<p><strong>第一步 Red（红灯）— 先写一个会注定失败的测试</strong></p>
<p>在写任何实现代码之前，先写一个描述”我期望它怎么工作”的测试。此时运行测试，它<strong>必须失败</strong>——要么因为函数还不存在（编译报错），要么因为实现还没写（断言失败）。</p>
<p>如果测试直接通过了，说明它没有在检测任何新行为，需要重写。</p>
<p><strong>第二步 Green（绿灯）— 写最少的代码让测试通过</strong></p>
<p>现在只有一个目标：让刚写的测试变绿。写能通过这个测试的<strong>最简单</strong>的实现，不要多写，不要”顺手”完善其他逻辑。</p>
<p>这一步强调”最少”是因为：多写的代码没有测试覆盖，等于在绕过安全网。</p>
<p><strong>第三步 Refactor（重构）— 在测试保护下整理代码</strong></p>
<p>测试通过后，回头看代码质量：有没有重复的逻辑？命名是否清晰？结构能否更简洁？放心地改，测试会立刻告诉你改坏了没有。</p>
<p>重构完成后，回到第一步，为下一个功能写新的测试。</p>
<hr/>
<p>以实现一个”计算字符串单词数”的函数为例，完整走一遍：</p>
<pre><code class="language-text">Round 1
  Red:     写测试：count_words("hello world") == 2  → 编译失败（函数不存在）
  Green:   写函数，用空格分割返回数量              → 测试通过
  Refactor: 代码简洁，暂不需要改动

Round 2
  Red:     写测试：count_words("") == 0            → 测试失败（当前实现返回 1）
  Green:   加空字符串特判                          → 测试通过
  Refactor: 发现两个测试逻辑可以合并，整理一下

Round 3
  Red:     写测试：count_words("  hi  ") == 1      → 测试失败（前后空格导致多计）
  Green:   改为先 trim 再分割                      → 测试通过
  Refactor: 提取 split_whitespace，代码更清晰</code></pre>
<p>每一轮只前进一小步，每一步都有测试保护。最终你得到的不只是”能跑的代码”，还有一套完整描述函数行为的测试。</p>
<h2 id="在-rust-中实践-tdd">在 Rust 中实践 TDD</h2>
<p>Rust 的测试系统与 TDD 配合得非常自然：</p>
<ul>
<li><code>#[cfg(test)]</code> 模块可以测试私有函数，不需要绕过可见性</li>
<li><code>cargo test</code> 运行快，反馈及时</li>
<li>编译期检查帮你在 Red 阶段更早发现接口问题</li>
<li><code>todo!()</code> / <code>unimplemented!()</code> 让你先写签名、后填实现，正好对应 Green 阶段</li>
</ul>
<p>推进节奏上，建议每次提交前都保持测试全绿。如果发现测试很难写，大概率是因为函数依赖了太多外部状态——这个信号应该触发重构而不是绕开测试。</p>
<p>一个典型的 Rust TDD 小循环：</p>
<pre><code class="language-text">1. 新建测试函数，描述"这个功能应该如何工作"
2. cargo test → 编译失败（函数不存在）
3. 写函数签名，填 todo!()
4. cargo test → 运行失败（todo! panic）
5. 实现最简版本
6. cargo test → 通过
7. 审视代码，重构
8. cargo test → 仍然通过
9. 回到第 1 步</code></pre>
<h2 id="何时用-tdd何时不用">何时用 TDD，何时不用</h2>
<p>TDD 不是所有场景的最优解：</p>
<p><strong>适合 TDD 的场景：</strong></p>
<ul>
<li>业务逻辑清晰，有明确的输入/输出</li>
<li>需要高可靠性的核心功能</li>
<li>修改现有代码（回归测试保障）</li>
<li>接口设计不确定时（测试驱动接口探索）</li>
</ul>
<p><strong>不适合 TDD 的场景：</strong></p>
<ul>
<li>探索性编程（先理解问题再测试）</li>
<li>UI 和渲染层（难以自动化测试）</li>
<li>与外部系统集成的调试阶段</li>
<li>原型验证（先跑通再完善）</li>
</ul>
<blockquote>
<p>务实地使用 TDD：核心库和业务逻辑优先 TDD，胶水代码和配置层不必强求。比 TDD 更重要的原则是：<strong>有测试总比没测试好，测试要覆盖真实的行为，不是为了覆盖率数字。</strong></p>
</blockquote>
<h1 id="练习题">练习题</h1>
<h2 id="编码流程测验">编码流程测验</h2>
<div class="quiz-choice" data-block-id="17-methodology/02-coding-flow#2:0" data-kind="single" data-payload="%7B%22question%22%3A%22%E5%9C%A8%20Rust%20%E7%BC%96%E7%A0%81%E6%B5%81%E7%A8%8B%E4%B8%AD%EF%BC%8C%E4%B8%BA%E4%BB%80%E4%B9%88%E6%8E%A8%E8%8D%90%5C%22%E5%85%88%E5%86%99%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D%EF%BC%8C%E7%94%A8%20todo!()%20%E5%A1%AB%E5%85%85%E5%87%BD%E6%95%B0%E4%BD%93%5C%22%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%9B%A0%E4%B8%BA%20todo!()%20%E6%AF%94%E6%B3%A8%E9%87%8A%E6%9B%B4%E5%AE%B9%E6%98%93%E6%90%9C%E7%B4%A2%22%2C%22%E5%9B%A0%E4%B8%BA%20todo!()%20%E4%BC%9A%E8%87%AA%E5%8A%A8%E6%8F%90%E9%86%92%E4%BD%A0%E5%AE%8C%E6%88%90%E5%AE%9E%E7%8E%B0%22%2C%22%E8%AE%A9%E7%BC%96%E8%AF%91%E5%99%A8%E6%A3%80%E6%9F%A5%E6%95%B4%E4%BD%93%E7%B1%BB%E5%9E%8B%E6%98%AF%E5%90%A6%E8%87%AA%E6%B4%BD%EF%BC%8C%E6%8E%A5%E5%8F%A3%E7%A8%B3%E5%AE%9A%E5%90%8E%E5%86%8D%E5%86%99%E5%AE%9E%E7%8E%B0%EF%BC%8C%E9%81%BF%E5%85%8D%E8%BE%B9%E6%94%B9%E6%8E%A5%E5%8F%A3%E8%BE%B9%E6%94%B9%E5%AE%9E%E7%8E%B0%E5%AF%BC%E8%87%B4%E9%94%99%E8%AF%AF%E6%B7%B7%E4%B9%B1%22%2C%22%E8%BF%99%E5%8F%AA%E6%98%AF%E4%B8%AA%E4%BA%BA%E4%B9%A0%E6%83%AF%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%AE%9E%E9%99%85%E5%B7%A5%E7%A8%8B%E6%84%8F%E4%B9%89%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22%E5%85%88%E7%A8%B3%E5%AE%9A%E7%AD%BE%E5%90%8D%E5%86%8D%E5%AE%9E%E7%8E%B0%E7%9A%84%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E6%98%AF%5C%22%E5%88%86%E7%A6%BB%E5%85%B3%E6%B3%A8%E7%82%B9%5C%22%E2%80%94%E2%80%94%E6%8E%A5%E5%8F%A3%E8%AE%BE%E8%AE%A1%E5%92%8C%E9%80%BB%E8%BE%91%E5%AE%9E%E7%8E%B0%E6%98%AF%E4%B8%A4%E4%B8%AA%E4%B8%8D%E5%90%8C%E7%9A%84%E6%80%9D%E7%BB%B4%E6%A8%A1%E5%BC%8F%EF%BC%8C%E6%B7%B7%E5%9C%A8%E4%B8%80%E8%B5%B7%E5%AE%B9%E6%98%93%E5%87%BA%E9%94%99%EF%BC%8C%E4%B9%9F%E8%AE%A9%E7%BC%96%E8%AF%91%E9%94%99%E8%AF%AF%E9%9A%BE%E4%BB%A5%E5%AE%9A%E4%BD%8D%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="17-methodology/02-coding-flow#2:1" data-kind="single" data-payload="%7B%22question%22%3A%22Trait%20%E5%85%88%E8%A1%8C%E8%AE%BE%E8%AE%A1%E7%9A%84%E6%A0%B8%E5%BF%83%E5%8E%9F%E5%88%99%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%22%2C%22options%22%3A%5B%22Trait%20%E6%96%B9%E6%B3%95%E8%B6%8A%E5%A4%9A%E8%B6%8A%E5%A5%BD%EF%BC%8C%E6%96%B9%E4%BE%BF%E4%BB%A5%E5%90%8E%E6%89%A9%E5%B1%95%22%2C%22%E5%85%88%E5%86%99%E5%AE%9E%E7%8E%B0%EF%BC%8C%E5%86%8D%E4%BB%8E%E5%AE%9E%E7%8E%B0%E4%B8%AD%E6%8F%90%E5%8F%96%20Trait%22%2C%22Trait%20%E5%8F%AA%E7%94%A8%E4%BA%8E%E8%B7%A8%E6%A8%A1%E5%9D%97%E9%80%9A%E4%BF%A1%EF%BC%8C%E5%90%8C%E6%A8%A1%E5%9D%97%E5%86%85%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%22%2C%22%E6%8E%A5%E5%8F%A3%E7%94%B1%E4%BD%BF%E7%94%A8%E6%96%B9%E7%9A%84%E9%9C%80%E6%B1%82%E9%A9%B1%E5%8A%A8%EF%BC%8C%E8%80%8C%E4%B8%8D%E6%98%AF%E7%94%B1%E5%AE%9E%E7%8E%B0%E6%96%B9%E7%9A%84%E8%83%BD%E5%8A%9B%E9%A9%B1%E5%8A%A8%22%5D%2C%22correct%22%3A%5B3%5D%2C%22explanation%22%3A%22%E4%BB%8E%E4%BD%BF%E7%94%A8%E6%96%B9%E5%87%BA%E5%8F%91%E8%AE%BE%E8%AE%A1%E6%8E%A5%E5%8F%A3%EF%BC%8C%E8%83%BD%E9%81%BF%E5%85%8D%5C%22%E5%AE%9E%E7%8E%B0%E4%BA%86%E4%B8%80%E5%A0%86%E6%B2%A1%E4%BA%BA%E7%94%A8%E7%9A%84%E6%96%B9%E6%B3%95%5C%22%EF%BC%8C%E8%AE%A9%E6%8E%A5%E5%8F%A3%E7%B2%BE%E7%AE%80%E4%B8%94%E8%B4%B4%E8%BF%91%E7%9C%9F%E5%AE%9E%E9%9C%80%E6%B1%82%E3%80%82%E8%BF%99%E4%B9%9F%E6%98%AF%E4%B8%BA%E4%BB%80%E4%B9%88%E5%85%88%E5%86%99%E6%B5%8B%E8%AF%95%EF%BC%88%E6%B5%8B%E8%AF%95%E5%B0%B1%E6%98%AF%E6%9C%80%E6%97%A9%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%EF%BC%89%E8%83%BD%E5%B8%AE%E5%8A%A9%E8%AE%BE%E8%AE%A1%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%8E%A5%E5%8F%A3%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="17-methodology/02-coding-flow#2:2" data-kind="multi" data-payload="%7B%22question%22%3A%22%E4%B8%8B%E5%88%97%E5%93%AA%E4%BA%9B%E4%BF%A1%E5%8F%B7%E6%8F%90%E7%A4%BA%E4%BD%A0%E5%BA%94%E8%AF%A5%E9%87%8D%E6%9E%84%E4%BB%A3%E7%A0%81%EF%BC%9F%22%2C%22options%22%3A%5B%22%E5%87%BD%E6%95%B0%E4%BD%BF%E7%94%A8%E4%BA%86%E6%B3%9B%E5%9E%8B%22%2C%22%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E8%B6%85%E8%BF%87%204%20%E4%B8%AA%22%2C%22%E6%B5%8B%E8%AF%95%E9%9D%9E%E5%B8%B8%E9%9A%BE%E4%BB%A5%E7%BC%96%E5%86%99%EF%BC%8C%E9%9C%80%E8%A6%81%E5%A4%A7%E9%87%8F%20mock%22%2C%22%E5%90%8C%E4%B8%80%E6%AE%B5%E9%80%BB%E8%BE%91%E5%87%BA%E7%8E%B0%E8%B6%85%E8%BF%87%E4%B8%A4%E6%AC%A1%EF%BC%88%E9%87%8D%E5%A4%8D%EF%BC%89%22%2C%22%E4%BB%A3%E7%A0%81%E4%B8%AD%E6%9C%89%20match%20%E8%A1%A8%E8%BE%BE%E5%BC%8F%22%5D%2C%22correct%22%3A%5B1%2C2%2C3%5D%2C%22explanation%22%3A%22%E9%87%8D%E5%A4%8D%E4%BB%A3%E7%A0%81%E3%80%81%E5%8F%82%E6%95%B0%E8%BF%87%E5%A4%9A%E3%80%81%E6%B5%8B%E8%AF%95%E9%9A%BE%E5%86%99%EF%BC%88%E8%AF%B4%E6%98%8E%E5%87%BD%E6%95%B0%E4%BE%9D%E8%B5%96%E4%BA%86%E5%A4%AA%E5%A4%9A%E9%9A%90%E5%BC%8F%E7%8A%B6%E6%80%81%EF%BC%89%E9%83%BD%E6%98%AF%E9%87%8D%E6%9E%84%E4%BF%A1%E5%8F%B7%E3%80%82%E6%B3%9B%E5%9E%8B%E5%92%8C%20match%20%E6%9C%AC%E8%BA%AB%E4%B8%8D%E6%98%AF%E9%97%AE%E9%A2%98%EF%BC%8C%E6%98%AF%20Rust%20%E7%9A%84%E6%AD%A3%E5%B8%B8%E7%94%A8%E6%B3%95%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<h2 id="tdd-测验">TDD 测验</h2>
<div class="quiz-choice" data-block-id="17-methodology/02-coding-flow#2:3" data-kind="single" data-payload="%7B%22question%22%3A%22TDD%20%E7%9A%84%20Red%20%E9%98%B6%E6%AE%B5%EF%BC%8C%E6%B5%8B%E8%AF%95%E5%BA%94%E8%AF%A5%E5%A4%84%E4%BA%8E%E4%BB%80%E4%B9%88%E7%8A%B6%E6%80%81%EF%BC%9F%22%2C%22options%22%3A%5B%22%E6%B5%8B%E8%AF%95%E8%A2%AB%E8%B7%B3%E8%BF%87%EF%BC%88ignored%EF%BC%89%22%2C%22%E6%B5%8B%E8%AF%95%E9%80%9A%E8%BF%87%EF%BC%88%E7%BB%BF%E8%89%B2%EF%BC%89%EF%BC%8C%E8%A1%A8%E7%A4%BA%E5%8A%9F%E8%83%BD%E5%B7%B2%E5%AE%9E%E7%8E%B0%22%2C%22%E6%B5%8B%E8%AF%95%E5%A4%B1%E8%B4%A5%EF%BC%88%E7%BA%A2%E8%89%B2%EF%BC%89%EF%BC%8C%E8%A6%81%E4%B9%88%E7%BC%96%E8%AF%91%E4%B8%8D%E8%BF%87%EF%BC%8C%E8%A6%81%E4%B9%88%E8%BF%90%E8%A1%8C%E5%A4%B1%E8%B4%A5%22%2C%22%E6%B5%8B%E8%AF%95%E6%B2%A1%E6%9C%89%E6%96%AD%E8%A8%80%EF%BC%8C%E5%8F%AA%E6%98%AF%E8%AE%B0%E5%BD%95%E8%A1%8C%E4%B8%BA%22%5D%2C%22correct%22%3A%5B2%5D%2C%22explanation%22%3A%22Red%20%E9%98%B6%E6%AE%B5%E7%9A%84%5C%22%E7%BA%A2%5C%22%E6%98%AF%E5%88%BB%E6%84%8F%E7%9A%84%E3%80%82%E5%A6%82%E6%9E%9C%E5%86%99%E5%AE%8C%E6%B5%8B%E8%AF%95%E5%AE%83%E7%9B%B4%E6%8E%A5%E9%80%9A%E8%BF%87%E4%BA%86%EF%BC%8C%E8%AF%B4%E6%98%8E%E8%BF%99%E4%B8%AA%E6%B5%8B%E8%AF%95%E6%B2%A1%E6%9C%89%E7%9C%9F%E6%AD%A3%E5%9C%A8%E6%A3%80%E6%B5%8B%E4%BB%BB%E4%BD%95%E6%96%B0%E8%A1%8C%E4%B8%BA%E2%80%94%E2%80%94%E4%BD%A0%E5%9C%A8%E6%B5%8B%E8%AF%95%E5%B7%B2%E6%9C%89%E5%8A%9F%E8%83%BD%EF%BC%8C%E6%88%96%E8%80%85%E6%B5%8B%E8%AF%95%E6%9C%AC%E8%BA%AB%E5%86%99%E9%94%99%E4%BA%86%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div>
<div class="quiz-choice" data-block-id="17-methodology/02-coding-flow#2:4" data-kind="single" data-payload="%7B%22question%22%3A%22TDD%20%E7%9A%84%20Green%20%E9%98%B6%E6%AE%B5%E5%BC%BA%E8%B0%83%5C%22%E5%86%99%E6%9C%80%E5%B0%91%E7%9A%84%E4%BB%A3%E7%A0%81%E8%AE%A9%E6%B5%8B%E8%AF%95%E9%80%9A%E8%BF%87%5C%22%EF%BC%8C%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%83%BD%E9%A1%BA%E6%89%8B%E5%A4%9A%E5%86%99%E4%B8%80%E4%BA%9B%E5%AE%9E%E7%8E%B0%EF%BC%9F%22%2C%22options%22%3A%5B%22Rust%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%BC%9A%E6%8B%92%E7%BB%9D%E5%A4%9A%E4%BD%99%E7%9A%84%E4%BB%A3%E7%A0%81%22%2C%22%E5%A4%9A%E5%86%99%E7%9A%84%E4%BB%A3%E7%A0%81%E6%B2%A1%E6%9C%89%E5%AF%B9%E5%BA%94%E6%B5%8B%E8%AF%95%E8%A6%86%E7%9B%96%EF%BC%8C%E7%9B%B8%E5%BD%93%E4%BA%8E%E7%BB%95%E8%BF%87%E4%BA%86%E5%AE%89%E5%85%A8%E7%BD%91%EF%BC%8C%E7%AD%89%E4%BA%8E%E5%BC%95%E5%85%A5%E4%BA%86%E6%9C%AA%E7%BB%8F%E9%AA%8C%E8%AF%81%E7%9A%84%E9%80%BB%E8%BE%91%22%2C%22%E5%A4%9A%E5%86%99%E4%BB%A3%E7%A0%81%E4%BC%9A%E8%AE%A9%E7%BC%96%E8%AF%91%E5%8F%98%E6%85%A2%22%2C%22Green%20%E9%98%B6%E6%AE%B5%E6%9C%89%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%EF%BC%8C%E8%A6%81%E5%BF%AB%22%5D%2C%22correct%22%3A%5B1%5D%2C%22explanation%22%3A%22TDD%20%E7%9A%84%E4%BB%B7%E5%80%BC%E5%9C%A8%E4%BA%8E%E6%AF%8F%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E9%83%BD%E6%9C%89%E6%B5%8B%E8%AF%95%E4%BF%9D%E6%8A%A4%E3%80%82%E5%A6%82%E6%9E%9C%E5%9C%A8%20Green%20%E9%98%B6%E6%AE%B5%E5%A4%9A%E5%86%99%E4%BA%86%5C%22%E4%BB%A5%E5%90%8E%E5%8F%AF%E8%83%BD%E9%9C%80%E8%A6%81%E7%9A%84%E9%80%BB%E8%BE%91%5C%22%EF%BC%8C%E8%BF%99%E4%BA%9B%E4%BB%A3%E7%A0%81%E6%B2%A1%E6%9C%89%E6%B5%8B%E8%AF%95%EF%BC%8C%E5%87%BA%E4%BA%86%20bug%20%E4%B9%9F%E4%B8%8D%E4%BC%9A%E8%A2%AB%E5%8F%91%E7%8E%B0%E2%80%94%E2%80%94%E5%92%8C%E5%AE%8C%E5%85%A8%E4%B8%8D%E5%86%99%E6%B5%8B%E8%AF%95%E6%B2%A1%E6%9C%89%E5%8C%BA%E5%88%AB%E3%80%82%22%7D"><div class="quiz-placeholder">加载题目中…</div></div> </div>
