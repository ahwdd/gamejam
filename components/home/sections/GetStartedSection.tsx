'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';
import { CONFIG } from '@/config/siteConfig';

export default function GetStartedSection() {
  const t = useTranslations('getStarted');
  const locale = useLocale();

  return (
    <section id="rules" className="relative py-10 md:py-20 px-4">
      <div className="container mx-auto relative z-10">

        <h2 className="text-2xl md:text-4xl xl:text-6xl font-bold text-white text-center">
          {t('badge')}
        </h2>

        <p className="text-sm md:text-xl xl:text-2xl text-gray-400 text-center lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto mb-6 md:mb-16">
          {t('title')}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto">
          {CONFIG.getStarted.items.map((item: any) => (
            <div key={item.key}
              className="bg-white/5 border border-white/10 rounded-3xl xl:p-10 p-6 backdrop-blur-sm space-y-1.5 md:space-y-2 xl:space-y-3
              max-md:flex max-md:flex-col max-md:items-center">
              <div className="bg-[#C8A47F] rounded-3xl p-4 xl:p-5 size-16 xl:size-22 flex items-center justify-center mb-6 md:mb-8 xl:mb-12">
                <Image src={item.icon} alt={t(`${item.key}Title`)} width={32} height={32} 
                  className="size-8 md:size-16 object-contain"/>
              </div>

              <h3 className="text-white font-bold xl:text-3xl md:text-xl text-lg">
                {t(`${item.key}Title`)}
              </h3>

              <p className="text-gray-300 xl:text-2xl md:text-base text-sm leading-relaxed">
                {t(`${item.key}Subtitle`)}
              </p>

              {item.href && (
                <a href={item.href} target={item.external? "_blank": "_self"} rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#C8A47F] xl:text-lg md:text-sm text-xs font-bold group mt-2 md:mt-2.5 xl:mt-4">
                  <span>{t('learnMore')}</span>
                  <FiExternalLink className={`group-hover:translate-x-1 transition-transform 
                    ${locale === 'ar' ? 'rotate-180' : ''}`}/>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}