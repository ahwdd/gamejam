'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DecorativeFrames from './DecorativeFrame';
import { FiUsers } from 'react-icons/fi';
import Image from 'next/image';

const CONFIG = {
  judges: {
    team: [
      { key: 'member1', img: '/assets/team/Agatha.jpg' },
      { key: 'member2', img: '/assets/team/Ahmed.jpg' },
      { key: 'member3', img: '/assets/team/Corrie.jpg' },
      { key: 'member4', img: '/assets/team/Hamdan.jpg' },
      { key: 'member5', img: '/assets/team/Kalle.jpg' },
      { key: 'member6', img: '/assets/team/Zain.jpg' }
    ]
  }
};

export default function JudgesSection() {
  const t = useTranslations('judges');

  return (
    <section id="judges" className="relative py-20 bg-black">
      <DecorativeFrames />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-(--gameathon-gold)/20 border border-(--gameathon-gold) text-(--gameathon-gold) px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <FiUsers />
            {t('badge')}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>

        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {CONFIG.judges.team.map((member) => (
            <div
              key={member.key}
              className="group relative overflow-hidden rounded-xl bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-(--gameathon-gold) transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={member.img}
                  alt={t(`${member.key}Name`)}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-1">
                  {t(`${member.key}Name`)}
                </h3>
                <p className="text-(--gameathon-gold) text-sm">
                  {t(`${member.key}Role`)}
                </p>
              </div>

              <div className="lg:hidden p-4 bg-linear-to-t from-black to-transparent">
                <h3 className="text-white font-bold text-sm mb-1">
                  {t(`${member.key}Name`)}
                </h3>
                <p className="text-(--gameathon-gold) text-xs">
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