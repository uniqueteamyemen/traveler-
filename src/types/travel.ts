export type CurrencyCode = 'YER' | 'SAR' | 'USD' | 'AED' | 'EUR' | 'GBP';

export type TabType = 
  | 'overview' 
  | 'intercity_hub' // سوق وحجز الرحلات بين المحافظات الـ 22
  | 'fixed_plan'     // خطة السير الثابتة وأمان العائلة
  | 'itinerary'      // الجدول الزمني والأنشطة
  | 'map'            // خريطة المسار اليمني
  | 'driver_portal'  // بوابة السائقين والشركات
  | 'admin_control'  // لوحة تحكم الإدارة الشاملة وحجب المكاتب والاشتراكات
  | 'bookings'       // التذاكر والحجوزات
  | 'expenses'       // المصاريف والقطة بالريال اليمني/السعودي/الدولار
  | 'documents'      // خزينة الوثائق
  | 'packing'        // قائمة حقيبة السفر
  | 'stories';       // بداية القصة والذكريات التراثية

export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'flight' 
  | 'hotel' 
  | 'transport' 
  | 'nature' 
  | 'shopping' 
  | 'culture' 
  | 'relaxation'
  | 'checkpoint'
  | 'rest_stop';

export interface PlannedStop {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'rest_food' | 'restroom' | 'prayer' | 'checkpoint' | 'fuel' | 'scenic';
  estimatedTime: string;
  durationMinutes: number;
  locationName: string;
  isCompleted?: boolean;
  notes?: string;
}

export type TripLifecycleStatus = 'open' | 'full' | 'departed' | 'arrived' | 'cancelled';

export interface TripConflictNotice {
  isConflictDetected: boolean;
  conflictingListingId: string;
  conflictingEntityName: string;
  conflictingEntityType: 'individual' | 'company';
  matchedPlateNumber: string;
  detectedAt: string;
  resolutionStatus: 'unresolved' | 'driver_confirmed' | 'office_confirmed' | 'synced_merged';
  resolutionNotes?: string;
}

export interface DriverVehicle {
  id: string;
  ownerId?: string; // UID of the captain or vehicle owner
  ownerName?: string;
  ownerPhone?: string;
  model: string;
  plateNumber: string;
  vehicleType: 'sedan' | 'suv_4x4' | 'vip_limousine' | 'microbus' | 'large_bus';
  year: number;
  totalSeats: number;
  color?: string;
  photoUrl?: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface InterCityTripListing {
  id: string;
  driverName: string;
  driverPhone: string;
  driverWhatsapp: string;
  driverPhoto: string;
  driverRating: number;
  totalTripsCompleted: number;
  isVerifiedDriver: boolean;
  hasMechanicalPass: boolean;
  hasBackupCarCommitment: boolean;
  
  // Security & Ownership
  driverUid?: string;
  ownerUid?: string;
  vehicleId?: string;
  
  // Trip Lifecycle
  tripStatus?: TripLifecycleStatus; // 'open' | 'full' | 'departed' | 'arrived' | 'cancelled'
  statusUpdatedAt?: string;
  
  // Collision / Duplicate Plate Detection
  conflictNotice?: TripConflictNotice;
  
  // Company or Individual
  operatorType: 'individual' | 'company';
  companyName?: string;
  companyLogo?: string;
  officeId?: string;
  
  // Route
  fromGovernorate: string;
  fromCity: string;
  toGovernorate: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  estimatedDurationHours: number;
  
  // Trip Type
  tripNature: 'outbound' | 'return_match'; // رحلة ذهاب أو رحلة راجع
  
  // Vehicle details
  vehicleType: 'sedan' | 'suv_4x4' | 'vip_limousine' | 'microbus' | 'large_bus';
  vehicleModel: string; // e.g. Land Cruiser GXR, Hyundai Staria, Mercedes Bus
  vehicleYear: number;
  vehiclePlateNumber: string;
  vehiclePhoto: string;
  airConditioned: boolean;
  luggageCapacityBags: number;
  
  // Capacity & Pricing
  allowedBookingModes?: ('seat' | 'full_car')[]; // طرق الحجز: بالنفر (أفراد) أو سيارة كاملة (مشوار خاص)
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  priceFullCar: number;
  currency: CurrencyCode;
  
  // Fixed Stops & Safety
  plannedStops: PlannedStop[];
  allowsFamilyTracking: boolean;
  familyTrackingCode: string;
  notes?: string;
  
  // Offline SMS Metadata
  createdViaSMS?: boolean;
}

export interface Activity {
  id: string;
  dayId: string;
  time: string;
  title: string;
  titleAr?: string;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  category: ActivityCategory;
  cost?: number;
  currency?: CurrencyCode;
  isCompleted: boolean;
  notes?: string;
  bookingRef?: string;
}

export interface DayItinerary {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  titleAr?: string;
  activities: Activity[];
}

export interface Booking {
  id: string;
  type: 'intercity_car' | 'bus' | 'flight' | 'hotel' | 'activity';
  provider: string;
  title: string;
  referenceNumber: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  address?: string;
  cost: number;
  currency: CurrencyCode;
  status: 'confirmed' | 'pending' | 'cancelled';
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  seatNumber?: string;
  bookingMode?: 'seat' | 'full_car'; // حجز بالنفر (أفراد) أو سيارة كاملة (مشوار خاص)
  seatsBooked?: number;
  trackingCode?: string;
  isTripPlanApprovedByPassenger?: boolean;
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: 'food' | 'transport' | 'accommodation' | 'shopping' | 'activities' | 'fuel' | 'road_tolls' | 'other';
  date: string;
  paidBy: string;
  splitWith?: string[];
  notes?: string;
}

export interface TravelDocument {
  id: string;
  title: string;
  type: 'id_card' | 'passport' | 'travel_permit' | 'car_license' | 'insurance' | 'ticket' | 'other';
  holderName: string;
  documentNumber?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  notes?: string;
  fileUrl?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  nameAr?: string;
  category: 'essentials' | 'clothing' | 'electronics' | 'toiletries' | 'medicine' | 'gear' | 'road_safety';
  isPacked: boolean;
  quantity: number;
  notes?: string;
}

export interface StoryEntry {
  id: string;
  date: string;
  title: string;
  governorate?: string;
  location: string;
  mood: 'ecstatic' | 'happy' | 'peaceful' | 'adventurous' | 'inspired';
  storyText: string;
  photos: string[];
  rating?: number;
  tags: string[];
  culturalTip?: string;
}

export interface GovernorateInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  region: 'south' | 'north' | 'east' | 'west' | 'islands';
  capital: string;
  highlights: string[];
  traditionalFood: string[];
  famousProducts: string[]; // e.g. بن حرازي، عسل دوعني، تمور
  coordinates: {
    lat: number;
    lng: number;
  };
  bestSeason: string;
  image: string;
}

export interface Trip {
  id: string;
  title: string;
  titleAr: string;
  destination: string;
  origin: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: CurrencyCode;
  travelers: string[];
  description: string;
  
  // Governorate focus
  originGovernorate: string;
  destinationGovernorate: string;
  
  // Safety & Fixed Plan
  isPlanApproved: boolean;
  trackingCode: string;
  assignedDriver?: {
    name: string;
    phone: string;
    whatsapp: string;
    vehicleModel: string;
    plateNumber: string;
    isVerified: boolean;
    hasBackupCarCommitment: boolean;
  };
  
  coordinates: {
    lat: number;
    lng: number;
  };
  
  plannedStops: PlannedStop[];
  days: DayItinerary[];
  bookings: Booking[];
  expenses: Expense[];
  documents: TravelDocument[];
  packingList: PackingItem[];
  stories: StoryEntry[];
}

export type NotificationType = 
  | 'activity_upcoming' 
  | 'transit_departure' 
  | 'stop_approaching' 
  | 'safety_alert' 
  | 'booking_confirmed' 
  | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 
  | 'passenger' 
  | 'traveler'
  | 'driver' 
  | 'captain'
  | 'vehicle_owner' 
  | 'transport_company' 
  | 'family' 
  | 'admin'
  | 'super_admin';

export interface ParsedSMSResult {
  success: boolean;
  action: 'open_trip' | 'depart_trip' | 'arrive_trip' | 'mark_full' | 'road_alert' | 'unknown';
  message: string;
  messageAr: string;
  createdListing?: Partial<InterCityTripListing>;
  targetTripCode?: string;
  roadAlertText?: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  
  // Strict Phone Separation (Yemeni Numbers Only)
  phoneNumber?: string | null; // Backward compatibility
  primaryPhone?: string;       // هاتف الاتصال الأول - إجباري
  secondaryPhone?: string;     // هاتف الاتصال الثاني - اختياري
  whatsappPhone?: string;      // رقم واتساب الفعلي
  
  role: UserRole;
  roles?: UserRole[];          // Multi-role support (e.g. ['traveler', 'captain'])
  userType?: 'captain' | 'vehicle_owner' | 'traveler';
  isProfileComplete?: boolean; // إكمال البيانات الأساسية قبل الدخول للداشبورد
  
  governorate?: string;
  isDriverVerified?: boolean;
  isPhoneVerified?: boolean;
  vehicleModel?: string;
  plateNumber?: string;
  companyName?: string;
  rating?: number;
  totalTrips?: number;
  createdAt: string;
  
  // Multi-vehicle garage for individual drivers & vehicle owners
  registeredVehicles?: DriverVehicle[];
  activeVehicleId?: string;

  // Legal ID Document (Optional at onboarding, can be added anytime)
  idDocumentType?: 'national_id' | 'passport';
  idDocumentNumber?: string;
}

export interface AppChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'traveler' | 'captain' | 'vehicle_owner' | 'admin';
  senderPhone?: string;
  recipientId?: string; // 'admin' or target user
  text: string;
  timestamp: string;
  isFromAdmin: boolean;
  readByAdmin?: boolean;
  category?: 'general_inquiry' | 'captain_question' | 'trip_booking' | 'safety_inquiry' | 'faq_suggestion';
}

export interface FAQItem {
  id: string;
  questionAr: string;
  answerAr: string;
  targetAudience: 'all' | 'captains' | 'travelers';
  category: string;
}

export interface RoadPassAlert {
  id: string;
  passNameAr: string;
  passNameEn: string;
  route: string;
  status: 'open' | 'cautious' | 'fog_rain' | 'blocked_maintenance';
  statusLabelAr: string;
  reportedAt: string;
  descriptionAr: string;
  governorate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  scheduledTime?: string;
  timeRemainingMinutes?: number;
  targetTab?: 
    | 'overview' 
    | 'intercity_hub' 
    | 'fixed_plan' 
    | 'itinerary' 
    | 'map' 
    | 'driver_portal' 
    | 'admin_control'
    | 'bookings' 
    | 'expenses' 
    | 'documents' 
    | 'packing' 
    | 'stories';
  tripId?: string;
  activityId?: string;
  listingId?: string;
  locationName?: string;
  isRead: boolean;
}

// ==================== FLEET & TRANSPORT OFFICES ====================
export type OfficeSubscriptionTier = 'enterprise_large' | 'growth_medium' | 'starter_small' | 'free_trial';
export type OfficeSubscriptionStatus = 'active' | 'inactive' | 'expired' | 'pending_payment' | 'suspended';
export type OfficeCategory = 'large_company' | 'medium_office' | 'small_local_agency';

export interface FleetVehicle {
  id: string;
  model: string;
  type: 'sedan' | 'suv_4x4' | 'vip_limousine' | 'microbus' | 'large_bus';
  plateNumber: string;
  totalSeats: number;
  photoUrl: string;
  year: number;
  amenities: string[];
}

export interface OfficeBranch {
  id: string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  whatsapp?: string;
  workingHours?: string;
}

export interface TransportOffice {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  coverImage: string;
  taglineAr: string;
  taglineEn?: string;
  aboutAr: string;
  primaryGovernorate: string;
  phone: string;
  whatsapp: string;
  email?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  licenseNumber: string;
  establishedYear: number;
  features: string[];
  fleetGallery: string[];
  fleetVehicles: FleetVehicle[];
  branches: OfficeBranch[];

  // Subscriptions & Admin Controls
  officeCategory?: OfficeCategory; // شركة كبرى / مكتب متوسط / وكالة محلية صغيرة
  subscriptionTier?: OfficeSubscriptionTier; // الباقة (كبرى، متوسطة، صغيرة، تجريبية)
  subscriptionStatus?: OfficeSubscriptionStatus; // حالة الاشتراك (مفعل، محجوب، منتهي، معلق، قيد السداد)
  subscriptionStartDate?: string;
  subscriptionExpiresAt?: string;
  monthlyFeeYER?: number;
  isVisibleToPublic?: boolean; // حجب أو إظهار في التطبيق والسوق
  adminBlockReason?: string; // سبب الحجب الإداري إن وجد
  adminNotes?: string;
  totalBookingsProcessed?: number;
}

// ==================== AI SOCIAL MEDIA POSTS & MARKETING ====================
export type SocialCampaignType = 'driver_recruitment' | 'passenger_recruitment' | 'trip_announcement' | 'office_showcase';
export type SocialPlatform = 'instagram_post' | 'instagram_story' | 'facebook_feed' | 'whatsapp_broadcast' | 'twitter_x' | 'telegram_channel';
export type SocialCopyTone = 'authentic_yemeni' | 'professional_saas' | 'action_urgent' | 'family_safety';

export interface SocialPostGenerated {
  id: string;
  type: SocialCampaignType;
  title: string;
  headlineAr: string;
  bodyTextAr: string;
  callToActionAr: string;
  hashtags: string[];
  suggestedEmojis: string[];
  fullFormattedCaption: string;
  formattedWhatsAppMsg: string;
  facebookPostText?: string;
  twitterPostText?: string;
  telegramPostText?: string;
  visualTheme: {
    bgGradient: string;
    accentColor: string;
    badgeTextAr: string;
    cardSubheadAr: string;
  };
}

// ==================== LIVE ENCRYPTED TRACKING & ROAD NOTICES ====================
export type LocationSourceType = 'driver_phone' | 'passenger_phone' | 'checkpoint_sync';
export type RoadAlertReason = 'rain_floods' | 'maintenance_detour' | 'fog_low_visibility' | 'rock_slide' | 'rest_break' | 'road_clear';

export interface RoadConditionNotice {
  id: string;
  tripCode: string;
  reason: RoadAlertReason;
  titleAr: string;
  messageAr: string;
  cityOrPassAr: string;
  timestamp: string;
  isDetourActive: boolean;
  detourRouteNameAr?: string;
}

export interface LiveTripLocation {
  tripCode: string; // e.g. YEM-AD-MK-772
  sourceType: LocationSourceType;
  sourceName: string; // Name of Captain or Passenger broadcasting
  lat: number;
  lng: number;
  currentCityOrPassAr: string;
  nearestCheckpointAr?: string;
  nextScheduledStopAr?: string;
  lastUpdated: string;
  isBroadcasting: boolean;
  signalStatus: 'good_4g' | 'weak_3g' | 'offline_cached';
  activeRoadNotice?: RoadConditionNotice;
}

