#!/usr/bin/env python3
"""Stamps every css/js link in public/index.html with a short hash of the file's content (?v=abc123),
so phones always get the new file after an update and can cache it forever otherwise.
Run after changing any file in public/css or public/js:   python3 tools/stamp.py
(The automated tests fail if a stamp is out of date.)"""
import hashlib, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
def stamp(check=False):
    p = os.path.join(ROOT, 'index.html'); s = open(p, encoding='utf-8').read()
    bad = []
    def fix(m):
        attr, path = m.group(1), m.group(2)
        f = os.path.join(ROOT, path)
        h = hashlib.sha256(open(f, 'rb').read()).hexdigest()[:10]
        new = '%s="%s?v=%s"' % (attr, path, h)
        if new != m.group(0): bad.append(path)
        return new
    out = re.sub(r'(href|src)="((?:css|js)/[^"?]+)(?:\?v=[0-9a-f]*)?"', fix, s)
    if check:
        return bad
    if out != s: open(p, 'w', encoding='utf-8').write(out)
    return bad
if __name__ == '__main__':
    if '--check' in sys.argv:
        b = stamp(True)
        if b: print('out of date:', ', '.join(b)); sys.exit(1)
        print('stamps ok')
    else:
        b = stamp(); print('updated:', ', '.join(b) if b else 'nothing')
