'use client';

import React from 'react';

import { useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

export interface KrishiNitiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  badge?: string;
  locale?: string;
}

const BRAND_MAP: Record<string, { first: string; second: string; tagline: string }> = {
  hi: {
    first: 'कृषि',
    second: 'नीति',
    tagline: 'गारंटीकृत मूल्य निर्धारण एवं एस्क्रो • SIH २०२६',
  },
  mr: {
    first: 'कृषी',
    second: 'नीती',
    tagline: 'हमीभाव शोध आणि एस्क्रो • SIH २०२६',
  },
  pa: {
    first: 'ਕ੍ਰਿਸ਼ੀ',
    second: 'ਨੀਤੀ',
    tagline: 'ਸਹੀ ਮੁੱਲ ਖੋਜ ਅਤੇ ਐਸਕਰੋ • SIH ੨੦੨੬',
  },
  gu: {
    first: 'કૃષિ',
    second: 'નીતિ',
    tagline: 'ખાતરીપૂર્વક ભાવ શોધ અને એસ્ક્રો • SIH ૨૦૨૬',
  },
  ta: {
    first: 'கிருஷி',
    second: 'நீதி',
    tagline: 'உத்தரவாத விலை கண்டறிதல் மற்றும் எஸ்க்ரோ • SIH 2026',
  },
  te: {
    first: 'కృషి',
    second: 'నీతి',
    tagline: 'హామీ ధర గుర్తింపు మరియు ఎస్క్రో • SIH 2026',
  },
  kn: {
    first: 'ಕೃಷಿ',
    second: 'ನೀತಿ',
    tagline: 'ಖಾತರಿಯ ಬೆಲೆ ಅನ್ವೇಷಣೆ ಮತ್ತು ಎಸ್ಕ್ರೊ • SIH 2026',
  },
  en: {
    first: 'Krishi',
    second: 'Niti',
    tagline: 'Guaranteed Price Discovery & Escrow • SIH 2026',
  },
};

export function KrishiNitiLogo({
  size = 'lg',
  showTagline = false,
  variant = 'light',
  className = '',
  badge,
  locale,
}: KrishiNitiLogoProps) {
  const { currentLocale } = useLocaleContext();
  const effectiveLocale = locale || currentLocale || 'en';
  const brand = BRAND_MAP[effectiveLocale] || BRAND_MAP.en;

  const sizeMap = {
    xs: { iconSize: 28, textClass: 'text-[20px]', badgeClass: 'text-[8px] px-1.5 py-0.2' },
    sm: { iconSize: 34, textClass: 'text-2xl', badgeClass: 'text-[9px] px-2 py-0.5' },
    md: { iconSize: 42, textClass: 'text-[28px]', badgeClass: 'text-[10px] px-2 py-0.5' },
    lg: { iconSize: 52, textClass: 'text-4xl', badgeClass: 'text-[11px] px-2.5 py-0.5' },
    xl: { iconSize: 68, textClass: 'text-5xl', badgeClass: 'text-xs px-3 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Logo Icon Container */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-white shrink-0 p-1 flex items-center justify-center border border-amber-400/80 shadow-md group-hover:scale-105 transition-transform"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <img
          src="/logo.png"
          alt={`${brand.first} ${brand.second}`}
          className="w-full h-full object-contain scale-[1.35]"
          loading="eager"
        />
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2.5">
          <span 
            className={`font-heading font-black tracking-tight leading-none ${variant === 'dark' ? 'text-slate-900' : 'text-white'} ${currentSize.textClass}`}
          >
            <span>{brand.first}</span>
            <span className="ml-1 text-amber-400 font-black">{brand.second}</span>
          </span>

          {badge && (
            <span className={`rounded-full font-extrabold uppercase tracking-wide ${currentSize.badgeClass} bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-md shadow-amber-400/30 border border-amber-200`}>
              {toLocalizedDigits(badge, effectiveLocale)}
            </span>
          )}
        </div>

        {showTagline && (
          <span className="text-[11px] font-medium text-emerald-200 tracking-tight mt-1 font-sans">
            {brand.tagline}
          </span>
        )}
      </div>
    </div>
  );
}

// Aliases for seamless backwards compatibility
export const KisanSetuLogo = KrishiNitiLogo;
export default KrishiNitiLogo;
