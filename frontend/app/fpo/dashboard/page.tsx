'use client'

import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { Button } from '@/components/ui/button';
import { GeoCluster } from '@/lib/types';

export default function FpoDashboardPage() {
  const mockClusters: GeoCluster[] = [
    {
      id: 'CLST-01',
      clusterName: 'Nashik East Farmers Pool',
      centerLocation: { lat: 20.0063, lng: 73.8159 },
      totalLotsCount: 18,
      totalWeightKg: 45000,
      participatingFarmersCount: 14,
      estimatedFreightSavingsPercent: 32,
    },
    {
      id: 'CLST-02',
      clusterName: 'Pune-Shirur Grain Collective',
      centerLocation: { lat: 18.8286, lng: 74.3789 },
      totalLotsCount: 25,
      totalWeightKg: 78000,
      participatingFarmersCount: 22,
      estimatedFreightSavingsPercent: 26,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FPO Aggregation & Logistics Dashboard</h1>
            <p className="text-xs text-gray-500">Pooling smallholder produce for bulk buyer tenders & shared transport route optimization</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>

        {/* Aggregation Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Pooled Produce Volume</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">123 Tons</p>
            <p className="text-xs text-gray-500 mt-1">Across 2 Active Clusters</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Member Farmers</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">36 Farmers</p>
            <p className="text-xs text-gray-500 mt-1">Nashik & Pune Districts</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Avg. Freight Cost Reduction</p>
            <p className="text-3xl font-extrabold text-blue-600 mt-1">29% Saved</p>
            <p className="text-xs text-gray-500 mt-1">Geo-clustered transport pooling</p>
          </div>
        </div>

        {/* Cluster Map Component */}
        <ClusterMap clusters={mockClusters} onSelectCluster={(c) => alert(`Selected ${c.clusterName}: ${c.totalWeightKg / 1000} Tons pooled.`)} />

        {/* FPO Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Create Bulk Tender for Millers</h3>
            <p className="text-xs text-gray-500">Combine Grade A Wheat lots from Nashik East cluster into a single 45-ton bid tender</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            Publish FPO Bulk Tender
          </Button>
        </div>
      </div>
    </div>
  );
}
