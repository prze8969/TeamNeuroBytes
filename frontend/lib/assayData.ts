export interface CropVarietyOption {
  id: string;
  name: string;
  category: 'Grains & Cereals' | 'Vegetables' | 'Pulses' | 'Oilseeds';
  variety: string;
  mspFloorPerKg: number;
  mandiBenchmarkPerKg: number;
  typicalGrade: 'Grade A' | 'Grade B' | 'Grade C';
  typicalDefectPct: number;
  typicalMoisturePct: number;
  sampleImageUrl: string;
  defectBoxes: {
    top: string;
    left: string;
    width: string;
    height: string;
    label: string;
    conf: string;
  }[];
}

export const CROP_CATEGORIES = [
  'Grains & Cereals',
  'Vegetables',
  'Pulses',
  'Oilseeds'
] as const;

export const CROP_VARIETY_CATALOG: CropVarietyOption[] = [
  {
    id: 'wheat-lok1',
    name: 'Sharbati Wheat (Lok-1)',
    category: 'Grains & Cereals',
    variety: 'Lok-1 Clean Grain',
    mspFloorPerKg: 22.75,
    mandiBenchmarkPerKg: 24.50,
    typicalGrade: 'Grade A',
    typicalDefectPct: 1.4,
    typicalMoisturePct: 11.2,
    sampleImageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '24%', left: '32%', width: '18%', height: '22%', label: 'Plump Grain', conf: '96.2%' },
      { top: '56%', left: '60%', width: '15%', height: '18%', label: 'Uniform Kernel', conf: '94.8%' },
      { top: '40%', left: '72%', width: '10%', height: '12%', label: 'Minor Chaff', conf: '91.4%' }
    ]
  },
  {
    id: 'wheat-lokwan',
    name: 'Lokwan Wheat',
    category: 'Grains & Cereals',
    variety: 'Standard Milling Grade',
    mspFloorPerKg: 22.75,
    mandiBenchmarkPerKg: 23.80,
    typicalGrade: 'Grade B',
    typicalDefectPct: 2.8,
    typicalMoisturePct: 12.0,
    sampleImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '30%', left: '40%', width: '20%', height: '20%', label: 'Milling Kernel', conf: '93.5%' },
      { top: '65%', left: '25%', width: '14%', height: '14%', label: 'Slight Shrivelling', conf: '88.1%' }
    ]
  },
  {
    id: 'rice-basmati',
    name: 'Basmati 1121 Premium Rice',
    category: 'Grains & Cereals',
    variety: 'Extra Long Slender Grain',
    mspFloorPerKg: 42.00,
    mandiBenchmarkPerKg: 68.00,
    typicalGrade: 'Grade A',
    typicalDefectPct: 0.9,
    typicalMoisturePct: 10.8,
    sampleImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '28%', left: '35%', width: '22%', height: '25%', label: 'Aged Slender Grain', conf: '97.5%' },
      { top: '62%', left: '50%', width: '18%', height: '20%', label: 'Zero Chalkiness', conf: '96.0%' }
    ]
  },
  {
    id: 'onion-garva',
    name: 'Nashik Red Onion (Garva)',
    category: 'Vegetables',
    variety: 'Export Grade A Garva',
    mspFloorPerKg: 14.50,
    mandiBenchmarkPerKg: 18.00,
    typicalGrade: 'Grade A',
    typicalDefectPct: 2.1,
    typicalMoisturePct: 14.5,
    sampleImageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '22%', left: '28%', width: '28%', height: '32%', label: 'Firm Outer Tunic', conf: '95.8%' },
      { top: '58%', left: '55%', width: '24%', height: '26%', label: 'Tight Neck Bulb', conf: '94.2%' },
      { top: '35%', left: '68%', width: '12%', height: '14%', label: 'Minor Skin Flake', conf: '89.6%' }
    ]
  },
  {
    id: 'tomato-abhinav',
    name: 'Hybrid Tomato (Abhinav)',
    category: 'Vegetables',
    variety: 'Firm Processing Grade',
    mspFloorPerKg: 10.00,
    mandiBenchmarkPerKg: 14.50,
    typicalGrade: 'Grade A',
    typicalDefectPct: 1.8,
    typicalMoisturePct: 91.0,
    sampleImageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '25%', left: '30%', width: '30%', height: '32%', label: 'Firm Pericarp', conf: '96.4%' },
      { top: '55%', left: '52%', width: '26%', height: '28%', label: 'Uniform Crimson', conf: '95.1%' }
    ]
  },
  {
    id: 'potato-chandramukhi',
    name: 'Chandramukhi Potato',
    category: 'Vegetables',
    variety: 'Table / Chip Grade',
    mspFloorPerKg: 11.50,
    mandiBenchmarkPerKg: 15.20,
    typicalGrade: 'Grade A',
    typicalDefectPct: 2.4,
    typicalMoisturePct: 78.0,
    sampleImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '20%', left: '25%', width: '32%', height: '35%', label: 'Smooth Tuber', conf: '95.0%' },
      { top: '50%', left: '55%', width: '28%', height: '30%', label: 'Shallow Eyes', conf: '93.7%' }
    ]
  },
  {
    id: 'soybean-js335',
    name: 'Yellow Soybean (JS-335)',
    category: 'Oilseeds',
    variety: 'High Oil Content (JS-335)',
    mspFloorPerKg: 46.00,
    mandiBenchmarkPerKg: 44.00,
    typicalGrade: 'Grade A',
    typicalDefectPct: 2.2,
    typicalMoisturePct: 9.8,
    sampleImageUrl: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '26%', left: '34%', width: '20%', height: '22%', label: 'High Oil Seed', conf: '95.2%' },
      { top: '58%', left: '48%', width: '22%', height: '24%', label: 'Clean Hilum', conf: '94.0%' }
    ]
  },
  {
    id: 'chana-desi',
    name: 'Desi Chana (Chickpeas)',
    category: 'Pulses',
    variety: 'Vijay Bold Chana',
    mspFloorPerKg: 54.40,
    mandiBenchmarkPerKg: 56.50,
    typicalGrade: 'Grade A',
    typicalDefectPct: 1.6,
    typicalMoisturePct: 9.5,
    sampleImageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '28%', left: '30%', width: '24%', height: '26%', label: 'Bold Grain', conf: '96.0%' },
      { top: '54%', left: '56%', width: '22%', height: '24%', label: 'Zero Weevil Damage', conf: '94.5%' }
    ]
  },
  {
    id: 'tur-dal',
    name: 'Yellow Tur (Arhar / Pigeon Pea)',
    category: 'Pulses',
    variety: 'Marathwada Bold Grade A',
    mspFloorPerKg: 70.00,
    mandiBenchmarkPerKg: 78.50,
    typicalGrade: 'Grade A',
    typicalDefectPct: 1.5,
    typicalMoisturePct: 10.0,
    sampleImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    defectBoxes: [
      { top: '30%', left: '35%', width: '22%', height: '24%', label: 'Bold Whole Grain', conf: '96.8%' },
      { top: '58%', left: '52%', width: '20%', height: '22%', label: 'Uniform Hull', conf: '95.1%' }
    ]
  }
];

export function getCropBySearch(query: string): CropVarietyOption {
  const normalized = query.toLowerCase().trim();
  const matched = CROP_VARIETY_CATALOG.find(
    c => c.name.toLowerCase().includes(normalized) || 
         c.variety.toLowerCase().includes(normalized) ||
         c.id.includes(normalized)
  );
  return matched || CROP_VARIETY_CATALOG[0];
}

export function resolveCropImageUrl(cropName: string = '', customUrl?: string | null): string {
  if (customUrl && customUrl.startsWith('http') && !customUrl.includes('placeholder') && !customUrl.includes('broken')) {
    // If the image URL is not an onion image wrongly assigned to cotton or wheat, use it
    if (!(cropName.toLowerCase().includes('cotton') && customUrl.includes('photo-1618512496248'))) {
      return customUrl;
    }
  }

  const norm = (cropName || '').toLowerCase();
  if (norm.includes('wheat') || norm.includes('grain') || norm.includes('lok')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('onion') || norm.includes('garva') || norm.includes('pyaz')) {
    return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('tomato') || norm.includes('abhinav') || norm.includes('tamatar')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('rice') || norm.includes('basmati') || norm.includes('paddy')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('soybean') || norm.includes('js-335') || norm.includes('soya')) {
    return 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('cotton') || norm.includes('kapas')) {
    return 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('potato') || norm.includes('chandramukhi') || norm.includes('aloo')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('chana') || norm.includes('gram') || norm.includes('chickpea')) {
    return 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('tur') || norm.includes('arhar') || norm.includes('dal')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
}
