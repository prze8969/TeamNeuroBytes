'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { USER_ROLES } from '@/lib/constants'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('farmer@kisansetu.in')
  const [password, setPassword] = useState('farmer123')
  const [role, setRole] = useState('FARMER')
  const [loading, setLoading] = useState(false)

  const quickRoles = [
    { role: 'FARMER', email: 'farmer@kisansetu.in', label: '🚜 Farmer' },
    { role: 'BUYER', email: 'buyer@kisansetu.in', label: '🏢 Buyer' },
    { role: 'ORGANIZATION', email: 'fpo@kisansetu.in', label: '👥 FPO Co.' },
    { role: 'TRANSPORTATION', email: 'transporter@kisansetu.in', label: '🚚 Transporter' },
    { role: 'ADMIN', email: 'admin@kisansetu.in', label: '⚖️ Admin' },
  ]

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)

    const routeMap: Record<string, string> = {
      FARMER: '/farmer/dashboard',
      BUYER: '/buyer/dashboard',
      FPO: '/fpo/dashboard',
      ORGANIZATION: '/fpo/dashboard',
      WAREHOUSE: '/warehouse/dashboard',
      TRANSPORTATION: '/transportation/dashboard',
      ADMIN: '/admin/dashboard',
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        const data = await res.json()
        const resolvedRole = data.role || role
        document.cookie = `token=${data.access_token}; path=/;`
        document.cookie = `user_role=${resolvedRole}; path=/;`
        if (resolvedRole === 'BUYER') {
          try {
            localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
          } catch {}
        }
        router.push(routeMap[resolvedRole] || '/farmer/dashboard')
        return
      }
    } catch {
      // Fallback
    }

    document.cookie = "token=mock-jwt-token; path=/;"
    document.cookie = `user_role=${role}; path=/;`
    if (role === 'BUYER') {
      try {
        localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
      } catch {}
    }
    router.push(routeMap[role] || '/farmer/dashboard')
    setLoading(false)
  }

  const selectDemoRole = (r: typeof quickRoles[0]) => {
    setRole(r.role)
    setEmail(r.email)
    setPassword(`${r.role.toLowerCase()}123`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-2xl border border-emerald-200">
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl shadow-inner border border-emerald-200">
            🌾
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sign In to KisanSetu</h2>
          <p className="text-xs text-slate-500">National Agricultural Trade & Price Discovery Hub</p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="space-y-1.5 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
            ⚡ Quick 1-Click Role Login:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {quickRoles.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => selectDemoRole(r)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  role === r.role
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-emerald-100/60 border-emerald-200'
                }`}
              >
                <span>{r.label}</span>
                {role === r.role && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <Input
              type="email"
              required
              className="bg-white border-slate-300 text-slate-900 text-xs h-10 focus:border-emerald-500"
              placeholder="user@kisansetu.in"
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

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 shadow-md shadow-emerald-600/30 text-xs tracking-wide rounded-xl"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex justify-between items-center">
          <span>New to KisanSetu?</span>
          <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  )
}
