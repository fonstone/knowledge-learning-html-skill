""" Quick test with fixes """
import sys, os, json, html as html_mod, urllib.request, urllib.parse, re, time
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
    if t == 'br': return '\n'
    if t == 'span': return ''.join(inline(c) for c in el.children)
    return ''.join(inline(c) for c in el.children)

def abs_url(src):
    if src.startswith('http'): return src
    if src.startswith('/'):
        for p in ['/RustCourse', '/rust-course']:
            if src.startswith(p):
                src = src[len(p):]
                break
        return 'https://xyfx-fhw.github.io' + src
    return src

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
            yield ('#' * int(t[1]) + ' ' + text, '')
        elif t == 'p':
            text = ''.join(inline(c) for c in child.children).strip()
            if text: yield (text, '')
        elif t == 'ul':
            for li in child.find_all('li', recursive=False):
                text = ''.join(inline(c) for c in li.children).strip()
                yield (f'- {text}', 'list')
        elif t == 'ol':
            for i, li in enumerate(child.find_all('li', recursive=False), 1):
                text = ''.join(inline(c) for c in li.children).strip()
                yield (f'{i}. {text}', 'list')
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
        elif t == 'table':
            rows = child.find_all('tr')
            if rows:
                md = []
                for ri, row in enumerate(rows):
                    cells = row.find_all(['th','td'])
                    texts = [''.join(inline(c) for c in cell.children).strip() for cell in cells]
                    md.append('| ' + ' | '.join(texts) + ' |')
                ncols = md[0].count('|') - 1
                sep = '| ' + ' | '.join(['---']*ncols) + ' |'
                yield ('\n'.join([md[0], sep] + md[1:]), '')
        elif t == 'img':
            yield (f'![{child.get("alt","")}]({abs_url(child.get("src",""))})', '')
        elif t == 'hr':
            yield ('---', '')
        elif t == 'div':
            if 'code-runner' in child.get('class',[]):
                full = child.get('data-full-code','')
                if full:
                    code = urllib.parse.unquote(full).strip()
                    yield (f'```rust\n{code}\n```', 'code')
            else:
                yield from blocks(child, depth+1)
        elif t in ('section','main','article','figure'):
            yield from blocks(child, depth+1)

def assemble(items):
    out = []
    prev = None
    for text, kind in items:
        if kind == 'list':
            if prev is not None and prev != 'list' and prev != 'code' and prev != 'raw':
                if out and out[-1] != '':
                    out.append('')
            out.append(text)
        elif kind == 'code':
            if out and out[-1] != '':
                out.append('')
            out.append(text)
            out.append('')
        elif kind == 'raw':
            if out and out[-1] != '':
                out.append('')
            out.append(text)
            out.append('')
        else:
            if prev == 'list' and out and out[-1] != '':
                out.append('')
            out.append(text)
            out.append('')
        prev = kind
    result = '\n'.join(out)
    result = re.sub(r'\n{4,}', '\n\n\n', result)
    return result.strip()

# Test 1: Image URL
print('=== Image URL test ===')
html = fetch(BASE_URL + '/chapters/09-error-handling/01-panic/')
soup = BeautifulSoup(html, 'lxml')
article = soup.find('div', id='article-content')
for sel in article.find_all(class_='section-progress'): sel.decompose()
for sel in article.find_all('script'): sel.decompose()
md = assemble(list(blocks(article)))
for line in md.split('\n'):
    if 'diagrams' in line:
        print('  Image:', line.strip())

# Test 2: List before blockquote spacing
print()
print('=== List+blockquote spacing ===')
html2 = fetch(BASE_URL + '/chapters/01-rust-basics/01-installation/')
soup2 = BeautifulSoup(html2, 'lxml')
article2 = soup2.find('div', id='article-content')
for sel in article2.find_all(class_='section-progress'): sel.decompose()
for sel in article2.find_all('script'): sel.decompose()
md2 = assemble(list(blocks(article2)))
lines = md2.split('\n')
for i, l in enumerate(lines):
    if l.startswith('>'):
        before = lines[i-2] if i >= 2 else ''
        print(f'  Before list item: {lines[i-3] if i>=3 else ""}')
        print(f'  Blank line: {lines[i-2] if i>=2 else ""}')
        print(f'  Last list: {lines[i-1] if i>=1 else ""}')
        print(f'  Blockquote: {l}')
        break
