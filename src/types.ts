export type CityName = string;

export type ParcelSize = 'envelope' | 'small' | 'medium' | 'large' | 'fragile';

export type DeliveryStatus = 
  | 'requested'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'arrived_at_station'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash_on_pickup' | 'cash_on_delivery' | 'prepaid_digital';

export interface LocationPoint {
  city: string;
  stationName: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface TaxiDriver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleType: 'standard_sedan' | 'grand_taxi' | 'minivan' | 'executive_van';
  originCity: string;
  destinationCity: string;
  departureTime: string; // ISO or human string "Today at 14:30"
  departureTimestamp: number;
  estimatedArrival: string;
  originStation: string;
  destinationStation: string;
  availableTrunkSpace: 'plenty' | 'medium' | 'limited';
  maxParcels: number;
  currentParcelsCount: number;
  basePricePerKg: number;
  flatBaseRate: number;
  acceptsDoorstep: boolean;
  status: 'scheduled' | 'boarding' | 'in_transit' | 'arrived' | 'completed';
  currentProgressPct: number; // 0 to 100
  notes?: string;
}

export interface ParcelDelivery {
  id: string;
  trackingCode: string; // e.g. "ICT-782910"
  createdAt: number;
  updatedAt: number;
  
  // Route
  originCity: string;
  destinationCity: string;
  originStation: string;
  destinationStation: string;
  isDoorstepPickup: boolean;
  isDoorstepDropoff: boolean;
  pickupAddress?: string;
  dropoffAddress?: string;
  
  // Parcel Details
  category: ParcelSize;
  title: string;
  description: string;
  weightKg: number;
  isFragile: boolean;
  declaredValue?: number;
  parcelPhotoUrl?: string;

  // People
  senderName: string;
  senderPhone: string;
  senderNotes?: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress?: string;
  receiverInstructions?: string;

  // Driver Assignment
  driverId?: string;
  driver?: TaxiDriver;
  
  // Security & Verification
  pickupOtp: string; // 4 digits sender gives driver
  deliveryOtp: string; // 4 digits receiver gives driver
  pickupVerifiedAt?: number;
  deliveryVerifiedAt?: number;
  proofOfDeliveryPhoto?: string;
  receiverSignature?: string;

  // Financials
  priceTotal: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  
  // Status & Progress
  status: DeliveryStatus;
  statusHistory: {
    status: DeliveryStatus;
    timestamp: number;
    description: string;
    locationName?: string;
  }[];

  currentLocationDescription?: string;
  estimatedArrivalTimestamp?: number;
}

export interface ChatMessage {
  id: string;
  deliveryId: string;
  senderRole: 'sender' | 'driver' | 'receiver' | 'system';
  senderName: string;
  message: string;
  timestamp: number;
}

export interface CityRoute {
  from: string;
  to: string;
  distanceKm: number;
  avgDurationMinutes: number;
  stationsFrom: string[];
  stationsTo: string[];
  highwayName: string;
}

export interface SenderUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  city?: string;
  accountType?: 'individual' | 'business' | 'e_commerce';
  joinedDate?: string;
}
