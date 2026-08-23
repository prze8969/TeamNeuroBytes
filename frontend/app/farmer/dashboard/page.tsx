'use client'

import { Button } from '@/components/ui/button'

export default function FarmerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-green-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">AgMarknet</h1>
        <nav className="space-y-4">
          <a href="#" className="block py-2 px-4 bg-green-700 rounded">Dashboard</a>
          <a href="#" className="block py-2 px-4 hover:bg-green-700 rounded">My Produce</a>
          <a href="#" className="block py-2 px-4 hover:bg-green-700 rounded">Transactions</a>
          <a href="#" className="block py-2 px-4 hover:bg-green-700 rounded">Price Recommendations</a>
        </nav>
      </aside>
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Farmer Dashboard</h2>
          <Button variant="outline" onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            window.location.href = '/login'
          }}>
            Logout
          </Button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Total Listings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Active Bids</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹ 45,000</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4">Recent Listings</h3>
          <div className="text-gray-500">
            Placeholder for listings table. Data will be fetched from /api/marketplace/listings
          </div>
        </div>
      </main>
    </div>
  )
}
