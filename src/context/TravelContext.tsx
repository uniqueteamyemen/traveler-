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
  NotificationPriority,
  UserProfile,
  UserRole,
  RoadPassAlert,
  TabType
} from '../types/travel';
import { loadTrips, saveTrips, getSavedActiveTripId, saveActiveTripId, getSavedLanguage, saveLanguage, getSavedTheme, saveTheme } from '../utils/storage';
import { INITIAL_INTERCITY_TRIPS } from '../data/yemenData';
import { playNotificationChime } from '../utils/audioChime';
import { 
  authService, 
  listingsService, 
  tripsService, 
  notificationsService, 
  roadPassesService,
  INITIAL_ROAD_PASSES 
} from '../services/firebaseService';
import { FirebaseUser } from '../lib/firebase';

export type { TabType };

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

  // Cloud Auth & User Roles
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginGuest: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole, driverData?: Partial<UserProfile>) => Promise<void>;

  // Real-Time Road Alerts
  roadAlerts: RoadPassAlert[];
  updateRoadAlertStatus: (alert: RoadPassAlert) => Promise<void>;

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
    message: 'Toyota Land Cruiser Prado to Hadhramaut is preparing for boarding at Sheikh Othman Station.',
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
    id: 'notif-road-pass-alert-3',
    title: 'Samarah Mountain Pass Weather Update',
    titleAr: 'تحديث عقبة سمارة: ضباب ورذاذ مطري',
    message: 'Fog formation reported on Samarah summit. Verified captains advise cautious descent.',
    messageAr: 'ورد تقرير ميداني بوجود ضباب كثيف ورذاذ مطري في قمة نقيل سمارة. يرجى الالتزام بالسرعة المحددة وتشغيل مصابيح الضباب.',
    type: 'safety_alert',
    priority: 'medium',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    targetTab: 'fixed_plan',
    locationName: 'عقبة سمارة، إب',
    isRead: false
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

  // Cloud Auth & User Profile State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Road Passes Alert State
  const [roadAlerts, setRoadAlerts] = useState<RoadPassAlert[]>(INITIAL_ROAD_PASSES);

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

  // 1. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Subscriptions for Listings, Trips, Notifications, and Road Passes
  useEffect(() => {
    const unsubListings = listingsService.subscribeToListings((cloudListings) => {
      if (cloudListings.length > 0) {
        setIntercityListings(cloudListings);
      }
    });

    const unsubTrips = tripsService.subscribeToTrips((cloudTrips) => {
      if (cloudTrips.length > 0) {
        setTrips(cloudTrips);
      }
    });

    const unsubNotifs = notificationsService.subscribeToNotifications((cloudNotifs) => {
      if (cloudNotifs.length > 0) {
        setNotifications(cloudNotifs);
      }
    });

    const unsubRoadAlerts = roadPassesService.subscribeToRoadAlerts((alerts) => {
      if (alerts.length > 0) {
        setRoadAlerts(alerts);
      }
    });

    return () => {
      unsubListings();
      unsubTrips();
      unsubNotifs();
      unsubRoadAlerts();
    };
  }, []);

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

  // Auth Action Methods
  const loginWithGoogle = async () => {
    const user = await authService.loginWithGoogle();
    const profile = await authService.getUserProfile(user.uid);
    setUserProfile(profile);
  };

  const loginGuest = async (role: UserRole = 'passenger') => {
    const user = await authService.loginGuest(role);
    const profile = await authService.getUserProfile(user.uid);
    setUserProfile(profile);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUserRole = async (role: UserRole, driverData?: Partial<UserProfile>) => {
    if (!currentUser) return;
    await authService.updateUserRole(currentUser.uid, role, driverData);
    const updated = await authService.getUserProfile(currentUser.uid);
    setUserProfile(updated);
  };

  const updateRoadAlertStatus = async (alert: RoadPassAlert) => {
    await roadPassesService.updateRoadStatus(alert);
    setRoadAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));

    // Broadcast safety notification to passengers and drivers
    addNotification({
      title: `Road Alert Update: ${alert.passNameEn}`,
      titleAr: `تحديث طريق: ${alert.passNameAr} (${alert.statusLabelAr})`,
      message: alert.descriptionAr,
      messageAr: alert.descriptionAr,
      type: 'safety_alert',
      priority: alert.status === 'blocked_maintenance' ? 'urgent' : 'medium',
      targetTab: 'fixed_plan',
      locationName: alert.passNameAr
    });
  };

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
      const filtered = prev.filter(n => n.id !== newNotif.id);
      return [newNotif, ...filtered];
    });

    // Cloud broadcast
    notificationsService.broadcastNotification(newNotif).catch(console.warn);

    // Show live toast for high or urgent priority
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
    notificationsService.deleteNotification(id).catch(console.warn);
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
    tripsService.saveTrip(trip).catch(console.warn);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    tripsService.saveTrip(updatedTrip).catch(console.warn);
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
        const updated = { ...t, isPlanApproved: true };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const togglePlannedStopComplete = (tripId: string, stopId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = {
          ...t,
          plannedStops: (t.plannedStops || []).map(s => 
            s.id === stopId ? { ...s, isCompleted: !s.isCompleted } : s
          )
        };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
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
        const updated = {
          ...t,
          plannedStops: [...(t.plannedStops || []), newStop]
        };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const addIntercityListing = (listingData: Omit<InterCityTripListing, 'id'>) => {
    const newListing: InterCityTripListing = {
      ...listingData,
      id: `intercity-${Date.now()}`
    };
    setIntercityListings(prev => [newListing, ...prev]);
    listingsService.addListing(newListing).catch(console.warn);
  };

  const bookIntercityListing = (
    listing: InterCityTripListing, 
    seatsCount: number, 
    isFullCar: boolean,
    passengerName: string,
    passengerPhone: string
  ) => {
    const actualSeats = isFullCar ? listing.totalSeats : seatsCount;
    setIntercityListings(prev => prev.map(l => {
      if (l.id === listing.id) {
        const updatedAvailable = Math.max(0, l.availableSeats - actualSeats);
        const updated = {
          ...l,
          availableSeats: updatedAvailable,
          isFullyBooked: updatedAvailable === 0
        };
        listingsService.addListing(updated).catch(console.warn);
        return updated;
      }
      return l;
    }));

    if (activeTrip) {
      const modeLabel = isFullCar 
        ? 'حجز سيارة كاملة خاصة VIP' 
        : `حجز بالنفر (${seatsCount} ${seatsCount > 1 ? 'مقاعد' : 'مقعد'})`;

      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        type: listing.vehicleType === 'large_bus' ? 'bus' : 'intercity_car',
        title: `${modeLabel}: ${listing.vehicleModel} (${listing.fromGovernorate} ➔ ${listing.toGovernorate})`,
        provider: listing.operatorType === 'company' ? (listing.companyName || 'شركة نقل معتمدة') : `الكابتن: ${listing.driverName}`,
        referenceNumber: `YEM-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'confirmed',
        startDate: listing.departureDate || new Date().toISOString().split('T')[0],
        startTime: listing.departureTime,
        cost: (isFullCar ? listing.priceFullCar : listing.pricePerSeat * seatsCount),
        currency: listing.currency,
        driverName: listing.driverName,
        driverPhone: listing.driverPhone,
        bookingMode: isFullCar ? 'full_car' : 'seat',
        seatsBooked: isFullCar ? listing.totalSeats : seatsCount,
        notes: `نوع الحجز: ${modeLabel} | الراكب: ${passengerName} | هاتف: ${passengerPhone} | كود تتبع الأمان نشط: ${listing.familyTrackingCode}`
      };

      setTrips(prev => prev.map(t => {
        if (t.id === activeTrip.id) {
          const updatedTrip = {
            ...t,
            bookings: [newBooking, ...(t.bookings || [])],
            assignedDriver: {
              name: listing.driverName,
              phone: listing.driverPhone,
              whatsapp: listing.driverWhatsapp,
              vehicleModel: listing.vehicleModel,
              plateNumber: 'لوحة نقل معتمدة',
              isVerified: listing.isVerifiedDriver,
              hasBackupCarCommitment: listing.hasBackupCarCommitment
            }
          };
          tripsService.saveTrip(updatedTrip).catch(console.warn);
          return updatedTrip;
        }
        return t;
      }));
    }

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
      if (trip.id === tripId) {
        const newDayNumber = trip.days.length + 1;
        const newDay: DayItinerary = {
          id: `day-${Date.now()}`,
          dayNumber: newDayNumber,
          date: new Date(Date.now() + (newDayNumber - 1) * 86400000).toISOString().split('T')[0],
          title: title || `Day ${newDayNumber}`,
          titleAr: titleAr || `اليوم ${newDayNumber}`,
          activities: []
        };
        const updated = { ...trip, days: [...trip.days, newDay] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return trip;
    }));
  };

  const addActivity = (tripId: string, dayId: string, activityData: Omit<Activity, 'id' | 'dayId'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
      dayId: dayId,
      isCompleted: false
    };

    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(day => {
        if (day.id === dayId) {
          return { ...day, activities: [...day.activities, newActivity] };
        }
        return day;
      });
      const updated = { ...trip, days: updatedDays };
      tripsService.saveTrip(updated).catch(console.warn);
      return updated;
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
      const updatedDays = trip.days.map(day => {
        if (day.id === updatedAct.dayId) {
          return {
            ...day,
            activities: day.activities.map(act => act.id === updatedAct.id ? updatedAct : act)
          };
        }
        return day;
      });
      const updated = { ...trip, days: updatedDays };
      tripsService.saveTrip(updated).catch(console.warn);
      return updated;
    }));
  };

  const toggleActivityComplete = (tripId: string, activityId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(day => ({
        ...day,
        activities: day.activities.map(act => 
          act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
        )
      }));
      const updated = { ...trip, days: updatedDays };
      tripsService.saveTrip(updated).catch(console.warn);
      return updated;
    }));
  };

  const deleteActivity = (tripId: string, activityId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = trip.days.map(day => ({
        ...day,
        activities: day.activities.filter(act => act.id !== activityId)
      }));
      const updated = { ...trip, days: updatedDays };
      tripsService.saveTrip(updated).catch(console.warn);
      return updated;
    }));
  };

  const addBooking = (tripId: string, bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, bookings: [newBooking, ...(t.bookings || [])] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const deleteBooking = (tripId: string, bookingId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, bookings: t.bookings.filter(b => b.id !== bookingId) };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const addExpense = (tripId: string, expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, expenses: [newExpense, ...(t.expenses || [])] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const addDocument = (tripId: string, docData: Omit<TravelDocument, 'id'>) => {
    const newDoc: TravelDocument = {
      ...docData,
      id: `doc-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, documents: [newDoc, ...(t.documents || [])] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const deleteDocument = (tripId: string, docId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, documents: t.documents.filter(d => d.id !== docId) };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const addPackingItem = (tripId: string, itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: `pack-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, packingList: [...(t.packingList || []), newItem] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const togglePackingItem = (tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = {
          ...t,
          packingList: (t.packingList || []).map(item => 
            item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
          )
        };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const deletePackingItem = (tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, packingList: (t.packingList || []).filter(item => item.id !== itemId) };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const generateSmartPacking = (tripId: string) => {
    const smartItems: Omit<PackingItem, 'id'>[] = [
      { name: 'National ID & Original Passport / أصل الهوية وجواز السفر', category: 'essentials', isPacked: false, quantity: 1 },
      { name: 'Security Pass Permits / تصاريح خط السير بين المحافظات', category: 'essentials', isPacked: false, quantity: 1 },
      { name: 'Vehicle Breakdown Tool Kit & Spare Tyre / عدة السيارة والسبير', category: 'road_safety', isPacked: false, quantity: 1 },
      { name: 'Heavy Powerbank (20,000mAh) / بنك طاقة وشواحن سيارة', category: 'electronics', isPacked: false, quantity: 1 },
      { name: 'High-Altitude Warm Jacket for Mountain Passes / جاكيت صوف دافئ لعقبات الجبال', category: 'clothing', isPacked: false, quantity: 1 },
      { name: 'First Aid & Altitude/Motion Sickness Pills / حبوب دوار السفر وإسعافات أولية', category: 'medicine', isPacked: false, quantity: 1 },
      { name: 'Cash in New & Old Yemeni Rial + SAR / كاش عملة قديمة وجديدة وريال سعودي', category: 'essentials', isPacked: false, quantity: 1 },
      { name: 'Highway Water & Dates Supply / قارورات ماء كافية وتمر للاستراحات', category: 'gear', isPacked: false, quantity: 1 }
    ];

    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const existingNames = new Set((t.packingList || []).map(i => i.name));
        const newItems: PackingItem[] = smartItems
          .filter(i => !existingNames.has(i.name))
          .map(i => ({ ...i, id: `pack-smart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` }));
        const updated = { ...t, packingList: [...(t.packingList || []), ...newItems] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const addStory = (tripId: string, storyData: Omit<StoryEntry, 'id'>) => {
    const newStory: StoryEntry = {
      ...storyData,
      id: `story-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, stories: [newStory, ...(t.stories || [])] };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
  };

  const deleteStory = (tripId: string, storyId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, stories: t.stories.filter(s => s.id !== storyId) };
        tripsService.saveTrip(updated).catch(console.warn);
        return updated;
      }
      return t;
    }));
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
        currentUser,
        userProfile,
        isAuthLoading,
        loginWithGoogle,
        loginGuest,
        logout,
        updateUserRole,
        roadAlerts,
        updateRoadAlertStatus,
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
