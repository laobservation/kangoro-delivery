import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  Check, 
  Building2, 
  X
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { normalizeCityName } from '../utils/helpers';

export interface MoroccanCityInfo {
  name: string;
  nameAr: string;
  nameFr: string;
  region: string;
  mainHubs: string[];
}

export const MOROCCAN_CITIES: MoroccanCityInfo[] = [
  {
    name: 'Casa',
    nameAr: 'الدار البيضاء',
    nameFr: 'Casa',
    region: 'Grand Casablanca',
    mainHubs: ['Central Grand Taxi (Derb Omar)', 'Casa Port Hub', 'Oulfa Terminal']
  },
  {
    name: 'Rabat',
    nameAr: 'الرباط',
    nameFr: 'Rabat',
    region: 'Rabat-Salé-Kénitra',
    mainHubs: ['Bab El Had Grand Station', 'Agdal Terminal', 'Kamra Intercity Hub']
  },
  {
    name: 'Marrakech',
    nameAr: 'مراكش',
    nameFr: 'Marrakech',
    region: 'Marrakech-Safi',
    mainHubs: ['Bab Doukkala Taxi Hub', 'Sidi Mimoun Station', 'Gueliz Terminal']
  },
  {
    name: 'Tangier',
    nameAr: 'طنجة',
    nameFr: 'Tanger',
    region: 'Tanger-Tétouan-Al Hoceïma',
    mainHubs: ['Place de la Ligue Grand Hub', 'Malabata Bay', 'Tangier Med Gate']
  },
  {
    name: 'Fes',
    nameAr: 'فاس',
    nameFr: 'Fès',
    region: 'Fès-Meknès',
    mainHubs: ['Bab Boujloud Terminal', 'Atlas Grand Taxi Station', 'CTM Interchange']
  },
  {
    name: 'Agadir',
    nameAr: 'أكادير',
    nameFr: 'Agadir',
    region: 'Souss-Massa',
    mainHubs: ['Inezgane Grand Taxi Bay', 'Battoir Hub', 'Al Massira Terminal']
  },
  {
    name: 'Meknes',
    nameAr: 'مكناس',
    nameFr: 'Meknès',
    region: 'Fès-Meknès',
    mainHubs: ['Sidi Said Grand Station', 'Bab Mansour Terminal']
  },
  {
    name: 'Oujda',
    nameAr: 'وجدة',
    nameFr: 'Oujda',
    region: 'L\'Oriental',
    mainHubs: ['Place de la Gare Taxi Hub', 'Bab Sidi Abdelwahab']
  },
  {
    name: 'Tetouan',
    nameAr: 'تطوان',
    nameFr: 'Tétouan',
    region: 'Tanger-Tétouan',
    mainHubs: ['Station Touabel Grand Taxi', 'Safir Terminal']
  },
  {
    name: 'Kenitra',
    nameAr: 'القنيطرة',
    nameFr: 'Kénitra',
    region: 'Gharb-Chrarda',
    mainHubs: ['Gare Kenitra Ville Taxi Bay', 'Mehdia Junction']
  },
  {
    name: 'Nador',
    nameAr: 'الناظور',
    nameFr: 'Nador',
    region: 'L\'Oriental',
    mainHubs: ['Gare Routiere Nador', 'Beni Ensar Taxi Bay']
  },
  {
    name: 'Essaouira',
    nameAr: 'الصويرة',
    nameFr: 'Essaouira',
    region: 'Marrakech-Safi',
    mainHubs: ['Bab Doukkala Essaouira', 'Gare Grand Taxi']
  }
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
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  id,
  type,
  value,
  onChange,
  label,
  language,
  disabled = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  onSelectAndNext
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  const normalizedVal = normalizeCityName(value);

  // Find currently selected city metadata or create a sensible fallback
  const currentCity = MOROCCAN_CITIES.find(c => normalizeCityName(c.name) === normalizedVal) || {
    name: normalizedVal === 'casablanca' ? 'Casa' : value,
    nameAr: normalizedVal === 'casablanca' ? 'الدار البيضاء' : value,
    nameFr: normalizedVal === 'casablanca' ? 'Casa' : value,
    region: 'Morocco',
    mainHubs: [`${value} Central Station`]
  };

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
      }, 80);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCities = MOROCCAN_CITIES.filter((city) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const isCasaSearch = q.includes('casa') || q.includes('casablanca') || q.includes('بيضاء');
    if (normalizeCityName(city.name) === 'casablanca' && isCasaSearch) return true;

    return (
      city.name.toLowerCase().includes(q) ||
      city.nameAr.includes(q) ||
      city.nameFr.toLowerCase().includes(q) ||
      city.region.toLowerCase().includes(q) ||
      city.mainHubs.some(h => h.toLowerCase().includes(q))
    );
  });

  const isOrigin = type === 'origin';

  const handleSelectCity = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    if (onSelectAndNext) {
      onSelectAndNext(cityName);
    }
  };

  return (
    <div className="relative w-full">
      {/* Label above trigger - fixed height to ensure both origin & destination align perfectly */}
      <label 
        htmlFor={`${id}-trigger`}
        className="block text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5 h-4 flex items-center gap-1.5 overflow-hidden"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${isOrigin ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-emerald-500 ring-2 ring-emerald-200'}`} />
        <span className="truncate">{label}</span>
      </label>

      {/* Styled Interactive Trigger Card - fixed exact height & structure so origin and destination stay equal */}
      <button
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={`w-full h-[76px] text-left bg-gradient-to-b from-white to-zinc-50/70 border rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between gap-2.5 overflow-hidden ${
          isOrigin
            ? 'border-zinc-300 hover:border-amber-400 hover:bg-amber-50/20'
            : 'border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50/20'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 h-full">
          {/* Badge Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
            isOrigin 
              ? 'bg-amber-50 text-amber-700 border-amber-200/80' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>

          {/* City Display Text */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-base sm:text-lg font-black text-zinc-950 tracking-tight truncate">
                {currentCity.name}
              </span>
              <span className="text-[11px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200/70 shrink-0" dir="rtl">
                {currentCity.nameAr}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 truncate mt-0.5">
              <span className="font-semibold text-zinc-700 shrink-0">{currentCity.region.replace('Grand ', '')}</span>
              <span>•</span>
              <span className="truncate text-zinc-600">{currentCity.mainHubs[0]}</span>
            </div>
          </div>
        </div>

        {/* Chevron Dropdown Icon */}
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-zinc-100/80 text-zinc-500 group-hover:text-zinc-800 transition-transform duration-200">
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </div>
      </button>

      {/* Centered Modal in the Middle of the Page */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            id={`${id}-modal-dialog`}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                  isOrigin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isOrigin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {isOrigin 
                        ? (language === 'ar' ? 'الخطوة 1: نقطة الانطلاق' : language === 'fr' ? 'Étape 1: Ville de départ' : 'Step 1: Origin City') 
                        : (language === 'ar' ? 'الخطوة 2: وجهة الوصول' : language === 'fr' ? 'Étape 2: Ville d\'arrivée' : 'Step 2: Destination City')}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-950 mt-0.5">
                    {label}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar (Sticky at top) */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ar' 
                      ? 'ابحث عن المدينة أو المحطة...' 
                      : language === 'fr' 
                      ? 'Rechercher une ville ou station...' 
                      : 'Search city or taxi station...'
                  }
                  className={`w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-hidden transition-all ${
                    isRtl ? 'pr-10 pl-9' : 'pl-10 pr-9'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 rounded-full`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable City List with uniform sized cards */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[55vh]">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => {
                  const isSelected = normalizeCityName(city.name) === normalizedVal;

                  return (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleSelectCity(city.name)}
                      className={`w-full h-[64px] min-h-[64px] flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left overflow-hidden ${
                        isSelected
                          ? 'bg-amber-50 border-2 border-amber-400 ring-2 ring-amber-300/40 text-zinc-950 shadow-xs'
                          : 'bg-zinc-50/80 hover:bg-zinc-100 border border-zinc-200/80 text-zinc-800 hover:text-zinc-950'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* City Icon Box */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 shadow-xs'
                            : 'bg-zinc-200/80 text-zinc-700'
                        }`}>
                          <Building2 className="w-5 h-5 stroke-[2.2]" />
                        </div>

                        {/* City Name & Taxi Hubs */}
                        <div className="min-w-0 flex-1 text-left" dir="ltr">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-extrabold text-sm sm:text-base text-zinc-950 truncate">
                              {city.name}
                            </span>
                            <span className="text-xs font-bold text-zinc-700 shrink-0">
                              {city.nameAr}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 truncate mt-0.5 font-medium">
                            {city.mainHubs.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      </div>

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-xs ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500">
                  <Building2 className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                  <p className="font-bold text-sm text-zinc-700">{language === 'ar' ? 'لم يتم العثور على مدينة' : 'No matching city found'}</p>
                  <p className="text-xs text-zinc-500 mt-1">Try searching Casa, Rabat, Marrakech, Tangier, Fes, Agadir...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
