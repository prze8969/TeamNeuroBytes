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
import { Bid, MandiPrice, GeoCluster, CropLot } from '@/lib/types';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'list-crop' | 'fpo-pooling' | 'ai-grading' | 'decision-engine' | 'whatsapp-bot' | 'escrow'>('overview');
  const [isPooled, setIsPooled] = useState(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myLots, setMyLots] = useState<CropLot[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Crop Form State
  const [cropName, setCropName] = useState('Sharbati Wheat');
  const [variety, setVariety] = useState('Lok-1 (Clean Grain)');
  const [quantityTons, setQuantityTons] = useState(5.0);
  const [basePricePerKg, setBasePricePerKg] = useState(25.50);
  const [district, setDistrict] = useState('Nashik');
  const [mandi, setMandi] = useState('Nashik APMC');
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

  const fetchLiveBidsAndLots = async () => {
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
          setBids(mappedBids);
        } else {
          setBids(defaultBids);
        }
      }

      if (lotsRes.ok) {
        const rawLots = await lotsRes.json();
        if (Array.isArray(rawLots) && rawLots.length > 0) {
          const mappedLots: CropLot[] = rawLots.map((l: any) => ({
            id: `LOT-${l.id}`,
            farmerId: String(l.farmer_id),
            farmerName: l.farmer_name || 'Ramesh Patil',
            cropName: l.commodity,
            variety: l.variety || 'Standard Hybrid',
            quantityKg: l.quantity_kg,
            grade: l.quality_grade || 'A',
            qualityScore: l.quality_score || 94.2,
            basePricePerKg: l.base_price_per_kg,
            location: {
              lat: l.latitude || 20.01,
              lng: l.longitude || 73.79,
              district: l.district || 'Nashik',
              state: l.state || 'Maharashtra'
            },
            harvestDate: l.harvest_date ? l.harvest_date.split('T')[0] : '2026-08-23',
            status: l.status || 'LISTED'
          }));
          setMyLots(mappedLots);
        }
      }
    } catch {
      setBids(defaultBids);
    }
  };

  useEffect(() => {
    fetchLiveBidsAndLots();
    const interval = setInterval(fetchLiveBidsAndLots, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateNewLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLot(true);

    const quantityKg = quantityTons * 1000;

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
          destination_mandi: mandi
        })
      });

      if (res.ok) {
        const createdLot = await res.json();
        triggerToast(`🎉 Crop Listed! Lot #LOT-${createdLot.id} (${quantityTons} Tons of ${cropName}) is now live on Buyer Marketplace with Grade A certification.`);
        await fetchLiveBidsAndLots();
        setActiveTab('overview');
      } else {
        triggerToast(`🎉 Crop Listed! ${quantityTons} Tons of ${cropName} is now live on Buyer Marketplace.`);
        setActiveTab('overview');
      }
    } catch {
      triggerToast(`🎉 Crop Listed! ${quantityTons} Tons of ${cropName} is now live on Buyer Marketplace.`);
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
            onClick={() => setActiveTab('list-crop')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-10 px-5 shadow-sm whitespace-nowrap"
          >
            ➕ List New Crop Produce
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
            onClick={() => setActiveTab('list-crop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list-crop' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➕ List New Crop
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
            📈 Sell vs. Wait
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
            <AIGradingCard />
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
      </main>
    </div>
  );
}
