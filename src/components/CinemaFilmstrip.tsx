import { useContext, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import ArtworkImage from './ArtworkImage'
import { cinemaArtworks, introArtworks } from '../data/artworks'
import { CinemaContext } from './CinemaContext'
import { IntroContext } from './IntroContext'

gsap.registerPlugin(ScrollTrigger)
const sequenceArtworks = [...introArtworks, ...cinemaArtworks]

/** One persistent image sequence; the stage supplies its exact, scrubbed reveal position. */
export default function CinemaFilmstrip() {
  const root = useRef<HTMLElement>(null)
  const introReady = useContext(IntroContext)
  const { stripRender, reelPosition } = useContext(CinemaContext)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    if (reduce || !root.current) return
    const aside = root.current
    const sequence = aside.closest('.cinema-sequence')!
    const hero = sequence.querySelector<HTMLElement>('.portfolio-hero')!
    const cinema = sequence.querySelector<HTMLElement>('.work-cinema')!
    const track = aside.querySelector<HTMLElement>('.film-track')!
    const aperture = aside.querySelector<HTMLElement>('.film-aperture')!
    const frames = Array.from(track.children) as HTMLElement[]
    const clamp = gsap.utils.clamp(0, 1)
    const mix = gsap.utils.interpolate
    let height = 0, width = 0, frameHeight = 0, frameWidth = 0, gap = 0, inset = 0, safeBottom = 0
    let heroStart = 0, heroEnd = 0, cinemaEnd = 0, mobile = false
    const measure = () => {
      const styles = getComputedStyle(document.documentElement)
      height = window.innerHeight; width = window.innerWidth
      mobile = window.matchMedia('(max-width: 700px)').matches
      safeBottom = parseFloat(getComputedStyle(aside).paddingBottom) || 0
      frameHeight = parseFloat(styles.getPropertyValue('--intro-thumb-height'))
      frameWidth = parseFloat(styles.getPropertyValue('--intro-thumb-width'))
      gap = parseFloat(styles.getPropertyValue('--intro-thumb-gap'))
      inset = parseFloat(styles.getPropertyValue('--intro-thumb-inset'))
      heroStart = hero.getBoundingClientRect().top + window.scrollY
      heroEnd = heroStart + hero.offsetHeight - height
      cinemaEnd = cinema.getBoundingClientRect().top + window.scrollY + cinema.offsetHeight - height
      gsap.set(frames, { order: i => i < introArtworks.length && !mobile ? introArtworks.length - 1 - i : i })
    }
    const render = () => {
      const scroll = window.scrollY
      const unroll = clamp((scroll - heroStart) / Math.max(1, heroEnd - heroStart))
      const settledWidth = mobile ? 64 : 72
      const settledHeight = mobile ? 80 : 90
      const w = mix(frameWidth, settledWidth, unroll)
      const h = mix(frameHeight, settledHeight, unroll)
      const spacing = mix(gap, mobile ? 16 : 18, unroll)
      const position = introArtworks.length + reelPosition.current
      aside.style.setProperty('--film-frame-width', `${w}px`)
      aside.style.setProperty('--film-frame-height', `${h}px`)
      aside.style.setProperty('--film-frame-gap', `${spacing}px`)
      aside.dataset.position = reelPosition.current.toFixed(4)
      if (mobile) {
        const restX = width / 2 - (frameWidth + gap) - frameWidth / 2
        gsap.set(track, {
          x: mix(restX, width / 2 - w / 2 - position * (w + spacing), unroll),
          y: mix(height - safeBottom - inset - frameHeight, height - safeBottom - 24 - h, unroll),
        })
        gsap.set(aside, { width: '100%', left: 0, y: Math.max(0, Math.min(150, scroll - cinemaEnd)) })
        gsap.set(aperture, { maskImage: 'none',
          clipPath: `inset(0 ${mix(Math.max(0, restX - 8), 0, unroll)}px ${mix(inset - 8, 0, unroll)}px ${mix(Math.max(0, restX - 8), 0, unroll)}px)` })
      } else {
        const restY = height - inset - introArtworks.length * frameHeight - (introArtworks.length - 1) * gap
        gsap.set(track, { x: (frameWidth - w) / 2,
          y: mix(restY, height / 2 - h / 2 - position * (h + spacing), unroll) })
        gsap.set(aside, { width: frameWidth, left: inset, y: -Math.max(0, Math.min(height + 20, scroll - cinemaEnd)) })
        gsap.set(aperture, { clipPath: 'none', maskImage: 'none' })
      }
      frames.forEach((frame, index) => {
        const distance = Math.abs(index - position)
        const focus = Math.max(0, 1 - distance)
        // Apply the same focus falloff to every card, including the three opening studies.
        gsap.set(frame, { scale: 1 + 0.14 * focus * unroll,
          opacity: mix(1, 0.4 + focus * 0.6, unroll),
          filter: `blur(${2 * (1 - focus) * unroll}px)` })
      })
      const exit = clamp((scroll - cinemaEnd) / height)
      document.documentElement.style.setProperty('--film-nav-shift', `${mobile ? 0 : (frameWidth + 18) * unroll * (1 - exit)}px`)
    }
    const context = gsap.context(() => {
      measure()
      stripRender.current = render
      ScrollTrigger.create({ trigger: hero, start: 'top top',
        end: () => cinema.getBoundingClientRect().top + window.scrollY + cinema.offsetHeight,
        onUpdate: render, onRefresh: () => { measure(); render() } })
      render()
    }, root)
    return () => { stripRender.current = null; context.revert(); document.documentElement.style.removeProperty('--film-nav-shift') }
  }, [reduce, stripRender, reelPosition])
  return <aside ref={root} className={`cinema-filmstrip${introReady ? ' is-ready' : ''}`} aria-hidden="true">
    <div className="film-aperture"><div className="film-track">
      {sequenceArtworks.map((art, index) => <div key={art.id} data-artwork={art.id}
        className={`film-frame ${index < introArtworks.length ? 'is-opening' : ''}`}>
        <ArtworkImage art={art} sizes="110px" />
      </div>)}
    </div></div>
  </aside>
}
