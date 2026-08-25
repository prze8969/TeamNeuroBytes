'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone, 
  ChevronRight,
  Check,
  Building2,
  Users,
  Truck,
  Warehouse,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('farmer@kisansetu.in');
  const [password, setPassword] = useState('farmer123');
  const [role, setRole] = useState('FARMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickRoles = [
    { 
      role: 'FARMER', 
      email: 'farmer@kisansetu.in', 
      label: 'Farmer', 
      icon: '🚜',
      desc: 'List produce & get bids' 
    },
    { 
      role: 'BUYER', 
      email: 'buyer@kisansetu.in', 
      label: 'Buyer', 
      icon: '🏢',
      desc: 'Tenders & bulk contracts' 
    },
    { 
      role: 'ORGANIZATION', 
      email: 'fpo@kisansetu.in', 
      label: 'FPO Co.', 
      icon: '👥',
      desc: 'Pooled logistics & routes' 
    },
    { 
      role: 'TRANSPORTATION', 
      email: 'transporter@kisansetu.in', 
      label: 'Transporter', 
      icon: '🚚',
      desc: 'Fleet haulage & OTPs' 
    },
    { 
      role: 'WAREHOUSE', 
      email: 'warehouse@kisansetu.in', 
      label: 'Warehouse', 
      icon: '🏭',
      desc: 'e-NWR & cold storage' 
    },
    { 
      role: 'ADMIN', 
      email: 'admin@kisansetu.in', 
      label: 'Admin', 
      icon: '⚖️',
      desc: 'Governance & disputes' 
    },
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

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
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });

      if (res.ok) {
        const data = await res.json();
        const resolvedRole = data.role || role;
        document.cookie = `token=${data.access_token}; path=/;`;
        document.cookie = `user_role=${resolvedRole}; path=/;`;
        if (resolvedRole === 'BUYER') {
          try {
            localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
          } catch {}
        }
        router.push(routeMap[resolvedRole] || '/farmer/dashboard');
        return;
      }
    } catch {
      // Fallback in case backend is offline
    }

    document.cookie = "token=mock-jwt-token; path=/;";
    document.cookie = `user_role=${role}; path=/;`;
    if (role === 'BUYER') {
      try {
        localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
      } catch {}
    }
    router.push(routeMap[role] || '/farmer/dashboard');
    setLoading(false);
  };

  const selectDemoRole = (r: typeof quickRoles[0]) => {
    setRole(r.role);
    setIdentifier(r.email);
    setPassword(`${r.role.toLowerCase()}123`);
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* LEFT SIDE (50% width - Hero & Value Proposition) */}
      {/* ========================================================================= */}
      <section className="relative w-full lg:w-1/2 min-h-[520px] lg:min-h-screen bg-gradient-to-br from-[#064E3B] via-[#043d2e] to-[#022C22] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden shadow-2xl z-10">
        
        {/* Subtle Geometric Contour Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row on Left */}
        <div className="relative z-10 space-y-6">
          
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center group transition-transform duration-200 hover:scale-[1.02]">
              <KisanSetuLogo size="md" variant="light" showTagline={false} />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              National Trade Hub
            </span>
          </div>

          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-200 text-xs font-black tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-300 animate-pulse" />
            <span>Empowering 100,000+ Indian Farmers &amp; Buyers</span>
          </div>

          {/* High-Impact Hero Headline */}
          <div className="space-y-3 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
              Smart Trading. <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                Prosperous Farmers.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              Direct institutional price discovery, RBI-regulated milestone escrow vaults, and instant YOLOv8 AI computer vision produce grading for modern Indian agriculture.
            </p>
          </div>
        </div>

        {/* 3D Minimalist Illustration Showcase */}
        <div className="relative z-10 my-6 lg:my-8 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-xl p-3 shadow-2xl shadow-emerald-950/80 group">
            <img 
              src="/images/smart_agri_hero.jpg" 
              alt="Kisan Setu Smart Agriculture Platform" 
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient vignette on image */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 3 Floating Value Metric Badges */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          {/* Badge 1: ₹0 Middleman Fees */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-400/25 backdrop-blur-md space-y-1 hover:border-emerald-400/50 transition-colors">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-black">
              <Zap size={14} className="text-emerald-400" />
              <span>₹0 Middleman Fees</span>
            </div>
            <p className="text-[11px] text-emerald-200/70 font-medium">100% Direct Realisation</p>
          </div>

          {/* Badge 2: Instant DBT Settlement */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-400/25 backdrop-blur-md space-y-1 hover:border-emerald-400/50 transition-colors">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-black">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Instant DBT Settlement</span>
            </div>
            <p className="text-[11px] text-emerald-200/70 font-medium">RBI-Compliant Escrow Vaults</p>
          </div>

          {/* Badge 3: YOLOv8 AI Quality Grading */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-400/25 backdrop-blur-md space-y-1 hover:border-emerald-400/50 transition-colors">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-black">
              <Sparkles size={14} className="text-emerald-400" />
              <span>YOLOv8 AI Grading</span>
            </div>
            <p className="text-[11px] text-emerald-200/70 font-medium">Computer Vision Assay</p>
          </div>

        </div>

        {/* Footer info on left */}
        <div className="relative z-10 pt-6 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300/70">
          <span>Supported by Digital India &amp; Ministry of Agriculture</span>
          <span className="font-mono text-[11px]">ISO 27001 Certified</span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* RIGHT SIDE (50% width - Clean Enterprise Login Form Card) */}
      {/* ========================================================================= */}
      <section className="w-full lg:w-1/2 min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 sm:p-10 lg:p-16">
        
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10 space-y-7 transition-all">
          
          {/* Card Top Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <KisanSetuLogo size="md" variant="dark" showTagline={false} />
              </Link>
              <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                v2.4 Enterprise
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sign in to Price Discovery &amp; Trade Hub
              </p>
            </div>
          </div>

          {/* Quick 1-Click Role Selector (Micro-Icons + Pill States) */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Quick 1-Click Role Selector:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Demo mode</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickRoles.map((r) => {
                const isSelected = role === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => selectDemoRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 scale-[1.02]'
                        : 'bg-white text-slate-700 hover:bg-slate-100/80 border-slate-200/90'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                    </span>
                    {isSelected && <Check size={13} className="text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Authentication Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field 1: Email Address / Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
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
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +91-9876543210"
                  className="pl-10 h-11 text-xs bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                />
              </div>
            </div>

            {/* Field 2: Password with Eye Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="pl-10 pr-10 h-11 text-xs bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
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
              className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>

          </form>

          {/* Card Footer Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>New to Kisan Setu?</span>
            <Link 
              href="/register" 
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
            >
              Create Account <ArrowRight size={13} />
            </Link>
          </div>

          {/* Trust Banner */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <Lock size={12} className="text-emerald-600" />
              256-Bit SSL Encryption • DigiLocker e-KYC Verified
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}
