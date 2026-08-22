import React, { useState } from 'react';
import { 
  Truck, 
  Compass, 
  Building2, 
  RefreshCw, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Home,
  Globe,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { SenderUser } from '../types';
import { Language, translations } from '../utils/i18n';
import { KANGORO_LOGO_URL } from '../constants';

interface NavbarProps {
  activeTab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations';
  setActiveTab: (tab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations') => void;
  activeDeliveriesCount: number;
  onResetData: () => void;
  currentUser?: SenderUser | null;
  onLogoutSender?: () => void;
  onRequireAuth?: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onOpenDriverRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDeliveriesCount,
  onResetData,
  currentUser,
  onLogoutSender,
  onRequireAuth,
  language,
  onSetLanguage,
  onOpenDriverRegister
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo - Official Kangoro Delivery */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('send')}
            className="flex items-center cursor-pointer group select-none shrink-0"
          >
            <img
              src={KANGORO_LOGO_URL}
              alt="KANGORO DELIVERY"
              referrerPolicy="no-referrer"
              className="h-11 sm:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Center Navigation Tabs - Airbnb Capsule Pill Style */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              id="nav-send-tab"
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'send'
                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                  : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${activeTab === 'send' ? 'text-amber-600 stroke-[2.4]' : 'text-zinc-500'}`} />
              <span>{t.navHomeSend}</span>
            </button>

            <button
              id="nav-track-tab"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 relative cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                  : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'track' ? 'text-amber-600 stroke-[2.4]' : 'text-zinc-500'}`} />
              <span>{t.navLiveTracking}</span>
              {activeDeliveriesCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-black text-amber-950 bg-amber-400 rounded-full animate-pulse shadow-xs">
                  {activeDeliveriesCount}
                </span>
              )}
            </button>

            <button
              id="nav-dashboard-tab"
              onClick={() => {
                if (!currentUser && onRequireAuth) {
                  onRequireAuth();
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                  : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
              }`}
            >
              <LayoutDashboard className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-amber-600 stroke-[2.4]' : 'text-zinc-500'}`} />
              <span>{currentUser ? t.navMyOrders : t.navSenderAccount}</span>
            </button>

            <button
              id="nav-driver-tab"
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'driver'
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]'
                  : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
              }`}
            >
              <Truck className={`w-3.5 h-3.5 ${activeTab === 'driver' ? 'text-amber-700 stroke-[2.4]' : 'text-zinc-500'}`} />
              <span>{t.navDriverTerminal}</span>
            </button>

            <button
              id="nav-stations-tab"
              onClick={() => setActiveTab('stations')}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'stations'
                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                  : 'bg-white text-zinc-700 font-semibold border border-zinc-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:border-zinc-300'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${activeTab === 'stations' ? 'text-amber-600 stroke-[2.4]' : 'text-zinc-500'}`} />
              <span>{t.navTaxiHubs}</span>
            </button>
          </nav>

          {/* Right Action Bar: Minimal Letters Language Switcher, Driver Register CTA, Auth & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Minimal Letter Symbols Language Switcher */}
            <div 
              id="language-letter-switcher"
              className="flex items-center p-0.5 bg-zinc-100 border border-zinc-200/90 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
              title={t.changeLanguage}
            >
              {(['fr', 'ar', 'en'] as Language[]).map((langCode) => {
                const isActive = language === langCode;
                const label = langCode === 'fr' ? 'FR' : langCode === 'ar' ? 'عربي' : 'EN';
                return (
                  <button
                    key={langCode}
                    onClick={() => onSetLanguage(langCode)}
                    className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-zinc-200/80 scale-100'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Register as Taxi Driver Button */}
            <button
              id="nav-register-driver-btn"
              onClick={onOpenDriverRegister}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-950 border border-amber-300/90 text-xs font-extrabold shadow-[0_2px_6px_rgba(245,158,11,0.12)] hover:shadow-[0_4px_10px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
              title={t.navRegisterDriver}
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{t.navRegisterDriver}</span>
              <span className="sm:hidden text-[11px]">Drive</span>
            </button>

            {/* User Profile or Connect with explicit Logout */}
            {currentUser ? (
              <div className="relative">
                <div className="flex items-center gap-1">
                  <button 
                    id="nav-user-profile-badge"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-2 min-h-[44px] rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors cursor-pointer"
                    title={`${t.navConnectedAs} ${currentUser.name}`}
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-amber-400"
                    />
                    <span className="text-xs font-bold text-zinc-900 hidden sm:inline max-w-[90px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-500 hidden sm:inline" />
                  </button>

                  {/* Explicit Logout Icon Button for fast 1-click logout */}
                  <button
                    id="nav-logout-direct-btn"
                    onClick={() => {
                      if (onLogoutSender) onLogoutSender();
                    }}
                    title={t.navLogout}
                    className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className={`absolute mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 ${
                      isRtl ? 'left-0' : 'right-0'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <div className="text-xs font-extrabold text-zinc-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono truncate">{currentUser.phone}</div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 text-left flex items-center gap-2 cursor-pointer min-h-[40px]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                      <span>{t.navMyOrders}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenDriverRegister();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-50 text-left flex items-center gap-2 cursor-pointer min-h-[40px]"
                    >
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>{t.navRegisterDriver}</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-zinc-100">
                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          if (onLogoutSender) onLogoutSender();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left flex items-center gap-2 cursor-pointer min-h-[40px]"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{t.navLogout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-connect-sender-btn"
                onClick={() => {
                  if (onRequireAuth) onRequireAuth();
                }}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.navConnectSender}</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}

            {/* Reset Demo Button */}
            <button
              id="reset-demo-btn"
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
