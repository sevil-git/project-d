import { useEffect, useRef, useState } from 'react'
import PotatoLogo from './PotatoLogo'
import './PotatoNav.css'

const destinations = [
  ['The film', '#work', '01'],
  ['The potato', '#about', '02'],
  ['The rabbit hole', '#all-work', '03'],
] as const
export default function Navbar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [active, setActive] = useState('#home')
  const [scrolled, setScrolled] = useState(false)
  const frame = useRef(0)
  useEffect(() => {
    const update = () => {
      frame.current = 0
      setScrolled(window.scrollY > 60)
      const sections = ['#home', '#work', '#about', '#all-work', '#contact']
      let current = '#home'
      for (const id of sections) {
        if ((document.querySelector(id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * .4) current = id
      }
      setActive(current)
    }
    const scroll = () => { if (!frame.current) frame.current = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); cancelAnimationFrame(frame.current) }
  }, [])
  return <header className={`portfolio-nav potato-nav ${scrolled ? 'is-scrolled' : ''} ${isOpen ? 'menu-active' : ''}`}>
    <div className="potato-nav-identity"><PotatoLogo /><span className="nav-edition">GAYATRI’S LITTLE<br />CORNER OF THE INTERNET</span></div>
    <nav className="potato-nav-dock" aria-label="Quick navigation"><span className="dock-start" aria-hidden="true">✳</span>{destinations.map(([label, href, number]) => <a key={href} href={href} aria-current={active === href ? 'location' : undefined}><small>{number}</small><span>{label}</span><i aria-hidden="true" /></a>)}</nav>
    <div className="potato-nav-tools"><a href="#contact" className="nav-brief">Got a weird idea? <span aria-hidden="true">↗</span></a><button className="menu-button potato-menu-trigger" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="fullscreen-nav" onClick={onToggle}><span className="trigger-word">{isOpen ? 'close' : 'explore'}</span><span className="trigger-pixels" aria-hidden="true"><i /><i /><i /><i /></span></button></div>
  </header>
}
