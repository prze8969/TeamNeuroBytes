'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { useTranslations, useLocaleContext } from '@/lib/LocaleContext';
import { useAuth } from '@/lib/AuthContext';
import { useAppTheme } from '@/lib/ThemeContext';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar({ activeRole = 'FARMER' }: { activeRole?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { config } = useAppTheme();
  const { currentLocale } = useLocaleContext();
  const t = useTranslations('nav');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getFarmerTabLabel = (tab: 'home' | 'overview' | 'fpo' | 'market') => {
    switch (tab) {
      case 'home':
        switch (currentLocale) {
          case 'hi': return 'होम';
          case 'mr': return 'मुख्य';
          case 'pa': return 'ਮੁੱਖ';
          case 'gu': return 'મુખ્ય';
          case 'ta': return 'முகப்பு';
          case 'te': return 'హోమ్';
          case 'kn': return 'ಮುಖಪುಟ';
          default: return 'Home';
        }
      case 'overview':
        switch (currentLocale) {
          case 'hi': return 'अवलोकन';
          case 'mr': return 'आढावा';
          case 'pa': return 'ਸੰਖੇਪ';
          case 'gu': return 'વિહંગાવલોકન';
          case 'ta': return 'கண்ணோட்டம்';
          case 'te': return 'అవలోకనం';
          case 'kn': return 'ಅವಲೋಕನ';
          default: return 'Overview';
        }
      case 'fpo':
        switch (currentLocale) {
          case 'hi': return 'एफपीओ';
          case 'mr': return 'एफपीओ';
          case 'pa': return 'ਐਫਪੀਓ';
          case 'gu': return 'એફપીઓ';
          case 'ta': return 'எஃப்பிஓ';
          case 'te': return 'ఎఫ్‌పీఓ';
          case 'kn': return 'ಎಫ್‌ಪಿಒ';
          default: return 'FPO';
        }
      case 'market':
        switch (currentLocale) {
          case 'hi': return 'मंडी भाव';
          case 'mr': return 'बाजारभाव';
          case 'pa': return 'ਮੰਡੀ ਭਾਅ';
          case 'gu': return 'બજાર ભાવ';
          case 'ta': return 'சந்தை விலை';
          case 'te': return 'మార్కెట్ ధర';
          case 'kn': return 'ಮಾರುಕಟ್ಟೆ ದರ';
          default: return 'Market';
        }
    }
  };

  const getBuyerTabLabel = (tab: 'marketplace' | 'active-deals' | 'ledger') => {
    switch (tab) {
      case 'marketplace':
        switch (currentLocale) {
          case 'hi': return 'मंडी बाज़ार';
          case 'mr': return 'बाजारपेठ';
          case 'pa': return 'ਮੰਡੀ ਬਜ਼ਾਰ';
          case 'gu': return 'માર્કેટપ્લેસ';
          case 'ta': return 'சந்தை';
          case 'te': return 'మార్కెట్‌ప్లేస్';
          case 'kn': return 'ಮಾರುಕಟ್ಟೆ';
          default: return 'Marketplace';
        }
      case 'active-deals':
        switch (currentLocale) {
          case 'hi': return 'सक्रिय सौदे';
          case 'mr': return 'सक्रिय सौदे';
          case 'pa': return 'ਸਰਗਰਮ ਸੌਦੇ';
          case 'gu': return 'સક્રિય સોદા';
          case 'ta': return 'செயலில் உள்ள ஒப்பந்தங்கள்';
          case 'te': return 'చురుకైన ఒప్పందాలు';
          case 'kn': return 'ಸಕ್ರಿಯ ವ್ಯವಹಾರಗಳು';
          default: return 'Active Deals';
        }
      case 'ledger':
        switch (currentLocale) {
          case 'hi': return 'खाताबही';
          case 'mr': return 'खातेवही';
          case 'pa': return 'ਖਾਤਾ ਬਹੀ';
          case 'gu': return 'ખાતાવહી';
          case 'ta': return 'பேரேடு';
          case 'te': return 'ఖాతా పుస్తకం';
          case 'kn': return 'ಲೆಡ್ಜರ್';
          default: return 'Ledger';
        }
    }
  };

  const links = [
    { label: t('farmerPortal'), href: '/farmer/dashboard', allowedRoles: ['FARMER'] },
    { label: t('buyerMarket'), href: '/buyer/dashboard', allowedRoles: ['BUYER'] },
    { label: t('fpoCollective'), href: '/fpo/dashboard', allowedRoles: ['ORGANIZATION', 'FPO'] },
    { label: t('transporterHub'), href: '/transportation/dashboard', allowedRoles: ['TRANSPORTATION'] },
    { label: t('warehouseHub'), href: '/warehouse/dashboard', allowedRoles: ['WAREHOUSE'] },
    { label: t('governance'), href: '/admin/dashboard', allowedRoles: ['ADMIN'] },
    { label: '⛓️ Trust Protocol', href: '/blockchain', allowedRoles: ['FARMER', 'BUYER', 'ORGANIZATION', 'FPO', 'TRANSPORTATION', 'WAREHOUSE', 'ADMIN'] },
  ];

  const visibleLinks = links.filter((link) => link.allowedRoles.includes(activeRole.toUpperCase()));

  const isFarmer = activeRole.toUpperCase() === 'FARMER';

  return (
    <header className={`sticky top-0 z-50 w-full shadow-md ${config.navBg} border-b ${config.navBorder} text-white transition-colors duration-300`}>
      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-8 lg:space-x-12">
          <Link href="/" className="flex items-center group shrink-0">
            <KisanSetuLogo size="sm" variant="light" badge={!isFarmer ? "Agri-Trade AI" : undefined} showTagline={false} />
          </Link>

          {/* Role Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center space-x-3 bg-emerald-950/60 p-1.5 px-2 rounded-xl border border-emerald-800/60">
            {isFarmer ? (
              <>
                <Link href="/farmer/dashboard" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname === '/farmer/dashboard' ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getFarmerTabLabel('home')}
                </Link>
                <Link href="/farmer/overview" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname.includes('/farmer/overview') ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getFarmerTabLabel('overview')}
                </Link>
                <Link href="/farmer/fpo" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname.includes('/farmer/fpo') ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getFarmerTabLabel('fpo')}
                </Link>
                <Link href="/farmer/market" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname.includes('/farmer/market') ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getFarmerTabLabel('market')}
                </Link>
              </>
            ) : activeRole.toUpperCase() === 'BUYER' ? (
              <>
                <Link href="/buyer/dashboard" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname === '/buyer/dashboard' ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getBuyerTabLabel('marketplace')}
                </Link>
                <Link href="/buyer/active-deals" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname.includes('/buyer/active-deals') ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getBuyerTabLabel('active-deals')}
                </Link>
                <Link href="/buyer/ledger" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pathname.includes('/buyer/ledger') ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'}`}>
                  {getBuyerTabLabel('ledger')}
                </Link>
              </>
            ) : (
              visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (link.href.includes('/buyer')) {
                        try {
                          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
                        } catch {}
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                        : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })
            )}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 md:space-x-3">
          {!isFarmer && (
            <div className="hidden lg:flex items-center gap-2 bg-black/20 border border-white/20 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-medium">{t('digilockerKyc')}</span>
              <span className="bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px]">{t('verified')}</span>
            </div>
          )}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {user && (
            <div className="hidden lg:flex items-center gap-2 bg-black/20 border border-white/20 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md font-bold">
              👤 {user.name || (currentLocale === 'hi' ? 'किसान' : currentLocale === 'mr' ? 'शेतकरी' : currentLocale === 'pa' ? 'ਕਿਸਾਨ' : 'Farmer')}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex text-xs h-9 min-h-[44px] min-w-[44px] bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-bold cursor-pointer backdrop-blur-md"
            onClick={() => {
              logout();
            }}
          >
            {t('signOut') || 'Sign Out'}
          </Button>

          {/* Mobile Navigation Toggle (Visible on md and smaller) */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Collapsible Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full border-t border-white/10 bg-emerald-950/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col space-y-1.5">
            {isFarmer ? (
              <>
                <Link
                  href="/farmer/dashboard"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname === '/farmer/dashboard' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getFarmerTabLabel('home')}
                </Link>
                <Link
                  href="/farmer/overview"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname.includes('/farmer/overview') ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getFarmerTabLabel('overview')}
                </Link>
                <Link
                  href="/farmer/fpo"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname.includes('/farmer/fpo') ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getFarmerTabLabel('fpo')}
                </Link>
                <Link
                  href="/farmer/market"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname.includes('/farmer/market') ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getFarmerTabLabel('market')}
                </Link>
              </>
            ) : activeRole.toUpperCase() === 'BUYER' ? (
              <>
                <Link
                  href="/buyer/dashboard"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname === '/buyer/dashboard' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getBuyerTabLabel('marketplace')}
                </Link>
                <Link
                  href="/buyer/active-deals"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname.includes('/buyer/active-deals') ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getBuyerTabLabel('active-deals')}
                </Link>
                <Link
                  href="/buyer/ledger"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center shadow-sm ${pathname.includes('/buyer/ledger') ? 'bg-emerald-500 text-slate-950' : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'}`}
                >
                  {getBuyerTabLabel('ledger')}
                </Link>
              </>
            ) : (
              visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      if (link.href.includes('/buyer')) {
                        try {
                          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
                        } catch {}
                      }
                    }}
                    className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })
            )}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <div className="sm:hidden flex items-center justify-between gap-2 mb-2 px-1">
               <ThemeSwitcher />
               <LanguageSwitcher />
            </div>
            {!isFarmer && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-xs">
                <span className="text-white font-medium">{t('digilockerKyc')}</span>
                <span className="bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px]">{t('verified')}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs min-h-[44px] bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-bold cursor-pointer"
              onClick={() => {
                setIsMobileNavOpen(false);
                logout();
              }}
            >
              {t('signOut') || 'Sign Out'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
