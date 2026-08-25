'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { GrievanceStatusBadge, GrievanceStatus } from '@/components/grievance/GrievanceStatusBadge';
import { SlaTimer } from '@/components/grievance/SlaTimer';
import { getStoredGrievances, GrievanceTicket } from '@/components/grievance/mockData';
import { Search, Filter, RefreshCw, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function GrievanceListPage() {
  const [filter, setFilter] = useState<'ALL' | GrievanceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);

  const loadTickets = () => {
    setTickets(getStoredGrievances());
  };

  useEffect(() => {
    loadTickets();
    const handleUpdate = () => loadTickets();
    window.addEventListener('kisansetu_grievances_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kisansetu_grievances_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      t.id.toLowerCase().includes(q) ||
      t.farmer.toLowerCase().includes(q) ||
      t.buyer.toLowerCase().includes(q) ||
      t.commodity.toLowerCase().includes(q) ||
      t.lotId.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="ADMIN" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-bold text-slate-600 bg-slate-50 border-slate-200">
                <ArrowLeft className="w-4 h-4 mr-1" /> Admin Hub
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Dispute &amp; Grievance Arbitration</h1>
                <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-xs font-black">
                  Nodal Officer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">APMC Statutory Mediation • 24h SLA Enforcement</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, farmer, commodity..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <Button
              size="sm"
              variant={filter === 'ALL' ? 'default' : 'outline'}
              onClick={() => setFilter('ALL')}
              className={`text-xs font-bold rounded-xl ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'}`}
            >
              All Tickets ({tickets.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'OPEN' ? 'default' : 'outline'}
              onClick={() => setFilter('OPEN')}
              className={`text-xs font-bold rounded-xl ${filter === 'OPEN' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Open ({tickets.filter(t => t.status === 'OPEN').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'UNDER_REVIEW' ? 'default' : 'outline'}
              onClick={() => setFilter('UNDER_REVIEW')}
              className={`text-xs font-bold rounded-xl ${filter === 'UNDER_REVIEW' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Under Review ({tickets.filter(t => t.status === 'UNDER_REVIEW').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'RESOLVED' ? 'default' : 'outline'}
              onClick={() => setFilter('RESOLVED')}
              className={`text-xs font-bold rounded-xl ${filter === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Resolved ({tickets.filter(t => t.status === 'RESOLVED').length})
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Ticket ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Parties Involved</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Dispute Amount</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">SLA Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900">#{ticket.id}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ticket.lotId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{ticket.farmer}</p>
                      <p className="text-[11px] text-slate-500">vs {ticket.buyer}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900">
                        ₹{ticket.amountInDispute.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <GrievanceStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SlaTimer deadline={ticket.slaDeadline} resolvedAt={ticket.resolvedAt} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/grievances/${ticket.id}`}>
                        <Button size="sm" variant="outline" className="text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50 rounded-xl cursor-pointer">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold">No grievance tickets found matching the current filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
