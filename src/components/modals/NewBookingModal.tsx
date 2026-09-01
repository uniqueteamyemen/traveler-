import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X } from 'lucide-react';
import { Booking } from '../../types/travel';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const { activeTrip, lang, addBooking } = useTravel();

  const [type, setType] = useState<Booking['type']>('flight');
  const [provider, setProvider] = useState('');
  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [startDate, setStartDate] = useState(activeTrip?.startDate || '');
  const [endDate, setEndDate] = useState(activeTrip?.endDate || '');
  const [startTime, setStartTime] = useState('10:00');
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [address, setAddress] = useState('');
  const [cost, setCost] = useState(150);
  const [notes, setNotes] = useState('');

  if (!isOpen || !activeTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider.trim() || !title.trim() || !referenceNumber.trim()) return;

    addBooking(activeTrip.id, {
      type,
      provider: provider.trim(),
      title: title.trim(),
      referenceNumber: referenceNumber.trim(),
      startDate,
      endDate: endDate || undefined,
      startTime: startTime || undefined,
      departureLocation: departureLocation.trim() || undefined,
      arrivalLocation: arrivalLocation.trim() || undefined,
      address: address.trim() || undefined,
      cost: Number(cost) || 0,
      currency: activeTrip.currency,
      status: 'confirmed',
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'إضافة تذكرة أو حجز جديد' : 'Add Booking / Reservation'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'نوع الحجز' : 'Booking Type'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Booking['type'])}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="flight">{lang === 'ar' ? 'طيران' : 'Flight'}</option>
                <option value="hotel">{lang === 'ar' ? 'فندق / سكن' : 'Hotel / Lodging'}</option>
                <option value="train">{lang === 'ar' ? 'قطار' : 'Train'}</option>
                <option value="car">{lang === 'ar' ? 'استئجار سيارة' : 'Car Rental'}</option>
                <option value="activity">{lang === 'ar' ? 'جولة أو فعالية' : 'Tour / Activity'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'مزود الخدمة / الشركة' : 'Provider / Carrier'}
              </label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., Saudia, Marriott, Avis"
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'عنوان الحجز أو رقم الرحلة' : 'Booking Title / Flight Number'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Flight SV-120 DXB to MAD"
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'رقم التأكيد / PNR' : 'Confirmation / PNR Code'}
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g., X99201"
                className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تاريخ البداية / السفر' : 'Start Date'}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تاريخ المغادرة / المغادرة' : 'End Date (Optional)'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'ملاحظات (المقاعد، الأمتعة، رقم الصالة)' : 'Notes / Baggage / Seat'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مقعد 12A، حقيبة 23 كجم مشمولة..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition"
            >
              {lang === 'ar' ? 'حفظ الحجز' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
