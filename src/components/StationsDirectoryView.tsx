import React from 'react';
import { Building2, MapPin, Phone, ShieldCheck, Clock, AlertTriangle, CheckCircle2, Truck } from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockData';

export const StationsDirectoryView: React.FC = () => {
  const stationHubs = [
    {
      city: 'Casablanca',
      name: 'Central Grand Taxi Station (Derb Omar)',
      address: 'Derb Omar Grand Station, Blvd Mohamed V, Casablanca',
      phone: '+212 5 22 20 11 00',
      hours: '24/7 Continuous Service',
      lines: ['To Rabat (every 15 min)', 'To Marrakech (every 30 min)', 'To Tangier (every 45 min)'],
      parcelDropBay: 'Bay #3 - Express Courier Desk'
    },
    {
      city: 'Rabat',
      name: 'Rabat Ville Grand Taxi Hub (Bab El Had)',
      address: 'Place Bab El Had, Central Medina Gates, Rabat',
      phone: '+212 5 37 70 88 44',
      hours: '05:30 AM - 01:00 AM',
      lines: ['To Casablanca (every 15 min)', 'To Tangier & Kenitra', 'To Fez & Meknes'],
      parcelDropBay: 'Platform 1 - Dispatch Office'
    },
    {
      city: 'Marrakech',
      name: 'Bab Doukkala Intercity Taxi & Bus Terminal',
      address: 'Avenue 11 Janvier, Bab Doukkala, Marrakech',
      phone: '+212 5 24 43 22 11',
      hours: '24/7 Continuous Service',
      lines: ['To Casablanca', 'To Agadir', 'To Essaouira & Ouarzazate'],
      parcelDropBay: 'North Bay 7 - Luggage & Parcel Counter'
    },
    {
      city: 'Tangier',
      name: 'Tangier Grand Taxi Station (Place de la Ligue)',
      address: 'Place de la Ligue Arabe, Tangier City Center',
      phone: '+212 5 39 94 33 22',
      hours: '06:00 AM - 12:00 AM',
      lines: ['To Rabat & Casablanca', 'To Tetouan & Chefchaouen', 'To Asilah'],
      parcelDropBay: 'Gate 2 - Intercity Express Counter'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-linear-to-r from-zinc-900 to-zinc-800 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-md">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase">
            <Building2 className="w-3.5 h-3.5" /> Intercity Taxi Stations & Terminals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Grand Taxi Hubs & Parcel Handover Points
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Official intercity taxi bays with verified parcel dropoff counters, secure luggage lockers, and on-site dispatchers.
          </p>
        </div>
      </div>

      {/* How it Works 4-Step Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-zinc-900">How Intercity Taxi Parcel Delivery Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Select Taxi Driver</h3>
            <p className="text-xs text-zinc-600">
              Pick an available taxi scheduled to depart between your origin and destination cities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Handover with OTP</h3>
            <p className="text-xs text-zinc-600">
              Meet the driver at the departure station (or doorstep). Provide your 4-digit pickup code.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Highway Express Transit</h3>
            <p className="text-xs text-zinc-600">
              Taxi cruises directly on express highway with real-time tracking, ETA updates, and in-app chat.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 font-black text-sm flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Receiver Verification</h3>
            <p className="text-xs text-zinc-600">
              Driver meets receiver at destination station and verifies secret receiver delivery code.
            </p>
          </div>
        </div>
      </div>

      {/* Main Hubs Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stationHubs.map((hub, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {hub.city}
                </span>
                <h3 className="font-bold text-base text-zinc-900 mt-1">{hub.name}</h3>
              </div>
              <Building2 className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="space-y-1 text-xs text-zinc-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>{hub.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="font-mono">{hub.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{hub.hours}</span>
              </div>
            </div>

            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80 text-xs">
              <span className="font-semibold text-zinc-900 block mb-1">Active Intercity Lines:</span>
              <ul className="list-disc list-inside text-zinc-600 space-y-0.5">
                {hub.lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-700">Designated Parcel Desk:</span>
              <strong className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {hub.parcelDropBay}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Parcel Policy Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 text-xs text-amber-950 space-y-3">
        <h3 className="font-bold text-sm flex items-center gap-2 text-amber-900">
          <ShieldCheck className="w-4 h-4" /> Intercity Parcel Safety Guidelines & Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <strong className="block text-zinc-900">1. Proper Packaging:</strong>
            <p className="text-zinc-700">Ensure boxes are securely taped and padded. Fragile stickers should be visible.</p>
          </div>
          <div>
            <strong className="block text-zinc-900">2. Prohibited Cargo:</strong>
            <p className="text-zinc-700">No flammables, hazardous chemicals, perishable raw food, or illegal contraband.</p>
          </div>
          <div>
            <strong className="block text-zinc-900">3. OTP Protection:</strong>
            <p className="text-zinc-700">Never share your 4-digit recipient OTP until you have physically inspected the package.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
