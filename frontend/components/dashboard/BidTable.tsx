'use client';

import React from 'react';
import { Bid } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Lock, Clock, XCircle } from 'lucide-react';
import { useTranslations } from '@/lib/LocaleContext';

interface BidTableProps {
  bids: Bid[];
  onAcceptBid?: (bidId: string) => void;
  onRejectBid?: (bidId: string) => void;
  onTrackOrder?: (bidId: string) => void;
  isFarmerView?: boolean;
}

export function BidTable({ bids, onAcceptBid, onRejectBid, onTrackOrder, isFarmerView = false }: BidTableProps) {
  const t = useTranslations('bidTable');

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Live Bids from Institutional Buyers
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Transparent competitive buyer bids backed by 100% RBI Escrow guarantee
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
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Escrow Status</th>
              <th className="py-3.5 px-4">Time</th>
              {isFarmerView && <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bids.map((bid, idx) => {
              const isLocked = bid.escrowStatus === 'LOCKED';
              const isReleased = bid.escrowStatus === 'RELEASED';
              const isRejected = bid.escrowStatus === 'REJECTED';
              
              // Clean buyer name
              const cleanBuyerName = isFarmerView
                ? bid.buyerName.replace(/\(Your Bid\)/gi, '').trim()
                : bid.buyerName;

              return (
                <tr 
                  key={`bid-${bid.id || 'item'}-${idx}`} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isLocked ? 'bg-emerald-50/40' : isRejected ? 'opacity-50 bg-slate-50/40' : ''
                  }`}
                >
                  {/* Buyer Name */}
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        isLocked ? 'bg-emerald-500' : isRejected ? 'bg-slate-400' : 'bg-blue-500 animate-pulse'
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
                        : isRejected
                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                        : isReleased
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {isLocked && <Lock size={10} className="text-emerald-700" />}
                      {isRejected ? 'REJECTED' : isLocked ? 'VAULT LOCKED' : 'READY TO ACCEPT'}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                    {bid.createdAt}
                  </td>

                  {/* Action Column for Farmer */}
                  {isFarmerView && (
                    <td className="py-4 px-4 text-right">
                      {isLocked ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black shadow-2xs font-mono">
                            <CheckCircle2 size={13} className="text-emerald-700" />
                            Accepted
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs h-8 px-3 rounded-xl cursor-pointer"
                            onClick={() => onTrackOrder && onTrackOrder(bid.id)}
                          >
                            🔍 Track Order
                          </Button>
                        </div>
                      ) : isRejected ? (
                        <span className="text-xs text-slate-400 font-bold">Rejected</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-8 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
                            onClick={() => onAcceptBid && onAcceptBid(bid.id)}
                          >
                            ✓ Accept Offer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200 font-bold text-xs h-8 px-2.5 rounded-xl cursor-pointer"
                            onClick={() => onRejectBid && onRejectBid(bid.id)}
                          >
                            ✕ Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            
            {bids.length === 0 && (
              <tr>
                <td colSpan={isFarmerView ? 6 : 5} className="text-center py-10 text-slate-400">
                  No active bids received yet. Bids from institutional buyers will appear here automatically.
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
