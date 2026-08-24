'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Scale, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  PhoneCall,
  MessageCircle,
  X,
  FileCheck,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InvoiceOrderData, TaxInvoiceModal } from './TaxInvoiceModal';
import { toast } from 'sonner';

export interface OrderHistoryTableProps {
  orders?: InvoiceOrderData[];
}

const DEFAULT_ORDERS: InvoiceOrderData[] = [
  {
    order_id: "ORD-2026-8942",
    invoice_number: "INV-KS-20260824-8942",
    lot_id: "LOT-1",
    commodity: "Sharbati Wheat",
    variety: "Lok-1 (Clean Grain)",
    quantity_tons: 5.0,
    quantity_kg: 5000,
    unit_price_kg: 24.50,
    base_crop_value: 122500,
    freight_charges: 6000,
    apmc_cess: 1838,
    total_settlement: 130338,
    farmer_name: "Ramesh Patil",
    farmer_district: "Nashik Cluster, Maharashtra",
    carrier_name: "Kisan Express Logistics",
    vehicle_number: "MH-15-EG-4421",
    eway_bill_number: "EWB-2026-98412",
    escrow_status: "SETTLED",
    quality_grade: "Grade A (94.2%)",
    handover_date: "24 Aug 2026, 11:30 AM",
    dbt_utr: "UTR-ICICI-20260824-894210",
    weighbridge_slip: "WB-2026-VASHI-942.pdf"
  },
  {
    order_id: "ORD-2026-8977",
    invoice_number: "INV-KS-20260822-DISP",
    lot_id: "LOT-6",
    commodity: "Hybrid Tomato",
    variety: "Abhinav (Processing Grade)",
    quantity_tons: 6.0,
    quantity_kg: 6000,
    unit_price_kg: 14.00,
    base_crop_value: 84000,
    freight_charges: 7200,
    apmc_cess: 1260,
    total_settlement: 92460,
    farmer_name: "Kailash Jadhav",
    farmer_district: "Narayangaon Hub, Pune",
    carrier_name: "Western Agro Haulers",
    vehicle_number: "MH-14-GH-8812",
    eway_bill_number: "EWB-2026-78192",
    escrow_status: "DISPUTED",
    quality_grade: "Grade C (78.2%)",
    handover_date: "22 Aug 2026, 03:20 PM",
    dbt_utr: "FROZEN_ESCROW_VAULT",
    weighbridge_slip: "WB-DISPUTE-PROOF-977.jpg"
  },
  {
    order_id: "ORD-2026-8910",
    invoice_number: "INV-KS-20260819-7412",
    lot_id: "LOT-2",
    commodity: "Red Onion",
    variety: "Nashik Garva Premium",
    quantity_tons: 8.0,
    quantity_kg: 8000,
    unit_price_kg: 18.00,
    base_crop_value: 144000,
    freight_charges: 9600,
    apmc_cess: 2160,
    total_settlement: 155760,
    farmer_name: "Anil Deshmukh",
    farmer_district: "Lasalgaon Hub, Maharashtra",
    carrier_name: "Sahyadri Agri Transport",
    vehicle_number: "MH-15-AB-7812",
    eway_bill_number: "EWB-2026-91204",
    escrow_status: "SETTLED",
    quality_grade: "Grade A (96.5%)",
    handover_date: "19 Aug 2026, 04:15 PM",
    dbt_utr: "UTR-HDFC-20260819-312948",
    weighbridge_slip: "WB-2026-VASHI-810.pdf"
  },
  {
    order_id: "ORD-2026-8874",
    invoice_number: "INV-KS-20260814-6102",
    lot_id: "LOT-3",
    commodity: "Basmati Rice",
    variety: "1121 Steam Extra Long",
    quantity_tons: 12.0,
    quantity_kg: 12000,
    unit_price_kg: 68.00,
    base_crop_value: 816000,
    freight_charges: 14400,
    apmc_cess: 12240,
    total_settlement: 842640,
    farmer_name: "Gurdev Singh",
    farmer_district: "Karnal, Haryana",
    carrier_name: "North-South Corridor Haulage",
    vehicle_number: "HR-45-C-9821",
    eway_bill_number: "EWB-2026-88741",
    escrow_status: "SETTLED",
    quality_grade: "Grade A (98.1%)",
    handover_date: "14 Aug 2026, 02:40 PM",
    dbt_utr: "UTR-SBI-20260814-998201",
    weighbridge_slip: "WB-2026-VASHI-654.pdf"
  },
  {
    order_id: "ORD-2026-8650",
    invoice_number: "INV-KS-20260728-2041",
    lot_id: "LOT-5",
    commodity: "Soybean",
    variety: "JS-335 Yellow Seed",
    quantity_tons: 10.0,
    quantity_kg: 10000,
    unit_price_kg: 44.00,
    base_crop_value: 440000,
    freight_charges: 12000,
    apmc_cess: 6600,
    total_settlement: 458600,
    farmer_name: "Balasaheb Kadam",
    farmer_district: "Latur, Maharashtra",
    carrier_name: "Marathwada Fleet Logistics",
    vehicle_number: "MH-24-D-5541",
    eway_bill_number: "EWB-2026-65011",
    escrow_status: "SETTLED",
    quality_grade: "Grade A (93.7%)",
    handover_date: "28 Jul 2026, 06:20 PM",
    dbt_utr: "UTR-BOI-20260728-449102",
    weighbridge_slip: "WB-2026-VASHI-204.pdf"
  }
];

export function OrderHistoryTable({ orders = DEFAULT_ORDERS }: OrderHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [expandedDisputeOrder, setExpandedDisputeOrder] = useState<InvoiceOrderData | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.order_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (o.commodity?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (o.farmer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (o.invoice_number?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (o.escrow_status?.toUpperCase() || '') === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenInvoice = (order: InvoiceOrderData) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  const handleContactFpo = (order: InvoiceOrderData) => {
    toast.success('📞 Direct FPO Grievance Desk Connected', {
      description: `Dispute ticket #${order.order_id} escalated to Narayangaon FPO Nodal Lead (+91 98231 49821). WhatsApp summary dispatched.`,
      duration: 6000,
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-2xs text-slate-900">
      
      {/* Table Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Historical Procurement Ledger &amp; Invoices
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {filteredOrders.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Certified delivery receipts, APMC weighbridge slips, and GST tax invoice downloads
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by lot, farmer, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(['ALL', 'SETTLED', 'DISPUTED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disputed Tab Banner & Audit Card */}
      {statusFilter === 'DISPUTED' && (
        <div className="p-5 rounded-3xl bg-red-50/70 border border-red-200 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200/80 pb-3">
            <div className="flex items-center gap-2 text-red-950 font-black text-xs sm:text-sm">
              <ShieldAlert size={18} className="text-red-600 shrink-0" />
              <span>APMC Statutory Grievance &amp; Dispute Arbitration Active</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-200 text-red-900 w-max">
              Escrow Vault Cryptographically Frozen
            </span>
          </div>

          <p className="text-xs text-red-900 leading-relaxed">
            When quality assay or certified tare weight diverges past the 1.0% statutory tolerance, funds are frozen in the ICICI Nodal Vault. The APMC Mandi Dispute Committee reviews photographic evidence and issues binding DBT settlement orders within 24 hours.
          </p>
        </div>
      )}

      {/* Interactive Dispute Details Card (If user clicks row) */}
      {expandedDisputeOrder && (
        <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-300 space-y-4 animate-in zoom-in-95 text-xs">
          <div className="flex items-center justify-between border-b border-red-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-900 flex items-center justify-center font-bold">
                <AlertTriangle size={16} />
              </div>
              <div>
                <strong className="text-red-950 text-sm font-black block">
                  Dispute Audit Sheet • Order #{expandedDisputeOrder.order_id}
                </strong>
                <span className="text-[11px] text-red-700 font-mono">
                  Lot: {expandedDisputeOrder.lot_id} ({expandedDisputeOrder.commodity}) • Farmer: {expandedDisputeOrder.farmer_name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setExpandedDisputeOrder(null)}
              className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-800 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-2xl bg-white border border-red-200 space-y-0.5">
              <span className="text-red-600 text-[9px] uppercase font-bold block font-sans">Claimed Discrepancy</span>
              <strong className="text-slate-900 block">Severe Weight Shortage (-6.4% Tare)</strong>
              <span className="text-[10px] text-slate-500 font-sans">Produce arrived with broken sack seals</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-red-200 space-y-0.5">
              <span className="text-red-600 text-[9px] uppercase font-bold block font-sans">Designated Arbitrator</span>
              <strong className="text-slate-900 block">Vashi APMC Mandi Bench #3</strong>
              <span className="text-[10px] text-slate-500 font-sans">Nodal Officer: S. K. Shinde</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-red-200 space-y-0.5">
              <span className="text-red-600 text-[9px] uppercase font-bold block font-sans">Resolution Status</span>
              <strong className="text-amber-800 block">Evidence Under Review (ETA: 24h)</strong>
              <span className="text-[10px] text-slate-500 font-sans">DBT partial refund ready for approval</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-slate-600 font-mono text-[11px]">
              Attached Proof: <strong className="text-slate-900 font-bold">{expandedDisputeOrder.weighbridge_slip}</strong>
            </span>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContactFpo(expandedDisputeOrder)}
                className="h-8 px-3 rounded-xl font-bold text-xs border-red-300 text-red-900 hover:bg-red-100 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall size={12} />
                <span>Contact FPO Nodal Desk</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  toast.info('📄 Dispute Case Summary Generated', {
                    description: `Official case file #GRV-2026-9841 exported for APMC legal mediation bench.`,
                    duration: 5000,
                  });
                }}
                className="h-8 px-3 rounded-xl font-black text-xs bg-red-700 hover:bg-red-800 text-white shadow-xs"
              >
                <span>Export APMC Case File</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Historical Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-black tracking-wider border-b border-slate-200 font-mono">
              <tr>
                <th className="p-3.5">Order / Lot ID</th>
                <th className="p-3.5">Commodity &amp; Grade</th>
                <th className="p-3.5">Farmer &amp; Origin</th>
                <th className="p-3.5">Settlement (INR)</th>
                <th className="p-3.5">Escrow Status</th>
                <th className="p-3.5">Date &amp; DBT UTR</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No procurement records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.order_id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      order.escrow_status === 'DISPUTED' ? 'bg-red-50/30 hover:bg-red-50/50' : ''
                    }`}
                  >
                    
                    {/* Order ID */}
                    <td className="p-3.5 font-mono">
                      <strong className="text-slate-900 font-bold block">
                        {order.order_id}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {order.invoice_number}
                      </span>
                    </td>

                    {/* Commodity */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-900 font-bold block">
                          {order.commodity}
                        </strong>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {order.quality_grade}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {(order.quantity_tons || ((order.quantity_kg || 5000) / 1000)).toFixed(1)} Tons ({order.variety})
                      </span>
                    </td>

                    {/* Farmer & Origin */}
                    <td className="p-3.5">
                      <strong className="text-slate-800 font-bold block">
                        {order.farmer_name || 'Ramesh Patil'}
                      </strong>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[150px]">
                        {order.farmer_district || 'Nashik Cluster, Maharashtra'}
                      </span>
                    </td>

                    {/* Settlement Value */}
                    <td className="p-3.5 font-mono">
                      <strong className="text-emerald-800 font-black text-sm block">
                        ₹{(order.total_settlement || 130338).toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        ₹{(order.unit_price_kg || 24.50).toFixed(2)}/kg + freight
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      {order.escrow_status === 'SETTLED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max font-mono">
                          <CheckCircle2 size={11} className="text-emerald-700" />
                          SETTLED
                        </span>
                      ) : order.escrow_status === 'DISPUTED' ? (
                        <button
                          type="button"
                          onClick={() => setExpandedDisputeOrder(order)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 w-max font-mono cursor-pointer hover:bg-red-200 transition-colors"
                        >
                          <AlertTriangle size={11} className="text-red-700" />
                          DISPUTED (Audit)
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 w-max font-mono">
                          <Clock size={11} className="text-blue-700" />
                          IN_TRANSIT
                        </span>
                      )}
                    </td>

                    {/* Date & UTR */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      <div>{order.handover_date || '24 Aug 2026, 11:30 AM'}</div>
                      <span className="text-[10px] text-slate-400 truncate block max-w-[140px]">
                        Ref: {order.dbt_utr || 'UTR-ICICI-2026-OK'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-3.5 text-right font-mono">
                      {order.escrow_status === 'DISPUTED' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedDisputeOrder(order)}
                          className="h-8 px-2.5 rounded-xl text-xs font-bold border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <AlertTriangle size={12} />
                          <span>Audit File</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenInvoice(order)}
                          className="h-8 px-3 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <FileText size={12} className="text-emerald-700" />
                          <span>Tax Invoice</span>
                        </Button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Invoice Modal Mount */}
      <TaxInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={selectedInvoiceOrder}
      />

    </div>
  );
}
