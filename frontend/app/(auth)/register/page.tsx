'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { USER_ROLES } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    document.cookie = `token=mock-jwt-token; path=/;`;
    document.cookie = `user_role=${role}; path=/;`;

    if (role === 'FARMER') {
      router.push('/(auth)/kyc');
    } else if (role === 'BUYER') {
      router.push('/buyer/dashboard');
    } else if (role === 'FPO') {
      router.push('/fpo/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-1 text-sm text-gray-600">Join TeamNeuroBytes Agricultural Command Center</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <Input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <Input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Account Role</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
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

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Register & Continue
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-emerald-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
