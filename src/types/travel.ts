export type CurrencyCode = 'YER' | 'SAR' | 'USD' | 'AED' | 'EUR' | 'GBP';

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
  
  // Company or Individual
  operatorType: 'individual' | 'company';
  companyName?: string;
  companyLogo?: string;
  
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

export type UserRole = 'passenger' | 'driver' | 'transport_company' | 'family';

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  governorate?: string;
  isDriverVerified?: boolean;
  vehicleModel?: string;
  plateNumber?: string;
  companyName?: string;
  rating?: number;
  totalTrips?: number;
  createdAt: string;
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
