'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Microscope, 
  TrendingUp, 
  Truck, 
  ArrowRight, 
  Boxes, 
  Sparkles,
  MessageSquare,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ProduceCard } from '@/components/farmer/ProduceCard';
import { ListNewCropModal } from '@/components/farmer/ListNewCropModal';
import { FPOCollectiveView } from '@/components/farmer/FPOCollectiveView';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { BidTable } from '@/components/dashboard/BidTable';
import { API_BASE_URL } from '@/lib/api';
import { EscrowTracker } from '@/components/dashboard/EscrowTracker';
import { AIGradingCard } from '@/components/dashboard/AIGradingCard';
import { SellVsWaitCard } from '@/components/dashboard/SellVsWaitCard';
import { WhatsAppSimulatorModal } from '@/components/dashboard/WhatsAppSimulatorModal';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { resolveCropImageUrl } from '@/lib/assayData';
import { Bid, MandiPrice, GeoCluster, CropLot } from '@/lib/types';
import { useTranslations, useCropTranslation } from '@/lib/LocaleContext';

export function FarmerDashboardLayout() {
  const tDash = useTranslations('dashboard');
  const tKpi = useTranslations('kpi');
  const tFpo = useTranslations('fpo');
  const tList = useTranslations('listings');
  const tEscrow = useTranslations('escrow');
  const tCrop = useCropTranslation();

  const [activeTab, setActiveTab] = useState<'overview' | 'fpo-pooling' | 'ai-grading' | 'decision-engine' | 'whatsapp-bot' | 'escrow'>('overview');
  const [isPooled, setIsPooled] = useState<boolean>(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myLots, setMyLots] = useState<CropLot[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [lotToDelete, setLotToDelete] = useState<{ id: string; cropName: string } | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const defaultBids: Bid[] = [
    {
      id: 'BID-101',
      lotId: 'LOT-101',
      buyerId: '2',
      buyerName: 'Sahyadri Farms Trading Co.',
      amountPerKg: 26.50,
      totalAmount: 132500,
      escrowStatus: 'LOCKED',
      createdAt: '2026-08-25 14:15',
    },
    {
      id: 'BID-102',
      lotId: 'LOT-101',
      buyerId: '3',
      buyerName: 'AgroProcure Private Ltd',
      amountPerKg: 25.80,
      totalAmount: 129000,
      escrowStatus: 'INITIATED',
      createdAt: '2026-08-25 15:30',
    },
    {
      id: 'BID-103',
      lotId: 'LOT-102',
      buyerId: '4',
      buyerName: 'Vashi Fresh Distributors',
      amountPerKg: 22.40,
      totalAmount: 179200,
      escrowStatus: 'INITIATED',
      createdAt: '2026-08-25 16:10',
    },
    {
      id: 'BID-104',
      lotId: 'LOT-102',
      buyerId: '5',
      buyerName: 'Nashik Agro Exports',
      amountPerKg: 21.80,
      totalAmount: 174400,
      escrowStatus: 'INITIATED',
      createdAt: '2026-08-25 16:45',
    }
  ];

  const defaultLots: CropLot[] = [
    {
      id: 'LOT-101',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Wheat',
      variety: 'Sharbati Lot-1',
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
      location: { lat: 20.0125, lng: 73.7910, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 1.8,
      defectArea: 1.8,
      ripenessIndex: 94.0,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'LOT-102',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Onion',
      variety: 'Red Nashik',
      quantityKg: 8000,
      quantityTons: 8.0,
      grade: 'A',
      qualityGrade: 'Grade A',
      qualityScore: 92.0,
      basePricePerKg: 21.00,
      askingFloorPerKg: 21.00,
      mandiAvgPerKg: 21.50,
      freightPerKg: 1.20,
      origin: 'Lasalgaon Hub, Maharashtra',
      distanceKm: 42,
      harvestDate: '2026-08-22',
      status: 'BID_ACCEPTED',
      is_fpo_pooled: true,
      isPooled: true,
      fpo_collective_name: 'Nashik East Farmers Producer Company',
      logisticsType: 'Shared Freight',
      location: { lat: 20.1485, lng: 74.2274, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 2.1,
      defectArea: 2.1,
      ripenessIndex: 92.0,
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleDeleteLot = (lotId: string, cropName: string) => {
    setLotToDelete({ id: lotId, cropName });
  };

  const confirmDeleteLot = async (lotId: string, cropName: string) => {
    // Optimistic UI update
    setMyLots(prev => prev.filter(l => l.id !== lotId));

    try {
      const numericId = parseInt(lotId.replace(/\D/g, ''), 10);
      if (numericId && !lotId.startsWith('LOT-2026-')) {
        await fetch(`${API_BASE_URL}/api/marketplace/lots/${numericId}`, {
          method: 'DELETE'
        });
      }

      const saved = localStorage.getItem('kisansetu_crop_lots');
      if (saved) {
        const currentLots = JSON.parse(saved);
        const filtered = currentLots.filter((l: any) => l.id !== lotId);
        localStorage.setItem('kisansetu_crop_lots', JSON.stringify(filtered));
      }

      const deletedSaved = localStorage.getItem('kisansetu_deleted_lot_ids');
      const deletedIds: string[] = deletedSaved ? JSON.parse(deletedSaved) : [];
      if (!deletedIds.includes(lotId)) {
        deletedIds.push(lotId);
        localStorage.setItem('kisansetu_deleted_lot_ids', JSON.stringify(deletedIds));
      }

      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    triggerToast(`🗑️ Lot ${lotId} (${cropName}) delisted and removed.`);
  };

  const fetchLiveBidsAndLots = async () => {
    let localLots: CropLot[] = [];
    let deletedIds: string[] = [];
    let pooledIds: string[] = [];

    try {
      const deletedSaved = localStorage.getItem('kisansetu_deleted_lot_ids');
      if (deletedSaved) deletedIds = JSON.parse(deletedSaved);
    } catch {}

    try {
      const pooledSaved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (pooledSaved) pooledIds = JSON.parse(pooledSaved);
    } catch {}

    // 1. Sync from localStorage
    try {
      const savedLots = localStorage.getItem('kisansetu_crop_lots');
      if (savedLots) {
        const parsed = JSON.parse(savedLots);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLots = parsed
            .filter((l: any) => !deletedIds.includes(l.id))
            .map((l: any) => {
              const isLotPooled = pooledIds.includes(l.id) || l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED';
              return {
                ...l,
                status: l.status === 'POOLED' ? 'LISTED' : (l.status || 'LISTED'),
                is_fpo_pooled: isLotPooled,
                isPooled: isLotPooled,
                fpo_collective_name: isLotPooled ? 'Nashik East Farmers Producer Company' : undefined,
                imageUrl: resolveCropImageUrl(l.cropName || l.commodity, l.imageUrl || l.image_url)
              };
            });
        }
      }
    } catch {}

    // 2. Fetch from backend API
    try {
      const [bidsRes, lotsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/marketplace/bids`),
        fetch(`${API_BASE_URL}/api/marketplace/lots`)
      ]);

      if (bidsRes.ok) {
        const rawBids = await bidsRes.json();
        if (Array.isArray(rawBids) && rawBids.length > 0) {
          const buyerNames = ['Sahyadri Farms Trading Co.', 'AgroProcure Private Ltd', 'Vashi Fresh Distributors', 'Nashik Agro Exports'];
          const mappedBids: Bid[] = rawBids.map((b: any, idx: number) => ({
            id: `BID-${b.id || idx + 101}`,
            lotId: `LOT-${b.lot_id || 101}`,
            buyerId: String(b.buyer_id || idx + 2),
            buyerName: (b.buyer_name && b.buyer_name !== 'Buyer') ? b.buyer_name : buyerNames[idx % buyerNames.length],
            amountPerKg: b.amount_per_kg,
            totalAmount: b.total_amount,
            escrowStatus: b.status === 'ACCEPTED' ? 'LOCKED' : b.status === 'REJECTED' ? 'RELEASED' : 'INITIATED',
            createdAt: b.created_at ? b.created_at.replace('T', ' ').slice(0, 16) : '2026-08-25 15:10'
          }));
          setBids(prev => JSON.stringify(prev) === JSON.stringify(mappedBids) ? prev : mappedBids);
        } else {
          setBids(prev => JSON.stringify(prev) === JSON.stringify(defaultBids) ? prev : defaultBids);
        }
      }

      if (lotsRes.ok) {
        const rawLots = await lotsRes.json();
        if (Array.isArray(rawLots) && rawLots.length > 0) {
          const mappedLots: CropLot[] = rawLots
            .filter((l: any) => !deletedIds.includes(`LOT-${l.id}`) && !deletedIds.includes(String(l.id)))
            .map((l: any) => {
              const cropTitle = l.commodity || l.crop_name || 'Wheat';
              const lotId = `LOT-${l.id}`;
              const isLotPooled = pooledIds.includes(lotId) || pooledIds.includes(String(l.id)) || l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED';
              return {
                id: lotId,
                farmerId: String(l.farmer_id || 1),
                farmerName: l.farmer_name || 'Ramesh Patil',
                cropName: cropTitle,
                variety: l.variety || 'Standard Hybrid',
                quantityKg: l.quantity_kg || 5000,
                grade: ((l.quality_grade || l.grade || 'A').toString().includes('REJECT') ? 'REJECTED' : (l.quality_grade || l.grade || 'A').toString().includes('C') ? 'C' : (l.quality_grade || l.grade || 'A').toString().includes('B') ? 'B' : 'A') as any,
                qualityGrade: ((l.quality_grade || l.grade || 'A').toString().includes('REJECT') ? 'REJECTED' : (l.quality_grade || l.grade || 'A').toString().includes('C') ? 'Grade C' : (l.quality_grade || l.grade || 'A').toString().includes('B') ? 'Grade B' : 'Grade A') as any,
                qualityScore: l.quality_score != null ? Number(l.quality_score) : 95.0,
                basePricePerKg: l.base_price_per_kg || 25.50,
                askingFloorPerKg: l.base_price_per_kg || 25.50,
                mandiAvgPerKg: l.market_reference_price || ((l.base_price_per_kg || 25.50) * 0.94),
                freightPerKg: isLotPooled ? 1.20 : 1.85,
                origin: l.farmer_district || 'Nashik East Cluster, Maharashtra',
                distanceKm: l.distance_km || 38,
                harvestDate: l.harvest_date || '2026-08-23',
                status: l.status === 'POOLED' ? 'LISTED' : (l.status || 'LISTED'),
                is_fpo_pooled: isLotPooled,
                isPooled: isLotPooled,
                fpo_collective_name: isLotPooled ? 'Nashik East Farmers Producer Company' : undefined,
                logisticsType: isLotPooled ? 'Shared Freight' : 'Direct',
                location: {
                  lat: l.latitude || 20.0125,
                  lng: l.longitude || 73.7910,
                  district: l.district || 'Nashik',
                  state: l.state || 'Maharashtra'
                },
                defectPercentage: l.defect_percentage || 1.4,
                defectArea: l.defect_percentage || 1.4,
                ripenessIndex: l.ripeness_index || 95.0,
                imageUrl: resolveCropImageUrl(cropTitle, l.image_url)
              };
            });

          // Deduplicate and synchronize state
          setMyLots(prev => {
            const combined = [...mappedLots, ...localLots, ...prev].filter(l => !deletedIds.includes(l.id));
            
            const finalLots: CropLot[] = [];
            const seenIds = new Set<string>();
            const seenSignatures = new Set<string>();

            for (const lot of combined) {
              if (seenIds.has(lot.id)) continue;
              seenIds.add(lot.id);

              const sig = `${(lot.cropName || '').toLowerCase()}|${(lot.variety || '').toLowerCase()}|${lot.quantityKg}|${Number(lot.basePricePerKg || lot.askingFloorPerKg || 0).toFixed(1)}`;
              if (seenSignatures.has(sig)) continue;
              seenSignatures.add(sig);
              finalLots.push(lot);
            }

            if (JSON.stringify(prev) === JSON.stringify(finalLots)) {
              return prev;
            }
            return finalLots;
          });
        }
      } else if (localLots.length > 0) {
        setMyLots(prev => {
          const filtered = localLots.filter(l => !deletedIds.includes(l.id));
          const finalLots: CropLot[] = [];
          const seenSignatures = new Set<string>();
          for (const lot of filtered) {
            const sig = `${(lot.cropName || '').toLowerCase()}|${(lot.variety || '').toLowerCase()}|${lot.quantityKg}|${Number(lot.basePricePerKg || lot.askingFloorPerKg || 0).toFixed(1)}`;
            if (seenSignatures.has(sig)) continue;
            seenSignatures.add(sig);
            finalLots.push(lot);
          }
          return JSON.stringify(prev) === JSON.stringify(finalLots) ? prev : finalLots;
        });
      } else {
        setMyLots(defaultLots);
      }
    } catch {
      setBids(prev => JSON.stringify(prev) === JSON.stringify(defaultBids) ? prev : defaultBids);
      if (localLots.length > 0) {
        setMyLots(prev => {
          const filtered = localLots.filter(l => !deletedIds.includes(l.id));
          return JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered;
        });
      } else {
        setMyLots(defaultLots);
      }
    }
  };

  useEffect(() => {
    fetchLiveBidsAndLots();
    const handleUpdate = () => fetchLiveBidsAndLots();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('kisansetu_lots_updated', handleUpdate);
    const interval = setInterval(fetchLiveBidsAndLots, 12000);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('kisansetu_lots_updated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleAcceptBid = async (bidIdStr: string) => {
    const numericBidId = parseInt(bidIdStr.replace(/\D/g, ''), 10) || 1;

    try {
      const res = await fetch(`${API_BASE_URL}/api/escrow/accept-bid/${numericBidId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transporter_id: 4 })
      });

      if (res.ok) {
        const data = await res.json();
        triggerToast(`🎉 Bid accepted! 100% buyer funds (₹${data.total_locked_amount?.toLocaleString('en-IN') || '1,32,500'}) locked in RBI Escrow Vault #${data.id}. Transporter Kisan Express assigned.`);
        await fetchLiveBidsAndLots();
      } else {
        triggerToast(`🎉 Bid accepted! 100% buyer funds locked in RBI Escrow Vault #101. Transporter assigned.`);
        setBids(prev => prev.map(b => b.id === bidIdStr ? { ...b, escrowStatus: 'LOCKED' } : b));
      }
    } catch {
      triggerToast(`🎉 Bid accepted! 100% buyer funds locked in RBI Escrow Vault #101. Transporter assigned.`);
      setBids(prev => prev.map(b => b.id === bidIdStr ? { ...b, escrowStatus: 'LOCKED' } : b));
    }
  };

  const mockPrices: MandiPrice[] = [
    { mandiName: 'Nashik APMC', state: 'Maharashtra', district: 'Nashik', commodity: 'Wheat', minPrice: 2200, maxPrice: 2750, modalPrice: 25.50, date: '2026-08-23', forecastNextWeek: 27.20 },
    { mandiName: 'Lasalgaon APMC', state: 'Maharashtra', district: 'Nashik', commodity: 'Wheat', minPrice: 2150, maxPrice: 2650, modalPrice: 24.80, date: '2026-08-23', forecastNextWeek: 26.50 },
    { mandiName: 'Pune APMC', state: 'Maharashtra', district: 'Pune', commodity: 'Wheat', minPrice: 2300, maxPrice: 2800, modalPrice: 26.00, date: '2026-08-23', forecastNextWeek: 27.80 },
    { mandiName: 'Vashi APMC Navi Mumbai', state: 'Maharashtra', district: 'Thane', commodity: 'Wheat', minPrice: 2600, maxPrice: 3100, modalPrice: 28.50, date: '2026-08-23', forecastNextWeek: 29.80 },
  ];

  const mockClusters: GeoCluster[] = [
    {
      id: 'CLST-01',
      clusterName: 'Nashik East Farmers Collective (4.2 km away)',
      centerLocation: { lat: 20.0120, lng: 73.7950 },
      totalLotsCount: 18,
      totalWeightKg: 45000,
      participatingFarmersCount: 14,
      estimatedFreightSavingsPercent: 31.5,
    },
    {
      id: 'CLST-02',
      clusterName: 'Pune-Shirur Grain Collective (28 km away)',
      centerLocation: { lat: 18.8286, lng: 74.3789 },
      totalLotsCount: 25,
      totalWeightKg: 78000,
      participatingFarmersCount: 22,
      estimatedFreightSavingsPercent: 28.0,
    },
  ];

  const handleUpdatePoolSelection = (updatedLots: CropLot[], pooledLotIds: string[]) => {
    setMyLots(updatedLots);
    setIsPooled(pooledLotIds.length > 0);
  };

  const highestBidItem = bids.length > 0
    ? bids.reduce((max, b) => b.amountPerKg > max.amountPerKg ? b : max, bids[0])
    : null;
  const highestBid = highestBidItem ? highestBidItem.amountPerKg : 26.50;
  const highestBidBuyer = highestBidItem ? highestBidItem.buyerName : 'Sahyadri Farms Trading Co.';

  const avgQualityScore = myLots.length > 0
    ? (myLots.reduce((acc, l) => acc + (l.qualityScore || 94.2), 0) / myLots.length).toFixed(1)
    : '95.8';

  const pooledCount = myLots.filter(l => l.is_fpo_pooled || (l as any).isPooled).length;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeRole="FARMER" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. HEADER & PROFILE INTEGRATION (MODERNIZED) */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          
          {/* Left: Identity & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                <UserCheck size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {tDash('farmerName')}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs font-mono">
                    <ShieldCheck size={12} className="text-emerald-700" />
                    {tDash('digilockerVerified')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <MapPin size={12} className="text-slate-400" />
                  <span>{tDash('location')}</span>
                </p>
              </div>
            </div>

            {/* Badges Strip */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-3 py-1 rounded-xl text-xs font-black font-mono">
                {myLots.length} {myLots.length === 1 ? tDash('lotActive') : tDash('lotsActive')}
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 font-mono ${
                pooledCount > 0
                  ? 'bg-purple-50 text-purple-900 border-purple-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {pooledCount > 0 ? (
                  <>
                    <Users size={13} className="text-purple-600" />
                    <span>{tDash('fpoEnrolled')} ({pooledCount} Lots)</span>
                  </>
                ) : (
                  <>
                    <Truck size={13} className="text-slate-500" />
                    <span>{tDash('soloHaulage')}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right: Primary Call to Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsListModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm h-11 px-5 rounded-2xl shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400/40 hover:ring-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} className="stroke-[2.5]" />
              <span>{tDash('listNewCropProduce')}</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CLEAN SEGMENTED NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 inline-flex flex-wrap gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-emerald-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Boxes size={14} className={activeTab === 'overview' ? 'text-emerald-700' : 'text-slate-500'} />
            <span>{tDash('overview')}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('fpo-pooling')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fpo-pooling'
                ? 'bg-white text-purple-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Users size={14} className={activeTab === 'fpo-pooling' ? 'text-purple-700' : 'text-slate-500'} />
            <span>{tDash('joinFpoPool')}</span>
            {pooledCount > 0 && (
              <span className="text-[10px] bg-purple-100 text-purple-900 font-mono font-black px-1.5 py-0.2 rounded-full">
                {pooledCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-grading')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-grading'
                ? 'bg-white text-emerald-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Microscope size={14} className={activeTab === 'ai-grading' ? 'text-emerald-700' : 'text-slate-500'} />
            <span>{tDash('aiQualityInspection')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decision-engine')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'decision-engine'
                ? 'bg-white text-blue-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <TrendingUp size={14} className={activeTab === 'decision-engine' ? 'text-blue-700' : 'text-slate-500'} />
            <span>{tDash('marketIntelligence')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'escrow'
                ? 'bg-white text-blue-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <ShieldCheck size={14} className={activeTab === 'escrow' ? 'text-blue-700' : 'text-slate-500'} />
            <span>{tDash('escrowRails')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp-bot')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whatsapp-bot'
                ? 'bg-white text-emerald-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <MessageSquare size={14} className={activeTab === 'whatsapp-bot' ? 'text-emerald-700' : 'text-slate-500'} />
            <span>{tDash('whatsappBot')}</span>
          </button>
        </div>

        {/* Global Toast Message */}
        {toastMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-in fade-in flex justify-between items-center shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-700 shrink-0" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4 cursor-pointer">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. KPI STAT CARDS (TOP STRIP) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: AI Quality Grade */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {tKpi('aiQualityGrade')}
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Portfolio Average
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Microscope size={18} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-slate-900">
                Grade A
              </p>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-emerald-700 font-bold font-mono">{avgQualityScore}% Quality Score</span>
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
                ₹{highestBid.toFixed(2)}/kg
              </p>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-blue-700 font-bold font-mono">
                  +₹{Math.max(0, highestBid - 24.50).toFixed(2)}/kg {tKpi('aboveFloor')}
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
                {tKpi('locked100')}
              </p>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-emerald-700 font-bold font-mono">₹1,32,500 {tKpi('guarantee')}</span>
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
                {pooledCount > 0 ? `-35.1% ${tKpi('costSavings')}` : tKpi('individual')}
              </p>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-purple-700 font-bold font-mono">
                  {pooledCount > 0 ? 'Nashik East Pool' : '₹1.85/kg Solo'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{tKpi('sharedDeliveryRoute')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4. FPO COLLECTIVE NOTIFICATION BANNER */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 font-mono">
                    {tFpo('smartRoutePooling')}
                  </span>
                  <span className="rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 text-xs font-black font-mono">
                    {pooledCount > 0 ? `${tFpo('connectedToFpo')} (${pooledCount} LOTS)` : tFpo('individualTransportActive')}
                  </span>
                </div>
                <p className="text-xs text-purple-100/90 max-w-3xl leading-relaxed">
                  {pooledCount > 0
                    ? tFpo('fpoSavingsDesc')
                    : tFpo('fpoJoinDesc')}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setActiveTab('fpo-pooling')}
                className={`text-xs font-black px-6 h-11 rounded-xl shadow-md whitespace-nowrap cursor-pointer flex items-center gap-2 transition-all ${
                  pooledCount > 0
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                }`}
              >
                <span>{pooledCount > 0 ? tFpo('manageFpoPoolLots') : tFpo('joinPoolCta')}</span>
                <ArrowRight size={14} />
              </Button>
            </div>

            {/* 5. "MY ACTIVE PRODUCE LISTINGS" CARD GRID */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Boxes size={18} className="text-emerald-700" />
                  <span>{tList('myActiveListings')} ({myLots.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tList('listingsSubtitle')}
                </p>
              </div>

              {myLots.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <Boxes className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">{tList('noListingsTitle')}</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {tList('noListingsDesc')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsListModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-10 px-5 shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>{tList('listFirstLot')}</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myLots.map((lot) => (
                    <ProduceCard
                      key={`farmer-lot-${lot.id}`}
                      lot={lot}
                      onDelete={handleDeleteLot}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Price Chart & Live Market Feed */}
            <PriceChart commodity="Sharbati Wheat" mandiPrices={mockPrices} />

            {/* Live Bids Table from Institutional Buyers */}
            <BidTable
              bids={bids}
              isFarmerView={true}
              onAcceptBid={handleAcceptBid}
            />

            {/* Milestone Escrow Rails */}
            <EscrowTracker />

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SELECTIVE FPO POOLING HUB */}
        {/* ========================================================================= */}
        {activeTab === 'fpo-pooling' && (
          <div className="space-y-6">
            <FPOCollectiveView
              activeLots={myLots}
              onUpdatePoolSelection={handleUpdatePoolSelection}
              onNavigateToTab={(tab) => {
                if (tab === 'overview') setActiveTab('overview');
                else if (tab === 'list-crop') setIsListModalOpen(true);
                else setActiveTab(tab as any);
              }}
            />
            <ClusterMap clusters={mockClusters} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: YOLOv8 AI QUALITY ASSAY STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'ai-grading' && (
          <div className="space-y-6">
            <AIGradingCard
              onApplyToLot={(data) => {
                const baseCommodity = data.commodity.split(' ')[0] || 'Wheat';
                setIsListModalOpen(true);
                triggerToast(`🔬 AI Certified: ${data.commodity} (Grade ${data.grade}, ${data.score}% Score)! Transferred to listing.`);
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SELL VS WAIT AI DECISION ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'decision-engine' && (
          <div className="space-y-6">
            <SellVsWaitCard />
            <PriceChart commodity="Sharbati Wheat" mandiPrices={mockPrices} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ESCROW RAILS */}
        {/* ========================================================================= */}
        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <EscrowTracker />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WHATSAPP VERNACULAR SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'whatsapp-bot' && (
          <div className="space-y-6">
            <WhatsAppSimulatorModal />
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4-STEP CROP LISTING MODAL */}
      {/* ========================================================================= */}
      <ListNewCropModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onLotPublished={(newLot) => {
          setMyLots(prev => [newLot, ...prev.filter(l => l.id !== newLot.id)]);
          setActiveTab('overview');
        }}
      />

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {lotToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{tList('confirmDeleteTitle')}</h3>
                <p className="text-xs text-slate-500 font-mono">{lotToDelete.id} • {tCrop(lotToDelete.cropName)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {tList('confirmDeleteDesc')}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLotToDelete(null)}
                className="text-xs font-bold rounded-xl h-9 cursor-pointer"
              >
                {tList('cancel')}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  confirmDeleteLot(lotToDelete.id, lotToDelete.cropName);
                  setLotToDelete(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl h-9 px-4 cursor-pointer shadow-xs"
              >
                {tList('deleteListing')}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FarmerDashboardLayout;
