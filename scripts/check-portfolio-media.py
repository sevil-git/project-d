"""Check asset integrity, dimensions, formats, and responsive image coverage."""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
media = json.loads((ROOT / 'src/data/media.json').read_text())
assert len(media) == 33, 'Expected all 33 source artworks'
checked = 0
original_bytes = 0
largest_avif_bytes = 0
for art in media.values():
    original = art['original']
    path = ROOT / 'assets/client-originals' / art['filename']
    assert hashlib.sha256(path.read_bytes()).hexdigest() == original['sha256'], path
    original_bytes += path.stat().st_size
    widths = {item['width'] for item in art['variants']}
    assert min(widths) == min(480, original['width'])
    assert max(widths) == min(2048, original['width'])
    for width in widths:
        assert {item['format'] for item in art['variants'] if item['width'] == width} == {'avif', 'webp', 'jpg'}
    for item in art['variants']:
        path = ROOT / 'public' / item['url'].lstrip('/')
        assert path.stat().st_size == item['bytes']
        with Image.open(path) as image:
            assert image.size == (item['width'], item['height']), path
            assert item['width'] <= original['width']
            assert abs(item['height'] - original['height'] * item['width'] / original['width']) <= 0.5
            image.verify()
        checked += 1
    largest_avif_bytes += max((item for item in art['variants'] if item['format'] == 'avif'), key=lambda item: item['width'])['bytes']
print(f'PASS: {len(media)} unchanged source files, {checked} valid responsive derivatives; no upscaling or cropping.')
print(f'Originals: {original_bytes / 1e6:.2f} MB; one largest AVIF per artwork: {largest_avif_bytes / 1e6:.2f} MB ({100 * (1 - largest_avif_bytes / original_bytes):.1f}% fewer bytes).')
