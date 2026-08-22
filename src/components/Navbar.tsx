import React from 'react';
import { Package, Truck, Compass, Building2, ShieldCheck, RefreshCw, LayoutDashboard, User, LogIn, LogOut, CheckCircle } from 'lucide-react';
import { SenderUser } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations';
  setActiveTab: (tab: 'dashboard' | 'send' | 'track' | 'driver' | 'stations') => void;
  activeDeliveriesCount: number;
  onResetData: () => void;
  currentUser?: SenderUser | null;
  onLogoutSender?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDeliveriesCount,
  onResetData,
  currentUser,
  onLogoutSender
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-inner shadow-amber-300">
              <Truck className="w-5 h-5 text-zinc-950 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-zinc-900 tracking-tight">KANGORO</span>
                <span className="text-xs uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  DELIVERY
                </span>
              </div>
              <p className="text-xs text-zinc-700 hidden sm:block">Fast City-to-City Parcel Delivery by Taxi</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-dashboard-tab"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Sender Dashboard</span>
            </button>

            <button
              id="nav-send-tab"
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'send'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Send Parcel</span>
            </button>

            <button
              id="nav-track-tab"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Live Tracking</span>
              {activeDeliveriesCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-amber-950 bg-amber-400 rounded-full animate-pulse">
                  {activeDeliveriesCount}
                </span>
              )}
            </button>

            <button
              id="nav-driver-tab"
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'driver'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Driver Terminal</span>
            </button>

            <button
              id="nav-stations-tab"
              onClick={() => setActiveTab('stations')}
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'stations'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Taxi Hubs</span>
            </button>
          </nav>

          {/* Right Action: Connected Sender Pill / Connect Button */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div 
                id="nav-user-profile-badge"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors cursor-pointer"
                title={`Connected as ${currentUser.name} (${currentUser.phone})`}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-amber-300"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-zinc-900 leading-tight line-clamp-1 max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Connected
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="nav-connect-sender-btn"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Connect Sender</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            <button
              id="reset-demo-btn"
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

