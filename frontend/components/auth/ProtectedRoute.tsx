'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

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
  const { user, session, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // 1. Not authenticated -> Redirect to login with return path
    if (!session || !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Authenticated but wrong role -> Redirect to unauthorized view
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.replace(
        `/unauthorized?required=${encodeURIComponent(allowedRoles.join(','))}&current=${encodeURIComponent(role)}`
      );
    }
  }, [user, session, role, loading, allowedRoles, router, pathname]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl shadow-inner animate-pulse">
            🌾
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-black text-slate-900">Verifying Stakeholder Credentials...</p>
          <p className="text-xs text-slate-500 font-mono">Secured by 256-Bit Escrow Vault</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session || !user) {
    return fallback || null;
  }

  // Unauthorized role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return fallback || null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
