'use client';

import React from 'react';
import { ArrowRight, ChevronRight, Eye } from 'lucide-react';
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

  return (
    <div
      onClick={() => onOpenDetails(lot)}
      className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/70 p-3 sm:p-4 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between gap-4 overflow-hidden"
    >
      {/* Subtle left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Left section: Picture + Crop Name */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Crop Picture */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
          <ImageWithFallback
            src={cropImageSrc}
            cropName={lot.cropName}
            alt={lot.cropName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Crop Name */}
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors truncate">
            {lot.cropName}
          </h3>
          <span className="text-[11px] font-medium text-slate-500 block">
            Click to view full lot details &amp; bid
          </span>
        </div>
      </div>

      {/* Right section: Asking Floor Price & View Details Action */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <div className="text-right">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
            Floor Price
          </span>
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-base sm:text-xl font-black text-emerald-700 font-mono">
              ₹{floorPrice.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500 font-sans">/kg</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(lot);
          }}
          className="bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200/80 group-hover:border-emerald-600 font-bold text-xs h-9 px-3.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="hidden sm:inline">Details</span>
          <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
