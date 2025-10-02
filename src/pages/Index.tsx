import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex w-full flex-col justify-center items-start relative min-h-screen bg-white max-md:w-full">
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Index;
