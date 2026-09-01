'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { EscrowTracker } from '@/components/dashboard/EscrowTracker';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'escrow-vault' | 'grievances' | 'model-health'>('overview');

  const mockGrievances = [
    {
      id: 'GRV-401',
      farmer: 'Sanjay Shinde',
      buyer: 'AgroProcure Ltd',
      issue: 'Weight shortage of 45kg claimed at buyer weighbridge',
      status: 'IN_MEDIATION',
      amountInDispute: 832.50,
      date: '2026-08-23'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="ADMIN" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Platform Governance & Escrow Oversight</h1>
              <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-xs font-black">
                System Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">SIH 2026 Problem Statement 26132 • Market Linkage & Price Discovery</p>
          </div>
        </header>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Button
            size="sm"
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className={`text-xs font-bold ${activeTab === 'overview' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            📊 Platform Overview
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'escrow-vault' ? 'default' : 'outline'}
            onClick={() => setActiveTab('escrow-vault')}
            className={`text-xs font-bold ${activeTab === 'escrow-vault' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            🛡️ Escrow Vaults (₹1.42 Cr)
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'grievances' ? 'default' : 'outline'}
            onClick={() => setActiveTab('grievances')}
            className={`text-xs font-bold ${activeTab === 'grievances' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            ⚖️ Grievance Arbitration (1 Open)
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'model-health' ? 'default' : 'outline'}
            onClick={() => setActiveTab('model-health')}
            className={`text-xs font-bold ${activeTab === 'model-health' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            🤖 AI Pipelines & Telemetry
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Escrow Volume</p>
            <p className="text-3xl font-black text-emerald-700 mt-1 font-mono">₹1.42 Cr</p>
            <p className="text-[11px] text-slate-500">100% Guaranteed Payouts</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Smallholders</p>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">1,842</p>
            <p className="text-[11px] text-slate-500">Via WhatsApp Bot & Web</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Grading Pass Rate</p>
            <p className="text-3xl font-black text-blue-700 mt-1 font-mono">94.8%</p>
            <p className="text-[11px] text-slate-500">DINOv2 + CORAL Model</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Freight Cost Saved</p>
            <p className="text-3xl font-black text-purple-700 mt-1 font-mono">₹18.6 L</p>
            <p className="text-[11px] text-slate-500">Via PostGIS 10km Milk Runs</p>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <EscrowTracker />
          </div>
        )}

        {activeTab === 'escrow-vault' && (
          <div className="space-y-6">
            <EscrowTracker />
          </div>
        )}

        {activeTab === 'grievances' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Active Grievance Cases</h3>
                <p className="text-sm text-slate-500 mt-1">APMC Nodal Officer mediation queue. Resolve disputes and release escrow.</p>
              </div>
              <Link href="/admin/grievances">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer">
                  Open Arbitration Portal ↗
                </Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'model-health' && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">AI Model Pipelines & External Feeds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                <span className="font-black text-emerald-900 text-sm">DINOv2 + CORAL Quality Classifier</span>
                <p className="text-slate-600">Model: dinov2_vitb14 • Inference: ~42ms • Accuracy: 68.14% • QWK: 0.91</p>
                <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white rounded font-black text-[10px]">HEALTHY</span>
              </div>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 space-y-2">
                <span className="font-black text-blue-900 text-sm">Agmarknet Price Sync</span>
                <p className="text-slate-600">API Endpoint: /api/decision/agmarknet-feed • Sync Interval: 15 mins</p>
                <span className="inline-block px-2 py-0.5 bg-blue-600 text-white rounded font-black text-[10px]">LIVE FEED</span>
              </div>
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 space-y-2">
                <span className="font-black text-purple-900 text-sm">OpenRouteService Routing</span>
                <p className="text-slate-600">Truck Freight Matrix: 10km radius clustering • Fallback: Active</p>
                <span className="inline-block px-2 py-0.5 bg-purple-600 text-white rounded font-black text-[10px]">CONNECTED</span>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
}
