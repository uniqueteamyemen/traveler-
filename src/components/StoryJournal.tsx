import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Trash2, 
  Star, 
  Heart, 
  Flame, 
  Smile, 
  Compass, 
  Coffee 
} from 'lucide-react';
import { StoryEntry } from '../types/travel';

interface StoryJournalProps {
  onOpenNewStory: () => void;
}

export const StoryJournal: React.FC<StoryJournalProps> = ({ onOpenNewStory }) => {
  const { activeTrip, lang, deleteStory } = useTravel();

  if (!activeTrip) return null;

  const stories = activeTrip.stories || [];

  const getMoodBadge = (mood: StoryEntry['mood']) => {
    switch (mood) {
      case 'ecstatic': return <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1 font-medium"><Flame className="w-3 h-3 text-amber-500" /> {lang === 'ar' ? 'قمة الحماس' : 'Ecstatic'}</span>;
      case 'happy': return <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 font-medium"><Smile className="w-3 h-3 text-emerald-500" /> {lang === 'ar' ? 'سعيد جداً' : 'Happy'}</span>;
      case 'peaceful': return <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center gap-1 font-medium"><Heart className="w-3 h-3 text-teal-500" /> {lang === 'ar' ? 'سلام وهدوء' : 'Peaceful'}</span>;
      case 'adventurous': return <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center gap-1 font-medium"><Compass className="w-3 h-3 text-purple-500" /> {lang === 'ar' ? 'مغامرة واستكشاف' : 'Adventurous'}</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1 font-medium"><Coffee className="w-3 h-3" /> {mood}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              {lang === 'ar' ? 'بداية القصة — مذكرات ولحظات الرحلة' : 'Beginning of the Story — Trip Journal & Memories'}
            </h2>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'دوّن مشاعرك، الصور المميزة، والقصص الفريدة التي لا تُنسى' : 'Capture journal entries, candid photos, and timeless personal stories'}
          </p>
        </div>

        <button
          onClick={onOpenNewStory}
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? '+ تدوين قصة جديدة' : '+ Write Story Entry'}</span>
        </button>
      </div>

      {/* Stories Timeline Feed */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {stories.map((story) => (
          <article
            key={story.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:border-amber-500/40 transition"
          >
            {/* Story photos grid */}
            {story.photos && story.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-stone-950 max-h-72 overflow-hidden">
                {story.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={story.title}
                    className="w-full h-72 object-cover hover:scale-105 transition duration-500"
                  />
                ))}
              </div>
            )}

            <div className="p-5 sm:p-7 space-y-4">
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  {getMoodBadge(story.mood)}
                  <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{story.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {story.rating && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: story.rating }).map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => deleteStory(activeTrip.id, story.id)}
                    className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Story text */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {story.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line font-serif italic sm:not-italic">
                  {story.storyText}
                </p>
              </div>

              {/* Footer location & tags */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{story.location}</span>
                </div>

                {story.tags && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {story.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}

        {stories.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              {lang === 'ar' ? 'ابدأ كتابة أول فصول القصة' : 'Start your travel story journal'}
            </h3>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 max-w-sm mx-auto">
              {lang === 'ar' ? 'سجل المواقف الطريفة، المشاعر، والمحطات الساحرة لتخليد تفاصيل رحلتك.' : 'Keep a vivid log of thoughts, feelings, and spontaneous discoveries.'}
            </p>
            <button
              onClick={onOpenNewStory}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تدوين القصة الأولى' : 'Write First Memory'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
