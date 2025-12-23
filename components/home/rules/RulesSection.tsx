'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GameathonBadge from '@/components/ui/GameathonBadge';
import { BsClock, BsFileText, BsTrophy, BsWrench } from 'react-icons/bs';
import { LuGavel, LuUserSearch } from 'react-icons/lu';
import { BiCheck, BiShield } from 'react-icons/bi';
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface RuleCardProps {
  icon: IconType;
  titleEn: string;
  contentEn: string;
  type?: 'default' | 'warning' | 'success' | 'info';
}

const RuleCard = ({ icon: Icon, titleEn, contentEn, type = 'default' }: RuleCardProps) => {

  const getIconBg = () => {
    switch(type) {
      case 'warning': return 'bg-[#BC3E2B]';
      case 'success': return 'bg-[#364746]';
      case 'info': return 'bg-[#C8A47F]';
      default: return 'bg-amber-400';
    }
  };

  return (
    <div className={` rounded-xl p-4 md:p-6 backdrop-blur-sm hover:from-white/15 hover:to-neutral-400/15 transition-all duration-300`}>
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`${getIconBg()} rounded-xl p-2 md:p-3 shrink-0 border border-white/20`}>
          <Icon className={`size-5 md:size-6 text-white`} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg md:text-xl mb-2">{titleEn}</h3>
          <div className="text-gray-300 leading-relaxed space-y-2 text-sm md:text-base">
            <p>{contentEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RulesSection() {
  const t = useTranslations('rules');

  const rules: RuleCardProps[] = [
    {
      icon: BsFileText,
      titleEn: t('originalWork.title'),
      contentEn: t('originalWork.content'),
      type: 'info'
    },
    {
      icon: BsTrophy,
      titleEn: t('theme.title'),
      contentEn: t('theme.content'),
      type: 'success'
    },
    {
      icon: LuUserSearch,
      titleEn: t('teamSize.title'),
      contentEn: t('teamSize.content'),
      type: 'default'
    },
    {
      icon: BiShield,
      titleEn: t('ownership.title'),
      contentEn: t('ownership.content'),
      type: 'info'
    },
    {
      icon: BiCheck,
      titleEn: t('conduct.title'),
      contentEn: t('conduct.content'),
      type: 'success'
    },
    {
      icon: BsClock,
      titleEn: t('deadline.title'),
      contentEn: t('deadline.content'),
      type: 'warning'
    },
    {
      icon: FiX,
      titleEn: t('restrictions.title'),
      contentEn: t('restrictions.content'),
      type: 'warning'
    },
    {
      icon: LuGavel,
      titleEn: t('judging.title'),
      contentEn: t('judging.content'),
      type: 'info'
    },
    {
      icon: BsWrench,
      titleEn: t('equipment.title'),
      contentEn: t('equipment.content'),
      type: 'default'
    }
  ];

  return (
    <>
      <div className="h-20" />
      
      <section className="relative py-8 md:py-16">
        <div className="container mx-auto px-4 relative z-10">
          
          <h1 className="text-3xl md:text-5xl xl:text-7xl font-bold text-white text-center mb-4 md:mb-8">
            {t('title')}
          </h1>

          <p className="text-sm md:text-xl text-gray-400 text-center max-w-4xl mx-auto mb-8 md:mb-12 px-4">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="relative py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid gap-4 md:gap-6">
            {rules.map((rule, index) => (
              <RuleCard key={index} {...rule} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className=" rounded-xl p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-start gap-3 md:gap-4">
                
                <div>
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-3 md:mb-4">
                    {t('notice.title')}
                  </h3>
                  <div className="text-gray-300 leading-relaxed space-y-3 text-sm md:text-base">
                    <p>{t('notice.content')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}