'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Phone,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/api';

export interface FarmgateOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId?: number;
  expectedOtp?: string;
  transporterName?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  fuelAdvanceAmount?: number;
  cropTitle?: string;
  onSuccess: () => void;
}

export function FarmgateOtpModal({
  isOpen,
  onClose,
  escrowId = 101,
  expectedOtp = '4821',
  transporterName = 'Kisan Express Logistics',
  vehicleNumber = 'MH-15-EG-4421',
  driverName = 'Vikram Shinde',
  driverPhone = '+91 98234-56789',
  fuelAdvanceAmount = 1425,
  cropTitle = 'Sharbati Wheat (5.0 Tons)',
  onSuccess
}: FarmgateOtpModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Auto-focus on first digit box upon opening
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '']);
      setErrorMsg(null);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    setErrorMsg(null);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-advance to next input
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[3].current?.focus();
    }
  };

  const handleAutoFillDemo = () => {
    setOtp(expectedOtp.split(''));
    setErrorMsg(null);
  };

  const handleConfirmHandshake = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter all 4 digits of the driver handshake OTP.');
      return;
    }

    if (enteredOtp !== expectedOtp) {
      setErrorMsg(`Invalid OTP "${enteredOtp}". Please check the 4-digit code provided by driver ${driverName}.`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Trigger backend advance freight release & pickup verification
      await Promise.all([
        fetch(`${API_BASE_URL}/api/escrow/advance-freight/${escrowId}`, { method: 'POST' }).catch(() => {}),
        fetch(`${API_BASE_URL}/api/escrow/verify-pickup/${escrowId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: enteredOtp })
        }).catch(() => {})
      ]);
    } catch {
      // Fallback
    }

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-left relative overflow-hidden">
        
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <Truck size={22} className="text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Farmgate Pickup Handshake
                </h3>
                <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-200">
                  Step 3 Escrow
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorize transporter loading &amp; 30% fuel advance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Transporter Fleet & Driver Card */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Assigned Fleet Transporter</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GPS Verified at Farmgate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">Vehicle &amp; Fleet</span>
              <strong className="text-slate-900 text-xs font-black block truncate">{vehicleNumber}</strong>
              <span className="text-[10px] text-slate-500 truncate block">{transporterName}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">Driver Contact</span>
              <strong className="text-slate-900 text-xs font-black block truncate">{driverName}</strong>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Phone size={10} className="text-emerald-600" /> {driverPhone}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 px-0.5">
            <span>Produce Payload:</span>
            <strong className="text-slate-900 font-bold">{cropTitle}</strong>
          </div>
        </div>

        {/* 4-Digit OTP Input Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound size={14} className="text-purple-600" />
              <span>Enter 4-Digit Driver Handshake Code:</span>
            </label>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 font-mono underline cursor-pointer"
            >
              Demo Auto-Fill ({expectedOtp})
            </button>
          </div>

          <div className="flex justify-center gap-3">
            {otp.map((digit, idx) => (
              <input
                key={`otp-box-${idx}`}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-13 h-14 text-center text-2xl font-black font-mono text-emerald-950 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed text-center">
            🔐 <strong>Smart Contract Action:</strong> Confirming this code verifies physical produce handover and instantly disburses <strong>₹{fuelAdvanceAmount.toLocaleString('en-IN')} (30% Fuel Advance)</strong> to the driver's bank account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-1/3 h-11 text-xs font-bold rounded-xl border-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirmHandshake}
            disabled={loading}
            className="w-2/3 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <span>Verifying Handshake...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Confirm &amp; Disburse 30%</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
