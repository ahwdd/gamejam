'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GameathonButton from '../../ui/GameathonButton';
import Image from 'next/image';
import { CONFIG } from '@/config/siteConfig';
import DecorativeFrames from '../more/DecorativeFrame';

export default function Footer() {
  const t = useTranslations('footer');
  const contact = useTranslations('contact');

  return (
    <footer className="relative overflow-hidden bg-[#232A2A] bg-no-repeat bg-top bg-cover md:h-150 flex flex-col items-center justify-between gap-6"
    style={{backgroundImage: 'url(/assets/gameathon-bg.png)'}}>
      <DecorativeFrames />

      <div className="w-fit mx-auto bg-[#BC3E2B]/30 border border-[#BC3E2B]/80 rounded-2xl px-4 md:px-6 py-3 md:py-4 
        flex items-center justify-center md:gap-3 gap-2 backdrop-blur-sm text-lg md:text-xl">
        <p className="text-(--gameathon-gold)">
          {contact('text')}
        </p>
        <a href={`mailto:${contact('email')}`} className="text-gray-300 underline">
          {contact('email')}
        </a>
      </div>

      <div className="relative z-10 lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 w-full">

        <div className="grid md:grid-cols-3 gap-8 items-center mb-4 text-white">
          <div>
            <p className="font-semibold text-lg md:text-2xl mb-2 backdrop-blur-xs rounded-xl w-fit">
              {t('title')}
            </p>
            <p className="text-gray-300 text-xl backdrop-blur-xs rounded-xl w-fit">
              {t('subtitle')}
            </p>
          </div>

          <div>
            <p className="font-semibold text-base md:text-xl mb-2">
              {t('contactTitle')}
            </p>
            <a href={`mailto:${t('email')}`}
              className="text-(--gameathon-gold) backdrop-blur-xs rounded-xl w-fit text-sm md:text-base">
              {t('email')}
            </a>
          </div>

          <div className="flex justify-end">
            <GameathonButton href={CONFIG.registerationLink} size="small" external>
              {t('register')}
            </GameathonButton>
          </div>
        </div>
      {/* 
        <div className="border-t border-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            {t('copyright')}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{t('poweredBy')}</span>
            <Image src="/assets/logos/ahw-logo.png" alt="Arab Hardware" width={120} height={40}className="h-8 w-auto"/>
          </div>
        </div> */}
      </div>
    </footer>
  );
}