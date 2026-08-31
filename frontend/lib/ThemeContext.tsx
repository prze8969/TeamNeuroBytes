'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 
  | 'eco-clean' 
  | 'cyber-dark' 
  | 'golden-harvest' 
  | 'bharat-digital' 
  | 'royal-emerald' 
  | 'minimal-slate';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  swatches: string[];
  navBg: string;
  navBorder: string;
  navText: string;
  heroBgGradient: string;
  heroTextGradient: string;
  heroCtaButton: string;
  heroCtaIconBg: string;
  heroCtaIconColor: string;
  heroGlow1: string;
  heroGlow2: string;
  badgeBg: string;
  primaryAccent: string;
}

export const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  'eco-clean': {
    id: 'eco-clean',
    name: '🌿 Clean Eco Mint',
    shortName: 'Eco Mint',
    tagline: 'Modern high-trust fintech with rich forest green & mint gradients.',
    icon: '🌿',
    swatches: ['#064e3b', '#10b981', '#34d399', '#fef08a'],
    navBg: 'bg-emerald-950/95',
    navBorder: 'border-emerald-800/70',
    navText: 'text-emerald-100',
    heroBgGradient: 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#011a14]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200',
    heroCtaButton: 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-emerald-500/15',
    heroGlow2: 'bg-amber-400/10',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#10b981',
  },
  'cyber-dark': {
    id: 'cyber-dark',
    name: '🌌 Cyber Agritech Dark',
    shortName: 'Cyber Dark',
    tagline: 'Deep midnight space navy with electric neon mint and cyan AI glows.',
    icon: '🌌',
    swatches: ['#0b132b', '#06b6d4', '#10b981', '#38bdf8'],
    navBg: 'bg-[#0B132B]/95',
    navBorder: 'border-cyan-900/60',
    navText: 'text-cyan-100',
    heroBgGradient: 'bg-gradient-to-b from-[#0B132B] via-[#0D1B3A] to-[#060B18]',
    heroTextGradient: 'bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300',
    heroCtaButton: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-cyan-300',
    heroGlow1: 'bg-cyan-500/20',
    heroGlow2: 'bg-emerald-500/15',
    badgeBg: 'bg-cyan-400 text-slate-950',
    primaryAccent: '#06b6d4',
  },
  'golden-harvest': {
    id: 'golden-harvest',
    name: '🌾 Golden Harvest & Earth',
    shortName: 'Golden Harvest',
    tagline: 'Warm golden amber, wheat gold, and earthy deep olive.',
    icon: '🌾',
    swatches: ['#1b2e1e', '#f59e0b', '#d97706', '#fde68a'],
    navBg: 'bg-[#182619]/95',
    navBorder: 'border-amber-900/40',
    navText: 'text-amber-100',
    heroBgGradient: 'bg-gradient-to-b from-[#1C2A1E] via-[#142016] to-[#0A120B]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400',
    heroCtaButton: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-amber-500/20',
    heroGlow2: 'bg-yellow-400/15',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#f59e0b',
  },
  'bharat-digital': {
    id: 'bharat-digital',
    name: '🇮🇳 National Bharat Digital',
    shortName: 'Bharat Digital',
    tagline: 'Deep Chakra Navy with Indian Saffron and Agri Green (National DPI / ONDC style).',
    icon: '🇮🇳',
    swatches: ['#0a2540', '#ea580c', '#2563eb', '#16a34a'],
    navBg: 'bg-[#0A2540]/95',
    navBorder: 'border-blue-900/60',
    navText: 'text-blue-100',
    heroBgGradient: 'bg-gradient-to-b from-[#0A2540] via-[#06182C] to-[#020B15]',
    heroTextGradient: 'bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400',
    heroCtaButton: 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-orange-400',
    heroGlow1: 'bg-orange-500/20',
    heroGlow2: 'bg-emerald-500/15',
    badgeBg: 'bg-orange-500 text-white',
    primaryAccent: '#ea580c',
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: '🍃 Royal Emerald & Champagne',
    shortName: 'Royal Emerald',
    tagline: 'Deep British Racing Green with Champagne Gold accents.',
    icon: '🍃',
    swatches: ['#022c22', '#fbbf24', '#059669', '#fef9c3'],
    navBg: 'bg-[#022C22]/95',
    navBorder: 'border-emerald-800/80',
    navText: 'text-emerald-100',
    heroBgGradient: 'bg-gradient-to-b from-[#033E30] via-[#022C22] to-[#011712]',
    heroTextGradient: 'bg-gradient-to-r from-yellow-200 via-amber-300 to-emerald-200',
    heroCtaButton: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 shadow-yellow-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-yellow-400',
    heroGlow1: 'bg-emerald-400/20',
    heroGlow2: 'bg-yellow-300/15',
    badgeBg: 'bg-yellow-400 text-slate-950',
    primaryAccent: '#fbbf24',
  },
  'minimal-slate': {
    id: 'minimal-slate',
    name: '💎 Minimal Slate & Charcoal',
    shortName: 'Minimal Slate',
    tagline: 'Ultra-clean dark slate with crisp emerald pill accents (Stripe/Apple Pro aesthetic).',
    icon: '💎',
    swatches: ['#0f172a', '#1e293b', '#10b981', '#f8fafc'],
    navBg: 'bg-slate-950/95',
    navBorder: 'border-slate-800/80',
    navText: 'text-slate-200',
    heroBgGradient: 'bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#020617]',
    heroTextGradient: 'bg-gradient-to-r from-slate-100 via-emerald-300 to-slate-200',
    heroCtaButton: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-emerald-400',
    heroGlow1: 'bg-emerald-500/15',
    heroGlow2: 'bg-slate-400/10',
    badgeBg: 'bg-emerald-500 text-slate-950',
    primaryAccent: '#10b981',
  },
};

interface ThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'eco-clean',
  setTheme: () => {},
  config: THEME_CONFIGS['eco-clean'],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>('eco-clean');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishiniti_color_theme') as ColorTheme;
      if (saved && THEME_CONFIGS[saved]) {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('krishiniti_color_theme', newTheme);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: THEME_CONFIGS[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
