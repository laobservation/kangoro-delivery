import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  ArrowRight, 
  Star, 
  Search, 
  Filter, 
  Luggage, 
  X, 
  Send,
  Navigation,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Share2,
  AlertCircle
} from 'lucide-react';
import { TaxiDriver, TaxiStation } from '../types';
import { DEFAULT_STATIONS } from '../data/mockData';
import { Language } from '../utils/i18n';
import { formatCurrency } from '../utils/helpers';

interface StationsDirectoryViewProps {
  drivers?: TaxiDriver[];
  onSelectDriverForBooking?: (driver: TaxiDriver, station: TaxiStation) => void;
  language?: Language;
}

export const StationsDirectoryView: React.FC<StationsDirectoryViewProps> = ({
  drivers = [],
  onSelectDriverForBooking,
  language = 'fr'
}) => {
  const isRtl = language === 'ar';

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<TaxiStation | null>(null);
  
  // In-page filter for drivers at the selected station: 'all' | 'in_station' | 'out_of_station'
  const [driverPresenceFilter, setDriverPresenceFilter] = useState<'all' | 'in_station' | 'out_of_station'>('all');
  const [driverSearchInStation, setDriverSearchInStation] = useState<string>('');

  const stations = DEFAULT_STATIONS;

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    stations.forEach(s => set.add(s.city));
    return ['all', ...Array.from(set)];
  }, [stations]);

  // Map drivers to each station
  const stationDriversMap = useMemo(() => {
    const map: Record<string, TaxiDriver[]> = {};
    stations.forEach(stn => {
      map[stn.id] = drivers.filter(d => {
        if (d.currentStationId === stn.id) return true;
        if (d.originStation && d.originStation.toLowerCase().includes(stn.name.toLowerCase().slice(0, 15))) return true;
        if (d.originCity.toLowerCase() === stn.city.toLowerCase() && !d.currentStationId) return true;
        return false;
      });
    });
    return map;
  }, [stations, drivers]);

  // Filter stations based on city and search query
  const filteredStations = useMemo(() => {
    return stations.filter(stn => {
      if (selectedCityFilter !== 'all' && stn.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = stn.name.toLowerCase().includes(q) || (stn.nameAr && stn.nameAr.includes(q));
        const matchCity = stn.city.toLowerCase().includes(q);
        const matchAddress = stn.address.toLowerCase().includes(q) || (stn.addressAr && stn.addressAr.includes(q));
        const matchLines = stn.lines.some(l => l.toLowerCase().includes(q)) || (stn.linesAr && stn.linesAr.some(l => l.includes(q)));
        return matchName || matchCity || matchAddress || matchLines;
      }
      return true;
    });
  }, [stations, selectedCityFilter, searchQuery]);

  // Selected station's filtered drivers
  const selectedStationDrivers = useMemo(() => {
    if (!selectedStation) return [];
    const stnDrivers = stationDriversMap[selectedStation.id] || [];

    return stnDrivers.filter(driver => {
      // Filter by presence
      const isIn = driver.isAtStation ?? (driver.status === 'boarding' || driver.status === 'scheduled');
      if (driverPresenceFilter === 'in_station' && !isIn) return false;
      if (driverPresenceFilter === 'out_of_station' && isIn) return false;

      // Filter by search inside station
      if (driverSearchInStation.trim()) {
        const q = driverSearchInStation.toLowerCase();
        const matchName = driver.name.toLowerCase().includes(q);
        const matchPlate = driver.vehiclePlate.toLowerCase().includes(q);
        const matchModel = driver.vehicleModel.toLowerCase().includes(q);
        const matchDest = driver.destinationCity.toLowerCase().includes(q);
        const matchNotes = driver.notes?.toLowerCase().includes(q);
        return matchName || matchPlate || matchModel || matchDest || matchNotes;
      }

      return true;
    });
  }, [selectedStation, stationDriversMap, driverPresenceFilter, driverSearchInStation]);

  // Counts for selected station
  const currentStationStats = useMemo(() => {
    if (!selectedStation) return { total: 0, inStation: 0, outStation: 0 };
    const all = stationDriversMap[selectedStation.id] || [];
    const inStation = all.filter(d => (d.isAtStation ?? (d.status === 'boarding' || d.status === 'scheduled'))).length;
    const outStation = all.length - inStation;
    return {
      total: all.length,
      inStation,
      outStation
    };
  }, [selectedStation, stationDriversMap]);

  // Other stations in the same city for quick navigation
  const otherStationsSameCity = useMemo(() => {
    if (!selectedStation) return [];
    return stations.filter(s => s.id !== selectedStation.id && s.city === selectedStation.city);
  }, [selectedStation, stations]);

  /* ========================================================================= */
  /* VIEW 1: SINGLE STATION FULL-PAGE VIEW (NO POPUP / NO MODAL)               */
  /* ========================================================================= */
  if (selectedStation) {
    return (
      <div className="space-y-6 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Navigation Breadcrumb / Return Button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setSelectedStation(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer group"
          >
            {isRtl ? (
              <>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                <span>العودة إلى دليل جميع المحطات</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
                <span>Retour à toutes les stations</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isRtl ? 'محطة نشطة ومراقبة لحظياً' : 'Station en service direct'}</span>
            </span>
          </div>
        </div>

        {/* Station Hero Header Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-3xl border border-zinc-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8 relative z-10">
            {/* Left/Main info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-xs">
                  {selectedStation.city}
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-800/90 text-zinc-300 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isRtl && selectedStation.hoursAr ? selectedStation.hoursAr : selectedStation.hours}</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'محطة معتمدة رسمياً' : 'Agrément Officiel'}</span>
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-zinc-100 tracking-tight">
                  {isRtl && selectedStation.nameAr ? selectedStation.nameAr : selectedStation.name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isRtl && selectedStation.addressAr ? selectedStation.addressAr : selectedStation.address}</span>
                </p>
              </div>

              {/* Station Lines Badges */}
              <div className="pt-2">
                <span className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  {isRtl ? 'الخطوط والوجهات المباشرة من هذه المحطة :' : 'Lignes directes desservies :'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(isRtl && selectedStation.linesAr ? selectedStation.linesAr : selectedStation.lines).map((line, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-200 text-xs font-semibold border border-zinc-700/60"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Quick Info Card */}
            <div className="bg-zinc-900/90 rounded-2xl p-5 border border-zinc-700/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Luggage className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-zinc-400 text-xs block font-medium">
                      {isRtl ? 'شباك شحن واستلام الطرود' : 'Guichet Dépôt & Retrait Colis'}
                    </span>
                    <strong className="text-amber-400 font-bold text-sm sm:text-base">
                      {isRtl && selectedStation.parcelDropBayAr ? selectedStation.parcelDropBayAr : selectedStation.parcelDropBay}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-300 pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">{isRtl ? 'هاتف المحطة :' : 'Standard téléphonique :'}</span>
                    <a href={`tel:${selectedStation.phone}`} className="text-amber-300 font-mono font-bold hover:underline">
                      {selectedStation.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">{isRtl ? 'توقيت العمل :' : 'Disponibilité :'}</span>
                    <span className="font-semibold text-zinc-200">{isRtl && selectedStation.hoursAr ? selectedStation.hoursAr : selectedStation.hours}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${selectedStation.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'الاتصال بإدارة المحطة' : 'Appeler la Station'}</span>
              </a>
            </div>
          </div>

          {/* Live Fleet Statistics Bar */}
          <div className="grid grid-cols-3 gap-2 px-6 pb-6 text-center text-xs">
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <span className="text-zinc-400 block text-xs font-medium">
                {isRtl ? 'إجمالي أسطول المحطة' : 'Total Chauffeurs Rattachés'}
              </span>
              <strong className="text-xl sm:text-2xl font-black text-white">{currentStationStats.total}</strong>
            </div>
            <div className="bg-emerald-950/50 p-3 rounded-2xl border border-emerald-800/60">
              <span className="text-emerald-400 block text-xs font-bold flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {isRtl ? 'متواجد داخل المحطة' : 'Présents à la Station'}
              </span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-300">{currentStationStats.inStation}</strong>
            </div>
            <div className="bg-amber-950/50 p-3 rounded-2xl border border-amber-800/60">
              <span className="text-amber-400 block text-xs font-bold flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                {isRtl ? 'خارج المحطة / في الطريق' : 'Hors Station / En Route'}
              </span>
              <strong className="text-xl sm:text-2xl font-black text-amber-300">{currentStationStats.outStation}</strong>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar for Drivers */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Presence Tab Buttons */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 shrink-0">
            <button
              onClick={() => setDriverPresenceFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                driverPresenceFilter === 'all'
                  ? 'bg-zinc-950 text-amber-400 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {isRtl ? `الكل (${currentStationStats.total})` : `Tous (${currentStationStats.total})`}
            </button>
            <button
              onClick={() => setDriverPresenceFilter('in_station')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                driverPresenceFilter === 'in_station'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isRtl ? `داخل المحطة (${currentStationStats.inStation})` : `À la station (${currentStationStats.inStation})`}</span>
            </button>
            <button
              onClick={() => setDriverPresenceFilter('out_of_station')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                driverPresenceFilter === 'out_of_station'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{isRtl ? `خارج المحطة (${currentStationStats.outStation})` : `Hors station (${currentStationStats.outStation})`}</span>
            </button>
          </div>

          {/* Search in station */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-zinc-400`} />
            <input
              type="text"
              value={driverSearchInStation}
              onChange={(e) => setDriverSearchInStation(e.target.value)}
              placeholder={isRtl ? 'بحث باسم السائق، الوجهة أو السيارة...' : 'Rechercher un chauffeur, destination, matricule...'}
              className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {driverSearchInStation && (
              <button 
                onClick={() => setDriverSearchInStation('')}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Drivers Grid List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">
              {isRtl ? 'قائمة السائقين والرحلات المتاحة' : 'Chauffeurs & Départs Disponibles'} 
              <span className="text-xs text-zinc-500 font-normal mr-2 ml-2">({selectedStationDrivers.length} {isRtl ? 'سائق' : 'résultats'})</span>
            </h2>
          </div>

          {selectedStationDrivers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-zinc-900 text-base">
                {isRtl ? 'لا يوجد سائقون يطابقون خيارات البحث الحالية' : 'Aucun chauffeur ne correspond aux filtres actuels'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                {isRtl 
                  ? 'يمكنك تغيير فلتر الحضور أو مسح نص البحث لعرض جميع سائقي هذه المحطة.' 
                  : 'Changez le filtre de présence ou effacez votre recherche pour afficher l’ensemble des chauffeurs de cette station.'}
              </p>
              <button
                onClick={() => {
                  setDriverPresenceFilter('all');
                  setDriverSearchInStation('');
                }}
                className="px-5 py-2.5 bg-amber-500 text-zinc-950 rounded-xl text-xs font-bold hover:bg-amber-400 cursor-pointer shadow-xs transition-colors"
              >
                {isRtl ? 'عرض كل سائقي المحطة' : 'Réinitialiser les filtres'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedStationDrivers.map((driver) => {
                const isIn = driver.isAtStation ?? (driver.status === 'boarding' || driver.status === 'scheduled');
                const remainingSlots = driver.maxParcels - driver.currentParcelsCount;

                return (
                  <div
                    key={driver.id}
                    className={`bg-white rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between shadow-xs ${
                      isIn 
                        ? 'border-emerald-200/90 hover:border-emerald-500 hover:shadow-md' 
                        : 'border-zinc-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    {/* Top: Driver Profile & Presence Badge */}
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                            />
                            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                              isIn ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-zinc-900 text-sm sm:text-base">{driver.name}</h3>
                              <span className="flex items-center gap-0.5 text-xs text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                {driver.rating}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 font-medium mt-0.5">
                              {driver.vehicleModel}
                            </p>
                          </div>
                        </div>

                        {/* Plate Tag */}
                        <div className="bg-zinc-100 border border-zinc-300 px-2.5 py-1 rounded-lg text-right shrink-0">
                          <span className="text-[9px] text-zinc-700 block font-bold">MATRICULE</span>
                          <span className="text-xs font-mono font-bold text-zinc-900">{driver.vehiclePlate}</span>
                        </div>
                      </div>

                      {/* Live Presence Status Box */}
                      <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        isIn 
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
                          : 'bg-amber-50/90 border-amber-200 text-amber-950'
                      }`}>
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                            <span className="uppercase tracking-wider text-[11px]">
                              {isIn 
                                ? (isRtl ? 'متواجد داخل المحطة' : 'Présent à la Station') 
                                : (isRtl ? 'خارج المحطة (في الطريق)' : 'Hors station / En Transit')}
                            </span>
                          </span>
                          <span className="text-[11px] font-medium opacity-90">
                            {isIn ? (driver.stationBay || (isRtl ? 'رصيف الانطلاق' : 'Quai Départ')) : (isRtl ? 'على الطريق السيار' : 'Autoroute')}
                          </span>
                        </div>

                        {isIn ? (
                          <div className="text-xs text-emerald-900 space-y-0.5">
                            <p className="font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{isRtl ? 'توقيت الانطلاق :' : 'Départ prévu :'} <strong>{driver.departureTime}</strong></span>
                            </p>
                            <p className="text-[11px] text-emerald-800">
                              {isRtl ? 'الرصيف :' : 'Emplacement :'} <strong>{driver.stationBay || 'Quai Central Grand Taxi'}</strong>
                            </p>
                          </div>
                        ) : (
                          <div className="text-xs text-amber-900 space-y-1.5">
                            <p className="font-semibold flex items-center gap-1.5">
                              <Navigation className="w-3.5 h-3.5 text-amber-700" />
                              <span>{driver.outOfStationLocation || driver.notes || (isRtl ? 'في الطريق نحو الوجهة' : 'En route vers destination')}</span>
                            </p>
                            {driver.currentProgressPct > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-amber-800">
                                  <span>{isRtl ? 'تقدم الرحلة' : 'Progression'}</span>
                                  <span className="font-bold">{driver.currentProgressPct}%</span>
                                </div>
                                <div className="w-full bg-amber-200/80 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-amber-600 h-full rounded-full transition-all"
                                    style={{ width: `${driver.currentProgressPct}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Route & Trunk Details */}
                      <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200 text-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-800 font-medium">
                          <span className="flex items-center gap-1.5 text-zinc-900 font-bold">
                            <span>{driver.originCity}</span>
                            <ArrowRight className={`w-3.5 h-3.5 text-amber-500 ${isRtl ? 'rotate-180' : ''}`} />
                            <span>{driver.destinationCity}</span>
                          </span>
                          <span className="text-zinc-600 text-[11px]">
                            {isRtl ? 'الوصول :' : 'Arrivée :'} <strong>{driver.estimatedArrival}</strong>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-1.5 border-t border-zinc-200/60">
                          <span className="flex items-center gap-1.5">
                            <Luggage className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{isRtl ? 'سعة الصندوق :' : 'Espace coffre :'} <strong className="text-zinc-900">{remainingSlots} {isRtl ? 'أماكن' : 'colis'}</strong></span>
                          </span>
                          <span className="font-bold text-amber-800">
                            {formatCurrency(driver.flatBaseRate)} + {formatCurrency(driver.basePricePerKg)}/kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Call & Book Parcel */}
                    <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center gap-2">
                      <a
                        href={`tel:${driver.phone}`}
                        className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                        title={isRtl ? 'اتصال مباشر بالسائق' : 'Appeler le chauffeur'}
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          if (onSelectDriverForBooking && selectedStation) {
                            onSelectDriverForBooking(driver, selectedStation);
                          }
                        }}
                        className={`flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                          isIn 
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950' 
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'حجز إرسال طرد مع السائق' : 'Réserver l’envoi d’un colis'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Other Stations in same city */}
        {otherStationsSameCity.length > 0 && (
          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm">
              {isRtl ? `محطات أخرى في مدينة ${selectedStation.city}` : `Autres stations à ${selectedStation.city}`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherStationsSameCity.map((stn) => {
                const count = (stationDriversMap[stn.id] || []).length;
                return (
                  <button
                    key={stn.id}
                    onClick={() => {
                      setSelectedStation(stn);
                      setDriverPresenceFilter('all');
                      setDriverSearchInStation('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-amber-500 hover:shadow-sm text-left flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-zinc-900 text-xs">
                        {isRtl && stn.nameAr ? stn.nameAr : stn.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">{stn.address}</p>
                    </div>
                    <span className="px-2 py-1 bg-zinc-100 rounded-md text-[10px] font-bold text-zinc-700 shrink-0">
                      {count} {isRtl ? 'سائق' : 'chauffeurs'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ========================================================================= */
  /* VIEW 2: STATIONS DIRECTORY HUB (WHEN NO STATION IS SELECTED)             */
  /* ========================================================================= */
  return (
    <div className="space-y-8 pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'محطات الطاكسي الكبير بالمغرب والأسطول المتاح' : 'Réseau Officiel des Stations Grand Taxi & Flotte'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-100 tracking-tight">
            {isRtl ? 'دليل المحطات والسائقين المتواجدين لحظياً' : 'Répertoire des Stations & Statut des Chauffeurs'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
            {isRtl 
              ? 'اختر أي محطة لعرض صفحتها الكاملة وقائمة السائقين التابعين لها وحالتهم المباشرة: متواجد داخل المحطة أو خارجها في الطريق السيار، مع حجز مباشر للطرود.' 
              : 'Sélectionnez une station pour ouvrir sa page dédiée et consulter tous ses chauffeurs rattachés, leur présence en direct (à la station ou en route) et réserver un envoi de colis.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-zinc-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن محطة، مدينة، عنوان، أو خط سفر...' : 'Rechercher une station, ville, adresse ou ligne...'}
              className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs bg-zinc-100 px-3 py-2 rounded-xl text-zinc-700 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {stations.length} {isRtl ? 'محطات معتمدة' : 'Stations Actives'} • {drivers.length} {isRtl ? 'سائق مربوط بالشبكة' : 'Chauffeurs Connectés'}
            </span>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs font-bold text-zinc-500 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {isRtl ? 'المدينة :' : 'Ville :'}
          </span>
          {cities.map((cityKey) => {
            const isSelected = selectedCityFilter === cityKey;
            let label = cityKey;
            if (cityKey === 'all') label = isRtl ? 'جميع المدن' : 'Toutes les villes';

            return (
              <button
                key={cityKey}
                onClick={() => setSelectedCityFilter(cityKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-amber-400 shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((stn) => {
          const stnDrivers = stationDriversMap[stn.id] || [];
          const inStationDrivers = stnDrivers.filter(d => (d.isAtStation ?? (d.status === 'boarding' || d.status === 'scheduled')));
          const outStationDrivers = stnDrivers.filter(d => !(d.isAtStation ?? (d.status === 'boarding' || d.status === 'scheduled')));

          return (
            <div
              key={stn.id}
              onClick={() => {
                setSelectedStation(stn);
                setDriverPresenceFilter('all');
                setDriverSearchInStation('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-3xl border-2 border-zinc-200/90 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              {/* Card Image / Header Banner */}
              <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={stn.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'}
                  alt={stn.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                {/* City Tag & Presence Indicator */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-xs">
                    {stn.city}
                  </span>
                  <div className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-white border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{stnDrivers.length} {isRtl ? 'سائق' : 'Chauffeurs'}</span>
                  </div>
                </div>

                {/* Station Name on overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {isRtl && stn.nameAr ? stn.nameAr : stn.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{isRtl && stn.addressAr ? stn.addressAr : stn.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono text-zinc-800">{stn.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{isRtl && stn.hoursAr ? stn.hoursAr : stn.hours}</span>
                    </div>
                  </div>

                  {/* Live Drivers Status Pill Count */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          {isRtl ? 'داخل المحطة' : 'À la station'}
                        </span>
                        <strong className="text-xs font-black text-emerald-900">
                          {inStationDrivers.length} {isRtl ? 'متاح' : 'présents'}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          {isRtl ? 'خارج المحطة' : 'Hors station'}
                        </span>
                        <strong className="text-xs font-black text-amber-900">
                          {outStationDrivers.length} {isRtl ? 'في الطريق' : 'en route'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action / Footer */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <strong className="text-zinc-800 font-semibold line-clamp-1">{isRtl && stn.parcelDropBayAr ? stn.parcelDropBayAr : stn.parcelDropBay}</strong>
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStation(stn);
                      setDriverPresenceFilter('all');
                      setDriverSearchInStation('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-amber-500 text-white hover:text-zinc-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    <span>{isRtl ? 'عرض السائقين' : 'Voir Chauffeurs'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
