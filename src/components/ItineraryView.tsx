import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Utensils, 
  Camera, 
  Bed, 
  Plane, 
  Car, 
  Palmtree, 
  ShoppingBag, 
  Landmark, 
  Coffee,
  Ticket
} from 'lucide-react';
import { ActivityCategory } from '../types/travel';

interface ItineraryViewProps {
  onOpenNewActivity: (dayId?: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onOpenNewActivity }) => {
  const { 
    activeTrip, 
    lang, 
    addDay, 
    toggleActivityComplete, 
    deleteActivity 
  } = useTravel();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!activeTrip) return null;

  const days = activeTrip.days || [];
  const currentDay = days[selectedDayIndex] || days[0];

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'sightseeing': return <Camera className="w-4 h-4 text-amber-500" />;
      case 'hotel': return <Bed className="w-4 h-4 text-indigo-500" />;
      case 'flight': return <Plane className="w-4 h-4 text-sky-500" />;
      case 'transport': return <Car className="w-4 h-4 text-blue-500" />;
      case 'nature': return <Palmtree className="w-4 h-4 text-emerald-500" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'culture': return <Landmark className="w-4 h-4 text-purple-500" />;
      case 'relaxation': return <Coffee className="w-4 h-4 text-teal-500" />;
      default: return <Camera className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Days Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {lang === 'ar' ? 'الجدول الزمني للرحلة' : 'Trip Itinerary & Daily Schedule'}
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
            {lang === 'ar' ? 'تخطيط الأنشطة اليومية، المواعيد، والأماكن السياحية' : 'Manage activities, schedule timings, and landmark stops'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addDay(activeTrip.id)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '+ إضافة يوم' : '+ Add Day'}</span>
          </button>

          <button
            onClick={() => onOpenNewActivity(currentDay?.id)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة نشاط' : 'Add Activity'}</span>
          </button>
        </div>
      </div>

      {/* Day Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          const actsCount = day.activities?.length || 0;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-start transition shrink-0 min-w-[110px] ${
                isSelected
                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-2xs'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                {lang === 'ar' ? `اليوم ${day.dayNumber}` : `Day ${day.dayNumber}`}
              </span>
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[130px]">
                {day.date}
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                {actsCount} {lang === 'ar' ? 'أنشطة' : 'activities'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Day Details */}
      {currentDay ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {lang === 'ar' ? `اليوم ${currentDay.dayNumber}` : `Day ${currentDay.dayNumber}`} • {currentDay.date}
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                {lang === 'ar' ? (currentDay.titleAr || currentDay.title) : currentDay.title}
              </h3>
            </div>
            <button
              onClick={() => onOpenNewActivity(currentDay.id)}
              className="self-start sm:self-auto text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة نشاط لهذا اليوم' : 'Add Activity to this day'}</span>
            </button>
          </div>

          {/* Activities Timeline */}
          <div className="space-y-4 relative before:absolute before:inset-0 before:start-6 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
            {(currentDay.activities || []).map((activity) => (
              <div 
                key={activity.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition ${
                  activity.isCompleted
                    ? 'bg-stone-50/70 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800 opacity-75'
                    : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-700/80 shadow-2xs hover:border-amber-500/40'
                }`}
              >
                {/* Complete checkbox icon */}
                <button
                  onClick={() => toggleActivityComplete(activeTrip.id, activity.id)}
                  className="relative z-10 shrink-0 mt-0.5 p-1 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                  title={activity.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {activity.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 hover:text-amber-600" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60 text-stone-800 dark:text-stone-200 text-xs font-bold font-mono">
                        {activity.time}
                      </span>
                      <div className="p-1 rounded-md bg-stone-100 dark:bg-stone-800">
                        {getCategoryIcon(activity.category)}
                      </div>
                      <h4 className={`text-sm font-bold text-stone-900 dark:text-white ${activity.isCompleted ? 'line-through text-stone-500' : ''}`}>
                        {lang === 'ar' ? (activity.titleAr || activity.title) : activity.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {activity.cost !== undefined && activity.cost > 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          {activity.cost} {activity.currency || activeTrip.currency}
                        </span>
                      )}
                      <button
                        onClick={() => deleteActivity(activeTrip.id, activity.id)}
                        className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                        title="Delete activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 dark:text-stone-300 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activity.location}</span>
                    </div>

                    {activity.bookingRef && (
                      <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-mono text-[11px]">
                        <Ticket className="w-3 h-3" />
                        <span>Ref: {activity.bookingRef}</span>
                      </div>
                    )}
                  </div>

                  {activity.notes && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-900/30">
                      💡 {activity.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(currentDay.activities || []).length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  {lang === 'ar' ? 'لا توجد أنشطة مضافة لهذا اليوم بعد' : 'No activities scheduled for this day yet.'}
                </p>
                <button
                  onClick={() => onOpenNewActivity(currentDay.id)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة النشاط الأول' : 'Add First Activity'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

    </div>
  );
};
