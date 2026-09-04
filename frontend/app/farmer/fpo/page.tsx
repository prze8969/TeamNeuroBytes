'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FPOCollectiveView } from '@/components/farmer/FPOCollectiveView';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { CropLot, GeoCluster } from '@/lib/types';
import { useAuth } from '@/lib/AuthContext';
import { useLocaleContext } from '@/lib/LocaleContext';

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
  const { currentLocale } = useLocaleContext();
  const [myLots, setMyLots] = useState<CropLot[]>(MOCK_LOTS);

  const handleUpdatePoolSelection = (updatedLots: CropLot[], _pooledLotIds: string[]) => {
    setMyLots(updatedLots);
  };

  const getBackText = () => {
    switch (currentLocale) {
      case 'hi': return 'डैशबोर्ड पर वापस जाएं';
      case 'mr': return 'डॅशबोर्डवर परत जा';
      case 'pa': return 'ਡੈਸ਼ਬੋਰਡ \'ਤੇ ਵਾਪਸ ਜਾਓ';
      case 'gu': return 'ડેશબોર્ડ પર પાછા જાઓ';
      case 'ta': return 'டாஷ்போர்டுக்குத் திரும்பு';
      case 'te': return 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి';
      case 'kn': return 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ';
      default: return 'Back to Dashboard';
    }
  };

  const getFpoTitle = () => {
    switch (currentLocale) {
      case 'hi': return 'एफपीओ कलेक्टिव लॉजिस्टिक्स';
      case 'mr': return 'एफपीओ एकत्रित वाहतूक समुदाय';
      case 'pa': return 'ਐਫਪੀਓ ਸਮੂਹ ਲੌਜਿਸਟਿਕਸ';
      case 'gu': return 'એફપીઓ સામૂહિક લોજિસ્ટિક્સ';
      case 'ta': return 'எஃப்பிஓ கூட்டு சரக்கு';
      case 'te': return 'ఎఫ్‌పీఓ ఉమ్మడి రవాణా';
      case 'kn': return 'ಎಫ್‌ಪಿಒ ಸಾಮೂಹಿಕ ಸರಕು ಸಾಗಣೆ';
      default: return 'FPO Collective';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
      <button onClick={() => router.push('/farmer/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-2 font-bold cursor-pointer transition-colors">
        <ArrowLeft size={16} /> {getBackText()}
      </button>

      <h1 className="text-3xl font-black text-slate-900 mb-6">{getFpoTitle()}</h1>

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
