'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Eye, 
  MapPin, 
  Scale, 
  TrendingUp, 
  Truck, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CropLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export interface CropDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: CropLot | null;
  onInspect: (lot: CropLot) => void;
  onPlaceBid: (lot: CropLot) => void;
}

export function CropDetailModal({
  isOpen,
  onClose,
  lot,
  onInspect,
  onPlaceBid
}: CropDetailModalProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!isOpen || !lot) return null;

  // Normalized Fields
  const floorPrice = lot.askingFloorPerKg ?? lot.basePricePerKg ?? 24.50;
  const mandiPrice = lot.mandiAvgPerKg ?? Math.round((floorPrice * 0.94) * 100) / 100;
  const quantityTons = lot.quantityTons ?? ((lot.quantityKg || 5000) / 1000);
  const quantityKg = lot.quantityKg ?? (quantityTons * 1000);
  const distanceKm = lot.distanceKm ?? 38;
  const origin = lot.origin ?? `${lot.location?.district || 'Nashik'}, ${lot.location?.state || 'Maharashtra'}`;
  const logisticsType = lot.logisticsType ?? (lot.status === 'POOLED' ? 'Shared Freight' : 'Direct');
  const freightPerKg = lot.freightPerKg ?? (logisticsType === 'Shared Freight' ? 1.20 : 1.85);
  const freightSavings = lot.freightSavingsPercent ?? (logisticsType === 'Shared Freight' ? 35 : 0);
  
  const gradeKey = (lot.qualityGrade ?? `Grade ${lot.grade || 'A'}`) as string;
  const qualityScore = lot.qualityScore ?? 94.2;

  // Price Spread relative to Mandi Avg
  const priceSpread = floorPrice - mandiPrice;
  const spreadPercent = Math.round((priceSpread / mandiPrice) * 100 * 10) / 10;

  // Estimated Landed Cost per kg
  const mandiCessPercent = 0.015;
  const cessPerKg = floorPrice * mandiCessPercent;
  const landedCostPerKg = floorPrice + freightPerKg + cessPerKg;
  const totalEstimatedEscrow = Math.round(landedCostPerKg * quantityKg);

  const cropImageSrc = lot.imageUrl || (
    lot.cropName.toLowerCase().includes('onion')
      ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
      : lot.cropName.toLowerCase().includes('tomato')
      ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
      : lot.cropName.toLowerCase().includes('rice')
      ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {lot.cropName}
              </h2>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {lot.variety}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {lot.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Farmer:</span>
              <strong className="text-slate-800">{lot.farmerName}</strong>
              <span className="text-slate-300">•</span>
              <MapPin size={12} className="text-emerald-600 shrink-0" />
              <span>{origin}</span>
              <strong className="text-emerald-700 font-bold font-mono">({distanceKm} km away)</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (SCROLLABLE) */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Top Banner Image with AI Inspection Overlay Action */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs group">
            <ImageWithFallback
              src={cropImageSrc}
              cropName={lot.cropName}
              alt={lot.cropName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Quality Grade Overlay Badge (Top-Left) */}
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-emerald-800 font-bold shadow-md">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-xs font-black">{gradeKey}</span>
                <span className="text-[10px] text-emerald-700 font-mono">({qualityScore}%)</span>
              </div>
            </div>

            {/* AI Computer Vision Trigger Button (Top-Right) */}
            <button
              type="button"
              onClick={() => onInspect(lot)}
              className="absolute top-3 right-3 bg-emerald-600/95 hover:bg-emerald-700 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 border border-emerald-400/40 cursor-pointer transition-all hover:scale-105"
            >
              <Sparkles size={13} className="text-emerald-200" />
              <span>Inspect AI Quality Grade</span>
              <Eye size={13} />
            </button>

            {/* Bottom Harvest Info Strip */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl text-white flex items-center justify-between text-[11px] font-mono border border-white/10">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar size={13} className="text-emerald-400" />
                Harvest: <strong className="text-white">{lot.harvestDate || 'Fresh 2026 Season'}</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                📷 Verified WhatsApp Upload
              </span>
            </div>
          </div>

          {/* 3-Column Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Metric 1: Available Volume */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Scale size={12} className="text-slate-400" /> Available Volume
              </span>
              <div className="flex items-baseline gap-1">
                <strong className="text-lg font-black text-slate-900 font-mono">
                  {quantityTons.toFixed(1)}
                </strong>
                <span className="text-xs font-bold text-slate-500">Tons</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                ({(quantityTons * 10).toFixed(0)} Qtl / {quantityKg.toLocaleString('en-IN')} kg)
              </span>
            </div>

            {/* Metric 2: Asking Floor vs APMC Mandi Avg */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-600" /> Asking Floor Rate
              </span>
              <div className="flex items-baseline gap-0.5">
                <strong className="text-lg font-black text-emerald-700 font-mono">
                  ₹{floorPrice.toFixed(2)}
                </strong>
                <span className="text-xs font-bold text-slate-500">/kg</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono block">
                Mandi Avg: <strong>₹{mandiPrice.toFixed(2)}</strong> ({priceSpread >= 0 ? `+${spreadPercent}%` : `${spreadPercent}%`})
              </span>
            </div>

            {/* Metric 3: Logistics Mode */}
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1">
                <Truck size={12} className="text-purple-600" /> Logistics Mode
              </span>
              {logisticsType === 'Shared Freight' ? (
                <div>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                    Shared Corridor
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block pt-1 font-mono">
                    ⚡ {freightSavings}% saved (₹{freightPerKg.toFixed(2)}/kg)
                  </span>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    Direct Solo Haul
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono block pt-1">
                    ₹{freightPerKg.toFixed(2)}/kg
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Financial Breakdown & Landed Cost Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-700 font-sans">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-700" />
                Estimated Landed Cost Breakdown:
              </span>
              <strong className="text-emerald-800 font-mono font-black text-xs">
                ₹{landedCostPerKg.toFixed(2)} / kg
              </strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/80 text-[10px]">
              <div className="flex justify-between sm:block">
                <span className="text-slate-500 block font-sans">Base Floor Bid:</span>
                <span className="font-bold text-slate-900">₹{floorPrice.toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-slate-500 block font-sans">Freight Allocation:</span>
                <span className="font-bold text-purple-700">+ ₹{freightPerKg.toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-slate-500 block font-sans">1.5% APMC Cess:</span>
                <span className="font-bold text-blue-700">+ ₹{cessPerKg.toFixed(2)}/kg</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-sans font-medium">Total Escrow Requirement:</span>
              <strong className="text-slate-900 font-black text-sm">
                ₹{totalEstimatedEscrow.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================================= */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onInspect(lot)}
              className="h-10 px-4 rounded-xl text-xs font-bold border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={13} />
              <span>AI Inspection</span>
            </Button>

            <Button
              type="button"
              onClick={() => onPlaceBid(lot)}
              className="h-10 px-5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Lock size={14} />
              <span>Place Bid &amp; Escrow</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
