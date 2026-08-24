import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  QrCode, 
  Clock, 
  Truck, 
  Share2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ParcelDelivery } from '../types';
import { RouteVisualizer } from './RouteVisualizer';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../utils/helpers';
import { Language, translations } from '../utils/i18n';

interface LiveTrackingViewProps {
  deliveries: ParcelDelivery[];
  selectedTrackingCode: string;
  onSelectTrackingCode: (code: string) => void;
  onOpenChat: (delivery: ParcelDelivery) => void;
  language?: Language;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  deliveries,
  selectedTrackingCode,
  onSelectTrackingCode,
  onOpenChat,
  language = 'en'
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const t = translations[language];

  // Active tracked delivery (strictly matching the user-submitted tracking code or phone)
  const currentDelivery = selectedTrackingCode
    ? deliveries.find(
        d => d.trackingCode.toLowerCase() === selectedTrackingCode.trim().toLowerCase() ||
             d.receiverPhone.includes(selectedTrackingCode.trim()) ||
             d.senderPhone.includes(selectedTrackingCode.trim())
      )
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    const found = deliveries.find(
      d => d.trackingCode.toLowerCase() === query.toLowerCase() ||
           d.receiverPhone.includes(query) ||
           d.senderPhone.includes(query)
    );

    if (found) {
      setSearchError(null);
      onSelectTrackingCode(found.trackingCode);
    } else {
      setSearchError(query);
    }
  };

  const handleClearTracking = () => {
    onSelectTrackingCode('');
    setSearchInput('');
    setSearchError(null);
  };

  const badgeInfo = currentDelivery ? getStatusBadgeInfo(currentDelivery.status) : null;

  const handleShareWaybill = () => {
    if (navigator.clipboard && currentDelivery) {
      navigator.clipboard.writeText(
        `Intercity Taxi Parcel Tracking:\nCode: ${currentDelivery.trackingCode}\nRoute: ${currentDelivery.originCity} ➔ ${currentDelivery.destinationCity}\nStatus: ${currentDelivery.status}\nDriver: ${currentDelivery.driver?.name} (${currentDelivery.driver?.phone})\nReceiver Delivery OTP: ${currentDelivery.deliveryOtp}`
      );
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Search Bar (when a parcel is already being tracked) */}
      {currentDelivery ? (
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="w-full sm:w-96 relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search other Waybill # (e.g. ICT-489102)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleClearTracking}
              className="px-3.5 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Track Another Shipment
            </button>
          </div>
        </div>
      ) : null}

      {/* Copy notification popup */}
      {copiedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-semibold animate-fade-in">
          ✓ Waybill details & recipient OTP copied to clipboard! Ready to share via SMS / WhatsApp.
        </div>
      )}

      {/* Search Error Alert */}
      {searchError && !currentDelivery && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">No active shipment found matching "{searchError}"</div>
            <p className="text-red-700">
              Please double check the waybill code (e.g. ICT-489102) or phone number and try again.
            </p>
          </div>
        </div>
      )}

      {/* State A: No Code Submitted Yet -> Dedicated Search Portal */}
      {!currentDelivery ? (
        <div className="max-w-2xl mx-auto my-8 bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-900 shadow-inner">
            <Package className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Real-Time Highway Radar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Track Your Grand Taxi Parcel
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Enter your official Waybill code or phone number to view live highway progress, driver details, and delivery handover codes.
            </p>
          </div>

          {/* Centered Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="live-tracking-search-input"
                type="text"
                required
                placeholder="Enter Waybill # (e.g. ICT-489102)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-2 border-zinc-300 rounded-2xl text-sm font-mono font-bold text-zinc-900 placeholder:font-sans placeholder:font-normal placeholder:text-zinc-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <button
              id="live-tracking-search-btn"
              type="submit"
              className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>Track</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Quick info badges */}
          <div className="pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
              <div className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live Highway Speed
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Real-time GPS road tracking</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
              <div className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Dual-OTP Security
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Protected pickup & handover</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
              <div className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                Direct Driver Chat
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Call or message anytime</p>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Code Submitted -> Show Highway Road Tracker & Full Waybill */
        <div className="space-y-6">
          {/* Road Style Highway Visualizer */}
          <RouteVisualizer delivery={currentDelivery} />

          {/* Main Parcel Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Delivery Manifest & Timeline */}
            <div className="lg:col-span-8 space-y-6">
              {/* Waybill Card */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider block">
                      OFFICIAL INTERCITY TAXI WAYBILL
                    </span>
                    <h2 className="text-xl font-extrabold text-zinc-900 font-mono flex items-center gap-2">
                      <span>{currentDelivery.trackingCode}</span>
                      {badgeInfo && (
                        <span className={`text-xs font-sans font-bold px-2.5 py-1 rounded-full border ${badgeInfo.bgColor} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}>
                          {badgeInfo.label}
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareWaybill}
                      className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      title="Share Waybill"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => onOpenChat(currentDelivery)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Live Driver Chat</span>
                    </button>
                  </div>
                </div>

                {/* Parcel Summary Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 text-xs">
                  <div>
                    <span className="text-zinc-700 block">Parcel Content</span>
                    <strong className="text-zinc-900 text-sm block mt-0.5">{currentDelivery.title}</strong>
                    <span className="text-zinc-700 capitalize">{currentDelivery.category} • {currentDelivery.weightKg} kg</span>
                  </div>

                  <div>
                    <span className="text-zinc-700 block">Total Delivery Fee</span>
                    <strong className="text-zinc-900 text-sm block mt-0.5">{formatCurrency(currentDelivery.priceTotal)}</strong>
                    <span className="text-zinc-700 capitalize font-medium">
                      {currentDelivery.paymentMethod.replace(/_/g, ' ')} ({currentDelivery.isPaid ? 'Paid' : 'Unpaid'})
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-700 block">Dispatched At</span>
                    <strong className="text-zinc-900 text-sm block mt-0.5">{formatDate(currentDelivery.createdAt)}</strong>
                    <span className="text-zinc-700">Via {currentDelivery.driver?.vehicleModel || 'Grand Taxi'}</span>
                  </div>
                </div>

                {/* Sender & Receiver Contacts Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sender Side */}
                  <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-500" /> Sender (Origin)
                      </span>
                      <span className="text-zinc-700 font-semibold">{currentDelivery.originCity}</span>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-zinc-900">{currentDelivery.senderName}</div>
                      <div className="text-zinc-600 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-zinc-400" /> {currentDelivery.senderPhone}
                      </div>
                      <div className="text-zinc-700 text-[11px] pt-1">
                        Station: <strong>{currentDelivery.originStation}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Receiver Side */}
                  <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-600" /> Recipient (Destination)
                      </span>
                      <span className="text-zinc-700 font-semibold">{currentDelivery.destinationCity}</span>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-zinc-900">{currentDelivery.receiverName}</div>
                      <div className="text-zinc-600 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-zinc-400" /> {currentDelivery.receiverPhone}
                      </div>
                      <div className="text-zinc-700 text-[11px] pt-1">
                        Destination: <strong>{currentDelivery.destinationStation}</strong>
                        {currentDelivery.isDoorstepDropoff && (
                          <span className="text-emerald-700 block">Doorstep: {currentDelivery.dropoffAddress}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline History */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> Intercity Audit Log & Verification Timeline
                  </h4>
                  <div className="space-y-3 pl-2 border-l-2 border-zinc-200">
                    {currentDelivery.statusHistory.map((h, i) => (
                      <div key={i} className="relative pl-4 text-xs space-y-0.5">
                        <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-zinc-900 border-2 border-white" />
                        <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                          <span className="font-semibold text-zinc-800">{h.locationName || 'Highway Corridor'}</span>
                          <span>{formatDate(h.timestamp)}</span>
                        </div>
                        <p className="text-zinc-700 font-medium">{h.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Handover Security Tokens & Driver Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Security Handover OTP Cards */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security Handover Codes
                </h3>

                {/* Pickup OTP */}
                <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-indigo-900 text-xs font-bold">
                    <span>Sender Pickup Code</span>
                    <span className="text-[10px] bg-indigo-200/80 px-1.5 py-0.5 rounded text-indigo-950 font-semibold">
                      For Driver Loading
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-indigo-700 tracking-wider">
                    {currentDelivery.pickupOtp}
                  </div>
                  <p className="text-[11px] text-indigo-900">
                    Show or read this 4-digit code to driver {currentDelivery.driver?.name} at departure station.
                  </p>
                </div>

                {/* Delivery OTP */}
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
                    <span>Receiver Delivery Code</span>
                    <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-950 font-semibold">
                      For Recipient Handover
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-700 tracking-wider">
                    {currentDelivery.deliveryOtp}
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Send to <strong>{currentDelivery.receiverName}</strong>. Driver requires this code to release the package.
                  </p>
                </div>

                {/* QR Code Placeholder */}
                <div className="border border-dashed border-zinc-300 rounded-xl p-4 text-center bg-zinc-50/50 space-y-2">
                  <QrCode className="w-14 h-14 text-zinc-700 mx-auto" />
                  <span className="text-[11px] font-mono text-zinc-600 block">
                    Fast Driver Scanner Code
                  </span>
                </div>
              </div>

              {/* Driver Contact Card */}
              {currentDelivery.driver && (
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-500" /> Assigned Intercity Driver
                  </h3>

                  <div className="flex items-center gap-3">
                    <img
                      src={currentDelivery.driver.avatar}
                      alt={currentDelivery.driver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{currentDelivery.driver.name}</h4>
                      <p className="text-xs text-zinc-600">{currentDelivery.driver.vehicleModel}</p>
                      <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                        {currentDelivery.driver.vehiclePlate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex gap-2">
                    <a
                      href={`tel:${currentDelivery.driver.phone}`}
                      className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-800 hover:bg-zinc-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Call Driver</span>
                    </a>
                    <button
                      onClick={() => onOpenChat(currentDelivery)}
                      className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
