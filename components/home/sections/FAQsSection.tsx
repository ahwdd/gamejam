'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import GameathonBadge from '@/components/ui/GameathonBadge';

export default function FAQsSection() {
  const t = useTranslations('faqs');
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const newHeights: { [key: number]: number } = {};
    Object.keys(contentRefs.current).forEach((key) => {
      const index = parseInt(key);
      const element = contentRefs.current[index];
      if (element) {
        newHeights[index] = element.scrollHeight;
      }
    });
    setHeights(newHeights);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
    { q: t('q7'), a: t('a7') },
    { q: t('q8'), a: t('a8') },
    { q: t('q9'), a: t('a9') }
  ];

  return (
    <section id="faqs" className="relative py-4 md:py-8">
      <div className="lg:max-w-6xl sm:max-w-[calc(100%-7rem)] max-w-[calc(100%-.5rem)] mx-auto px-4 relative z-10">
        <GameathonBadge variant='secondary' className='text-sm md:text-lg xl:text-xl mx-auto'>
          {t('badge')}
        </GameathonBadge>

        <h2 className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center mb-2 md:mb-4">
          {t('title')}
        </h2>

        <p className="text-gray-300 xl:text-2xl md:text-base text-sm leading-relaxed text-center mb-8 md:mb-16">
          {t('subtitle')}
        </p>

        <ol className="space-y-4 w-full">
          {questions.map((faq, index) => (
            <li key={index}
              className="w-full bg-white/5 border-white/10 border rounded-3xl overflow-hidden backdrop-blur-sm">
              <button id={`faq-${index}-button`} onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index} aria-controls={`faq-${index}`}
                className="w-full flex items-center justify-between p-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-(--gameathon-gold) text-sm md:text-base font-bold">
                    {t('q')}
                    {index + 1}
                  </span>
                  <span className="text-white font-semibold text-base md:text-lg pr-4">
                    {faq.q}
                  </span>
                </div>
                <div className="shrink-0 text-(--gameathon-gold) text-xl md:text-2xl">
                  {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </button>

              <div id={`faq-${index}`} role="region" aria-labelledby={`faq-${index}-button`}
                style={{
                  height: openIndex === index ? `${heights[index]}px` : '0px',
                  transition: 'height 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="overflow-hidden">
                <div ref={(el) => { contentRefs.current[index] = el; }}
                  style={{
                    transform: openIndex === index ? 'translateY(0)' : 'translateY(-8px)',
                    opacity: openIndex === index ? 1 : 0,
                    transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="px-6 pb-6 pt-0 ltr:ml-8 rtl:mr-8">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}