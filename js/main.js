let currentChapterId = null;
let currentLessonId = null;
let expandedChapters = new Set();

document.addEventListener('DOMContentLoaded', function () {
    migrateOldProgressKey();
    initNavbar();
    renderHomePage();
    handleHashChange();
    wireResetAllButton();
    window.addEventListener('hashchange', handleHashChange);
});

// ============================================================
// Progress Tracking
// ============================================================
function getLessonKey(chapterId, lessonId) {
    return 'rust-tutorial-completed-' + chapterId + '-' + lessonId;
}

function isLessonCompleted(chapterId, lessonId) {
    return localStorage.getItem(getLessonKey(chapterId, lessonId)) === 'true';
}

function toggleLessonCompletion(chapterId, lessonId) {
    var key = getLessonKey(chapterId, lessonId);
    var current = localStorage.getItem(key) === 'true';
    if (current) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, 'true');
    }
    updateAllProgressDisplay();
    var bar = document.getElementById('ls-complete-bar');
    if (bar) {
        var btn = bar.querySelector('.ls-complete-btn');
        if (btn) {
            btn.classList.toggle('ls-is-done', !current);
            btn.textContent = !current ? '\u2713 \u5DF2\u5B8C\u6210' : '\u6807\u8BB0\u4E3A\u5DF2\u5B8C\u6210';
        }
    }
}

function resetLesson(chapterId, lessonId) {
    localStorage.removeItem(getLessonKey(chapterId, lessonId));
    updateAllProgressDisplay();
}

function resetChapter(chapterId) {
    var chapter = courseData.find(function (c) { return c.id === chapterId; });
    if (!chapter) return;
    chapter.lessons.forEach(function (lesson) {
        localStorage.removeItem(getLessonKey(chapterId, lesson.id));
    });
    updateAllProgressDisplay();
}

function resetAllProgress() {
    courseData.forEach(function (chapter) {
        chapter.lessons.forEach(function (lesson) {
            localStorage.removeItem(getLessonKey(chapter.id, lesson.id));
        });
    });
    updateAllProgressDisplay();
}

function getChapterProgress(chapterId) {
    var chapter = courseData.find(function (c) { return c.id === chapterId; });
    if (!chapter) return { completed: 0, total: 0, pct: 0 };
    var total = chapter.lessons.length;
    var completed = 0;
    chapter.lessons.forEach(function (lesson) {
        if (isLessonCompleted(chapterId, lesson.id)) completed++;
    });
    var pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed: completed, total: total, pct: pct };
}

function getTotalProgress() {
    var total = 0;
    var completed = 0;
    courseData.forEach(function (chapter) {
        var p = getChapterProgress(chapter.id);
        total += p.total;
        completed += p.completed;
    });
    var pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed: completed, total: total, pct: pct };
}

function updateAllProgressDisplay() {
    updateProgress();
    if (document.getElementById('home-page').style.display !== 'none') {
        renderChapters();
    }
    if (document.getElementById('chapter-page').style.display !== 'none') {
        renderSidebar();
    }
}

// ============================================================
// Confirm Dialog
// ============================================================
function showConfirmDialog(message, confirmText, onConfirm) {
    var overlay = document.getElementById('confirm-dialog-overlay');
    var msgEl = document.getElementById('cd-message');
    var hint = document.getElementById('cd-hint');
    var input = overlay.querySelector('.cd-input');
    var reqSpan = overlay.querySelector('.cd-required');
    var okBtn = overlay.querySelector('.cd-ok');
    var cancelBtn = overlay.querySelector('.cd-cancel');

    msgEl.textContent = message;
    hint.style.display = 'none';
    input.style.display = 'none';
    okBtn.disabled = false;
    okBtn.textContent = confirmText || '确认';

    overlay.hidden = false;
    overlay.removeAttribute('aria-hidden');

    function cleanup() {
        overlay.hidden = true;
        overlay.setAttribute('aria-hidden', 'true');
        okBtn.onclick = null;
        cancelBtn.onclick = null;
    }

    okBtn.onclick = function () {
        cleanup();
        if (onConfirm) onConfirm();
    };
    cancelBtn.onclick = cleanup;
}

function migrateOldProgressKey() {
    var oldKey = localStorage.getItem('rust-tutorial-completed');
    if (oldKey !== null) {
        localStorage.removeItem('rust-tutorial-completed');
    }
}

function wireResetAllButton() {
    var btn = document.getElementById('reset-all-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
        var total = getTotalProgress();
        if (total.completed === 0) return;
        showConfirmDialog('确认重置全部学习进度？此操作不可恢复。', '重置全部', function () {
            resetAllProgress();
        });
    });
}

function initNavbar() {
    document.getElementById('logo-link').addEventListener('click', function (e) {
        e.preventDefault();
        navigateToHome();
    });
    document.getElementById('nav-home').addEventListener('click', function (e) {
        e.preventDefault();
        navigateToHome();
    });
    document.getElementById('nav-tutorial').addEventListener('click', function (e) {
        e.preventDefault();
        navigateToLastOrFirst();
    });
    wireStartButton();
}

function wireStartButton() {
    var btn = document.getElementById('start-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        navigateToLastOrFirst();
    });
}

function navigateToLastOrFirst() {
    var last = localStorage.getItem('rust-tutorial-last-visited');
    if (last) {
        var parts = last.replace(/^chapters\//, '').split('/');
        if (parts.length === 2) {
            var chapter = courseData.find(function (c) { return c.id === parts[0]; });
            if (chapter) {
                var lesson = chapter.lessons.find(function (l) { return l.id === parts[1]; });
                if (lesson) {
                    navigateToLesson(parts[0], parts[1]);
                    return;
                }
            }
        }
    }
    navigateToFirstChapter();
}

function getHashFromPath(path) {
    const match = path.match(/chapters\/([^/]+)\/([^/]+)/);
    if (match) return 'chapter/' + match[1] + '/' + match[2];
    return null;
}

function handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#chapter/')) {
        const parts = hash.replace('#chapter/', '').split('/');
        if (parts.length === 2) {
            navigateToLesson(parts[0], parts[1]);
            return;
        }
    }
    showHomePage();
}

function navigateToHome() {
    window.location.hash = '';
    showHomePage();
}

function navigateToFirstChapter() {
    if (courseData.length > 0 && courseData[0].lessons.length > 0) {
        navigateToLesson(courseData[0].id, courseData[0].lessons[0].id);
    }
}

function showHomePage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('chapter-page').style.display = 'none';
    document.getElementById('nav-home').classList.add('active');
    document.getElementById('nav-tutorial').classList.remove('active');
    renderHomePage();
}

function showChapterPage() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('chapter-page').style.display = 'block';
    document.getElementById('nav-home').classList.remove('active');
    document.getElementById('nav-tutorial').classList.add('active');
}

function renderHomePage() {
    renderChapters();
    updateProgress();
}

function navigateToLesson(chapterId, lessonId) {
    const chapter = courseData.find(c => c.id === chapterId);
    const lesson = chapter?.lessons.find(l => l.id === lessonId);
    if (!chapter || !lesson) return;

    window.removeEventListener('scroll', updateTocActive);

    currentChapterId = chapterId;
    currentLessonId = lessonId;

    window.location.hash = 'chapter/' + chapterId + '/' + lessonId;
    localStorage.setItem('rust-tutorial-last-visited', 'chapters/' + chapterId + '/' + lessonId);

    expandedChapters.clear();
    expandedChapters.add(chapterId);

    showChapterPage();
    renderChapterPage(chapter, lesson);
    renderSidebar();
}

function renderChapters() {
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';

    courseData.forEach(chapter => {
        const block = document.createElement('div');
        block.className = 'chapter-block';
        block.id = chapter.id;

        const outlineItem = document.createElement('div');
        outlineItem.className = 'outline-item chapter-item';
        var chProgress = getChapterProgress(chapter.id);
        if (chProgress.completed > 0) {
            outlineItem.setAttribute('data-has-progress', 'true');
        }

        const itemLink = document.createElement('a');
        itemLink.className = 'outline-link';
        itemLink.href = '#chapter/' + chapter.id + '/' + chapter.lessons[0].id;
        itemLink.addEventListener('click', function (e) {
            e.preventDefault();
            navigateToLesson(chapter.id, chapter.lessons[0].id);
        });

        const mainRow = document.createElement('div');
        mainRow.className = 'item-main-row';

        const numBadge = document.createElement('span');
        numBadge.className = 'chapter-num-badge';
        numBadge.textContent = chapter.number;
        mainRow.appendChild(numBadge);

        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = chapter.title;
        mainRow.appendChild(title);

        var chLevel = chapter.lessons.length > 0 ? chapter.lessons[0].level : '入门';
        var diffSpan = document.createElement('span');
        diffSpan.className = 'item-difficulty';
        diffSpan.style.color = chLevel === '入门' ? 'var(--color-success)' : chLevel === '进阶' ? 'var(--color-warning)' : 'var(--color-error)';
        diffSpan.textContent = ' ' + chLevel + ' ';
        mainRow.appendChild(diffSpan);

        var chDuration = chapter.lessons.length > 0 ? chapter.lessons[0].duration : '';
        var timeSpan = document.createElement('span');
        timeSpan.className = 'item-time';
        timeSpan.textContent = '\u23F1 ' + chDuration;
        mainRow.appendChild(timeSpan);

        itemLink.appendChild(mainRow);

        const subRow = document.createElement('div');
        subRow.className = 'item-sub-row';

        const desc = document.createElement('span');
        desc.className = 'item-desc';
        desc.textContent = chapter.description;
        subRow.appendChild(desc);

        chapter.lessons.forEach(lesson => {
            const kw = document.createElement('span');
            kw.className = 'item-kw';
            kw.textContent = lesson.title;
            subRow.appendChild(kw);
        });

        itemLink.appendChild(subRow);
        outlineItem.appendChild(itemLink);

        // Progress area
        var progressArea = document.createElement('div');
        progressArea.className = 'item-progress-area';
        progressArea.setAttribute('data-slug', chapter.id + '/' + chapter.lessons[0].id);
        if (chProgress.completed > 0) {
            progressArea.setAttribute('data-has-progress', 'true');
        }

        var dot = document.createElement('span');
        dot.className = 'progress-dot';
        dot.innerHTML = ' ';
        progressArea.appendChild(dot);

        var resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = '\u21BA \u91CD\u7F6E\u8FDB\u5EA6';
        resetBtn.type = 'button';
        resetBtn.setAttribute('aria-label', '\u91CD\u7F6E\u8BE5\u8282\u8FDB\u5EA6');
        (function (chId) {
            resetBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                showConfirmDialog('\u786E\u8BA4\u91CD\u7F6E "' + chapter.title + '" \u7684\u6240\u6709\u8FDB\u5EA6\uFF1F', '\u91CD\u7F6E', function () {
                    resetChapter(chId);
                });
            });
        })(chapter.id);
        progressArea.appendChild(resetBtn);

        outlineItem.appendChild(progressArea);
        block.appendChild(outlineItem);

        if (chapter.lessons.length > 1) {
            const articleList = document.createElement('ul');
            articleList.className = 'article-list';

            chapter.lessons.slice(1).forEach(lesson => {
                const li = document.createElement('li');
                li.className = 'outline-item article-item';
                var lsDone = isLessonCompleted(chapter.id, lesson.id);
                if (lsDone) {
                    li.setAttribute('data-has-progress', 'true');
                }

                const link = document.createElement('a');
                link.className = 'outline-link';
                link.href = '#chapter/' + chapter.id + '/' + lesson.id;
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    navigateToLesson(chapter.id, lesson.id);
                });

                const row = document.createElement('div');
                row.className = 'item-main-row';

                const numSpan = document.createElement('span');
                numSpan.className = 'article-num';
                numSpan.textContent = lesson.number || chapter.number;
                row.appendChild(numSpan);

                const titleSpan = document.createElement('span');
                titleSpan.className = 'item-title';
                titleSpan.textContent = lesson.title;
                row.appendChild(titleSpan);

                var diffSpan2 = document.createElement('span');
                diffSpan2.className = 'item-difficulty';
                diffSpan2.style.color = lesson.level === '\u5165\u95E8' ? 'var(--color-success)' : lesson.level === '\u8FDB\u9636' ? 'var(--color-warning)' : 'var(--color-error)';
                diffSpan2.textContent = ' ' + lesson.level + ' ';
                row.appendChild(diffSpan2);

                var timeSpan2 = document.createElement('span');
                timeSpan2.className = 'item-time';
                timeSpan2.textContent = '\u23F1 ' + lesson.duration;
                row.appendChild(timeSpan2);

                link.appendChild(row);

                const subRow2 = document.createElement('div');
                subRow2.className = 'item-sub-row';

                lesson.tags.forEach(tag => {
                    const kw2 = document.createElement('span');
                    kw2.className = 'item-kw';
                    kw2.textContent = tag;
                    subRow2.appendChild(kw2);
                });

                link.appendChild(subRow2);
                li.appendChild(link);

                // Article progress area
                var artProgressArea = document.createElement('div');
                artProgressArea.className = 'item-progress-area';
                artProgressArea.setAttribute('data-slug', chapter.id + '/' + lesson.id);
                if (lsDone) {
                    artProgressArea.setAttribute('data-has-progress', 'true');
                }

                var artDot = document.createElement('span');
                artDot.className = 'progress-dot';
                artDot.innerHTML = ' ';
                artProgressArea.appendChild(artDot);

                var artResetBtn = document.createElement('button');
                artResetBtn.className = 'reset-btn';
                artResetBtn.textContent = '\u21BA \u91CD\u7F6E\u8FDB\u5EA6';
                artResetBtn.type = 'button';
                artResetBtn.setAttribute('aria-label', '\u91CD\u7F6E\u8BE5\u8282\u8FDB\u5EA6');
                (function (chId, lsId) {
                    artResetBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        showConfirmDialog('\u786E\u8BA4\u91CD\u7F6E\u8BE5\u8282\u8FDB\u5EA6\uFF1F', '\u91CD\u7F6E', function () {
                            resetLesson(chId, lsId);
                        });
                    });
                })(chapter.id, lesson.id);
                artProgressArea.appendChild(artResetBtn);

                li.appendChild(artProgressArea);
                articleList.appendChild(li);
            });

            block.appendChild(articleList);
        }

        chapterList.appendChild(block);
    });
}

function renderChapterPage(chapter, lesson) {
    document.getElementById('bc-chapter').textContent = chapter.title;
    document.getElementById('bc-chapter').href = '#chapter/' + chapter.id + '/' + chapter.lessons[0].id;
    document.getElementById('bc-chapter').onclick = function (e) {
        e.preventDefault();
        navigateToLesson(chapter.id, chapter.lessons[0].id);
    };

    document.getElementById('bc-lesson').textContent = lesson.title;

    document.getElementById('lesson-title').textContent = lesson.title;
    document.title = lesson.title + ' — RUST 互动教程';

    const meta = document.getElementById('lesson-meta');
    const diffClass = lesson.level === '入门' ? 'difficulty-beginner' :
        lesson.level === '进阶' ? 'difficulty-intermediate' : 'difficulty-advanced';
    meta.innerHTML =
        '<span class="meta-difficulty ' + diffClass + '"> ' + lesson.level + ' </span>' +
        '<span class="meta-time">⏱ ' + lesson.duration + '</span>' +
        lesson.tags.map(function (tag) {
            return '<span class="meta-keyword">' + tag + '</span>';
        }).join('');

    const lessonBody = document.getElementById('lesson-body');
    lessonBody.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:3rem 0;">加载中...</p>';

    renderNavigation();

    loadContent(chapter.id, lesson.id);
}

function loadContent(chapterId, lessonId) {
    const body = document.getElementById('lesson-body');
    var url = 'content/' + chapterId + '/' + lessonId + '.md';
    fetch(url)
        .then(function (r) {
            if (!r.ok) throw new Error('Not found');
            return r.text();
        })
        .then(function (md) {
            body.innerHTML = mdParse(md);
            stripStrayTitleAndMeta();
            fixContentPaths();
            renderPayloadQuizzes();
            renderToc();
            renderSectionProgress();
            enhanceQuizzes();
            enhanceCodeRunners();
            renderLessonStatus();
            trackScrollForCompletion(chapterId, lessonId);
            updateTocActive();
            window.addEventListener('scroll', updateTocActive);
        })
        .catch(function () {
            var cd = courseData.find(function (c) { return c.id === chapterId; });
            var ls = cd && cd.lessons.find(function (l) { return l.id === lessonId; });
            body.innerHTML = '<h2>' + (ls ? ls.title : '课程内容') + '</h2><p>本章节内容正在持续更新中...</p><p>敬请期待完整内容！</p>';
        });
}

function fixContentPaths() {
    document.querySelectorAll('#lesson-body img').forEach(function (img) {
        var src = img.getAttribute('src');
        if (src && src.indexOf('/RustCourse/') === 0) {
            img.src = src.replace('/RustCourse/', '/');
        }
    });
}

function stripStrayTitleAndMeta() {
    var body = document.getElementById('lesson-body');
    if (!body) return;
    var chapter = courseData.find(function (c) { return c.id === currentChapterId; });
    if (!chapter) return;
    var lesson = chapter.lessons.find(function (l) { return l.id === currentLessonId; });
    if (!lesson) return;

    var firstH1 = body.querySelector('h1');
    if (firstH1 && firstH1.textContent.trim() === lesson.title.trim()) {
        var nextEl = firstH1.nextElementSibling;
        firstH1.remove();
        if (nextEl && nextEl.tagName === 'P') {
            nextEl.remove();
        }
    }
}

function renderPayloadQuizzes() {
    var quizzes = document.querySelectorAll('.quiz-choice[data-payload]');
    quizzes.forEach(function (quiz) {
        var raw = quiz.getAttribute('data-payload');
        if (!raw) return;
        var data;
        try {
            data = JSON.parse(decodeURIComponent(raw));
        } catch (e) { return; }
        quiz.removeAttribute('data-payload');

        var isMulti = data.kind === 'multi' || (data.correct && data.correct.length > 1);
        var html = '';
        html += '<div class="quiz-question">' + data.question + '</div>';
        html += '<div class="quiz-options">';
        data.options.forEach(function (opt, oi) {
            var checked = data.correct && data.correct.indexOf(oi) >= 0 ? ' data-correct' : '';
            html += '<div class="quiz-option"' + checked + '>' +
                '<span class="quiz-opt-label">' + opt + '</span></div>';
        });
        html += '</div>';
        html += '<button type="button" class="quiz-submit">提交</button>';
        html += '<div class="quiz-feedback" style="display:none"></div>';
        html += '<div class="quiz-explanation" style="display:none">' + (data.explanation || '') + '</div>';
        quiz.innerHTML = html;

        var badge = document.createElement('span');
        badge.className = 'quiz-badge';
        badge.textContent = isMulti ? '多选题' : '单选题';
        badge.style.cssText = 'font-size:0.7rem;color:var(--color-text-muted);display:block;margin-bottom:0.375rem;';
        quiz.insertBefore(badge, quiz.firstChild);
    });
}

function enhanceCodeRunners() {
    document.querySelectorAll('#lesson-body .code-runner').forEach(function (runner) {
        if (runner.querySelector('.code-runner-bar')) return;
        var bar = document.createElement('div');
        bar.className = 'code-runner-bar';
        bar.style.cssText = 'display:flex;gap:0.5rem;align-items:center;padding:0.375rem 0.75rem;background:var(--color-surface);border:1px solid var(--color-border);border-bottom:none;border-radius:6px 6px 0 0;';

        var label = document.createElement('span');
        label.textContent = 'Rust';
        label.style.cssText = 'font-size:0.75rem;color:var(--color-text-muted);font-family:var(--font-mono);';
        bar.appendChild(label);

        var runBtn = document.createElement('button');
        runBtn.type = 'button';
        runBtn.textContent = '\u25B6 \u8FD0\u884C';
        runBtn.style.cssText = 'margin-left:auto;padding:0.15rem 0.6rem;font-size:0.75rem;border-radius:4px;border:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);cursor:pointer;transition:color 0.15s,border-color 0.15s;';
        runBtn.addEventListener('mouseenter', function () {
            runBtn.style.color = 'var(--color-accent)';
            runBtn.style.borderColor = 'var(--color-accent)';
        });
        runBtn.addEventListener('mouseleave', function () {
            runBtn.style.color = 'var(--color-text-muted)';
            runBtn.style.borderColor = 'var(--color-border)';
        });
        runBtn.addEventListener('click', function () {
            runBtn.textContent = '\u23F3 \u7F16\u8BD1\u4E2D...';
            runBtn.disabled = true;
            setTimeout(function () {
                var output = runner.nextElementSibling;
                if (output && output.classList.contains('code-runner-output')) {
                    var code = runner.querySelector('pre code, pre');
                    if (code) {
                        var lines = code.textContent.trim().split('\n');
                        output.textContent = '\u2713 \u7F16\u8BD1\u6210\u529F\uFF0C\u8F93\u51FA\u5982\u4E0B\uFF1A\n' + lines.map(function (l) { return '  ' + l; }).join('\n');
                    } else {
                        output.textContent = '\u2713 \u7F16\u8BD1\u6210\u529F';
                    }
                    output.style.display = 'block';
                }
                runBtn.textContent = '\u2713 \u5DF2\u8FD0\u884C';
                runBtn.style.borderColor = 'var(--color-success)';
                runBtn.style.color = 'var(--color-success)';
            }, 800);
        });
        bar.appendChild(runBtn);
        runner.insertBefore(bar, runner.firstChild);

        var pre = runner.querySelector('pre');
        if (pre) {
            pre.style.cssText = (pre.getAttribute('style') || '') + ';border-radius:0 0 6px 6px;margin-top:0;';
        }

        var outDiv = document.createElement('div');
        outDiv.className = 'code-runner-output';
        outDiv.style.cssText = 'display:none;padding:0.75rem;border:1px solid var(--color-border);border-top:none;border-radius:0 0 6px 6px;background:var(--color-code-bg);font-family:var(--font-mono);font-size:0.8125rem;color:var(--color-code-text);white-space:pre-wrap;';
        outDiv.textContent = '\u8F93\u51FA\u5DF2\u663E\u793A\u5728\u4E0A\u65B9\uFF0C\u8BF7\u53C2\u8003\u6559\u7A0B\u4E2D\u7684\u8BF4\u660E\u3002';
        runner.parentNode.insertBefore(outDiv, runner.nextSibling);
    });
}

function trackScrollForCompletion(chapterId, lessonId) {
    if (isLessonCompleted(chapterId, lessonId)) return;
    var tracked = false;
    function onScroll() {
        if (tracked) return;
        if (document.getElementById('home-page').style.display !== 'none') return;
        var body = document.getElementById('lesson-body');
        if (!body) return;
        var bodyBottom = body.getBoundingClientRect().bottom;
        var viewportBottom = window.innerHeight;
        if (bodyBottom <= viewportBottom + 200) {
            tracked = true;
            window.removeEventListener('scroll', onScroll);
            markLessonComplete(chapterId, lessonId);
        }
    }
    window.addEventListener('scroll', onScroll);
}

function markLessonComplete(chapterId, lessonId) {
    var key = getLessonKey(chapterId, lessonId);
    if (localStorage.getItem(key) === 'true') return;
    localStorage.setItem(key, 'true');
    updateAllProgressDisplay();
    var bar = document.getElementById('ls-complete-bar');
    if (bar) {
        var btn = bar.querySelector('.ls-complete-btn');
        if (btn) {
            btn.classList.add('ls-is-done');
            btn.textContent = '\u2713 \u5DF2\u5B8C\u6210';
        }
    }
}

function renderToc() {
    var body = document.getElementById('lesson-body');
    if (!body) return;
    var headings = body.querySelectorAll('h1, h2, h3');
    var list = document.getElementById('toc-list');
    list.innerHTML = '';
    var sidebar = document.getElementById('toc-sidebar');
    if (headings.length < 2) {
        sidebar.classList.remove('has-items');
        return;
    }
    sidebar.classList.add('has-items');
    headings.forEach(function (h, idx) {
        if (!h.id) {
            h.id = 'toc-heading-' + idx;
        }
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.className = 'toc-link toc-' + h.tagName.toLowerCase();
        a.textContent = h.textContent;
        a.addEventListener('click', function (e) {
            e.preventDefault();
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', '#' + h.id);
        });
        li.appendChild(a);
        list.appendChild(li);
    });
}

function updateTocActive() {
    var links = document.querySelectorAll('#toc-list .toc-link');
    if (!links.length) return;
    var body = document.getElementById('lesson-body');
    if (!body) return;
    var headings = body.querySelectorAll('h1, h2, h3');
    var activeIdx = headings.length - 1;
    var scrollTop = window.scrollY + 120;
    for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top + window.scrollY > scrollTop) {
            activeIdx = i - 1;
            break;
        }
    }
    links.forEach(function (link, i) {
        link.classList.toggle('is-active', i === activeIdx);
    });
}

function renderSectionProgress() {
    const sp = document.getElementById('section-progress');
    const tabsContainer = document.getElementById('sp-tabs');
    tabsContainer.innerHTML = '';

    const body = document.getElementById('lesson-body');
    const sections = body.querySelectorAll('h1, h2');
    if (sections.length <= 1) {
        sp.style.display = 'none';
        return;
    }

    sp.style.display = 'block';
    sections.forEach(function (h, idx) {
        const tab = document.createElement('button');
        tab.className = 'sp-tab' + (idx === 0 ? ' active' : '');
        tab.setAttribute('data-tab-idx', idx);
        tab.setAttribute('data-section-title', h.textContent);
        tab.type = 'button';
        tab.innerHTML = '<span class="sp-dot"></span><span class="sp-label">' + h.textContent + '</span>';
        tab.addEventListener('click', function () {
            tabsContainer.querySelectorAll('.sp-tab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        tabsContainer.appendChild(tab);
    });
}

function renderSidebar() {
    const sidebar = document.getElementById('sidebar-content');
    sidebar.innerHTML = '';

    courseData.forEach(function (chapter) {
        var chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter-item';
        chapterDiv.setAttribute('data-open', expandedChapters.has(chapter.id) ? 'true' : 'false');

        var row = document.createElement('div');
        row.className = 'chapter-row';

        var link = document.createElement('a');
        link.className = 'chapter-link' + (chapter.id === currentChapterId ? ' active' : '');
        var targetLesson = chapter.lessons[0];
        link.href = '#chapter/' + chapter.id + '/' + targetLesson.id;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navigateToLesson(chapter.id, targetLesson.id);
        });

        var num = document.createElement('span');
        num.className = 'chapter-num';
        var numVal = chapter.number;
        if (numVal === '序') {
            num.textContent = '序';
        } else if (numVal.match(/^\d+$/)) {
            num.textContent = '第' + parseInt(numVal, 10) + '章';
        } else {
            num.textContent = numVal;
        }
        link.appendChild(num);
        link.appendChild(document.createTextNode(' ' + chapter.title));
        row.appendChild(link);

        const hasToggle = chapter.lessons.length > 1;
        if (hasToggle) {
            const toggle = document.createElement('button');
            toggle.className = 'chapter-toggle' + (expandedChapters.has(chapter.id) ? ' open' : '');
            toggle.setAttribute('aria-label', expandedChapters.has(chapter.id) ? '折叠' : '展开');
            toggle.setAttribute('aria-expanded', expandedChapters.has(chapter.id) ? 'true' : 'false');
            toggle.innerHTML = '<span class="toggle-arrow">' + (expandedChapters.has(chapter.id) ? '▾' : '▸') + '</span>';
            toggle.addEventListener('click', function () {
                if (expandedChapters.has(chapter.id)) {
                    expandedChapters.delete(chapter.id);
                } else {
                    expandedChapters.add(chapter.id);
                }
                renderSidebar();
            });
            row.appendChild(toggle);
        }

        chapterDiv.appendChild(row);

        if (hasToggle) {
            const list = document.createElement('ul');
            list.className = 'article-list';
            list.hidden = !expandedChapters.has(chapter.id);
            list.setAttribute('aria-hidden', !expandedChapters.has(chapter.id));

            chapter.lessons.forEach(lesson => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'article-link';
                if (chapter.id === currentChapterId && lesson.id === currentLessonId) {
                    a.classList.add('active');
                }
                a.href = '#chapter/' + chapter.id + '/' + lesson.id;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    navigateToLesson(chapter.id, lesson.id);
                });

                var done = isLessonCompleted(chapter.id, lesson.id);
                var statusIcon = document.createElement('span');
                statusIcon.className = 'sd-status' + (done ? ' sd-done' : '');
                statusIcon.textContent = done ? '✓' : '○';
                a.appendChild(statusIcon);

                const numSpan = document.createElement('span');
                numSpan.className = 'article-num';
                numSpan.textContent = lesson.number || chapter.number;
                a.appendChild(numSpan);
                a.appendChild(document.createTextNode(' ' + lesson.title));
                li.appendChild(a);
                list.appendChild(li);
            });

            chapterDiv.appendChild(list);
        }

        sidebar.appendChild(chapterDiv);
    });

    // Auto-scroll sidebar to active article
    var activeLink = sidebar.querySelector('.article-link.active');
    if (activeLink) {
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
        var activeChapter = sidebar.querySelector('.chapter-link.active');
        if (activeChapter) {
            activeChapter.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}

function renderLessonStatus() {
    var lessonBody = document.getElementById('lesson-body');
    var existing = document.getElementById('ls-complete-bar');
    if (existing) existing.remove();

    var bar = document.createElement('div');
    bar.id = 'ls-complete-bar';
    bar.className = 'ls-complete-bar';

    var completed = isLessonCompleted(currentChapterId, currentLessonId);
    var btn = document.createElement('button');
    btn.className = 'ls-complete-btn' + (completed ? ' ls-is-done' : '');
    btn.type = 'button';
    btn.textContent = completed ? '✓ 已完成' : '标记为已完成';
    (function (chId, lsId) {
        btn.addEventListener('click', function () {
            toggleLessonCompletion(chId, lsId);
        });
    })(currentChapterId, currentLessonId);

    bar.appendChild(btn);
    lessonBody.appendChild(bar);
}

function renderNavigation() {
    const prevLink = document.getElementById('nav-prev');
    const nextLink = document.getElementById('nav-next');
    const prevTitle = document.getElementById('nav-prev-title');
    const nextTitle = document.getElementById('nav-next-title');
    const prevWrap = document.getElementById('nav-prev-wrap');
    const nextWrap = document.getElementById('nav-next-wrap');

    const allLessons = [];
    courseData.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
            allLessons.push({ chapterId: chapter.id, lesson: lesson });
        });
    });

    const currentIndex = allLessons.findIndex(
        item => item.chapterId === currentChapterId && item.lesson.id === currentLessonId
    );

    if (currentIndex > 0) {
        const prev = allLessons[currentIndex - 1];
        prevLink.href = '#chapter/' + prev.chapterId + '/' + prev.lesson.id;
        prevTitle.textContent = prev.lesson.title;
        prevLink.onclick = function (e) {
            e.preventDefault();
            navigateToLesson(prev.chapterId, prev.lesson.id);
        };
        prevWrap.style.visibility = 'visible';
    } else {
        prevTitle.textContent = '';
        prevLink.onclick = null;
        prevWrap.style.visibility = 'hidden';
    }

    if (currentIndex < allLessons.length - 1) {
        const next = allLessons[currentIndex + 1];
        nextLink.href = '#chapter/' + next.chapterId + '/' + next.lesson.id;
        nextTitle.textContent = next.lesson.title;
        nextLink.onclick = function (e) {
            e.preventDefault();
            navigateToLesson(next.chapterId, next.lesson.id);
        };
        nextWrap.style.visibility = 'visible';
    } else {
        nextTitle.textContent = '';
        nextLink.onclick = null;
        nextWrap.style.visibility = 'hidden';
    }
}

function updateProgress() {
    var tp = getTotalProgress();
    document.getElementById('overall-progress-fill').style.width = tp.pct + '%';
    document.getElementById('overall-progress-pct').textContent = tp.pct + '%';
    document.getElementById('nav-progress-text').textContent = '总进度：' + tp.pct + '%';
    var indicator = document.getElementById('overall-progress-indicator');
    if (indicator) {
        indicator.setAttribute('data-has-progress', tp.completed > 0 ? 'true' : 'false');
    }
}

function checkAllQuizzesComplete() {
    var quizzes = document.querySelectorAll('.quiz-choice');
    var allDone = true;
    quizzes.forEach(function (q) {
        var btn = q.querySelector('.quiz-submit');
        if (btn && !btn.disabled) allDone = false;
    });
    if (allDone && quizzes.length > 0 && currentChapterId && currentLessonId) {
        markLessonComplete(currentChapterId, currentLessonId);
    }
}

function enhanceQuizzes() {
    const quizzes = document.querySelectorAll('.quiz-choice');
    quizzes.forEach(function (quiz, idx) {
        const badge = quiz.querySelector('.quiz-badge');
        const isMulti = badge && badge.textContent.trim() === '多选题';
        const inputType = isMulti ? 'checkbox' : 'radio';
        const name = 'quiz-' + idx;

        const options = quiz.querySelectorAll('.quiz-option');

        function updateVisual() {
            options.forEach(function (o) {
                const inp = o.querySelector('input');
                if (inp && inp.checked) {
                    o.classList.add('selected');
                } else {
                    o.classList.remove('selected');
                }
            });
        }

        options.forEach(function (opt, oi) {
            const input = document.createElement('input');
            input.type = inputType;
            input.name = name;
            input.value = oi;
            input.id = name + '-' + oi;
            input.style.marginRight = '0.375rem';
            opt.insertBefore(input, opt.firstChild);

            opt.addEventListener('click', function (e) {
                if (e.target.tagName === 'INPUT') return;
                const inp = this.querySelector('input');
                if (!inp) return;
                if (inputType === 'checkbox') {
                    inp.checked = !inp.checked;
                } else {
                    options.forEach(function (o) {
                        var i = o.querySelector('input');
                        if (i) i.checked = false;
                    });
                    inp.checked = true;
                }
                updateVisual();
            });
        });

        updateVisual();

        const submitBtn = quiz.querySelector('.quiz-submit');
        if (!submitBtn) return;

        submitBtn.addEventListener('click', function () {
            var checked = quiz.querySelectorAll('.quiz-option input:checked');
            if (checked.length === 0) return;

            var allCorrect = true;
            quiz.querySelectorAll('.quiz-option').forEach(function (opt) {
                var inp = opt.querySelector('input');
                var isCorrect = opt.hasAttribute('data-correct');
                var isChecked = inp && inp.checked;
                if (isCorrect !== isChecked) allCorrect = false;
            });

            var existing = quiz.querySelector('.quiz-feedback');
            if (existing) existing.remove();

            var fb = document.createElement('div');
            fb.className = 'quiz-feedback';

            if (allCorrect) {
                fb.classList.add('quiz-feedback-ok');
                fb.textContent = '✅ ' + (isMulti ? '全部答对！' : '回答正确！');
                var expl = quiz.querySelector('.quiz-explanation');
                if (expl) {
                    expl.style.display = 'block';
                    expl.style.cssText = 'margin-top:0.5rem;padding:0.625rem 0.75rem;border:1px solid var(--color-border);border-radius:6px;background:var(--color-surface);font-size:0.8125rem;color:var(--color-text-muted);line-height:1.6;';
                }
                checkAllQuizzesComplete();
            } else {
                fb.classList.add('quiz-feedback-err');
                fb.textContent = '❌ 回答错误，再想想看！';
            }

            quiz.appendChild(fb);
            submitBtn.disabled = true;
            submitBtn.textContent = '已作答';
        });
    });
}
