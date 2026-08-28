import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  Check, 
  Building2, 
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Navigation,
  Compass
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { normalizeCityName } from '../utils/helpers';

export interface MoroccanCityInfo {
  name: string;
  nameAr: string;
  nameFr: string;
  regionFr: string;
  regionAr: string;
  mainHubsFr: string[];
  mainHubsAr: string[];
  popular?: boolean;
}

export const MOROCCAN_CITIES: MoroccanCityInfo[] = [
  {
    name: 'Casa',
    nameAr: 'الدار البيضاء',
    nameFr: 'Casablanca',
    regionFr: 'Grand Casablanca',
    regionAr: 'الدار البيضاء الكبرى',
    mainHubsFr: ['Station Derb Omar', 'Casa Port', 'Gare Oulfa'],
    mainHubsAr: ['محطة درب عمر', 'محطة كازا بورت', 'محطة الألفة'],
    popular: true
  },
  {
    name: 'Rabat',
    nameAr: 'الرباط',
    nameFr: 'Rabat',
    regionFr: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط سلا القنيطرة',
    mainHubsFr: ['Station Bab El Had', 'Gare Agdal', 'Station Al Kamra'],
    mainHubsAr: ['محطة باب الأحد', 'محطة أكدال', 'محطة القامرة'],
    popular: true
  },
  {
    name: 'Marrakech',
    nameAr: 'مراكش',
    nameFr: 'Marrakech',
    regionFr: 'Marrakech-Safi',
    regionAr: 'مراكش آسفي',
    mainHubsFr: ['Station Bab Doukkala', 'Sidi Mimoun', 'Gare Guéliz'],
    mainHubsAr: ['محطة باب دكالة', 'محطة سيدي ميمون', 'محطة جيليز'],
    popular: true
  },
  {
    name: 'Tangier',
    nameAr: 'طنجة',
    nameFr: 'Tanger',
    regionFr: 'Tanger-Tétouan-Al Hoceïma',
    regionAr: 'طنجة تطوان الحسيمة',
    mainHubsFr: ['Place de la Ligue', 'Station Malabata', 'Tanger Med'],
    mainHubsAr: ['محطة ساحة الجامعة العربية', 'محطة مالاباطا', 'محطة طنجة المتوسط'],
    popular: true
  },
  {
    name: 'Fes',
    nameAr: 'فاس',
    nameFr: 'Fès',
    regionFr: 'Fès-Meknès',
    regionAr: 'فاس مكناس',
    mainHubsFr: ['Station Bab Boujloud', 'Gare Atlas', 'Station CTM'],
    mainHubsAr: ['محطة باب بوجلود', 'محطة الأطلس', 'محطة ستيام'],
    popular: true
  },
  {
    name: 'Agadir',
    nameAr: 'أكادير',
    nameFr: 'Agadir',
    regionFr: 'Souss-Massa',
    regionAr: 'سوس ماسة',
    mainHubsFr: ['Station Inezgane', 'Station Al Battoir', 'Gare Al Massira'],
    mainHubsAr: ['محطة إنزكان', 'محطة الباطوار', 'محطة المسيرة'],
    popular: true
  },
  {
    name: 'Meknes',
    nameAr: 'مكناس',
    nameFr: 'Meknès',
    regionFr: 'Fès-Meknès',
    regionAr: 'فاس مكناس',
    mainHubsFr: ['Station Sidi Said', 'Bab Mansour'],
    mainHubsAr: ['محطة سيدي سعيد', 'محطة باب منصور']
  },
  {
    name: 'Oujda',
    nameAr: 'وجدة',
    nameFr: 'Oujda',
    regionFr: 'L\'Oriental',
    regionAr: 'الجهة الشرقية',
    mainHubsFr: ['Place de la Gare', 'Bab Sidi Abdelwahab'],
    mainHubsAr: ['محطة ساحة القطار', 'محطة باب سيدي عبد الوهاب']
  },
  {
    name: 'Tetouan',
    nameAr: 'تطوان',
    nameFr: 'Tétouan',
    regionFr: 'Tanger-Tétouan',
    regionAr: 'طنجة تطوان',
    mainHubsFr: ['Station Touabel', 'Station Safir'],
    mainHubsAr: ['محطة الطوابل', 'محطة السفير']
  },
  {
    name: 'Kenitra',
    nameAr: 'القنيطرة',
    nameFr: 'Kénitra',
    regionFr: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط سلا القنيطرة',
    mainHubsFr: ['Gare Kenitra Ville', 'Station Mehdia'],
    mainHubsAr: ['محطة القنيطرة المدينة', 'محطة المهدية']
  },
  {
    name: 'Nador',
    nameAr: 'الناظور',
    nameFr: 'Nador',
    regionFr: 'L\'Oriental',
    regionAr: 'الجهة الشرقية',
    mainHubsFr: ['Gare Routière Nador', 'Station Beni Ensar'],
    mainHubsAr: ['المحطة الطرقية للناظور', 'محطة بني انصار']
  },
  {
    name: 'Essaouira',
    nameAr: 'الصويرة',
    nameFr: 'Essaouira',
    regionFr: 'Marrakech-Safi',
    regionAr: 'مراكش آسفي',
    mainHubsFr: ['Station Bab Doukkala', 'Gare Routière'],
    mainHubsAr: ['محطة باب دكالة الصويرة', 'المحطة الطرقية']
  },
  {
    name: 'El Jadida',
    nameAr: 'الجديدة',
    nameFr: 'El Jadida',
    regionFr: 'Casablanca-Settat',
    regionAr: 'الدار البيضاء سطات',
    mainHubsFr: ['Station Sidi Bouzid', 'Centre Ville'],
    mainHubsAr: ['محطة سيدي بوزيد', 'محطة وسط المدينة']
  },
  {
    name: 'Safi',
    nameAr: 'آسفي',
    nameFr: 'Safi',
    regionFr: 'Marrakech-Safi',
    regionAr: 'مراكش آسفي',
    mainHubsFr: ['Gare Routière Safi', 'Station Plateau'],
    mainHubsAr: ['المحطة الطرقية لآسفي', 'محطة البلاطو']
  },
  {
    name: 'Beni Mellal',
    nameAr: 'بني ملال',
    nameFr: 'Béni Mellal',
    regionFr: 'Béni Mellal-Khénifra',
    regionAr: 'بني ملال خنيفرة',
    mainHubsFr: ['Station Tadla', 'Station Bab Fès'],
    mainHubsAr: ['محطة تادلة', 'محطة باب فاس']
  },
  {
    name: 'Mohammedia',
    nameAr: 'المحمدية',
    nameFr: 'Mohammedia',
    regionFr: 'Grand Casablanca',
    regionAr: 'الدار البيضاء الكبرى',
    mainHubsFr: ['Gare Mohammedia', 'Station Kasbah'],
    mainHubsAr: ['محطة قطار المحمدية', 'محطة القصبة']
  }
];

const REGION_FILTERS = [
  { id: 'all', labelFr: 'Toutes les villes', labelAr: 'كل المدن' },
  { id: 'popular', labelFr: 'Grands pôles', labelAr: 'المدن الكبرى' },
  { id: 'Grand Casablanca', labelFr: 'Casablanca', labelAr: 'الدار البيضاء' },
  { id: 'Rabat-Salé-Kénitra', labelFr: 'Rabat-Salé', labelAr: 'الرباط وسلا' },
  { id: 'Marrakech-Safi', labelFr: 'Marrakech & Safi', labelAr: 'مراكش وآسفي' },
  { id: 'Tanger-Tétouan', labelFr: 'Tanger & Nord', labelAr: 'طنجة وتطوان' },
  { id: 'Fès-Meknès', labelFr: 'Fès & Meknès', labelAr: 'فاس ومكناس' },
  { id: 'Souss-Massa', labelFr: 'Agadir & Souss', labelAr: 'أكادير وسوس' },
  { id: 'L\'Oriental', labelFr: 'Oriental', labelAr: 'الجهة الشرقية' }
];

interface CitySelectorProps {
  id: string;
  type: 'origin' | 'destination';
  value: string;
  onChange: (cityName: string) => void;
  otherCity?: string;
  label: string;
  language: Language;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectAndNext?: (cityName: string) => void;
  onBackToOrigin?: () => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  id,
  type,
  value,
  onChange,
  language,
  otherCity,
  disabled = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  onSelectAndNext,
  onBackToOrigin
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
    if (!isControlled) {
      setInternalIsOpen(nextOpen);
    }
  };

  const isRtl = language === 'ar';
  const isOrigin = type === 'origin';
  const normalizedVal = normalizeCityName(value);
  const normalizedOtherCity = otherCity ? normalizeCityName(otherCity) : '';

  // Find currently selected city metadata
  const currentCity = MOROCCAN_CITIES.find(c => normalizeCityName(c.name) === normalizedVal) || {
    name: normalizedVal === 'casablanca' ? 'Casa' : value,
    nameAr: normalizedVal === 'casablanca' ? 'الدار البيضاء' : value,
    nameFr: normalizedVal === 'casablanca' ? 'Casablanca' : value,
    regionFr: 'Maroc',
    regionAr: 'المغرب',
    mainHubsFr: [`Station Centrale ${value}`],
    mainHubsAr: [`محطة ${value} المركزية`]
  };

  // Other city metadata (e.g. Origin metadata when selecting Destination)
  const otherCityMeta = otherCity ? (MOROCCAN_CITIES.find(c => normalizeCityName(c.name) === normalizedOtherCity) || {
    name: normalizedOtherCity === 'casablanca' ? 'Casa' : otherCity,
    nameAr: normalizedOtherCity === 'casablanca' ? 'الدار البيضاء' : otherCity,
    nameFr: normalizedOtherCity === 'casablanca' ? 'Casablanca' : otherCity,
    regionFr: 'Maroc',
    regionAr: 'المغرب',
    mainHubsFr: [],
    mainHubsAr: []
  }) : null;

  // Lock body scroll when full-screen selector is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSelectedRegion('all');
    }
  }, [isOpen]);

  const filteredCities = useMemo(() => {
    return MOROCCAN_CITIES.filter((city) => {
      // Region filter
      if (selectedRegion === 'popular') {
        if (!city.popular) return false;
      } else if (selectedRegion !== 'all') {
        if (!city.regionFr.toLowerCase().includes(selectedRegion.toLowerCase()) &&
            !city.regionAr.includes(selectedRegion)) {
          return false;
        }
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const isCasaSearch = q.includes('casa') || q.includes('casablanca') || q.includes('بيضاء') || q.includes('كازا');
      if (normalizeCityName(city.name) === 'casablanca' && isCasaSearch) return true;

      return (
        city.name.toLowerCase().includes(q) ||
        city.nameAr.includes(q) ||
        city.nameFr.toLowerCase().includes(q) ||
        city.regionFr.toLowerCase().includes(q) ||
        city.regionAr.includes(q) ||
        city.mainHubsFr.some(h => h.toLowerCase().includes(q)) ||
        city.mainHubsAr.some(h => h.includes(q))
      );
    });
  }, [searchQuery, selectedRegion]);

  const handleSelectCity = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    if (onSelectAndNext) {
      onSelectAndNext(cityName);
    }
  };

  // Localized texts
  const tStrings = {
    origin: {
      typeTag: isRtl ? 'مدينة الانطلاق' : 'VILLE DE DÉPART',
      stepBadge: isRtl ? 'المرحلة 1 : نقطة الانطلاق' : 'Étape 1 : Ville de départ',
      bannerNotice: isRtl ? '📍 حدد محطة تسليم الطرد' : '📍 Choisissez la station où déposer le colis',
      title: isRtl ? 'من أي مدينة سينطلق الطرد؟' : 'De quelle ville part le colis ?',
      subtitle: isRtl ? 'اختر مدينة ومحطة الانطلاق' : 'Sélectionnez la ville et station de départ',
      searchPlaceholder: isRtl ? 'ابحث عن المدينة أو المحطة (مثال: كازا، درب عمر)...' : 'Rechercher ville ou station (ex: Casablanca, Derb Omar)...',
      cardSubtext: isRtl ? 'محطة الإرسال' : 'Station de départ',
      hubBadge: isRtl ? 'محطة انطلاق' : 'Station Départ'
    },
    destination: {
      typeTag: isRtl ? 'مدينة الوصول' : 'VILLE D\'ARRIVÉE',
      stepBadge: isRtl ? 'المرحلة 2 : وجهة الوصول' : 'Étape 2 : Ville d\'arrivée',
      bannerNotice: isRtl ? '🏁 حدد محطة تسلم الطرد' : '🏁 Choisissez la station d\'arrivée',
      title: isRtl ? 'إلى أي مدينة سيتجه الطرد؟' : 'Où doit être livré le colis ?',
      subtitle: isRtl ? 'اختر مدينة ومحطة الوصول' : 'Sélectionnez la ville et station d\'arrivée',
      searchPlaceholder: isRtl ? 'ابحث عن المدينة أو المحطة (مثال: مراكش، طنجة)...' : 'Rechercher ville ou station (ex: Marrakech, Tanger)...',
      backBtn: isRtl ? '← الانطلاق' : '← Départ',
      fromPrefix: isRtl ? 'الانطلاق من :' : 'Départ :',
      changeBtn: isRtl ? 'تغيير' : 'Modifier',
      cardSubtext: isRtl ? 'محطة الاستلام' : 'Station d\'arrivée',
      hubBadge: isRtl ? 'محطة وصول' : 'Station Arrivée'
    }
  };

  const displayName = isRtl ? currentCity.nameAr : currentCity.nameFr;
  const displayRegion = isRtl ? currentCity.regionAr : currentCity.regionFr.replace('Grand ', '');
  const displayHub = isRtl ? currentCity.mainHubsAr[0] : currentCity.mainHubsFr[0];

  return (
    <div className="relative w-full">
      {/* Label above trigger */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5 h-4 overflow-hidden">
        <label 
          htmlFor={`${id}-trigger`}
          className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 overflow-hidden text-zinc-800"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isOrigin ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-emerald-500 ring-2 ring-emerald-200'}`} />
          <span className="truncate">{isOrigin ? tStrings.origin.typeTag : tStrings.destination.typeTag}</span>
        </label>
        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 border ${
          isOrigin 
            ? 'bg-amber-50 text-amber-900 border-amber-200' 
            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
        }`}>
          {isOrigin ? (isRtl ? 'انطلاق' : 'DÉPART') : (isRtl ? 'وصول' : 'ARRIVÉE')}
        </span>
      </div>

      {/* Interactive Trigger Card */}
      <button
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={`w-full h-[76px] text-left bg-gradient-to-b from-white to-zinc-50/70 border-2 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between gap-2.5 overflow-hidden ${
          isOrigin
            ? 'border-amber-300/80 hover:border-amber-500 hover:bg-amber-50/30 ring-0 hover:ring-2 hover:ring-amber-200'
            : 'border-emerald-300/80 hover:border-emerald-500 hover:bg-emerald-50/30 ring-0 hover:ring-2 hover:ring-emerald-200'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 h-full">
          {/* Badge Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
            isOrigin 
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
              : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>

          {/* City Display Text */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-base sm:text-lg font-black text-zinc-950 tracking-tight truncate">
                {displayName}
              </span>
              {!isRtl && (
                <span className="text-[11px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200/70 shrink-0" dir="rtl">
                  {currentCity.nameAr}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 truncate mt-0.5">
              <span className="font-semibold text-zinc-700 shrink-0">{displayRegion}</span>
              <span>•</span>
              <span className="truncate text-zinc-600">{displayHub}</span>
            </div>
          </div>
        </div>

        {/* Chevron Dropdown Icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
          isOrigin ? 'bg-amber-100/70 text-amber-800' : 'bg-emerald-100/70 text-emerald-800'
        }`}>
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </div>
      </button>

      {/* FULL SCREEN DEDICATED TAKEOVER VIEW */}
      {isOpen && (
        <div 
          id={`${id}-fullscreen-dialog`}
          className="fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Top App Header & Progress Bar */}
          <div className={`w-full border-b shadow-xs shrink-0 ${
            isOrigin 
              ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-amber-200' 
              : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border-emerald-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                {/* Step Pill */}
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border-2 shadow-xs ${
                  isOrigin 
                    ? 'bg-amber-100 text-amber-950 border-amber-400' 
                    : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isOrigin ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                  {isOrigin ? tStrings.origin.stepBadge : tStrings.destination.stepBadge}
                </span>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-xs border border-zinc-300"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title, Subtitle and Route context banner */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider mb-1.5 border shadow-2xs ${
                    isOrigin 
                      ? 'bg-amber-500 text-zinc-950 border-amber-600' 
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {isOrigin ? (isRtl ? '📍 الانطلاق' : '📍 DÉPART') : (isRtl ? '🏁 الوصول' : '🏁 ARRIVÉE')}
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2.5">
                    {isOrigin ? (
                      <>
                        <span className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-xs font-black">
                          <Navigation className="w-5 h-5 stroke-[2.5]" />
                        </span>
                        <span>{tStrings.origin.title}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-xs font-black">
                          <Compass className="w-5 h-5 stroke-[2.5]" />
                        </span>
                        <span>{tStrings.destination.title}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-700 font-bold mt-1">
                    {isOrigin ? tStrings.origin.bannerNotice : tStrings.destination.bannerNotice}
                  </p>
                </div>

                {/* Route Context Banner when in Destination step */}
                {!isOrigin && otherCityMeta && (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border-2 border-emerald-300 text-xs font-bold text-zinc-900 self-start sm:self-auto shadow-xs">
                    <span className="text-zinc-500 font-semibold">{tStrings.destination.fromPrefix}</span>
                    <span className="font-black text-zinc-950 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      {isRtl ? otherCityMeta.nameAr : otherCityMeta.nameFr}
                    </span>
                    {onBackToOrigin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onBackToOrigin();
                        }}
                        className="text-amber-700 hover:text-amber-900 underline font-black text-xs cursor-pointer ml-1"
                      >
                        {tStrings.destination.changeBtn}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar & Region Tabs */}
          <div className="w-full bg-zinc-50 border-b border-zinc-200/90 shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className={`w-5 h-5 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isOrigin ? tStrings.origin.searchPlaceholder : tStrings.destination.searchPlaceholder}
                  className={`w-full bg-white border-2 border-zinc-200 rounded-2xl py-3.5 text-sm sm:text-base font-bold text-zinc-950 placeholder:text-zinc-400 placeholder:font-normal focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-hidden transition-all shadow-xs ${
                    isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Region Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {REGION_FILTERS.map((rf) => {
                  const isSelected = selectedRegion === rf.id;
                  const labelStr = isRtl ? rf.labelAr : rf.labelFr;

                  return (
                    <button
                      key={rf.id}
                      type="button"
                      onClick={() => setSelectedRegion(rf.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-zinc-950 text-amber-400 border-zinc-950 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-100/80'
                      }`}
                    >
                      {labelStr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full Screen Scrollable City Options Grid */}
          <div className="flex-1 overflow-y-auto bg-zinc-100/60 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {filteredCities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {filteredCities.map((city) => {
                    const isSelected = normalizeCityName(city.name) === normalizedVal;
                    const isOther = otherCityMeta && normalizeCityName(city.name) === normalizedOtherCity;
                    const cName = isRtl ? city.nameAr : city.nameFr;
                    const cRegion = isRtl ? city.regionAr : city.regionFr.replace('Grand ', '');
                    const cHubs = isRtl ? city.mainHubsAr : city.mainHubsFr;

                    return (
                      <button
                        key={city.name}
                        type="button"
                        onClick={() => handleSelectCity(city.name)}
                        className={`w-full min-h-[92px] p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden ${
                          isSelected
                            ? isOrigin 
                              ? 'bg-amber-500/10 border-2 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                              : 'bg-emerald-500/10 border-2 border-emerald-500 ring-2 ring-emerald-400/30 shadow-md'
                            : isOther
                            ? 'bg-zinc-50 border border-zinc-300/80 opacity-75 hover:opacity-100'
                            : 'bg-white hover:bg-white border border-zinc-200/90 hover:border-zinc-300 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {/* City Icon Box */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                            isSelected
                              ? isOrigin 
                                ? 'bg-amber-500 text-zinc-950 font-black' 
                                : 'bg-emerald-500 text-zinc-950 font-black'
                              : isOrigin
                              ? 'bg-amber-100/70 text-amber-900 border border-amber-200/70'
                              : 'bg-emerald-100/70 text-emerald-900 border border-emerald-200/70'
                          }`}>
                            <Building2 className="w-6 h-6 stroke-[2.2]" />
                          </div>

                          {/* City Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-black text-base sm:text-lg text-zinc-950 tracking-tight truncate">
                                {cName}
                              </span>
                              {!isRtl && (
                                <span className="text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 shrink-0" dir="rtl">
                                  {city.nameAr}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1 truncate">
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${
                                isOrigin 
                                  ? 'bg-amber-50 text-amber-900 border-amber-200' 
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              }`}>
                                {isOrigin ? tStrings.origin.hubBadge : tStrings.destination.hubBadge}
                              </span>
                              <span className="font-semibold text-zinc-700 shrink-0">{cRegion}</span>
                            </div>

                            <p className="text-[11px] text-zinc-600 truncate mt-1 font-medium">
                              {cHubs.slice(0, 2).join(' • ')}
                            </p>
                          </div>
                        </div>

                        {/* Status / Select indicator */}
                        <div className="shrink-0 flex items-center">
                          {isSelected ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                              isOrigin ? 'bg-amber-500 text-zinc-950' : 'bg-emerald-500 text-zinc-950'
                            }`}>
                              <Check className="w-5 h-5 stroke-[3.5]" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-zinc-200 text-zinc-400 group-hover:text-zinc-800 flex items-center justify-center transition-colors">
                              <ArrowRight className={`w-4 h-4 stroke-[2.5] ${isRtl ? 'rotate-180' : ''}`} />
                            </div>
                          )}
                        </div>

                        {/* Indicator if this city is the other point */}
                        {isOther && !isOrigin && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-[9px] font-black text-amber-900 uppercase">
                            {isRtl ? 'مدينة الانطلاق' : 'Départ'}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-zinc-400">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-zinc-800">
                    {isRtl ? 'لم يتم العثور على مدينة مطابقة' : 'Aucune ville trouvée'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    {isRtl 
                      ? 'جرب البحث عن كازا، الرباط، مراكش، طنجة، فاس، أكادير، وجدة، تطوان...'
                      : 'Essayez : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, Tétouan...'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-amber-400 text-xs font-bold shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {isRtl ? 'عرض كل المدن' : 'Toutes les villes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info Banner */}
          <div className="w-full bg-white border-t border-zinc-200 px-4 py-3 shrink-0 text-center text-xs text-zinc-600 font-medium">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-zinc-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold">
                  {isRtl ? '12+ مسار بين المدن متاح يومياً' : '12+ lignes Grand Taxi avec départs quotidiens'}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                {isRtl ? 'تسليم في نفس اليوم عبر شبكة الطاكسي الكبير' : 'Livraison le jour même par Grand Taxi'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
