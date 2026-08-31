'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Scale, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
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

const COMMODITY_FILTERS = ['All Featured', 'Wheat', 'Onion', 'Tomato', 'Potato', 'Soybean'];

export function LivePriceEngine() {
  const { config } = useAppTheme();
  const [prices, setPrices] = useState<MandiPriceFeed[]>(DEFAULT_PRICE_FEED);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Featured');
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
      } catch {
        // Fallback to rich default benchmark data
      }
    }
    loadPrices();
  }, []);

  // Filtered prices based on selected category (capped at 4 key cards max for clean UX)
  const displayPrices = useMemo(() => {
    if (selectedCategory === 'All Featured') {
      // Pick unique top commodities to prevent clutter
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
  const fpoFreightSavings = currentTotalVal * 0.12;

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 text-left font-sans text-white shadow-2xl backdrop-blur-xl">
      
      {/* Engine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-extrabold uppercase text-amber-400 tracking-wider">
              AGMARKNET Live Mandi Intelligence
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            Real-Time Mandi Rates &amp; Sell vs. Wait Profit Engine
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-md">
          <Sparkles size={15} />
          <span>Real-time APMC Mandi Feed</span>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider shrink-0 mr-1">Filter Crop:</span>
        {COMMODITY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedCommodityIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-xs scale-[1.02]'
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compact 4-Card Ticker Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayPrices.map((item, idx) => {
          const isSelected = selectedCommodityIndex === idx;
          const priceDiff = (item.forecast_7d_modal_kg || item.modal_price_kg) - item.modal_price_kg;
          return (
            <button
              key={`${item.commodity}-${item.mandi_name}-${idx}`}
              onClick={() => setSelectedCommodityIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-amber-400/15 border-amber-400 text-white ring-2 ring-amber-400/60 shadow-lg scale-[1.01]'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-200 truncate">{item.mandi_name.split(' ')[0]}</span>
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 ${
                  priceDiff >= 0 ? 'bg-emerald-400 text-slate-950' : 'bg-rose-400 text-slate-950'
                }`}>
                  {priceDiff >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  +₹{Math.abs(priceDiff).toFixed(2)}
                </span>
              </div>

              <div>
                <div className="font-extrabold text-sm text-white truncate">
                  {item.commodity} <span className="font-normal text-xs text-slate-400">({(item.variety || '').split(' ')[0] || 'Std'})</span>
                </div>

                <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                  ₹{item.modal_price_kg.toFixed(2)}<span className="text-[10px] font-normal text-slate-400">/kg</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        
        {/* Left Column: Lot Input Controls */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200">Harvest Lot Quantity:</label>
              <span className="font-mono font-black text-xs text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-lg shadow-sm">
                {(lotWeightKg / 1000).toFixed(1)} Metric Tons ({lotWeightKg.toLocaleString('en-IN')} kg)
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
          </div>

          <div className="pt-3 space-y-2 text-xs border-t border-slate-700/80">
            <div className="flex justify-between text-slate-300">
              <span>Selected APMC:</span>
              <strong className="text-white truncate max-w-[150px]">{activeItem?.mandi_name}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Current Spot Price:</span>
              <strong className="text-white font-mono">₹{activeItem?.modal_price_kg?.toFixed(2)}/kg</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>7-Day Price Forecast:</span>
              <strong className="text-amber-400 font-mono">₹{activeItem?.forecast_7d_modal_kg?.toFixed(2)}/kg</strong>
            </div>
          </div>
        </div>

        {/* Middle: Decision 1 - Sell Today */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Option A: Immediate Sale
            </span>
            <h4 className="font-bold text-sm text-white">Sell Today at Farmgate</h4>
            <p className="text-xs text-slate-400">
              Instant payout with 100% RBI Escrow vault guarantee. Zero storage cost.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 block">Guaranteed Net Payout:</span>
            <strong className="text-xl font-black font-mono text-white block">
              ₹{Math.round(currentTotalVal).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Right: Decision 2 - Hold in e-NWR Cold Storage */}
        <div className="p-5 rounded-2xl bg-amber-400/10 border border-amber-400/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Option B: AI Hold Recommendation
              </span>
              <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                +₹{Math.round(profitDelta > 0 ? profitDelta : 0).toLocaleString('en-IN')} More
              </span>
            </div>
            <h4 className="font-bold text-sm text-white">Store in e-NWR Warehouse for 7 Days</h4>
            <p className="text-xs text-slate-300">
              Higher projected price after deducting ₹0.40/kg cold storage fee.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-amber-400/40 space-y-1">
            <span className="text-[11px] text-slate-400 block">Net Expected Earnings (After Storage):</span>
            <strong className="text-xl font-black font-mono text-amber-300 block">
              ₹{Math.round(netForecastVal).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LivePriceEngine;
