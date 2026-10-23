import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { artworks, categories } from '../data/artworks'
import ArtworkImage from './ArtworkImage'
import WorkCinema from './WorkCinema'
import WeAre from './weAre/WeAre'

type Filter = typeof categories[number]
export default function WorkGallery() {
  const [filter, setFilter] = useState<Filter>('All work')
  const [limit, setLimit] = useState(9)
  const [selected, setSelected] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const reduce = useReducedMotion()
  const filtered = artworks.filter(art => filter === 'All work' || art.category === filter)
  const selectedArt = artworks.find(art => art.id === selected)
  const selectedIndex = filtered.findIndex(art => art.id === selected)
  const isOpen = selected !== null
  useLayoutEffect(() => {
    const node = dialog.current
    if (!node || !isOpen) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    node.showModal()
    return () => { node.close(); document.body.style.overflow = overflow }
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) return
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        setSelected(filtered[(selectedIndex + direction + filtered.length) % filtered.length].id)
      }
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [isOpen, filtered, selectedIndex])
  const move = (direction: number) => setSelected(filtered[(selectedIndex + direction + filtered.length) % filtered.length].id)
  return <><section id="work" className="work-section cinema-work section-spacing slideshow-section">
    <WorkCinema onOpen={art => { setFilter('All work'); setSelected(art.id) }} />
  </section>
    <WeAre />
    <section className="section-spacing artwork-archive-section" aria-label="Artwork archive">
    <div className="work-archive" id="all-work"><div className="archive-heading"><div><p className="eyebrow">THE REST OF THE RABBIT HOLE</p><h3>Yes, there’s more.</h3></div><span>{artworks.length} pieces. Go on, have a snoop.</span></div>
    <div className="work-toolbar"><div className="work-filters" aria-label="Filter artwork">{categories.map(category => <button key={category} aria-pressed={category === filter} className={category === filter ? 'selected' : ''} onClick={() => { setFilter(category); setLimit(9) }}>{category}<sup>{category === 'All work' ? artworks.length : artworks.filter(art => art.category === category).length}</sup></button>)}</div><span className="work-count" aria-live="polite">{String(filtered.length).padStart(2, '0')} PIECES</span></div>
    <div className="artwork-grid">{filtered.slice(0, limit).map((art, i) => <motion.button key={art.id} className="artwork-card" initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.45 }} onClick={() => setSelected(art.id)} aria-label={`View ${art.title}`}>
      <div className="artwork-visual"><ArtworkImage art={art} sizes="(max-width: 600px) 89vw, (max-width: 1000px) 43vw, 29vw" /><span className="artwork-open" aria-hidden="true">↗</span></div><div className="artwork-caption"><div><h3>{art.title}</h3><p>{art.category}</p></div><span>{String(i + 1).padStart(2, '0')}</span></div>
    </motion.button>)}</div>
    {filtered.length > limit && <div className="gallery-more"><p>{Math.min(limit, filtered.length)} down. {filtered.length - Math.min(limit, filtered.length)} more reasons to look twice.</p><button className="pill-button" onClick={() => setLimit(value => value + 12)}>More? Thought you’d never ask. <span>＋</span></button></div>}
    </div>
    <dialog ref={dialog} className="artwork-dialog" aria-labelledby="artwork-title" onCancel={event => { event.preventDefault(); setSelected(null) }} onClick={event => { if (event.target === event.currentTarget) setSelected(null) }} data-lenis-prevent>
      {selectedArt && <div className="artwork-dialog-inner"><div className="viewer-top"><span>{String(selectedIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span><button autoFocus onClick={() => setSelected(null)} aria-label="Close artwork">Close ×</button></div>
        <div className="viewer-image"><ArtworkImage key={selectedArt.id} art={selectedArt} eager sizes="(max-width: 700px) 90vw, 80vw" /></div>
        <div className="viewer-info"><div><p className="eyebrow">{selectedArt.category}</p><h2 id="artwork-title">{selectedArt.title}</h2><p>{selectedArt.description}</p><a href={selectedArt.media.sourceUrl} target="_blank" rel="noreferrer">Original file on Drive ↗</a></div><div className="viewer-controls"><button onClick={() => move(-1)} aria-label="Previous artwork">←</button><button onClick={() => move(1)} aria-label="Next artwork">→</button></div></div>
      </div>}
    </dialog>
  </section></>
}
