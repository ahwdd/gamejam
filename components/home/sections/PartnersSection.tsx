import Image from 'next/image'
import React from 'react'

function PartnersSection() {
  return (
    <section id='partners' className='bg-white w-full py-4 md:py-8 flex items-center justify-center'>
      <div className='flex justify-around items-center gap-2 container max-w-180 w-full px-4'>
        <Image src="/assets/logos/sp1.png" alt="Sponsor 1" width={200} height={100}
                className="h-14 md:h-19 xl:h-24 w-auto brightness-0 contrast-200" />
        <Image src="/assets/logos/sp2.png" alt="Sponsor 2" width={200} height={100}
                className="h-8 md:h-13 xl:h-18 w-auto" />
        <Image src="/assets/logos/sp3.png" alt="Sponsor 3" width={200} height={100}
                className="h-7 md:h-12 xl:h-17 w-auto" />
      </div>
    </section>
  )
}

export default PartnersSection