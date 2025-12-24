'use client';

import React from 'react';
import FloatingBallsDOM from './FloatingBallsDOM';

export default function DecorativeFrames({min=2, max=5}) {
  return (
    <>
    
      <FloatingBallsDOM countMin={min} countMax={max} />
      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-full z-0 w-[8%] md:w-[6%] lg:w-[5%] md:max-w-24 max-w-10 
        bg-repeat-y md:bg-size-[6rem,auto] bg-size-[2.5rem,auto] bg-top-right"
        style={{ backgroundImage: 'url("/assets/frame.png")', }}
      />

      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-full z-0 w-[8%] md:w-[6%] lg:w-[5%] md:max-w-24 max-w-10 
        bg-repeat-y md:bg-size-[6rem,auto] bg-size-[2.5rem,auto] bg-top-left -scale-100 rotate-180"
        style={{ backgroundImage: 'url("/assets/frame.png")', }}
      />
    </>

  );
}