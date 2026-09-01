import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Bell,
  Sparkles
} from 'lucide-react';
import { TabType } from '../types/travel';

export const UpcomingEventBanner: React.FC = () => {
  const { 
    activeTrip, 
    notifications, 
    triggerTestNotification, 
    setActiveTab, 
    lang, 
    isRTL 
  } = useTravel();

  if (!activeTrip) return null;

  // Find nearest upcoming alert from notifications or itinerary
  const upcomingAlert = notifications.find(
    n => !n.isRead && (n.type === 'transit_departure' || n.type === 'activity_upcoming' || n.type === 'stop_approaching')
  ) || notifications[0];

  // Also check if there's any uncompleted activity in the active trip
  const firstUncompletedActivity = (activeTrip.days || [])
    .flatMap(d => d.activities || [])
    .find(a => !a.isCompleted);

  const displayTime = upcomingAlert?.scheduledTime || firstUncompletedActivity?.time || '07:00 AM';
  const displayTitle = upcomingAlert 
    ? (lang === 'ar' ? upcomingAlert.titleAr : upcomingAlert.title)
    : (lang === 'ar' ? (firstUncompletedActivity?.titleAr || firstUncompletedActivity?.title || 'انطلاق الرحلة المجدولة') : (firstUncompletedActivity?.title || 'Scheduled Departure'));
  const displayLocation = upcomingAlert?.locationName || firstUncompletedActivity?.location || activeTrip.originGovernorate || 'نقطة التجمع والانطلاق';

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-600/10 via-amber-500/10 to-stone-100/60 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-stone-900/60 border border-amber-300/60 dark:border-amber-700/50 p-4 sm:p-5 relative overflow-hidden shadow-xs">
      
      {/* Background glow & subtle indicator */}
      <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-amber-500/20 animate-pulse">
            <Clock className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-xs">
                {lang === 'ar' ? 'الموعد القادم المباشر' : 'NEXT UPCOMING EVENT'}
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {displayTime}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
              {displayTitle}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{displayLocation}</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => triggerTestNotification('transit_departure')}
            className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
            title={lang === 'ar' ? 'محاكاة تنبيه انطلاق فوري مع إشعار صوتي' : 'Simulate alert'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'محاكاة تنبيه حي' : 'Test Alert'}</span>
          </button>

          <button
            onClick={() => setActiveTab('fixed_plan')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <span>{lang === 'ar' ? 'متابعة خطة السير' : 'View Route Plan'}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

    </div>
  );
};
