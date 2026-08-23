'use client'

import { GeoCluster } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ClusterMapProps {
  clusters: GeoCluster[];
  onSelectCluster?: (cluster: GeoCluster) => void;
}

export function ClusterMap({ clusters, onSelectCluster }: ClusterMapProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Geo-Clustering & Shared Logistics Map</h3>
          <p className="text-xs text-gray-500">Optimizing post-harvest pooling & freight cost reduction</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          FPO Aggregation Active
        </span>
      </div>

      {/* Mock Map Canvas */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-emerald-900/10 p-4 border border-emerald-200 flex flex-col justify-between">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-900 bg-white/80 backdrop-blur px-3 py-1.5 rounded-md font-medium">
          <span>📍 District: Nashik & Pune Aggregation Zones</span>
          <span className="font-bold text-emerald-700">Freight Cost Saved: ~28%</span>
        </div>

        {/* Mock Cluster Nodes */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 my-auto">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => onSelectCluster && onSelectCluster(cluster)}
              className="cursor-pointer rounded-md bg-white p-3 shadow border border-emerald-300 hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-900">{cluster.clusterName}</h4>
                <span className="text-xs font-bold text-emerald-600">-{cluster.estimatedFreightSavingsPercent}% Freight</span>
              </div>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>👨‍🌾 Participating Farmers: <span className="font-medium text-gray-900">{cluster.participatingFarmersCount}</span></p>
                <p>📦 Pooled Weight: <span className="font-medium text-gray-900">{(cluster.totalWeightKg / 1000).toFixed(1)} Tons</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex justify-end">
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
            Generate Transport Route
          </Button>
        </div>
      </div>
    </div>
  );
}
