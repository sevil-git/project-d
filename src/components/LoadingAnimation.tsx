import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from 'framer-motion'
import ArtworkImage from './ArtworkImage'
import { introArtworks, loadingArtworks } from '../data/artworks'

export default function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    if (reduce) return
    let disposed = false, started = false
    let imageWait: number | undefined
    const meter = { assets: 0, sequence: 0 }
    const context = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('.intro-frame')
      const landing = frames.slice(-introArtworks.length)
      const foregrounds = frames.map(frame => frame.querySelector<HTMLElement>('.intro-foreground')!)
      const count = root.current!.querySelector<HTMLElement>('.intro-loading-number')!
      const fill = root.current!.querySelector<HTMLElement>('.intro-loading-fill')!
      const updateProgress = () => {
        const progress = Math.round(Math.min(100, meter.assets * 30 + meter.sequence * 70))
        count.textContent = `${String(progress).padStart(2, '0')}%`
        fill.style.transform = `scaleX(${progress / 100})`
      }
      gsap.set(frames, { autoAlpha: 0 })
      gsap.set(foregrounds, { scale: 0.985 })
      const styles = getComputedStyle(document.documentElement)
      const width = parseFloat(styles.getPropertyValue('--intro-thumb-width'))
      const height = parseFloat(styles.getPropertyValue('--intro-thumb-height'))
      const gap = parseFloat(styles.getPropertyValue('--intro-thumb-gap'))
      const inset = parseFloat(styles.getPropertyValue('--intro-thumb-inset'))
      const mobile = window.matchMedia('(max-width: 700px)').matches
      const safeBottom = mobile ? parseFloat(getComputedStyle(root.current!).paddingBottom) || 0 : 0
      const collapseAt = 3.1
      const timeline = gsap.timeline({ paused: true, onComplete })
      timeline.set(frames[0], { autoAlpha: 1 })
      frames.forEach((frame, i) => {
        timeline.to(frame, { autoAlpha: 1, duration: i === 0 ? 0.01 : 0.18 }, i * 0.5)
          .to(foregrounds[i], { scale: 1, duration: 0.5, ease: 'power2.out' }, i * 0.5)
      })
      timeline.to(meter, { sequence: 1, duration: 4.2, ease: 'none', onUpdate: updateProgress }, 0)
        .to('.intro-caption', { autoAlpha: 0, duration: 0.18 }, collapseAt - 0.2)
        .set(frames.slice(0, -introArtworks.length), { autoAlpha: 0 }, collapseAt)
        .to('.intro-backdrop', { autoAlpha: 0, duration: 0.25 }, collapseAt)
        .set(landing, { background: 'transparent' }, collapseAt)
        .to('.intro-curtain', { scaleY: 0, transformOrigin: 'top', duration: 1.15, ease: 'power3.inOut' }, collapseAt)
        .to(foregrounds, { padding: 0, duration: 0.5, ease: 'power2.inOut' }, collapseAt)
        .to(landing, { width, height,
          left: i => mobile ? window.innerWidth / 2 + (i - 1) * (width + gap) - width / 2 : inset,
          top: () => window.innerHeight - safeBottom - inset - height,
          y: i => mobile ? 0 : -i * (height + gap),
          duration: 1.15, stagger: 0.05, ease: 'power3.inOut' }, collapseAt)
        .to('.intro-loading', { autoAlpha: 0, duration: 0.18 }, 4.22)
        .to(root.current, { autoAlpha: 0, duration: 0.25 }, 4.5)
      const start = () => {
        if (disposed || started) return
        started = true
        window.clearTimeout(imageWait)
        // Once the wait expires, the page can still open using its image fallbacks.
        meter.assets = 1
        updateProgress()
        timeline.play(0)
      }
      let decoded = 0
      const ready = foregrounds.map(foreground => foreground.querySelector('img')!.decode()
        .catch(() => {})
        .then(() => {
          if (disposed) return
          decoded += 1
          meter.assets = Math.max(meter.assets, decoded / frames.length)
          updateProgress()
        }))
      imageWait = window.setTimeout(start, 2200)
      void Promise.all(ready).then(start)
    }, root)
    return () => { disposed = true; window.clearTimeout(imageWait); context.revert() }
  }, [reduce, onComplete])
  return <div ref={root} className="portfolio-intro" aria-hidden="true" style={reduce ? { display: 'none' } : undefined}>
    <div className="intro-curtain" />
    {loadingArtworks.map((art, i) => <div className="intro-frame" data-artwork={art.id} key={art.id} style={{ zIndex: i + 1 }}>
      <ArtworkImage art={art} eager sizes="100vw" className="intro-backdrop" />
      <div className="intro-foreground"><ArtworkImage art={art} eager sizes="100vw" /></div>
      <span className="intro-caption"><span>POTATO / SELECTED IMPRESSIONS</span><span>{String(i + 1).padStart(2, '0')} — {art.title}</span></span>
    </div>)}
    <div className="intro-loading"><div className="intro-loading-row"><span>LOADING PORTFOLIO<span className="intro-loading-note">A little good taste, coming right up.</span></span><span className="intro-loading-number">00%</span></div><div className="intro-loading-track"><span className="intro-loading-fill" /></div></div>
  </div>
}
