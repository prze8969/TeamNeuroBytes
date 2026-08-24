'use client'

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { BidTable } from '@/components/dashboard/BidTable';
import { EscrowTracker } from '@/components/dashboard/EscrowTracker';
import { AIGradingCard } from '@/components/dashboard/AIGradingCard';
import { SellVsWaitCard } from '@/components/dashboard/SellVsWaitCard';
import { WhatsAppSimulatorModal } from '@/components/dashboard/WhatsAppSimulatorModal';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { ListNewCropModal } from '@/components/farmer/ListNewCropModal';
import { resolveCropImageUrl } from '@/lib/assayData';
import { Trash2 } from 'lucide-react';
import { Bid, MandiPrice, GeoCluster, CropLot } from '@/lib/types';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'list-crop' | 'fpo-pooling' | 'ai-grading' | 'decision-engine' | 'whatsapp-bot' | 'escrow'>('overview');
  const [isPooled, setIsPooled] = useState(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myLots, setMyLots] = useState<CropLot[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  // New Crop Form State
  const [cropName, setCropName] = useState('Sharbati Wheat');
  const [variety, setVariety] = useState('Lok-1 (Clean Grain)');
  const [quantityTons, setQuantityTons] = useState(5.0);
  const [basePricePerKg, setBasePricePerKg] = useState(25.50);
  const [district, setDistrict] = useState('Nashik');
  const [mandi, setMandi] = useState('Nashik APMC');
  const [lotPhotoUrl, setLotPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80');
  const [aiGrade, setAiGrade] = useState<string>('A');
  const [aiScore, setAiScore] = useState<number>(96.5);
  const [aiDefect, setAiDefect] = useState<number>(1.2);
  const [aiRipeness, setAiRipeness] = useState<number>(95.0);
  const [isSubmittingLot, setIsSubmittingLot] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const defaultBids: Bid[] = [
    {
      id: 'BID-1',
      lotId: 'LOT-1',
      buyerId: '2',
      buyerName: 'Sahyadri Farmers Producer Co.',
      amountPerKg: 26.50,
      totalAmount: 132500,
      escrowStatus: 'LOCKED',
      createdAt: '2026-08-23 15:10',
    },
    {
      id: 'BID-2',
      lotId: 'LOT-1',
      buyerId: '2',
      buyerName: 'AgroProcure India Ltd',
      amountPerKg: 25.80,
      totalAmount: 129000,
      escrowStatus: 'INITIATED',
      createdAt: '2026-08-23 12:45',
    },
  ];

  const handleDeleteLot = (lotId: string, cropName: string) => {
    // 1. Remove from local state
    setMyLots(prev => prev.filter(l => l.id !== lotId));

    // 2. Remove from localStorage and register in blacklist
    try {
      const saved = localStorage.getItem('kisansetu_crop_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((l: any) => l.id !== lotId);
        localStorage.setItem('kisansetu_crop_lots', JSON.stringify(filtered));
      }

      const deletedSaved = localStorage.getItem('kisansetu_deleted_lot_ids');
      const deletedIds: string[] = deletedSaved ? JSON.parse(deletedSaved) : [];
      if (!deletedIds.includes(lotId)) {
        deletedIds.push(lotId);
        localStorage.setItem('kisansetu_deleted_lot_ids', JSON.stringify(deletedIds));
      }

      // Broadcast update across tabs
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    triggerToast(`🗑️ Lot ${lotId} (${cropName}) delisted and removed.`);
  };

  const fetchLiveBidsAndLots = async () => {
    let localLots: CropLot[] = [];
    let deletedIds: string[] = [];

    try {
      const deletedSaved = localStorage.getItem('kisansetu_deleted_lot_ids');
      if (deletedSaved) deletedIds = JSON.parse(deletedSaved);
    } catch {}

    // 1. Sync from localStorage
    try {
      const savedLots = localStorage.getItem('kisansetu_crop_lots');
      if (savedLots) {
        const parsed = JSON.parse(savedLots);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLots = parsed
            .filter((l: any) => !deletedIds.includes(l.id))
            .map((l: any) => ({
              ...l,
              imageUrl: resolveCropImageUrl(l.cropName || l.commodity, l.imageUrl || l.image_url)
            }));
        }
      }
    } catch {}

    // 2. Fetch from backend API
    try {
      const [bidsRes, lotsRes] = await Promise.all([
        fetch('http://localhost:8000/api/marketplace/bids'),
        fetch('http://localhost:8000/api/marketplace/lots')
      ]);

      if (bidsRes.ok) {
        const rawBids = await bidsRes.json();
        if (Array.isArray(rawBids) && rawBids.length > 0) {
          const mappedBids: Bid[] = rawBids.map((b: any) => ({
            id: `BID-${b.id}`,
            lotId: `LOT-${b.lot_id}`,
            buyerId: String(b.buyer_id),
            buyerName: b.buyer_name || 'AgroProcure Private Ltd',
            amountPerKg: b.amount_per_kg,
            totalAmount: b.total_amount,
            escrowStatus: b.status === 'ACCEPTED' ? 'LOCKED' : b.status === 'REJECTED' ? 'RELEASED' : 'INITIATED',
            createdAt: b.created_at ? b.created_at.replace('T', ' ').slice(0, 16) : '2026-08-23 15:10'
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
              return {
                id: `LOT-${l.id}`,
                farmerId: String(l.farmer_id || 1),
                farmerName: l.farmer_name || 'Ramesh Patil',
                cropName: cropTitle,
                variety: l.variety || 'Standard Hybrid',
                quantityKg: l.quantity_kg || 5000,
                quantityTons: l.quantity_tons || ((l.quantity_kg || 5000) / 1000),
                grade: (l.grade === 'B' ? 'B' : l.grade === 'C' ? 'C' : 'A') as 'A' | 'B' | 'C',
                qualityGrade: (l.grade === 'B' ? 'Grade B' : l.grade === 'C' ? 'Grade C' : 'Grade A') as ('Grade A' | 'Grade B' | 'Grade C'),
                qualityScore: l.quality_score || 95.0,
                basePricePerKg: l.base_price_per_kg || 25.50,
                askingFloorPerKg: l.base_price_per_kg || 25.50,
                mandiAvgPerKg: l.market_reference_price || ((l.base_price_per_kg || 25.50) * 0.94),
                freightPerKg: 1.20,
                origin: l.farmer_district || 'Nashik East Cluster, Maharashtra',
                distanceKm: l.distance_km || 38,
                harvestDate: l.harvest_date || '2026-08-23',
                status: l.status || 'LISTED',
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

          // Deduplicate and only update state if actual changes happened
          setMyLots(prev => {
            const combined = [...localLots, ...mappedLots, ...prev].filter(l => !deletedIds.includes(l.id));
            const deduplicated = Array.from(new Map(combined.map(item => [item.id, item])).values());
            if (JSON.stringify(prev) === JSON.stringify(deduplicated)) {
              return prev;
            }
            return deduplicated;
          });
        }
      } else if (localLots.length > 0) {
        setMyLots(prev => {
          const filtered = localLots.filter(l => !deletedIds.includes(l.id));
          return JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered;
        });
      }
    } catch {
      setBids(prev => JSON.stringify(prev) === JSON.stringify(defaultBids) ? prev : defaultBids);
      if (localLots.length > 0) {
        setMyLots(prev => {
          const filtered = localLots.filter(l => !deletedIds.includes(l.id));
          return JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered;
        });
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

  const handleCreateNewLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLot(true);

    const quantityKg = quantityTons * 1000;
    const newLotNumericId = Number(Date.now().toString().slice(-5));
    const newLotId = `LOT-${newLotNumericId}`;

    const newCropLot: CropLot = {
      id: newLotId,
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: cropName,
      variety: variety || 'Certified Hybrid',
      quantityKg: quantityKg,
      quantityTons: quantityTons,
      grade: (aiGrade === 'B' ? 'B' : aiGrade === 'C' ? 'C' : 'A') as 'A' | 'B' | 'C',
      qualityGrade: `Grade ${aiGrade || 'A'}` as any,
      qualityScore: aiScore || 94.2,
      basePricePerKg: basePricePerKg,
      askingFloorPerKg: basePricePerKg,
      mandiAvgPerKg: Number((basePricePerKg * 0.94).toFixed(2)),
      freightPerKg: 1.20,
      origin: `${district}, Maharashtra`,
      distanceKm: 38,
      harvestDate: new Date().toISOString().split('T')[0],
      status: 'LISTED',
      location: {
        lat: 20.0125,
        lng: 73.7910,
        district: district,
        state: 'Maharashtra'
      },
      defectPercentage: aiDefect || 1.4,
      defectArea: aiDefect || 1.4,
      ripenessIndex: aiRipeness || 95.0,
      imageUrl: lotPhotoUrl
    };

    // 1. Immediately persist to localStorage for instant cross-tab Buyer sync
    try {
      const savedLotsStr = localStorage.getItem('kisansetu_crop_lots');
      let currentLots: CropLot[] = savedLotsStr ? JSON.parse(savedLotsStr) : [];
      currentLots = [newCropLot, ...currentLots.filter(l => l.id !== newLotId)];
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(currentLots));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    // 2. Also POST to backend API
    try {
      const res = await fetch('http://localhost:8000/api/marketplace/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: 1,
          farmer_name: 'Ramesh Patil',
          commodity: cropName,
          variety: variety,
          quantity_kg: quantityKg,
          base_price_per_kg: basePricePerKg,
          district: district,
          state: 'Maharashtra',
          latitude: 20.0125,
          longitude: 73.7910,
          destination_mandi: mandi,
          image_url: lotPhotoUrl,
          quality_grade: aiGrade,
          quality_score: aiScore,
          defect_percentage: aiDefect,
          ripeness_index: aiRipeness
        })
      });

      if (res.ok) {
        const createdLot = await res.json();
        triggerToast(`🎉 Crop Listed! Lot #LOT-${createdLot.id || newLotNumericId} (${quantityTons} Tons of ${cropName}) is now live on Buyer Marketplace with Grade ${aiGrade} certification.`);
        await fetchLiveBidsAndLots();
        setActiveTab('overview');
      } else {
        triggerToast(`🎉 Crop Listed! Lot #${newLotId} (${quantityTons} Tons of ${cropName}) is now live on Buyer Marketplace.`);
        setActiveTab('overview');
      }
    } catch {
      triggerToast(`🎉 Crop Listed! Lot #${newLotId} (${quantityTons} Tons of ${cropName}) is now live on Buyer Marketplace.`);
      setActiveTab('overview');
    } finally {
      setIsSubmittingLot(false);
    }
  };

  const handleAcceptBid = async (bidIdStr: string) => {
    const numericBidId = parseInt(bidIdStr.replace(/\D/g, ''), 10) || 1;

    try {
      const res = await fetch(`http://localhost:8000/api/escrow/accept-bid/${numericBidId}`, {
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

  const handleTogglePooling = () => {
    if (!isPooled) {
      setIsPooled(true);
      triggerToast('🎉 Joined Nashik East FPO Freight Pool! Lot (5.0T) added to shared 45-Ton milk-run truck. Freight reduced by 31.5%.');
    } else {
      setIsPooled(false);
      triggerToast('⚠️ Left FPO Freight Pool. Lot is now marked for direct individual transport.');
    }
  };

  const highestBid = bids.length > 0
    ? bids.reduce((max, b) => b.amountPerKg > max ? b.amountPerKg : max, 0)
    : 26.50;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="FARMER" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Title with Badges & + List Crop Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Farmer Command Center</h2>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                {myLots.length > 0 ? `${myLots.length} Lots Active` : 'Lot #LOT-1 Active'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                isPooled 
                  ? 'bg-purple-100 text-purple-800 border-purple-300' 
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {isPooled ? '👥 FPO Pooled' : '📦 Direct Sale'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ramesh Patil • Nashik, Maharashtra • DigiLocker Verified
            </p>
          </div>

          <Button
            onClick={() => setIsListModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-10 px-5 shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span>➕ List New Crop Produce</span>
          </Button>
        </div>

        {/* Quick Action Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setIsListModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 hover:bg-white`}
          >
            ➕ List New Crop (Modal)
          </button>
          <button
            onClick={() => setActiveTab('fpo-pooling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fpo-pooling' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 Join FPO Pool
          </button>
          <button
            onClick={() => setActiveTab('ai-grading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ai-grading' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔬 YOLOv8 AI Grading
          </button>
          <button
            onClick={() => setActiveTab('decision-engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'decision-engine' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📈 Market Intelligence
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'escrow' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Escrow Rails
          </button>
          <button
            onClick={() => setActiveTab('whatsapp-bot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'whatsapp-bot' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📱 WhatsApp Bot
          </button>
        </div>

        {toastMsg && (
          <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-fade-in flex justify-between items-center shadow-xs">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4">✕</button>
          </div>
        )}

        {/* 4 Premium Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Quality Grade</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-emerald-700">Grade A</p>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                94.2% Score
              </span>
            </div>
            <p className="text-[11px] text-slate-500">YOLOv8 Neural Segmentation</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Highest Active Bid</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900 font-mono">₹{highestBid.toFixed(2)}/kg</p>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                {bids.length} Total Bids
              </span>
            </div>
            <p className="text-[11px] text-slate-500">₹{(highestBid * 5000).toLocaleString('en-IN')} Total Lot Valuation</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Escrow Security</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-blue-700">100% Locked</p>
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                Bank Vault
              </span>
            </div>
            <p className="text-[11px] text-slate-500">₹1,39,250 Total Guarantee</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">FPO Freight Pooling</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-purple-700">{isPooled ? '-31.5% Cost' : 'Individual'}</p>
              <span className="text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                {isPooled ? 'Nashik East' : 'Unpooled'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isPooled ? 'Saved ~₹1,450 on truck freight' : 'Join a pool to save ~30%'}
            </p>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick FPO Status Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Freight Pooling Status:</span>
                  <span className="rounded-full bg-purple-300 text-purple-950 px-2.5 py-0.5 text-xs font-black">
                    {isPooled ? 'CONNECTED TO NASHIK EAST COLLECTIVE' : 'INDIVIDUAL TRANSPORT'}
                  </span>
                </div>
                <p className="text-xs text-purple-100 max-w-2xl">
                  {isPooled
                    ? 'Your Sharbati Wheat lot is grouped with 13 neighboring farmers into a 45-ton milk-run truck, saving you ₹1,450 in freight.'
                    : 'You are currently listed for individual freight. Join a local 10-km radius pool to save ~30% in transport fees.'}
                </p>
              </div>
              <Button
                onClick={handleTogglePooling}
                className={`text-xs font-bold px-5 h-10 shadow-sm whitespace-nowrap ${
                  isPooled
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                }`}
              >
                {isPooled ? 'Leave FPO Pool' : '⚡ Join Nashik East Pool (-31.5% Freight)'}
              </Button>
            </div>

            {/* My Active Harvest Lots */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>🌾</span> My Active Produce Listings ({myLots.length})
                  </h3>
                  <p className="text-xs text-slate-500">Live harvest lots published to KisanSetu institutional buyer network</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsListModalOpen(true)}
                  className="h-8 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  + Add Another Lot
                </Button>
              </div>

              {myLots.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
                  <p className="text-xs text-slate-500 font-mono">No active harvest lots listed yet.</p>
                  <Button
                    size="sm"
                    onClick={() => setIsListModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    ➕ List First Harvest Lot
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myLots.map((lot, idx) => (
                    <div
                      key={`farmer-lot-${lot.id}-${idx}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950/5 border border-slate-200 group/img">
                          <img
                            src={resolveCropImageUrl(lot.cropName, lot.imageUrl)}
                            alt={lot.cropName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = resolveCropImageUrl(lot.cropName);
                            }}
                          />
                          <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                            {lot.qualityGrade || 'Grade A'} ({lot.qualityScore || 95}%)
                          </span>

                          {/* Quick Delist Button on Image Overlay */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLot(lot.id, lot.cropName);
                            }}
                            className="absolute top-2 left-2 bg-slate-950/70 hover:bg-rose-600 text-white/80 hover:text-white p-1.5 rounded-lg backdrop-blur-xs transition-all border border-white/20 cursor-pointer shadow-sm"
                            title="Remove / Delist this lot"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black font-mono text-emerald-800">
                              {lot.id}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 truncate">
                              {lot.cropName}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {lot.variety}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {lot.status}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-600 font-bold">
                          {(lot.quantityTons || (lot.quantityKg / 1000)).toFixed(1)} MT
                        </span>

                        <div className="flex items-center gap-2">
                          <strong className="text-emerald-900 font-black text-sm">
                            ₹{lot.basePricePerKg.toFixed(2)}/kg
                          </strong>
                          <button
                            type="button"
                            onClick={() => handleDeleteLot(lot.id, lot.cropName)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="Delist & Remove Produce Lot"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <PriceChart commodity="Sharbati Wheat" mandiPrices={mockPrices} />
            
            {/* Live Bids Table from Backend */}
            <BidTable
              bids={bids}
              isFarmerView={true}
              onAcceptBid={handleAcceptBid}
            />

            <EscrowTracker />
          </div>
        )}

        {/* Tab 2: List New Crop Form */}
        {activeTab === 'list-crop' && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-emerald-50 pb-4">
              <h3 className="text-lg font-black text-slate-900">List New Harvested Crop Produce</h3>
              <p className="text-xs text-slate-500">Publish your crop directly to institutional millers, buyers, and FPO freight pools</p>
            </div>

            <form onSubmit={handleCreateNewLot} className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commodity / Crop</label>
                  <select
                    className="w-full text-xs h-10 rounded-xl border border-slate-300 bg-white px-3 font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  >
                    <option value="Sharbati Wheat">🌾 Sharbati Wheat</option>
                    <option value="Red Onion">🧅 Nashik Red Onion</option>
                    <option value="Hybrid Tomato">🍅 Hybrid Tomato</option>
                    <option value="Basmati Rice">🍚 Basmati Rice (Pusa 1121)</option>
                    <option value="Soybean">🌱 Yellow Soybean</option>
                    <option value="Cotton">☁️ Long Staple Cotton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Variety / Grade Tag</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Lok-1, Garva, Vaishali"
                    className="bg-white border-slate-300 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Quantity (in Tons)</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    className="bg-white border-slate-300 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
                    value={quantityTons}
                    onChange={(e) => setQuantityTons(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{(quantityTons * 10).toFixed(0)} Quintals / {(quantityTons * 1000).toLocaleString('en-IN')} kg</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asking Floor Price (₹/kg)</label>
                  <Input
                    type="number"
                    step="0.25"
                    min="1"
                    required
                    className="bg-white border-slate-300 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
                    value={basePricePerKg}
                    onChange={(e) => setBasePricePerKg(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Today's Modal: ₹25.50/kg</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farm District & State</label>
                  <Input
                    type="text"
                    required
                    className="bg-white border-slate-300 text-slate-900 text-xs h-10 font-bold focus:border-emerald-500"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Maharashtra (GPS: 20.01° N, 73.79° E)</span>
                </div>
              </div>

              {/* Valuation & Quality Summary Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-900 block">Estimated Lot Floor Valuation</span>
                  <p className="text-2xl font-black text-emerald-800 font-mono">
                    ₹{(quantityTons * 1000 * basePricePerKg).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                    ✓ Pre-Certified Grade A (YOLOv8)
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs h-11 px-5 border-slate-300"
                  onClick={() => setActiveTab('overview')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 px-8 shadow-sm"
                  disabled={isSubmittingLot}
                >
                  {isSubmittingLot ? 'Publishing to Marketplace...' : '🚀 Publish Lot to Buyer Marketplace'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: FPO Pooling */}
        {activeTab === 'fpo-pooling' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-emerald-50 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Nearby FPO Freight Pools (10-km Radius)</h3>
                  <p className="text-xs text-slate-500">Shared milk-run transport routing powered by PostGIS & OpenRouteService</p>
                </div>
                <Button
                  onClick={handleTogglePooling}
                  className={`text-xs font-bold px-6 h-10 shadow-xs ${
                    isPooled
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white font-black'
                  }`}
                >
                  {isPooled ? 'Leave Active Pool' : '⚡ Join Nashik East Collective'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClusters.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-2xl p-5 border transition-all space-y-3 ${
                      c.id === 'CLST-01' && isPooled
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{c.clusterName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{c.participatingFarmersCount} Farmers • {(c.totalWeightKg / 1000).toFixed(1)} Tons Pooled</p>
                      </div>
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        -{c.estimatedFreightSavingsPercent}% Freight
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Truck Target (50 Tons)</span>
                        <span className="text-emerald-700 font-mono">{(c.totalWeightKg / 500).toFixed(0)}% Filled</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min((c.totalWeightKg / 50000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span>Destination: <strong>Vashi APMC Mandi</strong></span>
                      {c.id === 'CLST-01' && isPooled ? (
                        <span className="text-emerald-700 font-extrabold">✓ Currently Enrolled</span>
                      ) : (
                        <span className="text-slate-400">Available to Join</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ClusterMap clusters={mockClusters} />
          </div>
        )}

        {activeTab === 'ai-grading' && (
          <div className="space-y-6">
            <AIGradingCard
              onApplyToLot={(data) => {
                const baseCommodity = data.commodity.split(' ')[0] || 'Wheat';
                setCropName(baseCommodity);
                setVariety(`${data.commodity} • Grade ${data.grade} Certified`);
                setAiGrade(data.grade);
                setAiScore(data.score);
                setAiDefect(data.defectPercent);
                setAiRipeness(data.ripenessIndex);
                if (data.imagePreviewUrl) {
                  setLotPhotoUrl(data.imagePreviewUrl);
                }
                if (data.grade === 'A') setBasePricePerKg(28.50);
                else if (data.grade === 'B') setBasePricePerKg(24.00);
                else setBasePricePerKg(19.50);
                setActiveTab('list-crop');
                triggerToast(`🔬 AI Certified: ${data.commodity} (Grade ${data.grade}, ${data.score}% Score)! Photo and certified grade transferred to listing.`);
              }}
            />
          </div>
        )}

        {activeTab === 'decision-engine' && (
          <div className="space-y-6">
            <SellVsWaitCard />
            <PriceChart commodity="Sharbati Wheat" mandiPrices={mockPrices} />
          </div>
        )}

        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <EscrowTracker />
          </div>
        )}

        {activeTab === 'whatsapp-bot' && (
          <div className="space-y-6">
            <WhatsAppSimulatorModal />
          </div>
        )}

        {/* Feature 1: Multi-Modal Crop Listing & YOLOv8 Visual Assay Modal */}
        <ListNewCropModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          onLotPublished={(newLot) => {
            setMyLots(prev => [newLot, ...prev.filter(l => l.id !== newLot.id)]);
            fetchLiveBidsAndLots();
          }}
        />
      </main>
    </div>
  );
}
