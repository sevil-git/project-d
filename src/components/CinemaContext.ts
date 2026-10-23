import { createContext } from 'react'
import type { Dispatch, SetStateAction, RefObject } from 'react'

export const CinemaContext = createContext<{ active: number; setActive: Dispatch<SetStateAction<number>>; heroRender: RefObject<(() => void) | null>; stripRender: RefObject<(() => void) | null>; reelPosition: RefObject<number> }>({ active: 0, setActive: () => {}, heroRender: { current: null }, stripRender: { current: null }, reelPosition: { current: 0 } })
