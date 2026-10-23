import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Marquee } from './Marquee'
import ScrambleText from '../ScrambleText'
import swordsman from '../../assets/potato-swordsman.svg?raw'
import './PotatoWorld.css'

const chapters = [
  { icon: '✳', label: 'The human', title: 'Small potato. Big ideas.', text: 'Gayatri to most. Potato to the internet. A graphic designer turning chaotic references, random ideas, and “can you make it pop?” into things you actually stop scrolling for.', note: '100% human. Approximately 87% layers.', action: 'happy' },
  { icon: 'Aa', label: 'The obsession', title: 'It’s just two pixels. It matters.', text: 'Posters with a point of view. Thumbnails that don’t whisper. Composites with plot twists. If it needs attention, I’m probably nudging its type two pixels to the left.', note: 'Currently defending the correct font choice.', action: 'swipe' },
  { icon: '☾', label: 'The after hours', title: 'Good taste. Bad bedtime.', text: 'One more tweak. One more version. One more “wait, what if…” Some call it overthinking. I call it giving the idea a suspicious amount of attention.', note: 'Sleep schedule: a work in progress.', action: 'hop' },
  { icon: '↗', label: 'Your side quest', title: 'Bring a brief. Or a wild idea.', text: 'A polished brief, a chaotic voice note, a reference you can’t quite explain. Bring it. Let’s turn the thing in your head into the thing everyone’s looking at.', note: 'New quest? My DMs are open.', action: 'happy' },
] as const
const words = ['Just one more tweak', 'Main-character pixels', 'Ctrl + Z enthusiast', 'Strong font opinions', 'Make it pop? Say less.']

export default function WeAre() {
  const [active, setActive] = useState(0)
  const [pokes, setPokes] = useState(0)
  const [awake, setAwake] = useState(false)
  useEffect(() => {
    if (!pokes) return
    const timer = setTimeout(() => setPokes(0), 2400)
    return () => clearTimeout(timer)
  }, [pokes])
  const world = useRef<HTMLDivElement>(null)
  const stories = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.chapter))
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 })
    stories.current?.querySelectorAll('[data-chapter]').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  const chapter = chapters[active]
  function look(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType === 'touch') return
    const box = event.currentTarget.getBoundingClientRect()
    world.current?.style.setProperty('--world-x', `${((event.clientX - box.left) / box.width - .5) * 10}px`)
    world.current?.style.setProperty('--world-y', `${((event.clientY - box.top) / box.height - .5) * 8}px`)
  }
  return <section id="about" className="about-section potato-about potato-scroll-about section-spacing">
    <div className="section-label"><span>02 / THE HUMAN BEHIND THE LAYERS</span><span>CAUTION: CONTAINS PERSONALITY.</span></div>
    <div className="potato-about-heading"><p className="eyebrow">DESIGNER BY TRADE. POTATO BY CHOICE.</p><h2><ScrambleText text="Inside Potato’s" /> <span className="script-word"><ScrambleText text="head." delay={.2} /></span></h2><p>Keep scrolling. The potato has a backstory.</p></div>
    <div className="potato-scroll-journey">
    <div className="potato-universe" ref={world} onPointerMove={look} onPointerLeave={() => { world.current?.style.setProperty('--world-x', '0px'); world.current?.style.setProperty('--world-y', '0px') }}>
      <div className="potato-coordinate coordinate-top">POTATO.EXE / PERSONALITY LOADED</div>
      <div className="potato-coordinate coordinate-bottom">NOT A VEGETABLE. A WHOLE CREATIVE DEPARTMENT.*<small>*okay, one very invested person.</small></div>
      <div className="potato-orbit orbit-one" aria-hidden="true" /><div className="potato-orbit orbit-two" aria-hidden="true" />
      <span className="world-spark spark-one" aria-hidden="true">✧</span><span className="world-spark spark-two" aria-hidden="true">+</span><span className="world-spark spark-three" aria-hidden="true">✦</span>
      <div className="potato-stage">
        <div className="potato-speech" aria-live="polite">{pokes ? ['hey. that tickles.', 'my sword is mostly decorative.', 'okay, we’re friends now.'][ (pokes - 1) % 3 ] : ['oh hi. I’m the designer.', 'bad fonts, beware.', 'just one more tweak…', 'a new quest? I’m in.'][active]}</div>
        <motion.button type="button" className={`potato-mascot universe-mascot ${awake || pokes || active ? 'is-awake' : ''}`} data-action={chapter.action} aria-label="Poke Potato" onClick={() => setPokes(value => value + 1)} onPointerEnter={() => setAwake(true)} onPointerLeave={() => setAwake(false)} onFocus={() => setAwake(true)} onBlur={() => setAwake(false)} initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .3 }}><span key={`${active}-${pokes}`} className="potato-drawing" dangerouslySetInnerHTML={{ __html: swordsman }} /></motion.button>
        <span className="potato-nameplate">GAYATRI <span>aka POTATO</span></span>
      </div>
      <div className="potato-scene-props" aria-hidden="true">{chapters.map((item, index) => <span key={item.label} className={`world-object object-${index} ${active === index ? 'is-selected' : ''}`}><span className="world-object-icon">{item.icon}</span></span>)}</div>
      <div className="potato-journey-progress" aria-hidden="true">{chapters.map((item, index) => <span key={item.label} className={index <= active ? 'is-complete' : ''} />)}<small>0{active + 1} / 04 — SCROLL TO UNPACK</small></div>
    </div>
    <div className="potato-scroll-stories" ref={stories}>{chapters.map((item, index) => <article key={item.label} data-chapter={index} className={`potato-scroll-chapter ${index === active ? 'is-current' : ''}`} aria-labelledby={`potato-chapter-${index}`}>
      <p className="chapter-kicker">0{index + 1} / {item.label}</p>
      <h3 id={`potato-chapter-${index}`}>{item.title}</h3>
      <p className="chapter-description">{item.text}</p>
      <span className="story-note">↳ {item.note}</span>
      {index === 3 && <a className="potato-quest-link" href="https://www.instagram.com/potatoooedits/" target="_blank" rel="noreferrer">Start a conversation ↗</a>}
      <span className="chapter-doodle" aria-hidden="true">{['hello, human.', 'pixel police.', 'no thoughts. just layers.', 'let’s make a little noise.'][index]}</span>
    </article>)}</div>
    </div>
    <div className="about-marquee"><span className="marquee-label">SIDE EFFECTS<br />OF HIRING POTATO</span><Marquee items={words} icon={<span aria-hidden="true">✳</span>} speed={24} /></div>
  </section>
}
