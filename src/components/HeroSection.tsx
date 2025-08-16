import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import play from "../assets/play.svg";
import star from "../assets/star.svg";
import video from "../assets/video.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  // Single 300vh section + sticky stage + absolute parent + child card
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);     // sticky stage (relative)
  const parentRef = useRef<HTMLDivElement>(null);    // absolute parent (top-0 left-0, fills stage)
  const cardRef = useRef<HTMLDivElement>(null);      // child video (absolute in parent)

  // Knobs
  const TARGET_SCALE = 1.9;    // scale at center
  const SCALE_START = 0.3;     // start scaling after 60% of travel to center
  const RIGHT_INSET = -334;      // distance from right edge at start
  const BOTTOM_INSET = -250;     // distance from bottom edge at start
  const MIN_M = 16, MAX_M = 32;

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const mediaVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const parent = parentRef.current!;
    const card = cardRef.current!;
    if (!section || !stage || !parent || !card) return;

    let tl: gsap.core.Timeline | null = null;

    const build = () => {
      // cleanup before rebuild
      tl?.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.id === "cardTimeline") st.kill();
      });

      // ---- Size card (responsive 16:9)
      const vw = window.innerWidth;
      const width = Math.max(260, Math.min(0.42 * vw, 880));
      const height = (width * 9) / 16;
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;

      const stageRect = stage.getBoundingClientRect();
      const m = Math.max(MIN_M, Math.min(MAX_M, window.innerWidth * 0.02));

      // ---- START: anchor with right/bottom (precise bottom-right)
      const rightGap = m + RIGHT_INSET;
      const bottomGap = m + BOTTOM_INSET;

      gsap.set(card, {
        position: "absolute",
        right: rightGap,
        bottom: bottomGap,
        left: "auto",
        top: "auto",
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "50% 50%",
        willChange: "transform",
      });

      // Measure the actual on-screen start box, then convert to STAGE coords
      const startRect = card.getBoundingClientRect();
      const startLeft = startRect.left - stageRect.left;
      const startTop  = startRect.top  - stageRect.top;

      // ---- TARGET: perfect center (in STAGE coords)
      const centerLeft = (stageRect.width  - width) / 2;
      const centerTop  = (stageRect.height - height) / 2;

      const dx = centerLeft - startLeft;
      const dy = centerTop  - startTop;

      // ---- Timeline: animate only during the last 200vh (100vh→300vh)
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "cardTimeline",
          trigger: section,
          start: "top top+=100%",  // after the first 100vh
          end: "center top",       // use "bottom top" if you want full 200vh
          scrub: true,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      // Move straight to center
      tl.to(card, { x: dx, y: dy, duration: 1 }, 0);

      // Scale later (so the path doesn’t “lift”)
      tl.to(card, { scale: TARGET_SCALE, ease: "power1.out", duration: 1 - SCALE_START }, SCALE_START);
    };

    build();

    const onResize = () => {
      build();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      tl?.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.id === "cardTimeline") st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-biege">
      {/* Sticky viewport-height stage */}
      <div className="sticky top-0 z-20">
        <div ref={stageRef} className="relative h-screen w-full">
          {/* Parent overlay: absolute, always top-0 left-0 and fills the stage */}
          <div ref={parentRef} className="absolute overflow-x-clip inset-0">
            {/* Child video: absolute within parent; we animate x/y from bottom-right → center */}
            <div
              ref={cardRef}
              className="bg-black rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
              style={{ willChange: "transform" }}
            >
              <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* First 100vh: hero content (scrolls normally beneath the overlay) */}
      <div className="absolute top-0 z-10 h-screen w-full flex flex-col gap-25 items-center">
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
          <div className="flex -mt-10 items-center justify-end text-center">
            <motion.h1
              variants={mediaVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl font-poppins whitespace-nowrap flex items-center"
            >
              <span>Media</span>
              <img src={play} alt="" aria-hidden="true" className="mx-2 h-2 w-2 inline-block" />
              <span>Motion</span>
              <img src={play} alt="" aria-hidden="true" className="mx-2 h-6 w-6 inline-block" />
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

        <div className="absolute top-1/2 -translate-y-1/2 right-0 flex">
          <img src={star} className="h-4 w-4" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -ml-10 left-0 flex">
          <h1 className="text-nowrap text-sm transform rotate-90">
            Featured Works
          </h1>
        </div>
      </div>

      {/* Remaining 200vh: empty area that drives the animation */}
      <div className="h-[200vh]" />
    </section>
  );
}
