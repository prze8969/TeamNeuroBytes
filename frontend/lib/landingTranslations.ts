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
      title: 'Sell Your Crop at',
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
      bannerTitle: 'Want to sell your crop today?',
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
      title: 'Ready to sell your crop smarter?',
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

  pa: {} as any,
  gu: {} as any,
  ta: {} as any,
  te: {} as any,
  kn: {} as any,
};

['pa', 'gu', 'ta', 'te', 'kn'].forEach((l) => {
  LANDING_TRANSLATIONS[l as Locale] = LANDING_TRANSLATIONS.hi;
});
