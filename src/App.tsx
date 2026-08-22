/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TaxiDriver, ParcelDelivery, ChatMessage, DeliveryStatus, SenderUser } from './types';
import { INITIAL_DRIVERS, INITIAL_PARCELS, INITIAL_CHAT, DEFAULT_SENDER_USERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { SenderDashboardView } from './components/SenderDashboardView';
import { SenderView } from './components/SenderView';
import { LiveTrackingView } from './components/LiveTrackingView';
import { DriverTerminalView } from './components/DriverTerminalView';
import { StationsDirectoryView } from './components/StationsDirectoryView';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { DriverRegisterModal } from './components/DriverRegisterModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Language } from './utils/i18n';

const STORAGE_KEYS = {
  DRIVERS: 'ict_taxi_drivers_v1',
  PARCELS: 'ict_parcels_v1',
  CHAT: 'ict_chat_v1',
  USERS: 'ict_sender_users_v1',
  CURRENT_USER: 'ict_current_sender_v1',
  LANGUAGE: 'ict_language_v1'
};

export default function App() {
  // Language Support (English, French, Arabic)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'fr' || savedLang === 'ar')) {
        return savedLang;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  // Navigation: Default strictly to 'send' (the Home / Send page)
  const [activeTab, setActiveTab] = useState<'send' | 'dashboard' | 'track' | 'driver' | 'stations'>('send');
  const [prefillParcelData, setPrefillParcelData] = useState<Partial<ParcelDelivery> | null>(null);

  // Authentication Modal State (for Senders)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const authSuccessCallbackRef = useRef<(() => void) | null>(null);

  // Driver Registration Modal State
  const [isDriverRegisterModalOpen, setIsDriverRegisterModalOpen] = useState(false);

  // Sender User Authentication State
  const [senderUsers, setSenderUsers] = useState<SenderUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : DEFAULT_SENDER_USERS;
    } catch {
      return DEFAULT_SENDER_USERS;
    }
  });

  const [currentSenderUser, setCurrentSenderUser] = useState<SenderUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Start disconnected by default
      return null;
    } catch {
      return null;
    }
  });

  // Persistence / States
  const [drivers, setDrivers] = useState<TaxiDriver[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [deliveries, setDeliveries] = useState<ParcelDelivery[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARCELS);
      return saved ? JSON.parse(saved) : INITIAL_PARCELS;
    } catch {
      return INITIAL_PARCELS;
    }
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      return saved ? JSON.parse(saved) : INITIAL_CHAT;
    } catch {
      return INITIAL_CHAT;
    }
  });

  const [activeDriverId, setActiveDriverId] = useState<string>(INITIAL_DRIVERS[0].id);
  const [selectedTrackingCode, setSelectedTrackingCode] = useState<string>(INITIAL_PARCELS[0].trackingCode);
  const [activeChatDelivery, setActiveChatDelivery] = useState<ParcelDelivery | null>(null);

  // Sync Language & RTL direction to document
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Language sync failed', e);
    }
  }, [language]);

  // Sync users to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(senderUsers));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [senderUsers]);

  useEffect(() => {
    try {
      if (currentSenderUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentSenderUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [currentSenderUser]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(deliveries));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [deliveries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [chatMessages]);

  // Require Auth Trigger Helper
  const handleRequireAuth = (afterAuthCallback?: () => void) => {
    if (afterAuthCallback) {
      authSuccessCallbackRef.current = afterAuthCallback;
    } else {
      authSuccessCallbackRef.current = null;
    }
    setIsAuthModalOpen(true);
  };

  // Sender Auth Handlers
  const handleLoginSender = (user: SenderUser) => {
    setCurrentSenderUser(user);
    if (authSuccessCallbackRef.current) {
      const cb = authSuccessCallbackRef.current;
      authSuccessCallbackRef.current = null;
      setTimeout(() => cb(), 100);
    }
  };

  const handleLogoutSender = () => {
    setCurrentSenderUser(null);
  };

  const handleRegisterSender = (newUser: SenderUser) => {
    setSenderUsers(prev => [newUser, ...prev]);
    setCurrentSenderUser(newUser);
    if (authSuccessCallbackRef.current) {
      const cb = authSuccessCallbackRef.current;
      authSuccessCallbackRef.current = null;
      setTimeout(() => cb(), 100);
    }
  };

  // Driver Registration Handler (connects new driver to fleet)
  const handleRegisterDriver = (newDriver: TaxiDriver) => {
    setDrivers(prev => [newDriver, ...prev]);
    setActiveDriverId(newDriver.id);
    setActiveTab('driver');
  };

  // Book a new parcel
  const handleBookParcel = (newParcel: ParcelDelivery) => {
    setDeliveries(prev => [newParcel, ...prev]);

    // Update driver parcel count
    if (newParcel.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === newParcel.driverId) {
          return {
            ...d,
            currentParcelsCount: d.currentParcelsCount + 1,
            availableTrunkSpace: d.currentParcelsCount + 1 >= d.maxParcels ? 'limited' : 'medium'
          };
        }
        return d;
      }));
    }

    // Initialize chat for this delivery
    setChatMessages(prev => ({
      ...prev,
      [newParcel.id]: [
        {
          id: `m-init-${Date.now()}`,
          deliveryId: newParcel.id,
          senderRole: 'system',
          senderName: 'Kangoro Dispatch System',
          message: `Booking confirmed with driver ${newParcel.driver?.name}. Pickup OTP: ${newParcel.pickupOtp}`,
          timestamp: Date.now()
        },
        {
          id: `m-drv-${Date.now()}`,
          deliveryId: newParcel.id,
          senderRole: 'driver',
          senderName: newParcel.driver?.name || 'Driver',
          message: `Hello ${newParcel.senderName}! I have reserved trunk space for your parcel (${newParcel.title}). Meet me at ${newParcel.originStation}.`,
          timestamp: Date.now() + 1000
        }
      ]
    }));
  };

  // Publish a new driver trip
  const handlePublishTrip = (tripData: Partial<TaxiDriver>) => {
    const newDriver: TaxiDriver = {
      id: `drv-${Date.now()}`,
      name: tripData.name || 'Grand Taxi Express',
      phone: '+212 6 60 11 22 33',
      avatar: tripData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      totalTrips: 1,
      vehicleModel: tripData.vehicleModel || 'Grand Taxi Sedan',
      vehiclePlate: tripData.vehiclePlate || '01-A-99999',
      vehicleColor: 'Classic White',
      vehicleType: 'grand_taxi',
      originCity: tripData.originCity || 'Casablanca',
      destinationCity: tripData.destinationCity || 'Rabat',
      departureTime: tripData.departureTime || 'Departs in 30 mins',
      departureTimestamp: tripData.departureTimestamp || Date.now() + 30 * 60 * 1000,
      estimatedArrival: tripData.estimatedArrival || 'In 1 hr 15 mins',
      originStation: tripData.originStation || 'Central Grand Taxi Hub',
      destinationStation: tripData.destinationStation || 'Destination Terminal',
      availableTrunkSpace: 'plenty',
      maxParcels: tripData.maxParcels || 5,
      currentParcelsCount: 0,
      basePricePerKg: tripData.basePricePerKg || 3.5,
      flatBaseRate: tripData.flatBaseRate || 16,
      acceptsDoorstep: tripData.acceptsDoorstep ?? true,
      status: 'boarding',
      currentProgressPct: 0,
      notes: 'New trip scheduled by driver.'
    };

    setDrivers(prev => [newDriver, ...prev]);
    setActiveDriverId(newDriver.id);
  };

  // Update Driver status & synced parcel statuses
  const handleUpdateDriverStatus = (driverId: string, status: TaxiDriver['status'], progressPct: number) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          status,
          currentProgressPct: progressPct
        };
      }
      return d;
    }));

    // If driver departed or arrived, update associated parcels
    let mappedParcelStatus: DeliveryStatus | null = null;
    let desc = '';

    if (status === 'in_transit') {
      mappedParcelStatus = 'in_transit';
      desc = 'Taxi is cruising on intercity express highway.';
    } else if (status === 'arrived') {
      mappedParcelStatus = 'arrived_at_station';
      desc = 'Taxi arrived at destination terminal. Waiting for recipient handover.';
    }

    if (mappedParcelStatus) {
      setDeliveries(prev => prev.map(p => {
        if (p.driverId === driverId && p.status !== 'delivered' && p.status !== 'cancelled') {
          return {
            ...p,
            status: mappedParcelStatus!,
            updatedAt: Date.now(),
            statusHistory: [
              ...p.statusHistory,
              {
                status: mappedParcelStatus!,
                timestamp: Date.now(),
                description: desc,
                locationName: status === 'arrived' ? p.destinationStation : 'Highway Corridor'
              }
            ]
          };
        }
        return p;
      }));
    }
  };

  // Verify Handover (Pickup or Delivery OTP)
  const handleVerifyHandover = (deliveryId: string, otp: string, proofPhoto?: string): boolean => {
    const target = deliveries.find(d => d.id === deliveryId);
    if (!target) return false;

    // Check if it's pickup OTP
    if (otp === target.pickupOtp && (target.status === 'accepted' || target.status === 'requested')) {
      setDeliveries(prev => prev.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: 'picked_up',
            pickupVerifiedAt: Date.now(),
            parcelPhotoUrl: proofPhoto || d.parcelPhotoUrl,
            updatedAt: Date.now(),
            statusHistory: [
              ...d.statusHistory,
              {
                status: 'picked_up',
                timestamp: Date.now(),
                description: `Parcel handed over by sender. Pickup OTP ${otp} verified.`,
                locationName: d.originStation
              }
            ]
          };
        }
        return d;
      }));
      return true;
    }

    // Check if it's delivery OTP
    if (otp === target.deliveryOtp) {
      setDeliveries(prev => prev.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: 'delivered',
            deliveryVerifiedAt: Date.now(),
            proofOfDeliveryPhoto: proofPhoto || d.proofOfDeliveryPhoto,
            isPaid: true,
            updatedAt: Date.now(),
            statusHistory: [
              ...d.statusHistory,
              {
                status: 'delivered',
                timestamp: Date.now(),
                description: `Delivered to recipient ${d.receiverName}. Delivery OTP ${otp} verified.`,
                locationName: d.destinationStation
              }
            ]
          };
        }
        return d;
      }));
      return true;
    }

    return false;
  };

  // Advance simulation (for testing)
  const handleAdvanceSimulation = (deliveryId: string) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id !== deliveryId) return d;

      let nextStatus: DeliveryStatus = d.status;
      let newHistoryDesc = '';
      let loc = '';

      if (d.status === 'requested') {
        nextStatus = 'accepted';
        newHistoryDesc = 'Driver confirmed booking.';
        loc = d.originStation;
      } else if (d.status === 'accepted') {
        nextStatus = 'picked_up';
        newHistoryDesc = `Driver loaded parcel at station. Pickup OTP ${d.pickupOtp} verified.`;
        loc = d.originStation;
      } else if (d.status === 'picked_up') {
        nextStatus = 'in_transit';
        newHistoryDesc = 'Taxi departed on intercity expressway.';
        loc = 'Expressway Toll Gate';
      } else if (d.status === 'in_transit') {
        nextStatus = 'arrived_at_station';
        newHistoryDesc = `Taxi arrived at ${d.destinationStation}. Ready for recipient handover.`;
        loc = d.destinationStation;
      } else if (d.status === 'arrived_at_station') {
        nextStatus = 'delivered';
        newHistoryDesc = `Handover complete. Recipient verified with OTP ${d.deliveryOtp}.`;
        loc = d.destinationStation;
      }

      const updatedDelivery: ParcelDelivery = {
        ...d,
        status: nextStatus,
        isPaid: nextStatus === 'delivered' ? true : d.isPaid,
        updatedAt: Date.now(),
        driver: d.driver ? {
          ...d.driver,
          currentProgressPct: nextStatus === 'delivered' ? 100 : nextStatus === 'arrived_at_station' ? 90 : nextStatus === 'in_transit' ? 65 : 20
        } : undefined,
        statusHistory: [
          ...d.statusHistory,
          {
            status: nextStatus,
            timestamp: Date.now(),
            description: newHistoryDesc,
            locationName: loc
          }
        ]
      };

      return updatedDelivery;
    }));
  };

  // Send message in chat
  const handleSendMessage = (text: string, senderRole: 'sender' | 'driver' | 'receiver', senderName: string) => {
    if (!activeChatDelivery) return;
    const deliveryId = activeChatDelivery.id;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      deliveryId,
      senderRole,
      senderName,
      message: text,
      timestamp: Date.now()
    };

    setChatMessages(prev => ({
      ...prev,
      [deliveryId]: [...(prev[deliveryId] || []), newMsg]
    }));

    // Auto-reply simulation from Driver or Receiver if sent by Sender
    if (senderRole === 'sender') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-rep-${Date.now()}`,
          deliveryId,
          senderRole: 'driver',
          senderName: activeChatDelivery.driver?.name || 'Driver Karim',
          message: 'Received your message! I will keep you updated right as I cross the highway toll gate.',
          timestamp: Date.now()
        };
        setChatMessages(prev => ({
          ...prev,
          [deliveryId]: [...(prev[deliveryId] || []), replyMsg]
        }));
      }, 1200);
    }
  };

  // Reset to initial demo data
  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEYS.DRIVERS);
    localStorage.removeItem(STORAGE_KEYS.PARCELS);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    setDrivers(INITIAL_DRIVERS);
    setDeliveries(INITIAL_PARCELS);
    setChatMessages(INITIAL_CHAT);
    setSelectedTrackingCode(INITIAL_PARCELS[0].trackingCode);
    setActiveDriverId(INITIAL_DRIVERS[0].id);
  };

  const activeDeliveriesCount = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled').length;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDeliveriesCount={activeDeliveriesCount}
        onResetData={handleResetData}
        currentUser={currentSenderUser}
        onLogoutSender={handleLogoutSender}
        onRequireAuth={handleRequireAuth}
        language={language}
        onSetLanguage={setLanguage}
        onOpenDriverRegister={() => setIsDriverRegisterModalOpen(true)}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-12">
        {activeTab === 'send' && (
          <SenderView
            drivers={drivers}
            initialPrefillData={prefillParcelData}
            currentUser={currentSenderUser}
            onRequireAuth={handleRequireAuth}
            language={language}
            onBookParcel={(newParcel) => {
              handleBookParcel(newParcel);
              setSelectedTrackingCode(newParcel.trackingCode);
              setPrefillParcelData(null);
            }}
            onSelectDeliveryForTracking={(code) => {
              setSelectedTrackingCode(code);
              setActiveTab('track');
            }}
            onNavigateToDashboard={() => {
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <SenderDashboardView
            currentUser={currentSenderUser}
            onLogin={handleLoginSender}
            onLogout={handleLogoutSender}
            onRegister={handleRegisterSender}
            availableUsers={senderUsers}
            deliveries={deliveries}
            language={language}
            onNavigateToSend={(prefill) => {
              setPrefillParcelData(prefill || null);
              setActiveTab('send');
            }}
            onNavigateToTrack={(code) => {
              setSelectedTrackingCode(code);
              setActiveTab('track');
            }}
            onOpenChat={(d) => setActiveChatDelivery(d)}
          />
        )}

        {activeTab === 'track' && (
          <LiveTrackingView
            deliveries={deliveries}
            selectedTrackingCode={selectedTrackingCode}
            onSelectTrackingCode={setSelectedTrackingCode}
            onOpenChat={(d) => setActiveChatDelivery(d)}
            onAdvanceSimulation={handleAdvanceSimulation}
          />
        )}

        {activeTab === 'driver' && (
          <DriverTerminalView
            drivers={drivers}
            activeDriverId={activeDriverId}
            onSelectDriver={setActiveDriverId}
            deliveries={deliveries}
            onPublishTrip={handlePublishTrip}
            onUpdateDriverStatus={handleUpdateDriverStatus}
            onVerifyHandover={handleVerifyHandover}
            onOpenChat={(d) => setActiveChatDelivery(d)}
            language={language}
            onOpenDriverRegister={() => setIsDriverRegisterModalOpen(true)}
            onLogoutDriver={() => setActiveDriverId(INITIAL_DRIVERS[0].id)}
          />
        )}

        {activeTab === 'stations' && <StationsDirectoryView />}
      </main>

      {/* Driver Registration Modal */}
      <DriverRegisterModal
        isOpen={isDriverRegisterModalOpen}
        onClose={() => setIsDriverRegisterModalOpen(false)}
        onRegisterDriver={handleRegisterDriver}
        language={language}
      />

      {/* Auth Modal triggered across app for senders */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onRegister={handleRegisterSender}
        onLogin={handleLoginSender}
        availableUsers={senderUsers}
        onSuccessCallback={() => {
          if (authSuccessCallbackRef.current) {
            const cb = authSuccessCallbackRef.current;
            authSuccessCallbackRef.current = null;
            cb();
          }
        }}
      />

      {/* Direct Messaging Chat Modal */}
      {activeChatDelivery && (
        <ChatModal
          delivery={activeChatDelivery}
          messages={chatMessages[activeChatDelivery.id] || []}
          onSendMessage={handleSendMessage}
          onClose={() => setActiveChatDelivery(null)}
        />
      )}

      {/* Clean Footer */}
      <footer className="bg-white border-t border-zinc-200 py-6 mb-20 md:mb-0 text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="KANGORO DELIVERY"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain"
            />
            <span className="font-semibold text-zinc-700">Rapid City-to-City Parcel Delivery Network</span>
          </div>
          <span className="text-zinc-500">Dual OTP Security • Verified Grand Taxi Hubs • Live Expressway Tracking</span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDeliveriesCount={activeDeliveriesCount}
        currentUser={currentSenderUser}
        onRequireAuth={handleRequireAuth}
        language={language}
      />
    </div>
  );
}
