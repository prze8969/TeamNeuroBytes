'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Truck, 
  MapPin, 
  TrendingUp, 
  Scale, 
  Eye,
  Lock,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { CropLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { resolveCropImageUrl } from '@/lib/assayData';

export interface CropListingCardProps {
  lot: CropLot;
  onInspect: (lot: CropLot) => void;
  onPlaceBid: (lotId: string, bidAmount: number, landedCostPerKg: number, totalAmount: number) => Promise<void> | void;
  isPlacingBid?: boolean;
}

export function CropListingCard({
  lot,
  onInspect,
  onPlaceBid,
  isPlacingBid = false
}: CropListingCardProps) {
  // Normalize fields with robust fallbacks
  const floorPrice = lot.askingFloorPerKg ?? lot.basePricePerKg;
  const mandiPrice = lot.mandiAvgPerKg ?? Math.round((floorPrice * 0.94) * 100) / 100;
  const quantityTons = lot.quantityTons ?? (lot.quantityKg / 1000);
  const quantityKg = lot.quantityKg ?? (quantityTons * 1000);
  const distanceKm = lot.distanceKm ?? 38;
  const origin = lot.origin ?? `${lot.location?.district || 'Nashik'}, ${lot.location?.state || 'Maharashtra'}`;
  const logisticsType = lot.logisticsType ?? (lot.status === 'POOLED' ? 'Shared Freight' : 'Direct');
  const freightPerKg = lot.freightPerKg ?? (logisticsType === 'Shared Freight' ? 1.20 : 1.85);
  const freightSavings = lot.freightSavingsPercent ?? (logisticsType === 'Shared Freight' ? 35 : 0);
  
  // Grade resolution
  const gradeKey = (lot.qualityGrade ?? `Grade ${lot.grade}`) as 'Grade A' | 'Grade B' | 'Grade C' | string;
  const qualityScore = lot.qualityScore ?? 92.5;

  // Local Bidding State
  const [bidValue, setBidValue] = useState<string>(floorPrice.toFixed(2));
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const numericBid = parseFloat(bidValue) || 0;
  const minAllowedBid = floorPrice;
  const isValidBid = numericBid >= minAllowedBid;

  // Landed Cost = Bid + Freight + 1.5% Mandi Cess
  const mandiCessPercent = 0.015;
  const cessPerKg = numericBid * mandiCessPercent;
  const landedCostPerKg = numericBid > 0 ? numericBid + freightPerKg + cessPerKg : 0;
  const totalLotCost = Math.round(landedCostPerKg * quantityKg);

  // Price Spread relative to Mandi Avg
  const priceSpread = floorPrice - mandiPrice;
  const spreadPercent = Math.round((priceSpread / mandiPrice) * 100 * 10) / 10;

  // Fallback high-quality agricultural imagery
  const cropImageSrc = resolveCropImageUrl(lot.cropName, lot.imageUrl);

  const handleBidSubmit = () => {
    if (!isValidBid) return;
    onPlaceBid(lot.id, numericBid, landedCostPerKg, totalLotCost);
  };

  return (
    <div className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400/80 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between">
      
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* ========================================================================= */}
      {/* 1. CARD HEADER */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 pb-3.5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
              {lot.cropName}
            </h3>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {lot.variety}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <span>Farmer:</span>
              <strong className="text-slate-800">{lot.farmerName}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-600 font-mono text-[11px]">
              <MapPin size={12} className="text-emerald-600 shrink-0" />
              <span>{origin}</span>
              <span className="text-emerald-700 font-bold">({distanceKm} km away)</span>
            </span>
          </div>
        </div>

        {/* Quality Grade Pill */}
        <div className="shrink-0">
          {gradeKey.toUpperCase().includes('REJECT') ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-black tracking-wide">REJECTED</span>
              <span className="text-[10px] font-bold text-rose-700 font-mono">({qualityScore}%)</span>
            </div>
          ) : gradeKey.includes('A') ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black tracking-wide">{gradeKey}</span>
              <span className="text-[10px] font-bold text-emerald-700 font-mono">({qualityScore}%)</span>
            </div>
          ) : gradeKey.includes('B') ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-black tracking-wide">{gradeKey}</span>
              <span className="text-[10px] font-bold text-blue-700 font-mono">({qualityScore}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-black tracking-wide">{gradeKey}</span>
              <span className="text-[10px] font-bold text-amber-700 font-mono">({qualityScore}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD BODY: Thumbnail + 3-Column Metrics Grid */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Left: Crop Thumbnail with AI Inspection Overlay */}
        <div className="sm:col-span-4 relative group/img rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-xs">
          <ImageWithFallback
            src={cropImageSrc}
            cropName={lot.cropName}
            alt={`${lot.cropName} lot preview`}
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
          />
          
          {/* Geotag & Source Pill */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md border border-slate-200/80 text-[10px] font-bold text-emerald-800 shadow-xs">
            <span>📷 WhatsApp Upload</span>
          </div>

          {/* AI Inspection Trigger Overlay */}
          <button
            type="button"
            onClick={() => onInspect(lot)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/60 flex items-center justify-center text-white shadow-lg group-hover/img:scale-110 transition-transform">
              <Eye size={16} />
            </div>
            <span className="text-xs font-black text-white flex items-center gap-1 drop-shadow">
              Inspect AI Grade <Sparkles size={12} className="text-emerald-300" />
            </span>
            <span className="text-[9px] text-slate-200 font-medium">View YOLOv8 Defect Heatmap</span>
          </button>
        </div>

        {/* Right: 3-Column Data Grid */}
        <div className="sm:col-span-8 grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          
          {/* Column 1: Available Volume */}
          <div className="flex flex-col justify-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Scale size={11} className="text-slate-400" /> Volume
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                {quantityTons.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ({(quantityTons * 10).toFixed(0)} Qtl)
            </span>
          </div>

          {/* Column 2: Asking Floor vs Mandi Avg */}
          <div className="flex flex-col justify-center space-y-0.5 border-x border-slate-200 px-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <TrendingUp size={11} className="text-emerald-600" /> Asking Floor
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                ₹{floorPrice.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">/kg</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              Mandi: <span className="text-slate-700 font-semibold">₹{mandiPrice.toFixed(2)}</span>
              {priceSpread >= 0 ? (
                <span className="text-emerald-700 text-[9px] font-bold">(+{spreadPercent}%)</span>
              ) : (
                <span className="text-blue-700 text-[9px] font-bold">({spreadPercent}%)</span>
              )}
            </span>
          </div>

          {/* Column 3: Logistics Mode */}
          <div className="flex flex-col justify-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Truck size={11} className="text-purple-600" /> Logistics
            </span>
            {logisticsType === 'Shared Freight' ? (
              <div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                  Shared Freight
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block pt-0.5 font-mono">
                  ⚡ {freightSavings}% saved (₹{freightPerKg.toFixed(2)}/kg)
                </span>
              </div>
            ) : (
              <div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                  Direct Freight
                </span>
                <span className="text-[10px] text-slate-600 font-mono block pt-0.5">
                  ₹{freightPerKg.toFixed(2)}/kg
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CARD FOOTER & BIDDING SECTION */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 pt-3.5 border-t border-slate-100 bg-slate-50/70 space-y-3">
        
        {/* Bid Input & Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          
          {/* Bid Input Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-700 font-black text-sm">
              ₹
            </div>
            <Input
              type="number"
              step="0.25"
              min={minAllowedBid}
              value={bidValue}
              onChange={(e) => setBidValue(e.target.value)}
              placeholder={`Min ₹${minAllowedBid.toFixed(2)}`}
              className={`pl-7 pr-16 bg-white border text-slate-900 font-mono text-sm font-black h-11 rounded-xl shadow-xs transition-all ${
                isValidBid 
                  ? 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600' 
                  : 'border-red-400 focus:border-red-500 text-red-600'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold font-mono">
              / kg
            </div>
          </div>

          {/* Primary Action Button: Place Bid & Escrow */}
          <Button
            type="button"
            onClick={handleBidSubmit}
            disabled={!isValidBid || isPlacingBid}
            className={`h-11 px-5 rounded-xl font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 ${
              isValidBid && !isPlacingBid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.01]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            {isPlacingBid ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Locking Escrow...</span>
              </>
            ) : (
              <>
                <Lock size={14} className="text-emerald-100" />
                <span>Place Bid & Escrow</span>
                <ArrowUpRight size={14} />
              </>
            )}
          </Button>
        </div>

        {/* Real-Time Landed Cost Breakdown Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
          
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-semibold text-slate-600">Estimated Landed:</span>
            <strong className="text-emerald-700 font-mono font-black text-xs">
              ₹{landedCostPerKg.toFixed(2)}/kg
            </strong>
            
            {/* Tooltip trigger */}
            <div className="relative inline-block">
              <button
                type="button"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center"
              >
                <Info size={13} />
              </button>

              {/* Popover Tooltip */}
              {isTooltipOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-2xl text-[10px] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Landed Cost Breakdown</span>
                    <span className="text-emerald-400 font-mono">₹{landedCostPerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Buyer Base Bid:</span>
                      <span className="text-white">₹{numericBid.toFixed(2)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Freight Allocation:</span>
                      <span className="text-purple-300">+ ₹{freightPerKg.toFixed(2)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">1.5% Mandi Cess & Duty:</span>
                      <span className="text-blue-300">+ ₹{cessPerKg.toFixed(2)}/kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-500 hidden sm:inline text-[10px]">
              (Bid ₹{numericBid.toFixed(2)} + Freight ₹{freightPerKg.toFixed(2)} + 1.5% Cess)
            </span>
          </div>

          <div className="text-slate-500 text-right">
            <span>Total Escrow Deposit: </span>
            <strong className="text-slate-900 font-mono font-bold">
              ₹{totalLotCost.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Validation Warning if Bid < Floor */}
        {!isValidBid && (
          <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 animate-in fade-in">
            ⚠️ Bid cannot be lower than the asking floor rate of ₹{minAllowedBid.toFixed(2)}/kg.
          </p>
        )}

      </div>
    </div>
  );
}
