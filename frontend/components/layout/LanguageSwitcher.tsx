'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { locales, Locale, localeNames } from '@/i18n/routing';
import { useLocaleContext } from '@/lib/LocaleContext';

export function LanguageSwitcher() {
  const { currentLocale, setLocale } = useLocaleContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (loc: Locale) => {
    setLocale(loc);
    setIsOpen(false);
  };

  const currentConfig = localeNames[currentLocale] || localeNames.en;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:text-white transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={14} className="text-emerald-400 shrink-0" />
        <span className="font-medium tracking-wide">
          {currentConfig.native}
        </span>
        <ChevronDown 
          size={12} 
          className={`text-emerald-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Expanded Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl z-50 py-1.5 overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-emerald-800/60 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400/90 font-mono">
            Select Language • भाषा
          </div>
          
          <div className="max-h-64 overflow-y-auto py-1">
            {locales.map((loc) => {
              const info = localeNames[loc];
              const isActive = currentLocale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelectLanguage(loc)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800/80 text-white font-black'
                      : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{info.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">{info.native}</span>
                      <span className="text-[10px] text-emerald-400 font-normal">{info.label}</span>
                    </div>
                  </div>
                  {isActive && (
                    <Check size={14} className="text-emerald-300 font-bold" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
