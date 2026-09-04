'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

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

export default function MarketCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string) || '';
  
  const [data, setData] = useState<MandiPriceFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/decision/agmarknet-feed`);
        if (res.ok) {
          const prices: MandiPriceFeed[] = await res.json();
          setData(prices);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, [category]);

  const filteredData = data.filter(item => 
    (item.commodity && item.commodity.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (item.market && item.market.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-slate-900 capitalize">{category} Market</h1>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder={`Search ${category}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[16px] pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B38D0]/30 shadow-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#3B38D0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, idx) => (
            <div key={`${item.commodity}-${idx}`} onClick={() => router.push(`/farmer/market/${category}/${encodeURIComponent(item.commodity)}`)} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 hover:border-[#3B38D0]/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#3B38D0] transition-colors">{item.commodity}</h3>
                  <p className="text-xs text-slate-500">{item.market} APMC</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-200">Live</span>
              </div>
              
              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Modal Price</p>
                  <p className="text-2xl font-black text-slate-900">₹{item.modal_price_kg.toFixed(2)}<span className="text-sm font-bold text-slate-400">/kg</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">7-Day Forecast</p>
                  <p className="text-base font-bold text-[#3B38D0]">₹{item.forecast_7d_modal_kg.toFixed(2)}/kg</p>
                </div>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-100 border-dashed">
              No real-time Agmarknet data found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
