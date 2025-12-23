'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DecorativeFrames from '../more/DecorativeFrame';
import { FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import { CONFIG } from '@/config/siteConfig';
import GameathonBadge from '@/components/ui/GameathonBadge';

export default function JudgesSection() {
  const t = useTranslations('judges');

  return (
    <section id="judges" className="relative py-4 md:py-8">
      <div className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10">
        
        <div className="flex justify-center">
          <GameathonBadge className='text-sm md:text-lg xl:text-xl'>
            {t('badge')}
          </GameathonBadge>
        </div>

        <h2 className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center mb-2 md:mb-4">
          {t('title')}
        </h2>

        <p className="text-sm md:text-xl xl:text-2xl text-gray-400 text-center mb-12 md:mb-16">
          {t('subtitle')}
        </p>

        {/* Mobile: 2 columns grid */}
        <div className="grid grid-cols-2 gap-6 gap-y-2 md:hidden">
          {CONFIG.judges.team.map((member: any) => (
            <div key={member.key} className="relative rounded-2xl">
              <div className="aspect-square">
                <Image src={member.img} alt={t(`${member.key}Name`)} width={400} height={400} 
                className="w-full h-full object-cover rounded-4xl max-w-66 max-h-66"/>
              </div>
              <div className="flex flex-col justify-center items-center gap-1 p-4">
                <h3 className="text-white font-bold text-lg text-center">
                  {t(`${member.key}Name`)}
                </h3>
                <p className="text-gray-300 text-sm w-[120%] text-center">
                  {t(`${member.key}Role`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Pyramid layout (3 top, 4 bottom) */}
        <div className="hidden md:block">
          {/* Top row: 3 judges centered */}
          <div className="grid grid-cols-3 gap-6 mb-6 max-w-4xl mx-auto">
            {CONFIG.judges.team.slice(0, 3).map((member: any) => (
              <div key={member.key} className="relative rounded-2xl">
                <div className="aspect-square">
                  <Image src={member.img} alt={t(`${member.key}Name`)} width={400} height={400} 
                  className="w-full h-full object-cover rounded-4xl max-w-66 max-h-66"/>
                </div>
                <div className="flex flex-col justify-center items-center gap-1 p-4">
                  <h3 className="text-white font-bold text-xl text-center">
                    {t(`${member.key}Name`)}
                  </h3>
                  <p className="text-gray-300 text-base w-[120%] text-center">
                    {t(`${member.key}Role`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row: 4 judges */}
          <div className="grid grid-cols-4 gap-6">
            {CONFIG.judges.team.slice(3, 7).map((member: any) => (
              <div key={member.key} className="relative rounded-2xl">
                <div className="aspect-square">
                  <Image src={member.img} alt={t(`${member.key}Name`)} width={400} height={400} className="w-full h-full object-cover rounded-4xl"/>
                </div>
                <div className="flex flex-col justify-center items-center gap-1 p-4">
                  <h3 className="text-white font-bold text-xl text-center">
                    {t(`${member.key}Name`)}
                  </h3>
                  <p className="text-gray-300 text-base w-[120%] text-center">
                    {t(`${member.key}Role`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}