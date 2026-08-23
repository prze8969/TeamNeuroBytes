'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AIGradingCard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [result, setResult] = useState<{
    grade: string;
    score: number;
    defectPercent: number;
    ripenessIndex: number;
    recommendation: string;
    commodity: string;
    moisturePercent: number;
    foreignMatterPercent: number;
  } | null>({
    grade: 'A',
    score: 94.2,
    defectPercent: 1.8,
    ripenessIndex: 95.0,
    recommendation: 'Premium Export & Institutional Grade (Eligible for ₹26.50+ Agmarknet floor)',
    commodity: 'Sharbati Wheat (Lok-1)',
    moisturePercent: 10.4,
    foreignMatterPercent: 0.6
  });

  const handleSimulateGrading = (key: string, commodityName: string, grade: string, score: number, defect: number, moisture: number) => {
    setSelectedCrop(key);
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        commodity: commodityName,
        grade: grade,
        score: score,
        defectPercent: defect,
        ripenessIndex: Math.round(100 - defect * 2),
        moisturePercent: moisture,
        foreignMatterPercent: Number((defect * 0.3).toFixed(1)),
        recommendation: grade === 'A' 
          ? 'Premium Export & Institutional Grade (Eligible for highest mandi floor)' 
          : grade === 'B' 
          ? 'Standard Commercial Grade (Ideal for FPO bulk pooling & local retail)' 
          : 'Processing & Secondary Grade (Recommended for industrial millers)',
      });
      setAnalyzing(false);
    }, 900);
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
            🔬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">YOLOv8 AI Crop Quality Computer Vision</h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase border border-emerald-200">
                Ultralytics Vision Model
              </span>
            </div>
            <p className="text-xs text-slate-500">Automated grain defect segmentation, moisture assay, and Agmarknet certification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sample Produce Selector & Simulated Camera */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Select Produce Sample to Inspect:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateGrading('wheat', 'Sharbati Wheat (Lok-1)', 'A', 94.2, 1.8, 10.4)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                  selectedCrop === 'wheat'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🌾 Wheat
              </button>
              <button
                type="button"
                onClick={() => handleSimulateGrading('onion', 'Nashik Red Onion (Garva)', 'A', 92.0, 2.1, 12.1)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                  selectedCrop === 'onion'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🧅 Onion
              </button>
              <button
                type="button"
                onClick={() => handleSimulateGrading('tomato', 'Hybrid Tomato (Vaishali)', 'B', 86.5, 4.5, 88.0)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                  selectedCrop === 'tomato'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🍅 Tomato
              </button>
            </div>
          </div>

          {/* Camera Viewport with Visual Bounding Boxes */}
          <div className="relative h-48 w-full rounded-2xl bg-slate-900 border-2 border-emerald-300 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            <div className="flex justify-between items-center z-10 text-[10px] text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE YOLOv8 INFERENCE
              </span>
              <span className="font-mono text-slate-400">FPS: 32 • Res: 640x640</span>
            </div>

            {/* Bounding Box Simulation Overlays */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <div className="w-36 h-24 border-2 border-emerald-400 rounded-lg relative bg-emerald-500/10 flex items-start p-1 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1 rounded uppercase">
                  {selectedCrop.toUpperCase()}: 96% CONF
                </span>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-300">
                  Defect: {result?.defectPercent}%
                </span>
              </div>
            </div>

            <div className="z-10 flex justify-between items-center text-xs text-slate-300">
              <span>Daylight Color-Calibrated</span>
              <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Snap Photo 📸
              </Button>
            </div>
          </div>
        </div>

        {/* AI Output Analysis Card */}
        <div className="lg:col-span-7 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-4">
          {analyzing ? (
            <div className="py-14 text-center space-y-3">
              <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
              <p className="text-xs font-bold text-emerald-900 animate-pulse">Running Neural Defect Segmentation & Moisture Assay...</p>
            </div>
          ) : result ? (
            <>
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Classified Produce</span>
                  <h4 className="text-lg font-extrabold text-slate-900">{result.commodity}</h4>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-4 py-1 text-sm font-black shadow-sm ${
                    result.grade === 'A'
                      ? 'bg-emerald-600 text-white'
                      : result.grade === 'B'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    Grade {result.grade}
                  </span>
                </div>
              </div>

              {/* 4 Precision Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center space-y-0.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Quality Score</span>
                  <p className="text-xl font-black text-emerald-700">{result.score}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center space-y-0.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Defect Area</span>
                  <p className="text-xl font-black text-rose-600">{result.defectPercent}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center space-y-0.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Moisture</span>
                  <p className="text-xl font-black text-blue-700">{result.moisturePercent}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center space-y-0.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Uniformity</span>
                  <p className="text-xl font-black text-purple-700">{result.ripenessIndex}%</p>
                </div>
              </div>

              {/* Trade Advisory */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold uppercase text-[10px]">
                  <span>💡</span> Agmarknet Floor Advisory
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.recommendation}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
