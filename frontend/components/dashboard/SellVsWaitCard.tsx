'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/LocaleContext';

export function SellVsWaitCard() {
  const t = useTranslations('sellVsWait');

  const [commodity, setCommodity] = useState('Wheat');
  const [weightKg, setWeightKg] = useState(5000);
  const [currentPrice, setCurrentPrice] = useState(25.50);
  const [forecastPrice, setForecastPrice] = useState(27.80);
  const [holdDays, setHoldDays] = useState(7);

  // Dynamic calculations
  const immediateRevenue = Math.round(weightKg * currentPrice);
  const quintals = weightKg / 100;
  
  const decayRatePerDay = commodity === 'Tomato' ? 3.8 : commodity === 'Onion' ? 0.65 : 0.04;
  const storageCostPerQuintalDay = commodity === 'Tomato' ? 6.5 : commodity === 'Onion' ? 3.0 : 1.2;

  const totalDecayPercent = Math.min(decayRatePerDay * holdDays, 40);
  const lostWeightKg = Math.round((totalDecayPercent / 100) * weightKg);
  const retainedWeightKg = weightKg - lostWeightKg;
  const storageCost = Math.round(quintals * storageCostPerQuintalDay * holdDays);
  const valueAtRisk = Math.round(lostWeightKg * currentPrice);

  const futureGrossRevenue = Math.round(retainedWeightKg * forecastPrice);
  const netFutureRevenue = futureGrossRevenue - storageCost;
  const netGainOrLoss = netFutureRevenue - immediateRevenue;

  const recommendation = netGainOrLoss > 1200 ? 'WAIT_AND_HOLD' : netGainOrLoss < -500 ? 'SELL_IMMEDIATELY' : 'POOL_IN_FPO';

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">{t('title')}</h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase border border-emerald-200">
                {t('badge')}
              </span>
            </div>
            <p className="text-xs text-slate-500">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">{t('commodity')}</label>
          <select
            className="w-full text-xs h-10 rounded-lg border border-emerald-200 bg-white px-3 font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          >
            <option value="Wheat">Wheat (Grain)</option>
            <option value="Onion">Nashik Red Onion</option>
            <option value="Tomato">Tomato (Perishable)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">{t('lotWeight')}</label>
          <Input
            type="number"
            className="bg-white border-emerald-200 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">{t('todayModal')}</label>
          <Input
            type="number"
            step="0.5"
            className="bg-white border-emerald-200 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">{t('holdPeriod')}</label>
          <Input
            type="number"
            className="bg-white border-emerald-200 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
            value={holdDays}
            onChange={(e) => setHoldDays(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Decision Metric Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('sellToday')}</span>
          <p className="text-2xl font-black text-slate-900">₹{immediateRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500">{t('immediateRealisation')} ₹{currentPrice}/kg</p>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">{t('holdingCost')}</span>
          <p className="text-2xl font-black text-rose-600">-₹{(storageCost + valueAtRisk).toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-rose-700">{t('storageCost')} ₹{storageCost} • {t('decay')} {lostWeightKg} kg (-₹{valueAtRisk})</p>
        </div>

        <div className={`rounded-xl border p-4 space-y-1 ${
          recommendation === 'WAIT_AND_HOLD'
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-amber-300 bg-amber-50'
        }`}>
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">{t('projectedFuture')}</span>
          <p className="text-2xl font-black text-emerald-700">₹{netFutureRevenue.toLocaleString('en-IN')}</p>
          <p className={`text-xs font-bold ${netGainOrLoss >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
            {netGainOrLoss >= 0 ? `+₹${netGainOrLoss.toLocaleString('en-IN')} ${t('netGain')}` : `-₹${Math.abs(netGainOrLoss).toLocaleString('en-IN')} ${t('netLoss')}`}
          </p>
        </div>
      </div>

      {/* Actionable Strategy Recommendation Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">{t('strategyRecommendation')}</span>
            <span className="rounded-full bg-emerald-400 text-slate-950 px-3 py-0.5 text-xs font-black uppercase tracking-tight">
              {recommendation.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            {recommendation === 'WAIT_AND_HOLD'
              ? `Holding for ${holdDays} days covers ₹${storageCost} cold storage fees and yields an estimated +₹${netGainOrLoss.toLocaleString('en-IN')} net gain from the rising Agmarknet price trajectory.`
              : recommendation === 'SELL_IMMEDIATELY'
              ? `Perishability decay and holding fees exceed expected price increases. Sell immediately at current mandi modal price.`
              : `Price margins are tight. Best move is to pool produce in local FPO cluster to save ~30% in freight charges.`}
          </p>
        </div>
        <Button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs h-10 px-5 shadow-md whitespace-nowrap cursor-pointer">
          {t('applyToLot')}
        </Button>
      </div>
    </div>
  );
}
