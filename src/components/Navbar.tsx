import React from 'react';
import { Package, Truck, Compass, Building2, ShieldCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'send' | 'track' | 'driver' | 'stations';
  setActiveTab: (tab: 'send' | 'track' | 'driver' | 'stations') => void;
  activeDeliveriesCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDeliveriesCount,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('send')}
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
              id="nav-send-tab"
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
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
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'stations'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Taxi Hubs</span>
            </button>
          </nav>

          {/* Right Action: Verified Badge & Reset */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OTP Handover Protected</span>
            </div>

            <button
              id="reset-demo-btn"
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
