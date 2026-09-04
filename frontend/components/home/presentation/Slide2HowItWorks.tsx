'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, CheckCircle, Handshake, Truck, IndianRupee } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';

export function Slide2HowItWorks() {
  const { currentLocale } = useLocaleContext();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getSlideTitle = () => {
    switch (currentLocale) {
      case 'hi': return 'बिक्री कैसे काम करती है';
      case 'mr': return 'विक्री कशी चालते';
      case 'pa': return 'ਫ਼ਸਲ ਵੇਚਣ ਦੀ ਪ੍ਰਕਿਰਿਆ';
      case 'gu': return 'વેચાણ કેવી રીતે કાર્ય કરે છે';
      case 'ta': return 'விற்பனை எப்படி செயல்படுகிறது';
      case 'te': return 'అమ్మకం ఎలా పనిచేస్తుంది';
      case 'kn': return 'ಮಾರಾಟ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ';
      default: return 'How selling works';
    }
  };

  const steps = [
    {
      num: '01',
      title: currentLocale === 'hi' ? 'लिस्ट करें' : currentLocale === 'mr' ? 'नोंदणी करा' : currentLocale === 'pa' ? 'ਸੂਚੀਬੱਧ ਕਰੋ' : currentLocale === 'gu' ? 'યાદી કરો' : currentLocale === 'ta' ? 'பட்டியலிடுங்கள்' : currentLocale === 'te' ? 'జాబితా చేయండి' : currentLocale === 'kn' ? 'ಪಟ್ಟಿ ಮಾಡಿ' : 'LIST',
      desc: currentLocale === 'hi' ? 'व्हाट्सएप के जरिए फसल की फोटो भेजें।' : currentLocale === 'mr' ? 'व्हॉट्सअ‍ॅपवर पिकाचा फोटो पाठवा.' : currentLocale === 'pa' ? 'ਵਟਸਐਪ ਰਾਹੀਂ ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਭੇਜੋ।' : currentLocale === 'gu' ? 'વોટ્સએપ દ્વારા પાકનો ફોટો મોકલો.' : currentLocale === 'ta' ? 'வாட்ஸ்அப் மூலம் பயிர் புகைப்படத்தை அனுப்பவும்.' : currentLocale === 'te' ? 'వాట్సాప్ ద్వారా పంట ఫోటో పంపండి.' : currentLocale === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಬೆಳೆಯ ಫೋಟೋ ಕಳುಹಿಸಿ.' : 'Send crop photo through WhatsApp.',
      icon: <Smartphone size={28} className="text-amber-400" />
    },
    {
      num: '02',
      title: currentLocale === 'hi' ? 'वेरीफाई' : currentLocale === 'mr' ? 'पडताळणी' : currentLocale === 'pa' ? 'ਪੜਤਾਲ' : currentLocale === 'gu' ? 'ચકાસણી' : currentLocale === 'ta' ? 'சரிபார்ப்பு' : currentLocale === 'te' ? 'ధృవీకరణ' : currentLocale === 'kn' ? 'ಪರಿಶೀಲನೆ' : 'VERIFY',
      desc: currentLocale === 'hi' ? 'गुणवत्ता और सटीक बाजार भाव की जांच होती है।' : currentLocale === 'mr' ? 'गुणवत्ता आणि बाजारभावाची पडताळणी केली जाते.' : currentLocale === 'pa' ? 'ਗੁਣਵੱਤਾ ਅਤੇ ਕੀਮਤ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।' : currentLocale === 'gu' ? 'ગુણવત્તા અને ભાવ તપાસવામાં આવે છે.' : currentLocale === 'ta' ? 'தரம் மற்றும் விலை சரிபார்க்கப்படுகிறது.' : currentLocale === 'te' ? 'నాణ్యత మరియు ధర తనిખీ చేయబడతాయి.' : currentLocale === 'kn' ? 'ಗುಣಮಟ್ಟ ಮತ್ತು ಬೆಲೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.' : 'Quality and price are checked.',
      icon: <CheckCircle size={28} className="text-emerald-400" />
    },
    {
      num: '03',
      title: currentLocale === 'hi' ? 'मैच' : currentLocale === 'mr' ? 'जुळवणी' : currentLocale === 'pa' ? 'ਮੇਲ' : currentLocale === 'gu' ? 'મેળ' : currentLocale === 'ta' ? 'பொருத்தம்' : currentLocale === 'te' ? 'మ్యాచ్' : currentLocale === 'kn' ? 'ಹೊಂದಾಣಿಕೆ' : 'MATCH',
      desc: currentLocale === 'hi' ? 'सत्यापित और उचित खरीदार से संपर्क होता है।' : currentLocale === 'mr' ? 'योग्य आणि पडताळणी झालेल्या खरेदीदाराशी जोडा.' : currentLocale === 'pa' ? 'ਢੁਕਵੇਂ ਖਰੀਦਦਾਰ ਨਾਲ ਸੰਪਰਕ ਬਣਾਓ।' : currentLocale === 'gu' ? 'યોગ્ય ખરીદદાર સાથે સંપર્ક સ્થાપિત થાય છે.' : currentLocale === 'ta' ? 'பொருத்தமான வாங்குபவருடன் இணையுங்கள்.' : currentLocale === 'te' ? 'సరైన కొనుగోలుదారుతో కనెక్ట్ అవ్వండి.' : currentLocale === 'kn' ? 'ಸೂಕ್ತ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.' : 'Connect with a suitable buyer.',
      icon: <Handshake size={28} className="text-teal-400" />
    },
    {
      num: '04',
      title: currentLocale === 'hi' ? 'पिकअप' : currentLocale === 'mr' ? 'वाहतूक' : currentLocale === 'pa' ? 'ਚੁੱਕਣਾ' : currentLocale === 'gu' ? 'પિકઅપ' : currentLocale === 'ta' ? 'பிக்கப்' : currentLocale === 'te' ? 'పికప్' : currentLocale === 'kn' ? 'ಪಿಕಪ್' : 'PICKUP',
      desc: currentLocale === 'hi' ? 'परिवहन और वाहन का समन्वय किया जाता है।' : currentLocale === 'mr' ? 'वाहतूक आणि वाहनाचे समन्वय केले जाते.' : currentLocale === 'pa' ? 'ਆਵਾਜਾਈ ਦਾ ਪ੍ਰਬੰਧ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।' : currentLocale === 'gu' ? 'વાહનવ્યવહારનું સંકલન કરવામાં આવે છે.' : currentLocale === 'ta' ? 'போக்குவரத்து ஒருங்கிணைக்கப்படுகிறது.' : currentLocale === 'te' ? 'రవాణా సమన్వయం చేయబడుతుంది.' : currentLocale === 'kn' ? 'ಸಾರಿಗೆಯನ್ನು ಸಂಯೋಜಿಸಲಾಗಿದೆ.' : 'Transport is coordinated.',
      icon: <Truck size={28} className="text-amber-400" />
    },
    {
      num: '05',
      title: currentLocale === 'hi' ? 'पेमेंट' : currentLocale === 'mr' ? 'पैसे' : currentLocale === 'pa' ? 'ਭੁਗਤਾਨ' : currentLocale === 'gu' ? 'ચુકવણી' : currentLocale === 'ta' ? 'பணம்' : currentLocale === 'te' ? 'చెల్లింపు' : currentLocale === 'kn' ? 'ಪಾವತಿ' : 'PAID',
      desc: currentLocale === 'hi' ? 'भुगतान सीधे किसान के बैंक खाते में मिलता है।' : currentLocale === 'mr' ? 'पैसे थेट शेतकऱ्याच्या बँक खात्यात जमा.' : currentLocale === 'pa' ? 'ਭੁਗਤਾਨ ਸਿੱਧਾ ਕਿਸਾਨ ਦੇ ਖਾਤੇ ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ।' : currentLocale === 'gu' ? 'ચુકવણી સીધી ખેડૂતના ખાતામાં જમા થાય છે.' : currentLocale === 'ta' ? 'பணம் நேரடியாக விவசாயியின் கணக்கில் விடுவிக்கப்படுகிறது.' : currentLocale === 'te' ? 'చెల్లింపు నేరుగా రైతు ఖాతాకు విడుదల చేయబడుతుంది.' : currentLocale === 'kn' ? 'ಹಣವನ್ನು ನೇರವಾಗಿ ರೈತರ ಖಾತೆಗೆ ಬಿಡುಗಡೆ ಮಾಡಲಾಗುತ್ತದೆ.' : 'Payment is released directly to the farmer.',
      icon: <IndianRupee size={28} className="text-emerald-400" />
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#04130c] relative px-4 sm:px-6 py-14 md:py-20 overflow-hidden"
    >
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-[#04130c] to-[#04130c] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Slide Header */}
        <div className="text-center mb-10 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
            {getSlideTitle()}
          </h2>
          <div className="w-20 md:w-24 h-1 bg-amber-400 mt-4 md:mt-6 mx-auto rounded-full opacity-80" />
        </div>

        {/* Visual Flow Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 w-full">
          {steps.map((step, idx) => (
            <div 
              key={step.num} 
              className={`flex flex-row md:flex-col items-start md:items-center relative group transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              
              {/* Connector Line (Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-[1px] bg-gradient-to-r from-emerald-800 to-transparent -z-10" />
              )}
              {/* Connector Line (Mobile) */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute top-12 left-6 w-[1px] h-full bg-gradient-to-b from-emerald-800 to-transparent -z-10" />
              )}

              {/* Number & Icon Badge */}
              <div className="relative z-10 shrink-0 mb-0 md:mb-6 mr-6 md:mr-0">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-950/50 border border-emerald-800/60 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-400 text-[#04130c] font-black font-mono text-[10px] md:text-xs px-2 py-0.5 rounded-full">
                  {step.num}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start md:items-center text-left md:text-center mt-2 md:mt-0">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-wide uppercase mb-1">
                  {step.title}
                </h3>
                <p className="text-emerald-100/60 text-sm leading-relaxed max-w-[200px] md:max-w-[180px]">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
