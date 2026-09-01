'use client';

import React, { useState } from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { CropLot } from '@/lib/types';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Button } from '@/components/ui/button';

export interface CropListingListItemProps {
  lot: CropLot;
  onOpenDetails: (lot: CropLot) => void;
}

export function CropListingListItem({
  lot,
  onOpenDetails
}: CropListingListItemProps) {
  const [pressing, setPressing] = useState(false);
  const floorPrice = lot.askingFloorPerKg ?? lot.basePricePerKg ?? 24.50;

  const cropImageSrc = lot.imageUrl || (
    lot.cropName.toLowerCase().includes('onion')
      ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
      : lot.cropName.toLowerCase().includes('tomato')
      ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
      : lot.cropName.toLowerCase().includes('rice')
      ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );

  // Determine trend direction from mandi comparison (if available)
  const mandiAvg = lot.mandiAvgPerKg ?? 0;
  const priceDiff = mandiAvg > 0 ? ((floorPrice - mandiAvg) / mandiAvg * 100) : null;
  const trendUp = priceDiff !== null ? priceDiff >= 0 : null;

  return (
    /* 
     * FIX 4 + 6: entire card is tappable (role=button), no caption needed.
     * Hover: shadow lifts (shadow-md), border turns emerald.
     * Green tint treatment replaces random left-border.
     * No caption text — affordance comes from hover lift + button.
     */
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(lot)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDetails(lot); }
      }}
      className={`
        group relative rounded-2xl bg-white border border-slate-200/90 
        p-4 sm:p-5 
        transition-all duration-200 
        cursor-pointer 
        flex items-center justify-between gap-4 
        overflow-hidden
        /* FIX 4: hover lift — clear shadow increase signals clickability */
        hover:shadow-lg hover:shadow-emerald-500/10
        hover:border-emerald-400/60
        hover:bg-emerald-50/30
        /* FIX 4: keyboard focus ring */
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
      `}
    >
      {/* FIX 4: Green tint selected state — positive treatment, NOT a stray colored edge */}
      {/* (No left-border accent — the whole card background turns green on hover) */}

      {/* Left section: Picture + Crop Name */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Crop Picture — scales up on hover as visual confirmation */}
        <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
          <ImageWithFallback
            src={cropImageSrc}
            cropName={lot.cropName}
            alt={lot.cropName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Crop Name + optional variety — NO caption */}
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors truncate">
            {lot.cropName}
          </h3>
          {lot.variety && (
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              {lot.variety}
            </span>
          )}
        </div>
      </div>

      {/* Right section: Price + trend + Details */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Floor Price
          </span>
          {/* FIX 4: price numbers — animate-price-pulse class triggers on mount/update */}
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono animate-price-pulse">
              ₹{floorPrice.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">/kg</span>
          </div>
          {/* FIX 3: Price-change badge — always with arrow icon, never text-color alone */}
          {priceDiff !== null && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full font-mono ${
              trendUp 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}>
              {trendUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {Math.abs(priceDiff).toFixed(1)}% vs mandi
            </span>
          )}
        </div>

        {/* FIX 4: Details button — pressed state via active:scale-95 active:bg-emerald-700
            Clear visual feedback before next screen loads */}
        <Button
          type="button"
          size="sm"
          onPointerDown={() => setPressing(true)}
          onPointerUp={() => setPressing(false)}
          onPointerLeave={() => setPressing(false)}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(lot);
          }}
          className={`
            bg-emerald-50 text-emerald-800 border border-emerald-200/80
            font-bold text-xs h-10 px-4 rounded-xl 
            shadow-2xs 
            transition-all duration-100 
            flex items-center gap-1.5 
            cursor-pointer
            hover:bg-emerald-600 hover:text-white hover:border-emerald-600
            active:scale-95 active:bg-emerald-700 active:text-white
            ${pressing ? 'scale-95 bg-emerald-700 text-white border-emerald-700' : ''}
          `}
        >
          <span className="hidden sm:inline">Details</span>
          <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
