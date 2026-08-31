'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2, DollarSign, Calendar, Warehouse } from 'lucide-react';
import { useAppTheme } from '@/lib/ThemeContext';

interface MandiPriceFeed {
  mandi_name: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  min_price_quintal: number;
  max_price_quintal: number;
  modal_price_quintal: number;
  modal_price_kg: number;
  forecast_7d_modal_kg: number;
}

const DEFAULT_PRICE_FEED: MandiPriceFeed[] = [
  {
    mandi_name: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    commodity: 'Onion',
    variety: 'Red Nashik',
    min_price_quintal: 1800,
    max_price_quintal: 2400,
    modal_price_quintal: 2150,
    modal_price_kg: 21.50,
    forecast_7d_modal_kg: 23.80,
  },
  {
    mandi_name: 'Nashik Central APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    commodity: 'Wheat',
    variety: 'Sharbati Lok-1',
    min_price_quintal: 2300,
    max_price_quintal: 2750,
    modal_price_quintal: 2550,
    modal_price_kg: 25.50,
    forecast_7d_modal_kg: 27.20,
  },
  {
    mandi_name: 'Pune APMC Yard',
    district: 'Pune',
    state: 'Maharashtra',
    commodity: 'Tomato',
    variety: 'Hybrid Vaishali',
    min_price_quintal: 1500,
    max_price_quintal: 2200,
    modal_price_quintal: 1900,
    modal_price_kg: 19.00,
    forecast_7d_modal_kg: 21.50,
  },
  {
    mandi_name: 'Kamthi APMC',
    district: 'Nagpur',
    state: 'Maharashtra',
    commodity: 'Potato',
    variety: 'Kufri Jyoti',
    min_price_quintal: 2100,
    max_price_quintal: 2600,
    modal_price_quintal: 2450,
    modal_price_kg: 24.50,
    forecast_7d_modal_kg: 26.80,
  },
  {
    mandi_name: 'Vashi APMC Terminal',
    district: 'Thane',
    state: 'Maharashtra',
    commodity: 'Soybean',
    variety: 'JS-335 Yellow',
    min_price_quintal: 4200,
    max_price_quintal: 4900,
    modal_price_quintal: 4650,
    modal_price_kg: 46.50,
    forecast_7d_modal_kg: 49.00,
  },
  {
    mandi_name: 'Rahata APMC',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    commodity: 'Wheat',
    variety: 'Kalyansona',
    min_price_quintal: 2400,
    max_price_quintal: 2900,
    modal_price_quintal: 2730,
    modal_price_kg: 27.30,
    forecast_7d_modal_kg: 28.50,
  }
];

const COMMODITY_FILTERS = ['All Crops', 'Wheat', 'Onion', 'Tomato', 'Potato', 'Soybean'];

export function LivePriceEngine() {
  const { config } = useAppTheme();
  const [prices, setPrices] = useState<MandiPriceFeed[]>(DEFAULT_PRICE_FEED);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Crops');
  const [selectedCommodityIndex, setSelectedCommodityIndex] = useState<number>(0);
  const [lotWeightKg, setLotWeightKg] = useState<number>(5000);

  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/decision/agmarknet-feed`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPrices(data);
          }
        }
      } catch {}
    }
    loadPrices();
  }, []);

  // Filtered prices based on selected category (capped at 4 key cards max for clean UX)
  const displayPrices = useMemo(() => {
    if (selectedCategory === 'All Crops') {
      const uniqueCommodities = new Set<string>();
      const featured: MandiPriceFeed[] = [];
      for (const p of prices) {
        const normComm = p.commodity.toLowerCase();
        if (!uniqueCommodities.has(normComm) && featured.length < 4) {
          uniqueCommodities.add(normComm);
          featured.push(p);
        }
      }
      return featured.length > 0 ? featured : prices.slice(0, 4);
    }
    const filtered = prices.filter(p => p.commodity.toLowerCase().includes(selectedCategory.toLowerCase()));
    return filtered.slice(0, 4);
  }, [prices, selectedCategory]);

  const activeItem = displayPrices[selectedCommodityIndex] || displayPrices[0] || DEFAULT_PRICE_FEED[0];
  const currentTotalVal = lotWeightKg * (activeItem?.modal_price_kg || 25.50);
  const forecast7dVal = lotWeightKg * (activeItem?.forecast_7d_modal_kg || 27.20);
  const storageCostEstimate = lotWeightKg * 0.40;
  const netForecastVal = forecast7dVal - storageCostEstimate;
  const profitDelta = netForecastVal - currentTotalVal;

  return (
    <div className="rounded-3xl border border-white/15 bg-black/35 backdrop-blur-2xl p-6 sm:p-8 space-y-6 text-left font-sans text-white shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-black uppercase text-amber-300 tracking-wider">
              Today's Live Mandi Market Prices
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            Check Today's Crop Prices &amp; Should You Sell or Wait?
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-md">
          <Sparkles size={15} />
          <span>Live Market Rates</span>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-emerald-200/80 font-bold text-xs shrink-0 mr-1">Choose Crop:</span>
        {COMMODITY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedCommodityIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                : 'bg-white/10 hover:bg-white/15 text-white/90 border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4 Clean Mandi Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayPrices.map((item, idx) => {
          const isSelected = selectedCommodityIndex === idx;
          const priceDiff = (item.forecast_7d_modal_kg || item.modal_price_kg) - item.modal_price_kg;
          return (
            <button
              key={`${item.commodity}-${item.mandi_name}-${idx}`}
              onClick={() => setSelectedCommodityIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 backdrop-blur-md ${
                isSelected
                  ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/70 shadow-lg scale-[1.01]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-white/90 truncate">{item.mandi_name.split(' ')[0]}</span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 ${
                  priceDiff >= 0 ? 'bg-emerald-400 text-slate-950' : 'bg-rose-400 text-slate-950'
                }`}>
                  {priceDiff >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  +₹{Math.abs(priceDiff).toFixed(2)}
                </span>
              </div>

              <div>
                <div className="font-extrabold text-sm text-white truncate">
                  {item.commodity} <span className="font-normal text-xs text-white/70">({(item.variety || '').split(' ')[0] || 'Good'})</span>
                </div>

                <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                  ₹{item.modal_price_kg.toFixed(2)}<span className="text-[10px] font-normal text-white/70">/kg</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sell vs Wait Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        
        {/* Left: Crop Weight Slider */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white/90">Your Crop Weight:</label>
              <span className="font-mono font-black text-xs text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-lg shadow-sm">
                {(lotWeightKg / 1000).toFixed(1)} Tons ({lotWeightKg.toLocaleString('en-IN')} kg)
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={lotWeightKg}
              onChange={(e) => setLotWeightKg(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-white/60">Slide to change your total crop quantity</p>
          </div>

          <div className="pt-3 space-y-2 text-xs border-t border-white/10">
            <div className="flex justify-between text-white/80">
              <span>Selected Mandi:</span>
              <strong className="text-white truncate max-w-[150px]">{activeItem?.mandi_name}</strong>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Today's Rate:</span>
              <strong className="text-white font-mono">₹{activeItem?.modal_price_kg?.toFixed(2)}/kg</strong>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Expected Rate Next Week:</span>
              <strong className="text-amber-300 font-mono">₹{activeItem?.forecast_7d_modal_kg?.toFixed(2)}/kg</strong>
            </div>
          </div>
        </div>

        {/* Middle: Option 1 - Sell Today */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white/70">
              <DollarSign size={14} className="text-emerald-400" />
              <span>Option 1: Sell Today</span>
            </div>
            <h4 className="font-bold text-sm text-white">Sell Now at Your Farm</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Get 100% money safely deposited directly into your bank account today. Zero waiting, zero storage costs.
            </p>
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-white/70 block">Your Total Money Today:</span>
            <strong className="text-2xl font-black font-mono text-white block">
              ₹{Math.round(currentTotalVal).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Right: Option 2 - Wait 7 Days in Warehouse */}
        <div className="p-5 rounded-2xl bg-amber-400/10 border border-amber-400/60 space-y-3 flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Warehouse size={14} className="text-amber-400" />
                <span>Option 2: Wait 7 Days</span>
              </div>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                Earn ₹{Math.round(profitDelta > 0 ? profitDelta : 0).toLocaleString('en-IN')} More
              </span>
            </div>
            <h4 className="font-bold text-sm text-white">Keep in Safe Cold Storage for 1 Week</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Mandi prices are expected to rise. Even after paying small warehouse rent, you earn more profit.
            </p>
          </div>

          <div className="p-3.5 bg-black/50 rounded-xl border border-amber-400/40 space-y-1">
            <span className="text-[11px] text-amber-200/90 block">Your Total Money After 1 Week:</span>
            <strong className="text-2xl font-black font-mono text-amber-300 block">
              ₹{Math.round(netForecastVal).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LivePriceEngine;
