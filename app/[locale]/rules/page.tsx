import React, { Suspense } from 'react';
import Header from '@/components/home/layout/Header';
import Footer from '@/components/home/layout/Footer';
import RulesSection from '@/components/home/rules/RulesSection';
import DecorativeFrames from '@/components/home/more/DecorativeFrame';

function HeaderFallback() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      <div className="container mx-auto px-4"></div>
    </header>
  );
}

export default function RulesPage() {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>

      <main className="bg-linear-to-b from-[#202020] to-[#232A2A] relative pb-10">
                <DecorativeFrames />

        <RulesSection />
      </main>

      <Footer />
    </>
  );
}