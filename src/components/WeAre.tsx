import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion"
// If your setup supports SVGR (CRA, Vite, Next w/ svgr), this gives you a React component:
import StarIcon  from "../assets/star.svg";
// If you don't have path aliases, use: "../../assets/star.svg"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
};
const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const fadeLeft: Variants = { hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const fadeRight: Variants = { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };

/* ------------------------------ Marquee ------------------------------ */
type MarqueeProps = { text: string; speedSec?: number; repeatBlock?: number };
const Marquee: React.FC<MarqueeProps> = ({ text, speedSec = 22, repeatBlock = 8 }) => {
  const rMotion = useReducedMotion();
  const WordsWithStars = ({ indexOffset = 0 }: { indexOffset?: number }) => {
    const words = text.split(/\s+/).filter(Boolean);
    return (
      <span className="whitespace-nowrap">
        {words.map((w, i) => (
          <span key={`w-${indexOffset}-${i}`} className="inline-flex items-center text-biege gap-2">
            <span>{w}</span>
            {/* your own star.svg */}
            <img src={StarIcon} alt="Star" className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </span>
        ))}
      </span>
    );
  };
  const block = Array.from({ length: repeatBlock }).map((_, i) => (
    <React.Fragment key={`blk-${i}`}>
      <WordsWithStars indexOffset={i} />
      <span className="mx-4" />
    </React.Fragment>
  ));
  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-[10px] md:text-[11px] uppercase tracking-[0.25em]"
        aria-hidden
        animate={rMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={rMotion ? undefined : { duration: speedSec, ease: "linear", repeat: Infinity }}
      >
        <div className="shrink-0 pr-8">{block}</div>
        <div className="shrink-0 pr-8">{block}</div>
      </motion.div>
      <span className="sr-only">{text.replace(/\s+/g, " ")}</span>
    </div>
  );
};

/* ------------------------------ Section ------------------------------ */
const ProjectDSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rMotion = useReducedMotion();

  // Parallax on the central image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] // when top of section hits bottom of viewport -> when bottom hits top
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);        // vertical drift
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]); // gentle scale

  return (
    <section
      ref={sectionRef}
      id="what"
      className="relative min-h-screen w-full bg-biege text-black overflow-hidden"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.35, once: true }}
        className="mx-auto max-w-6xl px-6 md:px-10 pt-14 md:pt-20 pb-36"
      >
        {/* twin paragraphs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center">
          <motion.p variants={fadeUp} className="text-center tracking-[0.15em] leading-relaxed uppercase text-[12px] md:text-[13px]">
            WE ARE <br /><span className="font-semibold">PROJECT D</span>, <br />AND WE’RE HERE TO TELL <br />YOUR STORY IN CINEMA.
          </motion.p>
          <motion.p variants={fadeUp} className="text-center tracking-[0.15em] leading-relaxed uppercase text-[12px] md:text-[13px]">
            WE ARE <br /><span className="font-semibold">PROJECT D</span>, <br />AND WE’RE HERE TO TELL <br />YOUR STORY IN CINEMA.
          </motion.p>
        </div>

        {/* middle strip */}
        <div className="relative mt-10 md:mt-14">
          <motion.div variants={fadeLeft} className="absolute -left-2 md:-left-10 top-2 text-[10px] uppercase tracking-widest">
            <div className="opacity-60">No limits, (01)</div>
            <div className="opacity-80">Just vision.</div>
          </motion.div>
          <motion.div variants={fadeRight} className="absolute -right-2 md:-right-10 top-2 text-[10px] uppercase tracking-widest text-right">
            <div className="opacity-60">(02) Cinematic</div>
            <div className="opacity-80">Ideas. Flawless execution.</div>
          </motion.div>

          <div className="flex items-center justify-between">
            <motion.span variants={fadeLeft} className="select-none text-[88px] md:text-[120px] font-black tracking-tight leading-none">WE</motion.span>

            {/* Parallax image */}
            <motion.div
              variants={fadeUp}
              className="mx-4 flex-1 max-w-3xl"
              style={rMotion ? undefined : { y, scale }}
            >
              <div className="rounded-[18px] border-[6px] border-black/80 p-1">
                <img
                  src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1600&auto=format&fit=crop"
                  alt="Project D still"
                  className="block w-full rounded-[12px] object-cover aspect-[16/9]"
                />
              </div>
            </motion.div>

            <motion.span variants={fadeRight} className="select-none text-[88px] md:text-[120px] font-black tracking-tight leading-none">ARE</motion.span>
          </div>
        </div>

        {/* bottom headline */}
        <motion.h3 variants={fadeUp} className="mt-10 md:mt-14 text-center text-[22px] md:text-[28px] tracking-[0.14em] uppercase">
          <span className="font-semibold">Project D</span> is where stories come alive
          <span className="inline-block w-10 align-middle border-t border-black/70 mx-2" />
          and visuals are born iconic
        </motion.h3>
      </motion.div>

      {/* fixed marquee bar at the bottom */}
      <div className="pointer-events-none fixed left-4 right-4 bottom-4 md:bottom-6">
        <div className="flex items-center gap-3 text-white rounded-2xl px-5 py-3 shadow">
          <span className="font-extrabold uppercase tracking-wide">Warning</span>
          <Marquee text="SIDE EFFECTS OF WORKING WITH US INCLUDE ICONIC IMAGERY, CINEMATIC GOOSEBUMPS, AND A LITTLE OBSESSION." />
        </div>
      </div>
    </section>
  );
};

export default ProjectDSection;
