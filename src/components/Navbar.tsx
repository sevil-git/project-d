// /Users/sahil/Documents/GitHub/project-d/src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import gsap from "gsap";

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, onToggle }) => {
  const [translateY, setTranslateY] = useState(0);
  const [lastScroll, setLastScroll] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  const shortLineRef = useRef<HTMLDivElement>(null);
  const longLineRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  // Hide-on-scroll ONLY when menu is closed
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isOpen) {
        // Keep navbar visible while menu is open
        setTranslateY(0);
        return;
      }
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentScroll = window.scrollY;
        setTranslateY(currentScroll > lastScroll ? -100 : 0);
        setLastScroll(currentScroll);
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScroll, isOpen]);

  // Hamburger animation (use a single timeline to avoid race conditions)
  useEffect(() => {
    // kill any previous tween to keep things snappy
    tlRef.current?.kill();

    if (isOpen) {
      // to "open" state
      const tl = gsap.timeline();
      tl.to(shortLineRef.current, {
        width: 0,
        duration: 0.2,
        ease: "power2.out",
      }).to(
        longLineRef.current,
        {
          width: 20,
          height: 3,
          y: -2,
          rotate: 0, // keep as bar; change to 45 for cross if you add a 3rd line
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );
      tlRef.current = tl as unknown as gsap.core.Tween;
    } else {
      // to "closed" state
      const tl = gsap.timeline();
      tl.to(shortLineRef.current, {
        width: 20,
        duration: 0.6,
        ease: "power2.out",
      }).to(
        longLineRef.current,
        {
          width: 12,
          height: 2,
          y: 0,
          rotate: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );
      tlRef.current = tl as unknown as gsap.core.Tween;
    }
  }, [isOpen]);

  return (
    <nav className="flex font-poppins fixed top-0 left-0 z-[12] w-full items-center justify-between p-4">
      <div className="font-bold text-sm h-5 overflow-hidden">
        <img
          src={logo}
          alt="Project D Logo"
          className="h-full w-full transition-transform duration-300"
          style={{ transform: `translateY(${translateY}%)` }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="ml-2 overflow-hidden">
          <h2
            ref={textRef}
            style={{ transform: `translateY(${translateY}%)` }}
            className="transition-transform duration-300"
          >
            {isOpen ? "esc" : "menu"}
          </h2>
        </div>

        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="fullscreen-nav"
          className={`relative w-9 h-9 rounded-full ${
            isOpen ? "bg-biege" : "bg-black"
          } flex flex-col gap-1 items-center p-1 justify-center cursor-pointer hover:scale-105 transition-transform duration-300`}
          onClick={() => {
            onToggle();
            if (textRef.current) {
              gsap.to(textRef.current, {
                color: isOpen ? "black" : "beige",
                duration: 0.2,
                ease: "power2.out",
                delay: 0.5,
              });
            }
            gsap.to([shortLineRef.current, longLineRef.current], {
              backgroundColor: isOpen ? "white" : "black",
              duration: 0.2,
              ease: "power2.out",
            });
          }}
        >
          <div ref={shortLineRef} className="w-5 h-[2px] bg-white"></div>
          <div ref={longLineRef} className="w-3 h-[2px] bg-white"></div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
