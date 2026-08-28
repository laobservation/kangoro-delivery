import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Navigation,
  Compass
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { MOROCCAN_CITIES } from './CitySelector';
import { normalizeCityName } from '../utils/helpers';

interface TaxiRouteTransitionProps {
  originCity: string;
  language: Language;
  onComplete: () => void;
}

export const TaxiRouteTransition: React.FC<TaxiRouteTransitionProps> = ({
  originCity,
  language,
  onComplete
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

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const cityNameDisplay = isRtl ? originCityMeta.nameAr : originCityMeta.nameFr;
  const hubNameDisplay = isRtl ? originCityMeta.mainHubsAr[0] : originCityMeta.mainHubsFr[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-lg bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Top Glow Ambient Effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Step Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>
            {isRtl ? 'تم تأكيد نقطة الانطلاق' : 'Départ confirmé'}
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
        
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium max-w-xs">
          {hubNameDisplay}
        </p>

        {/* Animated Grand Taxi Corridor Track */}
        <div className="w-full my-6 py-4 px-2 bg-zinc-950/80 border border-zinc-800 rounded-2xl relative overflow-hidden">
          
          {/* Station Indicators (Origin -> Destination) */}
          <div className="flex items-center justify-between text-xs font-bold px-2 mb-2">
            <div className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold uppercase">
                {isRtl ? 'الانطلاق' : 'Départ'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold uppercase">
                {isRtl ? 'الوصول' : 'Arrivée'}
              </span>
            </div>
          </div>

          {/* Road Highway with Dashed Line */}
          <div className="relative h-14 bg-zinc-900/90 rounded-xl border border-zinc-700/80 flex items-center px-4 overflow-hidden">
            {/* Road Dotted Center Lane */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-zinc-500/40 w-full" />

            {/* Origin Dot */}
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-[0_0_12px_rgba(245,158,11,0.8)] z-10 shrink-0" />

            {/* Animated Moving Grand Taxi Car */}
            <motion.div 
              className="absolute z-20 flex items-center"
              initial={{ left: isRtl ? '84%' : '6%' }}
              animate={{ left: isRtl ? '10%' : '80%' }}
              transition={{ 
                duration: 2.7, 
                ease: [0.4, 0.0, 0.2, 1] 
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
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? '-right-4' : '-left-4'} flex flex-col gap-1 opacity-70`}>
                  <div className="w-3.5 h-0.5 bg-amber-400/90 rounded-full animate-pulse" />
                  <div className="w-2.5 h-0.5 bg-amber-300/70 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Destination Target Dot */}
            <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)] z-10 shrink-0 animate-pulse" />
          </div>

          {/* 3-Second Corridor Progress Bar */}
          <div className="w-full bg-zinc-900 h-1 rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.0, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Explanatory Transition Text */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>
              {isRtl ? 'الانتقال لاختيار مدينة الوصول...' : 'Choix de la ville de destination...'}
            </span>
          </p>
          <p className="text-xs text-zinc-400">
            {isRtl ? 'المرحلة 2 : حدد وجهة الوصول ومحطة الاستلام' : 'Étape 2 : Indiquez la ville et la station d\'arrivée'}
          </p>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={onComplete}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-zinc-700"
        >
          <span>{isRtl ? 'متابعة مباشرة' : 'Continuer'}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>

      </div>
    </div>
  );
};
