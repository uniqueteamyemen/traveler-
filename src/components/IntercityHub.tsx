import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { InterCityTripListing } from '../types/travel';
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
  Filter, 
  Sparkles, 
  ArrowRightLeft, 
  ChevronRight, 
  Tag, 
  AlertCircle,
  Bus,
  Search
} from 'lucide-react';

export const IntercityHub: React.FC = () => {
  const { lang, intercityListings, bookIntercityListing, setActiveTab } = useTravel();

  const [fromGov, setFromGov] = useState<string>('all');
  const [toGov, setToGov] = useState<string>('all');
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

  const filteredListings = intercityListings.filter(item => {
    if (fromGov !== 'all' && !item.fromGovernorate.includes(fromGov)) return false;
    if (toGov !== 'all' && !item.toGovernorate.includes(toGov)) return false;
    if (tripTypeFilter !== 'all' && item.tripNature !== tripTypeFilter) return false;
    if (vehicleFilter !== 'all' && item.vehicleType !== vehicleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.fromGovernorate.toLowerCase().includes(q) ||
        item.toGovernorate.toLowerCase().includes(q) ||
        item.fromCity.toLowerCase().includes(q) ||
        item.toCity.toLowerCase().includes(q) ||
        item.driverName.toLowerCase().includes(q) ||
        (item.companyName && item.companyName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleOpenBooking = (listing: InterCityTripListing) => {
    setSelectedListing(listing);
    setBookingType('seat');
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Banner / Problem-Solution Headline */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'شبكة النقل الموحدة بين محافظات اليمن الـ 22' : 'Unified 22 Yemeni Governorates Transit Network'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {lang === 'ar' 
              ? 'سافر بين المحافظات براحة وأمان... بضغطة زر واحدة'
              : 'Travel between Yemeni Governorates Safely with One Click'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {lang === 'ar'
              ? 'نربط المسافرين بأصحاب السيارات وشركات النقل المعتمدة. خطة سير ثابتة، فحص مسبق، التزام بسيارة بديلة عند الأعطال، وتتبع مباشر لطمأنة العائلة.'
              : 'Direct connection between inter-city passengers, car owners, and bus fleets. Fixed planned routes, vehicle pre-checks, backup car guarantee, and family safety tracking.'}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-amber-200 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'ar' ? 'فحص واعتماد السائقين' : 'Verified Drivers & Cars'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              {lang === 'ar' ? 'خطة سير بمحطات محددة' : 'Fixed Journey Plan'}
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-sky-300" />
              {lang === 'ar' ? 'رحلات راجع بأسعار موفرة' : 'Return-Trip Seat Matches'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 sm:p-5 border border-stone-200 dark:border-stone-700 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Origin Governorate */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline text-amber-600 me-1" />
              {lang === 'ar' ? 'محافظة الانطلاق (من)' : 'Departure From'}
            </label>
            <select
              value={fromGov}
              onChange={(e) => setFromGov(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">{lang === 'ar' ? 'جميع المحافظات' : 'All Governorates'}</option>
              {YEMEN_GOVERNORATES.map(gov => (
                <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
              ))}
            </select>
          </div>

          {/* Destination Governorate */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline text-emerald-600 me-1" />
              {lang === 'ar' ? 'محافظة الوصول (إلى)' : 'Destination To'}
            </label>
            <select
              value={toGov}
              onChange={(e) => setToGov(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">{lang === 'ar' ? 'جميع الوجهات' : 'All Destinations'}</option>
              {YEMEN_GOVERNORATES.map(gov => (
                <option key={gov.id} value={gov.nameAr}>{gov.nameAr}</option>
              ))}
            </select>
          </div>

          {/* Trip Type Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 inline text-sky-600 me-1" />
              {lang === 'ar' ? 'نوع الرحلة' : 'Trip Nature'}
            </label>
            <select
              value={tripTypeFilter}
              onChange={(e) => setTripTypeFilter(e.target.value as any)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">{lang === 'ar' ? 'جميع الرحلات (ذهاب + راجع)' : 'All Trips'}</option>
              <option value="outbound">{lang === 'ar' ? 'رحلات الذهاب المجدولة' : 'Outbound Trips'}</option>
              <option value="return_match">{lang === 'ar' ? '🔥 رحلات الراجع (توفير ومقاعد شاغرة)' : 'Return-Trip Matches'}</option>
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
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">{lang === 'ar' ? 'جميع المركبات' : 'All Vehicles'}</option>
              <option value="suv_4x4">{lang === 'ar' ? 'دفع رباعي 4x4 (لاندكروزر / برادو)' : 'SUV 4x4'}</option>
              <option value="vip_limousine">{lang === 'ar' ? 'ليموزين / VIP فاخر' : 'VIP Limousine'}</option>
              <option value="microbus">{lang === 'ar' ? 'ميكروباص هايس مكيف' : 'Microbus HiAce'}</option>
              <option value="large_bus">{lang === 'ar' ? 'باص نقل جماعي كبير' : 'Large Bus'}</option>
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
              placeholder={lang === 'ar' ? 'ابحث بالمدينة، السائق، الشركة...' : 'Search city, driver, fleet...'}
              className="w-full text-xs ps-9 pe-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
            {lang === 'ar' 
              ? `المتاح حالياً: ${filteredListings.length} رحلة نشطة` 
              : `${filteredListings.length} Active Trips Found`}
          </div>
        </div>

      </div>

      {/* Trip Listings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredListings.map(listing => {
          const isReturn = listing.tripNature === 'return_match';
          return (
            <div
              key={listing.id}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Badge for Return Trip / Outbound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isReturn 
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40' 
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                  }`}>
                    {isReturn ? '🔥 رحلة راجع (مقاعد شاغرة)' : 'رحلة ذهاب مجدولة'}
                  </span>
                  {listing.operatorType === 'company' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 flex items-center gap-1">
                      <Bus className="w-3 h-3" />
                      {listing.companyName || 'شركة نقل'}
                    </span>
                  )}
                </div>

                <div className="text-end">
                  <div className="text-base font-black text-amber-600 dark:text-amber-400">
                    {listing.pricePerSeat.toLocaleString()} {listing.currency}
                  </div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-300">
                    {lang === 'ar' ? 'للمقعد الواحد' : 'per seat'}
                  </div>
                </div>
              </div>

              {/* Route Path Indicator */}
              <div className="bg-stone-50 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-700/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900" />
                    <span>{listing.fromGovernorate}</span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300 font-normal">({listing.fromCity})</span>
                  </div>
                  <span className="text-stone-400 text-xs px-2">➔</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900" />
                    <span>{listing.toGovernorate}</span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300 font-normal">({listing.toCity})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                    {listing.departureDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                    {listing.departureTime} (~{listing.estimatedDurationHours} {lang === 'ar' ? 'ساعات' : 'hrs'})
                  </span>
                </div>
              </div>

              {/* Driver & Vehicle Summary */}
              <div className="flex items-center gap-3">
                <img
                  src={listing.driverPhoto}
                  alt={listing.driverName}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {listing.driverName}
                    </h4>
                    {listing.isVerifiedDriver && (
                      <span title="سائق معتمد" className="inline-flex">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 truncate">
                    {listing.vehicleModel} • {listing.vehiclePlateNumber}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                    <span>★ {listing.driverRating}</span>
                    <span>• {listing.totalTripsCompleted} {lang === 'ar' ? 'رحلة سابقة' : 'trips'}</span>
                  </div>
                </div>
              </div>

              {/* Trust & Safety Features */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-700 dark:text-stone-300 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'فحص ميكانيكي مجتاز' : 'Inspection Passed'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'ضمان سيارة بديلة' : 'Backup Car Policy'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'خطة محطات مسبقة' : 'Fixed Rest Stops'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'مشاركة موقع العائلة' : 'Family Live Track'}</span>
                </div>
              </div>

              {/* Capacity & Action Buttons */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  <Users className="w-3.5 h-3.5 inline me-1 text-amber-600" />
                  <span>{lang === 'ar' ? `المتبقي: ${listing.availableSeats} مقاعد` : `${listing.availableSeats} seats left`}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${listing.driverWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم كابتن، بخصوص رحلة ${listing.fromGovernorate} إلى ${listing.toGovernorate} عبر تطبيق سَفَر`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                    title="مراسلة واتساب"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${listing.driverPhone}`}
                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition shadow-xs"
                    title="اتصال مباشر"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleOpenBooking(listing)}
                    disabled={listing.availableSeats === 0}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    <span>{lang === 'ar' ? 'حجز الرحلة' : 'Book Trip'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-10 text-center border border-stone-200 dark:border-stone-700 space-y-3">
          <Car className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            {lang === 'ar' ? 'لا توجد رحلات تطابق الفلاتر المحددة حالياً' : 'No trips match the current filter'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            {lang === 'ar' 
              ? 'جرب اختيار محافظة أخرى أو تصفح رحلات الراجع، أو أضف رحلتك الخاصة كسائق من تبويب بوابة السائقين.'
              : 'Try selecting a different governorate or post your own trip in the Driver Portal.'}
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'تأكيد حجز الرحلة المجدولة' : 'Confirm Intercity Booking'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold"
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
                    ? `تم تسجيل الحجز مع ${selectedListing.driverName} وإدراج الرحلة وخطة السير الثابتة في جدولك. رمز التتبع العائلي: ${selectedListing.familyTrackingCode}`
                    : `Your trip with ${selectedListing.driverName} has been booked. Family tracking code: ${selectedListing.familyTrackingCode}`}
                </p>
                
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setActiveTab('fixed_plan');
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    {lang === 'ar' ? 'عرض خطة السير وتتبع العائلة' : 'View Fixed Plan & Safety'}
                  </button>
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="px-4 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                
                {/* Route Snapshot */}
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center justify-between">
                    <span>{selectedListing.fromGovernorate} ➔ {selectedListing.toGovernorate}</span>
                    <span className="text-amber-700 dark:text-amber-400 font-black">
                      {selectedListing.departureDate} ({selectedListing.departureTime})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-300">
                    {selectedListing.driverName} • {selectedListing.vehicleModel}
                  </div>
                </div>

                {/* Booking Mode: Seat or Full Car */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {lang === 'ar' ? 'طبيعة الحجز المطلوبة' : 'Booking Mode'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingType('seat')}
                      className={`p-3 rounded-xl border text-start transition ${
                        bookingType === 'seat'
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="text-xs">{lang === 'ar' ? 'مقعد فردي (مشاركة)' : 'Single Seat'}</div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
                        {selectedListing.pricePerSeat.toLocaleString()} {selectedListing.currency}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingType('full')}
                      className={`p-3 rounded-xl border text-start transition ${
                        bookingType === 'full'
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="text-xs">{lang === 'ar' ? 'استئجار سيارة كاملة خاصة' : 'Full Car Charter'}</div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
                        {selectedListing.priceFullCar.toLocaleString()} {selectedListing.currency}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Seats counter if seat mode */}
                {bookingType === 'seat' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'عدد المقاعد المطلوبة' : 'Seats Count'}
                    </label>
                    <select
                      value={seatsCount}
                      onChange={(e) => setSeatsCount(Number(e.target.value))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    >
                      {Array.from({ length: selectedListing.availableSeats }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {lang === 'ar' ? 'مقعد' : 'Seats'} ({(num * selectedListing.pricePerSeat).toLocaleString()} {selectedListing.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Passenger details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'اسم المسافر الرئيسي' : 'Lead Passenger Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: أبو بكر عبد الرحمن' : 'e.g. Abobker Salem'}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    {lang === 'ar' ? 'الإجمالي المطلوب دفعه:' : 'Total Fare:'}
                  </span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {(bookingType === 'full' ? selectedListing.priceFullCar : selectedListing.pricePerSeat * seatsCount).toLocaleString()} {selectedListing.currency}
                  </span>
                </div>

                {/* Safety declaration acknowledgment */}
                <div className="text-[11px] text-stone-600 dark:text-stone-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ar'
                      ? 'يشمل هذا الحجز خطة التوقفات المعتمدة، والتزام السائق بتوفير سيارة بديلة عند الأعطال، مع تفعيل رمز تتبع مسار الرحلة لأفراد عائلتك.'
                      : 'Includes verified stops, backup vehicle commitment, and family safety tracking code.'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                  >
                    {lang === 'ar' ? 'تأكيد الحجز النهائي' : 'Confirm Booking'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
