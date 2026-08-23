'use client'

import { MandiPrice } from '@/lib/types';

interface PriceChartProps {
  commodity: string;
  mandiPrices: MandiPrice[];
}

export function PriceChart({ commodity, mandiPrices }: PriceChartProps) {
  const currentPrice = mandiPrices[0]?.modalPrice || 2450;
  const forecastPrice = mandiPrices[0]?.forecastNextWeek || 2680;
  const priceDiff = forecastPrice - currentPrice;
  const diffPercent = ((priceDiff / currentPrice) * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Agmarknet Price & AI Forecast</h3>
          <p className="text-xs text-gray-500">Real-time Mandi APMC rates for {commodity}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">AI 7-Day Forecast</p>
          <p className="text-sm font-bold text-emerald-600">
            ₹{forecastPrice}/qtl ({priceDiff >= 0 ? `+${diffPercent}%` : `${diffPercent}%`})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
          <p className="text-xs text-gray-500">Min Price</p>
          <p className="text-base font-semibold text-gray-800">₹{mandiPrices[0]?.minPrice || 2100}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-center border border-emerald-100">
          <p className="text-xs text-emerald-700 font-medium">Modal Price (Today)</p>
          <p className="text-lg font-bold text-emerald-900">₹{currentPrice}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
          <p className="text-xs text-gray-500">Max Price</p>
          <p className="text-base font-semibold text-gray-800">₹{mandiPrices[0]?.maxPrice || 2750}</p>
        </div>
      </div>

      {/* Visual Trend Bars */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-semibold text-gray-700">Mandi Price Comparison (₹/Quintal)</p>
        {mandiPrices.map((item, idx) => (
          <div key={idx} className="flex items-center text-xs space-x-2">
            <span className="w-24 text-gray-600 truncate">{item.mandiName}</span>
            <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden flex items-center px-2">
              <div
                className="bg-emerald-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(100, (item.modalPrice / 3000) * 100)}%` }}
              ></div>
            </div>
            <span className="w-16 font-bold text-gray-900 text-right">₹{item.modalPrice}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
