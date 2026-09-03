'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RazorpayCheckoutButton } from '@/components/payment/RazorpayCheckoutButton';
import { VerifyPaymentResult } from '@/lib/razorpay';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Lock,
  Receipt,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const [amountRupees, setAmountRupees] = useState<number>(500);
  const [customerName, setCustomerName] = useState<string>('Ramesh Patil (Farmer / Buyer)');
  const [customerEmail, setCustomerEmail] = useState<string>('ramesh.patil@agri-example.com');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [receiptCode, setReceiptCode] = useState<string>(`RCPT-${Date.now().toString().slice(-6)}`);
  const [verifiedPayment, setVerifiedPayment] = useState<VerifyPaymentResult | null>(null);

  const presetAmounts = [1, 50, 100, 500, 2500];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <ShieldCheck size={14} />
            Razorpay Standard Web Checkout
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <CreditCard size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  KrishiNiti Payment Checkout
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure Escrow &amp; Direct Mandi Trade Settlement Powered by Razorpay Standard Gateway
                </p>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Payment Amount (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-lg text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountRupees(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      amountRupees === amt
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Converted on backend: <span className="font-mono font-bold text-slate-600">{Math.round(amountRupees * 100)} paise</span> (min 100 paise)
              </p>
            </div>

            {/* Receipt Identifier */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Receipt Reference
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Receipt size={16} />
                </span>
                <input
                  type="text"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Unique reference tracked in Razorpay Order
              </p>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Customer / Farmer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Checkout Action Section */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Settlement Amount
              </span>
              <div className="text-2xl font-black font-mono text-emerald-950">
                ₹{amountRupees.toLocaleString('en-IN')}.00
              </div>
              <span className="text-[10px] text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
                <Lock size={12} /> 256-Bit SSL Encrypted Standard Razorpay Modal
              </span>
            </div>

            <div className="w-full sm:w-auto">
              <RazorpayCheckoutButton
                amountInRupees={amountRupees}
                receipt={receiptCode}
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                orderTitle="KrishiNiti / KisanSetu"
                orderDescription={`Agri Produce Escrow Settlement (${receiptCode})`}
                onPaymentSuccess={(result) => {
                  setVerifiedPayment(result);
                }}
              />
            </div>
          </div>

          {/* Verification Result Display */}
          {verifiedPayment && (
            <div className="p-5 rounded-2xl bg-emerald-600 text-white space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                <h3 className="font-bold text-base">Payment Verified Successfully!</h3>
              </div>
              <p className="text-xs text-emerald-100">
                HMAC-SHA256 signature verification confirmed on server backend.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-emerald-700/50 p-3 rounded-xl border border-emerald-500/50">
                <div>
                  <span className="text-emerald-300 block text-[10px]">Payment ID:</span>
                  <span className="font-bold">{verifiedPayment.payment_id}</span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px]">Order ID:</span>
                  <span className="font-bold">{verifiedPayment.order_id}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Architecture & Verification Guide */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            Standard Integration Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-800 block">1. Create Order</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Calls <code className="text-emerald-700 font-mono">POST /api/create-order</code> with amount (paise). Razorpay returns official <code className="text-emerald-700 font-mono">order_id</code>.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-800 block">2. Standard Modal</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Renders Razorpay Standard Web Checkout via <code className="text-emerald-700 font-mono">checkout.js</code> modal supporting UPI, Cards, NetBanking.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-800 block">3. Verify Signature</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Calls <code className="text-emerald-700 font-mono">POST /api/verify-payment</code> with HMAC-SHA256 checksum against <code className="text-emerald-700 font-mono">KEY_SECRET</code>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
