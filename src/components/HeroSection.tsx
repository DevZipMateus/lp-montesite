import React from 'react';
import ContactForm from './ContactForm';

const HeroSection: React.FC = () => {
  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <main className="w-full min-h-screen sm:min-h-[600px] md:min-h-[700px] lg:min-h-[786px] relative mt-16 sm:mt-20 md:mt-24 lg:mt-[100px] bg-white flex items-center justify-center py-8 sm:py-12 md:py-16 lg:py-0 overflow-hidden">
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/713647d2a3211010885421e76743211b26b65074?width=1838"
          alt=""
          className="absolute w-full h-full object-cover object-right sm:w-3/4 sm:right-0 sm:left-auto sm:object-contain md:w-2/3 lg:w-[60%] lg:max-w-[920px] lg:h-full lg:max-h-[900px] lg:right-0 lg:top-0 lg:object-cover"
          role="presentation"
        />
      </div>
      
      {/* Content Card */}
      <section 
        className="relative z-10 w-full max-w-lg mx-4 sm:max-w-xl sm:mx-6 md:max-w-2xl lg:absolute lg:w-[584px] lg:left-[120px] lg:top-[53px] lg:mx-0 shadow-lg sm:shadow-xl lg:shadow-[4px_4px_20px_0_rgba(0,132,255,0.30)] bg-white rounded-2xl px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-0 lg:py-0 lg:h-[680px]"
        aria-labelledby="hero-heading"
      >
        <div className="lg:absolute lg:left-[54px] lg:top-[89px] lg:right-[54px] flex flex-col h-full lg:justify-start">
          {/* Heading */}
          <h1 
            id="hero-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight sm:leading-snug md:leading-[1.36] text-[#040815] mb-4 sm:mb-6 lg:mb-8"
          >
            Criação de sites sob medida para o seu negócio crescer online
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-[22px] text-[#596780] leading-relaxed tracking-tight mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            Solicite um contato e descubra como podemos criar o site que sua empresa merece.
          </p>
          
          {/* Contact Form */}
          <div className="w-full">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
