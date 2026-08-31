'use client';

import React, { useState } from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MessageSquare, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function GetStartedBand() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).ctaBand;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitted(true);
    toast.success('Callback requested!', {
      description: 'Our agricultural advisor will call your number within 15 minutes.'
    });
  };

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-28">
      <ScrollReveal>
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border border-emerald-700/80 p-8 sm:p-14 text-center shadow-2xl overflow-hidden">
          
          {/* Background Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
                {t.title}
              </h2>
              <p className="text-base sm:text-xl text-emerald-100/90 font-medium">
                {t.subtitle}
              </p>
            </div>

            {/* WhatsApp Primary Button */}
            <div className="flex justify-center">
              <a
                href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 sm:px-12 py-5 sm:py-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-lg sm:text-xl transition-all transform hover:scale-[1.03] shadow-2xl shadow-amber-400/30 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <MessageSquare size={22} className="fill-slate-950" />
                <span>{t.button}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-1" />
              </a>
            </div>

            {/* Callback Option for Non-WhatsApp Farmers */}
            <div className="pt-6 border-t border-emerald-700/60 max-w-md mx-auto space-y-3">
              <p className="text-xs sm:text-sm font-medium text-emerald-200">
                Prefer a phone call? Enter your mobile number:
              </p>

              {isSubmitted ? (
                <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-teal-400" />
                  <span>{t.phoneSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handlePhoneSubmit} className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    maxLength={10}
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-700 text-white placeholder-emerald-400/60 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <PhoneCall size={14} />
                    <span>{t.phoneButton}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
