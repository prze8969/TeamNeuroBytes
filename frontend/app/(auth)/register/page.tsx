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
  User, 
  Check, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { useAuth, UserRole } from '@/lib/AuthContext';
import { API_BASE_URL } from '@/lib/api';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get('redirectTo') || searchParams.get('from') || '';
  const preselectedRoleParam = searchParams.get('preselectedRole') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles: { role: UserRole; label: string; icon: string; desc: string }[] = [
    { 
      role: 'FARMER', 
      label: 'Farmer', 
      icon: '🚜',
      desc: 'List produce & get bids' 
    },
    { 
      role: 'BUYER', 
      label: 'Buyer', 
      icon: '🏢',
      desc: 'Tenders & bulk contracts' 
    },
    { 
      role: 'ORGANIZATION', 
      label: 'FPO Co.', 
      icon: '👥',
      desc: 'Pooled logistics & routes' 
    },
    { 
      role: 'TRANSPORTATION', 
      label: 'Transporter', 
      icon: '🚚',
      desc: 'Fleet haulage & OTPs' 
    },
    { 
      role: 'WAREHOUSE', 
      label: 'Warehouse', 
      icon: '🏭',
      desc: 'e-NWR & cold storage' 
    },
    { 
      role: 'ADMIN', 
      label: 'Admin', 
      icon: '⚖️',
      desc: 'Governance & disputes' 
    },
  ];

  useEffect(() => {
    if (!preselectedRoleParam) return;
    const norm = preselectedRoleParam.toLowerCase();
    let matched = roles.find(r => r.role.toLowerCase() === norm || r.label.toLowerCase() === norm);
    if (!matched) {
      if (norm.includes('farm')) matched = roles.find(r => r.role === 'FARMER');
      else if (norm.includes('buy')) matched = roles.find(r => r.role === 'BUYER');
      else if (norm.includes('fpo') || norm.includes('org')) matched = roles.find(r => r.role === 'ORGANIZATION');
      else if (norm.includes('trans') || norm.includes('truck')) matched = roles.find(r => r.role === 'TRANSPORTATION');
      else if (norm.includes('ware') || norm.includes('cold')) matched = roles.find(r => r.role === 'WAREHOUSE');
      else if (norm.includes('admin') || norm.includes('gov')) matched = roles.find(r => r.role === 'ADMIN');
    }
    if (matched) {
      setRole(matched.role);
    }
  }, [preselectedRoleParam]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password,
          role: role
        })
      });

      login(email, role, 'authenticated-session-token', {
        name: name,
        email: email,
        role: role,
        isKycVerified: false
      });

      if (role === 'BUYER') {
        try {
          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
        } catch {}
      }

      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      if (role === 'FARMER') {
        router.push('/kyc?role=FARMER');
      } else if (role === 'BUYER') {
        router.push('/kyc?role=BUYER');
      } else if (role === 'ORGANIZATION') {
        router.push('/fpo/dashboard');
      } else if (role === 'TRANSPORTATION') {
        router.push('/transportation/dashboard');
      } else if (role === 'WAREHOUSE') {
        router.push('/warehouse/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      login(email, role, 'authenticated-session-token', {
        name: name,
        email: email,
        role: role,
        isKycVerified: false
      });

      if (role === 'BUYER') {
        try {
          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
        } catch {}
      }

      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      if (role === 'FARMER') {
        router.push('/kyc?role=FARMER');
      } else if (role === 'BUYER') {
        router.push('/kyc?role=BUYER');
      } else if (role === 'ORGANIZATION') {
        router.push('/fpo/dashboard');
      } else if (role === 'TRANSPORTATION') {
        router.push('/transportation/dashboard');
      } else if (role === 'WAREHOUSE') {
        router.push('/warehouse/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/images/smart_agri_hero.jpg')] bg-cover bg-center font-sans antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#064E3B]/80 z-0" />
      
      {/* Floating Centered Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-5 sm:p-6 space-y-4 transition-all relative z-10 my-auto">
        
        {/* Card Top Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-center pb-1">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <KisanSetuLogo size="md" variant="dark" showTagline={false} />
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Create an Account
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Join the National Price Discovery &amp; Trade Hub
            </p>
          </div>
        </div>

        {/* Stakeholder Role Selector (3-column grid) */}
        <div className="flex items-center justify-center text-center pb-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Choose Your Role
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {roles.map((r) => {
            const isSelected = role === r.role;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => setRole(r.role)}
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

        {/* Main Registration Form */}
        <form onSubmit={handleRegister} className="space-y-3">
          
          {/* Field 1: Full Legal Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Full Legal Name / Entity Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={15} />
              </div>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil / Sahyadri Agro Ltd."
                className="pl-10 h-11 text-sm bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
            </div>
          </div>

          {/* Field 2: Email Address / Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Email Address / Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={15} />
              </div>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="pl-10 h-11 text-sm bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
            </div>
          </div>

          {/* Field 3: Password with Eye Toggle */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={15} />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password (min. 8 chars)"
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

          {/* Primary Action Button: Large Vibrant Emerald CTA */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-base tracking-wide shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Creating Account...' : 'Create Account & Continue'}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </Button>

        </form>

        {/* Card Footer Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <span>Already have an account?</span>
          <Link 
            href={`/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}&preselectedRole=${encodeURIComponent(role)}` : ''}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
          >
            Sign In to Portal <ArrowRight size={13} />
          </Link>
        </div>

      </div>

    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8 text-slate-400 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading registration gateway...</span>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
