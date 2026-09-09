'use client';

import React, { useEffect, useState } from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import Link from 'next/link';

export function MinimalMetaMaskHero() {
  const { currentLocale } = useLocaleContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full md:w-screen h-[100dvh] min-h-[100dvh] snap-start shrink-0 flex flex-col justify-end overflow-hidden bg-[#04130c] m-0 p-0 border-none left-0 md:left-[calc(-50vw+50%)] outline-none">
      
      {/* 1. Background Image Layer */}
      <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-[2000ms] ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[url('/krishi_niti_hero_bg.jpg')] bg-cover bg-[center_top_30%] md:bg-center animate-ken-burns" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* 2. Cinematic Gradient Overlays */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[50%] bg-gradient-to-l from-black/90 via-black/55 md:via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#04130c] via-[#04130c]/80 to-transparent pointer-events-none z-10" />

      {/* 3. Foreground Content Container */}
      <div className="relative z-20 w-full px-3 sm:px-6 md:px-8 lg:px-10 pt-20 pb-20 sm:pb-16 md:pb-20 flex flex-col justify-end items-end border-none outline-none h-full md:h-auto overflow-y-auto overflow-x-hidden md:overflow-visible scrollbar-hide">
        
        {/* Right Area: Editorial Headline */}
        <div className={`w-fit mr-1 sm:mr-3 md:mr-5 lg:mr-6 drop-shadow-2xl transition-all duration-1000 delay-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} border-none outline-none mb-6 sm:mb-2 md:mb-0 text-right`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] font-bold font-display tracking-tight text-white leading-[1.1] md:leading-[1.12] text-right" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            {currentLocale === 'hi' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">उपज का सही व्यापार।</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">सही दाम पाएं।</span>
                <span className="block opacity-95 whitespace-nowrap">सुरक्षित भुगतान लें।</span>
              </div>
            ) : currentLocale === 'mr' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">शेतमालाचा सन्मान.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">योग्य भाव मिळवा.</span>
                <span className="block opacity-95 whitespace-nowrap">सुरक्षित पैसे मिळवा.</span>
              </div>
            ) : currentLocale === 'pa' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">ਆਪਣੀ ਉਪਜ ਦਾ ਵਪਾਰ।</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">ਸਹੀ ਮੁੱਲ ਪਾਓ।</span>
                <span className="block opacity-95 whitespace-nowrap">ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਲਓ।</span>
              </div>
            ) : currentLocale === 'gu' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">ઉપજનો સાચો વેપાર.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">સાચો ભાવ મેળવો.</span>
                <span className="block opacity-95 whitespace-nowrap">સੁਰક્ષિત ચુકવણી મેળવો.</span>
              </div>
            ) : currentLocale === 'ta' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">விளைச்சலை வர்த்தகம் செய்க.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">சரியான விலை பெறுங்கள்.</span>
                <span className="block opacity-95 whitespace-nowrap">பாதுகாப்பாக பணம் பெறுங்கள்.</span>
              </div>
            ) : currentLocale === 'te' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">పంటను గౌరవంగా అమ్మండి.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">సరైన ధర పొందండి.</span>
                <span className="block opacity-95 whitespace-nowrap">సురక్షితంగా చెల్లింపు పొందండి.</span>
              </div>
            ) : currentLocale === 'kn' ? (
              <div className="flex flex-col items-end text-right gap-1.5 md:gap-2">
                <span className="block opacity-95 whitespace-nowrap">ಬೆಳೆಯ ಗೌರವಯುತ ವ್ಯಾಪಾರ.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">ಸರಿಯಾದ ಬೆಲೆ ಪಡೆಯಿರಿ.</span>
                <span className="block opacity-95 whitespace-nowrap">ಸುರಕ್ಷಿತವಾಗಿ ಹಣ ಪಡೆಯಿರಿ.</span>
              </div>
            ) : (
              <div className="flex flex-col items-end text-right gap-1 sm:gap-2">
                <span className="block opacity-95 whitespace-nowrap">Trade Your Harvest.</span>
                <span className="block text-amber-400 drop-shadow-xl whitespace-nowrap">Get Fair Price.</span>
                <span className="block opacity-95 whitespace-nowrap">Get Paid Safely.</span>
              </div>
            )}
          </h2>

          {/* Mobile Auth Buttons */}
          <div className="flex sm:hidden flex-col gap-3 mt-8 w-full items-end">
            <Link href="/register" className="w-full max-w-[280px] text-center py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Get Started
            </Link>
            <Link href="/login" className="w-full max-w-[280px] text-center py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg backdrop-blur-md hover:bg-white/20 active:scale-[0.98] transition-all">
              Sign In
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}

export default MinimalMetaMaskHero;
