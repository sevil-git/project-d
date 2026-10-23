import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const lenis = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ? undefined
  : new Lenis({ lerp: 0.3, autoRaf: true, anchors: true })
lenis?.on('scroll', ScrollTrigger.update)
import.meta.hot?.dispose(() => lenis?.destroy())

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
