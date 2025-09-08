// src/components/LoadingAnimation.tsx
import { useEffect } from 'react';
import { gsap } from 'gsap';
import Flip from 'gsap/Flip';
import CustomEase from 'gsap/CustomEase';
import SplitType from 'split-type';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';

const initialImgs = [img2, img1, img3, img4, img2];
const mainImgs = [img1, img3, img4];

// interface LoadingAnimationProps {
//   setIsLoading: (loading: boolean) => void;
// }

const LoadingAnimation = () => {
  useEffect(() => {
    gsap.registerPlugin(Flip, CustomEase);

    CustomEase.create('hop', 'M0,0 C0.335,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1');
    CustomEase.create('hop2', 'M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1');

    // Split lines if you use them later
    const split = new SplitType('.site-info h2', { types: 'lines' });
    split.lines?.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.className = 'line';
      const span = document.createElement('span');
      span.textContent = line.textContent;
      wrapper.appendChild(span);
      line.parentNode?.replaceChild(wrapper, line);
    });

    const revealerTl = gsap.timeline();
    revealerTl
      .to('.r-1', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.5,
        ease: 'hop',
      })
      .to(
        '.r-2',
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          duration: 1.5,
          ease: 'hop',
        },
        '<'
      );
    // Image‐scale timeline
    const scaleTl = gsap.timeline();
    scaleTl.to('.img:first-child', {
      scale: 1, duration: 1.5, ease: 'power4.inOut'
    });
    document.querySelectorAll<HTMLDivElement>('.img:not(:first-child)')
      .forEach(el => {
        scaleTl.to(el, {
          opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out'
        }, '>-');
      });

    // Combine, then Flip-stacker
    gsap.timeline()
      .add(revealerTl)
      .add(scaleTl, '-=1.25')
      .add(() => {
        document.querySelectorAll('.img:not(.main)').forEach(el => el.remove());
        const state = Flip.getState('.main');
        document.querySelector('.images')?.classList.add('stacked-container');
        document.querySelectorAll<HTMLDivElement>('.main').forEach((el, i) => {
          el.classList.add('stacked');
          el.style.order = `${i}`;
          gsap.set('.img.stacked', { clearProps: 'transform, top, left' });
        });
        Flip.from(state, {
          duration: 2,
          ease: 'hop',
          absolute: true,
          stagger: { amount: -0.3 },
        });
        // Set z-index of .revealers to -99
        const revealers = document.querySelector('.revealers') as HTMLElement | null;
        if (revealers) {
          revealers.style.zIndex = '-99';
        }
        // Set z-index of .images-wrapper to 0
        setTimeout(() => {
          const imagesWrapper = document.querySelector('.images-wrapper') as HTMLElement | null;
          if (imagesWrapper) {
            imagesWrapper.style.zIndex = '10';
          }
        }, 3500);
      });
  }, []);

  return (
    <>
      <div className="revealers">
        <div className="revealer r-1" />
        <div className="revealer r-2" />
      </div>

      {/* ← Wrap only the .images in an overflow-hidden container */}
      <div className="images-wrapper">
        <div className="images">
          {initialImgs.map((src, idx) => (
            <div className="img" key={`init-${idx}`}>
              <img src={src} alt="" />
            </div>
          ))}
          {mainImgs.map((src, idx) => (
            <div className="img main" key={`main-${idx}`}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LoadingAnimation;
