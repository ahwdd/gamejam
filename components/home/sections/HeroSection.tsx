'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GameathonButton from '../../ui/GameathonButton';
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';
import clsx from 'clsx';
import { CONFIG } from '@/config/siteConfig';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLocationHover, setShowLocationHover] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const textWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLargeScreen(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (isExpanded && isLargeScreen) {
      const el = textWrapperRef.current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isExpanded, isLargeScreen]);

  const handleRegisterClick = () => {
    window.open(CONFIG.registerationLink, '_blank');
  };

  const aboutNodes = t.rich(
    'aboutText',
    {
      strong: (chunks: React.ReactNode) => <strong className="font-bold">{chunks}</strong>,
      b: (chunks: React.ReactNode) => <strong className="font-bold">{chunks}</strong>,
    }
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 brightness-200 rtl:-scale-x-100"
        style={{backgroundImage: 'url(/assets/gameathon-bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',}}>
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/50" />
      </div>

      <div className="container mx-auto px-4 z-10 py-12 relative">
        <div className="max-w-180 mx-auto text-center relative z-20">

          <div className="flex flex-col items-center gap-6 mb-8">
            <Image src="/assets/logos/gameathon-ar.png" alt="Heritage Gameathon AR" width={500} height={100}
                   className="h-15 md:h-30 w-auto" priority />
            <Image src="/assets/logos/gameathon-en.png" alt="Heritage Gameathon EN" width={500} height={200}
                   className="h-27 md:h-54 w-auto" priority />
          </div>

          <div ref={textWrapperRef}
            className={clsx('relative bg-black/25 backdrop-blur-sm border rounded-lg px-4 py-2 mb-3 transition-all',
              'border-[rgba(201,160,92,0.12)] duration-1000 ease-in-out')}
            style={{ zIndex: isExpanded && isLargeScreen ? 60 : undefined }}>
            <div className="flex items-start gap-3">
              <div className={clsx('w-full transition-all duration-1000 ease-in-out overflow-hidden max-md:pb-5')}
                aria-expanded={isExpanded}>
                <p className={clsx("text-gray-300 leading-relaxed text-base md:text-xl whitespace-pre-line",
                  !isExpanded ? 'line-clamp-3!' : 'relative')}
                  style={{
                    maxHeight: isExpanded && !isLargeScreen ? '36vh' : undefined,
                    overflowY: isExpanded && !isLargeScreen ? 'auto' : undefined,
                    WebkitOverflowScrolling: 'touch',
                  }}>
                  {aboutNodes}
                </p>

                <button onClick={() => setIsExpanded((s) => !s)} aria-expanded={isExpanded}
                  className={clsx('absolute md:rtl:left-3 md:ltr:right-3 md:bottom-2.5 bottom-1 text-white font-bold cursor-pointer',
                    'hover:underline focus:outline-none bg-[#494239] md:bg-[#463f36]/65 rounded-full backdrop-blur-2xl',
                    'z-30 border-0 p-0 m-0 max-md:left-1/2 max-md:-translate-x-1/2')}>
                  {!isExpanded ? (
                    <span className="inline-flex items-center">
                      <span className="opacity-90 max-md:hidden">...</span>
                      <span className="ml-1">{t('readMore')}</span>
                    </span>
                  ) : (
                    <span>{t('readLess')}</span>
                  )}
                </button>

              </div>
            </div>
          </div>

          <div aria-hidden={false} 
            className={clsx('mx-auto transition-all duration-1000 ease-in-out', showLocationHover? 'max-w-210': 'max-w-170',
              isExpanded && isLargeScreen? 'opacity-0 translate-y-12 absolute left-0 right-0 bottom-40 z-10 pointer-events-none'
                : 'opacity-100 translate-y-0 relative')}>
            <div className={clsx("grid gap-4 md:grid-cols-12")}>
              <div className={clsx('bg-black/25 backdrop-blur-sm border rounded-lg py-2',
                  'border-[rgba(201,160,92,0.06)] flex items-center transition-all duration-1000 ease-in-out',
                  showLocationHover? 'md:col-span-5 px-2': 'md:col-span-6 gap-3 px-1 md:px-4'
                )}>
                  <FiCalendar className="text-[rgb(201,160,92)]/95 size-12 p-2" />
                <div className="ltr:text-left rtl:text-right min-w-0">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">{t('dateLabel')}</p>
                  <p className="text-white text-sm md:text-lg">{t('date')}</p>
                </div>
              </div>

              <div onMouseEnter={() => setShowLocationHover(true)} onMouseLeave={() => setShowLocationHover(false)}
                className={clsx('bg-black/25 backdrop-blur-sm border rounded-lg py-2 duration-1000 ease-in-out',
                  'border-[rgba(201,160,92,0.06)] cursor-pointer overflow-hidden transition-all',
                  showLocationHover? 'md:col-span-7 px-2': 'md:col-span-6 px-1 md:px-4')}>
                <div className={clsx("flex items-center", showLocationHover? '': 'gap-3')}>
                  <FiMapPin className="text-[rgb(201,160,92)]/95 size-12 p-2" />

                  <div className="flex md:items-center max-md:justify-center gap-2 w-full max-md:flex-col">
                    <div className="ltr:text-left rtl:text-right min-w-0">
                      <p className="text-gray-400 text-xs uppercase tracking-wide">{t('locationLabel')}</p>
                      <p className="text-white text-sm md:text-lg truncate">{t('location')}</p>
                    </div>

                    <div className={clsx('transition-all duration-1000 ease-in-out flex items-center gap-1 opacity-100 max-w-xs translate-x-0',
                        showLocationHover ? '' : 'md:opacity-0 md:max-w-0 md:rtl:-translate-x-4 md:ltr:translate-x-4')}>
                      <a href="https://maps.app.goo.gl/CfnJgL362c6RLac77" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-white
                        transition-colors whitespace-nowrap text-sm md:mt-4 md:rtl:border-r md:ltr:border-l md:border-white md:rtl:pr-2 md:ltr:pl-2">
                        <span className="underline">{t('openMaps')}</span>
                        <FiExternalLink className="md:text-lg text-sm" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={clsx('mt-4 transition-all duration-1000 ease-in-out flex justify-center',
              isExpanded && isLargeScreen ? 'opacity-0 translate-y-6 pointer-events-none mb-6' : 'opacity-100 translate-y-0 mb-12')}>
            <div onClick={handleRegisterClick}>
              <GameathonButton size="large">
                {t('register') || 'Register'}
              </GameathonButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}