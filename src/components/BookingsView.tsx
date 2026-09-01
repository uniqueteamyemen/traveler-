import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  Plane, 
  Bed, 
  Train, 
  Car, 
  Ticket, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Booking } from '../types/travel';

interface BookingsViewProps {
  onOpenNewBooking: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ onOpenNewBooking }) => {
  const { activeTrip, lang, deleteBooking } = useTravel();

  if (!activeTrip) return null;

  const bookings = activeTrip.bookings || [];

  const getBookingIcon = (type: Booking['type']) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5 text-sky-500" />;
      case 'hotel': return <Bed className="w-5 h-5 text-indigo-500" />;
      case 'intercity_car': return <Car className="w-5 h-5 text-amber-500" />;
      case 'bus': return <Train className="w-5 h-5 text-emerald-500" />;
      default: return <Ticket className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'الحجوزات والتذاكر المؤكدة' : 'Bookings, Flights & Hotel Passes'}
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'تذاكر الطيران، الفنادق، القطارات، وأرقام التأكيد' : 'Manage boarding passes, vouchers, and reservation codes'}
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? '+ إضافة حجز' : '+ Add Booking'}</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-amber-500/40 transition flex flex-col justify-between"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                    {getBookingIcon(booking.type)}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {booking.provider}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {booking.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => deleteBooking(activeTrip.id, booking.id)}
                  className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                  title="Delete booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Reference Code Ticket Box */}
              <div className="mt-3.5 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-dashed border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800/80 dark:text-amber-300/80">
                    {lang === 'ar' ? 'رقم التأكيد / الحجز' : 'Confirmation Code'}
                  </span>
                  <div className="text-sm font-mono font-bold text-amber-950 dark:text-amber-200 tracking-wider">
                    {booking.referenceNumber}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {booking.status}
                </span>
              </div>

              {/* Details breakdown */}
              <div className="mt-3.5 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    {booking.startDate} {booking.endDate ? `→ ${booking.endDate}` : ''}
                  </span>
                  {booking.startTime && (
                    <span className="text-stone-400 font-mono">
                      ({booking.startTime} {booking.endTime ? `- ${booking.endTime}` : ''})
                    </span>
                  )}
                </div>

                {(booking.departureLocation || booking.arrivalLocation) && (
                  <div className="flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{booking.departureLocation} → {booking.arrivalLocation}</span>
                  </div>
                )}

                {booking.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{booking.address}</span>
                  </div>
                )}

                {booking.notes && (
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                    ℹ️ {booking.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Price Footer */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-stone-400">
                {lang === 'ar' ? 'التكلفة الإجمالية:' : 'Total Cost:'}
              </span>
              <span className="text-sm font-bold text-stone-900 dark:text-white">
                {booking.cost.toLocaleString()} {booking.currency}
              </span>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-2 text-center py-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
            <p className="text-xs text-stone-500">
              {lang === 'ar' ? 'لا توجد حجوزات مسجلة بعد' : 'No bookings added yet'}
            </p>
            <button
              onClick={onOpenNewBooking}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة الحجز الأول' : 'Add First Booking'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
