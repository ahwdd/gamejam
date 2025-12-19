'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import DecorativeFrames from './DecorativeFrame';
import { FiArrowRight } from 'react-icons/fi';
import { BsRocket } from 'react-icons/bs';
import Image from 'next/image';

const CONFIG = {
  getStarted: {
    items: [
      {
        key: 'submit',
        icon: '/icons/game-store.png',
        href: 'https://example.com/itch'
      },
      {
        key: 'rules',
        icon: '/icons/ruler.png',
        href: 'https://example.com/rules'
      },
      {
        key: 'join',
        icon: '/icons/user-check.png',
        href: null  // No link for this item
      },
      {
        key: 'tools',
        icon: '/icons/cpu.png',
        href: 'https://example.com/tools'
      }
    ]
  }
};

export default function GetStartedSection() {
  const t = useTranslations('getStarted');
  const locale = useLocale();

  return (
    <section id="rules" className="relative py-20 bg-linear-to-b from-black to-gray-900">
      <DecorativeFrames />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-(--gameathon-gold)/20 border border-(--gameathon-gold) text-(--gameathon-gold) px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <BsRocket />
            {t('badge')}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {CONFIG.getStarted.items.map((item) => (
            <div key={item.key}
              className="bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:border-(--gameathon-gold) transition-all duration-300 group"
            >
              <div className="bg-(--gameathon-gold)/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-(--gameathon-gold)/30 transition-colors duration-300">
                <Image 
                  src={item.icon} 
                  alt={t(`${item.key}Title`)} 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 object-contain"
                />
              </div>

              <h3 className="text-white font-bold text-xl mb-3">
                {t(`${item.key}Title`)}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {t(`${item.key}Subtitle`)}
              </p>

              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-(--gameathon-gold) hover:text-(--gameathon-gold-light) transition-colors duration-200 text-sm font-medium group"
                >
                  <span>{t('learnMore')}</span>
                  <FiArrowRight 
                    className={`group-hover:translate-x-1 transition-transform ${
                      locale === 'ar' ? 'rotate-180' : ''
                    }`} 
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}