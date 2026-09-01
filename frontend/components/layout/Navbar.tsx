'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Clock, TrendingUp } from 'lucide-react';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { useTranslations, useCropTranslation } from '@/lib/LocaleContext';
import { useAuth } from '@/lib/AuthContext';
import { useAppTheme } from '@/lib/ThemeContext';

export function Navbar({ activeRole = 'FARMER' }: { activeRole?: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { config } = useAppTheme();
  const t = useTranslations('nav');
  const tCrop = useCropTranslation();

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
      {/* Live Mandi Ticker Bar - Hidden for Farmers */}
      {!isFarmer && (
        <div className="bg-emerald-950 px-4 py-1.5 text-[11px] text-emerald-200 overflow-x-auto flex items-center justify-between gap-4 font-sans border-b border-emerald-800/60">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" />
              {t('liveMandiFeed')}
            </span>
          </div>
          <div className="flex gap-6 font-medium">
            <span>🌾 {tCrop('Wheat')} (Nashik): <strong className="text-white font-bold font-mono">₹25.50/kg</strong> (+₹1.20)</span>
            <span>🧅 {tCrop('Onion')} (Lasalgaon): <strong className="text-white font-bold font-mono">₹21.50/kg</strong> (+₹0.80)</span>
            <span>🍅 {tCrop('Tomato')} (Pune): <strong className="text-white font-bold font-mono">₹19.00/kg</strong> (-₹0.50)</span>
            <span>🌾 {tCrop('Sharbati Wheat')} (Vashi): <strong className="text-white font-bold font-mono">₹28.50/kg</strong> (+₹2.10)</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-emerald-300/90 font-mono text-[10px]">
            <Clock size={11} className="text-emerald-400" />
            <span>{t('lastUpdated')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8 md:space-x-12">
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="sm" variant="light" badge={!isFarmer ? "Agri-Trade AI" : undefined} showTagline={false} />
          </Link>

          {/* Role Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-3 bg-emerald-950/60 p-1.5 px-2 rounded-xl border border-emerald-800/60">
            {isFarmer ? (
              <>
                <Link href="/farmer/dashboard" className="px-5 py-2 rounded-lg text-sm font-bold transition-all bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20">
                  Home
                </Link>
                <Link href="#" className="px-5 py-2 rounded-lg text-sm font-bold transition-all text-emerald-100 hover:text-white hover:bg-emerald-800/60">
                  My Lots
                </Link>
                <Link href="#" className="px-5 py-2 rounded-lg text-sm font-bold transition-all text-emerald-100 hover:text-white hover:bg-emerald-800/60">
                  Market
                </Link>
                <Link href="#" className="px-5 py-2 rounded-lg text-sm font-bold transition-all text-emerald-100 hover:text-white hover:bg-emerald-800/60">
                  About
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

        {/* User Status, Language Switcher, Theme Switcher & Sign Out */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {!isFarmer && (
            <div className="hidden sm:flex items-center gap-2 bg-black/20 border border-white/20 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-medium">{t('digilockerKyc')}</span>
              <span className="bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px]">{t('verified')}</span>
            </div>
          )}
          {!isFarmer && <ThemeSwitcher />}
          <LanguageSwitcher />

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-bold cursor-pointer backdrop-blur-md"
            onClick={() => {
              logout();
            }}
          >
            {isFarmer ? 'Profile / Sign Out' : t('signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}
