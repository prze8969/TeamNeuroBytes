'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, locales } from '@/i18n/routing';
import enMessages from '@/messages/en.json';
import hiMessages from '@/messages/hi.json';
import mrMessages from '@/messages/mr.json';
import paMessages from '@/messages/pa.json';
import guMessages from '@/messages/gu.json';
import taMessages from '@/messages/ta.json';
import teMessages from '@/messages/te.json';
import knMessages from '@/messages/kn.json';

const allMessages: Record<Locale, any> = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
  pa: paMessages,
  gu: guMessages,
  ta: taMessages,
  te: teMessages,
  kn: knMessages,
};

interface LocaleContextValue {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  messages: any;
  t: (key: string, namespace?: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  currentLocale: 'en',
  setLocale: () => {},
  messages: enMessages,
  t: (key: string) => key,
});

export function LocaleProvider({
  children,
  initialLocale = 'en'
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [currentLocale, setCurrentLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_locale') as Locale;
      if (saved && locales.includes(saved)) {
        setCurrentLocaleState(saved);
      }
    } catch {}
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;
    setCurrentLocaleState(newLocale);
    try {
      localStorage.setItem('kisansetu_locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };

  const messages = allMessages[currentLocale] || allMessages.en;

  const t = (keyPath: string, namespace?: string): string => {
    const fullPath = namespace ? `${namespace}.${keyPath}` : keyPath;
    const parts = fullPath.split('.');
    
    let current = messages;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English
        let fallback = allMessages.en;
        for (const fbPart of parts) {
          if (fallback && typeof fallback === 'object' && fbPart in fallback) {
            fallback = fallback[fbPart];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LocaleContext.Provider value={{ currentLocale, setLocale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export function useTranslations(namespace?: string) {
  const { t } = useLocaleContext();
  return (key: string) => t(key, namespace);
}
