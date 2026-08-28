export type Language = 'fr' | 'ar';

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
    navConnectedAs: 'Connecté :',
    navLogout: 'Déconnexion',
    navRegisterDriver: 'Devenir Chauffeur Taxi',

    heroBadge: 'Livraison Express par Grand Taxi au Maroc',
    heroTitle1: 'Envoyez vos Colis de Ville en Ville',
    heroTitleHighlight: 'En 2 à 4 Heures',
    heroSubtitle: 'Confiez vos colis aux chauffeurs de Grands Taxis agréés sur les autoroutes du Maroc. Sécurité par double code OTP et livraison le jour même.',
    heroSendNowBtn: 'Envoyer un Colis',
    heroCreateAccountBtn: 'Créer un Compte / Connexion',
    quickCorridors: 'Lignes Fréquentes :',
    originCityLabel: 'Ville de Départ',
    destinationCityLabel: 'Ville d’Arrivée',
    dispatchOnRouteBtn: 'Expédier sur cette Ligne',
    expressCorridor: 'Axe Autoroutier :',
    distance: 'Distance :',
    avgTransitTime: 'Temps Moyen :',
    fromRate: 'À partir de',

    taxisOnRoute: 'Taxis disponibles sur',
    departingSoon: 'Départ Imminent',
    driverSearchPlaceholder: 'Rechercher chauffeur, matricule, station...',
    allTaxisFilter: 'Tous',
    spaciousTrunkFilter: 'Grand Coffre',
    doorstepFilter: 'À Domicile',
    noDriversFound: 'Aucun taxi disponible sur ce trajet pour le moment',
    noDriversSub: 'Modifiez vos critères ou essayez les lignes Casablanca ➔ Rabat ou Marrakech ➔ Casablanca.',
    viewCasablancaRabat: 'Voir Casablanca ➔ Rabat',
    verifiedTrips: 'trajets vérifiés',
    taxiPlate: 'MATRICULE TAXI',
    departure: 'Départ :',
    estArrival: 'Arrivée Estimée :',
    pickupStation: 'Station Départ :',
    dropoffStation: 'Station Arrivée :',
    trunk: 'Coffre :',
    slotsLeft: 'places colis restantes',
    doorstepAvailable: 'Porte-à-Porte Disponible',
    baseRate: 'Tarif de Base',
    perDocsSmall: '/ enveloppes & petits colis',
    sendParcelWithTaxi: 'Envoyer par ce Taxi',

    modalTitle: 'Expédition avec le Chauffeur',
    modalSub: 'Départ',
    step1Category: '1. Format du Colis',
    step2Details: '2. Détails & Poids',
    step3Contacts: '3. Contacts Expéditeur & Destinataire',
    step4Doorstep: '4. Ramassage & Livraison',
    step5Payment: '5. Mode de Paiement',
    parcelLabelTitle: 'Désignation du Colis *',
    parcelLabelPlaceholder: 'Ex: Documents, pièces auto, échantillons',
    weightKg: 'Poids en Kg',
    contentsDescTitle: 'Description du Contenu & Emballage',
    contentsDescPlaceholder: 'Précisions pour le chauffeur (ex: enveloppe scellée, carton)',
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
    doorstepDropoffDesc: 'Le chauffeur livre à l’adresse du destinataire',
    cashOnPickup: 'Espèces au Départ',
    cashOnPickupDesc: 'Paiement au chauffeur à la station de départ',
    cashOnDelivery: 'Paiement à la Livraison (COD)',
    cashOnDeliveryDesc: 'Le destinataire paie à la remise du colis',
    digitalPrepaid: 'Carte Bancaire / Séquestre',
    digitalPrepaidDesc: 'Fonds débloqués dès validation du code OTP',
    totalDeliveryFee: 'Frais de Livraison Totaux',
    cancelBtn: 'Annuler',
    confirmDualOtpBtn: 'Confirmer & Générer les Codes OTP',

    driverRegTitle: 'Inscription Chauffeur Grand Taxi',
    driverRegSubtitle: 'Rejoignez le réseau de transport de colis par Grand Taxi au Maroc. Rentabilisez votre coffre.',
    driverFullName: 'Nom Complet du Chauffeur *',
    driverPhone: 'Numéro de Téléphone (+212...) *',
    driverCity: 'Ville de Base *',
    driverLicensePlate: 'Immatriculation Taxi * (ex: 01-A-12345)',
    driverTaxiPermit: 'N° Permis de Confiance / Agrément (ex: AGR-8492)',
    driverVehicleModel: 'Modèle du Véhicule (ex: Mercedes 240D / Dacia Lodgy) *',
    driverVehicleColor: 'Couleur du Véhicule *',
    driverVehicleType: 'Catégorie de Véhicule *',
    driverOriginRoute: 'Ville de Départ *',
    driverDestinationRoute: 'Ville de Destination *',
    driverOriginHub: 'Station de Taxi de Départ *',
    driverDestinationHub: 'Station de Taxi d’Arrivée *',
    driverMaxParcels: 'Capacité Max de Colis *',
    driverFlatBaseRate: 'Tarif Forfaitaire par Colis (DH) *',
    driverKgRate: 'Supplément par Kg (DH) *',
    driverDoorstepToggle: 'Accepter le Porte-à-Porte',
    driverDoorstepToggleSub: 'Facturez +25 DH pour les remises en centre-ville',
    driverPhotoUrl: 'Photo de Profil (URL)',
    driverSubmitBtn: 'Valider mon Inscription',
    driverRegSuccessTitle: 'Compte Enregistré avec Succès !',
    driverRegSuccessSub: 'Vous êtes maintenant visible auprès des expéditeurs.',
    driverRegSuccessOpenTerminal: 'Accéder au Terminal Chauffeur',

    trackingTitle: 'Suivi GPS Autoroutier en Direct',
    trackingSub: 'Position en direct, progression autoroutière et validation par double code OTP.',
    searchTrackingPlaceholder: 'Code de suivi (ex: ICT-8921)...',
    activeShipments: 'Envois en Cours',
    trackingCodeLabel: 'Code de Suivi',
    pickupOtpKey: 'Code OTP Départ',
    deliveryOtpKey: 'Code OTP Livraison',
    driverAssigned: 'Chauffeur Assigné',
    statusRequested: 'Expédition Demandée',
    statusAccepted: 'Accepté & Place Réservée',
    statusPickedUp: 'Chargé dans le Taxi',
    statusInTransit: 'En Route (Autoroute)',
    statusArrivedAtStation: 'Arrivé à la Station',
    statusDelivered: 'Livré avec Succès',
    statusCancelled: 'Annulé',
    chatWithDriver: 'Messagerie Directe',
    callDriver: 'Appeler',
    advanceSimulationBtn: 'Étape Suivante (Simulation)',

    driverTerminalTitle: 'Terminal Dispatch Chauffeur Grand Taxi',
    driverDispatcherMode: 'Mode Chauffeur',
    driverTodayEarnings: 'Gains Colis du Jour',
    driverActiveRoute: 'Ligne Active',
    driverTrunkLoad: 'Remplissage Coffre',
    driverTripLifecycle: 'Cycle du Voyage',
    driverStage1Boarding: '1. Embarquement à la Station',
    driverStage2Highway: '2. En Route sur l’Autoroute',
    driverStage3Arrived: '3. Arrivé à Destination',
    driverStage4Completed: '4. Livraison Clôturée',
    driverVerifyHandoverBtn: 'Valider le Code OTP',
    driverPublishTripBtn: 'Nouveau Voyage',
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
    brandTagline: 'خدمة إرسال الطرود عبر الطاكسي الكبير بالمغرب',
    navHomeSend: 'إرسال طرد',
    navLiveTracking: 'التتبع المباشر',
    navMyOrders: 'طلباتي',
    navSenderAccount: 'حسابي',
    navDriverTerminal: 'لوحة السائق',
    navTaxiHubs: 'محطات الطاكسيات',
    navConnectSender: 'تسجيل الدخول / إنشاء حساب',
    navConnectedAs: 'مرحباً :',
    navLogout: 'خروج',
    navRegisterDriver: 'تسجيل سائق طاكسي',

    heroBadge: 'توصيل سريع ومضمون عبر الطاكسي الكبير',
    heroTitle1: 'أرسل طردك بين المدن',
    heroTitleHighlight: 'في ساعتين إلى 4 ساعات',
    heroSubtitle: 'أرسل طرودك مع سائقي الطاكسيات الكبيرة المعتمدين على الطرق السيارة. أمان برمزين سريين وتسليم في نفس اليوم.',
    heroSendNowBtn: 'أرسل طردك الآن',
    heroCreateAccountBtn: 'دخول / حساب جديد',
    quickCorridors: 'الخطوط الرائجة :',
    originCityLabel: 'مدينة الانطلاق',
    destinationCityLabel: 'مدينة الوصول',
    dispatchOnRouteBtn: 'تأكيد الخط واختيار السائق',
    expressCorridor: 'الطريق السيار :',
    distance: 'المسافة :',
    avgTransitTime: 'المدة المقدرة :',
    fromRate: 'ابتداءً من',

    taxisOnRoute: 'طاكسيات متوفرة على خط',
    departingSoon: 'تنطلق قريباً',
    driverSearchPlaceholder: 'ابحث عن سائق، لوحة، محطة...',
    allTaxisFilter: 'الكل',
    spaciousTrunkFilter: 'صندوق واسع',
    doorstepFilter: 'توصيل للباب',
    noDriversFound: 'لا توجد طاكسيات مسجلة على هذا الخط حالياً',
    noDriversSub: 'جرّب تعديل البحث أو اختر خط الدار البيضاء ➔ الرباط أو مراكش ➔ الدار البيضاء.',
    viewCasablancaRabat: 'خط كازا ➔ الرباط',
    verifiedTrips: 'رحلات موثقة',
    taxiPlate: 'رقم الطاكسي',
    departure: 'الانطلاق :',
    estArrival: 'الوصول المتوقع :',
    pickupStation: 'محطة الانطلاق :',
    dropoffStation: 'محطة الوصول :',
    trunk: 'الصندوق :',
    slotsLeft: 'أماكن متبقية',
    doorstepAvailable: 'خدمة التوصيل للباب',
    baseRate: 'السعر المرجعي',
    perDocsSmall: '/ للوثائق والطرود الصغيرة',
    sendParcelWithTaxi: 'إرسال مع هذا السائق',

    modalTitle: 'إرسال طرد مع السائق',
    modalSub: 'الانطلاق',
    step1Category: '1. حجم الطرد',
    step2Details: '2. تفاصيل ووزن الطرد',
    step3Contacts: '3. معلومات المرسل والمستلم',
    step4Doorstep: '4. التوصيل للباب',
    step5Payment: '5. طريقة الأداء',
    parcelLabelTitle: 'نوع / وصف الطرد *',
    parcelLabelPlaceholder: 'مثال: وثائق، قطع غيار، عينات',
    weightKg: 'الوزن (كلغ)',
    contentsDescTitle: 'محتوى الطرد ونوع التغليف',
    contentsDescPlaceholder: 'توجيهات للسائق (مثال: ظرف مغلق، كرتون مقوى)',
    fragileItem: 'طرد قابل للكسر (+20 د.م)',
    fragileDesc: 'حفظ آمن في المقصورة الأمامية',
    declaredValue: 'القيمة المصرح بها (د.م)',
    senderTitle: 'المرسل (أنت)',
    senderFullName: 'اسم المرسل',
    senderPhone: 'هاتف المرسل (+212...)',
    meetingNotes: 'مكان اللقاء في المحطة (مثال: الرصيف 3)',
    recipientTitle: 'المستلم *',
    recipientFullName: 'اسم المستلم *',
    recipientPhone: 'هاتف المستلم (+212...) *',
    dropoffAddressPoint: 'عنوان أو محطة الاستلام',
    doorstepPickupOption: 'استلام من باب بيتك (+25 د.م)',
    doorstepPickupDesc: 'يأتي السائق لاستلام الطرد من عنوانك',
    doorstepDropoffOption: 'تسليم لباب المستلم (+25 د.م)',
    doorstepDropoffDesc: 'يوصل السائق الطرد لعنوان المستلم',
    cashOnPickup: 'نقداً عند الانطلاق',
    cashOnPickupDesc: 'الدفع للسائق في محطة الانطلاق',
    cashOnDelivery: 'الدفع عند الاستلام (COD)',
    cashOnDeliveryDesc: 'يؤدي المستلم المبلغ عند الاستلام',
    digitalPrepaid: 'بطاقة بنكية / ضمان رقمي',
    digitalPrepaidDesc: 'لا يُحرر المبلغ إلا بعد إدخال رمز التحقق',
    totalDeliveryFee: 'المبلغ الإجمالي للتوصيل',
    cancelBtn: 'إلغاء',
    confirmDualOtpBtn: 'تأكيد وتوليد رمزي التحقق OTP',

    driverRegTitle: 'تسجيل سائق طاكسي كبير',
    driverRegSubtitle: 'انضم لشبكة توصيل الطرود عبر الطاكسي الكبير واستفد من سعة الصندوق في كل رحلة.',
    driverFullName: 'اسم السائق الكامل *',
    driverPhone: 'رقم الهاتف (+212...) *',
    driverCity: 'المدينة الرئيسية *',
    driverLicensePlate: 'رقم لوحة الطاكسي * (مثال: 01-أ-12345)',
    driverTaxiPermit: 'رقم المأذونية / رخصة الثقة (مثال: AGR-8492)',
    driverVehicleModel: 'نوع وموديل السيارة (مثال: داسيا لودجي / مرسيدس) *',
    driverVehicleColor: 'لون السيارة *',
    driverVehicleType: 'صنف السيارة *',
    driverOriginRoute: 'مدينة الانطلاق المعتادة *',
    driverDestinationRoute: 'مدينة الوصول المعتادة *',
    driverOriginHub: 'محطة الانطلاق *',
    driverDestinationHub: 'محطة الوصول *',
    driverMaxParcels: 'الحد الأقصى للطرود *',
    driverFlatBaseRate: 'السعر الأساسي لكل طرد (د.م) *',
    driverKgRate: 'سعر الكيلوغرام الإضافي (د.م) *',
    driverDoorstepToggle: 'قبول التوصيل إلى الباب',
    driverDoorstepToggleSub: 'إضافة 25 درهماً للطلبات داخل المدينة',
    driverPhotoUrl: 'رابط الصورة الشخصية',
    driverSubmitBtn: 'تأكيد التسجيل',
    driverRegSuccessTitle: 'تم تسجيل حساب السائق بنجاح!',
    driverRegSuccessSub: 'يمكنك الآن استقبال طلبات الطرود وإدارتها.',
    driverRegSuccessOpenTerminal: 'الدخول للوحة السائق',

    trackingTitle: 'تتبع مسار الطرد المباشر',
    trackingSub: 'تتبع موقع الطاكسي والوقت المتبقي والتحقق برمز الأمان المزدوج OTP.',
    searchTrackingPlaceholder: 'أدخل رمز التتبع (مثال: ICT-8921)...',
    activeShipments: 'الطرود الجارية',
    trackingCodeLabel: 'رمز التتبع',
    pickupOtpKey: 'رمز التحقق عند الانطلاق',
    deliveryOtpKey: 'رمز التحقق عند التسليم',
    driverAssigned: 'السائق المكلف',
    statusRequested: 'تم حجز الإرسال',
    statusAccepted: 'تم قبول الطلب',
    statusPickedUp: 'الطرد مشحون في الطاكسي',
    statusInTransit: 'في الطريق (على الطريق السيار)',
    statusArrivedAtStation: 'وصل لمحطة الوصول',
    statusDelivered: 'تم التسليم بنجاح',
    statusCancelled: 'ملغى',
    chatWithDriver: 'محادثة',
    callDriver: 'اتصال',
    advanceSimulationBtn: 'المرحلة التالية (محاكاة)',

    driverTerminalTitle: 'لوحة تحكم سائق الطاكسي الكبير',
    driverDispatcherMode: 'وضع السائق',
    driverTodayEarnings: 'أرباح الطرود اليوم',
    driverActiveRoute: 'الخط الحالي',
    driverTrunkLoad: 'سعة الصندوق',
    driverTripLifecycle: 'مراحل الرحلة',
    driverStage1Boarding: '1. شحن الطرود بالمحطة',
    driverStage2Highway: '2. على الطريق السيار',
    driverStage3Arrived: '3. الوصول للمحطة',
    driverStage4Completed: '4. اكتمال التسليم',
    driverVerifyHandoverBtn: 'تأكيد رمز OTP',
    driverPublishTripBtn: 'رحلة جديدة',
    driverSwitchProfile: 'تبديل الحساب',
    driverLogoutBtn: 'خروج السائق',

    madCurrency: 'د.م',
    status: 'الحالة',
    viewWaybill: 'البوليصة',
    copyOtp: 'نسخ الرمز',
    copied: 'تم النسخ !',
    otpHandoverNotice: 'لا تسلم رمز التحقق إلا بعد معاينة الطرد والتأكد منه.',
    changeLanguage: 'اللغة'
  }
};
