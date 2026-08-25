import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'hi', 'mr', 'pa', 'gu', 'ta', 'te', 'kn'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, { label: string; native: string; flag: string }> = {
  en: { label: 'English', native: 'English', flag: '🇬🇧' },
  hi: { label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  mr: { label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  pa: { label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  gu: { label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  ta: { label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  te: { label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
