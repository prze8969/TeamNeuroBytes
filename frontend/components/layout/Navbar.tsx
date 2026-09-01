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
    { label: t('farmerPortal'), href: '/farmer/dashboard', allowedRoles: ['FARMER'] },
    { label: t('buyerMarket'), href: '/buyer/dashboard', allowedRoles: ['BUYER'] },
    { label: t('fpoCollective'), href: '/fpo/dashboard', allowedRoles: ['ORGANIZATION', 'FPO'] },
    { label: t('transporterHub'), href: '/transportation/dashboard', allowedRoles: ['TRANSPORTATION'] },
    { label: t('warehouseHub'), href: '/warehouse/dashboard', allowedRoles: ['WAREHOUSE'] },
    { label: t('governance'), href: '/admin/dashboard', allowedRoles: ['ADMIN'] },
    { label: '⛓️ Trust Protocol', href: '/blockchain', allowedRoles: ['FARMER', 'BUYER', 'ORGANIZATION', 'FPO', 'TRANSPORTATION', 'WAREHOUSE', 'ADMIN'] },
  ];

  const visibleLinks = links.filter((link) => link.allowedRoles.includes(activeRole.toUpperCase()));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF7] px-4 py-3 shrink-0">
      {/* Live Mandi Ticker Bar */}
      <div className="max-w-7xl mx-auto mb-3 px-6 py-2 rounded-2xl bg-white text-slate-800 flex items-center justify-between gap-4 font-sans shadow-[3px_3px_8px_rgba(163,163,140,0.1),-3px_-3px_8px_rgba(255,255,255,0.8)] border-none">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse animate-duration-1000"></span>
          <span className="font-extrabold uppercase tracking-wider text-emerald-800 text-[10px] flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-700" />
            {t('liveMandiFeed')}
          </span>
        </div>
        <div className="flex gap-6 font-medium text-xs">
          <span>🌾 {tCrop('Wheat')}: <strong className="text-slate-800 font-bold font-mono">₹25.50/kg</strong> (+₹1.20)</span>
          <span>🧅 {tCrop('Onion')}: <strong className="text-slate-800 font-bold font-mono">₹21.50/kg</strong> (+₹0.80)</span>
          <span>🍅 {tCrop('Tomato')}: <strong className="text-slate-800 font-bold font-mono">₹19.00/kg</strong> (-₹0.50)</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-slate-500 font-mono text-[10px]">
          <Clock size={11} className="text-emerald-700" />
          <span>{t('lastUpdated')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Main Navigation Bar - Floating Clay-style slab */}
      <div className="clay-header max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-slate-800">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="sm" variant="dark" badge="Agri-Trade AI" showTagline={false} />
          </Link>

          {/* Role Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-2xl bg-[#FAFAF7] shadow-[inset_2px_2px_5px_rgba(163,163,140,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]">
            {visibleLinks.map((link) => {
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'clay-pressed text-emerald-950 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Status, Language Switcher & Sign Out */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#E8F5E9] text-[#1B5E20] px-3 py-1.5 rounded-full text-xs font-bold shadow-[2px_2px_5px_rgba(46,125,50,0.08)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-bold">{t('digilockerKyc')}</span>
            <span className="bg-emerald-700 text-white font-black px-2 py-0.5 rounded-full text-[10px] uppercase">{t('verified')}</span>
          </div>

          {/* Multilingual 8-Language Switcher */}
          <LanguageSwitcher />

          <Button
            variant="claySecondary"
            className="text-xs h-9 min-h-9 px-4 rounded-xl cursor-pointer"
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
