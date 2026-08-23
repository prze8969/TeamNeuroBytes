'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KycPage() {
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleDigiLockerConnect = () => {
    setIsVerifying(true);
    // Simulate DigiLocker OAuth & Aadhaar verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const handleCompleteKyc = () => {
    document.cookie = "kyc_status=VERIFIED; path=/;";
    router.push('/farmer/dashboard');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl">
            🔒
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">DigiLocker KYC Verification</h2>
          <p className="mt-1 text-sm text-gray-600">Instantly verify your Aadhaar & Land Record ownership</p>
        </div>

        {!verified ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Aadhaar Number / Virtual ID</label>
              <Input
                type="text"
                placeholder="Enter 12-digit Aadhaar"
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2"
              onClick={handleDigiLockerConnect}
              disabled={isVerifying || aadhaar.length < 12}
            >
              {isVerifying ? (
                <span>Verifying with DigiLocker...</span>
              ) : (
                <span>Connect with DigiLocker</span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-sm font-bold text-emerald-800">✅ Identity & Land Record Verified!</p>
              <p className="text-xs text-emerald-600 mt-1">Aadhaar linked via Govt DigiLocker API</p>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleCompleteKyc}
            >
              Proceed to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
