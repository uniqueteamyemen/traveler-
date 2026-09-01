import React, { useEffect, useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Bell, 
  Car, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { NotificationType, TabType } from '../types/travel';

export const LiveNotificationToast: React.FC = () => {
  const { liveToast, dismissLiveToast, markNotificationAsRead, setActiveTab, lang, isRTL } = useTravel();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!liveToast) return;

    setProgress(100);
    const durationMs = 8000;
    const intervalMs = 100;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissLiveToast();
          return 0;
        }
        return prev - step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [liveToast, dismissLiveToast]);

  if (!liveToast) return null;

  const handleAction = () => {
    markNotificationAsRead(liveToast.id);
    if (liveToast.targetTab) {
      setActiveTab(liveToast.targetTab as TabType);
    }
    dismissLiveToast();
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'transit_departure':
        return <Car className="w-5 h-5 text-amber-500 animate-bounce" />;
      case 'activity_upcoming':
        return <Calendar className="w-5 h-5 text-sky-500" />;
      case 'stop_approaching':
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case 'safety_alert':
        return <ShieldCheck className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed bottom-5 sm:bottom-auto sm:top-20 start-4 end-4 sm:start-auto sm:end-6 z-50 sm:max-w-md w-auto animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-500/40 shadow-2xl overflow-hidden ring-4 ring-amber-500/10 backdrop-blur-md">
        
        {/* Progress bar */}
        <div className="h-1 bg-stone-100 dark:bg-stone-800 w-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 flex items-start gap-3.5">
          {/* Icon Circle */}
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 shadow-inner">
            {getIcon(liveToast.type)}
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs">
                {lang === 'ar' ? '⚡ تنبيه فوري' : '⚡ LIVE ALERT'}
              </span>
              {liveToast.scheduledTime && (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {liveToast.scheduledTime}
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white leading-tight">
              {lang === 'ar' ? liveToast.titleAr : liveToast.title}
            </h4>

            <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2">
              {lang === 'ar' ? liveToast.messageAr : liveToast.message}
            </p>

            {/* Quick Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-2">
              {liveToast.targetTab ? (
                <button
                  onClick={handleAction}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>{lang === 'ar' ? 'عرض تفاصيل الحدث والمسار' : 'View Event Details'}</span>
                  {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={dismissLiveToast}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                {lang === 'ar' ? 'إغلاق' : 'Dismiss'}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissLiveToast}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition -mt-1 -me-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
