'use client'

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface StoredLot {
  id: string;
  lotNumber: string;
  farmerName: string;
  commodity: string;
  weightTons: number;
  bayLocation: string;
  temperatureCelcius: number;
  humidityPercent: number;
  entryDate: string;
  status: 'STORAGE' | 'DISPATCH_READY' | 'DISPATCHED';
}

export default function WarehouseDashboardPage() {
  const [storedLots] = useState<StoredLot[]>([
    {
      id: 'WH-01',
      lotNumber: 'LOT-101',
      farmerName: 'Suresh Patil',
      commodity: 'Sharbati Wheat (Grade A)',
      weightTons: 5.0,
      bayLocation: 'Cold Bay A-4',
      temperatureCelcius: 14.2,
      humidityPercent: 55,
      entryDate: '2026-08-21',
      status: 'STORAGE',
    },
    {
      id: 'WH-02',
      lotNumber: 'LOT-102',
      farmerName: 'Anil Deshmukh',
      commodity: 'Basmati Rice (Pusa 1121)',
      weightTons: 8.0,
      bayLocation: 'Dry Grain Bay B-12',
      temperatureCelcius: 22.0,
      humidityPercent: 48,
      entryDate: '2026-08-22',
      status: 'DISPATCH_READY',
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="WAREHOUSE" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Warehouse & Cold Storage Command Center</h1>
              <span className="rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 text-xs font-bold font-mono">
                Cold Chain Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time inventory, telemetry monitoring & QR batch check-in/out</p>
          </div>
        </header>

        {/* Warehouse Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Storage Capacity</p>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">500 Tons</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">68% Space Occupied</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stored Produce Weight</p>
            <p className="text-3xl font-black text-emerald-700 mt-1 font-mono">340 Tons</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 42 Batches</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cold Bay Telemetry</p>
            <p className="text-3xl font-black text-blue-700 mt-1 font-mono">14.2°C</p>
            <p className="text-[11px] text-blue-700 font-bold mt-1">Optimal Humidity (55%)</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ready for Dispatch</p>
            <p className="text-3xl font-black text-amber-700 mt-1 font-mono">8 Lots</p>
            <p className="text-[11px] text-slate-500 mt-1">Buyer Escrow Approved</p>
          </div>
        </div>

        {/* Warehouse Inventory Table */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Current Storage Batches</h3>
              <p className="text-xs text-slate-500">Live IoT sensor integration & humidity tracking</p>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              + Scan QR & Check-In Lot
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <TableHead>Lot ID</TableHead>
                <TableHead>Commodity & Grade</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Bay Location</TableHead>
                <TableHead>Telemetry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {storedLots.map((lot) => (
                <TableRow key={lot.id} className="hover:bg-emerald-50/40">
                  <TableCell className="font-mono text-xs font-bold text-slate-900">{lot.lotNumber}</TableCell>
                  <TableCell className="font-bold text-slate-900">{lot.commodity}</TableCell>
                  <TableCell className="text-slate-600">{lot.farmerName}</TableCell>
                  <TableCell className="font-extrabold text-slate-900">{lot.weightTons} Tons</TableCell>
                  <TableCell className="text-slate-700 font-medium">{lot.bayLocation}</TableCell>
                  <TableCell>
                    <span className="text-blue-700 font-bold">{lot.temperatureCelcius}°C</span> / {lot.humidityPercent}% RH
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      lot.status === 'DISPATCH_READY' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {lot.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="text-xs h-8 border-slate-200">
                      Issue Receipt
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
