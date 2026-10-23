import { useContext, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { IntroContext } from './IntroContext'

const glyphs = Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン光影夢')
type Frame = { reveal: number; noise: { glyph: string; left: number; width: number }[] }

/** Keep the real text, font shaping, and layout intact beneath a temporary decode layer. */
export default function ScrambleText({ text, delay = 0, duration = 1.5 }: {
  text: string; delay?: number; duration?: number
}) {
  const root = useRef<HTMLSpanElement>(null)
  const final = useRef<HTMLSpanElement>(null)
  const introReady = useContext(IntroContext)
  const inView = useInView(root, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const [frame, setFrame] = useState<Frame | null>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!introReady || !inView || reduce !== false) return
    let cancelled = false
    let animation = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    // Measure the actual shaped text after fonts load, including the cursive words.
    document.fonts.ready.then(() => {
      if (cancelled) return
      timer = setTimeout(() => {
        const element = final.current
        const node = element?.firstChild
        if (!element || !node || cancelled) return
        const bounds = element.getBoundingClientRect()
        if (!bounds.width) return
        const characters = Array.from(text)
        const range = document.createRange()
        let offset = 0
        const slots = characters.map(character => {
          range.setStart(node, offset)
          offset += character.length
          range.setEnd(node, offset)
          const rect = range.getBoundingClientRect()
          return { left: (rect.left - bounds.left) / bounds.width * 100,
            width: rect.width / bounds.width * 100,
            end: (rect.right - bounds.left) / bounds.width * 100 }
        })
        const start = performance.now()
        let previous = -Infinity
        const tick = (now: number) => {
          if (cancelled) return
          const progress = Math.min(1, (now - start) / Math.max(1, duration * 1000))
          if (progress >= 1) { setFinished(true); setFrame(null); return }
          if (now - previous >= 65) {
            // Let the whole line glitch briefly, then lock each letter from left to right.
            const resolved = Math.floor(Math.max(0, (progress - 0.22) / 0.78) * characters.length)
            setFrame({
              reveal: resolved ? Math.min(100, Math.max(0, slots[resolved - 1].end)) : 0,
              noise: slots.flatMap((slot, index) => index < resolved || /\s/.test(characters[index]) ? [] : [{
                glyph: glyphs[Math.floor(Math.random() * glyphs.length)], left: slot.left, width: slot.width,
              }]),
            })
            previous = now
          }
          animation = requestAnimationFrame(tick)
        }
        animation = requestAnimationFrame(tick)
      }, delay * 1000)
    })
    return () => { cancelled = true; clearTimeout(timer); cancelAnimationFrame(animation) }
  }, [text, delay, duration, introReady, inView, reduce])

  // Render a deterministic scrambled state immediately, including during the intro/delay.
  // A null animation frame must not expose the English text before decoding starts.
  const characters = Array.from(text)
  const displayFrame = reduce ? null : frame ?? (finished ? null : {
    reveal: 0,
    noise: characters.flatMap((character, index) => /\s/.test(character) ? [] : [{
      glyph: glyphs[(index * 7 + character.charCodeAt(0)) % glyphs.length],
      left: index / characters.length * 100,
      width: 100 / characters.length,
    }]),
  })
  return <span ref={root} className="scramble-text">
    <span className="sr-only">{text}</span>
    <span className="scramble-visual" aria-hidden="true">
      <span ref={final} className="scramble-final" style={displayFrame ? { visibility: displayFrame.reveal === 0 ? 'hidden' : undefined, clipPath: `inset(-0.7em ${100 - displayFrame.reveal}% -0.7em -0.3em)` } : undefined}>{text}</span>
      {displayFrame && <span className="scramble-noise" lang="ja">{displayFrame.noise.map((slot, index) => <span key={index} style={{ left: `${slot.left}%`, width: `${slot.width}%` }}>{slot.glyph}</span>)}</span>}
    </span>
  </span>
}
