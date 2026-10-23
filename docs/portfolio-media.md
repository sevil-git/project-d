# Potato portfolio: sources and image delivery

The portfolio belongs to **Gayatri**, who uses **Potato** as her creative name (confirmed by the owner of this repository). Contact destination: [@potatoooedits](https://www.instagram.com/potatoooedits/).

## Source collection

[Client-supplied Google Drive folder](https://drive.google.com/drive/folders/10B4w_je1Wq_Okr2QAME3xKExFmeP9Qnz) — 33 JPEG artworks downloaded on 23 October 2026.

- `assets/client-originals/`: untouched originals, retaining their source filenames. These are archival inputs, outside the public directory and outside the application import graph.
- `assets/client-originals/source-manifest.json`: source file IDs, filenames, stable slugs, and individual Drive references.
- `public/work/`: generated web assets only.
- `src/data/media.json`: source SHA-256 hashes, pixel dimensions, derivative dimensions, formats, paths, and byte sizes.
- `src/data/artworks.ts`: curated display titles, descriptions, alt text, ordering, and categories. Display titles describe the supplied images; they are not verified project or campaign names.
- `src/data/profile.ts`: verified identity and public contact links.

## What the collection shows

The supplied work comprises 11 posters, 15 gaming/creator graphics, 4 photo composites, and 3 food/lifestyle graphics. The categories are editorial groupings based on the images rather than claims about paid client engagements.

Observed recurring techniques:

- Large condensed or serif type as a primary compositional element, often paired with smaller editorial text.
- Character cutouts, layered photographic imagery, motion-like effects, and foreground/background separation.
- Strong contrasting palettes in gaming work; more restrained paper textures, monochrome, and botanical color in poster studies.
- Several related explorations and alternates, including Arcane collages, warrior posters, Depth compositions, and giveaway graphics.

The portfolio retains the repository's beige/green palette, Biogem/Poppins/My Soul type system, full-screen introductory sequence, settling thumbnail rail, moving hero artwork, staggered navigation, parallax, and marquee. It replaces agency copy with a personal portfolio and uses the client's work throughout.

No location, education, experience, employer, commission status, performance statistics, or testimonials have been inferred. The public Instagram metadata confirms the supplied handle; it does not establish a detailed biography. The first-person introduction is draft portfolio copy based on the work, for the client to review.

## Delivery policy

- Preserve original bytes. Resizing and compression affect derivatives only.
- Honor EXIF orientation; convert tagged source profiles to sRGB before stripping metadata from derivatives.
- Generate widths of 480, 960, 1600, and 2048 pixels, capped at each source's native width and deduplicated. Most supplied images are 1080 or 1280 pixels wide, so their largest output remains native size.
- Preserve aspect ratio. Do not crop, stretch, or upscale generated files.
- AVIF quality 75 with 4:4:4 chroma, WebP quality 90, progressive JPEG quality 92 with 4:4:4 chroma. These are high-quality lossy delivery versions, not mathematically lossless copies.
- `<picture>` chooses AVIF, then WebP, then JPEG. Width-based `srcset` and layout-specific `sizes` let the browser choose the appropriate file for its viewport and device pixel ratio.
- Reserve image layout using intrinsic width/height. Gallery and about images load lazily; opening imagery is eager. Full artwork is shown with `object-fit: contain` in the viewer.
- Only the full-screen intro and decorative thumbnail rail use a cover treatment. Responsive gallery files and the full artwork viewer preserve the entire composition.
- Show nine gallery pieces initially; load additional groups on request. Loading the page does not download all originals or every variant.
- The original files total **87.97 MB** (83.9 MiB). One largest AVIF per artwork totals **5.80 MB**, 93.4% fewer bytes. A typical 960px AVIF averages about **105 KB**. These are asset measurements, not a measured page-load time or a Core Web Vitals score.
- All 303 delivery files total about 54.09 MB on disk because all three format fallbacks and widths are retained. Browsers download the selected candidate, not the entire directory.

Two source posters are unusually large: `DEJA.jpg` is 8568×11424 and `deja2.jpg` is 6048×8064. Their browser versions are capped at 2048px wide; the full originals remain available in the source folder and via each work's Drive reference.

## Reproduce and verify

Python 3 with Pillow built with AVIF and WebP support is required for optimization and image checks. This is an authoring dependency, not a website runtime dependency.

```sh
python3 scripts/download-client-assets.py
python3 scripts/optimize-portfolio.py
python3 scripts/check-portfolio-media.py
npm run build
npm run lint
```

Downloads skip originals already present. Optimization uses only local sources. The media check validates all source hashes and every derivative's file size, dimensions, aspect ratio, format coverage, and absence of upscaling.

Responsive delivery follows [MDN responsive image guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) and [web.dev browser lazy loading guidance](https://web.dev/articles/browser-level-image-lazy-loading).

## Continuous selected-work sequence

The opening runs through six studies: Kadupul, Veiled, Depth, Depth / alternate, Beneath the surface, and Warrior / II. Complete foreground compositions stay uncropped over softly blurred, matching fullscreen backdrops. A loading label and percentage combine initial image decoding with progress through the opening presentation; this is not a network-byte measurement. Only the final three become persistent thumbnail cards. Gaming thumbnails remain available in the archive, outside this opening. One persistent thumbnail track contains those three images followed by Warrior / I, Kadupul, Depth, Mindscape, Veiled, Arcane / I, The Batman, and Drowning. There are no repeated copies, replacements halfway through the scroll, film stock, perforations, or frame borders. The opening cards land sharp and fully opaque. As the selected-work stage takes focus, every off-center card uses the same blur and dimming, including the three opening cards; they remain in the sequence and move out only beyond the viewport. The original Warrior / I hero travels into the selected-artwork display. The display labels, title, and controls remain hidden until that image has docked, then fade in without changing the reserved layout. Reverse scrolling hides them before the image travels back. The work anchor aligns with the dock position. The “Keep scrolling. It gets more Potato.” cue lives in the same gated stage header, so it appears after docking instead of travelling behind the image from the hero.

On desktop, the images run vertically along the left edge; on mobile (up to 700px), they run horizontally across the bottom. The full-screen intro settles into the same positions as that track, with complete compositions in the opening thumbnails. The selected thumbnail gradually scales at the center. The strip and main artwork share the same scrubbed reveal position, including reverse scrolling, so the strip does not run ahead of the artwork. The complete image sequence stays mounted in a fixed order, with eleven unique artwork IDs. The track leaves with the work stage before the archive.

The selected artwork fits completely into the center and gently scales in during a custom Three.js noise dissolve. Scroll position controls the reveal; reversing scroll reverses the pattern. sRGB texture/output handling preserves image color. The HTML hero hands over to the matching first GPU frame only when the dissolve starts and its textures are ready.

Three.js is dynamically imported near the stage. Current/adjacent optimized WebP textures are chosen for their fitted dimensions, upgraded when a larger viewport needs them, and never generated above the source size. Device pixel ratio is capped at 1.75. Rendering happens on scroll, resize, or texture readiness rather than an idle animation loop. Textures, materials, geometry, renderer, observers, and handlers are disposed on unmount. Missing WebGL2, failed textures, context loss, or shader failure retain the HTML image transition. Reduced motion uses direct frame selection without the long scroll, thumbnail track, or WebGL canvas. Previous/next arrows and the complete-artwork viewer remain available on all screen sizes; desktop also has numbered frame controls.
