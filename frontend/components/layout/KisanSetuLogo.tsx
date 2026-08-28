'use client';

import React from 'react';

export interface KrishiNitiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  badge?: string;
}

export function KrishiNitiLogo({
  size = 'lg',
  showTagline = false,
  variant = 'light',
  className = '',
  badge
}: KrishiNitiLogoProps) {
  const sizeMap = {
    xs: { iconSize: 28, textClass: 'text-lg', badgeClass: 'text-[8px] px-1.5 py-0.2' },
    sm: { iconSize: 34, textClass: 'text-xl', badgeClass: 'text-[9px] px-2 py-0.5' },
    md: { iconSize: 42, textClass: 'text-2xl', badgeClass: 'text-[10px] px-2 py-0.5' },
    lg: { iconSize: 52, textClass: 'text-3xl', badgeClass: 'text-[11px] px-2.5 py-0.5' },
    xl: { iconSize: 68, textClass: 'text-4xl', badgeClass: 'text-xs px-3 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Logo Icon Container */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-white shrink-0 p-1 flex items-center justify-center border border-amber-400/80 shadow-md group-hover:scale-105 transition-transform"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <img
          src="/logo.png"
          alt="Krishi Niti Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2.5">
          <span 
            className={`font-heading font-black tracking-tight leading-none text-white ${currentSize.textClass}`}
          >
            <span>Krishi</span>
            <span className="ml-1 text-amber-400 font-black">Niti</span>
          </span>

          {badge && (
            <span className={`rounded-full font-extrabold uppercase tracking-wide ${currentSize.badgeClass} bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-md shadow-amber-400/30 border border-amber-200`}>
              {badge}
            </span>
          )}
        </div>

        {showTagline && (
          <span className="text-[11px] font-medium text-emerald-200 tracking-tight mt-1 font-sans">
            Guaranteed Price Discovery &amp; Escrow • SIH 2026
          </span>
        )}
      </div>
    </div>
  );
}

// Aliases for seamless backwards compatibility
export const KisanSetuLogo = KrishiNitiLogo;
export default KrishiNitiLogo;
