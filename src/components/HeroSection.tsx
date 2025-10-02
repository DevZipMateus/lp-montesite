import React from 'react';
import ContactForm from './ContactForm';

const HeroSection: React.FC = () => {
  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <main className="w-full h-[786px] relative mt-[100px] bg-white max-md:h-auto max-md:min-h-[600px] max-md:px-5 max-md:py-[60px] max-sm:px-[15px] max-sm:py-10">
      {/* Background Image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/713647d2a3211010885421e76743211b26b65074?width=1838"
        alt=""
        className="w-[919px] h-[1148px] shrink-0 aspect-[919/1148] absolute top-[-181px] left-[720px] max-md:w-[400px] max-md:h-[500px] max-md:-translate-x-2/4 max-md:top-[-100px] max-md:left-2/4 max-md:right-auto max-sm:w-[300px] max-sm:h-[375px] max-sm:top-[-50px]"
        role="presentation"
      />
      
      {/* Content Card */}
      <section 
        className="w-[584px] h-[680px] shrink-0 shadow-[4px_4px_20px_0_rgba(0,132,255,0.30)] absolute bg-white rounded-2xl left-[120px] top-[53px] max-md:w-[90%] max-md:max-w-[500px] max-md:h-auto max-md:min-h-[600px] max-md:-translate-x-2/4 max-md:box-border max-md:p-10 max-md:left-2/4 max-md:top-[100px] max-sm:w-[95%] max-sm:min-h-[550px] max-sm:px-5 max-sm:py-[30px]"
        aria-labelledby="hero-heading"
      >
        {/* Heading */}
        <h1 
          id="hero-heading"
          className="w-[476px] text-[#040815] text-[40px] font-bold leading-[54.4px] tracking-[-1.2px] absolute h-[162px] left-[169px] top-[89px] max-md:w-[90%] max-md:max-w-[400px] max-md:-translate-x-2/4 max-md:text-[32px] max-md:text-center max-md:h-auto max-md:left-2/4 max-md:top-[140px] max-sm:text-[28px] max-sm:w-[95%] max-sm:top-[120px]"
        >
          Criação de sites sob medida para o seu negócio crescer online
        </h1>
        
        {/* Subtitle */}
        <p className="w-[476px] text-[#596780] text-[22px] font-normal leading-[33px] tracking-[-0.44px] absolute h-[66px] left-[169px] top-[274px] max-md:w-[90%] max-md:max-w-[400px] max-md:-translate-x-2/4 max-md:text-lg max-md:text-center max-md:h-auto max-md:left-2/4 max-md:top-[280px] max-sm:text-base max-sm:w-[95%] max-sm:top-[250px]">
          Solicite um contato e descubra como podemos criar o site que sua empresa merece.
        </p>
        
        {/* Contact Form */}
        <div className="absolute left-[169px] top-[363px] max-md:-translate-x-2/4 max-md:left-2/4 max-md:top-[360px] max-sm:top-80">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
