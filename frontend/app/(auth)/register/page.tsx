'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { USER_ROLES } from '@/lib/constants';

import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password,
          role: role
        })
      });

      document.cookie = `token=mock-jwt-token; path=/;`;
      document.cookie = `user_role=${role}; path=/;`;
      if (role === 'BUYER') {
        try {
          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
        } catch {}
      }

      if (role === 'FARMER') {
        router.push('/kyc?role=FARMER');
      } else if (role === 'BUYER') {
        router.push('/kyc?role=BUYER');
      } else if (role === 'FPO' || role === 'ORGANIZATION') {
        router.push('/fpo/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      document.cookie = `token=mock-jwt-token; path=/;`;
      document.cookie = `user_role=${role}; path=/;`;
      if (role === 'BUYER') {
        try {
          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
        } catch {}
      }

      if (role === 'FARMER') {
        router.push('/kyc?role=FARMER');
      } else if (role === 'BUYER') {
        router.push('/kyc?role=BUYER');
      } else if (role === 'FPO' || role === 'ORGANIZATION') {
        router.push('/fpo/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-2xl border border-emerald-200">
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <KisanSetuLogo size="lg" variant="dark" showTagline={true} />
          </Link>
          <p className="text-xs text-slate-500">Create your account on National Agri-Trade &amp; Price Discovery Hub</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
            <Input
              type="text"
              required
              className="bg-white border-slate-300 text-slate-900 text-xs h-10 focus:border-emerald-500"
              placeholder="e.g. Ramesh Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <Input
              type="email"
              required
              className="bg-white border-slate-300 text-slate-900 text-xs h-10 focus:border-emerald-500"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <Input
              type="password"
              required
              className="bg-white border-slate-300 text-slate-900 text-xs h-10 focus:border-emerald-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Stakeholder Role</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none h-10"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {USER_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 shadow-md shadow-emerald-600/30 text-xs tracking-wide rounded-xl"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register & Continue'}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex justify-between items-center">
          <span>Already have an account?</span>
          <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
