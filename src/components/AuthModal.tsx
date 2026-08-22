import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  KeyRound,
  Lock
} from 'lucide-react';
import { SenderUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (newUser: SenderUser) => void;
  onLogin: (user: SenderUser) => void;
  availableUsers: SenderUser[];
  onSuccessCallback?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onLogin,
  availableUsers,
  onSuccessCallback
}) => {
  const [tab, setTab] = useState<'register' | 'quick' | 'phone'>('register');

  // Register state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'e_commerce'>('individual');
  const [error, setError] = useState('');

  // Phone OTP state
  const [phoneInput, setPhoneInput] = useState('+212 6 61 22 33 44');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('7721');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name or business name');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile phone number');
      return;
    }

    const newUser: SenderUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city,
      accountType,
      joinedDate: 'Today'
    };

    onRegister(newUser);
    if (onSuccessCallback) onSuccessCallback();
    onClose();
  };

  const handleQuickLogin = (user: SenderUser) => {
    onLogin(user);
    if (onSuccessCallback) onSuccessCallback();
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setError('Please enter a phone number');
      return;
    }
    setError('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== simulatedOtp && otpCode.trim() !== '1234') {
      setError(`Invalid code. Enter ${simulatedOtp} or 1234`);
      return;
    }

    const existing = availableUsers.find(u => u.phone.replace(/\s+/g, '') === phoneInput.replace(/\s+/g, ''));
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: SenderUser = {
        id: `user-${Date.now()}`,
        name: `Sender (${phoneInput.slice(-4) || 'VIP'})`,
        phone: phoneInput,
        city: 'Casablanca',
        accountType: 'individual',
        joinedDate: 'Today'
      };
      onRegister(newUser);
    }

    if (onSuccessCallback) onSuccessCallback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-1 rounded-xl bg-white flex items-center justify-center shadow-xs">
              <img
                src="/logo.png"
                alt="KANGORO DELIVERY"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Sender Authentication</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Create Account to Send Parcel
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Create your verified sender profile to book Grand Taxi drivers, manage luggage trunk slots, and get real-time dual-OTP handover PINs.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 p-1.5 gap-1 text-xs font-bold">
          <button
            id="auth-modal-tab-register"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Create New Account</span>
          </button>

          <button
            id="auth-modal-tab-quick"
            onClick={() => { setTab('quick'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'quick'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Connect</span>
          </button>

          <button
            id="auth-modal-tab-phone"
            onClick={() => { setTab('phone'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'phone'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-500" />
            <span>SMS Login</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* TAB 1: CREATE ACCOUNT */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Full Name / Business Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amine Benjelloun or Atlas Spares"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Mobile Phone (+212) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Your Base City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amine@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Account Type
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
                      onClick={() => setAccountType(t.id as any)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        accountType === t.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="auth-modal-submit-register"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-zinc-950" />
                  <span>Create Account & Continue to Parcel Dispatch</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: 1-CLICK SELECT */}
          {tab === 'quick' && (
            <div className="space-y-3">
              <div className="text-xs text-zinc-600 font-medium">
                Choose a pre-registered demo account to connect instantly:
              </div>

              <div className="space-y-2.5">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    id={`auth-modal-quick-${user.id}`}
                    onClick={() => handleQuickLogin(user)}
                    className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-amber-50 border border-zinc-200 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                      />
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm text-zinc-900 group-hover:text-amber-950">
                          {user.name}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {user.phone} • {user.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PHONE SMS OTP */}
          {tab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+212 6..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Send SMS Security PIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-0.5">
                    <div className="font-bold flex items-center justify-between">
                      <span>SMS Code Sent!</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                        PIN: {simulatedOtp}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Use code <strong>{simulatedOtp}</strong> (or 1234).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Enter 4-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder={simulatedOtp}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-center text-base font-mono font-bold tracking-widest text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-hidden"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="py-2.5 px-3 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verify & Continue</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Security note */}
          <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dual-OTP verification keys are securely dispatched for all shipments.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
