'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Clock, TrendingUp } from 'lucide-react';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useTranslations, useCropTranslation } from '@/lib/LocaleContext';
import { useAuth } from '@/lib/AuthContext';

export function Navbar({ activeRole = 'FARMER' }: { activeRole?: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const t = useTranslations('nav');
  const tCrop = useCropTranslation();

  const links = [
    { label: t('farmerPortal'), href: '/farmer/dashboard' },
    { label: t('buyerMarket'), href: '/buyer/dashboard' },
    { label: t('fpoCollective'), href: '/fpo/dashboard' },
    { label: t('transporterHub'), href: '/transportation/dashboard' },
    { label: t('warehouseHub'), href: '/warehouse/dashboard' },
    { label: t('governance'), href: '/admin/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-emerald-900 text-white">
      {/* Live Mandi Ticker Bar */}
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

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="sm" variant="light" badge="Agri-Trade AI" showTagline={false} />
          </Link>

          {/* Role Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/60">
            {links.map((link) => {
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
            })}
          </nav>
        </div>

        {/* User Status, Language Switcher & Sign Out */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-200 font-medium">{t('digilockerKyc')}</span>
            <span className="bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px]">{t('verified')}</span>
          </div>

          {/* Multilingual 8-Language Switcher */}
          <LanguageSwitcher />

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 bg-emerald-800/80 border-emerald-700 text-white hover:bg-emerald-700 hover:text-white font-bold cursor-pointer"
            onClick={() => {
              logout();
            }}
          >
            {t('signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}
