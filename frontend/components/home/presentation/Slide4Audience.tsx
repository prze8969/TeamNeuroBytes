'use client';

import React from 'react';
import { Tractor, Building2 } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';

export function Slide4Audience() {
  const { currentLocale } = useLocaleContext();

  const getTitle = () => {
    switch (currentLocale) {
      case 'hi': return 'यह किसके लिए है?';
      case 'mr': return 'हे कोणासाठी आहे?';
      case 'pa': return 'ਇਹ ਕਿਸ ਲਈ ਹੈ?';
      case 'gu': return 'આ કોના માટે છે?';
      case 'ta': return 'இது யாருக்கானது?';
      case 'te': return 'ఇది ఎవరి కోసం?';
      case 'kn': return 'ಇದು ಯಾರಿಗಾಗಿ?';
      default: return 'Who is it for?';
    }
  };

  const getFarmerData = () => {
    switch (currentLocale) {
      case 'hi':
        return {
          title: 'किसान',
          points: [
            'विश्वसनीय खरीदारों को सीधे बेचें।',
            'मंडी का सटीक भाव जानें।',
            'सुरक्षित और गारंटीड भुगतान प्राप्त करें।',
            'अपनी परिवहन लागत घटाएं।'
          ]
        };
      case 'mr':
        return {
          title: 'शेतकरी',
          points: [
            'विश्वासू खरेदीदारांना थेट विका.',
            'बाजारातील अचूक भाव जाणून घ्या.',
            'सुरक्षित आणि हमीचे पैसे मिळवा.',
            'तुमचा वाहतूक खर्च कमी करा.'
          ]
        };
      case 'pa':
        return {
          title: 'ਕਿਸਾਨ',
          points: [
            'ਭਰੋਸੇਯੋਗ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਸਿੱਧਾ ਵੇਚੋ।',
            'ਮੰਡੀ ਦਾ ਸਹੀ ਮੁੱਲ ਜਾਣੋ।',
            'ਸੁਰੱਖਿਅਤ ਅਤੇ ਗਾਰੰਟੀਸ਼ੁਦਾ ਭੁਗਤਾਨ ਪ੍ਰਾਪਤ ਕਰੋ।',
            'ਆਪਣੇ ਆਵਾਜਾਈ ਦੇ ਖਰਚੇ ਘਟਾਓ।'
          ]
        };
      case 'gu':
        return {
          title: 'ખેડૂતો',
          points: [
            'વિશ્વાસપાત્ર ખરીદદારોને સીધું વેચો.',
            'બજારનો ચોક્કસ ભાવ જાણો.',
            'સુરક્ષિત અને ખાતરીપૂર્વકની ચુકવણી મેળવો.',
            'તમારો પરિવહન ખર્ચ ઘટાડો.'
          ]
        };
      case 'ta':
        return {
          title: 'விவசாயிகள்',
          points: [
            'நம்பகமான வாங்குபவர்களுக்கு நேரடியாக விற்கவும்.',
            'சரியான சந்தை விலையை அறிந்து கொள்ளுங்கள்.',
            'பாதுகாப்பான உத்தரவாத கட்டணத்தைப் பெறுங்கள்.',
            'உங்கள் போக்குவரத்து செலவுகளைக் குறைக்கவும்.'
          ]
        };
      case 'te':
        return {
          title: 'రైతులు',
          points: [
            'విశ్వసనీయ కొనుగోలుదారులకు నేరుగా అమ్మండి.',
            'ఖచ్చితమైన మార్కెట్ ధరను తెలుసుకోండి.',
            'సురక్షితమైన మరియు హామీ చెల్లింపును పొందండి.',
            'మీ రవాణా ఖర్చులను తగ్గించుకోండి.'
          ]
        };
      case 'kn':
        return {
          title: 'ರೈತರು',
          points: [
            'ವಿಶ್ವಾಸಾರ್ಹ ಖರೀದಿದಾರರಿಗೆ ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಿ.',
            'ನಿಖರವಾದ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯನ್ನು ತಿಳಿಯಿರಿ.',
            'ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾತರಿಯ ಪಾವತಿಯನ್ನು ಪಡೆಯಿರಿ.',
            'ನಿಮ್ಮ ಸಾರಿಗೆ ವೆಚ್ಚವನ್ನು ಕಡಿಮೆ ಮಾಡಿ.'
          ]
        };
      default:
        return {
          title: 'Farmers',
          points: [
            'Sell directly to trusted buyers.',
            'Know the exact market price.',
            'Get secure, guaranteed payment.',
            'Reduce your transport costs.'
          ]
        };
    }
  };

  const getBuyerData = () => {
    switch (currentLocale) {
      case 'hi':
        return {
          title: 'खरीदार',
          points: [
            'सत्यापित फसलों की आपूर्ति तुरंत खोजें।',
            'विस्तृत गुणवत्ता रिपोर्ट और ग्रेडिंग देखें।',
            'सत्यापित खेतों से सीधे खरीद करें।',
            'आसानी से पिकअप और लॉजिस्टिक्स का समन्वय करें।'
          ]
        };
      case 'mr':
        return {
          title: 'खरेदीदार',
          points: [
            'पडताळणी केलेल्या पिकांचा पुरवठा त्वरित शोधा.',
            'तपशीलवार गुणवत्ता अहवाल आणि ग्रेडिंग पहा.',
            'थेट पडताळणी केलेल्या शेतातून खरेदी करा.',
            'पिकअप आणि वाहतुकीचे सहज समन्वय करा.'
          ]
        };
      case 'pa':
        return {
          title: 'ਖਰੀਦਦਾਰ',
          points: [
            'ਪ੍ਰਮਾਣਿਤ ਫ਼ਸਲਾਂ ਦੀ ਸਪਲਾਈ ਤੁਰੰਤ ਲੱਭੋ।',
            'ਵਿਸਤ੍ਰਿਤ ਗੁਣਵੱਤਾ ਰਿਪੋਰਟ ਦੇਖੋ।',
            'ਸਿੱਧੇ ਪ੍ਰਮਾਣਿਤ ਖੇਤਾਂ ਤੋਂ ਖਰੀਦ ਕਰੋ।',
            'ਆਸਾਨੀ ਨਾਲ ਲੌਜਿਸਟਿਕਸ ਦਾ ਤਾਲਮੇਲ ਕਰੋ।'
          ]
        };
      case 'gu':
        return {
          title: 'ખરીદદારો',
          points: [
            'ચકાસાયેલ પાકનો પુરવઠો તાત્કાલિક મેળવો.',
            'વિગતવાર ગુણવત્તા અહેવાલ જુઓ.',
            'ચકાસાયેલ ખેતરોમાંથી સીધી ખરીદી કરો.',
            'પિકઅપ અને લોજિસ્ટિક્સનું સરળ સંકલન કરો.'
          ]
        };
      case 'ta':
        return {
          title: 'வாங்குபவர்கள்',
          points: [
            'சரிபார்க்கப்பட்ட பயிர் விநியோகத்தை உடனடியாகக் கண்டறியவும்.',
            'விரிவான தரத் தகவலைப் பார்க்கவும்.',
            'சரிபார்க்கப்பட்ட பண்ணைகளிலிருந்து நேரடியாகப் பெறவும்.',
            'போக்குவரத்தை எளிதாக ஒருங்கிணைக்கவும்.'
          ]
        };
      case 'te':
        return {
          title: 'కొనుగోలుదారులు',
          points: [
            'ధృవీకరించబడిన పంట సరఫరాను తక్షణమే కనుగొనండి.',
            'వివరణాత్మక నాణ్యత సమాచారాన్ని చూడండి.',
            'ధృవీకరించబడిన పొలాల నుండి నేరుగా కొనుగోలు చేయండి.',
            'రవాణాను సులభంగా సమన్వయం చేయండి.'
          ]
        };
      case 'kn':
        return {
          title: 'ಖರೀದಿದಾರರು',
          points: [
            'ಪರಿಶೀಲಿಸಿದ ಬೆಳೆ ಸರಬರಾಜನ್ನು ತಕ್ಷಣವೇ ಹುಡುಕಿ.',
            'ವಿವರವಾದ ಗುಣಮಟ್ಟದ ಮಾಹಿತಿಯನ್ನು ನೋಡಿ.',
            'ಪರಿಶೀಲಿಸಿದ ತೋಟಗಳಿಂದ ನೇರವಾಗಿ ಪಡೆಯಿರಿ.',
            'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಸಂಯೋಜಿಸಿ.'
          ]
        };
      default:
        return {
          title: 'Buyers',
          points: [
            'Find verified crop supply instantly.',
            'See detailed quality information.',
            'Source directly from verified farms.',
            'Coordinate pickup and logistics.'
          ]
        };
    }
  };

  const farmer = getFarmerData();
  const buyer = getBuyerData();

  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center bg-[#04130c] relative pt-16 md:pt-0">
      
      {/* Title above split */}
      <div className="relative md:absolute top-0 md:top-[15vh] left-0 w-full z-20 px-6 py-6 md:py-0 text-center">
         <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            {getTitle()}
         </h2>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full min-h-full md:min-h-[100dvh]">
        
        {/* Left Side: Farmers */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 md:p-16 lg:p-24 relative overflow-hidden bg-gradient-to-br from-[#061e13] to-[#04130c]">
          <div className="relative z-10 w-full max-w-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400">
                <Tractor size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide uppercase">
                {farmer.title}
              </h3>
            </div>
            
            <ul className="space-y-6 text-emerald-100/80 text-lg">
              {farmer.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Buyers */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative overflow-hidden bg-[#030d07]">
          <div className="relative z-10 w-full max-w-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <Building2 size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide uppercase">
                {buyer.title}
              </h3>
            </div>
            
            <ul className="space-y-6 text-emerald-100/80 text-lg">
              {buyer.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
