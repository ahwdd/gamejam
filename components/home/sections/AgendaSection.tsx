'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import DecorativeFrames from './DecorativeFrame';
import { FiCalendar, FiClock, FiClipboard, FiStar, FiZap, FiUsers, 
  FiCode, FiCoffee, FiUpload, FiAward, FiFlag } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { HiOutlineLightBulb, HiOutlineSpeakerphone } from 'react-icons/hi';
import { BiFoodMenu } from 'react-icons/bi';
import { CONFIG, getActivityIcon } from '@/config/siteConfig';

import agendaDataEn from '@/messages/agenda/en.json';
import agendaDataAr from '@/messages/agenda/ar.json';

const iconMap: { [key: string]: React.ReactNode } = {
  'clipboard': <FiClipboard />,
  'star': <FiStar />,
  'lightbulb': <HiOutlineLightBulb />,
  'users': <FiUsers />,
  'gamepad': <IoGameControllerOutline />,
  'utensils': <BiFoodMenu />,
  'clock': <FiClock />,
  'coffee': <FiCoffee />,
  'code': <FiCode />,
  'laptop': <FiCode />,
  'bullhorn': <HiOutlineSpeakerphone />,
  'magic': <FiZap />,
  'upload': <FiUpload />,
  'gavel': <FiAward />,
  'trophy': <FiAward />,
  'flag-checkered': <FiFlag />
};

export default function AgendaSection() {
  const t = useTranslations('agendaSection');
  const locale = useLocale();
  
  const agendaData = locale === 'ar' ? agendaDataAr : agendaDataEn;

  return (
    <section id="agenda" className="relative py-20 bg-linear-to-b from-gray-900 to-black">
      <DecorativeFrames />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-(--gameathon-gold)/20 border border-(--gameathon-gold) text-(--gameathon-gold) px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <FiCalendar />
            {t('badge')}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>

        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
          {t('subtitle')}
        </p>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="lg:row-span-2">
            <DayCard 
              day={agendaData.days[0]} 
              dayIndex={0}
            />
          </div>

          <div className="lg:row-span-2 lg:row-start-2">
            <DayCard 
              day={agendaData.days[1]} 
              dayIndex={1}
            />
          </div>

          <div className="lg:row-span-2 lg:row-start-3">
            <DayCard 
              day={agendaData.days[2]} 
              dayIndex={2}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden space-y-6 max-w-2xl mx-auto">
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

interface DayCardProps {
  day: {
    day: string;
    date: string;
    events: Array<{
      time: string;
      activity: string;
      location: string;
      speaker?: string;
      note?: string;
    }>;
  };
  dayIndex: number;
}

function DayCard({ day, dayIndex }: DayCardProps) {
  const dayColor = CONFIG.agenda.dayColors[dayIndex];

  return (
    <div className="bg-linear-to-br from-gray-900/90 to-gray-800/90 border-2 border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col">
      <div 
        className="p-6 border-b-2"
        style={{ 
          backgroundColor: `${dayColor}20`,
          borderColor: dayColor 
        }}
      >
        <h3 className="text-white font-bold text-2xl mb-2">{day.day}</h3>
        <p className="text-gray-300 text-sm">{day.date}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[600px]">
        <div className="space-y-3">
          {day.events.map((event, index) => {
            const iconName = getActivityIcon(event.activity);
            
            return (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="shrink-0 rounded-full p-2 text-xl"
                    style={{ backgroundColor: `${dayColor}30`, color: dayColor }}
                  >
                    {iconMap[iconName] || <FiClock />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-gray-400 text-xs font-mono whitespace-nowrap">
                        {event.time}
                      </span>
                    </div>

                    <h4 className="text-white font-semibold text-sm mb-1 leading-tight">
                      {event.activity}
                    </h4>

                    <p className="text-gray-400 text-xs mb-1">
                      {event.location}
                    </p>

                    {event.speaker && (
                      <p className="text-gray-500 text-xs italic">
                        {event.speaker}
                      </p>
                    )}

                    {event.note && (
                      <p className="text-gray-500 text-xs mt-2 italic">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}