'use client';

import React from 'react';

export interface KisanSetuLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  badge?: string;
}

export function KisanSetuLogo({
  size = 'md',
  showTagline = false,
  variant = 'auto',
  className = '',
  badge
}: KisanSetuLogoProps) {
  const sizeMap = {
    xs: { iconSize: 28, textClass: 'text-base', badgeClass: 'text-[8px] px-1.5 py-0.2' },
    sm: { iconSize: 34, textClass: 'text-lg', badgeClass: 'text-[9px] px-2 py-0.5' },
    md: { iconSize: 42, textClass: 'text-xl', badgeClass: 'text-[10px] px-2 py-0.5' },
    lg: { iconSize: 52, textClass: 'text-2xl', badgeClass: 'text-[11px] px-2.5 py-0.5' },
    xl: { iconSize: 68, textClass: 'text-3xl', badgeClass: 'text-xs px-3 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Logo Icon Container */}
      <div 
        className="relative rounded-xl overflow-hidden bg-white shrink-0 p-0.5 flex items-center justify-center border border-slate-200/90 shadow-2xs group-hover:scale-105 transition-transform"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <img
          src="/logo.png"
          alt="KisanSetu Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span 
            className={`font-black tracking-tight leading-none ${
              variant === 'light' 
                ? 'text-white' 
                : variant === 'dark' 
                ? 'text-slate-900' 
                : 'text-current'
            } ${currentSize.textClass}`}
          >
            <span className={variant === 'light' ? 'text-white' : 'text-slate-900'}>Kisan</span>
            <span className="text-emerald-800 ml-1">Setu</span>
          </span>

          {badge && (
            <span className={`bg-emerald-600 text-white rounded-full font-bold uppercase tracking-wider ${currentSize.badgeClass} shadow-2xs`}>
              {badge}
            </span>
          )}
        </div>

        {showTagline && (
          <span className="text-[10px] font-medium text-emerald-600 tracking-tight mt-0.5">
            Smart Trading, समृद्ध किसान
          </span>
        )}
      </div>
    </div>
  );
}

export default KisanSetuLogo;
