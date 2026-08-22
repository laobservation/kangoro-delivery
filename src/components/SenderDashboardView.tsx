import React, { useState, useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  User, 
  FileText, 
  ChevronRight, 
  Plus, 
  X, 
  DollarSign,
  Share2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Lock,
  LogIn,
  LogOut,
  Sparkles,
  Smartphone,
  Building2,
  Mail,
  CheckCircle,
  KeyRound,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { ParcelDelivery, DeliveryStatus, PaymentMethod, TaxiDriver, SenderUser } from '../types';
import { formatCurrency, formatDate, formatTime, getStatusBadgeInfo } from '../utils/helpers';

interface SenderDashboardViewProps {
  currentUser: SenderUser | null;
  onLogin: (user: SenderUser) => void;
  onLogout: () => void;
  onRegister: (newUser: SenderUser) => void;
  availableUsers: SenderUser[];
  deliveries: ParcelDelivery[];
  onNavigateToSend: (prefillData?: Partial<ParcelDelivery>) => void;
  onNavigateToTrack: (trackingCode: string) => void;
  onOpenChat: (delivery: ParcelDelivery) => void;
}

export const SenderDashboardView: React.FC<SenderDashboardViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onRegister,
  availableUsers,
  deliveries,
  onNavigateToSend,
  onNavigateToTrack,
  onOpenChat
}) => {
  // Login Form States (when not connected)
  const [authTab, setAuthTab] = useState<'quick' | 'phone' | 'register'>('quick');
  
  // Phone OTP Flow State
  const [phoneInput, setPhoneInput] = useState('+212 6 61 22 33 44');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpValue, setSimulatedOtpValue] = useState('8832');
  const [otpError, setOtpError] = useState('');
  
  // Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('Casablanca');
  const [regAccountType, setRegAccountType] = useState<'individual' | 'business' | 'e_commerce'>('individual');
  const [regError, setRegError] = useState('');

  // Dashboard Filters & Search
  const [viewScope, setViewScope] = useState<'my' | 'all'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered' | 'awaiting_pickup' | 'cod'>('all');
  
  // Waybill / Receipt Modal
  const [activeWaybillDelivery, setActiveWaybillDelivery] = useState<ParcelDelivery | null>(null);
  
  // Copy state feedback
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(label);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  // Trigger simulated OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setOtpError('Please enter a valid phone number');
      return;
    }
    setOtpError('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtpValue(randomOtp);
    setOtpSent(true);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== simulatedOtpValue && otpCode.trim() !== '1234') {
      setOtpError(`Invalid code. Try ${simulatedOtpValue} or 1234`);
      return;
    }

    // Find if user already exists with this phone or create a clean profile
    const existing = availableUsers.find(u => u.phone.replace(/\s+/g, '') === phoneInput.replace(/\s+/g, ''));
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: SenderUser = {
        id: `user-${Date.now()}`,
        name: phoneInput.slice(-4) ? `Sender (+${phoneInput.slice(-4)})` : 'Verified Sender',
        phone: phoneInput,
        city: 'Casablanca',
        accountType: 'individual',
        joinedDate: 'Today'
      };
      onRegister(newUser);
    }
    setOtpSent(false);
    setOtpCode('');
  };

  // Register New Sender
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setRegError('Please provide your full name and phone number');
      return;
    }

    const newUser: SenderUser = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || undefined,
      city: regCity,
      accountType: regAccountType,
      joinedDate: 'Just now'
    };

    onRegister(newUser);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegError('');
  };

  // Filter deliveries based on logged in user and scope
  const senderDeliveries = useMemo(() => {
    if (!currentUser) return [];
    if (viewScope === 'all') return deliveries;

    const userPhoneClean = currentUser.phone.replace(/\D/g, '');
    const userNameLower = currentUser.name.toLowerCase().trim();

    return deliveries.filter(d => {
      const dPhoneClean = d.senderPhone.replace(/\D/g, '');
      const dNameLower = d.senderName.toLowerCase().trim();
      
      const phoneMatch = userPhoneClean.length > 5 && dPhoneClean.length > 5 && (
        userPhoneClean.includes(dPhoneClean) || dPhoneClean.includes(userPhoneClean)
      );
      const nameMatch = dNameLower.includes(userNameLower) || userNameLower.includes(dNameLower);

      return phoneMatch || nameMatch;
    });
  }, [currentUser, deliveries, viewScope]);

  // Filtered by search and status tab
  const filteredDeliveries = useMemo(() => {
    return senderDeliveries.filter(d => {
      // Status filter
      if (statusFilter === 'active') {
        if (d.status === 'delivered' || d.status === 'cancelled') return false;
      } else if (statusFilter === 'delivered') {
        if (d.status !== 'delivered') return false;
      } else if (statusFilter === 'awaiting_pickup') {
        if (d.status !== 'requested' && d.status !== 'accepted') return false;
      } else if (statusFilter === 'cod') {
        if (d.paymentMethod !== 'cash_on_delivery') return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = d.trackingCode.toLowerCase().includes(q);
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchReceiver = d.receiverName.toLowerCase().includes(q);
        const matchSender = d.senderName.toLowerCase().includes(q);
        const matchOrigin = d.originCity.toLowerCase().includes(q);
        const matchDest = d.destinationCity.toLowerCase().includes(q);
        const matchDriver = d.driver?.name.toLowerCase().includes(q);
        return matchCode || matchTitle || matchReceiver || matchSender || matchOrigin || matchDest || matchDriver;
      }

      return true;
    });
  }, [senderDeliveries, statusFilter, searchQuery]);

  // Computed metrics for the active sender
  const stats = useMemo(() => {
    const totalOrders = senderDeliveries.length;
    const activeOrders = senderDeliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled');
    const completedOrders = senderDeliveries.filter(d => d.status === 'delivered');
    const totalSpent = senderDeliveries.reduce((sum, d) => sum + d.priceTotal, 0);
    const pendingCodAmount = senderDeliveries
      .filter(d => d.paymentMethod === 'cash_on_delivery' && d.status !== 'delivered')
      .reduce((sum, d) => sum + d.priceTotal, 0);

    return {
      totalOrders,
      activeCount: activeOrders.length,
      completedCount: completedOrders.length,
      totalSpent,
      pendingCodAmount,
      activeOrders
    };
  }, [senderDeliveries]);

  // Handle re-ordering
  const handleReorder = (item: ParcelDelivery) => {
    onNavigateToSend({
      originCity: item.originCity,
      destinationCity: item.destinationCity,
      category: item.category,
      title: item.title,
      description: item.description,
      weightKg: item.weightKg,
      isFragile: item.isFragile,
      declaredValue: item.declaredValue,
      senderName: currentUser ? currentUser.name : item.senderName,
      senderPhone: currentUser ? currentUser.phone : item.senderPhone,
      receiverName: item.receiverName,
      receiverPhone: item.receiverPhone,
      receiverAddress: item.receiverAddress,
      isDoorstepPickup: item.isDoorstepPickup,
      isDoorstepDropoff: item.isDoorstepDropoff,
      paymentMethod: item.paymentMethod
    });
  };

  // --------------------------------------------------------------------------
  // RENDER 1: AUTHENTICATION / CONNECTION GATEWAY (When NOT connected)
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Hero Connection Card */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Sender Portal Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Connect to Access Your Sender Dashboard
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Sign in with your verified sender credentials to track your active packages in real-time, view dual-OTP handover security keys, and manage complete shipment records.
            </p>
          </div>

          {/* Auth Navigation Tabs */}
          <div className="flex items-center justify-center p-1 bg-zinc-100 rounded-xl max-w-md mx-auto">
            <button
              id="auth-tab-quick"
              onClick={() => setAuthTab('quick')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authTab === 'quick'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Connect</span>
            </button>

            <button
              id="auth-tab-phone"
              onClick={() => setAuthTab('phone')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authTab === 'phone'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-500" />
              <span>Phone / SMS OTP</span>
            </button>

            <button
              id="auth-tab-register"
              onClick={() => setAuthTab('register')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authTab === 'register'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-500" />
              <span>New Account</span>
            </button>
          </div>

          {/* TAB 1: ONE-CLICK QUICK PROFILES */}
          {authTab === 'quick' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-center text-xs text-zinc-500 font-medium">
                Select an existing sender account to connect instantly:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableUsers.map((user) => {
                  const userOrders = deliveries.filter(d => 
                    d.senderName.toLowerCase().includes(user.name.toLowerCase()) ||
                    user.name.toLowerCase().includes(d.senderName.toLowerCase())
                  );
                  const activeCount = userOrders.filter(d => d.status !== 'delivered' && d.status !== 'cancelled').length;

                  return (
                    <div
                      key={user.id}
                      id={`quick-login-${user.id}`}
                      onClick={() => onLogin(user)}
                      className="p-4 rounded-2xl bg-zinc-50 hover:bg-amber-50/80 border border-zinc-200 hover:border-amber-400 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                          />
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 capitalize">
                            {user.accountType?.replace('_', ' ') || 'Sender'}
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-sm text-zinc-900 group-hover:text-amber-950 line-clamp-1">
                            {user.name}
                          </div>
                          <div className="text-xs text-zinc-500 font-mono mt-0.5">
                            {user.phone}
                          </div>
                          <div className="text-[11px] text-zinc-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            <span>{user.city || 'Casablanca'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-600">
                          {userOrders.length} parcel{userOrders.length === 1 ? '' : 's'}
                          {activeCount > 0 && ` (${activeCount} live)`}
                        </span>
                        <span className="text-amber-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Connect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PHONE / SMS OTP SIGN IN */}
          {authTab === 'phone' && (
            <div className="max-w-md mx-auto space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Grand Taxi SMS)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+212 6 61 00 00 00"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Enter your mobile number to receive a 4-digit verification code.
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="send-otp-btn"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Simulated SMS banner notification */}
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                        SMS Code Received
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300">
                        Code: <strong>{simulatedOtpValue}</strong>
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      [KANGORO] Your 4-digit login pin is <strong>{simulatedOtpValue}</strong> (or use demo code 1234).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Enter 4-Digit Verification PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder={`Enter ${simulatedOtpValue}`}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                      {otpError}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="py-3 px-4 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      Change Phone
                    </button>
                    <button
                      type="submit"
                      id="verify-otp-btn"
                      className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Verify & Enter Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER NEW SENDER */}
          {authTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Full Name / Company Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Youssef El Mansouri or Atlas Commerce"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Base City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    >
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Tangier">Tangier</option>
                      <option value="Fes">Fes</option>
                      <option value="Agadir">Agadir</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="youssef@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Sender Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'individual', label: 'Individual' },
                    { id: 'business', label: 'Business / Law' },
                    { id: 'e_commerce', label: 'E-Commerce' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRegAccountType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        regAccountType === t.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {regError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                id="register-sender-btn"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Create Account & Enter Dashboard</span>
              </button>
            </form>
          )}

          {/* Bottom Security Promises */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-100 text-xs text-zinc-600">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block">Dual OTP Handover</strong>
                <span>PIN-locked security for both pickup and recipient dropoff.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block">Live Highway Radar</strong>
                <span>Real-time GPS tracking along intercity taxi corridors.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block">Official Waybills</strong>
                <span>Instant PDF receipts and complete transit audit history.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 2: SENDER DASHBOARD (When CONNECTED)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Active Connected Sender Profile */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* User Info Bar */}
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {currentUser.accountType ? currentUser.accountType.replace('_', ' ').toUpperCase() : 'SENDER'}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Connected Session
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                {currentUser.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium flex-wrap">
                <span className="font-mono text-zinc-700">{currentUser.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {currentUser.city || 'Casablanca Hub'}
                </span>
                {currentUser.email && (
                  <>
                    <span>•</span>
                    <span className="text-zinc-600">{currentUser.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons & Scope Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Scope Toggle */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewScope('my')}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  viewScope === 'my'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                My Orders ({senderDeliveries.length})
              </button>
              <button
                onClick={() => setViewScope('all')}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  viewScope === 'all'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                All Network ({deliveries.length})
              </button>
            </div>

            <button
              id="dash-send-new-btn"
              onClick={() => onNavigateToSend({
                senderName: currentUser.name,
                senderPhone: currentUser.phone
              })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Send New Parcel</span>
            </button>

            <button
              id="dash-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Disconnect sender session"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-500" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-100">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-xs font-semibold">Total Dispatched</span>
              <Package className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-black text-zinc-900">{stats.totalOrders}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {viewScope === 'my' ? 'Your personal shipments' : 'Total system parcels'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-xs font-semibold">Active In-Transit</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div className="text-2xl font-black text-amber-950">{stats.activeCount}</div>
            <div className="text-xs text-amber-700 mt-1">Live tracking on highway</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 mb-1">
              <span className="text-xs font-semibold">Delivered & Verified</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950">{stats.completedCount}</div>
            <div className="text-xs text-emerald-700 mt-1">100% Dual-OTP verified</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between text-blue-800 mb-1">
              <span className="text-xs font-semibold">Delivery Expenses</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-950">{formatCurrency(stats.totalSpent)}</div>
            <div className="text-xs text-blue-700 mt-1">
              {stats.pendingCodAmount > 0 ? `${formatCurrency(stats.pendingCodAmount)} COD Pending` : 'All settled'}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Active Shipments Monitor (High-Visibility Cards) */}
      {stats.activeCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
                Active Shipments ({stats.activeCount})
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-medium">Live Highway Expressway Status</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats.activeOrders.map(delivery => {
              const badge = getStatusBadgeInfo(delivery.status);
              return (
                <div 
                  key={delivery.id}
                  id={`active-card-${delivery.trackingCode}`}
                  className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-zinc-900 text-white px-2.5 py-1 rounded-md">
                        {delivery.trackingCode}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                        {badge.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                      {formatCurrency(delivery.priceTotal)} • {delivery.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Prepaid'}
                    </span>
                  </div>

                  {/* Route & Title */}
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 line-clamp-1">{delivery.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 mt-1">
                      <span className="text-zinc-900 font-bold">{delivery.originCity}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-zinc-900 font-bold">{delivery.destinationCity}</span>
                      <span className="text-zinc-400">•</span>
                      <span>{delivery.weightKg} kg</span>
                    </div>
                  </div>

                  {/* Live Progress Stage */}
                  <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-medium text-zinc-700">Live Telemetry:</span>
                      <span className="font-semibold text-amber-700">{delivery.currentLocationDescription || 'En route via Grand Taxi'}</span>
                    </div>

                    {/* Stage Bar */}
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                        style={{
                          width: 
                            delivery.status === 'requested' ? '15%' :
                            delivery.status === 'accepted' ? '30%' :
                            delivery.status === 'picked_up' ? '50%' :
                            delivery.status === 'in_transit' ? '75%' :
                            delivery.status === 'arrived_at_station' ? '90%' : '100%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Security OTPs Box */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Pickup OTP */}
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold mb-1">
                        <span>Pickup OTP (Give to Driver)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-lg text-amber-950 tracking-wider">
                          {delivery.pickupOtp}
                        </span>
                        <button
                          onClick={() => handleCopy(delivery.pickupOtp, `pickup-${delivery.id}`)}
                          className="p-1.5 hover:bg-amber-200/60 rounded-md text-amber-900 transition-colors cursor-pointer"
                          title="Copy Pickup OTP"
                        >
                          {copiedOtp === `pickup-${delivery.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Delivery OTP */}
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold mb-1">
                        <span>Delivery OTP (For Recipient)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-lg text-emerald-950 tracking-wider">
                          {delivery.deliveryOtp}
                        </span>
                        <button
                          onClick={() => handleCopy(delivery.deliveryOtp, `deliv-${delivery.id}`)}
                          className="p-1.5 hover:bg-emerald-200/60 rounded-md text-emerald-900 transition-colors cursor-pointer"
                          title="Copy Delivery OTP"
                        >
                          {copiedOtp === `deliv-${delivery.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Actions Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs">
                    {delivery.driver ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={delivery.driver.avatar}
                          alt={delivery.driver.name}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <span className="font-bold text-zinc-900">{delivery.driver.name}</span>
                          <span className="text-zinc-500 ml-1">({delivery.driver.vehiclePlate})</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Matching driver at terminal...</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenChat(delivery)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() => onNavigateToTrack(delivery.trackingCode)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors cursor-pointer"
                      >
                        <span>Live Radar</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: Complete Orders & History Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
                Shipment History & Official Waybills
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Showing {filteredDeliveries.length} parcel{filteredDeliveries.length === 1 ? '' : 's'}
                {viewScope === 'my' && ` for ${currentUser.name}`}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tracking #, city, contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Orders ({senderDeliveries.length})
            </button>

            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Active In-Transit ({stats.activeCount})
            </button>

            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'delivered'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Delivered ({stats.completedCount})
            </button>

            <button
              onClick={() => setStatusFilter('awaiting_pickup')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'awaiting_pickup'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Awaiting Handover
            </button>

            <button
              onClick={() => setStatusFilter('cod')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'cod'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Cash on Delivery (COD)
            </button>
          </div>
        </div>

        {/* Deliveries List */}
        {filteredDeliveries.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <Package className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-zinc-800">No shipments found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No orders matched your current filters. Ready to send a new parcel via Grand Taxi?
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <button
                onClick={() => onNavigateToSend({
                  senderName: currentUser.name,
                  senderPhone: currentUser.phone
                })}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Send First Parcel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            {filteredDeliveries.map((item) => {
              const badge = getStatusBadgeInfo(item.status);
              return (
                <div 
                  key={item.id}
                  id={`history-row-${item.trackingCode}`}
                  className="p-5 hover:bg-zinc-50/80 transition-colors space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left: Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-extrabold text-sm text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {item.trackingCode}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-zinc-900">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-zinc-600 flex-wrap">
                        <span className="font-semibold text-zinc-900">{item.originCity}</span>
                        <span className="text-zinc-400">({item.originStation})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-semibold text-zinc-900">{item.destinationCity}</span>
                        <span className="text-zinc-400">({item.destinationStation})</span>
                      </div>
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                      <div className="text-left md:text-right">
                        <div className="font-mono font-bold text-base text-zinc-900">
                          {formatCurrency(item.priceTotal)}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {item.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : item.paymentMethod === 'cash_on_pickup' ? 'Cash on Pickup' : 'Prepaid Digital'}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveWaybillDelivery(item)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                          title="View Digital Waybill & Receipt"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Waybill</span>
                        </button>

                        <button
                          onClick={() => onNavigateToTrack(item.trackingCode)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white transition-colors cursor-pointer"
                          title="Track Parcel"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Track</span>
                        </button>

                        <button
                          onClick={() => handleReorder(item)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors cursor-pointer"
                          title="Re-order with same route & recipient"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Send Again</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Mini Meta Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-zinc-50/70 p-2.5 rounded-lg text-zinc-600 border border-zinc-100">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <span className="text-zinc-500">Sender: </span>
                        <span className="font-semibold text-zinc-800">{item.senderName} ({item.senderPhone})</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Recipient: </span>
                        <span className="font-semibold text-zinc-800">{item.receiverName} ({item.receiverPhone})</span>
                      </div>
                      {item.driver && (
                        <div>
                          <span className="text-zinc-500">Driver: </span>
                          <span className="font-semibold text-zinc-800">{item.driver.name} ({item.driver.vehiclePlate})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-700">
                        Pickup OTP: <strong className="text-zinc-900">{item.pickupOtp}</strong>
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-700">
                        Delivery OTP: <strong className="text-zinc-900">{item.deliveryOtp}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: Quick Re-order Corridors & Address Book */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Intercity Routes */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Frequent Express Corridors</span>
            </h3>
            <span className="text-xs text-zinc-500">1-Tap Fast Booking</span>
          </div>

          <div className="space-y-2">
            {[
              { from: 'Casablanca', to: 'Rabat', time: '~1h 15m', tag: 'High Frequency' },
              { from: 'Rabat', to: 'Tangier', time: '~2h 30m', tag: 'Coastal Corridor' },
              { from: 'Casablanca', to: 'Marrakech', time: '~2h 45m', tag: 'South Express' }
            ].map(r => (
              <div 
                key={`${r.from}-${r.to}`}
                onClick={() => onNavigateToSend({ 
                  originCity: r.from, 
                  destinationCity: r.to,
                  senderName: currentUser.name,
                  senderPhone: currentUser.phone
                })}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-amber-50/70 border border-zinc-200 hover:border-amber-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="font-bold text-sm text-zinc-900">
                    {r.from} <span className="text-zinc-400 font-normal">➔</span> {r.to}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                    {r.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-600 group-hover:text-amber-900 font-semibold">
                  <span>{r.time}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Dual-OTP Guidelines */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">KANGORO Dual-OTP Protection Protocol</h3>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Your sender dashboard connects directly to taxi relay dispatches. Every parcel transaction is secured by two independent cryptographic PINs:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                1
              </span>
              <p className="text-zinc-300">
                <strong className="text-white">Pickup OTP:</strong> Keep private until you physically meet the taxi driver at the departure terminal.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                2
              </span>
              <p className="text-zinc-300">
                <strong className="text-white">Delivery OTP:</strong> Share with the destination recipient. Driver escrow is released upon confirmation.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span>24/7 Grand Taxi Dispatch Center</span>
            <span className="text-amber-400 font-bold">+212 5 22 00 11 22</span>
          </div>
        </div>
      </div>

      {/* WAYBILL & RECEIPT MODAL */}
      {activeWaybillDelivery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-zinc-950">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Official Courier Waybill & Receipt</h3>
                  <p className="text-xs text-zinc-500">KANGORO DELIVERY • Express Intercity Network</p>
                </div>
              </div>

              <button
                onClick={() => setActiveWaybillDelivery(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Waybill Sheet */}
            <div id="printable-waybill" className="border border-zinc-300 rounded-xl p-5 sm:p-6 bg-zinc-50/50 space-y-6">
              {/* Waybill Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tracking Code</span>
                  <div className="font-mono text-xl font-black text-zinc-900">{activeWaybillDelivery.trackingCode}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Created: {formatDate(activeWaybillDelivery.createdAt)}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Delivery Fee</span>
                  <div className="font-mono text-xl font-black text-emerald-700">{formatCurrency(activeWaybillDelivery.priceTotal)}</div>
                  <div className="text-xs font-bold text-zinc-700 uppercase">{activeWaybillDelivery.paymentMethod.replace(/_/g, ' ')}</div>
                </div>
              </div>

              {/* Route Spec */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-zinc-200 text-xs">
                <div>
                  <span className="text-zinc-400 font-bold uppercase text-[10px]">Origin Station (Departure)</span>
                  <div className="font-bold text-zinc-900 text-sm mt-0.5">{activeWaybillDelivery.originCity}</div>
                  <div className="text-zinc-600">{activeWaybillDelivery.originStation}</div>
                  <div className="text-zinc-500 mt-1">Sender: {activeWaybillDelivery.senderName} ({activeWaybillDelivery.senderPhone})</div>
                </div>

                <div>
                  <span className="text-zinc-400 font-bold uppercase text-[10px]">Destination Station (Arrival)</span>
                  <div className="font-bold text-zinc-900 text-sm mt-0.5">{activeWaybillDelivery.destinationCity}</div>
                  <div className="text-zinc-600">{activeWaybillDelivery.destinationStation}</div>
                  <div className="text-zinc-500 mt-1">Recipient: {activeWaybillDelivery.receiverName} ({activeWaybillDelivery.receiverPhone})</div>
                </div>
              </div>

              {/* Cargo Specs */}
              <div className="space-y-2 text-xs">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Parcel Specifications</span>
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-zinc-500 block">Category</span>
                    <strong className="text-zinc-900 capitalize">{activeWaybillDelivery.category}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Weight</span>
                    <strong className="text-zinc-900">{activeWaybillDelivery.weightKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Fragility</span>
                    <strong className="text-zinc-900">{activeWaybillDelivery.isFragile ? 'Fragile' : 'Standard'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Declared Val.</span>
                    <strong className="text-zinc-900">${activeWaybillDelivery.declaredValue || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Driver Assignment & Vehicle */}
              {activeWaybillDelivery.driver && (
                <div className="bg-white p-4 rounded-xl border border-zinc-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-zinc-400 font-bold uppercase text-[10px]">Assigned Grand Taxi Courier</span>
                    <div className="font-bold text-zinc-900 text-sm mt-0.5">{activeWaybillDelivery.driver.name}</div>
                    <div className="text-zinc-600">{activeWaybillDelivery.driver.vehicleModel} • {activeWaybillDelivery.driver.vehiclePlate}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block">Driver Contact</span>
                    <span className="font-mono font-bold text-zinc-900">{activeWaybillDelivery.driver.phone}</span>
                  </div>
                </div>
              )}

              {/* Status Audit Log */}
              <div className="space-y-2 text-xs">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Journey Audit Log</span>
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 space-y-2">
                  {activeWaybillDelivery.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start justify-between text-[11px] border-b border-zinc-100 last:border-0 pb-1.5 last:pb-0">
                      <div>
                        <strong className="text-zinc-900 capitalize">{h.status.replace(/_/g, ' ')}</strong>
                        <p className="text-zinc-600">{h.description}</p>
                      </div>
                      <span className="text-zinc-400 text-[10px] whitespace-nowrap ml-2">
                        {formatDate(h.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-xs font-bold text-zinc-800 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Waybill</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const shareText = `KANGORO Delivery - Parcel Tracking: ${activeWaybillDelivery.trackingCode}\nRoute: ${activeWaybillDelivery.originCity} -> ${activeWaybillDelivery.destinationCity}\nDelivery OTP: ${activeWaybillDelivery.deliveryOtp}`;
                    navigator.clipboard.writeText(shareText);
                    setCopiedOtp('share-all');
                    setTimeout(() => setCopiedOtp(null), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedOtp === 'share-all' ? 'Copied to Clipboard!' : 'Share Waybill Info'}</span>
                </button>

                <button
                  onClick={() => {
                    const code = activeWaybillDelivery.trackingCode;
                    setActiveWaybillDelivery(null);
                    onNavigateToTrack(code);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Track Live Radar</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
