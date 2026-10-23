import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import PotatoLogo from './PotatoLogo'

export default function Navbar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const scroll = () => {
      const next = window.scrollY
      setHidden(next > last.current && next > 100)
      last.current = next
    }
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to('.menu-line:first-child', { width: isOpen ? 18 : 20, y: isOpen ? 3 : 0, rotate: isOpen ? 45 : 0, duration: 0.3 })
      gsap.to('.menu-line:last-child', { width: isOpen ? 18 : 12, y: isOpen ? -3 : 0, rotate: isOpen ? -45 : 0, duration: 0.3 })
    }, button)
    return () => context.revert()
  }, [isOpen])
  return <header className={`portfolio-nav ${isOpen ? 'menu-active' : ''}`}>
    <PotatoLogo className={hidden && !isOpen ? 'nav-hidden' : ''} />
    <div className="nav-actions"><span className={hidden && !isOpen ? 'nav-hidden' : ''}>{isOpen ? 'esc' : 'menu'}</span>
      <button ref={button} className="menu-button" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="fullscreen-nav" onClick={onToggle}>
        <span className="menu-line" /><span className="menu-line" />
      </button>
    </div>
  </header>
}
