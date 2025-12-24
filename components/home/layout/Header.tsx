'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import GameathonButton from '../../ui/GameathonButton';
import { FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { CONFIG } from '@/config/siteConfig';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    window.open(CONFIG.registerationLink, '_blank');
  };

  const navLinks = [
    { label: t('partners'), href: '/#partners' },
    { label: t('prizes'), href: '/#prizes' },
    { label: t('judges'), href: '/#judges' },
    { label: t('agenda'), href: '/#agenda' },
    { label: t('rules'), href: '/rules' },
    { label: t('faqs'), href: '/#faqs' },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const pathWithoutLocale = (pathname ?? '/').replace(/^\/(en|ar)/, '') || '/';
    const search = searchParams ? searchParams.toString() : '';
    const searchSuffix = search ? `?${search}` : '';
    router.push(`/${newLocale}${pathWithoutLocale}${searchSuffix}`);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-center ${
          isScrolled ? 'backdrop-blur-md shadow-lg ' : 'bg-transparent h-20'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <span />

            <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse md:ltr:ml-20 md:rtl:mr-20">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}
                  className="text-white hover:text-(--gameathon-gold) transition-colors duration-200 font-medium">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button onClick={toggleLanguage}
                className="flex items-center gap-2 text-white hover:text-(--gameathon-gold) transition-colors duration-200"
                aria-label="Toggle Language">
                <FiGlobe className="text-xl" />
                <span className="hidden sm:inline font-medium">
                  {locale === 'en' ? 'عربي' : 'English'}
                </span>
              </button>

              <div className="hidden lg:block" onClick={handleRegisterClick}>
                <GameathonButton size="medium">
                  {t('register')}
                </GameathonButton>
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white text-2xl"
                aria-label="Toggle Menu">
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"/>

              <div className={`fixed z-50 top-20 ${locale === 'ar' ? 'left-4' : 'right-4'}
                  w-[86%] max-w-sm rounded-2xl overflow-hidden border border-gray-800
                  bg-black/70 backdrop-blur-md transform transition-transform duration-400 ease-out`}>
                <nav className="flex flex-col space-y-4 py-6 px-4">
                  {navLinks.map((link) => (
                    <a key={link.href} href={link.href}
                      className="text-white hover:text-(--gameathon-gold) transition-colors duration-200 font-medium px-2"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {link.label}
                    </a>
                  ))}

                  <div className="pt-2" onClick={handleRegisterClick}>
                    <GameathonButton size={isScrolled ? "small" : "medium"}>
                      {t('register')}
                    </GameathonButton>
                  </div>
                </nav>
              </div>
            </div>
          )}

        </div>
      </header>
    </>
  );
}