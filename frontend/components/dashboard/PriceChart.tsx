'use client'

import { MandiPrice } from '@/lib/types';

interface PriceChartProps {
  commodity: string;
  mandiPrices: MandiPrice[];
}

export function PriceChart({ commodity, mandiPrices }: PriceChartProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Agmarknet Price Discovery & 7-Day AI Forecast</h3>
            <p className="text-xs text-slate-500">Modal price trends, market arrival volumes, and predictive price floors for {commodity}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span> Today's Modal
          </span>
          <span className="flex items-center gap-1 text-purple-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-purple-600"></span> 7-Day Forecast
          </span>
        </div>
      </div>

      {/* Visual Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {mandiPrices.map((p) => {
          const forecastDiff = (p.forecastNextWeek || p.modalPrice) - p.modalPrice;
          const isUp = forecastDiff >= 0;
          return (
            <div
              key={p.mandiName}
              className="rounded-xl bg-emerald-50/40 p-4 border border-emerald-100 space-y-2 hover:border-emerald-300 transition-all shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{p.mandiName}</h4>
                  <p className="text-[10px] text-slate-500">{p.district}, {p.state}</p>
                </div>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                  isUp
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {isUp ? `+₹${forecastDiff.toFixed(1)}/kg` : `-₹${Math.abs(forecastDiff).toFixed(1)}/kg`}
                </span>
              </div>

              <div className="pt-1 border-t border-emerald-100 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Current Modal:</span>
                  <strong className="text-emerald-700 font-mono font-bold">
                    ₹{(p.modalPrice / (p.modalPrice > 100 ? 100 : 1)).toFixed(2)}/kg
                  </strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">7D AI Forecast:</span>
                  <strong className="text-purple-700 font-mono font-bold">
                    ₹{((p.forecastNextWeek || p.modalPrice) / ((p.forecastNextWeek || p.modalPrice) > 100 ? 100 : 1)).toFixed(2)}/kg
                  </strong>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
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
