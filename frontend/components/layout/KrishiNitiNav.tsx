'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { HelpAboutModal } from '@/components/layout/HelpAboutModal';
import { useAuth } from '@/lib/AuthContext';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { Locale } from '@/i18n/routing';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { useAppTheme } from '@/lib/ThemeContext';
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
  const { currentLocale, setLocale, isTransitioning } = useLocaleContext();
  const { config } = useAppTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).nav;
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  const handleLanguageChange = (code: Locale) => {
    setIsLangDropdownOpen(false);
    if (code !== currentLocale) {
      setLocale(code);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b ${config.navBorder} ${config.navBg} backdrop-blur-xl transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Left: Clean Branding with compact SIH badge */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="block sm:hidden">
              <KisanSetuLogo size="xs" variant="light" badge="SIH" showTagline={false} />
            </div>
            <div className="hidden sm:block">
              <KisanSetuLogo size="md" variant="light" badge="SIH 2026" showTagline={false} />
            </div>
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

            {/* Razorpay Checkout Demo */}
            <Link 
              href="/checkout" 
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-white bg-emerald-800/50 hover:bg-emerald-800 transition-colors flex items-center gap-1"
              title="Razorpay Standard Checkout"
            >
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>
                {currentLocale === 'hi' ? 'चेकआउट' 
                  : currentLocale === 'mr' ? 'चेकआउट' 
                  : currentLocale === 'pa' ? 'ਚੈੱਕਆਊਟ' 
                  : currentLocale === 'gu' ? 'ચેકઆઉટ' 
                  : currentLocale === 'ta' ? 'செக்அவுட்' 
                  : currentLocale === 'te' ? 'చెక్‌అవుట్' 
                  : currentLocale === 'kn' ? 'ಚೆಕ್‌ಔಟ್' 
                  : 'Checkout'}
              </span>
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {/* Live Theme Palette Switcher (Desktop / Tablet) */}
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            {/* Language Selector Dropdown (Prominent for farmers) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-2 min-h-[44px] rounded-xl border border-white/20 bg-black/20 text-white hover:bg-black/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm backdrop-blur-md"
                title="Change Language"
                aria-label="Change Language"
              >
                <Globe size={14} className={`text-amber-300 shrink-0 transition-transform ${isTransitioning ? 'animate-spin' : ''}`} />
                <span className="max-w-[50px] sm:max-w-none truncate">{activeLangObj.native}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 shrink-0 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-950/98 border border-slate-700/90 text-white shadow-2xl p-1.5 z-50 backdrop-blur-2xl">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        currentLocale === lang.code
                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                          : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{lang.native} <span className="text-[10px] text-slate-400">({lang.name})</span></span>
                      {currentLocale === lang.code && <Check size={14} className="text-amber-300" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Action (Hidden on very small mobile to let Hamburger shine, available inside drawer) */}
            {isAuthenticated ? (
              <Link
                href={role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard'}
                className="hidden sm:flex text-xs sm:text-sm font-black px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-400/20 items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.dashboard}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white transition-all shadow-sm items-center justify-center cursor-pointer"
              >
                {t.signIn}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:text-white cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle mobile menu"
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
              <Link 
                href="/checkout" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700/70 text-emerald-100 flex items-center gap-2"
              >
                <ShieldCheck size={16} className="text-emerald-300" />
                <span>
                  {currentLocale === 'hi' ? 'रेज़रपे चेकआउट' 
                    : currentLocale === 'mr' ? 'रेझरपे चेकआउट' 
                    : currentLocale === 'pa' ? 'ਰੇਜ਼ਰਪੇਅ ਚੈੱਕਆਊਟ' 
                    : currentLocale === 'gu' ? 'રેઝરપે ચેકઆઉટ' 
                    : currentLocale === 'ta' ? 'ரேஸர்பே செக்அவுட்' 
                    : currentLocale === 'te' ? 'రేజర్‌పే చెక్‌అవుట్' 
                    : currentLocale === 'kn' ? 'ರೇಜರ್‌ಪೇ ಚೆಕ್‌ಔಟ್' 
                    : 'Razorpay Checkout'}
                </span>
              </Link>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between">
              <div className="sm:hidden w-full flex justify-center">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      <HelpAboutModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
