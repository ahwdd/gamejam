'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import GameathonButton from '../../ui/GameathonButton';
import { FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('partners'), href: '#partners' },
    { label: t('prizes'), href: '#prizes' },
    { label: t('judges'), href: '#judges' },
    { label: t('agenda'), href: '#agenda' },
    { label: t('rules'), href: '#rules' },
    { label: t('faqs'), href: '#faqs' },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.push(`/${newLocale}`);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-center ${
        isScrolled ? 'backdrop-blur-md shadow-lg ' : 'bg-transparent h-20'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <span />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse md:ltr:ml-20 md:rtl:mr-20">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="text-white hover:text-(--gameathon-gold) transition-colors duration-200 font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white hover:text-(--gameathon-gold) transition-colors duration-200"
              aria-label="Toggle Language"
            >
              <FiGlobe className="text-xl" />
              <span className="hidden sm:inline font-medium">
                {locale === 'en' ? 'عربي' : 'English'}
              </span>
            </button>

            <div className="hidden lg:block">
              <GameathonButton href="https://example.com/register" size="medium" external>
                {t('register')}
              </GameathonButton>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white text-2xl"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <nav className="flex flex-col space-y-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-(--gameathon-gold) transition-colors duration-200 font-medium px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-2">
                <GameathonButton size="medium" external
                href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAaGjiwdUM0QwVzE1RUU5UVZKOTdCVUNLN1NEUVFIUC4u">
                  {t('register')}
                </GameathonButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}