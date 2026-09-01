import React, { useState, useRef, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Bell, 
  Car, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Check, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { AppNotification, NotificationType, TabType } from '../types/travel';

export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    triggerTestNotification,
    audioNotificationEnabled,
    toggleAudioNotification,
    setActiveTab,
    lang,
    isRTL
  } = useTravel();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'transit' | 'activity' | 'safety'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'transit') return n.type === 'transit_departure' || n.type === 'booking_confirmed';
    if (filter === 'activity') return n.type === 'activity_upcoming';
    if (filter === 'safety') return n.type === 'safety_alert' || n.type === 'stop_approaching';
    return true;
  });

  const getNotificationIcon = (type: NotificationType, priority: string) => {
    switch (type) {
      case 'transit_departure':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 ring-1 ring-amber-500/20">
            <Car className="w-4 h-4" />
          </div>
        );
      case 'activity_upcoming':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 ring-1 ring-sky-500/20">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'stop_approaching':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20">
            <MapPin className="w-4 h-4" />
          </div>
        );
      case 'safety_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 ring-1 ring-rose-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-stone-500/15 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            {lang === 'ar' ? '🚨 انطلاق عاجل' : '🚨 Urgent Departure'}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {lang === 'ar' ? '⏳ اقتراب الموعد' : '⏳ Upcoming Soon'}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {lang === 'ar' ? '📍 محطة قادمة' : '📍 Next Stop'}
          </span>
        );
      default:
        return null;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return lang === 'ar' ? 'الآن' : 'Just now';
      if (diffMins < 60) return lang === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return lang === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
      return new Date(isoString).toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US');
    } catch {
      return '';
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetTab) {
      setActiveTab(notif.targetTab as TabType);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === 'ar' ? 'الإشعارات والتنبيهات المباشرة' : 'Live Notifications'}
        className={`relative p-2 rounded-xl border transition shadow-xs flex items-center justify-center ${
          isOpen
            ? 'bg-amber-500/10 border-amber-400 dark:border-amber-600 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60'
        }`}
      >
        <Bell className={`w-4 h-4 ${unreadNotificationsCount > 0 ? 'animate-wiggle text-amber-600 dark:text-amber-400' : ''}`} />
        
        {/* Unread Counter Badge */}
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -end-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-amber-600 rounded-full border-2 border-stone-50 dark:border-stone-900 shadow-sm animate-pulse">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={`absolute ${isRTL ? 'start-0 sm:-start-24 md:start-0' : 'end-0 sm:-end-24 md:end-0'} mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-stone-50/90 dark:bg-stone-800/80 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  {lang === 'ar' ? 'التنبيهات والمواعيد الحية' : 'Live Transit & Activity Alerts'}
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {unreadNotificationsCount} {lang === 'ar' ? 'جديد' : 'new'}
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  {lang === 'ar' ? 'تتبع مواعيد انطلاق النقل والأنشطة المجدولة' : 'Real-time countdowns & departures'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                onClick={toggleAudioNotification}
                title={audioNotificationEnabled ? (lang === 'ar' ? 'كتم صوت التنبيهات' : 'Mute Chimes') : (lang === 'ar' ? 'تفعيل صوت التنبيهات' : 'Enable Chimes')}
                className={`p-1.5 rounded-lg border transition ${
                  audioNotificationEnabled
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400'
                }`}
              >
                {audioNotificationEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Simulation Bar (Allows testing real-time alerts on the spot!) */}
          <div className="px-3.5 py-2 bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-800/40 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {lang === 'ar' ? 'تجربة تنبيه حي:' : 'Simulate Alert:'}
            </span>
            
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => triggerTestNotification('transit_departure')}
                className="px-2 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold shadow-xs whitespace-nowrap transition active:scale-95 flex items-center gap-1"
              >
                <Car className="w-3 h-3" />
                <span>{lang === 'ar' ? 'انطلاق باص/سيارة' : 'Departure'}</span>
              </button>

              <button
                onClick={() => triggerTestNotification('activity_upcoming')}
                className="px-2 py-1 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 text-[10px] font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-sky-500" />
                <span>{lang === 'ar' ? 'نشاط خطة' : 'Activity'}</span>
              </button>

              <button
                onClick={() => triggerTestNotification('stop_approaching')}
                className="px-2 py-1 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 text-[10px] font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>{lang === 'ar' ? 'محطة استراحة' : 'Stop'}</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3.5 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar bg-stone-50/50 dark:bg-stone-900/50">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {lang === 'ar' ? `الكل (${notifications.length})` : `All (${notifications.length})`}
            </button>

            <button
              onClick={() => setFilter('transit')}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                filter === 'transit'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {lang === 'ar' ? 'المغادرات والنقل' : 'Transit Departures'}
            </button>

            <button
              onClick={() => setFilter('activity')}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                filter === 'activity'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {lang === 'ar' ? 'الأنشطة المجدولة' : 'Activities'}
            </button>

            <button
              onClick={() => setFilter('safety')}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                filter === 'safety'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {lang === 'ar' ? 'المحطات والأمان' : 'Stops & Safety'}
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ar' ? 'لا توجد تنبيهات في هذا القسم' : 'No alerts in this category'}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                  {lang === 'ar' ? 'ستصلك إشعارات وتنبيهات فورية عند اقتراب مواعيد انطلاق الرحلات أو الأنشطة.' : 'You will receive real-time countdown alerts before departures and scheduled activities.'}
                </p>
                <button
                  onClick={() => triggerTestNotification()}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  {lang === 'ar' ? '+ توليد تنبيه تجريبي فوري' : '+ Generate Test Alert'}
                </button>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3.5 sm:p-4 transition flex gap-3 group relative hover:bg-stone-50 dark:hover:bg-stone-800/50 ${
                    !notif.isRead ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                  }`}
                >
                  {/* Icon */}
                  {getNotificationIcon(notif.type, notif.priority)}

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-stone-900 dark:text-white font-extrabold' : 'text-stone-700 dark:text-stone-300'}`}>
                            {lang === 'ar' ? notif.titleAr : notif.title}
                          </h4>
                          {getPriorityBadge(notif.priority)}
                        </div>
                        {notif.scheduledTime && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>
                              {lang === 'ar' ? `الموعد المحدد: ${notif.scheduledTime}` : `Scheduled: ${notif.scheduledTime}`}
                            </span>
                            {notif.timeRemainingMinutes !== undefined && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 ms-1 font-black">
                                {lang === 'ar' ? `متبقي ${notif.timeRemainingMinutes} دقيقة` : `${notif.timeRemainingMinutes} mins left`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                        {formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {lang === 'ar' ? notif.messageAr : notif.message}
                    </p>

                    {notif.locationName && (
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 dark:text-stone-400 pt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span className="truncate">{notif.locationName}</span>
                      </div>
                    )}

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-1.5">
                      {notif.targetTab ? (
                        <button
                          onClick={() => handleNotificationClick(notif)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition"
                        >
                          <span>{lang === 'ar' ? 'عرض التفاصيل والانتقال للحدث' : 'View Details & Go to Tab'}</span>
                          {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </button>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-1">
                        {!notif.isRead && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            title={lang === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                            className="p-1 rounded-md text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          title={lang === 'ar' ? 'حذف الإشعار' : 'Delete'}
                          className="p-1 rounded-md text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls */}
          {notifications.length > 0 && (
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
              </button>

              <button
                onClick={clearAllNotifications}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition"
              >
                {lang === 'ar' ? 'مسح كافة الإشعارات' : 'Clear all'}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
