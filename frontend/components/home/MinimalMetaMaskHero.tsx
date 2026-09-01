'use client';

import React, { useEffect, useState } from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { Wheat } from 'lucide-react';

export function MinimalMetaMaskHero() {
  const { currentLocale } = useLocaleContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Staggered animation triggers
    setMounted(true);
  }, []);

  return (
    <section className="relative w-screen h-[100dvh] min-h-[100dvh] snap-start shrink-0 flex flex-col justify-end overflow-hidden bg-[#04130c] m-0 p-0 border-none left-[calc(-50vw+50%)] outline-none">
      
      {/* 1. Background Image Layer */}
      <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-[2000ms] ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[url('/krishi_niti_hero_bg.jpg')] bg-cover bg-[center_top_30%] md:bg-center animate-ken-burns" />
        
        {/* Subtle 15% overall darkening for consistent contrast while keeping it natural */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* 2. Cinematic Gradient Overlays */}
      {/* Dark gradient specifically behind the right-aligned headline for contrast, leaving the left side brighter */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[50%] bg-gradient-to-l from-black/80 via-black/40 md:via-black/20 to-transparent pointer-events-none z-10" />
      
      {/* Seamless fade out at the very bottom into the dark stats section */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#04130c] via-[#04130c]/80 to-transparent pointer-events-none z-10" />

      {/* 3. Foreground Content Container */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-12 sm:pb-16 md:pb-20 flex flex-col-reverse md:flex-row justify-between items-end gap-10 md:gap-16 border-none outline-none h-full md:h-auto overflow-y-auto overflow-x-hidden md:overflow-visible scrollbar-hide">
        
        {/* Left Area: Removed the Live Crop Listing card as requested */}
        <div className="hidden md:block w-full md:w-auto border-none outline-none" />

        {/* Right Area: Editorial Headline */}
        <div className={`w-full text-right max-w-2xl lg:mr-8 drop-shadow-2xl transition-all duration-1000 delay-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} border-none outline-none mb-4 md:mb-0`}>
          <h2 className="text-[2.75rem] sm:text-[3.5rem] md:text-5xl lg:text-[5rem] font-bold font-display tracking-tight text-white leading-[1.05] md:leading-[1.1]" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {currentLocale === 'hi' ? (
              <div className="flex flex-col items-end gap-1.5 md:gap-2">
                <span className="block opacity-95">फसल बेचें।</span>
                <span className="block text-amber-400 drop-shadow-xl">सही दाम पाएं।</span>
                <span className="block opacity-95">सुरक्षित भुगतान लें।</span>
              </div>
            ) : currentLocale === 'mr' ? (
              <div className="flex flex-col items-end gap-1.5 md:gap-2">
                <span className="block opacity-95">पीक विका.</span>
                <span className="block text-amber-400 drop-shadow-xl">योग्य भाव मिळवा.</span>
                <span className="block opacity-95">सुरक्षित पैसे मिळवा.</span>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1 sm:gap-2">
                <span className="block opacity-95">Sell Your Crop.</span>
                <span className="block text-amber-400 drop-shadow-xl">Get Fair Price.</span>
                <span className="block opacity-95">Get Paid Safely.</span>
              </div>
            )}
          </h2>
        </div>

      </div>

    </section>
  );
}
