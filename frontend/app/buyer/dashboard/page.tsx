'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BidTable } from '@/components/dashboard/BidTable';
import { CropLot, Bid } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [selectedLot, setSelectedLot] = useState<CropLot | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');

  const mockLots: CropLot[] = [
    {
      id: 'LOT-101',
      farmerId: 'F-882',
      farmerName: 'Suresh Patil',
      cropName: 'Sharbati Wheat',
      variety: 'Lok-1',
      quantityKg: 5000,
      grade: 'A',
      qualityScore: 94.2,
      basePricePerKg: 24.50,
      location: { lat: 19.9975, lng: 73.7898, district: 'Nashik', state: 'Maharashtra' },
      harvestDate: '2026-08-20',
      status: 'LISTED',
    },
    {
      id: 'LOT-102',
      farmerId: 'F-903',
      farmerName: 'Anil Deshmukh',
      cropName: 'Basmati Rice',
      variety: 'Pusa 1121',
      quantityKg: 8000,
      grade: 'A',
      qualityScore: 96.0,
      basePricePerKg: 42.00,
      location: { lat: 18.5204, lng: 73.8567, district: 'Pune', state: 'Maharashtra' },
      harvestDate: '2026-08-22',
      status: 'POOLED',
    },
  ];

  const mockBids: Bid[] = [
    {
      id: 'BID-501',
      lotId: 'LOT-101',
      buyerId: 'B-10',
      buyerName: 'Global Mills & Co',
      amountPerKg: 26.00,
      totalAmount: 130000,
      escrowStatus: 'LOCKED',
      createdAt: '2026-08-23 14:30',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buyer Marketplace Dashboard</h1>
            <p className="text-xs text-gray-500">Procure AI-graded crops directly with milestone-based Escrow security</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>

        {/* Live Marketplace Crop Lots */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Verified Crop Lots Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLots.map((lot) => (
              <div key={lot.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{lot.cropName} ({lot.variety})</h4>
                    <p className="text-xs text-gray-500">Farmer: {lot.farmerName} • {lot.location.district}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    Grade {lot.grade} ({lot.qualityScore}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-500">Quantity:</span>{' '}
                    <span className="font-bold text-gray-900">{(lot.quantityKg / 1000).toFixed(1)} Tons</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Base Rate:</span>{' '}
                    <span className="font-bold text-emerald-700">₹{lot.basePricePerKg}/kg</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <Input
                    type="number"
                    placeholder="Enter bid ₹/kg"
                    className="text-xs h-9"
                    value={selectedLot?.id === lot.id ? bidAmount : ''}
                    onChange={(e) => {
                      setSelectedLot(lot);
                      setBidAmount(e.target.value);
                    }}
                  />
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 text-xs font-medium"
                    onClick={() => alert(`Bid of ₹${bidAmount}/kg submitted with Escrow lock request!`)}
                  >
                    Place Bid & Escrow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Bids */}
        <BidTable bids={mockBids} isFarmerView={false} />
      </div>
    </div>
  );
}
