import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Car, 
  ShieldCheck, 
  User, 
  Phone, 
  DollarSign, 
  Sparkles, 
  Check, 
  Luggage, 
  Star, 
  Info,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Send,
  Lock,
  Plus
} from 'lucide-react';
import { TaxiDriver, ParcelSize, PaymentMethod, ParcelDelivery, SenderUser } from '../types';
import { 
  formatCurrency, 
  calculateDeliveryPrice, 
  generateTrackingCode, 
  generateOtp,
  getRouteDetails,
  normalizeCityName
} from '../utils/helpers';
import { Language, translations } from '../utils/i18n';
import { CitySelector } from './CitySelector';
import { TaxiRouteTransition } from './TaxiRouteTransition';

interface SenderViewProps {
  drivers: TaxiDriver[];
  onBookParcel: (parcel: ParcelDelivery) => void;
  onSelectDeliveryForTracking: (trackingCode: string) => void;
  onNavigateToDashboard?: () => void;
  initialPrefillData?: Partial<ParcelDelivery> | null;
  currentUser?: SenderUser | null;
  onRequireAuth: (modeOrCallback?: 'login' | 'register' | (() => void), afterAuthCallback?: () => void) => void;
  language?: Language;
}

export const SenderView: React.FC<SenderViewProps> = ({
  drivers,
  onBookParcel,
  onSelectDeliveryForTracking,
  onNavigateToDashboard,
  initialPrefillData,
  currentUser,
  onRequireAuth,
  language = 'en'
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  // Route selection states
  const [originCity, setOriginCity] = useState<string>(initialPrefillData?.originCity || 'Casablanca');
  const [destinationCity, setDestinationCity] = useState<string>(initialPrefillData?.destinationCity || 'Rabat');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'plenty' | 'doorstep'>('all');
  const [driverSearchQuery, setDriverSearchQuery] = useState('');

  // Selected driver for booking modal
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);

  // Booking Form State
  const [parcelCategory, setParcelCategory] = useState<ParcelSize>(initialPrefillData?.category || 'small');
  const [parcelTitle, setParcelTitle] = useState(initialPrefillData?.title || '');
  const [parcelDescription, setParcelDescription] = useState(initialPrefillData?.description || '');
  const [weightKg, setWeightKg] = useState<number>(initialPrefillData?.weightKg || 2.0);
  const [isFragile, setIsFragile] = useState(initialPrefillData?.isFragile || false);
  const [declaredValue, setDeclaredValue] = useState<number>(initialPrefillData?.declaredValue || 100);

  // Sender details
  const [senderName, setSenderName] = useState(
    initialPrefillData?.senderName || currentUser?.name || 'Amine Benjelloun'
  );
  const [senderPhone, setSenderPhone] = useState(
    initialPrefillData?.senderPhone || currentUser?.phone || '+212 6 61 22 33 44'
  );
  const [senderNotes, setSenderNotes] = useState(initialPrefillData?.senderNotes || 'I will meet driver at station bay 2.');
  const [isDoorstepPickup, setIsDoorstepPickup] = useState(initialPrefillData?.isDoorstepPickup || false);
  const [pickupAddress, setPickupAddress] = useState(initialPrefillData?.pickupAddress || '');

  // Receiver details
  const [receiverName, setReceiverName] = useState(initialPrefillData?.receiverName || '');
  const [receiverPhone, setReceiverPhone] = useState(initialPrefillData?.receiverPhone || '');
  const [receiverAddress, setReceiverAddress] = useState(initialPrefillData?.receiverAddress || '');
  const [receiverInstructions, setReceiverInstructions] = useState(initialPrefillData?.receiverInstructions || '');
  const [isDoorstepDropoff, setIsDoorstepDropoff] = useState(initialPrefillData?.isDoorstepDropoff || false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPrefillData?.paymentMethod || 'cash_on_pickup');

  // Success screen state
  const [bookedParcel, setBookedParcel] = useState<ParcelDelivery | null>(null);

  // Ref to driver section for smooth scrolling
  const driversSectionRef = useRef<HTMLDivElement>(null);
  // Ref to city selector
  const citySelectorRef = useRef<HTMLDivElement>(null);
  // Active city selector modal ('origin' -> 'transition' -> 'destination' step sequence)
  const [activeCityModal, setActiveCityModal] = useState<'origin' | 'transition' | 'destination' | null>(null);

  // Update sender info if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setSenderName(currentUser.name);
      setSenderPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Sync prefill data when arriving from dashboard or stations view
  useEffect(() => {
    if (initialPrefillData) {
      if (initialPrefillData.originCity) setOriginCity(initialPrefillData.originCity);
      if (initialPrefillData.destinationCity) setDestinationCity(initialPrefillData.destinationCity);
      if (initialPrefillData.category) setParcelCategory(initialPrefillData.category);
      if (initialPrefillData.title) setParcelTitle(initialPrefillData.title);
      if (initialPrefillData.description) setParcelDescription(initialPrefillData.description);
      if (initialPrefillData.weightKg) setWeightKg(initialPrefillData.weightKg);
      if (initialPrefillData.isFragile !== undefined) setIsFragile(initialPrefillData.isFragile);
      if (initialPrefillData.declaredValue) setDeclaredValue(initialPrefillData.declaredValue);
      if (initialPrefillData.driver) {
        setSelectedDriver(initialPrefillData.driver);
      }
    }
  }, [initialPrefillData]);

  // Calculate route details and available drivers
  const routeInfo = getRouteDetails(originCity, destinationCity);

  const availableDrivers = drivers.filter(d => {
    const matchRoute = 
      normalizeCityName(d.originCity) === normalizeCityName(originCity) &&
      normalizeCityName(d.destinationCity) === normalizeCityName(destinationCity);
    
    if (!matchRoute) return false;
    if (selectedCategoryFilter === 'plenty' && d.availableTrunkSpace !== 'plenty') return false;
    if (selectedCategoryFilter === 'doorstep' && !d.acceptsDoorstep) return false;
    
    if (driverSearchQuery.trim()) {
      const q = driverSearchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchPlate = d.vehiclePlate.toLowerCase().includes(q);
      const matchVehicle = d.vehicleModel.toLowerCase().includes(q);
      const matchStation = d.originStation.toLowerCase().includes(q) || d.destinationStation.toLowerCase().includes(q);
      if (!matchName && !matchPlate && !matchVehicle && !matchStation) return false;
    }

    return true;
  });

  // Price estimate calculation
  const priceBreakdown = calculateDeliveryPrice(
    parcelCategory,
    weightKg,
    routeInfo.distanceKm,
    isDoorstepPickup,
    isDoorstepDropoff,
    isFragile
  );

  const handlePromptDestinationSelection = () => {
    if (citySelectorRef.current) {
      citySelectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setActiveCityModal('origin');
    }, 150);
  };

  const handleDispatchOnRoute = () => {
    driversSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenBooking = (driver: TaxiDriver) => {
    if (!currentUser) {
      onRequireAuth(() => {
        setSelectedDriver(driver);
        setupDefaultParcelData(driver);
      });
      return;
    }

    setSelectedDriver(driver);
    setupDefaultParcelData(driver);
  };

  const setupDefaultParcelData = (driver: TaxiDriver) => {
    if (!parcelTitle) {
      setParcelTitle('Document Envelope & Spare Parts');
    }
    if (!parcelDescription) {
      setParcelDescription('Standard package delivered via intercity grand taxi.');
    }
    if (!receiverName) {
      setReceiverName('Yassine Fassi');
      setReceiverPhone('+212 6 71 23 45 67');
      setReceiverAddress(`${destinationCity} Central Station or Residence Atlas`);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    const trackingCode = generateTrackingCode();
    const pickupOtp = generateOtp();
    const deliveryOtp = generateOtp();

    const newParcel: ParcelDelivery = {
      id: `pkg-${Date.now()}`,
      trackingCode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      originCity,
      destinationCity,
      originStation: selectedDriver.originStation,
      destinationStation: selectedDriver.destinationStation,
      isDoorstepPickup,
      isDoorstepDropoff,
      pickupAddress: isDoorstepPickup ? pickupAddress : selectedDriver.originStation,
      dropoffAddress: isDoorstepDropoff ? receiverAddress : selectedDriver.destinationStation,
      category: parcelCategory,
      title: parcelTitle.trim() || 'Intercity Parcel',
      description: parcelDescription.trim() || 'Standard package delivered via intercity taxi.',
      weightKg: Number(weightKg),
      isFragile,
      declaredValue: Number(declaredValue),
      senderName: senderName.trim() || currentUser?.name || 'Sender',
      senderPhone: senderPhone.trim() || currentUser?.phone || '+212 6 61 00 00 00',
      senderNotes: senderNotes.trim(),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      receiverAddress: receiverAddress.trim(),
      receiverInstructions: receiverInstructions.trim(),
      driverId: selectedDriver.id,
      driver: selectedDriver,
      pickupOtp,
      deliveryOtp,
      priceTotal: priceBreakdown.total,
      paymentMethod,
      isPaid: paymentMethod === 'prepaid_digital',
      status: 'accepted',
      statusHistory: [
        {
          status: 'requested',
          timestamp: Date.now(),
          description: `Parcel dispatch booked on ${selectedDriver.name}'s taxi.`,
          locationName: selectedDriver.originStation
        },
        {
          status: 'accepted',
          timestamp: Date.now() + 1000,
          description: `Driver ${selectedDriver.name} reserved trunk space.`,
          locationName: selectedDriver.originStation
        }
      ],
      currentLocationDescription: `Driver ${selectedDriver.name} is waiting at ${selectedDriver.originStation}`,
      estimatedArrivalTimestamp: selectedDriver.departureTimestamp + (routeInfo.avgDurationMinutes * 60 * 1000)
    };

    onBookParcel(newParcel);
    setBookedParcel(newParcel);
    setSelectedDriver(null);
  };

  const parcelCategoriesConfig = [
    { id: 'envelope' as ParcelSize, label: 'Document / Envelope', desc: 'Letters, contracts, small pouch', maxKg: 0.5, icon: '📄' },
    { id: 'small' as ParcelSize, label: 'Small Box (< 3 kg)', desc: 'Shoebox size, electronics, gifts', maxKg: 3, icon: '📦' },
    { id: 'medium' as ParcelSize, label: 'Medium Box (3-10 kg)', desc: 'Carton box, machinery parts, apparel', maxKg: 10, icon: '🧳' },
    { id: 'large' as ParcelSize, label: 'Large Cargo (10-25 kg)', desc: 'Heavy parcel, equipment, sacks', maxKg: 25, icon: '🚚' },
    { id: 'fragile' as ParcelSize, label: 'Fragile / Special', desc: 'Glassware, ceramics, artwork', maxKg: 8, icon: '🍷' },
  ];

  return (
    <div className={`space-y-8 pb-12 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* HERO SECTION WITH CLEAR CALL TO ACTION TO START SENDING                   */}
      {/* ========================================================================= */}
      <section className="bg-linear-to-b from-amber-500/15 via-amber-500/5 to-white border border-amber-300/80 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <Car className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              {t.heroTitle1} <br className="hidden sm:block" />
              <span className="text-amber-600">{t.heroTitleHighlight}</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-700 max-w-2xl mx-auto font-medium">
              {t.heroSubtitle}
            </p>

            {/* BIG PROMINENT CALL TO ACTION BUTTON */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-start-sending-cta-btn"
                onClick={handlePromptDestinationSelection}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 group border border-zinc-800"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4 text-zinc-950" />
                </div>
                <span>{t.heroSendNowBtn}</span>
                <ArrowRight className={`w-5 h-5 text-amber-400 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.navConnectedAs} {currentUser.name}</span>
                </div>
              ) : (
                <button
                  id="hero-create-account-btn"
                  onClick={() => onRequireAuth()}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs border border-zinc-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <span>{t.heroCreateAccountBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* City Selection & Instant Price Estimator Card */}
          <div 
            ref={citySelectorRef}
            className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-zinc-200/90 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-center"
          >
            {/* Origin City */}
            <div className="md:col-span-4">
              <CitySelector
                id="origin-city-selector"
                type="origin"
                value={originCity}
                isOpen={activeCityModal === 'origin'}
                onOpenChange={(open) => setActiveCityModal(open ? 'origin' : null)}
                onChange={(val) => setOriginCity(val)}
                onSelectAndNext={() => {
                  // After selecting origin city, play delightful Grand Taxi transition animation
                  setActiveCityModal('transition');
                }}
                otherCity={destinationCity}
                label={t.originCityLabel}
                language={language}
              />
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
              <button
                type="button"
                id="btn-swap-cities"
                onClick={() => {
                  const temp = originCity;
                  setOriginCity(destinationCity);
                  setDestinationCity(temp);
                }}
                className="w-10 h-10 rounded-2xl bg-zinc-100 hover:bg-amber-500 text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 transition-all duration-200 cursor-pointer shadow-xs active:scale-90 flex items-center justify-center group"
                title="Swap departure and arrival cities"
                aria-label="Swap origin and destination cities"
              >
                <ArrowRight className="w-4 h-4 md:rotate-0 rotate-90 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-4">
              <CitySelector
                id="destination-city-selector"
                type="destination"
                value={destinationCity}
                isOpen={activeCityModal === 'destination'}
                onOpenChange={(open) => setActiveCityModal(open ? 'destination' : null)}
                onChange={(val) => {
                  setDestinationCity(val);
                  setActiveCityModal(null);
                }}
                onBackToOrigin={() => {
                  setActiveCityModal('origin');
                }}
                otherCity={originCity}
                label={t.destinationCityLabel}
                language={language}
              />
            </div>

            {/* Animated Inter-City Grand Taxi Transition Modal */}
            {activeCityModal === 'transition' && (
              <TaxiRouteTransition
                originCity={originCity}
                currentDestinationCity={destinationCity}
                language={language}
                onComplete={() => {
                  setActiveCityModal('destination');
                }}
                onSelectDestination={(destCity) => {
                  setDestinationCity(destCity);
                  setActiveCityModal(null);
                }}
                onBackToOrigin={() => {
                  setActiveCityModal('origin');
                }}
                onClose={() => {
                  setActiveCityModal(null);
                }}
              />
            )}

            {/* Start on Route CTA Button */}
            <div className="md:col-span-3 pt-2 md:pt-4">
              <button
                id="btn-start-route-dispatch"
                onClick={handleDispatchOnRoute}
                className="w-full py-4 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group border border-zinc-800"
              >
                <span>{t.dispatchOnRouteBtn}</span>
                <ChevronRight className={`w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform stroke-[3] ${isRtl ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Route Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 px-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900">{t.expressCorridor}</span>
              <span className="bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200 font-mono font-bold text-zinc-800">
                {routeInfo.highwayName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>{t.distance} <strong>{routeInfo.distanceKm} km</strong></span>
              <span>{t.avgTransitTime} <strong>~{Math.round(routeInfo.avgDurationMinutes / 60)} hrs {routeInfo.avgDurationMinutes % 60} mins</strong></span>
              <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                {t.fromRate} {formatCurrency(priceBreakdown.base)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AVAILABLE TAXI DRIVERS SECTION WITH SEARCH & FILTER CONTROLS              */}
      {/* ========================================================================= */}
      <section ref={driversSectionRef} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
              <span>{t.taxisOnRoute} {originCity} ➔ {destinationCity}</span>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-extrabold border border-amber-300">
                {availableDrivers.length} {t.departingSoon}
              </span>
            </h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              Choose a verified driver to reserve parcel trunk space and generate OTP handover keys.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
              <input
                type="text"
                value={driverSearchQuery}
                onChange={(e) => setDriverSearchQuery(e.target.value)}
                placeholder={t.driverSearchPlaceholder}
                className={`${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden`}
              />
            </div>

            {/* Quick Filters - Airbnb Pill Style */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer min-h-[34px] ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                    : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
                }`}
              >
                <span>🌐</span>
                <span>{t.allTaxisFilter}</span>
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('plenty')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer min-h-[34px] ${
                  selectedCategoryFilter === 'plenty'
                    ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                    : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
                }`}
              >
                <span>📦</span>
                <span>{t.spaciousTrunkFilter}</span>
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('doorstep')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer min-h-[34px] ${
                  selectedCategoryFilter === 'doorstep'
                    ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                    : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
                }`}
              >
                <span>🚪</span>
                <span>{t.doorstepFilter}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {availableDrivers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-zinc-200 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Car className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-zinc-900 text-base">
                {language === 'ar' 
                  ? `لا يوجد سائقون مسجلون على خط ${originCity} ➔ ${destinationCity} حالياً`
                  : language === 'fr'
                  ? `Aucun chauffeur enregistré sur la ligne ${originCity} ➔ ${destinationCity} pour le moment`
                  : `No registered drivers operating on the ${originCity} ➔ ${destinationCity} line right now`}
              </h3>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                {language === 'ar'
                  ? 'يظهر في البحث فقط السائقون المسجلون والمعينون لمحطات هذا الخط.'
                  : language === 'fr'
                  ? 'Seuls les chauffeurs enregistrés et rattachés aux stations de cette ligne apparaissent ici.'
                  : 'Only drivers registered and assigned to stations on this line appear in search results.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setOriginCity('Casablanca');
                  setDestinationCity('Rabat');
                  setDriverSearchQuery('');
                  setSelectedCategoryFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer shadow-xs"
              >
                {language === 'ar' ? 'عرض خط الدار البيضاء ➔ الرباط' : language === 'fr' ? 'Voir ligne Casablanca ➔ Rabat' : 'View Casablanca ➔ Rabat Line'}
              </button>
            </div>
          </div>
        ) : (
          /* Driver Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableDrivers.map((driver) => {
              const remainingSlots = driver.maxParcels - driver.currentParcelsCount;
              return (
                <div
                  key={driver.id}
                  className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Top: Driver Info & Rating */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-zinc-900 text-base">{driver.name}</h3>
                            <span className="flex items-center gap-0.5 text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              {driver.rating}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600">
                            {driver.totalTrips} verified intercity trips • {driver.vehicleModel}
                          </p>
                        </div>
                      </div>

                      {/* Plate Badge */}
                      <div className="bg-zinc-100 border border-zinc-300 px-2.5 py-1 rounded-md text-right shrink-0">
                        <span className="text-[10px] text-zinc-700 block font-semibold">TAXI PLATE</span>
                        <span className="text-xs font-mono font-bold text-zinc-900">{driver.vehiclePlate}</span>
                      </div>
                    </div>

                    {/* Schedule & Stations */}
                    <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80 space-y-2 text-xs mb-3">
                      {/* Live Station Presence Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
                        {driver.isAtStation ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{language === 'ar' ? 'داخل المحطة' : 'À la station'}</span>
                            {driver.stationBay && <span className="font-normal text-emerald-800">({driver.stationBay})</span>}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>{language === 'ar' ? 'خارج المحطة / في الطريق' : 'Hors station / En transit'}</span>
                          </span>
                        )}
                        {driver.outOfStationLocation && !driver.isAtStation && (
                          <span className="text-[10px] text-amber-800 truncate max-w-[140px] font-medium" title={driver.outOfStationLocation}>
                            {driver.outOfStationLocation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-zinc-700">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                          <Clock className="w-3.5 h-3.5" /> {language === 'ar' ? 'الانطلاق :' : 'Départ :'} {driver.departureTime}
                        </span>
                        <span className="text-zinc-600 font-medium">
                          {language === 'ar' ? 'الوصول التقديري :' : 'Arrivée :'} <strong>{driver.estimatedArrival}</strong>
                        </span>
                      </div>

                      <div className="pt-2 border-t border-zinc-200/60 space-y-1">
                        <div className="flex items-start gap-1.5 text-zinc-700">
                          <span className="font-semibold text-zinc-900 shrink-0">Pickup:</span>
                          <span className="truncate">{driver.originStation}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-zinc-700">
                          <span className="font-semibold text-zinc-900 shrink-0">Dropoff:</span>
                          <span className="truncate">{driver.destinationStation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <div className="flex items-center gap-1 text-[11px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 font-medium">
                        <Luggage className="w-3 h-3 text-zinc-600" />
                        <span>Trunk: <strong className="capitalize">{driver.availableTrunkSpace}</strong></span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        <span className={`px-2 py-0.5 rounded border ${
                          remainingSlots > 0 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {remainingSlots} slots left
                        </span>
                      </div>

                      {driver.acceptsDoorstep && (
                        <span className="text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 font-medium">
                          Doorstep Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Pricing & Select Button */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-zinc-600 block">Base Taxi Rate</span>
                      <span className="text-lg font-black text-zinc-950">
                        {formatCurrency(driver.flatBaseRate)}
                      </span>
                      <span className="text-[10px] text-zinc-500"> / docs & small box</span>
                    </div>

                    <button
                      id={`book-driver-${driver.id}`}
                      onClick={() => handleOpenBooking(driver)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer group-hover:shadow-md"
                    >
                      <span>Send Parcel with Taxi</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* DETAILED PARCEL CONFIGURATION & DISPATCH WIZARD MODAL                     */}
      {/* ========================================================================= */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span>Dispatch with {selectedDriver.name}</span>
                    <span className="text-[10px] bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-mono font-bold">
                      {selectedDriver.vehiclePlate}
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-300">
                    {originCity} ➔ {destinationCity} • Departure {selectedDriver.departureTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Parcel Type & Weight */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-500" /> 1. Select Parcel Category
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {parcelCategoriesConfig.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setParcelCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        parcelCategory === cat.id
                          ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900 truncate">{cat.label}</span>
                          <span className="text-[10px] font-semibold text-zinc-500">Max {cat.maxKg}kg</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Package Specs & Content Details */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" /> 2. Parcel Details & Weight
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                      Parcel Label / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Legal Documents, Auto Filter, Samples"
                      value={parcelTitle}
                      onChange={(e) => setParcelTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                      Weight in Kg ({weightKg} kg)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.2"
                        max="25"
                        step="0.5"
                        value={weightKg}
                        onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-500"
                      />
                      <span className="font-mono font-bold text-xs bg-zinc-100 px-2 py-1 rounded border border-zinc-300">
                        {weightKg} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    Contents Description / Packaging Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide details for the taxi driver (e.g. sealed envelope, double taped cardboard box)"
                    value={parcelDescription}
                    onChange={(e) => setParcelDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Fragile & Declared value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFragile}
                      onChange={(e) => setIsFragile(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-zinc-900 block">Fragile Item (+20 DH)</span>
                      <span className="text-[10px] text-zinc-500">Secured in cushioned front compartment</span>
                    </div>
                  </label>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                      Declared Value (DH)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Sender & Recipient Contacts */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-500" /> 3. Sender & Recipient Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sender Contact */}
                  <div className="space-y-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-600" /> Sender (You)
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Your Phone (+212...)"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Meeting notes (e.g. Station Bay 3)"
                      value={senderNotes}
                      onChange={(e) => setSenderNotes(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Receiver Contact */}
                  <div className="space-y-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-600" /> Recipient (Receiver) *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name *"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Recipient Phone (+212...) *"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Destination meeting point or address"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Doorstep Options */}
              <div className="space-y-2 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" /> 4. Doorstep Collection & Delivery
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDoorstepPickup}
                      onChange={(e) => setIsDoorstepPickup(e.target.checked)}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-zinc-900 block">Origin Doorstep Pickup (+25 DH)</span>
                      <span className="text-[10px] text-zinc-500">Driver picks up parcel at your doorstep in {originCity}</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDoorstepDropoff}
                      onChange={(e) => setIsDoorstepDropoff(e.target.checked)}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-zinc-900 block">Destination Doorstep Dropoff (+25 DH)</span>
                      <span className="text-[10px] text-zinc-500">Driver delivers to recipient address in {destinationCity}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 5: Payment Method */}
              <div className="space-y-2 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-500" /> 5. Payment Preference
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_pickup')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_pickup'
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-zinc-900">Cash on Pickup</div>
                    <div className="text-[10px] text-zinc-600">Pay taxi driver at station</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-zinc-900">Cash on Delivery (COD)</div>
                    <div className="text-[10px] text-zinc-600">Receiver pays upon arrival</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('prepaid_digital')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'prepaid_digital'
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-zinc-900">Digital Card / Escrow</div>
                    <div className="text-[10px] text-zinc-600">Released via recipient OTP</div>
                  </button>
                </div>
              </div>

              {/* Price Summary & Submit */}
              <div className="bg-zinc-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs text-zinc-400 block font-semibold">Total Delivery Fee</span>
                  <div className="text-2xl font-black text-amber-400">
                    {formatCurrency(priceBreakdown.total)}
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Base ({formatCurrency(priceBreakdown.base)}) + Weight ({formatCurrency(priceBreakdown.weightFee)}) + Services ({formatCurrency(priceBreakdown.doorstepFee + priceBreakdown.fragileFee)})
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedDriver(null)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-dispatch-booking-btn"
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm & Generate Dual-OTP</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WAYBILL CONFIRMATION & DUAL-OTP SECURITY MODAL                            */}
      {/* ========================================================================= */}
      {bookedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden text-center p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Parcel Booking Confirmed
              </span>
              <h3 className="text-2xl font-black text-zinc-900 mt-2 font-mono">
                Waybill: {bookedParcel.trackingCode}
              </h3>
              <p className="text-xs text-zinc-600">
                Assigned to driver <strong>{bookedParcel.driver?.name}</strong> on route <strong>{bookedParcel.originCity} ➔ {bookedParcel.destinationCity}</strong>.
              </p>
            </div>

            {/* Handover Security OTPs */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 shadow-xs">
                <span className="text-[11px] font-bold text-indigo-900 block">1. SENDER PICKUP OTP</span>
                <div className="text-2xl font-mono font-black text-indigo-700 tracking-wider my-1">
                  {bookedParcel.pickupOtp}
                </div>
                <p className="text-[10px] text-indigo-900">
                  Give this code to the taxi driver when handing over your parcel at the station.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-900 block">2. RECEIVER DELIVERY OTP</span>
                <div className="text-2xl font-mono font-black text-emerald-700 tracking-wider my-1">
                  {bookedParcel.deliveryOtp}
                </div>
                <p className="text-[10px] text-emerald-900">
                  Send this code to {bookedParcel.receiverName}. Driver will ask for it at delivery.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                id="success-track-live-btn"
                onClick={() => {
                  const code = bookedParcel.trackingCode;
                  setBookedParcel(null);
                  onSelectDeliveryForTracking(code);
                }}
                className="flex-1 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Live on Highway Radar</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
              <button
                id="success-done-btn"
                onClick={() => setBookedParcel(null)}
                className="py-3.5 px-5 rounded-xl border border-zinc-300 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
