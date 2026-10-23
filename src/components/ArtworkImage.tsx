import type { CSSProperties } from 'react'
import type { Artwork } from '../data/artworks'

export default function ArtworkImage({ art, sizes, eager = false, className, style }: {
  art: Artwork; sizes: string; eager?: boolean; className?: string; style?: CSSProperties
}) {
  const variants = art.media.variants
  const set = (format: string) => variants.filter(item => item.format === format).map(item => `${item.url} ${item.width}w`).join(', ')
  const fallback = variants.filter(item => item.format === 'jpg')
  return <picture className={className} style={style}>
    <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
    <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
    <img src={fallback[Math.min(1, fallback.length - 1)].url} srcSet={set('jpg')} sizes={sizes}
      width={art.media.original.width} height={art.media.original.height} alt={art.alt}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
  </picture>
}
