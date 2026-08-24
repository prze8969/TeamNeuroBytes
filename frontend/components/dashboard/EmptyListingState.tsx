'use client';

import React, { useState } from 'react';
import { SearchX, BellRing, RefreshCw, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EmptyListingStateProps {
  onResetFilters?: () => void;
  clusterName?: string;
  selectedCrop?: string;
}

export function EmptyListingState({
  onResetFilters,
  clusterName = 'Nashik & Western Maharashtra Corridor',
  selectedCrop = 'Produce'
}: EmptyListingStateProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribeAlert = () => {
    setIsSubscribed(true);
    toast.success('🔔 WhatsApp Harvest Alert Activated!', {
      description: `You will receive instant alerts on +91 98231 XXXXX when farmers list new ${selectedCrop} lots in ${clusterName}.`,
      duration: 5000,
    });
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/80 p-8 sm:p-12 text-center space-y-5 animate-in fade-in duration-300 max-w-2xl mx-auto shadow-2xs">
      
      {/* Icon Circle */}
      <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
        <SearchX size={32} />
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          No Active Lots Found Matching These Filters
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          No harvest tenders currently match your selected commodity, quality grade, or radius filters along the {clusterName}.
        </p>
      </div>

      {/* Cluster Pill */}
      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-600">
        <MapPin size={13} className="text-emerald-600 shrink-0" />
        <span>Monitoring: <strong>{clusterName}</strong></span>
      </div>

      {/* Dual CTA Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 w-full sm:w-auto cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset All Filters</span>
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          onClick={handleSubscribeAlert}
          disabled={isSubscribed}
          className={`h-10 px-5 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 w-full sm:w-auto cursor-pointer ${
            isSubscribed 
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          {isSubscribed ? (
            <>
              <CheckCircle2 size={14} />
              <span>WhatsApp Alert Active</span>
            </>
          ) : (
            <>
              <BellRing size={14} />
              <span>Set WhatsApp Harvest Alert</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
