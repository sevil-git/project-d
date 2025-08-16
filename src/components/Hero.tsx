import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const grayDivRef = useRef(null);
  const blackDivRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const grayDiv = grayDivRef.current;
    const blackDiv = blackDivRef.current;
    const container = containerRef.current;

    if (!grayDiv || !blackDiv || !container) return;

    // Create a timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        markers: false, // Set to true for debugging
      }
    });

    // Animate gray div - move to center and scale up
    tl.to(grayDiv, {
      x: -200, // Move left to center horizontally
      y: -100, // Move up slightly
      scale: 1.5, // Scale up
      duration: 1,
      ease: "power2.out"
    }, 0);

    // Animate black div - move to center and position below gray
    tl.to(blackDiv, {
      x: -200, // Move left to center horizontally
      y: -50, // Move up and position below gray
      duration: 1,
      ease: "power2.out"
    }, 0);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Content before animation */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Scroll Down to See Animation
          </h1>
          <p className="text-lg text-gray-600">
            Watch the gray and black divs move from bottom-right to center
          </p>
        </div>
      </div>

      {/* Animation container */}
      <div 
        ref={containerRef}
        className="relative h-screen bg-white overflow-hidden"
      >
        {/* Gray div - starts smaller at bottom right */}
        <div
          ref={grayDivRef}
          className="absolute w-40 h-32 bg-gray-400 rounded-lg"
          style={{
            bottom: '20px',
            right: '20px',
          }}
        />
        
        {/* Black div - starts at bottom right, slightly overlapping */}
        <div
          ref={blackDivRef}
          className="absolute w-48 h-20 bg-black rounded-lg"
          style={{
            bottom: '10px',
            right: '10px',
          }}
        />
      </div>

      {/* Content after animation */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Animation Complete
          </h2>
          <p className="text-lg text-gray-600">
            The divs have moved to the center and scaled appropriately
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;