'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { HelpAboutModal } from '@/components/layout/HelpAboutModal';
import { useAuth } from '@/lib/AuthContext';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { Locale } from '@/i18n/routing';
import { 
  HelpCircle, 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const LANGUAGES: Array<{ code: Locale; name: string; native: string }> = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
];

export function KrishiNitiNav() {
  const { role, isAuthenticated } = useAuth();
  const { currentLocale, setLocale } = useLocaleContext();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).nav;
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  const handleLanguageChange = (code: Locale) => {
    setLocale(code);
    setIsLangDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-emerald-800/70 bg-emerald-950/95 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Left: Clean Branding with compact SIH badge */}
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="md" variant="light" badge="SIH 2026" showTagline={false} />
          </Link>

          {/* Center Navigation Links (Radically Simplified for Farmers: 3 items) */}
          <nav className="hidden md:flex items-center space-x-2 font-semibold text-sm text-emerald-100">
            <Link 
              href="/" 
              className="px-3.5 py-2 rounded-xl hover:bg-emerald-900/60 hover:text-amber-300 transition-colors"
            >
              {t.home}
            </Link>
            <Link 
              href="/#workflow" 
              className="px-3.5 py-2 rounded-xl hover:bg-emerald-900/60 hover:text-amber-300 transition-colors"
            >
              {t.howItWorks}
            </Link>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="px-3.5 py-2 rounded-xl text-emerald-100 hover:bg-emerald-900/60 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={15} className="text-amber-300" />
              <span>{t.help}</span>
            </button>
            
            {/* Tucked away link for SIH Judges & Partners */}
            <Link 
              href="/#differentiation" 
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400/80 hover:text-emerald-200 hover:bg-emerald-900/40 transition-colors flex items-center gap-1 ml-2"
            >
              <span>{t.forJudges}</span>
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Language Selector Dropdown (Prominent for farmers) */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border border-emerald-700/80 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Change Language"
              >
                <Globe size={15} className="text-amber-400" />
                <span>{activeLangObj.native}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-emerald-950/98 border border-emerald-700/90 shadow-2xl p-1.5 z-50 backdrop-blur-2xl">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        currentLocale === lang.code
                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                          : 'text-emerald-100 hover:bg-emerald-900/70 hover:text-white'
                      }`}
                    >
                      <span>{lang.native} <span className="text-[10px] text-emerald-400">({lang.name})</span></span>
                      {currentLocale === lang.code && <Check size={14} className="text-amber-300" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Action */}
            {isAuthenticated ? (
              <Link
                href={role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard'}
                className="text-xs sm:text-sm font-black px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.dashboard}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white transition-all shadow-sm cursor-pointer"
              >
                {t.signIn}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-800/80 bg-emerald-950 px-6 py-4 space-y-3">
            <div className="space-y-2 text-sm font-semibold">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700/70 text-emerald-100"
              >
                {t.home}
              </Link>
              <Link 
                href="/#workflow" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700/70 text-emerald-100"
              >
                {t.howItWorks}
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsHelpOpen(true);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700/70 text-emerald-100 flex items-center gap-2"
              >
                <HelpCircle size={16} className="text-amber-400" />
                <span>{t.help}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-emerald-200 hover:text-white font-bold"
              >
                {t.signIn}
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-amber-300 font-bold"
              >
                {t.getStarted}
              </Link>
            </div>
          </div>
        )}
      </header>

      <HelpAboutModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
