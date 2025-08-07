// src/components/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import play from "../assets/play.svg";
import star from "../assets/star.svg";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const blackDivRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion Variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const mediaVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  useEffect(() => {
    const blackDiv = blackDivRef.current;
    const section2 = section2Ref.current;
    const container = containerRef.current;

    if (!blackDiv || !section2 || !container) return;

    // Set initial position of black div
    gsap.set(blackDiv, {
      position: "fixed",
      bottom: "-4rem",
      right: "-4rem",
      width: "768",
      height: "432",
    });

    // Create timeline for the animation (no const assignment)
    gsap.timeline({
      scrollTrigger: {
        trigger: section2,
        start: "top bottom",
        end: "center center",
        scrub: true,
        // markers:true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Calculate position based on scroll progress
          const startX = window.innerWidth - 764;
          const startY = window.innerHeight - 428;

          const endX = (window.innerWidth - 875) / 2;
          const endY = (window.innerHeight - 555) / 2;

          // Linear interpolation on both axes:
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;

          gsap.set(blackDiv, {
            x: currentX - startX,
            y: currentY - startY,
            scale: 1 + progress * 0.5,
          });
        },
      },
    });

    // Second animation: make it scroll with section 2
    ScrollTrigger.create({
      trigger: section2,
      start: "center center",
      end: "bottom top",
      onEnter: () => {
        gsap.set(blackDiv, {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.5)",
          bottom: "auto",
          right: "auto",
          x: 0,
          y: 0,
        });
      },
      onLeaveBack: () => {
        gsap.set(blackDiv, {
          position: "fixed",
          top: "auto",
          left: "auto",
          transform: "none",
          bottom: "-4rem",
          right: "-4rem",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Section 1 */}
      <section className="h-screen relative flex flex-col gap-25 items-center">
        <div className="flex gap-10 h-fit mt-25 mx-20">
          <div className="flex flex-col items-start">
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-9xl font-biogem font-medium uppercase text-black mb-4"
            >
              Crafting Bol<span className="font-mysoul ">d</span>
            </motion.h1>
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-9xl text-nowrap -mt-1 font-biogem font-medium uppercase text-black mb-4"
            >
              Stories Through{" "}
            </motion.h1>
          </div>
          {/* play animation  */}
          <div className=" flex -mt-10 items-center justify-end text-center">
            <motion.h1
              variants={mediaVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl font-poppins whitespace-nowrap flex items-center"
            >
              <span>Media</span>

              {/* decorative icon */}
              <img
                src={play}
                alt=""
                aria-hidden="true"
                className="mx-2 h-2 w-2 inline-block"
              />

              <span>Motion</span>

              {/* decorative icon */}
              <img
                src={play}
                alt=""
                aria-hidden="true"
                className="mx-2 h-6 w-6 inline-block"
              />

              <span>Content</span>
            </motion.h1>
          </div>
        </div>
        <div className="w-full flex items-start">
          <p className="max-w-md mx-55 mt-6 text-xl uppercase font-light font-poppins">
            Project D is a Mumbai-based creative agency specializing in
            transforming visions into cinematic realities.
          </p>
        </div>

        {/* absolute position divs  */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 flex">
          <img src={star} className="h-4 w-4" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -ml-10 left-0 flex">
          <h1 className="text-nowrap text-sm transform rotate-90">
            Featured Works
          </h1>
        </div>
      </section>

      {/* Section 2 */}
      <section
        ref={section2Ref}
        className="h-[200vh] bg-biege flex items-center justify-center relative"
      >
        {/* Black div that will be animated */}
        <div ref={blackDivRef} className="bg-black rounded-lg shadow-2xl" />
      </section>
    </div>
  );
}
