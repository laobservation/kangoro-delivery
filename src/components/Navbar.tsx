import React, { useState, useRef, useEffect } from 'react';
import { 
  Truck, 
  Compass, 
  Building2, 
  User, 
  LogOut, 
  Home,
  ChevronDown,
  Globe,
  Check
} from 'lucide-react';
import { SenderUser, TaxiDriver } from '../types';
import { Language, translations } from '../utils/i18n';
import { KANGORO_LOGO_URL } from '../constants';

const LANGUAGE_OPTIONS: { code: Language; label: string; full: string; flag: string }[] = [
  { code: 'fr', label: 'FR', full: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'عربي', full: 'العربية', flag: '🇲🇦' },
];

interface NavbarProps {
  activeTab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations';
  setActiveTab: (tab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations') => void;
  activeDeliveriesCount: number;
  currentUser?: SenderUser | null;
  currentDriver?: TaxiDriver | null;
  onLogoutSender?: () => void;
  onLogoutDriver?: () => void;
  onRequireAuth?: () => void;
  onOpenDriverLogin?: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onOpenDriverRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDeliveriesCount,
  currentUser,
  currentDriver,
  onLogoutSender,
  onLogoutDriver,
  onRequireAuth,
  onOpenDriverLogin,
  language,
  onSetLanguage,
  onOpenDriverRegister
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentLangOption = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="relative bg-white border-b border-zinc-200 shadow-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
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
              className="h-13 sm:h-15 md:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Center Navigation Tabs (3 Primary Options: Send, Track, Hubs) */}
          <nav className="hidden md:flex items-center gap-2.5 sm:gap-3">
            <button
              id="nav-send-tab"
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'send'
                  ? 'bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                  : 'bg-white text-zinc-700 font-bold border border-zinc-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-zinc-300 hover:text-zinc-950'
              }`}
            >
              <Home className={`w-4.5 h-4.5 ${activeTab === 'send' ? 'text-amber-600 stroke-[2.6]' : 'text-zinc-500 stroke-[2.2]'}`} />
              <span>{t.navHomeSend}</span>
            </button>

            <button
              id="nav-track-tab"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 relative cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                  : 'bg-white text-zinc-700 font-bold border border-zinc-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-zinc-300 hover:text-zinc-950'
              }`}
            >
              <Compass className={`w-4.5 h-4.5 ${activeTab === 'track' ? 'text-amber-600 stroke-[2.6]' : 'text-zinc-500 stroke-[2.2]'}`} />
              <span>{t.navLiveTracking}</span>
              {activeDeliveriesCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-black text-amber-950 bg-amber-400 rounded-full animate-pulse shadow-xs">
                  {activeDeliveriesCount}
                </span>
              )}
            </button>

            {/* ONLY DISPLAY DRIVER TERMINAL TAB WHEN CHAUFFEUR IS CONNECTED */}
            {currentDriver && (
              <button
                id="nav-driver-tab"
                onClick={() => setActiveTab('driver')}
                className={`flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'driver'
                    ? 'bg-amber-100 text-amber-950 font-extrabold border-2 border-amber-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                    : 'bg-white text-zinc-700 font-bold border border-zinc-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-zinc-300 hover:text-zinc-950'
                }`}
              >
                <Truck className={`w-4.5 h-4.5 ${activeTab === 'driver' ? 'text-amber-700 stroke-[2.6]' : 'text-zinc-500 stroke-[2.2]'}`} />
                <span>{t.navDriverTerminal}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            <button
              id="nav-stations-tab"
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-2 px-4.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'stations'
                  ? 'bg-zinc-100 text-zinc-950 font-extrabold border-2 border-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                  : 'bg-white text-zinc-700 font-bold border border-zinc-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-zinc-300 hover:text-zinc-950'
              }`}
            >
              <Building2 className={`w-4.5 h-4.5 ${activeTab === 'stations' ? 'text-amber-600 stroke-[2.6]' : 'text-zinc-500 stroke-[2.2]'}`} />
              <span>{t.navTaxiHubs}</span>
            </button>
          </nav>

          {/* Right Action Bar: Minimal Letters Language Switcher, Driver Access, Auth & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Dropdown Selector (Shows ONLY selected language; dropdown on click) */}
            <div className="relative" ref={langMenuRef}>
              <button
                id="language-dropdown-trigger"
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200/90 text-xs sm:text-sm font-black text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-zinc-300 transition-all cursor-pointer min-h-[44px]"
                title={t.changeLanguage}
                aria-label={t.changeLanguage}
                aria-expanded={isLangMenuOpen}
              >
                <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold tracking-wide">{currentLangOption.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180 text-zinc-700' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div
                  id="language-dropdown-menu"
                  className={`absolute mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in zoom-in-95 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = language === opt.code;
                    return (
                      <button
                        key={opt.code}
                        onClick={() => {
                          onSetLanguage(opt.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-950 font-black'
                            : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{opt.flag}</span>
                          <span>{opt.full}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chauffeur Connection State or Login Trigger - Pure Icon Button */}
            {currentDriver ? (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-300/80 p-1 rounded-full shadow-xs">
                <button
                  onClick={() => setActiveTab('driver')}
                  className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 shrink-0 cursor-pointer"
                  title={`Chauffeur: ${currentDriver.name}`}
                  aria-label={`Chauffeur: ${currentDriver.name}`}
                >
                  <img
                    src={currentDriver.avatar}
                    alt={currentDriver.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  id="nav-driver-logout-btn"
                  onClick={() => {
                    if (onLogoutDriver) onLogoutDriver();
                    setActiveTab('send');
                  }}
                  title="Disconnect Chauffeur"
                  aria-label="Disconnect Chauffeur"
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-open-driver-login-btn"
                onClick={onOpenDriverLogin}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-amber-50 text-amber-600 border border-amber-300/90 shadow-[0_2px_8px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex items-center justify-center transition-all cursor-pointer"
                title="Chauffeur Terminal"
                aria-label="Chauffeur Terminal"
              >
                <Truck className="w-5.5 h-5.5 text-amber-600" />
              </button>
            )}

            {/* Sender Profile - Pure Icon Button */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  id="nav-user-profile-badge"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full overflow-hidden border-2 border-amber-400 shadow-xs hover:ring-2 hover:ring-amber-300 transition-all cursor-pointer flex items-center justify-center"
                  title={`${t.navConnectedAs} ${currentUser.name}`}
                  aria-label={`${t.navConnectedAs} ${currentUser.name}`}
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>

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
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-zinc-950 hover:bg-zinc-800 text-amber-400 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center transition-all cursor-pointer"
                title={t.navConnectSender}
                aria-label={t.navConnectSender}
              >
                <User className="w-5.5 h-5.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
