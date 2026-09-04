'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
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

export default function MarketCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string) || '';
  const { currentLocale } = useLocaleContext();
  const tCrop = useCropTranslation();
  
  const [data, setData] = useState<MandiPriceFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/decision/agmarknet-feed`);
        if (res.ok) {
          const prices: MandiPriceFeed[] = await res.json();
          setData(prices);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, [category]);

  const getCategoryLabel = (cat: string) => {
    const c = cat.toLowerCase();
    switch (currentLocale) {
      case 'hi':
        if (c === 'vegetables') return 'सब्जी';
        if (c === 'fruits') return 'फल';
        if (c === 'grains') return 'अनाज';
        if (c === 'pulses') return 'दाल';
        if (c === 'spices') return 'मसाले';
        if (c === 'flowers') return 'फूल';
        return cat;
      case 'mr':
        if (c === 'vegetables') return 'भाजीपाला';
        if (c === 'fruits') return 'फळे';
        if (c === 'grains') return 'धान्य';
        if (c === 'pulses') return 'डाळी';
        if (c === 'spices') return 'मसाले';
        if (c === 'flowers') return 'फुले';
        return cat;
      case 'pa':
        if (c === 'vegetables') return 'ਸਬਜ਼ੀ';
        if (c === 'fruits') return 'ਫਲ';
        if (c === 'grains') return 'ਅਨਾਜ';
        if (c === 'pulses') return 'ਦਾਲਾਂ';
        if (c === 'spices') return 'ਮਸਾਲੇ';
        if (c === 'flowers') return 'ਫੁੱਲ';
        return cat;
      case 'gu':
        if (c === 'vegetables') return 'શાકભાજી';
        if (c === 'fruits') return 'ફળો';
        if (c === 'grains') return 'અનાજ';
        if (c === 'pulses') return 'કઠોળ';
        if (c === 'spices') return 'મસાલા';
        if (c === 'flowers') return 'ફૂલો';
        return cat;
      case 'ta':
        if (c === 'vegetables') return 'காய்கறி';
        if (c === 'fruits') return 'பழங்கள்';
        if (c === 'grains') return 'தானியங்கள்';
        if (c === 'pulses') return 'பருப்பு வகைகள்';
        if (c === 'spices') return 'மசாலா';
        if (c === 'flowers') return 'மலர்கள்';
        return cat;
      case 'te':
        if (c === 'vegetables') return 'కూరగాయలు';
        if (c === 'fruits') return 'పండ్లు';
        if (c === 'grains') return 'ధాన్యాలు';
        if (c === 'pulses') return 'పప్పుధాన్యాలు';
        if (c === 'spices') return 'మసాలాలు';
        if (c === 'flowers') return 'పూలు';
        return cat;
      case 'kn':
        if (c === 'vegetables') return 'ತರಕಾರಿ';
        if (c === 'fruits') return 'ಹಣ್ಣುಗಳು';
        if (c === 'grains') return 'ಧಾನ್ಯಗಳು';
        if (c === 'pulses') return 'ಬೇಳೆಕಾಳುಗಳು';
        if (c === 'spices') return 'ಮಸಾಲೆಗಳು';
        if (c === 'flowers') return 'ಹೂವುಗಳು';
        return cat;
      default:
        return cat;
    }
  };

  const getMarketWord = () => {
    switch (currentLocale) {
      case 'hi': return 'मंडी भाव';
      case 'mr': return 'बाजारभाव';
      case 'pa': return 'ਮੰਡੀ ਭਾਅ';
      case 'gu': return 'બજાર ભાવ';
      case 'ta': return 'சந்தை விலை';
      case 'te': return 'మార్కెట్ ధర';
      case 'kn': return 'ಮಾರುಕಟ್ಟೆ ದರ';
      default: return 'Market';
    }
  };

  const getBackText = () => {
    switch (currentLocale) {
      case 'hi': return 'डैशबोर्ड पर वापस जाएं';
      case 'mr': return 'डॅशबोर्डवर परत जा';
      case 'pa': return 'ਡੈਸ਼ਬੋਰਡ \'ਤੇ ਵਾਪਸ ਜਾਓ';
      case 'gu': return 'ડેશબોર્ડ પર પાછા જાઓ';
      case 'ta': return 'டாஷ்போர்டுக்குத் திரும்பு';
      case 'te': return 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి';
      case 'kn': return 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ';
      default: return 'Back to Dashboard';
    }
  };

  const getSearchPlaceholder = () => {
    const catName = getCategoryLabel(category);
    switch (currentLocale) {
      case 'hi': return `${catName} खोजें...`;
      case 'mr': return `${catName} शोधा...`;
      case 'pa': return `${catName} ਖੋਜੋ...`;
      case 'gu': return `${catName} શોધો...`;
      case 'ta': return `${catName} தேடுங்கள்...`;
      case 'te': return `${catName} శోధించండి...`;
      case 'kn': return `${catName} ಹುಡುಕಿ...`;
      default: return `Search ${category}...`;
    }
  };

  const getLiveBadge = () => {
    switch (currentLocale) {
      case 'hi': return 'लाइव';
      case 'mr': return 'थेट';
      case 'pa': return 'ਲਾਈਵ';
      case 'gu': return 'લાઇવ';
      case 'ta': return 'நேரலை';
      case 'te': return 'లైవ్';
      case 'kn': return 'ಲೈವ್';
      default: return 'Live';
    }
  };

  const getModalPriceLabel = () => {
    switch (currentLocale) {
      case 'hi': return 'मॉडल भाव';
      case 'mr': return 'सरासरी दर';
      case 'pa': return 'ਮਾਡਲ ਭਾਅ';
      case 'gu': return 'મોડલ ભાવ';
      case 'ta': return 'சராசரி விலை';
      case 'te': return 'సగటు ధర';
      case 'kn': return 'ಮಾದರಿ ಬೆಲೆ';
      default: return 'Modal Price';
    }
  };

  const getForecastLabel = () => {
    switch (currentLocale) {
      case 'hi': return '७-दिवसीय पूर्वानुमान';
      case 'mr': return '७-दिवसांचा अंदाज';
      case 'pa': return '੭-ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ';
      case 'gu': return '૭-દિવસની આગાહી';
      case 'ta': return '7-நாள் முன்னறிவிப்பு';
      case 'te': return '7-రోజుల అంచనా';
      case 'kn': return '7-ದಿನಗಳ ಮುನ್ಸೂಚನೆ';
      default: return '7-Day Forecast';
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

  const filteredData = data.filter(item => {
    const localized = tCrop(item.commodity);
    const q = searchQuery.toLowerCase();
    return (
      (item.commodity && item.commodity.toLowerCase().includes(q)) || 
      (localized && localized.toLowerCase().includes(q)) ||
      (item.market && item.market.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold cursor-pointer transition-colors">
        <ArrowLeft size={16} /> {getBackText()}
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-slate-900 capitalize">
          {getCategoryLabel(category)} {getMarketWord()}
        </h1>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[16px] pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B38D0]/30 shadow-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#3B38D0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, idx) => (
            <div key={`${item.commodity}-${idx}`} onClick={() => router.push(`/farmer/market/${category}/${encodeURIComponent(item.commodity)}`)} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 hover:border-[#3B38D0]/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#3B38D0] transition-colors">
                    {tCrop(item.commodity)}
                  </h3>
                  <p className="text-xs text-slate-500">{item.market} {getApmcText()}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-200">
                  {getLiveBadge()}
                </span>
              </div>
              
              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {getModalPriceLabel()}
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{toLocalizedDigits(item.modal_price_kg.toFixed(2), currentLocale)}
                    <span className="text-sm font-bold text-slate-400">/{getKgUnit()}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {getForecastLabel()}
                  </p>
                  <p className="text-base font-bold text-[#3B38D0]">
                    ₹{toLocalizedDigits(item.forecast_7d_modal_kg.toFixed(2), currentLocale)}/{getKgUnit()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-100 border-dashed">
              {currentLocale === 'hi' ? 'इस श्रेणी के लिए कोई रीयल-टाइम एगमार्कनेट डेटा नहीं मिला।'
                : currentLocale === 'mr' ? 'या श्रेणीसाठी कोणताही रीअल-टाइम अ‍ॅगमार्कनेट डेटा आढळला नाही.'
                : currentLocale === 'pa' ? 'ਇਸ ਸ਼੍ਰੇਣੀ ਲਈ ਕੋਈ ਰੀਅਲ-ਟਾਈਮ ਐਗਮਾਰਕਨੈੱਟ ਡਾਟਾ ਨਹੀਂ ਮਿਲਿਆ।'
                : currentLocale === 'gu' ? 'આ કેટેગરી માટે કોઈ રીઅલ-ટાઇમ એગમાર્કનેટ ડેટા મળ્યો નથી.'
                : currentLocale === 'ta' ? 'இந்த வகைக்கு நிகழ்நேர அக்மார்க்நெட் தரவு எதுவும் கிடைக்கவில்லை.'
                : currentLocale === 'te' ? 'ఈ వర్గం కోసం రియల్-టైమ్ ఆగ్మార్క్‌నెట్ డేటా కనుగొనబడలేదు.'
                : currentLocale === 'kn' ? 'ಈ ವರ್ಗಕ್ಕೆ ಯಾವುದೇ ನೈಜ-ಸಮಯದ ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ.'
                : 'No real-time Agmarknet data found for this category.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
