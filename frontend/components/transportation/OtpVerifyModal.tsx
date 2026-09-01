'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, KeyRound, X, Loader2 } from 'lucide-react';
import type { TransportationOrder } from '@/lib/transportation-types';

/**
 * Farmgate loading OTP entry.
 * The backend (POST /api/transporter/{vault_id}/verify-otp) validates the
 * 4-digit code that the farmer shows on their screen. The demo hint surfaces
 * the OTP that already exists on the order record (order.farmGateOtp).
 */

interface OtpVerifyModalProps {
  order: TransportationOrder | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onVerify: (order: TransportationOrder, otp: string) => void;
}

export function OtpVerifyModal({ order, isOpen, isSubmitting, errorMessage, onClose, onVerify }: OtpVerifyModalProps) {
  const [otp, setOtp] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setOtp('');
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const canSubmit = otp.trim().length === 4 && !isSubmitting;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm farm loading">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={24} className="text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Confirm Farm Loading</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Ask the farmer for the 4-digit pickup OTP shown on their screen and enter it to start transit for{' '}
            <span className="font-semibold text-slate-700">{order.shipment.cropName}</span>.
          </p>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" aria-label="Close">
            <X size={14} className="text-slate-600" />
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onVerify(order, otp.trim());
          }}
        >
          <div>
            <label htmlFor="farmgate-otp" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pickup OTP</label>
            <div className="relative mt-1.5">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="farmgate-otp"
                ref={inputRef}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••"
                className="w-full h-12 pl-10 pr-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-lg font-mono font-bold tracking-[0.5em] text-center text-slate-900 placeholder:tracking-normal"
              />
            </div>
            {order.farmGateOtp && (
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Demo hint — OTP on farmer&apos;s screen: <span className="font-mono font-bold text-slate-600">{order.farmGateOtp}</span>
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {isSubmitting ? 'Verifying…' : 'Verify & Start Transit'}
          </button>
        </form>
      </div>
    </div>
  );
}
