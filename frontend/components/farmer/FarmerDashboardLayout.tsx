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
import { useAuth } from '@/lib/AuthContext';

export function FarmerDashboardLayout() {
  const { user } = useAuth();
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
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [lotToDelete, setLotToDelete] = useState<{ id: string; cropName: string } | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);

  const handleTrackOrder = (bidIdStr: string) => {
    const numericId = parseInt(bidIdStr.replace(/\D/g, ''), 10) || 101;
    setSelectedOrderId(numericId);
    setActiveTab('overview');
    setTimeout(() => {
      document.getElementById('payment-tracker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

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
      location: { lat: 20.0120, lng: 73.7950, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 1.2,
      defectArea: 1.2,
      ripenessIndex: 96.5,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'LOT-102',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Red Onion',
      variety: 'Garwa Premium',
      quantityKg: 8000,
      quantityTons: 8.0,
      grade: 'A',
      qualityGrade: 'Grade A',
      qualityScore: 96.8,
      basePricePerKg: 21.00,
      askingFloorPerKg: 21.00,
      mandiAvgPerKg: 21.50,
      freightPerKg: 1.15,
      origin: 'Lasalgaon Mandi Basin, Maharashtra',
      distanceKm: 42,
      harvestDate: '2026-08-21',
      status: 'BIDDING',
      is_fpo_pooled: true,
      isPooled: true,
      fpo_collective_name: 'Nashik East Farmers Producer Company',
      logisticsType: 'Shared Freight',
      location: { lat: 20.1472, lng: 74.2285, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 0.8,
      defectArea: 0.8,
      ripenessIndex: 98.2,
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'LOT-103',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Soybean',
      variety: 'JS-335 Yellow',
      quantityKg: 4000,
      quantityTons: 4.0,
      grade: 'B',
      qualityGrade: 'Grade B',
      qualityScore: 88.5,
      basePricePerKg: 44.00,
      askingFloorPerKg: 44.00,
      mandiAvgPerKg: 46.00,
      freightPerKg: 1.80,
      origin: 'Dindori Agriculture Zone, Maharashtra',
      distanceKm: 28,
      harvestDate: '2026-08-22',
      status: 'LISTED',
      is_fpo_pooled: false,
      isPooled: false,
      logisticsType: 'Direct',
      location: { lat: 20.2011, lng: 73.8322, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 3.2,
      defectArea: 3.2,
      ripenessIndex: 91.0,
      imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'LOT-104',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Pomegranate',
      variety: 'Bhagwa Export Grade',
      quantityKg: 2500,
      quantityTons: 2.5,
      grade: 'A',
      qualityGrade: 'Grade A',
      qualityScore: 97.4,
      basePricePerKg: 110.00,
      askingFloorPerKg: 110.00,
      mandiAvgPerKg: 118.00,
      freightPerKg: 2.20,
      origin: 'Kalwan Orchards, Maharashtra',
      distanceKm: 55,
      harvestDate: '2026-08-23',
      status: 'LISTED',
      is_fpo_pooled: false,
      isPooled: false,
      logisticsType: 'Direct',
      location: { lat: 20.4891, lng: 74.0211, district: 'Nashik', state: 'Maharashtra' },
      defectPercentage: 0.5,
      defectArea: 0.5,
      ripenessIndex: 99.1,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
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

      const userLotStorageKey = user?.email ? `kisansetu_crop_lots_${user.email.toLowerCase()}` : 'kisansetu_crop_lots';
      const userSaved = localStorage.getItem(userLotStorageKey);
      if (userSaved) {
        const currentLots = JSON.parse(userSaved);
        const filtered = currentLots.filter((l: any) => l.id !== lotId);
        localStorage.setItem(userLotStorageKey, JSON.stringify(filtered));
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

    const isDemoFarmer = !user?.email || user.email.toLowerCase() === 'farmer@kisansetu.in';
    const userLotStorageKey = user?.email ? `kisansetu_crop_lots_${user.email.toLowerCase()}` : 'kisansetu_crop_lots';

    try {
      const deletedSaved = localStorage.getItem('kisansetu_deleted_lot_ids');
      if (deletedSaved) deletedIds = JSON.parse(deletedSaved);
    } catch {}

    try {
      const pooledSaved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (pooledSaved) pooledIds = JSON.parse(pooledSaved);
    } catch {}

    // 1. Sync from user-scoped localStorage
    try {
      const savedLots = localStorage.getItem(userLotStorageKey) || (isDemoFarmer ? localStorage.getItem('kisansetu_crop_lots') : null);
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
      const lotsUrl = user?.email
        ? `${API_BASE_URL}/api/marketplace/lots?farmer_email=${encodeURIComponent(user.email.trim())}`
        : `${API_BASE_URL}/api/marketplace/lots`;

      const [bidsRes, lotsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/marketplace/bids`),
        fetch(lotsUrl)
      ]);

      let fetchedLots: CropLot[] = [];
      if (lotsRes.ok) {
        const rawLots = await lotsRes.json();
        if (Array.isArray(rawLots) && rawLots.length > 0) {
          fetchedLots = rawLots
            .filter((l: any) => !deletedIds.includes(`LOT-${l.id}`) && !deletedIds.includes(String(l.id)))
            .map((l: any) => {
              const cropTitle = l.commodity || l.crop_name || 'Wheat';
              const lotId = `LOT-${l.id}`;
              const isLotPooled = pooledIds.includes(lotId) || pooledIds.includes(String(l.id)) || l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED';
              return {
                id: lotId,
                farmerId: String(l.farmer_id || 1),
                farmerName: l.farmer_name || user?.name || 'Ramesh Patil',
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
                origin: l.farmer_district || user?.location || 'Nashik East Cluster, Maharashtra',
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
        }
      }

      const combinedLots = [...fetchedLots, ...localLots];
      const seenIds = new Set<string>();
      const finalLots: CropLot[] = [];

      for (const lot of combinedLots) {
        if (seenIds.has(lot.id)) continue;
        seenIds.add(lot.id);
        finalLots.push(lot);
      }

      if (finalLots.length > 0) {
        setMyLots(finalLots);
      } else if (isDemoFarmer) {
        setMyLots(defaultLots);
      } else {
        setMyLots([]);
      }

      let localBids: Bid[] = [];
      try {
        const savedBids = localStorage.getItem('kisansetu_bids');
        if (savedBids) {
          const parsed = JSON.parse(savedBids);
          if (Array.isArray(parsed)) {
            localBids = parsed;
          }
        }
      } catch {}

      let backendBids: Bid[] = [];
      if (bidsRes.ok) {
        const rawBids = await bidsRes.json();
        if (Array.isArray(rawBids) && rawBids.length > 0) {
          const buyerNames = ['Sahyadri Farms Trading Co.', 'AgroProcure Private Ltd', 'Vashi Fresh Distributors', 'Nashik Agro Exports'];
          backendBids = rawBids.map((b: any, idx: number) => ({
            id: `BID-${b.id || idx + 101}`,
            lotId: `LOT-${b.lot_id || 101}`,
            buyerId: String(b.buyer_id || idx + 2),
            buyerName: (b.buyer_name && b.buyer_name !== 'Buyer') ? b.buyer_name : buyerNames[idx % buyerNames.length],
            amountPerKg: b.amount_per_kg,
            totalAmount: b.total_amount,
            escrowStatus: b.status === 'ACCEPTED' ? 'LOCKED' : b.status === 'REJECTED' ? 'RELEASED' : 'INITIATED',
            createdAt: b.created_at ? b.created_at.replace('T', ' ').slice(0, 16) : '2026-08-25 15:10'
          }));
        }
      }

      const allMergedBids = [...localBids, ...backendBids];
      const seenKeys = new Set<string>();
      const finalBids: Bid[] = [];

      for (const b of allMergedBids) {
        const normLotId = String(b.lotId || '').replace(/\D/g, '') || '1';
        const normRate = Number(b.amountPerKg || 0).toFixed(2);
        const normBuyer = String(b.buyerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Unique signature: buyer + lot + rate (e.g. "agroprocureprivateltd_1_30.00")
        const compositeKey = `${normBuyer}_${normLotId}_${normRate}`;
        const idKey = String(b.id || '');

        if (seenKeys.has(compositeKey) || (idKey && seenKeys.has(idKey))) {
          continue;
        }

        if (compositeKey) seenKeys.add(compositeKey);
        if (idKey) seenKeys.add(idKey);
        finalBids.push(b);
      }

      if (finalBids.length > 0) {
        setBids(finalBids);
      } else if (isDemoFarmer) {
        setBids(defaultBids);
      } else {
        setBids([]);
      }
    } catch {
      let fallbackLocalBids: Bid[] = [];
      try {
        const savedBids = localStorage.getItem('kisansetu_bids');
        if (savedBids) fallbackLocalBids = JSON.parse(savedBids);
      } catch {}

      if (localLots.length > 0) {
        setMyLots(localLots);
      } else if (isDemoFarmer) {
        setMyLots(defaultLots);
      } else {
        setMyLots([]);
      }

      if (fallbackLocalBids.length > 0) {
        const seenFallbackKeys = new Set<string>();
        const uniqueFallback: Bid[] = [];
        for (const b of fallbackLocalBids) {
          const normLotId = String(b.lotId || '').replace(/\D/g, '') || '1';
          const normRate = Number(b.amountPerKg || 0).toFixed(2);
          const normBuyer = String(b.buyerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const compositeKey = `${normBuyer}_${normLotId}_${normRate}`;
          if (!seenFallbackKeys.has(compositeKey)) {
            seenFallbackKeys.add(compositeKey);
            uniqueFallback.push(b);
          }
        }
        setBids(uniqueFallback);
      } else if (isDemoFarmer) {
        setBids(defaultBids);
      } else {
        setBids([]);
      }
    } finally {
      setLoading(false);
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
      const savedBids = localStorage.getItem('kisansetu_bids');
      if (savedBids) {
        const parsed = JSON.parse(savedBids);
        const updated = parsed.map((b: any) => b.id === bidIdStr ? { ...b, escrowStatus: 'LOCKED' } : b);
        localStorage.setItem('kisansetu_bids', JSON.stringify(updated));
      }
    } catch {}

    setBids(prev => prev.map(b => b.id === bidIdStr ? { ...b, escrowStatus: 'LOCKED' } : b));
    triggerToast(`🎉 Bid accepted! 100% buyer funds locked in RBI Escrow Vault. Transporter Kisan Express assigned for pickup.`);

    try {
      await fetch(`${API_BASE_URL}/api/escrow/accept-bid/${numericBidId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transporter_id: 4 })
      }).catch(() => {});
    } catch {}
  };

  const handleRejectBid = (bidIdStr: string) => {
    try {
      const savedBids = localStorage.getItem('kisansetu_bids');
      if (savedBids) {
        const parsed = JSON.parse(savedBids);
        const filtered = parsed.filter((b: any) => b.id !== bidIdStr);
        localStorage.setItem('kisansetu_bids', JSON.stringify(filtered));
      }
    } catch {}
    setBids(prev => prev.filter(b => b.id !== bidIdStr));
    triggerToast(`Bid rejected.`);
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

  const totalLots = myLots.length;
  const pooledLots = myLots.filter(l => l.is_fpo_pooled || (l as any).isPooled);
  const pooledCount = pooledLots.length;

  const highestBidItem = bids.length > 0
    ? bids.reduce((max, b) => b.amountPerKg > max.amountPerKg ? b : max, bids[0])
    : null;
  const highestBid = highestBidItem ? highestBidItem.amountPerKg : 0;
  const highestBidBuyer = highestBidItem ? highestBidItem.buyerName : '';

  const avgQualityScore = totalLots > 0
    ? (myLots.reduce((acc, l) => acc + (l.qualityScore || 95.0), 0) / totalLots).toFixed(1)
    : '0.0';

  const portfolioGrade = totalLots > 0
    ? (Number(avgQualityScore) >= 90 ? 'Grade A' : Number(avgQualityScore) >= 80 ? 'Grade B' : 'Grade C')
    : 'N/A';

  const lockedBids = bids.filter(b => b.escrowStatus === 'LOCKED');
  const totalEscrowLocked = lockedBids.reduce((sum, b) => sum + (b.totalAmount || (b.amountPerKg * (myLots[0]?.quantityKg || 5000))), 0);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative">
      <Navbar activeRole="FARMER" />



      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
        
        {/* Top Actions Row: Search + Shortcuts */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
          
          {/* Simple Search Bar */}
          <div className="relative w-full sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search items, buyers, lots..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button onClick={() => window.location.href='/fpo/dashboard'} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#2d4373] text-white rounded-2xl px-5 py-3.5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-[#2d4373]/20">
              <Truck size={18} />
              <span className="text-sm font-bold">FPO</span>
            </button>
            <button onClick={() => window.location.href='/warehouse/dashboard'} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#2d4373] text-white rounded-2xl px-5 py-3.5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-[#2d4373]/20">
              <Boxes size={18} />
              <span className="text-sm font-bold">Warehouse</span>
            </button>
          </div>

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

        {/* Your Crops (Swipeable Row) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Current Lots</h2>
          
          {loading ? (
             <div className="p-8 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-3">
               <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
             </div>
          ) : totalLots === 0 ? (
             <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-xs">
               <p>No crops listed yet.</p>
             </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-1">
              {myLots.map((lot) => {
                const getQualityText = (grade: string) => {
                  if (grade.includes('A')) return 'Excellent Quality';
                  if (grade.includes('B')) return 'Good Quality';
                  return 'Standard Quality';
                };
                
                return (
                  <div key={lot.id} className="snap-start shrink-0 w-[260px] bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.04)] flex flex-col gap-3 overflow-hidden group">
                    <div className="w-full h-32 bg-slate-50/50 rounded-2xl overflow-hidden mb-1 relative shrink-0">
                       <img src={resolveCropImageUrl(lot.cropName, lot.imageUrl || undefined)} alt={lot.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-slate-800 text-lg sm:text-xl">{lot.cropName}</span>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                         lot.status === 'BIDDING' || lot.status === 'LISTED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                       }`}>
                         {lot.status === 'BIDDING' || lot.status === 'LISTED' ? 'Selling' : 'Sold'}
                       </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {lot.quantityTons} <span className="text-sm font-bold text-slate-500 ml-1">Tons</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 rounded-xl">
                      <ShieldCheck size={14} />
                      {getQualityText(lot.qualityGrade || '')}
                    </div>
                    <button 
                       onClick={() => handleDeleteLot(lot.id, lot.cropName)}
                       className="mt-3 text-rose-500 hover:text-rose-700 text-[11px] font-bold self-start cursor-pointer tracking-wide uppercase"
                    >
                      Remove Lot
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Create New Lot Button */}
        <button 
          onClick={() => setIsListModalOpen(true)}
          className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all cursor-pointer group mt-2"
        >
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50/70 text-[#3B5998] rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Plus size={36} className="stroke-[2.5]" />
            </div>
            <div className="text-left space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create New Lot</h3>
              <p className="text-sm sm:text-base text-slate-500 font-medium">List a new lot and sell to buyers</p>
            </div>
          </div>
          <ArrowRight className="text-[#3B5998] group-hover:translate-x-2 transition-transform hidden sm:block" size={28} />
        </button>

        {/* Market Price */}
        <section className="space-y-4 pt-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Market Price</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
              <div className="aspect-square bg-slate-50/50 p-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=400&q=80" alt="Vegetables" className="w-full h-full object-cover rounded-2xl shadow-sm" />
              </div>
              <div className="p-4 text-center border-t border-slate-50 bg-white">
                <span className="font-bold text-slate-900 text-sm sm:text-base">Vegetables</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
              <div className="aspect-square bg-slate-50/50 p-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80" alt="Fruits" className="w-full h-full object-cover rounded-2xl shadow-sm" />
              </div>
              <div className="p-4 text-center border-t border-slate-50 bg-white">
                <span className="font-bold text-slate-900 text-sm sm:text-base">Fruits</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
              <div className="aspect-square bg-[#F8FAFC] flex items-center justify-center m-6 rounded-2xl">
                <span className="text-3xl font-bold text-slate-300">--</span>
              </div>
              <div className="p-4 text-center border-t border-slate-50 mt-auto bg-white">
                <span className="font-medium text-xs sm:text-sm text-slate-500">Coming Soon</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
              <div className="aspect-square bg-[#F8FAFC] flex items-center justify-center m-6 rounded-2xl">
                <span className="text-3xl font-bold text-slate-300">--</span>
              </div>
              <div className="p-4 text-center border-t border-slate-50 mt-auto bg-white">
                <span className="font-medium text-xs sm:text-sm text-slate-500">Coming Soon</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* 4-STEP CROP LISTING MODAL */}
      <ListNewCropModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onLotPublished={(newLot) => {
          setMyLots(prev => [newLot, ...prev.filter(l => l.id !== newLot.id)]);
        }}
      />

      {/* DELETE CONFIRMATION MODAL */}
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
