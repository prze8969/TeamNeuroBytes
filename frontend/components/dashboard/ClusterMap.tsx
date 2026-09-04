'use client'

import React from 'react';
import { GeoCluster } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

interface ClusterMapProps {
  clusters: GeoCluster[];
  onSelectCluster?: (cluster: GeoCluster) => void;
}

export function ClusterMap({ clusters, onSelectCluster }: ClusterMapProps) {
  const { currentLocale } = useLocaleContext();
  const TRUCK_CAPACITY_KG = 45000; // Standardized 45 MT capacity target

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {currentLocale === 'hi' ? 'स्थानिक मालभाड़ा पूलिंग एवं मिल्क-रन रूट मैप'
                : currentLocale === 'mr' ? 'स्थानिक मालवाहतूक एकत्रीकरण आणि मिल्क-रन मार्ग नकाशा'
                : currentLocale === 'pa' ? 'ਸਥਾਨਕ ਮਾਲ-ਭਾੜਾ ਪੂਲਿੰਗ ਅਤੇ ਮਿਲਕ-ਰਨ ਰੂਟ ਨਕਸ਼ਾ'
                : 'PostGIS Spatial Freight Pooling & Milk-Run Map'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentLocale === 'hi' ? '१० किमी दायरे में छोटे किसानों का एकत्रीकरण एवं साझा परिवहन'
                : currentLocale === 'mr' ? '१० किमी अंतरातील शेतकरी एकत्रीकरण आणि सामायिक वाहतूक'
                : currentLocale === 'pa' ? '੧੦ ਕਿਮੀ ਦੇ ਘੇਰੇ ਵਿੱਚ ਛੋਟੇ ਕਿਸਾਨਾਂ ਦਾ ਇਕੱਠ ਅਤੇ ਸਾਂਝੀ ਆਵਾਜਾਈ'
                : '10-km radius smallholder aggregation & shared transport routing'}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold font-mono">
          {currentLocale === 'hi' ? 'एफपीओ एग्रीगेटर सक्रिय'
            : currentLocale === 'mr' ? 'एफपीओ एकत्रित सक्रिय'
            : currentLocale === 'pa' ? 'FPO ਐਗਰੀਗੇਟਰ ਕਿਰਿਆਸ਼ੀਲ'
            : 'FPO Aggregator Active'}
        </span>
      </div>

      {/* Modern Map Canvas */}
      <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-5 border border-emerald-800 flex flex-col justify-between shadow-inner">
        {/* Radial Map Grid Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-900">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            📍 {currentLocale === 'hi' ? 'सक्रिय क्षेत्र: नासिक ईस्ट एवं पुणे-शिरूर बेल्ट'
              : currentLocale === 'mr' ? 'सक्रिय क्षेत्र: नाशिक ईस्ट आणि पुणे-शिरूर पट्टा'
              : currentLocale === 'pa' ? 'ਸਰਗਰਮ ਖੇਤਰ: ਨਾਸਿਕ ਈਸਟ ਅਤੇ ਪੁਣੇ-ਸ਼ਿਰੂਰ ਬੈਲਟ'
              : 'Active Zones: Nashik East & Pune-Shirur Belt'}
          </span>
          <span className="font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-600 font-mono">
            {currentLocale === 'hi' ? `औसत मालभाड़ा बचत: ~${toLocalizedDigits(31.5, currentLocale)}%`
              : currentLocale === 'mr' ? `सरासरी वाहतूक बचत: ~${toLocalizedDigits(31.5, currentLocale)}%`
              : currentLocale === 'pa' ? `ਔਸਤ ਮਾਲ-ਭਾੜਾ ਬਚਤ: ~${toLocalizedDigits(31.5, currentLocale)}%`
              : 'Avg. Freight Saved: ~31.5%'}
          </span>
        </div>

        {/* Interactive Cluster Nodes */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
          {clusters.map((cluster) => {
            const progressPercent = Math.round((cluster.totalWeightKg / TRUCK_CAPACITY_KG) * 100);
            const isOverflow = progressPercent > 100;
            const farmerCountLabel = cluster.id === 'CLST-01'
              ? (currentLocale === 'hi' ? `१४ अन्य किसान + आप (१५ नामांकित)`
                : currentLocale === 'mr' ? `१४ इतर शेतकरी + तुम्ही (१५ समाविष्ट)`
                : currentLocale === 'pa' ? `੧੪ ਹੋਰ ਕਿਸਾਨ + ਤੁਸੀਂ (੧੫ ਸ਼ਾਮਲ)`
                : '14 other farmers + you (15 Enrolled)')
              : (currentLocale === 'hi' ? `${toLocalizedDigits(cluster.participatingFarmersCount, currentLocale)} किसान नामांकित`
                : currentLocale === 'mr' ? `${toLocalizedDigits(cluster.participatingFarmersCount, currentLocale)} शेतकरी समाविष्ट`
                : currentLocale === 'pa' ? `${toLocalizedDigits(cluster.participatingFarmersCount, currentLocale)} ਕਿਸਾਨ ਸ਼ਾਮਲ`
                : `${cluster.participatingFarmersCount} Farmers Enrolled`);

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster && onSelectCluster(cluster)}
                className="cursor-pointer rounded-xl bg-white/95 text-slate-900 p-4 shadow-lg border border-emerald-200 hover:border-emerald-500 transition-all hover:scale-[1.01] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                    {currentLocale === 'hi' && cluster.clusterName === 'Nashik East Pool' ? 'नासिक ईस्ट पूल'
                      : currentLocale === 'mr' && cluster.clusterName === 'Nashik East Pool' ? 'नाशिक ईस्ट पूल'
                      : currentLocale === 'pa' && cluster.clusterName === 'Nashik East Pool' ? 'ਨਾਸਿਕ ਈਸਟ ਪੂਲ'
                      : cluster.clusterName}
                  </h4>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono">
                    -{toLocalizedDigits(cluster.estimatedFreightSavingsPercent, currentLocale)}% {currentLocale === 'hi' ? 'मालभाड़ा' : currentLocale === 'mr' ? 'वाहतूक' : currentLocale === 'pa' ? 'ਭਾੜਾ' : 'Freight'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                  <p className="truncate">👨‍🌾 <strong className="text-slate-900">{farmerCountLabel}</strong></p>
                  <p>📦 {currentLocale === 'hi' ? 'पूल्ड:' : currentLocale === 'mr' ? 'एकत्रित:' : currentLocale === 'pa' ? 'ਪੂਲ:' : 'Pooled:'} <strong className="text-emerald-700 font-mono">{toLocalizedDigits((cluster.totalWeightKg / 1000).toFixed(1), currentLocale)} {currentLocale === 'hi' ? 'मीट्रिक टन' : currentLocale === 'mr' ? 'मेट्रिक टन' : 'MT'}</strong></p>
                </div>

                {/* Progress towards full truckload (45 Tons) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>{currentLocale === 'hi' ? `ट्रक क्षमता लक्ष्य (${toLocalizedDigits(45, currentLocale)} टन)`
                      : currentLocale === 'mr' ? `ट्रक क्षमता लक्ष्य (${toLocalizedDigits(45, currentLocale)} टन)`
                      : currentLocale === 'pa' ? `ਟਰੱਕ ਸਮਰੱਥਾ ਟੀਚਾ (${toLocalizedDigits(45, currentLocale)} ਟਨ)`
                      : 'Truck Capacity Target (45 Tons)'}</span>
                    <span className={`font-mono ${isOverflow ? 'text-amber-600 font-black' : 'text-emerald-700'}`}>
                      {toLocalizedDigits(progressPercent, currentLocale)}% {isOverflow 
                        ? (currentLocale === 'hi' ? '(अतिरिक्त)' : '(Overflow)')
                        : (currentLocale === 'hi' ? 'पूल्ड' : currentLocale === 'mr' ? 'एकत्रित' : 'Pooled')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverflow 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-300 pt-2 border-t border-emerald-900">
          <span>{currentLocale === 'hi' ? 'ओपनरूटसर्विस मिल्क-रन मैट्रिक्स: सक्रिय'
            : currentLocale === 'mr' ? 'ओपनरूटसर्व्हिस मिल्क-रन मॅट्रिक्स: सक्रिय'
            : currentLocale === 'pa' ? 'ਓਪਨਰੂਟਸਰਵਿਸ ਮਿਲਕ-ਰਨ ਮੈਟ੍ਰਿਕਸ: ਕਿਰਿਆਸ਼ੀਲ'
            : 'OpenRouteService Milk-Run Matrix: Active'}</span>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold h-8 px-4 shadow-md cursor-pointer">
            {currentLocale === 'hi' ? 'थोक रूट घोषणापत्र तैयार करें 🚚'
              : currentLocale === 'mr' ? 'थोक मार्ग मॅनिफेस्ट तयार करा 🚚'
              : currentLocale === 'pa' ? 'ਥੋਕ ਰੂਟ ਮੈਨੀਫੈਸਟ ਤਿਆਰ ਕਰੋ 🚚'
              : 'Generate Bulk Route Manifest 🚚'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClusterMap;
