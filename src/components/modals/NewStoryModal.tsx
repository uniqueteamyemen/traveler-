import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X, Star } from 'lucide-react';
import { StoryEntry } from '../../types/travel';

interface NewStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewStoryModal: React.FC<NewStoryModalProps> = ({ isOpen, onClose }) => {
  const { activeTrip, lang, addStory } = useTravel();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(activeTrip?.destination || '');
  const [mood, setMood] = useState<StoryEntry['mood']>('ecstatic');
  const [storyText, setStoryText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState('Memory, Travel, Discovery');

  if (!isOpen || !activeTrip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;

    const photos = photoUrl.trim() 
      ? [photoUrl.trim()] 
      : ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'];

    addStory(activeTrip.id, {
      title: title.trim(),
      date,
      location: location.trim() || activeTrip.destination,
      mood,
      storyText: storyText.trim(),
      photos,
      rating,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'تدوين ذكرى أو قصة جديدة (بداية القصة)' : 'Capture a Trip Story & Memory'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'عنوان القصة أو اللحظة' : 'Story Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: لحظة الغروب الأسطورية على شاطئ المكلا وتذوق الشاي الحضرمي' : 'e.g., Golden Sunset at Mukalla Corniche & Traditional Tea'}
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'المشاعر والانطباع' : 'Mood / Feeling'}
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as StoryEntry['mood'])}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="ecstatic">{lang === 'ar' ? '🔥 حماس وانبهار' : 'Ecstatic'}</option>
                <option value="happy">{lang === 'ar' ? '😊 سعادة وبهجة' : 'Happy'}</option>
                <option value="peaceful">{lang === 'ar' ? '🌿 هدوء وسلام' : 'Peaceful'}</option>
                <option value="adventurous">{lang === 'ar' ? '🧭 مغامرة واكتشاف' : 'Adventurous'}</option>
                <option value="inspired">{lang === 'ar' ? '✨ إلهام وشغف' : 'Inspired'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'المكان' : 'Location'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="شبام حضرموت / وادي دوعن"
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ar' ? 'تقييم اللحظة' : 'Rating'}
              </label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-stone-300 hover:text-amber-500 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'نص القصة والمذكرات' : 'Story Narrative / Journal Entry'}
            </label>
            <textarea
              required
              rows={4}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="اكتب تفاصيل ما حدث، المشاعر، التفاصيل الحسية والأصوات..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'رابط صورة تذكارية (اختياري)' : 'Photo URL (Optional)'}
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'ar' ? 'الوسوم (مفصولة بفواصل)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="غروب_المكلا, شبام, وادي_دوعن, شاي_حضرمي"
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition"
            >
              {lang === 'ar' ? 'حفظ الذكرى في القصة' : 'Save Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
