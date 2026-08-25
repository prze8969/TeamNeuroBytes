import React from 'react';
import { Lock, Unlock } from 'lucide-react';

export type EscrowStatus = 'FROZEN' | 'RELEASED';

export function EscrowStatusCard({ status, amount }: { status: EscrowStatus; amount: number }) {
  const isFrozen = status === 'FROZEN';
  
  return (
    <div className={`rounded-2xl border p-5 shadow-xs flex items-center justify-between transition-colors ${
      isFrozen ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'
    }`}>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${isFrozen ? 'text-rose-600' : 'text-emerald-700'}`}>
          Escrow Vault Status
        </p>
        <div className="flex items-center gap-2 mt-1">
          {isFrozen ? <Lock className="h-5 w-5 text-rose-700" /> : <Unlock className="h-5 w-5 text-emerald-700" />}
          <h2 className={`text-2xl font-black font-mono ${isFrozen ? 'text-rose-700' : 'text-emerald-700'}`}>
            {isFrozen ? 'FROZEN' : 'RELEASED'}
          </h2>
        </div>
        <p className={`text-[11px] mt-1 ${isFrozen ? 'text-rose-600/80' : 'text-emerald-700/80'}`}>
          {isFrozen ? 'Fund movement blocked during dispute mediation.' : 'Funds released. Transaction settled or cancelled.'}
        </p>
      </div>
      
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Locked Amount</p>
        <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
