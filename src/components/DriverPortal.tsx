import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { YEMEN_GOVERNORATES } from '../data/yemenData';
import { 
  Car, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  ArrowRightLeft, 
  Users, 
  Phone, 
  Bus, 
  Sparkles, 
  FileCheck2, 
  Award, 
  Clock, 
  MapPin,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { PlannedStop } from '../types/travel';

export const DriverPortal: React.FC = () => {
  const { lang, addIntercityListing, setActiveTab } = useTravel();

  const [activeTabSub, setActiveTabSub] = useState<'register' | 'why_join' | 'verification'>('register');
  const [successMessage, setSuccessMessage] = useState(false);

  // Form State
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverWhatsapp, setDriverWhatsapp] = useState('');
  const [operatorType, setOperatorType] = useState<'individual' | 'company'>('individual');
  const [companyName, setCompanyName] = useState('');
  
  const [fromGovernorate, setFromGovernorate] = useState('عدن');
  const [fromCity, setFromCity] = useState('الشيخ عثمان');
  const [toGovernorate, setToGovernorate] = useState('حضرموت');
  const [toCity, setToCity] = useState('المكلا');
  
  const [departureDate, setDepartureDate] = useState('2026-09-08');
  const [departureTime, setDepartureTime] = useState('07:00 صباحاً');
  const [estimatedHours, setEstimatedHours] = useState(6);
  const [tripNature, setTripNature] = useState<'outbound' | 'return_match'>('outbound');
  
  const [vehicleType, setVehicleType] = useState<'suv_4x4' | 'vip_limousine' | 'sedan' | 'microbus' | 'large_bus'>('suv_4x4');
  const [vehicleModel, setVehicleModel] = useState('تويوتا برادو / صالون');
  const [vehicleYear, setVehicleYear] = useState(2023);
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  
  const [totalSeats, setTotalSeats] = useState(4);
  const [allowSeatBooking, setAllowSeatBooking] = useState(true);
  const [allowFullCarBooking, setAllowFullCarBooking] = useState(true);
  const [pricePerSeat, setPricePerSeat] = useState(40000);
  const [priceFullCar, setPriceFullCar] = useState(150000);
  const [currency, setCurrency] = useState<'YER' | 'SAR' | 'USD'>('YER');
  
  const [hasMechanicalPass, setHasMechanicalPass] = useState(true);
  const [hasBackupCarCommitment, setHasBackupCarCommitment] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverPhone.trim()) return;

    const defaultStops: PlannedStop[] = [
      {
        id: `stop-${Date.now()}-1`,
        nameAr: `استراحة الطريق الأولى وتناول الطعام (${fromGovernorate})`,
        nameEn: 'First Route Rest Stop',
        type: 'rest_food',
        estimatedTime: '09:00',
        durationMinutes: 30,
        locationName: `${fromGovernorate} — نقطة وسطية`
      },
      {
        id: `stop-${Date.now()}-2`,
        nameAr: `استراحة صلاة وتزود بالوقود (${toGovernorate})`,
        nameEn: 'Fuel & Prayer Stop',
        type: 'prayer',
        estimatedTime: '12:00',
        durationMinutes: 20,
        locationName: `${toGovernorate} — مدخل`
      }
    ];

    const allowedModes: ('seat' | 'full_car')[] = [];
    if (allowSeatBooking) allowedModes.push('seat');
    if (allowFullCarBooking) allowedModes.push('full_car');
    if (allowedModes.length === 0) allowedModes.push('seat');

    addIntercityListing({
      driverName,
      driverPhone,
      driverWhatsapp: driverWhatsapp || driverPhone,
      driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      driverRating: 5.0,
      totalTripsCompleted: 1,
      isVerifiedDriver: true,
      hasMechanicalPass,
      hasBackupCarCommitment,
      operatorType,
      companyName: operatorType === 'company' ? companyName : undefined,
      fromGovernorate,
      fromCity,
      toGovernorate,
      toCity,
      departureDate,
      departureTime,
      estimatedDurationHours: Number(estimatedHours),
      tripNature,
      vehicleType,
      vehicleModel,
      vehicleYear: Number(vehicleYear),
      vehiclePlateNumber: vehiclePlateNumber || 'خصوصي معتمد',
      vehiclePhoto: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      airConditioned: true,
      luggageCapacityBags: 6,
      allowedBookingModes: allowedModes,
      availableSeats: Number(totalSeats),
      totalSeats: Number(totalSeats),
      pricePerSeat: Number(pricePerSeat),
      priceFullCar: Number(priceFullCar),
      currency,
      allowsFamilyTracking: true,
      familyTrackingCode: `YEM-${Math.floor(1000 + Math.random() * 9000)}`,
      notes,
      plannedStops: defaultStops
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setActiveTab('intercity_hub');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header / Value Proposition to Drivers & Fleets */}
      <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-900/30">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة السائقين والشركات — منصة سَفَر لشركاء النجاح' : 'Driver & Transport Companies Gateway'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {lang === 'ar'
              ? 'تطبيق سَفَر يضيف لك ولا يأخذ منك: ملء رحلات الراجع وزيادة دخلك مجاناً'
              : 'Traveler Adds to Your Business: Fill Return Seats & Grow Free of Charge'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {lang === 'ar'
              ? 'أصحاب السيارات الخاصة وشركات النقل (الرويشان، راحة، الأولى، البراق، النور، الليموزين): انضموا الآن بدون أي رسوم تسجيل. احصلوا على ركاب لرحلات الذهاب والراجع دون الحاجة للانتظار الطويل في الفرزات والفنادق.'
              : 'Join as a verified driver or fleet company. Free registration, instant passenger matching, and zero empty seats on return journeys.'}
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
        <button
          onClick={() => setActiveTabSub('register')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTabSub === 'register'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'تسجيل وإدراج رحلة جديدة' : 'Post New Trip'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('why_join')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTabSub === 'why_join'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مزايا الشراكة وحل مشكلة الراجع' : 'Benefits & Return Trips'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTabSub === 'verification'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'معايير الاعتماد وشارة الجودة' : 'Verification Badge Standards'}</span>
        </button>
      </div>

      {/* View 1: Register a New Trip Form */}
      {activeTabSub === 'register' && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'إضافة رحلة بين المحافظات (ذهاب أو راجع)' : 'Post Intercity Trip'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {lang === 'ar' ? 'سيتم عرض رحلتك فوراً للمسافرين في سوق الرحلات' : 'Your trip will be published live on the intercity market'}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              {lang === 'ar' ? 'مجاني 100%' : '100% Free'}
            </span>
          </div>

          {successMessage ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'تم نشر رحلتك بنجاح في سوق النقل!' : 'Trip Published Successfully!'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {lang === 'ar' ? 'جاري توجيهك إلى سوق الرحلات للاطلاع عليها...' : 'Redirecting to intercity hub...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Operator Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOperatorType('individual')}
                  className={`p-3 rounded-xl border text-start transition ${
                    operatorType === 'individual'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="text-xs">{lang === 'ar' ? 'سائق خاص / مالك سيارة' : 'Individual Car Owner / Driver'}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOperatorType('company')}
                  className={`p-3 rounded-xl border text-start transition ${
                    operatorType === 'company'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="text-xs">{lang === 'ar' ? 'شركة أو مكتب نقل جماعي' : 'Transport Company / Fleet'}</div>
                </button>
              </div>

              {/* Driver & Company Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'اسم السائق / الكابتن' : 'Driver Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: الكابتن / سالم باعباد' : 'e.g. Salem Ba-Abbad'}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+967 77X XXX XXX"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'رقم الواتساب للتواصل' : 'WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={driverWhatsapp}
                    onChange={(e) => setDriverWhatsapp(e.target.value)}
                    placeholder="+967 77X XXX XXX"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              {operatorType === 'company' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'اسم شركة النقل' : 'Company Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: شركة راحة للنقل البري' : 'e.g. Raha Transport'}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              )}

              {/* Route Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'من محافظة' : 'Origin Governorate'}
                  </label>
                  <select
                    value={fromGovernorate}
                    onChange={(e) => setFromGovernorate(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    {YEMEN_GOVERNORATES.map(g => (
                      <option key={g.id} value={g.nameAr}>{g.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'مدينة الانطلاق والفرزة' : 'Origin City/Terminal'}
                  </label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'إلى محافظة' : 'Destination Governorate'}
                  </label>
                  <select
                    value={toGovernorate}
                    onChange={(e) => setToGovernorate(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    {YEMEN_GOVERNORATES.map(g => (
                      <option key={g.id} value={g.nameAr}>{g.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'مدينة الوصول والنزول' : 'Destination City'}
                  </label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Timing & Trip Nature */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'تاريخ الانطلاق' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'وقت التحرك' : 'Departure Time'}
                  </label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="07:00 صباحاً"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'طبيعة الرحلة' : 'Trip Nature'}
                  </label>
                  <select
                    value={tripNature}
                    onChange={(e) => setTripNature(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  >
                    <option value="outbound">{lang === 'ar' ? 'رحلة ذهاب مجدولة' : 'Outbound Trip'}</option>
                    <option value="return_match">{lang === 'ar' ? '🔥 رحلة راجع (لتغطية المقاعد الشاغرة)' : 'Return Match'}</option>
                  </select>
                </div>
              </div>

              {/* Booking Modes Supported */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
                <label className="block text-xs font-bold text-stone-900 dark:text-white">
                  {lang === 'ar' ? 'طرق الحجز التي تقبلها في هذه الرحلة:' : 'Accepted Booking Methods:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowSeatBooking}
                      onChange={(e) => setAllowSeatBooking(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>{lang === 'ar' ? '💺 أقبل حجز أفراد (بالنفر / مقاعد مشتركة)' : 'Accept Per-Seat Bookings'}</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowFullCarBooking}
                      onChange={(e) => setAllowFullCarBooking(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>{lang === 'ar' ? '🚗 أقبل حجز سيارة كاملة (مشوار خاص)' : 'Accept Full Car Charters'}</span>
                  </label>
                </div>
              </div>

              {/* Vehicle & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'طراز السيارة' : 'Vehicle Model'}
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="تويوتا لاندكروزر برادو"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'سعر المقعد الفردي (بالنفر)' : 'Seat Price'}
                  </label>
                  <input
                    type="number"
                    disabled={!allowSeatBooking}
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'ar' ? 'سعر السيارة كاملة (خاص)' : 'Full Car Price'}
                  </label>
                  <input
                    type="number"
                    disabled={!allowFullCarBooking}
                    value={priceFullCar}
                    onChange={(e) => setPriceFullCar(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Safety & Backup Guarantees */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {lang === 'ar' ? 'التعهدات ومعايير السلامة الإلزامية:' : 'Driver Safety Commitment:'}
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasMechanicalPass}
                    onChange={(e) => setHasMechanicalPass(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>{lang === 'ar' ? 'أقر بأن المركبة خضعت للفحص الدوري (الإطارات، الفرامل، التكييف، التبريد)' : 'I confirm vehicle pre-check was passed'}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBackupCarCommitment}
                    onChange={(e) => setHasBackupCarCommitment(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>{lang === 'ar' ? 'ألتزم بتوفير مركبة بديلة معتمدة للركاب في حال حدوث أي عطل طارئ على الطريق' : 'I commit to backup car guarantee upon breakdown'}</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition"
                >
                  {lang === 'ar' ? 'نشر الرحلة في سوق النقل مجاناً' : 'Publish Trip Now'}
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* View 2: Why Join & Return Match Benefits */}
      {activeTabSub === 'why_join' && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {lang === 'ar' ? 'كيف يحل تطبيق سَفَر أكبر مشكلة تواجه السائقين وشركات النقل في اليمن؟' : 'Solving the 2-Sided Transportation Gap in Yemen'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {lang === 'ar'
                ? 'أغلب السائقين والشركات يضطرون للعودة بسيارات فارغة أو الانتظار لأيام في الفنادق بحثاً عن ركاب للعودة (الراجع). تطبيق سَفَر يوحد السوق في منصة واحدة ذكية.'
                : 'Most drivers face empty return trips or days of idle hotel waiting. Traveler matches return passengers with pre-screened cars.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'ملء رحلات الراجع (تحويل الخسارة لربح)' : 'Fill Return Trips'}
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'ar'
                  ? 'عند وصولك للمكلا أو صنعاء أو مأرب، يمكنك حجز ركاب رحلة العودة مسبقاً قبل وصولك بيوم كامل.'
                  : 'Pre-book return passengers before you even arrive at your destination.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'تسويق مجاني لأسطولك' : 'Free Fleet Exposure'}
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'ar'
                  ? 'عرض اسم شركتك أو سيارتك الخاصة لآلاف المسافرين يومياً عبر جميع المحافظات دون دفع أي عمولات في المرحلة الأولى.'
                  : 'Showcase your fleet directly to thousands of inter-city travelers without upfront listing fees.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                {lang === 'ar' ? 'بناء سمعة وشارة ثقة رقمية' : 'Digital Reputation & Trust'}
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'ar'
                  ? 'نظام التقييمات وشارة الفحص تمنحك أفضلية الحجز وتجذب العائلات والمسافرين الباحثين عن الأمان.'
                  : 'Customer ratings and verification badges attract premium family bookings.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Verification Standards */}
      {activeTabSub === 'verification' && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              {lang === 'ar' ? 'معايير فحص واعتماد السائقين والمركبات في سَفَر' : 'Verification Badge Standards'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              {lang === 'ar' ? 'الشروط المطلوبة للحصول على الشارة الذهبية للسائقين المعتمدين' : 'Requirements to obtain the verified driver badge'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                titleAr: '1. الهوية الوطنية ورخصة القيادة السارية',
                descAr: 'صورة واضحة لبطاقة الهوية ورخصة القيادة المعتمدة من الإدارة العامة للمرور.'
              },
              {
                titleAr: '2. وثائق ملكية المركبة والتأمين',
                descAr: 'استمارة تسيير المركبة سارية المفعول مع مطابقة رقم اللوحة المسجل.'
              },
              {
                titleAr: '3. الفحص الدوري والميكانيكي للسلامة',
                descAr: 'فحص الإطارات الاحتياطية، نظام الفرامل، تكييف الهواء، ومعدات الطوارئ ومثلث التحذير.'
              },
              {
                titleAr: '4. الالتزام بخطة المحطات الثابتة واتفاقية السيارة البديلة',
                descAr: 'الموافقة على التوقف في محطات الاستراحة المحددة مسبقاً وتوفير مركبة بديلة عند الطوارئ.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">{item.titleAr}</h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">{item.descAr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
