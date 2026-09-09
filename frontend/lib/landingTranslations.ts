import { Locale } from '@/i18n/routing';

export interface LandingCopy {
  nav: {
    home: string;
    howItWorks: string;
    features: string;
    security: string;
    help: string;
    forJudges: string;
    signIn: string;
    dashboard: string;
    getStarted: string;
  };
  hero: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    farmerCta: string;
    farmerCtaSub: string;
    buyerLink: string;
    microTrust: string;
  };
  showcaseVisual: {
    step1Title: string;
    step1Sub: string;
    step2Title: string;
    step2Sub: string;
    step3Title: string;
    step3Sub: string;
  };
  stats: {
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
    stat4Val: string;
    stat4Label: string;
  };
  features: {
    tag: string;
    title: string;
    subtitle: string;
    f1Title: string;
    f1Sub: string;
    f1Detail: string;
    f2Title: string;
    f2Sub: string;
    f2Detail: string;
    f3Title: string;
    f3Sub: string;
    f3Detail: string;
  };
  workflow: {
    badge: string;
    title1: string;
    titleHighlight: string;
    subtitle: string;
    steps: Array<{
      step: string;
      badge: string;
      title: string;
      description: string;
    }>;
    bannerTitle: string;
    bannerSub: string;
    bannerCta: string;
  };
  trust: {
    tag: string;
    title: string;
    subtitle: string;
    t1Title: string;
    t1Desc: string;
    t2Title: string;
    t2Desc: string;
    t3Title: string;
    t3Desc: string;
    t4Title: string;
    t4Desc: string;
  };
  diff: {
    badge: string;
    title1: string;
    titleHighlight: string;
    subtitle: string;
    headers: {
      feature: string;
      traditional: string;
      marketplace: string;
      krishiniti: string;
    };
    rows: Array<{
      feature: string;
      traditional: string;
      marketplace: string;
      krishiniti: string;
    }>;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    questions: Array<{
      category: string;
      question: string;
      answer: string;
    }>;
  };
  ctaBand: {
    title: string;
    subtitle: string;
    button: string;
    phonePlaceholder: string;
    phoneButton: string;
    phoneSuccess: string;
  };
  showcase: {
    badge: string;
    title: string;
    subtitle: string;
    tabPrice: string;
    tabAi: string;
    tabEscrow: string;
  };
  portals: {
    badge: string;
    title: string;
    subtitle: string;
    launch: string;
  };
}

export const LANDING_TRANSLATIONS: Record<Locale, LandingCopy> = {
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      features: 'Features',
      security: 'Security',
      help: 'Help',
      forJudges: 'For Partners & Judges ↗',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      getStarted: 'List on WhatsApp',
    },
    hero: {
      tag: '🌾 The Trusted Platform for Indian Farmers',
      title: 'Trade Your Harvest at',
      titleHighlight: 'Fair Market Price.',
      subtitle: 'List on WhatsApp. Get graded by AI. Money safe in bank.',
      farmerCta: 'List Crop via WhatsApp',
      farmerCtaSub: 'Free • No app download • Takes 30 seconds',
      buyerLink: 'Are you an institutional buyer? Explore marketplace →',
      microTrust: '✓ Verified Aadhaar KYC • ✓ 100% Safe Bank Escrow • ✓ Real Mandi Rates',
    },
    showcaseVisual: {
      step1Title: '01. Message on WhatsApp',
      step1Sub: 'Send harvest photo & quantity',
      step2Title: '02. AI Quality Grade',
      step2Sub: 'Instant fair mandi price & grade',
      step3Title: '03. Direct Bank Payout',
      step3Sub: '100% money released on delivery',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'Farmers Selling',
      stat2Val: '₹1.42 Cr+',
      stat2Label: 'Paid to Farmers',
      stat3Val: '35%',
      stat3Label: 'Lower Freight Cost',
      stat4Val: '100%',
      stat4Label: 'Payment Guarantee',
    },
    features: {
      tag: 'Platform Features',
      title: 'Built for Every Farmer',
      subtitle: 'Simple tools designed for real field conditions without any complicated apps.',
      f1Title: 'List in Seconds',
      f1Sub: 'Direct on WhatsApp',
      f1Detail: 'Take a photo of your produce and message our WhatsApp number. No English forms or new apps required.',
      f2Title: 'Fair AI Pricing',
      f2Sub: 'Proof of Quality',
      f2Detail: 'Computer vision inspects crop quality on your phone and matches live government mandi prices so traders cannot underpay.',
      f3Title: 'Safe Escrow Payout',
      f3Sub: 'Guaranteed Money',
      f3Detail: 'Buyer funds are locked in a bank escrow account upfront and transferred directly to your bank upon delivery code confirmation.',
    },
    workflow: {
      badge: 'Transaction Architecture',
      title1: 'How a Transaction Flows from',
      titleHighlight: 'Farmgate to Settlement',
      subtitle: 'Every step is automated, verified, and protected to eliminate payment defaults and price exploitation.',
      steps: [
        {
          step: '01',
          badge: 'Farmer Entry',
          title: 'Snap & List via WhatsApp',
          description: 'Farmer sends a photo and quantity over WhatsApp in their regional language. No complex app download required.'
        },
        {
          step: '02',
          badge: 'Farmgate Vision',
          title: 'YOLOv8 AI Quality Grading',
          description: 'Computer vision model inspects crop surface defect area, ripeness, and moisture in sub-seconds to generate a digital Grade certificate.'
        },
        {
          step: '03',
          badge: 'AGMARKNET Sync',
          title: 'Real-Time Price Discovery',
          description: 'Live mandi prices and predictive price models advise farmers on whether to sell now or wait.'
        },
        {
          step: '04',
          badge: 'Nodal Bank Vault',
          title: '100% Escrow Funded',
          description: 'Verified buyer places bid and locks 100% of order value in an RBI-compliant bank escrow account before transport dispatch.'
        },
        {
          step: '05',
          badge: 'Spatial Logistics',
          title: 'PostGIS Shared Freight',
          description: 'Geospatial clustering optimizes 10-km radius milk-run routes, consolidating neighboring smallholder loads and reducing freight costs by 35%.'
        },
        {
          step: '06',
          badge: 'Instant Settlement',
          title: 'Milestone Payout Release',
          description: 'Funds released instantly to farmer bank account upon physical OTP delivery handshake.'
        }
      ],
      bannerTitle: 'Want to trade your harvest today?',
      bannerSub: 'Free for farmers. Start now on WhatsApp in 30 seconds.',
      bannerCta: 'Start on WhatsApp'
    },
    trust: {
      tag: 'Security & Trust',
      title: 'Safe by Design',
      subtitle: 'Four layers of protection keeping your produce, prices, and payments completely secure.',
      t1Title: 'DigiLocker KYC',
      t1Desc: 'All farmers and institutional buyers are identity-verified to eliminate fraud and rogue traders.',
      t2Title: 'RBI-Compliant Escrow',
      t2Desc: '100% of the buyer payment is locked in a bank vault before any truck leaves for pickup.',
      t3Title: 'AGMARKNET Live Feed',
      t3Desc: 'Real-time mandi prices synchronized from official government agricultural market servers.',
      t4Title: '24/7 Vernacular Support',
      t4Desc: 'Voice and chat assistance available in 8 regional languages across India.',
    },
    diff: {
      badge: 'Strategic Differentiation',
      title1: 'More Than Just A Marketplace.',
      titleHighlight: 'A Complete Transaction Layer.',
      subtitle: 'See how Krishi Niti fundamentally transforms agricultural trade compared to traditional mandis and standard e-commerce boards.',
      headers: {
        feature: 'Feature / Dimension',
        traditional: 'Traditional APMC Mandi',
        marketplace: 'Generic Listing Board',
        krishiniti: 'Krishi Niti'
      },
      rows: [
        {
          feature: 'Quality Verification',
          traditional: 'Subjective manual down-grading by middlemen traders',
          marketplace: 'Unverified self-reported claims by sellers',
          krishiniti: 'YOLOv8 AI Computer Vision with instant Grade A/B/C digital certificate'
        },
        {
          feature: 'Payment Security',
          traditional: '15 to 45 days delayed credit; frequent default risk',
          marketplace: 'Off-platform unsecured payment; scam vulnerable',
          krishiniti: '100% Buyer Deposit Locked in RBI-compliant Bank Escrow Vault upfront'
        },
        {
          feature: 'Price Transparency',
          traditional: 'Middlemen cartel price suppression (8-15% commission)',
          marketplace: 'Static board prices with hidden negotiation spreads',
          krishiniti: 'Live AGMARKNET mandi feeds & AI Sell-vs-Wait profit advisor'
        },
        {
          feature: 'Logistics & Freight',
          traditional: 'Farmers hire individual costly small trucks; empty returns',
          marketplace: 'No integrated logistics; buyer/farmer arranges separately',
          krishiniti: 'PostGIS spatial milk-run route pooling saves ~35% in freight costs'
        },
        {
          feature: 'Farmer Usability',
          traditional: 'Requires physically transporting crop to mandi at personal risk',
          marketplace: 'Complex English app downloads and multi-page forms',
          krishiniti: 'Zero app friction: 100% listing and bidding via WhatsApp in 8 languages'
        }
      ]
    },
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Common Questions',
      subtitle: 'Everything you need to know about selling with Krishi Niti.',
      questions: [
        {
          category: 'Getting Started',
          question: 'Do I need to download any app or pay fees?',
          answer: 'No. You do not need to download any app or pay any fees. Everything works over your normal WhatsApp in your regional language.'
        },
        {
          category: 'Payment Guarantee',
          question: 'How does Krishi Niti guarantee my payment?',
          answer: 'The buyer deposits 100% of the money into a safe bank escrow vault before transit begins. Once the crop reaches safely and you confirm the 4-digit code, the payment is deposited straight into your bank account.'
        },
        {
          category: 'Crop Quality & Camera',
          question: 'What if my phone camera is simple?',
          answer: 'Our AI model is trained on standard phone cameras under Indian daylight conditions. Just snap a normal photo of your harvest in daylight.'
        },
        {
          category: 'Shared Logistics',
          question: 'How does shared truck transport work?',
          answer: 'We automatically group compatible harvest lots from neighboring farms within a 10km radius into a single shared truck, saving everyone ~35% on freight.'
        }
      ]
    },
    ctaBand: {
      title: 'Ready to trade your harvest smarter?',
      subtitle: 'Join over 500+ farmers getting fair prices and guaranteed bank payments.',
      button: 'Start on WhatsApp Now',
      phonePlaceholder: 'Enter your 10-digit mobile number for callback...',
      phoneButton: 'Request Free Call',
      phoneSuccess: '✓ Request received! Our agricultural advisor will call you shortly.',
    },
    showcase: {
      badge: 'Interactive Evaluation Sandbox',
      title: 'See Krishi Niti In Action',
      subtitle: 'Test live price trajectory algorithms, YOLOv8 grain quality vision, and milestone bank escrow release.',
      tabPrice: '01. AGMARKNET Price Engine',
      tabAi: '02. YOLOv8 AI Quality Scanner',
      tabEscrow: '03. Milestone Escrow Vault'
    },
    portals: {
      badge: 'Dedicated Gateways',
      title: 'Launch Your Role Command Center',
      subtitle: 'Select your persona to access specialized dashboards for farmers, institutional buyers, FPOs, transporters, warehouses, and escrow governance.',
      launch: 'Launch Portal'
    }
  },

  hi: {
    nav: {
      home: 'होम',
      howItWorks: 'यह कैसे काम करता है',
      features: 'विशेषताएं',
      security: 'सुरक्षा',
      help: 'सहायता',
      forJudges: 'जजों और भागीदारों के लिए ↗',
      signIn: 'साइन इन',
      dashboard: 'डैशबोर्ड',
      getStarted: 'व्हाट्सएप पर शुरू करें',
    },
    hero: {
      tag: '🌾 भारतीय किसानों का भरोसेमंद मंच',
      title: 'अपनी फसल बेचें',
      titleHighlight: 'सही मंडी भाव पर।',
      subtitle: 'व्हाट्सएप पर लिस्ट करें। एआई से ग्रेड पाएं। सीधे बैंक में सुरक्षित पैसा।',
      farmerCta: 'व्हाट्सएप पर फसल दर्ज करें',
      farmerCtaSub: 'मुफ्त • बिना किसी ऐप के • सिर्फ ३० सेकंड',
      buyerLink: 'क्या आप एक थोक खरीदार हैं? बाज़ार देखें →',
      microTrust: '✓ आधार केवाईसी सत्यापित • ✓ १००% बैंक सुरक्षित एस्क्रो • ✓ लाइव मंडी भाव',
    },
    showcaseVisual: {
      step1Title: '०१. व्हाट्सएप पर संदेश भेजें',
      step1Sub: 'फसल की फोटो और मात्रा भेजें',
      step2Title: '०२. एआई गुणवत्ता जांच',
      step2Sub: 'तुरंत आधिकारिक ग्रेड और सही भाव',
      step3Title: '०३. सीधे बैंक में भुगतान',
      step3Sub: 'माल डिलीवरी पर १००% पैसा खाते में',
    },
    stats: {
      stat1Val: '५००+',
      stat1Label: 'किसान जुड़े हुए हैं',
      stat2Val: '₹१.४२ करोड़+',
      stat2Label: 'किसानों को भुगतान मिला',
      stat3Val: '३५%',
      stat3Label: 'भाड़ा खर्च में बचत',
      stat4Val: '१००%',
      stat4Label: 'सुरक्षित भुगतान गारंटी',
    },
    features: {
      tag: 'मंच की सुविधाएं',
      title: 'हर किसान के लिए सरल',
      subtitle: 'बिना किसी कठिन ऐप के वास्तविक खेत की स्थितियों के लिए बनाए गए आसान टूल्स।',
      f1Title: 'सेकंडों में लिस्टिंग',
      f1Sub: 'सीधे व्हाट्सएप पर',
      f1Detail: 'अपनी फसल की फोटो खींचें और हमारे व्हाट्सएप नंबर पर भेजें। कोई फॉर्म या ऐप नहीं।',
      f2Title: 'सटीक एआई मूल्य',
      f2Sub: 'गुणवत्ता का पक्का प्रमाण',
      f2Detail: 'कंप्यूटर विज़न फोन पर फसल की गुणवत्ता जांचता है और सरकारी मंडी भाव से मिलाकर सही दाम देता है।',
      f3Title: 'सुरक्षित एस्क्रो भुगतान',
      f3Sub: 'पक्का बैंक भुगतान',
      f3Detail: 'खरीदार का पैसा पहले बैंक में सुरक्षित जमा होता है और डिलीवरी की पुष्टि होते ही आपके खाते में आता है।',
    },
    workflow: {
      badge: 'लेनदेन प्रक्रिया',
      title1: 'खेत से लेकर',
      titleHighlight: 'बैंक खाते तक पैसा',
      subtitle: 'हर कदम स्वचालित, सत्यापित और सुरक्षित है।',
      steps: [
        {
          step: '०१',
          badge: 'चरण १',
          title: 'व्हाट्सएप पर फोटो भेजें',
          description: 'फसल की फोटो और वजन व्हाट्सएप पर भेजें।'
        },
        {
          step: '०२',
          badge: 'चरण २',
          title: 'एआई गुणवत्ता जांच',
          description: 'सिस्टम सेकंडों में फसल की जांच कर आधिकारिक ग्रेड देता है।'
        },
        {
          step: '०३',
          badge: 'चरण ३',
          title: 'मंडी भाव देखें',
          description: 'लाइव सरकारी मंडी दरें देखें और सत्यापित बोलियां पाएं।'
        },
        {
          step: '०४',
          badge: 'चरण ४',
          title: 'बैंक एस्क्रो में जमा',
          description: 'खरीदार गाड़ी आने से पहले पूरा पैसा सुरक्षित बैंक में जमा करता है।'
        },
        {
          step: '०५',
          badge: 'चरण ५',
          title: 'साझा ट्रक परिवहन',
          description: 'साझा ट्रक आपके खेत पर आकर माल लोड करता है।'
        },
        {
          step: '०६',
          badge: 'चरण ६',
          title: 'तुरंत बैंक में भुगतान',
          description: 'ओटीपी कोड देते ही पूरा पैसा सीधे आपके बैंक खाते में आ जाता है।'
        }
      ],
      bannerTitle: 'क्या आप आज फसल बेचना चाहते हैं?',
      bannerSub: 'किसानों के लिए बिल्कुल मुफ्त। व्हाट्सएप पर ३० सेकंड में शुरू करें।',
      bannerCta: 'व्हाट्सएप पर शुरू करें'
    },
    trust: {
      tag: 'सुरक्षा और विश्वास',
      title: 'हर स्तर पर सुरक्षित',
      subtitle: 'आपकी फसल, भाव और भुगतान को पूरी तरह सुरक्षित रखने के लिए सुरक्षा के चार मजबूत स्तर।',
      t1Title: 'डिजिलॉकर केवाईसी',
      t1Desc: 'धोखाधड़ी रोकने के लिए सभी किसानों और खरीदारों का पहचान सत्यापन किया जाता है।',
      t2Title: 'आरबीआई-अनुरूप एस्क्रो',
      t2Desc: 'ट्रक आने से पहले खरीदार का पूरा पैसा बैंक वॉल्ट में सुरक्षित जमा होता है।',
      t3Title: 'एगमार्कनेट लाइव डेटा',
      t3Desc: 'सरकारी मंडियों से वास्तविक समय में सीधे सिंक होने वाले आधिकारिक बाजार भाव।',
      t4Title: '२४/७ अपनी भाषा में सहायता',
      t4Desc: 'भारत की ८ प्रादेशिक भाषाओं में फोन और चैट पर निरंतर सहायता उपलब्ध।',
    },
    diff: {
      badge: 'रणनीतिक अंतर',
      title1: 'केवल एक बाजार नहीं,',
      titleHighlight: 'एक संपूर्ण लेनदेन समाधान।',
      subtitle: 'देखें कैसे कृषि नीति पारंपरिक मंडियों से कहीं बेहतर सुरक्षा देती है।',
      headers: {
        feature: 'सुविधा',
        traditional: 'पारंपरिक एपीएमसी मंडी',
        marketplace: 'साधारण ऑनलाइन पोर्टल',
        krishiniti: 'कृषि नीति'
      },
      rows: [
        {
          feature: 'गुणवत्ता जांच',
          traditional: 'बिचौलियों द्वारा मनमाना कम ग्रेड देना',
          marketplace: 'सत्यापन रहित दावे',
          krishiniti: 'YOLOv8 एआई विज़न द्वारा त्वरित डिजिटल ग्रेड प्रमाणपत्र'
        },
        {
          feature: 'भुगतान सुरक्षा',
          traditional: '१५ से ४५ दिन की देरी या पैसा डूबना',
          marketplace: 'असुरक्षित ऑफलाइन लेनदेन',
          krishiniti: '१००% पैसा पहले ही बैंक एस्क्रो वॉल्ट में सुरक्षित'
        },
        {
          feature: 'मूल्य पारदर्शिता',
          traditional: 'दलालों का ८-१५% कमीशन',
          marketplace: 'पुराने या अस्पष्ट भाव',
          krishiniti: 'लाइव एगमार्कनेट दरें और एआई लाभ सलाहकार'
        },
        {
          feature: 'भाड़ा खर्च',
          traditional: 'पूरे ट्रक का भाड़ा अकेले दें',
          marketplace: 'खुद गाड़ी ढूंढनी पड़ती है',
          krishiniti: 'साझा मार्ग से माल ढुलाई में ~३५% की बचत'
        },
        {
          feature: 'उपयोग में सरलता',
          traditional: 'फसल लेकर मंडी तक भटकना',
          marketplace: 'कठिन अंग्रेजी फॉर्म',
          krishiniti: 'व्हाट्सएप द्वारा ८ भाषाओं में बिना किसी ऐप डाउनलोड के'
        }
      ]
    },
    faq: {
      badge: 'अक्सर पूछे जाने वाले सवाल',
      title: 'किसानों के सामान्य प्रश्न',
      subtitle: 'कृषि नीति के बारे में जानने योग्य आवश्यक बातें।',
      questions: [
        {
          category: 'शुरुआत',
          question: 'क्या मुझे कोई ऐप डाउनलोड करना होगा?',
          answer: 'नहीं। आपको कोई ऐप डाउनलोड नहीं करना है। सब कुछ आपके सामान्य व्हाट्सएप पर आपकी भाषा में चलता है।'
        },
        {
          category: 'भुगतान',
          question: 'मुझे मेरा पैसा मिलने की क्या गारंटी है?',
          answer: 'खरीदार का पूरा पैसा पहले सुरक्षित बैंक वॉल्ट में जमा होता है और डिलीवरी पर कोड देते ही पैसा सीधे आपके बैंक में पहुंचता है।'
        },
        {
          category: 'कैमरा',
          question: 'अगर मेरे फोन का कैमरा साधारण है तो?',
          answer: 'हमारा सिस्टम सामान्य फोन कैमरों के लिए ही अनुकूलित है। बस दिन के उजाले में एक साफ फोटो खींचें।'
        },
        {
          category: 'परिवहन',
          question: 'साझा परिवहन कैसे काम करता है?',
          answer: 'आसपास के किसानों की फसलों को एक ही ट्रक में जोड़कर परिवहन लागत ३५% तक घटाई जाती है।'
        }
      ]
    },
    ctaBand: {
      title: 'क्या आप सही दाम पर फसल बेचना चाहते हैं?',
      subtitle: '५०० से अधिक किसानों से जुड़ें जो सही दाम और सुरक्षित बैंक भुगतान पा रहे हैं।',
      button: 'व्हाट्सएप पर अभी शुरू करें',
      phonePlaceholder: 'कॉल के लिए अपना १० अंकों का मोबाइल नंबर दर्ज करें...',
      phoneButton: 'मुफ्त कॉल का अनुरोध करें',
      phoneSuccess: '✓ अनुरोध प्राप्त हुआ! हमारे कृषि सलाहकार जल्द ही आपको कॉल करेंगे।',
    },
    showcase: {
      badge: 'इंटरएक्टिव सैंडबॉक्स',
      title: 'कृषि नीति को लाइव देखें',
      subtitle: 'लाइव मूल्य इंजन, एआई गुणवत्ता स्कैनर और माइलस्टोन एस्क्रो का परीक्षण करें।',
      tabPrice: '०१. एगमार्कनेट मूल्य इंजन',
      tabAi: '०२. YOLOv8 एआई क्वालिटी स्कैनर',
      tabEscrow: '०३. माइलस्टोन एस्क्रो वॉल्ट'
    },
    portals: {
      badge: 'समर्पित पोर्टल',
      title: 'अपना डैशबोर्ड खोलें',
      subtitle: 'किसान, खरीदार, एफपीओ, ट्रांसपोर्टर और वेयरहाउस के लिए विशेष डैशबोर्ड चुनें।',
      launch: 'पोर्टल खोलें'
    }
  },

  mr: {
    nav: {
      home: 'होम',
      howItWorks: 'हे कसे चालते',
      features: 'वैशिष्ट्ये',
      security: 'सुरक्षा',
      help: 'मदत',
      forJudges: 'परीक्षक व भागीदार ↗',
      signIn: 'साइन इन',
      dashboard: 'डॅशबोर्ड',
      getStarted: 'व्हॉट्सॲपवर सुरू करा',
    },
    hero: {
      tag: '🌾 भारतीय शेतकऱ्यांसाठी विश्वासू व्यासपीठ',
      title: 'आपले पीक विका',
      titleHighlight: 'योग्य बाजारभावात.',
      subtitle: 'व्हॉट्सॲपवर नोंदवा. एआयने गुणवत्ता तपासा. बँकेत सुरक्षित पैसे मिळवा.',
      farmerCta: 'व्हॉट्सॲपवरून पीक नोंदवा',
      farmerCtaSub: 'मोफत • ॲपची गरज नाही • फक्त ३० सेकंद',
      buyerLink: 'आपण संस्थात्मक खरेदीदार आहात का? बाजार पहा →',
      microTrust: '✓ आधार केवायसी पडताळणी • ✓ १००% बँक सुरक्षित एस्क्रो • ✓ थेट बाजारभाव',
    },
    showcaseVisual: {
      step1Title: '०१. व्हॉट्सॲपवर मेसेज करा',
      step1Sub: 'पिकाचा फोटो व वजन पाठवा',
      step2Title: '०२. एआय गुणवत्ता तपासणी',
      step2Sub: 'थेट अचूक ग्रेड आणि योग्य भाव',
      step3Title: '०३. थेट बँकेत पैसे',
      step3Sub: 'माल पोहोचल्यावर १००% पैसे खात्यात',
    },
    stats: {
      stat1Val: '५००+',
      stat1Label: 'शेतकरी जोडले गेले',
      stat2Val: '₹१.४२ कोटी+',
      stat2Label: 'शेतकऱ्यांना पैसे मिळाले',
      stat3Val: '३५%',
      stat3Label: 'वाहतूक खर्च बचत',
      stat4Val: '१००%',
      stat4Label: 'पेमेंटची पक्की हमी',
    },
    features: {
      tag: 'प्लॅटफॉर्म वैशिष्ट्ये',
      title: 'प्रत्येक शेतकऱ्यासाठी सोपे',
      subtitle: 'कठिन ॲप्सशिवाय शेतातील वापरासाठी तयार केलेली सुलभ साधने.',
      f1Title: 'सेकंदात नोंदणी',
      f1Sub: 'थेट व्हॉट्सॲपवर',
      f1Detail: 'पिकाचा फोटो काढून आमच्या व्हॉट्सॲप नंबरवर पाठवा. फॉर्म किंवा ॲपची गरज नाही.',
      f2Title: 'अचूक एआय भाव',
      f2Sub: 'गुणवत्तेचा पक्का पुरावा',
      f2Detail: 'कॉम्प्युटर व्हिजन फोनवरच गुणवत्ता तपासून सरकारी बाजारभावानुसार योग्य भाव देते.',
      f3Title: 'सुरक्षित एस्क्रो पेमेंट',
      f3Sub: 'खात्रीशीर बँक पेमेंट',
      f3Detail: 'खरेदीदाराचे पैसे आधीच बँकेत सुरक्षित असतात आणि डिलिव्हरी झाल्यावर थेट खात्यात जमा होतात.',
    },
    workflow: {
      badge: 'व्यवहार प्रक्रिया',
      title1: 'शेतापासून थेट',
      titleHighlight: 'बँक खात्यात पैसे',
      subtitle: 'प्रत्येक टप्पा स्वयंचलित आणि सुरक्षित आहे.',
      steps: [
        {
          step: '०१',
          badge: 'टप्पा १',
          title: 'व्हॉट्सॲपवर फोटो पाठवा',
          description: 'पिकाचा फोटो आणि वजन आमच्या व्हॉट्सॲप नंबरवर पाठवा.'
        },
        {
          step: '०२',
          badge: 'टप्पा २',
          title: 'एआय गुणवत्ता तपासणी',
          description: 'सिस्टम सेकंदात पिकाची तपासणी करून अधिकृत ग्रेड देते.'
        },
        {
          step: '०३',
          badge: 'टप्पा ३',
          title: 'थेट बाजारभाव पहा',
          description: 'आजचा थेट बाजारभाव पहा आणि चांगल्या बोली मिळवा.'
        },
        {
          step: '०४',
          badge: 'टप्पा ४',
          title: 'बँक एस्क्रोमध्ये पैसे',
          description: 'गाडी शेतात येण्यापूर्वी खरेदीदार पूर्ण पैसे बँकेत जमा करतो.'
        },
        {
          step: '०५',
          badge: 'टप्पा ५',
          title: 'सामायिक वाहतूक',
          description: 'एकत्रित ट्रक तुमच्या शेतावर येऊन माल उचलतो.'
        },
        {
          step: '०६',
          badge: 'टप्पा ६',
          title: 'थेट खात्यात पैसे जमा',
          description: 'ओटीपी कोड देताच पूर्ण पैसे थेट बँक खात्यात जमा होतात.'
        }
      ],
      bannerTitle: 'आजच पीक विकायचे आहे का?',
      bannerSub: 'शेतकऱ्यांसाठी पूर्णपणे मोफत. व्हॉट्सॲपवर ३० सेकंदात सुरू करा.',
      bannerCta: 'व्हॉट्सॲपवर सुरू करा'
    },
    trust: {
      tag: 'सुरक्षा आणि विश्वास',
      title: 'प्रत्येक टप्प्यावर सुरक्षित',
      subtitle: 'शेतमाल, भाव आणि पेमेंट पूर्णपणे सुरक्षित ठेवण्यासाठी ४ स्तरांची सुरक्षा.',
      t1Title: 'डिजीलॉकर केवायसी',
      t1Desc: 'फसवणूक टाळण्यासाठी सर्व शेतकरी आणि खरेदीदारांची ओळख पडताळणी केली जाते.',
      t2Title: 'आरबीआय एस्क्रो मानक',
      t2Desc: 'गाडी शेतात येण्यापूर्वी खरेदीदाराचे पूर्ण पैसे बँक खात्यात सुरक्षित असतात.',
      t3Title: 'ॲगमार्कनेट थेट भाव',
      t3Desc: 'सरकारी मंडयांमधून थेट अपडेट होणारे अधिकृत बाजारभाव.',
      t4Title: '२४/७ मराठीत मदत',
      t4Desc: 'आपल्या भाषेत फोन आणि चॅटवर २४ तास मोफत मार्गदर्शन उपलब्ध.',
    },
    diff: {
      badge: 'महत्त्वाचा फरक',
      title1: 'फक्त एक बाजारपेठ नाही,',
      titleHighlight: 'एक संपूर्ण सुरक्षित व्यवहार प्रणाली.',
      subtitle: 'पारंपारिक मंडई आणि कृषी नीतीमधील फरक पहा.',
      headers: {
        feature: 'वैशिष्ट्य',
        traditional: 'पारंपारिक एपीएमसी मंडई',
        marketplace: 'सामान्य ऑनलाईन वेबसाईट',
        krishiniti: 'कृषी नीती'
      },
      rows: [
        {
          feature: 'गुणवत्ता तपासणी',
          traditional: 'दलालांकडून मनमानी पद्धतीने भाव पाडणे',
          marketplace: 'कोणतीही खात्री नसलेले दावे',
          krishiniti: 'YOLOv8 एआय व्हिजनद्वारे डिजिटल ग्रेड प्रमाणपत्र'
        },
        {
          feature: 'पेमेंट सुरक्षा',
          traditional: '१५ ते ४५ दिवस उशिरा पैसे; बुडण्याची भीती',
          marketplace: 'असुरक्षित ऑफलाइन व्यवहार',
          krishiniti: '१००% रक्कम आरबीआय नियमांनुसार बँक एस्क्रो खात्यात सुरक्षित'
        },
        {
          feature: 'भावाची पारदर्शकता',
          traditional: 'दलालांची ८-१५% दलाली आणि फसवणूक',
          marketplace: 'स्थिर व जुने बाजारभाव',
          krishiniti: 'थेट ॲगमार्कनेट भाव आणि एआय नफा सल्लागार'
        },
        {
          feature: 'वाहतूक खर्च',
          traditional: 'शेतकऱ्यांचा महागडा वैयक्तिक वाहतूक खर्च',
          marketplace: 'वाहतुकीची कोणतीही सोय नाही',
          krishiniti: 'सामायिक मार्गामुळे वाहतूक खर्चात ~३५% बचत'
        },
        {
          feature: 'वापरण्यास सुलभ',
          traditional: 'माल घेऊन मंडईत भटकण्याची दगदग',
          marketplace: 'इंग्रजीतील कठीण ॲप्स आणि फॉर्म्स',
          krishiniti: 'व्हॉट्सॲपवरून ८ भाषांमध्ये विनासायास वापर'
        }
      ]
    },
    faq: {
      badge: 'तांत्रिक माहिती',
      title: 'कृषी नीती प्रत्यक्षात कशी कार्य करते',
      subtitle: 'एआय मॉडेल, वाहतूक नियोजन आणि एस्क्रो सुरक्षा याबद्दलची माहिती.',
      questions: [
        {
          category: 'सुरुवात',
          question: 'मला कोणते ॲप डाउनलोड करावे लागेल का?',
          answer: 'नाही. कोणत्याही ॲपची गरज नाही. सर्वकाही नेहमीच्या व्हॉट्सॲपवर चालते.'
        },
        {
          category: 'पेमेंट',
          question: 'पैसे मिळण्याची हमी काय?',
          answer: 'खरेदीदाराचे पैसे आधीच बँकेत जमा असतात. माल पोहोचल्यावर कोड कन्फर्म होताच पैसे थेट खात्यात येतात.'
        },
        {
          category: 'कॅमेरा',
          question: 'साधा फोन कॅमेरा चालेल का?',
          answer: 'होय, दिवसाच्या उजेडात फक्त एक चांगला फोटो काढा.'
        },
        {
          category: 'वाहतूक',
          question: 'सामायिक वाहतूक कशी चालते?',
          answer: 'परिसरातील शेतकऱ्यांचा शेतमाल एकाच ट्रकमध्ये जोडून ३५% पर्यंत भाडे वाचवले जाते.'
        }
      ]
    },
    ctaBand: {
      title: 'आपले पीक योग्य भावात विकण्यास तयार आहात का?',
      subtitle: '५००+ शेतकऱ्यांसोबत सामील व्हा जे सुरक्षित बँक पेमेंट मिळवत आहेत.',
      button: 'व्हॉट्सॲपवर आत्ताच सुरू करा',
      phonePlaceholder: 'कॉलसाठी आपला १० अंकी मोबाईल नंबर टाका...',
      phoneButton: 'मोफत कॉल विनंती',
      phoneSuccess: '✓ विनंती मिळाली! आमचे कृषी तज्ज्ञ लवकरच आपल्याला कॉल करतील.',
    },
    showcase: {
      badge: 'थेट सॅन्डबॉक्स',
      title: 'कृषी नीती प्रत्यक्षात अनुभव घ्या',
      subtitle: 'थेट बाजारभाव, एआय तपासणी आणि एस्क्रो वॉल्टचे प्रात्यक्षिक पहा.',
      tabPrice: '०१. ॲगमार्कनेट भाव इंजिन',
      tabAi: '०२. YOLOv8 एआय क्वालिटी स्कॅनर',
      tabEscrow: '०३. माइलस्टोन एस्क्रो वॉल्ट'
    },
    portals: {
      badge: 'पोर्टल गेटवे',
      title: 'तुमचा डॅशबोर्ड सुरू करा',
      subtitle: 'शेतकरी, खरेदीदार, एफपीओ, ट्रान्सपोर्टर आणि वेअरहाऊससाठी विशेष पोर्टल.',
      launch: 'पोर्टल उघडा'
    }
  },

  pa: {
    nav: {
      home: 'ਮੁੱਖ ਪੰਨਾ',
      howItWorks: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
      features: 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      security: 'ਸੁਰੱਖਿਆ',
      help: 'ਮਦਦ',
      forJudges: 'ਜੱਜਾਂ ਅਤੇ ਭਾਈਵਾਲਾਂ ਲਈ ↗',
      signIn: 'ਸਾਈਨ ਇਨ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      getStarted: 'ਵਟਸਐਪ ਤੇ ਸ਼ੁਰੂ ਕਰੋ',
    },
    hero: {
      tag: '🌾 ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਭਰੋਸੇਯੋਗ ਮੰਚ',
      title: 'ਆਪਣੀ ਫ਼ਸਲ ਵੇਚੋ',
      titleHighlight: 'ਸਹੀ ਮੰਡੀ ਭਾਅ ਤੇ.',
      subtitle: 'ਵਟਸਐਪ ਤੇ ਸੂਚੀਬੱਧ ਕਰੋ। ਏਆਈ ਨਾਲ ਜਾਂਚੋ। ਸੁਰੱਖਿਅਤ ਬੈਂਕ ਭੁਗਤਾਨ ਲਓ।',
      farmerCta: 'ਵਟਸਐਪ ਰਾਹੀਂ ਫ਼ਸਲ ਵੇਚੋ',
      farmerCtaSub: 'ਮੁਫ਼ਤ • ਕੋਈ ਐਪ ਨਹੀਂ • ਸਿਰਫ਼ 30 ਸਕਿੰਟ',
      buyerLink: 'ਕੀ ਤੁਸੀਂ ਖਰੀਦਦਾਰ ਹੋ? ਮੰਡੀ ਵੇਖੋ →',
      microTrust: '✓ ਆਧਾਰ ਕੇਵਾਈਸੀ • ✓ 100% ਸੁਰੱਖਿਅਤ ਬੈਂਕ ਐਸਕਰੋ • ✓ ਲਾਈਵ ਮੰਡੀ ਭਾਅ',
    },
    showcaseVisual: {
      step1Title: '01. ਵਟਸਐਪ ਤੇ ਸੁਨੇਹਾ ਭੇਜੋ',
      step1Sub: 'ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਅਤੇ ਮਾਤਰਾ ਭੇਜੋ',
      step2Title: '02. ਏਆਈ ਗੁਣਵੱਤਾ ਜਾਂਚ',
      step2Sub: 'ਤੁਰੰਤ ਸਰਕਾਰੀ ਭਾਅ ਅਤੇ ਗ੍ਰੇਡ',
      step3Title: '03. ਸਿੱਧਾ ਬੈਂਕ ਭੁਗਤਾਨ',
      step3Sub: 'ਮਾਲ ਪਹੁੰਚਣ ਤੇ 100% ਰਕਮ ਖਾਤੇ ਵਿੱਚ',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'ਕਿਸਾਨ ਜੁੜੇ',
      stat2Val: '₹1.42 ਕਰੋੜ+',
      stat2Label: 'ਕਿਸਾਨਾਂ ਨੂੰ ਭੁਗਤਾਨ',
      stat3Val: '35%',
      stat3Label: 'ਕਿਰਾਇਆ ਬੱਚਤ',
      stat4Val: '100%',
      stat4Label: 'ਪੱਕੀ ਭੁਗਤਾਨ ਗਾਰੰਟੀ',
    },
    features: {
      tag: 'ਮੰਚ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      title: 'ਹਰ ਕਿਸਾਨ ਲਈ ਆਸਾਨ',
      subtitle: 'ਬਿਨਾਂ ਕਿਸੇ ਔਖੀ ਐਪ ਦੇ ਸਿੱਧੇ ਖੇਤ ਵਿੱਚ ਵਰਤੋਂ ਲਈ ਤਿਆਰ।',
      f1Title: 'ਸਕਿੰਟਾਂ ਵਿੱਚ ਲਿਸਟਿੰਗ',
      f1Sub: 'ਸਿੱਧਾ ਵਟਸਐਪ ਤੇ',
      f1Detail: 'ਆਪਣੀ ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਖਿੱਚ ਕੇ ਸਾਡੇ ਵਟਸਐਪ ਨੰਬਰ ਤੇ ਭੇਜੋ। ਕੋਈ ਅੰਗਰੇਜ਼ੀ ਫਾਰਮ ਨਹੀਂ ਚਾਹੀਦਾ।',
      f2Title: 'ਸਹੀ ਏਆਈ ਭਾਅ',
      f2Sub: 'ਗੁਣਵੱਤਾ ਦਾ ਸਬੂਤ',
      f2Detail: 'ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਫੋਨ ਤੇ ਹੀ ਕੁਆਲਿਟੀ ਜਾਂਚਦਾ ਹੈ ਤਾਂ ਜੋ ਵਪਾਰੀ ਘੱਟ ਮੁੱਲ ਨਾ ਲਾ ਸਕਣ।',
      f3Title: 'ਸੁਰੱਖਿਅਤ ਐਸਕਰੋ ਖਾਤਾ',
      f3Sub: 'ਗਾਰੰਟੀਸ਼ੁਦਾ ਪੈਸਾ',
      f3Detail: 'ਖਰੀਦਦਾਰ ਦੇ ਪੈਸੇ ਪਹਿਲਾਂ ਬੈਂਕ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੁੰਦੇ ਹਨ ਅਤੇ ਡਿਲੀਵਰੀ ਤੇ ਸਿੱਧੇ ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦੇ ਹਨ।',
    },
    workflow: {
      badge: 'ਲੈਣ-ਦੇਣ ਪ੍ਰਕਿਰਿਆ',
      title1: 'ਖੇਤ ਤੋਂ ਸਿੱਧਾ',
      titleHighlight: 'ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ',
      subtitle: 'ਹਰ ਕਦਮ ਸਵੈਚਾਲਿਤ, ਪ੍ਰਮਾਣਿਤ ਅਤੇ 100% ਸੁਰੱਖਿਅਤ ਹੈ।',
      steps: [
        { step: '01', badge: 'ਕਦਮ 1', title: 'ਵਟਸਐਪ ਤੇ ਫੋਟੋ ਭੇਜੋ', description: 'ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਅਤੇ ਵਜ਼ਨ ਵਟਸਐਪ ਤੇ ਭੇਜੋ।' },
        { step: '02', badge: 'ਕਦਮ 2', title: 'ਏਆਈ ਗੁਣਵੱਤਾ ਸਰਟੀਫਿਕੇਟ', description: 'ਸਿਸਟਮ ਸਕਿੰਟਾਂ ਵਿੱਚ ਗੁਣਵੱਤਾ ਦਾ ਗ੍ਰੇਡ ਤੈਅ ਕਰਦਾ ਹੈ।' },
        { step: '03', badge: 'ਕਦਮ 3', title: 'ਲਾਈਵ ਮੰਡੀ ਭਾਅ', description: 'ਅਸਲ ਮੰਡੀ ਭਾਅ ਵੇਖੋ ਅਤੇ ਵਧੀਆ ਬੋਲੀ ਚੁਣੋ।' },
        { step: '04', badge: 'ਕਦਮ 4', title: 'ਬੈਂਕ ਵਾਲਟ ਵਿੱਚ ਰਕਮ', description: 'ਖਰੀਦਦਾਰ ਪਹਿਲਾਂ ਪੂਰੇ ਪੈਸੇ ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾਂ ਕਰਵਾਉਂਦਾ ਹੈ।' },
        { step: '05', badge: 'ਕਦਮ 5', title: 'ਸਾਂਝੀ ਢੋਆ-ਢੁਆਈ', description: 'ਟਰੱਕ ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚੋਂ ਮਾਲ ਚੁੱਕਣ ਆਉਂਦਾ ਹੈ।' },
        { step: '06', badge: 'ਕਦਮ 6', title: 'ਤੁਰੰਤ ਬੈਂਕ ਕ੍ਰੈਡਿਟ', description: 'ਕੋਡ ਦਿੰਦੇ ਹੀ ਪੂਰੇ ਪੈਸੇ ਸਿੱਧੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪਹੁੰਚ ਜਾਂਦੇ ਹਨ।' }
      ],
      bannerTitle: 'ਅੱਜ ਹੀ ਫ਼ਸਲ ਵੇਚਣੀ ਚਾਹੁੰਦੇ ਹੋ?',
      bannerSub: 'ਕਿਸਾਨਾਂ ਲਈ ਬਿਲਕੁਲ ਮੁਫ਼ਤ। ਵਟਸਐਪ ਤੇ 30 ਸਕਿੰਟਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ।',
      bannerCta: 'ਵਟਸਐਪ ਤੇ ਸ਼ੁਰੂ ਕਰੋ'
    },
    trust: {
      tag: 'ਸੁਰੱਖਿਆ ਅਤੇ ਭਰੋਸਾ',
      title: 'ਹਰ ਪੱਧਰ ਤੇ ਸੁਰੱਖਿਅਤ',
      subtitle: 'ਤੁਹਾਡੀ ਫ਼ਸਲ ਅਤੇ ਭੁਗਤਾਨ ਦੀ ਪੂਰੀ ਸੁਰੱਖਿਆ।',
      t1Title: 'ਡਿਜੀਲੌਕਰ ਕੇਵਾਈਸੀ',
      t1Desc: 'ਸਾਰੇ ਕਿਸਾਨਾਂ ਅਤੇ ਖਰੀਦਦਾਰਾਂ ਦੀ ਸਰਕਾਰੀ ਪਛਾਣ ਤਸਦੀਕ।',
      t2Title: 'ਆਰਬੀਆਈ ਐਸਕਰੋ ਮਾਪਦੰਡ',
      t2Desc: 'ਖਰੀਦਦਾਰ ਦੇ ਪੈਸੇ ਪਹਿਲਾਂ ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾਂ ਰਹਿੰਦੇ ਹਨ।',
      t3Title: 'ਐਗਮਾਰਕਨੈੱਟ ਲਾਈਵ ਭਾਅ',
      t3Desc: 'ਸਰਕਾਰੀ ਮੰਡੀਆਂ ਤੋਂ ਸਿੱਧੇ ਅੱਪਡੇਟ ਕੀਤੇ ਗਏ ਭਾਅ।',
      t4Title: '24/7 ਪੰਜਾਬੀ ਵਿੱਚ ਮਦਦ',
      t4Desc: 'ਤੁਹਾਡੀ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਫੋਨ ਅਤੇ ਚੈਟ ਤੇ ਸਹਾਇਤਾ।',
    },
    diff: {
      badge: 'ਅਸਲ ਫਰਕ',
      title1: 'ਸਿਰਫ਼ ਇੱਕ ਮੰਡੀ ਨਹੀਂ,',
      titleHighlight: 'ਇੱਕ ਸੰਪੂਰਨ ਸੁਰੱਖਿਅਤ ਪ੍ਰਣਾਲੀ.',
      subtitle: 'ਰਵਾਇਤੀ ਆੜ੍ਹਤ ਅਤੇ ਕ੍ਰਿਸ਼ੀ ਨੀਤੀ ਵਿੱਚ ਫਰਕ ਵੇਖੋ।',
      headers: { feature: 'ਵਿਸ਼ੇਸ਼ਤਾ', traditional: 'ਰਵਾਇਤੀ ਮੰਡੀ', marketplace: 'ਆਮ ਆਨਲਾਈਨ ਵੈੱਬਸਾਈਟ', krishiniti: 'ਕ੍ਰਿਸ਼ੀ ਨੀਤੀ' },
      rows: [
        { feature: 'ਕੁਆਲਿਟੀ ਜਾਂਚ', traditional: 'ਵਪਾਰੀਆਂ ਵੱਲੋਂ ਮਨਮਾਨੀ ਕਟੌਤੀ', marketplace: 'ਬਿਨਾਂ ਕਿਸੇ ਗਾਰੰਟੀ ਦੇ', krishiniti: 'YOLOv8 ਏਆਈ ਵਿਜ਼ਨ ਸਰਟੀਫਿਕੇਟ' },
        { feature: 'ਪੈਸੇ ਦੀ ਸੁਰੱਖਿਆ', traditional: '15-45 ਦਿਨ ਦੇਰੀ; ਡੁੱਬਣ ਦਾ ਖਤਰਾ', marketplace: 'ਅਸੁਰੱਖਿਅਤ ਆਫਲਾਈਨ ਸੌਦੇ', krishiniti: '100% ਰਕਮ ਆਰਬੀਆਈ ਬੈਂਕ ਵਾਲਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ' },
        { feature: 'ਭਾਅ ਦੀ ਪਾਰਦਰਸ਼ਤਾ', traditional: 'ਆੜ੍ਹਤੀਆਂ ਦੀ ਦਲਾਲੀ', marketplace: 'ਪੁਰਾਣੇ ਸਥਿਰ ਰੇਟ', krishiniti: 'ਲਾਈਵ ਸਰਕਾਰੀ ਮੰਡੀ ਭਾਅ' },
        { feature: 'ਢੋਆ-ਢੁਆਈ ਖਰਚਾ', traditional: 'ਮਹਿੰਗਾ ਨਿੱਜੀ ਕਿਰਾਇਆ', marketplace: 'ਕੋਈ ਢੋਆ-ਢੁਆਈ ਨਹੀਂ', krishiniti: 'ਸਾਂਝੀ ਢੋਆ-ਢੁਆਈ ਨਾਲ 35% ਬੱਚਤ' },
        { feature: 'ਵਰਤੋਂ ਵਿੱਚ ਆਸਾਨ', traditional: 'ਮੰਡੀਆਂ ਵਿੱਚ ਧੱਕੇ ਖਾਣਾ', marketplace: 'ਔਖੇ ਅੰਗਰੇਜ਼ੀ ਫਾਰਮ', krishiniti: 'ਸਿੱਧਾ ਵਟਸਐਪ ਤੇ 8 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ' }
      ]
    },
    faq: {
      badge: 'ਆਮ ਸਵਾਲ',
      title: 'ਕਿਸਾਨਾਂ ਦੇ ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ',
      subtitle: 'ਕ੍ਰਿਸ਼ੀ ਨੀਤੀ ਬਾਰੇ ਜਾਣਨ ਯੋਗ ਮੁੱਖ ਗੱਲਾਂ।',
      questions: [
        { category: 'ਸ਼ੁਰੂਆਤ', question: 'ਕੀ ਮੈਨੂੰ ਕੋਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰਨੀ ਪਵੇਗੀ?', answer: 'ਨਹੀਂ। ਸਭ ਕੁਝ ਤੁਹਾਡੇ ਆਮ ਵਟਸਐਪ ਤੇ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਚੱਲਦਾ ਹੈ।' },
        { category: 'ਭੁਗਤਾਨ', question: 'ਪੈਸੇ ਮਿਲਣ ਦੀ ਕੀ ਗਾਰੰਟੀ ਹੈ?', answer: 'ਖਰੀਦਦਾਰ ਦੇ ਪੈਸੇ ਪਹਿਲਾਂ ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੁੰਦੇ ਹਨ ਅਤੇ ਕੋਡ ਦਿੰਦੇ ਹੀ ਤੁਰੰਤ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦੇ ਹਨ।' },
        { category: 'ਕੈਮਰਾ', question: 'ਕੀ ਸਾਧਾਰਨ ਫੋਨ ਕੈਮਰਾ ਚੱਲੇਗਾ?', answer: 'ਹਾਂ, ਦਿਨ ਦੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਸਾਫ਼ ਫੋਟੋ ਖਿੱਚੋ।' },
        { category: 'ਢੋਆ-ਢੁਆਈ', question: 'ਸਾਂਝੀ ਢੋਆ-ਢੁਆਈ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ?', answer: 'ਗੁਆਂਢੀ ਕਿਸਾਨਾਂ ਦੀ ਫ਼ਸਲ ਇੱਕੋ ਟਰੱਕ ਵਿੱਚ ਜੋੜ ਕੇ 35% ਕਿਰਾਇਆ ਬਚਾਇਆ ਜਾਂਦਾ ਹੈ।' }
      ]
    },
    ctaBand: {
      title: 'ਕੀ ਤੁਸੀਂ ਸਹੀ ਭਾਅ ਤੇ ਫ਼ਸਲ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
      subtitle: '500+ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ ਜੋ ਸੁਰੱਖਿਅਤ ਬੈਂਕ ਭੁਗਤਾਨ ਪ੍ਰਾਪਤ ਕਰ ਰਹੇ ਹਨ।',
      button: 'ਵਟਸਐਪ ਤੇ ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ',
      phonePlaceholder: 'ਕਾਲ ਲਈ ਆਪਣਾ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ...',
      phoneButton: 'ਮੁਫ਼ਤ ਕਾਲ ਦੀ ਬੇਨਤੀ ਕਰੋ',
      phoneSuccess: '✓ ਬੇਨਤੀ ਮਿਲੀ! ਸਾਡੇ ਖੇਤੀ ਮਾਹਿਰ ਜਲਦੀ ਹੀ ਤੁਹਾਨੂੰ ਕਾਲ ਕਰਨਗੇ।',
    },
    showcase: {
      badge: 'ਲਾਈਵ ਸੈਂਡਬੌਕਸ',
      title: 'ਕ੍ਰਿਸ਼ੀ ਨੀਤੀ ਨੂੰ ਲਾਈਵ ਵੇਖੋ',
      subtitle: 'ਲਾਈਵ ਭਾਅ ਇੰਜਣ, ਏਆਈ ਕੁਆਲਿਟੀ ਸਕੈਨਰ ਅਤੇ ਐਸਕਰੋ ਵਾਲਟ ਦਾ ਪ੍ਰਦਰਸ਼ਨ।',
      tabPrice: '01. ਐਗਮਾਰਕਨੈੱਟ ਭਾਅ ਇੰਜਣ',
      tabAi: '02. YOLOv8 ਏਆਈ ਸਕੈਨਰ',
      tabEscrow: '03. ਮਾਈਲਸਟੋਨ ਐਸਕਰੋ ਵਾਲਟ'
    },
    portals: {
      badge: 'ਪੋਰਟਲ ਗੇਟਵੇ',
      title: 'ਆਪਣਾ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ',
      subtitle: 'ਕਿਸਾਨ, ਖਰੀਦਦਾਰ, ਐਫਪੀਓ, ਟਰਾਂਸਪੋਰਟਰ ਅਤੇ ਗੋਦਾਮ ਲਈ ਵਿਸ਼ੇਸ਼ ਪੋਰਟਲ।',
      launch: 'ਪੋਰਟਲ ਖੋਲ੍ਹੋ'
    }
  },

  gu: {
    nav: {
      home: 'મુખ્ય પૃષ્ઠ',
      howItWorks: 'તે કેવી રીતે કાર્ય કરે છે',
      features: 'વિશેષતાઓ',
      security: 'સુરક્ષા',
      help: 'મદદ',
      forJudges: 'ન્યાયાધીશો અને ભાગીદારો માટે ↗',
      signIn: 'સાઇન ઇન',
      dashboard: 'ડેશબોર્ડ',
      getStarted: 'વ્હોટ્સએપ પર શરૂ કરો',
    },
    hero: {
      tag: '🌾 ભારતીય ખેડૂતો માટે વિશ્વસનીય મંચ',
      title: 'તમારો પાક વેચો',
      titleHighlight: 'સાચા બજાર ભાવે.',
      subtitle: 'વ્હોટ્સએપ પર નોંધણી કરો. એઆઈથી ગુણવત્તા તપાસો. બેંકમાં સુરક્ષિત ચુકવણી મેળવો.',
      farmerCta: 'વ્હોટ્સએપ દ્વારા પાક વેચો',
      farmerCtaSub: 'મફત • કોઈ એપ ડાઉનલોડ નહિ • ફક્ત 30 સેકન્ડ',
      buyerLink: 'શું તમે ખરીદદાર છો? બજાર જુઓ →',
      microTrust: '✓ આધાર કેવાયસી • ✓ 100% સુરક્ષિત બેંક એસ્ક્રો • ✓ લાઇવ બજાર ભાવ',
    },
    showcaseVisual: {
      step1Title: '01. વ્હોટ્સએપ પર મેસેજ કરો',
      step1Sub: 'પાકનો ફોટો અને જથ્થો મોકલો',
      step2Title: '02. એઆઈ ગુણવત્તા તપાસ',
      step2Sub: 'ત્વરિત સરકારી ભાવ અને ગ્રેડ',
      step3Title: '03. સીધું બેંક ખાતામાં પેમેન્ટ',
      step3Sub: 'માલ પહોંચતા જ 100% રકમ ખાતામાં',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'ખેડૂતો જોડાયા',
      stat2Val: '₹1.42 કરોડ+',
      stat2Label: 'ખેડૂતોને ચુકવણી',
      stat3Val: '35%',
      stat3Label: 'પરિવહન ખર્ચ બચત',
      stat4Val: '100%',
      stat4Label: 'ચુકવણીની પાકી ગેરંટી',
    },
    features: {
      tag: 'પ્લેટફોર્મ વિશેષતાઓ',
      title: 'દરેક ખેડૂત માટે સરળ',
      subtitle: 'મુશ્કેલ એપ્સ વગર સીધા ખેતરમાં ઉપયોગ માટે બનાવેલા સરળ સાધનો.',
      f1Title: 'સેકન્ડોમાં લિસ્ટિંગ',
      f1Sub: 'સીધા વ્હોટ્સએપ પર',
      f1Detail: 'પાકનો ફોટો પાડીને અમારા વ્હોટ્સએપ નંબર પર મોકલો. કોઈ ફોર્મ ભરવાની જરૂર નથી.',
      f2Title: 'સાચો એઆઈ ભાવ',
      f2Sub: 'ગુણવત્તાનો પાકો પુરાવો',
      f2Detail: 'કમ્પ્યુટર વિઝન ફોન પર જ ગુણવત્તા ચકાસીને સરકારી મંડી અનુસાર સાચો ભાવ આપે છે.',
      f3Title: 'સુરક્ષિત એસ્ક્રો પેમેન્ટ',
      f3Sub: 'ગેરંટીડ બેંક પેમેન્ટ',
      f3Detail: 'ખરીદદારના પૈસા અગાઉથી જ બેંકમાં સુરક્ષિત હોય છે અને ડિલિવરી થતાં જ તમારા ખાતામાં જમા થાય છે.',
    },
    workflow: {
      badge: 'વ્યવહાર પ્રક્રિયા',
      title1: 'ખેતરથી સીધા',
      titleHighlight: 'બેંક ખાતામાં પૈસા',
      subtitle: 'દરેક પગલું સ્વચાલિત, ચકાસાયેલું અને 100% સુરક્ષિત છે.',
      steps: [
        { step: '01', badge: 'પગલું 1', title: 'વ્હોટ્સએપ પર ફોટો મોકલો', description: 'પાકનો ફોટો અને વજન વ્હોટ્સએપ પર મોકલો.' },
        { step: '02', badge: 'પગલું 2', title: 'એઆઈ ગુણવત્તા પ્રમાણપત્ર', description: 'સિસ્ટમ સેકન્ડોમાં ગુણવત્તાનો ગ્રેડ નક્કી કરે છે.' },
        { step: '03', badge: 'પગલું 3', title: 'લાઇવ મંડી ભાવ', description: 'વાસ્તવિક મંડી ભાવ જુઓ અને શ્રેષ્ઠ બોલી પસંદ કરો.' },
        { step: '04', badge: 'પગલું 4', title: 'બેંક વૉલ્ટમાં રકમ', description: 'ખરીદદાર અગાઉથી પૂરા પૈસા બેંકમાં જમા કરાવે છે.' },
        { step: '05', badge: 'પગલું 5', title: 'સહિયારું પરિવહન', description: 'ટ્રક તમારા ખેતરમાંથી માલ ઉપાડવા આવે છે.' },
        { step: '06', badge: 'પગલું 6', title: 'તરત જ બેંક ક્રેડિટ', description: 'કોડ આપતાં જ પૂરા પૈસા સીધા બેંક ખાતામાં પહોંચી જાય છે.' }
      ],
      bannerTitle: 'આજે જ પાક વેચવા માંગો છો?',
      bannerSub: 'ખેડૂતો માટે તદ્દન મફત. વ્હોટ્સએપ પર 30 સેકન્ડમાં શરૂ કરો.',
      bannerCta: 'વ્હોટ્સએપ પર શરૂ કરો'
    },
    trust: {
      tag: 'સુરક્ષા અને વિશ્વાસ',
      title: 'દરેક સ્તરે સુરક્ષિત',
      subtitle: 'તમારા પાક અને ચુકવણીની સંપૂર્ણ સુરક્ષા.',
      t1Title: 'ડિજીલોકર કેવાયસી',
      t1Desc: 'તમામ ખેડૂતો અને ખરીદદારોની સરકારી ઓળખ ચકાસણી.',
      t2Title: 'આરબીઆઈ એસ્ક્રો ધોરણો',
      t2Desc: 'ખરીદદારના પૈસા અગાઉથી બેંકમાં સુરક્ષિત રહે છે.',
      t3Title: 'એગમાર્કનેટ લાઇવ ભાવ',
      t3Desc: 'સરકારી મંડીઓમાંથી સીધા અપડેટ થતા બજાર ભાવો.',
      t4Title: '24/7 ગુજરાતીમાં સહાય',
      t4Desc: 'તમારી પોતાની ભાષામાં ફોન અને ચેટ પર મદદ.',
    },
    diff: {
      badge: 'મહત્વનો તફાવત',
      title1: 'માત્ર એક બજાર નથી,',
      titleHighlight: 'એક સંપૂર્ણ સુરક્ષિત વેપાર પ્રણાલી.',
      subtitle: 'પરંપરાગત મંડી અને કૃષિ નીતિ વચ્ચેનો તફાવત જુઓ.',
      headers: { feature: 'વિશેષતા', traditional: 'પરંપરાગત મંડી', marketplace: 'સામાન્ય ઓનલાઇન સાઇટ', krishiniti: 'કૃષિ નીતિ' },
      rows: [
        { feature: 'ગુણવત્તા તપાસ', traditional: 'દલાલો દ્વારા મનસ્વી રીતે ભાવ ઘટાડવો', marketplace: 'કોઈ ખાતરી વિના', krishiniti: 'YOLOv8 એઆઈ વિઝન પ્રમાણપત્ર' },
        { feature: 'પેમેન્ટ સુરક્ષા', traditional: '15-45 દિવસનો વિલંબ; પૈસા ડૂબવાનું જોખમ', marketplace: 'અસુરક્ષિત ઓફલાઇન સોદા', krishiniti: '100% રકમ આરબીઆઈ બેંક વૉલ્ટમાં સુરક્ષિત' },
        { feature: 'ભાવની પારદર્શિતા', traditional: 'દલાલોની મનમાની અને કમિશન', marketplace: 'જૂના સ્થિર ભાવો', krishiniti: 'લાઇવ સરકારી મંડી ભાવ' },
        { feature: 'પરિવહન ખર્ચ', traditional: 'મોંઘો વ્યક્તિગત વાહન ખર્ચ', marketplace: 'પરિવહનની કોઈ સુવિધા નથી', krishiniti: 'સહિયારા રૂટથી 35% ખર્ચ બચત' },
        { feature: 'ઉપયોગમાં સરળ', traditional: 'મંડીઓમાં ધક્કા ખાવાની હાલાકી', marketplace: 'અંગ્રેજીમાં અઘરા ફોર્મ્સ', krishiniti: 'સીધા વ્હોટ્સએપ પર 8 ભાષાઓમાં' }
      ]
    },
    faq: {
      badge: 'સામાન્ય પ્રશ્નો',
      title: 'ખેડૂતોના વારંવાર પૂછાતા પ્રશ્નો',
      subtitle: 'કૃષિ નીતિ વિશે જાણવા જેવી મુખ્ય બાબતો.',
      questions: [
        { category: 'શરૂઆત', question: 'શું મારે કોઈ એપ ડાઉનલોડ કરવી પડશે?', answer: 'ના. બધું તમારા સામાન્ય વ્હોટ્સએપ પર તમારી ભાષામાં ચાલે છે.' },
        { category: 'પેમેન્ટ', question: 'પૈસા મળવાની શું ગેરંટી?', answer: 'ખરીદદારના પૈસા પહેલેથી જ બેંકમાં જમા હોય છે અને કોડ આપતાં જ ખાતામાં આવે છે.' },
        { category: 'કેમેરા', question: 'શું સાદો ફોન કેમેરો ચાલશે?', answer: 'હા, દિવસના અજવાળામાં ફક્ત એક સારો ફોટો પાડો.' },
        { category: 'પરિવહન', question: 'સહિયારું પરિવહન કેવી રીતે કાર્ય કરે છે?', answer: 'આસપાસના ખેડૂતોનો પાક એક જ ટ્રકમાં જોડીને 35% ભાડું બચાવવામાં આવે છે.' }
      ]
    },
    ctaBand: {
      title: 'શું તમે સાચા ભાવે પાક વેચવા માંગો છો?',
      subtitle: '500+ ખેડૂતો સાથે જોડાવો જે સુરક્ષિત બેંક પેમેન્ટ મેળવી રહ્યા છે.',
      button: 'વ્હોટ્સએપ પર અત્યારે જ શરૂ કરો',
      phonePlaceholder: 'કોલ માટે તમારો 10 અંકનો મોબાઈલ નંબર દાખલ કરો...',
      phoneButton: 'મફત કોલ વિનંતી',
      phoneSuccess: '✓ વિનંતી મળી! અમારા કૃષિ નિષ્ણાતો ટૂંક સમયમાં તમને કોલ કરશે.',
    },
    showcase: {
      badge: 'લાઇવ સેન્ડબોક્સ',
      title: 'કૃષિ નીતિનો લાઈવ અનુભવ કરો',
      subtitle: 'લાઇવ ભાવ એન્જિન, એઆઈ સ્કેનર અને એસ્ક્રો વૉલ્ટનું નિદર્શન.',
      tabPrice: '01. એગમાર્કનેટ ભાવ એન્જિન',
      tabAi: '02. YOLOv8 એઆઈ સ્કેનર',
      tabEscrow: '03. માઇલસ્ટોન એસ્ક્રો વૉલ્ટ'
    },
    portals: {
      badge: 'પોર્ટલ ગેટવે',
      title: 'તમારું ડેશબોર્ડ ખોલો',
      subtitle: 'ખેડૂત, ખરીદદાર, એફપીઓ, ટ્રાન્સપોર્ટર અને વેરહાઉસ માટે ખાસ પોર્ટલ.',
      launch: 'પોર્ટલ ખોલો'
    }
  },

  ta: {
    nav: {
      home: 'முகப்பு',
      howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
      features: 'அம்சங்கள்',
      security: 'பாதுகாப்பு',
      help: 'உதவி',
      forJudges: 'நடுவர்கள் மற்றும் கூட்டாளர்களுக்கு ↗',
      signIn: 'உள்நுழைக',
      dashboard: 'டாஷ்போர்டு',
      getStarted: 'வாட்ஸ்அப்பில் தொடங்கவும்',
    },
    hero: {
      tag: '🌾 இந்திய விவசாயிகளுக்கான நம்பகமான தளம்',
      title: 'உங்கள் பயிரை விற்கவும்',
      titleHighlight: 'சரியான சந்தை விலையில்.',
      subtitle: 'வாட்ஸ்அப்பில் பட்டியலிடுங்கள். AI தரப் பரிசோதனை. வங்கியில் பாதுகாப்பான பணம்.',
      farmerCta: 'வாட்ஸ்அப் மூலம் பயிரை விற்கவும்',
      farmerCtaSub: 'இலவசம் • ஆப் தேவையில்லை • வெறும் 30 வினாடிகள்',
      buyerLink: 'நீங்கள் வாங்குபவரா? சந்தையை பார்க்கவும் →',
      microTrust: '✓ ஆதார் KYC • ✓ 100% பாதுகாப்பான வங்கி எஸ்க்ரோ • ✓ நேரடி மண்டி விலை',
    },
    showcaseVisual: {
      step1Title: '01. வாட்ஸ்அப்பில் செய்தி அனுப்புங்கள்',
      step1Sub: 'பயிர் புகைப்படம் மற்றும் எடையை அனுப்பவும்',
      step2Title: '02. AI தர ஆய்வு',
      step2Sub: 'உடனடி அரசு விலை மற்றும் தரம்',
      step3Title: '03. நேரடி வங்கி கட்டணம்',
      step3Sub: 'பொருள் சேர்ந்தவுடன் 100% பணம் வங்கியில்',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'விவசாயிகள் இணைந்தனர்',
      stat2Val: '₹1.42 கோடி+',
      stat2Label: 'விவசாயிகளுக்கு வழங்கப்பட்டது',
      stat3Val: '35%',
      stat3Label: 'போக்குவரத்து செலவு மிச்சம்',
      stat4Val: '100%',
      stat4Label: 'உறுதியான பணப் பாதுகாப்பு',
    },
    features: {
      tag: 'தளத்தின் சிறப்பம்சங்கள்',
      title: 'ஒவ்வொரு விவசாயிக்கும் எளியது',
      subtitle: 'கடினமான செயலிகள் இன்றி வயலில் நேரடியாகப் பயன்படுத்தும் எளிய கருவிகள்.',
      f1Title: 'நொடிகளில் பதிவு',
      f1Sub: 'நேரடியாக வாட்ஸ்அப்பில்',
      f1Detail: 'பயிரின் புகைப்படத்தை எடுத்து எங்கள் வாட்ஸ்அப் எண்ணிற்கு அனுப்பவும். எந்த படிவமும் தேவையில்லை.',
      f2Title: 'சரியான AI விலை',
      f2Sub: 'தரத்திற்கான சான்று',
      f2Detail: 'கம்ப்யூட்டர் விஷன் போனில் தரத்தை சரிபார்த்து அரசு சந்தை விலைக்கு ஏற்ப சரியான விலையை உறுதி செய்கிறது.',
      f3Title: 'பாதுகாப்பான எஸ்க்ரோ பணம்',
      f3Sub: 'உறுதிசெய்யப்பட்ட வங்கி பணம்',
      f3Detail: 'வாங்குபவரின் பணம் முன்பே வங்கியில் பாதுகாப்பாக வைக்கப்பட்டு, விநியோகத்தின் போது நேரடியாக வங்கி கணக்கில் சேரும்.',
    },
    workflow: {
      badge: 'பரிவர்த்தனை செயல்முறை',
      title1: 'வயலில் இருந்து நேரடியாக',
      titleHighlight: 'வங்கி கணக்கிற்கு பணம்',
      subtitle: 'ஒவ்வொரு படியும் தானியங்கி, சரிபார்க்கப்பட்ட மற்றும் 100% பாதுகாப்பானது.',
      steps: [
        { step: '01', badge: 'படி 1', title: 'வாட்ஸ்அப்பில் புகைப்படம் அனுப்பவும்', description: 'பயிரின் படம் மற்றும் எடையை வாட்ஸ்அப்பில் பகிரவும்.' },
        { step: '02', badge: 'படி 2', title: 'AI தர சான்றிதழ்', description: 'கணினி நொடிகளில் பயிரின் தரத்தை நிர்ணயிக்கிறது.' },
        { step: '03', badge: 'படி 3', title: 'நேரடி மண்டி விலை', description: 'நேரடி சந்தை விலையை பார்த்து சிறந்த ஏலத்தை தேர்ந்தெடுக்கவும்.' },
        { step: '04', badge: 'படி 4', title: 'வங்கி பெட்டகத்தில் பணம்', description: 'வாங்குபவர் முன்பே முழு தொகையையும் வங்கியில் செலுத்துகிறார்.' },
        { step: '05', badge: 'படி 5', title: 'கூட்டு போக்குவரத்து', description: 'லாரி உங்கள் வயலில் வந்து பொருட்களை ஏற்றிக்கொள்ளும்.' },
        { step: '06', badge: 'படி 6', title: 'உடனடி வங்கி வரவு', description: 'குறியீட்டை உறுதிசெய்தவுடன் முழுப் பணமும் நேரடியாக வங்கியில் சேரும்.' }
      ],
      bannerTitle: 'இன்றே பயிரை விற்க விரும்புகிறீர்களா?',
      bannerSub: 'விவசாயிகளுக்கு முற்றிலும் இலவசம். வாட்ஸ்அப்பில் 30 வினாடிகளில் தொடங்குங்கள்.',
      bannerCta: 'வாட்ஸ்அப்பில் தொடங்கவும்'
    },
    trust: {
      tag: 'பாதுகாப்பு & நம்பிக்கை',
      title: 'ஒவ்வொரு நிலையிலும் பாதுகாப்பு',
      subtitle: 'உங்கள் பயிர் மற்றும் பணத்திற்கான முழுமையான பாதுகாப்பு.',
      t1Title: 'டிஜிலாக்கர் KYC',
      t1Desc: 'அனைத்து விவசாயிகள் மற்றும் வாங்குபவர்களின் அரசு அடையாள சரிபார்ப்பு.',
      t2Title: 'ஆர்பிஐ எஸ்க்ரோ விதிகள்',
      t2Desc: 'வாங்குபவரின் பணம் முன்பே வங்கியில் பாதுகாப்பாக இருக்கும்.',
      t3Title: 'அக்மார்க்நெட் நேரடி விலை',
      t3Desc: 'அரசு மண்டிகளில் இருந்து நேரடியாக புதுப்பிக்கப்படும் சந்தை விலைகள்.',
      t4Title: '24/7 தமிழில் உதவி',
      t4Desc: 'உங்கள் தாய்மொழியில் தொலைபேசி மற்றும் சாட் மூலம் உதவி.',
    },
    diff: {
      badge: 'முக்கிய வேறுபாடு',
      title1: 'வெறும் சந்தை மட்டுமல்ல,',
      titleHighlight: 'முழுமையான பாதுகாப்பான வர்த்தக தளம்.',
      subtitle: 'வழக்கமான மண்டிக்கும் கிருஷி நீதிக்கும் உள்ள வேறுபாட்டைப் பாருங்கள்.',
      headers: { feature: 'அம்சம்', traditional: 'வழக்கமான மண்டி', marketplace: 'சாதாரண ஆன்லைன் தளம்', krishiniti: 'கிருஷி நீதி' },
      rows: [
        { feature: 'தரப் பரிசோதனை', traditional: 'தரகர்களால் தன்னிச்சையாக விலை குறைப்பு', marketplace: 'எந்த உத்தரவாதமும் இல்லை', krishiniti: 'YOLOv8 AI விஷன் சான்றிதழ்' },
        { feature: 'பணப் பாதுகாப்பு', traditional: '15-45 நாட்கள் தாமதம்; பணம் இழக்கும் ஆபத்து', marketplace: 'பாதுகாப்பற்ற ஆஃப்லைன் ஒப்பந்தங்கள்', krishiniti: '100% தொகை ஆர்பிஐ வங்கி பெட்டகத்தில் பாதுகாப்பு' },
        { feature: 'விலை வெளிப்படைத்தன்மை', traditional: 'தரகர்களின் கமிஷன் மற்றும் சுரண்டல்', marketplace: 'பழைய நிலையான விலைகள்', krishiniti: 'நேரடி அரசு மண்டி விலைகள்' },
        { feature: 'போக்குவரத்து செலவு', traditional: 'விலையுயர்ந்த தனிப்பட்ட லாரி வாடகை', marketplace: 'போக்குவரத்து வசதி இல்லை', krishiniti: 'கூட்டு வழித்தடத்தால் 35% செலவு மிச்சம்' },
        { feature: 'பயன்படுத்த எளிது', traditional: 'மண்டிகளில் அலைய வேண்டிய சிரமம்', marketplace: 'கடினமான ஆங்கில படிவங்கள்', krishiniti: 'வாட்ஸ்அப்பில் 8 மொழிகளில் எளிதாக' }
      ]
    },
    faq: {
      badge: 'பொதுவான கேள்விகள்',
      title: 'விவசாயிகள் அடிக்கடி கேட்கும் கேள்விகள்',
      subtitle: 'கிருஷி நீதி பற்றி தெரிந்து கொள்ள வேண்டியவை.',
      questions: [
        { category: 'தொடக்க', question: 'நான் ஏதேனும் ஆப் பதிவிறக்க வேண்டுமா?', answer: 'இல்லை. அனைத்தும் உங்கள் வழக்கமான வாட்ஸ்அப்பில் உங்கள் மொழியிலேயே இயங்கும்.' },
        { category: 'பணம்', question: 'பணம் கிடைப்பதற்கான உத்தரவாதம் என்ன?', answer: 'வாங்குபவரின் பணம் முன்பே வங்கியில் இருக்கும். பொருள் சேர்ந்தவுடன் குறியீட்டை உறுதிசெய்தால் உடனே வங்கி கணக்கிற்கு வரும்.' },
        { category: 'கேமரா', question: 'சாதாரண போன் கேமரா போதுமா?', answer: 'ஆம், பகல் வெளிச்சத்தில் ஒரு தெளிவான புகைப்படம் எடுத்தால் போதும்.' },
        { category: 'போக்குவரத்து', question: 'கூட்டு போக்குவரத்து எப்படி செயல்படுகிறது?', answer: 'அருகிலுள்ள விவசாயிகளின் பொருட்களை ஒரே லாரியில் இணைத்து 35% வாடகை சேமிக்கப்படுகிறது.' }
      ]
    },
    ctaBand: {
      title: 'உங்கள் பயிரை சரியான விலைக்கு விற்கத் தயாரா?',
      subtitle: 'பாதுகாப்பான வங்கி பணம் பெறும் 500+ விவசாயிகளுடன் இணையுங்கள்.',
      button: 'வாட்ஸ்அப்பில் இப்போதே தொடங்குங்கள்',
      phonePlaceholder: 'அழைப்பிற்கு உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்...',
      phoneButton: 'இலவச அழைப்பு கோரிக்கை',
      phoneSuccess: '✓ கோரிக்கை பெறப்பட்டது! எங்கள் வேளாண் நிபுணர்கள் விரைவில் உங்களை அழைப்பார்கள்.',
    },
    showcase: {
      badge: 'நேரடி சாண்ட்பாக்ஸ்',
      title: 'கிருஷி நீதியை நேரலையில் பாருங்கள்',
      subtitle: 'நேரடி விலை எஞ்சின், AI ஸ்கேனர் மற்றும் எஸ்க்ரோ பெட்டகத்தின் நேரடி காட்சி.',
      tabPrice: '01. அக்மார்க்நெட் விலை எஞ்சின்',
      tabAi: '02. YOLOv8 AI ஸ்கேனர்',
      tabEscrow: '03. எஸ்க்ரோ வங்கி பெட்டகம்'
    },
    portals: {
      badge: 'போர்டல் நுழைவு',
      title: 'உங்கள் டாஷ்போர்டைத் திறக்கவும்',
      subtitle: 'விவசாயி, வாங்குபவர், FPO, டிரான்ஸ்போர்ட்டர் மற்றும் கிடங்குக்கான பிரத்யேக போர்ட்டல்கள்.',
      launch: 'போர்ட்டலைத் திறக்கவும்'
    }
  },

  te: {
    nav: {
      home: 'హోమ్',
      howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
      features: 'ఫీచర్లు',
      security: 'భద్రత',
      help: 'సహాయం',
      forJudges: 'న్యాయనిర్ణేతలు & భాగస్వాముల కోసం ↗',
      signIn: 'సైన్ ఇన్',
      dashboard: 'డ్యాష్‌బోర్డ్',
      getStarted: 'వాట్సాప్‌లో ప్రారంభించండి',
    },
    hero: {
      tag: '🌾 భారతీయ రైతుల కోసం నమ్మకమైన వేదిక',
      title: 'మీ పంటను అమ్మండి',
      titleHighlight: 'సరైన మార్కెట్ ధరకు.',
      subtitle: 'వాట్సాప్‌లో నమోదు చేయండి. AI నాణ్యత తనిఖీ. బ్యాంకులో సురక్షిత చెల్లింపు.',
      farmerCta: 'వాట్సాప్ ద్వారా పంటను అమ్మండి',
      farmerCtaSub: 'ఉచితం • యాప్ డౌన్‌లోడ్ అవసరం లేదు • కేవలం 30 సెకన్లు',
      buyerLink: 'మీరు కొనుగోలుదారులా? మార్కెట్ చూడండి →',
      microTrust: '✓ ఆధార్ KYC • ✓ 100% సురక్షిత బ్యాంక్ ఎస్క్రో • ✓ ప్రత్యక్ష మార్కెట్ ధరలు',
    },
    showcaseVisual: {
      step1Title: '01. వాట్సాప్‌లో మెసేజ్ చేయండి',
      step1Sub: 'పంట ఫోటో మరియు పరిమాణాన్ని పంపండి',
      step2Title: '02. AI నాణ్యత తనిఖీ',
      step2Sub: 'తక్షణ ప్రభుత్వ ధర మరియు గ్రేడ్',
      step3Title: '03. నేరుగా బ్యాంక్ ఖాతాలో చెల్లింపు',
      step3Sub: 'సరుకు చేరిన వెంటనే 100% మొత్తం ఖాతాలో జమ',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'రైతులు చేరారు',
      stat2Val: '₹1.42 కోట్లు+',
      stat2Label: 'రైతులకు చెల్లించబడింది',
      stat3Val: '35%',
      stat3Label: 'రవాణా ఖర్చు ఆదా',
      stat4Val: '100%',
      stat4Label: 'చెల్లింపు భద్రతా హామీ',
    },
    features: {
      tag: 'ప్లాట్‌ఫారమ్ ఫీచర్లు',
      title: 'ప్రతి రైతుకు సులభం',
      subtitle: 'కష్టమైన యాప్‌లు లేకుండా నేరుగా పొలంలో ఉపయోగించడానికి రూపొందించిన సాధనాలు.',
      f1Title: 'క్షణాల్లో నమోదు',
      f1Sub: 'నేరుగా వాట్సాప్‌లో',
      f1Detail: 'పంట ఫోటో తీసి మా వాట్సాప్ నంబర్‌కు పంపండి. ఎలాంటి ఫారమ్‌లు నింపాల్సిన పనిలేదు.',
      f2Title: 'సరైన AI ధర',
      f2Sub: 'నాణ్యతకు తిరుగులేని రుజువు',
      f2Detail: 'కంప్యూటర్ విజన్ ఫోన్‌లోనే నాణ్యతను తనిఖీ చేసి ప్రభుత్వ మార్కెట్ ధరకు సరిపోయే ధరను అందిస్తుంది.',
      f3Title: 'సురక్షిత ఎస్క్రో చెల్లింపు',
      f3Sub: 'హామీ ఇవ్వబడిన బ్యాంక్ చెల్లింపు',
      f3Detail: 'కొనుగోలుదారుని డబ్బు ముందుగానే బ్యాంకులో భద్రంగా ఉంటుంది మరియు డెలివరీ కాగానే నేరుగా మీ ఖాతాలో జమ అవుతుంది.',
    },
    workflow: {
      badge: 'లావాదేవీల ప్రక్రియ',
      title1: 'పొలం నుండి నేరుగా',
      titleHighlight: 'బ్యాంక్ ఖాతాలోకి డబ్బులు',
      subtitle: 'ప్రతి దశ ఆటోమేటిక్, ధృవీకరించబడినది మరియు 100% సురక్షితమైనది.',
      steps: [
        { step: '01', badge: 'దశ 1', title: 'వాట్సాప్‌లో ఫోటో పంపండి', description: 'పంట ఫోటో మరియు బరువును వాట్సాప్‌లో పంపండి.' },
        { step: '02', badge: 'దశ 2', title: 'AI నాణ్యత సర్టిఫికెట్', description: 'సిస్టమ్ క్షణాల్లో నాణ్యత గ్రేడ్‌ను నిర్ణయిస్తుంది.' },
        { step: '03', badge: 'దశ 3', title: 'ప్రత్యక్ష మార్కెట్ ధరలు', description: 'లైవ్ మార్కెట్ రేట్లు చూసి ఉత్తమ బిడ్‌ను ఎంచుకోండి.' },
        { step: '04', badge: 'దశ 4', title: 'బ్యాంక్ వాల్ట్‌లో నిధులు', description: 'కొనుగోలుదారు ముందుగానే పూర్తి డబ్బును బ్యాంకులో జమ చేస్తారు.' },
        { step: '05', badge: 'దశ 5', title: 'ఉమ్మడి రవాణా', description: 'లారీ మీ పొలం వద్దకు వచ్చి సరుకును లోడ్ చేసుకుంటుంది.' },
        { step: '06', badge: 'దశ 6', title: 'తక్షణ బ్యాంక్ క్రెడిట్', description: 'కోడ్ ఇవ్వగానే పూర్తి డబ్బు నేరుగా బ్యాంక్ ఖాతాలో జమ అవుతుంది.' }
      ],
      bannerTitle: 'ఈరోజే పంటను విక్రయించాలనుకుంటున్నారా?',
      bannerSub: 'రైతులకు పూర్తిగా ఉచితం. వాట్సాప్‌లో 30 సెకన్లలో ప్రారంభించండి.',
      bannerCta: 'వాట్సాప్‌లో ప్రారంభించండి'
    },
    trust: {
      tag: 'భద్రత & విశ్వాసం',
      title: 'ప్రతి స్థాయిలో రక్షణ',
      subtitle: 'మీ పంట మరియు చెల్లింపుల పూర్తి రక్షణ.',
      t1Title: 'డిజిలాకర్ KYC',
      t1Desc: 'రైతులు మరియు కొనుగోలుదారులందరి అధికారిక గుర్తింపు ధృవీకరణ.',
      t2Title: 'RBI ఎస్క్రో ప్రమాణాలు',
      t2Desc: 'కొనుగోలుదారుని డబ్బు ముందుగానే బ్యాంకులో భద్రంగా ఉంటుంది.',
      t3Title: 'అగ్‌మార్క్‌నెట్ లైవ్ ధరలు',
      t3Desc: 'ప్రభుత్వ మార్కెట్ల నుండి నేరుగా అప్‌డేట్ అయ్యే ధరలు.',
      t4Title: '24/7 తెలుగులో సహాయం',
      t4Desc: 'మీ సొంత భాషలో ఫోన్ మరియు చాట్ ద్వారా ఉచిత సహాయం.',
    },
    diff: {
      badge: 'ముఖ్యమైన తేడా',
      title1: 'కేవలం ఒక మార్కెట్ మాత్రమే కాదు,',
      titleHighlight: 'ఒక సంపూర్ణ సురక్షిత వాణిజ్య వేదిక.',
      subtitle: 'సాంప్రదాయ మార్కెట్‌కు మరియు కృషి నీతికి మధ్య తేడాను చూడండి.',
      headers: { feature: 'ఫీచర్', traditional: 'సాంప్రదాయ మార్కెట్', marketplace: 'సాధారణ ఆన్‌లైన్ సైట్', krishiniti: 'కృషి నీతి' },
      rows: [
        { feature: 'నాణ్యత తనిఖీ', traditional: 'దళారులు ఇష్టానుసారంగా ధర తగ్గించడం', marketplace: 'ఎలాంటి గ్యారెంటీ లేని క్లెయిమ్‌లు', krishiniti: 'YOLOv8 AI విజన్ సర్టిఫికెట్' },
        { feature: 'చెల్లింపు భద్రత', traditional: '15-45 రోజులు ఆలస్యం; డబ్బులు ఎగవేసే ప్రమాదం', marketplace: 'అసురక్షిత ఆఫ్‌లైన్ ఒప్పందాలు', krishiniti: '100% మొత్తం RBI బ్యాంక్ వాల్ట్‌లో భద్రం' },
        { feature: 'ధర పారదర్శకత', traditional: 'దళారుల కమీషన్లు మరియు దోపిడీ', marketplace: 'పాత స్థిరమైన ధరలు', krishiniti: 'ప్రత్యక్ష ప్రభుత్వ మార్కెట్ ధరలు' },
        { feature: 'రవాణా ఖర్చు', traditional: 'రైతులకే భారమైన రవాణా ఖర్చులు', marketplace: 'రవాణా సౌకర్యం ఉండదు', krishiniti: 'ఉమ్మడి రూట్ల ద్వారా 35% ఖర్చు ఆదా' },
        { feature: 'ఉపయోగించడానికి సులభం', traditional: 'మార్కెట్లలో పడిగాపులు కాయడం', marketplace: 'ఇంగ్లీషులో కష్టమైన ఫారమ్‌లు', krishiniti: 'వాట్సాప్‌లో 8 భాషల్లో చాలా సులభం' }
      ]
    },
    faq: {
      badge: 'సాధారణ ప్రశ్నలు',
      title: 'రైతులు తరచుగా అడిగే ప్రశ్నలు',
      subtitle: 'కృషి నీతి గురించి తెలుసుకోవలసిన ముఖ్య విషయాలు.',
      questions: [
        { category: 'ప్రారంభం', question: 'నేను ఏదైనా యాప్ డౌన్‌లోడ్ చేసుకోవాలా?', answer: 'అవసరం లేదు. అంతా మీ సాధారణ వాట్సాప్‌లోనే మీ భాషలో నడుస్తుంది.' },
        { category: 'చెల్లింపు', question: 'డబ్బులు అందుతాయనే గ్యారెంటీ ఏమిటి?', answer: 'కొనుగోలుదారుని డబ్బు ముందే బ్యాంకులో ఉంటుంది. డెలివరీ కాగానే కోడ్ నిర్ధారించగానే వెంటనే ఖాతాలో పడతాయి.' },
        { category: 'కెమెరా', question: 'సాధారణ ఫోన్ కెమెరా సరిపోతుందా?', answer: 'అవును, పగటి వెలుతురులో ఒక స్పష్టమైన ఫోటో తీస్తే సరిపోతుంది.' },
        { category: 'రవాణా', question: 'ఉమ్మడి రవాణా ఎలా పనిచేస్తుంది?', answer: 'చుట్టుపక్కల రైతుల పంటను ఒకే లారీలో కలపడం ద్వారా 35% రవాణా ఖర్చు ఆదా అవుతుంది.' }
      ]
    },
    ctaBand: {
      title: 'మీ పంటను సరైన ధరకు అమ్మాలనుకుంటున్నారా?',
      subtitle: 'సురక్షిత బ్యాంక్ చెల్లింపులు పొందుతున్న 500+ రైతులతో చేరండి.',
      button: 'వాట్సాప్‌లో ఇప్పుడే ప్రారంభించండి',
      phonePlaceholder: 'కాల్ కోసం మీ 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి...',
      phoneButton: 'ఉచిత కాల్ అభ్యర్థన',
      phoneSuccess: '✓ అభ్యర్థన అందింది! మా వ్యవసాయ నిపుణులు త్వరలోనే మీకు కాల్ చేస్తారు.',
    },
    showcase: {
      badge: 'లైవ్ శాండ్‌బాక్స్',
      title: 'కృషి నీతిని లైవ్‌గా చూడండి',
      subtitle: 'లైవ్ ధరల ఇంజిన్, AI స్కానర్ మరియు ఎస్క్రో వాల్ట్ ప్రత్యక్ష ప్రదర్శన.',
      tabPrice: '01. అగ్‌మార్క్‌నెట్ ధరల ఇంజిన్',
      tabAi: '02. YOLOv8 AI స్కానర్',
      tabEscrow: '03. మైల్‌స్టోన్ ఎస్క్రో వాల్ట్'
    },
    portals: {
      badge: 'పోర్టల్ గేట్‌వే',
      title: 'మీ డ్యాష్‌బోర్డ్‌ను తెరవండి',
      subtitle: 'రైతు, కొనుగోలుదారు, FPO, ట్రాన్స్‌పోర్టర్ మరియు వేర్‌హౌస్ కోసం ప్రత్యేక పోర్టల్‌లు.',
      launch: 'పోర్టల్‌ను తెరవండి'
    }
  },

  kn: {
    nav: {
      home: 'ಮುಖಪುಟ',
      howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
      security: 'ಸುರಕ್ಷತೆ',
      help: 'ಸಹಾಯ',
      forJudges: 'ತೀರ್ಪುಗಾರರು ಮತ್ತು ಪಾಲುದಾರರಿಗೆ ↗',
      signIn: 'ಸೈನ್ ಇನ್',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      getStarted: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ',
    },
    hero: {
      tag: '🌾 ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ',
      title: 'ನಿಮ್ಮ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ',
      titleHighlight: 'ಸರಿಯಾದ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗೆ.',
      subtitle: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಿ. AI ಗುಣಮಟ್ಟ ತಪಾಸಣೆ. ಬ್ಯಾಂಕಿನಲ್ಲಿ ಸುರಕ್ಷಿತ ಪಾವತಿ.',
      farmerCta: 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ',
      farmerCtaSub: 'ಉಚಿತ • ಯಾವುದೇ ಆ್ಯಪ್ ಅಗತ್ಯವಿಲ್ಲ • ಕೇವಲ 30 ಸೆಕೆಂಡುಗಳು',
      buyerLink: 'ನೀವು ಖರೀದಿದಾರರೇ? ಮಾರುಕಟ್ಟೆ ನೋಡಿ →',
      microTrust: '✓ ಆಧಾರ್ KYC • ✓ 100% ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕ್ ಎಸ್ಕ್ರೋ • ✓ ನೇರ ಮಂಡಿ ದರಗಳು',
    },
    showcaseVisual: {
      step1Title: '01. ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಿ',
      step1Sub: 'ಬೆಳೆಯ ಫೋಟೋ ಮತ್ತು ಪ್ರಮಾಣವನ್ನು ಕಳುಹಿಸಿ',
      step2Title: '02. AI ಗುಣಮಟ್ಟ ತಪಾಸಣೆ',
      step2Sub: 'ತಕ್ಷಣದ ಸರ್ಕಾರಿ ಬೆಲೆ ಮತ್ತು ಗ್ರೇಡ್',
      step3Title: '03. ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿ',
      step3Sub: 'ಮಾಲು ತಲುಪಿದ ತಕ್ಷಣ 100% ಹಣ ಖಾತೆಗೆ',
    },
    stats: {
      stat1Val: '500+',
      stat1Label: 'ರೈತರು ಜೋಡಣೆಗೊಂಡಿದ್ದಾರೆ',
      stat2Val: '₹1.42 ಕೋಟಿ+',
      stat2Label: 'ರೈತರಿಗೆ ಪಾವತಿಸಲಾಗಿದೆ',
      stat3Val: '35%',
      stat3Label: 'ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿತಾಯ',
      stat4Val: '100%',
      stat4Label: 'ಖಚಿತ ಪಾವತಿ ಭರವಸೆ',
    },
    features: {
      tag: 'ವೇದಿಕೆಯ ವೈಶಿಷ್ಟ್ಯಗಳು',
      title: 'ಪ್ರತಿಯೊಬ್ಬ ರೈತರಿಗೂ ಸುಲಭ',
      subtitle: 'ಯಾವುದೇ ಕಷ್ಟಕರವಾದ ಆ್ಯಪ್‌ಗಳಿಲ್ಲದೆ ಹೊಲದಲ್ಲಿ ನೇರವಾಗಿ ಬಳಸಲು ಸರಳ ಸಾಧನಗಳು.',
      f1Title: 'ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ನೋಂದಣಿ',
      f1Sub: 'ನೇರವಾಗಿ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ',
      f1Detail: 'ಬೆಳೆಯ ಫೋಟೋ ತೆಗೆದು ನಮ್ಮ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಿ. ಯಾವುದೇ ಇಂಗ್ಲಿಷ್ ಫಾರ್ಮ್‌ಗಳ ಅಗತ್ಯವಿಲ್ಲ.',
      f2Title: 'ಸರಿಯಾದ AI ಬೆಲೆ',
      f2Sub: 'ಗುಣಮಟ್ಟದ ಖಚಿತ ಪುರಾವೆ',
      f2Detail: 'ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಫೋನ್‌ನಲ್ಲೇ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ ಸರ್ಕಾರಿ ಮಂಡಿ ದರಕ್ಕೆ ತಕ್ಕಂತೆ ಸರಿಯಾದ ಬೆಲೆ ನೀಡುತ್ತದೆ.',
      f3Title: 'ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ಪಾವತಿ',
      f3Sub: 'ಖಾತರಿಯ ಬ್ಯಾಂಕ್ ಪಾವತಿ',
      f3Detail: 'ಖರೀದಿದಾರರ ಹಣ ಮೊದಲೇ ಬ್ಯಾಂಕಿನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ ಮತ್ತು ತಲುಪಿಸಿದ ತಕ್ಷಣ ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
    },
    workflow: {
      badge: 'ವಹಿವಾಟು ಪ್ರಕ್ರಿಯೆ',
      title1: 'ಹೊಲದಿಂದ ನೇರವಾಗಿ',
      titleHighlight: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ',
      subtitle: 'ಪ್ರತಿಯೊಂದು ಹಂತವೂ ಸ್ವಯಂಚಾಲಿತ, ಪರಿಶೀಲಿಸಿದ ಮತ್ತು 100% ಸುರಕ್ಷಿತವಾಗಿದೆ.',
      steps: [
        { step: '01', badge: 'ಹಂತ 1', title: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಫೋಟೋ ಕಳುಹಿಸಿ', description: 'ಬೆಳೆಯ ಫೋಟೋ ಮತ್ತು ತೂಕವನ್ನು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕಳುಹಿಸಿ.' },
        { step: '02', badge: 'ಹಂತ 2', title: 'AI ಗುಣಮಟ್ಟ ಪ್ರಮಾಣಪತ್ರ', description: 'ವ್ಯವಸ್ಥೆಯು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್ ನಿರ್ಧರಿಸುತ್ತದೆ.' },
        { step: '03', badge: 'ಹಂತ 3', title: 'ಲೈವ್ ಮಂಡಿ ದರಗಳು', description: 'ನೈಜ ಮಾರುಕಟ್ಟೆ ದರ ನೋಡಿ ಉತ್ತಮ ಬಿಡ್ ಆಯ್ಕೆಮಾಡಿ.' },
        { step: '04', badge: 'ಹಂತ 4', title: 'ಬ್ಯಾಂಕ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಹಣ', description: 'ಖರೀದಿದಾರರು ಮೊದಲೇ ಪೂರ್ಣ ಹಣವನ್ನು ಬ್ಯಾಂಕಿನಲ್ಲಿ ಠೇವಣಿ ಮಾಡುತ್ತಾರೆ.' },
        { step: '05', badge: 'ಹಂತ 5', title: 'ಜಂಟಿ ಸಾರಿಗೆ', description: 'ಟ್ರಕ್ ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಬಂದು ಮಾಲು ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳುತ್ತದೆ.' },
        { step: '06', badge: 'ಹಂತ 6', title: 'ತಕ್ಷಣದ ಬ್ಯಾಂಕ್ ಜಮೆ', description: 'ಕೋಡ್ ನೀಡಿದ ತಕ್ಷಣ ಪೂರ್ಣ ಹಣ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.' }
      ],
      bannerTitle: 'ಇಂದೇ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ಬಯಸುವಿರಾ?',
      bannerSub: 'ರೈತರಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ. ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ 30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ.',
      bannerCta: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ'
    },
    trust: {
      tag: 'ಸುರಕ್ಷತೆ ಮತ್ತು ವಿಶ್ವಾಸ',
      title: 'ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ ರಕ್ಷಣೆ',
      subtitle: 'ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಪಾವತಿಯ ಸಂಪೂರ್ಣ ಸುರಕ್ಷತೆ.',
      t1Title: 'ಡಿಜಿಲಾಕರ್ KYC',
      t1Desc: 'ಎಲ್ಲಾ ರೈತರು ಮತ್ತು ಖರೀದಿದಾರರ ಅಧಿಕೃತ ಗುರುತಿನ ಪರಿಶೀಲನೆ.',
      t2Title: 'ಆರ್‌ಬಿಐ ಎಸ್ಕ್ರೋ ನಿಯಮಗಳು',
      t2Desc: 'ಖರೀದಿದಾರರ ಹಣ ಮೊದಲೇ ಬ್ಯಾಂಕಿನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.',
      t3Title: 'ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್ ಲೈವ್ ದರಗಳು',
      t3Desc: 'ಸರ್ಕಾರಿ ಮಂಡಿಗಳಿಂದ ನೇರವಾಗಿ ನವೀಕರಿಸಲಾಗುವ ದರಗಳು.',
      t4Title: '24/7 ಕನ್ನಡದಲ್ಲಿ ಸಹಾಯ',
      t4Desc: 'ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಫೋನ್ ಮತ್ತು ಚಾಟ್ ಮೂಲಕ ಉಚಿತ ಮಾರ್ಗದರ್ಶನ.',
    },
    diff: {
      badge: 'ಮುಖ್ಯ ವ್ಯತ್ಯಾಸ',
      title1: 'ಕೇವಲ ಮಾರುಕಟ್ಟೆಯಲ್ಲ,',
      titleHighlight: 'ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ ವಹಿವಾಟು ವ್ಯವಸ್ಥೆ.',
      subtitle: 'ಸಾಂಪ್ರದಾಯಿಕ ಮಂಡಿ ಮತ್ತು ಕೃಷಿ ನೀತಿ ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ನೋಡಿ.',
      headers: { feature: 'ವೈಶಿಷ್ಟ್ಯ', traditional: 'ಸಾಂಪ್ರದಾಯಿಕ ಮಂಡಿ', marketplace: 'ಸಾಮಾನ್ಯ ಆನ್‌ಲೈನ್ ಸೈಟ್', krishiniti: 'ಕೃಷಿ ನೀತಿ' },
      rows: [
        { feature: 'ಗುಣಮಟ್ಟ ತಪಾಸಣೆ', traditional: 'ವರ್ತಕರಿಂದ ಮನಬಂದಂತೆ ಬೆಲೆ ಕಡಿತ', marketplace: 'ಯಾವುದೇ ಖಾತರಿಯಿಲ್ಲದ ಹೇಳಿಕೆಗಳು', krishiniti: 'YOLOv8 AI ವಿಷನ್ ಪ್ರಮಾಣಪತ್ರ' },
        { feature: 'ಪಾವತಿ ಸುರಕ್ಷತೆ', traditional: '15-45 ದಿನ ವಿಳಂಬ; ಹಣ ಕಳೆದುಕೊಳ್ಳುವ ಭೀತಿ', marketplace: 'ಅಸುರಕ್ಷಿತ ಆಫ್‌ಲೈನ್ ಒಪ್ಪಂದಗಳು', krishiniti: '100% ಮೊತ್ತ ಆರ್‌ಬಿಐ ಬ್ಯಾಂಕ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತ' },
        { feature: 'ಬೆಲೆ ಪಾರದರ್ಶಕತೆ', traditional: 'ದಲ್ಲಾಳಿಗಳ ಕಮಿಷನ್ ಮತ್ತು ವಂಚನೆ', marketplace: 'ಹಳೆಯ ಸ್ಥಿರ ದರಗಳು', krishiniti: 'ನೇರ ಸರ್ಕಾರಿ ಮಂಡಿ ದರಗಳು' },
        { feature: 'ಸಾರಿಗೆ ವೆಚ್ಚ', traditional: 'ರೈತರೇ ಭರಿಸಬೇಕಾದ ದುಬಾರಿ ಸಾರಿಗೆ', marketplace: 'ಸಾರಿಗೆ ಸೌಲಭ್ಯವಿಲ್ಲ', krishiniti: 'ಜಂಟಿ ಮಾರ್ಗದಿಂದ 35% ವೆಚ್ಚ ಉಳಿತಾಯ' },
        { feature: 'ಬಳಸಲು ಸುಲಭ', traditional: 'ಮಂಡಿಗಳಲ್ಲಿ ಅಲೆದಾಡುವ ಕಷ್ಟ', marketplace: 'ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕಷ್ಟಕರವಾದ ಫಾರ್ಮ್‌ಗಳು', krishiniti: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ 8 ಭಾಷೆಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ' }
      ]
    },
    faq: {
      badge: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
      title: 'ರೈತರು ಹೆಚ್ಚಾಗಿ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು',
      subtitle: 'ಕೃಷಿ ನೀತಿ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ಪ್ರಮುಖ ವಿಷಯಗಳು.',
      questions: [
        { category: 'ಪ್ರಾರಂಭ', question: 'ನಾನು ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕೇ?', answer: 'ಇಲ್ಲ. ಪ್ರತಿಯೊಂದೂ ನಿಮ್ಮ ಸಾಮಾನ್ಯ ವಾಟ್ಸಾಪ್‌ನಲ್ಲೇ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.' },
        { category: 'ಪಾವತಿ', question: 'ಹಣ ಸಿಗುವ ಗ್ಯಾರಂಟಿ ಏನು?', answer: 'ಖರೀದಿದಾರರ ಹಣ ಮೊದಲೇ ಬ್ಯಾಂಕಿನಲ್ಲಿರುತ್ತದೆ ಮತ್ತು ವಿತರಣೆಯ ಕೋಡ್ ನೀಡಿದ ತಕ್ಷಣ ಖಾತೆಗೆ ಬರುತ್ತದೆ.' },
        { category: 'ಕ್ಯಾಮೆರಾ', question: 'ಸಾಮಾನ್ಯ ಫೋನ್ ಕ್ಯಾಮೆರಾ ಸಾಕೇ?', answer: 'ಹೌದು, ಹಗಲಿನ ಬೆಳಕಿನಲ್ಲಿ ಒಂದು ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆದರೆ ಸಾಕು.' },
        { category: 'ಸಾರಿಗೆ', question: 'ಜಂಟಿ ಸಾರಿಗೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?', answer: 'ಹತ್ತಿರದ ರೈತರ ಬೆಳೆಯನ್ನು ಒಂದೇ ಟ್ರಕ್‌ನಲ್ಲಿ ಜೋಡಿಸುವ ಮೂಲಕ 35% ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿಸಲಾಗುತ್ತದೆ.' }
      ]
    },
    ctaBand: {
      title: 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಸರಿಯಾದ ಬೆಲೆಗೆ ಮಾರಾಟ ಮಾಡಲು ಸಿದ್ಧರೇ?',
      subtitle: 'ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕ್ ಪಾವತಿ ಪಡೆಯುತ್ತಿರುವ 500+ ರೈತರೊಂದಿಗೆ ಸೇರಿ.',
      button: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ',
      phonePlaceholder: 'ಕರೆಗಾಗಿ ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ...',
      phoneButton: 'ಉಚಿತ ಕರೆ ವಿನಂತಿ',
      phoneSuccess: '✓ ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ! ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರು ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತಾರೆ.',
    },
    showcase: {
      badge: 'ಲೈವ್ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್',
      title: 'ಕೃಷಿ ನೀತಿಯನ್ನು ಲೈವ್ ಆಗಿ ನೋಡಿ',
      subtitle: 'ಲೈವ್ ದರ ಇಂಜಿನ್, AI ಸ್ಕ್ಯಾನರ್ ಮತ್ತು ಎಸ್ಕ್ರೋ ವಾಲ್ಟ್‌ನ ನೇರ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ.',
      tabPrice: '01. ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್ ದರ ಇಂಜಿನ್',
      tabAi: '02. YOLOv8 AI ಸ್ಕ್ಯಾನರ್',
      tabEscrow: '03. ಮೈಲ್‌ಸ್ಟೋನ್ ಎಸ್ಕ್ರೋ ವಾಲ್ಟ್'
    },
    portals: {
      badge: 'ಪೋರ್ಟಲ್ ಗೇಟ್‌ವೇ',
      title: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
      subtitle: 'ರೈತ, ಖರೀದಿದಾರ, FPO, ಸಾರಿಗೆದಾರ ಮತ್ತು ಗೋದಾಮಿಗಾಗಿ ವಿಶೇಷ ಪೋರ್ಟಲ್‌ಗಳು.',
      launch: 'ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ'
    }
  }
};
