'use client';

import React from 'react';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  Truck, 
  Wallet, 
  ShieldCheck, 
  Database, 
  PhoneCall, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function LandingPageBody() {
  const { currentLocale } = useLocaleContext();

  const isHindi = currentLocale === 'hi';
  const isMarathi = currentLocale === 'mr';

  // Plain-language copy tailored for smallholder farmers and first-time users
  const copy = {
    stats: {
      s1Val: '500+',
      s1Label: isHindi ? 'किसान जुड़े हैं' : isMarathi ? 'शेतकरी जोडले आहेत' : 'Farmers Selling',
      s1Sub: isHindi ? 'महाराष्ट्र, मध्य प्रदेश और गुजरात' : isMarathi ? 'महाराष्ट्र, मध्य प्रदेश आणि गुजरात' : 'Active across 15+ Mandis',

      s2Val: '₹1.42 Cr+',
      s2Label: isHindi ? 'सीधे किसानों को भुगतान' : isMarathi ? 'शेतकऱ्यांना थेट मिळालेले पैसे' : 'Paid Directly to Farmers',
      s2Sub: isHindi ? '१००% समय पर बैंक में' : isMarathi ? '१००% वेळेवर बँक खात्यात' : '100% On-Time Bank Payout',

      s3Val: '35%',
      s3Label: isHindi ? 'भाड़े में बचत' : isMarathi ? 'वाहतूक भाड्यात बचत' : 'Saved on Transport',
      s3Sub: isHindi ? 'साझा ट्रक से ढुलाई' : isMarathi ? 'एकत्रित ट्रक वाहतूक' : 'Shared truck pickup',

      s4Val: '100%',
      s4Label: isHindi ? 'सुरक्षित भुगतान गारंटी' : isMarathi ? 'पेमेंटची पक्की हमी' : 'Safe Payment Guarantee',
      s4Sub: isHindi ? 'माल निकलने से पहले बैंक में जमा' : isMarathi ? 'माल निघण्यापूर्वी बँकेत जमा' : 'Buyer pays before pickup',
    },

    pipeline: {
      badge: isHindi ? 'सरल ६-चरणीय प्रक्रिया' : isMarathi ? 'सोपी ६-टप्प्यांची पद्धत' : 'Simple 6-Step Process',
      title: isHindi ? 'खेत से सीधे बैंक खाते तक' : isMarathi ? 'शेतापासून थेट बँक खात्यात' : 'From Your Farm to Bank Account',
      titleHighlight: isHindi ? 'पैसा पाने का आसान तरीका' : isMarathi ? 'पैसे मिळवण्याचा सोपा मार्ग' : 'How Selling Works',
      subtitle: isHindi 
        ? 'बिना किसी दलाल के, बिना किसी अग्रिम फीस के, सीधे अपनी भाषा में फसल बेचें।'
        : isMarathi
        ? 'दलालांशिवाय, कोणतीही फी न भरता, आपल्या स्वतःच्या भाषेत पीक विका.'
        : 'Sell your harvest with fair prices, shared transport, and 100% safe bank payment.',
      
      steps: [
        {
          num: '01',
          badge: isHindi ? 'व्हाट्सएप' : isMarathi ? 'व्हॉट्सॲप' : 'WhatsApp',
          title: isHindi ? 'फोटो और मात्रा भेजें' : isMarathi ? 'फोटो आणि वजन पाठवा' : 'Send Photo on WhatsApp',
          desc: isHindi 
            ? 'अपने फोन से फसल का फोटो खींचें और हमारे व्हाट्सएप नंबर पर भेजें। कोई फॉर्म या ऐप नहीं।'
            : isMarathi
            ? 'फोनवरून पिकाचा फोटो काढून आमच्या व्हॉट्सॲपवर पाठवा. फॉर्म किंवा ॲपची गरज नाही.'
            : 'Take a clear photo of your harvest and message our WhatsApp number. No new app needed.',
          icon: MessageSquare,
          color: 'text-emerald-300',
          bg: 'bg-emerald-500/20 text-emerald-300',
          borderColor: 'border-emerald-700/60',
        },
        {
          num: '02',
          badge: isHindi ? 'गुणवत्ता जांच' : isMarathi ? 'गुणवत्ता तपासणी' : 'Quality Check',
          title: isHindi ? 'तुरंत ग्रेड प्रमाणपत्र पाएं' : isMarathi ? 'लगेच ग्रेड प्रमाणपत्र मिळवा' : 'Instant Quality Grade',
          desc: isHindi
            ? 'हमारा कैमरा सिस्टम सेकंडों में फसल की गुणवत्ता जांचकर सही ग्रेड (A, B, C) देता है।'
            : isMarathi
            ? 'सिस्टम सेकंदात पिकाची तपासणी करून फोनवरच अधिकृत ग्रेड (A, B, C) दाखवते.'
            : 'Our smart camera checks quality in seconds and gives you an instant Grade certificate.',
          icon: CheckCircle2,
          color: 'text-amber-300',
          bg: 'bg-amber-500/20 text-amber-300',
          borderColor: 'border-amber-500/40 shadow-lg shadow-amber-500/5',
        },
        {
          num: '03',
          badge: isHindi ? 'सरकारी मंडी भाव' : isMarathi ? 'सरकारी बाजारभाव' : 'Live Mandi Rate',
          title: isHindi ? 'आज का असली भाव देखें' : isMarathi ? 'आजचा खरा बाजारभाव पहा' : 'See Real Mandi Prices',
          desc: isHindi
            ? 'सरकारी मंडियों के लाइव भाव देखें और जानें कि फसल तुरंत बेचनी चाहिए या रुकना चाहिए।'
            : isMarathi
            ? 'थेट सरकारी बाजारभाव पहा आणि पीक आत्ता विकायचे की थांबायचे ते समजून घ्या.'
            : 'See live government mandi rates so traders cannot underpay you for your crop.',
          icon: TrendingUp,
          color: 'text-teal-300',
          bg: 'bg-teal-500/20 text-teal-300',
          borderColor: 'border-emerald-700/60',
        },
        {
          num: '04',
          badge: isHindi ? 'बैंक सुरक्षा' : isMarathi ? 'बँक सुरक्षा' : 'Bank Safety',
          title: isHindi ? 'खरीदार १००% पैसा जमा करता है' : isMarathi ? 'खरेदीदार १००% पैसे भरतो' : '100% Money Locked in Bank',
          desc: isHindi
            ? 'ट्रक आपके खेत पर आने से पहले खरीदार पूरा पैसा सुरक्षित बैंक खाते में जमा करता है।'
            : isMarathi
            ? 'गाडी शेतात येण्यापूर्वी खरेदीदार पूर्ण पैसे सुरक्षित बँक खात्यात जमा करतो.'
            : 'The buyer deposits full payment into a safe bank account before the truck arrives.',
          icon: Lock,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20 text-amber-400',
          borderColor: 'border-emerald-700/60',
        },
        {
          num: '05',
          badge: isHindi ? 'साझा ट्रक' : isMarathi ? 'एकत्रित वाहतूक' : 'Shared Truck',
          title: isHindi ? 'खेत से माल उठान' : isMarathi ? 'शेतातून माल पिक-अप' : 'Farmgate Truck Pickup',
          desc: isHindi
            ? 'आसपास के किसानों के साथ साझा ट्रक से माल उठान होता है, जिससे भाड़े में ३५% बचत होती है।'
            : isMarathi
            ? 'शेजारील शेतकऱ्यांसोबत एकत्र ट्रक येतो, ज्यामुळे वाहतूक भाड्यात ३५% बचत होते.'
            : 'A shared truck picks up produce directly from your farm, saving you ~35% on transport.',
          icon: Truck,
          color: 'text-teal-300',
          bg: 'bg-teal-500/20 text-teal-300',
          borderColor: 'border-emerald-700/60',
        },
        {
          num: '06',
          badge: isHindi ? 'तुरंत भुगतान' : isMarathi ? 'थेट बँक पैसे' : 'Instant Payout',
          title: isHindi ? 'सीधे बैंक में पैसा पाएं' : isMarathi ? 'थेट खात्यात पैसे मिळवा' : 'Direct Bank Payout',
          desc: isHindi
            ? 'डिलीवरी पर ओटीपी कोड साझा करते ही पूरा पैसा तुरंत आपके बैंक खाते में पहुंच जाता है।'
            : isMarathi
            ? 'माल पोहोचल्यावर ओटीपी कोड देताच पूर्ण पैसे थेट बँक खात्यात जमा होतात.'
            : 'Share the 4-digit code on delivery, and money is deposited instantly into your bank.',
          icon: Wallet,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20 text-emerald-400',
          borderColor: 'border-emerald-700/60',
        },
      ]
    },

    trust: {
      tag: isHindi ? 'पूरी सुरक्षा और विश्वास' : isMarathi ? 'पूर्ण सुरक्षितता आणि विश्वास' : 'Safe by Design',
      title: isHindi ? 'हर स्तर पर आपकी सुरक्षा' : isMarathi ? 'प्रत्येक टप्प्यावर तुमची सुरक्षितता' : 'Built to Protect Every Farmer',
      subtitle: isHindi 
        ? 'आपकी फसल, सही भाव और सुरक्षित भुगतान के लिए चार मजबूत सुरक्षा कवच।'
        : isMarathi
        ? 'आपला शेतमाल, खरा भाव आणि सुरक्षित पेमेंटसाठी ४ स्तरांचे सुरक्षा कवच.'
        : 'Four layers of protection keeping your produce, prices, and payments completely secure.',
      
      points: [
        {
          title: isHindi ? 'सत्यापित पहचान' : isMarathi ? 'पडताळणी ओळख' : 'Verified ID',
          sub: 'DigiLocker KYC',
          desc: isHindi 
            ? 'केवल सत्यापित कंपनियों और खरीदारों को बेचें। किसी अज्ञात दलाल से कोई लेनदेन नहीं।'
            : isMarathi
            ? 'फक्त पडताळणी केलेल्या कंपन्यांना विका. अनोळखी दलालांशी कोणताही व्यवहार नाही.'
            : 'Sell only to verified buyers and companies. No unknown middlemen.',
          icon: ShieldCheck,
          color: 'text-emerald-300',
          bg: 'bg-emerald-500/20',
        },
        {
          title: isHindi ? 'सुरक्षित बैंक भुगतान' : isMarathi ? 'सुरक्षित बँक पेमेंट' : 'Safe Bank Deposit',
          sub: 'RBI-Compliant Escrow',
          desc: isHindi 
            ? 'ट्रक आने से पहले खरीदार का पूरा पैसा बैंक में जमा होता है। पैसे डूबने का शून्य जोखिम।'
            : isMarathi
            ? 'गाडी येण्यापूर्वी खरेदीदाराचे पूर्ण पैसे बँकेत जमा असतात. पैसे बुडण्याचा शून्य धोका.'
            : 'Buyer money is safely locked in the bank before pickup. Zero payment default risk.',
          icon: Lock,
          color: 'text-amber-300',
          bg: 'bg-amber-500/20',
        },
        {
          title: isHindi ? 'असली सरकारी भाव' : isMarathi ? 'खरे सरकारी भाव' : 'Real Mandi Rates',
          sub: 'AGMARKNET Live Feed',
          desc: isHindi 
            ? 'सरकारी मंडियों से सीधे अपडेट होने वाले वास्तविक भाव, ताकि कोई आपको कम दाम न दे सके।'
            : isMarathi
            ? 'सरकारी मंडयांमधून थेट मिळणारे खरे भाव, जेणेकरून कोणीही कमी भाव पाडू शकत नाही.'
            : 'Official government mandi rates updated live so you always know your crop\'s real value.',
          icon: Database,
          color: 'text-teal-300',
          bg: 'bg-teal-500/20',
        },
        {
          title: isHindi ? '२४ घंटे फोन सहायता' : isMarathi ? '२४ तास मोफत मदत' : '24/7 Phone Support',
          sub: 'Voice & Chat Support',
          desc: isHindi 
            ? 'अपनी भाषा में फोन और व्हाट्सएप पर किसी भी समय मुफ्त सहायता और मार्गदर्शन।'
            : isMarathi
            ? 'आपल्या स्वतःच्या भाषेत फोन आणि व्हॉट्सॲपवर कोणत्याही वेळी मोफत मार्गदर्शन.'
            : 'Call or WhatsApp our agricultural team anytime in your preferred language.',
          icon: PhoneCall,
          color: 'text-purple-300',
          bg: 'bg-purple-500/20',
        },
      ]
    },

    banner: {
      title: isHindi ? 'क्या आप आज सही दाम पर फसल बेचना चाहते हैं?' : isMarathi ? 'आजच योग्य भावात पीक विकायचे आहे का?' : 'Ready to sell your crop at a fair price?',
      subtitle: isHindi 
        ? 'किसानों के लिए बिल्कुल मुफ्त। व्हाट्सएप पर ३० सेकंड में शुरू करें।'
        : isMarathi
        ? 'शेतकऱ्यांसाठी पूर्णपणे मोफत. व्हॉट्सॲपवर ३० सेकंदात सुरू करा.'
        : 'Free for farmers on WhatsApp. No app to download. Money safe in bank.',
      farmerBtn: isHindi ? 'व्हाट्सएप पर शुरू करें' : isMarathi ? 'व्हॉट्सॲपवर सुरू करा' : 'Start on WhatsApp',
      buyerBtn: isHindi ? 'मैं खरीदार हूँ →' : isMarathi ? 'मी खरेदीदार आहे →' : 'I am a Buyer →',
    }
  };

  return (
    <div id="landing-body" className="w-full bg-emerald-950 text-white font-sans">
      
      {/* 1. SOCIAL PROOF & METRICS BAR (Immediately below Hero with Plain-Language Labels) */}
      <section className="border-y border-emerald-800/60 bg-emerald-900/30 backdrop-blur-md py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              
              {/* Metric 1 */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-900/20 border border-emerald-800/40">
                <div className="font-display text-4xl sm:text-5xl font-black text-amber-400">
                  {copy.stats.s1Val}
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-tight">
                  {copy.stats.s1Label}
                </div>
                <div className="text-xs text-emerald-300/80 font-medium">
                  {copy.stats.s1Sub}
                </div>
              </div>

              {/* Metric 2 */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-900/20 border border-emerald-800/40">
                <div className="font-display text-4xl sm:text-5xl font-black text-emerald-400">
                  {copy.stats.s2Val}
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-tight">
                  {copy.stats.s2Label}
                </div>
                <div className="text-xs text-emerald-300/80 font-medium">
                  {copy.stats.s2Sub}
                </div>
              </div>

              {/* Metric 3: Saved on Transport (Easy for farmers!) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-900/20 border border-emerald-800/40">
                <div className="font-display text-4xl sm:text-5xl font-black text-teal-300">
                  {copy.stats.s3Val}
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-tight">
                  {copy.stats.s3Label}
                </div>
                <div className="text-xs text-emerald-300/80 font-medium">
                  {copy.stats.s3Sub}
                </div>
              </div>

              {/* Metric 4 */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-900/20 border border-emerald-800/40">
                <div className="font-display text-4xl sm:text-5xl font-black text-amber-300">
                  {copy.stats.s4Val}
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-tight">
                  {copy.stats.s4Label}
                </div>
                <div className="text-xs text-emerald-300/80 font-medium">
                  {copy.stats.s4Sub}
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. CORE TRANSACTION ARCHITECTURE (Consolidated 6-Step Farmer Pipeline) */}
      <section id="workflow" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <ScrollReveal>
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-mono font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
              <Sparkles size={13} />
              <span>{copy.pipeline.badge}</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {copy.pipeline.title} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">
                {copy.pipeline.titleHighlight}
              </span>
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto mt-2 font-normal leading-relaxed">
              {copy.pipeline.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 6-Card Grid with Clear Step Numbers & Plain Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {copy.pipeline.steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.num} delayMs={idx * 80}>
                <div className={`h-full p-6 sm:p-7 rounded-3xl bg-emerald-900/40 border ${step.borderColor} hover:bg-emerald-900/60 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`h-12 w-12 rounded-2xl ${step.bg} border border-emerald-500/30 flex items-center justify-center shadow-inner`}>
                        <Icon className="w-6 h-6"/>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-amber-300 border border-emerald-700">
                          {step.badge}
                        </span>
                        <span className="text-xl font-black font-mono text-emerald-400">
                          {step.num}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-400 font-bold font-mono">
                    <span>100% Verified</span>
                    <ArrowRight className="w-4 h-4 text-amber-300"/>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. SAFE BY DESIGN (Compliance & Security Grid) */}
      <section id="security" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-emerald-800/50">
        <ScrollReveal>
          <div className="text-center mb-14 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-mono font-bold bg-emerald-900/80 text-teal-300 border border-emerald-700/60">
              🛡️ {copy.trust.tag}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              {copy.trust.title}
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto mt-2 font-normal leading-relaxed">
              {copy.trust.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.trust.points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <ScrollReveal key={pt.title} delayMs={idx * 100}>
                <div className="h-full p-6 rounded-3xl bg-emerald-900/30 border border-emerald-800/60 space-y-3.5 shadow-lg">
                  <div className={`h-12 w-12 rounded-2xl ${pt.bg} border border-emerald-500/30 flex items-center justify-center ${pt.color} shadow-inner`}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      {pt.sub}
                    </span>
                    <h4 className="font-bold text-white text-base sm:text-lg font-display">
                      {pt.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mt-1.5 font-normal">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 4. DUAL-ROLE CONVERSION BANNER */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 border border-emerald-700/80 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {copy.banner.title}
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl font-normal leading-relaxed">
                {copy.banner.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto shrink-0">
              <a
                href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-400/25 transition-all transform hover:scale-[1.03] cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-slate-950"/> 
                <span>{copy.banner.farmerBtn}</span>
              </a>
              <Link
                href="/buyer/dashboard"
                className="px-6 py-4 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base border border-emerald-600/70 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{copy.banner.buyerBtn}</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
