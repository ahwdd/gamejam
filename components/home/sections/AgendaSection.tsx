'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

import agendaDataEn from '@/messages/agenda/en.json';
import agendaDataAr from '@/messages/agenda/ar.json';
import DayCard from '../more/DayCard';
import GameathonBadge from '@/components/ui/GameathonBadge';

export default function AgendaSection() {
  const t = useTranslations('agendaSection');
  const locale = useLocale();
  
  const agendaData = locale === 'ar' ? agendaDataAr : agendaDataEn;

  return (
    <section id="agenda" className="relative py-10 md:py-20">
      <div className=" lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10 space-y-2 md:space-y-4">
        <div className="flex justify-center">
          <GameathonBadge variant='secondary' className='text-sm md:text-lg xl:text-xl'>
            {t('badge')}
          </GameathonBadge>
        </div>

        <h2 className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center">
          {t('title')}
        </h2>

        <p className="text-gray-300 xl:text-2xl md:text-base text-sm leading-relaxed text-center">
          {t('subtitle')}
        </p>

        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Day 1 — left, top */}
          <div className="col-start-1 row-start-1 row-span-4">
            <DayCard day={agendaData.days[0]} dayIndex={0} />
          </div>

          {/* Day 2 — right, lower */}
          <div className="col-start-2 row-start-3 row-span-4">
            <DayCard day={agendaData.days[1]} dayIndex={1} />
          </div>

          {/* Day 3 — left, under Day 1, aligned with Day 2 middle */}
          <div className="col-start-1 row-start-6 row-span-4">
            <DayCard day={agendaData.days[2]} dayIndex={2} />
          </div>

        </div>


        {/* Mobile */}
        <div className="md:hidden space-y-6 max-w-2xl mx-auto">
          {agendaData.days.map((day, index) => (
            <DayCard 
              key={index}
              day={day}
              dayIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}