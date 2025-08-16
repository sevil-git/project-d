// /Users/sahil/Documents/GitHub/project-d/src/components/FullScreenNav.tsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import star from "../assets/starw.svg"

const IMAGES = [img1, img2, img3, img4];


const FullScreenNav: React.FC<FullScreenNavProps> = ({ isOpen, onClose }) => {
  const navRef = useRef<HTMLDivElement>(null);

  // slide in/out overlay
  useEffect(() => {
    if (!navRef.current) return;

    if (isOpen) {
      gsap.set(navRef.current, { y: "-100%", display: "block" });
      gsap.to(navRef.current, { y: "0%", duration: 0.55, ease: "power3.out" });

      // stagger in menu links + footer bits
      gsap.fromTo(
        navRef.current.querySelectorAll(".nav-link"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.1,
        }
      );
      gsap.fromTo(
        navRef.current.querySelectorAll(".footer-fade"),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(navRef.current, {
        y: "-100%",
        duration: 0.7,
        ease: "power3.in",
        onComplete: () => {
          // ensure callback returns void (fixes TS error)
          if (navRef.current) {
            gsap.set(navRef.current, { display: "none" });
          }
        },
      });
    }
  }, [isOpen]);



  return (
    <div
      id="fullscreen-nav"
      ref={navRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 w-full h-screen z-[9998] overflow-hidden text-white bg-[#305b4f]"
      style={{ display: "none" }}
      onClick={onClose}
    >
      <AnimatePresence>
        {isOpen && (
          <div
            className="relative mx-auto h-full max-w-[1400px] px-5 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* star  */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 flex">
              <img src={star} className="h-4 w-4 fill-beige" />
            </div>
            <div className="h-full flex justify-center gap-8 md:gap-20 items-center">
              {/* LEFT: stacked images */}
              <div className="flex items-center w-[400px] h-full justify-center">
                <motion.div className="relative w-[70vw] max-w-[320px] md:w-full md:max-w-[320px] aspect-[3/4]">
                  {IMAGES.map((src, i) => (
                    <motion.img
                      key={i}
                      src={src}
                      alt={`stack-${i + 1}`}
                      className={`absolute inset-0 m-auto h-full w-full object-cover rounded-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${
                        i === 0
                          ? "z-40"
                          : i === 1
                          ? "z-30"
                          : i === 2
                          ? "z-20"
                          : "z-10"
                      }`}
                      /* Stack perfectly and begin flat */
                      initial={{ rotate: 0, x: 0, y: 0, scale: 1 }}
                      /* One-time settle to a small angle (no loop) */
                      animate={{ rotate: i * 4, x: 0, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.9,
                        ease: "easeInOut",
                        delay: i * 0.08, // tiny offset so they don't all move at once
                      }}
                      /* On hover, increase the rotation a bit more */
                      whileHover={{ rotate: i % 2 ? 10 : -10, scale: 1.02 }}
                      style={{
                        transformOrigin: "50% 60%",
                        scale: 1, // keep all the same size so they fully overlap
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* RIGHT: big nav */}
              <div className="flex items-center justify-center">
                <nav aria-label="Primary" className="select-none">
                  <ul className="space-y-4 md:space-y-6">
                    {["Home", "About", "Portfolio", "Contact"].map((label) => (
                      <li key={label} className="overflow-hidden">
                        <a
                          href="#"
                          className="nav-link block font-extrabold uppercase leading-[0.95] tracking-tight
                                     text-5xl sm:text-6xl md:text-7xl
                                     hover:opacity-90 transition-opacity"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* footer bar */}
            <div className="absolute bottom-6 left-0 right-0 px-5 md:px-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-white/30 pt-4">
                <div className="flex items-center gap-8">
                  <a
                    href="#"
                    className="footer-fade text-sm md:text-base underline underline-offset-4 decoration-white/40 hover:decoration-white"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="footer-fade text-sm md:text-base underline underline-offset-4 decoration-white/40 hover:decoration-white"
                  >
                    LinkedIn
                  </a>
                </div>

                <div className="footer-fade text-right md:text-left text-sm md:text-base">
                  <div className="opacity-80">
                    LOREM IPSUMDOLER,
                    <br className="hidden md:block" />
                    LOREMLER, MUMBAI
                  </div>
                  <a
                    href="mailto:hello@example.com"
                    className="ml-auto mt-2 inline-block underline underline-offset-4 decoration-white/40 hover:decoration-white"
                  >
                    Email Us
                  </a>
                </div>

                <div className="footer-fade ml-auto md:ml-0 text-xs md:text-sm opacity-80">
                  Developed by <span className="font-semibold">SEVIL</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullScreenNav;
