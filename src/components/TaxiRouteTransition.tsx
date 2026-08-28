import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Navigation,
  Compass,
  MapPin,
  X,
  ArrowLeft,
  Building2,
  Search,
  Globe
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { MOROCCAN_CITIES } from './CitySelector';
import { normalizeCityName, getRouteDetails } from '../utils/helpers';

interface TaxiRouteTransitionProps {
  originCity: string;
  currentDestinationCity?: string;
  language: Language;
  onComplete: () => void; // Takes user to full destination selection modal
  onSelectDestination?: (destCity: string) => void; // Directly chooses one of the fast-pick destination cities
  onBackToOrigin?: () => void;
  onClose?: () => void;
}

export const TaxiRouteTransition: React.FC<TaxiRouteTransitionProps> = ({
  originCity,
  language,
  onComplete,
  onSelectDestination,
  onBackToOrigin,
  onClose
}) => {
  const isRtl = language === 'ar';
  const normalizedOrigin = normalizeCityName(originCity);

  const originCityMeta = MOROCCAN_CITIES.find(c => normalizeCityName(c.name) === normalizedOrigin) || {
    name: originCity,
    nameAr: originCity,
    nameFr: originCity,
    regionFr: 'Maroc',
    regionAr: 'المغرب',
    mainHubsFr: [`Station Centrale ${originCity}`],
    mainHubsAr: [`محطة ${originCity} المركزية`]
  };

  // Get 4 popular cities from the real Moroccan network to suggest as direct fast-picks
  const suggestedDestinations = MOROCCAN_CITIES
    .filter(c => normalizeCityName(c.name) !== normalizedOrigin)
    .slice(0, 4);

  const cityNameDisplay = isRtl ? originCityMeta.nameAr : originCityMeta.nameFr;
  const hubNameDisplay = isRtl ? originCityMeta.mainHubsAr[0] : originCityMeta.mainHubsFr[0];

  const handleOpenDestinationModal = () => {
    // Strictly navigate to full destination selection
    onComplete();
  };

  const handleDirectDestinationClick = (destCityName: string) => {
    if (onSelectDestination) {
      onSelectDestination(destCityName);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      id="taxi-route-transition-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={(e) => {
        // Clicking on the contour / backdrop outside the modal takes the user to choose destination
        if (e.target === e.currentTarget) {
          handleOpenDestinationModal();
        }
      }}
    >
      {/* Modal Container */}
      <div 
        id="taxi-route-transition-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-zinc-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl shadow-amber-500/20 flex flex-col items-center text-center relative overflow-hidden cursor-default my-auto"
      >
        
        {/* Top Glow Ambient Effect */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navigation Row: Back to Origin / Contour Hint / Close */}
        <div className="w-full flex items-center justify-between gap-2 mb-4 relative z-10">
          {onBackToOrigin ? (
            <button
              type="button"
              id="transition-back-to-origin-btn"
              onClick={onBackToOrigin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-zinc-700 shadow-xs"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{isRtl ? 'تغيير الانطلاق' : 'Changer départ'}</span>
            </button>
          ) : <div />}

          {/* Contour guidance badge */}
          <div className="text-[11px] font-semibold text-amber-300/90 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{isRtl ? 'اضغط على المحيط أو الزر لاختيار الوجهة' : 'Cliquez sur le contour pour choisir la destination'}</span>
          </div>

          {/* Close button */}
          <button
            type="button"
            id="transition-close-modal-btn"
            onClick={onClose || handleOpenDestinationModal}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>
            {isRtl ? 'المرحلة 1 مكتملة: تم تأكيد مدينة الانطلاق' : 'Étape 1 validée : Ville de départ'}
          </span>
        </div>

        {/* Origin City Name Confirmation */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>{cityNameDisplay}</span>
          {!isRtl && (
            <span className="text-base sm:text-lg font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30" dir="rtl">
              {originCityMeta.nameAr}
            </span>
          )}
        </h3>
        
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium max-w-sm flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{hubNameDisplay}</span>
        </p>

        {/* Animated Grand Taxi Corridor Track */}
        <div className="w-full my-4 py-3.5 px-3 bg-zinc-950/90 border border-zinc-800 rounded-2xl relative overflow-hidden shadow-inner">
          
          {/* Station Indicators (Origin -> Destination) */}
          <div className="flex items-center justify-between text-xs font-bold px-2 mb-2">
            <div className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold uppercase">
                {isRtl ? 'نقطة الانطلاق' : 'Départ'} ({cityNameDisplay})
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold uppercase">
                {isRtl ? 'وجهة الوصول' : 'Destination'}
              </span>
            </div>
          </div>

          {/* Road Highway with Dashed Line */}
          <div className="relative h-14 bg-zinc-900/90 rounded-xl border border-zinc-700/80 flex items-center px-4 overflow-hidden">
            {/* Road Dotted Center Lane */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-zinc-500/40 w-full" />

            {/* Origin Dot */}
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-[0_0_12px_rgba(245,158,11,0.8)] z-10 shrink-0" />

            {/* Animated Moving Grand Taxi Car (Seamless loop) */}
            <motion.div 
              className="absolute z-20 flex items-center"
              initial={{ left: isRtl ? '80%' : '12%' }}
              animate={{ left: isRtl ? '15%' : '78%' }}
              transition={{ 
                duration: 3.2, 
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut' 
              }}
            >
              {/* Grand Taxi Vehicle Sprite */}
              <div className="relative flex items-center">
                {/* Roof Taxi Light Indicator */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-amber-400 text-zinc-950 text-[8px] font-black rounded-sm shadow-md border border-amber-200 tracking-wider">
                  TAXI
                </div>

                {/* Car Body */}
                <div className={`flex items-center justify-center w-11 h-7 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-black shadow-lg border border-amber-300 ${isRtl ? 'scale-x-[-1]' : ''}`}>
                  <span className="text-[14px]">🚖</span>
                </div>

                {/* Speed Lines */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? '-right-3.5' : '-left-3.5'} flex flex-col gap-1 opacity-75`}>
                  <div className="w-3.5 h-0.5 bg-amber-400/90 rounded-full animate-pulse" />
                  <div className="w-2 h-0.5 bg-amber-300/70 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Destination Target Dot */}
            <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)] z-10 shrink-0 animate-pulse" />
          </div>
        </div>

        {/* Section: Direct Fast Choice Destinations (Frequent Corridors) */}
        <div className="w-full mt-2 space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'خطوط مباشرة متكررة (اختيار سريع) :' : 'Lignes fréquentes (Sélection directe) :'}</span>
            </span>
            <span className="text-[10px] text-zinc-400">
              {isRtl ? 'اضغط للربط الفوري' : 'Cliquez pour valider'}
            </span>
          </div>

          {/* Quick Destination Cards Grid (4 suggestions) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {suggestedDestinations.map((dest) => {
              const dName = isRtl ? dest.nameAr : dest.nameFr;
              const route = getRouteDetails(originCity, dest.name);

              return (
                <button
                  key={dest.name}
                  type="button"
                  id={`transition-dest-btn-${dest.name.toLowerCase()}`}
                  onClick={() => handleDirectDestinationClick(dest.name)}
                  className="p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-1.5 group bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700/80 hover:border-amber-400/70 hover:shadow-md text-zinc-200 hover:text-white"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-black text-xs sm:text-sm tracking-tight truncate group-hover:text-amber-300 transition-colors">
                      {dName}
                    </span>
                    <Building2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <span>{route.distanceKm} km</span>
                    <span className="text-amber-400 font-bold">~{Math.round(route.avgDurationMinutes / 60)}h</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button: Open Full Destination Selection Modal */}
        <div className="w-full mt-5 space-y-2.5">
          <button
            type="button"
            id="transition-choose-destination-btn"
            onClick={handleOpenDestinationModal}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 group"
          >
            <Search className="w-5 h-5 text-zinc-950 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span>
              {isRtl 
                ? 'اختيار مدينة الوصول (البحث في جميع المدن)' 
                : 'Choisir la destination (Toutes les villes)'}
            </span>
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5] ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>

          <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isRtl 
                ? 'إذا لم تجد مدينتك في الخطوط المتكررة، اضغط على الزر أعلاه للبحث في جميع المدن المغربية' 
                : 'Si votre ville n\'est pas dans les lignes fréquentes, cliquez ci-dessus pour chercher parmi toutes les villes du Maroc'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
