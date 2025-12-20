'use client';

import React from 'react';
import Header from '@/components/home/layout/Header';
import Footer from '@/components/home/layout/Footer';
import HeroSection from '@/components/home/sections/HeroSection';
import PrizesSection from '@/components/home/sections/PrizesSection';
import GetStartedSection from '@/components/home/sections/GetStartedSection';
import JudgesSection from '@/components/home/sections/JudgesSection';
import AgendaSection from '@/components/home/sections/AgendaSection';
import FAQsSection from '@/components/home/sections/FAQsSection';

export default function LandingPage() {
  return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main>
          <HeroSection />
          <PrizesSection />
          <GetStartedSection />
          <JudgesSection />
          <AgendaSection />
          <FAQsSection />
        </main>
        <Footer />
      </div>
  );
}