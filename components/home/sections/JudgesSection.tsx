'use client';

import React from 'react';
import { motion, Transition } from 'framer-motion';
import { CONFIG } from '@/config/siteConfig';
import MemberCard, { BilingualDescription, BilingualTitle } from '../more/MemberCard';


export default function JudgesMentorsSection() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } as Transition
    }
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } as Transition }
  };

  return (
    <section id="judges" className="relative py-4 md:py-8">
      <div className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10">

        <motion.div variants={staggerContainer} 
          className='space-y-2 lg:space-y-4'
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}>

          <motion.div variants={fadeUpItem}>
            <BilingualTitle enText="Judges and Mentors" 
              arText="المحكمون والمرشدون" />
          </motion.div>

          <motion.div variants={fadeUpItem}>
            <BilingualDescription enText="Judges: Evaluate final games and provide fair, structured feedback."
              arText="لجنة التحكيم: يقيًمون الألعاب النهائية مع ملاحظات عادلة ومنهجية."/>
          </motion.div>

          {/* Judges Grid - Mobile (2 columns) */}
          {/* <div className="grid grid-cols-2 gap-4 md:hidden mb-12">
            {CONFIG.judges.judges.map((judge, index) => (
              <motion.div key={index} variants={fadeUpItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}>
                <MemberCard member={judge} />
              </motion.div>
            ))}
          </div> */}

          {/* Judges Grid - Desktop (up to 5 columns) */}
          <motion.div variants={staggerContainer}
            initial="hidden" 
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-wrap items-start justify-center gap-4 max-md:gap-y-2 lg:gap-6 lg:my-6 sm:my-4 my-2 xl:mx-8 md:mx-6">
            {CONFIG.judges.judges.map((judge, index) => (
              <MemberCard key={index} member={judge} className="lg:w-[calc(20%-1.5rem)]! w-[calc(33%-1rem)]!" />
            ))}
          </motion.div>

          {/* Mentors Description */}
          <motion.div variants={fadeUpItem} className='lg:mb-8 sm:mb-4 mb-2'>
            <BilingualDescription 
              enText="Mentors: Guide teams, offer expertise, and support development."
              arText="المرشدون: يوجًهون الفرق، ويقدًمون خبراتهم، ويدعمون عملية التطوير."
            />
          </motion.div>

          {/* Mentors Grid - Mobile (2 columns) */}
          {/* <div className="flex items-center justify-around flex-wrap gap-4 md:hidden">
            {CONFIG.judges.mentors.map((mentor, index) => (
              <motion.div key={index} variants={fadeUpItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}>
                <MemberCard member={mentor} isMentor={true} />
              </motion.div>
            ))}
          </div> */}

          {/* Mentors Grid - Desktop (up to 4 columns) */}
          <motion.div variants={staggerContainer}
            initial="hidden" 
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex gap-4 max-md:gap-y-2 items-center justify-center xl:mx-8 md:mx-6">
            {CONFIG.judges.mentors.map((mentor, index) => (
              <MemberCard key={index} member={mentor} isMentor={true} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}