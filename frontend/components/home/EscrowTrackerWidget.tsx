'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, CheckCircle2, ArrowRight, Wallet, Building2, Truck } from 'lucide-react';
import { toast } from 'sonner';

export function EscrowTrackerWidget() {
  const [activeStep, setActiveStep] = useState<number>(3);
  const [otpInput, setOtpInput] = useState<string>('4821');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(true);

  const handleVerifyOtp = () => {
    if (otpInput === '4821' || otpInput === '7394') {
      setIsOtpVerified(true);
      setActiveStep(4);
      toast.success('4-Digit Milestone OTP Verified!', {
        description: 'Bank Escrow Vault unlocked ₹1,27,500.00 directly to Ramesh Patil bank account.'
      });
    } else {
      toast.error('Invalid Escrow OTP Code', {
        description: 'Please enter valid farmgate handshake OTP (Demo: 4821 or 7394)'
      });
    }
  };

  return (
    <div className="bg-emerald-950/90 rounded-3xl border border-emerald-700/80 p-6 sm:p-8 space-y-6 text-left font-sans text-white shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-mono font-extrabold uppercase text-amber-300 tracking-wider">
              RBI Escrow Vault Guidelines &amp; Milestone Handshake
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            Zero-Default Bank Escrow Tracker
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-2xl text-xs font-black shadow-md">
          <ShieldCheck size={15} />
          <span>Vault #ESC-2026-9842 • ₹1,33,612.50 Locked</span>
        </div>
      </div>

      {/* 4-Milestone Progress Tracker Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { step: 1, label: 'Buyer Deposit', desc: '100% Escrow Lock', icon: <Building2 size={16} /> },
          { step: 2, label: 'Fuel Advance', desc: '30% Transporter Release', icon: <Truck size={16} /> },
          { step: 3, label: 'Farmgate OTP', desc: 'Farmer OTP Handshake', icon: <KeyRound size={16} /> },
          { step: 4, label: 'Instant Payout', desc: '100% Bank Disbursement', icon: <Wallet size={16} /> },
        ].map((item) => {
          const isDone = activeStep > item.step || (activeStep === item.step && isOtpVerified);
          const isCurrent = activeStep === item.step;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-300'
                  : isDone
                  ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                  isCurrent ? 'bg-slate-950 text-amber-300' : isDone ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-900 text-emerald-300'
                }`}>
                  Milestone 0{item.step}
                </span>
                {isDone && <CheckCircle2 size={16} className={isCurrent ? 'text-slate-950' : 'text-emerald-400'} />}
              </div>

              <div className="font-extrabold text-sm mt-2 flex items-center gap-1.5">
                {item.icon}
                <span>{item.label}</span>
              </div>

              <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-slate-900 font-semibold' : 'text-emerald-200'}`}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Milestone Interactive Box */}
      <div className="p-6 rounded-2xl bg-emerald-900/90 text-white border border-emerald-700/80 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
          <div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
              Active Milestone Handshake
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {activeStep === 4 ? '100% Payout Disbursed to Farmer' : 'Farmgate OTP Release Verification'}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-xl">
              Lot #LOT-WHEAT-5001
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 space-y-2">
            <div className="flex justify-between text-emerald-200">
              <span>Locked Escrow Amount:</span>
              <strong className="text-white">₹1,33,612.50</strong>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>Transporter Fuel Advance (30%):</span>
              <strong className="text-amber-300">₹1,260.00</strong>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>Net Farmer Payout:</span>
              <strong className="text-emerald-400 font-black">₹1,27,500.00</strong>
            </div>
          </div>

          {/* Interactive OTP Input Simulator */}
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-200 font-sans font-bold">Simulate Farmgate Handshake OTP:</span>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-24 h-10 px-3 rounded-lg border border-amber-400 bg-emerald-900 text-center font-mono font-black text-lg text-white tracking-widest focus:outline-none"
              />
              <button
                onClick={handleVerifyOtp}
                className="h-10 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-black text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>Verify OTP &amp; Release</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
