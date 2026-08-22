import React from 'react';
import { 
  Home, 
  Compass, 
  LayoutDashboard, 
  Truck, 
  Building2 
} from 'lucide-react';
import { SenderUser } from '../types';
import { Language, translations } from '../utils/i18n';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations';
  setActiveTab: (tab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations') => void;
  activeDeliveriesCount: number;
  currentUser?: SenderUser | null;
  onRequireAuth?: () => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  activeDeliveriesCount,
  currentUser,
  onRequireAuth,
  language
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  return (
    <nav 
      aria-label="Mobile Navigation"
      id="mobile-bottom-navigation-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-1.5 py-1.5 flex items-center justify-around safe-area-pb"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Home / Send */}
      <button
        id="mobile-nav-send"
        onClick={() => setActiveTab('send')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold min-h-[50px] transition-all cursor-pointer ${
          activeTab === 'send' 
            ? 'text-zinc-950 bg-zinc-100 font-extrabold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]' 
            : 'text-zinc-500 hover:text-zinc-900 active:scale-95'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'send' ? 'text-amber-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="truncate max-w-[64px] mt-0.5 leading-tight">{t.navHomeSend.split('/')[0]}</span>
      </button>

      {/* Live Tracking */}
      <button
        id="mobile-nav-track"
        onClick={() => setActiveTab('track')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold min-h-[50px] relative transition-all cursor-pointer ${
          activeTab === 'track' 
            ? 'text-zinc-950 bg-zinc-100 font-extrabold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]' 
            : 'text-zinc-500 hover:text-zinc-900 active:scale-95'
        }`}
      >
        <div className="relative">
          <Compass className={`w-5 h-5 ${activeTab === 'track' ? 'text-amber-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          {activeDeliveriesCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-zinc-950 shadow-xs animate-pulse">
              {activeDeliveriesCount}
            </span>
          )}
        </div>
        <span className="truncate max-w-[64px] mt-0.5 leading-tight">{t.navLiveTracking.split(' ')[0]}</span>
      </button>

      {/* Orders / Account */}
      <button
        id="mobile-nav-dashboard"
        onClick={() => {
          if (!currentUser && onRequireAuth) {
            onRequireAuth();
          } else {
            setActiveTab('dashboard');
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold min-h-[50px] transition-all cursor-pointer ${
          activeTab === 'dashboard' 
            ? 'text-zinc-950 bg-zinc-100 font-extrabold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]' 
            : 'text-zinc-500 hover:text-zinc-900 active:scale-95'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-amber-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="truncate max-w-[64px] mt-0.5 leading-tight">{currentUser ? t.navMyOrders.split(' ')[0] : 'Compte'}</span>
      </button>

      {/* Driver Terminal */}
      <button
        id="mobile-nav-driver"
        onClick={() => setActiveTab('driver')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold min-h-[50px] transition-all cursor-pointer ${
          activeTab === 'driver' 
            ? 'text-zinc-950 bg-amber-100/90 font-extrabold border border-amber-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]' 
            : 'text-zinc-500 hover:text-zinc-900 active:scale-95'
        }`}
      >
        <Truck className={`w-5 h-5 ${activeTab === 'driver' ? 'text-amber-700 stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="truncate max-w-[64px] mt-0.5 leading-tight">{t.navDriverTerminal.split(' ')[0]}</span>
      </button>

      {/* Hubs / Stations */}
      <button
        id="mobile-nav-stations"
        onClick={() => setActiveTab('stations')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold min-h-[50px] transition-all cursor-pointer ${
          activeTab === 'stations' 
            ? 'text-zinc-950 bg-zinc-100 font-extrabold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]' 
            : 'text-zinc-500 hover:text-zinc-900 active:scale-95'
        }`}
      >
        <Building2 className={`w-5 h-5 ${activeTab === 'stations' ? 'text-amber-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="truncate max-w-[64px] mt-0.5 leading-tight">{t.navTaxiHubs.split(' ')[0]}</span>
      </button>
    </nav>
  );
};
