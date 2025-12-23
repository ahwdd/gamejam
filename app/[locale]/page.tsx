// app/[locale]/page.tsx
import React, { Suspense } from 'react';
import Header from '@/components/home/layout/Header';
import Footer from '@/components/home/layout/Footer';
import HeroSection from '@/components/home/sections/HeroSection';
import PrizesSection from '@/components/home/sections/PrizesSection';
import GetStartedSection from '@/components/home/sections/GetStartedSection';
import JudgesSection from '@/components/home/sections/JudgesSection';
import AgendaSection from '@/components/home/sections/AgendaSection';
import FAQsSection from '@/components/home/sections/FAQsSection';
import DecorativeFrames from '@/components/home/more/DecorativeFrame';
import PartnersSection from '@/components/home/sections/PartnersSection';

function HeaderFallback() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      <div className="container mx-auto px-4">
      </div>
    </header>
  );
}

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>

      <HeroSection />
      <main className='bg-linear-to-b from-[#202020] to-[#232A2A] relative'>
        <DecorativeFrames />
        <PartnersSection />
        <PrizesSection />
        <GetStartedSection />
        <JudgesSection />
        <AgendaSection />
        <FAQsSection />
      </main>

      <Footer />
    </>
  );
}
