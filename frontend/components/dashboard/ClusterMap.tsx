'use client'

import React from 'react';
import { GeoCluster } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

interface ClusterMapProps {
  clusters: GeoCluster[];
  onSelectCluster?: (cluster: GeoCluster) => void;
}

export function ClusterMap({ clusters, onSelectCluster }: ClusterMapProps) {
  const { currentLocale } = useLocaleContext();
  const TRUCK_CAPACITY_KG = 45000; // Standardized 45 MT capacity target

  const tMap = (key: string): string => {
    const dict: Record<string, Record<string, string>> = {
      title: {
        en: 'PostGIS Spatial Freight Pooling & Milk-Run Map',
        hi: 'स्थानिक मालभाड़ा पूलिंग एवं मिल्क-रन रूट मैप',
        mr: 'स्थानिक मालवाहतूक एकत्रीकरण आणि मिल्क-रन मार्ग नकाशा',
        pa: 'ਸਥਾਨਕ ਮਾਲ-ਭਾੜਾ ਪੂਲਿੰਗ ਅਤੇ ਮਿਲਕ-ਰਨ ਰੂਟ ਨਕਸ਼ਾ',
        gu: 'સ્થાનિક માલભાડા પૂલિંગ અને મિલ્ક-રન રૂટ નકશો',
        ta: 'இடஞ்சார்ந்த சரக்கு கூட்டு மற்றும் மில்க்-ரன் வரைபடம்',
        te: 'ప్రాదేశిక రవాణా పూలింగ్ & మిల్క్-రన్ రూట్ మ్యాప్',
        kn: 'ಪ್ರಾದೇಶಿಕ ಸರಕು ಸಾಗಣೆ ಪೂಲಿಂಗ್ ಮತ್ತು ಮಿಲ್ಕ್-ರನ್ ಮಾರ್ಗ ನಕ್ಷೆ',
      },
      subtitle: {
        en: '10-km radius smallholder aggregation & shared transport routing',
        hi: '१० किमी दायरे में छोटे किसानों का एकत्रीकरण एवं साझा परिवहन',
        mr: '१० किमी अंतरातील शेतकरी एकत्रीकरण आणि सामायिक वाहतूक',
        pa: '੧੦ ਕਿਮੀ ਦੇ ਘੇਰੇ ਵਿੱਚ ਛੋਟੇ ਕਿਸਾਨਾਂ ਦਾ ਇਕੱਠ ਅਤੇ ਸਾਂਝੀ ਆਵਾਜਾਈ',
        gu: '૧૦ કિમી ત્રિજ્યામાં નાના ખેડૂતોનું એકત્રીકરણ અને પરિવહન રૂટિંગ',
        ta: '10 கி.மீ சுற்றளவில் சிறு விவசாயிகள் ஒருங்கிணைப்பு மற்றும் கூட்டுப் போக்குவரத்து',
        te: '10 కి.మీ పరిధిలో చిన్న రైతుల సమీకరణ మరియు ఉమ్మడి రవాణా',
        kn: '10 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸಣ್ಣ ರೈತರ ಸಾಗಣೆ ಒಕ್ಕೂಟ',
      },
      fpo_active: {
        en: 'FPO Aggregator Active',
        hi: 'एफपीओ एग्रीगेटर सक्रिय',
        mr: 'एफपीओ एकत्रित सक्रिय',
        pa: 'FPO ਐਗਰੀਗੇਟਰ ਕਿਰਿਆਸ਼ੀਲ',
        gu: 'FPO એગ્રીગેટર સક્રિય',
        ta: 'FPO ஒருங்கிணைப்பாளர் செயலில் உள்ளது',
        te: 'FPO అగ్రిగేటర్ క్రియాశీలకం',
        kn: 'FPO ಸಕ್ರಿಯವಾಗಿದೆ',
      },
      active_zones: {
        en: '📍 Active Zones: Nashik East & Pune-Shirur Belt',
        hi: '📍 सक्रिय क्षेत्र: नासिक ईस्ट एवं पुणे-शिरूर बेल्ट',
        mr: '📍 सक्रिय क्षेत्र: नाशिक ईस्ट आणि पुणे-शिरूर पट्टा',
        pa: '📍 ਸਰਗਰਮ ਖੇਤਰ: ਨਾਸਿਕ ਈਸਟ ਅਤੇ ਪੁਣੇ-ਸ਼ਿਰੂਰ ਬੈਲਟ',
        gu: '📍 સક્રિય ક્ષેત્ર: નાસિક ઈસ્ટ અને પુણે-શિરૂર પટ્ટો',
        ta: '📍 செயலில் உள்ள பகுதிகள்: நாசிக் கிழக்கு & புனே-சிரூர் பகுதி',
        te: '📍 క్రియాశీల ప్రాంతాలు: నాసిక్ ఈస్ట్ & పూణే-షిరూర్ బెల్ట్',
        kn: '📍 ಸಕ್ರಿಯ ವಲಯಗಳು: ನಾಸಿಕ್ ಪೂರ್ವ ಮತ್ತು ಪುಣೆ-ಶಿರೂರ್ ಪ್ರದೇಶ',
      },
      freight: {
        en: 'Freight',
        hi: 'मालभाड़ा',
        mr: 'वाहतूक',
        pa: 'ਭਾੜਾ',
        gu: 'માલભાડું',
        ta: 'சரக்கு',
        te: 'రవాణా',
        kn: 'ಸಾರಿಗೆ',
      },
      pooled_colon: {
        en: 'Pooled:',
        hi: 'पूल्ड:',
        mr: 'एकत्रित:',
        pa: 'ਪੂਲ:',
        gu: 'સામૂહિક:',
        ta: 'கூட்டு:',
        te: 'ఉమ్మడి:',
        kn: 'ಸಾಮೂಹಿಕ:',
      },
      mt: {
        en: 'MT',
        hi: 'मीट्रिक टन',
        mr: 'मेट्रिक टन',
        pa: 'ਮੀਟ੍ਰਿਕ ਟਨ',
        gu: 'મેટ્રિક ટન',
        ta: 'மெட்ரிக் டன்',
        te: 'మెట్రిక్ టన్నులు',
        kn: 'ಮೆಟ್ರಿಕ್ ಟನ್',
      },
      truck_target: {
        en: 'Truck Capacity Target (45 Tons)',
        hi: 'ट्रक क्षमता लक्ष्य (४५ टन)',
        mr: 'ट्रक क्षमता लक्ष्य (४५ टन)',
        pa: 'ਟਰੱਕ ਸਮਰੱਥਾ ਟੀਚਾ (੪੫ ਟਨ)',
        gu: 'ટ્રક ક્ષમતા લક્ષ્યાંક (૪૫ ટન)',
        ta: 'லாரி கொள்ளளவு இலக்கு (45 டன்)',
        te: 'ట్రక్ సామర్థ్యం లక్ష్యం (45 టన్నులు)',
        kn: 'ಲಾರಿ ಸಾಮರ್ಥ್ಯ ಗುರಿ (45 ಟನ್)',
      },
      overflow: {
        en: '(Overflow)',
        hi: '(अतिरिक्त)',
        mr: '(अतिरिक्त)',
        pa: '(ਵਾਧੂ)',
        gu: '(વધારે)',
        ta: '(அதிக சுமை)',
        te: '(అదనపు)',
        kn: '(ಅಧಿಕ)',
      },
      pooled_tag: {
        en: 'Pooled',
        hi: 'पूल्ड',
        mr: 'एकत्रित',
        pa: 'ਪੂਲਡ',
        gu: 'સામૂહિક',
        ta: 'கூட்டு',
        te: 'ఉమ్మడి',
        kn: 'ಸಾಮೂಹಿಕ',
      },
      matrix_active: {
        en: 'OpenRouteService Milk-Run Matrix: Active',
        hi: 'ओपनरूटसर्विस मिल्क-रन मैट्रिक्स: सक्रिय',
        mr: 'ओपनरूटसर्व्हिस मिल्क-रन मॅट्रिक्स: सक्रिय',
        pa: 'ਓਪਨਰੂਟਸਰਵਿਸ ਮਿਲਕ-ਰਨ ਮੈਟ੍ਰਿਕਸ: ਕਿਰਿਆਸ਼ੀਲ',
        gu: 'ઓપનરૂટસર્વિસ મિલ્ક-રન મેટ્રિક્સ: સક્રિય',
        ta: 'OpenRouteService மில்க்-ரன் மேட்ரிக்ஸ்: செயலில் உள்ளது',
        te: 'OpenRouteService మిల్క్-రన్ మ్యాట్రిక్స్: క్రియాశీలం',
        kn: 'OpenRouteService ಮಿಲ್ಕ್-ರನ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್: ಸಕ್ರಿಯ',
      },
      generate_btn: {
        en: 'Generate Bulk Route Manifest 🚚',
        hi: 'थोक रूट घोषणापत्र तैयार करें 🚚',
        mr: 'थोक मार्ग मॅनिफेस्ट तयार करा 🚚',
        pa: 'ਥੋਕ ਰੂਟ ਮੈਨੀਫੈਸਟ ਤਿਆਰ ਕਰੋ 🚚',
        gu: 'બલ્ક રૂટ મેનિફેસ્ટ બનાવો 🚚',
        ta: 'மொத்த வழித்தடப் பட்டியலை உருவாக்கு 🚚',
        te: 'బల్క్ రూట్ మానిఫెస్ట్ రూపొందించండి 🚚',
        kn: 'ಬಲ್ಕ್ ಮಾರ್ಗ ಪಟ್ಟಿಯನ್ನು ರಚಿಸಿ 🚚',
      },
    };
    return dict[key]?.[currentLocale] || dict[key]?.[`en`] || key;
  };

  const formatClusterName = (name: string) => {
    if (name === 'Nashik East Pool') {
      switch (currentLocale) {
        case 'hi': return 'नासिक ईस्ट पूल';
        case 'mr': return 'नाशिक ईस्ट पूल';
        case 'pa': return 'ਨਾਸਿਕ ਈਸਟ ਪੂਲ';
        case 'gu': return 'નાસિક ઈસ્ટ પૂલ';
        case 'ta': return 'நாசிக் ஈஸ்ட் பூல்';
        case 'te': return 'నాసిక్ ఈస్ట్ పూల్';
        case 'kn': return 'ನಾಸಿಕ್ ಈಸ್ಟ್ ಪೂಲ್';
        default: return name;
      }
    }
    return name;
  };

  const formatAvgFreightSaved = () => {
    const pct = toLocalizedDigits(31.5, currentLocale);
    switch (currentLocale) {
      case 'hi': return `औसत मालभाड़ा बचत: ~${pct}%`;
      case 'mr': return `सरासरी वाहतूक बचत: ~${pct}%`;
      case 'pa': return `ਔਸਤ ਮਾਲ-ਭਾੜਾ ਬਚਤ: ~${pct}%`;
      case 'gu': return `સરેરાશ માલભાડા બચત: ~${pct}%`;
      case 'ta': return `சராசரி சரக்கு சேமிப்பு: ~${pct}%`;
      case 'te': return `సగటు రవాణా ఆదా: ~${pct}%`;
      case 'kn': return `ಸರಾಸರಿ ಸಾರಿಗೆ ಉಳಿತಾಯ: ~${pct}%`;
      default: return `Avg. Freight Saved: ~31.5%`;
    }
  };

  const formatClusterFarmerLabel = (clusterId: string, count: number) => {
    if (clusterId === 'CLST-01') {
      switch (currentLocale) {
        case 'hi': return '१४ अन्य किसान + आप (१५ नामांकित)';
        case 'mr': return '१४ इतर शेतकरी + तुम्ही (१५ समाविष्ट)';
        case 'pa': return '੧੪ ਹੋਰ ਕਿਸਾਨ + ਤੁਸੀਂ (੧੫ ਸ਼ਾਮਲ)';
        case 'gu': return '૧૪ અન્ય ખેડૂતો + તમે (૧૫ નોંધાયેલા)';
        case 'ta': return '14 மற்ற விவசாயிகள் + நீங்கள் (15 பதிவு)';
        case 'te': return '14 ఇతర రైతులు + మీరు (15 నమోదు)';
        case 'kn': return '14 ಇತರ ರೈತರು + ನೀವು (15 ನೋಂದಣಿ)';
        default: return '14 other farmers + you (15 Enrolled)';
      }
    }
    const c = toLocalizedDigits(count, currentLocale);
    switch (currentLocale) {
      case 'hi': return `${c} किसान नामांकित`;
      case 'mr': return `${c} शेतकरी समाविष्ट`;
      case 'pa': return `${c} ਕਿਸਾਨ ਸ਼ਾਮਲ`;
      case 'gu': return `${c} ખેડૂતો નોંધાયેલા`;
      case 'ta': return `${c} விவசாயிகள் பதிவு`;
      case 'te': return `${c} రైతులు నమోదు`;
      case 'kn': return `${c} ರೈತರು ನೋಂದಣಿ`;
      default: return `${count} Farmers Enrolled`;
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {tMap('title')}
            </h3>
            <p className="text-xs text-slate-500">
              {tMap('subtitle')}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold font-mono">
          {tMap('fpo_active')}
        </span>
      </div>

      {/* Modern Map Canvas */}
      <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-5 border border-emerald-800 flex flex-col justify-between shadow-inner">
        {/* Radial Map Grid Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-900">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            {tMap('active_zones')}
          </span>
          <span className="font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-600 font-mono">
            {formatAvgFreightSaved()}
          </span>
        </div>

        {/* Interactive Cluster Nodes */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
          {clusters.map((cluster) => {
            const progressPercent = Math.round((cluster.totalWeightKg / TRUCK_CAPACITY_KG) * 100);
            const isOverflow = progressPercent > 100;
            const farmerCountLabel = formatClusterFarmerLabel(cluster.id, cluster.participatingFarmersCount);

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster && onSelectCluster(cluster)}
                className="cursor-pointer rounded-xl bg-white/95 text-slate-900 p-4 shadow-lg border border-emerald-200 hover:border-emerald-500 transition-all hover:scale-[1.01] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                    {formatClusterName(cluster.clusterName)}
                  </h4>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono">
                    -{toLocalizedDigits(cluster.estimatedFreightSavingsPercent, currentLocale)}% {tMap('freight')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                  <p className="truncate">👨‍🌾 <strong className="text-slate-900">{farmerCountLabel}</strong></p>
                  <p>📦 {tMap('pooled_colon')} <strong className="text-emerald-700 font-mono">{toLocalizedDigits((cluster.totalWeightKg / 1000).toFixed(1), currentLocale)} {tMap('mt')}</strong></p>
                </div>

                {/* Progress towards full truckload (45 Tons) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>{tMap('truck_target')}</span>
                    <span className={`font-mono ${isOverflow ? 'text-amber-600 font-black' : 'text-emerald-700'}`}>
                      {toLocalizedDigits(progressPercent, currentLocale)}% {isOverflow 
                        ? tMap('overflow')
                        : tMap('pooled_tag')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverflow 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-300 pt-2 border-t border-emerald-900">
          <span>{tMap('matrix_active')}</span>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold h-8 px-4 shadow-md cursor-pointer">
            {tMap('generate_btn')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClusterMap;
