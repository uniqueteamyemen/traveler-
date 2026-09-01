import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X } from 'lucide-react';
import { TravelDocument } from '../../types/travel';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({ isOpen, onClose }) => {
  const { activeTrip, lang, addDocument } = useTravel();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<TravelDocument['type']>('passport');
  const [holderName, setHolderName] = useState(activeTrip?.travelers?.[0] || 'Me');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !activeTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !holderName.trim()) return;

    addDocument(activeTrip.id, {
      title: title.trim(),
      type,
      holderName: holderName.trim(),
      documentNumber: documentNumber.trim() || undefined,
      expiryDate: expiryDate || undefined,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'إضافة وثيقة أو مستند سفر' : 'Add Travel Document'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'اسم أو عنوان الوثيقة' : 'Document Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: جواز السفر الدبلوماسي / تأشيرة شنغن' : 'e.g., International Passport / Schengen Visa'}
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'نوع الوثيقة' : 'Document Type'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TravelDocument['type'])}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="passport">{lang === 'ar' ? 'جواز سفر' : 'Passport'}</option>
                <option value="visa">{lang === 'ar' ? 'تأشيرة دخول' : 'Visa'}</option>
                <option value="insurance">{lang === 'ar' ? 'تأمين سفر طبي' : 'Travel Insurance'}</option>
                <option value="ticket">{lang === 'ar' ? 'تذكرة عبور' : 'Ticket'}</option>
                <option value="id_card">{lang === 'ar' ? 'بطاقة هوية / رخصة' : 'ID / Driving License'}</option>
                <option value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'اسم صاحب الوثيقة' : 'Holder Name'}
              </label>
              <input
                type="text"
                required
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'رقم الوثيقة / الجواز' : 'Document / ID Number'}
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="A1234567"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'ملاحظات إضافية' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تغطية حتى 50 ألف دولار..."
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
              {lang === 'ar' ? 'حفظ الوثيقة' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
