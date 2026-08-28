'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { GrievanceStatusBadge, GrievanceStatus } from '@/components/grievance/GrievanceStatusBadge';
import { EscrowStatusCard, EscrowStatus } from '@/components/grievance/EscrowStatusCard';
import { SlaTimer } from '@/components/grievance/SlaTimer';
import { getGrievanceById, resolveGrievanceTicket, GrievanceTicket } from '@/components/grievance/mockData';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Scale, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function GrievanceDetailClient({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<GrievanceTicket | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const found = getGrievanceById(ticketId);
    if (found) {
      setTicket(found);
    }
    setHasChecked(true);
  }, [ticketId]);

  if (!ticket && hasChecked) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="ADMIN" />
        <main className="flex-1 max-w-4xl mx-auto w-full p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-2xl shadow-inner">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Dispute Ticket Not Found</h1>
            <p className="text-sm text-slate-500">Ticket #{ticketId} does not exist in the arbitration register or has been purged.</p>
          </div>
          <Link href="/admin/grievances">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Arbitration Registry
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-500 font-medium text-xs font-mono animate-pulse">Loading dispute ticket #{ticketId}...</p>
      </div>
    );
  }

  const handleResolve = (action: 'REFUNDED' | 'RELEASED') => {
    const resolved = resolveGrievanceTicket(ticketId, action);
    if (resolved) {
      setTicket(resolved);
      toast.success(
        action === 'REFUNDED' 
          ? `Dispute #${ticketId} Resolved: Refunded to Buyer` 
          : `Dispute #${ticketId} Resolved: Escrow Funds Released to Farmer`,
        {
          description: `Escrow vault status changed to ${resolved.escrowStatus}. Statutory audit record logged.`
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="ADMIN" />

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/grievances">
            <Button variant="outline" size="sm" className="text-xs font-bold text-slate-600 bg-white border-slate-200 rounded-xl cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Disputes
            </Button>
          </Link>
          
          <SlaTimer deadline={ticket.slaDeadline} resolvedAt={ticket.resolvedAt} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 font-mono">#{ticket.id}</h1>
                <GrievanceStatusBadge status={ticket.status} />
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-400" /> Linked to {ticket.lotId}
              </p>
            </div>
            
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Raised</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {new Date(ticket.dateRaised).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Parties Involved</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Farmer:</span>
                    <span className="text-sm font-bold text-slate-900">{ticket.farmer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Buyer:</span>
                    <span className="text-sm font-bold text-slate-900">{ticket.buyer}</span>
                  </div>
                  {ticket.transporter && (
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                      <span className="text-sm text-slate-500">Transporter:</span>
                      <span className="text-sm font-semibold text-slate-700">{ticket.transporter}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dispute Description</h3>
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {ticket.issueDescription}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Commodity: {ticket.commodity} ({ticket.variety})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Escrow & Actions */}
            <div className="space-y-6">
              <EscrowStatusCard status={ticket.escrowStatus} amount={ticket.amountInDispute} />

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">Nodal Officer Mediation</h3>
                </div>
                
                {ticket.status !== 'RESOLVED' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 mb-4">
                      Review the evidence and select an arbitration outcome. This action will update the escrow vault instantly.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleResolve('REFUNDED')}
                        className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-sm flex items-center gap-2 font-bold cursor-pointer rounded-xl"
                      >
                        <XCircle className="w-4 h-4" />
                        Refund / Cancel
                      </Button>
                      <Button 
                        onClick={() => handleResolve('RELEASED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 font-bold cursor-pointer rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Reallocate / Release
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Dispute Resolved</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Outcome: <span className="font-bold">{ticket.resolutionOutcome === 'REFUNDED' ? 'Refunded to Buyer' : 'Funds Released to Farmer'}</span>
                      </p>
                      <p className="text-[10px] text-emerald-600/80 mt-1">
                        Resolved on {new Date(ticket.resolvedAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
