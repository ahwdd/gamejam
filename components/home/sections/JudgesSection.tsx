'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CONFIG } from '@/config/siteConfig';
import GameathonBadge from '@/components/ui/GameathonBadge';
import { staggerContainer, fadeUpItem } from '@/motion/motion';

export default function JudgesSection() {
  const t = useTranslations('judges');

  return (
    <section id="judges" className="relative py-4 md:py-8">
      <div className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10">

        <motion.div variants={staggerContainer}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUpItem} className="flex justify-center">
            <GameathonBadge className="text-sm md:text-lg xl:text-xl">
              {t('badge')}
            </GameathonBadge>
          </motion.div>

          <motion.h2 variants={fadeUpItem}
            className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center mb-2 md:mb-4">
            {t('title')}
          </motion.h2>

          <motion.p variants={fadeUpItem}
            className="text-sm md:text-xl xl:text-2xl text-gray-400 text-center mb-12 md:mb-16">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Desktop */}
        <div className="">

          <motion.div variants={staggerContainer}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-wrap items-start justify-center gap-4 max-md:gap-y-2 lg:gap-6 lg:my-6 sm:my-4 xl:mx-8 md:mx-6">
            {CONFIG.judges.judges.map((member: any, i) => (
              <motion.div key={member.enName} variants={fadeUpItem} 
                className="relative max-w-48 rounded-2xl text-xs text-[10px] md:text-xs xl:text-sm flex flex-col items-center 
                justify-between sm:justify-center lg:w-[calc(20%-1.5rem)]! w-[calc(33%-1rem)]!">
                <div className="aspect-square">
                  <Image src={member.img} alt={t(`member${i+1}Name`)} width={400} height={400}
                    className="w-full h-full object-cover rounded-4xl max-w-66 max-h-66"/>
                </div>

                <div className="flex flex-col justify-center items-center gap-1 p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-xl max-sm:w-[140%] text-center">
                    {t(`member${i+1}Name`)}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base w-[120%] text-center">
                    {t(`member${i+1}Role`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerContainer}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex gap-4 max-md:gap-y-2 lg:gap-6 items-center justify-center xl:mx-8 md:mx-6">
            {CONFIG.judges.mentors.map((member: any, i) => (
              <motion.div key={member.enName} variants={fadeUpItem} 
              className="relative max-w-48 rounded-2xl text-xs text-[10px] md:text-xs xl:text-sm flex flex-col items-center 
              justify-between sm:justify-center">
                <div className="aspect-square">
                  <Image src={member.img} alt={t(`member${i+1}Name`)} width={400} height={400}
                    className="w-full h-full object-cover rounded-4xl"/>
                </div>

                <div className="flex flex-col justify-center items-center gap-1 p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-xl max-sm:w-[140%] text-center">
                    {t(`member${i+6}Name`)}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base w-[120%] text-center">
                    {t(`member${i+6}Role`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}