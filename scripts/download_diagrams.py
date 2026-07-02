import os
import re
import urllib.request

diagrams_dir = r'D:\00 Work\ai-web\rust-learning\diagrams'
base_url = 'https://xyfx-fhw.github.io/diagrams/'

# All unique diagrams from grep output
diagrams = [
    'angle_of_view.svg', 'box.svg', 'clone.svg', 'compiler_goalkeeper.svg',
    'copy.svg', 'crate.svg', 'data_ptr_mut.svg', 'error.svg', 'features.svg',
    'heap.svg', 'method.svg', 'mod.svg', 'move.svg', 'package.svg',
    'package_and_crate.svg', 'rust-learning-curve.svg', 'safety_vs_speed.svg',
    'slice.svg', 'slice_string.svg', 'stack.svg', 'string.svg',
    'string_opration.svg', 'use.svg', 'w_mut.svg'
]

os.makedirs(diagrams_dir, exist_ok=True)
ok, fail = 0, 0
for name in diagrams:
    url = base_url + name
    dst = os.path.join(diagrams_dir, name)
    try:
        urllib.request.urlretrieve(url, dst)
        print(f'  OK  {name}')
        ok += 1
    except Exception as e:
        print(f'  FAIL {name}: {e}')
        fail += 1

print(f'\nDownloaded: {ok}, Failed: {fail}')
