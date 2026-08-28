import React, { useState } from 'react';
import { X, Send, Phone, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { ParcelDelivery, ChatMessage } from '../types';
import { formatTime } from '../utils/helpers';
import { Language } from '../utils/i18n';

interface ChatModalProps {
  delivery: ParcelDelivery;
  messages: ChatMessage[];
  onSendMessage: (text: string, senderRole: 'sender' | 'driver' | 'receiver', senderName: string) => void;
  onClose: () => void;
  language?: Language;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  delivery,
  messages,
  onSendMessage,
  onClose,
  language = 'fr'
}) => {
  const isRtl = language === 'ar';
  const [inputText, setInputText] = useState('');
  const [activeRole, setActiveRole] = useState<'sender' | 'driver' | 'receiver'>('sender');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let senderName = delivery.senderName;
    if (activeRole === 'driver') senderName = delivery.driver?.name || (isRtl ? 'سائق الطاكسي' : 'Chauffeur Taxi');
    if (activeRole === 'receiver') senderName = delivery.receiverName;

    onSendMessage(inputText.trim(), activeRole, senderName);
    setInputText('');
  };

  const quickReplies = isRtl ? [
    activeRole === 'sender' ? "وصلت إلى موقف الطاكسيات وبحوزتي الطرد" : null,
    activeRole === 'sender' ? `رمز التسليم هو ${delivery.pickupOtp}` : null,
    activeRole === 'driver' ? "أنا متوقف قرب الرصيف 3 بالطاكسي الأبيض" : null,
    activeRole === 'driver' ? "الطريق السيار سالك وسأصل في الموعد" : null,
    activeRole === 'receiver' ? "أنا في انتظاركم عند شباك محطة الوصول" : null,
  ].filter(Boolean) as string[] : [
    activeRole === 'sender' ? "Je suis arrivé à la station avec le colis" : null,
    activeRole === 'sender' ? `Le code OTP de départ est ${delivery.pickupOtp}` : null,
    activeRole === 'driver' ? "Je suis garé près du quai n°3 avec le Grand Taxi" : null,
    activeRole === 'driver' ? "Trajet fluide sur autoroute, arrivée à l'heure" : null,
    activeRole === 'receiver' ? "Je vous attends au guichet de la station d'arrivée" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200 flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <span>{isRtl ? 'محادثة وتنسيق الرحلة' : 'Messagerie Directe Trajet'}</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                  {delivery.trackingCode}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {isRtl ? 'السائق :' : 'Chauffeur :'} {delivery.driver?.name || (isRtl ? 'السائق المعين' : 'Chauffeur')} ({delivery.driver?.phone || '+212 6...'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${delivery.driver?.phone || ''}`}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition-colors"
              title={isRtl ? 'اتصال بالسائق' : 'Appeler le Chauffeur'}
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Switcher in Chat */}
        <div className="bg-zinc-100 px-4 py-2 border-b border-zinc-200 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">{isRtl ? 'المتحدث :' : 'Profil actif :'}</span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-zinc-300">
            <button
              onClick={() => setActiveRole('sender')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeRole === 'sender' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {isRtl ? 'المرسل' : 'Expéditeur'} ({delivery.senderName.split(' ')[0]})
            </button>
            <button
              onClick={() => setActiveRole('driver')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeRole === 'driver' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {isRtl ? 'السائق' : 'Chauffeur'} ({delivery.driver?.name.split(' ')[0] || (isRtl ? 'سائق' : 'Taxi')})
            </button>
            <button
              onClick={() => setActiveRole('receiver')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeRole === 'receiver' ? 'bg-emerald-600 text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {isRtl ? 'المستلم' : 'Destinataire'} ({delivery.receiverName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50">
          {messages.map((msg) => {
            const isSystem = msg.senderRole === 'system';
            const isDriver = msg.senderRole === 'driver';
            const isSender = msg.senderRole === 'sender';
            const isReceiver = msg.senderRole === 'receiver';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-700 text-[11px] font-medium border border-zinc-300/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.senderRole === activeRole ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-zinc-700">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span className={`px-1 rounded text-[10px] uppercase font-bold ${
                    isDriver ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    isReceiver ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isRtl ? (isDriver ? 'سائق' : isReceiver ? 'مستلم' : 'مرسل') : (isDriver ? 'Chauffeur' : isReceiver ? 'Destinataire' : 'Expéditeur')}
                  </span>
                  <span>• {formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                    msg.senderRole === activeRole
                      ? 'bg-zinc-900 text-white rounded-tr-xs'
                      : isDriver
                      ? 'bg-amber-50 text-zinc-900 border border-amber-200 rounded-tl-xs'
                      : 'bg-white text-zinc-900 border border-zinc-200 rounded-tl-xs'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        {quickReplies.length > 0 && (
          <div className="px-4 py-2 bg-zinc-100 border-t border-zinc-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-700 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> {isRtl ? 'رسائل سريعة :' : 'Rapide :'}
            </span>
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                onClick={() => {
                  let senderName = delivery.senderName;
                  if (activeRole === 'driver') senderName = delivery.driver?.name || (isRtl ? 'سائق' : 'Chauffeur');
                  if (activeRole === 'receiver') senderName = delivery.receiverName;
                  onSendMessage(qr, activeRole, senderName);
                }}
                className="text-[11px] bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={
              isRtl 
                ? (activeRole === 'sender' ? 'اكتب رسالة كمرسل...' : activeRole === 'driver' ? 'اكتب رسالة كسائق...' : 'اكتب رسالة كمستلم...')
                : `Écrire en tant que ${activeRole === 'sender' ? 'expéditeur' : activeRole === 'driver' ? 'chauffeur' : 'destinataire'}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-zinc-100 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-bold shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
