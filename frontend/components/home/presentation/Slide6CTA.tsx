'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';

export function Slide6CTA() {
  const { currentLocale } = useLocaleContext();

  const getHeading = () => {
    switch (currentLocale) {
      case 'hi':
        return <>क्या आप अपनी फसल सही दाम पर <br className="hidden md:block"/> बेचने के लिए तैयार हैं?</>;
      case 'mr':
        return <>तुमचे पीक योग्य भावात <br className="hidden md:block"/> विकण्यासाठी तयार आहात का?</>;
      case 'pa':
        return <>ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਫ਼ਸਲ ਸਹੀ ਮੁੱਲ ਤੇ <br className="hidden md:block"/> ਵੇਚਣ ਲਈ ਤਿਆਰ ਹੋ?</>;
      case 'gu':
        return <>શું તમે તમારો પાક યોગ્ય ભાવે <br className="hidden md:block"/> વેચવા તૈયાર છો?</>;
      case 'ta':
        return <>உங்கள் பயிரை நியாயமான விலையில் <br className="hidden md:block"/> விற்க தயாரா?</>;
      case 'te':
        return <>మీ పంటను సరైన ధరకు <br className="hidden md:block"/> అమ్మడానికి సిద్ధంగా ఉన్నారా?</>;
      case 'kn':
        return <>ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ನ್ಯಾಯಯುತ ಬೆಲೆಗೆ <br className="hidden md:block"/> ಮಾರಾಟ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?</>;
      default:
        return <>Ready to sell your crop <br className="hidden md:block"/> at a fair price?</>;
    }
  };

  const getSubtitle = () => {
    switch (currentLocale) {
      case 'hi': return 'किसानों के लिए व्हाट्सएप पर पूरी तरह निःशुल्क। कोई ऐप डाउनलोड करने की जरूरत नहीं। सुरक्षित भुगतान।';
      case 'mr': return 'शेतकऱ्यांसाठी व्हॉट्सअ‍ॅपवर पूर्णपणे विनामूल्य. कोणतेही अ‍ॅप डाऊनलोड करण्याची गरज नाही. सुरक्षित देयक.';
      case 'pa': return 'ਕਿਸਾਨਾਂ ਲਈ ਵਟਸਐਪ ਤੇ ਬਿਲਕੁਲ ਮੁਫ਼ਤ। ਕੋਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ।';
      case 'gu': return 'ખેડૂતો માટે વોટ્સએપ પર સંપૂર્ણ મફત. કોઈ એપ ડાઉનલોડ કરવાની જરૂર નથી. સુરક્ષિત ચુકવણી.';
      case 'ta': return 'வாட்ஸ்அப்பில் விவசாயிகளுக்கு முற்றிலும் இலவசம். பயன்பாட்டைப் பதிவிறக்க வேண்டியதில்லை. பாதுகாப்பான கட்டணம்.';
      case 'te': return 'వాట్సాప్‌లో రైతులకు పూర్తిగా ఉచితం. యాప్ డౌన్‌లోడ్ చేయాల్సిన అవసరం లేదు. సురక్షిత చెల్లింపు.';
      case 'kn': return 'ರೈತರಿಗೆ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ಉಚಿತ. ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಸುರಕ್ಷಿತ ಪಾವತಿ.';
      default: return 'Free for farmers on WhatsApp. No app to download. Secure payment.';
    }
  };

  const getWhatsappCta = () => {
    switch (currentLocale) {
      case 'hi': return 'व्हाट्सएप पर शुरू करें';
      case 'mr': return 'व्हॉट्सअ‍ॅपवर सुरू करा';
      case 'pa': return 'ਵਟਸਐਪ ਤੇ ਸ਼ੁਰੂ ਕਰੋ';
      case 'gu': return 'વોટ્સએપ પર શરૂ કરો';
      case 'ta': return 'வாட்ஸ்அப்பில் தொடங்குங்கள்';
      case 'te': return 'వాట్సాప్‌లో ప్రారంభించండి';
      case 'kn': return 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ';
      default: return 'Start on WhatsApp';
    }
  };

  const getBuyerCta = () => {
    switch (currentLocale) {
      case 'hi': return 'मैं खरीदार हूँ';
      case 'mr': return 'मी खरेदीदार आहे';
      case 'pa': return 'ਮੈਂ ਖਰੀਦਦਾਰ ਹਾਂ';
      case 'gu': return 'હું ખરીદદાર છું';
      case 'ta': return 'நான் ஒரு வாங்குபவர்';
      case 'te': return 'నేను కొనుగోలుదారుని';
      case 'kn': return 'ನಾನು ಖರೀದಿದಾರ';
      default: return "I'm a Buyer";
    }
  };

  const getTechLink = () => {
    switch (currentLocale) {
      case 'hi': return 'तकनीकी प्लेटफॉर्म एवं एपीआई';
      case 'mr': return 'तंत्रज्ञान प्लॅटफॉर्म आणि एपीआय';
      case 'pa': return 'ਤਕਨੀਕੀ ਪਲੇਟਫਾਰਮ ਅਤੇ ਏਪੀਆਈ';
      case 'gu': return 'ટેક પ્લેટફોર્મ અને API';
      case 'ta': return 'தொழில்நுட்ப தளம் & API';
      case 'te': return 'సాంకేతిక ప్లాట్‌ఫారమ్ & APIలు';
      case 'kn': return 'ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ ಮತ್ತು APIಗಳು';
      default: return 'Tech Platform & APIs';
    }
  };

  const getLoginLink = () => {
    switch (currentLocale) {
      case 'hi': return 'लॉगिन पोर्टल';
      case 'mr': return 'लॉगिन पोर्टल';
      case 'pa': return 'ਲਾਗਇਨ ਪੋਰਟਲ';
      case 'gu': return 'લૉગિન પોર્ટલ';
      case 'ta': return 'உள்நுழைவு போர்டல்';
      case 'te': return 'లాగిన్ పోర్టల్';
      case 'kn': return 'ಲಾಗಿನ್ ಪೋರ್ಟಲ್';
      default: return 'Login Gateway';
    }
  };

  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-between bg-[#030d07] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />

      {/* Main CTA Content - Centered */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 relative z-10 w-full max-w-4xl mx-auto text-center">
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-xl">
          {getHeading()}
        </h2>
        
        <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12">
          {getSubtitle()}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
          {/* Primary CTA */}
          <a
            href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-[#04130c] font-black text-lg uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
          >
            <MessageSquare size={20} className="fill-[#04130c]" />
            <span>{getWhatsappCta()}</span>
          </a>

          {/* Secondary CTA */}
          <Link
            href="/buyer/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-emerald-700 hover:border-emerald-500 text-white hover:bg-emerald-900/30 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>{getBuyerCta()}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-emerald-900/50 bg-[#020a05] py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-emerald-100/50">
          
          <div className="flex items-center gap-6">
            <KisanSetuLogo size="sm" variant="light" showTagline={false} />
            <span>© 2026 TeamNeuroBytes</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/platform" className="hover:text-amber-400 transition-colors uppercase tracking-widest">
              {getTechLink()}
            </Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors uppercase tracking-widest">
              {getLoginLink()}
            </Link>
          </div>

        </div>
      </footer>

    </section>
  );
}
