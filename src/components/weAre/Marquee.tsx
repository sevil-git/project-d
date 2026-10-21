import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export type MarqueeProps = {
  items: string[];
  speed?: number; // seconds per full loop
  className?: string;
  icon?: React.ReactNode; // e.g. <Star />
  pauseOnHover?: boolean;
};

function Strip({ items, icon, ariaHidden }: Pick<MarqueeProps, "items" | "icon"> & { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex items-center whitespace-nowrap gap-4"
    >
      {items.map((w, i) => (
        <li key={`${w}-${i}`} className="flex items-center gap-4">
          <span className="uppercase tracking-[0.14em] font-poppins font-light text-sm md:text-2xl">
            {w}
          </span>
          {icon ? <span aria-hidden>{icon}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function Marquee({
  items,
  speed = 18,
  className = "",
  icon,
  pauseOnHover = true,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    // reset any previous tween
    tlRef.current?.kill();

    // animate the track left by 50% of its width forever
    tlRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: speed,
      repeat: -1,
    });

    const node = trackRef.current;

    if (pauseOnHover) {
      const onEnter = () => tlRef.current?.pause();
      const onLeave = () => tlRef.current?.resume();
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
      return () => {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
        tlRef.current?.kill();
      };
    }
    return () => { tlRef.current?.kill(); };
  }, [speed, pauseOnHover]);



  return (
    <div
      className={`relative overflow-hidden w-full select-none ${className}`}
      role="region"
      aria-label="Scrolling highlights"
    >
      <div ref={trackRef} className="flex w-max">
        <Strip items={items} icon={icon} />
        <Strip items={items} icon={icon} ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />
    </div>
  );
}
