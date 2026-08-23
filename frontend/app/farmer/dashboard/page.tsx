'use client'

import { Button } from '@/components/ui/button'
import { PriceChart } from '@/components/dashboard/PriceChart'
import { BidTable } from '@/components/dashboard/BidTable'
import { Bid, MandiPrice } from '@/lib/types'

export default function FarmerDashboard() {
  const mockPrices: MandiPrice[] = [
    { mandiName: 'Nashik APMC', state: 'Maharashtra', district: 'Nashik', commodity: 'Wheat', minPrice: 2200, maxPrice: 2700, modalPrice: 2550, date: '2026-08-23', forecastNextWeek: 2720 },
    { mandiName: 'Lasalgaon APMC', state: 'Maharashtra', district: 'Nashik', commodity: 'Wheat', minPrice: 2150, maxPrice: 2650, modalPrice: 2480, date: '2026-08-23', forecastNextWeek: 2650 },
    { mandiName: 'Pune APMC', state: 'Maharashtra', district: 'Pune', commodity: 'Wheat', minPrice: 2300, maxPrice: 2800, modalPrice: 2600, date: '2026-08-23', forecastNextWeek: 2780 },
  ];

  const mockBids: Bid[] = [
    {
      id: 'BID-101',
      lotId: 'LOT-99',
      buyerId: 'BUYER-44',
      buyerName: 'Sahyadri Farmers Producer Co.',
      amountPerKg: 26.50,
      totalAmount: 132500,
      escrowStatus: 'LOCKED',
      createdAt: '2026-08-23 15:10',
    },
    {
      id: 'BID-102',
      lotId: 'LOT-99',
      buyerId: 'BUYER-12',
      buyerName: 'AgroProcure India',
      amountPerKg: 25.80,
      totalAmount: 129000,
      escrowStatus: 'INITIATED',
      createdAt: '2026-08-23 12:45',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-emerald-900 text-white p-6 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-2xl">🌾</span>
          <h1 className="text-xl font-extrabold tracking-tight">TeamNeuroBytes</h1>
        </div>
        <nav className="space-y-3 text-sm">
          <a href="#" className="block py-2.5 px-4 bg-emerald-800 font-medium rounded-lg">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-emerald-800 font-medium rounded-lg text-emerald-100">My Crop Lots</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-emerald-800 font-medium rounded-lg text-emerald-100">AI Quality Grading</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-emerald-800 font-medium rounded-lg text-emerald-100">Agmarknet Rates</a>
          <a href="/(auth)/kyc" className="block py-2.5 px-4 hover:bg-emerald-800 font-medium rounded-lg text-emerald-100">DigiLocker KYC</a>
        </nav>
      </aside>
      
      <main className="flex-1 p-6 md:p-8 space-y-6">
        <header className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Farmer Command Center</h2>
            <p className="text-xs text-gray-500">Desktop View • Sharbati Wheat Lot #LOT-99</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            window.location.href = '/login'
          }}>
            Sign Out
          </Button>
        </header>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-xs font-semibold uppercase">AI Quality Grade</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-emerald-600">Grade A</p>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">94.2% Score</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Validated via YOLOv8 Vision Model</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-xs font-semibold uppercase">Active Buyer Bids</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-gray-900">2 Bids</p>
              <span className="text-xs font-bold text-emerald-600">Highest: ₹26.50/kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">₹1,32,500 Total Valuation</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-xs font-semibold uppercase">Escrow Protection</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-blue-600">Locked</p>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Bank Verified</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Advance Freight Milestone Ready</p>
          </div>
        </div>

        {/* Agmarknet Price & AI Forecast */}
        <PriceChart commodity="Sharbati Wheat" mandiPrices={mockPrices} />

        {/* Bids Table */}
        <BidTable bids={mockBids} isFarmerView={true} onAcceptBid={(bidId) => alert(`Bid ${bidId} accepted! Escrow payment milestone initiated.`)} />
      </main>
    </div>
  )
}
