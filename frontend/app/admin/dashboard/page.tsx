'use client'

import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
            <p className="text-xs text-gray-500">System oversight, user management & platform auditing</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Total Registered Farmers</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">1,248</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Active Buyers & Millers</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">382</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Active FPO Clusters</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">45</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Escrow Volume (INR)</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">₹4.2 Cr</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Platform Audit Logs & Health</h3>
          <p className="text-xs text-gray-500 mb-4">FastAPI backend services, YOLO model latency, and WhatsApp webhook metrics</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
              <span className="font-mono">BE Service Health: OK (Port 8000)</span>
              <span className="font-semibold text-emerald-600">Latency: 42ms</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
              <span className="font-mono">YOLOv8 Grader Model: crop_grader.pt loaded</span>
              <span className="font-semibold text-emerald-600">Inference: 180ms</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
              <span className="font-mono">Agmarknet API Sync: Daily Mandi Refresh</span>
              <span className="font-semibold text-emerald-600">Updated Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
