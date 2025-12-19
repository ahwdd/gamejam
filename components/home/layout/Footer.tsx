'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GameathonButton from '../../ui/GameathonButton';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/gameathon-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 backdrop-blur-md bg-black/40">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            {/* Column 1: Title and Subtitle */}
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">
                {t('title')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t('subtitle')}
              </p>
            </div>

            {/* Column 2: Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-2">
                {t('contactTitle')}
              </h4>
              <a 
                href={`mailto:${t('email')}`}
                className="text-(--gameathon-gold) hover:text-(--gameathon-gold-light) transition-colors duration-200"
              >
                {t('email')}
              </a>
            </div>

            {/* Column 3: Register Button */}
            <div className="flex justify-end">
              <GameathonButton href="https://example.com/register" size="small" external>
                {t('register')}
              </GameathonButton>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-700 mb-8" />

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t('copyright')}
            </p>

            {/* Powered By Logo */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">{t('poweredBy')}</span>
              <Image 
                src="/assets/logos/ahw-logo.png" 
                alt="Arab Hardware" 
                width={120} 
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}