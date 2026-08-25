'use client';

import React from 'react';
import { Trash2, Users, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CropLot } from '@/lib/types';
import { resolveCropImageUrl } from '@/lib/assayData';
import { useTranslations } from '@/lib/LocaleContext';

export interface ProduceCardProps {
  lot: CropLot;
  onDelete: (lotId: string, cropName: string) => void;
  onClick?: (lot: CropLot) => void;
}

export function ProduceCard({ lot, onDelete, onClick }: ProduceCardProps) {
  const tList = useTranslations('listings');
  const isPooled = Boolean(lot.is_fpo_pooled || (lot as any).isPooled || lot.status === 'POOLED');
  const isRejected = lot.grade === 'REJECTED' || lot.qualityGrade === 'REJECTED' || (lot.qualityScore && lot.qualityScore < 50);
  const tonnage = (lot.quantityTons || (lot.quantityKg / 1000)).toFixed(1);
  const totalValuation = ((lot.quantityKg || (Number(tonnage) * 1000)) * (lot.basePricePerKg || lot.askingFloorPerKg || 20)).toLocaleString('en-IN');

  const tradeStatus = lot.status === 'POOLED' ? 'LISTED' : (lot.status || 'LISTED');

  return (
    <div
      onClick={() => onClick && onClick(lot)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden flex flex-col justify-between relative"
    >
      {/* Top Image Container with Uniform Aspect Ratio */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-slate-100">
        <img
          src={resolveCropImageUrl(lot.cropName, lot.imageUrl)}
          alt={lot.cropName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = resolveCropImageUrl(lot.cropName);
          }}
        />

        {/* 1. Single Top-Left Overlay Delist Icon (Hover Only) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lot.id, lot.cropName);
          }}
          className="absolute top-3 left-3 bg-black/50 hover:bg-rose-600 text-white rounded-full p-2 backdrop-blur-md transition-all shadow-md cursor-pointer border border-white/20 hover:scale-110 opacity-0 group-hover:opacity-100 duration-200"
          title={tList('delistTooltip')}
        >
          <Trash2 size={13} />
        </button>

        {/* 2. Top-Right Overlay Quality Grade Badge with Glassmorphism */}
        <div className={`absolute top-3 right-3 backdrop-blur-md text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm ${
          isRejected
            ? 'bg-rose-950/85 text-rose-200 border-rose-500/50'
            : 'bg-slate-950/80 text-emerald-300 border-emerald-400/40'
        }`}>
          {/* TODO: dynamic content translation via Bhashini API */}
          <span>{lot.qualityGrade || (isRejected ? 'REJECTED' : 'Grade A')} ({lot.qualityScore || 95}%)</span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        
        {/* Crop Identification & Dual Badges */}
        <div className="space-y-2">
          
          {/* Header Row: Lot ID & Date */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
              {lot.id}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {lot.harvestDate || '2026-08-24'}
            </span>
          </div>

          {/* Crop Title & Certified Variety */}
          <div>
            {/* TODO: dynamic content translation via Bhashini API */}
            <h4 className="text-base font-black text-slate-900 tracking-tight truncate group-hover:text-emerald-800 transition-colors">
              {lot.cropName}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">
              {lot.variety || 'Certified Variety'}
            </p>
          </div>

          {/* Dual Badges Container: Trade Status + FPO Logistics Mode */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {/* Badge 1: Trade Status */}
            <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md border ${
              tradeStatus === 'BID_ACCEPTED' || tradeStatus === 'SOLD'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : tradeStatus === 'IN_TRANSIT'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {tradeStatus}
            </span>

            {/* Badge 2: FPO Logistics Pooling Mode */}
            {isPooled ? (
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <Users size={11} className="text-purple-600" />
                <span>👥 {tList('pooled')}</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-200 flex items-center gap-1">
                <Truck size={11} className="text-gray-400" />
                <span>🚛 {tList('solo')}</span>
              </span>
            )}

            {/* Badge 3: Storage Facility Type */}
            {lot.storageFacility === 'WAREHOUSE' ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                🏭 {tList('coldStorage')}
              </span>
            ) : (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                🏡 {tList('farmgate')}
              </span>
            )}
          </div>

        </div>

        {/* Bottom Valuation & Payload Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">
              {tList('payload')}
            </span>
            <span className="text-sm font-black text-slate-800 font-mono">
              {tonnage} MT
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">
              {tList('askingPrice')}
            </span>
            <span className="text-sm font-black text-emerald-900 font-mono">
              ₹{Number(lot.basePricePerKg || lot.askingFloorPerKg || 25.5).toFixed(2)}/kg
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProduceCard;
