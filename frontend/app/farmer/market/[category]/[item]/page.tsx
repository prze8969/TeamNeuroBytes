'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { SellVsWaitCard } from '@/components/dashboard/SellVsWaitCard';

interface MandiPriceFeed {
  commodity: string;
  market: string;
  state: string;
  modal_price_kg: number;
  min_price_kg: number;
  max_price_kg: number;
  forecast_7d_modal_kg: number;
  arrival_date: string;
  grade?: string;
  variety?: string;
}

export default function MarketItemPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string) || '';
  const item = decodeURIComponent((params.item as string) || '');
  
  const [itemData, setItemData] = useState<MandiPriceFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/decision/agmarknet-feed`);
        if (res.ok) {
          const prices: MandiPriceFeed[] = await res.json();
          const match = prices.find(p => p.commodity.toLowerCase() === item.toLowerCase());
          if (match) setItemData(match);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [item]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold cursor-pointer">
        <ArrowLeft size={16} /> Back to {category}
      </button>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#3B38D0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : itemData ? (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <TrendingUp size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{itemData.commodity}</h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-xl border border-blue-200">
                {itemData.market} APMC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Price (Modal)</p>
                <p className="text-3xl font-black text-slate-900">₹{(itemData.modal_price_kg || 0).toFixed(2)}<span className="text-sm text-slate-500">/kg</span></p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Highest Price (Max)</p>
                <p className="text-3xl font-black text-emerald-700">₹{(itemData.max_price_kg || itemData.modal_price_kg || 0).toFixed(2)}<span className="text-sm text-emerald-600/60">/kg</span></p>
              </div>
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                <p className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mb-1">Lowest Price (Min)</p>
                <p className="text-3xl font-black text-rose-700">₹{(itemData.min_price_kg || itemData.modal_price_kg || 0).toFixed(2)}<span className="text-sm text-rose-600/60">/kg</span></p>
              </div>
            </div>
          </div>

          {/* AI Decision Engine (Sell vs Wait) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <SellVsWaitCard />
          </div>

          {/* Price Graph */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-[#3B38D0]" size={24} />
              <h2 className="text-xl font-bold text-slate-900">7-Day Price Forecast Analysis</h2>
            </div>
            
            {/* The PriceChart component usually takes mock data or fetches internally in this codebase. We pass the commodity name */}
            <PriceChart commodity={itemData.commodity} mandiPrices={[]} />
          </div>
          
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <AlertCircle className="text-slate-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Item Not Found</h2>
          <p className="text-slate-500">We couldn't find live Agmarknet data for this specific item.</p>
        </div>
      )}
    </div>
  );
}
