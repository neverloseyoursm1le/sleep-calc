#!/usr/bin/env python3
import os, datetime

DOCS_DIR = "sleep-calc/docs"   # <<< путь к docs внутри репозитория
# Замените ниже HOST на финальный URL, например: "https://yourname.github.io/sleep-calc"
HOST = "https://neverloseyoursm1le.github.io/sleep-calc"  # <<< замените

def list_html(root):
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        for fn in filenames:
            if fn.lower().endswith('.html'):
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, root).replace(os.sep, '/')
                files.append(rel)
    return sorted(files)

def write_sitemap(files, outpath):
    now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for file in files:
            url = HOST.rstrip('/') + '/' + file
            f.write('  <url>\n')
            f.write(f'    <loc>{url}</loc>\n')
            f.write(f'    <lastmod>{now}</lastmod>\n')
            f.write('  </url>\n')
        f.write('</urlset>\n')
    print("Sitemap written to", outpath)

if __name__ == "__main__":
    files = list_html(DOCS_DIR)
    # ensure index.html first
    if 'index.html' in files:
        files.remove('index.html')
        files.insert(0,'index.html')
    sitemap_path = os.path.join(DOCS_DIR, 'sitemap.xml')
    write_sitemap(files, sitemap_path)
