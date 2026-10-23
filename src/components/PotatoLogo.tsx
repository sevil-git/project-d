import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import swordsman from '../assets/potato-swordsman.svg?raw'

const reactions = [
  { action: 'hop', message: 'Oh! A human. Hi.', duration: 950 },
  { action: 'swipe', message: 'Bad fonts, beware.', duration: 1000 },
  { action: 'happy', message: 'Tiny potato. Big feelings.', duration: 1300 },
] as const

type Action = 'idle' | typeof reactions[number]['action']
export default function PotatoLogo({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const mascot = useRef<HTMLButtonElement>(null)
  const turn = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reduce = useReducedMotion()
  const [action, setAction] = useState<Action>('idle')
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => () => clearTimeout(timer.current), [])
  const play = () => {
    const reaction = reactions[turn.current++ % reactions.length]
    clearTimeout(timer.current)
    setAction(reaction.action)
    setMessage(reaction.message)
    timer.current = setTimeout(() => { setAction('idle'); setMessage('') }, reaction.duration)
  }
  const look = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduce || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    // Whole-pixel steps keep the little sprite crisp as it looks around.
    const x = Math.round(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    const y = Math.round(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
    event.currentTarget.style.setProperty('--potato-look-x', `${x}px`)
    event.currentTarget.style.setProperty('--potato-look-y', `${y}px`)
  }
  const rest = () => {
    setHovered(false)
    mascot.current?.style.setProperty('--potato-look-x', '0px')
    mascot.current?.style.setProperty('--potato-look-y', '0px')
  }
  const awake = hovered || focused || action !== 'idle'
  return <div className={`brand potato-logo ${className}`}>
    <button ref={mascot} type="button" className={`potato-mascot ${awake ? 'is-awake' : ''}`} data-action={action}
      aria-label="Play with Potato, the pixel swordsman" onPointerEnter={() => setHovered(true)} onPointerMove={look} onPointerLeave={rest}
      onClick={play} onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocused(false)}>
      <span className="potato-drawing" dangerouslySetInnerHTML={{ __html: swordsman }} />
    </button>
    <a className="potato-wordmark" href="#home" aria-label="Potato, back to home" onClick={onNavigate}>
      <span className="potato-name">potato</span><span className="potato-tagline">Design with an edge.</span>
    </a>
    <span className={`potato-tooltip ${message ? 'has-reaction' : ''}`} aria-hidden="true">{message || 'psst. tap the potato.'}</span>
    <span className="sr-only" role="status">{message}</span>
  </div>
}
