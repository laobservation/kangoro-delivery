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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languagesConfig: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('send')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-inner shadow-amber-300 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-zinc-950 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-zinc-900 tracking-tight">{t.brandName}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 hidden sm:inline-block">
                  EXPRESS
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 hidden md:block">{t.brandTagline}</p>
            </div>
          </div>

          {/* Center Navigation Tabs - Home First */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            <button
              id="nav-send-tab"
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'send'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navHomeSend}</span>
            </button>

            <button
              id="nav-track-tab"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.navLiveTracking}</span>
              {activeDeliveriesCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-black text-amber-950 bg-amber-400 rounded-full animate-pulse">
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{currentUser ? t.navMyOrders : t.navSenderAccount}</span>
            </button>

            <button
              id="nav-driver-tab"
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'driver'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs font-black'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.navDriverTerminal}</span>
            </button>

            <button
              id="nav-stations-tab"
              onClick={() => setActiveTab('stations')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stations'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.navTaxiHubs}</span>
            </button>
          </nav>

          {/* Right Action Bar: Language Switcher, Driver Register CTA, Auth & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-bold text-zinc-800 transition-colors cursor-pointer"
                title={t.changeLanguage}
              >
                <span>{languagesConfig.find(l => l.code === language)?.flag}</span>
                <span className="uppercase text-[11px] font-extrabold">{language}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {isLangMenuOpen && (
                <div 
                  className={`absolute mt-1.5 w-32 bg-white rounded-2xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in zoom-in-95 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {t.changeLanguage}
                  </div>
                  {languagesConfig.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        onSetLanguage(item.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                        language === item.code 
                          ? 'bg-amber-50 text-amber-900' 
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {language === item.code && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Register as Taxi Driver Button */}
            <button
              id="nav-register-driver-btn"
              onClick={onOpenDriverRegister}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
              title={t.navRegisterDriver}
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-800" />
              <span>{t.navRegisterDriver}</span>
            </button>

            {/* User Profile or Connect with explicit Logout */}
            {currentUser ? (
              <div className="relative">
                <div className="flex items-center gap-1">
                  <button 
                    id="nav-user-profile-badge"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors cursor-pointer"
                    title={`${t.navConnectedAs} ${currentUser.name}`}
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-lg object-cover border border-amber-400"
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
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className={`absolute mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 ${
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
                      className="w-full px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{t.navMyOrders}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenDriverRegister();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.navRegisterDriver}</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-zinc-100">
                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          if (onLogoutSender) onLogoutSender();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
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
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-zinc-200 py-1 px-2">
        <button
          onClick={() => setActiveTab('send')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'send' ? 'text-amber-600' : 'text-zinc-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{t.navHomeSend.split('/')[0]}</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold relative ${
            activeTab === 'track' ? 'text-amber-600' : 'text-zinc-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.navLiveTracking}</span>
          {activeDeliveriesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => {
            if (!currentUser && onRequireAuth) {
              onRequireAuth();
            } else {
              setActiveTab('dashboard');
            }
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-amber-600' : 'text-zinc-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{currentUser ? t.navMyOrders : t.navSenderAccount}</span>
        </button>

        <button
          onClick={() => setActiveTab('driver')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'driver' ? 'text-amber-600 font-black' : 'text-zinc-500'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.navDriverTerminal.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );
};
