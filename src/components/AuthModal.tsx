import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle, 
  ShieldCheck, 
  Lock,
  LogIn
} from 'lucide-react';
import { SenderUser } from '../types';
import { KANGORO_LOGO_URL } from '../constants';
import { Language } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (newUser: SenderUser) => void;
  onLogin: (user: SenderUser) => void;
  availableUsers: SenderUser[];
  initialMode?: 'register' | 'login';
  onSuccessCallback?: () => void;
  language?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onLogin,
  availableUsers,
  initialMode = 'register',
  onSuccessCallback,
  language = 'fr'
}) => {
  const isRtl = language === 'ar';
  const [authMode, setAuthMode] = useState<'register' | 'login'>(initialMode);

  // Register form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'e_commerce'>('individual');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isRtl ? 'يرجى إدخال اسمك الكامل' : 'Veuillez saisir votre nom complet');
      return;
    }
    if (!phone.trim()) {
      setError(isRtl ? 'يرجى إدخال رقم الهاتف' : 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    const newUser: SenderUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city,
      accountType,
      joinedDate: isRtl ? 'اليوم' : 'Aujourd’hui'
    };

    onRegister(newUser);
    if (onSuccessCallback) onSuccessCallback();
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      setError(isRtl ? 'يرجى إدخال رقم الهاتف' : 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    const cleanInput = loginPhone.replace(/[\s+-]/g, '');
    const matched = availableUsers.find(u => u.phone.replace(/[\s+-]/g, '').includes(cleanInput) || cleanInput.includes(u.phone.replace(/[\s+-]/g, '')));

    if (matched) {
      onLogin(matched);
    } else {
      const connectedUser: SenderUser = {
        id: `user-${Date.now()}`,
        name: isRtl ? `مرسل (${loginPhone.slice(-4) || 'مستخدم'})` : `Expéditeur (${loginPhone.slice(-4) || 'Client'})`,
        phone: loginPhone.trim(),
        city: 'Casablanca',
        accountType: 'individual',
        joinedDate: isRtl ? 'اليوم' : 'Aujourd’hui'
      };
      onRegister(connectedUser);
    }

    if (onSuccessCallback) onSuccessCallback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-950 text-white relative flex items-center justify-between border-b border-zinc-800 shrink-0">
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
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>
                  {authMode === 'register' 
                    ? (isRtl ? 'إنشاء حساب جديد' : 'Créer un Compte') 
                    : (isRtl ? 'تسجيل الدخول' : 'Connexion')}
                </span>
                <span className="p-0.5 rounded-full bg-amber-400/20 text-amber-300">
                  <Lock className="w-3 h-3" />
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {authMode === 'register' 
                  ? (isRtl ? 'سجل في 30 ثانية وابدأ الإرسال' : 'Inscription en 30 secondes') 
                  : (isRtl ? 'متابعة طرودك وإدارتها' : 'Accédez à vos commandes et suivis')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Clear Options Toggle */}
        <div className="p-3 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="auth-mode-register-btn"
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                : 'bg-white text-zinc-600 border border-zinc-200/90 shadow-[0_2px_5px_rgba(0,0,0,0.04)] hover:border-zinc-300'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>{isRtl ? 'إنشاء حساب' : 'Nouveau Compte'}</span>
          </button>

          <button
            type="button"
            id="auth-mode-login-btn"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                : 'bg-white text-zinc-600 border border-zinc-200/90 shadow-[0_2px_5px_rgba(0,0,0,0.04)] hover:border-zinc-300'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-amber-500" />
            <span>{isRtl ? 'دخول' : 'Connexion'}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* OPTION 1: CREATE NEW ACCOUNT */}
          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {isRtl ? 'الاسم الكامل أو النشاط *' : 'Nom Complet / Société *'}
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRtl ? 'مثال: أمين التازي' : 'Ex: Amine Benjelloun'}
                    className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden`}
                  />
                </div>
              </div>

              {/* Mobile Phone & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {isRtl ? 'رقم الهاتف *' : 'Téléphone Mobile *'}
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6..."
                      className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {isRtl ? 'المدينة *' : 'Ville *'}
                  </label>
                  <div className="relative">
                    <MapPin className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden cursor-pointer`}
                    >
                      <option value="Casablanca">{isRtl ? 'الدار البيضاء' : 'Casablanca'}</option>
                      <option value="Rabat">{isRtl ? 'الرباط' : 'Rabat'}</option>
                      <option value="Marrakech">{isRtl ? 'مراكش' : 'Marrakech'}</option>
                      <option value="Tangier">{isRtl ? 'طنجة' : 'Tanger'}</option>
                      <option value="Fes">{isRtl ? 'فاس' : 'Fès'}</option>
                      <option value="Agadir">{isRtl ? 'أكادير' : 'Agadir'}</option>
                      <option value="Meknes">{isRtl ? 'مكناس' : 'Meknès'}</option>
                      <option value="Oujda">{isRtl ? 'وجدة' : 'Oujda'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {isRtl ? 'البريد الإلكتروني (اختياري)' : 'Email (Optionnel)'}
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amine@example.com"
                    className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden`}
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'نوع الحساب' : 'Type de Compte'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'individual', label: isRtl ? 'فرد' : 'Particulier', icon: '👤' },
                    { id: 'business', label: isRtl ? 'شركة' : 'Société', icon: '🏢' },
                    { id: 'e_commerce', label: isRtl ? 'تجارة إلكترونية' : 'E-Com', icon: '🛍️' }
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
                  <span>{isRtl ? 'تأكيد الحساب' : 'Créer le Compte'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* OPTION 2: LOGIN */
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {isRtl ? 'أدخل رقم الهاتف (+212)' : 'Numéro de Téléphone (+212)'}
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400`} />
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="+212 6..."
                      className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white focus:outline-hidden`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="auth-modal-submit-login"
                  className="w-full py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isRtl ? 'تسجيل الدخول' : 'Se Connecter'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Security note */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 text-center border-t border-zinc-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{isRtl ? 'أمان فائق برموز التحقق المزدوجة OTP لجميع الشحنات.' : 'Sécurité garantie par double code OTP sur tous les envois.'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
