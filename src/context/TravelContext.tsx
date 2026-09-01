import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Trip, 
  Activity, 
  Booking, 
  Expense, 
  TravelDocument, 
  PackingItem, 
  StoryEntry, 
  DayItinerary, 
  InterCityTripListing, 
  PlannedStop,
  AppNotification,
  NotificationType,
  NotificationPriority
} from '../types/travel';
import { loadTrips, saveTrips, getSavedActiveTripId, saveActiveTripId, getSavedLanguage, saveLanguage, getSavedTheme, saveTheme } from '../utils/storage';
import { INITIAL_INTERCITY_TRIPS } from '../data/yemenData';
import { playNotificationChime } from '../utils/audioChime';

export type TabType = 
  | 'overview' 
  | 'intercity_hub' // سوق وحجز الرحلات بين المحافظات الـ 22
  | 'fixed_plan'     // خطة السير الثابتة وأمان العائلة
  | 'itinerary'      // الجدول الزمني والأنشطة
  | 'map'            // خريطة المسار اليمني
  | 'driver_portal'  // بوابة السائقين والشركات
  | 'bookings'       // التذاكر والحجوزات
  | 'expenses'       // المصاريف والقطة بالريال اليمني/السعودي/الدولار
  | 'documents'      // خزينة الوثائق
  | 'packing'        // قائمة حقيبة السفر
  | 'stories';       // بداية القصة والذكريات التراثية

interface TravelContextType {
  trips: Trip[];
  activeTrip: Trip | undefined;
  activeTripId: string;
  setActiveTripId: (id: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lang: 'ar' | 'en';
  isRTL: boolean;
  setLang: (lang: 'ar' | 'en') => void;
  toggleLang: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Real-Time Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  liveToast: AppNotification | null;
  audioNotificationEnabled: boolean;
  toggleAudioNotification: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> & { id?: string }) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  dismissLiveToast: () => void;
  triggerTestNotification: (type?: NotificationType) => void;
  
  // Intercity Listings
  intercityListings: InterCityTripListing[];
  addIntercityListing: (listing: Omit<InterCityTripListing, 'id'>) => void;
  bookIntercityListing: (listing: InterCityTripListing, seatsCount: number, isFullCar: boolean, passengerName: string, passengerPhone: string) => void;
  
  // Trip management
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  approveTripPlan: (tripId: string) => void;
  togglePlannedStopComplete: (tripId: string, stopId: string) => void;
  addPlannedStop: (tripId: string, stop: Omit<PlannedStop, 'id'>) => void;
  
  // Day & Activity actions
  addDay: (tripId: string, title?: string, titleAr?: string) => void;
  addActivity: (tripId: string, dayId: string, activity: Omit<Activity, 'id' | 'dayId'>) => void;
  updateActivity: (tripId: string, activity: Activity) => void;
  toggleActivityComplete: (tripId: string, activityId: string) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  
  // Bookings
  addBooking: (tripId: string, booking: Omit<Booking, 'id'>) => void;
  deleteBooking: (tripId: string, bookingId: string) => void;
  
  // Expenses
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
  
  // Documents
  addDocument: (tripId: string, doc: Omit<TravelDocument, 'id'>) => void;
  deleteDocument: (tripId: string, docId: string) => void;
  
  // Packing
  addPackingItem: (tripId: string, item: Omit<PackingItem, 'id'>) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;
  generateSmartPacking: (tripId: string) => void;
  
  // Stories
  addStory: (tripId: string, story: Omit<StoryEntry, 'id'>) => void;
  deleteStory: (tripId: string, storyId: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const INTERCITY_LISTINGS_KEY = 'traveler_app_intercity_listings_v1';
const NOTIFICATIONS_KEY = 'traveler_app_notifications_v1';
const AUDIO_NOTIF_KEY = 'traveler_app_audio_notif_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-transit-departure-1',
    title: 'Transit Departure in 35 Minutes',
    titleAr: 'تنبيه موعد الانطلاق: رحلة النقل البري بعد 35 دقيقة',
    message: 'Toyota Land Cruiser Pronto to Hadhramaut is preparing for boarding at Sheikh Othman Station.',
    messageAr: 'مركبة تويوتا لاندكروزر برادو (خط عدن ➔ حضرموت) تستعد لاستقبال الركاب عند فرزة الشيخ عثمان. يرجى التواجد لتفقد الأمتعة.',
    type: 'transit_departure',
    priority: 'urgent',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    scheduledTime: '07:00 AM',
    timeRemainingMinutes: 35,
    targetTab: 'fixed_plan',
    locationName: 'فرزة الشيخ عثمان، عدن',
    isRead: false
  },
  {
    id: 'notif-activity-upcoming-2',
    title: 'Upcoming Itinerary Activity',
    titleAr: 'نشاط قادم: جولة حصن الغويزي وقصر الكثيري',
    message: 'Scheduled historical exploration starts today at 04:30 PM. Keep your travel camera and permit ready.',
    messageAr: 'النشاط المجدول في خطة السير يبدأ في تمام الساعة 04:30 مساءً. نوصي بتجهيز الهوية والكاميرا قبل التحرك.',
    type: 'activity_upcoming',
    priority: 'high',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    scheduledTime: '04:30 PM',
    timeRemainingMinutes: 50,
    targetTab: 'itinerary',
    locationName: 'قصر الكثيري وحصن الغويزي، حضرموت',
    isRead: false
  },
  {
    id: 'notif-stop-approaching-3',
    title: 'Approaching Rest Stop',
    titleAr: 'اقتراب محطة استراحة: بلحاف الساحلية',
    message: 'Estimated 15km to the certified lunch and prayer stop with family facilities.',
    messageAr: 'تبعد المحطة المعتمدة لتناول وجبة الغداء وصلاة الظهر حوالي 15 كم على خط السير المعتمد.',
    type: 'stop_approaching',
    priority: 'medium',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    scheduledTime: '12:30 PM',
    timeRemainingMinutes: 20,
    targetTab: 'fixed_plan',
    locationName: 'استراحة بلحاف الساحلية، شبوة',
    isRead: true
  },
  {
    id: 'notif-safety-4',
    title: 'Live Family Tracking & Backup Vehicle Verified',
    titleAr: 'أمان ومتابعة: تأكيد جاهزية المركبة البديلة',
    message: 'Tracking code YEM-7842 active. Route backup vehicle commitment confirmed with verified driver.',
    messageAr: 'تم تفعيل كود التتبع العائلي YEM-7842 وتأكيد التزام المركبة البديلة المعتمدة من الناقل.',
    type: 'safety_alert',
    priority: 'low',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    targetTab: 'fixed_plan',
    isRead: true
  }
];

export const TravelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(loadTrips);
  const [activeTripId, setActiveTripIdState] = useState<string>(getSavedActiveTripId);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [lang, setLangState] = useState<'ar' | 'en'>(getSavedLanguage);
  const [theme, setThemeState] = useState<'light' | 'dark'>(getSavedTheme);

  // Real-Time Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [liveToast, setLiveToast] = useState<AppNotification | null>(null);
  const [audioNotificationEnabled, setAudioNotificationEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUDIO_NOTIF_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [intercityListings, setIntercityListings] = useState<InterCityTripListing[]>(() => {
    try {
      const saved = localStorage.getItem(INTERCITY_LISTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INTERCITY_TRIPS;
  });

  const isRTL = lang === 'ar';

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem(INTERCITY_LISTINGS_KEY, JSON.stringify(intercityListings));
    } catch (e) {
      console.error(e);
    }
  }, [intercityListings]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_NOTIF_KEY, String(audioNotificationEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [audioNotificationEnabled]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    saveLanguage(lang);
  }, [lang, isRTL]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Notifications logic
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> & { id?: string }) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: notifData.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => {
      // Prevent duplicate identical alerts within short time
      const filtered = prev.filter(n => n.id !== newNotif.id);
      return [newNotif, ...filtered];
    });

    // Show live toast for high or urgent priority, or newly triggered alerts
    setLiveToast(newNotif);

    if (audioNotificationEnabled) {
      playNotificationChime(newNotif.priority);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (liveToast?.id === id) {
      setLiveToast(null);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setLiveToast(null);
  };

  const toggleAudioNotification = () => {
    setAudioNotificationEnabled(prev => !prev);
  };

  const dismissLiveToast = () => {
    setLiveToast(null);
  };

  const triggerTestNotification = (type?: NotificationType) => {
    const selectedType = type || (['transit_departure', 'activity_upcoming', 'stop_approaching', 'safety_alert'][Math.floor(Math.random() * 4)] as NotificationType);

    if (selectedType === 'transit_departure') {
      addNotification({
        title: 'Immediate Departure Alert: Vehicle Ready',
        titleAr: 'تنبيه فوري: انطلاق مركبة النقل في تمام 08:00 صباحاً',
        message: 'Your booked Toyota Prado (Aden ➔ Hadhramaut) driver is arriving at the pickup terminal in 15 minutes.',
        messageAr: 'كابتن الرحلة (تويوتا لاندكروزر برادو) وصل نقطة التجمع. يرجى التوجه للفرزة لتأكيد الصعود.',
        type: 'transit_departure',
        priority: 'urgent',
        scheduledTime: '08:00 AM',
        timeRemainingMinutes: 15,
        targetTab: 'fixed_plan',
        locationName: 'فرزة عدن المركزية'
      });
    } else if (selectedType === 'activity_upcoming') {
      addNotification({
        title: 'Upcoming Scheduled Activity',
        titleAr: 'تنبيه جدول الرحلة: نشاط قادم في غضون 25 دقيقة',
        message: 'Visit to Seiyun Sultan Palace & Old Souq starts soon. Please carry your identification documents.',
        messageAr: 'جولة استكشاف قصر الكثيري وسوق سيئون التراثي تبدأ بعد 25 دقيقة. ننصح بتجهيز الهويات والتصاريح.',
        type: 'activity_upcoming',
        priority: 'high',
        scheduledTime: '04:30 PM',
        timeRemainingMinutes: 25,
        targetTab: 'itinerary',
        locationName: 'سيئون، وادي حضرموت'
      });
    } else if (selectedType === 'stop_approaching') {
      addNotification({
        title: 'Approaching Approved Rest Stop',
        titleAr: 'محطة استراحة قادمة: استراحة طريق شبوة',
        message: 'Approaching the verified food and prayer stop (Rest Stop #2). ETA in 10 minutes.',
        messageAr: 'المركبة تقترب من استراحة الطريق المعتمدة لتناول الطعام وصلاة الظهر. الوصول المتوقع خلال 10 دقائق.',
        type: 'stop_approaching',
        priority: 'medium',
        scheduledTime: '12:45 PM',
        timeRemainingMinutes: 10,
        targetTab: 'fixed_plan',
        locationName: 'طريق شبوة الساحلي'
      });
    } else {
      addNotification({
        title: 'Route Safety & Family Tracking Verified',
        titleAr: 'تحديث الأمان العائلي: فحص المركبة ورمز التتبع',
        message: 'Family member tracking session updated successfully. Backup car standby confirmed.',
        messageAr: 'تم تحديث موقع خط السير للأهل بنجاح والتحقق من جاهزية شبكة الدعم والسيارة البديلة للطوارئ.',
        type: 'safety_alert',
        priority: 'low',
        targetTab: 'fixed_plan'
      });
    }
  };

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  // Real-time scanner for upcoming trip activities and departures
  useEffect(() => {
    const scanUpcomingEvents = () => {
      if (!activeTrip) return;

      // Scan planned activities
      const now = new Date();
      (activeTrip.days || []).forEach(day => {
        (day.activities || []).forEach(act => {
          if (!act.isCompleted) {
            const notifKey = `act-notif-${act.id}`;
            const exists = notifications.some(n => n.id === notifKey);
            if (!exists && act.time) {
              // E.g. timely activity reminder
            }
          }
        });
      });
    };

    scanUpcomingEvents();
    const interval = setInterval(scanUpcomingEvents, 60000); // scan every minute
    return () => clearInterval(interval);
  }, [activeTrip, notifications]);

  const setActiveTripId = (id: string) => {
    setActiveTripIdState(id);
    saveActiveTripId(id);
  };

  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
    setActiveTripId(trip.id);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeTripId === id && filtered.length > 0) {
        setActiveTripId(filtered[0].id);
      }
      return filtered;
    });
  };

  const approveTripPlan = (tripId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          isPlanApproved: true
        };
      }
      return t;
    }));
  };

  const togglePlannedStopComplete = (tripId: string, stopId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const stops = (t.plannedStops || []).map(s => {
          if (s.id === stopId) {
            return { ...s, isCompleted: !s.isCompleted };
          }
          return s;
        });
        return { ...t, plannedStops: stops };
      }
      return t;
    }));
  };

  const addPlannedStop = (tripId: string, stopData: Omit<PlannedStop, 'id'>) => {
    const newStop: PlannedStop = {
      ...stopData,
      id: `stop-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return { ...t, plannedStops: [...(t.plannedStops || []), newStop] };
      }
      return t;
    }));
  };

  const addIntercityListing = (listingData: Omit<InterCityTripListing, 'id'>) => {
    const newListing: InterCityTripListing = {
      ...listingData,
      id: `trip-list-${Date.now()}`
    };
    setIntercityListings(prev => [newListing, ...prev]);
  };

  const bookIntercityListing = (
    listing: InterCityTripListing,
    seatsCount: number,
    isFullCar: boolean,
    passengerName: string,
    passengerPhone: string
  ) => {
    // 1. Update available seats in listing
    setIntercityListings(prev => prev.map(item => {
      if (item.id === listing.id) {
        const newAvailable = isFullCar ? 0 : Math.max(0, item.availableSeats - seatsCount);
        return { ...item, availableSeats: newAvailable };
      }
      return item;
    }));

    // 2. Create or associate with active trip
    const cost = isFullCar ? listing.priceFullCar : listing.pricePerSeat * seatsCount;
    const newBooking: Booking = {
      id: `bk-inter-${Date.now()}`,
      type: listing.vehicleType === 'large_bus' ? 'bus' : 'intercity_car',
      provider: listing.operatorType === 'company' ? (listing.companyName || 'شركة نقل معتمدة') : listing.driverName,
      title: `رحلة بين المحافظات: ${listing.fromGovernorate} ➔ ${listing.toGovernorate}`,
      referenceNumber: `YEM-${Math.floor(100000 + Math.random() * 900000)}`,
      startDate: listing.departureDate,
      startTime: listing.departureTime,
      departureLocation: `${listing.fromGovernorate} — ${listing.fromCity}`,
      arrivalLocation: `${listing.toGovernorate} — ${listing.toCity}`,
      cost: cost,
      currency: listing.currency,
      status: 'confirmed',
      driverName: listing.driverName,
      driverPhone: listing.driverPhone,
      vehiclePlate: listing.vehiclePlateNumber,
      seatNumber: isFullCar ? 'استئجار سيارة كاملة خاصة' : `عدد المقاعد: ${seatsCount}`,
      trackingCode: listing.familyTrackingCode,
      isTripPlanApprovedByPassenger: true,
      notes: `المسافر: ${passengerName} (${passengerPhone}) - خطة سير ثابتة وضمان سيارة بديلة.`
    };

    if (activeTrip) {
      setTrips(prev => prev.map(t => {
        if (t.id === activeTrip.id) {
          return {
            ...t,
            bookings: [newBooking, ...(t.bookings || [])],
            assignedDriver: {
              name: listing.driverName,
              phone: listing.driverPhone,
              whatsapp: listing.driverWhatsapp,
              vehicleModel: listing.vehicleModel,
              plateNumber: listing.vehiclePlateNumber,
              isVerified: listing.isVerifiedDriver,
              hasBackupCarCommitment: listing.hasBackupCarCommitment
            },
            plannedStops: listing.plannedStops || t.plannedStops
          };
        }
        return t;
      }));
    }

    // Trigger instant booking notification alert
    addNotification({
      title: `Transit Departure Confirmed: ${listing.fromGovernorate} ➔ ${listing.toGovernorate}`,
      titleAr: `تم تأكيد حجز رحلة النقل: ${listing.fromGovernorate} ➔ ${listing.toGovernorate}`,
      message: `Confirmed booking with ${listing.driverName} (${listing.vehicleModel}). Scheduled departure at ${listing.departureTime}.`,
      messageAr: `تم تأكيد حجزك بنجاح مع الكابتن ${listing.driverName} (${listing.vehicleModel}). موعد الانطلاق المحدد: ${listing.departureTime}. تم تفعيل كود التتبع العائلي.`,
      type: 'transit_departure',
      priority: 'urgent',
      scheduledTime: listing.departureTime,
      targetTab: 'fixed_plan',
      locationName: `${listing.fromGovernorate} — ${listing.fromCity}`
    });
  };

  const addDay = (tripId: string, title?: string, titleAr?: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const nextDayNum = (trip.days?.length || 0) + 1;
      const newDay: DayItinerary = {
        id: `day-${Date.now()}`,
        dayNumber: nextDayNum,
        date: new Date(new Date(trip.startDate).getTime() + (nextDayNum - 1) * 86400000).toISOString().split('T')[0],
        title: title || `Day ${nextDayNum} Exploration`,
        titleAr: titleAr || `اليوم ${nextDayNum}: استكشاف وأنشطة`,
        activities: []
      };
      return { ...trip, days: [...(trip.days || []), newDay] };
    }));
  };

  const addActivity = (tripId: string, dayId: string, activityData: Omit<Activity, 'id' | 'dayId'>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const newAct: Activity = {
        ...activityData,
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dayId
      };
      const updatedDays = trip.days.map(d => {
        if (d.id === dayId) {
          return { ...d, activities: [...d.activities, newAct] };
        }
        return d;
      });
      return { ...trip, days: updatedDays };
    }));

    if (activityData.time) {
      addNotification({
        title: `Activity Scheduled: ${activityData.title}`,
        titleAr: `تمت جدولة نشاط جديد: ${activityData.titleAr || activityData.title}`,
        message: `Scheduled for ${activityData.time} at ${activityData.location || 'Yemen destination'}.`,
        messageAr: `تمت إضافة النشاط بنجاح في تمام الساعة ${activityData.time} في موقع: ${activityData.location || 'خطة المسار'}.`,
        type: 'activity_upcoming',
        priority: 'high',
        scheduledTime: activityData.time,
        targetTab: 'itinerary',
        locationName: activityData.location
      });
    }
  };

  const updateActivity = (tripId: string, updatedAct: Activity) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(d => {
        if (d.id === updatedAct.dayId) {
          return {
            ...d,
            activities: d.activities.map(a => a.id === updatedAct.id ? updatedAct : a)
          };
        }
        return d;
      });
      return { ...trip, days: updatedDays };
    }));
  };

  const toggleActivityComplete = (tripId: string, activityId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(d => ({
        ...d,
        activities: d.activities.map(a => a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a)
      }));
      return { ...trip, days: updatedDays };
    }));
  };

  const deleteActivity = (tripId: string, activityId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(d => ({
        ...d,
        activities: d.activities.filter(a => a.id !== activityId)
      }));
      return { ...trip, days: updatedDays };
    }));
  };

  const addBooking = (tripId: string, bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`
    };
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, bookings: [newBooking, ...(t.bookings || [])] } : t));
  };

  const deleteBooking = (tripId: string, bookingId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, bookings: t.bookings.filter(b => b.id !== bookingId) } : t));
  };

  const addExpense = (tripId: string, expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, expenses: [newExp, ...(t.expenses || [])] } : t));
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) } : t));
  };

  const addDocument = (tripId: string, docData: Omit<TravelDocument, 'id'>) => {
    const newDoc: TravelDocument = {
      ...docData,
      id: `doc-${Date.now()}`
    };
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, documents: [newDoc, ...(t.documents || [])] } : t));
  };

  const deleteDocument = (tripId: string, docId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, documents: t.documents.filter(d => d.id !== docId) } : t));
  };

  const addPackingItem = (tripId: string, itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: `pack-${Date.now()}`
    };
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, packingList: [...(t.packingList || []), newItem] } : t));
  };

  const togglePackingItem = (tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingList: (t.packingList || []).map(p => p.id === itemId ? { ...p, isPacked: !p.isPacked } : p)
      };
    }));
  };

  const deletePackingItem = (tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, packingList: t.packingList.filter(p => p.id !== itemId) } : t));
  };

  const generateSmartPacking = (tripId: string) => {
    const defaultSmartItems: Omit<PackingItem, 'id'>[] = [
      { name: 'Original National ID / Passport', nameAr: 'أصل البطاقة الشخصية وجواز السفر مع صور إضافية', category: 'essentials', isPacked: false, quantity: 1 },
      { name: 'Cash in YER and SAR banknotes', nameAr: 'مبالغ نقدية كاش لتغطية المحطات البعيدة بدون شبكة', category: 'essentials', isPacked: false, quantity: 1 },
      { name: 'High-Capacity Power Bank 20000mAh', nameAr: 'بنك طاقة عالي السعة للشحن المتنقل 20,000 مللي أمبير', category: 'electronics', isPacked: false, quantity: 2 },
      { name: 'Offline Map & Offline Route Data', nameAr: 'تحميل مسار الرحلة للاستخدام عند انقطاع الإنترنت', category: 'electronics', isPacked: false, quantity: 1 },
      { name: 'Car Multi-USB Rapid Charger', nameAr: 'شاحن سيارة متعدد المنافذ سريع', category: 'electronics', isPacked: false, quantity: 1 },
      { name: 'First-Aid Kit & Motion Sickness Medicine', nameAr: 'حقيبة إسعافات أولية وأدوية دوار الطرق الجبلية', category: 'medicine', isPacked: false, quantity: 1 },
      { name: 'Mineral Drinking Water & Dates', nameAr: 'كرتون مياه شرب معبأة وعبوة تمر طاقة للطريق', category: 'road_safety', isPacked: false, quantity: 2 },
      { name: 'LED Torch Light & Emergency Flashlight', nameAr: 'كشاف إضاءة يدوي قوي للطوارئ', category: 'road_safety', isPacked: false, quantity: 1 },
      { name: 'Light Layer & Comfortable Cotton Shoes', nameAr: 'ملابس قطنية مريحة مع سترة خفيفة للمناطق الجبلية', category: 'clothing', isPacked: false, quantity: 2 },
      { name: 'Personal Hygiene & Wet Wipes Pack', nameAr: 'مناديل مبللة ومعقم يدين ومستلزمات نظافة شخصية', category: 'toiletries', isPacked: false, quantity: 2 }
    ];

    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const existingNames = new Set((t.packingList || []).map(p => (p.nameAr || p.name).toLowerCase()));
      const itemsToAdd = defaultSmartItems
        .filter(item => !existingNames.has((item.nameAr || item.name).toLowerCase()))
        .map((item, index) => ({
          ...item,
          id: `smart-${Date.now()}-${index}`
        }));
      return { ...t, packingList: [...(t.packingList || []), ...itemsToAdd] };
    }));
  };

  const addStory = (tripId: string, storyData: Omit<StoryEntry, 'id'>) => {
    const newStory: StoryEntry = {
      ...storyData,
      id: `story-${Date.now()}`
    };
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, stories: [newStory, ...(t.stories || [])] } : t));
  };

  const deleteStory = (tripId: string, storyId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, stories: t.stories.filter(s => s.id !== storyId) } : t));
  };

  return (
    <TravelContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        activeTab,
        setActiveTab,
        lang,
        isRTL,
        setLang,
        toggleLang,
        theme,
        toggleTheme,
        notifications,
        unreadNotificationsCount,
        liveToast,
        audioNotificationEnabled,
        toggleAudioNotification,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        dismissLiveToast,
        triggerTestNotification,
        intercityListings,
        addIntercityListing,
        bookIntercityListing,
        addTrip,
        updateTrip,
        deleteTrip,
        approveTripPlan,
        togglePlannedStopComplete,
        addPlannedStop,
        addDay,
        addActivity,
        updateActivity,
        toggleActivityComplete,
        deleteActivity,
        addBooking,
        deleteBooking,
        addExpense,
        deleteExpense,
        addDocument,
        deleteDocument,
        addPackingItem,
        togglePackingItem,
        deletePackingItem,
        generateSmartPacking,
        addStory,
        deleteStory
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
