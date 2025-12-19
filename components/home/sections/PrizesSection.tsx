'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DecorativeFrames from './DecorativeFrame';
import { FiAward } from 'react-icons/fi';
import Image from 'next/image';

// Import configuration
const CONFIG = {
  prizes: {
    topPrizes: [
      {
        place: 1,
        icon: '/icons/medal1.png',
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500'
      },
      {
        place: 2,
        icon: '/icons/medal2.png',
        color: 'from-gray-300 to-gray-500',
        bgColor: 'bg-gray-400/20',
        borderColor: 'border-gray-400'
      },
      {
        place: 3,
        icon: '/icons/medal3.png',
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500'
      }
    ],
    beyondIcon: '/icons/rocket.png'
  }
};

export default function PrizesSection() {
  const t = useTranslations('prizes');

  return (
    <section id="prizes" className="relative py-20 bg-black">
      <DecorativeFrames />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-(--gameathon-gold)/20 border border-(--gameathon-gold) text-(--gameathon-gold) px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <FiAward />
            {t('badge')}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>

        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
          {t('subtitle')}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {CONFIG.prizes.topPrizes.map((prize, index) => {
            const placeKey = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
            
            return (
              <div
                key={prize.place}
                className={`relative rounded-xl overflow-hidden ${prize.bgColor} border-2 ${prize.borderColor} backdrop-blur-sm`}
              >
                <div className={`relative h-0.5 bg-linear-to-r ${prize.color}`}>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-linear-to-r ${prize.color} rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
                    <span className="text-black font-bold text-lg">{prize.place}</span>
                  </div>
                </div>

                <div className="p-8 pt-12 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${prize.bgColor} rounded-full mb-4`}>
                    <Image 
                      src={prize.icon} 
                      alt={t(placeKey)} 
                      width={48} 
                      height={48} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  <h3 className="text-white font-bold text-xl mb-3">
                    {t(placeKey)}
                  </h3>

                  <p className="text-3xl font-bold text-(--gameathon-gold)">
                    {t(`${placeKey}Prize`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 bg-linear-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <div className="bg-(--gameathon-gold)/20 rounded-full p-4 shrink-0">
              <FiAward className="text-(--gameathon-gold) text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">{t('fourth')}</h4>
              <p className="text-(--gameathon-gold) font-bold text-xl">{t('fourthPrize')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-linear-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <div className="bg-(--gameathon-gold)/20 rounded-full p-4 shrink-0">
              <FiAward className="text-(--gameathon-gold) text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">{t('fifth')}</h4>
              <p className="text-(--gameathon-gold) font-bold text-xl">{t('fifthPrize')}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-(--gameathon-gold)/10 to-(--gameathon-gold-light)/5 border border-(--gameathon-gold)/30 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-(--gameathon-gold) rounded-full p-4 shrink-0">
                <Image src={CONFIG.prizes.beyondIcon} alt="Rocket" width={32} height={32} className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="text-white font-bold text-2xl mb-3">
                  {t('beyondTitle')}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {t('beyondDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}