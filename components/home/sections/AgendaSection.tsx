'use client';

import React, { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

import agendaDataEn from '@/messages/agenda/en.json';
import agendaDataAr from '@/messages/agenda/ar.json';
import DayCard from '../more/DayCard';
import GameathonBadge from '@/components/ui/GameathonBadge';
import { staggerContainer, fadeUpItem } from '@/motion/motion';
import FloatingBallsDOM from '../more/FloatingBallsDOM';

export default function AgendaSection() {
  const t = useTranslations('agendaSection');
  const locale = useLocale();
  const timelineRef = useRef<HTMLDivElement>(null);

  const agendaData = locale === 'ar' ? agendaDataAr : agendaDataEn;

  const { scrollYProgress } = useScroll({
    target: timelineRef, offset: ['start 80%', 'end 20%']
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90, damping: 40, mass: 0.6
  });
  const ballY = useTransform(smoothProgress,
    [0, 1], ['0%', '100%']);

  const lineFillHeight = useTransform(smoothProgress,// Line fill height
    [0, 1], ['0%', '100%']);

  return (
    <section id="agenda" className="relative py-4 md:py-8">
      <div className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10 space-y-2 md:space-y-4">

        <motion.div variants={staggerContainer}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUpItem} className="flex justify-center">
            <GameathonBadge variant="secondary" className="text-sm md:text-lg xl:text-xl">
              {t('badge')}
            </GameathonBadge>
          </motion.div>

          <motion.h2 variants={fadeUpItem}
            className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center">
            {t('title')}
          </motion.h2>

          <motion.p variants={fadeUpItem}
            className="text-gray-300 xl:text-2xl md:text-base text-sm leading-relaxed text-center">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Desktop */}
        <div ref={timelineRef} className="hidden md:grid md:grid-cols-2 gap-6 max-w-7xl mx-auto relative">

          <motion.div variants={fadeUpItem}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="col-start-1 row-start-1 row-span-4">
            <DayCard day={agendaData.days[0]} dayIndex={0} />
          </motion.div>

          <motion.div variants={fadeUpItem}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="col-start-2 row-start-3 row-span-4">
            <DayCard day={agendaData.days[1]} dayIndex={1} />
          </motion.div>

          <motion.div variants={fadeUpItem}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="col-start-1 row-start-6 row-span-4">
            <DayCard day={agendaData.days[2]} dayIndex={2} />
          </motion.div>


          <div className="absolute top-0 bottom-0 left-[calc(50%+4px)] -translate-x-1/2 flex justify-center -z-10">{/* Timeline */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-(--gameathon-gold-dark) shadow-lg" />

            <motion.div style={{ height: lineFillHeight }}
              className="absolute top-0 w-0.5 bg-(--gameathon-gold-light)"/>

            <motion.div style={{ top: ballY }}
              className=" absolute -translate-y-1/2 size-4 rounded-full bg-(--gameathon-gold-light) border-2 
              border-[#896b37] shadow-md origin-center"/>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-6 max-w-2xl mx-auto">
          {agendaData.days.map((day, index) => (
            <motion.div key={index} variants={fadeUpItem}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}>
              <DayCard day={day} dayIndex={index} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
