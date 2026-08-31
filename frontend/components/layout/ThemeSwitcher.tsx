'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronDown, Trees, Landmark, Cpu } from 'lucide-react';
import { useAppTheme, ColorTheme, THEME_CONFIGS, ThemeConfig } from '@/lib/ThemeContext';

export function ThemeSwitcher({ variant = 'nav' }: { variant?: 'nav' | 'floating' }) {
  const { theme, setTheme, config } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allThemes = Object.values(THEME_CONFIGS);
  const naturalThemes = allThemes.filter(t => t.category === 'natural');
  const institutionalThemes = allThemes.filter(t => t.category === 'institutional');
  const techThemes = allThemes.filter(t => t.category === 'tech');

  const renderThemeButton = (t: ThemeConfig) => {
    const isSelected = theme === t.id;
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => {
          setTheme(t.id);
          setIsOpen(false);
        }}
        className={`w-full p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 border ${
          isSelected
            ? 'bg-white/15 border-amber-400 shadow-md ring-1 ring-amber-400/60'
            : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
        }`}
      >
        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{t.icon}</span>
            <strong className={`text-xs font-bold block truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {t.name}
            </strong>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">
            {t.tagline}
          </p>
        </div>

        {/* Color preview dots & check */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center -space-x-1.5">
            {t.swatches.map((color, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-slate-950 shadow-xs"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {isSelected ? (
            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Check size={12} className="stroke-[3]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-slate-700" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-bold px-3 py-2 rounded-xl border border-white/20 bg-black/25 hover:bg-black/40 text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-md"
        title="Switch Visual Color Theme"
      >
        <Palette size={14} className="text-amber-300" />
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-amber-200">Theme:</span>
        <span className="font-bold">{config.shortName}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[420px] rounded-3xl bg-slate-950/98 border border-slate-800 text-white shadow-2xl p-3.5 space-y-3.5 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
          <div className="px-2 pb-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">Choose Aesthetic Theme</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              {allThemes.length} Curated Themes
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            
            {/* Category 1: Natural & Human */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-1">
                <Trees size={12} />
                <span>Natural, Farm &amp; Earthy (Non-AI)</span>
              </div>
              <div className="space-y-1.5">
                {naturalThemes.map(renderThemeButton)}
              </div>
            </div>

            {/* Category 2: Institutional & Banking */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 px-1">
                <Landmark size={12} />
                <span>Institutional Banking &amp; DPI</span>
              </div>
              <div className="space-y-1.5">
                {institutionalThemes.map(renderThemeButton)}
              </div>
            </div>

            {/* Category 3: Tech & Minimal */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-1">
                <Cpu size={12} />
                <span>Tech &amp; Dark</span>
              </div>
              <div className="space-y-1.5">
                {techThemes.map(renderThemeButton)}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
