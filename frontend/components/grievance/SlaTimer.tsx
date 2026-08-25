'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export function SlaTimer({ deadline, resolvedAt }: { deadline: string; resolvedAt?: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (resolvedAt) {
      setTimeLeft('Resolved in SLA');
      setIsOverdue(false);
      return;
    }

    const target = new Date(deadline).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setTimeLeft('SLA Breach / Overdue');
        return;
      }

      setIsOverdue(false);
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 60000); // update every minute

    return () => clearInterval(intervalId);
  }, [deadline, resolvedAt]);

  if (resolvedAt) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
        <Clock className="w-3.5 h-3.5" />
        {timeLeft}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md border ${
      isOverdue 
        ? 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse' 
        : 'text-amber-700 bg-amber-50 border-amber-200'
    }`}>
      {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      {timeLeft}
    </div>
  );
}
