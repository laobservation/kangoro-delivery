import { ParcelSize, DeliveryStatus, CityRoute } from '../types';
import { POPULAR_ROUTES } from '../data/mockData';

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function generateTrackingCode(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `ICT-${randomDigits}`;
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function getRouteDetails(fromCity: string, toCity: string): CityRoute {
  const found = POPULAR_ROUTES.find(
    r => (r.from.toLowerCase() === fromCity.toLowerCase() && r.to.toLowerCase() === toCity.toLowerCase()) ||
         (r.from.toLowerCase() === toCity.toLowerCase() && r.to.toLowerCase() === fromCity.toLowerCase())
  );

  if (found) {
    return found;
  }

  // fallback route estimate
  return {
    from: fromCity,
    to: toCity,
    distanceKm: 180,
    avgDurationMinutes: 120,
    stationsFrom: [`${fromCity} Central Intercity Terminal`, `${fromCity} North Station`],
    stationsTo: [`${toCity} Main Bus & Taxi Bay`, `${toCity} City Center Station`],
    highwayName: `Intercity Expressway (${fromCity} - ${toCity})`
  };
}

export function calculateDeliveryPrice(
  size: ParcelSize,
  weightKg: number,
  distanceKm: number,
  isDoorstepPickup: boolean,
  isDoorstepDropoff: boolean,
  isFragile: boolean
): { total: number; base: number; weightFee: number; doorstepFee: number; fragileFee: number } {
  let baseRate = 12;
  let multiplier = 1;

  switch (size) {
    case 'envelope':
      baseRate = 8;
      multiplier = 0.8;
      break;
    case 'small':
      baseRate = 12;
      multiplier = 1.0;
      break;
    case 'medium':
      baseRate = 18;
      multiplier = 1.4;
      break;
    case 'large':
      baseRate = 28;
      multiplier = 2.0;
      break;
    case 'fragile':
      baseRate = 22;
      multiplier = 1.6;
      break;
  }

  const distanceFactor = Math.max(1, distanceKm / 70);
  const base = Math.round(baseRate * distanceFactor);
  const weightFee = Math.round(Math.max(0, weightKg - 1) * 2.5);
  const doorstepFee = (isDoorstepPickup ? 6 : 0) + (isDoorstepDropoff ? 6 : 0);
  const fragileFee = isFragile ? 5 : 0;

  const total = Number((base + weightFee + doorstepFee + fragileFee).toFixed(2));

  return {
    total,
    base,
    weightFee,
    doorstepFee,
    fragileFee
  };
}

export function getStatusBadgeInfo(status: DeliveryStatus): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'requested':
      return {
        label: 'Awaiting Driver',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200'
      };
    case 'accepted':
      return {
        label: 'Driver Assigned',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200'
      };
    case 'picked_up':
      return {
        label: 'Loaded in Taxi',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-800',
        borderColor: 'border-indigo-200'
      };
    case 'in_transit':
      return {
        label: 'On Highway / In Transit',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200'
      };
    case 'arrived_at_station':
      return {
        label: 'Arrived at Destination Hub',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200'
      };
    case 'delivered':
      return {
        label: 'Delivered to Receiver',
        bgColor: 'bg-zinc-100',
        textColor: 'text-zinc-900',
        borderColor: 'border-zinc-300'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
  }
}
