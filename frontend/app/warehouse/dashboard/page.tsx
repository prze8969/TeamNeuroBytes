'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Warehouse, 
  Thermometer, 
  Droplets, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Boxes, 
  ShieldCheck, 
  Search,
  Activity,
  Layers,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

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
  qualityGrade: string;
  enwrNumber: string;
  status: 'STORAGE' | 'DISPATCH_READY' | 'DISPATCHED';
}

export default function WarehouseDashboardPage() {
  const [storedLots, setStoredLots] = useState<StoredLot[]>([
    {
      id: 'WH-01',
      lotNumber: 'LOT-101',
      farmerName: 'Suresh Patil (Nashik East FPO)',
      commodity: 'Sharbati Wheat (Lok-1)',
      weightTons: 5.0,
      bayLocation: 'Cold Bay A-4',
      temperatureCelcius: 14.2,
      humidityPercent: 55,
      entryDate: '2026-08-21',
      qualityGrade: 'Grade A (95.8%)',
      enwrNumber: 'eNWR-WDRA-2026-8891',
      status: 'STORAGE',
    },
    {
      id: 'WH-02',
      lotNumber: 'LOT-102',
      farmerName: 'Anil Deshmukh (Sahyadri FPC)',
      commodity: 'Pusa 1121 Basmati Rice',
      weightTons: 8.0,
      bayLocation: 'Dry Grain Silo B-12',
      temperatureCelcius: 22.0,
      humidityPercent: 48,
      entryDate: '2026-08-22',
      qualityGrade: 'Grade A (96.2%)',
      enwrNumber: 'eNWR-WDRA-2026-8892',
      status: 'DISPATCH_READY',
    },
    {
      id: 'WH-03',
      lotNumber: 'LOT-103',
      farmerName: 'Kailash Jadhav (Niphad Cluster)',
      commodity: 'Nashik Red Onion (Garva)',
      weightTons: 12.0,
      bayLocation: 'Ventilated Bay C-2',
      temperatureCelcius: 16.5,
      humidityPercent: 62,
      entryDate: '2026-08-23',
      qualityGrade: 'Grade A (94.0%)',
      enwrNumber: 'eNWR-WDRA-2026-8893',
      status: 'STORAGE',
    },
    {
      id: 'WH-04',
      lotNumber: 'LOT-104',
      farmerName: 'Ramesh Patil (Nashik East FPO)',
      commodity: 'Grand Naine Banana',
      weightTons: 5.0,
      bayLocation: 'Cold Bay A-1',
      temperatureCelcius: 13.0,
      humidityPercent: 85,
      entryDate: '2026-08-24',
      qualityGrade: 'Grade A (96.5%)',
      enwrNumber: 'eNWR-WDRA-2026-8894',
      status: 'DISPATCH_READY',
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLotForReceipt, setSelectedLotForReceipt] = useState<StoredLot | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // New Check-in Form State
  const [newFarmerName, setNewFarmerName] = useState('Ramesh Patil');
  const [newCommodity, setNewCommodity] = useState('Hybrid Tomato (Vaishali)');
  const [newWeight, setNewWeight] = useState(4.5);
  const [newBay, setNewBay] = useState('Cold Bay A-2');

  const filteredLots = storedLots.filter(l => 
    l.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.bayLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInwardLot = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: StoredLot = {
      id: `WH-0${storedLots.length + 1}`,
      lotNumber: `LOT-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: `${newFarmerName} (Nashik East FPO)`,
      commodity: newCommodity,
      weightTons: Number(newWeight),
      bayLocation: newBay,
      temperatureCelcius: 12.8,
      humidityPercent: 84,
      entryDate: new Date().toISOString().split('T')[0],
      qualityGrade: 'Grade A (95.0%)',
      enwrNumber: `eNWR-WDRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'STORAGE'
    };

    setStoredLots([newLot, ...storedLots]);
    setIsCheckInOpen(false);
    toast.success('🎉 Lot Inwarded & e-NWR Minted!', {
      description: `${newLot.commodity} (${newLot.weightTons} MT) stored in ${newLot.bayLocation}. Electronic receipt ${newLot.enwrNumber} generated.`
    });
  };

  const totalStorageTons = 500;
  const currentOccupiedTons = storedLots.reduce((sum, l) => sum + l.weightTons, 0);
  const occupancyPct = Math.round((currentOccupiedTons / totalStorageTons) * 100);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar activeRole="WAREHOUSE" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Strip */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-600/20">
                🏭
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Niphad Central Aggregation Yard &amp; Cold Chain Hub
                  </h1>
                  <span className="rounded-full bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 text-[10px] font-black font-mono uppercase">
                    WDRA Reg #WD-MH-4401
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Integrated with Sahyadri FPO Collective &amp; e-NAM Electronic Negotiable Warehouse Receipts (e-NWR)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-black h-11 px-5 rounded-2xl shadow-md shadow-blue-700/20 ring-2 ring-blue-400/30 transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => setIsCheckInOpen(true)}
            >
              <QrCode size={16} />
              <span>+ QR Scan &amp; Inward Lot</span>
            </Button>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Warehouse Capacity</span>
              <Warehouse className="w-5 h-5 text-blue-700" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{totalStorageTons} MT</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                <span>Occupied ({occupancyPct}%)</span>
                <span className="text-blue-700">{currentOccupiedTons.toFixed(1)} MT Active</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${occupancyPct}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cold Chain Telemetry</span>
              <Thermometer className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-teal-700 font-mono">13.2°C</p>
            <p className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              58% RH • Backup Power Active
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready for APMC Dispatch</span>
              <Boxes className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-700 font-mono">2 Lots</p>
            <p className="text-[11px] text-slate-500 font-medium">Transporter Milk-Run Scheduled</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WDRA Bank Pledge Value</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-800 font-mono">₹7.42 Lakh</p>
            <p className="text-[11px] text-emerald-700 font-bold">70% Instant Post-Harvest Liquidity</p>
          </div>
        </div>

        {/* Warehouse Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>📦 Active Storage Lots &amp; Cold Bays ({filteredLots.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time IoT telemetry, WDRA certified electronic receipts, and gate release status
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lot, crop, or bay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                  <TableHead>Lot ID &amp; e-NWR</TableHead>
                  <TableHead>Produce &amp; Grade</TableHead>
                  <TableHead>Farmer / FPO</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Bay &amp; Telemetry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredLots.map((lot) => (
                  <TableRow key={lot.id} className="hover:bg-blue-50/40 transition-colors">
                    <TableCell>
                      <span className="font-mono font-black text-slate-900 block">{lot.lotNumber}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">{lot.enwrNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-900 block">{lot.commodity}</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {lot.qualityGrade}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{lot.farmerName}</TableCell>
                    <TableCell className="font-mono font-black text-slate-900">{lot.weightTons} MT</TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-800 block">{lot.bayLocation}</span>
                      <span className="text-[11px] font-mono text-teal-700 font-bold">
                        {lot.temperatureCelcius}°C • {lot.humidityPercent}% RH
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase font-mono ${
                        lot.status === 'DISPATCH_READY' 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {lot.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                        onClick={() => setSelectedLotForReceipt(lot)}
                      >
                        <FileText size={13} className="mr-1" />
                        e-NWR Slip
                      </Button>
                      {lot.status === 'DISPATCH_READY' && (
                        <Button
                          size="sm"
                          className="h-8 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          onClick={() => {
                            toast.success(`Gate Pass Issued for ${lot.lotNumber}`, {
                              description: `Handed over to Transporter multi-axle truck MH-15-EG-4421.`
                            });
                          }}
                        >
                          Release Gate Pass 🚛
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* e-NWR Receipt Modal */}
        {selectedLotForReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    📄
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Electronic Negotiable Warehouse Receipt</h3>
                    <p className="text-[10px] font-mono text-slate-500">WDRA Verified • {selectedLotForReceipt.enwrNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLotForReceipt(null)} className="text-slate-400 hover:text-slate-700 font-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Depositor / Farmer</span>
                    <strong className="text-slate-900">{selectedLotForReceipt.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Warehouse Hub</span>
                    <strong className="text-slate-900">Niphad Cold Chain Yard</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Commodity &amp; Grade</span>
                    <strong className="text-slate-900">{selectedLotForReceipt.commodity}</strong>
                    <p className="text-[10px] text-emerald-700 font-bold">{selectedLotForReceipt.qualityGrade}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Net Stored Volume</span>
                    <strong className="text-slate-900 font-mono text-sm">{selectedLotForReceipt.weightTons} Metric Tons</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Storage Bay</span>
                    <strong className="text-blue-900">{selectedLotForReceipt.bayLocation}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Telemetry at Deposit</span>
                    <strong className="text-teal-900 font-mono">{selectedLotForReceipt.temperatureCelcius}°C / {selectedLotForReceipt.humidityPercent}% RH</strong>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold h-10 rounded-xl"
                  onClick={() => {
                    toast.success('Pledged for Instant Kisan Credit Loan', {
                      description: `Pledged ${selectedLotForReceipt.enwrNumber} with SBI/NABARD for ₹${(selectedLotForReceipt.weightTons * 22000 * 0.7).toLocaleString('en-IN')} credit at 4% p.a.`
                    });
                    setSelectedLotForReceipt(null);
                  }}
                >
                  Pledge for 70% Bank Loan 🏦
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-bold h-10 rounded-xl border-slate-200"
                  onClick={() => setSelectedLotForReceipt(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Inward QR Scan Modal */}
        {isCheckInOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <QrCode size={16} />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">Gate Inward Check-In</h3>
                </div>
                <button onClick={() => setIsCheckInOpen(false)} className="text-slate-400 hover:text-slate-700 font-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInwardLot} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Farmer Name / FPO</label>
                  <input
                    type="text"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Commodity &amp; Variety</label>
                  <input
                    type="text"
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Weight (Metric Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assigned Bay</label>
                    <select
                      value={newBay}
                      onChange={(e) => setNewBay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                    >
                      <option value="Cold Bay A-1">Cold Bay A-1 (13°C)</option>
                      <option value="Cold Bay A-2">Cold Bay A-2 (14°C)</option>
                      <option value="Dry Grain Silo B-1">Dry Silo B-1</option>
                      <option value="Dry Grain Silo B-2">Dry Silo B-2</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-700" />
                    Automated WDRA e-NWR Minting
                  </span>
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    Check-in will generate a digital receipt enabling the farmer to receive immediate 70% post-harvest credit.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-black h-10 rounded-xl cursor-pointer"
                  >
                    Confirm Inward &amp; Issue e-NWR 📄
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
