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
  TabType,
  TransportOffice,
  FleetVehicle,
  DriverVehicle,
  TripLifecycleStatus,
  TripConflictNotice,
  AppChatMessage,
  FAQItem
} from '../types/travel';
import { loadTrips, saveTrips, getSavedActiveTripId, saveActiveTripId, getSavedLanguage, saveLanguage, getSavedTheme, saveTheme } from '../utils/storage';
import { INITIAL_INTERCITY_TRIPS } from '../data/yemenData';
import { INITIAL_TRANSPORT_OFFICES } from '../data/transportOfficesData';
import { playNotificationChime } from '../utils/audioChime';
import { checkPlateCollision } from '../services/tripConflictService';
import { parseIncomingSMS, ParsedSMSResult } from '../services/smsTripService';
import { 
  authService, 
  listingsService, 
  transportOfficesService,
  tripsService, 
  notificationsService, 
  roadPassesService,
  vehiclesService,
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
  
  // Intercity Listings & Lifecycle
  intercityListings: InterCityTripListing[];
  addIntercityListing: (listing: Omit<InterCityTripListing, 'id'>) => void;
  bookIntercityListing: (listing: InterCityTripListing, seatsCount: number, isFullCar: boolean, passengerName: string, passengerPhone: string) => void;
  updateTripLifecycleStatus: (listingId: string, status: TripLifecycleStatus) => void;
  resolveTripConflict: (listingId: string, resolution: 'driver_confirmed' | 'office_confirmed' | 'synced_merged', notes?: string) => void;
  
  // Driver Garage & One-Time Verification (Free Individual Drivers)
  driverVehicles: DriverVehicle[];
  activeDriverVehicleId: string;
  setActiveDriverVehicleId: (id: string) => void;
  addDriverVehicle: (vehicle: Omit<DriverVehicle, 'id'>) => void;
  removeDriverVehicle: (vehicleId: string) => void;
  isDriverPhoneVerified: boolean;
  verifyDriverPhone: (phone: string, code?: string) => boolean;
  completeCaptainProfile: (
    profileData: {
      displayName: string;
      role: 'captain' | 'vehicle_owner' | 'driver';
      primaryPhone: string;
      secondaryPhone?: string;
      whatsappPhone: string;
      governorate?: string;
      idDocumentType?: 'national_id' | 'passport';
      idDocumentNumber?: string;
    },
    firstVehicle: Omit<DriverVehicle, 'id' | 'ownerId'>
  ) => Promise<void>;
  updateContactPhones: (primaryPhone: string, secondaryPhone: string, whatsappPhone: string) => Promise<void>;
  
  // In-App Support Chat & Community FAQ (Zero cost for users)
  chatMessages: AppChatMessage[];
  sendChatMessage: (text: string, category?: AppChatMessage['category']) => void;
  adminReplyChatMessage: (messageId: string, replyText: string) => void;
  faqs: FAQItem[];
  addFaqItem: (item: Omit<FAQItem, 'id'>) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // Offline SMS Trip Processing
  processDriverSMS: (smsText: string, senderPhone?: string) => ParsedSMSResult;
  
  // Transport Offices & Fleets & Admin Subscriptions
  transportOffices: TransportOffice[];
  addTransportOffice: (office: Omit<TransportOffice, 'id'>) => void;
  updateTransportOffice: (office: TransportOffice) => void;
  deleteTransportOffice: (officeId: string) => void;
  toggleOfficeVisibility: (officeId: string, isVisible: boolean, blockReason?: string) => void;
  updateOfficeSubscription: (officeId: string, updates: Partial<TransportOffice>) => void;
  addFleetVehicleToOffice: (officeId: string, vehicle: Omit<FleetVehicle, 'id'>) => void;
  deleteIntercityListing: (listingId: string) => void;
  toggleListingVerification: (listingId: string, isVerified: boolean) => void;
  adminSetFamilyTracking: (listingId: string, allowsTracking: boolean, customCode?: string) => void;
  
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
    messageAr: 'مركبة تويوتا لاندكروزر برادو (خط عدن ← حضرموت) تستعد لاستقبال الركاب عند فرزة الشيخ عثمان. يرجى التواجد لتفقد الأمتعة.',
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

const CHAT_MESSAGES_KEY = 'safar_app_chat_messages_v1';
const FAQS_KEY = 'safar_app_faqs_v1';

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    questionAr: 'هل التسجيل مجاني في تطبيق المسافر (Traveler)؟',
    answerAr: 'نعم، التسجيل مجاني 100% لجميع الكباتن وملاك السيارات والركاب. يمكنك تسجيل بياناتك وسيارتك الأولى والبدء مباشرة دون أي رسوم اشتراك.',
    targetAudience: 'all',
    category: 'التسجيل والحسابات'
  },
  {
    id: 'faq-2',
    questionAr: 'ما هي الوثائق المطلوبة لتسجيل الكابتن أو مالك السيارة؟',
    answerAr: 'يقبل التطبيق قانونياً البطاقة الشخصية أو جواز السفر اليمني. كما نتيح لك خيار التسجيل المبدئي وإضافة وثيقة الهوية لاحقاً في أي وقت يناسبك دون تعقيد.',
    targetAudience: 'captains',
    category: 'التوثيق والهوية'
  },
  {
    id: 'faq-3',
    questionAr: 'كيف تضمن المنصة ترويج رحلات الكابتن وجلب الركاب له؟',
    answerAr: 'تقوم إدارة منصة المسافر (Traveler) بترويج ونشر كافة الرحلات المجدولة عبر صفحات وحسابات المنصة على إنستغرام وفيسبوك، بالإضافة إلى نشرها في مجموعات السفر النشطة على واتساب وتيليجرام بين المحافظات لضمان حجز المقاعد.',
    targetAudience: 'captains',
    category: 'نشر الرحلات والترويج'
  },
  {
    id: 'faq-4',
    questionAr: 'ليس لدي رصيد هاتف، كيف أتواصل مع الإدارة أو الدعم؟',
    answerAr: 'نوفر لك في تطبيق المسافر خاصية «المحادثة المباشرة المجانية عبر التطبيق». يمكنك إرسال استفسارك أو طلبك وستصل رسالتك مباشرة للآدمن ويجيبك مجاناً دون الحاجة لرصيد مكالمات أو رسائل SMS.',
    targetAudience: 'all',
    category: 'الدعم والمحادثات'
  },
  {
    id: 'faq-5',
    questionAr: 'كيف يتم تفعيل كود التتبع والأمان العائلي للرحلة؟',
    answerAr: 'كود التتبع العائلي يخضع لإشراف ومصادقة حصرية من إدارة المنصة (الآدمن) لضمان أمان المسافرين والعائلات، وتزود العائلة برابط متابعة مباشر لمسار الرحلة.',
    targetAudience: 'travelers',
    category: 'الأمان والتتبع'
  },
  {
    id: 'faq-6',
    questionAr: 'هل سيتوفر تطبيق المسافر على متاجر Google Play و App Store؟',
    answerAr: 'يعمل تطبيق المسافر حالياً كتطبيق ويب تقدمي خفيف (PWA) يعمل فوراً على أي متصفح هاتف دون استهلاك ذاكرة، وسيتم إطلاق نسختي المتاجر الرسمية (Android و iOS) فور استكمال مرحلة جمع البيانات والتجربة.',
    targetAudience: 'all',
    category: 'تطبيقات الجوال'
  }
];

const INITIAL_CHAT_MESSAGES: AppChatMessage[] = [
  {
    id: 'chat-1',
    senderId: 'driver-101',
    senderName: 'الكابتن عبدالملك الحبيشي',
    senderRole: 'captain',
    senderPhone: '777412589',
    text: 'السلام عليكم يا إدارة، هل بالإمكان الترويج لرحلتي غداً صباحاً من صنعاء إلى عدن عبر الإنستغرام وجروبات الواتساب؟',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isFromAdmin: false,
    category: 'captain_question',
    readByAdmin: true
  },
  {
    id: 'chat-2',
    senderId: 'admin',
    senderName: 'إدارة منصة المسافر (Traveler)',
    senderRole: 'admin',
    recipientId: 'driver-101',
    text: 'وعليكم السلام ورحمة الله كابتن عبدالملك. تم إدراج رحلتك بالفعل في النشرة اليومية على حساب إنستغرام وفيسبوك ومجموعات المسافرين. نرجو لك رحلة آمنة وموفقة!',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    isFromAdmin: true,
    category: 'captain_question'
  },
  {
    id: 'chat-3',
    senderId: 'passenger-202',
    senderName: 'أم ريان الحضرمي',
    senderRole: 'traveler',
    senderPhone: '733984120',
    text: 'مرحبا، أبحث عن حجز سيارة عائلية كاملة VIP من المكلا إلى عدن مع كود تتبع عائلي معتمد، هل الخدمة متوفرة؟',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    isFromAdmin: false,
    category: 'trip_booking',
    readByAdmin: false
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

  const TRANSPORT_OFFICES_KEY = 'traveler_app_offices_v1';
  const DRIVER_VEHICLES_KEY = 'traveler_app_driver_vehicles_v1';
  const DRIVER_PHONE_VERIFIED_KEY = 'traveler_app_driver_verified_phone_v1';

  const INITIAL_DRIVER_GARAGE: DriverVehicle[] = [
    {
      id: 'dveh-1',
      model: 'تويوتا لاندكروزر صالون GXR V8',
      plateNumber: '12455 / صنعاء',
      vehicleType: 'suv_4x4',
      year: 2024,
      totalSeats: 4,
      color: 'أبيض لؤلؤي',
      isPrimary: true
    },
    {
      id: 'dveh-2',
      model: 'هيونداي ستاريا VIP H1',
      plateNumber: '88721 / عدن',
      vehicleType: 'microbus',
      year: 2023,
      totalSeats: 7,
      color: 'فضي ملكي',
      isPrimary: false
    }
  ];

  const [driverVehicles, setDriverVehicles] = useState<DriverVehicle[]>(() => {
    try {
      const saved = localStorage.getItem(DRIVER_VEHICLES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DRIVER_GARAGE;
  });

  const [activeDriverVehicleId, setActiveDriverVehicleId] = useState<string>(() => {
    return driverVehicles[0]?.id || 'dveh-1';
  });

  const [isDriverPhoneVerified, setIsDriverPhoneVerified] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DRIVER_PHONE_VERIFIED_KEY);
      return saved === 'true';
    } catch {
      return true; // Default true so new drivers can test immediately
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DRIVER_VEHICLES_KEY, JSON.stringify(driverVehicles));
    } catch (e) {
      console.error(e);
    }
  }, [driverVehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVER_PHONE_VERIFIED_KEY, String(isDriverPhoneVerified));
    } catch (e) {
      console.error(e);
    }
  }, [isDriverPhoneVerified]);

  const [transportOffices, setTransportOffices] = useState<TransportOffice[]>(() => {
    try {
      const saved = localStorage.getItem(TRANSPORT_OFFICES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSPORT_OFFICES;
  });

  // In-App Support Chat & Community FAQ State (Zero cost for users)
  const [chatMessages, setChatMessages] = useState<AppChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAQS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load faqs:', e);
    }
    return INITIAL_FAQS;
  });

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(chatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(FAQS_KEY, JSON.stringify(faqs));
    } catch (e) {
      console.error(e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSPORT_OFFICES_KEY, JSON.stringify(transportOffices));
    } catch (e) {
      console.error(e);
    }
  }, [transportOffices]);

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

    const unsubOffices = transportOfficesService.subscribeToOffices((cloudOffices) => {
      if (cloudOffices.length > 0) {
        setTransportOffices(cloudOffices);
      }
    });

    return () => {
      unsubListings();
      unsubTrips();
      unsubNotifs();
      unsubRoadAlerts();
      unsubOffices();
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

  // Hash & URL Query Navigation Listener for direct link to Captain & Vehicle Owner portal (#driver, #captain, #owner, ?tab=driver_portal, ?captain=1)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const isCaptainParam = 
        params.get('tab') === 'driver_portal' || 
        params.get('portal') === 'driver' || 
        params.get('portal') === 'captain' ||
        params.has('captain') || 
        params.has('driver') ||
        search.includes('captain') ||
        search.includes('driver');

      if (hash === '#driver' || hash === '#captain' || hash === '#portal' || hash === '#owner' || isCaptainParam) {
        setActiveTab('driver_portal');
      }
    };
    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

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

  const addDriverVehicle = (vehicleData: Omit<DriverVehicle, 'id'>) => {
    const uid = currentUser?.uid || userProfile?.uid || 'driver-user';
    const newVehicle: DriverVehicle = {
      ...vehicleData,
      id: `dveh-${Date.now()}`,
      ownerId: vehicleData.ownerId || uid,
      ownerName: vehicleData.ownerName || userProfile?.displayName || 'كابتن',
      ownerPhone: vehicleData.ownerPhone || userProfile?.primaryPhone || userProfile?.phoneNumber || '',
      createdAt: new Date().toISOString()
    };
    setDriverVehicles(prev => [newVehicle, ...prev]);
    setActiveDriverVehicleId(newVehicle.id);
    vehiclesService.saveVehicle(newVehicle).catch(console.warn);

    addNotification({
      title: 'Vehicle Added to Garage',
      titleAr: 'تمت إضافة السيارة لكراج المركبات بنجاح 🚗',
      message: `${newVehicle.model} (Plate: ${newVehicle.plateNumber}) added to your active vehicles.`,
      messageAr: `تم تسجيل ${newVehicle.model} (لوحة: ${newVehicle.plateNumber}) في كراجك لتحديدها بنقرة واحدة عند فتح أي رحلة.`,
      type: 'general',
      priority: 'low',
      targetTab: 'driver_portal'
    });
  };

  const removeDriverVehicle = (vehicleId: string) => {
    setDriverVehicles(prev => prev.filter(v => v.id !== vehicleId));
    vehiclesService.deleteVehicle(vehicleId).catch(console.warn);
  };

  const completeCaptainProfile = async (
    profileData: {
      displayName: string;
      role: 'captain' | 'vehicle_owner' | 'driver';
      primaryPhone: string;
      secondaryPhone?: string;
      whatsappPhone: string;
      governorate?: string;
      idDocumentType?: 'national_id' | 'passport';
      idDocumentNumber?: string;
    },
    firstVehicle: Omit<DriverVehicle, 'id' | 'ownerId'>
  ) => {
    const uid = currentUser?.uid || userProfile?.uid || `user-${Date.now()}`;
    const newVehicle: DriverVehicle = {
      ...firstVehicle,
      id: `dveh-${Date.now()}`,
      ownerId: uid,
      ownerName: profileData.displayName,
      ownerPhone: profileData.primaryPhone,
      isPrimary: true,
      createdAt: new Date().toISOString()
    };

    setDriverVehicles(prev => [newVehicle, ...prev.filter(v => v.id !== newVehicle.id)]);
    setActiveDriverVehicleId(newVehicle.id);
    vehiclesService.saveVehicle(newVehicle).catch(console.warn);

    const updatedProfile: UserProfile = {
      ...(userProfile || { uid, createdAt: new Date().toISOString() }),
      uid,
      displayName: profileData.displayName,
      primaryPhone: profileData.primaryPhone,
      secondaryPhone: profileData.secondaryPhone || '',
      whatsappPhone: profileData.whatsappPhone,
      phoneNumber: profileData.primaryPhone,
      role: profileData.role === 'vehicle_owner' ? 'vehicle_owner' : 'driver',
      roles: ['traveler', profileData.role === 'vehicle_owner' ? 'vehicle_owner' : 'driver'],
      userType: profileData.role === 'vehicle_owner' ? 'vehicle_owner' : 'captain',
      isProfileComplete: true,
      isPhoneVerified: true,
      isDriverVerified: true,
      idDocumentType: profileData.idDocumentType,
      idDocumentNumber: profileData.idDocumentNumber,
      governorate: profileData.governorate || 'عدن',
      registeredVehicles: [newVehicle],
      activeVehicleId: newVehicle.id,
      createdAt: userProfile?.createdAt || new Date().toISOString()
    };

    setUserProfile(updatedProfile);
    setIsDriverPhoneVerified(true);
    if (currentUser) {
      authService.completeUserProfile(currentUser.uid, updatedProfile).catch(console.warn);
    }

    addNotification({
      title: 'Captain Account Ready',
      titleAr: 'مرحباً بك في شبكة المسافر للكباتن والملاك 🇾🇪',
      message: `Account activated for ${profileData.displayName}. First vehicle registered!`,
      messageAr: `تم توثيق بياناتك بنجاح وتسجيل مركبتك الأولى (${newVehicle.model} - ${newVehicle.plateNumber}). يمكنك الآن فتح رحلاتك وتنسيق الركاب مباشرة.`,
      type: 'general',
      priority: 'high',
      targetTab: 'driver_portal'
    });
  };

  // In-App Chat Functions (Free Communication)
  const sendChatMessage = (text: string, category: AppChatMessage['category'] = 'general_inquiry') => {
    if (!text.trim()) return;
    const isSenderAdmin = userProfile?.role === 'admin' || 
      currentUser?.email?.toLowerCase() === 'baker@deterministicsolutionsdesign.com' || 
      currentUser?.email?.toLowerCase() === 'qpjiu.sea@gmail.com';

    const newMsg: AppChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser?.uid || userProfile?.uid || `guest-${Date.now()}`,
      senderName: userProfile?.displayName || (isSenderAdmin ? 'إدارة المسافر' : 'مستخدم المسافر'),
      senderRole: isSenderAdmin ? 'admin' : (userProfile?.role === 'vehicle_owner' ? 'vehicle_owner' : userProfile?.role === 'driver' ? 'captain' : 'traveler'),
      senderPhone: userProfile?.primaryPhone || userProfile?.phoneNumber || '',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isFromAdmin: isSenderAdmin,
      category,
      readByAdmin: isSenderAdmin
    };

    setChatMessages(prev => [newMsg, ...prev]);

    addNotification({
      title: 'Support Message Sent',
      titleAr: 'تم إرسال استفسارك للإدارة بنجاح 💬',
      message: 'Your inquiry has been sent to Traveler admin. Response will appear directly here without call charges.',
      messageAr: 'تم تسليم استفسارك لإدارة المسافر (Traveler) بنجاح دون أي تكلفة اتصال. ستتلقى الإجابة والمتابعة مباشرة هنا.',
      type: 'general',
      priority: 'low',
      targetTab: 'overview'
    });
  };

  const adminReplyChatMessage = (targetMessageId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const targetMsg = chatMessages.find(m => m.id === targetMessageId);
    const reply: AppChatMessage = {
      id: `chat-reply-${Date.now()}`,
      senderId: 'admin',
      senderName: 'إدارة منصة المسافر (Traveler)',
      senderRole: 'admin',
      recipientId: targetMsg?.senderId,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
      isFromAdmin: true,
      category: targetMsg?.category || 'general_inquiry',
      readByAdmin: true
    };

    setChatMessages(prev => [
      reply,
      ...prev.map(m => m.id === targetMessageId ? { ...m, readByAdmin: true } : m)
    ]);

    addNotification({
      title: 'Support Reply Dispatched',
      titleAr: 'تم إرسال رد الإدارة إلى الطرف المعني ✉️',
      message: `Reply delivered to ${targetMsg?.senderName || 'user'}.`,
      messageAr: `تم إرسال رد الدعم إلى ${targetMsg?.senderName || 'المستخدم'} مباشرة داخل التطبيق.`,
      type: 'general',
      priority: 'medium',
      targetTab: 'admin_control'
    });
  };

  const addFaqItem = (item: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      ...item,
      id: `faq-${Date.now()}`
    };
    setFaqs(prev => [newFaq, ...prev]);
    addNotification({
      title: 'FAQ Added',
      titleAr: 'تم توثيق السؤال في الأسئلة الشائعة 💡',
      message: item.questionAr,
      messageAr: `تمت إضافة السؤال "${item.questionAr}" بنجاح إلى قسم الأسئلة الشائعة المعتمدة.`,
      type: 'general',
      priority: 'low',
      targetTab: 'admin_control'
    });
  };

  const updateContactPhones = async (primaryPhone: string, secondaryPhone: string, whatsappPhone: string) => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      primaryPhone,
      secondaryPhone,
      whatsappPhone,
      phoneNumber: primaryPhone
    };
    setUserProfile(updated);
    if (currentUser) {
      authService.updateUserProfile(currentUser.uid, {
        primaryPhone,
        secondaryPhone,
        whatsappPhone,
        phoneNumber: primaryPhone
      }).catch(console.warn);
    }
    addNotification({
      title: 'Contact Phones Updated',
      titleAr: 'تم حفظ أرقام التواصل بنجاح 📞',
      message: 'Your call phones and WhatsApp number are now updated.',
      messageAr: 'تم تحديث هاتفك الأساسي ورقم الواتساب بنجاح لضمان تواصل الركاب معك.',
      type: 'general',
      priority: 'medium',
      targetTab: 'driver_portal'
    });
  };

  const verifyDriverPhone = (phone: string, code?: string): boolean => {
    setIsDriverPhoneVerified(true);
    if (currentUser) {
      authService.updateUserRole(currentUser.uid, 'driver', {
        phoneNumber: phone,
        isPhoneVerified: true,
        isDriverVerified: true
      }).catch(console.warn);
    }
    addNotification({
      title: 'Phone Verified Successfully',
      titleAr: 'تم التحقق من رقم الهاتف بنجاح 🟢',
      message: `Captain account (${phone}) verified. You can now open unlimited trips.`,
      messageAr: `تم توثيق وتأكيد رقم الهاتف (${phone}) بنجاح. حسابك مفعل لفتح الرحلات واستقبال الركاب مجاناً.`,
      type: 'general',
      priority: 'medium',
      targetTab: 'driver_portal'
    });
    return true;
  };

  const updateTripLifecycleStatus = (listingId: string, status: TripLifecycleStatus) => {
    const nowStr = new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    let targetListing: InterCityTripListing | undefined;

    setIntercityListings(prev => prev.map(l => {
      if (l.id === listingId) {
        targetListing = l;
        const updated: InterCityTripListing = {
          ...l,
          tripStatus: status,
          statusUpdatedAt: nowStr,
          availableSeats: status === 'full' ? 0 : (status === 'arrived' ? 0 : l.availableSeats)
        };
        listingsService.addListing(updated).catch(console.warn);
        return updated;
      }
      return l;
    }));

    if (status === 'departed') {
      addNotification({
        title: 'Trip Departed & Live Tracking Activated',
        titleAr: '🚀 انطلاق الرحلة: تحركت المركبة وبدء التتبع الحي',
        message: `Trip (${targetListing?.fromGovernorate} ➔ ${targetListing?.toGovernorate}) is now in transit.`,
        messageAr: `أعطى الكابتن ${targetListing?.driverName || ''} إشارة الانطلاق للمركبة. تم تفعيل التتبع الحي وبث الإشعارات للعائلات والركاب.`,
        type: 'transit_departure',
        priority: 'urgent',
        targetTab: 'fixed_plan',
        locationName: targetListing?.fromGovernorate
      });
    } else if (status === 'arrived') {
      addNotification({
        title: 'Trip Arrived & Successfully Completed',
        titleAr: '🏁 وصول بالسلامة: تم إغلاق وأرشفة الرحلة',
        message: `Vehicle arrived at destination (${targetListing?.toGovernorate}). Driver ready for next route!`,
        messageAr: `حمداً لله على السلامة! أتمت الرحلة وصولها إلى ${targetListing?.toGovernorate}. الحساب جاهز لفتح رحلة جديدة بدون إعادة تسجيل.`,
        type: 'general',
        priority: 'high',
        targetTab: 'driver_portal'
      });
    } else if (status === 'full') {
      addNotification({
        title: 'Seats Full',
        titleAr: '✅ اكتملت المقاعد: السيارة جاهزة للتحرك',
        message: 'All seats booked. Ready for departure.',
        messageAr: 'تم حجز كافة مقاعد الرحلة بالكامل وتأكيد قائمة الركاب.',
        type: 'general',
        priority: 'medium',
        targetTab: 'driver_portal'
      });
    }
  };

  const resolveTripConflict = (
    listingId: string, 
    resolution: 'driver_confirmed' | 'office_confirmed' | 'synced_merged',
    notes?: string
  ) => {
    setIntercityListings(prev => {
      const target = prev.find(l => l.id === listingId);
      const conflictingId = target?.conflictNotice?.conflictingListingId;

      return prev.map(l => {
        if (l.id === listingId || (conflictingId && l.id === conflictingId)) {
          const updated: InterCityTripListing = {
            ...l,
            conflictNotice: l.conflictNotice ? {
              ...l.conflictNotice,
              resolutionStatus: resolution,
              resolutionNotes: notes || 'تمت المطابقة والاعتماد بالتنسيق بين الجهتين'
            } : undefined
          };
          listingsService.addListing(updated).catch(console.warn);
          return updated;
        }
        return l;
      });
    });

    addNotification({
      title: 'Trip Conflict Resolved',
      titleAr: 'تم فض تعارض رحلة لوحة السيارة بنجاح',
      message: `Conflict resolution set to ${resolution}.`,
      messageAr: `تمت تسوية وتأكيد الرحلة للوحة المركبة بنجاح.`,
      type: 'general',
      priority: 'medium',
      targetTab: 'admin_control'
    });
  };

  const addIntercityListing = (listingData: Omit<InterCityTripListing, 'id'>) => {
    const newId = `intercity-${Date.now()}`;
    const initialStatus: TripLifecycleStatus = listingData.tripStatus || 'open';
    
    // Check Plate Collision with existing listings
    const collision = checkPlateCollision(listingData, intercityListings);

    let finalConflictNotice: TripConflictNotice | undefined = undefined;

    if (collision.hasConflict && collision.conflictingListing && collision.conflictNotice) {
      finalConflictNotice = collision.conflictNotice;

      // Update the conflicting listing too
      setIntercityListings(prev => prev.map(l => {
        if (l.id === collision.conflictingListing?.id) {
          const updatedConflicting: InterCityTripListing = {
            ...l,
            conflictNotice: {
              isConflictDetected: true,
              conflictingListingId: newId,
              conflictingEntityName: listingData.operatorType === 'company' ? (listingData.companyName || 'مكتب نقل') : listingData.driverName,
              conflictingEntityType: listingData.operatorType,
              matchedPlateNumber: listingData.vehiclePlateNumber,
              detectedAt: new Date().toISOString(),
              resolutionStatus: 'unresolved'
            }
          };
          listingsService.addListing(updatedConflicting).catch(console.warn);
          return updatedConflicting;
        }
        return l;
      }));

      // Broadcast urgent collision alert
      addNotification({
        title: 'Vehicle Plate Conflict Detected!',
        titleAr: `⚠️ تنبيه تعارض: تكرار لوحة المركبة [${listingData.vehiclePlateNumber}]`,
        message: `Trip collision between ${listingData.driverName} and ${collision.conflictingListing.driverName || collision.conflictingListing.companyName}.`,
        messageAr: `تم رصد إعلانين لنفس لوحة السيارة (${listingData.vehiclePlateNumber}) لتاريخ ${listingData.departureDate} بين (${listingData.operatorType === 'company' ? listingData.companyName : listingData.driverName}) و (${collision.conflictingListing.companyName || collision.conflictingListing.driverName}). تم إشعار الطرفين ومسافري الرحلة للتأكيد.`,
        type: 'safety_alert',
        priority: 'urgent',
        targetTab: 'admin_control'
      });
    }

    const newListing: InterCityTripListing = {
      ...listingData,
      id: newId,
      tripStatus: initialStatus,
      statusUpdatedAt: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
      conflictNotice: finalConflictNotice
    };

    setIntercityListings(prev => [newListing, ...prev]);
    listingsService.addListing(newListing).catch(console.warn);
  };

  const processDriverSMS = (smsText: string, senderPhone?: string): ParsedSMSResult => {
    const result = parseIncomingSMS(smsText, senderPhone || '+967770000000');

    if (!result.success) {
      return result;
    }

    if (result.action === 'open_trip' && result.createdListing) {
      addIntercityListing(result.createdListing as Omit<InterCityTripListing, 'id'>);
    } else if (result.action === 'depart_trip' && result.targetTripCode) {
      const match = intercityListings.find(l => l.familyTrackingCode.includes(result.targetTripCode!) || l.vehiclePlateNumber.includes(result.targetTripCode!));
      if (match) {
        updateTripLifecycleStatus(match.id, 'departed');
      }
    } else if (result.action === 'arrive_trip' && result.targetTripCode) {
      const match = intercityListings.find(l => l.familyTrackingCode.includes(result.targetTripCode!) || l.vehiclePlateNumber.includes(result.targetTripCode!));
      if (match) {
        updateTripLifecycleStatus(match.id, 'arrived');
      }
    } else if (result.action === 'mark_full' && result.targetTripCode) {
      const match = intercityListings.find(l => l.familyTrackingCode.includes(result.targetTripCode!) || l.vehiclePlateNumber.includes(result.targetTripCode!));
      if (match) {
        updateTripLifecycleStatus(match.id, 'full');
      }
    } else if (result.action === 'road_alert') {
      addNotification({
        title: 'SMS Road Alert from Captain',
        titleAr: '⚠️ تنبيه طريق من الكابتن (عبر SMS)',
        message: result.roadAlertText || 'Road hazard reported.',
        messageAr: `ورد تنبيه عاجل من كابتن الرحلة عبر SMS: ${result.roadAlertText}`,
        type: 'safety_alert',
        priority: 'urgent',
        targetTab: 'fixed_plan'
      });
    }

    return result;
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
        title: `${modeLabel}: ${listing.vehicleModel} (${listing.fromGovernorate} ← ${listing.toGovernorate})`,
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
      titleAr: `تم تأكيد حجز رحلة النقل: ${listing.fromGovernorate} ← ${listing.toGovernorate}`,
      message: `Confirmed booking with ${listing.driverName} (${listing.vehicleModel}). Scheduled departure at ${listing.departureTime}.`,
      messageAr: `تم تأكيد حجزك بنجاح مع الكابتن ${listing.driverName} (${listing.vehicleModel}). موعد الانطلاق المحدد: ${listing.departureTime}. تم تفعيل كود التتبع العائلي.`,
      type: 'transit_departure',
      priority: 'urgent',
      scheduledTime: listing.departureTime,
      targetTab: 'fixed_plan',
      locationName: `${listing.fromGovernorate} — ${listing.fromCity}`
    });
  };

  const addTransportOffice = (officeData: Omit<TransportOffice, 'id'>) => {
    const newOffice: TransportOffice = {
      ...officeData,
      id: `office-${Date.now()}`
    };
    setTransportOffices(prev => [newOffice, ...prev]);
    transportOfficesService.saveOffice(newOffice).catch(console.warn);
  };

  const updateTransportOffice = (office: TransportOffice) => {
    setTransportOffices(prev => prev.map(o => o.id === office.id ? office : o));
    transportOfficesService.saveOffice(office).catch(console.warn);
  };

  const deleteTransportOffice = (officeId: string) => {
    setTransportOffices(prev => prev.filter(o => o.id !== officeId));
    transportOfficesService.deleteOffice(officeId).catch(console.warn);
    addNotification({
      title: 'Transport Office Removed',
      titleAr: 'تم حذف المكتب وإلغاء ظهوره في شبكة المسافر',
      message: 'Transport office profile deleted by administrator.',
      messageAr: 'تم حذف ملف وبيانات المكتب من لوحة الإدارة بنجاح.',
      type: 'general',
      priority: 'low',
      targetTab: 'admin_control'
    });
  };

  const toggleOfficeVisibility = (officeId: string, isVisible: boolean, blockReason?: string) => {
    setTransportOffices(prev => prev.map(o => {
      if (o.id === officeId) {
        const updated: TransportOffice = {
          ...o,
          isVisibleToPublic: isVisible,
          subscriptionStatus: isVisible ? 'active' : 'suspended',
          adminBlockReason: isVisible ? undefined : (blockReason || 'محجوب بقرار إداري لعدم تجديد الاشتراك الشهري')
        };
        transportOfficesService.updateSubscription(officeId, {
          isVisibleToPublic: isVisible,
          subscriptionStatus: isVisible ? 'active' : 'suspended',
          adminBlockReason: isVisible ? undefined : (blockReason || 'محجوب بقرار إداري لعدم تجديد الاشتراك الشهري')
        }).catch(console.warn);
        return updated;
      }
      return o;
    }));

    addNotification({
      title: isVisible ? 'Office Activated' : 'Office Blocked',
      titleAr: isVisible ? 'تم تفعيل وإظهار المكتب في السوق' : 'تم حجب المكتب من الظهور العام',
      message: `Office visibility status updated to ${isVisible ? 'Visible' : 'Hidden'}.`,
      messageAr: isVisible ? 'أصبح المكتب ظاهراً للجمهور والمسافرين في تطبيق المسافر.' : 'تم حجب هذا المكتب والأسطول التابع له عن الجمهور لعدم الاشتراك.',
      type: 'general',
      priority: isVisible ? 'medium' : 'high',
      targetTab: 'admin_control'
    });
  };

  const updateOfficeSubscription = (officeId: string, updates: Partial<TransportOffice>) => {
    setTransportOffices(prev => prev.map(o => {
      if (o.id === officeId) {
        const updated = { ...o, ...updates };
        transportOfficesService.updateSubscription(officeId, updates).catch(console.warn);
        return updated;
      }
      return o;
    }));

    addNotification({
      title: 'Subscription Updated',
      titleAr: 'تم تحديث بيانات اشتراك المكتب بنجاح',
      message: 'Subscription tier and validity period updated by administrator.',
      messageAr: 'تم حفظ باقة الاشتراك وتاريخ الصلاحية الجديد للمكتب.',
      type: 'general',
      priority: 'medium',
      targetTab: 'admin_control'
    });
  };

  const deleteIntercityListing = (listingId: string) => {
    setIntercityListings(prev => prev.filter(l => l.id !== listingId));
    listingsService.deleteListing(listingId).catch(console.warn);
  };

  const toggleListingVerification = (listingId: string, isVerified: boolean) => {
    setIntercityListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const updated = { ...l, isVerifiedDriver: isVerified };
        listingsService.addListing(updated).catch(console.warn);
        return updated;
      }
      return l;
    }));
  };

  const adminSetFamilyTracking = (listingId: string, allowsTracking: boolean, customCode?: string) => {
    setIntercityListings(prev => prev.map(l => {
      if (l.id === listingId) {
        let code = l.familyTrackingCode;
        if (allowsTracking && (!code || code.trim() === '')) {
          const fromGovInitial = l.fromGovernorate?.substring(0, 2) || 'AD';
          code = customCode || `YEM-${fromGovInitial}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        const updated = { 
          ...l, 
          allowsFamilyTracking: allowsTracking,
          familyTrackingCode: allowsTracking ? (customCode || code) : ''
        };
        listingsService.addListing(updated).catch(console.warn);
        return updated;
      }
      return l;
    }));
  };

  const addFleetVehicleToOffice = (officeId: string, vehicleData: Omit<FleetVehicle, 'id'>) => {
    const newVehicle: FleetVehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`
    };
    setTransportOffices(prev => prev.map(o => {
      if (o.id === officeId) {
        return {
          ...o,
          fleetVehicles: [newVehicle, ...(o.fleetVehicles || [])]
        };
      }
      return o;
    }));
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
        updateTripLifecycleStatus,
        resolveTripConflict,
        driverVehicles,
        activeDriverVehicleId,
        setActiveDriverVehicleId,
        addDriverVehicle,
        removeDriverVehicle,
        isDriverPhoneVerified,
        verifyDriverPhone,
        completeCaptainProfile,
        updateContactPhones,
        chatMessages,
        sendChatMessage,
        adminReplyChatMessage,
        faqs,
        addFaqItem,
        isChatOpen,
        setIsChatOpen,
        processDriverSMS,
        transportOffices,
        addTransportOffice,
        updateTransportOffice,
        deleteTransportOffice,
        toggleOfficeVisibility,
        updateOfficeSubscription,
        addFleetVehicleToOffice,
        deleteIntercityListing,
        toggleListingVerification,
        adminSetFamilyTracking,
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
