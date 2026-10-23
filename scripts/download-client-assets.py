"""Download the 33 publicly shared source files catalogued from the client's folder."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/client-originals'
items = json.loads((DEST / 'source-manifest.json').read_text())

def download(item):
    target = DEST / item['filename']
    if target.exists() and target.stat().st_size > 0:
        return item['filename'] + ' (already downloaded)'
    temporary = target.with_suffix('.download')
    subprocess.run(['curl', '-L', '--fail', '--silent', '--show-error', '--retry', '2',
                    '--max-time', '90',
                    'https://drive.google.com/uc?export=download&id=' + item['id'],
                    '-o', str(temporary)], check=True)
    if temporary.read_bytes()[:2] != b'\xff\xd8':
        raise ValueError('Expected a JPEG for ' + item['filename'])
    temporary.rename(target)
    return item['filename']

with ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(download, items):
        print(result, flush=True)
