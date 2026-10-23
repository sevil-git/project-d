import { useMemo, useRef, useState } from 'react'
import { CinemaContext } from './CinemaContext'
import CinemaFilmstrip from './CinemaFilmstrip'
import HeroSection from './HeroSection'
import HeroArtworkTransition from './HeroArtworkTransition'
import WorkGallery from './WorkGallery'

export default function CinemaSequence() {
  const [active, setActive] = useState(0)
  const heroRender = useRef<(() => void) | null>(null)
  const stripRender = useRef<(() => void) | null>(null)
  const reelPosition = useRef(0)
  const cinema = useMemo(() => ({ active, setActive, heroRender, stripRender, reelPosition }), [active])
  return <CinemaContext.Provider value={cinema}>
    <div className="cinema-sequence"><CinemaFilmstrip /><HeroSection /><HeroArtworkTransition /><WorkGallery /></div>
  </CinemaContext.Provider>
}
