import { TaxiDriver, ParcelDelivery, CityRoute, ChatMessage } from '../types';

export const POPULAR_ROUTES: CityRoute[] = [
  {
    from: 'Casablanca',
    to: 'Rabat',
    distanceKm: 87,
    avgDurationMinutes: 65,
    stationsFrom: ['Central Grand Taxi Station (Derb Omar)', 'Casa Port Taxi Hub', 'Oulfa Intercity Terminal'],
    stationsTo: ['Rabat Ville Grand Taxi Station (Bab El Had)', 'Agdal Interchange Terminal', 'Hay Riad Hub'],
    highwayName: 'A1 Highway (Casablanca - Rabat)'
  },
  {
    from: 'Rabat',
    to: 'Tangier',
    distanceKm: 250,
    avgDurationMinutes: 150,
    stationsFrom: ['Rabat Bab El Had Hub', 'Kamra Intercity Bus & Taxi Terminal'],
    stationsTo: ['Tangier Grand Taxi Station (Place de la Ligue)', 'Tangier Med Transit Gate', 'Malabata Hub'],
    highwayName: 'A5 Atlantic Coastal Highway'
  },
  {
    from: 'Casablanca',
    to: 'Marrakech',
    distanceKm: 240,
    avgDurationMinutes: 160,
    stationsFrom: ['Oulfa Intercity Terminal', 'Derb Omar Grand Station'],
    stationsTo: ['Bab Doukkala Grand Taxi Hub', 'Sidi Mimoun Station', 'Gueliz Terminal'],
    highwayName: 'A3 South Highway'
  },
  {
    from: 'Paris',
    to: 'Lyon',
    distanceKm: 460,
    avgDurationMinutes: 270,
    stationsFrom: ['Gare de Lyon Express Shuttle Hub', 'Porte d\'Italie Intercity Terminal'],
    stationsTo: ['Lyon Part-Dieu Taxi Hub', 'Perrache Intercity Station'],
    highwayName: 'A6 Autoroute du Soleil'
  },
  {
    from: 'Nairobi',
    to: 'Mombasa',
    distanceKm: 485,
    avgDurationMinutes: 360,
    stationsFrom: ['Central Railway Intercity Shuttle Hub', 'Mfangano Street Taxi Bay'],
    stationsTo: ['Mombasa Mwembe Tayari Shuttle Terminal', 'Nyali Bridge Point'],
    highwayName: 'A109 Nairobi-Mombasa Highway'
  },
  {
    from: 'New York',
    to: 'Philadelphia',
    distanceKm: 155,
    avgDurationMinutes: 110,
    stationsFrom: ['Manhattan Port Authority Hub', 'Brooklyn Intercity Bay'],
    stationsTo: ['30th Street Station Taxi Bay', 'Center City Terminal'],
    highwayName: 'I-95 South Corridor'
  }
];

export const INITIAL_DRIVERS: TaxiDriver[] = [
  {
    id: 'drv-1',
    name: 'Karim Bennani',
    phone: '+212 6 61 98 44 21',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalTrips: 342,
    vehicleModel: 'Mercedes-Benz E-Class Grand Taxi',
    vehiclePlate: '12-A-54901',
    vehicleColor: 'Classic White',
    vehicleType: 'grand_taxi',
    originCity: 'Casablanca',
    destinationCity: 'Rabat',
    departureTime: 'Departs in 35 mins (14:30)',
    departureTimestamp: Date.now() + 35 * 60 * 1000,
    estimatedArrival: '15:35',
    originStation: 'Central Grand Taxi Station (Derb Omar)',
    destinationStation: 'Rabat Ville Grand Taxi Station (Bab El Had)',
    availableTrunkSpace: 'plenty',
    maxParcels: 6,
    currentParcelsCount: 2,
    basePricePerKg: 3.5,
    flatBaseRate: 15,
    acceptsDoorstep: true,
    status: 'boarding',
    currentProgressPct: 15,
    notes: 'Departing promptly at 14:30. Dedicated secure luggage trunk with protective blanket.'
  },
  {
    id: 'drv-2',
    name: 'Youssef El Mansouri',
    phone: '+212 6 72 30 11 88',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalTrips: 512,
    vehicleModel: 'Peugeot 508 Intercity Express',
    vehiclePlate: '44-B-89302',
    vehicleColor: 'Silver Metallic',
    vehicleType: 'standard_sedan',
    originCity: 'Casablanca',
    destinationCity: 'Rabat',
    departureTime: 'Departs in 1 hr 10 mins (15:15)',
    departureTimestamp: Date.now() + 70 * 60 * 1000,
    estimatedArrival: '16:20',
    originStation: 'Casa Port Taxi Hub',
    destinationStation: 'Agdal Interchange Terminal',
    availableTrunkSpace: 'medium',
    maxParcels: 4,
    currentParcelsCount: 1,
    basePricePerKg: 3.0,
    flatBaseRate: 14,
    acceptsDoorstep: false,
    status: 'scheduled',
    currentProgressPct: 0,
    notes: 'Experienced intercity courier. Can drop at Agdal train station or Bab El Had.'
  },
  {
    id: 'drv-3',
    name: 'Tariq Alami',
    phone: '+212 6 63 45 77 90',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalTrips: 820,
    vehicleModel: 'Toyota HiAce Grand Shuttle (9-Seater)',
    vehiclePlate: '06-C-33219',
    vehicleColor: 'Navy Blue',
    vehicleType: 'minivan',
    originCity: 'Casablanca',
    destinationCity: 'Marrakech',
    departureTime: 'Departs in 45 mins (14:45)',
    departureTimestamp: Date.now() + 45 * 60 * 1000,
    estimatedArrival: '17:25',
    originStation: 'Oulfa Intercity Terminal',
    destinationStation: 'Bab Doukkala Grand Taxi Hub',
    availableTrunkSpace: 'plenty',
    maxParcels: 10,
    currentParcelsCount: 3,
    basePricePerKg: 4.0,
    flatBaseRate: 25,
    acceptsDoorstep: true,
    status: 'boarding',
    currentProgressPct: 10,
    notes: 'High capacity minivan with huge protected rear storage. Ideal for medium/large parcels.'
  },
  {
    id: 'drv-4',
    name: 'Rachid Bouzidi',
    phone: '+212 6 68 19 82 04',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rating: 4.75,
    totalTrips: 219,
    vehicleModel: 'Dacia Lodgy Taxi 7-Place',
    vehiclePlate: '18-D-10294',
    vehicleColor: 'Sand Gold',
    vehicleType: 'grand_taxi',
    originCity: 'Rabat',
    destinationCity: 'Tangier',
    departureTime: 'Departs in 20 mins (14:15)',
    departureTimestamp: Date.now() + 20 * 60 * 1000,
    estimatedArrival: '16:45',
    originStation: 'Rabat Bab El Had Hub',
    destinationStation: 'Tangier Grand Taxi Station (Place de la Ligue)',
    availableTrunkSpace: 'limited',
    maxParcels: 3,
    currentParcelsCount: 2,
    basePricePerKg: 4.5,
    flatBaseRate: 28,
    acceptsDoorstep: false,
    status: 'boarding',
    currentProgressPct: 5,
    notes: 'Last parcel space remaining! Direct express on A5 Atlantic highway.'
  }
];

export const INITIAL_PARCELS: ParcelDelivery[] = [
  {
    id: 'pkg-1',
    trackingCode: 'ICT-489102',
    createdAt: Date.now() - 40 * 60 * 1000,
    updatedAt: Date.now() - 10 * 60 * 1000,
    originCity: 'Casablanca',
    destinationCity: 'Rabat',
    originStation: 'Central Grand Taxi Station (Derb Omar)',
    destinationStation: 'Rabat Ville Grand Taxi Station (Bab El Had)',
    isDoorstepPickup: false,
    isDoorstepDropoff: true,
    pickupAddress: 'Derb Omar Taxi Stand #3',
    dropoffAddress: 'Avenue Mohammed V, Building 42, Apt 3, Rabat',
    category: 'medium',
    title: 'Architectural Blueprints & Hardware Samples',
    description: 'Sealed plastic cylindrical tube and cardboard box with architectural drawing rolls and brass door handles.',
    weightKg: 4.2,
    isFragile: true,
    declaredValue: 250,
    senderName: 'Amine Benjelloun',
    senderPhone: '+212 6 61 22 33 44',
    senderNotes: 'I will meet the taxi driver directly at Derb Omar Taxi Bay 3.',
    receiverName: 'Laila Tazi',
    receiverPhone: '+212 6 77 88 99 00',
    receiverAddress: 'Avenue Mohammed V, Building 42, Apt 3, Rabat',
    receiverInstructions: 'Call receiver 15 minutes before reaching Bab El Had or doorstep.',
    driverId: 'drv-1',
    driver: INITIAL_DRIVERS[0],
    pickupOtp: '4821',
    deliveryOtp: '7934',
    pickupVerifiedAt: Date.now() - 25 * 60 * 1000,
    priceTotal: 29.50,
    paymentMethod: 'cash_on_delivery',
    isPaid: false,
    status: 'in_transit',
    statusHistory: [
      {
        status: 'requested',
        timestamp: Date.now() - 40 * 60 * 1000,
        description: 'Parcel delivery booked for route Casablanca -> Rabat.',
        locationName: 'Casablanca'
      },
      {
        status: 'accepted',
        timestamp: Date.now() - 35 * 60 * 1000,
        description: 'Driver Karim Bennani accepted the parcel.',
        locationName: 'Central Grand Taxi Station (Derb Omar)'
      },
      {
        status: 'picked_up',
        timestamp: Date.now() - 25 * 60 * 1000,
        description: 'Sender handed over parcel to driver. Pickup OTP 4821 verified.',
        locationName: 'Derb Omar Station Bay 3'
      },
      {
        status: 'in_transit',
        timestamp: Date.now() - 15 * 60 * 1000,
        description: 'Taxi departed on A1 Highway. Cruising at 105 km/h.',
        locationName: 'A1 Highway near Bouznika Toll Plaza'
      }
    ],
    currentLocationDescription: 'Cruising past Bouznika Toll Plaza on A1 Highway (~28 km to Rabat)',
    estimatedArrivalTimestamp: Date.now() + 25 * 60 * 1000
  },
  {
    id: 'pkg-2',
    trackingCode: 'ICT-731904',
    createdAt: Date.now() - 15 * 60 * 1000,
    updatedAt: Date.now() - 15 * 60 * 1000,
    originCity: 'Casablanca',
    destinationCity: 'Marrakech',
    originStation: 'Oulfa Intercity Terminal',
    destinationStation: 'Bab Doukkala Grand Taxi Hub',
    isDoorstepPickup: true,
    isDoorstepDropoff: false,
    pickupAddress: 'Oasis District, Residence Les Palmiers, Casablanca',
    dropoffAddress: 'Bab Doukkala Taxi Dispatch Hub, Marrakech',
    category: 'small',
    title: 'Urgent Legal Contracts & Notary Stamps',
    description: 'A4 padded waterproof document envelope with sealed legal paperwork.',
    weightKg: 0.8,
    isFragile: false,
    declaredValue: 100,
    senderName: 'Mounir Kadiri (Law Firm)',
    senderPhone: '+212 6 55 44 33 22',
    senderNotes: 'Please keep dry and safe in driver cabin or top of trunk.',
    receiverName: 'Sufian El Idrissi',
    receiverPhone: '+212 6 62 11 00 99',
    receiverInstructions: 'Receiver will be waiting at Bab Doukkala dispatch counter.',
    driverId: 'drv-3',
    driver: INITIAL_DRIVERS[2],
    pickupOtp: '6109',
    deliveryOtp: '2845',
    priceTotal: 25.00,
    paymentMethod: 'cash_on_pickup',
    isPaid: true,
    status: 'accepted',
    statusHistory: [
      {
        status: 'requested',
        timestamp: Date.now() - 15 * 60 * 1000,
        description: 'Parcel booked for trip to Marrakech.',
        locationName: 'Casablanca'
      },
      {
        status: 'accepted',
        timestamp: Date.now() - 10 * 60 * 1000,
        description: 'Driver Tariq Alami accepted the package.',
        locationName: 'Oulfa Intercity Terminal'
      }
    ],
    currentLocationDescription: 'Driver Tariq is boarding passengers at Oulfa Terminal.',
    estimatedArrivalTimestamp: Date.now() + 180 * 60 * 1000
  },
  {
    id: 'pkg-3',
    trackingCode: 'ICT-905182',
    createdAt: Date.now() - 180 * 60 * 1000,
    updatedAt: Date.now() - 30 * 60 * 1000,
    originCity: 'Rabat',
    destinationCity: 'Tangier',
    originStation: 'Rabat Bab El Had Hub',
    destinationStation: 'Tangier Grand Taxi Station (Place de la Ligue)',
    isDoorstepPickup: false,
    isDoorstepDropoff: false,
    category: 'large',
    title: 'Artisan Ceramic Vases & Olive Oil Samples',
    description: 'Reinforced bubble-wrapped carton with fragile Moroccan handmade pottery.',
    weightKg: 8.5,
    isFragile: true,
    declaredValue: 400,
    senderName: 'Nadia Chaoui',
    senderPhone: '+212 6 70 12 34 56',
    receiverName: 'Hassan Belhaj',
    receiverPhone: '+212 6 61 77 88 99',
    driverId: 'drv-4',
    driver: INITIAL_DRIVERS[3],
    pickupOtp: '1192',
    deliveryOtp: '8401',
    pickupVerifiedAt: Date.now() - 160 * 60 * 1000,
    deliveryVerifiedAt: Date.now() - 30 * 60 * 1000,
    priceTotal: 66.25,
    paymentMethod: 'prepaid_digital',
    isPaid: true,
    status: 'delivered',
    statusHistory: [
      {
        status: 'requested',
        timestamp: Date.now() - 180 * 60 * 1000,
        description: 'Delivery order placed.',
        locationName: 'Rabat'
      },
      {
        status: 'picked_up',
        timestamp: Date.now() - 160 * 60 * 1000,
        description: 'Loaded securely into taxi trunk at Rabat Bab El Had.',
        locationName: 'Rabat'
      },
      {
        status: 'in_transit',
        timestamp: Date.now() - 120 * 60 * 1000,
        description: 'In transit on A5 Coastal Highway.',
        locationName: 'Larache Highway Rest Area'
      },
      {
        status: 'arrived_at_station',
        timestamp: Date.now() - 40 * 60 * 1000,
        description: 'Arrived at Tangier Grand Taxi Hub.',
        locationName: 'Tangier'
      },
      {
        status: 'delivered',
        timestamp: Date.now() - 30 * 60 * 1000,
        description: 'Handed over to receiver Hassan Belhaj. Delivery OTP 8401 verified.',
        locationName: 'Tangier Station Counter 2'
      }
    ],
    currentLocationDescription: 'Successfully delivered at Tangier Grand Taxi Station.'
  }
];

export const INITIAL_CHAT: Record<string, ChatMessage[]> = {
  'pkg-1': [
    {
      id: 'm1',
      deliveryId: 'pkg-1',
      senderRole: 'system',
      senderName: 'Relay System',
      message: 'Driver Karim Bennani confirmed pickup booking for 14:30.',
      timestamp: Date.now() - 35 * 60 * 1000
    },
    {
      id: 'm2',
      deliveryId: 'pkg-1',
      senderRole: 'driver',
      senderName: 'Karim (Driver)',
      message: 'Salam Amine! I am parked near Stand #3 in the white Mercedes E-Class. You can bring the parcel.',
      timestamp: Date.now() - 28 * 60 * 1000
    },
    {
      id: 'm3',
      deliveryId: 'pkg-1',
      senderRole: 'sender',
      senderName: 'Amine (Sender)',
      message: 'Great, coming right now in blue jacket with the tube and box. Handover OTP is 4821.',
      timestamp: Date.now() - 26 * 60 * 1000
    },
    {
      id: 'm4',
      deliveryId: 'pkg-1',
      senderRole: 'driver',
      senderName: 'Karim (Driver)',
      message: 'Received safely and secured in trunk! Departing now for Rabat.',
      timestamp: Date.now() - 24 * 60 * 1000
    }
  ]
};
