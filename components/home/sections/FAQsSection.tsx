'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import DecorativeFrames from '../more/DecorativeFrame';
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FAQsSection() {
  const t = useTranslations('faqs');
  const contact = useTranslations('contact');
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Build FAQs array from flat translation keys
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
    <section id="faqs" className="relative py-20 bg-black">
      <DecorativeFrames />

      <div className="container mx-auto px-4 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-(--gameathon-gold)/20 border border-(--gameathon-gold) text-(--gameathon-gold) px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <FiHelpCircle />
            {t('badge')}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
          {t('subtitle')}
        </p>

        {/* FAQs List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {questions.map((faq, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors duration-200"
              >
                <span className="text-white font-semibold text-lg pr-4">
                  {faq.q}
                </span>
                <div className="shrink-0 text-(--gameathon-gold) text-2xl">
                  {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-linear-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl p-8 text-center backdrop-blur-sm">
            <p className="text-gray-200 text-lg mb-3">
              {contact('text')}
            </p>
            <a 
              href={`mailto:${contact('email')}`}
              className="text-(--gameathon-gold) hover:text-(--gameathon-gold-light) font-bold text-xl transition-colors duration-200"
            >
              {contact('email')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}