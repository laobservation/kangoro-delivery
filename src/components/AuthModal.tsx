import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import { SenderUser } from '../types';
import { KANGORO_LOGO_URL } from '../constants';

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
  onSuccessCallback
}) => {
  // Register state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'e_commerce'>('individual');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Compact Header */}
        <div className="px-5 py-4 bg-zinc-950 text-white relative flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white flex items-center justify-center shadow-xs">
              <img
                src={KANGORO_LOGO_URL}
                alt="KANGORO DELIVERY"
                referrerPolicy="no-referrer"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Create New Account</span>
                <span className="p-0.5 rounded-full bg-amber-400/20 text-amber-300">
                  <Lock className="w-3 h-3" />
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Quick 1-step sender registration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Compact Form Body */}
        <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Full Name / Business *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amine Benjelloun"
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Mobile Phone & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Mobile Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Base City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Fes">Fes</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Meknes">Meknes</option>
                  <option value="Oujda">Oujda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Email (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amine@example.com"
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Account Type - Airbnb Style Pills */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'individual', label: 'Individual', icon: '👤' },
                { id: 'business', label: 'Business', icon: '🏢' },
                { id: 'e_commerce', label: 'E-Com', icon: '🛍️' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAccountType(t.id as any)}
                  className={`py-1.5 px-2 rounded-full border text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    accountType === t.id
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <span className="text-[10px]">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="auth-modal-submit-register"
              className="w-full py-2.5 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-zinc-950" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Security note */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Secure dual-OTP tracking dispatched with all orders.</span>
          </div>
        </form>

      </div>
    </div>
  );
};
