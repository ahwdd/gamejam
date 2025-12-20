'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DecorativeFrames from './DecorativeFrame';
import { FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import { CONFIG } from '@/config/siteConfig';
import GameathonBadge from '@/components/ui/GameathonBadge';

export default function JudgesSection() {
  const t = useTranslations('judges');

  return (
    <section id="judges" className="relative py-10 md:py-20">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-md:gap-y-2">
          {CONFIG.judges.team.map((member: any) => (
            <div key={member.key}
              className="relative rounded-2xl">
              <div className="aspect-square">
                <Image src={member.img} alt={t(`${member.key}Name`)} width={400} height={400} className="w-full h-full object-cover rounded-4xl"/>
              </div>

              <div className="flex flex-col justify-center items-center gap-1 p-4">
                <h3 className="text-white font-bold text-lg md:text-xl text-center">
                  {t(`${member.key}Name`)}
                </h3>
                <p className="text-gray-300 text-sm md:text-base w-[120%] text-center">
                  {t(`${member.key}Role`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}