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
  Sparkles, 
  ArrowRightLeft, 
  ChevronRight, 
  Bus,
  Search,
  UserCheck,
  Crown,
  Info,
  Check
} from 'lucide-react';

export const IntercityHub: React.FC = () => {
  const { lang, intercityListings, bookIntercityListing, setActiveTab } = useTravel();

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

  const handleOpenBooking = (listing: InterCityTripListing, preferredMode: 'seat' | 'full' = 'seat') => {
    setSelectedListing(listing);
    // Check if the preferred mode is allowed
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'شبكة النقل والمشاوير بين المحافظات اليمنية' : 'Unified Yemeni Intercity Transit Network'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {lang === 'ar' 
              ? 'احجز مقعدك بالنفر أو اطلب سيارة كاملة خاصة لعائلتك'
              : 'Book Per Seat (Shared) or Reserve a Full Private Vehicle'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {lang === 'ar'
              ? 'طريقتان سهلتان ومباشرتان للسفر: باصات نقل جماعي وسيارات دفع رباعي تحجز بالنفر للأفراد، أو استئجار سيارة دفع رباعي صالون كاملة بخصوصية وأمان تام.'
              : 'Two direct booking styles: Shared seats on buses & 4x4s, or full private car charters with verified drivers, fixed stops, and family live tracking.'}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-amber-200 font-medium">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'ar' ? 'حجز أفراد بالنفر (باصات & صالون 4x4)' : 'Per-Seat Individual Bookings'}
            </span>
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-300" />
              {lang === 'ar' ? 'حجز سيارة كاملة خاصة للعائلات' : 'Full Private Vehicle Charter'}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              {lang === 'ar' ? 'فحص واعتماد والتزام بسيارة بديلة' : 'Verified & Backup Guarantee'}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Mode Quick Switcher Tabs */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{lang === 'ar' ? 'طريقة الحجز المطلوبة:' : 'Booking Method:'}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setBookingModeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              bookingModeFilter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <span>{lang === 'ar' ? 'جميع خيارات السفر' : 'All Options'}</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingModeFilter('seat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              bookingModeFilter === 'seat'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '💺 حجز بالنفر (مقاعد أفراد)' : '💺 Per Seat (Shared)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingModeFilter('full_car')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              bookingModeFilter === 'full_car'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '🚗 حجز سيارة كاملة (مشوار خاص)' : '🚗 Full Car (Private)'}</span>
          </button>
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
              <option value="suv_4x4">{lang === 'ar' ? 'دفع رباعي 4x4 (صالون / برادو / باترول)' : 'SUV 4x4 (Salon/Prado)'}</option>
              <option value="large_bus">{lang === 'ar' ? 'باص نقل جماعي كبير (راحة / النجم)' : 'Large Bus Fleet'}</option>
              <option value="microbus">{lang === 'ar' ? 'ميكروباص هايس مكيف' : 'Microbus HiAce'}</option>
              <option value="vip_limousine">{lang === 'ar' ? 'ليموزين / VIP فاخر' : 'VIP Limousine'}</option>
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
              className="w-full text-xs ps-9 pe-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
            {lang === 'ar' 
              ? `المعروض حالياً: ${filteredListings.length} رحلة نشطة` 
              : `${filteredListings.length} Active Trips Found`}
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

          return (
            <div
              key={listing.id}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden"
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

                    {listing.operatorType === 'company' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 flex items-center gap-1">
                        <Bus className="w-3 h-3" />
                        {listing.companyName || 'شركة نقل'}
                      </span>
                    )}

                    {isLargeBus && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                        {lang === 'ar' ? 'باص نقل جماعي (أفراد)' : 'Large Bus Fleet'}
                      </span>
                    )}

                    {listing.vehicleType === 'suv_4x4' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                        {lang === 'ar' ? 'دفع رباعي 4x4 صالون' : '4x4 SUV'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing Summary Box */}
                <div className="text-end shrink-0">
                  <div className="text-base font-black text-amber-600 dark:text-amber-400">
                    {listing.pricePerSeat.toLocaleString()} {listing.currency}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                    {lang === 'ar' ? 'سعر المقعد بالنفر' : 'per seat'}
                  </div>
                </div>
              </div>

              {/* Allowed Booking Modes Indicator Strip */}
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-700/60 text-xs">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {lang === 'ar' ? 'طرق الحجز المتاحة:' : 'Available Modes:'}
                </span>

                {allowsSeat && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200">
                    <span>💺 حجز بالنفر ({listing.pricePerSeat.toLocaleString()} {listing.currency})</span>
                  </span>
                )}

                {allowsFullCar ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200">
                    <span>🚗 سيارة كاملة خاصة ({listing.priceFullCar.toLocaleString()} {listing.currency})</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-600 dark:text-stone-300 font-normal">
                    {lang === 'ar' ? '(الحجز مخصص للأفراد بالنفر فقط)' : '(Per-seat only)'}
                  </span>
                )}
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
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {listing.departureDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
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
                  <span>{lang === 'ar' ? 'التزام بسيارة بديلة' : 'Backup Car Policy'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'خطة محطات واستراحات' : 'Fixed Rest Stops'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'كود تتبع أمان العائلة' : 'Family Live Track'}</span>
                </div>
              </div>

              {/* Capacity & Action Buttons */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'ar' 
                      ? `المتبقي: ${listing.availableSeats} من ${listing.totalSeats} مقاعد` 
                      : `${listing.availableSeats} of ${listing.totalSeats} seats left`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto w-full sm:w-auto justify-end">
                  {/* WhatsApp contact */}
                  <a
                    href={`https://wa.me/${listing.driverWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم، استفسار عن رحلة ${listing.fromGovernorate} إلى ${listing.toGovernorate} عبر تطبيق سَفَر`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                    title="مراسلة واتساب"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>

                  {/* Direct Call */}
                  <a
                    href={`tel:${listing.driverPhone}`}
                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition shadow-xs"
                    title="اتصال مباشر"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {/* Dual Action Buttons if both modes supported */}
                  {allowsFullCar ? (
                    <>
                      <button
                        onClick={() => handleOpenBooking(listing, 'seat')}
                        disabled={listing.availableSeats === 0}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                        title="احجز مقعد فردي بالنفر"
                      >
                        <span>{lang === 'ar' ? '💺 احجز بالنفر' : 'Per Seat'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenBooking(listing, 'full')}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                        title="احجز السيارة كاملة خاصة"
                      >
                        <span>{lang === 'ar' ? '🚗 سيارة كاملة' : 'Full Car'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenBooking(listing, 'seat')}
                      disabled={listing.availableSeats === 0}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                    >
                      <span>{lang === 'ar' ? '💺 احجز مقعد بالنفر' : 'Book Seat'}</span>
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
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-10 text-center border border-stone-200 dark:border-stone-700 space-y-3">
          <Car className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            {lang === 'ar' ? 'لا توجد رحلات تطابق خيارات البحث المحددة' : 'No trips match the current filter'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            {lang === 'ar' 
              ? 'جرب تغيير خيار الحجز (بالنفر / سيارة كاملة) أو اختيار محافظة أخرى، أو أضف رحلتك الخاصة كسائق من تبويب بوابة السائقين.'
              : 'Try switching the booking method or select another governorate.'}
          </p>
        </div>
      )}

      {/* Clear & Intuitive Booking Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'تأكيد حجز الرحلة' : 'Confirm Intercity Booking'}
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
                    ? `تم تسجيل الحجز بنجاح مع ${selectedListing.driverName}. تم إدراج تفاصيل الرحلة، السائق، المحطات الثابتة، ورمز التتبع العائلي (${selectedListing.familyTrackingCode}) في خطتك.`
                    : `Your booking with ${selectedListing.driverName} has been confirmed. Family tracking code: ${selectedListing.familyTrackingCode}`}
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
                
                {/* Trip Route Snapshot */}
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
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

                {/* Interactive Booking Mode Choice: Seat vs Full Car */}
                {(!selectedListing.allowedBookingModes || selectedListing.allowedBookingModes.includes('full_car')) && selectedListing.vehicleType !== 'large_bus' && selectedListing.priceFullCar > 0 ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      {lang === 'ar' ? 'اختر طريقة الحجز المطلوبة:' : 'Select Booking Mode:'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Per-Seat Option */}
                      <button
                        type="button"
                        onClick={() => setBookingType('seat')}
                        className={`p-3 rounded-xl border text-start transition relative ${
                          bookingType === 'seat'
                            ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold ring-2 ring-amber-500/20'
                            : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1">
                            <span>💺</span>
                            <span>{lang === 'ar' ? 'حجز بالنفر (مقعد فردي)' : 'Per-Seat'}</span>
                          </span>
                          {bookingType === 'seat' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className="text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                          {lang === 'ar' ? 'مقاعد مشتركة اقتصادية ومريحة' : 'Shared seats'}
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-black mt-1.5">
                          {selectedListing.pricePerSeat.toLocaleString()} {selectedListing.currency} <span className="text-[9px] font-normal">/ مقعد</span>
                        </div>
                      </button>

                      {/* Full Car Option */}
                      <button
                        type="button"
                        onClick={() => setBookingType('full')}
                        className={`p-3 rounded-xl border text-start transition relative ${
                          bookingType === 'full'
                            ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold ring-2 ring-amber-500/20'
                            : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1">
                            <span>🚗</span>
                            <span>{lang === 'ar' ? 'سيارة كاملة خاصة' : 'Full Car Charter'}</span>
                          </span>
                          {bookingType === 'full' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className="text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                          {lang === 'ar' ? 'خصوصية للعائلات والمشاوير الخاصة' : 'Private VIP charter'}
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-black mt-1.5">
                          {selectedListing.priceFullCar.toLocaleString()} {selectedListing.currency} <span className="text-[9px] font-normal">/ السيارة بالكامل</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Large bus or seat-only listing explanation */
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs">
                    <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-purple-600" />
                      <span>{lang === 'ar' ? 'حجز مقاعد أفراد بالنفر في باص نقل جماعي' : 'Per-Seat Large Bus Booking'}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                      {lang === 'ar'
                        ? 'هذه الرحلة مخصصة لحجز المقاعد الفردية للمسافرين بسعر اقتصادي ثابت للمقعد.'
                        : 'This service is designated for individual passenger per-seat bookings.'}
                    </p>
                  </div>
                )}

                {/* Seats count selector if seat mode */}
                {bookingType === 'seat' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'ar' ? 'عدد المقاعد المطلوبة (بالنفر):' : 'Number of Seats Required:'}
                    </label>
                    <select
                      value={seatsCount}
                      onChange={(e) => setSeatsCount(Number(e.target.value))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    >
                      {Array.from({ length: Math.min(selectedListing.availableSeats, 10) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {lang === 'ar' ? (num === 1 ? 'مقعد واحد' : num === 2 ? 'مقعدان' : `${num} مقاعد`) : 'Seats'} ({(num * selectedListing.pricePerSeat).toLocaleString()} {selectedListing.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Passenger details */}
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="bg-stone-100 dark:bg-stone-900 p-3.5 rounded-xl flex items-center justify-between text-xs border border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="font-bold text-stone-700 dark:text-stone-300 block">
                      {lang === 'ar' ? 'الإجمالي المطلوب دفعه:' : 'Total Cost:'}
                    </span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300">
                      {bookingType === 'full' 
                        ? (lang === 'ar' ? 'حجز سيارة كاملة خاصة' : 'Full car charter')
                        : (lang === 'ar' ? `حجز بالنفر (${seatsCount} مقاعد)` : `${seatsCount} seats`)}
                    </span>
                  </div>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {(bookingType === 'full' ? selectedListing.priceFullCar : selectedListing.pricePerSeat * seatsCount).toLocaleString()} {selectedListing.currency}
                  </span>
                </div>

                {/* Safety declaration acknowledgment */}
                <div className="text-[11px] text-stone-600 dark:text-stone-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ar'
                      ? 'يشمل الحجز خطة الاستراحات ومحطات الصلاة المعتمدة، والتزام السائق بتوفير سيارة بديلة فورية عند الطوارئ مع كود تتبع أمان العائلة.'
                      : 'Includes verified stops, backup car policy, and family safety live tracking code.'}
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
