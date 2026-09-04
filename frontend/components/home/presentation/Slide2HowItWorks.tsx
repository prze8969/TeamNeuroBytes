'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, CheckCircle, Handshake, Truck, IndianRupee } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';

export function Slide2HowItWorks() {
  const { currentLocale } = useLocaleContext();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: '01',
      title: currentLocale === 'hi' ? 'लिस्ट करें' : currentLocale === 'mr' ? 'नोंदणी करा' : 'LIST',
      desc: 'Send crop photo through WhatsApp.',
      icon: <Smartphone size={28} className="text-amber-400" />
    },
    {
      num: '02',
      title: currentLocale === 'hi' ? 'वेरीफाई' : currentLocale === 'mr' ? 'पडताळणी' : 'VERIFY',
      desc: 'Quality and price are checked.',
      icon: <CheckCircle size={28} className="text-emerald-400" />
    },
    {
      num: '03',
      title: currentLocale === 'hi' ? 'मैच' : currentLocale === 'mr' ? 'जुळवणी' : 'MATCH',
      desc: 'Connect with a suitable buyer.',
      icon: <Handshake size={28} className="text-teal-400" />
    },
    {
      num: '04',
      title: currentLocale === 'hi' ? 'पिकअप' : currentLocale === 'mr' ? 'वाहतूक' : 'PICKUP',
      desc: 'Transport is coordinated.',
      icon: <Truck size={28} className="text-amber-400" />
    },
    {
      num: '05',
      title: currentLocale === 'hi' ? 'पेमेंट' : currentLocale === 'mr' ? 'पैसे' : 'PAID',
      desc: 'Payment is released directly to the farmer.',
      icon: <IndianRupee size={28} className="text-emerald-400" />
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#04130c] relative px-4 sm:px-6 py-14 md:py-20 overflow-hidden"
    >
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-[#04130c] to-[#04130c] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Slide Header */}
        <div className="text-center mb-10 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
            How selling works
          </h2>
          <div className="w-20 md:w-24 h-1 bg-amber-400 mt-4 md:mt-6 mx-auto rounded-full opacity-80" />
        </div>

        {/* Visual Flow Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 w-full">
          {steps.map((step, idx) => (
            <div 
              key={step.num} 
              className={`flex flex-row md:flex-col items-start md:items-center relative group transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              
              {/* Connector Line (Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-[1px] bg-gradient-to-r from-emerald-800 to-transparent -z-10" />
              )}
              {/* Connector Line (Mobile) */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute top-12 left-6 w-[1px] h-full bg-gradient-to-b from-emerald-800 to-transparent -z-10" />
              )}

              {/* Number & Icon Badge */}
              <div className="relative z-10 shrink-0 mb-0 md:mb-6 mr-6 md:mr-0">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-950/50 border border-emerald-800/60 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-400 text-[#04130c] font-black font-mono text-[10px] md:text-xs px-2 py-0.5 rounded-full">
                  {step.num}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start md:items-center text-left md:text-center mt-2 md:mt-0">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-wide uppercase mb-1">
                  {step.title}
                </h3>
                <p className="text-emerald-100/60 text-sm leading-relaxed max-w-[200px] md:max-w-[180px]">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
