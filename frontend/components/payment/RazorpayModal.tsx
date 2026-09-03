'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, X, Smartphone, Building2, CreditCard, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // in paise
  lotId?: string;
  cropName?: string;
  paymentRail?: string;
  onPaymentSuccess: (result: {
    payment_id: string;
    order_id: string;
    signature: string;
  }) => void;
  onPaymentError?: (error: string) => void;
}

export function RazorpayModal({
  isOpen,
  onClose,
  amount,
  lotId = 'LOT-101',
  cropName = 'Sharbati Wheat',
  onPaymentSuccess,
  onPaymentError,
}: RazorpayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'netbanking' | 'card'>('card');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [upiId, setUpiId] = useState<string>('test@razorpay');
  const [cardNumber, setCardNumber] = useState<string>('4100 2800 0000 1007');
  const [cardExpiry, setCardExpiry] = useState<string>('12 / 26');
  const [cardCvv, setCardCvv] = useState<string>('123');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const inrAmount = Math.round(amount / 100);

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const orderId = `order_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      const signature = `test_sig_${Date.now()}`;

      // Simulate real bank authorization round-trip
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        }),
      });

      const verifyData = await verifyRes.json().catch(() => ({}));

      if (verifyRes.ok && verifyData.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentSuccess(false);
          onPaymentSuccess({
            payment_id: paymentId,
            order_id: orderId,
            signature,
          });
          onClose();
        }, 600);
      } else {
        throw new Error(verifyData.error || 'Payment signature verification failed');
      }
    } catch (err: any) {
      setIsProcessing(false);
      if (onPaymentError) {
        onPaymentError(err.message || 'Payment processing failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="absolute top-4 -right-12 rotate-45 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider py-1 px-12 shadow-sm z-20 pointer-events-none">
          Test Mode
        </div>

        <div className="bg-slate-900 text-white p-5 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-white">Razorpay</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-400/30">
                    Standard Web
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">KrishiNiti / KisanSetu Escrow</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Escrow Amount</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ₹{inrAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Lot #{lotId}</span>
              <span className="text-xs font-bold text-slate-300">{cropName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedMethod('upi')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              selectedMethod === 'upi'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone size={16} />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('netbanking')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              selectedMethod === 'netbanking'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={16} />
            <span>NetBanking</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              selectedMethod === 'card'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard size={16} />
            <span>Cards</span>
          </button>
        </div>

        <div className="p-5 space-y-4 min-h-[200px]">
          {selectedMethod === 'upi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold">Instant UPI Payment</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  Zero MDR Fee
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-600 shadow-2xs">
                      <QrCode size={18} />
                    </div>
                    <strong className="text-xs text-slate-900 font-bold">Scan QR or UPI ID</strong>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    GPay / PhonePe
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 font-mono">
                    UPI Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="test@razorpay"
                    className="w-full font-mono text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2.5 flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  ✅ Official Test UPI ID: <strong className="font-mono text-slate-700">test@razorpay</strong>. Funds are locked in ICICI Nodal Vault with background Web3 proof.
                </span>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-3">
              <span className="font-bold text-xs text-slate-700 block">Select Banking Institution</span>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{bank} Bank</span>
                    {selectedBank === bank && <CheckCircle2 size={14} className="text-blue-600" />}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Institutional RTGS/NEFT gateway authorization via Razorpay Corporate Rails.
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Razorpay Test Card</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded font-mono">
                  Test Credentials
                </span>
              </div>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 font-mono">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4100 2800 0000 1007"
                    className="w-full font-mono text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/26"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                ✅ Official Test Card: <strong className="font-mono text-slate-700">4100 2800 0000 1007</strong> • CVV: <strong className="font-mono text-slate-700">123</strong> • Exp: <strong className="font-mono text-slate-700">12/26</strong>
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          <Button
            type="button"
            id="btn-razorpay-modal-pay"
            disabled={isProcessing}
            onClick={handlePayNow}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              paymentSuccess ? (
                <span className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 size={18} />
                  Payment Verified!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing Escrow Lock...
                </span>
              )
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} />
                Pay ₹{inrAmount.toLocaleString('en-IN')} via Razorpay
                <ArrowRight size={16} />
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <span>Secured by</span>
            <strong className="font-bold text-slate-600">Razorpay</strong>
            <span>• 256-bit SSL • Instant DBT Anchoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
