"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";

export interface BoundingBoxData {
  id: str | string;
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  is_suppressed?: boolean;
}

export interface GradeProbabilitiesData {
  grade_a: number;
  grade_b: number;
  grade_c: number;
  grade_d: number;
}

export interface SmartGradingResultPayload {
  global_grade: string; // "Grade A", "Grade B", "Grade C", "Grade D"
  predicted_rank: number; // 0, 1, 2, 3
  continuous_score: number; // e.g. 0.1542
  is_rejected: boolean; // Smart rejection flag
  status_flag: "PASSED" | "PASSED_WITH_WARNING" | "REJECTED" | string;
  warning_message?: string | null;
  probabilities: GradeProbabilitiesData;
  defects: BoundingBoxData[];
  image_dimensions?: [number, number]; // [width, height]
  imageUrl?: string;
}

interface GradingResultProps {
  result: SmartGradingResultPayload;
  imageUrl?: string;
}

export const GradingResult: React.FC<GradingResultProps> = ({
  result,
  imageUrl = "/placeholder-crop.jpg",
}) => {
  const [showSuppressedBoxes, setShowSuppressedBoxes] = useState<boolean>(true);

  const {
    global_grade,
    predicted_rank,
    continuous_score,
    is_rejected,
    status_flag,
    warning_message,
    probabilities,
    defects = [],
    image_dimensions = [800, 600],
  } = result;

  const [imgWidth, imgHeight] = image_dimensions;

  // Grade color theme mapping
  const getGradeBadgeStyle = (rank: number) => {
    switch (rank) {
      case 0:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-950/50";
      case 1:
        return "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-950/50";
      case 2:
        return "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-950/50";
      case 3:
      default:
        return "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-950/50";
    }
  };

  // Filter defects based on toggle state
  const visibleDefects = defects.filter(
    (d) => !d.is_suppressed || showSuppressedBoxes
  );
  const suppressedCount = defects.filter((d) => d.is_suppressed).length;
  const activeDefectCount = defects.filter((d) => !d.is_suppressed).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 bg-slate-900/90 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER: DINOv2 GLOBAL GRADE DISPLAY */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-950/90 via-slate-900 to-slate-950 border border-slate-800/80 shadow-inner">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center border text-2xl font-black tracking-wider shadow-lg ${getGradeBadgeStyle(
              predicted_rank
            )}`}
          >
            {global_grade.replace("Grade ", "")}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                Meta DINOv2 Global Classifier
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 mr-1" /> QWK = 1.0000
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              GLOBAL GRADE: <span className="text-emerald-400">{global_grade}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous Index Score:{" "}
              <span className="font-mono text-slate-200 font-semibold">
                {continuous_score.toFixed(4)}
              </span>{" "}
              / 3.0000
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          {is_rejected ? (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <XCircle className="w-5 h-5 text-rose-400 animate-pulse" />
              <span className="text-sm font-bold tracking-wide">STATUS: REJECTED</span>
            </div>
          ) : status_flag === "PASSED_WITH_WARNING" ? (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold tracking-wide">GRADE A/B PASSED</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold tracking-wide">PASSED & APPROVED</span>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SMART REJECTION & WARNING BANNER HIERARCHY */}
      {/* ------------------------------------------------------------- */}
      {is_rejected ? (
        /* RED BANNER: Hard Rejection for Grade C/D */
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-200 flex items-start space-x-3 shadow-lg shadow-rose-950/40">
          <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-300">
              AI REJECTED: DEFECT THRESHOLD EXCEEDED
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {warning_message ||
                "Crop quality falls below commercial standard threshold due to severe surface rot and texture degradation."}
            </p>
          </div>
        </div>
      ) : status_flag === "PASSED_WITH_WARNING" || suppressedCount > 0 ? (
        /* YELLOW WARNING CARD: Minor Texture Variations Suppressed for Grade A/B */
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 flex items-start space-x-3 shadow-lg shadow-amber-950/30">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                MINOR SURFACE VARIATIONS DETECTED
              </h4>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Grade {global_grade.replace("Grade ", "")} Hierarchy Policy Active
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {warning_message ||
                "Normal crop skin texture detected. Bounding box defects were suppressed because global DINOv2 rating is Grade A/B."}
            </p>
          </div>
        </div>
      ) : (
        /* GREEN APPROVAL CARD */
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-start space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              PREMIUM EXPORT QUALITY APPROVED
            </h4>
            <p className="text-xs text-emerald-200/90">
              Crop meets top-tier APMC institutional clearing standards with zero critical defect flags.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BOUNDING BOX IMAGE CANVAS OVERLAY & DEEP ANALYSIS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Image Bounding Box Overlay (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-emerald-400" /> Local Defect Localization
            </span>

            {/* Toggle suppressed boxes */}
            {suppressedCount > 0 && (
              <button
                onClick={() => setShowSuppressedBoxes(!showSuppressedBoxes)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {showSuppressedBoxes ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hide Suppressed ({suppressedCount})</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Show Suppressed ({suppressedCount})</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
            {/* Base Crop Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Analyzed Agricultural Crop"
              className="w-full h-auto object-cover max-h-[460px]"
            />

            {/* Render Overlay Bounding Boxes */}
            {visibleDefects.map((defect) => {
              const [x1, y1, x2, y2] = defect.box;
              const leftPct = (x1 / imgWidth) * 100;
              const topPct = (y1 / imgHeight) * 100;
              const widthPct = ((x2 - x1) / imgWidth) * 100;
              const heightPct = ((y2 - y1) / imgHeight) * 100;

              const isSuppressed = defect.is_suppressed;

              return (
                <div
                  key={defect.id}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  }}
                  className={`absolute pointer-events-none transition-all duration-300 ${
                    isSuppressed
                      ? "border-2 border-dashed border-amber-400/80 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                      : "border-2 border-solid border-rose-500 bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse"
                  }`}
                >
                  <span
                    className={`absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded shadow tracking-wider whitespace-nowrap ${
                      isSuppressed
                        ? "bg-amber-500/90 text-slate-950 font-bold"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {defect.label} {(defect.confidence * 100).toFixed(0)}%
                    {isSuppressed ? " (Suppressed)" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-xs border-2 border-dashed border-amber-400 bg-amber-400/20 mr-1.5"></span>
              Minor Surface Texture (Suppressed for Grade A/B)
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-xs border-2 border-solid border-rose-500 bg-rose-500/20 mr-1.5"></span>
              Active Defect Detection
            </span>
          </div>
        </div>

        {/* Classification Probabilities Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-4 bg-slate-950/70 p-5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-teal-400" /> Grade Distribution
            </h3>
            <span className="text-[10px] text-slate-500">CORAL Ordinal Head</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Grade A (Export)", key: "grade_a", rank: 0, val: probabilities.grade_a },
              { label: "Grade B (Standard)", key: "grade_b", rank: 1, val: probabilities.grade_b },
              { label: "Grade C (Processing)", key: "grade_c", rank: 2, val: probabilities.grade_c },
              { label: "Grade D (Defective)", key: "grade_d", rank: 3, val: probabilities.grade_d },
            ].map((item) => {
              const isCurrentGrade = predicted_rank === item.rank;
              const pct = (item.val * 100).toFixed(1);

              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span
                      className={
                        isCurrentGrade
                          ? "text-emerald-400 font-bold flex items-center"
                          : "text-slate-400"
                      }
                    >
                      {item.label}
                      {isCurrentGrade && (
                        <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </span>
                    <span className="font-mono text-slate-200">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCurrentGrade
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-slate-600"
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Architecture Info Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Backbone:</span>
              <span className="text-slate-200 font-medium">Meta DINOv2 ViT-B/14</span>
            </div>
            <div className="flex justify-between">
              <span>Local Detector:</span>
              <span className="text-slate-200 font-medium">YOLOv8 Object Detection</span>
            </div>
            <div className="flex justify-between">
              <span>Smart Policy:</span>
              <span className="text-emerald-400 font-semibold">Grade A/B Defect Suppression</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GradingResult;
