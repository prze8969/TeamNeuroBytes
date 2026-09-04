'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronDown, Trees, Landmark, Cpu } from 'lucide-react';
import { useAppTheme, ColorTheme, THEME_CONFIGS, ThemeConfig } from '@/lib/ThemeContext';
import { useLocaleContext } from '@/lib/LocaleContext';

export function ThemeSwitcher({ variant = 'nav' }: { variant?: 'nav' | 'floating' }) {
  const { theme, setTheme, config } = useAppTheme();
  const { currentLocale } = useLocaleContext();
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

  const getThemeShortName = (id: string, fallback: string) => {
    switch (currentLocale) {
      case 'hi':
        switch (id) {
          case 'sunlit-farm': return 'सनलिट फार्म';
          case 'terracotta-earth': return 'टेराकोटा मिट्टी';
          case 'agri-banking': return 'एग्री बैंकिंग';
          case 'tea-estate': return 'चाय बागान';
          case 'sarson-gold': return 'सरसों गोल्ड';
          case 'paper-clean': return 'क्लीन पेपर';
          case 'eco-mint': return 'इको मिंट';
          case 'golden-harvest': return 'गोल्डन हार्वेस्ट';
          case 'bharat-digital': return 'भारत डिजिटल';
          case 'cyber-dark': return 'साइबर डार्क';
          default: return fallback;
        }
      case 'mr':
        switch (id) {
          case 'sunlit-farm': return 'सनलिट फार्म';
          case 'terracotta-earth': return 'टेराकोटा माती';
          case 'agri-banking': return 'अॅग्री बँकिंग';
          case 'tea-estate': return 'चहा बाग';
          case 'sarson-gold': return 'मोहरी गोल्ड';
          case 'paper-clean': return 'क्लीन पेपर';
          case 'eco-mint': return 'इको मिंट';
          case 'golden-harvest': return 'गोल्डन हार्वेस्ट';
          case 'bharat-digital': return 'भारत डिजिटल';
          case 'cyber-dark': return 'सायबर डार्क';
          default: return fallback;
        }
      case 'pa':
        switch (id) {
          case 'sunlit-farm': return 'ਸਨਲਿਟ ਫਾਰਮ';
          case 'terracotta-earth': return 'ਮਿੱਟੀ ਰੰਗ';
          case 'agri-banking': return 'ਐਗਰੀ ਬੈਂਕਿੰਗ';
          case 'tea-estate': return 'ਚਾਹ ਬਾਗਾਨ';
          case 'sarson-gold': return 'ਸਰ੍ਹੋਂ ਗੋਲਡ';
          case 'paper-clean': return 'ਕਲੀਨ ਪੇਪਰ';
          case 'eco-mint': return 'ਈਕੋ ਮਿੰਟ';
          case 'golden-harvest': return 'ਗੋਲਡਨ ਹਾਰਵੈਸਟ';
          case 'bharat-digital': return 'ਭਾਰਤ ਡਿਜੀਟਲ';
          case 'cyber-dark': return 'ਸਾਈਬਰ ਡਾਰਕ';
          default: return fallback;
        }
      case 'gu':
        switch (id) {
          case 'sunlit-farm': return 'સનલિટ ફાર્મ';
          case 'terracotta-earth': return 'ટેરાકોટા માટી';
          case 'agri-banking': return 'એગ્રી બેંકિંગ';
          case 'tea-estate': return 'ચા બગીચો';
          case 'sarson-gold': return 'સરસવ ગોલ્ડ';
          case 'paper-clean': return 'ક્લીન પેપર';
          case 'eco-mint': return 'ઇકો મિન્ટ';
          case 'golden-harvest': return 'ગોલ્ડન હાર્વેસ્ટ';
          case 'bharat-digital': return 'ભારત ડિજિટલ';
          case 'cyber-dark': return 'સાયબર ડાર્ક';
          default: return fallback;
        }
      case 'ta':
        switch (id) {
          case 'sunlit-farm': return 'சன்லிட் பண்ணை';
          case 'terracotta-earth': return 'மண் நிறம்';
          case 'agri-banking': return 'அக்ரி பேங்கிங்';
          case 'tea-estate': return 'தேயிலைத் தோட்டம்';
          case 'sarson-gold': return 'கடுகு தங்கம்';
          case 'paper-clean': return 'காகித தூய்மை';
          case 'eco-mint': return 'சுற்றுச்சூழல் புதினா';
          case 'golden-harvest': return 'தங்க அறுவடை';
          case 'bharat-digital': return 'பாரத டிஜிட்டல்';
          case 'cyber-dark': return 'சைபர் டார்க்';
          default: return fallback;
        }
      case 'te':
        switch (id) {
          case 'sunlit-farm': return 'సన్‌లిట్ ఫార్మ్';
          case 'terracotta-earth': return 'టెర్రకోట మట్టి';
          case 'agri-banking': return 'అగ్రి బ్యాంకింగ్';
          case 'tea-estate': return 'టీ తోట';
          case 'sarson-gold': return 'ఆవాల బంగారం';
          case 'paper-clean': return 'క్లీన్ పేపర్';
          case 'eco-mint': return 'ఎకో మింట్';
          case 'golden-harvest': return 'గోల్డెన్ హార్వెస్ట్';
          case 'bharat-digital': return 'భారత్ డిజిటల్';
          case 'cyber-dark': return 'సైబర్ డార్క్';
          default: return fallback;
        }
      case 'kn':
        switch (id) {
          case 'sunlit-farm': return 'ಸನ್‌ಲಿಟ್ ಫಾರ್ಮ್';
          case 'terracotta-earth': return 'ಟೆರ್ರಾಕೋಟಾ ಮಣ್ಣು';
          case 'agri-banking': return 'ಅಗ್ರಿ ಬ್ಯಾಂಕಿಂಗ್';
          case 'tea-estate': return 'ಚಹಾ ತೋಟ';
          case 'sarson-gold': return 'ಸಾಸಿವೆ ಗೋಲ್ಡ್';
          case 'paper-clean': return 'ಕ್ಲೀನ್ ಪೇಪರ್';
          case 'eco-mint': return 'ಇಕೋ ಮಿಂಟ್';
          case 'golden-harvest': return 'ಗೋಲ್ಡನ್ ಹಾರ್ವೆಸ್ಟ್';
          case 'bharat-digital': return 'ಭಾರತ್ ಡಿಜಿಟಲ್';
          case 'cyber-dark': return 'ಸೈಬರ್ ಡಾರ್ಕ್';
          default: return fallback;
        }
      default:
        return fallback;
    }
  };

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
              {getThemeShortName(t.id, t.shortName)}
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
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-amber-200">
          {currentLocale === 'hi' ? 'थीम:' 
            : currentLocale === 'mr' ? 'थीम:' 
            : currentLocale === 'pa' ? 'ਥੀਮ:' 
            : currentLocale === 'gu' ? 'થીમ:' 
            : currentLocale === 'ta' ? 'தீம்:' 
            : currentLocale === 'te' ? 'థీమ్:' 
            : currentLocale === 'kn' ? 'ಥೀಮ್:' 
            : 'Theme:'}
        </span>
        <span className="font-bold">{getThemeShortName(config.id, config.shortName)}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] rounded-3xl bg-slate-950/98 border border-slate-800 text-white shadow-2xl p-3.5 space-y-3.5 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
          <div className="px-2 pb-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                {currentLocale === 'hi' ? 'थीम चुनें' 
                  : currentLocale === 'mr' ? 'थीम निवडा' 
                  : currentLocale === 'pa' ? 'ਥੀਮ ਚੁਣੋ' 
                  : currentLocale === 'gu' ? 'થીમ પસંદ કરો' 
                  : currentLocale === 'ta' ? 'தீம் தேர்ந்தெடுக்கவும்' 
                  : currentLocale === 'te' ? 'థీమ్‌ను ఎంచుకోండి' 
                  : currentLocale === 'kn' ? 'ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ' 
                  : 'Choose Aesthetic Theme'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              {currentLocale === 'hi' ? `${allThemes.length} थीम उपलब्ध` 
                : currentLocale === 'mr' ? `${allThemes.length} थीम उपलब्ध` 
                : currentLocale === 'pa' ? `${allThemes.length} ਥੀਮ ਉਪਲਬਧ` 
                : `${allThemes.length} Curated Themes`}
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            
            {/* Category 1: Natural & Human */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-1">
                <Trees size={12} />
                <span>
                  {currentLocale === 'hi' ? 'प्राकृतिक एवं ग्रामीण' 
                    : currentLocale === 'mr' ? 'नैसर्गिक आणि ग्रामीण' 
                    : currentLocale === 'pa' ? 'ਕੁਦਰਤੀ ਅਤੇ ਖੇਤ' 
                    : currentLocale === 'gu' ? 'કુદરતી અને ખેતી' 
                    : currentLocale === 'ta' ? 'இயற்கை மற்றும் பண்ணை' 
                    : currentLocale === 'te' ? 'సహజ మరియు వ్యవసాయ' 
                    : currentLocale === 'kn' ? 'ನೈಸರ್ಗಿಕ ಮತ್ತು ಕೃಷಿ' 
                    : 'Natural, Farm & Earthy (Non-AI)'}
                </span>
              </div>
              <div className="space-y-1.5">
                {naturalThemes.map(renderThemeButton)}
              </div>
            </div>

            {/* Category 2: Institutional & Banking */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 px-1">
                <Landmark size={12} />
                <span>
                  {currentLocale === 'hi' ? 'संस्थागत बैंकिंग एवं डीपीआई' 
                    : currentLocale === 'mr' ? 'संस्थात्मक बँकिंग आणि डीपीआय' 
                    : currentLocale === 'pa' ? 'ਬੈਂਕਿੰਗ ਅਤੇ ਸੰਸਥਾਗਤ' 
                    : currentLocale === 'gu' ? 'સંસ્થાકીય બેંકિંગ' 
                    : currentLocale === 'ta' ? 'வங்கி மற்றும் நிறுவன' 
                    : currentLocale === 'te' ? 'బ్యాంకింగ్ & సంస్థాగత' 
                    : currentLocale === 'kn' ? 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಸಾಂಸ್ಥಿಕ' 
                    : 'Institutional Banking & DPI'}
                </span>
              </div>
              <div className="space-y-1.5">
                {institutionalThemes.map(renderThemeButton)}
              </div>
            </div>

            {/* Category 3: Tech & Minimal */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-1">
                <Cpu size={12} />
                <span>
                  {currentLocale === 'hi' ? 'तकनीकी एवं डार्क' 
                    : currentLocale === 'mr' ? 'तांत्रिक आणि डार्क' 
                    : currentLocale === 'pa' ? 'ਤਕਨੀਕੀ ਅਤੇ ਡਾਰਕ' 
                    : currentLocale === 'gu' ? 'ટેક અને ડાર્ક' 
                    : currentLocale === 'ta' ? 'தொழில்நுட்பம் மற்றும் டார்க்' 
                    : currentLocale === 'te' ? 'టెక్ & డార్క్' 
                    : currentLocale === 'kn' ? 'ಟೆಕ್ ಮತ್ತು ಡಾರ್ಕ್' 
                    : 'Tech & Dark'}
                </span>
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
