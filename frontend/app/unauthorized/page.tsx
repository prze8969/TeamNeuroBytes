'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Home, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { useAuth, UserRole } from '@/lib/AuthContext';

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, switchRole } = useAuth();

  const requiredRoles = searchParams.get('required')?.split(',') || [];
  const currentRole = searchParams.get('current') || role;

  const roleRouteMap: Record<string, string> = {
    FARMER: '/farmer/dashboard',
    BUYER: '/buyer/dashboard',
    FPO: '/fpo/dashboard',
    ORGANIZATION: '/fpo/dashboard',
    TRANSPORTATION: '/transportation/dashboard',
    WAREHOUSE: '/warehouse/dashboard',
    ADMIN: '/admin/dashboard',
  };

  const handleSwitchAndRedirect = (targetRole: UserRole) => {
    switchRole(targetRole);
    const destination = roleRouteMap[targetRole] || '/';
    router.push(destination);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 space-y-7 text-center relative overflow-hidden">
      
      {/* Top Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

      {/* Logo */}
      <div className="flex justify-center">
        <Link href="/" className="hover:scale-105 transition-transform">
          <KisanSetuLogo size="md" variant="dark" showTagline={false} />
        </Link>
      </div>

      {/* Icon & Error Header */}
      <div className="space-y-3">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-inner">
          <ShieldAlert size={32} />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-black uppercase tracking-wider border border-rose-200">
          HTTP 403 • Role Access Restricted
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Stakeholder Authorization Required
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your current logged-in role is <strong className="text-slate-800 font-mono">[{currentRole}]</strong>, but this portal requires one of the following permissions:
        </p>
      </div>

      {/* Required Roles Badge List */}
      {requiredRoles.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {requiredRoles.map((r) => (
            <span
              key={r}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono text-xs font-black shadow-2xs"
            >
              🔒 {r}
            </span>
          ))}
        </div>
      )}

      {/* 1-Click Role Switcher for Demo Purposes */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
          ⚡ Quick Demo Role Switcher:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(['FARMER', 'BUYER', 'ORGANIZATION', 'TRANSPORTATION', 'WAREHOUSE', 'ADMIN'] as UserRole[]).map((r) => (
            <Button
              key={r}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSwitchAndRedirect(r)}
              className={`text-xs font-bold rounded-xl h-9 cursor-pointer transition-all ${
                role === r
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {r === 'FARMER' && '🚜 Farmer'}
              {r === 'BUYER' && '🏢 Buyer'}
              {r === 'ORGANIZATION' && '👥 FPO Co.'}
              {r === 'TRANSPORTATION' && '🚚 Transporter'}
              {r === 'WAREHOUSE' && '🏭 Warehouse'}
              {r === 'ADMIN' && '⚖️ Admin'}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          onClick={() => router.push(roleRouteMap[role] || '/farmer/dashboard')}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Home size={14} />
          Return to My Active Dashboard
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/login')}
          className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border-slate-200 cursor-pointer"
        >
          Sign In with Different Account →
        </Button>
      </div>

      {/* Footer info */}
      <p className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
        KisanSetu Unified Access Control • DigiLocker e-KYC
      </p>

    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <Suspense fallback={
        <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Loading authorization status...</span>
        </div>
      }>
        <UnauthorizedContent />
      </Suspense>
    </main>
  );
}
