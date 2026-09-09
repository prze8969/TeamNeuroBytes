'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Lock, 
  Mail, 
  Check,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { useAuth, UserRole } from '@/lib/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get('redirectTo') || searchParams.get('from') || '';
  const preselectedRoleParam = searchParams.get('preselectedRole') || '';

  const [identifier, setIdentifier] = useState('farmer@kisansetu.in');
  const [password, setPassword] = useState('farmer123');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickRoles: { role: UserRole; email: string; label: string; icon: string; desc: string; password: string }[] = [
    { 
      role: 'FARMER', 
      email: 'farmer@kisansetu.in', 
      label: 'Farmer', 
      icon: '🚜',
      desc: 'Sell your crops',
      password: 'farmer123',
    },
    { 
      role: 'BUYER', 
      email: 'buyer@kisansetu.in', 
      label: 'Buyer', 
      icon: '🏢',
      desc: 'Buy crops in bulk',
      password: 'buyer123',
    },
    { 
      role: 'ORGANIZATION', 
      email: 'fpo@kisansetu.in', 
      label: 'FPO Co.', 
      icon: '👥',
      desc: 'Help farmers group crops',
      password: 'fpo123',
    },
    { 
      role: 'TRANSPORTATION', 
      email: 'transporter@kisansetu.in', 
      label: 'Transporter', 
      icon: '🚚',
      desc: 'Move crops safely',
      password: 'transporter123',
    },
    { 
      role: 'WAREHOUSE', 
      email: 'warehouse@kisansetu.in', 
      label: 'Warehouse', 
      icon: '🏭',
      desc: 'Store crops safely',
      password: 'warehouse123',
    },
    { 
      role: 'ADMIN', 
      email: 'admin@kisansetu.in', 
      label: 'Admin', 
      icon: '⚖️',
      desc: 'Help and Support',
      password: 'admin123',
    },
  ];

  // Auto-focus and preselect role from query param
  useEffect(() => {
    if (!preselectedRoleParam) return;
    const norm = preselectedRoleParam.toLowerCase();
    
    let matched = quickRoles.find(r => r.role.toLowerCase() === norm || r.label.toLowerCase() === norm);
    if (!matched) {
      if (norm.includes('farm')) matched = quickRoles.find(r => r.role === 'FARMER');
      else if (norm.includes('buy')) matched = quickRoles.find(r => r.role === 'BUYER');
      else if (norm.includes('fpo') || norm.includes('org')) matched = quickRoles.find(r => r.role === 'ORGANIZATION');
      else if (norm.includes('trans') || norm.includes('truck')) matched = quickRoles.find(r => r.role === 'TRANSPORTATION');
      else if (norm.includes('ware') || norm.includes('cold')) matched = quickRoles.find(r => r.role === 'WAREHOUSE');
      else if (norm.includes('admin') || norm.includes('gov')) matched = quickRoles.find(r => r.role === 'ADMIN');
    }

    if (matched) {
      setRole(matched.role);
      setIdentifier(matched.email);
      setPassword(matched.password);
    }
  }, [preselectedRoleParam]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const routeMap: Record<string, string> = {
      FARMER: '/farmer/dashboard',
      BUYER: '/buyer/dashboard',
      FPO: '/fpo/dashboard',
      ORGANIZATION: '/fpo/dashboard',
      WAREHOUSE: '/warehouse/dashboard',
      TRANSPORTATION: '/transportation/dashboard',
      ADMIN: '/admin/dashboard',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier.trim(), password })
      });

      if (res.ok) {
        const data = await res.json();
        const rawRole = (data.role ? data.role.toUpperCase() : role);
        let resolvedRole: UserRole = rawRole as UserRole;
        if (rawRole === 'TRANSPORTER') resolvedRole = 'TRANSPORTATION';
        else if (rawRole === 'FPO') resolvedRole = 'ORGANIZATION';

        const token = data.access_token || 'authenticated-session-token';

        login(identifier, resolvedRole, token, {
          id: String(data.user_id || 'USR-01'),
          name: data.full_name || identifier,
          email: identifier,
          role: resolvedRole,
          isKycVerified: Boolean(data.kyc_verified)
        });

        if (resolvedRole === 'BUYER') {
          try {
            localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
          } catch {}
        }
        
        toast.success(`Welcome back, ${data.full_name || 'Stakeholder'}!`, {
          description: `Signed in as ${resolvedRole.charAt(0) + resolvedRole.slice(1).toLowerCase()} • Verified DigiLocker Active`,
        });

        // Safely resolve destination dashboard matching the authenticated role
        let destination = routeMap[resolvedRole] || '/farmer/dashboard';
        if (redirectTo && redirectTo.startsWith('/')) {
          const isFarmerRoute = redirectTo.startsWith('/farmer');
          const isBuyerRoute = redirectTo.startsWith('/buyer');
          const isFpoRoute = redirectTo.startsWith('/fpo') || redirectTo.startsWith('/organization');
          const isTransRoute = redirectTo.startsWith('/transportation') || redirectTo.startsWith('/transporter');
          const isWhRoute = redirectTo.startsWith('/warehouse');
          const isAdminRoute = redirectTo.startsWith('/admin');

          // Only use redirectTo if it matches the current user's role
          if (
            (resolvedRole === 'FARMER' && isFarmerRoute) ||
            (resolvedRole === 'BUYER' && isBuyerRoute) ||
            ((resolvedRole === 'ORGANIZATION' || (resolvedRole as string) === 'FPO') && isFpoRoute) ||
            (resolvedRole === 'TRANSPORTATION' && isTransRoute) ||
            (resolvedRole === 'WAREHOUSE' && isWhRoute) ||
            (resolvedRole === 'ADMIN' && isAdminRoute) ||
            (!isFarmerRoute && !isBuyerRoute && !isFpoRoute && !isTransRoute && !isWhRoute && !isAdminRoute)
          ) {
            destination = redirectTo;
          }
        }

        router.push(destination);
        return;
      } else {
        // Fallback for demo credentials if server returns error
        const cleanEmail = identifier.trim().toLowerCase();
        const demoUser = quickRoles.find(r => r.email.toLowerCase() === cleanEmail);
        if (demoUser && (password === demoUser.password || password === `${demoUser.role.toLowerCase()}123` || password === 'trans123' || password === 'organization123')) {
          login(demoUser.email, demoUser.role, 'authenticated-demo-token', {
            id: `USR-${demoUser.role}-01`,
            name: demoUser.label,
            email: demoUser.email,
            role: demoUser.role,
            isKycVerified: true
          });
          toast.success(`Welcome back, ${demoUser.label}!`);
          router.push(routeMap[demoUser.role] || '/');
          return;
        }

        const errorData = await res.json().catch(() => ({}));
        const detailMsg = errorData.detail || 'Invalid email or password. Please check your credentials.';
        setErrorMessage(detailMsg);
        toast.error('Authentication Failed', {
          description: detailMsg,
        });
      }
    } catch (err: any) {
      // Offline fallback for demo accounts
      const cleanEmail = identifier.trim().toLowerCase();
      const demoUser = quickRoles.find(r => r.email.toLowerCase() === cleanEmail);
      if (demoUser) {
        login(demoUser.email, demoUser.role, 'authenticated-demo-token', {
          id: `USR-${demoUser.role}-01`,
          name: demoUser.label,
          email: demoUser.email,
          role: demoUser.role,
          isKycVerified: true
        });
        toast.info(`Offline Access: Signed in as ${demoUser.label}`);
        router.push(routeMap[demoUser.role] || '/');
        return;
      }

      const offlineMsg = 'Unable to reach the authentication server. Please ensure the backend API is running.';
      setErrorMessage(offlineMsg);
      toast.error('Connection Error', {
        description: offlineMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectDemoRole = (r: typeof quickRoles[0]) => {
    setRole(r.role);
    setIdentifier(r.email);
    setPassword(r.password);
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/images/smart_agri_hero.jpg')] bg-cover bg-center font-sans antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#064E3B]/80 z-0" />
      
      {/* Floating Centered Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8 space-y-5 transition-all relative z-10 my-auto">
        
        {/* Card Top Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center pb-2">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <KisanSetuLogo size="md" variant="dark" showTagline={false} />
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {redirectTo ? (
                <span className="text-emerald-700 font-bold">
                  Please sign in to continue
                </span>
              ) : (
                'Sign in to your account'
              )}
            </p>
          </div>
        </div>

        {/* Quick 1-Click Role Selector */}
        <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
          <div className="flex items-center justify-center text-center pb-0.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Choose Your Role
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {quickRoles.map((r) => {
              const isSelected = role === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => selectDemoRole(r)}
                  className={`py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 scale-[1.02]'
                      : 'bg-white text-slate-700 hover:bg-slate-100/80 border-slate-200/90'
                  }`}
                >
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl shrink-0">{r.icon}</span>
                    <span className="text-[13px] sm:text-[14px] leading-tight tracking-tight">{r.label}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-white shrink-0 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Authentication Failed</p>
              <p className="text-[11px] text-rose-700/90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Field 1: Email Address / Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Email Address / Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={15} />
              </div>
              <Input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="name@example.com or +91-9876543210"
                className="pl-10 h-11 text-sm bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
            </div>
          </div>

          {/* Field 2: Password with Eye Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <Link 
                href="#" 
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={15} />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter your security password"
                className="pl-10 pr-10 h-11 text-sm bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-base tracking-wide shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </Button>

        </form>

        {/* Card Footer Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <span>New to Krishi Niti?</span>
          <Link 
            href={`/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}&preselectedRole=${encodeURIComponent(role)}` : ''}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
          >
            Create Account <ArrowRight size={13} />
          </Link>
        </div>

      </div>

    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8 text-slate-400 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading authentication gateway...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
