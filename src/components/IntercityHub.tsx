import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { InterCityTripListing, TransportOffice } from '../types/travel';
import { CompanyShowcaseModal } from './modals/CompanyShowcaseModal';
import { SocialMediaAutoPosterModal } from './modals/SocialMediaAutoPosterModal';
import { AboutPlatformModal } from './modals/AboutPlatformModal';
import { CustomTripRequestModal } from './modals/CustomTripRequestModal';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Users, 
  Sparkles, 
  ArrowRightLeft, 
  ChevronRight, 
  Bus,
  Search,
  UserCheck,
  Crown,
  Info,
  Check,
  Building2,
  Star,
  Share2,
  Layers,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export const IntercityHub: React.FC = () => {
  const { lang, intercityListings, transportOffices, bookIntercityListing, setActiveTab, userProfile } = useTravel();

  // Top Section Mode
  const [hubView, setHubView] = useState<'trips' | 'companies'>('trips');

  // Filter only visible & subscribed offices for the public directory
  const publicOffices = transportOffices.filter(o => o.isVisibleToPublic !== false && o.subscriptionStatus === 'active');

  // Filters
  const [fromGov, setFromGov] = useState<string>('all');
  const [toGov, setToGov] = useState<string>('all');
  const [bookingModeFilter, setBookingModeFilter] = useState<'all' | 'seat' | 'full_car'>('all');
  const [tripTypeFilter, setTripTypeFilter] = useState<'all' | 'outbound' | 'return_match'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking Modal State
  const [selectedListing, setSelectedListing] = useState<InterCityTripListing | null>(null);
  const [bookingType, setBookingType] = useState<'seat' | 'full'>('seat');
  const [seatsCount, setSeatsCount] = useState<number>(1);
  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerPhone, setPassengerPhone] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Company Showcase Modal State
  const [selectedOffice, setSelectedOffice] = useState<TransportOffice | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Social Auto-Poster Modal State
  const [socialPosterListing, setSocialPosterListing] = useState<InterCityTripListing | null>(null);
  const [socialPosterOffice, setSocialPosterOffice] = useState<TransportOffice | null>(null);
  const [isSocialPosterOpen, setIsSocialPosterOpen] = useState(false);
  const [socialCampaignType, setSocialCampaignType] = useState<'driver_recruitment' | 'trip_announcement'>('driver_recruitment');

  // Competitor parity modals: About Platform & Custom Trip Request
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCustomTripModalOpen, setIsCustomTripModalOpen] = useState(false);

  const handleSwapGovernorates = () => {
    if (fromGov === 'all' && toGov === 'all') return;
    const prevFrom = fromGov;
    const prevTo = toGov;
    setFromGov(prevTo);
    setToGov(prevFrom);
  };

  const filteredListings = intercityListings.filter(item => {
    if (fromGov !== 'all' && !item.fromGovernorate.includes(fromGov)) return false;
    if (toGov !== 'all' && !item.toGovernorate.includes(toGov)) return false;
    if (tripTypeFilter !== 'all' && item.tripNature !== tripTypeFilter) return false;
    if (vehicleFilter !== 'all' && item.vehicleType !== vehicleFilter) return false;
    
    // Booking mode filter
    if (bookingModeFilter === 'seat') {
      const allowsSeat = !item.allowedBookingModes || item.allowedBookingModes.includes('seat');
      if (!allowsSeat) return false;
    } else if (bookingModeFilter === 'full_car') {
      const allowsFull = item.allowedBookingModes 
        ? item.allowedBookingModes.includes('full_car')
        : (item.priceFullCar > 0 && item.vehicleType !== 'large_bus');
      if (!allowsFull) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.fromGovernorate.toLowerCase().includes(q) ||
        item.toGovernorate.toLowerCase().includes(q) ||
        item.fromCity.toLowerCase().includes(q) ||
        item.toCity.toLowerCase().includes(q) ||
        item.driverName.toLowerCase().includes(q) ||
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        item.vehicleModel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const availableCount = filteredListings.filter(item => item.availableSeats > 0).length;
  const fullCount = filteredListings.filter(item => item.availableSeats === 0).length;

  const handleOpenBooking = (listing: InterCityTripListing, preferredMode: 'seat' | 'full' = 'seat') => {
    setSelectedListing(listing);
    const allowsFull = listing.allowedBookingModes 
      ? listing.allowedBookingModes.includes('full_car')
      : (listing.priceFullCar > 0 && listing.vehicleType !== 'large_bus');
    
    if (preferredMode === 'full' && allowsFull) {
      setBookingType('full');
    } else {
      setBookingType('seat');
    }
    setSeatsCount(1);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !passengerName.trim() || !passengerPhone.trim()) return;

    bookIntercityListing(
      selectedListing,
      seatsCount,
      bookingType === 'full',
      passengerName,
      passengerPhone
    );

    setBookingSuccess(true);
  };

  const handleOpenOfficeDetails = (office: TransportOffice) => {
    setSelectedOffice(office);
    setIsCompanyModalOpen(true);
  };

  const handleOpenTripSocialPoster = (listing: InterCityTripListing) => {
    setSocialPosterListing(listing);
    setSocialPosterOffice(null);
    setSocialCampaignType('trip_announcement');
    setIsSocialPosterOpen(true);
  };

  const handleOpenRecruitmentSocialPoster = (office?: TransportOffice) => {
    setSocialPosterListing(null);
    setSocialPosterOffice(office || transportOffices[0] || null);
    setSocialCampaignType('driver_recruitment');
    setIsSocialPosterOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Action Triggers */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'المسافر — شبكة النقل اليمنية الكبرى' : 'Traveler — Grand Yemen Transit'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {lang === 'ar' ? 'حجز بالنفر • سيارة كاملة خاصة • أمان عائلي' : 'Seat Booking • Full Charter'}
              </span>
            </div>
            
            <h1 className="text-lg sm:text-2xl font-black tracking-tight">
              {lang === 'ar' 
                ? 'حجز الرحلات البرية ومكاتب النقل بين الـ 22 محافظة' 
                : 'Intercity Yemeni Transit & Fleet Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {lang === 'ar' 
                ? 'اختر بين حجز مقعدك بالنفر أو استئجار سيارة صالون كاملة VIP، وتصفح أكبر مكاتب وشركات النقل اليمنية المعتمدة مع توثيق الأمان والتتبع العائلي.' 
                : 'Book seats per passenger, charter private 4x4 salons, or connect with verified transport companies across Yemen.'}
            </p>
          </div>

          {/* Social Auto-Poster & Office Trigger Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenRecruitmentSocialPoster()}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-600/30 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{lang === 'ar' ? '📢 مولّد البوستات الذكي (AI Auto-Poster)' : 'AI Social Media Studio'}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('driver_portal')}
              className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'بوابة الكباتن وإدارة الأسطول' : 'Driver & Fleet Portal'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Active Trips vs Transport Offices */}
        <div className="flex items-center gap-2 pt-5 mt-4 border-t border-white/10">
          <button
            onClick={() => setHubView('trips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              hubView === 'trips'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{lang === 'ar' ? `جميع الرحلات المفتوحة (${filteredListings.length})` : `Open Trips (${filteredListings.length})`}</span>
          </button>

          <button
            onClick={() => setHubView('companies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              hubView === 'companies'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{lang === 'ar' ? `مكاتب وشركات النقل المعتمدة (${publicOffices.length})` : `Transport Companies (${publicOffices.length})`}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TRANSPORT OFFICES SHOWCASE (When hubView === 'companies') */}
      {hubView === 'companies' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>{lang === 'ar' ? 'دليل مكاتب وشركات النقل البري المعتمدة والمشتركة' : 'Verified Subscribed Transport Companies'}</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ar' ? 'شركات ومكاتب نشطة تمتلك أساطيل باصات وسيارات صالون حديثة وتغطي كافة المحافظات الـ 22' : 'Active licensed companies with modern fleets and branches'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('admin_control')}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'مسار الإدارة والاشتراكات' : 'Admin & Subscriptions'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicOffices.map(office => (
              <div
                key={office.id}
                className="bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-lg transition flex flex-col justify-between overflow-hidden group"
              >
                {/* Cover & Logo */}
                <div className="relative h-32 w-full bg-stone-900 overflow-hidden">
                  <img 
                    src={office.coverImage} 
                    alt={office.nameAr}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  
                  <div className="absolute bottom-3 start-3 end-3 flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={office.logo} 
                        alt={office.nameAr}
                        className="w-12 h-12 rounded-xl object-cover bg-white p-0.5 border border-amber-500 shadow-md"
                      />
                      <div className="text-white">
                        <div className="text-xs font-black leading-tight line-clamp-1">
                          {office.nameAr}
                        </div>
                        <div className="text-[10px] text-amber-300 font-semibold">
                          {office.primaryGovernorate}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 backdrop-blur-md">
                      <ShieldCheck className="w-3 h-3" />
                      <span>معتمد</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {office.aboutAr}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {office.fleetVehicles.slice(0, 2).map((v, i) => (
                        <span 
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                        >
                          🚗 {v.model}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-700 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{office.rating} ({office.reviewCount})</span>
                      </div>
                      <span>{office.branches.length} فروع بالمحافظات</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenOfficeDetails(office)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'بروفايل الشركة والأسطول' : 'View Company'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenRecruitmentSocialPoster(office)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition"
                        title="توليد بوست تسويقي لهذه الشركة"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE TRIPS & ADVANCED FILTERS (When hubView === 'trips') */}
      {hubView === 'trips' && (
        <div className="space-y-6">

          {/* Quick Action Banner Cards: Custom Trip Request & About Traveler Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Custom Trip Request */}
            <div 
              onClick={() => setIsCustomTripModalOpen(true)}
              className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/30 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'طلب رحلة مخصصة' : 'Request Custom Trip'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                      {lang === 'ar' ? 'مجاني 100%' : 'Free'}
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {lang === 'ar' ? 'أنشئ طلباً خاصاً إذا لم تجد رحلة مناسبة الآن' : 'Create a custom trip request if no ride fits'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-stone-400 group-hover:text-amber-500 transition shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </div>

            {/* Card 2: About Platform & Safety Policy */}
            <div 
              onClick={() => setIsAboutModalOpen(true)}
              className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-emerald-500/30 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'عن منصة المسافر' : 'About Traveler Platform'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {lang === 'ar' ? 'وسيط تقني' : 'Official'}
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {lang === 'ar' ? 'بيئة ذكية تربط الركاب بالسائقين بدون عمولات' : 'Independent tech intermediary with zero commissions'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-stone-400 group-hover:text-emerald-500 transition shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
              <div className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'حدد وجهتك والمسار' : 'Define Your Route'}</span>
              </div>

              {(fromGov !== 'all' || toGov !== 'all') && (
                <button
                  onClick={handleSwapGovernorates}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 transition"
                  title={lang === 'ar' ? 'تبديل المحافظتين' : 'Swap Governorates'}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'ar' ? 'تبديل المسار' : 'Swap'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* From Governorate */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'من (المحافظة)' : 'From Governorate'}
                </label>
                <select
                  value={fromGov}
                  onChange={(e) => setFromGov(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'ar' ? 'جميع المحافظات' : 'All Governorates'}</option>
                  {YEMEN_GOVERNORATES.map(gov => (
                    <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* To Governorate */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline text-emerald-600 me-1" />
                  {lang === 'ar' ? 'إلى (المحافظة)' : 'To Governorate'}
                </label>
                <select
                  value={toGov}
                  onChange={(e) => setToGov(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'ar' ? 'جميع المحافظات' : 'All Governorates'}</option>
                  {YEMEN_GOVERNORATES.map(gov => (
                    <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Booking Mode Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Users className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'طريقة الحجز' : 'Booking Mode'}
                </label>
                <select
                  value={bookingModeFilter}
                  onChange={(e) => setBookingModeFilter(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'ar' ? 'الكل (نفر + سيارة كاملة)' : 'All Options'}</option>
                  <option value="seat">{lang === 'ar' ? 'حجز مقعد بالنفر' : 'Seat Booking'}</option>
                  <option value="full_car">{lang === 'ar' ? 'حجز سيارة كاملة خاصة VIP' : 'Full Car Charter'}</option>
                </select>
              </div>

              {/* Trip Nature */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'نوع الرحلة' : 'Trip Nature'}
                </label>
                <select
                  value={tripTypeFilter}
                  onChange={(e) => setTripTypeFilter(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'ar' ? 'جميع الرحلات (ذهاب + راجع)' : 'All Trips'}</option>
                  <option value="outbound">{lang === 'ar' ? 'رحلات الذهاب المجدولة' : 'Outbound Trips'}</option>
                  <option value="return_match">{lang === 'ar' ? '🔥 رحلات الراجع الشاغرة' : 'Return Matches'}</option>
                </select>
              </div>

              {/* Vehicle Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <Car className="w-3.5 h-3.5 inline text-amber-600 me-1" />
                  {lang === 'ar' ? 'نوع المركبة' : 'Vehicle Class'}
                </label>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'ar' ? 'جميع المركبات' : 'All Vehicles'}</option>
                  <option value="suv_4x4">{lang === 'ar' ? 'دفع رباعي 4x4 صالون' : 'SUV 4x4'}</option>
                  <option value="large_bus">{lang === 'ar' ? 'باص نقل جماعي كبير' : 'Large Bus'}</option>
                  <option value="microbus">{lang === 'ar' ? 'ميكروباص هايس مكيف' : 'Microbus HiAce'}</option>
                  <option value="vip_limousine">{lang === 'ar' ? 'VIP ليموزين فاخر' : 'VIP Limousine'}</option>
                </select>
              </div>

            </div>

            {/* Text Search & Count */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-700/60">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute start-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث بالمدينة، السائق، الشركة، نوع السيارة...' : 'Search city, driver, vehicle...'}
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status count badges matching competitor parity */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 text-xs font-bold border border-stone-200 dark:border-stone-600">
                  <span>{lang === 'ar' ? `النتائج: ${filteredListings.length}` : `Results: ${filteredListings.length}`}</span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ar' ? `متاحة: ${availableCount}` : `Available: ${availableCount}`}</span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'ar' ? `مكتملة: ${fullCount}` : `Full: ${fullCount}`}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Trip Listings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredListings.map(listing => {
              const isReturn = listing.tripNature === 'return_match';
              const isLargeBus = listing.vehicleType === 'large_bus';
              const allowsFullCar = listing.allowedBookingModes 
                ? listing.allowedBookingModes.includes('full_car')
                : (listing.priceFullCar > 0 && !isLargeBus);
              const allowsSeat = !listing.allowedBookingModes || listing.allowedBookingModes.includes('seat');

              // Find matching transport office if exists
              const matchedOffice = transportOffices.find(
                o => o.id === listing.officeId || 
                (listing.companyName && o.nameAr.toLowerCase().includes(listing.companyName.toLowerCase()))
              );

              return (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Header Badges & Pricing Overview */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isReturn 
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40' 
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                        }`}>
                          {isReturn ? '🔥 رحلة راجع شاغرة' : 'رحلة مجدولة'}
                        </span>

                        {matchedOffice ? (
                          <button
                            onClick={() => handleOpenOfficeDetails(matchedOffice)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 flex items-center gap-1 hover:underline"
                          >
                            <Building2 className="w-3 h-3" />
                            <span>{matchedOffice.nameAr}</span>
                          </button>
                        ) : listing.operatorType === 'company' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 flex items-center gap-1">
                            <Bus className="w-3 h-3" />
                            {listing.companyName || 'شركة نقل'}
                          </span>
                        )}

                        {isLargeBus && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                            باص نقل جماعي
                          </span>
                        )}

                        {listing.vehicleType === 'suv_4x4' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                            صالون 4x4
                          </span>
                        )}
                      </div>

                      {/* Route Header */}
                      <div className="text-sm sm:text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400">{listing.fromGovernorate}</span>
                        <span className="text-stone-400 font-bold">{lang === 'ar' ? '←' : '➔'}</span>
                        <span className="text-amber-600 dark:text-amber-400">{listing.toGovernorate}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                        <span>{listing.fromCity}</span>
                        <span>•</span>
                        <span>{listing.toCity}</span>
                      </div>
                    </div>

                    {/* Pricing Box */}
                    <div className="text-start sm:text-end space-y-0.5 shrink-0">
                      {allowsSeat && (
                        <div>
                          <div className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                            {listing.pricePerSeat.toLocaleString()} {listing.currency}
                          </div>
                          <div className="text-[10px] text-stone-500">للمقعد بالنفر</div>
                        </div>
                      )}
                      {allowsFullCar && (
                        <div className="text-[11px] text-stone-600 dark:text-stone-300 font-semibold">
                          {listing.priceFullCar.toLocaleString()} {listing.currency} (سيارة كاملة)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date, Time & Seats Info Strip */}
                  <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 block">تاريخ الانطلاق</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{listing.departureDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">وقت التحرك</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{listing.departureTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">المقاعد المتبقية</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{listing.availableSeats} من {listing.totalSeats}</span>
                    </div>
                  </div>

                  {/* Driver, Car & Safety Guarantees */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Car className="w-4 h-4 text-amber-500" />
                        <span>{listing.vehicleModel}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>{listing.driverName}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-700/60">
                      {listing.airConditioned && <span className="text-emerald-600">✓ تكييف مركزي</span>}
                      {listing.hasMechanicalPass && <span className="text-emerald-600">✓ فحص ميكانيكي</span>}
                      {listing.hasBackupCarCommitment && <span className="text-emerald-600">✓ التزام بسيارة بديلة</span>}
                      <span className="text-amber-600 font-mono">كود الأمان: {listing.familyTrackingCode}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
                    {/* Social Auto-Poster Trigger Button */}
                    <button
                      onClick={() => handleOpenTripSocialPoster(listing)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition border border-amber-200 dark:border-amber-800/40"
                      title="توليد بوست وتصميم سوشيال ميديا فوري لهذه الرحلة"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'ar' ? '📢 نشر وتسويق ذكي' : 'AI Social Post'}</span>
                    </button>

                    {/* Booking Buttons */}
                    <div className="flex items-center gap-2">
                      {allowsFullCar && (
                        <button
                          onClick={() => handleOpenBooking(listing, 'full')}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-bold transition shadow-xs"
                        >
                          {lang === 'ar' ? '🚗 سيارة كاملة' : 'Full Car'}
                        </button>
                      )}

                      {allowsSeat && (
                        <button
                          onClick={() => handleOpenBooking(listing, 'seat')}
                          disabled={listing.availableSeats === 0}
                          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                        >
                          <span>{lang === 'ar' ? '💺 احجز بالنفر' : 'Book Seat'}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredListings.length === 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-10 text-center border border-stone-200 dark:border-stone-700 space-y-3">
              <Car className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {lang === 'ar' ? 'لا توجد رحلات تطابق خيارات البحث المحددة' : 'No trips match the current filter'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                {lang === 'ar' 
                  ? 'جرب اختيار محافظة أخرى أو فتح رحلة جديدة كسائق من بوابة الكباتن.' 
                  : 'Try selecting another governorate or add your trip.'}
              </p>
            </div>
          )}

        </div>
      )}

      {/* Booking Confirmation Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'تأكيد حجز الرحلة البرية' : 'Confirm Intercity Booking'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Booking Confirmed!'}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ar'
                    ? `تم تسجيل الحجز بنجاح مع ${selectedListing.driverName}. كود الأمان والتتبع العائلي الخاص برحلتك هو: (${selectedListing.familyTrackingCode}).`
                    : `Booking confirmed. Family tracking code: ${selectedListing.familyTrackingCode}`}
                </p>
                
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setActiveTab('fixed_plan');
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {lang === 'ar' ? 'عرض خطة السير وتتبع العائلة' : 'View Plan & Safety'}
                  </button>
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="px-4 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                
                {/* Trip Route Snapshot */}
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>{selectedListing.fromGovernorate}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{lang === 'ar' ? '←' : '➔'}</span>
                      <span>{selectedListing.toGovernorate}</span>
                    </div>
                    <span className="text-amber-700 dark:text-amber-400 font-black">
                      {selectedListing.departureDate} ({selectedListing.departureTime})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    المركبة: {selectedListing.vehicleModel} • الكابتن: {selectedListing.driverName}
                  </div>
                </div>

                {/* Booking Mode Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {lang === 'ar' ? 'اختر طريقة الحجز المطلوبة:' : 'Select Booking Mode:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingType('seat')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                        bookingType === 'seat'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      💺 حجز بالنفر (مقاعد)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('full')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                        bookingType === 'full'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      🚗 سيارة كاملة خاصة VIP
                    </button>
                  </div>
                </div>

                {bookingType === 'seat' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'عدد المقاعد المطلوبة:' : 'Number of seats:'}
                    </label>
                    <select
                      value={seatsCount}
                      onChange={(e) => setSeatsCount(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    >
                      {Array.from({ length: Math.min(6, selectedListing.availableSeats) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} {num > 1 ? 'مقاعد' : 'مقعد'}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'اسم المسافر الرئيسي' : 'Lead Passenger Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: أحمد عبد الله اليافعي' : 'e.g. Ahmed Salem'}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+967 77X XXX XXX"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="bg-stone-100 dark:bg-stone-900 p-3.5 rounded-2xl flex items-center justify-between text-xs border border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="font-bold text-stone-700 dark:text-stone-300 block">
                      {lang === 'ar' ? 'الإجمالي المطلوب دفعه:' : 'Total Cost:'}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {bookingType === 'full' ? 'حجز سيارة كاملة خاصة' : `حجز بالنفر (${seatsCount} مقاعد)`}
                    </span>
                  </div>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {(bookingType === 'full' ? selectedListing.priceFullCar : selectedListing.pricePerSeat * seatsCount).toLocaleString()} {selectedListing.currency}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                  >
                    {lang === 'ar' ? 'تأكيد الحجز النهائي' : 'Confirm Booking'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Company Showcase Profile Modal */}
      <CompanyShowcaseModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        office={selectedOffice}
        onOpenBookingForTrip={(listing) => handleOpenBooking(listing)}
        onOpenSocialPosterForOffice={(office) => handleOpenRecruitmentSocialPoster(office)}
      />

      {/* AI Social Media Auto-Poster Modal */}
      <SocialMediaAutoPosterModal
        isOpen={isSocialPosterOpen}
        onClose={() => setIsSocialPosterOpen(false)}
        initialListing={socialPosterListing}
        initialOffice={socialPosterOffice}
        initialCampaignType={socialCampaignType}
      />

      {/* About Traveler Platform Intermediary & Safety Modal */}
      <AboutPlatformModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Custom Trip Request Modal */}
      <CustomTripRequestModal
        isOpen={isCustomTripModalOpen}
        onClose={() => setIsCustomTripModalOpen(false)}
        defaultOrigin={fromGov !== 'all' ? fromGov : 'صنعاء'}
        defaultDestination={toGov !== 'all' ? toGov : 'عدن'}
      />

    </div>
  );
};
