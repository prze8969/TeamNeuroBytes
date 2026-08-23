'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KycPage() {
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState('5892 4819 8921');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cibilScore, setCibilScore] = useState<number | null>(null);

  const handleDigiLockerConnect = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setCibilScore(765);
    }, 1000);
  };

  const handleCompleteKyc = () => {
    document.cookie = "kyc_status=VERIFIED; path=/;";
    router.push('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-2xl border border-emerald-200">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-2xl shadow-inner border border-emerald-200">
            🔒
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">DigiLocker e-KYC Verification</h2>
          <p className="text-xs text-slate-500">Govt. of India UIDAI & Land Records Identity Sandbox</p>
        </div>

        {!verified ? (
          <div className="space-y-4">
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider block">
                🛡️ Verified Identity Standard
              </span>
              <p className="text-[11px] text-slate-600">
                Instantly unlocks verified Escrow payouts, Agmarknet direct bidding floor, and FPO freight pooling.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number / Virtual ID</label>
              <Input
                type="text"
                placeholder="Enter 12-digit Aadhaar"
                className="bg-white border-slate-300 text-slate-900 font-mono text-xs h-10 tracking-widest focus:border-emerald-500"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 text-xs shadow-md shadow-emerald-600/30 tracking-wide rounded-xl"
              onClick={handleDigiLockerConnect}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                  Connecting DigiLocker Sandbox...
                </span>
              ) : (
                <span>⚡ Verify with DigiLocker Aadhaar</span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-200 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900">✅ Identity & Land Record Verified</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-black">
                  PASS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60">
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">Aadhaar Masked</span>
                  <strong className="text-slate-900 font-mono">XXXX-XXXX-8921</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">Agri-Credit CIBIL</span>
                  <strong className="text-emerald-700">{cibilScore} (Prime Tier)</strong>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 text-xs shadow-md shadow-emerald-600/30 tracking-wide rounded-xl"
              onClick={handleCompleteKyc}
            >
              Launch Farmer Command Center →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
