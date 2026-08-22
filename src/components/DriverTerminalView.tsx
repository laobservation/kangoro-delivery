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
  Car
} from 'lucide-react';
import { TaxiDriver, ParcelDelivery } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { HandoverVerifyModal } from './HandoverVerifyModal';

interface DriverTerminalViewProps {
  drivers: TaxiDriver[];
  activeDriverId: string;
  onSelectDriver: (driverId: string) => void;
  deliveries: ParcelDelivery[];
  onPublishTrip: (tripData: Partial<TaxiDriver>) => void;
  onUpdateDriverStatus: (driverId: string, status: TaxiDriver['status'], progressPct: number) => void;
  onVerifyHandover: (deliveryId: string, otp: string, proofPhoto?: string) => boolean;
  onOpenChat: (delivery: ParcelDelivery) => void;
}

export const DriverTerminalView: React.FC<DriverTerminalViewProps> = ({
  drivers,
  activeDriverId,
  onSelectDriver,
  deliveries,
  onPublishTrip,
  onUpdateDriverStatus,
  onVerifyHandover,
  onOpenChat
}) => {
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
  const [newBaseRate, setNewBaseRate] = useState(15);
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
    <div className="space-y-6 pb-12">
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
                  Taxi Dispatcher Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {activeDriver.vehicleModel} • Plate: <strong className="text-zinc-200">{activeDriver.vehiclePlate}</strong>
              </p>
            </div>
          </div>

          {/* Switch Driver or Publish New Trip */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Driver Select */}
            <select
              value={activeDriverId}
              onChange={(e) => onSelectDriver(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  Driver: {d.name} ({d.originCity} ➔ {d.destinationCity})
                </option>
              ))}
            </select>

            <button
              id="publish-trip-btn"
              onClick={() => setShowPublishModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish New Intercity Trip</span>
            </button>
          </div>
        </div>

        {/* Driver Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800/80">
          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">Today's Parcel Earnings</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              {formatCurrency(totalDriverEarnings)}
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">Active Route</span>
            <div className="text-xs font-bold text-zinc-200 mt-1 truncate">
              {activeDriver.originCity} ➔ {activeDriver.destinationCity}
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">Trunk Load</span>
            <div className="text-xs font-bold text-zinc-200 mt-1">
              {driverParcels.filter(p => p.status !== 'delivered').length} / {activeDriver.maxParcels} Parcel slots
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
            <span className="text-[11px] text-zinc-400 block">Trip Lifecycle</span>
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
              <span>Current Trip Highway Progression</span>
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
            <div className="font-bold text-xs text-zinc-900">1. Boarding at Station</div>
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
            <div className="font-bold text-xs text-zinc-900">2. On Highway (In Transit)</div>
            <div className="text-[10px] text-zinc-700">Cruising intercity express line</div>
          </button>

          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'arrived', 92)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'arrived'
                ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs text-zinc-900">3. Arrived at Destination Hub</div>
            <div className="text-[10px] text-zinc-700">Ready for recipient handover</div>
          </button>

          <button
            onClick={() => onUpdateDriverStatus(activeDriver.id, 'completed', 100)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeDriver.status === 'completed'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="font-bold text-xs">4. Trip Completed</div>
            <div className="text-[10px] text-zinc-400">All packages handed over</div>
          </button>
        </div>
      </div>

      {/* Driver Trunk Manifest / Booked Parcels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Luggage className="w-5 h-5 text-amber-500" />
            <span>Trunk Manifest ({driverParcels.length} Total Parcels)</span>
          </h3>
          <span className="text-xs text-zinc-600">
            Verify 4-digit codes on pickup and dropoff to protect liability.
          </span>
        </div>

        {driverParcels.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center space-y-2">
            <Luggage className="w-10 h-10 text-zinc-400 mx-auto" />
            <p className="text-sm font-semibold text-zinc-700">No parcel bookings for this taxi trip yet.</p>
            <p className="text-xs text-zinc-700">Switch to the "Send Parcel" tab to book a package with {activeDriver.name}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {driverParcels.map((parcel) => {
              const isDelivered = parcel.status === 'delivered';
              const isOnboard = parcel.status === 'picked_up' || parcel.status === 'in_transit';
              const isPendingPickup = parcel.status === 'accepted' || parcel.status === 'requested';
              const isArrived = parcel.status === 'arrived_at_station';

              return (
                <div
                  key={parcel.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isDelivered
                      ? 'border-zinc-200 bg-zinc-50/50 opacity-80'
                      : 'border-zinc-300 shadow-xs hover:border-amber-400'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Parcel Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                          {parcel.trackingCode}
                        </span>
                        <span className="font-bold text-zinc-900 text-sm">{parcel.title}</span>
                        <span className="text-xs text-zinc-700 capitalize">
                          ({parcel.category} • {parcel.weightKg} kg)
                        </span>
                      </div>

                      <div className="text-xs text-zinc-600 flex flex-wrap items-center gap-3 pt-1">
                        <span>
                          From: <strong>{parcel.senderName}</strong> ({parcel.senderPhone})
                        </span>
                        <span>➔</span>
                        <span>
                          To: <strong>{parcel.receiverName}</strong> ({parcel.receiverPhone})
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-700 pt-0.5">
                        Dropoff: <strong>{parcel.destinationStation}</strong>
                        {parcel.isDoorstepDropoff && (
                          <span className="text-emerald-700 ml-1 font-semibold">(Doorstep: {parcel.dropoffAddress})</span>
                        )}
                      </div>
                    </div>

                    {/* Financials & Status Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                      <div className="text-right">
                        <span className="text-sm font-black text-zinc-900 block">
                          {formatCurrency(parcel.priceTotal)}
                        </span>
                        <span className="text-[10px] text-zinc-700 capitalize block">
                          {parcel.paymentMethod.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Chat */}
                      <button
                        onClick={() => onOpenChat(parcel)}
                        className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        title="Chat with sender/receiver"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Verification Buttons */}
                      {isPendingPickup && (
                        <button
                          id={`verify-pickup-${parcel.id}`}
                          onClick={() => setVerifyingDelivery({ delivery: parcel, type: 'pickup' })}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Verify Pickup OTP</span>
                        </button>
                      )}

                      {(isOnboard || isArrived) && (
                        <button
                          id={`verify-delivery-${parcel.id}`}
                          onClick={() => setVerifyingDelivery({ delivery: parcel, type: 'delivery' })}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Handover & Verify Recipient</span>
                        </button>
                      )}

                      {isDelivered && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                          <Check className="w-3.5 h-3.5" /> Delivered & Signed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Publish Trip Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Publish Intercity Taxi Schedule</h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Departure City</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => {
                      setNewOrigin(e.target.value);
                      setNewOriginStation(`${e.target.value} Central Taxi Hub`);
                    }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Paris">Paris</option>
                    <option value="Lyon">Lyon</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Destination City</label>
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
                    <option value="Lyon">Lyon</option>
                    <option value="Paris">Paris</option>
                    <option value="Mombasa">Mombasa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Departure Station / Bay</label>
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
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={newVehicleModel}
                    onChange={(e) => setNewVehicleModel(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Taxi Plate Number</label>
                  <input
                    type="text"
                    required
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Max Parcels in Trunk</label>
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
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    min="5"
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
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
                >
                  Publish Trip to Senders
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
