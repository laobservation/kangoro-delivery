export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  // Brand & Nav
  brandName: string;
  brandTagline: string;
  navHomeSend: string;
  navLiveTracking: string;
  navMyOrders: string;
  navSenderAccount: string;
  navDriverTerminal: string;
  navTaxiHubs: string;
  navConnectSender: string;
  navConnectedAs: string;
  navLogout: string;
  navRegisterDriver: string;

  // Hero & Sending
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroSendNowBtn: string;
  heroCreateAccountBtn: string;
  quickCorridors: string;
  originCityLabel: string;
  destinationCityLabel: string;
  dispatchOnRouteBtn: string;
  expressCorridor: string;
  distance: string;
  avgTransitTime: string;
  fromRate: string;

  // Driver Search & List
  taxisOnRoute: string;
  departingSoon: string;
  driverSearchPlaceholder: string;
  allTaxisFilter: string;
  spaciousTrunkFilter: string;
  doorstepFilter: string;
  noDriversFound: string;
  noDriversSub: string;
  viewCasablancaRabat: string;
  verifiedTrips: string;
  taxiPlate: string;
  departure: string;
  estArrival: string;
  pickupStation: string;
  dropoffStation: string;
  trunk: string;
  slotsLeft: string;
  doorstepAvailable: string;
  baseRate: string;
  perDocsSmall: string;
  sendParcelWithTaxi: string;

  // Parcel Wizard / Modal
  modalTitle: string;
  modalSub: string;
  step1Category: string;
  step2Details: string;
  step3Contacts: string;
  step4Doorstep: string;
  step5Payment: string;
  parcelLabelTitle: string;
  parcelLabelPlaceholder: string;
  weightKg: string;
  contentsDescTitle: string;
  contentsDescPlaceholder: string;
  fragileItem: string;
  fragileDesc: string;
  declaredValue: string;
  senderTitle: string;
  senderFullName: string;
  senderPhone: string;
  meetingNotes: string;
  recipientTitle: string;
  recipientFullName: string;
  recipientPhone: string;
  dropoffAddressPoint: string;
  doorstepPickupOption: string;
  doorstepPickupDesc: string;
  doorstepDropoffOption: string;
  doorstepDropoffDesc: string;
  cashOnPickup: string;
  cashOnPickupDesc: string;
  cashOnDelivery: string;
  cashOnDeliveryDesc: string;
  digitalPrepaid: string;
  digitalPrepaidDesc: string;
  totalDeliveryFee: string;
  cancelBtn: string;
  confirmDualOtpBtn: string;

  // Driver Registration
  driverRegTitle: string;
  driverRegSubtitle: string;
  driverFullName: string;
  driverPhone: string;
  driverCity: string;
  driverLicensePlate: string;
  driverTaxiPermit: string;
  driverVehicleModel: string;
  driverVehicleColor: string;
  driverVehicleType: string;
  driverOriginRoute: string;
  driverDestinationRoute: string;
  driverOriginHub: string;
  driverDestinationHub: string;
  driverMaxParcels: string;
  driverFlatBaseRate: string;
  driverKgRate: string;
  driverDoorstepToggle: string;
  driverDoorstepToggleSub: string;
  driverPhotoUrl: string;
  driverSubmitBtn: string;
  driverRegSuccessTitle: string;
  driverRegSuccessSub: string;
  driverRegSuccessOpenTerminal: string;

  // Tracking & Statuses
  trackingTitle: string;
  trackingSub: string;
  searchTrackingPlaceholder: string;
  activeShipments: string;
  trackingCodeLabel: string;
  pickupOtpKey: string;
  deliveryOtpKey: string;
  driverAssigned: string;
  statusRequested: string;
  statusAccepted: string;
  statusPickedUp: string;
  statusInTransit: string;
  statusArrivedAtStation: string;
  statusDelivered: string;
  statusCancelled: string;
  chatWithDriver: string;
  callDriver: string;
  advanceSimulationBtn: string;

  // Driver Terminal
  driverTerminalTitle: string;
  driverDispatcherMode: string;
  driverTodayEarnings: string;
  driverActiveRoute: string;
  driverTrunkLoad: string;
  driverTripLifecycle: string;
  driverStage1Boarding: string;
  driverStage2Highway: string;
  driverStage3Arrived: string;
  driverStage4Completed: string;
  driverVerifyHandoverBtn: string;
  driverPublishTripBtn: string;
  driverSwitchProfile: string;
  driverLogoutBtn: string;

  // Common
  madCurrency: string;
  status: string;
  viewWaybill: string;
  copyOtp: string;
  copied: string;
  otpHandoverNotice: string;
  changeLanguage: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'KANGORO DELIVERY',
    brandTagline: 'Morocco Intercity Grand Taxi Express',
    navHomeSend: 'Home / Send',
    navLiveTracking: 'Live Tracking',
    navMyOrders: 'My Orders',
    navSenderAccount: 'Sender Account',
    navDriverTerminal: 'Driver Terminal',
    navTaxiHubs: 'Taxi Hubs',
    navConnectSender: 'Create Account / Connect',
    navConnectedAs: 'Connected as',
    navLogout: 'Logout',
    navRegisterDriver: 'Register as Taxi Driver',

    heroBadge: "Morocco's Intercity Grand Taxi Express Delivery",
    heroTitle1: 'Send Parcels City-to-City',
    heroTitleHighlight: 'In 2 to 4 Hours',
    heroSubtitle: 'Hand off your package to verified Grand Taxi drivers traveling on Moroccan highway corridors. Get real-time dual-OTP handover security and same-day delivery.',
    heroSendNowBtn: 'Send a Parcel Now',
    heroCreateAccountBtn: 'Create Account / Connect',
    quickCorridors: 'Quick Corridors:',
    originCityLabel: 'Origin City (Sending From)',
    destinationCityLabel: 'Destination City (Delivering To)',
    dispatchOnRouteBtn: 'Dispatch on this Route',
    expressCorridor: 'Express Corridor:',
    distance: 'Distance:',
    avgTransitTime: 'Avg Transit Time:',
    fromRate: 'From',

    taxisOnRoute: 'Grand Taxis on',
    departingSoon: 'Departing Soon',
    driverSearchPlaceholder: 'Search driver, plate, station...',
    allTaxisFilter: 'All Taxis',
    spaciousTrunkFilter: 'Spacious Trunk',
    doorstepFilter: 'Doorstep',
    noDriversFound: 'No matching taxis for this corridor right now',
    noDriversSub: 'Try clearing your search query or switch corridors to Casablanca ➔ Rabat or Marrakech ➔ Casablanca.',
    viewCasablancaRabat: 'View Casablanca ➔ Rabat Taxis',
    verifiedTrips: 'verified intercity trips',
    taxiPlate: 'TAXI PLATE',
    departure: 'Departure:',
    estArrival: 'Est. Arrival:',
    pickupStation: 'Pickup:',
    dropoffStation: 'Dropoff:',
    trunk: 'Trunk:',
    slotsLeft: 'slots left',
    doorstepAvailable: 'Doorstep Available',
    baseRate: 'Base Taxi Rate',
    perDocsSmall: '/ docs & small box',
    sendParcelWithTaxi: 'Send Parcel with Taxi',

    modalTitle: 'Dispatch Parcel with',
    modalSub: 'Departure',
    step1Category: '1. Select Parcel Category',
    step2Details: '2. Parcel Details & Weight',
    step3Contacts: '3. Sender & Recipient Contact Information',
    step4Doorstep: '4. Doorstep Collection & Delivery',
    step5Payment: '5. Payment Preference',
    parcelLabelTitle: 'Parcel Label / Title *',
    parcelLabelPlaceholder: 'e.g. Legal Documents, Auto Filter, Samples',
    weightKg: 'Weight in Kg',
    contentsDescTitle: 'Contents Description / Packaging Notes',
    contentsDescPlaceholder: 'Provide details for the taxi driver (e.g. sealed envelope, taped cardboard box)',
    fragileItem: 'Fragile Item (+20 DH)',
    fragileDesc: 'Secured in cushioned front compartment',
    declaredValue: 'Declared Value (DH)',
    senderTitle: 'Sender (You)',
    senderFullName: 'Your Full Name',
    senderPhone: 'Your Phone (+212...)',
    meetingNotes: 'Meeting notes (e.g. Station Bay 3)',
    recipientTitle: 'Recipient (Receiver) *',
    recipientFullName: 'Recipient Full Name *',
    recipientPhone: 'Recipient Phone (+212...) *',
    dropoffAddressPoint: 'Destination meeting point or address',
    doorstepPickupOption: 'Origin Doorstep Pickup (+25 DH)',
    doorstepPickupDesc: 'Driver picks up parcel at your doorstep',
    doorstepDropoffOption: 'Destination Doorstep Dropoff (+25 DH)',
    doorstepDropoffDesc: 'Driver delivers directly to recipient address',
    cashOnPickup: 'Cash on Pickup',
    cashOnPickupDesc: 'Pay taxi driver at station',
    cashOnDelivery: 'Cash on Delivery (COD)',
    cashOnDeliveryDesc: 'Receiver pays upon arrival',
    digitalPrepaid: 'Digital Card / Escrow',
    digitalPrepaidDesc: 'Released via recipient OTP',
    totalDeliveryFee: 'Total Delivery Fee',
    cancelBtn: 'Cancel',
    confirmDualOtpBtn: 'Confirm & Generate Dual-OTP',

    driverRegTitle: 'Register as a Grand Taxi Driver',
    driverRegSubtitle: 'Join Morocco’s premier intercity taxi express parcel network. Monetize your trunk space on every trip.',
    driverFullName: 'Driver Full Name *',
    driverPhone: 'Phone Number (+212...) *',
    driverCity: 'Base City *',
    driverLicensePlate: 'Grand Taxi Plate Number * (e.g. 01-A-12345)',
    driverTaxiPermit: 'Taxi Permit / Agrément # (e.g. AGR-8492)',
    driverVehicleModel: 'Vehicle Model (e.g. Mercedes 240D / Dacia Lodgy) *',
    driverVehicleColor: 'Vehicle Color *',
    driverVehicleType: 'Vehicle Category *',
    driverOriginRoute: 'Origin City *',
    driverDestinationRoute: 'Destination City *',
    driverOriginHub: 'Departure Taxi Station / Hub *',
    driverDestinationHub: 'Arrival Taxi Station / Hub *',
    driverMaxParcels: 'Max Trunk Parcels Capacity *',
    driverFlatBaseRate: 'Base Rate per Parcel (DH) *',
    driverKgRate: 'Rate per extra Kg (DH) *',
    driverDoorstepToggle: 'Accept Doorstep Pickup & Delivery',
    driverDoorstepToggleSub: 'Charge extra +25 DH for city-center door pickups',
    driverPhotoUrl: 'Profile Photo / Avatar URL',
    driverSubmitBtn: 'Complete Driver Registration',
    driverRegSuccessTitle: 'Driver Profile Registered Successfully!',
    driverRegSuccessSub: 'You are now ready to accept intercity parcel deliveries and manage trips from your driver terminal.',
    driverRegSuccessOpenTerminal: 'Go to Driver Terminal',

    trackingTitle: 'Real-Time Intercity Expressway Tracking',
    trackingSub: 'Live GPS corridor tracking, driver position, and dual-OTP security verification.',
    searchTrackingPlaceholder: 'Enter tracking code (e.g. ICT-8921)...',
    activeShipments: 'Active Shipments',
    trackingCodeLabel: 'Tracking Code',
    pickupOtpKey: 'Pickup OTP Key',
    deliveryOtpKey: 'Delivery OTP Key',
    driverAssigned: 'Assigned Driver',
    statusRequested: 'Dispatch Requested',
    statusAccepted: 'Accepted & Trunk Reserved',
    statusPickedUp: 'Loaded in Taxi',
    statusInTransit: 'In Transit on Highway',
    statusArrivedAtStation: 'Arrived at Destination Hub',
    statusDelivered: 'Delivered & Handed Over',
    statusCancelled: 'Cancelled',
    chatWithDriver: 'Direct Message',
    callDriver: 'Call Driver',
    advanceSimulationBtn: 'Simulate Next Step',

    driverTerminalTitle: 'Grand Taxi Driver Dispatch Terminal',
    driverDispatcherMode: 'Taxi Dispatcher Mode',
    driverTodayEarnings: "Today's Parcel Earnings",
    driverActiveRoute: 'Active Route Corridor',
    driverTrunkLoad: 'Trunk Capacity',
    driverTripLifecycle: 'Trip Lifecycle',
    driverStage1Boarding: '1. Boarding at Station',
    driverStage2Highway: '2. On Highway (In Transit)',
    driverStage3Arrived: '3. Arrived at Destination',
    driverStage4Completed: '4. Handover Completed',
    driverVerifyHandoverBtn: 'Verify Handover OTP',
    driverPublishTripBtn: 'Publish New Trip',
    driverSwitchProfile: 'Switch Driver Profile',
    driverLogoutBtn: 'Driver Logout',

    madCurrency: 'DH',
    status: 'Status',
    viewWaybill: 'View Waybill',
    copyOtp: 'Copy OTP',
    copied: 'Copied!',
    otpHandoverNotice: 'Never share Delivery OTP until you inspect the parcel.',
    changeLanguage: 'Language'
  },
  fr: {
    brandName: 'KANGORO DELIVERY',
    brandTagline: 'Réseau Express Grand Taxi Intervilles Maroc',
    navHomeSend: 'Accueil / Envoyer',
    navLiveTracking: 'Suivi en Direct',
    navMyOrders: 'Mes Commandes',
    navSenderAccount: 'Compte Expéditeur',
    navDriverTerminal: 'Terminal Chauffeur',
    navTaxiHubs: 'Stations Taxis',
    navConnectSender: 'Créer un Compte / Se Connecter',
    navConnectedAs: 'Connecté en tant que',
    navLogout: 'Se Déconnecter',
    navRegisterDriver: 'Devenir Chauffeur Taxi',

    heroBadge: 'Livraison Express par Grands Taxis Intervilles au Maroc',
    heroTitle1: 'Envoyez vos Colis de Ville en Ville',
    heroTitleHighlight: 'En 2 à 4 Heures',
    heroSubtitle: 'Confiez vos colis aux chauffeurs de Grands Taxis agréés circulant sur les autoroutes du Maroc. Sécurité par double code OTP et livraison le jour même.',
    heroSendNowBtn: 'Envoyer un Colis Maintenant',
    heroCreateAccountBtn: 'Créer un Compte / Se Connecter',
    quickCorridors: 'Lignes Fréquentes :',
    originCityLabel: 'Ville de Départ (Expédition)',
    destinationCityLabel: 'Ville de Destination (Arrivée)',
    dispatchOnRouteBtn: 'Expédier sur cette Ligne',
    expressCorridor: 'Axe Autoroutier :',
    distance: 'Distance :',
    avgTransitTime: 'Temps Moyen :',
    fromRate: 'À partir de',

    taxisOnRoute: 'Grands Taxis sur la ligne',
    departingSoon: 'Départ Imminent',
    driverSearchPlaceholder: 'Rechercher chauffeur, matricule, station...',
    allTaxisFilter: 'Tous les Taxis',
    spaciousTrunkFilter: 'Grand Coffre',
    doorstepFilter: 'À Domicile',
    noDriversFound: 'Aucun taxi disponible sur ce trajet pour le moment',
    noDriversSub: 'Modifiez vos critères ou essayez les lignes Casablanca ➔ Rabat ou Marrakech ➔ Casablanca.',
    viewCasablancaRabat: 'Voir les Taxis Casablanca ➔ Rabat',
    verifiedTrips: 'voyages intervilles vérifiés',
    taxiPlate: 'MATRICULE TAXI',
    departure: 'Départ :',
    estArrival: 'Arrivée Estimée :',
    pickupStation: 'Station Départ :',
    dropoffStation: 'Station Arrivée :',
    trunk: 'Coffre :',
    slotsLeft: 'places colis restantes',
    doorstepAvailable: 'Option Porte-à-Porte Disponible',
    baseRate: 'Tarif de Base Taxi',
    perDocsSmall: '/ enveloppes & petits colis',
    sendParcelWithTaxi: 'Envoyer par ce Taxi',

    modalTitle: 'Expédition de Colis avec',
    modalSub: 'Départ',
    step1Category: '1. Choisir le Format du Colis',
    step2Details: '2. Détails & Poids du Colis',
    step3Contacts: '3. Coordonnées Expéditeur & Destinataire',
    step4Doorstep: '4. Options de Ramassage & Livraison',
    step5Payment: '5. Mode de Paiement',
    parcelLabelTitle: 'Désignation du Colis *',
    parcelLabelPlaceholder: 'Ex: Documents juridiques, pièces auto, échantillons',
    weightKg: 'Poids en Kg',
    contentsDescTitle: 'Description du Contenu & Emballage',
    contentsDescPlaceholder: 'Précisions pour le chauffeur (ex: enveloppe scellée, carton renforcé)',
    fragileItem: 'Objet Fragile (+20 DH)',
    fragileDesc: 'Placé en sécurité dans le compartiment avant',
    declaredValue: 'Valeur Déclarée (DH)',
    senderTitle: 'Expéditeur (Vous)',
    senderFullName: 'Votre Nom Complet',
    senderPhone: 'Votre Téléphone (+212...)',
    meetingNotes: 'Indications RDV (ex: Quai 3 de la station)',
    recipientTitle: 'Destinataire (Récepteur) *',
    recipientFullName: 'Nom Complet du Destinataire *',
    recipientPhone: 'Téléphone du Destinataire (+212...) *',
    dropoffAddressPoint: 'Adresse ou point de remise à destination',
    doorstepPickupOption: 'Ramassage à Domicile (+25 DH)',
    doorstepPickupDesc: 'Le chauffeur récupère le colis à votre porte',
    doorstepDropoffOption: 'Livraison à Domicile (+25 DH)',
    doorstepDropoffDesc: 'Le chauffeur livre directement à l’adresse du destinataire',
    cashOnPickup: 'Espèces au Départ',
    cashOnPickupDesc: 'Paiement au chauffeur à la station de départ',
    cashOnDelivery: 'Paiement à la Livraison (COD)',
    cashOnDeliveryDesc: 'Le récepteur paie à la remise du colis',
    digitalPrepaid: 'Carte Bancaire / Séquestre',
    digitalPrepaidDesc: 'Fonds débloqués dès validation du code OTP',
    totalDeliveryFee: 'Frais de Livraison Totaux',
    cancelBtn: 'Annuler',
    confirmDualOtpBtn: 'Confirmer & Générer les Codes OTP',

    driverRegTitle: 'Inscription Chauffeur de Grand Taxi',
    driverRegSubtitle: 'Rejoignez le premier réseau de transport de colis par Grand Taxi au Maroc. Rentabilisez votre coffre à chaque trajet.',
    driverFullName: 'Nom Complet du Chauffeur *',
    driverPhone: 'Numéro de Téléphone (+212...) *',
    driverCity: 'Ville de Base *',
    driverLicensePlate: 'Immatriculation du Grand Taxi * (ex: 01-A-12345)',
    driverTaxiPermit: 'N° Permis de Confiance / Agrément (ex: AGR-8492)',
    driverVehicleModel: 'Modèle du Véhicule (ex: Mercedes 240D / Dacia Lodgy) *',
    driverVehicleColor: 'Couleur du Véhicule *',
    driverVehicleType: 'Catégorie de Véhicule *',
    driverOriginRoute: 'Ville de Départ *',
    driverDestinationRoute: 'Ville de Destination *',
    driverOriginHub: 'Station de Taxi de Départ *',
    driverDestinationHub: 'Station de Taxi d’Arrivée *',
    driverMaxParcels: 'Capacité Max de Colis dans le Coffre *',
    driverFlatBaseRate: 'Tarif Forfaitaire par Colis (DH) *',
    driverKgRate: 'Supplément par Kg supplémentaire (DH) *',
    driverDoorstepToggle: 'Accepter le Service Porte-à-Porte',
    driverDoorstepToggleSub: 'Facturez +25 DH de plus pour les remises en centre-ville',
    driverPhotoUrl: 'Photo de Profil / Avatar (URL)',
    driverSubmitBtn: 'Valider mon Inscription Chauffeur',
    driverRegSuccessTitle: 'Compte Chauffeur Enregistré avec Succès !',
    driverRegSuccessSub: 'Vous êtes maintenant visible auprès des expéditeurs et pouvez gérer vos livraisons depuis le terminal.',
    driverRegSuccessOpenTerminal: 'Accéder au Terminal Chauffeur',

    trackingTitle: 'Suivi GPS Autoroutier en Temps Réel',
    trackingSub: 'Position GPS en direct, progression sur l’axe autoroutier et validation par double code OTP.',
    searchTrackingPlaceholder: 'Code de suivi (ex: ICT-8921)...',
    activeShipments: 'Envois en Cours',
    trackingCodeLabel: 'Code de Suivi',
    pickupOtpKey: 'Code OTP Départ',
    deliveryOtpKey: 'Code OTP Livraison',
    driverAssigned: 'Chauffeur Assigné',
    statusRequested: 'Expédition Demandée',
    statusAccepted: 'Accepté & Coffre Réservé',
    statusPickedUp: 'Colis Chargé dans le Taxi',
    statusInTransit: 'En Route sur l’Autoroute',
    statusArrivedAtStation: 'Arrivé à la Station Destination',
    statusDelivered: 'Colis Livré & Clôturé',
    statusCancelled: 'Annulé',
    chatWithDriver: 'Messagerie Directe',
    callDriver: 'Appeler le Chauffeur',
    advanceSimulationBtn: 'Simuler l’Étape Suivante',

    driverTerminalTitle: 'Terminal de Dispatch Chauffeur Grand Taxi',
    driverDispatcherMode: 'Mode Chauffeur Dispatcher',
    driverTodayEarnings: 'Gains Colis du Jour',
    driverActiveRoute: 'Ligne Active',
    driverTrunkLoad: 'Remplissage Coffre',
    driverTripLifecycle: 'Cycle du Voyage',
    driverStage1Boarding: '1. Embarquement à la Station',
    driverStage2Highway: '2. Sur l’Autoroute (En Transit)',
    driverStage3Arrived: '3. Arrivé à la Station',
    driverStage4Completed: '4. Livraison Clôturée',
    driverVerifyHandoverBtn: 'Valider le Code OTP',
    driverPublishTripBtn: 'Publier un Nouveau Voyage',
    driverSwitchProfile: 'Changer de Chauffeur',
    driverLogoutBtn: 'Déconnexion Chauffeur',

    madCurrency: 'DH',
    status: 'Statut',
    viewWaybill: 'Bordereau',
    copyOtp: 'Copier OTP',
    copied: 'Copié !',
    otpHandoverNotice: 'Ne communiquez le code OTP de livraison qu’après vérification du colis.',
    changeLanguage: 'Langue'
  },
  ar: {
    brandName: 'كانغورو دليفري',
    brandTagline: 'الشبكة المغربية السريعة لنقل الطرود عبر الطاكسي الكبير',
    navHomeSend: 'الرئيسية / إرسال طرد',
    navLiveTracking: 'التتبع المباشر',
    navMyOrders: 'طلباتي',
    navSenderAccount: 'حساب المرسل',
    navDriverTerminal: 'لوحة تحكم السائق',
    navTaxiHubs: 'محطات الطاكسيات',
    navConnectSender: 'إنشاء حساب / دخول',
    navConnectedAs: 'متصل بحساب',
    navLogout: 'تسجيل الخروج',
    navRegisterDriver: 'سجل كسائق طاكسي',

    heroBadge: 'إرسال سريع ومضمون للطرود عبر الطاكسي الكبير بين المدن المغربية',
    heroTitle1: 'أرسل طرودك بين المدن المغربية',
    heroTitleHighlight: 'خلال ساعتين إلى 4 ساعات',
    heroSubtitle: 'سلّم طردك لسائقي الطاكسيات الكبيرة المعتمدين على الطرق السيارة. أمان تام برمزين للتحقق السري (OTP) وتسليم في نفس اليوم.',
    heroSendNowBtn: 'أرسل طردك الآن',
    heroCreateAccountBtn: 'إنشاء حساب / تسجيل الدخول',
    quickCorridors: 'الخطوط الأكثر طلباً:',
    originCityLabel: 'مدينة الانطلاق (الإرسال)',
    destinationCityLabel: 'مدينة الوصول (التسليم)',
    dispatchOnRouteBtn: 'إرسال طرد على هذا الخط',
    expressCorridor: 'الطريق السيار:',
    distance: 'المسافة:',
    avgTransitTime: 'متوسط المدة:',
    fromRate: 'ابتداءً من',

    taxisOnRoute: 'طاكسيات متوفرة على خط',
    departingSoon: 'تنطلق قريباً',
    driverSearchPlaceholder: 'ابحث عن سائق، رقم اللوحة، المحطة...',
    allTaxisFilter: 'جميع الطاكسيات',
    spaciousTrunkFilter: 'صندوق واسع',
    doorstepFilter: 'التسليم للباب',
    noDriversFound: 'لا توجد سيارات طاكسي مسجلة على هذا الخط حالياً',
    noDriversSub: 'جرّب تعديل البحث أو تفقد خط الدار البيضاء ➔ الرباط أو مراكش ➔ الدار البيضاء.',
    viewCasablancaRabat: 'عرض طاكسيات كازا ➔ الرباط',
    verifiedTrips: 'رحلة بين المدن موثقة',
    taxiPlate: 'رقم لوحة الطاكسي',
    departure: 'الانطلاق:',
    estArrival: 'الوصول المتوقع:',
    pickupStation: 'محطة الانطلاق:',
    dropoffStation: 'محطة الوصول:',
    trunk: 'الصندوق الخلفي:',
    slotsLeft: 'أماكن متبقية للطرود',
    doorstepAvailable: 'خدمة التوصيل للباب متوفرة',
    baseRate: 'سعر الطاكسي المرجعي',
    perDocsSmall: '/ للوثائق والعلب الصغيرة',
    sendParcelWithTaxi: 'إرسال الطرد مع هذا الطاكسي',

    modalTitle: 'إرسال الطرد مع السائق',
    modalSub: 'الانطلاق',
    step1Category: '1. اختر حجم الطرد',
    step2Details: '2. تفاصيل ووزن الطرد',
    step3Contacts: '3. معلومات المرسل والمستلم',
    step4Doorstep: '4. خيارات الاستلام والتسليم عند الباب',
    step5Payment: '5. طريقة الأداء',
    parcelLabelTitle: 'اسم / نوع الطرد *',
    parcelLabelPlaceholder: 'مثال: وثائق قانونية، قطع غيار سيارات، عينات تجارية',
    weightKg: 'الوزن بالكيلوغرام',
    contentsDescTitle: 'وصف المحتوى وملاحظات التغليف',
    contentsDescPlaceholder: 'تفاصيل موجهة لسائق الطاكسي (مثال: ظرف مغلق، كرتون محكم)',
    fragileItem: 'طرد قابل للكسر (+20 د.م)',
    fragileDesc: 'يتم وضعه في مقصورة أمامية آمنة ومحمية',
    declaredValue: 'القيمة المصرح بها (بالدرهم)',
    senderTitle: 'المرسل (أنت)',
    senderFullName: 'اسمك الكامل',
    senderPhone: 'رقم هاتفك (+212...)',
    meetingNotes: 'مكان اللقاء في المحطة (مثال: الرصيف 3)',
    recipientTitle: 'المستلم (المستقبل) *',
    recipientFullName: 'الاسم الكامل للمستلم *',
    recipientPhone: 'رقم هاتف المستلم (+212...) *',
    dropoffAddressPoint: 'عنوان أو نقطة الاستلام عند الوصول',
    doorstepPickupOption: 'استلام الطرد من باب منزلك (+25 د.م)',
    doorstepPickupDesc: 'يأتي السائق لاستلام الطرد من عنوانك',
    doorstepDropoffOption: 'تسليم الطرد لباب المستلم (+25 د.م)',
    doorstepDropoffDesc: 'يوصل السائق الطرد مباشرة لعنوان المستلم',
    cashOnPickup: 'نقداً عند التسليم للسائق',
    cashOnPickupDesc: 'الدفع المباشر للسائق في محطة الانطلاق',
    cashOnDelivery: 'الدفع عند الاستلام (COD)',
    cashOnDeliveryDesc: 'يؤدي المستلم المبلغ عند استلام الطرد',
    digitalPrepaid: 'بطاقة بنكية / أمان رقمي',
    digitalPrepaidDesc: 'لا يتم تحرير المبلغ إلا بعد إدخال رمز التحقق',
    totalDeliveryFee: 'المبلغ الإجمالي للتوصيل',
    cancelBtn: 'إلغاء',
    confirmDualOtpBtn: 'تأكيد وتوليد رمزي التحقق OTP',

    driverRegTitle: 'تسجيل سائق طاكسي كبير',
    driverRegSubtitle: 'انضم لشبكة توصيل الطرود عبر الطاكسي الكبير في المغرب. استفد من صندوق سيارتك في كل رحلة.',
    driverFullName: 'الاسم الكامل للسائق *',
    driverPhone: 'رقم الهاتف (+212...) *',
    driverCity: 'المدينة الرئيسية *',
    driverLicensePlate: 'رقم لوحة الطاكسي * (مثال: 01-أ-12345)',
    driverTaxiPermit: 'رقم رخصة الثقة / المأذونية (مثال: AGR-8492)',
    driverVehicleModel: 'نوع وموديل السيارة (مثال: مرسيدس 240D / داسيا لودجي) *',
    driverVehicleColor: 'لون السيارة *',
    driverVehicleType: 'صنف السيارة *',
    driverOriginRoute: 'مدينة الانطلاق المعتادة *',
    driverDestinationRoute: 'مدينة الوصول المعتادة *',
    driverOriginHub: 'محطة الطاكسيات للانطلاق *',
    driverDestinationHub: 'محطة الطاكسيات للوصول *',
    driverMaxParcels: 'الحد الأقصى للطرود في الصندوق *',
    driverFlatBaseRate: 'السعر الأساسي لكل طرد (درهم) *',
    driverKgRate: 'السعر لكل كلغ إضافي (درهم) *',
    driverDoorstepToggle: 'قبول خدمة التوصيل إلى الباب',
    driverDoorstepToggleSub: 'إضافة 25 درهماً للطلبات التي تتطلب الذهاب لوسط المدينة',
    driverPhotoUrl: 'رابط الصورة الشخصية',
    driverSubmitBtn: 'تأكيد تسجيل السائق',
    driverRegSuccessTitle: 'تم تسجيل حساب السائق بنجاح!',
    driverRegSuccessSub: 'أنت الآن جاهز لاستقبال طلبات شحن الطرود وإدارة رحلاتك عبر لوحة التحكم.',
    driverRegSuccessOpenTerminal: 'الانتقال إلى لوحة تحكم السائق',

    trackingTitle: 'تتبع مسار الطرد المباشر على الطريق السيار',
    trackingSub: 'تتبع دقيق لموقع الطاكسي، الوقت المتبقي، والتحقق برمز الأمان المزدوج OTP.',
    searchTrackingPlaceholder: 'أدخل رمز التتبع (مثال: ICT-8921)...',
    activeShipments: 'الشحنات النشطة',
    trackingCodeLabel: 'رمز التتبع',
    pickupOtpKey: 'رمز التحقق عند الانطلاق',
    deliveryOtpKey: 'رمز التحقق عند التسليم',
    driverAssigned: 'السائق المكلف',
    statusRequested: 'تم حجز الإرسال',
    statusAccepted: 'تم القبول وحجز المكان',
    statusPickedUp: 'تم شحن الطرد في الطاكسي',
    statusInTransit: 'في الطريق على الطريق السيار',
    statusArrivedAtStation: 'وصل لمحطة الوصول',
    statusDelivered: 'تم التسليم بنجاح',
    statusCancelled: 'ملغى',
    chatWithDriver: 'محادثة السائق',
    callDriver: 'الاتصال بالسائق',
    advanceSimulationBtn: 'محاكاة المرحلة التالية',

    driverTerminalTitle: 'لوحة تحكم وإرسال سائق الطاكسي الكبير',
    driverDispatcherMode: 'وضع سائق الطاكسي',
    driverTodayEarnings: 'أرباح الطرود اليوم',
    driverActiveRoute: 'الخط النشط',
    driverTrunkLoad: 'سعة الصندوق',
    driverTripLifecycle: 'حالة الرحلة',
    driverStage1Boarding: '1. شحن الطرود بالمحطة',
    driverStage2Highway: '2. على الطريق السيار (قيد النقل)',
    driverStage3Arrived: '3. الوصول للمحطة',
    driverStage4Completed: '4. اكتمال التسليم',
    driverVerifyHandoverBtn: 'التحقق من رمز OTP',
    driverPublishTripBtn: 'نشر رحلة جديدة',
    driverSwitchProfile: 'تبديل حساب السائق',
    driverLogoutBtn: 'تسجيل خروج السائق',

    madCurrency: 'د.م',
    status: 'الحالة',
    viewWaybill: 'بوليصة الشحن',
    copyOtp: 'نسخ الرمز',
    copied: 'تم النسخ!',
    otpHandoverNotice: 'لا تسلّم رمز التحقق النهائي إلا بعد فحص الطرد والتأكد من سلامته.',
    changeLanguage: 'اللغة'
  }
};
