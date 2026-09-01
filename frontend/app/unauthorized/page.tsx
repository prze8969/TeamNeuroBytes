'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Home, 
  Loader2,
  LogOut
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
    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8 space-y-6 transition-all relative z-10 my-auto text-center">
      
      {/* Logo */}
      <div className="flex items-center justify-center pb-2">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <KisanSetuLogo size="md" variant="dark" showTagline={false} />
        </Link>
      </div>

      {/* Icon & Error Header */}
      <div className="space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shadow-inner">
          <ShieldAlert size={28} />
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Authorization Required
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 font-medium">
            Your current logged-in role <strong className="text-slate-800 font-bold px-1">[{currentRole}]</strong> does not have access to this section.
          </p>
        </div>
      </div>

      {/* Required Roles Badge List */}
      {requiredRoles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Required Permissions:</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {requiredRoles.map((r) => (
              <span
                key={r}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-mono text-xs font-black shadow-2xs"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-4">
        <Button
          type="button"
          onClick={() => router.push(roleRouteMap[role] || '/farmer/dashboard')}
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <Home size={16} className="opacity-90" />
          <span>Return to Dashboard</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/login')}
          className="w-full h-12 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200/90 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut size={16} className="opacity-70" />
          <span>Sign In with Different Account</span>
        </Button>
      </div>

      {/* 1-Click Role Switcher for Demo Purposes */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <details className="group">
          <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 list-none text-center outline-none">
            Developer / Demo: Quick Switch Role
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-3">
            {(['FARMER', 'BUYER', 'ORGANIZATION', 'TRANSPORTATION', 'WAREHOUSE', 'ADMIN'] as UserRole[]).map((r) => (
              <Button
                key={r}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSwitchAndRedirect(r)}
                className={`text-[10px] font-bold rounded-lg h-7 cursor-pointer transition-all px-2 ${
                  role === r
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
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
        </details>
      </div>

    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/images/smart_agri_hero.jpg')] bg-cover bg-center font-sans antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#064E3B]/80 z-0" />
      
      <Suspense fallback={
        <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-emerald-50 font-medium">Checking authorization...</span>
        </div>
      }>
        <UnauthorizedContent />
      </Suspense>
    </main>
  );
}
