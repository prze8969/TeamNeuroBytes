'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: (UserRole | string)[];
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
  fallback
}: ProtectedRouteProps) {
  const { user, session, role, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const normalizeRole = (r?: string | null): string => {
    if (!r) return '';
    const u = String(r).toUpperCase();
    if (u === 'TRANSPORTER') return 'TRANSPORTATION';
    if (u === 'FPO') return 'ORGANIZATION';
    return u;
  };

  const isAllowed = !allowedRoles || allowedRoles.length === 0 || allowedRoles.some(ar => normalizeRole(ar) === normalizeRole(role));

  useEffect(() => {
    if (loading) return;

    // 1. Not authenticated -> Redirect to login with return path and role hint
    if (!isAuthenticated || !session || !user) {
      let roleHint = 'farmer';
      if (pathname.includes('/buyer')) roleHint = 'buyer';
      else if (pathname.includes('/fpo') || pathname.includes('/organization')) roleHint = 'fpo';
      else if (pathname.includes('/transportation') || pathname.includes('/transporter')) roleHint = 'transporter';
      else if (pathname.includes('/warehouse')) roleHint = 'warehouse';
      else if (pathname.includes('/admin')) roleHint = 'admin';

      router.replace(
        `/login?redirectTo=${encodeURIComponent(pathname)}&preselectedRole=${encodeURIComponent(roleHint)}`
      );
      return;
    }

    // 2. Authenticated but wrong role -> Redirect to unauthorized view
    if (!isAllowed && allowedRoles) {
      router.replace(
        `/unauthorized?required=${encodeURIComponent(allowedRoles.join(','))}&current=${encodeURIComponent(role)}`
      );
    }
  }, [user, session, role, loading, isAuthenticated, allowedRoles, router, pathname, isAllowed]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <div className="h-16 w-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-3xl shadow-inner animate-pulse">
            🌾
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-black text-slate-900">Verifying Stakeholder Access...</p>
          <p className="text-xs text-slate-500 font-mono">Secured by 256-Bit Escrow Rails</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !session || !user) {
    return fallback || (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-400 font-mono">
        Redirecting to security gateway...
      </div>
    );
  }

  // Unauthorized role
  if (!isAllowed) {
    return fallback || (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-400 font-mono">
        Access restricted. Redirecting to authorization desk...
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
