'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { SellVsWaitCard } from '@/components/dashboard/SellVsWaitCard';
import { useLocaleContext, useCropTranslation, toLocalizedDigits } from '@/lib/LocaleContext';

interface MandiPriceFeed {
  commodity: string;
  market: string;
  state: string;
  modal_price_kg: number;
  min_price_kg: number;
  max_price_kg: number;
  forecast_7d_modal_kg: number;
  arrival_date: string;
  grade?: string;
  variety?: string;
}

export default function MarketItemPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string) || '';
  const item = decodeURIComponent((params.item as string) || '');
  const { currentLocale } = useLocaleContext();
  const tCrop = useCropTranslation();
  
  const [itemData, setItemData] = useState<MandiPriceFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/decision/agmarknet-feed`);
        if (res.ok) {
          const prices: MandiPriceFeed[] = await res.json();
          const match = prices.find(p => p.commodity.toLowerCase() === item.toLowerCase());
          if (match) setItemData(match);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [item]);

  const getBackText = () => {
    switch (currentLocale) {
      case 'hi': return 'वापस जाएं';
      case 'mr': return 'परत जा';
      case 'pa': return 'ਵਾਪਸ ਜਾਓ';
      case 'gu': return 'પાછા જાઓ';
      case 'ta': return 'திரும்பு';
      case 'te': return 'తిరిగి వెళ్లండి';
      case 'kn': return 'ಹಿಂತಿರುಗಿ';
      default: return `Back to ${category}`;
    }
  };

  const getApmcText = () => {
    switch (currentLocale) {
      case 'hi': return 'कृषि उपज मंडी';
      case 'mr': return 'बाजार समिती';
      case 'pa': return 'ਮੰਡੀ';
      case 'gu': return 'માર્કેટ યાર્ડ';
      case 'ta': return 'சந்தை குழு';
      case 'te': return 'మార్కెట్ యార్డ్';
      case 'kn': return 'ಮಾರುಕಟ್ಟೆ';
      default: return 'APMC';
    }
  };

  const getModalPriceLabel = () => {
    switch (currentLocale) {
      case 'hi': return 'वर्तमान दर (मॉडल)';
      case 'mr': return 'सध्याचा दर (सरासरी)';
      case 'pa': return 'ਮੌਜੂਦਾ ਭਾਅ (ਮਾਡਲ)';
      case 'gu': return 'વર્તમાન ભાવ (મોડલ)';
      case 'ta': return 'தற்போதைய விலை (சராசரி)';
      case 'te': return 'ప్రస్తుత ధర (సగటు)';
      case 'kn': return 'ಪ್ರಸ್ತುತ ಬೆಲೆ (ಮಾದರಿ)';
      default: return 'Current Price (Modal)';
    }
  };

  const getMaxPriceLabel = () => {
    switch (currentLocale) {
      case 'hi': return 'उच्चतम भाव (अधिकतम)';
      case 'mr': return 'सर्वोच्च दर (कमाल)';
      case 'pa': return 'ਉੱਚਤਮ ਭਾਅ (ਵੱਧ ਤੋਂ ਵੱਧ)';
      case 'gu': return 'મહત્તમ ભાવ';
      case 'ta': return 'அதிகபட்ச விலை';
      case 'te': return 'అత్యధిక ధర';
      case 'kn': return 'ಗರಿಷ್ಠ ಬೆಲೆ';
      default: return 'Highest Price (Max)';
    }
  };

  const getMinPriceLabel = () => {
    switch (currentLocale) {
      case 'hi': return 'न्यूनतम भाव (कम से कम)';
      case 'mr': return 'किमान दर';
      case 'pa': return 'ਘੱਟੋ-ਘੱਟ ਭਾਅ';
      case 'gu': return 'ન્યૂનતમ ભાવ';
      case 'ta': return 'குறைந்தபட்ச விலை';
      case 'te': return 'అత్యల్ప ధర';
      case 'kn': return 'ಕನಿಷ್ಠ ಬೆಲೆ';
      default: return 'Lowest Price (Min)';
    }
  };

  const getForecastHeading = () => {
    switch (currentLocale) {
      case 'hi': return '७-दिवसीय मूल्य पूर्वानुमान विश्लेषण';
      case 'mr': return '७-दिवसांचे भाव अंदाज विश्लेषण';
      case 'pa': return '੭-ਦਿਨਾਂ ਦੀ ਕੀਮਤ ਭਵਿੱਖਬਾਣੀ ਵਿਸ਼ਲੇਸ਼ਣ';
      case 'gu': return '૭-દિવસની કિંમત આગાહી વિશ્લેષણ';
      case 'ta': return '7-நாள் விலை முன்னறிவிப்பு பகுப்பாய்வு';
      case 'te': return '7-రోజుల ధర అంచనా విశ్లేషణ';
      case 'kn': return '7-ದಿನಗಳ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ವಿಶ್ಲೇಷಣೆ';
      default: return '7-Day Price Forecast Analysis';
    }
  };

  const getKgUnit = () => {
    switch (currentLocale) {
      case 'hi': return 'किग्रा';
      case 'mr': return 'किलो';
      case 'pa': return 'ਕਿਲੋ';
      case 'gu': return 'કિલો';
      case 'ta': return 'கிலோ';
      case 'te': return 'కిలో';
      case 'kn': return 'ಕೆಜಿ';
      default: return 'kg';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold cursor-pointer transition-colors">
        <ArrowLeft size={16} /> {getBackText()}
      </button>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#3B38D0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : itemData ? (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <TrendingUp size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                {tCrop(itemData.commodity)}
              </h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-xl border border-blue-200">
                {itemData.market} {getApmcText()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{getModalPriceLabel()}</p>
                <p className="text-3xl font-black text-slate-900">
                  ₹{toLocalizedDigits((itemData.modal_price_kg || 0).toFixed(2), currentLocale)}
                  <span className="text-sm text-slate-500">/{getKgUnit()}</span>
                </p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-1">{getMaxPriceLabel()}</p>
                <p className="text-3xl font-black text-emerald-700">
                  ₹{toLocalizedDigits((itemData.max_price_kg || itemData.modal_price_kg || 0).toFixed(2), currentLocale)}
                  <span className="text-sm text-emerald-600/60">/{getKgUnit()}</span>
                </p>
              </div>
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                <p className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mb-1">{getMinPriceLabel()}</p>
                <p className="text-3xl font-black text-rose-700">
                  ₹{toLocalizedDigits((itemData.min_price_kg || itemData.modal_price_kg || 0).toFixed(2), currentLocale)}
                  <span className="text-sm text-rose-600/60">/{getKgUnit()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* AI Decision Engine (Sell vs Wait) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <SellVsWaitCard />
          </div>

          {/* Price Graph */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-[#3B38D0]" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{getForecastHeading()}</h2>
            </div>
            
            <PriceChart commodity={itemData.commodity} mandiPrices={[]} />
          </div>
          
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <AlertCircle className="text-slate-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {currentLocale === 'hi' ? 'वस्तु नहीं मिली' : currentLocale === 'mr' ? 'वस्तू सापडली नाही' : currentLocale === 'pa' ? 'ਵਸਤੂ ਨਹੀਂ ਮਿਲੀ' : 'Item Not Found'}
          </h2>
          <p className="text-slate-500">
            {currentLocale === 'hi' ? 'इस विशिष्ट वस्तु के लिए कोई रीयल-टाइम एगमार्कनेट डेटा नहीं मिला।' : currentLocale === 'mr' ? 'या विशिष्ट घटकासाठी कोणताही रीअल-टाइम डेटा आढळला नाही.' : currentLocale === 'pa' ? 'ਇਸ ਖਾਸ ਵਸਤੂ ਲਈ ਕੋਈ ਰੀਅਲ-ਟਾਈਮ ਡਾਟਾ ਨਹੀਂ ਮਿਲਿਆ।' : "We couldn't find live Agmarknet data for this specific item."}
          </p>
        </div>
      )}
    </div>
  );
}
