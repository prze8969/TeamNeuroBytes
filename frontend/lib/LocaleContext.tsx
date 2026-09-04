'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, locales } from '@/i18n/routing';
import enMessages from '@/messages/en.json';
import hiMessages from '@/messages/hi.json';
import mrMessages from '@/messages/mr.json';
import paMessages from '@/messages/pa.json';
import guMessages from '@/messages/gu.json';
import taMessages from '@/messages/ta.json';
import teMessages from '@/messages/te.json';
import knMessages from '@/messages/kn.json';

const allMessages: Record<Locale, any> = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
  pa: paMessages,
  gu: guMessages,
  ta: taMessages,
  te: teMessages,
  kn: knMessages,
};

// Crop dictionaries for all 8 supported languages
export const cropTranslations: Record<Locale, Record<string, string>> = {
  en: {
    'Wheat': 'Wheat',
    'Sharbati Wheat': 'Sharbati Wheat',
    'Sharbati Wheat (Lok-1)': 'Sharbati Wheat (Lot-1)',
    'Sharbati Wheat (Lot-1)': 'Sharbati Wheat (Lot-1)',
    'Onion': 'Onion',
    'Nashik Red Onion': 'Nashik Red Onion',
    'Nashik Red Onion (Garva)': 'Nashik Red Onion (Garva)',
    'Red Onion': 'Red Onion',
    'Tomato': 'Tomato',
    'Hybrid Tomato': 'Hybrid Tomato',
    'Hybrid Tomato (Vaishali)': 'Hybrid Tomato (Vaishali)',
    'Potato': 'Potato',
    'Kufri Jyoti Potato': 'Kufri Jyoti Potato',
    'Banana': 'Banana',
    'Grand Naine / Robusta Banana': 'Grand Naine / Robusta Banana',
    'Robusta Banana': 'Robusta Banana',
    'Soybean': 'Soybean',
    'Yellow Soybean': 'Yellow Soybean',
    'Cotton': 'Cotton',
    'Bt Cotton': 'Bt Cotton',
    'Rice': 'Rice',
    'Basmati Rice': 'Basmati Rice',
    'Paddy': 'Paddy',
    'Maize': 'Maize',
    'Corn': 'Corn',
    'Turmeric': 'Turmeric',
    'Garlic': 'Garlic',
    'Ginger': 'Ginger',
    'Grapes': 'Grapes',
    'Nashik Grapes': 'Nashik Grapes',
    'Pomegranate': 'Pomegranate',
    'Bhagwa Pomegranate': 'Bhagwa Pomegranate',
    'Mustard': 'Mustard',
    'Chickpea': 'Chickpea',
    'Groundnut': 'Groundnut',
    'Certified Variety': 'Certified Variety',
  },
  hi: {
    'Wheat': 'गेहूं',
    'Sharbati Wheat': 'शरबती गेहूं',
    'Sharbati Wheat (Lok-1)': 'शरबती गेहूं (Lok-1)',
    'Onion': 'प्याज',
    'Nashik Red Onion': 'नासिक लाल प्याज',
    'Nashik Red Onion (Garva)': 'नासिक लाल प्याज (गरवा)',
    'Red Onion': 'लाल प्याज',
    'Tomato': 'टमाटर',
    'Hybrid Tomato': 'हाइब्रिड टमाटर',
    'Hybrid Tomato (Vaishali)': 'हाइब्रिड टमाटर (वैशाली)',
    'Potato': 'आलू',
    'Kufri Jyoti Potato': 'कुफरी ज्योति आलू',
    'Banana': 'केला',
    'Grand Naine / Robusta Banana': 'ग्रैंड नैन / रोबस्टा केला',
    'Robusta Banana': 'रोबस्टा केला',
    'Soybean': 'सोयाबीन',
    'Yellow Soybean': 'पीला सोयाबीन',
    'Cotton': 'कपास',
    'Bt Cotton': 'बीटी कपास',
    'Rice': 'चावल',
    'Basmati Rice': 'बासमती चावल',
    'Paddy': 'धान',
    'Maize': 'मक्का',
    'Corn': 'मकई',
    'Turmeric': 'हल्दी',
    'Garlic': 'लहसुन',
    'Ginger': 'अदरक',
    'Grapes': 'अंगूर',
    'Nashik Grapes': 'नासिक अंगूर',
    'Pomegranate': 'अनार',
    'Bhagwa Pomegranate': 'भगवा अनार',
    'Mustard': 'सरसों',
    'Chickpea': 'चना',
    'Groundnut': 'मूंगफली',
    'Certified Variety': 'प्रमाणित किस्म',
  },
  mr: {
    'Wheat': 'गहू',
    'Sharbati Wheat': 'शरबती गहू',
    'Sharbati Wheat (Lok-1)': 'शरबती गहू (Lok-1)',
    'Onion': 'कांदा',
    'Nashik Red Onion': 'नाशिक लाल कांदा',
    'Nashik Red Onion (Garva)': 'नाशिक लाल कांदा (गरवा)',
    'Red Onion': 'लाल कांदा',
    'Tomato': 'टोमॅटो',
    'Hybrid Tomato': 'संकरित टोमॅटो',
    'Hybrid Tomato (Vaishali)': 'संकरित टोमॅटो (वैशाली)',
    'Potato': 'बटाटा',
    'Kufri Jyoti Potato': 'कुफरी ज्योती बटाटा',
    'Banana': 'केळी',
    'Grand Naine / Robusta Banana': 'ग्रँड नैन / रोबस्टा केळी',
    'Robusta Banana': 'रोबस्टा केळी',
    'Soybean': 'सोयाबीन',
    'Yellow Soybean': 'पिवळे सोयाबीन',
    'Cotton': 'कापूस',
    'Bt Cotton': 'बीटी कापूस',
    'Rice': 'तांदूळ',
    'Basmati Rice': 'बासमती तांदूळ',
    'Paddy': 'धान',
    'Maize': 'मका',
    'Corn': 'मका',
    'Turmeric': 'हळद',
    'Garlic': 'लसूण',
    'Ginger': 'आले',
    'Grapes': 'द्राक्षे',
    'Nashik Grapes': 'नाशिक द्राक्षे',
    'Pomegranate': 'डाळिंब',
    'Bhagwa Pomegranate': 'भगवा डाळिंब',
    'Mustard': 'मोहरी',
    'Chickpea': 'हरभरा',
    'Groundnut': 'भुईमूग',
    'Certified Variety': 'प्रमाणित जात',
  },
  pa: {
    'Wheat': 'ਕਣਕ',
    'Sharbati Wheat': 'ਸ਼ਰਬਤੀ ਕਣਕ',
    'Sharbati Wheat (Lok-1)': 'ਸ਼ਰਬਤੀ ਕਣਕ (Lok-1)',
    'Onion': 'ਪਿਆਜ਼',
    'Nashik Red Onion': 'ਨਾਸਿਕ ਲਾਲ ਪਿਆਜ਼',
    'Nashik Red Onion (Garva)': 'ਨਾਸਿਕ ਲਾਲ ਪਿਆਜ਼ (ਗਰਵਾ)',
    'Red Onion': 'ਲਾਲ ਪਿਆਜ਼',
    'Tomato': 'ਟਮਾਟਰ',
    'Hybrid Tomato': 'ਹਾਈਬ੍ਰਿਡ ਟਮਾਟਰ',
    'Hybrid Tomato (Vaishali)': 'ਹਾਈਬ੍ਰਿਡ ਟਮਾਟਰ (ਵੈਸ਼ਾਲੀ)',
    'Potato': 'ਆਲੂ',
    'Kufri Jyoti Potato': 'ਕੁਫਰੀ ਜਯੋਤੀ ਆਲੂ',
    'Banana': 'ਕੇਲਾ',
    'Grand Naine / Robusta Banana': 'ਗ੍ਰੈਂਡ ਨੈਨ / ਰੋਬਸਟਾ ਕੇਲਾ',
    'Robusta Banana': 'ਰੋਬਸਟਾ ਕੇਲਾ',
    'Soybean': 'ਸੋਇਆਬੀਨ',
    'Yellow Soybean': 'ਪੀਲਾ ਸੋਇਆਬੀਨ',
    'Cotton': 'ਕਪਾਹ',
    'Bt Cotton': 'ਬੀਟੀ ਕਪਾਹ',
    'Rice': 'ਚੌਲ',
    'Basmati Rice': 'ਬਾਸਮਤੀ ਚੌਲ',
    'Paddy': 'ਝੋਨਾ',
    'Maize': 'ਮੱਕੀ',
    'Corn': 'ਮੱਕੀ',
    'Turmeric': 'ਹਲਦੀ',
    'Garlic': 'ਲਸਣ',
    'Ginger': 'ਅਦਰਕ',
    'Grapes': 'ਅੰਗੂਰ',
    'Nashik Grapes': 'ਨਾਸਿਕ ਅੰਗੂਰ',
    'Pomegranate': 'ਅਨਾਰ',
    'Bhagwa Pomegranate': 'ਭਗਵਾ ਅਨਾਰ',
    'Mustard': 'ਸਰ੍ਹੋਂ',
    'Chickpea': 'ਛੋਲੇ',
    'Groundnut': 'ਮੂੰਗਫਲੀ',
    'Certified Variety': 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਮ',
  },
  gu: {
    'Wheat': 'ઘઉં',
    'Sharbati Wheat': 'શરબતી ઘઉં',
    'Sharbati Wheat (Lok-1)': 'શરબતી ઘઉં (Lok-1)',
    'Onion': 'ડુંગળી',
    'Nashik Red Onion': 'નાસિક લાલ ડુંગળી',
    'Nashik Red Onion (Garva)': 'નાસિક લાલ ડુંગળી (ગરવા)',
    'Red Onion': 'લાલ ડુંગળી',
    'Tomato': 'ટામેટાં',
    'Hybrid Tomato': 'હાઇબ્રિડ ટામેટાં',
    'Hybrid Tomato (Vaishali)': 'હાઇબ્રિડ ટામેટાં (વૈશાલી)',
    'Potato': 'બટાકા',
    'Kufri Jyoti Potato': 'કુફરી જ્યોતિ બટાકા',
    'Banana': 'કેળું',
    'Grand Naine / Robusta Banana': 'ગ્રાન્ડ નૈન / રોબસ્ટા કેળું',
    'Robusta Banana': 'રોબસ્ટા કેળું',
    'Soybean': 'સોયાબીન',
    'Yellow Soybean': 'પીળા સોયાબીન',
    'Cotton': 'કપાસ',
    'Bt Cotton': 'બીટી કપાસ',
    'Rice': 'ચોખા',
    'Basmati Rice': 'બાસમતી ચોખા',
    'Paddy': 'ડાંગર',
    'Maize': 'મકાઈ',
    'Corn': 'મકાઈ',
    'Turmeric': 'હળદર',
    'Garlic': 'લસણ',
    'Ginger': 'આદુ',
    'Grapes': 'દ્રાક્ષ',
    'Nashik Grapes': 'નાસિક દ્રાક્ષ',
    'Pomegranate': 'દાડમ',
    'Bhagwa Pomegranate': 'ભગવા દાડમ',
    'Mustard': 'રાઈ',
    'Chickpea': 'ચણા',
    'Groundnut': 'મગફળી',
    'Certified Variety': 'પ્રમાણિત જાત',
  },
  ta: {
    'Wheat': 'கோதுமை',
    'Sharbati Wheat': 'சர்பதி கோதுமை',
    'Sharbati Wheat (Lok-1)': 'சர்பதி கோதுமை (Lok-1)',
    'Onion': 'வெங்காயம்',
    'Nashik Red Onion': 'நாசிக் சிவப்பு வெங்காயம்',
    'Nashik Red Onion (Garva)': 'நாசிக் சிவப்பு வெங்காயம் (கார்வா)',
    'Red Onion': 'சிவப்பு வெங்காயம்',
    'Tomato': 'தக்காளி',
    'Hybrid Tomato': 'கலப்பின தக்காளி',
    'Hybrid Tomato (Vaishali)': 'கலப்பின தக்காளி (வைஷாலி)',
    'Potato': 'உருளைக்கிழங்கு',
    'Kufri Jyoti Potato': 'குப்ரி ஜோதி உருளைக்கிழங்கு',
    'Banana': 'வாழைப்பழம்',
    'Grand Naine / Robusta Banana': 'கிராண்ட் நைன் / ரோபஸ்டா வாழைப்பழம்',
    'Robusta Banana': 'ரோபஸ்டா வாழைப்பழம்',
    'Soybean': 'சோயாபீன்',
    'Yellow Soybean': 'மஞ்சள் சோயாபீன்',
    'Cotton': 'பருத்தி',
    'Bt Cotton': 'பிடி பருத்தி',
    'Rice': 'அரிசி',
    'Basmati Rice': 'பாசுமதி அரிசி',
    'Paddy': 'நெல்',
    'Maize': 'மக்காச்சோளம்',
    'Corn': 'சோளம்',
    'Turmeric': 'மஞ்சள்',
    'Garlic': 'பூண்டு',
    'Ginger': 'இஞ்சி',
    'Grapes': 'திராட்சை',
    'Nashik Grapes': 'நாசிக் திராட்சை',
    'Pomegranate': 'மாதுளை',
    'Bhagwa Pomegranate': 'பகவா மாதுளை',
    'Mustard': 'கடுகு',
    'Chickpea': 'கொண்டைக்கடலை',
    'Groundnut': 'நிலக்கடலை',
    'Certified Variety': 'சான்றளிக்கப்பட்ட ரகம்',
  },
  te: {
    'Wheat': 'గోధుమ',
    'Sharbati Wheat': 'శర్బతి గోధుమ',
    'Sharbati Wheat (Lok-1)': 'శర్బతి గోధుమ (Lok-1)',
    'Onion': 'ఉల్లిపాయ',
    'Nashik Red Onion': 'నాసిక్ ఎర్ర ఉల్లిపాయ',
    'Nashik Red Onion (Garva)': 'నాసిక్ ఎర్ర ఉల్లిపాయ (గర్వా)',
    'Red Onion': 'ఎర్ర ఉల్లిపాయ',
    'Tomato': 'టమోటా',
    'Hybrid Tomato': 'హైబ్రిడ్ టమోటా',
    'Hybrid Tomato (Vaishali)': 'హైబ్రిడ్ టమోటా (వైశాలి)',
    'Potato': 'బంగాళాదుంప',
    'Kufri Jyoti Potato': 'కుఫ్రీ జ్యోతి బంగాళాదుంప',
    'Banana': 'అరటిపండు',
    'Grand Naine / Robusta Banana': 'గ్రాండ్ నైన్ / రోబస్టా అరటి',
    'Robusta Banana': 'రోబస్టా అరటి',
    'Soybean': 'సోయాబీన్',
    'Yellow Soybean': 'పసుపు సోయాబీన్',
    'Cotton': 'పత్తి',
    'Bt Cotton': 'బిటి పత్తి',
    'Rice': 'బియ్యం',
    'Basmati Rice': 'బాస్మతి బియ్యం',
    'Paddy': 'వరి',
    'Maize': 'మొక్కజొన్న',
    'Corn': 'మొక్కజొన్న',
    'Turmeric': 'పసుపు',
    'Garlic': 'వెల్లుల్లి',
    'Ginger': 'అల్లం',
    'Grapes': 'ద్రాక్ష',
    'Nashik Grapes': 'నాసిక్ ద్రాక్ష',
    'Pomegranate': 'దానిమ్మ',
    'Bhagwa Pomegranate': 'భగవా దానిమ్మ',
    'Mustard': 'ఆవాలు',
    'Chickpea': 'శనగలు',
    'Groundnut': 'వేరుశనగ',
    'Certified Variety': 'ధృవీకరించబడిన రకం',
  },
  kn: {
    'Wheat': 'ಗೋಧಿ',
    'Sharbati Wheat': 'ಶರ್ಬತಿ ಗೋಧಿ',
    'Sharbati Wheat (Lok-1)': 'ಶರ್ಬತಿ ಗೋಧಿ (Lok-1)',
    'Onion': 'ಈರುಳ್ಳಿ',
    'Nashik Red Onion': 'ನಾಸಿಕ್ ಕೆಂಪು ಈರುಳ್ಳಿ',
    'Nashik Red Onion (Garva)': 'ನಾಸಿಕ್ ಕೆಂಪು ಈರುಳ್ಳಿ (ಗರ್ವಾ)',
    'Red Onion': 'ಕೆಂಪು ಈರುಳ್ಳಿ',
    'Tomato': 'ಟೊಮೆಟೊ',
    'Hybrid Tomato': 'ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ',
    'Hybrid Tomato (Vaishali)': 'ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ (ವೈಶಾಲಿ)',
    'Potato': 'ಆಲೂಗಡ್ಡೆ',
    'Kufri Jyoti Potato': 'ಕುಫ್ರಿ ಜ್ಯೋತಿ ಆಲೂಗಡ್ಡೆ',
    'Banana': 'ಬಾಳೆಹಣ್ಣು',
    'Grand Naine / Robusta Banana': 'ಗ್ರ್ಯಾಂಡ್ ನೈನ್ / ರೋಬಸ್ಟಾ ಬಾಳೆಹಣ್ಣು',
    'Robusta Banana': 'ರೋಬಸ್ಟಾ ಬಾಳೆಹಣ್ಣು',
    'Soybean': 'ಸೋಯಾಬೀನ್',
    'Yellow Soybean': 'ಹಳದಿ ಸೋಯಾಬೀನ್',
    'Cotton': 'ಹತ್ತಿ',
    'Bt Cotton': 'ಬಿಟಿ ಹತ್ತಿ',
    'Rice': 'ಅಕ್ಕಿ',
    'Basmati Rice': 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ',
    'Paddy': 'ಭತ್ತ',
    'Maize': 'ಮೆಕ್ಕೆಜೋಳ',
    'Corn': 'ಜೋಳ',
    'Turmeric': 'ಅರಿಶಿನ',
    'Garlic': 'ಬೆಳ್ಳುಳ್ಳಿ',
    'Ginger': 'ಶುಂಠಿ',
    'Grapes': 'ದ್ರಾಕ್ಷಿ',
    'Nashik Grapes': 'ನಾಸಿಕ್ ದ್ರಾಕ್ಷಿ',
    'Pomegranate': 'ದಾಳಿಂಬೆ',
    'Bhagwa Pomegranate': 'ಭಗವಾ ದಾಳಿಂಬೆ',
    'Mustard': 'ಸಾಸಿವೆ',
    'Chickpea': 'ಕಡಲೆ',
    'Groundnut': 'ಕಡಲೆಕಾಯಿ',
    'Certified Variety': 'ದೃಢೀಕೃತ ತಳಿ',
  },
};

export const DIGIT_MAPS: Record<string, string[]> = {
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
};

export function toLocalizedDigits(input: string | number, locale: string): string {
  if (input === null || input === undefined) return '';
  const digits = DIGIT_MAPS[locale];
  if (!digits) return String(input);
  return String(input).replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
}

interface LocaleContextValue {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  messages: any;
  t: (key: string, namespace?: string) => string;
  tCrop: (cropName: string) => string;
  tNum: (val: string | number) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  currentLocale: 'en',
  setLocale: () => {},
  messages: enMessages,
  t: (key: string) => key,
  tCrop: (cropName: string) => cropName,
  tNum: (val: string | number) => String(val),
});

export function LocaleProvider({
  children,
  initialLocale = 'en'
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [currentLocale, setCurrentLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_locale') as Locale;
      if (saved && locales.includes(saved)) {
        setCurrentLocaleState(saved);
      }
    } catch {}
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;
    setCurrentLocaleState(newLocale);
    try {
      localStorage.setItem('kisansetu_locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };

  const messages = allMessages[currentLocale] || allMessages.en;

  const t = (keyPath: string, namespace?: string): string => {
    const fullPath = namespace ? `${namespace}.${keyPath}` : keyPath;
    const parts = fullPath.split('.');
    
    let current = messages;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English
        let fallback = allMessages.en;
        for (const fbPart of parts) {
          if (fallback && typeof fallback === 'object' && fbPart in fallback) {
            fallback = fallback[fbPart];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  };

  const tCrop = (cropName: string): string => {
    if (!cropName) return '';
    const dict = cropTranslations[currentLocale] || cropTranslations.en;
    
    // Direct match
    if (dict[cropName]) return dict[cropName];

    // Case-insensitive exact lookup
    const trimmed = cropName.trim();
    for (const key of Object.keys(dict)) {
      if (key.toLowerCase() === trimmed.toLowerCase()) {
        return dict[key];
      }
    }

    // Partial match substring replacement for common crops
    let translated = trimmed;
    const sortedKeys = Object.keys(cropTranslations.en).sort((a, b) => b.length - a.length);
    for (const enKey of sortedKeys) {
      if (enKey.length > 2 && translated.toLowerCase().includes(enKey.toLowerCase())) {
        const regex = new RegExp(enKey, 'gi');
        translated = translated.replace(regex, dict[enKey] || enKey);
        break;
      }
    }

    return translated;
  };

  const tNum = (val: string | number) => toLocalizedDigits(val, currentLocale);

  return (
    <LocaleContext.Provider value={{ currentLocale, setLocale, messages, t, tCrop, tNum }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export function useTranslations(namespace?: string) {
  const { t } = useLocaleContext();
  return (key: string) => t(key, namespace);
}

export function useCropTranslation() {
  const { tCrop } = useLocaleContext();
  return tCrop;
}

export function useLocalizedNumber() {
  const { tNum } = useLocaleContext();
  return tNum;
}

