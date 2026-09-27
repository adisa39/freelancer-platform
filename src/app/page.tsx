import HeroSection from '@/components/sections/HeroSection';
import { StatsSection, TestimonialsSection } from '@/components/sections/StatsTestimonials';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import LanguagesBanner from '@/components/sections/LanguagesBanner';
import QuoteSection from '@/components/sections/QuoteSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyUsSection />
      <LanguagesBanner />
      <TestimonialsSection />
      <QuoteSection />
    </>
  );
}
