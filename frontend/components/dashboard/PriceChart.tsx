'use client'

import React, { useState } from 'react';
import { MandiPrice } from '@/lib/types';
import { useTranslations, useCropTranslation } from '@/lib/LocaleContext';
import { MapPin, TrendingUp, Filter, Sparkles } from 'lucide-react';

interface PriceChartProps {
  commodity: string;
  mandiPrices: MandiPrice[];
}

export function PriceChart({ commodity, mandiPrices }: PriceChartProps) {
  const t = useTranslations('priceChart');
  const tCrop = useCropTranslation();
  const [selectedMandiFilter, setSelectedMandiFilter] = useState<string>('ALL');

  const filteredPrices = selectedMandiFilter === 'ALL'
    ? mandiPrices
    : mandiPrices.filter(p => p.mandiName.toLowerCase().includes(selectedMandiFilter.toLowerCase()));

  const mandiFilters = [
    { id: 'ALL', label: 'All APMC Mandis' },
    { id: 'Nashik', label: 'Nashik APMC' },
    { id: 'Vashi', label: 'Vashi (Mumbai)' },
    { id: 'Pune', label: 'Pune APMC' },
    { id: 'Lasalgaon', label: 'Lasalgaon APMC' }
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200/80 shadow-2xs">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">{t('title')}</h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Agmarknet
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active Listed Crop: <strong className="text-slate-800 font-bold">{tCrop(commodity)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span> {t('todayModal')}
          </span>
          <span className="flex items-center gap-1.5 text-purple-800 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            <span className="h-2 w-2 rounded-full bg-purple-600"></span> {t('forecast7D')}
          </span>
        </div>
      </div>

      {/* Target Mandi Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
          <Filter size={11} /> Mandi:
        </span>
        {mandiFilters.map(f => (
          <button
            key={`mandi-filter-${f.id}`}
            type="button"
            onClick={() => setSelectedMandiFilter(f.id)}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedMandiFilter === f.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Visual Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {(filteredPrices.length > 0 ? filteredPrices : mandiPrices).map((p) => {
          const forecastDiff = (p.forecastNextWeek || p.modalPrice) - p.modalPrice;
          const isUp = forecastDiff >= 0;
          return (
            <div
              key={p.mandiName}
              className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200/80 space-y-3 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all shadow-2xs group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-xs text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.mandiName}</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.district}, {p.state}</p>
                </div>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                  isUp
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {isUp ? `+₹${forecastDiff.toFixed(1)}/kg` : `-₹${Math.abs(forecastDiff).toFixed(1)}/kg`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-500">{t('currentModal')}</span>
                  <strong className="text-emerald-800 font-mono font-black text-sm">
                    ₹{(p.modalPrice / (p.modalPrice > 100 ? 100 : 1)).toFixed(2)}/kg
                  </strong>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-500">{t('forecast')}</span>
                  <strong className="text-purple-800 font-mono font-black text-sm">
                    ₹{((p.forecastNextWeek || p.modalPrice) / ((p.forecastNextWeek || p.modalPrice) > 100 ? 100 : 1)).toFixed(2)}/kg
                  </strong>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                  <span>Range: ₹{(p.minPrice / (p.minPrice > 100 ? 100 : 1)).toFixed(0)} - ₹{(p.maxPrice / (p.maxPrice > 100 ? 100 : 1)).toFixed(0)}</span>
                  <span>{p.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PriceChart;
