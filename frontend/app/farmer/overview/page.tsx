'use client';

import React, { useState } from 'react';
import { 
  Microscope, 
  TrendingUp, 
  ShieldCheck, 
  Truck,
} from 'lucide-react';
import { useTranslations, useCropTranslation } from '@/lib/LocaleContext';
import { useAuth } from '@/lib/AuthContext';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { BidTable } from '@/components/dashboard/BidTable';
import { EscrowTracker } from '@/components/dashboard/EscrowTracker';
import { Bid, CropLot } from '@/lib/types';
import { resolveCropImageUrl } from '@/lib/assayData';

// Re-using mock data from layout for the presentation layer 
// (In production this would fetch from an API)
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

const mockBids: Bid[] = [
  {
    id: 'BID-991',
    lotId: 'LOT-101',
    buyerId: '2',
    buyerName: 'ITC Agri Business',
    amountPerKg: 26.50,
    totalAmount: 132500,
    escrowStatus: 'LOCKED',
    createdAt: '2026-08-26T10:30:00Z'
  }
];

export default function FarmerOverviewPage() {
  const { user } = useAuth();
  const tDash = useTranslations('dashboard');
  const tKpi = useTranslations('kpi');
  
  const [bids] = useState<Bid[]>(mockBids);
  const [myLots] = useState<CropLot[]>(MOCK_LOTS);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);

  const totalLots = myLots.length;
  const portfolioGrade = 'A';
  const avgQualityScore = 94.2;
  const highestBid = Math.max(...bids.map(b => b.amountPerKg), 0);
  const highestBidBuyer = bids.find(b => b.amountPerKg === highestBid)?.buyerName || '';
  const totalEscrowLocked = bids.filter(b => b.escrowStatus === 'LOCKED').reduce((sum, b) => sum + b.totalAmount, 0);
  const pooledCount = myLots.filter(l => l.is_fpo_pooled || l.isPooled).length;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Farm Overview</h1>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: AI Quality Grade */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {tKpi('aiQualityGrade')}
              </span>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Portfolio
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Microscope size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-900">{portfolioGrade}</p>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-700 font-bold font-mono">
                {totalLots > 0 ? `${avgQualityScore}% Quality Score` : 'No Scans'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{tKpi('aiVerified')}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Highest Market Bid */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {tKpi('highestActiveBid')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {highestBid > 0 ? `₹${highestBid.toFixed(2)}/kg` : '₹0.00'}
            </p>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-blue-700 font-bold font-mono">
                {highestBid > 0 ? `+₹${Math.max(0, highestBid - 24.50).toFixed(2)}/kg ${tKpi('aboveFloor')}` : 'No Active Bids'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]" title={highestBidBuyer}>
                {highestBidBuyer}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Escrow Security */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {tKpi('escrowSecurity')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-900">
              {totalEscrowLocked > 0 ? tKpi('locked100') : '₹0 Guarantee'}
            </p>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-700 font-bold font-mono">
                {totalEscrowLocked > 0 ? `₹${totalEscrowLocked.toLocaleString('en-IN')} ${tKpi('guarantee')}` : 'No Escrow'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{tKpi('rbiCompliantEscrow')}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: FPO Logistics Savings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {tKpi('freightPooling')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700 shadow-2xs">
              <Truck size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-900">
              {pooledCount > 0 ? `-35.1% ${tKpi('costSavings')}` : totalLots > 0 ? tKpi('individual') : 'No FPO Enrolled'}
            </p>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-purple-700 font-bold font-mono">
                {pooledCount > 0 ? 'Nashik East Pool' : totalLots > 0 ? '₹1.85/kg Solo' : 'Enroll produce'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{tKpi('sharedDeliveryRoute')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Trackers */}
      <div className="space-y-6">
        <PriceChart commodity={myLots[0]?.cropName || 'Sharbati Wheat'} mandiPrices={[]} />

        <BidTable
          bids={bids}
          lots={myLots}
          isFarmerView={true}
          onAcceptBid={() => {}}
          onRejectBid={() => {}}
          onTrackOrder={(id) => setSelectedOrderId(parseInt(id.replace(/\D/g, ''), 10))}
        />

        <EscrowTracker 
          activeCropName={myLots[0]?.cropName ? `${myLots[0].cropName} (${(myLots[0].quantityKg/1000).toFixed(1)} MT)` : undefined} 
          acceptedBids={bids.filter(b => b.escrowStatus === 'LOCKED')}
          lots={myLots}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
        />
      </div>
    </div>
  );
}
