'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Truck, 
  MapPin, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Leaf, 
  Snowflake, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Lock, 
  RotateCcw,
  Boxes,
  Percent,
  Compass,
  BadgeAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropLot } from '@/lib/types';
import { toast } from 'sonner';
import { useCropTranslation, useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

export interface FPOCollectiveViewProps {
  activeLots: CropLot[];
  isPooled?: boolean;
  onTogglePoolMode?: (nextState: boolean) => void;
  onLotSelect?: (lot: CropLot) => void;
  onUpdatePoolSelection: (updatedLots: CropLot[], pooledLotIds: string[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function FPOCollectiveView({
  activeLots = [],
  isPooled = true,
  onTogglePoolMode,
  onLotSelect,
  onUpdatePoolSelection,
  onNavigateToTab
}: FPOCollectiveViewProps) {
  const { currentLocale } = useLocaleContext();
  const tCrop = useCropTranslation();
  
  // Constant FPO Collective Details
  const FPO_NAME = "Nashik East Farmers Producer Company";
  const FPO_CODE = "FPC #MH-NSK-4412";
  const HUB_NAME = "Niphad Central Aggregation Yard";
  const HUB_DISTANCE = "4.2 km from your farm";
  const BASELINE_COLLECTIVE_WEIGHT_MT = 32.5; // From other 14 participating farmers
  const TRUCK_CAPACITY_MT = 45.0;
  const SOLO_FREIGHT_PER_KG = 1.85;
  const POOLED_FREIGHT_PER_KG = 1.20;
  const FREIGHT_DISCOUNT_PCT = 35.1;

  const fpoNameDisplay = useMemo(() => {
    switch (currentLocale) {
      case 'hi': return 'नासिक ईस्ट फार्मर्स प्रोड्यूसर कंपनी';
      case 'mr': return 'नाशिक ईस्ट फार्मर्स प्रोड्युसर कंपनी';
      case 'pa': return 'ਨਾਸਿਕ ਈਸਟ ਫਾਰਮਰਜ਼ ਪ੍ਰੋਡਿਊਸਰ ਕੰਪਨੀ';
      case 'gu': return 'નાસિક ઈસ્ટ ફાર્મર્સ પ્રોડ્યુસર કંપની';
      case 'ta': return 'நாசிக் ஈஸ்ட் விவசாயிகள் உற்பத்தியாளர் நிறுவனம்';
      case 'te': return 'నాసిక్ ఈస్ట్ రైతుల ఉత్పత్తిదారుల సంస్థ';
      case 'kn': return 'ನಾಸಿಕ್ ಈಸ್ಟ್ ರೈತರ ಉತ್ಪಾದಕರ ಕಂಪನಿ';
      default: return FPO_NAME;
    }
  }, [currentLocale]);

  const tFpo = (key: string): string => {
    const dict: Record<string, Record<string, string>> = {
      certified_milk_run: {
        en: 'SFAC & APMC Certified Milk-Run',
        hi: 'एसएफएसी एवं एपीएमसी प्रमाणित मिल्क-रन',
        mr: 'एसएफएसी आणि एपीएमसी प्रमाणित मिल्क-रन',
        pa: 'ਐਸਐਫਏਸੀ ਅਤੇ ਏਪੀਐਮਸੀ ਪ੍ਰਮਾਣਿਤ ਮਿਲਕ-ਰਨ',
        gu: 'એસએફએસી અને એપીએમસી પ્રમાણિત મિલ્ક-રન',
        ta: 'SFAC மற்றும் APMC சான்றளிக்கப்பட்ட மில்க்-ரன்',
        te: 'SFAC & APMC ధృవీకరించిన రవాణా',
        kn: 'SFAC ಮತ್ತು APMC ಪ್ರಮಾಣೀಕೃತ ಮಿಲ್ಕ್-ರನ್',
      },
      leave_collective: {
        en: 'Leave Collective',
        hi: 'कलेक्टिव छोड़ें',
        mr: 'समुदाय सोडा',
        pa: 'ਸਮੂਹ ਛੱਡੋ',
        gu: 'સામૂહિકમાંથી બહાર નીકળો',
        ta: 'கூட்டமைப்பிலிருந்து வெளியேறு',
        te: 'ఉమ్మడి సమూహం నుండి నిష్క్రమించండి',
        kn: 'ಸಾಮೂಹಿಕದಿಂದ ನಿರ್ಗಮಿಸಿ',
      },
      active_dispatch: {
        en: 'ACTIVE DISPATCH',
        hi: 'सक्रिय प्रेषण',
        mr: 'सक्रिय वाहतूक',
        pa: 'ਸਰਗਰਮ ਡਿਸਪੈਚ',
        gu: 'સક્રિય ડિસ્પેચ',
        ta: 'செயலில் உள்ள அனுப்புதல்',
        te: 'క్రియాశీల రవాణా',
        kn: 'ಸಕ್ರಿಯ ರವಾನೆ',
      },
      enrollment: {
        en: 'ENROLLMENT',
        hi: 'नामांकन',
        mr: 'नोंदणी',
        pa: 'ਦਾਖਲਾ',
        gu: 'નોંધણી',
        ta: 'பதிவு',
        te: 'నమోదు',
        kn: 'ನೋಂದಣಿ',
      },
      select_lots_to_join: {
        en: 'Select lots to join',
        hi: 'जुड़ने के लिए लॉट चुनें',
        mr: 'सामील होण्यासाठी लॉट निवडा',
        pa: 'ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਲਾਟ ਚੁਣੋ',
        gu: 'જોડાવા માટે લૉટ પસંદ કરો',
        ta: 'சேர லாட்டுகளைத் தேர்ந்தெடுக்கவும்',
        te: 'చేరడానికి లాట్లను ఎంచుకోండి',
        kn: 'ಸೇರಲು ಲಾಟ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      },
      capacity: {
        en: 'CAPACITY',
        hi: 'क्षमता',
        mr: 'क्षमता',
        pa: 'ਸਮਰੱਥਾ',
        gu: 'ક્ષમતા',
        ta: 'கொள்ளளவு',
        te: 'సామర్థ్యం',
        kn: 'ಸಾಮರ್ಥ್ಯ',
      },
      full: {
        en: 'Full',
        hi: 'भरी हुई',
        mr: 'पूर्ण',
        pa: 'ਭਰਿਆ',
        gu: 'ભરેલું',
        ta: 'நிரம்பியது',
        te: 'నిండింది',
        kn: 'ತುಂಬಿದೆ',
      },
      overflow: {
        en: 'OVERFLOW',
        hi: 'अतिरिक्त भार',
        mr: 'अतिरिक्त भार',
        pa: 'ਵਾਧੂ ਭਾਰ',
        gu: 'વધારે પડતો ભાર',
        ta: 'அதிக சுமை',
        te: 'అదనపు భారం',
        kn: 'ಅಧಿಕ ಹೊರೆ',
      },
      select_harvest_lots: {
        en: 'Select Harvest Lots',
        hi: 'फसल लॉट चुनें',
        mr: 'पीक लॉट्स निवडा',
        pa: 'ਫ਼ਸਲ ਲਾਟ ਚੁਣੋ',
        gu: 'પાક લૉટ્સ પસંદ કરો',
        ta: 'அறுவடை லாட்டுகளைத் தேர்ந்தெடுக்கவும்',
        te: 'పంట లాట్లను ఎంచుకోండి',
        kn: 'ಬೆಳೆ ಲಾಟ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      },
      selected: {
        en: 'Selected',
        hi: 'चयनित',
        mr: 'निवडलेले',
        pa: 'ਚੁਣੇ ਗਏ',
        gu: 'પસંદ કરેલ',
        ta: 'தேர்ந்தெடுக்கப்பட்டது',
        te: 'ఎంపిక చేయబడింది',
        kn: 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
      },
      all_lots: {
        en: 'All Lots',
        hi: 'सभी लॉट',
        mr: 'सर्व लॉट्स',
        pa: 'ਸਾਰੇ ਲਾਟ',
        gu: 'બધા લૉટ્સ',
        ta: 'அனைத்து லாட்டுகள்',
        te: 'అన్ని లాట్లు',
        kn: 'ಎಲ್ಲಾ ಲಾಟ್‌ಗಳು',
      },
      dry_grains: {
        en: 'Dry Grains',
        hi: 'सूखे अनाज',
        mr: 'सुके धान्य',
        pa: 'ਸੁੱਕਾ ਅਨਾਜ',
        gu: 'સૂકા અનાજ',
        ta: 'உலர்ந்த தானியங்கள்',
        te: 'పొడి ధాన్యాలు',
        kn: 'ಒಣ ಧಾನ್ಯಗಳು',
      },
      perishables: {
        en: 'Perishables',
        hi: 'नाशवंत फसलें',
        mr: 'नाशवंत पिके',
        pa: 'ਨਾਸ਼ਵਾਨ',
        gu: 'નાશવંત પાકો',
        ta: 'அழுகக்கூடியவை',
        te: 'త్వరగా పాడయ్యే పంటలు',
        kn: 'ಬೇಗನೆ ಹಾಳಾಗುವ ಬೆಳೆಗಳು',
      },
      select_all_grains: {
        en: '🌿 Select All Grains',
        hi: '🌿 सभी अनाज चुनें',
        mr: '🌿 सर्व धान्य निवडा',
        pa: '🌿 ਸਾਰੇ ਅਨਾਜ ਚੁਣੋ',
        gu: '🌿 બધા અનાજ પસંદ કરો',
        ta: '🌿 அனைத்து தானியங்களையும் தேர்ந்தெடு',
        te: '🌿 అన్ని ధాన్యాలను ఎంచుకోండి',
        kn: '🌿 ಎಲ್ಲಾ ಧಾನ್ಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      },
      select_all: {
        en: 'Select All',
        hi: 'सभी चुनें',
        mr: 'सर्व निवडा',
        pa: 'ਸਾਰੇ ਚੁਣੋ',
        gu: 'બધા પસંદ કરો',
        ta: 'அனைத்தையும் தேர்ந்தெடு',
        te: 'అన్నీ ఎంచుకోండి',
        kn: 'ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ',
      },
      clear: {
        en: 'Clear',
        hi: 'हटाएं',
        mr: 'साफ करा',
        pa: 'ਸਾਫ਼ ਕਰੋ',
        gu: 'સાફ કરો',
        ta: 'அழி',
        te: 'క్లియర్ చేయండి',
        kn: 'ತೆರವುಗೊಳಿಸಿ',
      },
      volume_grade: {
        en: 'Volume & Grade',
        hi: 'मात्रा एवं ग्रेड',
        mr: 'प्रमाण आणि दर्जा',
        pa: 'ਮਾਤਰਾ ਅਤੇ ਗ੍ਰੇਡ',
        gu: 'જથ્થો અને ગ્રેડ',
        ta: 'அளவு மற்றும் தரம்',
        te: 'పరిమాణం & గ్రేడ్',
        kn: 'ಪ್ರಮಾಣ ಮತ್ತು ಗ್ರೇಡ್',
      },
      mt_unit: {
        en: 'MT',
        hi: 'मी.टन',
        mr: 'मे.टन',
        pa: 'ਮੀ.ਟਨ',
        gu: 'મે.ટન',
        ta: 'மெ.டன்',
        te: 'మె.టన్ను',
        kn: 'ಮೆ.ಟನ್',
      },
      logistics_profile: {
        en: 'Logistics Profile',
        hi: 'लॉजिस्टिक्स प्रोफाइल',
        mr: 'वाहतूक प्रोफाइल',
        pa: 'ਲੌਜਿਸਟਿਕਸ ਪ੍ਰੋਫਾਈਲ',
        gu: 'લોજિસ્ટિક્સ પ્રોફાઇલ',
        ta: 'சரக்கு விவரம்',
        te: 'రవాణా ప్రొఫైల్',
        kn: 'ಸಾರಿಗೆ ವಿವರ',
      },
      ideal_dry_pool: {
        en: '🌿 Ideal for Bulk Dry Pool',
        hi: '🌿 थोक सूखा पूल के लिए उत्तम',
        mr: '🌿 सुक्या धान्यासाठी उत्तम',
        pa: '🌿 ਸੁੱਕੇ ਅਨਾਜ ਲਈ ਉੱਤਮ',
        gu: '🌿 જથ્થાબંધ સૂકા પૂલ માટે ઉત્તમ',
        ta: '🌿 மொத்த உலர் பூலுக்கு சிறந்தது',
        te: '🌿 బల్క్ డ్రై పూల్‌కు అనువైనది',
        kn: '🌿 ಒಣ ಧಾನ್ಯ ಪೂಲ್‌ಗೆ ಸೂಕ್ತ',
      },
      perishable_sensitive: {
        en: '❄️ Perishable Sensitive',
        hi: '❄️ संवेदनशील नाशवंत',
        mr: '❄️ संवेदनशील नाशवंत',
        pa: '❄️ ਨਾਜ਼ੁਕ ਨਾਸ਼ਵਾਨ',
        gu: '❄️ સંવેદનશીલ નાશવંત',
        ta: '❄️ அழுகும் உணர்திறன்',
        te: '❄️ త్వరగా పాడయ్యే సున్నితమైనవి',
        kn: '❄️ ಬೇಗನೆ ಹಾಳಾಗುವ ಬೆಳೆ',
      },
      freight_rate: {
        en: 'Freight Rate',
        hi: 'मालभाड़ा दर',
        mr: 'वाहतूक दर',
        pa: 'ਮਾਲ-ਭਾੜਾ ਦਰ',
        gu: 'માલભાડા દર',
        ta: 'சரக்கு கட்டணம்',
        te: 'రవాణా ఛార్జీ',
        kn: 'ಸಾರಿಗೆ ದರ',
      },
      kg_unit: {
        en: 'kg',
        hi: 'किग्रा',
        mr: 'किलो',
        pa: 'ਕਿਲੋ',
        gu: 'કિલો',
        ta: 'கிலோ',
        te: 'కిలో',
        kn: 'ಕೆಜಿ',
      },
      fpo_pooled: {
        en: '👥 FPO Pooled',
        hi: '👥 एफपीओ पूल्ड',
        mr: '👥 एकत्रित वाहतूक',
        pa: '👥 ਐਫਪੀਓ ਪੂਲਡ',
        gu: '👥 FPO સામૂહિક',
        ta: '👥 FPO கூட்டுப் போக்குவரத்து',
        te: '👥 FPO ఉమ్మడి రవాణా',
        kn: '👥 FPO ಸಾಮೂಹಿಕ ಸಾರಿಗೆ',
      },
      solo_haul: {
        en: '🚛 Solo Haul',
        hi: '🚛 एकल ढुलाई',
        mr: '🚛 स्वतंत्र वाहतूक',
        pa: '🚛 ਇਕੱਲਾ ਢੁਆਈ',
        gu: '🚛 એકલ પરિવહન',
        ta: '🚛 தனி போக்குவரத்து',
        te: '🚛 వ్యక్తిగత రవాణా',
        kn: '🚛 ಏಕಾಂಗಿ ಸಾರಿಗೆ',
      },
      total_pooling_volume: {
        en: 'Total Pooling Volume',
        hi: 'कुल पूलिंग मात्रा',
        mr: 'एकूण एकत्रित वजन',
        pa: 'ਕੁੱਲ ਪੂਲਿੰਗ ਮਾਤਰਾ',
        gu: 'કુલ પૂલિંગ જથ્થો',
        ta: 'மொத்த கூட்டு அளவு',
        te: 'మొత్తం ఉమ్మడి పరిమాణం',
        kn: 'ಒಟ್ಟು ಸಾಮೂಹಿಕ ಪ್ರಮಾಣ',
      },
      metric_tons: {
        en: 'Metric Tons',
        hi: 'मीट्रिक टन',
        mr: 'मेट्रिक टन',
        pa: 'ਮੀਟ੍ਰਿਕ ਟਨ',
        gu: 'મેટ્રિક ટન',
        ta: 'மெட்ரிக் டன்',
        te: 'మెట్రిక్ టన్నులు',
        kn: 'ಮೆಟ್ರಿಕ್ ಟನ್',
      },
      estimated_freight_savings: {
        en: 'Estimated Freight Savings',
        hi: 'अनुमानित मालभाड़ा बचत',
        mr: 'अंदाजे वाहतूक बचत',
        pa: 'ਅੰਦਾਜ਼ਨ ਮਾਲ-ਭਾੜਾ ਬਚਤ',
        gu: 'અંદાજિત માલભાડા બચત',
        ta: 'மதிப்பிடப்பட்ட சரக்கு சேமிப்பு',
        te: 'అంచనా వేసిన రవాణా ఆదా',
        kn: 'ಅಂದಾಜು ಸಾರಿಗೆ ಉಳಿತಾಯ',
      },
      dispatch_window_settlement: {
        en: 'Dispatch Window & Settlement',
        hi: 'प्रेषण समय एवं भुगतान',
        mr: 'वाहतूक वेळ आणि सेटलमेंट',
        pa: 'ਡਿਸਪੈਚ ਸਮਾਂ ਅਤੇ ਭੁਗਤਾਨ',
        gu: 'ડિસ્પેચ સમય અને ચુકવણી',
        ta: 'அனுப்பும் நேரம் மற்றும் தீர்வு',
        te: 'రవాణా సమయం & చెల్లింపు',
        kn: 'ರವಾನೆ ಸಮಯ ಮತ್ತು ಇತ್ಯರ್ಥ',
      },
      zero_upfront_cost: {
        en: '🛡️ Zero upfront cost • Deducted at Mandi Escrow weighbridge settlement',
        hi: '🛡️ कोई अग्रिम शुल्क नहीं • मंडी एस्क्रो धर्मकांटा तौल पर कटौती',
        mr: '🛡️ कोणताही आगाऊ खर्च नाही • मंडी एस्क्रो वजनकाट्यावर कपात',
        pa: '🛡️ ਕੋਈ ਅਗਾਊਂ ਖਰਚਾ ਨਹੀਂ • ਮੰਡੀ ਐਸਕਰੋ ਤੋਲ ਸਮੇਂ ਕਟੌਤੀ',
        gu: '🛡️ કોઈ એડવાન્સ ખર્ચ નથી • મંડી એસ્ક્રો કાંટા વજન પર કપાત',
        ta: '🛡️ முன்பணம் இல்லை • மண்டி எஸ்க்ரோ எடை மேடையில் பிடித்தம்',
        te: '🛡️ ఎలాంటి ముందస్తు ఖర్చు లేదు • మండి ఎస్క్రో తూకం వద్ద మినహాయింపు',
        kn: '🛡️ ಯಾವುದೇ ಮುಂಗಡ ವೆಚ್ಚವಿಲ್ಲ • ಮಂಡಿ ಎಸ್ಕ್ರೋ ತೂಕದ ಸಮಯದಲ್ಲಿ ಕಡಿತ',
      },
      update_pool_selection: {
        en: 'Update Collective Pool Selection',
        hi: 'कलेक्टिव पूल चयन अपडेट करें',
        mr: 'एकत्रित पूल निवड अद्ययावत करा',
        pa: 'ਸਮੂਹ ਪੂਲ ਚੋਣ ਅੱਪਡੇਟ ਕਰੋ',
        gu: 'સામૂહિક પૂલ પસંદગી અપડેટ કરો',
        ta: 'கூட்டுப் பூல் தேர்வை புதுப்பிக்கவும்',
        te: 'ఉమ్మడి పూల్ ఎంపికను నవీకరించండి',
        kn: 'ಸಾಮೂಹಿಕ ಪೂಲ್ ಆಯ್ಕೆಯನ್ನು ನವೀಕರಿಸಿ',
      },
      syncing_collective: {
        en: 'Syncing Collective...',
        hi: 'कलेक्टिव सिंक हो रहा है...',
        mr: 'सिंक होत आहे...',
        pa: 'ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...',
        gu: 'સામૂહિક સિંક થઈ રહ્યું છે...',
        ta: 'ஒத்திசைக்கப்படுகிறது...',
        te: 'సింక్ అవుతోంది...',
        kn: 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...',
      },
      no_lots_category: {
        en: 'No produce lots in this category',
        hi: 'इस श्रेणी में कोई फसल लॉट नहीं है',
        mr: 'या श्रेणीत कोणतेही पीक लॉट उपलब्ध नाही',
        pa: 'ਇਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਕੋਈ ਫ਼ਸਲ ਲਾਟ ਨਹੀਂ ਹੈ',
        gu: 'આ શ્રેણીમાં કોઈ પાક લૉટ નથી',
        ta: 'இந்தப் பிரிவில் எந்த பயிர் லாட்டும் இல்லை',
        te: 'ఈ వర్గంలో ఎలాంటి పంట లాట్ లేదు',
        kn: 'ಈ ವರ್ಗದಲ್ಲಿ ಯಾವುದೇ ಬೆಳೆ ಲಾಟ್ ಇಲ್ಲ',
      },
      no_lots_desc: {
        en: 'List new harvested produce from the Farmer Command Center to participate in FPO pooling.',
        hi: 'एफपीओ पूलिंग में शामिल होने के लिए किसान डैशबोर्ड से नई फसल पंजीकृत करें।',
        mr: 'एफपीओ एकत्रीकरणात सहभागी होण्यासाठी शेतकरी डॅशबोर्डवरून नवीन पीक नोंदवा.',
        pa: 'ਐਫਪੀਓ ਪੂਲਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲੈਣ ਲਈ ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਨਵੀਂ ਫ਼ਸਲ ਦਰਜ ਕਰੋ।',
        gu: 'FPO પૂલિંગમાં ભાગ લેવા માટે ખેડૂત ડેશબોર્ડ પરથી નવો પાક લૉટ ઉમેરો.',
        ta: 'FPO பூலிங்கில் பங்கேற்க உழவர் கட்டுப்பாட்டு மையத்திலிருந்து புதிய அறுவடையைப் பட்டியலிடுங்கள்.',
        te: 'FPO పూలింగ్‌లో పాల్గొనడానికి రైతు కమాండ్ సెంటర్ నుండి కొత్త పంటను జాబితా చేయండి.',
        kn: 'FPO ಪೂಲಿಂಗ್‌ನಲ್ಲಿ ಭಾಗವಹಿಸಲು ರೈತ ಕಮಾಂಡ್ ಕೇಂದ್ರದಿಂದ ಹೊಸ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿ.',
      },
      list_new_produce: {
        en: '+ List New Produce Lot',
        hi: '+ नया फसल लॉट जोड़ें',
        mr: '+ नवीन पीक लॉट जोडा',
        pa: '+ ਨਵਾਂ ਫ਼ਸਲ ਲਾਟ ਸ਼ਾਮਲ ਕਰੋ',
        gu: '+ નવો પાક લૉટ ઉમેરો',
        ta: '+ புதிய பயிர் லாட்டைச் சேர்க்கவும்',
        te: '+ కొత్త పంట లాట్‌ను జోడించండి',
        kn: '+ ಹೊಸ ಬೆಳೆ ಲಾಟ್ ಸೇರಿಸಿ',
      },
    };
    return dict[key]?.[currentLocale] || dict[key]?.[`en`] || key;
  };

  const formatSoloVsPooled = (soloVal: number, pooledVal: number) => {
    const s = toLocalizedDigits(Math.round(soloVal).toLocaleString('en-IN'), currentLocale);
    const p = toLocalizedDigits(Math.round(pooledVal).toLocaleString('en-IN'), currentLocale);
    switch (currentLocale) {
      case 'hi': return `एकल: ₹${s} ➔ पूल्ड: ₹${p}`;
      case 'mr': return `स्वतंत्र: ₹${s} ➔ एकत्रित: ₹${p}`;
      case 'pa': return `ਇਕੱਲੇ: ₹${s} ➔ ਪੂਲ: ₹${p}`;
      case 'gu': return `એકલ: ₹${s} ➔ સામૂહિક: ₹${p}`;
      case 'ta': return `தனி: ₹${s} ➔ கூட்டு: ₹${p}`;
      case 'te': return `వ్యక్తిగత: ₹${s} ➔ ఉమ్మడి: ₹${p}`;
      case 'kn': return `ಏಕಾಂಗಿ: ₹${s} ➔ ಸಾಮೂಹಿಕ: ₹${p}`;
      default: return `Solo: ₹${s} ➔ Pooled: ₹${p}`;
    }
  };

  const formatDepartsTime = (hrs: number, mins: number) => {
    const h = toLocalizedDigits(hrs, currentLocale);
    const m = toLocalizedDigits(mins, currentLocale);
    switch (currentLocale) {
      case 'hi': return `प्रस्थान: ${h} घंटे ${m} मिनट में`;
      case 'mr': return `निघणार: ${h} तास ${m} मिनिटांत`;
      case 'pa': return `ਰਵਾਨਾ: ${h} ਘੰਟੇ ${m} ਮਿੰਟ ਵਿੱਚ`;
      case 'gu': return `પ્રસ્થાન: ${h} કલાક ${m} મિનિટમાં`;
      case 'ta': return `புறப்பாடு: ${h} மணி ${m} நிமிடங்களில்`;
      case 'te': return `బయలుదేరే సమయం: ${h} గంటలు ${m} నిమిషాల్లో`;
      case 'kn': return `ಹೊರಡುವುದು: ${h} ಗಂಟೆ ${m} ನಿಮಿಷಗಳಲ್ಲಿ`;
      default: return `Departs in ${hrs}h ${mins}m`;
    }
  };

  const formatCarrier = (tons: number) => {
    const t = toLocalizedDigits(tons, currentLocale);
    switch (currentLocale) {
      case 'hi': return `${t}-टन मालवाहक`;
      case 'mr': return `${t}-टन वाहक`;
      case 'pa': return `${t}-ਟਨ ਵਾਹਕ`;
      case 'gu': return `${t}-ટન વાહક`;
      case 'ta': return `${t}-டன் சரக்கு ஊர்தி`;
      case 'te': return `${t}-టన్నుల వాహనం`;
      case 'kn': return `${t}-ಟನ್ ವಾಹನ`;
      default: return `${tons}-Ton Carrier`;
    }
  };

  const formatFarmersCount = (count: number) => {
    const c = toLocalizedDigits(count, currentLocale);
    switch (currentLocale) {
      case 'hi': return `${c} किसान`;
      case 'mr': return `${c} शेतकरी`;
      case 'pa': return `${c} ਕਿਸਾਨ`;
      case 'gu': return `${c} ખેડૂતો`;
      case 'ta': return `${c} விவசாயிகள்`;
      case 'te': return `${c} రైతులు`;
      case 'kn': return `${c} ರೈತರು`;
      default: return `${count} Farmers`;
    }
  };

  const formatYourLotsIncluded = (count: number) => {
    const c = toLocalizedDigits(count, currentLocale);
    switch (currentLocale) {
      case 'hi': return `✓ आपके ${c} लॉट शामिल हैं`;
      case 'mr': return `✓ तुमचे ${c} लॉट्स समाविष्ट`;
      case 'pa': return `✓ ਤੁਹਾਡੇ ${c} ਲਾਟ ਸ਼ਾਮਲ`;
      case 'gu': return `✓ તમારા ${c} લૉટ્સ સમાવિષ્ટ છે`;
      case 'ta': return `✓ உங்கள் ${c} லாட்டுகள் சேர்க்கப்பட்டுள்ளன`;
      case 'te': return `✓ మీ ${c} లాట్లు చేర్చబడ్డాయి`;
      case 'kn': return `✓ ನಿಮ್ಮ ${c} ಲಾಟ್‌ಗಳು ಸೇರಿವೆ`;
      default: return `✓ Your ${count} lots included`;
    }
  };

  const formatCapacityTotal = (currentMT: string, maxMT: string) => {
    const curr = toLocalizedDigits(currentMT, currentLocale);
    const tot = toLocalizedDigits(maxMT, currentLocale);
    switch (currentLocale) {
      case 'hi': return `कुल: ${curr} मी.टन / ${tot} मी.टन`;
      case 'mr': return `एकूण: ${curr} मे.टन / ${tot} मे.टन`;
      case 'pa': return `ਕੁੱਲ: ${curr} ਮੀ.ਟਨ / ${tot} ਮੀ.ਟਨ`;
      case 'gu': return `કુલ: ${curr} મે.ટન / ${tot} મે.ટન`;
      case 'ta': return `மொத்தம்: ${curr} மெ.டன் / ${tot} மெ.டன்`;
      case 'te': return `మొత్తం: ${curr} మె.టన్నులు / ${tot} మె.టన్నులు`;
      case 'kn': return `ಒಟ್ಟು: ${curr} ಮೆ.ಟನ್ / ${tot} ಮೆ.ಟನ್`;
      default: return `Total: ${currentMT} MT / ${maxMT} MT`;
    }
  };

  const formatLotSavings = (savings: number, discountPct: number) => {
    const s = toLocalizedDigits(Math.round(savings).toLocaleString('en-IN'), currentLocale);
    const d = toLocalizedDigits(discountPct, currentLocale);
    switch (currentLocale) {
      case 'hi': return `बचत ₹${s} (-${d}%)`;
      case 'mr': return `बचत ₹${s} (-${d}%)`;
      case 'pa': return `ਬਚਤ ₹${s} (-${d}%)`;
      case 'gu': return `બચત ₹${s} (-${d}%)`;
      case 'ta': return `சேமிப்பு ₹${s} (-${d}%)`;
      case 'te': return `ఆదా ₹${s} (-${d}%)`;
      case 'kn': return `ಉಳಿತಾಯ ₹${s} (-${d}%)`;
      default: return `Save ₹${Math.round(savings).toLocaleString('en-IN')} (-${discountPct}%)`;
    }
  };

  const formatHubDistance = (km: number) => {
    const d = toLocalizedDigits(km, currentLocale);
    switch (currentLocale) {
      case 'hi': return `आपके खेत से ${d} किमी`;
      case 'mr': return `तुमच्या शेतापासून ${d} किमी`;
      case 'pa': return `ਤੁਹਾਡੇ ਖੇਤ ਤੋਂ ${d} ਕਿ.ਮੀ.`;
      case 'gu': return `તમારા ખેતરથી ${d} કિમી`;
      case 'ta': return `உங்கள் பண்ணையிலிருந்து ${d} கி.மீ`;
      case 'te': return `మీ పొలం నుండి ${d} కి.மீ`;
      case 'kn': return `ನಿಮ್ಮ ತೋಟದಿಂದ ${d} ಕಿ.ಮೀ`;
      default: return `${km} km from your farm`;
    }
  };

  const formatLotsEnrolled = (count: number) => {
    const c = toLocalizedDigits(count, currentLocale);
    switch (currentLocale) {
      case 'hi': return `${c} फसल लॉट नामांकित`;
      case 'mr': return `${c} पीक लॉट्स समाविष्ट`;
      case 'pa': return `${c} ਫ਼ਸਲ ਲਾਟ ਸ਼ਾਮਲ`;
      case 'gu': return `${c} પાક લૉટ્સ સમાવિષ્ટ`;
      case 'ta': return `${c} அறுவடை லாட்டுகள் சேர்க்கப்பட்டன`;
      case 'te': return `${c} పంట లాట్లు చేర్చబడ్డాయి`;
      case 'kn': return `${c} ಬೆಳೆ ಲಾಟ್‌ಗಳು ಸೇರಿವೆ`;
      default: return `${count} Harvest Lots Enrolled`;
    }
  };

  // Initialize selected lots from existing lot status or is_fpo_pooled / isPooled flag
  const [selectedLotIds, setSelectedLotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return activeLots
      .filter(l => l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED')
      .map(l => l.id);
  });

  // Keep selectedLotIds in sync when activeLots load
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLotIds(parsed);
          return;
        }
      }
      const existing = activeLots
        .filter(l => l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED')
        .map(l => l.id);
      if (existing.length > 0) {
        setSelectedLotIds(existing);
      }
    } catch {}
  }, [activeLots]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DRY' | 'PERISHABLE'>('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Helper to identify crop logistics category
  const isDryCrop = (cropName: string = '') => {
    const norm = cropName.toLowerCase();
    return norm.includes('wheat') || norm.includes('grain') || norm.includes('rice') || 
           norm.includes('basmati') || norm.includes('soybean') || norm.includes('chana') || 
           norm.includes('tur') || norm.includes('dal') || norm.includes('cotton') || norm.includes('paddy');
  };

  // Filter lots based on logistics profile
  const filteredLots = useMemo(() => {
    if (activeFilter === 'DRY') {
      return activeLots.filter(l => isDryCrop(l.cropName));
    }
    if (activeFilter === 'PERISHABLE') {
      return activeLots.filter(l => !isDryCrop(l.cropName));
    }
    return activeLots;
  }, [activeLots, activeFilter]);

  // Total selected tonnage
  const selectedTonnage = useMemo(() => {
    return activeLots
      .filter(l => selectedLotIds.includes(l.id))
      .reduce((sum, l) => sum + (l.quantityTons || (l.quantityKg / 1000)), 0);
  }, [activeLots, selectedLotIds]);

  const selectedWeightKg = selectedTonnage * 1000;

  // Financial calculations
  const soloTotalFreight = selectedWeightKg * SOLO_FREIGHT_PER_KG;
  const pooledTotalFreight = selectedWeightKg * POOLED_FREIGHT_PER_KG;
  const totalFreightSavings = soloTotalFreight - pooledTotalFreight;

  // Collective Capacity Calculation (Standard 45.0 MT multi-axle truck)
  const totalCombinedWeightMT = BASELINE_COLLECTIVE_WEIGHT_MT + selectedTonnage;
  const actualCapacityPercent = Math.round((totalCombinedWeightMT / TRUCK_CAPACITY_MT) * 100);
  const isOverflow = actualCapacityPercent > 100;

  // Toggle single lot
  const handleToggleLot = (lotId: string, isLocked: boolean) => {
    if (isLocked) {
      toast.warning('🔒 Lot Locked in Active Bidding / Escrow', {
        description: 'This lot cannot change transport allocation while an escrow transaction is locked.',
      });
      return;
    }

    setSelectedLotIds(prev => {
      if (prev.includes(lotId)) {
        return prev.filter(id => id !== lotId);
      } else {
        return [...prev, lotId];
      }
    });
  };

  // Select all eligible lots
  const handleSelectAll = () => {
    const unlockedIds = activeLots
      .filter(l => l.status !== 'SOLD' && l.status !== 'BIDDING')
      .map(l => l.id);
    setSelectedLotIds(unlockedIds);
    toast.info('All eligible lots selected for FPO Pooling.');
  };

  // Select only dry grains
  const handleSelectDryOnly = () => {
    const dryUnlockedIds = activeLots
      .filter(l => isDryCrop(l.cropName) && l.status !== 'SOLD' && l.status !== 'BIDDING')
      .map(l => l.id);
    setSelectedLotIds(dryUnlockedIds);
    toast.info('Selected all dry grains & pulses for optimal bulk freight.');
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedLotIds([]);
    toast.info('Cleared pool selection. All lots marked for solo transport.');
  };

  // Save changes
  const handleSaveSelection = async () => {
    setIsSaving(true);

    const updatedLots: CropLot[] = activeLots.map(l => {
      const isSelected = selectedLotIds.includes(l.id);
      return {
        ...l,
        is_fpo_pooled: isSelected,
        isPooled: isSelected,
        fpo_collective_name: isSelected ? FPO_NAME : undefined,
        freightPerKg: isSelected ? POOLED_FREIGHT_PER_KG : SOLO_FREIGHT_PER_KG,
        freightSavingsPercent: isSelected ? FREIGHT_DISCOUNT_PCT : 0,
        logisticsType: isSelected ? 'Shared Freight' : 'Direct',
        pooledClusterId: isSelected ? 'CLST-01' : undefined
      };
    });

    // Save to localStorage for cross-tab synchronicity
    try {
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(updatedLots));
      localStorage.setItem('kisansetu_fpo_pooled_lots', JSON.stringify(selectedLotIds));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    setTimeout(() => {
      setIsSaving(false);
      onUpdatePoolSelection(updatedLots, selectedLotIds);
      if (selectedLotIds.length > 0) {
        toast.success('🎉 FPO Collective Pool Updated!', {
          description: `${selectedLotIds.length} Lots (${selectedTonnage.toFixed(1)} MT) assigned to ${FPO_NAME} milk-run dispatch. Estimated savings: ₹${Math.round(totalFreightSavings).toLocaleString('en-IN')}.`,
          duration: 6000
        });
      } else {
        toast.info('FPO Pool Updated', {
          description: 'All harvest lots detached to individual solo direct haul.',
          duration: 5000
        });
      }
    }, 500);
  };

  // Leave collective action
  const handleConfirmLeaveCollective = () => {
    setSelectedLotIds([]);
    const updatedLots: CropLot[] = activeLots.map(l => ({
      ...l,
      is_fpo_pooled: false,
      isPooled: false,
      fpo_collective_name: undefined,
      freightPerKg: SOLO_FREIGHT_PER_KG,
      freightSavingsPercent: 0,
      logisticsType: 'Direct',
      pooledClusterId: undefined
    }));

    try {
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(updatedLots));
      localStorage.setItem('kisansetu_fpo_pooled_lots', JSON.stringify([]));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    onUpdatePoolSelection(updatedLots, []);
    setIsLeaveModalOpen(false);
    toast.warning('Left FPO Collective', {
      description: 'All produce lots reverted to standard solo direct haulage rates (₹1.85/kg).',
      duration: 6000
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & ACTIVE COLLECTIVE PROFILE BANNER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-purple-950 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          {/* Top Metadata Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-800/40 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-3xl font-bold shadow-xs">
                🚛
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">
                  {fpoNameDisplay}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-purple-400/20 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-md font-mono font-bold">
                    {FPO_CODE}
                  </span>
                  <span className="text-emerald-300 font-bold">
                    • {formatHubDistance(4.2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {tFpo('certified_milk_run')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs font-bold rounded-xl border-purple-700/60 bg-purple-950/50 text-purple-200 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-700 transition-colors cursor-pointer"
              >
                {tFpo('leave_collective')}
              </Button>
            </div>
          </div>

          {/* Aggregation Target & Live Truckload Progress Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Metric 1: Milk-Run Target */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Truck size={16} /> {tFpo('active_dispatch')}
              </span>
              <p className="text-3xl font-black text-white">
                {formatCarrier(45)}
              </p>
              <p className="text-emerald-400 font-bold mt-2">
                {formatDepartsTime(4, 30)}
              </p>
            </div>

            {/* Metric 2: Participating Farmers */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Users size={16} /> {tFpo('enrollment')}
              </span>
              <p className="text-3xl font-black text-white">
                {formatFarmersCount(15)}
              </p>
              <p className="text-purple-200 font-bold mt-2">
                {selectedLotIds.length > 0
                  ? formatYourLotsIncluded(selectedLotIds.length)
                  : tFpo('select_lots_to_join')}
              </p>
            </div>

            {/* Metric 3: Capacity Progress */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs lg:col-span-1 md:col-span-2">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Boxes size={16} /> {tFpo('capacity')}
                </span>
                <span className="text-emerald-400 font-black font-mono text-lg">
                  {toLocalizedDigits(actualCapacityPercent, currentLocale)}% {tFpo('full')}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-4 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-purple-900/60 mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverflow
                      ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                      : actualCapacityPercent >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-amber-500 to-purple-400'
                  }`}
                  style={{ width: `${Math.min(actualCapacityPercent, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-purple-200 font-bold">
                <span>
                  {formatCapacityTotal(totalCombinedWeightMT.toFixed(1), '45.0')}
                </span>
                {isOverflow && (
                  <span className="text-rose-400">{tFpo('overflow')}</span>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LOT-BY-LOT SELECTIVE POOLING TABLE / MATRIX */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🌾 {tFpo('select_harvest_lots')}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {toLocalizedDigits(selectedLotIds.length, currentLocale)} / {toLocalizedDigits(activeLots.length, currentLocale)} {tFpo('selected')}
              </span>
            </h3>
          </div>

          {/* Quick Selection Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tFpo('all_lots')} ({toLocalizedDigits(activeLots.length, currentLocale)})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('DRY')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'DRY'
                    ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Leaf size={12} className="text-emerald-600" />
                {tFpo('dry_grains')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('PERISHABLE')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'PERISHABLE'
                    ? 'bg-white text-blue-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Snowflake size={12} className="text-blue-600" />
                {tFpo('perishables')}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectDryOnly}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {tFpo('select_all_grains')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {tFpo('select_all')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs font-bold h-8 rounded-xl text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                {tFpo('clear')}
              </Button>
            </div>
          </div>
        </div>

        {/* Lots Card Matrix */}
        {filteredLots.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">{tFpo('no_lots_category')}</h4>
              <p className="text-xs text-slate-500">
                {tFpo('no_lots_desc')}
              </p>
            </div>
            {onNavigateToTab && (
              <Button
                size="sm"
                onClick={() => onNavigateToTab('overview')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                {tFpo('list_new_produce')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredLots.map((lot) => {
              const isSelected = selectedLotIds.includes(lot.id);
              const isLocked = lot.status === 'SOLD' || lot.status === 'BIDDING';
              const isDry = isDryCrop(lot.cropName);
              const lotWeightKg = lot.quantityKg || ((lot.quantityTons || 5) * 1000);
              const lotTons = (lotWeightKg / 1000).toFixed(1);

              const lotSoloFreight = lotWeightKg * SOLO_FREIGHT_PER_KG;
              const lotPooledFreight = lotWeightKg * POOLED_FREIGHT_PER_KG;
              const lotSavings = lotSoloFreight - lotPooledFreight;

              return (
                <div
                  key={lot.id}
                  onClick={() => handleToggleLot(lot.id, isLocked)}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  
                  {/* Left Column: Checkbox, Image & Crop Identification */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    
                    {/* Custom Checkbox Toggle */}
                    <div 
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={12} className="text-slate-400" />
                      ) : (
                        <Check size={14} className={isSelected ? 'stroke-[3]' : 'opacity-0'} />
                      )}
                    </div>

                    {/* Specimen Produce Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img 
                        src={lot.imageUrl || '/logo.png'} 
                        alt={lot.cropName} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Crop Name & Lot Info */}
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {toLocalizedDigits(lot.id, currentLocale)}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {toLocalizedDigits(lot.harvestDate || '', currentLocale)}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {tCrop(lot.cropName)}
                      </h4>
                      <p className="text-xs text-slate-600 truncate">
                        {tCrop(lot.variety || '')}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Volume, Quality Grade & Logistics Profile */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    
                    {/* Volume & Quality Grade */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {tFpo('volume_grade')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {toLocalizedDigits(lotTons, currentLocale)} {tFpo('mt_unit')}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lot.qualityGrade || 'Grade A'} ({toLocalizedDigits(lot.qualityScore || 95, currentLocale)}%)
                        </span>
                      </div>
                    </div>

                    {/* Logistics Profile Tag */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {tFpo('logistics_profile')}
                      </span>
                      {isDry ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Leaf size={12} className="text-emerald-600" />
                          {tFpo('ideal_dry_pool')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Snowflake size={12} className="text-blue-600" />
                          {tFpo('perishable_sensitive')}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Freight Breakdown & Net Savings */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    
                    <div className="text-left lg:text-right space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {tFpo('freight_rate')}
                      </span>
                      <div className="flex items-center lg:justify-end gap-2 text-xs font-mono">
                        <span className="text-slate-400 line-through">₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/{tFpo('kg_unit')}</span>
                        <strong className="text-emerald-700 font-bold">➔ ₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/{tFpo('kg_unit')}</strong>
                      </div>
                      <p className="text-xs font-black text-emerald-600 font-mono">
                        {formatLotSavings(lotSavings, FREIGHT_DISCOUNT_PCT)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-xs font-black shadow-2xs font-mono">
                          <Users size={13} className="text-purple-700" />
                          {tFpo('fpo_pooled')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold font-mono">
                          <Truck size={13} className="text-slate-500" />
                          {tFpo('solo_haul')}
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. REAL-TIME ECONOMIC BENEFIT CALCULATOR (BOTTOM DOCK) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Summary Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            
            {/* Metric 1: Selected Tonnage */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {tFpo('total_pooling_volume')}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white font-mono">
                  {toLocalizedDigits(selectedTonnage.toFixed(1), currentLocale)}
                </span>
                <span className="text-sm font-bold text-emerald-200">
                  {tFpo('metric_tons')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-mono">
                {formatLotsEnrolled(selectedLotIds.length)}
              </p>
            </div>

            {/* Metric 2: Net Freight Savings */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {tFpo('estimated_freight_savings')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-300 font-mono">
                  ₹{toLocalizedDigits(Math.round(totalFreightSavings).toLocaleString('en-IN'), currentLocale)}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  -{toLocalizedDigits(FREIGHT_DISCOUNT_PCT, currentLocale)}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {formatSoloVsPooled(soloTotalFreight, pooledTotalFreight)}
              </p>
            </div>

            {/* Metric 3: Dispatch & Escrow Guarantee */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {tFpo('dispatch_window_settlement')}
              </span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <Clock size={16} className="text-emerald-400 shrink-0" />
                <span>
                  {formatDepartsTime(4, 30)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {tFpo('zero_upfront_cost')}
              </p>
            </div>

          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              type="button"
              onClick={handleSaveSelection}
              disabled={isSaving}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>{tFpo('syncing_collective')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>
                    {tFpo('update_pool_selection')}
                  </span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CONFIRMATION MODAL: LEAVE COLLECTIVE */}
      {/* ========================================================================= */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl shadow-xs">
              ⚠️
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                {currentLocale === 'hi' ? 'एफपीओ कलेक्टिव पूल छोड़ें?'
                  : currentLocale === 'mr' ? 'एफपीओ एकत्रित पूल सोडावा?'
                  : currentLocale === 'pa' ? 'FPO ਸਮੂਹਿਕ ਪੂਲ ਛੱਡੋ?'
                  : currentLocale === 'gu' ? 'FPO સામૂહિક પૂલ છોડવો છે?'
                  : currentLocale === 'ta' ? 'FPO கூட்டுப் பூலில் இருந்து வெளியேறவா?'
                  : currentLocale === 'te' ? 'FPO ఉమ్మడి పూల్ నుండి నిష్క్రమించాలా?'
                  : currentLocale === 'kn' ? 'FPO ಸಾಮೂಹಿಕ ಪೂಲ್‌ನಿಂದ ನಿರ್ಗಮಿಸಬೇಕೆ?'
                  : 'Leave FPO Collective Pool?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLocale === 'hi'
                  ? <>सभी लॉट को <strong className="text-slate-900">{fpoNameDisplay}</strong> से अलग करने पर आपका साझा परिवहन मार्ग आरक्षण रद्द हो जाएगा। आपके मालभाड़े की दरें मानक एकल दर (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किग्रा</strong> बनाम <strong>₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किग्रा</strong>) पर वापस आ जाएंगी।</>
                  : currentLocale === 'mr'
                  ? <>सर्व लॉट्स <strong className="text-slate-900">{fpoNameDisplay}</strong> मधून वगळल्यास तुमचे सामायिक वाहतूक आरक्षण रद्द होईल. तुमचे वाहतूक दर नियमित दरावर (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किलो</strong> ऐवजी <strong>₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किलो</strong>) परत जातील.</>
                  : currentLocale === 'pa'
                  ? <>ਸਾਰੇ ਲਾਟਾਂ ਨੂੰ <strong className="text-slate-900">{fpoNameDisplay}</strong> ਤੋਂ ਵੱਖ ਕਰਨ ਨਾਲ ਤੁਹਾਡਾ ਸਾਂਝਾ ਟਰਾਂਸਪੋਰਟ ਰਿਜ਼ਰਵੇਸ਼ਨ ਰੱਦ ਹੋ ਜਾਵੇਗਾ। ਤੁਹਾਡਾ ਕਿਰਾਇਆ ਇਕੱਲੇ ਭਾੜੇ ਦੀ ਦਰ (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/ਕਿਲੋ</strong>) 'ਤੇ ਵਾਪਸ ਆ ਜਾਵੇਗਾ।</>
                  : currentLocale === 'gu'
                  ? <>બધા લૉટને <strong className="text-slate-900">{fpoNameDisplay}</strong> માંથી અલગ કરવાથી તમારું વહેંચાયેલ પરિવહન રૂટ રદ થઈ જશે. તમારા માલભાડા દર સામાન્ય એકલ દર (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/કિલો</strong>) પર પાછા આવી જશે.</>
                  : currentLocale === 'ta'
                  ? <><strong className="text-slate-900">{fpoNameDisplay}</strong> இலிருந்து அனைத்து லாட்டுகளையும் பிரிப்பது உங்கள் பகிரப்பட்ட போக்குவரத்து முன்பதிவை ரத்து செய்யும். உங்கள் விளைபொருளுக்கான சரக்கு கட்டணம் நிலையான தனி விகிதங்களுக்குத் திரும்பும் (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/கிலோ</strong>).</>
                  : currentLocale === 'te'
                  ? <><strong className="text-slate-900">{fpoNameDisplay}</strong> నుండి అన్ని లాట్లను వేరు చేయడం ద్వారా మీ ఉమ్మడి రవాణా రిజర్వేషన్ రద్దు చేయబడుతుంది. మీ రవాణా ఛార్జీలు సాధారణ వ్యక్తిగత రేట్లకు (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/కిలో</strong>) తిరిగి వస్తాయి.</>
                  : currentLocale === 'kn'
                  ? <><strong className="text-slate-900">{fpoNameDisplay}</strong> ನಿಂದ ಎಲ್ಲಾ ಲಾಟ್‌ಗಳನ್ನು ಬೇರ್ಪಡಿಸುವುದರಿಂದ ನಿಮ್ಮ ಹಂಚಿಕೆಯ ಸಾರಿಗೆ ಕಾಯ್ದಿರಿಸುವಿಕೆ ರದ್ದಾಗುತ್ತದೆ. ನಿಮ್ಮ ಸರಕು ಸಾಗಣೆ ದರಗಳು ಸಾಮಾನ್ಯ ದರಕ್ಕೆ (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/ಕೆಜಿ</strong>) ಹಿಂತಿರುಗುತ್ತವೆ.</>
                  : <>Detaching all lots from <strong className="text-slate-900">{FPO_NAME}</strong> will cancel your shared delivery route reservation. Freight costs for your produce will revert to standard solo direct haul rates (<strong>₹1.85/kg</strong> instead of <strong>₹1.20/kg</strong>).</>}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">
                {currentLocale === 'hi' ? 'अनुमानित वित्तीय प्रभाव:'
                  : currentLocale === 'mr' ? 'अंदाजे आर्थिक परिणाम:'
                  : currentLocale === 'pa' ? 'ਅੰਦਾਜ਼ਨ ਵਿੱਤੀ ਪ੍ਰਭਾਵ:'
                  : currentLocale === 'gu' ? 'અંદાજિત નાણાકીય અસર:'
                  : currentLocale === 'ta' ? 'மதிப்பிடப்பட்ட நிதி தாக்கம்:'
                  : currentLocale === 'te' ? 'అంచనా వేసిన ఆర్థిక ప్రభావం:'
                  : currentLocale === 'kn' ? 'ಅಂದಾಜು ಆರ್ಥಿಕ ಪರಿಣಾಮ:'
                  : 'Estimated Financial Impact:'}
              </strong>
              <p className="text-[11px] text-amber-800">
                {currentLocale === 'hi'
                  ? <>आप अपने सक्रिय फसल लॉट पर <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> तक की लॉजिस्टिक्स बचत खो देंगे।</>
                  : currentLocale === 'mr'
                  ? <>तुम्ही तुमच्या सक्रिय पीक लॉट्सवरील <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> पर्यंतची बचत गमावाल.</>
                  : currentLocale === 'pa'
                  ? <>ਤੁਸੀਂ ਆਪਣੇ ਕਿਰਿਆਸ਼ੀਲ ਲਾਟਾਂ 'ਤੇ <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> ਤੱਕ ਦੀ ਬਚਤ ਗੁਆ ਦੇਵੋਗੇ।</>
                  : currentLocale === 'gu'
                  ? <>તમે તમારા સક્રિય પાક લૉટ્સ પર <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> સુધીની માલભાડા બચત ગુમાવશો.</>
                  : currentLocale === 'ta'
                  ? <>உங்கள் செயலில் உள்ள லாட்டுகளில் <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> வரை சரக்கு சேமிப்பை இழக்க நேரிடும்.</>
                  : currentLocale === 'te'
                  ? <>మీరు మీ క్రియాశీల పంట లాట్లపై <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> వరకు రవాణా ఆదాను కోల్పోతారు.</>
                  : currentLocale === 'kn'
                  ? <>ನಿಮ್ಮ ಸಕ್ರಿಯ ಬೆಳೆ ಲಾಟ್‌ಗಳ ಮೇಲೆ <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> ವರೆಗಿನ ಸಾರಿಗೆ ಉಳಿತಾಯವನ್ನು ನೀವು ಕಳೆದುಕೊಳ್ಳುತ್ತೀರಿ.</>
                  : <>You will forfeit up to <strong className="text-amber-950">₹{Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN')}</strong> in logistics savings on your active harvest lots.</>}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLeaveModalOpen(false)}
                className="flex-1 text-xs h-11 rounded-xl border-slate-300 font-bold cursor-pointer"
              >
                {currentLocale === 'hi' ? 'पूल में बनाए रखें'
                  : currentLocale === 'mr' ? 'पूलमध्ये ठेवा'
                  : currentLocale === 'pa' ? 'ਪੂਲ ਵਿੱਚ ਰੱਖੋ'
                  : currentLocale === 'gu' ? 'પૂલમાં જાળવી રાખો'
                  : currentLocale === 'ta' ? 'பூலில் வைத்திருக்கவும்'
                  : currentLocale === 'te' ? 'పూల్‌లోనే ఉంచండి'
                  : currentLocale === 'kn' ? 'ಪೂಲ್‌ನಲ್ಲಿಯೇ ಇರಿಸಿ'
                  : 'Keep in Pool'}
              </Button>
              <Button
                type="button"
                onClick={handleConfirmLeaveCollective}
                className="flex-1 text-xs h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-sm cursor-pointer"
              >
                {currentLocale === 'hi' ? 'छोड़ने की पुष्टि करें'
                  : currentLocale === 'mr' ? 'सोडण्याची पुष्टी करा'
                  : currentLocale === 'pa' ? 'ਛੱਡਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ'
                  : currentLocale === 'gu' ? 'છોડવાની ખાતરી કરો'
                  : currentLocale === 'ta' ? 'வெளியேறுவதை உறுதிசெய்'
                  : currentLocale === 'te' ? 'నిష్క్రమణను నిర్ధారించండి'
                  : currentLocale === 'kn' ? 'ನಿರ್ಗಮನವನ್ನು ದೃಢೀಕರಿಸಿ'
                  : 'Confirm Leave'}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default FPOCollectiveView;
