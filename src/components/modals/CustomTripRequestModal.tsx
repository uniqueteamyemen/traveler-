import React, { useState } from 'react';
import { Send, MapPin, Calendar, Users, Car, Phone, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../../data/yemenData';

interface CustomTripRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOrigin?: string;
  defaultDestination?: string;
}

export const CustomTripRequestModal: React.FC<CustomTripRequestModalProps> = ({
  isOpen,
  onClose,
  defaultOrigin = 'صنعاء',
  defaultDestination = 'عدن'
}) => {
  const { lang, addNotification } = useTravel();

  const [fromGov, setFromGov] = useState(defaultOrigin);
  const [toGov, setToGov] = useState(defaultDestination);
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingMode, setBookingMode] = useState<'seat' | 'full_car'>('seat');
  const [passengersCount, setPassengersCount] = useState(1);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addNotification({
      title: 'Custom Trip Request Submitted',
      titleAr: `تم إرسال طلب رحلتك الخاصة (${fromGov} ← ${toGov})`,
      message: `Your custom request has been broadcasted to verified captains and offices for ${tripDate}.`,
      messageAr: `تم بث طلبك لكباتن ومكاتب النقل المعتمدة بين ${fromGov} و ${toGov}. سيتواصل معك الكباتن مباشرة بدون أي عمولات.`,
      type: 'general',
      priority: 'high',
      targetTab: 'intercity_hub'
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {lang === 'ar' ? 'طلب رحلة خاصة جديدة' : 'Custom Trip Request'}
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                {lang === 'ar' ? 'أنشئ طلباً مخصصاً إذا لم تجد رحلة مناسبة الآن' : 'Create a custom trip request when no ride fits'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-stone-900 dark:text-white">
              {lang === 'ar' ? 'تم تسجيل ونشر طلبك بنجاح!' : 'Request Broadcasted Successfully!'}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'تم إشعار الكباتن ومكاتب النقل الشاغرة المتجهة من ' + fromGov + ' إلى ' + toGov + '. سيتواصلون معك هاتفياً أو عبر الواتساب مباشرة مجاناً وبدون عمولات.'
                : 'Captains covering this route have been notified and will contact you directly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Route Selector: From & To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'من محافظة (الانطلاق)' : 'From Governorate'}
                </label>
                <select
                  value={fromGov}
                  onChange={(e) => setFromGov(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  required
                >
                  {YEMEN_GOVERNORATES.map((gov: { id: string; nameAr: string }) => (
                    <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline text-emerald-600 me-1" />
                  {lang === 'ar' ? 'إلى محافظة (الوجهة)' : 'To Governorate'}
                </label>
                <select
                  value={toGov}
                  onChange={(e) => setToGov(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  required
                >
                  {YEMEN_GOVERNORATES.map((gov: { id: string; nameAr: string }) => (
                    <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Booking Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'تاريخ السفر المرغوب' : 'Preferred Date'}
                </label>
                <input
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Car className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'نوع الحجز المطلوب' : 'Booking Type'}
                </label>
                <select
                  value={bookingMode}
                  onChange={(e) => setBookingMode(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="seat">{lang === 'ar' ? 'مقعد بالنفر (مشاركة)' : 'Seat Booking'}</option>
                  <option value="full_car">{lang === 'ar' ? 'سيارة كاملة خاصة VIP (صالون 4x4)' : 'Private Full Car VIP'}</option>
                </select>
              </div>
            </div>

            {/* Passengers count & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Users className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'عدد الركاب' : 'Passenger Count'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline text-emerald-600 me-1" />
                  {lang === 'ar' ? 'رقم الهاتف / واتساب للتواصل' : 'Contact Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="77x xxx xxx"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Notes / Special Requests */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {lang === 'ar' ? 'ملاحظات وتفاصيل إضافية (اختياري)' : 'Additional Notes (Optional)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: عائلة، تكييف شغال، مسافر صباحاً، وجود أمتعة أو طرد...' : 'E.g. Family trip, AC required, morning departure...'}
                rows={2}
                className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Notice banner */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'ar'
                  ? 'التسجيل والطلب مجاني 100% في تطبيق المسافر، ولا توجد أي عمولات على الطرفين عند الاتفاق.'
                  : 'Trip requesting is 100% free on Traveler platform with direct zero-commission communication.'}
              </span>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نشر طلب الرحلة للكباتن والمكاتب' : 'Broadcast Request to Captains'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
