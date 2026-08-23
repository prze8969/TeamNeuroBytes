'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface TransportTrip {
  id: string;
  tripCode: string;
  clusterName: string;
  destinationMandi: string;
  vehicleNumber: string;
  driverName: string;
  capacityTons: number;
  advanceFreightPayout: number;
  status: 'ASSIGNED' | 'EN_ROUTE' | 'DELIVERED';
}

export default function TransportationDashboardPage() {
  const [trips] = useState<TransportTrip[]>([
    {
      id: 'TRIP-901',
      tripCode: 'TRIP-NSK-01',
      clusterName: 'Nashik East Farmers Pool (45 Tons)',
      destinationMandi: 'Vashi APMC Mandi, Mumbai',
      vehicleNumber: 'MH-15-EG-4821 (16-Wheeler)',
      driverName: 'Rajesh Shinde',
      capacityTons: 25.0,
      advanceFreightPayout: 18500,
      status: 'EN_ROUTE',
    },
    {
      id: 'TRIP-902',
      tripCode: 'TRIP-PNE-04',
      clusterName: 'Pune-Shirur Grain Collective (78 Tons)',
      destinationMandi: 'Jawahar Market, Pune',
      vehicleNumber: 'MH-12-QX-9012 (10-Wheeler)',
      driverName: 'Ganesh More',
      capacityTons: 15.0,
      advanceFreightPayout: 12000,
      status: 'ASSIGNED',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transportation & Logistics Command Center</h1>
            <p className="text-xs text-gray-500">Shared transport route optimization & instant Advance Freight Escrow payouts</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>

        {/* Transport Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Active Trucks En-Route</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">18 Vehicles</p>
            <p className="text-xs text-gray-500 mt-1">GPS Telematics Active</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Total Produce in Transit</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">210 Tons</p>
            <p className="text-xs text-gray-500 mt-1">Nashik ➔ Mumbai / Pune</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Geo-Cluster Fuel Saved</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">29% Savings</p>
            <p className="text-xs text-blue-600 mt-1">Multi-stop route optimization</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Escrow Advance Freight Payouts</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">₹3.45 Lakhs</p>
            <p className="text-xs text-emerald-600 mt-1">50% Advance Disbursed</p>
          </div>
        </div>

        {/* Active Transport Trips Table */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Active Freight Assignments</h3>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              + Accept Geo-Cluster Dispatch
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip Code</TableHead>
                <TableHead>Origin (FPO Cluster)</TableHead>
                <TableHead>Destination Mandi</TableHead>
                <TableHead>Vehicle & Driver</TableHead>
                <TableHead>Advance Freight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-mono text-xs font-bold text-gray-900">{trip.tripCode}</TableCell>
                  <TableCell className="font-medium text-gray-900">{trip.clusterName}</TableCell>
                  <TableCell className="text-gray-700">{trip.destinationMandi}</TableCell>
                  <TableCell className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-900">{trip.driverName}</p>
                    <p>{trip.vehicleNumber}</p>
                  </TableCell>
                  <TableCell className="font-bold text-emerald-700">₹{trip.advanceFreightPayout.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      trip.status === 'EN_ROUTE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trip.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      GPS Tracking
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
