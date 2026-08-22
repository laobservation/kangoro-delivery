import React, { useState } from 'react';
import { 
  Truck, 
  PlusCircle, 
  MapPin, 
  Clock, 
  DollarSign, 
  Luggage, 
  ShieldCheck, 
  Check, 
  X, 
  Phone, 
  MessageSquare, 
  Navigation, 
  KeyRound, 
  ArrowRight,
  TrendingUp,
  Car,
  UserPlus,
  LogOut
} from 'lucide-react';
import { TaxiDriver, ParcelDelivery } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { HandoverVerifyModal } from './HandoverVerifyModal';
import { Language, translations } from '../utils/i18n';

interface DriverTerminalViewProps {
  drivers: TaxiDriver[];
  activeDriverId: string;
  onSelectDriver: (driverId: string) => void;
  deliveries: ParcelDelivery[];
  onPublishTrip: (tripData: Partial<TaxiDriver>) => void;
  onUpdateDriverStatus: (driverId: string, status: TaxiDriver['status'], progressPct: number) => void;
  onVerifyHandover: (deliveryId: string, otp: string, proofPhoto?: string) => boolean;
  onOpenChat: (delivery: ParcelDelivery) => void;
  language?: Language;
  onOpenDriverRegister?: () => void;
  onLogoutDriver?: () => void;
}

export const DriverTerminalView: React.FC<DriverTerminalViewProps> = ({
  drivers,
  activeDriverId,
  onSelectDriver,
  deliveries,
  onPublishTrip,
  onUpdateDriverStatus,
  onVerifyHandover,
  onOpenChat,
  language = 'en',
  onOpenDriverRegister,
  onLogoutDriver
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [verifyingDelivery, setVerifyingDelivery] = useState<{ delivery: ParcelDelivery; type: 'pickup' | 'delivery' } | null>(null);

  // New Trip Form State
  const [newOrigin, setNewOrigin] = useState('Casablanca');
  const [newDestination, setNewDestination] = useState('Rabat');
  const [newOriginStation, setNewOriginStation] = useState('Central Grand Taxi Station (Derb Omar)');
  const [newDestinationStation, setNewDestinationStation] = useState('Rabat Ville Grand Taxi Station (Bab El Had)');
  const [newVehicleModel, setNewVehicleModel] = useState('Mercedes-Benz E-Class Grand Taxi');
  const [newVehiclePlate, setNewVehiclePlate] = useState('33-A-77889');
  const [newMaxParcels, setNewMaxParcels] = useState(5);
  const [newBaseRate, setNewBaseRate] = useState(18);
  const [newDepartureMins, setNewDepartureMins] = useState(30);

  const activeDriver = drivers.find(d => d.id === activeDriverId) || drivers[0];

  // Filter deliveries assigned to this driver
  const driverParcels = deliveries.filter(d => d.driverId === activeDriver?.id);
  const onboardParcels = driverParcels.filter(d => d.status === 'picked_up' || d.status === 'in_transit');
  const pendingPickupParcels = driverParcels.filter(d => d.status === 'accepted');
  const arrivedParcels = driverParcels.filter(d => d.status === 'arrived_at_station');
  const deliveredParcels = driverParcels.filter(d => d.status === 'delivered');

  const totalDriverEarnings = driverParcels.reduce((sum, p) => sum + (p.status === 'delivered' || p.status === 'in_transit' || p.status === 'picked_up' ? p.priceTotal : 0), 0);

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    onPublishTrip({
      name: activeDriver?.name || 'Grand Taxi Driver',
      avatar: activeDriver?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      originCity: newOrigin,
      destinationCity: newDestination,
      originStation: newOriginStation,
      destinationStation: newDestinationStation,
      vehicleModel: newVehicleModel,
      vehiclePlate: newVehiclePlate,
      maxParcels: Number(newMaxParcels),
      currentParcelsCount: 0,
      flatBaseRate: Number(newBaseRate),
      basePricePerKg: 3.5,
      departureTime: `Departs in ${newDepartureMins} mins`,
      departureTimestamp: Date.now() + newDepartureMins * 60 * 1000,
      estimatedArrival: 'In ~1h 10m',
      availableTrunkSpace: 'plenty',
      acceptsDoorstep: true,
      status: 'boarding',
      currentProgressPct: 0
    });
    setShowPublishModal(false);
  };

  return (
    <div className={`space-y-6 pb-12 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Driver Bar & Profile Switcher */}
      <div className="bg-zinc-900 text-white rounded-3xl p-5 sm:p-6 border border-zinc-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeDriver.avatar}
                alt={activeDriver.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-100">{activeDriver.name}</h1>
                <span className="text-xs bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded uppercase">
                  {t.driverDispatcherMode}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {activeDriver.vehicleModel} • {t.taxiPlate}: <strong className="text-zinc-200">{activeDriver.vehiclePlate}</strong>
              </p>
            </div>
          </div>

          {/* Switch Driver, Register Driver, or Publish New Trip */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Driver Select */}
            <select
              id="driver-select-dropdown"
              value={activeDriverId}
              onChange={(e) => onSelectDriver(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.originCity} ➔ {d.destinationCity})
                </option>
              ))}
            </select>

            {/* Register New Driver CTA */}
            {onOpenDriverRegister && (
              <button
                id="driver-terminal-register-btn"
                onClick={onOpenDriverRegister}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title={t.navRegisterDriver}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.navRegisterDriver}</span>
              </button>
            )}

            {/* Publish Trip Button */}
            <button
              id="publish-trip-btn"
              onClick={() => setShowPublishModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.driverPublishTripBtn}</span>
            </button>

            {/* Optional Logout / Reset Active Driver */}
            {onLogoutDriver && (
              <button
                id="driver-logout-btn"
                onClick={onLogoutDriver}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-700 transition-colors cursor-pointer"
                title={t.driverLogoutBtn}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Driver Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800/80">
          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">{t.driverTodayEarnings}</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              {formatCurrency(totalDriverEarnings)}
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">{t.driverActiveRoute}</span>
            <div className="text-xs font-bold text-zinc-200 mt-1 truncate">
              {activeDriver.originCity} ➔ {activeDriver.destinationCity}
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">{t.driverTrunkLoad}</span>
            <div className="text-xs font-bold text-zinc-200 mt-1">
              {driverParcels.filter(p => p.status !== 'delivered').length} / {activeDriver.maxParcels} {t.slotsLeft}
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">{t.driverTripLifecycle}</span>
            <div className="text-xs font-bold text-emerald-400 mt-1 capitalize flex items-center gap-1">
              <Navigation className="w-3 h-3" /> {activeDriver.status.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Active Trip Lifecycle Step Controller */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-500" />
              <span>{t.driverTripLifecycle} Controller</span>
            </h2>
            <p className="text-xs text-zinc-600">
              Update your taxi status to notify senders and receivers in real-time.
            </p>
          </div>
        </div>

        {/* Trip Stage Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'boarding', 10)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'boarding'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs text-zinc-900">{t.driverStage1Boarding}</div>
            <div className="text-[10px] text-zinc-700">Verifying parcel handovers</div>
          </button>

          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'in_transit', 55)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'in_transit'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs text-zinc-900">{t.driverStage2Highway}</div>
            <div className="text-[10px] text-zinc-700">Cruising intercity express line</div>
          </button>

          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'arrived', 90)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'arrived'
                ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs text-zinc-900">{t.driverStage3Arrived}</div>
            <div className="text-[10px] text-zinc-700">Waiting for recipients at station</div>
          </button>

          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'completed', 100)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'completed'
                ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs text-zinc-900">{t.driverStage4Completed}</div>
            <div className="text-[10px] text-zinc-700">All parcels delivered safely</div>
          </button>
        </div>
      </div>

      {/* Driver Parcels List: Awaiting Pickup & Onboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Awaiting Pickup Handover (Need Sender OTP) */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Awaiting Pickup Handover ({pendingPickupParcels.length})</span>
            </h3>
            <span className="text-xs text-zinc-500 font-medium">Verify Sender 4-digit OTP</span>
          </div>

          {pendingPickupParcels.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-xs">
              No pending pickups. Senders will appear here when booking this taxi.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPickupParcels.map((parcel) => (
                <div key={parcel.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900">{parcel.title}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">Code: {parcel.trackingCode} • {parcel.weightKg} kg</div>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      {formatCurrency(parcel.priceTotal)}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Sender: <strong>{parcel.senderName}</strong></span>
                      <a href={`tel:${parcel.senderPhone}`} className="text-amber-600 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {parcel.senderPhone}
                      </a>
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" /> Station: {parcel.originStation}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVerifyingDelivery({ delivery: parcel, type: 'pickup' })}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify Sender Pickup OTP</span>
                    </button>
                    <button
                      onClick={() => onOpenChat(parcel)}
                      className="p-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Onboard in Trunk & Arrived at Destination (Need Recipient OTP) */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Loaded in Trunk & Destination Handover ({onboardParcels.length + arrivedParcels.length})</span>
            </h3>
            <span className="text-xs text-zinc-500 font-medium">Verify Recipient OTP</span>
          </div>

          {[...onboardParcels, ...arrivedParcels].length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-xs">
              No parcels currently loaded in trunk.
            </div>
          ) : (
            <div className="space-y-3">
              {[...onboardParcels, ...arrivedParcels].map((parcel) => (
                <div key={parcel.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900">{parcel.title}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        Code: {parcel.trackingCode} • Status: <strong className="text-emerald-700">{parcel.status.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {formatCurrency(parcel.priceTotal)}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Recipient: <strong>{parcel.receiverName}</strong></span>
                      <a href={`tel:${parcel.receiverPhone}`} className="text-amber-600 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {parcel.receiverPhone}
                      </a>
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" /> Dropoff: {parcel.destinationStation}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVerifyingDelivery({ delivery: parcel, type: 'delivery' })}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.driverVerifyHandoverBtn}</span>
                    </button>
                    <button
                      onClick={() => onOpenChat(parcel)}
                      className="p-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publish Trip Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>{t.driverPublishTripBtn}</span>
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">{t.originCityLabel}</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => {
                      setNewOrigin(e.target.value);
                      setNewOriginStation(`${e.target.value} Central Grand Taxi Station`);
                    }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Fes">Fes</option>
                    <option value="Agadir">Agadir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">{t.destinationCityLabel}</label>
                  <select
                    value={newDestination}
                    onChange={(e) => {
                      setNewDestination(e.target.value);
                      setNewDestinationStation(`${e.target.value} Grand Station`);
                    }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Rabat">Rabat</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Fes">Fes</option>
                    <option value="Agadir">Agadir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.driverOriginHub}</label>
                <input
                  type="text"
                  required
                  value={newOriginStation}
                  onChange={(e) => setNewOriginStation(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.driverVehicleModel}</label>
                  <input
                    type="text"
                    required
                    value={newVehicleModel}
                    onChange={(e) => setNewVehicleModel(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.driverLicensePlate}</label>
                  <input
                    type="text"
                    required
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.driverMaxParcels}</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newMaxParcels}
                    onChange={(e) => setNewMaxParcels(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.driverFlatBaseRate}</label>
                  <input
                    type="number"
                    min="10"
                    value={newBaseRate}
                    onChange={(e) => setNewBaseRate(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Departing in (Minutes): {newDepartureMins} mins
                </label>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="5"
                  value={newDepartureMins}
                  onChange={(e) => setNewDepartureMins(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-semibold text-xs cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  {t.driverPublishTripBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {verifyingDelivery && (
        <HandoverVerifyModal
          delivery={verifyingDelivery.delivery}
          type={verifyingDelivery.type}
          onVerify={onVerifyHandover}
          onClose={() => setVerifyingDelivery(null)}
        />
      )}
    </div>
  );
};
