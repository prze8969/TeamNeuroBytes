'use client';

import React from 'react';
import { 
  TrendingUp, 
  Scale, 
  Truck, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Wallet,
  PiggyBank,
  CheckCircle2
} from 'lucide-react';

export interface BuyerAnalyticsData {
  total_spend_inr?: number;
  spend_change_pct?: number;
  total_volume_tons?: number;
  volume_change_pct?: number;
  logistics_savings_inr?: number;
  logistics_savings_pct?: number;
  avg_quality_score?: number;
  grade_a_percentage?: number;
}

export interface BuyerAnalyticsCardsProps {
  data?: BuyerAnalyticsData;
}

export function BuyerAnalyticsCards({ data }: BuyerAnalyticsCardsProps) {
  const stats = {
    totalSpend: data?.total_spend_inr ?? 1842850,
    spendChange: data?.spend_change_pct ?? 14.2,
    totalVolume: data?.total_volume_tons ?? 84.5,
    volumeChange: data?.volume_change_pct ?? 8.5,
    logisticsSavings: data?.logistics_savings_inr ?? 48200,
    savingsPct: data?.logistics_savings_pct ?? 35.0,
    qualityScore: data?.avg_quality_score ?? 92.4,
    gradeAPct: data?.grade_a_percentage ?? 88.0
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Total Procurement Spend */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Total Sourcing Spend
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Wallet size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{stats.totalSpend.toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="text-emerald-700 font-bold flex items-center font-mono">
              <ArrowUpRight size={13} className="stroke-[3]" />
              +{stats.spendChange}%
            </span>
            <span className="text-slate-400 font-medium">vs last month</span>
          </div>
        </div>

        {/* Micro Sparkline Trend Bars */}
        <div className="flex items-end gap-1.5 h-6 pt-1">
          {[35, 50, 45, 70, 90, 100].map((val, idx) => (
            <div
              key={idx}
              className={`flex-1 rounded-sm transition-all ${
                idx === 5 ? 'bg-emerald-600' : 'bg-emerald-200'
              }`}
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </div>

      {/* Card 2: Total Volume Sourced */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Total Volume Sourced
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Scale size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {stats.totalVolume.toFixed(1)} <span className="text-sm font-sans font-bold text-slate-500">Tons</span>
          </h3>
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="text-blue-700 font-bold flex items-center font-mono">
              <ArrowUpRight size={13} className="stroke-[3]" />
              +{stats.volumeChange}%
            </span>
            <span className="text-slate-400 font-medium">5 crop varieties</span>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Fulfillment: 84.5T</span>
            <span className="text-blue-700 font-bold">Target: 100T</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '84.5%' }} />
          </div>
        </div>
      </div>

      {/* Card 3: Logistics Savings via Geo-Pooling */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Shared Freight Savings
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Truck size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-purple-900 font-mono tracking-tight">
            ₹{stats.logisticsSavings.toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="text-purple-700 font-black px-1.5 py-0.2 rounded bg-purple-100 font-mono text-[11px]">
              ⚡ {stats.savingsPct}% Saved
            </span>
            <span className="text-slate-400 font-medium">via PostGIS pooling</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight pt-1">
          Reduced deadhead miles on Nashik-Vashi and Karnal corridors.
        </p>
      </div>

      {/* Card 4: Average Quality Score */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Average Quality Index
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {stats.qualityScore}% <span className="text-sm font-sans font-bold text-emerald-700">Grade A</span>
          </h3>
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck size={13} />
              {stats.gradeAPct}% Agmarknet Assayed
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight pt-1">
          Zero rejection rate across 14 settled weighbridge deliveries.
        </p>
      </div>

    </div>
  );
}
