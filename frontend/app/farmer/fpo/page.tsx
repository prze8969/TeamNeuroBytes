'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FPOCollectiveView } from '@/components/farmer/FPOCollectiveView';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { CropLot, GeoCluster } from '@/lib/types';
import { useAuth } from '@/lib/AuthContext';

const MOCK_LOTS: CropLot[] = [
  {
    id: 'LOT-101',
    farmerId: '1',
    farmerName: 'Ramesh Patil',
    cropName: 'Sharbati Wheat',
    variety: 'MP Premium',
    quantityKg: 5000,
    quantityTons: 5.0,
    grade: 'A',
    qualityGrade: 'Grade A',
    qualityScore: 94.2,
    basePricePerKg: 24.50,
    askingFloorPerKg: 24.50,
    mandiAvgPerKg: 25.50,
    freightPerKg: 1.20,
    origin: 'Nashik East Cluster, Maharashtra',
    distanceKm: 38,
    harvestDate: '2026-08-20',
    status: 'BID_ACCEPTED',
    is_fpo_pooled: true,
    isPooled: true,
    fpo_collective_name: 'Nashik East Farmers Producer Company',
    logisticsType: 'Shared Freight',
    location: { lat: 20.0120, lng: 73.7950, district: 'Nashik', state: 'Maharashtra' },
    defectPercentage: 1.2,
    defectArea: 1.2,
    ripenessIndex: 96.5,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
  }
];

const mockClusters: GeoCluster[] = [
  {
    id: 'c1',
    clusterName: 'Nashik East Pool',
    centerLocation: { lat: 20.0120, lng: 73.7950 },
    totalLotsCount: 5,
    totalWeightKg: 145000,
    participatingFarmersCount: 12,
    estimatedFreightSavingsPercent: 35.1
  }
];

export default function FpoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [myLots, setMyLots] = useState<CropLot[]>(MOCK_LOTS);

  const handleUpdatePoolSelection = (updatedLots: CropLot[], _pooledLotIds: string[]) => {
    setMyLots(updatedLots);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
      <button onClick={() => router.push('/farmer/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-2 font-bold cursor-pointer">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-black text-slate-900 mb-6">FPO Collective</h1>

      <div className="space-y-6">
        <FPOCollectiveView
          activeLots={myLots}
          onUpdatePoolSelection={handleUpdatePoolSelection}
          onNavigateToTab={(tab) => {
            if (tab === 'list-crop') router.push('/farmer/dashboard');
          }}
        />
        <ClusterMap clusters={mockClusters} />
      </div>
    </div>
  );
}
