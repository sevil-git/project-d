import { useContext, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { CinemaContext } from './CinemaContext'
import { getArtwork } from '../data/artworks'
import ArtworkImage from './ArtworkImage'

gsap.registerPlugin(ScrollTrigger)
const artwork = getArtwork('jap2')

/** A single image travels from its hero origin into the first selected-work frame. */
export default function HeroArtworkTransition() {
  const root = useRef<HTMLDivElement>(null)
  const { heroRender } = useContext(CinemaContext)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    if (reduce || !root.current) return
    const element = root.current
    const sequence = element.closest('.cinema-sequence')!
    const hero = sequence.querySelector<HTMLElement>('.portfolio-hero')!
    const origin = sequence.querySelector<HTMLElement>('.hero-art-origin')!
    const heroStage = sequence.querySelector<HTMLElement>('.hero-stage')!
    const cinema = sequence.querySelector<HTMLElement>('.work-cinema')!
    const stage = sequence.querySelector<HTMLElement>('.cinema-stage')!
    const screen = sequence.querySelector<HTMLElement>('.cinema-screen')!
    const panel = sequence.querySelector<HTMLElement>('.cinema-panel')!
    const clamp = gsap.utils.clamp(0, 1)
    let cancelled = false
    let start = 0, end = 1
    let from = { x: 0, y: 0, width: 0, height: 0 }
    let to = { x: 0, y: 0, width: 0, height: 0 }
    const measure = () => {
      const source = origin.getBoundingClientRect()
      const target = screen.getBoundingClientRect()
      const pad = parseFloat(getComputedStyle(panel).paddingLeft) || 0
      const borderX = screen.clientLeft, borderY = screen.clientTop
      const width = screen.clientWidth - pad * 2
      const height = screen.clientHeight - pad * 2
      const ratio = artwork.media.original.width / artwork.media.original.height
      const fittedHeight = Math.min(height, width / ratio)
      const fittedWidth = fittedHeight * ratio
      start = hero.getBoundingClientRect().top + window.scrollY
      end = Math.max(start + 1, cinema.getBoundingClientRect().top + window.scrollY)
      from = { x: source.left, y: source.top - heroStage.getBoundingClientRect().top, width: source.width, height: source.height }
      to = { x: target.left + borderX + pad + (width - fittedWidth) / 2,
        y: target.top - stage.getBoundingClientRect().top + borderY + pad + (height - fittedHeight) / 2,
        width: fittedWidth, height: fittedHeight }
    }
    const render = () => {
      const progress = clamp((window.scrollY - start) / (end - start))
      const mix = gsap.utils.interpolate
      const docked = progress >= 1
      // The shader takes over with an identical fitted frame when the first dissolve begins.
      const opacity = docked ? Number(gsap.getProperty(panel, 'opacity')) : 1
      gsap.set(element, {
        x: mix(from.x, to.x, progress),
        y: mix(from.y, to.y, progress),
        width: mix(from.width, to.width, progress), height: mix(from.height, to.height, progress),
        rotate: 5 * (1 - progress), autoAlpha: opacity,
        borderRadius: 5 * (1 - progress),
      })
      element.dataset.docked = String(docked)
    }
    const context = gsap.context(() => {
      measure()
      heroRender.current = render
      ScrollTrigger.create({ trigger: hero, start: 'top top',
        end: () => cinema.getBoundingClientRect().top + window.scrollY + cinema.offsetHeight,
        onUpdate: render, onRefresh: () => { measure(); render() } })
      render()
    }, root)
    document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh() })
    return () => { cancelled = true; heroRender.current = null; context.revert() }
  }, [reduce, heroRender])
  if (reduce) return null
  return <div ref={root} className="hero-art hero-transit" data-docked="false">
    <ArtworkImage art={artwork} eager sizes="(max-width: 700px) 80vw, 660px" />
  </div>
}
