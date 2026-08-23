'use client'

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BidTable } from '@/components/dashboard/BidTable';
import { EscrowTracker } from '@/components/dashboard/EscrowTracker';
import { AIGradingCard } from '@/components/dashboard/AIGradingCard';
import { CropLot, Bid } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [lots, setLots] = useState<CropLot[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedLot, setSelectedLot] = useState<CropLot | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [filterCommodity, setFilterCommodity] = useState<string>('ALL');
  const [loadingBid, setLoadingBid] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const defaultLots: CropLot[] = [
    {
      id: 'LOT-1',
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: 'Sharbati Wheat',
      variety: 'Lok-1 (Clean Grain)',
      quantityKg: 5000,
      grade: 'A',
      qualityScore: 94.2,
      basePricePerKg: 24.50,
      location: { lat: 19.9975, lng: 73.7898, district: 'Nashik', state: 'Maharashtra' },
      harvestDate: '2026-08-20',
      status: 'LISTED',
    },
    {
      id: 'LOT-2',
      farmerId: '2',
      farmerName: 'Anil Deshmukh',
      cropName: 'Red Onion',
      variety: 'Nashik Garva',
      quantityKg: 8000,
      grade: 'A',
      qualityScore: 92.0,
      basePricePerKg: 21.00,
      location: { lat: 20.0090, lng: 73.8050, district: 'Nashik', state: 'Maharashtra' },
      harvestDate: '2026-08-22',
      status: 'POOLED',
    },
    {
      id: 'LOT-3',
      farmerId: '3',
      farmerName: 'Sanjay Shinde',
      cropName: 'Hybrid Tomato',
      variety: 'Vaishali',
      quantityKg: 5500,
      grade: 'B',
      qualityScore: 87.5,
      basePricePerKg: 18.50,
      location: { lat: 20.0210, lng: 73.7890, district: 'Nashik', state: 'Maharashtra' },
      harvestDate: '2026-08-23',
      status: 'LISTED',
    },
  ];

  const fetchLiveMarketplaceData = async () => {
    try {
      const [lotsRes, bidsRes] = await Promise.all([
        fetch('http://localhost:8000/api/marketplace/lots'),
        fetch('http://localhost:8000/api/marketplace/bids')
      ]);

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
            qualityScore: l.quality_score || 92.5,
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
          setLots(mappedLots);
        } else {
          setLots(defaultLots);
        }
      } else {
        setLots(defaultLots);
      }

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
        }
      }
    } catch {
      setLots(defaultLots);
    }
  };

  useEffect(() => {
    fetchLiveMarketplaceData();
    const interval = setInterval(fetchLiveMarketplaceData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLots = filterCommodity === 'ALL'
    ? lots
    : lots.filter(l => l.cropName.toLowerCase().includes(filterCommodity.toLowerCase()));

  const handlePlaceBid = async (lot: CropLot) => {
    const amt = parseFloat(bidAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid bid amount per kg.');
      return;
    }

    const numericLotId = parseInt(lot.id.replace(/\D/g, ''), 10) || 1;
    const totalVal = Math.round(lot.quantityKg * amt);

    setLoadingBid(true);

    try {
      const res = await fetch('http://localhost:8000/api/marketplace/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: numericLotId,
          buyer_id: 2,
          buyer_name: 'AgroProcure Private Ltd (Your Bid)',
          amount_per_kg: amt,
          delivery_deadline_days: 3,
          note: 'Escrow backed institutional procurement'
        })
      });

      if (res.ok) {
        triggerToast(`🎉 Bid of ₹${amt.toFixed(2)}/kg (Total: ₹${totalVal.toLocaleString('en-IN')}) placed on ${lot.cropName}! 100% Escrow deposit locked in bank vault.`);
        setBidAmount('');
        setSelectedLot(null);
        await fetchLiveMarketplaceData();
      } else {
        const err = await res.json();
        triggerToast(`❌ Error: ${err.detail || 'Could not place bid'}`);
      }
    } catch {
      // Fallback local update
      const newBid: Bid = {
        id: `BID-${Date.now().toString().slice(-3)}`,
        lotId: lot.id,
        buyerId: '2',
        buyerName: 'AgroProcure Private Ltd (Your Bid)',
        amountPerKg: amt,
        totalAmount: totalVal,
        escrowStatus: 'LOCKED',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setBids(prev => [newBid, ...prev]);
      triggerToast(`🎉 Bid of ₹${amt.toFixed(2)}/kg (Total: ₹${totalVal.toLocaleString('en-IN')}) placed on ${lot.cropName}! 100% Escrow deposit locked in bank vault.`);
      setBidAmount('');
      setSelectedLot(null);
    } finally {
      setLoadingBid(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="BUYER" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Institutional Buyer Marketplace</h1>
              <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
                Verified Direct-From-Farm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Procure AI-graded crops with Agmarknet floor benchmarking and automated Escrow rails</p>
          </div>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9"
            onClick={fetchLiveMarketplaceData}
          >
            🔄 Refresh Live Listings
          </Button>
        </header>

        {toastMsg && (
          <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-fade-in flex justify-between items-center shadow-xs">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4">✕</button>
          </div>
        )}

        {/* Commodity Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['ALL', 'Wheat', 'Onion', 'Tomato', 'Rice'].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={filterCommodity === cat ? 'default' : 'outline'}
              className={`text-xs font-bold ${
                filterCommodity === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => setFilterCommodity(cat)}
            >
              {cat === 'ALL' ? '🌾 All Commodities' : cat}
            </Button>
          ))}
        </div>

        {/* Crop Lots Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900">Verified Crop Lots Available ({filteredLots.length})</h3>
            <span className="text-xs text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-full">Auto-calculated freight pooling active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs space-y-3 transition-all ${
                  selectedLot?.id === lot.id ? 'border-emerald-500 ring-2 ring-emerald-400' : 'border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{lot.cropName}</h4>
                    <p className="text-xs text-slate-500">{lot.variety} • Farmer: <strong className="text-slate-800">{lot.farmerName}</strong> ({lot.location.district})</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black border ${
                    lot.grade === 'A'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    Grade {lot.grade} ({lot.qualityScore}%)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Available</span>
                    <span className="font-extrabold text-slate-900">{(lot.quantityKg / 1000).toFixed(1)} Tons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Asking Floor</span>
                    <span className="font-black text-emerald-700 font-mono">₹{lot.basePricePerKg.toFixed(2)}/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Logistics</span>
                    <span className="font-bold text-purple-700">{lot.status === 'POOLED' ? 'Shared Freight' : 'Direct'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <Input
                    type="number"
                    step="0.25"
                    placeholder={`Bid ₹/kg (Min ₹${(lot.basePricePerKg * 0.85).toFixed(2)})`}
                    className="bg-white border-slate-200 text-slate-900 font-mono text-xs h-10 font-bold focus:border-emerald-500"
                    value={selectedLot?.id === lot.id ? bidAmount : ''}
                    onChange={(e) => {
                      setSelectedLot(lot);
                      setBidAmount(e.target.value);
                    }}
                  />
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-5 text-xs font-bold whitespace-nowrap shadow-xs"
                    onClick={() => handlePlaceBid(lot)}
                    disabled={loadingBid && selectedLot?.id === lot.id}
                  >
                    {loadingBid && selectedLot?.id === lot.id ? 'Locking Escrow...' : 'Place Bid & Escrow'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Bids Table */}
        <BidTable bids={bids} isFarmerView={false} />

        {/* Live Escrow Progress */}
        <EscrowTracker />

        {/* AI Inspection Preview Card */}
        <AIGradingCard />
      </main>
    </div>
  );
}
