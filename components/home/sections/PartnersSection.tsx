'use client';

import Image from 'next/image';
import React from 'react';
import { motion, Transition } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '@/motion/motion';

function PartnersSection() {
  return (
    <section id="partners" className="bg-white w-full py-4 md:py-8 flex items-center justify-center">
      <motion.div
        className="flex justify-around items-center gap-2 container max-w-180 w-full px-4"
        variants={staggerContainer}
        initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}>
        <motion.div variants={fadeUpItem}>
          <Image src="/assets/logos/sp1.png" alt="Sponsor 1" width={200} height={100}
            className="h-14 md:h-19 xl:h-24 w-auto brightness-0 contrast-200"/>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <Image src="/assets/logos/sp2.png" alt="Sponsor 2" width={200} height={100}
            className="h-8 md:h-13 xl:h-18 w-auto"/>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <Image src="/assets/logos/sp3.png" alt="Sponsor 3" width={200} height={100}
            className="h-7 md:h-12 xl:h-17 w-auto"/>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default PartnersSection;
