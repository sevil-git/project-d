"""Build responsive assets from untouched client JPEGs. Requires Pillow with AVIF/WebP."""
from pathlib import Path
from PIL import Image, ImageOps, ImageCms, features
import hashlib
import io
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'assets/client-originals'
OUTPUT = ROOT / 'public/work'
DATA = ROOT / 'src/data/media.json'
Image.MAX_IMAGE_PIXELS = 120_000_000  # The supplied DEJA poster is 97.9 MP.


def main():
    if not features.check('webp') or not features.check('avif'):
        raise RuntimeError('Pillow must support AVIF and WebP')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    DATA.parent.mkdir(parents=True, exist_ok=True)
    manifest = {}
    sources = json.loads((SOURCES / 'source-manifest.json').read_text())
    for item in sources:
        path = SOURCES / item['filename']
        raw = path.read_bytes()
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source)
            # Convert tagged color spaces before removing metadata from web derivatives.
            profile = source.info.get('icc_profile')
            if profile:
                image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(profile)),
                                                  ImageCms.createProfile('sRGB'), outputMode='RGB')
            else:
                image = image.convert('RGB')
            w, h = image.size
            widths = sorted(set(min(w, width) for width in [480, 960, 1600, 2048]))
            variants = []
            for width in widths:
                height = round(h * width / w)
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                for extension, options in [
                    ('avif', {'quality': 75, 'speed': 6, 'subsampling': '4:4:4', 'max_threads': 2}),
                    ('webp', {'quality': 90, 'method': 6}),
                    ('jpg', {'quality': 92, 'subsampling': 0, 'optimize': True, 'progressive': True}),
                ]:
                    filename = f"{item['slug']}-{width}.{extension}"
                    output = OUTPUT / filename
                    resized.save(output, **options)
                    variants.append({'width': width, 'height': height, 'format': extension,
                                     'url': f'/work/{filename}', 'bytes': output.stat().st_size})
                resized.close()
            image.close()
        manifest[item['slug']] = {
            'id': item['slug'], 'filename': item['filename'], 'sourceUrl': item['source'],
            'original': {'width': w, 'height': h, 'bytes': len(raw),
                         'sha256': hashlib.sha256(raw).hexdigest()}, 'variants': variants,
        }
        print(f"{item['slug']}: {w}×{h} → {widths}", flush=True)
    DATA.write_text(json.dumps(manifest, indent=2) + '\n')
    print('Complete:', len(manifest), 'artworks;', sum(p.stat().st_size for p in OUTPUT.iterdir()), 'web bytes')

if __name__ == '__main__':
    main()
