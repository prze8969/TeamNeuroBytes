'use client';

import React from 'react';
import { Bid } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Lock, Clock } from 'lucide-react';

interface BidTableProps {
  bids: Bid[];
  onAcceptBid?: (bidId: string) => void;
  isFarmerView?: boolean;
}

export function BidTable({ bids, onAcceptBid, isFarmerView = false }: BidTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Active Buyer Bids &amp; Escrow Status
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Institutional tenders backed by 100% RBI-regulated bank escrow locking
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-black font-mono self-start sm:self-auto">
          {bids.length} {bids.length === 1 ? 'Live Bid' : 'Live Bids'}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/70">
              <th className="py-3.5 px-4 rounded-l-xl">Institutional Buyer</th>
              <th className="py-3.5 px-4">Offer Rate</th>
              <th className="py-3.5 px-4">Total Valuation</th>
              <th className="py-3.5 px-4">Escrow Status</th>
              <th className="py-3.5 px-4">Timestamp</th>
              {isFarmerView && <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bids.map((bid, idx) => {
              const isLocked = bid.escrowStatus === 'LOCKED';
              const isReleased = bid.escrowStatus === 'RELEASED';
              // Clean buyer name (remove "(Your Bid)" in farmer view)
              const cleanBuyerName = isFarmerView
                ? bid.buyerName.replace(/\(Your Bid\)/gi, '').trim()
                : bid.buyerName;

              return (
                <tr 
                  key={`bid-${bid.id || 'item'}-${idx}`} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isLocked ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Buyer Name */}
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${
                        isLocked ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      <span className="truncate max-w-[220px]">{cleanBuyerName}</span>
                    </div>
                  </td>

                  {/* Offer Rate */}
                  <td className="py-4 px-4 font-black text-emerald-900 font-mono text-sm">
                    ₹{bid.amountPerKg}/kg
                  </td>

                  {/* Total Valuation */}
                  <td className="py-4 px-4 font-black text-slate-900 font-mono">
                    ₹{bid.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Escrow Status Pill */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black font-mono uppercase ${
                      isLocked
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : isReleased
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {isLocked && <Lock size={10} className="text-emerald-700" />}
                      {bid.escrowStatus}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                    {bid.createdAt}
                  </td>

                  {/* Action Column */}
                  {isFarmerView && (
                    <td className="py-4 px-4 text-right">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black shadow-2xs font-mono">
                          <CheckCircle2 size={13} className="text-emerald-700" />
                          Accepted &amp; Vault Locked
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-9 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                          onClick={() => onAcceptBid && onAcceptBid(bid.id)}
                        >
                          Accept Bid &amp; Lock Escrow
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            
            {bids.length === 0 && (
              <tr>
                <td colSpan={isFarmerView ? 6 : 5} className="text-center py-10 text-slate-400">
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

export default BidTable;
