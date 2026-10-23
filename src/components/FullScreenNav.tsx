import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion, useReducedMotion } from 'framer-motion'
import ArtworkImage from './ArtworkImage'
import { getArtwork } from '../data/artworks'
import { profile } from '../data/profile'
import PotatoLogo from './PotatoLogo'

const art = ['flower', 'minimal-og', 'jap2', 'jett-tnn'].map(getArtwork)
const links = [['Home base', '#home'], ['The work', '#work'], ['Meet Potato', '#about'], ['Let’s talk', '#contact']]
export default function FullScreenNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    const node = dialog.current
    if (!node) return
    let previousOverflow: string | undefined
    if (isOpen) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      node.showModal()
      firstLink.current?.focus({ preventScroll: true })
    }
    const context = gsap.context(() => {
      if (isOpen) {
        gsap.fromTo(node, { yPercent: -100 }, { yPercent: 0, duration: reduce ? 0 : 0.55, ease: 'power3.out' })
        gsap.fromTo('.nav-link', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0 : 0.5, stagger: 0.07, delay: reduce ? 0 : 0.15 })
      } else if (node.open) {
        gsap.to(node, { yPercent: -100, duration: reduce ? 0 : 0.5, ease: 'power3.in', onComplete: () => node.close() })
      }
    }, dialog)
    return () => {
      context.revert()
      if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow
    }
  }, [isOpen, reduce])
  useEffect(() => () => dialog.current?.close(), [])
  return <dialog ref={dialog} id="fullscreen-nav" className="fullscreen-menu" onCancel={event => { event.preventDefault(); onClose() }} aria-label="Main navigation">
    <div className="menu-top"><PotatoLogo onNavigate={onClose} /><button className="close-menu" onClick={onClose}>esc <span>×</span></button></div>
    <div className="menu-center"><div className="menu-art">{isOpen && art.map((item, i) => <motion.div key={item.id} initial={{ rotate: 0 }} animate={{ rotate: reduce ? 0 : i * 5 }} whileHover={{ rotate: reduce ? 0 : -8, scale: reduce ? 1 : 1.03 }} className="menu-art-piece" style={{ zIndex: 4 - i }}><ArtworkImage art={item} sizes="(max-width: 700px) 34vw, 300px" /></motion.div>)}</div>
      <nav aria-label="Primary">{links.map(([label, href], i) => <a ref={i === 0 ? firstLink : undefined} className="nav-link" key={href} href={href} onClick={onClose}><sup>0{i + 1}</sup>{label}<span>↗</span></a>)}</nav>
    </div>
    <div className="menu-footer"><span>Gayatri does the design.<br />Potato does the overthinking.</span><a href={profile.instagram} target="_blank" rel="noreferrer">Find me on Instagram ↗</a></div>
  </dialog>
}
