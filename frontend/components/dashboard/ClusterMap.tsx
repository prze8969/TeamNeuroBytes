'use client'

import { GeoCluster } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ClusterMapProps {
  clusters: GeoCluster[];
  onSelectCluster?: (cluster: GeoCluster) => void;
}

export function ClusterMap({ clusters, onSelectCluster }: ClusterMapProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">PostGIS Spatial Freight Pooling & Milk-Run Map</h3>
            <p className="text-xs text-slate-500">10-km radius smallholder aggregation & shared transport routing</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold font-mono">
          FPO Aggregator Active
        </span>
      </div>

      {/* Modern Map Canvas */}
      <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-5 border border-emerald-800 flex flex-col justify-between shadow-inner">
        {/* Radial Map Grid Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-900">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            📍 Active Zones: Nashik East & Pune-Shirur Belt
          </span>
          <span className="font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-600">
            Avg. Freight Saved: ~31.5%
          </span>
        </div>

        {/* Interactive Cluster Nodes */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
          {clusters.map((cluster) => {
            const progressPercent = Math.min(Math.round((cluster.totalWeightKg / 50000) * 100), 100);
            return (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster && onSelectCluster(cluster)}
                className="cursor-pointer rounded-xl bg-white/95 text-slate-900 p-4 shadow-lg border border-emerald-200 hover:border-emerald-500 transition-all hover:scale-[1.01] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                    {cluster.clusterName}
                  </h4>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                    -{cluster.estimatedFreightSavingsPercent}% Freight
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                  <p>👨‍🌾 Farmers: <strong className="text-slate-900">{cluster.participatingFarmersCount}</strong></p>
                  <p>📦 Pooled: <strong className="text-emerald-700">{(cluster.totalWeightKg / 1000).toFixed(1)} Tons</strong></p>
                </div>

                {/* Progress towards full truckload (50 Tons) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Truck Capacity Target (50 Tons)</span>
                    <span className="text-emerald-700">{progressPercent}% Pooled</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-emerald-900">
          <span>OpenRouteService Milk-Run Matrix: Active</span>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold h-8 px-4 shadow-md">
            Generate Bulk Route Manifest 🚚
          </Button>
        </div>
      </div>
    </div>
  );
}
