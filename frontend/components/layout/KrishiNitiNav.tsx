
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
  MessageSquare
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
      <header className="absolute top-0 left-0 z-50 w-full bg-gradient-to-b from-black via-black/70 to-transparent transition-all pt-5 pb-8 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between pointer-events-auto">
          
          {/* Left: Branding */}
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="md" variant="light" showTagline={false} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10 font-bold text-[13px] uppercase tracking-[0.1em] text-white/90 drop-shadow-md">
            <Link href="/" className="relative group hover:text-white transition-colors">
              Home
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/#workflow" className="relative group hover:text-white transition-colors">
              How It Works
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/farmer/dashboard" className="relative group hover:text-white transition-colors">
              For Farmers
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/buyer/dashboard" className="relative group hover:text-white transition-colors">
              For Buyers
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <button onClick={() => setIsHelpOpen(true)} className="relative group hover:text-white transition-colors cursor-pointer uppercase">
              Help
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center space-x-5">
            
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-[11px] font-bold px-3 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md uppercase tracking-wider"
              >
                <Globe size={14} />
                <span>{activeLangObj.code}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#04130c]/95 border border-emerald-800 shadow-2xl p-2 z-50 backdrop-blur-xl tracking-normal">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        currentLocale === lang.code
                          ? 'bg-amber-400/20 text-amber-400 font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In Link - Clearly Visible */}
            <Link
              href="/login"
              className="hidden sm:block text-white hover:text-amber-400 font-bold text-[13px] uppercase tracking-wider transition-colors px-2 relative group"
            >
              Sign In
              <span className="absolute -bottom-1.5 left-2 w-[calc(100%-16px)] h-0.5 bg-white/30 transition-all duration-300 group-hover:bg-amber-400 group-hover:w-[calc(100%-16px)] rounded-full"></span>
            </Link>

            {/* Primary CTA Button */}
            <a
              href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#04130c] font-bold text-[13px] uppercase tracking-wider transition-all transform hover:scale-[1.03] items-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageSquare size={16} className="fill-[#04130c]" />
              <span>List Crop</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-white/20 text-white hover:bg-white/10 cursor-pointer backdrop-blur-md"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#04130c]/98 border-b border-emerald-800/80 px-6 py-6 space-y-6 backdrop-blur-2xl">
            <nav className="flex flex-col space-y-4 text-white text-lg font-medium">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/#workflow" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
              <Link href="/farmer/dashboard" onClick={() => setIsMobileMenuOpen(false)}>For Farmers</Link>
              <Link href="/buyer/dashboard" onClick={() => setIsMobileMenuOpen(false)}>For Buyers</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsHelpOpen(true); }} className="text-left">Help</button>
            </nav>
            <div className="pt-4 border-t border-emerald-800/60 flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-white font-bold uppercase tracking-wider text-sm hover:text-amber-400"
              >
                Sign In
              </Link>
              <a
                href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
                className="w-full py-3 rounded-xl bg-amber-400 text-[#04130c] font-bold flex justify-center items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare size={18} className="fill-[#04130c]" />
                <span>List Crop via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <HelpAboutModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
