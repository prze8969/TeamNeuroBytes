'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateFPOLot } from '@/lib/api/fpo-api';
import { toast } from 'sonner';
import { Edit, X, AlertCircle } from 'lucide-react';

interface EditFPOLotModalProps {
  isOpen: boolean;
  lot: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditFPOLotModal({ isOpen, lot, onClose, onSuccess }: EditFPOLotModalProps) {
  const [formData, setFormData] = useState({
    commodity: '',
    variety: '',
    quantity_kg: 0,
    base_price_per_kg: 0,
    quality_grade: 'A',
    destination_mandi: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lot) {
      setFormData({
        commodity: lot.commodity || lot.cropName || '',
        variety: lot.variety || '',
        quantity_kg: lot.quantity_kg || lot.quantityKg || 5000,
        base_price_per_kg: lot.base_price_per_kg || lot.basePricePerKg || 24.50,
        quality_grade: (lot.quality_grade || lot.qualityGrade || 'A').toString().includes('B') ? 'B' : (lot.quality_grade || lot.qualityGrade || 'A').toString().includes('C') ? 'C' : 'A',
        destination_mandi: lot.destination_mandi || 'Nashik APMC'
      });
    }
  }, [lot]);

  if (!isOpen || !lot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const numericId = typeof lot.id === 'string' ? parseInt(lot.id.replace('LOT-', ''), 10) || 1 : lot.id;

    try {
      await updateFPOLot(numericId, {
        commodity: formData.commodity,
        variety: formData.variety,
        quantity_kg: Number(formData.quantity_kg),
        base_price_per_kg: Number(formData.base_price_per_kg),
        quality_grade: formData.quality_grade,
        destination_mandi: formData.destination_mandi
      });

      toast.success('🎉 Member Lot Successfully Updated!', {
        description: `Updated lot parameters for ${formData.commodity}.`
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update member crop lot');
      toast.error('Error updating lot', {
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
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              <Edit size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Edit Member Produce Lot #{lot.id}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Farmer: {lot.farmer_name || lot.farmerName || 'Ramesh Patil'}
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
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Commodity *
              </label>
              <input
                type="text"
                required
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Variety
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
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
                value={formData.base_price_per_kg}
                onChange={(e) => setFormData({ ...formData, base_price_per_kg: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Quality Grade
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
              className="h-11 px-6 rounded-xl text-xs font-black bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 cursor-pointer"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
