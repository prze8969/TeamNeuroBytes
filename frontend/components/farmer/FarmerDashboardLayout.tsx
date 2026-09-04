'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  UserCheck,
  Search
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

  const [activeTab, setActiveTab] = useState<'overview' | 'fpo-pooling' | 'decision-engine' | 'whatsapp-bot' | 'escrow'>('overview');
  const [isPooled, setIsPooled] = useState<boolean>(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myLots, setMyLots] = useState<CropLot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [lotToDelete, setLotToDelete] = useState<{ id: string; cropName: string } | null>(null);
  const [selectedLot, setSelectedLot] = useState<CropLot | null>(null);
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

  const handleDeleteLot = (lotId: string, cropName: string) => {
    setLotToDelete({ id: lotId, cropName });
  };

  const confirmDeleteLot = (lotId: string, cropName: string) => {
    // 1. Remove the lot from state
    setMyLots(prev => prev.filter(l => l.id !== lotId));

    // 2. Track in deleted lot IDs and remove from stored crop lots
    try {
      let deletedIds: string[] = [];
      const savedDeleted = localStorage.getItem('kisansetu_deleted_lot_ids');
      if (savedDeleted) deletedIds = JSON.parse(savedDeleted);
      if (!deletedIds.includes(lotId)) {
        deletedIds.push(lotId);
        localStorage.setItem('kisansetu_deleted_lot_ids', JSON.stringify(deletedIds));
      }

      const savedLots = localStorage.getItem('kisansetu_crop_lots');
      if (savedLots) {
        const parsedLots = JSON.parse(savedLots);
        const remainingLots = parsedLots.filter((l: any) => l.id !== lotId);
        localStorage.setItem('kisansetu_crop_lots', JSON.stringify(remainingLots));
      }
    } catch {}

    // 3. Remove all bids for this deleted lot from the farmer's active view
    setBids(prev => prev.filter(b => b.lotId !== lotId));

    // 4. Update the bids in localStorage so Buyer is informed the bid was rejected/withdrawn
    try {
      const savedBids = localStorage.getItem('kisansetu_bids');
      if (savedBids) {
        const parsedBids = JSON.parse(savedBids);
        const updatedBids = parsedBids.map((b: any) => {
          if (b.lotId === lotId) {
            return {
              ...b,
              escrowStatus: 'REJECTED',
              rejectionReason: `Listing Delisted: Farmer decided to hold stock in cold storage for higher future market rates.`
            };
          }
          return b;
        });
        localStorage.setItem('kisansetu_bids', JSON.stringify(updatedBids));
      }

      // 5. Add a clear notification for the Buyer portal
      let buyerNotifs: any[] = [];
      const savedNotifs = localStorage.getItem('kisansetu_buyer_notifications');
      if (savedNotifs) buyerNotifs = JSON.parse(savedNotifs);
      buyerNotifs.unshift({
        id: Date.now(),
        title: '❌ Bid Cancelled: Listing Withdrawn by Farmer',
        message: `Your bid on ${cropName} (${lotId}) was cancelled because the farmer withdrew the listing to hold stock for higher future rates. Any escrow funds have been released back to your balance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lotId: lotId
      });
      localStorage.setItem('kisansetu_buyer_notifications', JSON.stringify(buyerNotifs));

      // 6. Release any escrow vaults in Buyer active deals
      const savedVaults = localStorage.getItem('kisansetu_active_vaults');
      if (savedVaults) {
        const parsedVaults = JSON.parse(savedVaults);
        const updatedVaults = parsedVaults.map((v: any) => {
          if (v.lot_id === lotId) {
            return {
              ...v,
              status: 'CANCELLED_WITHDRAWN',
              dispute_reason: 'Farmer withdrew listing from marketplace (decided to store/wait for higher price).'
            };
          }
          return v;
        });
        localStorage.setItem('kisansetu_active_vaults', JSON.stringify(updatedVaults));
      }
    } catch {}

    // 7. Broadcast real-time cross-tab events
    window.dispatchEvent(new Event('kisansetu_lots_updated'));
    window.dispatchEvent(new Event('kisansetu_bids_updated'));
    window.dispatchEvent(new Event('storage'));

    triggerToast(`🗑️ ${cropName} (${lotId}) delisted. Associated buyer bids have been removed and buyer was notified.`);
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
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 overflow-visible relative">
        
        {/* ========================================================================= */}
        {/* NEW CUSTOM FARMER DASHBOARD LAYOUT (MATCHING PROVIDED IMAGE) */}
        {/* ========================================================================= */}

        {/* 1. CURRENT LOTS SECTION */}
        <section className="bg-white p-5 sm:p-6 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Boxes size={20} className="text-[#3B38D0]" />
              <span>Current Lots {totalLots > 0 ? `(${totalLots})` : ''}</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-3 border-[#3B38D0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : totalLots === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No produce lots listed yet. Click 'Create New Lot' below to get started.
            </div>
          ) : (
            <div className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-1 px-1 pt-1">
              {myLots.map((lot) => (
                <div 
                  key={`farmer-lot-${lot.id}`} 
                  className="w-[100px] sm:w-[120px] shrink-0 snap-start flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => setSelectedLot(lot)}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <img 
                      src={resolveCropImageUrl(lot.cropName, lot.imageUrl)} 
                      alt={lot.cropName} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = resolveCropImageUrl(lot.cropName);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLot(lot.id, lot.cropName);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delist"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-slate-800 text-center leading-tight line-clamp-2">
                    {lot.cropName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. CREATE NEW LOT (Massive Button) */}
        <button onClick={() => setIsListModalOpen(true)} className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#3B38D0] to-[#2D2A9E] p-8 sm:p-12 rounded-[32px] shadow-[0_8px_30px_-4px_rgba(59,56,208,0.3)] border border-[#4F4DE4] hover:shadow-[0_12px_40px_-4px_rgba(59,56,208,0.4)] transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-300"></div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm mb-4 border border-white/20 group-hover:scale-110 transition-transform duration-500">
            <Plus size={48} strokeWidth={2.5} />
          </div>
          <h3 className="text-[28px] sm:text-[36px] font-black text-white leading-tight tracking-tight text-center">
            Create New Lot
          </h3>
          <p className="text-sm sm:text-base text-indigo-200 mt-2 text-center max-w-sm">
            List your crop instantly to agmarknet-verified institutional buyers
          </p>
        </button>

        {/* 3. SEARCH BAR */}
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <input 
            type="text" 
            placeholder="Search items, buyers, lots..."
            className="w-full bg-[#FAFAFA] border border-slate-200 rounded-[20px] pl-12 pr-4 py-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B38D0]/30 transition-all shadow-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>

        {/* 4. MARKET PRICE GRID & FLOATING BUTTONS */}
        <section className="bg-white p-5 sm:p-6 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 relative">
          <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-4">Market Price</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pb-4">
            {/* Card 1 */}
            <Link href="/farmer/market/vegetables" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🥦</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Vegetables</span>
            </Link>
            {/* Card 2 */}
            <Link href="/farmer/market/fruits" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🍎</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Fruits</span>
            </Link>
            {/* Card 3 */}
            <Link href="/farmer/market/grains" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🌾</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Grains</span>
            </Link>
            {/* Card 4 */}
            <Link href="/farmer/market/pulses" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🫘</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Pulses</span>
            </Link>
            {/* Card 5 */}
            <Link href="/farmer/market/spices" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🌶️</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Spices</span>
            </Link>
            {/* Card 6 */}
            <Link href="/farmer/market/flowers" className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-xs h-[160px] hover:border-[#3B38D0] hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 relative mb-3 flex items-center justify-center">
                 <div className="text-[60px] leading-none drop-shadow-md">🌻</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">Flowers</span>
            </Link>
          </div>

          {/* Floating Action Buttons Docked to Right */}
          <div className="absolute top-[20%] -right-4 sm:-right-6 lg:-right-8 flex flex-col gap-3 z-30">
            <Link href="/farmer/fpo" className="w-16 h-20 bg-[#3B38D0] rounded-l-2xl shadow-xl flex flex-col items-center justify-center text-white hover:bg-[#2D2A9E] transition-transform hover:-translate-x-1 cursor-pointer">
              <Boxes size={20} className="mb-1" />
              <span className="text-[10px] font-bold mb-1">FPO</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 4-STEP CROP LISTING MODAL */}
      {/* ========================================================================= */}
      <ListNewCropModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onLotPublished={(newLot) => {
          setMyLots(prev => [newLot, ...prev.filter(l => l.id !== newLot.id)]);
        }}
      />

      {/* ========================================================================= */}
      {/* LOT OVERVIEW MODAL */}
      {/* ========================================================================= */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedLot(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
            >
              ✕
            </button>
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">Lot Overview</h2>
              <ProduceCard
                lot={selectedLot}
                onDelete={handleDeleteLot}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}

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
