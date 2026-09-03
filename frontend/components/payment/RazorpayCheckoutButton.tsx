'use client';

import React, { useState } from 'react';
import { initiateRazorpayCheckout, VerifyPaymentResult } from '@/lib/razorpay';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface RazorpayCheckoutButtonProps {
  amountInRupees?: number;
  amountInPaise?: number;
  receipt?: string;
  orderTitle?: string;
  orderDescription?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  className?: string;
  buttonText?: string;
  onPaymentSuccess?: (result: VerifyPaymentResult) => void;
  onPaymentError?: (errorMessage: string) => void;
  onPaymentDismiss?: () => void;
}

export function RazorpayCheckoutButton({
  amountInRupees,
  amountInPaise,
  receipt,
  orderTitle = 'KrishiNiti / KisanSetu Escrow',
  orderDescription = 'Secure Payment via Razorpay Gateway',
  customerName = 'Demo Farmer/Buyer',
  customerEmail = 'user@kisansetu.in',
  customerPhone = '9876543210',
  className = '',
  buttonText,
  onPaymentSuccess,
  onPaymentError,
  onPaymentDismiss,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Calculate amount in paise (minimum 100 paise)
  const paise =
    amountInPaise !== undefined
      ? amountInPaise
      : Math.round((amountInRupees !== undefined ? amountInRupees : 500) * 100);

  const displayRupees = (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCheckout = async () => {
    setLoading(true);
    setStatusMessage(null);

    await initiateRazorpayCheckout({
      amount: paise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      name: orderTitle,
      description: orderDescription,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      themeColor: '#059669',
      onSuccess: (res) => {
        setLoading(false);
        setStatusMessage({
          type: 'success',
          text: `Payment Verified! ID: ${res.payment_id}`,
        });
        if (onPaymentSuccess) {
          onPaymentSuccess(res);
        }
      },
      onError: (err) => {
        setLoading(false);
        setStatusMessage({
          type: 'error',
          text: err || 'Payment failed or verification error',
        });
        if (onPaymentError) {
          onPaymentError(err);
        }
      },
      onDismiss: () => {
        setLoading(false);
        setStatusMessage({
          type: 'info',
          text: 'Payment cancelled by user',
        });
        if (onPaymentDismiss) {
          onPaymentDismiss();
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        id="razorpay-checkout-button"
        disabled={loading}
        onClick={handleCheckout}
        className={
          className ||
          'relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 shadow-md shadow-emerald-700/20 transition-all cursor-pointer'
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-100" />
            <span>{buttonText || `Pay ₹${displayRupees} with Razorpay`}</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          role="alert"
          className={`flex items-start gap-2 p-3 rounded-lg text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {statusMessage.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          {statusMessage.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          {statusMessage.type === 'info' && (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
