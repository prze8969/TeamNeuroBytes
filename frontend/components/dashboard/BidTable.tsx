'use client'

import { Bid } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface BidTableProps {
  bids: Bid[];
  onAcceptBid?: (bidId: string) => void;
  isFarmerView?: boolean;
}

export function BidTable({ bids, onAcceptBid, isFarmerView }: BidTableProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💼</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Active Buyer Bids & Escrow Status</h3>
            <p className="text-xs text-slate-500">Institutional tenders backed by 100% bank escrow locking</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold font-mono">
          {bids.length} Live Bids
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 bg-slate-50">
              <th className="py-3 px-3 rounded-l-lg">Institutional Buyer</th>
              <th className="py-3 px-3">Offer Rate</th>
              <th className="py-3 px-3">Total Valuation</th>
              <th className="py-3 px-3">Escrow Status</th>
              <th className="py-3 px-3">Timestamp</th>
              {isFarmerView && <th className="py-3 px-3 text-right rounded-r-lg">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bids.map((bid, idx) => (
              <tr key={`bid-${bid.id || 'item'}-${idx}`} className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {bid.buyerName}
                </td>
                <td className="py-3.5 px-3 font-black text-emerald-700 font-mono text-sm">
                  ₹{bid.amountPerKg}/kg
                </td>
                <td className="py-3.5 px-3 font-bold text-slate-900 font-mono">
                  ₹{bid.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    bid.escrowStatus === 'LOCKED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : bid.escrowStatus === 'RELEASED'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {bid.escrowStatus}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{bid.createdAt}</td>
                {isFarmerView && (
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3.5 shadow-sm"
                      onClick={() => onAcceptBid && onAcceptBid(bid.id)}
                    >
                      Accept Bid & Lock Escrow
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {bids.length === 0 && (
              <tr>
                <td colSpan={isFarmerView ? 6 : 5} className="text-center py-8 text-slate-400">
                  No active bids placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
