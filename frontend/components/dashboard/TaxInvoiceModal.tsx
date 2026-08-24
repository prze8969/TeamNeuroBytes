'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  Scale, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Lock,
  QrCode,
  Landmark,
  BadgePercent
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OrderHistoryItem {
  order_id: string;
  invoice_number: string;
  lot_id: string;
  commodity: string;
  variety: string;
  quantity_tons?: number;
  quantity_kg?: number;
  unit_price_kg?: number;
  base_crop_value?: number;
  freight_charges?: number;
  apmc_cess?: number;
  total_settlement?: number;
  farmer_name?: string;
  farmer_district?: string;
  carrier_name?: string;
  vehicle_number?: string;
  eway_bill_number?: string;
  escrow_status?: string;
  quality_grade?: string;
  handover_date?: string;
  dbt_utr?: string;
  weighbridge_slip?: string;
}

export type InvoiceOrderData = OrderHistoryItem;

export interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderHistoryItem | null;
}

export function TaxInvoiceModal({
  isOpen,
  onClose,
  order
}: TaxInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const invoiceNo = order.invoice_number || `INV-KS-20260824-8942`;
  const orderId = order.order_id.startsWith('#') ? order.order_id : `#${order.order_id}`;
  const ewayBill = order.eway_bill_number || `EWB-2026-98412`;
  const issueDate = order.handover_date || new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const netQtyKg = order.quantity_kg || 4975;
  const unitRate = order.unit_price_kg || 24.50;
  const baseProduceValue = order.base_crop_value || Math.round(netQtyKg * unitRate * 100) / 100;
  const freightCharges = order.freight_charges || Math.round(netQtyKg * 1.20 * 100) / 100;
  const apmcCess = order.apmc_cess || Math.round(baseProduceValue * 0.015 * 100) / 100;
  const platformFee = Math.round(baseProduceValue * 0.005 * 100) / 100;
  const gstOnPlatformFee = Math.round(platformFee * 0.18 * 100) / 100;
  const totalSettlementValue = order.total_settlement || Math.round(baseProduceValue + freightCharges + apmcCess + platformFee + gstOnPlatformFee);

  const farmerName = order.farmer_name || 'Ramesh Patil';
  const farmerOrigin = order.farmer_district || 'Nashik Cluster, Maharashtra';
  const carrierName = order.carrier_name || 'Kisan Express Logistics';
  const vehicleNumber = order.vehicle_number || 'MH-15-EG-4421';
  const farmerDbtUtr = order.dbt_utr || 'UTR-20260824-99812481';
  const carrierDbtUtr = 'UTR-20260824-99812482';
  const qualityGrade = order.quality_grade || 'Grade A (94.2% Assayed)';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `
========================================================================================
                              KISANSETU AGRI-TRADE PLATFORM
                       TAX INVOICE & ESCROW SETTLEMENT VOUCHER
========================================================================================
Document Title     : TAX INVOICE & ESCROW SETTLEMENT VOUCHER
Invoice Number     : ${invoiceNo}
Order Identifier   : ${orderId}
E-Way Bill Number  : ${ewayBill}
Settlement Date    : ${issueDate}
Platform GSTIN     : 27AAACK1234F1Z8 (State: 27 - Maharashtra)
Corporate CIN      : U01100MH2026PTC394821
Registered Office  : APMC Market-II, Turbhe, Vashi, Navi Mumbai, Maharashtra - 400705

----------------------------------------------------------------------------------------
1. BILATERAL PARTY DETAILS
----------------------------------------------------------------------------------------
SUPPLIER / FARMER / FPO:
Name & Entity      : ${farmerName} (Nashik Farmer Producer Co.)
Location / Cluster : ${farmerOrigin}
Crop Lot ID        : ${order.lot_id} (${order.commodity} • ${order.variety})
Quality Grade      : ${qualityGrade} (Agmarknet Assayed)

BILLED TO (INSTITUTIONAL BUYER):
Legal Entity Name  : AgroProcure Processing Ltd
GSTIN              : 27AABCA1234F1Z5
APMC License No    : APMC-MH-NSK-2024-892
Delivery Terminal  : Vashi APMC Terminal Scale #4, Turbhe, Navi Mumbai - 400703

CARRIER & TRANSIT:
Logistics Carrier  : ${carrierName}
Vehicle Number     : ${vehicleNumber} (Transporter ID: TRANS-4821)
Weighbridge Ref    : ${order.weighbridge_slip || 'WB-2026-VASHI-942.pdf'}

----------------------------------------------------------------------------------------
2. ITEMIZED FINANCIALS BREAKDOWN
----------------------------------------------------------------------------------------
HSN/SAC | Item Description                 | Net Qty  | Unit Rate  | Tax/Cess | Total (INR)
----------------------------------------------------------------------------------------
1001    | ${order.commodity.padEnd(28, ' ')} | ${netQtyKg.toString().padEnd(6, ' ')}kg | ₹${unitRate.toFixed(2).padEnd(8, ' ')} | Exempt   | ₹${baseProduceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
9965    | Shared Freight Haulage (Nashik)  | ${netQtyKg.toString().padEnd(6, ' ')}kg | ₹1.20/kg   | Exempt   | ₹${freightCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
9997    | Statutory APMC Mandi User Cess   | 1.5%     | -          | 1.5%     | ₹${apmcCess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
9983    | Platform Escrow Facilitation Fee | 0.5%     | -          | 18% GST  | ₹${platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
9983    | GST on Facilitation Fee (18%)    | -        | 18.0%      | CGST+SGST| ₹${gstOnPlatformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
----------------------------------------------------------------------------------------
TOTAL SETTLEMENT VALUE (INR)                                      : ₹${totalSettlementValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
========================================================================================

----------------------------------------------------------------------------------------
3. RBI ESCROW VAULT DISBURSEMENT BREAKDOWN
----------------------------------------------------------------------------------------
• 100% Produce Valuation to Farmer Bank (DBT) : ₹${baseProduceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} [${farmerDbtUtr}]
• 70% Balance Transit Settlement to Carrier   : ₹${(freightCharges * 0.7).toLocaleString('en-IN', { minimumFractionDigits: 2 })} [${carrierDbtUtr}]
• 30% Advance Transit (Fuel/Tolls) Disbursed  : ₹${(freightCharges * 0.3).toLocaleString('en-IN', { minimumFractionDigits: 2 })} [Pre-disbursed]
• Status: 100% ESCROW SETTLED & VERIFIED (ICICI Bank Nodal Escrow Vault #KS-8942)

----------------------------------------------------------------------------------------
Certified by: Weighbridge Operator #482, Vashi APMC Terminal
Statutory Note: Issued in accordance with Section 31 of CGST Act, 2017.
========================================================================================
    `;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      
      {/* Print CSS Injection for pure A4 output */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-tax-invoice,
          #printable-tax-invoice * {
            visibility: visible;
          }
          #printable-tax-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Dialog Shell */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 space-y-0 animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:rounded-none print:max-w-none">
        
        {/* ========================================================================= */}
        {/* TOP INTERACTIVE ACTION BAR (Hidden during native printing) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between no-print print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
              <FileText size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  GST-Compliant Tax Invoice &amp; Escrow Settlement Voucher
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {invoiceNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official B2B invoice with verified APMC weighbridge scale log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTxt}
              className="h-8 px-3 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} className="text-emerald-700" />
              <span>Download Text</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} />
              <span>Download PDF / Print</span>
            </Button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors ml-1 cursor-pointer"
              title="Close Dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE OFFICIAL GST INVOICE LAYOUT */}
        {/* ========================================================================= */}
        <div id="printable-tax-invoice" className="p-6 sm:p-10 space-y-6 text-xs max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:space-y-4">
          
          {/* Section 1: Header Brand, Platform GSTIN, & Metadata Block */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  KisanSetu <span className="text-emerald-700">Agri-Trade Platform</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                National Agricultural Market Linkage &amp; Milestone Escrow Infrastructure
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm font-mono">
                Regd Office: APMC Market-II, Turbhe, Vashi, Navi Mumbai, Maharashtra - 400705
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-700">
                <span>GSTIN: <strong className="text-slate-900">27AAACK1234F1Z8</strong></span>
                <span>•</span>
                <span>CIN: <strong className="text-slate-900">U01100MH2026PTC394821</strong></span>
                <span>•</span>
                <span>State: <strong className="text-slate-900">27 (Maharashtra)</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono">
              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                TAX INVOICE &amp; SETTLEMENT VOUCHER
              </span>
              <h2 className="font-black text-sm text-slate-900 pt-1">
                {invoiceNo}
              </h2>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Order ID: <strong className="text-slate-900">{orderId}</strong></div>
                <div>E-Way Bill: <strong className="text-slate-900">{ewayBill}</strong></div>
                <div>Settlement Date: <strong className="text-slate-900">{issueDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Section 2: Bilateral Party Details (2-Column Box) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-transparent print:border-slate-300">
            
            {/* Left: Supplier / Farmer / FPO */}
            <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block font-sans">
                Supplier &amp; Farmgate Origin
              </span>
              <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                {farmerName} (Nashik Farmer Producer Co.)
              </strong>
              <p className="text-slate-600 text-[11px]">
                {farmerOrigin}
              </p>
              <div className="pt-1.5 font-mono text-[10.5px] space-y-0.5 text-slate-700">
                <div>Assigned Lot: <strong className="text-emerald-700">{order.lot_id}</strong></div>
                <div>Assay: <strong className="text-slate-900">{qualityGrade}</strong></div>
                <div>Farmer DBT UTR: <strong className="text-slate-900">{farmerDbtUtr}</strong></div>
              </div>
            </div>

            {/* Right: Billed To (Institutional Buyer) */}
            <div className="space-y-1 sm:pl-2">
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block font-sans">
                Billed To (Institutional Buyer)
              </span>
              <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                AgroProcure Processing Ltd
              </strong>
              <p className="text-slate-600 text-[11px]">
                Plot 42, Turbhe Vashi APMC Mandi Yard, Navi Mumbai, Maharashtra 400703
              </p>
              <div className="pt-1.5 font-mono text-[10.5px] space-y-0.5 text-slate-700">
                <div>GSTIN: <strong className="text-slate-900">27AABCA1234F1Z5</strong></div>
                <div>APMC License: <strong className="text-slate-900">APMC-MH-NSK-2024-892</strong></div>
                <div>Delivery Terminal: <strong className="text-slate-900">Vashi APMC Mandi Scale #4</strong></div>
              </div>
            </div>

          </div>

          {/* Section 3: Logistics & Transporter Details Strip */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 print:border-slate-300">
            <div>
              <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">Fleet Carrier</span>
              <strong className="text-slate-900 truncate block">{carrierName}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">Vehicle Registration</span>
              <strong className="text-slate-900 block">{vehicleNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">Carrier Disbursed UTR</span>
              <strong className="text-slate-900 block">{carrierDbtUtr}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">Weighbridge Scale Pass</span>
              <strong className="text-emerald-700 block">{order.weighbridge_slip || 'WB-2026-VASHI-942.pdf'}</strong>
            </div>
          </div>

          {/* Section 4: Itemized Financials Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-300">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-100 text-slate-800 text-[10px] uppercase font-black tracking-wider border-b border-slate-200 print:bg-slate-200">
                <tr>
                  <th className="p-3">HSN/SAC</th>
                  <th className="p-3">Description of Produce / Logistics Service</th>
                  <th className="p-3 text-right">Net Qty</th>
                  <th className="p-3 text-right">Unit Rate</th>
                  <th className="p-3 text-right">Tax / Duty</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                
                {/* Row 1: Produce Base Valuation */}
                <tr>
                  <td className="p-3 text-slate-500">1001</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-sans">{order.commodity}</strong>
                    <span className="text-[10px] text-slate-500 font-sans">{order.variety} • Agmarknet Grade A (Assayed)</span>
                  </td>
                  <td className="p-3 text-right">{netQtyKg.toLocaleString('en-IN')} kg</td>
                  <td className="p-3 text-right">₹{unitRate.toFixed(2)}/kg</td>
                  <td className="p-3 text-right text-slate-500">0.0% (Exempt)</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{baseProduceValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>

                {/* Row 2: Shared Corridor Freight */}
                <tr>
                  <td className="p-3 text-slate-500">9965</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-sans">Shared Corridor Freight Haulage</strong>
                    <span className="text-[10px] text-slate-500 font-sans">Nashik Cluster ➔ Vashi APMC (35% pooled saving applied)</span>
                  </td>
                  <td className="p-3 text-right">{netQtyKg.toLocaleString('en-IN')} kg</td>
                  <td className="p-3 text-right">₹1.20/kg</td>
                  <td className="p-3 text-right text-slate-500">0.0% (Exempt)</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{freightCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>

                {/* Row 3: Statutory APMC Cess */}
                <tr>
                  <td className="p-3 text-slate-500">9997</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-sans">Statutory APMC Mandi Cess &amp; User Duty</strong>
                    <span className="text-[10px] text-slate-500 font-sans">1.5% statutory market committee fee</span>
                  </td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">1.5%</td>
                  <td className="p-3 text-right text-slate-500">Statutory</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{apmcCess.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>

                {/* Row 4: Platform Facilitation */}
                <tr>
                  <td className="p-3 text-slate-500">9983</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-sans">KisanSetu Escrow Guarantee &amp; Quality Audit Fee</strong>
                    <span className="text-[10px] text-slate-500 font-sans">0.5% milestone escrow &amp; inspection facilitation</span>
                  </td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right text-slate-500">18% GST</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>

                {/* Row 5: GST on Facilitation Fee */}
                <tr>
                  <td className="p-3 text-slate-500">9983</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-sans">Integrated GST (18% on Platform Fee)</strong>
                    <span className="text-[10px] text-slate-500 font-sans">9% CGST (₹{(gstOnPlatformFee / 2).toFixed(2)}) + 9% SGST (₹{(gstOnPlatformFee / 2).toFixed(2)})</span>
                  </td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">18.0%</td>
                  <td className="p-3 text-right text-slate-500">CGST+SGST</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{gstOnPlatformFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>

              </tbody>

              {/* Total Settlement Footer */}
              <tfoot className="bg-slate-50 border-t-2 border-slate-900 font-bold print:bg-transparent">
                <tr>
                  <td colSpan={5} className="p-3.5 text-right text-slate-900 font-sans text-xs uppercase tracking-wide">
                    Total Settled Escrow Value (INR):
                  </td>
                  <td className="p-3.5 text-right text-base text-emerald-900 font-black">
                    ₹{totalSettlementValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Section 5: RBI Escrow Vault Disbursement Breakdown */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5 print:bg-transparent print:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold font-sans text-xs">
                <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
                <span>100% Escrow Vault Settled via Scheduled Commercial Bank DBT</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 w-max">
                ICICI Bank Nodal Escrow Vault #KS-8942
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-700 pt-1">
              <div>
                <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">100% Farmer Crop Payment</span>
                <strong className="text-emerald-900">₹{baseProduceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                <span className="text-[9px] text-slate-500 block">Ref: {farmerDbtUtr}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">70% Final Transit Settlement</span>
                <strong className="text-purple-900">₹{(freightCharges * 0.7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                <span className="text-[9px] text-slate-500 block">Ref: {carrierDbtUtr}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[9px] uppercase font-bold block font-sans">30% Advance Transit Paid</span>
                <strong className="text-slate-900">₹{(freightCharges * 0.3).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                <span className="text-[9px] text-emerald-700 block">✓ Pre-disbursed at pickup</span>
              </div>
            </div>
          </div>

          {/* Section 6: Official Signatures & Compliance Footnote */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 items-end justify-between gap-4 text-[10px] text-slate-500 font-mono">
            
            <div className="space-y-1">
              <strong className="text-slate-900 font-sans block text-xs">Statutory Compliance Note</strong>
              <p className="leading-relaxed">
                This is a digitally verified tax invoice issued under Section 31 of the Central Goods and Services Tax (CGST) Act, 2017 and State APMC Mandi Statutory Regulations. All funds are settled through RBI-regulated multi-party escrow rails.
              </p>
            </div>

            {/* Stamp & Seal */}
            <div className="sm:text-right space-y-1 self-end">
              <div className="inline-block p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 text-left font-mono text-[9.5px] print:border-slate-400">
                <div className="font-bold text-emerald-950">✓ DIGITAL WEIGHBRIDGE VERIFIED</div>
                <div className="text-slate-700">Officer: APMC Scale Operator #482</div>
                <div className="text-slate-500">Terminal: Vashi APMC Mandi Yard Scale #4</div>
                <div className="text-slate-400 text-[8px] pt-0.5">Hash: 8942-KS-SHA256-OK</div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER BUTTONS (Hidden in print) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 print:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 rounded-xl font-bold text-xs border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            className="h-10 px-6 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Printer size={14} />
            <span>Download PDF / Print Invoice</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
