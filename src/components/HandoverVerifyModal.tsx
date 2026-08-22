import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Camera, KeyRound, AlertCircle, DollarSign } from 'lucide-react';
import { ParcelDelivery } from '../types';
import { formatCurrency } from '../utils/helpers';

interface HandoverVerifyModalProps {
  delivery: ParcelDelivery;
  type: 'pickup' | 'delivery';
  onVerify: (deliveryId: string, otp: string, proofPhoto?: string) => boolean;
  onClose: () => void;
}

export const HandoverVerifyModal: React.FC<HandoverVerifyModalProps> = ({
  delivery,
  type,
  onVerify,
  onClose
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);

  const expectedOtp = type === 'pickup' ? delivery.pickupOtp : delivery.deliveryOtp;
  const isPickup = type === 'pickup';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpInput.trim() !== expectedOtp) {
      setErrorMsg(`Incorrect ${isPickup ? 'Pickup' : 'Delivery'} Code! Please check with the ${isPickup ? 'sender' : 'receiver'}. (Hint for demo: ${expectedOtp})`);
      return;
    }

    const dummyPhoto = photoAttached 
      ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80' 
      : undefined;

    const ok = onVerify(delivery.id, otpInput.trim(), dummyPhoto);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${isPickup ? 'bg-indigo-900' : 'bg-emerald-900'} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isPickup ? 'Verify Sender Parcel Pickup' : 'Confirm Recipient Delivery'}
              </h3>
              <p className="text-xs text-zinc-300 font-mono">
                {delivery.trackingCode} • {delivery.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-zinc-900">
              {isPickup ? 'Parcel Loaded in Taxi!' : 'Delivery Complete & Signed!'}
            </h4>
            <p className="text-sm text-zinc-600">
              {isPickup 
                ? 'OTP verified. Parcel is secured in trunk and ready for the highway.'
                : 'Recipient handover confirmed. Delivery payment reconciled.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="p-6 space-y-5">
            {/* Quick Context Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-600">
                <span>{isPickup ? 'Sender:' : 'Receiver:'}</span>
                <span className="font-bold text-zinc-900">
                  {isPickup ? `${delivery.senderName} (${delivery.senderPhone})` : `${delivery.receiverName} (${delivery.receiverPhone})`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Location:</span>
                <span className="font-semibold text-zinc-800">
                  {isPickup ? delivery.originStation : delivery.destinationStation}
                </span>
              </div>
              {!isPickup && delivery.paymentMethod === 'cash_on_delivery' && (
                <div className="flex items-center justify-between text-amber-800 bg-amber-100 p-2 rounded-lg font-bold">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Collect Cash on Delivery:
                  </span>
                  <span className="text-sm">{formatCurrency(delivery.priceTotal)}</span>
                </div>
              )}
            </div>

            {/* OTP Keypad / Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
                  Enter 4-Digit {isPickup ? 'Pickup' : 'Delivery'} Code:
                </span>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                  Demo Code: {expectedOtp}
                </span>
              </label>

              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                placeholder="• • • •"
                className="w-full text-center text-3xl font-mono tracking-widest py-3 border-2 border-zinc-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all font-black text-zinc-900"
                autoFocus
              />
              <p className="text-[11px] text-zinc-600 mt-1 text-center">
                Ask the {isPickup ? 'sender' : 'receiver'} for the secret code displayed on their waybill.
              </p>
            </div>

            {/* Photo / Inspection Check */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPhotoAttached(!photoAttached)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  photoAttached 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{photoAttached ? '✓ Handover Photo Attached' : 'Attach Handover Photo (Simulated)'}</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={otpInput.length < 4}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                  isPickup 
                    ? 'bg-indigo-600 hover:bg-indigo-500' 
                    : 'bg-emerald-600 hover:bg-emerald-500'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isPickup ? 'Confirm Pickup & Load' : 'Confirm Delivery'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
