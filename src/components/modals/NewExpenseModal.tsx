import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X } from 'lucide-react';
import { Expense } from '../../types/travel';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { activeTrip, lang, addExpense } = useTravel();

  const travelers = activeTrip?.travelers || ['Ahmed'];

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(50);
  const [category, setCategory] = useState<Expense['category']>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(travelers[0] || 'Me');
  const [notes, setNotes] = useState('');

  if (!isOpen || !activeTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense(activeTrip.id, {
      title: title.trim(),
      amount: Number(amount),
      currency: activeTrip.currency,
      category,
      date,
      paidBy,
      splitWith: travelers,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'تسجيل مصروف جديد' : 'Log New Expense'}
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
              {lang === 'ar' ? 'بيان المصروف' : 'Expense Description'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: عشاء في مطعم تراثي' : 'e.g., Dinner at heritage tavern'}
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'المبلغ' : 'Amount'} ({activeTrip.currency})
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Expense['category'])}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="food">{lang === 'ar' ? 'مطاعم وطعام' : 'Food & Dining'}</option>
                <option value="transport">{lang === 'ar' ? 'مواصلات وتنقل' : 'Transport'}</option>
                <option value="accommodation">{lang === 'ar' ? 'فندق وسكن' : 'Hotel / Lodging'}</option>
                <option value="activities">{lang === 'ar' ? 'أنشطة وتذاكر' : 'Activities'}</option>
                <option value="shopping">{lang === 'ar' ? 'تسوق وهدايا' : 'Shopping'}</option>
                <option value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'دفع بواسطة' : 'Paid By'}
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                {travelers.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'ملاحظة أو تفصيل' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="فاتورة رقم..."
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
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              {lang === 'ar' ? 'تسجيل المصروف' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
