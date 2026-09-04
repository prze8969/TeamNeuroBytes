'use client';

import React from 'react';
import { ShieldCheck, LineChart, Lock, Landmark } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';

export function Slide3Trust() {
  const { currentLocale } = useLocaleContext();

  const getTitle = () => {
    switch (currentLocale) {
      case 'hi': return 'क्या कृषि नीति पर फसल बेचना सुरक्षित है?';
      case 'mr': return 'कृषी नीतीवर पीक विकणे सुरक्षित आहे का?';
      case 'pa': return 'ਕੀ ਕ੍ਰਿਸ਼ੀ ਨੀਤੀ ਤੇ ਫ਼ਸਲ ਵੇਚਣਾ ਸੁਰੱਖਿਅਤ ਹੈ?';
      case 'gu': return 'શું કૃષિ નીતિ પર પાક વેચવો સુરક્ષિત છે?';
      case 'ta': return 'கிருஷி நீதியில் பயிர் விற்பது பாதுகாப்பானதா?';
      case 'te': return 'కృషి నీతిలో పంట అమ్మడం సురక్షితమేనా?';
      case 'kn': return 'ಕೃಷಿ ನೀತಿಯಲ್ಲಿ ಬೆಳೆ ಮಾರಾಟ ಸುರಕ್ಷಿತವೇ?';
      default: return 'Is it safe to sell on Krishi Niti?';
    }
  };

  const getSubtitle = () => {
    switch (currentLocale) {
      case 'hi': return 'हमने एक ऐसा मंच बनाया है जहाँ किसान हमेशा सुरक्षित हैं। कोई बिचौलिया कमीशन नहीं लेता, और भुगतान की पूरी सुरक्षा होती है।';
      case 'mr': return 'आम्ही असे व्यासपीठ तयार केले आहे जिथे शेतकरी नेहमी सुरक्षित राहतात. कोणतीही मध्यस्थ दलाली नाही आणि पैसे मिळण्याची पूर्ण हमी.';
      case 'pa': return 'ਅਸੀਂ ਅਜਿਹਾ ਪਲੇਟਫਾਰਮ ਬਣਾਇਆ ਹੈ ਜਿੱਥੇ ਕਿਸਾਨ ਹਮੇਸ਼ਾ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੇ ਹਨ। ਕੋਈ ਵਿਚੋਲਾ ਨਹੀਂ ਅਤੇ ਭੁਗਤਾਨ ਦੀ ਪੂਰੀ ਗਾਰੰਟੀ।';
      case 'gu': return 'અમે એવું પ્લેટફોર્મ બનાવ્યું છે જ્યાં ખેડૂત હંમેશા સુરક્ષિત છે. કોઈ વચેટિયા કમિશન નથી અને ચુકવણીની સંપૂર્ણ ખાતરી.';
      case 'ta': return 'விவசாயிகள் எப்போதும் பாதுகாக்கப்படும் ஒரு தளத்தை நாங்கள் உருவாக்கியுள்ளோம். இடைத்தரகர்கள் இல்லை, பணம் பாதுகாப்பாக கிடைக்கும்.';
      case 'te': return 'రైతులు ఎల్లప్పుడూ సురక్షితంగా ఉండే ప్లాట్‌ఫామ్‌ను మేము రూపొందించాము. దళారులు లేరు మరియు చెల్లింపుల పూర్తి భద్రత.';
      case 'kn': return 'ರೈತರು ಯಾವಾಗಲೂ ಸುರಕ್ಷಿತವಾಗಿರುವ ವೇದಿಕೆಯನ್ನು ನಾವು ನಿರ್ಮಿಸಿದ್ದೇವೆ. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ ಮತ್ತು ಪಾವತಿಯ ಸಂಪೂರ್ಣ ಭದ್ರತೆ.';
      default: return 'We built a platform where farmers are always protected. No middlemen taking huge cuts, and no uncertainty about getting paid.';
    }
  };

  const pillars = [
    {
      title: currentLocale === 'hi' ? 'सत्यापित खरीदार' : currentLocale === 'mr' ? 'पडताळलेले खरेदीदार' : currentLocale === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ' : currentLocale === 'gu' ? 'ચકાસાયેલ ખરીદદારો' : currentLocale === 'ta' ? 'சரிபார்க்கப்பட்ட வாங்குபவர்கள்' : currentLocale === 'te' ? 'ధృవీకరించబడిన కొనుగోలుదారులు' : currentLocale === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು' : 'Verified Buyers',
      desc: currentLocale === 'hi' ? 'केवल सत्यापित और विश्वसनीय व्यापारी ही खरीद सकते हैं।' : currentLocale === 'mr' ? 'केवळ पडताळणी झालेले व्यापारीच खरेदी करू शकतात.' : currentLocale === 'pa' ? 'ਸਿਰਫ਼ ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ ਹੀ ਖਰੀਦ ਸਕਦੇ ਹਨ।' : currentLocale === 'gu' ? 'માત્ર ચકાસાયેલ વેપારીઓ જ ખરીદી શકે છે.' : currentLocale === 'ta' ? 'சரிபார்க்கப்பட்ட நபர்கள் மட்டுமே வாங்க முடியும்.' : currentLocale === 'te' ? 'ధృవీకరించబడిన వ్యాపారులు మాత్రమే కొనుగోలు చేయగలరు.' : currentLocale === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ವ್ಯಾಪಾರಿಗಳು ಮಾತ್ರ ಖರೀದಿಸಬಹುದು.' : 'Only verified participants can purchase.',
      icon: <ShieldCheck size={32} className="text-amber-400" />
    },
    {
      title: currentLocale === 'hi' ? 'पारदर्शी भाव' : currentLocale === 'mr' ? 'पारदर्शक भाव' : currentLocale === 'pa' ? 'ਪਾਰਦਰਸ਼ੀ ਮੁੱਲ' : currentLocale === 'gu' ? 'પારદર્શક ભાવો' : currentLocale === 'ta' ? 'வெளிப்படையான விலைகள்' : currentLocale === 'te' ? 'పారదర్శక ధరలు' : currentLocale === 'kn' ? 'ಪಾರದರ್ಶಕ ಬೆಲೆಗಳು' : 'Transparent Prices',
      desc: currentLocale === 'hi' ? 'लाइव मंडी भाव किसानों को सही और उचित मूल्य जानने में मदद करते हैं।' : currentLocale === 'mr' ? 'थेट बाजारभाव शेतकऱ्यांना योग्य भाव समजण्यास मदत करतात.' : currentLocale === 'pa' ? 'ਲਾਈਵ ਮੰਡੀ ਭਾਅ ਕਿਸਾਨਾਂ ਨੂੰ ਸਹੀ ਮੁੱਲ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।' : currentLocale === 'gu' ? 'લાઇવ માર્કેટ ભાવો ખેડૂતોને યોગ્ય ભાવ સમજવામાં મદદ કરે છે.' : currentLocale === 'ta' ? 'நேரடி சந்தை விலைகள் விவசாயிகளுக்கு நியாயமான மதிப்பை அறிய உதவுகின்றன.' : currentLocale === 'te' ? 'ప్రత్యక్ష మార్కెట్ ధరలు రైతులకు సరైన విలువను తెలుసుకోవడంలో సహాయపడతాయి.' : currentLocale === 'kn' ? 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರಗಳು ರೈತರಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆ ತಿಳಿಯಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.' : 'Live mandi rates help farmers understand fair value.',
      icon: <LineChart size={32} className="text-teal-400" />
    },
    {
      title: currentLocale === 'hi' ? 'सुरक्षित भुगतान' : currentLocale === 'mr' ? 'सुरक्षित देयक' : currentLocale === 'pa' ? 'ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ' : currentLocale === 'gu' ? 'સુરક્ષિત ચુકવણી' : currentLocale === 'ta' ? 'பாதுகாப்பான கட்டணம்' : currentLocale === 'te' ? 'సురక్షిత చెల్లింపు' : currentLocale === 'kn' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿ' : 'Secure Payment',
      desc: currentLocale === 'hi' ? 'फसल उठने से पहले खरीदार का भुगतान सुरक्षित एस्क्रो में जमा होता है।' : currentLocale === 'mr' ? 'पीक उचलण्यापूर्वी खरेदीदाराचे पैसे एस्क्रोमध्ये सुरक्षित ठेवले जातात.' : currentLocale === 'pa' ? 'ਫ਼ਸਲ ਚੁੱਕਣ ਤੋਂ ਪਹਿਲਾਂ ਖਰੀਦਦਾਰ ਦਾ ਭੁਗਤਾਨ ਸੁਰੱਖਿਅਤ ਹੁੰਦਾ ਹੈ।' : currentLocale === 'gu' ? 'પાક ઉપાડતા પહેલા ખરીદદારની ચુકવણી સુરક્ષિત કરવામાં આવે છે.' : currentLocale === 'ta' ? 'பயிர் எடுப்பதற்கு முன் வாங்குபவரின் கட்டணம் பாதுகாக்கப்படுகிறது.' : currentLocale === 'te' ? 'పంట లోడింగ్‌కు ముందే కొనుగోలుదారు చెల్లింపు సురక్షితం చేయబడుతుంది.' : currentLocale === 'kn' ? 'ಬೆಳೆ ಸಾಗಣೆಗೆ ಮುಂಚಿತವಾಗಿ ಖರೀದಿದಾರರ ಪಾವತಿಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗುತ್ತದೆ.' : 'Buyer payment is secured before pickup.',
      icon: <Lock size={32} className="text-emerald-400" />
    },
    {
      title: currentLocale === 'hi' ? 'सीधे बैंक खाते में' : currentLocale === 'mr' ? 'थेट बँक खात्यात' : currentLocale === 'pa' ? 'ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ' : currentLocale === 'gu' ? 'સીધા બેંક ખાતામાં' : currentLocale === 'ta' ? 'நேரடி வங்கி கணக்கில்' : currentLocale === 'te' ? 'నేరుగా బ్యాంక్ ఖాతాలో' : currentLocale === 'kn' ? 'ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ' : 'Direct Bank Payout',
      desc: currentLocale === 'hi' ? 'पैसे बिना किसी कटौती के सीधे किसान के खाते में जमा होते हैं।' : currentLocale === 'mr' ? 'पैसे कोणत्याही विलंबाशिवाय थेट शेतकऱ्याच्या खात्यात जमा होतात.' : currentLocale === 'pa' ? 'ਪੈਸੇ ਬਿਨਾਂ ਕਿਸੇ ਕਟੌਤੀ ਦੇ ਸਿੱਧੇ ਕਿਸਾਨ ਦੇ ਖਾਤੇ ਵਿੱਚ ਜਾਂਦੇ ਹਨ।' : currentLocale === 'gu' ? 'પૈસા કોઈપણ કપાત વગર સીધા ખેડૂતના ખાતામાં પહોંચે છે.' : currentLocale === 'ta' ? 'பணம் நேரடியாக விவசாயியின் வங்கிக் கணக்கிற்குச் செல்கிறது.' : currentLocale === 'te' ? 'డబ్బు నేరుగా రైతు బ్యాంకు ఖాతాకు చేరుతుంది.' : currentLocale === 'kn' ? 'ಹಣವು ನೇರವಾಗಿ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಆಗುತ್ತದೆ.' : 'Money goes directly to the farmer.',
      icon: <Landmark size={32} className="text-amber-400" />
    }
  ];

  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#030d07] relative px-6 py-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left: Section Header */}
        <div className="text-center lg:text-left max-w-lg">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            {getTitle()}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mt-6 mx-auto lg:mx-0 rounded-full" />
          <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed">
            {getSubtitle()}
          </p>
        </div>

        {/* Right: Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-[#061e13] border border-emerald-800/40 p-6 rounded-3xl flex flex-col items-start hover:border-amber-400/30 transition-colors shadow-lg">
              <div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-5">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-display">
                {pillar.title}
              </h3>
              <p className="text-emerald-100/60 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
