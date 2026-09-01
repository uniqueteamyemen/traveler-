import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X } from 'lucide-react';
import { ActivityCategory } from '../../types/travel';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDayId?: string;
}

export const NewActivityModal: React.FC<NewActivityModalProps> = ({ isOpen, onClose, defaultDayId }) => {
  const { activeTrip, lang, addActivity } = useTravel();

  const days = activeTrip?.days || [];
  const [dayId, setDayId] = useState(defaultDayId || days[0]?.id || '');
  const [time, setTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('sightseeing');
  const [cost, setCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen || !activeTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !titleAr.trim()) return;

    const targetDayId = dayId || days[0]?.id;
    if (!targetDayId) return;

    addActivity(activeTrip.id, targetDayId, {
      time,
      title: title.trim() || titleAr.trim(),
      titleAr: titleAr.trim() || title.trim(),
      description: description.trim(),
      location: location.trim() || activeTrip.destination,
      category,
      cost: Number(cost) || 0,
      currency: activeTrip.currency,
      isCompleted: false,
      notes: notes.trim() || undefined,
      bookingRef: bookingRef.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'إضافة نشاط أو محطة جديدة' : 'Add New Activity Stop'}
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
                {lang === 'ar' ? 'اليوم' : 'Target Day'}
              </label>
              <select
                value={dayId}
                onChange={(e) => setDayId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                {days.map(d => (
                  <option key={d.id} value={d.id}>
                    {lang === 'ar' ? `اليوم ${d.dayNumber} (${d.date})` : `Day ${d.dayNumber} (${d.date})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'الوقت' : 'Time'}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'اسم النشاط بالعربية' : 'Activity Name (Arabic)'}
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: زيارة قصر الحمراء والحدائق الملكية"
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'اسم النشاط بالإنجليزية' : 'Activity Name (English)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Alhambra Palace & Gardens Tour"
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="sightseeing">{lang === 'ar' ? 'معالم وسياحة' : 'Sightseeing'}</option>
                <option value="food">{lang === 'ar' ? 'مطاعم وتذوق' : 'Food & Dining'}</option>
                <option value="culture">{lang === 'ar' ? 'ثقافة ومتاحف' : 'Culture & Arts'}</option>
                <option value="nature">{lang === 'ar' ? 'طبيعة ومناظر' : 'Nature & Outdoors'}</option>
                <option value="hotel">{lang === 'ar' ? 'فندق وإقامة' : 'Hotel / Check-in'}</option>
                <option value="shopping">{lang === 'ar' ? 'تسوق' : 'Shopping'}</option>
                <option value="transport">{lang === 'ar' ? 'تنقل ومواصلات' : 'Transport'}</option>
                <option value="relaxation">{lang === 'ar' ? 'استرخاء ومقاهي' : 'Relaxation'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'التكلفة التقديرية' : 'Estimated Cost'}
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'الموقع / العنوان' : 'Location / Address'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Granada, Spain"
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'تفاصيل ووصف النشاط' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف لما سنقوم به في هذا التوقيت..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'مرجع الحجز (إن وجد)' : 'Booking Ref'}
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="e.g., TKT-1049"
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'ملاحظة أو تلميح' : 'Tips / Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="الحضور قبل نصف ساعة..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
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
              {lang === 'ar' ? 'إضافة للجدول' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
