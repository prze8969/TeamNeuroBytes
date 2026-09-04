'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

export function Slide5Intelligence() {
  const { currentLocale } = useLocaleContext();

  const getTitle = () => {
    switch (currentLocale) {
      case 'hi': return 'सटीक जानें कि कब बेचना है।';
      case 'mr': return 'पीक कधी विकायचे ते अचूक जाणून घ्या.';
      case 'pa': return 'ਸਹੀ ਸਮੇਂ ਜਾਣੋ ਕਿ ਕਦੋਂ ਵੇਚਣਾ ਹੈ।';
      case 'gu': return 'ચોક્કસ જાણો ક્યારે વેચવું.';
      case 'ta': return 'எப்போது விற்க வேண்டும் என்பதை துல்லியமாக அறிந்து கொள்ளுங்கள்.';
      case 'te': return 'ఎప్పుడు అమ్మాలో ఖచ్చితంగా తెలుసుకోండి.';
      case 'kn': return 'ಯಾವಾಗ ಮಾರಾಟ ಮಾಡಬೇಕೆಂದು ನಿಖರವಾಗಿ ತಿಳಿಯಿರಿ.';
      default: return 'Know exactly when to sell.';
    }
  };

  const getSubtitle = () => {
    switch (currentLocale) {
      case 'hi': return 'हमारा प्लेटफॉर्म सिर्फ फसलों की लिस्टिंग नहीं करता। हम एआई से बाजार भाव का पूर्वानुमान लगाते हैं ताकि आप तय कर सकें कि आज बेचना है या बेहतर दाम के लिए रुकना है।';
      case 'mr': return 'आमचे प्लॅटफॉर्म फक्त पिकांची नोंदणी करत नाही. आम्ही एआय तंत्रज्ञानाने बाजारभावाचा अंदाज लावतो जेणेकरून तुम्हाला कळेल की आज विकायचे की चांगल्या भावासाठी थांबायचे.';
      case 'pa': return 'ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਸਿਰਫ਼ ਫ਼ਸਲਾਂ ਦੀ ਸੂਚੀ ਨਹੀਂ ਬਣਾਉਂਦਾ। ਅਸੀਂ ਮੰਡੀ ਦੇ ਭਾਅ ਦਾ ਅਨੁਮਾਨ ਲਗਾਉਂਦੇ ਹਾਂ ਤਾਂ ਜੋ ਤੁਸੀਂ ਫੈਸਲਾ ਕਰ ਸਕੋ ਕਿ ਅੱਜ ਵੇਚਣਾ ਹੈ ਜਾਂ ਬਿਹਤਰ ਭਾਅ ਦੀ ਉਡੀਕ ਕਰਨੀ ਹੈ।';
      case 'gu': return 'અમારું પ્લેટફોર્મ માત્ર પાકની યાદી બનાવતું નથી. અમે બજાર ભાવની આગાહી કરીએ છીએ જેથી તમે નક્કી કરી શકો કે આજે વેચવું કે સારા ભાવ માટે રાહ જોવી.';
      default: return "Our platform doesn't just list your crops. We predict market prices so you know whether to sell today or wait for a better price.";
    }
  };

  const getButtonText = () => {
    switch (currentLocale) {
      case 'hi': return 'जानें हम कैसे अलग हैं';
      case 'mr': return 'आम्ही कसे वेगळे आहोत ते पहा';
      default: return "See how we're different";
    }
  };

  const getCardData = () => {
    switch (currentLocale) {
      case 'hi':
        return {
          market: 'नासिक एपीएमसी',
          liveForecast: 'लाइव पूर्वानुमान',
          currentPrice: 'मौजूदा भाव',
          forecast7d: `${toLocalizedDigits(7, 'hi')}-दिवसीय पूर्वानुमान`,
          recommendedLabel: 'अनुशंसित कदम',
          recommendedAction: `${toLocalizedDigits(7, 'hi')} दिन रुकें`,
          potentialValue: `+₹${toLocalizedDigits('6,500', 'hi')} संभावित अतिरिक्त लाभ`,
          statusPill: 'एआई बाजार विश्लेषण सक्रिय',
          unit: '/किग्रा'
        };
      case 'mr':
        return {
          market: 'नाशिक एपीएमसी',
          liveForecast: 'थेट अंदाज',
          currentPrice: 'सध्याचा भाव',
          forecast7d: `${toLocalizedDigits(7, 'mr')} दिवसांचा अंदाज`,
          recommendedLabel: 'शिफारस केलेली कृती',
          recommendedAction: `${toLocalizedDigits(7, 'mr')} दिवस थांबा`,
          potentialValue: `+₹${toLocalizedDigits('6,५००', 'mr')} संभाव्य अतिरिक्त नफा`,
          statusPill: 'एआय बाजार विश्लेषण सक्रिय',
          unit: '/किलो'
        };
      case 'pa':
        return {
          market: 'ਨਾਸਿਕ ਏਪੀਐਮਸੀ',
          liveForecast: 'ਲਾਈਵ ਅਨੁਮਾਨ',
          currentPrice: 'ਮੌਜੂਦਾ ਭਾਅ',
          forecast7d: `${toLocalizedDigits(7, 'pa')}-ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ`,
          recommendedLabel: 'ਸਿਫਾਰਸ਼ੀ ਕਦਮ',
          recommendedAction: `${toLocalizedDigits(7, 'pa')} ਦਿਨ ਉਡੀਕੋ`,
          potentialValue: `+₹${toLocalizedDigits('6,500', 'pa')} ਸੰਭਾਵੀ ਵਾਧੂ ਲਾਭ`,
          statusPill: 'ਏਆਈ ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ ਸਰਗਰਮ',
          unit: '/ਕਿਲੋ'
        };
      case 'gu':
        return {
          market: 'નાસિક એપીએમસી',
          liveForecast: 'લાઇવ આગાહી',
          currentPrice: 'વર્તમાન ભાવ',
          forecast7d: `${toLocalizedDigits(7, 'gu')} દિવસની આગાહી`,
          recommendedLabel: 'ભલામણ કરેલ પગલું',
          recommendedAction: `${toLocalizedDigits(7, 'gu')} દિવસ રાહ જુઓ`,
          potentialValue: `+₹${toLocalizedDigits('6,500', 'gu')} સંભવિત વધારાનો નફો`,
          statusPill: 'એઆઈ બજાર વિશ્લેષણ સક્રિય',
          unit: '/કિલો'
        };
      default:
        return {
          market: 'Nashik APMC',
          liveForecast: 'Live Forecast',
          currentPrice: 'Current price',
          forecast7d: '7-day forecast',
          recommendedLabel: 'Recommended Action',
          recommendedAction: 'Wait 7 days',
          potentialValue: '+₹6,500 potential value',
          statusPill: 'AI Market Analysis Active',
          unit: '/kg'
        };
    }
  };

  const card = getCardData();
  const currentPriceVal = toLocalizedDigits('25.50', currentLocale);
  const forecastPriceVal = toLocalizedDigits('27.20', currentLocale);

  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#04130c] relative px-6 py-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left max-w-lg w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            {getTitle()}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mt-6 mx-auto lg:mx-0 rounded-full" />
          <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed mb-8">
            {getSubtitle()}
          </p>
          
          <Link 
            href="/platform" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-700/60 text-emerald-300 hover:text-white hover:bg-emerald-900/40 hover:border-emerald-500 transition-all text-sm font-bold tracking-wide uppercase"
          >
            <span>{getButtonText()}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right: Highly Simplified AI Visual */}
        <div className="w-full max-w-md relative">
          
          <div className="bg-[#061e13]/80 backdrop-blur-xl border border-emerald-800/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-white font-display font-bold text-xl tracking-wide">{card.market}</span>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-700 rounded-full text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Activity size={12} />
                {card.liveForecast}
              </span>
            </div>

            {/* Price Data */}
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-emerald-800/40 pb-4">
                <span className="text-emerald-100/60 text-sm">{card.currentPrice}</span>
                <span className="text-white text-2xl font-bold font-mono">₹{currentPriceVal}<span className="text-sm font-normal text-emerald-100/50">{card.unit}</span></span>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-emerald-100/60 text-sm">{card.forecast7d}</span>
                <span className="text-amber-400 text-2xl font-bold font-mono flex items-center gap-2">
                  <TrendingUp size={20} className="text-amber-400" />
                  ₹{forecastPriceVal}<span className="text-sm font-normal text-amber-400/50">{card.unit}</span>
                </span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="mt-8 bg-amber-400/10 border border-amber-400/20 p-5 rounded-2xl relative z-10">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">{card.recommendedLabel}</div>
              <div className="text-white font-display font-bold text-xl mb-2">{card.recommendedAction}</div>
              <div className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/50 inline-block px-2.5 py-1 rounded-md border border-emerald-800/50">
                {card.potentialValue}
              </div>
            </div>

          </div>

          {/* Floating decorative element */}
          <div className="absolute -bottom-5 left-2 sm:-bottom-6 sm:-left-6 bg-[#04130c] border border-emerald-800/60 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
             <span className="text-[11px] sm:text-xs font-bold text-emerald-100 tracking-wide">{card.statusPill}</span>
          </div>

        </div>

      </div>
    </section>
  );
}
