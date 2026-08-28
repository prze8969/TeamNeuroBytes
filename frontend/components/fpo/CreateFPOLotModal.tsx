'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createFPOLot } from '@/lib/api/fpo-api';
import { toast } from 'sonner';
import { PlusCircle, X, Sparkles, AlertCircle } from 'lucide-react';

interface CreateFPOLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFPOLotModal({ isOpen, onClose, onSuccess }: CreateFPOLotModalProps) {
  const [formData, setFormData] = useState({
    farmer_name: '',
    farmer_phone: '+919876543210',
    commodity: 'Wheat',
    variety: 'Sharbati Lok-1',
    quantity_kg: 5000,
    base_price_per_kg: 26.50,
    quality_grade: 'A',
    quality_score: 94.0,
    destination_mandi: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmer_name || !formData.commodity || formData.quantity_kg <= 0 || formData.base_price_per_kg <= 0) {
      setError('Please fill in all required fields with valid values.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createFPOLot({
        farmer_name: formData.farmer_name,
        farmer_phone: formData.farmer_phone,
        commodity: formData.commodity,
        variety: formData.variety,
        quantity_kg: Number(formData.quantity_kg),
        base_price_per_kg: Number(formData.base_price_per_kg),
        quality_grade: formData.quality_grade,
        quality_score: Number(formData.quality_score),
        destination_mandi: formData.destination_mandi,
        district: formData.district,
        state: formData.state
      });

      toast.success('🎉 Member Lot Successfully Created!', {
        description: `Enrolled ${formData.quantity_kg} kg of ${formData.commodity} for farmer ${formData.farmer_name}.`
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create member crop lot');
      toast.error('Error creating member lot', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Add FPO Member Produce Lot
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Enroll smallholder produce directly into FPO aggregation pool
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          {/* Farmer Info */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
              Farmer Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.farmer_name}
              onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
              placeholder="e.g. Ramesh Patil"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Commodity *
              </label>
              <select
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              >
                <option value="Wheat">Wheat</option>
                <option value="Onion">Onion</option>
                <option value="Tomato">Tomato</option>
                <option value="Soybean">Soybean</option>
                <option value="Cotton">Cotton</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Chana">Desi Chana</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Variety Name
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. Sharbati Lok-1"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Quantity (KG) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Base Price (₹/KG) *
              </label>
              <input
                type="number"
                required
                step="0.5"
                min="1"
                value={formData.base_price_per_kg}
                onChange={(e) => setFormData({ ...formData, base_price_per_kg: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                AI Quality Grade
              </label>
              <select
                value={formData.quality_grade}
                onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Commercial)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Destination Mandi
              </label>
              <input
                type="text"
                value={formData.destination_mandi}
                onChange={(e) => setFormData({ ...formData, destination_mandi: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-5 rounded-xl text-xs font-bold border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl text-xs font-black bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-700/20 cursor-pointer"
            >
              {loading ? 'Submitting to Backend...' : 'Enroll Member Lot'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
