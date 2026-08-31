'use client';

import React from 'react';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/LocaleContext';
import { useAppTheme } from '@/lib/ThemeContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { MessageSquare, ArrowRight, ChevronDown } from 'lucide-react';

export function MinimalMetaMaskHero() {
  const { currentLocale } = useLocaleContext();
  const { config } = useAppTheme();
  const t = LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en;

  const scrollToNext = () => {
    const nextSection = document.getElementById('how-it-works-preview');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between items-center text-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden ${config.heroBgGradient} transition-colors duration-500`}>
      
      {/* Background Ambient Mesh Grid & Subtle Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] ${config.heroGlow1} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[450px] h-[350px] ${config.heroGlow2} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />

      {/* Top Spacer for Vertical Centering */}
      <div className="w-full h-2"></div>

      {/* Center Group: Tagline + Single Dominant CTA */}
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-14 relative z-10 my-auto">
        
        {/* Tagline: Large, Bold, Clean */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display font-heading tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          {currentLocale === 'hi' ? (
            <>
              फसल बेचें। <br />
              <span className={`${config.heroTextGradient} bg-clip-text text-transparent transition-all duration-500`}>
                सही दाम पाएं।
              </span> <br />
              सुरक्षित भुगतान लें।
            </>
          ) : currentLocale === 'mr' ? (
            <>
              पीक विका. <br />
              <span className={`${config.heroTextGradient} bg-clip-text text-transparent transition-all duration-500`}>
                योग्य भाव मिळवा.
              </span> <br />
              सुरक्षित पैसे मिळवा.
            </>
          ) : (
            <>
              Sell Your Crop. <br />
              <span className={`${config.heroTextGradient} bg-clip-text text-transparent transition-all duration-500`}>
                Get Fair Price.
              </span> <br />
              Get Paid Safely.
            </>
          )}
        </h1>

        {/* Single Dominant CTA Button */}
        <div className="flex flex-col items-center justify-center pt-2">
          <a
            href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 rounded-full ${config.heroCtaButton} font-black text-xl sm:text-2xl transition-all duration-300 transform hover:scale-[1.04] shadow-2xl flex items-center justify-center gap-3.5 cursor-pointer group`}
          >
            <div className={`h-10 w-10 rounded-full ${config.heroCtaIconBg} ${config.heroCtaIconColor} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
              <MessageSquare size={22} className="fill-current" />
            </div>
            <span>{t.hero.farmerCta}</span>
            <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform ml-1" />
          </a>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 pt-6 pb-2">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer group"
          title="Scroll down to explore"
        >
          <span className="text-[11px] tracking-wider uppercase opacity-75 group-hover:opacity-100">
            Scroll to explore
          </span>
          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:border-white/40 backdrop-blur-sm">
            <ChevronDown size={18} className="animate-bounce text-white/80 group-hover:text-white" />
          </div>
        </button>
      </div>

    </section>
  );
}

export default MinimalMetaMaskHero;
