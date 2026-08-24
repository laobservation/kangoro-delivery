import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Car, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Check, 
  X, 
  DollarSign, 
  Luggage, 
  User, 
  Sparkles,
  FileCheck,
  CheckCircle2,
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import { TaxiDriver } from '../types';
import { Language, translations } from '../utils/i18n';
import { KANGORO_LOGO_URL } from '../constants';
import { getRouteDetails } from '../utils/helpers';

interface DriverRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterDriver: (driver: TaxiDriver) => void;
  language: Language;
}

const DRIVER_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
];

export const DriverRegisterModal: React.FC<DriverRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterDriver,
  language
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+212 6 ');
  const [city, setCity] = useState('Casablanca');
  const [plate, setPlate] = useState('06-A-');
  const [permitNumber, setPermitNumber] = useState('AGR-');
  const [vehicleModel, setVehicleModel] = useState('Mercedes-Benz E-Class Grand Taxi');
  const [vehicleColor, setVehicleColor] = useState('Classic White');
  const [vehicleType, setVehicleType] = useState<TaxiDriver['vehicleType']>('grand_taxi');
  const [originCity, setOriginCity] = useState('Casablanca');
  const [destinationCity, setDestinationCity] = useState('Rabat');
  const [originStation, setOriginStation] = useState('Central Grand Taxi Station (Derb Omar)');
  const [destinationStation, setDestinationStation] = useState('Rabat Ville Grand Taxi Station (Bab El Had)');
  const [maxParcels, setMaxParcels] = useState(6);

  // Update stations default presets whenever origin or destination city changes
  useEffect(() => {
    const route = getRouteDetails(originCity, destinationCity);
    if (route.stationsFrom && route.stationsFrom.length > 0) {
      setOriginStation(route.stationsFrom[0]);
    } else {
      setOriginStation(`${originCity} Central Taxi Bay`);
    }

    if (route.stationsTo && route.stationsTo.length > 0) {
      setDestinationStation(route.stationsTo[0]);
    } else {
      setDestinationStation(`${destinationCity} Main Terminal`);
    }
  }, [originCity, destinationCity]);
  const [flatBaseRate, setFlatBaseRate] = useState(18);
  const [basePricePerKg, setBasePricePerKg] = useState(3.5);
  const [acceptsDoorstep, setAcceptsDoorstep] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(DRIVER_AVATAR_PRESETS[0]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredDriver, setRegisteredDriver] = useState<TaxiDriver | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !plate.trim()) return;

    const newDriver: TaxiDriver = {
      id: `drv-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      avatar: selectedAvatar,
      rating: 5.0,
      totalTrips: 1,
      vehicleModel: vehicleModel.trim() || 'Grand Taxi Sedan',
      vehiclePlate: plate.trim().toUpperCase(),
      vehicleColor,
      vehicleType,
      originCity,
      destinationCity,
      departureTime: 'Departs in 30 mins',
      departureTimestamp: Date.now() + 30 * 60 * 1000,
      estimatedArrival: 'In ~1h 15m',
      originStation: originStation.trim() || `${originCity} Central Taxi Bay`,
      destinationStation: destinationStation.trim() || `${destinationCity} Main Terminal`,
      availableTrunkSpace: 'plenty',
      maxParcels: Number(maxParcels),
      currentParcelsCount: 0,
      basePricePerKg: Number(basePricePerKg),
      flatBaseRate: Number(flatBaseRate),
      acceptsDoorstep,
      status: 'boarding',
      currentProgressPct: 0,
      notes: `Permit: ${permitNumber.trim() || 'Verified'} • Operating daily on corridor.`
    };

    onRegisterDriver(newDriver);
    setRegisteredDriver(newDriver);
    setIsSuccess(true);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-xs overflow-y-auto ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white flex items-center justify-center shadow-xs">
              <img
                src={KANGORO_LOGO_URL}
                alt="KANGORO DELIVERY"
                referrerPolicy="no-referrer"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                <span>{t.driverRegTitle}</span>
                <span className="text-[10px] bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.5 rounded uppercase">
                  Grand Taxi
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 leading-tight">{t.driverRegSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess && registeredDriver ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-zinc-900">{t.driverRegSuccessTitle}</h4>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                {t.driverRegSuccessSub}
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Chauffeur:</span>
                <span className="font-bold text-zinc-900">{registeredDriver.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Matricule Taxi:</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {registeredDriver.vehiclePlate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Ligne:</span>
                <span className="font-bold text-zinc-900">{registeredDriver.originCity} ➔ {registeredDriver.destinationCity}</span>
              </div>
            </div>

            <button
              id="driver-success-terminal-btn"
              onClick={handleFinish}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{t.driverRegSuccessOpenTerminal}</span>
            </button>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Driver Identity */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" /> {t.step3Contacts}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverFullName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hassan El Mansouri"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverPhone}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+212 6 61 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500" /> {t.driverPhotoUrl}
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {DRIVER_AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url 
                          ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105' 
                          : 'border-zinc-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="driver preset" className="w-11 h-11 object-cover" />
                      {selectedAvatar === url && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-amber-900 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle & Taxi Permit Details */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-500" /> {t.driverVehicleType} & Taxi License
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverLicensePlate}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06-A-45892"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-zinc-900 uppercase focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverTaxiPermit}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AGR-CAS-8841"
                    value={permitNumber}
                    onChange={(e) => setPermitNumber(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverVehicleModel}
                  </label>
                  <select
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Mercedes-Benz 240D Classic Grand Taxi">Mercedes-Benz 240D (Classic Grand Taxi)</option>
                    <option value="Dacia Lodgy 7-Seater Grand Taxi">Dacia Lodgy 7-Seater Grand Taxi</option>
                    <option value="Mercedes-Benz Vito Intercity Shuttle">Mercedes-Benz Vito Intercity Shuttle</option>
                    <option value="Peugeot 508 / 301 Express Sedan">Peugeot 508 / 301 Express Sedan</option>
                    <option value="Hyundai H1 Intercity Minivan">Hyundai H1 Intercity Minivan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverVehicleColor}
                  </label>
                  <select
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Classic White">Blanc Classique (Casablanca / Rabat)</option>
                    <option value="Ochre Yellow">Jaune Ocre (Marrakech / Sud)</option>
                    <option value="Royal Blue">Bleu Royal (Tanger / Nord)</option>
                    <option value="Sandy Beige">Beige Sable (Fès / Meknès)</option>
                    <option value="Fire Red">Rouge Vif (Fès / Casablanca)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Operating Corridor & Hubs */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" /> Route Corridor & Grand Taxi Stations
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverOriginRoute}
                  </label>
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Fes">Fes</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Meknes">Meknes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverDestinationRoute}
                  </label>
                  <select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Rabat">Rabat</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Fes">Fes</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Meknes">Meknes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1 flex items-center justify-between">
                    <span>{t.driverOriginHub}</span>
                    <span className="text-[10px] text-amber-700 font-normal">Taxi Station / Bay</span>
                  </label>
                  {getRouteDetails(originCity, destinationCity).stationsFrom?.length > 0 ? (
                    <div className="space-y-1.5">
                      <select
                        value={originStation}
                        onChange={(e) => setOriginStation(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {getRouteDetails(originCity, destinationCity).stationsFrom.map((stn, idx) => (
                          <option key={idx} value={stn}>{stn}</option>
                        ))}
                        <option value="custom">✏️ Other Custom Station...</option>
                      </select>
                      {(!getRouteDetails(originCity, destinationCity).stationsFrom.includes(originStation) || originStation === 'custom') && (
                        <input
                          type="text"
                          required
                          placeholder="Enter origin taxi station name"
                          value={originStation === 'custom' ? '' : originStation}
                          onChange={(e) => setOriginStation(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      value={originStation}
                      onChange={(e) => setOriginStation(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1 flex items-center justify-between">
                    <span>{t.driverDestinationHub}</span>
                    <span className="text-[10px] text-amber-700 font-normal">Arrival Station / Bay</span>
                  </label>
                  {getRouteDetails(originCity, destinationCity).stationsTo?.length > 0 ? (
                    <div className="space-y-1.5">
                      <select
                        value={destinationStation}
                        onChange={(e) => setDestinationStation(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {getRouteDetails(originCity, destinationCity).stationsTo.map((stn, idx) => (
                          <option key={idx} value={stn}>{stn}</option>
                        ))}
                        <option value="custom">✏️ Other Custom Station...</option>
                      </select>
                      {(!getRouteDetails(originCity, destinationCity).stationsTo.includes(destinationStation) || destinationStation === 'custom') && (
                        <input
                          type="text"
                          required
                          placeholder="Enter arrival taxi station name"
                          value={destinationStation === 'custom' ? '' : destinationStation}
                          onChange={(e) => setDestinationStation(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      value={destinationStation}
                      onChange={(e) => setDestinationStation(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Capacity & Rates */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" /> Trunk Capacity & Parcel Rates
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverMaxParcels}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={maxParcels}
                    onChange={(e) => setMaxParcels(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverFlatBaseRate}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={flatBaseRate}
                    onChange={(e) => setFlatBaseRate(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    {t.driverKgRate}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={basePricePerKg}
                    onChange={(e) => setBasePricePerKg(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Doorstep Toggle */}
              <label className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptsDoorstep}
                  onChange={(e) => setAcceptsDoorstep(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-xs text-zinc-900 block">{t.driverDoorstepToggle}</span>
                  <span className="text-[10px] text-zinc-500">{t.driverDoorstepToggleSub}</span>
                </div>
              </label>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold text-xs hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                id="submit-driver-register-btn"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.driverSubmitBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
