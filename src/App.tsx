import { useCallback, useEffect, useState } from 'react'
import './App.css'
import CinemaSequence from './components/CinemaSequence'
import Navbar from './components/Navbar'
import LoadingAnimation from './components/LoadingAnimation'
import FullScreenNav from './components/FullScreenNav'
import { profile } from './data/profile'
import ScrambleText from './components/ScrambleText'
import { IntroContext } from './components/IntroContext'
import PotatoLogo from './components/PotatoLogo'

export default function App() {
  const [introReady, setIntroReady] = useState(false)
  const finishIntro = useCallback(() => setIntroReady(true), [])
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])
  return <IntroContext.Provider value={introReady}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navbar isOpen={menuOpen} onToggle={() => setMenuOpen(value => !value)} />
    <FullScreenNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <LoadingAnimation onComplete={finishIntro} />
    <main id="main"><CinemaSequence />
      <section id="contact" className="contact-section section-spacing"><div className="section-label"><span>03 / YOUR NEXT GOOD IDEA</span><span>MY DMS HAVE SEEN WEIRDER.</span></div><p>A polished brief. A chaotic voice note. Both work.</p><a className="contact-headline" href={profile.instagram} target="_blank" rel="noreferrer"><ScrambleText text="Got a brief?" /><br /><span className="script-word"><ScrambleText text="Or a vibe?" delay={0.2} /></span><span className="contact-arrow">↗</span></a><div className="contact-bottom"><span>Send the idea. I’ll bring the font opinions.</span><a href={profile.instagram} target="_blank" rel="noreferrer">DM {profile.handle} ↗</a></div></section>
    </main>
    <footer className="portfolio-footer"><PotatoLogo /><span>Designed by Gayatri.<br />Overthought by Potato.</span><a href="#home">Back to top ↑</a></footer>
  </IntroContext.Provider>
}
