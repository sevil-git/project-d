// src/App.tsx
import React, { useCallback, useRef, useState, useEffect } from "react";
import "./App.css";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import LoadingAnimation from "./components/LoadingAnimation";
import FullScreenNav from "./components/FullScreenNav";
import WeAre from "./components/weAre/WeAre";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    // if (pageRef.current) {
    //   scrollPos.current = window.scrollY;
    //   pageRef.current.style.position = "fixed";
    //   pageRef.current.style.top = `-${scrollPos.current}px`;
    //   pageRef.current.style.left = "0";
    //   pageRef.current.style.right = "0";
    // }
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    // if (pageRef.current) {
    //   pageRef.current.style.position = "";
    //   pageRef.current.style.top = "";
    //   pageRef.current.style.left = "";
    //   pageRef.current.style.right = "";
    //   window.scrollTo(0, scrollPos.current);
    // }
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu]);


  return (
    <div ref={pageRef} className="w-full h-full">
      <Navbar isOpen={isMenuOpen} onToggle={() => (isMenuOpen ? closeMenu() : openMenu())} />
      <FullScreenNav isOpen={isMenuOpen} onClose={closeMenu} />
      <div className="relative h-full">
        <LoadingAnimation />

          <HeroSection />
  
          <>
            <WeAre />
            <section className="h-screen flex items-center justify-center relative">
              <div className="text-center text-black z-20">
                <h1 className="text-6xl font-bold mb-4">Section 3</h1>
                <p className="text-xl">The black div moves to center here</p>
              </div>
            </section>
            <section className="h-screen flex items-center justify-center">
              <div className="text-center text-black">
                <h1 className="text-6xl font-bold mb-4">Section 4</h1>
                <p className="text-xl">This section scrolls normally</p>
              </div>
            </section>
          </>
      </div>
    </div>
  );
};

export default App;
