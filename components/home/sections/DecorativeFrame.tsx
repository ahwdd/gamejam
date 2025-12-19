'use client';

import React from 'react';
import Image from 'next/image';

export default function DecorativeFrame() {
  return (
    <>
      <div aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-88 md:h-144 lg:h-176 w-48 md:w-[18rem] lg:w-88 z-0 transform translate-x-6 md:translate-x-10">
        <Image src="/assets/frame.png" alt="" fill className='object-contain'
          sizes="(max-width: 768px) 12rem, (max-width: 1024px) 18rem, 22rem" priority={true}/>
      </div>

      <div aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-88 md:h-144 lg:h-176 w-48 md:w-[18rem] lg:w-88 z-0 -translate-x-6 md:-translate-x-10"
        style={{ transform: 'scaleX(-1)' }}>
        <Image src="/assets/frame.png" alt="" fill className='object-contain'
          sizes="(max-width: 768px) 12rem, (max-width: 1024px) 18rem, 22rem"
          priority={true}/>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 md:h-56 md:w-56 z-0 translate-x-6 md:translate-x-10"
      >
        <Image src="/assets/frame.png" alt="" className='object-contain' fill priority={false}/>
      </div>
    </>
  );
}
