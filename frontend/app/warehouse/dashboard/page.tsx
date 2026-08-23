'use client'

import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Warehouse & Cold Storage Command Center</h1>
            <p className="text-xs text-gray-500">Real-time inventory, telemetry monitoring & QR batch check-in/out</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>

        {/* Warehouse Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Total Storage Capacity</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">500 Tons</p>
            <p className="text-xs text-emerald-600 mt-1">68% Space Occupied</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Stored Produce Weight</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">340 Tons</p>
            <p className="text-xs text-gray-500 mt-1">Across 42 Batches</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Cold Bay Telemetry</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">14.2°C</p>
            <p className="text-xs text-blue-600 mt-1">Optimal Humidity (55%)</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Ready for Dispatch</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">8 Lots</p>
            <p className="text-xs text-gray-500 mt-1">Buyer Escrow Approved</p>
          </div>
        </div>

        {/* Warehouse Inventory Table */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Current Storage Batches</h3>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              + Scan QR & Check-In Lot
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
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
            <TableBody>
              {storedLots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-mono text-xs font-bold text-gray-900">{lot.lotNumber}</TableCell>
                  <TableCell className="font-medium text-gray-900">{lot.commodity}</TableCell>
                  <TableCell className="text-gray-600">{lot.farmerName}</TableCell>
                  <TableCell className="font-bold text-gray-900">{lot.weightTons} Tons</TableCell>
                  <TableCell className="text-gray-700">{lot.bayLocation}</TableCell>
                  <TableCell className="text-xs">
                    <span className="text-blue-700 font-semibold">{lot.temperatureCelcius}°C</span> / {lot.humidityPercent}% RH
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      lot.status === 'DISPATCH_READY' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {lot.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="text-xs">
                      Issue Receipt
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
