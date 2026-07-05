""" Quick test of reclone conversion pipeline """
import sys, os, urllib.request, urllib.parse, json, html as html_mod, time, re
from bs4 import BeautifulSoup, NavigableString, Tag

BASE_URL = 'https://xyfx-fhw.github.io/RustCourse'

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8')

def inline(el):
    if isinstance(el, NavigableString): return html_mod.unescape(str(el))
    if not isinstance(el, Tag): return ''
    t = el.name
    if t in ('strong','b'):
        inner = ''.join(inline(c) for c in el.children).strip()
        return f'**{inner}**' if inner else ''
    if t in ('em','i'):
        inner = ''.join(inline(c) for c in el.children).strip()
        return f'*{inner}*' if inner else ''
    if t == 'code': return f'`{el.get_text()}`'
    if t == 'a':
        text = ''.join(inline(c) for c in el.children).strip()
        h = el.get('href','')
        if h.startswith('/RustCourse/'):
            p = h.replace('/RustCourse','').rstrip('/')
            if p.startswith('/chapters/'): h = f'#/chapters/{p.replace("/chapters/","")}'
            else: h = f'#{p}' if p else '#'
        elif h.startswith('./'): h = f'#/chapters/{h.replace("./","")}'
        return f'[{text}]({h})' if text else ''
    if t == 'img':
        src = el.get('src','')
        if src.startswith('/'): src = BASE_URL + src
        return f'![{el.get("alt","")}]({src})'
    if t == 'br': return '\n'
    if t == 'span': return ''.join(inline(c) for c in el.children)
    return ''.join(inline(c) for c in el.children)

def blocks(container, depth=0):
    if depth > 20: return
    for child in container.children:
        if isinstance(child, NavigableString):
            t = str(child).strip()
            if t: yield (html_mod.unescape(t), '')
            continue
        if not isinstance(child, Tag): continue
        t = child.name
        if t in ('quiz-choice','quiz-group'): yield (str(child), 'raw')
        elif t in ('h1','h2','h3','h4','h5','h6'):
            text = ''.join(inline(c) for c in child.children).strip()
            level = int(t[1])
            yield ('#' * level + ' ' + text, '')
        elif t == 'p':
            text = ''.join(inline(c) for c in child.children).strip()
            if text: yield (text, '')
        elif t == 'ul':
            for li in child.find_all('li', recursive=False):
                text = ''.join(inline(c) for c in li.children).strip()
                if text: yield (f'- {text}', 'list')
        elif t == 'ol':
            for i, li in enumerate(child.find_all('li', recursive=False), 1):
                text = ''.join(inline(c) for c in li.children).strip()
                if text: yield (f'{i}. {text}', 'list')
        elif t == 'pre':
            lang = child.get('data-language','')
            ct = child.find('code')
            if ct and not lang:
                for cls in ct.get('class',[]):
                    if cls.startswith('language-'): lang = cls.replace('language-',''); break
            code_text = child.get_text('\n').strip('\n')
            if code_text.strip(): yield (f'```{lang}\n{code_text}\n```', 'code')
        elif t == 'blockquote':
            text = ''.join(inline(c) for c in child.children).strip()
            lines = text.split('\n')
            yield ('\n'.join(f'> {l.strip()}' for l in lines if l.strip()), '')
        elif t == 'img':
            src = child.get('src','')
            if src.startswith('/'): src = BASE_URL + src
            yield (f'![{child.get("alt","")}]({src})', '')
        elif t == 'hr': yield ('---', '')
        elif t == 'div':
            if 'code-runner' in child.get('class',[]):
                full = child.get('data-full-code','')
                if full:
                    code = urllib.parse.unquote(full).strip()
                    yield (f'```rust\n{code}\n```', 'code')
            else:
                yield from blocks(child, depth+1)
        elif t in ('section','main','article','figure'): yield from blocks(child, depth+1)

def assemble(items):
    out = []
    for text, kind in items:
        if kind == 'code':
            if out and out[-1] != '': out.append('')
            out.append(text); out.append('')
        elif kind == 'raw':
            if out and out[-1] != '': out.append('')
            out.append(text); out.append('')
        elif kind == 'list':
            out.append(text)
        else:
            out.append(text); out.append('')
    result = '\n'.join(out)
    result = re.sub(r'\n{4,}', '\n\n\n', result)
    return result.strip()

# Test 3 pages
tests = ['00-preface/00-index', '01-rust-basics/01-installation', '09-error-handling/01-panic']
for slug in tests:
    url = f'{BASE_URL}/chapters/{slug}/'
    print(f'\n=== {slug} ===')
    try:
        html = fetch(url)
        soup = BeautifulSoup(html, 'lxml')
        article = soup.find('div', id='article-content')
        for sel in article.find_all(class_='section-progress'): sel.decompose()
        for sel in article.find_all('script'): sel.decompose()
        items = list(blocks(article))
        md = assemble(items)
        print(md[:600])
        print(f'... (total {len(md)} chars)')
    except Exception as e:
        import traceback
        print(f'ERROR: {e}')
        traceback.print_exc()
