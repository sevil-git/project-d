import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion, useReducedMotion } from 'framer-motion'
import ArtworkImage from './ArtworkImage'
import ScrambleText from './ScrambleText'
import { getArtwork } from '../data/artworks'

const heroArt = getArtwork('jap2')
export default function HeroSection() {
  const section = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    if (reduce || !card.current || !stage.current) return
    const place = () => {
      const w = stage.current!.clientWidth, h = stage.current!.clientHeight
      const width = Math.min(w < 700 ? w * 0.48 : w * 0.28, h * (w < 700 ? 0.3 : 0.48), 430)
      const height = width * heroArt.media.original.height / heroArt.media.original.width
      const inset = w < 700 ? 18 : 36
      gsap.set(card.current, { width, height, x: w - width - inset, y: h - height - (w < 700 ? 132 : inset) })
    }
    const context = gsap.context(place, section)
    window.addEventListener('resize', place)
    return () => { window.removeEventListener('resize', place); context.revert() }
  }, [reduce])

  return <section ref={section} id="home" className={`portfolio-hero ${reduce ? 'reduce-motion' : ''}`}>
    <div className="hero-stage" ref={stage}><div ref={card} className={`hero-art-origin ${reduce ? 'hero-art' : ''}`} aria-hidden={!reduce}>{reduce && <ArtworkImage art={heroArt} eager sizes="(max-width: 700px) 80vw, 660px" />}</div></div>
    <div className="hero-copy"><div className="eyebrow"><span>GAYATRI, AKA POTATO</span><span>VISUAL DESIGNER. PIXEL OVERTHINKER.</span></div>
      <motion.h1 initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 2.1 }}><ScrambleText text="Made you" delay={0} /><br /><ScrambleText text="look " delay={0.12} /><span className="script-word"><ScrambleText text="twice." delay={0.24} /></span><br /><ScrambleText text="You’re welcome" delay={0.36} /><span className="hero-dot">.</span></motion.h1>
      <div className="hero-description"><p>Graphic designer.<br />Professional pixel overthinker.<br />Occasional font interventionist.</p><a href="#work" className="underlined-link">See the evidence <span>↘</span></a></div>

      <span className="hero-spark" aria-hidden="true">✳</span>
    </div>
  </section>
}
