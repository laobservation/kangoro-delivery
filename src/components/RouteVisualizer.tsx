import React from 'react';
import { Truck, MapPin, Clock, Navigation, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ParcelDelivery } from '../types';

interface RouteVisualizerProps {
  delivery: ParcelDelivery;
}

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ delivery }) => {
  const isDelivered = delivery.status === 'delivered';
  const isInTransit = delivery.status === 'in_transit';
  const isPickedUp = delivery.status === 'picked_up';
  const isArrived = delivery.status === 'arrived_at_station';

  // Calculate animated position percentage
  let progressPct = 0;
  if (isDelivered) progressPct = 100;
  else if (isArrived) progressPct = 90;
  else if (isInTransit) progressPct = delivery.driver?.currentProgressPct || 55;
  else if (isPickedUp) progressPct = 20;
  else progressPct = 5;

  const checkpoints = [
    { label: delivery.originStation || `${delivery.originCity} Hub`, pct: 0, passed: progressPct >= 10 },
    { label: 'Highway Toll & Inspection', pct: 33, passed: progressPct >= 33 },
    { label: 'Mid-route Rest Stop', pct: 66, passed: progressPct >= 66 },
    { label: delivery.destinationStation || `${delivery.destinationCity} Terminal`, pct: 100, passed: progressPct >= 95 },
  ];

  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-zinc-800">
      {/* Background Subtle Highway Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <div>
            <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <span>{delivery.originCity}</span>
              <span className="text-zinc-500">➔</span>
              <span>{delivery.destinationCity}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Intercity Express Taxi Line • {delivery.driver?.vehicleModel || 'Intercity Grand Taxi'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isInTransit && (
            <div className="bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 animate-bounce" />
              <span>Live Speed: 102 km/h</span>
            </div>
          )}
          <div className="bg-zinc-800/80 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isDelivered 
                ? 'Delivered' 
                : isArrived 
                ? 'At Station' 
                : delivery.driver?.estimatedArrival ? `ETA: ${delivery.driver.estimatedArrival}` : 'ETA ~45 mins'}
            </span>
          </div>
        </div>
      </div>

      {/* Corridor Visual Progress Track */}
      <div className="relative py-6 sm:py-8 my-2 z-10">
        {/* Asphalt Road Track */}
        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden relative shadow-inner border border-zinc-700/60">
          {/* Dashed Center Road Line */}
          <div className="absolute inset-0 flex items-center justify-around opacity-40">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-0.5 w-3 bg-amber-400 rounded-xs" />
            ))}
          </div>

          {/* Active completed path */}
          <div
            className="h-full bg-linear-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Checkpoint Nodes along route */}
        <div className="relative -mt-2">
          {checkpoints.map((cp, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${cp.pct}%` }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  cp.passed
                    ? 'bg-amber-400 border-amber-300 shadow-md shadow-amber-400/40'
                    : 'bg-zinc-800 border-zinc-600'
                }`}
              >
                {cp.passed && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
              </div>
              <span className="mt-2 text-[10px] sm:text-xs text-zinc-400 font-medium text-center max-w-[90px] line-clamp-1">
                {cp.label}
              </span>
            </div>
          ))}

          {/* Animated Moving Taxi Marker */}
          <div
            className="absolute -top-7 -translate-x-1/2 transition-all duration-700 ease-out flex flex-col items-center group cursor-pointer"
            style={{ left: `${progressPct}%` }}
          >
            <div className="bg-amber-400 text-zinc-950 font-black p-2 rounded-xl shadow-lg shadow-amber-500/40 border-2 border-white flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span className="text-[10px] tracking-tight uppercase font-bold">
                {delivery.driver?.vehiclePlate || 'TAXI'}
              </span>
            </div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-amber-400" />
          </div>
        </div>
      </div>

      {/* Bottom Live Update Message */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-zinc-300">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">Current Location:</span>
          <span className="text-zinc-400">
            {delivery.currentLocationDescription || `${delivery.originCity} Intercity Station Bay`}
          </span>
        </div>
        {delivery.isFragile && (
          <span className="inline-flex items-center gap-1 text-amber-400/90 font-medium self-start sm:self-auto">
            <ShieldAlert className="w-3.5 h-3.5" /> Fragile Handling Active
          </span>
        )}
      </div>
    </div>
  );
};
