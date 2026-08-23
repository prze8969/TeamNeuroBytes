'use client'

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="TRANSPORTATION" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Transportation & Logistics Command Center</h1>
              <span className="rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 text-xs font-bold font-mono">
                Logistics Carrier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Shared transport route optimization & instant Advance Freight Escrow payouts</p>
          </div>
        </header>

        {/* Transport Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Trucks En-Route</p>
            <p className="text-3xl font-black text-emerald-700 mt-1 font-mono">18 Vehicles</p>
            <p className="text-[11px] text-slate-500 mt-1">GPS Telematics Active</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Produce in Transit</p>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">210 Tons</p>
            <p className="text-[11px] text-slate-500 mt-1">Nashik ➔ Mumbai / Pune</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Geo-Cluster Fuel Saved</p>
            <p className="text-3xl font-black text-purple-700 mt-1 font-mono">-29% Saved</p>
            <p className="text-[11px] text-purple-700 font-bold mt-1">Multi-stop route optimization</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Escrow Advance Payouts</p>
            <p className="text-3xl font-black text-amber-700 mt-1 font-mono">₹3.45 Lakhs</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">30% Advance Disbursed</p>
          </div>
        </div>

        {/* Active Transport Trips Table */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Active Freight Assignments</h3>
              <p className="text-xs text-slate-500">Milk-run pooling dispatch orders</p>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              + Accept Geo-Cluster Dispatch
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <TableHead>Trip Code</TableHead>
                <TableHead>Origin (FPO Cluster)</TableHead>
                <TableHead>Destination Mandi</TableHead>
                <TableHead>Vehicle & Driver</TableHead>
                <TableHead>Advance Freight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {trips.map((trip) => (
                <TableRow key={trip.id} className="hover:bg-emerald-50/40">
                  <TableCell className="font-mono text-xs font-bold text-slate-900">{trip.tripCode}</TableCell>
                  <TableCell className="font-bold text-slate-900">{trip.clusterName}</TableCell>
                  <TableCell className="text-slate-700 font-medium">{trip.destinationMandi}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <p className="font-bold text-slate-900">{trip.driverName}</p>
                    <p className="text-[11px] font-mono text-slate-500">{trip.vehicleNumber}</p>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-emerald-700 text-sm">
                    ₹{trip.advanceFreightPayout.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      trip.status === 'EN_ROUTE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {trip.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8">
                      GPS Live Track
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
