import { useCallback, useContext, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { CinemaContext } from './CinemaContext'
import { cinemaArtworks } from '../data/artworks'
import type { Artwork } from '../data/artworks'
import ArtworkImage from './ArtworkImage'
import CinemaDissolve from './CinemaDissolve'
import type { DissolveRender, ReelFrame } from './CinemaDissolve'

gsap.registerPlugin(ScrollTrigger)

export default function WorkCinema({ onOpen }: { onOpen: (art: Artwork) => void }) {
  const root = useRef<HTMLElement>(null)
  const controller = useRef<ScrollTrigger | null>(null)
  const frame = useRef<ReelFrame>({ from: 0, to: 1, blend: 0 })
  const dissolveRender = useRef<DissolveRender | null>(null)
  const update = useRef<(() => void) | null>(null)
  const refreshFrame = useCallback(() => update.current?.(), [])
  const { active, setActive, heroRender, stripRender, reelPosition } = useContext(CinemaContext)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    if (reduce || !root.current) return
    const context = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.cinema-panel')
      const position = { value: 0 }
      const render = () => {
        const from = Math.min(cinemaArtworks.length - 1, Math.floor(position.value))
        const to = Math.min(cinemaArtworks.length - 1, from + 1)
        // Hold each artwork briefly, then let scrolling reveal the next one through the shader.
        const phase = gsap.utils.clamp(0, 1, (position.value - from - 0.18) / 0.72)
        const blend = phase * phase * (3 - 2 * phase)
        frame.current = { from, to, blend }
        reelPosition.current = from + blend
        stripRender.current?.()
        const current = blend >= 0.5 ? to : from
        const shader = dissolveRender.current?.() ?? false
        panels.forEach((panel, index) => {
          const alpha = shader ? (index === current && index !== 0 ? 1 : 0)
            : index === from ? 1 - blend : index === to ? blend : 0
          gsap.set(panel, { autoAlpha: alpha })
          const picture = panel.querySelector('picture')
          if (picture) gsap.set(picture, { scale: index === to && to !== from ? 0.92 + 0.08 * blend : 1 - 0.035 * blend })
        })
        setActive(current)
        heroRender.current?.()
      }
      update.current = render
      const tween = gsap.to(position, { value: cinemaArtworks.length - 1, ease: 'none',
        onUpdate: render, scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.45,
          invalidateOnRefresh: true,
        } })
      controller.current = tween.scrollTrigger!
      render()
    }, root)
    return () => { controller.current = null; update.current = null; context.revert() }
  }, [reduce, setActive, heroRender, stripRender, reelPosition])
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(cinemaArtworks.length - 1, index))
    if (reduce || !controller.current) { setActive(next); return }
    const trigger = controller.current
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * next / (cinemaArtworks.length - 1), behavior: 'smooth' })
  }
  const artwork = cinemaArtworks[active]
  return <section ref={root} className={`work-cinema ${reduce ? 'is-reduced' : ''}`} aria-label="Scroll through selected artwork">
    <div className="cinema-stage">
      <div className="cinema-stage-top cinema-copy"><span>NOW SHOWING / POTATO’S CUT</span><span>{reduce ? 'USE THE ARROWS. TAKE YOUR TIME.' : 'Keep scrolling. It gets more Potato. ↓'}</span></div>
      <div className="cinema-screen">
        {!reduce && <CinemaDissolve frame={frame} renderRef={dissolveRender} onChange={refreshFrame} />}
        {cinemaArtworks.map((art, index) => <button key={art.id}
        className={`cinema-panel ${active === index ? 'is-current' : ''}`}
        style={{ zIndex: index + 1 }} aria-hidden={active !== index} tabIndex={active === index ? 0 : -1}
        aria-label={`View ${art.title}`} onClick={() => onOpen(art)}>
        {(index !== 0 || reduce) && <ArtworkImage art={art} sizes="(max-width: 700px) 75vw, 80vw" />}
        <span className="cinema-enlarge">Go on, look closer ↗</span>
      </button>)}</div>
      <div className="cinema-caption cinema-copy"><div className="cinema-title"><span>{artwork.category}</span><h3>{artwork.title}</h3></div><div className="cinema-controls"><span className="cinema-frame-number">{String(active + 1).padStart(2, '0')} <small>/ {String(cinemaArtworks.length).padStart(2, '0')}</small></span>
        <button aria-label="Previous featured artwork" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button><button aria-label="Next featured artwork" disabled={active === cinemaArtworks.length - 1} onClick={() => goTo(active + 1)}>→</button>
      </div></div>
      <div className="cinema-position cinema-copy" aria-label="Choose a featured frame">{cinemaArtworks.map((art, index) => <button key={art.id} className={active === index ? 'is-current' : ''} aria-label={`Show frame ${index + 1}: ${art.title}`} aria-current={active === index ? 'step' : undefined} onClick={() => goTo(index)}><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>
    </div>
  </section>
}
