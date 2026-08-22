import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { TaxiDriver, ParcelSize, PaymentMethod, ParcelDelivery } from '../types';
import { POPULAR_ROUTES } from '../data/mockData';
import { 
  formatCurrency, 
  calculateDeliveryPrice, 
  generateTrackingCode, 
  generateOtp,
  getRouteDetails
} from '../utils/helpers';

interface SenderViewProps {
  drivers: TaxiDriver[];
  onBookParcel: (parcel: ParcelDelivery) => void;
  onSelectDeliveryForTracking: (trackingCode: string) => void;
}

export const SenderView: React.FC<SenderViewProps> = ({
  drivers,
  onBookParcel,
  onSelectDeliveryForTracking
}) => {
  // Route selection states
  const [originCity, setOriginCity] = useState<string>('Casablanca');
  const [destinationCity, setDestinationCity] = useState<string>('Rabat');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'plenty' | 'doorstep'>('all');

  // Selected driver for booking modal
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);

  // Booking Form State
  const [parcelCategory, setParcelCategory] = useState<ParcelSize>('small');
  const [parcelTitle, setParcelTitle] = useState('');
  const [parcelDescription, setParcelDescription] = useState('');
  const [weightKg, setWeightKg] = useState<number>(2.0);
  const [isFragile, setIsFragile] = useState(false);
  const [declaredValue, setDeclaredValue] = useState<number>(50);

  // Sender details
  const [senderName, setSenderName] = useState('Amine Bennani');
  const [senderPhone, setSenderPhone] = useState('+212 6 61 88 99 00');
  const [senderNotes, setSenderNotes] = useState('I will meet driver at station bay 2.');
  const [isDoorstepPickup, setIsDoorstepPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');

  // Receiver details
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverInstructions, setReceiverInstructions] = useState('');
  const [isDoorstepDropoff, setIsDoorstepDropoff] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_pickup');

  // Success screen state
  const [bookedParcel, setBookedParcel] = useState<ParcelDelivery | null>(null);

  // Calculate route details and available drivers
  const routeInfo = getRouteDetails(originCity, destinationCity);

  const availableDrivers = drivers.filter(d => {
    const matchRoute = 
      d.originCity.toLowerCase() === originCity.toLowerCase() &&
      d.destinationCity.toLowerCase() === destinationCity.toLowerCase();
    
    if (!matchRoute) return false;
    if (selectedCategoryFilter === 'plenty' && d.availableTrunkSpace !== 'plenty') return false;
    if (selectedCategoryFilter === 'doorstep' && !d.acceptsDoorstep) return false;
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

  const handleOpenBooking = (driver: TaxiDriver) => {
    setSelectedDriver(driver);
    // Pre-fill realistic titles
    if (!parcelTitle) {
      setParcelTitle('Document Envelope & Spare Parts');
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
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
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
    { id: 'envelope' as ParcelSize, label: 'Document / Envelope', desc: 'Letters, legal deeds, small pouch', maxKg: 0.5, icon: '📄' },
    { id: 'small' as ParcelSize, label: 'Small Box (< 3 kg)', desc: 'Shoebox size, electronics, cosmetics', maxKg: 3, icon: '📦' },
    { id: 'medium' as ParcelSize, label: 'Medium Box (3-10 kg)', desc: 'Carton box, mechanical parts, clothing', maxKg: 10, icon: '🧳' },
    { id: 'large' as ParcelSize, label: 'Large Cargo (10-25 kg)', desc: 'Heavy bag, equipment, multiple boxes', maxKg: 25, icon: '🚚' },
    { id: 'fragile' as ParcelSize, label: 'Fragile / Special', desc: 'Glassware, ceramics, artwork', maxKg: 8, icon: '🍷' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Intercity Route Selector */}
      <section className="bg-linear-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 rounded-3xl p-6 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" /> Intercity Grand Taxi Express Delivery
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Send Parcels From City to City in Hours
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              Select an intercity taxi driver heading to your destination. Hand over your parcel at the central taxi station, and the driver delivers it directly to your recipient.
            </p>
          </div>

          {/* Quick Route Corridor Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700">Popular Corridors:</span>
            {POPULAR_ROUTES.map((route, idx) => {
              const isActive = originCity === route.from && destinationCity === route.to;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setOriginCity(route.from);
                    setDestinationCity(route.to);
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs' 
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  {route.from} ➔ {route.to}
                </button>
              );
            })}
          </div>

          {/* City Selection Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-zinc-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin City */}
            <div className="md:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> Origin City (Sending From)
              </label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tangier">Tangier</option>
                <option value="Paris">Paris</option>
                <option value="Lyon">Lyon</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="New York">New York</option>
                <option value="Philadelphia">Philadelphia</option>
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={() => {
                  const temp = originCity;
                  setOriginCity(destinationCity);
                  setDestinationCity(temp);
                }}
                className="p-2.5 rounded-full bg-zinc-100 hover:bg-amber-100 text-zinc-700 hover:text-amber-900 border border-zinc-300 transition-all cursor-pointer shadow-xs"
                title="Swap origin and destination"
              >
                <ArrowRight className="w-4 h-4 md:rotate-0 rotate-90" />
              </button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination City (Delivering To)
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Rabat">Rabat</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tangier">Tangier</option>
                <option value="Lyon">Lyon</option>
                <option value="Paris">Paris</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Philadelphia">Philadelphia</option>
                <option value="New York">New York</option>
              </select>
            </div>
          </div>

          {/* Route Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 px-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">Corridor Highway:</span>
              <span className="bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200 font-mono text-zinc-800">
                {routeInfo.highwayName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Distance: <strong>{routeInfo.distanceKm} km</strong></span>
              <span>Avg Transit Time: <strong>~{Math.round(routeInfo.avgDurationMinutes / 60)} hrs {routeInfo.avgDurationMinutes % 60} mins</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Available Taxi Drivers List */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span>Available Intercity Taxis</span>
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                {availableDrivers.length} Departing Soon
              </span>
            </h2>
            <p className="text-xs text-zinc-600">
              Verified drivers with designated parcel trunk compartments and real-time OTP security.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategoryFilter === 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              All Taxis
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('plenty')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategoryFilter === 'plenty'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Spacious Trunk
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('doorstep')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategoryFilter === 'doorstep'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Doorstep Delivery
            </button>
          </div>
        </div>

        {availableDrivers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center space-y-3">
            <Car className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="font-bold text-zinc-800">No scheduled taxis found for this exact route right now</h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              You can switch routes above or switch to the <strong>Driver Terminal</strong> to publish a new trip on this route.
            </p>
            <button
              onClick={() => {
                setOriginCity('Casablanca');
                setDestinationCity('Rabat');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              View Casablanca ➔ Rabat Taxis
            </button>
          </div>
        ) : (
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
                      <div className="flex items-center justify-between text-zinc-700">
                        <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                          <Clock className="w-3.5 h-3.5" /> {driver.departureTime}
                        </span>
                        <span className="text-zinc-600">
                          Est. Arrival: <strong>{driver.estimatedArrival}</strong>
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

                    {/* Driver Notes & Trunk Capacity */}
                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-zinc-600">Trunk Space:</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          driver.availableTrunkSpace === 'plenty'
                            ? 'bg-emerald-100 text-emerald-800'
                            : driver.availableTrunkSpace === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {remainingSlots} parcel slots left
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
                      <span className="text-[11px] text-zinc-700 block">Standard Parcel From</span>
                      <span className="text-lg font-black text-zinc-900">
                        {formatCurrency(driver.flatBaseRate)}
                      </span>
                      <span className="text-[10px] text-zinc-700"> / docs & small box</span>
                    </div>

                    <button
                      id={`book-driver-${driver.id}`}
                      onClick={() => handleOpenBooking(driver)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer group-hover:shadow-md"
                    >
                      <span>Send Parcel with Taxi</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Parcel Dispatch Wizard Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-zinc-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover"
                />
                <div>
                  <h3 className="font-bold text-base text-zinc-100">
                    Book Parcel Dispatch with {selectedDriver.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {originCity} ➔ {destinationCity} • {selectedDriver.departureTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
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
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        parcelCategory === cat.id
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/40'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-zinc-900">{cat.label}</div>
                        <div className="text-[11px] text-zinc-700">{cat.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Weight & Fragile Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Estimated Weight (kg): {weightKg} kg
                    </label>
                    <input
                      type="range"
                      min="0.2"
                      max="20"
                      step="0.2"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">Fragile Item?</span>
                      <span className="text-[10px] text-zinc-700">Special front cabin / cushioned trunk placement</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFragile}
                      onChange={(e) => setIsFragile(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Parcel Title / Short Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Legal documents & auto part sample"
                    value={parcelTitle}
                    onChange={(e) => setParcelTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Pickup & Dropoff Stations */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" /> 2. Handover & Delivery Points
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin Meeting */}
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-2">
                    <span className="text-xs font-bold text-zinc-900 block">
                      Origin Handover ({originCity})
                    </span>
                    <p className="text-xs text-zinc-700">
                      Taxi Departure Station: <strong className="text-zinc-900">{selectedDriver.originStation}</strong>
                    </p>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDoorstepPickup}
                        onChange={(e) => setIsDoorstepPickup(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="text-xs text-zinc-700">Request driver pickup from my doorstep (+ $6.00)</span>
                    </label>

                    {isDoorstepPickup && (
                      <input
                        type="text"
                        placeholder="Your exact pickup street address..."
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    )}
                  </div>

                  {/* Destination Dropoff */}
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-2">
                    <span className="text-xs font-bold text-zinc-900 block">
                      Destination Delivery ({destinationCity})
                    </span>
                    <p className="text-xs text-zinc-700">
                      Taxi Arrival Station: <strong className="text-zinc-900">{selectedDriver.destinationStation}</strong>
                    </p>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDoorstepDropoff}
                        onChange={(e) => setIsDoorstepDropoff(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="text-xs text-zinc-700">Direct Doorstep Delivery to Receiver (+ $6.00)</span>
                    </label>

                    {isDoorstepDropoff && (
                      <input
                        type="text"
                        placeholder="Receiver's exact address in destination city..."
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Recipient & Sender Contact Info */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-500" /> 3. Sender & Recipient Contacts
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sender Contact */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-zinc-700">Sender Details</span>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Your Phone (+212...)"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Receiver Contact */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-zinc-700">Recipient Details (Who will receive)</span>
                    <input
                      type="text"
                      required
                      placeholder="Receiver Full Name"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Receiver Phone (+212...)"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="space-y-2 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-500" /> 4. Payment Preference
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
                    <div className="text-[10px] text-zinc-700">Give cash to taxi driver at station</div>
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
                    <div className="text-[10px] text-zinc-700">Receiver pays driver on arrival</div>
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
                    <div className="text-[10px] text-zinc-700">Released upon recipient OTP code</div>
                  </button>
                </div>
              </div>

              {/* Price Summary & Submit */}
              <div className="bg-zinc-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs text-zinc-400 block">Total Estimated Delivery Fee</span>
                  <div className="text-2xl font-black text-amber-400">
                    {formatCurrency(priceBreakdown.total)}
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Includes highway toll, intercity trunk space & driver handover verification.
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedDriver(null)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Confirm & Generate Waybill
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success / Waybill Generated Modal */}
      {bookedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden text-center p-6 sm:p-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Parcel Booking Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-900 mt-2">
                Waybill: {bookedParcel.trackingCode}
              </h3>
              <p className="text-xs text-zinc-600">
                Assigned to driver <strong>{bookedParcel.driver?.name}</strong> on route <strong>{bookedParcel.originCity} ➔ {bookedParcel.destinationCity}</strong>.
              </p>
            </div>

            {/* Handover Security OTPs */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold text-indigo-900 block">1. SENDER PICKUP OTP</span>
                <div className="text-2xl font-mono font-black text-indigo-700 tracking-wider my-1">
                  {bookedParcel.pickupOtp}
                </div>
                <p className="text-[10px] text-indigo-900">
                  Give this 4-digit code to the taxi driver when handing over your parcel at the station.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold text-emerald-900 block">2. RECEIVER DELIVERY OTP</span>
                <div className="text-2xl font-mono font-black text-emerald-700 tracking-wider my-1">
                  {bookedParcel.deliveryOtp}
                </div>
                <p className="text-[10px] text-emerald-900">
                  Send this code to {bookedParcel.receiverName}. Driver will request it upon handover.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  const code = bookedParcel.trackingCode;
                  setBookedParcel(null);
                  onSelectDeliveryForTracking(code);
                }}
                className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Track Live on Highway Map
              </button>
              <button
                onClick={() => setBookedParcel(null)}
                className="py-3 px-5 rounded-xl border border-zinc-300 text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition-colors"
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
