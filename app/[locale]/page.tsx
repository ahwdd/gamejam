// app/[locale]/page.tsx
import Header from '@/components/home/layout/Header';
import Footer from '@/components/home/layout/Footer';
import HeroSection from '@/components/home/sections/HeroSection';
import PrizesSection from '@/components/home/sections/PrizesSection';
import GetStartedSection from '@/components/home/sections/GetStartedSection';
import JudgesSection from '@/components/home/sections/JudgesSection';
import AgendaSection from '@/components/home/sections/AgendaSection';
import FAQsSection from '@/components/home/sections/FAQsSection';
import DecorativeFrames from '@/components/home/sections/DecorativeFrame';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className='bg-linear-to-r from-[#202020] to-[#232A2A] relative'>
        <DecorativeFrames />
        <HeroSection />
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
