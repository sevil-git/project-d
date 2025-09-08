import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Variants } from "framer-motion";
import { Marquee } from "./Marquee";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

import { Star } from "./Star";

const words = [
  "Side",
  "Effects",
  "Of",
  "Working",
  "With",
  "Us",
  "Include",
  "Iconic",
  "Imagery",
  "Cinematic",
  "GOOSEBUMPS",
  "And",
  "A",
  "LITTLE",
  "OBSESSION",
];

const WeAre: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rMotion = useReducedMotion();

  // Parallax on the central image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // when top of section hits bottom of viewport -> when bottom hits top
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]); // vertical drift
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]); // gentle scale

  return (
    <section
      ref={sectionRef}
      id="what"
      className="relative min-h-screen mt-52 w-full bg-biege text-black overflow-hidden"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.35, once: true }}
        className="mx-auto max-w-6xl px-6 md:px-10 pt-14 md:pt-20 pb-36"
      >
        {/* twin paragraphs */}
        <div className="flex justify-center gap-4">
          <motion.p
            variants={fadeUp}
            className="text-right tracking-[0.15em] leading-relaxed uppercase text-[12px] md:text-[13px]"
          >
            WE ARE <br />
            <span className="font-semibold">PROJECT D</span>, <br />
            AND WE'RE <br /> HERE TO TELL <br />
            YOUR STORY <br /> IN CINEMA.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-left tracking-[0.15em] leading-relaxed uppercase text-[12px] md:text-[13px]"
          >
            WE ARE <br />
            <span className="font-semibold">PROJECT D</span>, <br />
            AND WE'RE <br /> HERE TO TELL <br />
            YOUR STORY <br /> IN CINEMA.
          </motion.p>
        </div>

        {/* middle strip */}
        <div className="relative mt-10 md:mt-14">
          <motion.div
            variants={fadeLeft}
            className="absolute -left-2 md:-left-10 top-2 text-[10px] uppercase tracking-widest text-center"
          >
            <div className="opacity-60">No limits, (01)</div>
            <div className="opacity-80">Just vision.</div>
          </motion.div>
          <motion.div
            variants={fadeRight}
            className="absolute -right-2 md:-right-10 top-2 text-[10px] uppercase tracking-widest text-center"
          >
            <div className="opacity-60">(02) Cinematic</div>
            <div className="opacity-80">Ideas. Flawless </div>
            <div className="opacity-80">execution. </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <motion.span
              variants={fadeLeft}
              className="select-none font-biogem text-[88px] md:text-[120px] font-black"
            >
              WE
            </motion.span>

            {/* Parallax image */}
            <motion.div
              variants={fadeUp}
              className="mx-4 flex-1 max-w-2xl"
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

            <motion.span
              variants={fadeRight}
              className="select-none font-biogem text-[88px] md:text-[120px] font-black"
            >
              ARE
            </motion.span>
          </div>
        </div>

        {/* bottom headline */}
        <motion.h3
          variants={fadeUp}
          className="mt-10 md:mt-14 text-center text-[22px] md:text-[28px] tracking-[0.14em] uppercase"
        >
          <span className="font-semibold">Project D</span> is where stories come
          alive
          <span className="inline-block w-10 align-middle border-t border-black/70 mx-2" />
          and visuals are born iconic
        </motion.h3>
      </motion.div>

      <div className="absolute bottom-2 left-2 z-30">
        <h1 className="bg-black uppercase font-biogem text-biege px-6 tracking-wide py-3 rounded-2xl text-4xl ">
          Warning
        </h1>
      </div>
      <div className="absolute bottom-0 left-2 right-0">
        <Marquee items={words} icon={<Star />} speed={16} className="py-3" />
      </div>
    </section>
  );
};

export default WeAre;
