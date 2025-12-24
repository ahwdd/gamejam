'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CONFIG } from '@/config/siteConfig';
import GameathonBadge from '@/components/ui/GameathonBadge';
import { staggerContainer, fadeUpItem } from '@/motion/motion';

export default function PrizesSection() {
  const t = useTranslations('prizes');

  return (
    <section id="prizes" className="relative py-4 md:py-8">
      <div className="container mx-auto px-4 relative z-10 space-y-2 md:space-y-4">

        <motion.div variants={staggerContainer} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="space-y-2 md:space-y-4">
          <motion.div variants={fadeUpItem} className="flex justify-center">
            <GameathonBadge className="text-sm md:text-lg xl:text-xl">
              {t('badge')}
            </GameathonBadge>
          </motion.div>

          <motion.h2 variants={fadeUpItem}
            className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center">
            {t('title')}
          </motion.h2>

          <motion.p variants={fadeUpItem}
            className="text-sm md:text-xl xl:text-xl text-gray-400 text-center lg:max-w-6xl sm:max-w-[calc(100%-7rem)] 
            max-w-[calc(100%-.5rem)] mx-auto mb-6 md:mb-16">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <motion.div variants={staggerContainer} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="flex items-center justify-center md:gap-[2.5%] gap-2 mb-6 md:mb-12 lg:max-w-6xl 
          sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto">
          {CONFIG.prizes.topPrizes.map((prize, i) => (
            <motion.div key={prize.place} variants={fadeUpItem}
              className={`relative rounded-2xl overflow-hidden border backdrop-blur-sm md:aspect-square ${i == 1 ? 'w-3/9' : 'w-3/10'}`}
              style={{
                background: prize.bgColor,
                border: prize.borderColor,
                boxShadow: prize.shadow,
              }}>
              <div className="2xl:px-16 md:px-4 p-2 text-center flex items-center justify-center flex-col size-full gap-1 md:gap-3">
                <div style={{ background: prize.iconBg, boxShadow: prize.iconShadow }}
                  className="inline-flex items-center justify-center xl:size-26 lg:size-20 size-8 rounded-full mb-1">
                  <Image src={prize.icon} alt={t(prize.key)} width={48} height={48} 
                    className="xl:size-16 lg:size-12 size-6 object-contain" />
                </div>

                <h3 className="text-white flex flex-col items-center justify-center gap-1 md:gap-3">
                  <span className="block font-bold tracking-wide text-sm lg:text-2xl">{prize.en}</span>
                  <span className="block text-xs text-[10px] lg:text-sm font-thin text-gray-400">{prize.ar}</span>
                </h3>

                <p style={{ backgroundImage: prize.iconBg }}
                  className="text-sm md:text-3xl lg:text-5xl font-bold bg-clip-text text-transparent">
                  {t(`${prize.key}Prize`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-2 md:gap-6 gap-2 mb-8 md:mb-16 lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto">
          {CONFIG.prizes.otherPrizes.map((prize: any) => (
            <motion.div key={prize.key} variants={fadeUpItem}
              className="flex items-center justify-around gap-2 md:gap-4 bg-linear-to-br from-white/17 to-neutral-400/17 
              border border-white rounded-lg p-2 md:p-6 backdrop-blur-sm">
              <h3 className="text-white flex flex-col items-center justify-center gap-1 md:gap-3">
                <span className="block font-bold tracking-wide text-sm lg:text-2xl">{prize.en}</span>
                <span className="block text-xs text-[10px] lg:text-sm font-thin text-gray-400">{prize.ar}</span>
              </h3>

              <p className="bg-clip-text text-transparent font-bold text-sm md:text-3xl lg:text-5xl bg-linear-to-br from-white/80 to-neutral-400/80">
                {t(`${prize.key}Prize`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUpItem} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto">
          <div className="bg-linear-to-br from-(--gameathon-gold)/10 to-(--gameathon-gold-light)/5 flex items-start xl:gap-8 md:gap-4 gap-2
            border border-(--gameathon-gold)/30 rounded-xl xl:px-16 sm:p-8 p-4 backdrop-blur-sm">
            <div className="bg-(--gameathon-gold) rounded-xl p-2 shrink-0">
              <Image src={CONFIG.prizes.beyondIcon} alt="Rocket" width={32} height={32} 
                className="size-6 sm:size-8 lg:size-10 object-contain" />
            </div>

            <div>
              <h3 className="text-white font-bold lg:text-3xl sm:text-2xl text-base mb-3">
                {t('beyondTitle')}
              </h3>

              <div className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-xl mt-1">
                {t.rich('beyondRich', {
                  p: (children) => <p className="mb-4">{children}</p>,
                  ul: (children) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                  li: (children) => <li className="mb-1">{children}</li>,
                  strong: (children) => <strong>{children}</strong>,
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </ div>
    </section>
  );
}
